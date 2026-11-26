// The forecast card's visual editor (the editor bundle), laid out as the weather card's: the basics that get a card
// running (the weather, the card or the strip, the sky's colours or the theme's), and "Show all settings" for the
// rest, which open in place under them. Any option the config has changed from its default shows either way. Which
// row shows when is FORECAST_TABLE (editor-rows.ts); the switch, the rows and the CSS are the weather card's editor's.

import { bindPlaceFields, placeFieldsHtml, PLACE_FIELDS_CSS } from './place-editor';
import type { HomeAssistant, AnimatedWeatherCardConfig as ForecastCardConfig } from './types';
import { readActions } from './actions';
import { mountActionsEditor, updateActionsEditor } from './action-editor';
import { GRAPH_OPTIONS, METRIC_OPTIONS } from './config-editor';
import { getConfigEditorStyles } from './styles/editor';
import { FORECAST_TABLE, type RowContext } from './editor-rows';
import { allSaid, allSwitch, bindSeg, bindSelect, picker, raf, row, section, select, seg, storeAll, storedAll, sw, syncRows } from './editor-kit';

const DAYS = ['0', '3', '5', '7', '10'].map(v => ({ value: v, label: v === '0' ? 'No days' : `${v} days` }));

let editors = 0;

export class AnimatedForecastCardEditor extends HTMLElement {
    private _config: ForecastCardConfig = {};
    private _hass?: HomeAssistant;
    private _initialized = false;
    private readonly uid = ++editors;
    /** Show all settings, shared with the other two editors */
    private all = storedAll();
    /** The rows the config has changed this session: they stay shown */
    private pinned = new Set<string>();
    /** Weather for another place, switched on before anything's typed; and what was typed, kept when it's switched off */
    private placeOn = false;
    private placeKept: Record<string, unknown> = {};

    setConfig(config: ForecastCardConfig): void {
        // The config this editor just sent comes straight back: drawing it
        // again would take the focus from whatever is being set
        const unchanged = JSON.stringify(config) === JSON.stringify(this._config);
        this._config = { ...config };
        if (this._initialized && !unchanged) this._render();
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        if (this._initialized && this.isConnected) {
            this._updatePickers();
            updateActionsEditor(this.querySelector('#fc-actions'), hass);
        }
    }

    async connectedCallback() {
        await this._ensureEntityPickerLoaded();
        this._render();
        this._initialized = true;
        if (this._hass) this._updatePickers();
    }

    disconnectedCallback() {
        this.pinned.clear();
        this.innerHTML = '';
    }

    /** Home Assistant defines ha-entity-picker only once something loads it: an entities card's editor does */
    private async _ensureEntityPickerLoaded(): Promise<void> {
        if (customElements.get('ha-entity-picker')) return;
        try {
            const helpers = await window.loadCardHelpers!();
            const tmp = await helpers.createCardElement({ type: 'entities', entities: [] });
            const suppress = (e: PromiseRejectionEvent) => {
                if (e.reason?.message?.includes('localize') || e.reason?.message?.includes('hass')) e.preventDefault();
            };
            window.addEventListener('unhandledrejection', suppress);
            try { await (tmp.constructor as { getConfigElement?: () => Promise<HTMLElement> }).getConfigElement?.(); } catch (_) { /* ignore */ }
            setTimeout(() => window.removeEventListener('unhandledrejection', suppress), 2000);
        } catch (_) { /* the pickers come when Home Assistant is ready */ }
    }

    private ctx(): RowContext {
        return { all: this.all, place: this.placeOn, note: 'off', noDefaultAi: false };
    }

    private _render(): void {
        const c = this._config;
        this.placeOn = this.placeOn || ['latitude', 'longitude', 'time_zone'].some(k => c[k] !== undefined && c[k] !== '');
        this.innerHTML = `
            <div class="card-config" data-instant>
              ${allSwitch(this.all)}
              ${section('forecast', ['weather', 'Forecast'], [
                  row('entity', picker('weather-picker', 'Weather entity', c.entity)),
                  row('layout', seg('layout', 'Layout', [['card', 'Card'], ['strip', 'Strip']], c.compact ? 'strip' : 'card', this.uid)),
                  row('color_palette', seg('color_palette', 'Colors', [['default', 'Sky'], ['theme', 'Theme']], c.color_palette === 'theme' ? 'theme' : 'default', this.uid)),
                  row('forecast_metric', select('forecast_metric', 'Hours show', 'Temperature, rain, wind and the rest: what the hours and the days open on')),
              ].join(''))}
              ${section('shows', ['shows', 'What it shows'], [
                  row('show_summary', sw('show_summary', 'The line at the top', c.show_summary !== false, 'What turns and when: "Rain from 17:00 to 19:00". While you drag, it names the hour and brings you back to now')),
                  row('show_hours', sw('show_hours', 'The hours', c.show_hours !== false, 'The hourly row and its chips: drag it, and the sky goes there')),
                  row('forecast_days', select('forecast_days', 'Days')),
                  row('show_chips', sw('show_chips', 'Buttons under the hours', c.show_chips !== false, 'One for each value, to change what the hours show. Off, they stay on what Hours show says')),
                  row('forecast_graph', select('forecast_graph', 'Graph')),
                  row('weather_effects', sw('weather_effects', 'Weather', !!c.weather_effects, 'Rain, snow, fog, wind and lightning behind the forecast, going to the hour you drag to')),
                  row('gpu_snow', sw('gpu_snow', 'GPU snow (experimental)', c.gpu_snow === true, 'Draw snow with WebGL when hardware acceleration is available')),
                  row('gpu_rain', sw('gpu_rain', 'GPU rain (experimental)', c.gpu_rain === true, 'Draw rain and splashes with WebGL when hardware acceleration is available')),
              ].join(''))}
              ${section('sky', ['place', 'Sun and place'], [
                  row('sun_entity', picker('sun-picker', 'Sun', c.sun_entity, 'Sets the sky\'s time of day and the icons\' light. Usually sun.sun')),
                  row('another_place', sw('another_place', 'Weather for another place', this.placeOn, 'Its sun, and its times in its time zone')),
                  row('place_fields', placeFieldsHtml(c)),
              ].join(''))}
              ${section('interactions', ['interactions', 'Interactions'], row('actions', '<div id="fc-actions"></div>'))}
              ${section('dev', '', row('dev_mode', sw('dev_mode', 'Simulated weather', !!c.dev_mode, 'The dev card\'s weather, with no weather entity needed')))}
            </div>
            <style>${getConfigEditorStyles()}${PLACE_FIELDS_CSS}</style>
        `;
        this._updatePickers();
        this._bind();
        this.sync();
        const root = this.querySelector('.card-config');
        raf(() => raf(() => root?.removeAttribute('data-instant')));
    }

    private _bind(): void {
        const c = this._config;
        this.querySelector('#all_settings')?.addEventListener('change', (e: Event) => {
            this.all = !!(e.target as HTMLInputElement).checked;
            storeAll(this.all);
            this.sync();
            const live = this.querySelector('[data-live]');
            if (live) live.textContent = allSaid(this.all, false);
        });
        this.querySelector('#weather-picker')?.addEventListener('value-changed', (e: Event) => {
            this._update({ entity: (e as CustomEvent).detail.value || undefined });
        });
        this.querySelector('#sun-picker')?.addEventListener('value-changed', (e: Event) => {
            this._update({ sun_entity: (e as CustomEvent).detail.value || undefined });
        });
        bindSeg(this, 'layout', v => this._update({ compact: v === 'strip' || undefined }));
        bindSeg(this, 'color_palette', v => this._update({ color_palette: v === 'theme' ? 'theme' : undefined }));
        const onSwitch = (id: string, apply: (checked: boolean) => Partial<ForecastCardConfig>) => {
            this.querySelector(`#${id}`)?.addEventListener('change', (e: Event) => this._update(apply((e.target as HTMLInputElement).checked)));
        };
        onSwitch('show_summary', checked => ({ show_summary: checked ? undefined : false }));
        onSwitch('show_hours', checked => ({ show_hours: checked ? undefined : false }));
        onSwitch('show_chips', checked => ({ show_chips: checked ? undefined : false }));
        onSwitch('weather_effects', checked => ({ weather_effects: checked || undefined }));
        onSwitch('gpu_snow', checked => ({ gpu_snow: checked || undefined }));
        onSwitch('gpu_rain', checked => ({ gpu_rain: checked || undefined }));
        onSwitch('dev_mode', checked => ({ dev_mode: checked || undefined }));
        bindSelect(this, 'forecast_metric', METRIC_OPTIONS, c.forecast_metric ?? 'temp', v => this._update({ forecast_metric: v === 'temp' ? undefined : v as ForecastCardConfig['forecast_metric'] }));
        bindSelect(this, 'forecast_graph', GRAPH_OPTIONS, c.forecast_graph ?? 'line', v => this._update({ forecast_graph: v === 'line' ? undefined : v as ForecastCardConfig['forecast_graph'] }));
        // The usual counts, and any other YAML set (0 to 10), so the select shows what the card does
        const days = String(c.forecast_days ?? 7);
        const dayOptions = DAYS.some(d => d.value === days) || !Number.isFinite(Number(days)) ? DAYS
            : [...DAYS, { value: days, label: `${days} day${days === '1' ? '' : 's'}` }].sort((a, b) => Number(a.value) - Number(b.value));
        bindSelect(this, 'forecast_days', dayOptions, days, v => this._update({ forecast_days: v === '7' ? undefined : Number(v) }));
        this.querySelector('#another_place')?.addEventListener('change', (e: Event) => {
            this.placeOn = !!(e.target as HTMLInputElement).checked;
            if (this.placeOn) {
                // Back on: what was typed before comes back
                if (Object.keys(this.placeKept).length) this._update(this.placeKept as Partial<ForecastCardConfig>);
                else this.sync();
                return;
            }
            const now = this._config;
            this.placeKept = Object.fromEntries(['latitude', 'longitude', 'time_zone'].filter(k => now[k] !== undefined).map(k => [k, now[k]]));
            // Switched off on purpose: the fields go, though they were set; the switch stays to bring them back
            this.pinned.delete('place_fields');
            this._update({ latitude: undefined, longitude: undefined, time_zone: undefined });
        });
        bindPlaceFields(this, patch => this._update(patch as Partial<ForecastCardConfig>));
        // A tap opens the whole forecast unless it's set to something else
        const actions = readActions(this._config as Record<string, unknown>, this._config.entity);
        mountActionsEditor(this.querySelector('#fc-actions') as HTMLElement, this._hass,
            actions.tap_action ? actions : { ...actions, tap_action: { action: 'forecast' } },
            patch => this._update(patch.tap_action === undefined && 'tap_action' in patch
                ? { ...patch, tap_action: { action: 'more-info' } }
                : patch.tap_action?.action === 'forecast' ? { ...patch, tap_action: undefined } : patch),
            { forecast: 'Forecast' });
    }

    /** Every row shown or hidden as FORECAST_TABLE says, and the help under each choice */
    sync(): void {
        const root = this.querySelector<HTMLElement>('.card-config');
        if (!root) return;
        const c = this._config;
        syncRows(root, FORECAST_TABLE, c, this.ctx(), this.pinned, root.hasAttribute('data-instant'));
        const set = (selector: string, text: string) => { const el = this.querySelector(selector); if (el && el.textContent !== text) el.textContent = text; };
        set('[data-help="layout"]', c.compact ? 'The hours alone, to sit under the compact weather card' : 'The hours and the week ahead');
        set('[data-help="color_palette"]', c.color_palette === 'theme' ? 'Your dashboard theme\'s colors, light or dark' : 'Colors from the weather and the time of day');
    }

    private _updatePickers(): void {
        const pickers = [
            { id: '#weather-picker', domains: ['weather'] },
            { id: '#sun-picker', domains: ['sun'] },
        ];
        for (const p of pickers) {
            const el = this.querySelector(p.id) as (HTMLElement & { hass?: HomeAssistant; includeDomains?: string[] }) | null;
            if (!el) continue;
            if (this._hass) el.hass = this._hass;
            el.includeDomains = p.domains;
        }
    }

    private _update(patch: Partial<ForecastCardConfig>): void {
        const next: Record<string, unknown> = { ...this._config, ...patch };
        for (const key of Object.keys(next)) {
            if (next[key] === undefined || next[key] === '') delete next[key];
        }
        this._config = next as ForecastCardConfig;
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true,
        }));
        this.sync();
    }
}
