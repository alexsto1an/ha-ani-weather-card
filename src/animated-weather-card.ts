// GSAP, bundled: the card never fetches code at runtime, and moves without internet access
import { gsap } from 'gsap';
// Import types
import { HomeAssistant, HassEntity, LovelaceCard, AnimatedWeatherCardConfig, TimeOfDayState, AnimatedWeatherCardElement, GSAP } from './types';
// Import constants
import {
    DEFAULT_CONFIG,
    CARD_VERSION
} from './constants';
// Import utilities
import {
    getWeatherSettings,
    clearPendingTimeouts,
    killCardGSAPAnimations,
    pauseCardGSAPAnimations,
    resumeCardGSAPAnimations,
    getWeatherClass,
    devLog,
    escapeHtml,
    cardLocalize
} from './utils';
// Import the animation controller. Every per-condition animation is now
// served by a modular `*-animation.ts` class via the controller's bridge.
import { WeatherAnimationController } from './animation-controller';
// Defensive cleanup helpers — fog/snow add elements to the card directly
// (outside the per-type layers), so we wipe them on full teardown to catch
// stragglers from a previously-stopped animation.
import { clearFogLayers, clearSnowAccumulation, removeClouds } from './gsap-effects';
// Plane fly-overs (Flightradar24). Owned by the card, not the controller,
// because planes don't depend on the weather condition. They're a separate
// bundle, loaded only by cards that fly them (see startPlanes).
import type { PlanesAnimation } from './planes-animation';
import { FlightInfo, FlightTracker, readFlights } from './flight-tracker';
// Import time management
import { TimeOfDayManager } from './time-manager';
// Import styles
import { getMainCardStyles } from './styles';
import type { DevPanel } from './dev-panel';
import type { NoteWriter, NoteStage } from './note-generator';
// NOTE: the config editor is lazy-loaded via a separate bundle in
// `getConfigElement()`. We deliberately do NOT import it here — that's what
// keeps the runtime bundle (loaded on every dashboard) free of the editor's
// markup, styles, and entity-picker scaffolding.
// Import weather data processing
import { processWeatherData, readNote, noteExpiresAt, WeatherNote } from './weather-data';
import { localizeString, formatTime, timeHtml, localeKey } from './localize';
// Sky palettes (condition × time of day) and their animatable properties
import { registerSkyProperties, skyPhaseFromSun, SkyPhase, skyColors, SKY_TEXT, oklchToSrgb, toHex } from './sky';
// Import color utilities
import { generateCustomColorStyles } from './color-utils';
// Register the sun tracker card (bundled into same JS file)
import './sun-tracker-card';

registerSkyProperties();

/** The wind arrow points where the wind blows to; it's named for where it comes from */
const windArrowLabel = (bearing: number) => `Wind from ${Math.round(bearing)}°`;
const pressureTrendIcon = (trend: 'rising' | 'falling') => trend === 'rising' ? 'mdi:arrow-top-right' : 'mdi:arrow-bottom-right';

/** The sun metric shows the next sunset by day and the next sunrise by night */
const sunMetricIcon = (aboveHorizon: boolean) => aboveHorizon ? 'mdi:weather-sunset-down' : 'mdi:weather-sunset-up';

/**
 * A written note types itself in, the way a chatbot's answer arrives: this
 * long a character, but never shorter or longer than the bounds, however
 * long the note.
 */
const NOTE_TYPE_MS_PER_CHAR = 18;
const NOTE_TYPE_MIN_MS = 450;
const NOTE_TYPE_MAX_MS = 1600;

/** How long the old weather takes to fade out on a condition change (matches .condition-out in card.ts). */
const CONDITION_FADE_OUT_MS = 400;
/** Hero value fade-through: out, swap, then in with a small rise */
const HERO_FADE_OUT_MS = 120;
const HERO_FADE_IN_MS = 220;
/** Room the metrics row needs to spare before a 2×2 grid switches back to one row. */
const METRICS_ROW_SLACK_PX = 24;

// The card's own GSAP, for every animation, here and in the planes bundle.
// Never window.gsap: another card on the dashboard may bring a different
// version, and this one is left alone for it.
window.AnimatedWeatherCardGsap = gsap as unknown as GSAP;


/**
 * The layouts a fixed frame steps down through until nothing overflows,
 * roomiest first (see applySizeState). The compact variant has no "minimal"
 * of its own: its "tight" rules hold for both last steps.
 */
export const HEIGHT_STEPS = ['regular', 'compact', 'short', 'tight', 'minimal'] as const;

/**
 * With a note, it's the first thing to give way. First the spacing
 * tightens to keep the longer note whole (close: regular's sizes with
 * short's gaps), then it shortens to one line, then the temperature
 * shrinks to keep that (snug: short's sizes with the location and the
 * line under the condition kept), then it goes, before anything else
 * does. Then the steps above, without it.
 */
export const NOTE_FIT_STEPS: ReadonlyArray<readonly [string, 'long' | 'line' | 'none']> = [
    ['regular', 'long'],
    ['close', 'long'],
    ['regular', 'line'],
    ['snug', 'line'],
    ...HEIGHT_STEPS.map(height => [height, 'none'] as const),
];

class AnimatedWeatherCard extends HTMLElement implements LovelaceCard {
    public config?: AnimatedWeatherCardConfig;
    private _hass?: HomeAssistant;
    private _initialRender: boolean = true;
    /** Dev mode's condition (public for the dev panel, like the members below) */
    currentDevCondition?: string;
    private isInitializing: boolean = false;
    animationController?: WeatherAnimationController;
    private animationInitTimeout?: ReturnType<typeof setTimeout>;
    private pendingTimeouts: any[] = [];
    animationsPaused: boolean = false;
    private currentWeatherClass: string = '';
    wasManuallyPaused: boolean = false;
    private _needsAnimationRestart: boolean = false;
    private currentWindSpeedValue: number = 10; // Store current wind speed for animations
    devTimeOverride: boolean = false; // The dev panel is forcing the time of day
    timeOfDayManager?: TimeOfDayManager; // Day/night cycle manager
    /** Developer panel, loaded on demand in dev mode (see mountDevPanel) */
    private devPanel?: DevPanel;
    private _animationGeneration: number = 0; // Incremented on each initializeAnimations to invalidate stale deferred starts
    private _lastPressureValue?: number; // The reading the pressure trend is measured from
    private _pressureTrend?: 'rising' | 'falling';
    private visibilityChangeHandler: (() => void) | null = null;
    private windowFocusHandler: (() => void) | null = null;
    private windowBlurHandler: (() => void) | null = null;
    private intersectionObserver?: IntersectionObserver;
    // Why the card can't be seen right now (see updateAutoPause)
    private tabHidden = false;
    private offscreen = false;
    private windowBlurred = false;
    private resizeObserver?: ResizeObserver;
    private conditionChangeTimeout?: ReturnType<typeof setTimeout>;
    /** Text a hero value is fading through to (see fadeThrough) */
    private heroTextPending = new WeakMap<HTMLElement, string>();
    private planes?: PlanesAnimation;
    /** Started and not stopped since: the planes bundle, once loaded, finishes the start */
    private planesWanted = false;
    private flightTracker = new FlightTracker();
    private lastFlightsState?: HassEntity; // Skip hass pushes that didn't touch the flights sensor
    /** Hides the note when it stops being true (see currentNote) */
    private noteExpiryTimer?: ReturnType<typeof setTimeout>;
    /** Writes the note with the AI Task (show_note), loaded on demand (see mountNoteWriter) */
    private noteWriter?: NoteWriter;
    /** The note it last wrote, or found in the user's storage */
    private writtenNote: WeatherNote | null = null;
    /** A new note is on its way, and where it is: the status holds its place (NoteHost.noteWriting) */
    private noteComing: NoteStage | false = false;
    /** A note typing itself in (see typeIn) */
    private noteTyping?: { text: string; finish(): void };
    static getStubConfig(): AnimatedWeatherCardConfig {
        return DEFAULT_CONFIG;
    }

    static get properties() {
        return {
            hass: {},
            config: {}
        };
    }

    setConfig(config: AnimatedWeatherCardConfig): void {
        if (!config.entity && !config.dev_mode) {
            throw new Error('You need to define an entity or enable dev mode');
        }

        // Validate hour bounds — YAML edits can bypass the editor's range
        // restriction and feed bad numbers into time-manager wrap-around math.
        const hourValid = (h: unknown): boolean =>
            h === undefined || (typeof h === 'number' && isFinite(h) && h >= 0 && h <= 23);
        if (!hourValid(config.sunrise_hour)) {
            throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${config.sunrise_hour})`);
        }
        if (!hourValid(config.sunset_hour)) {
            throw new Error(`sunset_hour must be a number between 0 and 23 (got ${config.sunset_hour})`);
        }

        const oldAutoPause = this.config?.auto_pause;
        // A different flights sensor has its own flight ids; seed it afresh
        // so switching sensors doesn't fire a fly-over for every plane.
        if (this.config?.flights_entity !== config.flights_entity) {
            this.flightTracker.reset();
            this.lastFlightsState = undefined;
        }
        this.config = config;

        // Initialize or update animation controller
        if (this.isConnected) {
            // Initialize time of day manager first so the controller can use it
            this.initializeTimeOfDayManager();

            // Stop the previous controller before replacing it — otherwise its
            // intervals, timeouts, and registered GSAP tweens keep firing forever,
            // which is the root cause of animation pileup across config edits.
            const previousController = this.animationController;
            // Invalidate any deferred animation init from the previous generation
            this._animationGeneration++;
            this.animationController = new WeatherAnimationController(
                this,
                this.config,
                () => this.animationsPaused,
                this.timeOfDayManager
            );
            if (previousController) {
                previousController.stopAllAnimations().catch((err) =>
                    devLog(this.config?.dev_mode, 'Error stopping previous animation controller:', err)
                );
            }
        }

        // A new tone, entity or AI Task means a different note
        if (this.isConnected) {
            this.noteWriter?.stop();
            this.noteWriter = undefined;
            this.writtenNote = null;
            this.noteComing = false;
            this.mountNoteWriter();
        }

        // auto_pause adds or removes the window focus listeners
        if (this.isConnected && !!config.auto_pause !== !!oldAutoPause) {
            this.removeVisibilityTracking();
            this.setupVisibilityTracking();
        }
    }

    connectedCallback(): void {
        // :host styles don't apply in light DOM, so set inline.
        // position: relative → anchor for dev controls
        // height: 100% → respect layout panel height setting
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.height = '100%';

        if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.applySizeState();
                if (this.devPanel?.isOpen) this.devPanel.dock();
            });
            this.resizeObserver.observe(this);
            // Text metrics change when the web font swaps in
            document.fonts?.ready.then(() => this.applySizeState()).catch(() => {});
        }

        // On reconnect (not the first render), skip the full DOM rebuild
        // to avoid the skeleton flash and animation restart.
        // Reuse the existing controller — it was stopped in disconnectedCallback
        // but still knows the correct config. Creating a new one loses track of
        // DOM elements and causes animation pileup.
        const isReconnect = !this._initialRender && this.querySelector('.animated-weather-card');
        if (isReconnect) {
            // Re-init time manager (it was destroyed in disconnectedCallback)
            if (this.config) {
                this.initializeTimeOfDayManager();
                // Only create controller if we don't have one
                if (!this.animationController) {
                    this.animationController = new WeatherAnimationController(
                        this, this.config,
                        () => this.animationsPaused,
                        this.timeOfDayManager
                    );
                }
            }
            this.attachEventListeners();
            this.setupVisibilityTracking();
            // Sync visible text to current entity state — HA may have pushed
            // updates while we were disconnected and the existing DOM still
            // shows the pre-disconnect values.
            this._updateDataInPlace();
            this.initializeAnimations();
            return;
        }

        // First render — full initialization
        if (this.config) {
            this.initializeTimeOfDayManager();
            this.animationController = new WeatherAnimationController(
                this,
                this.config,
                () => this.animationsPaused,
                this.timeOfDayManager
            );
        }

        this._initialRender = false;
        this.render();
        this.setupVisibilityTracking();
        // Initialize animations so the loading skeleton is removed.
        this.initializeAnimations();
        // Enable transitions after initial render
        requestAnimationFrame(() => {
            const card = this.querySelector('.animated-weather-card') as HTMLElement;
            if (card) {
                card.classList.remove('no-transitions');
                card.classList.add('transitions-enabled');
            }
        });
    }



    render() {
        if (!this.config || (!this.hass && !this.config.dev_mode)) return;

        // Kill GSAP tweens on OLD elements BEFORE innerHTML replaces the DOM.
        // After innerHTML, old elements are detached and killTweensOf can't find them.
        killCardGSAPAnimations(this);
        // In-flight planes are about to be detached; drop the overlay so their
        // killed tweens can't hold its concurrency slots. initializeAnimations
        // starts a fresh one.
        this.stopPlanes();

        // Set defaults for new options
        const colorPalette = this.config.color_palette || 'default';

        // Process weather data using extracted function
        let weatherData;
        try {
            weatherData = processWeatherData(this.hass, this.config, this.currentDevCondition);
        } catch (error) {
            const message = (error as Error)?.message || 'Error loading weather data';
            this.innerHTML = `
              <ha-card>
                <div class="awc-empty-state" role="status">
                  <ha-icon class="awc-empty-icon" icon="mdi:weather-cloudy-alert"></ha-icon>
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${escapeHtml(message)}</div>
                  <div class="awc-empty-hint">Open the card editor to choose a weather entity.</div>
                </div>
                <style>
                  .awc-empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    padding: 32px 16px;
                    text-align: center;
                    color: var(--primary-text-color, #333);
                  }
                  .awc-empty-icon {
                    --mdc-icon-size: 48px;
                    color: var(--secondary-text-color, #888);
                  }
                  .awc-empty-title {
                    font-size: 1.1rem;
                    font-weight: 500;
                  }
                  .awc-empty-message {
                    font-size: 0.9rem;
                    color: var(--secondary-text-color, #888);
                  }
                  .awc-empty-hint {
                    font-size: 0.85rem;
                    color: var(--secondary-text-color, #888);
                    opacity: 0.8;
                  }
                </style>
              </ha-card>
            `;
            return;
        }

        const { temperature, weatherCondition, location, humidity, windSpeed, windSpeedValue, windBearing, pressure, pressureValue, feelsLike, indoorTemperature, indoorHumidity, sun } = weatherData;

        const pressureTrend = this.updatePressureTrend(pressureValue);

        // Store wind speed value for animations
        this.currentWindSpeedValue = windSpeedValue;

        // Next sunrise or sunset as a clock time. A countdown goes stale
        // between sun entity updates; the time never does.
        const sunIsDay = sun?.aboveHorizon ?? false;
        const sunEvent = sun ? formatTime(sunIsDay ? sun.sunset : sun.sunrise, this._hass) : '--';
        const showSun = this.config.show_sun !== false && !!sun && sunEvent !== '--';

        // Compact: the hero on one line, no metric row
        const compact = !!this.config.compact;

        // Generate custom color styles using extracted utility function
        const customColorStyles = generateCustomColorStyles(this.config);

        const showIcons = this.config.show_attribute_icons !== false;
        const showLabels = this.config.show_attribute_labels !== false;
        const metric = (kind: string, icon: string, labelText: string, valueHtml: string, extra = '') => {
            const label = (showIcons || showLabels)
                ? `<div class="attribute-label">${showIcons ? `<ha-icon class="attribute-icon" icon="${icon}"></ha-icon>` : ''}${showLabels ? `<span>${escapeHtml(labelText)}</span>` : ''}</div>`
                : '';
            return `<div class="attribute" data-kind="${kind}">${label}<div class="attribute-value"><span class="attribute-text">${valueHtml}</span>${extra}</div></div>`;
        };
        const windArrow = typeof windBearing === 'number'
            ? `<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${windBearing + 180}deg);" aria-label="${windArrowLabel(windBearing)}"></ha-icon>`
            : '';
        const trendArrow = pressureTrend
            ? `<ha-icon class="pressure-trend ${pressureTrend}" icon="${pressureTrendIcon(pressureTrend)}" aria-label="Pressure ${pressureTrend}"></ha-icon>`
            : '';
        const metrics = this.config.show_attributes !== false ? `
              <div class="weather-attributes${showLabels ? '' : ' values-only'}">${[
                metric('humidity', 'mdi:water-percent', cardLocalize(this._hass, 'ui.card.weather.attributes.humidity', 'Humidity'), escapeHtml(humidity)),
                metric('wind', 'mdi:weather-windy', cardLocalize(this._hass, 'ui.card.weather.attributes.wind_speed', 'Wind'), escapeHtml(windSpeed), windArrow),
                metric('pressure', 'mdi:gauge', cardLocalize(this._hass, 'ui.card.weather.attributes.air_pressure', 'Pressure'), escapeHtml(pressure), trendArrow),
                showSun ? metric('sun', sunMetricIcon(sunIsDay), localizeString(this._hass, sunIsDay ? 'sunset' : 'sunrise'),
                    timeHtml(sunEvent, 'awc-ampm')) : '',
              ].join('')}</div>` : '';

        this.innerHTML = `
      <ha-card>
        <div class="animated-weather-card no-transitions loading ${colorPalette === 'theme' ? 'theme-colors' : ''}"${this.config.spill_particles !== false ? ' data-spill' : ''}${compact ? ' data-variant="compact"' : ''} style="${escapeHtml(customColorStyles)}">
          <div class="sky" aria-hidden="true"></div>
          <div class="weather-skeleton" aria-hidden="true">
            <div class="skeleton-line"></div>
            <div class="skeleton-line large"></div>
            <div class="skeleton-line medium"></div>
            <div class="skeleton-line small"></div>
          </div>
          <div class="weather-content">
            <!-- Sky-borne animation layer (decorative) -->
            <div class="animation-layer" role="presentation" aria-hidden="true">
              <div class="sun-track"><div class="sun"></div></div>
              <div class="lightning" id="lightning"></div>
              <div class="planes-layer"></div>
            </div>

            <div class="weather-info" role="group" aria-label="Current weather">
              <div class="main-weather-info">
                ${(!compact && this.config.show_location !== false && location) ? `<div class="location">${escapeHtml(location)}</div>` : ''}
                <div class="temperature" aria-live="polite"><span class="temperature-value">${escapeHtml(temperature)}</span><span class="degree">°</span></div>
                <div class="weather-desc" aria-live="polite">${escapeHtml(weatherCondition)}</div>
                ${compact
                    ? `<div class="compact-meta">${escapeHtml(this.compactMeta(location, feelsLike))}</div>`
                    : `<div class="hero-meta">${this.heroMetaHtml(feelsLike, indoorTemperature, indoorHumidity)}</div>`}
                ${this.noteEnabled() ? this.noteHtml(this.currentNote()) : ''}
              </div>
              ${compact ? '' : metrics}
            </div>
          </div>

          <!-- Precipitation and wind containers (decorative) -->
          <div class="animation-container rain-container" aria-hidden="true">
            <div class="rain-layer"></div>
          </div>
          <div class="animation-container snow-container" aria-hidden="true">
            <div class="snow-layer"></div>
          </div>
          <div class="animation-container sleet-container" aria-hidden="true">
            <div class="sleet-layer"></div>
          </div>
          <div class="animation-container wind-container" aria-hidden="true">
            <div class="wind-layer"></div>
          </div>
          <div class="animation-container lightning-container" aria-hidden="true">
            <div class="lightning"></div>
          </div>
          <div class="animation-container clouds-container" aria-hidden="true">
            <div class="clouds-layer"></div>
          </div>
          <div class="animation-container fog-container" aria-hidden="true"></div>
          <div class="animation-container stars-container" aria-hidden="true"></div>
          <div class="animation-container sun-container" aria-hidden="true"></div>
        </div>
      </ha-card>
      
      <style>
        ${getMainCardStyles()}
      </style>
    `;

        // The DOM was replaced: rebind the dev panel and restore sky state.
        this.attachEventListeners();
        this.applySkyPhase();
        this.applySizeState();
        this.applySpill();
    }

    /**
     * Let spilled weather escape ha-card (or keep it clipped). The card's CSS
     * covers the usual case; the inline style and shadow-root rule cover HA
     * versions and themes where ha-card's :host clips with !important.
     */
    private applySpill(): void {
        const haCard = this.querySelector('ha-card') as HTMLElement | null;
        if (!haCard) return;
        const overflow = this.config?.spill_particles !== false ? 'visible' : 'hidden';
        haCard.style.setProperty('overflow', overflow, 'important');

        const injectShadowStyle = () => {
            const root = haCard.shadowRoot;
            if (!root) return;
            let style = root.querySelector('#awc-overflow') as HTMLStyleElement | null;
            if (!style) {
                style = document.createElement('style');
                style.id = 'awc-overflow';
                root.appendChild(style);
            }
            style.textContent = `:host { overflow: ${overflow} !important; }`;
        };
        injectShadowStyle();
        if (!haCard.shadowRoot && typeof customElements !== 'undefined') {
            customElements.whenDefined('ha-card').then(() => requestAnimationFrame(injectShadowStyle));
        }
    }

    /**
     * Change condition without rebuilding the card: fade the old weather out
     * (CSS, .condition-out), then re-initialize, which swaps the condition
     * class (the sky cross-fades through its registered colors) and starts
     * the new weather, whose layers fade back in.
     */
    private transitionCondition(): void {
        const card = this.querySelector('.animated-weather-card') as HTMLElement | null;
        if (!card || card.classList.contains('loading')) {
            this.initializeAnimations();
            return;
        }
        card.classList.add('condition-out');
        if (this.conditionChangeTimeout) clearTimeout(this.conditionChangeTimeout);
        this.conditionChangeTimeout = setTimeout(() => {
            this.conditionChangeTimeout = undefined;
            if (this.isConnected) this.initializeAnimations();
        }, CONDITION_FADE_OUT_MS);
    }

    /** Secondary hero line: "Feels like 24°  Indoors 22° · 45%". */
    /** Compact's second line: where, and what it feels like ("Lisbon · Feels like 21°"). */
    /**
     * The note sits under the conditions on the full card; the one-line
     * strip has no room. Dev mode shows sample weather, which a real note
     * wouldn't be about.
     */
    private noteEnabled(): boolean {
        return !!(this.config?.note_entity || this.config?.show_note) && !this.config.compact && !this.config.dev_mode;
    }

    /**
     * Writing its own note (show_note, no note_entity): the writer is a
     * separate bundle (animated-weather-card-note.js), fetched the first
     * time a card needs it.
     */
    private mountNoteWriter(): void {
        if (!this.noteEnabled() || this.config?.note_entity || !this.isConnected) {
            this.noteWriter?.stop();
            this.noteWriter = undefined;
            return;
        }
        const Writer = window.AnimatedWeatherCardNote;
        if (Writer) {
            this.noteWriter ??= new Writer(this);
            this.noteWriter.start();
            return;
        }
        AnimatedWeatherCard.loadSiblingBundle('animated-weather-card-note', () => !!window.AnimatedWeatherCardNote)
            .then(() => {
                if (this.isConnected) this.mountNoteWriter();
            })
            .catch((err: Error) => console.warn(`Animated Weather Card: ${err.message}`));
    }

    /** Shown on screen: the tab visible and the card in view (NoteHost) */
    get noteVisible(): boolean {
        return !this.tabHidden && !this.offscreen;
    }

    /** The writer's note, or none (NoteHost) */
    showNote(note: WeatherNote | null): void {
        this.writtenNote = note;
        this.updateNote();
    }

    /** A new note is on its way, or not any more (NoteHost) */
    noteWriting(stage: NoteStage | false): void {
        if (this.noteComing === stage) return;
        this.noteComing = stage;
        this.updateNote();
    }

    /**
     * The note to show now, or null: none set, or stale. A note with a
     * `generated_at` is true for `note_max_age` minutes; a timer re-reads
     * it then, so it leaves the card even if nothing else updates.
     */
    private currentNote(): WeatherNote | null {
        clearTimeout(this.noteExpiryTimer);
        this.noteExpiryTimer = undefined;
        if (!this.config) return null;
        const note = this.config.note_entity ? readNote(this._hass, this.config) : this.writtenNote;
        const expires = note ? noteExpiresAt(note, this.config) : null;
        if (!note || expires === null) return note;
        const left = expires - Date.now();
        if (left <= 0) return null;
        // setTimeout's ceiling is ~24.8 days; a later expiry is re-read on the next update
        if (left < 2 ** 31 - 1) this.noteExpiryTimer = setTimeout(() => this.updateNote(), left + 50);
        return note;
    }

    /**
     * Both lengths are in the markup; the height step shows the one that
     * fits (see the note rules in card.ts). Plain text, never HTML.
     */
    private noteHtml(note: WeatherNote | null): string {
        return `<p class="weather-note"${note ? '' : ' hidden'}><span class="note-long">${escapeHtml(note?.note ?? '')}</span><span class="note-short">${escapeHtml(note?.line ?? '')}</span>`
            + '<span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>';
    }

    /** A changed note fades through like the hero; one that appears or goes just shows or hides. */
    private updateNote(): void {
        const el = this.querySelector('.weather-note') as HTMLElement | null;
        if (!el) return;
        const long = el.querySelector('.note-long') as HTMLElement | null;
        const short = el.querySelector('.note-short') as HTMLElement | null;

        // While a new one is written: a status in the note's place, saying
        // what's really happening, the size of the note it stands for
        const placeholder = el.dataset.writing !== undefined;
        if (this.noteComing && !this.config?.note_entity) {
            this.noteTyping?.finish();
            const phrase = el.querySelector('.note-phrase') as HTMLElement | null;
            const status = localizeString(this._hass, this.noteComing === 'forecast' ? 'note_reading' : 'note_writing');
            if (!placeholder || el.hidden) {
                if (phrase) phrase.textContent = status;
                el.dataset.writing = '';
                el.setAttribute('aria-busy', 'true');
                el.hidden = false;
                this.applySizeState();
            } else {
                this.fadeThrough(phrase, status);
            }
            return;
        }
        if (placeholder) {
            delete el.dataset.writing;
            el.removeAttribute('aria-busy');
        }

        const note = this.currentNote();
        if (!note) {
            this.noteTyping?.finish();
            if (!el.hidden || placeholder) {
                el.hidden = true;
                this.applySizeState();
            }
            return;
        }
        if (el.hidden || placeholder) {
            this.noteTyping?.finish();
            if (long) long.textContent = note.note;
            if (short) short.textContent = note.line;
            el.hidden = false;
            // Fit with the whole text in place first: typing only uncovers it
            this.applySizeState();
            if (placeholder) this.typeIn(el);
            return;
        }
        // Still typing this note: let it finish. A different one takes over.
        if (this.noteTyping) {
            if (this.noteTyping.text === note.note + note.line) return;
            this.noteTyping.finish();
        }
        // A note that wraps differently can change the layout: fit again once it's in
        const refit = () => this.applySizeState();
        this.fadeThrough(long, note.note, refit);
        this.fadeThrough(short, note.line, refit);
    }

    private compactMeta(location: string | undefined, feelsLike: string | null | undefined): string {
        return [
            this.config?.show_location !== false ? location : '',
            feelsLike ? `${localizeString(this._hass, 'feels_like')} ${feelsLike}` : '',
        ].filter(Boolean).join(' · ');
    }

    /**
     * What introduces the indoor reading (indoor_style): the word, in the
     * dashboard's language (default), a house-thermometer icon, or both.
     * With the icon alone the word stays for screen readers.
     */
    private indoorLead(): string {
        const style = this.config?.indoor_style;
        const word = escapeHtml(localizeString(this._hass, 'indoors'));
        const icon = '<ha-icon class="indoor-icon" icon="mdi:home-thermometer-outline"></ha-icon>';
        if (style === 'icon') return `${icon}<span class="awc-visually-hidden">${word} </span>`;
        const label = `<span class="indoor-label">${word}</span>`;
        return style === 'both' ? icon + label : label;
    }

    private heroMetaHtml(feelsLike: string | null | undefined, indoorTemperature: string, indoorHumidity: string): string {
        const parts: string[] = [];
        if (feelsLike) {
            parts.push(`<span class="feels-like">${escapeHtml(localizeString(this._hass, 'feels_like'))} ${escapeHtml(feelsLike)}</span>`);
        }
        const indoor = [indoorTemperature, indoorHumidity].filter(v => v && v !== '--');
        if (this.config?.show_indoor !== false && indoor.length) {
            parts.push(`<span class="indoor-climate-inline">${this.indoorLead()}${indoor.map(v => escapeHtml(v)).join('<span class="indoor-sep">·</span>')}</span>`);
        }
        return parts.join('');
    }


    /**
     * Developer mode: show the dev panel. Its code is a separate bundle
     * (animated-weather-card-dev.js), fetched the first time it's needed.
     */
    private mountDevPanel(): void {
        if (!this.config?.dev_mode) {
            this.devPanel?.disconnect();
            this.devPanel = undefined;
            return;
        }
        const Panel = window.AnimatedWeatherCardDevPanel;
        if (Panel) {
            this.devPanel ??= new Panel(this);
            this.devPanel.mount();
            return;
        }
        AnimatedWeatherCard.loadSiblingBundle('animated-weather-card-dev', () => !!window.AnimatedWeatherCardDevPanel)
            .then(() => {
                if (this.isConnected) this.mountDevPanel();
            })
            .catch((err: Error) => console.warn(`Animated Weather Card: ${err.message}`));
    }

    attachEventListeners() {
        this.mountDevPanel();
        this.mountNoteWriter();

        // Tap on the weather info opens the entity's more-info dialog —
        // the conventional HA card behavior. Skip in dev mode (there's no
        // real entity) and when no entity is configured.
        if (!this.config?.dev_mode && this.config?.entity) {
            const entity = this.config.entity;
            const info = this.querySelector('.weather-info') as HTMLElement | null;
            if (info && !info.dataset.tapBound) {
                info.dataset.tapBound = '1';
                info.style.cursor = 'pointer';
                info.setAttribute('role', 'button');
                info.setAttribute('tabindex', '0');
                const fireMoreInfo = () => {
                    this.dispatchEvent(new CustomEvent('hass-more-info', {
                        detail: { entityId: entity },
                        bubbles: true,
                        composed: true,
                    }));
                };
                info.addEventListener('click', fireMoreInfo);
                info.addEventListener('keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fireMoreInfo();
                    }
                });
            }
        }

        // Only run initial setup if not in the middle of a dev mode change.
        // Track this timeout so a fast disconnect/reconnect cycle doesn't queue
        // multiple un-cancellable initializers.
        if (!this.isInitializing) {
            const handle = window.setTimeout(() => {
                this.initializeAnimations();
                // Set initial condition if none selected
                if (this.config?.dev_mode && !this.currentDevCondition) {
                    this.currentDevCondition = 'sunny';
                }
            }, 100);
            this.pendingTimeouts.push(handle);
        }
    }

    setAnimationsPaused(paused: boolean) {
        this.animationsPaused = paused;
        // Rests the CSS loops too (sun breathing, star twinkles)
        this.toggleAttribute('data-paused', paused);

        if (this.animationsPaused) {
            this.animationController?.pauseAllAnimations();
            void this.planes?.pause();
            // Pause GSAP tweens scoped to this card instance — covers any
            // tween started outside the controller's per-type maps.
            pauseCardGSAPAnimations(this);
        } else {
            // If the DOM was rebuilt while paused (e.g. hass update triggered
            // render()), the existing tweens point at detached nodes and
            // resuming them would be a no-op. Do a full re-init instead.
            if (this._needsAnimationRestart) {
                this._needsAnimationRestart = false;
                this.initializeAnimations();
            } else {
                this.animationController?.resumeAllAnimations();
                void this.planes?.resume();
                resumeCardGSAPAnimations(this);
            }
        }

        // Update just the pause button without full re-render
        this.devPanel?.updatePauseButton();
    }

    // Get weather engine settings with defaults
    getWeatherSettings(realWindSpeed?: number) {
        if (!this.config) {
            throw new Error('getWeatherSettings called before setConfig');
        }
        return getWeatherSettings(this.config, realWindSpeed);
    }

    initializeAnimations() {
        // Prevent multiple rapid initializations
        if (this.isInitializing) return;
        this.isInitializing = true;

        // Increment generation — any deferred callback from an older generation is stale
        const generation = ++this._animationGeneration;

        try {
            if (!this.config) return;
            const config = this.config;
            const card = this.querySelector('.animated-weather-card') as HTMLElement;
            if (!card) {
                return;
            }
            this.clearAnimations();

            let condition: string;
            if (config.dev_mode) {
                condition = this.currentDevCondition || 'sunny';
            } else {
                if (!this.hass || !config.entity) {
                    return;
                }
                const entity = this.hass.states[config.entity];
                if (!entity) {
                    return;
                }
                condition = entity.state.toLowerCase();
            }

            const weatherClass = getWeatherClass(
                condition,
                config.dev_mode ?? false,
                config.sunrise_hour,
                config.sunset_hour,
                this._hass?.config?.time_zone
            );
            const themeClass = (config.color_palette || 'default') === 'theme' ? 'theme-colors' : '';
            // First paint: show the condition without transitions, then enable
            // them two frames later, so the card doesn't fade in from a
            // default sky. Every later change (condition, dusk → night) swaps
            // the class with transitions on, so the sky cross-fades.
            const firstPaint = card.classList.contains('loading');
            const applyCardClass = (...extra: string[]) => {
                card.className = ['animated-weather-card', weatherClass, ...extra, themeClass,
                    firstPaint ? 'no-transitions' : 'transitions-enabled'].filter(Boolean).join(' ');
                if (!firstPaint) return;
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    card.classList.remove('no-transitions');
                    card.classList.add('transitions-enabled');
                }));
            };

            // animate: false and OS-level reduced motion get a still sky: the
            // condition's colors and light, no weather motion. The CSS
            // @media block also hides the animation layers.
            const reducedMotion = typeof window !== 'undefined'
                && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
            if (config.animate === false || reducedMotion) {
                applyCardClass(config.animate === false ? 'static' : '');
                this.currentWeatherClass = weatherClass;
                return;
            }

            // Cancel any pending deferred initialization from a previous call
            if (this.animationInitTimeout) {
                clearTimeout(this.animationInitTimeout);
                this.animationInitTimeout = undefined;
            }

            // Defer weather class + animations together to prevent sun flash
            this.animationInitTimeout = setTimeout(() => {
                this.animationInitTimeout = undefined;
                // Guard: skip if card was disconnected, re-initialized, or superseded
                if (!this.isConnected) return;
                if (generation !== this._animationGeneration) return;

                applyCardClass();

                // If paused, update the card appearance but don't start animations.
                // Mark that we need a full re-init on resume since render() rebuilt the DOM.
                if (this.animationsPaused) {
                    this.currentWeatherClass = weatherClass;
                    this._needsAnimationRestart = true;
                    return;
                }

                if (this.animationController) {
                    this.animationController.setWindSpeed(this.currentWindSpeedValue);
                    this.animationController.applyWeatherCondition(weatherClass);
                }
                this.startPlanes();
            }, config.dev_mode ? 50 : 200);
        } finally {
            this.isInitializing = false;
        }
    }

    clearAnimations() {
        this.animationController?.stopAllAnimations();
        this.stopPlanes();

        // Kill GSAP tweens scoped to this card instance — defensive sweep for
        // tweens started outside the controller's per-type tracking.
        killCardGSAPAnimations(this);

        // Clear deferred initialization timeout
        if (this.animationInitTimeout) {
            clearTimeout(this.animationInitTimeout);
            this.animationInitTimeout = undefined;
        }

        // Clear particle elements
        const layers = this.querySelectorAll('.rain-layer, .snow-layer, .sleet-layer, .wind-layer');
        layers.forEach(layer => {
            layer.innerHTML = '';
        });

        const card = this.querySelector('.animated-weather-card') as HTMLElement;

        // Clear GSAP clouds (their own layer), stars and moon
        const animationLayer = this.querySelector('.animation-layer');
        if (animationLayer) {
            removeClouds(this);
            
            // Clear stars and moon
            const gsapStars = animationLayer.querySelectorAll('.star-gsap, .moon-gsap');
            gsapStars.forEach(star => {
                if (star.parentNode) {
                    star.parentNode.removeChild(star);
                }
            });

            // Clear planes whose tweens were just killed mid-flight
            animationLayer.querySelectorAll('.plane-gsap').forEach(plane => plane.remove());
        }
        
        // Clear fog layers and snow accumulation synchronously
        if (card) {
            clearFogLayers(card);
            clearSnowAccumulation(card);
        }

        // Remove lightning flash class and any pending lightning
        const lightning = this.querySelector('.lightning');
        if (lightning) {
            lightning.classList.remove('flash');
            lightning.innerHTML = '';
        }

        // Clear any pending timeouts that might trigger effects
        clearPendingTimeouts(this.pendingTimeouts);
    }


    set hass(hass: HomeAssistant) {
        const oldHass = this._hass;
        this._hass = hass;

        if (this.config) {
            // Flights are independent of the weather entity, so check them
            // before any of the weather-specific early returns below.
            this.handleFlightUpdates();
            this.noteWriter?.hassChanged();

            if (!oldHass) {
                // First time — full render
                this.render();
                this.initializeAnimations();
                return;
            }

            // A new language or clock format rebuilds the labels (a profile change, rare)
            if (localeKey(oldHass) !== localeKey(hass)) {
                this.render();
                this.initializeAnimations();
                return;
            }

            if (this.config.dev_mode) return; // Don't update in dev mode from hass changes
            if (!this.config.entity) return;

            const oldEntity = oldHass.states[this.config.entity];
            const newEntity = hass.states[this.config.entity];

            // Entity appeared or disappeared: rebuild.
            if (!oldEntity || !newEntity) {
                this.render();
                this.initializeAnimations();
                return;
            }

            // The condition changed: the text updates in place, the old
            // weather fades out, and the sky cross-fades to the new one.
            if (oldEntity.state !== newEntity.state) {
                this._updateDataInPlace();
                this.transitionCondition();
                return;
            }

            // Data-only changes: update text values in-place without touching DOM structure or animations
            let dataChanged = false;

            // Compare attributes by their displayed-value projection. Use a
            // sentinel for missing attributes so a legitimate 0 (calm wind,
            // 0% humidity) doesn't read as "unchanged" against undefined.
            const project = (v: unknown): string | number =>
                v == null ? '__missing__' : (typeof v === 'number' ? Math.round(v) : String(v));
            const attrs = ['temperature', 'humidity', 'wind_speed', 'pressure', 'wind_bearing', 'friendly_name'] as const;
            for (const a of attrs) {
                if (project(oldEntity.attributes[a]) !== project(newEntity.attributes[a])) {
                    dataChanged = true;
                    break;
                }
            }

            // A new note, in either length: the entity's state object is
            // replaced whenever its state or an attribute changes
            if (this.config.note_entity && oldHass.states[this.config.note_entity] !== hass.states[this.config.note_entity]) {
                dataChanged = true;
            }

            // Check configured sensor override entities for changes
            if (!dataChanged) {
                const sensorEntities = [
                    this.config.outdoor_sensor_entity,
                    this.config.feels_like_entity,
                    this.config.humidity_sensor_entity,
                    this.config.pressure_sensor_entity,
                    this.config.wind_speed_sensor_entity,
                    this.config.wind_direction_sensor_entity,
                    this.config.indoor_temperature_entity,
                    this.config.indoor_humidity_entity,
                    this.config.sun_entity,
                ];
                for (const entityId of sensorEntities) {
                    if (!entityId) continue;
                    const oldState = oldHass.states[entityId]?.state;
                    const newState = hass.states[entityId]?.state;
                    if (oldState !== newState) {
                        dataChanged = true;
                        break;
                    }
                }
            }

            if (dataChanged) {
                this._updateDataInPlace();
            } else {
                // The sky follows the sun even when no weather value changed.
                const sunId = this.config.sun_entity || 'sun.sun';
                if (oldHass.states[sunId] !== hass.states[sunId]) this.applySkyPhase();
            }
        }
    }

    /** Update only the text values in existing DOM elements — no innerHTML rebuild, no animation restart */
    private _updateDataInPlace(): void {
        if (!this.config || (!this._hass && !this.config.dev_mode)) return;

        let weatherData;
        try {
            weatherData = processWeatherData(this._hass, this.config, this.currentDevCondition);
        } catch (_) {
            return; // Don't blow up the card for a data-only update
        }

        const { temperature, weatherCondition, humidity, windSpeed, windSpeedValue, windBearing, pressure, pressureValue, feelsLike, indoorTemperature, indoorHumidity, sun } = weatherData;
        this.currentWindSpeedValue = windSpeedValue;

        // The temperature and condition fade through to a new value; the
        // metric values just swap, so the quiet tier stays quiet.
        const setText = (el: Element | null, value: string) => {
            if (el && el.textContent !== value) el.textContent = value;
        };

        this.fadeThrough(this.querySelector('.temperature-value'), temperature);
        this.fadeThrough(this.querySelector('.weather-desc'), weatherCondition);

        // Metric values: target the text span so wind / pressure arrows survive.
        const setAttrValue = (kind: string, value: string) => {
            setText(this.querySelector(`.weather-attributes .attribute[data-kind="${kind}"] .attribute-text`), value);
        };
        setAttrValue('humidity', humidity);
        setAttrValue('wind', windSpeed);
        setAttrValue('pressure', pressure);
        this.syncValueIcon('wind', 'wind-bearing-arrow', typeof windBearing === 'number' ? {
            icon: 'mdi:navigation',
            transform: `rotate(${windBearing + 180}deg)`,
            label: windArrowLabel(windBearing),
        } : null);
        const trend = this.updatePressureTrend(pressureValue);
        this.syncValueIcon('pressure', 'pressure-trend', trend ? {
            icon: pressureTrendIcon(trend),
            label: `Pressure ${trend}`,
            className: trend,
        } : null);
        if (sun) {
            // Next sunset by day, next sunrise by night: the label and icon
            // follow the sun across the horizon, not just the time
            const sunMetric = this.querySelector('.weather-attributes .attribute[data-kind="sun"]');
            const value = sunMetric?.querySelector('.attribute-text');
            const html = timeHtml(formatTime(sun.aboveHorizon ? sun.sunset : sun.sunrise, this._hass), 'awc-ampm');
            if (value && value.innerHTML !== html) value.innerHTML = html;
            setText(sunMetric?.querySelector('.attribute-label > span') ?? null,
                localizeString(this._hass, sun.aboveHorizon ? 'sunset' : 'sunrise'));
            const icon = sunMetric?.querySelector('.attribute-icon');
            if (icon && icon.getAttribute('icon') !== sunMetricIcon(sun.aboveHorizon)) {
                icon.setAttribute('icon', sunMetricIcon(sun.aboveHorizon));
            }
        }

        const compactMeta = this.querySelector('.compact-meta');
        if (compactMeta) setText(compactMeta, this.compactMeta(weatherData.location, feelsLike));
        // A renamed entity, or a name set later, reaches the location line too
        setText(this.querySelector('.location'), weatherData.location);

        const heroMeta = this.querySelector('.hero-meta');
        if (heroMeta) {
            const html = this.heroMetaHtml(feelsLike, indoorTemperature, indoorHumidity);
            if (heroMeta.innerHTML !== html) heroMeta.innerHTML = html;
        }

        this.updateNote();

        this.applySkyPhase();
        this.applySizeState();

        // Update wind speed for animation controller
        if (this.animationController) {
            this.animationController.setWindSpeed(windSpeedValue);
        }
    }

    /**
     * Rising or falling pressure, against the last reading that moved it by
     * 0.5 or more: small steps add up, and the arrow stays until the
     * pressure moves again rather than vanishing on unrelated updates.
     */
    private updatePressureTrend(value: number | null | undefined): 'rising' | 'falling' | null {
        if (typeof value !== 'number') return this._pressureTrend ?? null;
        if (typeof this._lastPressureValue !== 'number') {
            this._lastPressureValue = value;
        } else if (Math.abs(value - this._lastPressureValue) >= 0.5) {
            this._pressureTrend = value > this._lastPressureValue ? 'rising' : 'falling';
            this._lastPressureValue = value;
        }
        return this._pressureTrend ?? null;
    }

    /**
     * Keep a metric's arrow (wind direction, pressure trend) in step with the
     * data: turn or retitle it in place, add it, or remove it.
     */
    private syncValueIcon(kind: string, cls: string,
                          want: { icon: string; label: string; transform?: string; className?: string } | null): void {
        const value = this.querySelector(`.weather-attributes .attribute[data-kind="${kind}"] .attribute-value`);
        if (!value) return;
        let icon = value.querySelector(`.${cls}`) as HTMLElement | null;
        if (!want) {
            icon?.remove();
            return;
        }
        if (!icon) {
            icon = document.createElement('ha-icon');
            value.appendChild(icon);
        }
        icon.className = [cls, want.className].filter(Boolean).join(' ');
        if (icon.getAttribute('icon') !== want.icon) icon.setAttribute('icon', want.icon);
        icon.setAttribute('aria-label', want.label);
        icon.style.transform = want.transform ?? '';
    }

    /**
     * A hero value fades through to its new text: out quickly, swap, then in
     * with a small rise. Updates that arrive mid-fade land on the latest value.
     */
    /**
     * A written note types itself in, the way a chatbot's answer arrives.
     * The whole text stays laid out from the first frame, the part still to
     * come transparent rather than missing, so the lines break where they
     * will end up and the fit, already made, never moves. Screen readers get
     * all of it at once. With reduced motion, or animate: false, it's simply
     * there.
     */
    private typeIn(el: HTMLElement): void {
        this.noteTyping?.finish();
        if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || this.config?.animate === false) return;
        const spans = Array.from(el.querySelectorAll<HTMLElement>('.note-long, .note-short')).map(span => {
            const text = span.textContent ?? '';
            const typed = document.createElement('span');
            typed.className = 'note-typed';
            const rest = document.createElement('span');
            rest.className = 'note-untyped';
            rest.textContent = text;
            span.replaceChildren(typed, rest);
            return { span, text, typed, rest };
        });
        const longest = Math.max(0, ...spans.map(s => s.text.length));
        const duration = Math.min(NOTE_TYPE_MAX_MS, Math.max(NOTE_TYPE_MIN_MS, longest * NOTE_TYPE_MS_PER_CHAR));
        const frame = window.requestAnimationFrame?.bind(window) ?? ((step: FrameRequestCallback) => window.setTimeout(() => step(Date.now()), 16));
        const cancel = window.cancelAnimationFrame?.bind(window) ?? window.clearTimeout.bind(window);
        const start = Date.now();
        let handle = 0;
        const typing = {
            text: spans.map(s => s.text).join(''),
            finish: () => {
                cancel(handle);
                for (const s of spans) s.span.textContent = s.text;
                if (this.noteTyping === typing) this.noteTyping = undefined;
            },
        };
        const step = () => {
            const progress = Math.min(1, (Date.now() - start) / duration);
            for (const s of spans) {
                const shown = Math.round(progress * s.text.length);
                s.typed.textContent = s.text.slice(0, shown);
                s.rest.textContent = s.text.slice(shown);
            }
            if (progress < 1) handle = frame(step);
            else typing.finish();
        };
        this.noteTyping = typing;
        handle = frame(step);
    }

    private fadeThrough(el: HTMLElement | null, value: string, onSwap?: () => void): void {
        if (!el) return;
        const pending = this.heroTextPending.get(el);
        if ((pending ?? el.textContent) === value) return;
        const reducedMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (typeof el.animate !== 'function' || reducedMotion) {
            el.textContent = value;
            onSwap?.();
            return;
        }
        this.heroTextPending.set(el, value);
        if (pending !== undefined) return; // the running fade picks it up

        const settle = () => {
            const latest = this.heroTextPending.get(el);
            this.heroTextPending.delete(el);
            if (latest !== undefined) el.textContent = latest;
            onSwap?.();
        };
        const out = el.animate([{ opacity: 1 }, { opacity: 0 }],
            { duration: HERO_FADE_OUT_MS, easing: 'cubic-bezier(0.5, 0, 0.75, 0)', fill: 'forwards' });
        out.onfinish = () => {
            settle();
            el.animate([{ opacity: 0, transform: 'translateY(0.12em)' }, { opacity: 1, transform: 'none' }],
                { duration: HERO_FADE_IN_MS, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' });
            out.cancel();
        };
        // Cancelled from outside (a re-render): still show the newest value
        out.oncancel = settle;
    }

    get hass(): HomeAssistant | undefined {
        return this._hass;
    }

    /**
     * Start the plane overlay when a flights sensor is configured (or in dev
     * mode, for the demo button). Called at the end of initializeAnimations,
     * which already returns early for `animate: false` and reduced motion.
     * The overlay is a separate bundle (animated-weather-card-planes.js),
     * fetched the first time a card needs it; arrivals before then are
     * skipped, as they are while paused.
     */
    private startPlanes(): void {
        if (!this.config || this.planes) return;
        if (!this.config.flights_entity && !this.config.dev_mode) return;
        this.planesWanted = true;

        const Planes = window.AnimatedWeatherCardPlanes;
        if (!Planes) {
            AnimatedWeatherCard.loadSiblingBundle('animated-weather-card-planes', () => !!window.AnimatedWeatherCardPlanes)
                .then(() => {
                    if (this.planesWanted && this.isConnected) this.startPlanes();
                })
                .catch((err: Error) => console.warn(`Animated Weather Card: ${err.message}`));
            return;
        }
        const planes = new Planes(this, { intensity: 1, scale: 1, devMode: this.config.dev_mode || false }, this.config);
        this.planes = planes;
        planes.start()
            .then(() => {
                if (this.animationsPaused) void planes.pause();
            })
            .catch((err) => {
                console.error('Failed to start plane fly-overs:', err);
                if (this.planes === planes) this.planes = undefined;
            });
    }

    private stopPlanes(): void {
        this.planesWanted = false;
        const planes = this.planes;
        if (!planes) return;
        this.planes = undefined;
        planes.destroy().catch((err) => devLog(this.config?.dev_mode, 'Error stopping plane fly-overs:', err));
    }

    /** Diff the flights sensor and fly any newly arrived planes across the card. */
    private handleFlightUpdates(): void {
        if (!this.config?.flights_entity) return;
        // HA replaces a state object only when that entity changes.
        const state = this._hass?.states[this.config.flights_entity];
        if (state && state === this.lastFlightsState) return;
        this.lastFlightsState = state;
        const arrivals = this.flightTracker.update(readFlights(this._hass, this.config.flights_entity));
        if (arrivals.length) this.flyPlanes(arrivals);
    }

    /** Arrivals while paused (or before the overlay starts) are skipped, not queued. */
    flyPlanes(flights: FlightInfo[]): void {
        if (!this.planes || this.animationsPaused) return;
        // Lights need a night sky: on a theme's plain background they'd vanish
        // or glare, so there the plane stays a silhouette in the theme's colour
        this.planes.flyOver(flights, {
            night: this.config?.color_palette !== 'theme' && this.isNightForPlanes(),
            showLabels: this.config?.show_flight_labels !== false,
        });
    }

    private isNightForPlanes(): boolean {
        const card = this.querySelector('.animated-weather-card');
        if (card?.classList.contains('clear-night')) return true;
        if (this.timeOfDayManager && (this.timeOfDayManager.isEnabled() || this.devTimeOverride)) {
            return this.timeOfDayManager.getCurrentState().isNighttime;
        }
        const sun = this._hass?.states[this.config?.sun_entity || 'sun.sun'];
        return sun?.state === 'below_horizon';
    }

    /**
     * Pause while nobody can see the card: the tab is hidden, the card is
     * scrolled off-screen, or (with auto_pause) the browser window is in
     * the background. A manual pause from the dev panel always wins.
     */
    private updateAutoPause(): void {
        // Back in view: a stale note can be rewritten now
        if (this.noteVisible) this.noteWriter?.wake();
        if (this.wasManuallyPaused) return;
        const unseen = this.tabHidden || this.offscreen || (!!this.config?.auto_pause && this.windowBlurred);
        if (unseen !== this.animationsPaused) this.setAnimationsPaused(unseen);
    }

    setupVisibilityTracking(): void {
        // Don't set up if already active or if the card isn't connected to the
        // DOM. setConfig can fire on inactive instances (e.g. while the editor
        // is open) and there's no disconnectedCallback later to remove the
        // document/window-scoped listeners we'd register here.
        if (this.visibilityChangeHandler) return;
        if (!this.isConnected) return;

        this.tabHidden = document.hidden;
        this.visibilityChangeHandler = () => {
            this.tabHidden = document.hidden;
            this.updateAutoPause();
        };
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);

        // Off-screen cards (below the fold, another dashboard column) pause
        // too. The margin resumes them just before they scroll into view.
        if (typeof IntersectionObserver !== 'undefined') {
            this.intersectionObserver = new IntersectionObserver(entries => {
                this.offscreen = !entries[entries.length - 1].isIntersecting;
                this.updateAutoPause();
            }, { rootMargin: '100px' });
            this.intersectionObserver.observe(this);
        }

        // auto_pause: also pause while the browser window is in the background
        if (this.config?.auto_pause) {
            this.windowFocusHandler = () => {
                this.windowBlurred = false;
                this.updateAutoPause();
            };
            this.windowBlurHandler = () => {
                this.windowBlurred = true;
                this.updateAutoPause();
            };
            window.addEventListener('focus', this.windowFocusHandler);
            window.addEventListener('blur', this.windowBlurHandler);
        }

        this.updateAutoPause();
    }

    removeVisibilityTracking(): void {
        // Remove all visibility and focus event listeners
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
            this.visibilityChangeHandler = null;
        }
        this.intersectionObserver?.disconnect();
        this.intersectionObserver = undefined;
        if (this.windowFocusHandler) {
            window.removeEventListener('focus', this.windowFocusHandler);
            this.windowFocusHandler = null;
        }
        if (this.windowBlurHandler) {
            window.removeEventListener('blur', this.windowBlurHandler);
            this.windowBlurHandler = null;
        }
        this.tabHidden = false;
        this.offscreen = false;
        this.windowBlurred = false;
    }

    disconnectedCallback(): void {
        if (this.conditionChangeTimeout) clearTimeout(this.conditionChangeTimeout);
        this.conditionChangeTimeout = undefined;
        clearTimeout(this.noteExpiryTimer);
        this.noteExpiryTimer = undefined;
        this.noteWriter?.stop();
        this.noteTyping?.finish();
        this.clearAnimations();
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.removeVisibilityTracking();

        // Cleanup performance metrics interval
        this.devPanel?.disconnect();

        // Cleanup time of day manager
        if (this.timeOfDayManager) {
            this.timeOfDayManager.destroy();
            this.timeOfDayManager = undefined;
        }

        // Clear any pending timeouts
        clearPendingTimeouts(this.pendingTimeouts);
    }

    /**
     * Initialize time of day manager with current config
     */
    private initializeTimeOfDayManager(): void {
        if (this.timeOfDayManager) {
            this.timeOfDayManager.destroy();
        }

        this.timeOfDayManager = new TimeOfDayManager({
            enableDayNightCycle: this.config?.enable_day_night_cycle || false,
            sunriseHour: this.config?.sunrise_hour || 6,
            sunsetHour: this.config?.sunset_hour || 20,
            useBrowserTime: true
        });

        // Make timeOfDayManager accessible to animation controller via AnimatedWeatherCardElement interface
        (this as unknown as AnimatedWeatherCardElement).timeOfDayManager = this.timeOfDayManager;

        // Listen for time state changes to update animations
        this.timeOfDayManager.addListener((state: TimeOfDayState) => {
            this.onTimeOfDayChanged(state);
        });

        // Apply initial background
        if (this.config?.enable_day_night_cycle) {
            const currentState = this.timeOfDayManager.getCurrentState();
            this.updateDayNightBackground(currentState);
        }
    }

    /**
     * Handle time of day changes
     */
    private onTimeOfDayChanged(state: TimeOfDayState): void {
        if (this.config?.enable_day_night_cycle) {
            devLog(this.config?.dev_mode, `Time of day changed to: ${state.timePhase}`);
            this.updateDayNightBackground(state);
        }
    }

    /**
     * Repaint the sky for a time-of-day change. The palette itself lives in
     * CSS (see sky.ts); the card only switches data-phase.
     */
    private updateDayNightBackground(_state: TimeOfDayState): void {
        this.applySkyPhase();
    }

    /** Which sky to paint: dawn, day, dusk or night. */
    private currentSkyPhase(): SkyPhase {
        // The day/night cycle (or the dev panel's override) owns the phase when on.
        if (this.timeOfDayManager && (this.timeOfDayManager.isEnabled() || this.devTimeOverride)) {
            return this.timeOfDayManager.getCurrentState().timePhase as SkyPhase;
        }
        // Otherwise follow the real sun when Home Assistant knows where it is.
        const sun = this._hass?.states[this.config?.sun_entity || 'sun.sun'];
        if (!sun) return 'day';
        const elevation = sun.attributes?.elevation;
        return skyPhaseFromSun(typeof elevation === 'number' ? elevation : Number(elevation),
            !!sun.attributes?.rising, sun.state !== 'below_horizon');
    }

    applySkyPhase(): void {
        const card = this.querySelector('.animated-weather-card') as HTMLElement | null;
        if (!card) return;
        const phase = this.currentSkyPhase();
        if (card.dataset.phase !== phase) card.dataset.phase = phase;
    }

    /**
     * Fit the content to the frame.
     *
     * Width: the metrics sit in one row only if they actually fit. Labels
     * come from Home Assistant's translations ("Air pressure", German
     * "Luftdruck"…), so this is measured rather than set by a breakpoint.
     *
     * Height: in masonry the card grows to its content and stays "regular";
     * in a fixed frame (sections view rows, small tiles) it steps down until
     * nothing overflows: "compact" drops the secondary hero line, "short"
     * also shrinks the temperature, "tight" also drops the location, and
     * "minimal" drops the metric label text too and shrinks the temperature
     * again. Each step gives up the least that could make the next frame
     * fit: a phone's sections row (353 × 248) lands on "tight", the labels
     * kept. A note gives way first (NOTE_FIT_STEPS, data-note): a phone's
     * five rows land on "snug", with the line under the condition and the
     * note's one-line version. Runs after every render, every in-place data update
     * (new values can be longer), on resize and when web fonts finish
     * loading.
     */
    private applySizeState(): void {
        const card = this.querySelector('.animated-weather-card') as HTMLElement | null;
        const info = card?.querySelector('.weather-info') as HTMLElement | null;
        if (!card || !info) return;
        const hero = card.querySelector('.main-weather-info') as HTMLElement | null;
        const metrics = card.querySelector('.weather-attributes') as HTMLElement | null;

        card.dataset.height = 'regular';
        if (metrics) {
            // Measure the row at its natural width. Switch to the grid as soon
            // as it doesn't fit, but only back to a row with room to spare, so
            // one longer value can't flip the layout back and forth.
            const previous = card.dataset.metrics;
            card.dataset.metrics = 'row';
            const items = Array.from(metrics.children) as HTMLElement[];
            const gap = parseFloat(getComputedStyle(metrics).columnGap) || 0;
            const needed = items.reduce((w, el) => w + el.getBoundingClientRect().width, 0) + gap * Math.max(0, items.length - 1);
            const slack = metrics.clientWidth - needed;
            const toGrid = slack < -0.5 || (previous === 'grid' && slack < METRICS_ROW_SLACK_PX);
            card.dataset.metrics = toGrid ? 'grid' : 'row';
        }

        // The regular hero is a column that the frame can cut off at the
        // bottom; the compact one is a single row of ellipsized text, where
        // only the strip itself overflowing matters (the numerals' glyphs
        // overhang their line box, which isn't clipping).
        const compact = card.dataset.variant === 'compact';
        const note = card.querySelector('.weather-note') as HTMLElement | null;
        // A note is shown whole or not at all: one its clamp cuts short doesn't fit
        const overflows = () => info.scrollHeight > info.clientHeight + 1
            || (!compact && !!hero && hero.scrollHeight > hero.clientHeight + 1)
            || (!!note && !note.hidden && note.scrollHeight > note.clientHeight + 1);
        if (!note || note.hidden) {
            delete card.dataset.note;
            for (const state of HEIGHT_STEPS) {
                card.dataset.height = state;
                if (!overflows()) return;
            }
            return;
        }
        for (const [state, length] of NOTE_FIT_STEPS) {
            card.dataset.height = state;
            card.dataset.note = length;
            if (!overflows()) return;
        }
    }

    /**
     * Sections view: full section width, four rows (~248px), never shorter
     * than three. A note asks for a fifth row: on a phone that's room for
     * its one-line version.
     */
    getGridOptions() {
        if (this.config?.compact) return { columns: 12, rows: 2, min_columns: 6, min_rows: 1 };
        return this.noteEnabled()
            ? { columns: 12, rows: 5, min_columns: 6, min_rows: 3 }
            : { columns: 12, rows: 4, min_columns: 6, min_rows: 3 };
    }

    getCardSize(): number {
        // Compute from config so HA's grid sizes the card to the actual content.
        // Base: temperature + condition. Add rows for indoor block and attribute
        // strip when shown.
        if (this.config?.compact) return 2;
        let size = 3;
        if (this.config?.show_indoor !== false) size += 1;
        if (this.config?.show_attributes !== false) size += 1;
        if (this.noteEnabled()) size += 1;
        return size;
    }

    /**
     * Lazy-load the config editor bundle on first invocation. HA calls this
     * once when the user opens the visual editor, so we pay the network cost
     * only when actually needed.
     */
    static async getConfigElement(): Promise<HTMLElement> {
        if (!customElements.get('animated-weather-card-editor')) {
            await AnimatedWeatherCard.loadSiblingBundle('animated-weather-card-editor',
                () => !!customElements.get('animated-weather-card-editor'));
        }
        return document.createElement('animated-weather-card-editor');
    }

    private static bundleLoads = new Map<string, Promise<void>>();

    /**
     * Load another of this card's bundles (the editor, the dev panel) from
     * the folder the main bundle was loaded from, once.
     */
    private static loadSiblingBundle(name: string, isReady: () => boolean): Promise<void> {
        const pending = AnimatedWeatherCard.bundleLoads.get(name);
        if (pending) return pending;
        const load = new Promise<void>((resolve, reject) => {
            // Find the main bundle's <script> tag so we can resolve the other
            // bundle's URL relative to it (keeping its ?v= cache buster).
            // Falls back to a same-dir relative URL if detection fails.
            const scripts = Array.from(document.querySelectorAll('script[src]')) as HTMLScriptElement[];
            const main = scripts.find(s => /animated-weather-card(?:\.min)?\.js/.test(s.src));
            const url = main
                ? main.src.replace(/animated-weather-card(\.min)?\.js/, `${name}$1.js`)
                : `${name}.js`;

            const script = document.createElement('script');
            script.src = url;
            script.type = 'module';
            script.async = true;
            // Both bundles register themselves synchronously when they run
            script.onload = () => isReady() ? resolve() : reject(new Error(`${url} loaded but registered nothing`));
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
        // A failed load can be retried later (e.g. after a network blip)
        load.catch(() => AnimatedWeatherCard.bundleLoads.delete(name));
        AnimatedWeatherCard.bundleLoads.set(name, load);
        return load;
    }
}

customElements.define('animated-weather-card', AnimatedWeatherCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'animated-weather-card',
    name: 'Animated Weather Card',
    description: 'The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset',
    preview: false,
    documentationURL: 'https://github.com/alexsto1an/ha-ani-weather-card'
});

// The banner, once per page, in the card's own colours: its name on a clear
// day's sky, its version in the sun's warm light
if (!window.animatedWeatherCardBannerShown) {
    window.animatedWeatherCardBannerShown = true;

    const sky = skyColors('sunny', 'day');
    const pill = ['display: inline-block', 'line-height: 12px', 'font-size: 12px', 'font-weight: 600', 'padding: 4px 8px', 'margin: 5px 0'];
    console.groupCollapsed(
        `%c ⛅ Animated Weather Card %cv${CARD_VERSION} `,
        [`background: linear-gradient(90deg, ${sky.top}, ${sky.mid} 55%, ${sky.bottom})`, `color: ${toHex(oklchToSrgb(SKY_TEXT))}`,
            'border-radius: 4px 0 0 4px', ...pill].join(';'),
        ['background: linear-gradient(90deg, #ffd67a, #ffb547)', `color: ${sky.top}`, 'border-radius: 0 4px 4px 0', ...pill].join(';'),
    );
    console.log('%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ', 'font-weight: bold', 'font-weight: normal');
    console.groupEnd();
}
