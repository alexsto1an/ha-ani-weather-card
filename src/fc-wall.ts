// The wall: the weather card with the forecast on, at least 640 × 540 (a
// wall tablet's two sections columns, ten rows, up to a 1920 × 1080 panel
// and portrait tablets). One composition, sized by the panel: every length
// is a function of its width and height (wallLayout), so a bigger panel is
// the same picture seen from further away, never small type in the corners
// of an empty sky.
//
// Top left, one column on one edge: the time and date (the line the card's
// location line becomes while it's dragged, "‹ Now  16:00  in 3 hr."), the
// temperature (the one hero, about a third of the panel's height, 15% over
// the base its other sizes grow from), and the
// condition with today's high, low and feels like. The sky above the data is
// open: the sun and the clouds have it. At the foot, one band: the turning
// line heading the hours, two-hour columns of label, icon and figure on one
// line each, with the temperature's line under the figures starting at a dot
// on the needle; and beside them (under them in portrait), a tenth of the
// width apart so they read as two blocks, the days, their range bars on one
// scale, the band's height shared row for row. No chips:
// no hand reaches. The row is the slide's ruler, and the card stays where
// it's left.

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { HOUR, Slot, esc, ownControl } from './fc-core';
import { TurningLine, conditionNoun, dateText, dayName, relative, timeHtml, timeParts, week } from './fc-data';
import { fcWords, fill } from './fc-words';
import { Daily, Hourly, createDaily, createHourly, graphOf } from './fc-row';
import { litTints } from './fc-glyphs';
import { Slide, attachSlide } from './fc-slide';
import { TimeText, fitHeroTime, layoutLeft, minuteTicker } from './fc-clock';
import { Model, buildModel, dayPeriods, iconTints, valueText } from './fc-weather';
import { SKY_GLOW_WIDE } from './sky';
import { dropView, openView } from './fc-view';
import { cloudFloor } from './cloud-band';

export const isWall = (root: HTMLElement): boolean => root.clientWidth >= 640 && root.clientHeight >= 540;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Everything the wall's composition measures, in px, from the panel's size */
export interface WallLayout {
    w: number; h: number;
    /** Portrait: the days under the hours instead of beside them */
    stack: boolean;
    /** The margin on every side */
    pad: number;
    /** The temperature's size, and the scale every other tier follows (1 at a 192 px temperature) */
    t0: number; scale: number;
    /** The tiers: the clock, the body (date, condition line, days), the turning line, the hour labels, figures and icons */
    clock: number; body: number; sentence: number; label: number; figure: number; glyph: number;
    /** The days: type, icon, row height and how many */
    day: number; dayGlyph: number; dayRow: number; days: number; bar: number;
    /** The band: the hours' width and columns (two hours each), the days' width, the gutter between (0 stacked) */
    hoursW: number; cols: number; weekW: number; gutter: number;
    /** The hours: the first and last columns' centres this far in from the band's edges, the column, the strip's shift */
    inset: number; col: number; shift: number; fade: number;
    /** The band's line: the five lines' height (the turning line, labels, icons, figures, the temperature's line); the days' gap under the hours in portrait */
    line: number; weekGap: number;
    /** The hours' parts: the labels' line, the labels and icons' height, the figures' line, the line's band under them */
    labelLH: number; colsH: number; glyphGap: number; plotGap: number; valueH: number; lift: number; plot: number; stroke: number;
    /** The hours' height (four lines) and the band's (five, and the week under them in portrait) */
    hoursH: number; bandH: number;
    /** Where the icons sit, as fractions of the height, for their light */
    iconY: [number, number];
}

/**
 * The wall's measures for a panel: the temperature 0.29 of the height (0.22 in portrait; never over 0.3 of the width,
 * 0.32 in portrait; 140 to 360 px), every other tier a damped step of it (62% of the hero's growth), so a bigger panel
 * reads from further away without the hero swallowing it; the margin from the short side and the width; as many
 * two-hour columns as the hours' width holds at 2.5 figures each (3 to 10, never closer than the widest figure needs);
 * five days beside the hours on the band's five lines, a week under them in portrait.
 */
export function wallLayout(w: number, h: number, widest = 2, twelve = false): WallLayout {
    if (h <= w * 1.05) return layoutFor(w, h, widest, twelve, false);
    // Portrait stacks the days under the hours only while the hour labels stay in the panel's lower half (the tinted
    // tier's 4.5:1 across the width) and the sky keeps a tenth of the height; a short portrait lays out beside
    const tall = layoutFor(w, h, widest, twelve, true);
    const top = h - tall.pad - tall.bandH;
    const hero = tall.pad + tall.clock * 1.1 + 0.98 * tall.t0 + tall.body * 1.3;
    return top + tall.line >= 0.48 * h && top - hero >= 0.1 * h ? tall : layoutFor(w, h, widest, twelve, false);
}

function layoutFor(w: number, h: number, widest: number, twelve: boolean, stack: boolean): WallLayout {
    const short = Math.min(w, h);
    const pad = Math.round(clamp(0.04 * short + 0.01 * w, 24, 72));
    // The tiers grow at 62% of the hero's base rate; the temperature itself stands 15% above that base
    const base = clamp(Math.min((stack ? 0.22 : 0.29) * h, (stack ? 0.32 : 0.3) * w), 140, 360);
    const t0 = Math.round(Math.min(base * 1.15, 0.6 * w));
    const scale = clamp(1 + (base / 192 - 1) * 0.62, 0.86, 1.6);
    const r = (n: number) => Math.round(n * scale);
    const body = r(22), clock = r(30), sentence = r(36), label = r(19), figure = r(34), glyph = r(32);
    const day = r(23), dayGlyph = r(26), bar = Math.max(6, r(8));
    const stroke = Math.max(2.5, Math.round(3 * scale * 2) / 2);
    const cw = w - 2 * pad;
    // The hours and the days keep apart: two blocks, not one
    const gutter = stack ? 0 : Math.round(clamp(0.1 * cw, 64, 160));
    // A day's row: name, icon, low, a bar of at least four of its own figures, high, and the gaps between
    const weekW = stack ? cw : Math.round(clamp(0.32 * cw, 14.5 * day, 24 * day));
    const hoursW = stack ? cw : cw - weekW - gutter;
    // The first column's figure starts on the margin's edge and the last one's ends on the band's: the columns'
    // centres are half the widest figure (or label) in from either edge, with the needle on the first
    const inset = Math.round(Math.max(0.31 * figure * widest, (twelve ? 1.45 : 1) * label));
    // A column about 2.5 figures wide at any size (a wider panel shows more hours, not wider gaps), never closer
    // than the widest figure and 0.7 of one between two; three to ten columns, six to twenty hours
    const least = Math.max(2 * inset, widest * 0.62 * figure) + 0.7 * figure;
    let cols = clamp(Math.round((hoursW - 2 * inset) / (2.5 * figure)) + 1, 3, 10);
    while (cols > 3 && (hoursW - 2 * inset) / (cols - 1) < least) cols--;
    const col = (hoursW - 2 * inset) / Math.max(1, cols - 1);
    // The row draws an hour's column every pitch (half a column) with the first label at a quarter column in
    const shift = Math.round((inset - col / 4) * 100) / 100;
    // The band is five lines of one height: the turning line, the hours' labels, their icons, their figures and the
    // temperature's line; beside them the five days ride the same five lines
    const line = Math.round(figure * 1.24);
    const labelLH = line;
    const glyphGap = Math.round((line - glyph) / 2);
    const colsH = labelLH + glyphGap + glyph;
    const valueH = Math.round(figure * 1.12);
    const plotGap = Math.round(2.5 * line - valueH / 2) - colsH;
    const travel = line - 8;
    const lift = Math.round(line - valueH / 2 - travel / 2);
    const plot = 4 * line - colsH - plotGap;
    const hoursH = 4 * line;
    // Portrait: the days under the hours, a line's height apart; a week when the sky keeps an eighth of the panel
    const weekGap = line;
    let days = 5, dayRow = line, bandH = 5 * line;
    if (stack) {
        dayRow = Math.round(day * 1.8);
        const hero = clock * 1.25 + 0.17 * t0 + 0.705 * t0 + 0.105 * t0 + body * 1.3;
        const rest = h - 2 * pad - hero - 5 * line - weekGap;
        days = rest - 7 * dayRow >= 0.125 * h ? 7 : 5;
        bandH = 5 * line + weekGap + days * dayRow;
    }
    // The row fades out past its last column into the gutter (the margin in portrait), short of the next column
    const fade = Math.round(Math.min(stack ? pad * 0.6 : gutter * 0.5, 0.3 * (col - 2 * inset)));
    const iconTop = h - pad - bandH + 1.5 * line - glyph / 2;
    return {
        w, h, stack, pad, t0, scale, clock, body, sentence, label, figure, glyph, day, dayGlyph, dayRow, days, bar,
        hoursW, cols, weekW, gutter, inset, col, shift, fade, line, weekGap, labelLH, colsH, glyphGap, plotGap, valueH, lift, plot, stroke, hoursH, bandH,
        iconY: [clamp(iconTop / h, 0, 1), clamp((iconTop + glyph) / h, 0, 1)],
    };
}

/** The layout as the CSS reads it */
function layoutVars(L: WallLayout): Record<string, string> {
    const px = (n: number) => `${n}px`;
    return {
        '--fw-pad': px(L.pad), '--fw-t0': px(L.t0), '--fw-clock': px(L.clock), '--fw-body': px(L.body), '--fw-sentence': px(L.sentence),
        '--fw-label': px(L.label), '--fw-figure': px(L.figure), '--fw-day': px(L.day), '--fw-day-row': px(L.dayRow), '--fw-bar': px(L.bar),
        '--fw-line': px(L.line), '--fw-fade': px(L.fade), '--fw-week-gap': px(L.weekGap), '--fw-label-lh': px(L.labelLH), '--fw-inset': px(L.inset), '--fw-shift': px(L.shift),
        '--fw-hours-w': px(L.hoursW), '--fw-week-w': px(L.weekW), '--fw-gutter': px(L.gutter), '--fw-cols-h': px(L.colsH),
        '--fw-glyph-gap': px(L.glyphGap), '--fw-plot-gap': px(L.plotGap), '--fw-value-h': px(L.valueH), '--fw-stroke': px(L.stroke),
        '--fw-day-glyph': px(L.dayGlyph),
    };
}

export function attachWall(host: ForecastHost): ForecastExtras {
    const el = host.element;
    const root = el.querySelector('.animated-weather-card') as HTMLElement;
    const info = root.querySelector('.weather-info') as HTMLElement;
    root.dataset.fw = '';
    const fw = document.createElement('div');
    fw.className = 'fw';
    info.append(fw);
    let model: Model | null = null, hourly: Hourly | null = null, daily: Daily | null = null, slide: Slide | null = null;
    let clock: TimeText | null = null;
    let key = '', pending = false, size = '';

    /** The turning line whole on its line, never cut: long, else short, else short a step or two smaller */
    function setTurn(turn: HTMLElement, line: TurningLine | null) {
        const forms: Array<[string, number]> = line ? [[line.html, 1], [line.shortHtml, 1], [line.shortHtml, 0.86], [line.shortHtml, 0.74]] : [['', 1]];
        for (const [html, k] of forms) {
            turn.innerHTML = html;
            turn.style.setProperty('--fw-turn-k', String(k));
            if (!turn.clientWidth || turn.scrollWidth <= turn.clientWidth + 0.5) break;
        }
    }
    /** The days' names as wide as this language's widest ("Niedz." in Polish), never cut */
    function fitNames() {
        const names = [...fw.querySelectorAll<HTMLElement>('.fw-week .fc-d-name')];
        const w = Math.max(0, ...names.map(n => n.scrollWidth));
        if (w) fw.style.setProperty('--fw-day-name', `${Math.ceil(w) + 1}px`);
    }
    /** Today's line: feels like steps out before the line would run past its room */
    function fitToday() {
        const today = fw.querySelector('.fw-today') as HTMLElement | null;
        if (!today) return;
        delete today.dataset.tight;
        if (today.scrollWidth > today.clientWidth + 0.5) today.dataset.tight = '';
    }

    function build() {
        teardown();
        const hass = host.hass();
        const W = fcWords(hass);
        model = buildModel(host, host.current());
        const m = model;
        const s = hass?.states[host.config().entity ?? ''];
        const t = host.current();
        const feels = Number(s?.attributes?.apparent_temperature);
        const widest = Math.max(2, ...m.hours.slice(0, 16).map(x => (x.temp === null ? 0 : String(Math.round(x.temp)).length)));
        const L = wallLayout(root.clientWidth || 816, root.clientHeight || 632, widest, !!timeParts(new Date(), hass).period);
        size = `${L.w}x${L.h}`;
        for (const [k, v] of Object.entries(layoutVars(L))) fw.style.setProperty(k, v);
        fw.toggleAttribute('data-stack', L.stack);
        let date = '';
        try { date = dateText(new Date(), hass, { weekday: 'short', day: 'numeric', month: 'short' }); } catch { /* none */ }
        // hero: clock swaps the two: the time in the temperature's place and size, the date in the clock's,
        // and the temperature leading the condition's line ("16° Partly cloudy")
        const big = host.config().hero === 'clock';
        fw.toggleAttribute('data-hero', big);
        const temp = `<span class="fw-tv">${t !== undefined ? esc(host.temperature(t)) : ''}</span><span class="fw-deg">°</span>`;
        fw.innerHTML = `<div class="fw-hero">`
            + `<div class="fw-when">${big ? '' : '<span class="fw-clock"></span>'}<span class="fw-date">${esc(date)}</span><span class="fw-away"><button type="button" class="awc-now awc-noclaim" aria-label="${esc(W.back)}"><i aria-hidden="true"></i>${esc(W.now)}</button><span class="fw-at"></span></span></div>`
            + (big ? `<div class="fw-temp awc-hero-clock"><span class="fw-big"></span></div>` : `<div class="fw-temp" aria-live="polite">${temp}</div>`)
            + `<div class="fw-today">${big ? `<span class="fw-lead" aria-live="polite">${temp}</span>` : ''}<span class="fw-cond">${esc(s ? conditionNoun(s.state, hass, x => host.conditionName(x)) : '')}</span>`
            + (m.hl ? `<span class="fw-hl awc-hl-pair"><b>${esc(W.h)}</b> ${esc(host.temperature(m.hl[0]))}°</span><span class="fw-hl awc-hl-pair"><b>${esc(W.l)}</b> ${esc(host.temperature(m.hl[1]))}°</span>` : '')
            + (isFinite(feels) ? `<span class="fw-feels">${esc(W.feels_like)} ${esc(host.temperature(feels))}°</span>` : '')
            + `<span class="fw-chance"></span></div></div>`
            + `<div class="fw-next"><p class="fw-turn"></p><div class="fw-hours"></div><div class="fw-week"></div></div>`;
        clock = new TimeText(fw.querySelector(big ? '.fw-big' : '.fw-clock') as HTMLElement);
        tick();
        // A hero clock stops where today's line does (72% of the column), short of the sun's light
        if (big) {
            const bigEl = fw.querySelector('.fw-big') as HTMLElement, box = fw.querySelector('.fw-temp') as HTMLElement, col = fw.querySelector('.fw-hero') as HTMLElement;
            fitHeroTime(bigEl, layoutLeft(col) + 0.72 * col.offsetWidth, dayPeriods(host), size => (size === null ? box.style.removeProperty('--fw-t0') : box.style.setProperty('--fw-t0', `${size}px`)));
        }
        ownControl(fw.querySelector('.awc-now') as HTMLElement, () => slide?.home());
        const turn = fw.querySelector('.fw-turn') as HTMLElement;
        setTurn(turn, m.lineAt(0));
        const hoursBox = fw.querySelector('.fw-hours') as HTMLElement;
        if (m.hours.length) {
            hourly = createHourly({
                hass, W, lang: m.lang, hours: m.hours, current: host.current(), metric: 'temp', has: m.has, noun: m.noun,
                pitch: L.col / 2, plot: L.plot, valueHeight: L.valueH, valueLift: L.lift, glyphSize: L.glyph, every: 2,
                above: true, flat: true, startDot: true, dotR: Math.round(L.stroke * 1.7 * 2) / 2,
                graph: graphOf(host.config().forecast_graph),
                tints: iconTints(host, m, { y0: L.iconY[0], y1: L.iconY[1], glow: SKY_GLOW_WIDE, reach: 12 }), unit: m.unit, fahrenheit: m.fahrenheit,
                conditionName: c => conditionNoun(c, hass, x => host.conditionName(x)),
            });
            hoursBox.append(hourly.el);
        }
        const f = host.forecast();
        const wk = week(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : 'daily', Date.now(), hass, { count: L.days, current: host.current() });
        daily = createDaily({ hass, W, week: wk, current: host.current(), glyphSize: L.dayGlyph, theme: host.config().color_palette === 'theme', fahrenheit: m.fahrenheit, tints: host.config().color_palette === 'theme' ? null : litTints(45, false, 0.17), ring: Math.round(L.bar * 0.9), conditionName: c => conditionNoun(c, hass, x => host.conditionName(x)) });
        (fw.querySelector('.fw-week') as HTMLElement).append(daily.el);
        fitNames();
        daily.draw();
        fitToday();
        if (hourly && m.tl) {
            const tv = fw.querySelector('.fw-tv') as HTMLElement, cond = fw.querySelector('.fw-cond') as HTMLElement;
            const at = fw.querySelector('.fw-at') as HTMLElement, chance = fw.querySelector('.fw-chance') as HTMLElement;
            const home = { tv: tv.innerHTML, cond: cond.innerHTML };
            slide = attachSlide({
                host, root, tl: m.tl, ruler: hourly, sliderHost: hourly.el, sliderLabel: W.hours, settleEvery: 2,
                valueText: sl => valueText(m, host, sl),
                onSlot: (sl: Slot | null, k: number) => {
                    if (!sl) { tv.innerHTML = home.tv; cond.innerHTML = home.cond; setTurn(turn, m.lineAt(0)); chance.innerHTML = ''; delete fw.dataset.away; if (big) showTime(new Date(), false); host.refresh(); return; }
                    fw.dataset.away = '';
                    // A hero clock goes to the hour, so the away line names only another day
                    if (big) showTime(sl.at, false);
                    if (typeof sl.temperature === 'number') tv.textContent = host.temperature(sl.temperature);
                    cond.textContent = conditionNoun(sl.condition ?? '', hass, x => host.conditionName(x));
                    setTurn(turn, m.lineAt(k));
                    const sameDay = sl.at.toDateString() === new Date().toDateString();
                    at.innerHTML = `${sameDay ? '' : `${esc(dayName(sl.at, hass))} `}${big ? '' : timeHtml(sl.at, hass)} <span class="fw-rel">${esc(relative(sl.at.getTime() - Date.now(), hass))}</span>`;
                    const p = sl.precipitation_probability;
                    chance.innerHTML = typeof p === 'number' && p >= 20 ? `<span class="awc-hl-pair"><b>${esc(W[m.noun])}</b> ${Math.round(p)}%</span>` : '';
                },
                onAway: a => hourly?.el.classList.toggle('fc-away', a),
                // The days follow the needle: its day stands out, the dot rides its bar at the hour's temperature
                onNeedle: (t, temp) => daily?.follow(t === null ? null : { at: t, temperature: temp }),
                onHome: () => { if (pending) { pending = false; setTimeout(() => { key = keyOf(); build(); }, 0); } },
                group: () => [fw.querySelector('.fw-temp'), cond.parentElement, turn, fw.querySelector('.fw-when')].filter((e): e is HTMLElement => !!e),
            });
        }
    }
    /** The time at a moment: now, or on a hero clock the hour under the needle */
    function showTime(at: Date, animate: boolean) {
        const p = timeParts(at, host.hass());
        clock?.set({ text: `${p.hour}:${p.minute}`, period: p.period }, { animate });
    }
    function tick() {
        // A hero clock away at another hour stays there; it comes back to now with the card
        if (fw.hasAttribute('data-hero') && fw.dataset.away !== undefined) return;
        showTime(new Date(), !host.still());
    }
    function teardown() {
        slide?.destroy(); slide = null;
        hourly?.destroy(); hourly = null;
        daily?.destroy(); daily = null;
        clock?.finish(); clock = null;
        fw.replaceChildren();
    }
    function keyOf(): string {
        const f = host.forecast();
        return `${f.settled}|${f.hourly?.[0]?.datetime}|${f.hourly?.map(e => `${e.temperature}${e.condition}`).join()}|${f.daily?.map(e => `${e.temperature}${e.templow}`).join()}|${host.current()}|${root.clientWidth}x${root.clientHeight}`;
    }
    let hour = Math.floor(Date.now() / HOUR);
    const ticker = minuteTicker(() => {
        tick();
        const h = Math.floor(Date.now() / HOUR);
        if (h === hour) return;
        hour = h;
        if (slide?.active()) { pending = true; slide.home(); return; }
        if (hourly && host.seen() && !host.still()) hourly.step(() => { key = keyOf(); build(); });
        else { key = keyOf(); build(); }
    });
    let resized = 0;
    return {
        levels: () => ['wall'],
        setLevel() {},
        levelOk: () => true,
        fitted() {
            // A new frame is a new composition: built again for its size, once it's home
            if (size && size !== `${root.clientWidth}x${root.clientHeight}`) {
                if (slide?.active()) pending = true;
                else {
                    cancelAnimationFrame(resized);
                    resized = requestAnimationFrame(() => { key = keyOf(); build(); host.fit(); });
                    return;
                }
            }
            hourly?.remeasure();
            fitNames();
            daily?.draw();
            fitToday();
            const turn = fw.querySelector('.fw-turn') as HTMLElement | null;
            if (turn && model && !slide?.active()) setTurn(turn, model.lineAt(0));
            // Clouds roam the open sky over the temperature and stop above the band
            const next = fw.querySelector('.fw-next') as HTMLElement | null;
            cloudFloor(root, next ? next.getBoundingClientRect().top - root.getBoundingClientRect().top - 8 : null);
        },
        update() {
            const k = keyOf();
            if (k === key) return;
            if (slide?.active()) { pending = true; slide.home(); return; }
            key = k;
            build();
        },
        seen(visible) { if (!visible && slide?.active()) slide.home(true); if (visible) { tick(); ticker.rearm(); } },
        away: () => !!slide?.active(),
        conditionText: () => null,
        open() { if (model) openView(host, { model, metric: 'temp', slots: slide?.slots() ?? 0, chipsLevel: 0, small: root }); },
        destroy() { ticker.stop(); cancelAnimationFrame(resized); teardown(); fw.remove(); delete root.dataset.fw; cloudFloor(root, null); dropView(el); },
    };
    void fill;
}
