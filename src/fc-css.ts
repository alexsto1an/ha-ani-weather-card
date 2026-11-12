// Everything the forecast and the clock add to a card's look. Hex and rgba
// only (older wall-tablet WebViews can't parse oklch()); in motion,
// transform and opacity only. The type is the card's own grammar
// (CONCLUSIONS 7): one hero, a sentence tier, figures, the quiet tier and
// an 11 px label tier, and nothing smaller.

import { CURVE, css } from './fc-core';
import { ROW_MOTION } from './fc-row';

const OUT = css(CURVE.out), IN = css(CURVE.in), PRESS = css(CURVE.press);

/** The hourly row, its chips and the daily list: one sheet for every surface */
const PARTS = `
.fc-hourly { position: relative; }
.fc-hourly[hidden], .fc-chips[hidden], .fc-daily[hidden] { display: none !important; }
/* The row bleeds through the card's padding: an hour leaves and arrives across an 18 px fade, never a half icon in the margin */
.fc-clip {
  position: relative; overflow: hidden; margin: 0 calc(-1 * var(--fc-bleed, var(--awc-pad, 20px))); padding: 0 var(--fc-bleed, var(--awc-pad, 20px));
  -webkit-mask-image: linear-gradient(90deg, transparent calc(var(--fc-bleed, var(--awc-pad, 20px)) - 14px), #000 calc(var(--fc-bleed, var(--awc-pad, 20px)) + 4px), #000 calc(100% - var(--fc-bleed, var(--awc-pad, 20px)) - 4px), transparent calc(100% - var(--fc-bleed, var(--awc-pad, 20px)) + 12px));
  mask-image: linear-gradient(90deg, transparent calc(var(--fc-bleed, var(--awc-pad, 20px)) - 14px), #000 calc(var(--fc-bleed, var(--awc-pad, 20px)) + 4px), #000 calc(100% - var(--fc-bleed, var(--awc-pad, 20px)) - 4px), transparent calc(100% - var(--fc-bleed, var(--awc-pad, 20px)) + 12px));
}
.fc-strip { position: relative; will-change: transform; }
.fc-cols { position: relative; height: var(--fc-cols-h, 42px); }
.fc-col { position: absolute; top: 0; width: var(--fc-pitch); display: grid; justify-items: center; row-gap: var(--fc-glyph-gap, 6px); }
.fc-hr { font-size: var(--fc-label, 11px); line-height: var(--fc-label-lh, 14px); font-weight: 600; letter-spacing: 0.04em; font-variant-numeric: tabular-nums; white-space: nowrap; min-height: var(--fc-label-lh, 14px); }
.fc-hr .awc-ampm { font-size: max(11px, 1em); font-weight: 500; letter-spacing: 0.02em; margin-left: 0.2em; }
/* Midnight: the day's name in the hour's place, and a hairline on the day's boundary. Never a pill: white is selection. */
.fc-col.fc-mid::before { content: ''; position: absolute; left: 0; top: 0; width: 1px; height: var(--fc-mid-h, 100px); background: currentColor; opacity: 0.2; }
.fc-g { display: block; line-height: 0; }
.fc-glyph { display: block; overflow: visible; }
/* An hour whose mark and light repeat its neighbour's is quieter, so a settled day isn't six equal marks */
.fc-g.fc-rep { opacity: 0.6; }
.fc-plot { display: block; overflow: visible; margin-top: var(--fc-plot-gap, 4px); }
.fc-line { fill: none; stroke: currentColor; stroke-width: var(--fc-stroke, 2px); stroke-linecap: round; stroke-linejoin: round; }
.fc-start { fill: currentColor; }
.fc-area { fill: currentColor; fill-opacity: 0.16; stroke: none; }
.fc-bars { fill: currentColor; }
.fc-base { fill: none; stroke: currentColor; stroke-width: 1px; stroke-opacity: 0.28; }
.fc-vals { position: absolute; left: 0; top: calc(var(--fc-cols-h, 42px) + var(--fc-plot-gap, 4px)); height: var(--fc-plot); width: 100%; pointer-events: none; }
.fc-val { position: absolute; left: 0; top: 0; white-space: nowrap; will-change: transform, opacity; font-size: var(--fc-value, 15px); line-height: var(--fc-value-lh, 20px); font-weight: var(--fc-value-w, 600); font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.fc-val .fc-pct { font-style: normal; font-size: 0.74em; font-weight: 600; margin-left: 0.04em; }
.fc-val .fc-u { font-style: normal; font-size: max(11px, 0.7em); font-weight: 500; letter-spacing: 0.02em; margin-left: 0.22em; }
/* The needle: the hour the sky is showing. A notch over the first column, there only while the row is away from now */
.fc-needle {
  position: absolute; left: calc(var(--fc-pitch) / 2 - 1px); top: -7px; width: 2px; height: 5px; border-radius: 1px; background: currentColor;
  opacity: 0; transform: scaleY(0.4); transform-origin: 50% 100%;
  transition: opacity 120ms ${OUT}, transform 160ms ${PRESS};
}
.fc-away .fc-needle { opacity: 1; transform: none; transition: opacity 160ms ${PRESS}, transform 160ms ${PRESS}; }
.fc-sr, .awc-sr { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; list-style: none; }

/* ── The chips: one white capsule, words beside it. No outline, no track, no glass. ── */
.fc-chips { position: relative; display: block; height: var(--fc-chip-h, 28px); margin-top: var(--fc-chips-gap, 10px); }
.fc-chips-row, .fc-chips-sel { display: flex; height: 100%; align-items: stretch; white-space: nowrap; }
.fc-chips-sel {
  position: absolute; inset: 0; pointer-events: none; background: currentColor; text-shadow: none;
  clip-path: inset(0 100% 0 0 round 999px); -webkit-clip-path: inset(0 100% 0 0 round 999px);
  transition: clip-path ${ROW_MOTION.select}ms ${IN}, -webkit-clip-path ${ROW_MOTION.select}ms ${IN};
}
.fc-chip {
  position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center; height: 100%; box-sizing: border-box;
  margin: 0; padding: 0 var(--fc-chip-pad, 12px); border: 0; border-radius: 999px; background: none; color: inherit; cursor: pointer;
  font: 600 var(--fc-chip-size, 13px)/18px var(--awc-font, inherit); letter-spacing: 0; -webkit-tap-highlight-color: transparent; outline: none;
  touch-action: pan-y pinch-zoom; text-shadow: inherit;
}
.fc-chips[data-level="2"] { --fc-chip-pad: 9px; }
.fc-chip > span { display: block; transition: transform 110ms ${PRESS}; }
.fc-chips-row .fc-chip > span { opacity: var(--fc-quiet, 0.8); }
.fc-chip.fc-press > span { transform: scale(0.97); }
/* 44 px in effect: the target reaches 8 px above and below the 28 px pill, and neighbours touch */
.fc-chips-row .fc-chip::after { content: ''; position: absolute; inset: -8px 0; }
.fc-chips-row .fc-chip:focus-visible { box-shadow: 0 0 0 2px var(--awc-sky-top, #16283f), 0 0 0 4px currentColor; }
.fc-chips-sel .fc-chip { color: var(--awc-sky-top, #16283f); cursor: default; text-shadow: none; }

/* ── The daily list ── */
.fc-daily { display: grid; row-gap: 0; }
.fc-day {
  display: grid; grid-template-columns: var(--fc-d-day, 40px) var(--fc-d-glyph, 20px) minmax(var(--fc-d-lo, 34px), 1fr) minmax(0, var(--fc-d-bar, 151px)) var(--fc-d-hi, 34px);
  column-gap: var(--fc-d-gap, 10px); align-items: center; height: var(--fc-d-row, 32px);
  font-size: var(--fc-d-size, 15px); line-height: var(--fc-d-lh, 20px); font-variant-numeric: tabular-nums; white-space: nowrap;
}
.fc-d-name { font-weight: 500; overflow: hidden; }
.fc-day[data-today] .fc-d-name { font-weight: 700; }
.fc-d-g { line-height: 0; }
.fc-d-lo { text-align: right; font-weight: 400; opacity: var(--fc-quiet, 0.8); }
.fc-d-hi { text-align: right; font-weight: 600; }
.fc-d-bar { position: relative; height: var(--fc-bar, 6px); }
.fc-d-ink { position: absolute; inset: 0; }
.fc-track { position: absolute; inset: 0; border-radius: 999px; background: currentColor; opacity: 0.2; }
.fc-fill { position: absolute; inset: 0; background-color: #f7fafe; }
.fc-dot { position: absolute; left: -4px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: #ffffff; will-change: transform; }

/* ── Theme palette: no sky, so no gradient (the ramp is 1.07:1 on white). One solid ink on the divider's colour. ── */
.theme-colors .fc-hr, .theme-colors .fc-d-lo, .theme-colors .fc-chips-row .fc-chip > span { color: var(--secondary-text-color); opacity: 1; }
.theme-colors .fc-chips-sel { background: var(--primary-text-color); }
.theme-colors .fc-chips-sel .fc-chip { color: var(--ha-card-background, var(--card-background-color, #fff)); }
.theme-colors .fc-chips-row .fc-chip:focus-visible { box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)), 0 0 0 4px var(--primary-color); }
.theme-colors .fc-glyph { color: var(--state-icon-color); }
.theme-colors .fc-track { background: var(--divider-color); opacity: 1; }
.theme-colors .fc-fill { background-color: var(--primary-text-color); background-image: none !important; }
.theme-colors .fc-dot { background: var(--primary-color); }
.theme-colors .fc-col.fc-mid::before { background: var(--divider-color); opacity: 1; }
.theme-colors .fc-base { stroke: var(--divider-color); stroke-opacity: 1; }
.theme-colors .fc-needle { background: var(--primary-color); }
`;

/** The slide: who owns the gesture, the sky stepping aside for the hand, the slider, the rail */
const SLIDE_CSS = `
/* Vertical pans and pinch stay the dashboard's; a sideways drag is the slide. A mouse pull selects no text. */
.animated-weather-card[data-fc], .animated-weather-card[data-slide] { touch-action: pan-y pinch-zoom; -webkit-user-select: none; user-select: none; }
/* Under a finger the slide drives these, so the card's own dissolves step aside */
.animated-weather-card.awc-pulling { transition: none !important; }
.animated-weather-card.awc-pulling .sun-track,
.animated-weather-card:is(.awc-pulling, .awc-warm) .animation-container { transition: none !important; }
.animated-weather-card.awc-pulling .sun-track .sun { opacity: var(--awc-pull-sun, 1) !important; transition: none !important; }
.animated-weather-card.awc-pulling :is(.rain-layer, .snow-layer, .sleet-layer) { opacity: 1 !important; }
/* The slider, for keys and screen readers, covers its ruler invisibly; its focus shows as a ring */
.awc-slider { position: absolute; inset: 0; outline: none; z-index: 2; pointer-events: none; }
.awc-slider:focus-visible { box-shadow: 0 0 0 2px currentColor; border-radius: 8px; }
.weather-attributes > .awc-slider { top: -20px; bottom: auto; height: 40px; left: calc(-1 * var(--awc-pad) + 8px); right: calc(-1 * var(--awc-pad) + 8px); }
.awc-ampm { font-size: max(11px, 0.7em); font-weight: 500; letter-spacing: 0.02em; margin-left: 0.15em; }

/* The rail: where no row is shown, the divider is the ruler, at 25.9 px an hour */
.awc-rail { position: absolute; pointer-events: none; height: 40px; }
.awc-rail.in-divider { top: -16px; left: calc(-1 * var(--awc-pad)); right: calc(-1 * var(--awc-pad)); }
.awc-rail.in-info { left: 0; right: 0; bottom: 0; height: 16px; }
.awc-rail.in-strip { left: 0; right: 0; bottom: 0; height: 16px; opacity: 0; transition: opacity 120ms ${OUT}; }
:is(.awc-dial, .awc-focus, .awc-pulling) .awc-rail:is(.in-strip, .in-info) { opacity: 1; transition: opacity 160ms ${IN}; }
.awc-ticks {
  position: absolute; inset: 0; overflow: hidden;
  -webkit-mask-image: linear-gradient(90deg, transparent 2px, #000 calc(var(--awc-pad) - 2px), #000 calc(100% - var(--awc-pad)), transparent calc(100% - 4px));
  mask-image: linear-gradient(90deg, transparent 2px, #000 calc(var(--awc-pad) - 2px), #000 calc(100% - var(--awc-pad)), transparent calc(100% - 4px));
}
.awc-ruler { position: absolute; left: var(--awc-pad); top: 16px; width: 0; height: 0; will-change: transform; }
.awc-rail:is(.in-strip, .in-info) .awc-ruler { top: 8px; }
.awc-run { position: absolute; top: -1px; height: 2px; border-radius: 1px; opacity: 0.9; background: linear-gradient(90deg, transparent, currentColor 10px, currentColor calc(100% - 10px), transparent); }
.awc-tick { position: absolute; top: -3px; width: 1px; height: 6px; margin-left: -0.5px; background: currentColor; opacity: 0; transition: opacity 80ms ${OUT}; }
.awc-tick.major { top: -5px; height: 10px; }
/* Now: a 2 × 9 px notch at the text's left edge; pulled, it scales into the needle */
.awc-needle { position: absolute; left: var(--awc-pad); top: 12px; width: 2px; height: 9px; margin-left: -1px; transform-origin: 50% 44.4%; transition: transform 160ms ${PRESS}; }
.awc-rail:is(.in-strip, .in-info) .awc-needle { top: 3px; }
.awc-needle i { position: absolute; inset: 0; border-radius: 1px; background: currentColor; }
:is(.awc-dial, .awc-focus, .awc-pulling) .awc-needle { transform: scaleY(1.9); }
:is(.awc-dial, .awc-focus, .awc-pulling) .awc-tick { opacity: 0.6; transition: opacity 120ms ${IN} 40ms; }
:is(.awc-dial, .awc-focus, .awc-pulling) .awc-tick.major { opacity: 0.9; }
.awc-rail:is(.in-strip, .in-info)::before { content: ''; position: absolute; left: var(--awc-pad); right: var(--awc-pad); top: 8px; height: 1px; background: currentColor; opacity: 0.2; }
.theme-colors .awc-tick { color: var(--secondary-text-color); }
.theme-colors :is(.awc-run, .awc-needle) { color: var(--primary-color); }
`;

/** The weather card: the clock, the condition's line, the turning line, the section, the away line, the floor */
const CARD_CSS = `
/* ── The clock leads the location line: "13:10  Home". The time 15/20 weight 500 tabular at 0.94; the place weight 400 at 0.8, 8 px on, never nested. ── */
/* The place is tinted, so the line stops at 0.57 of a narrow card, where the tint still holds 4.5:1 (forecast-contrast.test.ts) */
.location:has(> .awc-clock) { opacity: 1; max-width: calc(57cqi - var(--awc-pad)); }
.location > .awc-clock { font-weight: 500; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; opacity: 0.94; }
.location > .awc-clock:not(:empty) + .awc-place { margin-left: 8px; font-weight: 400; opacity: var(--awc-secondary, 0.8); }
.awc-time { position: relative; display: inline-block; white-space: nowrap; vertical-align: baseline; }
.awc-time > i, .awc-old > i, .awc-new > i { font-style: normal; }
.awc-old { position: absolute; top: 0; white-space: nowrap; pointer-events: none; }
.compact-meta > .awc-clock:not(:empty) { font-weight: 500; font-variant-numeric: tabular-nums; margin-right: 8px; }
.theme-colors .location > .awc-clock:not(:empty) + .awc-place { color: var(--secondary-text-color); opacity: 1; }

/* ── The away line: the card shows another hour. "‹ Now  17:00  in 4 hr" in the location line's place, so the
   hero can never pass for now: the Now control, the hour, how far ahead. ── */
.awc-away { display: none; }
.animated-weather-card[data-awc-away] .awc-away { display: inline-flex; align-items: baseline; column-gap: 10px; white-space: nowrap; }
.animated-weather-card[data-awc-away="location"] .location > :not(.awc-away) { display: none; }
.animated-weather-card[data-awc-away="location"] .location { opacity: 1; overflow: visible; max-width: calc(57cqi - var(--awc-pad)); }
.awc-away .awc-rel[hidden] { display: none; }
.animated-weather-card[data-awc-away="desc"] .awc-away { margin-right: 12px; font-size: 15px; line-height: 20px; }
.awc-at { font-weight: 600; font-variant-numeric: tabular-nums; }
.awc-rel { font-weight: 400; opacity: var(--awc-secondary, 0.8); }
.awc-now {
  position: relative; display: inline-flex; align-items: center; gap: 5px; margin: 0; padding: 0 10px 0 8px; height: 22px; align-self: center;
  border: 0; border-radius: 999px; background: currentColor; cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent;
  font: 600 13px/18px var(--awc-font, inherit); text-shadow: none; transition: transform 110ms ${PRESS};
}
/* The capsule's label is the sky's own dark, like a selected chip's: white is selection, and now is what you go back to */
.awc-now { color: var(--awc-sky-top, #16283f); }
.awc-now i { width: 6px; height: 6px; border-left: 1.75px solid currentColor; border-bottom: 1.75px solid currentColor; transform: rotate(45deg); margin: 0 1px 0 2px; }
.awc-now::after { content: ''; position: absolute; inset: -11px -8px; }
.awc-now:active { transform: scale(0.97); }
.awc-now:focus-visible { box-shadow: 0 0 0 2px var(--awc-sky-top, #16283f), 0 0 0 4px var(--weather-text-color, #fff); }
.awc-now { background: var(--weather-text-color, #f7fafe); }
.theme-colors .awc-now { background: var(--primary-color); color: var(--text-primary-color, #fff); }
.theme-colors .awc-rel { color: var(--secondary-text-color); opacity: 1; }

/* ── The condition's line: H and L beside it, stopped where even full-strength text meets the light ── */
.awc-desc-row {
  display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 12px; margin-top: 8px; min-width: 0; white-space: nowrap;
  max-width: calc(74cqi - var(--awc-pad)); height: 22px; overflow: hidden;
}
@container awc (min-width: 460px) { .awc-desc-row { height: 24px; } }
@container awc (min-width: 640px) { .awc-desc-row { max-width: none; } }
.awc-desc-row > .weather-desc { margin-top: 0 !important; }
.animated-weather-card:is([data-height="short"], [data-height="tight"], [data-height="snug"], [data-height="close"]) .awc-desc-row { margin-top: 4px; }
.animated-weather-card[data-height="minimal"] .awc-desc-row { margin-top: 2px; }
.awc-companion { font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.006em; font-variant-numeric: tabular-nums; }
.awc-hl-pair + .awc-hl-pair { margin-left: 0.6em; }
.awc-hl-pair b { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; }
.awc-companion > [data-v] { display: none; }
.awc-companion[data-show="hl"] > [data-v="hl"], .awc-companion[data-show="line"] > [data-v="line"] { display: inline; }
/* Away: today's high and low and the line step out in place; the hour's chance takes their slot */
.animated-weather-card[data-awc-away] .awc-companion > [data-v] { display: none; }
.animated-weather-card[data-awc-away] .awc-companion > [data-v="chance"] { display: inline; }
/* The hour's word sits in a slot as wide as the widest word the hours hold, so the chance after it never moves */
.awc-cond { display: inline-block; min-width: var(--awc-cond-w, 0); }
.theme-colors .awc-hl-pair b { color: var(--secondary-text-color); }

/* ── The turning line leads the line under the condition, full strength (it runs toward the light); feels like is a chip now ── */
.hero-meta:has(> .awc-line:not(:empty)) { opacity: 1; }
.hero-meta > .awc-line { font-weight: 500; white-space: nowrap; }
.hero-meta:has(> .awc-line:not(:empty)) > .feels-like { display: none; }
.hero-meta:has(> .awc-line:not(:empty)) > :not(.awc-line) { opacity: var(--awc-secondary, 0.8); }
.animated-weather-card[data-fc]:is([data-height="compact"], [data-height="short"]) .hero-meta:has(> .awc-line:not(:empty)) { display: flex; }
.animated-weather-card[data-fc]:is([data-fc="row"], [data-fc="bare"]) .hero-meta { display: none !important; }
.theme-colors .hero-meta > .awc-line { color: var(--primary-text-color); }

/* ── The section: the hourly row and its chips, between the hero and the readings ── */
.fc-section { position: relative; flex: none; margin-top: auto; padding-top: var(--fc-sec-top, 0px); --fc-cols-h: 42px; --fc-mid-h: 90px; }
@container awc (min-width: 640px) { .fc-section { margin-top: 16px; align-self: flex-start; --fc-bleed: 20px; } }
.animated-weather-card:is([data-fc="none"], [data-fc="bare"]) .fc-section { display: none; }
.animated-weather-card:is([data-fc="row"], [data-fc="glyphs"]) .fc-section .fc-chips { display: none; }
.animated-weather-card[data-fc="row"] .fc-section .fc-g { display: none; }
.animated-weather-card[data-fc="row"] .fc-section { --fc-cols-h: 14px; }
/* With the row on, the readings lose their divider's gap to it: the row is the divider */
.animated-weather-card:is([data-fc="full"], [data-fc="glyphs"], [data-fc="row"]) .fc-section + .weather-attributes { margin-top: -4px; }

/* ── The floor: no cloud and no star behind the row's full-strength text. Clouds roam the whole sky above it, behind the
   hero's text as on today's card, and are born whole above it (data-cloud-band); the mask only guards the line. ── */
.animated-weather-card[data-cloud-band] .clouds-layer {
  -webkit-mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fc-floor-c, 100%) - 2px), transparent calc(var(--fc-floor-c, 100%) + 10px));
  mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fc-floor-c, 100%) - 2px), transparent calc(var(--fc-floor-c, 100%) + 10px));
}
.animated-weather-card[data-cloud-band] .stars-field {
  -webkit-mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fc-floor-s, 100%) - 14px), transparent var(--fc-floor-s, 100%));
  mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fc-floor-s, 100%) - 14px), transparent var(--fc-floor-s, 100%));
}

@media (prefers-reduced-motion: reduce) {
  .fc-chips-sel, .fc-chip > span, .fc-needle, .awc-needle, .awc-tick, .awc-now { transition-duration: 0.001ms !important; transition-delay: 0ms !important; }
}
`;

/** The forecast card and its strip */
const FCARD_CSS = `
/* The forecast card has no hero, so the card's own text steps out. One sun per stack, so no disc here: its light stays in
   the corner. Nothing with a core sits behind data: no clouds, no stars (the icons say them). Rain, snow and lightning pass behind. */
.animated-weather-card[data-fc-card] .weather-info > :not(.fc-fcard) { display: none !important; }
.animated-weather-card[data-fc-card] .weather-info { display: block; padding: 0; gap: 0; }
.animated-weather-card[data-fc-card] :is(.sun-track, .clouds-container, .stars-field, .moon-gsap, .stars-container) { display: none !important; }
/* The corner light: 30% × 34% at 94%, −12%, with a wider, fainter skirt so it has no edge */
.animated-weather-card[data-fc-card] .sky { --awc-sky-glow-layer: radial-gradient(30% 34% at 94% -12%, var(--awc-sky-glow), transparent 70%), radial-gradient(52% 56% at 94% -12%, var(--awc-sky-glow), transparent 78%); }
/* The strip sits under the compact weather card: the light is upstairs, and only spills over its top edge */
.animated-weather-card[data-fc-card][data-variant="compact"] .sky { --awc-sky-glow-layer: radial-gradient(70% 120% at 84% -90%, var(--awc-sky-glow), transparent 72%); }
.animated-weather-card[data-fc-card]:has(.fc-fcard[data-variant="wide"]) .sky { --awc-sky-glow-layer: radial-gradient(20% 70% at 55% -42%, var(--awc-sky-glow), transparent 72%); }
.fc-fcard { position: relative; box-sizing: border-box; height: 100%; padding: 18px var(--awc-pad) 0; --fc-bleed: var(--awc-pad); --fc-mid-h: 110px; --fc-cols-h: 42px; overflow: hidden; }
.fc-fcard[data-variant="regular"] { display: flex; flex-direction: column; }
/* The lead: the turning line at the forecast card's size (20/26, weight 500, full strength). Away from now it leads
   with the needle's hour, and the way home sits at its end. */
.fc-lead { position: relative; display: flex; align-items: center; height: 26px; margin-bottom: 14px; white-space: nowrap; }
/* Full strength holds to 0.75 of the width under the corner light */
.fc-sentence { font-size: 20px; line-height: 26px; font-weight: 500; letter-spacing: -0.012em; min-width: 0; max-width: calc(75cqi - var(--awc-pad)); overflow: hidden; }
.fc-sentence .fc-at { font-weight: 600; font-variant-numeric: tabular-nums; margin-right: 0.5em; }
.fc-sentence .awc-ampm { font-size: 0.7em; }
.fc-lead .fc-now { position: absolute; right: 0; top: 2px; opacity: 0; visibility: hidden; transition: opacity 120ms ${OUT}, visibility 0s linear 120ms, transform 110ms ${PRESS}; }
.fc-fcard.fc-away .fc-now { opacity: 1; visibility: visible; transition: opacity 160ms ${IN} 60ms, visibility 0s, transform 110ms ${PRESS}; }
.fc-fcard .fc-daily { margin-top: 14px; }
.fc-fcard[data-variant="regular"] .fc-daily { margin-top: auto; padding-bottom: 12px; }
.fc-day[hidden] { display: none; }
/* Wide: the hours on the left, the week on the right. Bars capped at 200 px: longer, a range reads as a progress bar. */
.fc-fcard[data-variant="wide"] { display: grid; grid-template-columns: minmax(0, 1fr) 320px; column-gap: 44px; padding-top: 20px; padding-bottom: 14px; }
.fc-fcard[data-variant="wide"] .fc-left { min-width: 0; --fc-bleed: 20px; }
.fc-fcard[data-variant="wide"] .fc-daily { margin-top: 0; align-self: center; --fc-d-row: 30px; --fc-d-bar: 200px; }
/* The strip: labels, icons and the line with its values. No chips, no words: the compact weather card above says now. */
.fc-fcard[data-variant="strip"] { padding-top: 16px; --fc-glyph-gap: 4px; --fc-cols-h: 36px; --fc-plot-gap: 2px; --fc-mid-h: 84px; }
.fc-fcard[data-variant="strip"] .fc-needle { top: -6px; }
.fc-empty { margin: 0; padding: 24px var(--awc-pad); font-size: 15px; line-height: 20px; opacity: var(--awc-secondary, 0.8); }
.theme-colors .fc-sentence { color: var(--primary-text-color); }
`;

/** The view's own look, inside the grown card */
const VIEW_CSS = `
.animated-weather-card[data-fc-view] .sky { --awc-sky-glow-layer: radial-gradient(48% 22% at 80% 5%, var(--awc-sky-glow), transparent 64%); }
.animated-weather-card[data-fc-view] .weather-info { padding: 0; gap: 0; display: flex; flex-direction: column; min-height: 0; overflow: visible; }
.animated-weather-card[data-fc-view] .weather-attributes { display: none !important; }
.animated-weather-card[data-fc-view] .main-weather-info { clip-path: none; }
.animated-weather-card[data-fc-view] .location { display: block !important; font-size: 17px; line-height: 22px; font-weight: 500; }
.animated-weather-card[data-fc-view] .temperature { font-size: 112px !important; font-weight: 200 !important; margin-top: 4px; letter-spacing: -0.045em; }
.animated-weather-card[data-fc-view] .awc-desc-row { height: 26px; margin-top: 10px !important; max-width: calc(65cqi - 24px); }
.animated-weather-card[data-fc-view] .weather-desc { font-size: 20px; line-height: 26px; }
.animated-weather-card[data-fc-view] .awc-companion { font-size: 17px; line-height: 22px; }
.animated-weather-card[data-fc-view] .hero-meta { display: flex !important; margin-top: 4px; font-size: 20px; line-height: 26px; letter-spacing: -0.012em; }
.fv-top { flex: none; position: relative; padding: 26px 24px 0; touch-action: pan-x pinch-zoom; }
.fv-fc { flex: none; position: relative; margin: 20px 24px 0; --fc-bleed: 24px; --fc-cols-h: 42px; --fc-mid-h: 90px; }
/* The list scrolls under a fixed sky; its top edge fades rather than cuts, and it ends above the home indicator, fading out */
.fv-list {
  flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; touch-action: pan-y;
  padding: 16px 24px calc(env(safe-area-inset-bottom, 0px) + 28px); scrollbar-width: none;
  -webkit-mask-image: linear-gradient(180deg, transparent 0, #000 14px, #000 calc(100% - env(safe-area-inset-bottom, 0px) - 24px), transparent calc(100% - env(safe-area-inset-bottom, 0px)));
  mask-image: linear-gradient(180deg, transparent 0, #000 14px, #000 calc(100% - env(safe-area-inset-bottom, 0px) - 24px), transparent calc(100% - env(safe-area-inset-bottom, 0px)));
}
.fv-list::-webkit-scrollbar { display: none; }
.fv-list .fc-daily { --fc-d-row: 40px; --fc-d-bar: 180px; }
.fv-now { margin-top: 22px; }
.fv-head { margin: 0; font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.8; }
.fv-readings { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px 14px; margin-top: 10px; }
.fv-rd-l { display: block; font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.fv-rd strong { display: block; margin-top: 3px; font-size: 17px; line-height: 22px; font-weight: 500; font-variant-numeric: tabular-nums; }
.fv-rd em { display: block; font-style: normal; font-size: 13px; line-height: 18px; opacity: 0.8; white-space: nowrap; }
.fv-more {
  margin-top: 26px; width: 100%; height: 50px; border: 0; border-radius: 14px; padding: 0 18px; display: flex; align-items: center; justify-content: space-between;
  font: 600 15px/20px var(--awc-font, inherit); color: inherit; background: rgba(255, 255, 255, 0.14); cursor: pointer; text-shadow: inherit;
  transition: transform 110ms ${PRESS}, background-color 160ms ${PRESS};
}
.fv-more:active { transform: scale(0.97); background: rgba(255, 255, 255, 0.2); }
.fv-more:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
.fv-more i { width: 7px; height: 7px; border-top: 1.75px solid currentColor; border-right: 1.75px solid currentColor; transform: rotate(45deg); margin-right: 3px; }
.fv-close { position: absolute; z-index: 40; top: 14px; right: 12px; width: 44px; height: 44px; border: 0; padding: 0; border-radius: 50%; background: transparent; color: inherit; cursor: pointer; outline: none; }
.fv-close::before { content: ''; position: absolute; inset: 7px; border-radius: 50%; transition: transform 110ms ${PRESS}; background: linear-gradient(rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.16)), var(--awc-sky-top); }
.fv-close:active::before { transform: scale(0.9); }
.fv-close:focus-visible::before { box-shadow: 0 0 0 2px currentColor; }
.fv-close i, .fv-close i::after { position: absolute; left: 50%; top: 50%; width: 12px; height: 1.75px; margin: -0.875px 0 0 -6px; border-radius: 1px; background: currentColor; transform: rotate(45deg); }
.fv-close i::after { content: ''; left: 0; top: 0; margin: 0; transform: rotate(90deg); }
.fv-grab { position: absolute; z-index: 40; top: 7px; left: 50%; width: 36px; height: 5px; margin-left: -18px; border-radius: 3px; background: currentColor; opacity: 0.4; pointer-events: none; }
.animated-weather-card[data-fc-view] :is(.sun, .moon-gsap) { top: 12%; left: 76%; }
/* The tablet (900 px and up): the hero, the line, the hours and the chips on the left; the week, the readings and the way
   to Home Assistant on the right. Nothing scrolls. */
@container awc (min-width: 900px) {
  .animated-weather-card[data-fc-view] .sky { --awc-sky-glow-layer: radial-gradient(14% 24% at 54% 2%, var(--awc-sky-glow), transparent 64%); }
  .animated-weather-card[data-fc-view] .weather-info { display: grid; grid-template-columns: minmax(0, 1fr) 420px; grid-template-rows: minmax(0, 1fr) auto; column-gap: 64px; padding: 40px 48px 38px; }
  .fv-top { grid-column: 1; grid-row: 1; padding: 0; display: flex; flex-direction: column; min-height: 0; }
  .fv-top .main-weather-info { flex: 1; display: flex; flex-direction: column; align-items: stretch; }
  .fv-fc { grid-column: 1; grid-row: 2; margin: 18px 0 0; --fc-chip-h: 36px; --fc-chip-size: 15px; --fc-chip-pad: 16px; --fc-chips-gap: 18px; }
  .fv-list { grid-column: 2; grid-row: 1 / -1; padding: 6px 0 0; overflow: visible; -webkit-mask-image: none; mask-image: none; display: flex; flex-direction: column; }
  .animated-weather-card[data-fc-view] .location { font-size: 21px; line-height: 26px; }
  .animated-weather-card[data-fc-view] .temperature { font-size: 192px !important; line-height: 0.86; letter-spacing: -0.05em; margin-top: 8px; }
  .animated-weather-card[data-fc-view] .awc-desc-row { height: 32px; max-width: none; margin-top: 14px !important; }
  .animated-weather-card[data-fc-view] .weather-desc { font-size: 24px; line-height: 32px; }
  .animated-weather-card[data-fc-view] .awc-companion { font-size: 21px; line-height: 26px; }
  .animated-weather-card[data-fc-view] .hero-meta { margin-top: auto; font-size: 48px; line-height: 53px; letter-spacing: -0.02em; }
  .animated-weather-card[data-fc-view] .hero-meta > .awc-line { font-weight: 400; white-space: normal; text-wrap: balance; }
  .fv-list .fc-daily { --fc-d-row: 44px; --fc-d-bar: 200px; --fc-d-size: 17px; --fc-d-lh: 22px; --fc-d-day: 48px; }
  .fv-readings { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px 14px; }
  .fv-more { margin-top: auto; flex: none; }
  .fv-close { top: 22px; right: 22px; }
  .fv-grab { display: none; }
  .animated-weather-card[data-fc-view] :is(.sun, .moon-gsap) { top: 9%; left: 54%; }
}
.theme-colors .fv-more { background: var(--secondary-background-color, rgba(127, 127, 127, 0.12)); }
.theme-colors .fv-close::before { background: linear-gradient(rgba(127, 127, 127, 0.16), rgba(127, 127, 127, 0.16)), var(--ha-card-background, var(--card-background-color)); }
.theme-colors :is(.fv-head, .fv-rd-l, .fv-rd em) { color: var(--secondary-text-color); opacity: 1; }
`;

/** The nightstand: take 4's, whole */
const NIGHT_CSS = `
animated-weather-card[data-qn] .weather-info > :not(.qn) { display: none !important; }
animated-weather-card[data-qn] .weather-info { padding: 0; gap: 0; text-shadow: none; }
/* The veil: one layer over the sky and every kind of weather, under the words; thinner where the moon is */
.qn-veil { position: absolute; inset: 0; z-index: 28; pointer-events: none; border-radius: inherit; opacity: 0;
  background: radial-gradient(30% 50% at 86% 12%, rgba(3, 4, 9, 0.55), rgba(3, 4, 9, 0.62) 100%); }
.animated-weather-card:is([data-phase="dawn"], [data-phase="dusk"]) > .qn-veil { background: radial-gradient(30% 50% at 86% 12%, rgba(3, 4, 9, 0.55), rgba(3, 4, 9, 0.8) 100%); }
.animated-weather-card[data-phase="day"] > .qn-veil { background: radial-gradient(30% 50% at 86% 12%, rgba(3, 4, 9, 0.65), rgba(3, 4, 9, 0.85) 100%); }
.animated-weather-card.theme-colors > .qn-veil { background: rgba(3, 4, 9, 0.96); }
/* Clouds and stars keep the top of the sky: none below the time's cap line, so no core and no star sits behind a figure */
animated-weather-card[data-qn] .clouds-container { -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 calc(48px + 12%), transparent calc(48px + 32%)); mask-image: linear-gradient(180deg, #000 0%, #000 calc(48px + 12%), transparent calc(48px + 32%)); }
animated-weather-card[data-qn] .stars-field { -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 26%, transparent 38%); mask-image: linear-gradient(180deg, #000 0%, #000 26%, transparent 38%); }
/* Lightning stays (it's real), capped: its flash peaks at 0.2, its bolt at 35%, no glow */
animated-weather-card[data-qn-night] .lightning { background: radial-gradient(110% 80% at 50% 0%, rgba(232, 238, 255, 0.2) 0%, rgba(214, 224, 255, 0.05) 55%, transparent 85%) !important; }
animated-weather-card[data-qn-night] .lightning svg path { filter: none !important; opacity: 0.35; }
.qn { --pad-x: 44px; --pad-y: 30px; position: absolute; inset: 0; container: qn / size; box-sizing: border-box; color: var(--weather-text-color); font-family: var(--awc-font); font-variant-numeric: tabular-nums; -webkit-font-smoothing: antialiased; }
.qn-left { position: absolute; left: var(--pad-x); bottom: var(--pad-y); }
.qn-time {
  display: block; font-family: var(--awc-font-display); font-size: var(--qn-size, 160px); font-weight: 250;
  line-height: 0.74; letter-spacing: -0.02em; font-variant-numeric: proportional-nums; margin-left: -0.055em;
  font-feature-settings: "case" 1; text-shadow: 0 1px 14px var(--weather-text-shadow);
}
.qn-time .awc-ampm { font-family: var(--awc-font); font-size: 22px; line-height: 1; font-weight: 500; letter-spacing: 0.04em; vertical-align: top; margin-left: 0.12em; position: relative; top: 0.04em; opacity: var(--qn-quiet-a, 0.8); }
.qn-sub { position: relative; margin-top: 20px; height: 30px; font-size: 24px; line-height: 30px; letter-spacing: -0.012em; white-space: nowrap; }
.qn-right { position: absolute; right: var(--pad-x); bottom: var(--pad-y); left: var(--qn-right-left, 60%); height: 0; }
.qn-zone { position: absolute; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: flex-start; }
.qn-sub > .qn-zone { top: 0; bottom: auto; }
.qn-line { display: block; max-width: 100%; }
.qn-quiet { opacity: var(--qn-quiet-a, 0.8); }
/* Night: one line, the temperature a step heavier than the condition (hierarchy by weight, not alpha) */
.qn-zone[data-kind="line"] .qn-line { font-size: 24px; line-height: 30px; letter-spacing: -0.012em; text-wrap: balance; max-height: 60px; overflow: hidden; }
.qn-zone[data-kind="line"] { left: calc(40px - var(--qn-gutter, 72px) - var(--qn-period, 0px) - var(--qn-spare, 0px)); align-items: flex-end; text-align: right; }
.qn-zone[data-kind="column"] .qn-line { white-space: nowrap; }
.qn-zone[data-kind="line"] .qn-t { font-weight: 500; margin-right: 12px; white-space: nowrap; }
.qn-cond { font-weight: 400; }
.qn-alert { font-weight: 500; }
.qn-big { font-family: var(--awc-font-display); font-size: 76px; line-height: 0.9; font-weight: 200; letter-spacing: -0.045em; margin: 0 0 auto -0.055em; padding-bottom: 10px; font-variant-numeric: proportional-nums; text-shadow: 0 1px 14px var(--weather-text-shadow); }
.qn-condline { font-size: 20px; line-height: 26px; font-weight: 600; letter-spacing: -0.012em; margin-bottom: 6px; }
.qn-w500 { font-weight: 500; }
.qn-zone[data-kind="column"] .qn-line:not(.qn-big):not(.qn-condline) { font-size: 20px; line-height: 26px; letter-spacing: -0.012em; }
.qn-range { display: inline-flex; align-items: center; gap: 10px; font-variant-numeric: tabular-nums; }
.qn-range > span:first-child { font-weight: 400; opacity: var(--qn-quiet-a, 0.8); }
.qn-range > span:last-child { font-weight: 500; }
.qn-bar { position: relative; width: 116px; height: 14px; }
.qn-fill { position: absolute; left: 0; right: 0; top: 50%; height: 6px; margin-top: -3px; border-radius: 3px;
  -webkit-mask-image: radial-gradient(circle at var(--now) 50%, transparent 7px, #000 7.5px); mask-image: radial-gradient(circle at var(--now) 50%, transparent 7px, #000 7.5px); }
.qn-now { position: absolute; left: var(--now); top: 50%; width: 10px; height: 10px; margin: -5px 0 0 -5px; border-radius: 50%; background: var(--weather-text-color); }
/* Night: no tint anywhere (0.8 over a dim ember falls under 3:1); weight carries the hierarchy */
.qn[data-night] { --qn-quiet-a: 1; }
.qn[data-night] :is(.qn-time, .qn-big) { text-shadow: none; }
.theme-colors .qn { --weather-text-shadow: transparent; }
.theme-colors .qn .qn-big { color: var(--awc-hero-color, var(--primary-color)); }
.theme-colors .qn :is(.qn-quiet, .awc-ampm) { color: var(--secondary-text-color); opacity: 1; }
.theme-colors .qn[data-night] .qn-quiet { color: inherit; }
.theme-colors .qn-fill { background: var(--primary-text-color) !important; }
.theme-colors .qn-now { background: var(--primary-color); }
/* Narrow (a phone's column, a portrait phone on a stand): the weather under the time */
@container qn (max-width: 600px) {
  .qn { --pad-x: 20px; --pad-y: 20px; }
  .qn-time .awc-ampm { font-size: 15px; }
  .qn-sub { margin-top: 12px; height: 22px; font-size: 17px; line-height: 22px; }
  .qn-left { bottom: calc(var(--pad-y) + 62px); }
  .qn-right { left: var(--pad-x) !important; bottom: calc(var(--pad-y) + 48px) !important; }
  .qn-right > .qn-zone { top: 0; bottom: auto; }
  .qn-zone[data-kind="line"] { left: 0; align-items: flex-start; text-align: left; }
  .qn-zone[data-kind] .qn-line, .qn-zone[data-kind] .qn-condline, .qn-zone[data-kind="column"] .qn-line:not(.qn-big):not(.qn-condline) { font-size: 17px; line-height: 22px; margin: 0; }
  .qn-zone[data-kind="column"] { flex-direction: row; flex-wrap: wrap; align-items: baseline; column-gap: 10px; }
  .qn-zone[data-kind="column"] .qn-big { font-size: 17px; line-height: 22px; font-family: var(--awc-font); font-weight: 500; letter-spacing: -0.012em; margin: 0; padding: 0; text-shadow: none; }
  .qn-zone[data-kind="column"] .qn-condline { font-weight: 400; }
  .qn-zone[data-kind="column"] .qn-line:nth-child(n+3) { flex-basis: 100%; }
  .qn-zone[data-kind="column"] .qn-line:nth-child(n+4) { display: none; }
}
`;

/** The wall: take 5's composition, drawn with the row's and the list's parts */
const WALL_CSS = `
.animated-weather-card[data-fw] .weather-info > :not(.fw) { display: none !important; }
.fw {
  --pad: 28px; --t0: 192px; --colB: max(40%, 334px);
  position: absolute; inset: 0; z-index: 30; box-sizing: border-box; pointer-events: none;
  color: var(--weather-text-color); text-shadow: 0 1px 12px var(--weather-text-shadow);
}
.fw :is(button, .fc-hourly, .fc-daily) { pointer-events: auto; }
.fw p { margin: 0; }
/* Room: the temperature, its cap line on the padding line */
.fw-temp { position: absolute; left: var(--pad); top: var(--pad); margin: calc(var(--t0) * -0.1005) 0 0 -0.055em; font-family: var(--awc-font-display); font-size: var(--t0); font-weight: 200; line-height: 0.9; letter-spacing: -0.045em; font-variant-numeric: tabular-nums; white-space: nowrap; }
.fw-deg { letter-spacing: 0; margin-left: 0.02em; }
/* The clock, quiet: on the temperature's baseline, with the date (D11: an eleventh of the temperature's ink) */
.fw-when { position: absolute; left: var(--colB); top: calc(var(--pad) + var(--t0) * 0.705); display: flex; align-items: baseline; column-gap: 12px; white-space: nowrap; transform: translateY(-100%); line-height: 1; }
.fw-clock { font-family: var(--awc-font-display); font-size: 40px; line-height: 44px; font-weight: 400; letter-spacing: -0.01em; opacity: 0.8; margin-bottom: -8px; font-variant-numeric: tabular-nums; }
.fw-clock .awc-ampm { font-size: max(11px, 0.42em); margin-left: 0.2em; }
.fw-date { font-size: 21px; line-height: 26px; font-weight: 400; letter-spacing: -0.008em; }
.fw-away { display: none; align-items: center; column-gap: 12px; font-size: 21px; line-height: 26px; }
.fw[data-away] .fw-away { display: inline-flex; }
.fw[data-away] :is(.fw-clock, .fw-date) { display: none; }
.fw-at { font-weight: 600; font-variant-numeric: tabular-nums; }
.fw-rel { font-weight: 400; opacity: 0.8; margin-left: 8px; }
/* Today, on the condition's line (the hand). Pulled, the high, the low and feels-like step out in place */
.fw-today { position: absolute; left: var(--pad); top: calc(var(--pad) + var(--t0) * 0.705 + 22px); display: flex; align-items: baseline; column-gap: 0.9em; font-size: 21px; line-height: 26px; font-weight: 400; white-space: nowrap; }
.fw-cond { font-weight: 600; }
.fw .awc-hl-pair b { font-size: 15px; font-weight: 600; letter-spacing: 0.06em; }
.fw[data-away] :is(.fw-hl, .fw-feels) { visibility: hidden; }
/* Next: the line that says what turns, the hours under it, the week beside them */
.fw-next { position: absolute; left: var(--pad); right: var(--pad); bottom: var(--pad); }
.fw-turn { font-family: var(--awc-font-display); font-size: 48px; line-height: 53px; font-weight: 400; letter-spacing: -0.022em; margin-bottom: 14px; white-space: nowrap; overflow: hidden; }
.fw-band { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 300px); column-gap: 40px; align-items: end; }
.fw-hours { min-width: 0; --fc-label: 21px; --fc-label-lh: 26px; --fc-value: 40px; --fc-value-lh: 44px; --fc-value-w: 500; --fc-cols-h: 64px; --fc-glyph-gap: 6px; --fc-plot-gap: 8px; --fc-stroke: 4px; --fc-mid-h: 140px; --fc-bleed: 28px; }
.fw-hours .fc-hr { font-weight: 500; letter-spacing: 0; opacity: 0.8; }
.fw-hours .fc-needle { top: -10px; width: 3px; height: 7px; }
.fw-week .fc-daily { --fc-d-row: 30px; --fc-d-size: 21px; --fc-d-lh: 26px; --fc-d-day: 52px; --fc-d-glyph: 24px; --fc-d-lo: 44px; --fc-d-hi: 44px; --fc-d-bar: 200px; --fc-bar: 8px; }
.fw-week .fc-d-name { font-size: 17px; font-weight: 600; }
.fw-week .fc-d-hi { font-weight: 500; }
.theme-colors .fw :is(.fw-clock, .fw-rel) { color: var(--secondary-text-color); opacity: 1; }
.theme-colors .fw-temp { color: var(--awc-hero-color, var(--primary-color)); }
`;

export const FORECAST_CSS = PARTS + SLIDE_CSS + CARD_CSS + FCARD_CSS + VIEW_CSS + NIGHT_CSS + WALL_CSS;
