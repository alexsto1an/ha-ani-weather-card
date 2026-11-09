import { describe, it, expect } from 'vitest';
import { buildForecastModel, isWet } from '../../src/forecast-model';
import { clockParts, formatHour, formatWeekday, cardTimeZone, localeKey, formatTime } from '../../src/localize';

const utc = { language: 'en', locale: { language: 'en', time_format: '24', time_zone: 'server' }, config: { time_zone: 'UTC' } };
const at = (iso: string) => Date.parse(iso);

describe('the forecast, shaped for drawing', () => {
    const now = at('2026-11-09T10:30:00Z');
    const hourly = Array.from({ length: 30 }, (_, i) => ({
        datetime: new Date(at('2026-11-09T08:00:00Z') + i * 3600_000).toISOString(),
        temperature: 10 + (i % 12), precipitation_probability: i === 6 ? 70 : 10, condition: 'cloudy',
    }));
    const daily = ['2026-11-08', '2026-11-09', '2026-11-10', '2026-11-11'].map((d, i) => ({
        datetime: `${d}T11:00:00Z`, temperature: 14 + i, templow: 6 + i, condition: 'rainy', precipitation_probability: 40,
    }));

    it('starts the hours at the one under way, and the days at today', () => {
        const model = buildForecastModel({ hourly, daily, dailyType: 'daily', now, hass: utc });
        expect(model.hours[0].datetime).toBe('2026-11-09T10:00:00.000Z');
        expect(model.days.map(d => d.key)).toEqual(['2026-11-09', '2026-11-10', '2026-11-11']);
        expect(model.days[0].isToday).toBe(true);
    });

    it('takes today\'s high and low from the day, widened to what it is now', () => {
        const model = buildForecastModel({ hourly, daily, dailyType: 'daily', now, current: 16.4, hass: utc });
        expect(model.today).toEqual({ high: 16.4, low: 7 });
    });

    it('works today\'s high and low out from the hours when there are no days', () => {
        const model = buildForecastModel({ hourly, daily: null, dailyType: null, now, current: 11, hass: utc });
        // Today's hours from 10:00 to 23:00: 12, 13, …, 21, 10, 11, 12, 13
        expect(model.today).toEqual({ high: 21, low: 10 });
        expect(model.days).toEqual([]);
    });

    it('joins twice-daily halves into days: the day\'s condition and high, the night\'s low', () => {
        const halves = [
            { datetime: '2026-11-09T12:00:00Z', is_daytime: true, temperature: 15, condition: 'sunny', precipitation_probability: 10 },
            { datetime: '2026-11-09T22:00:00Z', is_daytime: false, temperature: 6, condition: 'clear-night', precipitation_probability: 30 },
            { datetime: '2026-11-10T12:00:00Z', is_daytime: true, temperature: 12, condition: 'rainy' },
        ];
        const model = buildForecastModel({ hourly: null, daily: halves, dailyType: 'twice_daily', now, hass: utc });
        expect(model.days[0]).toMatchObject({ condition: 'sunny', high: 15, low: 6, chance: 30 });
        expect(model.days[1]).toMatchObject({ condition: 'rainy', high: 12 });
    });

    it('measures the week\'s span across the days shown', () => {
        const model = buildForecastModel({ hourly: null, daily, dailyType: 'daily', now, hass: utc, dayCount: 2 });
        expect(model.span).toEqual({ min: 7, max: 16 });
    });

    it('knows when no entry says how likely rain is', () => {
        const dry = hourly.map(({ precipitation_probability, ...e }) => e);
        expect(buildForecastModel({ hourly: dry, daily: null, dailyType: null, now, hass: utc }).hasChance).toBe(false);
        expect(isWet({ precipitation: 0.4 })).toBe(true);
        expect(isWet({ precipitation_probability: 20, precipitation: 3 })).toBe(false);
        expect(isWet({ condition: 'snowy' })).toBe(true);
    });
});

describe('the clock\'s time', () => {
    const date = new Date('2026-11-09T19:07:00Z');

    it('follows the 12- or 24-hour setting, with the day period apart', () => {
        expect(clockParts(date, { ...utc, locale: { ...utc.locale, time_format: '24' } })).toEqual({ time: '19:07', period: '' });
        expect(clockParts(date, { ...utc, locale: { ...utc.locale, time_format: '12' } })).toEqual({ time: '7:07', period: 'PM' });
    });

    it('shows the server\'s time zone when the profile says so, else the device\'s', () => {
        const lisbon = { language: 'en', locale: { language: 'en', time_format: '24', time_zone: 'server' }, config: { time_zone: 'Asia/Tokyo' } };
        expect(clockParts(date, lisbon).time).toBe('04:07');
        expect(formatTime(date.toISOString(), lisbon)).toBe('04:07');
        expect(cardTimeZone({ ...lisbon, locale: { ...lisbon.locale, time_zone: 'local' } })).toBeUndefined();
        expect(cardTimeZone({ ...lisbon, config: { time_zone: 'Not/AZone' } })).toBeUndefined();
        // A new time zone setting rebuilds the card's times
        expect(localeKey(lisbon)).not.toBe(localeKey({ ...lisbon, locale: { ...lisbon.locale, time_zone: 'local' } }));
    });

    it('names hours and days in the dashboard\'s language', () => {
        expect(formatHour(date, utc)).toBe('19');
        expect(formatHour(date, { ...utc, locale: { ...utc.locale, time_format: '12' } })).toBe('7 PM');
        expect(formatWeekday(date, { ...utc, language: 'de', locale: { ...utc.locale, language: 'de' } })).toBe('Mo');
    });
});
