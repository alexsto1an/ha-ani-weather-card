// Sky palettes: the card's background is the weather.
//
// Each weather condition has a daytime sky (zenith → mid → horizon), a light
// source ("glow": sun bloom, diffuse overcast light, or moonlight) and a
// scrim that deepens the lower sky so the metric row stays legible. Dawn,
// dusk and night are derived from the day sky by shifting lightness, chroma
// and hue, with weaker shifts for overcast skies (clouds mute the light).
//
// Colors are authored in OKLCH (perceptually even steps) and emitted as hex
// / rgba so older WebViews on wall tablets that can't parse oklch() still
// render the sky. test/styles/sky.test.ts checks WCAG contrast for every
// condition × phase.

export type SkyPhase = 'dawn' | 'day' | 'dusk' | 'night';

export const SKY_PHASES: SkyPhase[] = ['dawn', 'day', 'dusk', 'night'];

/** Weather classes produced by getWeatherClass(). */
export const SKY_CONDITIONS = [
    'sunny', 'partly-cloudy', 'windy', 'cloudy', 'foggy',
    'light-rain', 'rainy', 'pouring', 'stormy',
    'snowy', 'snowy-rainy', 'sleety', 'snowy-stormy', 'sleety-stormy',
    'clear-night',
] as const;

export type SkyCondition = typeof SKY_CONDITIONS[number];

/** [lightness 0-1, chroma, hue degrees] */
export type Oklch = [number, number, number];

interface SkyDefinition {
    top: Oklch;
    mid: Oklch;
    bottom: Oklch;
    glow: Oklch;
    glowAlpha: number;
    /** 0 = clear sky, 1 = fully overcast; scales how strongly phases recolor it. */
    overcast: number;
}

export interface SkyColors {
    top: string;
    mid: string;
    bottom: string;
    glow: string;
    scrim: string;
}

/** Daytime skies. Night variants are derived; clear-night is authored directly. */
const SKIES: Record<SkyCondition, SkyDefinition> = {
    // Deep azure overhead, luminous toward the horizon, warm sun bloom.
    // The clear-sky glow is a brighter blue, not cream: cream over azure
    // composites to grey. The sun's own halo carries the warmth.
    'sunny':         { top: [0.445, 0.130, 256], mid: [0.495, 0.125, 250], bottom: [0.575, 0.110, 238], glow: [0.88, 0.080, 218], glowAlpha: 0.45, overcast: 0 },
    'partly-cloudy': { top: [0.445, 0.100, 254], mid: [0.495, 0.092, 248], bottom: [0.565, 0.080, 240], glow: [0.88, 0.070, 220], glowAlpha: 0.36, overcast: 0.25 },
    'windy':         { top: [0.445, 0.115, 244], mid: [0.495, 0.105, 236], bottom: [0.565, 0.090, 222], glow: [0.95, 0.050, 200], glowAlpha: 0.30, overcast: 0.1 },
    // Overcast family: blue-grey, the light is diffuse and comes from above.
    'cloudy':        { top: [0.43, 0.026, 250], mid: [0.475, 0.025, 248], bottom: [0.53, 0.024, 244], glow: [0.86, 0.016, 250], glowAlpha: 0.28, overcast: 0.8 },
    'foggy':         { top: [0.44, 0.014, 212], mid: [0.48, 0.013, 214], bottom: [0.53, 0.012, 218], glow: [0.88, 0.010, 210], glowAlpha: 0.30, overcast: 0.9 },
    'light-rain':    { top: [0.42, 0.034, 246], mid: [0.48, 0.032, 243], bottom: [0.53, 0.030, 238], glow: [0.82, 0.020, 246], glowAlpha: 0.22, overcast: 0.85 },
    'rainy':         { top: [0.37, 0.032, 248], mid: [0.43, 0.032, 244], bottom: [0.48, 0.030, 240], glow: [0.78, 0.020, 246], glowAlpha: 0.18, overcast: 0.9 },
    'pouring':       { top: [0.30, 0.030, 250], mid: [0.36, 0.031, 246], bottom: [0.41, 0.030, 242], glow: [0.72, 0.020, 248], glowAlpha: 0.14, overcast: 1 },
    // Storms lean violet, the color of a sky lit from inside.
    'stormy':        { top: [0.26, 0.032, 280], mid: [0.31, 0.034, 272], bottom: [0.36, 0.034, 262], glow: [0.70, 0.030, 280], glowAlpha: 0.14, overcast: 1 },
    // Snow skies are pale but kept deep enough for white text and flakes.
    'snowy':         { top: [0.45, 0.040, 238], mid: [0.495, 0.036, 234], bottom: [0.55, 0.030, 228], glow: [0.93, 0.020, 230], glowAlpha: 0.32, overcast: 0.7 },
    'snowy-rainy':   { top: [0.44, 0.036, 240], mid: [0.49, 0.033, 236], bottom: [0.54, 0.030, 232], glow: [0.86, 0.020, 236], glowAlpha: 0.24, overcast: 0.85 },
    'sleety':        { top: [0.42, 0.042, 258], mid: [0.47, 0.040, 252], bottom: [0.52, 0.036, 246], glow: [0.84, 0.024, 252], glowAlpha: 0.22, overcast: 0.85 },
    'snowy-stormy':  { top: [0.30, 0.040, 266], mid: [0.35, 0.040, 260], bottom: [0.40, 0.038, 252], glow: [0.74, 0.026, 260], glowAlpha: 0.14, overcast: 1 },
    'sleety-stormy': { top: [0.28, 0.042, 284], mid: [0.33, 0.042, 276], bottom: [0.38, 0.040, 266], glow: [0.72, 0.030, 280], glowAlpha: 0.14, overcast: 1 },
    // Authored night: ink blue overhead, faint moonlight.
    'clear-night':   { top: [0.20, 0.045, 272], mid: [0.25, 0.052, 266], bottom: [0.31, 0.055, 256], glow: [0.86, 0.030, 250], glowAlpha: 0.16, overcast: 0 },
};

const clamp = (min: number, max: number, v: number): number => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Interpolate hue along the shorter arc. */
function lerpHue(a: number, b: number, t: number): number {
    const d = ((b - a + 540) % 360) - 180;
    return (a + d * t + 360) % 360;
}

/**
 * Mix in Oklab (rectangular) space. Hue-wheel mixing sends blue toward amber
 * through green or magenta; Oklab passes through a muted neutral the way a
 * real sky fades from blue to a warm horizon.
 */
function mixOklch(a: Oklch, b: Oklch, t: number): Oklch {
    const toLab = ([l, c, h]: Oklch) => [l, c * Math.cos((h * Math.PI) / 180), c * Math.sin((h * Math.PI) / 180)];
    const [l1, a1, b1] = toLab(a);
    const [l2, a2, b2] = toLab(b);
    const l = lerp(l1, l2, t);
    const aa = lerp(a1, a2, t);
    const bb = lerp(b1, b2, t);
    const c = Math.hypot(aa, bb);
    const h = c < 1e-6 ? a[2] : ((Math.atan2(bb, aa) * 180) / Math.PI + 360) % 360;
    return [l, c, h];
}

// ── OKLCH → sRGB ────────────────────────────────────────────────────────────

function oklchToLinearSrgb([l, c, h]: Oklch): [number, number, number] {
    const hr = (h * Math.PI) / 180;
    const a = c * Math.cos(hr);
    const b = c * Math.sin(hr);
    const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s_ = (l - 0.0894841775 * a - 1.2914855480 * b) ** 3;
    return [
        4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
        -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
        -0.0041960863 * l_ - 0.7034186147 * m_ + 1.7076147010 * s_,
    ];
}

const encode = (x: number): number => (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055);
const decode = (x: number): number => (x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));

/** OKLCH to gamma-encoded sRGB in 0-1, reducing chroma until it fits the gamut. */
export function oklchToSrgb(color: Oklch): [number, number, number] {
    const inGamut = (rgb: number[]) => rgb.every(v => v >= -1e-4 && v <= 1 + 1e-4);
    let lin = oklchToLinearSrgb(color);
    if (!inGamut(lin)) {
        let lo = 0;
        let hi = color[1];
        for (let i = 0; i < 24; i++) {
            const mid = (lo + hi) / 2;
            if (inGamut(oklchToLinearSrgb([color[0], mid, color[2]]))) lo = mid; else hi = mid;
        }
        lin = oklchToLinearSrgb([color[0], lo, color[2]]);
    }
    return lin.map(v => encode(clamp(0, 1, v))) as [number, number, number];
}

const toByte = (v: number): number => Math.round(clamp(0, 1, v) * 255);

export function toHex(rgb: [number, number, number]): string {
    return '#' + rgb.map(v => toByte(v).toString(16).padStart(2, '0')).join('');
}

export function toRgba(rgb: [number, number, number], alpha: number): string {
    return `rgba(${rgb.map(toByte).join(', ')}, ${Number(alpha.toFixed(3))})`;
}

/** WCAG relative luminance of a gamma-encoded sRGB color. */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
    return 0.2126 * decode(r) + 0.7152 * decode(g) + 0.0722 * decode(b);
}

export function contrastRatio(a: [number, number, number], b: [number, number, number]): number {
    const la = relativeLuminance(a);
    const lb = relativeLuminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Source-over compositing in gamma-encoded sRGB, the way CSS blends. */
export function composite(bg: [number, number, number], fg: [number, number, number], alpha: number): [number, number, number] {
    return bg.map((v, i) => v * (1 - alpha) + fg[i] * alpha) as [number, number, number];
}

// ── Phases ──────────────────────────────────────────────────────────────────

interface PhasedSky {
    top: Oklch;
    mid: Oklch;
    bottom: Oklch;
    glow: Oklch;
    glowAlpha: number;
    scrimAlpha: number;
}

/** Night: the same weather under a dark, cool sky. */
function toNight(c: Oklch, overcast: number): Oklch {
    const l = 0.15 + (c[0] - 0.15) * 0.42;
    return [l, c[1] * lerp(0.75, 0.5, overcast), lerpHue(c[2], 262, 0.45)];
}

function phaseSky(condition: SkyCondition, phase: SkyPhase): PhasedSky {
    const s = SKIES[condition];
    const strength = 1 - s.overcast * 0.7;
    const base: PhasedSky = {
        top: s.top, mid: s.mid, bottom: s.bottom,
        glow: s.glow, glowAlpha: s.glowAlpha,
        scrimAlpha: lerp(0.46, 0.28, s.overcast),
    };

    if (condition === 'clear-night') {
        // Already a night sky; dawn and dusk warm only its horizon.
        if (phase === 'dawn' || phase === 'dusk') {
            const warm: Oklch = phase === 'dawn' ? [0.40, 0.09, 20] : [0.38, 0.10, 40];
            return { ...base, bottom: mixOklch(s.bottom, warm, 0.45), glowAlpha: 0.2, scrimAlpha: 0.22 };
        }
        return { ...base, scrimAlpha: 0.2 };
    }

    switch (phase) {
        case 'night':
            return {
                top: toNight(s.top, s.overcast),
                mid: toNight(s.mid, s.overcast),
                bottom: toNight(s.bottom, s.overcast),
                glow: [0.86, 0.030, 250],
                glowAlpha: lerp(0.14, 0.06, s.overcast),
                scrimAlpha: 0.2,
            };
        case 'dusk':
            // Violet overhead, rose in the middle, amber at the horizon.
            return {
                top: mixOklch(s.top, [s.top[0] * 0.80, 0.075, 292], 0.5 * strength),
                mid: mixOklch(s.mid, [s.mid[0] * 0.88, 0.065, 350], 0.42 * strength),
                bottom: mixOklch(s.bottom, [s.bottom[0] * 0.92, 0.115, 52], 0.72 * strength),
                glow: mixOklch(s.glow, [0.82, 0.13, 58], strength),
                glowAlpha: lerp(s.glowAlpha, 0.6, strength * 0.6),
                scrimAlpha: base.scrimAlpha + 0.04,
            };
        case 'dawn':
            // Cool and clean overhead, peach-rose at the horizon.
            return {
                top: mixOklch(s.top, [s.top[0] * 0.95, s.top[1] * 0.85, 262], 0.4 * strength),
                mid: mixOklch(s.mid, [s.mid[0] * 0.95, 0.05, 330], 0.3 * strength),
                bottom: mixOklch(s.bottom, [s.bottom[0] * 0.95, 0.085, 32], 0.62 * strength),
                glow: mixOklch(s.glow, [0.88, 0.09, 40], strength),
                glowAlpha: lerp(s.glowAlpha, 0.5, strength * 0.5),
                scrimAlpha: base.scrimAlpha + 0.04,
            };
        default:
            return base;
    }
}

/** Scrim tint: the sky's own hue, very dark, so the lower sky deepens rather than greys. */
function scrimColor(top: Oklch): Oklch {
    return [0.16, Math.min(0.04, top[1] * 0.6), top[2]];
}

export function skyColors(condition: SkyCondition, phase: SkyPhase): SkyColors {
    const p = phaseSky(condition, phase);
    return {
        top: toHex(oklchToSrgb(p.top)),
        mid: toHex(oklchToSrgb(p.mid)),
        bottom: toHex(oklchToSrgb(p.bottom)),
        glow: toRgba(oklchToSrgb(p.glow), p.glowAlpha),
        scrim: toRgba(oklchToSrgb(scrimColor(p.top)), p.scrimAlpha),
    };
}

/** Primary text on colorized skies: near-white with a whisper of cool tint. */
export const SKY_TEXT: Oklch = [0.985, 0.006, 250];
/** Secondary text is the primary color at this opacity. */
export const SKY_TEXT_SECONDARY_ALPHA = 0.8;

/** Where the mid stop sits and where the scrim starts, as fractions of card height. */
export const SKY_MID_STOP = 0.55;
export const SKY_SCRIM_START = 0.4;

/**
 * The light source's ellipse, as fractions of the card: radii, centre and
 * where it fades to nothing (fraction of the radius). Shared by both cards
 * and the contrast test so the test sees exactly what is drawn. Wide cards
 * (the metrics move to the right column) get a tighter, higher glow.
 */
export interface GlowGeometry { rx: number; ry: number; cx: number; cy: number; fade: number }
export const SKY_GLOW: GlowGeometry = { rx: 0.52, ry: 0.76, cx: 0.86, cy: 0.14, fade: 0.64 };
export const SKY_GLOW_WIDE: GlowGeometry = { rx: 0.40, ry: 0.64, cx: 0.86, cy: 0.10, fade: 0.64 };
/**
 * Compact cards are a short strip with the sun at mid-height on the right:
 * the light sits around it (narrow in x, tall in y, so it reads round).
 */
export const SKY_GLOW_COMPACT: GlowGeometry = { rx: 0.24, ry: 0.95, cx: 0.86, cy: 0.5, fade: 0.64 };

/** CSS radial-gradient for the glow, e.g. `skyGlowGradient(SKY_GLOW, 'var(--awc-sky-glow)')`. */
export function skyGlowGradient(g: GlowGeometry, color: string): string {
    const pct = (n: number) => `${Math.round(n * 100)}%`;
    return `radial-gradient(${pct(g.rx)} ${pct(g.ry)} at ${pct(g.cx)} ${pct(g.cy)}, ${color}, transparent ${pct(g.fade)})`;
}

function parseRgba(rgba: string): { rgb: [number, number, number]; alpha: number } {
    const [r, g, b, a] = (rgba.match(/[\d.]+/g) || []).map(Number);
    return { rgb: [r / 255, g / 255, b / 255], alpha: a ?? 1 };
}

/**
 * The sky color at a point (x, y as fractions of the card), including the
 * glow, the way CSS paints it: glow alpha falls linearly to 0 at `fade` of
 * the ellipse radius, composited over the base and scrim.
 */
export function sampleSkyAt(condition: SkyCondition, phase: SkyPhase, x: number, y: number, glow: GlowGeometry = SKY_GLOW): [number, number, number] {
    const base = sampleSky(condition, phase, y);
    const { rgb, alpha } = parseRgba(skyColors(condition, phase).glow);
    const d = Math.hypot((x - glow.cx) / glow.rx, (y - glow.cy) / glow.ry);
    const a = d < glow.fade ? alpha * (1 - d / glow.fade) : 0;
    return composite(base, rgb, a);
}

/**
 * The sky color at a vertical position (0 = top, 1 = bottom), ignoring the
 * glow (which sits in the top-right corner, away from the text column).
 */
export function sampleSky(condition: SkyCondition, phase: SkyPhase, y: number): [number, number, number] {
    const p = phaseSky(condition, phase);
    const top = oklchToSrgb(p.top);
    const mid = oklchToSrgb(p.mid);
    const bottom = oklchToSrgb(p.bottom);
    const base = y <= SKY_MID_STOP
        ? composite(top, mid, y / SKY_MID_STOP)
        : composite(mid, bottom, (y - SKY_MID_STOP) / (1 - SKY_MID_STOP));
    const scrimT = clamp(0, 1, (y - SKY_SCRIM_START) / (1 - SKY_SCRIM_START));
    return composite(base, oklchToSrgb(scrimColor(p.top)), p.scrimAlpha * scrimT);
}

/**
 * CSS custom properties for every condition and phase. Day is the default
 * for a condition; dawn / dusk / night apply via the card's data-phase.
 */
export function generateSkyCss(): string {
    const rules: string[] = [];
    for (const condition of SKY_CONDITIONS) {
        for (const phase of SKY_PHASES) {
            const c = skyColors(condition, phase);
            const selector = phase === 'day'
                ? `.animated-weather-card.${condition}`
                : `.animated-weather-card.${condition}[data-phase="${phase}"]`;
            rules.push(`${selector} { --awc-sky-top: ${c.top}; --awc-sky-mid: ${c.mid}; --awc-sky-bottom: ${c.bottom}; --awc-sky-glow: ${c.glow}; --awc-sky-scrim: ${c.scrim}; }`);
        }
    }
    return rules.join('\n');
}

/**
 * The sky's phase from the sun: night below -6° (civil twilight), dawn or
 * dusk within 6° of the horizon, day above. Both cards use this, so they
 * change phase at the same moment.
 */
export function skyPhaseFromSun(elevation: number | null | undefined, rising: boolean, aboveHorizon: boolean): SkyPhase {
    if (elevation === null || elevation === undefined || !Number.isFinite(elevation)) return aboveHorizon ? 'day' : 'night';
    if (elevation < -6) return 'night';
    if (elevation < 6) return rising ? 'dawn' : 'dusk';
    return 'day';
}

/**
 * The one curve for everything that follows the time of day or the
 * condition: sky, sun and cloud colors, and the sun's height. Symmetric
 * (sine in-out), because a dissolve has no reason to front-load.
 */
export const SKY_DISSOLVE_SEC = 3.2;
export const SKY_DISSOLVE_EASE = 'cubic-bezier(0.37, 0, 0.63, 1)';

/**
 * Colors registered as typed properties so they interpolate instead of
 * snapping, with initial values from the day sky.
 */
const DISSOLVING_COLORS: Record<string, string> = {
    '--awc-sky-top': '#3b5f8c',
    '--awc-sky-mid': '#4a6d99',
    '--awc-sky-bottom': '#5a7ba3',
    '--awc-sky-glow': 'rgba(0, 0, 0, 0)',
    '--awc-sky-scrim': 'rgba(0, 0, 0, 0)',
    '--weather-sun-primary': '#ffd67a',
    '--weather-sun-secondary': '#ffb547',
    '--weather-sun-glow': 'rgba(255, 214, 140, 0.55)',
    '--weather-sun-halo': 'rgba(255, 214, 140, 0.24)',
    '--awc-cloud-far': 'rgba(214, 226, 242, 0.85)',
    '--awc-cloud-mid': 'rgba(232, 239, 248, 0.92)',
    '--awc-cloud-near': 'rgba(248, 250, 253, 0.96)',
};
export const DISSOLVING_PROPERTIES = Object.keys(DISSOLVING_COLORS);
/** Just the sky's own colors (the sun tracker has no sun disc or clouds). */
export const SKY_COLOR_PROPERTIES = DISSOLVING_PROPERTIES.filter(name => name.startsWith('--awc-sky-'));

/** The card's transition list: every registered color on the dissolve curve. */
export function dissolveTransition(): string {
    return DISSOLVING_PROPERTIES.map(name => `${name} ${SKY_DISSOLVE_SEC}s ${SKY_DISSOLVE_EASE}`).join(',\n            ');
}

let skyPropertiesRegistered = false;

/**
 * Register the sky, sun and cloud colors as typed properties so phase
 * changes (day → dusk) cross-fade instead of snapping. Browsers without
 * CSS.registerProperty simply switch instantly.
 */
export function registerSkyProperties(): void {
    if (skyPropertiesRegistered) return;
    skyPropertiesRegistered = true;
    const css = (globalThis as { CSS?: { registerProperty?: (def: object) => void } }).CSS;
    if (!css?.registerProperty) return;
    for (const [name, initialValue] of Object.entries(DISSOLVING_COLORS)) {
        try {
            css.registerProperty({ name, syntax: '<color>', inherits: true, initialValue });
        } catch {
            // Already registered (another copy of the card on the page): fine.
        }
    }
}
