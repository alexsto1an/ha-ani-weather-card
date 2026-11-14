// The unit a weather entity's rain comes in, for the forecast (the hours,
// the days, the view, the wall) and the note writer alike. Home Assistant's
// weather entities say theirs; without one, the server's unit system decides.

import type { HomeAssistant } from './types';

type UnitSystem = Partial<HomeAssistant['config']['unit_system']>;

/** The entity's precipitation_unit, else the unit system's: its accumulated_precipitation, or inches where it measures miles, else mm */
export function precipitationUnit(attributes: Record<string, unknown> | undefined, system?: UnitSystem): string {
    const own = attributes?.precipitation_unit;
    if (own !== undefined && own !== null && own !== '') return String(own);
    return system?.accumulated_precipitation || (system?.length === 'mi' ? 'in' : 'mm');
}
