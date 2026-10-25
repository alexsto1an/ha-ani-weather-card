// Config editor for Animated Weather Card

import { HomeAssistant, LovelaceCardEditor, AnimatedWeatherCardConfig } from './types';
import { DEFAULT_ENGINE_SETTINGS } from './constants';
import { getConfigEditorStyles } from './styles/editor';
import { skyColors, oklchToSrgb, toHex, SKY_TEXT } from './sky';
import { escapeHtml, textField } from './utils';

/** note_calendar as a list: YAML takes one calendar or several, the editor's picker shows the first */
function noteCalendarList(value: unknown): string[] {
    return (Array.isArray(value) ? value : typeof value === 'string' ? [value] : []).map(String).filter(Boolean);
}

export class AnimatedWeatherCardEditor extends HTMLElement implements LovelaceCardEditor {
    private _config?: AnimatedWeatherCardConfig;
    private _hass?: HomeAssistant;
    private _initialized: boolean = false;
    private _suppressHandler?: (e: PromiseRejectionEvent) => void;
    private _suppressTimeout?: ReturnType<typeof setTimeout>;
    
    setConfig(config: AnimatedWeatherCardConfig): void {
        // Only re-render if this is a significant config change (not just value updates)
        const shouldRerender = !this._config ||
            Object.keys(config).length !== Object.keys(this._config).length ||
            JSON.stringify(Object.keys(config).sort()) !== JSON.stringify(Object.keys(this._config).sort());

        this._config = { ...config };

        if (this.isConnected && shouldRerender) {
            this.render();
        }
    }

    async connectedCallback() {
        this._config = this._config || {};
        await this.ensureEntityPickerLoaded();
        this.render();
        this._initialized = true;
        if (this._hass) {
            this.updateEntityPickers();
        }
    }

    disconnectedCallback() {
        // Clean up the suppression listener if still active
        this._cleanupSuppressHandler();
        // Clear innerHTML to release HA component subscriptions
        this.innerHTML = '';
    }

    private _cleanupSuppressHandler() {
        if (this._suppressHandler) {
            window.removeEventListener('unhandledrejection', this._suppressHandler);
            this._suppressHandler = undefined;
        }
        if (this._suppressTimeout) {
            clearTimeout(this._suppressTimeout);
            this._suppressTimeout = undefined;
        }
    }

    async ensureEntityPickerLoaded() {
        if (customElements.get("ha-entity-picker")) return;
        try {
            const cardHelpers = await window.loadCardHelpers!();
            const entitiesCard = await cardHelpers.createCardElement({ type: "entities", entities: [] });

            // getConfigElement() triggers ha-entity-picker module loading, but causes a
            // harmless render error (pickers created internally render before hass is set).
            // Temporarily suppress unhandled rejections from this side effect.
            this._cleanupSuppressHandler(); // Clear any previous handler
            this._suppressHandler = (e: PromiseRejectionEvent) => {
                if (e.reason?.message?.includes('localize') || e.reason?.message?.includes('hass')) {
                    e.preventDefault();
                }
            };
            window.addEventListener('unhandledrejection', this._suppressHandler);
            try {
                await (entitiesCard.constructor as { getConfigElement?: () => Promise<HTMLElement> | HTMLElement }).getConfigElement?.();
            } finally {
                // Safety-net timeout; disconnectedCallback also cleans up if the card is removed early
                this._suppressTimeout = setTimeout(() => this._cleanupSuppressHandler(), 2000);
            }
        } catch (_) {
            // Silently ignore - entity picker will load when HA is ready
        }
    }

    render() {
        if (!this._config) {
            this._config = {};
        }

        // Set defaults
        const colorPalette = this._config.color_palette || 'default';
        // Only numbers: YAML can hold anything, and the card treats anything
        // else as unset, so the sliders show the default it falls back to
        const engineSettings = Object.fromEntries(Object.entries(this._config.engine_settings || {})
            .filter(([, value]) => typeof value === 'number' && isFinite(value))) as NonNullable<AnimatedWeatherCardConfig['engine_settings']>;
        const customColors = this._config.custom_colors || {};

        this.innerHTML = `
      <div class="card-config">
        <!-- Entities ────────────────────────────────────────────────────── -->
        <div class="section expanded">
          <div class="section-header" role="button" tabindex="0" data-section="entities">
            <ha-icon icon="mdi:link-variant"></ha-icon>
            <h3>Entities</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <ha-entity-picker
                id="entity"
                label="Weather entity"
                value="${escapeHtml(this._config.entity || '')}"
                helper="Required unless developer mode is on"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${textField({ id: 'name', label: 'Name', placeholder: 'Weather', value: this._config.name })}
            </div>
            <div class="option">
              <ha-entity-picker
                id="outdoor_sensor_entity"
                label="Outdoor temperature sensor"
                value="${escapeHtml(this._config.outdoor_sensor_entity || '')}"
                helper="Shown instead of the weather entity's temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="feels_like_entity"
                label="Feels-like sensor"
                value="${escapeHtml(this._config.feels_like_entity || '')}"
                helper="Adds a 'Feels like' line under the temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="humidity_sensor_entity"
                label="Humidity sensor"
                value="${escapeHtml(this._config.humidity_sensor_entity || '')}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_speed_sensor_entity"
                label="Wind speed sensor"
                value="${escapeHtml(this._config.wind_speed_sensor_entity || '')}"
                helper="Also sets how fast the weather moves. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_direction_sensor_entity"
                label="Wind direction sensor"
                value="${escapeHtml(this._config.wind_direction_sensor_entity || '')}"
                helper="Points the wind arrow: degrees, or a compass point like NW. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="pressure_sensor_entity"
                label="Pressure sensor"
                value="${escapeHtml(this._config.pressure_sensor_entity || '')}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_temperature_entity"
                label="Indoor temperature sensor"
                value="${escapeHtml(this._config.indoor_temperature_entity || '')}"
                helper="Adds an indoor line under the condition"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_humidity_entity"
                label="Indoor humidity sensor"
                value="${escapeHtml(this._config.indoor_humidity_entity || '')}"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="sun_entity"
                label="Sun entity"
                value="${escapeHtml(this._config.sun_entity || '')}"
                helper="Usually sun.sun. Drives the sky's time of day and sunset time"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="flights_entity"
                label="Flights sensor"
                value="${escapeHtml(this._config.flights_entity || '')}"
                helper="Flightradar24 'Current in area' sensor. Each new flight crosses the card once"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
          </div>
        </div>

        <!-- Display ─────────────────────────────────────────────────────── -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="display">
            <ha-icon icon="mdi:eye-outline"></ha-icon>
            <h3>Display</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="group-title">Appearance</div>
            <div class="option">
              <ha-select id="color_palette" label="Color palette"></ha-select>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="compact" ${this._config.compact ? 'checked' : ''}></ha-switch>
                <span>Compact: one line, the temperature and condition over the sky</span>
              </label>
            </div>

            <div class="group-title">Show</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_location" ${this._config.show_location !== false ? 'checked' : ''}></ha-switch>
                <span>Location</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_attributes" ${this._config.show_attributes !== false ? 'checked' : ''}></ha-switch>
                <span>Humidity, wind and pressure</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-labels-option" style="display: ${this._config.show_attributes !== false ? 'block' : 'none'}">
              <label class="switch-label">
                <ha-switch id="show_attribute_labels" ${this._config.show_attribute_labels !== false ? 'checked' : ''}></ha-switch>
                <span>Labels</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-icons-option" style="display: ${this._config.show_attributes !== false ? 'block' : 'none'}">
              <label class="switch-label">
                <ha-switch id="show_attribute_icons" ${this._config.show_attribute_icons !== false ? 'checked' : ''}></ha-switch>
                <span>Icons</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_sun" ${this._config.show_sun !== false ? 'checked' : ''}></ha-switch>
                <span>Next sunrise or sunset</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_indoor" ${this._config.show_indoor !== false ? 'checked' : ''}></ha-switch>
                <span>Indoor temperature and humidity</span>
              </label>
            </div>
            <div class="option">
              <ha-select id="indoor_style" label="Indoor reading starts with"></ha-select>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_flight_labels" ${this._config.show_flight_labels !== false ? 'checked' : ''}></ha-switch>
                <span>Flight labels on planes</span>
              </label>
            </div>

            <div class="group-title">Motion</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="animate" ${this._config.animate !== false ? 'checked' : ''}></ha-switch>
                <span>Animate the weather</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="spill_particles" ${this._config.spill_particles !== false ? 'checked' : ''}></ha-switch>
                <span>Let rain, snow and leaves spill outside the card</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Weather note ───────────────────────────────────────────────── -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="note">
            <ha-icon icon="mdi:message-text-outline"></ha-icon>
            <h3>Weather note</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <p class="section-note">A sentence under the conditions: a remark on the weather, what's coming and what to wear. Asks for five rows in a sections view; a shorter frame shows a one-line version, then none.</p>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_note" ${this._config.show_note ? 'checked' : ''}></ha-switch>
                <span>Write it with your AI, from the forecast</span>
              </label>
            </div>
            <p class="section-note" id="note_status" hidden></p>
            <div class="option note-ai">
              <ha-select id="note_tone" label="Voice"></ha-select>
            </div>
            <div class="option note-ai">
              <ha-entity-picker
                id="note_ai_task_entity"
                label="AI Task"
                value="${escapeHtml(this._config.note_ai_task_entity || '')}"
                helper="Empty: the default in Settings → System → AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option note-ai">
              <ha-entity-picker
                id="note_calendar"
                label="Your calendar, for when you're out"
                value="${escapeHtml(noteCalendarList(this._config.note_calendar)[0] || '')}"
                helper="Timed events count as time out; all-day and online ones don't. Only the times reach the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <p class="section-note">Or show a note from an entity of yours instead:</p>
            <div class="option">
              <ha-entity-picker
                id="note_entity"
                label="Note entity"
                value="${escapeHtml(this._config.note_entity || '')}"
                helper="Its state is the one-line version. Used instead of the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${textField({ id: 'note_attribute', label: 'Longer note attribute', placeholder: 'note', value: this._config.note_attribute, hint: 'Shown where there\'s room for two lines' })}
            </div>
            <div class="option">
              ${textField({ id: 'note_max_age', label: 'Hide after (minutes)', type: 'number', min: 0, value: this._config.note_max_age ?? 180, hint: 'Counted from when it was written (an entity\'s generated_at). 0 keeps it' })}
            </div>
          </div>
        </div>

        <!-- Day / Night ─────────────────────────────────────────────────── -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="daynight">
            <ha-icon icon="mdi:weather-sunset"></ha-icon>
            <h3>Day and night</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <label class="switch-label">
                <ha-switch id="enable_day_night_cycle" ${this._config.enable_day_night_cycle ? 'checked' : ''}></ha-switch>
                <span>Follow a fixed day and night schedule</span>
              </label>
            </div>
            <div class="option ${this._config.enable_day_night_cycle ? '' : 'disabled'}" style="${this._config.enable_day_night_cycle ? '' : 'opacity: 0.5; pointer-events: none;'}">
              ${textField({ id: 'sunrise_hour', label: 'Sunrise hour (0-23)', type: 'number', min: 0, max: 23, value: this._config.sunrise_hour ?? 6, hint: 'When the day sky and animations begin' })}
            </div>
            <div class="option ${this._config.enable_day_night_cycle ? '' : 'disabled'}" style="${this._config.enable_day_night_cycle ? '' : 'opacity: 0.5; pointer-events: none;'}">
              ${textField({ id: 'sunset_hour', label: 'Sunset hour (0-23)', type: 'number', min: 0, max: 23, value: this._config.sunset_hour ?? 20, hint: 'When the night sky and animations begin' })}
            </div>
          </div>
        </div>

        <!-- Advanced ────────────────────────────────────────────────────── -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="advanced">
            <ha-icon icon="mdi:tune"></ha-icon>
            <h3>Advanced</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <label class="switch-label">
                <ha-switch id="auto_pause" ${this._config.auto_pause ? 'checked' : ''}></ha-switch>
                <span>Also pause when the browser window is in the background</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="disable_lightning_shake" ${this._config.disable_lightning_shake ? 'checked' : ''}></ha-switch>
                <span>Turn off the lightning jolt</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="dev_mode" ${this._config.dev_mode ? 'checked' : ''}></ha-switch>
                <span>Developer mode (preview any condition)</span>
              </label>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="engine">
            <ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>
            <h3>Weather engine</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
          <div class="engine-grid">
            <div class="engine-option">
              <label>Wind effect</label>
              <input type="range" id="windSpeed" min="0.5" max="5" step="0.1" value="${escapeHtml(engineSettings.windSpeed || DEFAULT_ENGINE_SETTINGS.windSpeed)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('windSpeed', engineSettings.windSpeed || DEFAULT_ENGINE_SETTINGS.windSpeed)}</span>
            </div>
            <div class="engine-option">
              <label>Rain amount</label>
              <input type="range" id="rainCount" min="0.5" max="3" step="0.1" value="${escapeHtml(engineSettings.rainCount || DEFAULT_ENGINE_SETTINGS.rainCount)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('rainCount', engineSettings.rainCount || DEFAULT_ENGINE_SETTINGS.rainCount)}</span>
            </div>
            <div class="engine-option">
              <label>Leaf amount</label>
              <input type="range" id="leafCount" min="0.5" max="3" step="0.1" value="${escapeHtml(engineSettings.leafCount || DEFAULT_ENGINE_SETTINGS.leafCount)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('leafCount', engineSettings.leafCount || DEFAULT_ENGINE_SETTINGS.leafCount)}</span>
            </div>
            <div class="engine-option">
              <label>Snow amount</label>
              <input type="range" id="snowCount" min="0.5" max="3" step="0.1" value="${escapeHtml(engineSettings.snowCount || DEFAULT_ENGINE_SETTINGS.snowCount)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('snowCount', engineSettings.snowCount || DEFAULT_ENGINE_SETTINGS.snowCount)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud size</label>
              <input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1" value="${escapeHtml(engineSettings.cloudBaseSize || DEFAULT_ENGINE_SETTINGS.cloudBaseSize)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('cloudBaseSize', engineSettings.cloudBaseSize || DEFAULT_ENGINE_SETTINGS.cloudBaseSize)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud count</label>
              <input type="range" id="cloudCount" min="1" max="6" step="1" value="${escapeHtml(engineSettings.cloudCount || DEFAULT_ENGINE_SETTINGS.cloudCount)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('cloudCount', engineSettings.cloudCount || DEFAULT_ENGINE_SETTINGS.cloudCount)}</span>
            </div>
            <div class="engine-option">
              <label>Splash bounce</label>
              <input type="range" id="splashBounce" min="40" max="120" step="5" value="${escapeHtml(engineSettings.splashBounce || DEFAULT_ENGINE_SETTINGS.splashBounce)}" />
              <span class="value-display">${AnimatedWeatherCardEditor.formatEngineValue('splashBounce', engineSettings.splashBounce || DEFAULT_ENGINE_SETTINGS.splashBounce)}</span>
            </div>
          </div>
          <button class="reset-engine-btn">Reset engine settings</button>
          </div>
        </div>

        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="colors">
            <ha-icon icon="mdi:palette"></ha-icon>
            <h3>Colors</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
          <p class="section-note">Each background color becomes a full sky for that condition. Applies to the colorized palette only.</p>
          
          <div class="color-grid" id="color-grid" style="display: ${colorPalette === 'default' ? 'grid' : 'none'}; opacity: ${colorPalette === 'default' ? '1' : '0.5'}">
            <div class="color-option">
              <label>Sunny sky</label>
              <input type="color" id="sunny_bg" value="${escapeHtml(customColors.sunny_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.sunny_bg)}" />
              <button class="color-reset" data-target="sunny_bg" ${customColors.sunny_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rainy sky</label>
              <input type="color" id="rainy_bg" value="${escapeHtml(customColors.rainy_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.rainy_bg)}" />
              <button class="color-reset" data-target="rainy_bg" ${customColors.rainy_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snowy sky</label>
              <input type="color" id="snowy_bg" value="${escapeHtml(customColors.snowy_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.snowy_bg)}" />
              <button class="color-reset" data-target="snowy_bg" ${customColors.snowy_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Stormy sky</label>
              <input type="color" id="stormy_bg" value="${escapeHtml(customColors.stormy_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.stormy_bg)}" />
              <button class="color-reset" data-target="stormy_bg" ${customColors.stormy_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Windy sky</label>
              <input type="color" id="windy_bg" value="${escapeHtml(customColors.windy_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.windy_bg)}" />
              <button class="color-reset" data-target="windy_bg" ${customColors.windy_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Cloudy sky</label>
              <input type="color" id="cloudy_bg" value="${escapeHtml(customColors.cloudy_bg || AnimatedWeatherCardEditor.DEFAULT_COLORS.cloudy_bg)}" />
              <button class="color-reset" data-target="cloudy_bg" ${customColors.cloudy_bg ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Text</label>
              <input type="color" id="text_color" value="${escapeHtml(customColors.text_color || AnimatedWeatherCardEditor.DEFAULT_COLORS.text_color)}" />
              <button class="color-reset" data-target="text_color" ${customColors.text_color ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Sun</label>
              <input type="color" id="sun_color" value="${escapeHtml(customColors.sun_color || AnimatedWeatherCardEditor.DEFAULT_COLORS.sun_color)}" />
              <button class="color-reset" data-target="sun_color" ${customColors.sun_color ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rain</label>
              <input type="color" id="rain_color" value="${escapeHtml(customColors.rain_color || AnimatedWeatherCardEditor.DEFAULT_COLORS.rain_color)}" />
              <button class="color-reset" data-target="rain_color" ${customColors.rain_color ? '' : 'hidden'}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snow</label>
              <input type="color" id="snow_color" value="${escapeHtml(customColors.snow_color || AnimatedWeatherCardEditor.DEFAULT_COLORS.snow_color)}" />
              <button class="color-reset" data-target="snow_color" ${customColors.snow_color ? '' : 'hidden'}>Reset</button>
            </div>
          </div>
          <button class="reset-colors-btn" id="reset-colors-btn" ${colorPalette === 'default' && Object.keys(customColors).length ? '' : 'hidden'}>Reset all colors</button>
          </div>
        </div>
      </div>
      
      <style>
        ${getConfigEditorStyles()}
      </style>
    `;

        this.attachEventListeners();

        // Ensure entity pickers are updated after render
        setTimeout(() => {
            this.updateEntityPickers();
        }, 0);
    }

    attachEventListeners() {
        // Set up entity pickers with hass and domain filtering
        this.updateEntityPickers();

        // Set up ha-select - let it initialize naturally without forcing values
        // The selected state will be set by the HTML template's default value

        // Basic settings
        this.querySelector('#entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#outdoor_sensor_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('outdoor_sensor_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#feels_like_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('feels_like_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#name')?.addEventListener('input', (e) => {
            this._updateConfig('name', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#humidity_sensor_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('humidity_sensor_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#pressure_sensor_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('pressure_sensor_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#wind_speed_sensor_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('wind_speed_sensor_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#wind_direction_sensor_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('wind_direction_sensor_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#indoor_temperature_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('indoor_temperature_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#indoor_humidity_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('indoor_humidity_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#sun_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('sun_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#flights_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('flights_entity', (e.target as HTMLInputElement).value);
        });

        this.querySelector('#note_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('note_entity', (e.target as HTMLInputElement).value);
            this.syncNoteOptions();
        });

        this.querySelector('#note_attribute')?.addEventListener('input', (e) => {
            this._updateConfig('note_attribute', (e.target as HTMLInputElement).value.trim());
        });

        this.querySelector('#note_max_age')?.addEventListener('change', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            if (value >= 0) this._updateConfig('note_max_age', value);
        });

        this.querySelector('#show_note')?.addEventListener('change', (e) => {
            this._updateConfig('show_note', (e.target as HTMLInputElement).checked || undefined);
            this.syncNoteOptions();
        });

        this._bindSelect('note_tone', [
            { value: 'snarky', label: 'Snarky' },
            { value: 'calm', label: 'Calm' },
            { value: 'friendly', label: 'Friendly' },
            { value: 'dry', label: 'Dry' },
        ], this._config?.note_tone || 'snarky', (value) => {
            this._updateConfig('note_tone', value === 'snarky' ? undefined : value);
        });

        this.querySelector('#note_ai_task_entity')?.addEventListener('value-changed', (e) => {
            this._updateConfig('note_ai_task_entity', (e.target as HTMLInputElement).value);
            this.syncNoteOptions();
        });

        this.querySelector('#note_calendar')?.addEventListener('value-changed', (e) => {
            // The picker is the first calendar; any others from YAML stay
            const calendars = [(e.target as HTMLInputElement).value, ...noteCalendarList(this._config?.note_calendar).slice(1)].filter(Boolean);
            this._updateConfig('note_calendar', calendars.length > 1 ? calendars : calendars[0] || undefined);
        });
        this.syncNoteOptions();

        // Selects: options are set as properties (HA 2026+ ha-select API)
        this._bindSelect('color_palette', [
            { value: 'default', label: 'Colorized sky' },
            { value: 'theme', label: 'Blend with dashboard theme' },
        ], this._config?.color_palette || 'default', (value) => {
            this._updateConfig('color_palette', value);
            // Show/hide color customization based on palette selection
            const colorGrid = this.querySelector('#color-grid') as HTMLElement;
            if (colorGrid) {
                colorGrid.style.display = value === 'default' ? 'grid' : 'none';
                colorGrid.style.opacity = value === 'default' ? '1' : '0.5';
            }
            this._syncColorResets();
        });
        this._bindSelect('indoor_style', [
            { value: 'label', label: 'The word "Indoors"' },
            { value: 'icon', label: 'A house icon' },
            { value: 'both', label: 'Icon and word' },
        ], this._config?.indoor_style || 'label', (value) => {
            // The word is the default, so it doesn't need to be written out
            this._updateConfig('indoor_style', value === 'label' ? undefined : value);
        });

        this.querySelector('#animate')?.addEventListener('change', (e) => {
            this._updateConfig('animate', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#show_attributes')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            this._updateConfig('show_attributes', checked);

            // Show/hide sub-options based on main toggle
            const labelsOption = this.querySelector('#attribute-labels-option') as HTMLElement;
            const iconsOption = this.querySelector('#attribute-icons-option') as HTMLElement;
            if (labelsOption) labelsOption.style.display = checked ? 'block' : 'none';
            if (iconsOption) iconsOption.style.display = checked ? 'block' : 'none';
        });

        this.querySelector('#show_attribute_labels')?.addEventListener('change', (e) => {
            this._updateConfig('show_attribute_labels', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#show_attribute_icons')?.addEventListener('change', (e) => {
            this._updateConfig('show_attribute_icons', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#compact')?.addEventListener('change', (e) => {
            this._updateConfig('compact', (e.target as HTMLInputElement).checked || undefined);
        });
        this.querySelector('#show_location')?.addEventListener('change', (e) => {

            this._updateConfig('show_location', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#show_indoor')?.addEventListener('change', (e) => {
            this._updateConfig('show_indoor', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#show_sun')?.addEventListener('change', (e) => {
            this._updateConfig('show_sun', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#show_flight_labels')?.addEventListener('change', (e) => {
            this._updateConfig('show_flight_labels', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#spill_particles')?.addEventListener('change', (e) => {
            this._updateConfig('spill_particles', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#auto_pause')?.addEventListener('change', (e) => {
            this._updateConfig('auto_pause', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#disable_lightning_shake')?.addEventListener('change', (e) => {
            this._updateConfig('disable_lightning_shake', (e.target as HTMLInputElement).checked);
        });

        this.querySelector('#dev_mode')?.addEventListener('change', (e) => {
            this._updateConfig('dev_mode', (e.target as HTMLInputElement).checked);
        });

        // Day/night cycle settings
        this.querySelector('#enable_day_night_cycle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            this._updateConfig('enable_day_night_cycle', checked);
            
            // Enable/disable sunrise and sunset hour inputs
            const sunriseOption = this.querySelector('#sunrise_hour')?.closest('.option') as HTMLElement | null;
            const sunsetOption = this.querySelector('#sunset_hour')?.closest('.option') as HTMLElement | null;
            
            if (sunriseOption && sunsetOption) {
                const style = checked ? '' : 'opacity: 0.5; pointer-events: none;';
                sunriseOption.style.cssText = style;
                sunsetOption.style.cssText = style;
            }
        });

        this.querySelector('#sunrise_hour')?.addEventListener('change', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            if (value >= 0 && value <= 23) {
                this._updateConfig('sunrise_hour', value);
            }
        });

        this.querySelector('#sunset_hour')?.addEventListener('change', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            if (value >= 0 && value <= 23) {
                this._updateConfig('sunset_hour', value);
            }
        });

        // Engine settings - prevent re-render during slider interaction
        const engineInputs = [
            'windSpeed', 'rainCount', 'leafCount', 'snowCount',
            'cloudBaseSize', 'cloudCount', 'splashBounce'
        ];

        engineInputs.forEach(settingKey => {
            const input = this.querySelector(`#${settingKey}`);
            if (input) {
                // Use input event for real-time display updates, change event for config updates
                input.addEventListener('input', (e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value);
                    // Update display immediately without config change
                    const display = (e.target as HTMLElement).parentNode!.querySelector('.value-display');
                    if (display) display.textContent = AnimatedWeatherCardEditor.formatEngineValue(settingKey, value);
                });

                input.addEventListener('change', (e) => {
                    const value = parseFloat((e.target as HTMLInputElement).value);
                    this._updateEngineConfig(settingKey, value);
                });
            }
        });

        // Reset engine button
        this.querySelector('.reset-engine-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this._resetEngineSettings();
        });

        // Color inputs
        const colorInputs = [
            'sunny_bg', 'rainy_bg', 'snowy_bg', 'stormy_bg', 'windy_bg', 'cloudy_bg',
            'text_color', 'sun_color', 'rain_color', 'snow_color'
        ];

        colorInputs.forEach(colorKey => {
            const input = this.querySelector(`#${colorKey}`);
            if (input) {
                input.addEventListener('change', (e) => {
                    this._updateColorConfig(colorKey, (e.target as HTMLInputElement).value);
                });
            }
        });

        // Individual color reset buttons
        this.querySelectorAll('.color-reset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const target = (e.target as HTMLElement).dataset.target!;
                this._resetColorConfig(target);
            });
        });

        // Reset all colors button
        this.querySelector('.reset-colors-btn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this._resetAllColors();
        });

        // Collapsible section headers
        this.querySelectorAll('.section-header').forEach(header => {
            const section = header.closest('.section');
            const sync = () => header.setAttribute('aria-expanded', String(!!section?.classList.contains('expanded')));
            const toggle = () => {
                section?.classList.toggle('expanded');
                sync();
            };
            sync();
            header.addEventListener('click', toggle);
            header.addEventListener('keydown', (e) => {
                const key = (e as KeyboardEvent).key;
                if (key === 'Enter' || key === ' ') {
                    e.preventDefault();
                    toggle();
                }
            });
        });
    }

    /** Fill an ha-select once it's upgraded, and report the chosen value. */
    private _bindSelect(id: string, options: Array<{ value: string; label: string }>, current: string,
                        onChange: (value: string) => void): void {
        const select = this.querySelector(`#${id}`) as HTMLElement & { value: string; options: Array<{ value: string; label: string }> } | null;
        if (!select) return;
        const init = () => {
            select.options = options;
            select.value = current;
        };
        if (customElements.get('ha-select')) init();
        else customElements.whenDefined('ha-select').then(init);

        select.addEventListener('selected', ((e: Event) => {
            const value = (e as CustomEvent).detail?.value;
            if (!value) return;
            select.value = value;
            onChange(value);
        }) as EventListener);
        // Keep the dropdown closing from bubbling up and closing HA's dialog
        select.addEventListener('closed', (e: Event) => e.stopPropagation());
    }

    /** The AI's controls count only with the switch on and no note entity; the status says what's missing. */
    private syncNoteOptions(): void {
        const writing = !!this._config?.show_note && !this._config?.note_entity;
        this.querySelectorAll<HTMLElement>('.note-ai').forEach(option => {
            option.style.cssText = writing ? '' : 'opacity: 0.5; pointer-events: none;';
        });
        void this.updateNoteStatus(writing);
    }

    /** The default AI Task entity, asked once per editor */
    private noteDefault?: Promise<string | null>;

    private async updateNoteStatus(writing: boolean): Promise<void> {
        const status = this.querySelector('#note_status') as HTMLElement | null;
        const hass = this._hass;
        if (!status) return;
        let text = '';
        if (writing && hass) {
            if (!hass.config?.components?.includes('ai_task')) {
                text = 'Needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic.';
            } else if (!this._config?.note_ai_task_entity) {
                this.noteDefault ??= hass.callWS({ type: 'ai_task/preferences/get' })
                    .then((prefs: { gen_data_entity_id?: string | null }) => prefs?.gen_data_entity_id ?? null)
                    .catch(() => null);
                if (!(await this.noteDefault)) text = 'Pick an AI Task above, or set a default in Settings → System → AI.';
            }
        }
        status.textContent = text;
        status.hidden = !text;
    }

    _updateConfig(key: string, value: any) {
        if (!this._config) {
            this._config = {};
        }

        if (value === '' || value === null || value === undefined) {
            delete this._config[key];
        } else {
            this._config[key] = value;
        }

        // Don't re-render for most config changes, just fire the config change event
        this._fireConfigChanged();
    }

    _updateEngineConfig(key: string, value: number) {
        if (!this._config!.engine_settings) {
            this._config!.engine_settings = {};
        }

        (this._config!.engine_settings as Record<string, number>)[key] = value;

        // Don't re-render, just fire the config change event
        this._fireConfigChanged();
    }

    _resetEngineSettings() {
        this._config!.engine_settings = {};

        // Only re-render for reset operations
        this.render();
        this._fireConfigChanged();
    }

    // Default color swatches — must match the inline `value="..."` defaults in
    // the color picker markup so reset returns the input to the intended hue.
    /** Engine values with their unit: multipliers as "1.5×", splash bounce as a percentage. */
    static formatEngineValue(key: string, value: number): string {
        if (key === 'cloudCount') return String(Math.round(value));
        if (key === 'splashBounce') return `${Math.round(value)}%`;
        return `${value.toFixed(1)}×`;
    }

    /** What each swatch shows when no custom color is set: the built-in look. */
    private static readonly DEFAULT_COLORS: Record<string, string> = {
        sunny_bg: skyColors('sunny', 'day').mid,
        rainy_bg: skyColors('rainy', 'day').mid,
        snowy_bg: skyColors('snowy', 'day').mid,
        stormy_bg: skyColors('stormy', 'day').mid,
        windy_bg: skyColors('windy', 'day').mid,
        cloudy_bg: skyColors('cloudy', 'day').mid,
        text_color: toHex(oklchToSrgb(SKY_TEXT)),
        sun_color: '#ffd67a',
        rain_color: '#deeaff',
        snow_color: '#f7fbff',
    };

    _updateColorConfig(key: string, value: string) {
        if (!this._config!.custom_colors) {
            this._config!.custom_colors = {};
        }

        this._config!.custom_colors[key] = value;
        this._syncColorResets();

        // Don't re-render: the user has just typed/picked into this color
        // input, so re-rendering would steal focus and collapse expanded
        // sections. The hosted card receives the change via config-changed.
        this._fireConfigChanged();
    }

    /** Show a Reset only next to colors that are actually customized. */
    _syncColorResets() {
        const custom = this._config?.custom_colors || {};
        this.querySelectorAll<HTMLElement>('.color-reset').forEach(btn => {
            btn.hidden = !custom[btn.dataset.target as keyof typeof custom];
        });
        const resetAll = this.querySelector<HTMLElement>('#reset-colors-btn');
        if (resetAll) {
            resetAll.hidden = (this._config?.color_palette || 'default') !== 'default' || Object.keys(custom).length === 0;
        }
    }

    _resetColorConfig(key: string) {
        if (this._config!.custom_colors) {
            delete this._config!.custom_colors[key];

            // If no colors left, remove the whole custom_colors object
            if (Object.keys(this._config!.custom_colors).length === 0) {
                delete this._config!.custom_colors;
            }
        }

        // Update only the affected input swatch instead of rebuilding the
        // whole editor. Avoids losing focus / scroll / expanded sections.
        const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
        if (input) input.value = AnimatedWeatherCardEditor.DEFAULT_COLORS[key] || input.value;
        this._syncColorResets();
        this._fireConfigChanged();
    }

    _resetAllColors() {
        delete this._config!.custom_colors;

        // Reset each color input swatch in place rather than re-rendering.
        for (const [key, def] of Object.entries(AnimatedWeatherCardEditor.DEFAULT_COLORS)) {
            const input = this.querySelector(`#${key}`) as HTMLInputElement | null;
            if (input) input.value = def;
        }
        this._syncColorResets();
        this._fireConfigChanged();
    }

    _fireConfigChanged() {
        const event = new CustomEvent('config-changed', {
            detail: { config: this._config },
            bubbles: true,
            composed: true
        });
        this.dispatchEvent(event);
    }

    set hass(hass: HomeAssistant) {
        this._hass = hass;
        // Only update entity pickers if we're fully initialized
        if (this._initialized && this.isConnected) {
            this.updateEntityPickers();
        }
    }

    updateEntityPickers() {
        if (!this._hass || !this.isConnected || !this._initialized) {
            return;
        }
        this.syncNoteOptions();

        const pickers = [
            { id: '#entity', domains: ['weather'] },
            { id: '#outdoor_sensor_entity', domains: ['sensor'] },
            { id: '#feels_like_entity', domains: ['sensor'] },
            { id: '#humidity_sensor_entity', domains: ['sensor'] },
            { id: '#pressure_sensor_entity', domains: ['sensor'] },
            { id: '#wind_speed_sensor_entity', domains: ['sensor'] },
            { id: '#wind_direction_sensor_entity', domains: ['sensor'] },
            { id: '#indoor_temperature_entity', domains: ['sensor'] },
            { id: '#indoor_humidity_entity', domains: ['sensor'] },
            { id: '#sun_entity', domains: ['sun'] },
            { id: '#flights_entity', domains: ['sensor'] },
            { id: '#note_entity', domains: ['sensor', 'input_text'] },
            { id: '#note_ai_task_entity', domains: ['ai_task'] },
            { id: '#note_calendar', domains: ['calendar'] }
        ];

        pickers.forEach(({ id, domains }) => {
            const picker = this.querySelector(id) as (HTMLElement & { value: string; hass?: HomeAssistant; includeDomains?: string[] }) | null;
            if (picker) {
                picker.hass = this._hass;
                picker.includeDomains = domains;
            }
        });
    }
}