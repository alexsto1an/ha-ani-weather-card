// The weather card's visual editor (the editor bundle). One short page of basics, and "Show all settings" for the
// rest: the switch adds rows inside the same sections and five drawers after them, and never moves anything above
// it. Any option the card's config has changed from its default shows in either mode, so nothing set is hidden.
// Which row shows when is the table in editor-rows.ts, and the parts the three editors share are in editor-kit.ts;
// here is how each row looks and what it writes.
//
// The editor draws itself once, and again only when the config's set of keys changes from outside (a YAML edit).
// Every edit after that writes the config and shows or hides rows by attribute (`sync`), so focus, open drawers and
// the scroll survive. The switch is the editor's own, kept per browser, never in the card's YAML.

import { HomeAssistant, LovelaceCardEditor, AnimatedWeatherCardConfig } from './types';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { getConfigEditorStyles } from './styles/editor';
import { skyColors, oklchToSrgb, toHex, SKY_TEXT } from './sky';
import { engineMode, escapeHtml, hasEngineTuning, textField } from './utils';
import { mountReadingsEditor, readingLabel, type ReadingsEditor } from './readings-editor';
import { bindPlaceFields, placeFieldsHtml, PLACE_FIELDS_CSS } from './place-editor';
import { ActionConfig, readActions } from './actions';
import { mountActionsEditor, updateActionsEditor } from './action-editor';
import { DRAWERS, ROWS, WEATHER_TABLE, isChanged, tapDefault, type RowContext } from './editor-rows';
import { PRESETS, PRESET_KEYS, WALL_MIN, presetById, presetOf, type PresetId } from './presets';
import { PRESET_ART } from './preset-art';
import { CHEVRON, INFO, allSaid, allSwitch, picker, raf, reveal, row, section, sectionIcon, seg as kitSeg, select, storeAll, storedAll, sw, syncRows, why, type SectionIcon } from './editor-kit';
import { readingsOf } from './readings';

type Config = AnimatedWeatherCardConfig;
type Option = { value: string; label: string };
type Select = HTMLElement & { value: string; options: Option[] };

/** note_calendar as a list: YAML takes one calendar or several, the editor's picker shows the first */
function noteCalendarList(value: unknown): string[] {
    return (Array.isArray(value) ? value : typeof value === 'string' ? [value] : []).map(String).filter(Boolean);
}

/** forecast_graph: the hours' graph, the same for every metric (the forecast card's editor offers it too) */
/** The chips the hours can open on, in their order; one the forecast doesn't report opens on the temperature */
export const METRIC_OPTIONS = [
    { value: 'temp', label: 'Temperature' },
    { value: 'feels', label: 'Feels like' },
    { value: 'chance', label: 'Chance of rain' },
    { value: 'amount', label: 'Rain amount' },
    { value: 'uv', label: 'UV index' },
    { value: 'wind', label: 'Wind' },
    { value: 'gust', label: 'Wind gusts' },
    { value: 'humidity', label: 'Humidity' },
    { value: 'dew', label: 'Dew point' },
    { value: 'cloud', label: 'Cloud cover' },
    { value: 'pressure', label: 'Pressure' },
];
export const GRAPH_OPTIONS = [
    { value: 'line', label: 'Line' },
    { value: 'area', label: 'Line with a soft fill' },
    { value: 'bars', label: 'Bars' },
    { value: 'none', label: 'No graph, the values alone' },
];

/** The seven engine sliders: their keys, labels and the ranges the editor offers (YAML takes wider ones) */
const AMOUNTS: Array<[key: keyof typeof DEFAULT_ENGINE_SETTINGS, label: string, input: string]> = [
    ['windSpeed', 'Wind\'s effect', '<input type="range" id="windSpeed" min="0.5" max="5" step="0.1"'],
    ['rainCount', 'Rain', '<input type="range" id="rainCount" min="0.5" max="3" step="0.1"'],
    ['snowCount', 'Snow', '<input type="range" id="snowCount" min="0.5" max="3" step="0.1"'],
    ['leafCount', 'Leaves on windy days', '<input type="range" id="leafCount" min="0.5" max="3" step="0.1"'],
    ['cloudCount', 'Clouds, and stars at night', '<input type="range" id="cloudCount" min="1" max="6" step="1"'],
    ['cloudBaseSize', 'Cloud size', '<input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1"'],
    ['splashBounce', 'Splash height', '<input type="range" id="splashBounce" min="40" max="120" step="5"'],
];

const SKY_SWATCHES: Array<[string, string]> = [
    ['sunny_bg', 'Sunny sky'], ['cloudy_bg', 'Cloudy sky'], ['rainy_bg', 'Rainy sky'], ['stormy_bg', 'Stormy sky'],
    ['snowy_bg', 'Snowy sky'], ['windy_bg', 'Windy sky'], ['fog_color', 'Fog'],
];
const INK_SWATCHES: Array<[string, string]> = [
    ['temperature_color', 'Temperature'], ['text_color', 'Text'], ['sun_color', 'Sun'], ['rain_color', 'Rain'], ['snow_color', 'Snow'],
];

let editors = 0;

export class AnimatedWeatherCardEditor extends HTMLElement implements LovelaceCardEditor {
    private _config?: Config;
    private _hass?: HomeAssistant;
    private _initialized: boolean = false;
    private readonly uid = ++editors;
    /** Show all settings */
    private all = storedAll();
    /** The rows the config has changed this session: they stay shown, so a value cleared under the finger keeps its field */
    private pinned = new Set<string>();
    /** The drawers you've opened, kept across a redraw */
    private openDrawers = new Set<string>();
    /** The reading open in the list */
    private readingOpen = -1;
    /** Weather for another place, switched on before anything's typed; and what was typed, kept when it's switched off */
    private placeOn = false;
    private placeKept: Record<string, unknown> = {};
    /** The note's source picked before its entity is, and the entity a switch to Off or the AI set aside */
    private noteChoice?: 'entity';
    private noteEntityKept?: string;
    /** No default AI Task, so the AI Task picker joins the basics */
    private noDefaultAi = false;
    /** The readings' list (readings-editor.ts) */
    private readingsEditor?: ReadingsEditor;
    /** Refill a select whose choices depend on another option */
    private refill: Record<string, (options: Option[], value: string) => void> = {};
    private _suppressHandler?: (e: PromiseRejectionEvent) => void;
    private _suppressTimeout?: ReturnType<typeof setTimeout>;

    setConfig(config: Config): void {
        // Only a new set of keys (a YAML edit) draws it again; an edit made here comes back with the same keys
        const shouldRerender = !this._config ||
            Object.keys(config).length !== Object.keys(this._config).length ||
            JSON.stringify(Object.keys(config).sort()) !== JSON.stringify(Object.keys(this._config).sort());

        this._config = { ...config };

        if (this.isConnected && shouldRerender) this.render();
        else if (this.isConnected && this._initialized) this.sync();
    }

    async connectedCallback() {
        this._config = this._config || {};
        await this.ensureEntityPickerLoaded();
        this.render();
        this._initialized = true;
        if (this._hass) {
            this.updateEntityPickers();
        }
    }

    disconnectedCallback() {
        this._cleanupSuppressHandler();
        this.pinned.clear();
        // Clear innerHTML to release HA component subscriptions
        this.innerHTML = '';
    }

    private _cleanupSuppressHandler() {
        if (this._suppressHandler) {
            window.removeEventListener('unhandledrejection', this._suppressHandler);
            this._suppressHandler = undefined;
        }
        if (this._suppressTimeout) {
            clearTimeout(this._suppressTimeout);
            this._suppressTimeout = undefined;
        }
    }

    async ensureEntityPickerLoaded() {
        if (customElements.get("ha-entity-picker")) return;
        try {
            const cardHelpers = await window.loadCardHelpers!();
            const entitiesCard = await cardHelpers.createCardElement({ type: "entities", entities: [] });

            // getConfigElement() triggers ha-entity-picker module loading, but causes a
            // harmless render error (pickers created internally render before hass is set).
            // Temporarily suppress unhandled rejections from this side effect.
            this._cleanupSuppressHandler();
            this._suppressHandler = (e: PromiseRejectionEvent) => {
                if (e.reason?.message?.includes('localize') || e.reason?.message?.includes('hass')) {
                    e.preventDefault();
                }
            };
            window.addEventListener('unhandledrejection', this._suppressHandler);
            try {
                await (entitiesCard.constructor as { getConfigElement?: () => Promise<HTMLElement> | HTMLElement }).getConfigElement?.();
            } finally {
                // Safety-net timeout; disconnectedCallback also cleans up if the card is removed early
                this._suppressTimeout = setTimeout(() => this._cleanupSuppressHandler(), 2000);
            }
        } catch (_) {
            // Silently ignore - entity picker will load when HA is ready
        }
    }

    /** The editor's state the rows depend on */
    private ctx(): RowContext {
        return { all: this.all, place: this.placeOn, note: this.noteSource(), noDefaultAi: this.noDefaultAi };
    }

    private noteSource(): RowContext['note'] {
        const c = this._config ?? {};
        if (c.note_entity || this.noteChoice === 'entity') return 'entity';
        return c.show_note ? 'ai' : 'off';
    }

    render() {
        const c = this._config ??= {};
        const id = this.uid;
        const placeSet = ['latitude', 'longitude', 'time_zone'].some(k => c[k] !== undefined && c[k] !== '');
        this.placeOn = this.placeOn || placeSet;
        // Only numbers: YAML can hold anything, and the card treats anything else as unset, so the sliders show the
        // default it falls back to
        const engine = Object.fromEntries(Object.entries(c.engine_settings || {})
            .filter(([, value]) => typeof value === 'number' && isFinite(value))) as Record<string, number>;
        const colors = (c.custom_colors || {}) as Record<string, string | undefined>;
        const layout = c.layout === 'nightstand' ? 'nightstand' : c.compact ? 'compact' : 'default';

        const seg = (key: string, legend: string, options: Array<[string, string]>, current: string) => kitSeg(key, legend, options, current, id);
        const swatch = ([key, label]: [string, string], ink: boolean) =>
            `<div class="swc"><span class="chip${ink ? ` ink ink-${key.replace('_color', '')}` : ''}"><input type="color" id="${key}" value="${escapeHtml(colors[key] || AnimatedWeatherCardEditor.DEFAULT_COLORS[key])}"></span>`
            + `<label for="${key}">${label}</label><button type="button" class="tb color-reset" data-target="${key}" aria-label="Reset ${label}"${colors[key] ? '' : ' data-off'}>Reset</button></div>`;
        const DRAWER_ICONS: Record<string, SectionIcon> = { readings: 'readings', sky: 'motion', colors: 'colors', planes: 'planes', interactions: 'interactions' };
        const drawer = (key: string, title: string, body: string, i: number) =>
            `<section class="rv drw" data-sec="${key}" style="--i:${i}"><div class="rv-in"><div class="drw-b">`
            + `<h3 class="drw-h"><button type="button" class="drw-btn" data-drawer="${key}" aria-expanded="false" aria-controls="awc-${key}-${id}">`
            + `${sectionIcon(DRAWER_ICONS[key])}<span class="drw-tx"><span class="drw-t">${title}</span><span class="drw-s" data-summary="${key}"></span></span>${CHEVRON}</button></h3>`
            + `<div class="rv drw-c" id="awc-${key}-${id}" role="region" aria-label="${title}"><div class="rv-in"><div class="drw-in">${body}</div></div></div></div></div></section>`;

        // Start from: the presets, a radio each, the one the card matches checked (none for a look of your own)
        const current = presetOf(c);
        const presets = `<fieldset class="pre" id="preset"><legend class="vh">Start from a preset</legend><div class="pre-grid">${PRESETS.map(p =>
            `<label class="pre-t"><input type="radio" name="awc-preset-${id}" value="${p.id}"${p.id === current ? ' checked' : ''}><span class="pre-c">${PRESET_ART[p.id]}<span class="pre-n">${p.label}</span></span></label>`).join('')}</div>`
            + `<p class="help" data-help="preset"></p><p class="why" data-wall hidden>${INFO}<span>The wall needs the card at least ${WALL_MIN.width} × ${WALL_MIN.height} px: give its section Double width (the section's settings, Width), or put it in a panel view. Smaller, it's the forecast with the time and date.</span></p></fieldset>`;

        this.innerHTML = `
      <div class="card-config" data-instant>
        ${allSwitch(this.all)}

        ${section('start', ['start', 'Start from'], row('preset', presets))}

        ${section('weather', ['weather', 'Weather'], [
            row('entity', `${picker('entity', 'Weather entity', c.entity)}<p class="status" role="status" data-status="entity" hidden>${INFO}<span>Pick a weather entity to start.</span></p>`),
            row('name', textField({ id: 'name', label: 'Place name', placeholder: 'Weather', value: c.name, hint: 'Shown above the temperature' })),
            row('show_location', sw('show_location', 'Show the place name', c.show_location !== false)),
            row('outdoor_sensor_entity', picker('outdoor_sensor_entity', 'Temperature from', c.outdoor_sensor_entity, 'A sensor of yours, shown instead of the weather entity\'s')),
            row('feels_like_entity', picker('feels_like_entity', 'Feels like from', c.feels_like_entity, 'Without one, the weather entity\'s own, when it reports one')),
            row('another_place', sw('another_place', 'Weather for another place', this.placeOn, 'Its sun, and its times in its time zone')),
            row('place_fields', placeFieldsHtml(c)),
        ].join(''))}

        ${section('look', ['look', 'Layout and colors'], [
            row('layout', seg('layout', 'Layout', [['default', 'Regular'], ['compact', 'Compact'], ['nightstand', 'Nightstand']], layout)),
            row('color_palette', seg('color_palette', 'Colors', [['default', 'Sky'], ['theme', 'Theme']], c.color_palette === 'theme' ? 'theme' : 'default')),
            row('temperature_decimals', sw('temperature_decimals', 'One decimal', Number(c.temperature_decimals) === 1, '21.5° rather than 22°')),
        ].join(''))}

        ${section('nightstand', ['nightstand', 'Nightstand'], [
            row('why_nightstand_only', why('These apply with the Nightstand layout.')),
            row('alarm_entity', picker('alarm_entity', 'Next alarm', c.alarm_entity, 'Optional. Your phone\'s next alarm sensor, or a date and time helper')),
            row('wake_time', textField({ id: 'wake_time', label: 'Wake time', placeholder: '07:00', value: c.wake_time, hint: 'When you get up without an alarm' })),
            row('night', select('night', 'Night mode', 'Automatic: when the room goes dark, or from bed time without a light sensor')),
            row('night_sensor', picker('night_sensor', 'Light sensor', c.night_sensor, 'An illuminance sensor near the screen')),
            row('night_lux', textField({ id: 'night_lux', label: 'Dark below (lx)', type: 'number', min: 0.1, step: 'any', placeholder: '5', value: c.night_lux !== undefined ? String(c.night_lux) : '', hint: 'Raise it if the screen or a street light keeps the room brighter' })),
            row('bed_time', textField({ id: 'bed_time', label: 'Bed time', placeholder: '22:30', value: c.bed_time, hint: 'By default, 8 h 30 min before the alarm or wake time' })),
            row('night_red', sw('night_red', 'Red at night', c.night_red !== false, 'Red on black, like a bedside clock')),
        ].join(''))}

        ${section('forecast', ['clock', 'Forecast and clock'], [
            row('why_forecast_nightstand', why('The nightstand shows the time, the date and what\'s coming on its own.')),
            row('show_forecast', sw('show_forecast', 'Forecast', !!c.show_forecast, 'Today\'s high and low, the hours ahead, and the week on a tap')),
            row('forecast_days', select('forecast_days', 'Days under the hours')),
            row('forecast_metric', select('forecast_metric', 'Hours open on', 'The value the hours start on: the temperature, the rain, the wind and the rest')),
            row('show_chips', sw('show_chips', 'Buttons under the hours', c.show_chips !== false, 'One for each value, to change what the hours show. Off, they stay on what Hours open on says')),
            row('forecast_graph', select('forecast_graph', 'Graph')),
            row('time_date', select('time_date', 'Time and date', 'Before the place name, in your profile\'s 12- or 24-hour format')),
            row('hero', seg('hero', 'Big number', [['temperature', 'Temperature'], ['clock', 'Time']], c.hero === 'clock' ? 'clock' : 'temperature')),
        ].join(''))}

        ${section('note', ['note', 'Weather note'], [
            row('note', `${select('note_source', 'Note')}<p class="help" data-help="note"></p><p class="status" role="status" id="note_status" hidden></p>`),
            row('why_note_compact', why('The compact card has no room for the note.')),
            row('why_note_nightstand', why('The nightstand doesn\'t show the note.')),
            row('note_tone', select('note_tone', 'Voice', 'Serious weather always gets plain advice')),
            row('note_ai_task_entity', picker('note_ai_task_entity', 'AI Task', c.note_ai_task_entity, 'Leave empty for your default AI Task')),
            row('note_calendar', picker('note_calendar', 'Calendar', noteCalendarList(c.note_calendar)[0], 'For what to wear when you\'re out. Only the times reach your AI')),
            row('note_entity', picker('note_entity', 'Note entity', c.note_entity, 'A text helper or a sensor: its state is the short note')),
            row('note_attribute', textField({ id: 'note_attribute', label: 'Longer version', placeholder: 'note', value: c.note_attribute, hint: 'The attribute shown where there\'s room for two lines' })),
            row('note_max_age', textField({ id: 'note_max_age', label: 'Hide after (minutes)', type: 'number', min: 0, placeholder: '180', value: c.note_max_age !== undefined ? String(c.note_max_age) : '', hint: 'Counted from when the note was written. 0 keeps it up' })),
        ].join(''))}

        <div class="rv drws" data-drawers><div class="rv-in"><div class="drws-b">
          ${drawer('readings', 'Readings', [
            row('show_attributes', sw('show_attributes', 'Show the readings', c.show_attributes !== false)),
            row('readings', `<div class="readings-table"></div>
              <div data-levels-for="uv">${textField({ id: 'uv_levels', label: 'UV levels', placeholder: '3, 6, 8, 11', value: Array.isArray(c.uv_levels) ? c.uv_levels.join(', ') : (c.uv_levels as string | undefined), hint: 'Where moderate, high, very high and extreme start. The WHO\'s by default' })}</div>
              <div data-levels-for="aqi">${textField({ id: 'aqi_levels', label: 'Air quality levels', placeholder: '51, 101, 151, 201, 301', value: Array.isArray(c.aqi_levels) ? c.aqi_levels.join(', ') : (c.aqi_levels as string | undefined), hint: 'Where each US EPA level starts, unless your sensor uses another scale' })}</div>`),
            row('reading_style', select('reading_style', 'Each reading shows')),
            row('indoor_temperature_entity', picker('indoor_temperature_entity', 'Indoor temperature', c.indoor_temperature_entity, 'A line under the condition')),
            row('indoor_humidity_entity', picker('indoor_humidity_entity', 'Indoor humidity', c.indoor_humidity_entity)),
            row('indoor_line', select('indoor_line', 'Indoor line starts with')),
          ].join(''), 0)}
          ${drawer('sky', 'Sky and motion', [
            row('animate', sw('animate', 'Animate the weather', c.animate !== false, 'Off, a still sky in the weather\'s colors')),
            row('spill_particles', sw('spill_particles', 'Let weather spill out', c.spill_particles !== false, 'Rain, snow and leaves fall past the card\'s edges')),
            row('use_webgl', sw('use_webgl', 'WebGL (experimental)', c.use_webgl === true, 'Draw supported effects with WebGL when hardware acceleration is available')),
            row('lightning', sw('lightning_shake', 'Shake on lightning', !c.disable_lightning_shake, 'A small jolt when lightning strikes')),
            row('auto_pause', sw('auto_pause', 'Pause in the background', !!c.auto_pause, 'Also while this window isn\'t in front. The card always pauses off screen')),
            row('sky_follows', seg('sky_follows', 'Sky follows', [['sun', 'The sun'], ['hours', 'Set hours']], c.enable_day_night_cycle ? 'hours' : 'sun')),
            row('day_hours', `<div class="pair">${textField({ id: 'sunrise_hour', label: 'Day begins at', type: 'number', min: 0, max: 23, placeholder: '6', value: c.sunrise_hour !== undefined ? String(c.sunrise_hour) : '' })}${textField({ id: 'sunset_hour', label: 'Night begins at', type: 'number', min: 0, max: 23, placeholder: '20', value: c.sunset_hour !== undefined ? String(c.sunset_hour) : '' })}</div>`),
            row('sun_entity', picker('sun_entity', 'Sun', c.sun_entity, 'Sets the sky\'s time of day and the sunset reading. Usually sun.sun')),
            row('moon_entity', picker('moon_entity', 'Moon phase', c.moon_entity, 'The Moon integration\'s sensor. Else, worked out from the date')),
            row('engine_mode', sw('engine_auto', 'Amounts follow the weather', engineMode(c) === 'auto', 'How hard it rains or snows, the cloud cover, how far you can see, and the wind and its gusts. Off, you set the amounts')),
            row('amounts', `<p class="sub-h">Amounts</p><div class="amt">${AMOUNTS.map(([key, label, input]) => {
                const value = engine[key] ?? DEFAULT_ENGINE_SETTINGS[key];
                return `<div class="amt-o"><label for="${key}">${label}</label><output for="${key}" data-out="${key}">${AnimatedWeatherCardEditor.formatEngineValue(key, value)}</output>${input} value="${escapeHtml(value)}" /></div>`;
            }).join('')}</div><button type="button" class="tb reset-engine-btn" data-off>Reset amounts</button>`),
          ].join(''), 1)}
          ${drawer('colors', 'Custom colors', [
            row('sky_colors', `<p class="sub-h">Skies</p><p class="help">Each color replaces that condition's whole sky</p><div class="color-grid" id="color-grid">${SKY_SWATCHES.map(s => swatch(s, false)).join('')}</div>`),
            row('why_sky_colors_theme', why('Sky colors apply with Colors set to Sky.')),
            row('ink_colors', `<p class="sub-h">Text and weather</p><div class="color-grid" id="ink-grid">${INK_SWATCHES.map(s => swatch(s, true)).join('')}</div><button type="button" class="tb reset-colors-btn" id="reset-colors-btn" data-off>Reset all colors</button>`),
          ].join(''), 2)}
          ${drawer('planes', 'Planes', [
            row('flights_entity', picker('flights_entity', 'Flights sensor', c.flights_entity, 'Flightradar24\'s Current in area sensor. Each new flight crosses the card once')),
            row('plane_tags', select('plane_tags', 'Plane tags', 'Tags show only in open sky, never over the temperature')),
            row('plane_speed', select('plane_speed', 'Speed')),
            row('planes_on_load', sw('planes_on_load', 'Fly the planes already up', !!c.planes_on_load, 'When the dashboard opens, not only new arrivals')),
          ].join(''), 3)}
          ${drawer('interactions', 'Interactions', row('actions', '<div id="actions-editor"></div>'), 4)}
        </div></div></div>

        ${section('dev', '', row('dev_mode', sw('dev_mode', 'Simulated weather', !!c.dev_mode, 'The dev card\'s weather, with no weather entity needed')))}
      </div>
      <style>${getConfigEditorStyles()}${PLACE_FIELDS_CSS}</style>
    `;

        this.attachEventListeners();
        this.sync();
        for (const key of this.openDrawers) this.applyDrawer(key);
        this.syncColorInputs();
        // A drawing plays no reveal: the attribute holds every transition off until it has painted
        const root = this.querySelector('.card-config');
        raf(() => raf(() => root?.removeAttribute('data-instant')));

        // Ensure entity pickers are updated after render
        setTimeout(() => this.updateEntityPickers(), 0);
    }

    attachEventListeners() {
        this.updateEntityPickers();
        const on = (selector: string, type: string, handler: (el: HTMLInputElement, e: Event) => void) =>
            this.querySelector(selector)?.addEventListener(type, e => handler(e.target as HTMLInputElement, e));
        const radios = (key: string, handler: (value: string) => void) =>
            this.querySelectorAll<HTMLInputElement>(`[id="${key}"] input[type="radio"]`).forEach(r => r.addEventListener('change', () => { if (r.checked) handler(r.value); }));

        // The switch: rows show and hide in place, nothing is drawn again, and it's said once to a screen reader
        on('#all_settings', 'change', el => {
            this.all = !!el.checked;
            storeAll(this.all);
            this.sync();
            const live = this.querySelector('[data-live]');
            if (live) live.textContent = allSaid(this.all, true);
        });

        // Start from: a preset writes its options over the ones it owns
        radios('preset', value => this.pickPreset(value as PresetId));

        // Weather
        on('#entity', 'value-changed', el => this._set({ entity: el.value }));
        on('#name', 'input', el => this._set({ name: el.value }));
        on('#show_location', 'change', el => this._set({ show_location: el.checked ? undefined : false }));
        for (const key of ['outdoor_sensor_entity', 'feels_like_entity', 'alarm_entity', 'night_sensor', 'note_ai_task_entity', 'indoor_temperature_entity', 'indoor_humidity_entity', 'sun_entity', 'moon_entity', 'flights_entity']) {
            on(`#${key}`, 'value-changed', el => {
                this._set({ [key]: el.value || undefined });
                if (key === 'note_ai_task_entity') this.syncNoteStatus();
            });
        }
        on('#another_place', 'change', el => {
            this.placeOn = !!el.checked;
            if (this.placeOn) {
                // Back on: what was typed before comes back
                if (Object.keys(this.placeKept).length) this._set(this.placeKept);
                else this.sync();
                return;
            }
            const c = this._config ?? {};
            this.placeKept = Object.fromEntries(['latitude', 'longitude', 'time_zone'].filter(k => c[k] !== undefined).map(k => [k, c[k]]));
            // Switched off on purpose: the fields go, though they were set; the switch stays to bring them back
            this.pinned.delete('place_fields');
            this._set({ latitude: undefined, longitude: undefined, time_zone: undefined });
        });
        bindPlaceFields(this, patch => this._set(patch));

        // Layout and colors
        radios('layout', value => {
            this._set(value === 'compact' ? { compact: true, layout: undefined } : value === 'nightstand' ? { layout: 'nightstand', compact: undefined } : { compact: undefined, layout: undefined });
            this.mountActions();
        });
        radios('color_palette', value => {
            this._set({ color_palette: value === 'theme' ? value : undefined });
            this.syncColorInputs();
        });
        on('#temperature_decimals', 'change', el => this._set({ temperature_decimals: el.checked ? 1 : undefined }));

        // Nightstand
        for (const key of ['wake_time', 'bed_time'] as const) {
            on(`#${key}`, 'input', el => {
                const v = (el.value || '').trim();
                this._set({ [key]: /^\d{1,2}:\d{2}$/.test(v) ? v : undefined });
            });
        }
        this._bindSelect('night', [
            { value: 'auto', label: 'Automatic' },
            { value: 'on', label: 'Always' },
            { value: 'off', label: 'Never' },
        ], this._config?.night === true ? 'on' : this._config?.night === false ? 'off' : String(this._config?.night || 'auto'), value => {
            this._set({ night: value === 'auto' ? undefined : value });
        });
        on('#night_lux', 'input', el => {
            const v = Number((el.value || '').trim());
            this._set({ night_lux: Number.isFinite(v) && v > 0 && v !== 5 ? v : undefined });
        });
        on('#night_red', 'change', el => this._set({ night_red: el.checked ? undefined : false }));
        on('#show_chips', 'change', el => this._set({ show_chips: el.checked ? undefined : false }));

        // Forecast and clock
        on('#show_forecast', 'change', el => {
            this._set({ show_forecast: el.checked || undefined });
            this.mountActions();
        });
        const days = this._config?.show_days ? String(this._config?.forecast_days ?? 7) : 'none';
        this._bindSelect('forecast_days', [
            { value: 'none', label: 'None' },
            ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: i ? `${i + 1} days` : '1 day' })),
        ], days, value => {
            // None keeps the count, for when the days come back
            this._set(value === 'none' ? { show_days: undefined } : { show_days: true, forecast_days: value === '7' ? undefined : Number(value) });
        });
        this._bindSelect('forecast_metric', METRIC_OPTIONS, this._config?.forecast_metric || 'temp', value => this._set({ forecast_metric: value === 'temp' ? undefined : value }));
        this._bindSelect('forecast_graph', GRAPH_OPTIONS, this._config?.forecast_graph || 'line', value => this._set({ forecast_graph: value === 'line' ? undefined : value }));
        this._bindSelect('time_date', this.timeDateOptions(), this.timeDateValue(), value => {
            if (this._config?.hero === 'clock') this._set({ show_date: value === 'date' || undefined });
            else this._set({ show_clock: value === 'time' || value === 'both' || undefined, show_date: value === 'date' || value === 'both' || undefined });
        });
        radios('hero', value => {
            this._set({ hero: value === 'clock' ? value : undefined });
            // With the time as the big number, the line before the place offers the date alone
            this.refill.time_date?.(this.timeDateOptions(), this.timeDateValue());
        });

        // Weather note: one choice of source, written as the card reads it
        this._bindSelect('note_source', [
            { value: 'off', label: 'Off' },
            { value: 'ai', label: 'Written by your AI' },
            { value: 'entity', label: 'From an entity' },
        ], this.noteSource(), value => {
            const c = this._config ?? {};
            if (c.note_entity) this.noteEntityKept = c.note_entity;
            this.noteChoice = value === 'entity' ? 'entity' : undefined;
            if (value === 'off') this._set({ show_note: undefined, note_entity: undefined });
            else if (value === 'ai') this._set({ show_note: true, note_entity: undefined });
            // An entity: the one set aside before, or none yet, and the picker comes up for it
            else if (this.noteEntityKept) this._set({ note_entity: this.noteEntityKept, show_note: undefined });
            else {
                this.sync();
                (this.querySelector('#note_entity') as HTMLElement | null)?.focus();
            }
            this.syncNoteStatus();
        });
        on('#note_entity', 'value-changed', el => {
            const value = el.value || undefined;
            // Cleared, the choice of an entity stands, so its picker stays for the next one
            this.noteChoice = value ? undefined : 'entity';
            this._set(value ? { note_entity: value, show_note: undefined } : { note_entity: undefined });
            this.syncNoteStatus();
        });
        this._bindSelect('note_tone', [
            { value: 'snarky', label: 'Snarky' },
            { value: 'calm', label: 'Calm' },
            { value: 'friendly', label: 'Friendly' },
            { value: 'dry', label: 'Dry' },
        ], this._config?.note_tone || 'snarky', value => this._set({ note_tone: value === 'snarky' ? undefined : value }));
        on('#note_calendar', 'value-changed', el => {
            // The picker is the first calendar; any others from YAML stay
            const calendars = [el.value, ...noteCalendarList(this._config?.note_calendar).slice(1)].filter(Boolean);
            this._set({ note_calendar: calendars.length > 1 ? calendars : calendars[0] || undefined });
        });
        on('#note_attribute', 'input', el => this._set({ note_attribute: el.value.trim() || undefined }));
        on('#note_max_age', 'change', el => {
            const raw = el.value.trim();
            const value = parseInt(raw);
            if (!raw) this._set({ note_max_age: undefined });
            else if (value >= 0) this._set({ note_max_age: value === 180 ? undefined : value });
        });

        // Readings, as a list of their own (readings-editor.ts): only an edit there writes `readings`
        on('#show_attributes', 'change', el => this._set({ show_attributes: el.checked ? undefined : false }));
        const table = this.querySelector('.readings-table') as HTMLElement | null;
        this.readingsEditor = table ? mountReadingsEditor(table, () => this._config ?? {}, patch => this._set(patch), {
            open: this.readingOpen, onOpen: i => { this.readingOpen = i; },
        }) : undefined;
        this.readingsEditor?.hass(this._hass);
        const levels = (key: 'uv_levels' | 'aqi_levels', count: number) => on(`#${key}`, 'change', el => {
            const raw = el.value.trim();
            const n = raw.split(',').map(v => parseFloat(v));
            const valid = n.length === count && n.every((v, j) => isFinite(v) && (j === 0 || v > n[j - 1]));
            // Rising numbers are written as a list; anything else as typed, which the card reads as the default levels
            this._set({ [key]: !raw ? undefined : valid ? n : raw });
        });
        levels('uv_levels', 4);
        levels('aqi_levels', 5);
        const c0 = this._config ?? {};
        this._bindSelect('reading_style', [
            { value: 'both', label: 'Icon and label' },
            { value: 'label', label: 'Label' },
            { value: 'icon', label: 'Icon' },
            { value: 'value', label: 'The value alone' },
        ], c0.show_attribute_labels === false ? (c0.show_attribute_icons === false ? 'value' : 'icon') : c0.show_attribute_icons === false ? 'label' : 'both', value => {
            this._set({
                show_attribute_labels: value === 'icon' || value === 'value' ? false : undefined,
                show_attribute_icons: value === 'label' || value === 'value' ? false : undefined,
            });
        });
        this._bindSelect('indoor_line', [
            { value: 'label', label: 'The word "Indoors"' },
            { value: 'icon', label: 'A house icon' },
            { value: 'both', label: 'Icon and word' },
            { value: 'hidden', label: 'Hidden' },
        ], c0.show_indoor === false ? 'hidden' : c0.indoor_style || 'label', value => {
            // Hidden keeps the style, for when it's shown again
            this._set(value === 'hidden' ? { show_indoor: false } : { show_indoor: undefined, indoor_style: value === 'label' ? undefined : value });
        });

        // Sky and motion
        on('#animate', 'change', el => this._set({ animate: el.checked ? undefined : false }));
        on('#spill_particles', 'change', el => this._set({ spill_particles: el.checked ? undefined : false }));
        on('#use_webgl', 'change', el => this._set({ use_webgl: el.checked || undefined }));
        on('#lightning_shake', 'change', el => this._set({ disable_lightning_shake: el.checked ? undefined : true }));
        // Auto is the default unless engine_settings tune something, so a tuned card says auto to turn it on; manual
        // keeps the tuning, and auto keeps it too, for the day the card goes back
        on('#engine_auto', 'change', el => {
            const c = this._config ?? {};
            if (el.checked) this.pinned.delete('amounts');
            this._set({ engine_mode: el.checked ? (hasEngineTuning(c) ? 'auto' : undefined) : 'manual' });
        });
        on('#auto_pause', 'change', el => this._set({ auto_pause: el.checked || undefined }));
        radios('sky_follows', value => this._set({ enable_day_night_cycle: value === 'hours' || undefined }));
        for (const [key, def] of [['sunrise_hour', 6], ['sunset_hour', 20]] as const) {
            on(`#${key}`, 'change', el => {
                const raw = el.value.trim();
                const value = parseInt(raw);
                if (!raw) this._set({ [key]: undefined });
                else if (value >= 0 && value <= 23) this._set({ [key]: value === def ? undefined : value });
            });
        }
        for (const [key] of AMOUNTS) {
            const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
            if (!input) continue;
            this.syncFill(input);
            // While it's dragged, only the value beside it changes; the config on release
            input.addEventListener('input', () => {
                const out = this.querySelector(`[data-out="${key}"]`);
                if (out) out.textContent = AnimatedWeatherCardEditor.formatEngineValue(key, parseFloat(input.value));
                this.syncFill(input);
            });
            input.addEventListener('change', () => this._updateEngineConfig(key, parseFloat(input.value)));
        }
        on('.reset-engine-btn', 'click', (_, e) => {
            e.preventDefault();
            this._resetEngineSettings();
        });

        // Custom colors
        for (const [key] of [...SKY_SWATCHES, ...INK_SWATCHES]) {
            on(`#${key}`, 'input', el => this.paintChip(el));
            on(`#${key}`, 'change', el => this._updateColorConfig(key, el.value));
        }
        this.querySelectorAll<HTMLElement>('.color-reset').forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            this._resetColorConfig(btn.dataset.target!);
        }));
        on('.reset-colors-btn', 'click', (_, e) => {
            e.preventDefault();
            this._resetAllColors();
        });

        // Planes
        const c1 = this._config ?? {};
        this._bindSelect('plane_tags', [
            { value: 'flight', label: 'Flight number and aircraft' },
            { value: 'route', label: 'Route (Lisbon → Paris)' },
            { value: 'both', label: 'Route and flight number' },
            { value: 'none', label: 'None' },
        ], c1.show_flight_labels === false ? 'none' : c1.flight_label || 'flight', value => {
            // None keeps what the tags say, for when they come back
            this._set(value === 'none' ? { show_flight_labels: false } : { show_flight_labels: undefined, flight_label: value === 'flight' ? undefined : value });
        });
        // The usual pace, or slower so a plane and its tag can be followed; YAML takes any value from 0.25 to 2
        const speed = String(c1.plane_speed ?? 1);
        this._bindSelect('plane_speed', [
            { value: '1', label: 'Usual' },
            { value: '0.5', label: 'Half' },
            { value: '0.25', label: 'A quarter' },
            ...(['1', '0.5', '0.25'].includes(speed) ? [] : [{ value: speed, label: `${speed}× (set in YAML)` }]),
        ], speed, value => this._set({ plane_speed: value === '1' ? undefined : Number(value) }));
        on('#planes_on_load', 'change', el => this._set({ planes_on_load: el.checked || undefined }));

        // Interactions, and the developer's switch
        this.mountActions();
        on('#dev_mode', 'change', el => this._set({ dev_mode: el.checked || undefined }));

        // The drawers open and close, and stay as they were across a redraw
        this.querySelectorAll<HTMLButtonElement>('.drw-btn').forEach(btn => btn.addEventListener('click', () => {
            const key = btn.dataset.drawer!;
            if (this.openDrawers.has(key)) this.openDrawers.delete(key); else this.openDrawers.add(key);
            this.applyDrawer(key);
        }));
        this.syncNoteStatus();
    }

    private applyDrawer(key: string): void {
        const open = this.openDrawers.has(key);
        this.querySelector(`[data-drawer="${key}"]`)?.setAttribute('aria-expanded', String(open));
        const body = this.querySelector(`[data-sec="${key}"] .drw-c`);
        if (body) reveal(body, open, !!this.querySelector('.card-config[data-instant]'));
    }

    private timeDateOptions(): Option[] {
        return this._config?.hero === 'clock'
            ? [{ value: 'off', label: 'Off' }, { value: 'date', label: 'Date' }]
            : [{ value: 'off', label: 'Off' }, { value: 'time', label: 'Time' }, { value: 'date', label: 'Date' }, { value: 'both', label: 'Time and date' }];
    }

    private timeDateValue(): string {
        const c = this._config ?? {};
        if (c.hero === 'clock') return c.show_date ? 'date' : 'off';
        return c.show_clock && c.show_date ? 'both' : c.show_clock ? 'time' : c.show_date ? 'date' : 'off';
    }

    /**
     * Every row shown or hidden, by attribute: the basics, everything with the switch on, and any option the config
     * has changed. Then the words that follow the config: each drawer's summary, the help under a choice, the
     * statuses, the place name's placeholder
     */
    sync(): void {
        const root = this.querySelector<HTMLElement>('.card-config');
        if (!root) return;
        const c = this._config ?? {};
        const x = this.ctx();
        const instant = root.hasAttribute('data-instant');
        root.toggleAttribute('data-all', x.all);
        const drawers = syncRows(root, WEATHER_TABLE, c, x, this.pinned, instant);
        const list = this.querySelector('[data-drawers]');
        if (list) reveal(list, drawers, instant);

        const set = (selector: string, text: string) => { const el = this.querySelector(selector); if (el && el.textContent !== text) el.textContent = text; };
        // The preset the card matches now, whatever changed it: a tile, another control or YAML
        const preset = presetOf(c);
        this.querySelectorAll<HTMLInputElement>('#preset input[type="radio"]').forEach(r => { r.checked = r.value === preset; });
        set('[data-help="preset"]', preset ? presetById(preset)!.description : 'Your own mix. Pick one to start again from it');
        this.querySelector('[data-wall]')?.toggleAttribute('hidden', preset !== 'wall');
        const layout = c.layout === 'nightstand' ? 'nightstand' : c.compact ? 'compact' : 'default';
        set('[data-help="layout"]', { default: 'The sky, the temperature and your readings', compact: 'One line, to sit under other cards', nightstand: 'A bedside clock that goes dark at night' }[layout]);
        set('[data-help="color_palette"]', c.color_palette === 'theme' ? 'Your dashboard theme\'s colors, light or dark' : 'Colors from the weather and the time of day');
        set('[data-help="hero"]', c.hero === 'clock' ? 'The time leads, and the temperature starts the condition\'s line' : 'The temperature leads the card');
        set('[data-help="sky_follows"]', c.enable_day_night_cycle ? 'Day and night change at the hours you set' : 'Dawn, day, dusk and night follow the sun');
        set('[data-help="note"]', { off: 'A line under the conditions: what\'s coming and what to wear', ai: 'Your AI writes it from the forecast. The card grows a row to fit it', entity: 'Text from a helper or a sensor of yours' }[x.note]);
        for (const key of DRAWERS) set(`[data-summary="${key}"]`, this.summary(key));
        this.querySelector('[data-status="entity"]')?.toggleAttribute('hidden', !!c.entity || !!c.dev_mode);
        this.querySelector('.reset-engine-btn')?.toggleAttribute('data-off', !Object.keys(DEFAULT_ENGINE_SETTINGS).some(k => isChanged(c, `engine_settings.${k}`)));
        this.syncPlaceholder();
        this.readingsEditor?.sync();
    }

    /** What a drawer holds, in a few words, so it rarely needs opening */
    private summary(key: string): string {
        const c = this._config ?? {};
        if (key === 'readings') {
            const list = readingsOf(c);
            const views = list.filter(r => r.view).length;
            return [c.show_attributes === false ? 'Off' : list.filter(r => !r.view).map(readingLabel).join(', ') || 'None',
                views ? `${views} in the forecast view` : '', c.indoor_temperature_entity || c.indoor_humidity_entity ? 'Indoors' : ''].filter(Boolean).join(' · ');
        }
        if (key === 'sky') {
            if (c.animate === false) return 'Still';
            const amounts = Object.keys(DEFAULT_ENGINE_SETTINGS).filter(k => isChanged(c, `engine_settings.${k}`)).length;
            const engine = engineMode(c) === 'auto' ? 'amounts follow the weather'
                : amounts ? `${amounts} ${amounts === 1 ? 'amount' : 'amounts'} changed` : 'amounts set by hand';
            return ['Moving', c.spill_particles === false ? 'inside the card' : '', c.enable_day_night_cycle ? 'set hours' : '', engine]
                .filter(Boolean).join(' · ');
        }
        if (key === 'colors') {
            const n = Object.values(c.custom_colors || {}).filter(Boolean).length;
            return n ? `${n} ${n === 1 ? 'color' : 'colors'} set` : 'None set';
        }
        if (key === 'planes') return c.flights_entity || 'Needs a Flightradar24 sensor';
        // Interactions: what a tap does, and whether a hold or a double tap does anything
        const tap = (c.tap_action as ActionConfig | undefined)?.action ?? tapDefault(c);
        const words: Record<string, string> = {
            forecast: 'A tap opens the forecast', 'more-info': 'A tap opens the weather\'s details', none: 'A tap does nothing',
            navigate: 'A tap goes to a view', url: 'A tap opens a link', toggle: 'A tap toggles', assist: 'A tap opens Assist',
        };
        const more = ['hold_action', 'double_tap_action'].filter(k => { const a = (c[k] as ActionConfig | undefined)?.action; return a && a !== 'none'; }).length;
        return (words[tap] ?? 'A tap runs an action') + (more ? ' · more gestures set' : '');
    }

    /** The place name's placeholder is the name the card shows without one: the weather entity's own */
    private syncPlaceholder(): void {
        const field = this.querySelector('#name') as (HTMLElement & { placeholder?: string }) | null;
        const entity = this._config?.entity;
        const name = entity ? this._hass?.states?.[entity]?.attributes?.friendly_name : undefined;
        if (!field || typeof name !== 'string' || !name || field.getAttribute('placeholder') === name) return;
        field.setAttribute('placeholder', name);
        field.placeholder = name;
    }

    /** Fill an ha-select once it's upgraded, and report the chosen value. */
    private _bindSelect(id: string, options: Option[], current: string, onChange: (value: string) => void): void {
        const select = this.querySelector(`#${id}`) as Select | null;
        if (!select) return;
        let latest = { options, current };
        const init = () => {
            select.options = latest.options;
            select.value = latest.current;
        };
        this.refill[id] = (next, value) => {
            latest = { options: next, current: value };
            if (customElements.get('ha-select')) init();
        };
        if (customElements.get('ha-select')) init();
        else customElements.whenDefined('ha-select').then(init);

        select.addEventListener('selected', ((e: Event) => {
            const value = (e as CustomEvent).detail?.value;
            if (!value || value === select.value && value === latest.current) return;
            select.value = value;
            latest = { ...latest, current: value };
            onChange(value);
        }) as EventListener);
        // Keep the dropdown closing from bubbling up and closing HA's dialog
        select.addEventListener('closed', (e: Event) => e.stopPropagation());
    }

    /**
     * The gestures' controls, showing the tap the card really does. Where
     * that's the card's own default (the forecast, or nothing on a
     * nightstand), picking it writes no YAML, and the picker's default (the
     * weather's details, as Home Assistant labels it) is written out, as the
     * forecast card's editor does. Mounted again when the default changes.
     */
    private mountActions(): void {
        const container = this.querySelector('#actions-editor') as HTMLElement | null;
        if (!container) return;
        const actions = readActions(this._config, this._config?.entity);
        const def = tapDefault(this._config ?? {});
        const own: ActionConfig | undefined = def === 'more-info' ? undefined : { action: def };
        mountActionsEditor(container, this._hass, actions.tap_action || !own ? actions : { ...actions, tap_action: own }, patch => {
            const next = { ...patch };
            if (own && 'tap_action' in patch) {
                next.tap_action = patch.tap_action === undefined ? { action: 'more-info' }
                    : patch.tap_action.action === own.action ? undefined : patch.tap_action;
            }
            this._set(next);
        }, { forecast: 'Forecast' });
    }

    /** The AI's status: what's missing, said right under the choice. Without a default AI Task, its picker joins the basics */
    private noteDefault?: Promise<string | null>;

    private syncNoteStatus(): void {
        void this.updateNoteStatus();
    }

    private async updateNoteStatus(): Promise<void> {
        const status = this.querySelector('#note_status') as HTMLElement | null;
        const hass = this._hass;
        if (!status) return;
        const writing = this.noteSource() === 'ai';
        let text = '';
        let noDefault = false;
        if (writing && hass) {
            if (!hass.config?.components?.includes('ai_task')) {
                text = 'The note needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic.';
            } else if (!this._config?.note_ai_task_entity) {
                this.noteDefault ??= hass.callWS({ type: 'ai_task/preferences/get' })
                    .then((prefs: { gen_data_entity_id?: string | null }) => prefs?.gen_data_entity_id ?? null)
                    .catch(() => null);
                if (!(await this.noteDefault)) {
                    text = 'You have no default AI Task. Pick one below, or set one in Settings → System → AI.';
                    noDefault = true;
                }
            }
        }
        // A live region: written only when what it says changes, or a screen reader would hear it on every update
        if (status.dataset.text !== text) {
            status.dataset.text = text;
            status.innerHTML = text ? `${INFO}<span></span>` : '';
            if (text) status.querySelector('span')!.textContent = text;
            status.hidden = !text;
        }
        if (noDefault !== this.noDefaultAi) {
            this.noDefaultAi = noDefault;
            this.sync();
        }
    }

    /** Several keys at once (undefined removes one), told to Home Assistant once, then the rows that follow them */
    _set(patch: Record<string, unknown>) {
        this._patchConfig(patch);
        this.sync();
    }

    /** Several keys at once (undefined removes one), told to Home Assistant once */
    _patchConfig(patch: Record<string, unknown>) {
        if (!this._config) this._config = {};
        const c = this._config as Record<string, unknown>;
        for (const [key, value] of Object.entries(patch)) {
            if (value === '' || value === null || value === undefined) delete c[key];
            else c[key] = value;
        }
        this._fireConfigChanged();
    }

    /**
     * A preset: the options it owns taken back to its own, the rest as they were (presets.ts). Its options reach
     * controls in several sections at once (the layout, the forecast's switches, the readings), so the editor is drawn
     * again, as for a YAML edit, keeping the open drawers and Show all settings, and the tile keeps the focus. The rows
     * of the options a preset owns are let go, so the next preset's basics are as tidy as a new card's.
     */
    private pickPreset(id: PresetId): void {
        const preset = presetById(id);
        if (!preset) return;
        for (const [row, spec] of Object.entries(ROWS)) if (spec.keys.some(k => (PRESET_KEYS as readonly string[]).includes(k))) this.pinned.delete(row);
        this._patchConfig({ ...Object.fromEntries(PRESET_KEYS.map(k => [k, undefined])), ...preset.options });
        this.render();
        (this.querySelector(`#preset input[value="${id}"]`) as HTMLElement | null)?.focus();
    }

    _updateConfig(key: string, value: unknown) {
        this._set({ [key]: value });
    }

    /** An engine setting, or none for its default: Reset amounts shows only while one differs */
    _updateEngineConfig(key: string, value: number) {
        const c = this._config ??= {};
        const engine = { ...(c.engine_settings || {}) } as Record<string, number>;
        if (value === (DEFAULT_ENGINE_SETTINGS as Record<string, number>)[key]) delete engine[key]; else engine[key] = value;
        this._set({ engine_settings: Object.keys(engine).length ? engine : undefined, ...this.staysManual(engine) });
    }

    /**
     * The sliders are manual's. A card is manual without saying so while its engine_settings tune something, so the
     * last slider back at its default says manual, or the card would turn to the weather's own amounts under the finger.
     */
    private staysManual(engine: Record<string, unknown>): { engine_mode?: 'manual' } {
        const c = this._config ?? {};
        return c.engine_mode === undefined && !hasEngineTuning({ ...c, engine_settings: engine }) ? { engine_mode: 'manual' } : {};
    }

    /** Every slider back to its default, in place: nothing is drawn again, and the drawer stays open */
    _resetEngineSettings() {
        for (const [key] of AMOUNTS) {
            const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
            const value = DEFAULT_ENGINE_SETTINGS[key];
            if (input) {
                input.value = String(value);
                this.syncFill(input);
            }
            const out = this.querySelector(`[data-out="${key}"]`);
            if (out) out.textContent = AnimatedWeatherCardEditor.formatEngineValue(key, value);
        }
        this._set({ engine_settings: undefined, ...this.staysManual({}) });
        (this.querySelector('#windSpeed') as HTMLElement | null)?.focus();
    }

    /** How far along its track a slider is, for its fill */
    private syncFill(input: HTMLInputElement): void {
        const min = Number(input.min), max = Number(input.max), v = Number(input.value);
        input.style.setProperty('--fill', `${Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100))}%`);
    }

    /** Engine values with their unit: multipliers as "1.5×", splash bounce as a percentage. */
    static formatEngineValue(key: string, value: number): string {
        if (key === 'cloudCount') return String(Math.round(value));
        if (key === 'splashBounce') return `${Math.round(value)}%`;
        return `${value.toFixed(1)}×`;
    }

    /** What each swatch shows when no custom color is set: the built-in look. */
    private static readonly DEFAULT_COLORS: Record<string, string> = {
        sunny_bg: skyColors('sunny', 'day').mid,
        rainy_bg: skyColors('rainy', 'day').mid,
        snowy_bg: skyColors('snowy', 'day').mid,
        stormy_bg: skyColors('stormy', 'day').mid,
        windy_bg: skyColors('windy', 'day').mid,
        cloudy_bg: skyColors('cloudy', 'day').mid,
        // The sky palette's fog (gsap-effects.ts)
        fog_color: '#e0e0e0',
        text_color: toHex(oklchToSrgb(SKY_TEXT)),
        temperature_color: toHex(oklchToSrgb(SKY_TEXT)),
        sun_color: '#ffd67a',
        rain_color: '#deeaff',
        snow_color: '#f7fbff',
    };

    /** A colour as #rrggbb, for the colour well: YAML also takes names and rgb(), which the well can't show */
    private static hex(value: string | undefined): string | undefined {
        if (!value) return undefined;
        if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
        if (/^#[0-9a-f]{3}$/i.test(value)) return `#${[...value.slice(1)].map(d => d + d).join('')}`.toLowerCase();
        try {
            const ctx = document.createElement('canvas').getContext('2d');
            if (!ctx) return undefined;
            ctx.fillStyle = '#000';
            ctx.fillStyle = value;
            const out = String(ctx.fillStyle);
            if (/^#[0-9a-f]{6}$/i.test(out)) return out;
            const m = out.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
            return m ? `#${m.slice(1, 4).map(n => Number(n).toString(16).padStart(2, '0')).join('')}` : undefined;
        } catch {
            return undefined;
        }
    }

    /** Each colour well and its chip, from the config; the inks sit on the sky they're seen over */
    private syncColorInputs(): void {
        const custom = (this._config?.custom_colors || {}) as Record<string, string | undefined>;
        const sky = this._config?.color_palette === 'theme' ? 'var(--card-background-color, #fff)' : AnimatedWeatherCardEditor.DEFAULT_COLORS.sunny_bg;
        for (const [key] of [...SKY_SWATCHES, ...INK_SWATCHES]) {
            const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
            if (!input) continue;
            input.value = AnimatedWeatherCardEditor.hex(custom[key]) ?? AnimatedWeatherCardEditor.DEFAULT_COLORS[key];
            (input.parentElement as HTMLElement).style.setProperty('--sky', sky);
            this.paintChip(input);
        }
        this._syncColorResets();
    }

    private paintChip(input: HTMLInputElement): void {
        const hex = AnimatedWeatherCardEditor.hex(input.value);
        if (hex) (input.parentElement as HTMLElement).style.setProperty('--c', hex);
    }

    _updateColorConfig(key: string, value: string) {
        const colors = { ...(this._config?.custom_colors || {}), [key]: value };
        this._set({ custom_colors: colors });
        this._syncColorResets();
    }

    /** A Reset beside each colour that's set, keeping its column so nothing shifts; Reset all when any is */
    _syncColorResets() {
        const custom = this._config?.custom_colors || {};
        this.querySelectorAll<HTMLElement>('.color-reset').forEach(btn => {
            btn.toggleAttribute('data-off', !custom[btn.dataset.target as keyof typeof custom]);
        });
        this.querySelector<HTMLElement>('#reset-colors-btn')?.toggleAttribute('data-off', !Object.values(custom).some(Boolean));
    }

    _resetColorConfig(key: string) {
        const colors = { ...(this._config?.custom_colors || {}) } as Record<string, string | undefined>;
        delete colors[key];
        this._set({ custom_colors: Object.keys(colors).length ? colors : undefined });
        const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
        if (input) {
            input.value = AnimatedWeatherCardEditor.DEFAULT_COLORS[key] || input.value;
            this.paintChip(input);
            input.focus();
        }
        this._syncColorResets();
    }

    _resetAllColors() {
        this._set({ custom_colors: undefined });
        this.syncColorInputs();
    }

    _fireConfigChanged() {
        const event = new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        // Only update entity pickers if we're fully initialized
        if (this._initialized && this.isConnected) {
            this.updateEntityPickers();
        }
    }

    updateEntityPickers() {
        if (!this._hass || !this.isConnected || !this._initialized) {
            return;
        }
        this.syncNoteStatus();
        this.syncPlaceholder();
        updateActionsEditor(this.querySelector('#actions-editor'), this._hass);
        this.readingsEditor?.hass(this._hass);

        const pickers = [
            { id: '#entity', domains: ['weather'] },
            { id: '#outdoor_sensor_entity', domains: ['sensor'] },
            { id: '#feels_like_entity', domains: ['sensor'] },
            { id: '#indoor_temperature_entity', domains: ['sensor'] },
            { id: '#indoor_humidity_entity', domains: ['sensor'] },
            { id: '#sun_entity', domains: ['sun'] },
            { id: '#moon_entity', domains: ['sensor'] },
            { id: '#flights_entity', domains: ['sensor'] },
            { id: '#alarm_entity', domains: ['sensor', 'input_datetime'] },
            { id: '#night_sensor', domains: ['sensor'] },
            { id: '#note_entity', domains: ['sensor', 'input_text'] },
            { id: '#note_ai_task_entity', domains: ['ai_task'] },
            { id: '#note_calendar', domains: ['calendar'] }
        ];

        pickers.forEach(({ id, domains }) => {
            const picker = this.querySelector(id) as (HTMLElement & { value: string; hass?: HomeAssistant; includeDomains?: string[] }) | null;
            if (picker) {
                picker.hass = this._hass;
                picker.includeDomains = domains;
            }
        });
    }
}
