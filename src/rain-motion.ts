import { areaFactor, between, FALLOUT_PX } from './particle-pool';
import type { RainKind } from './types';

export const RAIN_POOL_SIZE: Record<RainKind, number> = { light: 10, rain: 18, storm: 24, pouring: 32 };
export const RAIN_SPEED: Record<RainKind, [number, number]> = {
    light: [300, 380], rain: [420, 520], storm: [520, 620], pouring: [620, 760],
};
export const RAIN_DROP_LENGTH: Record<RainKind, number> = { light: 16, rain: 24, storm: 34, pouring: 42 };
export const RAIN_SPLASH_SHARE = 0.3;
export const RAIN_SPLASH_DOTS = 16;
export const RAIN_REBOUNDS = 8;
export const RAIN_JOIN_STAGGER = 0.8;
export const RAIN_REBOUND_RISE: [number, number] = [10, 30];
export const MAX_REBOUND_REACH = 48;

/** Length of a quadratic Bezier from the origin, by sampling. */
export function quadraticLength(cx: number, cy: number, ex: number, ey: number): number {
    let length = 0;
    let px = 0;
    let py = 0;
    for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        const x = 2 * (1 - t) * t * cx + t * t * ex;
        const y = 2 * (1 - t) * t * cy + t * t * ey;
        length += Math.hypot(x - px, y - py);
        px = x;
        py = y;
    }
    return length;
}

export function rainPoolSize(kind: RainKind, rainAmount: number, width: number, height: number): number {
    return Math.max(4, Math.round(RAIN_POOL_SIZE[kind] * rainAmount * areaFactor(width, height)));
}

export function rainDropWidth(kind: RainKind): number {
    return between(1, kind === 'pouring' ? 3 : 2.4);
}

export function rainDropOpacity(width: number): number {
    return 0.55 + 0.45 * Math.min(1, width / 2.4);
}

export function rainFall(kind: RainKind, width: number, height: number, spill: boolean, splashEnabled: boolean) {
    const length = RAIN_DROP_LENGTH[kind];
    const speed = between(...RAIN_SPEED[kind]);
    const x = between(6, Math.max(7, width - 6));
    const splash = splashEnabled && Math.random() < RAIN_SPLASH_SHARE;
    const startY = -length;
    const endY = splash ? height - length : spill ? height + between(60, FALLOUT_PX) : height;
    // A card that isn't laid out yet idles instead of spinning.
    const fallSec = Math.max(0.25, (endY - startY) / speed);
    const fadeStart = splash ? fallSec : spill ? height / speed : fallSec;
    const endSec = splash ? fallSec + length / speed : fallSec;
    return { length, x, splash, startY, endY, fallSec, fadeStart, endSec };
}

export function rainDot(side: number, bounce: number) {
    const duration = between(0.22, 0.28);
    const rise = between(4, 10) * bounce;
    const spread = side * between(6, 12) * bounce;
    return { duration, rise, spread };
}

export function rainRebound(bounce: number) {
    const rise = between(...RAIN_REBOUND_RISE) * bounce;
    const reach = (Math.random() < 0.5 ? -1 : 1) * between(10, MAX_REBOUND_REACH / 2) * bounce;
    const fall = between(6, 18);
    const length = quadraticLength(reach, -2 * rise, 2 * reach, fall);
    const streak = Math.min(length * 0.45, 6 + rise * 0.3);
    const duration = between(0.42, 0.56);
    return { rise, reach, fall, length, streak, duration };
}
