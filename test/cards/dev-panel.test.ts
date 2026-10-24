import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
// The dev panel is its own bundle; loading it here stands in for the
// <script> the card injects in a browser.
import '../../src/animated-weather-card-dev';

describe('dev panel docking', () => {
    let card: HTMLElement & { setConfig(config: object): void };

    afterEach(() => {
        card?.remove();
        vi.useRealTimers();
    });

    /** Mount a dev-mode card at the given horizontal position and open its panel. */
    async function openPanelAt(left: number, right: number, viewport = 1200): Promise<string | undefined> {
        vi.useFakeTimers();
        Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: viewport });
        card = document.createElement('animated-weather-card') as typeof card;
        card.getBoundingClientRect = () => ({ left, right, width: right - left, top: 0, bottom: 220, height: 220, x: left, y: 0, toJSON: () => ({}) });
        card.setConfig({ type: 'custom:animated-weather-card', dev_mode: true });
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        (card.querySelector('#dev-toggle-btn') as HTMLButtonElement).click();
        return (card.querySelector('.dev-controls') as HTMLElement | null)?.dataset.dock;
    }

    it('docks to the right of the card when there is room', async () => {
        expect(await openPanelAt(24, 384)).toBe('right');
    });

    it('docks to the left when the card sits at the right edge', async () => {
        expect(await openPanelAt(800, 1180)).toBe('left');
    });

    it('docks below a full-width card', async () => {
        expect(await openPanelAt(16, 1184)).toBe('below');
    });
});
