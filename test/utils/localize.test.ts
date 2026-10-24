import { describe, it, expect, afterEach } from 'vitest';
import { localizeString, useAmPm, formatTime, formatDuration, timeHtml, cardLanguage, CARD_STRINGS } from '../../src/localize';

// 19:12 local time, whatever zone the tests run in
const evening = (() => { const d = new Date(2026, 9, 13, 19, 12); return d.toISOString(); })();

describe('card strings', () => {
    it('uses the user language, then the base language, then English', () => {
        expect(localizeString({ locale: { language: 'de' } }, 'sunrise')).toBe('Sonnenaufgang');
        expect(localizeString({ locale: { language: 'pt-BR' } }, 'sunset')).toBe('Pôr do sol');
        expect(localizeString({ locale: { language: 'ja' } }, 'moon')).toBe('Moon');
        expect(localizeString(undefined, 'feels_like')).toBe('Feels like');
    });

    it('prefers the profile language over the server language', () => {
        expect(cardLanguage({ language: 'en', locale: { language: 'fr' } })).toBe('fr');
        expect(cardLanguage({ language: 'nl' })).toBe('nl');
    });

    it('fills in placeholders', () => {
        expect(localizeString({ locale: { language: 'fr' } }, 'in_duration', { duration: '2 h' })).toBe('dans 2 h');
    });

    it('has every string in every language', () => {
        const keys = Object.keys(CARD_STRINGS.en);
        for (const [language, strings] of Object.entries(CARD_STRINGS)) {
            for (const key of keys) {
                expect(strings[key as keyof typeof strings], `${language}.${key}`).toBeTruthy();
            }
        }
    });
});

describe('times', () => {
    it('follows the 12/24-hour setting like Home Assistant', () => {
        expect(useAmPm({ locale: { language: 'en', time_format: '12' } })).toBe(true);
        expect(useAmPm({ locale: { language: 'en', time_format: '24' } })).toBe(false);
        expect(useAmPm({ locale: { language: 'de', time_format: 'language' } })).toBe(false);
        expect(useAmPm({ locale: { language: 'en-US', time_format: 'language' } })).toBe(true);
        expect(useAmPm(undefined)).toBeUndefined();
    });

    it('formats in the dashboard language and format', () => {
        expect(formatTime(evening, { locale: { language: 'de', time_format: '24' } })).toBe('19:12');
        expect(formatTime(evening, { locale: { language: 'en', time_format: '24' } })).toBe('19:12');
        expect(formatTime(evening, { locale: { language: 'en', time_format: '12' } })).toMatch(/^7:12\s?PM$/);
        expect(formatTime(null, {})).toBe('--');
        expect(formatTime('not a date', {})).toBe('--');
    });

    it('splits AM/PM off so the numerals carry the weight', () => {
        expect(timeHtml('7:12 PM', 'ampm')).toBe('7:12<span class="ampm">PM</span>');
        expect(timeHtml('19:12', 'ampm')).toBe('19:12');
    });
});

describe('durations', () => {
    const intl = Intl as unknown as { DurationFormat?: unknown };
    const original = intl.DurationFormat;
    afterEach(() => { intl.DurationFormat = original; });

    it('falls back to "8h 43m" where the browser cannot format durations', () => {
        intl.DurationFormat = undefined;
        expect(formatDuration(8 + 43 / 60, { locale: { language: 'de' } })).toBe('8h 43m');
        expect(formatDuration(0.5, { locale: { language: 'de' } })).toBe('30m');
    });

    it('uses the browser duration format in the dashboard language when there is one', () => {
        const calls: unknown[] = [];
        intl.DurationFormat = class {
            constructor(locale: string, options: object) { calls.push([locale, options]); }
            format(d: { hours?: number; minutes: number }) { return `${d.hours ?? 0} Std. ${d.minutes} Min.`; }
        };
        expect(formatDuration(8 + 43 / 60, { locale: { language: 'de' } })).toBe('8 Std. 43 Min.');
        expect(calls[0]).toEqual(['de', { style: 'narrow' }]);
    });
});
