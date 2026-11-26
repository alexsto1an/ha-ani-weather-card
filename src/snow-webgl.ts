import { between, FALLOUT_PX } from './particle-pool';
import { PARTICLE_FLOATS, WebGLParticles } from './precipitation-webgl';
import { snowDepth, snowFall, SNOW_FLAKE_SIZE, SNOW_SWAY_DEG, MAX_SNOW_DRIFT, MAX_SNOW_WIND } from './snow-motion';

const SNOW_VERTEX = `#version 300 es
layout(location=0) in vec2 corner;
layout(location=1) in vec4 path;
layout(location=2) in vec4 timing;
layout(location=3) in vec4 flake;
uniform vec4 frame;
uniform float time;
out vec2 point;
out float opacity;
void main() {
    float age = time - timing.x;
    float fall = clamp(age / timing.y, 0.0, 1.0);
    float fade = clamp((age - timing.z) / max(0.001, timing.w - timing.z), 0.0, 1.0);
    opacity = age < 0.0 ? 0.0 : flake.y * (flake.w < 0.0 ? (1.0 - fade) * (1.0 - fade) : 1.0 - fade * fade);
    float angle = radians(${SNOW_SWAY_DEG}.0) * cos(6.2831853 * (age / abs(flake.w) + flake.z));
    vec2 sway = vec2(-sin(angle), cos(angle) - 1.0) * flake.x * 5.5;
    vec2 pos = mix(path.xy, path.zw, fall) + sway + flake.x * (corner + 1.0) * 0.5 + frame.zw;
    gl_Position = vec4(pos / frame.xy * vec2(2.0, -2.0) + vec2(-1.0, 1.0), 0.0, 1.0);
    point = corner;
}`;

const SNOW_FRAGMENT = `#version 300 es
precision mediump float;
in vec2 point;
in float opacity;
uniform vec4 tint;
out vec4 color;
void main() {
    float alpha = clamp((1.0 - length(point)) / 0.55, 0.0, 1.0) * opacity * tint.a;
    color = vec4(tint.rgb * alpha, alpha);
}`;

interface SnowOptions {
    spill: boolean;
    wind: number;
    pile: () => number | undefined;
    settle: () => void;
    lost: () => void;
}

interface Flake {
    size: number;
    end: number;
    settleAt: number;
}

export class WebGLSnow extends WebGLParticles {
    private readonly flakes: Flake[] = [];
    private count = 0;

    constructor(canvas: HTMLCanvasElement, card: HTMLElement, private readonly options: SnowOptions) {
        super(canvas, card, {
            spill: options.spill,
            sideSpill: height => (height + FALLOUT_PX + SNOW_FLAKE_SIZE[1] * 2) * MAX_SNOW_DRIFT * MAX_SNOW_WIND,
            lost: options.lost,
        }, SNOW_VERTEX, SNOW_FRAGMENT);
    }

    resizePopulation(count: number, quick: boolean, initial = false): void {
        this.count = count;
        if (quick) this.flakes.length = Math.min(count, this.flakes.length);
        this.reserve(count);
        while (this.flakes.length < count) {
            this.flakes.push({ size: between(...SNOW_FLAKE_SIZE), end: 0, settleAt: Infinity });
            this.assign(this.flakes.length - 1, initial || quick, initial || quick ? 0 : between(0, 6));
        }
        this.paint(this.flakes.length, initial);
    }

    private assign(index: number, warm = false, delay = 0): void {
        const flake = this.flakes[index];
        const { size } = flake;
        const { startY, endY, fallSec, settles, x, drift, fadeStart, endSec } =
            snowFall(size, this.width, this.height, this.options.wind, this.options.spill, this.options.pile());
        const start = this.time + delay - (warm ? between(0, endSec) : 0);
        flake.end = start + endSec;
        flake.settleAt = settles ? start + fallSec : Infinity;
        this.data.set([
            x, startY, x + drift, endY,
            start, fallSec, fadeStart, endSec,
            size, 0.45 + 0.45 * snowDepth(size), Math.random(), between(2.8, 4.4) * (settles ? -1 : 1),
        ], index * PARTICLE_FLOATS);
        this.dirty = true;
    }

    protected advance(): number {
        for (let i = this.flakes.length - 1; i >= 0; i--) {
            const flake = this.flakes[i];
            if (flake.settleAt <= this.time) {
                flake.settleAt = Infinity;
                this.options.settle();
            }
            if (flake.end > this.time) continue;
            if (this.flakes.length > this.count) {
                const last = this.flakes.length - 1;
                this.flakes[i] = this.flakes[last];
                this.flakes.pop();
                this.data.copyWithin(i * PARTICLE_FLOATS, last * PARTICLE_FLOATS, (last + 1) * PARTICLE_FLOATS);
                this.dirty = true;
            } else {
                this.assign(i);
            }
        }
        return this.flakes.length;
    }
}
