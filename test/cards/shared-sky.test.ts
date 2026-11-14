import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card';
import { skyColors } from '../../src/sky';
import { weatherOnSun } from '../../src/weather-share';

// The weather card tells the page which weather it shows on which sun, and a
// sun tracker with no weather_entity of its own takes that sky at rest, as it
// does while the card is dragged through the hours
type Card = HTMLElement & { setConfig(config: object): void; hass: unknown; surface?: string };
const hass = {
    states: {
        'weather.home': { entity_id: 'weather.home', state: 'rainy', attributes: { temperature: 6, friendly_name: 'Home' } },
        'sun.sun': {
            entity_id: 'sun.sun', state: 'above_horizon',
            attributes: {
                elevation: 30, rising: false,
                next_rising: '2026-10-14T05:41:00Z', next_setting: '2026-10-13T17:12:00Z',
                next_dawn: '2026-10-14T05:12:00Z', next_dusk: '2026-10-13T17:41:00Z', next_noon: '2026-10-14T11:27:00Z',
            },
        },
    },
    config: { time_zone: 'UTC' },
    localize: () => '',
    language: 'en',
};
const mounted: HTMLElement[] = [];
function mount(type: string, config: object): Card {
    const el = document.createElement(type) as Card;
    el.setConfig(config);
    document.body.append(el);
    el.hass = hass;
    mounted.push(el);
    return el;
}
afterEach(() => { for (const el of mounted.splice(0)) el.remove(); });
const top = (tracker: Card) => (tracker.shadowRoot!.querySelector('.st-card') as HTMLElement).style.getPropertyValue('--awc-sky-top');

describe('the sky a sun tracker shares with the weather card on its sun', () => {
    it('takes the weather card\'s sky without a weather_entity, whichever comes first, and lets it go when the card leaves', () => {
        const tracker = mount('animated-sun-tracker-card', { sun_entity: 'sun.sun' });
        expect(top(tracker)).toBe(skyColors('sunny', 'day').top);
        const card = mount('animated-weather-card', { entity: 'weather.home' });
        expect(weatherOnSun('sun.sun')).toBe('weather.home');
        expect(top(tracker)).toBe(skyColors('rainy', 'day').top);
        card.remove();
        expect(weatherOnSun('sun.sun')).toBeUndefined();
        expect(top(tracker)).toBe(skyColors('sunny', 'day').top);
    });

    it('counts the forecast card, on the sun it names; not dev mode\'s sample weather', () => {
        mount('animated-forecast-card', { entity: 'weather.home', sun_entity: 'sun.home' });
        expect(weatherOnSun('sun.home')).toBe('weather.home');
        expect(weatherOnSun('sun.sun')).toBeUndefined();
        const dev = mount('animated-weather-card', { dev_mode: true, entity: 'weather.home', sun_entity: 'sun.dev' });
        expect(weatherOnSun('sun.dev')).toBeUndefined();
        // A new weather or sun follows the card's config
        dev.setConfig({ entity: 'weather.home', sun_entity: 'sun.dev' });
        expect(weatherOnSun('sun.dev')).toBe('weather.home');
    });
});
