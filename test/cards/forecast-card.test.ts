import { describe, it, expect, vi, afterEach } from 'vitest';
import '../../src/animated-weather-card';
import type { CustomCardDefinition, HomeAssistant } from '../../src/types';

type ForecastCard = HTMLElement & {
    setConfig(config: Record<string, unknown>): void;
    hass: unknown;
    getGridOptions(): Record<string, number>;
    getCardSize(): number;
    openForecast(): void;
};
const Card = customElements.get('animated-forecast-card') as unknown as {
    getStubConfig(hass?: unknown, entities?: string[], fallback?: string[]): Record<string, unknown>;
    new (): ForecastCard;
};

const hass = (states: Record<string, string>) => ({
    states: Object.fromEntries(Object.entries(states).map(([id, state]) => [id, { entity_id: id, state, attributes: {} }])),
}) as unknown as HomeAssistant;

const entry = () => window.customCards.find(card => card.type === 'animated-forecast-card') as CustomCardDefinition;

describe('the forecast card', () => {
    afterEach(() => {
        document.body.innerHTML = '';
        delete window.AnimatedWeatherCardForecast;
    });

    it('is registered with the weather card, and shown live in the card picker', () => {
        expect(Card).toBeTruthy();
        expect(entry().preview).toBe(true);
        expect(entry().name).toBe('Animated Forecast');
    });

    it('starts on your weather, with the sun for its sky', () => {
        const home = hass({ 'weather.garden': 'cloudy', 'sun.sun': 'above_horizon' });
        expect(Card.getStubConfig(home, ['weather.garden'])).toEqual({ entity: 'weather.garden', sun_entity: 'sun.sun' });
        expect(Card.getStubConfig(hass({ 'weather.home': 'rainy' }))).toEqual({ entity: 'weather.home' });
    });

    it('is suggested for a weather entity, as a card and as a strip', () => {
        const suggestions = entry().getEntitySuggestion!(hass({ 'weather.home': 'sunny' }), 'weather.home')!;
        expect(suggestions.map(s => s.label)).toEqual(['Forecast', 'Forecast strip']);
        expect(suggestions[1].config).toMatchObject({ type: 'custom:animated-forecast-card', entity: 'weather.home', compact: true });
        expect(entry().getEntitySuggestion!(hass({ 'light.a': 'on' }), 'light.a')).toBeNull();
    });

    it('needs a weather entity', () => {
        expect(() => new Card().setConfig({})).toThrow(/weather entity/);
    });

    it('asks the sections grid for rows to suit what it shows', () => {
        const sized = (config: Record<string, unknown>) => {
            const card = new Card();
            card.setConfig({ entity: 'weather.home', ...config });
            return card.getGridOptions();
        };
        expect(sized({ compact: true }).rows).toBe(2);
        expect(sized({}).rows).toBeGreaterThanOrEqual(2);
        expect(sized({ forecast: 'both', review_card: 'b' }).rows).toBeGreaterThan(sized({ forecast: 'hourly', review_card: 'b' }).rows);
        // The bedside clock asks for room to lead
        expect(sized({ show_clock: true }).rows).toBeGreaterThan(sized({}).rows);
    });

    it('opens the forecast pop-up on a tap unless told otherwise', () => {
        const openPopup = vi.fn(() => () => {});
        window.AnimatedWeatherCardForecast = { version: 1, sectionCss: '', renderSection: () => '', renderHighLow: () => '', fit: () => {}, cardCss: '', renderCard: () => '<p>Forecast</p>', openPopup };
        const card = new Card();
        card.setConfig({ entity: 'weather.home' });
        document.body.append(card);
        card.hass = hass({ 'weather.home': 'sunny' });
        const target = card.shadowRoot!.querySelector('ha-card') as HTMLElement;
        expect(target.getAttribute('role')).toBe('button');
        target.dispatchEvent(new PointerEvent('pointerdown', { button: 0, clientX: 5, clientY: 5 }));
        target.dispatchEvent(new PointerEvent('pointerup', { button: 0, clientX: 5, clientY: 5 }));
        expect(openPopup).toHaveBeenCalledTimes(1);
        expect(openPopup.mock.calls[0][0]).toMatchObject({ entityId: 'weather.home' });

        // A tap action of its own goes to Home Assistant instead
        const moreInfo = vi.fn();
        card.addEventListener('hass-more-info', moreInfo);
        card.setConfig({ entity: 'weather.home', tap_action: { action: 'more-info' } });
        target.dispatchEvent(new PointerEvent('pointerdown', { button: 0 }));
        target.dispatchEvent(new PointerEvent('pointerup', { button: 0 }));
        expect(openPopup).toHaveBeenCalledTimes(1);
    });
});
