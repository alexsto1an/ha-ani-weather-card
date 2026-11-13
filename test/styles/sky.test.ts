import { describe, it, expect, vi } from 'vitest';
import {
    SKY_CONDITIONS, SKY_PHASES, SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, SKY_GLOW, SKY_GLOW_WIDE, SKY_GLOW_COMPACT,
    sampleSky, sampleSkyAt, oklchToSrgb, composite, contrastRatio, skyColors, generateSkyCss, toHex,
    DISSOLVING_PROPERTIES, dissolveTransition, SKY_DISSOLVE_SEC, SKY_DISSOLVE_EASE,
} from '../../src/sky';
import { getMainCardStyles, CLOUD_OVERHANG_PX } from '../../src/styles/card';

const text = oklchToSrgb(SKY_TEXT);

/** Text color as rendered: primary, or secondary (primary at reduced opacity) over the sky. */
function rendered(bg: [number, number, number], secondary: boolean): [number, number, number] {
    return secondary ? composite(bg, text, SKY_TEXT_SECONDARY_ALPHA) : text;
}

// Vertical bands where text sits: the hero block (location, temperature,
// condition, feels-like) and the metric row at the bottom.
const HERO_BAND = [0.08, 0.2, 0.32, 0.44];
const METRIC_BAND = [0.72, 0.82, 0.92, 1];

describe('sky palettes', () => {
    for (const condition of SKY_CONDITIONS) {
        for (const phase of SKY_PHASES) {
            it(`${condition} / ${phase}: secondary text meets WCAG AA (4.5:1) wherever text sits`, () => {
                for (const y of [...HERO_BAND, ...METRIC_BAND]) {
                    const bg = sampleSky(condition, phase, y);
                    const ratio = contrastRatio(rendered(bg, true), bg);
                    expect(ratio, `${condition}/${phase} at y=${y}`).toBeGreaterThanOrEqual(4.5);
                }
            });
        }
    }

    // Text on the right-hand side sits inside the glow: the metric grid's
    // right column on narrow cards, the whole metric block on wide ones.
    const grid = (xs: number[], ys: number[]) => xs.flatMap(x => ys.map(y => [x, y] as const));
    const NARROW_RIGHT = grid([0.5, 0.6, 0.7, 0.8, 0.85], [0.6, 0.7, 0.8, 0.9, 0.95]);
    const WIDE_METRICS = grid([0.55, 0.65, 0.75, 0.85, 0.9], [0.5, 0.6, 0.7, 0.85]);
    // Compact strip: the temperature, condition and second line across the
    // left and middle at mid-height, with the sun's light on the right
    const COMPACT_TEXT = grid([0.05, 0.2, 0.35, 0.5, 0.6], [0.3, 0.4, 0.5, 0.6, 0.7]);

    for (const condition of SKY_CONDITIONS) {
        for (const phase of SKY_PHASES) {
            it(`${condition} / ${phase}: secondary text stays AA inside the glow (narrow, wide and compact layouts)`, () => {
                for (const [zone, points, glow] of [['narrow', NARROW_RIGHT, SKY_GLOW], ['wide', WIDE_METRICS, SKY_GLOW_WIDE], ['compact', COMPACT_TEXT, SKY_GLOW_COMPACT]] as const) {
                    for (const [x, y] of points) {
                        const bg = sampleSkyAt(condition, phase, x, y, glow);
                        const ratio = contrastRatio(rendered(bg, true), bg);
                        expect(ratio, `${condition}/${phase} ${zone} at x=${x}, y=${y}`).toBeGreaterThanOrEqual(4.5);
                    }
                }
            });
        }
    }

    // The note, measured in Chrome: under the hero on narrow cards, two lines
    // reaching almost across (0.44–0.62 of the height in 5- and 6-row frames
    // and masonry), into the glow; at the foot of the hero column on wide
    // ones. It's full-strength text: the secondary tint fails in the glow.
    const NARROW_NOTE = grid([0.05, 0.25, 0.45, 0.65, 0.85], [0.44, 0.5, 0.56, 0.62]);
    const WIDE_NOTE = grid([0.05, 0.2, 0.35, 0.5], [0.72, 0.8, 0.88]);

    for (const condition of SKY_CONDITIONS) {
        for (const phase of SKY_PHASES) {
            it(`${condition} / ${phase}: the note stays AA where it sits (narrow and wide layouts)`, () => {
                for (const [zone, points, glow] of [['narrow', NARROW_NOTE, SKY_GLOW], ['wide', WIDE_NOTE, SKY_GLOW_WIDE]] as const) {
                    for (const [x, y] of points) {
                        const bg = sampleSkyAt(condition, phase, x, y, glow);
                        const ratio = contrastRatio(rendered(bg, false), bg);
                        expect(ratio, `${condition}/${phase} ${zone} note at x=${x}, y=${y}`).toBeGreaterThanOrEqual(4.5);
                    }
                }
            });
        }
    }

    it('emits valid hex and rgba colors, never oklch()', () => {
        const c = skyColors('sunny', 'day');
        for (const hex of [c.top, c.mid, c.bottom]) expect(hex).toMatch(/^#[0-9a-f]{6}$/);
        for (const rgba of [c.glow, c.scrim]) expect(rgba).toMatch(/^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
        expect(generateSkyCss()).not.toContain('oklch');
    });

    it('gives every condition a day rule and dawn / dusk / night overrides', () => {
        const css = generateSkyCss();
        for (const condition of SKY_CONDITIONS) {
            expect(css).toContain(`.animated-weather-card.${condition} {`);
            for (const phase of ['dawn', 'dusk', 'night']) {
                expect(css).toContain(`.animated-weather-card.${condition}[data-phase="${phase}"]`);
            }
        }
    });

    it('makes night skies darker than day skies', () => {
        for (const condition of SKY_CONDITIONS) {
            if (condition === 'clear-night') continue;
            const day = sampleSky(condition, 'day', 0.3);
            const night = sampleSky(condition, 'night', 0.3);
            expect(night.reduce((a, b) => a + b), condition).toBeLessThan(day.reduce((a, b) => a + b));
        }
    });

    it('converts OKLCH to sRGB correctly at the extremes', () => {
        expect(toHex(oklchToSrgb([1, 0, 0]))).toBe('#ffffff');
        expect(toHex(oklchToSrgb([0, 0, 0]))).toBe('#000000');
        // Out-of-gamut chroma is reduced, not clipped per channel.
        const vivid = oklchToSrgb([0.7, 0.4, 145]);
        for (const v of vivid) {
            expect(v).toBeGreaterThanOrEqual(0);
            expect(v).toBeLessThanOrEqual(1);
        }
    });
});

describe('time-of-day dissolve', () => {
    it('cross-fades the sun and cloud colors with the sky, on one symmetric curve', () => {
        for (const name of ['--awc-sky-top', '--weather-sun-primary', '--weather-sun-glow', '--awc-cloud-near']) {
            expect(DISSOLVING_PROPERTIES).toContain(name);
        }
        const transition = dissolveTransition();
        for (const name of DISSOLVING_PROPERTIES) {
            expect(transition).toContain(`${name} ${SKY_DISSOLVE_SEC}s ${SKY_DISSOLVE_EASE}`);
        }
        // Sine in-out: the curve's control points mirror each other
        const [x1, y1, x2, y2] = SKY_DISSOLVE_EASE.match(/[\d.]+/g)!.map(Number);
        expect(x1 + x2).toBeCloseTo(1);
        expect(y1 + y2).toBeCloseTo(1);
    });

    it('registers every dissolving color as a <color>', async () => {
        vi.resetModules();
        const registerProperty = vi.fn();
        (globalThis as { CSS?: unknown }).CSS = { registerProperty };
        const sky = await import('../../src/sky');
        sky.registerSkyProperties();
        const names = registerProperty.mock.calls.map(([def]) => def.name);
        expect(names).toEqual(sky.DISSOLVING_PROPERTIES);
        for (const [def] of registerProperty.mock.calls) expect(def.syntax).toBe('<color>');
        delete (globalThis as { CSS?: unknown }).CSS;
    });

    it('moves the sun down at dusk and below the horizon at night', () => {
        const css = getMainCardStyles();
        const lift = (phase: string) => Number(css.match(new RegExp(`\\[data-phase="${phase}"\\] \\.sun-track[^{]*\\{ transform: translateY\\(([\\d.]+)%\\)`))?.[1]);
        expect(lift('night')).toBeGreaterThan(lift('dusk'));
        expect(css).toMatch(/\[data-phase="dawn"\] \.sun-track/);
        expect(css).toMatch(/\.sun-track \{[^}]*transition: transform/);
    });
});

describe('spilled weather', () => {
    it('paints past the card without widening the page', () => {
        // Not paint containment, which would clip the spill to the card
        const rule = getMainCardStyles().match(/\.animated-weather-card\[data-spill\] \{([^}]*)\}/)![1];
        expect(rule).toContain('overflow: visible');
        expect(rule).toMatch(/contain: layout;/);
    });

    it('keeps fog, clouds and, in Firefox, leaves out of the page\'s size (issue #16: Firefox counts them despite the containment)', () => {
        const css = getMainCardStyles();
        // Fog and clouds never spill sideways: they clip their overflow, not only their paint
        expect(css).toMatch(/\.animation-container\.fog-container \{[^}]*clip-path: inset\(0 round[^}]*overflow: hidden;\s*overflow: clip;/);
        expect(css).toMatch(/\.clouds-container \{[^}]*overflow: hidden;\s*overflow: clip;/);
        // The clouds' overhang lives inside their container's box, so the clip leaves it showing
        expect(css).toMatch(/\[data-spill\] \.clouds-container \{[^}]*top: calc\(-1 \* var\(--awc-cloud-overhang\)\)/);
        // Leaves still blow out to the right, except in Firefox, where they'd widen the dashboard
        expect(css).toMatch(/\[data-spill\] \.wind-container \{\s*clip-path: inset\(0 -500px -200px 0\);/);
        expect(css).toMatch(/@supports \(-moz-appearance: none\) \{\s*\.animated-weather-card\[data-spill\] \.wind-container \{ overflow: clip; \}/);
    });
});

describe('the temperature\'s colour', () => {
    it('is custom_colors.temperature_color on either palette, else the text\'s, or the theme\'s accent on the theme palette', () => {
        const css = getMainCardStyles();
        expect(css).toMatch(/\.temperature \{[^}]*color: var\(--awc-hero-color, inherit\);/);
        expect(css).toMatch(/--awc-hero-color: var\(--primary-color, var\(--primary-text-color\)\);/);
        expect(css).toMatch(/\.animated-weather-card\.theme-colors \.temperature \{\s*color: var\(--awc-hero-color\);/);
    });
});

describe('clouds over the top edge', () => {
    const css = getMainCardStyles();

    it('stay in the rounded frame by default', () => {
        expect(css).toMatch(/\.clouds-container \{[^}]*clip-path: inset\(0 round var\(--ha-card-border-radius/);
    });

    it('rise past the top edge with spill, solid for the first half, and stay closed at the sides', () => {
        const rule = css.match(/\[data-spill\] \.clouds-container \{([^}]*)\}/)![1];
        expect(rule).toContain(`--awc-cloud-overhang: ${CLOUD_OVERHANG_PX}px`);
        expect(rule).toMatch(/top: calc\(-1 \* var\(--awc-cloud-overhang\)\)/);
        // Clipped flush at the sides and bottom (rounded bottom corners)
        expect(rule).toMatch(/clip-path: inset\(0 round 0 0 /);
        // Solid from halfway up, at --awc-above (#000, or 16% for the theme's solid clouds) until the card's edge
        expect(rule).toMatch(/mask-image: linear-gradient\(to bottom, transparent 0, var\(--awc-above, #000\) calc\(var\(--awc-cloud-overhang\) \/ 2\), var\(--awc-above, #000\) var\(--awc-cloud-overhang\), #000 var\(--awc-cloud-overhang\)\)/);
    });

    it('on the theme palette, are drawn solid over an opaque card, mixed with its fill, and show at 16% above it', () => {
        const block = css.match(/@supports \(color: color-mix\(in srgb, red, blue\)\) \{([\s\S]*?)\n {8}\}/)![1];
        expect(block).toMatch(/\.theme-colors\[data-solid-clouds\] \{[^}]*--awc-cloud-near: color-mix\(in srgb, var\(--secondary-text-color, #888\) 16%, var\(--awc-card-bg, transparent\)\)/);
        expect(block).toMatch(/--awc-above: rgba\(0, 0, 0, 0\.16\)/);
        // Solid, but they still fade out with a change of condition
        expect(block).toMatch(/\[data-solid-clouds\]:not\(\.condition-out\) \.cloud-gsap \{ opacity: 1 !important; \}/);
    });

    it('keep their positions relative to the card', () => {
        expect(css).toMatch(/\.clouds-layer \{[^}]*top: var\(--awc-cloud-overhang\)/);
    });
});
