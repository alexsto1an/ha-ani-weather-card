// ParticlePool - a fixed set of particle elements that recycle

import type { GSAPAnimation, GSAPTimeline } from './types';

type PoolAnimation = GSAPAnimation | GSAPTimeline;
export const FALLOUT_PX = 120;

/**
 * Runs one cycle of a particle (one fall, one pass) and calls `next` when
 * it ends. `warm` is true for each particle's first cycle: the pool starts
 * full, so that cycle should begin part-way through (see `prewarm`).
 */
export type PoolCycle = (el: HTMLElement, next: () => void, warm: boolean) => PoolAnimation;

interface PoolItem {
    el: HTMLElement;
    anim?: PoolAnimation;
    /** Let go: it finishes its cycle and leaves at its end */
    retiring?: boolean;
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
        /** A particle that has left (resize): what else the animation keeps for it goes too */
        private readonly onRetire?: (el: HTMLElement) => void,
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
        if (item.retiring) {
            this.retire(item);
            return;
        }
        item.el.style.visibility = '';
        item.anim = this.cycle(item.el, () => this.run(item, false), warm);
        if (this.paused) item.anim.pause();
    }

    /**
     * Grow or shrink to `count` without a snap. New particles start their first cycle from its beginning (rain from
     * above the card), spread over `staggerSec` so they don't arrive as a sheet, and wait unseen until then. A particle
     * let go finishes the cycle it's in (its fall) and leaves at its end. Growing again first keeps ones on their way
     * out. `quick` is the slide's, where an hour shows its own at once: new particles start part-way through their
     * cycle, as the pool's first ones do, and the ones let go step out of sight at once (they still leave at the end
     * of their cycle). Returns the new elements.
     */
    resize(count: number, staggerSec = 1, quick = false): HTMLElement[] {
        if (!this.running) return [];
        const target = Math.max(0, Math.round(count));
        const live = this.items.filter(item => !item.retiring);
        if (target < live.length) {
            live.slice(target).forEach(item => {
                item.retiring = true;
                if (quick) item.el.style.visibility = 'hidden';
            });
            return [];
        }
        let missing = target - live.length;
        for (const item of this.items) {
            if (missing <= 0) break;
            if (item.retiring) {
                item.retiring = false;
                if (item.anim) item.el.style.visibility = '';
                missing--;
            }
        }
        const gsap = window.AnimatedWeatherCardGsap;
        const created: HTMLElement[] = [];
        for (let i = 0; i < missing; i++) {
            const el = this.create(this.items.length);
            el.style.visibility = 'hidden';
            this.layer.appendChild(el);
            const item: PoolItem = { el };
            this.items.push(item);
            created.push(el);
            const delay = quick ? 0 : staggerSec * Math.random();
            if (quick) {
                this.run(item, true);
            } else if (gsap?.delayedCall && delay > 0) {
                item.anim = gsap.delayedCall(delay, () => this.run(item, false)) as PoolAnimation;
                if (this.paused) item.anim.pause();
            } else {
                this.run(item, false);
            }
        }
        return created;
    }

    /** The particles that stay: not on their way out */
    get live(): number {
        return this.items.filter(item => !item.retiring).length;
    }

    private retire(item: PoolItem): void {
        item.anim?.kill();
        window.AnimatedWeatherCardGsap?.killTweensOf(item.el);
        item.el.remove();
        this.items = this.items.filter(other => other !== item);
        this.onRetire?.(item.el);
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
