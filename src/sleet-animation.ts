// SleetAnimation - Modular sleet animation. Sleet behaves like snow but with
// smaller, icier pellets that fall faster and straighter.

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, EngineAmounts } from './types';
import type { GSAPTimeline } from './types';
import { getWeatherSettings, devLog } from './utils';
import { ParticlePool, prewarm, between, areaFactor } from './particle-pool';
import { SLEET_PELLET_SIZE, SLEET_POOL_SIZE, sleetFall, snowWindFactor } from './snow-motion';
import { WebGLFrozen } from './frozen-webgl';
import { mountWebGLParticles } from './precipitation-webgl';

export { SLEET_POOL_SIZE, SLEET_SPEED } from './snow-motion';

export interface SleetAnimationConfig extends BaseAnimationConfig {
    particleCount: number;
}

/** Max height of the sleet pile in px. */
const SLEET_PILE_MAX = 6;

export class SleetAnimation extends BaseAnimation {
    private card?: HTMLElement;
    public readonly animationType = 'sleet';
    public readonly layerSelector = '.sleet-layer';
    public readonly containerSelector = '.sleet-container';

    protected sleetConfig: SleetAnimationConfig;
    private pool?: ParticlePool;
    private gpu?: WebGLFrozen;
    private paused = false;

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
        const card = this.element.querySelector<HTMLElement>('.animated-weather-card');
        if (!card) throw new Error('Sleet card not found');
        this.card = card;
        const spill = this.cardConfig.spill_particles !== false;
        const wind = snowWindFactor(settings.windSpeed) * 0.5;

        const startDom = () => this.startDom(sleetLayer, card, spill, wind);
        if (this.cardConfig.use_webgl === true) {
            this.gpu = mountWebGLParticles(sleetLayer, 'sleet',
                (canvas, lost) => new WebGLFrozen(canvas, card, {
                    kind: 'sleet', spill, wind, lost, settle: () => this.addToPile(card),
                }),
                renderer => renderer.resizePopulation(this.pelletCount(), true, true),
                () => { this.gpu = undefined; startDom(); });
            if (this.gpu) {
                if (!this.paused) this.gpu.resume();
                return;
            }
        }
        startDom();
    }

    private startDom(layer: Element, card: HTMLElement, spill: boolean, wind: number): void {
        const count = this.pelletCount();
        this.pool = new ParticlePool(
            layer,
            () => {
                const size = between(...SLEET_PELLET_SIZE);
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
            pellet => this.removeParticle(pellet),
        );
        if (this.paused) this.pool.pause();
        this.pool.start(count).forEach(pellet => this.addParticle(pellet));

        devLog(this.config.devMode, `Sleet animation started - ${count} pellets`);
    }

    /** Pellets in the air: the amounts' in auto mode, snowCount in manual; more on a bigger card */
    private pelletCount(): number {
        const card = this.card;
        if (!card) return 0;
        const amount = this.amounts?.sleet ?? getWeatherSettings(this.cardConfig, this.realWindSpeed).snowCount;
        return Math.max(6, Math.round(SLEET_POOL_SIZE * amount * areaFactor(card.offsetWidth, card.offsetHeight)));
    }

    /** New amounts while it sleets: pellets join from above the card, or leave at the end of their fall; the slide's hours at once, as snow's */
    protected onAmountsChange(_previous: EngineAmounts | null, quick: boolean): void {
        const count = this.pelletCount();
        this.gpu?.resizePopulation(count, quick);
        this.pool?.resize(count, 1.5, quick).forEach(pellet => this.addParticle(pellet));
    }

    /** One constant-speed fall, like snow's but quicker and straighter. */
    private fall(pellet: HTMLElement, card: HTMLElement, wind: number, spill: boolean,
                 next: () => void, warm: boolean): GSAPTimeline {
        const size = parseFloat(pellet.dataset.size || '2');
        const { startY, endY, fallSec, settles, drift, x, fadeStart, endSec } =
            sleetFall(size, card.offsetWidth, card.offsetHeight, wind, spill);

        window.AnimatedWeatherCardGsap.set(pellet, { x, opacity: between(0.8, 1), rotation: between(0, 360) });
        const tl = window.AnimatedWeatherCardGsap.timeline({ onComplete: next });
        tl.fromTo(pellet, { y: startY }, { y: endY, x: x + drift, duration: fallSec, ease: 'none' });
        if (settles) {
            tl.call(() => this.addToPile(card), [], fallSec);
        }
        if (settles || spill) tl.to(pellet, { opacity: 0, duration: endSec - fadeStart, ease: settles ? 'power1.out' : 'power1.in' }, fadeStart);
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
        this.gpu?.stop();
        this.gpu = undefined;
        this.paused = false;
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
        this.paused = true;
        this.gpu?.pause();
        this.pool?.pause();
        devLog(this.config.devMode, 'Sleet animation paused');
    }

    protected async onResume(): Promise<void> {
        this.paused = false;
        this.gpu?.resume();
        this.pool?.resume();
        devLog(this.config.devMode, 'Sleet animation resumed');
    }
}
