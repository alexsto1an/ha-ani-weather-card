// SunAnimation - Modular sun animation
// The sun is primarily CSS-driven (pulse animation, glow pseudo-elements).
// This modular wrapper manages visibility and provides lifecycle consistency.

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import { devLog } from './utils';

export class SunAnimation extends BaseAnimation {
    public readonly animationType = 'sun';
    public readonly layerSelector = '.sun';
    public readonly containerSelector = '.sun-container';

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig,
        cardConfig: AnimatedWeatherCardConfig,
        _realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        devLog(this.config.devMode, 'SunAnimation created');
    }

    protected async onStart(): Promise<void> {
        const sun = this.element.querySelector(this.layerSelector) as HTMLElement;
        if (!sun) {
            devLog(this.config.devMode, 'Sun element not found — CSS sun handles rendering');
            return;
        }

        // Make sun visible (CSS handles the pulse animation)
        sun.style.opacity = '1';
        devLog(this.config.devMode, 'Sun animation started (CSS-driven)');
    }

    protected async onStop(): Promise<void> {
        const sun = this.element.querySelector(this.layerSelector) as HTMLElement;
        if (sun) {
            sun.style.opacity = '0';
        }
        devLog(this.config.devMode, 'Sun animation stopped');
    }

    protected async onPause(): Promise<void> {
        const sun = this.element.querySelector(this.layerSelector) as HTMLElement;
        if (sun) {
            sun.style.animationPlayState = 'paused';
        }
        devLog(this.config.devMode, 'Sun animation paused');
    }

    protected async onResume(): Promise<void> {
        const sun = this.element.querySelector(this.layerSelector) as HTMLElement;
        if (sun) {
            sun.style.animationPlayState = 'running';
        }
        devLog(this.config.devMode, 'Sun animation resumed');
    }
}
