// Where clouds ride. On today's card they roam the top 60% of the sky,
// behind the hero's text. With the forecast on, the row's icons and figures
// are full-strength text a cloud would wash out, so the forecast sets a floor
// at the row: clouds still roam the whole width, behind the clock, the place,
// the temperature and the lines under it, and every cloud is whole above the
// floor. The main bundle places new clouds by it (cloudY); the forecast
// bundle sets it and moves the clouds already up (cloudFloor).

/**
 * A cloud's height in its sky: `frac` (0 to 1) of the way down. With a band
 * (px from the cloud layer's top), the whole cloud, `bottom` px of it below
 * where it rides, ends above the band; without one, it rides as on today's
 * card, up to 60% of `height`.
 */
export function cloudY(frac: number, bottom: number, band: number | null, height: number): number {
    return band !== null && band > 0 ? frac * Math.max(0, band - bottom) : frac * 0.6 * height;
}

/**
 * The floor, `y` px from the card's top, or null for today's sky. Sets
 * `data-cloud-band` (where clouds must end, in the cloud layer's px) and the
 * masks' lines (`--fc-floor-c`, `--fc-floor-s`), and moves the clouds already
 * up to the same place in the new sky. The mask only guards the floor: no
 * cloud is born past it.
 */
export function cloudFloor(root: HTMLElement, y: number | null): void {
    const layer = root.querySelector('.clouds-layer') as HTMLElement | null;
    const stars = root.querySelector('.stars-field') as HTMLElement | null;
    let band: number | null = null;
    if (y === null) {
        root.style.removeProperty('--fc-floor-c');
        root.style.removeProperty('--fc-floor-s');
    } else {
        // Each layer's own top: by its CSS the card's, which is also what a layer that isn't drawn yet
        // (no clouds now) would measure, were it not 0 for an element with no box
        const top = root.getBoundingClientRect().top;
        const off = (e: HTMLElement | null) => (e && e.getClientRects().length ? e.getBoundingClientRect().top - top : 0);
        band = Math.max(0, Math.round(y - off(layer)));
        root.style.setProperty('--fc-floor-c', `${band}px`);
        root.style.setProperty('--fc-floor-s', `${Math.max(0, Math.round(y - off(stars)))}px`);
    }
    const was = root.dataset.cloudBand;
    if (band === null) delete root.dataset.cloudBand;
    else root.dataset.cloudBand = String(band);
    if (was === root.dataset.cloudBand) return;
    const gsap = window.AnimatedWeatherCardGsap;
    const height = layer?.clientHeight || root.clientHeight || 1;
    for (const t of root.querySelectorAll<HTMLElement>('.cloud-track')) {
        const frac = Number(t.dataset.awcF), bottom = Number(t.dataset.awcB);
        if (!Number.isFinite(frac) || !Number.isFinite(bottom)) continue;
        gsap?.set(t, { y: cloudY(frac, bottom, band, height) });
    }
}
