// The mark: weather behind the glass. The sky and the sun (or the moon) behind one
// pane of glass with the card's hairline etched across it; the sun crosses the pane's
// corner, sharp outside and frosted inside. Drawn in a 64 grid for the top bar's 26 px,
// so it leaves out the full icon's rain, which turns to noise this small.
//
// The skies are the card's own (src/sky.ts), one per time of day. Every sky is in the
// markup; CSS shows the one <html data-logo> names, which the pages' head script sets from
// the clock before the first paint and the demo updates from the visitor's real sun, on the
// card's dissolve. The sun's rise into the corner is a CSS animation too (demo.css).

/** iOS icons follow a superellipse closely: straight sides, continuous corners */
function superellipse(n, cx, cy, rx, ry, steps = 96) {
    return Array.from({ length: steps }, (_, i) => {
        const t = (i / steps) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
        const x = cx + rx * Math.sign(c) * Math.abs(c) ** (2 / n);
        const y = cy + ry * Math.sign(s) * Math.abs(s) ** (2 / n);
        return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
    }).join('') + 'Z';
}

const TILE = superellipse(5, 32, 32, 32, 32);
const PANE = { x: 26.9, y: 36.3, r: 17.5 };
const PANE_PATH = superellipse(4.2, PANE.x, PANE.y, PANE.r, PANE.r);
const SUN = { x: 43.8, y: 19.9, r: 7.4 };
const HAIRLINE = { y: 41.2, from: 13.8, to: 40 };

/** Zenith, middle and horizon for each time of day, and what the light is */
export const LOGO_SKIES = {
    day: { stops: ['oklch(0.385 0.13 260)', 'oklch(0.48 0.128 251)', 'oklch(0.66 0.1 234)'], moon: false },
    dawn: { stops: ['oklch(0.4 0.09 268)', 'oklch(0.55 0.07 330)', 'oklch(0.78 0.08 45)'], moon: false },
    dusk: { stops: ['oklch(0.32 0.09 288)', 'oklch(0.47 0.095 342)', 'oklch(0.72 0.13 55)'], moon: false },
    night: { stops: ['oklch(0.16 0.04 274)', 'oklch(0.22 0.05 268)', 'oklch(0.33 0.06 256)'], moon: true },
};
export const LOGO_PHASES = Object.keys(LOGO_SKIES);

/**
 * The mark's SVG. `id` keeps its gradients apart from another copy's. With `only`, just that
 * time of day, drawn to stand alone (the favicon); without it, every sky, for CSS to choose.
 */
export function logoSvg({ only = null, id = 'logo', className = '', label = '' } = {}) {
    const phase = only ?? 'day';
    const p = (name) => `${id}-${name}`;
    const phases = only ? [only] : LOGO_PHASES;
    const skies = phases.map(name => `
        <linearGradient id="${p(`sky-${name}`)}" x1="0" y1="0" x2="10" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${LOGO_SKIES[name].stops[0]}"/><stop offset="0.55" stop-color="${LOGO_SKIES[name].stops[1]}"/><stop offset="1" stop-color="${LOGO_SKIES[name].stops[2]}"/>
        </linearGradient>`).join('');
    const skyLayers = phases.map(name => `<rect class="logo-sky" data-sky="${name}" width="64" height="64" fill="url(#${p(`sky-${name}`)})"/>`).join('');
    // The light: a sun that gives off light, or a bright crescent. Standing alone, only the one
    // that time of day has; in the top bar, both, for CSS to choose.
    const night = only && LOGO_SKIES[only].moon;
    // Each with its own glow: the sun's bright and pale, the moon's dimmer and cooler
    const light = `
        ${only && night ? '' : `<g class="logo-sun"><circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r * 1.7}" fill="url(#${p('glow')})"/><circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r}" fill="url(#${p('disc')})"/></g>`}
        ${only && !night ? '' : `<g class="logo-moon"><circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r * 1.5}" fill="url(#${p('moonglow')})"/><circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r * 0.86}" fill="oklch(0.98 0.008 262)" mask="url(#${p('crescent')})"/></g>`}`;
    return `<svg ${only ? 'xmlns="http://www.w3.org/2000/svg" ' : ''}${className ? `class="${className}" ` : ''}viewBox="0 0 64 64"${label ? ` role="img" aria-label="${label}"` : ' aria-hidden="true"'}>
        <defs>
            <clipPath id="${p('tile')}"><path d="${TILE}"/></clipPath>
            <clipPath id="${p('pane')}"><path d="${PANE_PATH}"/></clipPath>
            ${skies}
            <radialGradient id="${p('glow')}" cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r * 1.7}" gradientUnits="userSpaceOnUse">
                <stop offset="0.58" stop-color="oklch(0.95 0.035 212 / 0.75)"/><stop offset="1" stop-color="oklch(0.95 0.035 212 / 0)"/>
            </radialGradient>
            <radialGradient id="${p('moonglow')}" cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r * 1.5}" gradientUnits="userSpaceOnUse">
                <stop offset="0.5" stop-color="oklch(0.82 0.03 255 / 0.45)"/><stop offset="1" stop-color="oklch(0.82 0.03 255 / 0)"/>
            </radialGradient>
            <radialGradient id="${p('disc')}" cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r}" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#fffef9"/><stop offset="0.5" stop-color="#fff4d2"/><stop offset="0.86" stop-color="oklch(0.9 0.12 88)"/><stop offset="1" stop-color="oklch(0.855 0.135 82)"/>
            </radialGradient>
            <mask id="${p('crescent')}"><rect width="64" height="64" fill="#fff"/><circle cx="${SUN.x + 3}" cy="${SUN.y - 2.4}" r="${SUN.r * 0.7}" fill="#000"/></mask>
            <!-- The pane's rim: bright on the edges that face the light, fainter on the far ones -->
            <linearGradient id="${p('rim')}" x1="${PANE.x + PANE.r}" y1="${PANE.y - PANE.r}" x2="${PANE.x - PANE.r}" y2="${PANE.y + PANE.r}" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="oklch(1 0 0 / 0.95)"/><stop offset="1" stop-color="oklch(1 0 0 / 0.3)"/>
            </linearGradient>
            <linearGradient id="${p('veil')}" x1="${PANE.x - PANE.r}" y1="${PANE.y - PANE.r}" x2="${PANE.x + PANE.r}" y2="${PANE.y + PANE.r}" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="oklch(0.97 0.012 235 / 0.34)"/><stop offset="1" stop-color="oklch(0.97 0.012 235 / 0.18)"/>
            </linearGradient>
            <filter id="${p('frost')}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.1"/></filter>
            <filter id="${p('shadow')}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="1.4"/></filter>
        </defs>
        <g clip-path="url(#${p('tile')})">
            ${skyLayers}
            <g class="logo-light">${light}</g>
            <path d="${PANE_PATH}" fill="oklch(0.18 0.07 260 / 0.38)" transform="translate(-1.2 1.6)" filter="url(#${p('shadow')})"/>
            <g clip-path="url(#${p('pane')})">
                <g transform="translate(${PANE.x} ${PANE.y}) scale(1.05) translate(${-PANE.x} ${-PANE.y})">
                    ${skyLayers}
                    <g class="logo-light" filter="url(#${p('frost')})">${light}</g>
                </g>
                <path d="${PANE_PATH}" fill="url(#${p('veil')})"/>
                <path d="M${HAIRLINE.from} ${HAIRLINE.y}H${HAIRLINE.to}" stroke="oklch(1 0 0 / 0.6)" stroke-width="0.6" stroke-linecap="round"/>
            </g>
            <path class="logo-rim" d="${PANE_PATH}" fill="none" stroke="url(#${p('rim')})" stroke-width="1.1"/>
        </g>
    </svg>`;
}
