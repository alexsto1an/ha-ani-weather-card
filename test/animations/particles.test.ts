import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ParticlePool, prewarm } from '../../src/particle-pool';
import { RainAnimation, RAIN_SPEED, RAIN_POOL_SIZE, RAIN_REBOUND_RISE, rainPoolSize, quadraticLength } from '../../src/rain-animation';
import { SnowAnimation, SNOW_SPEED, snowPoolSize } from '../../src/snow-animation';
import { SleetAnimation } from '../../src/sleet-animation';
import { createGSAPCloud, createGSAPSwoosh, CLOUD_LAYERS, driftWindFactor, removeClouds } from '../../src/gsap-effects';
import { WindAnimation, MAX_LEAVES, MAX_SWOOSHES, LEAF_GAP_MS } from '../../src/wind-animation';
import { LightningAnimation, LIGHTNING_FIRST_FLASH_MS, LIGHTNING_INTERVAL_MS, LIGHTNING_JOLT_DELAY_SEC } from '../../src/lightning-animation';
import type { FakeTimeline } from '../setup';

type GsapMock = { timeline: ReturnType<typeof vi.fn> };
const gsap = (): GsapMock => (window as unknown as { AnimatedWeatherCardGsap: GsapMock }).AnimatedWeatherCardGsap;

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
