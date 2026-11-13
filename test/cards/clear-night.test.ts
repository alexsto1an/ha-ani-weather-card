import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/sun-tracker-card';
import { skyColors } from '../../src/sky';

// A winter evening: the sun went down at 17:20 and it's 19:55, before the
// clock's default sunset hour (20). Home Assistant already says clear-night.
const EVENING = Date.UTC(2026, 10, 6, 19, 55);

const sun = (elevation: number) => ({
    entity_id: 'sun.sun',
    state: elevation >= 0 ? 'above_horizon' : 'below_horizon',
    attributes: {
        elevation, rising: false,
        next_rising: '2026-11-07T07:10:00Z', next_setting: '2026-11-07T17:20:00Z',
        next_dawn: '2026-11-07T06:42:00Z', next_dusk: '2026-11-07T17:48:00Z',
        next_noon: '2026-11-07T12:15:00Z',
    },
});

const hass = (state: string, elevation: number) => ({
    states: {
        'weather.home': { entity_id: 'weather.home', state, attributes: { temperature: 9, temperature_unit: '°C' } },
        'sun.sun': sun(elevation),
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
});

describe('a clear night before the clock says so', () => {
    type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };
    let card: Card;
    const sky = () => card.querySelector('.animated-weather-card') as HTMLElement;

    beforeEach(() => {
        vi.useFakeTimers({ now: EVENING });
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', sun_entity: 'sun.sun' });
    });

    afterEach(() => {
        card.remove();
        vi.useRealTimers();
    });

    it('opens on the moon and stars', async () => {
        card.hass = hass('clear-night', -25);
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
        expect(sky().classList.contains('clear-night')).toBe(true);
        expect(sky().classList.contains('sunny')).toBe(false);
    });

    it('turns to the moon and stars when the state does, with updates still arriving', async () => {
        card.hass = hass('sunny', -2);
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
        expect(sky().classList.contains('sunny')).toBe(true);

        card.hass = hass('clear-night', -6.5);
        await vi.advanceTimersByTimeAsync(300);
        card.hass = hass('clear-night', -6.8);
        await vi.advanceTimersByTimeAsync(2000);
        expect(sky().classList.contains('clear-night')).toBe(true);
        expect(sky().dataset.phase).toBe('night');
    });

    it('follows the clock instead with the day/night cycle on', async () => {
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', enable_day_night_cycle: true, sunset_hour: 21 });
        card.hass = hass('clear-night', -25);
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
        expect(sky().classList.contains('sunny')).toBe(true);
    });
});

describe("the sun tracker's shared sky on a clear night", () => {
    beforeEach(() => vi.useFakeTimers({ now: EVENING }));
    afterEach(() => vi.useRealTimers());

    it('is the clear night, before the clock says so', () => {
        const tracker = document.createElement('animated-sun-tracker-card') as HTMLElement & { setConfig(c: object): void; hass: unknown };
        tracker.setConfig({ sun_entity: 'sun.sun', weather_entity: 'weather.home', compact: true });
        document.body.appendChild(tracker);
        tracker.hass = hass('clear-night', -25);
        const stCard = tracker.shadowRoot!.querySelector('.st-card') as HTMLElement;
        expect(stCard.style.getPropertyValue('--awc-sky-top')).toBe(skyColors('clear-night', 'night').top);
        expect(skyColors('clear-night', 'night').top).not.toBe(skyColors('sunny', 'night').top);
        tracker.remove();
    });
});
