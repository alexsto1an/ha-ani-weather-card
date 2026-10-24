import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/animated-weather-card-dev';

/** Stand-in IntersectionObserver the test drives by hand. */
class FakeIntersectionObserver {
    static latest?: FakeIntersectionObserver;
    disconnected = false;
    constructor(private readonly callback: (entries: { isIntersecting: boolean }[]) => void) {
        FakeIntersectionObserver.latest = this;
    }
    observe(): void {}
    disconnect(): void { this.disconnected = true; }
    report(isIntersecting: boolean): void { this.callback([{ isIntersecting }]); }
}

type Card = HTMLElement & {
    setConfig(config: Record<string, unknown>): void;
};

function setHidden(hidden: boolean): void {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    document.dispatchEvent(new Event('visibilitychange'));
}

describe('auto-pause', () => {
    let card: Card;
    const paused = () => card.hasAttribute('data-paused');

    function mount(config: Record<string, unknown> = {}): void {
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', dev_mode: true, ...config });
        document.body.appendChild(card);
    }

    beforeEach(() => {
        vi.useFakeTimers();
        (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = FakeIntersectionObserver;
        setHidden(false);
    });

    afterEach(() => {
        card?.remove();
        setHidden(false);
        delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
        vi.useRealTimers();
    });

    it('pauses a card scrolled off-screen and resumes it when it comes back', () => {
        mount();
        expect(paused()).toBe(false);
        FakeIntersectionObserver.latest!.report(false);
        expect(paused()).toBe(true);
        FakeIntersectionObserver.latest!.report(true);
        expect(paused()).toBe(false);
    });

    it('pauses while the tab is hidden, without opting in', () => {
        mount();
        setHidden(true);
        expect(paused()).toBe(true);
        setHidden(false);
        expect(paused()).toBe(false);
    });

    it('stays paused until it is both visible and on-screen', () => {
        mount();
        setHidden(true);
        FakeIntersectionObserver.latest!.report(false);
        setHidden(false);
        expect(paused()).toBe(true);
        FakeIntersectionObserver.latest!.report(true);
        expect(paused()).toBe(false);
    });

    it('only pauses for a background window with auto_pause', () => {
        mount();
        window.dispatchEvent(new Event('blur'));
        expect(paused()).toBe(false);
        card.remove();

        mount({ auto_pause: true });
        window.dispatchEvent(new Event('blur'));
        expect(paused()).toBe(true);
        window.dispatchEvent(new Event('focus'));
        expect(paused()).toBe(false);
    });

    it('lets a manual pause win', () => {
        mount();
        // Pause from the developer panel
        (card.querySelector('#dev-toggle-btn') as HTMLButtonElement).click();
        (card.querySelector('#dev-pause-btn') as HTMLButtonElement).click();
        expect(paused()).toBe(true);
        FakeIntersectionObserver.latest!.report(true);
        setHidden(false);
        expect(paused()).toBe(true);
    });

    it('stops observing when the card leaves the page', () => {
        mount();
        const observer = FakeIntersectionObserver.latest!;
        card.remove();
        expect(observer.disconnected).toBe(true);
    });

    it('picks up a weather change that happened while it was paused', async () => {
        const hass = (state: string) => ({
            states: { 'weather.home': { entity_id: 'weather.home', state, attributes: { temperature: 20, humidity: 50 } } },
            config: { time_zone: 'UTC' },
            language: 'en',
            localize: () => '',
        });
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home' });
        (card as unknown as { hass: unknown }).hass = hass('cloudy');
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
        const sky = () => card.querySelector('.animated-weather-card') as HTMLElement;
        expect(sky().classList.contains('cloudy')).toBe(true);
        expect(card.querySelectorAll('.cloud-gsap').length).toBeGreaterThan(0);

        FakeIntersectionObserver.latest!.report(false);
        (card as unknown as { hass: unknown }).hass = hass('sunny');
        await vi.advanceTimersByTimeAsync(1000);
        expect(sky().classList.contains('sunny')).toBe(true);
        expect(sky().classList.contains('condition-out')).toBe(false);

        FakeIntersectionObserver.latest!.report(true);
        await vi.advanceTimersByTimeAsync(1000);
        expect(paused()).toBe(false);
        expect(sky().classList.contains('sunny')).toBe(true);
        expect(sky().classList.contains('condition-out')).toBe(false);
        // The cloudy sky's clouds are gone, not piled under the sun
        expect(card.querySelectorAll('.cloud-gsap').length).toBe(0);
    });

    it('starts its weather once a card that loaded in a background tab is shown', async () => {
        setHidden(true);
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', dev_mode: true });
        (card as unknown as { currentDevCondition: string }).currentDevCondition = 'rainy';
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(1000);
        expect(paused()).toBe(true);
        expect(card.querySelectorAll('.raindrop').length).toBe(0);

        setHidden(false);
        await vi.advanceTimersByTimeAsync(1000);
        expect(paused()).toBe(false);
        expect(card.querySelectorAll('.raindrop').length).toBeGreaterThan(0);
    });
});
