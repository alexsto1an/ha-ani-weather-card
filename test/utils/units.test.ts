import { describe, it, expect } from 'vitest';
import { precipitationUnit } from '../../src/units';

const metric = { length: 'km', mass: 'kg', temperature: '°C', volume: 'L' };
const imperial = { length: 'mi', mass: 'lb', temperature: '°F', volume: 'gal' };

describe('the rain\'s unit (precipitationUnit)', () => {
    it('is the entity\'s own, whatever the unit system', () => {
        // In 1.3.0 any unit the entity reported read as inches: the fallback's ?: took the whole ?? as its test
        expect(precipitationUnit({ precipitation_unit: 'mm' }, metric)).toBe('mm');
        expect(precipitationUnit({ precipitation_unit: 'mm' }, imperial)).toBe('mm');
        expect(precipitationUnit({ precipitation_unit: 'in' }, metric)).toBe('in');
        expect(precipitationUnit({ precipitation_unit: 'in' })).toBe('in');
    });

    it('without one, the unit system\'s: inches where it measures miles, else mm', () => {
        expect(precipitationUnit({}, imperial)).toBe('in');
        expect(precipitationUnit({}, metric)).toBe('mm');
        expect(precipitationUnit({ precipitation_unit: '' }, imperial)).toBe('in');
        expect(precipitationUnit({ precipitation_unit: null }, imperial)).toBe('in');
        expect(precipitationUnit(undefined, undefined)).toBe('mm');
    });

    it('takes the unit system\'s own rain unit first, when it says one', () => {
        expect(precipitationUnit({}, { ...metric, accumulated_precipitation: 'in' })).toBe('in');
        expect(precipitationUnit({}, { ...imperial, accumulated_precipitation: 'mm' })).toBe('mm');
    });
});
