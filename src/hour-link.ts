// One needle across the page. While a hand moves a card through the hours
// (the weather card's slide, or the forecast card's), the card tells the page
// which time its needle is on, and the cards that share its sun or its
// weather follow: the sun tracker's sun goes to that time, the forecast
// card's days show the day it falls in. When the card comes home, it says so
// once, and they come back to now.
//
// A window event, because the bundles don't share a module scope, with plain
// names on it. Only a slide sends, and a card that follows has no slide
// moving, so nothing echoes.

export const HOUR_EVENT = 'animated-weather-card-hour';

export interface HourLink {
    /** The card whose needle moved */
    source: HTMLElement;
    /** Its weather entity and its sun entity */
    entity: string;
    sun: string;
    /** The time under the needle in ms, continuous under the finger; null once the card is home */
    at: number | null;
    /** The temperature under the needle (now's reading at home, between two hours' values between them); null when unknown */
    temperature: number | null;
    /** The sky the card shows, as its five --awc-sky-* colours (top, mid, bottom, glow, scrim); null on the theme palette and at home */
    sky: Record<string, string> | null;
}

export function sendHour(link: HourLink): void {
    window.dispatchEvent(new CustomEvent(HOUR_EVENT, { detail: link }));
}

/** Listen to every card's needle; returns the way to stop */
export function onHour(fn: (link: HourLink) => void): () => void {
    const handler = (e: Event) => {
        const link = (e as CustomEvent<HourLink>).detail;
        if (link && link.source) fn(link);
    };
    window.addEventListener(HOUR_EVENT, handler);
    return () => window.removeEventListener(HOUR_EVENT, handler);
}
