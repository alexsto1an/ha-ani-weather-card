// The review page: every variant in the real card, on the demo's sample
// weather with a forecast that changes through the day, at real size.

import { buildHass, PHASES, ENTITIES } from './scene.mjs';
import { sampleForecast, withForecast } from './forecast-sample.mjs';
import { SURFACES } from './variants.mjs';

const SKIES = [
    { id: 'day', label: 'Clear day', conditionId: 'clear', phase: 'day' },
    { id: 'cloudy', label: 'Partly cloudy', conditionId: 'partlycloudy', phase: 'day' },
    { id: 'dusk', label: 'Dusk', conditionId: 'clear', phase: 'dusk' },
    { id: 'night', label: 'Night', conditionId: 'clear', phase: 'night' },
    { id: 'storm', label: 'Storm', conditionId: 'lightning-rainy', phase: 'day' },
    { id: 'theme-dark', label: 'Theme, dark', conditionId: 'rainy', phase: 'day', theme: 'dark' },
    { id: 'theme-light', label: 'Theme, light', conditionId: 'partlycloudy', phase: 'day', theme: 'light' },
];

const STORE = 'awc-review';
const saved = (() => { try { return JSON.parse(localStorage.getItem(STORE) ?? '{}'); } catch { return {}; } })();
const state = {
    sky: SKIES.some(s => s.id === saved.sky) ? saved.sky : 'cloudy',
    language: saved.language ?? 'en',
    timeFormat: saved.timeFormat ?? '24',
    data: saved.data ?? 'full',
};
const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch { /* private window */ } };

/** Names and words the sample's Home Assistant gives the cards, in a few languages */
const CONDITION_NAMES = {
    de: { 'clear-night': 'Klar, Nacht', sunny: 'Sonnig', partlycloudy: 'Teilweise bewölkt', cloudy: 'Bewölkt', rainy: 'Regnerisch', pouring: 'Strömend', 'lightning-rainy': 'Gewitter, regnerisch', fog: 'Nebel' },
    fr: { 'clear-night': 'Nuit dégagée', sunny: 'Ensoleillé', partlycloudy: 'Partiellement nuageux', cloudy: 'Nuageux', rainy: 'Pluvieux', pouring: 'Averses', 'lightning-rainy': 'Orageux, pluvieux', fog: 'Brouillard' },
    pl: { 'clear-night': 'Pogodna noc', sunny: 'Słonecznie', partlycloudy: 'Częściowe zachmurzenie', cloudy: 'Pochmurno', rainy: 'Deszczowo', pouring: 'Ulewa', 'lightning-rainy': 'Burza z deszczem', fog: 'Mgła' },
    es: { 'clear-night': 'Despejado, noche', sunny: 'Soleado', partlycloudy: 'Parcialmente nublado', cloudy: 'Nublado', rainy: 'Lluvioso', pouring: 'Aguacero', 'lightning-rainy': 'Tormenta, lluvia', fog: 'Niebla' },
    pt: { 'clear-night': 'Limpo, noite', sunny: 'Ensolarado', partlycloudy: 'Parcialmente nublado', cloudy: 'Nublado', rainy: 'Chuvoso', pouring: 'Chuva torrencial', 'lightning-rainy': 'Trovoada, chuva', fog: 'Nevoeiro' },
    ro: { 'clear-night': 'Senin, noapte', sunny: 'Însorit', partlycloudy: 'Parțial înnorat', cloudy: 'Înnorat', rainy: 'Ploios', pouring: 'Ploaie torențială', 'lightning-rainy': 'Furtună cu ploaie', fog: 'Ceață' },
};

/** A Home Assistant for one card: the sample's weather at the sky's time, with a forecast */
function hassFor(sky, extra = {}) {
    const [h, m] = PHASES[sky.phase].time;
    window.awcDemoClock.set(h, m);
    const hass = buildHass({ conditionId: sky.conditionId, phase: sky.phase, now: new Date(), ...extra });
    const current = hass.states[ENTITIES.weather].attributes.temperature;
    const missing = state.data === 'no-chance' ? ['chance'] : state.data === 'daily-only' ? ['hourly'] : [];
    withForecast(hass, sampleForecast(sky.conditionId, new Date(), current, hass.states[ENTITIES.weather].attributes.wind_speed,
        { missing, days: state.data === 'three-days' ? 3 : undefined }));
    hass.language = state.language;
    hass.locale = { ...hass.locale, language: state.language, time_format: state.timeFormat };
    const names = CONDITION_NAMES[state.language];
    if (names) {
        const english = hass.formatEntityState;
        hass.formatEntityState = (stateObj) => names[stateObj.state] ?? english(stateObj);
    }
    return hass;
}

const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else node.setAttribute(k, v);
    }
    node.append(...children.filter(Boolean));
    return node;
};

/** One card at its real size */
function mountCard({ type = 'animated-weather-card', config, width, height }, sky) {
    const box = el('div', { class: 'frame-box' });
    box.style.width = `${width}px`;
    if (height) box.style.height = `${height}px`;
    const card = document.createElement(type);
    const full = { ...config, ...(sky.theme ? { color_palette: 'theme' } : {}) };
    card.setConfig(full);
    box.append(card);
    card.hass = hassFor(sky);
    return { box, card };
}

function frame(spec, sky) {
    const wrap = el('div', { class: 'frame' }, el('div', { class: 'frame-label', text: spec.label }));
    if (spec.stack) {
        const stack = el('div', { class: 'frame-stack' });
        for (const part of spec.stack) stack.append(mountCard(part, sky).box);
        wrap.append(stack);
        return wrap;
    }
    const { box, card } = mountCard(spec, sky);
    wrap.append(box);
    if (spec.popup) {
        const open = el('button', { type: 'button', text: 'Open the pop-up' });
        open.addEventListener('click', () => card.openForecast?.());
        wrap.append(el('div', { class: 'frame-actions' }, open));
    }
    return wrap;
}

function renderSkyControl() {
    const group = document.getElementById('sky-control');
    group.replaceChildren(...SKIES.map(sky => {
        const button = el('button', { type: 'button', role: 'radio', 'aria-checked': String(sky.id === state.sky), text: sky.label });
        button.addEventListener('click', () => { state.sky = sky.id; save(); renderSkyControl(); render(); });
        return button;
    }));
}

function render() {
    const sky = SKIES.find(s => s.id === state.sky);
    const main = document.getElementById('surfaces');
    main.replaceChildren(...SURFACES.map(surface => {
        const section = el('section', { class: 'surface', id: surface.id },
            el('h2', { text: surface.title }),
            el('p', { class: 'about', text: surface.about }));
        for (const variant of surface.variants) {
            const head = el('div', { class: 'variant-head' },
                el('h3', {}, el('span', { class: 'letter', text: variant.letter }), el('span', { text: variant.name }),
                    variant.pick ? el('span', { class: 'pick', text: 'Recommended' }) : null),
                el('p', { text: variant.summary }),
                variant.tradeoffs ? el('p', { class: 'tradeoffs', text: variant.tradeoffs }) : null,
                variant.yaml ? el('p', { class: 'yaml', text: variant.yaml }) : null);
            const frames = el('div', { class: `frames${sky.theme ? ` theme-${sky.theme}` : ''}` });
            for (const spec of variant.frames) frames.append(frame(spec, sky));
            section.append(el('article', { class: 'variant', id: `${surface.id}-${variant.letter.toLowerCase()}` }, head, frames));
        }
        return section;
    }));
}

for (const [id, key] of [['language', 'language'], ['time-format', 'timeFormat'], ['data', 'data']]) {
    const select = document.getElementById(id);
    select.value = state[key];
    select.addEventListener('change', () => { state[key] = select.value; save(); render(); });
}
renderSkyControl();
render();
window.reviewReady = true;
