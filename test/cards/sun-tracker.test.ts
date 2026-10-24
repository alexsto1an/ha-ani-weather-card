import { describe, it, expect } from 'vitest';
import { pathElevation, detailColumns } from '../../src/sun-tracker-card';
import { skyPhaseFromSun, skyColors } from '../../src/sky';

describe('sun path', () => {
    const rise = 6.5;
    const set = 19.25;

    it('crosses the horizon exactly at sunrise and sunset', () => {
        expect(pathElevation(rise, rise, set)).toBeCloseTo(0, 6);
        expect(pathElevation(set, rise, set)).toBeCloseTo(0, 6);
    });

    it('peaks at solar noon and bottoms out at solar midnight', () => {
        const noon = (rise + set) / 2;
        expect(pathElevation(noon, rise, set)).toBeCloseTo(1, 6);
        const midnight = (set + (24 - (set - rise)) / 2) % 24;
        expect(pathElevation(midnight, rise, set)).toBeCloseTo(-1, 6);
    });

    it('is above the horizon by day and below it at night, including past midnight', () => {
        expect(pathElevation(12, rise, set)).toBeGreaterThan(0);
        expect(pathElevation(22, rise, set)).toBeLessThan(0);
        expect(pathElevation(2, rise, set)).toBeLessThan(0);
    });

    it('stays flat for polar day or night instead of throwing', () => {
        expect(pathElevation(12, 0, 24)).toBe(0);
        expect(pathElevation(12, 10, 10)).toBe(0);
    });
});

describe('detail columns', () => {
    const width = (cols: number) => cols * 124 + (cols - 1) * 16;

    it('takes as many columns as fit, never fewer than two', () => {
        expect(detailColumns(6, 337)).toBe(2); // a phone
        expect(detailColumns(6, 500)).toBe(3); // the 540 px card
        expect(detailColumns(6, 824)).toBe(6); // a wall panel: one row
        expect(detailColumns(6, 200)).toBe(2);
    });

    it('evens the rows out instead of leaving one detail alone', () => {
        expect(detailColumns(6, 700)).toBe(3); // 3 + 3, not 5 + 1
        expect(detailColumns(4, 500)).toBe(2); // 2 + 2, not 3 + 1
        expect(detailColumns(5, 500)).toBe(3); // 3 + 2
        expect(detailColumns(4, 824)).toBe(4);
    });

    it('never leaves one detail on a row of its own where three columns fit', () => {
        for (let count = 3; count <= 6; count++) {
            for (let w = 260; w <= 860; w += 2) {
                const cols = detailColumns(count, w);
                // Every column is at least 124 px, except the two-column floor
                if (cols > 2) expect(width(cols)).toBeLessThanOrEqual(w);
                const last = count % cols || cols;
                if (w >= width(3)) expect(last, `${count} details at ${w} px`).toBeGreaterThan(1);
            }
        }
    });
});

describe('sun tracker card', () => {
    type Tracker = HTMLElement & { setConfig(config: object): void; hass: unknown };
    const sunHass = (elevation: number, rising = false) => ({
        states: {
            'sun.sun': {
                entity_id: 'sun.sun',
                state: elevation >= 0 ? 'above_horizon' : 'below_horizon',
                attributes: {
                    elevation, rising,
                    next_rising: '2026-10-14T05:41:00Z', next_setting: '2026-10-13T17:12:00Z',
                    next_dawn: '2026-10-14T05:12:00Z', next_dusk: '2026-10-13T17:41:00Z',
                    next_noon: '2026-10-14T11:27:00Z',
                },
            },
        },
        localize: () => '',
        language: 'en',
    });

    function mount(config: object = {}): Tracker {
        const tracker = document.createElement('animated-sun-tracker-card') as Tracker;
        tracker.setConfig({ sun_entity: 'sun.sun', ...config });
        document.body.appendChild(tracker);
        return tracker;
    }
    const card = (tracker: Tracker) => tracker.shadowRoot!.querySelector('.st-card') as HTMLElement;

    it('keeps its card element across updates, so the sky cross-fades', () => {
        const tracker = mount();
        tracker.hass = sunHass(30);
        const first = card(tracker);
        const daySky = first.style.getPropertyValue('--awc-sky-top');
        expect(daySky).toMatch(/^#[0-9a-f]{6}$/);

        tracker.hass = sunHass(2);
        expect(card(tracker)).toBe(first);
        expect(first.style.getPropertyValue('--awc-sky-top')).not.toBe(daySky);
        tracker.remove();
    });

    it('uses the theme without a sky of its own', () => {
        const tracker = mount({ color_palette: 'theme' });
        tracker.hass = sunHass(30);
        expect(card(tracker).classList.contains('sky')).toBe(false);
        expect(card(tracker).style.getPropertyValue('--awc-sky-top')).toBe('');
        tracker.remove();
    });

    it('takes its accents from the theme: primary color, icon color and HA\'s sun color', () => {
        const tracker = mount({ color_palette: 'theme' });
        tracker.hass = sunHass(30);
        const css = tracker.shadowRoot!.querySelector('style')!.textContent!;
        expect(css).toMatch(/--st-path: var\(--primary-color\);/);
        expect(css).toMatch(/--st-hero: var\(--primary-color, var\(--primary-text-color\)\);/);
        expect(css).toMatch(/\.st-card:not\(\.sky\) \.st-time \{\s*color: var\(--st-hero\);/);
        expect(css).toMatch(/--st-day-fill: var\(--primary-color\);/);
        expect(css).toMatch(/\.st-card:not\(\.sky\) \.st-metric-label ha-icon \{\s*color: var\(--st-icon\);/);
        expect(css).toMatch(/--st-icon: var\(--state-icon-color, var\(--primary-color\)\);/);
        expect(css).toMatch(/\.st-card:not\(\.sky\) \.st-dot \{[^}]*background: var\(--state-sun-above_horizon-color/);
        expect(css).toMatch(/\.st-card:not\(\.sky\) \.st-dot\.below \{[^}]*background: var\(--st-path-night\);/);
        tracker.remove();
    });

    it('speaks the dashboard language, its clock and HA\'s moon phase names', () => {
        const tracker = mount({ moon_entity: 'sensor.moon_phase' });
        const base = sunHass(30);
        tracker.hass = {
            ...base,
            states: { ...base.states, 'sensor.moon_phase': { entity_id: 'sensor.moon_phase', state: 'waxing_gibbous', attributes: {} } },
            language: 'de',
            locale: { language: 'de', time_format: '24' },
            formatEntityState: (e: { state: string }) => (e.state === 'waxing_gibbous' ? 'Zunehmender Mond' : e.state),
        };
        const root = tracker.shadowRoot!;
        const label = (kind: string) => root.querySelector(`.st-metric[data-kind="${kind}"] .st-metric-label span`)!.textContent;
        expect(root.querySelector('.st-eyebrow span')!.textContent).toBe('Sonnenuntergang');
        expect(label('noon')).toBe('Sonnenhöchststand');
        expect(root.querySelector('.st-metric[data-kind="moon"] .st-metric-value')!.textContent).toBe('Zunehmender Mond');
        expect(root.querySelector('.st-time')!.textContent).toMatch(/^\d{2}:\d{2}$/);
        expect(root.querySelector('.st-countdown')?.textContent ?? 'in ').toMatch(/^in /);
        tracker.remove();
    });

    it('names a real mdi icon for every moon phase', () => {
        const tracker = mount({ moon_entity: 'sensor.moon_phase' });
        const icon = (state: string) => {
            const base = sunHass(30);
            tracker.hass = { ...base, states: { ...base.states, 'sensor.moon_phase': { entity_id: 'sensor.moon_phase', state, attributes: {} } } };
            return tracker.shadowRoot!.querySelector('.st-metric[data-kind="moon"] ha-icon')!.getAttribute('icon');
        };
        expect(icon('new_moon')).toBe('mdi:moon-new');
        expect(icon('full_moon')).toBe('mdi:moon-full');
        expect(icon('waxing_gibbous')).toBe('mdi:moon-waxing-gibbous');
        expect(icon('last_quarter')).toBe('mdi:moon-last-quarter');
        tracker.remove();
    });

    it('re-renders when only the language changes', () => {
        const tracker = mount();
        tracker.hass = sunHass(30);
        expect(tracker.shadowRoot!.querySelector('.st-eyebrow span')!.textContent).toBe('Sunset');
        tracker.hass = { ...sunHass(30), language: 'fr', locale: { language: 'fr', time_format: '24' } };
        expect(tracker.shadowRoot!.querySelector('.st-eyebrow span')!.textContent).toBe('Coucher du soleil');
        tracker.remove();
    });

    it('sets its details\' columns as it fits', () => {
        const tracker = mount({ moon_entity: 'sensor.moon_phase' });
        tracker.hass = sunHass(30);
        const metrics = tracker.shadowRoot!.querySelector('.st-metrics') as HTMLElement;
        expect(metrics.style.getPropertyValue('--st-cols')).toBe('2');
        tracker.remove();
    });

    it('compacts to one line: the headline beside the sun path, no details', () => {
        const tracker = mount({ compact: true, moon_entity: 'sensor.moon_phase' });
        tracker.hass = sunHass(30);
        const root = tracker.shadowRoot!;
        expect(card(tracker).classList.contains('compact')).toBe(true);
        expect(root.querySelector('.st-time')).not.toBeNull();
        expect(root.querySelector('.st-chart svg')).not.toBeNull();
        expect(root.querySelector('.st-metrics')).toBeNull();
        // The other event, small, beside the path
        expect(root.querySelector('.st-chart-note')!.textContent).toMatch(/^Sunrise/);
        const t = tracker as unknown as { getGridOptions(): { rows: number; min_rows: number }; getCardSize(): number };
        expect(t.getGridOptions()).toMatchObject({ rows: 2, min_rows: 1 });
        expect(t.getCardSize()).toBe(2);
        tracker.remove();
    });

    it('shares the sky of a weather entity, and follows it', () => {
        const tracker = mount({ compact: true, weather_entity: 'weather.home' });
        const withWeather = (state: string) => {
            const base = sunHass(30);
            return { ...base, states: { ...base.states, 'weather.home': { entity_id: 'weather.home', state, attributes: {} } } };
        };
        tracker.hass = withWeather('rainy');
        expect(card(tracker).style.getPropertyValue('--awc-sky-top')).toBe(skyColors('rainy', 'day').top);
        tracker.hass = withWeather('cloudy');
        expect(card(tracker).style.getPropertyValue('--awc-sky-top')).toBe(skyColors('cloudy', 'day').top);
        tracker.remove();
    });

    it('keeps a clear sky without a weather entity', () => {
        const tracker = mount();
        tracker.hass = sunHass(30);
        expect(card(tracker).style.getPropertyValue('--awc-sky-top')).toBe(skyColors('sunny', 'day').top);
        tracker.remove();
    });

    it('changes phase at the same elevations as the weather card', () => {
        expect(skyPhaseFromSun(-6.1, true, false)).toBe('night');
        expect(skyPhaseFromSun(-5.9, true, false)).toBe('dawn');
        expect(skyPhaseFromSun(5.9, false, true)).toBe('dusk');
        expect(skyPhaseFromSun(6, false, true)).toBe('day');
        expect(skyPhaseFromSun(null, false, false)).toBe('night');
    });
});
