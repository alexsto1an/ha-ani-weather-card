// The forecast card (custom:animated-forecast-card): on the weather entity's
// own sky, the turning line as its lead, the hourly row (an hour to a
// column, an icon every hour, the value on the line), four chips, and the
// days with their range bars on the week's shared scale and a dot for now.
// Regular, wide (from 640 px, the hours and the week side by side) and the
// strip (compact: true), which sits under the compact weather card.
//
// The row browses and stays where it's left, and the card's sky goes to the
// hour under the needle: leave it at 17:00 and real rain falls behind the
// numbers. It comes home on the Now control, Home or Escape on the slider,
// half a minute without a touch, the page hidden, the card scrolled away,
// and a new forecast: one spring, the same as the weather card's.

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { HOUR, Slot, esc } from './fc-core';
import { conditionNoun, dayName, timeHtml, week } from './fc-data';
import { fcWords } from './fc-words';
import { Chips, Daily, Hourly, createChips, createDaily, createHourly } from './fc-row';
import { litTints } from './fc-glyphs';
import { Slide, attachSlide } from './fc-slide';
import { minuteTicker } from './fc-clock';
import { Model, buildModel, iconTints, valueText } from './fc-weather';
import { relativeLuminance, sampleSkyAt, type SkyCondition } from './sky';
import { classOf } from './fc-core';

/** The corner light, as the forecast card paints it (fc-css.ts): its contrast is measured against this */
export const FORECAST_GLOW = { rx: 0.30, ry: 0.34, cx: 0.94, cy: -0.12, fade: 0.70 };

export function attachForecastCard(host: ForecastHost): ForecastExtras {
    const el = host.element;
    const root = el.querySelector('.animated-weather-card') as HTMLElement;
    const info = root.querySelector('.weather-info') as HTMLElement;
    const cfg = () => host.config();
    const strip = !!cfg().compact;
    root.dataset.fcCard = '';
    const card = document.createElement('div');
    card.className = 'fc-fcard';
    info.append(card);
    let model: Model | null = null, hourly: Hourly | null = null, chips: Chips | null = null, daily: Daily | null = null, slide: Slide | null = null;
    let sentence: HTMLElement | null = null, lead: HTMLElement | null = null, back: HTMLElement | null = null;
    let metric = cfg().forecast_metric ?? 'temp';
    let key = '', pending = false, arrived = false;
    const wide = () => !strip && root.clientWidth >= 640;

    function writeLead(k: number, slot: Slot | null) {
        if (!sentence || !lead || !model) return;
        const line = model.lineAt(k);
        const hass = host.hass();
        const when = slot ? (model.tl?.unit === 'hour'
            ? (new Date(slot.at).toDateString() === new Date().toDateString() ? timeHtml(slot.at, hass) : `${esc(dayName(slot.at, hass))} ${timeHtml(slot.at, hass)}`)
            : esc(dayName(slot.at, hass, 'long'))) : '';
        const prefix = when ? `<span class="fc-at">${when}</span>` : '';
        // Full strength holds to 0.75 of the width under the corner light, and the Now control takes its own room
        const room = Math.min(lead.clientWidth - (slot && back ? back.offsetWidth + 12 : 0), root.clientWidth * 0.75 - lead.getBoundingClientRect().left + root.getBoundingClientRect().left);
        // Whole or not at all: the full line, else its short form
        const fits = (html: string) => { sentence!.innerHTML = html; return sentence!.scrollWidth <= room + 0.5; };
        if (!line) { sentence.innerHTML = prefix; return; }
        if (!fits(prefix + line.html)) fits(prefix + line.shortHtml);
    }

    function build() {
        teardown();
        const W = fcWords(host.hass());
        model = buildModel(host, host.current());
        const m = model;
        card.dataset.variant = strip ? 'strip' : wide() ? 'wide' : 'regular';
        if (!m.tl && host.forecast().settled) {
            card.innerHTML = `<p class="fc-empty">${esc(W.no_forecast)}</p>`;
            return;
        }
        if (!m.tl) return;
        const left = wide() ? Object.assign(document.createElement('div'), { className: 'fc-left' }) : card;
        if (wide()) card.append(left);
        if (!strip) {
            lead = document.createElement('div');
            lead.className = 'fc-lead';
            lead.innerHTML = `<span class="fc-sentence" aria-live="polite"></span><button type="button" class="awc-now fc-now awc-noclaim" tabindex="-1" aria-label="${esc(W.back)}"><i aria-hidden="true"></i>${esc(W.now)}</button>`;
            left.append(lead);
            sentence = lead.querySelector('.fc-sentence');
            back = lead.querySelector('.fc-now');
            back!.addEventListener('click', e => { e.stopPropagation(); slide?.home(); });
            for (const ev of ['pointerdown', 'pointerup']) back!.addEventListener(ev, e => e.stopPropagation());
        }
        const showHours = cfg().show_hours !== false || strip;
        if (showHours && m.hours.length) {
            const pad = parseFloat(getComputedStyle(card).paddingLeft) || 20;
            const rw = wide() ? Math.max(200, root.clientWidth * 0.5) : (root.clientWidth || 353) - 2 * pad;
            const cols = wide() ? 8 : 6;
            // The strip's first and last labels sit on the compact weather card's text edges
            const pitch = strip ? (rw - 20) / (cols - 1) : rw / cols;
            const tints = iconTints(host, m, { y0: strip ? 0.2 : 0.16, y1: strip ? 0.6 : 0.36, glow: FORECAST_GLOW, reach: cols });
            metric = m.metrics.includes(metric) ? metric : (m.metrics[0] ?? 'temp');
            hourly = createHourly({
                hass: host.hass(), W, lang: m.lang, hours: m.hours, current: host.current(), metric, has: m.has, noun: m.noun,
                pitch, plot: strip ? 42 : wide() ? 60 : 44, glyphSize: 22, tints, unit: m.unit, fahrenheit: m.fahrenheit,
                conditionName: c => conditionNoun(c, host.hass(), s => host.conditionName(s)),
            });
            if (strip) hourly.el.style.marginLeft = `${13 - pitch / 2}px`;
            left.append(hourly.el);
            if (!strip) {
                chips = createChips({ W, metrics: m.metrics, value: metric, noun: m.noun, onChange: (k, { keys }) => { metric = k; hourly?.setMetric(k, { animate: !keys }); } });
                left.append(chips.el);
            }
        }
        const days = Math.max(0, Math.min(10, cfg().forecast_days ?? 7));
        if (!strip && days) {
            const f = host.forecast();
            const wk = week(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : 'daily', Date.now(), host.hass(), { count: days, current: host.current() });
            const theme = cfg().color_palette === 'theme';
            let lum = 0;
            const st = host.hass()?.states[cfg().entity ?? '']?.state ?? 'sunny';
            for (const x of [0.12, 0.5, 0.88]) for (const y of [0.45, 0.7, 0.95]) lum = Math.max(lum, relativeLuminance(sampleSkyAt(classOf(st) as SkyCondition, host.phase(), x, y, FORECAST_GLOW)));
            daily = createDaily({ hass: host.hass(), W, week: wk, current: host.current(), theme, fahrenheit: m.fahrenheit, tints: theme ? null : litTints(45, false, lum), conditionName: c => conditionNoun(c, host.hass(), s => host.conditionName(s)) });
            card.append(daily.el);
            daily.draw();
            if (!arrived && host.seen() && !host.still()) daily.arrive();
            arrived = true;
        }
        writeLead(0, null);
        attach();
    }
    function attach() {
        if (!model?.tl || !hourly || hourly.empty) return;
        const m = model;
        slide = attachSlide({
            host, root, tl: m.tl!, ruler: hourly, sliderHost: hourly.el, sliderLabel: m.W.hours,
            valueText: s => valueText(m, host, s),
            onSlot: (s, k) => writeLead(s ? k : 0, s),
            onAway: a => { card.classList.toggle('fc-away', a); hourly?.el.classList.toggle('fc-away', a); if (back) back.tabIndex = a ? 0 : -1; },
            onHome: () => { if (pending) { pending = false; setTimeout(rebuild, 0); } },
            group: () => (sentence ? [sentence] : []),
            mirror: () => (chips?.sel ? [chips.sel] : []),
        });
    }
    function teardown() {
        slide?.destroy(); slide = null;
        hourly?.destroy(); hourly = null;
        chips?.destroy(); chips = null;
        daily?.destroy(); daily = null;
        card.replaceChildren();
        sentence = lead = back = null;
        model = null;
    }
    function rebuild() { build(); fitted(); }
    /** The days give way, whole, from the end, when the frame is shorter than the card asks for */
    function fitted() {
        const rows = [...card.querySelectorAll<HTMLElement>('.fc-day')];
        rows.forEach(r => { r.hidden = false; });
        for (let i = rows.length - 1; i >= 2 && card.scrollHeight > card.clientHeight + 1; i--) rows[i].hidden = true;
        chips?.fit();
        hourly?.remeasure();
    }
    function keyOf(): string {
        const f = host.forecast();
        return `${f.settled}|${f.hourly?.length}|${f.hourly?.[0]?.datetime}|${f.hourly?.map(e => `${e.temperature}${e.condition}${e.precipitation_probability}`).join()}|${f.daily?.map(e => `${e.temperature}${e.templow}${e.condition}`).join()}|${host.current()}|${wide()}`;
    }
    // The hour passing: the row steps one column, the new hour becomes "Now"
    let hour = Math.floor(Date.now() / HOUR);
    const ticker = minuteTicker(() => {
        const h = Math.floor(Date.now() / HOUR);
        if (h === hour) return;
        hour = h;
        if (slide?.active()) { pending = true; slide.home(); return; }
        if (hourly && host.seen() && !host.still()) hourly.step(() => { key = keyOf(); rebuild(); });
        else { key = keyOf(); rebuild(); }
    });
    let roRaf = 0, lastWide = wide();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
        cancelAnimationFrame(roRaf);
        roRaf = requestAnimationFrame(() => { if (wide() !== lastWide && !slide?.active()) { lastWide = wide(); key = keyOf(); rebuild(); } else fitted(); });
    }) : null;
    ro?.observe(root);

    return {
        levels: () => [],
        setLevel() {},
        levelOk: () => true,
        fitted,
        update() {
            const k = keyOf();
            if (k === key) return;
            if (slide?.active()) { pending = true; slide.home(); return; }
            key = k;
            rebuild();
        },
        seen(visible) { if (!visible && slide?.active()) slide.home(true); },
        away: () => !!slide?.active(),
        conditionText: () => null,
        open() { host.moreInfo(); },
        destroy() { ticker.stop(); ro?.disconnect(); cancelAnimationFrame(roRaf); teardown(); card.remove(); delete root.dataset.fcCard; },
    };
}
