// What the forecast bundle (animated-weather-card-forecast.js) hands the
// main bundle: the drawings of the weather card's forecast, the forecast
// card and the pop-up. The main bundle only holds the data and the cards'
// shells; it loads the drawings the first time a card shows a forecast.
// Plain names throughout, as for the dev panel: the two bundles don't share
// a module scope.

import type { ForecastEntry, ForecastType } from './forecast-data';
import type { HomeAssistant } from './types';

/** What a drawing knows about the forecast and how to say it */
export interface ForecastContext {
    hass?: HomeAssistant;
    /** The weather entity */
    entityId: string;
    hourly: ForecastEntry[] | null;
    daily: ForecastEntry[] | null;
    dailyType: ForecastType | null;
    /** The reading now, and its unit ("°C") */
    current?: number;
    unit: string;
    now: number;
    /** The sky the card is showing (sky.ts), and its phase */
    condition: string;
    phase: string;
    /** Theme palette: no sky */
    theme: boolean;
    /** Review only: which variant to draw */
    variant?: string;
}

/** The pop-up: what it shows, and the card it belongs to (focus goes back there) */
export interface PopupContext extends ForecastContext {
    /** The element to return focus to */
    returnFocus?: HTMLElement | null;
    /** The weather card's note, long version, if any */
    note?: string | null;
    /** Opens Home Assistant's own more-info dialog for the entity */
    openMoreInfo(): void;
    /** Still sky: reduced motion or animate: false */
    still: boolean;
}

export interface ForecastViews {
    /** Bumped when this interface changes in a way an older main bundle can't use */
    version: 1;
    /** The weather card's forecast section */
    sectionCss: string;
    renderSection(ctx: ForecastContext): string;
    /** The forecast card, inside its shadow root */
    cardCss: string;
    renderCard(ctx: ForecastContext & { compact: boolean }): string;
    /** The pop-up: opens over the page, returns a way to close it */
    openPopup(ctx: PopupContext): () => void;
}
