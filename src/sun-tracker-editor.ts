// The sun tracker's visual editor. It ships in the editor bundle with the
// weather card's, and the tracker loads that bundle the first time someone
// opens its settings.

import { HomeAssistant } from './types';
import { textField } from './utils';
import { readActions } from './actions';
import { mountActionsEditor, updateActionsEditor } from './action-editor';
import type { SunTrackerConfig } from './sun-tracker-card';

const EDITOR_STYLES = `
    .st-editor {
        display: flex;
        flex-direction: column;
        gap: 16px;
        padding: 4px 0;
    }
    .st-editor .st-switches {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 4px;
    }
    .st-editor .st-switch {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        min-height: 48px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
    }
    .st-editor .st-switch small {
        display: block;
        margin-top: 2px;
        font-size: 12px;
        color: var(--secondary-text-color);
    }
    .st-editor .st-actions-title {
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding-top: 16px;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
    }
    .st-editor #st-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
`;

export class AnimatedSunTrackerEditor extends HTMLElement {
    private _config: SunTrackerConfig = {};
    private _hass?: HomeAssistant;
    private _initialized = false;

    setConfig(config: SunTrackerConfig): void {
        // The config this editor just sent comes straight back: drawing it
        // again would take the focus from whatever is being typed
        const unchanged = JSON.stringify(config) === JSON.stringify(this._config);
        this._config = { ...config };
        if (this._initialized && !unchanged) this._render();
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        if (this._initialized && this.isConnected) {
            this._updatePickers();
            updateActionsEditor(this.querySelector('#st-actions'), hass);
        }
    }

    async connectedCallback() {
        this._config = this._config || {};
        await this._ensureEntityPickerLoaded();
        this._render();
        this._initialized = true;
        if (this._hass) this._updatePickers();
    }

    disconnectedCallback() {
        this.innerHTML = '';
    }

    /** Force HA to lazy-load the ha-entity-picker component */
    private async _ensureEntityPickerLoaded(): Promise<void> {
        if (customElements.get('ha-entity-picker')) return;
        try {
            const helpers = await (window as any).loadCardHelpers!();
            const tmp = await helpers.createCardElement({ type: 'entities', entities: [] });
            // Suppress harmless hass-undefined errors during module load
            const suppress = (e: PromiseRejectionEvent) => {
                if (e.reason?.message?.includes('localize') || e.reason?.message?.includes('hass')) {
                    e.preventDefault();
                }
            };
            window.addEventListener('unhandledrejection', suppress);
            try { await tmp.constructor.getConfigElement(); } catch (_) { /* ignore */ }
            setTimeout(() => window.removeEventListener('unhandledrejection', suppress), 2000);
        } catch (_) { /* silently ignore */ }
    }

    private _render(): void {
        const c = this._config;
        const toggle = (id: string, label: string, hint: string, checked: boolean) => `
                    <label class="st-switch" for="${id}">
                        <span>${label}<small>${hint}</small></span>
                        <ha-switch id="${id}" ${checked ? 'checked' : ''}></ha-switch>
                    </label>`;
        this.innerHTML = `
            <style>${EDITOR_STYLES}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${textField({ id: 'title', label: 'Title (optional)', value: c.title })}
                <ha-select id="direction" label="Direction"></ha-select>
                <div class="st-switches">
                    ${toggle('compact', 'Compact', 'One line: the next sunrise or sunset beside the sun\'s path', !!c.compact)}
                    ${toggle('show_header', 'Next sunrise or sunset', 'The headline time and countdown', c.show_header !== false)}
                    ${toggle('show_details', 'Details', 'First and last light, solar noon, daylight, moon', c.show_details !== false)}
                    ${toggle('theme_palette', 'Blend with dashboard theme', 'Use theme colors instead of the sky', c.color_palette === 'theme')}
                </div>
                <div class="st-actions-title">Interactions</div>
                <div id="st-actions"></div>
            </div>
        `;
        this._updatePickers();
        this._attachListeners();
        mountActionsEditor(this.querySelector('#st-actions') as HTMLElement, this._hass,
            readActions(this._config as Record<string, unknown>, this._config.sun_entity), patch => this._update(patch));
    }

    private _updatePickers(): void {
        const pickers = [
            { id: '#sun-picker', value: this._config.sun_entity || '', label: 'Sun entity', domains: ['sun'] },
            { id: '#moon-picker', value: this._config.moon_entity || '', label: 'Moon phase entity (optional)', domains: ['sensor'] },
            { id: '#weather-picker', value: this._config.weather_entity || '', label: 'Share the sky of a weather entity (optional)', domains: ['weather'],
                helper: 'Without one, it shares the sky of the weather card on the same sun' },
        ];
        for (const p of pickers) {
            const el = this.querySelector(p.id) as any;
            if (!el) continue;
            if (this._hass) el.hass = this._hass;
            el.value = p.value;
            el.label = p.label;
            el.includeDomains = p.domains;
            if ('helper' in p) el.helper = p.helper;
        }
    }

    private _attachListeners(): void {
        this.querySelector('#sun-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ sun_entity: e.detail.value });
        });
        this.querySelector('#moon-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ moon_entity: e.detail.value || undefined });
        });
        this.querySelector('#weather-picker')?.addEventListener('value-changed', (e: any) => {
            this._update({ weather_entity: e.detail.value || undefined });
        });
        this.querySelector('#title')?.addEventListener('input', (e: Event) => {
            this._update({ title: (e.target as HTMLInputElement).value || undefined });
        });
        const onSwitch = (id: string, apply: (checked: boolean) => Partial<SunTrackerConfig>) => {
            this.querySelector(`#${id}`)?.addEventListener('change', (e: Event) => {
                this._update(apply((e.target as HTMLInputElement).checked));
            });
        };
        onSwitch('compact', checked => ({ compact: checked || undefined }));
        onSwitch('show_header', checked => ({ show_header: checked }));
        onSwitch('show_details', checked => ({ show_details: checked }));
        onSwitch('theme_palette', checked => ({ color_palette: checked ? 'theme' : undefined }));
        // Which way the sun crosses: by Home Assistant's latitude unless set
        const direction = this.querySelector('#direction') as HTMLElement & { options: Array<{ value: string; label: string }>; value: string } | null;
        if (direction) {
            let current = this._config.direction ?? 'auto';
            const init = () => {
                direction.options = [
                    { value: 'auto', label: 'From your location: right to left south of the equator' },
                    { value: 'left_to_right', label: 'Left to right' },
                    { value: 'right_to_left', label: 'Right to left' },
                ];
                direction.value = current;
            };
            if (customElements.get('ha-select')) init();
            else customElements.whenDefined('ha-select').then(init);
            direction.addEventListener('selected', ((e: CustomEvent) => {
                const value = e.detail?.value as SunTrackerConfig['direction'] | undefined;
                if (!value || value === current) return;
                current = value;
                this._update({ direction: value === 'auto' ? undefined : value });
            }) as EventListener);
            // Its closing would close Home Assistant's edit dialog
            direction.addEventListener('closed', (e: Event) => e.stopPropagation());
        }
    }

    private _update(patch: Partial<SunTrackerConfig>): void {
        const next: Record<string, unknown> = { ...this._config, ...patch };
        for (const key of Object.keys(next)) {
            if (next[key] === undefined || next[key] === '') delete next[key];
        }
        this._config = next as SunTrackerConfig;
        this.dispatchEvent(new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        }));
    }
}

