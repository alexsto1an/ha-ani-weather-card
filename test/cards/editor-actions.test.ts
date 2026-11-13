import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';
import '../../src/sun-tracker-card';

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };
type Select = HTMLElement & { value: string; options: Array<{ value: string; label: string }> };
type Form = HTMLElement & { hass?: unknown; data?: Record<string, unknown>; schema?: Array<{ name: string; selector: { ui_action: { default_action: string } } }>; computeLabel?: (s: { name: string }) => string };

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

// Home Assistant's select, as far as the editor uses it
if (!customElements.get('ha-select')) customElements.define('ha-select', class extends HTMLElement {});

describe('the weather editor\'s interactions, before Home Assistant\'s form is there', () => {
    let editor: Editor;
    let config: Record<string, unknown> | undefined;

    afterEach(() => editor?.remove());

    const open = async (extra: object = {}) => {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...extra });
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        document.body.appendChild(editor);
        await flush();
        return (key: string) => editor.querySelector(`[data-action="${key}"]`) as Select;
    };
    const pick = (select: Select, value: string) =>
        select.dispatchEvent(new CustomEvent('selected', { detail: { value } }));

    it('offers each gesture the plain actions, the default first, and the card\'s own forecast', async () => {
        const select = await open();
        for (const key of ['tap_action', 'hold_action', 'double_tap_action']) {
            expect(select(key).options.map(o => o.value)).toEqual(['default', 'more-info', 'navigate', 'url', 'none', 'forecast']);
            expect(select(key).value).toBe('default');
        }
        expect(editor.querySelector('[data-section="interactions"]')).not.toBeNull();
    });

    it('asks where to go for a navigate action, and writes it', async () => {
        const select = await open();
        pick(select('tap_action'), 'navigate');
        expect(config?.tap_action).toEqual({ action: 'navigate' });
        const path = editor.querySelector('#tap_action-navigation_path') as HTMLInputElement;
        path.value = '/lovelace/weather';
        path.dispatchEvent(new Event('input'));
        expect(config?.tap_action).toEqual({ action: 'navigate', navigation_path: '/lovelace/weather' });

        // Back to the default leaves nothing behind
        pick(select('tap_action'), 'default');
        expect(config).not.toHaveProperty('tap_action');
    });

    it('shows the tap the card really does: the forecast with it on, nothing on a nightstand, and writes no YAML for it', async () => {
        let select = await open({ show_forecast: true });
        expect(select('tap_action').value).toBe('forecast');
        pick(select('tap_action'), 'navigate');
        expect(config?.tap_action).toEqual({ action: 'navigate' });
        pick(select('tap_action'), 'forecast');
        expect(config).not.toHaveProperty('tap_action');
        // The picker's own default is the weather's details: with the forecast on, that has to be written out
        pick(select('tap_action'), 'default');
        expect(config?.tap_action).toEqual({ action: 'more-info' });
        editor.remove();

        select = await open({ layout: 'nightstand' });
        expect(select('tap_action').value).toBe('none');
        pick(select('tap_action'), 'more-info');
        expect(config?.tap_action).toEqual({ action: 'more-info' });
        pick(select('tap_action'), 'none');
        expect(config).not.toHaveProperty('tap_action');
    });

    it('follows the forecast switch: turned on, the tap\'s default becomes the forecast', async () => {
        const select = await open();
        expect(select('tap_action').value).toBe('default');
        const toggle = editor.querySelector('#show_forecast') as HTMLInputElement;
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
        expect(select('tap_action').value).toBe('forecast');
        expect(config).not.toHaveProperty('tap_action');
    });

    it('keeps an action set in YAML that it doesn\'t offer', async () => {
        const select = await open({ hold_action: { action: 'perform-action', perform_action: 'script.good_night' } });
        expect(select('hold_action').value).toBe('perform-action');
        expect(select('hold_action').options.at(-1)).toEqual({ value: 'perform-action', label: 'perform-action (set in YAML)' });
    });
});

describe('the interactions in Home Assistant\'s form', () => {
    let editor: Editor;

    afterEach(() => editor?.remove());

    it('uses Home Assistant\'s action picker once its form is defined, with the gestures\' defaults', async () => {
        customElements.define('ha-form', class extends HTMLElement {});
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', hold_action: { action: 'toggle' } });
        document.body.appendChild(editor);
        await flush();

        const form = editor.querySelector('#actions-editor ha-form') as Form;
        expect(form.schema!.map(s => [s.name, s.selector.ui_action.default_action])).toEqual([
            ['tap_action', 'more-info'], ['hold_action', 'none'], ['double_tap_action', 'none'],
        ]);
        expect(form.data).toMatchObject({ entity: 'weather.home', hold_action: { action: 'toggle' } });
        expect(form.computeLabel!({ name: 'double_tap_action' })).toBe('Double tap behavior');

        let config: Record<string, unknown> | undefined;
        let leaked = false;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        document.addEventListener('value-changed', () => { leaked = true; }, { once: true });
        form.dispatchEvent(new CustomEvent('value-changed', {
            bubbles: true, composed: true,
            detail: { value: { entity: 'weather.home', tap_action: { action: 'url', url_path: 'https://example.com' } } },
        }));
        expect(config?.tap_action).toEqual({ action: 'url', url_path: 'https://example.com' });
        expect(config).not.toHaveProperty('hold_action');
        expect(leaked).toBe(false);
    });

    it('gives the sun tracker the same picker, and keeps it while a change comes back', async () => {
        editor = document.createElement('animated-sun-tracker-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-sun-tracker-card', sun_entity: 'sun.sun' });
        document.body.appendChild(editor);
        await flush();

        const form = editor.querySelector('#st-actions ha-form') as Form;
        expect(form.data).toMatchObject({ entity: 'sun.sun' });
        let config: Record<string, unknown> | undefined;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        form.dispatchEvent(new CustomEvent('value-changed', {
            detail: { value: { entity: 'sun.sun', double_tap_action: { action: 'navigate', navigation_path: '/sky' } } },
        }));
        expect(config).toEqual({ type: 'custom:animated-sun-tracker-card', sun_entity: 'sun.sun', double_tap_action: { action: 'navigate', navigation_path: '/sky' } });

        // Home Assistant hands the editor the config it just sent: nothing is drawn again
        editor.setConfig(config!);
        expect(editor.querySelector('#st-actions ha-form')).toBe(form);
    });
});
