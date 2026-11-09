"use strict";(()=>{var h={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80};var D=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var R=()=>`
${D(".card-config")}
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
`;var Y={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},P=(o,a,t)=>Math.min(a,Math.max(o,t)),_=(o,a,t)=>o+(a-o)*t;function K(o,a,t){let n=(a-o+540)%360-180;return(o+n*t+360)%360}function f(o,a,t){let n=([V,H,M])=>[V,H*Math.cos(M*Math.PI/180),H*Math.sin(M*Math.PI/180)],[i,e,s]=n(o),[r,c,d]=n(a),m=_(i,r,t),p=_(e,c,t),g=_(s,d,t),T=Math.hypot(p,g),O=T<1e-6?o[2]:(Math.atan2(g,p)*180/Math.PI+360)%360;return[m,T,O]}function F([o,a,t]){let n=t*Math.PI/180,i=a*Math.cos(n),e=a*Math.sin(n),s=(o+.3963377774*i+.2158037573*e)**3,r=(o-.1055613458*i-.0638541728*e)**3,c=(o-.0894841775*i-1.291485548*e)**3;return[4.0767416621*s-3.3077115913*r+.2309699292*c,-1.2684380046*s+2.6097574011*r-.3413193965*c,-.0041960863*s-.7034186147*r+1.707614701*c]}var X=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function b(o){let a=n=>n.every(i=>i>=-1e-4&&i<=1.0001),t=F(o);if(!a(t)){let n=0,i=o[1];for(let e=0;e<24;e++){let s=(n+i)/2;a(F([o[0],s,o[2]]))?n=s:i=s}t=F([o[0],n,o[2]])}return t.map(n=>X(P(0,1,n)))}var q=o=>Math.round(P(0,1,o)*255);function w(o){return"#"+o.map(a=>q(a).toString(16).padStart(2,"0")).join("")}function N(o,a){return`rgba(${o.map(q).join(", ")}, ${Number(a.toFixed(3))})`}function I(o,a){return[.15+(o[0]-.15)*.42,o[1]*_(.75,.5,a),K(o[2],262,.45)]}function J(o,a){let t=Y[o],n=1-t.overcast*.7,i={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:_(.46,.28,t.overcast)};if(o==="clear-night"){if(a==="dawn"||a==="dusk"){let e=a==="dawn"?[.4,.09,20]:[.38,.1,40];return{...i,bottom:f(t.bottom,e,.45),glowAlpha:.2,scrimAlpha:.22}}return{...i,scrimAlpha:.2}}switch(a){case"night":return{top:I(t.top,t.overcast),mid:I(t.mid,t.overcast),bottom:I(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:_(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:f(t.top,[t.top[0]*.8,.075,292],.5*n),mid:f(t.mid,[t.mid[0]*.88,.065,350],.42*n),bottom:f(t.bottom,[t.bottom[0]*.92,.115,52],.72*n),glow:f(t.glow,[.82,.13,58],n),glowAlpha:_(t.glowAlpha,.6,n*.6),scrimAlpha:i.scrimAlpha+.04};case"dawn":return{top:f(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*n),mid:f(t.mid,[t.mid[0]*.95,.05,330],.3*n),bottom:f(t.bottom,[t.bottom[0]*.95,.085,32],.62*n),glow:f(t.glow,[.88,.09,40],n),glowAlpha:_(t.glowAlpha,.5,n*.5),scrimAlpha:i.scrimAlpha+.04};default:return i}}function Q(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function v(o,a){let t=J(o,a);return{top:w(b(t.top)),mid:w(b(t.mid)),bottom:w(b(t.bottom)),glow:N(b(t.glow),t.glowAlpha),scrim:N(b(Q(t.top)),t.scrimAlpha)}}var G=[.985,.006,250];var Z={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},ee=Object.keys(Z),ce=ee.filter(o=>o.startsWith("--awc-sky-"));function l(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function y(o){let a=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:t,label:n,value:i,placeholder:e,hint:s,type:r,min:c,max:d}=o,m=[`id="${l(t)}"`,`label="${l(n)}"`,`value="${l(i)}"`,e?`placeholder="${l(e)}"`:"",r?`type="${r}"`:"",c!==void 0?`min="${c}"`:"",d!==void 0?`max="${d}"`:"",s?a==="ha-input"?`hint="${l(s)}"`:`helper="${l(s)}" helperPersistent`:""].filter(Boolean);return`<${a} ${m.join(" ")}></${a}>`}function W(o,a,t){if(o?.localize)try{let n=o.localize(a);if(n&&n!==a)return n}catch{}return t}function E(o){return o&&typeof o=="object"&&typeof o.action=="string"?o:void 0}function k(o,a){return{entity:a,tap_action:E(o?.tap_action),hold_action:E(o?.hold_action),double_tap_action:E(o?.double_tap_action)}}var x=["tap_action","hold_action","double_tap_action"],te={tap_action:["ui.panel.lovelace.editor.card.generic.tap_action","Tap behavior"],hold_action:["ui.panel.lovelace.editor.card.generic.hold_action","Hold behavior"],double_tap_action:["ui.panel.lovelace.editor.card.generic.double_tap_action","Double tap behavior"]},B=(o,a)=>W(o,...te[a]),ne=x.map(o=>({name:o,selector:{ui_action:{default_action:o==="tap_action"?"more-info":"none"}},context:{entity_id:"entity"}}));function S(o,a,t,n){let i={...t},e=r=>{i={...i,...r},n(r)},s=()=>{let r=document.createElement("ha-form");r.hass=a,r.data={...i},r.schema=ne,r.computeLabel=c=>B(a,c.name),r.addEventListener("value-changed",c=>{c.stopPropagation();let d=c.detail?.value??{},m={};for(let p of x){let g=E(d[p]);JSON.stringify(g)!==JSON.stringify(i[p])&&(m[p]=g)}r.data={...i,...m},Object.keys(m).length&&e(m)}),o.replaceChildren(r)};if(customElements.get("ha-form")){s();return}j(o,a,()=>i,e),customElements.whenDefined("ha-form").then(()=>{o.isConnected&&s()}),ie()}function C(o,a){let t=o?.querySelector("ha-form");t&&a&&(t.hass=a)}async function ie(){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"tile",entity:"sun.sun"}))?.constructor?.getConfigElement?.()}catch{}}var $=[{value:"default",label:"Default"},{value:"more-info",label:"More info"},{value:"navigate",label:"Navigate"},{value:"url",label:"Open a URL"},{value:"none",label:"Nothing"}],z={navigate:{key:"navigation_path",label:"Path",placeholder:"/lovelace/weather"},url:{key:"url_path",label:"URL",placeholder:"https://"}};function j(o,a,t,n){o.innerHTML=x.map(i=>{let e=t()[i],s=e?z[e.action]:void 0;return`<div class="option"><ha-select data-action="${i}" label="${l(B(a,i))}"></ha-select></div>`+(s?`<div class="option">${y({id:`${i}-${s.key}`,label:s.label,placeholder:s.placeholder,value:typeof e?.[s.key]=="string"?e[s.key]:""})}</div>`:"")}).join("");for(let i of x){let e=t()[i],s=o.querySelector(`[data-action="${i}"]`);if(!s)continue;let r=e&&!$.some(p=>p.value===e.action)?[...$,{value:e.action,label:`${e.action} (set in YAML)`}]:$,c=()=>{s.options=r,s.value=e?.action??"default"};customElements.get("ha-select")?c():customElements.whenDefined("ha-select").then(c),s.addEventListener("selected",(p=>{let g=p.detail?.value;!g||g===(t()[i]?.action??"default")||(n({[i]:g==="default"?void 0:{action:g}}),j(o,a,t,n))})),s.addEventListener("closed",p=>p.stopPropagation());let d=e?z[e.action]:void 0;(d?o.querySelector(`#${i}-${d.key}`):null)?.addEventListener("input",p=>{let g=p.target.value.trim(),{[d.key]:T,...O}=t()[i]??{action:e.action};n({[i]:{...O,action:e.action,...g?{[d.key]:g}:{}}})})}}function U(o){return(Array.isArray(o)?o:typeof o=="string"?[o]:[]).map(String).filter(Boolean)}var u=class u extends HTMLElement{constructor(){super(...arguments);this._initialized=!1}setConfig(t){let n=!this._config||Object.keys(t).length!==Object.keys(this._config).length||JSON.stringify(Object.keys(t).sort())!==JSON.stringify(Object.keys(this._config).sort());this._config={...t},this.isConnected&&n&&this.render()}async connectedCallback(){this._config=this._config||{},await this.ensureEntityPickerLoaded(),this.render(),this._initialized=!0,this._hass&&this.updateEntityPickers()}disconnectedCallback(){this._cleanupSuppressHandler(),this.innerHTML=""}_cleanupSuppressHandler(){this._suppressHandler&&(window.removeEventListener("unhandledrejection",this._suppressHandler),this._suppressHandler=void 0),this._suppressTimeout&&(clearTimeout(this._suppressTimeout),this._suppressTimeout=void 0)}async ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]});this._cleanupSuppressHandler(),this._suppressHandler=i=>{(i.reason?.message?.includes("localize")||i.reason?.message?.includes("hass"))&&i.preventDefault()},window.addEventListener("unhandledrejection",this._suppressHandler);try{await n.constructor.getConfigElement?.()}finally{this._suppressTimeout=setTimeout(()=>this._cleanupSuppressHandler(),2e3)}}catch{}}render(){this._config||(this._config={});let t=this._config.color_palette||"default",n=Object.fromEntries(Object.entries(this._config.engine_settings||{}).filter(([,e])=>typeof e=="number"&&isFinite(e))),i=this._config.custom_colors||{};this.innerHTML=`
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
                value="${l(this._config.entity||"")}"
                helper="Required unless developer mode is on"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${y({id:"name",label:"Name",placeholder:"Weather",value:this._config.name})}
            </div>
            <div class="option">
              <ha-entity-picker
                id="outdoor_sensor_entity"
                label="Outdoor temperature sensor"
                value="${l(this._config.outdoor_sensor_entity||"")}"
                helper="Shown instead of the weather entity's temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="feels_like_entity"
                label="Feels-like sensor"
                value="${l(this._config.feels_like_entity||"")}"
                helper="Adds a 'Feels like' line under the temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="humidity_sensor_entity"
                label="Humidity sensor"
                value="${l(this._config.humidity_sensor_entity||"")}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_speed_sensor_entity"
                label="Wind speed sensor"
                value="${l(this._config.wind_speed_sensor_entity||"")}"
                helper="Also sets how fast the weather moves. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_direction_sensor_entity"
                label="Wind direction sensor"
                value="${l(this._config.wind_direction_sensor_entity||"")}"
                helper="Points the wind arrow: degrees, or a compass point like NW. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="pressure_sensor_entity"
                label="Pressure sensor"
                value="${l(this._config.pressure_sensor_entity||"")}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_temperature_entity"
                label="Indoor temperature sensor"
                value="${l(this._config.indoor_temperature_entity||"")}"
                helper="Adds an indoor line under the condition"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_humidity_entity"
                label="Indoor humidity sensor"
                value="${l(this._config.indoor_humidity_entity||"")}"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="sun_entity"
                label="Sun entity"
                value="${l(this._config.sun_entity||"")}"
                helper="Usually sun.sun. Drives the sky's time of day and sunset time"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="flights_entity"
                label="Flights sensor"
                value="${l(this._config.flights_entity||"")}"
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
                <ha-switch id="compact" ${this._config.compact?"checked":""}></ha-switch>
                <span>Compact: one line, the temperature and condition over the sky</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="temperature_decimals" ${Number(this._config.temperature_decimals)===1?"checked":""}></ha-switch>
                <span>Temperatures to one decimal: 21.5\xB0 rather than 22\xB0</span>
              </label>
            </div>

            <div class="group-title">Show</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_location" ${this._config.show_location!==!1?"checked":""}></ha-switch>
                <span>Location</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_attributes" ${this._config.show_attributes!==!1?"checked":""}></ha-switch>
                <span>Humidity, wind and pressure</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-labels-option" style="display: ${this._config.show_attributes!==!1?"block":"none"}">
              <label class="switch-label">
                <ha-switch id="show_attribute_labels" ${this._config.show_attribute_labels!==!1?"checked":""}></ha-switch>
                <span>Labels</span>
              </label>
            </div>
            <div class="option sub-option" id="attribute-icons-option" style="display: ${this._config.show_attributes!==!1?"block":"none"}">
              <label class="switch-label">
                <ha-switch id="show_attribute_icons" ${this._config.show_attribute_icons!==!1?"checked":""}></ha-switch>
                <span>Icons</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_sun" ${this._config.show_sun!==!1?"checked":""}></ha-switch>
                <span>Next sunrise or sunset</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_indoor" ${this._config.show_indoor!==!1?"checked":""}></ha-switch>
                <span>Indoor temperature and humidity</span>
              </label>
            </div>
            <div class="option">
              <ha-select id="indoor_style" label="Indoor reading starts with"></ha-select>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_flight_labels" ${this._config.show_flight_labels!==!1?"checked":""}></ha-switch>
                <span>Flight labels on planes</span>
              </label>
            </div>

            <div class="group-title">Motion</div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="animate" ${this._config.animate!==!1?"checked":""}></ha-switch>
                <span>Animate the weather</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="spill_particles" ${this._config.spill_particles!==!1?"checked":""}></ha-switch>
                <span>Let rain, snow and leaves spill outside the card</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Interactions \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="interactions">
            <ha-icon icon="mdi:gesture-tap"></ha-icon>
            <h3>Interactions</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <p class="section-note">What a tap, a hold and a double tap on the card do. A tap opens the weather's details unless you choose something else.</p>
            <div id="actions-editor"></div>
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
                <ha-switch id="show_note" ${this._config.show_note?"checked":""}></ha-switch>
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
                value="${l(this._config.note_ai_task_entity||"")}"
                helper="Empty: the default in Settings \u2192 System \u2192 AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option note-ai">
              <ha-entity-picker
                id="note_calendar"
                label="Your calendar, for when you're out"
                value="${l(U(this._config.note_calendar)[0]||"")}"
                helper="Timed events count as time out; all-day and online ones don't. Only the times reach the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <p class="section-note">Or show a note from an entity of yours instead:</p>
            <div class="option">
              <ha-entity-picker
                id="note_entity"
                label="Note entity"
                value="${l(this._config.note_entity||"")}"
                helper="Its state is the one-line version. Used instead of the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              ${y({id:"note_attribute",label:"Longer note attribute",placeholder:"note",value:this._config.note_attribute,hint:"Shown where there's room for two lines"})}
            </div>
            <div class="option">
              ${y({id:"note_max_age",label:"Hide after (minutes)",type:"number",min:0,value:this._config.note_max_age??180,hint:"Counted from when it was written (an entity's generated_at). 0 keeps it"})}
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
                <ha-switch id="enable_day_night_cycle" ${this._config.enable_day_night_cycle?"checked":""}></ha-switch>
                <span>Follow a fixed day and night schedule</span>
              </label>
            </div>
            <div class="option ${this._config.enable_day_night_cycle?"":"disabled"}" style="${this._config.enable_day_night_cycle?"":"opacity: 0.5; pointer-events: none;"}">
              ${y({id:"sunrise_hour",label:"Sunrise hour (0-23)",type:"number",min:0,max:23,value:this._config.sunrise_hour??6,hint:"When the day sky and animations begin"})}
            </div>
            <div class="option ${this._config.enable_day_night_cycle?"":"disabled"}" style="${this._config.enable_day_night_cycle?"":"opacity: 0.5; pointer-events: none;"}">
              ${y({id:"sunset_hour",label:"Sunset hour (0-23)",type:"number",min:0,max:23,value:this._config.sunset_hour??20,hint:"When the night sky and animations begin"})}
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
                <ha-switch id="auto_pause" ${this._config.auto_pause?"checked":""}></ha-switch>
                <span>Also pause when the browser window is in the background</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="disable_lightning_shake" ${this._config.disable_lightning_shake?"checked":""}></ha-switch>
                <span>Turn off the lightning jolt</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="dev_mode" ${this._config.dev_mode?"checked":""}></ha-switch>
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
              <input type="range" id="windSpeed" min="0.5" max="5" step="0.1" value="${l(n.windSpeed||h.windSpeed)}" />
              <span class="value-display">${u.formatEngineValue("windSpeed",n.windSpeed||h.windSpeed)}</span>
            </div>
            <div class="engine-option">
              <label>Rain amount</label>
              <input type="range" id="rainCount" min="0.5" max="3" step="0.1" value="${l(n.rainCount||h.rainCount)}" />
              <span class="value-display">${u.formatEngineValue("rainCount",n.rainCount||h.rainCount)}</span>
            </div>
            <div class="engine-option">
              <label>Leaf amount</label>
              <input type="range" id="leafCount" min="0.5" max="3" step="0.1" value="${l(n.leafCount||h.leafCount)}" />
              <span class="value-display">${u.formatEngineValue("leafCount",n.leafCount||h.leafCount)}</span>
            </div>
            <div class="engine-option">
              <label>Snow amount</label>
              <input type="range" id="snowCount" min="0.5" max="3" step="0.1" value="${l(n.snowCount||h.snowCount)}" />
              <span class="value-display">${u.formatEngineValue("snowCount",n.snowCount||h.snowCount)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud size</label>
              <input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1" value="${l(n.cloudBaseSize||h.cloudBaseSize)}" />
              <span class="value-display">${u.formatEngineValue("cloudBaseSize",n.cloudBaseSize||h.cloudBaseSize)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud count</label>
              <input type="range" id="cloudCount" min="1" max="6" step="1" value="${l(n.cloudCount||h.cloudCount)}" />
              <span class="value-display">${u.formatEngineValue("cloudCount",n.cloudCount||h.cloudCount)}</span>
            </div>
            <div class="engine-option">
              <label>Splash bounce</label>
              <input type="range" id="splashBounce" min="40" max="120" step="5" value="${l(n.splashBounce||h.splashBounce)}" />
              <span class="value-display">${u.formatEngineValue("splashBounce",n.splashBounce||h.splashBounce)}</span>
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
              <input type="color" id="sunny_bg" value="${l(i.sunny_bg||u.DEFAULT_COLORS.sunny_bg)}" />
              <button class="color-reset" data-target="sunny_bg" ${i.sunny_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rainy sky</label>
              <input type="color" id="rainy_bg" value="${l(i.rainy_bg||u.DEFAULT_COLORS.rainy_bg)}" />
              <button class="color-reset" data-target="rainy_bg" ${i.rainy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snowy sky</label>
              <input type="color" id="snowy_bg" value="${l(i.snowy_bg||u.DEFAULT_COLORS.snowy_bg)}" />
              <button class="color-reset" data-target="snowy_bg" ${i.snowy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Stormy sky</label>
              <input type="color" id="stormy_bg" value="${l(i.stormy_bg||u.DEFAULT_COLORS.stormy_bg)}" />
              <button class="color-reset" data-target="stormy_bg" ${i.stormy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Windy sky</label>
              <input type="color" id="windy_bg" value="${l(i.windy_bg||u.DEFAULT_COLORS.windy_bg)}" />
              <button class="color-reset" data-target="windy_bg" ${i.windy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Cloudy sky</label>
              <input type="color" id="cloudy_bg" value="${l(i.cloudy_bg||u.DEFAULT_COLORS.cloudy_bg)}" />
              <button class="color-reset" data-target="cloudy_bg" ${i.cloudy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Text</label>
              <input type="color" id="text_color" value="${l(i.text_color||u.DEFAULT_COLORS.text_color)}" />
              <button class="color-reset" data-target="text_color" ${i.text_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Sun</label>
              <input type="color" id="sun_color" value="${l(i.sun_color||u.DEFAULT_COLORS.sun_color)}" />
              <button class="color-reset" data-target="sun_color" ${i.sun_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rain</label>
              <input type="color" id="rain_color" value="${l(i.rain_color||u.DEFAULT_COLORS.rain_color)}" />
              <button class="color-reset" data-target="rain_color" ${i.rain_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snow</label>
              <input type="color" id="snow_color" value="${l(i.snow_color||u.DEFAULT_COLORS.snow_color)}" />
              <button class="color-reset" data-target="snow_color" ${i.snow_color?"":"hidden"}>Reset</button>
            </div>
          </div>
          <button class="reset-colors-btn" id="reset-colors-btn" ${t==="default"&&Object.keys(i).length?"":"hidden"}>Reset all colors</button>
          </div>
        </div>
      </div>
      
      <style>
        ${R()}
      </style>
    `,this.attachEventListeners(),setTimeout(()=>{this.updateEntityPickers()},0)}attachEventListeners(){this.updateEntityPickers(),this.querySelector("#entity")?.addEventListener("value-changed",e=>{this._updateConfig("entity",e.target.value)}),this.querySelector("#outdoor_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("outdoor_sensor_entity",e.target.value)}),this.querySelector("#feels_like_entity")?.addEventListener("value-changed",e=>{this._updateConfig("feels_like_entity",e.target.value)}),this.querySelector("#name")?.addEventListener("input",e=>{this._updateConfig("name",e.target.value)}),this.querySelector("#humidity_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("humidity_sensor_entity",e.target.value)}),this.querySelector("#pressure_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("pressure_sensor_entity",e.target.value)}),this.querySelector("#wind_speed_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("wind_speed_sensor_entity",e.target.value)}),this.querySelector("#wind_direction_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("wind_direction_sensor_entity",e.target.value)}),this.querySelector("#indoor_temperature_entity")?.addEventListener("value-changed",e=>{this._updateConfig("indoor_temperature_entity",e.target.value)}),this.querySelector("#indoor_humidity_entity")?.addEventListener("value-changed",e=>{this._updateConfig("indoor_humidity_entity",e.target.value)}),this.querySelector("#sun_entity")?.addEventListener("value-changed",e=>{this._updateConfig("sun_entity",e.target.value)}),this.querySelector("#flights_entity")?.addEventListener("value-changed",e=>{this._updateConfig("flights_entity",e.target.value)}),this.querySelector("#note_entity")?.addEventListener("value-changed",e=>{this._updateConfig("note_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_attribute")?.addEventListener("input",e=>{this._updateConfig("note_attribute",e.target.value.trim())}),this.querySelector("#note_max_age")?.addEventListener("change",e=>{let s=parseInt(e.target.value);s>=0&&this._updateConfig("note_max_age",s)}),this.querySelector("#show_note")?.addEventListener("change",e=>{this._updateConfig("show_note",e.target.checked||void 0),this.syncNoteOptions()}),this._bindSelect("note_tone",[{value:"snarky",label:"Snarky"},{value:"calm",label:"Calm"},{value:"friendly",label:"Friendly"},{value:"dry",label:"Dry"}],this._config?.note_tone||"snarky",e=>{this._updateConfig("note_tone",e==="snarky"?void 0:e)}),this.querySelector("#note_ai_task_entity")?.addEventListener("value-changed",e=>{this._updateConfig("note_ai_task_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_calendar")?.addEventListener("value-changed",e=>{let s=[e.target.value,...U(this._config?.note_calendar).slice(1)].filter(Boolean);this._updateConfig("note_calendar",s.length>1?s:s[0]||void 0)}),this.syncNoteOptions(),this._bindSelect("color_palette",[{value:"default",label:"Colorized sky"},{value:"theme",label:"Blend with dashboard theme"}],this._config?.color_palette||"default",e=>{this._updateConfig("color_palette",e);let s=this.querySelector("#color-grid");s&&(s.style.display=e==="default"?"grid":"none",s.style.opacity=e==="default"?"1":"0.5"),this._syncColorResets()}),this._bindSelect("indoor_style",[{value:"label",label:'The word "Indoors"'},{value:"icon",label:"A house icon"},{value:"both",label:"Icon and word"}],this._config?.indoor_style||"label",e=>{this._updateConfig("indoor_style",e==="label"?void 0:e)});let t=this.querySelector("#actions-editor");t&&S(t,this._hass,k(this._config,this._config?.entity),e=>{for(let[s,r]of Object.entries(e))this._updateConfig(s,r)}),this.querySelector("#animate")?.addEventListener("change",e=>{this._updateConfig("animate",e.target.checked)}),this.querySelector("#show_attributes")?.addEventListener("change",e=>{let s=e.target.checked;this._updateConfig("show_attributes",s);let r=this.querySelector("#attribute-labels-option"),c=this.querySelector("#attribute-icons-option");r&&(r.style.display=s?"block":"none"),c&&(c.style.display=s?"block":"none")}),this.querySelector("#show_attribute_labels")?.addEventListener("change",e=>{this._updateConfig("show_attribute_labels",e.target.checked)}),this.querySelector("#show_attribute_icons")?.addEventListener("change",e=>{this._updateConfig("show_attribute_icons",e.target.checked)}),this.querySelector("#compact")?.addEventListener("change",e=>{this._updateConfig("compact",e.target.checked||void 0)}),this.querySelector("#temperature_decimals")?.addEventListener("change",e=>{this._updateConfig("temperature_decimals",e.target.checked?1:void 0)}),this.querySelector("#show_location")?.addEventListener("change",e=>{this._updateConfig("show_location",e.target.checked)}),this.querySelector("#show_indoor")?.addEventListener("change",e=>{this._updateConfig("show_indoor",e.target.checked)}),this.querySelector("#show_sun")?.addEventListener("change",e=>{this._updateConfig("show_sun",e.target.checked)}),this.querySelector("#show_flight_labels")?.addEventListener("change",e=>{this._updateConfig("show_flight_labels",e.target.checked)}),this.querySelector("#spill_particles")?.addEventListener("change",e=>{this._updateConfig("spill_particles",e.target.checked)}),this.querySelector("#auto_pause")?.addEventListener("change",e=>{this._updateConfig("auto_pause",e.target.checked)}),this.querySelector("#disable_lightning_shake")?.addEventListener("change",e=>{this._updateConfig("disable_lightning_shake",e.target.checked)}),this.querySelector("#dev_mode")?.addEventListener("change",e=>{this._updateConfig("dev_mode",e.target.checked)}),this.querySelector("#enable_day_night_cycle")?.addEventListener("change",e=>{let s=e.target.checked;this._updateConfig("enable_day_night_cycle",s);let r=this.querySelector("#sunrise_hour")?.closest(".option"),c=this.querySelector("#sunset_hour")?.closest(".option");if(r&&c){let d=s?"":"opacity: 0.5; pointer-events: none;";r.style.cssText=d,c.style.cssText=d}}),this.querySelector("#sunrise_hour")?.addEventListener("change",e=>{let s=parseInt(e.target.value);s>=0&&s<=23&&this._updateConfig("sunrise_hour",s)}),this.querySelector("#sunset_hour")?.addEventListener("change",e=>{let s=parseInt(e.target.value);s>=0&&s<=23&&this._updateConfig("sunset_hour",s)}),["windSpeed","rainCount","leafCount","snowCount","cloudBaseSize","cloudCount","splashBounce"].forEach(e=>{let s=this.querySelector(`#${e}`);s&&(s.addEventListener("input",r=>{let c=parseFloat(r.target.value),d=r.target.parentNode.querySelector(".value-display");d&&(d.textContent=u.formatEngineValue(e,c))}),s.addEventListener("change",r=>{let c=parseFloat(r.target.value);this._updateEngineConfig(e,c)}))}),this.querySelector(".reset-engine-btn")?.addEventListener("click",e=>{e.preventDefault(),this._resetEngineSettings()}),["sunny_bg","rainy_bg","snowy_bg","stormy_bg","windy_bg","cloudy_bg","text_color","sun_color","rain_color","snow_color"].forEach(e=>{let s=this.querySelector(`#${e}`);s&&s.addEventListener("change",r=>{this._updateColorConfig(e,r.target.value)})}),this.querySelectorAll(".color-reset").forEach(e=>{e.addEventListener("click",s=>{s.preventDefault();let r=s.target.dataset.target;this._resetColorConfig(r)})}),this.querySelector(".reset-colors-btn")?.addEventListener("click",e=>{e.preventDefault(),this._resetAllColors()}),this.querySelectorAll(".section-header").forEach(e=>{let s=e.closest(".section"),r=()=>e.setAttribute("aria-expanded",String(!!s?.classList.contains("expanded"))),c=()=>{s?.classList.toggle("expanded"),r()};r(),e.addEventListener("click",c),e.addEventListener("keydown",d=>{let m=d.key;(m==="Enter"||m===" ")&&(d.preventDefault(),c())})})}_bindSelect(t,n,i,e){let s=this.querySelector(`#${t}`);if(!s)return;let r=()=>{s.options=n,s.value=i};customElements.get("ha-select")?r():customElements.whenDefined("ha-select").then(r),s.addEventListener("selected",(c=>{let d=c.detail?.value;d&&(s.value=d,e(d))})),s.addEventListener("closed",c=>c.stopPropagation())}syncNoteOptions(){let t=!!this._config?.show_note&&!this._config?.note_entity;this.querySelectorAll(".note-ai").forEach(n=>{n.style.cssText=t?"":"opacity: 0.5; pointer-events: none;"}),this.updateNoteStatus(t)}async updateNoteStatus(t){let n=this.querySelector("#note_status"),i=this._hass;if(!n)return;let e="";t&&i&&(i.config?.components?.includes("ai_task")?this._config?.note_ai_task_entity||(this.noteDefault??(this.noteDefault=i.callWS({type:"ai_task/preferences/get"}).then(s=>s?.gen_data_entity_id??null).catch(()=>null)),await this.noteDefault||(e="Pick an AI Task above, or set a default in Settings \u2192 System \u2192 AI.")):e="Needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic."),n.textContent=e,n.hidden=!e}_updateConfig(t,n){this._config||(this._config={}),n===""||n===null||n===void 0?delete this._config[t]:this._config[t]=n,this._fireConfigChanged()}_updateEngineConfig(t,n){this._config.engine_settings||(this._config.engine_settings={}),this._config.engine_settings[t]=n,this._fireConfigChanged()}_resetEngineSettings(){this._config.engine_settings={},this.render(),this._fireConfigChanged()}static formatEngineValue(t,n){return t==="cloudCount"?String(Math.round(n)):t==="splashBounce"?`${Math.round(n)}%`:`${n.toFixed(1)}\xD7`}_updateColorConfig(t,n){this._config.custom_colors||(this._config.custom_colors={}),this._config.custom_colors[t]=n,this._syncColorResets(),this._fireConfigChanged()}_syncColorResets(){let t=this._config?.custom_colors||{};this.querySelectorAll(".color-reset").forEach(i=>{i.hidden=!t[i.dataset.target]});let n=this.querySelector("#reset-colors-btn");n&&(n.hidden=(this._config?.color_palette||"default")!=="default"||Object.keys(t).length===0)}_resetColorConfig(t){this._config.custom_colors&&(delete this._config.custom_colors[t],Object.keys(this._config.custom_colors).length===0&&delete this._config.custom_colors);let n=this.querySelector(`#${t}`);n&&(n.value=u.DEFAULT_COLORS[t]||n.value),this._syncColorResets(),this._fireConfigChanged()}_resetAllColors(){delete this._config.custom_colors;for(let[t,n]of Object.entries(u.DEFAULT_COLORS)){let i=this.querySelector(`#${t}`);i&&(i.value=n)}this._syncColorResets(),this._fireConfigChanged()}_fireConfigChanged(){let t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}set hass(t){this._hass=t,this._initialized&&this.isConnected&&this.updateEntityPickers()}updateEntityPickers(){if(!this._hass||!this.isConnected||!this._initialized)return;this.syncNoteOptions(),C(this.querySelector("#actions-editor"),this._hass),[{id:"#entity",domains:["weather"]},{id:"#outdoor_sensor_entity",domains:["sensor"]},{id:"#feels_like_entity",domains:["sensor"]},{id:"#humidity_sensor_entity",domains:["sensor"]},{id:"#pressure_sensor_entity",domains:["sensor"]},{id:"#wind_speed_sensor_entity",domains:["sensor"]},{id:"#wind_direction_sensor_entity",domains:["sensor"]},{id:"#indoor_temperature_entity",domains:["sensor"]},{id:"#indoor_humidity_entity",domains:["sensor"]},{id:"#sun_entity",domains:["sun"]},{id:"#flights_entity",domains:["sensor"]},{id:"#note_entity",domains:["sensor","input_text"]},{id:"#note_ai_task_entity",domains:["ai_task"]},{id:"#note_calendar",domains:["calendar"]}].forEach(({id:n,domains:i})=>{let e=this.querySelector(n);e&&(e.hass=this._hass,e.includeDomains=i)})}};u.DEFAULT_COLORS={sunny_bg:v("sunny","day").mid,rainy_bg:v("rainy","day").mid,snowy_bg:v("snowy","day").mid,stormy_bg:v("stormy","day").mid,windy_bg:v("windy","day").mid,cloudy_bg:v("cloudy","day").mid,text_color:w(b(G)),sun_color:"#ffd67a",rain_color:"#deeaff",snow_color:"#f7fbff"};var A=u;var oe=`
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
`,L=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1}setConfig(t){let n=JSON.stringify(t)===JSON.stringify(this._config);this._config={...t},this._initialized&&!n&&this._render()}set hass(t){this._hass=t,this._initialized&&this.isConnected&&(this._updatePickers(),C(this.querySelector("#st-actions"),t))}async connectedCallback(){this._config=this._config||{},await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),i=e=>{(e.reason?.message?.includes("localize")||e.reason?.message?.includes("hass"))&&e.preventDefault()};window.addEventListener("unhandledrejection",i);try{await n.constructor.getConfigElement()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",i),2e3)}catch{}}_render(){let t=this._config,n=(i,e,s,r)=>`
                    <label class="st-switch" for="${i}">
                        <span>${e}<small>${s}</small></span>
                        <ha-switch id="${i}" ${r?"checked":""}></ha-switch>
                    </label>`;this.innerHTML=`
            <style>${oe}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${y({id:"title",label:"Title (optional)",value:t.title})}
                <div class="st-switches">
                    ${n("compact","Compact","One line: the next sunrise or sunset beside the sun's path",!!t.compact)}
                    ${n("show_header","Next sunrise or sunset","The headline time and countdown",t.show_header!==!1)}
                    ${n("show_details","Details","First and last light, solar noon, daylight, moon",t.show_details!==!1)}
                    ${n("theme_palette","Blend with dashboard theme","Use theme colors instead of the sky",t.color_palette==="theme")}
                </div>
                <div class="st-actions-title">Interactions</div>
                <div id="st-actions"></div>
            </div>
        `,this._updatePickers(),this._attachListeners(),S(this.querySelector("#st-actions"),this._hass,k(this._config,this._config.sun_entity),i=>this._update(i))}_updatePickers(){let t=[{id:"#sun-picker",value:this._config.sun_entity||"",label:"Sun entity",domains:["sun"]},{id:"#moon-picker",value:this._config.moon_entity||"",label:"Moon phase entity (optional)",domains:["sensor"]},{id:"#weather-picker",value:this._config.weather_entity||"",label:"Share the sky of a weather entity (optional)",domains:["weather"]}];for(let n of t){let i=this.querySelector(n.id);i&&(this._hass&&(i.hass=this._hass),i.value=n.value,i.label=n.label,i.includeDomains=n.domains)}}_attachListeners(){this.querySelector("#sun-picker")?.addEventListener("value-changed",n=>{this._update({sun_entity:n.detail.value})}),this.querySelector("#moon-picker")?.addEventListener("value-changed",n=>{this._update({moon_entity:n.detail.value||void 0})}),this.querySelector("#weather-picker")?.addEventListener("value-changed",n=>{this._update({weather_entity:n.detail.value||void 0})}),this.querySelector("#title")?.addEventListener("input",n=>{this._update({title:n.target.value||void 0})});let t=(n,i)=>{this.querySelector(`#${n}`)?.addEventListener("change",e=>{this._update(i(e.target.checked))})};t("compact",n=>({compact:n||void 0})),t("show_header",n=>({show_header:n})),t("show_details",n=>({show_details:n})),t("theme_palette",n=>({color_palette:n?"theme":void 0}))}_update(t){let n={...this._config,...t};for(let i of Object.keys(n))(n[i]===void 0||n[i]==="")&&delete n[i];this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};customElements.get("animated-weather-card-editor")||customElements.define("animated-weather-card-editor",A);customElements.get("animated-sun-tracker-editor")||customElements.define("animated-sun-tracker-editor",L);})();
