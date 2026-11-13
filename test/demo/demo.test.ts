import '../../src/animated-weather-card';
import { describe, it, expect, vi } from 'vitest';
import { SKY_TEXT, oklchToSrgb, skyColors, skyPhaseFromSun, toHex } from '../../src/sky';
import { getWeatherClass } from '../../src/utils';
import { DEFAULT_ENGINE_SETTINGS } from '../../src/constants';
import { VOICES } from '../../src/note-generator';
// The live demo's plain modules (demo/): its sample world and its build
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
    AHEAD_ROWS, CARD_ROWS, CONDITIONS, DASHBOARD, DEVICES, ENGINE, ENTITIES, HA, NOTES, NOTE_FORECASTS, NOTE_VOICES, OPEN_METEO, PAINTS, PALETTES, PHASES,
    QUIET, STATION, VOICE_NOTES, aheadYaml, buildHass, forgetNotes, liveForecast, noteYaml, rowsHeight,
    colorsYaml, conditionIcon, configYaml, customColors, dashboardLayout, dashboardYaml, engineSettings, engineYaml,
    formatEngineValue, liveReading, minutesFor, moonPhase, nextFlight, paletteOf, phaseForHour, phaseForSun, placeName,
    noteFor, quietOptions, solarAt, solarElevation, solarTimes, stationStates, sunAt, sunAttributes, trackerYaml, weatherState,
    wmoCondition, SUN_TIMES,
} from '../../demo/scene.mjs';
import { PAGE_FILES, iconNames, resolveIcons } from '../../demo/build.mjs';
import { LOGO_PHASES, logoSvg } from '../../demo/logo.mjs';

describe('the demo\'s sample world', () => {
    it('puts the sun where each time of day really shows that sky', () => {
        for (const [phase, { elevation, rising }] of Object.entries(PHASES)) {
            expect(skyPhaseFromSun(elevation, rising, elevation >= 0)).toBe(phase);
        }
    });

    it('opens on the visitor\'s own time of day', () => {
        expect(phaseForHour(7)).toBe('dawn');
        expect(phaseForHour(12)).toBe('day');
        expect(phaseForHour(19)).toBe('dusk');
        expect(phaseForHour(23.5)).toBe('night');
        expect(phaseForHour(3)).toBe('night');
    });

    it('turns a clear sky into clear-night only after dark', () => {
        expect(weatherState('clear', 'day')).toBe('sunny');
        expect(weatherState('clear', 'dusk')).toBe('sunny');
        expect(weatherState('clear', 'night')).toBe('clear-night');
        expect(weatherState('rainy', 'night')).toBe('rainy');
    });

    it('reports every next sun event after now, within a day', () => {
        const now = new Date(2026, 9, 16, 13, 10);
        const attributes = sunAttributes(now, 'day');
        for (const key of ['next_dawn', 'next_rising', 'next_noon', 'next_setting', 'next_dusk'] as const) {
            const at = new Date(attributes[key]).getTime();
            expect(at).toBeGreaterThan(now.getTime());
            expect(at - now.getTime()).toBeLessThanOrEqual(24 * 3600 * 1000);
        }
    });

    it('gives every weather option a sky of its own and Home Assistant\'s name for it', () => {
        for (const phase of Object.keys(PHASES)) {
            for (const condition of CONDITIONS) {
                const hass = buildHass({ conditionId: condition.id, phase });
                const weather = hass.states[ENTITIES.weather];
                expect(getWeatherClass(weather.state)).not.toBe('');
                expect(hass.formatEntityState(weather)).not.toBe(weather.state);
            }
        }
        const hass = buildHass({ conditionId: 'rainy', phase: 'day' });
        expect(hass.localize('ui.card.weather.attributes.humidity')).toBe('Humidity');
        const moon = hass.states[ENTITIES.moon];
        expect(hass.formatEntityState(moon)).not.toBe(moon.state);
    });

    it('moves the sun on the same wave the tracker draws, matching each time of day', () => {
        for (const [phase, { elevation }] of Object.entries(PHASES)) {
            const sun = sunAt(minutesFor(phase));
            expect(phaseForSun(sun)).toBe(phase);
            expect(Math.abs(sun.elevation - elevation)).toBeLessThan(4);
        }
        // Above the horizon exactly between sunrise and sunset
        expect(sunAt(6 * 60 + 40).elevation).toBeLessThan(0);
        expect(sunAt(6 * 60 + 42).elevation).toBeGreaterThan(0);
        expect(sunAt(19 * 60 + 11).elevation).toBeGreaterThan(0);
        expect(sunAt(19 * 60 + 13).elevation).toBeLessThan(0);
    });

    it('names the time of day exactly as the card\'s sky does, all day', () => {
        for (let minutes = 0; minutes < 1440; minutes += 5) {
            const sun = sunAt(minutes);
            expect(phaseForSun(sun)).toBe(skyPhaseFromSun(sun.elevation, sun.rising, sun.elevation >= 0));
        }
    });

    it('shows the real moon, by Home Assistant\'s eight names', () => {
        const newMoon = new Date(Date.UTC(2000, 0, 6, 18, 14));
        expect(moonPhase(newMoon)).toBe('new_moon');
        expect(moonPhase(new Date(newMoon.getTime() + 14.77 * 86400000))).toBe('full_moon');
        const hass = buildHass({ conditionId: 'clear', phase: 'night' });
        for (let day = 0; day < 30; day++) {
            const state = moonPhase(new Date(newMoon.getTime() + day * 86400000));
            expect(hass.formatEntityState({ state })).not.toBe(state);
            expect(state).toMatch(/^(new_moon|waxing_crescent|first_quarter|waxing_gibbous|full_moon|waning_gibbous|last_quarter|waning_crescent)$/);
        }
    });

    it('shows the moon in place of the sun on the weather glyphs after dark', () => {
        expect(conditionIcon('clear', 'day')).toBe('mdi:weather-sunny');
        expect(conditionIcon('clear', 'night')).toBe('mdi:weather-night');
        expect(conditionIcon('partlycloudy', 'night')).toBe('mdi:weather-night-partly-cloudy');
        expect(conditionIcon('rainy', 'night')).toBe('mdi:weather-rainy');
    });

    it('writes YAML for exactly what the hero card is set up with', () => {
        const plain = configYaml({});
        expect(plain).toBe('type: custom:animated-weather-card\nentity: weather.forecast_home\nsun_entity: sun.sun\n'
            + '# Planes fly over from the Flightradar24 integration\nflights_entity: sensor.flightradar24_current_in_area\n'
            + '# A note from your AI, written from the forecast\nshow_note: true\n');

        const compact = configYaml({ layout: 'compact', colors: 'theme' }).split('\n');
        expect(compact).toContain('compact: true');
        // The one-line strip has no room for a note
        expect(compact.join('\n')).not.toContain('show_note');
        expect(compact.filter(line => line.startsWith('color_palette: theme'))).toHaveLength(1);
        expect(compact.join('\n')).not.toContain('sun-tracker');

        expect(configYaml({ layout: 'wide' }).startsWith('# ')).toBe(true);
    });

    it('writes a note for every weather, by day and by night, that fits the card\'s two lengths', () => {
        for (const condition of CONDITIONS) {
            for (const phase of Object.keys(PHASES)) {
                const [line, note] = noteFor(condition.id, phase);
                expect(NOTES[condition.id], condition.id).toBeDefined();
                // The budgets the card asks its AI for
                expect(line.length <= 40 && line.split(/\s+/).length <= 6, line).toBe(true);
                expect(note.length <= 90 && note.split(/\s+/).length <= 15, note).toBe(true);
                // No numbers or times: the notes hold for the visitor's own weather too
                expect(line + note).not.toMatch(/\d/);
            }
        }
        expect(noteFor('clear', 'dusk')).toEqual(NOTES.clear.day);
        expect(noteFor('clear', 'night')).toEqual(NOTES.clear.night);
    });

    it('stands in for the AI Task with the sample note, and keeps the note the way Home Assistant would', async () => {
        const hass = buildHass({ conditionId: 'rainy', phase: 'night' });
        expect(hass.config.components).toContain('ai_task');
        expect(hass.states[ENTITIES.weather].attributes.supported_features & 2).toBe(2);
        expect(await hass.callWS({ type: 'ai_task/preferences/get' })).toMatchObject({ gen_data_entity_id: 'ai_task.demo' });
        const answer = await hass.callService('ai_task', 'generate_data', {}, undefined, false, true);
        expect(answer.response.data).toEqual({ line: NOTES.rainy.night[0], note: NOTES.rainy.night[1] });

        const forecasts: any[] = [];
        await hass.connection.subscribeMessage((m: any) => forecasts.push(m), { type: 'weather/subscribe_forecast', entity_id: ENTITIES.weather, forecast_type: 'hourly' });
        expect(forecasts[0].type).toBe('hourly');
        expect(forecasts[0].forecast).toHaveLength(48);
        expect(forecasts[0].forecast[0]).toMatchObject({ condition: 'rainy', temperature: hass.states[ENTITIES.weather].attributes.temperature });
        expect(forecasts[0].forecast[0].precipitation_probability).toBeGreaterThanOrEqual(50);

        // One store for every card on the page, as for every screen of a user
        const seen: any[] = [];
        const unsubscribe = await hass.connection.subscribeMessage((m: any) => seen.push(m.value), { type: 'frontend/subscribe_user_data', key: 'test-key' });
        await buildHass({ conditionId: 'clear', phase: 'day' }).callWS({ type: 'frontend/set_user_data', key: 'test-key', value: { line: 'x' } });
        expect(seen).toEqual([null, { line: 'x' }]);
        (unsubscribe as () => void)();
    });

    it('writes the note lab\'s weathers in every voice, each to its own rules', () => {
        // The lab offers the card's voices and the demo's weathers
        expect(NOTE_VOICES.map(voice => voice.id).sort()).toEqual(Object.keys(VOICES).sort());
        for (const id of NOTE_FORECASTS) expect(CONDITIONS.some(c => c.id === id), id).toBe(true);
        for (const voice of NOTE_VOICES) {
            for (const id of NOTE_FORECASTS) {
                for (const phase of Object.keys(PHASES)) {
                    const [line, note] = noteFor(id, phase, voice.id);
                    const both = `${line} ${note}`;
                    const where = `${voice.id} ${id} ${phase}`;
                    expect(line.length <= 40 && line.split(/\s+/).length <= 6, `${where}: ${line}`).toBe(true);
                    expect(note.length <= 90 && note.split(/\s+/).length <= 15, `${where}: ${note}`).toBe(true);
                    expect(both, where).not.toMatch(/\d/);
                    // A storm is plain advice, whatever the voice
                    if (id === 'lightning-rainy') {
                        expect([line, note], where).toEqual(noteFor(id, phase));
                        continue;
                    }
                    if (voice.id === 'snarky') expect([line, note], where).toEqual(noteFor(id, phase));
                    else expect(VOICE_NOTES[voice.id][id], where).toBeDefined();
                    if (voice.id === 'calm') {
                        expect(both, where).not.toMatch(/\byou(r|'re|'ll)?\b|!/i);
                    }
                    if (voice.id === 'friendly') {
                        expect(both, where).toMatch(/\byou(r|'re|'ll)?\b/i);
                        expect((both.match(/!/g) ?? []).length, where).toBeLessThanOrEqual(1);
                    }
                    if (voice.id === 'dry') expect(both, where).not.toContain('!');
                }
            }
        }
        // Every voice sounds different
        const clearDay = NOTE_VOICES.map(voice => noteFor('clear', 'day', voice.id)[1]);
        expect(new Set(clearDay).size).toBe(NOTE_VOICES.length);
    });

    it('lets the note lab hold back each step, and answers in the voice picked when the AI answers', async () => {
        vi.useFakeTimers();
        try {
            let tone = 'calm';
            const hass = buildHass({
                conditionId: 'rainy', phase: 'day', weatherEntity: ENTITIES.noteWeather,
                tone: () => tone, noteDelays: { forecast: 600, write: 1600 },
            });
            expect(hass.states[ENTITIES.noteWeather].state).toBe('rainy');
            expect(hass.states[ENTITIES.weather]).toBeUndefined();

            const forecasts: any[] = [];
            await hass.connection.subscribeMessage((m: any) => forecasts.push(m), { type: 'weather/subscribe_forecast', entity_id: ENTITIES.noteWeather, forecast_type: 'hourly' });
            expect(forecasts).toHaveLength(0);
            await vi.advanceTimersByTimeAsync(600);
            expect(forecasts).toHaveLength(1);

            let answer: any = null;
            void hass.callService('ai_task', 'generate_data', {}, undefined, false, true).then((a: any) => { answer = a; });
            await vi.advanceTimersByTimeAsync(1000);
            expect(answer).toBeNull();
            // Picked while it was being written: the note comes back in the new voice
            tone = 'dry';
            await vi.advanceTimersByTimeAsync(600);
            expect(answer.response.data).toEqual({ line: VOICE_NOTES.dry.rainy.day[0], note: VOICE_NOTES.dry.rainy.day[1] });
        } finally {
            vi.useRealTimers();
        }
    });

    it('keeps the note lab\'s notes apart from the page\'s, and forgets only those', async () => {
        const hass = buildHass({ conditionId: 'clear', phase: 'day' });
        const page = `animated_weather_card_note:${ENTITIES.weather}:snarky:default::en:UTC`;
        const lab = `animated_weather_card_note:${ENTITIES.noteWeather}:snarky:default::en:UTC`;
        await hass.callWS({ type: 'frontend/set_user_data', key: page, value: { line: 'page' } });
        await hass.callWS({ type: 'frontend/set_user_data', key: lab, value: { line: 'lab' } });
        const seen: any[] = [];
        await hass.connection.subscribeMessage((m: any) => seen.push(m.value), { type: 'frontend/subscribe_user_data', key: lab });
        forgetNotes(ENTITIES.noteWeather);
        expect(seen).toEqual([{ line: 'lab' }, null]);
        expect(await hass.callWS({ type: 'frontend/get_user_data', key: lab })).toEqual({ value: null });
        expect(await hass.callWS({ type: 'frontend/get_user_data', key: page })).toEqual({ value: { line: 'page' } });
    });

    it('puts the voice in the YAML, and leaves the default out', () => {
        expect(configYaml({ tone: 'snarky' })).not.toContain('note_tone');
        expect(configYaml({ tone: 'dry' }).split('\n')).toContain('note_tone: dry');
        // The compact strip has no note, so no voice
        expect(configYaml({ layout: 'compact', tone: 'dry' })).not.toContain('note_tone');
        expect(noteYaml('friendly')).toBe('show_note: true\nnote_tone: friendly  # snarky, calm, friendly or dry\n');
    });

    it('adds your sensors to the YAML only when they are on', () => {
        expect(configYaml({ station: false })).not.toContain('sensor.garden');
        const lines = configYaml({ station: true }).split('\n');
        for (const row of STATION) expect(lines).toContain(`${row.option}: ${row.entity}`);
    });

    it('writes the tracker at each size with options it really has', () => {
        const source = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');
        const tracker = source('src/sun-tracker-card.ts');
        const weather = source('src/types.ts');
        const options = (yaml: string) => yaml.trimEnd().split('\n')
            .filter(line => !/^\s*#/.test(line) && !/^\s*(- )?type:/.test(line) && line !== 'cards:')
            .map(line => line.replace(/^\s*(- )?/, '').split(':')[0]);

        const card = trackerYaml({ layout: 'regular' });
        expect(card.split('\n')[0]).toBe('type: custom:animated-sun-tracker-card');
        for (const option of options(card)) expect(tracker).toContain(`config.${option}`);
        expect(card).toContain('# The moon phase comes from the Moon integration\nmoon_entity: sensor.moon_phase');

        const wall = trackerYaml({ layout: 'wide', colors: 'theme' });
        expect(wall.startsWith('# Wall: ')).toBe(true);
        for (const option of options(wall)) expect(tracker).toContain(`config.${option}`);

        // Compact sits under the weather card, as the README pairs them
        const pair = trackerYaml({ layout: 'compact', colors: 'theme' }).split('\n');
        expect(pair[0]).toBe('type: vertical-stack');
        expect(pair).toContain('  - type: custom:animated-weather-card');
        expect(pair).toContain('  - type: custom:animated-sun-tracker-card');
        expect(pair).toContain('    show_sun: false');
        expect(pair).toContain('    compact: true');
        expect(pair.filter(line => line.startsWith('    color_palette: theme'))).toHaveLength(2);
        const [weatherLines, trackerLines] = pair.join('\n').split('  - type: custom:animated-sun-tracker-card');
        for (const option of options(weatherLines)) expect(weather).toContain(`${option}?:`);
        for (const option of options(trackerLines)) expect(tracker).toContain(`config.${option}`);
    });

    it('wires the station through real card options', () => {
        const types = readFileSync(join(process.cwd(), 'src/types.ts'), 'utf8');
        for (const row of STATION) expect(types).toContain(`${row.option}?: string`);
    });

    it('adds the station to hass only when it is on, so the card falls back to the forecast', () => {
        const without = buildHass({ conditionId: 'rainy', phase: 'day' });
        for (const row of STATION) expect(without.states[row.entity]).toBeUndefined();
        const readings = Object.fromEntries(STATION.map(row => [row.id, row.value]));
        const withStation = buildHass({ conditionId: 'rainy', phase: 'day', sensors: stationStates(readings) });
        expect(withStation.states['sensor.garden_temperature'].state).toBe('18.4');
        expect(withStation.states['sensor.garden_pressure'].attributes.unit_of_measurement).toBe('hPa');
        expect(withStation.states[ENTITIES.weather].state).toBe('rainy');
    });

    it('offers the engine settings the card has, with the editor\'s ranges and defaults', () => {
        const utils = readFileSync(join(process.cwd(), 'src/utils.ts'), 'utf8');
        const editor = readFileSync(join(process.cwd(), 'src/config-editor.ts'), 'utf8');
        expect(ENGINE.map(row => row.id).sort()).toEqual(Object.keys(DEFAULT_ENGINE_SETTINGS).sort());
        for (const row of ENGINE) {
            expect(row.value).toBe((DEFAULT_ENGINE_SETTINGS as Record<string, number>)[row.id]);
            expect(utils).toContain(`engineSettings.${row.id}`);
            expect(editor).toContain(`id="${row.id}" min="${row.min}" max="${row.max}" step="${row.step}"`);
            expect(CONDITIONS.some(c => c.id === row.shows)).toBe(true);
        }
        expect(formatEngineValue('cloudCount', 3)).toBe('3');
        expect(formatEngineValue('splashBounce', 80)).toBe('80%');
        expect(formatEngineValue('rainCount', 1)).toBe('1.0×');
        expect(formatEngineValue('windSpeed', 3.5)).toBe('3.5×');
    });

    it('writes only the engine settings and quiet switches that change something', () => {
        const defaults = Object.fromEntries(ENGINE.map(row => [row.id, row.value]));
        expect(engineSettings(defaults)).toEqual({});
        expect(engineYaml(defaults)).toBe('\n');
        expect(engineSettings({ ...defaults, rainCount: 2.6, cloudCount: 6 })).toEqual({ rainCount: 2.6, cloudCount: 6 });
        expect(engineYaml({ ...defaults, rainCount: 2 })).toBe('engine_settings:\n  rainCount: 2\n');
        expect(quietOptions({})).toEqual({});
        expect(quietOptions({ still: true, numbers: true }))
            .toEqual({ animate: false, show_attribute_labels: false, show_attribute_icons: false });
        const types = readFileSync(join(process.cwd(), 'src/types.ts'), 'utf8');
        for (const row of QUIET) for (const option of Object.keys(row.options)) expect(types).toContain(`${option}?: boolean`);
    });

    it('starts every paint at the colour the card uses without it', () => {
        const colorUtils = readFileSync(join(process.cwd(), 'src/color-utils.ts'), 'utf8');
        const editor = readFileSync(join(process.cwd(), 'src/config-editor.ts'), 'utf8');
        for (const row of PAINTS) {
            // The key the card reads
            expect(colorUtils).toContain(row.id.endsWith('_bg') ? `addSky('${row.id}'` : `customColors.${row.id}`);
            if (row.id.endsWith('_bg')) {
                expect(row.builtIn).toBe(skyColors(row.id.replace('_bg', '') as Parameters<typeof skyColors>[0], 'day').mid);
            } else if (row.id === 'text_color') {
                expect(row.builtIn).toBe(toHex(oklchToSrgb(SKY_TEXT)));
            } else {
                expect(editor).toContain(`${row.id}: '${row.builtIn}'`);
            }
            if (row.shows) expect(CONDITIONS.some(c => c.id === row.shows)).toBe(true);
        }
    });

    it('keeps only the colours that are set, valid and not built in', () => {
        expect(customColors({})).toEqual({});
        expect(customColors({ sunny_bg: '#1b64a5' })).toEqual({});
        expect(customColors({ sunny_bg: '#1F6F8B', rainy_bg: 'blue', snowy_bg: '#12' })).toEqual({ sunny_bg: '#1f6f8b' });
        expect(colorsYaml({ sunny_bg: '#1f6f8b', text_color: '#ffffff' }))
            .toBe('custom_colors:\n  sunny_bg: "#1f6f8b"\n  text_color: "#ffffff"\n');
        expect(colorsYaml({})).toBe('\n');
        for (const palette of PALETTES) {
            expect(paletteOf(palette.colors)?.id).toBe(palette.id);
            for (const value of Object.values(palette.colors)) expect(value).toMatch(/^#[0-9a-f]{6}$/);
        }
        expect(paletteOf({ sunny_bg: '#000000' })).toBeNull();
    });

    it('adds the engine, the switches and the colours to the card\'s YAML only when they are set', () => {
        expect(configYaml({})).not.toMatch(/engine_settings|custom_colors|animate: false/);
        const lines = configYaml({ engine: { rainCount: 2 }, paints: { sunny_bg: '#1f6f8b' }, quiet: { inside: true } }).split('\n');
        expect(lines).toContain('spill_particles: false');
        expect(lines).toContain('engine_settings:');
        expect(lines).toContain('  rainCount: 2');
        expect(lines).toContain('custom_colors:');
        expect(lines).toContain('  sunny_bg: "#1f6f8b"');
        // Custom skies paint the sky palette only
        expect(configYaml({ colors: 'theme', paints: { sunny_bg: '#1f6f8b' } })).not.toContain('custom_colors');
    });

    it('lays the dashboard out as Home Assistant does on each screen', () => {
        expect(HA.rowHeight).toBe(56);
        expect(dashboardLayout(393)).toEqual({ sidebar: false, columns: 1, content: 353 });
        expect(dashboardLayout(820)).toEqual({ sidebar: false, columns: 2, content: 780 });
        // With the sidebar docked, a narrow desktop has one column
        expect(dashboardLayout(942)).toEqual({ sidebar: true, columns: 1, content: 646 });
        expect(dashboardLayout(1232)).toEqual({ sidebar: true, columns: 2, content: 936 });
        expect(dashboardLayout(2600).columns).toBe(HA.maxColumns);
        for (const device of DEVICES) if (device.width) expect(device.needs).toBeLessThanOrEqual(device.width + 16);
    });

    it('gives the cards the rows they declare, and a tile everything else', () => {
        type Sized = HTMLElement & { setConfig(c: object): void; getGridOptions(): { rows: number } };
        const rowsOf = (type: string, config: object) => {
            const card = document.createElement(type) as Sized;
            card.setConfig(config);
            return card.getGridOptions().rows;
        };
        // The dashboard's weather card writes a note; its strip is compact
        expect(rowsOf('animated-weather-card', { entity: 'weather.home', show_note: true })).toBe(CARD_ROWS.weather);
        expect(rowsOf('animated-weather-card', { entity: 'weather.home', compact: true })).toBe(CARD_ROWS.compact);
        expect(rowsOf('animated-sun-tracker-card', { sun_entity: 'sun.sun', compact: true })).toBe(CARD_ROWS.tracker);
        const cards = DASHBOARD.flatMap(section => section.cards);
        for (const kind of Object.keys(CARD_ROWS)) expect(cards.filter(item => item.card === kind)).toHaveLength(1);
        for (const item of cards) {
            if (item.card) continue;
            expect(item.tile).toMatch(/^[a-z_]+\.[a-z_]+$/);
            expect(item.icon).toMatch(/^mdi:[a-z-]+$/);
            if (item.color) expect(item.color).toMatch(/^#[0-9a-f]{6}$/);
        }
        expect(DASHBOARD.find(section => section.span === 2)?.cards[0].card).toBe('weather');
    });

    it('writes the dashboard as a sections view with options the cards really have', () => {
        const source = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');
        const tracker = source('src/sun-tracker-card.ts');
        const weather = source('src/types.ts');
        const yaml = dashboardYaml();
        const lines = yaml.trimEnd().split('\n');
        expect(lines[0]).toBe('views:');
        expect(lines).toContain('  - type: sections');
        expect(lines).toContain('        column_span: 2');
        expect(lines).toContain('          - type: heading');
        expect(lines).toContain('          - type: tile');
        expect(lines.filter(line => line.includes('custom:animated-weather-card'))).toHaveLength(2);
        expect(lines.filter(line => line.includes('custom:animated-sun-tracker-card'))).toHaveLength(1);
        expect(lines).toContain('            compact: true');
        expect(lines).toContain('            show_sun: false');
        expect(yaml).not.toContain('- #');
        // Each card's own options, checked against the card that takes them
        const items = yaml.split(/\n {10}- /).slice(1);
        const custom = items.filter(item => item.startsWith('type: custom:'));
        expect(custom).toHaveLength(3);
        for (const item of custom) {
            const options = item.split('\n').slice(1).filter(line => /^ {12}[a-z_]+:/.test(line)).map(line => line.trim().split(':')[0]);
            expect(options.length).toBeGreaterThan(0);
            for (const option of options) {
                if (item.includes('sun-tracker')) expect(tracker).toContain(`config.${option}`);
                else expect(weather).toContain(`${option}?:`);
            }
        }
        expect(dashboardYaml({ colors: 'theme' }).split('\n').filter(line => line.endsWith('color_palette: theme'))).toHaveLength(3);
    });

    /** The forecast a hass answers with, as the cards subscribe to it. */
    const forecastOf = async (hass: any, entityId = ENTITIES.weather) => {
        const got: Record<string, any> = {};
        for (const type of ['hourly', 'daily', 'twice_daily']) {
            await hass.connection.subscribeMessage((m: any) => { got[type] = m.forecast; }, { type: 'weather/subscribe_forecast', entity_id: entityId, forecast_type: type });
        }
        return got;
    };
    const HOUR = 3600_000;

    it('forecasts 48 hours and ten days that agree with the card and with each other', async () => {
        const now = new Date(2026, 10, 11, 13, 10);
        const hass = buildHass({ conditionId: 'partlycloudy', phase: 'day', sun: sunAt(minutesFor('day')), now });
        const weather = hass.states[ENTITIES.weather];
        // Hourly and daily, as most integrations have; no twice-daily
        expect(weather.attributes.supported_features & 3).toBe(3);
        expect(weather.attributes.supported_features & 4).toBe(0);
        const { hourly, daily, twice_daily } = await forecastOf(hass);
        expect(twice_daily).toBeNull();

        // The hour under way is now, and reads what the card shows
        expect(hourly).toHaveLength(48);
        expect(Date.parse(hourly[0].datetime)).toBe(new Date(2026, 10, 11, 13).getTime());
        hourly.forEach((h: any, i: number) => { if (i) expect(Date.parse(h.datetime) - Date.parse(hourly[i - 1].datetime)).toBe(HOUR); });
        expect(hourly[0]).toMatchObject({
            condition: weather.state, temperature: weather.attributes.temperature, apparent_temperature: weather.attributes.apparent_temperature,
            humidity: weather.attributes.humidity, wind_speed: weather.attributes.wind_speed, pressure: weather.attributes.pressure,
        });
        for (const h of hourly) {
            for (const field of ['temperature', 'apparent_temperature', 'precipitation_probability', 'precipitation', 'wind_speed', 'wind_gust_speed',
                'wind_bearing', 'humidity', 'dew_point', 'pressure', 'cloud_coverage', 'uv_index', 'is_daytime']) expect(h, field).toHaveProperty(field);
            expect(h.dew_point).toBeLessThanOrEqual(h.temperature);
            expect(h.wind_gust_speed).toBeGreaterThan(h.wind_speed);
            // Day by the sun's times: no UV and no sunny hours after dark
            const at = new Date(h.datetime);
            const minute = at.getHours() * 60;
            expect(h.is_daytime).toBe(minute >= SUN_TIMES.rise[0] * 60 + SUN_TIMES.rise[1] && minute < SUN_TIMES.set[0] * 60 + SUN_TIMES.set[1]);
            if (!h.is_daytime) expect([h.uv_index, h.condition === 'sunny']).toEqual([0, false]);
        }
        // The temperature follows the day: warmest in the afternoon, coolest before dawn
        const tomorrow = hourly.filter((h: any) => new Date(h.datetime).getDate() === 12);
        const warmest = tomorrow.reduce((a: any, b: any) => (b.temperature > a.temperature ? b : a));
        const coolest = tomorrow.reduce((a: any, b: any) => (b.temperature < a.temperature ? b : a));
        expect(new Date(warmest.datetime).getHours()).toBeGreaterThanOrEqual(11);
        expect(new Date(coolest.datetime).getHours()).toBeLessThanOrEqual(7);

        // A rain band: its chance builds before it and tails off after it, and the rain is heaviest inside it
        const chance = hourly.map((h: any) => h.precipitation_probability);
        const first = chance.findIndex((c: number) => c >= 50);
        let last = first;
        while (chance[last + 1] >= 50) last++;
        expect(first).toBeGreaterThan(1);
        expect(last).toBeGreaterThan(first);
        expect(chance[first - 2]).toBeLessThan(chance[first - 1]);
        expect(chance[first - 1]).toBeLessThan(chance[first]);
        expect(chance[last + 1]).toBeLessThan(chance[last]);
        expect(chance[last + 2]).toBeLessThanOrEqual(chance[last + 1]);
        const band = hourly.slice(first, last + 1).map((h: any) => h.precipitation);
        expect(Math.min(...band)).toBeGreaterThan(0);
        expect(Math.max(...band)).toBeGreaterThan(band[0]);
        expect(hourly[first - 3].precipitation).toBe(0);
        // It feels its own way: not always a fixed step from the temperature
        expect(new Set(hourly.map((h: any) => Math.round((h.temperature - h.apparent_temperature) * 10))).size).toBeGreaterThan(3);

        // Ten days from today, each one read off its own hours
        expect(daily).toHaveLength(10);
        expect(Date.parse(daily[0].datetime)).toBe(new Date(2026, 10, 11).getTime());
        for (const day of daily) {
            const date = new Date(day.datetime);
            const own = hourly.filter((h: any) => new Date(h.datetime).toDateString() === date.toDateString());
            for (const h of own) {
                expect(h.temperature).toBeLessThanOrEqual(day.temperature);
                expect(h.temperature).toBeGreaterThanOrEqual(day.templow);
                expect(h.precipitation_probability).toBeLessThanOrEqual(day.precipitation_probability);
            }
            expect(day.templow).toBeLessThan(day.temperature);
        }
        expect(weather.attributes.temperature).toBeLessThanOrEqual(daily[0].temperature);
        expect(new Set(daily.map((d: any) => d.condition)).size).toBeGreaterThan(3);
        expect(daily.some((d: any) => d.precipitation_probability >= 50 && d.precipitation > 0)).toBe(true);

        // The week reads the same at any time of day: only today's own hours move with the clock
        const night = await forecastOf(buildHass({ conditionId: 'partlycloudy', phase: 'night', sun: sunAt(minutesFor('night')), now: new Date(2026, 10, 11, 23, 15) }));
        daily.forEach((day: any, d: number) => {
            const other = night.daily[d];
            expect(other.datetime).toBe(day.datetime);
            if (d < 3) return;
            expect(other.condition).toBe(day.condition);
            expect(other.temperature).toBeCloseTo(day.temperature, 0);
            expect(other.templow).toBeCloseTo(day.templow, 0);
        });
        expect(Math.abs(night.daily[0].temperature - daily[0].temperature)).toBeLessThanOrEqual(1);
    });

    it('tells a story that suits each weather, and turns cold rain into snow', async () => {
        const now = new Date(2026, 10, 11, 13, 10);
        for (const condition of CONDITIONS) {
            const hass = buildHass({ conditionId: condition.id, phase: 'day', sun: sunAt(minutesFor('day')), now });
            const { hourly, daily } = await forecastOf(hass);
            expect(hourly[0].condition, condition.id).toBe(hass.states[ENTITIES.weather].state);
            const wet = ['rainy', 'pouring', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail'].includes(condition.id);
            expect(hourly[0].precipitation_probability >= 50, condition.id).toBe(wet);
            expect(daily.every((d: any) => d.templow <= condition.temp + 12 && d.temperature >= condition.temp - 12), condition.id).toBe(true);
        }
        const snow = await forecastOf(buildHass({ conditionId: 'snowy', phase: 'day', sun: sunAt(minutesFor('day')), now }));
        const conditions = new Set([...snow.hourly, ...snow.daily].map((e: any) => e.condition));
        for (const warm of ['rainy', 'pouring', 'lightning-rainy']) expect(conditions.has(warm), warm).toBe(false);
    });

    it('keeps one forecast connection per world, so a card left at another hour stays there', async () => {
        const now = new Date(2026, 10, 11, 13, 10);
        const world = { conditionId: 'partlycloudy', phase: 'day', sun: sunAt(minutesFor('day')), now };
        const hass = buildHass(world);
        // A plane, or another push of the same world: the same connection, so nothing resubscribes
        expect(buildHass({ ...world, flights: [nextFlight(0)] }).connection).toBe(hass.connection);
        expect(buildHass({ ...world, now: new Date(2026, 10, 11, 13, 50) }).connection).toBe(hass.connection);
        // Another weather, another hour, the note lab's own entity: a new forecast, on a connection of its own
        expect(buildHass({ ...world, conditionId: 'rainy' }).connection).not.toBe(hass.connection);
        expect(buildHass({ ...world, now: new Date(2026, 10, 11, 14, 5) }).connection).not.toBe(hass.connection);
        expect(buildHass({ ...world, weatherEntity: ENTITIES.noteWeather }).connection).not.toBe(hass.connection);
        // The station's world shares the entity, never its forecast
        const station = buildHass({ ...world, conditionId: 'clear' });
        const [mine, theirs] = await Promise.all([forecastOf(hass), forecastOf(station)]);
        expect(mine.hourly[0].condition).toBe('partlycloudy');
        expect(theirs.hourly[0].condition).toBe('sunny');
    });

    it('gives the cards your own forecast from the same Open-Meteo call, now on your reading', async () => {
        // Every field the page asks for, an hour apart from the hour under way
        const start = Date.UTC(2026, 10, 11, 21) / 1000;
        const fields = OPEN_METEO.hourly.split(',');
        const hourlyData: Record<string, unknown[]> = { time: [start, start + 3600, start + 7200] };
        for (const field of fields) hourlyData[field] = [1, 2, null];
        Object.assign(hourlyData, { weather_code: [0, 61, 3], is_day: [1, 0, 0], precipitation_probability: [0, 80, null] });
        const dailyData: Record<string, unknown[]> = { time: [start - 21 * 3600] };
        for (const field of OPEN_METEO.daily.split(',')) dailyData[field] = [5];
        dailyData.weather_code = [95];
        const data = {
            ...forecast, hourly: hourlyData, hourly_units: { precipitation: 'inch' }, daily: dailyData,
        };
        const mapped = liveForecast(data)!;
        expect(mapped.hourly.map((h: any) => h.condition)).toEqual(['sunny', 'rainy', 'cloudy']);
        expect(mapped.hourly[0].datetime).toBe(new Date(start * 1000).toISOString());
        // Each requested field lands in its Home Assistant field; what Open-Meteo leaves null is left out
        expect(Object.keys(mapped.hourly[0]).length).toBe(fields.length + 1);
        expect(mapped.hourly[2]).not.toHaveProperty('temperature');
        expect(mapped.hourly[1]).toMatchObject({ is_daytime: false, precipitation_probability: 80 });
        expect(mapped.daily![0]).toMatchObject({ condition: 'lightning-rainy', temperature: 5, templow: 5, precipitation: 5, uv_index: 5 });
        expect(liveForecast(forecast)).toBeNull();

        const live = liveReading(data, 'Lisbon');
        expect(live.units.precipitation).toBe('in');
        // Ten minutes into the first hour: that hour is now, and reads the reading, under the sky the card shows
        const hass = buildHass({ conditionId: wmoCondition(live.code), phase: 'night', live, now: new Date((start + 600) * 1000) });
        expect(hass.states[ENTITIES.weather].attributes.precipitation_unit).toBe('in');
        const { hourly, daily } = await forecastOf(hass);
        expect(hourly).toHaveLength(3);
        expect(hourly[0]).toMatchObject({ condition: 'cloudy', temperature: live.temp, apparent_temperature: live.feels, humidity: live.humidity });
        expect(hourly[1].condition).toBe('rainy');
        expect(daily).toEqual(mapped.daily);
        // An hour on, the one that's over is gone
        const later = await forecastOf(buildHass({ conditionId: wmoCondition(live.code), phase: 'night', live, now: new Date((start + 3600 + 600) * 1000) }));
        expect(later.hourly).toHaveLength(2);
    });

    it('sizes the forecast section\'s cards by the rows they ask for, at a phone\'s width', () => {
        type Sized = HTMLElement & { setConfig(c: object): void; getGridOptions(): { rows: number } };
        const rowsOf = (type: string, config: object) => {
            const card = document.createElement(type) as Sized;
            card.setConfig({ entity: 'weather.home', ...config });
            return card.getGridOptions().rows;
        };
        expect(rowsOf('animated-weather-card', { show_forecast: true, show_clock: true })).toBe(AHEAD_ROWS.hours);
        expect(rowsOf('animated-forecast-card', {})).toBe(AHEAD_ROWS.card);
        expect(rowsOf('animated-weather-card', { compact: true })).toBe(AHEAD_ROWS.compact);
        expect(rowsOf('animated-forecast-card', { compact: true })).toBe(AHEAD_ROWS.strip);
        // A sections view's rows and gaps: eight rows on a phone is 504 px
        expect(rowsHeight(AHEAD_ROWS.hours)).toBe(504);
        expect(rowsHeight(AHEAD_ROWS.card)).toBe(440);
        expect(rowsHeight(2)).toBe(120);
    });

    it('writes the forecast section\'s YAML with options the cards really have', () => {
        const types = readFileSync(join(process.cwd(), 'src/types.ts'), 'utf8');
        const hours = aheadYaml('hours');
        expect(hours.split('\n')[0]).toBe('type: custom:animated-weather-card');
        expect(hours).toContain('show_forecast: true');
        expect(hours).toContain('show_clock: true');
        expect(aheadYaml('card').split('\n')[0]).toBe('type: custom:animated-forecast-card');
        const strip = aheadYaml('strip');
        expect(strip.split('\n').slice(0, 2)).toEqual(['type: vertical-stack', 'cards:']);
        expect(strip).toContain('  - type: custom:animated-weather-card');
        expect(strip).toContain('  - type: custom:animated-forecast-card');
        expect(strip.match(/compact: true/g)).toHaveLength(2);
        for (const slot of ['hours', 'card', 'strip']) {
            for (const colors of ['sky', 'theme']) {
                const yaml = aheadYaml(slot, { colors });
                expect(yaml.includes('color_palette: theme'), `${slot} ${colors}`).toBe(colors === 'theme');
                for (const [, key] of yaml.matchAll(/^\s*(?:- )?([a-z_]+):/gm)) {
                    if (key === 'type' || key === 'cards') continue;
                    expect(types, `${key} in ${slot}`).toContain(`${key}?:`);
                }
            }
        }
    });

    it('maps WMO weather codes to the keys Home Assistant\'s Open-Meteo integration would', () => {
        expect(wmoCondition(0)).toBe('clear');
        expect(wmoCondition(1)).toBe('clear');
        expect(wmoCondition(2)).toBe('partlycloudy');
        expect(wmoCondition(3)).toBe('cloudy');
        expect(wmoCondition(45)).toBe('fog');
        expect(wmoCondition(61)).toBe('rainy');
        expect(wmoCondition(65)).toBe('pouring');
        expect(wmoCondition(82)).toBe('pouring');
        expect(wmoCondition(75)).toBe('snowy');
        expect(wmoCondition(95)).toBe('lightning-rainy');
        expect(wmoCondition(42)).toBe('clear');
        for (const code of [0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99]) {
            expect(CONDITIONS.some(c => c.id === wmoCondition(code))).toBe(true);
        }
    });

    const forecast = {
        current_units: { temperature_2m: '°C', pressure_msl: 'hPa', wind_speed_10m: 'km/h' },
        current: { time: '2026-10-20T06:30', temperature_2m: 12.2, relative_humidity_2m: 89, apparent_temperature: 11.7, is_day: 0, weather_code: 3, pressure_msl: 1014.4, wind_speed_10m: 4, wind_direction_10m: 275 },
        daily: { time: ['2026-10-20'], sunrise: ['2026-10-20T07:50'], sunset: ['2026-10-20T18:51'] },
    };

    it('puts the real sun where you are, where Open-Meteo puts it', () => {
        // Open-Meteo, Lisbon, 2026-10-20: sunrise 07:50 and sunset 18:51, Lisbon time (UTC+1)
        const [lat, lon] = [38.72, -9.14];
        expect(solarElevation(new Date(Date.UTC(2026, 9, 20, 6, 50)), lat, lon)).toBeCloseTo(-0.8, 0);
        expect(solarElevation(new Date(Date.UTC(2026, 9, 20, 17, 51)), lat, lon)).toBeCloseTo(-0.8, 0);
        expect(solarElevation(new Date(Date.UTC(2026, 9, 20, 12, 20)), lat, lon)).toBeGreaterThan(40);
        expect(solarElevation(new Date(Date.UTC(2026, 9, 20, 0, 30)), lat, lon)).toBeLessThan(-40);
        // Sydney, the same day, around its local noon (UTC+11)
        expect(solarElevation(new Date(Date.UTC(2026, 9, 20, 1, 50)), -33.87, 151.21)).toBeGreaterThan(60);
    });

    it('reads sunrise, sunset and the twilights off that sun, in local time, with the day on the sample\'s wave', () => {
        // The clock's day is the visitor's, where they are: Lisbon's, for Lisbon
        const zone = process.env.TZ;
        process.env.TZ = 'Europe/Lisbon';
        try {
            readsLisbonsDay();
        } finally {
            if (zone === undefined) delete process.env.TZ;
            else process.env.TZ = zone;
        }
    });

    function readsLisbonsDay() {
        const where = { latitude: 38.72, longitude: -9.14 };
        const day = new Date(2026, 9, 20, 12);
        const times = solarTimes(where, day);
        // Open-Meteo for the day: sunrise 07:50, sunset 18:51
        const minute = ([h, m]: number[]) => h * 60 + m;
        expect(Math.abs(minute(times.rise) - (7 * 60 + 50))).toBeLessThanOrEqual(2);
        expect(Math.abs(minute(times.set) - (18 * 60 + 51))).toBeLessThanOrEqual(2);
        const dawnBefore = minute(times.rise) - minute(times.dawn);
        const duskAfter = minute(times.dusk) - minute(times.set);
        expect(dawnBefore).toBeGreaterThan(20);
        expect(dawnBefore).toBeLessThan(40);
        expect(duskAfter).toBeGreaterThan(20);
        expect(duskAfter).toBeLessThan(40);
        expect(minute(times.noon)).toBeGreaterThan(minute(times.rise));
        expect(minute(times.noon)).toBeLessThan(minute(times.set));
        // The sun the card reads: up and rising after sunrise, up and setting before sunset, down at night
        expect(solarAt(minute(times.rise) + 60, where, day)).toMatchObject({ rising: true });
        expect(solarAt(minute(times.rise) + 60, where, day).elevation).toBeGreaterThan(6);
        expect(solarAt(minute(times.set) - 60, where, day)).toMatchObject({ rising: false });
        expect(solarAt(minute(times.dawn) + 5, where, day).elevation).toBeGreaterThan(-6);
        expect(solarAt(minute(times.dawn) - 5, where, day).elevation).toBeLessThan(-6);
        // Where the sun never rises, the sample's day stands
        expect(solarTimes({ latitude: 78.2, longitude: 15.6 }, new Date(2026, 11, 21, 12))).toBe(SUN_TIMES);
        // The sample's wave takes a day of its own too, whatever zone the machine is in
        expect(sunAt(minute(times.rise) - 30, times).elevation).toBeLessThan(0);
        expect(sunAt(minute(times.rise) + 30, times).elevation).toBeGreaterThan(0);
        expect(sunAttributes(new Date(2026, 9, 20, 6, 30), 'night', { elevation: -10, rising: true }, times).next_rising).toContain('T');
    }

    it('names your place from the geocoder: the city, else the locality or the region, else Here', () => {
        expect(placeName({ city: 'Lisbon', locality: 'Santo Antonio', principalSubdivision: 'Lisboa' })).toBe('Lisbon');
        expect(placeName({ city: '', locality: 'Sintra', principalSubdivision: 'Lisboa' })).toBe('Sintra');
        expect(placeName({ principalSubdivision: ' Lisboa ' })).toBe('Lisboa');
        expect(placeName({})).toBe('Here');
        expect(placeName(null)).toBe('Here');
    });

    it('shows your readings as they came, in your units, under the sky of your weather', () => {
        expect(liveReading(forecast, 'Lisbon').name).toBe('Lisbon');
        const live = liveReading(forecast);
        expect(live).toMatchObject({ name: 'Here', code: 3, temp: 12.2, feels: 11.7, humidity: 89, pressure: 1014.4, wind: 4, bearing: 275 });
        const hass = buildHass({ conditionId: wmoCondition(live.code), phase: 'night', live, sunTimes: solarTimes({ latitude: 38.72, longitude: -9.14 }) });
        const weather = hass.states[ENTITIES.weather];
        expect(weather.state).toBe('cloudy');
        // No night cooling on a real reading
        expect(weather.attributes.temperature).toBe(12.2);
        expect(weather.attributes.friendly_name).toBe('Here');
        expect(weather.attributes.temperature_unit).toBe('°C');
        const american = liveReading({ ...forecast, current_units: { temperature_2m: '°F', wind_speed_10m: 'mp/h' } });
        expect(buildHass({ conditionId: 'cloudy', phase: 'day', live: american }).states[ENTITIES.weather].attributes.temperature_unit).toBe('°F');
        // The sample's readings are untouched
        expect(buildHass({ conditionId: 'cloudy', phase: 'night' }).states[ENTITIES.weather].attributes.temperature).toBe(12);
    });

    it('sends each plane in as a new flight, so the card flies every one', () => {
        const ids = Array.from({ length: 6 }, (_, i) => nextFlight(i).id);
        expect(new Set(ids).size).toBe(ids.length);
        expect(nextFlight(0).on_ground).toBe(0);
    });
});

describe('the demo build', () => {
    it('ships every icon the cards and the page name', () => {
        const names = iconNames();
        expect(names).toContain('mdi:navigation');
        // The page's own glyphs: weather options, the plane, copy, the steppers
        for (const condition of CONDITIONS) {
            expect(names).toContain(condition.icon);
            if (condition.nightIcon) expect(names).toContain(condition.nightIcon);
        }
        for (const icon of ['mdi:airplane', 'mdi:content-copy', 'mdi:check', 'mdi:minus', 'mdi:plus', 'mdi:chevron-down', 'mdi:crosshairs-gps']) expect(names).toContain(icon);
        expect(names.every(name => !name.endsWith('-'))).toBe(true);
        const icons = resolveIcons(names);
        expect(Object.keys(icons)).toHaveLength(names.length);
    });

    it('gives both pages one share image at the site, a JPEG the build ships', () => {
        const site = 'https://alexsto1an.github.io/ha-ani-weather-card/';
        const image = readFileSync(join(process.cwd(), 'docs/images/share.jpg'));
        // A JPEG: Facebook and LinkedIn don't take WebP for og:image
        expect([...image.subarray(0, 3)]).toEqual([0xff, 0xd8, 0xff]);
        expect(image.length).toBeLessThan(400 * 1024);
        expect(readFileSync(join(process.cwd(), 'demo/build.mjs'), 'utf8')).toContain("'docs/images/share.jpg'");
        for (const [file, url] of [['demo/index.html', site], ['demo/setup/index.html', `${site}setup/`]]) {
            const head = readFileSync(join(process.cwd(), file), 'utf8').split('</head>')[0];
            const meta = (name: string) => head.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]*)"`))?.[1];
            // Absolute: a relative path works in a browser and nowhere a link is unfurled
            expect(meta('og:image')).toBe(`${site}share.jpg`);
            expect(meta('og:image:type')).toBe('image/jpeg');
            expect(meta('og:image:width')).toBe('1200');
            expect(meta('og:image:height')).toBe('630');
            expect(meta('og:image:alt')).toMatch(/Live weather, on your dashboard/);
            expect(meta('og:url')).toBe(url);
            expect(meta('og:site_name')).toBe('Animated Weather Card');
            expect(meta('twitter:card')).toBe('summary_large_image');
        }
    });

    it('refuses an icon @mdi/js doesn\'t have, instead of shipping a blank', () => {
        expect(() => resolveIcons(['mdi:not-a-real-icon'])).toThrow(/mdi:not-a-real-icon/);
    });
});

describe('the mark', () => {
    const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');
    const pages = ['demo/index.html', 'demo/setup/index.html'].map(read);

    it('is drawn into both pages\' top bars by the build, with the favicon beside it', () => {
        expect(pages[0]).toContain('<link rel="icon" href="favicon.svg" type="image/svg+xml">');
        expect(pages[1]).toContain('<link rel="icon" href="../favicon.svg" type="image/svg+xml">');
        for (const page of pages) expect(page.match(/%LOGO%/g)).toHaveLength(1);
        const mark = logoSvg({ className: 'logo-mark' });
        for (const phase of LOGO_PHASES) expect(mark).toContain(`data-sky="${phase}"`);
        expect(mark).toContain('class="logo-sun"');
        expect(mark).toContain('class="logo-moon"');
        expect(mark).toContain('aria-hidden="true"');
    });

    it('stands alone as the favicon, by day, with no sky or moon CSS would have to hide', () => {
        const favicon = logoSvg({ only: 'day', id: 'favicon' });
        expect(favicon).toContain('xmlns="http://www.w3.org/2000/svg"');
        // One sky, drawn behind the pane and again through it
        expect(new Set(favicon.match(/data-sky="\w+"/g))).toEqual(new Set(['data-sky="day"']));
        expect(favicon).not.toContain('logo-moon');
        expect(favicon).not.toContain('class=""');
    });

    it('opens on the sky the clock gives, by the demo\'s own hours, in both pages', () => {
        for (const page of pages) {
            const body = page.match(/\(function \(h\) \{ (document\.documentElement\.dataset\.logo = [^;]+;) \}\)/)![1];
            const phaseAt = new Function('h', `const document = { documentElement: { dataset: {} } }; ${body} return document.documentElement.dataset.logo;`);
            for (let quarter = 0; quarter < 96; quarter++) expect(phaseAt(quarter / 4), `${quarter / 4} h`).toBe(phaseForHour(quarter / 4));
        }
    });

    it('has a sky for every time of day the page names, and the CSS to show each', () => {
        expect([...LOGO_PHASES].sort()).toEqual(Object.keys(PHASES).sort());
        const css = read('demo/demo.css');
        for (const phase of LOGO_PHASES) expect(css).toContain(`[data-logo="${phase}"] .logo-mark .logo-sky[data-sky="${phase}"]`);
        expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\.js \.logo-mark \.logo-light,\s*\.js \.logo-mark \.logo-rim \{ animation: none; \}/);
    });
});

describe('the setup guide', () => {
    const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');
    const page = read('demo/setup/index.html');
    const decode = (html: string) => html.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    const yamlBlocks = [...page.matchAll(/<div class="code[^"]*" data-lang="yaml">[\s\S]*?<code>([\s\S]*?)<\/code>/g)].map(m => decode(m[1]));

    it('is built with the demo, and loads no GSAP of its own: the card brings it', () => {
        for (const file of ['setup/index.html', 'setup.css', 'setup.js', 'code.mjs']) expect(PAGE_FILES).toContain(file);
        expect(page).not.toMatch(/<script[^>]*gsap/i);
        expect(page).not.toContain('cdnjs');
        for (const asset of ['../demo.css', '../setup.css', '../animated-weather-card.js', '../animated-weather-card-note.js', '../setup.js']) {
            expect(page).toContain(asset);
        }
    });

    it('writes YAML only with options the cards really have', () => {
        const weather = read('src/types.ts');
        const tracker = read('src/sun-tracker-card.ts');
        // Dashboard and view keys, not card options
        const structural = new Set(['type', 'resources', 'url', 'cards', 'title']);
        expect(yamlBlocks.length).toBeGreaterThan(8);
        for (const block of yamlBlocks) {
            for (const [, key] of block.matchAll(/^\s*(?:- )?([a-z_]+):/gm)) {
                if (structural.has(key)) continue;
                expect(weather.includes(`${key}?:`) || tracker.includes(`config.${key}`), `${key} in the guide's YAML`).toBe(true);
            }
        }
    });

    it('links only to sections it has, and lists each chapter in its contents', () => {
        const ids = new Set([...page.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
        for (const [, target] of page.matchAll(/href="#([^"]+)"/g)) expect(ids, `#${target}`).toContain(target);
        const toc = page.match(/<nav class="toc"[\s\S]*?<\/nav>/)![0];
        const chapters = [...page.matchAll(/<section class="chapter" id="([^"]+)"[^>]*>\s*<h2/g)].map(m => m[1]);
        expect([...toc.matchAll(/href="#([^"]+)"/g)].map(m => m[1])).toEqual(chapters);
    });

    it('lists exactly the files the build makes', () => {
        const bundles = [...read('esbuild.config.js').matchAll(/outfile: '([^']+)'/g)].map(m => m[1]).sort();
        const table = page.match(/<table class="files">[\s\S]*?<\/table>/)![0];
        expect([...table.matchAll(/<td><code>([^<]+)<\/code><\/td>/g)].map(m => m[1]).sort()).toEqual(bundles);
        // The README's install section says the same
        const install = read('README.md').split('## Install')[1].split('## Set up')[0];
        expect(install).toContain(`${['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven'][bundles.length]} files`);
        expect(table.match(/<\/tr>/g)!.length - 1).toBe(bundles.length);
        for (const bundle of bundles) expect(install).toContain(bundle);
    });

    it('opens the card in HACS as a dashboard repository', () => {
        expect(decode(page)).toContain('https://my.home-assistant.io/redirect/hacs_repository/?owner=alexsto1an&repository=ha-ani-weather-card&category=plugin');
    });

    it('is linked from the live demo', () => {
        const home = read('demo/index.html');
        expect(home).toContain('href="./setup/"');
        expect(home).toContain('href="./setup/#quick-start"');
    });

    it('keeps to the voice: no em dashes', () => {
        expect(page).not.toContain('—');
    });
});
