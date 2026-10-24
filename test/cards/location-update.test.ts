import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };

const hassNamed = (name: string) => ({
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'partlycloudy',
            attributes: { temperature: 21, humidity: 55, apparent_temperature: 20, friendly_name: name, temperature_unit: '°C' },
        },
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
});

describe('the location line on live updates', () => {
    let card: Card;

    async function mount(config: object): Promise<HTMLElement> {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...config });
        card.hass = hassNamed('Home');
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        return card.querySelector('.animated-weather-card') as HTMLElement;
    }

    afterEach(() => {
        card?.remove();
        vi.useRealTimers();
    });

    it('follows the entity\'s name without a re-render', async () => {
        const sky = await mount({});
        const location = sky.querySelector('.location')!;
        expect(location.textContent).toBe('Home');
        card.hass = hassNamed('Lisbon');
        await vi.advanceTimersByTimeAsync(500);
        // The same element, with the new name: nothing was rebuilt
        expect(sky.querySelector('.location')).toBe(location);
        expect(location.textContent).toBe('Lisbon');
    });

    it('keeps a configured name over the entity\'s', async () => {
        const sky = await mount({ name: 'Garden' });
        card.hass = hassNamed('Lisbon');
        await vi.advanceTimersByTimeAsync(500);
        expect(sky.querySelector('.location')!.textContent).toBe('Garden');
    });

    it('and the compact strip still does', async () => {
        const sky = await mount({ compact: true });
        card.hass = hassNamed('Lisbon');
        await vi.advanceTimersByTimeAsync(500);
        expect(sky.querySelector('.compact-meta')!.textContent).toBe('Lisbon · Feels like 20°');
    });
});
