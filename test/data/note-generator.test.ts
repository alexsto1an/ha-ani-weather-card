import { describe, it, expect } from 'vitest';
import {
    computeFacts, factsKey, buildInstructions, parseNote, languageName, NOTE_STRUCTURE, NOTE_HOURS,
    ForecastEntry, FactsInput, VOICES, calendarWindows, CalendarEvent,
} from '../../src/note-generator';
import type { HassEntity } from '../../src/types';

// Local times, so the facts read the same in any time zone the tests run in
const NOW = new Date(2026, 9, 20, 10, 20).getTime();
const at = (hour: number) => new Date(2026, 9, 20, hour).toISOString();
const formatHour = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

function weather(state = 'cloudy', attributes: Record<string, unknown> = {}): HassEntity {
    return {
        entity_id: 'weather.home', state,
        attributes: { temperature: 14, apparent_temperature: 12, wind_speed: 18, temperature_unit: '°C', wind_speed_unit: 'km/h', precipitation_unit: 'mm', ...attributes },
    } as HassEntity;
}

const facts = (input: Partial<FactsInput>) => computeFacts({
    weather: weather(), forecast: null, forecastType: null, now: NOW, formatHour, ...input,
});

/** Hours from 10:00 to 21:00, shaped by a function of the hour. */
const hours = (shape: (hour: number) => Partial<ForecastEntry>, from = 10, count = 12): ForecastEntry[] =>
    Array.from({ length: count }, (_, i) => ({ datetime: at(from + i), ...shape(from + i) }));

// AccuWeather sends everything
const accuweather = hours(h => ({
    condition: h >= 15 && h < 18 ? 'rainy' : 'cloudy',
    temperature: 12 + (h < 15 ? h - 10 : 15 - h),
    apparent_temperature: 10 + (h < 15 ? h - 10 : 15 - h),
    precipitation_probability: h >= 15 && h < 18 ? 80 : 10,
    precipitation: h >= 15 && h < 18 ? 1.2 : 0,
    wind_speed: 18, wind_gust_speed: 30 + h, uv_index: h < 16 ? 3 : 0,
}));
// Met.no: no feels-like, no chance of rain; wet by the amount
const metno = hours(h => ({
    condition: h >= 15 && h < 18 ? 'rainy' : 'cloudy',
    temperature: 12, precipitation: h >= 15 && h < 18 ? 0.8 : 0, wind_speed: 18,
}));

describe('the note\'s facts', () => {
    it('reads a full forecast: when it gets wet and dries, the feels-like range, gusts and UV', () => {
        const f = facts({ forecast: accuweather, forecastType: 'hourly' });
        expect(f.forecast).toBe('hourly');
        expect(f.hours).toBe(NOTE_HOURS);
        expect(f.wet).toBe('later');
        expect(f.wetFrom).toBe('15:00');
        expect(f.dryFrom).toBe('18:00');
        expect(f.feelsLikeRange).toBe(true);
        expect(f.high).toBe(14);
        expect(f.low).toBe(4);
        expect(f.highAt).toBe('14:00');
        expect(f.lowAt).toBe('21:00');
        expect(f.gustMax).toBe(51);
        expect(f.uvMax).toBe(3);
        expect(f.missing).toEqual([]);
        expect(f.severe).toBeNull();
        expect(f.table[0]).toBe('10:00, cloudy, 12°C, feels 10°C, rain 10%, wind 18 km/h');
    });

    it('says what a sparser forecast leaves out, and ranges the air temperature instead', () => {
        const f = facts({ forecast: metno, forecastType: 'hourly' });
        expect(f.wet).toBe('later');
        expect(f.wetFrom).toBe('15:00');
        expect(f.feelsLikeRange).toBe(false);
        expect(f.high).toBe(12);
        expect(f.missing).toEqual(['feels-like temperatures ahead', 'the chance of rain', 'gusts', 'the UV index']);
        expect(f.table[0]).toBe('10:00, cloudy, 12°C, wind 18 km/h');
    });

    it('tells rain now that stops from rain all the way through', () => {
        const stops = facts({ weather: weather('rainy'), forecast: hours(h => ({ precipitation_probability: h < 13 ? 90 : 5 })), forecastType: 'hourly' });
        expect(stops.wet).toBe('now');
        expect(stops.dryFrom).toBe('13:00');
        const allDay = facts({ forecast: hours(() => ({ precipitation_probability: 70 })), forecastType: 'hourly' });
        expect(allDay.wet).toBe('all');
        const dry = facts({ forecast: hours(() => ({ precipitation_probability: 20 })), forecastType: 'hourly' });
        expect(dry.wet).toBe('none');
        // Raining now, though the hour's forecast didn't think so: wet now, dry from the next hour
        const caughtOut = facts({ weather: weather('rainy'), forecast: hours(() => ({ precipitation_probability: 10 })), forecastType: 'hourly' });
        expect(caughtOut.wet).toBe('now');
        expect(caughtOut.dryFrom).toBe('11:00');
    });

    it('names what falls: snow only when it\'s cold enough, or when the forecast says so', () => {
        const wetFrom3 = (temperature: number, condition?: string, unit = '°C') => facts({
            weather: weather('cloudy', { temperature_unit: unit }),
            forecast: hours(h => ({ temperature, condition, precipitation_probability: h >= 15 ? 80 : 10 })), forecastType: 'hourly',
        });
        expect(wetFrom3(12).precipitation).toBe('rain');
        expect(wetFrom3(2).precipitation).toBe('rain or snow');
        expect(wetFrom3(-3).precipitation).toBe('snow');
        expect(wetFrom3(30, undefined, '°F').precipitation).toBe('snow');
        // The forecast's own conditions win over the temperature
        expect(wetFrom3(5, 'snowy').precipitation).toBe('snow');
        expect(wetFrom3(-2, 'rainy').precipitation).toBe('rain');
        expect(wetFrom3(1, 'snowy-rainy').precipitation).toBe('sleet');
        const instructions = (f: ReturnType<typeof facts>) => buildInstructions(f, { tone: 'calm', language: 'English' });
        expect(instructions(wetFrom3(-3, 'snowy'))).toContain('- Snow from 15:00.');

        // Dry: what would fall, so a mild evening has no snow to mention
        const dry = (temperature: number) => facts({ forecast: hours(() => ({ temperature, precipitation_probability: 10 })), forecastType: 'hourly' });
        expect(instructions(dry(15))).toContain('- No rain expected in the next 12 hours.');
        expect(instructions(dry(1))).toContain('- No rain or snow expected in the next 12 hours.');
        // Snowing now, with no forecast
        expect(instructions(facts({ weather: weather('snowy', { temperature: -4 }) }))).toContain('- Snow now. Nothing known about later.');
    });

    it('starts from the hour under way and looks twelve hours ahead', () => {
        const f = facts({ forecast: hours(() => ({ temperature: 10 }), 6, 30), forecastType: 'hourly' });
        expect(f.table[0].startsWith('10:00')).toBe(true);
        expect(f.table).toHaveLength(NOTE_HOURS);
    });

    it('falls back to the day\'s forecast, with no hours to name', () => {
        const f = facts({
            forecast: [{ datetime: at(0), condition: 'rainy', temperature: 16, templow: 8, precipitation_probability: 70 }],
            forecastType: 'daily',
        });
        expect(f.forecast).toBe('daily');
        expect(f.high).toBe(16);
        expect(f.low).toBe(8);
        expect(f.wet).toBe('later');
        expect(f.wetFrom).toBeUndefined();
        expect(f.missing).toContain('the hours: the forecast is by day');
    });

    it('still has now when there is no forecast at all', () => {
        const f = facts({ weather: weather('rainy') });
        expect(f.forecast).toBeNull();
        expect(f.wet).toBe('now');
        expect(f.missing).toEqual(['the forecast']);
        expect(f.temperature).toBe(14);
        expect(f.feelsLike).toBe(12);
    });

    it('flags serious weather: storms, hail, heavy rain, gale gusts, dangerous cold and heat', () => {
        const hourly = (shape: (hour: number) => Partial<ForecastEntry>, attrs: Record<string, unknown> = {}) =>
            facts({ weather: weather('cloudy', attrs), forecast: hours(shape), forecastType: 'hourly' }).severe;
        expect(hourly(h => ({ condition: h === 15 ? 'lightning-rainy' : 'cloudy' }))).toBe('thunderstorms');
        expect(hourly(h => ({ condition: h === 15 ? 'hail' : 'cloudy' }))).toBe('hail');
        expect(hourly(h => ({ precipitation: h === 15 ? 9 : 0 }))).toBe('heavy rain');
        expect(hourly(h => ({ precipitation: h === 15 ? 0.4 : 0 }), { precipitation_unit: 'in' })).toBe('heavy rain');
        expect(hourly(h => ({ wind_gust_speed: h === 15 ? 80 : 20 }))).toBe('gale-force gusts');
        expect(hourly(h => ({ wind_gust_speed: h === 15 ? 50 : 10 }), { wind_speed_unit: 'mph' })).toBe('gale-force gusts');
        expect(hourly(() => ({ apparent_temperature: -25 }))).toBe('dangerous cold');
        expect(hourly(() => ({ apparent_temperature: 101 }), { temperature_unit: '°F', apparent_temperature: 90 })).toBe('dangerous heat');
        expect(hourly(() => ({ precipitation: 3, wind_gust_speed: 60, apparent_temperature: 30 }))).toBeNull();
        expect(facts({ weather: weather('lightning') }).severe).toBe('thunderstorms');
        // A day's total of rain is just a wet day
        expect(facts({ forecast: [{ datetime: at(0), precipitation: 20 }], forecastType: 'daily' }).severe).toBeNull();
    });

    it('reads the weather for each stretch out of the house', () => {
        const early = new Date(2026, 9, 20, 6, 10).getTime();
        const forecast = hours(h => ({
            apparent_temperature: h, precipitation_probability: h === 8 ? 60 : 10,
        }), 6, 12);
        const span = (from: [number, number], to: [number, number]) => ({ start: new Date(2026, 9, 20, ...from).getTime(), end: new Date(2026, 9, 20, ...to).getTime() });
        const f = facts({ forecast, forecastType: 'hourly', now: early, windows: [span([7, 30], [9, 0])] });
        expect(f.windows).toEqual([{ label: '07:30–09:00', low: 7, high: 8, wetChance: 60, wet: true }]);
        // Beyond the forecast's hours, nothing to say
        expect(facts({ forecast, forecastType: 'hourly', now: early, windows: [span([19, 0], [20, 0])] }).windows).toEqual([]);
        // A daily forecast has no hours to read
        expect(facts({ forecast: [{ datetime: at(0), temperature: 12 }], forecastType: 'daily', windows: [span([11, 0], [12, 0])] }).windows).toEqual([]);
    });

    it('takes the hours out from the calendar\'s timed events, not all-day, cancelled or online ones', () => {
        const time = (h: number, m = 0) => `2026-10-20T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        const event = (start: string, end: string, extra: Partial<CalendarEvent> = {}): CalendarEvent => ({ start, end, summary: 'Out', ...extra });
        const spans = calendarWindows([
            event('2026-10-20', '2026-10-21'),
            event(time(12), time(13), { status: 'CANCELLED' }),
            event(time(13), time(14), { location: 'https://meet.example.com/abc' }),
            event(time(14), time(15), { location: 'www.example.com/call' }),
            event(time(15), time(16), { status: 'TENTATIVE' }),
            event(time(18), time(19), { location: 'The dentist, High Street' }),
        ], NOW);
        const label = (span: { start: number; end: number }) => `${formatHour(new Date(span.start))}–${formatHour(new Date(span.end))}`;
        expect(spans.map(label)).toEqual(['15:00–16:00', '18:00–19:00']);
    });

    it('runs close events together, keeps an event under way whole, and stops at three', () => {
        const time = (h: number, m = 0) => `2026-10-20T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        const event = (from: [number, number], to: [number, number]): CalendarEvent => ({ start: time(...from), end: time(...to) });
        const label = (span: { start: number; end: number }) => `${formatHour(new Date(span.start))}–${formatHour(new Date(span.end))}`;
        // Under way since 09:00, ended at 08:00, overlapping, 20 minutes apart, then two more, one past the twelve hours
        const spans = calendarWindows([
            event([7, 0], [8, 0]), event([9, 0], [11, 0]), event([10, 30], [11, 30]),
            event([11, 50], [12, 30]), event([14, 0], [15, 0]), event([17, 0], [18, 0]), event([19, 0], [20, 0]),
            event([23, 0], [23, 30]),
        ], NOW);
        expect(spans.map(label)).toEqual(['09:00–12:30', '14:00–15:00', '17:00–18:00']);
        expect(calendarWindows([event([23, 0], [23, 30])], NOW)).toEqual([]);
        expect(calendarWindows([], NOW)).toEqual([]);
    });

    it('keys a note to what it says, not to small drifts in the numbers', () => {
        const base = facts({ forecast: accuweather, forecastType: 'hourly' });
        const warmer = facts({ forecast: accuweather.map(e => ({ ...e, apparent_temperature: e.apparent_temperature! + 0.4 })), forecastType: 'hourly' });
        expect(factsKey(warmer)).toBe(factsKey(base));
        const later = facts({ forecast: accuweather.map(e => ({ ...e, precipitation_probability: Date.parse(e.datetime) >= Date.parse(at(16)) && Date.parse(e.datetime) < Date.parse(at(18)) ? 80 : 10 })), forecastType: 'hourly' });
        expect(factsKey(later)).not.toBe(factsKey(base));
        expect(factsKey({ ...base, condition: 'rainy' })).not.toBe(factsKey(base));
        expect(factsKey({ ...base, severe: 'hail' })).not.toBe(factsKey(base));
    });
});

describe('the note\'s instructions', () => {
    const base = facts({ forecast: accuweather, forecastType: 'hourly', windows: [] });

    it('gives the voice, the rules, the facts and the hours', () => {
        const text = buildInstructions(base, { tone: 'snarky', language: 'German' });
        expect(text).toContain('CARROT Weather');
        expect(text).toContain('Write in German.');
        expect(text).toContain('"line": at most 6 words (40 characters)');
        expect(text).toContain('"note": at most 15 words (90 characters)');
        expect(text).toContain("- Now (already on the card, don't repeat it): cloudy, 14°C, feels like 12°C, wind 18 km/h.");
        expect(text).toContain('The card already shows the place, the condition and temperature right now');
        expect(text).toContain("- Don't repeat what the card shows: never lead with the current condition or temperature.");
        expect(text).toContain('- Rain from 15:00, dry again from 18:00.');
        expect(text).toContain('Mention only the kinds of precipitation the facts mention.');
        expect(text).toContain('- Feels like 14°C at its warmest (14:00) and 4°C at its coldest (21:00) over the next 12 hours.');
        expect(text).toContain('By the hour:\n10:00, cloudy');
        expect(text).not.toContain('Not known');
        // The voice comes last, after the hours, with its examples
        expect(text.indexOf('Voice: Snarky')).toBeGreaterThan(text.indexOf('By the hour:'));
        expect(text).toContain(`- line: ${VOICES.snarky.examples[0][0]} / note: ${VOICES.snarky.examples[0][1]}`);
        expect(text).toContain('Carry the voice into German with its own idioms');
        expect(buildInstructions(base, { tone: 'snarky', language: 'English' })).not.toContain('Carry the voice');
    });

    it('drops the jokes when the weather is serious, whatever the tone', () => {
        const text = buildInstructions({ ...base, severe: 'thunderstorms' }, { tone: 'snarky', language: 'English' });
        expect(text).toContain('Voice: the weather is serious (thunderstorms). Drop the jokes');
        expect(text).not.toContain('CARROT');
        expect(text).not.toContain('Examples');
    });

    it('gives every voice examples that fit the note\'s budgets and rules', () => {
        const words = (text: string) => text.split(/\s+/).length;
        for (const [tone, voice] of Object.entries(VOICES)) {
            expect(voice.examples.length, tone).toBeGreaterThanOrEqual(3);
            // Short examples, so the budget reads as a ceiling, not a target
            for (const [line, note] of voice.examples) {
                expect(words(line) <= 6 && line.length <= 40, `${tone}: ${line}`).toBe(true);
                expect(words(note) <= 12 && note.length <= 90, `${tone}: ${note}`).toBe(true);
                expect(`${line} ${note}`, tone).not.toMatch(/["“”«»—]/);
            }
        }
    });

    it('sets the voices apart by how they write, not only by a word', () => {
        const text = (tone: keyof typeof VOICES) => VOICES[tone].examples.flat().join(' ');
        // Calm never talks to the reader; friendly does
        expect(text('calm')).not.toMatch(/\byou/i);
        expect(text('friendly')).toMatch(/\byou/i);
        // Calm and dry never exclaim; friendly may, once
        expect(text('calm')).not.toContain('!');
        expect(text('dry')).not.toContain('!');
        for (const [line, note] of VOICES.friendly.examples) expect(`${line} ${note}`.split('!').length - 1).toBeLessThanOrEqual(1);
        // Snarky and dry are told every line carries a joke; calm and friendly don't joke
        const joke = 'carries a joke of your own';
        expect(buildInstructions(base, { tone: 'snarky', language: 'English' })).toContain(joke);
        expect(buildInstructions(base, { tone: 'dry', language: 'English' })).toContain(joke);
        expect(buildInstructions(base, { tone: 'calm', language: 'English' })).not.toContain(joke);
        expect(buildInstructions(base, { tone: 'friendly', language: 'English' })).not.toContain(joke);
        // No two voices share an example
        const all = Object.values(VOICES).flatMap(voice => voice.examples.flat());
        expect(new Set(all).size).toBe(all.length);
    });

    it('names what the forecast doesn\'t say, so the model doesn\'t guess', () => {
        const text = buildInstructions(facts({ forecast: metno, forecastType: 'hourly' }), { tone: 'calm', language: 'English' });
        expect(text).toContain('Not known: feels-like temperatures ahead; the chance of rain; gusts; the UV index.');
        expect(text).toContain('Apple Weather');
    });
});

describe('reading the note back', () => {
    it('asks for a line and a note, both required, as text', () => {
        expect(Object.keys(NOTE_STRUCTURE)).toEqual(['line', 'note']);
        for (const field of Object.values(NOTE_STRUCTURE)) {
            expect(field.required).toBe(true);
            expect(field.selector).toEqual({ text: {} });
        }
    });

    it('straightens what comes back: one line, trimmed, no quotes around it', () => {
        expect(parseNote({ line: ' "Grey again."  ', note: '“Grey,\n damp,  committed to the bit.”' }))
            .toEqual({ line: 'Grey again.', note: 'Grey, damp, committed to the bit.' });
        expect(parseNote('{"line":"Sunny.","note":"Sunny, and smug about it."}')).toEqual({ line: 'Sunny.', note: 'Sunny, and smug about it.' });
    });

    it('lets one length stand in for the other, and has nothing for an empty answer', () => {
        expect(parseNote({ line: 'Only this.' })).toEqual({ line: 'Only this.', note: 'Only this.' });
        expect(parseNote('Just text.')).toEqual({ line: 'Just text.', note: 'Just text.' });
        expect(parseNote({ line: ' ', note: '' })).toBeNull();
        expect(parseNote(null)).toBeNull();
        expect(parseNote(42)).toBeNull();
    });

    it('names the language for the model', () => {
        expect(languageName('de')).toBe('German');
        expect(languageName('pt-BR')).toBe('Brazilian Portuguese');
    });
});
