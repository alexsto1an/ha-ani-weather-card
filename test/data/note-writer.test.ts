import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { NoteWriter, NoteHost, NoteStage, noteStorageKey, noteCalendars, StoredNote, NOTE_PROMPT_VERSION, CalendarEvent } from '../../src/note-generator';
import type { WeatherNote } from '../../src/weather-data';

type Message = Record<string, any>;
type Listener = (message: any) => void;

/**
 * A Home Assistant with an AI Task: a user-data store shared by every
 * "screen" made from it, a forecast to subscribe to, and an AI that
 * answers however a test says.
 */
/** Twelve cloudy hours from now, at a temperature */
function forecastAt(temperature: number) {
    const hour = new Date(Date.now());
    hour.setMinutes(0, 0, 0);
    return Array.from({ length: 12 }, (_, i) => ({
        datetime: new Date(hour.getTime() + i * 3600_000).toISOString(),
        condition: 'cloudy', temperature, apparent_temperature: temperature - 2, precipitation_probability: 10,
    }));
}

function homeAssistant(options: { components?: string[]; defaultEntity?: string | null; features?: number; forecast?: boolean; events?: Record<string, CalendarEvent[]> } = {}) {
    const store = new Map<string, unknown>();
    const listeners = new Map<string, Set<Listener>>();
    const service = vi.fn(async (..._args: unknown[]): Promise<any> => ({ response: { data: { line: 'Grey, again.', note: 'Grey and damp, with no plans to change. Hood up.' } } }));
    // calendar.get_events: each calendar's events, from options.events
    const calendar = vi.fn(async (..._args: unknown[]): Promise<any> => ({
        response: Object.fromEntries(Object.entries(options.events ?? {}).map(([id, events]) => [id, { events }])),
    }));
    const ws: Message[] = [];
    const weather = (state = 'cloudy') => ({
        entity_id: 'weather.home', state,
        attributes: { temperature: 14, apparent_temperature: 12, temperature_unit: '°C', supported_features: options.features ?? 3 },
    });
    const make = () => ({
        states: { 'weather.home': weather() } as Record<string, any>,
        config: { components: options.components ?? ['weather', 'ai_task'], unit_system: { temperature: '°C' } },
        language: 'en',
        locale: { language: 'en', time_format: '24' },
        connection: {
            subscribeMessage: vi.fn(async (listener: Listener, message: Message) => {
                const channel = message.type === 'frontend/subscribe_user_data' ? `user:${message.key}` : `forecast:${message.forecast_type}`;
                if (!listeners.has(channel)) listeners.set(channel, new Set());
                listeners.get(channel)!.add(listener);
                if (message.type === 'frontend/subscribe_user_data') listener({ value: store.get(message.key) ?? null });
                // Home Assistant answers a forecast subscription straight away
                else if (options.forecast !== false) listener({ type: message.forecast_type, forecast: forecastAt(14) });
                return () => listeners.get(channel)!.delete(listener);
            }),
        },
        callWS: vi.fn(async (message: Message) => {
            ws.push(message);
            if (message.type === 'ai_task/preferences/get') return { gen_data_entity_id: options.defaultEntity === undefined ? 'ai_task.claude' : options.defaultEntity };
            if (message.type === 'frontend/set_user_data') {
                store.set(message.key, message.value);
                for (const listener of listeners.get(`user:${message.key}`) ?? []) listener({ value: message.value });
            }
            return null;
        }),
        callService: (domain: string, ...rest: unknown[]) => domain === 'calendar' ? calendar(domain, ...rest) : service(domain, ...rest),
    });
    return { make, store, service, calendar, ws, weather, listeners };
}

function screen(hass: any, config: Record<string, unknown> = {}) {
    const notes: (WeatherNote | null)[] = [];
    /** What the card shows over time: a note's line, "…" for the placeholder, or "" for none */
    const seen: string[] = [];
    const stages: (NoteStage | false)[] = [];
    const host: NoteHost & { notes: typeof notes; visible: boolean; writing: NoteStage | false } = {
        hass, config: { entity: 'weather.home', show_note: true, ...config } as any,
        visible: true,
        writing: false,
        get noteVisible() { return this.visible; },
        notes,
        showNote(note) { notes.push(note); record(); },
        noteWriting(stage) {
            this.writing = stage;
            if (stages[stages.length - 1] !== stage) stages.push(stage);
            record();
        },
    };
    function record() {
        const now = host.writing ? '…' : (notes[notes.length - 1]?.line ?? '');
        if (seen[seen.length - 1] !== now) seen.push(now);
    }
    const writer = new NoteWriter(host);
    return { host, writer, seen, stages, shown: () => notes[notes.length - 1] ?? null, writing: () => !!host.writing };
}

const settle = () => vi.advanceTimersByTimeAsync(0);

describe('writing the note', () => {
    let warn: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.useFakeTimers({ now: new Date(2026, 9, 20, 10, 20) });
        warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    });

    afterEach(() => {
        warn.mockRestore();
        vi.useRealTimers();
    });

    it('asks the default AI Task, shows the answer and keeps it for the user\'s other screens', async () => {
        const ha = homeAssistant();
        const { writer, shown } = screen(ha.make());
        writer.start();
        await settle();

        expect(ha.service).toHaveBeenCalledTimes(1);
        const [domain, action, task, target, notify, returnResponse] = ha.service.mock.calls[0] as any[];
        expect([domain, action, target, notify, returnResponse]).toEqual(['ai_task', 'generate_data', undefined, false, true]);
        expect(task.entity_id).toBeUndefined();
        expect(Object.keys(task.structure)).toEqual(['line', 'note']);
        expect(task.instructions).toContain('Write in English.');

        expect(shown()).toMatchObject({ line: 'Grey, again.', note: 'Grey and damp, with no plans to change. Hood up.' });
        const stored = ha.store.get(noteStorageKey({ entity: 'weather.home' })) as StoredNote;
        expect(stored.signature).toBe(`${NOTE_PROMPT_VERSION}:°C`);
        expect(stored).toMatchObject({ line: 'Grey, again.', condition: 'cloudy', claim: null });

        // Said it was writing before it asked, so other screens wait
        const saves = ha.ws.filter(m => m.type === 'frontend/set_user_data');
        expect(saves[0].value.claim).toMatchObject({ at: Date.now() });
    });

    it('asks the AI Task entity it was given, by name', async () => {
        const ha = homeAssistant();
        const { writer } = screen(ha.make(), { note_ai_task_entity: 'ai_task.openai' });
        writer.start();
        await settle();
        expect((ha.service.mock.calls[0] as any[])[2].entity_id).toBe('ai_task.openai');
        expect(ha.ws.some(m => m.type === 'ai_task/preferences/get')).toBe(false);
    });

    it('shows a stored note on another screen without asking again', async () => {
        const ha = homeAssistant();
        screen(ha.make()).writer.start();
        await settle();
        const other = screen(ha.make());
        other.writer.start();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
        expect(other.shown()?.line).toBe('Grey, again.');
    });

    it('asks once when two cards on one page want the same note', async () => {
        const ha = homeAssistant();
        const hass = ha.make();
        screen(hass).writer.start();
        screen(hass).writer.start();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
    });

    it('waits for a screen that said it is writing, but not forever', async () => {
        const ha = homeAssistant();
        ha.store.set(noteStorageKey({ entity: 'weather.home' }), { claim: { by: 'another screen', at: Date.now() } });
        const { writer } = screen(ha.make());
        writer.start();
        await settle();
        expect(ha.service).not.toHaveBeenCalled();
        // The other screen never finished; the next look writes it here
        await vi.advanceTimersByTimeAsync(5 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
    });

    it('shows nothing without an AI Task, and says why once', async () => {
        const ha = homeAssistant({ components: ['weather'] });
        const { writer, shown } = screen(ha.make());
        writer.start();
        await settle();
        writer.wake();
        await settle();
        expect(ha.service).not.toHaveBeenCalled();
        expect(shown()).toBeNull();
        expect(warn).toHaveBeenCalledTimes(1);
        expect(String(warn.mock.calls[0][0])).toContain('2025.8');
    });

    it('shows nothing without a default AI Task entity or one of its own', async () => {
        const ha = homeAssistant({ defaultEntity: null });
        const { writer, shown } = screen(ha.make());
        writer.start();
        await settle();
        expect(ha.service).not.toHaveBeenCalled();
        expect(shown()).toBeNull();
        expect(String(warn.mock.calls[0][0])).toContain('Settings → System → AI');
    });

    it('gives up after 30 seconds, shows nothing, and tries again ten minutes later', async () => {
        const ha = homeAssistant();
        ha.service.mockImplementationOnce(() => new Promise(() => {}));
        const { writer, shown } = screen(ha.make());
        writer.start();
        await vi.advanceTimersByTimeAsync(30_000);
        expect(shown()).toBeNull();
        expect(String(warn.mock.calls[0][0])).toContain('30 s');
        // The claim is let go, so another screen may try
        expect((ha.store.get(noteStorageKey({ entity: 'weather.home' })) as StoredNote).claim).toBeNull();

        // Checked every five minutes: not at 5 or 10 (9.5 minutes after the failure), at 15
        await vi.advanceTimersByTimeAsync(10 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(5 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(2);
        expect(shown()?.line).toBe('Grey, again.');
    });

    it('rewrites the note when the condition changes, and drops the old one meanwhile', async () => {
        const ha = homeAssistant();
        const hass = ha.make();
        const { host, writer, shown } = screen(hass);
        writer.start();
        await settle();
        let answered: (value: unknown) => void = () => {};
        ha.service.mockImplementationOnce(() => new Promise(resolve => { answered = resolve; }));

        host.hass = { ...hass, states: { 'weather.home': ha.weather('rainy') } } as any;
        writer.hassChanged();
        expect(shown()).toBeNull();
        await settle();
        answered({ response: { data: { line: 'Rain. Of course.', note: 'Rain settling in. The umbrella was a good idea.' } } });
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(2);
        expect(shown()?.line).toBe('Rain. Of course.');
    });

    it('writes only while the card can be seen, and catches up when it can', async () => {
        const ha = homeAssistant();
        const { host, writer } = screen(ha.make());
        host.visible = false;
        writer.start();
        await settle();
        expect(ha.service).not.toHaveBeenCalled();
        host.visible = true;
        writer.wake();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
    });

    it('replaces a note written from older instructions straight away, without showing it', async () => {
        const ha = homeAssistant();
        const key = noteStorageKey({ entity: 'weather.home' });
        ha.store.set(key, {
            signature: `${NOTE_PROMPT_VERSION - 1}:°C`, facts: '', condition: 'cloudy',
            line: 'The old voice.', note: 'Written before the voices changed.', written: Date.now() - 60_000, claim: null,
        } satisfies StoredNote);
        const { writer, seen } = screen(ha.make());
        writer.start();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
        expect(seen).not.toContain('The old voice.');
        expect((ha.store.get(key) as StoredNote).line).toBe('Grey, again.');
    });

    it('rewrites a note an hour old', async () => {
        const ha = homeAssistant();
        const { writer } = screen(ha.make());
        writer.start();
        await settle();
        await vi.advanceTimersByTimeAsync(55 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
        await vi.advanceTimersByTimeAsync(5 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(2);
    });

    it('reads the hourly forecast where the entity has one, else the daily', async () => {
        const hourly = homeAssistant({ features: 3 });
        const a = hourly.make();
        screen(a).writer.start();
        const daily = homeAssistant({ features: 1 });
        const b = daily.make();
        screen(b).writer.start();
        await settle();
        const asked = (hass: any) => hass.connection.subscribeMessage.mock.calls.map((c: any[]) => c[1]).find((m: Message) => m.type === 'weather/subscribe_forecast');
        expect(asked(a)).toEqual({ type: 'weather/subscribe_forecast', entity_id: 'weather.home', forecast_type: 'hourly' });
        expect(asked(b).forecast_type).toBe('daily');
    });

    it('waits for the forecast before writing, but not forever', async () => {
        const ha = homeAssistant({ forecast: false });
        const { writer } = screen(ha.make());
        writer.start();
        await settle();
        expect(ha.service).not.toHaveBeenCalled();
        await vi.advanceTimersByTimeAsync(10_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
        expect((ha.service.mock.calls[0] as any[])[2].instructions).toContain('Not known: the forecast');
    });

    it('writes from the forecast it was sent', async () => {
        const ha = homeAssistant();
        screen(ha.make()).writer.start();
        await settle();
        expect((ha.service.mock.calls[0] as any[])[2].instructions).toContain('Feels like 12°C all through the next 12 hours.');
    });

    it('finishes starting when Home Assistant arrives, and stays stopped once stopped', async () => {
        const ha = homeAssistant();
        const { host, writer } = screen(undefined);
        writer.start();
        await settle();
        host.hass = ha.make();
        writer.hassChanged();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);

        writer.stop();
        const later = ha.make();
        host.hass = later;
        writer.hassChanged();
        await settle();
        expect(later.connection.subscribeMessage).not.toHaveBeenCalled();
    });

    it('holds the place of a first note while it\'s written, then shows it', async () => {
        const ha = homeAssistant();
        let answer: (value: unknown) => void = () => {};
        ha.service.mockImplementationOnce(() => new Promise(resolve => { answer = resolve; }));
        const { writer, seen, writing } = screen(ha.make());
        writer.start();
        await settle();
        expect(writing()).toBe(true);
        answer({ response: { data: { line: 'Grey, again.', note: 'Grey and damp. Hood up.' } } });
        await settle();
        expect(seen).toEqual(['', '…', 'Grey, again.']);
    });

    it('says what\'s happening: waiting for the forecast, then writing', async () => {
        const ha = homeAssistant({ forecast: false });
        let answer: (value: unknown) => void = () => {};
        ha.service.mockImplementationOnce(() => new Promise(resolve => { answer = resolve; }));
        const { writer, stages } = screen(ha.make());
        writer.start();
        await settle();
        expect(stages).toEqual(['forecast']);
        // No forecast after ten seconds: written from now alone
        await vi.advanceTimersByTimeAsync(10_000);
        expect(stages).toEqual(['forecast', 'writing']);
        answer({ response: { data: { line: 'Grey.', note: 'Grey and damp.' } } });
        await settle();
        expect(stages).toEqual(['forecast', 'writing', false]);
    });

    it('coming back to a note that\'s due, holds its place instead of showing the old one first', async () => {
        const ha = homeAssistant();
        const { host, writer, seen } = screen(ha.make());
        writer.start();
        await settle();
        // Away for an hour and a half: nothing written while the card can't be seen
        host.visible = false;
        writer.wake();
        await vi.advanceTimersByTimeAsync(90 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
        ha.service.mockResolvedValueOnce({ response: { data: { line: 'Clearing later.', note: 'Clearing by evening. Leave the umbrella.' } } });
        host.visible = true;
        writer.wake();
        await settle();
        expect(seen.slice(-3)).toEqual(['Grey, again.', '…', 'Clearing later.']);
    });

    it('while the card stays in view, lets the hourly note fade through, with no placeholder', async () => {
        const ha = homeAssistant();
        const { writer, seen } = screen(ha.make());
        writer.start();
        await settle();
        ha.service.mockResolvedValueOnce({ response: { data: { line: 'Still grey.', note: 'Still grey, still damp.' } } });
        await vi.advanceTimersByTimeAsync(60 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(2);
        expect(seen).toEqual(['', '…', 'Grey, again.', 'Still grey.']);
    });

    it('shows no placeholder for a note that can\'t come', async () => {
        const without = screen(homeAssistant({ components: ['weather'] }).make());
        without.writer.start();
        await settle();
        expect(without.seen).not.toContain('…');

        // No default AI Task: found out on the first try, and the retries stay out of sight
        const noDefault = screen(homeAssistant({ defaultEntity: null }).make());
        noDefault.writer.start();
        await settle();
        expect(noDefault.writing()).toBe(false);
        const placeholders = noDefault.seen.filter(s => s === '…').length;
        await vi.advanceTimersByTimeAsync(15 * 60_000);
        expect(noDefault.seen.filter(s => s === '…').length).toBe(placeholders);
    });

    it('holds the place while another screen writes, and stops waiting when its claim runs out', async () => {
        const ha = homeAssistant();
        ha.store.set(noteStorageKey({ entity: 'weather.home' }), { claim: { by: 'another screen', at: Date.now() } });
        const { writer, writing } = screen(ha.make());
        writer.start();
        await settle();
        expect(writing()).toBe(true);
        expect(ha.service).not.toHaveBeenCalled();
        // The claim lasts 45 seconds; then this screen writes it
        await vi.advanceTimersByTimeAsync(46_000);
        expect(ha.service).toHaveBeenCalledTimes(1);
        expect(writing()).toBe(false);
    });

    it('stops listening when stopped', async () => {
        const ha = homeAssistant();
        const { writer } = screen(ha.make());
        writer.start();
        await settle();
        expect([...ha.listeners.values()].reduce((n, set) => n + set.size, 0)).toBe(2);
        writer.stop();
        await settle();
        expect([...ha.listeners.values()].reduce((n, set) => n + set.size, 0)).toBe(0);
    });

    it('settles when two cards differ in what they ask for, rather than rewriting each other\'s note', async () => {
        const ha = homeAssistant();
        screen(ha.make(), { note_calendar: 'calendar.family' }).writer.start();
        screen(ha.make()).writer.start();
        screen(ha.make(), { note_ai_task_entity: 'ai_task.openai' }).writer.start();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(3);
        await vi.advanceTimersByTimeAsync(5 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(3);
    });

    it('lets a young note stand when this screen reads the facts a little differently', async () => {
        const ha = homeAssistant();
        const { writer } = screen(ha.make());
        writer.start();
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
        // A much warmer forecast a minute later, same condition: the facts differ, the note stands
        await vi.advanceTimersByTimeAsync(60_000);
        for (const listener of ha.listeners.get('forecast:hourly') ?? []) listener({ type: 'hourly', forecast: forecastAt(24) });
        await settle();
        expect(ha.service).toHaveBeenCalledTimes(1);
        // Fifteen minutes on, the next look rewrites it
        await vi.advanceTimersByTimeAsync(15 * 60_000);
        expect(ha.service).toHaveBeenCalledTimes(2);
    });

    describe('with a calendar', () => {
        const today = (h: number, m = 0) => `2026-10-20T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`;
        const dentist: CalendarEvent = { start: today(17), end: today(19), summary: 'Dentist appointment', location: 'Smile Clinic, High Street', description: 'Bring the referral letter' };
        const instructions = (ha: ReturnType<typeof homeAssistant>, call = 0) => (ha.service.mock.calls[call] as any[])[2].instructions as string;

        it('reads its events and tells the AI only when you\'re out, never what for', async () => {
            const ha = homeAssistant({ events: { 'calendar.family': [dentist, { start: '2026-10-20', end: '2026-10-21', summary: 'Holiday' }] } });
            screen(ha.make(), { note_calendar: 'calendar.family' }).writer.start();
            await settle();
            expect(ha.calendar).toHaveBeenCalledWith('calendar', 'get_events', { duration: { hours: 12 } }, { entity_id: ['calendar.family'] }, false, true);
            expect(ha.service).toHaveBeenCalledTimes(1);
            const text = instructions(ha);
            expect(text).toContain('Out of the house 17:00–19:00');
            for (const secret of ['Dentist', 'Smile Clinic', 'High Street', 'referral', 'Holiday']) expect(text).not.toContain(secret);
        });

        it('waits for the calendar before the first note, but not forever', async () => {
            const ha = homeAssistant();
            ha.calendar.mockImplementation(() => new Promise(() => {}));
            screen(ha.make(), { note_calendar: 'calendar.family' }).writer.start();
            await settle();
            expect(ha.service).not.toHaveBeenCalled();
            await vi.advanceTimersByTimeAsync(10_000);
            expect(ha.service).toHaveBeenCalledTimes(1);
            expect(instructions(ha)).not.toContain('Out of the house');
        });

        it('writes the note without the hours out when the calendar can\'t be read, and says so once', async () => {
            const ha = homeAssistant();
            ha.calendar.mockRejectedValue(new Error('Entity not found'));
            screen(ha.make(), { note_calendar: 'calendar.gone' }).writer.start();
            await settle();
            expect(ha.service).toHaveBeenCalledTimes(1);
            expect(instructions(ha)).not.toContain('Out of the house');
            expect(warn).toHaveBeenCalledWith(expect.stringContaining("couldn't read calendar.gone, so the note is written without your hours out"));
        });

        it('reads it again every fifteen minutes, and a new event rewrites the note', async () => {
            const events: Record<string, CalendarEvent[]> = { 'calendar.family': [] };
            const ha = homeAssistant({ events });
            screen(ha.make(), { note_calendar: 'calendar.family' }).writer.start();
            await settle();
            expect(ha.calendar).toHaveBeenCalledTimes(1);
            expect(ha.service).toHaveBeenCalledTimes(1);
            events['calendar.family'] = [dentist];
            await vi.advanceTimersByTimeAsync(10 * 60_000);
            expect(ha.calendar).toHaveBeenCalledTimes(1);
            await vi.advanceTimersByTimeAsync(5 * 60_000);
            expect(ha.calendar).toHaveBeenCalledTimes(2);
            expect(ha.service).toHaveBeenCalledTimes(2);
            expect(instructions(ha, 1)).toContain('Out of the house 17:00–19:00');
        });

        it('reads it again when the calendar starts or ends an event', async () => {
            const ha = homeAssistant({ events: { 'calendar.family': [] } });
            const hass = ha.make();
            hass.states['calendar.family'] = { entity_id: 'calendar.family', state: 'off', attributes: {} };
            const { writer } = screen(hass, { note_calendar: 'calendar.family' });
            writer.start();
            await settle();
            writer.hassChanged();
            expect(ha.calendar).toHaveBeenCalledTimes(1);
            hass.states = { ...hass.states, 'calendar.family': { entity_id: 'calendar.family', state: 'on', attributes: {} } };
            writer.hassChanged();
            await settle();
            expect(ha.calendar).toHaveBeenCalledTimes(2);
        });
    });

    it('keeps one note per weather entity, voice, AI Task, calendars, language and time zone, and reads the calendars from one or a list', () => {
        expect(noteStorageKey({ entity: 'weather.home' }, 'en', 'Europe/Lisbon')).toBe('animated_weather_card_note:weather.home:snarky:default::en:Europe/Lisbon');
        expect(noteStorageKey({ entity: 'weather.home', note_tone: 'calm', note_ai_task_entity: 'ai_task.openai', note_calendar: ['calendar.family', 'calendar.work'] }, 'de', 'Europe/Berlin'))
            .toBe('animated_weather_card_note:weather.home:calm:ai_task.openai:calendar.family,calendar.work:de:Europe/Berlin');
        expect(noteCalendars({ note_calendar: 'calendar.family' })).toEqual(['calendar.family']);
        expect(noteCalendars({ note_calendar: ['calendar.family', ' ', 'calendar.work'] })).toEqual(['calendar.family', 'calendar.work']);
        expect(noteCalendars({})).toEqual([]);
    });
});
