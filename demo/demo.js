// The demo's controls and its rooms. Weather and time-of-day changes reach
// the cards as live Home Assistant updates, so they cross-fade as on a
// dashboard. Layout, colour and tracker changes set the cards up again: the
// new setup waits, hidden, until its card has drawn its sky, then dissolves
// over the old one. Each room is lit by its card's own sky.

import {
    CARD_ROWS, CONDITIONS, DASHBOARD, DEVICES, ENGINE, ENTITIES, NOTE_FORECASTS, NOTE_VOICES, PAINTS, PALETTES, PHASES, QUIET,
    STATION, SUN_TIMES, buildHass, colorsYaml, conditionIcon, configYaml, customColors, dashboardLayout, dashboardYaml,
    engineSettings, engineYaml, forgetNotes, formatEngineValue, liveReading, minutesFor, nextFlight, noteYaml, paletteOf,
    phaseForHour, phaseForSun, placeName, quietOptions,
    solarAt, solarTimes, stationStates, sunAt, trackerYaml, weatherState, wmoCondition,
} from './scene.mjs';
import { copyButton, highlight, svgIcon } from './code.mjs';

const $ = (selector) => document.querySelector(selector);
/** Where a frame's caption keeps its words, beside its View code button. */
const captionText = (caption) => caption.querySelector('.caption-text') ?? caption;

const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
let reduceMotion = motionQuery?.matches ?? false;
motionQuery?.addEventListener?.('change', (event) => { reduceMotion = event.matches; });

const EASE = {
    outQuart: 'cubic-bezier(0.25, 1, 0.5, 1)',
    outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
    outCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    inQuart: 'cubic-bezier(0.5, 0, 0.75, 0)',
    inOutQuad: 'cubic-bezier(0.45, 0, 0.55, 1)',
    inSoft: 'cubic-bezier(0.4, 0, 1, 1)',
    outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
};

// The page has one clock, in minutes of the day. The time of day (the
// sky) follows from where that puts the sun.
const opened = new Date();
const openedPhase = phaseForHour(opened.getHours() + opened.getMinutes() / 60);
const state = {
    conditionId: 'partlycloudy',
    minutes: minutesFor(openedPhase),
    phase: openedPhase,
    colors: 'sky',
    flights: [],
    flown: 0,
    // Your weather, once the twelfth key has found you (see goLive)
    live: null,
};
/** Today's sun: the sample's, or yours while your weather is live */
let sunTimes = SUN_TIMES;
/** The weather the page opens on, and goes back to from yours when you move the time */
const DEFAULT_CONDITION = 'partlycloudy';
/** Where you are, with your place's name, while your weather is live */
let liveWhere = null;
/** The sun at a minute of the day: the real one where you are, or the sample's wave */
const sunNow = (minutes) => (state.live && liveWhere ? solarAt(minutes, liveWhere) : sunAt(minutes, sunTimes));

const form = $('#controls');
const stage = $('#stage');
const scenes = $('#scenes');
const stageLight = $('#stage-light');

const hass = () => buildHass({
    conditionId: state.conditionId, phase: state.phase, sun: sunNow(state.minutes), flights: state.flights, live: state.live, sunTimes,
});
/** Home Assistant's name for a weather option at the current time of day. */
const haName = (conditionId) => hass().formatEntityState({ state: weatherState(conditionId, state.phase) });

// ── Weather ────────────────────────────────────────────────────────────
// Your weather first, a pin, then eleven weathers. The pin is a button, not
// a radio, so the arrow keys that walk the weathers never ask for your
// location, and the day and night glyphs leave it alone. It's pressed from
// the start: the page asks for your location as it opens, and shows the
// sample's partly cloudy sky until yours arrives, or if it doesn't.
$('#weather').innerHTML = `
    <button type="button" class="weather-option weather-live" aria-pressed="true" aria-label="Your weather, from your location" title="Your weather, from your location">
        <span class="glyph" data-live>${svgIcon('mdi:crosshairs-gps')}</span>
    </button>` + CONDITIONS.map(c => `
    <label class="weather-option">
        <input type="radio" name="condition" value="${c.id}">
        <span class="glyph" data-condition="${c.id}"></span>
    </label>`).join('');

/** Names follow the time of day: "Clear, night" after dark. The note lab's keys too. */
function nameWeatherOptions() {
    for (const glyph of document.querySelectorAll('.glyph[data-condition]')) {
        const name = haName(glyph.dataset.condition);
        glyph.parentElement.title = name;
        glyph.previousElementSibling.setAttribute('aria-label', name);
    }
}

/**
 * Every weather glyph on the page for a sky: the moon stands in for the sun
 * once the sun on the dial is below the horizon. A glyph that changes
 * cross-fades in 160 ms.
 */
let glyphSky = null;
function paintGlyphs(night, animate = true) {
    if (night === glyphSky) return;
    glyphSky = night;
    const phase = night ? 'night' : 'day';
    for (const glyph of document.querySelectorAll('.glyph[data-condition], .forecast-glyph[data-condition]')) {
        const html = svgIcon(conditionIcon(glyph.dataset.condition, phase));
        if (glyph.innerHTML === html) continue;
        if (!animate || reduceMotion || !glyph.firstElementChild) {
            glyph.innerHTML = html;
            continue;
        }
        glyph.firstElementChild.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 80, easing: 'ease-in', fill: 'forwards' })
            .finished.then(() => {
                glyph.innerHTML = html;
                glyph.firstElementChild.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 80, easing: 'ease-out' });
            }, () => {});
    }
}

const status = $('#weather-status');
function announce() {
    const whose = !state.live ? '' : state.live.name === 'Here' ? 'Your weather: ' : `${state.live.name}: `;
    status.textContent = `${whose}${haName(state.conditionId)}, ${PHASES[state.phase].label.toLowerCase()}`;
}

// ── Time of day: a sun that travels its path ───────────────────────────
const DIAL = { width: 320, horizon: 48, amplitude: 28, start: 40, period: 280 };
const STOPS = { dawn: 40, day: 110, dusk: 180, night: 250 };
const dialY = (x) => DIAL.horizon - DIAL.amplitude * Math.sin((2 * Math.PI * (x - DIAL.start)) / DIAL.period);

const dial = $('#dial');
const knob = dial.querySelector('.dial-knob');
{
    let wave = '';
    for (let x = 0; x <= DIAL.width; x += 4) wave += `${x ? 'L' : 'M'}${x} ${dialY(x).toFixed(2)} `;
    dial.querySelector('.dial-day').setAttribute('d', wave);
    dial.querySelector('.dial-night').setAttribute('d', wave);
    dial.querySelector('.dial-fill').setAttribute('d', `${wave}L${DIAL.width} ${DIAL.horizon} L0 ${DIAL.horizon} Z`);
    const ticks = Object.values(STOPS)
        .map(x => `<circle class="dial-tick" cx="${x}" cy="${dialY(x).toFixed(2)}" r="2"/>`).join('');
    knob.insertAdjacentHTML('beforebegin', ticks);
    $('#phases').innerHTML = Object.entries(PHASES).map(([id, phase]) => `
        <label class="dial-stop" style="--x: ${(STOPS[id] / DIAL.width) * 100}%">
            <input type="radio" name="phase" value="${id}"${id === state.phase ? ' checked' : ''}>
            <span>${phase.label}</span>
        </label>`).join('');
}

let knobX = STOPS[state.phase];
let knobFrame = 0;
const EDGE = 14;
function placeKnob(x) {
    // Past the right edge the sun comes round again from the left
    const at = ((x % DIAL.width) + DIAL.width) % DIAL.width;
    const edge = Math.min(at, DIAL.width - at);
    knob.setAttribute('transform', `translate(${at.toFixed(2)} ${dialY(at).toFixed(2)})`);
    knob.style.opacity = edge < EDGE ? (edge / EDGE).toFixed(3) : '';
    const night = dialY(at) > DIAL.horizon + 0.5;
    dial.classList.toggle('is-night', night);
    paintGlyphs(night);
}
/**
 * The sun travels the path on one sine curve, longer trips taking longer.
 * From night it goes on round to the morning, as the sun does.
 */
function moveKnob(target) {
    cancelAnimationFrame(knobFrame);
    // A change mid-way round starts from where the sun is on the path
    const from = ((knobX % DIAL.width) + DIAL.width) % DIAL.width;
    const to = from >= STOPS.night && target < STOPS.dusk ? target + DIAL.width : target;
    if (reduceMotion) {
        knobX = target;
        placeKnob(knobX);
        return;
    }
    const duration = Math.min(1000, 500 + 2 * Math.abs(to - from));
    const started = performance.now();
    const step = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const x = from + (to - from) * (-(Math.cos(Math.PI * progress) - 1) / 2);
        knobX = progress < 1 ? x : target;
        placeKnob(knobX);
        if (progress < 1) knobFrame = requestAnimationFrame(step);
    };
    knobFrame = requestAnimationFrame(step);
}

function setClock() {
    window.awcDemoClock.set(Math.floor(state.minutes / 60), state.minutes % 60);
}

// ── Scenes: the cards at their real size ───────────────────────────────
const phoneQuery = window.matchMedia?.('(max-width: 640px)');
const onPhone = () => phoneQuery?.matches ?? false;

function buildScene(layout = 'regular', extra = {}) {
    const palette = state.colors === 'sky' ? 'default' : 'theme';
    const el = document.createElement('div');
    el.className = 'scene';
    el.dataset.layout = layout;
    el.innerHTML = '<div class="cards"></div>';
    const cards = el.firstElementChild;

    const weather = document.createElement('animated-weather-card');
    weather.setConfig({
        type: 'custom:animated-weather-card',
        entity: ENTITIES.weather,
        sun_entity: ENTITIES.sun,
        flights_entity: ENTITIES.flights,
        compact: layout === 'compact',
        color_palette: palette,
        ...extra,
    });
    cards.append(weather);
    return { el, weather, tracker: null };
}

function feed(scene, current = hass()) {
    for (const card of scene.cards ?? [scene.weather, scene.tracker]) if (card) card.hass = current;
}

/**
 * Resolves once every weather card in the scene has drawn its first sky,
 * or, for a tracker on its own, once the tracker has drawn (it renders in
 * its own shadow DOM, so this checks each frame), or `limit` ms on.
 */
function whenReady(scene, isCancelled, limit = 600) {
    return new Promise((resolve) => {
        const started = performance.now();
        const ready = () => {
            const skies = [...scene.el.querySelectorAll('.animated-weather-card')];
            if (skies.length) return skies.every(sky => !sky.classList.contains('loading'));
            return !!scene.el.querySelector('animated-sun-tracker-card')?.shadowRoot?.querySelector('.st-card');
        };
        const check = () => {
            if (isCancelled()) return;
            if (!ready() && performance.now() - started < limit) {
                requestAnimationFrame(check);
                return;
            }
            // Two frames, so its first paint is on screen before anyone sees it
            requestAnimationFrame(() => requestAnimationFrame(() => { if (!isCancelled()) resolve(); }));
        };
        check();
    });
}

/**
 * On a phone the stuck card's band changes height with the layout. Keep
 * the controls under your finger where they were. Browsers with scroll
 * anchoring already do, so this scrolls only by what's left over.
 */
function keepPlace(change) {
    const stuck = onPhone() && stage.classList.contains('is-stuck');
    const before = form.getBoundingClientRect().top;
    change();
    if (!stuck) return;
    const moved = form.getBoundingClientRect().top - before;
    if (moved) scrollBy(0, moved);
}

let current = null;
let pending = null;

/**
 * Set the cards up again. The new scene mounts in the same cell, hidden and
 * inert, and holds there until its card is ready, so the old one never gives
 * way to a half-drawn card. A newer change cancels a scene still waiting.
 */
function mountScene() {
    if (pending) {
        pending.cancelled = true;
        keepPlace(() => pending.scene.el.remove());
    }
    const scene = buildScene('regular', { show_note: true });
    scene.el.style.opacity = '0';
    scene.el.inert = true;
    feed(scene);
    keepPlace(() => scenes.append(scene.el));
    const job = { scene, cancelled: false };
    pending = job;
    whenReady(scene, () => job.cancelled).then(() => {
        pending = null;
        reveal(scene);
    });
}

/**
 * The first card arrives once the headline has started (at least 400 ms in):
 * it fades up into place, already raining or snowing, and its light comes
 * up after it.
 */
function revealFirst(scene) {
    setTimeout(() => {
        placeLight(true);
        stage.classList.add('is-ready');
        scene.el.style.opacity = '';
        if (reduceMotion) {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        } else {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 800, easing: EASE.outQuart });
            scene.el.animate([{ transform: 'translateY(20px)' }, { transform: 'none' }], { duration: 1100, easing: EASE.outExpo });
        }
        watchSky();
    }, Math.max(0, 400 - performance.now()));
}

/**
 * A new setup (the sky or the theme, or your own weather arriving)
 * takes over without showing two cards at once: the new scene fades in on
 * top, and the old one goes only once it's covered.
 */
function reveal(scene) {
    const old = current;
    current = scene;
    scene.el.inert = false;
    if (!old) {
        revealFirst(scene);
        return;
    }
    old.el.inert = true;
    scene.el.style.opacity = '';
    const remove = () => keepPlace(() => old.el.remove());
    watchSky();

    if (reduceMotion) {
        scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
        old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = remove;
        placeLight();
        return;
    }
    placeLight();
    scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: EASE.outQuart }).onfinish = () => {
        // Covered now, but its spilled weather and shadow aren't: let them go softly
        old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: EASE.inSoft, fill: 'forwards' })
            .onfinish = remove;
    };
}

/** Live data for every scene on the page: the ones showing and any about to. The labs show their own weather, on the same clock. */
function update() {
    const data = hass();
    for (const scene of document.querySelectorAll('.scene:not(.lab-scene)')) {
        for (const card of scene.querySelectorAll('animated-weather-card, animated-sun-tracker-card')) card.hass = data;
    }
    for (const lab of labs) lab.refresh();
    watchSky();
}

// ── The room's light, cast by the screen ───────────────────────────────
// The sky is the light source: the light lies over the weather card and
// follows it between layouts. Layout offsets, so a scene's entrance
// transform doesn't skew it.
function offsetIn(element, ancestor) {
    let x = 0;
    let y = 0;
    for (let node = element; node && node !== ancestor; node = node.offsetParent) {
        x += node.offsetLeft;
        y += node.offsetTop;
    }
    return { x, y };
}
function lightCard(light, card, origin, instant = false) {
    const w = card?.offsetWidth;
    const h = card?.offsetHeight;
    if (!w) return;
    const { x, y } = offsetIn(card, origin);
    if (instant) light.classList.add('is-placing');
    light.style.setProperty('--lx', `${(x + w / 2).toFixed(1)}px`);
    light.style.setProperty('--ly', `${(y + h / 2).toFixed(1)}px`);
    light.style.setProperty('--lsx', ((w * 2.4) / 200).toFixed(3));
    light.style.setProperty('--lsy', ((h * 2.3) / 200).toFixed(3));
    if (instant) {
        void light.offsetWidth;
        light.classList.remove('is-placing');
    }
}
function placeLight(instant = false) {
    if (current) lightCard(stageLight, current.weather, scenes, instant);
}
new ResizeObserver(() => placeLight()).observe(scenes);

// The sky dissolves over about three seconds: follow it while it moves, and
// through a storm, whose lightning lights the room with the card. Otherwise
// the loop sleeps.
const shown = new Map();
function setVar(element, name, value) {
    const key = element.id + name;
    if (shown.get(key) === value) return;
    shown.set(key, value);
    element.style.setProperty(name, value);
}

// The hero's sky also tints the whole page (--page-sky, see demo.css)
const rooms = [
    { stage, page: true, sky: () => current?.weather.querySelector('.animated-weather-card'), storm: () => state.conditionId === 'lightning-rainy' },
];
const addRoom = (room) => rooms.push(room);
/** The labs (the engine's and the paints'), once they're built below */
const labs = [];
let watchUntil = 0;
let skyFrame = 0;
function watchSky(ms = 3800) {
    watchUntil = Math.max(watchUntil, performance.now() + ms);
    if (!skyFrame) skyFrame = requestAnimationFrame(followSky);
}
function followSky(now) {
    skyFrame = 0;
    let storming = false;
    for (const room of rooms) {
        const sky = room.sky();
        if (!sky || sky.classList.contains('loading')) continue;
        const mid = getComputedStyle(sky).getPropertyValue('--awc-sky-mid').trim();
        if (mid) setVar(room.stage, '--room-sky', mid);
        if (mid && room.page) setVar(document.documentElement, '--page-sky', mid);
        const storm = room.storm() && !reduceMotion;
        storming ||= storm;
        setVar(room.stage, '--flash', storm ? (sky.querySelector('.lightning')?.style.opacity || '0') : '0');
    }
    if (now < watchUntil || storming) skyFrame = requestAnimationFrame(followSky);
}

// ── Your station: your sensors set the numbers, the forecast the sky ───
const FORECASTS = ['clear', 'cloudy', 'rainy', 'snowy'];
/** Where each reading shows on the card, for the ring that points it out. */
const LANDS_ON = {
    forecast: ['.weather-desc'],
    temperature: ['.temperature'],
    feelsLike: ['.feels-like'],
    humidity: ['.attribute[data-kind="humidity"] .attribute-value'],
    pressure: ['.attribute[data-kind="pressure"] .attribute-value'],
    windSpeed: ['.attribute[data-kind="wind"] .attribute-value'],
    windDirection: ['.attribute[data-kind="wind"] .wind-bearing-arrow'],
    indoorTemperature: ['.indoor-climate-inline'],
    indoorHumidity: ['.indoor-climate-inline'],
};
const LIMITS = { temperature: [-30, 45], pressure: [950, 1050], windSpeed: [0, 90] };

const station = {
    on: false,
    touched: false,
    condition: 'clear',
    readings: Object.fromEntries(STATION.map(row => [row.id, row.value])),
    linked: new Set(),
};
const stationStage = $('#station-stage');
const stationLight = $('#station-light');
const sensorsSwitch = $('#use-sensors');
const readingsEl = $('#readings');
const ringsEl = $('#rings');
const readingRow = (id) => readingsEl.querySelector(`.reading[data-id="${id}"]`);
const formatReading = (row, value = station.readings[row.id]) => Number(value).toFixed(row.decimals);

readingsEl.innerHTML = `
    <div class="reading-group" role="group" aria-labelledby="group-forecast">
        <h3 id="group-forecast">Forecast</h3>
        <div class="reading reading-forecast" data-id="forecast">
            <span class="reading-dot" aria-hidden="true"></span>
            <span class="reading-name"><span class="reading-label">Weather</span><span class="reading-entity">weather.forecast_home</span></span>
            <div class="forecast-picker" role="radiogroup" aria-label="Forecast">${FORECASTS.map(id => `
                <label class="forecast-option">
                    <input type="radio" name="forecast" value="${id}"${id === station.condition ? ' checked' : ''}>
                    <span class="forecast-glyph" data-condition="${id}"></span>
                </label>`).join('')}
            </div>
        </div>
    </div>${['Outside', 'Indoors'].map(group => `
    <div class="reading-group" role="group" aria-labelledby="group-${group.toLowerCase()}">
        <h3 id="group-${group.toLowerCase()}">${group}</h3>${STATION.filter(row => row.group === group).map(row => `
        <div class="reading" data-id="${row.id}">
            <span class="reading-dot" aria-hidden="true"></span>
            <span class="reading-name"><span class="reading-label">${row.label}</span><span class="reading-entity">${row.entity}</span></span>
            <span class="reading-value"><span class="reading-number">${formatReading(row)}</span><span class="reading-unit">${row.unit}</span></span>
            <span class="steppers">${row.step ? `
                <button type="button" class="stepper" data-step="-1" aria-label="Lower the ${group.toLowerCase()} ${row.label.toLowerCase()}">${svgIcon('mdi:minus')}</button>
                <button type="button" class="stepper" data-step="1" aria-label="Raise the ${group.toLowerCase()} ${row.label.toLowerCase()}">${svgIcon('mdi:plus')}</button>` : ''}
            </span>
        </div>`).join('')}
    </div>`).join('')}`;

function nameForecastOptions() {
    for (const id of FORECASTS) {
        const glyph = readingsEl.querySelector(`.forecast-glyph[data-condition="${id}"]`);
        const name = haName(id);
        glyph.parentElement.title = name;
        glyph.previousElementSibling.setAttribute('aria-label', name);
    }
}

// The card reads every sensor option; hass has only the sensors that are on,
// so the rest fall back to the forecast, as they do in Home Assistant
const stationCards = $('#station-cards');
const stationCard = document.createElement('animated-weather-card');
stationCard.setConfig({
    type: 'custom:animated-weather-card',
    entity: ENTITIES.weather,
    sun_entity: ENTITIES.sun,
    ...Object.fromEntries(STATION.map(row => [row.option, row.entity])),
});

function stationHass() {
    const readings = Object.fromEntries([...station.linked].map(id => [id, station.readings[id]]));
    return buildHass({ conditionId: station.condition, phase: state.phase, sun: sunNow(state.minutes), sensors: stationStates(readings), sunTimes });
}
function pushStation() {
    stationCard.hass = stationHass();
    watchSky();
    // Values change width as they fade through; keep the rings on them
    requestAnimationFrame(placeRings);
    setTimeout(placeRings, 400);
}

// Steppers push at most every 250 ms, and always end on the latest reading
let pushTimer = 0;
let pushQueued = false;
function pushSoon() {
    if (pushTimer) {
        pushQueued = true;
        return;
    }
    pushStation();
    pushTimer = setTimeout(() => {
        pushTimer = 0;
        if (pushQueued) {
            pushQueued = false;
            pushSoon();
        }
    }, 250);
}

// A changed reading rolls: up when it rises, down when it falls
const rolling = new WeakMap();
function roll(el, text, direction) {
    if (reduceMotion || typeof el.animate !== 'function') {
        el.textContent = text;
        return;
    }
    const busy = rolling.has(el);
    rolling.set(el, text);
    if (busy) return;
    const out = el.animate([{ transform: 'none', opacity: 1 }, { transform: `translateY(${-40 * direction}%)`, opacity: 0 }],
        { duration: 90, easing: EASE.inQuart, fill: 'forwards' });
    out.onfinish = () => {
        el.textContent = rolling.get(el);
        rolling.delete(el);
        out.cancel();
        el.animate([{ transform: `translateY(${40 * direction}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
            { duration: 200, easing: EASE.outQuart });
    };
}

// ── The handoff: the reading lifts off the row and lands on the card ───
function setLinkedRows(on) {
    readingsEl.querySelectorAll('.reading:not(.reading-forecast)').forEach((row, i) => {
        row.style.setProperty('--d', on && !reduceMotion ? `${i * 60}ms` : '0ms');
        row.classList.toggle('is-linked', on);
    });
}

/**
 * A copy of the card's temperature, in the card's own type, starts at the
 * size and place of the reading and flies to the card. Across and up run
 * on separate curves, so it travels an arc rather than a line. It lands
 * where the card's new value starts its own rise (0.12em low, see the
 * card's fadeThrough), so the two can rise together and hand over unseen.
 */
function flyReading(source, target, text) {
    const from = source.getBoundingClientRect();
    const look = getComputedStyle(target);
    const rise = 0.12 * parseFloat(look.fontSize);
    const to = target.getBoundingClientRect();
    const degree = target.querySelector('.degree');
    const scale = parseFloat(getComputedStyle(source).fontSize) / parseFloat(look.fontSize);

    const across = document.createElement('div');
    const up = document.createElement('div');
    const type = document.createElement('div');
    across.className = 'flight';
    across.setAttribute('aria-hidden', 'true');
    across.style.left = `${to.left}px`;
    across.style.top = `${to.top + rise}px`;
    for (const prop of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color',
        'fontVariantNumeric', 'fontFeatureSettings', 'textShadow']) type.style[prop] = look[prop];
    type.innerHTML = `<span></span><span></span>`;
    type.firstChild.textContent = text;
    type.lastChild.textContent = '°';
    if (degree) {
        const mark = getComputedStyle(degree);
        Object.assign(type.lastChild.style, { fontWeight: mark.fontWeight, letterSpacing: mark.letterSpacing, marginLeft: mark.marginLeft });
    }
    up.append(type);
    across.append(up);
    document.body.append(across);
    // The card may move under the copy (the page scrolls, the view sticks):
    // the copy keeps its curves and adds the card's offset, frame by frame
    const follow = () => {
        if (!across.isConnected) return;
        const now = target.getBoundingClientRect();
        across.style.translate = `${(now.left - to.left).toFixed(1)}px ${(now.top - to.top).toFixed(1)}px`;
        requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);

    const dx = from.left - to.left;
    const dy = from.top + from.height / 2 - (to.top + rise + (to.height * scale) / 2);
    const timing = (easing) => ({ duration: 560, easing, fill: 'both' });
    across.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], timing(EASE.inOutQuad));
    up.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], timing(EASE.outCubic));
    type.animate([{ transform: `scale(${scale})` }, { transform: 'none' }], timing(EASE.inOutQuad));
    // The reading stays behind, dimmed, while its copy is in the air
    source.animate([{ opacity: 1 }, { opacity: 0.35, offset: 0.15 }, { opacity: 0.35, offset: 0.8 }, { opacity: 1 }],
        { duration: 900, easing: 'ease-out' });
    /** Rise with the card's own value as it fades in under the copy, then go. */
    let handedOver = false;
    const handOver = () => {
        if (handedOver) return;
        handedOver = true;
        up.animate([{ transform: 'none' }, { transform: `translateY(${-rise}px)` }],
            { duration: 220, easing: EASE.outQuart, fill: 'forwards' });
        across.animate([{ opacity: 1 }, { opacity: 1, offset: 0.6 }, { opacity: 0 }], { duration: 300, fill: 'forwards' })
            .finished.then(() => across.remove(), () => across.remove());
    };
    return { el: across, handOver };
}

let handoff = [];
function link({ fly = true } = {}) {
    if (station.on) return;
    station.on = true;
    sensorsSwitch.checked = true;
    setLinkedRows(true);
    renderYaml();
    const target = stationCard.querySelector('.animated-weather-card:not(.loading) .temperature');
    const source = readingRow('temperature').querySelector('.reading-number');
    if (!fly || reduceMotion || !target) {
        STATION.forEach(row => station.linked.add(row.id));
        pushStation();
        return;
    }
    const at = (ms, then) => handoff.push(setTimeout(then, ms));
    const push = (...ids) => {
        ids.forEach(id => station.linked.add(id));
        pushStation();
    };
    let flight = null;
    at(80, () => { flight = flyReading(source, target, String(Math.round(station.readings.temperature))); });
    // The card fades its old value out as the copy arrives (120 ms), then
    // fades the new one in under it: hand over in the frame its text changes
    const value = target.querySelector('.temperature-value');
    const swapped = new MutationObserver(() => {
        swapped.disconnect();
        flight?.handOver();
    });
    swapped.observe(value, { childList: true, characterData: true, subtree: true });
    at(520, () => push('temperature'));
    at(800, () => {
        if (!flight?.el.isConnected) return;
        swapped.disconnect();
        flight.handOver();
    });
    // The rest follow in the station's order, so a sensor added to it is never left out
    STATION.filter(row => row.id !== 'temperature').forEach((row, i) => at(700 + i * 60, () => push(row.id)));
}
function unlink() {
    handoff.forEach(clearTimeout);
    handoff = [];
    document.querySelectorAll('.flight').forEach(el => el.remove());
    station.on = false;
    station.linked.clear();
    sensorsSwitch.checked = false;
    setLinkedRows(false);
    pushStation();
    renderYaml();
}

sensorsSwitch.addEventListener('change', () => {
    station.touched = true;
    if (sensorsSwitch.checked) {
        sensorsSwitch.checked = false;
        link();
    } else {
        unlink();
    }
});

readingsEl.addEventListener('change', (event) => {
    if (event.target.name !== 'forecast') return;
    station.condition = event.target.value;
    pushStation();
});

readingsEl.addEventListener('click', (event) => {
    const button = event.target.closest('.stepper');
    if (!button) return;
    const id = button.closest('.reading').dataset.id;
    const row = STATION.find(r => r.id === id);
    const direction = Number(button.dataset.step);
    const raw = Number((station.readings[id] + row.step * direction).toFixed(row.decimals));
    // The wind's direction goes round the compass; the rest stop at their limits
    const [min, max] = LIMITS[id] ?? [-Infinity, Infinity];
    const next = row.wrap ? ((raw % row.wrap) + row.wrap) % row.wrap : Math.min(max, Math.max(min, raw));
    if (next === station.readings[id]) return;
    station.touched = true;
    station.readings[id] = next;
    roll(readingRow(id).querySelector('.reading-number'), formatReading(row), direction);
    // Changing a reading wires the sensors in first
    if (!station.on) link();
    else pushSoon();
});

// ── Rings: hover a reading to see where it lands on the card ───────────
let pointed = null;
function showRings(id) {
    if (id === pointed) return;
    pointed = id;
    for (const ring of [...ringsEl.children]) {
        ring.classList.remove('is-on');
        setTimeout(() => ring.remove(), 160);
    }
    for (const selector of LANDS_ON[id] ?? []) {
        const ring = document.createElement('div');
        ring.className = 'ring';
        ring.dataset.selector = selector;
        ringsEl.append(ring);
        if (!placeRing(ring)) {
            ring.remove();
            continue;
        }
        requestAnimationFrame(() => ring.classList.add('is-on'));
    }
}
function placeRing(ring) {
    const target = stationCard.querySelector(ring.dataset.selector);
    const r = target?.getBoundingClientRect();
    if (!r?.width) return false;
    const box = stationStage.getBoundingClientRect();
    // An icon, such as the wind arrow, sits right against its text: a snug circle
    const icon = target.localName === 'ha-icon';
    const side = icon ? 0 : 6;
    const top = icon ? 0 : 2;
    ring.classList.toggle('ring-icon', icon);
    Object.assign(ring.style, {
        left: `${(r.left - box.left - side).toFixed(1)}px`,
        top: `${(r.top - box.top - top).toFixed(1)}px`,
        width: `${(r.width + side * 2).toFixed(1)}px`,
        height: `${(r.height + top * 2).toFixed(1)}px`,
    });
    return true;
}
function placeRings() {
    for (const ring of ringsEl.querySelectorAll('.ring')) {
        if (ring.dataset.selector && LANDS_ON[pointed]?.includes(ring.dataset.selector)) placeRing(ring);
    }
}
readingsEl.addEventListener('pointerover', (event) => showRings(event.target.closest('.reading')?.dataset.id ?? null));
readingsEl.addEventListener('pointerleave', () => showRings(null));
readingsEl.addEventListener('focusin', (event) => showRings(event.target.closest('.reading')?.dataset.id ?? null));
readingsEl.addEventListener('focusout', (event) => {
    if (!readingsEl.contains(event.relatedTarget)) showRings(null);
});

// ── The station's room ─────────────────────────────────────────────────
addRoom({ stage: stationStage, sky: () => stationCard.querySelector('.animated-weather-card'), storm: () => false });
const placeStationLight = () => lightCard(stationLight, stationCard, stationStage);
new ResizeObserver(placeStationLight).observe(stationStage);

// Once per visit, when you've stopped on it without having touched it, the
// station wires itself in, so you see what it does. Scrolling restarts the
// wait.
if ('IntersectionObserver' in window) {
    let dwell = 0;
    let inView = false;
    const arm = () => {
        clearTimeout(dwell);
        if (!inView || station.touched || station.on) return;
        dwell = setTimeout(() => {
            auto.disconnect();
            removeEventListener('scroll', arm);
            if (!station.touched && !station.on) link();
        }, 400);
    };
    const auto = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        arm();
    }, { threshold: 0.6 });
    auto.observe(stationStage);
    addEventListener('scroll', arm, { passive: true });
}

// ── Frames: a Home Assistant view at 1:1 ───────────────────────────────
// A phone's width for the card and compact layouts, hugging their cards,
// and a wall tablet's panel view for the wall. The layouts section and the
// sun tracker's each have one, with the weather, the time and the colours
// from the hero. Changing layout, the new scene mounts hidden at its final
// size, so it's never measured part-way, and the old one stays until the
// new one has drawn its sky. Then the outline moves (CSS, on --inset and
// --inset-bottom) and the two cross, so the view is never empty.
const LAYOUT_NAMES = { regular: 'Card', compact: 'Compact', wide: 'Wall' };
const BAR_START = `<span class="bar-icon">${svgIcon('mdi:menu')}</span><span>Overview</span>`;
const BAR_END = `<span class="bar-icon">${svgIcon('mdi:magnify')}</span><span class="bar-icon">${svgIcon('mdi:dots-vertical')}</span>`;

/** The sky a scene lights its room with: the weather card's, or a tracker's on its own. */
const skyOf = (scene) => scene?.weather?.querySelector('.animated-weather-card') ?? scene?.tracker?.shadowRoot?.querySelector('.st-card');

/**
 * One frame and its picker. `build` makes the scene for a layout. While
 * `hold()` is true a ready scene waits, and `release()` lets it in. The
 * wall is offered from a stage `wallFrom` px wide. On a phone, the
 * layouts in `probe` are measured hidden before anyone picks them. With
 * `follow`, the section ends where its content ends, and what's under
 * the frame glides to its new place (see glide).
 */
function createFrame({ section, layout, build, captions, label, wallFrom, probe = [], follow, clip, onLayout, onShow, hold = () => false }) {
    const stage = section.querySelector('.frame-stage');
    const figure = stage.querySelector('.frame-figure');
    const frame = figure.querySelector('.frame');
    const scenesEl = frame.querySelector('.frame-scenes');
    const light = stage.querySelector('.stage-light');
    const caption = figure.querySelector('.frame-caption');
    const status = stage.querySelector('.frame-status');
    const picker = section.querySelector('.layout-picker');
    const control = picker.querySelector('.segmented');
    const wallOption = picker.querySelector('input[value="wide"]').closest('label');
    const wallNote = section.querySelector('.wall-note');
    frame.querySelector('.bar-start').innerHTML = BAR_START;
    frame.querySelector('.bar-end').innerHTML = BAR_END;

    const view = { layout, current: null, pending: null, near: false, visible: false, revealed: false, stale: true };
    const lit = (scene) => scene.el.querySelector('.cards').firstElementChild;

    /** Name the layout for screen readers as soon as it's chosen. */
    function announce() {
        frame.setAttribute('aria-label', label(LAYOUT_NAMES[view.layout]));
        status.textContent = `${LAYOUT_NAMES[view.layout]} layout`;
    }

    /**
     * On a phone the box itself keeps the height of the tallest layout it
     * has to hold, so switching never moves the page under it.
     */
    function holdPhoneBox(stack) {
        const needed = 64 + stack + 16;
        if (needed > (parseFloat(frame.style.getPropertyValue('--phone-frame-h')) || 0)) {
            frame.style.setProperty('--phone-frame-h', `${needed}px`);
        }
    }
    let probed = false;
    function probePhone() {
        if (probed || !onPhone()) return;
        probed = true;
        for (const layout of probe) {
            const scene = build(layout);
            scene.el.classList.add('frame-scene', 'is-probe');
            scene.el.inert = true;
            feed(scene);
            scenesEl.append(scene.el);
            whenReady(scene, () => !scene.el.isConnected).then(() => {
                holdPhoneBox(scene.el.querySelector('.cards').offsetHeight);
                scene.el.remove();
                if (view.current) fitOutline(view.current);
            });
        }
    }
    phoneQuery?.addEventListener?.('change', () => {
        probed = false;
        frame.style.removeProperty('--phone-frame-h');
        if (view.near) probePhone();
    });

    /**
     * The outline for a scene: the wall's whole view, or a phone's width
     * hugging its cards with 16 px of dashboard below them.
     */
    function fitOutline(scene) {
        const stack = scene.el.querySelector('.cards').offsetHeight;
        const wide = scene.el.dataset.layout === 'wide';
        if (onPhone() && !wide) holdPhoneBox(stack);
        const bottom = wide ? 0 : Math.max(0, frame.offsetHeight - (64 + stack + 16));
        // The clip eases to it; the page under the frame takes it at once
        figure.style.setProperty('--inset-bottom', `${bottom}px`);
        figure.style.setProperty('--inset-bottom-to', `${bottom}px`);
    }

    /**
     * Change what's under the frame without animating layout: measure where
     * it is, let the layout change once, then carry it from where it was
     * to where it is now by transform, on the outline's own curve. A YAML
     * box that grew is uncovered from its bottom as the page below makes
     * room. Off screen, or with reduced motion, the page simply changes, and
     * the browser's scroll anchoring holds what you're reading.
     */
    const group = figure.querySelector('.frame-after');
    const OUTLINE = { duration: 520, easing: 'cubic-bezier(0.32, 0.72, 0, 1)', id: 'glide' };
    function glide(change) {
        const below = follow?.() ?? [];
        const box = picker.getBoundingClientRect();
        const watching = box.bottom > 0 && box.top < innerHeight;
        if (!below.length || reduceMotion || !view.revealed || !watching) {
            change();
            return;
        }
        const top = (el) => el.getBoundingClientRect().top;
        const groupFrom = top(group);
        const belowFrom = top(below[0]);
        const box2 = clip?.();
        for (const el of [group, ...below, box2]) {
            el?.getAnimations().forEach((animation) => { if (animation.id === 'glide') animation.cancel(); });
        }
        change();
        const groupBy = groupFrom - top(group);
        const belowBy = belowFrom - top(below[0]);
        const slide = (by) => [{ translate: `0 ${by.toFixed(1)}px` }, { translate: '0 0' }];
        if (Math.abs(groupBy) > 0.5) group.animate(slide(groupBy), OUTLINE);
        if (Math.abs(belowBy) > 0.5) below.forEach(el => el.animate(slide(belowBy), OUTLINE));
        const grew = groupBy - belowBy;
        if (box2 && grew > 0.5) {
            box2.animate([{ clipPath: `inset(0 0 ${grew.toFixed(1)}px 0 round 12px)` }, { clipPath: 'inset(0 0 0px 0 round 12px)' }], OUTLINE);
        }
    }

    /** Point the frame at a scene: its outline, its caption and its light. */
    function frameFor(scene) {
        figure.dataset.layout = scene.el.dataset.layout;
        captionText(caption).textContent = captions[scene.el.dataset.layout];
        fitOutline(scene);
        lightCard(light, lit(scene), stage);
    }
    const outlineWatch = new ResizeObserver(() => { if (view.current) fitOutline(view.current); });

    /**
     * Mount the scene for the current layout and colours. Far from view it
     * only notes that the scene is out of date, and mounts when the section
     * comes near. A newer change cancels a scene still waiting.
     */
    function mount() {
        if (!view.near) {
            view.stale = true;
            return;
        }
        view.stale = false;
        if (view.pending) {
            view.pending.cancelled = true;
            view.pending.scene.el.remove();
        }
        const scene = build(view.layout);
        scene.el.classList.add('frame-scene');
        scene.el.style.opacity = '0';
        scene.el.inert = true;
        feed(scene);
        scenesEl.append(scene.el);
        const job = { scene, cancelled: false, ready: false };
        view.pending = job;
        whenReady(scene, () => job.cancelled).then(() => {
            job.ready = true;
            if (!hold()) show(job);
        });
    }

    /** Let in a scene that waited: two frames on, so the release paints first. */
    function release() {
        const job = view.pending;
        if (!job?.ready) return;
        requestAnimationFrame(() => requestAnimationFrame(() => {
            if (view.pending === job && !hold()) show(job);
        }));
    }

    function show(job) {
        const { scene } = job;
        view.pending = null;
        const old = view.current;
        view.current = scene;
        // Into or out of the wall the outline moves: a morph. Otherwise the
        // frame stays put and its text sits in nearly the same place: fade
        // through, so nothing is readable twice
        const morph = !!old && (old.el.dataset.layout === 'wide') !== (scene.el.dataset.layout === 'wide');
        scene.el.inert = false;
        scene.el.style.opacity = '';
        outlineWatch.disconnect();
        outlineWatch.observe(scene.el.querySelector('.cards'));
        const first = !view.revealed;
        glide(() => {
            frameFor(scene);
            onShow?.(scene, first, old);
        });
        watchSky();
        if (old) old.el.inert = true;
        const leave = (delay) => {
            if (!old) return;
            const from = getComputedStyle(old.el).opacity;
            old.el.getAnimations().forEach(animation => animation.cancel());
            old.el.animate([{ opacity: from }, { opacity: 0 }], { duration: reduceMotion ? 200 : 140, delay, easing: EASE.inSoft, fill: 'both' })
                .onfinish = () => old.el.remove();
        };
        if (!view.revealed) {
            old?.el.remove();
            reveal();
            return;
        }
        if (reduceMotion) {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            leave(0);
            return;
        }
        if (morph) {
            // The new card comes in as the outline starts to move, and the
            // old one goes just after, so the view stays covered
            scene.el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE.outQuart });
            leave(40);
        } else {
            leave(0);
            scene.el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }],
                { duration: 300, delay: 100, easing: EASE.outQuart, fill: 'backwards' });
        }
    }

    /** Once, when a quarter of it is in view: the view first, then its card, as Home Assistant draws. */
    function reveal() {
        if (view.revealed || !view.visible || !view.current) return;
        view.revealed = true;
        stage.classList.add('is-shown');
        lightCard(light, lit(view.current), stage, true);
        if (reduceMotion) {
            frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            return;
        }
        frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE.outQuart });
        frame.animate([{ transform: 'translateY(16px)' }, { transform: 'none' }], { duration: 900, easing: EASE.outExpo });
        view.current.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 200, easing: EASE.outQuart, fill: 'backwards' });
    }

    picker.addEventListener('change', (event) => {
        const input = event.target;
        if (input.type !== 'radio') return;
        view.layout = input.value;
        control.style.setProperty('--index', [...control.querySelectorAll('input')].indexOf(input));
        announce();
        onLayout?.(view.layout);
        mount();
    });

    // The scene mounts half a screen before you reach it, so it's drawn by then
    new IntersectionObserver(([entry]) => {
        view.near = entry.isIntersecting;
        if (view.near) probePhone();
        if (view.near && view.stale) mount();
    }, { rootMargin: '0px 0px 50% 0px' }).observe(stage);
    new IntersectionObserver(([entry]) => {
        view.visible = entry.intersectionRatio >= 0.25;
        reveal();
    }, { threshold: [0, 0.25] }).observe(stage);

    // Where the frame can't be a wall, the control offers the card and
    // compact layouts (and, if the section has one, a note says why)
    let wallFits = true;
    new ResizeObserver(() => {
        if (view.current) frameFor(view.current);
        const fits = stage.clientWidth >= wallFrom;
        if (fits === wallFits) return;
        wallFits = fits;
        wallOption.hidden = !fits;
        if (wallNote) wallNote.hidden = fits;
        control.style.setProperty('--count', fits ? 3 : 2);
        if (!fits && view.layout === 'wide') {
            const card = control.querySelector('input[value="regular"]');
            card.checked = true;
            card.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }).observe(stage);

    addRoom({ stage, sky: () => skyOf(view.current), storm: () => !!view.current?.weather && state.conditionId === 'lightning-rainy' });
    return { view, stage, mount, release };
}

// ── YAML ───────────────────────────────────────────────────────────────
const yaml = $('#yaml');
const code = document.querySelector('.code');
let yamlText = '';
let seenLines = null;
let yamlInView = false;
function yamlOptions() {
    return {
        colors: state.colors === 'sky' ? 'sky' : 'theme', station: station.on,
        engine: tune.settings, quiet: tune.quiet, paints: paint.colors, tone: noteSetup.voice,
    };
}
/** Draw the YAML; lines you haven't seen yet glow once, as soon as you can see them. */
function renderYaml() {
    yamlText = configYaml(yamlOptions());
    const lines = yamlText.trimEnd().split('\n');
    seenLines ??= lines;
    yaml.innerHTML = lines.map(line => `<span class="y-line">${highlight(line)}</span>`).join('');
    if (yamlInView) flashNewLines();
}
function flashNewLines() {
    const rows = [...yaml.children];
    rows.forEach((row) => {
        if (!seenLines.includes(row.textContent)) row.classList.add('is-new');
    });
    seenLines = rows.map(row => row.textContent);
}
new IntersectionObserver(([entry]) => {
    yamlInView = entry.isIntersecting;
    if (yamlInView) flashNewLines();
}, { rootMargin: '0px 0px -15% 0px' }).observe(code);

/** Draws YAML into a code element; the lines that changed since last time glow once. */
function snippetRenderer(codeEl) {
    let last = '';
    return (text) => {
        const seen = last ? last.trimEnd().split('\n').map(line => line.trim()) : null;
        last = text;
        codeEl.innerHTML = text.trimEnd().split('\n')
            .map(line => `<span class="y-line${seen && !seen.includes(line.trim()) ? ' is-new' : ''}">${highlight(line)}</span>`).join('');
    };
}

copyButton($('#copy'), () => yamlText, yaml);

// ── The dashboard: a sections view at 1:1, on the screen you pick ──────
// Home Assistant's own layout (HA and dashboardLayout in scene.mjs) lays
// three sections round the cards: the card full size in a section that
// spans two columns, and as a compact strip over the compact sun tracker,
// among tile cards. Each screen is a scene of its own, chrome and all,
// mounted at its width and hidden until every card has drawn; then the
// outline morphs to the new width on --inset (the frame's CSS) while the
// screens cross-fade. The desktop is the page's own width.
const NAV = [['mdi:view-dashboard', 'Overview', true], ['mdi:lightning-bolt', 'Energy'], ['mdi:map', 'Map'],
    ['mdi:format-list-bulleted-type', 'Logbook'], ['mdi:chart-box', 'History']];
const navItem = ([icon, name, selected]) => `<span class="ha-nav-item${selected ? ' is-selected' : ''}">${svgIcon(icon)}<span>${name}</span></span>`;
const sidebarHtml = () => `<aside class="ha-sidebar" aria-hidden="true">
    <div class="ha-sidebar-title">${svgIcon('mdi:home-assistant')}<span>Home Assistant</span></div>
    <nav class="ha-nav">${NAV.map(navItem).join('')}</nav>
    <div class="ha-nav ha-nav-end">${navItem(['mdi:bell', 'Notifications'])}${navItem(['mdi:account-circle', 'Profile'])}</div>
</aside>`;
const tileHtml = (tile) => `<div class="ha-slot ha-tile" style="grid-column: span 6"><ha-card>
    <span class="tile-icon" style="--c: ${tile.color ?? 'var(--state-icon-color)'}">${svgIcon(tile.icon)}</span>
    <span class="tile-text"><span class="tile-name">${tile.name}</span><span class="tile-state">${tile.state}</span></span>
</ha-card></div>`;
const sectionHtml = (section, columns) => `<section class="ha-section" style="grid-column: span ${Math.min(section.span ?? 1, columns)}">
    <h3 class="ha-heading">${section.heading}</h3>
    <div class="ha-grid">${section.cards.map(item => (item.card
        ? `<div class="ha-slot" style="grid-column: span 12; grid-row: span ${CARD_ROWS[item.card]}" data-card="${item.card}"></div>`
        : tileHtml(item))).join('')}</div>
</section>`;

const dash = (() => {
    const section = $('#dash');
    const stage = section.querySelector('.frame-stage');
    const figure = stage.querySelector('.frame-figure');
    const frame = figure.querySelector('.frame');
    const scenesEl = frame.querySelector('.frame-scenes');
    const light = stage.querySelector('.stage-light');
    const caption = figure.querySelector('.frame-caption');
    const status = stage.querySelector('.frame-status');
    const picker = section.querySelector('.device-picker');
    const control = picker.querySelector('.segmented');
    const note = section.querySelector('.dash-note');
    const renderDashYaml = snippetRenderer($('#dash-yaml'));
    let dashText = '';
    const view = { device: 'desktop', current: null, pending: null, near: false, visible: false, revealed: false, stale: true };

    /** A screen's width on this stage: its own, or the stage's for a desktop, and never wider than the stage. */
    const deviceWidth = (id) => Math.min(DEVICES.find(d => d.id === id).width ?? stage.clientWidth, stage.clientWidth);
    const deviceLabel = (id) => DEVICES.find(d => d.id === id).label;
    function captionFor(id, { columns }) {
        if (id === 'phone') return 'A phone: one column, and the card at its regular size.';
        if (columns >= 2) {
            return id === 'tablet'
                ? 'A tablet: two columns. The section that spans both gives the card its wide layout.'
                : 'A desktop, sidebar and all: the same two columns, with room to spare.';
        }
        return `${id === 'tablet' ? 'A tablet' : 'A desktop with its sidebar open'}: one column at this width, so the card keeps its regular size.`;
    }

    /** Home Assistant on a screen: the sidebar when it's wide enough, the toolbar, and the sections with the real cards in their slots. */
    function build(id) {
        const width = deviceWidth(id);
        const layout = dashboardLayout(width);
        const palette = state.colors === 'sky' ? 'default' : 'theme';
        const el = document.createElement('div');
        el.className = 'scene frame-scene ha-app';
        el.dataset.layout = id;
        el.style.setProperty('--scene-w', id === 'desktop' ? '100%' : `${width}px`);
        el.innerHTML = `${layout.sidebar ? sidebarHtml() : ''}<div class="ha-main">
            <div class="ha-toolbar" aria-hidden="true">${layout.sidebar ? '' : `<span class="ha-icon-button">${svgIcon('mdi:menu')}</span>`}<span class="ha-title">Overview</span>
                <span class="ha-tools"><span class="ha-icon-button">${svgIcon('mdi:magnify')}</span><span class="ha-icon-button">${svgIcon('mdi:dots-vertical')}</span></span></div>
            <div class="ha-view" style="--columns: ${layout.columns}">${DASHBOARD.map(s => sectionHtml(s, layout.columns)).join('')}</div>
        </div>`;
        const cards = [];
        const make = (tag, config) => {
            const card = document.createElement(tag);
            card.setConfig(config);
            cards.push(card);
            return card;
        };
        const base = { entity: ENTITIES.weather, sun_entity: ENTITIES.sun, color_palette: palette };
        const weather = make('animated-weather-card', { type: 'custom:animated-weather-card', ...base, flights_entity: ENTITIES.flights, show_note: true });
        const compact = make('animated-weather-card', { type: 'custom:animated-weather-card', ...base, compact: true, show_sun: false });
        const tracker = make('animated-sun-tracker-card', {
            type: 'custom:animated-sun-tracker-card', sun_entity: ENTITIES.sun, moon_entity: ENTITIES.moon,
            weather_entity: ENTITIES.weather, compact: true, color_palette: palette,
        });
        el.querySelector('[data-card="weather"]').append(weather);
        el.querySelector('[data-card="compact"]').append(compact);
        el.querySelector('[data-card="tracker"]').append(tracker);
        return { el, weather, tracker, cards, layout };
    }

    function announce() {
        frame.setAttribute('aria-label', `Live preview of a dashboard, ${deviceLabel(view.device)}`);
        status.textContent = `${deviceLabel(view.device)} screen`;
    }
    /** Point the outline, the caption and the light at a screen. */
    function frameFor(scene) {
        const id = scene.el.dataset.layout;
        figure.dataset.layout = id;
        figure.style.setProperty('--device-w', id === 'desktop' ? 'var(--frame-w)' : `${deviceWidth(id)}px`);
        captionText(caption).textContent = captionFor(id, scene.layout);
        lightCard(light, scene.weather, stage);
    }
    function renderYaml() {
        dashText = dashboardYaml({ colors: state.colors === 'sky' ? 'sky' : 'theme' });
        renderDashYaml(dashText);
    }

    /** Mount the screen for the device picked. Far from view it only notes that it's out of date. */
    function mount() {
        fit();
        if (!view.near) {
            view.stale = true;
            return;
        }
        view.stale = false;
        if (view.pending) {
            view.pending.cancelled = true;
            view.pending.scene.el.remove();
        }
        const scene = build(view.device);
        scene.el.style.opacity = '0';
        scene.el.inert = true;
        feed(scene);
        scenesEl.append(scene.el);
        const job = { scene, cancelled: false };
        view.pending = job;
        // Three cards draw their skies here: give them longer than one
        whenReady(scene, () => job.cancelled, 1200).then(() => {
            view.pending = null;
            show(scene);
        });
    }
    function show(scene) {
        const old = view.current;
        view.current = scene;
        scene.el.inert = false;
        scene.el.style.opacity = '';
        frameFor(scene);
        watchSky();
        if (old) old.el.inert = true;
        if (!view.revealed) {
            old?.el.remove();
            reveal();
            return;
        }
        const leave = (delay) => {
            const from = getComputedStyle(old.el).opacity;
            old.el.getAnimations().forEach(animation => animation.cancel());
            old.el.animate([{ opacity: from }, { opacity: 0 }], { duration: reduceMotion ? 200 : 140, delay, easing: EASE.inSoft, fill: 'both' })
                .onfinish = () => old.el.remove();
        };
        if (reduceMotion) {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            leave(0);
            return;
        }
        // The new screen comes in as the outline starts to move, and the
        // old one goes just after, so the frame stays covered
        scene.el.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: EASE.outQuart });
        leave(40);
    }
    /** Once, when a quarter of it is in view: the screen first, then its cards, as Home Assistant draws. */
    function reveal() {
        if (view.revealed || !view.visible || !view.current) return;
        view.revealed = true;
        stage.classList.add('is-shown');
        lightCard(light, view.current.weather, stage, true);
        if (reduceMotion) {
            frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            return;
        }
        frame.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE.outQuart });
        frame.animate([{ transform: 'translateY(16px)' }, { transform: 'none' }], { duration: 900, easing: EASE.outExpo });
        view.current.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, delay: 200, easing: EASE.outQuart, fill: 'backwards' });
    }

    /**
     * The screens the stage has room for. The picker offers those, or
     * stays out of the way with a line when only the phone fits; a screen
     * that no longer fits gives way to the widest that does.
     */
    function fit() {
        const width = stage.clientWidth;
        let count = 0;
        for (const device of DEVICES) {
            const fits = width >= device.needs;
            picker.querySelector(`input[value="${device.id}"]`).closest('label').hidden = !fits;
            if (fits) count++;
        }
        control.style.setProperty('--count', count);
        picker.hidden = count < 2;
        note.hidden = count >= 2;
        const fitting = DEVICES.filter(device => width >= device.needs);
        if (!fitting.some(device => device.id === view.device)) select(fitting.at(-1).id);
    }
    function select(id) {
        view.device = id;
        const inputs = [...control.querySelectorAll('input')];
        const input = inputs.find(i => i.value === id);
        input.checked = true;
        control.style.setProperty('--index', inputs.indexOf(input));
        announce();
    }
    picker.addEventListener('change', (event) => {
        const input = event.target;
        if (input.type !== 'radio') return;
        select(input.value);
        mount();
    });

    // The scene mounts half a screen before you reach it, so it's drawn by then
    new IntersectionObserver(([entry]) => {
        view.near = entry.isIntersecting;
        if (view.near && view.stale) mount();
    }, { rootMargin: '0px 0px 50% 0px' }).observe(stage);
    new IntersectionObserver(([entry]) => {
        view.visible = entry.intersectionRatio >= 0.25;
        reveal();
    }, { threshold: [0, 0.25] }).observe(stage);
    // The desktop is the stage: when the stage changes width enough to
    // change the columns, Home Assistant would lay the view out again
    const refit = settled(() => {
        if (view.current && view.current.layout.columns !== dashboardLayout(deviceWidth(view.device)).columns) mount();
        else if (view.current) frameFor(view.current);
    }, 250);
    new ResizeObserver(() => {
        const was = view.device;
        fit();
        if (view.device !== was) mount();
        else refit();
    }).observe(stage);

    addRoom({ stage, sky: () => view.current?.weather.querySelector('.animated-weather-card'), storm: () => !!view.current && state.conditionId === 'lightning-rainy' });
    copyButton($('#dash-copy'), () => dashText, $('#dash-yaml'));
    renderYaml();
    return { stage, mount, renderYaml };
})();

// ── The sun tracker: its sizes, and the day under your finger ─────────
// The tracker in a frame of its own, at each size, with the page's one
// clock under it. The card draws the sun from the clock, so dragging the
// time moves the sun with your hand, and its sky settles over the card's
// own dissolve. While you drag, only this section's cards hear about it;
// the rest of the page catches up when you let go.
const scrubber = $('#scrubber');
const scrub = $('#scrub');
const scrubTrack = $('#scrub-track');
const scrubTime = $('#scrub-time');
// What the thumb is drawn with, as opposed to the native range under it
const scrubVisuals = [scrubber.querySelector('.scrubber-head'), ...scrubTrack.querySelectorAll('.scrub-line, .scrub-marks, .scrub-thumb')];
const trackerSnippet = $('#tracker-snippet');
const trackerYamlEl = $('#tracker-yaml');

const clockFormat = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' });
const timeText = (minutes) => clockFormat.format(new Date(2000, 0, 1, Math.floor(minutes / 60), minutes % 60));
const atMinutes = ([hours, minutes]) => hours * 60 + minutes;
const LAST_MINUTE = 1435;
const at = (minutes) => `${((minutes / 1440) * 100).toFixed(3)}%`;
/** The day's sun events, as ticks on the scrubber: the sample's day, or yours. */
let EVENTS = [];
function drawEvents() {
    EVENTS = [
        { minutes: atMinutes(sunTimes.dawn), name: 'First light' },
        { minutes: atMinutes(sunTimes.rise), name: 'Sunrise', label: 'Sunrise' },
        { minutes: atMinutes(sunTimes.noon), name: 'Solar noon', label: 'Noon' },
        { minutes: atMinutes(sunTimes.set), name: 'Sunset', label: 'Sunset' },
        { minutes: atMinutes(sunTimes.dusk), name: 'Last light' },
    ];
    $('#scrub-marks').innerHTML = EVENTS.map(event => `<span class="scrub-tick" style="left: ${at(event.minutes)}"></span>`
        + (event.label ? `<span class="scrub-label" style="left: ${at(event.minutes)}">${event.label}<time>${timeText(event.minutes)}</time></span>` : '')).join('');
}
drawEvents();

/** Card and wall: the tracker on its own. Compact: under the weather card, sharing its sky, as it's built to sit. */
function buildTrackerScene(layout) {
    const palette = state.colors === 'sky' ? 'default' : 'theme';
    const el = document.createElement('div');
    el.className = 'scene tracker-scene';
    el.dataset.layout = layout;
    el.innerHTML = '<div class="cards"></div>';
    const cards = el.firstElementChild;
    let weather = null;
    if (layout === 'compact') {
        weather = document.createElement('animated-weather-card');
        weather.setConfig({
            type: 'custom:animated-weather-card',
            entity: ENTITIES.weather,
            sun_entity: ENTITIES.sun,
            // The tracker shows the next sunset, as in the README's pairing
            show_sun: false,
            color_palette: palette,
        });
        cards.append(weather);
    }
    const tracker = document.createElement('animated-sun-tracker-card');
    tracker.setConfig({
        type: 'custom:animated-sun-tracker-card',
        sun_entity: ENTITIES.sun,
        moon_entity: ENTITIES.moon,
        weather_entity: ENTITIES.weather,
        compact: layout === 'compact',
        color_palette: palette,
    });
    cards.append(tracker);
    return { el, weather, tracker };
}

// While you drag, a new size waits until you let go, and hears the drag
// meanwhile, so it arrives at the time you left it
let dragging = false;

const sunFrame = createFrame({
    section: $('#tracker'),
    layout: 'regular',
    build: buildTrackerScene,
    captions: {
        regular: 'On a phone, at its real width.',
        compact: 'Under the weather card, sharing its sky.',
        wide: 'In a section that spans two columns, or a panel view.',
    },
    label: (name) => `Live preview of the sun tracker, ${name}`,
    // Narrower than this, a "wall" would be a phone held sideways
    wallFrom: 720,
    // On a phone, the weather card over the compact tracker is the tallest
    probe: ['compact'],
    follow: () => [...document.querySelectorAll('#tracker ~ *, .colophon')],
    clip: () => trackerSnippet,
    onShow: (scene, first, old) => {
        // The YAML changes with the card it sets up, in the same layout pass
        renderTrackerYaml();
        watchChart(scene);
        if (first) placeScrubber();
        // Into the wall, the outline opens past the new path: the thumb
        // comes back once it has nearly opened, instead of being cut by it
        else moveScrubber(!reduceMotion && scene.el.dataset.layout === 'wide' && old?.el.dataset.layout !== 'wide' ? 160 : 0);
    },
    hold: () => dragging,
});

/**
 * Lay the scrubber over the tracker's chart, which is where the card draws
 * the sun: 24 hours across its width. The native range spans the chart, so
 * a pointer's x is the time, and the thumb you see is drawn at the time.
 */
function placeScrubber() {
    const scene = sunFrame.view.current;
    const shadow = scene?.tracker.shadowRoot;
    let chart = shadow?.querySelector('.st-chart')?.getBoundingClientRect();
    // The compact strip draws its chart beside the headline, on the right;
    // the scrubber spans the strip instead, as it spans the card at the
    // other sizes, so it lines up with the frame, and the thumb keeps the
    // sun's pace rather than its place
    if (scene?.el.dataset.layout === 'compact') {
        const box = shadow?.querySelector('.st-card')?.getBoundingClientRect();
        if (box?.width) chart = box;
    }
    if (!chart?.width) return;
    const track = scrubTrack.getBoundingClientRect();
    scrubber.style.setProperty('--chart-left', `${(chart.left - track.left).toFixed(2)}px`);
    scrubber.style.setProperty('--chart-w', `${chart.width.toFixed(2)}px`);
    scrubber.style.setProperty('--input-w', `${((chart.width * LAST_MINUTE) / 1440).toFixed(2)}px`);
    // Under a short path, the names alone
    scrubber.classList.toggle('is-narrow', chart.width < 420);
    placeThumb();
}
function placeThumb() {
    const left = parseFloat(scrubber.style.getPropertyValue('--chart-left')) || 0;
    const width = parseFloat(scrubber.style.getPropertyValue('--chart-w')) || scrubTrack.clientWidth;
    scrubber.style.setProperty('--thumb-x', `${(left + (state.minutes / 1440) * width).toFixed(2)}px`);
    // The thumb is the sun, and the moon once the sun is down
    scrubber.classList.toggle('is-night', sunNow(state.minutes).elevation < 0);
    scrub.value = String(state.minutes);
    const text = timeText(state.minutes);
    const event = EVENTS.find(e => e.minutes === state.minutes);
    scrubTime.textContent = text;
    scrub.setAttribute('aria-valuetext', event ? `${text}, ${event.name.toLowerCase()}` : text);
}

// The compact tracker's path starts after its headline, so its width
// moves with the time the headline shows: measure again as the card redraws
let scrubberMoving = false;
const chartWatch = new MutationObserver(() => { if (!scrubberMoving) placeScrubber(); });
function watchChart(scene) {
    chartWatch.disconnect();
    const card = scene.tracker.shadowRoot?.querySelector('.st-card');
    if (card) chartWatch.observe(card, { childList: true });
}

/**
 * A new size: the thumb is only ever drawn under the sun of the card on
 * screen. It fades with the old card, is measured again while it can't be
 * seen, and comes back under the new one as that card arrives.
 */
let scrubberMove = 0;
function moveScrubber(wait = 0) {
    const move = ++scrubberMove;
    scrubberMoving = true;
    const out = scrubVisuals.map((el) => {
        const from = getComputedStyle(el).opacity;
        el.getAnimations().forEach(animation => animation.cancel());
        return el.animate([{ opacity: from }, { opacity: 0 }], { duration: 80, fill: 'forwards' });
    });
    out[0].finished.then(() => {
        if (move !== scrubberMove) return;
        scrubberMoving = false;
        placeScrubber();
        for (const el of scrubVisuals) {
            el.getAnimations().forEach(animation => animation.cancel());
            el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, delay: wait, easing: EASE.outQuart, fill: 'backwards' });
        }
    }, () => {});
}

// While you drag, pushes are coalesced on the frame: at most one every
// 33 ms with a mouse, 50 ms by touch. The card redraws only when the sun's
// elevation moves by half a degree; near noon and midnight it moves less
// than that between pushes, so the pushed value steps 0.6° aside. The card
// uses elevation only for its sky's time of day, which is settled well
// away from the horizon, so the step never shows.
let pushFrame = 0;
let pushedAt = 0;
let pushedElevation = null;
let byTouch = false;
function pushSun() {
    const scenes = [sunFrame.view.current, sunFrame.view.pending?.scene].filter(Boolean);
    if (!scenes.length) return;
    const sun = sunNow(state.minutes);
    const pushed = { ...sun };
    if (pushedElevation !== null && Math.abs(sun.elevation) > 8 && Math.abs(sun.elevation - pushedElevation) < 0.5) {
        pushed.elevation = sun.elevation + (pushedElevation > sun.elevation ? -0.6 : 0.6);
    }
    pushedElevation = pushed.elevation;
    const data = buildHass({ conditionId: state.conditionId, phase: phaseForSun(sun), sun: pushed, flights: state.flights, live: state.live, sunTimes });
    for (const scene of scenes) feed(scene, data);
}
function schedulePush() {
    if (pushFrame) return;
    const tick = (now) => {
        if (now - pushedAt < (byTouch ? 50 : 33)) {
            pushFrame = requestAnimationFrame(tick);
            return;
        }
        pushFrame = 0;
        pushedAt = now;
        pushSun();
    };
    pushFrame = requestAnimationFrame(tick);
}

function scrubTo(minutes) {
    leaveLive(DEFAULT_CONDITION, { keepTime: true });
    state.minutes = Math.min(LAST_MINUTE, Math.max(0, minutes));
    setClock();
    placeThumb();
    schedulePush();
}

/** Where the hero's dial puts a minute: along the path, between its four stops. */
function dialXFor(minutes) {
    const stops = Object.keys(STOPS).map(phase => [minutesFor(phase), STOPS[phase]]);
    stops.push([minutesFor('dawn') + 1440, STOPS.dawn + DIAL.width]);
    const m = minutes < stops[0][0] ? minutes + 1440 : minutes;
    for (let i = 0; i < stops.length - 1; i++) {
        const [m0, x0] = stops[i];
        const [m1, x1] = stops[i + 1];
        if (m >= m0 && m <= m1) return x0 + ((x1 - x0) * (m - m0)) / (m1 - m0);
    }
    return STOPS.dawn;
}

/** Let go: the rest of the page takes the new time, and the hero's dial moves to it, off-screen and still. */
function settleTime() {
    cancelAnimationFrame(pushFrame);
    pushFrame = 0;
    pushedElevation = null;
    syncTime();
    update();
    pushStation();
}
/** The time of day from the sun at the clock: the sky's phase, the dial's knob and stop, and the glyphs' names. */
function syncTime() {
    state.phase = phaseForSun(sunNow(state.minutes));
    cancelAnimationFrame(knobFrame);
    knobX = dialXFor(state.minutes);
    placeKnob(knobX);
    const stop = document.querySelector(`input[name="phase"][value="${state.phase}"]`);
    if (stop) stop.checked = true;
    nameWeatherOptions();
    nameForecastOptions();
}

scrub.addEventListener('pointerdown', (event) => {
    dragging = true;
    byTouch = event.pointerType !== 'mouse';
});
const letGo = () => {
    if (!dragging) return;
    dragging = false;
    sunFrame.release();
};
addEventListener('pointerup', letGo);
addEventListener('pointercancel', letGo);
scrub.addEventListener('input', () => {
    let minutes = Number(scrub.value);
    // A drag catches on sunrise, noon and the rest within ten minutes
    if (dragging) minutes = EVENTS.find(e => Math.abs(e.minutes - minutes) <= 10)?.minutes ?? minutes;
    scrubTo(minutes);
});
scrub.addEventListener('change', settleTime);
scrub.addEventListener('keydown', (event) => {
    let next = null;
    const forward = event.key === 'ArrowRight' || event.key === 'ArrowUp';
    const back = event.key === 'ArrowLeft' || event.key === 'ArrowDown';
    if (event.shiftKey && forward) next = state.minutes + 60;
    else if (event.shiftKey && back) next = state.minutes - 60;
    else if (event.key === 'PageUp') next = EVENTS.find(e => e.minutes > state.minutes)?.minutes ?? EVENTS[0].minutes;
    else if (event.key === 'PageDown') next = [...EVENTS].reverse().find(e => e.minutes < state.minutes)?.minutes ?? EVENTS.at(-1).minutes;
    if (next === null) return;
    event.preventDefault();
    scrubTo(next);
    settleTime();
});

/** The hero's dial sets the page clock to a stop's time; the scrubber jumps to it, still. */
function setPhase(phase) {
    if (state.phase === phase && state.minutes === minutesFor(phase)) return;
    // Your weather is now; another time of day is the sample's
    leaveLive(DEFAULT_CONDITION, { keepTime: true });
    state.minutes = minutesFor(phase);
    state.phase = phase;
    setClock();
    update();
    pushStation();
    moveKnob(STOPS[phase]);
    nameWeatherOptions();
    nameForecastOptions();
    announce();
    placeThumb();
}
// Picking the stop that's already chosen, after a scrub, goes back to its time
$('#phases').addEventListener('click', (event) => {
    const input = event.target.closest('input[name="phase"]');
    if (input) setPhase(input.value);
});

// The tracker's YAML, for the size on screen; the lines that are new glow once
let trackerText = '';
function renderTrackerYaml() {
    const seen = trackerText ? trackerText.trimEnd().split('\n').map(line => line.trim()) : null;
    trackerText = trackerYaml({ layout: sunFrame.view.layout, colors: state.colors === 'sky' ? 'sky' : 'theme' });
    trackerYamlEl.innerHTML = trackerText.trimEnd().split('\n')
        .map(line => `<span class="y-line${seen && !seen.includes(line.trim()) ? ' is-new' : ''}">${highlight(line)}</span>`).join('');
}
renderTrackerYaml();
copyButton($('#tracker-copy'), () => trackerText, trackerYamlEl);

new ResizeObserver(placeScrubber).observe(sunFrame.stage);
document.fonts?.ready.then(placeScrubber);
placeThumb();

// ── Controls ───────────────────────────────────────────────────────────
form.addEventListener('change', (event) => {
    const input = event.target;
    const { name, value } = input;
    const segmented = input.closest('.segmented');
    if (segmented) segmented.style.setProperty('--index', [...segmented.querySelectorAll('input')].indexOf(input));

    if (name === 'condition') {
        if (!leaveLive(value)) {
            endLive();
            lastCondition = value;
            state.conditionId = value;
            update();
            announce();
        }
    } else if (name === 'phase') {
        setPhase(value);
    } else if (name === 'colors') {
        // Sky, or the card following a light or dark Home Assistant theme.
        // Between the two themes only the theme's variables change.
        const wasSky = state.colors === 'sky';
        state.colors = value;
        for (const room of [stage, dash.stage, sunFrame.stage, tuneLab.stage]) {
            room.dataset.colors = value === 'sky' ? 'sky' : 'theme';
            room.dataset.dashboard = value === 'light' ? 'light' : 'dark';
        }
        if (wasSky !== (value === 'sky')) {
            mountScene();
            dash.mount();
            sunFrame.mount();
            tuneLab.mount();
        }
        renderYaml();
        dash.renderYaml();
    }
});

const fly = $('#fly');
const planeGlyph = fly.querySelector('.plane-glyph');
planeGlyph.innerHTML = svgIcon('mdi:airplane');
// The icon's nose points north-east; turn it from there
let planeTurn = 'rotate(0deg)';
fly.addEventListener('click', () => {
    const flight = nextFlight(state.flown++);
    state.flights = [flight];
    update();
    if (reduceMotion) return;
    // The icon leaves along the flight's heading and comes back in from behind
    const rad = ((flight.heading - 90) * Math.PI) / 180;
    const dx = (Math.cos(rad) * 22).toFixed(1);
    const dy = (Math.sin(rad) * 22).toFixed(1);
    const from = planeTurn;
    planeTurn = `rotate(${flight.heading - 45}deg)`;
    planeGlyph.getAnimations().forEach(a => a.cancel());
    planeGlyph.animate([
        { transform: `translate(0, 0) ${from}`, opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) ${planeTurn}`, opacity: 0 },
    ], { duration: 260, easing: EASE.inQuart }).onfinish = () => {
        planeGlyph.animate([
            { transform: `translate(${-dx}px, ${-dy}px) ${planeTurn}`, opacity: 0 },
            { transform: `translate(0, 0) ${planeTurn}`, opacity: 1 },
        ], { duration: 360, easing: EASE.outQuart, fill: 'forwards' });
    };
});

// ── Labs: a card of its own, beside the controls that set it up ───────
// Each lab's card shows the weather its controls change, and is set up
// again when a setting changes: the new card mounts hidden, waits until it
// has drawn its sky, then dissolves over the old one, as a YAML edit lands
// on a dashboard. The page's clock reaches it as a live update.
function createLab({ section, condition, phase = null, config = () => ({}), data = () => ({}), storm = () => false }) {
    const stage = section.querySelector('.lab-stage');
    const scenesEl = stage.querySelector('.scenes');
    const light = stage.querySelector('.stage-light');
    const lab = { condition, current: null, pending: null, near: false, visible: false, revealed: false, stale: true };
    // A lab with a time of its own keeps the sample's sun; the rest follow the page's
    const hassNow = () => buildHass({
        conditionId: lab.condition,
        phase: phase ?? state.phase,
        sun: phase ? sunAt(minutesFor(phase)) : sunNow(state.minutes),
        sunTimes: phase ? SUN_TIMES : sunTimes,
        ...data(),
    });
    const place = (instant = false) => { if (lab.current) lightCard(light, lab.current.weather, scenesEl, instant); };

    /** Set the card up again. Far from view it only notes that it's out of date. */
    function mount() {
        if (!lab.near) {
            lab.stale = true;
            return;
        }
        lab.stale = false;
        if (lab.pending) {
            lab.pending.cancelled = true;
            lab.pending.scene.el.remove();
        }
        const scene = buildScene('regular', config());
        scene.el.classList.add('lab-scene');
        scene.el.style.opacity = '0';
        scene.el.inert = true;
        feed(scene, hassNow());
        scenesEl.append(scene.el);
        const job = { scene, cancelled: false };
        lab.pending = job;
        whenReady(scene, () => job.cancelled).then(() => {
            lab.pending = null;
            show(scene);
        });
    }
    function show(scene) {
        const old = lab.current;
        lab.current = scene;
        scene.el.inert = false;
        if (old) old.el.inert = true;
        if (!lab.revealed) {
            old?.el.remove();
            reveal();
            return;
        }
        scene.el.style.opacity = '';
        place();
        watchSky();
        const remove = () => old.el.remove();
        if (reduceMotion) {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' }).onfinish = remove;
            return;
        }
        scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 320, easing: EASE.outQuart }).onfinish = () => {
            old.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: EASE.inSoft, fill: 'forwards' }).onfinish = remove;
        };
    }
    /** Once, when a quarter of the stage is in view and its card has drawn: the card rises in and its light comes up. */
    function reveal() {
        if (lab.revealed || !lab.visible || !lab.current) return;
        lab.revealed = true;
        const scene = lab.current;
        scene.el.style.opacity = '';
        place(true);
        stage.classList.add('is-shown');
        watchSky();
        if (reduceMotion) {
            scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 });
            return;
        }
        scene.el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: EASE.outQuart });
        scene.el.animate([{ transform: 'translateY(16px)' }, { transform: 'none' }], { duration: 1000, easing: EASE.outExpo });
    }
    /** The clock moved, or the lab's weather changed: a live update, as on a dashboard. */
    function refresh() {
        const data = hassNow();
        for (const scene of [lab.current, lab.pending?.scene]) if (scene) feed(scene, data);
        watchSky();
    }
    /** Show the weather a control changes, if it isn't showing already. */
    function showWeather(conditionId) {
        if (!conditionId || conditionId === lab.condition) return;
        lab.condition = conditionId;
        refresh();
    }

    new IntersectionObserver(([entry]) => {
        lab.near = entry.isIntersecting;
        if (lab.near && lab.stale) mount();
    }, { rootMargin: '0px 0px 50% 0px' }).observe(stage);
    new IntersectionObserver(([entry]) => {
        lab.visible = entry.intersectionRatio >= 0.25;
        reveal();
    }, { threshold: [0, 0.25] }).observe(stage);
    new ResizeObserver(() => place()).observe(scenesEl);
    addRoom({ stage, sky: () => lab.current?.weather.querySelector('.animated-weather-card'), storm: () => storm(lab.condition) });
    const api = { stage, mount, refresh, showWeather };
    labs.push(api);
    return api;
}

/** Calls `fn` once things have been quiet for `ms`: a drag mounts a card when it pauses, not at every step. */
function settled(fn, ms) {
    let timer = 0;
    return () => {
        clearTimeout(timer);
        timer = setTimeout(fn, ms);
    };
}

// ── Tune the weather: the engine's sliders and the quiet switches ──────
const tune = {
    settings: Object.fromEntries(ENGINE.map(row => [row.id, row.value])),
    quiet: Object.fromEntries(QUIET.map(row => [row.id, false])),
};
const tuneLab = createLab({
    section: $('#tune'),
    condition: 'rainy',
    config: () => ({ engine_settings: engineSettings(tune.settings), ...quietOptions(tune.quiet) }),
});
const slidersEl = $('#sliders');
const tuneReset = $('#tune-reset');
const renderTuneYaml = snippetRenderer($('#tune-yaml'));
let tuneText = '';

slidersEl.innerHTML = ENGINE.map(row => `
    <label class="slider" data-id="${row.id}">
        <span class="slider-head"><span class="slider-label">${row.label}</span><output class="slider-value"></output></span>
        <span class="slider-track">
            <span class="slider-fill" aria-hidden="true"></span>
            <span class="slider-thumb" aria-hidden="true"></span>
            <input type="range" min="${row.min}" max="${row.max}" step="${row.step}" aria-label="${row.label}">
        </span>
    </label>`).join('');
$('#quiet-list').innerHTML = QUIET.map(row => `
    <label class="toggle quiet-switch">
        <input type="checkbox" role="switch" data-id="${row.id}">
        <span class="toggle-track" aria-hidden="true"><span class="toggle-thumb"></span></span>
        <span class="quiet-text"><span>${row.label}</span><span class="quiet-note">${row.note}</span></span>
    </label>`).join('');

/** Draw a slider where its setting is: the rail, the thumb, the value as the editor shows it. */
function drawSlider(row) {
    const slider = slidersEl.querySelector(`.slider[data-id="${row.id}"]`);
    const value = tune.settings[row.id];
    const text = formatEngineValue(row.id, value);
    slider.style.setProperty('--p', ((value - row.min) / (row.max - row.min)).toFixed(4));
    slider.classList.toggle('is-set', Math.abs(value - row.value) > 1e-9);
    slider.querySelector('.slider-value').textContent = text;
    const input = slider.querySelector('input');
    input.value = String(value);
    input.setAttribute('aria-valuetext', text);
}
function tuneYaml() {
    const quiet = Object.entries(quietOptions(tune.quiet)).map(([key, value]) => `${key}: ${value}`);
    const engine = engineYaml(tune.settings).trimEnd();
    const lines = [...quiet, ...(engine ? [engine] : [])];
    return (lines.length ? lines.join('\n') : '# Every setting at its default') + '\n';
}
function drawTune() {
    ENGINE.forEach(drawSlider);
    for (const input of $('#quiet-list').querySelectorAll('input')) input.checked = tune.quiet[input.dataset.id];
    tuneReset.hidden = !Object.keys(engineSettings(tune.settings)).length && !Object.values(tune.quiet).some(Boolean);
    tuneText = tuneYaml();
    renderTuneYaml(tuneText);
    renderYaml();
}
const mountTune = settled(() => tuneLab.mount(), 220);

// Taking hold of a slider shows the weather it changes; moving it sets
// the engine up again once the hand pauses
const sliderRow = (target) => ENGINE.find(row => row.id === target.closest('.slider')?.dataset.id);
slidersEl.addEventListener('pointerdown', (event) => { const row = sliderRow(event.target); if (row) tuneLab.showWeather(row.shows); });
slidersEl.addEventListener('focusin', (event) => { const row = sliderRow(event.target); if (row) tuneLab.showWeather(row.shows); });
slidersEl.addEventListener('input', (event) => {
    const row = sliderRow(event.target);
    if (!row) return;
    tune.settings[row.id] = Number(event.target.value);
    tuneLab.showWeather(row.shows);
    drawTune();
    mountTune();
});
$('#quiet-list').addEventListener('change', (event) => {
    const id = event.target.dataset.id;
    if (!id) return;
    tune.quiet[id] = event.target.checked;
    drawTune();
    mountTune();
});
tuneReset.addEventListener('click', () => {
    for (const row of ENGINE) tune.settings[row.id] = row.value;
    for (const row of QUIET) tune.quiet[row.id] = false;
    drawTune();
    mountTune();
});
copyButton($('#tune-copy'), () => tuneText, $('#tune-yaml'));

// ── Paint your own sky: the palettes and the paints ────────────────────
// Its card runs on its own noon sun: a sky colour replaces that condition's
// sky at every hour, and the day shows the colour best
const paint = { colors: {} };
const paintLab = createLab({
    section: $('#paint'),
    condition: 'clear',
    phase: 'day',
    config: () => ({ custom_colors: customColors(paint.colors), color_palette: 'default' }),
    storm: (condition) => condition === 'lightning-rainy',
});
const paintsEl = $('#paints');
const palettesEl = $('#palettes');
const renderPaintYaml = snippetRenderer($('#paint-yaml'));
let paintText = '';
const builtIn = (id) => PAINTS.find(row => row.id === id).builtIn;

palettesEl.innerHTML = PALETTES.map((palette) => {
    const sky = (id) => palette.colors[id] ?? builtIn(id);
    return `
    <label class="chip">
        <input type="radio" name="palette" value="${palette.id}">
        <span class="chip-swatch" aria-hidden="true" style="--a: ${sky('sunny_bg')}; --b: ${sky('rainy_bg')}; --c: ${sky('stormy_bg')}"></span>
        <span>${palette.label}</span>
    </label>`;
}).join('');
paintsEl.innerHTML = ['Skies', 'Details'].map(group => `
    <div class="paint-group" role="group" aria-labelledby="paint-${group.toLowerCase()}">
        <h3 id="paint-${group.toLowerCase()}">${group}</h3>${PAINTS.filter(row => row.group === group).map(row => `
        <label class="paint-row" data-id="${row.id}">
            <span class="swatch"><input type="color" aria-label="${row.label}"></span>
            <span class="paint-name">${row.label}</span>
            <span class="paint-hex"></span>
        </label>`).join('')}
    </div>`).join('');

/** Draw every paint where its colour is, and the palette they add up to, if any. */
function drawPaint() {
    const set = customColors(paint.colors);
    for (const row of PAINTS) {
        const el = paintsEl.querySelector(`.paint-row[data-id="${row.id}"]`);
        const value = set[row.id] ?? row.builtIn;
        el.querySelector('.swatch').style.setProperty('--paint', value);
        el.querySelector('.paint-hex').textContent = value;
        el.classList.toggle('is-set', row.id in set);
        const input = el.querySelector('input');
        if (document.activeElement !== input) input.value = value;
    }
    const palette = paletteOf(paint.colors);
    for (const input of palettesEl.querySelectorAll('input')) input.checked = input.value === palette?.id;
    paintText = Object.keys(set).length ? colorsYaml(paint.colors) : '# Built in: nothing to set\n';
    renderPaintYaml(paintText);
    renderYaml();
}
const mountPaint = settled(() => paintLab.mount(), 350);

const paintRow = (target) => PAINTS.find(row => row.id === target.closest('.paint-row')?.dataset.id);
paintsEl.addEventListener('pointerdown', (event) => { const row = paintRow(event.target); if (row) paintLab.showWeather(row.shows); });
paintsEl.addEventListener('focusin', (event) => { const row = paintRow(event.target); if (row) paintLab.showWeather(row.shows); });
// A colour picker reports every move of the hand; the card follows once it pauses
paintsEl.addEventListener('input', (event) => {
    const row = paintRow(event.target);
    if (!row) return;
    paint.colors[row.id] = event.target.value;
    paintLab.showWeather(row.shows);
    drawPaint();
    mountPaint();
});
palettesEl.addEventListener('change', (event) => {
    const palette = PALETTES.find(p => p.id === event.target.value);
    if (!palette) return;
    paint.colors = { ...palette.colors };
    drawPaint();
    mountPaint();
});
copyButton($('#paint-copy'), () => paintText, $('#paint-yaml'));

// ── The note: your AI writes it, in the voice you pick ─────────────────
// The lab's card keeps one setup, so a new voice never restarts its
// weather. The stand-in AI answers in the voice picked, as the AI does
// with note_tone set, and picking one forgets the note, so the card writes
// a new one behind its status, as it does after a change of voice. A new
// weather is a live update, and the card writes for it. Each step is held
// back about as long as a real AI takes, so the status says what's
// happening long enough to read.
const NOTE_DELAYS = { forecast: 700, write: 1800 };
const noteSetup = { voice: 'snarky' };
const noteLab = createLab({
    section: $('#note'),
    condition: 'clear',
    config: () => ({ entity: ENTITIES.noteWeather, show_note: true }),
    data: () => ({ weatherEntity: ENTITIES.noteWeather, tone: () => noteSetup.voice, noteDelays: NOTE_DELAYS }),
    storm: (condition) => condition === 'lightning-rainy',
});
const voicesEl = $('#voices');
const voiceNote = $('#voice-note');
const renderNoteYaml = snippetRenderer($('#note-yaml'));
let noteText = '';

voicesEl.innerHTML = '<span class="segmented-thumb" aria-hidden="true"></span>' + NOTE_VOICES.map(voice => `
    <label><input type="radio" name="voice" value="${voice.id}"${voice.id === noteSetup.voice ? ' checked' : ''}><span>${voice.label}</span></label>`).join('');
$('#note-weathers').innerHTML = NOTE_FORECASTS.map(id => `
    <label class="weather-option">
        <input type="radio" name="note-weather" value="${id}"${id === 'clear' ? ' checked' : ''}>
        <span class="glyph" data-condition="${id}"></span>
    </label>`).join('');

function drawNote() {
    const index = NOTE_VOICES.findIndex(voice => voice.id === noteSetup.voice);
    voicesEl.style.setProperty('--index', index);
    voiceNote.textContent = NOTE_VOICES[index].note;
    noteText = noteYaml(noteSetup.voice);
    renderNoteYaml(noteText);
    renderYaml();
}
voicesEl.addEventListener('change', (event) => {
    noteSetup.voice = event.target.value;
    drawNote();
    forgetNotes(ENTITIES.noteWeather);
});
$('#note-weathers').addEventListener('change', (event) => noteLab.showWeather(event.target.value));
copyButton($('#note-copy'), () => noteText, $('#note-yaml'));

// ── Your weather: the first key ────────────────────────────────────────
// With your leave, the browser's location goes to Open-Meteo for the
// forecast and to BigDataCloud for the place's name (both free, no key,
// rounded to about a kilometre) and the page becomes your dashboard: your
// weather, your sun, your time of day, your place over the temperature.
// Picking another weather ends it. Nothing is stored.
const liveKey = form.querySelector('.weather-live');
const liveNote = $('#live-note');
const FORECAST = 'https://api.open-meteo.com/v1/forecast';
const GEOCODER = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
const CURRENT = 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m';
const FINDING = 'Finding you. Your location goes to Open\u2011Meteo for the forecast and to BigDataCloud for the place name, rounded to about a kilometre, and nowhere else.';
const TURNED_DOWN = 'Location access was turned down, so this is the sample weather.';
/** The weather chosen before the pin, to go back to when you press it again. */
let lastCondition = state.conditionId;
let liveRequest = 0;
let liveTimer = 0;

function note(text) {
    liveNote.textContent = text;
    liveNote.hidden = !text;
}
function checkCondition(id) {
    const input = form.querySelector(`input[name="condition"][value="${id}"]`);
    if (input) input.checked = true;
}
/** Where you are, or a GeolocationPositionError; a refusal already on record is one without a prompt. */
async function locate() {
    if (!navigator.geolocation) throw Object.assign(new Error('no geolocation'), { code: 1 });
    try {
        const permission = await navigator.permissions?.query({ name: 'geolocation' });
        if (permission?.state === 'denied') throw Object.assign(new Error('denied'), { code: 1 });
    } catch (error) {
        if (error?.code === 1) throw error;
        // No permissions API: the prompt will say
    }
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000, maximumAge: 300000 });
    });
}
const round = (n) => (Math.round(n * 100) / 100).toFixed(2);
/** The place's name where you are, from BigDataCloud, within six seconds; failing that, "Here". */
async function fetchPlace({ latitude, longitude }) {
    try {
        const url = `${GEOCODER}?latitude=${round(latitude)}&longitude=${round(longitude)}&localityLanguage=en`;
        const response = await fetch(url, { signal: AbortSignal.timeout(6000) });
        return placeName(response.ok ? await response.json() : null);
    } catch {
        return 'Here';
    }
}
/**
 * The forecast where you are, in your units: Fahrenheit and mph for a
 * browser set to American English in an American time zone. Language
 * alone would hand Fahrenheit to everyone with an English browser.
 */
async function fetchForecast({ latitude, longitude }) {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
    const american = navigator.language === 'en-US' && (zone.startsWith('America/') || zone.startsWith('Pacific/Honolulu'));
    const units = american ? '&temperature_unit=fahrenheit&wind_speed_unit=mph' : '';
    const url = `${FORECAST}?latitude=${round(latitude)}&longitude=${round(longitude)}&current=${CURRENT}${units}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo answered ${response.status}`);
    return response.json();
}
/**
 * Your weather on the page: the readings under your place's name, the real
 * sun where you are, and the clock at now. Arriving, every card that
 * follows the hero is set up afresh, so none carries a sample reading into
 * yours (a pressure trend, say); a refresh is a live update, trend and all.
 */
function showLive(data, { first = false } = {}) {
    state.live = liveReading(data, liveWhere?.name ?? 'Here');
    state.conditionId = wmoCondition(state.live.code);
    sunTimes = solarTimes(liveWhere);
    drawEvents();
    // Now by the real clock: the page's may have been moved to another time of day
    const now = window.awcDemoClock.now();
    state.minutes = now.getHours() * 60 + now.getMinutes();
    setClock();
    // The mark takes the visitor's real sky, and keeps it whatever the page's clock is moved to
    document.documentElement.dataset.logo = phaseForSun(solarAt(state.minutes, liveWhere));
    if (first) {
        cancelAnimationFrame(pushFrame);
        pushFrame = 0;
        pushedElevation = null;
        syncTime();
        remountFollowers();
        pushStation();
    } else {
        settleTime();
    }
    placeThumb();
    announce();
}
/** The hero and every frame that shows its weather, set up afresh. */
function remountFollowers() {
    mountScene();
    dash.mount();
    sunFrame.mount();
}
async function goLive() {
    const request = ++liveRequest;
    // One key reads as chosen while the page finds you: the pin, and no sample weather
    liveKey.setAttribute('aria-pressed', 'true');
    liveKey.classList.add('is-finding');
    const chosen = form.querySelector('input[name="condition"]:checked');
    if (chosen) chosen.checked = false;
    note(FINDING);
    try {
        const { coords } = await locate();
        const where = { latitude: coords.latitude, longitude: coords.longitude };
        // The forecast and the name together; a slow or missing name still gives your weather, as "Here"
        const [forecast, name] = await Promise.all([fetchForecast(where), fetchPlace(where)]);
        if (request !== liveRequest) return;
        liveWhere = { ...where, name };
        showLive(forecast, { first: true });
        note('Your weather, from Open\u2011Meteo, named by BigDataCloud. Your location went to them, rounded to about a kilometre, and nowhere else. It refreshes every ten minutes while you\u2019re here.');
        clearInterval(liveTimer);
        liveTimer = setInterval(refreshLive, 10 * 60 * 1000);
    } catch (error) {
        if (request !== liveRequest) return;
        liveKey.setAttribute('aria-pressed', 'false');
        checkCondition(lastCondition);
        note(error?.code === 1 ? TURNED_DOWN
            : error?.code ? 'Your location didn\u2019t arrive, so this is the sample weather.'
                : 'Open\u2011Meteo couldn\u2019t be reached, so this is the sample weather.');
    } finally {
        if (request === liveRequest) liveKey.classList.remove('is-finding');
    }
}
async function refreshLive() {
    if (!state.live || !liveWhere || document.hidden) return;
    const request = liveRequest;
    try {
        const data = await fetchForecast(liveWhere);
        if (request === liveRequest && state.live) showLive(data);
    } catch {
        // The last reading stands until the next try
    }
}
/** The bookkeeping of leaving your weather, or of its not arriving: the key, the note, the timer, and no late answer. */
function endLive() {
    liveRequest++;
    clearInterval(liveTimer);
    liveKey.classList.remove('is-finding');
    liveKey.setAttribute('aria-pressed', 'false');
    note('');
}
/**
 * Back to the sample world under a weather of the page's own, if yours was
 * showing: every card is set up afresh, so none carries your reading into
 * the sample's. False if there was nothing to leave.
 */
function leaveLive(conditionId, { keepTime = false } = {}) {
    const wasLive = !!state.live;
    endLive();
    if (!wasLive) return false;
    state.live = null;
    liveWhere = null;
    sunTimes = SUN_TIMES;
    drawEvents();
    lastCondition = conditionId;
    state.conditionId = conditionId;
    checkCondition(conditionId);
    // The time of day from the sample's sun, unless the caller is about to set it
    if (!keepTime) syncTime();
    remountFollowers();
    pushStation();
    placeThumb();
    announce();
    return true;
}
liveKey.addEventListener('click', () => {
    if (!state.live && !liveKey.classList.contains('is-finding')) {
        goLive();
        return;
    }
    if (!leaveLive(lastCondition)) {
        endLive();
        checkCondition(lastCondition);
    }
});

// ── Code, folded under its button ──────────────────────────────────────
// A section's YAML waits folded until you ask for it (the page's own card
// at the end is always open). Folded, it's inert: nothing in it takes
// focus or a screen reader's attention.
for (const button of document.querySelectorAll('.code-toggle')) {
    const slot = document.getElementById(button.getAttribute('aria-controls'));
    const fold = slot.querySelector('.code-fold');
    const label = button.querySelector('.code-toggle-label');
    button.querySelector('.code-toggle-icon').innerHTML = svgIcon('mdi:chevron-down');
    fold.inert = true;
    button.addEventListener('click', () => {
        const open = !slot.hasAttribute('data-open');
        slot.toggleAttribute('data-open', open);
        button.setAttribute('aria-expanded', String(open));
        label.textContent = open ? 'Hide code' : 'View code';
        fold.inert = !open;
    });
}

// ── Start ──────────────────────────────────────────────────────────────
nameWeatherOptions();
nameForecastOptions();
paintGlyphs(state.phase === 'night', false);
placeKnob(knobX);
setClock();
mountScene();
stationCard.hass = stationHass();
stationCards.append(stationCard);
requestAnimationFrame(placeStationLight);
watchSky();
renderYaml();
drawTune();
drawPaint();
drawNote();

// The page opens on your weather, with your leave; the sample's partly
// cloudy sky shows meanwhile, and stays if your location doesn't arrive
goLive();

// On a phone, a stuck card gets a band of the room behind it
const stuck = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        entry.target.classList.toggle('is-stuck', entry.isIntersecting && entry.intersectionRatio < 1 && entry.boundingClientRect.top <= 0);
    }
}, { threshold: [0, 1], rootMargin: '-1px 0px 0px 0px' });
stuck.observe(stage);
stuck.observe(stationStage);
stuck.observe(tuneLab.stage);
stuck.observe(paintLab.stage);
