// Animation Controller for Animated Weather Card.
//
// The controller is now a thin coordinator: it owns per-type state (active,
// paused, intensity), maps weather conditions to animation lists, and
// delegates every lifecycle call to the modular bridge. The previous
// implementation kept a parallel "legacy" path (the `animations.ts`
// functions) behind feature flags; that path has been removed and lives
// only in git history.

import { AnimationState, AnimationControllerStates, AnimationStateKey, AnimationConfig, WeatherAnimationMapping } from './types';
import { AnimatedWeatherCardConfig } from './types';
import { devLog } from './utils';
import { ModularIntegrationBridge } from './modular-integration-bridge';
import { TimeOfDayManager } from './time-manager';

export class WeatherAnimationController {
    private element: HTMLElement;
    private config: AnimatedWeatherCardConfig;
    private currentWindSpeed: number = 10;
    private isPausedFn?: () => boolean;
    private modularBridge: ModularIntegrationBridge;
    private timeOfDayManager?: TimeOfDayManager;
    // Bumped on every start/stop/applyWeatherCondition so a stale deferred
    // start from a previous call can no-op when its `await` resolves.
    private generation: number = 0;

    public animations: Record<AnimationStateKey, AnimationState> = {
        rain:      { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        snow:      { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        sleet:     { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        wind:      { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        lightning: { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        clouds:    { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        fog:       { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        stars:     { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
        sun:       { isActive: false, isPaused: false, intensity: 1, animationHandles: [], timeouts: [] },
    };

    private defaultWeatherMappings: WeatherAnimationMapping = {
        'sunny':         { animations: ['sun'] },
        'rainy':         { animations: ['rain'] },
        'snowy':         { animations: ['snow'] },
        'stormy':        { animations: ['rain', 'lightning'], overrides: { rain: { intensity: 2 } } },
        'windy':         { animations: ['wind'] },
        'cloudy':        { animations: ['clouds'] },
        'foggy':         { animations: ['fog'] },
        'partly-cloudy': { animations: ['sun', 'clouds'], overrides: { sun: { intensity: 0.7 }, clouds: { intensity: 0.6 } } },
        'pouring':       { animations: ['rain'], overrides: { rain: { intensity: 8 } } },
        'snowy-rainy':   { animations: ['snow', 'rain'] },
        'clear-night':   { animations: ['stars'] },
        'sleety':        { animations: ['sleet'] },
        'snowy-stormy':  { animations: ['snow', 'lightning'] },
        'light-rain':    { animations: ['rain'], overrides: { rain: { intensity: 0.3 } } },
        'sleety-stormy': { animations: ['sleet', 'lightning'] },
    };

    constructor(
        element: HTMLElement,
        config: AnimatedWeatherCardConfig,
        isPausedFn?: () => boolean,
        timeOfDayManager?: TimeOfDayManager
    ) {
        this.element = element;
        this.config = config;
        this.isPausedFn = isPausedFn;
        this.timeOfDayManager = timeOfDayManager;
        this.modularBridge = new ModularIntegrationBridge(element, config, timeOfDayManager, this.currentWindSpeed);
        devLog(this.config.dev_mode, 'WeatherAnimationController initialized');
    }

    public setWindSpeed(windSpeed: number): void {
        this.currentWindSpeed = windSpeed;
        this.modularBridge.updateWindSpeed(windSpeed);
    }

    public async startAnimation(type: AnimationStateKey, config?: Partial<AnimationConfig>): Promise<void> {
        const animationState = this.animations[type];
        if (animationState.isActive) {
            devLog(this.config.dev_mode, `Animation ${type} already active — skipping`);
            return;
        }

        const intensity = config?.intensity ?? animationState.intensity ?? 1;
        const startGeneration = this.generation;

        animationState.isActive = true;
        animationState.intensity = intensity;
        this.setAnimationLayerVisibility(type, true);

        try {
            const animation = await this.modularBridge.startModularAnimation(type, intensity);
            // If a stop/restart happened while we were awaiting, this start
            // is now stale — drop it so we don't end up with two concurrent
            // creation pipelines for the same type.
            if (startGeneration !== this.generation) {
                devLog(this.config.dev_mode, `Discarding stale start for ${type} (generation drifted)`);
                await this.modularBridge.stopModularAnimation(type);
                return;
            }
            if (!animation) {
                animationState.isActive = false;
                console.warn(`No modular animation available for type: ${type}`);
                return;
            }
            devLog(this.config.dev_mode, `Started ${type} animation with intensity ${intensity}`);
        } catch (error) {
            console.error(`Failed to start ${type} animation:`, error);
            animationState.isActive = false;
        }
    }

    public async stopAnimation(type: AnimationStateKey): Promise<void> {
        const animationState = this.animations[type];
        if (!animationState.isActive) return;

        this.generation++;
        try {
            await this.modularBridge.stopModularAnimation(type);
            devLog(this.config.dev_mode, `Stopped ${type} animation`);
        } catch (error) {
            console.error(`Error stopping ${type} animation:`, error);
        }

        this.setAnimationLayerVisibility(type, false);
        animationState.isActive = false;
        animationState.isPaused = false;
    }

    public pauseAnimation(type: AnimationStateKey): void {
        const animationState = this.animations[type];
        if (!animationState.isActive || animationState.isPaused) return;
        animationState.isPaused = true;
        // Bridge pause is async but we don't need to block the caller —
        // the underlying GSAP tweens pause synchronously.
        void this.modularBridge.pauseModularAnimation(type);
        devLog(this.config.dev_mode, `Paused ${type} animation`);
    }

    public resumeAnimation(type: AnimationStateKey): void {
        const animationState = this.animations[type];
        if (!animationState.isActive || !animationState.isPaused) return;
        animationState.isPaused = false;
        void this.modularBridge.resumeModularAnimation(type);
        devLog(this.config.dev_mode, `Resumed ${type} animation`);
    }

    public async stopAllAnimations(): Promise<void> {
        this.generation++;
        await Promise.all(
            Object.keys(this.animations).map(type => this.stopAnimation(type as AnimationStateKey))
        );
    }

    public pauseAllAnimations(): void {
        Object.keys(this.animations).forEach(type => this.pauseAnimation(type as AnimationStateKey));
    }

    public resumeAllAnimations(): void {
        Object.keys(this.animations).forEach(type => this.resumeAnimation(type as AnimationStateKey));
    }

    /**
     * Map a weather condition to its animation set and start them. Awaits
     * the full stop-then-start sequence so the caller can chain another
     * applyWeatherCondition without racing.
     */
    public async applyWeatherCondition(weatherCondition: string): Promise<void> {
        await this.stopAllAnimations();
        this.clearIndividualAnimationClasses();

        const mapping = (this.defaultWeatherMappings as unknown as Record<string, { animations: string[]; overrides?: Record<string, { intensity?: number }> }>)[weatherCondition.toLowerCase()];
        if (!mapping) {
            console.warn(`No animation mapping for weather condition: ${weatherCondition}`);
            return;
        }

        // Await every start so an in-flight applyWeatherCondition can't be
        // overlapped by another one that picks up half-initialised state.
        await Promise.all(
            mapping.animations.map((animationType: string) => {
                const override = mapping.overrides?.[animationType];
                return this.startAnimation(animationType as AnimationStateKey, override);
            })
        );

        devLog(this.config.dev_mode, `Applied weather condition: ${weatherCondition} with animations: ${mapping.animations.join(', ')}`);
    }

    public getAnimationStates(): AnimationControllerStates {
        return { ...this.animations };
    }

    public getWeatherMappings(): WeatherAnimationMapping {
        return this.defaultWeatherMappings;
    }

    /** Toggle the per-type CSS class so layer-specific styles can switch on it. */
    private setAnimationLayerVisibility(type: AnimationStateKey, visible: boolean): void {
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement | null;
        if (!card) return;
        const animationClass = `individual-${type}-active`;
        if (visible) card.classList.add(animationClass);
        else card.classList.remove(animationClass);
    }

    private clearIndividualAnimationClasses(): void {
        const card = this.element.querySelector('.animated-weather-card') as HTMLElement | null;
        if (!card) return;
        for (const type of Object.keys(this.animations)) {
            card.classList.remove(`individual-${type}-active`);
        }
    }
}
