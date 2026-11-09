// One card's view of an entity's forecast: the hours and the days it asked
// for, kept current through the page's shared subscriptions
// (forecast-data.ts). The weather card and the forecast card each hold one.

import { ForecastEntry, ForecastType, dailyTypeFor, forecastTypes, subscribeForecast } from './forecast-data';
import type { HomeAssistant } from './types';

export interface ForecastWants {
    hourly: boolean;
    daily: boolean;
}

export class ForecastFeed {
    hourly: ForecastEntry[] | null = null;
    daily: ForecastEntry[] | null = null;
    dailyType: ForecastType | null = null;
    /** Each kind asked for has answered (or failed), so an empty forecast is really empty */
    settled = false;
    private stops: (() => void)[] = [];
    private key?: string;
    private connection?: object;
    private pending = new Set<string>();

    constructor(private readonly changed: () => void) {}

    /**
     * Listen to what's wanted of this entity, and nothing else. Calling it
     * again with the same entity and wants does nothing, so it can run on
     * every Home Assistant update.
     */
    sync(hass: HomeAssistant | undefined, entityId: string | undefined, wants: ForecastWants): void {
        const weather = entityId ? hass?.states[entityId] : undefined;
        const types = forecastTypes(weather);
        const hourly = wants.hourly && types.includes('hourly');
        const dailyType = wants.daily ? dailyTypeFor(weather) : null;
        const key = `${entityId}|${hourly}|${dailyType}`;
        if (!hass?.connection || !entityId || !weather) {
            if (this.key) this.stop();
            return;
        }
        if (key === this.key && this.connection === hass.connection) return;
        this.stop();
        this.key = key;
        this.connection = hass.connection;
        this.dailyType = dailyType;
        this.pending = new Set([hourly ? 'hourly' : '', dailyType ?? ''].filter(Boolean));
        this.settled = this.pending.size === 0;
        const listen = (type: ForecastType, store: (entries: ForecastEntry[] | null) => void) => {
            this.stops.push(subscribeForecast(hass, entityId, type, update => {
                if (!update.failed) store(update.forecast);
                this.pending.delete(type);
                this.settled = this.pending.size === 0;
                this.changed();
            }));
        };
        if (hourly) listen('hourly', entries => { this.hourly = entries; });
        if (dailyType) listen(dailyType, entries => { this.daily = entries; });
        if (this.settled) this.changed();
    }

    stop(): void {
        for (const stop of this.stops) stop();
        this.stops = [];
        this.key = undefined;
        this.connection = undefined;
        this.hourly = null;
        this.daily = null;
        this.dailyType = null;
        this.settled = false;
    }
}
