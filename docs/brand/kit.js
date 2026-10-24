// Shared by the three icons: the shape, the card's skies, and the filters they're finished with.

/** iOS icons follow a superellipse closely: straight sides, continuous corners */
export function superellipse(n = 5, steps = 200, cx = 512, cy = 512, rx = 512, ry = 512) {
    return Array.from({ length: steps }, (_, i) => {
        const t = (i / steps) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
        const x = cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n);
        const y = cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n);
        return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join('') + 'Z';
}
export const SHAPE = superellipse();

/** A colour with its alpha changed: 'oklch(… / 0.5)' or 'oklch(…)' → alpha a */
export const alpha = (color, a) => color.includes('/') ? color.replace(/\/ [\d.]+\)/, `/ ${a})`) : color.replace(/\)$/, ` / ${a})`);

/**
 * The card's skies (sky.ts), pushed a touch for an icon, plus what each icon needs around them:
 * the light (sun or moon), the ground below a horizon, and the room a pane glows in.
 */
export const SKIES = {
    day: {
        zenith: 'oklch(0.385 0.13 260)', mid: 'oklch(0.48 0.128 251)', horizon: 'oklch(0.66 0.1 234)',
        depth: 'oklch(0.3 0.11 264 / 0.5)', glow: 'oklch(0.95 0.035 212 / 0.75)', bloom: 'oklch(0.86 0.08 222 / 0.5)',
        body: 'sun', disc: ['#fffef9', '#fff4d2', 'oklch(0.9 0.12 88)', 'oklch(0.855 0.135 82)'], light: 'oklch(0.99 0.02 92)',
        ground: ['oklch(0.33 0.085 258)', 'oklch(0.16 0.04 270)'], glint: 'oklch(0.93 0.09 86)',
        room: ['oklch(0.21 0.03 262)', 'oklch(0.12 0.02 272)'], spill: 'oklch(0.55 0.11 245 / 0.5)',
        glass: 'oklch(0.97 0.012 235)', edge: 'oklch(0.55 0.08 250)', shadow: 'oklch(0.2 0.08 260)', stars: 0,
    },
    dusk: {
        zenith: 'oklch(0.32 0.09 288)', mid: 'oklch(0.47 0.095 342)', horizon: 'oklch(0.72 0.13 55)',
        depth: 'oklch(0.24 0.08 292 / 0.5)', glow: 'oklch(0.93 0.07 62 / 0.75)', bloom: 'oklch(0.82 0.12 50 / 0.55)',
        body: 'sun', disc: ['#fff8ec', 'oklch(0.94 0.08 72)', 'oklch(0.82 0.15 55)', 'oklch(0.74 0.16 44)'], light: 'oklch(0.94 0.1 62)',
        ground: ['oklch(0.3 0.08 300)', 'oklch(0.15 0.04 290)'], glint: 'oklch(0.86 0.14 55)',
        room: ['oklch(0.2 0.035 300)', 'oklch(0.11 0.02 290)'], spill: 'oklch(0.6 0.13 30 / 0.5)',
        glass: 'oklch(0.96 0.02 40)', edge: 'oklch(0.5 0.08 330)', shadow: 'oklch(0.18 0.07 300)', stars: 0,
    },
    night: {
        zenith: 'oklch(0.16 0.04 274)', mid: 'oklch(0.22 0.05 268)', horizon: 'oklch(0.33 0.06 256)',
        depth: 'oklch(0.1 0.03 276 / 0.55)', glow: 'oklch(0.82 0.03 255 / 0.4)', bloom: 'oklch(0.6 0.05 252 / 0.32)',
        body: 'moon', disc: ['oklch(1 0 0)', 'oklch(0.985 0.008 262)', 'oklch(0.95 0.014 258)', 'oklch(0.9 0.02 256)'], light: 'oklch(0.93 0.03 255)',
        ground: ['oklch(0.18 0.045 266)', 'oklch(0.09 0.02 275)'], glint: 'oklch(0.9 0.025 255)',
        room: ['oklch(0.15 0.025 270)', 'oklch(0.08 0.015 276)'], spill: 'oklch(0.4 0.07 255 / 0.45)',
        glass: 'oklch(0.94 0.015 255)', edge: 'oklch(0.45 0.05 260)', shadow: 'oklch(0.05 0.02 276)', stars: 1,
    },
    // iOS's dark appearance: the same layers on a dark ground
    dark: {
        zenith: 'oklch(0.16 0.025 265)', mid: 'oklch(0.14 0.022 266)', horizon: 'oklch(0.24 0.035 252)',
        depth: 'oklch(0.07 0.02 270 / 0.5)', glow: 'oklch(0.75 0.04 235 / 0.4)', bloom: 'oklch(0.5 0.06 240 / 0.35)',
        body: 'sun', disc: ['#fffef9', '#fff4d2', 'oklch(0.9 0.12 88)', 'oklch(0.855 0.135 82)'], light: 'oklch(0.97 0.04 88)',
        ground: ['oklch(0.13 0.02 262)', 'oklch(0.06 0.01 270)'], glint: 'oklch(0.9 0.1 86)',
        room: ['oklch(0.12 0.015 265)', 'oklch(0.06 0.01 270)'], spill: 'oklch(0.4 0.06 245 / 0.4)',
        glass: 'oklch(0.94 0.008 245)', edge: 'oklch(0.42 0.03 250)', shadow: 'oklch(0.03 0.01 270)', stars: 0,
    },
    // iOS's tinted appearance: one tone, which the system colours
    tinted: {
        zenith: 'oklch(0.2 0 0)', mid: 'oklch(0.17 0 0)', horizon: 'oklch(0.27 0 0)',
        depth: 'oklch(0.08 0 0 / 0.5)', glow: 'oklch(0.9 0 0 / 0.4)', bloom: 'oklch(0.6 0 0 / 0.3)',
        body: 'sun', disc: ['oklch(1 0 0)', 'oklch(0.97 0 0)', 'oklch(0.9 0 0)', 'oklch(0.83 0 0)'], light: 'oklch(0.97 0 0)',
        ground: ['oklch(0.15 0 0)', 'oklch(0.07 0 0)'], glint: 'oklch(0.92 0 0)',
        room: ['oklch(0.13 0 0)', 'oklch(0.06 0 0)'], spill: 'oklch(0.45 0 0 / 0.4)',
        glass: 'oklch(0.94 0 0)', edge: 'oklch(0.42 0 0)', shadow: 'oklch(0.03 0 0)', stars: 0,
    },
};

let uid = 0;
/** Ids unique to one icon, so several on one page don't share gradients */
export function ids() {
    uid += 1;
    const n = uid;
    return (name) => `${name}-${n}`;
}

/** The sky in a box: zenith to horizon, deeper away from the light, the light's bloom, grain */
export function skyDefs(id, s, light, top = 0, bottom = 1024) {
    return `
        <linearGradient id="${id('sky')}" x1="0" y1="${top}" x2="160" y2="${bottom}" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${s.zenith}"/><stop offset="0.55" stop-color="${s.mid}"/><stop offset="1" stop-color="${s.horizon}"/>
        </linearGradient>
        <radialGradient id="${id('depth')}" cx="-80" cy="${top - 100}" r="860" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${s.depth}"/><stop offset="1" stop-color="${alpha(s.depth, 0)}"/>
        </radialGradient>
        <radialGradient id="${id('bloom')}" cx="${light.x}" cy="${light.y}" r="${light.bloom ?? 560}" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${s.bloom}"/><stop offset="1" stop-color="${alpha(s.bloom, 0)}"/>
        </radialGradient>
        <radialGradient id="${id('glow')}" cx="${light.x}" cy="${light.y}" r="${light.r * 1.7}" gradientUnits="userSpaceOnUse">
            <stop offset="0.58" stop-color="${s.glow}"/><stop offset="1" stop-color="${alpha(s.glow, 0)}"/>
        </radialGradient>
        <radialGradient id="${id('disc')}" cx="${light.x}" cy="${light.y}" r="${light.r}" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${s.disc[0]}"/><stop offset="0.5" stop-color="${s.disc[1]}"/><stop offset="0.86" stop-color="${s.disc[2]}"/><stop offset="1" stop-color="${s.disc[3]}"/>
        </radialGradient>
        <mask id="${id('crescent')}"><rect x="-200" y="-200" width="1424" height="1424" fill="#fff"/><circle cx="${light.x + light.r * 0.42}" cy="${light.y - light.r * 0.32}" r="${light.r * 0.84}" fill="#000"/></mask>
        <filter id="${id('grain')}" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7"/>
            <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.09 0"/>
        </filter>`;
}

/** The sky's layers, in a box */
export function skyLayer(id, x = 0, y = 0, w = 1024, h = 1024) {
    return `
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id('sky')})"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id('depth')})"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id('bloom')})"/>`;
}
export const grainLayer = (id) => `<rect width="1024" height="1024" filter="url(#${id('grain')})" style="mix-blend-mode: soft-light"/>`;

/** The light itself: a sun that gives off light, or a bright crescent moon, on a pale glow of air */
export function lightBody(id, s, light) {
    const glow = `<circle cx="${light.x}" cy="${light.y}" r="${light.r * 1.7}" fill="url(#${id('glow')})"/>`;
    if (s.body === 'moon') {
        return `${glow}<circle cx="${light.x}" cy="${light.y}" r="${light.r}" fill="oklch(0.9 0.02 260 / 0.1)"/><circle cx="${light.x}" cy="${light.y}" r="${light.r}" fill="url(#${id('disc')})" mask="url(#${id('crescent')})"/>`;
    }
    return `${glow}<circle cx="${light.x}" cy="${light.y}" r="${light.r}" fill="url(#${id('disc')})"/>`;
}

/** Faint stars for the night sky, kept clear of a point */
export function stars(color, avoid, region = [60, 60, 964, 560]) {
    const pts = [[150, 170, 3.2], [260, 110, 2.4], [400, 210, 2.8], [120, 330, 2.2], [880, 150, 3], [930, 300, 2.3], [330, 390, 2], [800, 420, 2.4], [560, 130, 2.6], [690, 90, 2]];
    return pts.filter(([x, y]) => y < region[3] && Math.hypot(x - avoid.x, y - avoid.y) > avoid.r * 2.2)
        .map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${alpha(color, 0.85)}"/>`).join('');
}

/** A soft shadow, tinted by the sky, cast in a direction, never under the shape itself */
export function shadowFilter(id, name, color, dx, dy, blur = 18, opacity = 0.5) {
    return `
        <filter id="${id(name)}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="soft"/>
            <feOffset in="soft" dx="${dx}" dy="${dy}" result="cast"/>
            <feFlood flood-color="${color}" flood-opacity="${opacity}"/>
            <feComposite in2="cast" operator="in" result="tint"/>
            <feGaussianBlur in="SourceAlpha" stdDeviation="${blur / 4}" result="tight"/>
            <feOffset in="tight" dx="${dx / 4}" dy="${dy / 4}" result="contact"/>
            <feFlood flood-color="${color}" flood-opacity="${opacity * 0.6}"/>
            <feComposite in2="contact" operator="in" result="contactTint"/>
            <feMerge result="both"><feMergeNode in="tint"/><feMergeNode in="contactTint"/></feMerge>
            <feComposite in="both" in2="SourceAlpha" operator="out"/>
        </filter>`;
}

/**
 * Glass rims for a shape: a crisp bright band on the edges facing the light, a softer
 * cool one on the far edges. `toward` is a unit vector pointing at the light.
 */
export function rimFilter(id, name, light, edge, toward, near = 3.4, far = 6, farOpacity = 0.36) {
    return `
        <filter id="${id(name)}" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
            <feOffset in="SourceAlpha" dx="${(-toward.x * near).toFixed(1)}" dy="${(-toward.y * near).toFixed(1)}" result="awayFromLight"/>
            <feComposite in="SourceAlpha" in2="awayFromLight" operator="out" result="nearBand"/>
            <feGaussianBlur in="nearBand" stdDeviation="0.9" result="nearSoft"/>
            <feFlood flood-color="${light}" flood-opacity="1"/>
            <feComposite in2="nearSoft" operator="in"/>
            <feComposite in2="SourceAlpha" operator="in" result="shine"/>
            <feOffset in="SourceAlpha" dx="${(toward.x * far).toFixed(1)}" dy="${(toward.y * far).toFixed(1)}" result="towardLight"/>
            <feComposite in="SourceAlpha" in2="towardLight" operator="out" result="farBand"/>
            <feGaussianBlur in="farBand" stdDeviation="2.5" result="farSoft"/>
            <feFlood flood-color="${edge}" flood-opacity="${farOpacity}"/>
            <feComposite in2="farSoft" operator="in"/>
            <feComposite in2="SourceAlpha" operator="in" result="rim"/>
            <feMerge><feMergeNode in="rim"/><feMergeNode in="shine"/></feMerge>
        </filter>`;
}

/** Wrap an icon's layers in the tile, with the faint rim iOS draws round every icon */
export function tile(id, defs, body, size) {
    return `<svg viewBox="0 0 1024 1024" width="${size}" height="${size}" aria-hidden="true">
        <defs><clipPath id="${id('tile')}"><path d="${SHAPE}"/></clipPath>${defs}</defs>
        <g clip-path="url(#${id('tile')})">${body}</g>
        <path d="${SHAPE}" fill="none" stroke="#fff" stroke-opacity="0.14" stroke-width="3" clip-path="url(#${id('tile')})"/>
    </svg>`;
}
