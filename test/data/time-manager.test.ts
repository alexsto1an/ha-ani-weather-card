import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TimeOfDayManager } from '../../src/time-manager';

/**
 * Walk through a full 24-hour day at 15-minute steps and return a list of
 * (hour, timePhase) pairs. Helper for exhaustively checking the phase
 * detector across both normal and wrap-around configurations.
 */
function phasesForDay(manager: TimeOfDayManager): Array<[number, string]> {
    const phases: Array<[number, string]> = [];
    for (let m = 0; m < 24 * 60; m += 15) {
        vi.setSystemTime(new Date(2026, 0, 1, Math.floor(m / 60), m % 60));
        // Force the manager to recompute by calling getCurrentState which
        // reads the freshly-mocked clock.
        const state = (manager as unknown as { updateState: () => void; getCurrentState: () => { timePhase: string } });
        state.updateState();
        phases.push([m / 60, state.getCurrentState().timePhase]);
    }
    return phases;
}

describe('TimeOfDayManager wrap-around math', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it('classifies every hour into exactly one phase for a normal day', () => {
        // sunrise=6, sunset=20 → dawn 5..6.5 / day 6.5..19.5 / dusk 19.5..21 / night otherwise
        const mgr = new TimeOfDayManager({
            enableDayNightCycle: true,
            sunriseHour: 6,
            sunsetHour: 20,
        });
        const phases = phasesForDay(mgr);
        const valid = new Set(['dawn', 'day', 'dusk', 'night']);
        for (const [, phase] of phases) {
            expect(valid.has(phase)).toBe(true);
        }
    });

    it('handles sunriseHour=0 without leaving a "dead" hour around midnight', () => {
        // dawnStart = 23, dayStart = 0.5. The old `>= 23 && < 0.5` check
        // never matched anything — confirm the wrap-around helper closes
        // that hole.
        const mgr = new TimeOfDayManager({
            enableDayNightCycle: true,
            sunriseHour: 0,
            sunsetHour: 12,
        });
        const phases = phasesForDay(mgr);
        // Every quarter hour must be classified; "night" is the fallback,
        // so an exhaustive sweep proves no quarter-hour fell through silently.
        const valid = new Set(['dawn', 'day', 'dusk', 'night']);
        for (const [, phase] of phases) {
            expect(valid.has(phase)).toBe(true);
        }
        // Specifically at 23:30 the phase must be `dawn` (before sunrise=0).
        const at2330 = phases.find(([h]) => h === 23.5);
        expect(at2330?.[1]).toBe('dawn');
    });

    it('handles sunsetHour=23 (dusk wraps past midnight)', () => {
        const mgr = new TimeOfDayManager({
            enableDayNightCycle: true,
            sunriseHour: 6,
            sunsetHour: 23,
        });
        const phases = phasesForDay(mgr);
        // duskStart = 22.5, nightStart = 0 → dusk runs 22.5..24.
        const at2245 = phases.find(([h]) => h === 22.75);
        expect(at2245?.[1]).toBe('dusk');
    });

    it('respects the dev override regardless of clock', () => {
        const mgr = new TimeOfDayManager({
            enableDayNightCycle: true,
            sunriseHour: 6,
            sunsetHour: 20,
        });
        vi.setSystemTime(new Date(2026, 0, 1, 12, 0));
        mgr.setDevOverride('night');
        expect(mgr.getCurrentState().timePhase).toBe('night');
        mgr.clearDevOverride();
        expect(mgr.getCurrentState().timePhase).toBe('day');
    });
});
