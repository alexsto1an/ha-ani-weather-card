import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { areaFactor, between, FALLOUT_PX } from './particle-pool';

/** Flakes alive at once on a 420×230 card at the default snow amount. */
export const SNOW_POOL_SIZE = 36;
export const SNOW_FLAKE_SIZE: [number, number] = [2, 6];
export const SNOW_SPEED: [number, number] = [20, 38];
export const SNOW_SWAY_DEG = 10;
export const MAX_SNOW_WIND = 2.2;
export const MAX_SNOW_DRIFT = 0.13;

export function snowPoolSize(snowAmount: number, width: number, height: number): number {
    return Math.max(6, Math.round(SNOW_POOL_SIZE * snowAmount * areaFactor(width, height)));
}

export function snowWindFactor(windSpeed: number): number {
    return Math.min(MAX_SNOW_WIND, Math.max(0.3, windSpeed / DEFAULT_ENGINE_SETTINGS.windSpeed));
}

export function snowDepth(size: number): number {
    return (size - SNOW_FLAKE_SIZE[0]) / (SNOW_FLAKE_SIZE[1] - SNOW_FLAKE_SIZE[0]);
}

export function snowFall(size: number, width: number, height: number, wind: number, spill: boolean, pile?: number) {
    const depth = snowDepth(size);
    const speed = (SNOW_SPEED[0] + (SNOW_SPEED[1] - SNOW_SPEED[0]) * depth) * between(0.9, 1.1);
    const settles = pile !== undefined && Math.random() < 0.6;
    const startY = -size * 2;
    const endY = settles ? height - pile - size : height + (spill ? between(60, FALLOUT_PX) : size);
    const distance = endY - startY;
    const fallSec = Math.max(0.5, distance / speed);
    const drift = distance * between(0.04, MAX_SNOW_DRIFT) * wind;
    const x = between(-drift, Math.max(1, width - size));
    const fadeStart = settles ? fallSec : spill ? Math.min(fallSec, (height - startY) / speed) : fallSec;
    const endSec = settles ? fallSec + 0.6 : spill ? Math.max(fallSec, fadeStart + 0.1) : fallSec;
    return { startY, endY, fallSec, settles, drift, x, fadeStart, endSec };
}
