import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('the editor\'s colours and planes', () => {
    let editor: Editor;
    let config: Record<string, unknown> | undefined;

    afterEach(() => editor?.remove());

    const open = async (extra: object) => {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...extra });
        document.body.appendChild(editor);
        await flush();
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
    };

    it('offers the temperature, text, sun, rain and snow on the theme palette too, and the skies only on the colorized one (#20)', async () => {
        await open({ color_palette: 'theme' });
        const skies = editor.querySelector('#color-grid') as HTMLElement;
        const inks = editor.querySelector('#ink-grid') as HTMLElement;
        expect(skies.style.display).toBe('none');
        expect(inks.style.display).not.toBe('none');
        expect(['temperature_color', 'text_color', 'sun_color', 'rain_color', 'snow_color'].every(id => inks.querySelector(`#${id}`))).toBe(true);
        expect(skies.querySelector('#temperature_color')).toBeNull();
        const temp = editor.querySelector('#temperature_color') as HTMLInputElement;
        temp.value = '#ffffff';
        temp.dispatchEvent(new Event('input'));
        temp.dispatchEvent(new Event('change'));
        expect(config).toMatchObject({ custom_colors: { temperature_color: '#ffffff' } });
    });

    it('turns planes_on_load on and off, writing nothing when off (#19)', async () => {
        await open({ flights_entity: 'sensor.fr24' });
        const toggle = editor.querySelector('#planes_on_load') as HTMLInputElement;
        expect(toggle.hasAttribute('checked')).toBe(false);
        toggle.checked = true;
        toggle.dispatchEvent(new Event('change'));
        expect(config).toMatchObject({ planes_on_load: true });
        toggle.checked = false;
        toggle.dispatchEvent(new Event('change'));
        expect(config).not.toHaveProperty('planes_on_load');
        expect(editor.querySelector('#plane_speed')).not.toBeNull();
    });
});
