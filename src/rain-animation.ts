// RainAnimation - rain as a fixed field of recycled drops

import { BaseAnimation, BaseAnimationConfig } from './base-animation';
import { AnimatedWeatherCardConfig, AnimatedWeatherCardElement } from './types';
import { getWeatherSettings, getTimeAwareAnimationColor, devLog } from './utils';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { ParticlePool, prewarm, between, areaFactor } from './particle-pool';
import type { GSAPTimeline } from './types';

export type RainKind = 'light' | 'rain' | 'storm' | 'pouring';

/** Drops alive at once on a 420×230 card at the default rain amount. */
export const RAIN_POOL_SIZE: Record<RainKind, number> = { light: 10, rain: 18, storm: 24, pouring: 32 };
/** Fall speed range in px/s. Heavier rain falls faster and longer. */
export const RAIN_SPEED: Record<RainKind, [number, number]> = {
    light: [300, 380], rain: [420, 520], storm: [520, 620], pouring: [620, 760],
};
const RAIN_DROP_LENGTH: Record<RainKind, number> = { light: 16, rain: 24, storm: 34, pouring: 42 };
/** Share of drops that end in a splash on the card's bottom edge. */
export const RAIN_SPLASH_SHARE = 0.3;
const RAIN_SPLASH_DOTS = 16;
const RAIN_REBOUNDS = 8;
/** How high a drop springs back off the edge, in px at the default splash bounce. */
export const RAIN_REBOUND_RISE: [number, number] = [10, 30];
const SVG_NS = 'http://www.w3.org/2000/svg';

/** Length of a quadratic Bézier from the origin, by sampling. */
export function quadraticLength(cx: number, cy: number, ex: number, ey: number): number {
    let length = 0;
    let px = 0;
    let py = 0;
    for (let i = 1; i <= 16; i++) {
        const t = i / 16;
        const x = 2 * (1 - t) * t * cx + t * t * ex;
        const y = 2 * (1 - t) * t * cy + t * t * ey;
        length += Math.hypot(x - px, y - py);
        px = x;
        py = y;
    }
    return length;
}

/**
 * How many drops a card keeps in the air: the type's base count, scaled by
 * the "Rain amount" setting and the card's area so big cards aren't sparse.
 */
export function rainPoolSize(kind: RainKind, rainAmount: number, width: number, height: number): number {
    return Math.max(4, Math.round(RAIN_POOL_SIZE[kind] * rainAmount * areaFactor(width, height)));
}

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
    public readonly animationType = 'rain';
    public readonly layerSelector = '.rain-layer';
    public readonly containerSelector = '.rain-container';
    
    protected rainConfig: RainAnimationConfig;
    private pool?: ParticlePool;
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
        if (!window.gsap) {
            throw new Error('GSAP not loaded - cannot start rain animation');
        }

        const rainLayer = this.element.querySelector(this.layerSelector);
        if (!rainLayer) {
            throw new Error(`Rain layer not found: ${this.layerSelector}`);
        }


        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;
        const kind = this.rainKind();
        const count = rainPoolSize(kind, settings.rainCount, card.offsetWidth, card.offsetHeight);
        const color = this.getRainColor((this.element as AnimatedWeatherCardElement).timeOfDayManager);
        const spill = this.cardConfig.spill_particles !== false;
        const length = RAIN_DROP_LENGTH[kind];
        const maxWidth = kind === 'pouring' ? 3 : 2.4;

        this.splashLayer = rainLayer as HTMLElement;
        this.splashColor = color;
        this.splashBounce = settings.splashBounce / DEFAULT_ENGINE_SETTINGS.splashBounce;

        this.pool = new ParticlePool(
            rainLayer,
            () => {
                const width = between(1, maxWidth);
                const drop = document.createElement('div');
                drop.className = 'raindrop';
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
            (drop, next, warm) => this.fall(drop, card, kind, length, spill, next, warm),
        );
        this.pool.start(count).forEach(drop => this.addParticle(drop));

        devLog(this.config.devMode, `Rain animation started - ${count} drops (${kind})`);
    }

    /**
     * One fall of one drop, at constant speed (rain falls at terminal
     * velocity). A splashing drop's head stops on the card's bottom edge and
     * its streak runs into the splash; every other drop falls out of the
     * frame: past the edge, fading, with spill on, or behind it without.
     */
    private fall(drop: HTMLElement, card: HTMLElement, kind: RainKind, length: number,
                 spill: boolean, next: () => void, warm: boolean): GSAPTimeline {
        const width = card.offsetWidth;
        const height = card.offsetHeight;
        const [minSpeed, maxSpeed] = RAIN_SPEED[kind];
        const speed = between(minSpeed, maxSpeed);
        const x = between(6, Math.max(7, width - 6));
        const splash = this.rainConfig.splashEnabled && Math.random() < RAIN_SPLASH_SHARE;
        const startY = -length;
        const endY = splash ? height - length : (spill ? height + between(60, 120) : height);
        // A card that isn't laid out yet (height 0) idles instead of spinning
        const fallSec = Math.max(0.25, (endY - startY) / speed);
        const dropWidth = parseFloat(drop.dataset.width || '2');

        window.gsap.set(drop, { x, scaleY: 1, opacity: 0.55 + 0.45 * Math.min(1, dropWidth / 2.4) });
        const tl = window.gsap.timeline({ onComplete: next });
        tl.fromTo(drop, { y: startY }, { y: endY, duration: fallSec, ease: 'none' });
        if (splash) {
            // The streak keeps moving into the edge while the splash starts
            tl.call(() => this.createSplash(x + dropWidth / 2, height), [], fallSec);
            tl.to(drop, { scaleY: 0, duration: length / speed, ease: 'none' }, fallSec);
        } else if (spill) {
            const edgeSec = (height - length - startY) / speed;
            tl.to(drop, { opacity: 0, duration: fallSec - edgeSec, ease: 'power1.in' }, edgeSec);
        }
        return prewarm(tl, warm);
    }

    /**
     * Stop the rain animation
     */
    protected async onStop(): Promise<void> {
        this.pool?.stop();
        this.pool = undefined;
        this.splashDots.forEach(dot => {
            window.gsap?.killTweensOf(dot);
            dot.remove();
        });
        this.splashDots = [];
        this.rebounds.forEach(svg => {
            window.gsap?.killTweensOf([svg, svg.firstChild]);
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
        this.pool?.pause();
        devLog(this.config.devMode, `Rain animation paused`);
    }

    /**
     * Resume the rain animation
     */
    protected async onResume(): Promise<void> {
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
        if (!window.gsap || !this.splashLayer) return;
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

            const duration = between(0.22, 0.28);
            const rise = between(4, 10) * this.splashBounce;
            const spread = side * between(6, 12) * this.splashBounce;
            window.gsap.killTweensOf(dot);
            window.gsap.set(dot, { x: x - 1, y: y - 2, opacity: 0.9 });
            const tl = window.gsap.timeline();
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
        const [minRise, maxRise] = RAIN_REBOUND_RISE;
        const rise = between(minRise, maxRise) * this.splashBounce;
        const reach = (Math.random() < 0.5 ? -1 : 1) * between(10, 24) * this.splashBounce;
        const fall = between(6, 18);
        // A quadratic arc whose control point sits at twice the apex height
        // peaks at about `rise`, then lands `fall` px below the edge.
        arc.setAttribute('d', `M 0,0 Q ${reach.toFixed(1)},${(-2 * rise).toFixed(1)} ${(2 * reach).toFixed(1)},${fall.toFixed(1)}`);
        const length = quadraticLength(reach, -2 * rise, 2 * reach, fall);
        const streak = Math.min(length * 0.45, 6 + rise * 0.3);
        arc.style.strokeDasharray = `${streak.toFixed(1)} ${(length + streak).toFixed(1)}`;

        const duration = between(0.42, 0.56);
        window.gsap.killTweensOf([svg, arc]);
        window.gsap.set(svg, { x, y, opacity: 0.85 });
        window.gsap.timeline()
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
