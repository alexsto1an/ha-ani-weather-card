"use strict";(()=>{var f={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80};var q=s=>`
        ${s} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var z=()=>`
${q(".card-config")}
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
`;var Y={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},G=(s,l,t)=>Math.min(l,Math.max(s,t)),w=(s,l,t)=>s+(l-s)*t;function K(s,l,t){let n=(l-s+540)%360-180;return(s+n*t+360)%360}function _(s,l,t){let n=([L,$,P])=>[L,$*Math.cos(P*Math.PI/180),$*Math.sin(P*Math.PI/180)],[i,a,e]=n(s),[o,r,u]=n(l),d=w(i,o,t),h=w(a,r,t),b=w(e,u,t),g=Math.hypot(h,b),m=g<1e-6?s[2]:(Math.atan2(b,h)*180/Math.PI+360)%360;return[d,g,m]}function M([s,l,t]){let n=t*Math.PI/180,i=l*Math.cos(n),a=l*Math.sin(n),e=(s+.3963377774*i+.2158037573*a)**3,o=(s-.1055613458*i-.0638541728*a)**3,r=(s-.0894841775*i-1.291485548*a)**3;return[4.0767416621*e-3.3077115913*o+.2309699292*r,-1.2684380046*e+2.6097574011*o-.3413193965*r,-.0041960863*e-.7034186147*o+1.707614701*r]}var X=s=>s<=.0031308?12.92*s:1.055*Math.pow(s,1/2.4)-.055;function v(s){let l=n=>n.every(i=>i>=-1e-4&&i<=1.0001),t=M(s);if(!l(t)){let n=0,i=s[1];for(let a=0;a<24;a++){let e=(n+i)/2;l(M([s[0],e,s[2]]))?n=e:i=e}t=M([s[0],n,s[2]])}return t.map(n=>X(G(0,1,n)))}var B=s=>Math.round(G(0,1,s)*255);function x(s){return"#"+s.map(l=>B(l).toString(16).padStart(2,"0")).join("")}function W(s,l){return`rgba(${s.map(B).join(", ")}, ${Number(l.toFixed(3))})`}function I(s,l){return[.15+(s[0]-.15)*.42,s[1]*w(.75,.5,l),K(s[2],262,.45)]}function J(s,l){let t=Y[s],n=1-t.overcast*.7,i={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:w(.46,.28,t.overcast)};if(s==="clear-night"){if(l==="dawn"||l==="dusk"){let a=l==="dawn"?[.4,.09,20]:[.38,.1,40];return{...i,bottom:_(t.bottom,a,.45),glowAlpha:.2,scrimAlpha:.22}}return{...i,scrimAlpha:.2}}switch(l){case"night":return{top:I(t.top,t.overcast),mid:I(t.mid,t.overcast),bottom:I(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:w(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:_(t.top,[t.top[0]*.8,.075,292],.5*n),mid:_(t.mid,[t.mid[0]*.88,.065,350],.42*n),bottom:_(t.bottom,[t.bottom[0]*.92,.115,52],.72*n),glow:_(t.glow,[.82,.13,58],n),glowAlpha:w(t.glowAlpha,.6,n*.6),scrimAlpha:i.scrimAlpha+.04};case"dawn":return{top:_(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*n),mid:_(t.mid,[t.mid[0]*.95,.05,330],.3*n),bottom:_(t.bottom,[t.bottom[0]*.95,.085,32],.62*n),glow:_(t.glow,[.88,.09,40],n),glowAlpha:w(t.glowAlpha,.5,n*.5),scrimAlpha:i.scrimAlpha+.04};default:return i}}function Q(s){return[.16,Math.min(.04,s[1]*.6),s[2]]}function E(s,l){let t=J(s,l);return{top:x(v(t.top)),mid:x(v(t.mid)),bottom:x(v(t.bottom)),glow:W(v(t.glow),t.glowAlpha),scrim:W(v(Q(t.top)),t.scrimAlpha)}}var R=[.985,.006,250];var Z={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},ee=Object.keys(Z),pe=ee.filter(s=>s.startsWith("--awc-sky-"));function c(s){return s==null?"":String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function y(s){let l=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:t,label:n,value:i,placeholder:a,hint:e,type:o,min:r,max:u}=s,d=[`id="${c(t)}"`,`label="${c(n)}"`,`value="${c(i)}"`,a?`placeholder="${c(a)}"`:"",o?`type="${o}"`:"",r!==void 0?`min="${r}"`:"",u!==void 0?`max="${u}"`:"",e?l==="ha-input"?`hint="${c(e)}"`:`helper="${c(e)}" helperPersistent`:""].filter(Boolean);return`<${l} ${d.join(" ")}></${l}>`}function D(s,l,t){if(s?.localize)try{let n=s.localize(l);if(n&&n!==l)return n}catch{}return t}function A(s){return s&&typeof s=="object"&&typeof s.action=="string"?s:void 0}function S(s,l){return{entity:l,tap_action:A(s?.tap_action),hold_action:A(s?.hold_action),double_tap_action:A(s?.double_tap_action)}}var T=["tap_action","hold_action","double_tap_action"],te={tap_action:["ui.panel.lovelace.editor.card.generic.tap_action","Tap behavior"],hold_action:["ui.panel.lovelace.editor.card.generic.hold_action","Hold behavior"],double_tap_action:["ui.panel.lovelace.editor.card.generic.double_tap_action","Double tap behavior"]},N=(s,l)=>D(s,...te[l]),ne=T.map(s=>({name:s,selector:{ui_action:{default_action:s==="tap_action"?"more-info":"none"}},context:{entity_id:"entity"}}));function k(s,l,t,n,i={}){let a={...t},e=d=>{a={...a,...d},n(d)},o=d=>{let h=a[d]?.action;return h!==void 0&&Object.prototype.hasOwnProperty.call(i,h)?h:void 0},r=()=>T.filter(o).map(d=>{let h=document.createElement("div");return h.className="option card-action",h.innerHTML=`<span>${c(N(l,d))}: <b>${c(i[o(d)]??"")}</b></span><button type="button" class="card-action-reset">${c(D(l,"ui.common.reset","Reset"))}</button>`,h.querySelector("button").addEventListener("click",()=>{e({[d]:void 0}),k(s,l,a,n,i)}),h}),u=()=>{let d=document.createElement("ha-form");d.hass=l,d.data={...a},d.schema=ne.filter(h=>!o(h.name)),d.computeLabel=h=>N(l,h.name),d.addEventListener("value-changed",h=>{h.stopPropagation();let b=h.detail?.value??{},g={};for(let m of T){let L=A(b[m]);JSON.stringify(L)!==JSON.stringify(a[m])&&(g[m]=L)}d.data={...a,...g},Object.keys(g).length&&e(g)}),s.replaceChildren(...r(),d)};if(customElements.get("ha-form")){u();return}U(s,l,()=>a,e,i),customElements.whenDefined("ha-form").then(()=>{s.isConnected&&u()}),ie()}function C(s,l){let t=s?.querySelector("ha-form");t&&l&&(t.hass=l)}async function ie(){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"tile",entity:"sun.sun"}))?.constructor?.getConfigElement?.()}catch{}}var oe=[{value:"default",label:"Default"},{value:"more-info",label:"More info"},{value:"navigate",label:"Navigate"},{value:"url",label:"Open a URL"},{value:"none",label:"Nothing"}],j={navigate:{key:"navigation_path",label:"Path",placeholder:"/lovelace/weather"},url:{key:"url_path",label:"URL",placeholder:"https://"}};function U(s,l,t,n,i={}){let a=[...oe,...Object.entries(i).map(([e,o])=>({value:e,label:o}))];s.innerHTML=T.map(e=>{let o=t()[e],r=o?j[o.action]:void 0;return`<div class="option"><ha-select data-action="${e}" label="${c(N(l,e))}"></ha-select></div>`+(r?`<div class="option">${y({id:`${e}-${r.key}`,label:r.label,placeholder:r.placeholder,value:typeof o?.[r.key]=="string"?o[r.key]:""})}</div>`:"")}).join("");for(let e of T){let o=t()[e],r=s.querySelector(`[data-action="${e}"]`);if(!r)continue;let u=o&&!a.some(g=>g.value===o.action)?[...a,{value:o.action,label:`${o.action} (set in YAML)`}]:a,d=()=>{r.options=u,r.value=o?.action??"default"};customElements.get("ha-select")?d():customElements.whenDefined("ha-select").then(d),r.addEventListener("selected",(g=>{let m=g.detail?.value;!m||m===(t()[e]?.action??"default")||(n({[e]:m==="default"?void 0:{action:m}}),U(s,l,t,n,i))})),r.addEventListener("closed",g=>g.stopPropagation());let h=o?j[o.action]:void 0;(h?s.querySelector(`#${e}-${h.key}`):null)?.addEventListener("input",g=>{let m=g.target.value.trim(),{[h.key]:L,...$}=t()[e]??{action:o.action};n({[e]:{...$,action:o.action,...m?{[h.key]:m}:{}}})})}}function V(s){return(Array.isArray(s)?s:typeof s=="string"?[s]:[]).map(String).filter(Boolean)}var p=class p extends HTMLElement{constructor(){super(...arguments);this._initialized=!1}setConfig(t){let n=!this._config||Object.keys(t).length!==Object.keys(this._config).length||JSON.stringify(Object.keys(t).sort())!==JSON.stringify(Object.keys(this._config).sort());this._config={...t},this.isConnected&&n&&this.render()}async connectedCallback(){this._config=this._config||{},await this.ensureEntityPickerLoaded(),this.render(),this._initialized=!0,this._hass&&this.updateEntityPickers()}disconnectedCallback(){this._cleanupSuppressHandler(),this.innerHTML=""}_cleanupSuppressHandler(){this._suppressHandler&&(window.removeEventListener("unhandledrejection",this._suppressHandler),this._suppressHandler=void 0),this._suppressTimeout&&(clearTimeout(this._suppressTimeout),this._suppressTimeout=void 0)}async ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]});this._cleanupSuppressHandler(),this._suppressHandler=i=>{(i.reason?.message?.includes("localize")||i.reason?.message?.includes("hass"))&&i.preventDefault()},window.addEventListener("unhandledrejection",this._suppressHandler);try{await n.constructor.getConfigElement?.()}finally{this._suppressTimeout=setTimeout(()=>this._cleanupSuppressHandler(),2e3)}}catch{}}render(){this._config||(this._config={});let t=this._config.color_palette||"default",n=Object.fromEntries(Object.entries(this._config.engine_settings||{}).filter(([,a])=>typeof a=="number"&&isFinite(a))),i=this._config.custom_colors||{};this.innerHTML=`
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
                value="${c(this._config.entity||"")}"
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
                value="${c(this._config.outdoor_sensor_entity||"")}"
                helper="Shown instead of the weather entity's temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="feels_like_entity"
                label="Feels-like sensor"
                value="${c(this._config.feels_like_entity||"")}"
                helper="Adds a 'Feels like' line under the temperature"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="humidity_sensor_entity"
                label="Humidity sensor"
                value="${c(this._config.humidity_sensor_entity||"")}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_speed_sensor_entity"
                label="Wind speed sensor"
                value="${c(this._config.wind_speed_sensor_entity||"")}"
                helper="Also sets how fast the weather moves. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="wind_direction_sensor_entity"
                label="Wind direction sensor"
                value="${c(this._config.wind_direction_sensor_entity||"")}"
                helper="Points the wind arrow: degrees, or a compass point like NW. Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="pressure_sensor_entity"
                label="Pressure sensor"
                value="${c(this._config.pressure_sensor_entity||"")}"
                helper="Falls back to the weather entity"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_temperature_entity"
                label="Indoor temperature sensor"
                value="${c(this._config.indoor_temperature_entity||"")}"
                helper="Adds an indoor line under the condition"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="indoor_humidity_entity"
                label="Indoor humidity sensor"
                value="${c(this._config.indoor_humidity_entity||"")}"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="sun_entity"
                label="Sun entity"
                value="${c(this._config.sun_entity||"")}"
                helper="Usually sun.sun. Drives the sky's time of day and sunset time"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option">
              <ha-entity-picker
                id="flights_entity"
                label="Flights sensor"
                value="${c(this._config.flights_entity||"")}"
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
            <div class="option">
              <ha-select id="flight_label" label="Plane labels show"></ha-select>
            </div>
            <div class="option">
              <ha-select id="plane_speed" label="Plane speed"></ha-select>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="planes_on_load" ${this._config.planes_on_load?"checked":""}></ha-switch>
                <span>Fly the planes already overhead when the dashboard opens</span>
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

        <!-- Forecast and clock \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 -->
        <div class="section">
          <div class="section-header" role="button" tabindex="0" data-section="forecast">
            <ha-icon icon="mdi:clock-time-four-outline"></ha-icon>
            <h3>Forecast and clock</h3>
            <ha-icon class="expand-icon" icon="mdi:chevron-down"></ha-icon>
          </div>
          <div class="section-content">
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_clock" ${this._config.show_clock?"checked":""}></ha-switch>
                <span>The time, leading the location line</span>
              </label>
            </div>
            <div class="option">
              <label class="switch-label">
                <ha-switch id="show_forecast" ${this._config.show_forecast?"checked":""}></ha-switch>
                <span>The forecast: what turns, the hours ahead, and the slide through them</span>
              </label>
            </div>
            <p class="section-note">Drag the card sideways and its sky, weather and readings go to the hour you stop at. It stays there until you tap Now, or until nobody has touched it for half a minute. Asks for eight rows in a sections view (five without an hourly forecast); a shorter frame gives up the chips, then the icons, then the row, before the temperature ever shrinks. A tap opens the whole forecast unless you choose something else under Interactions.</p>
            <div class="option forecast-only">
              <ha-select id="forecast_metric" label="The hours first show"></ha-select>
            </div>
            <div class="option">
              <ha-select id="layout" label="Layout"></ha-select>
            </div>
            <div class="option nightstand-only">
              <ha-entity-picker id="alarm_entity" label="Next alarm" value="${c(this._config.alarm_entity||"")}" helper="A timestamp sensor, like the Companion app's next alarm, or an input_datetime" allow-custom-entity></ha-entity-picker>
            </div>
            <div class="option nightstand-only">
              ${y({id:"wake_time",label:"Wake time",placeholder:"07:00",value:this._config.wake_time,hint:"When you get up without an alarm"})}
            </div>
            <div class="option nightstand-only">
              ${y({id:"bed_time",label:"Bed time",placeholder:"22:30",value:this._config.bed_time,hint:"When night begins without a light sensor"})}
            </div>
            <div class="option nightstand-only">
              <ha-select id="night" label="Night"></ha-select>
            </div>
            <div class="option nightstand-only">
              <ha-entity-picker id="night_sensor" label="Light sensor" value="${c(this._config.night_sensor||"")}" helper="An illuminance sensor beside it: night when the room is dark" allow-custom-entity></ha-entity-picker>
            </div>
            <div class="option nightstand-only">
              <label class="switch-label">
                <ha-switch id="night_red" ${this._config.night_red!==!1?"checked":""}></ha-switch>
                <span>Red on black at night, as a bedside clock's night mode</span>
              </label>
            </div>
            <div class="option nightstand-only">
              ${y({id:"night_lux",label:"Dark below (lx)",type:"number",min:1,placeholder:"5",value:this._config.night_lux!==void 0?String(this._config.night_lux):"",hint:"Night when the light sensor reads less for a minute; day again at three times it"})}
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
                value="${c(this._config.note_ai_task_entity||"")}"
                helper="Empty: the default in Settings \u2192 System \u2192 AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="option note-ai">
              <ha-entity-picker
                id="note_calendar"
                label="Your calendar, for when you're out"
                value="${c(V(this._config.note_calendar)[0]||"")}"
                helper="Timed events count as time out; all-day and online ones don't. Only the times reach the AI"
                allow-custom-entity
              ></ha-entity-picker>
            </div>
            <p class="section-note">Or show a note from an entity of yours instead:</p>
            <div class="option">
              <ha-entity-picker
                id="note_entity"
                label="Note entity"
                value="${c(this._config.note_entity||"")}"
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
              <input type="range" id="windSpeed" min="0.5" max="5" step="0.1" value="${c(n.windSpeed||f.windSpeed)}" />
              <span class="value-display">${p.formatEngineValue("windSpeed",n.windSpeed||f.windSpeed)}</span>
            </div>
            <div class="engine-option">
              <label>Rain amount</label>
              <input type="range" id="rainCount" min="0.5" max="3" step="0.1" value="${c(n.rainCount||f.rainCount)}" />
              <span class="value-display">${p.formatEngineValue("rainCount",n.rainCount||f.rainCount)}</span>
            </div>
            <div class="engine-option">
              <label>Leaf amount</label>
              <input type="range" id="leafCount" min="0.5" max="3" step="0.1" value="${c(n.leafCount||f.leafCount)}" />
              <span class="value-display">${p.formatEngineValue("leafCount",n.leafCount||f.leafCount)}</span>
            </div>
            <div class="engine-option">
              <label>Snow amount</label>
              <input type="range" id="snowCount" min="0.5" max="3" step="0.1" value="${c(n.snowCount||f.snowCount)}" />
              <span class="value-display">${p.formatEngineValue("snowCount",n.snowCount||f.snowCount)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud size</label>
              <input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1" value="${c(n.cloudBaseSize||f.cloudBaseSize)}" />
              <span class="value-display">${p.formatEngineValue("cloudBaseSize",n.cloudBaseSize||f.cloudBaseSize)}</span>
            </div>
            <div class="engine-option">
              <label>Cloud count</label>
              <input type="range" id="cloudCount" min="1" max="6" step="1" value="${c(n.cloudCount||f.cloudCount)}" />
              <span class="value-display">${p.formatEngineValue("cloudCount",n.cloudCount||f.cloudCount)}</span>
            </div>
            <div class="engine-option">
              <label>Splash bounce</label>
              <input type="range" id="splashBounce" min="40" max="120" step="5" value="${c(n.splashBounce||f.splashBounce)}" />
              <span class="value-display">${p.formatEngineValue("splashBounce",n.splashBounce||f.splashBounce)}</span>
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
          <p class="section-note" id="sky-note" style="display: ${t==="default"?"block":"none"}">Each background color becomes a full sky for that condition. Applies to the colorized palette only.</p>
          
          <div class="color-grid" id="color-grid" style="display: ${t==="default"?"grid":"none"}; opacity: ${t==="default"?"1":"0.5"}">
            <div class="color-option">
              <label>Sunny sky</label>
              <input type="color" id="sunny_bg" value="${c(i.sunny_bg||p.DEFAULT_COLORS.sunny_bg)}" />
              <button class="color-reset" data-target="sunny_bg" ${i.sunny_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rainy sky</label>
              <input type="color" id="rainy_bg" value="${c(i.rainy_bg||p.DEFAULT_COLORS.rainy_bg)}" />
              <button class="color-reset" data-target="rainy_bg" ${i.rainy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snowy sky</label>
              <input type="color" id="snowy_bg" value="${c(i.snowy_bg||p.DEFAULT_COLORS.snowy_bg)}" />
              <button class="color-reset" data-target="snowy_bg" ${i.snowy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Stormy sky</label>
              <input type="color" id="stormy_bg" value="${c(i.stormy_bg||p.DEFAULT_COLORS.stormy_bg)}" />
              <button class="color-reset" data-target="stormy_bg" ${i.stormy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Windy sky</label>
              <input type="color" id="windy_bg" value="${c(i.windy_bg||p.DEFAULT_COLORS.windy_bg)}" />
              <button class="color-reset" data-target="windy_bg" ${i.windy_bg?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Cloudy sky</label>
              <input type="color" id="cloudy_bg" value="${c(i.cloudy_bg||p.DEFAULT_COLORS.cloudy_bg)}" />
              <button class="color-reset" data-target="cloudy_bg" ${i.cloudy_bg?"":"hidden"}>Reset</button>
            </div>
          </div>
          <p class="section-note">These apply on either palette.</p>
          <div class="color-grid" id="ink-grid">
            <div class="color-option">
              <label>Temperature</label>
              <input type="color" id="temperature_color" value="${c(i.temperature_color||p.DEFAULT_COLORS.temperature_color)}" />
              <button class="color-reset" data-target="temperature_color" ${i.temperature_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Text</label>
              <input type="color" id="text_color" value="${c(i.text_color||p.DEFAULT_COLORS.text_color)}" />
              <button class="color-reset" data-target="text_color" ${i.text_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Sun</label>
              <input type="color" id="sun_color" value="${c(i.sun_color||p.DEFAULT_COLORS.sun_color)}" />
              <button class="color-reset" data-target="sun_color" ${i.sun_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Rain</label>
              <input type="color" id="rain_color" value="${c(i.rain_color||p.DEFAULT_COLORS.rain_color)}" />
              <button class="color-reset" data-target="rain_color" ${i.rain_color?"":"hidden"}>Reset</button>
            </div>
            <div class="color-option">
              <label>Snow</label>
              <input type="color" id="snow_color" value="${c(i.snow_color||p.DEFAULT_COLORS.snow_color)}" />
              <button class="color-reset" data-target="snow_color" ${i.snow_color?"":"hidden"}>Reset</button>
            </div>
          </div>
          <button class="reset-colors-btn" id="reset-colors-btn" ${Object.keys(i).length?"":"hidden"}>Reset all colors</button>
          </div>
        </div>
      </div>
      
      <style>
        ${z()}
      </style>
    `,this.attachEventListeners(),setTimeout(()=>{this.updateEntityPickers()},0)}attachEventListeners(){this.updateEntityPickers(),this.querySelector("#entity")?.addEventListener("value-changed",e=>{this._updateConfig("entity",e.target.value)}),this.querySelector("#outdoor_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("outdoor_sensor_entity",e.target.value)}),this.querySelector("#feels_like_entity")?.addEventListener("value-changed",e=>{this._updateConfig("feels_like_entity",e.target.value)}),this.querySelector("#name")?.addEventListener("input",e=>{this._updateConfig("name",e.target.value)}),this.querySelector("#humidity_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("humidity_sensor_entity",e.target.value)}),this.querySelector("#pressure_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("pressure_sensor_entity",e.target.value)}),this.querySelector("#wind_speed_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("wind_speed_sensor_entity",e.target.value)}),this.querySelector("#wind_direction_sensor_entity")?.addEventListener("value-changed",e=>{this._updateConfig("wind_direction_sensor_entity",e.target.value)}),this.querySelector("#indoor_temperature_entity")?.addEventListener("value-changed",e=>{this._updateConfig("indoor_temperature_entity",e.target.value)}),this.querySelector("#indoor_humidity_entity")?.addEventListener("value-changed",e=>{this._updateConfig("indoor_humidity_entity",e.target.value)}),this.querySelector("#sun_entity")?.addEventListener("value-changed",e=>{this._updateConfig("sun_entity",e.target.value)}),this.querySelector("#flights_entity")?.addEventListener("value-changed",e=>{this._updateConfig("flights_entity",e.target.value)}),this.querySelector("#note_entity")?.addEventListener("value-changed",e=>{this._updateConfig("note_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_attribute")?.addEventListener("input",e=>{this._updateConfig("note_attribute",e.target.value.trim())}),this.querySelector("#note_max_age")?.addEventListener("change",e=>{let o=parseInt(e.target.value);o>=0&&this._updateConfig("note_max_age",o)}),this.querySelector("#show_clock")?.addEventListener("change",e=>{this._updateConfig("show_clock",e.target.checked||void 0)}),this.querySelector("#show_forecast")?.addEventListener("change",e=>{this._updateConfig("show_forecast",e.target.checked||void 0),this.syncForecastOptions()}),this._bindSelect("forecast_metric",[{value:"temp",label:"Temperature"},{value:"feels",label:"Feels like"},{value:"chance",label:"Chance of rain"},{value:"amount",label:"Rain amount"}],this._config?.forecast_metric||"temp",e=>{this._updateConfig("forecast_metric",e==="temp"?void 0:e)}),this._bindSelect("layout",[{value:"default",label:"The weather card"},{value:"nightstand",label:"Nightstand: the time as the hero"}],this._config?.layout||"default",e=>{this._updateConfig("layout",e==="default"?void 0:e),this.syncForecastOptions()}),this._bindSelect("night",[{value:"auto",label:"From the light sensor, else bed to wake time"},{value:"on",label:"Always"},{value:"off",label:"Never"}],this._config?.night||"auto",e=>{this._updateConfig("night",e==="auto"?void 0:e)}),this.querySelector("#alarm_entity")?.addEventListener("value-changed",e=>{this._updateConfig("alarm_entity",e.target.value||void 0)}),this.querySelector("#night_sensor")?.addEventListener("value-changed",e=>{this._updateConfig("night_sensor",e.target.value||void 0)}),this.querySelector("#night_red")?.addEventListener("change",e=>{this._updateConfig("night_red",e.target.checked?void 0:!1)}),this.querySelector("#night_lux")?.addEventListener("input",e=>{let o=Number((e.target.value||"").trim());this._updateConfig("night_lux",Number.isFinite(o)&&o>0?o:void 0)});for(let e of["wake_time","bed_time"])this.querySelector(`#${e}`)?.addEventListener("input",o=>{let r=(o.target.value||"").trim();this._updateConfig(e,/^\d{1,2}:\d{2}$/.test(r)?r:void 0)});this.syncForecastOptions(),this.querySelector("#show_note")?.addEventListener("change",e=>{this._updateConfig("show_note",e.target.checked||void 0),this.syncNoteOptions()}),this._bindSelect("flight_label",[{value:"flight",label:"Flight number and aircraft"},{value:"route",label:"Route (Lisbon \u2192 Paris)"},{value:"both",label:"Route and flight number"}],this._config?.flight_label||"flight",e=>{this._updateConfig("flight_label",e==="flight"?void 0:e)});let t=String(this._config?.plane_speed??1);this._bindSelect("plane_speed",[{value:"1",label:"Usual"},{value:"0.5",label:"Slower (half speed)"},{value:"0.25",label:"Slowest (a quarter)"},...["1","0.5","0.25"].includes(t)?[]:[{value:t,label:`${t}\xD7`}]],t,e=>{this._updateConfig("plane_speed",e==="1"?void 0:Number(e))}),this.querySelector("#planes_on_load")?.addEventListener("change",e=>{this._updateConfig("planes_on_load",e.target.checked||void 0)}),this._bindSelect("note_tone",[{value:"snarky",label:"Snarky"},{value:"calm",label:"Calm"},{value:"friendly",label:"Friendly"},{value:"dry",label:"Dry"}],this._config?.note_tone||"snarky",e=>{this._updateConfig("note_tone",e==="snarky"?void 0:e)}),this.querySelector("#note_ai_task_entity")?.addEventListener("value-changed",e=>{this._updateConfig("note_ai_task_entity",e.target.value),this.syncNoteOptions()}),this.querySelector("#note_calendar")?.addEventListener("value-changed",e=>{let o=[e.target.value,...V(this._config?.note_calendar).slice(1)].filter(Boolean);this._updateConfig("note_calendar",o.length>1?o:o[0]||void 0)}),this.syncNoteOptions(),this._bindSelect("color_palette",[{value:"default",label:"Colorized sky"},{value:"theme",label:"Blend with dashboard theme"}],this._config?.color_palette||"default",e=>{this._updateConfig("color_palette",e);let o=this.querySelector("#color-grid");o&&(o.style.display=e==="default"?"grid":"none",o.style.opacity=e==="default"?"1":"0.5");let r=this.querySelector("#sky-note");r&&(r.style.display=e==="default"?"block":"none"),this._syncColorResets()}),this._bindSelect("indoor_style",[{value:"label",label:'The word "Indoors"'},{value:"icon",label:"A house icon"},{value:"both",label:"Icon and word"}],this._config?.indoor_style||"label",e=>{this._updateConfig("indoor_style",e==="label"?void 0:e)});let n=this.querySelector("#actions-editor");n&&k(n,this._hass,S(this._config,this._config?.entity),e=>{for(let[o,r]of Object.entries(e))this._updateConfig(o,r)},{forecast:"Forecast"}),this.querySelector("#animate")?.addEventListener("change",e=>{this._updateConfig("animate",e.target.checked)}),this.querySelector("#show_attributes")?.addEventListener("change",e=>{let o=e.target.checked;this._updateConfig("show_attributes",o);let r=this.querySelector("#attribute-labels-option"),u=this.querySelector("#attribute-icons-option");r&&(r.style.display=o?"block":"none"),u&&(u.style.display=o?"block":"none")}),this.querySelector("#show_attribute_labels")?.addEventListener("change",e=>{this._updateConfig("show_attribute_labels",e.target.checked)}),this.querySelector("#show_attribute_icons")?.addEventListener("change",e=>{this._updateConfig("show_attribute_icons",e.target.checked)}),this.querySelector("#compact")?.addEventListener("change",e=>{this._updateConfig("compact",e.target.checked||void 0)}),this.querySelector("#temperature_decimals")?.addEventListener("change",e=>{this._updateConfig("temperature_decimals",e.target.checked?1:void 0)}),this.querySelector("#show_location")?.addEventListener("change",e=>{this._updateConfig("show_location",e.target.checked)}),this.querySelector("#show_indoor")?.addEventListener("change",e=>{this._updateConfig("show_indoor",e.target.checked)}),this.querySelector("#show_sun")?.addEventListener("change",e=>{this._updateConfig("show_sun",e.target.checked)}),this.querySelector("#show_flight_labels")?.addEventListener("change",e=>{this._updateConfig("show_flight_labels",e.target.checked)}),this.querySelector("#spill_particles")?.addEventListener("change",e=>{this._updateConfig("spill_particles",e.target.checked)}),this.querySelector("#auto_pause")?.addEventListener("change",e=>{this._updateConfig("auto_pause",e.target.checked)}),this.querySelector("#disable_lightning_shake")?.addEventListener("change",e=>{this._updateConfig("disable_lightning_shake",e.target.checked)}),this.querySelector("#dev_mode")?.addEventListener("change",e=>{this._updateConfig("dev_mode",e.target.checked)}),this.querySelector("#enable_day_night_cycle")?.addEventListener("change",e=>{let o=e.target.checked;this._updateConfig("enable_day_night_cycle",o);let r=this.querySelector("#sunrise_hour")?.closest(".option"),u=this.querySelector("#sunset_hour")?.closest(".option");if(r&&u){let d=o?"":"opacity: 0.5; pointer-events: none;";r.style.cssText=d,u.style.cssText=d}}),this.querySelector("#sunrise_hour")?.addEventListener("change",e=>{let o=parseInt(e.target.value);o>=0&&o<=23&&this._updateConfig("sunrise_hour",o)}),this.querySelector("#sunset_hour")?.addEventListener("change",e=>{let o=parseInt(e.target.value);o>=0&&o<=23&&this._updateConfig("sunset_hour",o)}),["windSpeed","rainCount","leafCount","snowCount","cloudBaseSize","cloudCount","splashBounce"].forEach(e=>{let o=this.querySelector(`#${e}`);o&&(o.addEventListener("input",r=>{let u=parseFloat(r.target.value),d=r.target.parentNode.querySelector(".value-display");d&&(d.textContent=p.formatEngineValue(e,u))}),o.addEventListener("change",r=>{let u=parseFloat(r.target.value);this._updateEngineConfig(e,u)}))}),this.querySelector(".reset-engine-btn")?.addEventListener("click",e=>{e.preventDefault(),this._resetEngineSettings()}),["sunny_bg","rainy_bg","snowy_bg","stormy_bg","windy_bg","cloudy_bg","temperature_color","text_color","sun_color","rain_color","snow_color"].forEach(e=>{let o=this.querySelector(`#${e}`);o&&o.addEventListener("change",r=>{this._updateColorConfig(e,r.target.value)})}),this.querySelectorAll(".color-reset").forEach(e=>{e.addEventListener("click",o=>{o.preventDefault();let r=o.target.dataset.target;this._resetColorConfig(r)})}),this.querySelector(".reset-colors-btn")?.addEventListener("click",e=>{e.preventDefault(),this._resetAllColors()}),this.querySelectorAll(".section-header").forEach(e=>{let o=e.closest(".section"),r=()=>e.setAttribute("aria-expanded",String(!!o?.classList.contains("expanded"))),u=()=>{o?.classList.toggle("expanded"),r()};r(),e.addEventListener("click",u),e.addEventListener("keydown",d=>{let h=d.key;(h==="Enter"||h===" ")&&(d.preventDefault(),u())})})}_bindSelect(t,n,i,a){let e=this.querySelector(`#${t}`);if(!e)return;let o=()=>{e.options=n,e.value=i};customElements.get("ha-select")?o():customElements.whenDefined("ha-select").then(o),e.addEventListener("selected",(r=>{let u=r.detail?.value;u&&(e.value=u,a(u))})),e.addEventListener("closed",r=>r.stopPropagation())}syncForecastOptions(){((n,i)=>this.querySelectorAll(n).forEach(a=>{a.style.cssText=i?"":"opacity: 0.5; pointer-events: none;"}))(".forecast-only",!!this._config?.show_forecast),this.querySelectorAll(".nightstand-only").forEach(n=>{n.hidden=this._config?.layout!=="nightstand"})}syncNoteOptions(){let t=!!this._config?.show_note&&!this._config?.note_entity;this.querySelectorAll(".note-ai").forEach(n=>{n.style.cssText=t?"":"opacity: 0.5; pointer-events: none;"}),this.updateNoteStatus(t)}async updateNoteStatus(t){let n=this.querySelector("#note_status"),i=this._hass;if(!n)return;let a="";t&&i&&(i.config?.components?.includes("ai_task")?this._config?.note_ai_task_entity||(this.noteDefault??(this.noteDefault=i.callWS({type:"ai_task/preferences/get"}).then(e=>e?.gen_data_entity_id??null).catch(()=>null)),await this.noteDefault||(a="Pick an AI Task above, or set a default in Settings \u2192 System \u2192 AI.")):a="Needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic."),n.textContent=a,n.hidden=!a}_updateConfig(t,n){this._config||(this._config={}),n===""||n===null||n===void 0?delete this._config[t]:this._config[t]=n,this._fireConfigChanged()}_updateEngineConfig(t,n){this._config.engine_settings||(this._config.engine_settings={}),this._config.engine_settings[t]=n,this._fireConfigChanged()}_resetEngineSettings(){this._config.engine_settings={},this.render(),this._fireConfigChanged()}static formatEngineValue(t,n){return t==="cloudCount"?String(Math.round(n)):t==="splashBounce"?`${Math.round(n)}%`:`${n.toFixed(1)}\xD7`}_updateColorConfig(t,n){this._config.custom_colors||(this._config.custom_colors={}),this._config.custom_colors[t]=n,this._syncColorResets(),this._fireConfigChanged()}_syncColorResets(){let t=this._config?.custom_colors||{};this.querySelectorAll(".color-reset").forEach(i=>{i.hidden=!t[i.dataset.target]});let n=this.querySelector("#reset-colors-btn");n&&(n.hidden=Object.keys(t).length===0)}_resetColorConfig(t){this._config.custom_colors&&(delete this._config.custom_colors[t],Object.keys(this._config.custom_colors).length===0&&delete this._config.custom_colors);let n=this.querySelector(`#${t}`);n&&(n.value=p.DEFAULT_COLORS[t]||n.value),this._syncColorResets(),this._fireConfigChanged()}_resetAllColors(){delete this._config.custom_colors;for(let[t,n]of Object.entries(p.DEFAULT_COLORS)){let i=this.querySelector(`#${t}`);i&&(i.value=n)}this._syncColorResets(),this._fireConfigChanged()}_fireConfigChanged(){let t=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(t)}set hass(t){this._hass=t,this._initialized&&this.isConnected&&this.updateEntityPickers()}updateEntityPickers(){if(!this._hass||!this.isConnected||!this._initialized)return;this.syncNoteOptions(),C(this.querySelector("#actions-editor"),this._hass),[{id:"#entity",domains:["weather"]},{id:"#outdoor_sensor_entity",domains:["sensor"]},{id:"#feels_like_entity",domains:["sensor"]},{id:"#humidity_sensor_entity",domains:["sensor"]},{id:"#pressure_sensor_entity",domains:["sensor"]},{id:"#wind_speed_sensor_entity",domains:["sensor"]},{id:"#wind_direction_sensor_entity",domains:["sensor"]},{id:"#indoor_temperature_entity",domains:["sensor"]},{id:"#indoor_humidity_entity",domains:["sensor"]},{id:"#sun_entity",domains:["sun"]},{id:"#flights_entity",domains:["sensor"]},{id:"#note_entity",domains:["sensor","input_text"]},{id:"#note_ai_task_entity",domains:["ai_task"]},{id:"#note_calendar",domains:["calendar"]}].forEach(({id:n,domains:i})=>{let a=this.querySelector(n);a&&(a.hass=this._hass,a.includeDomains=i)})}};p.DEFAULT_COLORS={sunny_bg:E("sunny","day").mid,rainy_bg:E("rainy","day").mid,snowy_bg:E("snowy","day").mid,stormy_bg:E("stormy","day").mid,windy_bg:E("windy","day").mid,cloudy_bg:E("cloudy","day").mid,text_color:x(v(R)),temperature_color:x(v(R)),sun_color:"#ffd67a",rain_color:"#deeaff",snow_color:"#f7fbff"};var F=p;var se=`
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
`,H=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1}setConfig(t){let n=JSON.stringify(t)===JSON.stringify(this._config);this._config={...t},this._initialized&&!n&&this._render()}set hass(t){this._hass=t,this._initialized&&this.isConnected&&(this._updatePickers(),C(this.querySelector("#st-actions"),t))}async connectedCallback(){this._config=this._config||{},await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),i=a=>{(a.reason?.message?.includes("localize")||a.reason?.message?.includes("hass"))&&a.preventDefault()};window.addEventListener("unhandledrejection",i);try{await n.constructor.getConfigElement()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",i),2e3)}catch{}}_render(){let t=this._config,n=(i,a,e,o)=>`
                    <label class="st-switch" for="${i}">
                        <span>${a}<small>${e}</small></span>
                        <ha-switch id="${i}" ${o?"checked":""}></ha-switch>
                    </label>`;this.innerHTML=`
            <style>${se}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${y({id:"title",label:"Title (optional)",value:t.title})}
                <ha-select id="direction" label="Direction"></ha-select>
                <div class="st-switches">
                    ${n("compact","Compact","One line: the next sunrise or sunset beside the sun's path",!!t.compact)}
                    ${n("show_header","Next sunrise or sunset","The headline time and countdown",t.show_header!==!1)}
                    ${n("show_details","Details","First and last light, solar noon, daylight, moon",t.show_details!==!1)}
                    ${n("theme_palette","Blend with dashboard theme","Use theme colors instead of the sky",t.color_palette==="theme")}
                </div>
                <div class="st-actions-title">Interactions</div>
                <div id="st-actions"></div>
            </div>
        `,this._updatePickers(),this._attachListeners(),k(this.querySelector("#st-actions"),this._hass,S(this._config,this._config.sun_entity),i=>this._update(i))}_updatePickers(){let t=[{id:"#sun-picker",value:this._config.sun_entity||"",label:"Sun entity",domains:["sun"]},{id:"#moon-picker",value:this._config.moon_entity||"",label:"Moon phase entity (optional)",domains:["sensor"]},{id:"#weather-picker",value:this._config.weather_entity||"",label:"Share the sky of a weather entity (optional)",domains:["weather"]}];for(let n of t){let i=this.querySelector(n.id);i&&(this._hass&&(i.hass=this._hass),i.value=n.value,i.label=n.label,i.includeDomains=n.domains)}}_attachListeners(){this.querySelector("#sun-picker")?.addEventListener("value-changed",i=>{this._update({sun_entity:i.detail.value})}),this.querySelector("#moon-picker")?.addEventListener("value-changed",i=>{this._update({moon_entity:i.detail.value||void 0})}),this.querySelector("#weather-picker")?.addEventListener("value-changed",i=>{this._update({weather_entity:i.detail.value||void 0})}),this.querySelector("#title")?.addEventListener("input",i=>{this._update({title:i.target.value||void 0})});let t=(i,a)=>{this.querySelector(`#${i}`)?.addEventListener("change",e=>{this._update(a(e.target.checked))})};t("compact",i=>({compact:i||void 0})),t("show_header",i=>({show_header:i})),t("show_details",i=>({show_details:i})),t("theme_palette",i=>({color_palette:i?"theme":void 0}));let n=this.querySelector("#direction");if(n){let i=this._config.direction??"auto",a=()=>{n.options=[{value:"auto",label:"From your location: right to left south of the equator"},{value:"left_to_right",label:"Left to right"},{value:"right_to_left",label:"Right to left"}],n.value=i};customElements.get("ha-select")?a():customElements.whenDefined("ha-select").then(a),n.addEventListener("selected",(e=>{let o=e.detail?.value;!o||o===i||(i=o,this._update({direction:o==="auto"?void 0:o}))})),n.addEventListener("closed",e=>e.stopPropagation())}}_update(t){let n={...this._config,...t};for(let i of Object.keys(n))(n[i]===void 0||n[i]==="")&&delete n[i];this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};var ae=`
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
`,re=[{value:"temp",label:"Temperature"},{value:"feels",label:"Feels like"},{value:"chance",label:"Chance of rain"},{value:"amount",label:"Rain amount"}],le=["0","3","5","7","10"].map(s=>({value:s,label:s==="0"?"No days":`${s} days`})),O=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1}setConfig(t){let n=JSON.stringify(t)===JSON.stringify(this._config);this._config={...t},this._initialized&&!n&&this._render()}set hass(t){this._hass=t,this._initialized&&this.isConnected&&(this._updatePickers(),C(this.querySelector("#fc-actions"),t))}async connectedCallback(){await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let n=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),i=a=>{(a.reason?.message?.includes("localize")||a.reason?.message?.includes("hass"))&&a.preventDefault()};window.addEventListener("unhandledrejection",i);try{await n.constructor.getConfigElement?.()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",i),2e3)}catch{}}_render(){let t=this._config,n=(o,r,u,d)=>`
                    <label class="fc-switch" for="${o}">
                        <span>${r}<small>${u}</small></span>
                        <ha-switch id="${o}" ${d?"checked":""}></ha-switch>
                    </label>`;this.innerHTML=`
            <style>${ae}</style>
            <div class="fc-editor">
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-select id="forecast_metric" label="The hours first show"></ha-select>
                <ha-select id="forecast_days" label="Days"></ha-select>
                <div class="fc-switches">
                    ${n("show_hours","The hours","The hourly row and its chips: drag it, and the sky goes there",t.show_hours!==!1)}
                    ${n("compact","Strip","The hours alone, to sit under the compact weather card",!!t.compact)}
                    ${n("theme_palette","Blend with dashboard theme","Use theme colors instead of the sky",t.color_palette==="theme")}
                </div>
                <div class="fc-title">Interactions</div>
                <div id="fc-actions"></div>
            </div>
        `,this._updatePickers();let i=(o,r,u,d)=>{let h=this.querySelector(`#${o}`);if(!h)return;let b=()=>{h.options=r,h.value=u};customElements.get("ha-select")?b():customElements.whenDefined("ha-select").then(b),h.addEventListener("selected",(g=>{let m=g.detail?.value;!m||m===u||(u=m,this._update(d(m)))})),h.addEventListener("closed",g=>g.stopPropagation())};i("forecast_metric",re,t.forecast_metric??"temp",o=>({forecast_metric:o==="temp"?void 0:o})),i("forecast_days",le,String(t.forecast_days??7),o=>({forecast_days:o==="7"?void 0:Number(o)}));let a=(o,r)=>{this.querySelector(`#${o}`)?.addEventListener("change",u=>{this._update(r(u.target.checked))})};a("compact",o=>({compact:o||void 0})),a("show_hours",o=>({show_hours:o?void 0:!1})),a("theme_palette",o=>({color_palette:o?"theme":void 0})),this.querySelector("#weather-picker")?.addEventListener("value-changed",o=>{this._update({entity:o.detail.value||void 0})}),this.querySelector("#sun-picker")?.addEventListener("value-changed",o=>{this._update({sun_entity:o.detail.value||void 0})});let e=S(this._config,this._config.entity);k(this.querySelector("#fc-actions"),this._hass,e.tap_action?e:{...e,tap_action:{action:"forecast"}},o=>this._update(o.tap_action===void 0&&"tap_action"in o?{...o,tap_action:{action:"more-info"}}:o.tap_action?.action==="forecast"?{...o,tap_action:void 0}:o),{forecast:"Forecast"})}_updatePickers(){let t=[{id:"#weather-picker",value:this._config.entity||"",label:"Weather entity",domains:["weather"]},{id:"#sun-picker",value:this._config.sun_entity||"",label:"Sun, for the sky's time of day (optional)",domains:["sun"]}];for(let n of t){let i=this.querySelector(n.id);i&&(this._hass&&(i.hass=this._hass),i.value=n.value,i.label=n.label,i.includeDomains=n.domains)}}_update(t){let n={...this._config,...t};for(let i of Object.keys(n))(n[i]===void 0||n[i]==="")&&delete n[i];this._config=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}};customElements.get("animated-weather-card-editor")||customElements.define("animated-weather-card-editor",F);customElements.get("animated-sun-tracker-editor")||customElements.define("animated-sun-tracker-editor",H);customElements.get("animated-forecast-card-editor")||customElements.define("animated-forecast-card-editor",O);})();
