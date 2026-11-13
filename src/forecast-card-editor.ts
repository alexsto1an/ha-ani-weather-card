// The forecast card's visual editor. It ships in the editor bundle with the
// other two, and the forecast card loads that bundle the first time someone
// opens its settings.

import { HomeAssistant } from './types';
import { readActions } from './actions';
import { mountActionsEditor, updateActionsEditor } from './action-editor';
import type { AnimatedWeatherCardConfig as ForecastCardConfig } from './types';
import { GRAPH_OPTIONS } from './config-editor';

const EDITOR_STYLES = `
    .fc-editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0;
    }
    .fc-editor .fc-switches {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 4px;
    }
    .fc-editor .fc-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 48px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
    }
    .fc-editor .fc-switch small {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
    .fc-editor .fc-title {
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 16px;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
    }
    .fc-editor #fc-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    .fc-editor .card-action {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        min-height: 40px;
        font-size: 14px;
        color: var(--primary-text-color);
    }
    .fc-editor .card-action-reset {
        font: inherit;
        color: var(--primary-color);
        background: none;
        border: 0;
        padding: 8px;
        cursor: pointer;
    }
`;

const METRICS = [
    { value: 'temp', label: 'Temperature' },
    { value: 'feels', label: 'Feels like' },
    { value: 'chance', label: 'Chance of rain' },
    { value: 'amount', label: 'Rain amount' },
];
const DAYS = ['0', '3', '5', '7', '10'].map(v => ({ value: v, label: v === '0' ? 'No days' : `${v} days` }));

export class AnimatedForecastCardEditor extends HTMLElement {
    private _config: ForecastCardConfig = {};
    private _hass?: HomeAssistant;
    private _initialized = false;

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

    private _render(): void {
        const c = this._config;
        const toggle = (id: string, label: string, hint: string, checked: boolean) => `
                    <label class="fc-switch" for="${id}">
                        <span>${label}<small>${hint}</small></span>
                        <ha-switch id="${id}" ${checked ? 'checked' : ''}></ha-switch>
                    </label>`;
        this.innerHTML = `
            <style>${EDITOR_STYLES}</style>
            <div class="fc-editor">
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-select id="forecast_metric" label="The hours first show"></ha-select>
                <ha-select id="forecast_graph" label="The hours' graph"></ha-select>
                <ha-select id="forecast_days" label="Days"></ha-select>
                <div class="fc-switches">
                    ${toggle('show_hours', 'The hours', 'The hourly row and its chips: drag it, and the sky goes there', c.show_hours !== false)}
                    ${toggle('compact', 'Strip', 'The hours alone, to sit under the compact weather card', !!c.compact)}
                    ${toggle('theme_palette', 'Blend with dashboard theme', 'Use theme colors instead of the sky', c.color_palette === 'theme')}
                </div>
                <div class="fc-title">Interactions</div>
                <div id="fc-actions"></div>
            </div>
        `;
        this._updatePickers();
        const bindSelect = (id: string, options: Array<{ value: string; label: string }>, current: string, apply: (v: string) => Partial<ForecastCardConfig>) => {
            const select = this.querySelector(`#${id}`) as HTMLElement & { options: typeof options; value: string } | null;
            if (!select) return;
            const init = () => { select.options = options; select.value = current; };
            if (customElements.get('ha-select')) init();
            else customElements.whenDefined('ha-select').then(init);
            select.addEventListener('selected', ((e: CustomEvent) => {
                const value = e.detail?.value as string | undefined;
                if (!value || value === current) return;
                current = value;
                this._update(apply(value));
            }) as EventListener);
            // Its closing would close Home Assistant's edit dialog
            select.addEventListener('closed', (e: Event) => e.stopPropagation());
        };
        bindSelect('forecast_metric', METRICS, c.forecast_metric ?? 'temp', v => ({ forecast_metric: v === 'temp' ? undefined : v as ForecastCardConfig['forecast_metric'] }));
        bindSelect('forecast_graph', GRAPH_OPTIONS, c.forecast_graph ?? 'line', v => ({ forecast_graph: v === 'line' ? undefined : v as ForecastCardConfig['forecast_graph'] }));
        // The usual counts, and any other YAML set (0 to 10), so the select shows what the card does
        const days = String(c.forecast_days ?? 7);
        const dayOptions = DAYS.some(d => d.value === days) || !Number.isFinite(Number(days)) ? DAYS
            : [...DAYS, { value: days, label: `${days} day${days === '1' ? '' : 's'}` }].sort((a, b) => Number(a.value) - Number(b.value));
        bindSelect('forecast_days', dayOptions, days, v => ({ forecast_days: v === '7' ? undefined : Number(v) }));
        const onSwitch = (id: string, apply: (checked: boolean) => Partial<ForecastCardConfig>) => {
            this.querySelector(`#${id}`)?.addEventListener('change', (e: Event) => {
                this._update(apply((e.target as HTMLInputElement).checked));
            });
        };
        onSwitch('compact', checked => ({ compact: checked || undefined }));
        onSwitch('show_hours', checked => ({ show_hours: checked ? undefined : false }));
        onSwitch('theme_palette', checked => ({ color_palette: checked ? 'theme' : undefined }));
        this.querySelector('#weather-picker')?.addEventListener('value-changed', (e: Event) => {
            this._update({ entity: (e as CustomEvent).detail.value || undefined });
        });
        this.querySelector('#sun-picker')?.addEventListener('value-changed', (e: Event) => {
            this._update({ sun_entity: (e as CustomEvent).detail.value || undefined });
        });
        // A tap opens the whole forecast unless it's set to something else
        const actions = readActions(this._config as Record<string, unknown>, this._config.entity);
        mountActionsEditor(this.querySelector('#fc-actions') as HTMLElement, this._hass,
            actions.tap_action ? actions : { ...actions, tap_action: { action: 'forecast' } },
            patch => this._update(patch.tap_action === undefined && 'tap_action' in patch
                ? { ...patch, tap_action: { action: 'more-info' } }
                : patch.tap_action?.action === 'forecast' ? { ...patch, tap_action: undefined } : patch),
            { forecast: 'Forecast' });
    }

    private _updatePickers(): void {
        const pickers = [
            { id: '#weather-picker', value: this._config.entity || '', label: 'Weather entity', domains: ['weather'] },
            { id: '#sun-picker', value: this._config.sun_entity || '', label: 'Sun, for the sky\'s time of day (optional)', domains: ['sun'] },
        ];
        for (const p of pickers) {
            const el = this.querySelector(p.id) as (HTMLElement & { hass?: HomeAssistant; value?: string; label?: string; includeDomains?: string[] }) | null;
            if (!el) continue;
            if (this._hass) el.hass = this._hass;
            el.value = p.value;
            el.label = p.label;
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
    }
}
