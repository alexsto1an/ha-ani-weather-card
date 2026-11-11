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
.location:has(> .awc-clock) { opacity: 1; }
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
.animated-weather-card[data-awc-away="location"] .location { opacity: 1; overflow: visible; }
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

/* ── The floor: no cloud's core and no star behind data. Clouds and stars keep the open sky above the condition's
   line and right of the hero's own text. Past either edge they're gone, not thinned: a thinned cloud is a smudge. ── */
.animated-weather-card[data-fc]:not([data-variant="compact"]) :is(.clouds-layer, .stars-field) {
  --fy: var(--fc-floor-c, 400px); --ffade: 22px;
  -webkit-mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fy) - var(--ffade)), transparent calc(var(--fy) + 4px)), linear-gradient(90deg, transparent calc(var(--fc-floor-xl, 0px) - 36px), #000 calc(var(--fc-floor-xl, 0px) + 24px));
  mask-image: linear-gradient(180deg, #000 0, #000 calc(var(--fy) - var(--ffade)), transparent calc(var(--fy) + 4px)), linear-gradient(90deg, transparent calc(var(--fc-floor-xl, 0px) - 36px), #000 calc(var(--fc-floor-xl, 0px) + 24px));
  -webkit-mask-composite: source-in; mask-composite: intersect;
}
.animated-weather-card[data-fc]:not([data-variant="compact"]) .stars-field { --fy: var(--fc-floor-s, 400px); --ffade: 12px; }

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
/* The corner light: 30% × 34% at 94%, −8%, with a wider, fainter skirt so it has no edge */
.animated-weather-card[data-fc-card] .sky { --awc-sky-glow-layer: radial-gradient(30% 34% at 94% -8%, var(--awc-sky-glow), transparent 70%), radial-gradient(52% 56% at 94% -8%, var(--awc-sky-glow), transparent 78%); }
/* The strip sits under the compact weather card: the light is upstairs, and only spills over its top edge */
.animated-weather-card[data-fc-card][data-variant="compact"] .sky { --awc-sky-glow-layer: radial-gradient(70% 120% at 84% -90%, var(--awc-sky-glow), transparent 72%); }
.animated-weather-card[data-fc-card]:has(.fc-fcard[data-variant="wide"]) .sky { --awc-sky-glow-layer: radial-gradient(20% 70% at 55% -42%, var(--awc-sky-glow), transparent 72%); }
.fc-fcard { position: relative; box-sizing: border-box; height: 100%; padding: 18px var(--awc-pad) 0; --fc-bleed: var(--awc-pad); --fc-mid-h: 110px; --fc-cols-h: 42px; overflow: hidden; }
.fc-fcard[data-variant="regular"] { display: flex; flex-direction: column; }
/* The lead: the turning line at the forecast card's size (20/26, weight 500, full strength). Away from now it leads
   with the needle's hour, and the way home sits at its end. */
.fc-lead { position: relative; display: flex; align-items: center; height: 26px; margin-bottom: 14px; white-space: nowrap; }
.fc-sentence { font-size: 20px; line-height: 26px; font-weight: 500; letter-spacing: -0.012em; min-width: 0; overflow: hidden; }
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

export const FORECAST_CSS = PARTS + SLIDE_CSS + CARD_CSS + FCARD_CSS;
