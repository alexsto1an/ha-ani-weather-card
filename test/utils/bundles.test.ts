import { describe, it, expect, afterEach, vi } from 'vitest';

// Where each installer serves the card's folder, and its cache buster
const INSTALLS = [
    ['the Marketplace', 'https://ha.local/local/community/ha-ani-weather-card/animated-weather-card.js?v=4f1c2a-1.2.0'],
    ['HACS', 'https://ha.local/hacsfiles/ha-ani-weather-card/animated-weather-card.js?hacstag=123'],
    ['a manual install', 'https://ha.local/local/animated-weather-card.js?v=1'],
];

describe('loading the other bundles', () => {
    afterEach(() => {
        document.head.querySelectorAll('script[data-test-main], script[src*="animated-weather-card-note"]').forEach(s => s.remove());
    });

    it.each(INSTALLS)('finds them beside the main bundle, with its cache buster, from %s', async (_installer, mainSrc) => {
        // A fresh module, so no earlier load is remembered
        vi.resetModules();
        const { loadSiblingBundle } = await import('../../src/bundles');
        const main = document.createElement('script');
        main.dataset.testMain = '';
        main.src = mainSrc;
        document.head.appendChild(main);

        void loadSiblingBundle('animated-weather-card-note', () => true);
        const script = document.head.querySelector<HTMLScriptElement>('script[src*="animated-weather-card-note"]')!;
        expect(script.src).toBe(mainSrc.replace('animated-weather-card.js', 'animated-weather-card-note.js'));
    });
});
