import { between } from './particle-pool';
import { PARTICLE_FLOATS, WebGLParticles } from './precipitation-webgl';
import { MAX_REBOUND_REACH, RAIN_JOIN_STAGGER, RAIN_REBOUNDS, RAIN_SPLASH_DOTS, rainDot, rainDropOpacity, rainDropWidth, rainFall, rainRebound } from './rain-motion';
import type { RainKind } from './types';

// Drop, splash dot and rebound share one batch. Each is a quad in the direction of its streak.
const RAIN_VERTEX = `#version 300 es
layout(location=0) in vec2 corner;
layout(location=1) in vec4 path;
layout(location=2) in vec4 timing;
layout(location=3) in vec4 look;
uniform vec4 frame;
uniform float time;
out vec2 point;
out float opacity;
out float halfLine;
out float radius;
flat out int effect;

float ramp(float t, float edge) { return clamp((t - edge) / (1.0 - edge), 0.0, 1.0); }
float squared(float x) { return x * x; }
vec2 arc(float t) { return vec2(2.0 * path.z * t, -4.0 * path.w * (1.0 - t) * t + look.x * t * t); }

void main() {
    float age = time - timing.x;
    effect = int(look.w);
    opacity = look.y;
    point = corner;
    radius = 0.0;
    halfLine = 0.0;
    if (age < 0.0 || age >= timing.z) {
        gl_Position = vec4(2.0, 2.0, 0.0, 1.0);
        return;
    }
    vec2 pos;
    if (effect == 0) {
        // path: origin, width, length. look.x is the end of the fall.
        float head = mix(path.y, look.x, min(1.0, age / timing.y)) + path.w;
        float shrink = clamp((age - timing.y) / max(0.001, timing.z - timing.y), 0.0, 1.0);
        float length = path.w * (1.0 - shrink);
        float fade = clamp((age - timing.w) / max(0.001, timing.z - timing.w), 0.0, 1.0);
        opacity *= 1.0 - fade * fade;
        point = (corner + 1.0) * 0.5;
        pos = vec2(path.x, head - length) + point * vec2(path.z, length);
    } else if (effect == 1) {
        // A round splash droplet travels out and back to the lip.
        float t = age / timing.z;
        float up = 1.0 - pow(max(0.0, 1.0 - t / 0.45), 3.0);
        float down = pow(ramp(t, 0.45), 3.0);
        pos = path.xy + vec2(path.z * (1.0 - squared(1.0 - t)), -path.w * (up - down)) + corner;
        opacity *= 1.0 - squared(ramp(t, 0.6));
    } else {
        // The SVG's travelling dash becomes a short, rounded chord of the same arc.
        float t = age / timing.z;
        float travel = 1.0 - pow(1.0 - t, 3.0);
        float end = travel * (1.0 + look.z);
        vec2 a = arc(clamp(end - look.z, 0.0, 1.0));
        vec2 b = arc(min(end, 1.0));
        vec2 chord = b - a;
        float span = length(chord);
        vec2 direction = span > 0.001 ? chord / span : vec2(1.0, 0.0);
        radius = mix(0.8, 0.3, travel);
        halfLine = span * 0.5;
        point = corner * vec2(halfLine + radius + 0.45, radius + 0.45);
        pos = path.xy + (a + b) * 0.5 + direction * point.x + vec2(-direction.y, direction.x) * point.y;
        opacity *= 1.0 - squared(ramp(t, 0.65));
    }
    gl_Position = vec4((pos + frame.zw) / frame.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`;

const RAIN_FRAGMENT = `#version 300 es
precision mediump float;
in vec2 point;
in float opacity;
in float halfLine;
in float radius;
flat in int effect;
uniform vec4 tint;
out vec4 color;
void main() {
    float shape = point.y;
    if (effect == 1) shape = 1.0 - smoothstep(0.55, 1.0, length(point));
    if (effect == 2) {
        float dist = length(vec2(max(abs(point.x) - halfLine, 0.0), point.y));
        shape = 1.0 - smoothstep(max(radius - 0.25, 0.0), radius + 0.45, dist);
    }
    float alpha = shape * opacity * tint.a;
    color = vec4(tint.rgb * alpha, alpha);
}`;

const SPLASH_SLOTS = RAIN_REBOUNDS + RAIN_SPLASH_DOTS;

interface RainOptions {
    spill: boolean;
    splash: boolean;
    bounce: number;
    lost: () => void;
}

interface Drop {
    width: number;
    end: number;
    impact: number;
    x: number;
    y: number;
}

export class WebGLRain extends WebGLParticles {
    private readonly drops: Drop[] = [];
    private readonly splashSlots: number;
    private kind: RainKind = 'rain';
    private count = 0;
    private nextDot = 0;
    private nextRebound = 0;

    constructor(canvas: HTMLCanvasElement, card: HTMLElement, private readonly options: RainOptions) {
        super(canvas, card, {
            spill: options.spill,
            sideSpill: () => options.splash ? MAX_REBOUND_REACH * options.bounce : 0,
            lost: options.lost,
        }, RAIN_VERTEX, RAIN_FRAGMENT);
        this.splashSlots = options.splash ? SPLASH_SLOTS : 0;
    }

    resizePopulation(kind: RainKind, count: number, initial = false): void {
        this.kind = kind;
        this.count = count;
        this.reserve(this.splashSlots + count);
        while (this.drops.length < count) {
            this.drops.push({ width: rainDropWidth(kind), end: 0, impact: Infinity, x: 0, y: 0 });
            this.assign(this.drops.length - 1, initial, initial ? 0 : between(0, RAIN_JOIN_STAGGER));
        }
        this.paint(this.splashSlots + this.drops.length, initial);
    }

    private assign(index: number, warm = false, delay = 0): void {
        const drop = this.drops[index];
        const { length, x, splash, startY, endY, fallSec, fadeStart, endSec } =
            rainFall(this.kind, this.width, this.height, this.options.spill, this.options.splash);
        const start = this.time + delay - (warm ? between(0, endSec) : 0);
        drop.end = start + endSec;
        drop.impact = splash ? start + fallSec : Infinity;
        drop.x = x + drop.width / 2;
        drop.y = endY + length;
        this.data.set([
            x, startY, drop.width, length,
            start, fallSec, endSec, splash ? endSec : fadeStart,
            endY, rainDropOpacity(drop.width), 0, 0,
        ], (this.splashSlots + index) * PARTICLE_FLOATS);
        this.dirty = true;
    }

    private splash(drop: Drop): void {
        const { x, y, impact } = drop;
        const { bounce } = this.options;
        const { rise, reach, fall, length, streak, duration } = rainRebound(bounce);
        this.data.set([
            x, y, reach, rise, impact, 0, duration, 0, fall, 0.85, streak / length, 2,
        ], this.nextRebound * PARTICLE_FLOATS);
        this.nextRebound = (this.nextRebound + 1) % RAIN_REBOUNDS;
        for (const side of [-1, 1]) {
            const dot = rainDot(side, bounce);
            this.data.set([
                x, y - 1, dot.spread, dot.rise, impact, 0, dot.duration, 0, 0, 0.9, 0, 1,
            ], (RAIN_REBOUNDS + this.nextDot) * PARTICLE_FLOATS);
            this.nextDot = (this.nextDot + 1) % RAIN_SPLASH_DOTS;
        }
        this.dirty = true;
    }

    protected advance(): number {
        for (let i = this.drops.length - 1; i >= 0; i--) {
            const drop = this.drops[i];
            if (drop.impact <= this.time) {
                this.splash(drop);
                drop.impact = Infinity;
            }
            if (drop.end > this.time) continue;
            if (this.drops.length > this.count) {
                const last = this.drops.length - 1;
                const at = (this.splashSlots + last) * PARTICLE_FLOATS;
                this.drops[i] = this.drops[last];
                this.drops.pop();
                this.data.copyWithin((this.splashSlots + i) * PARTICLE_FLOATS, at, at + PARTICLE_FLOATS);
                this.dirty = true;
            } else {
                this.assign(i);
            }
        }
        return this.splashSlots + this.drops.length;
    }
}
