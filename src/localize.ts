// Strings and formats the cards draw themselves, in the dashboard's language.
//
// Home Assistant's frontend translations cover the weather attributes the
// metric row uses (humidity, wind speed, air pressure), but not "Feels
// like", sunrise / sunset or the sun tracker's labels, so the card carries
// those. A language that isn't listed falls back to English. Times follow
// the user's Home Assistant language and 12/24-hour setting.

import { escapeHtml } from './utils';

export type CardString =
    | 'feels_like' | 'indoors'
    | 'sunrise' | 'sunset' | 'solar_noon' | 'daylight'
    | 'first_light' | 'last_light' | 'moon'
    | 'in_duration'
    | 'note_reading' | 'note_writing';

const STRINGS: Record<string, Partial<Record<CardString, string>>> = {
    en: {
        feels_like: 'Feels like', indoors: 'Indoors',
        sunrise: 'Sunrise', sunset: 'Sunset', solar_noon: 'Solar noon', daylight: 'Daylight',
        first_light: 'First light', last_light: 'Last light', moon: 'Moon',
        in_duration: 'in {duration}',
        note_reading: 'Reading the forecast', note_writing: 'Writing the note',
    },
    de: {
        feels_like: 'Gefühlt', indoors: 'Innen',
        sunrise: 'Sonnenaufgang', sunset: 'Sonnenuntergang', solar_noon: 'Sonnenhöchststand', daylight: 'Tageslänge',
        first_light: 'Morgendämmerung', last_light: 'Abenddämmerung', moon: 'Mond',
        in_duration: 'in {duration}',
        note_reading: 'Vorhersage wird gelesen', note_writing: 'Notiz wird geschrieben',
    },
    es: {
        feels_like: 'Sensación térmica', indoors: 'Interior',
        sunrise: 'Salida del sol', sunset: 'Puesta del sol', solar_noon: 'Mediodía solar', daylight: 'Duración del día',
        first_light: 'Alba', last_light: 'Anochecer', moon: 'Luna',
        in_duration: 'en {duration}',
        note_reading: 'Leyendo el pronóstico', note_writing: 'Escribiendo la nota',
    },
    fr: {
        feels_like: 'Ressenti', indoors: 'Intérieur',
        sunrise: 'Lever du soleil', sunset: 'Coucher du soleil', solar_noon: 'Midi solaire', daylight: 'Durée du jour',
        first_light: 'Aube', last_light: 'Crépuscule', moon: 'Lune',
        in_duration: 'dans {duration}',
        note_reading: 'Lecture des prévisions', note_writing: 'Rédaction de la note',
    },
    it: {
        feels_like: 'Percepita', indoors: 'Interno',
        sunrise: 'Alba', sunset: 'Tramonto', solar_noon: 'Mezzogiorno solare', daylight: 'Durata del giorno',
        first_light: 'Prima luce', last_light: 'Ultima luce', moon: 'Luna',
        in_duration: 'tra {duration}',
        note_reading: 'Lettura delle previsioni', note_writing: 'Scrittura della nota',
    },
    nl: {
        feels_like: 'Voelt als', indoors: 'Binnen',
        sunrise: 'Zonsopkomst', sunset: 'Zonsondergang', solar_noon: 'Zonnemiddag', daylight: 'Daglengte',
        first_light: 'Ochtendschemering', last_light: 'Avondschemering', moon: 'Maan',
        in_duration: 'over {duration}',
        note_reading: 'Verwachting lezen', note_writing: 'Notitie schrijven',
    },
    pl: {
        feels_like: 'Odczuwalna', indoors: 'Wewnątrz',
        sunrise: 'Wschód słońca', sunset: 'Zachód słońca', solar_noon: 'Południe słoneczne', daylight: 'Długość dnia',
        first_light: 'Świt', last_light: 'Zmierzch', moon: 'Księżyc',
        in_duration: 'za {duration}',
        note_reading: 'Czytanie prognozy', note_writing: 'Pisanie notatki',
    },
    pt: {
        feels_like: 'Sensação térmica', indoors: 'Interior',
        sunrise: 'Nascer do sol', sunset: 'Pôr do sol', solar_noon: 'Meio-dia solar', daylight: 'Duração do dia',
        first_light: 'Aurora', last_light: 'Crepúsculo', moon: 'Lua',
        in_duration: 'em {duration}',
        note_reading: 'Leitura da previsão', note_writing: 'Escrita da nota',
    },
    ro: {
        feels_like: 'Resimțită', indoors: 'Interior',
        sunrise: 'Răsărit', sunset: 'Apus', solar_noon: 'Amiaza solară', daylight: 'Durata zilei',
        first_light: 'Zori', last_light: 'Amurg', moon: 'Lună',
        in_duration: 'în {duration}',
        note_reading: 'Citesc prognoza', note_writing: 'Scriu nota',
    },
};

/** The parts of `hass` these helpers read. */
export interface LocaleSource {
    language?: string;
    locale?: { language?: string; time_format?: string };
}

/** The dashboard's language: the user's HA profile setting, then HA's. */
export function cardLanguage(hass: LocaleSource | undefined): string {
    return hass?.locale?.language || hass?.language || 'en';
}

/** Changes when the user's language or clock format does, so labels can be rebuilt. */
export function localeKey(hass: LocaleSource | undefined): string {
    return `${cardLanguage(hass)}|${hass?.locale?.time_format ?? ''}`;
}

/** A card string in the dashboard's language ("pt-BR" → "pt" → English). */
export function localizeString(hass: LocaleSource | undefined, key: CardString, vars: Record<string, string> = {}): string {
    const language = cardLanguage(hass).toLowerCase();
    const text = STRINGS[language]?.[key] ?? STRINGS[language.split('-')[0]]?.[key] ?? STRINGS.en[key]!;
    return text.replace(/\{(\w+)\}/g, (_, name: string) => vars[name] ?? '');
}

/** The strings by language, for tests and docs. */
export const CARD_STRINGS: Readonly<typeof STRINGS> = STRINGS;

/**
 * Whether times use AM/PM, the way Home Assistant decides it: the user's
 * 12/24-hour setting, or what their language (or browser) does by default.
 * Undefined when HA doesn't say, so the browser's default applies.
 */
export function useAmPm(hass: LocaleSource | undefined): boolean | undefined {
    const locale = hass?.locale;
    if (!locale?.time_format) return undefined;
    if (locale.time_format === '12') return true;
    if (locale.time_format === '24') return false;
    const language = locale.time_format === 'language' ? cardLanguage(hass) : undefined;
    try {
        return new Date('January 1, 2023 22:00:00').toLocaleString(language).includes('10');
    } catch {
        return undefined;
    }
}

/** A time of day ("7:12 PM", "19:12") in the dashboard's language and format. */
export function formatTime(iso: string | null | undefined, hass?: LocaleSource): string {
    if (!iso) return '--';
    const date = new Date(iso);
    if (isNaN(date.getTime())) return '--';
    const amPm = useAmPm(hass);
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
    if (amPm !== undefined) options.hourCycle = amPm ? 'h12' : 'h23';
    try {
        return new Intl.DateTimeFormat(hass ? cardLanguage(hass) : undefined, options).format(date);
    } catch {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
}

/**
 * A duration in hours as "8h 43m", in the dashboard's language where the
 * browser can format durations (Intl.DurationFormat), else in that form.
 */
export function formatDuration(hours: number, hass?: LocaleSource): string {
    const total = Math.round(Math.abs(hours) * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    const DurationFormat = (Intl as unknown as {
        DurationFormat?: new (locale?: string, options?: { style: string }) => { format(d: object): string };
    }).DurationFormat;
    if (DurationFormat && hass) {
        try {
            return new DurationFormat(cardLanguage(hass), { style: 'narrow' })
                .format(h > 0 ? { hours: h, minutes: m } : { minutes: m });
        } catch { /* fall through */ }
    }
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/** "7:12 PM" → "7:12" + a smaller "PM", so the numerals carry the weight. */
export function timeHtml(formatted: string, ampmClass: string): string {
    const match = formatted.match(/^(.*?)\s?([AaPp]\.?\s?[Mm]\.?)$/);
    if (!match) return escapeHtml(formatted);
    return `${escapeHtml(match[1])}<span class="${ampmClass}">${escapeHtml(match[2])}</span>`;
}
