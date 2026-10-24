// C. Behind the glass. Weather moves behind the words: the sky, the sun and the rain behind
// one pane of glass. The pane has thickness: frosted in its body, lensing at its edges, a rim
// lit by the sun, the card's hairline etched across it. The sun crosses its corner.
import { SKIES, ids, skyDefs, skyLayer, grainLayer, lightBody, stars, shadowFilter, rimFilter, superellipse, tile, alpha } from './kit.js';

const P = { x: 150, y: 300, w: 560, h: 560 };              // the pane
const PC = { x: P.x + P.w / 2, y: P.y + P.h / 2 };
const PANE = superellipse(4.2, 160, PC.x, PC.y, P.w / 2, P.h / 2);
const INSET = superellipse(4.2, 160, PC.x, PC.y, P.w / 2 - 30, P.h / 2 - 30);

export function behind({ sky = 'day', size = 512 } = {}) {
    const s = SKIES[sky];
    const id = ids();
    const light = s.body === 'moon' ? { x: 700, y: 320, r: 96, bloom: 520 } : { x: 700, y: 318, r: 118, bloom: 600 };
    const toward = (() => { const dx = light.x - PC.x, dy = light.y - PC.y, l = Math.hypot(dx, dy); return { x: dx / l, y: dy / l }; })();

    // The weather behind: rain at the card's angle, near and far
    // Near drops are longer, brighter and thicker; far ones short and faint
    const drops = [[170, 120, 1], [330, 80, 0.55], [470, 170, 0.75], [250, 260, 0.45], [880, 540, 1], [820, 720, 0.6], [940, 800, 0.4], [580, 110, 0.4], [110, 440, 0.6], [960, 400, 0.45]];
    const rain = drops.map(([x, y, k]) => `<path d="M${x} ${y}l${-46 * k} ${110 * k}" stroke="${alpha(s.light, 0.35 + 0.55 * k)}" stroke-width="${5 + 7 * k}" stroke-linecap="round"/>`).join('');
    const scene = `${skyLayer(id)}${s.stars ? stars(s.light, light, [60, 60, 964, 980]) : ''}${rain}${lightBody(id, s, light)}`;
    // Frosting this strong hides fine detail: through the pane only the sky and the light come through.
    // The sky's gradients are smooth already; blurring them only bands them, so only the light is frosted.
    const seenSky = skyLayer(id);
    const seenLight = lightBody(id, s, light);

    const defs = `
        ${skyDefs(id, s, light)}
        <clipPath id="${id('pane')}"><path d="${PANE}"/></clipPath>
        <mask id="${id('band')}"><path d="${PANE}" fill="#fff"/><path d="${INSET}" fill="#000"/></mask>
        <filter id="${id('frost')}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16"/></filter>
        <filter id="${id('edgeblur')}" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="9"/></filter>
        ${shadowFilter(id, 'shadow', s.shadow, (-toward.x * 26).toFixed(1), (-toward.y * 26 + 10).toFixed(1), 22, 0.45)}
        ${rimFilter(id, 'rim', s.light, s.edge, toward, 4, 9, 0.4)}
        <linearGradient id="${id('veil')}" x1="${P.x}" y1="${P.y}" x2="${P.x + P.w}" y2="${P.y + P.h}" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="${alpha(s.glass, 0.34)}"/><stop offset="1" stop-color="${alpha(s.glass, 0.18)}"/>
        </linearGradient>`;

    // Through the pane: the scene frosted and a little magnified; at its edges, magnified more, as thick glass bends it
    const through = `
        <g clip-path="url(#${id('pane')})">
            <g transform="translate(${PC.x} ${PC.y}) scale(1.05) translate(${-PC.x} ${-PC.y})">${seenSky}<g filter="url(#${id('frost')})">${seenLight}</g></g>
            <g mask="url(#${id('band')})"><g transform="translate(${PC.x} ${PC.y}) scale(1.08) translate(${-PC.x} ${-PC.y})">${seenSky}<g filter="url(#${id('edgeblur')})">${seenLight}</g></g></g>
            <path d="${PANE}" fill="url(#${id('veil')})"/>
            <path d="M${P.x + 70} ${P.y + P.h * 0.64}H${P.x + P.w - 70}" stroke="oklch(1 0 0 / 0.6)" stroke-width="5" stroke-linecap="round"/>
            <path d="M${P.x + 70} ${P.y + P.h * 0.64 + 4}H${P.x + P.w - 70}" stroke="${alpha(s.edge, 0.25)}" stroke-width="3" stroke-linecap="round"/>
        </g>`;

    const body = `
        ${scene}
        <g filter="url(#${id('shadow')})"><path d="${PANE}" fill="#000"/></g>
        ${through}
        <g filter="url(#${id('rim')})"><path d="${PANE}" fill="#fff"/></g>
        ${grainLayer(id)}`;
    return tile(id, defs, body, size);
}
