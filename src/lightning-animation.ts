// LightningAnimation - Modular lightning animation with SVG bolts and card shake

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import type { GSAPTimeline } from './types';
import { getWeatherSettings, getTimeAwareAnimationColor, devLog } from './utils';

/** Gap between lightning events, in ms. */
export const LIGHTNING_INTERVAL_MS: [number, number] = [6000, 18000];
/**
 * When the first flash comes after a storm starts, in ms. Random per card,
 * so storm cards on one dashboard don't all flash together on load.
 */
export const LIGHTNING_FIRST_FLASH_MS: [number, number] = [1500, 6000];
/** Thunder follows the light: the jolt starts this long after the flash. */
export const LIGHTNING_JOLT_DELAY_SEC = 0.16;

export interface LightningAnimationConfig extends BaseAnimationConfig {
    disableShake: boolean;
    minInterval: number;
    maxInterval: number;
}

export class LightningAnimation extends BaseAnimation {
    public readonly animationType = 'lightning';
    public readonly layerSelector = '.lightning';
    public readonly containerSelector = '.lightning-container';

    protected lightningConfig: LightningAnimationConfig;
    protected flashTimeout?: ReturnType<typeof setTimeout>;
    private flashTimeline?: GSAPTimeline;

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<LightningAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.lightningConfig = {
            disableShake: cardConfig.disable_lightning_shake || false,
            minInterval: LIGHTNING_INTERVAL_MS[0],
            maxInterval: LIGHTNING_INTERVAL_MS[1],
            ...config
        };
        devLog(this.config.devMode, 'LightningAnimation created');
    }

    protected async onStart(): Promise<void> {
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start lightning animation');
        }

        const lightning = this.element.querySelector(this.layerSelector);
        if (!lightning) {
            throw new Error(`Lightning layer not found: ${this.layerSelector}`);
        }

        // The base class shows the layer by setting opacity 1, but here the
        // layer IS the flash; keep it dark until a flash lights it.
        (lightning as HTMLElement).style.opacity = '0';

        const [firstMin, firstMax] = LIGHTNING_FIRST_FLASH_MS;
        this.flashTimeout = setTimeout(() => {
            if (this.state === AnimationLifecycleState.ACTIVE) {
                this.flash();
                this.scheduleNext();
            }
        }, firstMin + Math.random() * (firstMax - firstMin));
        this.addTimeout(this.flashTimeout);

        devLog(this.config.devMode, 'Lightning animation started');
    }

    private flash(): void {
        if (!window.AnimatedWeatherCardGsap || this.state !== AnimationLifecycleState.ACTIVE) return;

        const lightning = this.element.querySelector(this.layerSelector);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        if (!lightning || !card) return;

        const cardWidth = card.offsetWidth;
        const cardHeight = card.offsetHeight;
        const scale = parseFloat(card.style.getPropertyValue('--scale-factor')) || 1;

        // Create SVG lightning bolt
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathX = 30 + Math.random() * (cardWidth - 60);
        const yOffset = 20 * scale;
        const steps = 20;
        const points = [pathX + ',0'];

        for (let i = 0; i < steps; i++) {
            const x = pathX + (Math.random() * yOffset - yOffset / 2);
            const y = (cardHeight / steps) * (i + 1);
            points.push(x + ',' + y);
        }

        path.setAttribute('d', 'M' + points.join(' L'));
        const timeOfDayManager = (this.element as any).timeOfDayManager;
        const lightningColor = getTimeAwareAnimationColor('lightning', timeOfDayManager, 'white');
        path.setAttribute('stroke', lightningColor);
        path.setAttribute('stroke-width', ((2 + Math.random() * 2) * scale).toString());
        path.setAttribute('fill', 'none');

        svg.appendChild(path);
        lightning.appendChild(svg);

        // Lightning is light, not a drawing: the bolt is whole from the first
        // frame, and the flash (overlay and bolt together, the bolt lives in
        // the overlay) has a return stroke, like the real thing: bright,
        // dip, bright again, then a long fall-off. Two strokes in ~100ms
        // stays well under three flashes a second.
        const tl = window.AnimatedWeatherCardGsap.timeline({
            onComplete: () => {
                if (svg.parentNode) svg.parentNode.removeChild(svg);
            }
        });
        this.flashTimeline = tl;
        tl.set(lightning, { opacity: 0.9 }, 0)
          .to(lightning, { opacity: 0.3, duration: 0.06, ease: 'none' }, 0)
          .to(lightning, { opacity: 0.8, duration: 0.04, ease: 'none' }, 0.06)
          .to(lightning, { opacity: 0, duration: 0.38, ease: 'expo.out' }, 0.1);

        // Thunder follows the light: a short drop and a slower settle. The
        // card stays in its grid slot, and clearProps hands it back to
        // normal rendering (no lingering transform or compositor layer).
        if (!this.lightningConfig.disableShake) {
            const jolt = -6 * scale;
            tl.to(card, { y: jolt, duration: 0.06, ease: 'power2.out' }, LIGHTNING_JOLT_DELAY_SEC)
              .to(card, { y: 0, duration: 0.42, ease: 'power3.out', clearProps: 'transform' }, LIGHTNING_JOLT_DELAY_SEC + 0.06);
        }
    }

    private scheduleNext(): void {
        if (this.state !== AnimationLifecycleState.ACTIVE) return;

        const interval = this.lightningConfig.minInterval +
            Math.random() * (this.lightningConfig.maxInterval - this.lightningConfig.minInterval);

        this.flashTimeout = setTimeout(() => {
            if (this.state === AnimationLifecycleState.ACTIVE) {
                this.flash();
                this.scheduleNext();
            }
        }, interval);
        this.addTimeout(this.flashTimeout);
    }

    protected async onStop(): Promise<void> {
        if (this.flashTimeout) {
            clearTimeout(this.flashTimeout);
            this.flashTimeout = undefined;
        }

        // A storm can end mid-jolt; never leave the card displaced
        this.flashTimeline?.kill();
        this.flashTimeline = undefined;
        const card = this.element.querySelector('.animated-weather-card');
        if (card && window.AnimatedWeatherCardGsap) window.AnimatedWeatherCardGsap.set(card, { clearProps: 'transform' });

        const lightning = this.element.querySelector(this.layerSelector);
        if (lightning) {
            const svgs = lightning.querySelectorAll('svg');
            svgs.forEach(svg => {
                if (window.AnimatedWeatherCardGsap) window.AnimatedWeatherCardGsap.killTweensOf(svg.querySelector('path'));
                if (svg.parentNode) svg.parentNode.removeChild(svg);
            });
            (lightning as HTMLElement).style.opacity = '0';
        }

        devLog(this.config.devMode, 'Lightning animation stopped');
    }

    protected async onPause(): Promise<void> {
        if (this.flashTimeout) {
            clearTimeout(this.flashTimeout);
            this.flashTimeout = undefined;
        }
        devLog(this.config.devMode, 'Lightning animation paused');
    }

    protected async onResume(): Promise<void> {
        this.scheduleNext();
        devLog(this.config.devMode, 'Lightning animation resumed');
    }
}
