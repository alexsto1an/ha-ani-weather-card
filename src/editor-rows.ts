// The three cards' editors, as tables of rows (the editor bundle): which options each row holds, whether it's one of
// the basics or shows only with "Show all settings", when it applies, and whether the card's config has changed it.
// No DOM and no strings shown, so a test can hold every option to a row. The weather card's table is ROWS, SECTIONS,
// DRAWERS and DEFAULTS (WEATHER_TABLE); the forecast card's and the tracker's are FORECAST_TABLE and TRACKER_TABLE.
//
// A row shows when it applies and is a basic one, or all settings are on, or the config has changed one of its options
// from its default: the switch filters defaults, never what you've set. "Changed" means a value other than the
// default, never a key that's merely there, since the old editor wrote defaults out (`animate: true`) and every new
// card carries `sun_entity: sun.sun`.

import type { AnimatedWeatherCardConfig } from './types';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { engineMode } from './utils';
import { REPLACED_OPTIONS, isDefaultList, readingsOf } from './readings';

type Config = AnimatedWeatherCardConfig;

/** The editor's own state that rows depend on: the mode, and choices not yet in the config */
export interface RowContext {
    /** Show all settings */
    all: boolean;
    /** Weather for another place: on, though nothing's typed yet, or off */
    place: boolean;
    /** The note's source */
    note: 'off' | 'ai' | 'entity';
    /** No default AI Task, so its picker joins the basics */
    noDefaultAi: boolean;
}

/** What the card does when an option is left out */
export const DEFAULTS: Readonly<Record<string, unknown>> = {
    show_location: true, temperature_decimals: 0, compact: false, layout: 'default', color_palette: 'default',
    hero: 'temperature', show_clock: false, show_date: false, show_forecast: false, show_days: false, forecast_days: 7,
    forecast_metric: 'temp', show_chips: true, forecast_graph: 'line',
    show_attributes: true, show_attribute_labels: true, show_attribute_icons: true, show_indoor: true, indoor_style: 'label',
    show_flight_labels: true, flight_label: 'flight', plane_speed: 1, planes_on_load: false,
    animate: true, spill_particles: true, gpu_snow: false, gpu_rain: false, disable_lightning_shake: false, auto_pause: false, dev_mode: false,
    enable_day_night_cycle: false, sunrise_hour: 6, sunset_hour: 20,
    night: 'auto', night_red: true, night_lux: 5, wake_time: '07:00',
    show_note: false, note_tone: 'snarky', note_attribute: 'note', note_max_age: 180, sun_entity: 'sun.sun',
    engine_mode: 'auto',
};

const empty = (v: unknown) => v === undefined || v === null || (typeof v === 'string' && !v.trim()) || (Array.isArray(v) && !v.length);

/** night as the card reads it: YAML-mode dashboards hand `on` and `off` over as true and false */
const nightOf = (v: unknown) => (v === true ? 'on' : v === false ? 'off' : v);

/** One option, other than its default? `engine_settings.rainCount` and `custom_colors.sunny_bg` reach inside */
export function isChanged(config: object, key: string, defaults: Readonly<Record<string, unknown>> = DEFAULTS): boolean {
    const c = config as Record<string, unknown>;
    if (key.startsWith('engine_settings.')) {
        const k = key.slice(16) as keyof typeof DEFAULT_ENGINE_SETTINGS;
        const v = (c.engine_settings as Record<string, unknown> | undefined)?.[k];
        // The card treats anything but a number as unset
        return typeof v === 'number' && isFinite(v) && v !== DEFAULT_ENGINE_SETTINGS[k];
    }
    if (key.startsWith('custom_colors.')) return !empty((c.custom_colors as Record<string, unknown> | undefined)?.[key.slice(14)]);
    const v = c[key];
    if (empty(v)) return false;
    if (!(key in defaults)) return true;
    const d = defaults[key];
    if (key === 'night') return nightOf(v) !== d;
    if (key === 'wake_time') return String(v).replace(/^(\d):/, '0$1:') !== d;
    if (typeof d === 'number') return Number(v) !== d;
    return v !== d;
}

/** The tap with no tap_action, as the card has it: nothing on a nightstand, the forecast with it on, else the details */
export const tapDefault = (c: Config): string => (c.layout === 'nightstand' ? 'none' : c.show_forecast ? 'forecast' : 'more-info');

const action = (v: unknown): string | undefined => (v && typeof v === 'object' && typeof (v as { action?: unknown }).action === 'string' ? (v as { action: string }).action : undefined);

/** The gestures changed: a tap other than the card's own default, or a hold or double tap that does something */
function actionsChanged(c: { tap_action?: unknown; hold_action?: unknown; double_tap_action?: unknown }, tap: string): boolean {
    const set = action(c.tap_action);
    const other = (v: unknown) => { const a = action(v); return a !== undefined && a !== 'none'; };
    return (set !== undefined && set !== tap) || other(c.hold_action) || other(c.double_tap_action);
}

export const ENGINE_KEYS = Object.keys(DEFAULT_ENGINE_SETTINGS).map(k => `engine_settings.${k}`);
export const SKY_COLOR_KEYS = ['sunny_bg', 'cloudy_bg', 'rainy_bg', 'stormy_bg', 'snowy_bg', 'windy_bg', 'fog_color'].map(k => `custom_colors.${k}`);
export const INK_COLOR_KEYS = ['temperature_color', 'text_color', 'sun_color', 'rain_color', 'snow_color'].map(k => `custom_colors.${k}`);

export type Tier = 'basic' | 'all';

export interface RowSpec<C = Config> {
    tier: Tier;
    /** The options it holds */
    keys: readonly string[];
    /** When it applies; a changed row shows even when it doesn't, so nothing set is ever hidden */
    when?: (c: C, x: RowContext) => boolean;
    /** Changed, when it isn't simply one of its keys differing from its default */
    changed?: (c: C) => boolean;
    /** A basic row only in this case (the AI Task, with no default) */
    promote?: (c: C, x: RowContext) => boolean;
    /** Text that explains why something else doesn't apply: it never counts as changed, nor alone shows its section */
    reason?: true;
}

const nightstand = (c: Config) => c.layout === 'nightstand';
const forecastRow = (c: Config, x: RowContext) => !!c.show_forecast && (x.all || !nightstand(c));
const animated = (c: Config) => c.animate !== false;

/** Every row, in the editor's order */
export const ROWS: Readonly<Record<string, RowSpec>> = {
    // Start from (presets.ts): its tiles write the options the rows below hold, so it owns none of its own
    preset: { tier: 'basic', keys: [] },
    // Weather
    entity: { tier: 'basic', keys: ['entity'] },
    name: { tier: 'basic', keys: ['name'] },
    show_location: { tier: 'all', keys: ['show_location'] },
    outdoor_sensor_entity: { tier: 'all', keys: ['outdoor_sensor_entity'] },
    feels_like_entity: { tier: 'all', keys: ['feels_like_entity'] },
    another_place: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'] },
    place_fields: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'], when: (_, x) => x.place },

    // Layout and colors
    // The presets stand in for it among the basics; it shows there once a card is a strip or a nightstand
    layout: { tier: 'all', keys: ['compact', 'layout'] },
    color_palette: { tier: 'basic', keys: ['color_palette'] },
    temperature_decimals: { tier: 'all', keys: ['temperature_decimals'] },

    // Nightstand
    why_nightstand_only: { tier: 'basic', keys: [], reason: true, when: c => !nightstand(c) },
    alarm_entity: { tier: 'basic', keys: ['alarm_entity'], when: nightstand },
    wake_time: { tier: 'basic', keys: ['wake_time'], when: nightstand },
    night: { tier: 'all', keys: ['night'], when: nightstand },
    night_sensor: { tier: 'all', keys: ['night_sensor'], when: c => nightstand(c) && nightOf(c.night ?? 'auto') === 'auto' },
    night_lux: { tier: 'all', keys: ['night_lux'], when: c => nightstand(c) && !!c.night_sensor },
    bed_time: { tier: 'all', keys: ['bed_time'], when: nightstand },
    night_red: { tier: 'all', keys: ['night_red'], when: nightstand },

    // Forecast and clock
    why_forecast_nightstand: { tier: 'basic', keys: [], reason: true, when: nightstand },
    show_forecast: { tier: 'basic', keys: ['show_forecast'], when: (c, x) => x.all || !nightstand(c) },
    forecast_days: { tier: 'all', keys: ['show_days', 'forecast_days'], when: forecastRow },
    forecast_metric: { tier: 'all', keys: ['forecast_metric'], when: forecastRow },
    show_chips: { tier: 'all', keys: ['show_chips'], when: forecastRow },
    forecast_graph: { tier: 'all', keys: ['forecast_graph'], when: forecastRow },
    time_date: { tier: 'all', keys: ['show_clock', 'show_date'] },
    hero: { tier: 'all', keys: ['hero'] },

    // Weather note
    note: { tier: 'basic', keys: ['show_note', 'note_entity'], when: (c, x) => x.all || !nightstand(c) },
    why_note_compact: { tier: 'basic', keys: [], reason: true, when: (c, x) => !!c.compact && !nightstand(c) && x.note !== 'off' },
    why_note_nightstand: { tier: 'basic', keys: [], reason: true, when: nightstand },
    note_tone: { tier: 'basic', keys: ['note_tone'], when: (_, x) => x.note === 'ai' },
    note_ai_task_entity: { tier: 'all', keys: ['note_ai_task_entity'], when: (_, x) => x.note === 'ai', promote: (_, x) => x.noDefaultAi },
    note_calendar: { tier: 'all', keys: ['note_calendar'], when: (_, x) => x.note === 'ai' },
    note_entity: { tier: 'basic', keys: ['note_entity'], when: (_, x) => x.note === 'entity' },
    note_attribute: { tier: 'all', keys: ['note_attribute'], when: (_, x) => x.note === 'entity' },
    note_max_age: { tier: 'all', keys: ['note_max_age'], when: (_, x) => x.note !== 'off' },

    // Readings
    show_attributes: { tier: 'all', keys: ['show_attributes'] },
    readings: {
        tier: 'all', keys: ['readings', 'uv_levels', 'aqi_levels', ...REPLACED_OPTIONS], when: c => c.show_attributes !== false,
        changed: c => !isDefaultList(readingsOf(c)) || isChanged(c, 'uv_levels') || isChanged(c, 'aqi_levels'),
    },
    reading_style: { tier: 'all', keys: ['show_attribute_labels', 'show_attribute_icons'], when: c => c.show_attributes !== false },
    indoor_temperature_entity: { tier: 'all', keys: ['indoor_temperature_entity'] },
    indoor_humidity_entity: { tier: 'all', keys: ['indoor_humidity_entity'] },
    indoor_line: { tier: 'all', keys: ['show_indoor', 'indoor_style'], when: c => !!(c.indoor_temperature_entity || c.indoor_humidity_entity) },

    // Sky and motion
    animate: { tier: 'all', keys: ['animate'] },
    spill_particles: { tier: 'all', keys: ['spill_particles'], when: animated },
    gpu_snow: { tier: 'all', keys: ['gpu_snow'], when: animated },
    gpu_rain: { tier: 'all', keys: ['gpu_rain'], when: animated },
    lightning: { tier: 'all', keys: ['disable_lightning_shake'], when: animated },
    auto_pause: { tier: 'all', keys: ['auto_pause'] },
    sky_follows: { tier: 'all', keys: ['enable_day_night_cycle'] },
    day_hours: { tier: 'all', keys: ['sunrise_hour', 'sunset_hour'], when: c => !!c.enable_day_night_cycle },
    sun_entity: { tier: 'all', keys: ['sun_entity'] },
    moon_entity: { tier: 'all', keys: ['moon_entity'] },
    // Auto unless the card's engine_settings tune something, so a tuned card counts as changed without saying manual
    engine_mode: { tier: 'all', keys: ['engine_mode'], when: animated, changed: c => engineMode(c) === 'manual' },
    // The sliders are manual's: auto ignores them, so they show only in manual, though the card keeps them
    amounts: {
        tier: 'all', keys: ENGINE_KEYS, when: c => animated(c) && engineMode(c) === 'manual',
        changed: c => engineMode(c) === 'manual' && ENGINE_KEYS.some(k => isChanged(c, k)),
    },

    // Custom colors
    sky_colors: { tier: 'all', keys: SKY_COLOR_KEYS, when: c => c.color_palette !== 'theme' },
    why_sky_colors_theme: { tier: 'all', keys: [], reason: true, when: c => c.color_palette === 'theme' },
    ink_colors: { tier: 'all', keys: INK_COLOR_KEYS },

    // Planes
    flights_entity: { tier: 'all', keys: ['flights_entity'] },
    plane_tags: { tier: 'all', keys: ['show_flight_labels', 'flight_label'], when: c => !!c.flights_entity },
    plane_speed: { tier: 'all', keys: ['plane_speed'], when: c => !!c.flights_entity },
    planes_on_load: { tier: 'all', keys: ['planes_on_load'], when: c => !!c.flights_entity },

    // Interactions
    actions: { tier: 'all', keys: ['tap_action', 'hold_action', 'double_tap_action'], changed: c => actionsChanged(c, tapDefault(c)) },

    // Simulated weather
    dev_mode: { tier: 'all', keys: ['dev_mode'] },
};

/**
 * The sections, in order, and their rows. The first five are always open and hold the basics; the drawers after
 * them hold only rows for all settings, and are closed until opened
 */
export const SECTIONS: Readonly<Record<string, readonly string[]>> = {
    start: ['preset'],
    weather: ['entity', 'name', 'show_location', 'outdoor_sensor_entity', 'feels_like_entity', 'another_place', 'place_fields'],
    look: ['layout', 'color_palette', 'temperature_decimals'],
    nightstand: ['why_nightstand_only', 'alarm_entity', 'wake_time', 'night', 'night_sensor', 'night_lux', 'bed_time', 'night_red'],
    forecast: ['why_forecast_nightstand', 'show_forecast', 'forecast_days', 'forecast_metric', 'show_chips', 'forecast_graph', 'time_date', 'hero'],
    note: ['note', 'why_note_compact', 'why_note_nightstand', 'note_tone', 'note_ai_task_entity', 'note_calendar', 'note_entity', 'note_attribute', 'note_max_age'],
    readings: ['show_attributes', 'readings', 'reading_style', 'indoor_temperature_entity', 'indoor_humidity_entity', 'indoor_line'],
    sky: ['animate', 'spill_particles', 'gpu_snow', 'gpu_rain', 'lightning', 'auto_pause', 'sky_follows', 'day_hours', 'sun_entity', 'moon_entity', 'engine_mode', 'amounts'],
    colors: ['sky_colors', 'why_sky_colors_theme', 'ink_colors'],
    planes: ['flights_entity', 'plane_tags', 'plane_speed', 'planes_on_load'],
    interactions: ['actions'],
    dev: ['dev_mode'],
};

/** The sections that open and close */
export const DRAWERS: readonly string[] = ['readings', 'sky', 'colors', 'planes', 'interactions'];

/** A card's editor as a table: its rows, its sections in order, the ones that open and close, its options' defaults */
export interface RowTable<C = Config> {
    rows: Readonly<Record<string, RowSpec<C>>>;
    sections: Readonly<Record<string, readonly string[]>>;
    drawers: readonly string[];
    defaults: Readonly<Record<string, unknown>>;
}

/** The weather card's */
export const WEATHER_TABLE: RowTable = { rows: ROWS, sections: SECTIONS, drawers: DRAWERS, defaults: DEFAULTS };

/** The row changed in this config? */
export function rowChanged<C = Config>(id: string, config: C, table: RowTable<C> = WEATHER_TABLE as unknown as RowTable<C>): boolean {
    const spec = table.rows[id];
    if (!spec || spec.reason) return false;
    return spec.changed ? spec.changed(config) : spec.keys.some(k => isChanged(config as object, k, table.defaults));
}

/**
 * Does the row show? `pinned` holds the rows the config has changed this session: they stay, so a value cleared
 * under the finger doesn't take its field with it
 */
export function rowShown<C = Config>(id: string, config: C, x: RowContext, pinned: ReadonlySet<string>, table: RowTable<C> = WEATHER_TABLE as unknown as RowTable<C>): boolean {
    const spec = table.rows[id];
    if (!spec) return false;
    if (pinned.has(id)) return true;
    if (spec.when && !spec.when(config, x)) return false;
    return spec.tier === 'basic' || x.all || !!spec.promote?.(config, x);
}

/**
 * Does a section show? When one of its rows does, other than a reason: a reason only explains what's there (the
 * nightstand's own section appears on a regular card only when one of its options is set)
 */
export function sectionShown<C = Config>(ids: readonly string[], config: C, x: RowContext, pinned: ReadonlySet<string>, table: RowTable<C> = WEATHER_TABLE as unknown as RowTable<C>): boolean {
    return ids.some(id => !table.rows[id]?.reason && rowShown(id, config, x, pinned, table));
}

// The forecast card's editor: the weather, the card or the strip, the colours and what the hours show are its basics

/** What the forecast card does when an option is left out */
export const FORECAST_DEFAULTS: Readonly<Record<string, unknown>> = {
    compact: false, color_palette: 'default', show_hours: true, show_summary: true, forecast_days: 7, forecast_metric: 'temp', show_chips: true, forecast_graph: 'line',
    weather_effects: false, gpu_snow: false, gpu_rain: false, sun_entity: 'sun.sun', dev_mode: false,
};

const strip = (c: Config) => !!c.compact;
/** The strip is the hours alone, so it always has them; the card has them unless show_hours is off */
const hoursShown = (c: Config) => strip(c) || c.show_hours !== false;

export const FORECAST_TABLE: RowTable = {
    rows: {
        entity: { tier: 'basic', keys: ['entity'] },
        layout: { tier: 'basic', keys: ['compact'] },
        color_palette: { tier: 'basic', keys: ['color_palette'] },
        show_summary: { tier: 'all', keys: ['show_summary'], when: c => !strip(c) },
        show_hours: { tier: 'all', keys: ['show_hours'], when: c => !strip(c) },
        forecast_days: { tier: 'all', keys: ['forecast_days'], when: c => !strip(c) },
        // What the hours show is the one thing most cards change, so it's a basic: two cards, one on rain, one on the temperature
        // (the days show it too, so it stays while either is on)
        forecast_metric: { tier: 'basic', keys: ['forecast_metric'], when: c => hoursShown(c) || (c.forecast_days ?? 7) > 0 },
        show_chips: { tier: 'all', keys: ['show_chips'], when: c => !strip(c) && hoursShown(c) },
        forecast_graph: { tier: 'all', keys: ['forecast_graph'], when: hoursShown },
        weather_effects: { tier: 'all', keys: ['weather_effects'] },
        gpu_snow: { tier: 'all', keys: ['gpu_snow'], when: c => c.weather_effects === true },
        gpu_rain: { tier: 'all', keys: ['gpu_rain'], when: c => c.weather_effects === true },
        sun_entity: { tier: 'all', keys: ['sun_entity'] },
        another_place: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'] },
        place_fields: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'], when: (_, x) => x.place },
        // A tap opens the forecast's view by default
        actions: { tier: 'all', keys: ['tap_action', 'hold_action', 'double_tap_action'], changed: c => actionsChanged(c, 'forecast') },
        dev_mode: { tier: 'all', keys: ['dev_mode'] },
    },
    sections: {
        forecast: ['entity', 'layout', 'color_palette', 'forecast_metric'],
        shows: ['show_summary', 'show_hours', 'forecast_days', 'show_chips', 'forecast_graph', 'weather_effects', 'gpu_snow', 'gpu_rain'],
        sky: ['sun_entity', 'another_place', 'place_fields'],
        interactions: ['actions'],
        dev: ['dev_mode'],
    },
    drawers: [],
    defaults: FORECAST_DEFAULTS,
};

// The sun tracker's editor: the sun, regular or compact, and the colours are its basics

/** The tracker's options, as its editor reads them */
export interface TrackerOptions {
    sun_entity?: string; compact?: boolean; color_palette?: string; title?: string; show_header?: boolean; show_details?: boolean; daylight_delta?: string;
    moon_entity?: string; weather_entity?: string; direction?: string; latitude?: number | string; longitude?: number | string;
    time_zone?: string; tap_action?: unknown; hold_action?: unknown; double_tap_action?: unknown; dev_mode?: boolean;
}

/** What the tracker does when an option is left out */
export const TRACKER_DEFAULTS: Readonly<Record<string, unknown>> = {
    compact: false, color_palette: 'default', show_header: true, show_details: true, daylight_delta: 'day', direction: 'auto', dev_mode: false,
};

/** The compact tracker has no title and no details */
const full = (c: TrackerOptions) => !c.compact;

export const TRACKER_TABLE: RowTable<TrackerOptions> = {
    rows: {
        sun_entity: { tier: 'basic', keys: ['sun_entity'] },
        layout: { tier: 'basic', keys: ['compact'] },
        color_palette: { tier: 'basic', keys: ['color_palette'] },
        title: { tier: 'all', keys: ['title'], when: full },
        show_header: { tier: 'all', keys: ['show_header'] },
        show_details: { tier: 'all', keys: ['show_details'], when: full },
        moon_entity: { tier: 'all', keys: ['moon_entity'], when: c => full(c) && c.show_details !== false },
        // After the headline's countdown, in the details, and under the compact tracker's note, which comes with its headline
        daylight_delta: { tier: 'all', keys: ['daylight_delta'], when: c => c.show_header !== false || (full(c) && c.show_details !== false) },
        direction: { tier: 'all', keys: ['direction'] },
        weather_entity: { tier: 'all', keys: ['weather_entity'] },
        another_place: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'] },
        place_fields: { tier: 'all', keys: ['latitude', 'longitude', 'time_zone'], when: (_, x) => x.place },
        // A tap opens the sun's details by default
        actions: { tier: 'all', keys: ['tap_action', 'hold_action', 'double_tap_action'], changed: c => actionsChanged(c, 'more-info') },
        dev_mode: { tier: 'all', keys: ['dev_mode'] },
    },
    sections: {
        sun: ['sun_entity', 'layout', 'color_palette'],
        shows: ['title', 'show_header', 'show_details', 'daylight_delta', 'moon_entity', 'direction'],
        sky: ['weather_entity', 'another_place', 'place_fields'],
        interactions: ['actions'],
        dev: ['dev_mode'],
    },
    drawers: [],
    defaults: TRACKER_DEFAULTS,
};
