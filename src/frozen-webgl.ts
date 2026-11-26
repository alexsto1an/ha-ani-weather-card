import { between, FALLOUT_PX } from './particle-pool';
import { PARTICLE_FLOATS, WebGLParticles } from './precipitation-webgl';
import {
    MAX_SLEET_DRIFT, MAX_SNOW_DRIFT, MAX_SNOW_WIND, SLEET_PELLET_SIZE, SNOW_FLAKE_SIZE, SNOW_SWAY_DEG,
    sleetFall, snowDepth, snowFall,
} from './snow-motion';

const FROZEN_VERTEX = `
layout(location=0) in vec2 corner;
layout(location=1) in vec4 path;
layout(location=2) in vec4 timing;
layout(location=3) in vec4 flake;
uniform vec4 frame;
uniform float time;
out vec2 point;
out float opacity;
#ifdef SLEET
out mediump float halfSize;
#endif
void main() {
    float age = time - timing.x;
    float fall = clamp(age / timing.y, 0.0, 1.0);
    float fade = clamp((age - timing.z) / max(0.001, timing.w - timing.z), 0.0, 1.0);
    opacity = age < 0.0 ? 0.0 : flake.y * (flake.w < 0.0 ? (1.0 - fade) * (1.0 - fade) : 1.0 - fade * fade);
    vec2 pos = mix(path.xy, path.zw, fall) + frame.zw;
#ifdef SLEET
    halfSize = flake.x * 0.5;
    point = corner * (halfSize + 1.5);
    float c = cos(flake.z);
    float s = sin(flake.z);
    pos += vec2(halfSize) + mat2(c, s, -s, c) * point;
#else
    float angle = radians(${SNOW_SWAY_DEG}.0) * cos(6.2831853 * (age / abs(flake.w) + flake.z));
    pos += vec2(-sin(angle), cos(angle) - 1.0) * flake.x * 5.5 + flake.x * (corner + 1.0) * 0.5;
    point = corner;
#endif
    gl_Position = vec4(pos / frame.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
}`;

const FROZEN_FRAGMENT = `
precision mediump float;
in vec2 point;
in float opacity;
#ifdef SLEET
in float halfSize;
#endif
uniform vec4 tint;
out vec4 color;
void main() {
#ifdef SLEET
    float radius = halfSize * 0.4;
    vec2 q = abs(point) - (halfSize - radius);
    float edge = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
    float core = 1.0 - smoothstep(-0.3, 0.3, edge);
    float halo = (1.0 - core) * 0.75 * (1.0 - smoothstep(0.0, 1.5, edge));
    color = vec4(tint.rgb * core + vec3(0.784, 0.863, 1.0) * halo, core + halo) * opacity * tint.a;
#else
    float alpha = clamp((1.0 - length(point)) / 0.55, 0.0, 1.0) * opacity * tint.a;
    color = vec4(tint.rgb * alpha, alpha);
#endif
}`;

interface FrozenOptions {
    kind: 'snow' | 'sleet';
    spill: boolean;
    wind: number;
    pile?: () => number | undefined;
    settle: () => void;
    lost: () => void;
}

interface Particle {
    size: number;
    end: number;
    settleAt: number;
}

export class WebGLFrozen extends WebGLParticles {
    private readonly particles: Particle[] = [];
    private count = 0;

    constructor(canvas: HTMLCanvasElement, card: HTMLElement, private readonly options: FrozenOptions) {
        const sleet = options.kind === 'sleet';
        const header = `#version 300 es\n${sleet ? '#define SLEET\n' : ''}`;
        const size = sleet ? SLEET_PELLET_SIZE : SNOW_FLAKE_SIZE;
        const drift = sleet ? MAX_SLEET_DRIFT * options.wind : MAX_SNOW_DRIFT * MAX_SNOW_WIND;
        super(canvas, card, {
            spill: options.spill,
            sideSpill: height => (height + FALLOUT_PX + size[1] * 2) * drift,
            lost: options.lost,
        }, header + FROZEN_VERTEX, header + FROZEN_FRAGMENT);
    }

    resizePopulation(count: number, quick: boolean, initial = false): void {
        this.count = count;
        if (quick) this.particles.length = Math.min(count, this.particles.length);
        this.reserve(count);
        const sleet = this.options.kind === 'sleet';
        while (this.particles.length < count) {
            const size = between(...(sleet ? SLEET_PELLET_SIZE : SNOW_FLAKE_SIZE));
            this.particles.push({ size, end: 0, settleAt: Infinity });
            this.assign(this.particles.length - 1, initial || quick, initial || quick ? 0 : between(0, sleet ? 1.5 : 6));
        }
        this.paint(this.particles.length, initial);
    }

    private assign(index: number, warm = false, delay = 0): void {
        const particle = this.particles[index];
        const { size } = particle;
        const { wind, spill, pile, kind } = this.options;
        const sleet = kind === 'sleet';
        const { startY, endY, fallSec, settles, x, drift, fadeStart, endSec } = sleet
            ? sleetFall(size, this.width, this.height, wind, spill)
            : snowFall(size, this.width, this.height, wind, spill, pile?.());
        const start = this.time + delay - (warm ? between(0, endSec) : 0);
        particle.end = start + endSec;
        particle.settleAt = settles ? start + fallSec : Infinity;
        const opacity = sleet ? between(0.8, 1) : 0.45 + 0.45 * snowDepth(size);
        // Sleet keeps its initial rotation; snow sways. The period's sign selects the fade.
        const phase = Math.random() * (sleet ? 2 * Math.PI : 1);
        const period = sleet ? 1 : between(2.8, 4.4);
        this.data.set([
            x, startY, x + drift, endY,
            start, fallSec, fadeStart, endSec,
            size, opacity, phase, period * (settles ? -1 : 1),
        ], index * PARTICLE_FLOATS);
        this.dirty = true;
    }

    protected advance(): number {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            if (particle.settleAt <= this.time) {
                particle.settleAt = Infinity;
                this.options.settle();
            }
            if (particle.end > this.time) continue;
            if (this.particles.length > this.count) {
                const last = this.particles.length - 1;
                this.particles[i] = this.particles[last];
                this.particles.pop();
                this.data.copyWithin(i * PARTICLE_FLOATS, last * PARTICLE_FLOATS, (last + 1) * PARTICLE_FLOATS);
                this.dirty = true;
            } else {
                this.assign(i);
            }
        }
        return this.particles.length;
    }
}
