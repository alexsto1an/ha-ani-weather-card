/**
 * Animated Sun Tracker Card
 *
 * The sun's path through the day as one continuous curve (above the horizon
 * by day, dipping below it at night) with the sun's current position, the
 * next sunrise or sunset as the headline, and the day's facts in a quiet
 * grid below. The card's sky follows the sun's real elevation, in the same
 * palette as the weather card.
 */

import { SunData } from './weather-data';
import { iconBoxCss } from './styles/icon-box';
import { localizeString, localeKey, formatTime, formatDuration, timeHtml as splitTimeHtml } from './localize';
import { HomeAssistant } from './types';
import { escapeHtml, getWeatherClass, textField } from './utils';
import {
    skyColors, skyPhaseFromSun, oklchToSrgb, toHex, registerSkyProperties, SKY_CONDITIONS,
    type SkyCondition, type SkyPhase,
    SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, SKY_GLOW, skyGlowGradient,
    SKY_COLOR_PROPERTIES, SKY_DISSOLVE_SEC, SKY_DISSOLVE_EASE,
} from './sky';

interface SunTrackerConfig {
    sun_entity?: string;
    moon_entity?: string;
    /** Match the sky to this weather entity's condition, e.g. under a weather card */
    weather_entity?: string;
    /** One line: the next sunrise or sunset beside the sun's path */
    compact?: boolean;
    show_header?: boolean;
    show_details?: boolean;
    title?: string;
    color_palette?: 'default' | 'theme';
    type?: string;
}

interface MoonData {
    phase: string;       // e.g. "waning_gibbous"
    phaseName: string;   // e.g. "Waning Gibbous"
    icon: string;        // e.g. "mdi:moon-waning-gibbous"
}

// ── Moon helpers ──
const MOON_PHASE_NAMES: Record<string, string> = {
    new_moon:         'New Moon',
    waxing_crescent:  'Waxing Crescent',
    first_quarter:    'First Quarter',
    waxing_gibbous:   'Waxing Gibbous',
    full_moon:        'Full Moon',
    waning_gibbous:   'Waning Gibbous',
    last_quarter:     'Last Quarter',
    waning_crescent:  'Waning Crescent',
};

function moonPhaseToIcon(phase: string): string {
    // mdi icon follows the pattern mdi:moon-{phase_with_hyphens}, except
    // that HA's new_moon and full_moon are mdi:moon-new and mdi:moon-full
    const key = phase.replace(/_moon$/, '').replace(/_/g, '-');
    return `mdi:moon-${key}`;
}

// ── Sun path geometry (SVG user units; the SVG stretches to the card) ──
const VW = 1000;
const VH = 300;
/** Where the horizon, the noon peak and the midnight trough sit (user units). */
interface PathGeometry { horizon: number; peak: number; trough: number; twilightRy: number }
const REGULAR_PATH: PathGeometry = { horizon: 196, peak: 34, trough: 276, twilightRy: 78 };
/**
 * Compact: the chart spans a short strip, so the arc is lower and gentler
 * (a day, not a mountain) and the sun clears the card's top edge.
 */
const COMPACT_PATH: PathGeometry = { horizon: 200, peak: 96, trough: 262, twilightRy: 44 };

/** A detail column is wide enough for "Waxing Gibbous" on one line. */
const DETAIL_MIN_WIDTH = 124;
const DETAIL_GAP = 16;

/**
 * How many columns the details take at a width: as many as fit, never fewer
 * than two, then evened out over the rows that needs, so six details on a
 * wide card read 3 + 3 or one row of six, never 5 + 1.
 */
export function detailColumns(count: number, width: number): number {
    if (count < 1) return 1;
    const fit = Math.max(2, Math.floor((width + DETAIL_GAP) / (DETAIL_MIN_WIDTH + DETAIL_GAP)));
    const rows = Math.ceil(count / fit);
    return Math.ceil(count / rows);
}

/**
 * Normalized elevation for an hour of the day: 0 → 1 → 0 between sunrise
 * and sunset, 0 → -1 → 0 through the night. One continuous wave, so the
 * curve crosses the horizon exactly at sunrise and sunset.
 */
export function pathElevation(hour: number, riseHour: number, setHour: number): number {
    const day = setHour - riseHour;
    if (day <= 0 || day >= 24) return 0;
    if (hour >= riseHour && hour <= setHour) {
        return Math.sin(Math.PI * (hour - riseHour) / day);
    }
    const sinceSet = (((hour - setHour) % 24) + 24) % 24;
    return -Math.sin(Math.PI * sinceSet / (24 - day));
}

const xFor = (hour: number): number => (hour / 24) * VW;
const yFor = (elevation: number, g: PathGeometry): number =>
    elevation >= 0
        ? g.horizon - elevation * (g.horizon - g.peak)
        : g.horizon - elevation * (g.trough - g.horizon);

function sunPath(riseHour: number, setHour: number, g: PathGeometry): string {
    const points: string[] = [];
    for (let i = 0; i <= 240; i++) {
        const h = i / 10;
        points.push(`${xFor(h).toFixed(1)},${yFor(pathElevation(h, riseHour, setHour), g).toFixed(1)}`);
    }
    return 'M' + points.join(' L');
}

/**
 * Convert an ISO datetime to a fractional hour-of-day in local time.
 * The 24h sun curve and twilight bands are indexed by hour-of-day, so
 * the date component is intentionally discarded — `next_rising` may be
 * tomorrow's ISO if today's sunrise has already passed, and the
 * hour-of-day is what the chart needs in either case.
 * Returns 0 for null / unparseable inputs so the chart degrades to a
 * flat line instead of throwing.
 */
function isoToHours(iso: string | null): number {
    if (!iso) return 0;
    const d = new Date(iso);
    if (isNaN(d.getTime())) return 0;
    return d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600;
}

/** "7:12 PM" → "7:12" + a smaller "PM", so the numerals carry the weight. */
const timeHtml = (formatted: string): string => splitTimeHtml(formatted, 'st-ampm');

// Sky colors cross-fade between phases (registered <color> properties)
registerSkyProperties();

const SKY_TEXT_HEX = toHex(oklchToSrgb(SKY_TEXT));

// ── Styles ──
const STYLES = `
${iconBoxCss('')}
    :host {
        display: block;
        height: 100%;
        --st-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
        --st-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
    }

    ha-card {
        height: 100%;
        overflow: hidden;
    }
    ha-card.sky {
        background: none;
        border-color: transparent;
    }

    .st-card {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 220px;
        padding: 20px;
        gap: 14px;
        container: st / inline-size;
        font-family: var(--st-font);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--st-text);
        --st-text: var(--primary-text-color);
        --st-secondary: var(--secondary-text-color);
        --st-secondary-opacity: 1;
        /* Theme palette: the headline time and the day's arc in the theme's
           primary color, with a faint tint of it under the arc (an amber
           fill turns muddy on dark themes), icons in its icon color, and no
           twilight glows */
        --st-path: var(--primary-color);
        --st-path-night: var(--secondary-text-color);
        --st-horizon: var(--divider-color, rgba(0, 0, 0, 0.12));
        --st-icon: var(--state-icon-color, var(--primary-color));
        --st-hero: var(--primary-color, var(--primary-text-color));
        --st-day-fill: var(--primary-color);
        --st-day-fill-opacity: 0.08;
        --st-twilight: var(--state-sun-above_horizon-color, #ffb300);
        --st-twilight-opacity: 0;
    }

    /* Colorized: the card's sky follows the sun */
    .st-card.sky {
        --st-text: ${SKY_TEXT_HEX};
        --st-secondary: ${SKY_TEXT_HEX};
        --st-secondary-opacity: ${SKY_TEXT_SECONDARY_ALPHA};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${skyGlowGradient(SKY_GLOW, 'var(--awc-sky-glow)')},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${SKY_COLOR_PROPERTIES.map(name => `${name} ${SKY_DISSOLVE_SEC}s ${SKY_DISSOLVE_EASE}`).join(', ')};
    }

    /* ── Headline: the next sunrise or sunset ── */
    .st-hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-shrink: 0;
        min-width: 0;
    }
    .st-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: -0.01em;
        margin-bottom: 6px;
        opacity: 0.94;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .st-eyebrow,
    .st-metric-label {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    /* Long labels (German "Sonnenhöchststand") end in an ellipsis rather
       than running into the next column; the full word is in the title */
    .st-metric-label { min-width: 0; }
    .st-metric-label > span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-eyebrow ha-icon,
    .st-metric-label ha-icon {
        --mdc-icon-size: 13px;
        /* Optical: centred on the capitals of the uppercase label */
        margin-top: -0.5px;
        flex-shrink: 0;
    }
    .st-time {
        margin: 6px 0 0 -0.04em;
        font-family: var(--st-font-display);
        font-size: 52px;
        font-weight: 250;
        line-height: 0.95;
        letter-spacing: -0.035em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }
    .st-ampm {
        font-size: 0.42em;
        font-weight: 500;
        letter-spacing: 0.02em;
        margin-left: 0.32em;
    }
    .st-countdown {
        margin-top: 6px;
        font-size: 15px;
        line-height: 20px;
        font-variant-numeric: tabular-nums;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }

    /* ── Sun path ── */
    .st-chart {
        position: relative;
        flex: 1 1 auto;
        min-height: 64px;
        /* The path stretches to the chart, so cap its height: the arc keeps
           the same gentle shape in a tall frame instead of becoming a peak */
        max-height: 96px;
        margin: auto -20px;
    }
    .st-chart svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .st-path-day,
    .st-path-night {
        fill: none;
        stroke-width: 2.25;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
    }
    .st-path-day { stroke: var(--st-path); }
    .st-path-night { stroke: var(--st-path-night); stroke-dasharray: 2 5; }
    .st-day-fill { fill: var(--st-day-fill); opacity: var(--st-day-fill-opacity); }
    .st-twilight { opacity: var(--st-twilight-opacity); }
    .st-horizon {
        stroke: var(--st-horizon);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
    }
    .st-now-line {
        stroke: var(--st-horizon);
        stroke-width: 1;
        stroke-dasharray: 2 4;
        vector-effect: non-scaling-stroke;
    }

    /* The sun (or the moon, when it's below the horizon) at this moment */
    .st-dot {
        position: absolute;
        width: 14px;
        height: 14px;
        margin: -7px 0 0 -7px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #ffe3a3 55%, #ffb547 100%);
        box-shadow: 0 0 10px 3px rgba(255, 200, 110, 0.55), 0 0 30px 10px rgba(255, 200, 110, 0.22);
    }
    .st-dot.below {
        width: 10px;
        height: 10px;
        margin: -5px 0 0 -5px;
        background: radial-gradient(circle at 40% 40%, #ffffff 0%, #dfe6f5 70%, #b9c3d8 100%);
        box-shadow: 0 0 10px 2px rgba(200, 214, 255, 0.35);
    }
    /* Theme palette: a flat sun in Home Assistant's sun color, like the
       weather card's. Below the horizon it takes the night path's color:
       HA's indigo for a set sun is too faint on dark themes. */
    .st-card:not(.sky) .st-dot {
        box-shadow: none;
        background: var(--state-sun-above_horizon-color, #ffc107);
    }
    .st-card:not(.sky) .st-dot.below {
        background: var(--st-path-night);
    }
    .st-card:not(.sky) .st-eyebrow ha-icon,
    .st-card:not(.sky) .st-metric-label ha-icon {
        color: var(--st-icon);
    }
    /* The headline time is the tracker's hero, like the weather card's temperature */
    .st-card:not(.sky) .st-time {
        color: var(--st-hero);
    }

    /* ── Facts ── */
    .st-metrics {
        position: relative;
        display: grid;
        /* The column count comes from _fit (detailColumns) */
        grid-template-columns: repeat(var(--st-cols, 2), minmax(0, 1fr));
        gap: 14px 16px;
        padding-top: 14px;
        flex-shrink: 0;
    }
    .st-metrics::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
    }
    .st-card:not(.sky) .st-metrics::before {
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        opacity: 1;
    }
    .st-metric {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    .st-metric-value {
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        letter-spacing: -0.012em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-metric-value .st-ampm { font-size: 0.7em; margin-left: 0.24em; }
    /* Moon phase names are long; let them wrap rather than truncate */
    .st-metric-value.wrap {
        white-space: normal;
        text-wrap: balance;
    }

    /* Fit to the frame, stepped down until nothing overflows (see _fit) */
    .st-card[data-fit="compact"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="compact"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-countdown,
    .st-card[data-fit="tight"] .st-countdown,
    .st-card[data-fit="tight"] .st-metrics { display: none; }
    .st-card[data-fit="short"] .st-time,
    .st-card[data-fit="tight"] .st-time { font-size: 40px; }
    .st-card[data-fit="short"],
    .st-card[data-fit="tight"] { gap: 10px; }
    .st-card[data-fit="short"] .st-chart,
    .st-card[data-fit="tight"] .st-chart { min-height: 44px; }

    @container st (max-width: 299px) {
        .st-time { font-size: 44px; }
        .st-metric-value { font-size: 16px; }
    }
    @container st (min-width: 460px) {
        .st-time { font-size: 60px; }
        .st-metric-value { font-size: 18px; line-height: 24px; }
    }

    /* ── Compact: the next sunrise or sunset beside the sun's day ──
       One line, built to sit under a weather card: same left edge and
       label style, the time a quiet step down from the temperature. */
    .st-card.compact {
        flex-direction: row;
        align-items: center;
        gap: 20px;
        min-height: 0;
        padding: 16px 20px;
    }
    /* Under a weather card the real sun is just above, so no second light
       source: the sky's gradient and scrim only */
    .st-card.sky.compact {
        /* From the sky's mid tone down: under a weather card it reads as
           the lower sky, not a brighter strip below a darker card */
        background:
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-mid) 0%, var(--awc-sky-bottom) 100%);
        --st-twilight-opacity: 0.3;
    }
    .st-card.compact .st-hero { flex: 0 0 auto; }
    .st-card.compact .st-time { font-size: 34px; margin-top: 5px; }
    .st-card.compact .st-countdown { margin-top: 5px; font-size: 13px; line-height: 18px; }
    .st-card.compact .st-chart {
        flex: 1 1 auto;
        align-self: stretch;
        max-height: none;
        /* Full height of the card, out to its right edge */
        margin: -16px -20px -16px 0;
        /* The path fades in beside the headline instead of starting at a hard edge */
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 36px);
        mask-image: linear-gradient(90deg, transparent 0, #000 36px);
    }
    .st-card.compact[data-fit] .st-chart { min-height: 0; }
    /* The other event, small, in the open sky at the top-right */
    .st-chart-note {
        position: absolute;
        top: 14px;
        right: 20px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    .st-chart-note .st-chart-note-time {
        margin-left: 4px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        font-variant-numeric: tabular-nums;
    }
    .st-chart-note .st-ampm { font-size: 1em; margin-left: 0.2em; font-weight: 500; }
    @container st (max-width: 419px) {
        .st-chart-note { display: none; }
    }
    /* Short frames (a one-row section): the countdown goes, then the label */
    .st-card.compact[data-fit="short"],
    .st-card.compact[data-fit="tight"] { gap: 16px; }
    .st-card.compact[data-fit="short"] .st-time,
    .st-card.compact[data-fit="tight"] .st-time { font-size: 28px; }
    .st-card.compact[data-fit="tight"] .st-eyebrow { display: none; }
    .st-card.compact[data-fit="tight"] { padding-block: 12px; }
    .st-card.compact[data-fit="tight"] .st-chart { margin-block: -12px; }
    .st-card.compact[data-fit="tight"] .st-time { margin-top: 0; }

    .st-no-data {
        margin: auto;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
`;

class AnimatedSunTrackerCard extends HTMLElement {
    private config: SunTrackerConfig = {};
    private _hass?: HomeAssistant;
    private _shadow: ShadowRoot;
    private _clock?: ReturnType<typeof setInterval>;
    private _resizeObserver?: ResizeObserver;

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: 'open' });
    }

    setConfig(config: SunTrackerConfig): void {
        if (!config.sun_entity) {
            throw new Error('Please define a sun_entity (e.g. sun.sun)');
        }
        this.config = { ...config };
        this._render();
    }

    set hass(hass: HomeAssistant) {
        const sunId = this.config.sun_entity || '';
        const moonId = this.config.moon_entity || '';
        const oldSun = this._hass?.states[sunId];
        const newSun = hass.states[sunId];
        const oldMoonPhase = this._hass?.states[moonId]?.state;
        const newMoonPhase = hass.states[moonId]?.state;
        const localeChanged = localeKey(this._hass) !== localeKey(hass);
        const weatherId = this.config.weather_entity || '';
        const weatherChanged = weatherId && this._hass?.states[weatherId]?.state !== hass.states[weatherId]?.state;
        this._hass = hass;

        const oldElev = oldSun?.attributes?.elevation;
        const newElev = newSun?.attributes?.elevation;
        const sunChanged = !oldSun || oldSun.state !== newSun?.state
            || oldSun.attributes?.next_rising !== newSun?.attributes?.next_rising
            || oldSun.attributes?.next_setting !== newSun?.attributes?.next_setting
            || Math.abs((oldElev || 0) - (newElev || 0)) >= 0.5;
        const moonChanged = moonId && oldMoonPhase !== newMoonPhase;
        if (sunChanged || moonChanged || localeChanged || weatherChanged) {
            this._render();
        }
    }

    connectedCallback(): void {
        // The "now" dot and the countdown move with the clock, not with HA.
        if (!this._clock) this._clock = setInterval(() => this._render(), 60_000);
        if (!this._resizeObserver && typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => this._fit());
            this._resizeObserver.observe(this);
        }
    }

    disconnectedCallback(): void {
        if (this._clock) clearInterval(this._clock);
        this._clock = undefined;
        this._resizeObserver?.disconnect();
        this._resizeObserver = undefined;
    }

    /**
     * Fit the content to the frame. In masonry the card grows to its content
     * and stays "regular"; in a fixed-height frame (sections view) it steps
     * down until nothing overflows: "compact" drops first and last light,
     * "short" also drops the countdown and tightens the headline, "tight"
     * keeps only the headline and the sun path. At each step the details
     * take the columns their count and width call for.
     */
    private _fit(): void {
        const card = this._shadow.querySelector('.st-card') as HTMLElement | null;
        if (!card) return;
        const metrics = card.querySelector('.st-metrics') as HTMLElement | null;
        for (const state of ['regular', 'compact', 'short', 'tight']) {
            card.dataset.fit = state;
            if (metrics) {
                // Each fit shows a different number of details, so the columns follow it
                const shown = Array.from(metrics.children).filter(el => getComputedStyle(el).display !== 'none').length;
                metrics.style.setProperty('--st-cols', String(detailColumns(shown, metrics.clientWidth)));
            }
            if (card.scrollHeight <= card.clientHeight + 1) return;
        }
    }

    getCardSize(): number { return this.config.compact ? 2 : 6; }

    /**
     * Sections view: full section width. Six rows (~376px) fit everything;
     * compact needs two (it trims down to one).
     */
    getGridOptions() {
        return this.config.compact
            ? { columns: 12, rows: 2, min_columns: 6, min_rows: 1 }
            : { columns: 12, rows: 6, min_columns: 6, min_rows: 3 };
    }

    /**
     * The sky's condition: a configured weather entity's, so the tracker
     * shares the sky of the weather card it sits with; otherwise a clear sky.
     */
    private _skyCondition(phase: SkyPhase): SkyCondition {
        const id = this.config.weather_entity;
        const state = id ? this._hass?.states[id]?.state : undefined;
        if (state && state !== 'unavailable' && state !== 'unknown') {
            const weatherClass = getWeatherClass(state, false, undefined, undefined, this._hass?.config?.time_zone);
            if ((SKY_CONDITIONS as readonly string[]).includes(weatherClass)) return weatherClass as SkyCondition;
        }
        return phase === 'night' ? 'clear-night' : 'sunny';
    }

    static getConfigElement() {
        return document.createElement('animated-sun-tracker-editor');
    }
    static getStubConfig() {
        return { sun_entity: 'sun.sun', moon_entity: 'sensor.moon_phase' };
    }

    private _getSunData(): (SunData & { rising: boolean }) | null {
        if (!this._hass || !this.config.sun_entity) return null;
        const e = this._hass.states[this.config.sun_entity];
        if (!e) return null;
        return {
            sunrise: e.attributes.next_rising || null,
            sunset: e.attributes.next_setting || null,
            dawn: e.attributes.next_dawn || null,
            dusk: e.attributes.next_dusk || null,
            noon: e.attributes.next_noon || null,
            elevation: typeof e.attributes.elevation === 'number' ? e.attributes.elevation : null,
            aboveHorizon: e.state === 'above_horizon',
            rising: !!e.attributes.rising,
        };
    }

    private _getMoonData(): MoonData | null {
        if (!this._hass || !this.config.moon_entity) return null;
        const e = this._hass.states[this.config.moon_entity];
        if (!e) return null;
        const phase = e.state;
        // Home Assistant's own translation of the phase, in the user's language
        let localized: string | undefined;
        try { localized = this._hass.formatEntityState?.(e); } catch { /* older HA */ }
        return {
            phase,
            phaseName: (localized && localized !== phase ? localized : undefined)
                || MOON_PHASE_NAMES[phase] || phase.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            icon: moonPhaseToIcon(phase)
        };
    }

    private _render(): void {
        const sun = this._getSunData();
        const moon = this._getMoonData();
        const colorized = this.config.color_palette !== 'theme';

        if (!sun || !sun.sunrise || !sun.sunset) {
            this._mount('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>', null);
            return;
        }

        const now = new Date();
        const nowHour = now.getHours() + now.getMinutes() / 60;
        const riseH = isoToHours(sun.sunrise);
        const setH = isoToHours(sun.sunset);
        const dawnH = sun.dawn ? isoToHours(sun.dawn) : Math.max(0, riseH - 0.5);
        const duskH = sun.dusk ? isoToHours(sun.dusk) : Math.min(24, setH + 0.5);
        const dayLength = setH - riseH;

        // Headline: whichever of sunrise / sunset comes next
        const nextIsSunset = sun.aboveHorizon;
        const nextIso = nextIsSunset ? sun.sunset : sun.sunrise;
        const untilMs = new Date(nextIso).getTime() - now.getTime();
        const hass = this._hass;
        const t = (key: Parameters<typeof localizeString>[1]) => escapeHtml(localizeString(hass, key));
        const time = (iso: string | null) => timeHtml(formatTime(iso, hass));
        const countdown = untilMs > 0
            ? localizeString(hass, 'in_duration', { duration: formatDuration(untilMs / 3600000, hass) })
            : '';

        // Sky for the current phase
        const phase = skyPhaseFromSun(sun.elevation, sun.rising, sun.aboveHorizon);
        const sky = skyColors(this._skyCondition(phase), phase);
        const skyVars: Record<string, string> | null = colorized ? {
            '--awc-sky-top': sky.top, '--awc-sky-mid': sky.mid, '--awc-sky-bottom': sky.bottom,
            '--awc-sky-glow': sky.glow, '--awc-sky-scrim': sky.scrim,
        } : null;

        // Sun path
        const geo = this.config.compact ? COMPACT_PATH : REGULAR_PATH;
        const path = sunPath(riseH, setH, geo);
        const dayFill = `${path} L${VW},${geo.horizon} L0,${geo.horizon} Z`;
        const nowElevation = pathElevation(nowHour, riseH, setH);
        const dotLeft = (nowHour / 24) * 100;
        const dotTop = (yFor(nowElevation, geo) / VH) * 100;
        // Twilight as a warm glow on the horizon where the sun crosses it,
        // as wide as the twilight itself (dawn → sunrise, sunset → dusk).
        const twilight = (sunHour: number, twilightHours: number) => {
            const rx = Math.max(70, (Math.abs(twilightHours) / 24) * VW * 2.4);
            return `<ellipse cx="${xFor(sunHour).toFixed(1)}" cy="${geo.horizon}" rx="${rx.toFixed(1)}" ry="${geo.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`;
        };

        const compact = !!this.config.compact;
        const showHeader = this.config.show_header !== false;
        const heroHtml = showHeader ? `
            <div class="st-hero">
                ${this.config.title && !compact ? `<div class="st-title">${escapeHtml(this.config.title)}</div>` : ''}
                <div class="st-eyebrow">
                    <ha-icon icon="${nextIsSunset ? 'mdi:weather-sunset-down' : 'mdi:weather-sunset-up'}"></ha-icon>
                    <span>${t(nextIsSunset ? 'sunset' : 'sunrise')}</span>
                </div>
                <div class="st-time">${time(nextIso)}</div>
                ${countdown ? `<div class="st-countdown">${escapeHtml(countdown)}</div>` : ''}
            </div>` : (this.config.title && !compact ? `<div class="st-hero"><div class="st-title">${escapeHtml(this.config.title)}</div></div>` : '');

        const metric = (kind: string, icon: string, label: string, valueHtml: string, wrap = false) => `
                <div class="st-metric" data-kind="${kind}">
                    <div class="st-metric-label"><ha-icon icon="${icon}"></ha-icon><span title="${label}">${label}</span></div>
                    <div class="st-metric-value${wrap ? ' wrap' : ''}">${valueHtml}</div>
                </div>`;
        const showDetails = !compact && this.config.show_details !== false;
        // Compact: the other event, small, in the chart's open sky
        const noteHtml = compact && showHeader ? `
                        <div class="st-chart-note">${t(nextIsSunset ? 'sunrise' : 'sunset')}<span class="st-chart-note-time">${time(nextIsSunset ? sun.sunrise : sun.sunset)}</span></div>` : '';
        const detailsHtml = showDetails ? `
            <div class="st-metrics">
                ${nextIsSunset
                    ? metric('sunrise', 'mdi:weather-sunset-up', t('sunrise'), time(sun.sunrise))
                    : metric('sunset', 'mdi:weather-sunset-down', t('sunset'), time(sun.sunset))}
                ${metric('noon', 'mdi:white-balance-sunny', t('solar_noon'), time(sun.noon))}
                ${metric('daylight', 'mdi:timer-sand', t('daylight'), escapeHtml(formatDuration(dayLength, hass)))}
                ${metric('first-light', 'mdi:weather-sunset', t('first_light'), time(sun.dawn))}
                ${metric('last-light', 'mdi:weather-night', t('last_light'), time(sun.dusk))}
                ${moon ? metric('moon', moon.icon, t('moon'), escapeHtml(moon.phaseName), true) : ''}
            </div>` : '';

        // Chart description for screen readers; HA translates the sun's state
        const sunEntity = this.config.sun_entity ? hass?.states[this.config.sun_entity] : undefined;
        let sunState = '';
        try { sunState = (sunEntity && hass?.formatEntityState?.(sunEntity)) || ''; } catch { /* older HA */ }
        const summary = [
            `${localizeString(hass, 'sunrise')} ${formatTime(sun.sunrise, hass)}`,
            `${localizeString(hass, 'sunset')} ${formatTime(sun.sunset, hass)}`,
            sunState,
        ].filter(Boolean).join(' · ');

        this._mount(`
                    ${heroHtml}
                    <div class="st-chart" role="img" aria-label="${escapeHtml(summary)}">
                        <svg viewBox="0 0 ${VW} ${VH}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${VW}" height="${geo.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${geo.horizon}" width="${VW}" height="${VH - geo.horizon}"/></clipPath>
                            </defs>
                            ${twilight(riseH, riseH - dawnH)}
                            ${twilight(setH, duskH - setH)}
                            <path d="${dayFill}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${geo.horizon}" x2="${VW}" y2="${geo.horizon}" class="st-horizon"/>
                            <line x1="${xFor(nowHour).toFixed(1)}" y1="0" x2="${xFor(nowHour).toFixed(1)}" y2="${VH}" class="st-now-line"/>
                            <path d="${path}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${path}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${nowElevation < 0 ? 'below' : ''}" style="left: ${dotLeft.toFixed(2)}%; top: ${dotTop.toFixed(2)}%;"></div>${noteHtml}
                    </div>
                    ${detailsHtml}`, skyVars);
    }

    /**
     * Show new content in the card. The card element itself is kept across
     * renders (only its contents are replaced), so a change of sky colors
     * cross-fades instead of snapping on the minute's re-render.
     */
    private _mount(content: string, skyVars: Record<string, string> | null): void {
        let card = this._shadow.querySelector('.st-card') as HTMLElement | null;
        if (!card) {
            this._shadow.innerHTML = `<style>${STYLES}</style><ha-card><div class="st-card"></div></ha-card>`;
            card = this._shadow.querySelector('.st-card') as HTMLElement;
        }
        const sky = !!skyVars;
        card.classList.toggle('sky', sky);
        card.classList.toggle('compact', !!this.config.compact);
        card.parentElement?.classList.toggle('sky', sky);
        for (const name of SKY_COLOR_PROPERTIES) {
            if (skyVars) card.style.setProperty(name, skyVars[name]);
            else card.style.removeProperty(name);
        }
        card.innerHTML = content;
        this._fit();
    }
}

// ── Config editor ──
const EDITOR_STYLES = `
    .st-editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0;
    }
    .st-editor .st-switches {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 4px;
    }
    .st-editor .st-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 48px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
    }
    .st-editor .st-switch small {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
`;

class AnimatedSunTrackerEditor extends HTMLElement {
    private _config: SunTrackerConfig = {};
    private _hass?: HomeAssistant;
    private _initialized = false;

    setConfig(config: SunTrackerConfig): void {
        this._config = { ...config };
        if (this._initialized) this._render();
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        if (this._initialized && this.isConnected) {
            this._updatePickers();
        }
    }

    async connectedCallback() {
        this._config = this._config || {};
        await this._ensureEntityPickerLoaded();
        this._render();
        this._initialized = true;
        if (this._hass) this._updatePickers();
    }

    disconnectedCallback() {
        this.innerHTML = '';
    }

    /** Force HA to lazy-load the ha-entity-picker component */
    private async _ensureEntityPickerLoaded(): Promise<void> {
        if (customElements.get('ha-entity-picker')) return;
        try {
            const helpers = await (window as any).loadCardHelpers!();
            const tmp = await helpers.createCardElement({ type: 'entities', entities: [] });
            // Suppress harmless hass-undefined errors during module load
            const suppress = (e: PromiseRejectionEvent) => {
                if (e.reason?.message?.includes('localize') || e.reason?.message?.includes('hass')) {
                    e.preventDefault();
                }
            };
            window.addEventListener('unhandledrejection', suppress);
            try { await tmp.constructor.getConfigElement(); } catch (_) { /* ignore */ }
            setTimeout(() => window.removeEventListener('unhandledrejection', suppress), 2000);
        } catch (_) { /* silently ignore */ }
    }

    private _render(): void {
        const c = this._config;
        const toggle = (id: string, label: string, hint: string, checked: boolean) => `
                    <label class="st-switch" for="${id}">
                        <span>${label}<small>${hint}</small></span>
                        <ha-switch id="${id}" ${checked ? 'checked' : ''}></ha-switch>
                    </label>`;
        this.innerHTML = `
            <style>${EDITOR_STYLES}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${textField({ id: 'title', label: 'Title (optional)', value: c.title })}
                <div class="st-switches">
                    ${toggle('compact', 'Compact', 'One line: the next sunrise or sunset beside the sun\'s path', !!c.compact)}
                    ${toggle('show_header', 'Next sunrise or sunset', 'The headline time and countdown', c.show_header !== false)}
                    ${toggle('show_details', 'Details', 'First and last light, solar noon, daylight, moon', c.show_details !== false)}
                    ${toggle('theme_palette', 'Blend with dashboard theme', 'Use theme colors instead of the sky', c.color_palette === 'theme')}
                </div>
            </div>
        `;
        this._updatePickers();
        this._attachListeners();
    }

    private _updatePickers(): void {
        const pickers = [
            { id: '#sun-picker', value: this._config.sun_entity || '', label: 'Sun entity', domains: ['sun'] },
            { id: '#moon-picker', value: this._config.moon_entity || '', label: 'Moon phase entity (optional)', domains: ['sensor'] },
            { id: '#weather-picker', value: this._config.weather_entity || '', label: 'Share the sky of a weather entity (optional)', domains: ['weather'] },
        ];
        for (const p of pickers) {
            const el = this.querySelector(p.id) as any;
            if (!el) continue;
            if (this._hass) el.hass = this._hass;
            el.value = p.value;
            el.label = p.label;
            el.includeDomains = p.domains;
        }
    }

    private _attachListeners(): void {
        this.querySelector('#sun-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ sun_entity: e.detail.value });
        });
        this.querySelector('#moon-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ moon_entity: e.detail.value || undefined });
        });
        this.querySelector('#weather-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ weather_entity: e.detail.value || undefined });
        });
        this.querySelector('#title')?.addEventListener('input', (e: Event) => {
            this._update({ title: (e.target as HTMLInputElement).value || undefined });
        });
        const onSwitch = (id: string, apply: (checked: boolean) => Partial<SunTrackerConfig>) => {
            this.querySelector(`#${id}`)?.addEventListener('change', (e: Event) => {
                this._update(apply((e.target as HTMLInputElement).checked));
            });
        };
        onSwitch('compact', checked => ({ compact: checked || undefined }));
        onSwitch('show_header', checked => ({ show_header: checked }));
        onSwitch('show_details', checked => ({ show_details: checked }));
        onSwitch('theme_palette', checked => ({ color_palette: checked ? 'theme' : undefined }));
    }

    private _update(patch: Partial<SunTrackerConfig>): void {
        const next: Record<string, unknown> = { ...this._config, ...patch };
        for (const key of Object.keys(next)) {
            if (next[key] === undefined || next[key] === '') delete next[key];
        }
        this._config = next as SunTrackerConfig;
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        }));
    }
}

// ── Registration ──
customElements.define('animated-sun-tracker-card', AnimatedSunTrackerCard);
customElements.define('animated-sun-tracker-editor', AnimatedSunTrackerEditor);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: 'animated-sun-tracker-card',
    name: 'Animated Sun Tracker',
    description: 'The sun\'s path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase',
    preview: false,
    documentationURL: 'https://github.com/alexsto1an/ha-ani-weather-card'
});
