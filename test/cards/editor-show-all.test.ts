import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import '../../src/animated-weather-card-editor';

// The forecast card's and the tracker's editors, laid out as the weather card's: the basics, Show all settings (one
// switch for all three editors, kept per browser), and whatever the config has changed, which always shows

if (!customElements.get('ha-select')) customElements.define('ha-select', class extends HTMLElement {});

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };
const STORE = 'animated-weather-card:editor-all';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

let editor: Editor;
let sent: Array<Record<string, unknown>>;

async function open(tag: string, config: object): Promise<Editor> {
    editor = document.createElement(tag) as Editor;
    editor.setConfig(config);
    document.body.appendChild(editor);
    await flush();
    sent = [];
    editor.addEventListener('config-changed', e => sent.push({ ...(e as CustomEvent).detail.config }));
    // Home Assistant hands the editor what it sent, as it does
    editor.addEventListener('config-changed', e => editor.setConfig((e as CustomEvent).detail.config));
    return editor;
}
const $ = <T extends HTMLElement = HTMLInputElement>(selector: string) => editor.querySelector(selector) as T;
/** The rows you can see: open, in an open section */
const openRows = () => [...editor.querySelectorAll<HTMLElement>('[data-sec][data-open] [data-row][data-open]')].map(el => el.dataset.row);
const openSections = () => [...editor.querySelectorAll<HTMLElement>('[data-sec][data-open]')].map(el => el.dataset.sec);
const flip = (selector: string, checked: boolean) => { const el = $(selector); el.checked = checked; el.dispatchEvent(new Event('change')); };
const radio = (key: string, value: string) => { const el = $(`[id="${key}"] input[value="${value}"]`); el.checked = true; el.dispatchEvent(new Event('change')); };

beforeEach(() => localStorage.removeItem(STORE));
afterEach(() => { editor?.remove(); localStorage.removeItem(STORE); });

const FORECAST = { type: 'custom:animated-forecast-card', entity: 'weather.home', sun_entity: 'sun.sun' };
const TRACKER = { type: 'custom:animated-sun-tracker-card', sun_entity: 'sun.sun' };

describe('the forecast card\'s editor', () => {
    it('opens on four basics: the weather, the card or the strip, the colors and what the hours show', async () => {
        await open('animated-forecast-card-editor', FORECAST);
        expect(openRows()).toEqual(['entity', 'layout', 'color_palette', 'forecast_metric']);
        expect(openSections()).toEqual(['forecast']);
        // The rest are drawn, closed, so the switch draws nothing again
        expect($('[data-row="forecast_graph"]').hasAttribute('data-open')).toBe(false);
        expect($('#forecast_graph')).not.toBeNull();
    });

    it('shows every setting with the switch, writing nothing to the card, and hides what the strip has no room for', async () => {
        await open('animated-forecast-card-editor', FORECAST);
        const picker = $('#weather-picker');
        flip('#all_settings', true);
        expect(localStorage.getItem(STORE)).toBe('1');
        expect(sent).toEqual([]);
        expect($('#weather-picker')).toBe(picker);
        expect(openSections()).toEqual(['forecast', 'shows', 'sky', 'interactions', 'dev']);
        expect(openRows()).toEqual(['entity', 'layout', 'color_palette', 'forecast_metric', 'show_summary', 'show_hours', 'forecast_days', 'show_chips', 'forecast_graph',
            'weather_effects', 'sun_entity', 'another_place', 'actions', 'dev_mode']);
        radio('layout', 'strip');
        expect(sent.at(-1)).toMatchObject({ compact: true });
        expect(openRows()).not.toContain('forecast_days');
        expect(openRows()).not.toContain('show_hours');
        expect(openRows()).not.toContain('show_chips');
        expect(openRows()).not.toContain('show_summary');
        expect(openRows()).toContain('forecast_graph');
        radio('layout', 'card');
        expect(sent.at(-1)).not.toHaveProperty('compact');
        flip('#show_hours', false);
        expect(sent.at(-1)).toMatchObject({ show_hours: false });
        // The days show the value too, so its row stays; the hours' own rows go
        expect(openRows()).toContain('forecast_metric');
        expect(openRows()).not.toContain('show_chips');
        expect(openRows()).not.toContain('forecast_graph');
    });

    it('shows what the config has changed with the switch off, and keeps it while it\'s cleared', async () => {
        await open('animated-forecast-card-editor', { ...FORECAST, forecast_graph: 'bars', weather_effects: true, hold_action: { action: 'toggle' } });
        expect(openRows()).toEqual(['entity', 'layout', 'color_palette', 'forecast_metric', 'forecast_graph', 'weather_effects', 'actions']);
        expect(openSections()).toEqual(['forecast', 'shows', 'interactions']);
        flip('#weather_effects', false);
        expect(sent.at(-1)).not.toHaveProperty('weather_effects');
        expect(openRows()).toContain('weather_effects');
        // Its own tap, the forecast, is no change
        editor.remove();
        await open('animated-forecast-card-editor', { ...FORECAST, tap_action: { action: 'forecast' } });
        expect(openRows()).not.toContain('actions');
    });

    it('lets weather effects opt into WebGL', async () => {
        await open('animated-forecast-card-editor', FORECAST);
        flip('#all_settings', true);
        expect(openRows()).not.toContain('use_webgl');
        flip('#weather_effects', true);
        expect(openRows()).toContain('use_webgl');
        flip('#use_webgl', true);
        expect(sent.at(-1)).toMatchObject({ weather_effects: true, use_webgl: true });
        flip('#use_webgl', false);
        expect(sent.at(-1)).not.toHaveProperty('use_webgl');
    });
});

describe('the sun tracker\'s editor', () => {
    it('opens on three basics: the sun, regular or compact, and the colors', async () => {
        await open('animated-sun-tracker-editor', TRACKER);
        expect(openRows()).toEqual(['sun_entity', 'layout', 'color_palette']);
        expect(openSections()).toEqual(['sun']);
    });

    it('shares the switch with the other editors, and writes only what differs from the default', async () => {
        localStorage.setItem(STORE, '1');
        await open('animated-sun-tracker-editor', TRACKER);
        expect(openRows()).toEqual(['sun_entity', 'layout', 'color_palette', 'title', 'show_header', 'show_details', 'daylight_delta', 'moon_entity', 'direction',
            'weather_entity', 'another_place', 'actions', 'dev_mode']);
        flip('#show_details', false);
        expect(sent.at(-1)).toMatchObject({ show_details: false });
        expect(openRows()).not.toContain('moon_entity');
        // The headline still shows the sunrise's or sunset's shift
        expect(openRows()).toContain('daylight_delta');
        flip('#show_details', true);
        expect(sent.at(-1)).not.toHaveProperty('show_details');
        radio('layout', 'compact');
        expect(sent.at(-1)).toMatchObject({ compact: true });
        expect(openRows()).not.toContain('title');
        // Switched off here, it's off in the weather card's editor too
        flip('#all_settings', false);
        expect(localStorage.getItem(STORE)).toBe('0');
        editor.remove();
        await open('animated-weather-card-editor', { type: 'custom:animated-weather-card', entity: 'weather.home' });
        expect($('#all_settings').hasAttribute('checked')).toBe(false);
    });

    it('shows a header or details turned off, another place and a title with the switch off; a default written out stays hidden', async () => {
        await open('animated-sun-tracker-editor', { ...TRACKER, show_header: false, title: 'The sun', latitude: -33.87, longitude: 151.21 });
        expect(openRows()).toEqual(['sun_entity', 'layout', 'color_palette', 'title', 'show_header', 'another_place', 'place_fields']);
        editor.remove();
        await open('animated-sun-tracker-editor', { ...TRACKER, show_header: true, show_details: true, daylight_delta: 'day', direction: 'auto', tap_action: { action: 'more-info' } });
        expect(openRows()).toEqual(['sun_entity', 'layout', 'color_palette']);
        editor.remove();
        // A change set to last week is set: it shows with the switch off
        await open('animated-sun-tracker-editor', { ...TRACKER, daylight_delta: 'week' });
        expect(openRows()).toEqual(['sun_entity', 'layout', 'color_palette', 'daylight_delta']);
    });
});
