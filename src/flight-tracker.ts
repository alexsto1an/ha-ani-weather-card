// Flight data plumbing for the plane fly-over overlay.
//
// The Flightradar24 integration puts a `flights` list attribute on its area
// sensors ("Current in area", "Entered area", "Exited area"). The card's
// `hass` setter fires on every state change in Home Assistant, so the same
// list is seen many times per scan; FlightTracker diffs flight ids between
// updates and reports only the flights that newly appeared.
//
// Everything here is pure (no DOM, no GSAP) so it can be unit-tested.

import { HomeAssistant } from './types';

/** One flight, normalized from a Flightradar24 `flights` entry. */
export interface FlightInfo {
    id: string;
    /** Flight number, falling back to callsign. Empty if neither is known. */
    label: string;
    /** ICAO aircraft type code, e.g. "B77W". Empty if unknown. */
    aircraftCode: string;
    altitudeFt: number | null;
    groundSpeedKt: number | null;
    /** True track in degrees, 0 = north, 90 = east. */
    heading: number | null;
    verticalSpeed: number | null;
    onGround: boolean;
}

/** Animation parameters for one pass across the card. */
export interface FlyoverPlan {
    /** 1 = left → right, -1 = right → left. */
    direction: 1 | -1;
    /** Top of the plane at entry/exit, as a percentage of the card height. */
    startYPercent: number;
    endYPercent: number;
    /** Size multiplier for the plane silhouette. */
    scale: number;
    /** Seconds to cross the card. */
    durationSec: number;
    /** Nose-up/down tilt in degrees (screen space, already signed for direction). */
    tiltDeg: number;
}

const CRUISE_ALTITUDE_FT = 38000;
const DEFAULT_ALTITUDE_FT = 24000;
const DEFAULT_GROUND_SPEED_KT = 420;
/** Vertical speed (ft/min) treated as a full climb/descent for tilt and drift. */
const FULL_CLIMB_FPM = 2000;

const toNumber = (v: unknown): number | null => {
    if (v === null || v === undefined || v === '') return null;
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) ? n : null;
};

const toText = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

const clamp = (min: number, max: number, v: number): number => Math.min(max, Math.max(min, v));

const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Normalize one raw `flights` entry. Returns null if it has no usable id. */
export function normalizeFlight(raw: unknown): FlightInfo | null {
    if (!raw || typeof raw !== 'object') return null;
    const r = raw as Record<string, unknown>;
    const id = typeof r.id === 'number' ? String(r.id) : toText(r.id);
    if (!id) return null;

    return {
        id,
        label: toText(r.flight_number) || toText(r.callsign),
        aircraftCode: toText(r.aircraft_code),
        altitudeFt: toNumber(r.altitude),
        groundSpeedKt: toNumber(r.ground_speed),
        heading: toNumber(r.heading),
        verticalSpeed: toNumber(r.vertical_speed),
        // FR24 reports 0/1; accept booleans too.
        onGround: r.on_ground === 1 || r.on_ground === true || r.on_ground === '1',
    };
}

/**
 * Read the `flights` attribute from a Flightradar24 area sensor.
 * Returns null when the entity is missing or unavailable, so a temporary
 * outage isn't mistaken for "every flight left the area".
 */
export function readFlights(hass: HomeAssistant | undefined, entityId: string | undefined): FlightInfo[] | null {
    if (!hass || !entityId) return null;
    const entity = hass.states[entityId];
    if (!entity || entity.state === 'unavailable' || entity.state === 'unknown') return null;
    const raw = entity.attributes?.flights;
    if (!Array.isArray(raw)) return [];
    const flights: FlightInfo[] = [];
    for (const entry of raw) {
        const flight = normalizeFlight(entry);
        if (flight) flights.push(flight);
    }
    return flights;
}

/**
 * Tracks which airborne flights have already been seen and reports new
 * arrivals. The first observation only seeds the set, so loading a
 * dashboard while planes are overhead doesn't fire a burst of fly-overs.
 *
 * Flights on the ground aren't counted as seen: a plane that takes off
 * from a nearby airport flies over once it's airborne.
 */
export class FlightTracker {
    private known: Set<string> | null = null;

    /** Feed the latest flight list; returns flights that newly appeared. */
    public update(flights: FlightInfo[] | null): FlightInfo[] {
        if (!flights) return [];

        const airborne = flights.filter(f => !f.onGround);
        const ids = new Set(airborne.map(f => f.id));

        if (this.known === null) {
            this.known = ids;
            return [];
        }

        const arrivals: FlightInfo[] = [];
        const added = new Set<string>();
        for (const flight of airborne) {
            if (this.known.has(flight.id) || added.has(flight.id)) continue;
            added.add(flight.id);
            arrivals.push(flight);
        }
        this.known = ids;
        return arrivals;
    }

    /** Forget everything; the next update seeds again without arrivals. */
    public reset(): void {
        this.known = null;
    }
}

/** Stable pseudo-random 0/1 from the flight id, for flights without a heading. */
const idParity = (id: string): number => {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(h) % 2;
};

/**
 * Map a flight's real data to a pass across the card:
 * - heading picks the direction (eastbound flies left → right, like a map)
 * - altitude sets height and size (cruising planes are higher and smaller)
 * - ground speed sets the crossing time; high planes also look slower
 * - vertical speed adds a gentle climb or descent
 */
export function planFlyover(flight: FlightInfo): FlyoverPlan {
    let direction: 1 | -1;
    if (flight.heading !== null) {
        const h = ((flight.heading % 360) + 360) % 360;
        direction = h < 180 ? 1 : -1;
    } else {
        direction = idParity(flight.id) === 0 ? 1 : -1;
    }

    const altitude = flight.altitudeFt ?? DEFAULT_ALTITUDE_FT;
    const altitudeRatio = clamp(0, 1, altitude / CRUISE_ALTITUDE_FT);

    const speed = flight.groundSpeedKt && flight.groundSpeedKt > 0 ? flight.groundSpeedKt : DEFAULT_GROUND_SPEED_KT;
    const speedFactor = DEFAULT_GROUND_SPEED_KT / clamp(60, 650, speed);
    const durationSec = clamp(8, 28, 14 * speedFactor * lerp(0.85, 1.25, altitudeRatio));

    const climb = clamp(-1, 1, (flight.verticalSpeed ?? 0) / FULL_CLIMB_FPM);
    // Planes fly the upper sky band, where the sun and moon live, clear of
    // the metric row: cruising traffic near the top, low traffic lower.
    const startYPercent = lerp(34, 6, altitudeRatio);
    // Climbing planes drift up the card (smaller y), descending ones drift down.
    const endYPercent = clamp(3, 40, startYPercent - climb * 6);

    return {
        direction,
        startYPercent,
        endYPercent,
        scale: lerp(1.15, 0.55, altitudeRatio),
        durationSec,
        // Nose up when climbing: counter-clockwise for rightward, clockwise for leftward.
        tiltDeg: -direction * climb * 6,
    };
}
