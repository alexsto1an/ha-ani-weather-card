// Shared jsdom test setup. Loaded once per test file via the
// `setupFiles` entry in vitest.config.ts.
//
// The card depends on GSAP at runtime (loaded from a CDN). In tests we
// supply a deterministic stub so animation lifecycles can be exercised
// without launching real tweens. Anything stubbed here counts as the
// public surface area the production code is allowed to use; if a test
// reaches for a method that isn't here, add it deliberately.

import { vi, beforeEach, afterEach } from 'vitest';

export interface FakeTimeline {
    /** The vars it was created with, so tests can fire onComplete. */
    vars: Record<string, any>;
    to: (...args: unknown[]) => FakeTimeline;
    fromTo: (...args: unknown[]) => FakeTimeline;
    set: (...args: unknown[]) => FakeTimeline;
    call: (...args: unknown[]) => FakeTimeline;
    pause: () => FakeTimeline;
    resume: () => FakeTimeline;
    progress: (value?: number) => FakeTimeline | number;
    kill: () => void;
}

/** Build a stand-in `window.gsap` that records calls without doing real work. */
export function installGsapStub(): void {
    const timelineFactory = (vars: Record<string, any> = {}): FakeTimeline => {
        const tl: FakeTimeline = {
            vars,
            to: vi.fn(() => tl),
            fromTo: vi.fn(() => tl),
            set: vi.fn(() => tl),
            call: vi.fn(() => tl),
            pause: vi.fn(() => tl),
            resume: vi.fn(() => tl),
            progress: vi.fn((value?: number) => (value === undefined ? 0 : tl)),
            kill: vi.fn(),
        };
        return tl;
    };

    (window as unknown as { gsap: unknown }).gsap = {
        to: vi.fn((_target: unknown, vars?: Record<string, any>) => timelineFactory(vars)),
        fromTo: vi.fn((_target: unknown, _from: unknown, vars?: Record<string, any>) => timelineFactory(vars)),
        set: vi.fn(),
        timeline: vi.fn((vars?: Record<string, any>) => timelineFactory(vars)),
        delayedCall: vi.fn((_delay: number, callback: () => void) => timelineFactory({ onComplete: callback })),
        killTweensOf: vi.fn(),
        getTweensOf: vi.fn(() => []),
    };
}

// Re-install the gsap stub before every test so per-test mutations
// (overrides, sabotaged methods) can't leak between cases.
beforeEach(() => {
    installGsapStub();
});

/** Tear down anything that leaks across tests. */
afterEach(() => {
    delete (window as unknown as { gsap?: unknown }).gsap;
});

// matchMedia is missing in jsdom; many of our code paths consult it to
// honour `prefers-reduced-motion`. Provide a default that always says
// "no preference" — tests that need the opposite override this.
if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: (query: string) => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
        }),
    });
}

installGsapStub();
