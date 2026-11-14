import { describe, it, expect } from 'vitest';
import { pathElevation, detailColumns } from '../../src/sun-tracker-card';
import { skyPhaseFromSun, skyColors } from '../../src/sky';
import { sendHour } from '../../src/hour-link';
import { shareWeather } from '../../src/weather-share';
// The forecast bundle moves a tracker that follows a needle
import '../../src/animated-weather-card-forecast';
import { hourOfDay } from '../../src/localize';

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
        expect(css).toMatch(/\.st-card:not\(\.sky\) \.st-metric-label \.awc-icon \{\s*color: var\(--st-icon\);/);
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

    it('draws each of the eight moon phases, and the rest of its icons, from the Senja set', () => {
        const tracker = mount({ moon_entity: 'sensor.moon_phase' });
        const root = tracker.shadowRoot!;
        const phases = ['new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'];
        const drawn = phases.map(state => {
            const base = sunHass(30);
            tracker.hass = { ...base, states: { ...base.states, 'sensor.moon_phase': { entity_id: 'sensor.moon_phase', state, attributes: {} } } };
            const svg = root.querySelector('.st-metric[data-kind="moon"] svg.awc-icon')!;
            expect(svg.getAttribute('viewBox')).toBe('0 0 25 25');
            return [svg.getAttribute('data-icon'), svg.querySelector('path')!.getAttribute('d')];
        });
        expect(drawn.map(d => d[0])).toEqual(phases.map(p => 'moon-' + p.replace(/_moon$/, '').replace(/_/g, '-')));
        // Eight different drawings, none empty
        expect(new Set(drawn.map(d => d[1])).size).toBe(8);
        expect(root.querySelector('ha-icon')).toBeNull();
        const kinds = [...root.querySelectorAll('.st-metric')].map(m => [m.getAttribute('data-kind'), m.querySelector('svg')!.getAttribute('data-icon')]);
        expect(kinds).toEqual(expect.arrayContaining([['noon', 'noon'], ['daylight', 'daylight'], ['first-light', 'first-light'], ['last-light', 'last-light']]));
        expect(root.querySelector('.st-eyebrow svg.awc-icon')!.getAttribute('data-icon')).toMatch(/^sun(rise|set)$/);
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

    it('without a weather entity, shares the sky of the first weather card on its sun, from the start and as cards come and go', () => {
        const base = sunHass(30);
        const hass = { ...base, states: { ...base.states,
            'weather.home': { entity_id: 'weather.home', state: 'rainy', attributes: {} },
            'weather.away': { entity_id: 'weather.away', state: 'snowy', attributes: {} } } };
        const top = (t: Tracker) => card(t).style.getPropertyValue('--awc-sky-top');
        const first = {}, second = {}, elsewhere = {};
        shareWeather(elsewhere, 'weather.away', 'sun.elsewhere');
        shareWeather(first, 'weather.home', 'sun.sun');
        const tracker = mount();
        tracker.hass = hass;
        // At rest, the weather card's sky, as it is while that card is dragged
        expect(top(tracker)).toBe(skyColors('rainy', 'day').top);
        // A second card on its sun doesn't take it over; the first one leaving hands it on
        shareWeather(second, 'weather.away', 'sun.sun');
        expect(top(tracker)).toBe(skyColors('rainy', 'day').top);
        shareWeather(first);
        expect(top(tracker)).toBe(skyColors('snowy', 'day').top);
        // Its own weather entity wins
        const own = mount({ weather_entity: 'weather.home' });
        own.hass = hass;
        expect(top(own)).toBe(skyColors('rainy', 'day').top);
        // The needle's sky comes only from the weather it shows
        const sky = { top: '#101820', mid: '#203040', bottom: '#304050', glow: '#000000', scrim: '#000000' };
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: Date.now() + 3600_000, temperature: 14, sky });
        expect(top(tracker)).toBe(skyColors('snowy', 'day').top);
        sendHour({ source: document.createElement('div'), entity: 'weather.away', sun: 'sun.sun', at: Date.now() + 3600_000, temperature: 14, sky });
        expect(top(tracker)).toBe('#101820');
        sendHour({ source: document.createElement('div'), entity: 'weather.away', sun: 'sun.sun', at: null, temperature: null, sky: null });
        // None left on its sun: a clear sky
        shareWeather(second);
        expect(top(tracker)).toBe(skyColors('sunny', 'day').top);
        shareWeather(elsewhere);
        tracker.remove();
        own.remove();
    });

    it('changes phase at the same elevations as the weather card', () => {
        expect(skyPhaseFromSun(-6.1, true, false)).toBe('night');
        expect(skyPhaseFromSun(-5.9, true, false)).toBe('dawn');
        expect(skyPhaseFromSun(5.9, false, true)).toBe('dusk');
        expect(skyPhaseFromSun(6, false, true)).toBe('day');
        expect(skyPhaseFromSun(null, false, false)).toBe('night');
    });

    it('follows a weather card\'s needle on the same sun, and comes home with it', () => {
        const tracker = mount({ weather_entity: 'weather.home' });
        tracker.hass = { ...sunHass(30), states: { ...sunHass(30).states, 'weather.home': { entity_id: 'weather.home', state: 'sunny', attributes: {} } } };
        const st = card(tracker);
        const dot = () => st.querySelector('.st-dot') as HTMLElement;
        const before = dot().style.left;
        const source = document.createElement('div');
        // An hour after sunset: the sun below the horizon
        const at = Date.parse('2026-10-13T18:12:00Z');
        const sky = { top: '#101820', mid: '#203040', bottom: '#304050', glow: 'rgba(1, 2, 3, 0.5)', scrim: 'rgba(0, 0, 0, 0.2)' };
        sendHour({ source, entity: 'weather.home', sun: 'sun.sun', at, temperature: 14, sky });
        expect(st.classList.contains('following')).toBe(true);
        expect(dot().style.left).toBe(`${((hourOfDay(new Date(at)) / 24) * 100).toFixed(2)}%`);
        expect(dot().classList.contains('below')).toBe(true);
        expect(st.style.getPropertyValue('--awc-sky-top')).toBe('#101820');
        // The headline stays on the real next sunrise or sunset, as the weather card's own sunset reading does
        expect(st.querySelector('.st-eyebrow span')?.textContent).toBe('Sunset');
        // The minute's render keeps the needle's hour
        tracker.hass = { ...sunHass(31), states: { ...sunHass(31).states, 'weather.home': { entity_id: 'weather.home', state: 'sunny', attributes: {} } } };
        expect(card(tracker).querySelector('.st-dot')?.classList.contains('below')).toBe(true);
        // Another sun is another tracker's
        sendHour({ source, entity: 'weather.home', sun: 'sun.elsewhere', at: at + 6 * 3600_000, temperature: 14, sky });
        expect(dot().classList.contains('below')).toBe(true);
        // Home
        sendHour({ source, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
        expect(st.classList.contains('following')).toBe(false);
        expect(dot().style.left).toBe(before);
        expect(st.style.getPropertyValue('--awc-sky-top')).not.toBe('#101820');
        tracker.remove();
    });

    it('takes the needle\'s sky from its own weather, or from any card on its sun when it has none, never another weather\'s', () => {
        const sky = { top: '#101820', mid: '#203040', bottom: '#304050', glow: '#000000', scrim: '#000000' };
        // No weather of its own: the dragged card's sky, colour only
        const plain = mount();
        plain.hass = sunHass(30);
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: Date.now() + 3600_000, temperature: 14, sky });
        expect(card(plain).classList.contains('following')).toBe(true);
        expect(card(plain).style.getPropertyValue('--awc-sky-top')).toBe('#101820');
        plain.remove();
        // Another weather's needle moves its sun, not its sky
        const tracker = mount({ weather_entity: 'weather.elsewhere' });
        tracker.hass = sunHass(30);
        const st = card(tracker);
        const own = st.style.getPropertyValue('--awc-sky-top');
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: Date.now() + 3600_000, temperature: 14, sky });
        expect(st.classList.contains('following')).toBe(true);
        expect(st.style.getPropertyValue('--awc-sky-top')).toBe(own);
        tracker.remove();
        // Gone from the page, it stops listening
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
    });

    it('runs right to left south of the equator, or the way it\'s told, its path, twilight, now line and sun mirrored', () => {
        const at = (latitude?: number) => ({ ...sunHass(30), config: latitude === undefined ? {} : { latitude } });
        const read = (tracker: Tracker) => {
            const st = card(tracker);
            const line = st.querySelector('.st-now-line')!;
            const path = st.querySelector('.st-path-day')!.getAttribute('d')!;
            return {
                dot: parseFloat((st.querySelector('.st-dot') as HTMLElement).style.left),
                line: parseFloat(line.getAttribute('x1')!),
                // Midnight starts the path: at the left edge, or the right one
                start: parseFloat(path.slice(1)),
                rise: parseFloat(st.querySelector('.st-twilight')!.getAttribute('cx')!),
                fill: st.querySelector('.st-day-fill')!.getAttribute('d')!.slice(-24),
            };
        };
        const north = mount();
        north.hass = at(52.4);
        const ltr = read(north);
        expect(ltr.start).toBe(0);
        north.remove();
        for (const [config, latitude] of [[{}, -33.9], [{ direction: 'right_to_left' }, 52.4], [{ direction: 'auto' }, -0.5]] as const) {
            const tracker = mount(config);
            tracker.hass = at(latitude);
            const rtl = read(tracker);
            expect(rtl.start, JSON.stringify(config)).toBe(1000);
            expect(rtl.dot).toBeCloseTo(100 - ltr.dot, 1);
            expect(rtl.line).toBeCloseTo(1000 - ltr.line, 0);
            expect(rtl.rise).toBeCloseTo(1000 - ltr.rise, 0);
            // The day's fill closes along the horizon from the path's end back to its start
            expect(rtl.fill).toMatch(/L0,\d+ L1000,\d+ Z$/);
            tracker.remove();
        }
        // Told left to right, a southern tracker keeps it; without a latitude, left to right
        for (const [config, latitude] of [[{ direction: 'left_to_right' }, -33.9], [{}, undefined]] as const) {
            const tracker = mount(config);
            tracker.hass = at(latitude);
            expect(read(tracker).start).toBe(0);
            expect(read(tracker).dot).toBeCloseTo(ltr.dot, 1);
            tracker.remove();
        }
    });

    it('follows a needle the way its path runs', () => {
        const tracker = mount({ direction: 'right_to_left' });
        tracker.hass = sunHass(30);
        const st = card(tracker);
        const at = Date.parse('2026-10-13T18:12:00Z');
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at, temperature: 14, sky: null });
        const frac = hourOfDay(new Date(at)) / 24;
        expect((st.querySelector('.st-dot') as HTMLElement).style.left).toBe(`${((1 - frac) * 100).toFixed(2)}%`);
        expect(parseFloat(st.querySelector('.st-now-line')!.getAttribute('x1')!)).toBeCloseTo((1 - frac) * 1000, 0);
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
        tracker.remove();
    });

});

describe('the tracker in the profile\'s time zone', () => {
    it('puts the sun where its headline says, in the server\'s zone when the profile asks for it', async () => {
        const { vi } = await import('vitest');
        vi.useFakeTimers({ now: new Date('2026-11-10T03:00:00Z') });  // 12:00 in Tokyo
        await import('../../src/sun-tracker-card');
        const card = document.createElement('animated-sun-tracker-card') as HTMLElement & { setConfig(c: object): void; hass: unknown };
        card.setConfig({ sun_entity: 'sun.sun' });
        document.body.append(card);
        card.hass = {
            states: { 'sun.sun': { entity_id: 'sun.sun', state: 'above_horizon', attributes: {
                next_rising: '2026-11-10T21:10:00Z', next_setting: '2026-11-10T07:40:00Z', elevation: 35, rising: false,
            } } },
            config: { time_zone: 'Asia/Tokyo' },
            language: 'en',
            locale: { language: 'en', time_format: '24', time_zone: 'server' },
            localize: () => '',
        };
        const root = card.shadowRoot!;
        // 16:40 Tokyo is the sunset the headline shows; noon in Tokyo is half the chart's width
        expect(root.querySelector('.st-time')!.textContent).toBe('16:40');
        expect(parseFloat((root.querySelector('.st-dot') as HTMLElement).style.left)).toBeCloseTo(50, 0);
        card.remove();
        vi.useRealTimers();
    });
});
