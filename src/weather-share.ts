// The weather each card on the page shows, by its sun. A sun tracker with no
// weather_entity of its own takes the sky of the first weather card on its
// sun: at rest, as it does while that card is dragged through the hours
// (hour-link.ts), so a tracker under the weather card reads as one piece
// without being told which weather it is. The weather card and the tracker
// are both in the main bundle, so this lives in the module's own scope.

interface Shared { entity: string; sun: string }

const cards = new Map<object, Shared>();
const listeners = new Set<() => void>();

/** A card on the page shows this weather on this sun; without an entity, it shows none (it left, or it's not a weather card) */
export function shareWeather(card: object, entity?: string, sun?: string): void {
    const prev = cards.get(card);
    if (!entity) {
        if (prev) { cards.delete(card); changed(); }
        return;
    }
    const next = { entity, sun: sun || 'sun.sun' };
    if (prev && prev.entity === next.entity && prev.sun === next.sun) return;
    // A card that changes its weather keeps its place
    cards.set(card, next);
    changed();
}

/** The weather of the first card on this sun, if there is one */
export function weatherOnSun(sun: string | undefined): string | undefined {
    if (!sun) return undefined;
    for (const c of cards.values()) if (c.sun === sun) return c.entity;
    return undefined;
}

/** Hear when a card comes, goes or changes its weather; returns the way to stop */
export function onSharedWeather(fn: () => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
}

function changed(): void {
    for (const fn of [...listeners]) fn();
}
