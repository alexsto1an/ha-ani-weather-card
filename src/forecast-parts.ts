// The forecast's parts, in the card's own type: hour columns with a line
// that says only what falls and when it stops, day rows with a range bar,
// and today's high and low. The weather card's forecast, the forecast card
// and the pop-up put them together their own ways (forecast-views.ts).

import type { HomeAssistant } from './types';
import type { ForecastEntry } from './forecast-data';
import { ForecastDay, ForecastModel, isWet } from './forecast-model';
import { degrees, percent, dayLabel, conditionLabel } from './forecast-format';
import { cardTimeZone, formatHour, formatWeekday, localizeString, CardString } from './localize';
import { escapeHtml } from './utils';

const HOUR = 3600_000;
const num = (v: unknown): number | undefined => typeof v === 'number' && isFinite(v) ? v : undefined;
const time = (e: ForecastEntry) => Date.parse(e.datetime);

export type WetKind = 'storms' | 'hail' | 'snow' | 'sleet' | 'rain';

/** What falls, most severe first, from the conditions; rain when the condition doesn't say */
export function wetKind(conditions: (string | undefined)[]): WetKind {
    const all = conditions.join(' ');
    if (/lightning/.test(all)) return 'storms';
    if (/hail/.test(all)) return 'hail';
    if (/snowy-rainy/.test(all)) return 'sleet';
    if (/snowy/.test(all)) return 'snow';
    return 'rain';
}

/** The hour of day in the card's time zone */
export function hourOfDay(t: number, hass?: HomeAssistant): number {
    try {
        const hour = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone: cardTimeZone(hass) })
            .formatToParts(new Date(t)).find(p => p.type === 'hour')?.value;
        return Number(hour);
    } catch {
        return new Date(t).getHours();
    }
}

export interface HourWindow {
    start: number;
    /** The temperature at its start: a point, true to its label */
    temp?: number;
    condition?: string;
    wet: boolean;
    kind?: WetKind;
    /** The most severe wet condition in the window, when it's wet */
    wetCondition?: string;
    chance?: number;
    amount?: number;
    isDay: boolean;
    label: string;
}

/**
 * Columns of hours: `count` of them, `step` hours apart, from the next hour
 * on the step's grid at least 20 minutes ahead (the hour under way is the
 * hero's). Their labels change only every `step` hours, so the row stays
 * still. With `fromNow`, the first column is the hour under way ("Now").
 */
export function hourWindows(hours: ForecastEntry[], now: number, count: number, step: number, hass?: HomeAssistant, fromNow = false): HourWindow[] {
    if (!hours.length) return [];
    let start: number;
    if (fromNow) {
        start = Math.floor(now / HOUR) * HOUR;
    } else {
        start = Math.ceil((now + 20 * 60_000) / HOUR) * HOUR;
        for (let i = 0; i < 24 && hourOfDay(start, hass) % step !== 0; i++) start += HOUR;
    }
    const windows: HourWindow[] = [];
    let wasWet = false;
    for (let i = 0; i < count; i++) {
        const t = start + i * step * HOUR;
        const inside = hours.filter(e => time(e) >= t - HOUR / 2 && time(e) < t + step * HOUR - HOUR / 2);
        if (!inside.length) break;
        const at = inside.reduce((best, e) => Math.abs(time(e) - t) < Math.abs(time(best) - t) ? e : best, inside[0]);
        const chances = inside.map(e => num(e.precipitation_probability)).filter((v): v is number => v !== undefined);
        // Wet from 40%, and dry again only under 30%, so a 35% hour can't flicker the word on and off
        const wetOnes = inside.filter(e => {
            const p = num(e.precipitation_probability);
            return p !== undefined ? p >= (wasWet ? 30 : 40) : isWet(e);
        });
        wasWet = wetOnes.length > 0;
        const amounts = inside.map(e => num(e.precipitation)).filter((v): v is number => v !== undefined);
        windows.push({
            start: t,
            temp: num(at.temperature),
            condition: at.condition,
            wet: wetOnes.length > 0,
            kind: wetOnes.length ? wetKind(wetOnes.map(e => e.condition)) : undefined,
            wetCondition: wetOnes.length ? (wetOnes.find(e => /lightning/.test(e.condition ?? '')) ?? wetOnes.find(e => /pouring|snowy|hail/.test(e.condition ?? '')) ?? wetOnes.find(e => /rain/.test(e.condition ?? '')) ?? wetOnes[0]).condition : undefined,
            chance: chances.length ? Math.max(...chances) : undefined,
            amount: amounts.length ? amounts.reduce((a, b) => a + b, 0) : undefined,
            isDay: at.is_daytime ?? !/night/.test(at.condition ?? ''),
            // Midnight is the new day's name, which no "12 AM" or "00:00" says as well
            label: fromNow && i === 0 ? localizeString(hass, 'now')
                : hourOfDay(t, hass) === 0 ? formatWeekday(new Date(t), hass, 'short') : hourLabelFor(t, hass),
        });
    }
    return windows;
}

/** An hour's label: "3 PM" on a 12-hour clock, "15:00" on a 24-hour one (a lone "15" or "0" reads as a count) */
export function hourLabelFor(t: number, hass?: HomeAssistant): string {
    const twelve = /\s/.test(formatHour(new Date(t), hass));
    if (twelve) return formatHour(new Date(t), hass);
    const h = String(hourOfDay(t, hass)).padStart(2, '0');
    return `${h}:00`;
}

/** How many columns fit a width, and how many hours apart, so the row reaches at least 12 hours ahead */
export function columnsFor(width: number): { count: number; step: number } {
    const w = width > 0 ? width : 313;
    // A phone's 353 px column leaves 311–313 px inside: five columns
    const min = w >= 410 ? 62 : 54;
    const count = Math.max(4, Math.min(12, Math.floor((w + 8) / (min + 8))));
    return { count, step: Math.ceil(12 / count) };
}

/** A chance, rounded to the nearest 10% so it doesn't jitter from update to update */
const roundedChance = (chance: number | undefined) => chance === undefined ? undefined : Math.round(chance / 10) * 10;

export interface Token {
    /** Column it starts under, and how many it may run across */
    column: number;
    span: number;
    text: string;
    short: string;
    /** The chance alone, for a word that doesn't fit at all */
    chance?: string;
    wet: boolean;
}

/**
 * The what-falls line: a word where something starts to fall (the most
 * severe kind of the wet run, with its chance), "Dry" where it stops, and
 * "Dry" first when it's falling now but not in the first column. Dry hours
 * after dry hours say nothing.
 */
export function tokens(windows: HourWindow[], wetNow: boolean, hass?: HomeAssistant): Token[] {
    const found: Omit<Token, 'span'>[] = [];
    let i = 0;
    if (windows.length && wetNow && !windows[0].wet) {
        const dry = localizeString(hass, 'dry');
        found.push({ column: 0, text: dry, short: dry, wet: false });
    }
    while (i < windows.length) {
        if (!windows[i].wet) { i++; continue; }
        const run: HourWindow[] = [];
        const begin = i;
        while (i < windows.length && windows[i].wet) run.push(windows[i++]);
        const word = localizeString(hass, mostSevere(run));
        const chances = run.map(w => w.chance).filter((v): v is number => v !== undefined);
        const chance = roundedChance(chances.length ? Math.max(...chances) : undefined);
        found.push({ column: begin, text: chance !== undefined ? `${word} ${percent(chance, hass)}` : word, short: word, chance: chance !== undefined ? percent(chance, hass) : undefined, wet: true });
        if (i < windows.length) {
            const dry = localizeString(hass, 'dry');
            found.push({ column: i, text: dry, short: dry, wet: false });
        }
    }
    return found.map((token, n) => ({ ...token, span: (found[n + 1]?.column ?? windows.length) - token.column }));
}

const SEVERITY: WetKind[] = ['storms', 'hail', 'snow', 'sleet', 'rain'];
function mostSevere(run: HourWindow[]): CardString {
    const kinds = run.map(w => w.kind ?? 'rain');
    return SEVERITY.find(kind => kinds.includes(kind)) ?? 'rain';
}

/** A screen reader's sentence for an hour: "3 PM: 23°, Rainy, rain 80% chance" */
function hourSentence(w: HourWindow, hass?: HomeAssistant): string {
    const parts = [degrees(w.temp, hass), conditionLabel(w.condition, hass)];
    if (w.wet && w.chance !== undefined) parts.push(localizeString(hass, 'chance', { percent: percent(roundedChance(w.chance), hass) }));
    return `${w.label}: ${parts.filter(Boolean).join(', ')}`;
}

/** Hour columns: the label over the temperature, the what-falls line under them only where it has something to say */
export function hoursHtml(windows: HourWindow[], wetNow: boolean, hass?: HomeAssistant, className = ''): string {
    if (!windows.length) return '';
    const marks = tokens(windows, wetNow, hass);
    const cells = windows.map(w => `<li><span class="awc-visually-hidden">${escapeHtml(hourSentence(w, hass))}</span>`
        + `<span class="awc-hour-label" aria-hidden="true">${escapeHtml(w.label)}</span>`
        + `<span class="awc-hour-temp" aria-hidden="true">${escapeHtml(degrees(w.temp, hass))}</span></li>`).join('');
    const line = marks.map(t => `<li aria-hidden="true"><span class="awc-hour-token${t.wet ? '' : ' dry'}" style="grid-column: ${t.column + 1} / span ${t.span}" data-short="${escapeHtml(t.short)}"${t.chance ? ` data-chance="${escapeHtml(t.chance)}"` : ''}>${escapeHtml(t.text)}</span></li>`).join('');
    return `<ol class="awc-hours ${className}" style="--awc-cols: ${windows.length}" aria-label="${escapeHtml(localizeString(hass, 'next_hours'))}">${cells}${line}</ol>`;
}

/** A day's "what": the wet word and its chance at full strength, or Home Assistant's name for a dry day, in the tint */
function dayWhat(day: ForecastDay, hass?: HomeAssistant): { text: string; wet: boolean; short?: string } {
    if (isWet({ precipitation_probability: day.chance, precipitation: day.precipitation, condition: day.condition })) {
        const word = localizeString(hass, wetKind([day.condition]));
        const chance = roundedChance(day.chance);
        return { text: chance !== undefined ? `${word} ${percent(chance, hass)}` : word, wet: true, short: word };
    }
    return { text: conditionLabel(day.condition, hass), wet: false };
}

/** A range bar: the day's low to high on the days' shared span, with a dot for the reading now on today's */
export function barHtml(day: ForecastDay, span: ForecastModel['span'], current?: number): string {
    if (!span || day.low === undefined || day.high === undefined) return '<span class="awc-bar empty" aria-hidden="true"></span>';
    const range = span.max - span.min;
    const at = (v: number) => range > 0 ? Math.max(0, Math.min(100, ((v - span.min) / range) * 100)) : 0;
    const left = range > 0 ? at(day.low) : 0;
    const right = range > 0 ? 100 - at(day.high) : 0;
    const dot = day.isToday && current !== undefined ? `<b style="left: ${at(current).toFixed(1)}%"></b>` : '';
    return `<span class="awc-bar" aria-hidden="true"><i style="left: ${left.toFixed(1)}%; right: ${right.toFixed(1)}%"></i>${dot}</span>`;
}

/** Day rows: the name, what it does, the low, the range bar and the high */
export function daysHtml(days: ForecastDay[], model: ForecastModel, hass?: HomeAssistant, current?: number, className = ''): string {
    if (!days.length) return '';
    const rows = days.map(day => {
        const what = dayWhat(day, hass);
        const name = dayLabel(day.date, day.isToday, hass);
        const spoken = [
            day.isToday ? name : formatWeekday(day.date, hass, 'long'),
            conditionLabel(day.condition, hass),
            what.wet && day.chance !== undefined ? localizeString(hass, 'chance', { percent: percent(roundedChance(day.chance), hass) }) : '',
            day.low !== undefined ? `${localizeString(hass, 'low').toLowerCase()} ${degrees(day.low, hass)}` : '',
            day.high !== undefined ? `${localizeString(hass, 'high').toLowerCase()} ${degrees(day.high, hass)}` : '',
        ].filter(Boolean).join(', ');
        return `<li><span class="awc-visually-hidden">${escapeHtml(spoken)}</span>`
            + `<span class="awc-day-name" aria-hidden="true">${escapeHtml(name)}</span>`
            + `<span class="awc-day-what${what.wet ? '' : ' dry'}" aria-hidden="true"${what.short ? ` data-short="${escapeHtml(what.short)}"` : ''}>${escapeHtml(what.text)}</span>`
            + `<span class="awc-day-low" aria-hidden="true">${day.low !== undefined ? escapeHtml(degrees(day.low, hass)) : ''}</span>`
            + barHtml(day, model.span, current)
            + `<span class="awc-day-high" aria-hidden="true">${day.high !== undefined ? escapeHtml(degrees(day.high, hass)) : ''}</span></li>`;
    }).join('');
    return `<ol class="awc-days ${className}" aria-label="${escapeHtml(localizeString(hass, 'next_days'))}">${rows}</ol>`;
}

/** Today's high and low, as a line ("H 24°  L 15°") or a stack beside the temperature */
export function highLowHtml(today: ForecastModel['today'], hass?: HomeAssistant): string {
    const { high, low } = today;
    if (high === undefined && low === undefined) return '';
    const pair = (label: CardString, value: number | undefined) => value === undefined ? ''
        : `<span class="awc-hl-pair" aria-hidden="true"><span class="awc-hl-label">${escapeHtml(localizeString(hass, label))}</span>${escapeHtml(degrees(value, hass))}</span>`;
    const spoken = [
        high !== undefined ? `${localizeString(hass, 'high')} ${degrees(high, hass)}` : '',
        low !== undefined ? `${localizeString(hass, 'low').toLowerCase()} ${degrees(low, hass)}` : '',
    ].filter(Boolean).join(', ');
    return `${pair('high_short', high)}${pair('low_short', low)}<span class="awc-visually-hidden">${escapeHtml(spoken)}</span>`;
}

/**
 * The parts' styles. `theme` is the selector that means the theme palette
 * where they're used: the weather card's `.theme-colors`, the forecast
 * card's and the pop-up's own.
 */
export function partsCss(theme: string): string {
    return `
        .awc-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .awc-hours, .awc-days { list-style: none; margin: 0; padding: 0; }
        .awc-hours > li, .awc-days > li { display: contents; }

        /* Hours: equal columns, so the row is a true time axis */
        /* Its rows always held, the word line too, so rain arriving never moves the fit */
        .awc-hours {
          display: grid;
          grid-template-columns: repeat(var(--awc-cols, 5), minmax(0, 1fr));
          grid-template-rows: 14px 21px 16px;
          column-gap: 8px;
          row-gap: 2px;
        }
        .awc-hour-label {
          grid-row: 1;
          font-size: 11px;
          line-height: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
        }
        .awc-hour-temp {
          grid-row: 2;
          font-size: 16px;
          line-height: 21px;
          font-weight: 500;
          letter-spacing: -0.012em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .awc-hour-token {
          grid-row: 3;
          font-size: 13px;
          line-height: 16px;
          font-weight: 400;
          letter-spacing: -0.004em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
          padding-right: 12px;
        }

        /* Days: the bar a fixed share, the numbers anchored right, so the
           tinted low always ends clear of the light */
        .awc-days {
          display: grid;
          grid-template-columns: max-content minmax(0, 1fr) 4ch 34% 4ch;
          column-gap: 12px;
          row-gap: 6px;
          align-items: center;
        }
        .awc-hours + .awc-days { margin-top: 12px; }
        .awc-day-name { font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.006em; white-space: nowrap; }
        .awc-day-what { font-size: 13px; line-height: 18px; font-weight: 400; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        .awc-day-what.dry { opacity: var(--awc-secondary, 0.8); }
        .awc-day-low, .awc-day-high { font-size: 15px; line-height: 20px; font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
        .awc-day-low { font-weight: 400; opacity: var(--awc-secondary, 0.8); }
        .awc-day-high { font-weight: 500; }
        /* The track: the hairline's strength, drawn with opacity (older
           WebViews have no color-mix) */
        .awc-bar { position: relative; height: 4px; border-radius: 2px; }
        .awc-bar::before { content: ''; position: absolute; inset: 0; border-radius: 2px; background: currentColor; opacity: 0.2; }
        .awc-bar.empty::before { display: none; }
        .awc-bar > i { position: absolute; inset-block: 0; min-width: 6px; border-radius: 2px; background: currentColor; opacity: 0.8; }
        .awc-bar > b {
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 2px var(--awc-sky-mid, transparent);
        }

        /* Today's high and low */
        .awc-hl-pair { white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-hl-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-right: 3px; }

        ${theme} :is(.awc-hour-label, .awc-hour-token.dry, .awc-day-what.dry, .awc-day-low, .awc-hl-label) { color: var(--secondary-text-color); }
        ${theme} .awc-bar::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
        ${theme} .awc-bar > i { background: var(--primary-color); opacity: 1; }
        ${theme} .awc-bar > b { background: var(--primary-text-color); box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)); }
    `;
}

/**
 * Fit the words to their room, once laid out: a wet word that doesn't fit
 * loses its chance (the ellipsis is the last resort), and a dry day's name
 * goes whole rather than be cut. Screen readers have the whole sentence
 * either way.
 */
export function fitWords(root: HTMLElement): void {
    for (const el of Array.from(root.querySelectorAll<HTMLElement>('.awc-hour-token, .awc-day-what'))) {
        el.dataset.full ??= el.textContent ?? '';
        el.textContent = el.dataset.full;
        el.style.visibility = '';
        // Strict: a text one pixel too wide already shows its ellipsis
        if (el.scrollWidth <= el.clientWidth) continue;
        if (el.classList.contains('awc-day-what') && el.classList.contains('dry')) {
            el.style.visibility = 'hidden';
            continue;
        }
        const short = el.dataset.short;
        if (short) el.textContent = short;
        if (el.scrollWidth > el.clientWidth && el.dataset.chance) el.textContent = el.dataset.chance;
    }
}
