import { describe, it, expect } from 'vitest';
import {
    AircraftFamily, FORWARD_PITCH_DEG, MAX_PLANE_PX, MIN_PLANE_PX, aircraftDrawing, aircraftFamily, aircraftLength, planeLengthPx,
} from '../../src/aircraft';

const FAMILIES: AircraftFamily[] = ['narrow', 'wide', 'quad', 'rear', 'prop', 'light', 'heli'];

describe('aircraft families', () => {
    it('picks each family from the ICAO type code a flight reports', () => {
        const cases: Record<AircraftFamily, string[]> = {
            narrow: ['A20N', 'A320', 'A321', 'A21N', 'A319', 'B738', 'B38M', 'B39M', 'B752', 'BCS3', 'E190', 'E75L', 'E295', 'C919'],
            wide: ['B789', 'B788', 'B77W', 'B772', 'A359', 'A35K', 'A333', 'A339', 'B763', 'A306', 'MD11'],
            quad: ['B744', 'B748', 'BLCF', 'A388', 'A346', 'IL96', 'RJ85'],
            rear: ['CRJ9', 'CRJ2', 'E145', 'E135', 'MD88', 'B712', 'F100', 'C68A', 'C56X', 'C25B', 'GLF6', 'GLEX', 'CL35', 'LJ45', 'FA7X', 'E55P', 'PC24', 'HDJT'],
            prop: ['AT76', 'AT45', 'DH8D', 'DH8A', 'SF34', 'D328', 'JS41', 'B190', 'BE20', 'L410', 'C130'],
            light: ['C172', 'C152', 'C182', 'C208', 'PA28', 'P28A', 'SR22', 'DA40', 'BE36', 'M20P', 'PC12', 'TBM9'],
            heli: ['EC35', 'EC45', 'H145', 'H160', 'AS50', 'A139', 'A109', 'R44', 'R22', 'B06', 'B407', 'S76', 'S92'],
        };
        for (const [family, codes] of Object.entries(cases)) {
            for (const code of codes) expect(aircraftFamily(code), code).toBe(family);
        }
    });

    it('flies an unknown or missing type as a narrow-body, and reads codes loosely', () => {
        expect(aircraftFamily('')).toBe('narrow');
        expect(aircraftFamily('ZZZZ')).toBe('narrow');
        expect(aircraftFamily(' b789 ')).toBe('wide');
    });

    it('gives business jets their own length, and the rest their family\'s', () => {
        expect(aircraftLength('C68A')).toBeCloseTo(19, 0);
        expect(aircraftLength('HDJT')).toBeCloseTo(13, 0);
        expect(aircraftLength('GLF6')).toBeCloseTo(30.4, 1);
        // A business jet is shorter than the CRJ its family is drawn from
        expect(aircraftLength('C68A')).toBeLessThan(aircraftLength('CRJ9'));
        expect(aircraftLength('A20N')).toBeCloseTo(37.6, 1);
        expect(aircraftLength('B748')).toBeGreaterThan(aircraftLength('B789'));
    });
});

describe('plane sizes', () => {
    it('grows with the aircraft, less than in life', () => {
        const a320 = planeLengthPx(37.57, 0.6, 56);
        const b747 = planeLengthPx(76.3, 0.6, 56);
        expect(a320).toBeCloseTo(56 * 0.6, 5);
        expect(b747).toBeGreaterThan(a320 * 1.4);
        expect(b747).toBeLessThan(a320 * 2);
    });

    it(`stays between ${MIN_PLANE_PX} and ${MAX_PLANE_PX} px, so a low jumbo never covers the temperature`, () => {
        expect(planeLengthPx(76.3, 1.15, 56)).toBe(MAX_PLANE_PX);
        expect(planeLengthPx(9.4, 0.55, 56)).toBe(MIN_PLANE_PX);
    });
});

describe('aircraft drawings', () => {
    it.each(FAMILIES)('draws the %s family from the side, nose right, with its lights', (family) => {
        const d = aircraftDrawing(family);
        expect(d.svg).toMatch(/^<svg class="plane-svg" viewBox="[-\d. ]+" aria-hidden="true">/);
        expect(d.svg).not.toMatch(/NaN|Infinity/);
        expect(d.aspect).toBeGreaterThan(0.15);
        expect(d.aspect).toBeLessThan(0.8);
        expect(d.lengthFrac).toBeGreaterThan(0.75);
        expect(d.lengthFrac).toBeLessThanOrEqual(1);
        expect(d.midTop).toBeGreaterThan(20);
        expect(d.midTop).toBeLessThan(95);
        // The near side's lights, all inside the drawing
        expect(d.lights.map(l => l.kind).sort()).toEqual(['beacon', 'nav', 'strobe', 'tail']);
        for (const l of d.lights) {
            expect(l.left, `${family} ${l.kind}`).toBeGreaterThanOrEqual(0);
            expect(l.left).toBeLessThanOrEqual(100);
            expect(l.top).toBeGreaterThanOrEqual(0);
            expect(l.top).toBeLessThanOrEqual(100);
        }
        // The tail light is at the back, on the left of a plane facing right
        expect(d.lights.find(l => l.kind === 'tail')!.left).toBeLessThan(15);
    });

    it('draws each family once', () => {
        expect(aircraftDrawing('wide')).toBe(aircraftDrawing('wide'));
    });

    it('draws propellers and rotors faint', () => {
        expect(aircraftDrawing('prop').svg).toContain('stroke-opacity');
        expect(aircraftDrawing('heli').svg).toContain('fill-opacity');
        expect(aircraftDrawing('narrow').svg).not.toContain('stroke-opacity');
        // The rotor reaches past the helicopter's nose
        expect(aircraftDrawing('heli').lengthFrac).toBeLessThan(0.95);
    });

    it('tilts only a helicopter forward', () => {
        expect(FORWARD_PITCH_DEG.heli).toBeGreaterThan(0);
        expect(FORWARD_PITCH_DEG.narrow).toBeUndefined();
    });
});
