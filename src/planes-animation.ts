// PlanesAnimation - planes flying across the card, driven by Flightradar24 data.
//
// Unlike the weather animations, planes aren't tied to a weather condition.
// The card owns this instance directly instead of going through the
// controller's condition mapping (which stops every animation on each
// condition change), and calls `flyOver()` whenever FlightTracker reports
// new arrivals. Between fly-overs the animation is idle.
//
// It ships in its own bundle, animated-weather-card-planes.js, which only
// cards with a flights sensor (or dev mode) load. Each flight is drawn as
// its aircraft's family (aircraft.ts), from the type code it reports.

import { BaseAnimation, BaseAnimationConfig, AnimationLifecycleState } from './base-animation';
import { AnimatedWeatherCardConfig, GSAPTimeline } from './types';
import { FlightInfo, planFlyover } from './flight-tracker';
import { devLog } from './utils';
import { FORWARD_PITCH_DEG, aircraftDrawing, aircraftFamily, aircraftLength, planeLengthPx } from './aircraft';

export interface FlyoverOptions {
    /** A night sky: a faint silhouette, and the aircraft's lights. */
    night: boolean;
    /** Show a tag beside the plane. */
    showLabels: boolean;
    /** What the tag says: "flight · aircraft" (default), the route ("Lisbon → Paris"), or the route over the flight */
    labelMode?: 'flight' | 'route' | 'both';
    /** How fast planes cross, as a share of their usual pace (plane_speed): 0.5 takes twice as long */
    speed?: number;
}

/** plane_speed, kept to 0.25 to 2; anything else flies at the usual pace */
export function planeSpeed(v: unknown): number {
    const n = typeof v === 'number' ? v : Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(2, Math.max(0.25, n)) : 1;
}

/** The route's two ends: cities when both are known, else airport codes, else none (a flight with no route keeps its number) */
export function routeOf(f: FlightInfo, short = false): string {
    const city = f.originCity && f.destinationCity ? `${f.originCity} → ${f.destinationCity}` : '';
    const code = f.originCode && f.destinationCode ? `${f.originCode} → ${f.destinationCode}` : '';
    return short ? code || city : city || code;
}

/** A city route wider than this share of the card flies as airport codes, so it reaches open sky before the plane leaves */
export const ROUTE_MAX_SHARE = 0.42;

/** Most planes on the card at once; arrivals beyond this are skipped. */
export const MAX_CONCURRENT_PLANES = 3;
/** Gap between planes that arrive in the same update. */
export const PLANE_STAGGER_MS = 2500;

/** How long an A320 looks at the size scale of 1 (other aircraft by their length) */
const PLANE_WIDTH_PX = 56;
/** Clearance between the end of the hero text and a label that shows beside it. */
const LABEL_CLEARANCE_PX = 16;
/** Approximate label line height, for working out which hero lines it would cross. */
const LABEL_HEIGHT_PX = 12;
const LABEL_FADE_SEC = 0.6;
/** The plane steps back while it passes behind the hero text, then comes forward again. */
const PLANE_BEHIND_TEXT_OPACITY = 0.35;
const PLANE_DIM_SEC = 0.5;
/** Start/end this far past the card edge so the plane and its tag enter fully hidden. */
const OFFSCREEN_MARGIN_PX = 110;
/** Gap between the plane and its tag. */
const LABEL_GAP_PX = 6;
const FADE_SEC = 1.5;

export class PlanesAnimation extends BaseAnimation {
    public readonly animationType = 'planes';
    public readonly layerSelector = '.planes-layer';
    public readonly containerSelector = undefined;

    private timelines = new Map<HTMLElement, GSAPTimeline>();

    constructor(
        element: HTMLElement,
        config: BaseAnimationConfig,
        cardConfig: AnimatedWeatherCardConfig,
        _realWindSpeed?: number
    ) {
        super(element, config, cardConfig);
    }

    /** Number of planes currently crossing the card. */
    public get activePlaneCount(): number {
        return this.particles.length;
    }

    /**
     * Fly each flight across the card once. Flights arriving together are
     * staggered so they don't overlap at the edge.
     */
    public flyOver(flights: FlightInfo[], options: FlyoverOptions): void {
        flights.forEach((flight, i) => {
            if (i === 0) {
                this.launch(flight, options);
                return;
            }
            this.addTimeout(window.setTimeout(() => this.launch(flight, options), i * PLANE_STAGGER_MS));
        });
    }

    protected async onStart(): Promise<void> {
        // Idle until flyOver() is called.
    }

    protected async onStop(): Promise<void> {
        this.timelines.forEach(tl => tl.kill());
        this.timelines.clear();

        const layer = this.element.querySelector(this.layerSelector);
        layer?.querySelectorAll('.plane-gsap').forEach(p => {
            if (window.AnimatedWeatherCardGsap) window.AnimatedWeatherCardGsap.killTweensOf(p);
            p.remove();
        });
    }

    protected async onPause(): Promise<void> {
        this.timelines.forEach(tl => tl.pause());
    }

    protected async onResume(): Promise<void> {
        this.timelines.forEach(tl => tl.resume());
    }

    /**
     * Where open sky starts for a label flying between `top` and `bottom`
     * (layer pixels): just past the right edge of the furthest hero text
     * line that overlaps that band, or 0 if none does.
     */
    private heroClearX(layer: HTMLElement, top: number, bottom: number): number {
        const origin = layer.getBoundingClientRect();
        let clearX = 0;
        this.element.querySelectorAll('.main-weather-info > *').forEach(line => {
            const r = line.getBoundingClientRect();
            if (r.width === 0 || r.height === 0) return;
            const lineTop = r.top - origin.top;
            const lineBottom = r.bottom - origin.top;
            if (lineBottom < top || lineTop > bottom) return;
            clearX = Math.max(clearX, r.right - origin.left + LABEL_CLEARANCE_PX);
        });
        return clearX;
    }

    private launch(flight: FlightInfo, options: FlyoverOptions): boolean {
        // Staggered launches can land after a pause or stop; drop them.
        if (this.state !== AnimationLifecycleState.ACTIVE || !window.AnimatedWeatherCardGsap) return false;
        if (this.particles.length >= MAX_CONCURRENT_PLANES) {
            devLog(this.config.devMode, `Skipping fly-over for ${flight.id}: ${MAX_CONCURRENT_PLANES} planes already on the card`);
            return false;
        }
        const layer = this.element.querySelector(this.layerSelector) as HTMLElement | null;
        if (!layer) return false;

        // Slower or faster crossings: every timing below follows the plan's duration, the fades and the tag's included
        const base = planFlyover(flight);
        const plan = { ...base, durationSec: base.durationSec / planeSpeed(options.speed) };
        const family = aircraftFamily(flight.aircraftCode);
        const drawing = aircraftDrawing(family);
        // The drawing is wider than the aircraft where a propeller or rotor reaches past it
        const planeWidth = planeLengthPx(aircraftLength(flight.aircraftCode, family), plan.scale, PLANE_WIDTH_PX) / drawing.lengthFrac;
        const planeHeight = planeWidth * drawing.aspect;
        const layerWidth = layer.offsetWidth || this.element.offsetWidth || 400;
        const layerHeight = layer.offsetHeight || this.element.offsetHeight || 200;

        const plane = document.createElement('div');
        plane.className = ['plane-gsap', plan.direction === 1 ? 'eastbound' : 'westbound', options.night ? 'night' : '']
            .filter(Boolean).join(' ');
        plane.style.width = `${planeWidth}px`;
        plane.dataset.flightId = flight.id;
        plane.dataset.family = family;

        // At night, its lights where they really are (the near wingtip's
        // colour follows the direction, in CSS)
        const body = document.createElement('div');
        body.className = 'plane-body';
        body.innerHTML = drawing.svg + (options.night
            ? drawing.lights.map(l => `<span class="plane-light ${l.kind}" style="left:${l.left.toFixed(1)}%;top:${l.top.toFixed(1)}%"></span>`).join('')
            : '');
        plane.appendChild(body);

        const labelText = [flight.label, flight.aircraftCode].filter(Boolean).join(' · ');
        const mode = options.labelMode ?? 'flight';
        const route = mode === 'flight' ? '' : routeOf(flight);
        let label: HTMLElement | null = null;
        let routeEl: HTMLElement | null = null;
        if (options.showLabels && (labelText || route)) {
            label = document.createElement('div');
            label.className = 'plane-label';
            if (route) {
                // The route leads; with both, the flight sits under it, quieter. Text only, never markup.
                routeEl = document.createElement('span');
                routeEl.className = 'plane-route';
                routeEl.textContent = route;
                label.appendChild(routeEl);
                if (mode === 'both' && labelText) {
                    const sub = document.createElement('span');
                    sub.className = 'plane-flight';
                    sub.textContent = labelText;
                    label.appendChild(sub);
                }
            } else label.textContent = labelText;
            // Level with the fuselage, which sits below the middle of a drawing with a fin
            label.style.top = `${drawing.midTop.toFixed(1)}%`;
            plane.appendChild(label);
        }

        const leftX = -planeWidth - OFFSCREEN_MARGIN_PX;
        const rightX = layerWidth + OFFSCREEN_MARGIN_PX;
        const startX = plan.direction === 1 ? leftX : rightX;
        const endX = plan.direction === 1 ? rightX : leftX;

        // Flip only the silhouette so the label never reads mirrored. A
        // helicopter flies with its nose down.
        const pitch = (FORWARD_PITCH_DEG[family] ?? 0) * plan.direction;
        window.AnimatedWeatherCardGsap.set(body, { scaleX: plan.direction, rotation: plan.tiltDeg + pitch });
        window.AnimatedWeatherCardGsap.set(plane, {
            x: startX,
            y: (plan.startYPercent / 100) * layerHeight,
            opacity: 0,
        });

        layer.appendChild(plane);
        this.addParticle(plane);
        // A long city route on a narrow card flies as airport codes ("LIS → CDG"), which reach open sky sooner
        if (routeEl && routeEl.offsetWidth > layerWidth * ROUTE_MAX_SHARE) {
            const short = routeOf(flight, true);
            if (short) routeEl.textContent = short;
        }

        const fade = Math.min(FADE_SEC, plan.durationSec / 4);
        const tl = window.AnimatedWeatherCardGsap.timeline({
            onComplete: () => {
                this.timelines.delete(plane);
                plane.remove();
                this.removeParticle(plane);
            },
        });
        tl.to(plane, { x: endX, y: (plan.endYPercent / 100) * layerHeight, duration: plan.durationSec, ease: 'none' }, 0)
          .to(plane, { opacity: 1, duration: fade, ease: 'power1.out' }, 0)
          .to(plane, { opacity: 0, duration: fade, ease: 'power1.in' }, plan.durationSec - fade);

        // Behind the hero text the plane dims so it doesn't strike through
        // the numerals, and brightens again in open sky.
        const bodyTop = (Math.min(plan.startYPercent, plan.endYPercent) / 100) * layerHeight;
        const bodyBottom = (Math.max(plan.startYPercent, plan.endYPercent) / 100) * layerHeight + planeHeight;
        const textEndX = this.heroClearX(layer, bodyTop, bodyBottom);
        if (textEndX > 0) {
            // When the plane's left edge crosses the end of the text
            const clearAt = Math.min(plan.durationSec, Math.max(0, ((textEndX - startX) / (endX - startX)) * plan.durationSec));
            const half = PLANE_DIM_SEC / 2;
            if (plan.direction === 1) {
                window.AnimatedWeatherCardGsap.set(body, { opacity: PLANE_BEHIND_TEXT_OPACITY });
                tl.to(body, { opacity: 1, duration: PLANE_DIM_SEC, ease: 'sine.inOut' }, Math.max(0, clearAt - half));
            } else {
                tl.to(body, { opacity: PLANE_BEHIND_TEXT_OPACITY, duration: PLANE_DIM_SEC, ease: 'sine.inOut' }, Math.max(0, clearAt - half));
            }
        }

        // The plane may pass behind the hero text; its label shouldn't pile
        // onto it. Show the label as soon as the label itself is clear of
        // whichever hero lines sit at its height (measured, so a short "16°"
        // frees the sky early and a long location name keeps it later).
        if (label) {
            const labelWidth = label.offsetWidth || 72;
            // The tag always sits on the open-sky side (right) of the plane:
            // ahead of the nose eastbound, behind the tail westbound.
            const labelLeft = planeWidth + LABEL_GAP_PX;
            const labelMid = [plan.startYPercent, plan.endYPercent].map(p => (p / 100) * layerHeight + planeHeight * drawing.midTop / 100);
            const clearX = this.heroClearX(
                layer,
                Math.min(...labelMid) - LABEL_HEIGHT_PX / 2,
                Math.max(...labelMid) + LABEL_HEIGHT_PX / 2,
            );
            const planeXWhenClear = clearX - labelLeft;
            const crossAt = Math.min(plan.durationSec, Math.max(0,
                ((planeXWhenClear - startX) / (endX - startX)) * plan.durationSec));
            const labelOpacity = 0.72;
            if (plan.direction === 1) {
                window.AnimatedWeatherCardGsap.set(label, { opacity: 0 });
                tl.to(label, { opacity: labelOpacity, duration: LABEL_FADE_SEC, ease: 'power1.out' }, crossAt);
            } else {
                tl.to(label, { opacity: 0, duration: LABEL_FADE_SEC, ease: 'power1.in' }, Math.max(0, crossAt - LABEL_FADE_SEC));
            }
        }
        this.timelines.set(plane, tl);

        devLog(this.config.devMode, `Plane ${flight.label || flight.id} (${family}) flying ${plan.direction === 1 ? 'east' : 'west'} for ${plan.durationSec.toFixed(1)}s`);
        return true;
    }
}
