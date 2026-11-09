// The line: the next hours' temperature drawn across the sky, in the sun
// tracker's drawing language (a 2.25 px stroke, dotted after dark, a faint
// now-line, a glowing dot for now). Labels only where the line has something
// to say: the high, the low, when the rain starts and stops, the window's
// end. Rain is texture between the line and the ground, never an icon and
// never colour alone. Shared by the weather card's forecast, the forecast
// card and the pop-up (forecast-views.ts).

import type { HomeAssistant, HassEntity } from './types';
import type { ForecastEntry } from './forecast-data';
import { degrees, percent } from './forecast-format';
import { hourLabelFor, hourOfDay } from './forecast-parts';
import { formatWeekday, localizeString, timeHtml, CardString } from './localize';
import { escapeHtml, formatLocalizedNumber } from './utils';

const HOUR = 3600_000;
const num = (v: unknown): number | undefined => typeof v === 'number' && isFinite(v) ? v : undefined;
const time = (e: ForecastEntry) => Date.parse(e.datetime);

export interface Lanes {
    /** Labels above the line */
    top: number;
    gap: number;
    /** The line's travel */
    amp: number;
    /** Labels below the line */
    bottom: number;
}

export interface LineOptions {
    hass?: HomeAssistant;
    hours: ForecastEntry[];
    now: number;
    current?: number;
    unit: string;
    /** The plot's width in px; x = 0 is now */
    width: number;
    windowHours: number;
    lanes: Lanes;
    /** Where the ground sits below the section's bottom edge (the card's divider), or 0 for its own hairline */
    groundBelow: number;
    sun?: HassEntity;
    /** The now dot's size, by day and by night */
    dot: [number, number];
    /** How many rain bands get a label */
    maxBands: number;
    /** Append the chance (or amount) to a band's label */
    bandDetail: boolean;
    /** Size class for the labels: 'sm' (13/15 px) or 'lg' (15/22 px) */
    size: 'sm' | 'lg';
    /** Hour labels along the ground (forecast card, pop-up) */
    axis?: boolean;
    /** Warm glows on the ground at sunrise and sunset (the forecast card and pop-up only) */
    twilight?: boolean;
    /** The high's and low's times beside their values (default true; the strip has no room) */
    extremeTimes?: boolean;
    /** Leave the first rain band unlabelled: a headline already says it */
    skipFirstBand?: boolean;
    /** No window-end label (the strip) */
    noEnd?: boolean;
}

interface Point { t: number; v: number; entry?: ForecastEntry }

/** Fritsch–Carlson: a smooth curve that never overshoots, so the drawn high is the data's high */
export function monotonePath(points: { x: number; y: number }[]): string {
    const n = points.length;
    if (n === 0) return '';
    if (n === 1) return `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    const dx: number[] = [];
    const slope: number[] = [];
    for (let i = 0; i < n - 1; i++) {
        dx.push(points[i + 1].x - points[i].x);
        slope.push((points[i + 1].y - points[i].y) / (dx[i] || 1));
    }
    const tangent: number[] = [slope[0]];
    for (let i = 1; i < n - 1; i++) {
        tangent.push(slope[i - 1] * slope[i] <= 0 ? 0 : (slope[i - 1] + slope[i]) / 2);
    }
    tangent.push(slope[n - 2]);
    for (let i = 0; i < n - 1; i++) {
        if (slope[i] === 0) { tangent[i] = 0; tangent[i + 1] = 0; continue; }
        const a = tangent[i] / slope[i];
        const b = tangent[i + 1] / slope[i];
        const h = a * a + b * b;
        if (h > 9) {
            const k = 3 / Math.sqrt(h);
            tangent[i] = k * a * slope[i];
            tangent[i + 1] = k * b * slope[i];
        }
    }
    let d = `M${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
        const p = points[i];
        const q = points[i + 1];
        const third = dx[i] / 3;
        d += ` C${(p.x + third).toFixed(1)},${(p.y + tangent[i] * third).toFixed(1)} ${(q.x - third).toFixed(1)},${(q.y - tangent[i + 1] * third).toFixed(1)} ${q.x.toFixed(1)},${q.y.toFixed(1)}`;
    }
    return d;
}

/** Day and night across the window, from the sun's next rising and setting (a day later, they're a couple of minutes off) */
export function dayIntervals(sun: HassEntity | undefined, from: number, to: number): [number, number][] | null {
    const rise = Date.parse(sun?.attributes?.next_rising ?? '');
    const set = Date.parse(sun?.attributes?.next_setting ?? '');
    if (isNaN(rise) || isNaN(set)) return null;
    const DAY = 24 * HOUR;
    const up = sun?.state !== 'below_horizon';
    const days: [number, number][] = [];
    // The day under way ends at the next setting; at night, the next day starts at the next rising
    let r = up ? from : rise;
    let s = up ? set : (set > rise ? set : set + DAY);
    for (let i = 0; i < 8 && r < to; i++) {
        if (s > r) days.push([Math.max(from, r), Math.min(to, s)]);
        r = up && i === 0 ? rise : r + DAY;
        s += DAY;
    }
    return days;
}

type Kind = 'rain' | 'snow' | 'sleet' | 'storms';
type Density = 'light' | 'moderate' | 'heavy';
const WET = /rainy|pouring|lightning-rainy|snowy|snowy-rainy|hail/;

function wetHour(e: ForecastEntry): boolean {
    const p = num(e.precipitation_probability);
    if (p !== undefined) return p >= 50 || (WET.test(e.condition ?? '') && p >= 30);
    const amount = num(e.precipitation);
    if (amount !== undefined) return amount >= 0.1;
    return WET.test(e.condition ?? '');
}

function kindOf(e: ForecastEntry): Kind {
    const c = e.condition ?? '';
    if (/lightning/.test(c)) return 'storms';
    if (c === 'snowy') return 'snow';
    if (/snowy-rainy|hail/.test(c)) return 'sleet';
    if (WET.test(c)) return 'rain';
    const t = num(e.temperature);
    return t !== undefined && t <= 0 ? 'snow' : t !== undefined && t <= 2 ? 'sleet' : 'rain';
}

function densityOf(e: ForecastEntry): Density {
    const amount = num(e.precipitation);
    if (amount !== undefined && amount > 0) return amount >= 4 ? 'heavy' : amount >= 1 ? 'moderate' : 'light';
    const p = num(e.precipitation_probability);
    if (p !== undefined) return p >= 70 ? 'moderate' : 'light';
    return e.condition === 'pouring' ? 'heavy' : e.condition === 'rainy' ? 'moderate' : 'light';
}

const PITCH: Record<Density, [number, number, number]> = { light: [7, 11, 0.35], moderate: [5, 9, 0.55], heavy: [3.5, 7, 0.7] };

/** The texture for a kind and density: streaks for rain, dots for snow, both for sleet */
function patternDefs(prefix: string): string {
    const out: string[] = [];
    for (const [density, [px, py]] of Object.entries(PITCH) as [Density, [number, number, number]][]) {
        const streak = (x: number, y: number) => `<rect x="${x}" y="${y}" width="1" height="5" rx="0.5"/>`;
        const dot = (x: number, y: number) => `<circle cx="${x + 1}" cy="${y + 1}" r="1"/>`;
        out.push(`<pattern id="${prefix}-rain-${density}" width="${px}" height="${py * 2}" patternUnits="userSpaceOnUse">${streak(0, 0)}${streak(px / 2, py)}</pattern>`);
        out.push(`<pattern id="${prefix}-snow-${density}" width="${px + 1}" height="${(py + 1) * 2}" patternUnits="userSpaceOnUse">${dot(0, 0)}${dot((px + 1) / 2, py + 1)}</pattern>`);
        out.push(`<pattern id="${prefix}-sleet-${density}" width="${px + 1}" height="${(py + 1) * 2}" patternUnits="userSpaceOnUse">${streak(0, 0)}${dot((px + 1) / 2, py + 1)}</pattern>`);
    }
    return out.join('');
}

export interface Band { start: number; end: number; kind: Kind; chance?: number; amount?: number }

/** Runs of wet hours from now to `end`, a single dry hour inside one bridged; one under way starts now */
export function wetBands(hours: ForecastEntry[], now: number, end: number): Band[] {
    const bands: Band[] = [];
    const wet = hours.filter(e => !isNaN(time(e)) && time(e) + HOUR > now && time(e) < end && wetHour(e));
    for (const e of wet) {
        const t = Math.max(now, time(e));
        const lastBand = bands[bands.length - 1];
        const kind = kindOf(e);
        const chance = num(e.precipitation_probability);
        const amount = num(e.precipitation);
        if (lastBand && t - lastBand.end <= HOUR + 60_000) {
            lastBand.end = time(e) + HOUR;
            if (kind === 'storms' || (kind === 'snow' && lastBand.kind === 'rain')) lastBand.kind = kind;
            if (chance !== undefined) lastBand.chance = Math.max(lastBand.chance ?? 0, chance);
            if (amount !== undefined) lastBand.amount = (lastBand.amount ?? 0) + amount;
        } else {
            bands.push({ start: t, end: time(e) + HOUR, kind, chance, amount });
        }
    }
    return bands;
}

/** When a band happens, in words: "5–8 PM", "from 5 PM" (it runs past the window), "until 8 PM" (it's under way) */
export function bandWhen(band: Band, now: number, end: number, hass?: HomeAssistant): string {
    if (band.start <= now + 60_000) return localizeString(hass, 'until_time', { time: hourLabelFor(band.end, hass) });
    if (band.end > end) return localizeString(hass, 'from_time', { time: hourLabelFor(band.start, hass) });
    return rangeText(band.start, band.end, hass);
}

/** What the kind of weather is called: Rain, Snow, Sleet, Storms */
export const kindWord = (kind: Kind, hass?: HomeAssistant) => localizeString(hass, kind as CardString);

/** A band's time range, sharing the day period when it can ("5–8 PM"), 24-hour "17:00–20:00" */
function rangeText(start: number, end: number, hass?: HomeAssistant): string {
    const a = hourLabelFor(start, hass);
    const b = hourLabelFor(end, hass);
    const [, aNum, aPeriod] = a.match(/^(.*?)\s*([^\d\s:]+\.?\s?[^\d\s:]*)?$/) ?? [];
    const [, bNum, bPeriod] = b.match(/^(.*?)\s*([^\d\s:]+\.?\s?[^\d\s:]*)?$/) ?? [];
    if (aPeriod && bPeriod && aPeriod === bPeriod) return `${aNum}–${bNum} ${bPeriod}`;
    return `${a}–${b}`;
}

/** Text width, measured with the page's own font where a canvas is there, else estimated */
let measurer: CanvasRenderingContext2D | null | undefined;
export function textWidth(text: string, px: number, weight: number): number {
    if (measurer === undefined) {
        try { measurer = document.createElement('canvas').getContext('2d'); } catch { measurer = null; }
    }
    if (measurer) {
        measurer.font = `${weight} ${px}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, "Segoe UI", system-ui, sans-serif`;
        const w = measurer.measureText(text).width;
        if (w > 0) return w;
    }
    return text.length * px * 0.56;
}

interface Label { lane: 'top' | 'bottom'; x: number; w: number; html: string; text: string; required?: boolean; align: 'start' | 'center' | 'end'; alt?: () => Label | null; shorter?: () => Label | null }

export interface Line {
    html: string;
    summary: string;
    /** A label it couldn't do without (the first rain band's, else an extreme) had no room */
    requiredDropped: boolean;
    height: number;
    /** Where a time and a temperature are on the plot, for a scrubber over it */
    x?: (t: number) => number;
    y?: (v: number) => number;
    /** The ground's y */
    ground?: number;
}

/** Draw the line for the next hours */
export function lineChart(o: LineOptions): Line {
    const hass = o.hass;
    const { lanes } = o;
    const height = lanes.top + lanes.gap + lanes.amp + lanes.gap + lanes.bottom;
    const end = o.now + o.windowHours * HOUR;
    const entries = o.hours.filter(e => !isNaN(time(e)) && num(e.temperature) !== undefined && time(e) > o.now + 10 * 60_000 && time(e) <= end);
    const first = o.current ?? num(o.hours.find(e => time(e) <= o.now + HOUR)?.temperature);
    if (first === undefined || !entries.length) return { html: '', summary: '', requiredDropped: false, height };
    const points: Point[] = [{ t: o.now, v: first }, ...entries.map(e => ({ t: time(e), v: num(e.temperature)!, entry: e }))];
    const last = points[points.length - 1].t;

    // Scales: a steady day draws a gentle line in the middle, never a jagged one
    const pxPerMs = o.width / (o.windowHours * HOUR);
    const x = (t: number) => (t - o.now) * pxPerMs;
    const values = points.map(p => p.v);
    const tMax = Math.max(...values);
    const tMin = Math.min(...values);
    const span = Math.max(tMax - tMin, /F/.test(o.unit) ? 10 : 6);
    const top = tMax + (span - (tMax - tMin)) / 2;
    const yTop = lanes.top + lanes.gap;
    const y = (v: number) => yTop + ((top - v) / span) * lanes.amp;
    const ground = height + o.groundBelow;
    const xy = points.map(p => ({ x: x(p.t), y: y(p.v) }));
    const path = monotonePath(xy);
    const area = `${path} L${xy[xy.length - 1].x.toFixed(1)},${ground} L0,${ground} Z`;
    const id = `awcl${Math.random().toString(36).slice(2, 8)}`;

    // Day solid, night dotted
    const days = dayIntervals(o.sun, o.now, last) ?? [[o.now, last]];
    const dayRects = days.map(([a, b]) => `<rect x="${x(a).toFixed(1)}" y="-40" width="${(x(b) - x(a)).toFixed(1)}" height="${ground + 80}"/>`).join('');
    const nightRects: string[] = [];
    let cursor = o.now;
    for (const [a, b] of days) {
        if (a > cursor) nightRects.push(`<rect x="${x(cursor).toFixed(1)}" y="-40" width="${(x(a) - x(cursor)).toFixed(1)}" height="${ground + 80}"/>`);
        cursor = Math.max(cursor, b);
    }
    if (cursor < last) nightRects.push(`<rect x="${x(cursor).toFixed(1)}" y="-40" width="${(x(last) - x(cursor) + 4).toFixed(1)}" height="${ground + 80}"/>`);

    // Twilight glows where the sun crosses the horizon in the window
    const crossings = days.flatMap(([a, b]) => [a > o.now + 60_000 ? a : null, b < last - 60_000 ? b : null]).filter((t): t is number => t !== null);
    const twilight = !o.twilight ? '' : crossings.map(t => `<ellipse cx="${x(t).toFixed(1)}" cy="${ground}" rx="${Math.max(30, 1.4 * HOUR * pxPerMs).toFixed(1)}" ry="10" fill="url(#${id}-tw)" class="awc-line-twilight"/>`).join('');

    // Rain: each wet hour a column of texture between the line and the ground
    const wetEntries = entries.filter(wetHour);
    const columns = wetEntries.map(e => {
        const kind = kindOf(e);
        const density = densityOf(e);
        const step = HOUR;
        const fill = `url(#${id}-${kind === 'storms' ? 'rain' : kind}-${density})`;
        return `<rect x="${x(time(e)).toFixed(1)}" y="0" width="${(step * pxPerMs).toFixed(1)}" height="${ground}" fill="${fill}" opacity="${PITCH[density][2]}"/>`;
    }).join('');

    const bands = wetBands(o.hours, o.now, end);

    // Labels, greedy, in order of what matters
    const sizes = o.size === 'lg' ? { value: [22, 400], small: [15, 500] } : { value: [15, 600], small: [13, 500] };
    const make = (lane: Label['lane'], anchorX: number, align: Label['align'], html: string, text: string, width: number, required = false): Label => {
        const left = align === 'center' ? anchorX - width / 2 : align === 'end' ? anchorX - width : anchorX;
        return { lane, x: Math.max(0, Math.min(o.width - width, left)), w: width, html, text, align, required };
    };
    const word = (kind: Kind) => localizeString(hass, kind as CardString);
    const candidates: Label[] = [];
    bands.slice(0, o.maxBands).forEach((band, i) => {
        if (i === 0 && o.skipFirstBand) return;
        const when = bandWhen(band, o.now, end, hass);
        const detail = o.bandDetail ? (band.chance !== undefined ? ` · ${percent(Math.round(band.chance / 10) * 10, hass)}`
            : band.amount !== undefined ? ` · ${formatLocalizedNumber(band.amount, hass, band.amount < 10 ? 1 : 0)} mm` : '') : '';
        const full = `${word(band.kind)} ${when}${detail}`;
        const short = `${word(band.kind)} ${when}`;
        const label = make('top', x(Math.max(o.now, band.start)), 'start', `<span class="awc-line-small">${timeHtml(full, 'awc-ampm')}</span>`, full, textWidth(full, sizes.small[0], sizes.small[1]), i === 0);
        label.shorter = () => detail ? make('top', label.x, 'start', `<span class="awc-line-small">${timeHtml(short, 'awc-ampm')}</span>`, short, textWidth(short, sizes.small[0], sizes.small[1]), i === 0) : null;
        candidates.push(label);
    });
    const firstValue = first;
    const extreme = (point: Point, lane: Label['lane'], required: boolean) => {
        const v = degrees(point.v, hass);
        const when = hourLabelFor(point.t, hass);
        const width = textWidth(v, sizes.value[0], sizes.value[1]) + 5 + textWidth(when, sizes.small[0], sizes.small[1]);
        if (o.extremeTimes === false) return make(lane, x(point.t), 'center', `<span class="awc-line-value">${escapeHtml(v)}</span>`, v, textWidth(v, sizes.value[0], sizes.value[1]), required);
        const label = make(lane, x(point.t), 'center', `<span class="awc-line-value">${escapeHtml(v)}</span><span class="awc-line-small">${timeHtml(when, 'awc-ampm')}</span>`, `${v} ${when}`, width, required);
        label.shorter = () => make(lane, x(point.t), 'center', `<span class="awc-line-value">${escapeHtml(v)}</span>`, v, textWidth(v, sizes.value[0], sizes.value[1]), required);
        return label;
    };
    const warm = /F/.test(o.unit) ? 3 : 2;
    const highPoint = points.slice(1).reduce((a, b) => b.v > a.v ? b : a, points[1]);
    const lowPoint = points.slice(1).reduce((a, b) => b.v < a.v ? b : a, points[1]);
    const showHigh = highPoint.v - firstValue >= warm;
    const showLow = firstValue - lowPoint.v >= warm;
    if (showHigh) candidates.push(extreme(highPoint, 'top', !bands.length));
    if (showLow) candidates.push(extreme(lowPoint, 'bottom', !bands.length && !showHigh));
    const lastPoint = points[points.length - 1];
    if (!o.noEnd && !(showHigh && highPoint === lastPoint) && !(showLow && lowPoint === lastPoint)) {
        const when = hourLabelFor(lastPoint.t, hass);
        const text = showHigh || showLow ? when : `${degrees(lastPoint.v, hass)} ${when}`;
        candidates.push(make('bottom', x(lastPoint.t), 'end', `<span class="awc-line-small">${timeHtml(text, 'awc-ampm')}</span>`, text, textWidth(text, sizes.small[0], sizes.small[1])));
    }

    const placed: Label[] = [];
    let requiredDropped = false;
    const clear = (l: Label) => (l.lane !== 'bottom' || l.x >= 16)
        && placed.every(p => p.lane !== l.lane || l.x + l.w + 12 <= p.x || p.x + p.w + 12 <= l.x);
    for (const label of candidates) {
        const tries = [label, label.shorter?.()].filter((l): l is Label => !!l);
        const fits = tries.find(clear);
        if (fits) placed.push(fits);
        else if (label.required) requiredDropped = true;
    }

    // Hour labels along the ground (the forecast card, the pop-up): midnight is the new day's name
    const axis = o.axis ? (() => {
        const ticks: string[] = [];
        const step = o.windowHours <= 12 ? 3 : o.windowHours <= 24 ? 6 : 12;
        let t = Math.ceil(o.now / HOUR) * HOUR;
        while (hourOfDay(t, hass) % step !== 0) t += HOUR;
        for (; t < last; t += step * HOUR) {
            if (x(t) < 24) continue;
            const midnight = hourOfDay(t, hass) === 0;
            const text = midnight ? formatWeekday(new Date(t), hass, 'short').toUpperCase() : hourLabelFor(t, hass);
            ticks.push(`<span class="awc-line-tick${midnight ? ' day' : ''}" style="left: ${x(t).toFixed(1)}px">${escapeHtml(text)}</span>`);
        }
        return `<div class="awc-line-axis" aria-hidden="true">${ticks.join('')}</div>`;
    })() : '';

    const nowNight = o.sun?.state === 'below_horizon';
    const dot = o.dot[0];
    const labelHtml = placed.map(l => {
        const topPx = l.lane === 'top' ? 0 : lanes.top + lanes.gap * 2 + lanes.amp;
        return `<span class="awc-line-label ${l.lane}" style="left: ${l.x.toFixed(1)}px; top: ${topPx}px; height: ${l.lane === 'top' ? lanes.top : lanes.bottom}px">${l.html}</span>`;
    }).join('');

    // What a screen reader hears: the same facts, the dropped labels too
    const summary = [
        `${localizeString(hass, 'next_hours')}: ${localizeString(hass, 'now').toLowerCase()} ${degrees(firstValue, hass)}`,
        showHigh ? `${localizeString(hass, 'high').toLowerCase()} ${degrees(highPoint.v, hass)}, ${hourLabelFor(highPoint.t, hass)}` : '',
        showLow ? `${localizeString(hass, 'low').toLowerCase()} ${degrees(lowPoint.v, hass)}, ${hourLabelFor(lowPoint.t, hass)}` : '',
        ...bands.map(b => `${word(b.kind)} ${rangeText(Math.max(o.now, b.start), b.end, hass)}${b.chance !== undefined ? `, ${localizeString(hass, 'chance', { percent: percent(Math.round(b.chance / 10) * 10, hass) })}` : ''}`),
    ].filter(Boolean).join('. ');

    const html = `<div class="awc-line" role="img" aria-label="${escapeHtml(summary)}" style="height: ${height}px">`
        + `<svg class="awc-line-svg" width="${o.width.toFixed(0)}" height="${height}" viewBox="0 0 ${o.width.toFixed(0)} ${height}" aria-hidden="true">`
        + `<defs>${patternDefs(id)}<radialGradient id="${id}-tw"><stop offset="0" class="awc-line-tw-stop"/><stop offset="1" class="awc-line-tw-stop end"/></radialGradient>`
        + `<clipPath id="${id}-day">${dayRects}</clipPath><clipPath id="${id}-night">${nightRects.join('')}</clipPath><clipPath id="${id}-area"><path d="${area}"/></clipPath></defs>`
        + twilight
        + `<g class="awc-line-rain" clip-path="url(#${id}-area)">${columns}</g>`
        + (o.groundBelow ? '' : `<line class="awc-line-ground" x1="0" x2="${o.width.toFixed(0)}" y1="${ground - 0.5}" y2="${ground - 0.5}"/>`)
        + `<line class="awc-line-now" x1="0.5" x2="0.5" y1="0" y2="${ground}"/>`
        + `<path class="awc-line-path night" d="${path}" clip-path="url(#${id}-night)"/>`
        + `<path class="awc-line-path" d="${path}" clip-path="url(#${id}-day)"/>`
        + placed.filter(l => l.text.includes('°') && l.align === 'center').map(l => {
            const p = l.lane === 'top' ? highPoint : lowPoint;
            return `<circle class="awc-line-mark" cx="${x(p.t).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="2.5"/>`;
        }).join('')
        + `</svg>`
        + `<span class="awc-line-dot${nowNight ? ' night' : ''}" style="top: ${y(firstValue).toFixed(1)}px; width: ${dot}px; height: ${dot}px; margin: ${-dot / 2}px 0 0 ${-dot / 2}px"></span>`
        + labelHtml + axis + '</div>';
    return { html, summary, requiredDropped, height: height + (o.axis ? 18 : 0), x, y, ground };
}

/** The line's styles; `theme` is the selector for the theme palette where it's used */
export function lineCss(theme: string): string {
    return `
        .awc-line { position: relative; width: 100%; }
        .awc-line-svg { position: absolute; left: 0; top: 0; overflow: visible; }
        .awc-line-path { fill: none; stroke: currentColor; stroke-width: var(--awc-line-w, 2.25px); stroke-linecap: round; stroke-linejoin: round; }
        .awc-line-path.night { stroke-dasharray: 2 5; opacity: 0.85; }
        .awc-line-now { stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; stroke-dasharray: 2 4; }
        .awc-line-ground { stroke: currentColor; stroke-opacity: 0.2; stroke-width: 1; }
        .awc-line-svg pattern :is(rect, circle) { fill: currentColor; }
        .awc-line-mark { fill: currentColor; }
        .awc-line-tw-stop { stop-color: #ffb98a; stop-opacity: 0.38; }
        .awc-line-tw-stop.end { stop-opacity: 0; }
        /* Now: a plain disc in the line's colour, ringed in the sky; never a second sun */
        .awc-line-dot { position: absolute; left: 0; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 2px var(--awc-sky-mid, transparent); }
        .awc-line-label { position: absolute; display: flex; align-items: center; gap: 5px; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-line-value { font-size: 15px; line-height: 16px; font-weight: 600; letter-spacing: -0.01em; }
        .awc-line-small { font-size: 13px; line-height: 16px; font-weight: 500; }
        .awc-line.lg .awc-line-value { font-size: 22px; line-height: 26px; font-weight: 400; letter-spacing: -0.02em; }
        .awc-line.lg .awc-line-small { font-size: 15px; line-height: 18px; }
        .awc-line-axis { position: absolute; left: 0; right: 0; bottom: -18px; height: 14px; }
        .awc-line-tick { position: absolute; transform: translateX(-50%); font-size: 11px; line-height: 14px; font-weight: 500; letter-spacing: 0.04em; opacity: var(--awc-secondary, 0.8); white-space: nowrap; }
        .awc-line-tick.day { font-weight: 600; letter-spacing: 0.06em; }
        ${theme} .awc-line-path { stroke: var(--primary-color); }
        ${theme} :is(.awc-line-now, .awc-line-ground) { stroke: var(--divider-color, rgba(0, 0, 0, 0.12)); stroke-opacity: 1; }
        ${theme} .awc-line-svg pattern :is(rect, circle) { fill: var(--secondary-text-color); }
        ${theme} .awc-line-tw-stop { stop-opacity: 0; }
        ${theme} .awc-line-dot { background: var(--primary-color); box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)); }
        ${theme} .awc-line-mark { fill: var(--primary-color); }
        ${theme} .awc-line-tick { color: var(--secondary-text-color); opacity: 1; }
    `;
}
