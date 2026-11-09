// Saying the forecast: temperatures, hours, days, chances and conditions, in
// the dashboard's language. Shared by the forecast's drawings (the forecast
// bundle).

import type { HomeAssistant, HassEntity } from './types';
import { formatLocalizedNumber, lookup, escapeHtml } from './utils';
import { HA_CONDITION_NAMES } from './weather-data';
import { formatHour, formatWeekday, localizeString } from './localize';

/** A temperature in whole degrees, "21°", "−3°", in the dashboard's number format */
export function degrees(value: number | undefined, hass?: HomeAssistant): string {
    if (value === undefined || !isFinite(value)) return '–';
    // A true minus, which lines up with the digits; Intl gives a hyphen in most languages
    return `${formatLocalizedNumber(Math.round(value) || 0, hass, 0).replace(/^-/, '−')}°`;
}

/** A chance, "40%", in the dashboard's number format */
export function percent(value: number | undefined, hass?: HomeAssistant): string {
    if (value === undefined || !isFinite(value)) return '';
    try {
        return new Intl.NumberFormat(hass?.locale?.language || hass?.language || 'en', { style: 'percent', maximumFractionDigits: 0 }).format(Math.round(value) / 100);
    } catch {
        return `${Math.round(value)}%`;
    }
}

/** The hour an entry starts, "14" or "2 PM", or "Now" for the one under way */
export function hourLabel(datetime: string, now: number, hass?: HomeAssistant): string {
    const t = Date.parse(datetime);
    if (t <= now && t + 3600_000 > now) return localizeString(hass, 'now');
    return formatHour(new Date(t), hass);
}

/** A day's name, "Mon", or "Today" for today */
export function dayLabel(date: Date, isToday: boolean, hass?: HomeAssistant, width: 'short' | 'long' = 'short'): string {
    return isToday ? localizeString(hass, 'today') : formatWeekday(date, hass, width);
}

/** A condition as Home Assistant names it, in the user's language ("Partly cloudy", "Teilweise bewölkt") */
export function conditionLabel(condition: string | undefined, hass?: HomeAssistant, entityId = 'weather.forecast'): string {
    if (!condition) return '';
    try {
        const name = hass?.formatEntityState?.({ entity_id: entityId, state: condition, attributes: {} } as unknown as HassEntity);
        if (name && name !== condition) return name;
    } catch { /* older Home Assistant */ }
    return lookup(HA_CONDITION_NAMES, condition) ?? condition;
}

/**
 * Home Assistant's own weather glyphs (mdi, through ha-icon), by day and by
 * night. A literal table: an icon name is never built from a state.
 */
const GLYPHS: Record<string, [string, string]> = {
    'sunny': ['mdi:weather-sunny', 'mdi:weather-night'],
    'clear-night': ['mdi:weather-night', 'mdi:weather-night'],
    'partlycloudy': ['mdi:weather-partly-cloudy', 'mdi:weather-night-partly-cloudy'],
    'cloudy': ['mdi:weather-cloudy', 'mdi:weather-cloudy'],
    'fog': ['mdi:weather-fog', 'mdi:weather-fog'],
    'rainy': ['mdi:weather-rainy', 'mdi:weather-rainy'],
    'pouring': ['mdi:weather-pouring', 'mdi:weather-pouring'],
    'lightning': ['mdi:weather-lightning', 'mdi:weather-lightning'],
    'lightning-rainy': ['mdi:weather-lightning-rainy', 'mdi:weather-lightning-rainy'],
    'snowy': ['mdi:weather-snowy', 'mdi:weather-snowy'],
    'snowy-rainy': ['mdi:weather-snowy-rainy', 'mdi:weather-snowy-rainy'],
    'hail': ['mdi:weather-hail', 'mdi:weather-hail'],
    'windy': ['mdi:weather-windy', 'mdi:weather-windy'],
    'windy-variant': ['mdi:weather-windy-variant', 'mdi:weather-windy-variant'],
    'exceptional': ['mdi:alert-circle-outline', 'mdi:alert-circle-outline'],
};

/** The glyph for a condition, by day or by night; a plain cloud for anything unknown */
export function conditionIcon(condition: string | undefined, night = false): string {
    const pair = condition ? lookup(GLYPHS, condition) : undefined;
    return pair ? pair[night ? 1 : 0] : 'mdi:weather-cloudy';
}

/** An ha-icon for a condition, hidden from screen readers (the words say it) */
export function conditionIconHtml(condition: string | undefined, night: boolean, className: string): string {
    return `<ha-icon class="${escapeHtml(className)}" icon="${conditionIcon(condition, night)}" aria-hidden="true"></ha-icon>`;
}
