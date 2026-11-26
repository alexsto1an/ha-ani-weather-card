// Type definitions for Animated Weather Card

/**
 * Home Assistant entity state
 */
export interface HassEntity {
    entity_id: string;
    state: string;
    attributes: Record<string, any>;
    context: {
        id: string;
        parent_id?: string;
        user_id?: string;
    };
    last_changed: string;
    last_updated: string;
}

/**
 * Home Assistant instance with proper typing
 */
export interface HomeAssistant {
    states: Record<string, HassEntity>;
    config: {
        latitude: number;
        longitude: number;
        elevation: number;
        unit_system: {
            length: string;
            /** What rain is measured in: mm or in */
            accumulated_precipitation?: string;
            mass: string;
            temperature: string;
            volume: string;
        };
        location_name: string;
        time_zone: string;
        components: string[];
        config_dir: string;
        allowlist_external_dirs: string[];
        allowlist_external_urls: string[];
        version: string;
        config_source: string;
        recovery_mode: boolean;
        state: 'NOT_RUNNING' | 'STARTING' | 'RUNNING' | 'STOPPING' | 'FINAL_WRITE';
        external_url?: string;
        internal_url?: string;
        currency: string;
        country?: string;
        language: string;
    };
    callService(
        domain: string, 
        service: string, 
        serviceData?: Record<string, any>, 
        target?: { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[]; },
        notifyOnError?: boolean,
        returnResponse?: boolean
    ): Promise<any>;
    callWS(message: Record<string, any>): Promise<any>;
    connection: {
        subscribeEvents<T = any>(callback: (event: T) => void, eventType?: string): Promise<() => void>;
        subscribeMessage<T = any>(callback: (message: T) => void, subscribeMessage: Record<string, any>): Promise<() => void>;
        sendMessage(message: Record<string, any>): void;
        sendMessagePromise<T = any>(message: Record<string, any>): Promise<T>;
        socket: WebSocket;
        connected: boolean;
    };
    user?: {
        id: string;
        name: string;
        is_owner: boolean;
        is_admin: boolean;
        credentials: Array<{ auth_provider_type: string; auth_provider_id: string }>;
        mfa_modules: Array<{ id: string; name: string; enabled: boolean }>;
    };
    panels: Record<string, {
        component_name: string;
        config: Record<string, any> | null;
        icon: string | null;
        title: string | null;
        url_path: string;
    }>;
    services: Record<string, Record<string, {
        description: string;
        fields: Record<string, {
            description: string;
            example: any;
            selector?: Record<string, any>;
        }>;
        target?: {
            entity?: Array<{ domain?: string }>;
            device?: boolean;
            area?: boolean;
        };
    }>>;
    localize: (key: string, ...args: any[]) => string;
    language: string;
    /** The user's language and formats (HA 2023+) */
    locale?: { language: string; time_format?: 'language' | 'system' | '12' | '24'; number_format?: string; time_zone?: 'local' | 'server' };
    /** A state in the user's language, e.g. a moon phase (HA 2023.11+) */
    formatEntityState?: (stateObj: HassEntity, state?: string) => string;
    selectedLanguage?: string;
    resources: Record<string, any>;
    translationMetadata: Record<string, any>;
    dockedSidebar: 'docked' | 'auto';
    defaultPanel: string;
    moreInfoEntityId?: string;
    hassUrl(path?: string): string;
    auth: {
        data: {
            hassUrl: string;
            clientId: string;
            expires: number;
            expiresIn: number;
            accessToken: string;
            refreshToken: string;
        };
        wsUrl: string;
        accessToken: string;
        expired: boolean;
        revoke(): Promise<void>;
        refreshAccessToken(): Promise<void>;
    };
}

/**
 * Base Lovelace card interface with proper typing
 */
export interface LovelaceCard extends HTMLElement {
    hass?: HomeAssistant;
    config?: Record<string, any>;
    setConfig(config: Record<string, any>): void;
    getCardSize?(): number;
    getConfigElement?(): HTMLElement;
    getStubConfig?(): Record<string, any>;
    connectedCallback?(): void;
    disconnectedCallback?(): void;
    attributeChangedCallback?(name: string, oldValue: string | null, newValue: string | null): void;
}

/**
 * Lovelace card editor interface
 */
export interface LovelaceCardEditor extends LovelaceCard {
    setConfig(config: Record<string, any>): void;
    configChanged?(config: Record<string, any>): void;
}

/**
 * Engine settings for weather animations with strict typing
 */
export interface WeatherEngineSettings {
    windSpeed: number;
    rainCount: number;
    leafCount: number;
    snowCount: number;
    cloudBaseSize: number;
    cloudCount: number;
    splashBounce: number;
}

/**
 * custom_colors: each _bg colour becomes a whole sky for its condition, on
 * the sky palette (color-utils.ts); the text, the temperature, the sun, the
 * rain and the snow apply on either palette; the fog's on the sky palette
 */
export interface CustomColorConfig {
    sunny_bg?: string;
    cloudy_bg?: string;
    rainy_bg?: string;
    stormy_bg?: string;
    snowy_bg?: string;
    windy_bg?: string;
    text_color?: string;
    /** The temperature's colour, on either palette */
    temperature_color?: string;
    sun_color?: string;
    rain_color?: string;
    snow_color?: string;
    /** The fog's colour, on the sky palette (gsap-effects.ts) */
    fog_color?: string;
    [key: string]: string | undefined;
}

/**
 * Main configuration interface with comprehensive typing
 */
/** One row of the weather card's readings, as YAML holds it (readings.ts normalizes it) */
export interface ReadingEntry {
    type: string;
    /** A sensor, or a weather entity whose attribute it reads; none reads the card's own weather entity */
    entity?: string;
    /** wind: the direction's sensor */
    direction_entity?: string;
    /** rain: the rate's sensor, shown while it rains */
    rate_entity?: string;
    /** sensor: the label; else the entity's own name */
    name?: string;
    /** Only in the view that opens on tap */
    view?: boolean;
}

export interface AnimatedWeatherCardConfig {
    type?: 'custom:animated-weather-card';
    entity?: string;
    name?: string;
    outdoor_sensor_entity?: string;
    feels_like_entity?: string;
    humidity_sensor_entity?: string;
    pressure_sensor_entity?: string;
    /** A wind speed sensor: the number on the card, and how fast the weather moves */
    wind_speed_sensor_entity?: string;
    /** A wind direction sensor, in degrees or a compass point: the wind arrow */
    wind_direction_sensor_entity?: string;
    indoor_temperature_entity?: string;
    indoor_humidity_entity?: string;
    sun_entity?: string;
    /** A moon phase sensor (the Moon integration's): the night's moon keeps to the phase it names. Without it, the date's */
    moon_entity?: string;
    /** Another place: its coordinates give the card its own sun, computed (solar.ts), instead of sun.sun */
    latitude?: number;
    longitude?: number;
    /** Another place's time zone (an IANA name, such as Europe/Rome): every time on the card is shown in it */
    time_zone?: string;
    /** The readings in the metric row, in order: humidity, wind, pressure, sun (the default) and uv */
    metrics?: string[] | string;
    /**
     * The readings, in order (readings.ts): a type, or a type with its entity. With it, metrics, the reading sensors,
     * show_sun, uv_entity, uv_max_entity and rain_* are ignored; without it, they build the list
     */
    readings?: Array<ReadingEntry | string>;
    /** Where AQI's levels after good start, five rising numbers (default the US EPA's 51, 101, 151, 201, 301) */
    aqi_levels?: number[] | string;
    /** A UV index sensor, such as OpenUV's current UV index. Without it, the weather entity's uv_index */
    uv_entity?: string;
    /** Today's highest UV index, for the view that opens on tap */
    uv_max_entity?: string;
    /** Where the UV levels start: moderate, high, very high and extreme (default 3, 6, 8, 11, the WHO's) */
    uv_levels?: number[];
    /** Today's rain from a station's sensor, such as an Ecowitt's daily rain: the rain reading */
    rain_entity?: string;
    /** The rain rate: the rain reading while it rains */
    rain_rate_entity?: string;
    /** A station's other rain totals, for the view that opens on tap: this rain event, this week, month and year */
    rain_event_entity?: string;
    rain_week_entity?: string;
    rain_month_entity?: string;
    rain_year_entity?: string;
    // Plane fly-overs: a Flightradar24 area sensor with a `flights` attribute
    flights_entity?: string;
    /** Write a note under the conditions with Home Assistant's AI Task, from the forecast */
    show_note?: boolean;
    /** The note's voice: snarky (default), calm, friendly or dry */
    note_tone?: 'snarky' | 'calm' | 'friendly' | 'dry';
    /** The AI Task entity to write it; empty for the default (Settings → System → AI) */
    note_ai_task_entity?: string;
    /** The calendars your hours out of the house come from, for what to wear: one, or a list */
    note_calendar?: string | string[];
    /** The note under the conditions from an entity instead: its state is the short line */
    note_entity?: string;
    /** The attribute that holds the longer note (default "note") */
    note_attribute?: string;
    /** Minutes after its `generated_at` that a note is hidden as stale (default 180, 0 never) */
    note_max_age?: number;
    show_flight_labels?: boolean;
    /** What a plane's tag says: "flight" (number and aircraft, default), "route" ("Lisbon → Paris") or "both" */
    flight_label?: 'flight' | 'route' | 'both';
    /** How fast planes cross, as a share of their usual pace: 0.25 to 2 (default 1) */
    plane_speed?: number;
    /** Fly the planes already overhead when the dashboard opens (default: only those that arrive) */
    planes_on_load?: boolean;
    show_attributes?: boolean;
    show_attribute_labels?: boolean;
    show_attribute_icons?: boolean;
    show_location?: boolean;
    show_indoor?: boolean;
    /** How the indoor reading is introduced: the word (default), an icon, or both */
    indoor_style?: 'label' | 'icon' | 'both';
    /** One line: the temperature and condition over the moving sky */
    compact?: boolean;
    /** Temperatures to one decimal (1), or in whole degrees (0, the default) */
    temperature_decimals?: number;
    /** What a tap does (default: the weather entity's more-info dialog) */
    tap_action?: import('./actions').ActionConfig;
    /** What a hold does (default: nothing) */
    hold_action?: import('./actions').ActionConfig;
    /** What a double tap does (default: nothing) */
    double_tap_action?: import('./actions').ActionConfig;
    show_sun?: boolean;
    /** The time, leading the location line */
    show_clock?: boolean;
    /** Today's date on the location line, after the time ("13:10  Fri 13 Nov  Home") */
    show_date?: boolean;
    /** The big value: the temperature (default), or the time, with the temperature leading the condition's line */
    hero?: 'temperature' | 'clock';
    /** The forecast on the card: today's high and low, the turning line, the hourly row and its chips, and the slide through the hours */
    show_forecast?: boolean;
    /** The chip the row opens on: one the hourly forecast reports, else the temperature */
    forecast_metric?: 'temp' | 'feels' | 'chance' | 'amount' | 'uv' | 'wind' | 'gust' | 'humidity' | 'dew' | 'cloud' | 'pressure';
    /** The chips under the hourly row, which change what it shows (default true). Without them the row stays on forecast_metric */
    show_chips?: boolean;
    /** The hours' graph, the same for every metric: a line (default), the line with a soft fill under it, bars, or none */
    forecast_graph?: 'line' | 'area' | 'bars' | 'none';
    /** With show_forecast, the days under the hourly row (default false) */
    show_days?: boolean;
    /** How many days the list shows, on the forecast card and with show_days (0 to 10, default 7) */
    forecast_days?: number;
    /** The forecast card: the line on what turns, at its top (default true). Without it there's no Now control either: the row's capsule names the hour */
    show_summary?: boolean;
    /** The forecast card: the hourly row (default true) */
    show_hours?: boolean;
    /** The forecast card: the weather behind it, rain, snow, fog, wind and lightning (default false: the sky alone) */
    weather_effects?: boolean;
    /** The card's layout: the regular card, or the nightstand (the time as the hero) */
    layout?: 'default' | 'nightstand';
    /** The nightstand: a sensor with the next alarm (a timestamp, or an input_datetime) */
    alarm_entity?: string;
    /** The nightstand: when you get up without an alarm, and when you go to bed ("07:00", "22:30") */
    wake_time?: string;
    bed_time?: string;
    /** The nightstand: the dark night (auto: from the light sensor, else from bed to wake time) */
    night?: 'auto' | 'on' | 'off' | boolean;
    /** The nightstand: an illuminance sensor beside it */
    night_sensor?: string;
    /** The nightstand: night below this many lux on the sensor, held for a minute (5); day again at three times it, held for 10 s */
    night_lux?: number;
    /** The nightstand: red on black at night, as a bedside clock's night mode (on unless false); off, the sky stays under a veil in warm inks */
    night_red?: boolean;
    animate?: boolean;
    auto_pause?: boolean;
    dev_mode?: boolean;
    disable_lightning_shake?: boolean;
    /** Let rain, snow, sleet and leaves fall out of the card (default true). */
    spill_particles?: boolean;
    /** Try hardware WebGL 2 for supported effects; use standard effects if unavailable. */
    use_webgl?: boolean;
    color_palette?: 'default' | 'theme';
    custom_colors?: Partial<CustomColorConfig>;
    /** auto: the weather's own values set how much rain, snow, cloud, fog and wind there is; manual: engine_settings do. Auto unless engine_settings tune something */
    engine_mode?: 'auto' | 'manual';
    engine_settings?: Partial<WeatherEngineSettings>;
    // Day/night cycle settings
    enable_day_night_cycle?: boolean;
    sunrise_hour?: number;
    sunset_hour?: number;
    [key: string]: any; // Allow additional properties for flexibility
}

/**
 * Interface for the card element as seen by animation functions and controllers.
 * Avoids `as any` casts when accessing custom properties on the card element.
 */
export interface AnimatedWeatherCardElement extends HTMLElement {
    animationController?: AnimationController;
    timeOfDayManager?: any; // TimeOfDayManager — imported in consumer files
    animationsPaused?: boolean;
    config?: AnimatedWeatherCardConfig;
}

// Animation system types with enhanced type safety

/**
 * GSAP animation handle type
 */
export interface GSAPAnimation {
    parent?: GSAPAnimation | null;
    kill(): void;
    pause(): GSAPAnimation;
    resume(): GSAPAnimation;
    restart(): GSAPAnimation;
    reverse(): GSAPAnimation;
    isActive(): boolean;
    progress(): number;
    progress(value: number): GSAPAnimation;
    duration(): number;
    duration(value: number): GSAPAnimation;
}

/**
 * Animation state with proper type safety
 */
export interface AnimationState {
    isActive: boolean;
    isPaused: boolean;
    intensity?: number;
    animationHandles?: any[];
    timeouts?: any[];
    cssAnimations?: HTMLElement[];
    startTime?: number;
    lastUpdateTime?: number;
    errorCount?: number;
}

/**
 * Animation state keys - the actual animation type properties
 */
export type AnimationStateKey = 'rain' | 'snow' | 'sleet' | 'wind' | 'lightning' | 'clouds' | 'fog' | 'stars' | 'sun';

/** The rain's kind: how fast it falls and how long its drops are (rain-animation.ts) */
export type RainKind = 'light' | 'rain' | 'storm' | 'pouring';

/**
 * The weather engine's amounts in auto mode (engine_mode, engine.ts): how much of each weather to show. Plain names,
 * because the forecast bundle hands the card an hour's.
 */
export interface EngineAmounts {
    /** The rain's kind, and its drops on a 420 × 230 card (the card's area scales them) */
    rain: { kind: RainKind; drops: number };
    /** Snow and sleet: how many times the usual flakes */
    snow: number;
    sleet: number;
    /** Clouds at each depth, back to front */
    clouds: [number, number, number];
    /** Fog's thickness, 0.45 to 1 */
    fog: number;
    /** Leaves: how many times the usual */
    leaves: number;
    /** Gusts, 0 to 1: more and stronger swooshes */
    gusts: number;
    /** A clear night's stars: the share shown */
    stars: number;
}

/**
 * Animation controller state - data-only properties for animation states
 */
export type AnimationControllerStates = Record<AnimationStateKey, AnimationState>;

/**
 * Animation controller with strict state management
 */
export interface AnimationController extends AnimationControllerStates {
    // Controller methods
    startAnimation?: (type: AnimationType, config?: Partial<AnimationConfig>) => Promise<void>;
    stopAnimation?: (type: AnimationType) => Promise<void>;
    pauseAnimation?: (type: AnimationType) => void;
    resumeAnimation?: (type: AnimationType) => void;
    pauseAll?: () => void;
    resumeAll?: () => void;
    stopAll?: () => Promise<void>;
    updateConfig?: (config: Partial<WeatherEngineSettings>) => void;
    cleanup?: () => Promise<void>;
}

/**
 * Animation types enum for type safety
 */
export type AnimationType = 
    | 'rain' 
    | 'snow' 
    | 'sleet' 
    | 'wind' 
    | 'lightning' 
    | 'clouds' 
    | 'fog' 
    | 'stars' 
    | 'sun';

/**
 * Weather condition types with strict validation
 */
export type WeatherCondition = 
    | 'sunny'
    | 'clear-night'
    | 'partly-cloudy'
    | 'cloudy'
    | 'rainy'
    | 'light-rain'
    | 'pouring'
    | 'stormy'
    | 'snowy'
    | 'snowy-rainy'
    | 'snowy-stormy'
    | 'sleety'
    | 'sleety-stormy'
    | 'windy'
    | 'foggy';

/**
 * Animation configuration with validation
 */
export interface AnimationConfig {
    enabled: boolean;
    intensity: number; // 0.0 to 2.0
    duration?: number; // milliseconds
    delay?: number; // milliseconds
    easing?: string;
    customParams?: Record<string, number | string | boolean>;
    particleCount?: number;
    particleSize?: number;
    windEffect?: number;
    colorOverride?: string;
    opacityOverride?: number;
}

/**
 * Weather animation mapping with type safety
 */
export type WeatherAnimationMapping = {
    readonly [K in WeatherCondition]: {
        readonly animations: readonly AnimationType[];
        readonly overrides?: Readonly<Partial<Record<AnimationType, Partial<AnimationConfig>>>>;
        readonly backgroundGradient?: string;
        readonly textColor?: string;
        readonly iconColor?: string;
    };
};

/**
 * GSAP library interface
 */
export interface GSAP {
    to(target: any, vars: Record<string, any>): GSAPAnimation;
    from(target: any, vars: Record<string, any>): GSAPAnimation;
    fromTo(target: any, fromVars: Record<string, any>, toVars: Record<string, any>): GSAPAnimation;
    set(target: any, vars: Record<string, any>): GSAPAnimation;
    timeline(vars?: Record<string, any>): GSAPTimeline;
    killTweensOf(target: any): void;
    getTweensOf(target: any, onlyActive?: boolean): GSAPAnimation[];
    /** A call after a delay that pauses and resumes like a tween (a particle that joins the weather waits its turn) */
    delayedCall(delay: number, callback: () => void): GSAPAnimation;
    /** A tweened property's current value (the forecast reads a cloud track's height to move it above its words) */
    getProperty(target: any, property: string): number | string;
    globalTimeline: GSAPTimeline;
    ticker: {
        add(callback: () => void): void;
        remove(callback: () => void): void;
        fps(value?: number): number;
    };
    utils: {
        random(min: number, max: number, snap?: number): number;
        clamp(min: number, max: number, value: number): number;
        interpolate(start: any, end: any, progress: number): any;
    };
}

/**
 * GSAP Timeline interface
 */
export interface GSAPTimeline {
    to(target: any, vars: Record<string, any>, position?: string | number): GSAPTimeline;
    from(target: any, vars: Record<string, any>, position?: string | number): GSAPTimeline;
    fromTo(target: any, fromVars: Record<string, any>, toVars: Record<string, any>, position?: string | number): GSAPTimeline;
    set(target: any, vars: Record<string, any>, position?: string | number): GSAPTimeline;
    add(child: GSAPAnimation | GSAPTimeline | (() => void), position?: string | number): GSAPTimeline;
    call(callback: () => void, params?: any[], scope?: any, position?: string | number): GSAPTimeline;
    pause(): GSAPTimeline;
    resume(): GSAPTimeline;
    restart(): GSAPTimeline;
    reverse(): GSAPTimeline;
    kill(): void;
    clear(): GSAPTimeline;
    isActive(): boolean;
    progress(): number;
    progress(value: number): GSAPTimeline;
    duration(): number;
    duration(value: number): GSAPTimeline;
    totalDuration(): number;
    totalDuration(value: number): GSAPTimeline;
    repeat(value: number): GSAPTimeline;
    repeatDelay(value: number): GSAPTimeline;
    yoyo(value: boolean): GSAPTimeline;
    timeScale(): number;
    timeScale(value: number): GSAPTimeline;
}

/**
 * Custom card definition
 */
export interface CustomCardDefinition {
    readonly type: string;
    readonly name: string;
    readonly description: string;
    readonly preview: boolean;
    readonly documentationURL: string;
    readonly version?: string;
    /**
     * The card picker's suggestions for an entity someone picked (Home
     * Assistant 2026.6 and later): one, several with labels, or null
     */
    readonly getEntitySuggestion?: (hass: HomeAssistant, entityId: string) => CardSuggestion | CardSuggestion[] | null;
}

/** A card the picker suggests: its config, and a label after its name when there are several */
export interface CardSuggestion {
    config: Record<string, unknown> & { type: string };
    label?: string;
}

/**
 * Extended Window interface with proper typing
 */
declare global {
    interface Window {
        /** The card's own GSAP, bundled into animated-weather-card.js and set there; the planes bundle reads it too */
        AnimatedWeatherCardGsap: GSAP;
        customCards: CustomCardDefinition[];
        /** The dev card's world (dev-link.ts), set by the dev bundle (animated-weather-card-dev.js): the cards' clock and Home Assistant as they read it */
        AnimatedWeatherCardDev?: import('./dev-link').DevWorld;
        /** Set by the dev bundle when it loads: what draws the dev card */
        AnimatedWeatherCardDevCards?: import('./dev-link').DevCards;
        /** The cards on the page, for the dev card (dev-link.ts) */
        AnimatedWeatherCardsOnPage?: Set<import('./dev-link').DevCard>;
        /** Set by the note bundle (animated-weather-card-note.js) when it loads */
        AnimatedWeatherCardNote?: new (host: import('./note-generator').NoteHost) => import('./note-generator').NoteWriter;
        /** Set by the planes bundle (animated-weather-card-planes.js) when it loads */
        AnimatedWeatherCardPlanes?: typeof import('./planes-animation').PlanesAnimation;
        /** Set by the forecast bundle (animated-weather-card-forecast.js) when it loads: the forecast's drawings */
        AnimatedWeatherCardForecast?: import('./forecast-host').ForecastViews;
        /** The page's forecast subscriptions, made by the first bundle that asks (forecast-data.ts) */
        AnimatedWeatherCardForecasts?: import('./forecast-data').ForecastHub;
        animatedWeatherCardBannerShown?: boolean;
        loadCardHelpers?: () => Promise<{
            createCardElement: (config: Record<string, any>) => HTMLElement;
            createConfigElement: (type: string) => HTMLElement;
        }>;
    }

    /** Chrome-only non-standard Performance.memory API */
    interface Performance {
        memory?: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
        };
    }
}

// Time of day management interfaces with enhanced typing

/**
 * Time phase enum for better type safety
 */
export type TimePhase = 'dawn' | 'day' | 'dusk' | 'night';

/**
 * Time of day configuration
 */
export interface TimeOfDayConfig {
    readonly enableDayNightCycle?: boolean;
    readonly sunriseHour?: number; // 0-23
    readonly sunsetHour?: number; // 0-23
    readonly dawnDuration?: number; // minutes
    readonly duskDuration?: number; // minutes
    readonly useBrowserTime?: boolean;
    readonly timeZone?: string;
    readonly latitude?: number;
    readonly longitude?: number;
}

/**
 * Time of day state
 */
export interface TimeOfDayState {
    isDaytime: boolean;
    isNighttime: boolean;
    isDawn: boolean;
    isDusk: boolean;
    currentHour: number;
    currentMinute?: number;
    timePhase: TimePhase;
    sunriseTime?: Date;
    sunsetTime?: Date;
    transitionProgress?: number; // 0-1 for dawn/dusk transitions
}

/**
 * Day/night color scheme
 */
export interface DayNightColors {
    readonly day: string;
    readonly night: string;
    readonly dawn?: string;
    readonly dusk?: string;
}

/**
 * Time of day manager interface
 */
export interface TimeOfDayManager {
    readonly config: TimeOfDayConfig;
    getCurrentState(): TimeOfDayState;
    getTimeAwareColor(colors: DayNightColors): string;
    isEnabled(): boolean;
    updateConfig(config: Partial<TimeOfDayConfig>): void;
    subscribe(callback: (state: TimeOfDayState) => void): () => void;
}

/**
 * Error types for better error handling
 */
export class AnimationError extends Error {
    constructor(
        message: string,
        public readonly animationType: AnimationType,
        public readonly code: string,
        public readonly recoverable: boolean = true
    ) {
        super(message);
        this.name = 'AnimationError';
    }
}

export class ConfigError extends Error {
    constructor(
        message: string,
        public readonly field: string,
        public readonly expectedType: string,
        public readonly actualValue: any
    ) {
        super(message);
        this.name = 'ConfigError';
    }
}

/**
 * Performance monitoring types
 */
export interface PerformanceMonitor {
    startMeasurement(name: string): void;
    endMeasurement(name: string): number;
    recordMetric(name: string, value: number): void;
    getMetrics(): Record<string, number[]>;
    clearMetrics(): void;
    getAverageMetric(name: string): number;
    isPerformanceIssue(): boolean;
}

/**
 * Utility type for readonly deep object (simplified for compatibility)
 */
export type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]>; } : T;

/**
 * Utility type for optional properties
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;