import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import '../../src/animated-weather-card';

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };

/** Stands in for the planes bundle's animation: records what the card asks of it. */
class FakePlanes {
    static made: FakePlanes[] = [];
    flights: { ids: string[]; options: { night: boolean; showLabels: boolean } }[] = [];
    constructor(readonly host: HTMLElement) {
        FakePlanes.made.push(this);
    }
    async start() {}
    async pause() {}
    async resume() {}
    async destroy() {}
    flyOver(flights: { id: string }[], options: { night: boolean; showLabels: boolean }) {
        this.flights.push({ ids: flights.map(f => f.id), options });
    }
}

const flight = (id: string) => ({ id, flight_number: id, aircraft_code: 'A20N', altitude: 12000, ground_speed: 300, heading: 90, on_ground: 0 });

function hass(flights: object[], sun: 'above_horizon' | 'below_horizon') {
    return {
        states: {
            'weather.home': {
                entity_id: 'weather.home', state: 'sunny',
                attributes: { temperature: 21, humidity: 55, friendly_name: 'Home', temperature_unit: '°C' },
            },
            'sun.sun': { entity_id: 'sun.sun', state: sun, attributes: { elevation: sun === 'above_horizon' ? 30 : -20, rising: false } },
            'sensor.flights': { entity_id: 'sensor.flights', state: String(flights.length), attributes: { flights } },
        },
        config: { time_zone: 'UTC' },
        language: 'en',
        localize: () => '',
    };
}

describe('the planes bundle', () => {
    let card: Card;

    async function mount(config: object, { planes = true, sun = 'below_horizon' as const } = {}) {
        vi.useFakeTimers();
        FakePlanes.made = [];
        if (planes) (window as unknown as { AnimatedWeatherCardPlanes?: unknown }).AnimatedWeatherCardPlanes = FakePlanes;
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', flights_entity: 'sensor.flights', ...config });
        card.hass = hass([flight('first')], sun);
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        // A new arrival, after the first update seeded what was already overhead
        card.hass = hass([flight('first'), flight('new')], sun);
        await vi.advanceTimersByTimeAsync(50);
    }

    afterEach(() => {
        card?.remove();
        delete (window as unknown as { AnimatedWeatherCardPlanes?: unknown }).AnimatedWeatherCardPlanes;
        document.querySelectorAll('script[src*="animated-weather-card-planes"]').forEach(s => s.remove());
        vi.useRealTimers();
    });

    it('keeps the planes and their aircraft out of the main bundle', () => {
        const source = readFileSync(join(process.cwd(), 'src/animated-weather-card.ts'), 'utf8');
        expect(source).toMatch(/import type \{[^}]*PlanesAnimation[^}]*\} from '\.\/planes-animation'/);
        expect(source).not.toMatch(/import \{[^}]*\} from '\.\/(planes-animation|aircraft)'/);
        const main = readFileSync(join(process.cwd(), 'animated-weather-card.js'), 'utf8');
        const planes = readFileSync(join(process.cwd(), 'animated-weather-card-planes.js'), 'utf8');
        // The type codes the planes bundle reads
        expect(planes).toContain('CRJ');
        expect(main).not.toContain('CRJ');
    });

    it('fetches the planes bundle when a card has a flights sensor', async () => {
        await mount({}, { planes: false });
        expect(document.querySelector('script[src*="animated-weather-card-planes.js"]')).not.toBeNull();
        expect(FakePlanes.made).toHaveLength(0);
    });

    it('doesn\'t fetch it for a card without one', async () => {
        await mount({ flights_entity: undefined }, { planes: false });
        expect(document.querySelector('script[src*="animated-weather-card-planes.js"]')).toBeNull();
    });

    it('flies new arrivals with their lights under a night sky', async () => {
        await mount({});
        const [planes] = FakePlanes.made;
        expect(planes.host).toBe(card);
        expect(planes.flights).toEqual([{ ids: ['new'], options: { night: true, showLabels: true } }]);
    });

    it('keeps a plane a silhouette on a theme\'s background, night or not', async () => {
        await mount({ color_palette: 'theme' });
        expect(FakePlanes.made[0].flights[0].options.night).toBe(false);
    });

    it('flies by day without lights', async () => {
        await mount({}, { sun: 'above_horizon' as never });
        expect(FakePlanes.made[0].flights[0].options.night).toBe(false);
    });
});
