// The light law for everything the forecast and the clock add: every text
// where it sits, in all 60 skies (15 conditions × 4 phases), sampled the way
// the card paints its sky and its light. Body text needs 4.5:1, large text
// (the wall's figures, the nightstand's time) 3:1, the icons 3.2:1.
import { describe, it, expect, vi } from 'vitest';
import {
    SKY_CONDITIONS, SKY_PHASES, SKY_TEXT, SKY_GLOW, SKY_GLOW_WIDE, GlowGeometry,
    sampleSky, sampleSkyAt, oklchToSrgb, composite, contrastRatio, relativeLuminance, skyColors, type SkyPhase,
} from '../../src/sky';
import { litTints, GLYPH_CONTRAST } from '../../src/fc-glyphs';
import { EMBER, NIGHT_RED } from '../../src/fc-night';
import { FORECAST_GLOW } from '../../src/fc-fcard';
import { createGSAPCloud } from '../../src/gsap-effects';
import { cloudFloor } from '../../src/cloud-band';
import { FORECAST_CSS } from '../../src/fc-css';

const text = oklchToSrgb(SKY_TEXT);
const range = (from: number, to: number, step: number) => Array.from({ length: Math.round((to - from) / step) + 1 }, (_, i) => +(from + i * step).toFixed(3));
const grid = (xs: number[], ys: number[]) => xs.flatMap(x => ys.map(y => [x, y] as const));
const parse = (c: string): { rgb: [number, number, number]; a: number } => {
    if (c.startsWith('#')) return { rgb: [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16) / 255) as [number, number, number], a: 1 };
    const [r, g, b, a = 1] = (c.match(/[\d.]+/g) ?? []).map(Number);
    return { rgb: [r / 255, g / 255, b / 255], a };
};
/** The forecast card's sky: its own corner light and the wider skirt under it */
function forecastSky(condition: typeof SKY_CONDITIONS[number], phase: SkyPhase, x: number, y: number): [number, number, number] {
    const base = sampleSky(condition, phase, y);
    const { rgb, a } = parse(skyColors(condition, phase).glow);
    const light = (g: GlowGeometry) => { const d = Math.hypot((x - g.cx) / g.rx, (y - g.cy) / g.ry); return d < g.fade ? a * (1 - d / g.fade) : 0; };
    return composite(composite(base, rgb, light({ rx: 0.52, ry: 0.56, cx: 0.94, cy: -0.12, fade: 0.78 })), rgb, light(FORECAST_GLOW));
}
const VIEW_GLOW: GlowGeometry = { rx: 0.48, ry: 0.22, cx: 0.80, cy: 0.05, fade: 0.64 };

type Sampler = (c: typeof SKY_CONDITIONS[number], p: SkyPhase, x: number, y: number) => [number, number, number];
const at = (glow: GlowGeometry): Sampler => (c, p, x, y) => sampleSkyAt(c, p, x, y, glow);
function check(name: string, points: ReadonlyArray<readonly [number, number]>, sky: Sampler, alpha = 1, min = 4.5) {
    let worst = Infinity, where = '';
    for (const condition of SKY_CONDITIONS) for (const phase of SKY_PHASES) for (const [x, y] of points) {
        const bg = sky(condition, phase, x, y);
        const ratio = contrastRatio(composite(bg, text, alpha), bg);
        if (ratio < worst) { worst = ratio; where = `${condition}/${phase} at x=${x}, y=${y}`; }
    }
    expect(worst, `${name}: worst ${worst.toFixed(2)} (${where})`).toBeGreaterThanOrEqual(min);
}

describe('the forecast on the weather card', () => {
    it('the hourly row, full strength across the width from 0.43 of a narrow card down (the fit holds its top there)', () => {
        check('row, narrow', grid(range(0.02, 0.98, 0.04), range(0.43, 0.95, 0.04)), at(SKY_GLOW));
    });
    it('the chips and anything at the quiet tint, from 0.57 down', () => {
        check('chips', grid(range(0.02, 0.98, 0.04), range(0.57, 0.95, 0.04)), at(SKY_GLOW), 0.8);
    });
    it('the clock\'s place and the away line\'s "in 3 hr.", tinted, on the location line, which stops at 0.57', () => {
        check('location line', grid(range(0.04, 0.57, 0.03), range(0.03, 0.15, 0.02)), at(SKY_GLOW), 0.8);
    });
    it('today\'s high and low, the hour\'s chance and the turning line, full strength, left of the condition line\'s stop', () => {
        // The condition's line and the line under it stop at 74cqi less the padding: 0.68 of a phone's card
        check('condition line', grid(range(0.04, 0.68, 0.04), range(0.2, 0.5, 0.03)), at(SKY_GLOW));
    });
    it('the wide card\'s row and lines in the hero\'s column, full strength', () => {
        check('wide hero column', grid(range(0.02, 0.6, 0.04), range(0.4, 0.95, 0.05)), at(SKY_GLOW_WIDE));
    });
});

describe('the forecast card', () => {
    it('its lead, the hourly row, the day names and highs, full strength', () => {
        check('lead', grid(range(0.04, 0.75, 0.03), range(0.03, 0.11, 0.02)), forecastSky);
        // The row on a 353 × 440 card: labels from 0.13 of the height, values from 0.24; its last whole column's centre is at 0.87
        check('row', grid(range(0.02, 0.89, 0.03), range(0.13, 0.36, 0.02)), forecastSky);
        check('days', grid(range(0.02, 0.98, 0.04), range(0.45, 0.97, 0.04)), forecastSky);
    });
    it('its chips and lows, tinted', () => {
        check('chips and lows', grid(range(0.02, 0.98, 0.04), range(0.35, 0.97, 0.05)), forecastSky, 0.8);
    });
    it('the strip: full strength anywhere (its light is upstairs and only spills over its top edge)', () => {
        const strip: Sampler = (c, p, _x, y) => {
            const k = skyColors(c, p);
            const base = composite(parse(k.mid).rgb, parse(k.bottom).rgb, y);
            const scrim = parse(k.scrim);
            return composite(base, scrim.rgb, scrim.a * Math.max(0, (y - 0.4) / 0.6));
        };
        check('strip', grid([0.5], range(0, 1, 0.1)), strip);
    });
});

describe('the view that opens on tap', () => {
    it('its hero full strength left of 0.65, and its tinted place left of 0.45, under its own light', () => {
        check('hero', grid(range(0.05, 0.65, 0.05), range(0.04, 0.3, 0.03)), at(VIEW_GLOW));
        check('place', grid(range(0.05, 0.45, 0.05), range(0.03, 0.12, 0.03)), at(VIEW_GLOW), 0.8);
    });
    it('its row full strength, and its chips, lows and readings tinted, from 0.3 down', () => {
        check('row', grid(range(0.02, 0.98, 0.04), range(0.3, 0.97, 0.05)), at(VIEW_GLOW));
        check('quiet', grid(range(0.02, 0.98, 0.04), range(0.4, 0.97, 0.05)), at(VIEW_GLOW), 0.8);
    });
});

describe('the wall', () => {
    it('its body text: the date and today\'s line full strength, the hour labels and lows tinted', () => {
        check('date', grid(range(0.55, 0.72, 0.03), range(0.2, 0.3, 0.03)), at(SKY_GLOW_WIDE));
        check('today', grid(range(0.04, 0.6, 0.04), range(0.3, 0.38, 0.02)), at(SKY_GLOW_WIDE));
        check('labels and lows', grid(range(0.03, 0.97, 0.04), range(0.72, 0.97, 0.05)), at(SKY_GLOW_WIDE), 0.8);
    });
    it('its large text: the clock tinted, the turning line and the hours\' figures full strength (3:1)', () => {
        check('clock', grid(range(0.41, 0.56, 0.03), range(0.2, 0.3, 0.03)), at(SKY_GLOW_WIDE), 0.8, 3);
        check('turning line and figures', grid(range(0.03, 0.75, 0.04), range(0.6, 0.92, 0.04)), at(SKY_GLOW_WIDE), 1, 3);
    });
});

describe('the needle\'s capsule', () => {
    it('names its hour in the sky\'s top colour on white, 7:1 in every sky, and in the chips\' colours on a theme', () => {
        let worst = Infinity, where = '';
        for (const condition of SKY_CONDITIONS) for (const phase of SKY_PHASES) {
            const top = parse(skyColors(condition, phase).top).rgb;
            const ratio = contrastRatio(top, [1, 1, 1]);
            if (ratio < worst) { worst = ratio; where = `${condition}/${phase}`; }
        }
        expect(worst, `worst at ${where}`).toBeGreaterThanOrEqual(7);
        expect(FORECAST_CSS).toMatch(/\.fc-cap-t \{[^}]*color: var\(--awc-sky-top, #16283f\);/);
        expect(FORECAST_CSS).toMatch(/\.theme-colors \.fc-cap::before \{ background: var\(--primary-text-color\); \}/);
        expect(FORECAST_CSS).toMatch(/\.theme-colors \.fc-cap-t \{ color: var\(--ha-card-background, var\(--card-background-color, #fff\)\); \}/);
    });
});

describe('the icons, lit by their own hour', () => {
    /** What the row's floor does: the brightest sky the icon is seen over, sampled where the row sits */
    const lum = (c: typeof SKY_CONDITIONS[number], p: SkyPhase) => Math.max(...grid([0.12, 0.5, 0.88], [0.43, 0.6, 0.75]).map(([x, y]) => relativeLuminance(sampleSkyAt(c, p, x, y, SKY_GLOW))));
    const LIGHT: Record<SkyPhase, [number, boolean]> = { day: [40, false], dawn: [-2, true], dusk: [-2, false], night: [-30, false] };
    it(`every mark holds ${GLYPH_CONTRAST}:1 against its own hour's sky, in every light`, () => {
        let worst = Infinity, where = '';
        for (const condition of SKY_CONDITIONS) for (const phase of SKY_PHASES) for (const [light, [e, rising]] of Object.entries(LIGHT)) {
            const L = lum(condition, phase);
            const tints = litTints(e, rising, L);
            for (const [tone, colour] of Object.entries(tints)) {
                const ratio = (Math.max(relativeLuminance(parse(colour).rgb), L) + 0.05) / (Math.min(relativeLuminance(parse(colour).rgb), L) + 0.05);
                if (ratio < worst) { worst = ratio; where = `${tone} lit by ${light} over ${condition}/${phase}`; }
            }
        }
        expect(worst, `worst ${worst.toFixed(2)}: ${where}`).toBeGreaterThanOrEqual(GLYPH_CONTRAST - 0.01);
    });
    it('the light changes the colour, not the shape: night is bluer and dimmer than day white', () => {
        const day = litTints(40, false, 0), night = litTints(-30, false, 0);
        expect(relativeLuminance(parse(night.cloud).rgb)).toBeLessThan(relativeLuminance(parse(day.cloud).rgb));
        expect(parse(night.cloud).rgb[2]).toBeGreaterThan(parse(night.cloud).rgb[0]);
        expect(litTints(-2, false, 0).cloud).not.toBe(day.cloud);
    });
});

describe('the nightstand at night', () => {
    // The veil darkens the sky under the words; the ember is the only light (styles: fc-css.ts NIGHT_CSS)
    const VEIL: Record<SkyPhase, [number, number]> = { night: [0.55, 0.62], dawn: [0.55, 0.8], dusk: [0.55, 0.8], day: [0.65, 0.85] };
    // The time stands bottom left (from 0.35 of the height); its words share the bottom line, the alarm left, the weather right
    const zones = [...grid(range(0.05, 0.6, 0.05), range(0.35, 0.85, 0.05)).map(p => ['time', ...p] as const), ...grid(range(0.05, 0.95, 0.05), [0.82, 0.88, 0.94]).map(p => ['words', ...p] as const)];
    it('the time holds 3:1 and its words 4.5:1 over the veiled sky, in every condition, wherever night falls', () => {
        for (const condition of SKY_CONDITIONS) for (const phase of SKY_PHASES) for (const [what, x, y] of zones) {
            // The veil is thinnest at the moon's corner (86%, 12%) and full strength away from it
            const d = Math.min(1, Math.hypot((x - 0.86) / 0.3, (y - 0.12) / 0.5));
            const [a0, a1] = VEIL[phase];
            const bg = composite(sampleSkyAt(condition, phase, x, y, SKY_GLOW), [3 / 255, 4 / 255, 9 / 255], a0 + (a1 - a0) * d);
            if (what === 'time') expect(contrastRatio(parse(EMBER.time).rgb, bg), `time ${condition}/${phase} ${x},${y}`).toBeGreaterThanOrEqual(3);
            else expect(contrastRatio(parse(EMBER.words).rgb, bg), `words ${condition}/${phase} ${x},${y}`).toBeGreaterThanOrEqual(4.5);
        }
    });

    it('red at night (night_red) holds the same on black, a deep red no brighter than the ember', () => {
        const black: [number, number, number] = [0, 0, 0];
        expect(contrastRatio(parse(NIGHT_RED.time).rgb, black)).toBeGreaterThanOrEqual(3.5);
        expect(contrastRatio(parse(NIGHT_RED.words).rgb, black)).toBeGreaterThanOrEqual(4.5);
        for (const k of ['time', 'words'] as const) {
            const [r, g, b] = parse(NIGHT_RED[k]).rgb;
            // Red's light, not white's: green and blue a small share of it
            expect(g / r).toBeLessThan(0.2);
            expect(b / r).toBeLessThan(0.2);
            expect(relativeLuminance(parse(NIGHT_RED[k]).rgb)).toBeLessThan(relativeLuminance(parse(EMBER[k]).rgb));
        }
        // Black whatever the sky or the theme, and every word in the red
        expect(FORECAST_CSS).toMatch(/\.qn-veil\[data-red\] \{ background: #000 !important; \}/);
        expect(FORECAST_CSS).toMatch(/\.qn\[data-red\]\[data-night\] :is\(\.qn-quiet, \.awc-ampm\) \{ color: inherit !important; \}/);
    });
});

describe('no cloud and no star behind the row; the rest of the sky is theirs', () => {
    it('with the forecast on, clouds and stars are masked only below the floor, never sideways', () => {
        // On the container, which reaches above the card when weather spills: a mask on the layer would clip clouds to
        // the card's box. It keeps the spill's fade over the top half of the overhang.
        expect(FORECAST_CSS).toMatch(/\[data-cloud-band\] \.animation-container\.clouds-container \{[^}]*--awc-cloud-overhang[^}]*--fc-floor-c[^}]*mask-image: linear-gradient\(180deg, transparent 0, #000 calc\(var\(--awc-cloud-overhang, 0px\) \/ 2\)/);
        expect(FORECAST_CSS).not.toMatch(/clouds-layer[^{]*\{[^}]*mask-image/);
        expect(FORECAST_CSS).toMatch(/\[data-cloud-band\] \.stars-field \{[^}]*mask-image: linear-gradient\(180deg[^}]*var\(--fc-floor-s/);
        // They cross the whole width, behind the clock, the place and the temperature, as on today's card
        expect(FORECAST_CSS).not.toMatch(/(clouds-layer|stars-field)[^{]*\{[^}]*90deg/);
        expect(FORECAST_CSS).not.toMatch(/--fc-floor-xl/);
        expect(FORECAST_CSS).toMatch(/\[data-fc-card\][^{]*:is\(\.sun-track, \.clouds-container, \.stars-field/);
        expect(FORECAST_CSS).toMatch(/\[data-qn\] \.clouds-container \{[^}]*mask-image/);
    });

    type Gsap = { set: ReturnType<typeof vi.fn> };
    const gsap = () => (window as unknown as { AnimatedWeatherCardGsap: Gsap }).AnimatedWeatherCardGsap;
    function sky(band?: number) {
        const card = document.createElement('div');
        card.className = 'animated-weather-card';
        if (band !== undefined) card.dataset.cloudBand = String(band);
        Object.defineProperty(card, 'offsetWidth', { value: 353 });
        Object.defineProperty(card, 'offsetHeight', { value: 502 });
        const layer = document.createElement('div');
        layer.className = 'clouds-layer';
        Object.defineProperty(layer, 'clientHeight', { value: 502 });
        card.append(layer);
        createGSAPCloud(layer, { windSpeed: 10, cloudCount: 6, cloudBaseSize: 1 }, 6, card, {});
        const tracks = [...layer.querySelectorAll<HTMLElement>('.cloud-track')];
        const yOf = (t: HTMLElement) => gsap().set.mock.calls.filter(c => c[0] === t && typeof c[1]?.y === 'number').at(-1)![1].y as number;
        return { card, tracks, yOf };
    }

    it('they\'re born in that sky: every cloud whole above the floor, spread down to it', () => {
        const { tracks, yOf } = sky(226);
        expect(tracks.length).toBeGreaterThan(3);
        for (const t of tracks) expect(yOf(t) + Number(t.dataset.awcB)).toBeLessThanOrEqual(226);
        expect(Math.max(...tracks.map(yOf))).toBeGreaterThan(226 / 2);
    });

    it('without a floor, they ride as on today\'s card, down to 60% of its height', () => {
        const { tracks, yOf } = sky();
        for (const t of tracks) expect(yOf(t)).toBeLessThanOrEqual(0.6 * 502);
        expect(Math.max(...tracks.map(yOf))).toBeGreaterThan(226);
    });

    it('a new floor moves the clouds already up into its sky, and none gives them back', () => {
        const { card, tracks, yOf } = sky();
        cloudFloor(card, 226);
        expect(card.dataset.cloudBand).toBe('226');
        expect(card.style.getPropertyValue('--fc-floor-c')).toBe('226px');
        for (const t of tracks) expect(yOf(t) + Number(t.dataset.awcB)).toBeLessThanOrEqual(226);
        cloudFloor(card, null);
        expect(card.dataset.cloudBand).toBeUndefined();
        expect(card.style.getPropertyValue('--fc-floor-c')).toBe('');
        for (const t of tracks) expect(yOf(t)).toBeCloseTo(Number(t.dataset.awcF) * 0.6 * 502, 5);
    });
});
