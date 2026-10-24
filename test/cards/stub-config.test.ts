import { describe, it, expect } from 'vitest';
import '../../src/animated-weather-card';

describe('a new card from the card picker', () => {
    it('starts without options the card no longer has', () => {
        const Card = customElements.get('animated-weather-card') as unknown as { getStubConfig(): Record<string, unknown> };
        const stub = Card.getStubConfig();
        expect(stub.entity).toBeTruthy();
        for (const removed of ['show_current', 'show_forecast', 'use_custom_colors']) {
            expect(stub).not.toHaveProperty(removed);
        }
    });
});
