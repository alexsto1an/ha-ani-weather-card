// The wall: the weather card with the forecast on, at least 640 × 540 (a
// wall tablet's two sections columns, ten rows). Every size is a reading
// distance, not a scaled phone: the temperature at 192 px for the room;
// the clock as a quiet line on the temperature's baseline with the date
// (an eleventh of the temperature's ink, never its twin); the condition
// with today's high, low and feels-like at the hand's size; open sky; the
// turning line at 48 px for the doorway; and under it the hours, six
// two-hour columns with 40 px figures above one whole 4 px line that starts
// at a dot on the needle, beside five days of range bars. No chips: no hand
// reaches. The row is the slide's ruler, and the card stays where it's left.

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { HOUR, Slot, esc, ownControl } from './fc-core';
import { conditionNoun, dayName, relative, timeHtml, timeParts, week } from './fc-data';
import { fcWords, fill } from './fc-words';
import { Daily, Hourly, createDaily, createHourly } from './fc-row';
import { litTints } from './fc-glyphs';
import { Slide, attachSlide } from './fc-slide';
import { TimeText, minuteTicker } from './fc-clock';
import { Model, buildModel, iconTints, valueText } from './fc-weather';
import { SKY_GLOW_WIDE } from './sky';
import { dropView, openView } from './fc-view';

export const isWall = (root: HTMLElement): boolean => root.clientWidth >= 640 && root.clientHeight >= 540;

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
    let key = '', pending = false;

    function build() {
        teardown();
        const hass = host.hass();
        const W = fcWords(hass);
        model = buildModel(host, host.current());
        const m = model;
        const s = hass?.states[host.config().entity ?? ''];
        const t = host.current();
        const feels = Number(s?.attributes?.apparent_temperature);
        let date = '';
        try { date = new Intl.DateTimeFormat(hass?.locale?.language || 'en', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date()); } catch { /* none */ }
        fw.innerHTML = `<div class="fw-temp" aria-live="polite"><span class="fw-tv">${t !== undefined ? esc(host.temperature(t)) : ''}</span><span class="fw-deg">°</span></div>`
            + `<div class="fw-when"><span class="fw-clock"></span><span class="fw-away"><button type="button" class="awc-now awc-noclaim" aria-label="${esc(W.back)}"><i aria-hidden="true"></i>${esc(W.now)}</button><span class="fw-at"></span></span><span class="fw-date">${esc(date)}</span></div>`
            + `<div class="fw-today"><span class="fw-cond">${esc(s ? conditionNoun(s.state, hass, x => host.conditionName(x)) : '')}</span>`
            + (m.hl ? `<span class="fw-hl awc-hl-pair"><b>${esc(W.h)}</b> ${esc(host.temperature(m.hl[0]))}°</span><span class="fw-hl awc-hl-pair"><b>${esc(W.l)}</b> ${esc(host.temperature(m.hl[1]))}°</span>` : '')
            + (isFinite(feels) ? `<span class="fw-feels">${esc(W.feels_like)} ${esc(host.temperature(feels))}°</span>` : '')
            + `<span class="fw-chance"></span></div>`
            + `<div class="fw-next"><p class="fw-turn">${m.lineAt(0)?.html ?? ''}</p><div class="fw-band"><div class="fw-hours"></div><div class="fw-week"></div></div></div>`;
        clock = new TimeText(fw.querySelector('.fw-clock') as HTMLElement);
        tick();
        ownControl(fw.querySelector('.awc-now') as HTMLElement, () => slide?.home());
        const hoursBox = fw.querySelector('.fw-hours') as HTMLElement;
        if (m.hours.length) {
            const w = hoursBox.clientWidth || 429;
            hourly = createHourly({
                hass, W, lang: m.lang, hours: m.hours, current: host.current(), metric: 'temp', has: m.has, noun: m.noun,
                pitch: w / 12, plot: 84, valueHeight: 44, valueLift: 4, glyphSize: 30, every: 2, above: true, startDot: true,
                tints: iconTints(host, m, { y0: 0.72, y1: 0.95, glow: SKY_GLOW_WIDE, reach: 12 }), unit: m.unit, fahrenheit: m.fahrenheit,
                conditionName: c => conditionNoun(c, hass, x => host.conditionName(x)),
            });
            hoursBox.append(hourly.el);
        }
        const f = host.forecast();
        const wk = week(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : 'daily', Date.now(), hass, { count: 5, current: host.current() });
        daily = createDaily({ hass, W, week: wk, current: host.current(), glyphSize: 24, theme: host.config().color_palette === 'theme', fahrenheit: m.fahrenheit, tints: host.config().color_palette === 'theme' ? null : litTints(45, false, 0.17), ring: 7, conditionName: c => conditionNoun(c, hass, x => host.conditionName(x)) });
        (fw.querySelector('.fw-week') as HTMLElement).append(daily.el);
        daily.draw();
        if (hourly && m.tl) {
            const turn = fw.querySelector('.fw-turn') as HTMLElement;
            const tv = fw.querySelector('.fw-tv') as HTMLElement, cond = fw.querySelector('.fw-cond') as HTMLElement;
            const at = fw.querySelector('.fw-at') as HTMLElement, chance = fw.querySelector('.fw-chance') as HTMLElement;
            const home = { tv: tv.innerHTML, cond: cond.innerHTML, turn: turn.innerHTML };
            slide = attachSlide({
                host, root, tl: m.tl, ruler: hourly, sliderHost: hourly.el, sliderLabel: W.hours,
                valueText: sl => valueText(m, host, sl),
                onSlot: (sl: Slot | null, k: number) => {
                    if (!sl) { tv.innerHTML = home.tv; cond.innerHTML = home.cond; turn.innerHTML = home.turn; chance.innerHTML = ''; delete fw.dataset.away; host.refresh(); return; }
                    fw.dataset.away = '';
                    if (typeof sl.temperature === 'number') tv.textContent = host.temperature(sl.temperature);
                    cond.textContent = conditionNoun(sl.condition ?? '', hass, x => host.conditionName(x));
                    turn.innerHTML = m.lineAt(k)?.html ?? '';
                    const sameDay = sl.at.toDateString() === new Date().toDateString();
                    at.innerHTML = `${sameDay ? '' : `${esc(dayName(sl.at, hass))} `}${timeHtml(sl.at, hass)} <span class="fw-rel">${esc(relative(sl.at.getTime() - Date.now(), hass))}</span>`;
                    const p = sl.precipitation_probability;
                    chance.innerHTML = typeof p === 'number' && p >= 20 ? `<span class="awc-hl-pair"><b>${esc(W[m.noun])}</b> ${Math.round(p)}%</span>` : '';
                },
                onAway: a => hourly?.el.classList.toggle('fc-away', a),
                onHome: () => { if (pending) { pending = false; setTimeout(() => { key = keyOf(); build(); }, 0); } },
                group: () => [tv.parentElement, cond.parentElement, turn, fw.querySelector('.fw-when')].filter((e): e is HTMLElement => !!e),
            });
        }
    }
    function tick() {
        const p = timeParts(new Date(), host.hass());
        clock?.set({ text: `${p.hour}:${p.minute}`, period: p.period }, { animate: !host.still() });
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
        return `${f.settled}|${f.hourly?.[0]?.datetime}|${f.hourly?.map(e => `${e.temperature}${e.condition}`).join()}|${f.daily?.map(e => `${e.temperature}${e.templow}`).join()}|${host.current()}|${root.clientWidth}`;
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
    return {
        levels: () => ['wall'],
        setLevel() {},
        levelOk: () => true,
        fitted() { hourly?.remeasure(); daily?.draw(); },
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
        destroy() { ticker.stop(); teardown(); fw.remove(); delete root.dataset.fw; dropView(el); },
    };
    void fill;
}
