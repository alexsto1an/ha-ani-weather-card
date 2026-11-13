import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';

// Home Assistant's ha-select, as the editors use it: options and value as properties
if (!customElements.get('ha-select')) customElements.define('ha-select', class extends HTMLElement {});

type Editor = HTMLElement & { setConfig(config: object): void };
type Select = HTMLElement & { options: Array<{ value: string; label: string }>; value: string };
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('the hours\' graph in both editors (forecast_graph)', () => {
    let editor: Editor;
    afterEach(() => editor?.remove());

    for (const [tag, type, extra] of [['animated-weather-card-editor', 'custom:animated-weather-card', { show_forecast: true }], ['animated-forecast-card-editor', 'custom:animated-forecast-card', {}]] as const) {
        it(`${tag}: a line, a line with a fill, bars or none, writing only a change from the line`, async () => {
            editor = document.createElement(tag) as Editor;
            editor.setConfig({ type, entity: 'weather.home', ...extra });
            document.body.appendChild(editor);
            await flush();
            const select = editor.querySelector('#forecast_graph') as Select;
            expect(select.options.map(o => o.value)).toEqual(['line', 'area', 'bars', 'none']);
            expect(select.value).toBe('line');
            let config: Record<string, unknown> | undefined;
            editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
            select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'bars' } }));
            expect(config).toMatchObject({ forecast_graph: 'bars' });
            select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'line' } }));
            expect(config).not.toHaveProperty('forecast_graph');
        });
    }
});

describe('the big value and the date in the weather card\'s editor (hero, show_date)', () => {
    let editor: Editor;
    afterEach(() => editor?.remove());

    it('picks the temperature or the time, writing only the time; the small clock dims while the time is the hero', async () => {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home' });
        document.body.appendChild(editor);
        await flush();
        const select = editor.querySelector('#hero') as Select;
        expect(select.options.map(o => o.value)).toEqual(['temperature', 'clock']);
        expect(select.value).toBe('temperature');
        let config: Record<string, unknown> | undefined;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        const small = (editor.querySelector('#show_clock') as HTMLElement).closest('.option') as HTMLElement;
        expect(small.style.opacity).toBe('');
        select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'clock' } }));
        expect(config).toMatchObject({ hero: 'clock' });
        expect(small.style.opacity).toBe('0.5');
        select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'temperature' } }));
        expect(config).not.toHaveProperty('hero');

        const date = editor.querySelector('#show_date') as HTMLInputElement;
        date.checked = true;
        date.dispatchEvent(new Event('change'));
        expect(config).toMatchObject({ show_date: true });
        date.checked = false;
        date.dispatchEvent(new Event('change'));
        expect(config).not.toHaveProperty('show_date');
    });

    it('hides them on a nightstand, where the time is always the hero and the date its own', async () => {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', layout: 'nightstand' });
        document.body.appendChild(editor);
        await flush();
        for (const id of ['#hero', '#show_clock', '#show_date']) expect((editor.querySelector(id)!.closest('.option') as HTMLElement).hidden, id).toBe(true);
    });
});
