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
    locale?: { language: string; time_format?: 'language' | 'system' | '12' | '24'; number_format?: string };
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
    stormIntensity?: number;
    fogDensity?: number;
    starCount?: number;
}

/**
 * Custom color configuration with validation
 */
export interface CustomColorConfig {
    background_sunny?: string;
    background_cloudy?: string;
    background_rainy?: string;
    background_stormy?: string;
    background_snowy?: string;
    background_foggy?: string;
    background_clear_night?: string;
    text_primary?: string;
    text_secondary?: string;
    icon_color?: string;
    animation_rain?: string;
    animation_snow?: string;
    animation_wind?: string;
    animation_lightning?: string;
    animation_clouds?: string;
    animation_fog?: string;
    animation_stars?: string;
    // Legacy color properties for backward compatibility
    rain_color?: string;
    snow_color?: string;
    [key: string]: string | undefined;
}

/**
 * Main configuration interface with comprehensive typing
 */
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
    show_attributes?: boolean;
    show_attribute_labels?: boolean;
    show_attribute_icons?: boolean;
    show_location?: boolean;
    show_indoor?: boolean;
    /** How the indoor reading is introduced: the word (default), an icon, or both */
    indoor_style?: 'label' | 'icon' | 'both';
    /** One line: the temperature and condition over the moving sky */
    compact?: boolean;
    show_sun?: boolean;
    animate?: boolean;
    auto_pause?: boolean;
    dev_mode?: boolean;
    disable_lightning_shake?: boolean;
    /** Let rain, snow, sleet and leaves fall out of the card (default true). */
    spill_particles?: boolean;
    color_palette?: 'default' | 'theme';
    custom_colors?: Partial<CustomColorConfig>;
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
}

/**
 * Extended Window interface with proper typing
 */
declare global {
    interface Window {
        gsap: GSAP;
        customCards: CustomCardDefinition[];
        /** Set by the dev panel bundle (animated-weather-card-dev.js) when it loads */
        AnimatedWeatherCardDevPanel?: new (card: import('./dev-panel').DevPanelHost) => import('./dev-panel').DevPanel;
        /** Set by the note bundle (animated-weather-card-note.js) when it loads */
        AnimatedWeatherCardNote?: new (host: import('./note-generator').NoteHost) => import('./note-generator').NoteWriter;
        /** Set by the planes bundle (animated-weather-card-planes.js) when it loads */
        AnimatedWeatherCardPlanes?: typeof import('./planes-animation').PlanesAnimation;
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