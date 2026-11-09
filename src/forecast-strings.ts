// The forecast's own words, in the nine languages the card speaks. They're
// in the forecast bundle with the drawings that use them, so the main bundle,
// loaded on every dashboard, doesn't carry them.

import { fromTable, LocaleSource } from './localize';

export type ForecastString =
    'now'
    | 'today'
    | 'high_short'
    | 'low_short'
    | 'high'
    | 'low'
    | 'rain'
    | 'snow'
    | 'sleet'
    | 'hail'
    | 'storms'
    | 'dry'
    | 'chance'
    | 'forecast'
    | 'more_info'
    | 'close'
    | 'next_hours'
    | 'next_days'
    | 'from_time'
    | 'until_time'
    | 'high_at'
    | 'low_at'
    | 'steady_until'
    | 'within_hour'
    | 'in_hours'
    | 'dry_from'
    | 'through_time'
    | 'at_time'
    | 'gusts';

const STRINGS: Record<string, Partial<Record<ForecastString, string>>> = {
    en: {
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

/** The strings by language, for tests. */
export const FORECAST_STRINGS: Readonly<typeof STRINGS> = STRINGS;

/** A forecast string in the dashboard's language */
export function forecastString(hass: LocaleSource | undefined, key: ForecastString, vars: Record<string, string> = {}): string {
    return fromTable(STRINGS, hass, key, vars);
}
