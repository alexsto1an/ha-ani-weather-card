// WindAnimation - Modular wind animation with leaves and swooshes

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import { createGSAPLeaf, createGSAPSwoosh } from './gsap-effects';
import { getWeatherSettings, devLog } from './utils';
import { between } from './particle-pool';

export interface WindAnimationConfig extends BaseAnimationConfig {
    leafCount: number;
    swooshEnabled: boolean;
}

/** Leaves alive at once at the default leaf amount. */
export const MAX_LEAVES = 3;
/** Swooshes alive at once. */
export const MAX_SWOOSHES = 2;
/** Gap between leaves in ms at the default leaf amount. */
export const LEAF_GAP_MS: [number, number] = [900, 1400];
/** Gap between swooshes in ms. */
export const SWOOSH_GAP_MS: [number, number] = [1800, 2600];

export class WindAnimation extends BaseAnimation {
    public readonly animationType = 'wind';
    public readonly layerSelector = '.wind-layer';
    public readonly containerSelector = '.wind-container';

    protected windConfig: WindAnimationConfig;
    private leafTimer?: ReturnType<typeof setTimeout>;
    private swooshTimer?: ReturnType<typeof setTimeout>;
    private leaves = new Set<HTMLElement>();
    private swooshes = new Set<HTMLElement>();

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<WindAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.windConfig = {
            leafCount: 3,
            swooshEnabled: true,
            ...config
        };
        devLog(this.config.devMode, 'WindAnimation created with config:', this.windConfig);
    }

    protected async onStart(): Promise<void> {
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start wind animation');
        }
        if (!this.element.querySelector(this.layerSelector)) {
            throw new Error(`Wind layer not found: ${this.layerSelector}`);
        }

        this.scheduleLeaf(between(150, 500));
        if (this.windConfig.swooshEnabled) {
            this.scheduleSwoosh(between(300, 900));
        }

        devLog(this.config.devMode, 'Wind animation started successfully');
    }

    /**
     * Leaves come one at a time, a second or so apart, with at most a few
     * crossing at once ("Leaf amount" scales both).
     */
    private scheduleLeaf(delayMs: number): void {
        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        this.leafTimer = setTimeout(() => {
            if (this.state !== AnimationLifecycleState.ACTIVE) return;
            const cap = Math.max(1, Math.round(MAX_LEAVES * settings.leafCount));
            if (this.leaves.size < cap) {
                const leaf = createGSAPLeaf(this.layer(), settings, 1, this.card(),
                    el => this.forget(el, this.leaves), this.cardConfig.spill_particles !== false);
                this.leaves.add(leaf);
                this.addParticle(leaf);
            }
            this.scheduleLeaf(between(LEAF_GAP_MS[0], LEAF_GAP_MS[1]) / Math.max(0.5, settings.leafCount));
        }, delayMs);
    }

    private scheduleSwoosh(delayMs: number): void {
        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        this.swooshTimer = setTimeout(() => {
            if (this.state !== AnimationLifecycleState.ACTIVE) return;
            if (this.swooshes.size < MAX_SWOOSHES) {
                const swoosh = createGSAPSwoosh(this.layer(), settings, 1, this.card(), this.cardConfig,
                    el => this.forget(el, this.swooshes));
                this.swooshes.add(swoosh);
                this.addParticle(swoosh);
            }
            this.scheduleSwoosh(between(SWOOSH_GAP_MS[0], SWOOSH_GAP_MS[1]));
        }, delayMs);
    }

    private forget(el: HTMLElement, set: Set<HTMLElement>): void {
        set.delete(el);
        this.removeParticle(el);
    }

    private layer(): Element {
        return this.element.querySelector(this.layerSelector) as Element;
    }

    private card(): HTMLElement {
        return this.element.querySelector('.animated-weather-card') as HTMLElement;
    }

    private clearTimers(): void {
        if (this.leafTimer) clearTimeout(this.leafTimer);
        if (this.swooshTimer) clearTimeout(this.swooshTimer);
        this.leafTimer = undefined;
        this.swooshTimer = undefined;
    }

    protected async onStop(): Promise<void> {
        this.clearTimers();

        const windLayer = this.element.querySelector(this.layerSelector);
        windLayer?.querySelectorAll('.leaf-gsap, .wind-swoosh-gsap').forEach(p => {
            if (window.AnimatedWeatherCardGsap) window.AnimatedWeatherCardGsap.killTweensOf(p);
            p.remove();
        });
        this.leaves.clear();
        this.swooshes.clear();

        devLog(this.config.devMode, 'Wind animation stopped');
    }

    protected async onPause(): Promise<void> {
        this.clearTimers();
        this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(p => {
            window.AnimatedWeatherCardGsap?.getTweensOf(p).forEach((t: any) => t.pause());
        });
        devLog(this.config.devMode, 'Wind animation paused');
    }

    protected async onResume(): Promise<void> {
        this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(p => {
            window.AnimatedWeatherCardGsap?.getTweensOf(p).forEach((t: any) => t.resume());
        });
        this.clearTimers();
        this.scheduleLeaf(between(300, 900));
        if (this.windConfig.swooshEnabled) {
            this.scheduleSwoosh(between(600, 1500));
        }
        devLog(this.config.devMode, 'Wind animation resumed');
    }
}
