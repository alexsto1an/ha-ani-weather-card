// DevPanel - the developer panel, shipped in its own bundle
// (animated-weather-card-dev.js) and loaded only when dev_mode is on, so
// dashboards that never use it don't download it.

import type { AnimatedWeatherCardConfig, AnimationControllerStates, AnimationStateKey, HomeAssistant } from './types';
import type { WeatherAnimationController } from './animation-controller';
import type { TimeOfDayManager } from './time-manager';
import type { FlightInfo } from './flight-tracker';
import { PERFORMANCE_THRESHOLDS, DEV_PANEL_CONFIG } from './constants';
import { devLog, getWeatherClass, updateDevModeWeatherInfo } from './utils';
import { getDevPanelStyles } from './styles/dev-panel';

/** The panel only exists on a card in dev mode, so it always logs */
const log = (message: string, ...args: unknown[]) => devLog(true, message, ...args);

/** One of each aircraft family the planes draw (aircraft.ts), by ICAO type code */
const DEMO_AIRCRAFT = ['A20N', 'B738', 'B789', 'B77W', 'B748', 'CRJ9', 'C68A', 'AT76', 'C172', 'EC35'];

/**
 * What the panel needs from the card. Plain names on purpose: the card and
 * the panel are minified as separate bundles, and names starting with "_"
 * are mangled differently in each.
 */
export interface DevPanelHost extends HTMLElement {
    config?: AnimatedWeatherCardConfig;
    readonly hass?: HomeAssistant;
    animationController?: WeatherAnimationController;
    timeOfDayManager?: TimeOfDayManager;
    currentDevCondition?: string;
    animationsPaused: boolean;
    wasManuallyPaused: boolean;
    devTimeOverride: boolean;
    setAnimationsPaused(paused: boolean): void;
    applySkyPhase(): void;
    flyPlanes(flights: FlightInfo[]): void;
}

/** Space between the card and its docked panel */
const DEV_PANEL_GAP_PX = 12;

export class DevPanel {
    private open = false;
    private timePhase = 'day';
    /** Ignore slider events while a preset sets the sliders */
    private programmaticSliderUpdate = false;
    /** Auto-refresh of the performance figures while the panel is open */
    private performanceInterval?: number;

    constructor(private readonly card: DevPanelHost) {}

    get isOpen(): boolean {
        return this.open;
    }

    /**
     * Put the panel (or, closed, its toggle button) into the card. The card
     * calls this after every render, which replaces its contents.
     */
    mount(): void {
        if (!this.card.config?.dev_mode) return;
        if (!this.open && this.performanceInterval) {
            clearInterval(this.performanceInterval);
            this.performanceInterval = undefined;
        }
        if (!this.card.querySelector('style.awc-dev-styles')) {
            const style = document.createElement('style');
            style.className = 'awc-dev-styles';
            style.textContent = getDevPanelStyles();
            this.card.prepend(style);
        }
        const existing = this.card.querySelector('.dev-controls, .dev-toggle');
        if (existing) existing.outerHTML = this.render();
        else this.card.querySelector('style.awc-dev-styles')!.insertAdjacentHTML('afterend', this.render());
        this.attach();
    }

    /** The card left the page: stop refreshing the figures. */
    disconnect(): void {
        if (this.performanceInterval) clearInterval(this.performanceInterval);
        this.performanceInterval = undefined;
    }

    togglePause(): void {
        this.card.wasManuallyPaused = !this.card.animationsPaused;
        this.card.setAnimationsPaused(!this.card.animationsPaused);
    }

    /**
     * Dock the open dev panel outside the card, so it doesn't cover the sky
     * it's tuning: to the right when the viewport has room, else the left,
     * else below the card.
     */
    dock(): void {
        const panel = this.card.querySelector('.dev-controls') as HTMLElement | null;
        // Lift the card over its neighbours while the panel hangs over them
        this.card.style.zIndex = panel ? '5' : '';
        if (!panel) return;
        const card = this.card.getBoundingClientRect();
        if (card.width === 0) return; // not laid out yet; the resize observer retries
        const width = panel.offsetWidth || 288;
        const viewport = document.documentElement.clientWidth || window.innerWidth;
        const side = card.right + DEV_PANEL_GAP_PX + width <= viewport - DEV_PANEL_GAP_PX ? 'right'
            : card.left - DEV_PANEL_GAP_PX - width >= DEV_PANEL_GAP_PX ? 'left'
            : 'below';
        if (panel.dataset.dock !== side) panel.dataset.dock = side;
    }

    private attach() {
        if (!this.card.config?.dev_mode) return;
        this.dock();

        // Dev panel toggle button
        const toggleBtn = this.card.querySelector('#dev-toggle-btn') as HTMLButtonElement;
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.open = true;
                this.mount();
            });
        }

        // Dev panel close button
        const closeBtn = this.card.querySelector('#dev-close-btn') as HTMLButtonElement;
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.open = false;
                this.mount();
            });
        }

        // Weather preset selector
        const selector = this.card.querySelector('#dev-weather-selector') as HTMLSelectElement;
        if (selector) {
            selector.addEventListener('change', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const condition = (e.currentTarget as HTMLSelectElement).value;
                
                if (condition && condition !== this.card.currentDevCondition) {
                    // Apply weather preset by enabling individual animations
                    this.card.currentDevCondition = condition;
                    this.updateWeatherInfo(); // Update weather display without full re-render
                    await this.applyPreset(condition);
                } else if (!condition) {
                    // Manual control mode - clear preset
                    this.card.currentDevCondition = '';
                    const weatherSelector = this.card.querySelector('#dev-weather-selector') as HTMLSelectElement;
                    if (weatherSelector) weatherSelector.value = '';
                }
            });
        }

        // Day/Night time override controls
        const timeOverrideCheckbox = this.card.querySelector('#dev-day-night-override') as HTMLInputElement;
        const timePhaseSelector = this.card.querySelector('#dev-time-phase') as HTMLSelectElement;
        
        if (timeOverrideCheckbox && timePhaseSelector) {
            timeOverrideCheckbox.addEventListener('change', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.card.devTimeOverride = (e.target as HTMLInputElement).checked;
                timePhaseSelector.disabled = !this.card.devTimeOverride;
                
                if (this.card.devTimeOverride) {
                    // Enable time override - force update with current dev phase
                    await this.updateDevTimeOverride();
                } else {
                    // Disable time override - restore normal time behavior
                    if (this.card.timeOfDayManager) {
                        this.card.timeOfDayManager.clearDevOverride();
                    }
                }
            });
            
            timePhaseSelector.addEventListener('change', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                this.timePhase = (e.target as HTMLSelectElement).value;
                if (this.card.devTimeOverride) {
                    await this.updateDevTimeOverride();
                }
            });
        }

        // Individual animation checkboxes
        const animationTypes = ['rain', 'snow', 'sleet', 'wind', 'lightning', 'clouds', 'fog', 'stars', 'sun'];
        animationTypes.forEach(type => {
            const checkbox = this.card.querySelector(`#dev-${type}`) as HTMLInputElement;
            const slider = this.card.querySelector(`#dev-${type}-intensity`) as HTMLInputElement;
            
            if (checkbox && this.card.animationController) {
                checkbox.addEventListener('change', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isChecked = (e.target as HTMLInputElement).checked;
                    const intensity = slider ? parseFloat(slider.value) : 1;
                    
                    if (isChecked) {
                        await this.card.animationController!.startAnimation(type as AnimationStateKey, { intensity });
                        if (slider) slider.disabled = false;
                        // Ensure the particle layer is visible for manual animation control
                        this.setLayerVisibility(type, true);
                    } else {
                        await this.card.animationController!.stopAnimation(type as AnimationStateKey);
                        if (slider) slider.disabled = true;
                        // Hide the particle layer when animation is stopped
                        this.setLayerVisibility(type, false);
                    }
                    
                    // Clear weather preset when manually controlling animations
                    this.card.currentDevCondition = '';
                    const weatherSelector = this.card.querySelector('#dev-weather-selector') as HTMLSelectElement;
                    if (weatherSelector) weatherSelector.value = '';
                    
                    // Update background based on dominant weather condition
                    this.updateBackgroundForIndividualAnimations();
                });
            }
            
            if (slider && this.card.animationController) {
                slider.addEventListener('input', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Skip if this is a programmatic update (e.g., from preset application)
                    if (this.programmaticSliderUpdate) {
                        return;
                    }
                    
                    const intensity = parseFloat((e.target as HTMLInputElement).value);
                    const animationState = this.card.animationController!.animations[type as AnimationStateKey];
                    
                    if (animationState.isActive) {
                        // Restart animation with new intensity
                        await this.card.animationController!.stopAnimation(type as AnimationStateKey);
                        await this.card.animationController!.startAnimation(type as AnimationStateKey, { intensity });
                        
                        // Update background based on dominant weather condition
                        this.updateBackgroundForIndividualAnimations();
                    }
                });
            }
        });

        // Clear all button
        const clearBtn = this.card.querySelector('#dev-clear-btn') as HTMLButtonElement;
        if (clearBtn && this.card.animationController) {
            clearBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.card.animationController!.stopAllAnimations();
                this.mount(); // Update dev controls to reflect cleared animations
                this.updateBackgroundForIndividualAnimations(); // Update background when all cleared
            });
        }

        // Pause button
        const pauseBtn = this.card.querySelector('#dev-pause-btn') as HTMLButtonElement;
        if (pauseBtn) {
            pauseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.togglePause();
            });
        }

        // Demo plane fly-over
        const flyPlaneBtn = this.card.querySelector('#dev-fly-plane') as HTMLButtonElement;
        if (flyPlaneBtn) {
            flyPlaneBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.flyDemoPlane();
            });
        }

        // Performance metrics refresh button
        const metricsRefreshBtn = this.card.querySelector('#dev-metrics-refresh') as HTMLButtonElement;
        if (metricsRefreshBtn) {
            metricsRefreshBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.updatePerformanceMetrics();
            });
            
            // Auto-refresh metrics when dev panel is open
            if (this.open && !this.performanceInterval) {
                this.performanceInterval = window.setInterval(() => {
                    this.updatePerformanceMetrics();
                }, DEV_PANEL_CONFIG.METRICS_REFRESH_INTERVAL);
                
                // Initial update
                setTimeout(() => {
                    this.updatePerformanceMetrics();
                }, DEV_PANEL_CONFIG.METRICS_INITIAL_DELAY);
            }
        }
    }



    updatePauseButton() {
        const pauseBtn = this.card.querySelector('#dev-pause-btn') as HTMLButtonElement;
        if (pauseBtn) {
            pauseBtn.innerHTML = this.card.animationsPaused ? '<ha-icon class="play-icon" icon="mdi:play"></ha-icon>' : '<ha-icon class="pause-icon" icon="mdi:pause"></ha-icon>';
            const label = this.card.animationsPaused ? 'Resume animations' : 'Pause animations';
            pauseBtn.title = label;
            pauseBtn.setAttribute('aria-label', label);
            pauseBtn.setAttribute('aria-pressed', String(this.card.animationsPaused));
        }
    }



    /**
     * Updates performance metrics displayed in the dev panel
     * Collects data about particles, animations, frame rate, and memory usage
     * Only runs when dev mode is enabled and dev panel is open
     */
    updatePerformanceMetrics(): void {
        if (!this.card.config?.dev_mode || !this.open) return;

        try {
            // Always use legacy metrics collection for now since modular system isn't fully integrated
            this.collectLegacyMetrics();
        } catch (error) {
            console.warn('Failed to update performance metrics:', error);
            this.displayPerformanceMetrics(0, 0, 0, 0);
        }
    }

    /**
     * Collects performance metrics using legacy DOM-based counting methods
     * Provides fallback when modular animation system is not available
     * Uses graceful degradation for missing features
     */
    private collectLegacyMetrics(): void {
        log('Collecting legacy performance metrics...');
        
        let totalParticles = 0;
        let activeAnimations = 0;
        let memoryUsage = 0;
        let frameRate = 60; // Default optimistic assumption

        try {
            // Count particles in DOM with error handling
            totalParticles = this.safeCountParticles();
        } catch (error) {
            console.warn('Error counting particles:', error);
            totalParticles = 0;
        }

        try {
            // Count active animations with fallback strategies
            activeAnimations = this.safeCountActiveAnimations();
        } catch (error) {
            console.warn('Error counting active animations:', error);
            activeAnimations = 0;
        }

        try {
            // Memory usage with feature detection
            memoryUsage = this.safeGetMemoryUsage();
        } catch (error) {
            console.warn('Error getting memory usage:', error);
            memoryUsage = 0;
        }

        try {
            // Frame rate estimation with performance consideration
            frameRate = this.estimateFrameRate(totalParticles, activeAnimations);
        } catch (error) {
            console.warn('Error estimating frame rate:', error);
            frameRate = 60; // Optimistic fallback
        }

        log(`Performance metrics collected: ${totalParticles} particles, ${activeAnimations} animations, ${frameRate} fps, ${memoryUsage} KB`);
        
        this.displayPerformanceMetrics(totalParticles, activeAnimations, frameRate, memoryUsage);
    }

    /**
     * Safely counts particle elements in the DOM with error boundaries
     */
    private safeCountParticles(): number {
        const particleSelectors = [
            '.raindrop', 
            '.snowflake', 
            '.star-gsap', 
            '.cloud-gsap', 
            '.wind-leaf', 
            '.wind-swoosh',
            '.sleet-particle',
            '.moon-gsap',
            '.fog-layer'
        ];
        
        let totalCount = 0;
        
        particleSelectors.forEach(selector => {
            try {
                const elements = this.card.querySelectorAll(selector);
                const count = elements ? elements.length : 0;
                totalCount += count;
                if (count > 0) {
                    log(`Found ${count} ${selector} particles`);
                }
            } catch (error) {
                log(`Error counting ${selector} particles:`, error);
            }
        });

        return totalCount;
    }

    /**
     * Safely counts active animations with multiple fallback strategies
     */
    private safeCountActiveAnimations(): number {
        // Primary: Use animation controller if available
        if (this.card.animationController) {
            try {
                const states = this.card.animationController.getAnimationStates();
                if (states) {
                    const activeStates = Object.values(states).filter(state => state && state.isActive);
                    log(`Active animations via controller: ${activeStates.length}`);
                    return activeStates.length;
                }
            } catch (error) {
                log('Error getting animation states from controller:', error);
            }
        }
        return 0;
    }

    /**
     * Safely retrieves memory usage with feature detection
     */
    private safeGetMemoryUsage(): number {
        if (typeof performance === 'undefined') {
            log('Performance API not available');
            return 0;
        }

        const memoryInfo = performance.memory;
        if (!memoryInfo || typeof memoryInfo.usedJSHeapSize !== 'number') {
            log('Memory info not available');
            return 0;
        }

        return Math.round(memoryInfo.usedJSHeapSize / 1024); // Convert to KB
    }

    /**
     * Estimates frame rate based on current load indicators
     */
    private estimateFrameRate(particleCount: number, animationCount: number): number {
        // Conservative estimation based on load
        if (particleCount > 200 && animationCount > 4) {
            return 30; // Heavy load
        } else if (particleCount > 100 && animationCount > 2) {
            return 45; // Moderate load
        } else if (particleCount > 50 || animationCount > 1) {
            return 55; // Light load
        }
        
        return 60; // Optimal conditions
    }

    private displayPerformanceMetrics(particles: number, animations: number, fps: number, memory: number): void {
        log(`Attempting to display performance metrics: ${particles} particles, ${animations} animations, ${fps} fps, ${memory} KB`);
        
        const particlesElement = this.card.querySelector('#metric-particles');
        const animationsElement = this.card.querySelector('#metric-animations');
        const framerateElement = this.card.querySelector('#metric-framerate');
        const memoryElement = this.card.querySelector('#metric-memory');

        log(`Performance elements found:`, {
            particles: !!particlesElement,
            animations: !!animationsElement,
            framerate: !!framerateElement,
            memory: !!memoryElement
        });

        if (particlesElement) {
            particlesElement.textContent = particles.toString();
            particlesElement.className = `metric-value ${this.getPerformanceClass(particles, PERFORMANCE_THRESHOLDS.PARTICLES)}`;
            log(`Updated particles element: ${particles}`);
        } else {
            log('Particles element not found');
        }

        if (animationsElement) {
            animationsElement.textContent = animations.toString();
            animationsElement.className = `metric-value ${this.getPerformanceClass(animations, PERFORMANCE_THRESHOLDS.ANIMATIONS)}`;
            log(`Updated animations element: ${animations}`);
        } else {
            log('Animations element not found');
        }

        if (framerateElement) {
            const fpsText = fps > 0 ? `${fps} fps` : '--';
            framerateElement.textContent = fpsText;
            // Frame rate uses inverted logic (higher is better)
            const frameRateClass = fps >= PERFORMANCE_THRESHOLDS.FRAME_RATE.GOOD ? 'metric-good' : 
                                 fps >= PERFORMANCE_THRESHOLDS.FRAME_RATE.WARNING ? 'metric-warning' : 
                                 fps > 0 ? 'metric-critical' : 'metric-value';
            framerateElement.className = `metric-value ${frameRateClass}`;
            log(`Updated framerate element: ${fpsText}`);
        } else {
            log('Framerate element not found');
        }

        if (memoryElement) {
            const memoryText = memory > 0 ? `${memory} KB` : '--';
            memoryElement.textContent = memoryText;
            memoryElement.className = `metric-value ${this.getPerformanceClass(memory, PERFORMANCE_THRESHOLDS.MEMORY)}`;
            log(`Updated memory element: ${memoryText}`);
        } else {
            log('Memory element not found');
        }

        log(`Performance metrics display complete`);
    }

    /**
     * Helper method to determine performance metric CSS class based on thresholds
     */
    private getPerformanceClass(value: number, thresholds: { GOOD: number; WARNING: number }): string {
        if (value < thresholds.GOOD) return 'metric-good';
        if (value < thresholds.WARNING) return 'metric-warning';
        return 'metric-critical';
    }

    render(): string {
        if (!this.open) {
            // Closed: a single quiet button in the corner
            return `
        <div class="dev-toggle">
          <button class="dev-toggle-btn" id="dev-toggle-btn" title="Open developer controls" aria-label="Open developer controls">
            <ha-icon icon="mdi:tune-variant"></ha-icon>
          </button>
        </div>
      `;
        }

        const animationStates: Partial<AnimationControllerStates> = this.card.animationController?.getAnimationStates() || {};
        const conditions: [string, string][] = [
            ['sunny', 'Sunny'], ['partly-cloudy', 'Partly cloudy'], ['cloudy', 'Cloudy'], ['foggy', 'Foggy'],
            ['windy', 'Windy'], ['light-rain', 'Light rain'], ['rainy', 'Rainy'], ['pouring', 'Pouring'],
            ['stormy', 'Stormy'], ['snowy', 'Snowy'], ['snowy-rainy', 'Snow and rain'], ['sleety', 'Sleet'],
            ['snowy-stormy', 'Snowstorm'], ['sleety-stormy', 'Sleet storm'], ['clear-night', 'Clear night'],
        ];
        const phases: [string, string][] = [['dawn', 'Dawn'], ['day', 'Day'], ['dusk', 'Dusk'], ['night', 'Night']];
        const layers: [AnimationStateKey, string, number][] = [
            ['rain', 'Rain', 10], ['snow', 'Snow', 5], ['sleet', 'Sleet', 5], ['wind', 'Wind', 3],
            ['lightning', 'Lightning', 3], ['clouds', 'Clouds', 2], ['fog', 'Fog', 2], ['stars', 'Stars', 2], ['sun', 'Sun', 1],
        ];
        const layerRows = layers.map(([key, label, max]) => {
            const state = animationStates[key];
            return `
            <div class="dev-layer">
              <input type="checkbox" id="dev-${key}" ${state?.isActive ? 'checked' : ''}>
              <label for="dev-${key}">${label}</label>
              <input type="range" id="dev-${key}-intensity" min="0.1" max="${max}" step="0.1" value="${state?.intensity || 1}"
                     aria-label="${label} intensity" ${!state?.isActive ? 'disabled' : ''}>
            </div>`;
        }).join('');

        return `
      <div class="dev-controls" role="dialog" aria-label="Developer controls">
        <div class="dev-header">
          <span class="dev-title">Developer</span>
          <button class="dev-close-btn" id="dev-close-btn" title="Close developer controls" aria-label="Close developer controls">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <div class="dev-body">
          <section class="dev-section">
            <label class="dev-section-label" for="dev-weather-selector">Condition</label>
            <select class="dev-selector" id="dev-weather-selector">
              <option value="" ${!this.card.currentDevCondition ? 'selected' : ''}>Manual (layers below)</option>
              ${conditions.map(([value, label]) => `<option value="${value}" ${this.card.currentDevCondition === value ? 'selected' : ''}>${label}</option>`).join('')}
            </select>
          </section>

          <section class="dev-section">
            <span class="dev-section-label">Time of day</span>
            <div class="dev-time-controls">
              <label class="dev-check">
                <input type="checkbox" id="dev-day-night-override" ${this.card.devTimeOverride ? 'checked' : ''}>
                <span>Override</span>
              </label>
              <select class="dev-selector dev-time-selector" id="dev-time-phase" aria-label="Time of day" ${!this.card.devTimeOverride ? 'disabled' : ''}>
                ${phases.map(([value, label]) => `<option value="${value}" ${this.timePhase === value ? 'selected' : ''}>${label}</option>`).join('')}
              </select>
            </div>
          </section>

          <section class="dev-section">
            <span class="dev-section-label">Layers</span>
            <div class="dev-layers">${layerRows}
            </div>
          </section>

          <section class="dev-section">
            <div class="dev-section-head">
              <span class="dev-section-label">Performance</span>
              <button class="dev-icon-btn" id="dev-metrics-refresh" title="Refresh performance data" aria-label="Refresh performance data">
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            </div>
            <dl class="dev-performance-metrics" id="dev-performance-metrics">
              <div class="performance-metric"><dt class="metric-label">Particles</dt><dd class="metric-value" id="metric-particles">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Animations</dt><dd class="metric-value" id="metric-animations">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Frame rate</dt><dd class="metric-value" id="metric-framerate">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Memory</dt><dd class="metric-value" id="metric-memory">--</dd></div>
            </dl>
          </section>
        </div>

        <div class="dev-actions">
          <button class="dev-btn" id="dev-fly-plane" title="Fly a demo plane across the card">
            <ha-icon icon="mdi:airplane"></ha-icon><span>Fly a plane</span>
          </button>
          <button class="dev-btn" id="dev-clear-btn" title="Stop every animation">
            <ha-icon icon="mdi:stop"></ha-icon><span>Clear</span>
          </button>
          <button class="dev-btn dev-pause-btn" id="dev-pause-btn"
                  title="${this.card.animationsPaused ? 'Resume animations' : 'Pause animations'}"
                  aria-label="${this.card.animationsPaused ? 'Resume animations' : 'Pause animations'}"
                  aria-pressed="${this.card.animationsPaused}">
            ${this.card.animationsPaused ? '<ha-icon class="play-icon" icon="mdi:play"></ha-icon>' : '<ha-icon class="pause-icon" icon="mdi:pause"></ha-icon>'}
          </button>
        </div>
      </div>
    `;
    }

    updateWeatherInfo() {
        if (!this.card.config?.dev_mode) return;
        const condition = this.card.currentDevCondition || 'sunny';
        updateDevModeWeatherInfo(this.card, condition);
    }

    setLayerVisibility(animationType: string, visible: boolean) {
        log(`setLayerVisibility called: ${animationType} = ${visible}`);
        
        // Map animation types to their container and layer selectors
        const containerMap = {
            'rain': '.rain-container',
            'snow': '.snow-container',
            'sleet': '.sleet-container',
            'wind': '.wind-container',
            'lightning': '.lightning-container',
            'clouds': '.clouds-container',
            'fog': '.fog-container',
            'stars': '.stars-container',
            'sun': '.sun-container'
        };

        const layerMap = {
            'rain': '.rain-layer',
            'snow': '.snow-layer',
            'sleet': '.sleet-layer',
            'wind': '.wind-layer',
            'lightning': '.lightning',
            'clouds': '.clouds-layer',
            'fog': '.animated-weather-card', // Fog layers are added to card directly
            'stars': '.animation-layer', // Stars use animation-layer
            'sun': '.animated-weather-card' // Sun is part of the card
        };

        // Show/hide the animation container
        const containerSelector = containerMap[animationType as keyof typeof containerMap];
        if (containerSelector) {
            const container = this.card.querySelector(containerSelector) as HTMLElement;
            if (container) {
                container.style.display = visible ? 'block' : 'none';
                log(`Set ${animationType} container (${containerSelector}) display to ${visible ? 'block' : 'none'}`);
            } else {
                log(`Container not found: ${containerSelector}`);
            }
        }

        // Set layer opacity, but never on the card itself or on the shared
        // .animation-layer (it also holds the sun, lightning and planes)
        const layerSelector = layerMap[animationType as keyof typeof layerMap];
        if (layerSelector) {
            if (layerSelector === '.animated-weather-card' || layerSelector === '.animation-layer') {
                return;
            }
            
            const layer = this.card.querySelector(layerSelector) as HTMLElement;
            if (layer) {
                layer.style.opacity = visible ? '1' : '0';
                log(`Set ${animationType} layer (${layerSelector}) opacity to ${visible ? '1' : '0'}`);
            } else {
                log(`Layer not found: ${layerSelector}`);
            }
        }
    }

    async applyPreset(condition: string) {
        if (!this.card.animationController) return;

        // Get the preset mapping from the animation controller
        const mappings = this.card.animationController.getWeatherMappings() as unknown as Record<string, { animations: string[]; overrides?: Record<string, { intensity?: number }> }>;
        const mapping = mappings[condition.toLowerCase()];
        if (!mapping) {
            console.warn(`No animation mapping found for weather condition: ${condition}`);
            return;
        }

        log(`Applying preset: ${condition} with animations: ${mapping.animations.join(', ')}`);
        
        // Debug: Check card visibility before changes
        const card = this.card.querySelector('.animated-weather-card') as HTMLElement;
        if (card) {
            log(`Card opacity before preset: ${getComputedStyle(card).opacity}`);
            log(`Card display before preset: ${getComputedStyle(card).display}`);
            
            // Update the card's weather class to match the preset
            const weatherClass = getWeatherClass(
                condition,
                this.card.config?.dev_mode ?? false,
                this.card.config?.sunrise_hour,
                this.card.config?.sunset_hour,
                this.card.hass?.config?.time_zone
            );
            const colorPalette = this.card.config?.color_palette || 'default';
            // The card has long since painted by the time the dev panel is used
            card.className = `animated-weather-card ${weatherClass} ${colorPalette === 'theme' ? 'theme-colors' : ''} transitions-enabled`.trim();

            log(`Updated card classes to: ${card.className}`);

            // Trigger background update if using time override or if time cycle is enabled
            if (this.card.timeOfDayManager && (this.card.devTimeOverride || this.card.config?.enable_day_night_cycle)) {
                const currentState = this.card.timeOfDayManager.getCurrentState();
                this.card.applySkyPhase();
            }
        }

        // First, disable all individual animations
        const allAnimationTypes = ['rain', 'snow', 'sleet', 'wind', 'lightning', 'clouds', 'fog', 'stars', 'sun'];
        for (const type of allAnimationTypes) {
            const checkbox = this.card.querySelector(`#dev-${type}`) as HTMLInputElement;
            if (checkbox && checkbox.checked) {
                log(`Stopping ${type} animation`);
                checkbox.checked = false;
                // Trigger the animation stop
                await this.card.animationController!.stopAnimation(type as AnimationStateKey);
                this.setLayerVisibility(type, false);
                
                // Disable the slider
                const slider = this.card.querySelector(`#dev-${type}-intensity`) as HTMLInputElement;
                if (slider) slider.disabled = true;
            }
        }

        // Then enable animations specified in the preset
        for (const animationType of mapping.animations) {
            const checkbox = this.card.querySelector(`#dev-${animationType}`) as HTMLInputElement;
            const slider = this.card.querySelector(`#dev-${animationType}-intensity`) as HTMLInputElement;
            
            if (checkbox) {
                log(`Starting ${animationType} animation`);
                checkbox.checked = true;
                
                // Get intensity from preset overrides or default to 1
                const override = mapping.overrides?.[animationType];
                const intensity = override?.intensity || 1;
                
                // Set slider value and enable it
                if (slider) {
                    this.programmaticSliderUpdate = true;
                    slider.value = intensity.toString();
                    slider.disabled = false;
                    // Use setTimeout to reset the flag after the event has processed
                    setTimeout(() => {
                        this.programmaticSliderUpdate = false;
                    }, 0);
                }
                
                // Start the animation
                await this.card.animationController!.startAnimation(animationType as AnimationStateKey, { intensity });
                this.setLayerVisibility(animationType, true);
            }
        }
        
        // Debug: Check card visibility after changes
        if (card) {
            log(`Card opacity after preset: ${getComputedStyle(card).opacity}`);
            log(`Card display after preset: ${getComputedStyle(card).display}`);
        }
    }

    /** Dev panel: fly a made-up flight of a random aircraft, with random heading, altitude and speed. */
    private flyDemoPlane(): void {
        const climb = Math.random();
        this.card.flyPlanes([{
            id: `demo-${Date.now()}`,
            label: `DEMO${Math.floor(100 + Math.random() * 900)}`,
            aircraftCode: DEMO_AIRCRAFT[Math.floor(Math.random() * DEMO_AIRCRAFT.length)],
            altitudeFt: Math.round(2000 + Math.random() * 36000),
            groundSpeedKt: Math.round(180 + Math.random() * 320),
            heading: Math.round(Math.random() * 360),
            verticalSpeed: climb < 0.3 ? 1800 : climb > 0.7 ? -1200 : 0,
            onGround: false,
        }]);
    }

    /**
     * Update background based on dominant weather condition from individual animations
     */
    private updateBackgroundForIndividualAnimations(): void {
        if (!this.card.animationController || !this.card.timeOfDayManager) return;
        
        // Get currently active animations
        const activeAnimations = Object.entries(this.card.animationController.animations)
            .filter(([_, state]) => state.isActive)
            .map(([type, _]) => type);
            
        log('Active individual animations:', activeAnimations);
        
        if (activeAnimations.length === 0) {
            // No animations active - use default sunny background
            this.updateCardWeatherClass('sunny');
            return;
        }
        
        // Determine dominant weather condition based on priority
        const dominantCondition = this.getDominantWeatherCondition(activeAnimations);
        log('Dominant weather condition:', dominantCondition);
        
        // Update card class and background
        this.updateCardWeatherClass(dominantCondition);
        
        // Always trigger background update for individual animations (dev mode functionality)
        // This allows testing time-based backgrounds even when day/night cycle is disabled in config
        if (this.card.timeOfDayManager && this.card.config?.color_palette === 'default') {
            const currentState = this.card.timeOfDayManager.getCurrentState();
            this.card.applySkyPhase();
        }
    }

    /**
     * Determine dominant weather condition from active animations based on priority
     */
    private getDominantWeatherCondition(activeAnimations: string[]): string {
        // Weather condition priority (higher index = more dominant)
        const weatherPriority = [
            'sun',        // 0 - weakest, can be overridden by anything
            'stars',      // 1 - night equivalent of sun
            'fog',        // 2 - mild weather
            'clouds',     // 3 - mild weather  
            'wind',       // 4 - moderate weather
            'rain',       // 5 - significant weather
            'snow',       // 6 - significant weather
            'sleet',      // 7 - harsh weather
            'lightning'   // 8 - most dominant (storms override everything)
        ];
        
        // Find the most dominant animation
        let dominantAnimation = activeAnimations[0];
        let highestPriority = -1;
        
        for (const animation of activeAnimations) {
            const priority = weatherPriority.indexOf(animation);
            if (priority > highestPriority) {
                highestPriority = priority;
                dominantAnimation = animation;
            }
        }
        
        // Map animation types to weather condition classes
        const animationToWeatherClass: { [key: string]: string } = {
            'sun': 'sunny',
            'stars': 'clear-night', // Night condition
            'rain': 'rainy',
            'snow': 'snowy', 
            'sleet': 'sleety',
            'wind': 'windy',
            'lightning': 'stormy',
            'clouds': 'cloudy',
            'fog': 'foggy'
        };
        
        // Handle special combinations
        if (activeAnimations.includes('lightning')) {
            if (activeAnimations.includes('snow')) {
                return 'snowy-stormy';
            } else if (activeAnimations.includes('sleet')) {
                return 'sleety-stormy';
            } else {
                return 'stormy'; // Lightning + rain or just lightning
            }
        }
        
        if (activeAnimations.includes('snow') && activeAnimations.includes('rain')) {
            return 'snowy-rainy';
        }
        
        // Check for sun + clouds = partly cloudy
        if (activeAnimations.includes('sun') && activeAnimations.includes('clouds')) {
            return 'partly-cloudy';
        }
        
        // Default to single dominant condition
        return animationToWeatherClass[dominantAnimation] || 'sunny';
    }

    /**
     * Update card weather class and preserve other classes
     */
    private updateCardWeatherClass(weatherCondition: string): void {
        const card = this.card.querySelector('.animated-weather-card') as HTMLElement;
        if (!card) return;
        
        const weatherClass = getWeatherClass(
            weatherCondition,
            this.card.config?.dev_mode ?? false,
            this.card.config?.sunrise_hour,
            this.card.config?.sunset_hour,
            this.card.hass?.config?.time_zone
        );
        const colorPalette = this.card.config?.color_palette || 'default';
        card.className = `animated-weather-card ${weatherClass} ${colorPalette === 'theme' ? 'theme-colors' : ''} transitions-enabled`.trim();

        log(`Updated card weather class to: ${weatherClass} (full classes: ${card.className})`);
    }

    /**
     * Update dev time override to force specific time phase for testing
     */
    private async updateDevTimeOverride(): Promise<void> {
        if (!this.card.timeOfDayManager || !this.card.devTimeOverride || !this.card.animationController) return;
        
        const timePhase = (this.timePhase || 'day') as 'dawn' | 'day' | 'dusk' | 'night';

        // Override the time of day manager to return our dev phase
        this.card.timeOfDayManager.setDevOverride(timePhase);
        
        // Force update background and animation colors - bypass the enable check for dev mode
        const currentState = this.card.timeOfDayManager.getCurrentState();
        this.card.applySkyPhase(); // Call directly instead of onTimeOfDayChanged
        
        // Automatically select appropriate animations based on time of day
        // Clear existing sun/stars animations first
        await this.card.animationController.stopAnimation('sun');
        await this.card.animationController.stopAnimation('stars');
        
        // Select animation based on time phase
        if (timePhase === 'night') {
            // Night: show stars and moon
            await this.card.animationController.startAnimation('stars', { intensity: 1 });
            log(`Dev time override: ${timePhase} - Stars animation started`);
        } else {
            // Day/Dawn/Dusk: show sun
            const sunIntensity = timePhase === 'dawn' ? 0.7 : (timePhase === 'dusk' ? 0.8 : 1.0);
            await this.card.animationController.startAnimation('sun', { intensity: sunIntensity });
            log(`Dev time override: ${timePhase} - Sun animation started (intensity: ${sunIntensity})`);
        }
        
        // Clear weather preset selection since we're manually controlling time-based animations
        this.card.currentDevCondition = '';
        const weatherSelector = this.card.querySelector('#dev-weather-selector') as HTMLSelectElement;
        if (weatherSelector) weatherSelector.value = '';
        
        // Update dev panel checkboxes to reflect the changes
        this.mount();
        
        log(`Dev time override: ${timePhase}`);
    }
}
