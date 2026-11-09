import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { subscribeForecast, forecastTypes, forecastTypeFor, dailyTypeFor, upcoming, ForecastUpdate } from '../../src/forecast-data';

type Listener = (message: any) => void;

/** A connection whose forecast answers when the test says, counting its subscriptions */
function connection(options: { answerAtOnce?: boolean; fail?: boolean } = {}) {
    const listeners = new Map<string, Set<Listener>>();
    const subscribeMessage = vi.fn(async (listener: Listener, message: Record<string, any>) => {
        if (options.fail) throw new Error('not supported');
        const key = `${message.entity_id}|${message.forecast_type}`;
        if (!listeners.has(key)) listeners.set(key, new Set());
        listeners.get(key)!.add(listener);
        if (options.answerAtOnce) listener({ type: message.forecast_type, forecast: [{ datetime: '2026-11-09T10:00:00Z', temperature: 12 }] });
        return () => listeners.get(key)!.delete(listener);
    });
    const send = (key: string, forecast: unknown) => {
        for (const listener of listeners.get(key) ?? []) listener({ type: key.split('|')[1], forecast });
    };
    const open = () => [...listeners.values()].reduce((n, set) => n + set.size, 0);
    return { hass: { connection: { subscribeMessage } } as any, subscribeMessage, send, open };
}

describe('the page\'s forecast subscriptions', () => {
    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    it('subscribes once per entity and kind, however many cards listen', async () => {
        const ha = connection();
        const heard: ForecastUpdate[][] = [[], []];
        subscribeForecast(ha.hass, 'weather.home', 'hourly', u => heard[0].push(u));
        subscribeForecast(ha.hass, 'weather.home', 'hourly', u => heard[1].push(u));
        subscribeForecast(ha.hass, 'weather.home', 'daily', () => {});
        await vi.advanceTimersByTimeAsync(0);
        expect(ha.subscribeMessage).toHaveBeenCalledTimes(2);
        ha.send('weather.home|hourly', [{ datetime: '2026-11-09T10:00:00Z' }]);
        expect(heard[0]).toHaveLength(1);
        expect(heard[1][0]).toEqual({ type: 'hourly', forecast: [{ datetime: '2026-11-09T10:00:00Z' }] });
    });

    it('gives a card that comes later the forecast already in, at once', async () => {
        const ha = connection({ answerAtOnce: true });
        subscribeForecast(ha.hass, 'weather.home', 'daily', () => {});
        await vi.advanceTimersByTimeAsync(0);
        const later = vi.fn();
        subscribeForecast(ha.hass, 'weather.home', 'daily', later);
        expect(later).toHaveBeenCalledWith(expect.objectContaining({ type: 'daily', forecast: [expect.objectContaining({ temperature: 12 })] }));
        expect(ha.subscribeMessage).toHaveBeenCalledTimes(1);
    });

    it('keeps the subscription through a re-render, and closes it once nobody listens', async () => {
        const ha = connection();
        const stop = subscribeForecast(ha.hass, 'weather.home', 'hourly', () => {});
        await vi.advanceTimersByTimeAsync(0);
        stop();
        // The card draws again and asks at once: same subscription
        const again = subscribeForecast(ha.hass, 'weather.home', 'hourly', () => {});
        await vi.advanceTimersByTimeAsync(10_000);
        expect(ha.subscribeMessage).toHaveBeenCalledTimes(1);
        expect(ha.open()).toBe(1);
        again();
        await vi.advanceTimersByTimeAsync(5_000);
        expect(ha.open()).toBe(0);
    });

    it('says so when Home Assistant refuses, and tries again for the next card', async () => {
        const ha = connection({ fail: true });
        const heard = vi.fn();
        subscribeForecast(ha.hass, 'weather.home', 'hourly', heard);
        await vi.advanceTimersByTimeAsync(0);
        expect(heard).toHaveBeenCalledWith({ type: 'hourly', forecast: null, failed: true });
        subscribeForecast(ha.hass, 'weather.home', 'hourly', () => {});
        await vi.advanceTimersByTimeAsync(0);
        expect(ha.subscribeMessage).toHaveBeenCalledTimes(2);
    });

    it('keeps two Home Assistant connections apart', async () => {
        const a = connection();
        const b = connection();
        subscribeForecast(a.hass, 'weather.home', 'hourly', () => {});
        subscribeForecast(b.hass, 'weather.home', 'hourly', () => {});
        await vi.advanceTimersByTimeAsync(0);
        expect(a.subscribeMessage).toHaveBeenCalledTimes(1);
        expect(b.subscribeMessage).toHaveBeenCalledTimes(1);
    });

    it('does nothing without a connection', () => {
        expect(() => subscribeForecast(undefined, 'weather.home', 'hourly', () => {})()).not.toThrow();
    });
});

describe('which forecasts an entity has', () => {
    const weather = (features?: number) => ({ entity_id: 'weather.home', state: 'sunny', attributes: features === undefined ? {} : { supported_features: features } }) as any;

    it('reads Home Assistant\'s feature flags', () => {
        expect(forecastTypes(weather(3))).toEqual(['hourly', 'daily']);
        expect(forecastTypes(weather(4))).toEqual(['twice_daily']);
        expect(forecastTypes(weather(0))).toEqual([]);
        expect(forecastTypes(weather())).toEqual(['hourly', 'daily']);
    });

    it('prefers the hours for the finest, and the days for the days', () => {
        expect(forecastTypeFor(weather(3))).toBe('hourly');
        expect(forecastTypeFor(weather(5))).toBe('twice_daily');
        expect(dailyTypeFor(weather(3))).toBe('daily');
        expect(dailyTypeFor(weather(6))).toBe('twice_daily');
        expect(dailyTypeFor(weather(2))).toBeNull();
    });

    it('keeps the entries still to come, in order, the one under way included', () => {
        const at = (h: number) => ({ datetime: `2026-11-09T${String(h).padStart(2, '0')}:00:00Z` });
        const now = Date.parse('2026-11-09T10:30:00Z');
        expect(upcoming([at(12), at(9), at(10), at(11)], now, 3600_000).map(e => e.datetime)).toEqual([at(10), at(11), at(12)].map(e => e.datetime));
    });
});
