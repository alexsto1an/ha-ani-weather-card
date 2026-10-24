import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };

/** A weather entity with its own wind, and an anemometer and a wind vane of your own */
const hass = (speed: string, direction: string) => ({
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'cloudy',
            attributes: { temperature: 15, humidity: 69, wind_speed: 16, wind_bearing: 90, pressure: 1008, temperature_unit: '°C', wind_speed_unit: 'km/h' },
        },
        'sensor.anemometer': { entity_id: 'sensor.anemometer', state: speed, attributes: { unit_of_measurement: 'km/h' } },
        'sensor.wind_vane': { entity_id: 'sensor.wind_vane', state: direction, attributes: { unit_of_measurement: '°' } },
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
});

describe('wind sensors on the card', () => {
    let card: Card;

    beforeEach(async () => {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({
            type: 'custom:animated-weather-card', entity: 'weather.home',
            wind_speed_sensor_entity: 'sensor.anemometer', wind_direction_sensor_entity: 'sensor.wind_vane',
        });
        card.hass = hass('30', '180');
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
    });

    afterEach(() => {
        card.remove();
        vi.useRealTimers();
    });

    const value = () => card.querySelector('.attribute[data-kind="wind"] .attribute-value')?.textContent ?? '';
    const arrow = () => card.querySelector('.attribute[data-kind="wind"] .wind-bearing-arrow') as HTMLElement | null;

    it('shows your sensors\' reading in place of the weather entity\'s', () => {
        expect(value()).toContain('30 km/h');
        expect(arrow()!.getAttribute('aria-label')).toBe('Wind from 180°');
    });

    it('follows a new reading, and hands its speed to the weather without restarting it', async () => {
        const controller = (card as unknown as { animationController: { setWindSpeed(speed: number): void } }).animationController;
        const setWindSpeed = vi.spyOn(controller, 'setWindSpeed');
        card.hass = hass('55', '270');
        await vi.advanceTimersByTimeAsync(500);
        expect(value()).toContain('55 km/h');
        expect(arrow()!.getAttribute('aria-label')).toBe('Wind from 270°');
        expect(setWindSpeed).toHaveBeenLastCalledWith(55);
    });
});
