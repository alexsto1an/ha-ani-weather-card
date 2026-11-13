// The slide through the hours. Pull the card sideways and its real light,
// sun, clouds, rain and readings go to the hour under the needle; the hourly
// row (or, where it has given way, the divider's rail) is the ruler, moving
// 1:1 under the finger.
//
// Letting go leaves the card at that hour: a slow lift settles on the
// nearest one, a flick carries on the way a list does and lands on the hour
// it was heading for. The next drag continues from there, so a few short
// swipes reach the far hours. Coming home is deliberate: the Now control,
// Home or Escape on the slider, or the card noticing nobody is reading it
// (half a minute without a touch, the page hidden, the card scrolled away,
// a new forecast). Home is one critically damped spring on one progress:
// the ruler, every sky colour, the sun and every weather layer go straight
// from what was visible to now, and the hour's words cross to now's.
//
// It can be caught: a press while it moves stops it that frame and tracks
// from where it is. Touch-down is invisible: the layers an hour ahead needs
// are pre-warmed with their transition off. Velocity comes from the last
// 80 ms only. A vertical drag stays the page's (touch-action: pan-y).
//
// The page follows the needle (hour-link.ts): every frame it moves, the
// slide says which time it's on, the temperature there and the sky it shows,
// and once it's home it says so. The view doesn't, and neither does a slide
// that steps by days. An hourly slide on the same weather follows another
// card's needle the way the finger moves it, ruler, sky and readout, and
// says nothing while it does, so nothing echoes; a hand on it, or its Now
// control, makes it the one that leads. The days on the same card follow its
// own needle (onNeedle).

import type { ForecastHost } from './forecast-host';
import type { SkyCondition, SkyPhase } from './sky';
import { onHour, sendHour } from './hour-link';
import {
    CONTAINER, LAYER_NAMES, LAYER_OF, Lab, Slot, Timeline, clamp, cssOf, haptic, isWet, labOf, phaseWeights, reducedMotion,
    rubber, smooth, spring, sunDrop, sunModel,
} from './fc-core';

export const SLIDE = {
    slopPx: 10, catchPx: 3, angle: 1.2,   // the claim; a caught slide tracks after 3 px
    skyTau: 0.18,                         // s: under the finger, every output eases toward the needle's hour
    home: 0.38,                           // s: the way home, one spring on one progress
    wordsOutEnd: 0.66, wordsSwap: 0.68, wordsInEnd: 0.97,
    velocityWindow: 80,                   // ms
    momentum: 0.4,                        // s: how far a flick carries (a list's deceleration)
    wheelClamp: 60, wheelRest: 400,
    prewarmStop: 1600,                    // ms after the last touch
    idleHome: 30000,                      // ms: a card left at another hour comes home when nobody is reading it
    railHourPx: 25.9,                     // px an hour on the divider's rail, where no row is shown
};

// The sun's and the clouds' colours by phase (styles/card.ts), mixed with the sky every frame
const SUN_PHASE: Record<SkyPhase, Record<string, string>> = {
    day: { sp: '#ffd67a', ss: '#ffb547', sg: 'rgba(255, 214, 140, 0.55)', sh: 'rgba(255, 214, 140, 0.24)' },
    dawn: { sp: '#ffe0b0', ss: '#ffb98a', sg: 'rgba(255, 214, 140, 0.55)', sh: 'rgba(255, 214, 140, 0.24)' },
    dusk: { sp: '#ffc58a', ss: '#ff9a5c', sg: 'rgba(255, 170, 110, 0.55)', sh: 'rgba(255, 170, 110, 0.24)' },
    night: { sp: '#ffd67a', ss: '#ffb547', sg: 'rgba(255, 214, 140, 0.55)', sh: 'rgba(255, 214, 140, 0.24)' },
};
const CLOUD_PHASE: Record<SkyPhase, Record<string, string>> = {
    day: { cf: 'rgba(214, 226, 242, 0.85)', cm: 'rgba(232, 239, 248, 0.92)', cn: 'rgba(248, 250, 253, 0.96)' },
    dawn: { cf: 'rgba(214, 226, 242, 0.85)', cm: 'rgba(232, 239, 248, 0.92)', cn: 'rgba(255, 234, 228, 0.94)' },
    dusk: { cf: 'rgba(214, 226, 242, 0.85)', cm: 'rgba(236, 210, 214, 0.9)', cn: 'rgba(255, 226, 214, 0.94)' },
    night: { cf: 'rgba(96, 108, 132, 0.7)', cm: 'rgba(122, 134, 158, 0.78)', cn: 'rgba(150, 162, 186, 0.85)' },
};
const COLOR_VARS: Record<string, string> = {
    sp: '--weather-sun-primary', ss: '--weather-sun-secondary', sg: '--weather-sun-glow', sh: '--weather-sun-halo',
    cf: '--awc-cloud-far', cm: '--awc-cloud-mid', cn: '--awc-cloud-near',
};
const SKY_KEYS = ['top', 'mid', 'bottom', 'glow', 'scrim'] as const;
const NUMS = ['sun', 'drop', 'rain', 'snow', 'sleet', 'clouds', 'fog', 'wind', 'lightning', 'stars'] as const;
type Picture = { sky: Record<string, Lab>; cols: Record<string, Lab>; n: Record<string, number> };
const PHASE_LAB = {} as Record<SkyPhase, Record<string, Lab>>;
for (const ph of ['day', 'dawn', 'dusk', 'night'] as SkyPhase[]) {
    PHASE_LAB[ph] = {};
    for (const [k, v] of Object.entries({ ...SUN_PHASE[ph], ...CLOUD_PHASE[ph] })) PHASE_LAB[ph][k] = labOf(v);
}

export interface Ruler {
    pitch: number;
    el: HTMLElement;
    setOffset(px: number): void;
    /** The needle's capsule: it names the hour under the needle (0: "Now") and carries the sky's top colour */
    cap?: HTMLElement | null;
    select?(k: number): void;
    /** On while the slide is away from rest: labels that reach the capsule fade */
    lens?(on: boolean): void;
}

export interface SlideOptions {
    host: ForecastHost;
    root: HTMLElement;
    tl: Timeline;
    /** The hourly row; without it the rail is the ruler */
    ruler: Ruler | null;
    /** Where the rail goes, and its class */
    railHost?: HTMLElement | null;
    railClass?: string;
    sliderHost: HTMLElement;
    sliderLabel: string;
    valueText(slot: Slot | null, k: number): string;
    /** The readout: slot k (null: home, now) */
    onSlot(slot: Slot | null, k: number): void;
    onAway?(away: boolean): void;
    /** It's home and still: nothing of the hours is left on the card */
    onHome?(): void;
    /** Elements that cross with the words on the way home */
    group(): HTMLElement[];
    /** Elements that carry the sky's top colour (the chips' capsule) */
    mirror?(): HTMLElement[];
    /** ms; false never */
    idleHome?: number | false;
    disabled?(): boolean;
    /** The sun's drop, scaled (the tap view's tall sky) */
    dropScale?: number;
    /** The needle's time (ms) and the temperature there, every frame it moves; null once home (the days follow it) */
    onNeedle?(at: number | null, temperature: number | null): void;
}

export interface Slide {
    slider: HTMLElement;
    /** Slots from now under the needle (0 at home) */
    slots(): number;
    away(): boolean;
    active(): boolean;
    home(instant?: boolean): void;
    /** Park at a slot at once (the view opening where the card was) */
    park(slots: number): void;
    /** Follow another card's needle (ms); null: home with it */
    follow(at: number | null): void;
    rebuild(): void;
    destroy(): void;
}

export function attachSlide(o: SlideOptions): Slide {
    const { host, root, tl } = o;
    const sky = root.querySelector('.sky') as HTMLElement | null;
    const still = () => reducedMotion() || host.still();
    const cleanup: Array<() => void> = [];
    const on = (el: EventTarget, ev: string, fn: EventListener, opt?: AddEventListenerOptions | boolean) => { el.addEventListener(ev, fn, opt); cleanup.push(() => el.removeEventListener(ev, fn, opt)); };
    const slotHours = tl.slotMs / 3600_000;
    const state = {
        offset: 0, v: 0, raw: 0,
        dragging: false, active: false, k: -1, settling: false, settleTo: 0, settleTau: 0, parked: false, following: false,
        lastWet: null as boolean | null, prewarmed: false, stopTimer: 0, idleTimer: 0, pointer: false, keyboard: false, swallow: false,
    };
    let rel: { x0: number; p: number; vp: number; from: Picture; swapped: boolean; hadSlot: boolean } | null = null;

    // ── The ruler: the hourly row when it's there; else the divider's rail (the row, collapsed) ──
    const ext = o.ruler;
    let rail: HTMLElement | null = null, railRuler: HTMLElement | null = null;
    /** px a slot: the row's pitch; on the rail, 25.9 px an hour, or five days across */
    const pxPerSlot = () => {
        if (ext) return ext.pitch * slotHours;
        if (tl.unit === 'hour') return SLIDE.railHourPx;
        const w = (o.railHost?.clientWidth || root.clientWidth) || 313;
        return w / (tl.unit === 'half' ? 10 : 5);
    };
    let pxs = pxPerSlot();
    if (!ext && o.railHost) {
        rail = document.createElement('div');
        rail.className = `awc-rail ${o.railClass ?? ''}`;
        rail.setAttribute('aria-hidden', 'true');
        rail.innerHTML = '<div class="awc-ticks"><div class="awc-ruler"></div></div><div class="awc-needle"><i></i></div>';
        o.railHost.append(rail);
        railRuler = rail.querySelector('.awc-ruler');
    }
    function buildRail() {
        pxs = pxPerSlot();
        if (!railRuler) return;
        const frag = document.createDocumentFragment();
        const xOf = (k: number) => k * pxs;
        // The rain ahead, lit on the rail; ticks hang from it at the gear
        let runStart: number | null = null;
        tl.slots.forEach((s, i) => {
            const wet = isWet(s);
            if (wet && runStart === null) runStart = i;
            const last = i === tl.slots.length - 1;
            if (runStart !== null && (!wet || last)) {
                const x0 = Math.max(0, xOf(runStart) - pxs / 2), x1 = xOf(wet && last ? i + 1 : i) - pxs / 2;
                if (x1 > x0 + 4) { const r = document.createElement('i'); r.className = 'awc-run'; r.style.left = `${x0}px`; r.style.width = `${x1 - x0}px`; frag.append(r); }
                runStart = null;
            }
        });
        tl.slots.forEach((s, i) => {
            if (i === 0) return;
            const t = document.createElement('i');
            t.className = 'awc-tick' + (tl.unit !== 'hour' || s.at.getHours() === 0 ? ' major' : '');
            t.style.left = `${xOf(i)}px`;
            frag.append(t);
        });
        railRuler.replaceChildren(frag);
    }

    // ── Keys and screen readers: a slider over the ruler ──
    const slider = document.createElement('div');
    slider.className = 'awc-slider';
    slider.tabIndex = 0;
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-label', o.sliderLabel);
    slider.setAttribute('aria-valuemin', '0');
    const maxK = () => Math.max(0, Math.min(47, tl.length - 1));
    slider.setAttribute('aria-valuemax', String(maxK()));
    slider.setAttribute('aria-valuenow', '0');
    slider.setAttribute('aria-valuetext', o.valueText(null, 0));
    o.sliderHost.append(slider);
    root.dataset.slide = '';

    // ── The layers: pre-warm what the hours ahead need. Invisible: the write that hides a layer has no transition. ──
    const started: string[] = [];
    const activeAtHome: Record<string, boolean> = {};
    const needed = (() => {
        const need = new Set<string>();
        for (const s of tl.slots.slice(0, 48)) for (const name of Object.keys(LAYER_OF)) if ((LAYER_OF[name][s.cls] ?? 0) > 0) need.add(name);
        if (tl.unit === 'hour') need.add('stars');
        return need;
    })();
    async function prewarm() {
        clearTimeout(state.stopTimer);
        const layers = host.layers();
        if (state.prewarmed || !layers || still()) return;
        state.prewarmed = true;
        root.classList.add('awc-warm');
        for (const name of needed) {
            if (name === 'sun') continue;
            const a = layers.animations[name];
            if (!a || a.isActive) continue;
            const c = CONTAINER[name] ? root.querySelector(CONTAINER[name]) as HTMLElement | null : null;
            if (c) { c.style.transition = 'none'; c.style.opacity = '0'; void c.offsetWidth; }
            started.push(name);
            try { await layers.startAnimation(name, { intensity: 1 }); } catch { /* the card may refuse a layer */ }
            if (c) c.style.opacity = '0';
            if (name === 'stars') for (const el of root.querySelectorAll<HTMLElement>('.stars-field, .moon-gsap')) { window.AnimatedWeatherCardGsap?.killTweensOf?.(el); el.style.transition = 'none'; el.style.opacity = '0'; }
        }
    }
    function schedulePrewarmStop() {
        clearTimeout(state.stopTimer);
        state.stopTimer = window.setTimeout(async () => {
            if (state.active || state.dragging) return;
            const layers = host.layers();
            for (const name of started.splice(0)) {
                try { await layers?.stopAnimation(name); } catch { /* gone */ }
                const c = CONTAINER[name] ? root.querySelector(CONTAINER[name]) as HTMLElement | null : null;
                if (c) { c.style.opacity = ''; c.style.transition = ''; }
            }
            if (!activeAtHome.stars) for (const el of root.querySelectorAll<HTMLElement>('.stars-field, .moon-gsap')) { el.style.opacity = ''; el.style.transition = ''; }
            root.classList.remove('awc-warm');
            state.prewarmed = false;
        }, SLIDE.prewarmStop);
    }

    // ── Home: the card exactly as it is ──
    function readHome(): Picture {
        const cs = getComputedStyle(root);
        const skyLab: Record<string, Lab> = {};
        for (const k of SKY_KEYS) skyLab[k] = labOf(cs.getPropertyValue(`--awc-sky-${k}`) || '#000');
        const cols: Record<string, Lab> = {};
        for (const [k, v] of Object.entries(COLOR_VARS)) cols[k] = labOf(cs.getPropertyValue(v) || '#fff');
        const track = root.querySelector('.sun-track') as HTMLElement | null;
        let drop = 0;
        if (track) {
            const m = getComputedStyle(track).transform;
            const ty = m && m !== 'none' ? parseFloat(m.split(',')[5]) : 0;
            drop = track.clientHeight ? (ty / track.clientHeight) * 100 / (o.dropScale ?? 1) : 0;
        }
        // The sun as the card shows it now: its class's opacity, none under fog, rain or at night
        const sunEl = track?.querySelector('.sun') as HTMLElement | null;
        const sun = sunEl ? parseFloat(getComputedStyle(sunEl).opacity) : 0;
        const n: Record<string, number> = { sun: Number.isFinite(sun) ? sun : 0, drop };
        const layers = host.layers();
        for (const name of [...LAYER_NAMES, 'stars']) {
            activeAtHome[name] = !!layers?.animations[name]?.isActive && !started.includes(name);
            n[name] = activeAtHome[name] ? 1 : 0;
        }
        return { sky: skyLab, cols, n };
    }
    let home: Picture | null = null;

    // ── The picture for a slot: its middle, its condition; the slot under way is home ──
    const sun = sunModel(host.hass(), host.config().sun_entity || 'sun.sun');
    const skyLabCache = new Map<string, Record<string, Lab>>();
    const skyLabOf = (cls: string, phase: SkyPhase) => {
        const key = `${cls}/${phase}`;
        if (!skyLabCache.has(key)) {
            const c = host.skyColors(cls as SkyCondition, phase) as unknown as Record<string, string>;
            const out: Record<string, Lab> = {};
            for (const k of SKY_KEYS) out[k] = labOf(c[k]);
            skyLabCache.set(key, out);
        }
        return skyLabCache.get(key)!;
    };
    const pictures = new Map<number, Picture>();
    function picture(k: number): Picture {
        if (k === 0 && home) return home;
        if (!pictures.has(k)) {
            const s = tl.slots[k];
            const at = new Date(s.at.getTime() + tl.slotMs / 2);
            const { elevation, rising } = tl.unit === 'hour' ? sun(at) : { elevation: 44, rising: false };
            const pw = phaseWeights(elevation, rising);
            const skyMix: Record<string, Lab> = {};
            for (const key of SKY_KEYS) skyMix[key] = [0, 0, 0, 0];
            const cols: Record<string, Lab> = {};
            for (const key of Object.keys(COLOR_VARS)) cols[key] = [0, 0, 0, 0];
            for (const ph of ['day', 'dawn', 'dusk', 'night'] as SkyPhase[]) {
                const w = pw[ph];
                if (w < 0.001) continue;
                const cls = s.cls === 'clear-night' && ph !== 'night' ? 'sunny' : s.cls === 'sunny' && ph === 'night' ? 'clear-night' : s.cls;
                const sl = skyLabOf(cls, ph);
                for (const key of SKY_KEYS) for (let i = 0; i < 4; i++) skyMix[key][i] += sl[key][i] * w;
                for (const key of Object.keys(COLOR_VARS)) for (let i = 0; i < 4; i++) cols[key][i] += PHASE_LAB[ph][key][i] * w;
            }
            const layer = (name: string) => LAYER_OF[name][s.cls] ?? 0;
            const n: Record<string, number> = {
                sun: layer('sun') * smooth(-2, 3, elevation), drop: sunDrop(elevation),
                rain: layer('rain'), snow: layer('snow'), sleet: layer('sleet'), clouds: layer('clouds'), fog: layer('fog'), wind: layer('wind'), lightning: layer('lightning'),
                stars: layer('stars') * pw.night,
            };
            pictures.set(k, { sky: skyMix, cols, n });
        }
        return pictures.get(k)!;
    }
    const slotsAt = (px: number) => clamp(px / pxs, 0, maxK());
    /** The nearest sample, everywhere: the slot whose column is under the needle */
    const slotOf = (px: number) => Math.round(slotsAt(px));
    function blend(a: Picture, b: Picture, w: number): Picture {
        const out: Picture = { sky: {}, cols: {}, n: {} };
        for (const k of SKY_KEYS) out.sky[k] = a.sky[k].map((v, i) => v + (b.sky[k][i] - v) * w) as Lab;
        for (const k of Object.keys(COLOR_VARS)) out.cols[k] = a.cols[k].map((v, i) => v + (b.cols[k][i] - v) * w) as Lab;
        for (const k of NUMS) out.n[k] = a.n[k] + (b.n[k] - a.n[k]) * w;
        return out;
    }
    /** What the hours want at the needle: the nearest slot's picture, crossing to its neighbour around the midpoint */
    function target(px: number): Picture {
        const h = slotsAt(px);
        const lo = Math.floor(h), f = h - lo;
        const a = picture(Math.min(tl.length - 1, lo)), b = picture(Math.min(tl.length - 1, lo + 1));
        if (still()) return f < 0.5 ? a : b;                 // reduced motion: the sky steps with the hour
        const w = smooth(0.3, 0.7, f);
        if (w < 0.0005 || a === b) return a;
        if (w > 0.9995) return b;
        return blend(a, b, w);
    }

    // ── Drawing ──
    let vis: Picture | null = null, delta = 0;
    /** The sky as written, for the page */
    let skyCss: Record<string, string> | null = null;
    const snapshot = (src: Picture): Picture => ({
        sky: Object.fromEntries(SKY_KEYS.map(k => [k, [...src.sky[k]] as Lab])),
        cols: Object.fromEntries(Object.keys(COLOR_VARS).map(k => [k, [...src.cols[k]] as Lab])),
        n: { ...src.n },
    });
    function enter() {
        if (state.active) return;
        state.active = true;
        home = readHome();
        pictures.clear();
        // The pull's sun starts where the card's is, before the class that hands it to the slide
        const track = root.querySelector('.sun-track') as HTMLElement | null;
        track?.style.setProperty('--awc-pull-sun', clamp(home.n.sun).toFixed(3));
        root.classList.add('awc-pulling');
        ext?.lens?.(true);
        pxs = pxPerSlot();
        void prewarm();
    }
    function write() {
        if (!vis) return;
        skyCss = {};
        for (const k of SKY_KEYS) {
            skyCss[k] = cssOf(vis.sky[k]);
            if (sky) sky.style.setProperty(`--awc-sky-${k}`, skyCss[k]);
        }
        const top = cssOf(vis.sky.top);
        for (const el of o.mirror?.() ?? []) el.style.setProperty('--awc-sky-top', top);
        ext?.cap?.style.setProperty('--awc-sky-top', top);
        for (const [k, v] of Object.entries(COLOR_VARS)) root.style.setProperty(v, cssOf(vis.cols[k]));
        const track = root.querySelector('.sun-track') as HTMLElement | null;
        if (track) {
            track.style.transform = `translate3d(0, ${(vis.n.drop * (o.dropScale ?? 1)).toFixed(2)}%, 0)`;
            track.style.setProperty('--awc-pull-sun', clamp(vis.n.sun).toFixed(3));
        }
        for (const name of LAYER_NAMES) { const c = root.querySelector(CONTAINER[name]) as HTMLElement | null; if (c) c.style.opacity = clamp(vis.n[name]).toFixed(3); }
        for (const el of root.querySelectorAll<HTMLElement>('.stars-field, .moon-gsap')) el.style.opacity = clamp(vis.n.stars).toFixed(3);
    }
    /** Under the finger: a 180 ms time constant on every output. On the way home: straight from what was visible, by p. */
    function stepSky(dt: number) {
        if (!home) home = readHome();
        if (!vis) vis = snapshot(home);
        let d = 0;
        if (rel) {
            const p = rel.p;
            for (const k of SKY_KEYS) for (let i = 0; i < 4; i++) vis.sky[k][i] = rel.from.sky[k][i] + (home.sky[k][i] - rel.from.sky[k][i]) * p;
            for (const k of Object.keys(COLOR_VARS)) for (let i = 0; i < 4; i++) vis.cols[k][i] = rel.from.cols[k][i] + (home.cols[k][i] - rel.from.cols[k][i]) * p;
            for (const k of NUMS) vis.n[k] = rel.from.n[k] + (home.n[k] - rel.from.n[k]) * p;
            d = 1 - p;
        } else {
            const tgt = target(state.offset);
            const a = still() ? 1 : 1 - Math.exp(-dt / SLIDE.skyTau);
            const go = (cur: number, t: number, scale = 1) => { const x = cur + (t - cur) * a; d = Math.max(d, Math.abs(t - x) / scale); return x; };
            for (const k of SKY_KEYS) for (let i = 0; i < 4; i++) vis.sky[k][i] = go(vis.sky[k][i], tgt.sky[k][i]);
            for (const k of Object.keys(COLOR_VARS)) for (let i = 0; i < 4; i++) vis.cols[k][i] = go(vis.cols[k][i], tgt.cols[k][i]);
            for (const k of NUMS) vis.n[k] = go(vis.n[k], tgt.n[k], k === 'drop' ? 26 : 1);
        }
        delta = d;
        write();
    }
    // ── The page follows the needle: the time under it, the temperature there, the sky ──
    const link = host.surface !== 'view' && tl.unit === 'hour'
        ? { entity: host.config().entity ?? '', sun: host.config().sun_entity || 'sun.sun' } : null;
    let linked = false;
    /** Between now's reading and the next hour's value in the first hour, between two hours' values after it */
    function temperatureAt(h: number): number | null {
        const lo = Math.floor(h), f = h - lo;
        const now = host.current();
        const a = lo === 0 && typeof now === 'number' ? now : tl.slots[lo]?.temperature;
        const b = tl.slots[Math.min(tl.length - 1, lo + 1)]?.temperature;
        if (typeof a !== 'number') return null;
        return typeof b === 'number' ? a + (b - a) * f : a;
    }
    function emit() {
        if (!link || state.following) return;
        const h = slotsAt(state.offset);
        linked = true;
        sendHour({
            source: host.element, ...link, at: Date.now() + h * tl.slotMs, temperature: temperatureAt(h),
            sky: host.config().color_palette === 'theme' ? null : skyCss,
        });
    }
    function emitHome() {
        if (!link || !linked) return;
        linked = false;
        sendHour({ source: host.element, ...link, at: null, temperature: null, sky: null });
    }
    const groupOpacity = (v: number | null) => { for (const el of o.group()) el.style.opacity = v === null ? '' : v.toFixed(3); };
    function showSlot(k: number) {
        const s = k === 0 ? null : tl.slots[k];
        ext?.select?.(k);
        o.onSlot(s, k);
        slider.setAttribute('aria-valuenow', String(k));
        slider.setAttribute('aria-valuetext', o.valueText(s, k));
        o.onAway?.(k !== 0);
    }
    function draw(dt: number) {
        if (ext) ext.setOffset(state.offset);
        else if (railRuler) railRuler.style.transform = `translate3d(${(-state.offset).toFixed(2)}px, 0, 0)`;
        stepSky(dt);
        emit();
        if (o.onNeedle) { const h = slotsAt(state.offset); o.onNeedle(Date.now() + h * tl.slotMs, temperatureAt(h)); }
        // On the way home the capsule counts the hours back as they pass under it, and is "Now" once the words have crossed
        if (rel) ext?.select?.(rel.swapped ? 0 : slotOf(state.offset));
        // The readout follows the needle: while held, while settling, and on the keys
        if (!rel) {
            const k = slotOf(state.offset);
            if (k !== state.k) {
                const prev = state.k;
                state.k = k;
                showSlot(k);
                // Detents, not a buzz: a tick per hour crossed, a firmer one where the rain starts or stops
                const wet = isWet(tl.slots[k]);
                if (prev !== -1 && state.pointer) haptic(state.lastWet !== null && wet !== state.lastWet ? 'light' : 'selection');
                state.lastWet = wet;
            }
        }
    }
    function leave() {
        Object.assign(state, { active: false, settling: false, parked: false, dragging: false, keyboard: false, following: false, k: -1, offset: 0, v: 0, raw: 0 });
        rel = null;
        root.classList.remove('awc-pulling', 'awc-dial', 'awc-held');
        if (ext) { ext.setOffset(0); ext.lens?.(false); } else if (railRuler) railRuler.style.transform = '';
        if (sky) for (const k of SKY_KEYS) sky.style.removeProperty(`--awc-sky-${k}`);
        for (const el of o.mirror?.() ?? []) el.style.removeProperty('--awc-sky-top');
        ext?.cap?.style.removeProperty('--awc-sky-top');
        for (const v of Object.values(COLOR_VARS)) root.style.removeProperty(v);
        const track = root.querySelector('.sun-track') as HTMLElement | null;
        if (track) { track.style.transform = ''; track.style.removeProperty('--awc-pull-sun'); }
        for (const name of LAYER_NAMES) { const c = root.querySelector(CONTAINER[name]) as HTMLElement | null; if (c) c.style.opacity = started.includes(name) ? '0' : ''; }
        for (const el of root.querySelectorAll<HTMLElement>('.stars-field, .moon-gsap')) el.style.opacity = started.includes('stars') ? '0' : '';
        vis = null;
        home = null;
        skyCss = null;
        groupOpacity(null);
        clearTimeout(state.idleTimer);
        schedulePrewarmStop();
        emitHome();
        o.onNeedle?.(null, null);
        o.onAway?.(false);
        o.onHome?.();
    }

    // ── The loop: runs only while something moves ──
    let raf = 0, last = 0;
    function loop(ts: number) {
        try {
            const dt = Math.min(0.05, last ? (ts - last) / 1000 : 1 / 60);
            last = ts;
            if (rel) {
                // Home: one spring, one progress. The needle never passes now.
                if (still()) { rel.p = 1; rel.vp = 0; } else { [rel.p, rel.vp] = spring(rel.p, rel.vp, 1, SLIDE.home, dt); if (rel.p >= 1) { rel.p = 1; rel.vp = 0; } }
                state.offset = rel.x0 * (1 - rel.p);
                if (rel.hadSlot) {
                    if (!rel.swapped && rel.p >= SLIDE.wordsSwap) { rel.swapped = true; showSlot(0); }
                    // Never a blank frame: the hour's words hold their light and drop late (1 - x²), now's rise at once (1 - (1 - x)²)
                    const x = clamp(rel.swapped ? (rel.p - SLIDE.wordsSwap) / (SLIDE.wordsInEnd - SLIDE.wordsSwap) : rel.p / SLIDE.wordsOutEnd);
                    groupOpacity(clamp(rel.swapped ? 1 - (1 - x) * (1 - x) : 1 - x * x, 0.02, 1));
                }
            } else if (state.settling) {
                if (still()) { state.offset = state.settleTo; state.v = 0; }
                else if (state.settleTau > 0) {
                    // A flick: the list's own deceleration, landing exactly on the hour it was heading for
                    const d = state.settleTo - state.offset;
                    state.offset = state.settleTo - d * Math.exp(-dt / state.settleTau);
                    state.v = d / state.settleTau;
                } else [state.offset, state.v] = spring(state.offset, state.v, state.settleTo, SLIDE.home, dt);
            }
            draw(dt);
            if (rel && rel.p > 0.9995 && delta < 0.002) { raf = 0; last = 0; leave(); return; }
            if (state.settling && Math.abs(state.offset - state.settleTo) < 0.25 && Math.abs(state.v) < 4 && delta < 0.002) {
                state.offset = state.settleTo; state.v = 0; state.settling = false;
                draw(0);
                raf = 0; last = 0;
                if (Math.round(state.settleTo / pxs) === 0) { groupOpacity(null); leave(); } else park_();
                return;
            }
            if (!state.settling && !rel && !state.dragging && delta < 0.002) { raf = 0; last = 0; return; }
            if (state.keyboard && !state.pointer && !state.settling && !rel && delta < 0.002) { raf = 0; last = 0; return; }
            raf = requestAnimationFrame(loop);
        } catch (e) { raf = 0; console.error('Animated Weather Card: slide', e); }
    }
    const kick = () => { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } };
    function park_() {
        state.parked = true;
        root.classList.remove('awc-held');
        armIdle();
    }

    // ── The gesture ──
    const maxPx = () => maxK() * pxs;
    function setRaw(raw: number) {
        state.raw = raw;
        const max = maxPx();
        state.offset = raw < 0 ? rubber(raw) : raw > max ? max + rubber(raw - max) : raw;
    }
    const gesture = root;
    let start: { x: number; y: number; id: number; claimed: boolean; base: number; slop: number; caught?: boolean } | null = null;
    let samples: Array<{ x: number; t: number }> = [];
    on(gesture, 'pointerdown', ((e: PointerEvent) => {
        if (!e.isPrimary || e.button > 0 || start || o.disabled?.()) return;
        // A control of its own (the Now control, a link): never the slide's, even while it moves
        if (e.composedPath().some(n => n instanceof Element && n.matches('a, .awc-noclaim'))) return;
        const moving = state.active && !state.dragging && (rel || state.settling);
        if (moving) {
            // Caught: it stops this frame, the needle's hour comes back, and it tracks from where it is.
            // The press is the slide's, never a tap on the card (this listens before the card's actions do)
            e.stopPropagation();
            rel = null; state.settling = false; state.settleTau = 0; lead();
            state.dragging = true; state.v = 0; state.raw = state.offset; state.k = -1;
            groupOpacity(null);
            root.classList.add('awc-dial', 'awc-held');
            state.swallow = true;
            clearTimeout(state.idleTimer);
            start = { x: e.clientX, y: e.clientY, id: e.pointerId, claimed: false, base: state.offset, slop: SLIDE.catchPx, caught: true };
            try { gesture.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
            kick();
            return;
        }
        // Left at an hour, or following another card's: the drag continues from the hour it shows
        start = { x: e.clientX, y: e.clientY, id: e.pointerId, claimed: false, base: state.parked || state.following ? state.offset : 0, slop: SLIDE.slopPx };
        void prewarm();
    }) as EventListener, true);
    on(gesture, 'pointermove', ((e: PointerEvent) => {
        if (!start || e.pointerId !== start.id) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (!start.claimed) {
            if (Math.abs(dx) > start.slop && (start.caught || Math.abs(dx) > SLIDE.angle * Math.abs(dy))) {
                start.claimed = true; start.x = e.clientX;
                try { gesture.setPointerCapture(e.pointerId); } catch { /* synthetic */ }
                if (!start.caught) claim(start.base);
                state.pointer = true;
            } else if (!start.caught && Math.abs(dy) > SLIDE.slopPx) { start = null; if (!state.active) schedulePrewarmStop(); }
            return;
        }
        e.preventDefault();
        setRaw(start.base + (start.x - e.clientX));
        samples.push({ x: e.clientX, t: e.timeStamp });
        while (samples.length > 12) samples.shift();
        kick();
    }) as EventListener);
    const end = ((e?: PointerEvent) => {
        if (!start || (e && e.pointerId !== start.id)) return;
        if (start.claimed || start.caught) {
            // Velocity from the last 80 ms only: a lift after a rest starts at zero
            const t1 = e?.timeStamp ?? performance.now();
            let recent = samples.filter(s => t1 - s.t <= SLIDE.velocityWindow);
            // Sparse events (a slow device, a busy page): the last two, if the finger was still moving at the lift
            if (recent.length < 2 && samples.length >= 2) {
                const [p, q] = samples.slice(-2);
                if (t1 - q.t <= SLIDE.velocityWindow && q.t - p.t <= 100) recent = [p, q];
            }
            const a = recent[0], b = recent[recent.length - 1];
            const v = a && b && b.t - a.t > 8 ? -(b.x - a.x) / ((b.t - a.t) / 1000) : 0;
            release(v);
        } else if (!state.active) schedulePrewarmStop();
        start = null; samples = []; state.pointer = false;
    }) as EventListener;
    on(gesture, 'pointerup', end);
    on(gesture, 'pointercancel', end);
    // A click that ended a pull is not a tap
    on(gesture, 'click', ((e: Event) => { if (state.swallow) { e.stopPropagation(); e.preventDefault(); state.swallow = false; } }) as EventListener, true);

    /** A hand on a card that follows: from here it leads, and the card it followed follows it */
    function lead() { state.following = false; }
    function claim(base = 0) {
        lead();
        Object.assign(state, { dragging: true, settling: false, settleTau: 0, parked: false, swallow: true, v: 0, raw: base });
        rel = null;
        clearTimeout(state.idleTimer);
        enter();
        root.classList.add('awc-dial', 'awc-held');
        kick();
    }
    /** Let go: it stays. A slow lift settles on the nearest hour; a flick carries on and lands on the hour it was heading for. */
    function release(vPx: number) {
        if (!state.active) return;
        setTimeout(() => { state.swallow = false; }, 0);
        state.dragging = false; state.keyboard = false;
        const carry = Math.abs(vPx) > 120 ? vPx * SLIDE.momentum : 0;
        const to = clamp(Math.round((state.offset + carry) / pxs), 0, maxK());
        state.settleTo = to * pxs;
        const d = state.settleTo - state.offset;
        // A flick that heads where it lands decelerates into it; anything else springs to the nearest hour
        state.settleTau = carry && Math.sign(d) === Math.sign(vPx) && Math.abs(vPx) > 1 ? clamp(d / vPx, 0.12, 0.6) : 0;
        state.v = state.settleTau ? vPx : 0;
        state.settling = true; state.raw = state.settleTo;
        root.classList.remove('awc-held');
        kick();
    }
    /**
     * Home on one spring: from what is visible straight to now. A card that follows and is sent home by a hand (its Now
     * control, its keys) leads the way, so the card it followed comes home with it; one that's brought home by the card
     * it follows, or at once (scrolled away, a new forecast), keeps following.
     */
    function goHome(instant = false, byHand = true) {
        clearTimeout(state.idleTimer);
        if (!state.active) return;
        if (byHand && !instant && state.following) { lead(); linked = true; }
        if (instant || !host.seen()) { rel = null; cancelAnimationFrame(raf); raf = 0; showSlot(0); leave(); return; }
        const hadSlot = state.k > 0;
        Object.assign(state, { dragging: false, keyboard: false, settling: false, settleTau: 0, parked: false });
        root.classList.remove('awc-held', 'awc-dial');
        if (!home) home = readHome();
        if (!vis) vis = snapshot(home);
        const x0 = state.offset;
        rel = { x0, p: 0, vp: 0, from: snapshot(vis), swapped: !hadSlot, hadSlot };
        state.raw = 0; state.k = -1;
        if (!hadSlot) showSlot(0);
        else if (still()) {
            // Reduced motion: one frame home, the words fade in over 120 ms
            rel.swapped = true; rel.hadSlot = false; showSlot(0);
            for (const el of o.group()) el.animate?.([{ opacity: 0 }, { opacity: 1 }], { duration: 120, easing: 'linear' });
        }
        kick();
    }
    function armIdle() {
        clearTimeout(state.idleTimer);
        const ms = o.idleHome === undefined ? SLIDE.idleHome : o.idleHome;
        if (ms === false) return;
        state.idleTimer = window.setTimeout(() => { if (state.parked && !state.dragging) goHome(); }, ms);
    }

    // Keys: an hour per arrow, three per page, no tween; it stays. Home and Escape come home.
    on(slider, 'keydown', ((e: KeyboardEvent) => {
        const step = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 3, PageDown: -3 } as Record<string, number>)[e.key];
        if (step) {
            e.preventDefault();
            const cur = state.active ? Math.round(state.offset / pxs) : 0;
            const k = clamp(cur + step, 0, maxK());
            if (state.following) { lead(); linked = true; }
            if (!state.active) enter();
            rel = null; Object.assign(state, { settling: false, settleTau: 0, dragging: false, keyboard: true });
            groupOpacity(null);
            root.classList.add('awc-dial');
            setRaw(k * pxs);
            // The words and the slider's value move with the key, at once; the sky follows on its own time
            draw(0);
            if (k === 0) { leave(); return; }
            park_();
            kick();
        } else if (e.key === 'Home' || e.key === 'Escape') {
            if (state.active) { e.preventDefault(); e.stopPropagation(); goHome(); }
        }
    }) as EventListener);
    on(slider, 'focus', () => { if (slider.matches(':focus-visible')) root.classList.add('awc-focus'); });
    on(slider, 'blur', () => { root.classList.remove('awc-focus'); if (!state.active) root.classList.remove('awc-dial'); });

    // Trackpads: a two-finger sideways swipe scrubs 1:1 (each event at most 60 px); it stays where it's left
    let wheelTimer = 0;
    on(gesture, 'wheel', ((e: WheelEvent) => {
        if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || o.disabled?.()) return;
        e.preventDefault();
        if (!state.dragging) claim(state.active ? state.offset : 0);
        setRaw(clamp((state.raw || 0) + clamp(e.deltaX, -SLIDE.wheelClamp, SLIDE.wheelClamp), -40, maxPx() + 40));
        kick();
        clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => release(0), SLIDE.wheelRest);
    }) as EventListener, { passive: false });

    /**
     * Another card's needle on the same weather: the ruler goes to its time at once, as a finger would take it, and the
     * sky, the sun and the readout follow on their own time. Never while a hand is on this one.
     */
    function follow(at: number | null) {
        if (state.dragging || (state.keyboard && document.activeElement === slider)) return;
        // Home with the card it follows: that card's way home brought the ruler and the sky here already, so it's home at once
        if (at === null) { if (state.active && state.following) goHome(!host.seen() || Math.abs(state.offset) < 1, false); return; }
        if (!state.active) enter();
        // It was leading (left at an hour of its own): it follows now, and it's the other card that will say it's home
        state.following = true; linked = false;
        rel = null; groupOpacity(null);
        Object.assign(state, { settling: false, settleTau: 0, parked: false, v: 0 });
        clearTimeout(state.idleTimer);
        root.classList.add('awc-dial');
        setRaw(clamp(((at - Date.now()) / tl.slotMs) * pxs, 0, maxPx()));
        kick();
    }
    const unfollow = link ? onHour(l => { if (l.source !== host.element && l.entity === link.entity) follow(l.at); }) : null;
    if (unfollow) cleanup.push(unfollow);

    let roRaf = 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => { cancelAnimationFrame(roRaf); roRaf = requestAnimationFrame(() => { if (!state.active) buildRail(); }); }) : null;
    ro?.observe(root);
    buildRail();

    return {
        slider,
        slots: () => (state.active ? Math.round(state.offset / pxs) : 0),
        away: () => state.active,
        active: () => state.active,
        home: (instant?: boolean) => goHome(instant),
        follow,
        park(k: number) {
            if (k <= 0) return;
            enter();
            setRaw(clamp(k, 0, maxK()) * pxs);
            vis = snapshot(target(state.offset));
            draw(0);
            park_();
        },
        rebuild: buildRail,
        destroy() {
            cancelAnimationFrame(raf); raf = 0; cancelAnimationFrame(roRaf);
            clearTimeout(state.stopTimer); clearTimeout(wheelTimer); clearTimeout(state.idleTimer);
            ro?.disconnect();
            if (state.active) leave();
            for (const f of cleanup.splice(0)) f();
            rail?.remove(); slider.remove();
            const layers = host.layers();
            if (layers) for (const name of started.splice(0)) { layers.stopAnimation(name).catch(() => {}); }
            root.classList.remove('awc-warm');
            delete root.dataset.slide;
        },
    };
}
