// Base Animation Class for Animated Weather Card
// Provides common interface and lifecycle methods for all weather animations

import { devLog } from './utils';
import { AnimatedWeatherCardConfig } from './types';

/**
 * Animation lifecycle states
 */
export enum AnimationLifecycleState {
    CREATED = 'created',
    STARTING = 'starting', 
    ACTIVE = 'active',
    PAUSED = 'paused',
    STOPPING = 'stopping',
    STOPPED = 'stopped',
    DESTROYED = 'destroyed'
}

/**
 * Base configuration for all animations
 */
export interface BaseAnimationConfig {
    intensity: number;
    scale: number;
    windSpeed?: number;
    timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
    devMode?: boolean;
}

/**
 * Base Animation Class
 * All weather animations should extend this class for consistent behavior
 */
export abstract class BaseAnimation {
    protected element: HTMLElement;
    protected config: BaseAnimationConfig;
    protected cardConfig: AnimatedWeatherCardConfig;
    protected state: AnimationLifecycleState;
    protected animationHandles: any[] = [];
    protected timeouts: any[] = [];
    protected particles: HTMLElement[] = [];
    /** The live wind speed from the weather entity, in its own unit */
    protected realWindSpeed?: number;

    // Abstract properties that must be implemented by subclasses
    public abstract readonly animationType: string;
    public abstract readonly layerSelector: string;
    public abstract readonly containerSelector?: string;

    constructor(element: HTMLElement, config: BaseAnimationConfig, cardConfig: AnimatedWeatherCardConfig) {
        this.element = element;
        this.config = config;
        this.cardConfig = cardConfig;
        this.state = AnimationLifecycleState.CREATED;

        // Note: subclasses set `animationType` (abstract) before super() runs
        // by virtue of class-field initialization order in TS, but reading
        // it in the base ctor body still trips strict mode. Defer the log
        // a microtask so the subclass field is definitely populated.
        queueMicrotask(() => devLog(this.config.devMode, `Created ${this.animationType} animation`));
    }
    
    /**
     * Start the animation
     */
    public async start(): Promise<void> {
        if (this.state === AnimationLifecycleState.ACTIVE) {
            devLog(this.config.devMode, `${this.animationType} animation already active`);
            return;
        }
        
        try {
            this.setState(AnimationLifecycleState.STARTING);
            devLog(this.config.devMode, `Starting ${this.animationType} animation with intensity ${this.config.intensity}`);
            
            // Ensure container is visible
            this.ensureLayerVisibility(true);
            
            // Call subclass implementation
            await this.onStart();
            
            this.setState(AnimationLifecycleState.ACTIVE);
            
        } catch (error) {
            console.error(`Failed to start ${this.animationType} animation:`, error);
            this.setState(AnimationLifecycleState.STOPPED);
            throw error;
        }
    }
    
    /**
     * Stop the animation
     */
    public async stop(): Promise<void> {
        if (this.state === AnimationLifecycleState.STOPPED || this.state === AnimationLifecycleState.DESTROYED) {
            return;
        }
        
        try {
            this.setState(AnimationLifecycleState.STOPPING);
            devLog(this.config.devMode, `Stopping ${this.animationType} animation`);
            
            // Call subclass implementation
            await this.onStop();
            
            // Clean up common resources
            this.cleanup();
            
            // Hide container
            this.ensureLayerVisibility(false);
            
            this.setState(AnimationLifecycleState.STOPPED);
            
        } catch (error) {
            console.error(`Failed to stop ${this.animationType} animation:`, error);
            throw error;
        }
    }
    
    /**
     * Pause the animation
     */
    public async pause(): Promise<void> {
        if (this.state !== AnimationLifecycleState.ACTIVE) {
            return;
        }
        
        try {
            devLog(this.config.devMode, `Pausing ${this.animationType} animation`);
            await this.onPause();
            this.setState(AnimationLifecycleState.PAUSED);
        } catch (error) {
            console.error(`Failed to pause ${this.animationType} animation:`, error);
            throw error;
        }
    }
    
    /**
     * Resume the animation
     */
    public async resume(): Promise<void> {
        if (this.state !== AnimationLifecycleState.PAUSED) {
            return;
        }

        try {
            devLog(this.config.devMode, `Resuming ${this.animationType} animation`);
            // Set ACTIVE before calling onResume so handlers can schedule work
            // (e.g. lightning's scheduleNext() checks for ACTIVE state)
            this.setState(AnimationLifecycleState.ACTIVE);
            await this.onResume();
        } catch (error) {
            console.error(`Failed to resume ${this.animationType} animation:`, error);
            // Revert to PAUSED on failure so retry is possible
            this.setState(AnimationLifecycleState.PAUSED);
            throw error;
        }
    }
    
    /**
     * Follow a new live wind speed without restarting. A restart throws the
     * weather away and draws it again at random, which reads as a snap.
     * Animations read the speed whenever they create something (a leaf, the
     * next start); ones that move continuously also follow it in place.
     */
    public setWindSpeed(windSpeed: number | undefined): void {
        this.realWindSpeed = windSpeed;
        if (this.state === AnimationLifecycleState.ACTIVE || this.state === AnimationLifecycleState.PAUSED) {
            this.onWindSpeedChange();
        }
    }
    
    /**
     * Destroy the animation and clean up all resources
     */
    public async destroy(): Promise<void> {
        if (this.state !== AnimationLifecycleState.DESTROYED) {
            await this.stop();
            this.setState(AnimationLifecycleState.DESTROYED);
            devLog(this.config.devMode, `Destroyed ${this.animationType} animation`);
        }
    }
    
    
    /**
     * Get current state
     */
    public getState(): AnimationLifecycleState {
        return this.state;
    }
    
    /**
     * Check if animation is active
     */
    public isActive(): boolean {
        return this.state === AnimationLifecycleState.ACTIVE;
    }
    
    /**
     * Check if animation is paused
     */
    public isPaused(): boolean {
        return this.state === AnimationLifecycleState.PAUSED;
    }
    
    // Protected methods for subclasses to implement
    protected abstract onStart(): Promise<void>;
    protected abstract onStop(): Promise<void>;
    protected abstract onPause(): Promise<void>;
    protected abstract onResume(): Promise<void>;
    /** Apply a wind speed change to what's already moving. Most need nothing. */
    protected onWindSpeedChange(): void {}

    // Protected helper methods
    protected setState(newState: AnimationLifecycleState): void {
        const oldState = this.state;
        this.state = newState;
        devLog(this.config.devMode, `${this.animationType} state: ${oldState} → ${newState}`);
    }
    
    /** Layers other animations also live in; their opacity is never toggled. */
    private static readonly SHARED_LAYERS = ['.animated-weather-card', '.animation-layer'];

    protected ensureLayerVisibility(visible: boolean): void {
        // Set container visibility
        if (this.containerSelector) {
            const container = this.element.querySelector(this.containerSelector) as HTMLElement;
            if (container) {
                container.style.display = visible ? 'block' : 'none';
                devLog(this.config.devMode, `Set ${this.animationType} container visibility: ${visible}`);
            }
        }
        
        // Set layer opacity. Never on the card itself, and never on the shared
        // .animation-layer: clouds, stars and fog draw into it, but it also
        // holds the sun, the lightning flash and the planes, so hiding it when
        // clouds stop would leave the next condition's sun invisible.
        const layer = this.element.querySelector(this.layerSelector) as HTMLElement;
        if (layer && !BaseAnimation.SHARED_LAYERS.includes(this.layerSelector)) {
            layer.style.opacity = visible ? '1' : '0';
            devLog(this.config.devMode, `Set ${this.animationType} layer opacity: ${visible ? 1 : 0}`);
        }
    }
    
    protected cleanup(): void {
        // Clear intervals and timeouts
        this.animationHandles.forEach(handle => {
            if (handle) clearInterval(handle);
        });
        this.animationHandles = [];
        
        this.timeouts.forEach(timeout => {
            if (timeout) {
                if (typeof timeout === 'function') {
                    const actualTimeout = timeout();
                    if (actualTimeout) clearTimeout(actualTimeout);
                } else {
                    clearTimeout(timeout);
                }
            }
        });
        this.timeouts = [];
        
        // Kill GSAP animations
        if (window.gsap) {
            this.particles.forEach(particle => {
                window.gsap.killTweensOf(particle);
            });
        }
        
        // Remove particle elements
        this.particles.forEach(particle => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        });
        this.particles = [];
        
        devLog(this.config.devMode, `Cleaned up ${this.animationType} animation resources`);
    }
    
    protected addAnimationHandle(handle: any): void {
        this.animationHandles.push(handle);
    }
    
    protected addTimeout(timeout: any): void {
        this.timeouts.push(timeout);
    }
    
    protected addParticle(particle: HTMLElement): void {
        this.particles.push(particle);
    }
    
    protected removeParticle(particle: HTMLElement): void {
        const index = this.particles.indexOf(particle);
        if (index > -1) {
            this.particles.splice(index, 1);
        }
    }
    
    
    
    
    
}