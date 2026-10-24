import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };
type Picker = HTMLElement & { value: string; includeDomains?: string[] };

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

describe('the editor\'s wind sensors', () => {
    let editor: Editor;

    afterEach(() => editor?.remove());

    it('picks a wind speed and a wind direction sensor, after humidity', async () => {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', wind_speed_sensor_entity: 'sensor.anemometer' });
        document.body.appendChild(editor);
        await flush();
        editor.hass = { states: {}, config: { components: [] }, callWS: async () => null };
        await flush();

        const ids = [...editor.querySelectorAll('ha-entity-picker')].map(picker => picker.id);
        expect(ids.indexOf('wind_speed_sensor_entity')).toBe(ids.indexOf('humidity_sensor_entity') + 1);
        expect(ids.indexOf('wind_direction_sensor_entity')).toBe(ids.indexOf('humidity_sensor_entity') + 2);

        const speed = editor.querySelector('#wind_speed_sensor_entity') as Picker;
        const direction = editor.querySelector('#wind_direction_sensor_entity') as Picker;
        expect(speed.getAttribute('value')).toBe('sensor.anemometer');
        expect(speed.includeDomains).toEqual(['sensor']);
        expect(direction.includeDomains).toEqual(['sensor']);

        let config: Record<string, unknown> | undefined;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        direction.value = 'sensor.wind_vane';
        direction.dispatchEvent(new Event('value-changed'));
        expect(config).toMatchObject({ wind_speed_sensor_entity: 'sensor.anemometer', wind_direction_sensor_entity: 'sensor.wind_vane' });
        speed.value = '';
        speed.dispatchEvent(new Event('value-changed'));
        expect(config).not.toHaveProperty('wind_speed_sensor_entity');
    });
});
