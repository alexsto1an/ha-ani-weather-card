// SnowAnimation - snow as a fixed field of recycled, drifting flakes

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import { getWeatherSettings, devLog } from './utils';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { ParticlePool, prewarm, between, areaFactor } from './particle-pool';
import type { GSAPAnimation, GSAPTimeline } from './types';

/** Flakes alive at once on a 420×230 card at the default snow amount. */
export const SNOW_POOL_SIZE = 36;
/** Flake diameter range in px; the size sets the flake's depth. */
export const SNOW_FLAKE_SIZE: [number, number] = [2, 6];
/** Fall speed in px/s for the smallest (farthest) and largest (nearest) flakes. */
export const SNOW_SPEED: [number, number] = [20, 38];
/** Pendulum sway either side, in degrees. */
const SNOW_SWAY_DEG = 10;
/** Share of flakes that settle on the bottom edge instead of falling out. */
const SNOW_SETTLE_SHARE = 0.6;

export function snowPoolSize(snowAmount: number, width: number, height: number): number {
    return Math.max(6, Math.round(SNOW_POOL_SIZE * snowAmount * areaFactor(width, height)));
}

/** Wind slant multiplier: 1 at the default wind effect and 10 km/h. */
export function snowWindFactor(windSpeed: number): number {
    return Math.min(2.2, Math.max(0.3, windSpeed / DEFAULT_ENGINE_SETTINGS.windSpeed));
}

/**
 * Snow animation specific configuration
 */
export interface SnowAnimationConfig extends BaseAnimationConfig {
    accumulation: boolean;
    accumulationHeight: number;
    swayAmplitude: number;
    fallSpeed: number;
    particleCount: number;
}

/**
 * Snow Animation Class
 * Implements modular snow animation with wind physics, accumulation, and time-awareness
 */
export class SnowAnimation extends BaseAnimation {
    public readonly animationType = 'snow';
    public readonly layerSelector = '.snow-layer';
    public readonly containerSelector = '.snow-container';
    
    protected snowConfig: SnowAnimationConfig;
    protected accumulationElement?: HTMLElement;
    private pool?: ParticlePool;
    private swings: GSAPAnimation[] = [];
    
    
    constructor(
        element: HTMLElement, 
        config: BaseAnimationConfig & Partial<SnowAnimationConfig>, 
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        
        this.realWindSpeed = realWindSpeed;
        this.snowConfig = {
            accumulation: true,
            accumulationHeight: 12,
            swayAmplitude: 15,
            fallSpeed: 3,
            particleCount: 40,
            ...config
        };
        
        
        devLog(this.config.devMode, `SnowAnimation created with config:`, this.snowConfig);
    }
    
    /**
     * Start the snow animation
     */
    protected async onStart(): Promise<void> {
        if (!window.gsap) {
            throw new Error('GSAP not loaded - cannot start snow animation');
        }

        const snowLayer = this.element.querySelector(this.layerSelector);
        if (!snowLayer) {
            throw new Error(`Snow layer not found: ${this.layerSelector}`);
        }


        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        const count = snowPoolSize(settings.snowCount, card.offsetWidth, card.offsetHeight);
        // Fallback only; the card always defines --weather-snow-color
        const color = '#ffffff';
        const spill = this.cardConfig.spill_particles !== false;
        const wind = snowWindFactor(settings.windSpeed);

        if (this.snowConfig.accumulation) {
            this.createSnowAccumulation();
        }

        this.pool = new ParticlePool(
            snowLayer,
            () => this.createFlake(color),
            (flake, next, warm) => this.fall(flake, card, wind, spill, next, warm),
        );
        this.pool.start(count).forEach(flake => this.addParticle(flake));

        devLog(this.config.devMode, `Snow animation started - ${count} flakes`);
    }

    /**
     * A soft flake (a crisp dot reads as punctuation next to the text).
     * Size sets its depth: small flakes are farther away, so
     * they're dimmer and fall slower. The flake sways like a pendulum from
     * a point above it, which keeps the sway off the x axis the drift uses.
     */
    private createFlake(color: string): HTMLElement {
        const size = between(SNOW_FLAKE_SIZE[0], SNOW_FLAKE_SIZE[1]);
        const depth = (size - SNOW_FLAKE_SIZE[0]) / (SNOW_FLAKE_SIZE[1] - SNOW_FLAKE_SIZE[0]);
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.dataset.size = size.toFixed(2);
        flake.style.cssText = `
            width: ${size.toFixed(2)}px;
            height: ${size.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${color}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `;
        flake.dataset.opacity = (0.45 + 0.45 * depth).toFixed(2);

        window.gsap.set(flake, { transformOrigin: '50% -500%', rotation: -SNOW_SWAY_DEG });
        const swing = window.gsap.to(flake, {
            rotation: SNOW_SWAY_DEG,
            duration: between(1.4, 2.2),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
        swing.progress(Math.random());
        this.swings.push(swing);
        return flake;
    }

    /**
     * One fall of one flake: a straight, constant-speed line slanted by the
     * wind. Some flakes settle on the bottom edge and melt into it; the rest
     * fall out of the frame, fading past the edge with spill on.
     */
    private fall(flake: HTMLElement, card: HTMLElement, wind: number, spill: boolean,
                 next: () => void, warm: boolean): GSAPTimeline {
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        const size = parseFloat(flake.dataset.size || '4');
        const depth = (size - SNOW_FLAKE_SIZE[0]) / (SNOW_FLAKE_SIZE[1] - SNOW_FLAKE_SIZE[0]);
        const speed = (SNOW_SPEED[0] + (SNOW_SPEED[1] - SNOW_SPEED[0]) * depth) * between(0.9, 1.1);
        const settles = this.snowConfig.accumulation && Math.random() < SNOW_SETTLE_SHARE;
        const startY = -size * 2;
        const endY = settles
            ? height - this.pileHeight() - size
            : (spill ? height + between(60, 120) : height + size);
        const distance = endY - startY;
        const fallSec = Math.max(0.5, distance / speed);
        // Wind slants the fall; start further left so the slanted field
        // still covers the left side of the card.
        const drift = distance * between(0.04, 0.13) * wind;
        const x = between(-drift, Math.max(1, width - size));

        window.gsap.set(flake, { x, opacity: parseFloat(flake.dataset.opacity || '0.7') });
        const tl = window.gsap.timeline({ onComplete: next });
        tl.fromTo(flake, { y: startY }, { y: endY, x: x + drift, duration: fallSec, ease: 'none' });
        if (settles) {
            tl.call(() => this.addToAccumulation(), [], fallSec);
            tl.to(flake, { opacity: 0, duration: 0.6, ease: 'power1.out' }, fallSec);
        } else if (spill) {
            const edgeSec = Math.min(fallSec, (height - startY) / speed);
            tl.to(flake, { opacity: 0, duration: Math.max(0.1, fallSec - edgeSec), ease: 'power1.in' }, edgeSec);
        }
        return prewarm(tl, warm);
    }

    /**
     * Stop the snow animation
     */
    protected async onStop(): Promise<void> {
        this.swings.forEach(swing => swing.kill());
        this.swings = [];
        this.pool?.stop();
        this.pool = undefined;

        // Remove snow accumulation
        if (this.accumulationElement && this.accumulationElement.parentNode) {
            window.gsap?.killTweensOf(this.accumulationElement);
            this.accumulationElement.parentNode.removeChild(this.accumulationElement);
            this.accumulationElement = undefined;
        }

        devLog(this.config.devMode, `Snow animation stopped`);
    }

    /**
     * Pause the snow animation
     */
    protected async onPause(): Promise<void> {
        this.pool?.pause();
        this.swings.forEach(swing => swing.pause());
        devLog(this.config.devMode, `Snow animation paused`);
    }

    /**
     * Resume the snow animation
     */
    protected async onResume(): Promise<void> {
        this.pool?.resume();
        this.swings.forEach(swing => swing.resume());
        devLog(this.config.devMode, `Snow animation resumed`);
    }

    private pileHeight(): number {
        return parseFloat(this.accumulationElement?.getAttribute('data-target-height') || '0');
    }

    /**
     * Create snow accumulation element
     */
    private createSnowAccumulation(): void {
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        if (!card) return;

        // Clean up any earlier modular pile so two never stack
        card.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(el => el.remove());

        const maxHeight = Math.max(0, this.snowConfig.accumulationHeight);
        this.accumulationElement = document.createElement('div');
        this.accumulationElement.className = 'snow-accumulation';
        this.accumulationElement.setAttribute('data-modular', 'true');
        // Full height from the start, grown with scaleY from the bottom
        // (a compositor-only transform, not a layout change per flake).
        this.accumulationElement.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${maxHeight}px;
            background: linear-gradient(to top, #ffffff, transparent);
            transform-origin: 50% 100%;
            transform: scaleY(0);
            pointer-events: none;
            z-index: 5;
        `;

        card.appendChild(this.accumulationElement);
    }

    /**
     * Grow the snow pile a little as a flake settles into it
     */
    private addToAccumulation(): void {
        // A flake can settle after onStop(); don't grow a stopped pile.
        if (this.state !== AnimationLifecycleState.ACTIVE) return;
        const pile = this.accumulationElement;
        const maxHeight = this.snowConfig.accumulationHeight;
        if (!pile?.parentNode || maxHeight <= 0) return;

        // Track the target in an attribute (avoids reading mid-tween values)
        const current = this.pileHeight();
        if (current >= maxHeight) return;
        const target = Math.min(maxHeight, current + 0.8);
        pile.setAttribute('data-target-height', String(target));
        window.gsap.to(pile, {
            scaleY: target / maxHeight,
            opacity: Math.min(0.9, target / maxHeight),
            duration: 0.3,
            ease: 'power2.out',
        });
    }

    
}
