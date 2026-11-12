import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/animated-weather-card-forecast';
import { attachSlide, SLIDE } from '../../src/fc-slide';
import { createChips, createHourly } from '../../src/fc-row';
import { TimeText } from '../../src/fc-clock';
import { glyph, glyphKey, GLYPH_KEYS, litTints } from '../../src/fc-glyphs';
import { Timeline } from '../../src/fc-core';
import { hours } from '../../src/fc-data';
import { FC_WORDS } from '../../src/fc-words';
import type { ForecastHost } from '../../src/forecast-host';
import type { ForecastEntry } from '../../src/forecast-data';

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
