// ParticlePool - a fixed set of particle elements that recycle

import type { GSAPAnimation, GSAPTimeline } from './types';

type PoolAnimation = GSAPAnimation | GSAPTimeline;

/**
 * Runs one cycle of a particle (one fall, one pass) and calls `next` when
 * it ends. `warm` is true for each particle's first cycle: the pool starts
 * full, so that cycle should begin part-way through (see `prewarm`).
 */
export type PoolCycle = (el: HTMLElement, next: () => void, warm: boolean) => PoolAnimation;

interface PoolItem {
    el: HTMLElement;
    anim?: PoolAnimation;
}

/**
 * A fixed population of particles. Each element is created once and runs
 * cycle after cycle, so density stays the same through pauses and the page
 * isn't creating and removing nodes several times a second.
 */
export class ParticlePool {
    private items: PoolItem[] = [];
    private running = false;
    private paused = false;

    constructor(
        private readonly layer: Element,
        private readonly create: (index: number) => HTMLElement,
        private readonly cycle: PoolCycle,
    ) {}

    /** Create `count` particles and start them. Returns the new elements. */
    start(count: number): HTMLElement[] {
        this.running = true;
        const created: HTMLElement[] = [];
        for (let i = 0; i < count; i++) {
            const el = this.create(i);
            this.layer.appendChild(el);
            const item: PoolItem = { el };
            this.items.push(item);
            created.push(el);
            this.run(item, true);
        }
        return created;
    }

    private run(item: PoolItem, warm: boolean): void {
        // A cycle can end after stop(); never start another one then.
        if (!this.running) return;
        item.anim = this.cycle(item.el, () => this.run(item, false), warm);
        if (this.paused) item.anim.pause();
    }

    pause(): void {
        this.paused = true;
        this.items.forEach(item => item.anim?.pause());
    }

    resume(): void {
        this.paused = false;
        this.items.forEach(item => item.anim?.resume());
    }

    stop(): void {
        this.running = false;
        this.items.forEach(item => {
            item.anim?.kill();
            window.AnimatedWeatherCardGsap?.killTweensOf(item.el);
            item.el.remove();
        });
        this.items = [];
    }

    get size(): number {
        return this.items.length;
    }

    get elements(): HTMLElement[] {
        return this.items.map(item => item.el);
    }
}

/**
 * Start a pool's first cycle part-way through, so particles are spread
 * evenly over their path instead of all entering from the top together.
 */
export function prewarm<T extends PoolAnimation>(anim: T, warm: boolean): T {
    if (warm) anim.progress(Math.random());
    return anim;
}

const REFERENCE_CARD_AREA = 420 * 230;

/**
 * How much a particle population should grow with the card's area, so a
 * wall tablet isn't sparse and a small tile isn't crowded.
 */
export function areaFactor(width: number, height: number): number {
    return Math.min(3, Math.max(0.6, (width * height) / REFERENCE_CARD_AREA)) || 1;
}

/** Uniform random number in [min, max). */
export function between(min: number, max: number): number {
    return min + Math.random() * (max - min);
}
