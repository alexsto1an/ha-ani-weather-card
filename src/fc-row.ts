// The hourly row (an hour to a column, an icon every hour, the value on the
// line), its four chips, and the daily list with its range bars and the dot
// for now. One module draws them for every surface: the weather card's
// section, the forecast card, the strip, the view that opens on tap and the
// wall.
//
// Nothing here knows about the sky: the row is a ruler (setOffset) that the
// slide moves, the chips change what the one line says, and every colour is
// currentColor, the card's own sky variables, the icons' light, or the
// fixed temperature scale.

import { CURVE, HOUR, clamp, css, ease, esc, num, reducedMotion, spring, whole } from './fc-core';
import { dayKey } from './localize';
import { HourRow, METRICS, Metric, Week, dayName } from './fc-data';
import { FcWords, fill } from './fc-words';
import { Tints, glyph, glyphSignature } from './fc-glyphs';
import type { HomeAssistant } from './types';

export const ROW_MOTION = {
    flex: 0.30,                 // s: the line's points and the now-dot, critically damped
    valueOut: 110, valueIn: 200, valueSwap: 120,
    select: 230,                // ms: the chip's capsule
    barsGrow: 220, lineOut: 120,
    wipe: 420,                  // ms: the bars arriving, one wipe across the week's scale
    dotIn: 120,                 // ms: today's dot, as the wipe's edge passes it
    rescale: 320,
    step: 600,                  // ms: the hour passing
};

// ── The temperature scale (fixed in °C, so a warm week looks warm) ─────────
// Cold is the sky's own light, the middle is the text's white, warm is the card's sun.
export const TEMP_STOPS: ReadonlyArray<readonly [number, string]> = [[-12, '#a6cffa'], [0, '#b1daf8'], [10, '#d9effb'], [17, '#f7fafe'], [24, '#ffd67a'], [32, '#ffc070']];
/** The scale as a CSS gradient across a track from min to max, in the entity's unit */
export function scaleGradient(min: number, max: number, fahrenheit = false): string {
    const span = Math.max(1e-6, max - min);
    const stops = TEMP_STOPS.map(([t, c]) => {
        const v = fahrenheit ? t * 9 / 5 + 32 : t;
        return `${c} ${(((v - min) / span) * 100).toFixed(2)}%`;
    });
    return `linear-gradient(90deg, ${stops.join(', ')})`;
}

export type Noun = 'rain' | 'snow' | 'sleet';
export function chipLabels(W: FcWords, noun: Noun): Record<Metric, [string, string]> {
    return { temp: W.temp, feels: W.feels, chance: [W[`chance_${noun}`], W.chance], amount: [W[`amount_${noun}`], W.amount] };
}
export function chipName(W: FcWords, m: Metric, noun: Noun): string {
    return m === 'temp' ? W.name_temp : m === 'feels' ? W.name_feels : W[`name_${m}_${noun}`];
}

let uid = 0;

// ════════════════════════════════════════════════════════════════════════════
// The hourly row
// ════════════════════════════════════════════════════════════════════════════
export interface HourlyOptions {
    hass?: HomeAssistant;
    W: FcWords;
    lang: string;
    hours: HourRow[];
    /** The live reading, for "Now" */
    current?: number;
    metric: Metric;
    has: Record<Metric, boolean>;
    noun: Noun;
    /** px per hour */
    pitch: number;
    /** px: the line's zone */
    plot?: number;
    valueHeight?: number;
    valueLift?: number;
    gapPad?: number;
    /** false: no icons (the narrow ladder's step) */
    glyphs?: boolean;
    glyphSize?: number;
    /** The light of hour i's icon, or null on a theme palette */
    tints?: (i: number) => Tints | null;
    /** The amount's unit ("mm", "in") */
    unit?: string;
    fahrenheit?: boolean;
    /** A label, an icon and a value every n hours (the wall's two-hour columns) */
    every?: number;
    /** Values stand above a whole line instead of on it (the wall) */
    above?: boolean;
    /** The line starts at a dot on the needle (the wall) */
    startDot?: boolean;
    conditionName(c: string): string;
}
export interface Hourly {
    el: HTMLElement;
    pitch: number;
    hours: HourRow[];
    empty: boolean;
    setOffset(px: number): void;
    offset(): number;
    setMetric(m: Metric, o?: { animate?: boolean }): void;
    metric(): Metric;
    remeasure(): void;
    retint(): void;
    step(done?: () => void): void;
    destroy(): void;
}

/**
 * How many hours a row shows across a width: one about every 54 px, so a wider card shows more hours rather than
 * wider gaps between them, and never fewer than a phone's six (eight on a wide card)
 */
export function hourCols(width: number, min: number): number {
    return Math.max(min, Math.round(width / 54));
}

export function createHourly(o: HourlyOptions): Hourly {
    const W = o.W;
    const hrs = o.hours.map(h => ({ ...h }));
    const n = hrs.length;
    const pitch = o.pitch;
    const H = o.plot ?? 44;
    const vh = o.valueHeight ?? 20;
    const id = `fcm${++uid}`;
    const el = document.createElement('div');
    el.className = 'fc-hourly';
    el.setAttribute('data-fc-hourly', '');
    el.style.setProperty('--fc-pitch', `${pitch}px`);
    el.style.setProperty('--fc-plot', `${H}px`);
    let metric: Metric = o.has[o.metric] ? o.metric : (METRICS.find(m => o.has[m]) ?? 'temp');
    const noop = { el, pitch, hours: hrs, empty: true, setOffset() {}, offset: () => 0, setMetric() {}, metric: () => metric, remeasure() {}, retint() {}, step(d?: () => void) { d?.(); }, destroy() { el.remove(); } };
    if (!n) { el.hidden = true; return noop; }
    if (o.current !== undefined && isFinite(o.current)) hrs[0] = { ...hrs[0], temp: o.current };
    el.dataset.metric = metric;

    // ── Scales, computed once for every hour the row can reach, so nothing rescales under a thumb ──
    const temps = hrs.flatMap(h => [h.temp, h.feels]).filter((v): v is number => v !== null);
    const tMin = temps.length ? Math.min(...temps) : 0, tMax = temps.length ? Math.max(...temps) : 1;
    // A flat day never draws a cliff: 8 °C (14.4 °F) is the least the travel shows
    const tSpan = Math.max(o.fahrenheit ? 14.4 : 8, tMax - tMin);
    const tMid = (tMin + tMax) / 2;
    // On the line: half a figure above and below its travel; above it (the wall): the figure stands over the line's highest point
    const tTop = o.above ? vh + (o.valueLift ?? 1) : vh / 2;
    const tBottom = o.above ? H - 4 : H - vh / 2;
    const travel = tBottom - tTop;
    const base = H - 2.5;
    const lift = H - 3 - vh;
    const aMax = Math.max(o.unit === 'in' ? 0.08 : 2, ...hrs.map(h => h.amount ?? 0));
    const yOf: Record<Metric, (h: HourRow) => number> = {
        temp: h => tTop + travel / 2 - (((h.temp ?? tMid) - tMid) / tSpan) * travel,
        feels: h => tTop + travel / 2 - (((h.feels ?? h.temp ?? tMid) - tMid) / tSpan) * travel,
        chance: h => base - ((h.chance ?? 0) / 100) * lift,
        amount: h => base - ((h.amount ?? 0) / aMax) * lift,
    };
    // The amount's number on the wettest hour of each wet run carries the unit
    const peaks = new Set<number>();
    for (let i = 0; i < n; i++) {
        if ((hrs[i].amount ?? 0) <= 0) continue;
        let j = i, best = i;
        while (j < n && (hrs[j].amount ?? 0) > 0) { if ((hrs[j].amount ?? 0) > (hrs[best].amount ?? 0)) best = j; j++; }
        peaks.add(best); i = j;
    }
    const digits = o.unit === 'in' ? 2 : 1;
    const textOf: Record<Metric, (h: HourRow, i: number) => string> = {
        temp: h => (h.temp === null ? '' : whole(h.temp)),
        feels: h => (h.feels ?? h.temp) === null ? '' : whole((h.feels ?? h.temp)!),
        chance: h => ((h.chance ?? 0) > 0 ? `${num(Math.round(h.chance!), o.lang)}<i class="fc-pct">%</i>` : ''),
        amount: (h, i) => ((h.amount ?? 0) > 0 ? `${num(h.amount!, o.lang, digits)}${peaks.has(i) && o.unit ? `<i class="fc-u">${esc(o.unit)}</i>` : ''}` : ''),
    };
    const every = Math.max(1, o.every ?? 1);
    const shown = (i: number) => i % every === 0;
    for (const m of METRICS) { const f = textOf[m]; textOf[m] = (h, i) => (shown(i) ? f(h, i) : ''); }
    const onLine = (m: Metric) => !o.above && (m === 'temp' || m === 'feels');
    const spoken: Record<Metric, (h: HourRow) => string> = {
        temp: h => fill(W.degrees, { v: whole(h.temp ?? 0) }),
        feels: h => fill(W.degrees, { v: whole(h.feels ?? h.temp ?? 0) }),
        chance: h => fill(W.percent, { v: String(Math.round(h.chance ?? 0)) }),
        amount: h => `${num(h.amount ?? 0, o.lang, digits)} ${o.unit ?? ''}`.trim(),
    };

    // ── Markup ──
    const label = (h: HourRow, i: number) => (i === 0 ? esc(W.now) : h.midnight ? esc(h.day) : `${esc(h.hour)}${h.period ? `<span class="awc-ampm">${esc(h.period)}</span>` : ''}`);
    const gl = o.glyphs !== false;
    const cols = hrs.map((h, i) => `<div class="fc-col${h.midnight && i > 0 ? ' fc-mid' : ''}" style="left:${(i * pitch).toFixed(2)}px"><span class="fc-hr">${shown(i) ? label(h, i) : ''}</span>${gl ? '<span class="fc-g"></span>' : ''}</div>`).join('');
    const xw = n * pitch;
    el.innerHTML = `<div class="fc-clip"><div class="fc-strip" style="width:${xw.toFixed(1)}px">
        <div class="fc-cols" aria-hidden="true">${cols}</div>
        <svg class="fc-plot" width="${xw.toFixed(1)}" height="${H}" viewBox="0 0 ${xw.toFixed(1)} ${H}" aria-hidden="true" focusable="false">
          <defs><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="-6" width="${xw.toFixed(1)}" height="${H + 12}"><rect x="0" y="-6" width="${xw.toFixed(1)}" height="${H + 12}" fill="#fff"/><g class="fc-gaps" fill="#000"></g></mask></defs>
          <path class="fc-base" d="M${(pitch / 2).toFixed(1)} ${base + 1}H${(xw - pitch / 2).toFixed(1)}"/>
          <path class="fc-area"/>
          <g class="fc-bars"></g>
          <path class="fc-line" mask="url(#${id})"/>${o.startDot ? '<circle class="fc-start" r="5"/>' : ''}
        </svg>
        <div class="fc-vals" aria-hidden="true">${hrs.map(() => '<span class="fc-val"></span>').join('')}</div>
      </div></div><i class="fc-needle" aria-hidden="true"></i>
      <ol class="fc-sr"></ol>`;
    const strip = el.querySelector('.fc-strip') as HTMLElement;
    const line = el.querySelector('.fc-line') as SVGPathElement, area = el.querySelector('.fc-area') as SVGPathElement;
    const barsG = el.querySelector('.fc-bars') as SVGGElement, baseEl = el.querySelector('.fc-base') as SVGPathElement;
    const gapsG = el.querySelector('.fc-gaps') as SVGGElement;
    const vals = [...el.querySelectorAll<HTMLElement>('.fc-val')];
    const sr = el.querySelector('.fc-sr') as HTMLElement;
    const xs = hrs.map((_, i) => (i + 0.5) * pitch);
    gapsG.innerHTML = hrs.map(() => '<rect rx="2"/>').join('');
    const gaps = [...gapsG.children] as SVGRectElement[];
    barsG.innerHTML = hrs.map((h, i) => {
        const a = h.amount ?? 0;
        if (a <= 0) return '';
        const bh = Math.max(2, (a / aMax) * lift), bw = Math.min(12, pitch * 0.24), r = Math.min(3, bh);
        const x0 = xs[i] - bw / 2, y0 = base + 1 - bh;
        return `<path d="M${x0.toFixed(2)} ${base + 1}V${(y0 + r).toFixed(2)}a${r} ${r} 0 0 1 ${r} ${-r}h${(bw - 2 * r).toFixed(2)}a${r} ${r} 0 0 1 ${r} ${r}V${base + 1}Z"/>`;
    }).join('');

    /** The icons: each in its hour's light; one that repeats its neighbour's mark and light is drawn quieter */
    function retint() {
        if (!gl) return;
        const slots = [...el.querySelectorAll<HTMLElement>('.fc-g')];
        let prev = '';
        hrs.forEach((h, i) => {
            const t = o.tints?.(i) ?? null;
            const sig = glyphSignature(h.condition, h.isDay, t);
            const g = slots[i];
            if (!shown(i)) { g.innerHTML = ''; return; }
            g.innerHTML = glyph(h.condition, h.isDay, o.glyphSize ?? 22, t);
            g.classList.toggle('fc-rep', i > 0 && every === 1 && sig === prev);
            prev = sig;
        });
    }
    retint();

    function writeSr() {
        sr.innerHTML = hrs.slice(0, 24).map((h, i) => `<li>${esc(`${i === 0 ? W.now : h.midnight ? `${h.day} ${h.time}` : h.time}: ${o.conditionName(h.condition)}, ${spoken[metric](h)}`)}</li>`).join('');
        sr.setAttribute('aria-label', `${W.hourly}: ${chipName(W, metric, o.noun)}`);
    }

    // ── The state the loop draws: every point on one spring, the values' fade, the marks' strengths ──
    const st = {
        y: hrs.map(h => yOf[metric](h)), v: hrs.map(() => 0), to: hrs.map(h => yOf[metric](h)),
        vOp: 1, vPhase: 'idle' as 'idle' | 'out' | 'in', vT: 0, vFrom: 1,
        keep: new Set<number>(),
        gap: onLine(metric) ? 1 : 0,
        lineOp: metric === 'amount' ? 0 : 1, areaOp: metric === 'chance' ? 1 : 0, barsOp: metric === 'amount' ? 1 : 0, barsS: metric === 'amount' ? 1 : 0,
        baseOp: metric === 'amount' ? 1 : 0,
        widths: hrs.map(() => 0),
    };
    let raf = 0, last = 0, morphT0 = 0;

    function writeValues(m: Metric) {
        vals.forEach((s, i) => { const t = textOf[m](hrs[i], i); if (s.dataset.t !== t) { s.innerHTML = t; s.dataset.t = t; } });
        el.dataset.values = onLine(m) ? 'line' : 'above';
        st.widths = vals.map(s => (s.dataset.t ? s.offsetWidth : 0));
    }
    function path(): string {
        // A monotone cubic through the points (Fritsch-Carlson): a flat hour stays flat, a turn never overshoots
        const y = st.y, d: number[] = [], m: number[] = [];
        for (let i = 0; i < n - 1; i++) d.push((y[i + 1] - y[i]) / pitch);
        m[0] = d[0] ?? 0; m[n - 1] = d[n - 2] ?? 0;
        for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
        let s = `M${xs[0].toFixed(2)} ${y[0].toFixed(2)}`;
        const h3 = pitch / 3;
        for (let i = 0; i < n - 1; i++) {
            s += `C${(xs[i] + h3).toFixed(2)} ${(y[i] + m[i] * h3).toFixed(2)} ${(xs[i + 1] - h3).toFixed(2)} ${(y[i + 1] - m[i + 1] * h3).toFixed(2)} ${xs[i + 1].toFixed(2)} ${y[i + 1].toFixed(2)}`;
        }
        return s;
    }
    const startDot = el.querySelector('.fc-start') as SVGCircleElement | null;
    function draw() {
        const p = path();
        line.setAttribute('d', p);
        if (startDot) { startDot.setAttribute('cx', xs[0].toFixed(2)); startDot.setAttribute('cy', st.y[0].toFixed(2)); startDot.style.opacity = st.lineOp.toFixed(3); }
        line.style.opacity = st.lineOp.toFixed(3);
        area.setAttribute('d', `${p}L${xs[n - 1].toFixed(2)} ${base + 1}L${xs[0].toFixed(2)} ${base + 1}Z`);
        area.style.opacity = st.areaOp.toFixed(3);
        baseEl.style.opacity = st.baseOp.toFixed(3);
        barsG.style.opacity = st.barsOp.toFixed(3);
        barsG.setAttribute('transform', `translate(0 ${base + 1}) scale(1 ${Math.max(0.001, st.barsS).toFixed(4)}) translate(0 ${-(base + 1)})`);
        const line_ = el.dataset.values === 'line';
        for (let i = 0; i < n; i++) {
            const w = st.widths[i];
            const keep = st.keep.has(i);
            const op = keep ? 1 : st.vOp;
            const s = vals[i];
            if (!w) { if (s.style.opacity !== '0') s.style.opacity = '0'; gaps[i].setAttribute('width', '0'); continue; }
            const top = line_ ? st.y[i] - vh / 2 : st.y[i] - vh - (o.valueLift ?? 1);
            s.style.transform = `translate3d(${(xs[i] - w / 2).toFixed(2)}px, ${top.toFixed(2)}px, 0)`;
            s.style.opacity = op.toFixed(3);
            // The line's gaps travel with their values, and open and close with their light
            const gw = line_ ? (w + (o.gapPad ?? 8)) * (keep ? 1 : st.gap) : 0;
            gaps[i].setAttribute('x', (xs[i] - gw / 2).toFixed(2));
            gaps[i].setAttribute('y', (st.y[i] - vh / 2 - 2).toFixed(2));
            gaps[i].setAttribute('width', gw.toFixed(2));
            gaps[i].setAttribute('height', String(vh + 4));
        }
    }
    const step = (cur: number, to: number, ms: number, dt: number) => { const s = (dt * 1000) / ms; return Math.abs(to - cur) <= s ? to : cur + Math.sign(to - cur) * s; };
    function tick(ts: number) {
        const dt = Math.min(0.05, last ? (ts - last) / 1000 : 1 / 60);
        last = ts;
        let moving = false;
        for (let i = 0; i < n; i++) {
            if (Math.abs(st.y[i] - st.to[i]) < 0.01 && Math.abs(st.v[i]) < 0.5) { st.y[i] = st.to[i]; st.v[i] = 0; continue; }
            [st.y[i], st.v[i]] = spring(st.y[i], st.v[i], st.to[i], ROW_MOTION.flex, dt);
            moving = true;
        }
        // The values: out together, the swap while nothing shows, in together
        const t = ts - st.vT;
        if (st.vPhase === 'out') {
            const d = ROW_MOTION.valueOut * st.vFrom;
            st.vOp = st.vFrom * (1 - ease.out(clamp(t / Math.max(1, d))));
            if (t >= d + (ROW_MOTION.valueSwap - ROW_MOTION.valueOut)) { st.vOp = 0; st.keep.clear(); writeValues(metric); st.vPhase = 'in'; st.vT = ts; }
            moving = true;
        } else if (st.vPhase === 'in') {
            st.vOp = ease.in(clamp(t / ROW_MOTION.valueIn));
            if (t >= ROW_MOTION.valueIn) { st.vOp = 1; st.vPhase = 'idle'; } else moving = true;
        }
        st.gap = st.vOp;
        // The marks: the line, the soft body under a chance, the bars of an amount
        const lineTo = metric === 'amount' ? 0 : 1, areaTo = metric === 'chance' ? 1 : 0, barsTo = metric === 'amount' ? 1 : 0, baseTo = metric === 'amount' ? 1 : 0;
        st.lineOp = step(st.lineOp, lineTo, lineTo ? 180 : ROW_MOTION.lineOut, dt);
        st.areaOp = step(st.areaOp, areaTo, areaTo ? 240 : ROW_MOTION.lineOut, dt);
        st.barsOp = step(st.barsOp, barsTo, barsTo ? 60 : ROW_MOTION.lineOut, dt);
        st.baseOp = step(st.baseOp, baseTo, 200, dt);
        const bt = clamp((ts - morphT0) / ROW_MOTION.barsGrow);
        st.barsS = barsTo ? Math.max(st.barsS, ease.in(bt)) : st.barsS;
        if (!barsTo && st.barsOp === 0) st.barsS = 0;
        if (st.lineOp !== lineTo || st.areaOp !== areaTo || st.barsOp !== barsTo || st.baseOp !== baseTo || (barsTo && bt < 1)) moving = true;
        draw();
        if (moving) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(tick); } };

    function setMetric(m: Metric, { animate = true } = {}) {
        if (!o.has[m] || m === metric) return;
        const prev = metric;
        metric = m;
        el.dataset.metric = m;
        st.to = hrs.map(h => yOf[m](h));
        writeSr();
        if (!animate || reducedMotion()) {
            // The keys, reduced motion: the end state, no travel
            cancelAnimationFrame(raf); raf = 0; last = 0;
            st.y = [...st.to]; st.v.fill(0); st.keep.clear();
            writeValues(m);
            st.vOp = 1; st.vPhase = 'idle'; st.gap = onLine(m) ? 1 : 0;
            st.lineOp = m === 'amount' ? 0 : 1; st.areaOp = m === 'chance' ? 1 : 0; st.barsOp = m === 'amount' ? 1 : 0; st.barsS = st.barsOp; st.baseOp = m === 'amount' ? 1 : 0;
            draw();
            if (animate && typeof el.animate === 'function') el.animate([{ opacity: 0.4 }, { opacity: 1 }], { duration: 160, easing: 'linear' });
            return;
        }
        // A value whose text and place on the line don't change keeps its light (Temp to Feels like, where they agree)
        st.keep.clear();
        if (onLine(prev) && onLine(m) && st.vPhase === 'idle') for (let i = 0; i < n; i++) if (textOf[prev](hrs[i], i) === textOf[m](hrs[i], i)) st.keep.add(i);
        const now = performance.now();
        morphT0 = now;
        if (m === 'amount') st.barsS = Math.min(st.barsS, 0.001);
        if (st.vPhase !== 'out') { st.vFrom = st.vOp; st.vPhase = 'out'; st.vT = now; }
        kick();
    }

    // ── The ruler: the slide's own offset, the same frame ──
    let offset = 0;
    function setOffset(px: number) {
        offset = px;
        strip.style.transform = `translate3d(${(-px).toFixed(2)}px, 0, 0)`;
    }

    writeValues(metric);
    writeSr();
    draw();
    // Web fonts change the figures' widths: measure again once they're in
    document.fonts?.ready.then(() => { if (el.isConnected) { st.widths = vals.map(s => (s.dataset.t ? s.offsetWidth : 0)); draw(); } }).catch(() => {});

    return {
        el, pitch, hours: hrs, empty: false,
        setOffset, offset: () => offset,
        setMetric, metric: () => metric,
        /** Lay out again after the row was hidden when it was built */
        remeasure() { st.widths = vals.map(s => (s.dataset.t ? s.offsetWidth : 0)); draw(); },
        retint,
        /** The hour passing: the row steps one column (600 ms); `done` rebuilds it an hour on */
        step(done?: () => void) {
            if (reducedMotion() || typeof strip.animate !== 'function') { done?.(); return; }
            const a = strip.animate([{ transform: `translate3d(${-offset}px, 0, 0)` }, { transform: `translate3d(${-offset - pitch}px, 0, 0)` }],
                { duration: ROW_MOTION.step, easing: css(CURVE.inOut), fill: 'forwards' });
            // The hour that has passed stops being "Now" first; then the next one becomes "Now". Never two in one frame.
            el.querySelector('.fc-col .fc-hr')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: css(CURVE.out), fill: 'forwards' });
            const next = el.querySelectorAll('.fc-col')[1]?.querySelector('.fc-hr') as HTMLElement | null;
            if (next) {
                next.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, delay: 240, easing: css(CURVE.out), fill: 'forwards' }).finished.then(() => {
                    next.textContent = W.now;
                    next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: css(CURVE.in), fill: 'forwards' });
                }).catch(() => {});
            }
            a.finished.then(() => done?.()).catch(() => {});
        },
        destroy() { cancelAnimationFrame(raf); raf = 0; el.remove(); },
    };
}

// ════════════════════════════════════════════════════════════════════════════
// The chips
// ════════════════════════════════════════════════════════════════════════════
export interface Chips {
    el: HTMLElement;
    sel: HTMLElement | null;
    empty: boolean;
    set(m: Metric, o?: { travel?: boolean; silent?: boolean }): void;
    value(): Metric;
    level(): number;
    fit(): void;
    destroy(): void;
}
/**
 * A radiogroup of radio chips with a roving tabindex. The selected capsule is
 * a copy of the row in the selected style behind a clip window, so the ink
 * changes exactly at the capsule's edge.
 */
export function createChips(o: { W: FcWords; metrics: Metric[]; value: Metric; noun: Noun; minLevel?: number; onChange(m: Metric, o: { keys: boolean }): void }): Chips {
    const { W, metrics } = o;
    const labels = chipLabels(W, o.noun);
    const el = document.createElement('div');
    el.className = 'fc-chips';
    let value: Metric = metrics.includes(o.value) ? o.value : metrics[0];
    if (metrics.length < 2) { el.hidden = true; return { el, sel: null, empty: true, set() {}, value: () => value, level: () => 0, fit() {}, destroy() { el.remove(); } }; }
    el.setAttribute('data-fc-chips', '');
    el.setAttribute('role', 'radiogroup');
    el.setAttribute('aria-label', W.show);
    el.innerHTML = `<div class="fc-chips-row">${metrics.map(m => `<button type="button" class="fc-chip" role="radio" data-metric="${m}" aria-checked="${m === value}" aria-label="${esc(chipName(W, m, o.noun))}" tabindex="${m === value ? 0 : -1}"><span>${esc(labels[m][0])}</span></button>`).join('')}</div>`
        + `<div class="fc-chips-sel" aria-hidden="true">${metrics.map(m => `<span class="fc-chip" data-metric="${m}"><span>${esc(labels[m][0])}</span></span>`).join('')}</div>`;
    const row = el.querySelector('.fc-chips-row') as HTMLElement, sel = el.querySelector('.fc-chips-sel') as HTMLElement;
    const chips = [...row.children] as HTMLElement[], copies = [...sel.children] as HTMLElement[];
    let level = 0;
    function windowTo(travel: boolean) {
        const c = chips[metrics.indexOf(value)];
        const l = c.offsetLeft, r = el.clientWidth - l - c.offsetWidth;
        sel.style.transition = travel ? '' : 'none';
        const clip = `inset(0 ${r.toFixed(2)}px 0 ${l.toFixed(2)}px round 999px)`;
        sel.style.clipPath = clip;
        sel.style.setProperty('-webkit-clip-path', clip);
        if (!travel) { void sel.offsetWidth; sel.style.transition = ''; }
    }
    /** Whole or a step down: the full words, then the short ones, measured against this language */
    function fit() {
        const setLevel = (lv: number) => { level = lv; for (const set of [chips, copies]) set.forEach((c, i) => { (c.firstElementChild as HTMLElement).textContent = labels[metrics[i]][lv]; }); el.dataset.level = String(lv); };
        setLevel(Math.min(1, o.minLevel ?? 0));
        if (level === 0 && row.scrollWidth > el.clientWidth + 0.5) setLevel(1);
        if (row.scrollWidth > el.clientWidth + 0.5) el.dataset.level = '2';     // short words in a tighter pill
        windowTo(false);
    }
    function set(m: Metric, { travel = true, silent = false, keys = false }: { travel?: boolean; silent?: boolean; keys?: boolean } = {}) {
        if (!metrics.includes(m) || m === value) return;
        value = m;
        chips.forEach(c => { const on = c.dataset.metric === m; c.setAttribute('aria-checked', String(on)); c.tabIndex = on ? 0 : -1; });
        windowTo(travel && !reducedMotion());
        if (!silent) o.onChange(m, { keys });
    }
    const onClick = (e: Event) => { const c = (e.target as HTMLElement).closest('.fc-chip') as HTMLElement | null; if (c && row.contains(c)) set(c.dataset.metric as Metric); };
    const onKey = (e: KeyboardEvent) => {
        const i = metrics.indexOf(value);
        const to = ({ ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: metrics.length - 1 } as Record<string, number>)[e.key];
        if (to === undefined) return;
        e.preventDefault(); e.stopPropagation();
        const m = metrics[(to + metrics.length) % metrics.length];
        set(m, { travel: false, keys: true });       // from the keys the capsule doesn't travel
        chips[metrics.indexOf(m)].focus();
    };
    // The press: the pressed word, and the capsule's copy of it, give 3%
    const pd = (e: PointerEvent) => { const c = (e.target as HTMLElement).closest?.('.fc-chip') as HTMLElement | null; if (!c) return; const i = chips.indexOf(c); c.classList.add('fc-press'); copies[i]?.classList.add('fc-press'); };
    const pu = () => { for (const c of [...chips, ...copies]) c.classList.remove('fc-press'); };
    row.addEventListener('click', onClick);
    row.addEventListener('keydown', onKey);
    row.addEventListener('pointerdown', pd);
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) row.addEventListener(ev, pu);
    let roRaf = 0, lastW = 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(() => { const w = el.clientWidth; if (w && w !== lastW) { lastW = w; fit(); } }); }) : null;
    ro?.observe(el);
    document.fonts?.ready.then(() => { if (el.isConnected) fit(); }).catch(() => {});
    return { el, sel, empty: false, set, value: () => value, fit, level: () => level, destroy() { cancelAnimationFrame(roRaf); ro?.disconnect(); el.remove(); } };
}

// ════════════════════════════════════════════════════════════════════════════
// The daily list
// ════════════════════════════════════════════════════════════════════════════
export interface Daily {
    el: HTMLElement;
    empty: boolean;
    arrive(): void;
    setNow(temp: number | null, o?: { animate?: boolean }): void;
    /**
     * Another card's needle, at a time (ms) and the temperature there: its day stands out, the others step back, and
     * the dot rides that day's bar at that temperature. null: back to now.
     */
    follow(at: { at: number; temperature: number | null } | null): void;
    /**
     * What the days show, as the chips do for the hours: the temperature's range, the feels-like range, the chance of
     * rain or the amount, each on one scale for the week. The dot for now is the temperature's only.
     */
    setMetric(m: Metric, o?: { animate?: boolean }): void;
    draw(): void;
    destroy(): void;
}
/** What a day shows for a metric: a span on the week's scale and its two labels */
interface DayValue { lo?: number; hi?: number; loText: string; hiText: string }
export function createDaily(o: {
    hass?: HomeAssistant; W: FcWords; week: Week; current?: number; glyphSize?: number; tints?: Tints | null; theme: boolean; fahrenheit?: boolean;
    conditionName(c: string): string; ring?: number;
    /** For the other metrics: the hours (their feels like), the reading's feels like now, what falls, the amount's unit */
    hours?: Array<{ date: Date; feels: number | null }>; currentFeels?: number; noun?: Noun; unit?: string; lang?: string;
}): Daily {
    const { W, week } = o;
    const el = document.createElement('div');
    el.className = 'fc-daily';
    el.setAttribute('data-fc-daily', '');
    el.setAttribute('role', 'list');
    el.setAttribute('aria-label', W.daily);
    const days = week.days.filter(d => d.high !== undefined || d.low !== undefined);
    if (!days.length) { el.hidden = true; return { el, empty: true, arrive() {}, setNow() {}, follow() {}, setMetric() {}, draw() {}, destroy() { el.remove(); } }; }
    const ring = o.ring ?? 5.5;
    const today = days[0].isToday ? days[0] : null;
    let now: number | null = today && o.current !== undefined && isFinite(o.current) ? clamp(o.current, today.low ?? o.current, today.high ?? o.current) : null;
    const deg = (v: number | undefined) => (v === undefined ? '' : `${whole(v)}°`);
    el.innerHTML = days.map((d, i) => {
        const long = dayName(d.date, o.hass, 'long');
        const sr = fill(W.day_row, { day: d.isToday ? `${long}, ${W.today.toLowerCase()}` : long, cond: o.conditionName(d.condition ?? ''), lo: d.low === undefined ? '' : fill(W.degrees, { v: whole(d.low) }), hi: d.high === undefined ? '' : fill(W.degrees, { v: whole(d.high) }) })
            + (d.isToday && now !== null ? fill(W.day_now, { v: fill(W.degrees, { v: whole(o.current!) }) }) : '');
        return `<div class="fc-day" data-fc-day role="listitem" aria-label="${esc(sr)}"${d.isToday ? ' data-today' : ''}>`
            + `<span class="fc-d-name" aria-hidden="true">${esc(dayName(d.date, o.hass))}</span><span class="fc-d-g">${glyph(d.condition, true, o.glyphSize ?? 20, o.tints ?? null)}</span>`
            + `<span class="fc-d-lo" aria-hidden="true">${deg(d.low)}</span>`
            + `<span class="fc-d-bar" aria-hidden="true"><span class="fc-d-ink"><i class="fc-track"></i><i class="fc-fill"></i></span>${i === 0 && now !== null ? '<b class="fc-dot" data-fc-now></b>' : ''}</span>`
            + `<span class="fc-d-hi" aria-hidden="true">${deg(d.high)}</span></div>`;
    }).join('');
    const rows = [...el.querySelectorAll<HTMLElement>('.fc-day')];
    const fills = rows.map(r => r.querySelector('.fc-fill') as HTMLElement);
    const los = rows.map(r => r.querySelector('.fc-d-lo') as HTMLElement), his = rows.map(r => r.querySelector('.fc-d-hi') as HTMLElement);
    const labels = rows.map(r => r.getAttribute('aria-label') ?? '');

    // ── The metrics: each day's span and labels, and the week's scale ──
    const lang = o.lang || o.hass?.locale?.language || o.hass?.language || 'en';
    const noun: Noun = o.noun ?? 'rain';
    const amountText = (v: number) => num(v, lang, v > 0 && v < 10 ? 1 : 0);
    /** Feels like through the day: the hours in it, the day's own figure, and now's reading on today */
    const feelsOf = (d: typeof days[number]): number[] => {
        const key = dayKey(d.date, o.hass);
        const v = (o.hours ?? []).filter(h => h.feels !== null && dayKey(h.date, o.hass) === key).map(h => h.feels as number);
        const own = d.entry.apparent_temperature;
        if (typeof own === 'number' && isFinite(own)) v.push(own);
        if (d.isToday && o.currentFeels !== undefined && isFinite(o.currentFeels)) v.push(o.currentFeels);
        return v;
    };
    function valuesFor(m: Metric): { vals: DayValue[]; min: number; max: number; wet: boolean } {
        if (m === 'chance' || m === 'amount') {
            const raw = days.map(d => (m === 'chance' ? d.chance : d.precipitation));
            const top = m === 'chance' ? 100 : Math.max(o.unit === 'in' ? 0.2 : 5, ...raw.map(v => v ?? 0));
            return {
                wet: true, min: 0, max: top,
                vals: raw.map(v => (v === undefined ? { loText: '', hiText: '–' } : { lo: 0, hi: v, loText: '', hiText: m === 'chance' ? `${num(Math.round(v), lang)}%` : amountText(v) })),
            };
        }
        if (m === 'feels') {
            const vals = days.map(d => {
                const f = feelsOf(d);
                if (!f.length) return { loText: '', hiText: '–' };
                const lo = Math.min(...f), hi = Math.max(...f);
                return { lo, hi, loText: f.length > 1 ? deg(lo) : '', hiText: deg(hi) };
            });
            const all = vals.flatMap(v => (v.lo === undefined ? [] : [v.lo, v.hi!]));
            let min = all.length ? Math.min(...all) : week.min, max = all.length ? Math.max(...all) : week.max;
            if (max - min < 1) max = min + 1;
            return { wet: false, min, max, vals };
        }
        return { wet: false, min: week.min, max: week.max, vals: days.map(d => ({ lo: d.low, hi: d.high, loText: deg(d.low), hiText: deg(d.high) })) };
    }
    let metric: Metric = 'temp';
    let cur = valuesFor('temp');
    /** The spoken row for a metric other than the temperature: its name and what it says */
    function spoken(i: number, m: Metric): string {
        if (m === 'temp') return labels[i];
        const d = days[i], v = cur.vals[i];
        const long = dayName(d.date, o.hass, 'long');
        const day = d.isToday ? `${long}, ${W.today.toLowerCase()}` : long;
        const cond = o.conditionName(d.condition ?? '');
        if (m === 'feels') return v.lo === undefined ? `${day}: ${cond}` : fill(W.day_row, { day, cond: `${cond}, ${W.name_feels}`, lo: fill(W.degrees, { v: whole(v.lo) }), hi: fill(W.degrees, { v: whole(v.hi!) }) });
        const what = v.hi === undefined ? '–' : m === 'chance' ? fill(W.percent, { v: String(Math.round(v.hi)) }) : `${amountText(v.hi)} ${o.unit ?? ''}`.trim();
        return `${day}: ${cond}, ${chipName(W, m, noun)} ${what}`;
    }
    const inks = rows.map(r => r.querySelector('.fc-d-ink') as HTMLElement);
    let dot = el.querySelector('.fc-dot') as HTMLElement | null;
    /** The row the dot is on: today's, or the day another card's needle is in */
    let dotRow = 0;
    /** Now, to come back to after following another card's needle */
    const home = { now, row: 0, dot: !!dot };
    const st = { min: week.min, max: week.max, edge: 1, nowX: 0, nowV: 0, dotOp: 1, mix: 1 };
    const frac = (t: number) => (t - st.min) / (st.max - st.min);
    /** Each day's span on the scale, as fractions: what the bars glide from when the metric changes */
    const spanOf = (v: DayValue, min: number, max: number): [number, number] | null => {
        if (v.lo === undefined && v.hi === undefined) return null;
        const f = (t: number) => (t - min) / Math.max(1e-6, max - min);
        return [f(v.lo ?? v.hi!), f(v.hi ?? v.lo!)];
    };
    let from: Array<[number, number] | null> = [];
    function draw() {
        const g = o.theme || cur.wet ? '' : scaleGradient(st.min, st.max, o.fahrenheit);
        const bw = fills[0]?.parentElement?.clientWidth || 150;
        days.forEach((d, i) => {
            const f = fills[i];
            f.style.backgroundImage = g;
            f.classList.toggle('fc-wet', cur.wet);
            // Nothing falls, nothing to draw: a dry day's chance or amount is its figure alone
            const v = cur.vals[i];
            const to = cur.wet && !((v.hi ?? 0) > 0) ? null : spanOf(v, st.min, st.max);
            // Mid-change, a bar glides from the last metric's span to this one's; a day with nothing to show fades
            const was = st.mix < 1 ? from[i] : to;
            const span = to && was ? [was[0] + (to[0] - was[0]) * st.mix, was[1] + (to[1] - was[1]) * st.mix] : to ?? was;
            if (!span) { fills[i].style.opacity = '0'; return; }
            const [lo, hi] = span;
            // Never thinner than its own height: a day whose high and low meet is still a mark
            const minW = 6 / bw;
            const a = Math.min(lo, 1 - minW), b = Math.max(hi, a + minW);
            // The wipe: one edge across the week's scale, so every row's leading edge is on one line
            let right = Math.min(b, st.edge);
            let left = a;
            if (right <= left + 0.0005) { fills[i].style.opacity = '0'; return; }
            fills[i].style.opacity = !to ? (1 - st.mix).toFixed(3) : !was ? st.mix.toFixed(3) : '';
            // Beside the dot a sliver of fill shorter than the ring is noise: the fill ends at the ring
            if (i === dotRow && dot && now !== null && metric === 'temp') {
                const r = (ring + 8.5) / bw;
                if (right > st.nowX && right - st.nowX < r) right = Math.min(right, st.nowX);
                if (st.nowX > left && st.nowX - left < r) left = Math.max(left, st.nowX);
            }
            const clip = `inset(0 ${((1 - right) * 100).toFixed(3)}% 0 ${(left * 100).toFixed(3)}% round 999px)`;
            f.style.clipPath = clip;
            f.style.setProperty('-webkit-clip-path', clip);
        });
        if (dot && now !== null) {
            const x = st.nowX * bw;
            // The dot is the temperature's: on another metric it steps aside, and so does its ring
            const op = st.dotOp * (metric === 'temp' ? st.mix : 1 - st.mix) * (metric === 'temp' || st.mix < 1 ? 1 : 0);
            dot.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
            dot.style.opacity = op.toFixed(3);
            // The ring: the sky shows through the track and the fill around the dot
            const m = op > 0.01 ? `radial-gradient(circle at ${x.toFixed(2)}px 50%, transparent ${ring}px, #000 ${ring + 0.75}px)` : 'none';
            inks.forEach((ink, i) => {
                const v = i === dotRow ? m : '';
                if (ink.style.maskImage !== v) { ink.style.setProperty('-webkit-mask-image', v); ink.style.maskImage = v; }
            });
        }
    }
    st.nowX = now !== null ? clamp(frac(now)) : 0;
    let raf = 0;
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    /**
     * The bars arrive in one wipe across the week's shared scale, cold to
     * warm: every row's leading edge is on one vertical line, one
     * temperature, so the scale explains itself. Today's dot fades in as the
     * edge passes it. Only with the card's first paint and when the view opens.
     */
    function arrive() {
        stop();
        if (reducedMotion()) { st.edge = 1; st.dotOp = 1; draw(); return; }
        const t0 = performance.now();
        st.edge = 0; st.dotOp = 0; draw();
        let dotAt = -1;
        const f = (ts: number) => {
            const t = clamp((ts - t0) / ROW_MOTION.wipe);
            st.edge = ease.drawer(t);
            if (dotAt < 0 && st.edge >= st.nowX) dotAt = ts;
            st.dotOp = dotAt < 0 ? 0 : clamp((ts - dotAt) / ROW_MOTION.dotIn);
            draw();
            raf = t < 1 || st.dotOp < 1 ? requestAnimationFrame(f) : 0;
        };
        raf = requestAnimationFrame(f);
    }
    /** The reading changed (or the needle moved through today): the dot goes there on the flex spring */
    function setNow(temp: number | null, { animate = true } = {}) {
        if (!dot || !today || temp === null) return;
        home.now = clamp(temp, today.low ?? temp, today.high ?? temp);
        // Following another card's needle, the dot is there; it comes back to this
        if (el.dataset.fcFollow !== undefined) return;
        now = home.now;
        const to = clamp(frac(now));
        if (!animate || reducedMotion()) { st.nowX = to; st.nowV = 0; draw(); return; }
        stop();
        let last = 0;
        const f = (ts: number) => {
            const dt = Math.min(0.05, last ? (ts - last) / 1000 : 1 / 60); last = ts;
            [st.nowX, st.nowV] = spring(st.nowX, st.nowV, to, ROW_MOTION.flex, dt);
            const done = Math.abs(st.nowX - to) < 0.0005 && Math.abs(st.nowV) < 0.005;
            if (done) { st.nowX = to; st.nowV = 0; }
            draw();
            raf = done ? 0 : requestAnimationFrame(f);
        };
        raf = requestAnimationFrame(f);
    }
    // ── Another card's needle ──
    // Each frame asks which day the needle is in: the days' keys once, and the needle's once a quarter hour
    // (a day can start on a quarter hour where the zone is offset by one)
    let keys: string[] | null = null;
    const dayOf = { q: NaN, i: -1 };
    function dayIndex(at: number): number {
        const q = Math.floor(at / (HOUR / 4));
        if (q === dayOf.q) return dayOf.i;
        keys ??= days.map(d => dayKey(d.date, o.hass));
        dayOf.q = q;
        dayOf.i = keys.indexOf(dayKey(new Date(at), o.hass));
        return dayOf.i;
    }
    function follow(at: { at: number; temperature: number | null } | null) {
        const i = at ? dayIndex(at.at) : -1;
        const day = i >= 0 && !rows[i].hidden ? days[i] : null;
        if (!at || !day) {
            if (el.dataset.fcFollow === undefined) return;
            delete el.dataset.fcFollow;
            rows.forEach(r => { delete r.dataset.fcAt; });
            // Back to now: today's dot where the reading is, or none
            dotRow = home.row;
            if (dot && dot.parentElement !== rows[dotRow].querySelector('.fc-d-bar')) rows[dotRow].querySelector('.fc-d-bar')!.append(dot);
            if (dot && !home.dot) { dot.remove(); dot = null; inks.forEach(ink => { ink.style.setProperty('-webkit-mask-image', ''); ink.style.maskImage = ''; }); }
            now = home.now;
            if (now !== null) st.nowX = clamp(frac(now));
            draw();
            return;
        }
        stop();
        st.edge = 1; st.dotOp = 1;
        el.dataset.fcFollow = '';
        rows.forEach((r, j) => { if (j === i) r.dataset.fcAt = ''; else delete r.dataset.fcAt; });
        // The dot rides the needle's day, at the temperature there (within that day's range)
        const t = at.temperature ?? (day.high !== undefined && day.low !== undefined ? (day.high + day.low) / 2 : day.high ?? day.low!);
        now = clamp(t, day.low ?? t, day.high ?? t);
        if (!dot) { dot = document.createElement('b'); dot.className = 'fc-dot'; }
        if (dotRow !== i || !dot.isConnected) { dotRow = i; rows[i].querySelector('.fc-d-bar')!.append(dot); }
        st.nowX = clamp(frac(now));
        draw();
    }
    /** The chips changed what the hours show: the days show it too, the bars gliding to their new spans */
    let mixRaf = 0;
    function setMetric(m: Metric, { animate = true } = {}) {
        if (m === metric) return;
        const old = cur;
        from = days.map((_, i) => spanOf(old.vals[i], st.min, st.max));
        metric = m;
        cur = valuesFor(m);
        // Re-express where the bars were on the new scale, so the glide is the bars', not the scale's
        from = from.map(f => (f ? [old.min + f[0] * (old.max - old.min), old.min + f[1] * (old.max - old.min)] : null))
            .map(v => (v ? [(v[0] - cur.min) / Math.max(1e-6, cur.max - cur.min), (v[1] - cur.min) / Math.max(1e-6, cur.max - cur.min)] as [number, number] : null));
        if (old.wet !== cur.wet) from = from.map(() => null);
        st.min = cur.min; st.max = cur.max;
        el.dataset.metric = m;
        rows.forEach((r, i) => {
            los[i].textContent = cur.vals[i].loText;
            his[i].textContent = cur.vals[i].hiText;
            r.setAttribute('aria-label', spoken(i, m));
        });
        if (now !== null) st.nowX = clamp(frac(now));
        cancelAnimationFrame(mixRaf);
        if (!animate || reducedMotion()) { st.mix = 1; draw(); return; }
        const t0 = performance.now();
        st.mix = 0; draw();
        const f = (ts: number) => {
            const t = clamp((ts - t0) / ROW_MOTION.rescale);
            st.mix = ease.drawer(t);
            draw();
            mixRaf = t < 1 ? requestAnimationFrame(f) : 0;
        };
        mixRaf = requestAnimationFrame(f);
    }
    draw();
    let roRaf = 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(() => { if (el.isConnected && !raf) draw(); }); }) : null;
    ro?.observe(el);
    return { el, empty: false, arrive, setNow, follow, setMetric, draw, destroy() { stop(); cancelAnimationFrame(roRaf); cancelAnimationFrame(mixRaf); ro?.disconnect(); el.remove(); } };
}

void HOUR;
