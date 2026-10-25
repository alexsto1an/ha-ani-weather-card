// Weather data processing for Animated Weather Card

import { HomeAssistant, HassEntity, AnimatedWeatherCardConfig } from './types';
import { DEV_MODE_TEMPERATURES, DEV_MODE_CONDITION_NAMES, DEV_MODE_SAMPLE_DATA } from './constants';
import { convertWindSpeedToKmh, formatLocalizedNumber, lookup } from './utils';

/** Home Assistant's English names for weather states, used when HA can't translate. */
export const HA_CONDITION_NAMES: Record<string, string> = {
    'clear-night': 'Clear, night',
    'cloudy': 'Cloudy',
    'exceptional': 'Exceptional',
    'fog': 'Fog',
    'hail': 'Hail',
    'lightning': 'Lightning',
    'lightning-rainy': 'Lightning, rainy',
    'partlycloudy': 'Partly cloudy',
    'pouring': 'Pouring',
    'rainy': 'Rainy',
    'snowy': 'Snowy',
    'snowy-rainy': 'Snowy, rainy',
    'sunny': 'Sunny',
    'windy': 'Windy',
    'windy-variant': 'Windy, cloudy',
};

/**
 * The condition as Home Assistant shows it, in the user's language
 * ("Partly cloudy", "Teilweise bewölkt"), never the raw state ("partlycloudy").
 */
export function conditionName(hass: HomeAssistant, entity: HassEntity): string {
    try {
        const localized = hass.formatEntityState?.(entity);
        if (localized && localized !== entity.state) return localized;
    } catch { /* older HA */ }
    return lookup(HA_CONDITION_NAMES, entity.state) || entity.state;
}

export interface SunData {
    sunrise: string | null;
    sunset: string | null;
    dawn: string | null;
    dusk: string | null;
    noon: string | null;
    elevation: number | null;
    aboveHorizon: boolean;
}

export interface WeatherData {
    temperature: string;
    weatherCondition: string;
    location: string;
    humidity: string;
    windSpeed: string;
    windSpeedValue: number; // Raw numeric value for animations
    /**
     * Wind bearing in degrees (0-360, north=0). HA convention: the direction
     * the wind is coming FROM. `null` if unknown / not provided by the entity.
     */
    windBearing: number | null;
    pressure: string;
    /** Raw numeric pressure value for trend comparison. `null` if unknown. */
    pressureValue: number | null;
    /** Localized "Feels like" temperature string with degree symbol, or null. */
    feelsLike: string | null;
    indoorTemperature: string;
    indoorHumidity: string;
    sun?: SunData;
}

/** The note under the conditions, in the two lengths the card picks between. */
export interface WeatherNote {
    /** One line, for short frames */
    line: string;
    /** Up to two lines, where there's room */
    note: string;
    /** When it was written (ms since the epoch), from `generated_at`; null when the source doesn't say */
    writtenAt: number | null;
}

/** How long a note stays true by default: "rain until three" is wrong by six. */
export const NOTE_MAX_AGE_MINUTES = 180;

/**
 * The note from `note_entity`: its state is the short line, `note_attribute`
 * ("note") the longer one. Either length stands in for a missing other.
 */
export function readNote(hass: HomeAssistant | undefined, config: AnimatedWeatherCardConfig): WeatherNote | null {
    const entity = config.note_entity ? hass?.states[config.note_entity] : undefined;
    if (!entity) return null;
    const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
    const state = entity.state === 'unknown' || entity.state === 'unavailable' ? '' : text(entity.state);
    const long = text(entity.attributes?.[config.note_attribute || 'note']);
    if (!state && !long) return null;
    const written = Date.parse(entity.attributes?.generated_at);
    return { line: state || long, note: long || state, writtenAt: Number.isNaN(written) ? null : written };
}

/**
 * When a note stops being true: `note_max_age` minutes after it was written.
 * Null when it never goes stale (no `generated_at`, or a max age of 0): the
 * entity's owner keeps it current.
 */
export function noteExpiresAt(note: WeatherNote, config: AnimatedWeatherCardConfig): number | null {
    const maxAge = Number(config.note_max_age ?? NOTE_MAX_AGE_MINUTES);
    if (note.writtenAt === null || !(maxAge > 0)) return null;
    return note.writtenAt + maxAge * 60_000;
}

/**
 * Process weather data from either dev mode or Home Assistant entities
 */
export function processWeatherData(
    hass: HomeAssistant | undefined,
    config: AnimatedWeatherCardConfig,
    currentDevCondition?: string
): WeatherData {
    if (config.dev_mode) {
        const devData = processDevModeData(config, currentDevCondition);
        // In dev mode, override sample sun data with real entity data if available
        if (hass && config.sun_entity) {
            const sunEntity = hass.states[config.sun_entity];
            if (sunEntity) {
                devData.sun = {
                    sunrise: sunEntity.attributes.next_rising || null,
                    sunset: sunEntity.attributes.next_setting || null,
                    dawn: sunEntity.attributes.next_dawn || null,
                    dusk: sunEntity.attributes.next_dusk || null,
                    noon: sunEntity.attributes.next_noon || null,
                    elevation: sunEntity.attributes.elevation ?? null,
                    aboveHorizon: sunEntity.state === 'above_horizon'
                };
            }
        }
        return devData;
    }
    if (!hass) {
        return {
            temperature: "--",
            weatherCondition: "",
            location: config.name || "",
            humidity: "--",
            pressure: "--",
            pressureValue: null,
            feelsLike: null,
            windSpeed: "--",
            windSpeedValue: 0,
            windBearing: null,
            indoorTemperature: "--",
            indoorHumidity: "--"
        };
    }
    return processHomeAssistantData(hass, config);
}

/**
 * Process dev mode weather data
 */
function processDevModeData(config: AnimatedWeatherCardConfig, currentDevCondition?: string): WeatherData {
    const currentCondition = currentDevCondition || "sunny";
    const temperatures = DEV_MODE_TEMPERATURES;
    const temperature = (temperatures as Record<string, string>)[currentCondition] || "22";
    const location = config.name || "";  // Only show if name is provided

    // Dev mode attribute values
    const humidity = DEV_MODE_SAMPLE_DATA.humidity;
    const windSpeed = DEV_MODE_SAMPLE_DATA.windSpeed;
    // Extract numeric value from windSpeed string (e.g., "100 km/h" -> 100)
    const windSpeedValue = parseFloat(windSpeed.split(' ')[0]) || 15;
    const pressure = DEV_MODE_SAMPLE_DATA.pressure;

    // Map condition to proper display name
    const conditionNames = DEV_MODE_CONDITION_NAMES as Record<string, string>;
    const weatherCondition = conditionNames[currentDevCondition || "sunny"] || currentDevCondition || "sunny";

    // Dev mode sample indoor data
    const indoorTemperature = DEV_MODE_SAMPLE_DATA.indoorTemperature;
    const indoorHumidity = DEV_MODE_SAMPLE_DATA.indoorHumidity;

    // Dev mode sample sun data — simulate today's sunrise/sunset
    const today = new Date();
    const sunriseDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 6, 14);
    const sunsetDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 18, 32);
    const dawnDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5, 45);
    const duskDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 19, 1);
    const noonDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 23);
    const nowMs = Date.now();
    const sun: SunData = {
        sunrise: sunriseDate.toISOString(),
        sunset: sunsetDate.toISOString(),
        dawn: dawnDate.toISOString(),
        dusk: duskDate.toISOString(),
        noon: noonDate.toISOString(),
        elevation: 42.5,
        aboveHorizon: nowMs >= sunriseDate.getTime() && nowMs <= sunsetDate.getTime()
    };

    return {
        temperature,
        weatherCondition,
        location,
        humidity,
        windSpeed,
        windSpeedValue,
        windBearing: null,
        pressure,
        pressureValue: null,
        feelsLike: null,
        indoorTemperature,
        indoorHumidity,
        sun
    };
}

const CARDINAL_BEARINGS: Record<string, number> = {
    N: 0, NNE: 22.5, NE: 45, ENE: 67.5,
    E: 90, ESE: 112.5, SE: 135, SSE: 157.5,
    S: 180, SSW: 202.5, SW: 225, WSW: 247.5,
    W: 270, WNW: 292.5, NW: 315, NNW: 337.5,
};

/**
 * A wind bearing in degrees (0-360, north 0) from degrees or a compass point
 * like "NNE": the direction the wind comes from, as Home Assistant reports
 * it. Null when it can't be read, such as an unavailable sensor.
 */
export function windBearingOf(raw: unknown): number | null {
    const n = typeof raw === 'number' ? raw : typeof raw === 'string' ? parseFloat(raw) : NaN;
    if (isFinite(n)) return ((n % 360) + 360) % 360;
    return typeof raw === 'string' ? CARDINAL_BEARINGS[raw.trim().toUpperCase()] ?? null : null;
}

/**
 * Process Home Assistant weather entity data
 */
function processHomeAssistantData(hass: HomeAssistant, config: AnimatedWeatherCardConfig): WeatherData {
    if (!config.entity) {
        throw new Error('Weather entity is required');
    }
    const entity = hass.states[config.entity];
    if (!entity) {
        throw new Error(`Entity ${config.entity} not found`);
    }

    // Get temperature from outdoor sensor if configured, otherwise from weather entity
    let temperatureValue: number;
    if (config.outdoor_sensor_entity) {
        const outdoorSensor = hass.states[config.outdoor_sensor_entity];
        if (outdoorSensor && outdoorSensor.state && !isNaN(parseFloat(outdoorSensor.state))) {
            temperatureValue = parseFloat(outdoorSensor.state);
        } else {
            // Fallback to weather entity temperature
            temperatureValue = entity.attributes.temperature;
        }
    } else {
        // Use weather entity temperature
        temperatureValue = entity.attributes.temperature;
    }

    const temperature = temperatureValue != null && !isNaN(temperatureValue)
        ? formatLocalizedNumber(Math.round(temperatureValue), hass)
        : "--";
    const weatherCondition = conditionName(hass, entity);

    // Use name from config if provided, otherwise use entity friendly name
    const location = config.name || entity.attributes.friendly_name || "";

    // Get humidity from sensor or weather entity
    const parseHumidity = (raw: unknown): string | null => {
        const n = typeof raw === 'number' ? raw : parseFloat(raw as string);
        return isFinite(n) ? formatLocalizedNumber(Math.round(n), hass) + "%" : null;
    };
    let humidity = "--";
    if (config.humidity_sensor_entity) {
        const humiditySensor = hass.states[config.humidity_sensor_entity];
        humidity = (humiditySensor && parseHumidity(humiditySensor.state))
            || parseHumidity(entity.attributes.humidity)
            || "--";
    } else {
        humidity = parseHumidity(entity.attributes.humidity) || "--";
    }

    // Wind speed from your own sensor, else the weather entity: shown in its
    // own unit, converted to km/h for how fast the weather moves
    let windSpeed = "--";
    let windSpeedValue = 10; // Default fallback wind speed (km/h) for animations
    const readWindSpeed = (raw: unknown, unit: string | undefined): boolean => {
        const n = typeof raw === 'number' ? raw : parseFloat(raw as string);
        if (!isFinite(n)) return false;
        windSpeedValue = convertWindSpeedToKmh(n, unit || "km/h");
        windSpeed = formatLocalizedNumber(Math.round(n), hass) + " " + (unit || "km/h");
        return true;
    };
    const windSpeedSensor = config.wind_speed_sensor_entity ? hass.states[config.wind_speed_sensor_entity] : undefined;
    if (!(windSpeedSensor && readWindSpeed(windSpeedSensor.state, windSpeedSensor.attributes?.unit_of_measurement))) {
        readWindSpeed(entity.attributes.wind_speed, entity.attributes.wind_speed_unit);
    }

    // Wind direction from your own sensor, else the weather entity's bearing
    const windDirectionSensor = config.wind_direction_sensor_entity ? hass.states[config.wind_direction_sensor_entity] : undefined;
    const windBearing = windBearingOf(windDirectionSensor?.state) ?? windBearingOf(entity.attributes.wind_bearing);

    // Get pressure from sensor or weather entity. Use 2 decimals for inHg,
    // integer otherwise. Format via Intl so locales using comma decimals
    // (e.g. de-DE, fr-FR) display "29,92" instead of "29.92".
    const formatPressure = (raw: unknown, unit: string): string | null => {
        const n = typeof raw === 'number' ? raw : parseFloat(raw as string);
        if (!isFinite(n)) return null;
        const decimals = unit.toLowerCase() === 'inhg' ? 2 : 0;
        return formatLocalizedNumber(n, hass, decimals) + " " + unit;
    };
    const parsePressureNumber = (raw: unknown): number | null => {
        const n = typeof raw === 'number' ? raw : parseFloat(raw as string);
        return isFinite(n) ? n : null;
    };
    let pressure = "--";
    let pressureValue: number | null = null;
    if (config.pressure_sensor_entity) {
        const pressureSensor = hass.states[config.pressure_sensor_entity];
        if (pressureSensor) {
            const unit = pressureSensor.attributes.unit_of_measurement || "hPa";
            const formatted = formatPressure(pressureSensor.state, unit);
            if (formatted) {
                pressure = formatted;
                pressureValue = parsePressureNumber(pressureSensor.state);
            }
        }
        if (pressure === "--" && entity.attributes.pressure !== undefined) {
            const unit = entity.attributes.pressure_unit || "hPa";
            pressure = formatPressure(entity.attributes.pressure, unit) || "--";
            pressureValue = parsePressureNumber(entity.attributes.pressure);
        }
    } else if (entity.attributes.pressure !== undefined) {
        const unit = entity.attributes.pressure_unit || "hPa";
        pressure = formatPressure(entity.attributes.pressure, unit) || "--";
        pressureValue = parsePressureNumber(entity.attributes.pressure);
    }

    // Get "feels like" temperature if a sensor is configured. Falls back to
    // the weather entity's `apparent_temperature` attribute when present.
    let feelsLike: string | null = null;
    let feelsLikeRaw: unknown;
    if (config.feels_like_entity) {
        feelsLikeRaw = hass.states[config.feels_like_entity]?.state;
    }
    if (feelsLikeRaw === undefined && entity.attributes.apparent_temperature !== undefined) {
        feelsLikeRaw = entity.attributes.apparent_temperature;
    }
    if (feelsLikeRaw !== undefined) {
        const n = typeof feelsLikeRaw === 'number' ? feelsLikeRaw : parseFloat(feelsLikeRaw as string);
        if (isFinite(n)) {
            feelsLike = formatLocalizedNumber(Math.round(n), hass) + "°";
        }
    }

    // Get indoor temperature from sensor
    let indoorTemperature = "--";
    if (config.indoor_temperature_entity) {
        const indoorTempSensor = hass.states[config.indoor_temperature_entity];
        if (indoorTempSensor && indoorTempSensor.state && !isNaN(parseFloat(indoorTempSensor.state))) {
            indoorTemperature = formatLocalizedNumber(Math.round(parseFloat(indoorTempSensor.state)), hass) + "°";
        }
    }

    // Get indoor humidity from sensor
    let indoorHumidity = "--";
    if (config.indoor_humidity_entity) {
        const indoorHumiditySensor = hass.states[config.indoor_humidity_entity];
        if (indoorHumiditySensor && indoorHumiditySensor.state && !isNaN(parseFloat(indoorHumiditySensor.state))) {
            indoorHumidity = formatLocalizedNumber(Math.round(parseFloat(indoorHumiditySensor.state)), hass) + "%";
        }
    }

    // Get sun data if sun entity is configured
    let sun: SunData | undefined;
    if (config.sun_entity) {
        const sunEntity = hass.states[config.sun_entity];
        if (sunEntity) {
            sun = {
                sunrise: sunEntity.attributes.next_rising || null,
                sunset: sunEntity.attributes.next_setting || null,
                dawn: sunEntity.attributes.next_dawn || null,
                dusk: sunEntity.attributes.next_dusk || null,
                noon: sunEntity.attributes.next_noon || null,
                elevation: sunEntity.attributes.elevation ?? null,
                aboveHorizon: sunEntity.state === 'above_horizon'
            };
        }
    }

    return {
        temperature,
        weatherCondition,
        location,
        humidity,
        windSpeed,
        windSpeedValue,
        windBearing,
        pressure,
        pressureValue,
        feelsLike,
        indoorTemperature,
        indoorHumidity,
        sun
    };
}