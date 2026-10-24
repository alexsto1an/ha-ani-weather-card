import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/sun-tracker-card';
import { getMainCardStyles } from '../../src/styles/card';
import { getConfigEditorStyles } from '../../src/styles/editor';

const hass = (attrs: Record<string, unknown>) => ({
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'cloudy',
            attributes: { temperature: 15, humidity: 69, wind_speed: 16, pressure: 1008, temperature_unit: '°C', ...attrs },
        },
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
});

describe('metric arrows', () => {
    let card: HTMLElement & { setConfig(config: object): void; hass: unknown };

    beforeEach(async () => {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as typeof card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home' });
        card.hass = hass({ wind_bearing: 90 });
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
    });

    afterEach(() => {
        card.remove();
        vi.useRealTimers();
    });

    const arrow = () => card.querySelector('.attribute[data-kind="wind"] .wind-bearing-arrow') as HTMLElement | null;
    const trend = () => card.querySelector('.attribute[data-kind="pressure"] .pressure-trend') as HTMLElement | null;

    it('turns the wind arrow in place when the direction changes', () => {
        const first = arrow()!;
        expect(first.style.transform).toBe('rotate(270deg)');
        card.hass = hass({ wind_bearing: 200 });
        expect(arrow()).toBe(first);
        expect(first.style.transform).toBe('rotate(380deg)');
        expect(first.getAttribute('aria-label')).toBe('Wind from 200°');
    });

    it('drops the wind arrow when the bearing goes away, and brings it back', () => {
        card.hass = hass({});
        expect(arrow()).toBeNull();
        card.hass = hass({ wind_bearing: 10 });
        expect(arrow()!.getAttribute('icon')).toBe('mdi:navigation');
    });

    it('shows the pressure trend on live updates, and keeps it until the pressure moves again', () => {
        expect(trend()).toBeNull();
        card.hass = hass({ wind_bearing: 90, pressure: 1009 });
        expect(trend()!.classList.contains('rising')).toBe(true);
        expect(trend()!.getAttribute('icon')).toBe('mdi:arrow-top-right');
        // Something else changes: the trend stays
        card.hass = hass({ wind_bearing: 120, pressure: 1009 });
        expect(trend()!.classList.contains('rising')).toBe(true);
        // Small steps add up against the last reading that moved it
        card.hass = hass({ wind_bearing: 120, pressure: 1008.7 });
        expect(trend()!.classList.contains('rising')).toBe(true);
        card.hass = hass({ wind_bearing: 120, pressure: 1008.4 });
        expect(trend()!.classList.contains('falling')).toBe(true);
        expect(trend()!.getAttribute('icon')).toBe('mdi:arrow-bottom-right');
    });
});

describe('icon boxes', () => {
    // HA's ha-icon wraps the sized ha-svg-icon; sizing the wrapper to the
    // glyph keeps centring and the wind arrow's rotation on the glyph.
    const box = /ha-icon \{[^}]*display: inline-flex;[^}]*width: var\(--mdc-icon-size, 24px\);[^}]*height: var\(--mdc-icon-size, 24px\);/;

    it('sizes icon wrappers to their glyph in the card, the editor and the sun tracker', () => {
        expect(getMainCardStyles()).toMatch(new RegExp('animated-weather-card ' + box.source));
        expect(getConfigEditorStyles()).toMatch(new RegExp('\\.card-config ' + box.source));
        const tracker = document.createElement('animated-sun-tracker-card') as HTMLElement & { setConfig(c: object): void };
        tracker.setConfig({ sun_entity: 'sun.sun' });
        expect(tracker.shadowRoot!.querySelector('style')!.textContent).toMatch(box);
    });
});

describe('theme palette accents', () => {
    it('draws the weather card\'s icons in the theme\'s icon color', () => {
        const css = getMainCardStyles();
        expect(css).toMatch(/\.animated-weather-card\.theme-colors \{[^}]*--awc-icon-color: var\(--state-icon-color, var\(--primary-color\)\);/);
        expect(css).toMatch(/\.theme-colors \.attribute-icon,\s*\.animated-weather-card\.theme-colors \.indoor-icon \{\s*color: var\(--awc-icon-color\);/);
    });

    it('draws the hero temperature in the theme\'s primary color', () => {
        const css = getMainCardStyles();
        expect(css).toMatch(/\.animated-weather-card\.theme-colors \{[^}]*--awc-hero-color: var\(--primary-color, var\(--primary-text-color\)\);/);
        expect(css).toMatch(/\.animated-weather-card\.theme-colors \.temperature \{\s*color: var\(--awc-hero-color\);/);
    });
});
