// The forecast's own words, in the nine languages the card speaks, and the
// one grammar every surface uses to say what turns: "Rain from 17:00 to
// 19:00", "Rain until 19:00", "Dry all day". They're in the forecast bundle
// with the drawings that use them, so the main bundle, loaded on every
// dashboard, doesn't carry them.
//
// Times are bound to their prepositions with no-break spaces, so a line
// never ends on "from". The noun names what falls ("Rain", never Home
// Assistant's "Rainy"); "Clear", never "Clear, night".

import { cardLanguage, LocaleSource } from './localize';
import { FC_WORDS_MORE } from './fc-words-more';

export interface FcWords {
    now: string;
    /** The Now control's spoken name */
    back: string;
    /** The slider's name */
    hours: string;
    hourly: string;
    daily: string;
    /** The chips' group name */
    show: string;
    today: string;
    tonight: string;
    /** The chips, full and short: temperature, feels like */
    temp: [string, string];
    feels: [string, string];
    /** Chance and amount, by what falls, full words */
    chance_rain: string;
    chance_snow: string;
    chance_sleet: string;
    amount_rain: string;
    amount_snow: string;
    amount_sleet: string;
    /** Their short words */
    chance: string;
    amount: string;
    /** Their spoken names */
    name_temp: string;
    name_feels: string;
    name_chance_rain: string;
    name_chance_snow: string;
    name_chance_sleet: string;
    name_amount_rain: string;
    name_amount_snow: string;
    name_amount_sleet: string;
    /** A chip's spoken values: "{v} degrees", "{v} percent" */
    degrees: string;
    percent: string;
    /** A day, spoken: "{day}: {cond}, low {lo}, high {hi}", and ", {v} now" after today's */
    day_row: string;
    day_now: string;
    /** High and low: the letters, and spoken */
    h: string;
    l: string;
    high_low: string;
    /** What falls, starting a sentence */
    rain: string;
    snow: string;
    sleet: string;
    storms: string;
    /** The turning line: {k} what falls, {a} when it starts, {b} when it stops */
    from: string;
    from_to: string;
    until: string;
    all_day: string;
    all_night: string;
    /** The same with the noun left out, after a condition that already says it ("Thunderstorm until 19:00") */
    until_bare: string;
    all_day_bare: string;
    all_night_bare: string;
    dry_day: string;
    dry_night: string;
    dry_morning: string;
    /** Days only: "Rain today", "Rain tomorrow" */
    k_today: string;
    k_tomorrow: string;
    midnight: string;
    /** "{v}% chance" beside a word */
    chance_of: string;
    /** The conditions, as nouns */
    sunny: string;
    'clear-night': string;
    partlycloudy: string;
    cloudy: string;
    fog: string;
    rainy: string;
    pouring: string;
    lightning: string;
    'lightning-rainy': string;
    snowy: string;
    'snowy-rainy': string;
    hail: string;
    windy: string;
    'windy-variant': string;
    exceptional: string;
    /** The tap view */
    view: string;
    close: string;
    more: string;
    now_head: string;
    at_head: string;
    wind: string;
    gusts: string;
    humidity: string;
    dew_point: string;
    uv: string;
    cloud_cover: string;
    precipitation: string;
    visibility: string;
    pressure: string;
    feels_like: string;
    /** The nightstand */
    clock: string;
    alarm: string;
    gusts_to: string;
    freezing: string;
    /** An entity with no forecast */
    no_forecast: string;
}

const EN: FcWords = {
    now: 'Now', back: 'Back to now', hours: 'Hours ahead', hourly: 'Hourly forecast', daily: 'Daily forecast', show: 'Show',
    today: 'Today', tonight: 'Tonight',
    temp: ['Temp', 'Temp'], feels: ['Feels like', 'Feels like'],
    chance_rain: 'Rain chance', chance_snow: 'Snow chance', chance_sleet: 'Sleet chance',
    amount_rain: 'Rain amount', amount_snow: 'Snow amount', amount_sleet: 'Sleet amount',
    chance: 'Chance', amount: 'Amount',
    name_temp: 'Temperature', name_feels: 'Feels like',
    name_chance_rain: 'Chance of rain', name_chance_snow: 'Chance of snow', name_chance_sleet: 'Chance of sleet',
    name_amount_rain: 'Rain amount', name_amount_snow: 'Snow amount', name_amount_sleet: 'Sleet amount',
    degrees: '{v} degrees', percent: '{v} percent',
    day_row: '{day}: {cond}, low {lo}, high {hi}', day_now: ', {v} now',
    h: 'H', l: 'L', high_low: 'High {h}, low {l}',
    rain: 'Rain', snow: 'Snow', sleet: 'Sleet', storms: 'Storms',
    from: '{k} from {a}', from_to: '{k} from {a} to {b}', until: '{k} until {b}', all_day: '{k} all day', all_night: '{k} all night',
    until_bare: 'until {b}', all_day_bare: 'all day', all_night_bare: 'all night',
    dry_day: 'Dry all day', dry_night: 'Dry tonight', dry_morning: 'Dry this morning',
    k_today: '{k} today', k_tomorrow: '{k} tomorrow', midnight: 'midnight',
    chance_of: '{v}% chance',
    sunny: 'Clear', 'clear-night': 'Clear', partlycloudy: 'Partly cloudy', cloudy: 'Cloudy', fog: 'Fog', rainy: 'Rain', pouring: 'Heavy rain',
    lightning: 'Thunder', 'lightning-rainy': 'Thunderstorm', snowy: 'Snow', 'snowy-rainy': 'Sleet', hail: 'Hail', windy: 'Windy',
    'windy-variant': 'Windy', exceptional: 'Exceptional',
    view: 'Weather at {place}', close: 'Close', more: 'History and settings', now_head: 'Now', at_head: 'At {t}',
    wind: 'Wind', gusts: 'Gusts {v}', humidity: 'Humidity', dew_point: 'Dew point', uv: 'UV index', cloud_cover: 'Cloud cover',
    precipitation: 'Precipitation', visibility: 'Visibility', pressure: 'Pressure', feels_like: 'Feels like',
    clock: 'Clock and weather', alarm: 'Alarm', gusts_to: 'Gusts to {v} at {t}', freezing: '{v} at {t}',
    no_forecast: 'This weather entity has no forecast',
};

const DE: FcWords = {
    now: 'Jetzt', back: 'Zurück zu jetzt', hours: 'Kommende Stunden', hourly: 'Stündliche Vorhersage', daily: 'Tägliche Vorhersage', show: 'Anzeigen',
    today: 'Heute', tonight: 'Heute Nacht',
    temp: ['Temperatur', 'Temp.'], feels: ['Gefühlt', 'Gefühlt'],
    chance_rain: 'Regenrisiko', chance_snow: 'Schneerisiko', chance_sleet: 'Schneeregenrisiko',
    amount_rain: 'Regenmenge', amount_snow: 'Schneemenge', amount_sleet: 'Schneeregenmenge',
    chance: 'Risiko', amount: 'Menge',
    name_temp: 'Temperatur', name_feels: 'Gefühlte Temperatur',
    name_chance_rain: 'Regenwahrscheinlichkeit', name_chance_snow: 'Schneewahrscheinlichkeit', name_chance_sleet: 'Schneeregenwahrscheinlichkeit',
    name_amount_rain: 'Regenmenge', name_amount_snow: 'Schneemenge', name_amount_sleet: 'Schneeregenmenge',
    degrees: '{v} Grad', percent: '{v} Prozent',
    day_row: '{day}: {cond}, Tiefstwert {lo}, Höchstwert {hi}', day_now: ', jetzt {v}',
    h: 'H', l: 'T', high_low: 'Höchstwert {h}, Tiefstwert {l}',
    rain: 'Regen', snow: 'Schnee', sleet: 'Schneeregen', storms: 'Gewitter',
    from: '{k} ab {a}', from_to: '{k} von {a} bis {b}', until: '{k} bis {b}', all_day: 'Den ganzen Tag {k}', all_night: 'Die ganze Nacht {k}',
    until_bare: 'bis {b}', all_day_bare: 'den ganzen Tag', all_night_bare: 'die ganze Nacht',
    dry_day: 'Den ganzen Tag trocken', dry_night: 'Heute Nacht trocken', dry_morning: 'Heute Morgen trocken',
    k_today: 'Heute {k}', k_tomorrow: 'Morgen {k}', midnight: 'Mitternacht',
    chance_of: '{v} % Risiko',
    sunny: 'Klar', 'clear-night': 'Klar', partlycloudy: 'Teilweise bewölkt', cloudy: 'Bewölkt', fog: 'Nebel', rainy: 'Regen', pouring: 'Starkregen',
    lightning: 'Gewitter', 'lightning-rainy': 'Gewitter', snowy: 'Schnee', 'snowy-rainy': 'Schneeregen', hail: 'Hagel', windy: 'Windig',
    'windy-variant': 'Windig', exceptional: 'Unwetter',
    view: 'Wetter, {place}', close: 'Schließen', more: 'Verlauf und Einstellungen', now_head: 'Jetzt', at_head: 'Um {t}',
    wind: 'Wind', gusts: 'Böen {v}', humidity: 'Luftfeuchte', dew_point: 'Taupunkt', uv: 'UV-Index', cloud_cover: 'Bewölkung',
    precipitation: 'Niederschlag', visibility: 'Sichtweite', pressure: 'Luftdruck', feels_like: 'Gefühlt',
    clock: 'Uhr und Wetter', alarm: 'Wecker', gusts_to: 'Böen bis {v} um {t}', freezing: '{v} um {t}',
    no_forecast: 'Diese Wetter-Entität hat keine Vorhersage',
};

export const FC_WORDS: Record<string, FcWords> = { en: EN, de: DE, ...FC_WORDS_MORE };

/** The forecast's words in the dashboard's language ("pt-BR" → "pt" → English) */
export function fcWords(hass?: LocaleSource): FcWords {
    const lang = cardLanguage(hass).toLowerCase();
    return FC_WORDS[lang] ?? FC_WORDS[lang.split('-')[0]] ?? EN;
}

/** Fill a template's {names}; a time after a word is bound to it with a no-break space */
export function fill(template: string, vars: Record<string, string>): string {
    return template.replace(/ \{(a|b|t)\}/g, ' {$1}').replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '');
}
