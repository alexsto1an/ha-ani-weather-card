import { describe, it, expect } from 'vitest';
import { Timeline, sunModel, phaseWeights, classOf, isWet, wetNoun, num, whole } from '../../src/fc-core';
import { turningLine, timeParts, timeText, highLow, week, hours, available, relative, dateText, conditionNoun } from '../../src/fc-data';
import { FC_WORDS, fill } from '../../src/fc-words';
import { nextAlarm, alertBefore, nightMode } from '../../src/fc-night';
import type { ForecastEntry } from '../../src/forecast-data';
import type { HomeAssistant } from '../../src/types';

const HOUR = 3600_000;
/** 13:10 local today, and the hours from 13:00 */
const today = (h: number, m = 0) => { const d = new Date(); d.setHours(h, m, 0, 0); return d; };
const now = today(13, 10).getTime();
function hourly(conditions: string[], from = 13): ForecastEntry[] {
    return conditions.map((condition, i) => ({ datetime: today(from + i).toISOString(), condition, temperature: 20 - i * 0.5, precipitation_probability: /rain|pour/.test(condition) ? 70 : 10 }));
}
const hass = (language = 'en', time_format = '24') => ({ language, locale: { language, time_format } }) as unknown as HomeAssistant;

describe('the turning line', () => {
    it('dry now, rain later: from and to when it ends within 12 hours, the short form from alone', () => {
        const tl = new Timeline(hourly(['partlycloudy', 'cloudy', 'cloudy', 'cloudy', 'rainy', 'rainy', 'cloudy', 'cloudy']), 'hourly', now);
        const l = turningLine(tl, hass())!;
        expect(l.text).toBe('Rain from 17:00 to 19:00');
        expect(l.short).toBe('Rain from 17:00');
        expect(l.kind).toBe('rain');
    });
    it('wet now: until it stops, with a bare form for after a condition that already names it', () => {
        const tl = new Timeline(hourly(['lightning-rainy', 'lightning-rainy', 'cloudy']), 'hourly', now);
        const l = turningLine(tl, hass())!;
        expect(l.text).toBe('Storms until 15:00');
        expect(l.bareHtml).toBe('until 15:00');
    });
    it('dry all day, dry tonight from the evening', () => {
        expect(turningLine(new Timeline(hourly(['sunny', 'sunny', 'cloudy']), 'hourly', now), hass())!.text).toBe('Dry all day');
        const evening = today(19, 30).getTime();
        expect(turningLine(new Timeline(hourly(['clear-night', 'clear-night'], 19), 'hourly', evening), hass())!.text).toBe('Dry tonight');
    });
    it('in German and with 12 hours: the language\'s own order, and a whole hour drops ":00"', () => {
        const tl = new Timeline(hourly(['cloudy', 'cloudy', 'cloudy', 'cloudy', 'rainy', 'rainy', 'cloudy']), 'hourly', now);
        expect(turningLine(tl, hass('de', '12'))!.text).toBe('Regen von 5 PM bis 7 PM');
    });
    it('days only: today or tomorrow', () => {
        const days: ForecastEntry[] = [{ datetime: today(12).toISOString(), condition: 'sunny' }, { datetime: new Date(today(12).getTime() + 24 * HOUR).toISOString(), condition: 'rainy' }];
        expect(turningLine(new Timeline(days, 'daily', now), hass())!.text).toBe('Rain tomorrow');
    });
    it('nothing to say without a forecast', () => {
        expect(turningLine(null, hass())).toBeNull();
        expect(turningLine(new Timeline([], 'hourly', now), hass())).toBeNull();
    });
});

describe('times, as the card writes them', () => {
    it('24 hours, 12 hours with the period apart, and the nightstand\'s bare hour', () => {
        const d = today(7, 5);
        expect(timeText(d, hass('en', '24'))).toBe('07:05');
        expect(timeParts(d, hass('en', '12'))).toEqual({ hour: '7', minute: '05', period: 'AM' });
        expect(timeText(d, hass('en', '24'), { bare: true })).toBe('7:05');
        expect(timeText(today(17), hass('en', '12'), { sentence: true })).toBe('5 PM');
    });
    it('the profile\'s time zone when it says the server\'s', () => {
        const d = new Date('2026-11-11T12:00:00Z');
        const server = { language: 'en', locale: { language: 'en', time_format: '24', time_zone: 'server' }, config: { time_zone: 'Asia/Tokyo' } } as unknown as HomeAssistant;
        expect(timeText(d, server)).toBe('21:00');
    });
    it('dates in the profile\'s time zone too', () => {
        const d = new Date('2026-11-11T20:00:00Z');
        const server = { language: 'en', locale: { language: 'en', time_format: '24', time_zone: 'server' }, config: { time_zone: 'Asia/Tokyo' } } as unknown as HomeAssistant;
        const text = dateText(d, server, { weekday: 'short', day: 'numeric' });
        expect(text).toMatch(/Thu/);
        expect(text).toMatch(/12/);
    });
    it('how far ahead, short', () => {
        expect(relative(3 * HOUR, hass())).toMatch(/3 hr/);
    });
});

describe('the forecast as slots', () => {
    it('the slot under way comes first; the past is gone', () => {
        const tl = new Timeline(hourly(['sunny', 'sunny', 'rainy'], 12), 'hourly', now);
        expect(tl.slots[0].at.getHours()).toBe(13);
        expect(tl.unit).toBe('hour');
        expect(new Timeline(hourly(['sunny']), 'twice_daily', now).slotMs).toBe(12 * HOUR);
    });
    it('the hours, with which metrics the integration reports', () => {
        const entries = hourly(['sunny', 'rainy']).map(e => ({ ...e, apparent_temperature: 19 }));
        const rows = hours(new Timeline(entries, 'hourly', now).slots, hass());
        expect(rows[0]).toMatchObject({ hour: '13', midnight: false, temp: 20, feels: 19, chance: 10, amount: null });
        expect(available(entries)).toEqual({ temp: true, feels: true, chance: true, amount: false });
    });
    it('rain, snow or sleet: the chips\' noun follows what falls', () => {
        expect(wetNoun(hourly(['snowy', 'cloudy']))).toBe('snow');
        expect(wetNoun(hourly(['snowy', 'rainy']))).toBe('rain');
        expect(isWet({ condition: 'cloudy', precipitation_probability: 60 })).toBe(true);
        expect(classOf('hail')).toBe('sleety');
        expect(classOf('constructor')).toBe('sunny');
    });
});

describe('the days', () => {
    it('twice-daily halves join into days: the day half\'s high, the night half\'s low', () => {
        const noon = today(12), night = today(23);
        const halves: ForecastEntry[] = [
            { datetime: noon.toISOString(), condition: 'rainy', temperature: 18, is_daytime: true },
            { datetime: night.toISOString(), condition: 'cloudy', temperature: 9, is_daytime: false },
        ];
        const w = week(halves, 'twice_daily', now, hass());
        expect(w.days).toHaveLength(1);
        expect(w.days[0]).toMatchObject({ high: 18, low: 9, condition: 'rainy' });
        expect([w.min, w.max]).toEqual([9, 18]);
    });
    it('today\'s high and low hold the reading now', () => {
        const daily: ForecastEntry[] = [{ datetime: today(12).toISOString(), condition: 'sunny', temperature: 22, templow: 12 }];
        expect(highLow(daily, 'daily', [], now, 23, hass())).toEqual([23, 12]);
    });
});

describe('the sun at any hour', () => {
    it('from the sun entity\'s next sunrise and sunset: up by day, down at night, rising in the morning', () => {
        const rise = today(6, 41), set = today(19, 12);
        if (rise.getTime() < now) rise.setDate(rise.getDate() + 1);
        const sun = sunModel({ states: { 'sun.sun': { entity_id: 'sun.sun', state: 'above_horizon', attributes: { next_rising: rise.toISOString(), next_setting: set.toISOString() } } } } as unknown as HomeAssistant);
        expect(sun(today(13)).elevation).toBeGreaterThan(10);
        expect(sun(today(23)).elevation).toBeLessThan(-10);
        expect(sun(today(8)).rising).toBe(true);
        const w = phaseWeights(sun(today(19, 20)).elevation, sun(today(19, 20)).rising);
        expect(w.dusk).toBeGreaterThan(0.5);
    });
    it('from Home Assistant\'s place when it has one', () => {
        const sun = sunModel({ config: { latitude: 51.5, longitude: 0 }, states: {} } as unknown as HomeAssistant);
        expect(sun(new Date('2026-06-21T12:00:00Z')).elevation).toBeGreaterThan(55);
        expect(sun(new Date('2026-06-21T00:00:00Z')).elevation).toBeLessThan(0);
    });
});

describe('before morning, on the nightstand', () => {
    const night = today(23).getTime();
    const wake = new Date(night + 8 * HOUR);
    const slots = (extra: Partial<ForecastEntry>) => Array.from({ length: 10 }, (_, i) => ({ datetime: new Date(night + i * HOUR).toISOString(), condition: 'cloudy', temperature: 3, precipitation_probability: 0, ...extra }));
    const W = FC_WORDS.en;
    it('gusts in the entity\'s own unit: 40 mph is past 60 km/h, 30 mph is not', () => {
        const mph = { attributes: { wind_speed_unit: 'mph', temperature_unit: '°F' } };
        expect(alertBefore(new Timeline(slots({ wind_gust_speed: 40, temperature: 40 }), 'hourly', night), new Date(night), wake, hass(), W, mph)).toMatch(/40 mph/);
        expect(alertBefore(new Timeline(slots({ wind_gust_speed: 30, temperature: 40 }), 'hourly', night), new Date(night), wake, hass(), W, mph)).toBeNull();
    });
    it('frost at the alarm: 0 °C, or 32 °F', () => {
        expect(alertBefore(new Timeline(slots({ temperature: 30 }), 'hourly', night), new Date(night), wake, hass(), W, { attributes: { temperature_unit: '°F' } })).toMatch(/30°/);
        expect(alertBefore(new Timeline(slots({ temperature: 3 }), 'hourly', night), new Date(night), wake, hass(), W, { attributes: { temperature_unit: '°C' } })).toBeNull();
    });
});

describe('the next alarm', () => {
    it('a timestamp within 18 hours, or none', () => {
        const at = new Date(now + 5 * HOUR);
        const h = { states: { 'sensor.next_alarm': { entity_id: 'sensor.next_alarm', state: at.toISOString(), attributes: {} } } } as unknown as HomeAssistant;
        expect(nextAlarm(h, 'sensor.next_alarm', new Date(now))?.getTime()).toBe(at.getTime());
        expect(nextAlarm(h, 'sensor.next_alarm', new Date(now - 20 * HOUR))).toBeNull();
        expect(nextAlarm(h, undefined, new Date(now))).toBeNull();
    });
});

describe('the nightstand\'s night option', () => {
    it('on and off as strings or, from a YAML-mode dashboard, as true and false; anything else is auto', () => {
        expect([nightMode('on'), nightMode(true), nightMode('off'), nightMode(false)]).toEqual(['on', 'on', 'off', 'off']);
        expect([nightMode(undefined), nightMode('auto'), nightMode('yes'), nightMode(1)]).toEqual(['auto', 'auto', 'auto', 'auto']);
    });
});

describe('numbers in the forecast', () => {
    it('zero has no minus, whatever rounds to it (#22); a negative that rounds away keeps it', () => {
        expect([num(Math.round(-0.5), 'en'), num(-0.4, 'en'), num(-0.04, 'de', 1), whole(-0.4)]).toEqual(['0', '0', '0,0', '0']);
        expect([num(-1, 'en'), num(-0.06, 'en', 1), whole(-0.6)]).toEqual(['-1', '-0.1', '\u22121']);
    });
});

describe('the forecast\'s words', () => {
    it('every language fills the same blanks as English', () => {
        const blanks = (t: string) => (t.match(/\{\w+\}/g) ?? []).sort().join();
        for (const [language, words] of Object.entries(FC_WORDS)) {
            for (const [key, value] of Object.entries(FC_WORDS.en)) {
                const v = (words as unknown as Record<string, unknown>)[key];
                if (typeof value === 'string') expect(blanks(v as string), `${language}.${key}`).toBe(blanks(value));
            }
        }
    });
    it('outside the nine languages, the condition is Home Assistant\'s own name', () => {
        expect(conditionNoun('rainy', hass('de'), () => 'HA')).toBe('Regen');
        expect(conditionNoun('rainy', hass('ja'), () => '雨')).toBe('雨');
    });
    it('binds a time to the word before it', () => {
        expect(fill('{k} from {a}', { k: 'Rain', a: '17:00' })).toBe('Rain from 17:00');
    });
});
