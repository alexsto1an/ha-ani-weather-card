// FogAnimation - Modular fog animation with layered scrolling fog

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, GSAPTimeline } from './types';
import { getWeatherSettings, devLog } from './utils';
import { createGSAPFogLayer, clearFogLayers } from './gsap-effects';

export interface FogAnimationConfig extends BaseAnimationConfig {
    layerCount: number;
}

export class FogAnimation extends BaseAnimation {
    public readonly animationType = 'fog';
    public readonly layerSelector = '.animation-layer';
    public readonly containerSelector = '.fog-container';

    protected fogConfig: FogAnimationConfig;
    protected fogTimelines: GSAPTimeline[] = [];

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<FogAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.fogConfig = {
            layerCount: 3,
            ...config
        };
        devLog(this.config.devMode, 'FogAnimation created');
    }

    protected async onStart(): Promise<void> {
        if (!window.gsap) {
            throw new Error('GSAP not loaded - cannot start fog animation');
        }

        const fogContainer = this.element.querySelector('.fog-container') || this.element.querySelector(this.layerSelector);
        if (!fogContainer) {
            throw new Error(`Fog container not found`);
        }

        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;

        // Clear existing fog layers
        clearFogLayers(card);

        // Create fog layers
        this.fogTimelines = [];
        for (let i = 0; i < this.fogConfig.layerCount; i++) {
            const fogLayerTimelines = createGSAPFogLayer(fogContainer, settings, i, card, this.cardConfig);
            this.fogTimelines.push(fogLayerTimelines.movement);
            this.fogTimelines.push(fogLayerTimelines.opacity);
        }

        devLog(this.config.devMode, `Fog animation started with ${this.fogConfig.layerCount} layers`);
    }

    protected async onStop(): Promise<void> {
        // Kill all fog timelines
        this.fogTimelines.forEach(tl => {
            if (tl && typeof tl.kill === 'function') tl.kill();
        });
        this.fogTimelines = [];

        // Remove fog DOM elements
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        const fogLayers = card?.querySelectorAll('.fog-layer');
        fogLayers?.forEach(layer => {
            if (window.gsap) window.gsap.killTweensOf(layer);
            if (layer.parentNode) layer.parentNode.removeChild(layer);
        });

        devLog(this.config.devMode, 'Fog animation stopped');
    }

    protected async onPause(): Promise<void> {
        this.fogTimelines.forEach(tl => {
            if (tl && typeof tl.pause === 'function') tl.pause();
        });
        devLog(this.config.devMode, 'Fog animation paused');
    }

    protected async onResume(): Promise<void> {
        this.fogTimelines.forEach(tl => {
            if (tl && typeof tl.resume === 'function') tl.resume();
        });
        devLog(this.config.devMode, 'Fog animation resumed');
    }
}
