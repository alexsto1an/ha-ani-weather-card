import { describe, it, expect } from 'vitest';
import { escapeHtml, convertWindSpeedToKmh, formatLocalizedNumber, cardLocalize, getWeatherSettings, getWeatherClass } from '../../src/utils';

describe('escapeHtml', () => {
    it('returns empty string for null / undefined', () => {
        expect(escapeHtml(null)).toBe('');
        expect(escapeHtml(undefined)).toBe('');
    });

    it('escapes the five HTML-significant characters', () => {
        expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
        expect(escapeHtml('a & b')).toBe('a &amp; b');
        expect(escapeHtml('"hi"')).toBe('&quot;hi&quot;');
        expect(escapeHtml("it's")).toBe('it&#39;s');
    });

    it('coerces numbers to string', () => {
        expect(escapeHtml(42)).toBe('42');
        expect(escapeHtml(0)).toBe('0');
    });

    it('blocks an attribute-breakout payload', () => {
        // The exact attack the XSS fix in batch 1 was designed to stop —
        // a wind_speed_unit value crafted to break out of a value="…" attr.
        const payload = 'km/h"><img src=x onerror=alert(1)>';
        const result = escapeHtml(payload);
        expect(result).not.toContain('"');
        expect(result).not.toContain('<img');
        expect(result).toContain('&quot;');
    });
});

describe('convertWindSpeedToKmh', () => {
    it('passes km/h through unchanged', () => {
        expect(convertWindSpeedToKmh(15, 'km/h')).toBe(15);
        expect(convertWindSpeedToKmh(15, 'kmh')).toBe(15);
        expect(convertWindSpeedToKmh(15, 'kph')).toBe(15);
    });

    it('converts m/s to km/h', () => {
        expect(convertWindSpeedToKmh(10, 'm/s')).toBeCloseTo(36, 5);
    });

    it('converts mph to km/h', () => {
        expect(convertWindSpeedToKmh(10, 'mph')).toBeCloseTo(16.09344, 5);
    });

    it('converts knots to km/h', () => {
        expect(convertWindSpeedToKmh(10, 'kn')).toBeCloseTo(18.52, 2);
        expect(convertWindSpeedToKmh(10, 'kt')).toBeCloseTo(18.52, 2);
        expect(convertWindSpeedToKmh(10, 'knots')).toBeCloseTo(18.52, 2);
    });

    it('converts ft/s to km/h', () => {
        expect(convertWindSpeedToKmh(10, 'ft/s')).toBeCloseTo(10.9728, 4);
    });

    it('converts a Beaufort force to km/h, by the scale\'s formula', () => {
        expect(convertWindSpeedToKmh(0, 'Beaufort')).toBe(0);
        expect(convertWindSpeedToKmh(4, 'Beaufort')).toBeCloseTo(24.08, 1);
        expect(convertWindSpeedToKmh(12, 'bft')).toBeCloseTo(125.1, 0);
    });

    it('falls back to km/h on unknown unit', () => {
        expect(convertWindSpeedToKmh(15, 'banana')).toBe(15);
        expect(convertWindSpeedToKmh(15, undefined)).toBe(15);
    });

    it('returns 0 for non-finite input', () => {
        expect(convertWindSpeedToKmh(NaN, 'km/h')).toBe(0);
        expect(convertWindSpeedToKmh(Infinity, 'km/h')).toBe(0);
    });
});

describe('formatLocalizedNumber', () => {
    it('formats integers with no decimal separator', () => {
        expect(formatLocalizedNumber(16, { language: 'en-US' })).toBe('16');
    });

    it('uses comma decimal for European locales', () => {
        // de-DE uses comma as decimal separator
        expect(formatLocalizedNumber(29.92, { language: 'de-DE' }, 2)).toBe('29,92');
    });

    it('uses period decimal for en-US', () => {
        expect(formatLocalizedNumber(29.92, { language: 'en-US' }, 2)).toBe('29.92');
    });

    it('returns "--" for non-finite input', () => {
        expect(formatLocalizedNumber(NaN)).toBe('--');
        expect(formatLocalizedNumber(Infinity)).toBe('--');
    });

    it('falls back to navigator language when hass omitted', () => {
        // jsdom defaults to en-US; just assert we got a parseable result.
        expect(formatLocalizedNumber(42)).toBe('42');
    });
});

describe('cardLocalize', () => {
    it('returns the fallback when hass is undefined', () => {
        expect(cardLocalize(undefined, 'ui.foo.bar', 'Default')).toBe('Default');
    });

    it('returns the fallback when localize throws', () => {
        const hass = {
            localize: () => {
                throw new Error('boom');
            },
        };
        expect(cardLocalize(hass, 'ui.foo.bar', 'Default')).toBe('Default');
    });

    it('returns the fallback when localize returns the key unchanged', () => {
        // HA returns the key itself when a translation is missing.
        const hass = { localize: (k: string) => k };
        expect(cardLocalize(hass, 'ui.foo.bar', 'Default')).toBe('Default');
    });

    it('returns the localized value when available', () => {
        const hass = { localize: (_k: string) => 'Luftfeuchtigkeit' };
        expect(cardLocalize(hass, 'ui.card.weather.attributes.humidity', 'Humidity'))
            .toBe('Luftfeuchtigkeit');
    });
});

describe('engine settings', () => {
    const settings = (engine: Record<string, number>) => getWeatherSettings({ entity: 'weather.home', engine_settings: engine });

    it('accepts everything the editor sliders offer', () => {
        expect(settings({ rainCount: 0.5 }).rainCount).toBe(0.5);
        expect(settings({ snowCount: 0.5 }).snowCount).toBe(0.5);
        expect(settings({ leafCount: 3 }).leafCount).toBe(3);
        // The Cloud size slider (0.5–2×) used to be rejected outright
        expect(settings({ cloudBaseSize: 0.5 }).cloudBaseSize).toBe(0.5);
        expect(settings({ cloudBaseSize: 2 }).cloudBaseSize).toBe(2);
    });

    it('falls back to the default for values out of range', () => {
        expect(settings({ cloudBaseSize: 100 }).cloudBaseSize).toBe(1);
        expect(settings({ rainCount: 50 }).rainCount).toBe(1);
        expect(settings({ rainCount: 0 }).rainCount).toBe(1);
    });
});

describe('weather condition mapping', () => {
    const cls = (state: string) => getWeatherClass(state, false);

    it('maps Home Assistant states to a sky and its weather', () => {
        expect(cls('partlycloudy')).toBe('partly-cloudy');
        expect(cls('lightning-rainy')).toBe('stormy');
        expect(cls('windy-variant')).toBe('windy');
        expect(cls('fog')).toBe('foggy');
        expect(cls('snowy-rainy')).toBe('snowy-rainy');
        expect(cls('pouring')).toBe('pouring');
    });

    it('shows hail as sleet rather than a clear sky', () => {
        expect(cls('hail')).toBe('sleety');
    });
});
