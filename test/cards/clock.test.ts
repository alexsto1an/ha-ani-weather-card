import { describe, it, expect, afterEach, vi } from 'vitest';
import { MinuteTicker } from '../../src/clock';

describe('the clock\'s minute', () => {
    afterEach(() => { vi.useRealTimers(); });

    it('reads the time at once, then on each minute boundary, never between', async () => {
        vi.useFakeTimers({ now: new Date(2026, 10, 9, 14, 32, 41, 500) });
        const ticks: string[] = [];
        const ticker = new MinuteTicker(() => {
            const d = new Date();
            ticks.push(`${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`);
        });
        ticker.start();
        expect(ticks).toEqual(['14:32']);
        await vi.advanceTimersByTimeAsync(18_000);
        expect(ticks).toEqual(['14:32']);
        await vi.advanceTimersByTimeAsync(1_000);
        expect(ticks).toEqual(['14:32', '14:33']);
        await vi.advanceTimersByTimeAsync(120_000);
        expect(ticks).toEqual(['14:32', '14:33', '14:34', '14:35']);
        ticker.stop();
    });

    it('rests while stopped, and reads the time again the moment it starts', async () => {
        vi.useFakeTimers({ now: new Date(2026, 10, 9, 14, 0, 0) });
        const tick = vi.fn();
        const ticker = new MinuteTicker(tick);
        ticker.start();
        ticker.stop();
        await vi.advanceTimersByTimeAsync(10 * 60_000);
        expect(tick).toHaveBeenCalledTimes(1);
        ticker.start();
        expect(tick).toHaveBeenCalledTimes(2);
        // Starting twice doesn't tick twice
        ticker.start();
        expect(tick).toHaveBeenCalledTimes(2);
        ticker.stop();
    });
});

describe('the clock on the weather card', () => {
    type Card = HTMLElement & { setConfig(c: object): void; hass: unknown; setAnimationsPaused(p: boolean): void };
    const hass = (timeFormat = '24') => ({
        states: { 'weather.home': { entity_id: 'weather.home', state: 'sunny', attributes: { temperature: 21, friendly_name: 'Home' } } },
        config: { time_zone: 'Asia/Tokyo' },
        language: 'en',
        locale: { language: 'en', time_format: timeFormat, time_zone: 'server' },
        localize: () => '',
    });
    const mount = async (config: object, timeFormat = '24') => {
        const card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ entity: 'weather.home', show_clock: true, ...config });
        document.body.appendChild(card);
        card.hass = hass(timeFormat);
        await vi.advanceTimersByTimeAsync(300);
        return card;
    };
    afterEach(() => { document.body.replaceChildren(); });

    it('shows the time in the profile\'s time zone and format, on the line its design gives it', async () => {
        vi.useFakeTimers({ now: new Date('2026-11-10T10:07:30Z') });
        await import('../../src/animated-weather-card');
        const c = await mount({ review_clock: 'c' });
        expect(c.querySelector('.awc-headline .awc-clock-time')!.textContent).toBe('19:07');
        expect(c.querySelector('.awc-headline-place')!.textContent).toBe('Home');
        expect(c.querySelector('.awc-clock-spoken')!.textContent).toMatch(/^19:07, Tuesday/);
        const a = await mount({ review_clock: 'a' }, '12');
        expect(a.querySelector('.main-weather-info > .awc-clock .awc-clock-time')!.textContent).toBe('7:07');
        expect(a.querySelector('.awc-clock-period')!.textContent).toBe('PM');
    });

    it('rests while the card does, and reads the time the moment it\'s back', async () => {
        vi.useFakeTimers({ now: new Date('2026-11-10T10:07:30Z') });
        await import('../../src/animated-weather-card');
        const card = await mount({ review_clock: 'b' });
        const time = () => card.querySelector('.awc-clock-time')!.textContent;
        card.setAnimationsPaused(true);
        await vi.advanceTimersByTimeAsync(5 * 60_000);
        expect(time()).toBe('19:07');
        card.setAnimationsPaused(false);
        expect(time()).toBe('19:12');
    });
});
