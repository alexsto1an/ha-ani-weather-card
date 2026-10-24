import { describe, it, expect } from 'vitest';
import { normalizeFlight, readFlights, FlightTracker, planFlyover, FlightInfo } from '../../src/flight-tracker';
import type { HomeAssistant } from '../../src/types';

function makeHass(states: Record<string, { state: string; attributes: Record<string, unknown> }>): HomeAssistant {
    const full: Record<string, unknown> = {};
    for (const [id, s] of Object.entries(states)) {
        full[id] = { entity_id: id, ...s, context: { id: 'x' }, last_changed: '', last_updated: '' };
    }
    return { states: full } as unknown as HomeAssistant;
}

function flight(id: string, overrides: Partial<FlightInfo> = {}): FlightInfo {
    return {
        id,
        label: id.toUpperCase(),
        aircraftCode: '',
        altitudeFt: 30000,
        groundSpeedKt: 420,
        heading: 90,
        verticalSpeed: 0,
        onGround: false,
        ...overrides,
    };
}

describe('normalizeFlight', () => {
    it('maps Flightradar24 fields and coerces numbers', () => {
        expect(normalizeFlight({
            id: '3a5b1c2d',
            flight_number: 'BA117',
            callsign: 'BAW117',
            aircraft_code: 'B77W',
            altitude: '36000',
            ground_speed: 480,
            heading: 271,
            vertical_speed: -64,
            on_ground: 0,
        })).toEqual({
            id: '3a5b1c2d',
            label: 'BA117',
            aircraftCode: 'B77W',
            altitudeFt: 36000,
            groundSpeedKt: 480,
            heading: 271,
            verticalSpeed: -64,
            onGround: false,
        });
    });

    it('falls back to callsign when there is no flight number', () => {
        expect(normalizeFlight({ id: 'a', flight_number: '', callsign: ' N123AB ' })?.label).toBe('N123AB');
    });

    it('accepts numeric ids and 0/1, true or "1" for on_ground', () => {
        expect(normalizeFlight({ id: 42, on_ground: 1 })).toMatchObject({ id: '42', onGround: true });
        expect(normalizeFlight({ id: 'b', on_ground: true })?.onGround).toBe(true);
        expect(normalizeFlight({ id: 'c', on_ground: '1' })?.onGround).toBe(true);
    });

    it('treats missing or non-numeric values as unknown, not zero', () => {
        expect(normalizeFlight({ id: 'a', altitude: null, ground_speed: 'n/a', heading: undefined })).toMatchObject({
            altitudeFt: null,
            groundSpeedKt: null,
            heading: null,
        });
    });

    it('rejects entries without an id', () => {
        expect(normalizeFlight({ flight_number: 'BA1' })).toBeNull();
        expect(normalizeFlight({ id: '' })).toBeNull();
        expect(normalizeFlight(null)).toBeNull();
        expect(normalizeFlight('BA1')).toBeNull();
    });
});

describe('readFlights', () => {
    const entity = 'sensor.flightradar24_current_in_area';

    it('returns null when there is no hass, entity id, or entity', () => {
        expect(readFlights(undefined, entity)).toBeNull();
        expect(readFlights(makeHass({}), undefined)).toBeNull();
        expect(readFlights(makeHass({}), entity)).toBeNull();
    });

    it('returns null while the sensor is unavailable or unknown', () => {
        expect(readFlights(makeHass({ [entity]: { state: 'unavailable', attributes: {} } }), entity)).toBeNull();
        expect(readFlights(makeHass({ [entity]: { state: 'unknown', attributes: {} } }), entity)).toBeNull();
    });

    it('returns an empty list when the attribute is missing or not a list', () => {
        expect(readFlights(makeHass({ [entity]: { state: '0', attributes: {} } }), entity)).toEqual([]);
        expect(readFlights(makeHass({ [entity]: { state: '0', attributes: { flights: 'none' } } }), entity)).toEqual([]);
    });

    it('keeps valid entries and drops malformed ones', () => {
        const hass = makeHass({
            [entity]: { state: '2', attributes: { flights: [{ id: 'a' }, null, { callsign: 'X' }, { id: 'b' }] } },
        });
        expect(readFlights(hass, entity)?.map(f => f.id)).toEqual(['a', 'b']);
    });
});

describe('FlightTracker', () => {
    it('seeds silently on the first update so a dashboard load does not replay planes', () => {
        const tracker = new FlightTracker();
        expect(tracker.update([flight('a'), flight('b')])).toEqual([]);
    });

    it('reports only flights that newly appeared', () => {
        const tracker = new FlightTracker();
        tracker.update([flight('a')]);
        expect(tracker.update([flight('a'), flight('b')]).map(f => f.id)).toEqual(['b']);
        expect(tracker.update([flight('a'), flight('b')])).toEqual([]);
    });

    it('reports a flight again if it leaves and comes back', () => {
        const tracker = new FlightTracker();
        tracker.update([flight('a')]);
        tracker.update([]);
        expect(tracker.update([flight('a')]).map(f => f.id)).toEqual(['a']);
    });

    it('keeps its state through a sensor outage (null) instead of treating it as empty', () => {
        const tracker = new FlightTracker();
        tracker.update([flight('a')]);
        expect(tracker.update(null)).toEqual([]);
        expect(tracker.update([flight('a')])).toEqual([]);
    });

    it('ignores planes on the ground until they take off', () => {
        const tracker = new FlightTracker();
        tracker.update([]);
        expect(tracker.update([flight('a', { onGround: true })])).toEqual([]);
        expect(tracker.update([flight('a')]).map(f => f.id)).toEqual(['a']);
    });

    it('reports a duplicated id once', () => {
        const tracker = new FlightTracker();
        tracker.update([]);
        expect(tracker.update([flight('a'), flight('a')])).toHaveLength(1);
    });

    it('seeds again after reset', () => {
        const tracker = new FlightTracker();
        tracker.update([flight('a')]);
        tracker.reset();
        expect(tracker.update([flight('a'), flight('b')])).toEqual([]);
    });
});

describe('planFlyover', () => {
    it('flies eastbound flights left to right and westbound right to left', () => {
        expect(planFlyover(flight('a', { heading: 90 })).direction).toBe(1);
        expect(planFlyover(flight('a', { heading: 0 })).direction).toBe(1);
        expect(planFlyover(flight('a', { heading: 180 })).direction).toBe(-1);
        expect(planFlyover(flight('a', { heading: 270 })).direction).toBe(-1);
    });

    it('normalizes headings outside 0-360', () => {
        expect(planFlyover(flight('a', { heading: 450 })).direction).toBe(1);
        expect(planFlyover(flight('a', { heading: -90 })).direction).toBe(-1);
    });

    it('picks a stable direction from the id when heading is unknown', () => {
        const first = planFlyover(flight('abc', { heading: null })).direction;
        expect(planFlyover(flight('abc', { heading: null })).direction).toBe(first);
    });

    it('draws higher planes smaller and nearer the top of the card', () => {
        const low = planFlyover(flight('a', { altitudeFt: 3000 }));
        const high = planFlyover(flight('a', { altitudeFt: 37000 }));
        expect(high.scale).toBeLessThan(low.scale);
        expect(high.startYPercent).toBeLessThan(low.startYPercent);
    });

    it('keeps every pass in the upper sky, clear of the metric row', () => {
        for (const altitudeFt of [0, 3000, 20000, 38000, null]) {
            for (const verticalSpeed of [-4000, 0, 4000]) {
                const plan = planFlyover(flight('a', { altitudeFt, verticalSpeed }));
                expect(Math.max(plan.startYPercent, plan.endYPercent)).toBeLessThanOrEqual(40);
                expect(Math.min(plan.startYPercent, plan.endYPercent)).toBeGreaterThanOrEqual(3);
            }
        }
    });

    it('clamps altitude above cruise to the cruise position', () => {
        expect(planFlyover(flight('a', { altitudeFt: 60000 }))).toEqual(planFlyover(flight('a', { altitudeFt: 38000 })));
    });

    it('crosses faster for faster planes and stays within 8-28 seconds', () => {
        const slow = planFlyover(flight('a', { groundSpeedKt: 150, altitudeFt: 30000 }));
        const fast = planFlyover(flight('a', { groundSpeedKt: 550, altitudeFt: 30000 }));
        expect(fast.durationSec).toBeLessThan(slow.durationSec);
        for (const speed of [0, 1, 60, 2000, null]) {
            const d = planFlyover(flight('a', { groundSpeedKt: speed })).durationSec;
            expect(d).toBeGreaterThanOrEqual(8);
            expect(d).toBeLessThanOrEqual(28);
        }
    });

    it('drifts up and tilts nose-up while climbing, in either direction', () => {
        const east = planFlyover(flight('a', { heading: 90, verticalSpeed: 2500 }));
        expect(east.endYPercent).toBeLessThan(east.startYPercent);
        expect(east.tiltDeg).toBeLessThan(0);

        const west = planFlyover(flight('a', { heading: 270, verticalSpeed: 2500 }));
        expect(west.endYPercent).toBeLessThan(west.startYPercent);
        expect(west.tiltDeg).toBeGreaterThan(0);

        const level = planFlyover(flight('a', { verticalSpeed: 0 }));
        expect(level.endYPercent).toBe(level.startYPercent);
        expect(Math.abs(level.tiltDeg)).toBe(0);
    });
});
