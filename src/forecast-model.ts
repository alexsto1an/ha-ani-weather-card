// What the forecast says, put in the shape the drawings need: the hours
// still to come, the days from today (twice-daily halves joined into days),
// today's high and low, and the week's span for range bars. Pure, so the
// tests can check it, and shared by the card's forecast, the forecast card
// and the pop-up.

import { ForecastEntry, ForecastType } from './forecast-data';
import { dayKey, LocaleSource } from './localize';

const HOUR = 3600_000;

export interface ForecastDay {
    /** Noon-ish of the day, for its name */
    date: Date;
    /** The day's key in the card's time zone (YYYY-MM-DD) */
    key: string;
    isToday: boolean;
    condition?: string;
    high?: number;
    low?: number;
    /** Chance of rain or snow, % (the day's highest) */
    chance?: number;
    /** Amount, in the entity's unit */
    precipitation?: number;
    /** The day's own entry (or the day half, for twice daily) */
    entry: ForecastEntry;
}

export interface ForecastModel {
    /** Hourly entries from the one under way, oldest first */
    hours: ForecastEntry[];
    /** Days from today */
    days: ForecastDay[];
    /** Today's high and low: the daily forecast's, else worked out from the hours and now */
    today: { high?: number; low?: number };
    /** The coldest low and warmest high across the days shown, for range bars */
    span?: { min: number; max: number };
    /** Whether any hour or day says how likely rain is (Met.no's hourly doesn't) */
    hasChance: boolean;
}

export interface ModelInput {
    hourly: ForecastEntry[] | null;
    daily: ForecastEntry[] | null;
    dailyType: ForecastType | null;
    now: number;
    /** The reading now, which today's high and low must contain */
    current?: number;
    hass?: LocaleSource;
    /** How many days to keep (the span is measured across these) */
    dayCount?: number;
}

const num = (v: unknown): number | undefined => typeof v === 'number' && isFinite(v) ? v : undefined;
const time = (e: ForecastEntry) => Date.parse(e.datetime);

/** Days from today: daily entries as they are; twice-daily halves joined, the day half's condition first */
function joinDays(entries: ForecastEntry[], type: ForecastType | null, now: number, hass?: LocaleSource): ForecastDay[] {
    const todayKey = dayKey(new Date(now), hass);
    const byDay = new Map<string, ForecastEntry[]>();
    for (const e of [...entries].sort((a, b) => time(a) - time(b))) {
        if (isNaN(time(e))) continue;
        const key = dayKey(new Date(time(e)), hass);
        if (key < todayKey) continue;
        if (!byDay.has(key)) byDay.set(key, []);
        byDay.get(key)!.push(e);
    }
    return [...byDay.entries()].map(([key, list]) => {
        const day = type === 'twice_daily' ? list.find(e => e.is_daytime !== false) ?? list[0] : list[0];
        const temps = list.flatMap(e => [num(e.temperature), num(e.templow)]).filter((v): v is number => v !== undefined);
        const high = type === 'twice_daily'
            ? num(list.filter(e => e.is_daytime !== false).map(e => e.temperature).find(v => num(v) !== undefined)) ?? (temps.length ? Math.max(...temps) : undefined)
            : num(day.temperature);
        const low = type === 'twice_daily'
            ? num(list.filter(e => e.is_daytime === false).map(e => e.temperature).find(v => num(v) !== undefined)) ?? num(day.templow) ?? (temps.length > 1 ? Math.min(...temps) : undefined)
            : num(day.templow);
        const chances = list.map(e => num(e.precipitation_probability)).filter((v): v is number => v !== undefined);
        const amounts = list.map(e => num(e.precipitation)).filter((v): v is number => v !== undefined);
        return {
            date: new Date(time(day)),
            key,
            isToday: key === todayKey,
            condition: day.condition,
            high,
            low,
            chance: chances.length ? Math.max(...chances) : undefined,
            precipitation: amounts.length ? amounts.reduce((a, b) => a + b, 0) : undefined,
            entry: day,
        };
    });
}

export function buildForecastModel({ hourly, daily, dailyType, now, current, hass, dayCount = 7 }: ModelInput): ForecastModel {
    const hours = (hourly ?? [])
        .filter(e => !isNaN(time(e)) && time(e) + HOUR > now)
        .sort((a, b) => time(a) - time(b));
    const days = joinDays(daily ?? [], dailyType, now, hass).slice(0, dayCount);

    // Today's high and low: the day's forecast, widened to take in what it is
    // now (a forecast high of 18° reads wrong when it's 19° out). Only from a
    // day: the hours left can't know the morning's low, and a half-true low
    // is worse than none.
    const todayDay = days.find(d => d.isToday);
    let high = todayDay?.high;
    let low = todayDay?.low;
    if (current !== undefined) {
        if (high !== undefined) high = Math.max(high, current);
        if (low !== undefined) low = Math.min(low, current);
    }

    const lows = days.map(d => d.low ?? d.high).filter((v): v is number => v !== undefined);
    const highs = days.map(d => d.high ?? d.low).filter((v): v is number => v !== undefined);
    if (current !== undefined && todayDay) { lows.push(current); highs.push(current); }
    const span = lows.length && highs.length ? { min: Math.min(...lows), max: Math.max(...highs) } : undefined;

    const hasChance = hours.some(e => num(e.precipitation_probability) !== undefined) || days.some(d => d.chance !== undefined);
    return { hours, days, today: { high, low }, span, hasChance };
}

/** Wet, by the chance where there is one (40% or more), else by the amount, else by the condition's name */
export function isWet(entry: { precipitation_probability?: number; precipitation?: number; condition?: string }): boolean {
    const chance = num(entry.precipitation_probability);
    if (chance !== undefined) return chance >= 40;
    const amount = num(entry.precipitation);
    if (amount !== undefined) return amount >= 0.2;
    return /rain|pour|snow|hail|lightning|sleet/.test(entry.condition ?? '');
}
