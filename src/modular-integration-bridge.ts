// Modular Animation Integration Bridge
//
// Constructs concrete modular animation instances on demand and tracks them
// for the WeatherAnimationController. Previously this file held feature
// flags so each animation type could be routed to a legacy implementation
// in `animations.ts`; that legacy path has been removed and every type is
// served by a modular class.

import { BaseAnimation } from './base-animation';
import { RainAnimation } from './rain-animation';
import { SnowAnimation } from './snow-animation';
import { SleetAnimation } from './sleet-animation';
import { WindAnimation } from './wind-animation';
import { LightningAnimation, LIGHTNING_INTERVAL_MS } from './lightning-animation';
import { CloudsAnimation } from './clouds-animation';
import { FogAnimation } from './fog-animation';
import { StarsAnimation } from './stars-animation';
import { SunAnimation } from './sun-animation';
import { AnimatedWeatherCardConfig } from './types';
import { TimeOfDayManager } from './time-manager';
import { devLog } from './utils';

export class ModularIntegrationBridge {
    private element: HTMLElement;
    private config: AnimatedWeatherCardConfig;
    private timeOfDayManager?: TimeOfDayManager;
    private realWindSpeed?: number;

    private activeAnimations = new Map<string, BaseAnimation>();

    constructor(
        element: HTMLElement,
        config: AnimatedWeatherCardConfig,
        timeOfDayManager?: TimeOfDayManager,
        realWindSpeed?: number
    ) {
        this.element = element;
        this.config = config;
        this.timeOfDayManager = timeOfDayManager;
        this.realWindSpeed = realWindSpeed;
    }

    /**
     * Start a modular animation. Returns the live instance, or null if the
     * type isn't recognized.
     */
    public async startModularAnimation(type: string, intensity: number): Promise<BaseAnimation | null> {
        // Stop any in-flight animation of this type so we don't run two
        // concurrent creation pipelines on the same DOM (the cause of the
        // earlier pileup commits).
        if (this.activeAnimations.has(type)) {
            await this.stopModularAnimation(type);
        }

        try {
            const baseConfig = {
                intensity,
                scale: 1,
                windSpeed: this.realWindSpeed || 10,
                timeOfDay: this.timeOfDayManager?.getCurrentState()?.timePhase || 'day',
                devMode: this.config.dev_mode || false
            };

            let animation: BaseAnimation | null = null;

            switch (type) {
                case 'rain':
                    animation = new RainAnimation(this.element, {
                        ...baseConfig,
                        // stormy runs rain at intensity 2, pouring at 8
                        isStorm: intensity >= 2 && intensity <= 4,
                        isPouring: intensity > 4,
                        isLightRain: intensity < 1,
                        particleCount: Math.floor(intensity * 50),
                        splashEnabled: true,
                    }, this.config, this.realWindSpeed);
                    break;

                case 'snow':
                    animation = new SnowAnimation(this.element, {
                        ...baseConfig,
                        particleCount: Math.floor(intensity * 30),
                        accumulation: true,
                        accumulationHeight: 0,
                        swayAmplitude: 30,
                        fallSpeed: 1,
                    }, this.config, this.realWindSpeed);
                    break;

                case 'sleet':
                    animation = new SleetAnimation(this.element, {
                        ...baseConfig,
                        particleCount: Math.floor(intensity * 40),
                    }, this.config, this.realWindSpeed);
                    break;

                case 'wind':
                    animation = new WindAnimation(this.element, {
                        ...baseConfig,
                        leafCount: Math.max(1, Math.floor(intensity * 3)),
                        swooshEnabled: true,
                    }, this.config, this.realWindSpeed);
                    break;

                case 'lightning':
                    animation = new LightningAnimation(this.element, {
                        ...baseConfig,
                        disableShake: this.config.disable_lightning_shake || false,
                        minInterval: LIGHTNING_INTERVAL_MS[0],
                        maxInterval: LIGHTNING_INTERVAL_MS[1],
                    }, this.config, this.realWindSpeed);
                    break;

                case 'clouds':
                    animation = new CloudsAnimation(this.element, {
                        ...baseConfig,
                        cloudCount: Math.max(1, Math.floor(intensity * 2)),
                        isPartlyCloudy: intensity < 3,
                    }, this.config, this.realWindSpeed);
                    break;

                case 'fog':
                    animation = new FogAnimation(this.element, {
                        ...baseConfig,
                        layerCount: Math.max(2, Math.min(5, Math.floor(intensity))),
                    }, this.config, this.realWindSpeed);
                    break;

                case 'stars':
                    animation = new StarsAnimation(this.element, {
                        ...baseConfig,
                        starCount: Math.max(15, Math.floor(intensity * 10)),
                        showMoon: true,
                    }, this.config, this.realWindSpeed);
                    break;

                case 'sun':
                    animation = new SunAnimation(this.element, baseConfig, this.config);
                    break;

                default:
                    devLog(this.config.dev_mode, `No modular animation registered for type: ${type}`);
                    return null;
            }

            await animation.start();
            this.activeAnimations.set(type, animation);
            devLog(this.config.dev_mode, `Started modular ${type} animation with intensity ${intensity}`);
            return animation;
        } catch (error) {
            console.error(`Failed to start modular ${type} animation:`, error);
            return null;
        }
    }

    public async stopModularAnimation(type: string): Promise<void> {
        const animation = this.activeAnimations.get(type);
        if (!animation) return;
        try {
            await animation.destroy();
            devLog(this.config.dev_mode, `Stopped modular ${type} animation`);
        } catch (error) {
            console.error(`Error stopping modular ${type} animation:`, error);
        } finally {
            // Always drop the map entry so updateWindSpeed never
            // iterates over destroyed instances.
            this.activeAnimations.delete(type);
        }
    }

    public async pauseModularAnimation(type: string): Promise<void> {
        const animation = this.activeAnimations.get(type);
        if (animation && animation.isActive()) {
            try {
                await animation.pause();
            } catch (error) {
                console.error(`Error pausing modular ${type} animation:`, error);
            }
        }
    }

    public async resumeModularAnimation(type: string): Promise<void> {
        const animation = this.activeAnimations.get(type);
        if (animation && animation.isPaused()) {
            try {
                await animation.resume();
            } catch (error) {
                console.error(`Error resuming modular ${type} animation:`, error);
            }
        }
    }

    /**
     * Pass a new live wind speed to the running animations, in place. Every
     * data update calls this, so an unchanged value (including a missing
     * one) does nothing.
     */
    public updateWindSpeed(windSpeed: number): void {
        if (Object.is(windSpeed, this.realWindSpeed)) return;
        this.realWindSpeed = windSpeed;
        for (const [type, animation] of this.activeAnimations) {
            try {
                animation.setWindSpeed(windSpeed);
            } catch (error) {
                console.warn(`Failed to update wind speed for ${type}:`, error);
            }
        }
    }

    public async cleanup(): Promise<void> {
        const promises = Array.from(this.activeAnimations.keys()).map(type => this.stopModularAnimation(type));
        await Promise.all(promises);
        this.activeAnimations.clear();
    }
}
