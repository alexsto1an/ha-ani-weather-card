import { TimeOfDayConfig, TimeOfDayState, DayNightColors } from './types';
import { TIME_THRESHOLDS } from './constants';

/**
 * TimeOfDayManager - Centralized time-based logic for day/night animations
 * Provides consistent time detection across all weather animations
 */
export class TimeOfDayManager {
    private config: TimeOfDayConfig;
    private listeners: Set<(state: TimeOfDayState) => void> = new Set();
    private updateInterval?: number;
    private currentState?: TimeOfDayState;
    private devTimePhaseOverride?: 'dawn' | 'day' | 'dusk' | 'night';

    constructor(config: TimeOfDayConfig = {}) {
        this.config = {
            enableDayNightCycle: config.enableDayNightCycle ?? false,
            sunriseHour: 6,
            sunsetHour: 20,
            useBrowserTime: true,
            ...config
        };

        this.updateState();
        if (this.config.enableDayNightCycle) {
            this.startAutoUpdate();
        }
    }

    /**
     * Get current time of day state
     */
    getCurrentState(): TimeOfDayState {
        if (!this.currentState) {
            this.updateState();
        }
        return this.currentState!;
    }

    /**
     * Check if day/night cycle is enabled
     */
    isEnabled(): boolean {
        return this.config.enableDayNightCycle || false;
    }

    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<TimeOfDayConfig>): void {
        const wasEnabled = this.config.enableDayNightCycle;
        this.config = { ...this.config, ...newConfig };
        this.updateState();

        // Start or stop the auto-update interval based on enable state
        if (this.config.enableDayNightCycle && !wasEnabled) {
            this.startAutoUpdate();
        } else if (!this.config.enableDayNightCycle && wasEnabled && this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
    }

    /**
     * Add listener for time state changes
     */
    addListener(callback: (state: TimeOfDayState) => void): void {
        this.listeners.add(callback);
    }

    /**
     * Remove listener
     */
    removeListener(callback: (state: TimeOfDayState) => void): void {
        this.listeners.delete(callback);
    }

    /**
     * Get color for current time of day from a day/night color scheme
     */
    getTimeAwareColor(colors: DayNightColors): string {
        const state = this.getCurrentState();
        
        if (!this.isEnabled()) {
            return colors.day; // Default to day colors when disabled
        }

        switch (state.timePhase) {
            case 'dawn':
                return colors.dawn || this.blendColors(colors.night, colors.day, 0.3);
            case 'day':
                return colors.day;
            case 'dusk':
                return colors.dusk || this.blendColors(colors.day, colors.night, 0.3);
            case 'night':
                return colors.night;
            default:
                return colors.day;
        }
    }

    /**
     * Set dev time override for testing (used by dev panel)
     */
    setDevOverride(timePhase: 'dawn' | 'day' | 'dusk' | 'night'): void {
        this.devTimePhaseOverride = timePhase;
        this.updateState(); // Force immediate update with override
    }

    /**
     * Clear dev time override
     */
    clearDevOverride(): void {
        this.devTimePhaseOverride = undefined;
        this.updateState(); // Force immediate update back to real time
    }

    /**
     * Cleanup resources
     */
    destroy(): void {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = undefined;
        }
        this.listeners.clear();
    }

    /**
     * Update current time state
     */
    private updateState(): void {
        const now = new Date();
        let currentHour: number;
        let currentMinutes: number;

        if (!this.config.useBrowserTime && this.config.timeZone) {
            // Use configured timezone
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: this.config.timeZone,
                hour: 'numeric',
                minute: 'numeric',
                hour12: false
            }).formatToParts(now);
            currentHour = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
            currentMinutes = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);
        } else {
            currentHour = now.getHours();
            currentMinutes = now.getMinutes();
        }
        const hourWithMinutes = currentHour + currentMinutes / 60;

        let timePhase: 'dawn' | 'day' | 'dusk' | 'night';
        
        // Check if dev override is active
        if (this.devTimePhaseOverride) {
            timePhase = this.devTimePhaseOverride;
        } else {
            const sunriseHour = this.config.sunriseHour!;
            const sunsetHour = this.config.sunsetHour!;
            
            // Define time phases with transition periods (wrap around midnight)
            const dawnStart = (sunriseHour - 1 + 24) % 24; // 1 hour before sunrise
            const dayStart = (sunriseHour + 0.5) % 24; // 30 minutes after sunrise
            const duskStart = (sunsetHour - 0.5 + 24) % 24; // 30 minutes before sunset
            const nightStart = (sunsetHour + 1) % 24; // 1 hour after sunset

            // Range check that handles wrap-around (e.g. start=23, end=0.5)
            const inRange = (h: number, start: number, end: number): boolean =>
                start <= end ? (h >= start && h < end) : (h >= start || h < end);

            if (inRange(hourWithMinutes, dawnStart, dayStart)) {
                timePhase = 'dawn';
            } else if (inRange(hourWithMinutes, dayStart, duskStart)) {
                timePhase = 'day';
            } else if (inRange(hourWithMinutes, duskStart, nightStart)) {
                timePhase = 'dusk';
            } else {
                timePhase = 'night';
            }
        }

        const newState: TimeOfDayState = {
            isDaytime: timePhase === 'day' || timePhase === 'dawn',
            isNighttime: timePhase === 'night' || timePhase === 'dusk',
            isDawn: timePhase === 'dawn',
            isDusk: timePhase === 'dusk',
            currentHour,
            timePhase
        };

        // Notify listeners if state changed
        if (!this.currentState || 
            this.currentState.timePhase !== newState.timePhase) {
            this.currentState = newState;
            this.notifyListeners(newState);
        } else {
            this.currentState = newState;
        }
    }

    /**
     * Start automatic state updates
     */
    private startAutoUpdate(): void {
        this.updateInterval = window.setInterval(() => {
            this.updateState();
        }, TIME_THRESHOLDS.UPDATE_INTERVAL);
    }

    /**
     * Notify all listeners of state change
     */
    private notifyListeners(state: TimeOfDayState): void {
        this.listeners.forEach(callback => {
            try {
                callback(state);
            } catch (error) {
                console.error('TimeOfDayManager: Error in listener callback:', error);
            }
        });
    }

    /**
     * Blend two hex colors
     */
    private blendColors(color1: string, color2: string, ratio: number): string {
        // Simple color blending for dawn/dusk transitions
        // This is a basic implementation - could be enhanced with proper color space math
        
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substring(0, 2), 16);
        const g1 = parseInt(hex1.substring(2, 4), 16);
        const b1 = parseInt(hex1.substring(4, 6), 16);

        const r2 = parseInt(hex2.substring(0, 2), 16);
        const g2 = parseInt(hex2.substring(2, 4), 16);
        const b2 = parseInt(hex2.substring(4, 6), 16);
        
        const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
        const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
        const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
        
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');
        
        return `#${rHex}${gHex}${bHex}`;
    }
}
