// SnowAnimation - snow as a fixed field of recycled, drifting flakes

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, EngineAmounts } from './types';
import { getWeatherSettings, devLog } from './utils';
import { ParticlePool, prewarm, between } from './particle-pool';
import { snowDepth, snowFall, snowPoolSize, snowWindFactor, SNOW_FLAKE_SIZE, SNOW_SWAY_DEG } from './snow-motion';
import { WebGLSnow } from './snow-webgl';
import type { GSAPAnimation, GSAPTimeline } from './types';

export { SNOW_POOL_SIZE, SNOW_FLAKE_SIZE, SNOW_SPEED, snowPoolSize, snowWindFactor } from './snow-motion';

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
    private gpu?: WebGLSnow;
    private paused = false;
    private swings: GSAPAnimation[] = [];
    /** Each flake's sway, so a flake that leaves takes its own with it */
    private swingOf = new WeakMap<HTMLElement, GSAPAnimation>();
    private card?: HTMLElement;
    
    
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
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start snow animation');
        }

        const snowLayer = this.element.querySelector(this.layerSelector);
        if (!snowLayer) {
            throw new Error(`Snow layer not found: ${this.layerSelector}`);
        }


        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector<HTMLElement>('.animated-weather-card');
        if (!card) throw new Error('Snow card not found');
        this.card = card;
        const spill = this.cardConfig.spill_particles !== false;
        const wind = snowWindFactor(settings.windSpeed);

        if (this.snowConfig.accumulation) {
            this.createSnowAccumulation();
        }

        const startDom = () => this.startDom(snowLayer, card, spill, wind);
        if (this.cardConfig.gpu_snow === true) {
            const canvas = document.createElement('canvas');
            canvas.className = 'snow-webgl';
            snowLayer.appendChild(canvas);
            try {
                this.gpu = new WebGLSnow(canvas, card, {
                    spill,
                    wind,
                    pile: () => this.snowConfig.accumulation ? this.pileHeight() : undefined,
                    settle: () => this.addToAccumulation(),
                    lost: () => {
                        console.warn('Animated Weather Card: WebGL snow context lost; using standard snow.');
                        this.gpu?.stop();
                        this.gpu = undefined;
                        startDom();
                    },
                });
                this.gpu.resizePopulation(this.flakeCount(), true, true);
                if (!this.paused) this.gpu.resume();
                return;
            } catch (error) {
                console.warn('Animated Weather Card: WebGL snow could not start; using standard snow.', error);
                this.gpu?.stop();
                this.gpu = undefined;
                canvas.remove();
            }
        }
        startDom();
    }

    private startDom(layer: Element, card: HTMLElement, spill: boolean, wind: number): void {
        const count = this.flakeCount();
        this.pool = new ParticlePool(
            layer,
            () => this.createFlake(),
            (flake, next, warm) => this.fall(flake, card, wind, spill, next, warm),
            (flake) => {
                const swing = this.swingOf.get(flake);
                swing?.kill();
                this.swings = this.swings.filter(other => other !== swing);
                this.removeParticle(flake);
            },
        );
        if (this.paused) this.pool.pause();
        this.pool.start(count).forEach(flake => this.addParticle(flake));

        devLog(this.config.devMode, `Snow animation started - ${count} flakes`);
    }

    /** Flakes in the air: the amounts' in auto mode, snowCount in manual; more on a bigger card */
    private flakeCount(): number {
        const card = this.card;
        if (!card) return 0;
        const amount = this.amounts?.snow ?? getWeatherSettings(this.cardConfig, this.realWindSpeed).snowCount;
        return snowPoolSize(amount, card.offsetWidth, card.offsetHeight);
    }

    /**
     * New amounts while it snows: flakes join from above the card, or leave at the end of their fall. Snow falls
     * slowly, so the slide's hours (quick) show their own at once: flakes join part-way down, and leave unseen.
     */
    protected onAmountsChange(_previous: EngineAmounts | null, quick: boolean): void {
        const count = this.flakeCount();
        this.gpu?.resizePopulation(count, quick);
        this.pool?.resize(count, 6, quick).forEach(flake => this.addParticle(flake));
    }

    /**
     * A soft flake (a crisp dot reads as punctuation next to the text).
     * Size sets its depth: small flakes are farther away, so
     * they're dimmer and fall slower. The flake sways like a pendulum from
     * a point above it, which keeps the sway off the x axis the drift uses.
     */
    private createFlake(): HTMLElement {
        const size = between(SNOW_FLAKE_SIZE[0], SNOW_FLAKE_SIZE[1]);
        const depth = snowDepth(size);
        const flake = document.createElement('div');
        flake.className = 'snowflake';
        flake.dataset.size = size.toFixed(2);
        flake.style.cssText = `
            width: ${size.toFixed(2)}px;
            height: ${size.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, #ffffff) 45%, transparent 100%);
            top: 0;
            left: 0;
        `;
        flake.dataset.opacity = (0.45 + 0.45 * depth).toFixed(2);

        window.AnimatedWeatherCardGsap.set(flake, { transformOrigin: '50% -500%', rotation: -SNOW_SWAY_DEG });
        const swing = window.AnimatedWeatherCardGsap.to(flake, {
            rotation: SNOW_SWAY_DEG,
            duration: between(1.4, 2.2),
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
        });
        swing.progress(Math.random());
        // A flake that joins while the card is paused holds still with the rest
        if (this.paused) swing.pause();
        this.swings.push(swing);
        this.swingOf.set(flake, swing);
        return flake;
    }

    /**
     * One fall of one flake: a straight, constant-speed line slanted by the
     * wind. Some flakes settle on the bottom edge and melt into it; the rest
     * fall out of the frame, fading past the edge with spill on.
     */
    private fall(flake: HTMLElement, card: HTMLElement, wind: number, spill: boolean,
                 next: () => void, warm: boolean): GSAPTimeline {
        const size = parseFloat(flake.dataset.size || '4');
        const { startY, endY, fallSec, settles, drift, x, fadeStart, endSec } = snowFall(
            size, card.offsetWidth, card.offsetHeight, wind, spill, this.snowConfig.accumulation ? this.pileHeight() : undefined,
        );

        window.AnimatedWeatherCardGsap.set(flake, { x, opacity: parseFloat(flake.dataset.opacity || '0.7') });
        const tl = window.AnimatedWeatherCardGsap.timeline({ onComplete: next });
        tl.fromTo(flake, { y: startY }, { y: endY, x: x + drift, duration: fallSec, ease: 'none' });
        if (settles) {
            tl.call(() => this.addToAccumulation(), [], fallSec);
        }
        if (settles || spill) tl.to(flake, { opacity: 0, duration: endSec - fadeStart, ease: settles ? 'power1.out' : 'power1.in' }, fadeStart);
        return prewarm(tl, warm);
    }

    /**
     * Stop the snow animation
     */
    protected async onStop(): Promise<void> {
        this.gpu?.stop();
        this.gpu = undefined;
        this.paused = false;
        this.swings.forEach(swing => swing.kill());
        this.swings = [];
        this.pool?.stop();
        this.pool = undefined;

        // Remove snow accumulation
        if (this.accumulationElement && this.accumulationElement.parentNode) {
            window.AnimatedWeatherCardGsap?.killTweensOf(this.accumulationElement);
            this.accumulationElement.parentNode.removeChild(this.accumulationElement);
            this.accumulationElement = undefined;
        }

        devLog(this.config.devMode, `Snow animation stopped`);
    }

    /**
     * Pause the snow animation
     */
    protected async onPause(): Promise<void> {
        this.paused = true;
        this.gpu?.pause();
        this.pool?.pause();
        this.swings.forEach(swing => swing.pause());
        devLog(this.config.devMode, `Snow animation paused`);
    }

    /**
     * Resume the snow animation
     */
    protected async onResume(): Promise<void> {
        this.paused = false;
        this.gpu?.resume();
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
        window.AnimatedWeatherCardGsap.to(pile, {
            scaleY: target / maxHeight,
            opacity: Math.min(0.9, target / maxHeight),
            duration: 0.3,
            ease: 'power2.out',
        });
    }

    
}
