// The forecast bundle's shared ground: the card's colours mixed in OKLab,
// the springs and curves every motion uses, the sun's height at any hour,
// and the forecast as a timeline of slots. Nothing here touches the DOM.

import type { ForecastEntry, ForecastType } from './forecast-data';
import { cardTimeZone, dayKey, hourOfDay, LocaleSource } from './localize';
import type { HomeAssistant } from './types';

export const HOUR = 3600_000;
export const MINUS = '−';
export const NB = ' ';

// ── Home Assistant's 15 conditions → the card's sky classes ────────────────
const CLASS_OF: Record<string, string> = {
    sunny: 'sunny', 'clear-night': 'clear-night', partlycloudy: 'partly-cloudy', cloudy: 'cloudy',
    fog: 'foggy', rainy: 'rainy', pouring: 'pouring', lightning: 'stormy', 'lightning-rainy': 'stormy',
    snowy: 'snowy', 'snowy-rainy': 'snowy-rainy', hail: 'sleety', windy: 'windy', 'windy-variant': 'windy',
    exceptional: 'sunny',
};
export const classOf = (condition: string | undefined): string => (condition && Object.prototype.hasOwnProperty.call(CLASS_OF, condition) ? CLASS_OF[condition] : 'sunny');

/** How much of each of the card's layers a sky class shows */
export const LAYER_OF: Record<string, Record<string, number>> = {
    sun: { sunny: 1, 'partly-cloudy': 0.85, windy: 0.9 },
    clouds: { 'partly-cloudy': 1, cloudy: 1 },
    rain: { rainy: 1, pouring: 1, stormy: 1, 'snowy-rainy': 0.7 },
    snow: { snowy: 1, 'snowy-rainy': 0.8 },
    sleet: { sleety: 1 },
    stars: { 'clear-night': 1, 'partly-cloudy': 0.35, sunny: 1, windy: 0.6 },
    lightning: { stormy: 1 },
};
export const LAYER_NAMES = ['rain', 'snow', 'sleet', 'clouds', 'lightning'] as const;
export const CONTAINER: Record<string, string> = {
    rain: '.rain-container', snow: '.snow-container', sleet: '.sleet-container', clouds: '.clouds-container', lightning: '.lightning-container',
};

const WET = new Set(['rainy', 'pouring', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail']);
export type WetKind = 'rain' | 'snow' | 'sleet' | 'storms';
/** Wet: by condition, or a chance of 50% or more (Met.no's hourly has no chance: the condition alone decides) */
export const isWet = (e: Pick<ForecastEntry, 'condition' | 'precipitation_probability'> | undefined): boolean =>
    !!e && (WET.has(e.condition ?? '') || (e.precipitation_probability ?? 0) >= 50);
export function wetKind(e: Pick<ForecastEntry, 'condition' | 'precipitation_probability'> | undefined): WetKind | null {
    if (!isWet(e)) return null;
    const c = e!.condition;
    if (c === 'lightning-rainy' || c === 'lightning') return 'storms';
    if (c === 'snowy') return 'snow';
    if (c === 'snowy-rainy' || c === 'hail') return 'sleet';
    return 'rain';
}
/** What falls in a forecast, for the chips' noun: snow or sleet when that is all it holds, else rain */
export function wetNoun(entries: ForecastEntry[] | null): 'rain' | 'snow' | 'sleet' {
    const kinds = new Set((entries ?? []).filter(e => WET.has(e.condition ?? '')).map(e => e.condition === 'snowy' ? 'snow' : e.condition === 'snowy-rainy' || e.condition === 'hail' ? 'sleet' : 'rain'));
    return kinds.size === 1 ? [...kinds][0] as 'rain' | 'snow' | 'sleet' : 'rain';
}

// ── Colour: the card's own skies, mixed in OKLab ────────────────────────────
export type Lab = [number, number, number, number];
const dec = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);
const enc = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
export function parseColor(input: string): { rgb: [number, number, number]; a: number } {
    const str = String(input).trim();
    if (str.startsWith('#')) {
        const h = str.length === 4 ? str.slice(1).split('').map(c => c + c).join('') : str.slice(1, 7);
        const n = parseInt(h, 16);
        return { rgb: [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255], a: 1 };
    }
    const [r = 0, g = 0, b = 0, a = 1] = (str.match(/[\d.]+/g) ?? []).map(Number);
    return { rgb: [r / 255, g / 255, b / 255], a };
}
export function toLab([r, g, b]: [number, number, number]): [number, number, number] {
    const [lr, lg, lb] = [dec(r), dec(g), dec(b)];
    const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
    const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
    const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
    return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
export function fromLab([L, A, B]: [number, number, number] | Lab): [number, number, number] {
    const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
    const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
    const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s]
        .map(v => enc(Math.min(1, Math.max(0, v)))) as [number, number, number];
}
const byte = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255);
export const hex = (rgb: [number, number, number]): string => '#' + rgb.map(v => byte(v).toString(16).padStart(2, '0')).join('');
export const rgba = (rgb: [number, number, number], a: number): string => `rgba(${rgb.map(byte).join(', ')}, ${Math.max(0, Math.min(1, a)).toFixed(3)})`;
export const labOf = (css: string): Lab => { const p = parseColor(css); return [...toLab(p.rgb), p.a] as Lab; };
/** One OKLab value as CSS: hex when opaque, else rgba */
export const cssOf = (v: Lab): string => (v[3] >= 0.999 ? hex(fromLab(v)) : rgba(fromLab(v), v[3]));
export function mixLab(a: Lab, b: Lab, t: number): Lab {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t];
}
/** Mix two CSS colours in OKLab (hex out) */
export const mixHex = (a: string, b: string, t: number): string => cssOf(mixLab(labOf(a), labOf(b), t));
/** WCAG relative luminance of an sRGB colour (0 to 1 channels) */
export function luminance([r, g, b]: [number, number, number]): number {
    return 0.2126 * dec(r) + 0.7152 * dec(g) + 0.0722 * dec(b);
}

// ── Motion ─────────────────────────────────────────────────────────────────
/** One exact step of a critically damped spring toward `target` (frame-rate independent). Response in s. */
export function spring(x: number, v: number, target: number, response: number, dt: number): [number, number] {
    const omega = (2 * Math.PI) / response;
    const d = x - target;
    const c2 = v + omega * d;
    const e = Math.exp(-omega * dt);
    return [target + (d + c2 * dt) * e, (v - omega * c2 * dt) * e];
}
/** iOS's rubber band: the farther past the edge, the less it moves */
export const rubber = (x: number, dim = 120, c = 0.55): number => (c * dim * x) / (dim + c * Math.abs(x));
export const smooth = (e0: number, e1: number, x: number): number => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));

/** cubic-bezier(x1, y1, x2, y2) as a function of progress, by Newton's method */
export function bezier([x1, y1, x2, y2]: readonly [number, number, number, number]): (x: number) => number {
    const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
    const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    const X = (t: number) => ((ax * t + bx) * t + cx) * t, Y = (t: number) => ((ay * t + by) * t + cy) * t, dX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
    return (x: number) => {
        if (x <= 0) return 0; if (x >= 1) return 1;
        let t = x;
        for (let i = 0; i < 8; i++) { const e = X(t) - x; if (Math.abs(e) < 1e-6) break; const d = dX(t); if (Math.abs(d) < 1e-6) break; t -= e / d; }
        return Y(clamp(t));
    };
}
/** The card's curves (CONCLUSIONS 7): one table, so every motion speaks the same grammar */
export const CURVE = {
    out: [0.5, 0, 0.75, 0] as const,          // a value leaving
    in: [0.25, 1, 0.5, 1] as const,           // a value arriving, a capsule travelling
    inOut: [0.65, 0, 0.35, 1] as const,       // a rescale, the hour's step
    drawer: [0.32, 0.72, 0, 1] as const,      // the tap view, the bars' wipe
    press: [0.23, 1, 0.32, 1] as const,       // a press, the needle
    sky: [0.37, 0, 0.63, 1] as const,         // the sky's own changes
};
export const css = (b: readonly number[]): string => `cubic-bezier(${b.join(', ')})`;
export const ease = { out: bezier(CURVE.out), in: bezier(CURVE.in), inOut: bezier(CURVE.inOut), drawer: bezier(CURVE.drawer) };

export const reducedMotion = (): boolean => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
export const esc = (s: unknown): string => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

// ── The sun, at any hour ───────────────────────────────────────────────────
const RAD = Math.PI / 180;
/** NOAA's solar elevation for a place, in degrees */
export function solarElevation(date: Date, latitude: number, longitude: number): number {
    const t = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
    const meanLong = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
    const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const centre = Math.sin(meanAnomaly * RAD) * (1.914602 - t * (0.004817 + 0.000014 * t))
        + Math.sin(2 * meanAnomaly * RAD) * (0.019993 - 0.000101 * t) + Math.sin(3 * meanAnomaly * RAD) * 0.000289;
    const omega = 125.04 - 1934.136 * t;
    const apparentLong = meanLong + centre - 0.00569 - 0.00478 * Math.sin(omega * RAD);
    const obliquity = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(omega * RAD);
    const declination = Math.asin(Math.sin(obliquity * RAD) * Math.sin(apparentLong * RAD));
    const y = Math.tan((obliquity / 2) * RAD) ** 2;
    const equationOfTime = (4 / RAD) * (y * Math.sin(2 * meanLong * RAD) - 2 * eccentricity * Math.sin(meanAnomaly * RAD)
        + 4 * eccentricity * y * Math.sin(meanAnomaly * RAD) * Math.cos(2 * meanLong * RAD)
        - 0.5 * y * y * Math.sin(4 * meanLong * RAD) - 1.25 * eccentricity * eccentricity * Math.sin(2 * meanAnomaly * RAD));
    const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    const hourAngle = ((((utcMinutes + equationOfTime + 4 * longitude) % 1440) + 1440) % 1440) / 4 - 180;
    const cosZenith = Math.sin(latitude * RAD) * Math.sin(declination) + Math.cos(latitude * RAD) * Math.cos(declination) * Math.cos(hourAngle * RAD);
    return 90 - Math.acos(clamp(cosZenith, -1, 1)) / RAD;
}

export interface SunAt { elevation: number; rising: boolean }
/**
 * The sun's height at any time: from Home Assistant's place when it has one
 * (NOAA's algorithm, as the sun entity's own), else from the sun entity's
 * next sunrise and sunset (a slope through each horizon crossing), else a
 * plain day from 6:00 to 18:00.
 */
export function sunModel(hass: HomeAssistant | undefined, sunEntity = 'sun.sun'): (date: Date) => SunAt {
    const lat = Number(hass?.config?.latitude), lon = Number(hass?.config?.longitude);
    if (isFinite(lat) && isFinite(lon) && (lat !== 0 || lon !== 0) && hass?.config?.latitude !== undefined) {
        return (date) => {
            const e = solarElevation(date, lat, lon);
            return { elevation: e, rising: solarElevation(new Date(date.getTime() + 60000), lat, lon) > e };
        };
    }
    const a = hass?.states?.[sunEntity]?.attributes ?? {};
    const rise = Date.parse(a.next_rising), set = Date.parse(a.next_setting), dawn = Date.parse(a.next_dawn);
    if (isFinite(rise) && isFinite(set)) {
        const DAY = 24 * HOUR;
        // Degrees a minute through the horizon: 5.17° from first light to sunrise, else 0.2°
        let slope = 0.2;
        if (isFinite(dawn)) { const d = ((rise - dawn) % DAY + DAY) % DAY; if (d > 5 * 60000 && d < 3 * HOUR) slope = 5.167 / (d / 60000); }
        return (date) => {
            const t = date.getTime();
            // The last sunrise and sunset before t, and the next ones after
            const back = (ev: number) => ev - Math.ceil((ev - t) / DAY) * DAY;
            const r0 = back(rise), s0 = back(set);
            const r1 = r0 + DAY, s1 = s0 + DAY;
            const day = r0 > s0;     // the sun rose more recently than it set
            const mins = (ms: number) => ms / 60000;
            if (day) {
                const e = Math.min(mins(t - r0), mins(s1 - t)) * slope - 0.833;
                return { elevation: Math.min(60, e), rising: t - r0 < s1 - t };
            }
            const e = -Math.min(mins(t - s0), mins(r1 - t)) * slope - 0.833;
            return { elevation: Math.max(-60, e), rising: r1 - t < t - s0 };
        };
    }
    return (date) => {
        const h = date.getHours() + date.getMinutes() / 60;
        const e = h >= 6 && h < 18 ? Math.min(h - 6, 18 - h) * 8 : -Math.min(Math.abs(h - 6), Math.abs(h - 18) % 24) * 8;
        return { elevation: e, rising: h < 12 };
    };
}

/** Day, twilight and night weights from the sun's elevation, centred on the card's ±6° steps */
export function phaseWeights(elevation: number, rising: boolean): Record<'day' | 'dawn' | 'dusk' | 'night', number> {
    const day = smooth(3, 9, elevation);
    const night = 1 - smooth(-9, -3, elevation);
    const twi = Math.max(0, 1 - day - night);
    return { day, night, dawn: rising ? twi : 0, dusk: rising ? 0 : twi };
}
/** The sun's drop on its track, % (the card: 0 by day, 14 at dawn and dusk, 26 at night) */
export const sunDrop = (e: number): number => (e >= 12 ? 0 : e <= -12 ? 26 : ((12 - e) / 24) * 26);

// ── Time, in the card's time zone ──────────────────────────────────────────
export const sameDay = (a: Date, b: Date, hass?: LocaleSource): boolean => dayKey(a, hass) === dayKey(b, hass);
export const hourIn = (d: Date, hass?: LocaleSource): number => Math.floor(hourOfDay(d, hass));
export { cardTimeZone };

// ── The forecast as slots ──────────────────────────────────────────────────
export interface Slot extends ForecastEntry {
    at: Date;
    cls: string;
}

/**
 * The forecast as the slide and the row see it: one slot per entry of the
 * finest kind the entity has (an hour, a half day, a day), the one under
 * way first. Slot k starts at `slots[k].at` and lasts `slotMs`.
 */
export class Timeline {
    readonly slots: Slot[];
    readonly slotMs: number;
    readonly unit: 'hour' | 'half' | 'day';
    readonly start: number;
    constructor(entries: ForecastEntry[], readonly type: ForecastType, readonly now: number) {
        this.unit = type === 'hourly' ? 'hour' : type === 'twice_daily' ? 'half' : 'day';
        this.slotMs = this.unit === 'hour' ? HOUR : this.unit === 'half' ? 12 * HOUR : 24 * HOUR;
        const sorted = entries.map(e => ({ ...e, at: new Date(Date.parse(e.datetime)), cls: classOf(e.condition) }))
            .filter(s => !isNaN(s.at.getTime())).sort((a, b) => a.at.getTime() - b.at.getTime());
        // A day's entry may be dated at noon or midnight: a day slot starts at the day's start
        if (this.unit === 'day') for (const s of sorted) { const d = new Date(s.at); d.setHours(0, 0, 0, 0); s.at = d; }
        // The slot under way first
        const i = sorted.findIndex(s => s.at.getTime() + this.slotMs > now);
        this.slots = i < 0 ? [] : sorted.slice(i);
        this.start = this.slots[0]?.at.getTime() ?? now;
    }
    get length(): number { return this.slots.length; }
    /** Slot k's middle, in hours from now */
    mid(k: number): number { return (this.slots[k].at.getTime() + this.slotMs / 2 - this.now) / HOUR; }
    /** Hours from now to the start of slot k (never before now) */
    hoursTo(k: number): number { return Math.max(0, (this.slots[k].at.getTime() - this.now) / HOUR); }
}

/** The card's number format: "1.4" or "1,4" */
export function num(value: number, lang: string, digits = 0): string {
    try { return new Intl.NumberFormat(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value); }
    catch { return value.toFixed(digits); }
}
/** Whole degrees with a true minus, as the row and the bars write them */
export const whole = (v: number): string => `${Math.round(v) < 0 ? MINUS : ''}${Math.abs(Math.round(v))}`;
/**
 * A control the slide never claims (the Now control): it acts on its own
 * pointer release, since iOS can drop the click when the line beside it
 * changes under the finger, and on click for the keys. Its presses never
 * reach the card's own tap.
 */
export function ownControl(el: HTMLElement, act: () => void): void {
    let pressed = false;
    el.addEventListener('pointerdown', e => { e.stopPropagation(); pressed = true; });
    el.addEventListener('pointerleave', () => { pressed = false; });
    el.addEventListener('pointercancel', () => { pressed = false; });
    el.addEventListener('pointerup', e => { e.stopPropagation(); if (!pressed) return; pressed = false; act(); });
    el.addEventListener('click', e => { e.stopPropagation(); if (e.detail === 0) act(); });
}

/** Haptics: Home Assistant's own window event, which the Companion apps turn into real ones. At most one per 55 ms. */
let lastHaptic = 0;
export function haptic(kind: 'selection' | 'light'): void {
    const t = performance.now();
    if (t - lastHaptic < 55) return;
    lastHaptic = t;
    window.dispatchEvent(new CustomEvent('haptic', { detail: kind }));
}
