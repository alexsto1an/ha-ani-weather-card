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
