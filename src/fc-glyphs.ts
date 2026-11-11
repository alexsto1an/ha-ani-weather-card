// The forecast's icons: one minimal set for the hourly row, the strip and
// the daily list. Flat shapes on a 24-unit grid, as few as a condition
// needs to be told apart: the card's own three-part cloud (its body and
// two puffs), a disc with eight short rays for the sun, a crescent for the
// moon, slanted streaks for rain, small flakes for snow, round pellets for
// hail, a bolt, two bars of fog, two wind lines. A shape behind a cloud is
// cut back from it by a hairline, so one ink still reads as two shapes.
//
// On the sky palettes each icon stands in the light of its own hour: the
// cloud is the card's day white, dawn rose, dusk peach or night slate, the
// sun its gold, the rain its pale blue, mixed from the hour's day, twilight
// and night in OKLab. Only colour: no gradient, no glow, no detail. Each
// colour's lightness is raised, its hue and chroma kept, until it holds
// 3.2:1 against the brightest sky it can be seen over (see litTints). On
// the theme palettes there's no sky to stand in: one ink, Home Assistant's
// icon colour.

import { Lab, cssOf, fromLab, labOf, luminance, phaseWeights } from './fc-core';

/** The marks a condition is made of */
export type GlyphKey = 'sunny' | 'clear-night' | 'partlycloudy' | 'partlycloudy-night' | 'cloudy' | 'fog' | 'rainy' | 'pouring'
    | 'lightning' | 'lightning-rainy' | 'snowy' | 'snowy-rainy' | 'hail' | 'windy' | 'windy-variant' | 'exceptional';

/** Which drawing an hour gets: clear and partly cloudy skies take the moon after dark */
export function glyphKey(condition: string | undefined, isDay = true): GlyphKey {
    switch (condition) {
        case 'sunny': case 'clear-night': return isDay ? 'sunny' : 'clear-night';
        case 'partlycloudy': return isDay ? 'partlycloudy' : 'partlycloudy-night';
        case 'cloudy': case 'fog': case 'rainy': case 'pouring': case 'lightning': case 'lightning-rainy': case 'snowy':
        case 'snowy-rainy': case 'hail': case 'windy': case 'windy-variant': case 'exceptional':
            return condition;
        default: return 'cloudy';
    }
}

// ── Geometry ───────────────────────────────────────────────────────────────
const f = (v: number) => +v.toFixed(2);

/**
 * The card's cloud (cloudShape in gsap-effects.ts: a pill 70 × 26 with
 * puffs of 44 and 35), as one outline, scaled by s and placed at (x, y),
 * its top left. Returns the path and its box.
 */
function cloud(x: number, y: number, s: number): { d: string; w: number; h: number } {
    // The body's top is 22 below the big puff's top
    const by = y + 22 * s;
    const r = 13 * s;               // the pill's ends
    const w = 70 * s;
    const big = { cx: x + 31 * s, cy: by, r: 22 * s };
    const small = { cx: x + 43.5 * s, cy: by + 4.5 * s, r: 17.5 * s };
    // The pill, then the two puffs: three subpaths, filled nonzero, one silhouette
    const pill = `M${f(x + r)} ${f(by)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(by + 2 * r)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(by)}Z`;
    // Clockwise, as the pill is: nonzero fill then joins the three into one silhouette
    const circle = (c: { cx: number; cy: number; r: number }) => `M${f(c.cx - c.r)} ${f(c.cy)}a${f(c.r)} ${f(c.r)} 0 1 1 ${f(2 * c.r)} 0a${f(c.r)} ${f(c.r)} 0 1 1 ${f(-2 * c.r)} 0Z`;
    return { d: pill + circle(big) + circle(small), w, h: 48 * s };
}

/** A crescent: the disc (cx, cy, r) less a disc of radius rc whose centre sits d away toward (dx, dy) */
function crescent(cx: number, cy: number, r: number, rc: number, d: number, angle = -40): string {
    const u = [Math.cos((angle * Math.PI) / 180), Math.sin((angle * Math.PI) / 180)];
    const a = (r * r - rc * rc + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, r * r - a * a));
    const px = cx + a * u[0], py = cy + a * u[1];
    const p1 = [px - h * u[1], py + h * u[0]], p2 = [px + h * u[1], py - h * u[0]];
    // The lit limb (the long way round the disc), then back along the shadow's edge
    return `M${f(p1[0])} ${f(p1[1])}A${f(r)} ${f(r)} 0 1 1 ${f(p2[0])} ${f(p2[1])}A${f(rc)} ${f(rc)} 0 0 0 ${f(p1[0])} ${f(p1[1])}Z`;
}

/** n rays round (cx, cy) from r0 to r1 */
function rays(cx: number, cy: number, r0: number, r1: number, angles: number[]): string {
    return angles.map(a => {
        const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
        return `M${f(cx + r0 * c)} ${f(cy + r0 * s)}L${f(cx + r1 * c)} ${f(cy + r1 * s)}`;
    }).join('');
}
/** Streaks leaning as rain falls, from (x, y), each len long */
const streaks = (xs: number[], y: number, len: number) => xs.map(x => `M${f(x)} ${f(y)}l${f(-len * 0.32)} ${f(len)}`).join('');
/** A six-armed flake of radius r */
const flake = (cx: number, cy: number, r: number) => [90, 30, 150].map(a => {
    const c = Math.cos((a * Math.PI) / 180) * r, s = Math.sin((a * Math.PI) / 180) * r;
    return `M${f(cx - c)} ${f(cy - s)}L${f(cx + c)} ${f(cy + s)}`;
}).join('');
const disc = (cx: number, cy: number, r: number) => `M${f(cx - r)} ${f(cy)}a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;

// The clouds: full (cloudy), raised over what falls, and small behind a sun
const FULL = cloud(2, 5.2, 20 / 70);
const WET = cloud(3, 1.6, 18 / 70);            // ends at y 1.6 + 12.3 = 13.9: 7 units below for what falls
const PART = cloud(1, 8.6, 16.5 / 70);         // lower left, the sun or moon behind it up right
const SMALL = cloud(2.2, 2.4, 13 / 70);        // windy-variant and fog
const BOLT = 'M13.2 14.6 9.9 19.1h2.6l-1.4 4.1 3.9-5.3h-2.6l1.4-3.3Z';
const WIND = 'M2.5 10.2h12.2a2.9 2.9 0 1 0-2.9-2.9M2.5 14.2h15.6a2.9 2.9 0 1 1-2.9 2.9';

/** The parts of a drawing: a cloud, a sun or a moon behind it, and what falls */
interface Parts {
    cloud?: string;
    /** The shape behind the cloud, cut back from it */
    behind?: { d: string; kind: 'sun' | 'moon'; rays?: string };
    sun?: { d: string; rays: string };
    moon?: string;
    rain?: string;
    snow?: { d: string; dots?: boolean };
    bolt?: string;
    /** Strokes in the cloud's ink (fog bars, wind) */
    lines?: string;
    alert?: boolean;
}
const SUN_C = [12, 12] as const;
const DRAW: Record<GlyphKey, Parts> = {
    sunny: { sun: { d: disc(SUN_C[0], SUN_C[1], 4.4), rays: rays(SUN_C[0], SUN_C[1], 7.1, 9.6, [0, 45, 90, 135, 180, 225, 270, 315]) } },
    'clear-night': { moon: crescent(12, 12, 7.6, 6.4, 5.4) },
    partlycloudy: { cloud: PART.d, behind: { d: disc(15.6, 8.4, 4.3), kind: 'sun', rays: rays(15.6, 8.4, 6.6, 8.6, [-90, -45, 0]) } },
    'partlycloudy-night': { cloud: PART.d, behind: { d: crescent(15.6, 8.6, 5.6, 4.7, 4), kind: 'moon' } },
    cloudy: { cloud: FULL.d },
    fog: { cloud: SMALL.d, lines: 'M5 17.4H19M3 21.2H15.5' },
    rainy: { cloud: WET.d, rain: streaks([9.6, 15.2], 16.4, 4.6) },
    pouring: { cloud: WET.d, rain: streaks([7.4, 11.9, 16.4], 16, 6.4) },
    lightning: { cloud: WET.d, bolt: BOLT },
    'lightning-rainy': { cloud: WET.d, bolt: BOLT, rain: streaks([7.8, 18], 16.4, 4.6) },
    snowy: { cloud: WET.d, snow: { d: flake(8.6, 18.9, 2.5) + flake(15.8, 19.4, 2.5) } },
    'snowy-rainy': { cloud: WET.d, rain: streaks([9.2], 16.4, 5), snow: { d: flake(15.6, 19, 2.5) } },
    hail: { cloud: WET.d, snow: { d: disc(8.4, 18, 1.45) + disc(15.6, 18, 1.45) + disc(12, 21.6, 1.45), dots: true } },
    windy: { lines: WIND },
    'windy-variant': { cloud: SMALL.d, lines: 'M7 17.2h10.6a2.6 2.6 0 1 1-2.6 2.6M4.4 14H12' },
    exceptional: { alert: true },
};
export const GLYPH_KEYS = Object.keys(DRAW) as GlyphKey[];

// ── Light ──────────────────────────────────────────────────────────────────
export type Tone = 'cloud' | 'grey' | 'sun' | 'moon' | 'rain' | 'bolt';
/** The card's own tints by phase (styles/card.ts: --awc-cloud-near, the sun's colours, the rain's) */
const TINT: Record<Tone, Record<'day' | 'dawn' | 'dusk' | 'night', string>> = {
    cloud: { day: '#f8fafd', dawn: '#ffeae4', dusk: '#ffe2d6', night: '#96a2ba' },
    // Overcast and wet hours: the cloudy sky's greyer clouds by day
    grey: { day: '#dee5ee', dawn: '#e8dee2', dusk: '#e8d6d4', night: '#96a2ba' },
    sun: { day: '#ffd67a', dawn: '#ffe0b0', dusk: '#ffc58a', night: '#ffd67a' },
    moon: { day: '#f4f1e6', dawn: '#f4f1e6', dusk: '#f4f1e6', night: '#e6e3d8' },
    rain: { day: '#e2ecff', dawn: '#ece8f8', dusk: '#f0e4ec', night: '#b4c6e6' },
    bolt: { day: '#fffaf0', dawn: '#fffaf0', dusk: '#fffaf0', night: '#fff3d6' },
};
const TINT_LAB: Record<string, Lab> = {};
const tintLab = (c: string) => (TINT_LAB[c] ??= labOf(c));

/** Raise a colour's OKLab lightness, hue and chroma kept, until its luminance reaches `min` */
function floorLab(lab: Lab, min: number): Lab {
    if (min <= 0 || luminance(fromLab(lab)) >= min) return lab;
    let lo = lab[0], hi = 1;
    for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (luminance(fromLab([m, lab[1], lab[2]])) >= min) hi = m; else lo = m; }
    return [hi, lab[1], lab[2], 1];
}

/** The contrast an icon holds against the sky behind it */
export const GLYPH_CONTRAST = 3.2;

export type Tints = Record<Tone, string>;
/**
 * The colours of one hour's icon, lit by that hour: elevation and rising
 * give its day, twilight and night, and `skyLum` is the brightest sky it
 * can be seen over (a luminance; 0 for no floor).
 */
export function litTints(elevation: number, rising: boolean, skyLum: number): Tints {
    const w = phaseWeights(elevation, rising);
    // A little over the mark, so it still holds once rounded to hex
    const min = skyLum > 0 ? (GLYPH_CONTRAST + 0.05) * (skyLum + 0.05) - 0.05 : 0;
    const out = {} as Tints;
    for (const tone of Object.keys(TINT) as Tone[]) {
        let lab: Lab = [0, 0, 0, 0];
        for (const ph of ['day', 'dawn', 'dusk', 'night'] as const) {
            if (!w[ph]) continue;
            const t = tintLab(TINT[tone][ph]);
            lab = [lab[0] + t[0] * w[ph], lab[1] + t[1] * w[ph], lab[2] + t[2] * w[ph], 1];
        }
        out[tone] = cssOf(floorLab(lab, min));
    }
    return out;
}
const OVERCAST = new Set(['cloudy', 'fog', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail', 'windy-variant']);

let uid = 0;
/**
 * One icon as SVG. tints: litTints() on a sky palette, or null on a theme
 * palette (one ink: currentColor, which the theme's CSS sets to its icon
 * colour). Decorative: the row's and the list's text names the condition.
 */
export function glyph(condition: string | undefined, isDay: boolean, size: number, tints: Tints | null, cls = 'fc-glyph'): string {
    const key = glyphKey(condition, isDay);
    const p = DRAW[key];
    const ink = (tone: Tone) => (tints ? tints[tone] : 'currentColor');
    const cloudTone: Tone = OVERCAST.has(key) ? 'grey' : 'cloud';
    let body = '';
    if (p.behind) {
        // Cut back from the cloud by a hairline of sky, so one ink still reads as two shapes
        const id = `fcg${++uid}`;
        body += `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="${p.cloud}" fill="#000" stroke="#000" stroke-width="2.6" stroke-linejoin="round"/></mask>`
            + `<g mask="url(#${id})">`
            + (p.behind.kind === 'sun'
                ? `<path d="${p.behind.d}" fill="${ink('sun')}"/><path d="${p.behind.rays}" stroke="${ink('sun')}" stroke-width="1.7" stroke-linecap="round" fill="none"/>`
                : `<path d="${p.behind.d}" fill="${ink('moon')}"/>`)
            + '</g>';
    }
    if (p.sun) body += `<path d="${p.sun.d}" fill="${ink('sun')}"/><path d="${p.sun.rays}" stroke="${ink('sun')}" stroke-width="1.9" stroke-linecap="round" fill="none"/>`;
    if (p.moon) body += `<path d="${p.moon}" fill="${ink('moon')}"/>`;
    if (p.cloud) body += `<path d="${p.cloud}" fill="${ink(cloudTone)}"/>`;
    if (p.rain) body += `<path d="${p.rain}" stroke="${ink('rain')}" stroke-width="2" stroke-linecap="round" fill="none"/>`;
    if (p.snow) body += p.snow.dots ? `<path d="${p.snow.d}" fill="${ink('rain')}"/>` : `<path d="${p.snow.d}" stroke="${ink('rain')}" stroke-width="1.5" stroke-linecap="round" fill="none"/>`;
    if (p.bolt) body += `<path d="${p.bolt}" fill="${ink('bolt')}"/>`;
    if (p.lines) body += `<path d="${p.lines}" stroke="${ink(cloudTone)}" stroke-width="2" stroke-linecap="round" fill="none"/>`;
    if (p.alert) {
        // A warning: a rounded triangle with its mark cut out
        const id = `fcg${++uid}`;
        body += `<mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24"><rect width="24" height="24" fill="#fff"/><path d="M12 9.2v4.6" stroke="#000" stroke-width="2.1" stroke-linecap="round"/><circle cx="12" cy="17" r="1.25" fill="#000"/></mask>`
            + `<path mask="url(#${id})" d="M10.3 3.9a2 2 0 0 1 3.4 0l7.6 13.4a2 2 0 0 1-1.7 3H4.4a2 2 0 0 1-1.7-3Z" fill="${ink('cloud')}"/>`;
    }
    return `<svg class="${cls}" data-g="${key}" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** The tint a glyph's main mark takes: what a repeat is compared on */
export function glyphSignature(condition: string | undefined, isDay: boolean, tints: Tints | null): string {
    const key = glyphKey(condition, isDay);
    return `${key}|${tints ? (DRAW[key].sun ? tints.sun : DRAW[key].moon ? tints.moon : tints[OVERCAST.has(key) ? 'grey' : 'cloud']) : ''}`;
}
