import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULTS, DRAWERS, FORECAST_TABLE, ROWS, SECTIONS, TRACKER_TABLE, isChanged, rowChanged, rowShown, sectionShown, type RowContext, type RowTable } from '../../src/editor-rows';
import { REPLACED_OPTIONS } from '../../src/readings';
import { DEFAULT_ENGINE_SETTINGS, ENGINE_RANGES } from '../../src/constants';

// The editor's table of rows: every option belongs to one, and a value other than its default shows it in Basic

const read = (path: string) => readFileSync(join(process.cwd(), path), 'utf8');
const basic: RowContext = { all: false, place: false, note: 'off', noDefaultAi: false };
const rowOf = (key: string) => Object.entries(ROWS).filter(([, spec]) => spec.keys.includes(key)).map(([id]) => id);

/** The forecast card's own options, which the weather card's editor doesn't offer */
const NOT_THE_WEATHER_CARD = ['type', 'show_summary', 'show_hours', 'weather_effects'];

/** A value other than the default for each option */
function sample(key: string): unknown {
    const special: Record<string, unknown> = {
        layout: 'nightstand', color_palette: 'theme', hero: 'clock', forecast_metric: 'chance', forecast_graph: 'bars',
        indoor_style: 'icon', flight_label: 'route', night: 'on', wake_time: '06:30', note_tone: 'calm', note_attribute: 'summary',
        sun_entity: 'sun.elsewhere', latitude: 0, longitude: 151.2, time_zone: 'Australia/Sydney', note_calendar: ['calendar.a', 'calendar.b'],
        readings: ['wind'], uv_levels: '2, 5, 7, 10', aqi_levels: [40, 90, 140, 190, 290], metrics: ['uv'], show_sun: false, engine_mode: 'manual',
        tap_action: { action: 'navigate', navigation_path: '/x' }, hold_action: { action: 'toggle' }, double_tap_action: { action: 'more-info' },
    };
    if (key in special) return special[key];
    const d = DEFAULTS[key];
    if (typeof d === 'boolean') return !d;
    if (typeof d === 'number') return d + 1;
    // The least the card takes, so it tunes (a value out of range is unset to the card, and leaves it in auto mode)
    if (key.startsWith('engine_settings.')) return ENGINE_RANGES[key.slice(16) as keyof typeof ENGINE_RANGES][0];
    return key.endsWith('_entity') ? 'sensor.x' : 'something';
}
const withKey = (key: string): Record<string, unknown> => {
    if (key.startsWith('engine_settings.')) return { engine_settings: { [key.slice(16)]: sample(key) } };
    if (key.startsWith('custom_colors.')) return { custom_colors: { [key.slice(14)]: '#123456' } };
    return { [key]: sample(key) };
};

describe('the editor\'s rows', () => {
    const allKeys = new Set(Object.values(ROWS).flatMap(spec => spec.keys));

    it('hold every option of the weather card\'s config type', () => {
        const types = read('src/types.ts');
        const body = types.slice(types.indexOf('export interface AnimatedWeatherCardConfig {'));
        const keys = [...body.slice(0, body.indexOf('\n}')).matchAll(/^ {4}(\w+)\?:/gm)].map(m => m[1]);
        expect(keys.length).toBeGreaterThan(80);
        for (const key of keys) {
            if (NOT_THE_WEATHER_CARD.includes(key)) continue;
            if (key === 'engine_settings') { for (const k of Object.keys(DEFAULT_ENGINE_SETTINGS)) expect(allKeys.has(`engine_settings.${k}`), k).toBe(true); continue; }
            if (key === 'custom_colors') continue;
            expect(allKeys.has(key), key).toBe(true);
        }
    });

    it('hold every option the README documents for the weather card, colours and engine settings included', () => {
        const readme = read('README.md');
        const start = readme.indexOf('### Weather card', readme.indexOf('## Options'));
        const part = readme.slice(start, readme.indexOf('#### A reading', start));
        const options = [...part.matchAll(/^\| ((?:`[\w]+`(?:, )?)+) \|/gm)].flatMap(m => [...m[1].matchAll(/`(\w+)`/g)].map(o => o[1]));
        expect(options.length).toBeGreaterThan(80);
        for (const option of options) {
            const key = option in DEFAULT_ENGINE_SETTINGS ? `engine_settings.${option}`
                : /(_bg|_color)$/.test(option) ? `custom_colors.${option}` : option;
            expect(allKeys.has(key), option).toBe(true);
        }
    });

    it('sit in exactly one section each, and every section\'s rows exist', () => {
        const placed = Object.values(SECTIONS).flat();
        expect(new Set(placed).size).toBe(placed.length);
        expect(placed.sort()).toEqual(Object.keys(ROWS).sort());
        for (const d of DRAWERS) expect(SECTIONS[d]).toBeDefined();
        // A drawer holds no basics
        for (const d of DRAWERS) for (const id of SECTIONS[d]) expect(ROWS[id].tier, id).toBe('all');
    });

    it('count every option set to a value other than its default as changed, so its row shows in Basic', () => {
        for (const key of allKeys) {
            const config = { entity: 'weather.home', ...withKey(key) };
            const rows = rowOf(key).filter(id => rowChanged(id, config as never));
            expect(rows.length, key).toBeGreaterThan(0);
            const pinned = new Set(rows);
            for (const id of rows) expect(rowShown(id, config as never, basic, pinned), `${key} → ${id}`).toBe(true);
        }
    });

    it('never count a default written out, the stub\'s sun.sun or an empty object as changed', () => {
        const written = {
            entity: 'weather.home', sun_entity: 'sun.sun', animate: true, show_location: true, auto_pause: false, dev_mode: false,
            enable_day_night_cycle: false, color_palette: 'default', spill_particles: true, show_indoor: true, show_attributes: true,
            show_attribute_labels: true, show_attribute_icons: true, show_flight_labels: true, disable_lightning_shake: false,
            night_red: true, night: 'auto', forecast_days: 7, plane_speed: 1, compact: false, layout: 'default', note_max_age: 180,
            wake_time: '7:00', temperature_decimals: 0, engine_settings: {}, custom_colors: {}, metrics: ['humidity', 'wind', 'pressure', 'sun'],
            tap_action: { action: 'more-info' }, hold_action: { action: 'none' }, name: '',
        };
        const changed = Object.keys(ROWS).filter(id => rowChanged(id, written as never));
        expect(changed).toEqual(['entity']);
        // A tap the card does anyway: the forecast with it on, nothing on a nightstand
        expect(rowChanged('actions', { show_forecast: true, tap_action: { action: 'forecast' } } as never)).toBe(false);
        expect(rowChanged('actions', { layout: 'nightstand', tap_action: { action: 'none' } } as never)).toBe(false);
        expect(rowChanged('actions', { show_forecast: true, tap_action: { action: 'more-info' } } as never)).toBe(true);
        // An engine setting that isn't a number is unset to the card, and so to the editor
        expect(isChanged({ engine_settings: { rainCount: 'lots' } } as never, 'engine_settings.rainCount')).toBe(false);
    });

    it('read night as a YAML-mode dashboard hands it over, and each legacy reading option as a change to the readings', () => {
        expect(isChanged({ night: true } as never, 'night')).toBe(true);
        expect(isChanged({ night: false } as never, 'night')).toBe(true);
        for (const key of REPLACED_OPTIONS) {
            const config = { [key]: key === 'metrics' ? ['uv'] : key === 'show_sun' ? false : 'sensor.x' };
            expect(rowChanged('readings', config as never), key).toBe(true);
        }
    });

    it('show a new card six controls: a preset to start from, the weather, its name, the colors, the forecast and the note', () => {
        const fresh = { type: 'custom:animated-weather-card', entity: 'weather.home', sun_entity: 'sun.sun' };
        const shown = Object.keys(ROWS).filter(id => !ROWS[id].reason && rowShown(id, fresh as never, basic, new Set()));
        expect(shown).toEqual(['preset', 'entity', 'name', 'color_palette', 'show_forecast', 'note']);
        const sections = Object.keys(SECTIONS).filter(s => sectionShown(SECTIONS[s], fresh as never, basic, new Set()));
        expect(sections).toEqual(['start', 'weather', 'look', 'forecast', 'note']);
        // All settings: every section but the nightstand's, and the layout among them
        const all = Object.keys(SECTIONS).filter(s => sectionShown(SECTIONS[s], fresh as never, { ...basic, all: true }, new Set()));
        expect(all).toEqual(['start', 'weather', 'look', 'forecast', 'note', 'readings', 'sky', 'colors', 'planes', 'interactions', 'dev']);
        expect(rowShown('layout', fresh as never, { ...basic, all: true }, new Set())).toBe(true);
    });

    it('give a nightstand its alarm and wake time, and keep the forecast and the note out of Basic there', () => {
        const stand = { entity: 'weather.home', layout: 'nightstand' };
        // As the editor pins every row the config has changed: the layout shows, though it's no longer a basic
        const pinned = new Set(Object.keys(ROWS).filter(id => rowChanged(id, stand as never)));
        const shown = Object.keys(ROWS).filter(id => rowShown(id, stand as never, basic, pinned));
        expect(shown).toEqual(['preset', 'entity', 'name', 'layout', 'color_palette', 'alarm_entity', 'wake_time', 'why_forecast_nightstand', 'why_note_nightstand']);
        expect(sectionShown(SECTIONS.forecast, stand as never, basic, new Set())).toBe(false);
        // With all settings, every row is there with its reason above it
        expect(rowShown('show_forecast', stand as never, { ...basic, all: true }, new Set())).toBe(true);
    });

    it('show a changed option even when what it depends on is off, and the AI Task when there\'s no default', () => {
        const config = { entity: 'weather.home', forecast_graph: 'bars', plane_speed: 0.5 };
        const pinned = new Set(Object.keys(ROWS).filter(id => rowChanged(id, config as never)));
        expect(rowShown('forecast_graph', config as never, basic, pinned)).toBe(true);
        expect(rowShown('plane_speed', config as never, basic, pinned)).toBe(true);
        expect(sectionShown(SECTIONS.planes, config as never, basic, pinned)).toBe(true);
        const ai = { entity: 'weather.home', show_note: true };
        expect(rowShown('note_ai_task_entity', ai as never, { ...basic, note: 'ai' }, new Set())).toBe(false);
        expect(rowShown('note_ai_task_entity', ai as never, { ...basic, note: 'ai', noDefaultAi: true }, new Set())).toBe(true);
    });
});

describe('the forecast card\'s and the tracker\'s rows', () => {
    /** The options a README table documents, from its heading to the next */
    const documented = (from: string, to: string) => {
        const readme = read('README.md');
        const start = readme.indexOf(from);
        const part = readme.slice(start, readme.indexOf(to, start + from.length));
        return [...part.matchAll(/^\| ((?:`[\w]+`(?:, )?)+) \|/gm)].flatMap(m => [...m[1].matchAll(/`(\w+)`/g)].map(o => o[1]));
    };
    const keysOf = (table: RowTable<never>) => new Set(Object.values(table.rows).flatMap(spec => spec.keys));
    const cards: Array<[string, RowTable<never>, string[], string[]]> = [
        ['the forecast card', FORECAST_TABLE as RowTable<never>, documented('### The forecast card', '\n### '), ['entity', 'layout', 'color_palette', 'forecast_metric']],
        ['the tracker', TRACKER_TABLE as RowTable<never>, documented('### Sun tracker card', '\n### '), ['sun_entity', 'layout', 'color_palette']],
    ];

    for (const [name, table, options, basics] of cards) {
        it(`hold every option the README documents for ${name}, each row in exactly one section`, () => {
            expect(options.length).toBeGreaterThan(12);
            const keys = keysOf(table);
            for (const option of options) expect(keys.has(option), option).toBe(true);
            const placed = Object.values(table.sections).flat();
            expect(new Set(placed).size).toBe(placed.length);
            expect([...placed].sort()).toEqual(Object.keys(table.rows).sort());
        });

        it(`show ${name} its basics, every option with all settings, and an option set away from its default either way`, () => {
            const fresh = {};
            const shown = (config: object, x: RowContext, pinned = new Set<string>()) =>
                Object.keys(table.rows).filter(id => rowShown(id, config as never, x, pinned, table));
            expect(shown(fresh, basic)).toEqual(basics);
            expect(Object.keys(table.sections).filter(s => sectionShown(table.sections[s], fresh as never, basic, new Set(), table))).toHaveLength(1);
            const configured = name === 'the forecast card' ? { weather_effects: true } : fresh;
            const all = shown(configured, { ...basic, all: true, place: true });
            for (const id of Object.keys(table.rows)) expect(all, id).toContain(id);
            // Each option, set to something other than its default, shows its row with the switch off
            for (const key of keysOf(table)) {
                const d = table.defaults[key];
                const value = typeof d === 'boolean' ? !d : typeof d === 'number' ? d + 1 : key.endsWith('_action') ? { action: 'navigate', navigation_path: '/x' }
                    : key === 'color_palette' ? 'theme' : key === 'direction' ? 'right_to_left' : key === 'forecast_metric' ? 'chance' : key === 'forecast_graph' ? 'bars'
                    : key === 'latitude' || key === 'longitude' ? 10 : `${key}.x`;
                const config = { [key]: value };
                const rows = Object.keys(table.rows).filter(id => table.rows[id].keys.includes(key) && rowChanged(id, config as never, table));
                expect(rows.length, key).toBeGreaterThan(0);
                for (const id of rows) expect(rowShown(id, config as never, basic, new Set(rows), table), `${key} → ${id}`).toBe(true);
            }
        });
    }

    it('count no default written out as changed: the tracker\'s header and details on, each card\'s own tap', () => {
        const tracker = { sun_entity: 'sun.sun', show_header: true, show_details: true, direction: 'auto', compact: false, color_palette: 'default', tap_action: { action: 'more-info' }, hold_action: { action: 'none' } };
        expect(Object.keys(TRACKER_TABLE.rows).filter(id => rowChanged(id, tracker as never, TRACKER_TABLE as RowTable<never>))).toEqual(['sun_entity']);
        const forecast = { entity: 'weather.home', sun_entity: 'sun.sun', show_hours: true, forecast_days: 7, tap_action: { action: 'forecast' } };
        expect(Object.keys(FORECAST_TABLE.rows).filter(id => rowChanged(id, forecast as never, FORECAST_TABLE))).toEqual(['entity']);
        // The weather card's details are the forecast card's change, and the forecast the tracker's
        expect(rowChanged('actions', { tap_action: { action: 'more-info' } } as never, FORECAST_TABLE)).toBe(true);
        expect(rowChanged('actions', { tap_action: { action: 'forecast' } } as never, TRACKER_TABLE as RowTable<never>)).toBe(true);
    });

    it('leave out what a strip or a compact tracker has no room for, with all settings on', () => {
        const all = { ...basic, all: true };
        expect(rowShown('forecast_days', { compact: true } as never, all, new Set(), FORECAST_TABLE)).toBe(false);
        expect(rowShown('show_hours', { compact: true } as never, all, new Set(), FORECAST_TABLE)).toBe(false);
        expect(rowShown('forecast_graph', { compact: true } as never, all, new Set(), FORECAST_TABLE)).toBe(true);
        expect(rowShown('forecast_graph', { show_hours: false } as never, all, new Set(), FORECAST_TABLE)).toBe(false);
        expect(rowShown('title', { compact: true } as never, all, new Set(), TRACKER_TABLE as RowTable<never>)).toBe(false);
        expect(rowShown('moon_entity', { show_details: false } as never, all, new Set(), TRACKER_TABLE as RowTable<never>)).toBe(false);
    });
});
