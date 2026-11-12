// What the main bundle and the forecast bundle (animated-weather-card-forecast.js)
// hand each other. Types only: the two bundles don't share a module scope,
// so everything crosses through these plain-named objects, as the developer
// panel and the note writer do.
//
// The main bundle holds the card, its sky, its weather and the page's
// forecast subscriptions. The forecast bundle draws everything the forecast
// and the clock add to it: the clock on the location line, today's high and
// low, the turning line, the hourly row and its chips, the slide through
// the hours, the forecast card, the strip, the view that opens on tap, the
// nightstand and the wall.

import type { AnimatedWeatherCardConfig, HomeAssistant } from './types';
import type { ForecastEntry, ForecastType } from './forecast-data';
import type { SkyColors, SkyCondition, SkyPhase } from './sky';
import type { HourLink } from './hour-link';

/** Which surface a card instance is */
export type Surface = 'card' | 'forecast' | 'view';

/** The animation controller's surface the slide uses to bring in the weather of an hour ahead */
export interface WeatherLayers {
    animations: Record<string, { isActive: boolean }>;
    startAnimation(type: string, config?: { intensity?: number }): Promise<void>;
    stopAnimation(type: string): Promise<void>;
}

/** The card, as the forecast bundle sees it */
export interface ForecastHost {
    /** The custom element */
    readonly element: HTMLElement;
    readonly surface: Surface;
    config(): AnimatedWeatherCardConfig;
    hass(): HomeAssistant | undefined;
    /** The page's forecast for this entity: hours, days, and whether each kind asked for has answered */
    forecast(): { hourly: ForecastEntry[] | null; daily: ForecastEntry[] | null; dailyType: ForecastType | null; settled: boolean };
    /** The weather the card can bring in for an hour ahead */
    layers(): WeatherLayers | undefined;
    /** The card's sky palette for a condition and phase (sky.ts) */
    skyColors(condition: SkyCondition, phase: SkyPhase): SkyColors;
    /** The phase the card's sky shows now */
    phase(): SkyPhase;
    /** The temperature the card shows now, as a number */
    current(): number | undefined;
    /** A temperature as the card writes it (its decimals and number format), without the degree sign */
    temperature(value: number): string;
    /** A condition in the user's language (Home Assistant's own names) */
    conditionName(state: string): string;
    /** Fit the card to its frame again (its fit ladder asks the forecast's levels) */
    fit(): void;
    /** Read the entity again into the card's own text (after the slide comes home) */
    refresh(): void;
    /** The card is on screen and its tab is visible */
    seen(): boolean;
    /** Reduced motion or animate: false: a still card */
    still(): boolean;
    /** Home Assistant's own more-info dialog for the entity */
    moreInfo(): void;
}

/** What the forecast bundle adds to one card */
export interface ForecastExtras {
    /** The forecast's give-way levels, roomiest first (the card's fit tries each before its own steps); [] for none */
    levels(): string[];
    /** Show one level */
    setLevel(level: string): void;
    /** The level just set keeps the light law (the row's top low enough) once laid out; overflows() asks the card */
    levelOk(overflows: () => boolean): boolean;
    /** After the fit settled: whole-or-nothing lines, the clouds' floor, the row's measures */
    fitted(): void;
    /** Home Assistant or the forecast changed */
    update(): void;
    /** The card was seen, or stopped being seen (scrolled away, the tab hidden) */
    seen(visible: boolean): void;
    /** The card is showing an hour other than now: its own text must wait */
    away(): boolean;
    /** The condition as the forecast names it ("Rain", never "Rainy"), or null to keep Home Assistant's */
    conditionText(state: string): string | null;
    /** Open the view that opens on tap */
    open(): void;
    destroy(): void;
}

/** A sun tracker, as the forecast bundle sees it when it follows another card's needle */
export interface TrackerLink {
    /** Its .st-card, in its shadow root */
    card: HTMLElement;
    hass: HomeAssistant | undefined;
    /** Its weather entity: the needle's sky is its sky only on the same weather */
    weather: string | undefined;
    /** Sunrise and sunset as hours of the day, as its path is drawn, and whether that's the compact path */
    riseH: number;
    setH: number;
    compact: boolean;
}

export interface ForecastViews {
    /** Bumped when this interface changes in a way an older main bundle can't use */
    version: 2;
    attach(host: ForecastHost): ForecastExtras;
    /** Put a sun tracker at another card's needle (an older forecast bundle has none) */
    followTracker?(tracker: TrackerLink, link: HourLink): void;
}
