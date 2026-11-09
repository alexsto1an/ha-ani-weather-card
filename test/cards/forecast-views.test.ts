import { describe, it, expect, afterEach, vi } from 'vitest';
import { FORECAST_VIEWS, sentenceLines, modelFor } from '../../src/forecast-views';
import { monotonePath, lineChart, wetBands } from '../../src/forecast-line';
import { hourWindows, tokens, fitWords } from '../../src/forecast-parts';
import type { ForecastContext, PopupContext } from '../../src/forecast-views-api';

const HOUR = 3600_000;
const NOW = Date.parse('2026-11-10T11:10:00Z');
const TAGS = '"><img src=x onerror="alert(1)">';

/** UTC, 24-hour, English: the labels the tests read are fixed */
const hass = (states: Record<string, any> = {}) => ({
    language: 'en',
    locale: { language: 'en', time_format: '24', time_zone: 'server' },
    config: { time_zone: 'UTC' },
    states,
    localize: () => '',
    formatEntityState: (s: { state: string }) => ({ sunny: 'Sunny', rainy: 'Rainy', cloudy: 'Cloudy', partlycloudy: 'Partly cloudy' } as Record<string, string>)[s.state] ?? s.state,
}) as any;

/** Twelve hours: dry until 15:00, rain 15:00–17:00 at 80%, then dry and cooling */
function hours(extra: Partial<Record<string, unknown>> = {}) {
    const start = Math.floor(NOW / HOUR) * HOUR;
    return Array.from({ length: 24 }, (_, i) => {
        const t = start + i * HOUR;
        const h = new Date(t).getUTCHours();
        const wet = h >= 15 && h < 17;
        return { datetime: new Date(t).toISOString(), condition: wet ? 'rainy' : 'cloudy', temperature: 14 + Math.round(4 * Math.sin((h - 9) / 24 * 2 * Math.PI)), precipitation_probability: wet ? 80 : 10, ...extra };
    });
}
const days = ['2026-11-10', '2026-11-11', '2026-11-12', '2026-11-13'].map((d, i) => ({ datetime: `${d}T12:00:00Z`, condition: i === 1 ? 'rainy' : 'sunny', temperature: 18 + i, templow: 8 + i, precipitation_probability: i === 1 ? 80 : 0 }));

const ctx = (over: Partial<ForecastContext> = {}): ForecastContext => ({
    hass: hass(), entityId: 'weather.home', hourly: hours(), daily: days, dailyType: 'daily',
    current: 14, unit: '°C', now: NOW, condition: 'cloudy', phase: 'day', theme: false, width: 313, show: 'hourly', ...over,
});

afterEach(() => {
    document.body.replaceChildren();
    document.documentElement.style.overflow = '';
});

describe('the forecast in words', () => {
    it('says when the rain comes and how likely, then the other thing worth saying', () => {
        const c = ctx();
        const lines = sentenceLines(modelFor(c), c);
        expect(lines[0]).toBe('Rain 15:00–17:00 · 80%');
        expect(lines).toHaveLength(2);
    });

    it('says it holds steady when nothing changes by 2° and nothing falls', () => {
        const flat = hours({ temperature: 14, condition: 'cloudy', precipitation_probability: 0 });
        const c = ctx({ hourly: flat });
        expect(sentenceLines(modelFor(c), c)).toEqual([expect.stringMatching(/^Steady until /)]);
    });

    it('marks a band under way from now, and bridges a single dry hour, so the words don\'t flicker', () => {
        const start = Math.floor(NOW / HOUR) * HOUR;
        // Rain 11:00–14:00, dry at 14:00, rain again 15:00–17:00
        const raining = hours().map((e, i) => i < 3 ? { ...e, condition: 'rainy', precipitation_probability: 90 } : e);
        const bands = wetBands(raining, NOW, NOW + 12 * HOUR);
        expect(bands).toHaveLength(1);
        expect(bands[0].start).toBe(NOW);
        expect(bands[0].end).toBe(start + 6 * HOUR);
    });

    it('names a wet run once, where it starts, and Dry where it stops', () => {
        const windows = hourWindows(hours() as any, NOW, 5, 2, hass());
        const marks = tokens(windows, false, hass());
        expect(marks.map(t => t.text)).toEqual(['Rain 80%', 'Dry']);
        expect(marks[0].span).toBe(marks[1].column - marks[0].column);
    });

    it('starts the columns on the step\'s grid, at least 20 minutes ahead, never on the hour under way', () => {
        const windows = hourWindows(hours() as any, NOW, 5, 3, hass());
        expect(windows.map(w => w.label)).toEqual(['12:00', '15:00', '18:00', '21:00', 'Wed']);
    });
});

describe('the line', () => {
    it('never overshoots its points: the drawn high is the data\'s high', () => {
        const d = monotonePath([{ x: 0, y: 50 }, { x: 10, y: 10 }, { x: 20, y: 10 }, { x: 30, y: 40 }]);
        const ys = [...d.matchAll(/[ ,](-?[\d.]+)(?= |$)/g)].map(m => Number(m[1]));
        // Control points stay within the data's range (10–50)
        for (const y of ys) {
            expect(y).toBeGreaterThanOrEqual(10 - 0.01);
            expect(y).toBeLessThanOrEqual(50 + 0.01);
        }
    });

    it('labels the rain band and describes everything for a screen reader', () => {
        const line = lineChart({ hass: hass(), hours: hours() as any, now: NOW, current: 14, unit: '°C', width: 313, windowHours: 12,
            lanes: { top: 16, gap: 3, amp: 30, bottom: 16 }, groundBelow: 10, dot: [7, 7], maxBands: 2, bandDetail: true, size: 'sm' });
        expect(line.html).toContain('Rain 15:00–17:00 · 80%');
        expect(line.summary).toMatch(/Rain 15:00–17:00, 80% chance/);
        expect(line.html).toContain('role="img"');
    });
});

describe('the weather card\'s forecast', () => {
    it('names its levels for the fit: whole, fewer days, without the days, the short form', () => {
        const host = document.createElement('div');
        host.innerHTML = FORECAST_VIEWS.renderSection(ctx({ show: 'both', variant: 'a' }));
        const section = host.firstElementChild as HTMLElement;
        expect(section.dataset.full).toBe('full');
        expect(section.dataset.trims).toBe('d2');
        expect(section.dataset.first).toBe('first');
        expect(section.dataset.short).toBe('short');
        // The days start tomorrow: today's high and low are the hero's
        expect([...host.querySelectorAll('.awc-day-name')].map(e => e.textContent)).toEqual(['Wed', 'Thu', 'Fri']);
    });

    it('draws the days in the line\'s place when there are no hours', () => {
        const host = document.createElement('div');
        host.innerHTML = FORECAST_VIEWS.renderSection(ctx({ hourly: null, variant: 'c' }));
        expect(host.querySelector('.awc-line')).toBeNull();
        expect(host.querySelectorAll('.awc-days > li').length).toBeGreaterThan(0);
    });

    it('gives today\'s high and low only from a day, widened to the reading now', () => {
        expect(FORECAST_VIEWS.renderHighLow(ctx({ current: 21 }), 'stack')).toContain('21°');
        expect(FORECAST_VIEWS.renderHighLow(ctx({ daily: null, dailyType: null }), 'stack')).toBe('');
    });

    it('drops a word\'s chance before it would be cut, and never cuts it', () => {
        const el = document.createElement('span');
        el.className = 'awc-hour-token';
        el.dataset.short = 'Rain';
        el.dataset.chance = '80%';
        el.textContent = 'Rain 80%';
        document.body.append(el);
        let width = 30;
        Object.defineProperty(el, 'clientWidth', { get: () => width });
        Object.defineProperty(el, 'scrollWidth', { get: () => (el.textContent?.length ?? 0) * 6 });
        fitWords(document.body);
        expect(el.textContent).toBe('Rain');
        width = 20;
        fitWords(document.body);
        expect(el.textContent).toBe('80%');
    });
});

describe('the forecast pop-up', () => {
    const open = (over: Partial<PopupContext> = {}) => {
        const back = document.createElement('button');
        document.body.append(back);
        const openMoreInfo = vi.fn();
        const close = FORECAST_VIEWS.openPopup({ ...ctx(), returnFocus: back, note: 'Rain by three.', still: true, openMoreInfo, ...over });
        const root = document.querySelector('awc-forecast-popup')!.shadowRoot!;
        return { root, back, close, openMoreInfo };
    };

    it('opens a modal dialog named for the place, its focus on the title', () => {
        const { root } = open({ hass: hass({ 'weather.home': { entity_id: 'weather.home', state: 'cloudy', attributes: { friendly_name: 'Home' } } }) });
        const dialog = root.querySelector('dialog')!;
        expect(dialog.open).toBe(true);
        expect(dialog.getAttribute('aria-labelledby')).toBe('awc-sheet-title');
        expect(root.querySelector('#awc-sheet-title')!.textContent).toContain('Home');
        expect(root.activeElement?.id).toBe('awc-sheet-title');
        expect(root.querySelector('.pp-note')!.textContent).toBe('Rain by three.');
    });

    it('closes on Escape and gives focus back to the card', () => {
        const { root, back } = open();
        root.querySelector('dialog')!.dispatchEvent(new Event('cancel', { cancelable: true }));
        expect(document.querySelector('awc-forecast-popup')).toBeNull();
        expect(document.activeElement).toBe(back);
        expect(document.documentElement.style.overflow).toBe('');
    });

    it('hands over to Home Assistant\'s own dialog only once it has gone', () => {
        const { root, openMoreInfo } = open();
        (root.querySelector('[data-more]') as HTMLElement).click();
        expect(document.querySelector('awc-forecast-popup')).toBeNull();
        expect(openMoreInfo).toHaveBeenCalledTimes(1);
    });

    it('scrubs through the hours from the keyboard, the readout following, the hero never', () => {
        const { root } = open({ variant: 'c' });
        const plot = root.querySelector('.pp-plot') as HTMLElement;
        const hero = root.querySelector('.pp-temp')!.textContent;
        expect(plot.getAttribute('role')).toBe('slider');
        plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        expect(plot.getAttribute('aria-valuenow')).toBe('2');
        expect(plot.getAttribute('aria-valuetext')).toMatch(/^13:00/);
        expect(root.querySelector('.pp-now')!.hasAttribute('hidden')).toBe(false);
        expect(root.querySelector('.pp-temp')!.textContent).toBe(hero);
        plot.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
        expect(plot.getAttribute('aria-valuenow')).toBe('0');
    });
});

describe('a forecast\'s text is text', () => {
    it('writes hostile conditions, names and units as text in every drawing', () => {
        const bad = hours({ condition: TAGS });
        const states = { 'weather.home': { entity_id: 'weather.home', state: TAGS, attributes: { friendly_name: TAGS, wind_speed: 10, wind_speed_unit: TAGS, visibility: 3, visibility_unit: TAGS } } };
        const host = document.createElement('div');
        for (const variant of ['a', 'b', 'c']) {
            host.innerHTML = FORECAST_VIEWS.renderSection(ctx({ hourly: bad, variant, hass: hass(states), show: 'both' }));
            expect(host.querySelector('img'), `section ${variant}`).toBeNull();
            host.innerHTML = FORECAST_VIEWS.renderCard({ ...ctx({ hourly: bad, variant, hass: hass(states), show: 'both' }), compact: false, clock: false });
            expect(host.querySelector('img'), `card ${variant}`).toBeNull();
        }
        for (const variant of ['a', 'c']) {
            const close = FORECAST_VIEWS.openPopup({ ...ctx({ hourly: bad, variant, hass: hass(states) }), note: TAGS, still: true, openMoreInfo: () => {} });
            const root = document.querySelector('awc-forecast-popup')!.shadowRoot!;
            expect(root.querySelector('img'), `pop-up ${variant}`).toBeNull();
            close();
        }
    });
});
