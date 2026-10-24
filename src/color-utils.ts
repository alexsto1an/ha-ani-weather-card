// Color utility functions for Animated Weather Card

import { AnimatedWeatherCardConfig } from './types';
import { isValidColor } from './utils';

/** Match a 3- or 6-digit hex color, optionally prefixed with `#`. */
const HEX_COLOR_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;

/**
 * Generate custom color styles based on configuration
 */
export function generateCustomColorStyles(config: AnimatedWeatherCardConfig): string {
    // Set defaults for new options
    const colorPalette = config.color_palette || 'default';
    const customColors = config.custom_colors || {};

    // Apply custom colors if configured via inline style (most reliable method)
    // Only apply custom colors when NOT in theme mode
    let customColorStyles = '';

    if (colorPalette !== 'theme') {
        // Helper: convert validated hex to RGB. Returns null on bad input so
        // callers can short-circuit instead of producing #NaNNaNNaN garbage.
        const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
            if (typeof hex !== 'string' || !HEX_COLOR_RE.test(hex)) return null;
            let h = hex.replace('#', '');
            if (h.length === 3) {
                h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
            }
            const num = parseInt(h, 16);
            return {
                r: (num >> 16) & 255,
                g: (num >> 8) & 255,
                b: num & 255
            };
        };

        // Helper function to convert RGB to hex
        const rgbToHex = (r: number, g: number, b: number) => {
            return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
        };

        // Option 1: Aggressive darkening. Returns the input on bad hex.
        const darkenColor = (hex: string, percent: number): string => {
            const rgb = hexToRgb(hex);
            if (!rgb) return hex;
            const factor = 1 - (percent / 100);
            return rgbToHex(
                Math.max(0, Math.floor(rgb.r * factor)),
                Math.max(0, Math.floor(rgb.g * factor)),
                Math.max(0, Math.floor(rgb.b * factor))
            );
        };

        // Option 2: Lightening. Returns the input on bad hex.
        const lightenColor = (hex: string, percent: number): string => {
            const rgb = hexToRgb(hex);
            if (!rgb) return hex;
            const factor = percent / 100;
            return rgbToHex(
                Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor)),
                Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor)),
                Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor))
            );
        };

        // A custom background becomes a full sky: lighter overhead, the
        // chosen color through the middle, deeper at the horizon, with the
        // same scrim the built-in skies use so the metric row stays legible.
        // Only valid hex is accepted; bad YAML input would otherwise produce
        // `#NaNNaNNaN` CSS that browsers ignore.
        const addSky = (key: keyof typeof customColors, condition: string) => {
            const value = customColors[key];
            if (!value || typeof value !== 'string' || !HEX_COLOR_RE.test(value)) return;
            const top = lightenColor(value, 12);
            const bottom = darkenColor(value, 22);
            customColorStyles += `--weather-${condition}-background: `
                + `linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), `
                + `linear-gradient(180deg, ${top} 0%, ${value} 55%, ${bottom} 100%); `;
        };

        addSky('sunny_bg', 'sunny');
        addSky('rainy_bg', 'rainy');
        addSky('snowy_bg', 'snowy');
        addSky('stormy_bg', 'stormy');
        addSky('windy_bg', 'windy');
        addSky('cloudy_bg', 'cloudy');
    }

    // These can be applied regardless of color palette. Validate first to
    // avoid injecting arbitrary user-controlled CSS into the inline style.
    const setIfValid = (value: string | undefined, declaration: string) => {
        if (value && isValidColor(value)) customColorStyles += declaration.replace('${value}', value);
    };
    setIfValid(customColors.text_color, '--weather-text-color: ${value} !important; ');
    setIfValid(customColors.sun_color, '--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; ');
    setIfValid(customColors.rain_color, '--weather-rain-color: ${value} !important; ');
    setIfValid(customColors.snow_color, '--weather-snow-color: ${value} !important; ');

    return customColorStyles;
}