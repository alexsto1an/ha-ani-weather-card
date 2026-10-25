// CloudsAnimation - Modular cloud animation with parallax layers

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, GSAPTimeline } from './types';
import { getWeatherSettings, devLog } from './utils';
import { createGSAPCloud, driftWindFactor, removeClouds } from './gsap-effects';
import { SKY_DISSOLVE_SEC } from './sky';

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

        devLog(this.config.devMode, `Clouds animation started with ${cloudCount} clouds`);
    }

    protected async onStop(): Promise<void> {
        // Kill all cloud timelines, and any change of speed still easing in
        this.cloudTimelines.forEach(tl => {
            window.AnimatedWeatherCardGsap?.killTweensOf(tl);
            if (tl && typeof tl.kill === 'function') tl.kill();
        });
        this.cloudTimelines = [];

        // Remove the clouds and their tracks
        const cloudLayer = this.element.querySelector(this.layerSelector);
        if (cloudLayer) removeClouds(cloudLayer);

        devLog(this.config.devMode, 'Clouds animation stopped');
    }

    protected async onPause(): Promise<void> {
        this.cloudTimelines.forEach(tl => {
            if (tl && typeof tl.pause === 'function') tl.pause();
        });
        devLog(this.config.devMode, 'Clouds animation paused');
    }

    protected async onResume(): Promise<void> {
        this.cloudTimelines.forEach(tl => {
            if (tl && typeof tl.resume === 'function') tl.resume();
        });
        devLog(this.config.devMode, 'Clouds animation resumed');
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
