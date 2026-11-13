import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';

// Home Assistant's ha-select, as the editor uses it: options and value as properties
if (!customElements.get('ha-select')) customElements.define('ha-select', class extends HTMLElement {});

type Editor = HTMLElement & { setConfig(config: object): void };
type Select = HTMLElement & { options: Array<{ value: string; label: string }>; value: string };
const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('the sun tracker editor\'s direction (#13)', () => {
    let editor: Editor;
    afterEach(() => editor?.remove());

    const open = async (extra: object = {}) => {
        editor = document.createElement('animated-sun-tracker-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-sun-tracker-card', sun_entity: 'sun.sun', ...extra });
        document.body.appendChild(editor);
        await flush();
        return editor.querySelector('#direction') as Select;
    };

    it('offers from your location, left to right and right to left, and writes only an override', async () => {
        const select = await open();
        expect(select.getAttribute('label')).toBe('Direction');
        expect(select.options.map(o => o.value)).toEqual(['auto', 'left_to_right', 'right_to_left']);
        expect(select.value).toBe('auto');
        let config: Record<string, unknown> | undefined;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'right_to_left' } }));
        expect(config).toMatchObject({ direction: 'right_to_left' });
        select.dispatchEvent(new CustomEvent('selected', { detail: { value: 'auto' } }));
        expect(config).not.toHaveProperty('direction');
    });

    it('shows the override it was given', async () => {
        expect((await open({ direction: 'left_to_right' })).value).toBe('left_to_right');
    });
});
