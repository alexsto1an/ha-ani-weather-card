// The nightstand (layout: nightstand): the time is the hero, and the
// weather says only what this hour needs. At night the card turns its real
// sky down under a veil and the words keep only the light a 3 a.m. look
// needs: two warm inks with no alpha, the time "3:12" with no leading zero,
// the alarm, and one line ("19° Dry tonight", or what's wrong before you're
// up). Nothing changes under the veil but the minute. By day: the date, the
// temperature, the condition, the turning line and today's range with its
// dot. Night comes and goes over 8 s on the sky's curve.
//
// At night it's red on black (night_red, on by default), as a bedside
// clock's night mode; off, the sky stays under a veil in two warm inks.
// Night is auto by default: an illuminance sensor beside it (night_sensor)
// says when the room is dark (under night_lux, 5 by default, for a minute,
// light again over three times it for 10 s); without one, it's night from
// bed time to the alarm.

import type { ForecastExtras, ForecastHost } from './forecast-host';
import { HOUR, Lab, Timeline, clamp, cssOf, esc, isWet, labOf, wetKind, whole } from './fc-core';
import { conditionNoun, dateText, dayName, timeParts, timeText, turningLine, week } from './fc-data';
import { FcWords, fcWords, fill } from './fc-words';
import { MINUTE, TimeText, minuteTicker } from './fc-clock';
import { scaleGradient } from './fc-row';
import type { HomeAssistant } from './types';

/** The light at night: luminance 0.163 behind the time, 0.234 behind the words; 3.46:1 and 4.5:1 at least over the veiled sky */
export const EMBER = { time: '#8b6a4d', words: '#a17e61' };
/** Over the theme's card under a 0.96 veil: 3.9:1 and 4.7:1 */
export const THEME_NIGHT = { time: '#6e6e6e', words: '#7d7d7d' };
/**
 * night_red (on unless false): at night, red on black, as a bedside clock's night mode. A deep red, its green and
 * blue a small share of it as a red LED's are, which keeps a dark room's night vision; on black, 3.5:1 for the
 * time and 4.8:1 for the words, a little dimmer than the ember (4.3:1 and 5.7:1 there).
 */
export const NIGHT_RED = { time: '#c21f17', words: '#eb261c' };
export const LIGHT = { ms: 8000, ease: 'cubic-bezier(0.37, 0, 0.63, 1)' };
const ZONE = { day: MINUTE.day, night: { out: 240, outEase: 'cubic-bezier(0.5, 0, 0.75, 0)', in: 480, inEase: 'cubic-bezier(0.33, 1, 0.68, 1)', at: 240 } };
const SEVERE = new Set(['lightning', 'lightning-rainy', 'hail', 'pouring', 'snowy', 'snowy-rainy', 'exceptional']);

const minsOf = (d: Date) => d.getHours() * 60 + d.getMinutes();
const parseHm = (v: string | undefined, fallback: number) => {
    const m = /^(\d{1,2}):(\d{2})/.exec(v ?? '');
    return m ? (Number(m[1]) % 24) * 60 + Number(m[2]) % 60 : fallback;
};
function nextAt(now: Date, m: number): Date { const d = new Date(now); d.setHours(Math.floor(m / 60), m % 60, 0, 0); if (d <= now) d.setDate(d.getDate() + 1); return d; }
const inRange = (n: number, a: number, b: number) => { a = (a + 1440) % 1440; b = (b + 1440) % 1440; return a <= b ? n >= a && n < b : n >= a || n < b; };

/** The next alarm: the entity's timestamp (or input_datetime) when it's within 18 hours */
export function nextAlarm(hass: HomeAssistant | undefined, entityId: string | undefined, now: Date): Date | null {
    const s = entityId ? hass?.states[entityId] : undefined;
    if (!s) return null;
    let t = Date.parse(s.state);
    if (isNaN(t) && s.attributes?.timestamp) t = Number(s.attributes.timestamp) * 1000;
    if (isNaN(t) && typeof s.attributes?.hour === 'number') t = nextAt(now, s.attributes.hour * 60 + (s.attributes.minute ?? 0)).getTime();
    if (isNaN(t) || t < now.getTime() || t - now.getTime() > 18 * HOUR) return null;
    return new Date(t);
}

/** Something to know before morning, with numbers: severe weather, rain at 60%, gusts of 60 km/h or more, frost at the alarm */
const KMH: Record<string, number> = { 'km/h': 1, 'mph': 1.609344, 'm/s': 3.6, 'kn': 1.852, 'ft/s': 1.09728 };
const kmh = (v: number, unit: string): number => v * (KMH[unit] ?? 1);

export function alertBefore(tl: Timeline | null, now: Date, wakeAt: Date, hass: HomeAssistant | undefined, W: FcWords, entity?: { attributes?: Record<string, unknown> }): string | null {
    if (!tl || tl.unit !== 'hour') return null;
    const hours = tl.slots.filter(h => h.at.getTime() + HOUR > now.getTime() && h.at < new Date(wakeAt.getTime() + HOUR));
    const t = (d: Date) => timeText(d, hass, { sentence: true, bare: true });
    const bad = (h: typeof hours[number]) => SEVERE.has(h.condition ?? '') || (h.precipitation_probability != null ? h.precipitation_probability >= 60 && isWet(h) : isWet(h) && (h.precipitation ?? 0) >= 0.5);
    const i = hours.findIndex(bad);
    if (i >= 0) {
        const all = tl.slots.filter(h => h.at >= hours[i].at);
        let j = 0; while (j + 1 < all.length && bad(all[j + 1])) j++;
        const k = W[wetKind(hours[i]) ?? 'rain'];
        const end = all[j + 1]?.at ?? null;
        if (hours[i].at <= now) return end ? fill(W.until, { k, b: t(end) }) : k;
        return end ? fill(W.from_to, { k, a: t(hours[i].at), b: t(end) }) : fill(W.from, { k, a: t(hours[i].at) });
    }
    // In the entity's own units: gusts of 60 km/h (37 mph, 17 m/s, 32 kn), frost at 0 °C (32 °F)
    const a = entity?.attributes ?? {};
    const windUnit = String(a.wind_speed_unit ?? 'km/h');
    const gust = hours.find(h => kmh(h.wind_gust_speed ?? 0, windUnit) >= 60);
    if (gust) return fill(W.gusts_to, { v: `${Math.round(gust.wind_gust_speed!)} ${windUnit}`, t: t(gust.at) });
    const freezing = /F/.test(String(a.temperature_unit ?? '')) ? 32 : 0;
    const wake = hours.find(h => h.at >= new Date(wakeAt.getTime() - 30 * 60000));
    if (wake && typeof wake.temperature === 'number' && wake.temperature <= freezing) return fill(W.freezing, { v: `${whole(wake.temperature)}°`, t: t(wakeAt) });
    return null;
}

/** Today's row of the daily list, alone: the low, the day's range as one fill with the dot at now, the high */
function rangeHtml(host: ForecastHost, W: FcWords, current: number | undefined): string {
    const f = host.forecast();
    const wk = week(f.daily, f.dailyType === 'twice_daily' ? 'twice_daily' : 'daily', Date.now(), host.hass(), { count: 1, current });
    const d = wk.days[0];
    if (!d || d.low === undefined || d.high === undefined || d.high <= d.low) return '';
    const fahrenheit = /F/.test(String(host.hass()?.states[host.config().entity ?? '']?.attributes?.temperature_unit ?? ''));
    const x = clamp(((current ?? d.low) - d.low) / (d.high - d.low)) * 100;
    // No crumbs: under 6 px of fill past the dot's ring is cut at the dot (the bar is 116 px, the ring 7)
    const px = x * 1.16;
    const cut = 116 - px - 7 > 0 && 116 - px - 7 < 6 ? `clip-path:inset(0 ${(116 - px).toFixed(1)}px 0 0);` : px - 7 > 0 && px - 7 < 6 ? `clip-path:inset(0 0 0 ${px.toFixed(1)}px);` : '';
    return `<span class="qn-range" role="text" aria-label="${esc(fill(W.high_low, { h: `${whole(d.high)}°`, l: `${whole(d.low)}°` }))}"><span aria-hidden="true">${whole(d.low)}°</span>`
        + `<span class="qn-bar" aria-hidden="true" style="--now:${x.toFixed(1)}%"><i class="qn-fill" style="${cut}background-image:${scaleGradient(d.low, d.high, fahrenheit)}"></i>${current !== undefined ? '<i class="qn-now"></i>' : ''}</span>`
        + `<span aria-hidden="true">${whole(d.high)}°</span></span>`;
}

interface Line { k: string; html: string; cls?: string }
/** A zone of lines that changes by fading through only what changed; old and new never share a frame */
function fadeZone(holder: HTMLElement, html: string, kind: string, token: { out: number; outEase: string; in: number; inEase: string; at?: number }, animate: boolean, place?: (z: HTMLElement) => void) {
    const old = holder.querySelector(':scope > .qn-zone:not(.qn-old)') as HTMLElement | null;
    if (old && old.dataset.html === html && old.dataset.kind === kind) return;
    const next = document.createElement('div');
    next.className = 'qn-zone';
    next.dataset.kind = kind;
    next.dataset.html = html;
    next.innerHTML = html;
    holder.querySelectorAll(':scope > .qn-old').forEach(z => z.remove());
    holder.append(next);
    place?.(next);
    if (!old || !animate || typeof next.animate !== 'function') { old?.remove(); return; }
    old.classList.add('qn-old');
    old.setAttribute('aria-hidden', 'true');
    const oldLines = [...old.children] as HTMLElement[], newLines = [...next.children] as HTMLElement[];
    const anims: Animation[] = [];
    newLines.forEach(n => {
        const o = oldLines.find(x => x.dataset.k === n.dataset.k);
        const a = o?.getBoundingClientRect(), b = n.getBoundingClientRect();
        if (o && a && o.innerHTML === n.innerHTML && o.className === n.className && Math.abs(a.top - b.top) < 0.5 && Math.abs(a.left - b.left) < 0.5) { o.style.visibility = 'hidden'; return; }
        anims.push(n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: token.in, delay: token.at ?? token.out, easing: token.inEase, fill: 'backwards' }));
    });
    oldLines.forEach(o => { if (o.style.visibility !== 'hidden') anims.push(o.animate([{ opacity: 1 }, { opacity: 0 }], { duration: token.out, easing: token.outEase, fill: 'forwards' })); });
    Promise.all(anims.map(a => a.finished)).then(() => old.remove()).catch(() => old.remove());
}
/** Colour keyframes mixed in OKLab (older engines mix sRGB between them: 13 stops keep it clean) */
function labKeyframes(a: string, b: string, steps = 12): Keyframe[] {
    const A: Lab = labOf(a), B: Lab = labOf(b);
    return Array.from({ length: steps + 1 }, (_, i) => { const t = i / steps; return { color: cssOf(A.map((v, j) => v + (B[j] - v) * t) as Lab) }; });
}
const toHex = (c: string) => { const m = c.match(/[\d.]+/g); if (!c.startsWith('rgb') || !m) return c; return '#' + m.slice(0, 3).map(v => Math.round(+v).toString(16).padStart(2, '0')).join(''); };

/** Night below this many lux (night_lux): 5 unless set to a positive number */
export const nightLux = (v: unknown): number => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 5; };

/** The weather beside the time keeps this much: the high and low with its bar (about 200 px), or the temperature at 76 px */
const RIGHT_MIN = 212;

export function attachNightstand(host: ForecastHost): ForecastExtras {
    const el = host.element;
    const root = el.querySelector('.animated-weather-card') as HTMLElement;
    const info = root.querySelector('.weather-info') as HTMLElement;
    const cfg = () => host.config();
    const theme = () => cfg().color_palette === 'theme';
    const red = () => cfg().night_red !== false;
    el.dataset.qn = '';
    const veil = document.createElement('div');
    veil.className = 'qn-veil';
    veil.setAttribute('aria-hidden', 'true');
    root.append(veil);
    const ns = document.createElement('div');
    ns.className = 'qn';
    ns.setAttribute('role', 'group');
    ns.innerHTML = `<div class="qn-left"><time class="qn-time"><span class="qn-fig" aria-hidden="true"></span><span class="awc-sr qn-spoken"></span></time><div class="qn-sub"></div></div>`
        + '<div class="qn-right"></div>';
    info.append(ns);
    const timeEl = ns.querySelector('.qn-time') as HTMLElement;
    const fig = new TimeText(ns.querySelector('.qn-fig') as HTMLElement);
    const subEl = ns.querySelector('.qn-sub') as HTMLElement;
    const rightEl = ns.querySelector('.qn-right') as HTMLElement;
    const state = { night: false, anims: [] as Animation[], drift: -1, dark: null as boolean | null, darkSince: 0, oneFigure: 0 };

    // ── Size: the time is one size all day: min(0.6 of the content height, the content width / 2.62), and small
    // enough that the weather beside it keeps RIGHT_MIN, so nothing is cut at the card's edge ──
    /** The time's widest at a size: as wide as the widest time it can show, so the weather never shifts at the minute */
    function measure(size: number) {
        ns.style.setProperty('--qn-size', `${size.toFixed(1)}px`);
        const h12 = !!timeParts(new Date(), host.hass()).period;
        const probe = document.createElement('span');
        probe.className = 'qn-time';
        probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;display:inline;margin:0';
        probe.innerHTML = [...'0123456789:'].map(c => `<i style="font-style:normal">${c}</i>`).join('') + (h12 ? '<span class="awc-ampm">PM</span>' : '');
        ns.append(probe);
        const adv: Record<string, number> = {};
        for (const i of probe.querySelectorAll('i')) adv[i.textContent ?? ''] = i.getBoundingClientRect().width;
        const ap = h12 ? (probe.querySelector('.awc-ampm') as HTMLElement).getBoundingClientRect().width + 0.12 * size : 0;
        probe.remove();
        const maxOf = (set: string) => Math.max(...[...set].map(c => adv[c] ?? 0));
        const tail = (adv[':'] ?? 0) + maxOf('012345') + maxOf('0123456789');
        const widest = h12 ? (adv['1'] ?? 0) + maxOf('0123456789') + tail + ap : maxOf('012') + maxOf('0123456789') + tail;
        return { widest, ap, oneFigure: widest - (maxOf('0123456789') + tail + ap) };
    }
    function layout() {
        const w = root.clientWidth, h = root.clientHeight;
        if (!w || !h) return;
        const narrow = w <= 600;
        const padX = narrow ? 20 : 44, padY = narrow ? 20 : 30;
        const cw = w - 2 * padX, ch = h - 2 * padY;
        const gutterOf = (size: number) => Math.max(40, 0.36 * size);
        let size = narrow ? Math.min(0.34 * ch, cw / 2.9) : Math.min(0.6 * ch, cw / 2.62);
        let m = measure(size);
        if (!narrow) {
            // The time's width grows with its size, the period's label (a fixed 22 px) aside: solve for the size that leaves the weather its room
            const fixed = m.ap ? m.ap - 0.12 * size : 0;
            const per = (m.widest - fixed) / size - 0.055;
            const room = (s: number) => cw - (per * s + fixed + gutterOf(s));
            if (room(size) < RIGHT_MIN) {
                let fit = (cw - fixed - RIGHT_MIN) / (per + 0.36);
                if (0.36 * fit < 40) fit = (cw - fixed - RIGHT_MIN - 40) / per;
                size = Math.max(24, fit);
                m = measure(size);
            }
        }
        state.oneFigure = m.oneFigure;
        const col = m.widest - 0.055 * size;
        ns.style.setProperty('--qn-period', `${m.ap.toFixed(1)}px`);
        const gutter = gutterOf(size);
        ns.style.setProperty('--qn-right-left', `${(padX + col + gutter).toFixed(1)}px`);
        ns.style.setProperty('--qn-gutter', `${gutter.toFixed(1)}px`);
        // The lines past the first two step out where they don't fit, measured at this width
        for (const z of rightEl.querySelectorAll<HTMLElement>(':scope > .qn-zone')) place(z);
    }

    function weather() {
        const s = host.hass()?.states[cfg().entity ?? ''];
        const t = host.current();
        return { temp: t !== undefined ? `${host.temperature(t)}°` : '', name: s ? conditionNoun(s.state, host.hass(), x => host.conditionName(x)) : '' };
    }
    /** What the screen says at this hour */
    function content(now: Date): { sub: Line[]; kind: 'line' | 'column'; lines: Line[]; alert: string | null } {
        const hass = host.hass();
        const W = fcWords(hass);
        const wake = parseHm(cfg().wake_time, 7 * 60);
        const alarm = nextAlarm(hass, cfg().alarm_entity, now);
        const wakeAt = alarm ?? nextAt(now, wake);
        const f = host.forecast();
        const tl = f.hourly?.length ? new Timeline(f.hourly, 'hourly', now.getTime()) : null;
        const wx = weather();
        const alarmLine: Line = { k: 'alarm', html: `${esc(W.alarm)} ${alarm ? timeText(alarm, hass, { bare: true }) : ''}`, cls: 'qn-alarm' };
        if (state.night) {
            // At 3 a.m. the one question is whether anything is coming before you're up
            const alert = alertBefore(tl, now, wakeAt, hass, W, hass?.states[cfg().entity ?? '']);
            const until = tl ? new Timeline(tl.slots.filter(h => h.at < new Date(wakeAt.getTime() + HOUR)), 'hourly', now.getTime()) : null;
            const quiet = until?.length ? turningLine(until, hass, { bare: true }) : null;
            const h = now.getHours();
            const said = !tl ? esc(wx.name) : quiet && quiet.kind ? quiet.shortHtml : h >= 5 && h < 12 ? esc(W.dry_morning) : esc(W.dry_night);
            return {
                sub: alarm ? [alarmLine] : [], kind: 'line', alert,
                lines: [alert ? { k: 'now', html: `<span class="qn-alert" role="status">${esc(alert)}</span>` } : { k: 'now', html: `<span class="qn-t">${esc(wx.temp)}</span><span class="qn-cond">${said}</span>` }],
            };
        }
        const bed = cfg().bed_time ? parseHm(cfg().bed_time, 22 * 60 + 30) : (minsOf(wakeAt) - 510 + 1440) % 1440;
        const lamp = inRange(minsOf(now), bed - 60, minsOf(wakeAt) - 30);
        const lines: Line[] = [{ k: 'temp', html: esc(wx.temp), cls: 'qn-big' }, { k: 'cond', html: esc(wx.name), cls: 'qn-condline' }];
        const tline = tl ? turningLine(tl, hass, { bare: true }) : null;
        if (tline) lines.push({ k: 'turn', html: tline.shortHtml, cls: 'qn-w500' });
        const range = rangeHtml(host, W, host.current());
        if (range) lines.push({ k: 'range', html: range, cls: 'qn-rangeline' });
        let date = '';
        try { date = dateText(now, hass, { weekday: 'long', day: 'numeric', month: 'long' }); } catch { date = dayName(now, hass, 'long'); }
        return { sub: lamp && alarm ? [alarmLine] : [{ k: 'date', html: esc(date), cls: 'qn-quiet' }], kind: 'column', lines, alert: null };
    }

    // The two zones are one band: the right zone's last baseline on the date's (or the alarm's)
    function place(zone: HTMLElement) {
        if (root.clientWidth <= 600) { zone.style.bottom = ''; return; }
        const lines = [...zone.children] as HTMLElement[];
        for (const l of lines.slice(2)) { l.style.display = ''; if (l.scrollWidth > zone.clientWidth + 0.5) l.style.display = 'none'; }
    }
    function render(animate = false, zone?: typeof ZONE.day) {
        const now = new Date();
        const hass = host.hass();
        const p = timeParts(now, hass, { bare: true });
        const changed = fig.set({ text: `${p.hour}:${p.minute}`, period: p.period }, { animate: animate && !host.still(), night: state.night });
        ns.style.setProperty('--qn-spare', `${(p.hour.length < 2 ? state.oneFigure : 0).toFixed(1)}px`);
        timeEl.setAttribute('datetime', now.toISOString().slice(0, 16));
        (ns.querySelector('.qn-spoken') as HTMLElement).textContent = timeText(now, hass);
        ns.setAttribute('aria-label', fcWords(hass).clock);
        // Burn-in: whole pixels every 15 minutes, while the changed figure is out
        const q = Math.floor(minsOf(now) / 15);
        if (q !== state.drift) {
            state.drift = q;
            const path = [[0, 0], [1, 0], [2, 1], [1, 2], [0, 2], [-1, 1], [-2, 0], [-1, -1]];
            const [dx, dy] = path[q % path.length];
            const apply = () => { ns.style.transform = `translate(${dx}px, ${dy}px)`; };
            if (changed && animate) setTimeout(apply, MINUTE.day.out); else apply();
        }
        const c = content(now);
        const z = zone ?? (state.night ? ZONE.night : ZONE.day);
        const html = (l: Line) => `<span class="qn-line ${l.cls ?? ''}" data-k="${l.k}">${l.html}</span>`;
        fadeZone(subEl, c.sub.map(html).join(''), 'sub', z, animate);
        fadeZone(rightEl, c.lines.map(html).join(''), c.kind, z, animate, place);
        ns.toggleAttribute('data-night', state.night);
    }

    // ── Night: the light changes over 8 s on the sky's curve; the words fade through at its start ──
    const inks = (night: boolean) => {
        if (night && red()) return NIGHT_RED;
        if (theme()) return night ? THEME_NIGHT : { time: getComputedStyle(root).getPropertyValue('--primary-text-color').trim() || '#e1e1e1', words: getComputedStyle(root).getPropertyValue('--primary-text-color').trim() || '#e1e1e1' };
        if (night) return EMBER;
        const t = getComputedStyle(root).getPropertyValue('--weather-text-color').trim() || '#f7fafe';
        return { time: t, words: t };
    };
    function applyNight(on: boolean) {
        const ink = inks(on);
        timeEl.style.color = ink.time;
        subEl.style.color = ink.words; rightEl.style.color = ink.words;
        veil.style.opacity = on ? '1' : '0';
        el.toggleAttribute('data-qn-night', on);
        // Red at night: the veil is black, whatever the sky (fc-css.ts), and every word takes the red
        for (const e of [el, veil, ns]) e.toggleAttribute('data-red', red());
    }
    function setNight(on: boolean, instant = false) {
        if (on === state.night) return;
        const from = inks(state.night), to = inks(on);
        state.night = on;
        for (const a of state.anims) a.cancel();
        state.anims = [];
        applyNight(on);
        render(!instant, ZONE.night);
        if (instant || host.still() || typeof veil.animate !== 'function') return;
        const o = { duration: LIGHT.ms, easing: LIGHT.ease };
        state.anims = [
            veil.animate([{ opacity: on ? 0 : 1 }, { opacity: on ? 1 : 0 }], o),
            timeEl.animate(labKeyframes(toHex(from.time), toHex(to.time)), o),
            subEl.animate(labKeyframes(toHex(from.words), toHex(to.words)), o),
            rightEl.animate(labKeyframes(toHex(from.words), toHex(to.words)), o),
        ];
    }
    /** Night, by the config, the light sensor, or the hours from bed to the alarm */
    function wantNight(now: Date): boolean {
        const mode = cfg().night ?? 'auto';
        if (mode === 'on') return true;
        if (mode === 'off') return false;
        const hass = host.hass();
        const alarm = nextAlarm(hass, cfg().alarm_entity, now);
        const wakeAt = alarm ?? nextAt(now, parseHm(cfg().wake_time, 7 * 60));
        const sensor = cfg().night_sensor ? Number(hass?.states[cfg().night_sensor!]?.state) : NaN;
        if (isFinite(sensor)) {
            // Dark under night_lux held for 60 s, light over three times it held for 10 s: a phone screen or a passing car doesn't flip it
            const below = nightLux(cfg().night_lux);
            const dark = sensor < below ? true : sensor > 3 * below ? false : state.dark;
            if (dark !== state.dark) { state.dark = dark; state.darkSince = Date.now(); }
            const held = Date.now() - state.darkSince;
            if (state.dark === true && held >= 60_000) return true;
            if (state.dark === false && held >= 10_000) return false;
            return state.night;
        }
        const bed = cfg().bed_time ? parseHm(cfg().bed_time, 22 * 60 + 30) : (minsOf(wakeAt) - 510 + 1440) % 1440;
        return inRange(minsOf(now), bed, minsOf(wakeAt));
    }

    layout();
    state.night = wantNight(new Date());
    applyNight(state.night);
    render(false);
    const ticker = minuteTicker(() => { const n = wantNight(new Date()); if (n !== state.night) setNight(n); render(true); });
    let roRaf = 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(layout); }) : null;
    ro?.observe(root);
    let sensorTimer = 0;

    return {
        levels: () => [], setLevel() {}, levelOk: () => true, fitted() {},
        update() {
            const n = wantNight(new Date());
            if (n !== state.night) setNight(n);
            // A sensor reading that has to be held: look again when it would count
            clearTimeout(sensorTimer);
            if (cfg().night_sensor) sensorTimer = window.setTimeout(() => this.update(), 10_500);
            render(true);
        },
        seen(visible) { if (visible) { layout(); render(false); ticker.rearm(); } },
        away: () => false,
        conditionText: () => null,
        open() {},
        destroy() {
            ticker.stop(); ro?.disconnect(); cancelAnimationFrame(roRaf); clearTimeout(sensorTimer);
            for (const a of state.anims) a.cancel();
            fig.finish(); ns.remove(); veil.remove();
            delete el.dataset.qn; el.removeAttribute('data-qn-night'); el.removeAttribute('data-red');
        },
        /** For the demo and the tests: night on or off at once */
        night(on: boolean) { cfg().night; setNight(on); },
    } as ForecastExtras & { night(on: boolean): void };
}
