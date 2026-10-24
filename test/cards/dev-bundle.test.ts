import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';

// No dev bundle import here: this file checks the card fetches it itself.

describe('developer panel bundle', () => {
    let card: HTMLElement & { setConfig(config: object): void };
    const devScripts = () => document.head.querySelectorAll('script[src*="animated-weather-card-dev"]');

    afterEach(() => {
        card?.remove();
        devScripts().forEach(s => s.remove());
        document.head.querySelectorAll('script[data-test-main]').forEach(s => s.remove());
        vi.useRealTimers();
    });

    async function mount(config: object): Promise<void> {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as typeof card;
        card.setConfig({ type: 'custom:animated-weather-card', ...config });
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(300);
    }

    it('is fetched from beside the main bundle, with its cache buster, only in dev mode', async () => {
        const main = document.createElement('script');
        main.dataset.testMain = '';
        main.src = 'https://ha.local/hacsfiles/ha-ani-weather-card/animated-weather-card.js?hacstag=123';
        document.head.appendChild(main);

        await mount({ dev_mode: true });
        const [script] = devScripts() as unknown as HTMLScriptElement[];
        expect(script.src).toBe('https://ha.local/hacsfiles/ha-ani-weather-card/animated-weather-card-dev.js?hacstag=123');
        // Until it arrives the card works, just without the panel
        expect(card.querySelector('.animated-weather-card')).not.toBeNull();
        expect(card.querySelector('.dev-toggle, .dev-controls')).toBeNull();
    });

    it('is never requested for a normal card', async () => {
        await mount({ entity: 'weather.home' });
        expect(devScripts()).toHaveLength(0);
    });
});
