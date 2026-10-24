import { describe, it, expect } from 'vitest';
import { processWeatherData, conditionName, readNote, noteExpiresAt, NOTE_MAX_AGE_MINUTES, windBearingOf } from '../../src/weather-data';
import type { HomeAssistant, AnimatedWeatherCardConfig } from '../../src/types';

/**
 * Build a minimal HA shape with one entity. Tests pass the entity's
 * attributes/state and we wrap them up.
 */
function makeHass(entityId: string, state: string, attributes: Record<string, unknown> = {}): HomeAssistant {
    return {
        states: {
            [entityId]: { entity_id: entityId, state, attributes },
        },
        language: 'en-US',
    } as unknown as HomeAssistant;
}

const baseConfig: AnimatedWeatherCardConfig = { entity: 'weather.home' };

describe('processWeatherData — no-hass branch', () => {
    it('returns "--" strings instead of null for indoor fields', () => {
        // Previously this branch returned `null` for indoorTemperature /
        // indoorHumidity, which broke downstream `!== "--"` checks and
        // rendered the literal "null" in the indoor block.
        const data = processWeatherData(undefined, baseConfig);
        expect(data.indoorTemperature).toBe('--');
        expect(data.indoorHumidity).toBe('--');
        expect(data.windSpeed).toBe('--');
        expect(data.humidity).toBe('--');
    });

    it('returns empty weatherCondition (not a fake "sunny")', () => {
        const data = processWeatherData(undefined, baseConfig);
        expect(data.weatherCondition).toBe('');
    });
});

describe('processWeatherData — wind speed unit conversion', () => {
    it('keeps km/h as-is for animations', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 20, wind_speed: 24, wind_speed_unit: 'km/h',
        });
        const data = processWeatherData(hass, baseConfig);
        expect(data.windSpeedValue).toBeCloseTo(24);
        // Displayed value preserves the source value + unit
        expect(data.windSpeed).toContain('24');
        expect(data.windSpeed).toContain('km/h');
    });

    it('converts m/s to km/h for animations but displays raw m/s value', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 20, wind_speed: 10, wind_speed_unit: 'm/s',
        });
        const data = processWeatherData(hass, baseConfig);
        expect(data.windSpeedValue).toBeCloseTo(36, 1);
        expect(data.windSpeed).toBe('10 m/s');
    });

    it('converts mph to km/h for animations', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 20, wind_speed: 15, wind_speed_unit: 'mph',
        });
        const data = processWeatherData(hass, baseConfig);
        expect(data.windSpeedValue).toBeCloseTo(24.14, 1);
    });
});

describe('processWeatherData — wind bearing', () => {
    it('passes through a numeric bearing', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0, wind_bearing: 90 });
        const data = processWeatherData(hass, baseConfig);
        expect(data.windBearing).toBe(90);
    });

    it('normalises out-of-range numeric bearings', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0, wind_bearing: 450 });
        expect(processWeatherData(hass, baseConfig).windBearing).toBe(90);
    });

    it('parses cardinal abbreviations', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0, wind_bearing: 'NNE' });
        expect(processWeatherData(hass, baseConfig).windBearing).toBe(22.5);
    });

    it('returns null when bearing is missing', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0 });
        expect(processWeatherData(hass, baseConfig).windBearing).toBeNull();
    });
});

describe('processWeatherData — wind sensors', () => {
    const withSensors = (sensors: Record<string, { state: string; unit?: string }>, attrs: Record<string, unknown> = {}) => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 20, wind_speed: 12, wind_speed_unit: 'km/h', wind_bearing: 90, ...attrs });
        for (const [id, { state, unit }] of Object.entries(sensors)) {
            (hass.states as Record<string, unknown>)[id] = { entity_id: id, state, attributes: unit ? { unit_of_measurement: unit } : {} };
        }
        return hass;
    };
    const config = { ...baseConfig, wind_speed_sensor_entity: 'sensor.anemometer', wind_direction_sensor_entity: 'sensor.wind_vane' };

    it('shows the sensor\'s speed in its own unit and moves the weather at it, in km/h', () => {
        const data = processWeatherData(withSensors({ 'sensor.anemometer': { state: '5.4', unit: 'm/s' } }), config);
        expect(data.windSpeed).toBe('5 m/s');
        expect(data.windSpeedValue).toBeCloseTo(19.44, 1);
    });

    it('points the arrow from the sensor, in degrees or a compass point', () => {
        expect(processWeatherData(withSensors({ 'sensor.wind_vane': { state: '225.5', unit: '°' } }), config).windBearing).toBe(225.5);
        expect(processWeatherData(withSensors({ 'sensor.wind_vane': { state: 'NW' } }), config).windBearing).toBe(315);
    });

    it('falls back to the weather entity while a sensor is unavailable or missing', () => {
        const data = processWeatherData(withSensors({ 'sensor.anemometer': { state: 'unavailable', unit: 'm/s' }, 'sensor.wind_vane': { state: 'unknown' } }), config);
        expect(data.windSpeed).toBe('12 km/h');
        expect(data.windSpeedValue).toBe(12);
        expect(data.windBearing).toBe(90);
        const missing = processWeatherData(withSensors({}), config);
        expect(missing.windSpeed).toBe('12 km/h');
        expect(missing.windBearing).toBe(90);
    });

    it('reads a bearing from degrees, out-of-range degrees or a compass point, and nothing else', () => {
        expect(windBearingOf(90)).toBe(90);
        expect(windBearingOf('-90')).toBe(270);
        expect(windBearingOf(' ssw ')).toBe(202.5);
        expect(windBearingOf('unavailable')).toBeNull();
        expect(windBearingOf(undefined)).toBeNull();
    });
});

describe('processWeatherData — pressure formatting', () => {
    it('formats hPa as integer', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 0, pressure: 1013.4, pressure_unit: 'hPa',
        });
        expect(processWeatherData(hass, baseConfig).pressure).toBe('1,013 hPa');
    });

    it('formats inHg with two decimals (no precision loss)', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 0, pressure: 29.92, pressure_unit: 'inHg',
        });
        expect(processWeatherData(hass, baseConfig).pressure).toBe('29.92 inHg');
    });
});

describe('processWeatherData — feels-like', () => {
    it('falls back to apparent_temperature attribute when no sensor configured', () => {
        const hass = makeHass('weather.home', 'sunny', {
            temperature: 16, apparent_temperature: 13.4,
        });
        const data = processWeatherData(hass, baseConfig);
        expect(data.feelsLike).toBe('13°');
    });

    it('prefers a configured feels-like sensor over the weather entity attribute', () => {
        const hass: HomeAssistant = {
            states: {
                'weather.home': {
                    entity_id: 'weather.home', state: 'sunny',
                    attributes: { temperature: 16, apparent_temperature: 13 },
                },
                'sensor.feels_like': {
                    entity_id: 'sensor.feels_like', state: '9.7',
                    attributes: {},
                },
            },
            language: 'en-US',
        } as unknown as HomeAssistant;
        const config: AnimatedWeatherCardConfig = {
            entity: 'weather.home',
            feels_like_entity: 'sensor.feels_like',
        };
        expect(processWeatherData(hass, config).feelsLike).toBe('10°');
    });
});

describe('processWeatherData — humidity edge cases', () => {
    it('treats 0% humidity as a real value (not "missing")', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0, humidity: 0 });
        expect(processWeatherData(hass, baseConfig).humidity).toBe('0%');
    });

    it('falls back to "--" when humidity is missing entirely', () => {
        const hass = makeHass('weather.home', 'sunny', { temperature: 0 });
        expect(processWeatherData(hass, baseConfig).humidity).toBe('--');
    });
});

describe('condition name', () => {
    const entity = (state: string) => ({ entity_id: 'weather.home', state, attributes: {} }) as never;

    it('uses Home Assistant\'s translation when it has one', () => {
        const hass = { formatEntityState: () => 'Teilweise bewölkt' } as never;
        expect(conditionName(hass, entity('partlycloudy'))).toBe('Teilweise bewölkt');
    });

    it('never shows a raw state like "partlycloudy"', () => {
        expect(conditionName({} as never, entity('partlycloudy'))).toBe('Partly cloudy');
        // formatEntityState that can't translate hands the raw state back
        const untranslated = { formatEntityState: (e: { state: string }) => e.state } as never;
        expect(conditionName(untranslated, entity('windy-variant'))).toBe('Windy, cloudy');
        expect(conditionName({} as never, entity('something-new'))).toBe('something-new');
    });
});

describe('the note', () => {
    const config = (extra: Partial<AnimatedWeatherCardConfig> = {}): AnimatedWeatherCardConfig =>
        ({ entity: 'weather.home', note_entity: 'sensor.note', ...extra });

    it('reads the short line from the state and the longer note from an attribute, trimmed', () => {
        const hass = makeHass('sensor.note', '  Grey again.  ', { note: ' Grey, damp, committed to the bit. ', generated_at: '2026-10-20T12:00:00Z' });
        expect(readNote(hass, config())).toEqual({
            line: 'Grey again.', note: 'Grey, damp, committed to the bit.', writtenAt: Date.parse('2026-10-20T12:00:00Z'),
        });
    });

    it('has nothing to say without an entity, or when it is empty or unavailable', () => {
        expect(readNote(makeHass('sensor.note', 'Hi'), config({ note_entity: undefined }))).toBeNull();
        expect(readNote(makeHass('sensor.other', 'Hi'), config())).toBeNull();
        expect(readNote(makeHass('sensor.note', ''), config())).toBeNull();
        expect(readNote(makeHass('sensor.note', 'unavailable'), config())).toBeNull();
        expect(readNote(undefined, config())).toBeNull();
    });

    it('ignores a generated_at it cannot read', () => {
        expect(readNote(makeHass('sensor.note', 'Hi', { generated_at: 'soon' }), config())?.writtenAt).toBeNull();
    });

    it('goes stale note_max_age minutes after it was written, 180 by default, never at 0', () => {
        const written = { line: 'a', note: 'a', writtenAt: 1_000_000 };
        expect(NOTE_MAX_AGE_MINUTES).toBe(180);
        expect(noteExpiresAt(written, config())).toBe(1_000_000 + 180 * 60_000);
        expect(noteExpiresAt(written, config({ note_max_age: 30 }))).toBe(1_000_000 + 30 * 60_000);
        expect(noteExpiresAt(written, config({ note_max_age: 0 }))).toBeNull();
        expect(noteExpiresAt({ ...written, writtenAt: null }, config())).toBeNull();
    });
});
