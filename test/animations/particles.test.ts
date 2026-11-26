import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParticlePool, prewarm } from '../../src/particle-pool';
import { RainAnimation, RAIN_SPEED, RAIN_POOL_SIZE, RAIN_REBOUND_RISE, rainPoolSize, quadraticLength } from '../../src/rain-animation';
import { SnowAnimation, SNOW_SPEED, snowPoolSize } from '../../src/snow-animation';
import { SleetAnimation } from '../../src/sleet-animation';
import { createGSAPCloud, createGSAPSwoosh, CLOUD_LAYERS, driftWindFactor, removeClouds, cloudShape, cloudPartMask } from '../../src/gsap-effects';
import { WindAnimation, MAX_LEAVES, MAX_SWOOSHES, LEAF_GAP_MS } from '../../src/wind-animation';
import { LightningAnimation, LIGHTNING_FIRST_FLASH_MS, LIGHTNING_INTERVAL_MS, LIGHTNING_JOLT_DELAY_SEC } from '../../src/lightning-animation';
import { pauseCardGSAPAnimations, resumeCardGSAPAnimations } from '../../src/utils';
import { gsap as realGsap } from 'gsap';
import type { FakeTimeline } from '../setup';

type GsapMock = { timeline: ReturnType<typeof vi.fn> };
const gsap = (): GsapMock => (window as unknown as { AnimatedWeatherCardGsap: GsapMock }).AnimatedWeatherCardGsap;

/** Swap the stub for GSAP itself, for what depends on how it treats paused children. */
const useRealGsap = () => {
    (window as unknown as { AnimatedWeatherCardGsap: unknown }).AnimatedWeatherCardGsap = realGsap;
};

/** Timelines created so far, oldest first. */
const timelines = (): FakeTimeline[] => gsap().timeline.mock.results.map(r => r.value as FakeTimeline);

/** Finish every running cycle once, as if GSAP completed them. */
function completeAll(from: number): number {
    const all = timelines();
    all.slice(from).forEach(tl => tl.vars.onComplete?.());
    return all.length;
}

function makeCard(width = 420, height = 230): HTMLElement {
    const host = document.createElement('div');
    host.innerHTML = `
        <div class="animated-weather-card">
            <div class="animation-container rain-container"><div class="rain-layer"></div></div>
            <div class="animation-container snow-container"><div class="snow-layer"></div></div>
            <div class="animation-container sleet-container"><div class="sleet-layer"></div></div>
        </div>
    `;
    document.body.appendChild(host);
    const card = host.querySelector('.animated-weather-card') as HTMLElement;
    Object.defineProperty(card, 'offsetWidth', { value: width });
    Object.defineProperty(card, 'offsetHeight', { value: height });
    return host;
}

describe('ParticlePool', () => {
    let layer: HTMLElement;
    const cycle = (_el: HTMLElement, next: () => void) => window.AnimatedWeatherCardGsap.timeline({ onComplete: next }) as never;

    beforeEach(() => {
        layer = document.createElement('div');
        document.body.appendChild(layer);
    });
    afterEach(() => layer.remove());

    it('creates its particles once and recycles them', () => {
        const create = vi.fn(() => document.createElement('i'));
        const pool = new ParticlePool(layer, create, cycle);
        pool.start(12);
        let seen = 0;
        for (let round = 0; round < 5; round++) seen = completeAll(seen);
        expect(create).toHaveBeenCalledTimes(12);
        expect(layer.children.length).toBe(12);
        expect(timelines().length).toBe(12 * 6);
        pool.stop();
    });

    it('starts cycles paused while the pool is paused', () => {
        const pool = new ParticlePool(layer, () => document.createElement('i'), cycle);
        pool.start(3);
        pool.pause();
        const before = timelines().length;
        completeAll(0);
        const fresh = timelines().slice(before);
        expect(fresh).toHaveLength(3);
        fresh.forEach(tl => expect(tl.pause).toHaveBeenCalled());
        pool.stop();
    });

    it('removes its particles on stop and ignores cycles that end afterwards', () => {
        const pool = new ParticlePool(layer, () => document.createElement('i'), cycle);
        pool.start(4);
        pool.stop();
        const before = timelines().length;
        completeAll(0);
        expect(timelines().length).toBe(before);
        expect(layer.children.length).toBe(0);
    });

    it('prewarms only the first cycle', () => {
        const tl = window.AnimatedWeatherCardGsap.timeline() as unknown as FakeTimeline;
        prewarm(tl as never, false);
        expect(tl.progress).not.toHaveBeenCalled();
        prewarm(tl as never, true);
        expect(tl.progress).toHaveBeenCalledWith(expect.any(Number));
    });
});

describe('a pool that grows and shrinks (auto mode\'s amounts)', () => {
    let layer: HTMLElement;
    const cycle = (_el: HTMLElement, next: () => void) => window.AnimatedWeatherCardGsap.timeline({ onComplete: next }) as never;
    const delayed = () => (window.AnimatedWeatherCardGsap as unknown as { delayedCall: ReturnType<typeof vi.fn> }).delayedCall.mock.results.map(r => r.value as FakeTimeline);
    beforeEach(() => {
        layer = document.createElement('div');
        document.body.appendChild(layer);
    });
    afterEach(() => layer.remove());

    it('adds particles unseen, each starting its first cycle from the top at its own moment', () => {
        const pool = new ParticlePool(layer, () => document.createElement('i'), cycle);
        pool.start(4);
        const before = timelines().length;
        const waiting = delayed().length;
        const added = pool.resize(7, 1);
        expect(added).toHaveLength(3);
        expect(pool.live).toBe(7);
        expect(added.every(el => el.style.visibility === 'hidden')).toBe(true);
        // No cycle until each one's moment comes
        expect(timelines().length).toBe(before);
        delayed().slice(waiting).forEach(d => d.vars.onComplete?.());
        expect(added.every(el => el.style.visibility === '')).toBe(true);
        expect(timelines().length).toBe(before + 3);
        // From the top: not part-way through, as a starting pool is
        expect(timelines().slice(before).every(tl => !(tl.progress as ReturnType<typeof vi.fn>).mock?.calls.length)).toBe(true);
        pool.stop();
    });

    it('lets particles go at the end of their cycle, and keeps them when it grows again first', () => {
        const retired: HTMLElement[] = [];
        const pool = new ParticlePool(layer, () => document.createElement('i'), cycle, el => retired.push(el));
        pool.start(6);
        pool.resize(4);
        // Still falling: nothing leaves until its cycle ends
        expect(layer.children.length).toBe(6);
        expect(pool.live).toBe(4);
        // Growing back keeps the two on their way out instead of making new ones
        pool.resize(5);
        expect(pool.live).toBe(5);
        pool.resize(3);
        completeAll(0);
        expect(layer.children.length).toBe(3);
        expect(retired).toHaveLength(3);
        pool.stop();
    });

    it('shows the slide\'s hours at once: new particles start part-way through, and the ones let go step out of sight', () => {
        const warmth: boolean[] = [];
        const pool = new ParticlePool(layer, () => document.createElement('i'), (el, next, warm) => { warmth.push(warm); return cycle(el, next); });
        pool.start(4);
        warmth.length = 0;
        const added = pool.resize(6, 6, true);
        expect(added).toHaveLength(2);
        expect(warmth).toEqual([true, true]);
        expect(added.every(el => el.style.visibility === '')).toBe(true);
        pool.resize(3, 6, true);
        const hidden = [...layer.children].filter(el => (el as HTMLElement).style.visibility === 'hidden');
        expect(hidden).toHaveLength(3);
        // The next hour wants one back: it shows again, and keeps falling
        pool.resize(4, 6, true);
        expect([...layer.children].filter(el => (el as HTMLElement).style.visibility === 'hidden')).toHaveLength(2);
        completeAll(0);
        expect(layer.children.length).toBe(4);
        pool.stop();
    });

    it('holds a waiting particle while paused', () => {
        const pool = new ParticlePool(layer, () => document.createElement('i'), cycle);
        pool.start(1);
        pool.pause();
        const waiting = delayed().length;
        pool.resize(3, 1);
        expect(delayed().slice(waiting).every(d => (d.pause as ReturnType<typeof vi.fn>).mock.calls.length > 0)).toBe(true);
        pool.stop();
    });
});

describe('rain, snow and sleet by their amounts', () => {
    const amounts = (rain: { kind: 'light' | 'rain' | 'storm' | 'pouring'; drops: number }, snow = 1) =>
        ({ rain, snow, sleet: snow, clouds: [1, 1, 2] as [number, number, number], fog: 1, leaves: 1, gusts: 0, stars: 1 });

    it('starts with the amounts\' drops, and follows new ones without starting again: the kind at each drop\'s next fall', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 1, scale: 1, amounts: amounts({ kind: 'light', drops: 8 }) }, { entity: 'weather.home' });
        await rain.start();
        const drops = () => [...host.querySelectorAll('.raindrop')] as HTMLElement[];
        expect(drops()).toHaveLength(8);
        expect(drops()[0].style.height).toBe('16px');
        const first = drops()[0];
        rain.setAmounts(amounts({ kind: 'pouring', drops: 20 }));
        // The same drops are still falling: the weather never started again
        expect(drops()[0]).toBe(first);
        expect(drops()).toHaveLength(20);
        // A drop takes pouring's length when it starts its next fall
        completeAll(0);
        expect(first.style.height).toBe('42px');
        // Less rain: drops leave at the end of their fall
        rain.setAmounts(amounts({ kind: 'rain', drops: 5 }));
        expect(drops()).toHaveLength(20);
        completeAll(0);
        expect(drops().length).toBeLessThan(20);
        await rain.stop();
        host.remove();
    });

    it('keeps manual\'s count when there are no amounts', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await rain.start();
        expect(host.querySelectorAll('.raindrop')).toHaveLength(18);
        await rain.stop();
        host.remove();
    });

    it('lets snow thin out, each flake taking its sway with it; sleet the same', async () => {
        const host = makeCard();
        const snow = new SnowAnimation(host, { intensity: 1, scale: 1, amounts: amounts({ kind: 'rain', drops: 18 }, 1) }, { entity: 'weather.home' });
        await snow.start();
        const flakes = () => host.querySelectorAll('.snowflake').length;
        expect(flakes()).toBe(snowPoolSize(1, 420, 230));
        snow.setAmounts(amounts({ kind: 'rain', drops: 18 }, 0.4));
        completeAll(0);
        expect(flakes()).toBe(snowPoolSize(0.4, 420, 230));
        snow.setAmounts(amounts({ kind: 'rain', drops: 18 }, 2));
        expect(flakes()).toBe(snowPoolSize(2, 420, 230));
        await snow.stop();
        const sleet = new SleetAnimation(host, { intensity: 1, scale: 1, amounts: amounts({ kind: 'rain', drops: 18 }, 2) }, { entity: 'weather.home' });
        await sleet.start();
        const pellets = () => host.querySelectorAll('.sleet-particle-gsap').length;
        const many = pellets();
        sleet.setAmounts(amounts({ kind: 'rain', drops: 18 }, 1));
        completeAll(0);
        expect(pellets()).toBeLessThan(many);
        await sleet.stop();
        host.remove();
    });
});

describe('rain', () => {
    it('falls faster and denser as it gets heavier', () => {
        const kinds = ['light', 'rain', 'storm', 'pouring'] as const;
        for (let i = 1; i < kinds.length; i++) {
            expect(RAIN_SPEED[kinds[i]][0]).toBeGreaterThan(RAIN_SPEED[kinds[i - 1]][0]);
            expect(RAIN_POOL_SIZE[kinds[i]]).toBeGreaterThan(RAIN_POOL_SIZE[kinds[i - 1]]);
        }
    });

    it('sizes the pool by rain amount and card area', () => {
        expect(rainPoolSize('rain', 1, 420, 230)).toBe(18);
        expect(rainPoolSize('rain', 2, 420, 230)).toBe(36);
        expect(rainPoolSize('rain', 1, 840, 230)).toBe(36);
        // Tiny and huge cards are clamped
        expect(rainPoolSize('rain', 1, 100, 100)).toBe(Math.round(18 * 0.6));
        expect(rainPoolSize('rain', 1, 2000, 2000)).toBe(18 * 3);
    });

    it('keeps the same drops through many falls and a pause', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await rain.start();
        const drops = () => host.querySelectorAll('.raindrop').length;
        expect(drops()).toBe(18);

        let seen = 0;
        for (let round = 0; round < 4; round++) seen = completeAll(seen);
        expect(drops()).toBe(18);

        await rain.pause();
        await rain.resume();
        seen = completeAll(seen);
        expect(drops()).toBe(18);

        await rain.stop();
        expect(drops()).toBe(0);
        host.remove();
    });

    it('moves every drop at constant speed', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 8, scale: 1, isPouring: true }, { entity: 'weather.home' });
        await rain.start();
        const falls = timelines().flatMap(tl => (tl.fromTo as ReturnType<typeof vi.fn>).mock.calls);
        expect(falls.length).toBeGreaterThan(0);
        for (const [, , to] of falls) {
            expect(to.ease).toBe('none');
            const speed = (to.y - -42) / to.duration;
            expect(speed).toBeGreaterThanOrEqual(RAIN_SPEED.pouring[0] - 1);
            expect(speed).toBeLessThanOrEqual(RAIN_SPEED.pouring[1] + 1);
        }
        await rain.stop();
        host.remove();
    });
});

describe('rain splashes', () => {
    /** Fire every splash scheduled so far, as if each drop hit the edge. */
    function splashAll(): number {
        let fired = 0;
        for (const tl of timelines()) {
            for (const [callback] of (tl.call as ReturnType<typeof vi.fn>).mock.calls) {
                (callback as () => void)();
                fired++;
            }
        }
        return fired;
    }

    it('springs the drop back up off the edge, and reuses splash elements', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 8, scale: 1, isPouring: true }, { entity: 'weather.home' });
        await rain.start();
        let fired = 0;
        let seen = 0;
        for (let round = 0; round < 6; round++) {
            seen = completeAll(seen);
            fired = splashAll();
        }
        expect(fired).toBeGreaterThan(8);
        const rebounds = host.querySelectorAll('.rain-rebound');
        expect(rebounds.length).toBe(8);
        expect(host.querySelectorAll('.rain-splash').length).toBe(16);

        for (const svg of rebounds) {
            // M 0,0 Q reach,-2·rise 2·reach,fall: up off the edge, then back down past it
            const [, , , controlY, , endY] = svg.querySelector('path')!.getAttribute('d')!.match(/-?[\d.]+/g)!.map(Number);
            const rise = -controlY / 2;
            expect(rise).toBeGreaterThanOrEqual(RAIN_REBOUND_RISE[0] - 0.1);
            expect(rise).toBeLessThanOrEqual(RAIN_REBOUND_RISE[1] + 0.1);
            expect(endY).toBeGreaterThan(0);
        }

        await rain.stop();
        expect(host.querySelectorAll('.rain-rebound, .rain-splash').length).toBe(0);
        host.remove();
    });

    it('scales the spring-back with the Splash bounce setting', async () => {
        const host = makeCard();
        const rain = new RainAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home', engine_settings: { splashBounce: 120 } });
        await rain.start();
        for (let round = 0, seen = 0; round < 8; round++) { seen = completeAll(seen); splashAll(); }
        const rises = [...host.querySelectorAll('.rain-rebound path')]
            .map(p => -Number(p.getAttribute('d')!.match(/-?[\d.]+/g)![3]) / 2);
        expect(rises.length).toBeGreaterThan(0);
        for (const rise of rises) expect(rise).toBeLessThanOrEqual(RAIN_REBOUND_RISE[1] * 1.5 + 0.1);
        expect(Math.max(...rises)).toBeGreaterThan(RAIN_REBOUND_RISE[0] * 1.5);
        await rain.stop();
        host.remove();
    });

    it('measures the arc length', () => {
        // A control point on the straight line gives a straight line
        expect(quadraticLength(5, 0, 10, 0)).toBeCloseTo(10, 5);
        // An arc is longer than its chord
        expect(quadraticLength(10, -40, 20, 10)).toBeGreaterThan(Math.hypot(20, 10));
    });
});

describe('GPU precipitation', () => {
    it.each([
        { kind: 'rain', Animation: RainAnimation, particle: '.raindrop', count: 18 },
        { kind: 'snow', Animation: SnowAnimation, particle: '.snowflake', count: 36 },
        { kind: 'sleet', Animation: SleetAnimation, particle: '.sleet-particle-gsap', count: 30 },
    ])('falls back to standard $kind when hardware WebGL is unavailable', async ({ kind, Animation, particle, count }) => {
        const host = makeCard();
        const context = vi.spyOn(HTMLCanvasElement.prototype, 'getContext')
            .mockReturnValueOnce({} as CanvasRenderingContext2D).mockReturnValueOnce(null);
        vi.stubGlobal('ResizeObserver', class {});
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const animation = new Animation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home', use_webgl: true });
        try {
            await animation.start();
            expect(context).toHaveBeenCalledWith('webgl2', expect.objectContaining({ failIfMajorPerformanceCaveat: true }));
            expect(warn).toHaveBeenCalledWith(expect.stringContaining(`using standard ${kind}`), expect.any(Error));
            expect(host.querySelector(`.${kind}-webgl`)).toBeNull();
            expect(host.querySelectorAll(particle)).toHaveLength(count);
        } finally {
            await animation.stop();
            warn.mockRestore();
            context.mockRestore();
            vi.unstubAllGlobals();
            host.remove();
        }
    });
});

describe('snow and sleet', () => {
    it('keeps the same flakes falling, through pauses', async () => {
        const host = makeCard();
        const snow = new SnowAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await snow.start();
        const flakes = () => host.querySelectorAll('.snowflake').length;
        expect(flakes()).toBe(snowPoolSize(1, 420, 230));

        let seen = 0;
        for (let round = 0; round < 4; round++) seen = completeAll(seen);
        await snow.pause();
        await snow.resume();
        seen = completeAll(seen);
        expect(flakes()).toBe(snowPoolSize(1, 420, 230));

        await snow.stop();
        expect(flakes()).toBe(0);
        host.remove();
    });

    it('falls at constant speed, drifts with the wind and sways on rotation only', async () => {
        const host = makeCard();
        const snow = new SnowAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await snow.start();
        const falls = timelines().flatMap(tl => (tl.fromTo as ReturnType<typeof vi.fn>).mock.calls);
        expect(falls.length).toBeGreaterThan(0);
        for (const [, from, to] of falls) {
            expect(to.ease).toBe('none');
            const speed = (to.y - from.y) / to.duration;
            expect(speed).toBeGreaterThanOrEqual(SNOW_SPEED[0] * 0.9 - 0.01);
            expect(speed).toBeLessThanOrEqual(SNOW_SPEED[1] * 1.1 + 0.01);
        }
        const swings = (window.AnimatedWeatherCardGsap.to as unknown as ReturnType<typeof vi.fn>).mock.calls
            .filter(([target]) => (target as HTMLElement).classList?.contains('snowflake'));
        expect(swings.length).toBeGreaterThan(0);
        for (const [, vars] of swings) {
            expect(vars).toHaveProperty('rotation');
            expect(vars).not.toHaveProperty('x');
        }
        await snow.stop();
        host.remove();
    });

    it('drifts every flake the same way, downwind', async () => {
        const host = makeCard();
        const snow = new SnowAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await snow.start();
        const sets = (window.AnimatedWeatherCardGsap.set as unknown as ReturnType<typeof vi.fn>).mock.calls;
        const falls = timelines().flatMap(tl => (tl.fromTo as ReturnType<typeof vi.fn>).mock.calls);
        for (const [flake, , to] of falls) {
            const start = [...sets].reverse().find(([target, vars]) => target === flake && 'x' in vars)?.[1].x;
            expect(to.x).toBeGreaterThan(start);
        }
        await snow.stop();
        host.remove();
    });

    it('keeps the same sleet pellets through many falls', async () => {
        const host = makeCard();
        const sleet = new SleetAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await sleet.start();
        const pellets = () => host.querySelectorAll('.sleet-particle-gsap').length;
        const initial = pellets();
        expect(initial).toBeGreaterThan(0);
        let seen = 0;
        for (let round = 0; round < 4; round++) seen = completeAll(seen);
        expect(pellets()).toBe(initial);
        await sleet.stop();
        expect(pellets()).toBe(0);
        host.remove();
    });
});

describe('clouds', () => {
    it('makes nearer layers bigger, brighter and faster', () => {
        for (let i = 1; i < CLOUD_LAYERS.length; i++) {
            expect(CLOUD_LAYERS[i].speed).toBeGreaterThan(CLOUD_LAYERS[i - 1].speed);
            expect(CLOUD_LAYERS[i].opacity).toBeGreaterThan(CLOUD_LAYERS[i - 1].opacity);
            expect(CLOUD_LAYERS[i].scale).toBeGreaterThan(CLOUD_LAYERS[i - 1].scale);
        }
    });

    it('drifts each layer at its own speed, already spread across the sky', () => {
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        const settings = { windSpeed: 2, cloudBaseSize: 1, cloudCount: 3 };
        createGSAPCloud(card, settings, 3, card, {});
        const made = timelines();
        expect(made.length).toBeGreaterThan(0);
        for (const tl of made) {
            expect(tl.vars.delay ?? 0).toBe(0);
            expect(tl.progress).toHaveBeenCalledWith(expect.any(Number));
            const [[track, from, to]] = (tl.fromTo as ReturnType<typeof vi.fn>).mock.calls;
            const cloud = (track as HTMLElement).querySelector('.cloud-gsap') as HTMLElement;
            const layer = CLOUD_LAYERS.find(l => cloud.className.includes(l.name))!;
            const distance = card.offsetWidth * (to.xPercent - from.xPercent) / 100 + to.x - from.x;
            const speed = distance / to.duration;
            expect(to.ease).toBe('none');
            expect(speed).toBeGreaterThanOrEqual(layer.speed * 0.9 - 0.01);
            expect(speed).toBeLessThanOrEqual(layer.speed * 1.1 + 0.01);
        }
        host.remove();
    });

    it('carries each cloud across the whole sky, whatever its width becomes', () => {
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        createGSAPCloud(card, { windSpeed: 2, cloudBaseSize: 2.5, cloudCount: 6 }, 6, card, {});
        for (const tl of timelines()) {
            const [[track, from, to]] = (tl.fromTo as ReturnType<typeof vi.fn>).mock.calls;
            const cloud = (track as HTMLElement).querySelector('.cloud-gsap') as HTMLElement;
            // The track is the sky's width, so percent is of the card, not the cloud
            expect((track as HTMLElement).className).toBe('cloud-track');
            expect((track as HTMLElement).parentElement).toBe(card);
            expect([from.xPercent, to.xPercent]).toEqual([0, 100]);
            // Out of sight at both ends: a full cloud width past each edge
            expect(-from.x).toBe(to.x);
            expect(to.x).toBeGreaterThanOrEqual(parseFloat(cloud.style.width));
        }
        host.remove();
    });

    it('keeps the cloud\'s outline: a pill-shaped body with two round puffs on it', () => {
        expect(cloudShape(1)).toEqual({
            width: 70, height: 26,
            puffs: [{ x: 9, y: -22, size: 44 }, { x: 26, y: -13, size: 35 }],
        });
        // Whole pixels at any size, the right puff 9px in from the body's right edge
        const big = cloudShape(1.38);
        expect(big.puffs[1].x + big.puffs[1].size + Math.round(9 * 1.38)).toBe(big.width);
    });

    /** The body and the two puffs of each cloud, with what draws them */
    const cloudParts = (card: HTMLElement) => Array.from(card.querySelectorAll('.cloud-gsap')).map(cloud => ({
        cloud: cloud as HTMLElement,
        parts: Array.from(cloud.children) as HTMLElement[],
    }));

    it('blurs each part through a mask of its own, never a CSS filter, so a puff still shows on the body', () => {
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        createGSAPCloud(card, { windSpeed: 2, cloudBaseSize: 1, cloudCount: 3 }, 3, card, {});
        const clouds = cloudParts(card);
        expect(clouds.length).toBeGreaterThan(0);
        for (const { cloud, parts } of clouds) {
            const layer = CLOUD_LAYERS.find(l => cloud.className.includes(l.name))!;
            const reach = Math.ceil(layer.blur * 3) + 1;
            expect(cloud.classList.contains('cloud-masked')).toBe(true);
            expect(cloud.style.filter).toBe('');
            expect(cloud.style.background).toBe('');
            expect(parts).toHaveLength(3);
            // The body first, its blur reaching past it on every side
            expect(parts[0].style.left).toBe(`${-reach}px`);
            expect(parseFloat(parts[0].style.width)).toBe(parseFloat(cloud.style.width) + 2 * reach);
            for (const part of parts) {
                expect(part.style.getPropertyValue('mask-image')).toMatch(/^url\("data:image\/png/);
                expect(part.style.getPropertyValue('-webkit-mask-image')).toBe(part.style.getPropertyValue('mask-image'));
                expect(part.style.background).toMatch(/^var\(--awc-cloud-/);
            }
        }
        host.remove();
    });

    it('draws theme clouds crisp', () => {
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        createGSAPCloud(card, { windSpeed: 2, cloudBaseSize: 1, cloudCount: 3 }, 3, card, { color_palette: 'theme' });
        for (const { parts } of cloudParts(card)) {
            expect(parts[0].style.left).toBe('0px');
            expect(parts[0].style.top).toBe('0px');
        }
        host.remove();
    });

    it('falls back to CSS blur where there\'s no canvas to draw a mask on', () => {
        const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        // A size no other test draws, so no mask is already kept
        createGSAPCloud(card, { windSpeed: 2, cloudBaseSize: 0.77, cloudCount: 3 }, 3, card, {});
        for (const { cloud, parts } of cloudParts(card)) {
            expect(cloud.classList.contains('cloud-masked')).toBe(false);
            expect(cloud.style.filter).toMatch(/^blur\(/);
            expect(cloud.style.background).toMatch(/^var\(--awc-cloud-/);
            expect(parts).toHaveLength(2);
        }
        getContext.mockRestore();
        host.remove();
    });

    it('draws each mask once, at the screen\'s resolution', () => {
        const getContext = vi.spyOn(HTMLCanvasElement.prototype, 'getContext');
        const first = cloudPartMask(51, 19, 1.5, 2);
        const drawn = getContext.mock.calls.length;
        expect(first).toBe(`data:image/png;base64,${(51 + 2 * 6) * 2}x${(19 + 2 * 6) * 2}`);
        expect(cloudPartMask(51, 19, 1.5, 2)).toBe(first);
        expect(getContext.mock.calls.length).toBe(drawn);
        getContext.mockRestore();
    });

    it('removes clouds together with their tracks', () => {
        const host = makeCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        createGSAPCloud(card, { windSpeed: 2, cloudBaseSize: 1, cloudCount: 3 }, 3, card, {});
        expect(card.querySelectorAll('.cloud-track').length).toBeGreaterThan(0);
        removeClouds(card);
        expect(card.querySelectorAll('.cloud-track, .cloud-gsap')).toHaveLength(0);
        host.remove();
    });

    it('speeds clouds up with the wind, gently', () => {
        expect(driftWindFactor(2)).toBe(1);
        expect(driftWindFactor(8)).toBe(2);
        expect(driftWindFactor(100)).toBe(2.2);
        expect(driftWindFactor(0.1)).toBe(0.6);
    });
});

describe('wind', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    function makeWindCard(): HTMLElement {
        const host = makeCard();
        host.querySelector('.animated-weather-card')!.insertAdjacentHTML('beforeend',
            '<div class="animation-container wind-container"><div class="wind-layer"></div></div>');
        return host;
    }

    it('never has more than a few leaves and swooshes in the air', async () => {
        const host = makeWindCard();
        const wind = new WindAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await wind.start();
        // Tweens never finish in the stub, so nothing leaves: the caps hold
        vi.advanceTimersByTime(60_000);
        expect(host.querySelectorAll('.leaf-gsap').length).toBe(MAX_LEAVES);
        expect(host.querySelectorAll('.wind-swoosh-gsap').length).toBe(MAX_SWOOSHES);
        await wind.stop();
        expect(host.querySelectorAll('.leaf-gsap, .wind-swoosh-gsap').length).toBe(0);
        host.remove();
    });

    it('spaces leaves about a second apart', async () => {
        // Shortest gaps everywhere
        const random = vi.spyOn(Math, 'random').mockReturnValue(0);
        const host = makeWindCard();
        const wind = new WindAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await wind.start();
        const leaves = () => host.querySelectorAll('.leaf-gsap').length;
        vi.advanceTimersByTime(150);
        expect(leaves()).toBe(1);
        vi.advanceTimersByTime(LEAF_GAP_MS[0] - 1);
        expect(leaves()).toBe(1);
        vi.advanceTimersByTime(1);
        expect(leaves()).toBe(2);
        await wind.stop();
        host.remove();
        random.mockRestore();
    });

    it('keeps swooshes faint', async () => {
        const host = makeWindCard();
        const card = host.querySelector('.animated-weather-card') as HTMLElement;
        createGSAPSwoosh(host.querySelector('.wind-layer')!, { windSpeed: 2 }, 1, card, {});
        const [tl] = timelines().slice(-1);
        const opacities = (tl.to as ReturnType<typeof vi.fn>).mock.calls
            .map(([, vars]) => vars.opacity).filter((o: unknown) => typeof o === 'number');
        expect(Math.max(...opacities)).toBeLessThanOrEqual(0.35);
        host.remove();
    });

    it('pauses a leaf as a whole', async () => {
        useRealGsap();
        const host = makeWindCard();
        const wind = new WindAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await wind.start();
        vi.advanceTimersByTime(600);
        const leaf = host.querySelector('.leaf-gsap')!;
        const crossing = realGsap.getTweensOf(leaf)[0].parent!;

        await wind.pause();
        expect(crossing.paused()).toBe(true);
        expect(realGsap.getTweensOf(leaf).some(tween => tween.paused())).toBe(false);

        await wind.resume();
        expect(crossing.paused()).toBe(false);
        await wind.stop();
        host.remove();
    });
});

describe('pausing a card', () => {
    let host: HTMLElement;
    let drop: HTMLElement;

    beforeEach(() => {
        useRealGsap();
        host = document.createElement('div');
        host.innerHTML = '<div class="drop"></div>';
        drop = host.firstElementChild as HTMLElement;
        document.body.appendChild(host);
    });

    afterEach(() => {
        realGsap.killTweensOf(drop);
        host.remove();
    });

    it('never strands a timeline that has not drawn yet', () => {
        const onComplete = vi.fn();
        const fall = realGsap.timeline({ onComplete }).fromTo(drop, { y: -24 }, { y: 200, duration: 0.5, ease: 'none' });

        pauseCardGSAPAnimations(host);
        expect(fall.paused()).toBe(true);
        // Pausing the tween inside it would make this 0: GSAP would then drop
        // the timeline without firing onComplete
        expect(fall.duration()).toBe(0.5);

        resumeCardGSAPAnimations(host);
        expect(fall.paused()).toBe(false);
        fall.progress(1);
        expect(onComplete).toHaveBeenCalledOnce();
    });

    it('pauses the outermost timeline of a nested one', () => {
        const inner = realGsap.timeline().to(drop, { x: 10, duration: 1 });
        const outer = realGsap.timeline().add(inner);
        pauseCardGSAPAnimations(host);
        expect(outer.paused()).toBe(true);
        expect(inner.paused()).toBe(false);
        resumeCardGSAPAnimations(host);
        expect(outer.paused()).toBe(false);
    });

    it('pauses a tween that stands alone', () => {
        const tween = realGsap.to(drop, { x: 10, duration: 1 });
        pauseCardGSAPAnimations(host);
        expect(tween.paused()).toBe(true);
        resumeCardGSAPAnimations(host);
        expect(tween.paused()).toBe(false);
    });

    it('leaves other cards alone', () => {
        const other = document.createElement('div');
        const tween = realGsap.to(other, { x: 10, duration: 1 });
        realGsap.to(drop, { x: 10, duration: 1 });
        pauseCardGSAPAnimations(host);
        expect(tween.paused()).toBe(false);
        realGsap.killTweensOf(other);
    });
});

describe('lightning', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    function makeStormCard(): HTMLElement {
        const host = makeCard();
        host.querySelector('.animated-weather-card')!.insertAdjacentHTML('beforeend',
            '<div class="animation-layer"><div class="lightning"></div></div>');
        return host;
    }

    it('waits a random 1.5-6s for the first flash, then 6-18s between flashes', async () => {
        const random = vi.spyOn(Math, 'random').mockReturnValue(0);
        const host = makeStormCard();
        const storm = new LightningAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await storm.start();
        const flashes = () => host.querySelectorAll('.lightning svg').length;
        vi.advanceTimersByTime(LIGHTNING_FIRST_FLASH_MS[0] - 1);
        expect(flashes()).toBe(0);
        vi.advanceTimersByTime(1);
        expect(flashes()).toBe(1);
        vi.advanceTimersByTime(LIGHTNING_INTERVAL_MS[0] - 1);
        expect(flashes()).toBe(1);
        vi.advanceTimersByTime(1);
        expect(flashes()).toBe(2);
        await storm.stop();
        random.mockRestore();
        host.remove();
    });

    it('jolts the card after the light, then hands its transform back', async () => {
        const host = makeStormCard();
        const card = host.querySelector('.animated-weather-card');
        const storm = new LightningAnimation(host, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await storm.start();
        vi.advanceTimersByTime(LIGHTNING_FIRST_FLASH_MS[1]);
        const [tl] = timelines().slice(-1);
        const joltSteps = (tl.to as ReturnType<typeof vi.fn>).mock.calls.filter(([target]) => target === card);
        expect(joltSteps).toHaveLength(2);
        const [[, down, at], [, back]] = joltSteps;
        expect(down.y).toBe(-6);
        expect(at).toBe(LIGHTNING_JOLT_DELAY_SEC);
        expect(back.y).toBe(0);
        expect(back.clearProps).toBe('transform');
        await storm.stop();
        host.remove();
    });
});
