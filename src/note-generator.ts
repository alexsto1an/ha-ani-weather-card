// The weather note, written by Home Assistant's AI Task from the forecast
// (show_note). It ships in its own bundle, animated-weather-card-note.js,
// which only cards that write their own note load.
//
// Facts first, then the voice: the card works out what the forecast says
// (the first wet and dry hours, the high and low, gusts, UV, anything
// severe) and the model only puts it into words. A note can't say "rain at
// three" unless the forecast does.

import { AnimatedWeatherCardConfig, HassEntity, HomeAssistant } from './types';
import { HA_CONDITION_NAMES, WeatherNote } from './weather-data';
import { convertWindSpeedToKmh, lookup } from './utils';
import { cardLanguage, formatTime } from './localize';

/** One forecast entry, as weather/subscribe_forecast sends it. Every field but the time is optional. */
export interface ForecastEntry {
    datetime: string;
    condition?: string;
    temperature?: number;
    templow?: number;
    apparent_temperature?: number;
    precipitation_probability?: number;
    precipitation?: number;
    wind_speed?: number;
    wind_gust_speed?: number;
    uv_index?: number;
    is_daytime?: boolean;
}

export type ForecastType = 'hourly' | 'twice_daily' | 'daily';

export type NoteTone = 'snarky' | 'calm' | 'friendly' | 'dry';

/** What falls, or would. */
export type Precipitation = 'rain' | 'snow' | 'sleet' | 'hail' | 'rain or snow';
export const NOTE_TONES: readonly NoteTone[] = ['snarky', 'calm', 'friendly', 'dry'];

/** An "out of the house" window, for what to wear. */
export interface NoteWindow {
    label: string;
    low?: number;
    high?: number;
    /** Highest chance of rain inside it, in percent */
    wetChance?: number;
    wet: boolean;
}

/** What the forecast says, worked out before the model sees any of it. */
export interface NoteFacts {
    /** Home Assistant's state for now ("partlycloudy") */
    condition: string;
    temperature?: number;
    feelsLike?: number;
    windSpeed?: number;
    units: { temperature: string; wind: string; precipitation: string };
    /** What the outlook was read from; null with no forecast at all */
    forecast: ForecastType | null;
    /** How many hours ahead the outlook covers */
    hours: number;
    /**
     * Rain or snow: none expected, falling now (until dryFrom, if it
     * stops), starting later (at wetFrom), or all the way through.
     */
    wet: 'none' | 'now' | 'later' | 'all';
    /**
     * What falls, or would: from the conditions where the forecast names
     * them, else from the air temperature. Snow comes up only when it's
     * cold enough for it, so a mild evening is "no rain", not "no rain or
     * snow".
     */
    precipitation: Precipitation;
    wetFrom?: string;
    dryFrom?: string;
    high?: number;
    low?: number;
    /** When the warmest and coldest hours are (hourly forecasts only), so the note can say which way it's going */
    highAt?: string;
    lowAt?: string;
    /** Whether high and low are feels-like temperatures, or the air's */
    feelsLikeRange: boolean;
    gustMax?: number;
    uvMax?: number;
    windows: NoteWindow[];
    /** Why the weather is serious enough to drop the jokes, or null */
    severe: string | null;
    /** What the forecast doesn't say, so the model doesn't make it up */
    missing: string[];
    /** The hours themselves, one line each, for colour */
    table: string[];
}

export interface FactsInput {
    /** The weather entity: now, and the units everything comes in */
    weather: HassEntity;
    forecast: ForecastEntry[] | null;
    forecastType: ForecastType | null;
    /** When you're out of the house, from your calendar (calendarWindows) */
    windows?: NoteSpan[];
    now: number;
    /** A clock time the way the dashboard writes them ("15:00", "3:00 PM") */
    formatHour: (date: Date) => string;
}

/** How far ahead an hourly note looks. */
export const NOTE_HOURS = 12;

const WET_CONDITIONS = new Set(['rainy', 'pouring', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail']);
const RAIN_CONDITIONS = new Set(['rainy', 'pouring', 'lightning-rainy']);
/** At or below this air temperature (°C), rain may fall as snow */
const SNOW_POSSIBLE_C = 3;
/** At or below this, it falls as snow */
const SNOW_LIKELY_C = 0;
const SEVERE_CONDITIONS: Record<string, string> = {
    'lightning': 'thunderstorms',
    'lightning-rainy': 'thunderstorms',
    'hail': 'hail',
    'exceptional': 'exceptional weather',
};
/** Heavy rain: 8 mm in an hour */
const HEAVY_RAIN_MM = 8;
/** A gale's gusts */
const SEVERE_GUST_KMH = 75;
/** Feels-like temperatures dangerous to be out in, in °C */
const SEVERE_COLD_C = -20;
const SEVERE_HEAT_C = 38;

const num = (value: unknown): number | undefined =>
    typeof value === 'number' && isFinite(value) ? value : undefined;
const toCelsius = (value: number, unit: string) => /f/i.test(unit) ? (value - 32) * 5 / 9 : value;
const toMm = (value: number, unit: string) => /^in/i.test(unit) ? value * 25.4 : value;
const round = (value: number | undefined) => value === undefined ? undefined : Math.round(value);

/** Wet by its chance of rain where the forecast gives one, else by the amount, else by the condition. */
function isWet(entry: ForecastEntry, precipitationUnit: string): boolean {
    const chance = num(entry.precipitation_probability);
    if (chance !== undefined) return chance >= 50;
    const amount = num(entry.precipitation);
    if (amount !== undefined) return toMm(amount, precipitationUnit) >= 0.1;
    return WET_CONDITIONS.has(entry.condition ?? '');
}

/**
 * What falls, or would: the conditions the forecast names win; without
 * them, the coldest air temperature decides whether snow is possible.
 */
function precipitationOf(conditions: (string | undefined)[], airTemps: (number | undefined)[], unit: string): Precipitation {
    const named = new Set(conditions.filter((c): c is string => !!c && WET_CONDITIONS.has(c)));
    const rain = [...named].some(c => RAIN_CONDITIONS.has(c));
    if (named.has('snowy-rainy')) return 'sleet';
    if (named.has('snowy')) return rain ? 'rain or snow' : 'snow';
    if (rain) return 'rain';
    if (named.has('hail')) return 'hail';
    const temps = airTemps.filter((t): t is number => t !== undefined).map(t => toCelsius(t, unit));
    if (!temps.length) return 'rain';
    const coldest = Math.min(...temps);
    return coldest <= SNOW_LIKELY_C ? 'snow' : coldest <= SNOW_POSSIBLE_C ? 'rain or snow' : 'rain';
}

/** A stretch of time, in ms since the epoch */
export interface NoteSpan {
    start: number;
    end: number;
}

/** An event as calendar.get_events returns it: all-day events have dates, timed ones date-times */
export interface CalendarEvent {
    start: string;
    end: string;
    summary?: string;
    location?: string | null;
    description?: string | null;
    status?: string | null;
}

/** Events closer than this are one stretch out: you don't go home in between */
const MERGE_GAP_MS = 30 * 60_000;
/** At most this many stretches out, so the instructions stay short */
const MAX_WINDOWS = 3;
/** A location that's a link is a call, not a place */
const ONLINE_LOCATION = /https?:\/\/|www\./i;

/**
 * When you're out of the house in the hours ahead, from your calendar:
 * its timed events, but not all-day, cancelled or online ones (a location
 * that's a link). Events closer than half an hour run together, the
 * earliest three count, and each keeps its real start and end, so the
 * window an event under way makes doesn't change from one look to the next.
 */
export function calendarWindows(events: readonly CalendarEvent[], now: number, hours = NOTE_HOURS): NoteSpan[] {
    const horizon = now + hours * 3600_000;
    const spans = events
        .filter(e => typeof e?.start === 'string' && e.start.includes('T') && typeof e.end === 'string')
        .filter(e => String(e.status ?? '').toLowerCase() !== 'cancelled' && !ONLINE_LOCATION.test(e.location ?? ''))
        .map(e => ({ start: Date.parse(e.start), end: Date.parse(e.end) }))
        .filter(span => span.end > span.start && span.end > now && span.start < horizon)
        .sort((a, b) => a.start - b.start);
    const merged: NoteSpan[] = [];
    for (const span of spans) {
        const last = merged[merged.length - 1];
        if (last && span.start - last.end < MERGE_GAP_MS) last.end = Math.max(last.end, span.end);
        else merged.push({ ...span });
    }
    return merged.slice(0, MAX_WINDOWS);
}

/** Work out the facts a note may state. */
export function computeFacts({ weather, forecast, forecastType, windows = [], now, formatHour }: FactsInput): NoteFacts {
    const attrs = weather.attributes ?? {};
    const units = {
        temperature: String(attrs.temperature_unit ?? '°C'),
        wind: String(attrs.wind_speed_unit ?? 'km/h'),
        precipitation: String(attrs.precipitation_unit ?? 'mm'),
    };
    const facts: NoteFacts = {
        condition: weather.state,
        temperature: num(attrs.temperature),
        feelsLike: num(attrs.apparent_temperature),
        windSpeed: num(attrs.wind_speed),
        units,
        forecast: null,
        hours: 0,
        wet: WET_CONDITIONS.has(weather.state) ? 'now' : 'none',
        precipitation: precipitationOf([weather.state], [num(attrs.temperature)], String(attrs.temperature_unit ?? '°C')),
        feelsLikeRange: false,
        windows: [],
        severe: SEVERE_CONDITIONS[weather.state] ?? null,
        missing: [],
        table: [],
    };
    const name = (condition?: string) => condition ? (lookup(HA_CONDITION_NAMES, condition) ?? condition).toLowerCase() : undefined;
    const degrees = (value?: number) => value === undefined ? undefined : `${Math.round(value)}${units.temperature}`;

    const entries = (forecast ?? []).filter(e => !isNaN(Date.parse(e.datetime)));
    if (!forecastType || !entries.length) {
        facts.missing.push('the forecast');
        return finishSevere(facts, [], units);
    }
    facts.forecast = forecastType;

    if (forecastType === 'hourly') {
        // From the hour under way, twelve hours on
        const ahead = entries
            .filter(e => Date.parse(e.datetime) > now - 60 * 60_000)
            .slice(0, NOTE_HOURS);
        if (!ahead.length) {
            facts.missing.push('the forecast');
            return finishSevere(facts, [], units);
        }
        facts.hours = ahead.length;
        const at = (e: ForecastEntry) => formatHour(new Date(e.datetime));

        // The hour under way is wet if it's raining now, whatever its forecast said
        const wet = ahead.map((e, i) => isWet(e, units.precipitation) || (i === 0 && WET_CONDITIONS.has(weather.state)));
        const firstWet = wet.indexOf(true);
        if (firstWet === -1) {
            facts.wet = 'none';
        } else if (firstWet === 0) {
            const firstDry = wet.indexOf(false);
            if (firstDry === -1) facts.wet = 'all';
            else {
                facts.wet = 'now';
                facts.dryFrom = at(ahead[firstDry]);
            }
        } else {
            facts.wet = 'later';
            facts.wetFrom = at(ahead[firstWet]);
            const dryAgain = wet.indexOf(false, firstWet);
            if (dryAgain !== -1) facts.dryFrom = at(ahead[dryAgain]);
        }

        // What falls in the wet hours, or would in any of them if none are
        const falling = wet.some(Boolean) ? ahead.filter((_, i) => wet[i]) : ahead;
        facts.precipitation = precipitationOf(
            [...falling.map(e => e.condition), ...(WET_CONDITIONS.has(weather.state) ? [weather.state] : [])],
            [...falling.map(e => num(e.temperature)), ...(wet[0] ? [facts.temperature] : [])],
            units.temperature,
        );

        // Feels-like where every hour has one; a mix would compare unlike numbers
        facts.feelsLikeRange = ahead.every(e => num(e.apparent_temperature) !== undefined);
        const temp = (e: ForecastEntry) => num(facts.feelsLikeRange ? e.apparent_temperature : e.temperature);
        const temps = ahead.map(temp).filter((t): t is number => t !== undefined);
        if (temps.length) {
            facts.high = Math.max(...temps);
            facts.low = Math.min(...temps);
            facts.highAt = at(ahead.find(e => temp(e) === facts.high)!);
            facts.lowAt = at(ahead.find(e => temp(e) === facts.low)!);
        }
        const gusts = ahead.map(e => num(e.wind_gust_speed)).filter((g): g is number => g !== undefined);
        if (gusts.length) facts.gustMax = Math.max(...gusts);
        const uv = ahead.map(e => num(e.uv_index)).filter((u): u is number => u !== undefined);
        if (uv.length) facts.uvMax = Math.max(...uv);

        for (const span of windows) {
            const inside = ahead.filter(e => {
                const t = Date.parse(e.datetime);
                return t + 60 * 60_000 > span.start && t < span.end;
            });
            if (!inside.length) continue;
            const wTemps = inside.map(temp).filter((t): t is number => t !== undefined);
            const chances = inside.map(e => num(e.precipitation_probability)).filter((c): c is number => c !== undefined);
            facts.windows.push({
                label: `${formatHour(new Date(span.start))}–${formatHour(new Date(span.end))}`,
                low: wTemps.length ? Math.min(...wTemps) : undefined,
                high: wTemps.length ? Math.max(...wTemps) : undefined,
                wetChance: chances.length ? Math.max(...chances) : undefined,
                wet: inside.some(e => isWet(e, units.precipitation)),
            });
        }

        if (!facts.feelsLikeRange) facts.missing.push('feels-like temperatures ahead');
        if (ahead.every(e => num(e.precipitation_probability) === undefined)) facts.missing.push('the chance of rain');
        if (!gusts.length) facts.missing.push('gusts');
        if (!uv.length) facts.missing.push('the UV index');

        facts.table = ahead.map(e => [
            at(e),
            name(e.condition),
            degrees(num(e.temperature)),
            num(e.apparent_temperature) !== undefined ? `feels ${degrees(e.apparent_temperature)}` : undefined,
            num(e.precipitation_probability) !== undefined ? `rain ${Math.round(e.precipitation_probability!)}%` : undefined,
            num(e.wind_speed) !== undefined ? `wind ${Math.round(e.wind_speed!)} ${units.wind}` : undefined,
        ].filter(Boolean).join(', '));
        return finishSevere(facts, ahead, units, true);
    }

    // Daily or twice-daily: today (and tonight), with no hours to name
    const today = entries.slice(0, forecastType === 'twice_daily' ? 2 : 1);
    facts.hours = 24;
    const highs = today.map(e => num(e.temperature)).filter((t): t is number => t !== undefined);
    const lows = today.map(e => num(e.templow) ?? num(e.temperature)).filter((t): t is number => t !== undefined);
    if (highs.length) facts.high = Math.max(...highs);
    if (lows.length) facts.low = Math.min(...lows);
    if (today.some(e => isWet(e, units.precipitation))) facts.wet = facts.wet === 'now' ? 'all' : 'later';
    facts.precipitation = precipitationOf(
        [...today.map(e => e.condition), weather.state],
        today.flatMap(e => [num(e.templow), num(e.temperature)]),
        units.temperature,
    );
    const gusts = today.map(e => num(e.wind_gust_speed)).filter((g): g is number => g !== undefined);
    if (gusts.length) facts.gustMax = Math.max(...gusts);
    const uv = today.map(e => num(e.uv_index)).filter((u): u is number => u !== undefined);
    if (uv.length) facts.uvMax = Math.max(...uv);
    facts.missing.push('the hours: the forecast is by day');
    facts.table = today.map(e => [
        name(e.condition),
        num(e.temperature) !== undefined ? `high ${degrees(e.temperature)}` : undefined,
        num(e.templow) !== undefined ? `low ${degrees(e.templow)}` : undefined,
        num(e.precipitation_probability) !== undefined ? `rain ${Math.round(e.precipitation_probability!)}%` : undefined,
    ].filter(Boolean).join(', '));
    return finishSevere(facts, today, units);
}

/** Anything serious in the outlook: storms, hail, heavy rain, gale gusts, dangerous cold or heat. */
function finishSevere(facts: NoteFacts, ahead: ForecastEntry[], units: NoteFacts['units'], hourly = false): NoteFacts {
    if (facts.severe) return facts;
    for (const entry of ahead) {
        const reason = SEVERE_CONDITIONS[entry.condition ?? ''];
        if (reason) return { ...facts, severe: reason };
    }
    // An hour's rain; a daily total of 8 mm is just a wet day
    if (hourly && ahead.some(e => toMm(num(e.precipitation) ?? 0, units.precipitation) >= HEAVY_RAIN_MM)) {
        return { ...facts, severe: 'heavy rain' };
    }
    const gusts = [facts.gustMax, ...ahead.map(e => num(e.wind_gust_speed))].filter((g): g is number => g !== undefined);
    if (gusts.some(g => convertWindSpeedToKmh(g, units.wind) >= SEVERE_GUST_KMH)) return { ...facts, severe: 'gale-force gusts' };
    const feels = [facts.feelsLike, ...(facts.feelsLikeRange ? [facts.high, facts.low] : [])]
        .filter((t): t is number => t !== undefined)
        .map(t => toCelsius(t, units.temperature));
    if (feels.some(t => t <= SEVERE_COLD_C)) return { ...facts, severe: 'dangerous cold' };
    if (feels.some(t => t >= SEVERE_HEAT_C)) return { ...facts, severe: 'dangerous heat' };
    return facts;
}

/**
 * What a note is written from, coarsely: the condition, when it's wet,
 * the high and low to 2°, anything severe and the windows. When this
 * changes the note is rewritten; small drifts in the numbers don't.
 */
export function factsKey(facts: NoteFacts): string {
    const two = (value?: number) => value === undefined ? null : Math.round(value / 2);
    return JSON.stringify([
        facts.condition, facts.wet, facts.precipitation, facts.wetFrom ?? null, facts.dryFrom ?? null,
        two(facts.high), two(facts.low), facts.severe,
        facts.windows.map(w => [w.label, two(w.low), two(w.high), w.wet]),
    ]);
}

/**
 * Each voice differs in how it works, not just in an adjective: who it
 * talks to, its punctuation, the shape of its sentences and its kind of
 * joke. Words alone flatten into one polite voice; the examples are what
 * set them apart. They fit the same budgets as the note, so they don't
 * teach the model to run long.
 */
export interface NoteVoice {
    brief: string;
    avoid: string;
    /** It jokes: without a nudge, a model's jokes shrink to a word tacked on to the facts */
    jokes: boolean;
    /** A line and a note, for weather less common than rain or a cold morning, so they aren't echoed back */
    examples: readonly (readonly [string, string])[];
}

export const VOICES: Record<NoteTone, NoteVoice> = {
    snarky: {
        brief: 'Snarky and a little unhinged, in the spirit of CARROT Weather: a weather service with opinions and a flair for drama. It treats the weather as a character with petty motives, reaches for absurd but specific comparisons and mock-epic stakes, and ends on a twist. It can tease the reader the way a friend would, never meanly. The useful part still comes through.',
        avoid: 'openers like "Ah", "Oh joy", "Well" and "Looks like"; "Mother Nature"; "brace yourself"; puns that only work in English; the same joke shape twice.',
        jokes: true,
        examples: [
            ['Gusts at 16:00. Hold onto everything.', 'Gusts to 60 km/h from 16:00. Hats need a leash.'],
            ['The fog clocks out at 10:00.', 'At 10:00 the fog finds somewhere better to be. Headlights till then.'],
            ['The sun chose violence today.', '31°C by 15:00, UV 8. Shade, water, a very serious hat.'],
            ['Snow at 18:00. It\'s been rehearsing.', 'Snow from 18:00. Boots with grip, unless sliding is your cardio.'],
        ],
    },
    calm: {
        brief: 'Calm and precise, like Apple Weather: impersonal, short complete sentences, the changes in the order they happen, then the advice. No jokes.',
        avoid: 'jokes; exclamation marks; addressing the reader; adjectives that judge the weather.',
        jokes: false,
        examples: [
            ['Gusts to 60 km/h from 16:00.', 'Gusts to 60 km/h from 16:00. Secure loose items outdoors.'],
            ['Clearing by 10:00.', 'Clear from 10:00, once the fog lifts. Allow extra time before then.'],
            ['High of 31°C at 15:00.', 'Reaching 31°C at 15:00, UV index 8. Shade and water recommended.'],
        ],
    },
    friendly: {
        brief: 'Warm and encouraging, like a friend who checked the forecast for you and texts the one thing you need. It talks to the reader as you, suggests rather than warns, and points at the good part of the day.',
        avoid: 'sarcasm; teasing; more than one exclamation mark; gushing.',
        jokes: false,
        examples: [
            ['Windy later, so tie things down!', 'Gusts to 60 km/h from 16:00. A hood will beat an umbrella.'],
            ['Clear skies by 10:00, promise!', 'Take it slow on the roads. By 10:00 you\'ll have clear skies.'],
            ['Hot one! Water bottle, sunscreen.', 'It\'s 31°C by 15:00 with UV 8. Find shade, keep water handy.'],
        ],
    },
    dry: {
        brief: 'Deadpan, with a straight face: short flat sentences, understatement instead of exaggeration, and the joke in what it leaves unsaid. A weary forecaster who has seen every kind of weather and is mildly unimpressed by this one.',
        avoid: 'exclamation marks; personified weather; big adjectives; explaining the joke.',
        jokes: true,
        examples: [
            ['Gusts at 16:00. Bins may relocate.', 'Gusts to 60 km/h from 16:00. A poor day for umbrellas.'],
            ['Clear by 10:00. Probably.', 'Visibility returns at 10:00. Until then, it doesn\'t. Headlights on.'],
            ['31°C at 15:00. Warm, some say.', '31°C by 15:00 and UV 8. Shade exists for a reason.'],
            ['Snow at 18:00. Act surprised.', 'Snow from 18:00, settling by 21:00. Boots with grip. Sledges optional.'],
        ],
    },
};

/**
 * Raise when the instructions change enough that notes written before
 * should go: a stored note from another version is replaced right away,
 * not after its hour.
 */
export const NOTE_PROMPT_VERSION = 2;

/** "de" → "German". Older WebViews without Intl.DisplayNames get the code. */
export function languageName(code: string): string {
    try {
        return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
    } catch {
        return code;
    }
}

/** The task: who's writing, the rules, then the facts and the hours. */
export function buildInstructions(facts: NoteFacts, options: { tone: NoteTone; language: string }): string {
    const { units } = facts;
    const deg = (value?: number) => value === undefined ? undefined : `${Math.round(value)}${units.temperature}`;
    // The voice comes last, after the facts and the hours, so it's what the model reads last
    const style = VOICES[options.tone] ?? VOICES.snarky;
    const voice = facts.severe
        ? [`Voice: the weather is serious (${facts.severe}). Drop the jokes whatever the usual voice: plain, calm, useful advice.`]
        : [
            `Voice: ${style.brief}`,
            `Avoid: ${style.avoid}`,
            'Examples, for other weather (match the voice; never reuse their facts, words or images):',
            ...style.examples.map(([line, note]) => `- line: ${line} / note: ${note}`),
            style.jokes ? 'Every line and note in this voice carries a joke of your own. Only facts, with no joke, has failed this voice.' : undefined,
            /English/.test(options.language) ? undefined : `Carry the voice into ${options.language} with its own idioms, not translated English jokes.`,
            'Someone who knows the voices should recognise this one from the line alone.',
        ].filter((line): line is string => line !== undefined);

    const now = [
        lookup(HA_CONDITION_NAMES, facts.condition)?.toLowerCase() ?? facts.condition,
        deg(facts.temperature),
        facts.feelsLike !== undefined ? `feels like ${deg(facts.feelsLike)}` : undefined,
        facts.windSpeed !== undefined ? `wind ${Math.round(facts.windSpeed)} ${units.wind}` : undefined,
    ].filter(Boolean).join(', ');

    const ahead = facts.forecast === 'hourly' ? `the next ${facts.hours} hours` : 'today';
    const what = facts.precipitation;
    const What = what[0].toUpperCase() + what.slice(1);
    const wet = {
        none: `No ${what} expected in ${ahead}.`,
        now: facts.dryFrom ? `${What} now, dry from ${facts.dryFrom}.` : facts.forecast ? `${What} now.` : `${What} now. Nothing known about later.`,
        later: facts.wetFrom
            ? `${What} from ${facts.wetFrom}${facts.dryFrom ? `, dry again from ${facts.dryFrom}` : ''}.`
            : `${What} likely ${ahead}.`,
        all: `${What} all through ${ahead}.`,
    }[facts.wet];

    const lines = [
        `Now (already on the card, don't repeat it): ${now}.`,
        facts.forecast ? wet : facts.wet === 'now' ? wet : undefined,
        facts.high !== undefined && facts.low !== undefined
            ? `${facts.feelsLikeRange ? 'Feels like' : 'Temperature'} ${Math.round(facts.low) === Math.round(facts.high)
                ? `${deg(facts.high)} all through ${ahead}`
                : facts.highAt && facts.lowAt
                    ? `${deg(facts.high)} at its warmest (${facts.highAt}) and ${deg(facts.low)} at its coldest (${facts.lowAt}) over ${ahead}`
                    : `${deg(facts.low)} to ${deg(facts.high)} over ${ahead}`}.`
            : undefined,
        facts.gustMax !== undefined ? `Strongest gust: ${Math.round(facts.gustMax)} ${units.wind}.` : undefined,
        facts.uvMax !== undefined && facts.uvMax >= 3 ? `UV index up to ${Math.round(facts.uvMax)}.` : undefined,
        ...facts.windows.map(w => `Out of the house ${w.label}: ${[
            w.low !== undefined && w.high !== undefined ? `${facts.feelsLikeRange ? 'feels like' : ''} ${deg(w.low)} to ${deg(w.high)}`.trim() : undefined,
            w.wetChance !== undefined ? `${Math.round(w.wetChance)}% chance of rain` : w.wet ? 'wet' : 'dry',
        ].filter(Boolean).join(', ')}.`),
        facts.missing.length ? `Not known: ${facts.missing.join('; ')}. Don't guess at these.` : undefined,
    ].filter(Boolean);

    return [
        'You write the note on a weather card on a Home Assistant dashboard: a short line and a slightly longer version of the same thought, in the voice described at the end.',
        'The card already shows the place, the condition and temperature right now, how it feels, the humidity, the wind and the pressure. The note adds what it doesn\'t: what\'s coming in the hours ahead, what that means for going out, what to wear.',
        '',
        'Rules:',
        '- Use only the facts below. Never invent a time, a temperature, a place or an event.',
        '- Mention only the kinds of precipitation the facts mention.',
        '- Don\'t repeat what the card shows: never lead with the current condition or temperature.',
        `- Write in ${options.language}. Keep the units and the times exactly as written below.`,
        '- "line": at most 6 words (40 characters). It must fit one line on a phone.',
        '- "note": at most 15 words (90 characters), and fewer is better: the same point, with one fact and one piece of advice (when it changes, what to wear, an umbrella or not). Anything longer isn\'t shown.',
        facts.windows.length ? '- If the out-of-the-house hours need it, say what to wear for them, without quoting the hours back.' : '- Say what to wear when it matters.',
        '- Never mean about the reader. No profanity, politics, emoji, hashtags or quotation marks.',
        '',
        'Facts:',
        ...lines.map(line => `- ${line}`),
        ...(facts.table.length ? ['', facts.forecast === 'hourly' ? 'By the hour:' : 'By the day:', ...facts.table] : []),
        '',
        ...voice,
    ].join('\n');
}

/** The two fields the model fills, as an AI Task `structure`. */
export const NOTE_STRUCTURE = {
    line: { description: 'At most 6 words (40 characters), in the voice: the most useful thing about the hours ahead, or what to wear. Never the current condition or temperature: the card shows them.', required: true, selector: { text: {} } },
    note: { description: 'The same thought in the voice, in at most 15 words (90 characters), with one useful detail. Never a restatement of the current condition or temperature.', required: true, selector: { text: {} } },
} as const;

/** Straighten what came back: trimmed, one line, no wrapping quotes. Null when there's nothing to show. */
export function parseNote(data: unknown): { line: string; note: string } | null {
    let value = data;
    if (typeof value === 'string') {
        try {
            value = JSON.parse(value);
        } catch {
            value = { note: value };
        }
    }
    if (!value || typeof value !== 'object') return null;
    const clean = (text: unknown) => typeof text === 'string'
        ? text.replace(/\s+/g, ' ').trim().replace(/^["'“”‘’«»„]+|["'“”‘’«»„]+$/g, '').trim()
        : '';
    const record = value as Record<string, unknown>;
    const line = clean(record.line);
    const note = clean(record.note);
    if (!line && !note) return null;
    return { line: line || note, note: note || line };
}

// ── Writing the note ────────────────────────────────────────────────────

/**
 * What the writer needs from the card. Plain names only: esbuild mangles
 * `_` names differently in each bundle.
 */
export interface NoteHost {
    readonly hass?: HomeAssistant;
    readonly config?: AnimatedWeatherCardConfig;
    /** On screen: the tab showing and the card in view. Only then is a note worth a call. */
    readonly noteVisible: boolean;
    /** Show this note, or none */
    showNote(note: WeatherNote | null): void;
    /**
     * A new note is on its way: hold its place instead of showing one
     * that's about to change, and say what's happening (waiting for the
     * forecast, or the note being written), or false when it's done.
     */
    noteWriting(stage: NoteStage | false): void;
}

/** Where a coming note is: waiting for the forecast's first answer, or being written. */
export type NoteStage = 'forecast' | 'writing';

/** A written note, kept in the user's frontend storage for every screen they're signed in on. */
export interface StoredNote {
    /** What it was written for besides the key and the facts: the instructions' version and the unit system */
    signature: string;
    /** factsKey of the facts it states */
    facts: string;
    condition: string;
    line: string;
    note: string;
    /** When it was written, ms since the epoch */
    written: number;
    /** A screen writing a new one, so the others wait for it */
    claim?: { by: string; at: number } | null;
}

/** A note is rewritten after an hour, or sooner when the facts change. */
export const NOTE_REFRESH_MINUTES = 60;
/** How long other screens wait on a screen that said it's writing */
const CLAIM_MS = 45_000;
/**
 * A note this young stands even if this screen reads the facts a little
 * differently (its forecast a moment behind another screen's): only a new
 * condition replaces it sooner. Bounds any disagreement between screens
 * to one rewrite in this long.
 */
const SETTLE_MS = 15 * 60_000;
/** After a failed call, how long before trying again */
const RETRY_MS = 10 * 60_000;
/** The server sets no limit on a generation; this card does */
const TIMEOUT_MS = 30_000;
/** How often to look for a stale note when nothing else happens */
const CHECK_MS = 5 * 60_000;
/** How long to wait for the forecast's first answer before writing without it */
const FORECAST_WAIT_MS = 10_000;
/** The same for the calendar's */
const CALENDAR_WAIT_MS = 10_000;
/** How often to read the calendar again, for events added since */
const CALENDAR_REFRESH_MS = 15 * 60_000;

/**
 * One note for each user, per everything two cards or two screens of that
 * user can differ in: the weather entity, the tone, the AI Task, the
 * calendars the hours out come from, the language and the time zone the
 * times are written in. Two cards that differed in one of these and shared
 * a key would each find the other's note wasn't theirs, and rewrite it,
 * round after round. The hours out themselves change through the day, so
 * they're facts, not part of the key.
 */
export function noteStorageKey(config: AnimatedWeatherCardConfig, language = 'en', timeZone = localTimeZone()): string {
    return ['animated_weather_card_note', config.entity, config.note_tone || 'snarky',
        config.note_ai_task_entity || 'default', noteCalendars(config).join(','), language, timeZone].join(':');
}

/** The browser's time zone: the card writes clock times in it. */
function localTimeZone(): string {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch {
        return '';
    }
}

/** The calendars your hours out come from: one, or a list. */
export function noteCalendars(config: AnimatedWeatherCardConfig): string[] {
    const value = config.note_calendar as unknown;
    const list = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
    return list.map(item => String(item).trim()).filter(Boolean);
}

/**
 * What a note was written for besides its key and its facts: the version of
 * the instructions, and the unit system, which is the server's and the same
 * for every screen (a note in °F is wrong once it's °C).
 */
function noteSignature(hass: HomeAssistant): string {
    return `${NOTE_PROMPT_VERSION}:${hass.config?.unit_system?.temperature ?? ''}`;
}

class NoteProblem extends Error {
    constructor(readonly kind: string, message: string) {
        super(message);
    }
}

/**
 * Writes the card's note with Home Assistant's AI Task, from the forecast,
 * and shares it through the user's frontend storage: every screen signed
 * in as that user shows the same note, and only one of them asks for a
 * new one. Nothing shows when something goes wrong; the card is the same
 * without a note.
 */
export class NoteWriter {
    /** Notes being written on this page, so two cards on one key don't both call */
    private static writing = new Set<string>();
    private readonly id = Math.random().toString(36).slice(2);
    private forecast: ForecastEntry[] | null = null;
    private forecastType: ForecastType | null = null;
    private stored: StoredNote | null = null;
    /** The forecast has answered, or won't: a note written before then would know only now */
    private forecastSettled = false;
    private forecastWait?: ReturnType<typeof setTimeout>;
    /** The calendar's events in the hours ahead, and the same for its first answer */
    private events: CalendarEvent[] = [];
    private calendarSettled = false;
    private calendarWait?: ReturnType<typeof setTimeout>;
    private calendarLoading = false;
    private calendarRead = 0;
    /** The calendars' states last seen: one changes when an event starts or ends */
    private calendarStates: (HassEntity | undefined)[] = [];
    /** Looks again when another screen's claim runs out, in case it never wrote */
    private claimWait?: ReturnType<typeof setTimeout>;
    /**
     * The card has just come into view (or started): a note due now is
     * written behind a placeholder, rather than shown and then replaced.
     * While the card stays in view, the next one just fades through.
     */
    private waking = true;
    /** No AI Task to ask: no placeholder for a note that can't come */
    private unconfigured = false;
    private subscriptions: Promise<(() => void) | void>[] = [];
    private subscribedTo?: string;
    private lastWeather?: HassEntity;
    private timer?: ReturnType<typeof setInterval>;
    private failedAt = 0;
    private warned = new Set<string>();
    /** Started and not stopped: a hass that arrives later finishes the start */
    private running = false;

    constructor(private readonly host: NoteHost) {}

    /** Subscribe to the forecast and the stored note, and start checking. Safe to call again. */
    start(): void {
        this.running = true;
        this.connect();
    }

    stop(): void {
        this.running = false;
        this.unsubscribe();
        this.subscribedTo = undefined;
    }

    private connect(): void {
        const { hass, config } = this.host;
        if (!hass?.connection || !config?.entity) return;
        const target = noteStorageKey(config, cardLanguage(hass));
        if (this.subscribedTo === target && this.timer) return;
        this.unsubscribe();
        this.subscribedTo = target;
        this.lastWeather = hass.states[config.entity];
        this.waking = true;
        this.stored = null;
        this.forecast = null;
        this.forecastType = null;
        this.events = [];
        this.calendarRead = 0;

        this.subscriptions.push(hass.connection.subscribeMessage<{ value?: StoredNote | null }>(message => {
            this.stored = message?.value && typeof message.value === 'object' ? message.value : null;
            this.check();
        }, { type: 'frontend/subscribe_user_data', key: target }).catch(() => this.check()));

        const type = this.forecastTypeFor(hass.states[config.entity]);
        this.forecastSettled = !type;
        const settle = () => {
            clearTimeout(this.forecastWait);
            this.forecastSettled = true;
            this.check();
        };
        if (type) {
            this.subscriptions.push(hass.connection.subscribeMessage<{ type?: ForecastType; forecast?: ForecastEntry[] | null }>(message => {
                this.forecast = Array.isArray(message?.forecast) ? message.forecast : null;
                this.forecastType = this.forecast ? (message.type ?? type) : null;
                settle();
            }, { type: 'weather/subscribe_forecast', entity_id: config.entity, forecast_type: type }).catch(settle));
            this.forecastWait = setTimeout(settle, FORECAST_WAIT_MS);
        }

        const calendars = noteCalendars(config);
        this.calendarStates = calendars.map(id => hass.states[id]);
        this.calendarSettled = !calendars.length;
        if (calendars.length) {
            this.calendarWait = setTimeout(() => {
                this.calendarSettled = true;
                this.check();
            }, CALENDAR_WAIT_MS);
            void this.readCalendar();
        }
        this.timer = setInterval(() => {
            if (calendars.length && this.host.noteVisible && Date.now() - this.calendarRead >= CALENDAR_REFRESH_MS) void this.readCalendar();
            this.check();
        }, CHECK_MS);
        this.check();
    }

    /**
     * The calendar's events in the hours ahead. A calendar that can't be read
     * leaves the hours out of the note, never the note itself, and keeps the
     * events it last had.
     */
    private async readCalendar(): Promise<void> {
        const { hass, config } = this.host;
        const calendars = config ? noteCalendars(config) : [];
        if (!hass || !calendars.length || this.calendarLoading) return;
        const target = this.subscribedTo;
        this.calendarLoading = true;
        try {
            const result = await hass.callService('calendar', 'get_events', { duration: { hours: NOTE_HOURS } }, { entity_id: calendars }, false, true);
            if (this.subscribedTo !== target) return;
            const response = result?.response ?? {};
            this.events = calendars.flatMap(id => Array.isArray(response[id]?.events) ? response[id].events as CalendarEvent[] : []);
        } catch (err) {
            this.warnOnce('calendar', `couldn't read ${calendars.join(', ')}, so the note is written without your hours out (${err instanceof Error ? err.message : String(err)})`, '');
        } finally {
            this.calendarLoading = false;
            if (this.subscribedTo === target) {
                this.calendarRead = Date.now();
                clearTimeout(this.calendarWait);
                this.calendarSettled = true;
                this.check();
            } else if (this.running && this.subscribedTo) {
                // The card's settings changed while it read: read for the new ones
                void this.readCalendar();
            }
        }
    }

    /** A new hass: a changed weather entity may change the facts. Cheap when it hasn't. */
    hassChanged(): void {
        const { hass, config } = this.host;
        if (!this.running || !hass || !config?.entity) return;
        if (!this.timer || this.subscribedTo !== noteStorageKey(config, cardLanguage(hass))) {
            this.connect();
            return;
        }
        // A calendar starting or ending an event, or with a new one next: read it again
        const states = noteCalendars(config).map(id => hass.states[id]);
        if (states.some((state, i) => state !== this.calendarStates[i])) {
            this.calendarStates = states;
            void this.readCalendar();
        }
        const weather = hass.states[config.entity];
        if (weather !== this.lastWeather) {
            this.lastWeather = weather;
            this.check();
        }
    }

    /** The card came into view, or the tab did: a stale note can be rewritten now. */
    wake(): void {
        if (!this.running || !this.timer) return;
        this.waking = true;
        const { config } = this.host;
        if (config && noteCalendars(config).length && Date.now() - this.calendarRead >= CALENDAR_REFRESH_MS) void this.readCalendar();
        this.check();
    }

    /** Show the stored note if it's about this weather, and write a new one if it's due. */
    check(): void {
        const { hass, config } = this.host;
        const weather = config?.entity ? hass?.states[config.entity] : undefined;
        if (!hass || !config || !weather) return;
        const facts = computeFacts({
            weather, forecast: this.forecast, forecastType: this.forecastType,
            windows: calendarWindows(this.events, Date.now()), now: Date.now(),
            formatHour: date => formatTime(date.toISOString(), hass),
        });
        const key = noteStorageKey(config, cardLanguage(hass));
        const signature = noteSignature(hass);
        const factsId = factsKey(facts);
        const stored = this.stored;
        const now = Date.now();

        // The stored note, while it's still about this weather
        const usable = !!stored?.line && stored.signature === signature && stored.condition === facts.condition;
        const age = now - (stored?.written ?? 0);
        const fresh = usable && age < NOTE_REFRESH_MINUTES * 60_000 && (stored!.facts === factsId || age < SETTLE_MS);
        if (fresh) this.waking = false;

        // Is a new one on its way: written here, by another card on this
        // page, by another screen, or as soon as the forecast answers?
        const visible = this.host.noteVisible;
        const hasAiTask = !!hass.config?.components?.includes('ai_task');
        const backingOff = now - this.failedAt < RETRY_MS;
        const writingHere = NoteWriter.writing.has(key);
        const claim = stored?.claim && stored.claim.by !== this.id && now - stored.claim.at < CLAIM_MS ? stored.claim : null;
        const settled = this.forecastSettled && this.calendarSettled;
        const canWrite = !fresh && visible && hasAiTask && settled && !backingOff && !writingHere && !claim;
        // Not while the AI Task isn't set up: its retries would blink a placeholder every ten minutes
        const coming = !fresh && hasAiTask && !this.unconfigured
            && (canWrite || writingHere || !!claim || (visible && !settled && !backingOff));

        // Show the stored note first, then switch the placeholder: a card
        // coming out of it shows the note it holds, not the one before
        this.host.showNote(usable ? { line: stored!.line, note: stored!.note, writtenAt: stored!.written } : null);
        // Written here, by another card or screen, or about to be; else still waiting for the forecast
        const stage: NoteStage = canWrite || writingHere || claim ? 'writing' : 'forecast';
        this.host.noteWriting(coming && (!usable || this.waking) ? stage : false);

        clearTimeout(this.claimWait);
        if (claim) this.claimWait = setTimeout(() => this.check(), CLAIM_MS - (now - claim.at) + 50);
        if (!fresh && visible && !hasAiTask) {
            this.warnOnce('no-ai-task', 'the note needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task (OpenAI, Anthropic, Google, Ollama…)');
        }
        if (canWrite) void this.write(key, signature, facts, factsId);
    }

    /** Say once, in the console, why there's no note (or what it leaves out). */
    private warnOnce(kind: string, message: string, lead = 'no note, '): void {
        if (this.warned.has(kind)) return;
        this.warned.add(kind);
        console.warn(`Animated Weather Card: ${lead}${message}`);
    }

    private async write(key: string, signature: string, facts: NoteFacts, factsId: string): Promise<void> {
        const hass = this.host.hass!;
        const config = this.host.config!;
        NoteWriter.writing.add(key);
        let claimed = false;
        try {
            const entity = config.note_ai_task_entity || undefined;
            if (!entity) {
                const prefs = await hass.callWS({ type: 'ai_task/preferences/get' }).catch(() => null);
                if (!prefs?.gen_data_entity_id) {
                    throw new NoteProblem('no-entity', 'pick an AI Task entity for the note, or set a default in Settings → System → AI');
                }
            }
            await this.save(key, { ...(this.stored ?? {}), claim: { by: this.id, at: Date.now() } } as StoredNote);
            claimed = true;

            const task = {
                task_name: 'Animated Weather Card note',
                instructions: buildInstructions(facts, { tone: (config.note_tone as NoteTone) || 'snarky', language: languageName(cardLanguage(hass)) }),
                structure: NOTE_STRUCTURE,
                // Without an entity, Home Assistant uses the default AI Task
                ...(entity ? { entity_id: entity } : {}),
            };
            let timeout: ReturnType<typeof setTimeout> | undefined;
            const result = await Promise.race([
                hass.callService('ai_task', 'generate_data', task, undefined, false, true),
                new Promise<never>((_, reject) => {
                    timeout = setTimeout(() => reject(new NoteProblem('timeout', `the AI Task took longer than ${TIMEOUT_MS / 1000} s`)), TIMEOUT_MS);
                }),
            ]).finally(() => clearTimeout(timeout));
            const parsed = parseNote(result?.response?.data);
            if (!parsed) throw new NoteProblem('empty', 'the AI Task answered with no note');

            const note: StoredNote = { signature, facts: factsId, condition: facts.condition, ...parsed, written: Date.now(), claim: null };
            this.stored = note;
            this.unconfigured = false;
            await this.save(key, note);
        } catch (err) {
            this.failedAt = Date.now();
            const kind = err instanceof NoteProblem ? err.kind : 'error';
            if (kind === 'no-entity') this.unconfigured = true;
            this.warnOnce(kind, err instanceof Error ? err.message : String(err));
            // Let another screen try
            if (claimed) await this.save(key, { ...(this.stored ?? {}), claim: null } as StoredNote).catch(() => {});
        } finally {
            NoteWriter.writing.delete(key);
            // The new note, or the last one still true, in place of the placeholder
            this.waking = false;
            this.check();
        }
    }

    private save(key: string, value: StoredNote): Promise<unknown> {
        return this.host.hass!.callWS({ type: 'frontend/set_user_data', key, value });
    }

    /** Hourly where the entity has it (supported_features), then twice daily, then daily. */
    private forecastTypeFor(weather: HassEntity | undefined): ForecastType | null {
        const features = Number(weather?.attributes?.supported_features);
        if (!isFinite(features)) return 'hourly';
        if (features & 2) return 'hourly';
        if (features & 4) return 'twice_daily';
        if (features & 1) return 'daily';
        return null;
    }

    private unsubscribe(): void {
        clearInterval(this.timer);
        this.timer = undefined;
        clearTimeout(this.forecastWait);
        clearTimeout(this.calendarWait);
        clearTimeout(this.claimWait);
        for (const subscription of this.subscriptions) {
            subscription.then(unsub => { if (typeof unsub === 'function') unsub(); }).catch(() => {});
        }
        this.subscriptions = [];
    }
}
