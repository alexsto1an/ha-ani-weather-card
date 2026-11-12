// The sun tracker's path: one continuous wave through the day, in the SVG's
// user units (the SVG stretches to the card). The tracker draws it; the
// forecast bundle places the sun on it at another card's needle
// (fc-tracker.ts), so both read the same geometry.

export const VW = 1000;
export const VH = 300;
/** Where the horizon, the noon peak and the midnight trough sit (user units). */
export interface PathGeometry { horizon: number; peak: number; trough: number; twilightRy: number }
export const REGULAR_PATH: PathGeometry = { horizon: 196, peak: 34, trough: 276, twilightRy: 78 };
/**
 * Compact: the chart spans a short strip, so the arc is lower and gentler
 * (a day, not a mountain) and the sun clears the card's top edge.
 */
export const COMPACT_PATH: PathGeometry = { horizon: 200, peak: 96, trough: 262, twilightRy: 44 };

/**
 * Normalized elevation for an hour of the day: 0 → 1 → 0 between sunrise
 * and sunset, 0 → -1 → 0 through the night. One continuous wave, so the
 * curve crosses the horizon exactly at sunrise and sunset.
 */
export function pathElevation(hour: number, riseHour: number, setHour: number): number {
    const day = setHour - riseHour;
    if (day <= 0 || day >= 24) return 0;
    if (hour >= riseHour && hour <= setHour) {
        return Math.sin(Math.PI * (hour - riseHour) / day);
    }
    const sinceSet = (((hour - setHour) % 24) + 24) % 24;
    return -Math.sin(Math.PI * sinceSet / (24 - day));
}

export const xFor = (hour: number): number => (hour / 24) * VW;
export const yFor = (elevation: number, g: PathGeometry): number =>
    elevation >= 0
        ? g.horizon - elevation * (g.horizon - g.peak)
        : g.horizon - elevation * (g.trough - g.horizon);
