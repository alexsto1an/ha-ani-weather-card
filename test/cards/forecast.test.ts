import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/animated-weather-card-forecast';
import { attachSlide, SLIDE } from '../../src/fc-slide';
import { wallLayout } from '../../src/fc-wall';
import { createChips, createHourly, hourCols } from '../../src/fc-row';
import { TimeText, fitHeroTime } from '../../src/fc-clock';
import { cardClock } from '../../src/fc-weather';
import { shortDate } from '../../src/localize';
import { glyph, glyphKey, GLYPH_KEYS, litTints } from '../../src/fc-glyphs';
import { Timeline } from '../../src/fc-core';
import { hours } from '../../src/fc-data';
import { FC_WORDS } from '../../src/fc-words';
import type { ForecastExtras, ForecastHost } from '../../src/forecast-host';
import type { ForecastEntry } from '../../src/forecast-data';
import { HOUR_EVENT, sendHour, type HourLink } from '../../src/hour-link';

const HOUR = 3600_000;
const today = (h: number, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };
const conditions = ['partlycloudy', 'cloudy', 'cloudy', 'cloudy', 'rainy', 'rainy', 'cloudy', 'clear-night', 'clear-night', 'clear-night', 'sunny', 'sunny'];
function forecast(start = today(new Date().getHours())): ForecastEntry[] {
    return Array.from({ length: 30 }, (_, i) => ({
        datetime: new Date(start.getTime() + i * HOUR).toISOString(), condition: conditions[i % conditions.length],
        temperature: 21 - i * 0.3, apparent_temperature: 20 - i * 0.3, precipitation_probability: i % 12 === 4 ? 70 : 10, precipitation: i % 12 === 4 ? 1.2 : 0,
        humidity: 60, wind_speed: 12, pressure: 1012,
    }));
}
const daily: ForecastEntry[] = Array.from({ length: 7 }, (_, i) => ({ datetime: new Date(today(12).getTime() + i * 24 * HOUR).toISOString(), condition: 'sunny', temperature: 22 + i, templow: 12 + i }));

function makeHass(features = 3, extra: Record<string, unknown> = {}) {
    return {
        states: {
            'weather.home': { entity_id: 'weather.home', state: 'partlycloudy', attributes: { temperature: 21, humidity: 55, apparent_temperature: 20, pressure: 1016, wind_speed: 13, friendly_name: 'Home', temperature_unit: '°C', supported_features: features } },
        },
        config: { time_zone: 'UTC', unit_system: { temperature: '°C' } },
        language: 'en', locale: { language: 'en', time_format: '24' },
        localize: () => '',
        formatEntityState: (s: { state: string }) => s.state,
        connection: {
            subscribeMessage: async (listener: (m: unknown) => void, message: { forecast_type: string }) => {
                listener({ type: message.forecast_type, forecast: message.forecast_type === 'hourly' ? forecast() : daily });
                return () => {};
            },
        },
        ...extra,
    };
}
type Card = HTMLElement & { setConfig(c: object): void; hass: unknown; getGridOptions(): { rows: number }; getCardSize(): number; openForecast(): void };
const mounted: HTMLElement[] = [];
function mount(config: object, hass = makeHass(), type = 'animated-weather-card'): Card {
    const card = document.createElement(type) as Card;
    card.setConfig({ entity: 'weather.home', ...config });
    document.body.append(card);
    card.hass = hass;
    mounted.push(card);
    return card;
}
afterEach(() => { for (const c of mounted.splice(0)) c.remove(); vi.useRealTimers(); });
const settle = () => new Promise(r => setTimeout(r, 30));
// The slide's spring advances at most 50 ms a frame (fc-slide.ts), so on a busy runner a trip home takes many
// frames of real time: wait for what a test expects, for up to ten seconds, and give each test room for that
const until = async (done: () => boolean, ms = 10_000) => {
    const end = Date.now() + ms;
    while (!done() && Date.now() < end) await new Promise(r => setTimeout(r, 20));
};
vi.setConfig({ testTimeout: 30_000 });

describe('the hours\' graph (forecast_graph), the same for every metric', () => {
    const make = (graph?: string) => {
        const row = createHourly({ W: FC_WORDS.en, lang: 'en', hours: hours(new Timeline(forecast(), 'hourly', Date.now()).slots, makeHass() as never), metric: 'temp', has: { temp: true, feels: true, chance: true, amount: true }, noun: 'rain', pitch: 50, plot: 44, valueHeight: 20, graph: graph as never, conditionName: c => c });
        document.body.append(row.el);
        mounted.push(row.el);
        return row;
    };
    const op = (row: ReturnType<typeof make>, sel: string) => Number((row.el.querySelector(sel) as SVGElement).style.opacity);
    it('a line for every metric by default: the rain\'s chance and amount too, no fill, no bars', () => {
        for (const g of [undefined, 'line', 'nonsense']) {
            const row = make(g);
            for (const m of ['temp', 'chance', 'amount'] as const) {
                row.setMetric(m, { animate: false });
                expect([op(row, '.fc-line'), op(row, '.fc-area'), op(row, '.fc-bars')], `${g} ${m}`).toEqual([1, 0, 0]);
            }
        }
    });
    it('the line with a soft fill under it, fading to the bottom', () => {
        const row = make('area');
        row.setMetric('amount', { animate: false });
        expect([op(row, '.fc-line'), op(row, '.fc-area')]).toEqual([1, 1]);
        expect(row.el.querySelector('.fc-area')?.getAttribute('fill')).toMatch(/^url\(#fcm\d+a\)$/);
    });
    it('bars for every metric, from one floor, the values over them; an hour of no rain has none', () => {
        const row = make('bars');
        const bars = () => (row.el.querySelector('.fc-bars path')?.getAttribute('d') ?? '').match(/M/g)?.length ?? 0;
        expect([op(row, '.fc-line'), op(row, '.fc-bars'), op(row, '.fc-base')]).toEqual([0, 1, 1]);
        expect(bars()).toBe(30);
        expect(row.el.dataset.values).toBe('above');
        row.setMetric('chance', { animate: false });
        // The sample's chance is 10% but every twelfth hour (70%): every hour has a bar
        expect(bars()).toBe(30);
        row.setMetric('amount', { animate: false });
        // Only the wet hours have an amount
        expect(bars()).toBe(3);
    });
    it('no graph: the values alone, on one line at the row\'s middle', () => {
        // jsdom lays out no text: a value is 20 px wide
        const ow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')!;
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get() { return this.classList?.contains('fc-val') ? 20 : 0; } });
        const row = make('none');
        row.setMetric('chance', { animate: false });
        row.setMetric('temp', { animate: false });
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', ow);
        expect([op(row, '.fc-line'), op(row, '.fc-area'), op(row, '.fc-bars'), op(row, '.fc-base')]).toEqual([0, 0, 0, 0]);
        const tops = [...row.el.querySelectorAll<HTMLElement>('.fc-val')].map(v => v.style.transform.match(/,\s*([\d.-]+)px/)?.[1]).filter(Boolean);
        expect(new Set(tops)).toEqual(new Set(['12.00']));
    });
});

describe('the forecast on the weather card', () => {
    it('draws the clock, today\'s high and low, the turning line, the hourly row, its chips and the slider', async () => {
        const card = mount({ show_forecast: true, show_clock: true });
        await settle();
        expect(card.querySelector('.location .awc-clock')?.textContent).toMatch(/^\d{2}:\d{2}$/);
        expect(card.querySelector('.awc-companion [data-v="hl"]')?.textContent).toMatch(/H.22°.*L.12°/);
        expect(card.querySelector('.awc-line')?.textContent).toMatch(/^(Rain|Dry)/);
        const row = card.querySelector('[data-fc-hourly]') as HTMLElement;
        expect(row.dataset.metric).toBe('temp');
        expect(row.querySelectorAll('.fc-col')).toHaveLength(30);
        expect(row.querySelector('.fc-col .fc-hr')?.textContent).toBe('Now');
        const chips = card.querySelector('[data-fc-chips]') as HTMLElement;
        expect(chips.getAttribute('role')).toBe('radiogroup');
        expect([...chips.querySelectorAll('[role="radio"]')].map(c => c.getAttribute('data-metric'))).toEqual(['temp', 'feels', 'chance', 'amount']);
        const slider = card.querySelector('[role="slider"]') as HTMLElement;
        expect(slider.getAttribute('aria-valuenow')).toBe('0');
        expect(slider.getAttribute('aria-valuetext')).toMatch(/^Now: Partly cloudy, 21°/);
        // The condition is the forecast's noun at rest too
        expect(card.querySelector('.weather-desc')?.textContent).toBe('Partly cloudy');
    });

    it('puts the row at the card\'s foot, under the readings', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const info = card.querySelector('.weather-info') as HTMLElement;
        const sec = info.querySelector('.fc-section') as HTMLElement;
        expect(sec.parentElement).toBe(info);
        expect(info.lastElementChild).toBe(sec);
        expect(sec.previousElementSibling?.classList.contains('weather-attributes')).toBe(true);
        // The divider moves with it: between the readings and the row while the row shows, above the readings (the rail's) where it gives way
        const css = card.querySelector('style.awc-fc-css')?.textContent ?? '';
        expect(css).toMatch(/\.weather-attributes ~ \.fc-section::before \{[^}]*height: 1px;[^}]*opacity: 0\.2;/);
        expect(css).toMatch(/:is\(\[data-fc="full"\], \[data-fc="glyphs"\], \[data-fc="row"\]\) \.weather-attributes:has\(~ \.fc-section\)::before \{ content: none; \}/);
        expect(css).toMatch(/\.weather-attributes ~ \.fc-section \{[^}]*padding-top: calc\(14px \+ var\(--fc-sec-top, 0px\)\)/);
    });

    it('steps the turning line aside while a note shows: the note tells what\'s coming, and the line is today\'s again', async () => {
        const hass = makeHass();
        (hass.states as Record<string, unknown>)['sensor.note'] = { entity_id: 'sensor.note', state: 'Dry until evening.', attributes: { note: 'Dry until evening, then rain by night.' } };
        const card = mount({ show_forecast: true, note_entity: 'sensor.note' }, hass);
        await settle();
        const root = card.querySelector('.animated-weather-card') as HTMLElement;
        expect(root.dataset.note).toBe('long');
        const css = card.querySelector('style.awc-fc-css')?.textContent ?? '';
        expect(css).toMatch(/:is\(\[data-note="long"\], \[data-note="line"\]\) \.hero-meta > \.awc-line \{ display: none !important; \}/);
        // Feels like and the quiet tint come back only beside a note
        expect(css).toMatch(/:not\(\[data-note="long"\]\):not\(\[data-note="line"\]\) \.hero-meta:has\(> \.awc-line:not\(:empty\)\) > \.feels-like \{ display: none; \}/);
        // The fit leaves what follows the line alone, even what it hid before the note came
        const feels = card.querySelector('.hero-meta .feels-like') as HTMLElement;
        feels.style.display = 'none';
        (card as unknown as { extras: ForecastExtras }).extras.fitted();
        expect(feels.style.display).toBe('');
        // Beside the condition too: on a tight card everything fits (jsdom: 300 px wide), yet the companion keeps to H and L
        const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
        root.dataset.height = 'tight';
        (card as unknown as { extras: ForecastExtras }).extras.fitted();
        expect(card.querySelector('.awc-companion')?.getAttribute('data-show')).toBe('hl');
        width.mockRestore();
    });

    it('fits more hours across a wider card, never fewer than six (eight wide); centres the chips; gives the days\' free width to the bar', () => {
        expect(hourCols(313, 6)).toBe(6);    // a phone: 52 px an hour, as before
        expect(hourCols(438, 6)).toBe(8);    // a desktop column: 55 px, not 73
        expect(hourCols(470, 6)).toBe(9);
        expect(hourCols(200, 6)).toBe(6);
        expect(hourCols(448, 8)).toBe(8);
        expect(hourCols(300, 8)).toBe(8);
        const card = mount({ show_forecast: true });
        return settle().then(() => {
            const css = card.querySelector('style.awc-fc-css')?.textContent ?? '';
            expect(css).toMatch(/\.fc-chips-row > \.fc-chip:first-child, \.fc-chips-sel > \.fc-chip:first-child \{ margin-left: auto; \}/);
            expect(css).toMatch(/\.fc-chips-row > \.fc-chip:last-child, \.fc-chips-sel > \.fc-chip:last-child \{ margin-right: auto; \}/);
            expect(css).toMatch(/\.fc-day \{\s*display: grid; grid-template-columns: var\(--fc-d-day, 40px\) var\(--fc-d-glyph, 20px\) var\(--fc-d-lo, 34px\) minmax\(0, 1fr\) var\(--fc-d-hi, 34px\);/);
            expect(css).not.toMatch(/--fc-d-bar/);
        });
    });

    it('keeps the clouds above the readings, and with no row gives the card today\'s sky', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const root = card.querySelector('.animated-weather-card') as HTMLElement;
        const sec = root.querySelector('.fc-section') as HTMLElement;
        const readings = root.querySelector('.weather-attributes') as HTMLElement;
        const extras = (card as unknown as { extras: ForecastExtras }).extras;
        // jsdom lays nothing out: the readings' divider is 232 px down the card, the row under them
        const box = (top: number, height: number) => ({ top, left: 0, right: 353, bottom: top + height, width: 353, height }) as DOMRect;
        for (const [e, b] of [[sec, box(380, 122)], [readings, box(232, 128)]] as const) {
            vi.spyOn(e, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
            vi.spyOn(e, 'getBoundingClientRect').mockReturnValue(b);
        }
        extras.setLevel('full');
        extras.fitted();
        expect(root.dataset.cloudBand).toBe('226');
        expect(root.style.getPropertyValue('--fc-floor-c')).toBe('226px');
        // With no readings, the row's own top
        vi.spyOn(readings, 'getClientRects').mockReturnValue([] as unknown as DOMRectList);
        extras.fitted();
        expect(root.dataset.cloudBand).toBe('374');
        extras.setLevel('none');
        extras.fitted();
        expect(root.dataset.cloudBand).toBeUndefined();
        expect(root.style.getPropertyValue('--fc-floor-c')).toBe('');
    });

    it('starts the row on forecast_metric', async () => {
        const card = mount({ show_forecast: true, forecast_metric: 'chance' });
        await settle();
        expect(card.querySelector('[data-fc-hourly]')?.getAttribute('data-metric')).toBe('chance');
        expect(card.querySelector('[data-fc-chips] [data-metric="chance"]')?.getAttribute('aria-checked')).toBe('true');
    });

    it('asks for eight rows with an hourly forecast, five without one, one more with a note; the nightstand six', () => {
        expect(mount({ show_forecast: true }).getGridOptions().rows).toBe(8);
        expect(mount({ show_forecast: true }, makeHass(1)).getGridOptions().rows).toBe(5);
        expect(mount({ show_forecast: true, note_entity: 'sensor.note' }).getGridOptions().rows).toBe(9);
        expect(mount({ layout: 'nightstand' }).getGridOptions().rows).toBe(6);
        expect(mount({ show_clock: true }).getGridOptions().rows).toBe(4);
    });

    it('a tap opens the forecast\'s view by default; a tap action of your own still wins', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const open = vi.spyOn(card, 'openForecast');
        const info = card.querySelector('.weather-info') as HTMLElement;
        info.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(open).toHaveBeenCalled();
        // An action that's set goes to Home Assistant to run
        const more = vi.fn();
        const own = mount({ show_forecast: true, tap_action: { action: 'more-info' } });
        own.addEventListener('hass-action', more);
        await settle();
        (own.querySelector('.weather-info') as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(more).toHaveBeenCalled();
    });

    it('opens the view, closes it and opens it again, every time visible', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const dialog = () => document.querySelector('.awc-view-host')!.shadowRoot!.querySelector('dialog') as HTMLDialogElement;
        for (let i = 0; i < 2; i++) {
            card.openForecast();
            await until(() => !!document.querySelector('.awc-view-host') && dialog().hasAttribute('open'));
            expect(dialog().hasAttribute('open')).toBe(true);
            // Nothing inline from the last close hides it
            expect(dialog().style.visibility).toBe('');
            const shadow = document.querySelector('.awc-view-host')!.shadowRoot!;
            // The sheet is the window; the grown card stands at the panel inside it, so the clip can start on a card outside the panel
            expect(shadow.querySelector('style')!.textContent).toMatch(/\.fv-sheet \{ position: absolute; inset: 0;/);
            const grown = shadow.querySelector('.fv-sheet > animated-weather-card') as HTMLElement;
            expect(grown.style.width).toMatch(/px$/);
            expect(grown.style.top).toMatch(/px$/);
            (grown.querySelector('.fv-close') as HTMLElement).click();
            await until(() => !dialog().hasAttribute('open'));
            expect(dialog().hasAttribute('open')).toBe(false);
            expect(dialog().style.visibility).toBe('');
            expect((card.querySelector('.animated-weather-card') as HTMLElement).style.visibility).toBe('');
        }
    });

    it('in the view, the days follow its hours, and its chips change what the days show', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        card.openForecast();
        await until(() => !!document.querySelector('.awc-view-host')?.shadowRoot?.querySelector('dialog')?.hasAttribute('open'));
        const grown = document.querySelector('.awc-view-host')!.shadowRoot!.querySelector('.fv-sheet > animated-weather-card') as HTMLElement;
        const list = grown.querySelector('[data-fc-daily]') as HTMLElement;
        const slider = grown.querySelector('[role="slider"]') as HTMLElement;
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        expect(list.hasAttribute('data-fc-follow')).toBe(true);
        expect(grown.querySelectorAll('[data-fc-day][data-fc-at]')).toHaveLength(1);
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        // The spring home takes about half a second, and many more frames on a busy machine
        await until(() => !list.hasAttribute('data-fc-follow'));
        expect(list.hasAttribute('data-fc-follow')).toBe(false);
        (grown.querySelector('[data-fc-chips] [data-metric="chance"]') as HTMLElement).click();
        expect(list.dataset.metric).toBe('chance');
        (grown.querySelector('.fv-close') as HTMLElement).click();
    });

    it('the nightstand is no button: a tap does nothing unless tap_action sets one', async () => {
        const card = mount({ layout: 'nightstand' });
        await settle();
        const open = vi.spyOn(card, 'openForecast');
        const info = card.querySelector('.weather-info') as HTMLElement;
        expect(info.getAttribute('role')).not.toBe('button');
        info.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        expect(open).not.toHaveBeenCalled();
        const own = mount({ layout: 'nightstand', tap_action: { action: 'more-info' } });
        await settle();
        expect((own.querySelector('.weather-info') as HTMLElement).getAttribute('role')).toBe('button');
    });

    it('the nightstand leaves the weather beside the time its room, so nothing is cut at the card\'s edge', async () => {
        // jsdom has no fonts: a figure 0.6 of the size, the colon 0.3, AM/PM 30 px; the frame of a sections card 880 × 502
        const rect = Element.prototype.getBoundingClientRect;
        const size = (el: Element) => parseFloat((el.closest('.qn') as HTMLElement | null)?.style.getPropertyValue('--qn-size') || '0');
        const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
            const width = this.localName === 'i' && this.closest('.qn-time') ? (this.textContent === ':' ? 0.3 : 0.6) * size(this)
                : this.classList.contains('awc-ampm') ? 30 : 0;
            return width ? { x: 0, y: 0, top: 0, left: 0, bottom: 0, right: width, height: 0, width, toJSON() { return this; } } as DOMRect : rect.call(this);
        });
        const box = (w: number, h: number) => {
            const proto = HTMLElement.prototype;
            const cw = Object.getOwnPropertyDescriptor(proto, 'clientWidth'), ch = Object.getOwnPropertyDescriptor(proto, 'clientHeight');
            Object.defineProperty(proto, 'clientWidth', { configurable: true, get() { return this.classList?.contains('animated-weather-card') ? w : 0; } });
            Object.defineProperty(proto, 'clientHeight', { configurable: true, get() { return this.classList?.contains('animated-weather-card') ? h : 0; } });
            // jsdom keeps them on Element: put back what was there, or nothing
            return () => {
                if (cw) Object.defineProperty(proto, 'clientWidth', cw); else delete (proto as { clientWidth?: number }).clientWidth;
                if (ch) Object.defineProperty(proto, 'clientHeight', ch); else delete (proto as { clientHeight?: number }).clientHeight;
            };
        };
        for (const [w, h, timeFormat] of [[880, 502, '12'], [880, 502, '24'], [658, 374, '12'], [1278, 758, '24']] as const) {
            const restore = box(w, h);
            const card = mount({ layout: 'nightstand', night: 'off' }, makeHass(3, { locale: { language: 'en', time_format: timeFormat } }));
            await settle();
            const ns = card.querySelector('.qn') as HTMLElement;
            const left = parseFloat(ns.style.getPropertyValue('--qn-right-left'));
            // The weather's column: from its left to the right padding
            expect(w - 44 - left, `${w} × ${h}, ${timeFormat} h`).toBeGreaterThanOrEqual(211);
            // The time still as large as the height allows where there's room, never past 0.6 of it
            expect(parseFloat(ns.style.getPropertyValue('--qn-size'))).toBeLessThanOrEqual(0.6 * (h - 60) + 0.1);
            card.remove();
            restore();
        }
        spy.mockRestore();
    });

    it('the nightstand is red on black at night unless night_red is false, when its sky stays under a veil in warm inks', async () => {
        const red = mount({ layout: 'nightstand', night: 'on' });
        await settle();
        expect(red.querySelector('.qn-veil')?.hasAttribute('data-red')).toBe(true);
        expect((red.querySelector('.qn-time') as HTMLElement).style.color).toBe('rgb(194, 31, 23)');
        expect((red.querySelector('.qn-right') as HTMLElement).style.color).toBe('rgb(235, 38, 28)');
        expect(red.hasAttribute('data-red') && red.hasAttribute('data-qn-night')).toBe(true);
        // The weather shows through, faintly: the black under it, a red over it that multiplies it into a faint red
        expect((red.querySelector('.qn-tint') as HTMLElement).style.opacity).toBe('1');
        // The condition now, in the night's one line (partly cloudy here), before what's coming
        expect(red.querySelector('.qn-right .qn-cond')?.textContent).toMatch(/^Partly cloudy · /);
        // By day nothing is red: the sky as it is
        const day = mount({ layout: 'nightstand', night: 'off' });
        await settle();
        expect((day.querySelector('.qn-time') as HTMLElement).style.color).not.toMatch(/^rgb\(194/);
        const warm = mount({ layout: 'nightstand', night: 'on', night_red: false });
        await settle();
        expect(warm.querySelector('.qn-veil')?.hasAttribute('data-red')).toBe(false);
        expect((warm.querySelector('.qn-tint') as HTMLElement).style.opacity).toBe('0');
        expect((warm.querySelector('.qn-time') as HTMLElement).style.color).toBe('rgb(139, 106, 77)');
    });

    it('the nightstand\'s light sensor makes it night below night_lux (5 lx unless set) held for a minute, and day at three times it', async () => {
        vi.useFakeTimers({ now: today(13), toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
        const lux = (v: number) => makeHass(3, { states: { ...makeHass().states, 'sensor.lux': { entity_id: 'sensor.lux', state: String(v), attributes: { unit_of_measurement: 'lx' } } } });
        const night = (c: Card) => c.hasAttribute('data-qn-night');
        // 27 lx: still light by default
        const plain = mount({ layout: 'nightstand', night_sensor: 'sensor.lux' }, lux(27));
        await vi.advanceTimersByTimeAsync(100);
        plain.hass = lux(27);
        await vi.advanceTimersByTimeAsync(75_000);
        expect(night(plain)).toBe(false);
        // Tuned to 30: 27 lx is night once it's held for a minute, not before
        const tuned = mount({ layout: 'nightstand', night_sensor: 'sensor.lux', night_lux: 30 }, lux(27));
        await vi.advanceTimersByTimeAsync(100);
        tuned.hass = lux(27);
        await vi.advanceTimersByTimeAsync(30_000);
        expect(night(tuned)).toBe(false);
        await vi.advanceTimersByTimeAsync(45_000);
        expect(night(tuned)).toBe(true);
        // A lamp at 60 lx is under three times it: still night; at 95 lx, held for 10 s, day again
        tuned.hass = lux(60);
        await vi.advanceTimersByTimeAsync(25_000);
        expect(night(tuned)).toBe(true);
        tuned.hass = lux(95);
        await vi.advanceTimersByTimeAsync(25_000);
        expect(night(tuned)).toBe(false);
    });

    it('the nightstand takes night: on and off as YAML-mode dashboards hand them over, true and false', async () => {
        vi.useFakeTimers({ now: today(13), toFake: ['Date', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval'] });
        const dark = makeHass(3, { states: { ...makeHass().states, 'sensor.lux': { entity_id: 'sensor.lux', state: '0', attributes: { unit_of_measurement: 'lx' } } } });
        // At one in the afternoon, true is night all the same
        const on = mount({ layout: 'nightstand', night: true });
        await vi.advanceTimersByTimeAsync(100);
        expect(on.hasAttribute('data-qn-night')).toBe(true);
        // And false keeps it day in a dark room, where the sensor alone would make it night
        const off = mount({ layout: 'nightstand', night: false, night_sensor: 'sensor.lux' }, dark);
        await vi.advanceTimersByTimeAsync(100);
        off.hass = dark;
        await vi.advanceTimersByTimeAsync(75_000);
        expect(off.hasAttribute('data-qn-night')).toBe(false);
    });

    it('a chip or the Now control inside the card is its own tap, never the card\'s', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const open = vi.spyOn(card, 'openForecast');
        const chip = card.querySelector('[data-fc-chips] [data-metric="chance"]') as HTMLElement;
        chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        chip.click();
        expect(open).not.toHaveBeenCalled();
        expect(card.querySelector('[data-fc-hourly]')?.getAttribute('data-metric')).toBe('chance');
    });

    it('the clock alone needs no forecast', async () => {
        const card = mount({ show_clock: true });
        await settle();
        expect(card.querySelector('.awc-clock')?.textContent).toMatch(/\d{2}:\d{2}/);
        expect(card.querySelector('[data-fc-hourly]')).toBeNull();
    });
});

describe('the forecast card', () => {
    it('is the weather card\'s engine, on the entity\'s sky: the lead, the row, the chips and the week with today\'s dot', async () => {
        const card = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        expect(card.querySelector('.animated-weather-card')?.hasAttribute('data-fc-card')).toBe(true);
        expect(card.querySelector('.fc-sentence')?.textContent).toMatch(/Rain|Dry/);
        expect(card.querySelectorAll('[data-fc-day]')).toHaveLength(7);
        expect(card.querySelector('[data-fc-day] [data-fc-now]')).not.toBeNull();
        expect(card.getGridOptions().rows).toBe(7);
        expect(mount({ compact: true }, makeHass(), 'animated-forecast-card').getGridOptions().rows).toBe(2);
        expect(mount({ forecast_days: 3 }, makeHass(), 'animated-forecast-card').getGridOptions().rows).toBe(5);
    });
    it('has no note: it hides the card\'s own text, so it neither shows one nor loads the note writer', async () => {
        const card = mount({ show_note: true }, makeHass(), 'animated-forecast-card');
        await settle();
        expect(card.querySelector('.weather-note')).toBeNull();
        expect(document.querySelector('script[src*="animated-weather-card-note"]')).toBeNull();
        expect(card.getGridOptions().rows).toBe(7);
        expect(mount({ note_entity: 'sensor.note' }, makeHass(), 'animated-forecast-card').getGridOptions().rows).toBe(7);
    });

    it('says so when the entity has no forecast', async () => {
        const hass = makeHass(0);
        const card = mount({}, hass, 'animated-forecast-card');
        await settle();
        expect(card.querySelector('.fc-empty')?.textContent).toBe(FC_WORDS.en.no_forecast);
    });

    it('its chips change what the days show too, on that card only', async () => {
        // A week that says how likely rain is, how much, and how it feels
        const wet = daily.map((d, i) => ({ ...d, precipitation_probability: i * 10, precipitation: i * 1.5, apparent_temperature: 20 + i }));
        const hass = makeHass(3, {
            connection: {
                subscribeMessage: async (listener: (m: unknown) => void, message: { forecast_type: string }) => {
                    listener({ type: message.forecast_type, forecast: message.forecast_type === 'hourly' ? forecast() : wet });
                    return () => {};
                },
            },
        });
        const a = mount({}, hass, 'animated-forecast-card');
        const b = mount({}, hass, 'animated-forecast-card');
        await settle();
        const his = (c: Card) => [...c.querySelectorAll<HTMLElement>('.fc-d-hi')].map(e => e.textContent);
        const los = (c: Card) => [...c.querySelectorAll<HTMLElement>('.fc-d-lo')].map(e => e.textContent);
        const chip = (c: Card, m: string) => (c.querySelector(`[data-fc-chips] [data-metric="${m}"]`) as HTMLElement).click();
        expect(his(a)[1]).toBe('23°');
        chip(a, 'chance');
        await settle();
        const list = a.querySelector('[data-fc-daily]') as HTMLElement;
        expect(list.dataset.metric).toBe('chance');
        expect(his(a)).toEqual(['0%', '10%', '20%', '30%', '40%', '50%', '60%']);
        expect(los(a).every(t => t === '')).toBe(true);
        expect(a.querySelector('.fc-fill')?.classList.contains('fc-wet')).toBe(true);
        expect(a.querySelector('[data-fc-day]')?.getAttribute('aria-label')).toMatch(/Chance of rain 0 percent$/);
        // The other card keeps its own
        expect(his(b)[1]).toBe('23°');
        chip(a, 'amount');
        await settle();
        expect(his(a).slice(0, 4)).toEqual(['0', '1.5', '3.0', '4.5']);
        // Feels like: the hours in the day, the day's own figure and now's reading, coolest to warmest
        chip(a, 'feels');
        await settle();
        expect(list.dataset.metric).toBe('feels');
        expect(his(a)[6]).toBe('26°');
        expect(a.querySelector('.fc-fill')?.classList.contains('fc-wet')).toBe(false);
        chip(a, 'temp');
        await settle();
        expect(his(a)[1]).toBe('23°');
        expect(los(a)[1]).toBe('13°');
    });
});

describe('the slide: it stays where it\'s left', () => {
    beforeEach(() => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'requestAnimationFrame', 'cancelAnimationFrame', 'performance'] }));
    function rig({ html = '', layers }: { html?: string; layers?: unknown } = {}) {
        const root = document.createElement('div');
        root.className = 'animated-weather-card';
        root.innerHTML = `<div class="sky"></div>${html}<div class="weather-info"></div>`;
        document.body.append(root);
        mounted.push(root);
        const tl = new Timeline(forecast(), 'hourly', Date.now());
        const host = {
            element: root, surface: 'card', config: () => ({ entity: 'weather.home' }), hass: () => makeHass(),
            forecast: () => ({ hourly: null, daily: null, dailyType: null, settled: true }), layers: () => layers,
            skyColors: () => ({ top: '#203050', mid: '#304060', bottom: '#405070', glow: 'rgba(255,255,255,0.3)', scrim: 'rgba(0,0,0,0.2)' }),
            phase: () => 'day', current: () => 21, temperature: (v: number) => String(Math.round(v)), conditionName: (s: string) => s,
            fit() {}, refresh() {}, seen: () => true, still: () => false, moreInfo() {},
        } as unknown as ForecastHost;
        const offsets: number[] = [];
        const slots: Array<number | null> = [];
        const needles: Array<{ at: number; t: number | null } | null> = [];
        const slide = attachSlide({
            host, root, tl, ruler: { pitch: 50, el: root, setOffset: px => offsets.push(px) }, sliderHost: root, sliderLabel: 'Hours ahead',
            valueText: (s, k) => (s ? `slot ${k}` : 'Now'), onSlot: (s, k) => slots.push(s ? k : null), group: () => [],
            onNeedle: (at, t) => needles.push(at === null ? null : { at, t }),
        });
        const pointer = (type: string, x: number, y = 100) => {
            const e = new MouseEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0 });
            Object.defineProperty(e, 'pointerId', { value: 1 });
            Object.defineProperty(e, 'isPrimary', { value: true });
            Object.defineProperty(e, 'timeStamp', { value: performance.now() });
            root.dispatchEvent(e);
        };
        const drag = (dx: number) => {
            pointer('pointerdown', 300);
            for (let i = 1; i <= 10; i++) { pointer('pointermove', 300 + (dx * i) / 10); vi.advanceTimersByTime(16); }
            vi.advanceTimersByTime(200);   // a rest before the lift: no flick
            pointer('pointerup', 300 + dx);
        };
        return { root, slide, offsets, slots, needles, drag, pointer };
    }

    it('following another card, a hand on it continues from the hour it shows, and from then on it leads', () => {
        const { slide, slots, drag } = rig();
        const heard: HourLink[] = [];
        const listen = (e: Event) => heard.push((e as CustomEvent<HourLink>).detail);
        window.addEventListener(HOUR_EVENT, listen);
        slide.follow(Date.now() + 3 * HOUR);
        vi.advanceTimersByTime(600);
        expect(slots[slots.length - 1]).toBe(3);
        // Following, it says nothing
        expect(heard).toHaveLength(0);
        drag(-50);
        vi.advanceTimersByTime(2000);
        // One hour further than the hour it showed, not one hour from now
        expect(slots[slots.length - 1]).toBe(4);
        expect(heard.length).toBeGreaterThan(0);
        window.removeEventListener(HOUR_EVENT, listen);
    });

    it('names the hour under the needle in a capsule, from "Now" as a hand takes hold, counting back on the way home', () => {
        const hourly = createHourly({ W: FC_WORDS.en, lang: 'en', hours: hours(new Timeline(forecast(), 'hourly', Date.now()).slots, makeHass() as never), metric: 'temp', has: { temp: true, feels: true, chance: true, amount: true }, noun: 'rain', pitch: 50, conditionName: c => c });
        const root = document.createElement('div');
        root.className = 'animated-weather-card';
        root.innerHTML = '<div class="sky"></div>';
        root.append(hourly.el);
        document.body.append(root);
        mounted.push(root);
        const cap = hourly.el.querySelector('.fc-cap') as HTMLElement;
        expect(cap.getAttribute('aria-hidden')).toBe('true');
        expect(cap.textContent).toBe('Now');
        const tl = new Timeline(forecast(), 'hourly', Date.now());
        const host = {
            element: root, surface: 'card', config: () => ({ entity: 'weather.home' }), hass: () => makeHass(), forecast: () => ({ hourly: null, daily: null, dailyType: null, settled: true }), layers: () => undefined,
            skyColors: () => ({ top: '#203050', mid: '#304060', bottom: '#405070', glow: 'rgba(255,255,255,0.3)', scrim: 'rgba(0,0,0,0.2)' }),
            phase: () => 'day', current: () => 21, temperature: (v: number) => String(Math.round(v)), conditionName: (s: string) => s, fit() {}, refresh() {}, seen: () => true, still: () => false, moreInfo() {},
        } as unknown as ForecastHost;
        const slide = attachSlide({ host, root, tl, ruler: hourly, sliderHost: hourly.el, sliderLabel: 'Hours ahead', valueText: () => '', onSlot: () => {}, group: () => [] });
        const slider = hourly.el.querySelector('[role="slider"]') as HTMLElement;
        // jsdom lays nothing out: the labels are 20 px wide
        const width = vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(20);
        for (let i = 0; i < 3; i++) slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        // Taken, the card says so (the capsule shows while it's pulled) and the capsule names the hour three on
        expect(root.classList.contains('awc-pulling')).toBe(true);
        // (at midnight it names the day, as the row's label does, so the test holds at any hour it runs)
        const third = hourly.hours[3];
        expect(cap.textContent).toBe(third.midnight ? third.day : third.hour);
        // The lens: the label the capsule names, sitting under it, is faded; one far from it is whole
        const labels = [...hourly.el.querySelectorAll<HTMLElement>('.fc-col .fc-hr')];
        expect(labels[3].style.getPropertyValue('--fc-lens')).not.toBe('');
        expect(labels[9].style.getPropertyValue('--fc-lens')).toBe('');
        slide.home(true);
        expect(cap.textContent).toBe('Now');
        expect(root.classList.contains('awc-pulling')).toBe(false);
        expect(labels.every(l => l.style.getPropertyValue('--fc-lens') === '')).toBe(true);
        width.mockRestore();
        slide.destroy();
    });

    it('tells the days where its needle is, every frame it moves, and once it\'s home', () => {
        const { slide, needles, drag } = rig();
        drag(-150);
        vi.advanceTimersByTime(2000);
        const last = needles[needles.length - 1]!;
        // Three hours on, at the pitch of 50 px an hour, with the temperature there
        expect(Math.round((last.at - Date.now()) / HOUR)).toBe(3);
        expect(last.t).toBeCloseTo(20.1, 5);
        slide.home();
        vi.advanceTimersByTime(2000);
        expect(needles[needles.length - 1]).toBeNull();
    });

    it('under fog, the sun stays hidden as the drag starts, and the fog leaves at the hours without it', () => {
        // The card under fog: its sun hidden by its class, its fog running
        const layers = { animations: { fog: { isActive: true } }, startAnimation: async () => {}, stopAnimation: async () => {} };
        const { root, slide, drag } = rig({ html: '<div class="sun-track"><div class="sun" style="opacity: 0"></div></div><div class="animation-container fog-container"><i></i></div>', layers });
        const track = root.querySelector('.sun-track') as HTMLElement;
        const fog = root.querySelector('.fog-container') as HTMLElement;
        const pointer = (type: string, x: number) => {
            const e = new MouseEvent(type, { clientX: x, clientY: 100, bubbles: true, cancelable: true, button: 0 });
            Object.defineProperty(e, 'pointerId', { value: 1 });
            Object.defineProperty(e, 'isPrimary', { value: true });
            Object.defineProperty(e, 'timeStamp', { value: performance.now() });
            root.dispatchEvent(e);
        };
        pointer('pointerdown', 300);
        pointer('pointermove', 285);
        vi.advanceTimersByTime(16);
        expect(root.classList.contains('awc-pulling')).toBe(true);
        expect(track.style.getPropertyValue('--awc-pull-sun')).toBe('0.000');
        pointer('pointerup', 285);
        vi.advanceTimersByTime(2000);
        drag(-160);
        vi.advanceTimersByTime(2000);
        // Three hours on the sample is cloudy: no fog
        expect(slide.slots()).toBe(3);
        expect(parseFloat(fog.style.opacity)).toBeLessThan(0.05);
        expect(parseFloat(track.style.getPropertyValue('--awc-pull-sun'))).toBeLessThan(0.05);
    });

    it('every layer the card runs for a condition is one the slide fades', async () => {
        const { WeatherAnimationController } = await import('../../src/animation-controller');
        const { LAYER_NAMES, LAYER_OF, classOf } = await import('../../src/fc-core');
        const el = document.createElement('div');
        const mappings = (new WeatherAnimationController(el, {} as never) as unknown as { defaultWeatherMappings: Record<string, { animations: string[] }> }).defaultWeatherMappings;
        const reachable = new Set(['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'fog', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail', 'windy', 'windy-variant'].map(classOf));
        for (const cls of reachable) {
            for (const name of mappings[cls].animations) {
                if (name === 'sun' || name === 'stars') continue;
                expect(LAYER_NAMES as readonly string[], `${cls} runs ${name}`).toContain(name);
                expect(LAYER_OF[name][cls] ?? 0, `${cls} shows ${name}`).toBeGreaterThan(0);
            }
            // And nothing the card doesn't run: the sun only where the card shows it
            for (const name of LAYER_NAMES) if ((LAYER_OF[name][cls] ?? 0) > 0) expect(mappings[cls].animations, `${name} for ${cls}`).toContain(name);
        }
        // Stars only on a clear night, as the card shows them
        for (const cls of reachable) if (cls !== 'sunny') expect((LAYER_OF.stars[cls] ?? 0) > 0, `stars for ${cls}`).toBe(mappings[cls].animations.includes('stars'));
        expect(LAYER_OF.sun.foggy ?? 0).toBe(0);
        expect(LAYER_OF.sun.windy ?? 0).toBe(0);
    });

    it('a lift leaves the card at the nearest hour, and the next drag continues from there', () => {
        const { slide, slots, drag } = rig();
        drag(-160);
        vi.advanceTimersByTime(2000);
        expect(slide.away()).toBe(true);
        expect(slide.slots()).toBe(3);
        expect(slots.at(-1)).toBe(3);
        drag(-160);
        vi.advanceTimersByTime(2000);
        expect(slide.slots()).toBe(6);
    });

    it('a flick carries on the way a list does, so a few swipes reach the far hours', () => {
        const { slide, pointer } = rig();
        let reached = 0;
        for (let n = 0; n < 4; n++) {
            pointer('pointerdown', 300);
            for (let i = 1; i <= 6; i++) { pointer('pointermove', 300 - 25 * i); vi.advanceTimersByTime(12); }
            pointer('pointerup', 150);
            vi.advanceTimersByTime(3000);
            reached = slide.slots();
        }
        expect(reached).toBeGreaterThanOrEqual(25);
    });

    it('comes home deliberately: on Home, after half a minute alone, at once when it can\'t be seen', () => {
        const { root, slide, slots, drag } = rig();
        drag(-160);
        vi.advanceTimersByTime(2000);
        expect(slide.away()).toBe(true);
        const slider = root.querySelector('[role="slider"]') as HTMLElement;
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        vi.advanceTimersByTime(1500);
        expect(slide.away()).toBe(false);
        expect(slots.at(-1)).toBeNull();

        drag(-160);
        vi.advanceTimersByTime(SLIDE.idleHome - 1000);
        expect(slide.away()).toBe(true);
        vi.advanceTimersByTime(3000);
        expect(slide.away()).toBe(false);

        drag(-160);
        vi.advanceTimersByTime(2000);
        slide.home(true);
        expect(slide.away()).toBe(false);
    });

    it('the keys step an hour without a tween, and stay', () => {
        const { root, slide } = rig();
        const slider = root.querySelector('[role="slider"]') as HTMLElement;
        for (let i = 0; i < 4; i++) slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        expect(slider.getAttribute('aria-valuenow')).toBe('4');
        expect(slider.getAttribute('aria-valuetext')).toBe('slot 4');
        vi.advanceTimersByTime(5000);
        expect(slide.slots()).toBe(4);
    });

    it('a vertical drag stays the page\'s', () => {
        const { slide, pointer } = rig();
        pointer('pointerdown', 300, 100);
        for (let i = 1; i <= 10; i++) pointer('pointermove', 302, 100 + i * 6);
        pointer('pointerup', 302, 160);
        vi.advanceTimersByTime(1000);
        expect(slide.away()).toBe(false);
    });
});

describe('the wall', () => {
    it('sizes the panel as one picture: the temperature a third of the height, every tier a damped step of its base, within bounds', () => {
        const tablet = wallLayout(814, 630), small = wallLayout(638, 538), panel = wallLayout(1918, 1078);
        expect(tablet.t0).toBe(210);
        expect(panel.t0).toBe(360);
        expect(small.t0).toBe(179);
        // A bigger panel reads from further away, but the hero grows faster than the tiers under it
        expect(panel.t0 / tablet.t0).toBeGreaterThan(panel.figure / tablet.figure);
        expect(panel.figure).toBeGreaterThan(tablet.figure);
        for (const L of [tablet, small, panel]) {
            expect(L.t0).toBeGreaterThanOrEqual(161);
            expect(L.t0).toBeLessThanOrEqual(414);
            // The hours and the days keep apart: two blocks, not one
            expect(L.gutter).toBeGreaterThanOrEqual(Math.min(160, Math.max(64, 0.1 * (L.w - 2 * L.pad))) - 0.5);
            expect(L.t0 / L.sentence).toBeGreaterThan(4.5);
            expect(L.label).toBeGreaterThanOrEqual(17);
        }
        // Never wider than the panel lets a three-figure temperature stand
        expect(wallLayout(1918, 2400).t0).toBeLessThanOrEqual(Math.round(0.32 * 1918));
    });
    it('lays the band out as five lines of one height, the five days riding them, and stacks the week under the hours in portrait', () => {
        for (const [w, h] of [[638, 538], [814, 630], [1278, 758], [1918, 1078], [1918, 540]]) {
            const L = wallLayout(w, h);
            expect(L.stack).toBe(false);
            expect(L.days).toBe(5);
            expect(L.dayRow).toBe(L.line);
            expect(L.bandH).toBe(5 * L.line);
            expect(L.hoursH).toBe(4 * L.line);
            expect(L.pad + L.bandH).toBeLessThan(0.45 * h);
            expect(L.hoursW + L.gutter + L.weekW).toBe(w - 2 * L.pad);
        }
        const portrait = wallLayout(798, 1270);
        expect(portrait.stack).toBe(true);
        expect(portrait.days).toBe(7);
        expect(portrait.weekW).toBe(portrait.hoursW);
        // The hour labels stay in the lower half, where the tinted tier holds 4.5:1 across the width
        expect(portrait.iconY[0]).toBeGreaterThan(0.48);
        for (const [w, h] of [[768, 1024], [800, 1000], [798, 1270], [1078, 1918]]) {
            const L = wallLayout(w, h);
            expect(L.stack).toBe(true);
            expect((h - L.pad - L.bandH + L.line) / h).toBeGreaterThanOrEqual(0.48);
        }
        // A short portrait lays out beside: stacked, its labels would rise above the lower half and leave no sky
        expect(wallLayout(640, 700).stack).toBe(false);
        expect(wallLayout(700, 800).stack).toBe(false);
    });
    it('puts the first figure on the margin and the last on the band\'s edge, an even column apart, as many as fit at 2.5 figures', () => {
        for (const [w, h] of [[638, 538], [814, 630], [1278, 758], [1918, 1078], [798, 1270]]) {
            const L = wallLayout(w, h);
            expect(L.inset + (L.cols - 1) * L.col).toBeCloseTo(L.hoursW - L.inset, 6);
            expect(L.cols).toBeGreaterThanOrEqual(3);
            expect(L.cols).toBeLessThanOrEqual(10);
            // Figures never touch: the widest and 0.7 of one between two
            expect(L.col).toBeGreaterThanOrEqual(Math.max(2 * L.inset, 2 * 0.62 * L.figure) + 0.7 * L.figure - 0.01);
            // The row's first label sits a quarter column in, so the strip moves by the difference
            expect(L.shift).toBeCloseTo(L.inset - L.col / 4, 1);
        }
        expect(wallLayout(814, 630).cols).toBe(5);
        expect(wallLayout(1918, 1078).cols).toBe(10);
        // Three glyphs ("-11", "102") need wider columns, so fewer of them
        const two = wallLayout(814, 630, 2), three = wallLayout(814, 630, 3);
        expect(three.cols).toBeLessThan(two.cols);
        expect(three.inset).toBeGreaterThan(two.inset);
        // Twelve-hour labels ("11 PM") are wider than the figures on a small wall
        expect(wallLayout(638, 538, 2, true).inset).toBeGreaterThan(wallLayout(638, 538, 2, false).inset);
    });
});

describe('the chips', () => {
    it('a radiogroup with a roving tabindex: the arrows move and select, from the keys the capsule doesn\'t travel', () => {
        const change = vi.fn();
        const chips = createChips({ W: FC_WORDS.en, metrics: ['temp', 'feels', 'chance', 'amount'], value: 'temp', noun: 'snow', onChange: change });
        document.body.append(chips.el);
        mounted.push(chips.el);
        const radios = [...chips.el.querySelectorAll('[role="radio"]')] as HTMLElement[];
        expect(radios.map(r => r.tabIndex)).toEqual([0, -1, -1, -1]);
        expect(radios[2].getAttribute('aria-label')).toBe('Chance of snow');
        radios[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        expect(change).toHaveBeenCalledWith('feels', { keys: true });
        expect(radios[1].getAttribute('aria-checked')).toBe('true');
        expect(radios.map(r => r.tabIndex)).toEqual([-1, 0, -1, -1]);
        radios[3].click();
        expect(change).toHaveBeenLastCalledWith('amount', { keys: false });
    });
    it('fewer than two metrics: no chips', () => {
        const chips = createChips({ W: FC_WORDS.en, metrics: ['temp'], value: 'temp', noun: 'rain', onChange: () => {} });
        expect(chips.el.hidden).toBe(true);
    });
});

describe('the hourly row', () => {
    it('every hour an icon, each at full strength, a repeat as much as a change', () => {
        const entries = forecast();
        const rows = hours(new Timeline(entries, 'hourly', Date.now()).slots, makeHass() as never);
        const day = litTints(40, false, 0.1);
        const row = createHourly({ W: FC_WORDS.en, lang: 'en', hours: rows, metric: 'temp', has: { temp: true, feels: true, chance: true, amount: true }, noun: 'rain', pitch: 52, tints: () => day, conditionName: c => c });
        const g = [...row.el.querySelectorAll('.fc-g')];
        expect(g.every(e => e.querySelector('svg'))).toBe(true);
        expect(g.some(e => e.classList.contains('fc-rep'))).toBe(false);
        expect(row.el.querySelector('.fc-sr li')?.textContent).toMatch(/^Now: /);
    });
});

describe('the icons', () => {
    it('one drawing for each of Home Assistant\'s conditions, a moon after dark, one ink on a theme', () => {
        for (const c of ['sunny', 'clear-night', 'partlycloudy', 'cloudy', 'fog', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail', 'windy', 'windy-variant', 'exceptional']) {
            expect(GLYPH_KEYS).toContain(glyphKey(c, true));
            expect(glyph(c, true, 22, litTints(40, false, 0))).toMatch(/^<svg class="fc-glyph" data-g="/);
        }
        expect(glyphKey('sunny', false)).toBe('clear-night');
        expect(glyphKey('partlycloudy', false)).toBe('partlycloudy-night');
        expect(glyphKey('something new', true)).toBe('cloudy');
        expect(glyph('partlycloudy', true, 22, null)).toMatch(/currentColor/);
        expect(glyph('partlycloudy', true, 22, null)).not.toMatch(/#[0-9a-f]{6}/);
    });

    it('draws each from the Senja set on its 25-unit grid, every part in its own light, with no masks', () => {
        const t = litTints(40, false, 0);
        const night: Record<string, string> = { 'clear-night': 'sunny', 'partlycloudy-night': 'partlycloudy' };
        const fills = (k: string) => {
            const svg = glyph(night[k] ?? k, !night[k], 22, t);
            expect(svg).toContain('viewBox="0 0 25 25"');
            expect(svg).not.toMatch(/<mask/);
            const paths = [...svg.matchAll(/<path d="([^"]+)" fill="([^"]+)"/g)];
            expect(paths.length).toBeGreaterThan(0);
            for (const [, d] of paths) expect(d).toMatch(/^[mM][\d.-]/);
            return new Set(paths.map(p => p[2]));
        };
        for (const k of GLYPH_KEYS) fills(k);
        expect(fills('sunny')).toEqual(new Set([t.sun]));
        expect(fills('clear-night')).toEqual(new Set([t.moon]));
        expect(fills('partlycloudy')).toEqual(new Set([t.sun, t.cloud]));
        expect(fills('partlycloudy-night')).toEqual(new Set([t.moon, t.cloud]));
        // The ones the pack doesn't have, put together from its parts
        expect(fills('lightning-rainy')).toEqual(new Set([t.grey, t.bolt, t.rain]));
        expect(fills('snowy-rainy')).toEqual(new Set([t.grey, t.rain]));
        expect(fills('hail')).toEqual(new Set([t.grey, t.rain]));
        expect(fills('fog')).toEqual(new Set([t.grey]));
        expect(fills('exceptional')).toEqual(new Set([t.cloud]));
    });
});

describe('the time as the big value (hero: clock), and the date (show_date)', () => {
    const two = (n: number) => String(n).padStart(2, '0');
    const clockText = (card: HTMLElement) => card.querySelector('.awc-hero-clock .awc-clock')?.textContent;

    it('puts the time in the temperature\'s place, and the temperature at the start of the condition\'s line, as the nightstand says it', async () => {
        const card = mount({ hero: 'clock', show_forecast: true, show_clock: true });
        await settle();
        const big = card.querySelector('.temperature.awc-hero-clock') as HTMLElement;
        expect(clockText(card)).toMatch(/^\d{2}:\d{2}$/);
        // A minute is no news: the time has a label, never a live region
        expect(big.hasAttribute('aria-live')).toBe(false);
        expect(big.querySelector('.awc-clock')?.getAttribute('aria-label')).toBe(clockText(card));
        const row = card.querySelector('.awc-lead-row') as HTMLElement;
        expect(row.firstElementChild?.classList.contains('awc-temp-lead')).toBe(true);
        expect(row.querySelector('.awc-temp-lead')?.getAttribute('aria-live')).toBe('polite');
        // One temperature on the card, where the live reading and the slide write it
        expect(card.querySelectorAll('.temperature-value')).toHaveLength(1);
        expect(row.querySelector('.temperature-value')?.textContent).toBe('21');
        // Today's high and low share the row; the small clock steps aside for the big one
        expect(row.querySelector('.weather-desc + .awc-companion')).not.toBeNull();
        expect(card.querySelector('.location .awc-clock')).toBeNull();
    });

    it('writes the time before the forecast bundle keeps it, so the hero never stands empty', () => {
        const card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ entity: 'weather.home', hero: 'clock', dev_mode: false });
        (card as unknown as { _hass: unknown })._hass = makeHass();
        const html = (card as unknown as { heroTime(): string }).heroTime();
        expect(html).toMatch(/^\d{2}:\d{2}$/);
    });

    it('a new reading fades into the temperature on the condition\'s line', async () => {
        const card = mount({ hero: 'clock', animate: false });
        await settle();
        const hass = makeHass();
        (hass.states['weather.home'].attributes as Record<string, unknown>).temperature = 23;
        card.hass = hass;
        // The new reading fades through
        const lead = () => card.querySelector('.awc-temp-lead .temperature-value')?.textContent;
        await until(() => lead() === '23');
        expect(lead()).toBe('23');
        expect(clockText(card)).toMatch(/^\d{2}:\d{2}$/);
    });

    it('dragged, the big clock shows the hour under the needle; the away line names only another day; it comes home to now', async () => {
        const card = mount({ hero: 'clock', show_forecast: true });
        await settle();
        const slider = card.querySelector('[role="slider"]') as HTMLElement;
        for (let i = 0; i < 3; i++) slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        const at = new Date(today(new Date().getHours()).getTime() + 3 * HOUR);
        expect(clockText(card)).toBe(`${two(at.getHours())}:00`);
        const name = card.querySelector('.awc-away .awc-at')?.textContent;
        if (at.toDateString() === new Date().toDateString()) expect(name).toBe('');
        else expect(name).toMatch(/^[A-Z][a-z]{2}$/);
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        // The spring home takes about half a second, and many more frames on a busy machine
        await until(() => !card.querySelector('.animated-weather-card')!.hasAttribute('data-awc-away'));
        const now = new Date();
        expect(clockText(card)).toBe(`${two(now.getHours())}:${two(now.getMinutes())}`);
    });

    it('the date follows the time on the location line, leads it when the time is the hero, and joins the compact strip\'s quiet line', async () => {
        const date = new Intl.DateTimeFormat('en', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date());
        const small = mount({ show_clock: true, show_date: true });
        await settle();
        expect([...small.querySelector('.location')!.children].map(e => e.classList[0])).toEqual(['awc-clock', 'awc-date', 'awc-place']);
        expect(small.querySelector('.awc-date')?.textContent).toBe(date);
        expect(small.querySelector('.awc-date')?.getAttribute('aria-label')).toMatch(/day/);
        const big = mount({ hero: 'clock', show_date: true });
        await settle();
        expect([...big.querySelector('.location')!.children].map(e => e.classList[0])).toEqual(['awc-date', 'awc-place']);
        const strip = mount({ compact: true, show_date: true });
        await settle();
        expect(strip.querySelector('.compact-meta .awc-date')?.textContent).toBe(date);
        // The date alone loads what draws it
        const alone = mount({ show_date: true });
        await settle();
        expect(alone.querySelector('.awc-date')?.textContent).toBe(date);
    });

    it('sizes a big time as the widest it can show, made smaller only where that would pass the light\'s limit', () => {
        // jsdom has no fonts: a figure 0.6 of the size, "1" 0.3, the colon 0.25, a period 20 px; the clock 10 px in
        const clock = document.createElement('span');
        clock.style.fontSize = '80px';
        document.body.append(clock);
        mounted.push(clock);
        const fs = () => parseFloat(clock.style.fontSize);
        const rect = Element.prototype.getBoundingClientRect;
        const box = (width: number) => ({ x: 0, y: 0, top: 0, left: 0, bottom: 0, right: width, height: 0, width, toJSON() { return this; } }) as DOMRect;
        const spy = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
            if (this === clock) return box(100);
            if (this.localName === 'i' && this.closest('span') && clock.contains(this)) return box((this.textContent === ':' ? 0.25 : this.textContent === '1' ? 0.3 : 0.6) * fs());
            if (this.classList.contains('awc-ampm')) return box(20);
            return rect.call(this);
        });
        const ow = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth'), ol = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetLeft');
        Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, get() { return this === clock ? 100 : 0; } });
        Object.defineProperty(HTMLElement.prototype, 'offsetLeft', { configurable: true, get() { return this === clock ? 10 : 0; } });
        try {
            const sizes: Array<number | null> = [];
            const set = (size: number | null) => { sizes.push(size); clock.style.fontSize = size === null ? '80px' : `${size}px`; };
            // 24 hours: "20:58", four figures and the colon, 212 px at 80 px; inside 300 it keeps its size
            fitHeroTime(clock, 300, [], set);
            expect(sizes).toEqual([null]);
            // Past 200, it's made as small as puts the widest time at the limit, and it stays: one size all day
            sizes.length = 0;
            fitHeroTime(clock, 200, [], set);
            expect(sizes).toEqual([null, Math.floor((80 * 190) / 212 * 10) / 10]);
            expect(10 + 212 * fs() / 80).toBeLessThanOrEqual(200.5);
            // 12 hours: "1" and a figure, the minutes and the period, 208 px. The period keeps its 20 px as the figures
            // shrink, so a second look takes the rest: it ends at the limit, not short of it
            sizes.length = 0;
            fitHeroTime(clock, 200, ['AM', 'PM'], set);
            expect(sizes.slice(0, 2)).toEqual([null, Math.floor((80 * 190) / 208 * 10) / 10]);
            const right = 10 + 2.35 * fs() + 20;
            expect(right).toBeLessThanOrEqual(200.5);
            expect(right).toBeGreaterThan(198);
            // No limit (a wide card): its CSS size
            sizes.length = 0;
            fitHeroTime(clock, Infinity, [], set);
            expect(sizes).toEqual([null]);
        } finally {
            spy.mockRestore();
            if (ow) Object.defineProperty(HTMLElement.prototype, 'offsetWidth', ow);
            if (ol) Object.defineProperty(HTMLElement.prototype, 'offsetLeft', ol);
        }
    });

    it('fits the date whole: with its month, else without, and the place steps out before the date is cut', () => {
        // jsdom has no fonts: 7 px a character, 8 px between the date and the place
        const root = document.createElement('div');
        root.innerHTML = '<div class="main-weather-info"><div class="location"><span class="awc-date"></span><span class="awc-place">Lisbon</span></div></div>';
        document.body.append(root);
        mounted.push(root);
        const hass = makeHass();
        const loc = root.querySelector('.location') as HTMLElement, date = root.querySelector('.awc-date') as HTMLElement, place = root.querySelector('.awc-place') as HTMLElement;
        let width = 0;
        Object.defineProperty(loc, 'getClientRects', { value: () => [{}] });
        Object.defineProperty(loc, 'clientWidth', { get: () => width });
        Object.defineProperty(date, 'offsetWidth', { get: () => (date.textContent ?? '').length * 7 });
        Object.defineProperty(place, 'offsetLeft', { get: () => (date.textContent ?? '').length * 7 + 8 });
        Object.defineProperty(place, 'offsetWidth', { get: () => (place.textContent ?? '').length * 7 });
        const c = cardClock({ hass: () => hass } as unknown as ForecastHost, root);
        const long = shortDate(new Date(), hass as never, true), short = shortDate(new Date(), hass as never);
        const L = long.length * 7, S = short.length * 7, P = 6 * 7;
        expect(S).toBeLessThan(L);
        const at = (w: number) => { width = w; c.fit(); return [date.textContent, place.hidden]; };
        c.date();
        expect(at(L + 8 + P + 10)).toEqual([long, false]);
        expect(at(S + 8 + P + 2)).toEqual([short, false]);
        expect(at(L + 2)).toEqual([long, true]);
        expect(at(S + 2)).toEqual([short, true]);
        // Room again: the place comes back
        expect(at(L + 8 + P + 10)).toEqual([long, false]);
    });

    it('leaves the nightstand, the forecast card and dev mode their own text', async () => {
        for (const [config, type] of [[{ hero: 'clock', layout: 'nightstand' }, undefined], [{ hero: 'clock' }, 'animated-forecast-card'], [{ hero: 'clock', dev_mode: true }, undefined]] as const) {
            const card = mount(config, makeHass(), type);
            await settle();
            expect(card.querySelector('.awc-hero-clock'), JSON.stringify(config)).toBeNull();
        }
    });

    it('on the wall, the time takes the temperature\'s place and size, the date the clock\'s, and the temperature leads today\'s line', async () => {
        const proto = HTMLElement.prototype;
        const cw = Object.getOwnPropertyDescriptor(proto, 'clientWidth'), ch = Object.getOwnPropertyDescriptor(proto, 'clientHeight');
        Object.defineProperty(proto, 'clientWidth', { configurable: true, get() { return this.classList?.contains('animated-weather-card') ? 1278 : 0; } });
        Object.defineProperty(proto, 'clientHeight', { configurable: true, get() { return this.classList?.contains('animated-weather-card') ? 758 : 0; } });
        try {
            const card = mount({ hero: 'clock', show_forecast: true });
            await settle();
            const fw = card.querySelector('.fw') as HTMLElement;
            expect(fw.hasAttribute('data-hero')).toBe(true);
            expect(fw.querySelector('.fw-temp.awc-hero-clock .fw-big')?.textContent).toMatch(/^\d{2}:\d{2}$/);
            expect(fw.querySelector('.fw-when .fw-clock')).toBeNull();
            expect(fw.querySelector('.fw-when .fw-date')?.textContent).not.toBe('');
            expect(fw.querySelector('.fw-today > .fw-lead .fw-tv')?.textContent).toBe('21');
            expect(fw.querySelectorAll('.fw-tv')).toHaveLength(1);
        } finally {
            if (cw) Object.defineProperty(proto, 'clientWidth', cw); else delete (proto as { clientWidth?: number }).clientWidth;
            if (ch) Object.defineProperty(proto, 'clientHeight', ch); else delete (proto as { clientHeight?: number }).clientHeight;
        }
    });
});

describe('the clock', () => {
    it('changes only when the minute does', () => {
        const el = document.createElement('span');
        const t = new TimeText(el);
        expect(t.set({ text: '13:10' })).toBe(true);
        expect(el.textContent).toBe('13:10');
        expect(t.set({ text: '13:10' })).toBe(false);
        expect(t.set({ text: '1:11', period: 'PM' }, { animate: true })).toBe(true);
        expect(el.textContent).toBe('1:11PM');
        expect(el.querySelector('.awc-ampm')?.textContent).toBe('PM');
    });
});

describe('the forecast card\'s weather (weather_effects)', () => {
    const rainy = () => { const h = makeHass(); h.states['weather.home'].state = 'rainy'; return h; };
    type Layers = { animations: Record<string, { isActive: boolean }> };
    const active = (el: HTMLElement) => Object.entries((el as unknown as { animationController: Layers }).animationController.animations).filter(([, a]) => a.isActive).map(([k]) => k);

    it('is the sky alone by default: the condition\'s colour and light, no weather, and nothing for the slide to bring in', async () => {
        const fc = mount({}, rainy(), 'animated-forecast-card');
        const root = fc.querySelector('.animated-weather-card') as HTMLElement;
        await until(() => root.classList.contains('rainy') && !root.classList.contains('loading'));
        await new Promise(r => setTimeout(r, 400));
        expect(root.classList.contains('rainy')).toBe(true);
        expect(root.classList.contains('static')).toBe(false);
        expect(active(fc)).toEqual([]);
        // Its slide still moves, the sky to the hour, with no weather to bring in
        const slider = fc.querySelector('[role="slider"]') as HTMLElement;
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await settle();
        expect(root.classList.contains('awc-warm')).toBe(false);
        expect(active(fc)).toEqual([]);
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        // The weather card on the same weather keeps its rain
        const card = mount({}, rainy());
        await until(() => active(card).includes('rain'));
        expect(active(card)).toContain('rain');
    });

    it('with weather_effects, its rain falls as the weather card\'s does', async () => {
        const fc = mount({ weather_effects: true }, rainy(), 'animated-forecast-card');
        await until(() => active(fc).includes('rain'));
        expect(active(fc)).toContain('rain');
    });
});

describe('one needle across the page', () => {
    const heard: HourLink[] = [];
    const listen = (e: Event) => heard.push((e as CustomEvent<HourLink>).detail);
    beforeEach(() => { heard.length = 0; window.addEventListener(HOUR_EVENT, listen); });
    afterEach(() => window.removeEventListener(HOUR_EVENT, listen));

    it('the weather card says where its needle is while it moves, and once when it\'s home', async () => {
        const card = mount({ show_forecast: true });
        await settle();
        const slider = card.querySelector('[role="slider"]') as HTMLElement;
        const t0 = Date.now();
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        const moved = heard.filter(l => l.at !== null);
        expect(moved.length).toBeGreaterThan(0);
        const last = moved[moved.length - 1];
        expect(last.source).toBe(card);
        expect(last.entity).toBe('weather.home');
        expect(last.sun).toBe('sun.sun');
        expect(last.at! - t0).toBeGreaterThanOrEqual(HOUR - 1000);
        expect(last.at! - t0).toBeLessThan(HOUR + 5000);
        // The hour's own temperature, an hour on
        expect(last.temperature).toBeCloseTo(20.7, 5);
        expect(last.sky && Object.keys(last.sky).sort()).toEqual(['bottom', 'glow', 'mid', 'scrim', 'top']);
        slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        // The spring home takes about half a second, and many more frames on a busy machine
        await until(() => heard[heard.length - 1].at === null);
        await settle();
        expect(heard[heard.length - 1].at).toBeNull();
        expect(heard.filter(l => l.at === null)).toHaveLength(1);
    });


    it('the forecast card follows another card\'s needle on its weather, row, sky and days, and comes home with it', async () => {
        const fc = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        const rows = [...fc.querySelectorAll<HTMLElement>('[data-fc-day]')];
        const list = fc.querySelector('[data-fc-daily]') as HTMLElement;
        const slider = fc.querySelector('[role="slider"]') as HTMLElement;
        const other = document.createElement('div');
        const at = Date.now() + 5 * HOUR;
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at, temperature: 19.5, sky: null });
        await settle();
        // Its row went to the hour, as a finger would take it
        expect(slider.getAttribute('aria-valuenow')).toBe('5');
        expect(fc.querySelector('.fc-fcard')?.classList.contains('fc-away')).toBe(true);
        // Its days show the day the hour is in
        expect(list.hasAttribute('data-fc-follow')).toBe(true);
        expect(rows.filter(r => r.hasAttribute('data-fc-at'))).toHaveLength(1);
        // It follows quietly: nothing echoes back
        expect(heard.filter(l => l.source === fc)).toHaveLength(0);
        // Another weather's needle is not this card's
        sendHour({ source: other, entity: 'weather.away', sun: 'sun.sun', at: Date.now() + 9 * HOUR, temperature: 20, sky: null });
        await settle();
        expect(slider.getAttribute('aria-valuenow')).toBe('5');
        // Home with the card it follows
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
        await until(() => slider.getAttribute('aria-valuenow') === '0' && !list.hasAttribute('data-fc-follow'));
        expect(slider.getAttribute('aria-valuenow')).toBe('0');
        expect(list.hasAttribute('data-fc-follow')).toBe(false);
        expect(rows.some(r => r.hasAttribute('data-fc-at'))).toBe(false);
        expect(rows[0].querySelector('.fc-dot')).not.toBeNull();
        expect(heard.filter(l => l.source === fc)).toHaveLength(0);
    });

    it('a forecast card without hours takes the needle\'s sky with its days, colour only, and lets it go with the card it follows', async () => {
        const fc = mount({ show_hours: false }, makeHass(), 'animated-forecast-card');
        await settle();
        const sky = fc.querySelector('.animated-weather-card .sky') as HTMLElement;
        const other = document.createElement('div');
        const at = Date.now() + 20 * HOUR;
        const colours = { top: '#101820', mid: '#203040', bottom: '#304050', glow: 'rgba(0, 0, 0, 0)', scrim: 'rgba(0, 0, 0, 0.2)' };
        // Another weather's needle is not this card's
        sendHour({ source: other, entity: 'weather.away', sun: 'sun.sun', at, temperature: 12, sky: colours });
        expect(sky.style.getPropertyValue('--awc-sky-top')).toBe('');
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at, temperature: 12, sky: colours });
        expect(sky.style.getPropertyValue('--awc-sky-top')).toBe('#101820');
        expect(fc.querySelector('[data-fc-daily]')?.hasAttribute('data-fc-follow')).toBe(true);
        // No weather of its own comes with it
        expect(fc.querySelector('.animated-weather-card')?.classList.contains('awc-pulling')).toBe(false);
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
        expect(sky.style.getPropertyValue('--awc-sky-top')).toBe('');
        expect(fc.querySelector('[data-fc-daily]')?.hasAttribute('data-fc-follow')).toBe(false);
        // On the theme palette there's no sky to take
        const themed = mount({ show_hours: false, color_palette: 'theme' }, makeHass(), 'animated-forecast-card');
        await settle();
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at, temperature: 12, sky: colours });
        expect((themed.querySelector('.animated-weather-card .sky') as HTMLElement).style.getPropertyValue('--awc-sky-top')).toBe('');
    });

    it('a forecast card without hours takes the needle\'s weather too, as the other card shows it, and lets it go with that card', async () => {
        const rainy = makeHass();
        rainy.states['weather.home'].state = 'rainy';
        const fc = mount({ show_hours: false, weather_effects: true }, rainy, 'animated-forecast-card');
        type Layers = { animations: Record<string, { isActive: boolean }> };
        const layers = () => (fc as unknown as { animationController: Layers }).animationController.animations;
        await until(() => layers().rain.isActive);
        expect(layers().rain.isActive).toBe(true);
        const root = fc.querySelector('.animated-weather-card') as HTMLElement;
        const rain = root.querySelector('.rain-container') as HTMLElement;
        const snow = root.querySelector('.snow-container') as HTMLElement;
        const other = document.createElement('div');
        const at = Date.now() + 3 * HOUR;
        const weather = (w: Record<string, number>) => ({ rain: 0, snow: 0, sleet: 0, clouds: 0, fog: 0, wind: 0, lightning: 0, ...w });
        // Another weather's needle is not this card's
        sendHour({ source: other, entity: 'weather.away', sun: 'sun.sun', at, temperature: 2, sky: null, weather: weather({ snow: 1 }) });
        expect(rain.style.opacity).toBe('');
        // A snowy hour on the card it follows: its rain goes, snow comes in, frame by frame
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at, temperature: 2, sky: null, weather: weather({ snow: 0.4, clouds: 1 }) });
        expect(root.classList.contains('awc-warm')).toBe(true);
        expect(rain.style.opacity).not.toBe('');
        expect(parseFloat(rain.style.opacity)).toBe(0);
        expect(parseFloat(snow.style.opacity)).toBeCloseTo(0.4, 3);
        await settle();
        expect(layers().snow.isActive).toBe(true);
        // No clouds of its own
        expect(layers().clouds.isActive).toBe(false);
        // Home with that card: its own rain is back at once, the snow it took goes, and stops a moment later
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null, weather: null });
        expect(root.classList.contains('awc-warm')).toBe(false);
        expect(rain.style.opacity).toBe('');
        expect(parseFloat(snow.style.opacity)).toBe(0);
        await until(() => !layers().snow.isActive && snow.style.opacity === '', SLIDE.prewarmStop + 3000);
        expect(layers().snow.isActive).toBe(false);
        expect(snow.style.opacity).toBe('');
        expect(layers().rain.isActive).toBe(true);
        // A card that moves no weather sends none: this one keeps its own
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at, temperature: 2, sky: null, weather: null });
        expect(rain.style.opacity).toBe('');
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null, weather: null });
    });

    it('the slide sends the weather it shows under the needle; a forecast card without its weather sends none', async () => {
        const card = mount({ show_forecast: true });
        const fc = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        for (const [el, shows] of [[card, true], [fc, false]] as const) {
            heard.length = 0;
            const slider = el.querySelector('[role="slider"]') as HTMLElement;
            slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
            const moved = heard.filter(l => l.source === el && l.at !== null);
            expect(moved.length).toBeGreaterThan(0);
            const w = moved[moved.length - 1].weather;
            if (shows) expect(Object.keys(w!).sort()).toEqual(['clouds', 'fog', 'lightning', 'rain', 'sleet', 'snow', 'wind']);
            else expect(w).toBeNull();
            slider.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
            await until(() => heard[heard.length - 1]?.at === null);
        }
    });

    it('dragging the forecast card takes the weather card along; its days follow its own needle; a hand on either leads', async () => {
        const card = mount({ show_forecast: true });
        const fc = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        const own = fc.querySelector('[role="slider"]') as HTMLElement;
        const theirs = card.querySelector('[role="slider"]') as HTMLElement;
        own.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        own.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await settle();
        expect(own.getAttribute('aria-valuenow')).toBe('2');
        expect(theirs.getAttribute('aria-valuenow')).toBe('2');
        // The days follow the card's own needle
        expect(fc.querySelector('[data-fc-daily]')?.hasAttribute('data-fc-follow')).toBe(true);
        // Only the card in the hand speaks
        expect(heard.filter(l => l.source === card)).toHaveLength(0);
        expect(heard.filter(l => l.source === fc).length).toBeGreaterThan(0);
        // A hand on the weather card: it leads now, and the forecast card follows it
        heard.length = 0;
        theirs.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        await settle();
        expect(theirs.getAttribute('aria-valuenow')).toBe('3');
        expect(own.getAttribute('aria-valuenow')).toBe('3');
        expect(heard.filter(l => l.source === fc)).toHaveLength(0);
        // Home on the weather card brings both home
        theirs.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
        const daily = fc.querySelector('[data-fc-daily]') as HTMLElement;
        await until(() => theirs.getAttribute('aria-valuenow') === '0' && own.getAttribute('aria-valuenow') === '0'
            && !daily.hasAttribute('data-fc-follow') && heard.some(l => l.at === null && l.source === card));
        expect(theirs.getAttribute('aria-valuenow')).toBe('0');
        expect(own.getAttribute('aria-valuenow')).toBe('0');
        expect(fc.querySelector('[data-fc-daily]')?.hasAttribute('data-fc-follow')).toBe(false);
        expect(heard.filter(l => l.at === null && l.source === card)).toHaveLength(1);
    });
});
