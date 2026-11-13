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
