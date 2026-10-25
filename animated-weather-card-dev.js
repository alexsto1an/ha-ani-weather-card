"use strict";(()=>{var E={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},A={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"},f={PARTICLES:{GOOD:100,WARNING:300},ANIMATIONS:{GOOD:3,WARNING:6},FRAME_RATE:{GOOD:45,WARNING:24},MEMORY:{GOOD:10240,WARNING:51200}},w={METRICS_REFRESH_INTERVAL:2e3,METRICS_INITIAL_DELAY:100,Z_INDEX:1e4,MAX_HEIGHT:"80vh",MAX_WIDTH:"300px"};function F(c){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(c)}function k(c,e,...n){c&&console.log(`[AWC Dev] ${e}`,...n)}function T(c,e){if(!c)throw new Error("Invalid element provided to updateDevModeWeatherInfo");F(e)||(console.warn(`Unknown weather condition: ${e}, using default`),e="sunny");let n=A,r=Object.fromEntries(Object.entries(E).map(([a,s])=>[a,s+"\xB0"])),i=c.querySelector(".temperature"),t=c.querySelector(".weather-desc");i&&(i.textContent=r[e]||"22\xB0"),t&&(t.textContent=n[e]||e)}function S(c,e,n,r,i){if(typeof c!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(e&&F(c))return c;if(e)return console.warn(`Invalid dev mode condition: ${c}, using sunny`),"sunny";let t=c.toLowerCase();if(t.includes("sleet")&&(t.includes("lightning")||t.includes("thunder")||t.includes("storm")))return"sleety-stormy";if((t.includes("snow")||t.includes("sleet"))&&(t.includes("lightning")||t.includes("thunder")||t.includes("storm")))return"snowy-stormy";if(t.includes("lightning")||t.includes("thunder")||t.includes("storm"))return"stormy";if(t.includes("fog")||t.includes("mist"))return"foggy";if(t.includes("heavy")&&t.includes("rain"))return"pouring";if(t.includes("pouring")||t.includes("downpour"))return"pouring";if((t.includes("snow")||t.includes("sleet"))&&(t.includes("rain")||t.includes("drizzle")))return"snowy-rainy";if(t.includes("light")&&(t.includes("rain")||t.includes("drizzle")))return"light-rain";if(t.includes("rain")||t.includes("drizzle"))return"rainy";if(t.includes("sleet")||t.includes("hail"))return"sleety";if(t.includes("snow"))return"snowy";if(t.includes("wind"))return"windy";if(t.includes("partly")&&t.includes("cloud"))return"partly-cloudy";if(t.includes("cloud")||t.includes("overcast"))return"cloudy";if(t.includes("clear")||t.includes("sunny")){let a=new Date,s;if(i)try{let o=new Intl.DateTimeFormat("en-US",{timeZone:i,hour:"numeric",hour12:!1}).formatToParts(a);s=parseInt(o.find(p=>p.type==="hour")?.value||"0",10)}catch{s=a.getHours()}else s=a.getHours();let d=n??6,u=r??20;return(s<d||s>=u)&&t.includes("clear")?"clear-night":"sunny"}return"sunny"}var M=()=>`
        .dev-toggle,
        .dev-controls {
          --dev-fg: #e9ecf3;
          --dev-fg-2: rgba(233, 236, 243, 0.62);
          --dev-line: rgba(255, 255, 255, 0.09);
          --dev-fill: rgba(255, 255, 255, 0.07);
          --dev-fill-hover: rgba(255, 255, 255, 0.13);
          --dev-accent: #7cc4ff;
          color-scheme: dark;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .dev-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: var(--dev-panel-z-index, 10000);
        }
        .dev-toggle-btn {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          background: rgba(10, 14, 24, 0.42);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          color: var(--dev-fg);
          cursor: pointer;
          transition: background-color 0.15s ease;
          --mdc-icon-size: 17px;
        }
        .dev-toggle-btn:hover { background: rgba(10, 14, 24, 0.62); }

        .dev-controls {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: var(--dev-panel-z-index, 10000);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 288px;
          max-height: min(640px, calc(100vh - 32px));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: rgba(17, 20, 28, 0.94);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          backdrop-filter: blur(20px) saturate(140%);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          color: var(--dev-fg);
          font-size: 13px;
          line-height: 18px;
          overflow: hidden;
        }

        /* Docked outside the card (see dockDevPanel) */
        .dev-controls[data-dock="right"] { top: 0; right: auto; left: calc(100% + 12px); }
        .dev-controls[data-dock="left"] { top: 0; left: auto; right: calc(100% + 12px); }
        .dev-controls[data-dock="below"] { top: calc(100% + 12px); right: 0; max-width: 100%; }

        .dev-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 10px 6px 16px;
        }
        .dev-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
        }

        .dev-close-btn,
        .dev-icon-btn {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: none;
          color: var(--dev-fg-2);
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
          --mdc-icon-size: 16px;
        }
        .dev-close-btn:hover,
        .dev-icon-btn:hover {
          background: var(--dev-fill-hover);
          color: var(--dev-fg);
        }

        .dev-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 0 16px;
          scrollbar-width: thin;
        }

        .dev-section {
          padding: 12px 0;
          border-top: 1px solid var(--dev-line);
        }
        .dev-section:first-child { border-top: none; padding-top: 4px; }

        .dev-section-label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 600;
          line-height: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--dev-fg-2);
        }
        .dev-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: -6px 0 2px;
        }
        .dev-section-head .dev-section-label { margin: 0; }

        .dev-selector {
          width: 100%;
          height: 32px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          background-color: var(--dev-fill);
          color: var(--dev-fg);
          font: inherit;
          cursor: pointer;
        }
        .dev-selector:focus-visible {
          outline: 2px solid var(--dev-accent);
          outline-offset: 1px;
        }
        .dev-selector:disabled { opacity: 0.4; cursor: default; }

        .dev-time-controls {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 12px;
        }
        .dev-check {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
        }

        .dev-controls input[type="checkbox"],
        .dev-controls input[type="range"] {
          accent-color: var(--dev-accent);
          margin: 0;
        }
        .dev-controls input[type="checkbox"] { width: 15px; height: 15px; cursor: pointer; }

        .dev-layers {
          display: grid;
          gap: 4px;
        }
        .dev-layer {
          display: grid;
          grid-template-columns: 15px 76px 1fr;
          align-items: center;
          gap: 10px;
          min-height: 24px;
        }
        .dev-layer label { cursor: pointer; }
        .dev-layer input[type="range"] { width: 100%; cursor: pointer; }
        .dev-layer input[type="range"]:disabled { opacity: 0.3; cursor: default; }

        .dev-performance-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 16px;
          margin: 0;
        }
        .performance-metric { display: flex; flex-direction: column; gap: 2px; }
        .performance-metric dt {
          font-size: 11px;
          line-height: 14px;
          color: var(--dev-fg-2);
        }
        .performance-metric dd {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          font-variant-numeric: tabular-nums;
        }
        .metric-good { color: #74e0a8; }
        .metric-warning { color: #f7cf6a; }
        .metric-critical { color: #ff9b94; }

        .dev-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px 14px;
          border-top: 1px solid var(--dev-line);
        }
        .dev-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1 1 auto;
          height: 34px;
          padding: 0 12px;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: var(--dev-fill);
          color: var(--dev-fg);
          font: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease;
          --mdc-icon-size: 16px;
        }
        .dev-btn:hover { background: var(--dev-fill-hover); }
        .dev-btn:focus-visible,
        .dev-toggle-btn:focus-visible,
        .dev-close-btn:focus-visible,
        .dev-icon-btn:focus-visible {
          outline: 2px solid var(--dev-accent);
          outline-offset: 1px;
        }
        .dev-pause-btn { flex: 0 0 34px; padding: 0; }
        .dev-pause-btn[aria-pressed="true"] {
          background: var(--dev-accent);
          border-color: transparent;
          color: #0b1220;
        }
`;var l=(c,...e)=>k(!0,c,...e),D=["A20N","B738","B789","B77W","B748","CRJ9","C68A","AT76","C172","EC35"],y=12,v=class{constructor(e){this.card=e;this.open=!1;this.timePhase="day";this.programmaticSliderUpdate=!1}get isOpen(){return this.open}mount(){if(!this.card.config?.dev_mode)return;if(!this.open&&this.performanceInterval&&(clearInterval(this.performanceInterval),this.performanceInterval=void 0),!this.card.querySelector("style.awc-dev-styles")){let n=document.createElement("style");n.className="awc-dev-styles",n.textContent=M(),this.card.prepend(n)}let e=this.card.querySelector(".dev-controls, .dev-toggle");e?e.outerHTML=this.render():this.card.querySelector("style.awc-dev-styles").insertAdjacentHTML("afterend",this.render()),this.attach()}disconnect(){this.performanceInterval&&clearInterval(this.performanceInterval),this.performanceInterval=void 0}togglePause(){this.card.wasManuallyPaused=!this.card.animationsPaused,this.card.setAnimationsPaused(!this.card.animationsPaused)}dock(){let e=this.card.querySelector(".dev-controls");if(this.card.style.zIndex=e?"5":"",!e)return;let n=this.card.getBoundingClientRect();if(n.width===0)return;let r=e.offsetWidth||288,i=document.documentElement.clientWidth||window.innerWidth,t=n.right+y+r<=i-y?"right":n.left-y-r>=y?"left":"below";e.dataset.dock!==t&&(e.dataset.dock=t)}attach(){if(!this.card.config?.dev_mode)return;this.dock();let e=this.card.querySelector("#dev-toggle-btn");e&&e.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.open=!0,this.mount()});let n=this.card.querySelector("#dev-close-btn");n&&n.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.open=!1,this.mount()});let r=this.card.querySelector("#dev-weather-selector");r&&r.addEventListener("change",async o=>{o.preventDefault(),o.stopPropagation();let p=o.currentTarget.value;if(p&&p!==this.card.currentDevCondition)this.card.currentDevCondition=p,this.updateWeatherInfo(),await this.applyPreset(p);else if(!p){this.card.currentDevCondition="";let m=this.card.querySelector("#dev-weather-selector");m&&(m.value="")}});let i=this.card.querySelector("#dev-day-night-override"),t=this.card.querySelector("#dev-time-phase");i&&t&&(i.addEventListener("change",async o=>{o.preventDefault(),o.stopPropagation(),this.card.devTimeOverride=o.target.checked,t.disabled=!this.card.devTimeOverride,this.card.devTimeOverride?await this.updateDevTimeOverride():this.card.timeOfDayManager&&this.card.timeOfDayManager.clearDevOverride()}),t.addEventListener("change",async o=>{o.preventDefault(),o.stopPropagation(),this.timePhase=o.target.value,this.card.devTimeOverride&&await this.updateDevTimeOverride()})),["rain","snow","sleet","wind","lightning","clouds","fog","stars","sun"].forEach(o=>{let p=this.card.querySelector(`#dev-${o}`),m=this.card.querySelector(`#dev-${o}-intensity`);p&&this.card.animationController&&p.addEventListener("change",async g=>{g.preventDefault(),g.stopPropagation();let b=g.target.checked,C=m?parseFloat(m.value):1;b?(await this.card.animationController.startAnimation(o,{intensity:C}),m&&(m.disabled=!1),this.setLayerVisibility(o,!0)):(await this.card.animationController.stopAnimation(o),m&&(m.disabled=!0),this.setLayerVisibility(o,!1)),this.card.currentDevCondition="";let x=this.card.querySelector("#dev-weather-selector");x&&(x.value=""),this.updateBackgroundForIndividualAnimations()}),m&&this.card.animationController&&m.addEventListener("input",async g=>{if(g.preventDefault(),g.stopPropagation(),this.programmaticSliderUpdate)return;let b=parseFloat(g.target.value);this.card.animationController.animations[o].isActive&&(await this.card.animationController.stopAnimation(o),await this.card.animationController.startAnimation(o,{intensity:b}),this.updateBackgroundForIndividualAnimations())})});let s=this.card.querySelector("#dev-clear-btn");s&&this.card.animationController&&s.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.card.animationController.stopAllAnimations(),this.mount(),this.updateBackgroundForIndividualAnimations()});let d=this.card.querySelector("#dev-pause-btn");d&&d.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.togglePause()});let u=this.card.querySelector("#dev-fly-plane");u&&u.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.flyDemoPlane()});let h=this.card.querySelector("#dev-metrics-refresh");h&&(h.addEventListener("click",o=>{o.preventDefault(),o.stopPropagation(),this.updatePerformanceMetrics()}),this.open&&!this.performanceInterval&&(this.performanceInterval=window.setInterval(()=>{this.updatePerformanceMetrics()},w.METRICS_REFRESH_INTERVAL),setTimeout(()=>{this.updatePerformanceMetrics()},w.METRICS_INITIAL_DELAY)))}updatePauseButton(){let e=this.card.querySelector("#dev-pause-btn");if(e){e.innerHTML=this.card.animationsPaused?'<ha-icon class="play-icon" icon="mdi:play"></ha-icon>':'<ha-icon class="pause-icon" icon="mdi:pause"></ha-icon>';let n=this.card.animationsPaused?"Resume animations":"Pause animations";e.title=n,e.setAttribute("aria-label",n),e.setAttribute("aria-pressed",String(this.card.animationsPaused))}}updatePerformanceMetrics(){if(!(!this.card.config?.dev_mode||!this.open))try{this.collectLegacyMetrics()}catch(e){console.warn("Failed to update performance metrics:",e),this.displayPerformanceMetrics(0,0,0,0)}}collectLegacyMetrics(){l("Collecting legacy performance metrics...");let e=0,n=0,r=0,i=60;try{e=this.safeCountParticles()}catch(t){console.warn("Error counting particles:",t),e=0}try{n=this.safeCountActiveAnimations()}catch(t){console.warn("Error counting active animations:",t),n=0}try{r=this.safeGetMemoryUsage()}catch(t){console.warn("Error getting memory usage:",t),r=0}try{i=this.estimateFrameRate(e,n)}catch(t){console.warn("Error estimating frame rate:",t),i=60}l(`Performance metrics collected: ${e} particles, ${n} animations, ${i} fps, ${r} KB`),this.displayPerformanceMetrics(e,n,i,r)}safeCountParticles(){let e=[".raindrop",".snowflake",".star-gsap",".cloud-gsap",".wind-leaf",".wind-swoosh",".sleet-particle",".moon-gsap",".fog-layer"],n=0;return e.forEach(r=>{try{let i=this.card.querySelectorAll(r),t=i?i.length:0;n+=t,t>0&&l(`Found ${t} ${r} particles`)}catch(i){l(`Error counting ${r} particles:`,i)}}),n}safeCountActiveAnimations(){if(this.card.animationController)try{let e=this.card.animationController.getAnimationStates();if(e){let n=Object.values(e).filter(r=>r&&r.isActive);return l(`Active animations via controller: ${n.length}`),n.length}}catch(e){l("Error getting animation states from controller:",e)}return 0}safeGetMemoryUsage(){if(typeof performance>"u")return l("Performance API not available"),0;let e=performance.memory;return!e||typeof e.usedJSHeapSize!="number"?(l("Memory info not available"),0):Math.round(e.usedJSHeapSize/1024)}estimateFrameRate(e,n){return e>200&&n>4?30:e>100&&n>2?45:e>50||n>1?55:60}displayPerformanceMetrics(e,n,r,i){l(`Attempting to display performance metrics: ${e} particles, ${n} animations, ${r} fps, ${i} KB`);let t=this.card.querySelector("#metric-particles"),a=this.card.querySelector("#metric-animations"),s=this.card.querySelector("#metric-framerate"),d=this.card.querySelector("#metric-memory");if(l("Performance elements found:",{particles:!!t,animations:!!a,framerate:!!s,memory:!!d}),t?(t.textContent=e.toString(),t.className=`metric-value ${this.getPerformanceClass(e,f.PARTICLES)}`,l(`Updated particles element: ${e}`)):l("Particles element not found"),a?(a.textContent=n.toString(),a.className=`metric-value ${this.getPerformanceClass(n,f.ANIMATIONS)}`,l(`Updated animations element: ${n}`)):l("Animations element not found"),s){let u=r>0?`${r} fps`:"--";s.textContent=u;let h=r>=f.FRAME_RATE.GOOD?"metric-good":r>=f.FRAME_RATE.WARNING?"metric-warning":r>0?"metric-critical":"metric-value";s.className=`metric-value ${h}`,l(`Updated framerate element: ${u}`)}else l("Framerate element not found");if(d){let u=i>0?`${i} KB`:"--";d.textContent=u,d.className=`metric-value ${this.getPerformanceClass(i,f.MEMORY)}`,l(`Updated memory element: ${u}`)}else l("Memory element not found");l("Performance metrics display complete")}getPerformanceClass(e,n){return e<n.GOOD?"metric-good":e<n.WARNING?"metric-warning":"metric-critical"}render(){if(!this.open)return`
        <div class="dev-toggle">
          <button class="dev-toggle-btn" id="dev-toggle-btn" title="Open developer controls" aria-label="Open developer controls">
            <ha-icon icon="mdi:tune-variant"></ha-icon>
          </button>
        </div>
      `;let e=this.card.animationController?.getAnimationStates()||{},n=[["sunny","Sunny"],["partly-cloudy","Partly cloudy"],["cloudy","Cloudy"],["foggy","Foggy"],["windy","Windy"],["light-rain","Light rain"],["rainy","Rainy"],["pouring","Pouring"],["stormy","Stormy"],["snowy","Snowy"],["snowy-rainy","Snow and rain"],["sleety","Sleet"],["snowy-stormy","Snowstorm"],["sleety-stormy","Sleet storm"],["clear-night","Clear night"]],r=[["dawn","Dawn"],["day","Day"],["dusk","Dusk"],["night","Night"]],t=[["rain","Rain",10],["snow","Snow",5],["sleet","Sleet",5],["wind","Wind",3],["lightning","Lightning",3],["clouds","Clouds",2],["fog","Fog",2],["stars","Stars",2],["sun","Sun",1]].map(([a,s,d])=>{let u=e[a];return`
            <div class="dev-layer">
              <input type="checkbox" id="dev-${a}" ${u?.isActive?"checked":""}>
              <label for="dev-${a}">${s}</label>
              <input type="range" id="dev-${a}-intensity" min="0.1" max="${d}" step="0.1" value="${u?.intensity||1}"
                     aria-label="${s} intensity" ${u?.isActive?"":"disabled"}>
            </div>`}).join("");return`
      <div class="dev-controls" role="dialog" aria-label="Developer controls">
        <div class="dev-header">
          <span class="dev-title">Developer</span>
          <button class="dev-close-btn" id="dev-close-btn" title="Close developer controls" aria-label="Close developer controls">
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        <div class="dev-body">
          <section class="dev-section">
            <label class="dev-section-label" for="dev-weather-selector">Condition</label>
            <select class="dev-selector" id="dev-weather-selector">
              <option value="" ${this.card.currentDevCondition?"":"selected"}>Manual (layers below)</option>
              ${n.map(([a,s])=>`<option value="${a}" ${this.card.currentDevCondition===a?"selected":""}>${s}</option>`).join("")}
            </select>
          </section>

          <section class="dev-section">
            <span class="dev-section-label">Time of day</span>
            <div class="dev-time-controls">
              <label class="dev-check">
                <input type="checkbox" id="dev-day-night-override" ${this.card.devTimeOverride?"checked":""}>
                <span>Override</span>
              </label>
              <select class="dev-selector dev-time-selector" id="dev-time-phase" aria-label="Time of day" ${this.card.devTimeOverride?"":"disabled"}>
                ${r.map(([a,s])=>`<option value="${a}" ${this.timePhase===a?"selected":""}>${s}</option>`).join("")}
              </select>
            </div>
          </section>

          <section class="dev-section">
            <span class="dev-section-label">Layers</span>
            <div class="dev-layers">${t}
            </div>
          </section>

          <section class="dev-section">
            <div class="dev-section-head">
              <span class="dev-section-label">Performance</span>
              <button class="dev-icon-btn" id="dev-metrics-refresh" title="Refresh performance data" aria-label="Refresh performance data">
                <ha-icon icon="mdi:refresh"></ha-icon>
              </button>
            </div>
            <dl class="dev-performance-metrics" id="dev-performance-metrics">
              <div class="performance-metric"><dt class="metric-label">Particles</dt><dd class="metric-value" id="metric-particles">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Animations</dt><dd class="metric-value" id="metric-animations">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Frame rate</dt><dd class="metric-value" id="metric-framerate">--</dd></div>
              <div class="performance-metric"><dt class="metric-label">Memory</dt><dd class="metric-value" id="metric-memory">--</dd></div>
            </dl>
          </section>
        </div>

        <div class="dev-actions">
          <button class="dev-btn" id="dev-fly-plane" title="Fly a demo plane across the card">
            <ha-icon icon="mdi:airplane"></ha-icon><span>Fly a plane</span>
          </button>
          <button class="dev-btn" id="dev-clear-btn" title="Stop every animation">
            <ha-icon icon="mdi:stop"></ha-icon><span>Clear</span>
          </button>
          <button class="dev-btn dev-pause-btn" id="dev-pause-btn"
                  title="${this.card.animationsPaused?"Resume animations":"Pause animations"}"
                  aria-label="${this.card.animationsPaused?"Resume animations":"Pause animations"}"
                  aria-pressed="${this.card.animationsPaused}">
            ${this.card.animationsPaused?'<ha-icon class="play-icon" icon="mdi:play"></ha-icon>':'<ha-icon class="pause-icon" icon="mdi:pause"></ha-icon>'}
          </button>
        </div>
      </div>
    `}updateWeatherInfo(){if(!this.card.config?.dev_mode)return;let e=this.card.currentDevCondition||"sunny";T(this.card,e)}setLayerVisibility(e,n){l(`setLayerVisibility called: ${e} = ${n}`);let r={rain:".rain-container",snow:".snow-container",sleet:".sleet-container",wind:".wind-container",lightning:".lightning-container",clouds:".clouds-container",fog:".fog-container",stars:".stars-container",sun:".sun-container"},i={rain:".rain-layer",snow:".snow-layer",sleet:".sleet-layer",wind:".wind-layer",lightning:".lightning",clouds:".clouds-layer",fog:".animated-weather-card",stars:".animation-layer",sun:".animated-weather-card"},t=r[e];if(t){let s=this.card.querySelector(t);s?(s.style.display=n?"block":"none",l(`Set ${e} container (${t}) display to ${n?"block":"none"}`)):l(`Container not found: ${t}`)}let a=i[e];if(a){if(a===".animated-weather-card"||a===".animation-layer")return;let s=this.card.querySelector(a);s?(s.style.opacity=n?"1":"0",l(`Set ${e} layer (${a}) opacity to ${n?"1":"0"}`)):l(`Layer not found: ${a}`)}}async applyPreset(e){if(!this.card.animationController)return;let r=this.card.animationController.getWeatherMappings()[e.toLowerCase()];if(!r){console.warn(`No animation mapping found for weather condition: ${e}`);return}l(`Applying preset: ${e} with animations: ${r.animations.join(", ")}`);let i=this.card.querySelector(".animated-weather-card");if(i){l(`Card opacity before preset: ${getComputedStyle(i).opacity}`),l(`Card display before preset: ${getComputedStyle(i).display}`);let a=S(e,this.card.config?.dev_mode??!1,this.card.config?.sunrise_hour,this.card.config?.sunset_hour,this.card.hass?.config?.time_zone),s=this.card.config?.color_palette||"default";if(i.className=`animated-weather-card ${a} ${s==="theme"?"theme-colors":""} transitions-enabled`.trim(),l(`Updated card classes to: ${i.className}`),this.card.timeOfDayManager&&(this.card.devTimeOverride||this.card.config?.enable_day_night_cycle)){let d=this.card.timeOfDayManager.getCurrentState();this.card.applySkyPhase()}}let t=["rain","snow","sleet","wind","lightning","clouds","fog","stars","sun"];for(let a of t){let s=this.card.querySelector(`#dev-${a}`);if(s&&s.checked){l(`Stopping ${a} animation`),s.checked=!1,await this.card.animationController.stopAnimation(a),this.setLayerVisibility(a,!1);let d=this.card.querySelector(`#dev-${a}-intensity`);d&&(d.disabled=!0)}}for(let a of r.animations){let s=this.card.querySelector(`#dev-${a}`),d=this.card.querySelector(`#dev-${a}-intensity`);if(s){l(`Starting ${a} animation`),s.checked=!0;let h=r.overrides?.[a]?.intensity||1;d&&(this.programmaticSliderUpdate=!0,d.value=h.toString(),d.disabled=!1,setTimeout(()=>{this.programmaticSliderUpdate=!1},0)),await this.card.animationController.startAnimation(a,{intensity:h}),this.setLayerVisibility(a,!0)}}i&&(l(`Card opacity after preset: ${getComputedStyle(i).opacity}`),l(`Card display after preset: ${getComputedStyle(i).display}`))}flyDemoPlane(){let e=Math.random();this.card.flyPlanes([{id:`demo-${Date.now()}`,label:`DEMO${Math.floor(100+Math.random()*900)}`,aircraftCode:D[Math.floor(Math.random()*D.length)],altitudeFt:Math.round(2e3+Math.random()*36e3),groundSpeedKt:Math.round(180+Math.random()*320),heading:Math.round(Math.random()*360),verticalSpeed:e<.3?1800:e>.7?-1200:0,onGround:!1}])}updateBackgroundForIndividualAnimations(){if(!this.card.animationController||!this.card.timeOfDayManager)return;let e=Object.entries(this.card.animationController.animations).filter(([r,i])=>i.isActive).map(([r,i])=>r);if(l("Active individual animations:",e),e.length===0){this.updateCardWeatherClass("sunny");return}let n=this.getDominantWeatherCondition(e);if(l("Dominant weather condition:",n),this.updateCardWeatherClass(n),this.card.timeOfDayManager&&this.card.config?.color_palette==="default"){let r=this.card.timeOfDayManager.getCurrentState();this.card.applySkyPhase()}}getDominantWeatherCondition(e){let n=["sun","stars","fog","clouds","wind","rain","snow","sleet","lightning"],r=e[0],i=-1;for(let a of e){let s=n.indexOf(a);s>i&&(i=s,r=a)}let t={sun:"sunny",stars:"clear-night",rain:"rainy",snow:"snowy",sleet:"sleety",wind:"windy",lightning:"stormy",clouds:"cloudy",fog:"foggy"};return e.includes("lightning")?e.includes("snow")?"snowy-stormy":e.includes("sleet")?"sleety-stormy":"stormy":e.includes("snow")&&e.includes("rain")?"snowy-rainy":e.includes("sun")&&e.includes("clouds")?"partly-cloudy":t[r]||"sunny"}updateCardWeatherClass(e){let n=this.card.querySelector(".animated-weather-card");if(!n)return;let r=S(e,this.card.config?.dev_mode??!1,this.card.config?.sunrise_hour,this.card.config?.sunset_hour,this.card.hass?.config?.time_zone),i=this.card.config?.color_palette||"default";n.className=`animated-weather-card ${r} ${i==="theme"?"theme-colors":""} transitions-enabled`.trim(),l(`Updated card weather class to: ${r} (full classes: ${n.className})`)}async updateDevTimeOverride(){if(!this.card.timeOfDayManager||!this.card.devTimeOverride||!this.card.animationController)return;let e=this.timePhase||"day";this.card.timeOfDayManager.setDevOverride(e);let n=this.card.timeOfDayManager.getCurrentState();if(this.card.applySkyPhase(),await this.card.animationController.stopAnimation("sun"),await this.card.animationController.stopAnimation("stars"),e==="night")await this.card.animationController.startAnimation("stars",{intensity:1}),l(`Dev time override: ${e} - Stars animation started`);else{let i=e==="dawn"?.7:e==="dusk"?.8:1;await this.card.animationController.startAnimation("sun",{intensity:i}),l(`Dev time override: ${e} - Sun animation started (intensity: ${i})`)}this.card.currentDevCondition="";let r=this.card.querySelector("#dev-weather-selector");r&&(r.value=""),this.mount(),l(`Dev time override: ${e}`)}};window.AnimatedWeatherCardDevPanel=v;})();
