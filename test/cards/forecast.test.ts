import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/animated-weather-card-forecast';
import { attachSlide, SLIDE } from '../../src/fc-slide';
import { createChips, createHourly, hourCols } from '../../src/fc-row';
import { TimeText } from '../../src/fc-clock';
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
        const until = async (ok: () => boolean) => { for (let i = 0; i < 60 && !ok(); i++) await new Promise(r => setTimeout(r, 20)); };
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
    it('says so when the entity has no forecast', async () => {
        const hass = makeHass(0);
        const card = mount({}, hass, 'animated-forecast-card');
        await settle();
        expect(card.querySelector('.fc-empty')?.textContent).toBe(FC_WORDS.en.no_forecast);
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
        const slide = attachSlide({
            host, root, tl, ruler: { pitch: 50, el: root, setOffset: px => offsets.push(px) }, sliderHost: root, sliderLabel: 'Hours ahead',
            valueText: (s, k) => (s ? `slot ${k}` : 'Now'), onSlot: (s, k) => slots.push(s ? k : null), group: () => [],
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
        return { root, slide, offsets, slots, drag, pointer };
    }

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
    it('every hour an icon; one that repeats its neighbour\'s mark and light is quieter', () => {
        const entries = forecast();
        const rows = hours(new Timeline(entries, 'hourly', Date.now()).slots, makeHass() as never);
        const day = litTints(40, false, 0.1);
        const row = createHourly({ W: FC_WORDS.en, lang: 'en', hours: rows, metric: 'temp', has: { temp: true, feels: true, chance: true, amount: true }, noun: 'rain', pitch: 52, tints: () => day, conditionName: c => c });
        const g = [...row.el.querySelectorAll('.fc-g')];
        expect(g.every(e => e.querySelector('svg'))).toBe(true);
        expect(g[2].classList.contains('fc-rep')).toBe(true);
        expect(g[1].classList.contains('fc-rep')).toBe(false);
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
        await settle();
        await new Promise(r => setTimeout(r, 700));
        expect(heard[heard.length - 1].at).toBeNull();
        expect(heard.filter(l => l.at === null)).toHaveLength(1);
    });

    it('the forecast card shows the day the needle is in, and comes back to now', async () => {
        const fc = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        const rows = [...fc.querySelectorAll<HTMLElement>('[data-fc-day]')];
        const list = fc.querySelector('[data-fc-daily]') as HTMLElement;
        const other = document.createElement('div');
        // Tomorrow at noon, 23°
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: today(12).getTime() + 24 * HOUR, temperature: 23, sky: null });
        expect(list.hasAttribute('data-fc-follow')).toBe(true);
        expect(rows.map(r => r.hasAttribute('data-fc-at'))).toEqual([false, true, false, false, false, false, false]);
        expect(rows[1].querySelector('.fc-dot')).not.toBeNull();
        expect(rows[0].querySelector('.fc-dot')).toBeNull();
        // Another weather's needle is not this card's
        sendHour({ source: other, entity: 'weather.away', sun: 'sun.sun', at: today(12).getTime() + 48 * HOUR, temperature: 20, sky: null });
        expect(rows[2].hasAttribute('data-fc-at')).toBe(false);
        sendHour({ source: other, entity: 'weather.home', sun: 'sun.sun', at: null, temperature: null, sky: null });
        expect(list.hasAttribute('data-fc-follow')).toBe(false);
        expect(rows.some(r => r.hasAttribute('data-fc-at'))).toBe(false);
        expect(rows[0].querySelector('.fc-dot')).not.toBeNull();
    });

    it('the forecast card doesn\'t follow while it shows an hour of its own', async () => {
        const fc = mount({}, makeHass(), 'animated-forecast-card');
        await settle();
        const own = fc.querySelector('[role="slider"]') as HTMLElement;
        own.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
        sendHour({ source: document.createElement('div'), entity: 'weather.home', sun: 'sun.sun', at: today(12).getTime() + 24 * HOUR, temperature: 23, sky: null });
        expect(fc.querySelector('[data-fc-daily]')?.hasAttribute('data-fc-follow')).toBe(false);
    });
});
