// RainAnimation - rain as a fixed field of recycled drops

import { BaseAnimation, BaseAnimationConfig } from './base-animation';
import { AnimatedWeatherCardConfig, AnimatedWeatherCardElement, EngineAmounts } from './types';
import { getWeatherSettings, getTimeAwareAnimationColor, devLog } from './utils';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { ParticlePool, prewarm, areaFactor } from './particle-pool';
import { RAIN_DROP_LENGTH, RAIN_JOIN_STAGGER, RAIN_REBOUNDS, RAIN_SPLASH_DOTS, rainDot, rainDropOpacity, rainDropWidth, rainFall, rainPoolSize, rainRebound } from './rain-motion';
import { WebGLRain } from './rain-webgl';
import { mountWebGLParticles } from './precipitation-webgl';
import type { GSAPTimeline, RainKind } from './types';

export type { RainKind };
export { RAIN_POOL_SIZE, RAIN_SPEED, RAIN_SPLASH_SHARE, RAIN_REBOUND_RISE, quadraticLength, rainPoolSize } from './rain-motion';

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Rain animation specific configuration
 */
export interface RainAnimationConfig extends BaseAnimationConfig {
    isStorm: boolean;
    isPouring: boolean;
    isLightRain: boolean;
    particleCount: number;
    splashEnabled: boolean;
}

/**
 * Rain Animation Class
 * Implements modular rain animation with physics, time-awareness, and performance monitoring
 */
export class RainAnimation extends BaseAnimation {
    /** The rain's kind now: how fast it falls and how long its drops are; each fall reads it */
    private kind: RainKind = 'rain';
    private card?: HTMLElement;
    public readonly animationType = 'rain';
    public readonly layerSelector = '.rain-layer';
    public readonly containerSelector = '.rain-container';
    
    protected rainConfig: RainAnimationConfig;
    private pool?: ParticlePool;
    private gpu?: WebGLRain;
    private paused = false;
    private splashLayer?: HTMLElement;
    private splashColor = 'white';
    private splashBounce = 1;
    private splashDots: HTMLElement[] = [];
    private nextSplashDot = 0;
    private rebounds: SVGSVGElement[] = [];
    private nextRebound = 0;
    
    
    constructor(
        element: HTMLElement, 
        config: BaseAnimationConfig & Partial<RainAnimationConfig>, 
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        
        this.realWindSpeed = realWindSpeed;
        this.rainConfig = {
            isStorm: false,
            isPouring: false,
            isLightRain: false,
            particleCount: 50,
            splashEnabled: true,
            ...config
        };
        
        
        devLog(this.config.devMode, `RainAnimation created with config:`, this.rainConfig);
    }
    
    /**
     * Start the rain animation
     */
    protected async onStart(): Promise<void> {
        if (!window.AnimatedWeatherCardGsap) {
            throw new Error('GSAP not loaded - cannot start rain animation');
        }

        const rainLayer = this.element.querySelector<HTMLElement>(this.layerSelector);
        if (!rainLayer) {
            throw new Error(`Rain layer not found: ${this.layerSelector}`);
        }


        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector<HTMLElement>('.animated-weather-card');
        if (!card) throw new Error('Rain card not found');
        this.card = card;
        // In auto mode the amounts say the rain's kind and how much; in manual, the condition and rainCount
        this.kind = this.amounts?.rain.kind ?? this.rainKind();
        const color = this.getRainColor((this.element as AnimatedWeatherCardElement).timeOfDayManager);
        const spill = this.cardConfig.spill_particles !== false;

        this.splashBounce = settings.splashBounce / DEFAULT_ENGINE_SETTINGS.splashBounce;
        const startDom = () => this.startDom(rainLayer, card, spill, color);
        if (this.cardConfig.use_webgl === true) {
            this.gpu = mountWebGLParticles(rainLayer, 'rain', (canvas, lost) => {
                canvas.style.color = color;
                return new WebGLRain(canvas, card, { spill, splash: this.rainConfig.splashEnabled, bounce: this.splashBounce, lost });
            }, renderer => renderer.resizePopulation(this.kind, this.dropCount(), true),
            () => { this.gpu = undefined; startDom(); });
            if (this.gpu) {
                if (!this.paused) this.gpu.resume();
                return;
            }
        }
        startDom();
    }

    private startDom(layer: HTMLElement, card: HTMLElement, spill: boolean, color: string): void {
        this.splashLayer = layer;
        this.splashColor = color;
        const count = this.dropCount();

        this.pool = new ParticlePool(
            layer,
            () => {
                const width = rainDropWidth(this.kind);
                const length = RAIN_DROP_LENGTH[this.kind];
                const drop = document.createElement('div');
                drop.className = 'raindrop';
                drop.dataset.kind = this.kind;
                drop.style.cssText = `
                    width: ${width.toFixed(2)}px;
                    height: ${length}px;
                    background: linear-gradient(0deg, ${color}, transparent);
                    border-radius: ${width.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `;
                // Thinner drops read as farther away
                drop.dataset.width = width.toFixed(2);
                return drop;
            },
            (drop, next, warm) => this.fall(drop, card, spill, next, warm),
            drop => this.removeParticle(drop),
        );
        if (this.paused) this.pool.pause();
        this.pool.start(count).forEach(drop => this.addParticle(drop));

        devLog(this.config.devMode, `Rain animation started - ${count} drops (${this.kind})`);
    }

    /** Drops in the air: the amounts' in auto mode, the condition's pool times rainCount in manual; more on a bigger card */
    private dropCount(): number {
        const card = this.card;
        if (!card) return 0;
        if (this.amounts) return Math.max(4, Math.round(this.amounts.rain.drops * areaFactor(card.offsetWidth, card.offsetHeight)));
        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        return rainPoolSize(this.kind, settings.rainCount, card.offsetWidth, card.offsetHeight);
    }

    /**
     * New amounts while it rains: the kind changes at each drop's next fall (its speed and length), and drops join from
     * above the card or leave at the end of their fall, so the rain thickens or thins and never jumps.
     */
    protected onAmountsChange(_previous: EngineAmounts | null, _quick: boolean): void {
        this.kind = this.amounts?.rain.kind ?? this.rainKind();
        const count = this.dropCount();
        this.gpu?.resizePopulation(this.kind, count);
        this.pool?.resize(count, RAIN_JOIN_STAGGER).forEach(drop => this.addParticle(drop));
    }

    /**
     * One fall of one drop, at constant speed (rain falls at terminal
     * velocity). A splashing drop's head stops on the card's bottom edge and
     * its streak runs into the splash; every other drop falls out of the
     * frame: past the edge, fading, with spill on, or behind it without.
     */
    private fall(drop: HTMLElement, card: HTMLElement, spill: boolean, next: () => void, warm: boolean): GSAPTimeline {
        const height = card.offsetHeight;
        // The rain's kind now: a drop takes a new kind's length as it starts its next fall
        const kind = this.kind;
        const { length, x, splash, startY, endY, fallSec, fadeStart, endSec } =
            rainFall(kind, card.offsetWidth, height, spill, this.rainConfig.splashEnabled);
        if (drop.dataset.kind !== kind) {
            drop.style.height = `${length}px`;
            drop.dataset.kind = kind;
        }
        const dropWidth = parseFloat(drop.dataset.width || '2');

        window.AnimatedWeatherCardGsap.set(drop, { x, scaleY: 1, opacity: rainDropOpacity(dropWidth) });
        const tl = window.AnimatedWeatherCardGsap.timeline({ onComplete: next });
        tl.fromTo(drop, { y: startY }, { y: endY, duration: fallSec, ease: 'none' });
        if (splash) {
            // The streak keeps moving into the edge while the splash starts
            tl.call(() => this.createSplash(x + dropWidth / 2, height), [], fallSec);
            tl.to(drop, { scaleY: 0, duration: endSec - fallSec, ease: 'none' }, fallSec);
        } else if (spill) {
            tl.to(drop, { opacity: 0, duration: endSec - fadeStart, ease: 'power1.in' }, fadeStart);
        }
        return prewarm(tl, warm);
    }

    /**
     * Stop the rain animation
     */
    protected async onStop(): Promise<void> {
        this.gpu?.stop();
        this.gpu = undefined;
        this.paused = false;
        this.pool?.stop();
        this.pool = undefined;
        this.splashDots.forEach(dot => {
            window.AnimatedWeatherCardGsap?.killTweensOf(dot);
            dot.remove();
        });
        this.splashDots = [];
        this.rebounds.forEach(svg => {
            window.AnimatedWeatherCardGsap?.killTweensOf([svg, svg.firstChild]);
            svg.remove();
        });
        this.rebounds = [];

        // Stragglers from an older version of the card
        this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`)
            .forEach(el => el.remove());

        devLog(this.config.devMode, `Rain animation stopped`);
    }

    /**
     * Pause the rain animation
     */
    protected async onPause(): Promise<void> {
        this.paused = true;
        this.gpu?.pause();
        this.pool?.pause();
        devLog(this.config.devMode, `Rain animation paused`);
    }

    /**
     * Resume the rain animation
     */
    protected async onResume(): Promise<void> {
        this.paused = false;
        this.gpu?.resume();
        this.pool?.resume();
        devLog(this.config.devMode, `Rain animation resumed`);
    }

    private rainKind(): RainKind {
        if (this.rainConfig.isPouring) return 'pouring';
        if (this.rainConfig.isStorm) return 'storm';
        if (this.rainConfig.isLightRain) return 'light';
        return 'rain';
    }

    /**
     * A splash where a drop meets the bottom edge: the drop springs back
     * up off the edge, and two droplets are thrown out in short arcs.
     * Splash elements are reused round-robin.
     */
    private createSplash(x: number, y: number): void {
        if (this.paused || !window.AnimatedWeatherCardGsap || !this.splashLayer) return;
        this.createRebound(x, y);
        for (const side of [-1, 1]) {
            let dot = this.splashDots[this.nextSplashDot];
            if (!dot) {
                dot = document.createElement('div');
                dot.className = 'rain-splash';
                dot.style.background = this.splashColor;
                this.splashLayer.appendChild(dot);
                this.splashDots[this.nextSplashDot] = dot;
            }
            this.nextSplashDot = (this.nextSplashDot + 1) % RAIN_SPLASH_DOTS;

            const { duration, rise, spread } = rainDot(side, this.splashBounce);
            window.AnimatedWeatherCardGsap.killTweensOf(dot);
            window.AnimatedWeatherCardGsap.set(dot, { x: x - 1, y: y - 2, opacity: 0.9 });
            const tl = window.AnimatedWeatherCardGsap.timeline();
            tl.to(dot, { x: x - 1 + spread, duration, ease: 'power1.out' }, 0)
              .to(dot, { y: y - 2 - rise, duration: duration * 0.45, ease: 'power2.out' }, 0)
              .to(dot, { y: y - 2, duration: duration * 0.55, ease: 'power2.in' }, duration * 0.45)
              .to(dot, { opacity: 0, duration: duration * 0.4, ease: 'power1.in' }, duration * 0.6);
        }
    }

    /**
     * The drop springs back off the edge: a thin streak that runs up a
     * short arc and falls back past the edge. The Splash bounce setting
     * scales how high and far it goes.
     */
    private createRebound(x: number, y: number): void {
        const layer = this.splashLayer!;
        let svg = this.rebounds[this.nextRebound];
        if (!svg) {
            svg = document.createElementNS(SVG_NS, 'svg');
            svg.classList.add('rain-rebound');
            const arc = document.createElementNS(SVG_NS, 'path');
            arc.setAttribute('fill', 'none');
            arc.style.stroke = this.splashColor;
            svg.appendChild(arc);
            layer.appendChild(svg);
            this.rebounds[this.nextRebound] = svg;
        }
        this.nextRebound = (this.nextRebound + 1) % RAIN_REBOUNDS;

        const arc = svg.firstChild as SVGPathElement;
        const { rise, reach, fall, length, streak, duration } = rainRebound(this.splashBounce);
        // A quadratic arc whose control point sits at twice the apex height
        // peaks at about `rise`, then lands `fall` px below the edge.
        arc.setAttribute('d', `M 0,0 Q ${reach.toFixed(1)},${(-2 * rise).toFixed(1)} ${(2 * reach).toFixed(1)},${fall.toFixed(1)}`);
        arc.style.strokeDasharray = `${streak.toFixed(1)} ${(length + streak).toFixed(1)}`;

        window.AnimatedWeatherCardGsap.killTweensOf([svg, arc]);
        window.AnimatedWeatherCardGsap.set(svg, { x, y, opacity: 0.85 });
        window.AnimatedWeatherCardGsap.timeline()
            .fromTo(arc, { strokeDashoffset: streak, strokeWidth: 1.6 },
                { strokeDashoffset: -length, strokeWidth: 0.6, duration, ease: 'power2.out' }, 0)
            .to(svg, { opacity: 0, duration: duration * 0.35, ease: 'power1.in' }, duration * 0.65);
    }

    /**
     * Get time-aware rain color
     */
    private getRainColor(timeOfDayManager?: any): string {
        if (this.rainConfig.isStorm) {
            return getTimeAwareAnimationColor('lightning', timeOfDayManager, 'var(--weather-storm-rain-color)');
        }
        return getTimeAwareAnimationColor('rain', timeOfDayManager, 'var(--weather-rain-color)');
    }
    
    
}
