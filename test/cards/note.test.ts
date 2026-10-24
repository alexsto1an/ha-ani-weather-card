import { describe, it, expect, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import '../../src/animated-weather-card';

type Card = HTMLElement & {
    setConfig(config: object): void;
    hass: unknown;
    getGridOptions(): { rows: number; min_rows: number };
    getCardSize(): number;
};

const LINE = 'Sun with commitment issues.';
const NOTE = 'The sun keeps ducking behind the clouds. A light jacket covers its mood swings.';

function hass(note?: { state: string; attributes?: Record<string, unknown> }, temperature = 21) {
    return {
        states: {
            'weather.home': {
                entity_id: 'weather.home', state: 'partlycloudy',
                attributes: { temperature, humidity: 55, apparent_temperature: 20, friendly_name: 'Home', temperature_unit: '°C' },
            },
            ...(note ? { 'sensor.weather_note': { entity_id: 'sensor.weather_note', attributes: {}, ...note } } : {}),
        },
        config: { time_zone: 'UTC' },
        language: 'en',
        localize: () => '',
    };
}

describe('the weather note', () => {
    let card: Card;

    async function mount(config: object, state = hass({ state: LINE, attributes: { note: NOTE } })): Promise<HTMLElement> {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', note_entity: 'sensor.weather_note', ...config });
        card.hass = state;
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        return card.querySelector('.animated-weather-card') as HTMLElement;
    }

    const note = () => card.querySelector('.weather-note') as HTMLElement | null;
    const long = () => note()?.querySelector('.note-long')?.textContent;
    const short = () => note()?.querySelector('.note-short')?.textContent;

    afterEach(() => {
        card?.remove();
        vi.useRealTimers();
    });

    it('sits last under the hero, in both lengths', async () => {
        await mount({});
        const hero = card.querySelector('.main-weather-info') as HTMLElement;
        expect(hero.lastElementChild).toBe(note());
        expect(note()!.previousElementSibling?.classList.contains('hero-meta')).toBe(true);
        expect(note()!.hidden).toBe(false);
        expect(long()).toBe(NOTE);
        expect(short()).toBe(LINE);
        // Read with the rest of the conditions, not announced on every change
        expect(note()!.closest('[aria-live]')).toBeNull();
    });

    it('shows the text as text, never as markup', async () => {
        await mount({}, hass({ state: '<img src=x onerror=alert(1)>', attributes: { note: '<b>bold</b> & co' } }));
        expect(note()!.querySelector('img, b')).toBeNull();
        expect(long()).toBe('<b>bold</b> & co');
        expect(short()).toBe('<img src=x onerror=alert(1)>');
    });

    it('lets either length stand in for the other', async () => {
        await mount({}, hass({ state: LINE }));
        expect(long()).toBe(LINE);
        card.remove();
        await mount({}, hass({ state: 'unknown', attributes: { note: NOTE } }));
        expect(short()).toBe(NOTE);
        expect(long()).toBe(NOTE);
    });

    it('reads the longer note from the attribute it is told to', async () => {
        await mount({ note_attribute: 'detail' }, hass({ state: LINE, attributes: { note: 'not this', detail: NOTE } }));
        expect(long()).toBe(NOTE);
    });

    it('is only there when a note entity is set, and never on the compact strip', async () => {
        await mount({ note_entity: undefined });
        expect(note()).toBeNull();
        card.remove();
        await mount({ compact: true });
        expect(note()).toBeNull();
    });

    it('stays out of dev mode, whose sample weather a real note wouldn\'t be about', async () => {
        await mount({ dev_mode: true });
        expect(note()).toBeNull();
        expect(card.getGridOptions().rows).toBe(4);
    });

    it('updates in place when only the longer note changes', async () => {
        await mount({});
        const temperature = card.querySelector('.temperature-value');
        card.hass = hass({ state: LINE, attributes: { note: 'Clouds won. Jacket on.' } });
        expect(long()).toBe('Clouds won. Jacket on.');
        expect(card.querySelector('.temperature-value')).toBe(temperature);
    });

    it('appears when its entity does, and goes when there is nothing to say', async () => {
        await mount({}, hass());
        expect(note()!.hidden).toBe(true);
        card.hass = hass({ state: LINE, attributes: { note: NOTE } });
        expect(note()!.hidden).toBe(false);
        expect(long()).toBe(NOTE);
        card.hass = hass({ state: 'unavailable' });
        expect(note()!.hidden).toBe(true);
    });

    it('hides a note older than its lifetime, counted from generated_at', async () => {
        const now = Date.parse('2026-10-20T15:00:00Z');
        vi.useFakeTimers({ now });
        const written = (minutesAgo: number) => new Date(now - minutesAgo * 60_000).toISOString();
        await mount({}, hass({ state: LINE, attributes: { note: NOTE, generated_at: written(200) } }));
        expect(note()!.hidden).toBe(true);
        card.remove();

        await mount({}, hass({ state: LINE, attributes: { note: NOTE, generated_at: written(170) } }));
        expect(note()!.hidden).toBe(false);
        // Nothing else updates: the note still leaves once it stops being true
        await vi.advanceTimersByTimeAsync(11 * 60_000);
        expect(note()!.hidden).toBe(true);
    });

    it('keeps a note with no generated_at, or with a lifetime of 0', async () => {
        await mount({}, hass({ state: LINE, attributes: { note: NOTE } }));
        await vi.advanceTimersByTimeAsync(24 * 60 * 60_000);
        expect(note()!.hidden).toBe(false);
        card.remove();

        await mount({ note_max_age: 0 }, hass({ state: LINE, attributes: { generated_at: '2020-01-01T00:00:00Z' } }));
        expect(note()!.hidden).toBe(false);
    });

    it('asks for a fifth row in sections view, and one more in masonry', async () => {
        await mount({});
        expect(card.getGridOptions()).toMatchObject({ rows: 5, min_rows: 3 });
        expect(card.getCardSize()).toBe(6);
        card.remove();
        await mount({ note_entity: undefined });
        expect(card.getGridOptions()).toMatchObject({ rows: 4, min_rows: 3 });
        expect(card.getCardSize()).toBe(5);
        card.remove();
        await mount({ compact: true });
        expect(card.getGridOptions()).toMatchObject({ rows: 2, min_rows: 1 });
    });
});

describe('a note the card writes itself', () => {
    let card: Card;

    /** Stands in for the note bundle's writer: records what the card asks of it. */
    class FakeWriter {
        static made: FakeWriter[] = [];
        calls: string[] = [];
        constructor(readonly host: { showNote(note: unknown): void; noteWriting(stage: 'forecast' | 'writing' | false): void; noteVisible: boolean; config?: object }) {
            FakeWriter.made.push(this);
        }
        start() { this.calls.push('start'); }
        stop() { this.calls.push('stop'); }
        hassChanged() { this.calls.push('hass'); }
        wake() { this.calls.push('wake'); }
    }

    async function mount(config: object, writer = true): Promise<HTMLElement> {
        vi.useFakeTimers();
        FakeWriter.made = [];
        if (writer) (window as unknown as { AnimatedWeatherCardNote?: unknown }).AnimatedWeatherCardNote = FakeWriter;
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', show_note: true, ...config });
        card.hass = hass();
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        return card.querySelector('.animated-weather-card') as HTMLElement;
    }

    const note = () => card.querySelector('.weather-note') as HTMLElement | null;

    afterEach(() => {
        card?.remove();
        delete (window as unknown as { AnimatedWeatherCardNote?: unknown }).AnimatedWeatherCardNote;
        document.querySelectorAll('script[src*="animated-weather-card-note"]').forEach(s => s.remove());
        vi.useRealTimers();
    });

    it('keeps the writer out of the main bundle', () => {
        const source = readFileSync(join(process.cwd(), 'src/animated-weather-card.ts'), 'utf8');
        expect(source).toMatch(/import type \{[^}]*NoteWriter[^}]*\} from '\.\/note-generator'/);
        expect(source).not.toMatch(/import \{[^}]*\} from '\.\/note-generator'/);
        const bundle = readFileSync(join(process.cwd(), 'animated-weather-card.js'), 'utf8');
        expect(bundle).not.toContain('CARROT Weather');
        expect(bundle).not.toContain('ai_task/preferences/get');
    });

    it('fetches the note bundle the first time, with nothing shown until there is a note', async () => {
        await mount({}, false);
        expect(note()!.hidden).toBe(true);
        expect(document.querySelector('script[src*="animated-weather-card-note.js"]')).not.toBeNull();
        expect(card.getGridOptions().rows).toBe(5);
    });

    it('hands the writer the card, and shows what it writes', async () => {
        await mount({});
        const [writer] = FakeWriter.made;
        expect(writer.host).toBe(card);
        expect(writer.calls).toContain('start');
        expect(writer.host.noteVisible).toBe(true);

        writer.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
        expect(note()!.hidden).toBe(false);
        expect(note()!.querySelector('.note-long')!.textContent).toBe(NOTE);
        writer.host.showNote(null);
        expect(note()!.hidden).toBe(true);
    });

    const phrase = () => note()!.querySelector('.note-phrase')!.textContent;
    const typed = () => note()!.querySelector('.note-long .note-typed')?.textContent;
    const untyped = () => note()!.querySelector('.note-long .note-untyped')?.textContent;

    it('holds the note\'s place while a new one is written, saying what\'s happening, then types it in', async () => {
        await mount({});
        const [writer] = FakeWriter.made;
        writer.host.showNote({ line: 'Old line.', note: 'The old note.', writtenAt: Date.now() });
        writer.host.noteWriting('forecast');
        expect(note()!.hidden).toBe(false);
        expect(note()!.dataset.writing).toBe('');
        expect(note()!.getAttribute('aria-busy')).toBe('true');
        expect(phrase()).toBe('Reading the forecast');
        writer.host.noteWriting('writing');
        expect(phrase()).toBe('Writing the note');

        // The new note arrives under the status, then takes its place: no flash of the old one
        writer.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
        expect(note()!.dataset.writing).toBe('');
        writer.host.noteWriting(false);
        expect(note()!.dataset.writing).toBeUndefined();
        expect(note()!.hasAttribute('aria-busy')).toBe(false);
        // Typing: the whole note is there from the start, the rest still transparent
        expect(note()!.querySelector('.note-long')!.textContent).toBe(NOTE);
        await vi.advanceTimersByTimeAsync(600);
        expect(typed()!.length).toBeGreaterThan(0);
        expect(typed()!.length).toBeLessThan(NOTE.length);
        expect(typed()! + untyped()!).toBe(NOTE);
        // Done within the longest it takes, back to plain text
        await vi.advanceTimersByTimeAsync(1200);
        expect(note()!.querySelector('.note-typed')).toBeNull();
        expect(note()!.querySelector('.note-long')!.textContent).toBe(NOTE);
    });

    it('lets a note that\'s still typing finish, unless a different one arrives', async () => {
        await mount({});
        const [writer] = FakeWriter.made;
        writer.host.noteWriting('writing');
        writer.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
        writer.host.noteWriting(false);
        await vi.advanceTimersByTimeAsync(300);
        writer.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
        expect(note()!.querySelector('.note-typed')).not.toBeNull();
        writer.host.showNote({ line: 'Clearing.', note: 'Clearing by evening.', writtenAt: Date.now() });
        expect(note()!.querySelector('.note-typed')).toBeNull();
    });

    it('shows the note at once with reduced motion, or with animate: false', async () => {
        const matchMedia = window.matchMedia;
        window.matchMedia = ((query: string) => ({ ...matchMedia(query), matches: query.includes('reduce') })) as typeof window.matchMedia;
        try {
            await mount({});
            const [writer] = FakeWriter.made;
            writer.host.noteWriting('writing');
            writer.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
            writer.host.noteWriting(false);
            expect(note()!.querySelector('.note-typed')).toBeNull();
            expect(note()!.querySelector('.note-long')!.textContent).toBe(NOTE);
        } finally {
            window.matchMedia = matchMedia;
        }
        card.remove();
        await mount({ animate: false });
        const [still] = FakeWriter.made;
        still.host.noteWriting('writing');
        still.host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() });
        still.host.noteWriting(false);
        expect(note()!.querySelector('.note-typed')).toBeNull();
    });

    it('goes when a note that was on its way doesn\'t come', async () => {
        await mount({});
        const [writer] = FakeWriter.made;
        writer.host.noteWriting('writing');
        writer.host.noteWriting(false);
        expect(note()!.hidden).toBe(true);
        expect(note()!.dataset.writing).toBeUndefined();
    });

    it('tells the writer about new states, and stops it when the card leaves', async () => {
        await mount({});
        const [writer] = FakeWriter.made;
        card.hass = hass(undefined, 22);
        expect(writer.calls).toContain('hass');
        card.remove();
        expect(writer.calls[writer.calls.length - 1]).toBe('stop');
    });

    it('reads an entity instead when one is set, with no writer', async () => {
        await mount({ note_entity: 'sensor.weather_note' });
        expect(FakeWriter.made).toHaveLength(0);
    });

    it('hides a written note once it is three hours old', async () => {
        await mount({});
        FakeWriter.made[0].host.showNote({ line: LINE, note: NOTE, writtenAt: Date.now() - 181 * 60_000 });
        expect(note()!.hidden).toBe(true);
    });
});
