/**
 * Animated Forecast Card
 *
 * The next hours or days of a weather entity, as a card of its own, in the
 * entity's sky. Registered from the main bundle like the sun tracker, so
 * Home Assistant finds it; its drawing is in the forecast bundle
 * (animated-weather-card-forecast.js), loaded the first time a forecast
 * card or a weather card shows a forecast.
 */

import { HomeAssistant } from './types';
import { escapeHtml, getWeatherClass } from './utils';
import { ActionConfig, ActionsConfig, bindActions, readActions, syncActionTarget } from './actions';
import { loadEditorBundle, loadSiblingBundle } from './bundles';
import { localeKey } from './localize';
import { ForecastFeed } from './forecast-feed';
import { iconBoxCss } from './styles/icon-box';
import type { ForecastContext } from './forecast-views-api';
import {
    skyColors, skyPhaseFromSun, registerSkyProperties, SKY_CONDITIONS,
    type SkyCondition, type SkyPhase, SKY_COLOR_PROPERTIES,
} from './sky';

export interface ForecastCardConfig {
    type?: string;
    /** The weather entity */
    entity?: string;
    /** The sun, for the sky's time of day (default sun.sun) */
    sun_entity?: string;
    /** What it shows: the next hours, the next days, or both (default: hours where the entity has them) */
    forecast?: 'hourly' | 'daily' | 'both';
    /** One strip, to sit under the weather card */
    compact?: boolean;
    color_palette?: 'default' | 'theme';
    /** What a tap does (default: the forecast pop-up) */
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
    /** Review only, while the variants are compared */
    review_card?: string;
    review_popup?: string;
}

registerSkyProperties();

/** The forecast bundle, loaded once for the page */
export function loadForecastViews(): Promise<void> {
    return loadSiblingBundle('animated-weather-card-forecast', () => !!window.AnimatedWeatherCardForecast);
}

const SHELL_CSS = `
${iconBoxCss('')}
    :host { display: block; height: 100%; }
    ha-card { height: 100%; overflow: hidden; }
    ha-card.sky { background: none; border-color: transparent; }
`;

/** A forecast card for a weather entity, with the sun for its sky's time of day */
function forecastCardConfig(entity: string, hass?: HomeAssistant): ForecastCardConfig {
    return hass?.states['sun.sun'] ? { entity, sun_entity: 'sun.sun' } : { entity };
}

class AnimatedForecastCard extends HTMLElement {
    private config: ForecastCardConfig = {};
    private _hass?: HomeAssistant;
    private readonly root: ShadowRoot;
    private readonly feed = new ForecastFeed(() => this.render());
    private resizeObserver?: ResizeObserver;
    private hourTimer?: ReturnType<typeof setInterval>;
    private closePopup?: () => void;

    constructor() {
        super();
        this.root = this.attachShadow({ mode: 'open' });
    }

    setConfig(config: ForecastCardConfig): void {
        if (!config.entity) throw new Error('Please define a weather entity (entity: weather.home)');
        this.config = { ...config };
        this.syncFeed();
        this.render();
    }

    set hass(hass: HomeAssistant) {
        const old = this._hass;
        this._hass = hass;
        this.syncFeed();
        const id = this.config.entity ?? '';
        const sunId = this.config.sun_entity || 'sun.sun';
        if (!old || old.states[id] !== hass.states[id] || old.states[sunId]?.state !== hass.states[sunId]?.state
            || Math.abs((old.states[sunId]?.attributes?.elevation ?? 0) - (hass.states[sunId]?.attributes?.elevation ?? 0)) >= 0.5
            || localeKey(old) !== localeKey(hass)) {
            this.render();
        }
    }

    get hass(): HomeAssistant | undefined {
        return this._hass;
    }

    connectedCallback(): void {
        this.syncFeed();
        // The hour under way moves on with the clock, not with Home Assistant
        this.hourTimer ??= setInterval(() => this.render(), 5 * 60_000);
        if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => this.fit());
            this.resizeObserver.observe(this);
        }
        this.render();
    }

    disconnectedCallback(): void {
        this.feed.stop();
        clearInterval(this.hourTimer);
        this.hourTimer = undefined;
        this.resizeObserver?.disconnect();
        this.resizeObserver = undefined;
        this.closePopup?.();
    }

    private wantsHours(): boolean {
        return this.config.forecast !== 'daily';
    }

    private wantsDays(): boolean {
        return this.config.forecast === 'daily' || this.config.forecast === 'both' || !this.config.compact;
    }

    private syncFeed(): void {
        if (!this.isConnected) return;
        this.feed.sync(this._hass, this.config.entity, { hourly: this.wantsHours(), daily: this.wantsDays() });
    }

    /** The sky's condition and phase: the entity's, at the sun's time of day */
    private sky(): { condition: SkyCondition; phase: SkyPhase } {
        const sun = this._hass?.states[this.config.sun_entity || 'sun.sun'];
        const elevation = sun?.attributes?.elevation;
        const phase = sun ? skyPhaseFromSun(typeof elevation === 'number' ? elevation : Number(elevation),
            !!sun.attributes?.rising, sun.state !== 'below_horizon') : 'day';
        const state = this.config.entity ? this._hass?.states[this.config.entity]?.state : undefined;
        let condition: SkyCondition = phase === 'night' ? 'clear-night' : 'sunny';
        if (state && state !== 'unavailable' && state !== 'unknown') {
            const weatherClass = getWeatherClass(state, false, undefined, undefined, this._hass?.config?.time_zone);
            if ((SKY_CONDITIONS as readonly string[]).includes(weatherClass)) condition = weatherClass as SkyCondition;
        }
        return { condition, phase };
    }

    context(): ForecastContext & { compact: boolean } {
        const weather = this.config.entity ? this._hass?.states[this.config.entity] : undefined;
        const { condition, phase } = this.sky();
        const current = Number(weather?.attributes?.temperature);
        return {
            hass: this._hass,
            entityId: this.config.entity ?? '',
            hourly: this.feed.hourly,
            daily: this.feed.daily,
            dailyType: this.feed.dailyType,
            current: isFinite(current) ? current : undefined,
            unit: String(weather?.attributes?.temperature_unit ?? this._hass?.config?.unit_system?.temperature ?? '°'),
            now: Date.now(),
            condition,
            phase,
            theme: this.config.color_palette === 'theme',
            width: (this.root.querySelector('.fc-card') as HTMLElement | null)?.clientWidth ?? 0,
            show: this.config.forecast ?? (this.config.compact ? 'hourly' : 'both'),
            variant: this.config.review_card,
            compact: !!this.config.compact,
        };
    }

    private actions(): ActionsConfig {
        return readActions(this.config as Record<string, unknown>, this.config.entity);
    }

    /** With no tap action of its own, a tap opens the forecast pop-up: it's this card's detail */
    private actionsWithDefault(): ActionsConfig {
        const actions = this.actions();
        return actions.tap_action ? actions : { ...actions, tap_action: { action: 'forecast' } };
    }

    openForecast(): void {
        const views = window.AnimatedWeatherCardForecast;
        if (!views) {
            loadForecastViews().then(() => this.openForecast()).catch(err => console.warn(`Animated Weather Card: ${err.message}`));
            return;
        }
        this.closePopup?.();
        const card = this.root.querySelector('ha-card') as HTMLElement | null;
        const still = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        this.closePopup = views.openPopup({
            ...this.context(),
            variant: this.config.review_popup,
            returnFocus: card,
            note: null,
            still,
            openMoreInfo: () => this.dispatchEvent(new CustomEvent('hass-more-info', {
                detail: { entityId: this.config.entity }, bubbles: true, composed: true,
            })),
        });
    }

    private render(): void {
        if (!this.config.entity) return;
        let card = this.root.querySelector('.fc-card') as HTMLElement | null;
        if (!card) {
            this.root.innerHTML = `<style>${SHELL_CSS}</style><style class="fc-views"></style><ha-card><div class="fc-card"></div></ha-card>`;
            card = this.root.querySelector('.fc-card') as HTMLElement;
            bindActions(card.parentElement as HTMLElement, this, () => this.actionsWithDefault(), { forecast: () => this.openForecast() });
        }
        syncActionTarget(card.parentElement as HTMLElement, this.actionsWithDefault());
        const ctx = this.context();
        const colorized = !ctx.theme;
        card.classList.toggle('sky', colorized);
        card.classList.toggle('compact', ctx.compact);
        card.parentElement?.classList.toggle('sky', colorized);
        card.dataset.variant = ctx.variant ?? '';
        const sky = skyColors(ctx.condition as SkyCondition, ctx.phase as SkyPhase);
        const vars: Record<string, string> = { '--awc-sky-top': sky.top, '--awc-sky-mid': sky.mid, '--awc-sky-bottom': sky.bottom, '--awc-sky-glow': sky.glow, '--awc-sky-scrim': sky.scrim };
        for (const name of SKY_COLOR_PROPERTIES) {
            if (colorized) card.style.setProperty(name, vars[name]);
            else card.style.removeProperty(name);
        }
        card.dataset.phase = ctx.phase;
        card.dataset.condition = ctx.condition;

        const views = window.AnimatedWeatherCardForecast;
        if (!views) {
            card.setAttribute('aria-busy', 'true');
            loadForecastViews().then(() => this.render()).catch(err => {
                console.warn(`Animated Weather Card: ${err.message}`);
                card!.innerHTML = `<div class="fc-empty">${escapeHtml(err.message)}</div>`;
            });
            return;
        }
        card.removeAttribute('aria-busy');
        const styles = this.root.querySelector('.fc-views') as HTMLStyleElement;
        if (styles.textContent !== views.cardCss) styles.textContent = views.cardCss;
        card.innerHTML = views.renderCard(ctx);
        this.fit();
    }

    /** Fit to the frame: the drawing steps down through its data-fit steps until nothing overflows */
    private fit(): void {
        const card = this.root.querySelector('.fc-card') as HTMLElement | null;
        if (!card) return;
        const drawing = card.firstElementChild as HTMLElement | null;
        const steps = (drawing?.dataset.fitSteps ?? 'regular').split(' ');
        // The drawing fills the card: what overflows it would be cut off by the card's padding edge
        const overflows = () => card.scrollHeight > card.clientHeight + 1 || card.scrollWidth > card.clientWidth + 1
            || (!!drawing && drawing.scrollHeight > drawing.clientHeight + 1);
        for (const step of steps) {
            card.dataset.fit = step;
            if (!overflows()) break;
        }
        window.AnimatedWeatherCardForecast?.fit(card);
    }

    getCardSize(): number {
        return this.config.compact ? 2 : this.config.forecast === 'both' ? 5 : 3;
    }

    /** Sections view: full width; the strip two rows, the card three (four with both) */
    getGridOptions() {
        if (this.config.compact) return { columns: 12, rows: 2, min_columns: 6, min_rows: 1 };
        return this.config.forecast === 'both'
            ? { columns: 12, rows: 5, min_columns: 6, min_rows: 3 }
            : { columns: 12, rows: 3, min_columns: 6, min_rows: 2 };
    }

    static async getConfigElement(): Promise<HTMLElement> {
        if (!customElements.get('animated-forecast-card-editor')) await loadEditorBundle('animated-forecast-card-editor');
        return document.createElement('animated-forecast-card-editor');
    }

    /** A card from the card picker starts on your own weather */
    static getStubConfig(hass?: HomeAssistant, entities: string[] = [], entitiesFallback: string[] = []): ForecastCardConfig {
        const ids = [...entities, ...entitiesFallback, ...Object.keys(hass?.states ?? {})];
        return forecastCardConfig(ids.find(id => id.startsWith('weather.')) ?? 'weather.forecast_home', hass);
    }
}

customElements.define('animated-forecast-card', AnimatedForecastCard);

window.customCards = window.customCards || [];
window.customCards.push({
    type: 'animated-forecast-card',
    name: 'Animated Forecast',
    description: 'The next hours or days of a weather entity, in its sky',
    preview: true,
    documentationURL: 'https://github.com/alexsto1an/ha-ani-weather-card',
    getEntitySuggestion: (hass, entityId) => entityId.startsWith('weather.') ? [
        { label: 'Forecast', config: { type: 'custom:animated-forecast-card', ...forecastCardConfig(entityId, hass) } },
        { label: 'Forecast strip', config: { type: 'custom:animated-forecast-card', ...forecastCardConfig(entityId, hass), compact: true } },
    ] : null,
});
