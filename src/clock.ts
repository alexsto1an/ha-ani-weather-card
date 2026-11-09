// The weather card's clock: a reading that changes on the minute, and only
// then. It rests while the card does (hidden tab, scrolled away), and reads
// the time again the moment it's back, so it never shows a stale minute.

/**
 * Calls `tick` at every minute boundary of the page's clock. Each wait is
 * measured afresh from Date.now(), so it never drifts the way an interval
 * would, and follows a clock that's been set (the demo's).
 */
export class MinuteTicker {
    private timer?: ReturnType<typeof setTimeout>;
    private running = false;

    constructor(private readonly tick: () => void) {}

    /** Read the time now, then on every minute until stopped. Safe to call again. */
    start(): void {
        if (this.running) return;
        this.running = true;
        this.tick();
        this.arm();
    }

    stop(): void {
        this.running = false;
        clearTimeout(this.timer);
        this.timer = undefined;
    }

    get isRunning(): boolean {
        return this.running;
    }

    private arm(): void {
        clearTimeout(this.timer);
        // A few ms past the boundary, so the new minute has begun when it reads
        const wait = 60_000 - (Date.now() % 60_000) + 20;
        this.timer = setTimeout(() => {
            if (!this.running) return;
            this.tick();
            this.arm();
        }, wait);
    }
}
