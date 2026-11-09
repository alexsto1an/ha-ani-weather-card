import { describe, it, expect, vi } from 'vitest';
import {
    SKY_CONDITIONS, SKY_PHASES, SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, SKY_GLOW, SKY_GLOW_WIDE, SKY_GLOW_COMPACT, SKY_GLOW_FORECAST, SKY_GLOW_FORECAST_WIDE,
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
        expect(rule).toMatch(/mask-image: linear-gradient\(to bottom, transparent 0, #000 calc\(var\(--awc-cloud-overhang\) \/ 2\)\)/);
    });

    it('keep their positions relative to the card', () => {
        expect(css).toMatch(/\.clouds-layer \{[^}]*top: var\(--awc-cloud-overhang\)/);
    });
});

describe('the forecast and the clock stay legible where they sit', () => {
    const grid = (xs: number[], ys: number[]) => xs.flatMap(x => ys.map(y => [x, y] as const));
    const range = (from: number, to: number, step: number) => Array.from({ length: Math.round((to - from) / step) + 1 }, (_, i) => +(from + i * step).toFixed(3));
    const check = (name: string, points: readonly (readonly [number, number])[], glow: typeof SKY_GLOW, secondary: boolean) => {
        for (const condition of SKY_CONDITIONS) {
            for (const phase of SKY_PHASES) {
                for (const [x, y] of points) {
                    const bg = sampleSkyAt(condition, phase, x, y, glow);
                    const ratio = contrastRatio(rendered(bg, secondary), bg);
                    expect(ratio, `${name}: ${condition}/${phase} at x=${x}, y=${y}`).toBeGreaterThanOrEqual(4.5);
                }
            }
        }
    };

    // The forecast section on a narrow card: its top is held at 0.43 of the
    // card's height or lower (applySizeState), and its text runs the width
    // at full strength: the line's labels, the columns, the sentence
    it('the forecast on a narrow card, full strength across the width from 0.43 down', () => {
        check('forecast, narrow', grid(range(0.02, 0.98, 0.04), range(0.43, 0.95, 0.04)), SKY_GLOW, false);
    });

    // On a wide card it's a full-width row under the hero and the metrics
    it('the forecast on a wide card, tinted, from 0.6 down', () => {
        check('forecast, wide', grid(range(0.02, 0.98, 0.04), range(0.6, 0.95, 0.05)), SKY_GLOW_WIDE, true);
    });

    // Today's high and low beside the temperature (hidden past 0.65 of the
    // width) or on the condition's line (which stops at 0.65)
    it('today\'s high and low, full strength, left of 0.65', () => {
        check('high and low', grid(range(0.2, 0.65, 0.05), range(0.08, 0.36, 0.04)), SKY_GLOW, false);
    });

    // Clocks b and c: the first line, full strength, stopped at 0.62
    it('the clock on the first line, full strength, left of 0.62', () => {
        check('clock, first line', grid(range(0.05, 0.62, 0.03), [0.05, 0.08, 0.12, 0.16]), SKY_GLOW, false);
    });

    // Clock a: the hero's last line, tinted, its date dropped past 0.55
    it('the closing-line clock, tinted, left of 0.55', () => {
        check('clock, closing line', grid(range(0.05, 0.55, 0.05), range(0.3, 0.6, 0.05)), SKY_GLOW, true);
    });

    // A day row's tinted low ends by 0.55 on a narrow card (the fixed bar keeps it there)
    it('a day\'s tinted low, left of 0.55, from 0.43 down', () => {
        check('day lows', grid(range(0.3, 0.55, 0.05), range(0.43, 0.95, 0.04)), SKY_GLOW, true);
    });

    // The forecast card: its light from just above its top-right corner.
    // Tinted text (the headline's eyebrow and quiet line, capped at 60% of
    // the width; the axis; the lows) passes left of 0.7 at its top, and
    // across the width from 0.3 down (0.8 and 0.2 on a wide card)
    it('the forecast card, tinted, clear of its light', () => {
        check('forecast card, top', grid(range(0.04, 0.7, 0.04), range(0.04, 0.3, 0.04)), SKY_GLOW_FORECAST, true);
        check('forecast card', grid(range(0.04, 0.96, 0.04), range(0.3, 0.95, 0.05)), SKY_GLOW_FORECAST, true);
        check('forecast card, wide, top', grid(range(0.03, 0.8, 0.04), range(0.04, 0.2, 0.04)), SKY_GLOW_FORECAST_WIDE, true);
        check('forecast card, wide', grid(range(0.03, 0.97, 0.04), range(0.2, 0.95, 0.05)), SKY_GLOW_FORECAST_WIDE, true);
    });

    // The strip under a compact weather card: the sky from its mid tone to
    // the horizon, with the scrim, no light of its own. Its text is full
    // strength: the tint falls to 4.48 at its top in a sunny dawn
    it('the forecast card\'s strip, full strength, anywhere', () => {
        for (const condition of SKY_CONDITIONS) {
            for (const phase of SKY_PHASES) {
                const c = skyColors(condition, phase);
                const hex = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
                const [r, g, b, a] = (c.scrim.match(/[\d.]+/g) ?? []).map(Number);
                for (const y of range(0, 1, 0.1)) {
                    const base = composite(hex(c.mid), hex(c.bottom), y);
                    const bg = composite(base, [r / 255, g / 255, b / 255], a * Math.max(0, (y - 0.4) / 0.6));
                    expect(contrastRatio(rendered(bg, false), bg), `strip: ${condition}/${phase} at y=${y}`).toBeGreaterThanOrEqual(4.5);
                }
            }
        }
    });
});
