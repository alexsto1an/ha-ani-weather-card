import { describe, it, expect, afterEach, beforeEach } from 'vitest';
import '../../src/animated-weather-card-editor';

// The weather card's editor: the basics, Show all settings, and the settings you've changed, which always show

if (!customElements.get('ha-select')) customElements.define('ha-select', class extends HTMLElement {});

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };
type Select = HTMLElement & { options: Array<{ value: string; label: string }>; value: string };
const STORE = 'animated-weather-card:editor-all';
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

let editor: Editor;
let sent: Array<Record<string, unknown>>;

async function open(config: object): Promise<Editor> {
    editor = document.createElement('animated-weather-card-editor') as Editor;
    editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...config });
    document.body.appendChild(editor);
    await flush();
    sent = [];
    editor.addEventListener('config-changed', e => sent.push({ ...(e as CustomEvent).detail.config }));
    // Home Assistant hands the editor what it sent, as it does
    editor.addEventListener('config-changed', e => editor.setConfig((e as CustomEvent).detail.config));
    return editor;
}
const $ = <T extends HTMLElement = HTMLInputElement>(selector: string) => editor.querySelector(selector) as T;
const shown = (id: string) => $(`[data-row="${id}"]`).hasAttribute('data-open');
/** The rows you can see: open, in an open section */
const openRows = () => [...editor.querySelectorAll<HTMLElement>('[data-sec][data-open] [data-row][data-open]')].map(el => el.dataset.row);
const openSections = () => [...editor.querySelectorAll<HTMLElement>('[data-sec][data-open]')].map(el => el.dataset.sec);
const flip = (selector: string, checked: boolean) => { const el = $(selector); el.checked = checked; el.dispatchEvent(new Event('change')); };
const radio = (key: string, value: string) => { const el = $(`[id="${key}"] input[value="${value}"]`); el.checked = true; el.dispatchEvent(new Event('change')); };
const choose = (id: string, value: string) => $(`#${id}`).dispatchEvent(new CustomEvent('selected', { detail: { value } }));
const last = () => sent.at(-1)!;

beforeEach(() => localStorage.removeItem(STORE));
afterEach(() => { editor?.remove(); localStorage.removeItem(STORE); });

describe('the editor\'s basics', () => {
    it('show a new card six controls in five sections, and none of the drawers', async () => {
        await open({ sun_entity: 'sun.sun' });
        expect(openRows()).toEqual(['preset', 'entity', 'name', 'color_palette', 'show_forecast', 'note']);
        expect(openSections()).toEqual(['start', 'weather', 'look', 'forecast', 'note']);
        expect($('[data-drawers]').hasAttribute('data-open')).toBe(false);
        expect($('#all_settings').hasAttribute('checked')).toBe(false);
        // Nothing is dimmed, and the nightstand's fields aren't on a regular card
        expect(editor.querySelector('[style*="opacity"], [style*="pointer-events"]')).toBeNull();
        expect(shown('alarm_entity')).toBe(false);
    });

    it('turn into every setting with the switch, which is kept per browser, never written to the card, and draws nothing again', async () => {
        await open({});
        const entity = $('#entity');
        flip('#all_settings', true);
        expect(localStorage.getItem(STORE)).toBe('1');
        expect(sent).toEqual([]);
        expect($('#entity')).toBe(entity);
        expect($('.card-config').hasAttribute('data-all')).toBe(true);
        expect(openSections()).toEqual(['start', 'weather', 'look', 'forecast', 'note', 'readings', 'sky', 'colors', 'planes', 'interactions', 'dev']);
        for (const id of ['layout', 'outdoor_sensor_entity', 'show_location', 'temperature_decimals', 'time_date', 'hero', 'animate', 'flights_entity', 'actions', 'dev_mode']) expect(shown(id), id).toBe(true);
        // The forecast's own rows wait for the forecast
        expect(shown('forecast_graph')).toBe(false);
        flip('#show_forecast', true);
        expect(shown('forecast_graph')).toBe(true);
        expect($('[data-live]').textContent).toContain('All settings shown');
        editor.remove();
        // The next editor opens as this one was left
        await open({});
        expect($('#all_settings').hasAttribute('checked')).toBe(true);
        expect(shown('outdoor_sensor_entity')).toBe(true);
    });

    it('puts the WebGL switch under the advanced sky and motion settings', async () => {
        await open({});
        expect(openSections()).not.toContain('sky');
        expect(shown('use_webgl')).toBe(false);
        flip('#all_settings', true);
        $('[data-drawer="sky"]').click();
        expect($('[data-sec="sky"] .drw-c').hasAttribute('data-open')).toBe(true);
        expect($('[data-sec="sky"] [data-row="use_webgl"]').hasAttribute('data-open')).toBe(true);
        flip('#use_webgl', true);
        expect(last()).toHaveProperty('use_webgl', true);
        flip('#use_webgl', false);
        expect(last()).not.toHaveProperty('use_webgl');
    });

    it('show any setting the card has changed, in its place, and keep it shown when it\'s cleared', async () => {
        await open({ outdoor_sensor_entity: 'sensor.garden', animate: true, show_location: true, auto_pause: false });
        // Defaults the old editor wrote out don't count
        expect(shown('outdoor_sensor_entity')).toBe(true);
        expect(shown('animate')).toBe(false);
        expect(shown('show_location')).toBe(false);
        expect(openSections()).toEqual(['start', 'weather', 'look', 'forecast', 'note']);
        const picker = $('#outdoor_sensor_entity');
        picker.value = '';
        picker.dispatchEvent(new Event('value-changed'));
        expect(last()).not.toHaveProperty('outdoor_sensor_entity');
        expect(shown('outdoor_sensor_entity')).toBe(true);
    });

    it('show a card made with the old options its readings, under a drawer that says what they are', async () => {
        await open({ metrics: ['humidity', 'wind', 'uv'], humidity_sensor_entity: 'sensor.garden_humidity', uv_entity: 'sensor.uv', rain_week_entity: 'sensor.rain_week' });
        expect(shown('readings')).toBe(true);
        expect(shown('show_attributes')).toBe(false);
        expect(openSections()).toContain('readings');
        expect($('[data-summary="readings"]').textContent).toBe('Humidity, Wind, UV index · 1 in the forecast view');
        expect(editor.querySelectorAll('.rd-row')).toHaveLength(4);
    });
});

describe('the editor\'s merged controls', () => {
    beforeEach(() => localStorage.setItem(STORE, '1'));

    it('write the layout as the card reads it, and show a nightstand set with compact as the nightstand', async () => {
        await open({});
        radio('layout', 'compact');
        expect(last()).toMatchObject({ compact: true });
        radio('layout', 'nightstand');
        expect(last()).toMatchObject({ layout: 'nightstand' });
        expect(last()).not.toHaveProperty('compact');
        expect(shown('alarm_entity')).toBe(true);
        radio('layout', 'default');
        expect(last()).not.toHaveProperty('layout');
        expect(last()).not.toHaveProperty('compact');
        editor.remove();
        await open({ compact: true, layout: 'nightstand' });
        expect(($('#layout input:checked') as HTMLInputElement).value).toBe('nightstand');
    });

    it('keep the key beside the one they turn off: the days\' count, the indoor style, what the tags say', async () => {
        await open({ show_forecast: true, show_days: true, forecast_days: 5, indoor_temperature_entity: 'sensor.in', indoor_style: 'icon', flights_entity: 'sensor.fr24', flight_label: 'route' });
        expect(($('#forecast_days') as Select).value).toBe('5');
        choose('forecast_days', 'none');
        expect(last()).toMatchObject({ forecast_days: 5 });
        expect(last()).not.toHaveProperty('show_days');
        choose('forecast_days', '7');
        expect(last()).toMatchObject({ show_days: true });
        expect(last()).not.toHaveProperty('forecast_days');
        choose('indoor_line', 'hidden');
        expect(last()).toMatchObject({ show_indoor: false, indoor_style: 'icon' });
        choose('indoor_line', 'label');
        expect(last()).not.toHaveProperty('show_indoor');
        expect(last()).not.toHaveProperty('indoor_style');
        choose('plane_tags', 'none');
        expect(last()).toMatchObject({ show_flight_labels: false, flight_label: 'route' });
        choose('reading_style', 'value');
        expect(last()).toMatchObject({ show_attribute_labels: false, show_attribute_icons: false });
        choose('reading_style', 'both');
        expect(last()).not.toHaveProperty('show_attribute_labels');
    });

    it('word every switch so on means on, and write nothing for a default', async () => {
        await open({});
        flip('#lightning_shake', false);
        expect(last()).toMatchObject({ disable_lightning_shake: true });
        flip('#lightning_shake', true);
        expect(last()).not.toHaveProperty('disable_lightning_shake');
        flip('#animate', false);
        expect(last()).toMatchObject({ animate: false });
        // The weather's still: what moves it goes
        expect(shown('spill_particles')).toBe(false);
        flip('#animate', true);
        expect(last()).not.toHaveProperty('animate');
        radio('sky_follows', 'hours');
        expect(last()).toMatchObject({ enable_day_night_cycle: true });
        expect(shown('day_hours')).toBe(true);
        radio('color_palette', 'theme');
        expect(last()).toMatchObject({ color_palette: 'theme' });
        radio('color_palette', 'default');
        expect(last()).not.toHaveProperty('color_palette');
    });

    it('take another place\'s fields off with its switch, and bring back what was typed', async () => {
        await open({ latitude: -33.87, longitude: 151.21, time_zone: 'Australia/Sydney' });
        expect(shown('place_fields')).toBe(true);
        flip('#another_place', false);
        for (const k of ['latitude', 'longitude', 'time_zone']) expect(last()).not.toHaveProperty(k);
        expect(shown('place_fields')).toBe(false);
        flip('#another_place', true);
        expect(last()).toMatchObject({ latitude: -33.87, longitude: 151.21, time_zone: 'Australia/Sydney' });
    });
});

describe('the editor\'s presets', () => {
    const tiles = () => [...editor.querySelectorAll<HTMLInputElement>('#preset input[type="radio"]')];
    const picked = () => tiles().find(t => t.checked)?.value ?? null;
    const pick = (id: string) => { const t = $(`#preset input[value="${id}"]`); t.checked = true; t.dispatchEvent(new Event('change')); };

    it('offer seven to start from, each drawn, in one group, the one the card matches picked', async () => {
        await open({ sun_entity: 'sun.sun' });
        expect(tiles().map(t => t.value)).toEqual(['standard', 'simple', 'forecast', 'full', 'strip', 'bedside', 'wall']);
        expect(new Set(tiles().map(t => t.name)).size).toBe(1);
        expect(editor.querySelectorAll('#preset .pre-art')).toHaveLength(7);
        expect(picked()).toBe('standard');
        expect($('[data-help="preset"]').textContent).toBe('The sky, the temperature and four readings');
        editor.remove();
        await open({ show_forecast: true, hero: 'clock' });
        expect(picked()).toBeNull();
        expect($('[data-help="preset"]').textContent).toMatch(/^Your own mix/);
    });

    it('write a preset over the options it owns, keep the rest, and draw the editor again with the focus on it', async () => {
        await open({ name: 'Garden', compact: true, hero: 'clock', color_palette: 'theme', show_note: true });
        pick('full');
        expect(last()).toEqual({
            type: 'custom:animated-weather-card', entity: 'weather.home', name: 'Garden', color_palette: 'theme', show_note: true,
            show_forecast: true, show_days: true, show_clock: true, show_date: true,
        });
        expect(picked()).toBe('full');
        expect(document.activeElement).toBe($('#preset input[value="full"]'));
        // The controls the preset reaches say so: the forecast's switch, its days
        expect($('#show_forecast').hasAttribute('checked')).toBe(true);
        expect(shown('forecast_days')).toBe(true);
        // Back to Standard: its options go, and so do their rows, as on a new card
        pick('standard');
        for (const key of ['show_forecast', 'show_days', 'show_clock', 'show_date', 'compact', 'hero']) expect(last(), key).not.toHaveProperty(key);
        expect(shown('forecast_days')).toBe(false);
        expect(shown('layout')).toBe(false);
    });

    it('size the Wall and say what it needs, and follow the card when another control changes it', async () => {
        await open({});
        expect($('[data-wall]').hasAttribute('hidden')).toBe(true);
        pick('wall');
        expect(last()).toMatchObject({ show_forecast: true, show_clock: true, show_date: true, grid_options: { columns: 'full', rows: 10 } });
        expect($('[data-wall]').hasAttribute('hidden')).toBe(false);
        expect($('[data-wall]').textContent).toContain('Double width');
        // A strip from the Layout choice is the Strip
        pick('standard');
        flip('#all_settings', true);
        radio('layout', 'compact');
        expect(picked()).toBe('strip');
    });
});

describe('the editor\'s resets and drawers', () => {
    beforeEach(() => localStorage.setItem(STORE, '1'));

    it('reset the amounts in place, with the drawer still open, leaving no engine_settings behind', async () => {
        await open({ engine_settings: { rainCount: 2.5 } });
        $('[data-drawer="sky"]').click();
        const drawer = $('[data-sec="sky"] .drw-c');
        expect(drawer.hasAttribute('data-open')).toBe(true);
        const reset = $('.reset-engine-btn');
        expect(reset.hasAttribute('data-off')).toBe(false);
        expect($('[data-summary="sky"]').textContent).toBe('Moving · 1 amount changed');
        reset.click();
        expect(last()).not.toHaveProperty('engine_settings');
        expect($('[data-sec="sky"] .drw-c')).toBe(drawer);
        expect(drawer.hasAttribute('data-open')).toBe(true);
        expect($('#rainCount').value).toBe('1');
        expect($('[data-out="rainCount"]').textContent).toBe('1.0×');
        expect(reset.hasAttribute('data-off')).toBe(true);
        // A slider set back to its default writes nothing either
        const rain = $('#rainCount');
        rain.value = '2';
        rain.dispatchEvent(new Event('change'));
        expect(last()).toMatchObject({ engine_settings: { rainCount: 2 } });
        rain.value = '1';
        rain.dispatchEvent(new Event('change'));
        expect(last()).not.toHaveProperty('engine_settings');
    });

    it('let the amounts follow the weather by default, the sliders showing only when they don\'t', async () => {
        await open({});
        expect($('#engine_auto').hasAttribute('checked')).toBe(true);
        expect(shown('engine_mode')).toBe(true);
        expect(shown('amounts')).toBe(false);
        expect($('[data-summary="sky"]').textContent).toBe('Moving · amounts follow the weather');
        flip('#engine_auto', false);
        expect(last()).toMatchObject({ engine_mode: 'manual' });
        expect(shown('amounts')).toBe(true);
        expect($('[data-summary="sky"]').textContent).toBe('Moving · amounts set by hand');
        flip('#engine_auto', true);
        expect(last()).not.toHaveProperty('engine_mode');
        expect(shown('amounts')).toBe(false);
    });

    it('keep a tuned card on its sliders, as the card does, and keep the tuning when it turns to the weather', async () => {
        await open({ engine_settings: { rainCount: 2.5 } });
        expect($('#engine_auto').hasAttribute('checked')).toBe(false);
        expect(shown('amounts')).toBe(true);
        flip('#engine_auto', true);
        expect(last()).toMatchObject({ engine_mode: 'auto', engine_settings: { rainCount: 2.5 } });
        expect(shown('amounts')).toBe(false);
        flip('#engine_auto', false);
        expect(last()).toMatchObject({ engine_mode: 'manual', engine_settings: { rainCount: 2.5 } });
        expect(shown('amounts')).toBe(true);
    });

    it('keep a card on its sliders when the last goes back to its default, or the amounts are reset', async () => {
        await open({ engine_settings: { rainCount: 2.5 } });
        const rain = $('#rainCount');
        rain.value = '1';
        rain.dispatchEvent(new Event('change'));
        expect(last()).toMatchObject({ engine_mode: 'manual' });
        expect(last()).not.toHaveProperty('engine_settings');
        expect(shown('amounts')).toBe(true);
        editor.remove();
        await open({ engine_settings: { snowCount: 2 } });
        $('.reset-engine-btn').click();
        expect(last()).toMatchObject({ engine_mode: 'manual' });
        expect(shown('amounts')).toBe(true);
    });

    it('keep the open drawers and the mode when a YAML edit draws the editor again, without playing a reveal', async () => {
        await open({});
        $('[data-drawer="planes"]').click();
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', flights_entity: 'sensor.fr24' });
        expect($('.card-config').hasAttribute('data-instant')).toBe(true);
        expect($('[data-sec="planes"] .drw-c').hasAttribute('data-open')).toBe(true);
        expect($('[data-drawer="planes"]').getAttribute('aria-expanded')).toBe('true');
        expect(shown('plane_tags')).toBe(true);
        expect($('[data-summary="planes"]').textContent).toBe('sensor.fr24');
    });

    it('name each drawer\'s header a button inside a heading, tied to what it opens', async () => {
        await open({});
        const btn = $('[data-drawer="readings"]');
        expect(btn.parentElement!.localName).toBe('h3');
        expect(btn.getAttribute('aria-expanded')).toBe('false');
        expect(editor.querySelector(`#${btn.getAttribute('aria-controls')}`)).toBe($('[data-sec="readings"] .drw-c'));
        btn.click();
        expect(btn.getAttribute('aria-expanded')).toBe('true');
    });
});
