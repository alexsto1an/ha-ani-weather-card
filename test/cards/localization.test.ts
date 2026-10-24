import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';

const at = (h: number, m: number, dayOffset = 0) => new Date(2026, 9, 13 + dayOffset, h, m).toISOString();

const hass = (sunUp: boolean, language = 'en', timeFormat = '12') => ({
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'sunny',
            attributes: { temperature: 20, humidity: 50, apparent_temperature: 18, temperature_unit: '°C' },
        },
        'sensor.indoor': { entity_id: 'sensor.indoor', state: '22', attributes: { unit_of_measurement: '°C' } },
        'sun.sun': {
            entity_id: 'sun.sun', state: sunUp ? 'above_horizon' : 'below_horizon',
            attributes: { elevation: sunUp ? 30 : -20, next_setting: at(19, 12), next_rising: at(6, 41, 1) },
        },
    },
    config: { time_zone: 'UTC' },
    language,
    locale: { language, time_format: timeFormat },
    localize: () => '',
});

describe('localized weather card', () => {
    let card: HTMLElement & { setConfig(config: object): void; hass: unknown };

    async function mount(h: ReturnType<typeof hass>, extra: object = {}) {
        card = document.createElement('animated-weather-card') as typeof card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', sun_entity: 'sun.sun', indoor_temperature_entity: 'sensor.indoor', ...extra });
        card.hass = h;
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
    }

    beforeEach(() => vi.useFakeTimers());
    afterEach(() => {
        card?.remove();
        vi.useRealTimers();
    });

    const sunMetric = () => card.querySelector('.attribute[data-kind="sun"]') as HTMLElement;

    it('shows the sunset time with a small PM', async () => {
        await mount(hass(true));
        expect(sunMetric().querySelector('.attribute-label > span')!.textContent).toBe('Sunset');
        expect(sunMetric().querySelector('.attribute-text')!.innerHTML).toMatch(/^7:12<span class="awc-ampm">PM<\/span>$/);
    });

    it('switches the label and icon to sunrise once the sun sets', async () => {
        await mount(hass(true));
        card.hass = hass(false);
        expect(sunMetric().querySelector('.attribute-label > span')!.textContent).toBe('Sunrise');
        expect(sunMetric().querySelector('.attribute-icon')!.getAttribute('icon')).toBe('mdi:weather-sunset-up');
        expect(sunMetric().querySelector('.attribute-text')!.textContent).toMatch(/^6:41\s?AM$/);
    });

    it('speaks the dashboard language and its 24-hour clock', async () => {
        await mount(hass(true, 'de', 'language'));
        expect(sunMetric().querySelector('.attribute-label > span')!.textContent).toBe('Sonnenuntergang');
        expect(sunMetric().querySelector('.attribute-text')!.textContent).toBe('19:12');
        expect(card.querySelector('.feels-like')!.textContent).toMatch(/^Gefühlt /);
        expect(card.querySelector('.indoor-label')!.textContent).toBe('Innen');
    });

    const indoor = () => card.querySelector('.indoor-climate-inline')!;

    it('introduces the indoor reading with the word by default', async () => {
        await mount(hass(true));
        expect(indoor().querySelector('.indoor-label')!.textContent).toBe('Indoors');
        expect(indoor().querySelector('ha-icon')).toBeNull();
        expect(indoor().textContent).toMatch(/^Indoors22°C?/);
    });

    it('can use an icon instead, keeping the word for screen readers', async () => {
        await mount(hass(true), { indoor_style: 'icon' });
        expect(indoor().querySelector('ha-icon')!.getAttribute('icon')).toBe('mdi:home-thermometer-outline');
        expect(indoor().querySelector('.indoor-label')).toBeNull();
        expect(indoor().querySelector('.awc-visually-hidden')!.textContent!.trim()).toBe('Indoors');
    });

    it('can use both, icon first', async () => {
        await mount(hass(true, 'de', 'language'), { indoor_style: 'both' });
        const [first, second] = Array.from(indoor().children);
        expect(first.tagName).toBe('HA-ICON');
        expect(second.className).toBe('indoor-label');
        expect(second.textContent).toBe('Innen');
    });
});
