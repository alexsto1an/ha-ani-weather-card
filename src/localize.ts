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
    | 'note_reading' | 'note_writing'
    | 'now' | 'today'
    | 'high_short' | 'low_short' | 'high' | 'low'
    | 'rain' | 'snow' | 'sleet' | 'hail' | 'storms' | 'dry' | 'chance'
    | 'forecast' | 'more_info' | 'close' | 'next_hours' | 'next_days'
    | 'from_time' | 'until_time'
    | 'high_at' | 'low_at' | 'steady_until' | 'within_hour' | 'in_hours'
    | 'dry_from' | 'through_time' | 'at_time' | 'gusts';

const STRINGS: Record<string, Partial<Record<CardString, string>>> = {
    en: {
        feels_like: 'Feels like', indoors: 'Indoors',
        sunrise: 'Sunrise', sunset: 'Sunset', solar_noon: 'Solar noon', daylight: 'Daylight',
        first_light: 'First light', last_light: 'Last light', moon: 'Moon',
        in_duration: 'in {duration}',
        note_reading: 'Reading the forecast', note_writing: 'Writing the note',
        now: 'Now', today: 'Today',
        high_short: 'H', low_short: 'L', high: 'High', low: 'Low',
        rain: 'Rain', snow: 'Snow', sleet: 'Sleet', hail: 'Hail', storms: 'Storms', dry: 'Dry', chance: '{percent} chance',
        forecast: 'Forecast', more_info: 'History and settings', close: 'Close', next_hours: 'Next hours', next_days: 'Next days',
        from_time: 'from {time}', until_time: 'until {time}',
        high_at: 'High {value} at {time}', low_at: 'Low {value} at {time}', steady_until: 'Steady until {time}',
        within_hour: 'Within the hour', in_hours: 'in {hours} h',
        dry_from: 'Dry from', through_time: 'through {time}', at_time: 'at {time}', gusts: 'gusts',
    },
    de: {
        feels_like: 'Gefühlt', indoors: 'Innen',
        sunrise: 'Sonnenaufgang', sunset: 'Sonnenuntergang', solar_noon: 'Sonnenhöchststand', daylight: 'Tageslänge',
        first_light: 'Morgendämmerung', last_light: 'Abenddämmerung', moon: 'Mond',
        in_duration: 'in {duration}',
        note_reading: 'Vorhersage wird gelesen', note_writing: 'Notiz wird geschrieben',
        now: 'Jetzt', today: 'Heute',
        high_short: 'H', low_short: 'T', high: 'Höchstwert', low: 'Tiefstwert',
        rain: 'Regen', snow: 'Schnee', sleet: 'Schneeregen', hail: 'Hagel', storms: 'Gewitter', dry: 'Trocken', chance: '{percent} Wahrscheinlichkeit',
        forecast: 'Vorhersage', more_info: 'Verlauf und Einstellungen', close: 'Schließen', next_hours: 'Nächste Stunden', next_days: 'Nächste Tage',
        from_time: 'ab {time}', until_time: 'bis {time}',
        high_at: 'Höchstwert {value} um {time}', low_at: 'Tiefstwert {value} um {time}', steady_until: 'Gleichbleibend bis {time}',
        within_hour: 'Innerhalb der Stunde', in_hours: 'in {hours} Std.',
        dry_from: 'Trocken ab', through_time: 'bis {time}', at_time: 'um {time}', gusts: 'Böen',
    },
    es: {
        feels_like: 'Sensación térmica', indoors: 'Interior',
        sunrise: 'Salida del sol', sunset: 'Puesta del sol', solar_noon: 'Mediodía solar', daylight: 'Duración del día',
        first_light: 'Alba', last_light: 'Anochecer', moon: 'Luna',
        in_duration: 'en {duration}',
        note_reading: 'Leyendo el pronóstico', note_writing: 'Escribiendo la nota',
        now: 'Ahora', today: 'Hoy',
        high_short: 'Máx', low_short: 'Mín', high: 'Máxima', low: 'Mínima',
        rain: 'Lluvia', snow: 'Nieve', sleet: 'Aguanieve', hail: 'Granizo', storms: 'Tormentas', dry: 'Seco', chance: '{percent} de probabilidad',
        forecast: 'Pronóstico', more_info: 'Historial y ajustes', close: 'Cerrar', next_hours: 'Próximas horas', next_days: 'Próximos días',
        from_time: 'desde las {time}', until_time: 'hasta las {time}',
        high_at: 'Máxima {value} a las {time}', low_at: 'Mínima {value} a las {time}', steady_until: 'Estable hasta las {time}',
        within_hour: 'En la próxima hora', in_hours: 'en {hours} h',
        dry_from: 'Seco desde', through_time: 'hasta las {time}', at_time: 'a las {time}', gusts: 'ráfagas',
    },
    fr: {
        feels_like: 'Ressenti', indoors: 'Intérieur',
        sunrise: 'Lever du soleil', sunset: 'Coucher du soleil', solar_noon: 'Midi solaire', daylight: 'Durée du jour',
        first_light: 'Aube', last_light: 'Crépuscule', moon: 'Lune',
        in_duration: 'dans {duration}',
        note_reading: 'Lecture des prévisions', note_writing: 'Rédaction de la note',
        now: 'Maint.', today: 'Auj.',
        high_short: 'Max', low_short: 'Min', high: 'Maximale', low: 'Minimale',
        rain: 'Pluie', snow: 'Neige', sleet: 'Neige fondue', hail: 'Grêle', storms: 'Orages', dry: 'Sec', chance: '{percent} de probabilité',
        forecast: 'Prévisions', more_info: 'Historique et paramètres', close: 'Fermer', next_hours: 'Prochaines heures', next_days: 'Prochains jours',
        from_time: 'dès {time}', until_time: 'jusqu’à {time}',
        high_at: 'Max {value} à {time}', low_at: 'Min {value} à {time}', steady_until: 'Stable jusqu’à {time}',
        within_hour: 'Dans l’heure', in_hours: 'dans {hours} h',
        dry_from: 'Sec dès', through_time: 'jusqu’à {time}', at_time: 'à {time}', gusts: 'rafales',
    },
    it: {
        feels_like: 'Percepita', indoors: 'Interno',
        sunrise: 'Alba', sunset: 'Tramonto', solar_noon: 'Mezzogiorno solare', daylight: 'Durata del giorno',
        first_light: 'Prima luce', last_light: 'Ultima luce', moon: 'Luna',
        in_duration: 'tra {duration}',
        note_reading: 'Lettura delle previsioni', note_writing: 'Scrittura della nota',
        now: 'Ora', today: 'Oggi',
        high_short: 'Max', low_short: 'Min', high: 'Massima', low: 'Minima',
        rain: 'Pioggia', snow: 'Neve', sleet: 'Nevischio', hail: 'Grandine', storms: 'Temporali', dry: 'Asciutto', chance: '{percent} di probabilità',
        forecast: 'Previsioni', more_info: 'Cronologia e impostazioni', close: 'Chiudi', next_hours: 'Prossime ore', next_days: 'Prossimi giorni',
        from_time: 'dalle {time}', until_time: 'fino alle {time}',
        high_at: 'Massima {value} alle {time}', low_at: 'Minima {value} alle {time}', steady_until: 'Stabile fino alle {time}',
        within_hour: 'Entro un’ora', in_hours: 'tra {hours} h',
        dry_from: 'Asciutto dalle', through_time: 'fino alle {time}', at_time: 'alle {time}', gusts: 'raffiche',
    },
    nl: {
        feels_like: 'Voelt als', indoors: 'Binnen',
        sunrise: 'Zonsopkomst', sunset: 'Zonsondergang', solar_noon: 'Zonnemiddag', daylight: 'Daglengte',
        first_light: 'Ochtendschemering', last_light: 'Avondschemering', moon: 'Maan',
        in_duration: 'over {duration}',
        note_reading: 'Verwachting lezen', note_writing: 'Notitie schrijven',
        now: 'Nu', today: 'Vandaag',
        high_short: 'H', low_short: 'L', high: 'Hoogste', low: 'Laagste',
        rain: 'Regen', snow: 'Sneeuw', sleet: 'Natte sneeuw', hail: 'Hagel', storms: 'Onweer', dry: 'Droog', chance: '{percent} kans',
        forecast: 'Verwachting', more_info: 'Geschiedenis en instellingen', close: 'Sluiten', next_hours: 'Komende uren', next_days: 'Komende dagen',
        from_time: 'vanaf {time}', until_time: 'tot {time}',
        high_at: 'Hoogste {value} om {time}', low_at: 'Laagste {value} om {time}', steady_until: 'Stabiel tot {time}',
        within_hour: 'Binnen het uur', in_hours: 'over {hours} u',
        dry_from: 'Droog vanaf', through_time: 'tot {time}', at_time: 'om {time}', gusts: 'windstoten',
    },
    pl: {
        feels_like: 'Odczuwalna', indoors: 'Wewnątrz',
        sunrise: 'Wschód słońca', sunset: 'Zachód słońca', solar_noon: 'Południe słoneczne', daylight: 'Długość dnia',
        first_light: 'Świt', last_light: 'Zmierzch', moon: 'Księżyc',
        in_duration: 'za {duration}',
        note_reading: 'Czytanie prognozy', note_writing: 'Pisanie notatki',
        now: 'Teraz', today: 'Dziś',
        high_short: 'Maks', low_short: 'Min', high: 'Maksymalna', low: 'Minimalna',
        rain: 'Deszcz', snow: 'Śnieg', sleet: 'Deszcz ze śniegiem', hail: 'Grad', storms: 'Burze', dry: 'Sucho', chance: '{percent} szans',
        forecast: 'Prognoza', more_info: 'Historia i ustawienia', close: 'Zamknij', next_hours: 'Najbliższe godziny', next_days: 'Najbliższe dni',
        from_time: 'od {time}', until_time: 'do {time}',
        high_at: 'Maks. {value} o {time}', low_at: 'Min. {value} o {time}', steady_until: 'Bez zmian do {time}',
        within_hour: 'W ciągu godziny', in_hours: 'za {hours} godz.',
        dry_from: 'Sucho od', through_time: 'do {time}', at_time: 'o {time}', gusts: 'porywy',
    },
    pt: {
        feels_like: 'Sensação térmica', indoors: 'Interior',
        sunrise: 'Nascer do sol', sunset: 'Pôr do sol', solar_noon: 'Meio-dia solar', daylight: 'Duração do dia',
        first_light: 'Aurora', last_light: 'Crepúsculo', moon: 'Lua',
        in_duration: 'em {duration}',
        note_reading: 'Leitura da previsão', note_writing: 'Escrita da nota',
        now: 'Agora', today: 'Hoje',
        high_short: 'Máx', low_short: 'Mín', high: 'Máxima', low: 'Mínima',
        rain: 'Chuva', snow: 'Neve', sleet: 'Chuva e neve', hail: 'Granizo', storms: 'Trovoadas', dry: 'Seco', chance: '{percent} de probabilidade',
        forecast: 'Previsão', more_info: 'Histórico e definições', close: 'Fechar', next_hours: 'Próximas horas', next_days: 'Próximos dias',
        from_time: 'a partir das {time}', until_time: 'até às {time}',
        high_at: 'Máxima {value} às {time}', low_at: 'Mínima {value} às {time}', steady_until: 'Estável até às {time}',
        within_hour: 'Dentro de uma hora', in_hours: 'em {hours} h',
        dry_from: 'Seco a partir das', through_time: 'até às {time}', at_time: 'às {time}', gusts: 'rajadas',
    },
    ro: {
        feels_like: 'Resimțită', indoors: 'Interior',
        sunrise: 'Răsărit', sunset: 'Apus', solar_noon: 'Amiaza solară', daylight: 'Durata zilei',
        first_light: 'Zori', last_light: 'Amurg', moon: 'Lună',
        in_duration: 'în {duration}',
        note_reading: 'Citesc prognoza', note_writing: 'Scriu nota',
        now: 'Acum', today: 'Azi',
        high_short: 'Max', low_short: 'Min', high: 'Maxima', low: 'Minima',
        rain: 'Ploaie', snow: 'Ninsoare', sleet: 'Lapoviță', hail: 'Grindină', storms: 'Furtuni', dry: 'Uscat', chance: '{percent} probabilitate',
        forecast: 'Prognoză', more_info: 'Istoric și setări', close: 'Închide', next_hours: 'Orele următoare', next_days: 'Zilele următoare',
        from_time: 'de la {time}', until_time: 'până la {time}',
        high_at: 'Maxima {value} la {time}', low_at: 'Minima {value} la {time}', steady_until: 'Stabil până la {time}',
        within_hour: 'În următoarea oră', in_hours: 'în {hours} h',
        dry_from: 'Uscat de la', through_time: 'până la {time}', at_time: 'la {time}', gusts: 'rafale',
    },
};

/** The parts of `hass` these helpers read. */
export interface LocaleSource {
    language?: string;
    locale?: { language?: string; time_format?: string; time_zone?: string };
    config?: { time_zone?: string };
}

/** The dashboard's language: the user's HA profile setting, then HA's. */
export function cardLanguage(hass: LocaleSource | undefined): string {
    return hass?.locale?.language || hass?.language || 'en';
}

/** Changes when the user's language, clock format or time zone does, so labels can be rebuilt. */
export function localeKey(hass: LocaleSource | undefined): string {
    return `${cardLanguage(hass)}|${hass?.locale?.time_format ?? ''}|${cardTimeZone(hass) ?? ''}`;
}

/**
 * The time zone times are shown in, as the user's profile says: the
 * server's (Home Assistant's own) or, by default, the device's. Undefined
 * means the device's.
 */
export function cardTimeZone(hass: LocaleSource | undefined): string | undefined {
    if (hass?.locale?.time_zone !== 'server') return undefined;
    const zone = hass.config?.time_zone;
    if (!zone) return undefined;
    try {
        new Intl.DateTimeFormat('en', { timeZone: zone });
        return zone;
    } catch {
        return undefined;
    }
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
    try {
        return timeFormat(hass, { hour: 'numeric', minute: '2-digit' }).format(date);
    } catch {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    }
}

/** A formatter for times of day in the dashboard's language, 12/24-hour setting and time zone. */
function timeFormat(hass: LocaleSource | undefined, options: Intl.DateTimeFormatOptions): Intl.DateTimeFormat {
    const amPm = useAmPm(hass);
    const full: Intl.DateTimeFormatOptions = { ...options, timeZone: cardTimeZone(hass) };
    if (amPm !== undefined) full.hourCycle = amPm ? 'h12' : 'h23';
    return new Intl.DateTimeFormat(hass ? cardLanguage(hass) : undefined, full);
}

/**
 * The clock's reading: the hours and minutes ("7:12", "19:12") and, on a
 * 12-hour clock, the day period ("PM") apart, so it can be set smaller.
 */
export function clockParts(date: Date, hass?: LocaleSource): { time: string; period: string } {
    try {
        const parts = timeFormat(hass, { hour: 'numeric', minute: '2-digit' }).formatToParts(date);
        const period = parts.filter(p => p.type === 'dayPeriod').map(p => p.value).join('');
        const time = parts.filter(p => p.type !== 'dayPeriod').map(p => p.value).join('').trim();
        return { time, period };
    } catch {
        return { time: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }), period: '' };
    }
}

/**
 * An hour on its own for a forecast ("14", "2 PM"), in the same format and
 * time zone. Built from the hour and the day period alone: Intl's own hour
 * says "15 Uhr" in German and "15 h" in French, too long for a column.
 */
export function formatHour(date: Date, hass?: LocaleSource): string {
    try {
        const parts = timeFormat(hass, { hour: 'numeric' }).formatToParts(date);
        const hour = parts.find(p => p.type === 'hour')?.value ?? String(date.getHours());
        const period = parts.find(p => p.type === 'dayPeriod')?.value;
        return period ? `${hour} ${period}` : hour;
    } catch {
        return String(date.getHours());
    }
}

/** A day's name ("Mon", "Montag"), in the dashboard's language and time zone */
export function formatWeekday(date: Date, hass?: LocaleSource, width: 'short' | 'long' = 'short'): string {
    try {
        return new Intl.DateTimeFormat(hass ? cardLanguage(hass) : undefined, { weekday: width, timeZone: cardTimeZone(hass) }).format(date);
    } catch {
        return '';
    }
}

/** Today's date for the clock ("Monday 9 November", "Montag, 9. November") */
export function formatDate(date: Date, hass?: LocaleSource, options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }): string {
    try {
        return new Intl.DateTimeFormat(hass ? cardLanguage(hass) : undefined, { ...options, timeZone: cardTimeZone(hass) }).format(date);
    } catch {
        return date.toDateString();
    }
}

/**
 * Today's date, short, for the clock: the weekday and the day ("Tue 10",
 * "Di., 10."), with the month too ("Tue, Nov 10"). English puts the
 * weekday first, which Intl's American order doesn't.
 */
export function shortDate(date: Date, hass?: LocaleSource, withMonth = false): string {
    const language = hass ? cardLanguage(hass) : undefined;
    const options: Intl.DateTimeFormatOptions = withMonth
        ? { weekday: 'short', day: 'numeric', month: 'short', timeZone: cardTimeZone(hass) }
        : { weekday: 'short', day: 'numeric', timeZone: cardTimeZone(hass) };
    try {
        const format = new Intl.DateTimeFormat(language, options);
        if (!withMonth && (language ?? 'en').toLowerCase().startsWith('en')) {
            const parts = format.formatToParts(date);
            const weekday = parts.find(p => p.type === 'weekday')?.value ?? '';
            const day = parts.find(p => p.type === 'day')?.value ?? '';
            return `${weekday} ${day}`.trim();
        }
        return format.format(date);
    } catch {
        return date.toDateString();
    }
}

/** A day number for comparing dates in the card's time zone: two times on the same calendar day get the same number */
export function dayKey(date: Date, hass?: LocaleSource): string {
    try {
        return new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: cardTimeZone(hass) }).format(date);
    } catch {
        return date.toDateString();
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
