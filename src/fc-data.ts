// The forecast in the shapes the drawings need, and the one way every
// surface writes a time and says what turns. Times follow the profile's
// language, 12- or 24-hour clock and time zone, as the card's own do.

import type { ForecastEntry } from './forecast-data';
import { cardLanguage, cardTimeZone, LocaleSource, useAmPm } from './localize';
import { buildForecastModel, ForecastDay } from './forecast-model';
import type { HomeAssistant } from './types';
import { HOUR, NB, Slot, Timeline, esc, hourIn, sameDay, sunModel, wetKind, WetKind } from './fc-core';
import { FcWords, fcWords, fill, hasFcWords } from './fc-words';

// ── Times ──────────────────────────────────────────────────────────────────
function format(hass: LocaleSource | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const amPm = useAmPm(hass);
    const full: Intl.DateTimeFormatOptions = { ...options, timeZone: cardTimeZone(hass) };
    if (amPm !== undefined) full.hourCycle = amPm ? 'h12' : 'h23';
    try { return new Intl.DateTimeFormat(cardLanguage(hass), full); }
    catch { return new Intl.DateTimeFormat('en', { ...full, timeZone: undefined }); }
}
/** A date in the profile's language and time zone, as every time on the card is */
export function dateText(date: Date, hass: LocaleSource | undefined, options: Intl.DateTimeFormatOptions): string {
    return format(hass, options).format(date);
}
const h12 = (hass?: LocaleSource): boolean => useAmPm(hass) ?? !!format(hass, { hour: 'numeric' }).resolvedOptions().hour12;

/**
 * A time's parts: "17", "05" and "" in 24 hours ("07" in English, as Home
 * Assistant writes it; "7" where the language does), "5", "05" and "PM"
 * in 12. bare: never a leading zero (the nightstand's "3:12").
 */
export function timeParts(date: Date, hass?: LocaleSource, { bare = false } = {}): { hour: string; minute: string; period: string } {
    const twelve = h12(hass);
    const parts = format(hass, { hour: twelve ? 'numeric' : '2-digit', minute: '2-digit' }).formatToParts(date);
    let hour = parts.find(p => p.type === 'hour')?.value ?? '';
    const minute = parts.find(p => p.type === 'minute')?.value ?? '';
    const period = twelve ? parts.filter(p => p.type === 'dayPeriod').map(p => p.value).join('') : '';
    if (bare) hour = String(Number(hour));
    return { hour, minute, period };
}
/** "17:00", "5:00 PM"; in a sentence a whole hour drops ":00" in 12 hours ("5 PM"). The period is its own span in HTML. */
export function timeText(date: Date, hass?: LocaleSource, { sentence = false, bare = false } = {}): string {
    const { hour, minute, period } = timeParts(date, hass, { bare });
    if (!period) return `${hour}:${minute}`;
    return `${sentence && minute === '00' ? hour : `${hour}:${minute}`}${NB}${period}`;
}
export function timeHtml(date: Date, hass?: LocaleSource, { sentence = false, bare = false } = {}): string {
    const { hour, minute, period } = timeParts(date, hass, { bare });
    if (!period) return `${hour}:${minute}`;
    return `${sentence && minute === '00' ? hour : `${hour}:${minute}`}<span class="awc-ampm">${esc(period)}</span>`;
}
/** "Wed", "Mi", "mer": the short day name, title case, no trailing dot */
export function dayName(date: Date, hass?: LocaleSource, width: 'short' | 'long' = 'short'): string {
    let name = '';
    try { name = new Intl.DateTimeFormat(cardLanguage(hass), { weekday: width, timeZone: cardTimeZone(hass) }).format(date); }
    catch { name = date.toDateString().slice(0, 3); }
    name = name.replace(/\.$/, '');
    return name.charAt(0).toLocaleUpperCase(cardLanguage(hass)) + name.slice(1);
}
/** "in 4 hr.", "in 30 min", "tomorrow": how far ahead a time is */
export function relative(ms: number, hass?: LocaleSource, unit: 'hour' | 'day' = 'hour'): string {
    try {
        const lang = cardLanguage(hass);
        if (unit === 'day') return new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(Math.round(ms / (24 * HOUR)), 'day');
        const r = new Intl.RelativeTimeFormat(lang, { numeric: 'always', style: 'short' });
        const min = Math.round(ms / 60000);
        if (min < 60) return r.format(Math.max(5, Math.round(min / 5) * 5), 'minute');
        return r.format(Math.round(min / 60), 'hour');
    } catch { return ''; }
}

// ── The hours ──────────────────────────────────────────────────────────────
export interface HourRow {
    i: number;
    date: Date;
    /** The label's parts: "17" or "5" and "PM" */
    hour: string;
    period: string;
    /** The first hour of a day: the day's name takes the hour's place */
    midnight: boolean;
    day: string;
    /** "17:00", "5:00 PM" */
    time: string;
    condition: string;
    isDay: boolean;
    temp: number | null;
    feels: number | null;
    chance: number | null;
    amount: number | null;
    entry: ForecastEntry;
}
const n = (v: unknown): number | null => (typeof v === 'number' && isFinite(v) ? v : null);

/** The hours ahead, the hour under way first. A metric the integration doesn't report is null. */
export function hours(slots: Slot[], hass?: HomeAssistant, count = 48): HourRow[] {
    const sun = sunModel(hass);
    return slots.slice(0, count).map((s, i) => {
        const { hour, period } = timeParts(s.at, hass);
        const mid = new Date(s.at.getTime() + HOUR / 2);
        return {
            i, date: s.at,
            hour: period ? String(Number(hour)) : hour, period,
            midnight: hourIn(s.at, hass) === 0,
            day: dayName(s.at, hass),
            time: timeText(s.at, hass),
            condition: s.condition ?? 'exceptional',
            isDay: s.is_daytime ?? sun(mid).elevation > -0.833,
            temp: n(s.temperature), feels: n(s.apparent_temperature),
            chance: n(s.precipitation_probability), amount: n(s.precipitation),
            entry: s,
        };
    });
}

/** Which of the four metrics a forecast can show */
export const METRICS = ['temp', 'feels', 'chance', 'amount'] as const;
export type Metric = typeof METRICS[number];
export function available(hourly: ForecastEntry[] | null): Record<Metric, boolean> {
    const h = hourly ?? [];
    const has = (key: keyof ForecastEntry) => h.some(e => typeof e[key] === 'number');
    return { temp: has('temperature'), feels: has('apparent_temperature'), chance: has('precipitation_probability'), amount: has('precipitation') };
}

// ── The days ───────────────────────────────────────────────────────────────
export interface Week {
    days: ForecastDay[];
    min: number;
    max: number;
    today: { high?: number; low?: number };
}
/** The days from today on the week's shared scale: the coldest low to the warmest high of the days shown */
export function week(daily: ForecastEntry[] | null, dailyType: 'daily' | 'twice_daily' | null, now: number, hass?: LocaleSource, { count = 7, current }: { count?: number; current?: number } = {}): Week {
    const model = buildForecastModel({ hourly: null, daily, dailyType: dailyType ?? 'daily', now, current, hass, dayCount: count });
    const lows = model.days.map(d => d.low ?? d.high).filter((v): v is number => v !== undefined);
    const highs = model.days.map(d => d.high ?? d.low).filter((v): v is number => v !== undefined);
    let min = lows.length ? Math.min(...lows) : 0, max = highs.length ? Math.max(...highs) : 1;
    if (max - min < 1) max = min + 1;
    return { days: model.days, min, max, today: model.today };
}
/** Today's high and low: the day's forecast widened to hold now, else today's hours */
export function highLow(daily: ForecastEntry[] | null, dailyType: 'daily' | 'twice_daily' | null, hourly: Slot[], now: number, current: number | undefined, hass?: LocaleSource): [number, number] | null {
    const w = week(daily, dailyType, now, hass, { count: 1, current });
    if (w.today.high !== undefined && w.today.low !== undefined) return [w.today.high, w.today.low];
    const today = hourly.filter(s => sameDay(s.at, new Date(now), hass)).map(s => s.temperature).filter((v): v is number => typeof v === 'number');
    if (today.length < 2) return null;
    const all = current !== undefined ? [...today, current] : today;
    return [Math.max(...all), Math.min(...all)];
}

// ── What turns ─────────────────────────────────────────────────────────────
export interface TurningLine {
    text: string;
    html: string;
    /** The short form ("Rain from 17:00"), whole when the long one won't fit */
    short: string;
    shortHtml: string;
    /** Without its noun, after a condition that already says it ("until 19:00"); null when it doesn't start with one */
    bareHtml: string | null;
    kind: WetKind | null;
    at?: Date;
    until?: Date;
}
const kindWord = (W: FcWords, k: WetKind) => W[k];
/** A time in a sentence: midnight is a word, not "00:00" */
function sentenceTime(d: Date, hass: LocaleSource | undefined, W: FcWords, html: boolean, bare: boolean): string {
    if (hourIn(d, hass) === 0 && d.getMinutes() === 0) return W.midnight;
    return html ? timeHtml(d, hass, { sentence: true, bare }) : timeText(d, hass, { sentence: true, bare });
}

/**
 * The turning line: the first change in what falls in the next 16 hours.
 *   dry now, wet later: "Rain from 17:00 to 19:00" (the end when it's within 12 h), short "Rain from 17:00"
 *   wet now: "Rain until 19:00", or "Rain all day"
 *   dry throughout: "Dry all day", or "Dry tonight" from 17:00
 *   days only: "Rain today", "Rain tomorrow", "Dry all day"
 * `tl` starts at the hour the line is read from (the needle's, or now).
 */
export function turningLine(tl: Timeline | null, hass?: LocaleSource, { bare = false }: { bare?: boolean } = {}): TurningLine | null {
    if (!tl || !tl.length) return null;
    const W = fcWords(hass);
    const now = new Date(tl.now);
    const hourNow = hourIn(now, hass);
    const evening = hourNow >= 17 || hourNow < 4;
    const T = (d: Date, html: boolean) => sentenceTime(d, hass, W, html, bare);
    const out = (o: Partial<TurningLine> & { text: string }): TurningLine => ({
        html: o.html ?? esc(o.text), short: o.short ?? o.text, shortHtml: o.shortHtml ?? o.html ?? esc(o.text), bareHtml: o.bareHtml ?? null, kind: o.kind ?? null, ...o,
    });
    if (tl.unit !== 'hour') {
        const [today, tomorrow] = tl.slots;
        const k0 = wetKind(today);
        if (k0) return out({ text: fill(W.k_today, { k: kindWord(W, k0) }), kind: k0 });
        const k1 = wetKind(tomorrow);
        if (k1) return out({ text: fill(W.k_tomorrow, { k: kindWord(W, k1) }), kind: k1 });
        return out({ text: evening ? W.dry_night : W.dry_day });
    }
    const ahead = tl.slots.slice(0, 16);
    const kindNow = wetKind(ahead[0]);
    if (kindNow) {
        const end = ahead.find(s => !wetKind(s));
        const K = kindWord(W, kindNow);
        if (!end) {
            const text = fill(evening ? W.all_night : W.all_day, { k: K });
            return out({ text, kind: kindNow, bareHtml: esc(evening ? W.all_night_bare : W.all_day_bare) });
        }
        return out({
            text: fill(W.until, { k: K, b: T(end.at, false) }), html: fill(W.until, { k: esc(K), b: T(end.at, true) }),
            bareHtml: fill(W.until_bare, { b: T(end.at, true) }), kind: kindNow, until: end.at,
        });
    }
    const i = ahead.findIndex(s => wetKind(s));
    if (i < 0) return out({ text: evening ? W.dry_night : W.dry_day });
    const start = ahead[i];
    const kind = wetKind(start)!;
    const K = kindWord(W, kind);
    const j = ahead.slice(i).findIndex(s => !wetKind(s));
    const end = j > 0 ? ahead[i + j] : null;
    const withinEnd = !!end && end.at.getTime() - tl.now <= 12 * HOUR;
    const long = (html: boolean) => fill(withinEnd ? W.from_to : W.from, { k: html ? esc(K) : K, a: T(start.at, html), b: end ? T(end.at, html) : '' });
    const short = (html: boolean) => fill(W.from, { k: html ? esc(K) : K, a: T(start.at, html) });
    return out({ text: long(false), html: long(true), short: short(false), shortHtml: short(true), kind, at: start.at, until: end?.at });
}

/** The condition's noun ("Rain", "Clear"), else Home Assistant's own name for it */
export function conditionNoun(condition: string, hass: LocaleSource | undefined, fallback: (c: string) => string): string {
    // Outside the nine languages, Home Assistant's translated name beats an English noun
    if (!hasFcWords(hass)) return fallback(condition);
    const W = fcWords(hass) as unknown as Record<string, string>;
    return Object.prototype.hasOwnProperty.call(W, condition) && typeof W[condition] === 'string' ? W[condition] : fallback(condition);
}
