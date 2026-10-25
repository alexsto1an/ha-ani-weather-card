import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/animated-weather-card';
import '../../src/animated-weather-card-editor';
import '../../src/sun-tracker-card';
import { isValidColor } from '../../src/utils';
import { DEFAULT_ENGINE_SETTINGS } from '../../src/constants';
import { generateCustomColorStyles } from '../../src/color-utils';
import { createGSAPFogLayer } from '../../src/gsap-effects';
import { conditionName } from '../../src/weather-data';

// Values that would break out of an HTML attribute, or out of a CSS
// declaration, if they reached the markup as they are
const BREAKOUT = '" onmouseover="alert(1)';
const TAGS = '"><img src=x onerror="alert(1)">';

/** Every attribute in a subtree whose name starts with "on": none should, here. */
function handlers(root: ParentNode): string[] {
    return [...root.querySelectorAll('*')].flatMap(el => [...el.attributes].map(a => a.name).filter(name => name.startsWith('on')));
}

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown };

afterEach(() => {
    document.body.replaceChildren();
    vi.useRealTimers();
});

describe('the sun tracker\'s moon', () => {
    const hass = (moonState: string) => ({
        states: {
            'sun.sun': {
                entity_id: 'sun.sun', state: 'above_horizon',
                attributes: {
                    elevation: 30, rising: false,
                    next_rising: '2026-10-14T05:41:00Z', next_setting: '2026-10-13T17:12:00Z',
                    next_dawn: '2026-10-14T05:12:00Z', next_dusk: '2026-10-13T17:41:00Z', next_noon: '2026-10-14T11:27:00Z',
                },
            },
            'sensor.moon': { entity_id: 'sensor.moon', state: moonState, attributes: {} },
        },
        localize: () => '',
        language: 'en',
    });

    it('builds an icon only from a phase Home Assistant names, and escapes what it writes', () => {
        const tracker = document.createElement('animated-sun-tracker-card') as Card;
        tracker.setConfig({ sun_entity: 'sun.sun', moon_entity: 'sensor.moon' });
        document.body.appendChild(tracker);
        const root = tracker.shadowRoot!;
        const icon = () => root.querySelector('.st-metric[data-kind="moon"] ha-icon')!.getAttribute('icon');

        tracker.hass = hass('waning_gibbous');
        expect(icon()).toBe('mdi:moon-waning-gibbous');

        // Any sensor can be the moon entity: its state never becomes an icon name
        tracker.hass = hass(BREAKOUT);
        expect(icon()).toBe('mdi:weather-night');
        tracker.hass = hass(TAGS);
        expect(handlers(root)).toEqual([]);
        expect(root.querySelector('img')).toBeNull();
        // The phase is still shown, as text
        expect(root.querySelector('.st-metric[data-kind="moon"] .st-metric-value')!.textContent).toMatch(/<img src=x/i);

        // A state named like something every object inherits isn't a phase either
        tracker.hass = hass('constructor');
        expect(icon()).toBe('mdi:weather-night');
        expect(root.querySelector('.st-metric[data-kind="moon"] .st-metric-value')!.textContent).toBe('Constructor');
    });
});

describe('condition names', () => {
    it('come only from the table\'s own entries', () => {
        const entity = (state: string) => ({ entity_id: 'weather.home', state, attributes: {} }) as never;
        expect(conditionName({} as never, entity('constructor'))).toBe('constructor');
        expect(conditionName({} as never, entity('toString'))).toBe('toString');
    });
});

describe('the visual editor', () => {
    it('writes every config value as text, never as markup', async () => {
        const editor = document.createElement('animated-weather-card-editor') as Card;
        editor.setConfig({
            type: 'custom:animated-weather-card',
            entity: `weather.home${BREAKOUT}`,
            name: TAGS,
            sun_entity: TAGS,
            note_entity: `sensor.note${BREAKOUT}`,
            note_calendar: TAGS,
            engine_settings: { windSpeed: TAGS, rainCount: BREAKOUT },
            custom_colors: { sunny_bg: TAGS, text_color: BREAKOUT },
        });
        document.body.appendChild(editor);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(handlers(editor)).toEqual([]);
        expect(editor.querySelector('img')).toBeNull();
        // The values arrive whole, as the attribute's value
        expect(editor.querySelector('#entity')!.getAttribute('value')).toBe(`weather.home${BREAKOUT}`);
        expect(editor.querySelector('#sunny_bg')!.getAttribute('value')).toBe(TAGS);
        // An engine setting that isn't a number shows the default the card falls back to
        expect(editor.querySelector('#windSpeed')!.getAttribute('value')).toBe(String(DEFAULT_ENGINE_SETTINGS.windSpeed));
    });
});

describe('colors', () => {
    it('accept hex, names and rgb() or rgba() made of numbers', () => {
        for (const color of ['#fff', '#1b64a5', 'teal', 'rgb(27, 100, 165)', 'rgba(27,100,165,0.5)', 'rgb(10% 40% 65%)', 'rgb(27 100 165 / 50%)']) {
            expect(isValidColor(color), color).toBe(true);
        }
    });

    it('reject anything that could end the declaration or the attribute', () => {
        for (const color of [
            'rgb(1,2,3);background:url(https://example.com)',
            'rgb(1,2,3)" onmouseover="alert(1)',
            'rgb("1",2,3)',
            "rgb('1',2,3)",
            'rgb(1,2,3) !important; color: red',
            'rgb(var(--x))',
            'rgb(1,2,3)>',
        ]) {
            expect(isValidColor(color), color).toBe(false);
        }
    });

    it('fill every variable a color sets', () => {
        const styles = generateCustomColorStyles({ type: 'custom:animated-weather-card', entity: 'weather.home', custom_colors: { sun_color: '#ff8800' } });
        expect(styles).toContain('--weather-sun-primary: #ff8800');
        expect(styles).toContain('--weather-sun-secondary: #ff8800');
        expect(styles).not.toContain('${value}');
    });

    it('keep a hostile fog color out of the fog\'s style', () => {
        const fog = document.createElement('div');
        const card = document.createElement('div');
        const config = { color_palette: 'default', custom_colors: { fog_color: 'red); position: fixed; inset: 0; background-image: url(https://example.invalid/p.png); --x: (' } };
        createGSAPFogLayer(fog, { windSpeed: 1 }, 0, card, config);
        const segments = [...fog.querySelectorAll<HTMLElement>('.fog-layer > div')];
        expect(segments.length).toBeGreaterThan(0);
        for (const segment of segments) {
            expect(segment.style.cssText).not.toContain('example.invalid');
            expect(segment.style.position).toBe('absolute');
        }
        // A real colour still paints the fog
        const painted = document.createElement('div');
        createGSAPFogLayer(painted, { windSpeed: 1 }, 0, card, { color_palette: 'default', custom_colors: { fog_color: 'rgb(200, 210, 220)' } });
        expect(painted.querySelector<HTMLElement>('.fog-layer > div')!.style.background).toContain('rgb(200, 210, 220)');
    });

    it('keep a hostile color out of the card\'s markup', async () => {
        vi.useFakeTimers();
        const card = document.createElement('animated-weather-card') as Card;
        card.setConfig({
            type: 'custom:animated-weather-card', entity: 'weather.home',
            custom_colors: { text_color: `rgb(1,2,3)${BREAKOUT}`, sun_color: 'rgb(1,2,3);background:url(x)', rain_color: 'rgb(200, 220, 255)' },
        });
        card.hass = {
            states: { 'weather.home': { entity_id: 'weather.home', state: 'sunny', attributes: { temperature: 20, friendly_name: TAGS } } },
            config: { time_zone: 'UTC' }, language: 'en', localize: () => '',
        };
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(300);

        expect(handlers(card)).toEqual([]);
        expect(card.querySelector('img')).toBeNull();
        const style = card.querySelector('.animated-weather-card')!.getAttribute('style')!;
        expect(style).toContain('--weather-rain-color: rgb(200, 220, 255)');
        expect(style).not.toContain('onmouseover');
        expect(style).not.toContain('url(');
    });
});
