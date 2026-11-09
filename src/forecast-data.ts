// The forecast, as Home Assistant sends it (weather/subscribe_forecast), and
// one subscription per weather entity and kind of forecast for the whole
// page: the weather card's forecast, its pop-up, the forecast card and the
// note writer all listen to the same one.
//
// The bundles don't share a module scope (the note writer and the forecast
// drawings are bundles of their own), so the subscriptions live on a window
// global, made by whichever bundle asks first. Every bundle carries this same
// small file.

import type { HassEntity, HomeAssistant } from './types';

/** One forecast entry, as weather/subscribe_forecast sends it. Every field but the time is optional. */
export interface ForecastEntry {
    datetime: string;
    condition?: string;
    temperature?: number;
    templow?: number;
    apparent_temperature?: number;
    precipitation_probability?: number;
    precipitation?: number;
    wind_speed?: number;
    wind_gust_speed?: number;
    wind_bearing?: number | string;
    uv_index?: number;
    humidity?: number;
    cloud_coverage?: number;
    dew_point?: number;
    pressure?: number;
    is_daytime?: boolean;
}

export type ForecastType = 'hourly' | 'twice_daily' | 'daily';

/** What a listener hears: the entries (null when the entity has none), or that the subscription failed. */
export interface ForecastUpdate {
    type: ForecastType;
    forecast: ForecastEntry[] | null;
    failed?: boolean;
}

export type ForecastListener = (update: ForecastUpdate) => void;

/** Home Assistant's WeatherEntityFeature flags */
const FORECAST_DAILY = 1;
const FORECAST_HOURLY = 2;
const FORECAST_TWICE_DAILY = 4;

/** The kinds of forecast an entity offers (supported_features). Unknown features: assume hourly and daily. */
export function forecastTypes(weather: HassEntity | undefined): ForecastType[] {
    const features = Number(weather?.attributes?.supported_features);
    if (!isFinite(features)) return ['hourly', 'daily'];
    const types: ForecastType[] = [];
    if (features & FORECAST_HOURLY) types.push('hourly');
    if (features & FORECAST_TWICE_DAILY) types.push('twice_daily');
    if (features & FORECAST_DAILY) types.push('daily');
    return types;
}

/** The finest forecast an entity has: hourly, then twice daily, then daily. */
export function forecastTypeFor(weather: HassEntity | undefined): ForecastType | null {
    return forecastTypes(weather)[0] ?? null;
}

/** The forecast by day: daily, else twice daily (day and night halves), else none. */
export function dailyTypeFor(weather: HassEntity | undefined): ForecastType | null {
    const types = forecastTypes(weather);
    return types.includes('daily') ? 'daily' : types.includes('twice_daily') ? 'twice_daily' : null;
}

/** How long a subscription nobody listens to stays open, so a card that re-renders doesn't resubscribe */
const CLOSE_AFTER_MS = 5_000;

interface Feed {
    listeners: Set<ForecastListener>;
    last?: ForecastUpdate;
    unsubscribe?: Promise<(() => void) | void>;
    closing?: ReturnType<typeof setTimeout>;
}

type Connection = HomeAssistant['connection'];

/** The page's forecast subscriptions. Keep this interface stable: older and newer bundles share it. */
export interface ForecastHub {
    subscribe(connection: Connection, entityId: string, type: ForecastType, listener: ForecastListener): () => void;
}

function createHub(): ForecastHub {
    const feeds = new WeakMap<object, Map<string, Feed>>();
    return {
        subscribe(connection, entityId, type, listener) {
            let byKey = feeds.get(connection);
            if (!byKey) feeds.set(connection, byKey = new Map());
            const key = `${entityId}|${type}`;
            let feed = byKey.get(key);
            if (!feed) {
                const fresh: Feed = { listeners: new Set() };
                feed = fresh;
                byKey.set(key, fresh);
                const send = (update: ForecastUpdate) => {
                    fresh.last = update;
                    for (const each of [...fresh.listeners]) each(update);
                };
                // Home Assistant may answer before the promise settles (the demo's stand-in does)
                fresh.unsubscribe = connection.subscribeMessage<{ type?: ForecastType; forecast?: ForecastEntry[] | null }>(
                    message => send({ type: message?.type ?? type, forecast: Array.isArray(message?.forecast) ? message.forecast : null }),
                    { type: 'weather/subscribe_forecast', entity_id: entityId, forecast_type: type },
                ).catch(() => {
                    // Gone, so the next card to ask tries again
                    if (byKey!.get(key) === fresh) byKey!.delete(key);
                    send({ type, forecast: null, failed: true });
                });
            }
            const current = feed;
            clearTimeout(current.closing);
            current.closing = undefined;
            current.listeners.add(listener);
            if (current.last) listener(current.last);
            return () => {
                if (!current.listeners.delete(listener) || current.listeners.size) return;
                current.closing = setTimeout(() => {
                    if (current.listeners.size) return;
                    if (byKey!.get(key) === current) byKey!.delete(key);
                    current.unsubscribe?.then(stop => { if (typeof stop === 'function') stop(); }).catch(() => {});
                }, CLOSE_AFTER_MS);
            };
        },
    };
}

/** The page's hub: the first bundle to ask makes it, every other one finds it. */
export function forecastHub(): ForecastHub {
    return window.AnimatedWeatherCardForecasts ??= createHub();
}

/** For tests: forget every subscription. */
export function resetForecastHub(): void {
    delete window.AnimatedWeatherCardForecasts;
}

/**
 * Listen to an entity's forecast of one kind. The listener hears the last
 * forecast at once when another card already has it, then every update.
 * Returns the way to stop listening.
 */
export function subscribeForecast(hass: HomeAssistant | undefined, entityId: string, type: ForecastType, listener: ForecastListener): () => void {
    if (!hass?.connection?.subscribeMessage) return () => {};
    return forecastHub().subscribe(hass.connection, entityId, type, listener);
}

/** Entries that haven't ended yet, oldest first: an hour is current until the next one starts */
export function upcoming(entries: ForecastEntry[] | null | undefined, now: number, spanMs: number): ForecastEntry[] {
    return (entries ?? [])
        .filter(e => {
            const t = Date.parse(e.datetime);
            return !isNaN(t) && t + spanMs > now;
        })
        .sort((a, b) => Date.parse(a.datetime) - Date.parse(b.datetime));
}
