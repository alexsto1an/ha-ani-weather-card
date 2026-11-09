"use strict";(()=>{var He=["sunny","partly-cloudy","windy","cloudy","foggy","light-rain","rainy","pouring","stormy","snowy","snowy-rainy","sleety","snowy-stormy","sleety-stormy","clear-night"],pn={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},Xe=(e,n,t)=>Math.min(n,Math.max(e,t)),ee=(e,n,t)=>e+(n-e)*t;function mn(e,n,t){let i=(n-e+540)%360-180;return(e+i*t+360)%360}function U(e,n,t){let i=([f,u,x])=>[f,u*Math.cos(x*Math.PI/180),u*Math.sin(x*Math.PI/180)],[r,a,o]=i(e),[l,s,d]=i(n),c=ee(r,l,t),m=ee(a,s,t),b=ee(o,d,t),y=Math.hypot(m,b),h=y<1e-6?e[2]:(Math.atan2(b,m)*180/Math.PI+360)%360;return[c,y,h]}function Ve([e,n,t]){let i=t*Math.PI/180,r=n*Math.cos(i),a=n*Math.sin(i),o=(e+.3963377774*r+.2158037573*a)**3,l=(e-.1055613458*r-.0638541728*a)**3,s=(e-.0894841775*r-1.291485548*a)**3;return[4.0767416621*o-3.3077115913*l+.2309699292*s,-1.2684380046*o+2.6097574011*l-.3413193965*s,-.0041960863*o-.7034186147*l+1.707614701*s]}var hn=e=>e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055;function I(e){let n=i=>i.every(r=>r>=-1e-4&&r<=1.0001),t=Ve(e);if(!n(t)){let i=0,r=e[1];for(let a=0;a<24;a++){let o=(i+r)/2;n(Ve([e[0],o,e[2]]))?i=o:r=o}t=Ve([e[0],i,e[2]])}return t.map(i=>hn(Xe(0,1,i)))}var _t=e=>Math.round(Xe(0,1,e)*255);function te(e){return"#"+e.map(n=>_t(n).toString(16).padStart(2,"0")).join("")}function xt(e,n){return`rgba(${e.map(_t).join(", ")}, ${Number(n.toFixed(3))})`}function Ue(e,n,t){return e.map((i,r)=>i*(1-t)+n[r]*t)}function Ze(e,n){return[.15+(e[0]-.15)*.42,e[1]*ee(.75,.5,n),mn(e[2],262,.45)]}function kt(e,n){let t=pn[e],i=1-t.overcast*.7,r={top:t.top,mid:t.mid,bottom:t.bottom,glow:t.glow,glowAlpha:t.glowAlpha,scrimAlpha:ee(.46,.28,t.overcast)};if(e==="clear-night"){if(n==="dawn"||n==="dusk"){let a=n==="dawn"?[.4,.09,20]:[.38,.1,40];return{...r,bottom:U(t.bottom,a,.45),glowAlpha:.2,scrimAlpha:.22}}return{...r,scrimAlpha:.2}}switch(n){case"night":return{top:Ze(t.top,t.overcast),mid:Ze(t.mid,t.overcast),bottom:Ze(t.bottom,t.overcast),glow:[.86,.03,250],glowAlpha:ee(.14,.06,t.overcast),scrimAlpha:.2};case"dusk":return{top:U(t.top,[t.top[0]*.8,.075,292],.5*i),mid:U(t.mid,[t.mid[0]*.88,.065,350],.42*i),bottom:U(t.bottom,[t.bottom[0]*.92,.115,52],.72*i),glow:U(t.glow,[.82,.13,58],i),glowAlpha:ee(t.glowAlpha,.6,i*.6),scrimAlpha:r.scrimAlpha+.04};case"dawn":return{top:U(t.top,[t.top[0]*.95,t.top[1]*.85,262],.4*i),mid:U(t.mid,[t.mid[0]*.95,.05,330],.3*i),bottom:U(t.bottom,[t.bottom[0]*.95,.085,32],.62*i),glow:U(t.glow,[.88,.09,40],i),glowAlpha:ee(t.glowAlpha,.5,i*.5),scrimAlpha:r.scrimAlpha+.04};default:return r}}function $t(e){return[.16,Math.min(.04,e[1]*.6),e[2]]}function Ne(e,n){let t=kt(e,n);return{top:te(I(t.top)),mid:te(I(t.mid)),bottom:te(I(t.bottom)),glow:xt(I(t.glow),t.glowAlpha),scrim:xt(I($t(t.top)),t.scrimAlpha)}}var ze=[.985,.006,250],Oe=.8,Le=.55,vt=.4;var St={rx:.36,ry:.5,cx:.9,cy:0,fade:.64},Ft={rx:.26,ry:.5,cx:.92,cy:-.1,fade:.64};function Je(e,n){let t=i=>`${Math.round(i*100)}%`;return`radial-gradient(${t(e.rx)} ${t(e.ry)} at ${t(e.cx)} ${t(e.cy)}, ${n}, transparent ${t(e.fade)})`}function Ct(e,n,t){let i=kt(e,n),r=I(i.top),a=I(i.mid),o=I(i.bottom),l=t<=Le?Ue(r,a,t/Le):Ue(a,o,(t-Le)/(1-Le)),s=Xe(0,1,(t-vt)/(1-vt));return Ue(l,I($t(i.top)),i.scrimAlpha*s)}var Et=3.2,Tt="cubic-bezier(0.37, 0, 0.63, 1)",fn={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},gn=Object.keys(fn),Mt=gn.filter(e=>e.startsWith("--awc-sky-"));function bn(e){return["sunny","clear-night","partly-cloudy","cloudy","rainy","light-rain","pouring","stormy","snowy","snowy-rainy","snowy-stormy","sleety","sleety-stormy","windy","foggy"].includes(e)}function g(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Qe(e,n){return Object.prototype.hasOwnProperty.call(e,n)?e[n]:void 0}function ie(e,n,t=0){if(!isFinite(e))return"--";let i=n?.locale?.language||n?.language||(typeof navigator<"u"?navigator.language:"en");try{return new Intl.NumberFormat(i,{minimumFractionDigits:t,maximumFractionDigits:t}).format(e)}catch{return e.toFixed(t)}}function re(e,n,t){if(e?.localize)try{let i=e.localize(n);if(i&&i!==n)return i}catch{}return t}function Dt(e,n,t,i,r){if(typeof e!="string")return console.warn("Invalid condition type provided, using sunny as fallback"),"sunny";if(n&&bn(e))return e;if(n)return console.warn(`Invalid dev mode condition: ${e}, using sunny`),"sunny";let a=e.toLowerCase();if(a.includes("sleet")&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"sleety-stormy";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("lightning")||a.includes("thunder")||a.includes("storm")))return"snowy-stormy";if(a.includes("lightning")||a.includes("thunder")||a.includes("storm"))return"stormy";if(a.includes("fog")||a.includes("mist"))return"foggy";if(a.includes("heavy")&&a.includes("rain"))return"pouring";if(a.includes("pouring")||a.includes("downpour"))return"pouring";if((a.includes("snow")||a.includes("sleet"))&&(a.includes("rain")||a.includes("drizzle")))return"snowy-rainy";if(a.includes("light")&&(a.includes("rain")||a.includes("drizzle")))return"light-rain";if(a.includes("rain")||a.includes("drizzle"))return"rainy";if(a.includes("sleet")||a.includes("hail"))return"sleety";if(a.includes("snow"))return"snowy";if(a.includes("wind"))return"windy";if(a.includes("partly")&&a.includes("cloud"))return"partly-cloudy";if(a.includes("cloud")||a.includes("overcast"))return"cloudy";if(a.includes("clear")||a.includes("sunny")){let o=new Date,l;if(r)try{let m=new Intl.DateTimeFormat("en-US",{timeZone:r,hour:"numeric",hour12:!1}).formatToParts(o);l=parseInt(m.find(b=>b.type==="hour")?.value||"0",10)}catch{l=o.getHours()}else l=o.getHours();let s=t??6,d=i??20;return(l<s||l>=d)&&a.includes("clear")?"clear-night":"sunny"}return"sunny"}var et={en:{feels_like:"Feels like",indoors:"Indoors",sunrise:"Sunrise",sunset:"Sunset",solar_noon:"Solar noon",daylight:"Daylight",first_light:"First light",last_light:"Last light",moon:"Moon",in_duration:"in {duration}",note_reading:"Reading the forecast",note_writing:"Writing the note",now:"Now",today:"Today",high_short:"H",low_short:"L",high:"High",low:"Low",rain:"Rain",snow:"Snow",sleet:"Sleet",hail:"Hail",storms:"Storms",dry:"Dry",chance:"{percent} chance",forecast:"Forecast",more_info:"History and settings",close:"Close",next_hours:"Next hours",next_days:"Next days",from_time:"from {time}",until_time:"until {time}",high_at:"High {value} at {time}",low_at:"Low {value} at {time}",steady_until:"Steady until {time}",within_hour:"Within the hour",in_hours:"in {hours} h",dry_from:"Dry from",through_time:"through {time}",at_time:"at {time}",gusts:"gusts"},de:{feels_like:"Gef\xFChlt",indoors:"Innen",sunrise:"Sonnenaufgang",sunset:"Sonnenuntergang",solar_noon:"Sonnenh\xF6chststand",daylight:"Tagesl\xE4nge",first_light:"Morgend\xE4mmerung",last_light:"Abendd\xE4mmerung",moon:"Mond",in_duration:"in {duration}",note_reading:"Vorhersage wird gelesen",note_writing:"Notiz wird geschrieben",now:"Jetzt",today:"Heute",high_short:"H",low_short:"T",high:"H\xF6chstwert",low:"Tiefstwert",rain:"Regen",snow:"Schnee",sleet:"Schneeregen",hail:"Hagel",storms:"Gewitter",dry:"Trocken",chance:"{percent} Wahrscheinlichkeit",forecast:"Vorhersage",more_info:"Verlauf und Einstellungen",close:"Schlie\xDFen",next_hours:"N\xE4chste Stunden",next_days:"N\xE4chste Tage",from_time:"ab {time}",until_time:"bis {time}",high_at:"H\xF6chstwert {value} um {time}",low_at:"Tiefstwert {value} um {time}",steady_until:"Gleichbleibend bis {time}",within_hour:"Innerhalb der Stunde",in_hours:"in {hours} Std.",dry_from:"Trocken ab",through_time:"bis {time}",at_time:"um {time}",gusts:"B\xF6en"},es:{feels_like:"Sensaci\xF3n t\xE9rmica",indoors:"Interior",sunrise:"Salida del sol",sunset:"Puesta del sol",solar_noon:"Mediod\xEDa solar",daylight:"Duraci\xF3n del d\xEDa",first_light:"Alba",last_light:"Anochecer",moon:"Luna",in_duration:"en {duration}",note_reading:"Leyendo el pron\xF3stico",note_writing:"Escribiendo la nota",now:"Ahora",today:"Hoy",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Lluvia",snow:"Nieve",sleet:"Aguanieve",hail:"Granizo",storms:"Tormentas",dry:"Seco",chance:"{percent} de probabilidad",forecast:"Pron\xF3stico",more_info:"Historial y ajustes",close:"Cerrar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos d\xEDas",from_time:"desde las {time}",until_time:"hasta las {time}",high_at:"M\xE1xima {value} a las {time}",low_at:"M\xEDnima {value} a las {time}",steady_until:"Estable hasta las {time}",within_hour:"En la pr\xF3xima hora",in_hours:"en {hours} h",dry_from:"Seco desde",through_time:"hasta las {time}",at_time:"a las {time}",gusts:"r\xE1fagas"},fr:{feels_like:"Ressenti",indoors:"Int\xE9rieur",sunrise:"Lever du soleil",sunset:"Coucher du soleil",solar_noon:"Midi solaire",daylight:"Dur\xE9e du jour",first_light:"Aube",last_light:"Cr\xE9puscule",moon:"Lune",in_duration:"dans {duration}",note_reading:"Lecture des pr\xE9visions",note_writing:"R\xE9daction de la note",now:"Maint.",today:"Auj.",high_short:"Max",low_short:"Min",high:"Maximale",low:"Minimale",rain:"Pluie",snow:"Neige",sleet:"Neige fondue",hail:"Gr\xEAle",storms:"Orages",dry:"Sec",chance:"{percent} de probabilit\xE9",forecast:"Pr\xE9visions",more_info:"Historique et param\xE8tres",close:"Fermer",next_hours:"Prochaines heures",next_days:"Prochains jours",from_time:"d\xE8s {time}",until_time:"jusqu\u2019\xE0 {time}",high_at:"Max {value} \xE0 {time}",low_at:"Min {value} \xE0 {time}",steady_until:"Stable jusqu\u2019\xE0 {time}",within_hour:"Dans l\u2019heure",in_hours:"dans {hours} h",dry_from:"Sec d\xE8s",through_time:"jusqu\u2019\xE0 {time}",at_time:"\xE0 {time}",gusts:"rafales"},it:{feels_like:"Percepita",indoors:"Interno",sunrise:"Alba",sunset:"Tramonto",solar_noon:"Mezzogiorno solare",daylight:"Durata del giorno",first_light:"Prima luce",last_light:"Ultima luce",moon:"Luna",in_duration:"tra {duration}",note_reading:"Lettura delle previsioni",note_writing:"Scrittura della nota",now:"Ora",today:"Oggi",high_short:"Max",low_short:"Min",high:"Massima",low:"Minima",rain:"Pioggia",snow:"Neve",sleet:"Nevischio",hail:"Grandine",storms:"Temporali",dry:"Asciutto",chance:"{percent} di probabilit\xE0",forecast:"Previsioni",more_info:"Cronologia e impostazioni",close:"Chiudi",next_hours:"Prossime ore",next_days:"Prossimi giorni",from_time:"dalle {time}",until_time:"fino alle {time}",high_at:"Massima {value} alle {time}",low_at:"Minima {value} alle {time}",steady_until:"Stabile fino alle {time}",within_hour:"Entro un\u2019ora",in_hours:"tra {hours} h",dry_from:"Asciutto dalle",through_time:"fino alle {time}",at_time:"alle {time}",gusts:"raffiche"},nl:{feels_like:"Voelt als",indoors:"Binnen",sunrise:"Zonsopkomst",sunset:"Zonsondergang",solar_noon:"Zonnemiddag",daylight:"Daglengte",first_light:"Ochtendschemering",last_light:"Avondschemering",moon:"Maan",in_duration:"over {duration}",note_reading:"Verwachting lezen",note_writing:"Notitie schrijven",now:"Nu",today:"Vandaag",high_short:"H",low_short:"L",high:"Hoogste",low:"Laagste",rain:"Regen",snow:"Sneeuw",sleet:"Natte sneeuw",hail:"Hagel",storms:"Onweer",dry:"Droog",chance:"{percent} kans",forecast:"Verwachting",more_info:"Geschiedenis en instellingen",close:"Sluiten",next_hours:"Komende uren",next_days:"Komende dagen",from_time:"vanaf {time}",until_time:"tot {time}",high_at:"Hoogste {value} om {time}",low_at:"Laagste {value} om {time}",steady_until:"Stabiel tot {time}",within_hour:"Binnen het uur",in_hours:"over {hours} u",dry_from:"Droog vanaf",through_time:"tot {time}",at_time:"om {time}",gusts:"windstoten"},pl:{feels_like:"Odczuwalna",indoors:"Wewn\u0105trz",sunrise:"Wsch\xF3d s\u0142o\u0144ca",sunset:"Zach\xF3d s\u0142o\u0144ca",solar_noon:"Po\u0142udnie s\u0142oneczne",daylight:"D\u0142ugo\u015B\u0107 dnia",first_light:"\u015Awit",last_light:"Zmierzch",moon:"Ksi\u0119\u017Cyc",in_duration:"za {duration}",note_reading:"Czytanie prognozy",note_writing:"Pisanie notatki",now:"Teraz",today:"Dzi\u015B",high_short:"Maks",low_short:"Min",high:"Maksymalna",low:"Minimalna",rain:"Deszcz",snow:"\u015Anieg",sleet:"Deszcz ze \u015Bniegiem",hail:"Grad",storms:"Burze",dry:"Sucho",chance:"{percent} szans",forecast:"Prognoza",more_info:"Historia i ustawienia",close:"Zamknij",next_hours:"Najbli\u017Csze godziny",next_days:"Najbli\u017Csze dni",from_time:"od {time}",until_time:"do {time}",high_at:"Maks. {value} o {time}",low_at:"Min. {value} o {time}",steady_until:"Bez zmian do {time}",within_hour:"W ci\u0105gu godziny",in_hours:"za {hours} godz.",dry_from:"Sucho od",through_time:"do {time}",at_time:"o {time}",gusts:"porywy"},pt:{feels_like:"Sensa\xE7\xE3o t\xE9rmica",indoors:"Interior",sunrise:"Nascer do sol",sunset:"P\xF4r do sol",solar_noon:"Meio-dia solar",daylight:"Dura\xE7\xE3o do dia",first_light:"Aurora",last_light:"Crep\xFAsculo",moon:"Lua",in_duration:"em {duration}",note_reading:"Leitura da previs\xE3o",note_writing:"Escrita da nota",now:"Agora",today:"Hoje",high_short:"M\xE1x",low_short:"M\xEDn",high:"M\xE1xima",low:"M\xEDnima",rain:"Chuva",snow:"Neve",sleet:"Chuva e neve",hail:"Granizo",storms:"Trovoadas",dry:"Seco",chance:"{percent} de probabilidade",forecast:"Previs\xE3o",more_info:"Hist\xF3rico e defini\xE7\xF5es",close:"Fechar",next_hours:"Pr\xF3ximas horas",next_days:"Pr\xF3ximos dias",from_time:"a partir das {time}",until_time:"at\xE9 \xE0s {time}",high_at:"M\xE1xima {value} \xE0s {time}",low_at:"M\xEDnima {value} \xE0s {time}",steady_until:"Est\xE1vel at\xE9 \xE0s {time}",within_hour:"Dentro de uma hora",in_hours:"em {hours} h",dry_from:"Seco a partir das",through_time:"at\xE9 \xE0s {time}",at_time:"\xE0s {time}",gusts:"rajadas"},ro:{feels_like:"Resim\u021Bit\u0103",indoors:"Interior",sunrise:"R\u0103s\u0103rit",sunset:"Apus",solar_noon:"Amiaza solar\u0103",daylight:"Durata zilei",first_light:"Zori",last_light:"Amurg",moon:"Lun\u0103",in_duration:"\xEEn {duration}",note_reading:"Citesc prognoza",note_writing:"Scriu nota",now:"Acum",today:"Azi",high_short:"Max",low_short:"Min",high:"Maxima",low:"Minima",rain:"Ploaie",snow:"Ninsoare",sleet:"Lapovi\u021B\u0103",hail:"Grindin\u0103",storms:"Furtuni",dry:"Uscat",chance:"{percent} probabilitate",forecast:"Prognoz\u0103",more_info:"Istoric \u0219i set\u0103ri",close:"\xCEnchide",next_hours:"Orele urm\u0103toare",next_days:"Zilele urm\u0103toare",from_time:"de la {time}",until_time:"p\xE2n\u0103 la {time}",high_at:"Maxima {value} la {time}",low_at:"Minima {value} la {time}",steady_until:"Stabil p\xE2n\u0103 la {time}",within_hour:"\xCEn urm\u0103toarea or\u0103",in_hours:"\xEEn {hours} h",dry_from:"Uscat de la",through_time:"p\xE2n\u0103 la {time}",at_time:"la {time}",gusts:"rafale"}};function xe(e){return e?.locale?.language||e?.language||"en"}function ce(e){if(e?.locale?.time_zone!=="server")return;let n=e.config?.time_zone;if(n)try{return new Intl.DateTimeFormat("en",{timeZone:n}),n}catch{return}}function w(e,n,t={}){let i=xe(e).toLowerCase();return(et[i]?.[n]??et[i.split("-")[0]]?.[n]??et.en[n]).replace(/\{(\w+)\}/g,(a,o)=>t[o]??"")}function xn(e){let n=e?.locale;if(!n?.time_format)return;if(n.time_format==="12")return!0;if(n.time_format==="24")return!1;let t=n.time_format==="language"?xe(e):void 0;try{return new Date("January 1, 2023 22:00:00").toLocaleString(t).includes("10")}catch{return}}function tt(e,n){if(!e)return"--";let t=new Date(e);if(isNaN(t.getTime()))return"--";try{return nt(n,{hour:"numeric",minute:"2-digit"}).format(t)}catch{return t.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}}function nt(e,n){let t=xn(e),i={...n,timeZone:ce(e)};return t!==void 0&&(i.hourCycle=t?"h12":"h23"),new Intl.DateTimeFormat(e?xe(e):void 0,i)}function At(e,n){try{let t=nt(n,{hour:"numeric",minute:"2-digit"}).formatToParts(e),i=t.filter(a=>a.type==="dayPeriod").map(a=>a.value).join("");return{time:t.filter(a=>a.type!=="dayPeriod").map(a=>a.value).join("").trim(),period:i}}catch{return{time:e.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),period:""}}}function Ie(e,n){try{let t=nt(n,{hour:"numeric"}).formatToParts(e),i=t.find(a=>a.type==="hour")?.value??String(e.getHours()),r=t.find(a=>a.type==="dayPeriod")?.value;return r?`${i} ${r}`:i}catch{return String(e.getHours())}}function P(e,n,t="short"){try{return new Intl.DateTimeFormat(n?xe(n):void 0,{weekday:t,timeZone:ce(n)}).format(e)}catch{return""}}function Lt(e,n,t={weekday:"long",day:"numeric",month:"long"}){try{return new Intl.DateTimeFormat(n?xe(n):void 0,{...t,timeZone:ce(n)}).format(e)}catch{return e.toDateString()}}function it(e,n){try{return new Intl.DateTimeFormat("en-CA",{year:"numeric",month:"2-digit",day:"2-digit",timeZone:ce(n)}).format(e)}catch{return e.toDateString()}}function R(e,n){let t=e.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);return t?`${g(t[1])}<span class="${n}">${g(t[2])}</span>`:g(e)}var vn=36e5,L=e=>typeof e=="number"&&isFinite(e)?e:void 0,Z=e=>Date.parse(e.datetime);function _n(e,n,t,i){let r=it(new Date(t),i),a=new Map;for(let o of[...e].sort((l,s)=>Z(l)-Z(s))){if(isNaN(Z(o)))continue;let l=it(new Date(Z(o)),i);l<r||(a.has(l)||a.set(l,[]),a.get(l).push(o))}return[...a.entries()].map(([o,l])=>{let s=n==="twice_daily"?l.find(h=>h.is_daytime!==!1)??l[0]:l[0],d=l.flatMap(h=>[L(h.temperature),L(h.templow)]).filter(h=>h!==void 0),c=n==="twice_daily"?L(l.filter(h=>h.is_daytime!==!1).map(h=>h.temperature).find(h=>L(h)!==void 0))??(d.length?Math.max(...d):void 0):L(s.temperature),m=n==="twice_daily"?L(l.filter(h=>h.is_daytime===!1).map(h=>h.temperature).find(h=>L(h)!==void 0))??L(s.templow)??(d.length>1?Math.min(...d):void 0):L(s.templow),b=l.map(h=>L(h.precipitation_probability)).filter(h=>h!==void 0),y=l.map(h=>L(h.precipitation)).filter(h=>h!==void 0);return{date:new Date(Z(s)),key:o,isToday:o===r,condition:s.condition,high:c,low:m,chance:b.length?Math.max(...b):void 0,precipitation:y.length?y.reduce((h,f)=>h+f,0):void 0,entry:s}})}function ve({hourly:e,daily:n,dailyType:t,now:i,current:r,hass:a,dayCount:o=7}){let l=(e??[]).filter(u=>!isNaN(Z(u))&&Z(u)+vn>i).sort((u,x)=>Z(u)-Z(x)),s=_n(n??[],t,i,a).slice(0,o),d=s.find(u=>u.isToday),c=d?.high,m=d?.low;r!==void 0&&(c!==void 0&&(c=Math.max(c,r)),m!==void 0&&(m=Math.min(m,r)));let b=s.map(u=>u.low??u.high).filter(u=>u!==void 0),y=s.map(u=>u.high??u.low).filter(u=>u!==void 0);r!==void 0&&d&&(b.push(r),y.push(r));let h=b.length&&y.length?{min:Math.min(...b),max:Math.max(...y)}:void 0,f=l.some(u=>L(u.precipitation_probability)!==void 0)||s.some(u=>u.chance!==void 0);return{hours:l,days:s,today:{high:c,low:m},span:h,hasChance:f}}function rt(e){let n=L(e.precipitation_probability);if(n!==void 0)return n>=40;let t=L(e.precipitation);return t!==void 0?t>=.2:/rain|pour|snow|hail|lightning|sleet/.test(e.condition??"")}var Ht={"clear-night":"Clear, night",cloudy:"Cloudy",exceptional:"Exceptional",fog:"Fog",hail:"Hail",lightning:"Lightning","lightning-rainy":"Lightning, rainy",partlycloudy:"Partly cloudy",pouring:"Pouring",rainy:"Rainy",snowy:"Snowy","snowy-rainy":"Snowy, rainy",sunny:"Sunny",windy:"Windy","windy-variant":"Windy, cloudy"};function $(e,n){return e===void 0||!isFinite(e)?"\u2013":`${ie(Math.round(e)||0,n,0).replace(/^-/,"\u2212")}\xB0`}function H(e,n){if(e===void 0||!isFinite(e))return"";try{return new Intl.NumberFormat(n?.locale?.language||n?.language||"en",{style:"percent",maximumFractionDigits:0}).format(Math.round(e)/100)}catch{return`${Math.round(e)}%`}}function Nt(e,n,t,i="short"){return n?w(t,"today"):P(e,t,i)}function G(e,n,t="weather.forecast"){if(!e)return"";try{let i=n?.formatEntityState?.({entity_id:t,state:e,attributes:{}});if(i&&i!==e)return i}catch{}return Qe(Ht,e)??e}var X=36e5,Pe=e=>typeof e=="number"&&isFinite(e)?e:void 0,Re=e=>Date.parse(e.datetime);function zt(e){let n=e.join(" ");return/lightning/.test(n)?"storms":/hail/.test(n)?"hail":/snowy-rainy/.test(n)?"sleet":/snowy/.test(n)?"snow":"rain"}function de(e,n){try{let t=new Intl.DateTimeFormat("en-GB",{hour:"numeric",hourCycle:"h23",timeZone:ce(n)}).formatToParts(new Date(e)).find(i=>i.type==="hour")?.value;return Number(t)}catch{return new Date(e).getHours()}}function ue(e,n,t,i,r,a=!1){if(!e.length)return[];let o;if(a)o=Math.floor(n/X)*X;else{o=Math.ceil((n+20*6e4)/X)*X;for(let d=0;d<24&&de(o,r)%i!==0;d++)o+=X}let l=[],s=!1;for(let d=0;d<t;d++){let c=o+d*i*X,m=e.filter(u=>Re(u)>=c-X/2&&Re(u)<c+i*X-X/2);if(!m.length)break;let b=m.reduce((u,x)=>Math.abs(Re(x)-c)<Math.abs(Re(u)-c)?x:u,m[0]),y=m.map(u=>Pe(u.precipitation_probability)).filter(u=>u!==void 0),h=m.filter(u=>{let x=Pe(u.precipitation_probability);return x!==void 0?x>=(s?30:40):rt(u)});s=h.length>0;let f=m.map(u=>Pe(u.precipitation)).filter(u=>u!==void 0);l.push({start:c,temp:Pe(b.temperature),condition:b.condition,wet:h.length>0,kind:h.length?zt(h.map(u=>u.condition)):void 0,wetCondition:h.length?(h.find(u=>/lightning/.test(u.condition??""))??h.find(u=>/pouring|snowy|hail/.test(u.condition??""))??h.find(u=>/rain/.test(u.condition??""))??h[0]).condition:void 0,chance:y.length?Math.max(...y):void 0,amount:f.length?f.reduce((u,x)=>u+x,0):void 0,isDay:b.is_daytime??!/night/.test(b.condition??""),label:a&&d===0?w(r,"now"):de(c,r)===0?P(new Date(c),r,"short"):C(c,r)})}return l}function C(e,n){return/\s/.test(Ie(new Date(e),n))?Ie(new Date(e),n):`${String(de(e,n)).padStart(2,"0")}:00`}function We(e){let n=e>0?e:313,t=n>=410?62:54,i=Math.max(4,Math.min(12,Math.floor((n+8)/(t+8))));return{count:i,step:Math.ceil(12/i)}}var Ge=e=>e===void 0?void 0:Math.round(e/10)*10;function kn(e,n,t){let i=[],r=0;if(e.length&&n&&!e[0].wet){let a=w(t,"dry");i.push({column:0,text:a,short:a,wet:!1})}for(;r<e.length;){if(!e[r].wet){r++;continue}let a=[],o=r;for(;r<e.length&&e[r].wet;)a.push(e[r++]);let l=w(t,Sn(a)),s=a.map(c=>c.chance).filter(c=>c!==void 0),d=Ge(s.length?Math.max(...s):void 0);if(i.push({column:o,text:d!==void 0?`${l} ${H(d,t)}`:l,short:l,chance:d!==void 0?H(d,t):void 0,wet:!0}),r<e.length){let c=w(t,"dry");i.push({column:r,text:c,short:c,wet:!1})}}return i.map((a,o)=>({...a,span:(i[o+1]?.column??e.length)-a.column}))}var $n=["storms","hail","snow","sleet","rain"];function Sn(e){let n=e.map(t=>t.kind??"rain");return $n.find(t=>n.includes(t))??"rain"}function Fn(e,n){let t=[$(e.temp,n),G(e.condition,n)];return e.wet&&e.chance!==void 0&&t.push(w(n,"chance",{percent:H(Ge(e.chance),n)})),`${e.label}: ${t.filter(Boolean).join(", ")}`}function _e(e,n,t,i=""){if(!e.length)return"";let r=kn(e,n,t),a=e.map(l=>`<li><span class="awc-visually-hidden">${g(Fn(l,t))}</span><span class="awc-hour-label" aria-hidden="true">${g(l.label)}</span><span class="awc-hour-temp" aria-hidden="true">${g($(l.temp,t))}</span></li>`).join(""),o=r.map(l=>`<li aria-hidden="true"><span class="awc-hour-token${l.wet?"":" dry"}" style="grid-column: ${l.column+1} / span ${l.span}" data-short="${g(l.short)}"${l.chance?` data-chance="${g(l.chance)}"`:""}>${g(l.text)}</span></li>`).join("");return`<ol class="awc-hours ${i}" style="--awc-cols: ${e.length}" aria-label="${g(w(t,"next_hours"))}">${a}${o}</ol>`}function Cn(e,n){if(rt({precipitation_probability:e.chance,precipitation:e.precipitation,condition:e.condition})){let t=w(n,zt([e.condition])),i=Ge(e.chance);return{text:i!==void 0?`${t} ${H(i,n)}`:t,wet:!0,short:t}}return{text:G(e.condition,n),wet:!1}}function En(e,n,t){if(!n||e.low===void 0||e.high===void 0)return'<span class="awc-bar empty" aria-hidden="true"></span>';let i=n.max-n.min,r=s=>i>0?Math.max(0,Math.min(100,(s-n.min)/i*100)):0,a=i>0?r(e.low):0,o=i>0?100-r(e.high):0,l=e.isToday&&t!==void 0?`<b style="left: ${r(t).toFixed(1)}%"></b>`:"";return`<span class="awc-bar" aria-hidden="true"><i style="left: ${a.toFixed(1)}%; right: ${o.toFixed(1)}%"></i>${l}</span>`}function Y(e,n,t,i,r=""){if(!e.length)return"";let a=e.map(o=>{let l=Cn(o,t),s=Nt(o.date,o.isToday,t),d=[o.isToday?s:P(o.date,t,"long"),G(o.condition,t),l.wet&&o.chance!==void 0?w(t,"chance",{percent:H(Ge(o.chance),t)}):"",o.low!==void 0?`${w(t,"low").toLowerCase()} ${$(o.low,t)}`:"",o.high!==void 0?`${w(t,"high").toLowerCase()} ${$(o.high,t)}`:""].filter(Boolean).join(", ");return`<li><span class="awc-visually-hidden">${g(d)}</span><span class="awc-day-name" aria-hidden="true">${g(s)}</span><span class="awc-day-what${l.wet?"":" dry"}" aria-hidden="true"${l.short?` data-short="${g(l.short)}"`:""}>${g(l.text)}</span><span class="awc-day-low" aria-hidden="true">${o.low!==void 0?g($(o.low,t)):""}</span>`+En(o,n.span,i)+`<span class="awc-day-high" aria-hidden="true">${o.high!==void 0?g($(o.high,t)):""}</span></li>`}).join("");return`<ol class="awc-days ${r}" aria-label="${g(w(t,"next_days"))}">${a}</ol>`}function pe(e,n){let{high:t,low:i}=e;if(t===void 0&&i===void 0)return"";let r=(o,l)=>l===void 0?"":`<span class="awc-hl-pair" aria-hidden="true"><span class="awc-hl-label">${g(w(n,o))}</span>${g($(l,n))}</span>`,a=[t!==void 0?`${w(n,"high")} ${$(t,n)}`:"",i!==void 0?`${w(n,"low").toLowerCase()} ${$(i,n)}`:""].filter(Boolean).join(", ");return`${r("high_short",t)}${r("low_short",i)}<span class="awc-visually-hidden">${g(a)}</span>`}function ke(e){return`
        .awc-visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
        .awc-hours, .awc-days { list-style: none; margin: 0; padding: 0; }
        .awc-hours > li, .awc-days > li { display: contents; }

        /* Hours: equal columns, so the row is a true time axis */
        /* Its rows always held, the word line too, so rain arriving never moves the fit */
        .awc-hours {
          display: grid;
          grid-template-columns: repeat(var(--awc-cols, 5), minmax(0, 1fr));
          grid-template-rows: 14px 21px 16px;
          column-gap: 8px;
          row-gap: 2px;
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
          line-height: 16px;
          font-weight: 400;
          letter-spacing: -0.004em;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          min-width: 0;
          overflow: hidden;
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
        /* The track: the hairline's strength, drawn with opacity (older
           WebViews have no color-mix) */
        .awc-bar { position: relative; height: 4px; border-radius: 2px; }
        .awc-bar::before { content: ''; position: absolute; inset: 0; border-radius: 2px; background: currentColor; opacity: 0.2; }
        .awc-bar.empty::before { display: none; }
        .awc-bar > i { position: absolute; inset-block: 0; min-width: 6px; border-radius: 2px; background: currentColor; opacity: 0.8; }
        .awc-bar > b {
          position: absolute;
          top: 50%;
          width: 8px;
          height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: currentColor;
          box-shadow: 0 0 0 2px var(--awc-sky-mid, transparent);
        }

        /* Today's high and low */
        .awc-hl-pair { white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-hl-label { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; margin-right: 3px; }

        ${e} :is(.awc-hour-label, .awc-hour-token.dry, .awc-day-what.dry, .awc-day-low, .awc-hl-label) { color: var(--secondary-text-color); }
        ${e} .awc-bar::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
        ${e} .awc-bar > i { background: var(--primary-color); opacity: 1; }
        ${e} .awc-bar > b { background: var(--primary-text-color); box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)); }
    `}function Be(e){var n;for(let t of Array.from(e.querySelectorAll(".awc-hour-token, .awc-day-what"))){if((n=t.dataset).full??(n.full=t.textContent??""),t.textContent=t.dataset.full,t.style.visibility="",t.scrollWidth<=t.clientWidth)continue;if(t.classList.contains("awc-day-what")&&t.classList.contains("dry")){t.style.visibility="hidden";continue}let i=t.dataset.short;i&&(t.textContent=i),t.scrollWidth>t.clientWidth&&t.dataset.chance&&(t.textContent=t.dataset.chance)}}function Ot(e){let n=document.createElement("awc-forecast-popup");n.style.position="fixed",n.style.zIndex="10";let t=n.attachShadow({mode:"open"});t.innerHTML=`<style>${e.css}</style><dialog class="${e.className??""}" aria-label="${e.label.replace(/"/g,"&quot;")}">${e.html}</dialog>`;let i=t.querySelector("dialog");for(let[c,m]of Object.entries(e.style??{}))i.style.setProperty(c,m);i.toggleAttribute("data-still",e.still),document.body.appendChild(n);let r=document.documentElement,a=r.style.overflow;r.style.overflow="hidden";let o=!1,l=!1,s=()=>{if(l)return;l=!0,i.open&&i.close(),n.remove(),r.style.overflow=a;let c=e.returnFocus;c?.isConnected&&c.focus({preventScroll:!0}),e.closed?.()},d=(c=!1)=>{if(!l){if(c||e.still){s();return}o||(o=!0,i.dataset.closing="",window.setTimeout(s,200))}};i.addEventListener("cancel",c=>{c.preventDefault(),d()}),i.addEventListener("click",c=>{c.target===i&&d()}),t.addEventListener("click",c=>{c.target?.closest?.("[data-close]")&&d()});try{i.showModal()}catch{i.setAttribute("open","")}return t.querySelector("[data-autofocus]")?.focus({preventScroll:!0}),e.mounted?.(i),d}function ot(e){let n=Number(e?.attributes?.supported_features);if(!isFinite(n))return["hourly","daily"];let t=[];return n&2&&t.push("hourly"),n&4&&t.push("twice_daily"),n&1&&t.push("daily"),t}function It(e){let n=ot(e);return n.includes("daily")?"daily":n.includes("twice_daily")?"twice_daily":null}var Tn=5e3;function Mn(){let e=new WeakMap;return{subscribe(n,t,i,r){let a=e.get(n);a||e.set(n,a=new Map);let o=`${t}|${i}`,l=a.get(o);if(!l){let d={listeners:new Set};l=d,a.set(o,d);let c=m=>{d.last=m;for(let b of[...d.listeners])b(m)};d.unsubscribe=n.subscribeMessage(m=>c({type:m?.type??i,forecast:Array.isArray(m?.forecast)?m.forecast:null}),{type:"weather/subscribe_forecast",entity_id:t,forecast_type:i}).catch(()=>{a.get(o)===d&&a.delete(o),c({type:i,forecast:null,failed:!0})})}let s=l;return clearTimeout(s.closing),s.closing=void 0,s.listeners.add(r),s.last&&r(s.last),()=>{!s.listeners.delete(r)||s.listeners.size||(s.closing=setTimeout(()=>{s.listeners.size||(a.get(o)===s&&a.delete(o),s.unsubscribe?.then(d=>{typeof d=="function"&&d()}).catch(()=>{}))},Tn))}}}}function Dn(){return window.AnimatedWeatherCardForecasts??(window.AnimatedWeatherCardForecasts=Mn())}function at(e,n,t,i){return e?.connection?.subscribeMessage?Dn().subscribe(e.connection,n,t,i):()=>{}}var N=36e5,K=e=>typeof e=="number"&&isFinite(e)?e:void 0,W=e=>Date.parse(e.datetime);function An(e){let n=e.length;if(n===0)return"";if(n===1)return`M${e[0].x.toFixed(1)},${e[0].y.toFixed(1)}`;let t=[],i=[];for(let o=0;o<n-1;o++)t.push(e[o+1].x-e[o].x),i.push((e[o+1].y-e[o].y)/(t[o]||1));let r=[i[0]];for(let o=1;o<n-1;o++)r.push(i[o-1]*i[o]<=0?0:(i[o-1]+i[o])/2);r.push(i[n-2]);for(let o=0;o<n-1;o++){if(i[o]===0){r[o]=0,r[o+1]=0;continue}let l=r[o]/i[o],s=r[o+1]/i[o],d=l*l+s*s;if(d>9){let c=3/Math.sqrt(d);r[o]=c*l*i[o],r[o+1]=c*s*i[o]}}let a=`M${e[0].x.toFixed(1)},${e[0].y.toFixed(1)}`;for(let o=0;o<n-1;o++){let l=e[o],s=e[o+1],d=t[o]/3;a+=` C${(l.x+d).toFixed(1)},${(l.y+r[o]*d).toFixed(1)} ${(s.x-d).toFixed(1)},${(s.y-r[o+1]*d).toFixed(1)} ${s.x.toFixed(1)},${s.y.toFixed(1)}`}return a}function lt(e,n,t){let i=Date.parse(e?.attributes?.next_rising??""),r=Date.parse(e?.attributes?.next_setting??"");if(isNaN(i)||isNaN(r))return null;let a=24*N,o=e?.state!=="below_horizon",l=[],s=o?n:i,d=o||r>i?r:r+a;for(let c=0;c<8&&s<t;c++)d>s&&l.push([Math.max(n,s),Math.min(t,d)]),s=o&&c===0?i:s+a,d+=a;return l}var st=/rainy|pouring|lightning-rainy|snowy|snowy-rainy|hail/;function Pt(e){let n=K(e.precipitation_probability);if(n!==void 0)return n>=50||st.test(e.condition??"")&&n>=30;let t=K(e.precipitation);return t!==void 0?t>=.1:st.test(e.condition??"")}function Rt(e){let n=e.condition??"";if(/lightning/.test(n))return"storms";if(n==="snowy")return"snow";if(/snowy-rainy|hail/.test(n))return"sleet";if(st.test(n))return"rain";let t=K(e.temperature);return t!==void 0&&t<=0?"snow":t!==void 0&&t<=2?"sleet":"rain"}function Ln(e){let n=K(e.precipitation);if(n!==void 0&&n>0)return n>=4?"heavy":n>=1?"moderate":"light";let t=K(e.precipitation_probability);return t!==void 0?t>=70?"moderate":"light":e.condition==="pouring"?"heavy":e.condition==="rainy"?"moderate":"light"}var Wt={light:[7,11,.35],moderate:[5,9,.55],heavy:[3.5,7,.7]};function Hn(e){let n=[];for(let[t,[i,r]]of Object.entries(Wt)){let a=(l,s)=>`<rect x="${l}" y="${s}" width="1" height="5" rx="0.5"/>`,o=(l,s)=>`<circle cx="${l+1}" cy="${s+1}" r="1"/>`;n.push(`<pattern id="${e}-rain-${t}" width="${i}" height="${r*2}" patternUnits="userSpaceOnUse">${a(0,0)}${a(i/2,r)}</pattern>`),n.push(`<pattern id="${e}-snow-${t}" width="${i+1}" height="${(r+1)*2}" patternUnits="userSpaceOnUse">${o(0,0)}${o((i+1)/2,r+1)}</pattern>`),n.push(`<pattern id="${e}-sleet-${t}" width="${i+1}" height="${(r+1)*2}" patternUnits="userSpaceOnUse">${a(0,0)}${o((i+1)/2,r+1)}</pattern>`)}return n.join("")}function je(e,n,t){let i=[],r=e.filter(a=>!isNaN(W(a))&&W(a)+N>n&&W(a)<t&&Pt(a));for(let a of r){let o=Math.max(n,W(a)),l=i[i.length-1],s=Rt(a),d=K(a.precipitation_probability),c=K(a.precipitation);l&&o-l.end<=N+6e4?(l.end=W(a)+N,(s==="storms"||s==="snow"&&l.kind==="rain")&&(l.kind=s),d!==void 0&&(l.chance=Math.max(l.chance??0,d)),c!==void 0&&(l.amount=(l.amount??0)+c)):i.push({start:o,end:W(a)+N,kind:s,chance:d,amount:c})}return i}function ct(e,n,t,i){return e.start<=n+6e4?w(i,"until_time",{time:C(e.end,i)}):e.end>t?w(i,"from_time",{time:C(e.start,i)}):Gt(e.start,e.end,i)}var he=(e,n)=>w(n,e);function Gt(e,n,t){let i=C(e,t),r=C(n,t),[,a,o]=i.match(/^(.*?)\s*([^\d\s:]+\.?\s?[^\d\s:]*)?$/)??[],[,l,s]=r.match(/^(.*?)\s*([^\d\s:]+\.?\s?[^\d\s:]*)?$/)??[];return o&&s&&o===s?`${a}\u2013${l} ${s}`:`${i}\u2013${r}`}var me;function J(e,n,t){if(me===void 0)try{me=document.createElement("canvas").getContext("2d")}catch{me=null}if(me){me.font=`${t} ${n}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Roboto, "Segoe UI", system-ui, sans-serif`;let i=me.measureText(e).width;if(i>0)return i}return e.length*n*.56}function fe(e){let n=e.hass,{lanes:t}=e,i=t.top+t.gap+t.amp+t.gap+t.bottom,r=e.now+e.windowHours*N,a=e.hours.filter(p=>!isNaN(W(p))&&K(p.temperature)!==void 0&&W(p)>e.now+10*6e4&&W(p)<=r),o=e.current??K(e.hours.find(p=>W(p)<=e.now+N)?.temperature);if(o===void 0||!a.length)return{html:"",summary:"",requiredDropped:!1,height:i};let l=[{t:e.now,v:o},...a.map(p=>({t:W(p),v:K(p.temperature),entry:p}))],s=l[l.length-1].t,d=e.width/(e.windowHours*N),c=p=>(p-e.now)*d,m=l.map(p=>p.v),b=Math.max(...m),y=Math.min(...m),h=Math.max(b-y,/F/.test(e.unit)?10:6),f=b+(h-(b-y))/2,u=t.top+t.gap,x=p=>u+(f-p)/h*t.amp,_=i+e.groundBelow,T=l.map(p=>({x:c(p.t),y:x(p.v)})),D=An(T),Se=`${D} L${T[T.length-1].x.toFixed(1)},${_} L0,${_} Z`,z=`awcl${Math.random().toString(36).slice(2,8)}`,k=lt(e.sun,e.now,s)??[[e.now,s]],V=k.map(([p,v])=>`<rect x="${c(p).toFixed(1)}" y="-40" width="${(c(v)-c(p)).toFixed(1)}" height="${_+80}"/>`).join(""),j=[],F=e.now;for(let[p,v]of k)p>F&&j.push(`<rect x="${c(F).toFixed(1)}" y="-40" width="${(c(p)-c(F)).toFixed(1)}" height="${_+80}"/>`),F=Math.max(F,v);F<s&&j.push(`<rect x="${c(F).toFixed(1)}" y="-40" width="${(c(s)-c(F)+4).toFixed(1)}" height="${_+80}"/>`);let oe=k.flatMap(([p,v])=>[p>e.now+6e4?p:null,v<s-6e4?v:null]).filter(p=>p!==null),Fe=e.twilight?oe.map(p=>`<ellipse cx="${c(p).toFixed(1)}" cy="${_}" rx="${Math.max(30,1.4*N*d).toFixed(1)}" ry="10" fill="url(#${z}-tw)" class="awc-line-twilight"/>`).join(""):"",Ce=a.filter(Pt).map(p=>{let v=Rt(p),S=Ln(p),E=N,O=`url(#${z}-${v==="storms"?"rain":v}-${S})`;return`<rect x="${c(W(p)).toFixed(1)}" y="0" width="${(E*d).toFixed(1)}" height="${_}" fill="${O}" opacity="${Wt[S][2]}"/>`}).join(""),Ee=je(e.hours,e.now,r),A=e.size==="lg"?{value:[22,400],small:[15,500]}:{value:[15,600],small:[13,500]},ae=(p,v,S,E,O,q,Q=!1)=>{let un=S==="center"?v-q/2:S==="end"?v-q:v;return{lane:p,x:Math.max(0,Math.min(e.width-q,un)),w:q,html:E,text:O,align:S,required:Q}},Ke=p=>w(n,p),ye=[];Ee.slice(0,e.maxBands).forEach((p,v)=>{if(v===0&&e.skipFirstBand)return;let S=ct(p,e.now,r,n),E=e.bandDetail?p.chance!==void 0?` \xB7 ${H(Math.round(p.chance/10)*10,n)}`:p.amount!==void 0?` \xB7 ${ie(p.amount,n,p.amount<10?1:0)} mm`:"":"",O=`${Ke(p.kind)} ${S}${E}`,q=`${Ke(p.kind)} ${S}`,Q=ae("top",c(Math.max(e.now,p.start)),"start",`<span class="awc-line-small">${R(O,"awc-ampm")}</span>`,O,J(O,A.small[0],A.small[1]),v===0);Q.shorter=()=>E?ae("top",Q.x,"start",`<span class="awc-line-small">${R(q,"awc-ampm")}</span>`,q,J(q,A.small[0],A.small[1]),v===0):null,ye.push(Q)});let Te=o,gt=(p,v,S)=>{let E=$(p.v,n),O=C(p.t,n),q=J(E,A.value[0],A.value[1])+5+J(O,A.small[0],A.small[1]);if(e.extremeTimes===!1)return ae(v,c(p.t),"center",`<span class="awc-line-value">${g(E)}</span>`,E,J(E,A.value[0],A.value[1]),S);let Q=ae(v,c(p.t),"center",`<span class="awc-line-value">${g(E)}</span><span class="awc-line-small">${R(O,"awc-ampm")}</span>`,`${E} ${O}`,q,S);return Q.shorter=()=>ae(v,c(p.t),"center",`<span class="awc-line-value">${g(E)}</span>`,E,J(E,A.value[0],A.value[1]),S),Q},yt=/F/.test(e.unit)?3:2,se=l.slice(1).reduce((p,v)=>v.v>p.v?v:p,l[1]),le=l.slice(1).reduce((p,v)=>v.v<p.v?v:p,l[1]),we=se.v-Te>=yt,Me=Te-le.v>=yt;we&&ye.push(gt(se,"top",!Ee.length)),Me&&ye.push(gt(le,"bottom",!Ee.length&&!we));let be=l[l.length-1];if(!e.noEnd&&!(we&&se===be)&&!(Me&&le===be)){let p=C(be.t,n),v=we||Me?p:`${$(be.v,n)} ${p}`;ye.push(ae("bottom",c(be.t),"end",`<span class="awc-line-small">${R(v,"awc-ampm")}</span>`,v,J(v,A.small[0],A.small[1])))}let De=[],wt=!1,sn=p=>(p.lane!=="bottom"||p.x>=16)&&De.every(v=>v.lane!==p.lane||p.x+p.w+12<=v.x||v.x+v.w+12<=p.x);for(let p of ye){let S=[p,p.shorter?.()].filter(E=>!!E).find(sn);S?De.push(S):p.required&&(wt=!0)}let ln=e.axis?(()=>{let p=[],v=e.windowHours<=12?3:e.windowHours<=24?6:12,S=Math.ceil(e.now/N)*N;for(;de(S,n)%v!==0;)S+=N;for(;S<s;S+=v*N){if(c(S)<24)continue;let E=de(S,n)===0,O=E?P(new Date(S),n,"short").toUpperCase():C(S,n);p.push(`<span class="awc-line-tick${E?" day":""}" style="left: ${c(S).toFixed(1)}px">${g(O)}</span>`)}return`<div class="awc-line-axis" aria-hidden="true">${p.join("")}</div>`})():"",cn=e.sun?.state==="below_horizon",Ae=e.dot[0],dn=De.map(p=>{let v=p.lane==="top"?0:t.top+t.gap*2+t.amp;return`<span class="awc-line-label ${p.lane}" style="left: ${p.x.toFixed(1)}px; top: ${v}px; height: ${p.lane==="top"?t.top:t.bottom}px">${p.html}</span>`}).join(""),bt=[`${w(n,"next_hours")}: ${w(n,"now").toLowerCase()} ${$(Te,n)}`,we?`${w(n,"high").toLowerCase()} ${$(se.v,n)}, ${C(se.t,n)}`:"",Me?`${w(n,"low").toLowerCase()} ${$(le.v,n)}, ${C(le.t,n)}`:"",...Ee.map(p=>`${Ke(p.kind)} ${Gt(Math.max(e.now,p.start),p.end,n)}${p.chance!==void 0?`, ${w(n,"chance",{percent:H(Math.round(p.chance/10)*10,n)})}`:""}`)].filter(Boolean).join(". ");return{html:`<div class="awc-line" role="img" aria-label="${g(bt)}" style="height: ${i}px"><svg class="awc-line-svg" width="${e.width.toFixed(0)}" height="${i}" viewBox="0 0 ${e.width.toFixed(0)} ${i}" aria-hidden="true"><defs>${Hn(z)}<radialGradient id="${z}-tw"><stop offset="0" class="awc-line-tw-stop"/><stop offset="1" class="awc-line-tw-stop end"/></radialGradient><clipPath id="${z}-day">${V}</clipPath><clipPath id="${z}-night">${j.join("")}</clipPath><clipPath id="${z}-area"><path d="${Se}"/></clipPath></defs>`+Fe+`<g class="awc-line-rain" clip-path="url(#${z}-area)">${Ce}</g>`+(e.groundBelow?"":`<line class="awc-line-ground" x1="0" x2="${e.width.toFixed(0)}" y1="${_-.5}" y2="${_-.5}"/>`)+`<line class="awc-line-now" x1="0.5" x2="0.5" y1="0" y2="${_}"/><path class="awc-line-path night" d="${D}" clip-path="url(#${z}-night)"/><path class="awc-line-path" d="${D}" clip-path="url(#${z}-day)"/>`+De.filter(p=>p.text.includes("\xB0")&&p.align==="center").map(p=>{let v=p.lane==="top"?se:le;return`<circle class="awc-line-mark" cx="${c(v.t).toFixed(1)}" cy="${x(v.v).toFixed(1)}" r="2.5"/>`}).join("")+`</svg><span class="awc-line-dot${cn?" night":""}" style="top: ${x(Te).toFixed(1)}px; width: ${Ae}px; height: ${Ae}px; margin: ${-Ae/2}px 0 0 ${-Ae/2}px"></span>`+dn+ln+"</div>",summary:bt,requiredDropped:wt,height:i+(e.axis?18:0),x:c,y:x,ground:_}}function $e(e){return`
        .awc-line { position: relative; width: 100%; }
        .awc-line-svg { position: absolute; left: 0; top: 0; overflow: visible; }
        .awc-line-path { fill: none; stroke: currentColor; stroke-width: var(--awc-line-w, 2.25px); stroke-linecap: round; stroke-linejoin: round; }
        .awc-line-path.night { stroke-dasharray: 2 5; opacity: 0.85; }
        .awc-line-now { stroke: currentColor; stroke-opacity: 0.3; stroke-width: 1; stroke-dasharray: 2 4; }
        .awc-line-ground { stroke: currentColor; stroke-opacity: 0.2; stroke-width: 1; }
        .awc-line-svg pattern :is(rect, circle) { fill: currentColor; }
        .awc-line-mark { fill: currentColor; }
        .awc-line-tw-stop { stop-color: #ffb98a; stop-opacity: 0.38; }
        .awc-line-tw-stop.end { stop-opacity: 0; }
        /* Now: a plain disc in the line's colour, ringed in the sky; never a second sun */
        .awc-line-dot { position: absolute; left: 0; border-radius: 50%; background: currentColor; box-shadow: 0 0 0 2px var(--awc-sky-mid, transparent); }
        .awc-line-label { position: absolute; display: flex; align-items: center; gap: 5px; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .awc-line-value { font-size: 15px; line-height: 16px; font-weight: 600; letter-spacing: -0.01em; }
        .awc-line-small { font-size: 13px; line-height: 16px; font-weight: 500; }
        .awc-line.lg .awc-line-value { font-size: 22px; line-height: 26px; font-weight: 400; letter-spacing: -0.02em; }
        .awc-line.lg .awc-line-small { font-size: 15px; line-height: 18px; }
        .awc-line-axis { position: absolute; left: 0; right: 0; bottom: -18px; height: 14px; }
        .awc-line-tick { position: absolute; transform: translateX(-50%); font-size: 11px; line-height: 14px; font-weight: 500; letter-spacing: 0.04em; opacity: var(--awc-secondary, 0.8); white-space: nowrap; }
        .awc-line-tick.day { font-weight: 600; letter-spacing: 0.06em; }
        ${e} .awc-line-path { stroke: var(--primary-color); }
        ${e} :is(.awc-line-now, .awc-line-ground) { stroke: var(--divider-color, rgba(0, 0, 0, 0.12)); stroke-opacity: 1; }
        ${e} .awc-line-svg pattern :is(rect, circle) { fill: var(--secondary-text-color); }
        ${e} .awc-line-tw-stop { stop-opacity: 0; }
        ${e} .awc-line-dot { background: var(--primary-color); box-shadow: 0 0 0 2px var(--ha-card-background, var(--card-background-color, #fff)); }
        ${e} .awc-line-mark { fill: var(--primary-color); }
        ${e} .awc-line-tick { color: var(--secondary-text-color); opacity: 1; }
    `}var M=e=>typeof e=="number"&&isFinite(e)?e:typeof e=="string"&&e.trim()!==""&&isFinite(Number(e))?Number(e):void 0;function B(e,n,t,i=0){let r=M(e);return r===void 0?"":`${ie(r,t,i)}${n?` ${n}`:""}`}function jt(e,n,t,i){let r=e?.attributes??{},a=(h,f)=>re(t,`ui.card.weather.attributes.${h}`,f),o=[],l=B(r.wind_speed,r.wind_speed_unit,t);if(l){let h=B(r.wind_gust_speed,r.wind_speed_unit,t);o.push({label:a("wind_speed","Wind speed"),value:l,sub:h?`${a("wind_gust_speed","Wind gust speed")} ${h}`:void 0,arrow:M(r.wind_bearing)})}let s=B(r.humidity,"%",t).replace(" %","%");if(s){let h=M(r.dew_point);o.push({label:a("humidity","Humidity"),value:s,sub:h!==void 0?`${a("dew_point","Dew point")} ${$(h,t)}`:void 0})}let d=B(r.uv_index,"",t);d&&o.push({label:a("uv_index","UV index"),value:d});let c=B(r.visibility,r.visibility_unit,t);c&&o.push({label:a("visibility","Visibility"),value:c});let m=B(r.pressure,r.pressure_unit,t);m&&o.push({label:a("air_pressure","Air pressure"),value:m});let b=B(r.cloud_coverage,"%",t).replace(" %","%");b&&o.push({label:a("cloud_coverage","Cloud coverage"),value:b});let y=n.days.find(h=>h.isToday);if(y?.precipitation!==void 0&&o.push({label:a("precipitation","Precipitation"),value:B(y.precipitation,r.precipitation_unit??"mm",t,1)}),i?.attributes?.next_setting&&i?.attributes?.next_rising){let h=i.state!=="below_horizon",f=h?i.attributes.next_setting:i.attributes.next_rising,u=h?i.attributes.next_rising:i.attributes.next_setting;o.push({label:w(t,h?"sunset":"sunrise"),value:R(tt(f,t),"awc-ampm"),sub:`${w(t,h?"sunrise":"sunset")} ${tt(u,t)}`})}return o}function qt(e){return e.length?`<div class="pp-details">${e.map(n=>`<div class="pp-detail" role="group"><div class="pp-detail-label">${g(n.label)}</div><div class="pp-detail-value">${n.value.includes("<span")?n.value:g(n.value)}${n.arrow!==void 0?`<ha-icon class="pp-arrow" icon="mdi:navigation" style="transform: rotate(${(n.arrow+180)%360}deg)" aria-hidden="true"></ha-icon>`:""}</div>`+(n.sub?`<div class="pp-detail-sub">${g(n.sub)}</div>`:"")+"</div>").join("")}</div>`:""}function Nn(e){if(e.theme)return{};let n=He.includes(e.condition)?e.condition:"sunny",t=Ne(n,e.phase||"day");return{"--awc-sky-top":t.top,"--awc-sky-mid":t.mid,"--awc-sky-bottom":t.bottom,"--awc-sky-glow":t.glow,"--awc-sky-scrim":t.scrim}}function Yt(e,n){let t=e.hass,i=ve({hourly:n.hourly,daily:n.daily,dailyType:n.dailyType,now:Date.now(),current:e.current,hass:t,dayCount:10}),r=t?.states[e.entityId],a=t?.states["sun.sun"],o=String(r?.attributes?.friendly_name??""),l=r?G(r.state,t,e.entityId):"",s=M(r?.attributes?.apparent_temperature);return{hass:t,model:i,weather:r,sun:a,place:o,condition:l,feels:s}}function Kt(e,n){return`<div class="pp-bar"><button type="button" class="pp-close" data-close aria-label="${g(re(e,"ui.common.close",w(e,"close")))}"><span><ha-icon icon="mdi:close"></ha-icon></span></button><h2 id="awc-sheet-title" tabindex="-1" data-autofocus><span class="awc-visually-hidden">${g(w(e,"forecast"))}, </span>${g(n)}</h2></div>`}function zn(e,n){let t=r=>r.wet?`wet-${r.kind}`:(r.condition??"").replace("clear-night","sunny"),i=[];return e.forEach((r,a)=>{let o=i[i.length-1];if(o&&t(e[a-1])===t(r)){o.span++;return}let l=r.wet?w(n,r.kind??"rain"):G(r.condition,n);i.push({start:a,span:1,text:l})}),`<div class="pp-runs" aria-hidden="true" style="--awc-cols: ${e.length}">${i.map(r=>`<span style="grid-column: ${r.start+1} / span ${r.span}">${g(r.text)}</span>`).join("")}</div>`}function On(e,n){let{hass:t,model:i,weather:r,sun:a,place:o,condition:l,feels:s}=Yt(e,n),d=ue(i.hours,Date.now(),24,1,t,!0),c=e.phase==="night";return`
      <div class="pp-content">
        ${e.theme?"":`<div class="pp-light ${c?"moon":"sun"}" aria-hidden="true"></div>`}
        ${Kt(t,o)}
        <div class="pp-hero">
          <div class="pp-temp">${g($(e.current,t).replace("\xB0",""))}<span class="pp-deg">\xB0</span></div>
          <div class="pp-desc-line"><span class="pp-desc">${g(l)}</span><span class="awc-hl-line pp-hl">${pe(i.today,t)}</span></div>
          ${s!==void 0?`<div class="pp-feels">${g(w(t,"feels_like"))} ${g($(s,t))}</div>`:""}
          ${e.note?`<p class="pp-note">${g(e.note)}</p>`:""}
        </div>
        ${d.length?`<div class="pp-block"><section class="pp-hours" role="region" tabindex="0" aria-label="${g(w(t,"next_hours"))}"><div class="pp-hours-track">${zn(d,t)}${_e(d,!1,t,"pp-hour-grid")}</div></section></div>`:""}
        <div class="pp-block pp-lower">
          ${i.days.length?`<div class="pp-days">${Y(i.days,i,t,e.current)}</div>`:""}
          ${qt(jt(r,i,t,a))}
        </div>
        <button type="button" class="pp-more" data-more>${g(w(t,"more_info"))}<span aria-hidden="true">\u203A</span></button>
      </div>`}function Vt(e,n,t){let i=e.hass,r=i?.states[e.entityId],a=r?.attributes??{},o=Date.now(),l=(m,b)=>[M(m.precipitation_probability)!==void 0?`${w(i,"rain")} ${Math.round(M(m.precipitation_probability))}%`:"",M(m.precipitation)?B(m.precipitation,a.precipitation_unit??"mm",i,1):"",M(m.wind_speed)!==void 0?`${re(i,"ui.card.weather.attributes.wind_speed","Wind")} ${B(m.wind_speed,b,i)}${M(m.wind_gust_speed)!==void 0?`, ${w(i,"gusts")} ${B(m.wind_gust_speed,b,i)}`:""}`:"",M(m.humidity)!==void 0?`${re(i,"ui.card.weather.attributes.humidity","Humidity")} ${Math.round(M(m.humidity))}%`:"",M(m.uv_index)!==void 0?`UV ${Math.round(M(m.uv_index))}`:"",M(m.cloud_coverage)!==void 0?`${re(i,"ui.card.weather.attributes.cloud_coverage","Cloud coverage")} ${Math.round(M(m.cloud_coverage))}%`:"",M(m.dew_point)!==void 0?`${re(i,"ui.card.weather.attributes.dew_point","Dew point")} ${$(M(m.dew_point),i)}`:""].filter(Boolean),s={t:o,label:w(i,"now"),temp:e.current,condition:r?.state,facts:l(a,a.wind_speed_unit)},d=new Date(o).toDateString(),c=t.hours.filter(m=>Date.parse(m.datetime)>o+10*6e4).map(m=>{let b=Date.parse(m.datetime),y=C(b,i),h=new Date(b).toDateString()===d?"":`${P(new Date(b),i,"short")} `;return{t:b,label:`${h}${y}`,temp:m.temperature,condition:m.condition,facts:l(m,a.wind_speed_unit)}});return[s,...c]}function Ut(){let e=window.innerWidth||393;return e<600?{width:e-48,hours:24}:{width:Math.min(960,e-64)-64,hours:48}}function In(e,n){let{hass:t,model:i,weather:r,sun:a,place:o,condition:l,feels:s}=Yt(e,n),d=Ut(),c=fe({hass:t,hours:i.hours,now:Date.now(),current:e.current,unit:e.unit,width:d.width,windowHours:d.hours,lanes:{top:28,gap:4,amp:d.hours>24?128:112,bottom:28},groundBelow:0,sun:t?.states["sun.sun"],dot:[7,7],maxBands:3,bandDetail:!1,size:"lg",axis:!0}),b=Vt(e,n,i).filter(y=>y.t<=Date.now()+d.hours*36e5).length;return`
      <div class="pp-content">
        ${Kt(t,o)}
        <div class="pp-hero pp-hero-c">
          <div class="pp-temp">${g($(e.current,t).replace("\xB0",""))}<span class="pp-deg">\xB0</span><span class="pp-hl-stack">${pe(i.today,t)}</span></div>
          <div class="pp-desc">${g(l)}</div>
          ${s!==void 0?`<div class="pp-feels">${g(w(t,"feels_like"))} ${g($(s,t))}</div>`:""}
          ${e.note?`<p class="pp-note">${g(e.note)}</p>`:""}
        </div>
        ${c.html?`<div class="pp-block pp-scrub">
          <div class="pp-readout" aria-hidden="true">
            <div class="pp-read-1"><span class="pp-read-time"></span><button type="button" class="pp-now" hidden>${g(w(t,"now"))} \u203A</button></div>
            <div class="pp-read-2"><span class="pp-read-temp"></span><span class="pp-read-cond"></span></div>
            <div class="pp-read-3"></div>
          </div>
          <div class="pp-plot" role="slider" tabindex="0" aria-label="${g(w(t,"next_hours"))}" aria-valuemin="0" aria-valuemax="${Math.max(0,b-1)}" aria-valuenow="0">
            ${c.html.replace('class="awc-line"','class="awc-line lg"')}
            <div class="pp-marker" aria-hidden="true"><i class="pp-marker-line" style="height: ${c.ground??0}px"></i><i class="pp-marker-ring"></i></div>
          </div>
        </div>`:""}
        <div class="pp-block pp-lower">
          ${i.days.length?`<div class="pp-days">${Y(i.days,i,t,e.current)}</div>`:""}
          ${qt(jt(r,i,t,a))}
        </div>
        <button type="button" class="pp-more" data-more>${g(w(t,"more_info"))}<span aria-hidden="true">\u203A</span></button>
      </div>`}function Pn(e,n,t){let i=e.querySelector(".pp-plot");if(!i)return;let r=ve({hourly:t.hourly,daily:t.daily,dailyType:t.dailyType,now:Date.now(),current:n.current,hass:n.hass,dayCount:10}),a=Ut(),o=Vt(n,t,r).filter(k=>k.t<=Date.now()+a.hours*36e5);if(!o.length)return;let l=a.width/(a.hours*36e5),s=k=>Math.max(0,(k.t-o[0].t)*l),d=o.map(k=>k.temp).filter(k=>typeof k=="number"),c=Math.max(Math.max(...d)-Math.min(...d),/F/.test(n.unit)?10:6),m=Math.max(...d)+(c-(Math.max(...d)-Math.min(...d)))/2,b=a.hours>24?128:112,y=k=>32+(m-k)/c*b,h=e.querySelector(".pp-marker"),f=e.querySelector(".pp-marker-ring"),u=k=>e.querySelector(k),x=u(".pp-now"),_=0,T=!1,D=(k,V=!1)=>{let j=Math.max(0,Math.min(o.length-1,k));j!==_&&V&&window.dispatchEvent(new CustomEvent("haptic",{detail:"selection"})),_=j;let F=o[_];h.style.transform=`translateX(${s(F).toFixed(1)}px)`,typeof F.temp=="number"&&(f.style.top=`${y(F.temp).toFixed(1)}px`);let oe=u(".pp-read-time");oe&&(oe.innerHTML=R(F.label,"awc-ampm"));let Fe=u(".pp-read-temp");Fe&&(Fe.textContent=$(F.temp,n.hass));let Ye=u(".pp-read-cond");Ye&&(Ye.textContent=G(F.condition,n.hass));let Ce=u(".pp-read-3");Ce&&(Ce.textContent=F.facts.join(" \xB7 ")),x&&(x.hidden=_===0),i.setAttribute("aria-valuenow",String(_)),i.setAttribute("aria-valuetext",`${F.label}: ${$(F.temp,n.hass)}, ${G(F.condition,n.hass)}${F.facts.length?`. ${F.facts.join(", ")}`:""}`)},Se=k=>{let V=k-i.getBoundingClientRect().left,j=0;return o.forEach((F,oe)=>{Math.abs(s(F)-V)<Math.abs(s(o[j])-V)&&(j=oe)}),j};i.addEventListener("pointerdown",k=>{T=!0,i.setPointerCapture?.(k.pointerId),D(Se(k.clientX),k.pointerType==="touch")}),i.addEventListener("pointermove",k=>{T&&D(Se(k.clientX),k.pointerType==="touch")});let z=()=>{T=!1};i.addEventListener("pointerup",z),i.addEventListener("pointercancel",z),i.addEventListener("keydown",k=>{let V={ArrowRight:1,ArrowLeft:-1,PageDown:6,PageUp:-6};if(k.key in V)D(_+V[k.key]);else if(k.key==="Home")D(0);else if(k.key==="End")D(o.length-1);else return;k.preventDefault()}),x?.addEventListener("click",()=>D(0)),D(0)}var Rn=`
    ${$e("dialog.theme")}
    .pp-hero-c .pp-temp { display: flex; align-items: center; }
    .pp-hl-stack { display: grid; margin: 0.06em 0 0 0.18em; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif; font-size: 17px; line-height: 20px; font-weight: 500; letter-spacing: -0.01em; }
    .pp-hero-c .pp-desc { display: block; margin-top: 8px; }
    .pp-scrub { margin-top: 20px; }
    .pp-readout { height: 90px; overflow: hidden; }
    .pp-read-1 { display: flex; align-items: baseline; justify-content: space-between; font-size: 22px; line-height: 28px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .pp-read-2 { display: flex; gap: 8px; align-items: baseline; font-size: 17px; line-height: 22px; }
    .pp-read-temp { font-weight: 600; font-variant-numeric: tabular-nums; }
    .pp-read-cond { font-weight: 400; }
    .pp-read-3 { font-size: 15px; line-height: 20px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
    .pp-now { min-height: 44px; margin: -8px -8px -8px 0; padding: 0 8px; border: 0; background: none; color: inherit; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
    .pp-now[hidden] { display: none; }
    .pp-plot { position: relative; margin-top: 8px; padding-bottom: 18px; touch-action: pan-y; cursor: ew-resize; outline: none; }
    .pp-plot:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 4px; }
    .pp-marker { position: absolute; left: 0; top: 0; width: 0; height: 100%; pointer-events: none; transition: transform 90ms var(--ease-out); }
    .pp-marker-line { position: absolute; left: 0; top: 0; width: 1px; background: currentColor; opacity: 0.6; }
    .pp-marker-ring { position: absolute; left: -6px; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; border: 2px solid currentColor; box-sizing: border-box; box-shadow: 0 0 0 3px color-mix(in srgb, var(--awc-sky-mid, transparent) 50%, transparent); transition: top 90ms var(--ease-out); }
    dialog[data-still] :is(.pp-marker, .pp-marker-ring) { transition: none; }
    @media (prefers-reduced-motion: reduce) { :is(.pp-marker, .pp-marker-ring) { transition: none; } }
    @media (min-width: 600px) { .pp-readout { height: 98px; } .pp-read-1 { font-size: 28px; line-height: 32px; } .pp-read-2 { font-size: 20px; line-height: 26px; } }
    dialog.theme .pp-marker-line { background: var(--primary-color); opacity: 1; }
    dialog.theme .pp-marker-ring { border-color: var(--primary-color); box-shadow: none; }
`,Wn=te(I(ze)),Bt=`
    ${ke("dialog.theme")}
    dialog {
      box-sizing: border-box;
      padding: 0;
      border: 0;
      color: ${Wn};
      background: var(--awc-sky-mid, #2c4a73);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      --awc-secondary: ${Oe};
      --ease-out: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-in: cubic-bezier(0.5, 0, 0.75, 0);
      overflow: hidden;
      text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
    }
    dialog.theme {
      color: var(--primary-text-color);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      --awc-secondary: 1;
      text-shadow: none;
    }
    dialog::backdrop { background: rgba(4, 8, 20, 0.45); }
    /* Phone: a full-screen sheet that rises 24 px into place */
    dialog { width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0; border-radius: 0; }
    dialog[open] { animation: pp-in 280ms var(--ease-out); }
    dialog[open]::backdrop { animation: pp-fade 240ms linear; }
    dialog[data-closing] { animation: pp-out 200ms var(--ease-in) forwards; }
    dialog[data-closing]::backdrop { animation: pp-fade 200ms linear reverse forwards; }
    @keyframes pp-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @keyframes pp-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(16px); } }
    @keyframes pp-fade { from { opacity: 0; } to { opacity: 1; } }
    /* Still (reduced motion, animate: false): a short fade, no movement */
    dialog[data-still][open] { animation: pp-fade 120ms linear; }
    dialog[data-still][open]::backdrop { animation: none; }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: pp-fade 120ms linear; } dialog[data-closing] { animation: none; } dialog::backdrop { animation: none !important; } }
    /* Tablet and up: sized for reading, centred, scaling in from 0.98 */
    @keyframes pp-in-tablet { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
    @keyframes pp-out-tablet { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(0.98); } }
    @media (min-width: 600px) {
      dialog {
        width: min(960px, 100vw - 64px);
        height: auto;
        max-height: min(720px, 100dvh - 64px);
        margin: auto;
        border-radius: var(--ha-dialog-border-radius, 28px);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      }
      dialog[open] { animation-name: pp-in-tablet; }
      dialog[data-closing] { animation-name: pp-out-tablet; }
    }

    /* The sky is painted on what scrolls, so the light stays at its top */
    .pp-content {
      position: relative;
      box-sizing: border-box;
      max-height: 100dvh;
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 24px calc(env(safe-area-inset-bottom, 0px) + 32px);
      container: sheet / inline-size;
      background:
        radial-gradient(45% 260px at 86% 60px, var(--awc-sky-glow, transparent), transparent 64%),
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim, transparent) 100%),
        linear-gradient(180deg, var(--awc-sky-top, transparent) 0%, var(--awc-sky-mid, transparent) 55%, var(--awc-sky-bottom, transparent) 100%);
    }
    dialog.theme .pp-content { background: none; }
    @media (min-width: 600px) { .pp-content { max-height: min(720px, 100dvh - 64px); height: auto; padding: 16px 32px 32px; } }

    /* The sun or the moon, still: the sheet is for reading */
    .pp-light { position: absolute; left: 84%; top: calc(env(safe-area-inset-top, 0px) + 96px); width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; pointer-events: none; }
    .pp-light.sun {
      background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #fff3d6 34%, #ffd67a 70%, #ffb547 100%);
      box-shadow: 0 0 18px 4px rgba(255, 214, 140, 0.55), 0 0 64px 18px rgba(255, 214, 140, 0.24);
    }
    .pp-light.moon {
      width: 34px; height: 34px; margin: -17px 0 0 -17px;
      background: radial-gradient(circle at 34% 30%, #fbfaf4 0%, #ece8dc 55%, #cfcabc 100%);
      box-shadow: 0 0 16px 2px rgba(226, 232, 255, 0.28), 0 0 56px 12px rgba(190, 206, 255, 0.12);
    }

    .pp-bar { position: relative; display: flex; align-items: center; gap: 6px; min-height: 44px; }
    .pp-bar h2 { margin: 0; font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.01em; outline: none; }
    .pp-close { width: 44px; height: 44px; margin-left: -7px; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; display: grid; place-items: center; }
    .pp-close:active > span { transform: scale(0.94); }
    .pp-close > span { transition: transform 120ms var(--ease-out); }
    .pp-close > span { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, currentColor 14%, transparent); --mdc-icon-size: 18px; }
    dialog.theme .pp-close > span { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); }
    .pp-close:focus-visible > span, .pp-more:focus-visible, .pp-hours:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }

    .pp-hero { position: relative; }
    .pp-temp {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      font-size: 80px; line-height: 0.9; font-weight: 200; letter-spacing: -0.045em;
      font-variant-numeric: tabular-nums; margin: 4px 0 0 -0.055em;
    }
    dialog.theme .pp-temp { color: var(--primary-color, var(--primary-text-color)); }
    .pp-deg { margin-left: 0.02em; letter-spacing: 0; }
    .pp-desc-line { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 12px; margin-top: 8px; max-width: 65%; }
    .pp-desc { font-size: 17px; line-height: 22px; font-weight: 600; letter-spacing: -0.012em; }
    .pp-hl { display: inline-flex; gap: 10px; font-size: 15px; line-height: 20px; }
    .pp-feels { margin-top: 2px; font-size: 15px; line-height: 20px; opacity: var(--awc-secondary); }
    dialog.theme .pp-feels { color: var(--secondary-text-color); }
    .pp-note { max-width: 46ch; margin: 10px 0 0; font-size: 15px; line-height: 20px; text-wrap: pretty; }

    .pp-block { position: relative; margin-top: 20px; padding-top: 14px; }
    .pp-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    dialog.theme .pp-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }

    /* The next 24 hours scroll, from now */
    .pp-hours { overflow-x: auto; scrollbar-width: none; margin-inline: -24px; padding-inline: 24px; scroll-snap-type: x proximity;
      -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent);
      mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent); }
    .pp-hours::-webkit-scrollbar { display: none; }
    .pp-hours-track { width: max-content; }
    .pp-hour-grid { grid-template-columns: repeat(var(--awc-cols), 52px); column-gap: 4px; }
    .pp-runs { display: grid; grid-template-columns: repeat(var(--awc-cols), 52px); column-gap: 4px; margin-bottom: 6px; font-size: 13px; line-height: 16px; font-weight: 600; }
    .pp-runs > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; }
    @media (min-width: 600px) { .pp-hours { margin-inline: -32px; padding-inline: 32px; } }

    .pp-days .awc-days { row-gap: 10px; }
    .pp-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 16px; margin-top: 24px; }
    .pp-detail-label { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: var(--awc-secondary); }
    .pp-detail-value { display: flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 18px; line-height: 24px; font-weight: 500; letter-spacing: -0.012em; font-variant-numeric: tabular-nums; }
    .pp-detail-sub { margin-top: 2px; font-size: 13px; line-height: 18px; opacity: var(--awc-secondary); }
    dialog.theme :is(.pp-detail-label, .pp-detail-sub) { color: var(--secondary-text-color); }
    .pp-arrow { --mdc-icon-size: 14px; opacity: var(--awc-secondary); }
    .awc-ampm { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }
    @container sheet (min-width: 640px) {
      .pp-temp { font-size: 96px; letter-spacing: -0.05em; }
      .pp-lower { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); column-gap: 40px; align-items: start; }
      .pp-lower .pp-details { margin-top: 0; }
    }

    .pp-more {
      position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%;
      min-height: 44px; margin-top: 24px; padding: 14px 0 0; border: 0; background: none; color: inherit; cursor: pointer;
      font: inherit; font-size: 15px; line-height: 20px; font-weight: 500; text-align: left;
    }
    .pp-more::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .pp-more > span { opacity: var(--awc-secondary); font-size: 20px; }
`,dt={a:{css:Bt,html:On,className:"pp-a"},c:{css:Bt+Rn,html:In,className:"pp-c",wire:Pn}};function Zt(e){let n=(e.variant&&Object.prototype.hasOwnProperty.call(dt,e.variant)?dt[e.variant]:void 0)??dt.a,t=e.hass?.states[e.entityId],i={hourly:e.hourly,daily:e.daily,dailyType:e.dailyType??It(t)},r=[],a,o=()=>{if(!a)return;let c=a.querySelector(".pp-content"),m=a.querySelector(".pp-hours"),b=c?.scrollTop??0,y=m?.scrollLeft??0,h=a.getRootNode()instanceof ShadowRoot?a.getRootNode().activeElement:null,f=h?.matches("[data-close]")?"[data-close]":h?.matches("[data-more]")?"[data-more]":null;a.innerHTML=n.html(e,i),s(a);let u=a.querySelector(".pp-content");u&&(u.scrollTop=b);let x=a.querySelector(".pp-hours");x&&(x.scrollLeft=y),f&&a.querySelector(f)?.focus({preventScroll:!0})},l=()=>{},s=c=>{Be(c),n.wire?.(c,e,i),c.querySelector("[data-more]")?.addEventListener("click",()=>{l(!0),e.openMoreInfo()})};l=Ot({label:`${w(e.hass,"forecast")}`,css:n.css,html:n.html(e,i),className:[n.className,e.theme?"theme":""].filter(Boolean).join(" "),style:Nn(e),returnFocus:e.returnFocus,still:e.still,mounted:c=>{a=c,c.setAttribute("aria-labelledby","awc-sheet-title"),c.removeAttribute("aria-label"),s(c)},closed:()=>{for(let c of r)c()}});let d=ot(t);return e.hass&&d.includes("hourly")&&r.push(at(e.hass,e.entityId,"hourly",c=>{c.failed||(i.hourly=c.forecast,o())})),e.hass&&i.dailyType&&r.push(at(e.hass,e.entityId,i.dailyType,c=>{c.failed||(i.daily=c.forecast,o())})),()=>l()}var nn=e=>/rain|pour|snow|sleet|storm/.test(e);function ne(e,n=6){return ve({hourly:e.hourly,daily:e.daily,dailyType:e.dailyType,now:e.now,current:e.current,hass:e.hass,dayCount:n})}function ge(e,n){let t=n.hours.length>0,i=n.days.some(o=>!o.isToday),r=e.show!=="daily"&&t||e.show==="daily"&&!i&&t,a=e.show!=="hourly"&&i||e.show==="hourly"&&!t&&i;return{hours:r,days:a}}var mt=e=>`data-full="${e.full}" data-trims="${e.trims.join(" ")}"${e.first?` data-first="${e.first}"`:""}${e.short?` data-short="${e.short}"`:""}`;function qe(e){let n=[];for(let t=e-1;t>=2;t--)n.push(`d${t}`);return n}var Gn=12;function ht(e,n){let t=n.hass,i=n.now+Gn*36e5,r=e.hours.filter(u=>Date.parse(u.datetime)<i&&typeof u.temperature=="number");if(!r.length)return[];let a=je(e.hours,n.now,i),o=n.current??r[0].temperature,l=r.filter(u=>Date.parse(u.datetime)>n.now+10*6e4),s=/F/.test(n.unit)?3:2,d=l.reduce((u,x)=>!u||x.temperature>u.temperature?x:u,void 0),c=l.reduce((u,x)=>!u||x.temperature<u.temperature?x:u,void 0),m=(u,x)=>u?w(t,x,{value:$(u.temperature,t),time:C(Date.parse(u.datetime),t)}):"",b=d&&d.temperature-o>=s?m(d,"high_at"):"",y=c&&o-c.temperature>=s?m(c,"low_at"):"",h=[],f=a[0];if(f){let u=f.chance!==void 0?` \xB7 ${H(Math.round(f.chance/10)*10,t)}`:f.amount!==void 0?` \xB7 ${f.amount<10?f.amount.toFixed(1):Math.round(f.amount)} mm`:"";h.push(`${he(f.kind,t)} ${ct(f,n.now,i,t)}${u}`),(b||y)&&h.push(b||y)}else if(b||y)h.push(b||y),b&&y&&h.push(y);else{let u=r[r.length-1];h.push(w(t,"steady_until",{time:C(Date.parse(u.datetime),t)}))}return h}function rn(e,n=""){return e.length?`<p class="awc-sentence ${n}">${e.map((t,i)=>`<span class="awc-sentence-${i+1}">${R(t,"awc-ampm")}</span>`).join("")}</p>`:""}function Bn(e){let n=ne(e),t=ge(e,n);if(!t.hours&&!t.days)return"";let{count:i,step:r}=We(e.width),a=t.hours?_e(ue(n.hours,e.now,i,r,e.hass),nn(e.condition),e.hass):"",o=t.days?n.days.filter(d=>!d.isToday).slice(0,5):[],l=t.hours?rn(ht(n,e).slice(0,1),"awc-short-form"):"",s={full:"full",trims:qe(o.length),first:t.hours&&o.length?"first":void 0,short:l?"short":void 0};return`<section class="awc-fc awc-fc-a" ${mt(s)}><div class="awc-fc-body">${a}${Y(o,n,e.hass)}</div>${l}</section>`}function jn(e){let n=ne(e),t=ge(e,n);if(!t.hours&&!t.days)return"";let i=t.hours?ht(n,e):[],r=t.days?n.days.filter(o=>!o.isToday).slice(0,3):[],a={full:"full",trims:qe(r.length),first:i.length&&r.length?"first":void 0,short:i.length>1?"short":void 0};return`<section class="awc-fc awc-fc-b" ${mt(a)}>${rn(i)}${Y(r,n,e.hass)}</section>`}var qn={narrow:{full:{top:16,gap:3,amp:30,bottom:16},flat:{top:16,gap:2,amp:16,bottom:16}},wide:{full:{top:26,gap:4,amp:40,bottom:20},flat:{top:20,gap:2,amp:16,bottom:18}}};function Yn(e){let n=ne(e),t=ge(e,n);if(!t.hours&&!t.days)return"";let i=e.width>=600,r=e.width>0?e.width:313,a=Math.max(8,Math.min(24,Math.round(r/26))),o=e.hass?.states["sun.sun"],l=c=>fe({hass:e.hass,hours:n.hours,now:e.now,current:e.current,unit:e.unit,width:r,windowHours:a,lanes:qn[i?"wide":"narrow"][c],groundBelow:i?0:10,sun:o,dot:[7,7],maxBands:2,bandDetail:!0,size:i?"lg":"sm"}).html.replace('class="awc-line"',`class="awc-line${i?" lg":""}"`),s=t.days?n.days.filter(c=>!c.isToday).slice(0,3):[],d=t.hours?{full:"full",trims:qe(s.length),first:s.length?"first":void 0,short:"short"}:{full:"full",trims:qe(s.length)};return`<section class="awc-fc awc-fc-c${i?" wide":""}" ${mt(d)}>`+(t.hours?`<div class="awc-lvl-full">${l("full")}</div><div class="awc-lvl-flat">${l("flat")}</div>`:"")+(s.length?`<div class="awc-fc-days">${Y(s,n,e.hass)}</div>`:"")+"</section>"}var Kn=`
    ${ke(".animated-weather-card.theme-colors")}
    ${$e(".animated-weather-card.theme-colors")}
    @container awc (min-width: 460px) { .awc-fc .awc-hour-temp { font-size: 18px; line-height: 24px; } }

    /* The sentence: full strength at the quiet tier's size (it sits low,
       where full strength passes across the card) */
    .awc-sentence { display: flex; flex-direction: column; margin: 0; font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.006em; font-variant-numeric: tabular-nums; }
    .awc-sentence > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .awc-sentence + .awc-days, .awc-fc-days { margin-top: 10px; }

    /* The fit's levels (data-forecast on the card) */
    .awc-short-form { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-a .awc-fc-body { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-a .awc-short-form { display: flex; }
    .animated-weather-card[data-forecast="short"] .awc-fc-b .awc-sentence-2,
    .animated-weather-card:is([data-forecast="short"], [data-forecast="first"]) .awc-fc :is(.awc-days, .awc-fc-days) { display: none; }
    .awc-fc-c .awc-lvl-flat { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-c .awc-lvl-full { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-c .awc-lvl-flat { display: block; }
    ${[2,3,4,5,6,7,8].map(e=>`.animated-weather-card[data-forecast="d${e}"] .awc-fc .awc-days > li:nth-child(n+${e+1})`).join(", ")} { display: none; }
    /* First data fades in; nothing moves, its place was held */
    .awc-forecast[data-arrive] > .awc-fc { animation: awc-fc-in 320ms cubic-bezier(0.25, 1, 0.5, 1); }
    @keyframes awc-fc-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .awc-forecast[data-arrive] > .awc-fc { animation: none; } }
    .animated-weather-card.static .awc-forecast[data-arrive] > .awc-fc { animation: none; }

    /* Today's high and low: on the condition's line (a), the quiet line's
       size, full strength (it reaches toward the light); tinted on a wide card */
    .awc-hl-line { display: inline-flex; gap: 10px; font-size: 15px; line-height: 20px; font-weight: 400; letter-spacing: -0.006em; }
    @container awc (min-width: 640px) { .awc-hl-line { opacity: var(--awc-secondary); } }
    .animated-weather-card.theme-colors .awc-hl-line { color: var(--secondary-text-color); }

    /* Beside the temperature (b, c), a min/max thermometer's memory, full
       strength; its quietness is its size */
    .awc-hl-stack {
      display: grid;
      margin: 0.06em 0 0 0.18em;
      font-family: var(--awc-font);
      font-size: 17px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    @container awc (min-width: 460px) { .awc-hl-stack { font-size: 18px; line-height: 22px; } }
    @container awc (min-width: 640px) { .awc-hl-stack { font-size: 20px; line-height: 26px; } .awc-hl-stack .awc-hl-label { font-size: 12px; } }
    @container awc (max-width: 319px) { .awc-hl-stack { font-size: 15px; line-height: 18px; } .awc-hl-stack .awc-hl-label { font-size: 10px; } }
    @container awc (max-width: 259px) { .awc-hl-stack { display: none; } }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-hl-stack { font-size: 15px; line-height: 18px; }
    .animated-weather-card[data-height="minimal"] .awc-hl-stack { font-size: 14px; line-height: 16px; }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"], [data-height="minimal"]) .awc-hl-stack .awc-hl-label { font-size: 10px; }
    .animated-weather-card.theme-colors .awc-hl-stack { color: var(--primary-text-color); }
    .animated-weather-card.theme-colors .awc-hl-stack .awc-hl-label { color: var(--secondary-text-color); }
`;function Vn(e){let n=ne(e,10),t=ge(e,n),i=e.width>=640,r=e.compact||!i?e.width-40:(e.width-56-57)/2,{count:a,step:o}=We(r),l=t.hours?ue(n.hours,e.now,e.compact&&i?Math.min(12,a*2):a,e.compact&&i?Math.max(1,Math.ceil(o/2)):o,e.hass):[],s=_e(l,nn(e.condition),e.hass);if(e.compact){if(s)return`<div class="fc-a fc-strip" data-fit-steps="regular">${s}</div>`;let m=n.days.slice(0,i?7:4);return`<div class="fc-a fc-strip" data-fit-steps="regular">${Un(m,e)}</div>`}let d=t.days?n.days:[],c=[];for(let m=d.length;m>=2;m--)c.push(`d${m}`);return s&&d.length&&c.push("x2","x1"),c.length||c.push("regular"),`<div class="fc-a fc-full${s&&d.length?" both":""}" data-fit-steps="${c.join(" ")}">`+(s?`<div class="fc-hours-block">${s}</div>`:"")+(d.length?`<div class="fc-days-block">${Y(d,n,e.hass,e.current)}</div>`:"")+"</div>"}function Un(e,n){let t=e.map(i=>{let r=i.isToday?w(n.hass,"today"):P(i.date,n.hass,"short");return`<li><span class="awc-hour-label">${g(r)}</span><span class="awc-hour-temp">${g($(i.high,n.hass))} <span class="fc-low">${g($(i.low,n.hass))}</span></span></li>`}).join("");return`<ol class="awc-hours" style="--awc-cols: ${e.length}" aria-label="${g(w(n.hass,"next_days"))}">${t}</ol>`}var Xt=e=>R(e,"fc-ampm");function ut(e,n){let t=Math.round((e-n.now)/36e5);return t<1?w(n.hass,"within_hour").toLowerCase():w(n.hass,"in_hours",{hours:String(t)})}function Zn(e,n){let t=n.hass,i=n.now+24*36e5,r=e.hours.filter(f=>Date.parse(f.datetime)<i&&typeof f.temperature=="number");if(!r.length){let f=e.days;if(!f.length)return null;let u=f.find(_=>(_.chance??0)>=50);if(u)return{eyebrow:he(on(u.condition),t),value:g(pt(u,n)),quiet:[u.chance!==void 0?H(Math.round(u.chance/10)*10,t):""]};let x=f.reduce((_,T)=>(T.high??-99)>(_.high??-99)?T:_,f[0]);return{eyebrow:w(t,"high"),value:g($(x.high,t)),quiet:[pt(x,n)]}}let o=je(e.hours,n.now,i)[0],l=o?.chance!==void 0?H(Math.round(o.chance/10)*10,t):"";if(o&&o.start>n.now+6e4)return{eyebrow:he(o.kind,t),value:Xt(C(o.start,t)),quiet:[ut(o.start,n),l,o.end<=i?w(t,"until_time",{time:C(o.end,t)}):""].filter(Boolean)};if(o)return o.end>i?{eyebrow:he(o.kind,t),value:g(w(t,"now")),quiet:[w(t,"through_time",{time:C(i,t)})]}:{eyebrow:w(t,"dry_from"),value:Xt(C(o.end,t)),quiet:[ut(o.end,n)]};let s=n.current??r[0].temperature,d=r.filter(f=>Date.parse(f.datetime)>n.now+10*6e4),c=d.reduce((f,u)=>u.temperature>f.temperature?u:f,d[0]??r[0]),m=d.reduce((f,u)=>u.temperature<f.temperature?u:f,d[0]??r[0]),b=/F/.test(n.unit)?3:2,y=[c.temperature-s>=b?{e:c,key:"high"}:null,s-m.temperature>=b?{e:m,key:"low"}:null].filter(f=>!!f).sort((f,u)=>Date.parse(f.e.datetime)-Date.parse(u.e.datetime))[0];if(y){let f=Date.parse(y.e.datetime);return{eyebrow:w(t,y.key),value:g($(y.e.temperature,t)),quiet:[w(t,"at_time",{time:C(f,t)}),ut(f,n)]}}let h=r[r.length-1];return{eyebrow:w(t,"high"),value:g($(Math.max(...r.map(f=>f.temperature)),t)),quiet:[w(t,"steady_until",{time:C(Date.parse(h.datetime),t)})]}}var on=e=>/lightning/.test(e??"")?"storms":e==="snowy"?"snow":/snowy-rainy|hail/.test(e??"")?"sleet":"rain",pt=(e,n)=>e.isToday?w(n.hass,"today"):P(e.date,n.hass,"short");function Xn(e,n){let t=new Date(n.now),{time:i,period:r}=At(t,n.hass),a=ht(e,n)[0]??"";return`<div class="fc-head fc-bedside"><div class="fc-eyebrow">${g(Lt(t,n.hass))}</div><time class="fc-clock" datetime="${t.toISOString().slice(0,16)}"><span>${g(i)}</span>${r?`<span class="fc-ampm">${g(r)}</span>`:""}</time>`+(a?`<div class="fc-quiet">${R(a,"awc-ampm")}</div>`:"")+"</div>"}function ft(e,n){if(n.clock)return Xn(e,n);let t=Zn(e,n);return t?`<div class="fc-head"><div class="fc-eyebrow">${g(t.eyebrow)}</div><div class="fc-value">${t.value}</div>`+(t.quiet.length?`<div class="fc-quiet">${t.quiet.map(i=>`<span>${g(i)}</span>`).join('<span class="fc-dot" aria-hidden="true"> \xB7 </span>')}</div>`:"")+"</div>":""}function Jn(e){let n=ne(e,8),t=ge(e,n),i=e.width>=640,r=e.hass?.states["sun.sun"],a=ft(n,e);if(e.compact){let m=Math.max(80,e.width-40-112-20-6),b=t.hours?fe({hass:e.hass,hours:n.hours,now:e.now,current:e.current,unit:e.unit,width:m,windowHours:12,lanes:{top:16,gap:4,amp:40,bottom:16},groundBelow:0,sun:r,dot:[7,7],maxBands:2,bandDetail:!1,size:"sm",extremeTimes:!1,skipFirstBand:!e.clock,noEnd:!0}).html:"",y=!t.hours&&t.days?Y(n.days.slice(0,3),n,e.hass,e.current):"";return`<div class="fc-c fc-strip-c" data-fit-steps="regular short tight">${a}<div class="fc-chart">${b}${y}</div></div>`}let o=i?e.width-56-196-28:e.width-40,l=t.hours?fe({hass:e.hass,hours:n.hours,now:e.now,current:e.current,unit:e.unit,width:Math.max(120,o),windowHours:24,lanes:i?{top:32,gap:4,amp:72,bottom:32}:{top:28,gap:4,amp:48,bottom:28},groundBelow:0,sun:r,dot:[7,7],maxBands:3,bandDetail:!1,size:"lg",axis:!0,skipFirstBand:!e.clock}).html.replace('class="awc-line"','class="awc-line lg"'):"",s=t.days?n.days.slice(0,i?7:5):[],d=[];for(let m=s.length-1;m>=2;m--)d.push(`short,d${m}`);let c=["regular","compact","short",...d,"tight","minimal"];return`<div class="fc-c fc-full${i?" wide":""}" data-fit-steps="${c.join(" ")}"><div class="fc-top">${a}${l?`<div class="fc-chart">${l}</div>`:""}</div>`+(s.length?`<div class="fc-days-block">${Y(s,n,e.hass,e.current)}</div>`:"")+"</div>"}var Jt={sunny:"clear","clear-night":"clear","partly-cloudy":"partly",cloudy:"cloudy",foggy:"fog",windy:"wind","light-rain":"rain",rainy:"rain",pouring:"rain",snowy:"snow","snowy-rainy":"mixed",sleety:"mixed",stormy:"storm","snowy-stormy":"storm","sleety-stormy":"storm"},Qt=["storm","snow","mixed","rain","fog","wind","cloudy","partly","clear"],en=new Set(["rain","snow","mixed","storm"]);function tn(e,n){let t=Dt(e??"cloudy",!1);return He.includes(t)||(t="cloudy"),t==="sunny"&&n&&(t="clear-night"),t==="clear-night"&&!n&&(t="sunny"),{sky:t,phase:n?"night":"day"}}function Qn(e,n,t,i){let r=[];e.forEach((s,d)=>{let c=r[r.length-1];c&&c.family===s.family||r.push({start:d,family:s.family,condition:s.condition,wet:en.has(s.family)})});let a=[...r].sort((s,d)=>Qt.indexOf(s.family)-Qt.indexOf(d.family)),o=[],l=e.length*n-i;for(let s of a){let d=s.wet?he(on(s.condition),t.hass):G(s.condition,t.hass),c=s.start*n,m=J(d,13,600)+4,b=c+m<=l&&o.every(y=>c+m+12<=y.x||y.x+y.w+12<=c);if(b||s.wet){if(!b)for(let y of[...o])c+m+12>y.x&&y.x+y.w+12>c&&o.splice(o.indexOf(y),1);o.push({at:s.start,text:d,x:c,w:m})}else if(s.start>0){let y=f=>!!f&&!en.has(f.family)&&f.family!==s.family,h;for(let f=s.start-1;f>=0&&!h;f--)y(e[f])&&(h=e[f]);for(let f=s.start+1;f<e.length&&!h;f++)y(e[f])&&(h=e[f]);if(h)for(let f=s.start;f<e.length&&e[f].family===s.family;f++)e[f].sky=h.sky,e[f].phase=h.phase}}return o.sort((s,d)=>s.at-d.at)}function ei(e,n,t,i,r){let a=n.width>0?n.width:353,o=d=>((t+(d+.5)*i)/a*100).toFixed(1),l=d=>`linear-gradient(90deg, ${e.map((c,m)=>`${d(c)} ${o(m)}%`).join(", ")})`;if(r){let d=(c,m)=>te(Ct(c.sky,c.phase,m));return`<div class="fc-paint" aria-hidden="true"><i style="background: ${l(c=>d(c,.775))}"></i><i class="top" style="background: ${l(c=>d(c,.55))}"></i><i class="bottom" style="background: ${l(c=>d(c,1))}"></i></div>`}let s=d=>Ne(d.sky,d.phase);return`<div class="fc-paint full" aria-hidden="true"><i style="background: ${l(d=>s(d).mid)}"></i><i class="top" style="background: ${l(d=>s(d).top)}"></i><i class="bottom" style="background: ${l(d=>s(d).bottom)}"></i><i class="scrim" style="background: ${l(d=>s(d).scrim)}"></i></div>`}function ti(e,n){return`<ol class="fc-cols" style="--awc-cols: ${e.length}">${e.map(t=>`<li><span class="awc-visually-hidden">${g(t.label)}: ${g(t.temp!==void 0?`${Math.round(t.temp)}\xB0`:"")}${t.low!==void 0?` / ${Math.round(t.low)}\xB0`:""}${t.wet&&t.chance!==void 0?`, ${Math.round(t.chance/10)*10}%`:""}</span><span class="fc-col-time" aria-hidden="true">${g(t.label)}</span><span class="fc-col-temp${n?" l":""}" aria-hidden="true">${t.temp!==void 0?`${g(String(Math.round(t.temp)))}\xB0`:"\u2013"}${t.low!==void 0?`<span class="fc-low"> ${g(String(Math.round(t.low)))}\xB0</span>`:""}</span><span class="fc-col-chance" aria-hidden="true">${t.wet&&t.chance!==void 0?g(H(Math.round(t.chance/10)*10)):""}</span></li>`).join("")}</ol>`}function ni(e){let n=ne(e,8),t=ge(e,n),i=e.width>=640,r=i?28:20,a=(e.width>0?e.width:353)-r*2,o=e.hass?.states["sun.sun"],l=(y,h,f,u=!1)=>{let x=a/y.length,_=u&&a>=400?pe(n.today,e.hass):"",T=Qn(y,x,e,_?110:0);return`<div class="fc-band${f?" lower":""}">${ei(y,e,r,x,f)}<div class="fc-band-text"><div class="fc-runs">${T.map(D=>`<span style="left: ${(D.at*x).toFixed(1)}px">${g(D.text)}</span>`).join("")}`+(_?`<span class="fc-hl">${_}</span>`:"")+`</div>${ti(y,h)}</div></div>`},s=()=>{let{count:y,step:h}=We(a),f=lt(o,e.now-36e5,e.now+48*36e5),u=x=>f?!f.some(([_,T])=>x>=_&&x<T):!1;return ue(n.hours,e.now,i?Math.min(12,y+4):y,i?1:h,e.hass,!0).map(x=>{let _=x.wetCondition&&/rain|pour|snow|hail|lightning/.test(x.wetCondition)?x.wetCondition:"rainy",T=tn(x.wet?_:x.condition,u(x.start+18e5)),D=Jt[T.sky]??"cloudy";return{label:x.label,temp:x.temp,chance:x.chance,wet:x.wet,condition:x.wet?_:x.condition,...T,family:D}})},d=()=>n.days.slice(0,e.compact?4:i?7:a>=420?5:4).map(y=>{let h=tn(y.condition,!1);return{label:pt(y,e),temp:y.high,low:y.low,chance:y.chance,wet:(y.chance??0)>=50,condition:y.condition,...h,family:Jt[h.sky]??"cloudy"}}),c=e.clock?ft(n,e):"";if(e.compact){let y=t.hours?s():d();return`<div class="fc-b fc-strip-b" data-fit-steps="regular">${l(y,!1,!0,!0)}</div>`}let m=t.hours?l(s(),!0,!1,!0):"",b=t.days&&(!t.hours||e.show==="both")?l(d(),!0,!1):"";return`<div class="fc-b fc-full${m&&b?" both":""}" data-fit-steps="${m&&b?"regular x1":"regular"}">${c}${m}${b}</div>`}var ii=te(I(ze)),ri=`
    ${ke(".fc-card:not(.sky)")}
    ${$e(".fc-card:not(.sky)")}
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
      color: ${ii};
      --awc-secondary: ${Oe};
      text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
      background:
        ${Je(St,"var(--awc-sky-glow)")},
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
        linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
      transition: ${Mt.map(e=>`${e} ${Et}s ${Tt}`).join(", ")};
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
    @container fc (min-width: 640px) {
      .fc-card.sky:not(.compact) {
        background:
          ${Je(Ft,"var(--awc-sky-glow)")},
          linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
          linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
      }
    }
    .awc-ampm { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }

    /* The headline, the tracker's anatomy: eyebrow, value, quiet line */
    .fc-head { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }
    .fc-eyebrow { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: var(--awc-secondary); white-space: nowrap; }
    .fc-value, .fc-clock {
      margin: 6px 0 0 -0.04em;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      font-size: 52px; line-height: 0.95; font-weight: 250; letter-spacing: -0.035em; font-variant-numeric: tabular-nums; white-space: nowrap;
    }
    .fc-ampm { font-size: 0.42em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.32em; }
    .fc-quiet { margin-top: 6px; max-width: 60%; font-size: 15px; line-height: 20px; opacity: var(--awc-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fc-card:not(.sky) :is(.fc-eyebrow, .fc-quiet) { color: var(--secondary-text-color); opacity: 1; }
    .fc-card:not(.sky) :is(.fc-value, .fc-clock) { color: var(--primary-color, var(--primary-text-color)); }
    @container fc (min-width: 460px) { .fc-value { font-size: 60px; } }
    /* Bedside: the time leads, at the weather card's temperature size, the
       date over it, what's coming under it */
    .fc-bedside .fc-clock { font-size: 96px; font-weight: 200; line-height: 0.9; letter-spacing: -0.045em; margin: 8px 0 0 -0.055em; }
    .fc-bedside .fc-quiet { max-width: 100%; opacity: 1; }
    @container fc (max-width: 319px) { .fc-bedside .fc-clock { font-size: 64px; } }
    @container fc (min-width: 640px) { .fc-bedside .fc-clock { font-size: 120px; } }
    .fc-bedside + * { margin-top: 16px; }

    /* c: the instrument */
    .fc-c.fc-full { display: flex; flex-direction: column; height: 100%; }
    .fc-c .fc-chart { margin-top: 14px; padding-bottom: 18px; }
    .fc-c .fc-days-block { position: relative; margin-top: 14px; padding-top: 14px; }
    .fc-c .fc-days-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .fc-card:not(.sky) .fc-c .fc-days-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    @container fc (min-width: 640px) {
      .fc-c.wide .fc-top { display: grid; grid-template-columns: 196px minmax(0, 1fr); column-gap: 28px; align-items: end; }
      .fc-c.wide .fc-chart { margin-top: 0; }
      .fc-c.wide .fc-days-block .awc-days { grid-template-columns: max-content minmax(0, 1fr) 4ch 24% 4ch; }
    }
    .fc-card:is([data-fit~="compact"], [data-fit~="short"], [data-fit~="tight"], [data-fit~="minimal"]) .fc-c .fc-quiet { display: none; }
    .fc-card:is([data-fit~="short"], [data-fit~="tight"]) .fc-c .fc-value { font-size: 40px; }
    ${[2,3,4,5,6].map(e=>`.fc-card[data-fit~="d${e}"] .fc-c .awc-days > li:nth-child(n+${e+1})`).join(", ")} { display: none; }
    .fc-card:is([data-fit="tight"], [data-fit="minimal"]) .fc-c .fc-days-block { display: none; }
    .fc-card[data-fit="minimal"] .fc-c .fc-head { display: none; }
    .fc-card[data-fit="minimal"] .fc-c .fc-chart { margin-top: 0; }
    /* The strip: the hero, then the line to the card's right edge, like the compact tracker's */
    .fc-strip-c { display: flex; align-items: center; gap: 20px; height: 100%; }
    .fc-strip-c .fc-head { width: 112px; flex: none; }
    .fc-strip-c .fc-value { font-size: 34px; margin-top: 5px; }
    .fc-strip-c .fc-quiet { max-width: none; margin-top: 5px; font-size: 13px; line-height: 18px; }
    .fc-strip-c .fc-chart { flex: 1 1 auto; min-width: 0; margin: 0; padding: 0 0 0 6px; }
    .fc-strip-c .fc-bedside .fc-clock { font-size: 34px; font-weight: 250; margin-top: 5px; }
    .fc-card.compact[data-fit="short"] .fc-strip-c .fc-value { font-size: 28px; }

    /* b: skies. The slots' own skies, painted under the words: Recipe F
       (each column the full sky) on the card, the lower sky on the strip */
    .fc-card.fc-skies { padding: 0; }
    .fc-b { height: 100%; display: flex; flex-direction: column; }
    .fc-b > .fc-head { padding: 20px 20px 0; }
    .fc-band { position: relative; flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px 20px; }
    .fc-b.both .fc-band + .fc-band::before { content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px; background: currentColor; opacity: 0.2; z-index: 1; }
    .fc-paint, .fc-paint > i { position: absolute; inset: 0; }
    .fc-paint > .top { -webkit-mask-image: linear-gradient(180deg, #000 0, transparent 55%); mask-image: linear-gradient(180deg, #000 0, transparent 55%); }
    .fc-paint > .bottom { -webkit-mask-image: linear-gradient(180deg, transparent 55%, #000 100%); mask-image: linear-gradient(180deg, transparent 55%, #000 100%); }
    .fc-paint > .scrim { -webkit-mask-image: linear-gradient(180deg, transparent 40%, #000 100%); mask-image: linear-gradient(180deg, transparent 40%, #000 100%); }
    .fc-band.lower .fc-paint > .top { -webkit-mask-image: linear-gradient(180deg, #000 0, transparent 50%); mask-image: linear-gradient(180deg, #000 0, transparent 50%); }
    .fc-band.lower .fc-paint > .bottom { -webkit-mask-image: linear-gradient(180deg, transparent 50%, #000 100%); mask-image: linear-gradient(180deg, transparent 50%, #000 100%); }
    .fc-band-text { position: relative; }
    .fc-runs { position: relative; height: 18px; margin-bottom: 6px; font-size: 13px; line-height: 18px; font-weight: 600; }
    .fc-runs > span { position: absolute; top: 0; white-space: nowrap; }
    .fc-runs > .fc-hl { right: 0; display: inline-flex; gap: 10px; font-weight: 500; }
    .fc-cols { display: grid; grid-template-columns: repeat(var(--awc-cols), minmax(0, 1fr)); column-gap: 8px; margin: 0; padding: 0; list-style: none; }
    .fc-cols > li { display: flex; flex-direction: column; min-width: 0; }
    .fc-col-time { font-size: 13px; line-height: 16px; font-weight: 400; white-space: nowrap; }
    .fc-col-temp { margin-top: 2px; font-size: 17px; line-height: 22px; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .fc-col-temp.l { font-size: 22px; line-height: 26px; font-weight: 400; }
    .fc-col-temp .fc-low { font-size: 15px; font-weight: 400; }
    .fc-col-chance { min-height: 16px; font-size: 13px; line-height: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .fc-card.compact .fc-band { padding: 10px 20px; justify-content: center; }
    .fc-card.compact .fc-col-chance:empty { min-height: 0; }
    .fc-card[data-fit="x1"] .fc-b.both .fc-band + .fc-band { display: none; }
    .fc-card:not(.sky) .fc-paint { display: none; }
    .fc-card:not(.sky) :is(.fc-col-time, .fc-low) { color: var(--secondary-text-color); }
    .fc-card:not(.sky) .fc-col-chance { color: var(--primary-color); }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block::before { display: none; }
`,an={version:1,sectionCss:Kn,renderSection:e=>{switch(e.variant){case"b":return jn(e);case"c":return Yn(e);default:return Bn(e)}},fit:Be,renderHighLow:e=>pe(ne(e).today,e.hass),cardCss:ri,renderCard:e=>{switch(e.variant){case"b":return ni(e);case"c":return Jn(e);default:return(e.clock?ft(ne(e,10),e):"")+Vn(e)}},openPopup:e=>Zt(e)};window.AnimatedWeatherCardForecast=an;})();
