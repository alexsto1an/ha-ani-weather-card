import { describe, it, expect, beforeEach, vi } from 'vitest';
import { WeatherAnimationController } from '../../src/animation-controller';
import { ModularIntegrationBridge } from '../../src/modular-integration-bridge';
import type { AnimatedWeatherCardConfig } from '../../src/types';

/**
 * The animations expect the same DOM scaffold the card renders. Build a
 * fresh copy per test so we never leak state across runs.
 */
function makeCardElement(): HTMLElement {
    const host = document.createElement('div');
    host.innerHTML = `
        <div class="animated-weather-card" style="--scale-factor: 1">
            <div class="animation-layer">
                <div class="sun"></div>
                <div class="lightning"></div>
            </div>
            <div class="animation-container rain-container"><div class="rain-layer"></div></div>
            <div class="animation-container snow-container"><div class="snow-layer"></div></div>
            <div class="animation-container sleet-container"><div class="sleet-layer"></div></div>
            <div class="animation-container wind-container"><div class="wind-layer"></div></div>
            <div class="animation-container lightning-container"><div class="lightning"></div></div>
            <div class="animation-container clouds-container"><div class="clouds-layer"></div></div>
            <div class="animation-container fog-container"></div>
            <div class="animation-container stars-container"></div>
            <div class="animation-container sun-container"></div>
        </div>
    `;
    document.body.appendChild(host);
    return host;
}

const cardConfig: AnimatedWeatherCardConfig = { entity: 'weather.home' };

describe('WeatherAnimationController — lifecycle', () => {
    let element: HTMLElement;
    let controller: WeatherAnimationController;

    beforeEach(() => {
        element = makeCardElement();
        controller = new WeatherAnimationController(element, cardConfig);
    });

    it('initialises every animation slot in an inactive state', () => {
        const states = controller.getAnimationStates();
        for (const key of ['rain', 'snow', 'sleet', 'wind', 'lightning', 'clouds', 'fog', 'stars', 'sun']) {
            expect(states[key as keyof typeof states].isActive).toBe(false);
            expect(states[key as keyof typeof states].isPaused).toBe(false);
        }
    });

    it('starts and stops a single animation', async () => {
        await controller.startAnimation('rain', { intensity: 1 });
        expect(controller.getAnimationStates().rain.isActive).toBe(true);

        await controller.stopAnimation('rain');
        expect(controller.getAnimationStates().rain.isActive).toBe(false);
        expect(controller.getAnimationStates().rain.isPaused).toBe(false);
    });

    it('skips a start request when the animation is already active', async () => {
        await controller.startAnimation('rain', { intensity: 1 });
        // No throw, no state corruption — second start is a no-op.
        await controller.startAnimation('rain', { intensity: 1 });
        expect(controller.getAnimationStates().rain.isActive).toBe(true);
    });

    it('keeps the shared animation layer visible when clouds, fog or stars stop', async () => {
        // Regression: stopping clouds set .animation-layer to opacity 0, and
        // that layer also holds the sun, lightning and planes, so a cloudy →
        // sunny change left the sun invisible until a reload.
        const layer = element.querySelector('.animation-layer') as HTMLElement;
        for (const condition of ['cloudy', 'foggy', 'clear-night', 'sunny']) {
            await controller.applyWeatherCondition(condition);
            expect(layer.style.opacity, `after ${condition}`).not.toBe('0');
        }
        await controller.stopAllAnimations();
        expect(layer.style.opacity).not.toBe('0');
    });

    it('draws clouds in their own layer, not the sun\'s', async () => {
        await controller.applyWeatherCondition('cloudy');
        expect(element.querySelectorAll('.clouds-layer .cloud-gsap').length).toBeGreaterThan(0);
        expect(element.querySelectorAll('.animation-layer .cloud-gsap').length).toBe(0);
    });

    it('applies the stormy mapping and starts rain + lightning', async () => {
        await controller.applyWeatherCondition('stormy');
        const states = controller.getAnimationStates();
        expect(states.rain.isActive).toBe(true);
        expect(states.lightning.isActive).toBe(true);
        // Stormy applies a rain-intensity override of 2.
        expect(states.rain.intensity).toBe(2);
    });

    it('stops everything via stopAllAnimations', async () => {
        await controller.applyWeatherCondition('rainy');
        expect(controller.getAnimationStates().rain.isActive).toBe(true);

        await controller.stopAllAnimations();
        for (const state of Object.values(controller.getAnimationStates())) {
            expect(state.isActive).toBe(false);
        }
    });

    it('switches animations cleanly when applyWeatherCondition is re-called', async () => {
        await controller.applyWeatherCondition('rainy');
        expect(controller.getAnimationStates().rain.isActive).toBe(true);

        // Switching weather: rain should turn off, snow should turn on.
        await controller.applyWeatherCondition('snowy');
        const states = controller.getAnimationStates();
        expect(states.rain.isActive).toBe(false);
        expect(states.snow.isActive).toBe(true);
    });

    it('ignores an unknown weather condition without throwing', async () => {
        await controller.applyWeatherCondition('nonsense');
        for (const state of Object.values(controller.getAnimationStates())) {
            expect(state.isActive).toBe(false);
        }
    });

    it('cancels an in-flight start when stopAnimation runs first', async () => {
        // Kick off a start but don't await it — bump the generation by
        // calling stopAnimation, then let the start resolve. The
        // controller should detect the generation drift and not leave
        // the animation marked active.
        const startPromise = controller.startAnimation('rain', { intensity: 1 });
        await controller.stopAnimation('rain');
        await startPromise;
        expect(controller.getAnimationStates().rain.isActive).toBe(false);
    });

    it('toggles the individual-<type>-active class on the card', async () => {
        await controller.startAnimation('rain', { intensity: 1 });
        const card = element.querySelector('.animated-weather-card');
        expect(card?.classList.contains('individual-rain-active')).toBe(true);

        await controller.stopAnimation('rain');
        expect(card?.classList.contains('individual-rain-active')).toBe(false);
    });

    it('exposes the default weather mappings', () => {
        const mappings = controller.getWeatherMappings();
        expect(mappings['sunny']?.animations).toEqual(['sun']);
        expect(mappings['stormy']?.animations).toEqual(['rain', 'lightning']);
        expect(mappings['sleety-stormy']?.animations).toEqual(['sleet', 'lightning']);
    });
});

describe('ModularIntegrationBridge — dual-start prevention', () => {
    let element: HTMLElement;
    let bridge: ModularIntegrationBridge;

    beforeEach(() => {
        element = makeCardElement();
        bridge = new ModularIntegrationBridge(element, cardConfig);
    });

    it('stops a previous animation of the same type before starting a new one', async () => {
        const first = await bridge.startModularAnimation('rain', 1);
        expect(first).toBeTruthy();
        expect(first!.isActive()).toBe(true);

        const second = await bridge.startModularAnimation('rain', 1);
        expect(second).toBeTruthy();
        // After the second start, only the second instance should be alive.
        expect(first).not.toBe(second);
        expect(second!.isActive()).toBe(true);
        // The first instance should have been destroyed.
        expect(first!.isActive()).toBe(false);
    });

    it('drops the map entry even if destroy throws', async () => {
        const animation = await bridge.startModularAnimation('rain', 1);
        expect(animation).toBeTruthy();
        // Sabotage the destroy method so it throws.
        (animation as unknown as { destroy: () => Promise<void> }).destroy = async () => {
            throw new Error('boom');
        };
        await bridge.stopModularAnimation('rain');
        // Starting again must succeed and yield a fresh instance.
        const next = await bridge.startModularAnimation('rain', 1);
        expect(next).toBeTruthy();
        expect(next).not.toBe(animation);
    });

    it('returns null for unknown animation types', async () => {
        const result = await bridge.startModularAnimation('unicorn', 1);
        expect(result).toBeNull();
    });
});

describe('ModularIntegrationBridge — live wind', () => {
    let element: HTMLElement;
    let bridge: ModularIntegrationBridge;
    const clouds = () => Array.from(element.querySelectorAll('.cloud-gsap'));

    beforeEach(() => {
        element = makeCardElement();
        bridge = new ModularIntegrationBridge(element, cardConfig, undefined, 12);
    });

    it('eases the clouds to a new wind speed where they are, without restarting', async () => {
        const animation = (await bridge.startModularAnimation('clouds', 1))!;
        const before = clouds();
        expect(before.length).toBeGreaterThan(0);
        const stop = vi.spyOn(animation, 'stop');
        const gsap = (window as unknown as { gsap: { to: ReturnType<typeof vi.fn> } }).gsap;
        gsap.to.mockClear();

        bridge.updateWindSpeed(30);

        expect(stop).not.toHaveBeenCalled();
        expect(animation.isActive()).toBe(true);
        // The same elements, not a fresh set drawn at new places
        const after = clouds();
        expect(after).toHaveLength(before.length);
        after.forEach((cloud, i) => expect(cloud).toBe(before[i]));
        // Every cloud timeline speeds up, eased rather than stepped
        const easing = gsap.to.mock.calls.filter(([, vars]) => vars && 'timeScale' in vars);
        expect(easing).toHaveLength(before.length);
        for (const [, vars] of easing) {
            expect(vars.timeScale).toBeGreaterThan(1);
            expect(vars.duration).toBeGreaterThan(0);
        }
    });

    it('does nothing when the wind speed is unchanged, or still missing', async () => {
        const animation = (await bridge.startModularAnimation('clouds', 1))!;
        const setWindSpeed = vi.spyOn(animation, 'setWindSpeed');

        bridge.updateWindSpeed(12);
        expect(setWindSpeed).not.toHaveBeenCalled();

        bridge.updateWindSpeed(NaN);
        bridge.updateWindSpeed(NaN);
        expect(setWindSpeed).toHaveBeenCalledTimes(1);
    });
});
