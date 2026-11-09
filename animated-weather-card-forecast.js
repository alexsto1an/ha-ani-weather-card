"use strict";(()=>{var B=(e,t,n)=>Math.min(t,Math.max(e,n));function O([e,t,n]){let r=n*Math.PI/180,i=t*Math.cos(r),s=t*Math.sin(r),o=(e+.3963377774*i+.2158037573*s)**3,a=(e-.1055613458*i-.0638541728*s)**3,l=(e-.0894841775*i-1.291485548*s)**3;return[4.0767416621*o-3.3077115913*a+.2309699292*l,-1.2684380046*o+2.6097574011*a-.3413193965*l,-.0041960863*o-.7034186147*a+1.707614701*l]}var me=e=>e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055;function Y(e){let t=r=>r.every(i=>i>=-1e-4&&i<=1.0001),n=O(e);if(!t(n)){let r=0,i=e[1];for(let s=0;s<24;s++){let o=(r+i)/2;t(O([e[0],o,e[2]]))?r=o:i=o}n=O([e[0],r,e[2]])}return n.map(r=>me(B(0,1,r)))}var he=e=>Math.round(B(0,1,e)*255);function q(e){return"#"+e.map(t=>he(t).toString(16).padStart(2,"0")).join("")}var U=[.985,.006,250],Z=.8;var X={rx:.5,ry:.55,cx:.9,cy:-.12,fade:.64};function J(e,t){let n=r=>`${Math.round(r*100)}%`;return`radial-gradient(${n(e.rx)} ${n(e.ry)} at ${n(e.cx)} ${n(e.cy)}, ${t}, transparent ${n(e.fade)})`}var Q=3.2,ee="cubic-bezier(0.37, 0, 0.63, 1)",pe={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},ge=Object.keys(pe),te=ge.filter(e=>e.startsWith("--awc-sky-"));function h(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function I(e,t){return Object.prototype.hasOwnProperty.call(e,t)?e[t]:void 0}function H(e,t,n=0){if(!isFinite(e))return"--";let r=t?.locale?.language||t?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(r,{minimumFractionDigits:n,maximumFractionDigits:n}).format(e)}catch{return e.toFixed(n)}}var L={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note",now:"Now",today:"Today",high_short:"H",low_short:"L",high:"High",low:"Low",rain:"Rain",snow:"Snow",sleet:"Sleet",hail:"Hail",storms:"Storms",dry:"Dry",chance:"{percent} chance",forecast:"Forecast",more_info:"History and settings",close:"Close",next_hours:"Next hours",next_days:"Next days"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben",now:"Jetzt",today:"Heute",high_short:"H",low_short:"T",high:"H\xF6chstwert",low:"Tiefstwert",rain:"Regen",snow:"Schnee",sleet:"Schneeregen",hail:"Hagel",storms:"Gewitter",dry:"Trocken",chance:"{percent} Wahrscheinlichkeit",forecast:"Vorhersage",more_info:"Verlauf und Einstellungen",close:"Schlie\xDFen",next_hours:"N\xE4chste Stunden",next_days:"N\xE4chste Tage"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota",now:"Ahora",today:"Hoy",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Lluvia",snow:"Nieve",sleet:"Aguanieve",hail:"Granizo",storms:"Tormentas",dry:"Seco",chance:"{percent} de probabilidad",forecast:"Pron\xF3stico",more_info:"Historial y ajustes",close:"Cerrar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos d\xEDas"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note",now:"Maint.",today:"Auj.",high_short:"Max",low_short:"Min",high:"Maximale",low:"Minimale",rain:"Pluie",snow:"Neige",sleet:"Neige fondue",hail:"Gr\xEAle",storms:"Orages",dry:"Sec",chance:"{percent} de probabilit\xE9",forecast:"Pr\xE9visions",more_info:"Historique et param\xE8tres",close:"Fermer",next_hours:"Prochaines heures",next_days:"Prochains jours"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota",now:"Ora",today:"Oggi",high_short:"Max",low_short:"Min",high:"Massima",low:"Minima",rain:"Pioggia",snow:"Neve",sleet:"Nevischio",hail:"Grandine",storms:"Temporali",dry:"Asciutto",chance:"{percent} di probabilit\xE0",forecast:"Previsioni",more_info:"Cronologia e impostazioni",close:"Chiudi",next_hours:"Prossime ore",next_days:"Prossimi giorni"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven",now:"Nu",today:"Vandaag",high_short:"H",low_short:"L",high:"Hoogste",low:"Laagste",rain:"Regen",snow:"Sneeuw",sleet:"Natte sneeuw",hail:"Hagel",storms:"Onweer",dry:"Droog",chance:"{percent} kans",forecast:"Verwachting",more_info:"Geschiedenis en instellingen",close:"Sluiten",next_hours:"Komende uren",next_days:"Komende dagen"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki",now:"Teraz",today:"Dzi\u015B",high_short:"Maks",low_short:"Min",high:"Maksymalna",low:"Minimalna",rain:"Deszcz",snow:"\u015Anieg",sleet:"Deszcz ze \u015Bniegiem",hail:"Grad",storms:"Burze",dry:"Sucho",chance:"{percent} szans",forecast:"Prognoza",more_info:"Historia i ustawienia",close:"Zamknij",next_hours:"Najbli\u017Csze godziny",next_days:"Najbli\u017Csze dni"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota",now:"Agora",today:"Hoje",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Chuva",snow:"Neve",sleet:"Chuva e neve",hail:"Granizo",storms:"Trovoadas",dry:"Seco",chance:"{percent} de probabilidade",forecast:"Previs\xE3o",more_info:"Hist\xF3rico e defini\xE7\xF5es",close:"Fechar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos dias"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota",now:"Acum",today:"Azi",high_short:"Max",low_short:"Min",high:"Maxima",low:"Minima",rain:"Ploaie",snow:"Ninsoare",sleet:"Lapovi\u021B\u0103",hail:"Grindin\u0103",storms:"Furtuni",dry:"Uscat",chance:"{percent} probabilitate",forecast:"Prognoz\u0103",more_info:"Istoric \u0219i set\u0103ri",close:"\xCEnchide",next_hours:"Orele urm\u0103toare",next_days:"Zilele urm\u0103toare"}};function E(e){return e?.locale?.language||e?.language||"en"}function C(e){if(e?.locale?.time_zone!=="server")return;let t=e.config?.time_zone;if(t)try{return new Intl.DateTimeFormat("en",{timeZone:t}),t}catch{return}}function f(e,t,n={}){let r=E(e).toLowerCase();return(L[r]?.[t]??L[r.split("-")[0]]?.[t]??L.en[t]).replace(/\{(\w+)\}/g,(s,o)=>n[o]??"")}function we(e){let t=e?.locale;if(!t?.time_format)return;if(t.time_format==="12")return!0;if(t.time_format==="24")return!1;let n=t.time_format==="language"?E(e):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(n).includes("10")}catch{return}}function be(e,t){let n=we(e),r={...t,timeZone:C(e)};return n!==void 0&&(r.hourCycle=n?"h12":"h23"),new Intl.DateTimeFormat(e?E(e):void 0,r)}function T(e,t){try{let n=be(t,{hour:"numeric"}).formatToParts(e),r=n.find(s=>s.type==="hour")?.value??String(e.getHours()),i=n.find(s=>s.type==="dayPeriod")?.value;return i?`${r} ${i}`:r}catch{return String(e.getHours())}}function A(e,t,n="short"){try{return new Intl.DateTimeFormat(t?E(t):void 0,{weekday:n,timeZone:C(t)}).format(e)}catch{return""}}function D(e,t){try{return new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:C(t)}).format(e)}catch{return e.toDateString()}}var _e=36e5,y=e=>typeof e=="number"&&isFinite(e)?e:void 0,_=e=>Date.parse(e.datetime);function xe(e,t,n,r){let i=D(new Date(n),r),s=new Map;for(let o of[...e].sort((a,l)=>_(a)-_(l))){if(isNaN(_(o)))continue;let a=D(new Date(_(o)),r);a<i||(s.has(a)||s.set(a,[]),s.get(a).push(o))}return[...s.entries()].map(([o,a])=>{let l=t==="twice_daily"?a.find(u=>u.is_daytime!==!1)??a[0]:a[0],m=a.flatMap(u=>[y(u.temperature),y(u.templow)]).filter(u=>u!==void 0),c=t==="twice_daily"?y(a.filter(u=>u.is_daytime!==!1).map(u=>u.temperature).find(u=>y(u)!==void 0))??(m.length?Math.max(...m):void 0):y(l.temperature),g=t==="twice_daily"?y(a.filter(u=>u.is_daytime===!1).map(u=>u.temperature).find(u=>y(u)!==void 0))??y(l.templow)??(m.length>1?Math.min(...m):void 0):y(l.templow),w=a.map(u=>y(u.precipitation_probability)).filter(u=>u!==void 0),x=a.map(u=>y(u.precipitation)).filter(u=>u!==void 0);return{date:new Date(_(l)),key:o,isToday:o===i,condition:l.condition,high:c,low:g,chance:w.length?Math.max(...w):void 0,precipitation:x.length?x.reduce((u,p)=>u+p,0):void 0,entry:l}})}function ne({hourly:e,daily:t,dailyType:n,now:r,current:i,hass:s,dayCount:o=7}){let a=(e??[]).filter(d=>!isNaN(_(d))&&_(d)+_e>r).sort((d,k)=>_(d)-_(k)),l=xe(t??[],n,r,s).slice(0,o),m=D(new Date(r),s),c=l.find(d=>d.isToday),g=c?.high,w=c?.low;if(g===void 0||w===void 0){let d=a.filter(k=>D(new Date(_(k)),s)===m).map(k=>y(k.temperature)).filter(k=>k!==void 0);(d.length>=2||d.length&&i!==void 0)&&(g??(g=Math.max(...d)),w??(w=Math.min(...d)))}i!==void 0&&(g!==void 0&&(g=Math.max(g,i)),w!==void 0&&(w=Math.min(w,i)));let x=l.map(d=>d.low??d.high).filter(d=>d!==void 0),u=l.map(d=>d.high??d.low).filter(d=>d!==void 0);i!==void 0&&c&&(x.push(i),u.push(i));let p=x.length&&u.length?{min:Math.min(...x),max:Math.max(...u)}:void 0,F=a.some(d=>y(d.precipitation_probability)!==void 0)||l.some(d=>d.chance!==void 0);return{hours:a,days:l,today:{high:g,low:w},span:p,hasChance:F}}function W(e){let t=y(e.precipitation_probability);if(t!==void 0)return t>=40;let n=y(e.precipitation);return n!==void 0?n>=.2:/rain|pour|snow|hail|lightning|sleet/.test(e.condition??"")}var re={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function b(e,t){return e===void 0||!isFinite(e)?"\u2013":`${H(Math.round(e)||0,t,0).replace(/^-/,"\u2212")}\xB0`}function v(e,t){if(e===void 0||!isFinite(e))return"";try{return new Intl.NumberFormat(t?.locale?.language||t?.language||"en",{style:"percent",maximumFractionDigits:0}).format(Math.round(e)/100)}catch{return`${Math.round(e)}%`}}function oe(e,t,n,r="short"){return t?f(n,"today"):A(e,n,r)}function M(e,t,n="weather.forecast"){if(!e)return"";try{let r=t?.formatEntityState?.({entity_id:n,state:e,attributes:{}});if(r&&r!==e)return r}catch{}return I(re,e)??e}var S=36e5,P=e=>typeof e=="number"&&isFinite(e)?e:void 0,$=e=>Date.parse(e.datetime);function ie(e){let t=e.join(" ");return/lightning/.test(t)?"storms":/hail/.test(t)?"hail":/snowy-rainy/.test(t)?"sleet":/snowy/.test(t)?"snow":"rain"}function ae(e,t){try{let n=new Intl.DateTimeFormat("en-GB",{hour:"numeric",hourCycle:"h23",timeZone:C(t)}).formatToParts(new Date(e)).find(r=>r.type==="hour")?.value;return Number(n)}catch{return new Date(e).getHours()}}function R(e,t,n,r,i,s=!1){if(!e.length)return[];let o;if(s)o=Math.floor(t/S)*S;else{o=Math.ceil((t+20*6e4)/S)*S;for(let l=0;l<24&&ae(o,i)%r!==0;l++)o+=S}let a=[];for(let l=0;l<n;l++){let m=o+l*r*S,c=e.filter(p=>$(p)>=m-S/2&&$(p)<m+r*S-S/2);if(!c.length)break;let g=c.reduce((p,F)=>Math.abs($(F)-m)<Math.abs($(p)-m)?F:p,c[0]),w=c.filter(W),x=c.map(p=>P(p.precipitation_probability)).filter(p=>p!==void 0),u=c.map(p=>P(p.precipitation)).filter(p=>p!==void 0);a.push({start:m,temp:P(g.temperature),condition:g.condition,wet:w.length>0,kind:w.length?ie(w.map(p=>p.condition)):void 0,chance:x.length?Math.max(...x):void 0,amount:u.length?u.reduce((p,F)=>p+F,0):void 0,isDay:g.is_daytime??!/night/.test(g.condition??""),label:s&&l===0?f(i,"now"):Se(m,i)})}return a}function Se(e,t){return/\s/.test(T(new Date(e),t))?T(new Date(e),t):`${String(ae(e,t)).padStart(2,"0")}:00`}function z(e){let t=e>0?e:313,n=t>=410?62:54,r=Math.max(4,Math.min(12,Math.floor((t+8)/(n+8))));return{count:r,step:Math.ceil(12/r)}}var N=e=>e===void 0?void 0:Math.round(e/10)*10;function ke(e,t,n){let r=[],i=0;if(e.length&&t&&!e[0].wet){let s=f(n,"dry");r.push({column:0,text:s,short:s,wet:!1})}for(;i<e.length;){if(!e[i].wet){i++;continue}let s=[],o=i;for(;i<e.length&&e[i].wet;)s.push(e[i++]);let a=f(n,Ae(s)),l=s.map(c=>c.chance).filter(c=>c!==void 0),m=N(l.length?Math.max(...l):void 0);if(r.push({column:o,text:m!==void 0?`${a} ${v(m,n)}`:a,short:a,wet:!0}),i<e.length){let c=f(n,"dry");r.push({column:i,text:c,short:c,wet:!1})}}return r.map((s,o)=>({...s,span:(r[o+1]?.column??e.length)-s.column}))}var Fe=["storms","hail","snow","sleet","rain"];function Ae(e){let t=e.map(n=>n.kind??"rain");return Fe.find(n=>t.includes(n))??"rain"}function Ce(e,t){let n=[b(e.temp,t),M(e.condition,t)];return e.wet&&e.chance!==void 0&&n.push(f(t,"chance",{percent:v(N(e.chance),t)})),`${e.label}: ${n.filter(Boolean).join(", ")}`}function G(e,t,n,r=""){if(!e.length)return"";let i=ke(e,t,n),s=e.map(a=>`<li><span class="awc-visually-hidden">${h(Ce(a,n))}</span><span class="awc-hour-label" aria-hidden="true">${h(a.label)}</span><span class="awc-hour-temp" aria-hidden="true">${h(b(a.temp,n))}</span></li>`).join(""),o=i.map(a=>`<li aria-hidden="true"><span class="awc-hour-token${a.wet?"":" dry"}" style="grid-column: ${a.column+1} / span ${a.span}" data-short="${h(a.short)}">${h(a.text)}</span></li>`).join("");return`<ol class="awc-hours ${r}" style="--awc-cols: ${e.length}" aria-label="${h(f(n,"next_hours"))}">${s}${o}</ol>`}function De(e,t){if(W({precipitation_probability:e.chance,precipitation:e.precipitation,condition:e.condition})){let n=f(t,ie([e.condition])),r=N(e.chance);return{text:r!==void 0?`${n} ${v(r,t)}`:n,wet:!0,short:n}}return{text:M(e.condition,t),wet:!1}}function ve(e,t,n){if(!t||e.low===void 0||e.high===void 0)return'<span class="awc-bar empty" aria-hidden="true"></span>';let r=t.max-t.min,i=l=>r>0?Math.max(0,Math.min(100,(l-t.min)/r*100)):0,s=r>0?i(e.low):0,o=r>0?100-i(e.high):0,a=e.isToday&&n!==void 0?`<b style="left: ${i(n).toFixed(1)}%"></b>`:"";return`<span class="awc-bar" aria-hidden="true"><i style="left: ${s.toFixed(1)}%; right: ${o.toFixed(1)}%"></i>${a}</span>`}function V(e,t,n,r,i=""){if(!e.length)return"";let s=e.map(o=>{let a=De(o,n),l=oe(o.date,o.isToday,n),m=[o.isToday?l:A(o.date,n,"long"),M(o.condition,n),a.wet&&o.chance!==void 0?f(n,"chance",{percent:v(N(o.chance),n)}):"",o.low!==void 0?`${f(n,"low").toLowerCase()} ${b(o.low,n)}`:"",o.high!==void 0?`${f(n,"high").toLowerCase()} ${b(o.high,n)}`:""].filter(Boolean).join(", ");return`<li><span class="awc-visually-hidden">${h(m)}</span><span class="awc-day-name" aria-hidden="true">${h(l)}</span><span class="awc-day-what${a.wet?"":" dry"}" aria-hidden="true"${a.short?` data-short="${h(a.short)}"`:""}>${h(a.text)}</span><span class="awc-day-low" aria-hidden="true">${o.low!==void 0?h(b(o.low,n)):""}</span>`+ve(o,t.span,r)+`<span class="awc-day-high" aria-hidden="true">${o.high!==void 0?h(b(o.high,n)):""}</span></li>`}).join("");return`<ol class="awc-days ${i}" aria-label="${h(f(n,"next_days"))}">${s}</ol>`}function se(e,t){let{high:n,low:r}=e;if(n===void 0&&r===void 0)return"";let i=(o,a)=>a===void 0?"":`<span class="awc-hl-pair" aria-hidden="true"><span class="awc-hl-label">${h(f(t,o))}</span>${h(b(a,t))}</span>`,s=[n!==void 0?`${f(t,"high")} ${b(n,t)}`:"",r!==void 0?`${f(t,"low").toLowerCase()} ${b(r,t)}`:""].filter(Boolean).join(", ");return`${i("high_short",n)}${i("low_short",r)}<span class="awc-visually-hidden">${h(s)}</span>`}function j(e){return`
        .awc-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .awc-hours, .awc-days { list-style: none; margin: 0; padding: 0; }
        .awc-hours > li, .awc-days > li { display: contents; }

        /* Hours: equal columns, so the row is a true time axis */
        .awc-hours {
          display: grid;
          grid-template-columns: repeat(var(--awc-cols, 5), minmax(0, 1fr));
          column-gap: 8px;
          row-gap: 4px;
        }
        .awc-hour-label {
          grid-row: 1;
          font-size: 11px;
          line-height: 14px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
        }
        .awc-hour-temp {
          grid-row: 2;
          font-size: 16px;
          line-height: 21px;
          font-weight: 500;
          letter-spacing: -0.012em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .awc-hour-token {
          grid-row: 3;
          font-size: 13px;
          line-height: 18px;
          font-weight: 400;
          letter-spacing: -0.004em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-right: 12px;
        }

        /* Days: the bar a fixed share, the numbers anchored right, so the
           tinted low always ends clear of the light */
        .awc-days {
          display: grid;
          grid-template-columns: max-content minmax(0, 1fr) 4ch 34% 4ch;
          column-gap: 12px;
          row-gap: 6px;
          align-items: center;
        }
        .awc-hours + .awc-days { margin-top: 12px; }
        .awc-day-name { font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.006em; white-space: nowrap; }
        .awc-day-what { font-size: 13px; line-height: 18px; font-weight: 400; white-space: nowrap; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
        .awc-day-what.dry { opacity: var(--awc-secondary, 0.8); }
        .awc-day-low, .awc-day-high { font-size: 15px; line-height: 20px; font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
        .awc-day-low { font-weight: 400; opacity: var(--awc-secondary, 0.8); }
        .awc-day-high { font-weight: 500; }
        .awc-bar { position: relative; height: 3px; border-radius: 1.5px; background: color-mix(in srgb, currentColor 20%, transparent); }
        .awc-bar.empty { background: none; }
        .awc-bar > i { position: absolute; inset-block: 0; min-width: 6px; border-radius: 1.5px; background: currentColor; opacity: 0.8; }
        .awc-bar > b {
          position: absolute;
          top: 50%;
          width: 6px;
          height: 6px;
          margin: -3px 0 0 -3px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 2px var(--awc-sky-mid, transparent);
        }

        /* Today's high and low */
        .awc-hl-pair { white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-hl-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-right: 3px; }

        ${e} :is(.awc-hour-label, .awc-hour-token.dry, .awc-day-what.dry, .awc-day-low, .awc-hl-label) { color: var(--secondary-text-color); }
        ${e} .awc-bar { background: var(--divider-color, rgba(0, 0, 0, 0.12)); }
        ${e} .awc-bar > i { background: var(--primary-color); opacity: 1; }
        ${e} .awc-bar > b { background: var(--primary-text-color); box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)); }
    `}function le(e){var t;for(let n of Array.from(e.querySelectorAll(".awc-hour-token, .awc-day-what"))){if((t=n.dataset).full??(t.full=n.textContent??""),n.textContent=n.dataset.full,n.style.visibility="",n.scrollWidth<=n.clientWidth+1)continue;if(n.classList.contains("awc-day-what")&&n.classList.contains("dry")){n.style.visibility="hidden";continue}let r=n.dataset.short;r&&(n.textContent=r)}}var ue=e=>/rain|pour|snow|sleet|storm/.test(e);function K(e,t=6){return ne({hourly:e.hourly,daily:e.daily,dailyType:e.dailyType,now:e.now,current:e.current,hass:e.hass,dayCount:t})}function ce(e,t){let n=t.hours.length>0,r=t.days.some(o=>!o.isToday),i=e.show!=="daily"&&n||e.show==="daily"&&!r&&n,s=e.show!=="hourly"&&r||e.show==="hourly"&&!n&&r;return{hours:i,days:s}}function Ee(e,t){if(e<2)return{roomy:[],keep:t?"all":`d${e}`,drop:[]};let n=[];for(let r=e;r>2;r--)n.push(`d${r}`);return{roomy:n,keep:"d2",drop:t?["first"]:[]}}var Te=e=>`data-roomy="${e.roomy.join(" ")}" data-keep="${e.keep}" data-drop="${e.drop.join(" ")}"`;function Me(e){let t=K(e),n=ce(e,t);if(!n.hours&&!n.days)return"";let{count:r,step:i}=z(e.width),s=n.hours?G(R(t.hours,e.now,r,i,e.hass),ue(e.condition),e.hass):"",o=n.days?t.days.filter(l=>!l.isToday).slice(0,5):[],a=n.days?Ee(o.length,n.hours):{roomy:[],keep:"all",drop:[]};return`<section class="awc-fc awc-fc-a" ${Te(a)}>${s}${V(o,t,e.hass)}</section>`}var $e=`
    ${j(".animated-weather-card.theme-colors")}
    .awc-fc-a { position: relative; padding-top: 14px; }
    .awc-fc-a::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .animated-weather-card.theme-colors .awc-fc-a::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    .animated-weather-card:is([data-height="close"], [data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-fc-a { padding-top: 10px; }
    @container awc (min-width: 460px) { .awc-fc .awc-hour-temp { font-size: 18px; line-height: 24px; } }
    /* The fit's levels: fewer day rows, then none (the hours kept) */
    .animated-weather-card[data-forecast="first"] .awc-fc .awc-days { display: none; }
    ${[1,2,3,4,5,6,7,8].map(e=>`.animated-weather-card[data-forecast="d${e}"] .awc-fc .awc-days > li:nth-child(n+${e+1})`).join(`,
    `)} { display: none; }

    /* Today's high and low: on the condition's line, the quiet line's size,
       full strength (it reaches toward the light); tinted on a wide card */
    .awc-hl-line {
      display: inline-flex;
      gap: 10px;
      font-size: 15px;
      line-height: 20px;
      font-weight: 400;
      letter-spacing: -0.006em;
    }
    @container awc (min-width: 640px) { .awc-hl-line { opacity: var(--awc-secondary); } }
    .animated-weather-card.theme-colors .awc-hl-line { color: var(--secondary-text-color); }

    /* Beside the temperature, a min/max thermometer's memory: inside the
       temperature's own line, so it costs no height at any step */
    .temperature:has(> .awc-hl-stack:not([hidden])) { display: flex; align-items: center; }
    .awc-hl-stack {
      display: grid;
      margin: 0.06em 0 0 0.18em;
      font-family: var(--awc-font);
      font-size: 17px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    .awc-hl-stack .awc-hl-label { opacity: var(--awc-secondary); }
    @container awc (min-width: 460px) { .awc-hl-stack { font-size: 18px; line-height: 22px; } }
    @container awc (min-width: 640px) { .awc-hl-stack { font-size: 20px; line-height: 26px; } .awc-hl-stack .awc-hl-label { font-size: 12px; } }
    @container awc (max-width: 319px) { .awc-hl-stack { font-size: 15px; line-height: 18px; } .awc-hl-stack .awc-hl-label { font-size: 10px; } }
    @container awc (max-width: 259px) { .awc-hl-stack { display: none; } }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-hl-stack { font-size: 15px; line-height: 18px; }
    .animated-weather-card[data-height="minimal"] .awc-hl-stack { font-size: 14px; line-height: 16px; }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"], [data-height="minimal"]) .awc-hl-stack .awc-hl-label { font-size: 10px; }
    .animated-weather-card.theme-colors .awc-hl-stack { color: var(--primary-text-color); }
    .animated-weather-card.theme-colors .awc-hl-stack .awc-hl-label { color: var(--secondary-text-color); }
`;function Ne(e){let t=K(e,10),n=ce(e,t),r=e.width>=640,i=e.compact||!r?e.width-40:(e.width-56-57)/2,{count:s,step:o}=z(i),a=n.hours?R(t.hours,e.now,e.compact&&r?Math.min(12,s*2):s,e.compact&&r?Math.max(1,Math.ceil(o/2)):o,e.hass):[],l=G(a,ue(e.condition),e.hass);if(e.compact){if(l)return`<div class="fc-a fc-strip" data-fit-steps="regular">${l}</div>`;let g=t.days.slice(0,r?7:4);return`<div class="fc-a fc-strip" data-fit-steps="regular">${Oe(g,e)}</div>`}let m=n.days?t.days:[],c=[];for(let g=m.length;g>=2;g--)c.push(`d${g}`);return l&&m.length&&c.push("x2","x1"),c.length||c.push("regular"),`<div class="fc-a fc-full${l&&m.length?" both":""}" data-fit-steps="${c.join(" ")}">`+(l?`<div class="fc-hours-block">${l}</div>`:"")+(m.length?`<div class="fc-days-block">${V(m,t,e.hass,e.current)}</div>`:"")+"</div>"}function Oe(e,t){let n=e.map(r=>{let i=r.isToday?f(t.hass,"today"):A(r.date,t.hass,"short");return`<li><span class="awc-hour-label">${h(i)}</span><span class="awc-hour-temp">${h(b(r.high,t.hass))} <span class="fc-low">${h(b(r.low,t.hass))}</span></span></li>`}).join("");return`<ol class="awc-hours" style="--awc-cols: ${e.length}" aria-label="${h(f(t.hass,"next_days"))}">${n}</ol>`}var Ie=q(Y(U)),He=`
    ${j(".fc-card:not(.sky)")}
    .fc-card {
      position: relative;
      box-sizing: border-box;
      height: 100%;
      min-height: 0;
      padding: 20px;
      overflow: hidden;
      container: fc / inline-size;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: var(--primary-text-color);
      --awc-secondary: 1;
    }
    .fc-card.sky {
      color: ${Ie};
      --awc-secondary: ${Z};
      text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
      background:
        ${J(X,"var(--awc-sky-glow)")},
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
        linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
      transition: ${te.map(e=>`${e} ${Q}s ${ee}`).join(", ")};
    }
    /* The strip, under a compact weather card: the lower sky, no light of its own */
    .fc-card.sky.compact {
      background:
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
        linear-gradient(180deg, var(--awc-sky-mid) 0%, var(--awc-sky-bottom) 100%);
    }
    .fc-card.compact { padding: 16px 20px; display: flex; flex-direction: column; justify-content: center; }
    .fc-low { font-weight: 400; opacity: var(--awc-secondary); margin-left: 2px; }
    .fc-card:not(.sky) .fc-low { color: var(--secondary-text-color); opacity: 1; }
    .fc-empty { margin: auto; font-size: 14px; opacity: var(--awc-secondary); }

    /* a: the hours over the days from today; wide, side by side */
    .fc-a.fc-full { display: flex; flex-direction: column; height: 100%; }
    .fc-a .fc-days-block { position: relative; }
    .fc-a.both .fc-days-block { margin-top: 14px; padding-top: 14px; }
    .fc-a.both .fc-days-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .fc-card:not(.sky) .fc-a.both .fc-days-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    .fc-a .awc-days { row-gap: 6px; }
    @container fc (min-width: 460px) { .awc-hour-temp { font-size: 18px; line-height: 24px; } }
    @container fc (min-width: 640px) {
      .fc-card { padding: 24px 28px; }
      .fc-a.fc-full.both { flex-direction: row; align-items: flex-start; gap: 56px; }
      .fc-a.both > * { flex: 1 1 0; min-width: 0; }
      .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
      .fc-a.both .fc-days-block::before { inset: 4px auto 4px -28px; width: 1px; height: auto; }
    }
    ${[1,2,3,4,5,6,7,8,9].map(e=>`.fc-card[data-fit="d${e}"] .awc-days > li:nth-child(n+${e+1}), .fc-card[data-fit="x${e}"] .awc-days > li:nth-child(n+${e+1})`).join(", ")} { display: none; }
    .fc-card[data-fit^="x"] .fc-hours-block { display: none; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block::before { display: none; }
`,de={version:1,sectionCss:$e,renderSection:e=>{switch(e.variant){default:return Me(e)}},fit:le,renderHighLow:e=>se(K(e).today,e.hass),cardCss:He,renderCard:e=>{switch(e.variant){default:return Ne(e)}},openPopup:e=>()=>{}};window.AnimatedWeatherCardForecast=de;})();
