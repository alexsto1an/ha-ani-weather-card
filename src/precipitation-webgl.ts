import { FALLOUT_PX } from './particle-pool';

export const PARTICLE_FLOATS = 12;
const MAX_PIXELS = 1_500_000;
const SPILL_MARGIN = 8;
const MAX_SIDE_SPILL = 200;

export function mountWebGLParticles<T extends WebGLParticles>(
    layer: Element, kind: 'rain' | 'snow' | 'sleet',
    create: (canvas: HTMLCanvasElement, lost: () => void) => T,
    initialize: (renderer: T) => void, fallback: () => void,
): T | undefined {
    const canvas = document.createElement('canvas');
    canvas.className = `${kind}-webgl`;
    layer.appendChild(canvas);
    let renderer: T | undefined;
    try {
        renderer = create(canvas, () => {
            console.warn(`Animated Weather Card: WebGL ${kind} context lost; using standard ${kind}.`);
            renderer?.stop();
            fallback();
        });
        initialize(renderer);
        return renderer;
    } catch (error) {
        console.warn(`Animated Weather Card: WebGL ${kind} could not start; using standard ${kind}.`, error);
        renderer?.stop();
        canvas.remove();
        return undefined;
    }
}

function compile(gl: WebGL2RenderingContext, kind: number, source: string): WebGLShader {
    const shader = gl.createShader(kind);
    if (!shader) throw new Error('Could not allocate a precipitation shader');
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
    const error = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Could not compile a precipitation shader: ${error}`);
}

function link(gl: WebGL2RenderingContext, vertex: string, fragment: string): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error('Could not allocate the precipitation program');
    const shaders: WebGLShader[] = [];
    try {
        shaders.push(compile(gl, gl.VERTEX_SHADER, vertex));
        shaders.push(compile(gl, gl.FRAGMENT_SHADER, fragment));
        for (const shader of shaders) gl.attachShader(program, shader);
        gl.linkProgram(program);
        if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
        throw new Error(`Could not link the precipitation shaders: ${gl.getProgramInfoLog(program)}`);
    } catch (error) {
        gl.deleteProgram(program);
        throw error;
    } finally {
        for (const shader of shaders) gl.deleteShader(shader);
    }
}

interface SurfaceOptions {
    spill: boolean;
    sideSpill: (height: number) => number;
    lost: () => void;
}

/** Three vec4s per particle; each renderer interprets them in its shader. */
export abstract class WebGLParticles {
    protected data = new Float32Array(0);
    protected dirty = false;
    protected time = 0;
    protected width = -1;
    protected height = -1;
    private readonly gl: WebGL2RenderingContext;
    private readonly program: WebGLProgram;
    private readonly quad: WebGLBuffer;
    private readonly buffer: WebGLBuffer;
    private readonly observer: ResizeObserver;
    private readonly colorReader: CanvasRenderingContext2D;
    private readonly timeUniform: WebGLUniformLocation | null;
    private readonly frameUniform: WebGLUniformLocation | null;
    private readonly tintUniform: WebGLUniformLocation | null;
    private readonly maxBufferSize: number;
    private drawnCount = 0;
    private frameId = 0;
    private lastFrame?: number;
    private lastColor = '';
    private nextColorRead = 0;

    constructor(private readonly canvas: HTMLCanvasElement, private readonly card: HTMLElement,
                private readonly surface: SurfaceOptions, vertex: string, fragment: string) {
        const color = document.createElement('canvas');
        color.width = color.height = 1;
        const reader = color.getContext('2d', { willReadFrequently: true });
        if (!reader || typeof ResizeObserver !== 'function') throw new Error('Canvas color or size tracking unavailable');
        this.colorReader = reader;
        const gl = canvas.getContext('webgl2', {
            alpha: true, antialias: false, depth: false, stencil: false, failIfMajorPerformanceCaveat: true,
        });
        if (!gl) throw new Error('Hardware WebGL 2 unavailable');
        this.gl = gl;
        let program: WebGLProgram | undefined;
        let buffer: WebGLBuffer | null = null;
        let quad: WebGLBuffer | null = null;
        let observer: ResizeObserver | undefined;
        try {
            this.program = program = link(gl, vertex, fragment);
            buffer = gl.createBuffer();
            quad = gl.createBuffer();
            if (!buffer || !quad) throw new Error('Could not allocate the precipitation buffers');
            this.buffer = buffer;
            this.quad = quad;
            this.maxBufferSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            this.timeUniform = gl.getUniformLocation(program, 'time');
            this.frameUniform = gl.getUniformLocation(program, 'frame');
            this.tintUniform = gl.getUniformLocation(program, 'tint');
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
            gl.enableVertexAttribArray(0);
            gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            for (let i = 1; i <= 3; i++) {
                gl.enableVertexAttribArray(i);
                gl.vertexAttribPointer(i, 4, gl.FLOAT, false, PARTICLE_FLOATS * 4, (i - 1) * 16);
                gl.vertexAttribDivisor(i, 1);
            }
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            this.resize();
            this.observer = observer = new ResizeObserver(this.resize);
            observer.observe(card);
            canvas.addEventListener('webglcontextlost', this.contextLost);
        } catch (error) {
            observer?.disconnect();
            gl.deleteBuffer(quad);
            gl.deleteBuffer(buffer);
            if (program) gl.deleteProgram(program);
            this.releaseContext();
            throw error;
        }
    }

    private readonly resize = (): void => {
        const { gl, canvas, card, surface } = this;
        const widthPx = card.offsetWidth;
        const heightPx = card.offsetHeight;
        if (widthPx === this.width && heightPx === this.height) return;
        this.width = widthPx;
        this.height = heightPx;
        const side = surface.spill ? Math.min(MAX_SIDE_SPILL, Math.ceil(surface.sideSpill(heightPx)) + SPILL_MARGIN) : 0;
        const width = Math.max(1, widthPx + side * 2);
        const height = Math.max(1, heightPx + (surface.spill ? FALLOUT_PX + SPILL_MARGIN : 0));
        const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(MAX_PIXELS / (width * height)),
            this.maxBufferSize / Math.max(width, height));
        canvas.style.left = `${-side}px`;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        canvas.width = Math.max(1, Math.round(width * ratio));
        canvas.height = Math.max(1, Math.round(height * ratio));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform4f(this.frameUniform, width, height, side, 0);
        if (!this.frameId) this.draw(this.drawnCount);
    };

    protected reserve(count: number): void {
        if (count * PARTICLE_FLOATS <= this.data.length) return;
        const data = new Float32Array(Math.max(this.data.length * 2, count * PARTICLE_FLOATS));
        data.set(this.data);
        this.data = data;
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data.byteLength, this.gl.DYNAMIC_DRAW);
        this.dirty = true;
    }

    private readTint(): void {
        const color = getComputedStyle(this.canvas).color || '#fff';
        if (color === this.lastColor) return;
        this.lastColor = color;
        const ctx = this.colorReader;
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
        const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
        this.gl.uniform4f(this.tintUniform, r / 255, g / 255, b / 255, a / 255);
    }

    private draw(count: number): void {
        const { gl } = this;
        if (this.time >= this.nextColorRead) {
            this.readTint();
            this.nextColorRead = this.time + 1;
        }
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!count) return;
        if (this.dirty) {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data, 0, count * PARTICLE_FLOATS);
            this.dirty = false;
        }
        gl.uniform1f(this.timeUniform, this.time);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
    }

    protected paint(count: number, initial: boolean): void {
        this.drawnCount = count;
        if (!this.frameId) this.draw(count);
        if (initial && this.gl.getError() !== this.gl.NO_ERROR) throw new Error('WebGL could not draw the particle field');
    }

    protected abstract advance(): number;

    private readonly tick = (now: number): void => {
        // A stalled frame must not jump through a whole fall.
        if (this.lastFrame !== undefined) this.time += Math.min(0.1, (now - this.lastFrame) / 1000);
        this.lastFrame = now;
        this.drawnCount = this.advance();
        this.draw(this.drawnCount);
        this.frameId = window.requestAnimationFrame(this.tick);
    };

    pause(): void {
        if (this.frameId) window.cancelAnimationFrame(this.frameId);
        this.frameId = 0;
        this.lastFrame = undefined;
    }

    resume(): void {
        if (!this.frameId) this.frameId = window.requestAnimationFrame(this.tick);
    }

    stop(): void {
        this.pause();
        this.observer.disconnect();
        this.canvas.removeEventListener('webglcontextlost', this.contextLost);
        this.gl.deleteBuffer(this.quad);
        this.gl.deleteBuffer(this.buffer);
        this.gl.deleteProgram(this.program);
        this.releaseContext();
        this.canvas.remove();
    }

    private readonly contextLost = (): void => this.surface.lost();

    private releaseContext(): void {
        if (!this.gl.isContextLost()) this.gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
}
