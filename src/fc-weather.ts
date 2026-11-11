// The forecast and the clock on the weather card: the time leading the
// location line, today's high and low beside the condition, the turning
// line under it, the hourly row and its chips between the hero and the
// readings, and the slide through the hours, with the row (or, where it
// has given way, the divider's rail) as its ruler.
//
// The fit gives way in this order, before the temperature ever shrinks:
// the chips, then the icons, then the row (it folds back to the turning
// line and the rail), then the turning line's own line. A level is kept
// only while the card stays at its regular or compact step and the row's
// first line sits low enough in the card for the light (0.43 of a narrow
// card's height).

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { SKY_GLOW, SKY_GLOW_WIDE, sampleSkyAt, relativeLuminance, type SkyCondition, type SkyPhase } from './sky';
import { HOUR, Slot, Timeline, classOf, clamp, esc, num, sunModel, wetNoun, phaseWeights } from './fc-core';
import { HourRow, METRICS, Metric, TurningLine, available, conditionNoun, highLow, hours, relative, timeHtml, timeParts, timeText, turningLine, dayName } from './fc-data';
import { FcWords, fcWords, fill } from './fc-words';
import { Chips, Hourly, Noun, createChips, createHourly } from './fc-row';
import { Tints, litTints } from './fc-glyphs';
import { Slide, attachSlide } from './fc-slide';
import { TimeText, minuteTicker } from './fc-clock';
import { openView } from './fc-view';

/** The share of a narrow card's height above which the row's first line can't sit (the light law) */
const ROW_TOP_MIN = 0.43;
const LEVELS = ['full', 'glyphs', 'row', 'none', 'bare'];

/** What the forecast says, worked out once per forecast and hour */
export interface Model {
    W: FcWords;
    lang: string;
    tl: Timeline | null;
    entries: Slot[];
    hours: HourRow[];
    has: Record<Metric, boolean>;
    metrics: Metric[];
    noun: Noun;
    fahrenheit: boolean;
    unit: string;
    lineAt(k: number): TurningLine | null;
    hl: [number, number] | null;
    current?: number;
}

export function buildModel(host: ForecastHost, current?: number): Model {
    const hass = host.hass();
    const f = host.forecast();
    const W = fcWords(hass);
    const lang = (hass?.locale?.language || hass?.language || 'en');
    const entity = hass?.states[host.config().entity ?? ''];
    const now = Date.now();
    const fine = f.hourly?.length ? f.hourly : f.daily?.length ? f.daily : null;
    const type = f.hourly?.length ? 'hourly' : f.dailyType ?? 'daily';
    const tl = fine ? new Timeline(fine, type, now) : null;
    const hrs = tl && tl.unit === 'hour' ? hours(tl.slots, hass, 48) : [];
    const has = available(tl && tl.unit === 'hour' ? tl.slots : null);
    const metrics = METRICS.filter(m => has[m]);
    const cache = new Map<number, TurningLine | null>();
    const lineAt = (k: number) => {
        if (!tl || !fine) return null;
        if (!cache.has(k)) cache.set(k, turningLine(k === 0 ? tl : new Timeline(fine, type, tl.slots[k].at.getTime() + 1000), hass));
        return cache.get(k)!;
    };
    const unitT = String(entity?.attributes?.temperature_unit ?? hass?.config?.unit_system?.temperature ?? '°C');
    return {
        W, lang, tl, entries: tl?.slots ?? [], hours: hrs, has, metrics, noun: wetNoun(fine),
        fahrenheit: /F/.test(unitT), unit: String(entity?.attributes?.precipitation_unit ?? hass?.config?.unit_system?.length === 'mi' ? 'in' : 'mm'),
        lineAt, hl: tl ? highLow(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : f.dailyType ? 'daily' : null, tl.slots, now, current, hass) : null,
        current,
    };
}

/** The brightest sky an hour's icon can be seen over: its own hour's and the hours before it in view */
export function iconTints(host: ForecastHost, m: Model, opts: { y0: number; y1: number; glow: typeof SKY_GLOW; reach: number }): (i: number) => Tints | null {
    if (host.config().color_palette === 'theme') return () => null;
    const sun = sunModel(host.hass(), host.config().sun_entity || 'sun.sun');
    const lums: number[] = [];
    const light = m.hours.map(h => sun(new Date(h.date.getTime() + HOUR / 2)));
    const lumOf = (i: number) => {
        if (lums[i] !== undefined) return lums[i];
        const h = m.hours[i];
        const { elevation, rising } = light[i];
        const pw = phaseWeights(elevation, rising);
        const phase = (Object.entries(pw).sort((a, b) => b[1] - a[1])[0][0]) as SkyPhase;
        let cls = classOf(h.condition);
        if (cls === 'clear-night' && phase !== 'night') cls = 'sunny';
        if (cls === 'sunny' && phase === 'night') cls = 'clear-night';
        let max = 0;
        for (const x of [0.12, 0.5, 0.88]) for (const y of [opts.y0, (opts.y0 + opts.y1) / 2, opts.y1]) {
            max = Math.max(max, relativeLuminance(sampleSkyAt(cls as SkyCondition, phase, x, y, opts.glow)));
        }
        return (lums[i] = max);
    };
    const cache: Array<Tints> = [];
    return (i: number) => {
        if (cache[i]) return cache[i];
        let lum = 0;
        for (let j = Math.max(0, i - opts.reach); j <= i; j++) lum = Math.max(lum, lumOf(j));
        // The sky now, too: the row is first seen over it
        lum = Math.max(lum, lumOf(0));
        return (cache[i] = litTints(light[i].elevation, light[i].rising, lum));
    };
}

/** The value text a screen reader hears on the slider */
export function valueText(m: Model, host: ForecastHost, slot: Slot | null): string {
    const hass = host.hass();
    const W = m.W;
    const name = (c?: string) => conditionNoun(c ?? '', hass, s => host.conditionName(s));
    if (!slot || !m.tl) {
        const st = hass?.states[host.config().entity ?? '']?.state ?? '';
        return `${W.now}: ${name(st)}${m.current !== undefined ? `, ${host.temperature(m.current)}°` : ''}`;
    }
    const when = m.tl.unit === 'hour' ? timeText(slot.at, hass) : dayName(slot.at, hass, 'long');
    const chance = slot.precipitation_probability;
    return `${when}, ${relative(slot.at.getTime() - Date.now(), hass, m.tl.unit === 'hour' ? 'hour' : 'day')}: ${name(slot.condition)}`
        + `${typeof slot.temperature === 'number' ? `, ${host.temperature(slot.temperature)}°` : ''}${typeof chance === 'number' && chance >= 20 ? `, ${fill(W.chance_of, { v: String(Math.round(chance)) })}` : ''}`;
}

/** The hour as the away line says it: "17:00", "Thu 2:00 AM", "Thursday" */
function whenHtml(m: Model, host: ForecastHost, slot: Slot): string {
    const hass = host.hass();
    if (!m.tl || m.tl.unit !== 'hour') return esc(dayName(slot.at, hass, 'long'));
    const t = timeHtml(slot.at, hass);
    const today = new Date();
    return slot.at.getDate() === today.getDate() && slot.at.getTime() - today.getTime() < 24 * HOUR ? t : `${esc(dayName(slot.at, hass))} ${t}`;
}

export function attachWeather(host: ForecastHost): ForecastExtras {
    const el = host.element;
    const root = el.querySelector('.animated-weather-card') as HTMLElement;
    const cfg = () => host.config();
    const info = root.querySelector('.weather-info') as HTMLElement;
    const hero = root.querySelector('.main-weather-info') as HTMLElement;
    const compact = root.dataset.variant === 'compact';
    const forecastOn = () => !!cfg().show_forecast;
    const theme = () => cfg().color_palette === 'theme';
    let W = fcWords(host.hass());

    // ── The clock: the location line leads with the time ──
    const loc = hero.querySelector('.location') as HTMLElement | null;
    const clockEl = (loc?.querySelector('.awc-clock') ?? root.querySelector('.compact-meta .awc-clock')) as HTMLElement | null;
    const clock = clockEl ? new TimeText(clockEl) : null;
    let readAt = 0;
    function tickClock(animate: boolean) {
        if (!clock || !clockEl) return;
        const p = timeParts(new Date(), host.hass());
        // A reading after the card was away just appears: nobody saw that minute change
        const seen = Date.now() - readAt < 70_000;
        readAt = Date.now();
        clock.set({ text: `${p.hour}:${p.minute}`, period: p.period }, { animate: animate && seen && !host.still() });
        clockEl.setAttribute('aria-label', timeText(new Date(), host.hass()));
    }
    tickClock(false);

    // ── The forecast's own parts ──
    let model: Model | null = null;
    let dataKey = '';
    let sec: HTMLElement | null = null, hourly: Hourly | null = null, chips: Chips | null = null;
    let descRow: HTMLElement | null = null, companion: HTMLElement | null = null, lineEl: HTMLElement | null = null;
    let away: HTMLElement | null = null;
    let slide: Slide | null = null, rulerKind = '';
    let metric: Metric = 'temp';
    let level = 'none';
    let tintsFor: ((i: number) => Tints | null) | null = null;
    let pendingRebuild = false;
    const wide = () => !compact && root.clientWidth >= 640;
    const desc = root.querySelector('.weather-desc') as HTMLElement | null;
    const current = () => host.current();

    /** The condition's noun at rest, as under the needle */
    function restDesc() {
        if (!desc || !forecastOn() || slide?.away()) return;
        const st = host.hass()?.states[cfg().entity ?? '']?.state;
        if (!st) return;
        const t = conditionNoun(st, host.hass(), s => host.conditionName(s));
        if (desc.textContent !== t) desc.textContent = t;
    }

    function companionHtml(): { hl: string; label: string } {
        const m = model;
        if (!m?.hl) return { hl: '', label: '' };
        const [h, l] = m.hl;
        return {
            hl: `<span class="awc-hl-pair"><b>${esc(m.W.h)}</b> ${esc(host.temperature(h))}°</span><span class="awc-hl-pair"><b>${esc(m.W.l)}</b> ${esc(host.temperature(l))}°</span>`,
            label: fill(m.W.high_low, { h: `${host.temperature(h)}°`, l: `${host.temperature(l)}°` }),
        };
    }

    function build() {
        teardownForecast();
        W = fcWords(host.hass());
        if (!forecastOn()) return;
        model = buildModel(host, current());
        const m = model;
        if (!m.tl) return;
        // The condition's line: the condition, and today's high and low (or the turning line, or the hour's chance)
        if (!compact && desc) {
            descRow = document.createElement('div');
            descRow.className = 'awc-desc-row';
            desc.before(descRow);
            descRow.append(desc);
            companion = document.createElement('span');
            companion.className = 'awc-companion';
            descRow.append(companion);
            writeCompanion();
        }
        // The turning line, on the line under the condition
        const meta = root.querySelector('.hero-meta') as HTMLElement | null;
        if (!compact && meta) {
            lineEl = document.createElement('span');
            lineEl.className = 'awc-line';
            meta.prepend(lineEl);
            writeLine(0);
        }
        // The section: the hourly row and its chips. Narrow: between the hero and the readings; wide: in the hero's column.
        metric = m.metrics.includes(metric) ? metric : (m.metrics[0] ?? 'temp');
        if (m.hours.length && !compact) {
            sec = document.createElement('div');
            sec.className = 'fc-section';
            if (wide()) hero.append(sec); else hero.after(sec);
            const pad = parseFloat(getComputedStyle(info).paddingLeft) || 20;
            const w = wide() ? Math.min(hero.clientWidth || 448, 448) : (root.clientWidth || 353) - 2 * pad;
            if (wide()) sec.style.width = `${w}px`;
            const cols = wide() ? 8 : 6;
            tintsFor = iconTints(host, m, { y0: 0.5, y1: 0.66, glow: wide() ? SKY_GLOW_WIDE : SKY_GLOW, reach: cols });
            hourly = createHourly({
                hass: host.hass(), W, lang: m.lang, hours: m.hours, current: current(), metric, has: m.has, noun: m.noun,
                pitch: w / cols, plot: 44, glyphSize: 22, tints: i => tintsFor?.(i) ?? null, unit: m.unit, fahrenheit: m.fahrenheit,
                conditionName: c => conditionNoun(c, host.hass(), s => host.conditionName(s)),
            });
            sec.append(hourly.el);
            chips = createChips({ W, metrics: m.metrics, value: metric, noun: m.noun, onChange: (k, { keys }) => { metric = k; hourly?.setMetric(k, { animate: !keys }); writeCompanionAway(); } });
            sec.append(chips.el);
        }
        // The away line: the Now control and the hour, in the location line's place
        away = document.createElement('span');
        away.className = 'awc-away';
        away.innerHTML = `<button type="button" class="awc-now awc-noclaim" aria-label="${esc(W.back)}"><i aria-hidden="true"></i>${esc(W.now)}</button><span class="awc-at"></span><span class="awc-rel"></span>`;
        const now = away.querySelector('.awc-now') as HTMLElement;
        for (const ev of ['pointerdown', 'pointerup', 'click']) now.addEventListener(ev, e => e.stopPropagation());
        now.addEventListener('click', () => slide?.home());
        restDesc();
        measureCondition();
    }

    function teardownForecast() {
        slide?.destroy(); slide = null; rulerKind = '';
        hourly?.destroy(); hourly = null;
        chips?.destroy(); chips = null;
        sec?.remove(); sec = null;
        away?.remove(); away = null;
        lineEl?.remove(); lineEl = null;
        if (descRow && desc) { descRow.before(desc); descRow.remove(); }
        descRow = null; companion = null;
        tintsFor = null;
        model = null;
        delete root.dataset.fc;
        delete root.dataset.awcAway;
    }

    function writeCompanion() {
        if (!companion) return;
        const c = companionHtml();
        const line = model?.lineAt(0);
        // Four rows: the line takes the H and L's place when it fits whole; a line starting with the condition's own noun drops it
        const st = host.hass()?.states[cfg().entity ?? '']?.state ?? '';
        const kindNow = ({ rainy: 'rain', pouring: 'rain', 'lightning-rainy': 'storms', lightning: 'storms', snowy: 'snow', 'snowy-rainy': 'sleet', hail: 'sleet' } as Record<string, string>)[st];
        const lineHtml = line ? (line.bareHtml && line.kind === kindNow ? line.bareHtml : line.shortHtml) : '';
        companion.innerHTML = `<span data-v="hl">${c.hl}</span>${lineHtml ? `<span data-v="line">${lineHtml}</span>` : ''}<span data-v="chance"></span>`;
        companion.setAttribute('aria-label', c.label);
        companion.setAttribute('role', 'text');
    }
    function writeLine(k: number) {
        if (!lineEl || !model) return;
        const l = model.lineAt(k);
        const html = l?.html ?? '';
        if (lineEl.innerHTML !== html) lineEl.innerHTML = html;
    }
    /** The chance while pulled, in the H and L grammar ("RAIN 70%"); the row carries it when its chip is on */
    function chanceHtml(s: Slot): string {
        const p = s.precipitation_probability;
        if (typeof p !== 'number' || (p < 20 && !s.condition?.match(/rain|pour|snow|hail|lightning/))) return '';
        if (sec && ['full', 'glyphs', 'row'].includes(level) && metric === 'chance') return '';
        return `<span class="awc-hl-pair"><b>${esc(model!.W[model!.noun])}</b> ${esc(num(Math.round(p), model!.lang))}%</span>`;
    }
    let awaySlot: Slot | null = null;
    function writeCompanionAway() {
        const c = companion?.querySelector('[data-v="chance"]') as HTMLElement | null;
        if (c) c.innerHTML = awaySlot ? chanceHtml(awaySlot) : '';
    }
    /** The widest condition word the hours hold: the chance after it never moves sideways */
    function measureCondition() {
        if (!desc || !model) return;
        const cs = getComputedStyle(desc);
        const ctx = document.createElement('canvas').getContext('2d');
        if (!ctx || !ctx.measureText) return;
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const words = [...new Set(model.entries.slice(0, 48).map(s => conditionNoun(s.condition ?? '', host.hass(), x => host.conditionName(x))))];
        const w = Math.max(0, ...words.map(t => ctx.measureText(t).width || 0));
        if (w) root.style.setProperty('--awc-cond-w', `${Math.ceil(w + 1)}px`);
    }

    // ── The readout: the hour under the needle, in the card's own places ──
    const metricEls = (): Record<string, HTMLElement> => {
        const out: Record<string, HTMLElement> = {};
        for (const kind of ['humidity', 'wind', 'pressure']) { const e = root.querySelector(`.attribute[data-kind="${kind}"] .attribute-text`) as HTMLElement | null; if (e) out[kind] = e; }
        return out;
    };
    let saved: Map<HTMLElement, string> | null = null;
    let savedArrow: string | null = null;
    function save() {
        saved = new Map();
        const temp = root.querySelector('.temperature-value') as HTMLElement | null;
        for (const e of [temp, desc, ...Object.values(metricEls())]) if (e) saved.set(e, e.innerHTML);
        const arrow = root.querySelector('.wind-bearing-arrow') as HTMLElement | null;
        savedArrow = arrow ? arrow.style.transform : null;
    }
    function restore() {
        if (saved) for (const [e, html] of saved) if (e.innerHTML !== html) e.innerHTML = html;
        const arrow = root.querySelector('.wind-bearing-arrow') as HTMLElement | null;
        if (arrow && savedArrow !== null) arrow.style.transform = savedArrow;
        saved = null; savedArrow = null;
    }
    const nf = (v: number) => num(Math.round(v), model?.lang ?? 'en');
    function readout(slot: Slot | null, k: number) {
        const m = model;
        if (!m) return;
        awaySlot = slot;
        if (!slot) {
            restore();
            delete root.dataset.awcAway;
            away?.remove();
            writeLine(0);
            writeCompanionAway();
            host.refresh();
            restDesc();
            return;
        }
        if (!saved) save();
        // The away line: in the location line's place, else at the start of the condition's line
        const locShown = !!loc && getComputedStyle(loc).display !== 'none';
        root.dataset.awcAway = locShown ? 'location' : 'desc';
        if (away) {
            const at = away.querySelector('.awc-at') as HTMLElement, rel = away.querySelector('.awc-rel') as HTMLElement;
            at.innerHTML = whenHtml(m, host, slot);
            rel.textContent = relative(slot.at.getTime() - Date.now(), host.hass(), m.tl?.unit === 'hour' ? 'hour' : 'day');
            if (locShown && loc && away.parentElement !== loc) loc.append(away);
            else if (!locShown && descRow && away.parentElement !== descRow) descRow.prepend(away);
            else if (!locShown && !descRow) hero.prepend(away);
        }
        const temp = root.querySelector('.temperature-value') as HTMLElement | null;
        if (temp && typeof slot.temperature === 'number') temp.textContent = host.temperature(slot.temperature);
        if (desc) desc.innerHTML = `<span class="awc-cond">${esc(conditionNoun(slot.condition ?? '', host.hass(), s => host.conditionName(s)))}</span>`;
        writeCompanionAway();
        writeLine(k);
        // The readings read the hour too: the card stays whole when pulled
        const els = metricEls();
        const vals: Record<string, unknown> = { humidity: slot.humidity, wind: slot.wind_speed, pressure: slot.pressure };
        for (const [kind, e] of Object.entries(els)) {
            const v = vals[kind];
            const home = saved?.get(e);
            if (typeof v !== 'number' || home === undefined) continue;
            const t = home.replace(/^[\d.,\s  ]+/, `${nf(v)}${/^[\d.,]+[\s ]/.test(home) ? ' ' : ''}`);
            if (e.innerHTML !== t) e.innerHTML = t;
        }
        const arrow = root.querySelector('.wind-bearing-arrow') as HTMLElement | null;
        if (arrow && typeof slot.wind_bearing === 'number') arrow.style.transform = `rotate(${slot.wind_bearing + 180}deg)`;
    }

    function attach() {
        if (!model?.tl || !forecastOn()) return;
        const useRow = !!hourly && !hourly.empty && ['full', 'glyphs', 'row'].includes(level);
        const kind = useRow ? 'row' : compact ? 'strip' : wide() ? 'info' : 'divider';
        if (slide && kind === rulerKind) return;
        if (slide?.active()) return;
        slide?.destroy();
        rulerKind = kind;
        const m = model;
        const railHost = useRow ? null : kind === 'divider' ? root.querySelector('.weather-attributes') as HTMLElement | null : info;
        slide = attachSlide({
            host, root, tl: m.tl!,
            ruler: useRow ? hourly : null,
            railHost: railHost ?? info, railClass: `in-${railHost ? kind : 'info'}`,
            sliderHost: useRow ? hourly!.el : railHost ?? info,
            sliderLabel: W.hours,
            valueText: s => valueText(m, host, s),
            onSlot: readout,
            onAway: a => { hourly?.el.classList.toggle('fc-away', a); },
            onHome: () => { if (pendingRebuild) { pendingRebuild = false; setTimeout(() => { dataKey = keyOf(); rebuild(); }, 0); } },
            group: () => [loc, root.querySelector('.temperature'), descRow ?? desc, lineEl, ...Object.values(metricEls())].filter((e): e is HTMLElement => !!e),
            mirror: () => (chips?.sel ? [chips.sel] : []),
        });
    }

    // ── The fit's levels ──
    function setLevel(l: string) {
        level = l;
        root.dataset.fc = l;
        sec?.style.setProperty('--fc-sec-top', '0px');
    }
    function levelOk(overflows: () => boolean): boolean {
        if (!sec || wide() || !['full', 'glyphs', 'row'].includes(level)) return true;
        const r = root.getBoundingClientRect(), s = sec.getBoundingClientRect();
        if (!r.height) return true;
        const need = r.height * ROW_TOP_MIN - (s.top - r.top);
        if (need <= 0.5) return true;
        sec.style.setProperty('--fc-sec-top', `${Math.ceil(need)}px`);
        if (overflows()) { sec.style.setProperty('--fc-sec-top', '0px'); return false; }
        return true;
    }
    /** Whole or not at all: the companion shows the line only if it fits, else H and L, else nothing */
    function fitCompanion() {
        if (!companion || !descRow || root.dataset.awcAway) return;
        const tight = ['tight', 'minimal'].includes(root.dataset.height ?? '') || level === 'bare';
        // The row's own limit (it stops before the light), not its width now: it grows with what it shows
        const mw = parseFloat(getComputedStyle(descRow).maxWidth);
        const limit = descRow.getBoundingClientRect().left + (isFinite(mw) ? mw : hero.clientWidth);
        const fits = (v: string) => { companion!.dataset.show = v; return !!desc && companion!.offsetTop <= desc.offsetTop + 4 && companion!.getBoundingClientRect().right <= limit - 4; };
        if (tight && companion.querySelector('[data-v="line"]') && fits('line')) return;
        if (fits('hl')) return;
        companion.dataset.show = 'none';
    }
    /** No cloud's core and no star behind data: they keep the open sky above the condition's line, right of the hero's text */
    function floor() {
        if (compact || !forecastOn() || !descRow) { root.style.removeProperty('--fc-floor-c'); delete root.dataset.cloudBand; return; }
        const rr = root.getBoundingClientRect();
        const y = descRow.getBoundingClientRect().top - 2;
        const layer = root.querySelector('.clouds-layer') as HTMLElement | null, stars = root.querySelector('.stars-field') as HTMLElement | null;
        const top = (e: HTMLElement | null, d: number) => (e ? e.getBoundingClientRect().top : rr.top - d);
        root.style.setProperty('--fc-floor-c', `${Math.round(y - top(layer, root.hasAttribute('data-spill') ? 48 : 0))}px`);
        root.style.setProperty('--fc-floor-s', `${Math.round(y - top(stars, 0))}px`);
        const xl = Math.max(0, ...[loc, root.querySelector('.temperature') as HTMLElement | null].filter((e): e is HTMLElement => !!e && e.getClientRects().length > 0).map(e => e.getBoundingClientRect().right - rr.left)) + 12;
        root.style.setProperty('--fc-floor-xl', `${Math.round(xl)}px`);
        // Clouds are born in the sky above it; those already up are moved there
        const band = Math.max(24, y - rr.top - 58);
        if (root.dataset.cloudBand !== String(Math.round(band))) {
            root.dataset.cloudBand = String(Math.round(band));
            const gsap = window.AnimatedWeatherCardGsap;
            const H = root.clientHeight || 1;
            for (const t of root.querySelectorAll<HTMLElement>('.cloud-track')) {
                if (t.dataset.awcY === undefined) t.dataset.awcY = String(gsap?.getProperty(t, "y") ?? 0);
                gsap?.set(t, { y: Math.min(1, Number(t.dataset.awcY) / H / 0.45) * band });
            }
        }
    }
    function fitted() {
        fitCompanion();
        floor();
        hourly?.remeasure();
        chips?.fit();
        attach();
    }

    // ── The hour passing, and the clock ──
    let hour = Math.floor(Date.now() / HOUR);
    const ticker = minuteTicker(() => {
        tickClock(true);
        const h = Math.floor(Date.now() / HOUR);
        if (h !== hour) {
            hour = h;
            if (slide?.active()) { pendingRebuild = true; slide.home(); return; }
            if (hourly && !hourly.empty && host.seen() && !host.still()) hourly.step(() => rebuild());
            else rebuild();
        }
    });
    function rebuild() {
        build();
        host.fit();
    }

    function keyOf(): string {
        const f = host.forecast();
        return `${forecastOn()}|${f.settled}|${f.hourly?.length}|${f.hourly?.[0]?.datetime}|${f.hourly?.map(e => `${e.temperature}${e.condition}${e.precipitation_probability}`).join()}|${f.daily?.map(e => `${e.temperature}${e.templow}${e.condition}`).join()}|${current()}`;
    }

    return {
        levels: () => {
            if (!forecastOn() || compact) return [];
            if (model?.tl && hourly && !hourly.empty) return LEVELS;
            return model?.tl ? ['none', 'bare'] : [];
        },
        setLevel,
        levelOk,
        fitted,
        update() {
            W = fcWords(host.hass());
            const key = keyOf();
            if (key === dataKey) { restDesc(); return; }
            // A new forecast while the card shows another hour: it comes home first, then the hours are read again
            if (slide?.active()) { pendingRebuild = true; slide.home(); return; }
            dataKey = key;
            rebuild();
        },
        seen(visible) {
            if (visible) { tickClock(false); ticker.rearm(); }
            else if (slide?.active()) slide.home(true);
            if (visible && pendingRebuild && !slide?.active()) { pendingRebuild = false; rebuild(); }
        },
        away: () => !!slide?.active(),
        conditionText: (state: string) => (forecastOn() ? conditionNoun(state, host.hass(), s => host.conditionName(s)) : null),
        open() {
            if (!model) return;
            openView(host, { model, metric, slots: slide?.slots() ?? 0, chipsLevel: chips?.level() ?? 0, small: root });
        },
        destroy() {
            ticker.stop();
            clock?.finish();
            teardownForecast();
            root.style.removeProperty('--fc-floor-c');
            delete root.dataset.cloudBand;
        },
    };
}

void clamp;
