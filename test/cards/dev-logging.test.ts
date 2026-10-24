import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
import { devLog } from '../../src/utils';

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };

const hass = {
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'rainy',
            attributes: { temperature: 14, humidity: 88, friendly_name: 'Home', temperature_unit: '°C' },
        },
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
};

describe('dev logging', () => {
    const cards: Card[] = [];

    async function mount(config: object) {
        const card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...config });
        card.hass = hass;
        document.body.appendChild(card);
        cards.push(card);
        await vi.advanceTimersByTimeAsync(500);
    }

    const devLines = (spy: ReturnType<typeof vi.spyOn>) =>
        spy.mock.calls.map(args => String(args[0])).filter(line => line.startsWith('[AWC Dev]'));

    afterEach(() => {
        for (const card of cards.splice(0)) card.remove();
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('logs only when the card asking is in dev mode', () => {
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        devLog(false, 'quiet');
        devLog(undefined, 'quiet');
        devLog(true, 'heard');
        expect(devLines(spy)).toEqual(['[AWC Dev] heard']);
    });

    it('keeps a normal card quiet, even beside a card in dev mode', async () => {
        vi.useFakeTimers();
        const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
        await mount({});
        expect(devLines(spy)).toEqual([]);

        await mount({ dev_mode: true });
        const lines = devLines(spy);
        expect(lines.length).toBeGreaterThan(0);
        // The normal card's rain never shows up: only the dev card logs
        spy.mockClear();
        cards[0].hass = { ...hass, states: { 'weather.home': { ...hass.states['weather.home'], state: 'snowy' } } };
        await vi.advanceTimersByTimeAsync(4000);
        expect(devLines(spy).filter(line => /snow/i.test(line))).toEqual([]);
    });
});
