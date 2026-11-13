// CloudsAnimation - Modular cloud animation with parallax layers

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, GSAPTimeline } from './types';
import { getWeatherSettings, devLog } from './utils';
import { createGSAPCloud, driftWindFactor, removeClouds } from './gsap-effects';
import { SKY_DISSOLVE_SEC } from './sky';

/**
 * Where to look on the sun's disc: a 5 × 5 grid over its box, the points
 * inside the circle, as fractions of its radius from the centre.
 */
const DISC = Array.from({ length: 25 }, (_, i) => [(i % 5) / 2 - 1, Math.floor(i / 5) / 2 - 1]).filter(([x, y]) => x * x + y * y <= 1);
/** A cloud over the sun grows this much denser (to at most 0.95), so it hides the disc where it lies over it */
const DENSE = 1.9;
/** And the sun's light dims by each cloud's opacity times this, for the part of its disc the cloud covers */
const HIDE = 0.6;

export interface CloudsAnimationConfig extends BaseAnimationConfig {
    cloudCount: number;
    isPartlyCloudy: boolean;
}

export class CloudsAnimation extends BaseAnimation {
    public readonly animationType = 'clouds';
    // Clouds have their own layer, so they can rise past the card's top edge
    public readonly layerSelector = '.clouds-layer';
    public readonly containerSelector = '.clouds-container';

    protected cloudsConfig: CloudsAnimationConfig;
    protected cloudTimelines: GSAPTimeline[] = [];
    /** The drift factor the clouds started with; wind changes scale from it */
    protected startWindFactor = 1;
    /** How much of the sun's light the clouds last let through, 0 to 1 */
    protected sunLit = 1;
    /** Looks at the sun, about eight a second, apart from the clouds so the wind doesn't speed them */
    protected looks: GSAPTimeline | null = null;

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<CloudsAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.cloudsConfig = {
            cloudCount: 3,
            isPartlyCloudy: false,
            ...config
        };
        devLog(this.config.devMode, 'CloudsAnimation created');
    }

    protected async onStart(): Promise<void> {
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start clouds animation');
        }

        const cloudLayer = this.element.querySelector(this.layerSelector);
        if (!cloudLayer) {
            throw new Error(`Cloud layer not found: ${this.layerSelector}`);
        }

        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;

        // Clear any existing GSAP clouds
        removeClouds(cloudLayer);

        // Calculate cloud count
        let cloudCount = Math.min(6, Math.max(1, Math.round(settings.cloudCount)));
        if (this.cloudsConfig.isPartlyCloudy) {
            cloudCount = Math.max(1, Math.round(cloudCount * 0.6));
        }

        this.cloudTimelines = createGSAPCloud(cloudLayer, settings, cloudCount, card, this.cardConfig);
        this.startWindFactor = driftWindFactor(settings.windSpeed);
        // A look at the sun about eight times a second, paused and stopped with the clouds
        this.looks?.kill();
        this.looks = window.AnimatedWeatherCardGsap.timeline({ repeat: -1, onRepeat: () => this.veilSun() });
        this.looks.to({}, { duration: 0.12 });
        this.veilSun(true);

        devLog(this.config.devMode, `Clouds animation started with ${cloudCount} clouds`);
    }

    protected async onStop(): Promise<void> {
        // Kill all cloud timelines, and any change of speed still easing in
        this.cloudTimelines.forEach(tl => {
            window.AnimatedWeatherCardGsap?.killTweensOf(tl);
            if (tl && typeof tl.kill === 'function') tl.kill();
        });
        this.cloudTimelines = [];
        this.looks?.kill();
        this.looks = null;

        // Remove the clouds and their tracks, and give the sun its light back
        const cloudLayer = this.element.querySelector(this.layerSelector);
        if (cloudLayer) removeClouds(cloudLayer);
        this.lightSun(1);
        this.element.querySelector('.animated-weather-card')?.removeAttribute('data-occlude');

        devLog(this.config.devMode, 'Clouds animation stopped');
    }

    protected async onPause(): Promise<void> {
        this.cloudTimelines.forEach(tl => {
            if (tl && typeof tl.pause === 'function') tl.pause();
        });
        this.looks?.pause();
        devLog(this.config.devMode, 'Clouds animation paused');
    }

    protected async onResume(): Promise<void> {
        this.cloudTimelines.forEach(tl => {
            if (tl && typeof tl.resume === 'function') tl.resume();
        });
        this.looks?.resume();
        devLog(this.config.devMode, 'Clouds animation resumed');
    }

    /**
     * The clouds pass in front of the sun, but they're see-through, so the
     * sun's bright disc showed through them, as if it shone in front. Each
     * look, a cloud over the sun grows denser, up to `DENSE` × its opacity,
     * so it hides the disc where it lies over it and stands lit from behind;
     * and the sun dims by how much of its disc the clouds cover, each by
     * `HIDE` × what it shows of its opacity. The dimming is on .sun-track,
     * the sun's wrapper, so it multiplies with whatever else sets the sun's
     * opacity. Nothing is measured while the sun isn't showing.
     */
    protected veilSun(instant = false): void {
        // On the theme palette, the clouds' twins hide the sun behind them, and its flat disc has no light to dim
        if (this.occlude()) { this.lightSun(1, instant); return; }
        const sun = this.element.querySelector('.sun-track .sun') as HTMLElement | null;
        const s = sun?.getBoundingClientRect();
        const clouds = Array.from(this.element.querySelectorAll<HTMLElement>('.cloud-gsap'));
        const base = (cloud: HTMLElement) => Number(cloud.dataset.awcO) || 0;
        if (!sun || !s?.width || getComputedStyle(sun).opacity === '0') {
            clouds.forEach(cloud => this.dense(cloud, base(cloud), instant));
            return;
        }
        const r = s.width / 2;
        const cx = s.left + r, cy = s.top + s.height / 2;
        // Clouds the slide is still bringing in (their layer half faded) hide less
        const layer = this.element.querySelector(this.containerSelector);
        const fade = layer ? parseFloat(getComputedStyle(layer).opacity) : 1;
        const shown = Number.isFinite(fade) ? fade : 1;
        // What each cloud shows of its own opacity: less on the theme palette's faint clouds (without twins), or while it fades out
        const hide = clouds.map(cloud => Math.min(base(cloud), parseFloat(getComputedStyle(cloud).opacity) || 0) * HIDE * shown);
        // The body and its puffs: pills and circles, as boxes with round ends
        const parts = clouds.map(cloud => [cloud, ...Array.from(cloud.children)].map(el => el.getBoundingClientRect()).filter(b => b.width && b.height));
        const over = (n: number, x: number, y: number) => parts[n].some(b => {
            const k = Math.min(b.width, b.height) / 2;
            const dx = x - Math.min(Math.max(x, b.left + k), b.right - k);
            const dy = y - Math.min(Math.max(y, b.top + k), b.bottom - k);
            return dx * dx + dy * dy <= k * k;
        });
        let lit = 0;
        const near = clouds.map(() => 0);
        for (const [fx, fy] of DISC) {
            lit += clouds.reduce((through, _, n) => over(n, cx + fx * r, cy + fy * r) ? through * (1 - hide[n]) : through, 1);
            // A little past the disc, so a cloud thickens as it arrives
            clouds.forEach((_, n) => { if (over(n, cx + fx * r * 1.25, cy + fy * r * 1.25)) near[n] += 1 / DISC.length; });
        }
        this.lightSun(lit / DISC.length, instant);
        // Dense from the moment it's well over the disc: a third of it and its edge
        clouds.forEach((cloud, n) => this.dense(cloud, base(cloud) * (1 + (DENSE - 1) * Math.min(1, near[n] * 3)), instant));
    }

    /**
     * On the theme palette, the clouds' twins (gsap-effects.ts) hide the sun
     * in the card's fill: shown where that fill is an opaque colour, read
     * into --awc-card-bg. Over a see-through fill or an image (a card-mod
     * background, a glass theme) a twin would show, so they stay off. Read
     * on every look, so a new theme follows.
     */
    protected occlude(): boolean {
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement | null;
        if (!card || this.cardConfig.color_palette !== 'theme') return false;
        const fill = card.closest('ha-card');
        const bg = fill ? getComputedStyle(fill) : null;
        // An opaque colour computes without an alpha: rgb(), or color() and the like without a slash
        const opaque = !!bg && (bg.backgroundImage || 'none') === 'none' && !!bg.backgroundColor && !/rgba|\/|transparent/.test(bg.backgroundColor);
        if (opaque && card.style.getPropertyValue('--awc-card-bg') !== bg!.backgroundColor) card.style.setProperty('--awc-card-bg', bg!.backgroundColor);
        card.toggleAttribute('data-occlude', opaque);
        return opaque;
    }

    /** Ease a cloud to an opacity, capped short of opaque */
    protected dense(cloud: HTMLElement, opacity: number, instant: boolean): void {
        const to = (Math.round(Math.min(0.95, opacity) * 100) / 100).toString();
        if (cloud.dataset.awcV === to) return;
        cloud.dataset.awcV = to;
        if (instant) window.AnimatedWeatherCardGsap?.set(cloud, { opacity: to });
        else window.AnimatedWeatherCardGsap?.to(cloud, { opacity: to, duration: 0.5, ease: 'sine.out', overwrite: 'auto' });
    }

    /** Ease the sun to this much of its light (instant on the first look) */
    protected lightSun(lit: number, instant = false): void {
        const track = this.element.querySelector('.sun-track') as HTMLElement | null;
        const to = Math.round(lit * 100) / 100;
        if (!track || (to === this.sunLit && !instant)) return;
        this.sunLit = to;
        if (instant) window.AnimatedWeatherCardGsap?.set(track, { opacity: to });
        else window.AnimatedWeatherCardGsap?.to(track, { opacity: to, duration: 0.5, ease: 'sine.out', overwrite: true });
    }

    /**
     * The wind changed: every cloud eases to its new speed where it is,
     * over the same few seconds the sky takes to change.
     */
    protected onWindSpeedChange(): void {
        if (!window.AnimatedWeatherCardGsap) return;
        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const timeScale = driftWindFactor(settings.windSpeed) / this.startWindFactor;
        this.cloudTimelines.forEach(tl => {
            window.AnimatedWeatherCardGsap!.to(tl, { timeScale, duration: SKY_DISSOLVE_SEC, ease: 'sine.inOut', overwrite: true });
        });
    }
}
