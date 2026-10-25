import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { PlanesAnimation, MAX_CONCURRENT_PLANES, PLANE_STAGGER_MS, FlyoverOptions } from '../../src/planes-animation';
import type { FlightInfo } from '../../src/flight-tracker';

function makeCardElement(): HTMLElement {
    const host = document.createElement('div');
    host.innerHTML = `
        <div class="animated-weather-card">
            <div class="animation-layer">
                <div class="sun"></div>
                <div class="planes-layer"></div>
            </div>
        </div>
    `;
    document.body.appendChild(host);
    return host;
}

function flight(id: string, overrides: Partial<FlightInfo> = {}): FlightInfo {
    return {
        id,
        label: 'BA117',
        aircraftCode: 'B77W',
        altitudeFt: 30000,
        groundSpeedKt: 450,
        heading: 90,
        verticalSpeed: 0,
        onGround: false,
        ...overrides,
    };
}

const DAY: FlyoverOptions = { night: false, showLabels: true };

type GsapMock = {
    set: ReturnType<typeof vi.fn>;
    timeline: ReturnType<typeof vi.fn>;
};
const gsap = (): GsapMock => (window as unknown as { AnimatedWeatherCardGsap: GsapMock }).AnimatedWeatherCardGsap;

/** Finish the n-th plane's timeline as if GSAP completed it. */
function completeTimeline(n: number): void {
    const vars = gsap().timeline.mock.calls[n][0] as { onComplete: () => void };
    vars.onComplete();
}

describe('PlanesAnimation', () => {
    let element: HTMLElement;
    let planes: PlanesAnimation;
    const planeEls = () => element.querySelectorAll('.planes-layer .plane-gsap');

    beforeEach(async () => {
        vi.useFakeTimers();
        element = makeCardElement();
        planes = new PlanesAnimation(element, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        await planes.start();
    });

    afterEach(async () => {
        await planes.destroy();
        element.remove();
        vi.useRealTimers();
    });

    it('does nothing before start', async () => {
        const idle = new PlanesAnimation(element, { intensity: 1, scale: 1 }, { entity: 'weather.home' });
        idle.flyOver([flight('a')], DAY);
        expect(planeEls()).toHaveLength(0);
        await idle.destroy();
    });

    it('adds a plane with a "flight · aircraft" label', () => {
        planes.flyOver([flight('a')], DAY);
        expect(planeEls()).toHaveLength(1);
        expect(element.querySelector('.plane-label')?.textContent).toBe('BA117 · B77W');
        expect(planes.activePlaneCount).toBe(1);
    });

    it('omits the label when labels are off or there is nothing to show', () => {
        planes.flyOver([flight('a')], { night: false, showLabels: false });
        planes.flyOver([flight('b', { label: '', aircraftCode: '' })], DAY);
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        expect(planeEls()).toHaveLength(2);
        expect(element.querySelector('.plane-label')).toBeNull();
    });

    it('renders label text literally, never as HTML', () => {
        planes.flyOver([flight('a', { label: '<img src=x onerror=alert(1)>', aircraftCode: '' })], DAY);
        expect(element.querySelector('.plane-label img')).toBeNull();
        expect(element.querySelector('.plane-label')?.textContent).toBe('<img src=x onerror=alert(1)>');
    });

    it('hides an eastbound label until the plane clears the hero text, and fades a westbound one before it', () => {
        planes.flyOver([flight('east', { heading: 90, label: 'EAST1' }), flight('west', { heading: 270, label: 'WEST2' })], DAY);
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        const [eastLabel, westLabel] = [...element.querySelectorAll('.plane-label')];
        expect(gsap().set).toHaveBeenCalledWith(eastLabel, { opacity: 0 });
        expect(gsap().set).not.toHaveBeenCalledWith(westLabel, { opacity: 0 });
        const tlFor = (n: number) => gsap().timeline.mock.results[n].value as { to: ReturnType<typeof vi.fn> };
        expect(tlFor(0).to).toHaveBeenCalledWith(eastLabel, expect.objectContaining({ opacity: 0.72 }), expect.any(Number));
        expect(tlFor(1).to).toHaveBeenCalledWith(westLabel, expect.objectContaining({ opacity: 0 }), expect.any(Number));
    });

    it('marks planes flown at night, and shows their lights only then', () => {
        planes.flyOver([flight('a')], DAY);
        expect(element.querySelectorAll('.plane-light')).toHaveLength(0);
        planes.flyOver([flight('b')], { night: true, showLabels: true });
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        const night = planeEls()[1];
        expect(night.classList.contains('night')).toBe(true);
        const kinds = [...night.querySelectorAll('.plane-light')].map(l => l.classList[1]).sort();
        expect(kinds).toEqual(['beacon', 'nav', 'strobe', 'tail']);
    });

    it('draws each flight as its aircraft, at its size', () => {
        const at = (code: string) => {
            planes.flyOver([flight(code, { aircraftCode: code })], DAY);
            const el = element.querySelector(`.plane-gsap[data-flight-id="${code}"]`) as HTMLElement;
            const seen = { family: el.dataset.family, width: parseFloat(el.style.width) };
            // Land it, so the next one has a slot (three fly at once)
            completeTimeline(gsap().timeline.mock.calls.length - 1);
            return seen;
        };
        const a320 = at('A20N'), jumbo = at('B748'), crj = at('CRJ9'), citation = at('C68A'), heli = at('EC35');
        expect([a320.family, jumbo.family, crj.family, citation.family, heli.family]).toEqual(['narrow', 'quad', 'rear', 'rear', 'heli']);
        expect(jumbo.width).toBeGreaterThan(a320.width * 1.3);
        // A business jet flies the CRJ's shape at its own, shorter length
        expect(citation.width).toBeLessThan(crj.width);
    });

    it('flies a helicopter nose down, the way it moves', () => {
        planes.flyOver([flight('h', { aircraftCode: 'EC35', heading: 90, verticalSpeed: 0 })], DAY);
        planes.flyOver([flight('w', { aircraftCode: 'EC35', heading: 270, verticalSpeed: 0 })], DAY);
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        const [east, west] = [...element.querySelectorAll('.plane-body')];
        expect(gsap().set).toHaveBeenCalledWith(east, expect.objectContaining({ scaleX: 1, rotation: 4 }));
        expect(gsap().set).toHaveBeenCalledWith(west, expect.objectContaining({ scaleX: -1, rotation: -4 }));
    });

    it('puts the label level with the fuselage', () => {
        planes.flyOver([flight('a')], DAY);
        const top = parseFloat((element.querySelector('.plane-label') as HTMLElement).style.top);
        expect(top).toBeGreaterThan(50);
        expect(top).toBeLessThan(90);
    });

    it('mirrors only the silhouette for westbound planes', () => {
        planes.flyOver([flight('a', { heading: 270 })], DAY);
        const body = element.querySelector('.plane-body');
        expect(gsap().set).toHaveBeenCalledWith(body, expect.objectContaining({ scaleX: -1 }));
    });

    it('staggers planes that arrive together', () => {
        planes.flyOver([flight('a'), flight('b')], DAY);
        expect(planeEls()).toHaveLength(1);
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        expect(planeEls()).toHaveLength(2);
    });

    it(`caps the card at ${MAX_CONCURRENT_PLANES} planes at once`, () => {
        planes.flyOver(['a', 'b', 'c', 'd', 'e'].map(id => flight(id)), DAY);
        vi.advanceTimersByTime(PLANE_STAGGER_MS * 5);
        expect(planeEls()).toHaveLength(MAX_CONCURRENT_PLANES);
    });

    it('removes a plane when its pass completes', () => {
        planes.flyOver([flight('a')], DAY);
        completeTimeline(0);
        expect(planeEls()).toHaveLength(0);
        expect(planes.activePlaneCount).toBe(0);
    });

    it('pauses and resumes in-flight timelines, and skips launches while paused', async () => {
        planes.flyOver([flight('a'), flight('b')], DAY);
        const tl = gsap().timeline.mock.results[0].value as { pause: ReturnType<typeof vi.fn>; resume: ReturnType<typeof vi.fn> };

        await planes.pause();
        expect(tl.pause).toHaveBeenCalled();
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        expect(planeEls()).toHaveLength(1);

        await planes.resume();
        expect(tl.resume).toHaveBeenCalled();
    });

    it('clears planes and pending launches on destroy', async () => {
        planes.flyOver([flight('a'), flight('b')], DAY);
        await planes.destroy();
        expect(planeEls()).toHaveLength(0);
        vi.advanceTimersByTime(PLANE_STAGGER_MS);
        expect(planeEls()).toHaveLength(0);
    });
});
