// The clock: one engine for the small clock on the card's location line,
// the wall's clock and the nightstand's time.
//
// The minute is opacity only, never a rise (it happens 1,440 times a day,
// in the corner of the eye). The changed figure and those after it fade as
// one group: the old group leaves from where it was drawn (an overlay at
// its old x), the new one is already laid out in the flow at opacity 0, so
// nothing slides and two figures never share a frame.
//   by day:   out 120 ms, in 220 ms from 120 ms
//   at night: out 260 ms, in 500 ms from 190 ms, as the old figure passes
//             0.15: its place never blank, never two figures above 0.15

import { CURVE, css, esc } from './fc-core';

export const MINUTE = {
    day: { out: 120, outEase: css(CURVE.out), in: 220, inEase: css(CURVE.in), at: 120 },
    night: { out: 260, outEase: 'cubic-bezier(0.4, 0, 0.6, 1)', in: 500, inEase: 'cubic-bezier(0.33, 1, 0.68, 1)', at: 190 },
};

const glyphs = (text: string) => [...text].map(c => `<i class="${c === ':' || c === '.' ? 'awc-sep' : 'awc-fig'}">${esc(c)}</i>`).join('');

/** A time that changes a minute at a time. set({ text: '3:12', period: 'AM' }, { animate, night }) */
export class TimeText {
    private cur: string[] | null = null;
    private anims: Animation[] = [];
    private pending: { overlay: HTMLElement; group: HTMLElement } | null = null;
    constructor(private readonly host: HTMLElement) {
        host.classList.add('awc-time');
    }
    private tokens(p: { text: string; period?: string }): string[] { const t = [...p.text]; if (p.period) t.push('|' + p.period); return t; }
    private html(tokens: string[]): string { return tokens.map(t => (t.startsWith('|') ? `<span class="awc-ampm">${esc(t.slice(1))}</span>` : glyphs(t))).join(''); }
    get text(): string { return (this.cur ?? []).join(''); }
    set(p: { text: string; period?: string }, { animate = false, night = false } = {}): boolean {
        const next = this.tokens(p);
        if (this.cur && this.cur.join('\u0000') === next.join('\u0000')) return false;
        if (!this.cur || !animate || typeof this.host.animate !== 'function') { this.finish(); this.host.innerHTML = this.html(next); this.cur = next; return true; }
        const old = this.cur;
        this.finish();
        let i = 0;
        while (i < old.length && i < next.length && old[i] === next[i]) i++;
        // The same number of figures: only the changed one and those after it. A count change fades the whole time through.
        this.swap(old, next, old.length === next.length ? i : 0, night);
        return true;
    }
    private swap(old: string[], next: string[], i: number, night: boolean) {
        const tok = night ? MINUTE.night : MINUTE.day;
        const kids = [...this.host.children] as HTMLElement[];
        const box = this.host.getBoundingClientRect();
        const first = kids[i];
        const left = first ? first.getBoundingClientRect().left - box.left : box.width;
        const overlay = document.createElement('span');
        overlay.className = 'awc-old';
        overlay.setAttribute('aria-hidden', 'true');
        overlay.style.left = `${left}px`;
        overlay.innerHTML = this.html(old.slice(i));
        const group = document.createElement('span');
        group.className = 'awc-new';
        group.innerHTML = this.html(next.slice(i));
        kids.slice(i).forEach(k => k.remove());
        this.host.append(group, overlay);
        this.cur = next;
        const a = overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: tok.out, easing: tok.outEase, fill: 'forwards' });
        const b = group.animate([{ opacity: 0 }, { opacity: 1 }], { duration: tok.in, delay: tok.at, easing: tok.inEase, fill: 'both' });
        this.anims = [a, b];
        this.pending = { overlay, group };
        b.finished.then(() => this.finish()).catch(() => {});
    }
    /** End a running change at once: the old group goes, the new one stays at full strength */
    finish(): void {
        if (!this.pending) return;
        const { overlay, group } = this.pending;
        this.pending = null;
        for (const a of this.anims) a.cancel();
        this.anims = [];
        overlay.remove();
        if (group.isConnected) group.replaceWith(...Array.from(group.childNodes));
    }
}

/** Calls tick at each minute boundary of the page's clock (no polling; follows a clock that's been set) */
export function minuteTicker(tick: () => void): { stop(): void; rearm(): void } {
    let timer = 0, stopped = false;
    const arm = () => {
        clearTimeout(timer);
        timer = window.setTimeout(() => { if (stopped) return; tick(); arm(); }, 60_000 - (Date.now() % 60_000) + 20);
    };
    arm();
    return { stop() { stopped = true; clearTimeout(timer); }, rearm: arm };
}
