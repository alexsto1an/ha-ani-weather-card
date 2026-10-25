// Utility functions for Animated Weather Card

import { DEFAULT_ENGINE_SETTINGS, DEV_MODE_TEMPERATURES, DEV_MODE_CONDITION_NAMES, DAY_NIGHT_ANIMATION_COLORS } from './constants';
import type { 
    AnimatedWeatherCardConfig, 
    WeatherEngineSettings, 
    WeatherCondition, 
    TimeOfDayManager, 
    DayNightColors,
    HassEntity 
} from './types';

/**
 * Type guard to check if a value is a valid weather condition
 */
export function isValidWeatherCondition(condition: string): condition is WeatherCondition {
    const validConditions: readonly WeatherCondition[] = [
        'sunny', 'clear-night', 'partly-cloudy', 'cloudy', 'rainy', 'light-rain', 
        'pouring', 'stormy', 'snowy', 'snowy-rainy', 'snowy-stormy', 'sleety', 
        'sleety-stormy', 'windy', 'foggy'
    ] as const;
    return validConditions.includes(condition as WeatherCondition);
}

/**
 * Type guard to check if a value is a valid number within range
 */
export function isValidNumber(value: unknown, min: number = -Infinity, max: number = Infinity): value is number {
    return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
}

/**
 * Type guard to check if a value is a valid RGB color
 */
export function isValidColor(color: unknown): color is string {
    if (typeof color !== 'string') return false;
    
    // Check hex colors
    if (/^#([0-9A-Fa-f]{3}){1,2}$/.test(color)) return true;
    
    // rgb()/rgba(): digits, commas, dots, percent signs and spaces, and the
    // slash of the modern `rgb(255 0 0 / 50%)`. Nothing that could end the
    // declaration or the style attribute the color is written into.
    if (/^rgba?\(\s*[\d.,%\s/]+\)$/.test(color)) return true;
    
    // Check CSS color names (comprehensive validation)
    const cssColorNames = [
        'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black', 'white',
        'gray', 'grey', 'transparent', 'aqua', 'cyan', 'magenta', 'fuchsia', 'lime', 'maroon',
        'navy', 'olive', 'teal', 'silver', 'gold', 'coral', 'crimson', 'indigo', 'ivory',
        'khaki', 'lavender', 'linen', 'orchid', 'peru', 'plum', 'salmon', 'sienna', 'tan',
        'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'beige', 'azure', 'bisque',
        'chocolate', 'cornsilk', 'firebrick', 'gainsboro', 'honeydew', 'lemonchiffon',
        'lightblue', 'lightcoral', 'lightcyan', 'lightgray', 'lightgrey', 'lightgreen',
        'lightpink', 'lightsalmon', 'lightyellow', 'mediumblue', 'mintcream', 'mistyrose',
        'moccasin', 'oldlace', 'orangered', 'palegoldenrod', 'palegreen', 'paleturquoise',
        'palevioletred', 'papayawhip', 'peachpuff', 'powderblue', 'rosybrown', 'royalblue',
        'seagreen', 'seashell', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow',
        'springgreen', 'steelblue', 'yellowgreen', 'aliceblue', 'antiquewhite', 'aquamarine',
        'blanchedalmond', 'blueviolet', 'burlywood', 'cadetblue', 'chartreuse', 'cornflowerblue',
        'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgrey', 'darkgreen',
        'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred',
        'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey',
        'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
        'dodgerblue', 'floralwhite', 'forestgreen', 'ghostwhite', 'goldenrod', 'greenyellow',
        'hotpink', 'indianred', 'lawngreen', 'lightseagreen', 'lightskyblue', 'lightslategray',
        'lightslategrey', 'lightsteelblue', 'limegreen', 'mediumaquamarine', 'mediumorchid',
        'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
        'mediumturquoise', 'mediumvioletred', 'midnightblue', 'navajowhite', 'olivedrab',
        'rebeccapurple', 'saddlebrown', 'sandybrown', 'whitesmoke'
    ];
    return cssColorNames.includes(color.toLowerCase());
}

/**
 * Escape HTML-significant characters in a string for safe innerHTML interpolation.
 * Use this for any value derived from Home Assistant state, attributes, or user config
 * before substituting it into a template literal.
 */
export function escapeHtml(str: string | number | undefined | null): string {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * A table's own entry for a key from outside the code (an entity state), or
 * undefined. Indexing or `in` would also find what every object inherits:
 * a state of "constructor" would read as a function.
 */
export function lookup<T>(table: Record<string, T>, key: string): T | undefined {
    return Object.prototype.hasOwnProperty.call(table, key) ? table[key] : undefined;
}

export interface TextFieldOptions {
    id: string;
    label: string;
    value?: string | number;
    placeholder?: string;
    /** Help text under the field */
    hint?: string;
    type?: 'text' | 'number';
    min?: number;
    max?: number;
}

/**
 * A text field for the visual editors, as whichever element this Home Assistant has.
 * Home Assistant 2026.5 replaced ha-textfield with ha-input, and an element that isn't
 * defined renders nothing. Both are defined by the time the editors render, because
 * loading ha-entity-picker loads them. ha-input takes its help text as `hint`;
 * ha-textfield as `helper`, shown only while focused unless `helperPersistent` is set.
 */
export function textField(options: TextFieldOptions): string {
    const tag = customElements.get('ha-input') || !customElements.get('ha-textfield') ? 'ha-input' : 'ha-textfield';
    const { id, label, value, placeholder, hint, type, min, max } = options;
    const attributes = [
        `id="${escapeHtml(id)}"`,
        `label="${escapeHtml(label)}"`,
        `value="${escapeHtml(value)}"`,
        placeholder ? `placeholder="${escapeHtml(placeholder)}"` : '',
        type ? `type="${type}"` : '',
        min !== undefined ? `min="${min}"` : '',
        max !== undefined ? `max="${max}"` : '',
        !hint ? '' : tag === 'ha-input' ? `hint="${escapeHtml(hint)}"` : `helper="${escapeHtml(hint)}" helperPersistent`,
    ].filter(Boolean);
    return `<${tag} ${attributes.join(' ')}></${tag}>`;
}

/**
 * Format a number using HA's locale (or browser default). Falls back to a
 * raw `toFixed` if Intl throws — important for tests / older runtimes.
 */
export function formatLocalizedNumber(
    value: number,
    hass?: { language?: string; locale?: { language?: string } },
    decimals: number = 0
): string {
    if (!isFinite(value)) return '--';
    const lang = hass?.locale?.language || hass?.language || (typeof navigator !== 'undefined' ? navigator.language : 'en');
    try {
        return new Intl.NumberFormat(lang, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value);
    } catch (_) {
        return value.toFixed(decimals);
    }
}

/**
 * Localize a string via `hass.localize` if it returns a non-empty value,
 * otherwise fall back to the supplied default. Lets us use the user's HA
 * language for common labels like "Humidity"/"Wind speed"/"Pressure".
 */
export function cardLocalize(
    hass: { localize?: (key: string, ...args: unknown[]) => string } | undefined,
    key: string,
    fallback: string
): string {
    if (hass?.localize) {
        try {
            const out = hass.localize(key);
            if (out && out !== key) return out;
        } catch (_) { /* ignore */ }
    }
    return fallback;
}

/**
 * Convert a wind speed value to km/h, given Home Assistant's `wind_speed_unit`.
 * HA exposes one of: km/h, m/s, mph, ft/s, kn (knots). Defaults to km/h on unknown unit.
 */
export function convertWindSpeedToKmh(value: number, unit: string | undefined): number {
    if (!isFinite(value)) return 0;
    switch ((unit || 'km/h').toLowerCase()) {
        case 'm/s': return value * 3.6;
        case 'mph': return value * 1.609344;
        case 'ft/s': return value * 1.09728;
        case 'kn':
        case 'kt':
        case 'knots': return value * 1.852;
        // A Beaufort force, by the scale's own formula: 0.836 · B^1.5 m/s
        case 'beaufort':
        case 'bft': return 0.836 * Math.pow(Math.max(0, value), 1.5) * 3.6;
        case 'km/h':
        case 'kmh':
        case 'kph':
        default: return value;
    }
}

/**
 * Logs for a card in dev mode. `enabled` is that card's own dev_mode, so a
 * dev-mode card on a dashboard never makes the other cards there log.
 */
export function devLog(enabled: boolean | undefined, message: string, ...args: readonly unknown[]): void {
    if (enabled) console.log(`[AWC Dev] ${message}`, ...args);
}

/**
 * Get weather engine settings with defaults and type validation
 * @param config - The card configuration
 * @param realWindSpeed - Actual wind speed from weather data (optional)
 * @throws {Error} If configuration contains invalid values
 */
export function getWeatherSettings(
    config: AnimatedWeatherCardConfig, 
    realWindSpeed?: number
): WeatherEngineSettings {
    const engineSettings = config.engine_settings || {};
    
    // Validate engine settings with type checking
    const validateSetting = (value: unknown, defaultValue: number, min: number, max: number): number => {
        if (!isValidNumber(value, min, max)) {
            return defaultValue;
        }
        return value;
    };
    
    // Calculate effective wind speed: real wind speed * multiplier
    const baseWindSpeed = validateSetting(
        engineSettings.windSpeed, 
        DEFAULT_ENGINE_SETTINGS.windSpeed, 
        0.1, 
        15.0
    );
    
    let effectiveWindSpeed = baseWindSpeed;
    
    if (isValidNumber(realWindSpeed, 0, 200)) {
        // Convert real wind speed to a reasonable animation factor (km/h to animation speed)
        // Normal wind speeds: 5-25 km/h -> effective speeds: 0.5-3.0
        effectiveWindSpeed = Math.max(0.1, Math.min(15.0, (realWindSpeed / 10) * baseWindSpeed));
    }
    
    return {
        windSpeed: effectiveWindSpeed,
        // Amounts are multipliers: the editor offers 0.5–3×, YAML can go wider
        rainCount: validateSetting(engineSettings.rainCount, DEFAULT_ENGINE_SETTINGS.rainCount, 0.1, 10),
        leafCount: validateSetting(engineSettings.leafCount, DEFAULT_ENGINE_SETTINGS.leafCount, 0.1, 10),
        snowCount: validateSetting(engineSettings.snowCount, DEFAULT_ENGINE_SETTINGS.snowCount, 0.1, 10),
        // Cloud size multiplier (the editor offers 0.5–2×; clouds clamp to 0.3–2.5)
        cloudBaseSize: validateSetting(engineSettings.cloudBaseSize, DEFAULT_ENGINE_SETTINGS.cloudBaseSize, 0.3, 2.5),
        cloudCount: validateSetting(engineSettings.cloudCount, DEFAULT_ENGINE_SETTINGS.cloudCount, 1, 20),
        splashBounce: validateSetting(engineSettings.splashBounce, DEFAULT_ENGINE_SETTINGS.splashBounce, 40, 120)
    } as const;
}

/**
 * Update weather info for dev mode with type validation
 * @param element - The HTML element to update
 * @param condition - The weather condition
 * @throws {Error} If element is invalid or condition is not supported
 */
export function updateDevModeWeatherInfo(element: HTMLElement | null, condition: string): void {
    if (!element) {
        throw new Error('Invalid element provided to updateDevModeWeatherInfo');
    }
    
    if (!isValidWeatherCondition(condition)) {
        console.warn(`Unknown weather condition: ${condition}, using default`);
        condition = 'sunny';
    }
    const conditionNames = DEV_MODE_CONDITION_NAMES;

    // Different temperatures for different conditions - add degree symbols
    const temperatures = Object.fromEntries(
        Object.entries(DEV_MODE_TEMPERATURES).map(([key, value]) => [key, value + '°'])
    );

    const tempElement = element.querySelector('.temperature');
    const descElement = element.querySelector('.weather-desc');

    if (tempElement) tempElement.textContent = (temperatures as Record<string, string>)[condition] || '22°';
    if (descElement) descElement.textContent = (conditionNames as Record<string, string>)[condition] || condition;
}

/**
 * Clear all pending timeouts with type safety
 * @param timeouts - Array of timeout handles
 */
export function clearPendingTimeouts(timeouts: (NodeJS.Timeout | number | null | undefined)[]): void {
    timeouts.forEach(timeout => {
        if (timeout != null) {
            clearTimeout(timeout);
        }
    });
    timeouts.length = 0;
}

/**
 * Pause all GSAP tweens targeting elements within a container.
 * Scoped to the container's descendants so other card instances are unaffected.
 */
export function pauseCardGSAPAnimations(container: HTMLElement): void {
    if (!window.AnimatedWeatherCardGsap) return;
    container.querySelectorAll('*').forEach(el => {
        window.AnimatedWeatherCardGsap.getTweensOf(el).forEach((t: any) => t.pause());
    });
}

/**
 * Resume all GSAP tweens targeting elements within a container.
 * Scoped to the container's descendants so other card instances are unaffected.
 */
export function resumeCardGSAPAnimations(container: HTMLElement): void {
    if (!window.AnimatedWeatherCardGsap) return;
    container.querySelectorAll('*').forEach(el => {
        window.AnimatedWeatherCardGsap.getTweensOf(el).forEach((t: any) => t.resume());
    });
}

/**
 * Kill all GSAP tweens targeting elements within a container.
 * Scoped to the container's descendants so other card instances are unaffected.
 */
export function killCardGSAPAnimations(container: HTMLElement): void {
    if (!window.AnimatedWeatherCardGsap) return;
    container.querySelectorAll('*').forEach(el => {
        window.AnimatedWeatherCardGsap.killTweensOf(el);
    });
}

/**
 * Map weather condition to CSS class with type validation.
 * Pass `timeZone` (e.g. `hass.config.time_zone`) to evaluate clear/night
 * detection in HA's timezone instead of the browser's local hour.
 */
export function getWeatherClass(
    condition: string,
    isDevMode: boolean,
    sunriseHour?: number,
    sunsetHour?: number,
    timeZone?: string
): WeatherCondition {
    if (typeof condition !== 'string') {
        console.warn('Invalid condition type provided, using sunny as fallback');
        return 'sunny';
    }
    if (isDevMode && isValidWeatherCondition(condition)) {
        return condition;
    } else if (isDevMode) {
        console.warn(`Invalid dev mode condition: ${condition}, using sunny`);
        return 'sunny';
    }

    const lowercaseCondition = condition.toLowerCase();
    
    // Priority order matters for complex conditions
    if (lowercaseCondition.includes('sleet') && (lowercaseCondition.includes('lightning') || lowercaseCondition.includes('thunder') || lowercaseCondition.includes('storm'))) {
        return 'sleety-stormy';
    } else if ((lowercaseCondition.includes('snow') || lowercaseCondition.includes('sleet')) && (lowercaseCondition.includes('lightning') || lowercaseCondition.includes('thunder') || lowercaseCondition.includes('storm'))) {
        return 'snowy-stormy';
    } else if (lowercaseCondition.includes('lightning') || lowercaseCondition.includes('thunder') || lowercaseCondition.includes('storm')) {
        return 'stormy';
    } else if (lowercaseCondition.includes('fog') || lowercaseCondition.includes('mist')) {
        return 'foggy';
    } else if (lowercaseCondition.includes('heavy') && lowercaseCondition.includes('rain')) {
        return 'pouring';
    } else if (lowercaseCondition.includes('pouring') || lowercaseCondition.includes('downpour')) {
        return 'pouring';
    } else if ((lowercaseCondition.includes('snow') || lowercaseCondition.includes('sleet')) && (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle'))) {
        return 'snowy-rainy';
    } else if (lowercaseCondition.includes('light') && (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle'))) {
        return 'light-rain';
    } else if (lowercaseCondition.includes('rain') || lowercaseCondition.includes('drizzle')) {
        return 'rainy';
    } else if (lowercaseCondition.includes('sleet') || lowercaseCondition.includes('hail')) {
        return 'sleety';
    } else if (lowercaseCondition.includes('snow')) {
        return 'snowy';
    } else if (lowercaseCondition.includes('wind')) {
        return 'windy';
    } else if (lowercaseCondition.includes('partly') && lowercaseCondition.includes('cloud')) {
        return 'partly-cloudy';
    } else if (lowercaseCondition.includes('cloud') || lowercaseCondition.includes('overcast')) {
        return 'cloudy';
    } else if (lowercaseCondition.includes('clear') || lowercaseCondition.includes('sunny')) {
        // Check if it's nighttime for clear conditions. Use HA's timezone if
        // provided so the day/night decision agrees with the sun entity, even
        // when the dashboard is viewed from a different timezone than HA's
        // location.
        const now = new Date();
        let hour: number;
        if (timeZone) {
            try {
                const parts = new Intl.DateTimeFormat('en-US', {
                    timeZone, hour: 'numeric', hour12: false
                }).formatToParts(now);
                hour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
            } catch (_) {
                hour = now.getHours();
            }
        } else {
            hour = now.getHours();
        }
        const effectiveSunrise = sunriseHour ?? 6;
        const effectiveSunset = sunsetHour ?? 20;
        const isNightTime = hour < effectiveSunrise || hour >= effectiveSunset;

        if (isNightTime && lowercaseCondition.includes('clear')) {
            return 'clear-night';
        }
        return 'sunny';
    }
    
    // Default fallback with type assertion
    return 'sunny' as WeatherCondition;
}

/**
 * Get time-aware animation color with proper type validation
 * @param animationType - The type of animation (rain, snow, etc.)
 * @param timeOfDayManager - Optional time of day manager instance
 * @param fallbackColor - Optional fallback color if time-aware color fails
 * @returns The appropriate color for the current time of day
 */
export function getTimeAwareAnimationColor(
    animationType: string, 
    timeOfDayManager?: TimeOfDayManager | null, 
    fallbackColor?: string
): string {
    if (typeof animationType !== 'string' || !animationType.trim()) {
        console.warn('Invalid animation type provided');
        return fallbackColor || getDefaultAnimationColor('rain');
    }
    if (!timeOfDayManager || !timeOfDayManager.isEnabled()) {
        return fallbackColor || getDefaultAnimationColor(animationType);
    }

    const colorScheme = (DAY_NIGHT_ANIMATION_COLORS as Record<string, DayNightColors>)[animationType] as DayNightColors | undefined;
    if (!colorScheme) {
        console.warn(`No color scheme found for animation type: ${animationType}`);
        return fallbackColor || getDefaultAnimationColor(animationType);
    }

    try {
        const state = timeOfDayManager.getCurrentState();
        const color = timeOfDayManager.getTimeAwareColor(colorScheme);
        
        // Validate the returned color
        if (isValidColor(color)) {
            return color;
        } else {
            console.warn(`Invalid color returned from time manager: ${color}`);
            return fallbackColor || getDefaultAnimationColor(animationType);
        }
    } catch (error) {
        console.error('Error getting time-aware color:', error);
        return fallbackColor || getDefaultAnimationColor(animationType);
    }
}

/**
 * Get default animation colors (fallback) with type validation
 * @param animationType - The animation type to get default color for
 * @returns The default color for the specified animation type
 */
export function getDefaultAnimationColor(animationType: string): string {
    const defaults: Readonly<Record<string, string>> = {
        rain: '#4A9EFF',
        snow: '#FFFFFF',
        lightning: '#FFFFFF',
        wind: '#8FBC8F',
        clouds: '#FFFFFF',
        fog: '#E0E8F0',
        sun: '#FFD700',
        stars: '#FFFFFF'
    } as const;
    
    const color = defaults[animationType];
    if (!color) {
        console.warn(`Unknown animation type: ${animationType}, using white as fallback`);
        return '#FFFFFF';
    }
    
    return color;
}