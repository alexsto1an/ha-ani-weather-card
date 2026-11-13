// The sun tracker at another card's needle (hour-link.ts). The tracker, in
// the main bundle, only listens: a needle exists only where this bundle draws
// a slide, so placing the sun and the now line, and taking the card's sky
// (on the same weather, or any when it has none of its own), live here, and
// the main bundle stays light. Everything moves in place,
// never through the tracker's render: it's every frame of a drag. The
// headline stays on the real next sunrise or sunset, as the weather card's
// own sunset reading does while it's dragged.

import type { TrackerLink } from './forecast-host';
import type { HourLink } from './hour-link';
import { COMPACT_PATH, REGULAR_PATH, VH, pathElevation, xFor, yFor } from './sun-path';
import { hourOfDay } from './localize';

const SKY = ['top', 'mid', 'bottom', 'glow', 'scrim'];

export function followTracker(t: TrackerLink, link: HourLink): void {
    const { card } = t;
    if (link.at === null) return;
    // Its sky dissolves over 3.2 s; following, it's the card's, frame by frame
    card.classList.add('following');
    const hour = hourOfDay(new Date(link.at), t.hass);
    const elevation = pathElevation(hour, t.riseH, t.setH);
    const dot = card.querySelector('.st-dot') as HTMLElement | null;
    if (dot) {
        dot.style.left = `${((hour / 24) * 100).toFixed(2)}%`;
        dot.style.top = `${((yFor(elevation, t.compact ? COMPACT_PATH : REGULAR_PATH) / VH) * 100).toFixed(2)}%`;
        dot.classList.toggle('below', elevation < 0);
    }
    const line = card.querySelector('.st-now-line');
    if (line) { const x = xFor(hour).toFixed(1); line.setAttribute('x1', x); line.setAttribute('x2', x); }
    // The card's sky: on the same weather, or, with no weather of its own, from any card on its sun. Colour only, never weather
    if (link.sky && card.classList.contains('sky') && (!t.weather || t.weather === link.entity)) {
        for (const k of SKY) {
            const v = link.sky[k];
            if (v && card.style.getPropertyValue(`--awc-sky-${k}`) !== v) card.style.setProperty(`--awc-sky-${k}`, v);
        }
    }
}
