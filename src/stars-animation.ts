// StarsAnimation - Modular stars and moon animation for clear night sky

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig } from './types';
import { getWeatherSettings, devLog } from './utils';

/** Share of stars that twinkle, and how far they dim when they do. */
const STAR_TWINKLE_SHARE = 1 / 3;
const STAR_TWINKLE_DEPTH = 0.35;

export interface StarsAnimationConfig extends BaseAnimationConfig {
    starCount: number;
    showMoon: boolean;
}

export class StarsAnimation extends BaseAnimation {
    public readonly animationType = 'stars';
    public readonly layerSelector = '.animation-layer';
    public readonly containerSelector = '.stars-container';

    protected starsConfig: StarsAnimationConfig;

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig & Partial<StarsAnimationConfig>,
        cardConfig: AnimatedWeatherCardConfig,
        realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
        this.realWindSpeed = realWindSpeed;
        this.starsConfig = {
            starCount: 30,
            showMoon: true,
            ...config
        };
        devLog(this.config.devMode, 'StarsAnimation created');
    }

    protected async onStart(): Promise<void> {
        if (!window.gsap) {
            throw new Error('GSAP not loaded - cannot start stars animation');
        }

        const animationLayer = this.element.querySelector(this.layerSelector);
        if (!animationLayer) {
            throw new Error(`Animation layer not found: ${this.layerSelector}`);
        }

        const settings = getWeatherSettings(this.cardConfig, this.realWindSpeed);
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement;

        // Clear existing stars
        card?.querySelectorAll('.stars-field, .star-gsap, .moon-gsap').forEach(s => {
            if (window.gsap) window.gsap.killTweensOf(s);
            s.remove();
        });

        // Calculate star count based on cloud density
        const starCount = Math.max(15, Math.round(settings.cloudCount * 5));

        // Stars twinkle with CSS keyframes (compositor-only, no per-star
        // tween). Only about a third twinkle, gently, each on its own slow
        // period and phase; the rest just shine.
        const field = document.createElement('div');
        field.className = 'stars-field';
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star-gsap';
            const size = 1 + Math.random() * 3;
            const opacity = 0.3 + Math.random() * 0.5;
            star.style.cssText = `
                width: ${size.toFixed(2)}px;
                height: ${size.toFixed(2)}px;
                left: ${(Math.random() * 100).toFixed(2)}%;
                top: ${(Math.random() * 70).toFixed(2)}%;
                opacity: ${opacity.toFixed(2)};
            `;
            if (Math.random() < STAR_TWINKLE_SHARE) {
                const period = 3 + Math.random() * 4;
                star.classList.add('twinkle');
                star.style.setProperty('--star-o', opacity.toFixed(2));
                star.style.setProperty('--star-dim', (opacity * (1 - Math.random() * STAR_TWINKLE_DEPTH)).toFixed(2));
                star.style.animationDuration = `${period.toFixed(2)}s`;
                star.style.animationDelay = `${(-Math.random() * period).toFixed(2)}s`;
            }
            field.appendChild(star);
        }
        animationLayer.appendChild(field);
        this.addParticle(field);

        // The field fades in as one, rather than star by star
        window.gsap.fromTo(field, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' });

        // The moon takes the sun's place in the top-right, clear of the
        // temperature. Its disc stays steady; only its halo breathes (CSS).
        if (this.starsConfig.showMoon) {
            const moon = document.createElement('div');
            moon.className = 'moon-gsap';
            animationLayer.appendChild(moon);
            this.addParticle(moon);
            window.gsap.fromTo(moon, { opacity: 0 }, { opacity: 1, duration: 1.2, ease: 'power1.out' });
        }

        devLog(this.config.devMode, `Stars animation started with ${starCount} stars`);
    }

    protected async onStop(): Promise<void> {
        const animationLayer = this.element.querySelector(this.layerSelector);
        if (animationLayer) {
            const elements = animationLayer.querySelectorAll('.stars-field, .star-gsap, .moon-gsap');
            elements.forEach(el => {
                if (window.gsap) window.gsap.killTweensOf(el);
                if (el.parentNode) el.parentNode.removeChild(el);
            });
        }

        devLog(this.config.devMode, 'Stars animation stopped');
    }

    /** Twinkles and the moon's halo are CSS animations; pause them in place. */
    private setPaused(paused: boolean): void {
        this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`)
            .forEach(el => el.classList.toggle('paused', paused));
    }

    protected async onPause(): Promise<void> {
        this.setPaused(true);
        devLog(this.config.devMode, 'Stars animation paused');
    }

    protected async onResume(): Promise<void> {
        this.setPaused(false);
        devLog(this.config.devMode, 'Stars animation resumed');
    }
}
