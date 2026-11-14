// The view that opens on tap: the card's own sky grows into the screen and
// holds the forecast whole: the hero, the hourly row (it browses and stays
// where it's left), the chips, the days with their range bars, every
// reading, and the way to Home Assistant's own history and settings.
//
// What grows is the card's sky: a second instance of the same card, on the
// same entity, revealed through a clip that starts exactly on the card's
// rect. The hero, the row and the chips travel from the card at uniform
// scale; the rest rises in. 420 ms open, 300 ms close on the drawer curve.
// A swipe down follows the finger and closes on the last 80 ms of velocity
// or a third of the height; Escape and Back close it, also mid-open. It's
// a modal dialog in the page's top layer: focus moves in, the page behind
// is inert, and focus comes back to the card.
//
// It's built on the first press of the card, so the first open moves on
// the next frame.

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { CURVE, HOUR, Slot, css, ease, esc, mixHex, num, reducedMotion, whole } from './fc-core';
import { conditionNoun, timeText, week } from './fc-data';
import { layoutLeft, minuteTicker } from './fc-clock';
import { FcWords, fcWords, fill } from './fc-words';
import { Chips, Daily, Hourly, createChips, createDaily, createHourly, graphOf } from './fc-row';
import { litTints } from './fc-glyphs';
import { Slide, attachSlide } from './fc-slide';
import { Model, buildModel, cardClock, feelsNow, iconTints, valueText } from './fc-weather';
import { SKY_GLOW, SKY_GLOW_WIDE, relativeLuminance, sampleSkyAt, type SkyCondition } from './sky';
import { classOf } from './fc-core';
import type { Metric } from './fc-data';
import { cloudFloor } from './cloud-band';
import { precipitationUnit } from './units';
import type { AnimatedWeatherCardConfig, HomeAssistant } from './types';

export const VIEW = { grow: 420, shrink: 300, restFrom: 160, restStep: 28, restDur: 220, restRise: 6, restOut: 100, closeVelocity: 0.5, closeShare: 0.3 };
const IN = css(CURVE.in), OUT = css(CURVE.out);

export interface ViewState { model: Model; metric: Metric; slots: number; chipsLevel: number; small: HTMLElement }

/** What the grown card's view hands the opener */
interface ViewApi {
    hourly: Hourly | null;
    chips: Chips | null;
    daily: Daily | null;
    slide: Slide | null;
    groups: HTMLElement[];
    chrome: HTMLElement[];
    close: HTMLElement;
    more: HTMLElement;
    top: HTMLElement;
    list: HTMLElement;
    setMetric(m: Metric): void;
    park(k: number): void;
}
type ViewElement = HTMLElement & { awcView?: ViewApi; surface?: string; setConfig?(c: AnimatedWeatherCardConfig): void; hass?: HomeAssistant };

// ── The readings, at now or at an hour ─────────────────────────────────────
function readingsHtml(host: ForecastHost, W: FcWords, slot: Slot | null): string {
    const hass = host.hass();
    const lang = hass?.locale?.language || hass?.language || 'en';
    const a = hass?.states[host.config().entity ?? '']?.attributes ?? {};
    const pick = (k: string): unknown => (slot ? (slot as unknown as Record<string, unknown>)[k] : a[k]);
    const n = (v: unknown) => (typeof v === 'number' && isFinite(v) ? v : null);
    const out: Array<{ label: string; value: string; sub?: string }> = [];
    const feels = n(pick('apparent_temperature'));
    if (feels !== null) out.push({ label: W.feels_like, value: `${host.temperature(feels)}°` });
    const ws = n(pick('wind_speed')), gust = n(pick('wind_gust_speed'));
    const wu = String(a.wind_speed_unit ?? 'km/h');
    if (ws !== null) out.push({ label: W.wind, value: `${num(Math.round(ws), lang)} ${wu}`, sub: gust !== null ? fill(W.gusts, { v: `${num(Math.round(gust), lang)} ${wu}` }) : '' });
    const hum = n(pick('humidity'));
    if (hum !== null) out.push({ label: W.humidity, value: `${num(Math.round(hum), lang)}%` });
    const dew = n(pick('dew_point'));
    if (dew !== null) out.push({ label: W.dew_point, value: `${host.temperature(dew)}°` });
    const uv = n(pick('uv_index'));
    if (uv !== null) out.push({ label: W.uv, value: num(Math.round(uv), lang) });
    const cloud = n(pick('cloud_coverage'));
    if (cloud !== null) out.push({ label: W.cloud_cover, value: `${num(Math.round(cloud), lang)}%` });
    const amt = slot ? n(slot.precipitation) : n(a.precipitation);
    const ch = slot ? n(slot.precipitation_probability) : null;
    if (amt !== null || ch !== null) out.push({ label: W.precipitation, value: `${num(amt ?? 0, lang, 1)} ${precipitationUnit(a, hass?.config?.unit_system)}`, sub: ch !== null && ch >= 20 ? fill(W.chance_of, { v: num(Math.round(ch), lang) }) : '' });
    const vis = n(a.visibility);
    if (vis !== null && !slot) out.push({ label: W.visibility, value: `${num(vis, lang)} ${a.visibility_unit ?? 'km'}` });
    const pr = n(pick('pressure'));
    if (pr !== null) out.push({ label: W.pressure, value: `${num(Math.round(pr), lang)} ${a.pressure_unit ?? 'hPa'}` });
    return out.map(r => `<div class="fv-rd"><span class="fv-rd-l">${esc(r.label)}</span><strong>${esc(r.value)}</strong><em${r.sub ? '' : ' aria-hidden="true"'}>${esc(r.sub || ' ')}</em></div>`).join('');
}

/**
 * The view, inside the grown card (surface "view"): the hero on top, then the
 * row and its chips at the card's own pitch, then the days, the readings and
 * the way to history and settings.
 */
export function attachView(host: ForecastHost): ForecastExtras {
    const el = host.element as ViewElement;
    const root = el.querySelector('.animated-weather-card') as HTMLElement;
    const info = root.querySelector('.weather-info') as HTMLElement;
    const hero = root.querySelector('.main-weather-info') as HTMLElement;
    const W = fcWords(host.hass());
    root.dataset.fcView = '';
    info.removeAttribute('role'); info.removeAttribute('tabindex'); info.removeAttribute('aria-label');
    const model = buildModel(host, host.current());
    const top = document.createElement('div');
    top.className = 'fv-top';
    hero.before(top);
    top.append(hero);
    const fc = document.createElement('div');
    fc.className = 'fv-fc';
    top.after(fc);
    const list = document.createElement('div');
    list.className = 'fv-list';
    fc.after(list);
    let hourly: Hourly | null = null, chips: Chips | null = null, daily: Daily | null = null, slide: Slide | null = null;
    const tablet = () => root.clientWidth >= 900;
    const spec = (el as unknown as { awcViewSpec?: { pitch: number; chipsLevel: number; metric: Metric } }).awcViewSpec;
    let metric: Metric = spec?.metric ?? 'temp';
    if (model.hours.length) {
        const w = fc.clientWidth || root.clientWidth - 48;
        const pitch = tablet() ? w / 10 : spec?.pitch ?? w / 6;
        hourly = createHourly({
            hass: host.hass(), W, lang: model.lang, hours: model.hours, current: host.current(), metric, has: model.has, noun: model.noun,
            pitch, plot: 44, glyphSize: 22, unit: model.unit, fahrenheit: model.fahrenheit,
            graph: graphOf(host.config().forecast_graph),
            tints: iconTints(host, model, { y0: 0.3, y1: 0.45, glow: tablet() ? SKY_GLOW_WIDE : SKY_GLOW, reach: 8 }),
            conditionName: c => conditionNoun(c, host.hass(), s => host.conditionName(s)),
        });
        fc.append(hourly.el);
        chips = createChips({ W, metrics: model.metrics, value: metric, noun: model.noun, minLevel: tablet() ? 0 : spec?.chipsLevel ?? 0, onChange: (k, { keys }) => { metric = k; hourly?.setMetric(k, { animate: !keys }); daily?.setMetric(k, { animate: !keys }); } });
        fc.append(chips.el);
    }
    const f = host.forecast();
    const theme = host.config().color_palette === 'theme';
    let lum = 0;
    const st = host.hass()?.states[host.config().entity ?? '']?.state ?? 'sunny';
    for (const x of [0.12, 0.5, 0.88]) for (const y of [0.5, 0.7, 0.9]) lum = Math.max(lum, relativeLuminance(sampleSkyAt(classOf(st) as SkyCondition, host.phase(), x, y, SKY_GLOW)));
    const wk = week(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : 'daily', Date.now(), host.hass(), { count: tablet() ? 8 : 7, current: host.current() });
    daily = createDaily({ hass: host.hass(), W, week: wk, current: host.current(), theme, fahrenheit: model.fahrenheit, tints: theme ? null : litTints(45, false, lum), hours: model.hours, currentFeels: feelsNow(host), noun: model.noun, unit: model.unit, lang: model.lang, conditionName: c => conditionNoun(c, host.hass(), s => host.conditionName(s)) });
    if (metric !== 'temp') daily.setMetric(metric, { animate: false });
    list.append(daily.el);
    list.insertAdjacentHTML('beforeend', `<section class="fv-now"><h3 class="fv-head"></h3><div class="fv-readings"></div></section>`
        + `<button class="fv-more awc-noclaim" type="button"><span>${esc(W.more)}</span><i aria-hidden="true"></i></button>`);
    root.insertAdjacentHTML('beforeend', `<div class="fv-grab" aria-hidden="true"></div><button class="fv-close awc-noclaim" type="button" aria-label="${esc(W.close)}"><i></i></button>`);
    const readings = list.querySelector('.fv-readings') as HTMLElement;
    const head = list.querySelector('.fv-head') as HTMLElement;
    const render = (slot: Slot | null) => {
        readings.innerHTML = readingsHtml(host, W, slot);
        head.textContent = slot ? fill(W.at_head, { t: timeText(slot.at, host.hass()) }) : W.now_head;
    };
    render(null);
    // The turning line, on the line under the condition (the card's own place for it)
    const meta = root.querySelector('.hero-meta') as HTMLElement | null;
    let line: HTMLElement | null = null;
    if (meta) {
        line = document.createElement('span');
        line.className = 'awc-line';
        line.innerHTML = model.lineAt(0)?.html ?? '';
        meta.prepend(line);
    }
    const desc = root.querySelector('.weather-desc') as HTMLElement | null;
    let hlRow: HTMLElement | null = null;
    if (desc) {
        const s = host.hass()?.states[host.config().entity ?? '']?.state;
        if (s) desc.textContent = conditionNoun(s, host.hass(), x => host.conditionName(x));
        // Today's high and low beside the condition, as on the card
        if (model.hl) {
            // With the time as the hero, the temperature already leads the condition in its row
            const lead = desc.parentElement?.classList.contains('awc-lead-row') ? desc.parentElement : null;
            const row = lead ?? document.createElement('div');
            if (!lead) {
                row.className = 'awc-desc-row';
                desc.before(row);
                row.append(desc);
            }
            const [h, l] = model.hl;
            hlRow = row;
            row.insertAdjacentHTML('beforeend', `<span class="awc-companion" data-show="hl" role="text" aria-label="${esc(fill(W.high_low, { h: `${host.temperature(h)}°`, l: `${host.temperature(l)}°` }))}"><span data-v="hl"><span class="awc-hl-pair"><b>${esc(W.h)}</b>\u2009${esc(host.temperature(h))}°</span><span class="awc-hl-pair"><b>${esc(W.l)}</b>\u2009${esc(host.temperature(l))}°</span></span></span>`);
        }
    }
    // The clock leads the location line, or it's the hero (hero: clock), and the date follows it (show_date)
    const clock = cardClock(host, root);
    let browsing = false;
    const tick = () => { clock.date(); if (!(clock.big && browsing)) clock.show(new Date(), false); };
    tick();
    const ticker = minuteTicker(tick);
    if (hourly && model.tl) {
        const temp = root.querySelector('.temperature-value') as HTMLElement | null;
        const home = { temp: temp?.innerHTML ?? '', desc: desc?.innerHTML ?? '', line: line?.innerHTML ?? '' };
        slide = attachSlide({
            host, root, tl: model.tl, ruler: hourly, sliderHost: hourly.el, sliderLabel: W.hours,
            valueText: s => valueText(model, host, s), idleHome: false, dropScale: tablet() ? 0.6 : 0.4,
            onSlot: (s, k) => {
                render(s);
                // A hero clock goes to the hour, and back to now with the row
                browsing = !!s && model.tl?.unit === 'hour';
                if (clock.big) clock.show(browsing && s ? s.at : new Date(), false);
                if (!s) { if (temp) temp.innerHTML = home.temp; if (desc) desc.innerHTML = home.desc; if (line) line.innerHTML = home.line; return; }
                if (temp && typeof s.temperature === 'number') temp.textContent = host.temperature(s.temperature);
                if (desc) desc.textContent = conditionNoun(s.condition ?? '', host.hass(), x => host.conditionName(x));
                if (line) line.innerHTML = model.lineAt(k)?.html ?? '';
            },
            onAway: a => hourly?.el.classList.toggle('fc-away', a),
            // The days follow the needle: its day stands out, the dot rides its bar at the hour's temperature
            onNeedle: (at, t) => daily?.follow(at === null ? null : { at, temperature: t }),
            group: () => [line, root.querySelector('.temperature') as HTMLElement | null, desc].filter((e): e is HTMLElement => !!e),
            mirror: () => [chips?.sel, root.querySelector('.fv-close') as HTMLElement | null].filter((e): e is HTMLElement => !!e),
            disabled: () => !!el.dataset.dragging,
        });
    }
    const api: ViewApi = {
        hourly, chips, daily, slide,
        groups: [daily.el, list.querySelector('.fv-now') as HTMLElement, list.querySelector('.fv-more') as HTMLElement].filter(Boolean),
        chrome: [root.querySelector('.fv-close') as HTMLElement, root.querySelector('.fv-grab') as HTMLElement],
        close: root.querySelector('.fv-close') as HTMLElement,
        more: list.querySelector('.fv-more') as HTMLElement,
        top, list,
        setMetric(m) { if (chips) chips.set(m, { travel: false, silent: true }); hourly?.setMetric(m, { animate: false }); daily?.setMetric(m, { animate: false }); metric = m; },
        park(k) { slide?.park(k); },
    };
    el.awcView = api;
    return {
        levels: () => [], setLevel() {}, levelOk: () => true,
        fitted() {
            clock.fit();
            // Today's high and low whole, or not at all: the row stops short of the light
            const comp = hlRow?.querySelector('.awc-companion') as HTMLElement | null;
            if (comp && hlRow && desc && hlRow.getClientRects().length) {
                comp.dataset.show = 'hl';
                const mw = parseFloat(getComputedStyle(hlRow).maxWidth);
                if (layoutLeft(comp) + comp.offsetWidth > layoutLeft(hlRow) + (isFinite(mw) ? mw : Infinity) - 4 || comp.offsetTop > desc.offsetTop + 4) comp.dataset.show = 'none';
            }
            hourly?.remeasure();
            chips?.fit();
            // Clouds roam the whole sky above the hours, behind the hero's text, as on the card; on a tablet the week
            // stands at the right from the top, so they keep to the upper third there, as its first rows allow
            if (!fc.getClientRects().length) return;
            const y = fc.getBoundingClientRect().top - root.getBoundingClientRect().top - 8;
            cloudFloor(root, tablet() ? Math.min(y, root.clientHeight * 0.3) : y);
        },
        update() {},
        seen() {},
        away: () => !!slide?.active(),
        conditionText: (s: string) => conditionNoun(s, host.hass(), x => host.conditionName(x)),
        open() {},
        destroy() { ticker.stop(); slide?.destroy(); hourly?.destroy(); chips?.destroy(); daily?.destroy(); cloudFloor(root, null); delete el.awcView; },
    };
}

// ── The overlay ────────────────────────────────────────────────────────────
const PAGE_CSS = `
:host { all: initial; }
/* Closed, it stays laid out (hidden, its weather paused), so it opens on the next frame with every measure right */
dialog.fv-dialog:not([open]) { display: block; visibility: hidden; pointer-events: none; }
dialog.fv-dialog { position: fixed; inset: 0; z-index: 2147483646; width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0; padding: 0; border: 0; background: transparent; overflow: hidden; color: inherit; outline: none; }
dialog.fv-dialog::backdrop { background: transparent; }
.fv-scrim { position: absolute; inset: 0; opacity: 0; }
/* The sheet covers the window and its clip shapes it, from the card's rect to the panel's, so the grow can start on a card
   that lies outside the panel; outside the clip it takes no clicks, so the scrim still closes */
.fv-sheet { position: absolute; inset: 0; outline: none; contain: layout; overflow: hidden; }
.fv-sheet > animated-weather-card { position: absolute; display: block; }
.fv-sheet ha-card { --ha-card-border-radius: 0px; --ha-card-border-width: 0px; transition: none !important; height: 100%; }
/* While it grows, shrinks or follows a finger, nothing inside clips but the sheet's own shape */
.fv-sheet[data-moving] ha-card { overflow: visible !important; }
`;

interface Rect { x: number; y: number; w: number; h: number }
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rectOf = (el: Element): Rect => { const r = el.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
const frame = () => new Promise<void>(r => requestAnimationFrame(() => r()));

interface Overlay {
    hostEl: HTMLElement;
    dialog: HTMLDialogElement;
    scrim: HTMLElement;
    sheet: HTMLElement;
    card: ViewElement;
    key: string;
}
const overlays = new WeakMap<HTMLElement, Overlay>();

/** The status bar's height where the page runs under it (viewport-fit=cover, as Home Assistant's does), else 0 */
function safeTop(): number {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:env(safe-area-inset-top, 0px);visibility:hidden;pointer-events:none';
    document.body.append(probe);
    const h = probe.getBoundingClientRect().height;
    probe.remove();
    return h;
}

/** The sheet's place on screen: a phone's whole screen under the status bar; elsewhere a large panel */
function target(): { T: Rect; phone: boolean; radius: number[] } {
    const vw = window.innerWidth, vh = window.innerHeight;
    const phone = vw < 600;
    // Below the status bar, so its close button and grab handle can be reached
    const top = Math.max(10, safeTop() + 8);
    if (phone) return { T: { x: 0, y: top, w: vw, h: vh - top }, phone, radius: [24, 24, 0, 0] };
    const w = Math.min(vw - 48, 1120), h = Math.min(vh - 48, 780);
    return { T: { x: (vw - w) / 2, y: (vh - h) / 2, w, h }, phone, radius: [24, 24, 24, 24] };
}

/** Build (or reuse) the overlay for a card: on its first press, so the first open moves on the next frame */
export function prepareView(host: ForecastHost, state: Omit<ViewState, 'model'>): Overlay | null {
    const small = host.element;
    const { T } = target();
    const key = `${T.w}x${T.h}|${host.config().entity}|${host.hass()?.locale?.language}`;
    const old = overlays.get(small);
    if (old && old.key === key && old.card.isConnected) return old;
    old?.hostEl.remove();
    const hostEl = document.createElement('div');
    hostEl.className = 'awc-view-host';
    const shadow = hostEl.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>${PAGE_CSS}</style><dialog class="fv-dialog"><div class="fv-scrim"></div><div class="fv-sheet" role="dialog" aria-modal="true" tabindex="-1"></div></dialog>`;
    const dialog = shadow.querySelector('dialog') as HTMLDialogElement;
    const scrim = shadow.querySelector('.fv-scrim') as HTMLElement;
    const sheet = shadow.querySelector('.fv-sheet') as HTMLElement;
    sheet.style.visibility = 'hidden';
    document.body.append(hostEl);
    const card = document.createElement('animated-weather-card') as ViewElement;
    card.surface = 'view';
    card.style.cssText = `left:${T.x}px;top:${T.y}px;width:${T.w}px;height:${T.h}px`;
    (card as unknown as { awcViewSpec: unknown }).awcViewSpec = { pitch: (small.querySelector('.fc-hourly') as HTMLElement | null) ? parseFloat((small.querySelector('.fc-hourly') as HTMLElement).style.getPropertyValue('--fc-pitch')) : undefined, chipsLevel: state.chipsLevel, metric: state.metric };
    const cfg = host.config();
    card.setConfig!({ ...cfg, tap_action: { action: 'none' }, hold_action: undefined, double_tap_action: undefined, show_forecast: true, show_clock: true, show_attributes: true, compact: false, layout: 'default', show_note: false, note_entity: undefined });
    card.hass = host.hass();
    sheet.append(card);
    // Hidden until it opens: laid out, its sky drawn, its weather run in for a moment, then paused
    const paused = card as unknown as { wasManuallyPaused: boolean; setAnimationsPaused(p: boolean): void };
    setTimeout(() => { if (!dialog.open && card.isConnected) { paused.wasManuallyPaused = true; paused.setAnimationsPaused(true); } }, 1500);
    const o: Overlay = { hostEl, dialog, scrim, sheet, card, key };
    overlays.set(small, o);
    return o;
}

/** Remove a card's overlay (the card left the page) */
export function dropView(small: HTMLElement): void {
    overlays.get(small)?.hostEl.remove();
    overlays.delete(small);
}

export function openView(host: ForecastHost, state: ViewState): void {
    const small = host.element;
    const o = prepareView(host, state);
    if (!o) return;
    const run = () => { void grow(host, o, state); };
    if (o.card.awcView) run();
    else {
        // The grown card attaches its view once the forecast bundle is in it; it already is, so at most a frame away
        let tries = 0;
        const wait = () => { if (o.card.awcView || tries++ > 30) run(); else requestAnimationFrame(wait); };
        requestAnimationFrame(wait);
    }
    void small;
}

async function grow(host: ForecastHost, o: Overlay, state: ViewState): Promise<void> {
    const view = o.card.awcView;
    if (!view || o.dialog.open) return;
    const v: ViewApi = view;
    const small = state.small;
    const smallEl = host.element;
    const { T, phone, radius } = target();
    const W = fcWords(host.hass());
    const groot = o.card.querySelector('.animated-weather-card') as HTMLElement;
    o.sheet.setAttribute('aria-label', fill(W.view, { place: host.hass()?.states[host.config().entity ?? '']?.attributes?.friendly_name ?? '' }));
    // Carry the card's state: the metric and the hour it's left at
    v.setMetric(state.metric);
    if (state.slots) v.park(state.slots);
    // Reduced motion, animate: false, or a browser without Web Animations: the view is simply there
    const still = reducedMotion() || host.still() || typeof o.sheet.animate !== 'function';
    const lastFocus = document.activeElement as HTMLElement | null;
    const keyboard = !!lastFocus?.matches?.(':focus-visible');
    // The words and parts that fly from the card
    const NAMES: Array<[string, string]> = [['place', '.location'], ['temp', '.temperature'], ['cond', '.awc-desc-row, .weather-desc'], ['line', '.awc-line'], ['row', '.fc-hourly'], ['chips', '.fc-chips']];
    const S = rectOf(small);
    const pairs: Array<{ a: Rect | null; b: Rect; el: HTMLElement; k: number }> = [];
    const mid = getComputedStyle(small).getPropertyValue('--awc-sky-mid').trim() || '#33475f';
    const theme = groot.classList.contains('theme-colors');
    o.scrim.style.background = theme ? 'rgba(0, 0, 0, 0.45)' : `${mixHex('#05070c', mid, 0.32)}a6`;
    o.sheet.style.cssText = '';
    o.sheet.dataset.moving = '';
    o.card.style.cssText = `left:${T.x}px;top:${T.y}px;width:${T.w}px;height:${T.h}px`;
    // Closed, the CSS hides it; nothing inline may outlive a close
    o.dialog.style.visibility = '';
    // A modal dialog in the top layer; without one (an old WebView), a plain open dialog over the page
    if (typeof o.dialog.showModal === 'function') o.dialog.showModal(); else o.dialog.setAttribute('open', '');
    // The sheet is the window: the clip is measured from its edges
    const V = { w: o.sheet.clientWidth || window.innerWidth, h: o.sheet.clientHeight || window.innerHeight };
    const inset = (R: Rect, rad: number[]) => `inset(${R.y.toFixed(2)}px ${(V.w - R.x - R.w).toFixed(2)}px ${(V.h - R.y - R.h).toFixed(2)}px ${R.x.toFixed(2)}px round ${rad.map(r => `${r.toFixed(1)}px`).join(' ')})`;
    const pausable = o.card as unknown as { wasManuallyPaused: boolean; setAnimationsPaused(p: boolean): void };
    if (pausable.wasManuallyPaused) { pausable.wasManuallyPaused = false; pausable.setAnimationsPaused(false); }
    // The card's own clouds and readings ride the grow and hand over: the grown card's clouds wait, then come in on the sky's pace
    const gClouds = groot.querySelector('.clouds-container') as HTMLElement | null;
    const clone = (sel: string, cls: string): HTMLElement | null => {
        const src = small.querySelector(sel) as HTMLElement | null;
        if (!src || !src.getClientRects().length || getComputedStyle(src).display === 'none') return null;
        const r = rectOf(src);
        const c = src.cloneNode(true) as HTMLElement;
        c.classList.add(cls);
        c.setAttribute('aria-hidden', 'true');
        for (const e of c.querySelectorAll('[role], [tabindex], [id]')) { e.removeAttribute('role'); e.removeAttribute('tabindex'); e.removeAttribute('id'); }
        c.style.cssText += `;position:absolute;left:${r.x - T.x}px;top:${r.y - T.y}px;width:${r.w}px;height:${r.h}px;margin:0;z-index:${cls === 'fv-carry' ? 30 : 25};pointer-events:none;opacity:1`;
        if (cls === 'fv-carry') c.style.setProperty('--awc-pad', getComputedStyle(small.querySelector('.weather-info') ?? small).paddingLeft);
        groot.append(c);
        return c;
    };
    const cloudClone = theme || still ? null : clone('.clouds-container', 'fv-clouds');
    const carry = still ? null : clone('.weather-attributes', 'fv-carry');
    if (gClouds && cloudClone) { gClouds.getAnimations?.().forEach(a => a.cancel()); gClouds.style.opacity = '0'; }
    for (const [, sel] of NAMES) {
        const a = small.querySelector(sel) as HTMLElement | null, b = groot.querySelector(sel) as HTMLElement | null;
        if (!b || !b.getClientRects().length) continue;
        b.style.transform = '';
        const ar = a && a.getClientRects().length && getComputedStyle(a).display !== 'none' ? rectOf(a) : null;
        const fs = (e: HTMLElement) => parseFloat(getComputedStyle(e.querySelector('.temperature-value, .weather-desc, .awc-line, .fc-val') ?? e).fontSize) || 1;
        pairs.push({ a: ar, b: rectOf(b), el: b, k: a ? fs(a) / fs(b) : 1 });
    }
    const sky = groot.querySelector('.sky') as HTMLElement | null;
    const track = groot.querySelector('.sun-track') as HTMLElement | null;
    const sunA = small.querySelector('.sun'), sunB = groot.querySelector('.sun');
    const centre = (e: Element) => { const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };
    const sunFrom = sunA ? centre(sunA) : null, sunTo = sunB ? centre(sunB) : null;
    const rest = [...v.groups, ...v.chrome];
    const apply = (p: number, dy: number, closing: boolean) => {
        const R = { x: lerp(S.x, T.x, p), y: lerp(S.y, T.y + dy, p), w: lerp(S.w, T.w, p), h: lerp(S.h, T.h, p) };
        const rad = radius.map(r => lerp(12, r, p));
        o.sheet.style.clipPath = inset(R, rad);
        if (sky) sky.style.transform = p >= 1 && !dy ? '' : `translate3d(${(R.x - T.x).toFixed(2)}px, ${(R.y - T.y).toFixed(2)}px, 0) scale(${(R.w / T.w).toFixed(5)}, ${(R.h / T.h).toFixed(5)})`;
        if (sky) sky.style.transformOrigin = '0 0';
        for (const c of [cloudClone, carry]) if (c && c.isConnected) c.style.transform = `translate3d(${(R.x - T.x - (S.x - T.x)).toFixed(2)}px, ${(R.y - T.y - (S.y - T.y)).toFixed(2)}px, 0)`;
        if (track && sunFrom && sunTo) track.style.translate = p >= 1 && !dy ? '' : `${(lerp(sunFrom.x, sunTo.x, p) - sunTo.x).toFixed(2)}px ${(lerp(sunFrom.y, sunTo.y + dy, p) - sunTo.y).toFixed(2)}px`;
        for (const q of pairs) {
            if (!q.a) { q.el.style.transform = dy ? `translate3d(0, ${dy}px, 0)` : ''; q.el.style.opacity = String(Math.max(0, (p - 0.55) / 0.45)); continue; }
            const s = lerp(q.k, 1, p);
            q.el.style.transformOrigin = '0 0';
            q.el.style.transform = p >= 1 && !dy ? '' : `translate3d(${(lerp(q.a.x, q.b.x, p) - q.b.x).toFixed(2)}px, ${(lerp(q.a.y, q.b.y + dy, p) - q.b.y).toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
        }
        const ride = closing ? R.y - T.y : dy;
        for (const e of rest) e.style.translate = ride ? `0 ${ride.toFixed(2)}px` : '';
        o.scrim.style.opacity = String(Math.max(0, Math.min(1, p * (1 - Math.max(0, dy) / (T.h * 0.9)))));
    };
    const setRest = (on: boolean, animate: boolean) => {
        rest.forEach((e, i) => {
            e.getAnimations?.().forEach(a => a.cancel());
            if (!animate || still) { e.style.opacity = on ? '' : '0'; return; }
            if (on) {
                e.style.opacity = '';
                const gi = Math.min(Math.max(0, v.groups.indexOf(e)), 4);
                e.animate([{ opacity: 0, transform: `translateY(${VIEW.restRise}px)` }, { opacity: 1, transform: 'none' }], { duration: VIEW.restDur, delay: VIEW.restFrom + gi * VIEW.restStep, easing: IN, fill: 'backwards' });
            } else e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: VIEW.restOut, easing: OUT, fill: 'forwards' });
            void i;
        });
    };
    let raf = 0, phase: 'opening' | 'open' | 'closing' | 'dragging' = 'opening', p = 0, dragY = 0;
    const animate = (from: number, to: number, ms: number, dy0: number, done: () => void) => {
        cancelAnimationFrame(raf);
        const t0 = performance.now();
        const step = (ts: number) => {
            const k = Math.min(1, (ts - t0) / ms);
            p = lerp(from, to, ease.drawer(k));
            dragY = to === 0 ? dy0 : dy0 * (1 - ease.drawer(k));
            apply(p, dragY, phase === 'closing');
            if (k < 1) raf = requestAnimationFrame(step); else { raf = 0; done(); }
        };
        raf = requestAnimationFrame(step);
    };
    // ── Open ──
    smallEl.dispatchEvent(new CustomEvent('haptic', { detail: 'light', bubbles: true, composed: true }));
    apply(0, 0, false);
    setRest(false, false);
    o.sheet.focus({ preventScroll: true });
    // The card behind is hidden a frame later, once the sheet has painted over it
    void frame().then(() => { if (phase !== 'closing') small.style.visibility = 'hidden'; });
    const finishOpen = () => {
        phase = 'open'; p = 1; dragY = 0;
        apply(1, 0, false);
        o.sheet.style.clipPath = inset(T, radius);
        delete o.sheet.dataset.moving;
    };
    if (still) {
        apply(1, 0, false); setRest(true, false); finishOpen(); if (gClouds) gClouds.style.opacity = '';
        o.sheet.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: IN });
        o.scrim.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: IN });
    } else {
        setRest(true, true);
        setTimeout(() => { if (phase === 'opening' || phase === 'open') v.daily?.arrive(); }, VIEW.restFrom);
        // The card's readings leave first, in place, as the sky starts to grow; its clouds leave as the words arrive
        carry?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: VIEW.restOut, easing: OUT, fill: 'forwards' }).finished.then(() => carry.remove()).catch(() => carry.remove());
        cloudClone?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, delay: VIEW.restFrom, easing: OUT, fill: 'forwards' });
        animate(0, 1, VIEW.grow, 0, () => {
            finishOpen();
            cloudClone?.remove();
            // The grown card's own clouds come in on the sky's curve
            if (gClouds) { gClouds.style.opacity = ''; if (cloudClone) gClouds.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: css(CURVE.sky) }); }
        });
    }
    // ── Close ──
    let pushed = false;
    try { history.pushState({ ...(history.state ?? {}), awcView: true }, ''); pushed = true; } catch { /* sandboxed */ }
    const onPop = () => { pushed = false; close(); };
    window.addEventListener('popstate', onPop);
    const onCancel = (e: Event) => { e.preventDefault(); if (v.slide?.active() && o.dialog.ownerDocument.activeElement === v.slide.slider) return; close(true); };
    o.dialog.addEventListener('cancel', onCancel);
    const onClose = () => close();
    v.close.addEventListener('click', onClose);
    o.scrim.addEventListener('click', onClose);
    const onMore = () => { host.moreInfo(); };
    v.more.addEventListener('click', onMore);
    let closed = false;
    function close(fromKeys = false) {
        if (closed) return;
        closed = true;
        window.removeEventListener('popstate', onPop);
        o.dialog.removeEventListener('cancel', onCancel);
        v.close.removeEventListener('click', onClose);
        o.scrim.removeEventListener('click', onClose);
        v.more.removeEventListener('click', onMore);
        if (pushed) { pushed = false; try { history.back(); } catch { /* ignore */ } }
        const p0 = p, dy0 = dragY;
        phase = 'closing';
        o.sheet.dataset.moving = '';
        setRest(false, true);
        const end = async () => {
            small.style.visibility = '';
            await frame(); await frame();
            // Closed, the CSS hides it (dialog:not([open])); an inline visibility would outlive the next open
            if (typeof o.dialog.close === 'function') o.dialog.close(); else o.dialog.removeAttribute('open');
            for (const q of pairs) { q.el.style.transform = ''; q.el.style.opacity = ''; }
            if (sky) sky.style.transform = '';
            if (track) track.style.translate = '';
            for (const e of rest) e.style.translate = '';
            o.sheet.getAnimations?.().forEach(a => a.cancel());
            delete o.sheet.dataset.moving;
            cloudClone?.remove(); carry?.remove();
            if (gClouds) gClouds.style.opacity = '';
            v.slide?.home(true);
            // Back to rest, hidden: its weather paused until it opens again
            pausable.wasManuallyPaused = true; pausable.setAnimationsPaused(true);
            v.list.scrollTop = 0;
            const back = lastFocus && lastFocus.isConnected && lastFocus !== document.body ? lastFocus : small.querySelector('.weather-info') as HTMLElement | null;
            (back as HTMLElement & { focus(o?: { preventScroll?: boolean; focusVisible?: boolean }): void } | null)?.focus({ preventScroll: true, focusVisible: keyboard || fromKeys });
        };
        if (still) {
            const a = o.sheet.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: OUT, fill: 'forwards' });
            o.scrim.animate?.([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: OUT, fill: 'forwards' });
            if (a) a.finished.then(() => { void end(); }).catch(() => { void end(); }); else void end();
            return;
        }
        animate(p0, 0, VIEW.shrink * Math.max(0.3, p0), dy0, () => { void end(); });
    }
    // ── Swipe down: the sheet follows the finger from its top; a slow held drag springs back ──
    let drag: { y: number; x: number; id: number; claimed: boolean; samples: Array<{ y: number; t: number }> } | null = null;
    const zone = v.top;
    const down = (e: PointerEvent) => {
        if (!phone || phase !== 'open' || !e.isPrimary || e.button > 0 || (e.target as Element).closest('button')) return;
        drag = { x: e.clientX, y: e.clientY, id: e.pointerId, claimed: false, samples: [] };
    };
    const move = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (!drag.claimed) {
            if (dy > 10 && dy > 1.2 * Math.abs(dx) && !v.slide?.active()) {
                drag.claimed = true; drag.y = e.clientY; phase = 'dragging'; o.card.dataset.dragging = ''; o.sheet.dataset.moving = '';
                try { zone.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
            } else if (Math.abs(dx) > 10 || dy < -10) drag = null;
            return;
        }
        e.preventDefault();
        const d = e.clientY - drag.y;
        dragY = d < 0 ? -Math.min(24, Math.abs(d) * 0.2) : d;
        drag.samples.push({ y: e.clientY, t: e.timeStamp });
        while (drag.samples.length > 12) drag.samples.shift();
        apply(1, dragY, false);
    };
    const up = (e: PointerEvent) => {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null;
        delete o.card.dataset.dragging;
        if (!d.claimed) return;
        const recent = d.samples.filter(x => e.timeStamp - x.t <= 80);
        const a = recent[0], b = recent[recent.length - 1];
        const vel = a && b && b.t - a.t > 8 ? (b.y - a.y) / (b.t - a.t) : 0;
        if (vel > VIEW.closeVelocity || dragY > T.h * VIEW.closeShare) { phase = 'open'; close(); return; }
        phase = 'open';
        // Back up on a critically damped spring
        const omega = (2 * Math.PI) / 0.3;
        let x = dragY, vv = vel * 1000, last = 0;
        const back = (ts: number) => {
            const dt = last ? Math.min(0.05, (ts - last) / 1000) : 1 / 60; last = ts;
            const c2 = vv + omega * x, ex = Math.exp(-omega * dt);
            x = (x + c2 * dt) * ex; vv = (vv - omega * c2 * dt) * ex;
            dragY = Math.abs(x) < 0.3 ? 0 : x;
            apply(1, dragY, false);
            if (dragY !== 0 && phase === 'open') raf = requestAnimationFrame(back); else finishOpen();
        };
        raf = requestAnimationFrame(back);
    };
    zone.addEventListener('pointerdown', down);
    zone.addEventListener('pointermove', move);
    zone.addEventListener('pointerup', up);
    zone.addEventListener('pointercancel', up);
    o.dialog.addEventListener('close', () => {
        zone.removeEventListener('pointerdown', down);
        zone.removeEventListener('pointermove', move);
        zone.removeEventListener('pointerup', up);
        zone.removeEventListener('pointercancel', up);
        small.style.visibility = '';
    }, { once: true });
    void HOUR; void whole; void groot;
}

