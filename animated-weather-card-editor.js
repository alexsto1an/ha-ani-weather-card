"use strict";(()=>{var d={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80};var A=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var T=()=>`
${A(".card-config")}
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0;
          color: var(--primary-text-color);
        }

        /* \u2500\u2500 Sections (outlined expansion panels) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .section {
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: var(--ha-card-border-radius, 12px);
          overflow: hidden;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 48px;
          padding: 0 12px 0 16px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s ease;
        }
        .section-header:hover {
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        }
        .section-header:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -2px;
        }
        .section-header ha-icon {
          --mdc-icon-size: 20px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
        }
        .section-header h3 {
          flex: 1;
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          color: var(--primary-text-color);
        }
        .section-header .expand-icon {
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .section.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .section-content {
          display: none;
          padding: 4px 16px 16px;
        }
        .section.expanded .section-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-note {
          margin: 0 0 8px;
          font-size: 13px;
          line-height: 18px;
          color: var(--secondary-text-color);
        }

        .group-title {
          margin: 12px 0 2px;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }
        .group-title:first-child { margin-top: 4px; }

        /* \u2500\u2500 Options \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .option {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 4px 0;
        }

        /* Setting rows: label on the left, switch on the right */
        .switch-label {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 40px;
          cursor: pointer;
          user-select: none;
        }
        .switch-label span {
          font-size: 14px;
          line-height: 20px;
          color: var(--primary-text-color);
        }

        /* Dependent settings sit indented under their parent */
        .sub-option {
          margin-top: -4px;
          padding-left: 20px;
        }

        /* \u2500\u2500 Weather engine sliders \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .engine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px 24px;
          margin: 4px 0 12px;
        }
        .engine-option {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-areas:
            "label value"
            "range range";
          align-items: baseline;
          row-gap: 6px;
        }
        .engine-option label {
          grid-area: label;
          font-size: 14px;
          color: var(--primary-text-color);
        }
        .engine-option .value-display {
          grid-area: value;
          font-size: 13px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          color: var(--secondary-text-color);
        }
        .engine-option input[type="range"] {
          grid-area: range;
          width: 100%;
          margin: 0;
          accent-color: var(--primary-color);
          cursor: pointer;
        }

        /* \u2500\u2500 Colors \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 8px 24px;
          margin: 4px 0 12px;
        }
        .color-option {
          display: grid;
          grid-template-columns: 32px 1fr auto;
          align-items: center;
          gap: 12px;
          min-height: 40px;
        }
        .color-option input[type="color"] {
          order: -1;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: none;
          cursor: pointer;
        }
        .color-option input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .color-option input[type="color"]::-webkit-color-swatch { border: none; border-radius: 7px; }
        .color-option input[type="color"]::-moz-color-swatch { border: none; border-radius: 7px; }
        .color-option label {
          font-size: 14px;
          color: var(--primary-text-color);
        }

        /* \u2500\u2500 Buttons: quiet text buttons, HA style \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .color-reset,
        .reset-engine-btn,
        .reset-colors-btn {
          align-self: flex-start;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          background: none;
          font: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-color);
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        /* Text buttons align their label, not their hit area, with the content edge */
        .reset-engine-btn,
        .reset-colors-btn { margin-left: -12px; }
        .color-reset {
          padding: 6px 8px;
          margin-right: -8px;
          font-size: 13px;
        }
        .color-reset:hover,
        .reset-engine-btn:hover,
        .reset-colors-btn:hover {
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
        }
        .color-reset:focus-visible,
        .reset-engine-btn:focus-visible,
        .reset-colors-btn:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 1px;
        }
`;var N={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},I=(o,a,t)=>Math.min(a,Math.max(o,t)),p=(o,a,t)=>o+(a-o)*t;function R(o,a,t){let n=(a-o+540)%360-180;return(o+n*t+360)%360}function h(o,a,t){let n=([H,L,C])=>[H,L*Math.cos(C*Math.PI/180),L*Math.sin(C*Math.PI/180)],[e,i,s]=n(o),[r,c,u]=n(a),w=p(e,r,t),E=p(i,c,t),x=p(s,u,t),S=Math.hypot(E,x),D=S<1e-6?o[2]:(Math.atan2(x,E)*180/Math.PI+360)%360;return[w,S,D]}function _([o,a,t]){let n=t*Math.PI/180,e=a*Math.cos(n),i=a*Math.sin(n),s=(o+.3963377774*e+.2158037573*i)**3,r=(o-.1055613458*e-.0638541728*i)**3,c=(o-.0894841775*e-1.291485548*i)**3;return[4.0767416621*s-3.3077115913*r+.2309699292*c,-1.2684380046*s+2.6097574011*r-.3413193965*c,-.0041960863*s-.7034186147*r+1.707614701*c]}var q=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function m(o){let a=n=>n.every(e=>e>=-1e-4&&e<=1.0001),t=_(o);if(!a(t)){let n=0,e=o[1];for(let i=0;i<24;i++){let s=(n+e)/2;a(_([o[0],s,o[2]]))?n=s:e=s}t=_([o[0],n,o[2]])}return t.map(n=>q(I(0,1,n)))}var O=o=>Math.round(I(0,1,o)*255);function v(o){return"#"+o.map(a=>O(a).toString(16).padStart(2,"0")).join("")}function F(o,a){return`rgba(${o.map(O).join(", ")}, ${Number(a.toFixed(3))})`}function k(o,a){return[.15+(o[0]-.15)*.42,o[1]*p(.75,.5,a),R(o[2],262,.45)]}function P(o,a){let t=N[o],n=1-t.overcast*.7,e={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:p(.46,.28,t.overcast)};if(o==="clear-night"){if(a==="dawn"||a==="dusk"){let i=a==="dawn"?[.4,.09,20]:[.38,.1,40];return{...e,bottom:h(t.bottom,i,.45),glowAlpha:.2,scrimAlpha:.22}}return{...e,scrimAlpha:.2}}switch(a){case"night":return{top:k(t.top,t.overcast),mid:k(t.mid,t.overcast),bottom:k(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:p(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:h(t.top,[t.top[0]*.8,.075,292],.5*n),mid:h(t.mid,[t.mid[0]*.88,.065,350],.42*n),bottom:h(t.bottom,[t.bottom[0]*.92,.115,52],.72*n),glow:h(t.glow,[.82,.13,58],n),glowAlpha:p(t.glowAlpha,.6,n*.6),scrimAlpha:e.scrimAlpha+.04};case"dawn":return{top:h(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*n),mid:h(t.mid,[t.mid[0]*.95,.05,330],.3*n),bottom:h(t.bottom,[t.bottom[0]*.95,.085,32],.62*n),glow:h(t.glow,[.88,.09,40],n),glowAlpha:p(t.glowAlpha,.5,n*.5),scrimAlpha:e.scrimAlpha+.04};default:return e}}function G(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function g(o,a){let t=P(o,a);return{top:v(m(t.top)),mid:v(m(t.mid)),bottom:v(m(t.bottom)),glow:F(m(t.glow),t.glowAlpha),scrim:F(m(G(t.top)),t.scrimAlpha)}}var $=[.985,.006,250];var W={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},z=Object.keys(W),Y=z.filter(o=>o.startsWith("--awc-sky-"));function y(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function b(o){let a=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:t,label:n,value:e,placeholder:i,hint:s,type:r,min:c,max:u}=o,w=[`id="${y(t)}"`,`label="${y(n)}"`,`value="${y(e)}"`,i?`placeholder="${y(i)}"`:"",r?`type="${r}"`:"",c!==void 0?`min="${c}"`:"",u!==void 0?`max="${u}"`:"",s?a==="ha-input"?`hint="${y(s)}"`:`helper="${y(s)}" helperPersistent`:""].filter(Boolean);return`<${a} ${w.join(" ")}></${a}>`}function M(o){return(Array.isArray(o)?o:typeof o=="string"?[o]:[]).map(String).filter(Boolean)}var l=class l extends HTMLElement{constructor(){super(...arguments);this.r=!1}setConfig(t){let n=!this.e||Object.keys(t).length!==Object.keys(this.e).length||JSON.stringify(Object.keys(t).sort())!==JSON.stringify(Object.keys(this.e).sort());this.e={...t},this.isConnected&&n&&this.render()}async connectedCallback(){this.e=this.e||{},await this.ensureEntityPickerLoaded(),this.render(),this.r=!0,this.i&&this.updateEntityPickers()}disconnectedCallback(){this.l(),this.innerHTML=""}l(){this.o&&(window.removeEventListener("unhandledrejection",this.o),this.o=void 0),this.s&&(clearTimeout(this.s),this.s=void 0)}async ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]});this.l(),this.o=e=>{(e.reason?.message?.includes("localize")||e.reason?.message?.includes("hass"))&&e.preventDefault()},window.addEventListener("unhandledrejection",this.o);try{await n.constructor.getConfigElement?.()}finally{this.s=setTimeout(()=>this.l(),2e3)}}catch{}}render(){this.e||(this.e={});let t=this.e.color_palette||"default",n=this.e.engine_settings||{},e=this.e.custom_colors||{};this.innerHTML=`
      <div class="card-config">
        <!-- Entities \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
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
                value="${this.e.entity||""}"
                helper="Required unless developer mode is on"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${b({id:"name",label:"Name",placeholder:"Weather",value:this.e.name})}
            </div>
            <div class="option">
              <ha-entity-picker
                id="outdoor_sensor_entity"
                label="Outdoor temperature sensor"
                value="${this.e.outdoor_sensor_entity||""}"
                helper="Shown instead of the weather entity's temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="feels_like_entity"
                label="Feels-like sensor"
                value="${this.e.feels_like_entity||""}"
                helper="Adds a 'Feels like' line under the temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="humidity_sensor_entity"
                label="Humidity sensor"
                value="${this.e.humidity_sensor_entity||""}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_speed_sensor_entity"
                label="Wind speed sensor"
                value="${this.e.wind_speed_sensor_entity||""}"
                helper="Also sets how fast the weather moves. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_direction_sensor_entity"
                label="Wind direction sensor"
                value="${this.e.wind_direction_sensor_entity||""}"
                helper="Points the wind arrow: degrees, or a compass point like NW. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="pressure_sensor_entity"
                label="Pressure sensor"
                value="${this.e.pressure_sensor_entity||""}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_temperature_entity"
                label="Indoor temperature sensor"
                value="${this.e.indoor_temperature_entity||""}"
                helper="Adds an indoor line under the condition"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_humidity_entity"
                label="Indoor humidity sensor"
                value="${this.e.indoor_humidity_entity||""}"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="sun_entity"
                label="Sun entity"
                value="${this.e.sun_entity||""}"
                helper="Usually sun.sun. Drives the sky's time of day and sunset time"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="flights_entity"
                label="Flights sensor"
                value="${this.e.flights_entity||""}"
                helper="Flightradar24 'Current in area' sensor. Each new flight crosses the card once"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
          </div>
        </div>

        <!-- Display \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
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
                <ha-switch id="compact" ${this.e.compact?"checked":""}></ha-switch>
                <span>Compact: one line, the temperature and condition over the sky</span>
              </label>
            </div>

            <div class="group-title">Show</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_location" ${this.e.show_location!==!1?"checked":""}></ha-switch>
                <span>Location</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_attributes" ${this.e.show_attributes!==!1?"checked":""}></ha-switch>
                <span>Humidity, wind and pressure</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-labels-option" style="display: ${this.e.show_attributes!==!1?"block":"none"}">
              <label class="switch-label">
                <ha-switch id="show_attribute_labels" ${this.e.show_attribute_labels!==!1?"checked":""}></ha-switch>
                <span>Labels</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-icons-option" style="display: ${this.e.show_attributes!==!1?"block":"none"}">
              <label class="switch-label">
                <ha-switch id="show_attribute_icons" ${this.e.show_attribute_icons!==!1?"checked":""}></ha-switch>
                <span>Icons</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_sun" ${this.e.show_sun!==!1?"checked":""}></ha-switch>
                <span>Next sunrise or sunset</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_indoor" ${this.e.show_indoor!==!1?"checked":""}></ha-switch>
                <span>Indoor temperature and humidity</span>
              </label>
            </div>
            <div class="option">
              <ha-select id="indoor_style" label="Indoor reading starts with"></ha-select>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_flight_labels" ${this.e.show_flight_labels!==!1?"checked":""}></ha-switch>
                <span>Flight labels on planes</span>
              </label>
            </div>

            <div class="group-title">Motion</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="animate" ${this.e.animate!==!1?"checked":""}></ha-switch>
                <span>Animate the weather</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="spill_particles" ${this.e.spill_particles!==!1?"checked":""}></ha-switch>
                <span>Let rain, snow and leaves spill outside the card</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Weather note \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
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
                <ha-switch id="show_note" ${this.e.show_note?"checked":""}></ha-switch>
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
                value="${this.e.note_ai_task_entity||""}"
                helper="Empty: the default in Settings \u2192 System \u2192 AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option note-ai">
              <ha-entity-picker
                id="note_calendar"
                label="Your calendar, for when you're out"
                value="${M(this.e.note_calendar)[0]||""}"
                helper="Timed events count as time out; all-day and online ones don't. Only the times reach the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <p class="section-note">Or show a note from an entity of yours instead:</p>
            <div class="option">
              <ha-entity-picker
                id="note_entity"
                label="Note entity"
                value="${this.e.note_entity||""}"
                helper="Its state is the one-line version. Used instead of the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${b({id:"note_attribute",label:"Longer note attribute",placeholder:"note",value:this.e.note_attribute,hint:"Shown where there's room for two lines"})}
            </div>
            <div class="option">
              ${b({id:"note_max_age",label:"Hide after (minutes)",type:"number",min:0,value:this.e.note_max_age??180,hint:"Counted from when it was written (an entity's generated_at). 0 keeps it"})}
            </div>
          </div>
        </div>

        <!-- Day / Night \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="daynight">
            <ha-icon icon="mdi:weather-sunset"></ha-icon>
            <h3>Day and night</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <label class="switch-label">
                <ha-switch id="enable_day_night_cycle" ${this.e.enable_day_night_cycle?"checked":""}></ha-switch>
                <span>Follow a fixed day and night schedule</span>
              </label>
            </div>
            <div class="option ${this.e.enable_day_night_cycle?"":"disabled"}" style="${this.e.enable_day_night_cycle?"":"opacity: 0.5; pointer-events: none;"}">
              ${b({id:"sunrise_hour",label:"Sunrise hour (0-23)",type:"number",min:0,max:23,value:this.e.sunrise_hour??6,hint:"When the day sky and animations begin"})}
            </div>
            <div class="option ${this.e.enable_day_night_cycle?"":"disabled"}" style="${this.e.enable_day_night_cycle?"":"opacity: 0.5; pointer-events: none;"}">
              ${b({id:"sunset_hour",label:"Sunset hour (0-23)",type:"number",min:0,max:23,value:this.e.sunset_hour??20,hint:"When the night sky and animations begin"})}
            </div>
          </div>
        </div>

        <!-- Advanced \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="advanced">
            <ha-icon icon="mdi:tune"></ha-icon>
            <h3>Advanced</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <label class="switch-label">
                <ha-switch id="auto_pause" ${this.e.auto_pause?"checked":""}></ha-switch>
                <span>Also pause when the browser window is in the background</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="disable_lightning_shake" ${this.e.disable_lightning_shake?"checked":""}></ha-switch>
                <span>Turn off the lightning jolt</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="dev_mode" ${this.e.dev_mode?"checked":""}></ha-switch>
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
              <input type="range" id="windSpeed" min="0.5" max="5" step="0.1" value="${n.windSpeed||d.windSpeed}" />
              <span class="value-display">${l.formatEngineValue("windSpeed",n.windSpeed||d.windSpeed)}</span>
            </div>
            <div class="engine-option">
              <label>Rain amount</label>
              <input type="range" id="rainCount" min="0.5" max="3" step="0.1" value="${n.rainCount||d.rainCount}" />
              <span class="value-display">${l.formatEngineValue("rainCount",n.rainCount||d.rainCount)}</span>
            </div>
            <div class="engine-option">
              <label>Leaf amount</label>
              <input type="range" id="leafCount" min="0.5" max="3" step="0.1" value="${n.leafCount||d.leafCount}" />
              <span class="value-display">${l.formatEngineValue("leafCount",n.leafCount||d.leafCount)}</span>
            </div>
            <div class="engine-option">
              <label>Snow amount</label>
              <input type="range" id="snowCount" min="0.5" max="3" step="0.1" value="${n.snowCount||d.snowCount}" />
              <span class="value-display">${l.formatEngineValue("snowCount",n.snowCount||d.snowCount)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud size</label>
              <input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1" value="${n.cloudBaseSize||d.cloudBaseSize}" />
              <span class="value-display">${l.formatEngineValue("cloudBaseSize",n.cloudBaseSize||d.cloudBaseSize)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud count</label>
              <input type="range" id="cloudCount" min="1" max="6" step="1" value="${n.cloudCount||d.cloudCount}" />
              <span class="value-display">${l.formatEngineValue("cloudCount",n.cloudCount||d.cloudCount)}</span>
            </div>
            <div class="engine-option">
              <label>Splash bounce</label>
              <input type="range" id="splashBounce" min="40" max="120" step="5" value="${n.splashBounce||d.splashBounce}" />
              <span class="value-display">${l.formatEngineValue("splashBounce",n.splashBounce||d.splashBounce)}</span>
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
          
          <div class="color-grid" id="color-grid" style="display: ${t==="default"?"grid":"none"}; opacity: ${t==="default"?"1":"0.5"}">
            <div class="color-option">
              <label>Sunny sky</label>
              <input type="color" id="sunny_bg" value="${e.sunny_bg||l.DEFAULT_COLORS.sunny_bg}" />
              <button class="color-reset" data-target="sunny_bg" ${e.sunny_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rainy sky</label>
              <input type="color" id="rainy_bg" value="${e.rainy_bg||l.DEFAULT_COLORS.rainy_bg}" />
              <button class="color-reset" data-target="rainy_bg" ${e.rainy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snowy sky</label>
              <input type="color" id="snowy_bg" value="${e.snowy_bg||l.DEFAULT_COLORS.snowy_bg}" />
              <button class="color-reset" data-target="snowy_bg" ${e.snowy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Stormy sky</label>
              <input type="color" id="stormy_bg" value="${e.stormy_bg||l.DEFAULT_COLORS.stormy_bg}" />
              <button class="color-reset" data-target="stormy_bg" ${e.stormy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Windy sky</label>
              <input type="color" id="windy_bg" value="${e.windy_bg||l.DEFAULT_COLORS.windy_bg}" />
              <button class="color-reset" data-target="windy_bg" ${e.windy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Cloudy sky</label>
              <input type="color" id="cloudy_bg" value="${e.cloudy_bg||l.DEFAULT_COLORS.cloudy_bg}" />
              <button class="color-reset" data-target="cloudy_bg" ${e.cloudy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Text</label>
              <input type="color" id="text_color" value="${e.text_color||l.DEFAULT_COLORS.text_color}" />
              <button class="color-reset" data-target="text_color" ${e.text_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Sun</label>
              <input type="color" id="sun_color" value="${e.sun_color||l.DEFAULT_COLORS.sun_color}" />
              <button class="color-reset" data-target="sun_color" ${e.sun_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rain</label>
              <input type="color" id="rain_color" value="${e.rain_color||l.DEFAULT_COLORS.rain_color}" />
              <button class="color-reset" data-target="rain_color" ${e.rain_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snow</label>
              <input type="color" id="snow_color" value="${e.snow_color||l.DEFAULT_COLORS.snow_color}" />
              <button class="color-reset" data-target="snow_color" ${e.snow_color?"":"hidden"}>Reset</button>
            </div>
          </div>
          <button class="reset-colors-btn" id="reset-colors-btn" ${t==="default"&&Object.keys(e).length?"":"hidden"}>Reset all colors</button>
          </div>
        </div>
      </div>
      
      <style>
        ${T()}
      </style>
    `,this.attachEventListeners(),setTimeout(()=>{this.updateEntityPickers()},0)}attachEventListeners(){this.updateEntityPickers(),this.querySelector("#entity")?.addEventListener("value-changed",e=>{this.t("entity",e.target.value)}),this.querySelector("#outdoor_sensor_entity")?.addEventListener("value-changed",e=>{this.t("outdoor_sensor_entity",e.target.value)}),this.querySelector("#feels_like_entity")?.addEventListener("value-changed",e=>{this.t("feels_like_entity",e.target.value)}),this.querySelector("#name")?.addEventListener("input",e=>{this.t("name",e.target.value)}),this.querySelector("#humidity_sensor_entity")?.addEventListener("value-changed",e=>{this.t("humidity_sensor_entity",e.target.value)}),this.querySelector("#pressure_sensor_entity")?.addEventListener("value-changed",e=>{this.t("pressure_sensor_entity",e.target.value)}),this.querySelector("#wind_speed_sensor_entity")?.addEventListener("value-changed",e=>{this.t("wind_speed_sensor_entity",e.target.value)}),this.querySelector("#wind_direction_sensor_entity")?.addEventListener("value-changed",e=>{this.t("wind_direction_sensor_entity",e.target.value)}),this.querySelector("#indoor_temperature_entity")?.addEventListener("value-changed",e=>{this.t("indoor_temperature_entity",e.target.value)}),this.querySelector("#indoor_humidity_entity")?.addEventListener("value-changed",e=>{this.t("indoor_humidity_entity",e.target.value)}),this.querySelector("#sun_entity")?.addEventListener("value-changed",e=>{this.t("sun_entity",e.target.value)}),this.querySelector("#flights_entity")?.addEventListener("value-changed",e=>{this.t("flights_entity",e.target.value)}),this.querySelector("#note_entity")?.addEventListener("value-changed",e=>{this.t("note_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_attribute")?.addEventListener("input",e=>{this.t("note_attribute",e.target.value.trim())}),this.querySelector("#note_max_age")?.addEventListener("change",e=>{let i=parseInt(e.target.value);i>=0&&this.t("note_max_age",i)}),this.querySelector("#show_note")?.addEventListener("change",e=>{this.t("show_note",e.target.checked||void 0),this.syncNoteOptions()}),this.c("note_tone",[{value:"snarky",label:"Snarky"},{value:"calm",label:"Calm"},{value:"friendly",label:"Friendly"},{value:"dry",label:"Dry"}],this.e?.note_tone||"snarky",e=>{this.t("note_tone",e==="snarky"?void 0:e)}),this.querySelector("#note_ai_task_entity")?.addEventListener("value-changed",e=>{this.t("note_ai_task_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_calendar")?.addEventListener("value-changed",e=>{let i=[e.target.value,...M(this.e?.note_calendar).slice(1)].filter(Boolean);this.t("note_calendar",i.length>1?i:i[0]||void 0)}),this.syncNoteOptions(),this.c("color_palette",[{value:"default",label:"Colorized sky"},{value:"theme",label:"Blend with dashboard theme"}],this.e?.color_palette||"default",e=>{this.t("color_palette",e);let i=this.querySelector("#color-grid");i&&(i.style.display=e==="default"?"grid":"none",i.style.opacity=e==="default"?"1":"0.5"),this.a()}),this.c("indoor_style",[{value:"label",label:'The word "Indoors"'},{value:"icon",label:"A house icon"},{value:"both",label:"Icon and word"}],this.e?.indoor_style||"label",e=>{this.t("indoor_style",e==="label"?void 0:e)}),this.querySelector("#animate")?.addEventListener("change",e=>{this.t("animate",e.target.checked)}),this.querySelector("#show_attributes")?.addEventListener("change",e=>{let i=e.target.checked;this.t("show_attributes",i);let s=this.querySelector("#attribute-labels-option"),r=this.querySelector("#attribute-icons-option");s&&(s.style.display=i?"block":"none"),r&&(r.style.display=i?"block":"none")}),this.querySelector("#show_attribute_labels")?.addEventListener("change",e=>{this.t("show_attribute_labels",e.target.checked)}),this.querySelector("#show_attribute_icons")?.addEventListener("change",e=>{this.t("show_attribute_icons",e.target.checked)}),this.querySelector("#compact")?.addEventListener("change",e=>{this.t("compact",e.target.checked||void 0)}),this.querySelector("#show_location")?.addEventListener("change",e=>{this.t("show_location",e.target.checked)}),this.querySelector("#show_indoor")?.addEventListener("change",e=>{this.t("show_indoor",e.target.checked)}),this.querySelector("#show_sun")?.addEventListener("change",e=>{this.t("show_sun",e.target.checked)}),this.querySelector("#show_flight_labels")?.addEventListener("change",e=>{this.t("show_flight_labels",e.target.checked)}),this.querySelector("#spill_particles")?.addEventListener("change",e=>{this.t("spill_particles",e.target.checked)}),this.querySelector("#auto_pause")?.addEventListener("change",e=>{this.t("auto_pause",e.target.checked)}),this.querySelector("#disable_lightning_shake")?.addEventListener("change",e=>{this.t("disable_lightning_shake",e.target.checked)}),this.querySelector("#dev_mode")?.addEventListener("change",e=>{this.t("dev_mode",e.target.checked)}),this.querySelector("#enable_day_night_cycle")?.addEventListener("change",e=>{let i=e.target.checked;this.t("enable_day_night_cycle",i);let s=this.querySelector("#sunrise_hour")?.closest(".option"),r=this.querySelector("#sunset_hour")?.closest(".option");if(s&&r){let c=i?"":"opacity: 0.5; pointer-events: none;";s.style.cssText=c,r.style.cssText=c}}),this.querySelector("#sunrise_hour")?.addEventListener("change",e=>{let i=parseInt(e.target.value);i>=0&&i<=23&&this.t("sunrise_hour",i)}),this.querySelector("#sunset_hour")?.addEventListener("change",e=>{let i=parseInt(e.target.value);i>=0&&i<=23&&this.t("sunset_hour",i)}),["windSpeed","rainCount","leafCount","snowCount","cloudBaseSize","cloudCount","splashBounce"].forEach(e=>{let i=this.querySelector(`#${e}`);i&&(i.addEventListener("input",s=>{let r=parseFloat(s.target.value),c=s.target.parentNode.querySelector(".value-display");c&&(c.textContent=l.formatEngineValue(e,r))}),i.addEventListener("change",s=>{let r=parseFloat(s.target.value);this.d(e,r)}))}),this.querySelector(".reset-engine-btn")?.addEventListener("click",e=>{e.preventDefault(),this.u()}),["sunny_bg","rainy_bg","snowy_bg","stormy_bg","windy_bg","cloudy_bg","text_color","sun_color","rain_color","snow_color"].forEach(e=>{let i=this.querySelector(`#${e}`);i&&i.addEventListener("change",s=>{this.h(e,s.target.value)})}),this.querySelectorAll(".color-reset").forEach(e=>{e.addEventListener("click",i=>{i.preventDefault();let s=i.target.dataset.target;this.p(s)})}),this.querySelector(".reset-colors-btn")?.addEventListener("click",e=>{e.preventDefault(),this.m()}),this.querySelectorAll(".section-header").forEach(e=>{let i=e.closest(".section"),s=()=>e.setAttribute("aria-expanded",String(!!i?.classList.contains("expanded"))),r=()=>{i?.classList.toggle("expanded"),s()};s(),e.addEventListener("click",r),e.addEventListener("keydown",c=>{let u=c.key;(u==="Enter"||u===" ")&&(c.preventDefault(),r())})})}c(t,n,e,i){let s=this.querySelector(`#${t}`);if(!s)return;let r=()=>{s.options=n,s.value=e};customElements.get("ha-select")?r():customElements.whenDefined("ha-select").then(r),s.addEventListener("selected",(c=>{let u=c.detail?.value;u&&(s.value=u,i(u))})),s.addEventListener("closed",c=>c.stopPropagation())}syncNoteOptions(){let t=!!this.e?.show_note&&!this.e?.note_entity;this.querySelectorAll(".note-ai").forEach(n=>{n.style.cssText=t?"":"opacity: 0.5; pointer-events: none;"}),this.updateNoteStatus(t)}async updateNoteStatus(t){let n=this.querySelector("#note_status"),e=this.i;if(!n)return;let i="";t&&e&&(e.config?.components?.includes("ai_task")?this.e?.note_ai_task_entity||(this.noteDefault??(this.noteDefault=e.callWS({type:"ai_task/preferences/get"}).then(s=>s?.gen_data_entity_id??null).catch(()=>null)),await this.noteDefault||(i="Pick an AI Task above, or set a default in Settings \u2192 System \u2192 AI.")):i="Needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic."),n.textContent=i,n.hidden=!i}t(t,n){this.e||(this.e={}),n===""||n===null||n===void 0?delete this.e[t]:this.e[t]=n,this.n()}d(t,n){this.e.engine_settings||(this.e.engine_settings={}),this.e.engine_settings[t]=n,this.n()}u(){this.e.engine_settings={},this.render(),this.n()}static formatEngineValue(t,n){return t==="cloudCount"?String(Math.round(n)):t==="splashBounce"?`${Math.round(n)}%`:`${n.toFixed(1)}\xD7`}h(t,n){this.e.custom_colors||(this.e.custom_colors={}),this.e.custom_colors[t]=n,this.a(),this.n()}a(){let t=this.e?.custom_colors||{};this.querySelectorAll(".color-reset").forEach(e=>{e.hidden=!t[e.dataset.target]});let n=this.querySelector("#reset-colors-btn");n&&(n.hidden=(this.e?.color_palette||"default")!=="default"||Object.keys(t).length===0)}p(t){this.e.custom_colors&&(delete this.e.custom_colors[t],Object.keys(this.e.custom_colors).length===0&&delete this.e.custom_colors);let n=this.querySelector(`#${t}`);n&&(n.value=l.DEFAULT_COLORS[t]||n.value),this.a(),this.n()}m(){delete this.e.custom_colors;for(let[t,n]of Object.entries(l.DEFAULT_COLORS)){let e=this.querySelector(`#${t}`);e&&(e.value=n)}this.a(),this.n()}n(){let t=new CustomEvent("config-changed",{detail:{config:this.e},bubbles:!0,composed:!0});this.dispatchEvent(t)}set hass(t){this.i=t,this.r&&this.isConnected&&this.updateEntityPickers()}updateEntityPickers(){if(!this.i||!this.isConnected||!this.r)return;this.syncNoteOptions(),[{id:"#entity",domains:["weather"]},{id:"#outdoor_sensor_entity",domains:["sensor"]},{id:"#feels_like_entity",domains:["sensor"]},{id:"#humidity_sensor_entity",domains:["sensor"]},{id:"#pressure_sensor_entity",domains:["sensor"]},{id:"#wind_speed_sensor_entity",domains:["sensor"]},{id:"#wind_direction_sensor_entity",domains:["sensor"]},{id:"#indoor_temperature_entity",domains:["sensor"]},{id:"#indoor_humidity_entity",domains:["sensor"]},{id:"#sun_entity",domains:["sun"]},{id:"#flights_entity",domains:["sensor"]},{id:"#note_entity",domains:["sensor","input_text"]},{id:"#note_ai_task_entity",domains:["ai_task"]},{id:"#note_calendar",domains:["calendar"]}].forEach(({id:n,domains:e})=>{let i=this.querySelector(n);i&&(i.hass=this.i,i.includeDomains=e)})}};l.DEFAULT_COLORS={sunny_bg:g("sunny","day").mid,rainy_bg:g("rainy","day").mid,snowy_bg:g("snowy","day").mid,stormy_bg:g("stormy","day").mid,windy_bg:g("windy","day").mid,cloudy_bg:g("cloudy","day").mid,text_color:v(m($)),sun_color:"#ffd67a",rain_color:"#deeaff",snow_color:"#f7fbff"};var f=l;customElements.get("animated-weather-card-editor")||customElements.define("animated-weather-card-editor",f);})();
