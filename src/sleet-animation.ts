// SleetAnimation - Modular sleet animation. Sleet behaves like snow but with
// smaller, icier pellets that fall faster and straighter.

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import type { GSAPTimeline } from './types';
import { getWeatherSettings, devLog } from './utils';
import { ParticlePool, prewarm, between, areaFactor } from './particle-pool';
import { snowWindFactor } from './snow-animation';

export interface SleetAnimationConfig extends BaseAnimationConfig {
    particleCount: number;
}

/** Pellets alive at once on a 420×230 card at the default snow amount. */
export const SLEET_POOL_SIZE = 30;
/** Fall speed range in px/s: much faster than snow, slower than rain. */
export const SLEET_SPEED: [number, number] = [150, 230];
/** Share of pellets that settle on the bottom edge. */
const SLEET_SETTLE_SHARE = 0.3;
/** Max height of the sleet pile in px. */
const SLEET_PILE_MAX = 6;

export class SleetAnimation extends BaseAnimation {
    public readonly animationType = 'sleet';
    public readonly layerSelector = '.sleet-layer';
    public readonly containerSelector = '.sleet-container';

    protected sleetConfig: SleetAnimationConfig;
    private pool?: ParticlePool;

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<SleetAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.sleetConfig = {
            particleCount: 40,
            ...config
        };
        devLog(this.config.devMode, 'SleetAnimation created');
    }

    protected async onStart(): Promise<void> {
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start sleet animation');
        }

        const sleetLayer = this.element.querySelector(this.layerSelector);
        if (!sleetLayer) {
            throw new Error(`Sleet layer not found: ${this.layerSelector}`);
        }

        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        const count = Math.max(6, Math.round(SLEET_POOL_SIZE * settings.snowCount * areaFactor(card.offsetWidth, card.offsetHeight)));
        const spill = this.cardConfig.spill_particles !== false;
        const wind = snowWindFactor(settings.windSpeed) * 0.5;

        this.pool = new ParticlePool(
            sleetLayer,
            () => {
                const size = between(1.5, 3.5);
                const pellet = document.createElement('div');
                pellet.className = 'sleet-particle-gsap';
                pellet.dataset.size = size.toFixed(2);
                pellet.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${size.toFixed(2)}px;
                    height: ${size.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `;
                return pellet;
            },
            (pellet, next, warm) => this.fall(pellet, card, wind, spill, next, warm),
        );
        this.pool.start(count).forEach(pellet => this.addParticle(pellet));

        devLog(this.config.devMode, `Sleet animation started - ${count} pellets`);
    }

    /** One constant-speed fall, like snow's but quicker and straighter. */
    private fall(pellet: HTMLElement, card: HTMLElement, wind: number, spill: boolean,
                 next: () => void, warm: boolean): GSAPTimeline {
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        const size = parseFloat(pellet.dataset.size || '2');
        const speed = between(SLEET_SPEED[0], SLEET_SPEED[1]);
        const settles = Math.random() < SLEET_SETTLE_SHARE;
        const startY = -size * 2;
        const endY = settles ? height - size : (spill ? height + between(60, 120) : height + size);
        const distance = endY - startY;
        const fallSec = Math.max(0.3, distance / speed);
        const drift = distance * between(0.03, 0.08) * wind;
        const x = between(-drift, Math.max(1, width - size));

        window.AnimatedWeatherCardGsap.set(pellet, { x, opacity: between(0.8, 1), rotation: between(0, 360) });
        const tl = window.AnimatedWeatherCardGsap.timeline({ onComplete: next });
        tl.fromTo(pellet, { y: startY }, { y: endY, x: x + drift, duration: fallSec, ease: 'none' });
        if (settles) {
            tl.call(() => this.addToPile(card), [], fallSec);
            tl.to(pellet, { opacity: 0, duration: 0.3, ease: 'power1.out' }, fallSec);
        } else if (spill) {
            const edgeSec = Math.min(fallSec, (height - startY) / speed);
            tl.to(pellet, { opacity: 0, duration: Math.max(0.1, fallSec - edgeSec), ease: 'power1.in' }, edgeSec);
        }
        return prewarm(tl, warm);
    }

    /** Grow the thin sleet pile along the bottom edge (scaleY, not height). */
    private addToPile(card: HTMLElement): void {
        if (this.state !== AnimationLifecycleState.ACTIVE) return;
        let pile = card.querySelector<HTMLElement>('.sleet-accumulation');
        if (!pile) {
            pile = document.createElement('div');
            pile.className = 'sleet-accumulation';
            pile.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${SLEET_PILE_MAX}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `;
            card.appendChild(pile);
        }
        const current = parseFloat(pile.getAttribute('data-target-height') || '0');
        if (current >= SLEET_PILE_MAX) return;
        const target = Math.min(SLEET_PILE_MAX, current + 0.4);
        pile.setAttribute('data-target-height', String(target));
        window.AnimatedWeatherCardGsap.to(pile, { scaleY: target / SLEET_PILE_MAX, duration: 0.3, ease: 'power2.out' });
    }

    protected async onStop(): Promise<void> {
        this.pool?.stop();
        this.pool = undefined;

        // Clear any accumulation built up at the card bottom.
        const card = this.element.querySelector('.animated-weather-card');
        if (card) {
            card.querySelectorAll('.sleet-accumulation').forEach(pile => {
                if (window.AnimatedWeatherCardGsap) window.AnimatedWeatherCardGsap.killTweensOf(pile);
                pile.remove();
            });
        }

        devLog(this.config.devMode, 'Sleet animation stopped');
    }

    protected async onPause(): Promise<void> {
        this.pool?.pause();
        devLog(this.config.devMode, 'Sleet animation paused');
    }

    protected async onResume(): Promise<void> {
        this.pool?.resume();
        devLog(this.config.devMode, 'Sleet animation resumed');
    }
}
