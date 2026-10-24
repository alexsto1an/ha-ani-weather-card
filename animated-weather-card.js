"use strict";(()=>{var gt={entity:"weather.forecast_home",name:"Weather",outdoor_sensor_entity:"",humidity_sensor_entity:"",pressure_sensor_entity:"",show_attributes:!0,show_location:!0,animate:!0,auto_pause:!1,dev_mode:!1,disable_lightning_shake:!1,color_palette:"default",enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20},D={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},je={sunny:"26",rainy:"18",snowy:"2",stormy:"16",windy:"20",cloudy:"15",foggy:"12","partly-cloudy":"23",pouring:"14","snowy-rainy":"3","clear-night":"8",sleety:"1","snowy-stormy":"0","light-rain":"20","sleety-stormy":"-1"},Ue={sunny:"Sunny",rainy:"Rainy",snowy:"Snowy",stormy:"Thunderstorm",windy:"Windy",cloudy:"Cloudy",foggy:"Foggy","partly-cloudy":"Partly Cloudy",pouring:"Pouring Rain","snowy-rainy":"Mixed Precipitation","clear-night":"Clear Night",sleety:"Sleet","snowy-stormy":"Snowy Thunderstorm","light-rain":"Light Rain","sleety-stormy":"Sleet Storm"};var ft={DAWN_START:5,DAY_START:7,DUSK_START:19,NIGHT_START:21,UPDATE_INTERVAL:3e5},ee={humidity:"65%",windSpeed:"10 km/h",pressure:"1013 hPa",indoorTemperature:"22\xB0",indoorHumidity:"45%"},wt="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js",yt="1.0.2",bt={rain:{day:"rgba(222, 234, 255, 0.62)",night:"rgba(180, 198, 230, 0.48)",dawn:"rgba(255, 232, 226, 0.58)",dusk:"rgba(255, 220, 200, 0.55)"},snow:{day:"#FFFFFF",night:"#B8D4F0",dawn:"#E6F3FF",dusk:"#D1E7FF"},lightning:{day:"rgba(236, 242, 255, 0.6)",night:"rgba(170, 200, 255, 0.55)",dawn:"rgba(240, 246, 255, 0.58)",dusk:"rgba(214, 230, 255, 0.56)"},wind:{day:"#8FBC8F",night:"#4A5D4A",dawn:"#A8CCA8",dusk:"#6B8F6B"},clouds:{day:"#FFFFFF",night:"#737B8C",dawn:"#E8F0F8",dusk:"#B0B8C8"},fog:{day:"#E0E8F0",night:"#5A6B7D",dawn:"#D8E4F0",dusk:"#8A9BAD"},sun:{day:"#FFD700",night:"#FFD700",dawn:"#FFF4B8",dusk:"#FFE066"},stars:{day:"#FFFFFF",night:"#FFFFFF",dawn:"#F0F8FF",dusk:"#E8F0FF"}};function ui(o){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(o)}function vt(o,i=-1/0,e=1/0){return typeof o=="number"&&!isNaN(o)&&o>=i&&o<=e}function Xe(o){return typeof o!="string"?!1:/^#([0-9A-Fa-f]{3}){1,2}$/.test(o)||/^rgba?\([^)]+\)$/.test(o)?!0:["red","blue","green","yellow","orange","purple","pink","brown","black","white","gray","grey","transparent","aqua","cyan","magenta","fuchsia","lime","maroon","navy","olive","teal","silver","gold","coral","crimson","indigo","ivory","khaki","lavender","linen","orchid","peru","plum","salmon","sienna","tan","thistle","tomato","turquoise","violet","wheat","beige","azure","bisque","chocolate","cornsilk","firebrick","gainsboro","honeydew","lemonchiffon","lightblue","lightcoral","lightcyan","lightgray","lightgrey","lightgreen","lightpink","lightsalmon","lightyellow","mediumblue","mintcream","mistyrose","moccasin","oldlace","orangered","palegoldenrod","palegreen","paleturquoise","palevioletred","papayawhip","peachpuff","powderblue","rosybrown","royalblue","seagreen","seashell","skyblue","slateblue","slategray","slategrey","snow","springgreen","steelblue","yellowgreen","aliceblue","antiquewhite","aquamarine","blanchedalmond","blueviolet","burlywood","cadetblue","chartreuse","cornflowerblue","darkblue","darkcyan","darkgoldenrod","darkgray","darkgrey","darkgreen","darkkhaki","darkmagenta","darkolivegreen","darkorange","darkorchid","darkred","darksalmon","darkseagreen","darkslateblue","darkslategray","darkslategrey","darkturquoise","darkviolet","deeppink","deepskyblue","dimgray","dimgrey","dodgerblue","floralwhite","forestgreen","ghostwhite","goldenrod","greenyellow","hotpink","indianred","lawngreen","lightseagreen","lightskyblue","lightslategray","lightslategrey","lightsteelblue","limegreen","mediumaquamarine","mediumorchid","mediumpurple","mediumseagreen","mediumslateblue","mediumspringgreen","mediumturquoise","mediumvioletred","midnightblue","navajowhite","olivedrab","rebeccapurple","saddlebrown","sandybrown","whitesmoke"].includes(o.toLowerCase())}function A(o){return o==null?"":String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function xt(o){let i=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:e,label:t,value:a,placeholder:n,hint:r,type:s,min:d,max:l}=o,h=[`id="${A(e)}"`,`label="${A(t)}"`,`value="${A(a)}"`,n?`placeholder="${A(n)}"`:"",s?`type="${s}"`:"",d!==void 0?`min="${d}"`:"",l!==void 0?`max="${l}"`:"",r?i==="ha-input"?`hint="${A(r)}"`:`helper="${A(r)}" helperPersistent`:""].filter(Boolean);return`<${i} ${h.join(" ")}></${i}>`}function q(o,i,e=0){if(!isFinite(o))return"--";let t=i?.locale?.language||i?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(t,{minimumFractionDigits:e,maximumFractionDigits:e}).format(o)}catch{return o.toFixed(e)}}function ve(o,i,e){if(o?.localize)try{let t=o.localize(i);if(t&&t!==i)return t}catch{}return e}function St(o,i){if(!isFinite(o))return 0;switch((i||"km/h").toLowerCase()){case"m/s":return o*3.6;case"mph":return o*1.609344;case"ft/s":return o*1.09728;case"kn":case"kt":case"knots":return o*1.852;case"beaufort":case"bft":return .836*Math.pow(Math.max(0,o),1.5)*3.6;default:return o}}function m(o,i,...e){o&&console.log(`[AWC Dev] ${i}`,...e)}function L(o,i){let e=o.engine_settings||{},t=(r,s,d,l)=>vt(r,d,l)?r:s,a=t(e.windSpeed,D.windSpeed,.1,15),n=a;return vt(i,0,200)&&(n=Math.max(.1,Math.min(15,i/10*a))),{windSpeed:n,rainCount:t(e.rainCount,D.rainCount,.1,10),leafCount:t(e.leafCount,D.leafCount,.1,10),snowCount:t(e.snowCount,D.snowCount,.1,10),cloudBaseSize:t(e.cloudBaseSize,D.cloudBaseSize,.3,2.5),cloudCount:t(e.cloudCount,D.cloudCount,1,20),splashBounce:t(e.splashBounce,D.splashBounce,40,120)}}function Ct(o,i=1e4){return typeof o!="string"||!o.trim()?Promise.reject(new Error("Invalid CDN URL provided")):new Promise((e,t)=>{if(window.gsap){e();return}let a=!1,n=setTimeout(()=>{a||(a=!0,console.error(`GSAP CDN loading timed out after ${i}ms`),t(new Error(`GSAP failed to load within ${i}ms`)))},i),r=document.createElement("script");r.src=o,r.onload=()=>{a||(a=!0,clearTimeout(n),e())},r.onerror=()=>{a||(a=!0,clearTimeout(n),console.error("Failed to load GSAP from CDN"),t(new Error("Failed to load GSAP")))},document.head.appendChild(r)})}function Ze(o){o.forEach(i=>{i!=null&&clearTimeout(i)}),o.length=0}function At(o){window.gsap&&o.querySelectorAll("*").forEach(i=>{window.gsap.getTweensOf(i).forEach(e=>e.pause())})}function Tt(o){window.gsap&&o.querySelectorAll("*").forEach(i=>{window.gsap.getTweensOf(i).forEach(e=>e.resume())})}function Je(o){window.gsap&&o.querySelectorAll("*").forEach(i=>{window.gsap.killTweensOf(i)})}function xe(o,i,e,t,a){if(typeof o!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(i&&ui(o))return o;if(i)return console.warn(`Invalid dev mode condition: ${o}, using sunny`),"sunny";let n=o.toLowerCase();if(n.includes("sleet")&&(n.includes("lightning")||n.includes("thunder")||n.includes("storm")))return"sleety-stormy";if((n.includes("snow")||n.includes("sleet"))&&(n.includes("lightning")||n.includes("thunder")||n.includes("storm")))return"snowy-stormy";if(n.includes("lightning")||n.includes("thunder")||n.includes("storm"))return"stormy";if(n.includes("fog")||n.includes("mist"))return"foggy";if(n.includes("heavy")&&n.includes("rain"))return"pouring";if(n.includes("pouring")||n.includes("downpour"))return"pouring";if((n.includes("snow")||n.includes("sleet"))&&(n.includes("rain")||n.includes("drizzle")))return"snowy-rainy";if(n.includes("light")&&(n.includes("rain")||n.includes("drizzle")))return"light-rain";if(n.includes("rain")||n.includes("drizzle"))return"rainy";if(n.includes("sleet")||n.includes("hail"))return"sleety";if(n.includes("snow"))return"snowy";if(n.includes("wind"))return"windy";if(n.includes("partly")&&n.includes("cloud"))return"partly-cloudy";if(n.includes("cloud")||n.includes("overcast"))return"cloudy";if(n.includes("clear")||n.includes("sunny")){let r=new Date,s;if(a)try{let u=new Intl.DateTimeFormat("en-US",{timeZone:a,hour:"numeric",hour12:!1}).formatToParts(r);s=parseInt(u.find(c=>c.type==="hour")?.value||"0",10)}catch{s=r.getHours()}else s=r.getHours();let d=e??6,l=t??20;return(s<d||s>=l)&&n.includes("clear")?"clear-night":"sunny"}return"sunny"}function he(o,i,e){if(typeof o!="string"||!o.trim())return console.warn("Invalid animation type provided"),e||ce("rain");if(!i||!i.isEnabled())return e||ce(o);let t=bt[o];if(!t)return console.warn(`No color scheme found for animation type: ${o}`),e||ce(o);try{let a=i.getCurrentState(),n=i.getTimeAwareColor(t);return Xe(n)?n:(console.warn(`Invalid color returned from time manager: ${n}`),e||ce(o))}catch(a){return console.error("Error getting time-aware color:",a),e||ce(o)}}function ce(o){let e={rain:"#4A9EFF",snow:"#FFFFFF",lightning:"#FFFFFF",wind:"#8FBC8F",clouds:"#FFFFFF",fog:"#E0E8F0",sun:"#FFD700",stars:"#FFFFFF"}[o];return e||(console.warn(`Unknown animation type: ${o}, using white as fallback`),"#FFFFFF")}var Se=class Se{constructor(i,e,t){this.animationHandles=[];this.timeouts=[];this.particles=[];this.element=i,this.config=e,this.cardConfig=t,this.state="created",queueMicrotask(()=>m(this.config.devMode,`Created ${this.animationType} animation`))}async start(){if(this.state==="active"){m(this.config.devMode,`${this.animationType} animation already active`);return}try{this.setState("starting"),m(this.config.devMode,`Starting ${this.animationType} animation with intensity ${this.config.intensity}`),this.ensureLayerVisibility(!0),await this.onStart(),this.setState("active")}catch(i){throw console.error(`Failed to start ${this.animationType} animation:`,i),this.setState("stopped"),i}}async stop(){if(!(this.state==="stopped"||this.state==="destroyed"))try{this.setState("stopping"),m(this.config.devMode,`Stopping ${this.animationType} animation`),await this.onStop(),this.cleanup(),this.ensureLayerVisibility(!1),this.setState("stopped")}catch(i){throw console.error(`Failed to stop ${this.animationType} animation:`,i),i}}async pause(){if(this.state==="active")try{m(this.config.devMode,`Pausing ${this.animationType} animation`),await this.onPause(),this.setState("paused")}catch(i){throw console.error(`Failed to pause ${this.animationType} animation:`,i),i}}async resume(){if(this.state==="paused")try{m(this.config.devMode,`Resuming ${this.animationType} animation`),this.setState("active"),await this.onResume()}catch(i){throw console.error(`Failed to resume ${this.animationType} animation:`,i),this.setState("paused"),i}}setWindSpeed(i){this.realWindSpeed=i,(this.state==="active"||this.state==="paused")&&this.onWindSpeedChange()}async destroy(){this.state!=="destroyed"&&(await this.stop(),this.setState("destroyed"),m(this.config.devMode,`Destroyed ${this.animationType} animation`))}getState(){return this.state}isActive(){return this.state==="active"}isPaused(){return this.state==="paused"}onWindSpeedChange(){}setState(i){let e=this.state;this.state=i,m(this.config.devMode,`${this.animationType} state: ${e} \u2192 ${i}`)}ensureLayerVisibility(i){if(this.containerSelector){let t=this.element.querySelector(this.containerSelector);t&&(t.style.display=i?"block":"none",m(this.config.devMode,`Set ${this.animationType} container visibility: ${i}`))}let e=this.element.querySelector(this.layerSelector);e&&!Se.SHARED_LAYERS.includes(this.layerSelector)&&(e.style.opacity=i?"1":"0",m(this.config.devMode,`Set ${this.animationType} layer opacity: ${i?1:0}`))}cleanup(){this.animationHandles.forEach(i=>{i&&clearInterval(i)}),this.animationHandles=[],this.timeouts.forEach(i=>{if(i)if(typeof i=="function"){let e=i();e&&clearTimeout(e)}else clearTimeout(i)}),this.timeouts=[],window.gsap&&this.particles.forEach(i=>{window.gsap.killTweensOf(i)}),this.particles.forEach(i=>{i.parentNode&&i.parentNode.removeChild(i)}),this.particles=[],m(this.config.devMode,`Cleaned up ${this.animationType} animation resources`)}addAnimationHandle(i){this.animationHandles.push(i)}addTimeout(i){this.timeouts.push(i)}addParticle(i){this.particles.push(i)}removeParticle(i){let e=this.particles.indexOf(i);e>-1&&this.particles.splice(e,1)}};Se.SHARED_LAYERS=[".animated-weather-card",".animation-layer"];var M=Se;var V=class{constructor(i,e,t){this.layer=i;this.create=e;this.cycle=t;this.items=[];this.running=!1;this.paused=!1}start(i){this.running=!0;let e=[];for(let t=0;t<i;t++){let a=this.create(t);this.layer.appendChild(a);let n={el:a};this.items.push(n),e.push(a),this.run(n,!0)}return e}run(i,e){this.running&&(i.anim=this.cycle(i.el,()=>this.run(i,!1),e),this.paused&&i.anim.pause())}pause(){this.paused=!0,this.items.forEach(i=>i.anim?.pause())}resume(){this.paused=!1,this.items.forEach(i=>i.anim?.resume())}stop(){this.running=!1,this.items.forEach(i=>{i.anim?.kill(),window.gsap?.killTweensOf(i.el),i.el.remove()}),this.items=[]}get size(){return this.items.length}get elements(){return this.items.map(i=>i.el)}};function te(o,i){return i&&o.progress(Math.random()),o}var mi=420*230;function ie(o,i){return Math.min(3,Math.max(.6,o*i/mi))||1}function T(o,i){return o+Math.random()*(i-o)}var pi={light:10,rain:18,storm:24,pouring:32},gi={light:[300,380],rain:[420,520],storm:[520,620],pouring:[620,760]},fi={light:16,rain:24,storm:34,pouring:42},wi=.3,yi=16,bi=8,vi=[10,30],kt="http://www.w3.org/2000/svg";function xi(o,i,e,t){let a=0,n=0,r=0;for(let s=1;s<=16;s++){let d=s/16,l=2*(1-d)*d*o+d*d*e,h=2*(1-d)*d*i+d*d*t;a+=Math.hypot(l-n,h-r),n=l,r=h}return a}function Si(o,i,e,t){return Math.max(4,Math.round(pi[o]*i*ie(e,t)))}var Ce=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="rain";this.layerSelector=".rain-layer";this.containerSelector=".rain-container";this.splashColor="white";this.splashBounce=1;this.splashDots=[];this.nextSplashDot=0;this.rebounds=[];this.nextRebound=0;this.realWindSpeed=n,this.rainConfig={isStorm:!1,isPouring:!1,isLightRain:!1,particleCount:50,splashEnabled:!0,...t},m(this.config.devMode,"RainAnimation created with config:",this.rainConfig)}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start rain animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Rain layer not found: ${this.layerSelector}`);let t=L(this.cardConfig,this.realWindSpeed),a=this.element.querySelector(".animated-weather-card"),n=this.rainKind(),r=Si(n,t.rainCount,a.offsetWidth,a.offsetHeight),s=this.getRainColor(this.element.timeOfDayManager),d=this.cardConfig.spill_particles!==!1,l=fi[n],h=n==="pouring"?3:2.4;this.splashLayer=e,this.splashColor=s,this.splashBounce=t.splashBounce/D.splashBounce,this.pool=new V(e,()=>{let u=T(1,h),c=document.createElement("div");return c.className="raindrop",c.style.cssText=`
                    width: ${u.toFixed(2)}px;
                    height: ${l}px;
                    background: linear-gradient(0deg, ${s}, transparent);
                    border-radius: ${u.toFixed(2)}px;
                    top: 0;
                    left: 0;
                    transform-origin: 50% 100%;
                `,c.dataset.width=u.toFixed(2),c},(u,c,p)=>this.fall(u,a,n,l,d,c,p)),this.pool.start(r).forEach(u=>this.addParticle(u)),m(this.config.devMode,`Rain animation started - ${r} drops (${n})`)}fall(e,t,a,n,r,s,d){let l=t.offsetWidth,h=t.offsetHeight,[u,c]=gi[a],p=T(u,c),f=T(6,Math.max(7,l-6)),w=this.rainConfig.splashEnabled&&Math.random()<wi,g=-n,v=w?h-n:r?h+T(60,120):h,S=Math.max(.25,(v-g)/p),x=parseFloat(e.dataset.width||"2");window.gsap.set(e,{x:f,scaleY:1,opacity:.55+.45*Math.min(1,x/2.4)});let b=window.gsap.timeline({onComplete:s});if(b.fromTo(e,{y:g},{y:v,duration:S,ease:"none"}),w)b.call(()=>this.createSplash(f+x/2,h),[],S),b.to(e,{scaleY:0,duration:n/p,ease:"none"},S);else if(r){let C=(h-n-g)/p;b.to(e,{opacity:0,duration:S-C,ease:"power1.in"},C)}return te(b,d)}async onStop(){this.pool?.stop(),this.pool=void 0,this.splashDots.forEach(e=>{window.gsap?.killTweensOf(e),e.remove()}),this.splashDots=[],this.rebounds.forEach(e=>{window.gsap?.killTweensOf([e,e.firstChild]),e.remove()}),this.rebounds=[],this.element.querySelectorAll(`${this.layerSelector} .raindrop, ${this.layerSelector} .rain-splash-svg`).forEach(e=>e.remove()),m(this.config.devMode,"Rain animation stopped")}async onPause(){this.pool?.pause(),m(this.config.devMode,"Rain animation paused")}async onResume(){this.pool?.resume(),m(this.config.devMode,"Rain animation resumed")}rainKind(){return this.rainConfig.isPouring?"pouring":this.rainConfig.isStorm?"storm":this.rainConfig.isLightRain?"light":"rain"}createSplash(e,t){if(!(!window.gsap||!this.splashLayer)){this.createRebound(e,t);for(let a of[-1,1]){let n=this.splashDots[this.nextSplashDot];n||(n=document.createElement("div"),n.className="rain-splash",n.style.background=this.splashColor,this.splashLayer.appendChild(n),this.splashDots[this.nextSplashDot]=n),this.nextSplashDot=(this.nextSplashDot+1)%yi;let r=T(.22,.28),s=T(4,10)*this.splashBounce,d=a*T(6,12)*this.splashBounce;window.gsap.killTweensOf(n),window.gsap.set(n,{x:e-1,y:t-2,opacity:.9}),window.gsap.timeline().to(n,{x:e-1+d,duration:r,ease:"power1.out"},0).to(n,{y:t-2-s,duration:r*.45,ease:"power2.out"},0).to(n,{y:t-2,duration:r*.55,ease:"power2.in"},r*.45).to(n,{opacity:0,duration:r*.4,ease:"power1.in"},r*.6)}}}createRebound(e,t){let a=this.splashLayer,n=this.rebounds[this.nextRebound];if(!n){n=document.createElementNS(kt,"svg"),n.classList.add("rain-rebound");let w=document.createElementNS(kt,"path");w.setAttribute("fill","none"),w.style.stroke=this.splashColor,n.appendChild(w),a.appendChild(n),this.rebounds[this.nextRebound]=n}this.nextRebound=(this.nextRebound+1)%bi;let r=n.firstChild,[s,d]=vi,l=T(s,d)*this.splashBounce,h=(Math.random()<.5?-1:1)*T(10,24)*this.splashBounce,u=T(6,18);r.setAttribute("d",`M 0,0 Q ${h.toFixed(1)},${(-2*l).toFixed(1)} ${(2*h).toFixed(1)},${u.toFixed(1)}`);let c=xi(h,-2*l,2*h,u),p=Math.min(c*.45,6+l*.3);r.style.strokeDasharray=`${p.toFixed(1)} ${(c+p).toFixed(1)}`;let f=T(.42,.56);window.gsap.killTweensOf([n,r]),window.gsap.set(n,{x:e,y:t,opacity:.85}),window.gsap.timeline().fromTo(r,{strokeDashoffset:p,strokeWidth:1.6},{strokeDashoffset:-c,strokeWidth:.6,duration:f,ease:"power2.out"},0).to(n,{opacity:0,duration:f*.35,ease:"power1.in"},f*.65)}getRainColor(e){return this.rainConfig.isStorm?he("lightning",e,"var(--weather-storm-rain-color)"):he("rain",e,"var(--weather-rain-color)")}};var Ci=36,Y=[2,6],Qe=[20,38],_t=10,Ai=.6;function Ti(o,i,e){return Math.max(6,Math.round(Ci*o*ie(i,e)))}function tt(o){return Math.min(2.2,Math.max(.3,o/D.windSpeed))}var Ae=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="snow";this.layerSelector=".snow-layer";this.containerSelector=".snow-container";this.swings=[];this.realWindSpeed=n,this.snowConfig={accumulation:!0,accumulationHeight:12,swayAmplitude:15,fallSpeed:3,particleCount:40,...t},m(this.config.devMode,"SnowAnimation created with config:",this.snowConfig)}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start snow animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Snow layer not found: ${this.layerSelector}`);let t=L(this.cardConfig,this.realWindSpeed),a=this.element.querySelector(".animated-weather-card"),n=Ti(t.snowCount,a.offsetWidth,a.offsetHeight),r="#ffffff",s=this.cardConfig.spill_particles!==!1,d=tt(t.windSpeed);this.snowConfig.accumulation&&this.createSnowAccumulation(),this.pool=new V(e,()=>this.createFlake(r),(l,h,u)=>this.fall(l,a,d,s,h,u)),this.pool.start(n).forEach(l=>this.addParticle(l)),m(this.config.devMode,`Snow animation started - ${n} flakes`)}createFlake(e){let t=T(Y[0],Y[1]),a=(t-Y[0])/(Y[1]-Y[0]),n=document.createElement("div");n.className="snowflake",n.dataset.size=t.toFixed(2),n.style.cssText=`
            width: ${t.toFixed(2)}px;
            height: ${t.toFixed(2)}px;
            background: radial-gradient(circle closest-side, var(--weather-snow-color, ${e}) 45%, transparent 100%);
            top: 0;
            left: 0;
        `,n.dataset.opacity=(.45+.45*a).toFixed(2),window.gsap.set(n,{transformOrigin:"50% -500%",rotation:-_t});let r=window.gsap.to(n,{rotation:_t,duration:T(1.4,2.2),ease:"sine.inOut",yoyo:!0,repeat:-1});return r.progress(Math.random()),this.swings.push(r),n}fall(e,t,a,n,r,s){let d=t.offsetWidth,l=t.offsetHeight,h=parseFloat(e.dataset.size||"4"),u=(h-Y[0])/(Y[1]-Y[0]),c=(Qe[0]+(Qe[1]-Qe[0])*u)*T(.9,1.1),p=this.snowConfig.accumulation&&Math.random()<Ai,f=-h*2,w=p?l-this.pileHeight()-h:n?l+T(60,120):l+h,g=w-f,v=Math.max(.5,g/c),S=g*T(.04,.13)*a,x=T(-S,Math.max(1,d-h));window.gsap.set(e,{x,opacity:parseFloat(e.dataset.opacity||"0.7")});let b=window.gsap.timeline({onComplete:r});if(b.fromTo(e,{y:f},{y:w,x:x+S,duration:v,ease:"none"}),p)b.call(()=>this.addToAccumulation(),[],v),b.to(e,{opacity:0,duration:.6,ease:"power1.out"},v);else if(n){let C=Math.min(v,(l-f)/c);b.to(e,{opacity:0,duration:Math.max(.1,v-C),ease:"power1.in"},C)}return te(b,s)}async onStop(){this.swings.forEach(e=>e.kill()),this.swings=[],this.pool?.stop(),this.pool=void 0,this.accumulationElement&&this.accumulationElement.parentNode&&(window.gsap?.killTweensOf(this.accumulationElement),this.accumulationElement.parentNode.removeChild(this.accumulationElement),this.accumulationElement=void 0),m(this.config.devMode,"Snow animation stopped")}async onPause(){this.pool?.pause(),this.swings.forEach(e=>e.pause()),m(this.config.devMode,"Snow animation paused")}async onResume(){this.pool?.resume(),this.swings.forEach(e=>e.resume()),m(this.config.devMode,"Snow animation resumed")}pileHeight(){return parseFloat(this.accumulationElement?.getAttribute("data-target-height")||"0")}createSnowAccumulation(){let e=this.element.querySelector(".animated-weather-card");if(!e)return;e.querySelectorAll('.snow-accumulation[data-modular="true"]').forEach(a=>a.remove());let t=Math.max(0,this.snowConfig.accumulationHeight);this.accumulationElement=document.createElement("div"),this.accumulationElement.className="snow-accumulation",this.accumulationElement.setAttribute("data-modular","true"),this.accumulationElement.style.cssText=`
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: ${t}px;
            background: linear-gradient(to top, #ffffff, transparent);
            transform-origin: 50% 100%;
            transform: scaleY(0);
            pointer-events: none;
            z-index: 5;
        `,e.appendChild(this.accumulationElement)}addToAccumulation(){if(this.state!=="active")return;let e=this.accumulationElement,t=this.snowConfig.accumulationHeight;if(!e?.parentNode||t<=0)return;let a=this.pileHeight();if(a>=t)return;let n=Math.min(t,a+.8);e.setAttribute("data-target-height",String(n)),window.gsap.to(e,{scaleY:n/t,opacity:Math.min(.9,n/t),duration:.3,ease:"power2.out"})}};var ki=30,Et=[150,230],_i=.3,Te=6,ke=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="sleet";this.layerSelector=".sleet-layer";this.containerSelector=".sleet-container";this.realWindSpeed=n,this.sleetConfig={particleCount:40,...t},m(this.config.devMode,"SleetAnimation created")}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start sleet animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Sleet layer not found: ${this.layerSelector}`);let t=L(this.cardConfig,this.realWindSpeed),a=this.element.querySelector(".animated-weather-card"),n=Math.max(6,Math.round(ki*t.snowCount*ie(a.offsetWidth,a.offsetHeight))),r=this.cardConfig.spill_particles!==!1,s=tt(t.windSpeed)*.5;this.pool=new V(e,()=>{let d=T(1.5,3.5),l=document.createElement("div");return l.className="sleet-particle-gsap",l.dataset.size=d.toFixed(2),l.style.cssText=`
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: ${d.toFixed(2)}px;
                    height: ${d.toFixed(2)}px;
                    background: #e8f4fd;
                    border-radius: 20%;
                    box-shadow: 0 0 2px rgba(200, 220, 255, 0.9);
                    pointer-events: none;
                `,l},(d,l,h)=>this.fall(d,a,s,r,l,h)),this.pool.start(n).forEach(d=>this.addParticle(d)),m(this.config.devMode,`Sleet animation started - ${n} pellets`)}fall(e,t,a,n,r,s){let d=t.offsetWidth,l=t.offsetHeight,h=parseFloat(e.dataset.size||"2"),u=T(Et[0],Et[1]),c=Math.random()<_i,p=-h*2,f=c?l-h:n?l+T(60,120):l+h,w=f-p,g=Math.max(.3,w/u),v=w*T(.03,.08)*a,S=T(-v,Math.max(1,d-h));window.gsap.set(e,{x:S,opacity:T(.8,1),rotation:T(0,360)});let x=window.gsap.timeline({onComplete:r});if(x.fromTo(e,{y:p},{y:f,x:S+v,duration:g,ease:"none"}),c)x.call(()=>this.addToPile(t),[],g),x.to(e,{opacity:0,duration:.3,ease:"power1.out"},g);else if(n){let b=Math.min(g,(l-p)/u);x.to(e,{opacity:0,duration:Math.max(.1,g-b),ease:"power1.in"},b)}return te(x,s)}addToPile(e){if(this.state!=="active")return;let t=e.querySelector(".sleet-accumulation");t||(t=document.createElement("div"),t.className="sleet-accumulation",t.style.cssText=`
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: ${Te}px;
                background: linear-gradient(to top, #e8f4fd 0%, rgba(232,244,253,0.8) 60%, rgba(232,244,253,0.2) 100%);
                border-radius: 0 0 16px 16px;
                transform-origin: 50% 100%;
                transform: scaleY(0);
                z-index: 5;
                pointer-events: none;
            `,e.appendChild(t));let a=parseFloat(t.getAttribute("data-target-height")||"0");if(a>=Te)return;let n=Math.min(Te,a+.4);t.setAttribute("data-target-height",String(n)),window.gsap.to(t,{scaleY:n/Te,duration:.3,ease:"power2.out"})}async onStop(){this.pool?.stop(),this.pool=void 0;let e=this.element.querySelector(".animated-weather-card");e&&e.querySelectorAll(".sleet-accumulation").forEach(t=>{window.gsap&&window.gsap.killTweensOf(t),t.remove()}),m(this.config.devMode,"Sleet animation stopped")}async onPause(){this.pool?.pause(),m(this.config.devMode,"Sleet animation paused")}async onResume(){this.pool?.resume(),m(this.config.devMode,"Sleet animation resumed")}};var it=[90,160];function Mt(o,i,e,t,a,n=!0){let r=document.createElement("div");r.className="leaf-gsap";let s=t.offsetWidth,d=t.offsetHeight,l=20+Math.random()*Math.max(40,d-40),h=Math.random(),u=h<.25,c=h>.8&&l>100;r.style.position="absolute",r.style.borderRadius="0 100% 0 100%",r.style.transformOrigin="center",r.style.boxShadow="0 1px 3px rgba(0,0,0,0.3)";let p=(Math.random()*8+6)*e;r.style.width=r.style.height=p+"px";let f=["#27ae60","#2ecc71","#16a085","#f39c12","#e67e22","#e74c3c"];r.style.background=f[Math.floor(Math.random()*f.length)];let w=-p-10,g=s+(n?60+Math.random()*80:p+10),v=(it[0]+Math.random()*(it[1]-it[0]))*ne(i.windSpeed)*(u?.6:1),S=(g-w)/v,x=Math.min(S,(s-w)/v),b=c?-(60+Math.random()*80):u?80+Math.random()*80:(Math.random()-.5)*80;window.gsap.set(r,{x:w,y:l,rotation:Math.random()*360,opacity:0}),o.appendChild(r);let C=window.gsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),a&&a(r)}});return C.to(r,{opacity:.85,duration:.25,ease:"power1.out"},0).to(r,{x:g,duration:S,ease:"none"},0).to(r,{y:l+b,duration:S,ease:u?"sine.in":"sine.inOut"},0).to(r,{rotation:`+=${120+Math.random()*180}`,duration:S,ease:"none"},0),n&&S>x&&C.to(r,{opacity:0,duration:S-x,ease:"power1.in"},x),r}function Pt(o,i,e,t,a,n){let r=document.createElement("div");r.className="wind-swoosh-gsap";let s=Math.random(),d=s>.6,l=s>.8;r.style.position="absolute",r.style.height=(l?2:1)*e+"px",r.style.borderRadius=d?"2px 1px":"1px",r.style.transformOrigin="left center",r.style.zIndex="10";let h=a.color_palette==="theme"?"var(--secondary-text-color)":"rgb(255, 255, 255)";r.style.background=`linear-gradient(90deg, transparent 0%, ${h} 50%, transparent 100%)`;let u=Math.max(15,(20+Math.random()*60)*e);r.style.width=u+"px";let c=t.offsetWidth,p=t.offsetHeight,f=p*.15+Math.random()*(p*.7);window.gsap.set(r,{x:-u,y:f,rotation:d?-5+Math.random()*10:0,scaleX:.1,scaleY:1,opacity:0}),o.appendChild(r);let g=(c+u*2)/(Ei*ne(i.windSpeed));return window.gsap.timeline({onComplete:()=>{r.parentNode&&r.parentNode.removeChild(r),n&&n(r)}}).to(r,{scaleX:1,opacity:l?.35:.22,duration:.3,ease:"power2.out"},0).to(r,{x:c+u,rotation:d?f>p/2?5:-5:0,duration:g,ease:"none"},0).to(r,{opacity:0,scaleX:.3,duration:Math.min(.5,g*.3)},g-Math.min(.5,g*.3)),r}var Ei=230,Mi=[{name:"background",speed:6,opacity:.26,scale:.7,blur:2.5},{name:"middle",speed:12,opacity:.5,scale:.9,blur:1.5},{name:"foreground",speed:22,opacity:.66,scale:1.2,blur:.75}];function ne(o){return Math.min(2.2,Math.max(.6,Math.sqrt(o/D.windSpeed)))}var Pi=12;function ue(o){o.querySelectorAll(".cloud-track, .cloud-gsap").forEach(i=>{window.gsap?.killTweensOf(i),i.remove()})}function Li(o){return Math.min(1,Math.max(.5,o/160))||1}function Lt(o,i,e,t,a){let n=t.offsetWidth,r=t.offsetHeight,s=Mi,d=ne(i.windSpeed),l=[],h=e||i.cloudCount,u=Li(r);return s.forEach((c,p)=>{let f=Math.ceil(p===0||p===1?h*.4:h*.6);for(let w=1;w<=f;w++){let g=document.createElement("div");g.className=`cloud-gsap cloud-gsap-${c.name}-${w}`;let v=i.cloudBaseSize*c.scale,S=1+(w-1)*.15,x=Math.max(.3,Math.min(2.5,v))*S*u,b=70,C=26,_=44,E=44,y=35,k=35,P=Math.round(b*x),U=Math.round(C*x);g.style.position="absolute",g.style.width=P+"px",g.style.height=U+"px",g.style.borderRadius="50px",g.style.opacity=c.opacity.toString(),g.style.zIndex=(10+p).toString(),c.blur>0&&(g.style.filter=`blur(${c.blur}px)`);let R=["var(--awc-cloud-far)","var(--awc-cloud-mid)","var(--awc-cloud-near)"][p];g.style.background=R;let $=document.createElement("div");$.style.position="absolute",$.style.width=Math.round(_*x)+"px",$.style.height=Math.round(E*x)+"px",$.style.top=Math.round(-22*x)+"px",$.style.left=Math.round(9*x)+"px",$.style.borderRadius="50px",$.style.background=R,g.appendChild($);let H=document.createElement("div");H.style.position="absolute",H.style.width=Math.round(y*x)+"px",H.style.height=Math.round(k*x)+"px",H.style.top=Math.round(-13*x)+"px",H.style.right=Math.round(9*x)+"px",H.style.borderRadius="50px",H.style.background=R,g.appendChild(H);let O=[[10,25,40,15,30],[20,45,60,35,50],[5,35,55,25,45]][p][w-1]||15+p*10,G=Math.max(150+p*50,P+Pi),de=c.speed*d*(.9+Math.random()*.2),Ye=(n+2*G)/de,B=document.createElement("div");B.className="cloud-track",B.appendChild(g),window.gsap.set(g,{opacity:c.opacity}),window.gsap.set(B,{xPercent:0,x:-G,y:r*O/100}),o.appendChild(B);let Q=window.gsap.timeline({repeat:-1,repeatDelay:Math.random()*1.5});Q.fromTo(B,{xPercent:0,x:-G},{xPercent:100,x:G,duration:Ye,ease:"none"}),Q.progress(Math.random()),l.push(Q)}}),l}function $t(o){let i=o.querySelector(".snow-accumulation");i&&(window.gsap?window.gsap.to(i,{height:"0px",duration:2,ease:"power2.out",onComplete:()=>{i.parentNode&&i.parentNode.removeChild(i)}}):i.parentNode?.removeChild(i))}function Ht(o,i,e,t,a){let n=document.createElement("div");n.className=`fog-layer fog-layer-${e}`;let r=t.offsetWidth,s=t.offsetHeight,d=[{opacity:.1,scale:1.8,blur:8,speed:.3,height:80},{opacity:.15,scale:1.4,blur:4,speed:.5,height:60},{opacity:.12,scale:1,blur:2,speed:.8,height:40}],l=d[e]||d[2],h=a.color_palette==="default"?a.custom_colors?.fog_color||"#e0e0e0":"var(--secondary-text-color)",u=3+Math.floor(Math.random()*3),c=r*l.scale;n.style.cssText=`
        position: absolute;
        top: ${20+e*15}%;
        left: -50%;
        width: ${c}px;
        height: ${l.height}px;
        opacity: ${l.opacity};
        filter: blur(${l.blur}px);
        pointer-events: none;
        z-index: ${5+e};
        overflow: visible;
    `;for(let C=0;C<u;C++){let _=document.createElement("div"),E=c/u*(2+Math.random()*1.2),y=l.height*(1.2+Math.random()*1.6),k=c/u*C-E*.3,P=(Math.random()-.5)*(l.height*.5);_.style.cssText=`
            position: absolute;
            left: ${k}px;
            top: ${P}px;
            width: ${E}px;
            height: ${y}px;
            background: radial-gradient(ellipse ${E/2}px ${y/2}px at center, 
                ${h} 0%, 
                ${h} 40%, 
                transparent 70%);
            border-radius: ${E/2}px ${y/2}px;
            opacity: ${.7+Math.random()*.6}; // Varied opacity per segment
        `,n.appendChild(_)}o.appendChild(n);let p=i.windSpeed*(.5+Math.random()*.5),f=15/l.speed,w=Math.max(8,f/p),g=r*l.scale,v=-g,S=r+g;window.gsap.set(n,{x:v,opacity:l.opacity});let x=window.gsap.timeline({repeat:-1,delay:e*2+Math.random()*3});x.to(n,{x:S,duration:w,ease:"none",onComplete:()=>{window.gsap.set(n,{x:v})}});let b=window.gsap.timeline({repeat:-1,yoyo:!0});return b.to(n,{opacity:l.opacity*.6,duration:3+Math.random()*4,ease:"sine.inOut"}),{movement:x,opacity:b}}function _e(o){o.querySelectorAll(".fog-layer").forEach(e=>{e.parentNode&&e.parentNode.removeChild(e)})}var $i=3,Hi=2,Dt=[900,1400],Ft=[1800,2600],Ee=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="wind";this.layerSelector=".wind-layer";this.containerSelector=".wind-container";this.leaves=new Set;this.swooshes=new Set;this.realWindSpeed=n,this.windConfig={leafCount:3,swooshEnabled:!0,...t},m(this.config.devMode,"WindAnimation created with config:",this.windConfig)}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start wind animation");if(!this.element.querySelector(this.layerSelector))throw new Error(`Wind layer not found: ${this.layerSelector}`);this.scheduleLeaf(T(150,500)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(T(300,900)),m(this.config.devMode,"Wind animation started successfully")}scheduleLeaf(e){let t=L(this.cardConfig,this.realWindSpeed);this.leafTimer=setTimeout(()=>{if(this.state!=="active")return;let a=Math.max(1,Math.round($i*t.leafCount));if(this.leaves.size<a){let n=Mt(this.layer(),t,1,this.card(),r=>this.forget(r,this.leaves),this.cardConfig.spill_particles!==!1);this.leaves.add(n),this.addParticle(n)}this.scheduleLeaf(T(Dt[0],Dt[1])/Math.max(.5,t.leafCount))},e)}scheduleSwoosh(e){let t=L(this.cardConfig,this.realWindSpeed);this.swooshTimer=setTimeout(()=>{if(this.state==="active"){if(this.swooshes.size<Hi){let a=Pt(this.layer(),t,1,this.card(),this.cardConfig,n=>this.forget(n,this.swooshes));this.swooshes.add(a),this.addParticle(a)}this.scheduleSwoosh(T(Ft[0],Ft[1]))}},e)}forget(e,t){t.delete(e),this.removeParticle(e)}layer(){return this.element.querySelector(this.layerSelector)}card(){return this.element.querySelector(".animated-weather-card")}clearTimers(){this.leafTimer&&clearTimeout(this.leafTimer),this.swooshTimer&&clearTimeout(this.swooshTimer),this.leafTimer=void 0,this.swooshTimer=void 0}async onStop(){this.clearTimers(),this.element.querySelector(this.layerSelector)?.querySelectorAll(".leaf-gsap, .wind-swoosh-gsap").forEach(t=>{window.gsap&&window.gsap.killTweensOf(t),t.remove()}),this.leaves.clear(),this.swooshes.clear(),m(this.config.devMode,"Wind animation stopped")}async onPause(){this.clearTimers(),this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(e=>{window.gsap?.getTweensOf(e).forEach(t=>t.pause())}),m(this.config.devMode,"Wind animation paused")}async onResume(){this.element.querySelectorAll(`${this.layerSelector} .leaf-gsap, ${this.layerSelector} .wind-swoosh-gsap`).forEach(e=>{window.gsap?.getTweensOf(e).forEach(t=>t.resume())}),this.clearTimers(),this.scheduleLeaf(T(300,900)),this.windConfig.swooshEnabled&&this.scheduleSwoosh(T(600,1500)),m(this.config.devMode,"Wind animation resumed")}};var me=[6e3,18e3],Di=[1500,6e3],Ot=.16,Me=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="lightning";this.layerSelector=".lightning";this.containerSelector=".lightning-container";this.realWindSpeed=n,this.lightningConfig={disableShake:a.disable_lightning_shake||!1,minInterval:me[0],maxInterval:me[1],...t},m(this.config.devMode,"LightningAnimation created")}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start lightning animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Lightning layer not found: ${this.layerSelector}`);e.style.opacity="0";let[t,a]=Di;this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},t+Math.random()*(a-t)),this.addTimeout(this.flashTimeout),m(this.config.devMode,"Lightning animation started")}flash(){if(!window.gsap||this.state!=="active")return;let e=this.element.querySelector(this.layerSelector),t=this.element.querySelector(".animated-weather-card");if(!e||!t)return;let a=t.offsetWidth,n=t.offsetHeight,r=parseFloat(t.style.getPropertyValue("--scale-factor"))||1,s=document.createElementNS("http://www.w3.org/2000/svg","svg");s.style.cssText="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:50;";let d=document.createElementNS("http://www.w3.org/2000/svg","path"),l=30+Math.random()*(a-60),h=20*r,u=20,c=[l+",0"];for(let g=0;g<u;g++){let v=l+(Math.random()*h-h/2),S=n/u*(g+1);c.push(v+","+S)}d.setAttribute("d","M"+c.join(" L"));let p=this.element.timeOfDayManager,f=he("lightning",p,"white");d.setAttribute("stroke",f),d.setAttribute("stroke-width",((2+Math.random()*2)*r).toString()),d.setAttribute("fill","none"),s.appendChild(d),e.appendChild(s);let w=window.gsap.timeline({onComplete:()=>{s.parentNode&&s.parentNode.removeChild(s)}});if(this.flashTimeline=w,w.set(e,{opacity:.9},0).to(e,{opacity:.3,duration:.06,ease:"none"},0).to(e,{opacity:.8,duration:.04,ease:"none"},.06).to(e,{opacity:0,duration:.38,ease:"expo.out"},.1),!this.lightningConfig.disableShake){let g=-6*r;w.to(t,{y:g,duration:.06,ease:"power2.out"},Ot).to(t,{y:0,duration:.42,ease:"power3.out",clearProps:"transform"},Ot+.06)}}scheduleNext(){if(this.state!=="active")return;let e=this.lightningConfig.minInterval+Math.random()*(this.lightningConfig.maxInterval-this.lightningConfig.minInterval);this.flashTimeout=setTimeout(()=>{this.state==="active"&&(this.flash(),this.scheduleNext())},e),this.addTimeout(this.flashTimeout)}async onStop(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),this.flashTimeline?.kill(),this.flashTimeline=void 0;let e=this.element.querySelector(".animated-weather-card");e&&window.gsap&&window.gsap.set(e,{clearProps:"transform"});let t=this.element.querySelector(this.layerSelector);t&&(t.querySelectorAll("svg").forEach(n=>{window.gsap&&window.gsap.killTweensOf(n.querySelector("path")),n.parentNode&&n.parentNode.removeChild(n)}),t.style.opacity="0"),m(this.config.devMode,"Lightning animation stopped")}async onPause(){this.flashTimeout&&(clearTimeout(this.flashTimeout),this.flashTimeout=void 0),m(this.config.devMode,"Lightning animation paused")}async onResume(){this.scheduleNext(),m(this.config.devMode,"Lightning animation resumed")}};var Fi=["dawn","day","dusk","night"],ot=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],Oi={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},It=(o,i,e)=>Math.min(i,Math.max(o,e)),K=(o,i,e)=>o+(i-o)*e;function Ni(o,i,e){let t=(i-o+540)%360-180;return(o+t*e+360)%360}function I(o,i,e){let t=([w,g,v])=>[w,g*Math.cos(v*Math.PI/180),g*Math.sin(v*Math.PI/180)],[a,n,r]=t(o),[s,d,l]=t(i),h=K(a,s,e),u=K(n,d,e),c=K(r,l,e),p=Math.hypot(u,c),f=p<1e-6?o[2]:(Math.atan2(c,u)*180/Math.PI+360)%360;return[h,p,f]}function nt([o,i,e]){let t=e*Math.PI/180,a=i*Math.cos(t),n=i*Math.sin(t),r=(o+.3963377774*a+.2158037573*n)**3,s=(o-.1055613458*a-.0638541728*n)**3,d=(o-.0894841775*a-1.291485548*n)**3;return[4.0767416621*r-3.3077115913*s+.2309699292*d,-1.2684380046*r+2.6097574011*s-.3413193965*d,-.0041960863*r-.7034186147*s+1.707614701*d]}var Wi=o=>o<=.0031308?12.92*o:1.055*Math.pow(o,1/2.4)-.055;function N(o){let i=t=>t.every(a=>a>=-1e-4&&a<=1.0001),e=nt(o);if(!i(e)){let t=0,a=o[1];for(let n=0;n<24;n++){let r=(t+a)/2;i(nt([o[0],r,o[2]]))?t=r:a=r}e=nt([o[0],t,o[2]])}return e.map(t=>Wi(It(0,1,t)))}var zt=o=>Math.round(It(0,1,o)*255);function z(o){return"#"+o.map(i=>zt(i).toString(16).padStart(2,"0")).join("")}function Nt(o,i){return`rgba(${o.map(zt).join(", ")}, ${Number(i.toFixed(3))})`}function at(o,i){return[.15+(o[0]-.15)*.42,o[1]*K(.75,.5,i),Ni(o[2],262,.45)]}function Ii(o,i){let e=Oi[o],t=1-e.overcast*.7,a={top:e.top,mid:e.mid,bottom:e.bottom,glow:e.glow,glowAlpha:e.glowAlpha,scrimAlpha:K(.46,.28,e.overcast)};if(o==="clear-night"){if(i==="dawn"||i==="dusk"){let n=i==="dawn"?[.4,.09,20]:[.38,.1,40];return{...a,bottom:I(e.bottom,n,.45),glowAlpha:.2,scrimAlpha:.22}}return{...a,scrimAlpha:.2}}switch(i){case"night":return{top:at(e.top,e.overcast),mid:at(e.mid,e.overcast),bottom:at(e.bottom,e.overcast),glow:[.86,.03,250],glowAlpha:K(.14,.06,e.overcast),scrimAlpha:.2};case"dusk":return{top:I(e.top,[e.top[0]*.8,.075,292],.5*t),mid:I(e.mid,[e.mid[0]*.88,.065,350],.42*t),bottom:I(e.bottom,[e.bottom[0]*.92,.115,52],.72*t),glow:I(e.glow,[.82,.13,58],t),glowAlpha:K(e.glowAlpha,.6,t*.6),scrimAlpha:a.scrimAlpha+.04};case"dawn":return{top:I(e.top,[e.top[0]*.95,e.top[1]*.85,262],.4*t),mid:I(e.mid,[e.mid[0]*.95,.05,330],.3*t),bottom:I(e.bottom,[e.bottom[0]*.95,.085,32],.62*t),glow:I(e.glow,[.88,.09,40],t),glowAlpha:K(e.glowAlpha,.5,t*.5),scrimAlpha:a.scrimAlpha+.04};default:return a}}function zi(o){return[.16,Math.min(.04,o[1]*.6),o[2]]}function pe(o,i){let e=Ii(o,i);return{top:z(N(e.top)),mid:z(N(e.mid)),bottom:z(N(e.bottom)),glow:Nt(N(e.glow),e.glowAlpha),scrim:Nt(N(zi(e.top)),e.scrimAlpha)}}var ae=[.985,.006,250],Pe=.8,Rt=.55,Gt=.4,Le={rx:.52,ry:.76,cx:.86,cy:.14,fade:.64},Bt={rx:.4,ry:.64,cx:.86,cy:.1,fade:.64},qt={rx:.24,ry:.95,cx:.86,cy:.5,fade:.64};function oe(o,i){let e=t=>`${Math.round(t*100)}%`;return`radial-gradient(${e(o.rx)} ${e(o.ry)} at ${e(o.cx)} ${e(o.cy)}, ${i}, transparent ${e(o.fade)})`}function Vt(){let o=[];for(let i of ot)for(let e of Fi){let t=pe(i,e),a=e==="day"?`.animated-weather-card.${i}`:`.animated-weather-card.${i}[data-phase="${e}"]`;o.push(`${a} { --awc-sky-top: ${t.top}; --awc-sky-mid: ${t.mid}; --awc-sky-bottom: ${t.bottom}; --awc-sky-glow: ${t.glow}; --awc-sky-scrim: ${t.scrim}; }`)}return o.join(`
`)}function $e(o,i,e){return o==null||!Number.isFinite(o)?e?"day":"night":o<-6?"night":o<6?i?"dawn":"dusk":"day"}var j=3.2,re="cubic-bezier(0.37, 0, 0.63, 1)",Yt={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},Kt=Object.keys(Yt),rt=Kt.filter(o=>o.startsWith("--awc-sky-"));function jt(){return Kt.map(o=>`${o} ${j}s ${re}`).join(`,
            `)}var Wt=!1;function He(){if(Wt)return;Wt=!0;let o=globalThis.CSS;if(o?.registerProperty)for(let[i,e]of Object.entries(Yt))try{o.registerProperty({name:i,syntax:"<color>",inherits:!0,initialValue:e})}catch{}}var De=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="clouds";this.layerSelector=".clouds-layer";this.containerSelector=".clouds-container";this.cloudTimelines=[];this.startWindFactor=1;this.realWindSpeed=n,this.cloudsConfig={cloudCount:3,isPartlyCloudy:!1,...t},m(this.config.devMode,"CloudsAnimation created")}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start clouds animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Cloud layer not found: ${this.layerSelector}`);let t=L(this.cardConfig,this.realWindSpeed),a=this.element.querySelector(".animated-weather-card");ue(e);let n=Math.min(6,Math.max(1,Math.round(t.cloudCount)));this.cloudsConfig.isPartlyCloudy&&(n=Math.max(1,Math.round(n*.6))),this.cloudTimelines=Lt(e,t,n,a,this.cardConfig),this.startWindFactor=ne(t.windSpeed),m(this.config.devMode,`Clouds animation started with ${n} clouds`)}async onStop(){this.cloudTimelines.forEach(t=>{window.gsap?.killTweensOf(t),t&&typeof t.kill=="function"&&t.kill()}),this.cloudTimelines=[];let e=this.element.querySelector(this.layerSelector);e&&ue(e),m(this.config.devMode,"Clouds animation stopped")}async onPause(){this.cloudTimelines.forEach(e=>{e&&typeof e.pause=="function"&&e.pause()}),m(this.config.devMode,"Clouds animation paused")}async onResume(){this.cloudTimelines.forEach(e=>{e&&typeof e.resume=="function"&&e.resume()}),m(this.config.devMode,"Clouds animation resumed")}onWindSpeedChange(){if(!window.gsap)return;let e=L(this.cardConfig,this.realWindSpeed),t=ne(e.windSpeed)/this.startWindFactor;this.cloudTimelines.forEach(a=>{window.gsap.to(a,{timeScale:t,duration:j,ease:"sine.inOut",overwrite:!0})})}};var Fe=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="fog";this.layerSelector=".animation-layer";this.containerSelector=".fog-container";this.fogTimelines=[];this.realWindSpeed=n,this.fogConfig={layerCount:3,...t},m(this.config.devMode,"FogAnimation created")}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start fog animation");let e=this.element.querySelector(".fog-container")||this.element.querySelector(this.layerSelector);if(!e)throw new Error("Fog container not found");let t=L(this.cardConfig,this.realWindSpeed),a=this.element.querySelector(".animated-weather-card");_e(a),this.fogTimelines=[];for(let n=0;n<this.fogConfig.layerCount;n++){let r=Ht(e,t,n,a,this.cardConfig);this.fogTimelines.push(r.movement),this.fogTimelines.push(r.opacity)}m(this.config.devMode,`Fog animation started with ${this.fogConfig.layerCount} layers`)}async onStop(){this.fogTimelines.forEach(a=>{a&&typeof a.kill=="function"&&a.kill()}),this.fogTimelines=[],this.element.querySelector(".animated-weather-card")?.querySelectorAll(".fog-layer")?.forEach(a=>{window.gsap&&window.gsap.killTweensOf(a),a.parentNode&&a.parentNode.removeChild(a)}),m(this.config.devMode,"Fog animation stopped")}async onPause(){this.fogTimelines.forEach(e=>{e&&typeof e.pause=="function"&&e.pause()}),m(this.config.devMode,"Fog animation paused")}async onResume(){this.fogTimelines.forEach(e=>{e&&typeof e.resume=="function"&&e.resume()}),m(this.config.devMode,"Fog animation resumed")}};var Ri=1/3,Gi=.35,Oe=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="stars";this.layerSelector=".animation-layer";this.containerSelector=".stars-container";this.realWindSpeed=n,this.starsConfig={starCount:30,showMoon:!0,...t},m(this.config.devMode,"StarsAnimation created")}async onStart(){if(!window.gsap)throw new Error("GSAP not loaded - cannot start stars animation");let e=this.element.querySelector(this.layerSelector);if(!e)throw new Error(`Animation layer not found: ${this.layerSelector}`);let t=L(this.cardConfig,this.realWindSpeed);this.element.querySelector(".animated-weather-card")?.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(s=>{window.gsap&&window.gsap.killTweensOf(s),s.remove()});let n=Math.max(15,Math.round(t.cloudCount*5)),r=document.createElement("div");r.className="stars-field";for(let s=0;s<n;s++){let d=document.createElement("div");d.className="star-gsap";let l=1+Math.random()*3,h=.3+Math.random()*.5;if(d.style.cssText=`
                width: ${l.toFixed(2)}px;
                height: ${l.toFixed(2)}px;
                left: ${(Math.random()*100).toFixed(2)}%;
                top: ${(Math.random()*70).toFixed(2)}%;
                opacity: ${h.toFixed(2)};
            `,Math.random()<Ri){let u=3+Math.random()*4;d.classList.add("twinkle"),d.style.setProperty("--star-o",h.toFixed(2)),d.style.setProperty("--star-dim",(h*(1-Math.random()*Gi)).toFixed(2)),d.style.animationDuration=`${u.toFixed(2)}s`,d.style.animationDelay=`${(-Math.random()*u).toFixed(2)}s`}r.appendChild(d)}if(e.appendChild(r),this.addParticle(r),window.gsap.fromTo(r,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"}),this.starsConfig.showMoon){let s=document.createElement("div");s.className="moon-gsap",e.appendChild(s),this.addParticle(s),window.gsap.fromTo(s,{opacity:0},{opacity:1,duration:1.2,ease:"power1.out"})}m(this.config.devMode,`Stars animation started with ${n} stars`)}async onStop(){let e=this.element.querySelector(this.layerSelector);e&&e.querySelectorAll(".stars-field, .star-gsap, .moon-gsap").forEach(a=>{window.gsap&&window.gsap.killTweensOf(a),a.parentNode&&a.parentNode.removeChild(a)}),m(this.config.devMode,"Stars animation stopped")}setPaused(e){this.element.querySelectorAll(`${this.layerSelector} .stars-field, ${this.layerSelector} .moon-gsap`).forEach(t=>t.classList.toggle("paused",e))}async onPause(){this.setPaused(!0),m(this.config.devMode,"Stars animation paused")}async onResume(){this.setPaused(!1),m(this.config.devMode,"Stars animation resumed")}};var Ne=class extends M{constructor(e,t,a,n){super(e,t,a);this.animationType="sun";this.layerSelector=".sun";this.containerSelector=".sun-container";m(this.config.devMode,"SunAnimation created")}async onStart(){let e=this.element.querySelector(this.layerSelector);if(!e){m(this.config.devMode,"Sun element not found \u2014 CSS sun handles rendering");return}e.style.opacity="1",m(this.config.devMode,"Sun animation started (CSS-driven)")}async onStop(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.opacity="0"),m(this.config.devMode,"Sun animation stopped")}async onPause(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.animationPlayState="paused"),m(this.config.devMode,"Sun animation paused")}async onResume(){let e=this.element.querySelector(this.layerSelector);e&&(e.style.animationPlayState="running"),m(this.config.devMode,"Sun animation resumed")}};var We=class{constructor(i,e,t,a){this.activeAnimations=new Map;this.element=i,this.config=e,this.timeOfDayManager=t,this.realWindSpeed=a}async startModularAnimation(i,e){this.activeAnimations.has(i)&&await this.stopModularAnimation(i);try{let t={intensity:e,scale:1,windSpeed:this.realWindSpeed||10,timeOfDay:this.timeOfDayManager?.getCurrentState()?.timePhase||"day",devMode:this.config.dev_mode||!1},a=null;switch(i){case"rain":a=new Ce(this.element,{...t,isStorm:e>=2&&e<=4,isPouring:e>4,isLightRain:e<1,particleCount:Math.floor(e*50),splashEnabled:!0},this.config,this.realWindSpeed);break;case"snow":a=new Ae(this.element,{...t,particleCount:Math.floor(e*30),accumulation:!0,accumulationHeight:0,swayAmplitude:30,fallSpeed:1},this.config,this.realWindSpeed);break;case"sleet":a=new ke(this.element,{...t,particleCount:Math.floor(e*40)},this.config,this.realWindSpeed);break;case"wind":a=new Ee(this.element,{...t,leafCount:Math.max(1,Math.floor(e*3)),swooshEnabled:!0},this.config,this.realWindSpeed);break;case"lightning":a=new Me(this.element,{...t,disableShake:this.config.disable_lightning_shake||!1,minInterval:me[0],maxInterval:me[1]},this.config,this.realWindSpeed);break;case"clouds":a=new De(this.element,{...t,cloudCount:Math.max(1,Math.floor(e*2)),isPartlyCloudy:e<3},this.config,this.realWindSpeed);break;case"fog":a=new Fe(this.element,{...t,layerCount:Math.max(2,Math.min(5,Math.floor(e)))},this.config,this.realWindSpeed);break;case"stars":a=new Oe(this.element,{...t,starCount:Math.max(15,Math.floor(e*10)),showMoon:!0},this.config,this.realWindSpeed);break;case"sun":a=new Ne(this.element,t,this.config);break;default:return m(this.config.dev_mode,`No modular animation registered for type: ${i}`),null}return await a.start(),this.activeAnimations.set(i,a),m(this.config.dev_mode,`Started modular ${i} animation with intensity ${e}`),a}catch(t){return console.error(`Failed to start modular ${i} animation:`,t),null}}async stopModularAnimation(i){let e=this.activeAnimations.get(i);if(e)try{await e.destroy(),m(this.config.dev_mode,`Stopped modular ${i} animation`)}catch(t){console.error(`Error stopping modular ${i} animation:`,t)}finally{this.activeAnimations.delete(i)}}async pauseModularAnimation(i){let e=this.activeAnimations.get(i);if(e&&e.isActive())try{await e.pause()}catch(t){console.error(`Error pausing modular ${i} animation:`,t)}}async resumeModularAnimation(i){let e=this.activeAnimations.get(i);if(e&&e.isPaused())try{await e.resume()}catch(t){console.error(`Error resuming modular ${i} animation:`,t)}}updateWindSpeed(i){if(!Object.is(i,this.realWindSpeed)){this.realWindSpeed=i;for(let[e,t]of this.activeAnimations)try{t.setWindSpeed(i)}catch(a){console.warn(`Failed to update wind speed for ${e}:`,a)}}}async cleanup(){let i=Array.from(this.activeAnimations.keys()).map(e=>this.stopModularAnimation(e));await Promise.all(i),this.activeAnimations.clear()}};var se=class{constructor(i,e,t,a){this.currentWindSpeed=10;this.generation=0;this.animations={rain:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},snow:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sleet:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},wind:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},lightning:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},clouds:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},fog:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},stars:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]},sun:{isActive:!1,isPaused:!1,intensity:1,animationHandles:[],timeouts:[]}};this.defaultWeatherMappings={sunny:{animations:["sun"]},rainy:{animations:["rain"]},snowy:{animations:["snow"]},stormy:{animations:["rain","lightning"],overrides:{rain:{intensity:2}}},windy:{animations:["wind"]},cloudy:{animations:["clouds"]},foggy:{animations:["fog"]},"partly-cloudy":{animations:["sun","clouds"],overrides:{sun:{intensity:.7},clouds:{intensity:.6}}},pouring:{animations:["rain"],overrides:{rain:{intensity:8}}},"snowy-rainy":{animations:["snow","rain"]},"clear-night":{animations:["stars"]},sleety:{animations:["sleet"]},"snowy-stormy":{animations:["snow","lightning"]},"light-rain":{animations:["rain"],overrides:{rain:{intensity:.3}}},"sleety-stormy":{animations:["sleet","lightning"]}};this.element=i,this.config=e,this.isPausedFn=t,this.timeOfDayManager=a,this.modularBridge=new We(i,e,a,this.currentWindSpeed),m(this.config.dev_mode,"WeatherAnimationController initialized")}setWindSpeed(i){this.currentWindSpeed=i,this.modularBridge.updateWindSpeed(i)}async startAnimation(i,e){let t=this.animations[i];if(t.isActive){m(this.config.dev_mode,`Animation ${i} already active \u2014 skipping`);return}let a=e?.intensity??t.intensity??1,n=this.generation;t.isActive=!0,t.intensity=a,this.setAnimationLayerVisibility(i,!0);try{let r=await this.modularBridge.startModularAnimation(i,a);if(n!==this.generation){m(this.config.dev_mode,`Discarding stale start for ${i} (generation drifted)`),await this.modularBridge.stopModularAnimation(i);return}if(!r){t.isActive=!1,console.warn(`No modular animation available for type: ${i}`);return}m(this.config.dev_mode,`Started ${i} animation with intensity ${a}`)}catch(r){console.error(`Failed to start ${i} animation:`,r),t.isActive=!1}}async stopAnimation(i){let e=this.animations[i];if(e.isActive){this.generation++;try{await this.modularBridge.stopModularAnimation(i),m(this.config.dev_mode,`Stopped ${i} animation`)}catch(t){console.error(`Error stopping ${i} animation:`,t)}this.setAnimationLayerVisibility(i,!1),e.isActive=!1,e.isPaused=!1}}pauseAnimation(i){let e=this.animations[i];!e.isActive||e.isPaused||(e.isPaused=!0,this.modularBridge.pauseModularAnimation(i),m(this.config.dev_mode,`Paused ${i} animation`))}resumeAnimation(i){let e=this.animations[i];!e.isActive||!e.isPaused||(e.isPaused=!1,this.modularBridge.resumeModularAnimation(i),m(this.config.dev_mode,`Resumed ${i} animation`))}async stopAllAnimations(){this.generation++,await Promise.all(Object.keys(this.animations).map(i=>this.stopAnimation(i)))}pauseAllAnimations(){Object.keys(this.animations).forEach(i=>this.pauseAnimation(i))}resumeAllAnimations(){Object.keys(this.animations).forEach(i=>this.resumeAnimation(i))}async applyWeatherCondition(i){await this.stopAllAnimations(),this.clearIndividualAnimationClasses();let e=this.defaultWeatherMappings[i.toLowerCase()];if(!e){console.warn(`No animation mapping for weather condition: ${i}`);return}await Promise.all(e.animations.map(t=>{let a=e.overrides?.[t];return this.startAnimation(t,a)})),m(this.config.dev_mode,`Applied weather condition: ${i} with animations: ${e.animations.join(", ")}`)}getAnimationStates(){return{...this.animations}}getWeatherMappings(){return this.defaultWeatherMappings}setAnimationLayerVisibility(i,e){let t=this.element.querySelector(".animated-weather-card");if(!t)return;let a=`individual-${i}-active`;e?t.classList.add(a):t.classList.remove(a)}clearIndividualAnimationClasses(){let i=this.element.querySelector(".animated-weather-card");if(i)for(let e of Object.keys(this.animations))i.classList.remove(`individual-${e}-active`)}};var Ie=o=>{if(o==null||o==="")return null;let i=typeof o=="number"?o:Number(o);return Number.isFinite(i)?i:null},ze=o=>typeof o=="string"?o.trim():"";function Bi(o){if(!o||typeof o!="object")return null;let i=o,e=typeof i.id=="number"?String(i.id):ze(i.id);return e?{id:e,label:ze(i.flight_number)||ze(i.callsign),aircraftCode:ze(i.aircraft_code),altitudeFt:Ie(i.altitude),groundSpeedKt:Ie(i.ground_speed),heading:Ie(i.heading),verticalSpeed:Ie(i.vertical_speed),onGround:i.on_ground===1||i.on_ground===!0||i.on_ground==="1"}:null}function Ut(o,i){if(!o||!i)return null;let e=o.states[i];if(!e||e.state==="unavailable"||e.state==="unknown")return null;let t=e.attributes?.flights;if(!Array.isArray(t))return[];let a=[];for(let n of t){let r=Bi(n);r&&a.push(r)}return a}var Re=class{constructor(){this.known=null}update(i){if(!i)return[];let e=i.filter(r=>!r.onGround),t=new Set(e.map(r=>r.id));if(this.known===null)return this.known=t,[];let a=[],n=new Set;for(let r of e)this.known.has(r.id)||n.has(r.id)||(n.add(r.id),a.push(r));return this.known=t,a}reset(){this.known=null}};var Ge=class{constructor(i={}){this.listeners=new Set;this.config={enableDayNightCycle:i.enableDayNightCycle??!1,sunriseHour:6,sunsetHour:20,useBrowserTime:!0,...i},this.updateState(),this.config.enableDayNightCycle&&this.startAutoUpdate()}getCurrentState(){return this.currentState||this.updateState(),this.currentState}isEnabled(){return this.config.enableDayNightCycle||!1}updateConfig(i){let e=this.config.enableDayNightCycle;this.config={...this.config,...i},this.updateState(),this.config.enableDayNightCycle&&!e?this.startAutoUpdate():!this.config.enableDayNightCycle&&e&&this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0)}addListener(i){this.listeners.add(i)}removeListener(i){this.listeners.delete(i)}getTimeAwareColor(i){let e=this.getCurrentState();if(!this.isEnabled())return i.day;switch(e.timePhase){case"dawn":return i.dawn||this.blendColors(i.night,i.day,.3);case"day":return i.day;case"dusk":return i.dusk||this.blendColors(i.day,i.night,.3);case"night":return i.night;default:return i.day}}setDevOverride(i){this.devTimePhaseOverride=i,this.updateState()}clearDevOverride(){this.devTimePhaseOverride=void 0,this.updateState()}destroy(){this.updateInterval&&(clearInterval(this.updateInterval),this.updateInterval=void 0),this.listeners.clear()}updateState(){let i=new Date,e,t;if(!this.config.useBrowserTime&&this.config.timeZone){let s=new Intl.DateTimeFormat("en-US",{timeZone:this.config.timeZone,hour:"numeric",minute:"numeric",hour12:!1}).formatToParts(i);e=parseInt(s.find(d=>d.type==="hour")?.value||"0",10),t=parseInt(s.find(d=>d.type==="minute")?.value||"0",10)}else e=i.getHours(),t=i.getMinutes();let a=e+t/60,n;if(this.devTimePhaseOverride)n=this.devTimePhaseOverride;else{let s=this.config.sunriseHour,d=this.config.sunsetHour,l=(s-1+24)%24,h=(s+.5)%24,u=(d-.5+24)%24,c=(d+1)%24,p=(f,w,g)=>w<=g?f>=w&&f<g:f>=w||f<g;p(a,l,h)?n="dawn":p(a,h,u)?n="day":p(a,u,c)?n="dusk":n="night"}let r={isDaytime:n==="day"||n==="dawn",isNighttime:n==="night"||n==="dusk",isDawn:n==="dawn",isDusk:n==="dusk",currentHour:e,timePhase:n};!this.currentState||this.currentState.timePhase!==r.timePhase?(this.currentState=r,this.notifyListeners(r)):this.currentState=r}startAutoUpdate(){this.updateInterval=window.setInterval(()=>{this.updateState()},ft.UPDATE_INTERVAL)}notifyListeners(i){this.listeners.forEach(e=>{try{e(i)}catch(t){console.error("TimeOfDayManager: Error in listener callback:",t)}})}blendColors(i,e,t){let a=i.replace("#",""),n=e.replace("#",""),r=parseInt(a.substring(0,2),16),s=parseInt(a.substring(2,4),16),d=parseInt(a.substring(4,6),16),l=parseInt(n.substring(0,2),16),h=parseInt(n.substring(2,4),16),u=parseInt(n.substring(4,6),16),c=Math.round(r*(1-t)+l*t),p=Math.round(s*(1-t)+h*t),f=Math.round(d*(1-t)+u*t),w=c.toString(16).padStart(2,"0"),g=p.toString(16).padStart(2,"0"),v=f.toString(16).padStart(2,"0");return`#${w}${g}${v}`}};var ge=o=>`
        ${o} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var qi=Vt(),Vi=z(N(ae)),Xt=o=>`${Math.round(o*100)}%`,Yi=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,Ki=48,st=()=>`
${ge("animated-weather-card")}
        /* \u2500\u2500 Reduced motion (WCAG 2.3.3): static sky, no weather motion \u2500\u2500\u2500\u2500\u2500 */
        @media (prefers-reduced-motion: reduce) {
          .animated-weather-card *,
          .animated-weather-card *::before,
          .animated-weather-card *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
          /* Weather motion goes; the sun stays, still */
          .animated-weather-card .animation-container {
            display: none !important;
          }
        }

        /* \u2500\u2500 Frame \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* The sky is the card: in the colorized palette ha-card's own fill and
           border step aside so the sky reaches the rounded edge. Theme mode
           keeps ha-card's frame and blends with the dashboard. */
        ha-card:has(> .animated-weather-card) {
          height: 100%;
          overflow: hidden;
          isolation: isolate;
        }
        /* spill_particles (default on): rain, snow, sleet and leaves fall out
           of the card onto the dashboard, and clouds can rise a little above
           its top edge. The sky, sun, planes and text stay inside the rounded
           frame either way. */
        ha-card:has(> .animated-weather-card[data-spill]) { overflow: visible; }
        ha-card:has(> .animated-weather-card:not(.theme-colors)) {
          background: none;
          border-color: transparent;
        }

        .animated-weather-card {
          --awc-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          --awc-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          --awc-ease: cubic-bezier(0.25, 1, 0.5, 1);
          --awc-pad: 20px;
          --awc-secondary: ${Pe};

          /* Public color hooks (also set by custom_colors) */
          --weather-text-color: ${Vi};
          --weather-text-shadow: var(--weather-text-shadow-color, rgba(6, 12, 28, 0.22));
          --weather-sun-primary: var(--weather-sun-color-primary, #ffd67a);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ffb547);
          --weather-sun-glow: var(--weather-sun-glow-color, rgba(255, 214, 140, 0.55));
          --weather-sun-halo: var(--weather-sun-halo-color, rgba(255, 214, 140, 0.24));
          --weather-rain-color: var(--weather-rain-particle-color, rgba(222, 234, 255, 0.62));
          --weather-storm-rain-color: var(--weather-storm-rain-particle-color, rgba(206, 214, 236, 0.5));
          --weather-snow-color: var(--weather-snow-particle-color, #f7fbff);
          --weather-wind-color: var(--weather-wind-particle-color, rgba(255, 255, 255, 0.4));
          --awc-cloud-far: rgba(214, 226, 242, 0.85);
          --awc-cloud-mid: rgba(232, 239, 248, 0.92);
          --awc-cloud-near: rgba(248, 250, 253, 0.96);

          position: relative;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 100%;
          height: 100%;
          min-height: 168px;
          border-radius: var(--ha-card-border-radius, 12px);
          overflow: hidden;
          isolation: isolate;
          container: awc / inline-size;
          color: var(--weather-text-color);
          font-family: var(--awc-font);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          /* Day \u2192 dusk \u2192 night and condition changes cross-fade through the
             registered sky, sun and cloud colors, all on one curve */
          transition:
            ${jt()};
        }

        .animated-weather-card[data-spill] { overflow: visible; }

        .animated-weather-card.no-transitions,
        .animated-weather-card.no-transitions * {
          transition: none !important;
        }

        /* \u2500\u2500 Sky \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        ${qi}

        .sky {
          position: absolute;
          inset: 0;
          z-index: 0;
          border-radius: inherit;
          overflow: hidden;
          pointer-events: none;
          --awc-sky-glow-layer: ${oe(Le,"var(--awc-sky-glow)")};
          --awc-sky-layers:
            var(--awc-sky-glow-layer),
            linear-gradient(180deg, transparent ${Xt(Gt)}, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) ${Xt(Rt)}, var(--awc-sky-bottom) 100%);
          background: var(--awc-sky-override, var(--awc-sky-layers));
        }
        /* Wide cards put the metrics in the right column: keep the glow above them */
        @container awc (min-width: 640px) {
          .sky { --awc-sky-glow-layer: ${oe(Bt,"var(--awc-sky-glow)")}; }
        }

        /* Edge falloff: the frame darkens slightly, like a lens */
        .sky::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(150% 120% at 40% 30%, transparent 58%, rgba(4, 8, 20, 0.2) 100%);
        }

        .sky::after {
          content: '';
          position: absolute;
          inset: 0;
          background-image: ${Yi};
          background-size: 160px 160px;
          opacity: 0.07;
          mix-blend-mode: overlay;
        }

        /* Theme overrides: --weather-<condition>-background replaces the whole sky */
        .animated-weather-card.sunny { --awc-sky-override: var(--weather-sunny-background); }
        .animated-weather-card.partly-cloudy { --awc-sky-override: var(--weather-partly-cloudy-background); }
        .animated-weather-card.windy { --awc-sky-override: var(--weather-windy-background); }
        .animated-weather-card.cloudy { --awc-sky-override: var(--weather-cloudy-background); }
        .animated-weather-card.foggy { --awc-sky-override: var(--weather-foggy-background); }
        .animated-weather-card.light-rain { --awc-sky-override: var(--weather-light-rain-background); }
        .animated-weather-card.rainy { --awc-sky-override: var(--weather-rainy-background); }
        .animated-weather-card.pouring { --awc-sky-override: var(--weather-pouring-background); }
        .animated-weather-card.stormy { --awc-sky-override: var(--weather-stormy-background); }
        .animated-weather-card.snowy { --awc-sky-override: var(--weather-snowy-background); }
        .animated-weather-card.snowy-rainy { --awc-sky-override: var(--weather-snowy-rainy-background); }
        .animated-weather-card.sleety { --awc-sky-override: var(--weather-sleety-background); }
        .animated-weather-card.snowy-stormy { --awc-sky-override: var(--weather-snowy-stormy-background); }
        .animated-weather-card.sleety-stormy { --awc-sky-override: var(--weather-sleety-stormy-background); }
        .animated-weather-card.clear-night { --awc-sky-override: var(--weather-clear-night-background); }

        /* Overcast and night skies get greyer, dimmer clouds */
        .animated-weather-card.cloudy,
        .animated-weather-card.foggy {
          --awc-cloud-far: rgba(170, 182, 198, 0.8);
          --awc-cloud-mid: rgba(196, 206, 220, 0.88);
          --awc-cloud-near: rgba(222, 229, 238, 0.94);
        }
        .animated-weather-card[data-phase="night"] {
          --awc-cloud-far: rgba(96, 108, 132, 0.7);
          --awc-cloud-mid: rgba(122, 134, 158, 0.78);
          --awc-cloud-near: rgba(150, 162, 186, 0.85);
          --weather-rain-color: var(--weather-rain-particle-color, rgba(180, 198, 230, 0.48));
        }
        .animated-weather-card[data-phase="dusk"] {
          --awc-cloud-near: rgba(255, 226, 214, 0.94);
          --awc-cloud-mid: rgba(236, 210, 214, 0.9);
          --weather-sun-primary: var(--weather-sun-color-primary, #ffc58a);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ff9a5c);
          --weather-sun-glow: var(--weather-sun-glow-color, rgba(255, 170, 110, 0.55));
          --weather-sun-halo: var(--weather-sun-halo-color, rgba(255, 170, 110, 0.24));
        }
        .animated-weather-card[data-phase="dawn"] {
          --awc-cloud-near: rgba(255, 234, 228, 0.94);
          --weather-sun-primary: var(--weather-sun-color-primary, #ffe0b0);
          --weather-sun-secondary: var(--weather-sun-color-secondary, #ffb98a);
        }

        /* \u2500\u2500 Theme palette: blend with the dashboard \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .animated-weather-card.theme-colors {
          --weather-text-color: var(--primary-text-color);
          --weather-text-shadow: transparent;
          --awc-secondary: 1;
          --weather-rain-color: var(--weather-rain-particle-color, var(--primary-color, #03a9f4));
          --weather-storm-rain-color: var(--weather-storm-rain-particle-color, var(--secondary-text-color, #8a8a8a));
          --weather-snow-color: var(--weather-snow-particle-color, var(--secondary-text-color, #9a9a9a));
          --weather-wind-color: var(--secondary-text-color, rgba(0, 0, 0, 0.3));
          --weather-sun-primary: var(--weather-sun-color-primary, var(--state-sun-above_horizon-color, #ffc107));
          --weather-sun-secondary: var(--weather-sun-color-secondary, var(--state-sun-above_horizon-color, #ff9800));
          --weather-sun-glow: transparent;
          --awc-cloud-far: var(--secondary-text-color, #888);
          --awc-cloud-mid: var(--secondary-text-color, #888);
          --awc-cloud-near: var(--secondary-text-color, #888);
          /* Icons take the theme's icon colour, as Home Assistant's own
             cards do for sensors (the tile card's default) */
          --awc-icon-color: var(--state-icon-color, var(--primary-color));
          /* The hero temperature carries the theme's primary colour */
          --awc-hero-color: var(--primary-color, var(--primary-text-color));
          border-radius: 0;
        }
        .animated-weather-card.theme-colors .sky { display: none; }
        /* Without a sky behind them, blurred translucent clouds read as
           smudges; draw them as faint, crisp shapes instead */
        .animated-weather-card.theme-colors .cloud-gsap {
          opacity: 0.16 !important;
          filter: none !important;
        }
        .animated-weather-card.theme-colors .secondary,
        .animated-weather-card.theme-colors .attribute-label,
        .animated-weather-card.theme-colors .hero-meta {
          color: var(--secondary-text-color);
        }
        .animated-weather-card.theme-colors .weather-info { text-shadow: none; }
        .animated-weather-card.theme-colors .attribute-icon,
        .animated-weather-card.theme-colors .indoor-icon {
          color: var(--awc-icon-color);
        }
        .animated-weather-card.theme-colors .temperature {
          color: var(--awc-hero-color);
        }

        /* \u2500\u2500 Loading \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .weather-skeleton {
          position: absolute;
          inset: 0;
          z-index: 30;
          display: none;
          flex-direction: column;
          padding: var(--awc-pad);
          gap: 10px;
        }
        .animated-weather-card.loading .weather-skeleton { display: flex; }
        .animated-weather-card.loading .weather-content { opacity: 0; }
        .animated-weather-card.loading .animation-layer,
        .animated-weather-card.loading .animation-container { display: none !important; }

        .skeleton-line {
          height: 12px;
          width: 34%;
          border-radius: 6px;
          background: currentColor;
          opacity: 0.12;
          animation: awcSkeleton 1.6s ease-in-out infinite;
        }
        .skeleton-line.large { height: 56px; width: 38%; border-radius: 12px; }
        .skeleton-line.medium { width: 26%; }
        .skeleton-line.small { width: 100%; height: 30px; margin-top: auto; border-radius: 8px; }
        @keyframes awcSkeleton {
          0%, 100% { opacity: 0.08; }
          50% { opacity: 0.16; }
        }

        /* \u2500\u2500 Content \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Clips the sky-borne layer (sun, moon, clouds, planes, lightning) to
           the frame even when precipitation is allowed to spill. */
        .weather-content {
          position: relative;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          border-radius: inherit;
          overflow: hidden;
          transition: opacity 0.5s var(--awc-ease);
        }

        .weather-info {
          position: relative;
          z-index: 30;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: var(--awc-pad);
          min-height: 0;
          text-shadow: 0 1px 12px var(--weather-text-shadow);
        }

        .main-weather-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
          /* Safety net for frames shorter than the content: the hero gives
             way at its bottom edge and the metric row is never cut. The
             card normally steps down first (see applySizeState). */
          flex: 0 1 auto;
          min-height: 0;
          clip-path: inset(-60px -60px 0 -60px);
        }
        /* Never squash a line to fit: let it overflow so the card can
           measure it and step down to a compact layout instead. */
        .main-weather-info > *,
        .weather-attributes { flex-shrink: 0; }

        .location {
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          letter-spacing: -0.01em;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          opacity: 0.94;
        }

        .temperature {
          font-family: var(--awc-font-display);
          font-size: 80px;
          font-weight: 200;
          line-height: 0.9;
          letter-spacing: -0.045em;
          font-variant-numeric: tabular-nums;
          font-feature-settings: "tnum";
          /* Optical alignment: big numerals carry extra left side-bearing */
          margin: 4px 0 0 -0.055em;
          white-space: nowrap;
        }
        /* inline-block so a new value can rise into place (fadeThrough) */
        .temperature-value { display: inline-block; }
        .temperature .degree {
          font-weight: 200;
          letter-spacing: 0;
          margin-left: 0.02em;
        }

        .weather-desc {
          margin-top: 8px;
          font-size: 17px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: -0.012em;
        }
        /* Conditions come in the user's language and casing ("Partly cloudy",
           "Teilweise bew\xF6lkt"); only make sure they start with a capital */
        .weather-desc::first-letter { text-transform: uppercase; }

        .hero-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: baseline;
          gap: 2px 14px;
          margin-top: 2px;
          font-size: 15px;
          line-height: 20px;
          letter-spacing: -0.006em;
          font-variant-numeric: tabular-nums;
          opacity: var(--awc-secondary);
        }
        .hero-meta:empty { display: none; }
        .indoor-climate-inline { white-space: nowrap; }
        .indoor-label { font-weight: 400; margin-right: 4px; }
        .indoor-icon {
          --mdc-icon-size: 14px;
          margin-right: 4px;
          /* Sits on the line like a letter: centred on the digits beside it */
          vertical-align: -1.5px;
        }
        .awc-visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          overflow: hidden;
          clip-path: inset(50%);
          white-space: nowrap;
        }
        /* "6:32" + a smaller "PM", matching the sun tracker */
        .awc-ampm {
          font-size: 0.7em;
          font-weight: 500;
          letter-spacing: 0.02em;
          margin-left: 0.24em;
        }
        .indoor-sep { margin: 0 4px; opacity: 0.6; }

        /* \u2500\u2500 Note \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* A sentence about the weather, last under the hero. It comes in two
           lengths, both in the markup: the height step shows the one that
           fits (see the adaptive height rules below). Full-strength text at
           the quiet tier's size, not its tint: on a narrow card the second
           half of a line runs into the sun's glow, where the tint falls
           below 4.5:1 (sky.test.ts samples it). A sentence is read, not
           glanced at. */
        .weather-note {
          margin: 10px 0 0;
          max-width: 46ch;
          font-size: 15px;
          font-weight: 400;
          line-height: 20px;
          letter-spacing: -0.006em;
          text-wrap: pretty;
          /* Whole or not at all: the fit shows a length only if all of it
             fits, and treats a clamped one as not fitting (applySizeState).
             The clamp only stops runaway text from growing the card. */
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          line-clamp: 4;
          overflow: hidden;
        }
        .weather-note[hidden],
        .weather-note .note-short { display: none; }
        /* Which length, or none: the fit decides (NOTE_FIT_STEPS) */
        .animated-weather-card[data-note="line"] .weather-note { -webkit-line-clamp: 2; line-clamp: 2; }
        .animated-weather-card[data-note="line"] .note-long { display: none; }
        .animated-weather-card[data-note="line"] .note-short { display: inline; }
        .animated-weather-card[data-note="none"] .weather-note { display: none; }
        /* While a new note is written: a status in its place, typing dots
           and what's happening, the size of the note it stands for (two
           lines, or one), so nothing moves when the note arrives. A plain
           block, unclamped: a clamp would read the status as text cut
           short, and the fit would turn it away. */
        .note-status { display: none; }
        .weather-note[data-writing] {
          display: block;
          box-sizing: border-box;
          /* The hero column sizes its lines to their text: take the note's
             full measure (max-width: 46ch) instead */
          width: 100%;
          height: 40px;
        }
        .animated-weather-card .weather-note[data-writing] { -webkit-line-clamp: none; line-clamp: none; }
        /* Outranks the length rules above, which show one span or the other */
        .animated-weather-card .weather-note[data-writing] > .note-long,
        .animated-weather-card .weather-note[data-writing] > .note-short { display: none; }
        /* The secondary tint, short and at the left: well inside the part
           of the card the glow leaves at AA (x up to 0.55 on narrow cards,
           see sky.test.ts). A much longer status would need checking. */
        .weather-note[data-writing] > .note-status {
          display: flex;
          align-items: center;
          gap: 8px;
          height: 20px;
          opacity: var(--awc-secondary);
          white-space: nowrap;
          overflow: hidden;
        }
        .note-dots { display: inline-flex; gap: 3px; flex: none; }
        .note-dots i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
          animation: awcNoteDot 1.2s ease-in-out infinite;
        }
        .note-dots i:nth-child(2) { animation-delay: 0.15s; }
        .note-dots i:nth-child(3) { animation-delay: 0.3s; }
        @keyframes awcNoteDot {
          0%, 70%, 100% { opacity: 0.3; transform: none; }
          35% { opacity: 1; transform: translateY(-2px); }
        }
        .note-phrase { overflow: hidden; text-overflow: ellipsis; }
        .animated-weather-card[data-note="line"] .weather-note[data-writing] { height: 20px; }
        /* Typing in: the rest of the note is laid out but not yet shown, so
           its lines already break where they'll end up. No caret: even one
           with no width can change where a line breaks. */
        .note-untyped { color: transparent; text-shadow: none; }

        /* \u2500\u2500 Metrics \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .weather-attributes {
          position: relative;
          display: grid;
          grid-auto-flow: column;
          /* Columns hug their content and share the leftover space, so the
             longest label (PRESSURE) never truncates */
          grid-auto-columns: max-content;
          justify-content: space-between;
          column-gap: 24px;
          row-gap: 14px;
          margin-top: auto;
          padding-top: 14px;
        }
        .weather-attributes::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: currentColor;
          opacity: 0.2;
        }
        .animated-weather-card.theme-colors .weather-attributes::before {
          background: var(--divider-color, rgba(0, 0, 0, 0.12));
          opacity: 1;
        }

        .attribute {
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
        }

        .attribute-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          line-height: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          opacity: var(--awc-secondary);
        }
        .attribute-label > span {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .attribute-icon {
          --mdc-icon-size: 13px;
          flex-shrink: 0;
          /* Optical: centred on the capitals of the uppercase label */
          margin-top: -0.5px;
        }

        .attribute-value {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 16px;
          font-weight: 500;
          line-height: 21px;
          letter-spacing: -0.012em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          min-width: 0;
        }
        .attribute-text {
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .wind-bearing-arrow,
        .pressure-trend {
          --mdc-icon-size: 14px;
          flex-shrink: 0;
          opacity: var(--awc-secondary);
        }

        /* One row when the (localized) labels fit, else a 2\xD72 grid. Measured
           in applySizeState, since label length depends on the language. */
        .animated-weather-card[data-metrics="grid"] .weather-attributes {
          grid-auto-flow: row;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          justify-content: stretch;
        }

        /* Values only (labels hidden): give the numbers a touch more presence */
        .weather-attributes.values-only .attribute-value { font-size: 18px; }
        .weather-attributes.values-only .attribute { flex-direction: row; align-items: center; gap: 6px; }
        .weather-attributes.values-only .attribute-icon { --mdc-icon-size: 16px; opacity: var(--awc-secondary); }

        /* \u2500\u2500 Adaptive layout: width \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        @container awc (max-width: 319px) {
          .weather-info, .weather-skeleton { --awc-pad: 16px; }
          .temperature { font-size: 64px; font-weight: 250; }
          .weather-desc { font-size: 16px; line-height: 21px; margin-top: 6px; }
          .hero-meta, .weather-note { font-size: 14px; }
          .attribute-value { font-size: 16px; }
        }
        @container awc (max-width: 259px) {
          .temperature { font-size: 56px; font-weight: 300; }
          .location { font-size: 14px; }
          .hero-meta, .weather-note { display: none; }
        }
        @container awc (min-width: 460px) {
          .weather-info, .weather-skeleton { --awc-pad: 24px; }
          .location { font-size: 16px; }
          .temperature { font-size: 96px; letter-spacing: -0.05em; }
          .weather-desc { font-size: 18px; line-height: 24px; }
          .attribute-value { font-size: 18px; line-height: 24px; }
        }
        /* Wide frames (wall tablets, full-width rows): hero left, metrics right */
        @container awc (min-width: 640px) {
          .weather-info, .weather-skeleton { --awc-pad: 28px; }
          .weather-info {
            flex-direction: row;
            align-items: flex-end;
            gap: 40px;
          }
          .main-weather-info { flex: 1; align-self: stretch; justify-content: flex-end; }
          .temperature { font-size: 120px; }
          /* [data-metrics] beats the measured row/grid rules: wide cards
             always use this two-column block */
          .weather-attributes,
          .animated-weather-card[data-metrics] .weather-attributes {
            flex: 0 0 auto;
            width: auto;
            margin-top: 0;
            padding: 0 0 4px 24px;
            grid-auto-flow: row;
            grid-template-columns: repeat(2, max-content);
            column-gap: 56px;
            justify-content: end;
            row-gap: 18px;
          }
          .weather-attributes::before {
            top: 0;
            bottom: 4px;
            left: 0;
            right: auto;
            width: 1px;
            height: auto;
          }
        }

        /* \u2500\u2500 Adaptive layout: height (stepped down until nothing overflows) \u2500
           Each step keeps the one before it and gives up a little more:
           compact drops the line under the condition, short shrinks the
           temperature, tight drops the location, minimal drops the metric
           labels and shrinks the temperature again. A phone's sections row
           (353 \xD7 248) lands on tight, with the labels. */
        .animated-weather-card[data-height="compact"] .hero-meta,
        .animated-weather-card[data-height="short"] .hero-meta,
        .animated-weather-card[data-height="tight"] .hero-meta,
        .animated-weather-card[data-height="minimal"] .hero-meta { display: none; }
        .animated-weather-card[data-height="short"] .weather-info,
        .animated-weather-card[data-height="tight"] .weather-info,
        .animated-weather-card[data-height="minimal"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="short"] .temperature,
        .animated-weather-card[data-height="tight"] .temperature { font-size: 60px; font-weight: 250; }
        .animated-weather-card[data-height="short"] .weather-desc,
        .animated-weather-card[data-height="tight"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="short"] .weather-attributes,
        .animated-weather-card[data-height="tight"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="tight"] .location,
        .animated-weather-card[data-height="minimal"] .location,
        .animated-weather-card[data-height="minimal"] .attribute-label > span { display: none; }
        /* Minimal: icon beside value, so the numbers keep their meaning */
        .animated-weather-card[data-height="minimal"] .attribute { flex-direction: row; align-items: center; gap: 6px; }
        .animated-weather-card[data-height="minimal"] .attribute-icon { --mdc-icon-size: 15px; }
        .animated-weather-card[data-height="minimal"] .temperature { font-size: 52px; font-weight: 300; }
        .animated-weather-card[data-height="minimal"] .weather-desc { margin-top: 2px; }
        .animated-weather-card[data-height="minimal"] .weather-attributes { padding-top: 8px; }

        /* Close, with a note only: everything at its regular size, with
           short's gaps, so a longer note's third line fits where there's
           a line's room less one gap: 12 px back before the note shortens */
        .animated-weather-card[data-height="close"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="close"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="close"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="close"] .weather-note { margin-top: 6px; }

        /* Snug, with a note only: short's sizes, keeping the location and
           the line under the condition, so the note's one-line version fits
           without either giving way. A phone's five-row section (353 \xD7 312,
           metrics in a labelled grid) has 155 px for the hero; snug needs
           152 with the note 6 px below the line above it. At 10 px it no
           longer fits. */
        .animated-weather-card[data-height="snug"] .weather-info { gap: 12px; }
        .animated-weather-card[data-height="snug"] .temperature { font-size: 60px; font-weight: 250; }
        .animated-weather-card[data-height="snug"] .weather-desc { margin-top: 4px; }
        .animated-weather-card[data-height="snug"] .weather-attributes { padding-top: 10px; }
        .animated-weather-card[data-height="snug"] .weather-note { margin-top: 6px; }

        /* \u2500\u2500 Compact: the hero on one line, the sky still moving behind \u2500\u2500 */
        /* The temperature leads on the left; the condition, then where and
           what it feels like, sit beside it; the sun keeps its corner of the
           sky on the right, at mid-height. Built to share a column with the
           compact sun tracker. */
        .animated-weather-card[data-variant="compact"] { min-height: 0; }
        .animated-weather-card[data-variant="compact"] .weather-info {
          flex-direction: row;
          align-items: center;
          gap: 0;
          padding-block: 16px;
        }
        .animated-weather-card[data-variant="compact"] .main-weather-info {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr);
          grid-template-areas: "temp desc" "temp meta";
          column-gap: 14px;
          align-items: center;
          align-content: center;
          justify-content: start;
          flex: 1 1 auto;
          align-self: center;
          /* Text stops short of the sun */
          margin-right: calc(14% + 22px);
          clip-path: none;
        }
        .animated-weather-card[data-variant="compact"] .temperature {
          grid-area: temp;
          font-size: 56px;
          /* 1, not the hero's 0.9: the numerals must fit their box here, or
             the fit check reads them as overflowing the strip */
          line-height: 1;
          font-weight: 200;
          letter-spacing: -0.045em;
          margin: 0 0 0 -0.055em;
        }
        .animated-weather-card[data-variant="compact"] .weather-desc,
        .animated-weather-card[data-variant="compact"] .compact-meta {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .animated-weather-card[data-variant="compact"] .weather-desc {
          grid-area: desc;
          align-self: end;
          margin: 0;
          font-size: 16px;
          line-height: 21px;
        }
        .compact-meta {
          grid-area: meta;
          align-self: start;
          margin-top: 2px;
          font-size: 13px;
          line-height: 18px;
          letter-spacing: -0.004em;
          font-variant-numeric: tabular-nums;
          opacity: var(--awc-secondary);
        }
        .compact-meta:empty { display: none; }
        .animated-weather-card[data-variant="compact"] .sun {
          top: 50%;
          left: 86%;
          width: 30px;
          height: 30px;
        }
        .animated-weather-card[data-variant="compact"].theme-colors .sun { width: 26px; height: 26px; }
        .animated-weather-card[data-variant="compact"] .moon-gsap {
          top: 50%;
          left: 86%;
          width: 26px;
          height: 26px;
        }
        /* The light sits around the sun at mid-height */
        .animated-weather-card[data-variant="compact"] .sky {
          --awc-sky-glow-layer: ${oe(qt,"var(--awc-sky-glow)")};
        }
        /* Loading: the temperature and condition placeholders, side by side */
        .animated-weather-card[data-variant="compact"] .weather-skeleton {
          flex-direction: row;
          align-items: center;
          gap: 14px;
        }
        .animated-weather-card[data-variant="compact"] .skeleton-line:not(.large):not(.medium) { display: none; }
        .animated-weather-card[data-variant="compact"] .skeleton-line.large { width: 72px; height: 44px; }
        .animated-weather-card[data-variant="compact"] .skeleton-line.medium { width: 30%; }
        /* Short frames (a one-row section): smaller numerals, then one line.
           The strip has no step past tight: minimal looks the same. */
        .animated-weather-card[data-variant="compact"][data-height="short"] .temperature { font-size: 44px; font-weight: 250; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .weather-info,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .weather-info { padding-block: 8px; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .temperature,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .temperature { font-size: 36px; font-weight: 300; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .main-weather-info,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .main-weather-info { grid-template-areas: "temp desc"; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .weather-desc,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .weather-desc { align-self: center; font-size: 15px; }
        .animated-weather-card[data-variant="compact"][data-height="tight"] .compact-meta,
        .animated-weather-card[data-variant="compact"][data-height="minimal"] .compact-meta { display: none; }

        /* \u2500\u2500 Animation layers \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .animation-layer {
          position: absolute;
          inset: 0;
          z-index: 20;
          pointer-events: none;
          contain: style;
        }

        .animation-container {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.6s var(--awc-ease);
        }

        /* Condition change: the old weather fades out (0.4s, see
           CONDITION_FADE_OUT_MS) before the new one starts, while the sky
           cross-fades through its registered colors. !important beats the
           inline opacity GSAP keeps writing to clouds and stars. */
        .animated-weather-card.condition-out .animation-container,
        .animated-weather-card.condition-out .cloud-gsap,
        .animated-weather-card.condition-out .star-gsap,
        .animated-weather-card.condition-out .moon-gsap,
        .animated-weather-card.condition-out .snow-accumulation,
        .animated-weather-card.condition-out .sleet-accumulation {
          opacity: 0 !important;
          transition: opacity 0.4s cubic-bezier(0.5, 0, 0.75, 0) !important;
        }
        /* Fog always stays in the frame, corners included */
        .animation-container.fog-container {
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
        }
        /* Spill: precipitation escapes the sides and bottom, never the top;
           wind carries leaves out to the right */
        .animated-weather-card[data-spill] .rain-container,
        .animated-weather-card[data-spill] .snow-container,
        .animated-weather-card[data-spill] .sleet-container,
        .animated-weather-card[data-spill] .lightning-container {
          clip-path: inset(0 -200px -200px -200px);
        }
        .animated-weather-card[data-spill] .wind-container {
          clip-path: inset(0 -500px -200px 0);
        }

        /* Clouds drift in front of the sun, stars and planes, in their own
           layer. In the frame by default; with spill they can rise past the
           top edge, fading out over the top half of CLOUD_OVERHANG_PX. The sides and
           bottom stay closed: clouds cross the card, not the dashboard. */
        .clouds-container {
          --awc-cloud-overhang: 0px;
          z-index: 25;
          clip-path: inset(0 round var(--ha-card-border-radius, 12px));
        }
        .clouds-layer {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          top: var(--awc-cloud-overhang);
        }
        .animated-weather-card[data-spill] .clouds-container {
          --awc-cloud-overhang: ${Ki}px;
          top: calc(-1 * var(--awc-cloud-overhang));
          clip-path: inset(0 round 0 0 var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px));
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 calc(var(--awc-cloud-overhang) / 2));
          mask-image: linear-gradient(to bottom, transparent 0, #000 calc(var(--awc-cloud-overhang) / 2));
        }

        .rain-layer, .snow-layer, .sleet-layer, .wind-layer {
          position: absolute;
          inset: 0;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s var(--awc-ease);
        }

        .animated-weather-card.rainy .rain-layer,
        .animated-weather-card.stormy .rain-layer,
        .animated-weather-card.pouring .rain-layer,
        .animated-weather-card.snowy-rainy .rain-layer,
        .animated-weather-card.light-rain .rain-layer { opacity: 1; }
        .animated-weather-card.snowy .snow-layer,
        .animated-weather-card.snowy-rainy .snow-layer,
        .animated-weather-card.snowy-stormy .snow-layer { opacity: 1; }
        .animated-weather-card.sleety .sleet-layer,
        .animated-weather-card.sleety-stormy .sleet-layer { opacity: 1; }
        .animated-weather-card.windy .wind-layer { opacity: 1; }

        .animated-weather-card.individual-rain-active .rain-layer { opacity: 1; }
        .animated-weather-card.individual-snow-active .snow-layer { opacity: 1; }
        .animated-weather-card.individual-sleet-active .sleet-layer { opacity: 1; }
        .animated-weather-card.individual-wind-active .wind-layer { opacity: 1; }
        .animated-weather-card.individual-clouds-active .cloud-gsap { opacity: 1; }
        .animated-weather-card.individual-fog-active .fog-layer { opacity: 1; }
        .animated-weather-card.individual-stars-active .star-gsap,
        .animated-weather-card.individual-stars-active .moon-gsap { opacity: 1; }
        .animated-weather-card.individual-sun-active .sun { opacity: 1; }

        /* \u2500\u2500 Sun: a light source, not a disc \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .sun {
          position: absolute;
          top: 20%;
          left: 84%;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #fff3d6 34%, var(--weather-sun-primary) 70%, var(--weather-sun-secondary) 100%);
          box-shadow:
            0 0 18px 4px var(--weather-sun-glow),
            0 0 64px 18px var(--weather-sun-halo);
          opacity: 0;
          transition: opacity ${j/2}s ${re};
          animation: awcSunBreathe 9s ease-in-out infinite;
        }
        .sun::before {
          content: '';
          position: absolute;
          inset: -90%;
          border-radius: 50%;
          background: radial-gradient(circle, var(--weather-sun-glow) 0%, transparent 62%);
          opacity: 0.55;
          animation: awcSunCorona 7s ease-in-out infinite alternate;
        }
        /* The sun's height follows the time of day on a full-card track (a
           transform, so .sun keeps its breathing): low at dawn and dusk and
           below the horizon at night, so it sets downward and rises upward. */
        .sun-track {
          position: absolute;
          inset: 0;
          pointer-events: none;
          transition: transform ${j}s ${re};
        }
        .animated-weather-card[data-phase="dusk"] .sun-track,
        .animated-weather-card[data-phase="dawn"] .sun-track { transform: translateY(14%); }
        .animated-weather-card[data-phase="night"] .sun-track { transform: translateY(26%); }

        .animated-weather-card.sunny .sun { opacity: 1; }
        .animated-weather-card.partly-cloudy .sun { opacity: 0.85; }
        .animated-weather-card.rainy .sun,
        .animated-weather-card.snowy .sun,
        .animated-weather-card.stormy .sun,
        .animated-weather-card.windy .sun,
        .animated-weather-card.cloudy .sun,
        .animated-weather-card.foggy .sun,
        .animated-weather-card.snowy-rainy .sun,
        .animated-weather-card.clear-night .sun,
        .animated-weather-card[data-phase="night"] .sun {
          opacity: 0 !important;
        }
        /* animate: false is fully still: the light stays, the breathing stops */
        .animated-weather-card.static .sun,
        .animated-weather-card.static .sun::before { animation: none; }
        .animated-weather-card.theme-colors .sun { box-shadow: none !important; }
        .animated-weather-card.theme-colors .moon-gsap::before { display: none; }
        .animated-weather-card.theme-colors .sun {
          width: 32px;
          height: 32px;
          background: radial-gradient(circle, var(--weather-sun-primary) 0 62%, var(--weather-sun-secondary) 100%);
        }
        .animated-weather-card.theme-colors .sun::before { display: none; }

        @keyframes awcSunBreathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.04); }
        }
        @keyframes awcSunCorona {
          0% { transform: scale(0.96); opacity: 0.45; }
          100% { transform: scale(1.08); opacity: 0.65; }
        }

        /* \u2500\u2500 Lightning: the sky lights up from inside the cloud deck \u2500\u2500\u2500\u2500\u2500\u2500 */
        .lightning {
          position: absolute;
          inset: 0;
          opacity: 0;
          pointer-events: none;
          background:
            radial-gradient(110% 80% at 50% 0%, rgba(232, 238, 255, 0.62) 0%, rgba(214, 224, 255, 0.16) 55%, transparent 85%);
        }
        .lightning svg path {
          filter: drop-shadow(0 0 4px rgba(214, 228, 255, 0.95)) drop-shadow(0 0 14px rgba(170, 196, 255, 0.6));
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        .animated-weather-card.theme-colors .lightning {
          background: radial-gradient(110% 80% at 50% 0%, rgba(128, 128, 140, 0.2), transparent 80%);
        }

        /* \u2500\u2500 Stars and moon \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .stars-field { position: absolute; inset: 0; pointer-events: none; }
        .star-gsap {
          position: absolute;
          border-radius: 50%;
          background: white;
          pointer-events: none;
        }
        .star-gsap.twinkle { animation: awcTwinkle 5s ease-in-out infinite alternate; }
        @keyframes awcTwinkle {
          from { opacity: var(--star-o); }
          to { opacity: var(--star-dim); }
        }
        /* The moon takes the sun's place in the top-right, clear of the
           temperature: soft maria, a steady disc and a slowly breathing halo. */
        .moon-gsap {
          position: absolute;
          left: 84%;
          top: 20%;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background:
            radial-gradient(circle at 38% 40%, rgba(160, 166, 180, 0.28) 0 12%, transparent 13%),
            radial-gradient(circle at 62% 62%, rgba(160, 166, 180, 0.22) 0 9%, transparent 10%),
            radial-gradient(circle at 58% 32%, rgba(160, 166, 180, 0.16) 0 6%, transparent 7%),
            radial-gradient(circle at 34% 30%, #fbfaf4 0%, #ece8dc 55%, #cfcabc 100%);
          opacity: 0;
          pointer-events: none;
        }
        .moon-gsap::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: 0 0 16px 2px rgba(226, 232, 255, 0.28), 0 0 56px 12px rgba(190, 206, 255, 0.12);
          animation: awcMoonHalo 6s ease-in-out infinite alternate;
        }
        @keyframes awcMoonHalo {
          from { opacity: 0.7; }
          to { opacity: 1; }
        }
        .stars-field.paused .star-gsap,
        .moon-gsap.paused::before { animation-play-state: paused; }
        /* While the card is paused (hidden or off-screen) its CSS loops rest too */
        animated-weather-card[data-paused] .animated-weather-card *,
        animated-weather-card[data-paused] .animated-weather-card *::before {
          animation-play-state: paused !important;
        }

        /* \u2500\u2500 Particles \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .wind-swoosh-gsap { position: absolute; transform-origin: left center; }
        .leaf-gsap { position: absolute; border-radius: 0 100% 0 100%; transform-origin: center; }
        /* A full-width track carries each cloud; the track is what moves */
        .cloud-track { position: absolute; top: 0; left: 0; width: 100%; height: 0; will-change: transform; }
        .raindrop { position: absolute; pointer-events: none; }
        .rain-rebound {
          position: absolute;
          top: 0;
          left: 0;
          width: 1px;
          height: 1px;
          overflow: visible;
          opacity: 0;
          pointer-events: none;
        }
        .rain-rebound path { stroke-linecap: round; }
        .rain-splash {
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          opacity: 0;
          pointer-events: none;
        }
        .snowflake { position: absolute; border-radius: 50%; pointer-events: none; }

        /* \u2500\u2500 Planes (Flightradar24) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        /* Inside .animation-layer at z-index 5: in front of the sun, stars and
           moon, behind the clouds (their own layer above) and the text. */
        .planes-layer {
          position: absolute;
          inset: 0;
          z-index: 5;
          pointer-events: none;
          transition: opacity 0.3s var(--awc-ease);
        }
        .plane-gsap {
          position: absolute;
          top: 0;
          left: 0;
          color: var(--weather-plane-color, var(--weather-text-color, #fff));
          will-change: transform, opacity;
        }
        .plane-body { position: relative; line-height: 0; }
        .plane-svg {
          display: block;
          width: 100%;
          height: auto;
          opacity: 0.9;
          filter: drop-shadow(0 1px 2px rgba(6, 12, 28, 0.25));
        }
        /* At night a plane is its lights: the outline only faintly there.
           At dusk and dawn, with the sun just below the horizon, a plane up
           high is still in sunlight: it keeps its outline, lights on. */
        .animated-weather-card[data-phase="night"] .plane-gsap.night .plane-svg { opacity: 0.22; filter: none; }
        /* Its lights, where they are on the aircraft (aircraft.ts), in a
           fixed size whatever the plane's: steady red or green at the near
           wingtip, white strobes that flash twice, the red beacon on the
           belly, and white at the tail. A plane flying right shows its
           right side, whose wingtip is green; flying left, its red left. */
        .plane-light {
          position: absolute;
          width: 2px;
          height: 2px;
          margin: -1px 0 0 -1px;
          border-radius: 50%;
        }
        .plane-light.nav { background: #3ee07a; box-shadow: 0 0 3px 1px rgba(62, 224, 122, 0.7); }
        .plane-gsap.westbound .plane-light.nav { background: #ff4d40; box-shadow: 0 0 3px 1px rgba(255, 77, 64, 0.7); }
        .plane-light.tail { background: #f6f3ea; box-shadow: 0 0 2px rgba(246, 243, 234, 0.6); }
        .plane-light.strobe,
        .plane-light.beacon {
          width: 3px;
          height: 3px;
          margin: -1.5px 0 0 -1.5px;
          opacity: 0;
        }
        .plane-light.strobe {
          background: #fbfbff;
          box-shadow: 0 0 6px 2px rgba(251, 251, 255, 0.8);
          animation: planeStrobe 1.2s steps(1, end) infinite;
        }
        .plane-light.beacon {
          background: #ff3b30;
          box-shadow: 0 0 5px 1px rgba(255, 59, 48, 0.85);
          animation: planeBeacon 1s steps(1, end) infinite 0.35s;
        }
        @keyframes planeStrobe {
          0% { opacity: 1; }
          5% { opacity: 0; }
          13% { opacity: 1; }
          18%, 100% { opacity: 0; }
        }
        @keyframes planeBeacon {
          0% { opacity: 1; }
          12%, 100% { opacity: 0; }
        }
        /* A flight tracker's tag: beside the plane at fuselage height, on
           the open-sky side (right), so it adds no height to the plane */
        .plane-label {
          position: absolute;
          top: 50%;
          left: calc(100% + 6px);
          transform: translateY(-50%);
          font-size: 10px;
          font-weight: 600;
          line-height: 12px;
          letter-spacing: 0.04em;
          white-space: nowrap;
          color: var(--weather-text-color, #fff);
          opacity: 0.72;
          text-shadow: 0 1px 4px var(--weather-text-shadow);
          font-variant-numeric: tabular-nums;
        }

`;var ji={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function Ui(o,i){try{let e=o.formatEntityState?.(i);if(e&&e!==i.state)return e}catch{}return ji[i.state]||i.state}var Xi=180;function Jt(o,i){let e=i.note_entity?o?.states[i.note_entity]:void 0;if(!e)return null;let t=s=>typeof s=="string"?s.trim():"",a=e.state==="unknown"||e.state==="unavailable"?"":t(e.state),n=t(e.attributes?.[i.note_attribute||"note"]);if(!a&&!n)return null;let r=Date.parse(e.attributes?.generated_at);return{line:a||n,note:n||a,writtenAt:Number.isNaN(r)?null:r}}function Qt(o,i){let e=Number(i.note_max_age??Xi);return o.writtenAt===null||!(e>0)?null:o.writtenAt+e*6e4}function lt(o,i,e){if(i.dev_mode){let t=Zi(i,e);if(o&&i.sun_entity){let a=o.states[i.sun_entity];a&&(t.sun={sunrise:a.attributes.next_rising||null,sunset:a.attributes.next_setting||null,dawn:a.attributes.next_dawn||null,dusk:a.attributes.next_dusk||null,noon:a.attributes.next_noon||null,elevation:a.attributes.elevation??null,aboveHorizon:a.state==="above_horizon"})}return t}return o?Qi(o,i):{temperature:"--",weatherCondition:"",location:i.name||"",humidity:"--",pressure:"--",pressureValue:null,feelsLike:null,windSpeed:"--",windSpeedValue:0,windBearing:null,indoorTemperature:"--",indoorHumidity:"--"}}function Zi(o,i){let a=je[i||"sunny"]||"22",n=o.name||"",r=ee.humidity,s=ee.windSpeed,d=parseFloat(s.split(" ")[0])||15,l=ee.pressure,u=Ue[i||"sunny"]||i||"sunny",c=ee.indoorTemperature,p=ee.indoorHumidity,f=new Date,w=new Date(f.getFullYear(),f.getMonth(),f.getDate(),6,14),g=new Date(f.getFullYear(),f.getMonth(),f.getDate(),18,32),v=new Date(f.getFullYear(),f.getMonth(),f.getDate(),5,45),S=new Date(f.getFullYear(),f.getMonth(),f.getDate(),19,1),x=new Date(f.getFullYear(),f.getMonth(),f.getDate(),12,23),b=Date.now(),C={sunrise:w.toISOString(),sunset:g.toISOString(),dawn:v.toISOString(),dusk:S.toISOString(),noon:x.toISOString(),elevation:42.5,aboveHorizon:b>=w.getTime()&&b<=g.getTime()};return{temperature:a,weatherCondition:u,location:n,humidity:r,windSpeed:s,windSpeedValue:d,windBearing:null,pressure:l,pressureValue:null,feelsLike:null,indoorTemperature:c,indoorHumidity:p,sun:C}}var Ji={N:0,NNE:22.5,NE:45,ENE:67.5,E:90,ESE:112.5,SE:135,SSE:157.5,S:180,SSW:202.5,SW:225,WSW:247.5,W:270,WNW:292.5,NW:315,NNW:337.5};function Zt(o){let i=typeof o=="number"?o:typeof o=="string"?parseFloat(o):NaN;return isFinite(i)?(i%360+360)%360:typeof o=="string"?Ji[o.trim().toUpperCase()]??null:null}function Qi(o,i){if(!i.entity)throw new Error("Weather entity is required");let e=o.states[i.entity];if(!e)throw new Error(`Entity ${i.entity} not found`);let t;if(i.outdoor_sensor_entity){let y=o.states[i.outdoor_sensor_entity];y&&y.state&&!isNaN(parseFloat(y.state))?t=parseFloat(y.state):t=e.attributes.temperature}else t=e.attributes.temperature;let a=t!=null&&!isNaN(t)?q(Math.round(t),o):"--",n=Ui(o,e),r=i.name||e.attributes.friendly_name||"",s=y=>{let k=typeof y=="number"?y:parseFloat(y);return isFinite(k)?q(Math.round(k),o)+"%":null},d="--";if(i.humidity_sensor_entity){let y=o.states[i.humidity_sensor_entity];d=y&&s(y.state)||s(e.attributes.humidity)||"--"}else d=s(e.attributes.humidity)||"--";let l="--",h=10,u=(y,k)=>{let P=typeof y=="number"?y:parseFloat(y);return isFinite(P)?(h=St(P,k||"km/h"),l=q(Math.round(P),o)+" "+(k||"km/h"),!0):!1},c=i.wind_speed_sensor_entity?o.states[i.wind_speed_sensor_entity]:void 0;c&&u(c.state,c.attributes?.unit_of_measurement)||u(e.attributes.wind_speed,e.attributes.wind_speed_unit);let p=i.wind_direction_sensor_entity?o.states[i.wind_direction_sensor_entity]:void 0,f=Zt(p?.state)??Zt(e.attributes.wind_bearing),w=(y,k)=>{let P=typeof y=="number"?y:parseFloat(y);if(!isFinite(P))return null;let U=k.toLowerCase()==="inhg"?2:0;return q(P,o,U)+" "+k},g=y=>{let k=typeof y=="number"?y:parseFloat(y);return isFinite(k)?k:null},v="--",S=null;if(i.pressure_sensor_entity){let y=o.states[i.pressure_sensor_entity];if(y){let k=y.attributes.unit_of_measurement||"hPa",P=w(y.state,k);P&&(v=P,S=g(y.state))}if(v==="--"&&e.attributes.pressure!==void 0){let k=e.attributes.pressure_unit||"hPa";v=w(e.attributes.pressure,k)||"--",S=g(e.attributes.pressure)}}else if(e.attributes.pressure!==void 0){let y=e.attributes.pressure_unit||"hPa";v=w(e.attributes.pressure,y)||"--",S=g(e.attributes.pressure)}let x=null,b;if(i.feels_like_entity&&(b=o.states[i.feels_like_entity]?.state),b===void 0&&e.attributes.apparent_temperature!==void 0&&(b=e.attributes.apparent_temperature),b!==void 0){let y=typeof b=="number"?b:parseFloat(b);isFinite(y)&&(x=q(Math.round(y),o)+"\xB0")}let C="--";if(i.indoor_temperature_entity){let y=o.states[i.indoor_temperature_entity];y&&y.state&&!isNaN(parseFloat(y.state))&&(C=q(Math.round(parseFloat(y.state)),o)+"\xB0")}let _="--";if(i.indoor_humidity_entity){let y=o.states[i.indoor_humidity_entity];y&&y.state&&!isNaN(parseFloat(y.state))&&(_=q(Math.round(parseFloat(y.state)),o)+"%")}let E;if(i.sun_entity){let y=o.states[i.sun_entity];y&&(E={sunrise:y.attributes.next_rising||null,sunset:y.attributes.next_setting||null,dawn:y.attributes.next_dawn||null,dusk:y.attributes.next_dusk||null,noon:y.attributes.next_noon||null,elevation:y.attributes.elevation??null,aboveHorizon:y.state==="above_horizon"})}return{temperature:a,weatherCondition:n,location:r,humidity:d,windSpeed:l,windSpeedValue:h,windBearing:f,pressure:v,pressureValue:S,feelsLike:x,indoorTemperature:C,indoorHumidity:_,sun:E}}var dt={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota"}};function fe(o){return o?.locale?.language||o?.language||"en"}function le(o){return`${fe(o)}|${o?.locale?.time_format??""}`}function F(o,i,e={}){let t=fe(o).toLowerCase();return(dt[t]?.[i]??dt[t.split("-")[0]]?.[i]??dt.en[i]).replace(/\{(\w+)\}/g,(n,r)=>e[r]??"")}function en(o){let i=o?.locale;if(!i?.time_format)return;if(i.time_format==="12")return!0;if(i.time_format==="24")return!1;let e=i.time_format==="language"?fe(o):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(e).includes("10")}catch{return}}function Z(o,i){if(!o)return"--";let e=new Date(o);if(isNaN(e.getTime()))return"--";let t=en(i),a={hour:"numeric",minute:"2-digit"};t!==void 0&&(a.hourCycle=t?"h12":"h23");try{return new Intl.DateTimeFormat(i?fe(i):void 0,a).format(e)}catch{return e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function ct(o,i){let e=Math.round(Math.abs(o)*60),t=Math.floor(e/60),a=e%60,n=Intl.DurationFormat;if(n&&i)try{return new n(fe(i),{style:"narrow"}).format(t>0?{hours:t,minutes:a}:{minutes:a})}catch{}return t>0?`${t}h ${a}m`:`${a}m`}function we(o,i){let e=o.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return e?`${A(e[1])}<span class="${i}">${A(e[2])}</span>`:A(o)}var ei=/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i;function ti(o){let i=o.color_palette||"default",e=o.custom_colors||{},t="";if(i!=="theme"){let n=h=>{if(typeof h!="string"||!ei.test(h))return null;let u=h.replace("#","");u.length===3&&(u=u[0]+u[0]+u[1]+u[1]+u[2]+u[2]);let c=parseInt(u,16);return{r:c>>16&255,g:c>>8&255,b:c&255}},r=(h,u,c)=>"#"+(h<<16|u<<8|c).toString(16).padStart(6,"0"),s=(h,u)=>{let c=n(h);if(!c)return h;let p=1-u/100;return r(Math.max(0,Math.floor(c.r*p)),Math.max(0,Math.floor(c.g*p)),Math.max(0,Math.floor(c.b*p)))},d=(h,u)=>{let c=n(h);if(!c)return h;let p=u/100;return r(Math.min(255,Math.floor(c.r+(255-c.r)*p)),Math.min(255,Math.floor(c.g+(255-c.g)*p)),Math.min(255,Math.floor(c.b+(255-c.b)*p)))},l=(h,u)=>{let c=e[h];if(!c||typeof c!="string"||!ei.test(c))return;let p=d(c,12),f=s(c,22);t+=`--weather-${u}-background: linear-gradient(180deg, transparent 40%, rgba(6, 12, 28, 0.38) 100%), linear-gradient(180deg, ${p} 0%, ${c} 55%, ${f} 100%); `};l("sunny_bg","sunny"),l("rainy_bg","rainy"),l("snowy_bg","snowy"),l("stormy_bg","stormy"),l("windy_bg","windy"),l("cloudy_bg","cloudy")}let a=(n,r)=>{n&&Xe(n)&&(t+=r.replace("${value}",n))};return a(e.text_color,"--weather-text-color: ${value} !important; "),a(e.sun_color,"--weather-sun-primary: ${value} !important; --weather-sun-secondary: ${value} !important; "),a(e.rain_color,"--weather-rain-color: ${value} !important; "),a(e.snow_color,"--weather-snow-color: ${value} !important; "),t}var tn={new_moon:"New Moon",waxing_crescent:"Waxing Crescent",first_quarter:"First Quarter",waxing_gibbous:"Waxing Gibbous",full_moon:"Full Moon",waning_gibbous:"Waning Gibbous",last_quarter:"Last Quarter",waning_crescent:"Waning Crescent"};function nn(o){return`mdi:moon-${o.replace(/_moon$/,"").replace(/_/g,"-")}`}var J=1e3,Be=300,an={horizon:196,peak:34,trough:276,twilightRy:78},on={horizon:200,peak:96,trough:262,twilightRy:44},rn=124,ii=16;function sn(o,i){if(o<1)return 1;let e=Math.max(2,Math.floor((i+ii)/(rn+ii))),t=Math.ceil(o/e);return Math.ceil(o/t)}function ai(o,i,e){let t=e-i;if(t<=0||t>=24)return 0;if(o>=i&&o<=e)return Math.sin(Math.PI*(o-i)/t);let a=((o-e)%24+24)%24;return-Math.sin(Math.PI*a/(24-t))}var Ve=o=>o/24*J,oi=(o,i)=>o>=0?i.horizon-o*(i.horizon-i.peak):i.horizon-o*(i.trough-i.horizon);function ln(o,i,e){let t=[];for(let a=0;a<=240;a++){let n=a/10;t.push(`${Ve(n).toFixed(1)},${oi(ai(n,o,i),e).toFixed(1)}`)}return"M"+t.join(" L")}function qe(o){if(!o)return 0;let i=new Date(o);return isNaN(i.getTime())?0:i.getHours()+i.getMinutes()/60+i.getSeconds()/3600}var dn=o=>we(o,"st-ampm");He();var ni=z(N(ae)),cn=`
${ge("")}
    :host {
        display: block;
        height: 100%;
        --st-font: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
        --st-font-display: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
    }

    ha-card {
        height: 100%;
        overflow: hidden;
    }
    ha-card.sky {
        background: none;
        border-color: transparent;
    }

    .st-card {
        position: relative;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 220px;
        padding: 20px;
        gap: 14px;
        container: st / inline-size;
        font-family: var(--st-font);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--st-text);
        --st-text: var(--primary-text-color);
        --st-secondary: var(--secondary-text-color);
        --st-secondary-opacity: 1;
        /* Theme palette: the headline time and the day's arc in the theme's
           primary color, with a faint tint of it under the arc (an amber
           fill turns muddy on dark themes), icons in its icon color, and no
           twilight glows */
        --st-path: var(--primary-color);
        --st-path-night: var(--secondary-text-color);
        --st-horizon: var(--divider-color, rgba(0, 0, 0, 0.12));
        --st-icon: var(--state-icon-color, var(--primary-color));
        --st-hero: var(--primary-color, var(--primary-text-color));
        --st-day-fill: var(--primary-color);
        --st-day-fill-opacity: 0.08;
        --st-twilight: var(--state-sun-above_horizon-color, #ffb300);
        --st-twilight-opacity: 0;
    }

    /* Colorized: the card's sky follows the sun */
    .st-card.sky {
        --st-text: ${ni};
        --st-secondary: ${ni};
        --st-secondary-opacity: ${Pe};
        --st-path: rgba(255, 232, 180, 0.95);
        --st-path-night: rgba(214, 224, 255, 0.4);
        --st-horizon: rgba(255, 255, 255, 0.3);
        --st-day-fill: #ffd98a;
        --st-day-fill-opacity: 0.22;
        --st-twilight: #ffb98a;
        --st-twilight-opacity: 0.38;
        background:
            ${oe(Le,"var(--awc-sky-glow)")},
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
        text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
        /* Same registered colors and curve as the weather card's sky */
        transition: ${rt.map(o=>`${o} ${j}s ${re}`).join(", ")};
    }

    /* \u2500\u2500 Headline: the next sunrise or sunset \u2500\u2500 */
    .st-hero {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        flex-shrink: 0;
        min-width: 0;
    }
    .st-title {
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        letter-spacing: -0.01em;
        margin-bottom: 6px;
        opacity: 0.94;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .st-eyebrow,
    .st-metric-label {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    /* Long labels (German "Sonnenh\xF6chststand") end in an ellipsis rather
       than running into the next column; the full word is in the title */
    .st-metric-label { min-width: 0; }
    .st-metric-label > span {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-eyebrow ha-icon,
    .st-metric-label ha-icon {
        --mdc-icon-size: 13px;
        /* Optical: centred on the capitals of the uppercase label */
        margin-top: -0.5px;
        flex-shrink: 0;
    }
    .st-time {
        margin: 6px 0 0 -0.04em;
        font-family: var(--st-font-display);
        font-size: 52px;
        font-weight: 250;
        line-height: 0.95;
        letter-spacing: -0.035em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
    }
    .st-ampm {
        font-size: 0.42em;
        font-weight: 500;
        letter-spacing: 0.02em;
        margin-left: 0.32em;
    }
    .st-countdown {
        margin-top: 6px;
        font-size: 15px;
        line-height: 20px;
        font-variant-numeric: tabular-nums;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }

    /* \u2500\u2500 Sun path \u2500\u2500 */
    .st-chart {
        position: relative;
        flex: 1 1 auto;
        min-height: 64px;
        /* The path stretches to the chart, so cap its height: the arc keeps
           the same gentle shape in a tall frame instead of becoming a peak */
        max-height: 96px;
        margin: auto -20px;
    }
    .st-chart svg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: visible;
    }
    .st-path-day,
    .st-path-night {
        fill: none;
        stroke-width: 2.25;
        stroke-linecap: round;
        stroke-linejoin: round;
        vector-effect: non-scaling-stroke;
    }
    .st-path-day { stroke: var(--st-path); }
    .st-path-night { stroke: var(--st-path-night); stroke-dasharray: 2 5; }
    .st-day-fill { fill: var(--st-day-fill); opacity: var(--st-day-fill-opacity); }
    .st-twilight { opacity: var(--st-twilight-opacity); }
    .st-horizon {
        stroke: var(--st-horizon);
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
    }
    .st-now-line {
        stroke: var(--st-horizon);
        stroke-width: 1;
        stroke-dasharray: 2 4;
        vector-effect: non-scaling-stroke;
    }

    /* The sun (or the moon, when it's below the horizon) at this moment */
    .st-dot {
        position: absolute;
        width: 14px;
        height: 14px;
        margin: -7px 0 0 -7px;
        border-radius: 50%;
        background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #ffe3a3 55%, #ffb547 100%);
        box-shadow: 0 0 10px 3px rgba(255, 200, 110, 0.55), 0 0 30px 10px rgba(255, 200, 110, 0.22);
    }
    .st-dot.below {
        width: 10px;
        height: 10px;
        margin: -5px 0 0 -5px;
        background: radial-gradient(circle at 40% 40%, #ffffff 0%, #dfe6f5 70%, #b9c3d8 100%);
        box-shadow: 0 0 10px 2px rgba(200, 214, 255, 0.35);
    }
    /* Theme palette: a flat sun in Home Assistant's sun color, like the
       weather card's. Below the horizon it takes the night path's color:
       HA's indigo for a set sun is too faint on dark themes. */
    .st-card:not(.sky) .st-dot {
        box-shadow: none;
        background: var(--state-sun-above_horizon-color, #ffc107);
    }
    .st-card:not(.sky) .st-dot.below {
        background: var(--st-path-night);
    }
    .st-card:not(.sky) .st-eyebrow ha-icon,
    .st-card:not(.sky) .st-metric-label ha-icon {
        color: var(--st-icon);
    }
    /* The headline time is the tracker's hero, like the weather card's temperature */
    .st-card:not(.sky) .st-time {
        color: var(--st-hero);
    }

    /* \u2500\u2500 Facts \u2500\u2500 */
    .st-metrics {
        position: relative;
        display: grid;
        /* The column count comes from _fit (detailColumns) */
        grid-template-columns: repeat(var(--st-cols, 2), minmax(0, 1fr));
        gap: 14px 16px;
        padding-top: 14px;
        flex-shrink: 0;
    }
    .st-metrics::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        opacity: 0.2;
    }
    .st-card:not(.sky) .st-metrics::before {
        background: var(--divider-color, rgba(0, 0, 0, 0.12));
        opacity: 1;
    }
    .st-metric {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 0;
    }
    .st-metric-value {
        font-size: 16px;
        font-weight: 500;
        line-height: 21px;
        letter-spacing: -0.012em;
        font-variant-numeric: tabular-nums;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .st-metric-value .st-ampm { font-size: 0.7em; margin-left: 0.24em; }
    /* Moon phase names are long; let them wrap rather than truncate */
    .st-metric-value.wrap {
        white-space: normal;
        text-wrap: balance;
    }

    /* Fit to the frame, stepped down until nothing overflows (see _fit) */
    .st-card[data-fit="compact"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="compact"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="first-light"],
    .st-card[data-fit="short"] .st-metric[data-kind="last-light"],
    .st-card[data-fit="short"] .st-countdown,
    .st-card[data-fit="tight"] .st-countdown,
    .st-card[data-fit="tight"] .st-metrics { display: none; }
    .st-card[data-fit="short"] .st-time,
    .st-card[data-fit="tight"] .st-time { font-size: 40px; }
    .st-card[data-fit="short"],
    .st-card[data-fit="tight"] { gap: 10px; }
    .st-card[data-fit="short"] .st-chart,
    .st-card[data-fit="tight"] .st-chart { min-height: 44px; }

    @container st (max-width: 299px) {
        .st-time { font-size: 44px; }
        .st-metric-value { font-size: 16px; }
    }
    @container st (min-width: 460px) {
        .st-time { font-size: 60px; }
        .st-metric-value { font-size: 18px; line-height: 24px; }
    }

    /* \u2500\u2500 Compact: the next sunrise or sunset beside the sun's day \u2500\u2500
       One line, built to sit under a weather card: same left edge and
       label style, the time a quiet step down from the temperature. */
    .st-card.compact {
        flex-direction: row;
        align-items: center;
        gap: 20px;
        min-height: 0;
        padding: 16px 20px;
    }
    /* Under a weather card the real sun is just above, so no second light
       source: the sky's gradient and scrim only */
    .st-card.sky.compact {
        /* From the sky's mid tone down: under a weather card it reads as
           the lower sky, not a brighter strip below a darker card */
        background:
            linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
            linear-gradient(180deg, var(--awc-sky-mid) 0%, var(--awc-sky-bottom) 100%);
        --st-twilight-opacity: 0.3;
    }
    .st-card.compact .st-hero { flex: 0 0 auto; }
    .st-card.compact .st-time { font-size: 34px; margin-top: 5px; }
    .st-card.compact .st-countdown { margin-top: 5px; font-size: 13px; line-height: 18px; }
    .st-card.compact .st-chart {
        flex: 1 1 auto;
        align-self: stretch;
        max-height: none;
        /* Full height of the card, out to its right edge */
        margin: -16px -20px -16px 0;
        /* The path fades in beside the headline instead of starting at a hard edge */
        -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 36px);
        mask-image: linear-gradient(90deg, transparent 0, #000 36px);
    }
    .st-card.compact[data-fit] .st-chart { min-height: 0; }
    /* The other event, small, in the open sky at the top-right */
    .st-chart-note {
        position: absolute;
        top: 14px;
        right: 20px;
        font-size: 11px;
        font-weight: 600;
        line-height: 14px;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        white-space: nowrap;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
    .st-chart-note .st-chart-note-time {
        margin-left: 4px;
        font-weight: 500;
        letter-spacing: 0;
        text-transform: none;
        font-variant-numeric: tabular-nums;
    }
    .st-chart-note .st-ampm { font-size: 1em; margin-left: 0.2em; font-weight: 500; }
    @container st (max-width: 419px) {
        .st-chart-note { display: none; }
    }
    /* Short frames (a one-row section): the countdown goes, then the label */
    .st-card.compact[data-fit="short"],
    .st-card.compact[data-fit="tight"] { gap: 16px; }
    .st-card.compact[data-fit="short"] .st-time,
    .st-card.compact[data-fit="tight"] .st-time { font-size: 28px; }
    .st-card.compact[data-fit="tight"] .st-eyebrow { display: none; }
    .st-card.compact[data-fit="tight"] { padding-block: 12px; }
    .st-card.compact[data-fit="tight"] .st-chart { margin-block: -12px; }
    .st-card.compact[data-fit="tight"] .st-time { margin-top: 0; }

    .st-no-data {
        margin: auto;
        text-align: center;
        font-size: 14px;
        line-height: 20px;
        color: var(--st-secondary);
        opacity: var(--st-secondary-opacity);
    }
`,ht=class extends HTMLElement{constructor(){super();this.config={};this.n=this.attachShadow({mode:"open"})}setConfig(e){if(!e.sun_entity)throw new Error("Please define a sun_entity (e.g. sun.sun)");this.config={...e},this.i()}set hass(e){let t=this.config.sun_entity||"",a=this.config.moon_entity||"",n=this.e?.states[t],r=e.states[t],s=this.e?.states[a]?.state,d=e.states[a]?.state,l=le(this.e)!==le(e),h=this.config.weather_entity||"",u=h&&this.e?.states[h]?.state!==e.states[h]?.state;this.e=e;let c=n?.attributes?.elevation,p=r?.attributes?.elevation;(!n||n.state!==r?.state||n.attributes?.next_rising!==r?.attributes?.next_rising||n.attributes?.next_setting!==r?.attributes?.next_setting||Math.abs((c||0)-(p||0))>=.5||a&&s!==d||l||u)&&this.i()}connectedCallback(){this.a||(this.a=setInterval(()=>this.i(),6e4)),!this.o&&typeof ResizeObserver<"u"&&(this.o=new ResizeObserver(()=>this.f()),this.o.observe(this))}disconnectedCallback(){this.a&&clearInterval(this.a),this.a=void 0,this.o?.disconnect(),this.o=void 0}f(){let e=this.n.querySelector(".st-card");if(!e)return;let t=e.querySelector(".st-metrics");for(let a of["regular","compact","short","tight"]){if(e.dataset.fit=a,t){let n=Array.from(t.children).filter(r=>getComputedStyle(r).display!=="none").length;t.style.setProperty("--st-cols",String(sn(n,t.clientWidth)))}if(e.scrollHeight<=e.clientHeight+1)return}}getCardSize(){return this.config.compact?2:6}getGridOptions(){return this.config.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:{columns:12,rows:6,min_columns:6,min_rows:3}}C(e){let t=this.config.weather_entity,a=t?this.e?.states[t]?.state:void 0;if(a&&a!=="unavailable"&&a!=="unknown"){let n=xe(a,!1,void 0,void 0,this.e?.config?.time_zone);if(ot.includes(n))return n}return e==="night"?"clear-night":"sunny"}static getConfigElement(){return document.createElement("animated-sun-tracker-editor")}static getStubConfig(){return{sun_entity:"sun.sun",moon_entity:"sensor.moon_phase"}}A(){if(!this.e||!this.config.sun_entity)return null;let e=this.e.states[this.config.sun_entity];return e?{sunrise:e.attributes.next_rising||null,sunset:e.attributes.next_setting||null,dawn:e.attributes.next_dawn||null,dusk:e.attributes.next_dusk||null,noon:e.attributes.next_noon||null,elevation:typeof e.attributes.elevation=="number"?e.attributes.elevation:null,aboveHorizon:e.state==="above_horizon",rising:!!e.attributes.rising}:null}T(){if(!this.e||!this.config.moon_entity)return null;let e=this.e.states[this.config.moon_entity];if(!e)return null;let t=e.state,a;try{a=this.e.formatEntityState?.(e)}catch{}return{phase:t,phaseName:(a&&a!==t?a:void 0)||tn[t]||t.replace(/_/g," ").replace(/\b\w/g,n=>n.toUpperCase()),icon:nn(t)}}i(){let e=this.A(),t=this.T(),a=this.config.color_palette!=="theme";if(!e||!e.sunrise||!e.sunset){this.w('<div class="st-no-data">No sun data yet.<br>Choose a sun entity, usually sun.sun.</div>',null);return}let n=new Date,r=n.getHours()+n.getMinutes()/60,s=qe(e.sunrise),d=qe(e.sunset),l=e.dawn?qe(e.dawn):Math.max(0,s-.5),h=e.dusk?qe(e.dusk):Math.min(24,d+.5),u=d-s,c=e.aboveHorizon,p=c?e.sunset:e.sunrise,f=new Date(p).getTime()-n.getTime(),w=this.e,g=X=>A(F(w,X)),v=X=>dn(Z(X,w)),S=f>0?F(w,"in_duration",{duration:ct(f/36e5,w)}):"",x=$e(e.elevation,e.rising,e.aboveHorizon),b=pe(this.C(x),x),C=a?{"--awc-sky-top":b.top,"--awc-sky-mid":b.mid,"--awc-sky-bottom":b.bottom,"--awc-sky-glow":b.glow,"--awc-sky-scrim":b.scrim}:null,_=this.config.compact?on:an,E=ln(s,d,_),y=`${E} L${J},${_.horizon} L0,${_.horizon} Z`,k=ai(r,s,d),P=r/24*100,U=oi(k,_)/Be*100,R=(X,Ke)=>{let be=Math.max(70,Math.abs(Ke)/24*J*2.4);return`<ellipse cx="${Ve(X).toFixed(1)}" cy="${_.horizon}" rx="${be.toFixed(1)}" ry="${_.twilightRy}" fill="url(#twilight)" class="st-twilight"/>`},$=!!this.config.compact,H=this.config.show_header!==!1,ye=H?`
            <div class="st-hero">
                ${this.config.title&&!$?`<div class="st-title">${A(this.config.title)}</div>`:""}
                <div class="st-eyebrow">
                    <ha-icon icon="${c?"mdi:weather-sunset-down":"mdi:weather-sunset-up"}"></ha-icon>
                    <span>${g(c?"sunset":"sunrise")}</span>
                </div>
                <div class="st-time">${v(p)}</div>
                ${S?`<div class="st-countdown">${A(S)}</div>`:""}
            </div>`:this.config.title&&!$?`<div class="st-hero"><div class="st-title">${A(this.config.title)}</div></div>`:"",O=(X,Ke,be,ci,hi=!1)=>`
                <div class="st-metric" data-kind="${X}">
                    <div class="st-metric-label"><ha-icon icon="${Ke}"></ha-icon><span title="${be}">${be}</span></div>
                    <div class="st-metric-value${hi?" wrap":""}">${ci}</div>
                </div>`,G=!$&&this.config.show_details!==!1,de=$&&H?`
                        <div class="st-chart-note">${g(c?"sunrise":"sunset")}<span class="st-chart-note-time">${v(c?e.sunrise:e.sunset)}</span></div>`:"",Ye=G?`
            <div class="st-metrics">
                ${c?O("sunrise","mdi:weather-sunset-up",g("sunrise"),v(e.sunrise)):O("sunset","mdi:weather-sunset-down",g("sunset"),v(e.sunset))}
                ${O("noon","mdi:white-balance-sunny",g("solar_noon"),v(e.noon))}
                ${O("daylight","mdi:timer-sand",g("daylight"),A(ct(u,w)))}
                ${O("first-light","mdi:weather-sunset",g("first_light"),v(e.dawn))}
                ${O("last-light","mdi:weather-night",g("last_light"),v(e.dusk))}
                ${t?O("moon",t.icon,g("moon"),A(t.phaseName),!0):""}
            </div>`:"",B=this.config.sun_entity?w?.states[this.config.sun_entity]:void 0,Q="";try{Q=B&&w?.formatEntityState?.(B)||""}catch{}let di=[`${F(w,"sunrise")} ${Z(e.sunrise,w)}`,`${F(w,"sunset")} ${Z(e.sunset,w)}`,Q].filter(Boolean).join(" \xB7 ");this.w(`
                    ${ye}
                    <div class="st-chart" role="img" aria-label="${A(di)}">
                        <svg viewBox="0 0 ${J} ${Be}" preserveAspectRatio="none" aria-hidden="true">
                            <defs>
                                <radialGradient id="twilight">
                                    <stop offset="0" style="stop-color: var(--st-twilight); stop-opacity: 1"/>
                                    <stop offset="1" style="stop-color: var(--st-twilight); stop-opacity: 0"/>
                                </radialGradient>
                                <clipPath id="above"><rect x="0" y="0" width="${J}" height="${_.horizon}"/></clipPath>
                                <clipPath id="below"><rect x="0" y="${_.horizon}" width="${J}" height="${Be-_.horizon}"/></clipPath>
                            </defs>
                            ${R(s,s-l)}
                            ${R(d,h-d)}
                            <path d="${y}" class="st-day-fill" clip-path="url(#above)"/>
                            <line x1="0" y1="${_.horizon}" x2="${J}" y2="${_.horizon}" class="st-horizon"/>
                            <line x1="${Ve(r).toFixed(1)}" y1="0" x2="${Ve(r).toFixed(1)}" y2="${Be}" class="st-now-line"/>
                            <path d="${E}" class="st-path-night" clip-path="url(#below)"/>
                            <path d="${E}" class="st-path-day" clip-path="url(#above)"/>
                        </svg>
                        <div class="st-dot ${k<0?"below":""}" style="left: ${P.toFixed(2)}%; top: ${U.toFixed(2)}%;"></div>${de}
                    </div>
                    ${Ye}`,C)}w(e,t){let a=this.n.querySelector(".st-card");a||(this.n.innerHTML=`<style>${cn}</style><ha-card><div class="st-card"></div></ha-card>`,a=this.n.querySelector(".st-card"));let n=!!t;a.classList.toggle("sky",n),a.classList.toggle("compact",!!this.config.compact),a.parentElement?.classList.toggle("sky",n);for(let r of rt)t?a.style.setProperty(r,t[r]):a.style.removeProperty(r);a.innerHTML=e,this.f()}},hn=`
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
`,ut=class extends HTMLElement{constructor(){super(...arguments);this.t={};this.d=!1}setConfig(e){this.t={...e},this.d&&this.i()}set hass(e){this.e=e,this.d&&this.isConnected&&this.c()}async connectedCallback(){this.t=this.t||{},await this.k(),this.i(),this.d=!0,this.e&&this.c()}disconnectedCallback(){this.innerHTML=""}async k(){if(!customElements.get("ha-entity-picker"))try{let t=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),a=n=>{(n.reason?.message?.includes("localize")||n.reason?.message?.includes("hass"))&&n.preventDefault()};window.addEventListener("unhandledrejection",a);try{await t.constructor.getConfigElement()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",a),2e3)}catch{}}i(){let e=this.t,t=(a,n,r,s)=>`
                    <label class="st-switch" for="${a}">
                        <span>${n}<small>${r}</small></span>
                        <ha-switch id="${a}" ${s?"checked":""}></ha-switch>
                    </label>`;this.innerHTML=`
            <style>${hn}</style>
            <div class="st-editor">
                <ha-entity-picker id="sun-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="moon-picker" allow-custom-entity></ha-entity-picker>
                <ha-entity-picker id="weather-picker" allow-custom-entity></ha-entity-picker>
                ${xt({id:"title",label:"Title (optional)",value:e.title})}
                <div class="st-switches">
                    ${t("compact","Compact","One line: the next sunrise or sunset beside the sun's path",!!e.compact)}
                    ${t("show_header","Next sunrise or sunset","The headline time and countdown",e.show_header!==!1)}
                    ${t("show_details","Details","First and last light, solar noon, daylight, moon",e.show_details!==!1)}
                    ${t("theme_palette","Blend with dashboard theme","Use theme colors instead of the sky",e.color_palette==="theme")}
                </div>
            </div>
        `,this.c(),this._()}c(){let e=[{id:"#sun-picker",value:this.t.sun_entity||"",label:"Sun entity",domains:["sun"]},{id:"#moon-picker",value:this.t.moon_entity||"",label:"Moon phase entity (optional)",domains:["sensor"]},{id:"#weather-picker",value:this.t.weather_entity||"",label:"Share the sky of a weather entity (optional)",domains:["weather"]}];for(let t of e){let a=this.querySelector(t.id);a&&(this.e&&(a.hass=this.e),a.value=t.value,a.label=t.label,a.includeDomains=t.domains)}}_(){this.querySelector("#sun-picker")?.addEventListener("value-changed",t=>{this.s({sun_entity:t.detail.value})}),this.querySelector("#moon-picker")?.addEventListener("value-changed",t=>{this.s({moon_entity:t.detail.value||void 0})}),this.querySelector("#weather-picker")?.addEventListener("value-changed",t=>{this.s({weather_entity:t.detail.value||void 0})}),this.querySelector("#title")?.addEventListener("input",t=>{this.s({title:t.target.value||void 0})});let e=(t,a)=>{this.querySelector(`#${t}`)?.addEventListener("change",n=>{this.s(a(n.target.checked))})};e("compact",t=>({compact:t||void 0})),e("show_header",t=>({show_header:t})),e("show_details",t=>({show_details:t})),e("theme_palette",t=>({color_palette:t?"theme":void 0}))}s(e){let t={...this.t,...e};for(let a of Object.keys(t))(t[a]===void 0||t[a]==="")&&delete t[a];this.t=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this.t},bubbles:!0,composed:!0}))}};customElements.define("animated-sun-tracker-card",ht);customElements.define("animated-sun-tracker-editor",ut);window.customCards=window.customCards||[];window.customCards.push({type:"animated-sun-tracker-card",name:"Animated Sun Tracker",description:"The sun's path through the day with the next sunrise or sunset, first and last light, solar noon, daylight and moon phase",preview:!1,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card"});He();var ri=o=>`Wind from ${Math.round(o)}\xB0`,si=o=>o==="rising"?"mdi:arrow-top-right":"mdi:arrow-bottom-right",mt=o=>o?"mdi:weather-sunset-down":"mdi:weather-sunset-up",un=18,mn=450,pn=1600,gn=400,fn=120,wn=220,yn=24;Ct(wt).catch(o=>{console.warn(`Animated Weather Card: GSAP unavailable \u2014 animations disabled. ${o.message}`)});var li=["regular","compact","short","tight","minimal"],bn=[["regular","long"],["close","long"],["regular","line"],["snug","line"],...li.map(o=>[o,"none"])],W=class W extends HTMLElement{constructor(){super(...arguments);this.v=!0;this.isInitializing=!1;this.pendingTimeouts=[];this.animationsPaused=!1;this.currentWeatherClass="";this.wasManuallyPaused=!1;this.h=!1;this.currentWindSpeedValue=10;this.devTimeOverride=!1;this.u=0;this.visibilityChangeHandler=null;this.windowFocusHandler=null;this.windowBlurHandler=null;this.tabHidden=!1;this.offscreen=!1;this.windowBlurred=!1;this.heroTextPending=new WeakMap;this.planesWanted=!1;this.flightTracker=new Re;this.writtenNote=null;this.noteComing=!1}static getStubConfig(){return gt}static get properties(){return{hass:{},config:{}}}setConfig(e){if(!e.entity&&!e.dev_mode)throw new Error("You need to define an entity or enable dev mode");let t=n=>n===void 0||typeof n=="number"&&isFinite(n)&&n>=0&&n<=23;if(!t(e.sunrise_hour))throw new Error(`sunrise_hour must be a number between 0 and 23 (got ${e.sunrise_hour})`);if(!t(e.sunset_hour))throw new Error(`sunset_hour must be a number between 0 and 23 (got ${e.sunset_hour})`);let a=this.config?.auto_pause;if(this.config?.flights_entity!==e.flights_entity&&(this.flightTracker.reset(),this.lastFlightsState=void 0),this.config=e,this.isConnected){this.initializeTimeOfDayManager();let n=this.animationController;this.u++,this.animationController=new se(this,this.config,()=>this.animationsPaused,this.timeOfDayManager),n&&n.stopAllAnimations().catch(r=>m(this.config?.dev_mode,"Error stopping previous animation controller:",r))}this.isConnected&&(this.noteWriter?.stop(),this.noteWriter=void 0,this.writtenNote=null,this.noteComing=!1,this.mountNoteWriter()),this.isConnected&&!!e.auto_pause!=!!a&&(this.removeVisibilityTracking(),this.setupVisibilityTracking())}connectedCallback(){if(this.style.position="relative",this.style.display="block",this.style.height="100%",!this.resizeObserver&&typeof ResizeObserver<"u"&&(this.resizeObserver=new ResizeObserver(()=>{this.applySizeState(),this.devPanel?.isOpen&&this.devPanel.dock()}),this.resizeObserver.observe(this),document.fonts?.ready.then(()=>this.applySizeState()).catch(()=>{})),!this.v&&this.querySelector(".animated-weather-card")){this.config&&(this.initializeTimeOfDayManager(),this.animationController||(this.animationController=new se(this,this.config,()=>this.animationsPaused,this.timeOfDayManager))),this.attachEventListeners(),this.setupVisibilityTracking(),this.p(),this.initializeAnimations();return}this.config&&(this.initializeTimeOfDayManager(),this.animationController=new se(this,this.config,()=>this.animationsPaused,this.timeOfDayManager)),this.v=!1,this.render(),this.setupVisibilityTracking(),this.initializeAnimations(),requestAnimationFrame(()=>{let t=this.querySelector(".animated-weather-card");t&&(t.classList.remove("no-transitions"),t.classList.add("transitions-enabled"))})}render(){if(!this.config||!this.hass&&!this.config.dev_mode)return;Je(this),this.stopPlanes();let e=this.config.color_palette||"default",t;try{t=lt(this.hass,this.config,this.currentDevCondition)}catch($){let H=$?.message||"Error loading weather data";this.innerHTML=`
              <ha-card>
                <div class="awc-empty-state" role="status">
                  <ha-icon class="awc-empty-icon" icon="mdi:weather-cloudy-alert"></ha-icon>
                  <div class="awc-empty-title">Animated Weather Card</div>
                  <div class="awc-empty-message">${A(H)}</div>
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
            `;return}let{temperature:a,weatherCondition:n,location:r,humidity:s,windSpeed:d,windSpeedValue:l,windBearing:h,pressure:u,pressureValue:c,feelsLike:p,indoorTemperature:f,indoorHumidity:w,sun:g}=t,v=this.updatePressureTrend(c);this.currentWindSpeedValue=l;let S=g?.aboveHorizon??!1,x=g?Z(S?g.sunset:g.sunrise,this.e):"--",b=this.config.show_sun!==!1&&!!g&&x!=="--",C=!!this.config.compact,_=ti(this.config),E=this.config.show_attribute_icons!==!1,y=this.config.show_attribute_labels!==!1,k=($,H,ye,O,G="")=>{let de=E||y?`<div class="attribute-label">${E?`<ha-icon class="attribute-icon" icon="${H}"></ha-icon>`:""}${y?`<span>${A(ye)}</span>`:""}</div>`:"";return`<div class="attribute" data-kind="${$}">${de}<div class="attribute-value"><span class="attribute-text">${O}</span>${G}</div></div>`},P=typeof h=="number"?`<ha-icon class="wind-bearing-arrow" icon="mdi:navigation" style="transform: rotate(${h+180}deg);" aria-label="${ri(h)}"></ha-icon>`:"",U=v?`<ha-icon class="pressure-trend ${v}" icon="${si(v)}" aria-label="Pressure ${v}"></ha-icon>`:"",R=this.config.show_attributes!==!1?`
              <div class="weather-attributes${y?"":" values-only"}">${[k("humidity","mdi:water-percent",ve(this.e,"ui.card.weather.attributes.humidity","Humidity"),A(s)),k("wind","mdi:weather-windy",ve(this.e,"ui.card.weather.attributes.wind_speed","Wind"),A(d),P),k("pressure","mdi:gauge",ve(this.e,"ui.card.weather.attributes.air_pressure","Pressure"),A(u),U),b?k("sun",mt(S),F(this.e,S?"sunset":"sunrise"),we(x,"awc-ampm")):""].join("")}</div>`:"";this.innerHTML=`
      <ha-card>
        <div class="animated-weather-card no-transitions loading ${e==="theme"?"theme-colors":""}"${this.config.spill_particles!==!1?" data-spill":""}${C?' data-variant="compact"':""} style="${_}">
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
                ${!C&&this.config.show_location!==!1&&r?`<div class="location">${A(r)}</div>`:""}
                <div class="temperature" aria-live="polite"><span class="temperature-value">${A(a)}</span><span class="degree">\xB0</span></div>
                <div class="weather-desc" aria-live="polite">${A(n)}</div>
                ${C?`<div class="compact-meta">${A(this.compactMeta(r,p))}</div>`:`<div class="hero-meta">${this.heroMetaHtml(p,f,w)}</div>`}
                ${this.noteEnabled()?this.noteHtml(this.currentNote()):""}
              </div>
              ${C?"":R}
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
        ${st()}
      </style>
    `,this.attachEventListeners(),this.applySkyPhase(),this.applySizeState(),this.applySpill()}applySpill(){let e=this.querySelector("ha-card");if(!e)return;let t=this.config?.spill_particles!==!1?"visible":"hidden";e.style.setProperty("overflow",t,"important");let a=()=>{let n=e.shadowRoot;if(!n)return;let r=n.querySelector("#awc-overflow");r||(r=document.createElement("style"),r.id="awc-overflow",n.appendChild(r)),r.textContent=`:host { overflow: ${t} !important; }`};a(),!e.shadowRoot&&typeof customElements<"u"&&customElements.whenDefined("ha-card").then(()=>requestAnimationFrame(a))}transitionCondition(){let e=this.querySelector(".animated-weather-card");if(!e||e.classList.contains("loading")){this.initializeAnimations();return}e.classList.add("condition-out"),this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=setTimeout(()=>{this.conditionChangeTimeout=void 0,this.isConnected&&this.initializeAnimations()},gn)}noteEnabled(){return!!(this.config?.note_entity||this.config?.show_note)&&!this.config.compact&&!this.config.dev_mode}mountNoteWriter(){if(!this.noteEnabled()||this.config?.note_entity||!this.isConnected){this.noteWriter?.stop(),this.noteWriter=void 0;return}let e=window.AnimatedWeatherCardNote;if(e){this.noteWriter??(this.noteWriter=new e(this)),this.noteWriter.start();return}W.loadSiblingBundle("animated-weather-card-note",()=>!!window.AnimatedWeatherCardNote).then(()=>{this.isConnected&&this.mountNoteWriter()}).catch(t=>console.warn(`Animated Weather Card: ${t.message}`))}get noteVisible(){return!this.tabHidden&&!this.offscreen}showNote(e){this.writtenNote=e,this.updateNote()}noteWriting(e){this.noteComing!==e&&(this.noteComing=e,this.updateNote())}currentNote(){if(clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,!this.config)return null;let e=this.config.note_entity?Jt(this.e,this.config):this.writtenNote,t=e?Qt(e,this.config):null;if(!e||t===null)return e;let a=t-Date.now();return a<=0?null:(a<2**31-1&&(this.noteExpiryTimer=setTimeout(()=>this.updateNote(),a+50)),e)}noteHtml(e){return`<p class="weather-note"${e?"":" hidden"}><span class="note-long">${A(e?.note??"")}</span><span class="note-short">${A(e?.line??"")}</span><span class="note-status" aria-hidden="true"><span class="note-dots"><i></i><i></i><i></i></span><span class="note-phrase"></span></span></p>`}updateNote(){let e=this.querySelector(".weather-note");if(!e)return;let t=e.querySelector(".note-long"),a=e.querySelector(".note-short"),n=e.dataset.writing!==void 0;if(this.noteComing&&!this.config?.note_entity){this.noteTyping?.finish();let d=e.querySelector(".note-phrase"),l=F(this.e,this.noteComing==="forecast"?"note_reading":"note_writing");!n||e.hidden?(d&&(d.textContent=l),e.dataset.writing="",e.setAttribute("aria-busy","true"),e.hidden=!1,this.applySizeState()):this.fadeThrough(d,l);return}n&&(delete e.dataset.writing,e.removeAttribute("aria-busy"));let r=this.currentNote();if(!r){this.noteTyping?.finish(),(!e.hidden||n)&&(e.hidden=!0,this.applySizeState());return}if(e.hidden||n){this.noteTyping?.finish(),t&&(t.textContent=r.note),a&&(a.textContent=r.line),e.hidden=!1,this.applySizeState(),n&&this.typeIn(e);return}if(this.noteTyping){if(this.noteTyping.text===r.note+r.line)return;this.noteTyping.finish()}let s=()=>this.applySizeState();this.fadeThrough(t,r.note,s),this.fadeThrough(a,r.line,s)}compactMeta(e,t){return[this.config?.show_location!==!1?e:"",t?`${F(this.e,"feels_like")} ${t}`:""].filter(Boolean).join(" \xB7 ")}indoorLead(){let e=this.config?.indoor_style,t=A(F(this.e,"indoors")),a='<ha-icon class="indoor-icon" icon="mdi:home-thermometer-outline"></ha-icon>';if(e==="icon")return`${a}<span class="awc-visually-hidden">${t} </span>`;let n=`<span class="indoor-label">${t}</span>`;return e==="both"?a+n:n}heroMetaHtml(e,t,a){let n=[];e&&n.push(`<span class="feels-like">${A(F(this.e,"feels_like"))} ${A(e)}</span>`);let r=[t,a].filter(s=>s&&s!=="--");return this.config?.show_indoor!==!1&&r.length&&n.push(`<span class="indoor-climate-inline">${this.indoorLead()}${r.map(s=>A(s)).join('<span class="indoor-sep">\xB7</span>')}</span>`),n.join("")}mountDevPanel(){if(!this.config?.dev_mode){this.devPanel?.disconnect(),this.devPanel=void 0;return}let e=window.AnimatedWeatherCardDevPanel;if(e){this.devPanel??(this.devPanel=new e(this)),this.devPanel.mount();return}W.loadSiblingBundle("animated-weather-card-dev",()=>!!window.AnimatedWeatherCardDevPanel).then(()=>{this.isConnected&&this.mountDevPanel()}).catch(t=>console.warn(`Animated Weather Card: ${t.message}`))}attachEventListeners(){if(this.mountDevPanel(),this.mountNoteWriter(),!this.config?.dev_mode&&this.config?.entity){let e=this.config.entity,t=this.querySelector(".weather-info");if(t&&!t.dataset.tapBound){t.dataset.tapBound="1",t.style.cursor="pointer",t.setAttribute("role","button"),t.setAttribute("tabindex","0");let a=()=>{this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0}))};t.addEventListener("click",a),t.addEventListener("keydown",n=>{(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),a())})}}if(!this.isInitializing){let e=window.setTimeout(()=>{this.initializeAnimations(),this.config?.dev_mode&&!this.currentDevCondition&&(this.currentDevCondition="sunny")},100);this.pendingTimeouts.push(e)}}setAnimationsPaused(e){this.animationsPaused=e,this.toggleAttribute("data-paused",e),this.animationsPaused?(this.animationController?.pauseAllAnimations(),this.planes?.pause(),At(this)):this.h?(this.h=!1,this.initializeAnimations()):(this.animationController?.resumeAllAnimations(),this.planes?.resume(),Tt(this)),this.devPanel?.updatePauseButton()}getWeatherSettings(e){if(!this.config)throw new Error("getWeatherSettings called before setConfig");return L(this.config,e)}initializeAnimations(){if(this.isInitializing)return;this.isInitializing=!0;let e=++this.u;try{if(!this.config)return;let t=this.config,a=this.querySelector(".animated-weather-card");if(!a)return;this.clearAnimations();let n;if(t.dev_mode)n=this.currentDevCondition||"sunny";else{if(!this.hass||!t.entity)return;let u=this.hass.states[t.entity];if(!u)return;n=u.state.toLowerCase()}let r=xe(n,t.dev_mode??!1,t.sunrise_hour,t.sunset_hour,this.e?.config?.time_zone),s=(t.color_palette||"default")==="theme"?"theme-colors":"",d=a.classList.contains("loading"),l=(...u)=>{a.className=["animated-weather-card",r,...u,s,d?"no-transitions":"transitions-enabled"].filter(Boolean).join(" "),d&&requestAnimationFrame(()=>requestAnimationFrame(()=>{a.classList.remove("no-transitions"),a.classList.add("transitions-enabled")}))},h=typeof window<"u"&&!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(t.animate===!1||h){l(t.animate===!1?"static":""),this.currentWeatherClass=r;return}this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.animationInitTimeout=setTimeout(()=>{if(this.animationInitTimeout=void 0,!!this.isConnected&&e===this.u){if(l(),this.animationsPaused){this.currentWeatherClass=r,this.h=!0;return}this.animationController&&(this.animationController.setWindSpeed(this.currentWindSpeedValue),this.animationController.applyWeatherCondition(r)),this.startPlanes()}},t.dev_mode?50:200)}finally{this.isInitializing=!1}}clearAnimations(){this.animationController?.stopAllAnimations(),this.stopPlanes(),Je(this),this.animationInitTimeout&&(clearTimeout(this.animationInitTimeout),this.animationInitTimeout=void 0),this.querySelectorAll(".rain-layer, .snow-layer, .sleet-layer, .wind-layer").forEach(r=>{r.innerHTML=""});let t=this.querySelector(".animated-weather-card"),a=this.querySelector(".animation-layer");a&&(ue(this),a.querySelectorAll(".star-gsap, .moon-gsap").forEach(s=>{s.parentNode&&s.parentNode.removeChild(s)}),a.querySelectorAll(".plane-gsap").forEach(s=>s.remove())),t&&(_e(t),$t(t));let n=this.querySelector(".lightning");n&&(n.classList.remove("flash"),n.innerHTML=""),Ze(this.pendingTimeouts)}set hass(e){let t=this.e;if(this.e=e,this.config){if(this.handleFlightUpdates(),this.noteWriter?.hassChanged(),!t){this.render(),this.initializeAnimations();return}if(le(t)!==le(e)){this.render(),this.initializeAnimations();return}if(this.config.dev_mode||!this.config.entity)return;let a=t.states[this.config.entity],n=e.states[this.config.entity];if(!a||!n){this.render(),this.initializeAnimations();return}if(a.state!==n.state){this.p(),this.transitionCondition();return}let r=!1,s=l=>l==null?"__missing__":typeof l=="number"?Math.round(l):String(l),d=["temperature","humidity","wind_speed","pressure","wind_bearing","friendly_name"];for(let l of d)if(s(a.attributes[l])!==s(n.attributes[l])){r=!0;break}if(this.config.note_entity&&t.states[this.config.note_entity]!==e.states[this.config.note_entity]&&(r=!0),!r){let l=[this.config.outdoor_sensor_entity,this.config.feels_like_entity,this.config.humidity_sensor_entity,this.config.pressure_sensor_entity,this.config.wind_speed_sensor_entity,this.config.wind_direction_sensor_entity,this.config.indoor_temperature_entity,this.config.indoor_humidity_entity,this.config.sun_entity];for(let h of l){if(!h)continue;let u=t.states[h]?.state,c=e.states[h]?.state;if(u!==c){r=!0;break}}}if(r)this.p();else{let l=this.config.sun_entity||"sun.sun";t.states[l]!==e.states[l]&&this.applySkyPhase()}}}p(){if(!this.config||!this.e&&!this.config.dev_mode)return;let e;try{e=lt(this.e,this.config,this.currentDevCondition)}catch{return}let{temperature:t,weatherCondition:a,humidity:n,windSpeed:r,windSpeedValue:s,windBearing:d,pressure:l,pressureValue:h,feelsLike:u,indoorTemperature:c,indoorHumidity:p,sun:f}=e;this.currentWindSpeedValue=s;let w=(b,C)=>{b&&b.textContent!==C&&(b.textContent=C)};this.fadeThrough(this.querySelector(".temperature-value"),t),this.fadeThrough(this.querySelector(".weather-desc"),a);let g=(b,C)=>{w(this.querySelector(`.weather-attributes .attribute[data-kind="${b}"] .attribute-text`),C)};g("humidity",n),g("wind",r),g("pressure",l),this.syncValueIcon("wind","wind-bearing-arrow",typeof d=="number"?{icon:"mdi:navigation",transform:`rotate(${d+180}deg)`,label:ri(d)}:null);let v=this.updatePressureTrend(h);if(this.syncValueIcon("pressure","pressure-trend",v?{icon:si(v),label:`Pressure ${v}`,className:v}:null),f){let b=this.querySelector('.weather-attributes .attribute[data-kind="sun"]'),C=b?.querySelector(".attribute-text"),_=we(Z(f.aboveHorizon?f.sunset:f.sunrise,this.e),"awc-ampm");C&&C.innerHTML!==_&&(C.innerHTML=_),w(b?.querySelector(".attribute-label > span")??null,F(this.e,f.aboveHorizon?"sunset":"sunrise"));let E=b?.querySelector(".attribute-icon");E&&E.getAttribute("icon")!==mt(f.aboveHorizon)&&E.setAttribute("icon",mt(f.aboveHorizon))}let S=this.querySelector(".compact-meta");S&&w(S,this.compactMeta(e.location,u)),w(this.querySelector(".location"),e.location);let x=this.querySelector(".hero-meta");if(x){let b=this.heroMetaHtml(u,c,p);x.innerHTML!==b&&(x.innerHTML=b)}this.updateNote(),this.applySkyPhase(),this.applySizeState(),this.animationController&&this.animationController.setWindSpeed(s)}updatePressureTrend(e){return typeof e!="number"?this.m??null:(typeof this.l!="number"?this.l=e:Math.abs(e-this.l)>=.5&&(this.m=e>this.l?"rising":"falling",this.l=e),this.m??null)}syncValueIcon(e,t,a){let n=this.querySelector(`.weather-attributes .attribute[data-kind="${e}"] .attribute-value`);if(!n)return;let r=n.querySelector(`.${t}`);if(!a){r?.remove();return}r||(r=document.createElement("ha-icon"),n.appendChild(r)),r.className=[t,a.className].filter(Boolean).join(" "),r.getAttribute("icon")!==a.icon&&r.setAttribute("icon",a.icon),r.setAttribute("aria-label",a.label),r.style.transform=a.transform??""}typeIn(e){if(this.noteTyping?.finish(),window.matchMedia?.("(prefers-reduced-motion: reduce)").matches||this.config?.animate===!1)return;let t=Array.from(e.querySelectorAll(".note-long, .note-short")).map(c=>{let p=c.textContent??"",f=document.createElement("span");f.className="note-typed";let w=document.createElement("span");return w.className="note-untyped",w.textContent=p,c.replaceChildren(f,w),{span:c,text:p,typed:f,rest:w}}),a=Math.max(0,...t.map(c=>c.text.length)),n=Math.min(pn,Math.max(mn,a*un)),r=window.requestAnimationFrame?.bind(window)??(c=>window.setTimeout(()=>c(Date.now()),16)),s=window.cancelAnimationFrame?.bind(window)??window.clearTimeout.bind(window),d=Date.now(),l=0,h={text:t.map(c=>c.text).join(""),finish:()=>{s(l);for(let c of t)c.span.textContent=c.text;this.noteTyping===h&&(this.noteTyping=void 0)}},u=()=>{let c=Math.min(1,(Date.now()-d)/n);for(let p of t){let f=Math.round(c*p.text.length);p.typed.textContent=p.text.slice(0,f),p.rest.textContent=p.text.slice(f)}c<1?l=r(u):h.finish()};this.noteTyping=h,l=r(u)}fadeThrough(e,t,a){if(!e)return;let n=this.heroTextPending.get(e);if((n??e.textContent)===t)return;let r=!!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;if(typeof e.animate!="function"||r){e.textContent=t,a?.();return}if(this.heroTextPending.set(e,t),n!==void 0)return;let s=()=>{let l=this.heroTextPending.get(e);this.heroTextPending.delete(e),l!==void 0&&(e.textContent=l),a?.()},d=e.animate([{opacity:1},{opacity:0}],{duration:fn,easing:"cubic-bezier(0.5, 0, 0.75, 0)",fill:"forwards"});d.onfinish=()=>{s(),e.animate([{opacity:0,transform:"translateY(0.12em)"},{opacity:1,transform:"none"}],{duration:wn,easing:"cubic-bezier(0.25, 1, 0.5, 1)"}),d.cancel()},d.oncancel=s}get hass(){return this.e}startPlanes(){if(!this.config||this.planes||!this.config.flights_entity&&!this.config.dev_mode)return;this.planesWanted=!0;let e=window.AnimatedWeatherCardPlanes;if(!e){W.loadSiblingBundle("animated-weather-card-planes",()=>!!window.AnimatedWeatherCardPlanes).then(()=>{this.planesWanted&&this.isConnected&&this.startPlanes()}).catch(a=>console.warn(`Animated Weather Card: ${a.message}`));return}let t=new e(this,{intensity:1,scale:1,devMode:this.config.dev_mode||!1},this.config);this.planes=t,t.start().then(()=>{this.animationsPaused&&t.pause()}).catch(a=>{console.error("Failed to start plane fly-overs:",a),this.planes===t&&(this.planes=void 0)})}stopPlanes(){this.planesWanted=!1;let e=this.planes;e&&(this.planes=void 0,e.destroy().catch(t=>m(this.config?.dev_mode,"Error stopping plane fly-overs:",t)))}handleFlightUpdates(){if(!this.config?.flights_entity)return;let e=this.e?.states[this.config.flights_entity];if(e&&e===this.lastFlightsState)return;this.lastFlightsState=e;let t=this.flightTracker.update(Ut(this.e,this.config.flights_entity));t.length&&this.flyPlanes(t)}flyPlanes(e){!this.planes||this.animationsPaused||this.planes.flyOver(e,{night:this.config?.color_palette!=="theme"&&this.isNightForPlanes(),showLabels:this.config?.show_flight_labels!==!1})}isNightForPlanes(){return this.querySelector(".animated-weather-card")?.classList.contains("clear-night")?!0:this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride)?this.timeOfDayManager.getCurrentState().isNighttime:this.e?.states[this.config?.sun_entity||"sun.sun"]?.state==="below_horizon"}updateAutoPause(){if(this.noteVisible&&this.noteWriter?.wake(),this.wasManuallyPaused)return;let e=this.tabHidden||this.offscreen||!!this.config?.auto_pause&&this.windowBlurred;e!==this.animationsPaused&&this.setAnimationsPaused(e)}setupVisibilityTracking(){this.visibilityChangeHandler||this.isConnected&&(this.tabHidden=document.hidden,this.visibilityChangeHandler=()=>{this.tabHidden=document.hidden,this.updateAutoPause()},document.addEventListener("visibilitychange",this.visibilityChangeHandler),typeof IntersectionObserver<"u"&&(this.intersectionObserver=new IntersectionObserver(e=>{this.offscreen=!e[e.length-1].isIntersecting,this.updateAutoPause()},{rootMargin:"100px"}),this.intersectionObserver.observe(this)),this.config?.auto_pause&&(this.windowFocusHandler=()=>{this.windowBlurred=!1,this.updateAutoPause()},this.windowBlurHandler=()=>{this.windowBlurred=!0,this.updateAutoPause()},window.addEventListener("focus",this.windowFocusHandler),window.addEventListener("blur",this.windowBlurHandler)),this.updateAutoPause())}removeVisibilityTracking(){this.visibilityChangeHandler&&(document.removeEventListener("visibilitychange",this.visibilityChangeHandler),this.visibilityChangeHandler=null),this.intersectionObserver?.disconnect(),this.intersectionObserver=void 0,this.windowFocusHandler&&(window.removeEventListener("focus",this.windowFocusHandler),this.windowFocusHandler=null),this.windowBlurHandler&&(window.removeEventListener("blur",this.windowBlurHandler),this.windowBlurHandler=null),this.tabHidden=!1,this.offscreen=!1,this.windowBlurred=!1}disconnectedCallback(){this.conditionChangeTimeout&&clearTimeout(this.conditionChangeTimeout),this.conditionChangeTimeout=void 0,clearTimeout(this.noteExpiryTimer),this.noteExpiryTimer=void 0,this.noteWriter?.stop(),this.noteTyping?.finish(),this.clearAnimations(),this.resizeObserver?.disconnect(),this.resizeObserver=void 0,this.removeVisibilityTracking(),this.devPanel?.disconnect(),this.timeOfDayManager&&(this.timeOfDayManager.destroy(),this.timeOfDayManager=void 0),Ze(this.pendingTimeouts)}initializeTimeOfDayManager(){if(this.timeOfDayManager&&this.timeOfDayManager.destroy(),this.timeOfDayManager=new Ge({enableDayNightCycle:this.config?.enable_day_night_cycle||!1,sunriseHour:this.config?.sunrise_hour||6,sunsetHour:this.config?.sunset_hour||20,useBrowserTime:!0}),this.timeOfDayManager=this.timeOfDayManager,this.timeOfDayManager.addListener(e=>{this.onTimeOfDayChanged(e)}),this.config?.enable_day_night_cycle){let e=this.timeOfDayManager.getCurrentState();this.updateDayNightBackground(e)}}onTimeOfDayChanged(e){this.config?.enable_day_night_cycle&&(m(this.config?.dev_mode,`Time of day changed to: ${e.timePhase}`),this.updateDayNightBackground(e))}updateDayNightBackground(e){this.applySkyPhase()}currentSkyPhase(){if(this.timeOfDayManager&&(this.timeOfDayManager.isEnabled()||this.devTimeOverride))return this.timeOfDayManager.getCurrentState().timePhase;let e=this.e?.states[this.config?.sun_entity||"sun.sun"];if(!e)return"day";let t=e.attributes?.elevation;return $e(typeof t=="number"?t:Number(t),!!e.attributes?.rising,e.state!=="below_horizon")}applySkyPhase(){let e=this.querySelector(".animated-weather-card");if(!e)return;let t=this.currentSkyPhase();e.dataset.phase!==t&&(e.dataset.phase=t)}applySizeState(){let e=this.querySelector(".animated-weather-card"),t=e?.querySelector(".weather-info");if(!e||!t)return;let a=e.querySelector(".main-weather-info"),n=e.querySelector(".weather-attributes");if(e.dataset.height="regular",n){let l=e.dataset.metrics;e.dataset.metrics="row";let h=Array.from(n.children),u=parseFloat(getComputedStyle(n).columnGap)||0,c=h.reduce((w,g)=>w+g.getBoundingClientRect().width,0)+u*Math.max(0,h.length-1),p=n.clientWidth-c,f=p<-.5||l==="grid"&&p<yn;e.dataset.metrics=f?"grid":"row"}let r=e.dataset.variant==="compact",s=e.querySelector(".weather-note"),d=()=>t.scrollHeight>t.clientHeight+1||!r&&!!a&&a.scrollHeight>a.clientHeight+1||!!s&&!s.hidden&&s.scrollHeight>s.clientHeight+1;if(!s||s.hidden){delete e.dataset.note;for(let l of li)if(e.dataset.height=l,!d())return;return}for(let[l,h]of bn)if(e.dataset.height=l,e.dataset.note=h,!d())return}getGridOptions(){return this.config?.compact?{columns:12,rows:2,min_columns:6,min_rows:1}:this.noteEnabled()?{columns:12,rows:5,min_columns:6,min_rows:3}:{columns:12,rows:4,min_columns:6,min_rows:3}}getCardSize(){if(this.config?.compact)return 2;let e=3;return this.config?.show_indoor!==!1&&(e+=1),this.config?.show_attributes!==!1&&(e+=1),this.noteEnabled()&&(e+=1),e}static async getConfigElement(){return customElements.get("animated-weather-card-editor")||await W.loadSiblingBundle("animated-weather-card-editor",()=>!!customElements.get("animated-weather-card-editor")),document.createElement("animated-weather-card-editor")}static loadSiblingBundle(e,t){let a=W.bundleLoads.get(e);if(a)return a;let n=new Promise((r,s)=>{let l=Array.from(document.querySelectorAll("script[src]")).find(c=>/animated-weather-card(?:\.min)?\.js/.test(c.src)),h=l?l.src.replace(/animated-weather-card(\.min)?\.js/,`${e}$1.js`):`${e}.js`,u=document.createElement("script");u.src=h,u.type="module",u.async=!0,u.onload=()=>t()?r():s(new Error(`${h} loaded but registered nothing`)),u.onerror=()=>s(new Error(`Failed to load ${h}`)),document.head.appendChild(u)});return n.catch(()=>W.bundleLoads.delete(e)),W.bundleLoads.set(e,n),n}};W.bundleLoads=new Map;var pt=W;customElements.define("animated-weather-card",pt);window.customCards=window.customCards||[];window.customCards.push({type:"animated-weather-card",name:"Animated Weather Card",description:"The weather as a moving sky that follows the sun, with the temperature, feels like, wind, humidity, pressure and sunset",preview:!1,documentationURL:"https://github.com/alexsto1an/ha-ani-weather-card"});if(!window.animatedWeatherCardBannerShown){window.animatedWeatherCardBannerShown=!0;let o=pe("sunny","day"),i=["display: inline-block","line-height: 12px","font-size: 12px","font-weight: 600","padding: 4px 8px","margin: 5px 0"];console.groupCollapsed(`%c \u26C5 Animated Weather Card %cv${yt} `,[`background: linear-gradient(90deg, ${o.top}, ${o.mid} 55%, ${o.bottom})`,`color: ${z(N(ae))}`,"border-radius: 4px 0 0 4px",...i].join(";"),["background: linear-gradient(90deg, #ffd67a, #ffb547)",`color: ${o.top}`,"border-radius: 0 4px 4px 0",...i].join(";")),console.log("%c Readme: %c https://github.com/alexsto1an/ha-ani-weather-card ","font-weight: bold","font-weight: normal"),console.groupEnd()}})();
