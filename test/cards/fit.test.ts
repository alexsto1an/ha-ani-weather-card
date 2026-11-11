import { describe, it, expect, afterEach, vi } from 'vitest';
import { HEIGHT_STEPS, NOTE_FIT_STEPS } from '../../src/animated-weather-card';

type Card = HTMLElement & { setConfig(config: object): void; hass: unknown; applySizeState(): void };

const hass = {
    states: {
        'weather.home': {
            entity_id: 'weather.home', state: 'partlycloudy',
            attributes: { temperature: 21, humidity: 55, apparent_temperature: 20, pressure: 1016, wind_speed: 13, friendly_name: 'Home', temperature_unit: '°C' },
        },
        'sensor.indoor_temperature': { entity_id: 'sensor.indoor_temperature', state: '24', attributes: { unit_of_measurement: '°C' } },
        'sensor.weather_note': {
            entity_id: 'sensor.weather_note', state: 'Sun with commitment issues.',
            attributes: { note: 'The sun keeps ducking behind the clouds. A light jacket covers its mood swings.' },
        },
    },
    config: { time_zone: 'UTC' },
    language: 'en',
    localize: () => '',
};

/**
 * What each step measures on a phone's 353 px column, in Chrome: the hero's
 * natural height, the metric block's, and the gap between them. jsdom has
 * no layout, so the test lays the card out from these numbers, the way
 * the browser would: the hero gets what the frame leaves after the
 * padding, the gap and the metrics, and overflows when its content is
 * taller than that.
 */
const MEASURED = {
    regular: { hero: 148, attrs: 108, gap: 20 },
    compact: { hero: 126, attrs: 108, gap: 20 },
    short: { hero: 104, attrs: 104, gap: 12 },
    tight: { hero: 84, attrs: 104, gap: 12 },
    minimal: { hero: 75, attrs: 66, gap: 12 },
} as const;
type Measure = { hero: number; attrs: number; gap: number };

/**
 * The same column with a note and an Indoors line, at each step of
 * NOTE_FIT_STEPS (height/note): the note's two lines, its one line, snug's
 * smaller temperature, then none.
 */
const PHONE_WITH_NOTE: Record<string, Measure> = {
    'regular/long': { hero: 198, attrs: 107, gap: 20 },
    'close/long': { hero: 190, attrs: 103, gap: 12 },
    'regular/line': { hero: 178, attrs: 107, gap: 20 },
    'snug/line': { hero: 152, attrs: 103, gap: 12 },
    'regular/none': { hero: 148, attrs: 107, gap: 20 },
    'compact/none': { hero: 126, attrs: 107, gap: 20 },
    'short/none': { hero: 104, attrs: 103, gap: 12 },
    'tight/none': { hero: 84, attrs: 103, gap: 12 },
    'minimal/none': { hero: 75, attrs: 65, gap: 12 },
};

/**
 * A 503 px card with the metrics in one row as values only, an Indoors
 * line and a note, as a report showed it (24 px padding from 460 px).
 */
const WIDE_VALUES_WITH_NOTE: Record<string, Measure> = {
    'regular/long': { hero: 214, attrs: 38, gap: 20 },
    'close/long': { hero: 206, attrs: 34, gap: 12 },
    'regular/line': { hero: 194, attrs: 38, gap: 20 },
    'snug/line': { hero: 154, attrs: 34, gap: 12 },
    'regular/none': { hero: 164, attrs: 38, gap: 20 },
    'compact/none': { hero: 142, attrs: 38, gap: 20 },
    'short/none': { hero: 106, attrs: 34, gap: 12 },
    'tight/none': { hero: 86, attrs: 34, gap: 12 },
    'minimal/none': { hero: 77, attrs: 32, gap: 12 },
};

/**
 * A 430 px card with the metrics in one row as values only, an Indoors
 * line and a note that takes three lines, as another report showed it.
 */
const THREE_LINES_WITH_NOTE: Record<string, Measure> = {
    'regular/long': { hero: 218, attrs: 35, gap: 20 },
    'close/long': { hero: 210, attrs: 31, gap: 12 },
    'regular/line': { hero: 178, attrs: 35, gap: 20 },
    'snug/line': { hero: 152, attrs: 31, gap: 12 },
    'regular/none': { hero: 148, attrs: 35, gap: 20 },
    'compact/none': { hero: 126, attrs: 35, gap: 20 },
    'short/none': { hero: 104, attrs: 31, gap: 12 },
    'tight/none': { hero: 84, attrs: 31, gap: 12 },
    'minimal/none': { hero: 75, attrs: 29, gap: 12 },
};

const rows = (n: number) => n * 56 + (n - 1) * 8;

describe('the card steps down to the roomiest layout that fits', () => {
    let card: Card;

    /** Lay the card out in a frame from measured numbers: without a note, or with one from a table keyed height/note */
    async function mount(frameHeight: number, withNote?: Record<string, Measure>, padding = 40, clampedLong = false): Promise<HTMLElement> {
        vi.useFakeTimers();
        card = document.createElement('animated-weather-card') as Card;
        card.setConfig({
            type: 'custom:animated-weather-card', entity: 'weather.home',
            ...(withNote ? { note_entity: 'sensor.weather_note', indoor_temperature_entity: 'sensor.indoor_temperature' } : {}),
        });
        card.hass = hass;
        document.body.appendChild(card);
        await vi.advanceTimersByTimeAsync(500);
        const sky = card.querySelector('.animated-weather-card') as HTMLElement;
        const info = sky.querySelector('.weather-info') as HTMLElement;
        const hero = sky.querySelector('.main-weather-info') as HTMLElement;
        const step = (): Measure => withNote
            ? withNote[`${sky.dataset.height}/${sky.dataset.note}`]
            : MEASURED[(sky.dataset.height ?? 'regular') as keyof typeof MEASURED];
        // The frame's border box is the card; the hero shrinks (flex: 0 1 auto; min-height: 0)
        // rather than push the metrics out, so the info box itself never overflows
        const inner = frameHeight - 2;
        Object.defineProperty(info, 'clientHeight', { configurable: true, get: () => inner });
        Object.defineProperty(info, 'scrollHeight', { configurable: true, get: () => inner });
        Object.defineProperty(hero, 'clientHeight', { configurable: true, get: () => Math.min(step().hero, inner - padding - step().gap - step().attrs) });
        Object.defineProperty(hero, 'scrollHeight', { configurable: true, get: () => step().hero });
        // A longer note too long for its four-line clamp: the clamp cuts it short
        const note = sky.querySelector('.weather-note') as HTMLElement | null;
        if (note) {
            Object.defineProperty(note, 'clientHeight', { configurable: true, get: () => sky.dataset.note === 'long' ? 80 : 20 });
            Object.defineProperty(note, 'scrollHeight', { configurable: true, get: () => sky.dataset.note === 'long' && clampedLong ? 140 : (sky.dataset.note === 'long' ? 80 : 20) });
        }
        card.applySizeState();
        return sky;
    }

    afterEach(() => {
        card?.remove();
        vi.useRealTimers();
    });

    it('tries the steps from the roomiest to the smallest', () => {
        expect([...HEIGHT_STEPS]).toEqual(['regular', 'compact', 'short', 'tight', 'minimal']);
    });

    it('keeps the full card in a tall frame', async () => {
        expect((await mount(330)).dataset.height).toBe('regular');
    });

    it('drops the line under the condition first', async () => {
        expect((await mount(300)).dataset.height).toBe('compact');
    });

    it('lands on tight in a phone\'s four-row section, with the labels kept', async () => {
        // Home Assistant's default 12 × 4: four 56 px rows and three 8 px gaps
        const sky = await mount(4 * 56 + 3 * 8);
        expect(sky.dataset.height).toBe('tight');
        expect(sky.querySelector('.attribute-label > span')).not.toBeNull();
    });

    it('gives up the labels only once the location alone is not enough', async () => {
        expect((await mount(230)).dataset.height).toBe('minimal');
        expect((await mount(200)).dataset.height).toBe('minimal');
    });

    it('ends on minimal when even that overflows, so the hero gives way instead of the metrics', async () => {
        expect((await mount(3 * 56 + 2 * 8)).dataset.height).toBe('minimal');
    });

    it('gives a note up first: closer spacing, then shorter, then the temperature smaller to keep it, then gone, before anything else', () => {
        expect(NOTE_FIT_STEPS.map(([height, note]) => `${height}/${note}`)).toEqual([
            'regular/long', 'close/long', 'regular/line', 'snug/line',
            'regular/none', 'compact/none', 'short/none', 'tight/none', 'minimal/none',
        ]);
    });

    it('keeps the line under the condition and shows the note\'s one line in a phone\'s five rows', async () => {
        const sky = await mount(rows(5), PHONE_WITH_NOTE);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['snug', 'line']);
    });

    it('shows the whole note with six rows', async () => {
        const sky = await mount(rows(6), PHONE_WITH_NOTE);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['regular', 'long']);
    });

    it('leaves the note out of a four-row section, the card as it would be without one', async () => {
        const sky = await mount(rows(4), PHONE_WITH_NOTE);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['tight', 'none']);
    });

    it('keeps the Indoors line and the full temperature on a wide five-row card, with the whole note', async () => {
        // The report: the note had pushed the Indoors line out of this frame
        const sky = await mount(rows(5), WIDE_VALUES_WITH_NOTE, 48);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['close', 'long']);
    });

    it('closes the spacing up for a note\'s third line before shortening it', async () => {
        // The report: a three-line note in a five-row card that had room for it, give or take a gap
        const sky = await mount(rows(5), THREE_LINES_WITH_NOTE);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['close', 'long']);
    });

    it('shows a note whole or not at all: one its clamp would cut short gives way to the line', async () => {
        const sky = await mount(rows(6), PHONE_WITH_NOTE, 40, true);
        expect([sky.dataset.height, sky.dataset.note]).toEqual(['regular', 'line']);
    });

    it('has no note step without a note', async () => {
        expect((await mount(rows(5))).dataset.note).toBeUndefined();
    });
});
