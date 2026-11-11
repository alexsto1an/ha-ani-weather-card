// The demo's sample world: the weather it can show, the times of day it can
// jump to, and the Home Assistant state the cards read. No DOM here, so the
// tests can check it too.

/** Today's sun, local time: first light, sunrise, noon, sunset, last light. */
export const SUN_TIMES = { dawn: [6, 12], rise: [6, 41], noon: [12, 57], set: [19, 12], dusk: [19, 41] };

/** Where each time of day puts the clock and the sun. */
export const PHASES = {
    dawn: { label: 'Dawn', time: [6, 58], elevation: 3, rising: true },
    day: { label: 'Day', time: [13, 10], elevation: 44, rising: false },
    dusk: { label: 'Dusk', time: [18, 58], elevation: 2, rising: false },
    night: { label: 'Night', time: [23, 15], elevation: -31, rising: false },
};

/** The weather the demo offers, with readings that suit it and the glyph that names it. */
export const CONDITIONS = [
    { id: 'clear', label: 'Clear', icon: 'mdi:weather-sunny', nightIcon: 'mdi:weather-night', temp: 24, feels: 23, humidity: 46, wind: 11, bearing: 300, pressure: 1019 },
    { id: 'partlycloudy', label: 'Partly cloudy', icon: 'mdi:weather-partly-cloudy', nightIcon: 'mdi:weather-night-partly-cloudy', temp: 21, feels: 20, humidity: 55, wind: 13, bearing: 290, pressure: 1016 },
    { id: 'cloudy', label: 'Cloudy', icon: 'mdi:weather-cloudy', temp: 17, feels: 16, humidity: 68, wind: 15, bearing: 250, pressure: 1012 },
    { id: 'fog', label: 'Fog', icon: 'mdi:weather-fog', temp: 11, feels: 10, humidity: 97, wind: 4, bearing: 180, pressure: 1015 },
    { id: 'rainy', label: 'Rain', icon: 'mdi:weather-rainy', temp: 14, feels: 13, humidity: 88, wind: 19, bearing: 220, pressure: 1006 },
    { id: 'pouring', label: 'Pouring', icon: 'mdi:weather-pouring', temp: 13, feels: 11, humidity: 95, wind: 26, bearing: 210, pressure: 1001 },
    { id: 'lightning-rainy', label: 'Storm', icon: 'mdi:weather-lightning-rainy', temp: 16, feels: 15, humidity: 90, wind: 32, bearing: 230, pressure: 998 },
    { id: 'snowy', label: 'Snow', icon: 'mdi:weather-snowy', temp: -2, feels: -6, humidity: 86, wind: 14, bearing: 20, pressure: 1010 },
    { id: 'snowy-rainy', label: 'Snow and rain', icon: 'mdi:weather-snowy-rainy', temp: 1, feels: -2, humidity: 92, wind: 16, bearing: 30, pressure: 1004 },
    { id: 'hail', label: 'Hail', icon: 'mdi:weather-hail', temp: 5, feels: 2, humidity: 85, wind: 24, bearing: 260, pressure: 1003 },
    { id: 'windy', label: 'Windy', icon: 'mdi:weather-windy', temp: 18, feels: 15, humidity: 52, wind: 46, bearing: 280, pressure: 1011 },
];

/** Cooler outside the middle of the day. */
const PHASE_COOLING = { dawn: 4, day: 0, dusk: 2, night: 5 };

/** The time of day that matches the visitor's clock, so the first sky is theirs. */
export function phaseForHour(hour) {
    if (hour >= 6 && hour < 8) return 'dawn';
    if (hour >= 8 && hour < 18.5) return 'day';
    if (hour >= 18.5 && hour < 20.5) return 'dusk';
    return 'night';
}

/** Home Assistant's condition: a clear sky is `clear-night` once the sun is down. */
export function weatherState(conditionId, phase) {
    if (conditionId !== 'clear') return conditionId;
    return phase === 'night' ? 'clear-night' : 'sunny';
}

/** The glyph for a weather option at a time of day: the moon stands in for the sun after dark. */
export function conditionIcon(conditionId, phase) {
    const condition = CONDITIONS.find(c => c.id === conditionId) ?? CONDITIONS[0];
    return phase === 'night' && condition.nightIcon ? condition.nightIcon : condition.icon;
}

/** The temperature the weather card shows for a weather option at a time of day. */
export function temperatureFor(conditionId, phase) {
    const condition = CONDITIONS.find(c => c.id === conditionId) ?? CONDITIONS[0];
    return condition.temp - (PHASE_COOLING[phase] ?? 0);
}

const hourOf = ([hours, minutes]) => hours + minutes / 60;

/**
 * The sun's elevation and direction at a minute of the day, on the same
 * wave the sun tracker draws: up from sunrise to 44° at noon and down to
 * sunset, then below the horizon to −34° at midnight. `rising` flips at
 * solar noon and solar midnight, as sun.sun's does.
 */
export function sunAt(minutes, times = SUN_TIMES) {
    const hour = minutes / 60;
    const rise = hourOf(times.rise);
    const set = hourOf(times.set);
    const noon = hourOf(times.noon);
    const day = set - rise;
    let elevation;
    if (hour >= rise && hour <= set) {
        elevation = 44 * Math.sin((Math.PI * (hour - rise)) / day);
    } else {
        const sinceSet = (((hour - set) % 24) + 24) % 24;
        elevation = -34 * Math.sin((Math.PI * sinceSet) / (24 - day));
    }
    const midnight = noon - 12;
    return { elevation: Math.round(elevation * 10) / 10, rising: hour >= midnight && hour < noon };
}

/** The time of day the card's sky shows for the sun: −6° and 6° bound dawn and dusk. */
export function phaseForSun({ elevation, rising }) {
    if (elevation < -6) return 'night';
    if (elevation < 6) return rising ? 'dawn' : 'dusk';
    return 'day';
}

/** The minute of the day each time of day starts the demo's clock at. */
export const minutesFor = (phase) => PHASES[phase].time[0] * 60 + PHASES[phase].time[1];

const SYNODIC_MONTH = 29.530588853;
const A_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const MOON_PHASES = [
    'new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous',
    'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent',
];

/** The moon's real phase on a date, as Home Assistant's Moon integration names it. */
export function moonPhase(date) {
    const days = (date.getTime() - A_NEW_MOON) / 86400000;
    const age = ((days % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
    return MOON_PHASES[Math.floor((age / SYNODIC_MONTH) * 8 + 0.5) % 8];
}

/** The next time each sun event happens after `now`, as sun.sun reports it. */
export function sunAttributes(now, phase, sun = PHASES[phase], times = SUN_TIMES) {
    const next = ([hours, minutes]) => {
        const at = new Date(now.getTime());
        at.setHours(hours, minutes, 0, 0);
        if (at.getTime() <= now.getTime()) at.setDate(at.getDate() + 1);
        return at.toISOString();
    };
    const { elevation, rising } = sun;
    return {
        elevation, rising,
        next_dawn: next(times.dawn),
        next_rising: next(times.rise),
        next_noon: next(times.noon),
        next_setting: next(times.set),
        next_dusk: next(times.dusk),
        friendly_name: 'Sun',
    };
}

/**
 * Your weather, from Open-Meteo. Home Assistant's own Open-Meteo integration
 * maps each WMO weather code to one of its conditions; this is that map on
 * the demo's keys (its storm key stands for Home Assistant's "lightning").
 */
const WMO_CONDITIONS = {
    0: 'clear', 1: 'clear', 2: 'partlycloudy', 3: 'cloudy', 45: 'fog', 48: 'fog',
    51: 'rainy', 53: 'rainy', 55: 'rainy', 56: 'rainy', 57: 'rainy', 61: 'rainy', 63: 'rainy', 65: 'pouring', 66: 'rainy', 67: 'pouring',
    71: 'snowy', 73: 'snowy', 75: 'snowy', 77: 'snowy', 80: 'rainy', 81: 'rainy', 82: 'pouring', 85: 'snowy', 86: 'snowy',
    95: 'lightning-rainy', 96: 'lightning-rainy', 99: 'lightning-rainy',
};
export const wmoCondition = (code) => WMO_CONDITIONS[code] ?? 'clear';

/** The place you're in, from a reverse geocoder's answer: the city, else the locality or the region, else just "Here". */
export function placeName(geo) {
    for (const key of ['city', 'locality', 'principalSubdivision']) {
        const value = geo?.[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
    }
    return 'Here';
}

/**
 * What the hero shows from a forecast: the numbers, their units, the WMO
 * code for the sky, and the place's name. With the hours and the days in
 * the answer, the forecast the cards read too (see liveForecast).
 */
export function liveReading(data, name = 'Here') {
    const current = data.current ?? {};
    const units = data.current_units ?? {};
    return {
        name,
        code: current.weather_code,
        temp: current.temperature_2m,
        feels: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        pressure: current.pressure_msl,
        wind: current.wind_speed_10m,
        bearing: current.wind_direction_10m,
        units: {
            temperature: units.temperature_2m || '°C', pressure: units.pressure_msl || 'hPa', wind: units.wind_speed_10m || 'km/h',
            precipitation: data.hourly_units?.precipitation === 'inch' ? 'in' : 'mm',
        },
        forecast: liveForecast(data),
    };
}

/**
 * What the page asks Open-Meteo for besides now, in the same call: the
 * next 48 hours and ten days, with what Home Assistant's forecast entries
 * carry. Times come as Unix seconds, and the days are your place's days.
 */
export const OPEN_METEO = {
    hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,dew_point_2m,precipitation_probability,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant,uv_index_max',
    extra: 'forecast_hours=48&forecast_days=10&timezone=auto&timeformat=unixtime',
};

/** A forecast entry with only the fields that came: Open-Meteo sends null for what it doesn't have. */
const entryOf = (fields) => Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v !== null && !Number.isNaN(v)));
const isoAt = (time) => new Date(typeof time === 'number' ? time * 1000 : Date.parse(time)).toISOString();

/**
 * Your forecast, from Open-Meteo's hours and days, as weather/subscribe_forecast
 * sends it: each hour's weather by Home Assistant's Open-Meteo map (clear
 * by day is sunny, by night clear-night), each day's by day. Null when the
 * answer has no hours.
 */
export function liveForecast(data) {
    const h = data?.hourly;
    if (!Array.isArray(h?.time) || !h.time.length) return null;
    const hourly = h.time.map((time, i) => entryOf({
        datetime: isoAt(time),
        condition: weatherState(wmoCondition(h.weather_code?.[i]), h.is_day?.[i] === 0 ? 'night' : 'day'),
        temperature: h.temperature_2m?.[i],
        apparent_temperature: h.apparent_temperature?.[i],
        humidity: h.relative_humidity_2m?.[i],
        dew_point: h.dew_point_2m?.[i],
        precipitation_probability: h.precipitation_probability?.[i],
        precipitation: h.precipitation?.[i],
        cloud_coverage: h.cloud_cover?.[i],
        pressure: h.pressure_msl?.[i],
        wind_speed: h.wind_speed_10m?.[i],
        wind_bearing: h.wind_direction_10m?.[i],
        wind_gust_speed: h.wind_gusts_10m?.[i],
        uv_index: h.uv_index?.[i],
        is_daytime: h.is_day?.[i] === undefined ? undefined : h.is_day[i] === 1,
    }));
    const d = data.daily;
    const daily = Array.isArray(d?.time) ? d.time.map((time, i) => entryOf({
        datetime: isoAt(time),
        condition: weatherState(wmoCondition(d.weather_code?.[i]), 'day'),
        temperature: d.temperature_2m_max?.[i],
        templow: d.temperature_2m_min?.[i],
        precipitation: d.precipitation_sum?.[i],
        precipitation_probability: d.precipitation_probability_max?.[i],
        wind_speed: d.wind_speed_10m_max?.[i],
        wind_gust_speed: d.wind_gusts_10m_max?.[i],
        wind_bearing: d.wind_direction_10m_dominant?.[i],
        uv_index: d.uv_index_max?.[i],
    })) : null;
    return { hourly, daily };
}

// ── The sample forecast ────────────────────────────────────────────────
// Ten days, hour by hour, from which the cards get 48 hours and the days:
// the temperature follows the sun around each day's mean, rain comes in
// bands whose chance builds and tails off, and everything else (feels
// like, wind, humidity, pressure, dew point, UV, cloud) moves with them.
// The days are read off the same hours, so the hours and the week agree.

const HOUR_MS = 3600_000;

/**
 * How each weather goes on from now: from so many hours ahead, a weather
 * and its chance of rain (%). Its last step holds until tomorrow's own
 * weather takes over (see DAY_HOURS).
 */
const STORIES = {
    clear: [[0, 'clear', 0], [5, 'partlycloudy', 5], [9, 'clear', 0]],
    partlycloudy: [[0, 'partlycloudy', 10], [2, 'cloudy', 25], [4, 'rainy', 70], [7, 'cloudy', 30], [8, 'partlycloudy', 15], [10, 'clear', 5]],
    cloudy: [[0, 'cloudy', 20], [6, 'partlycloudy', 10], [12, 'cloudy', 30]],
    fog: [[0, 'fog', 10], [3, 'cloudy', 10], [6, 'partlycloudy', 5]],
    rainy: [[0, 'rainy', 80], [2, 'pouring', 90], [4, 'rainy', 65], [6, 'cloudy', 35], [9, 'partlycloudy', 15]],
    pouring: [[0, 'pouring', 95], [2, 'rainy', 80], [4, 'rainy', 60], [6, 'cloudy', 35], [9, 'partlycloudy', 10]],
    'lightning-rainy': [[0, 'lightning-rainy', 90], [2, 'pouring', 85], [3, 'rainy', 65], [5, 'cloudy', 35], [8, 'partlycloudy', 10]],
    snowy: [[0, 'snowy', 80], [4, 'cloudy', 30], [9, 'snowy', 60], [12, 'cloudy', 25]],
    'snowy-rainy': [[0, 'snowy-rainy', 85], [3, 'rainy', 70], [5, 'cloudy', 30]],
    hail: [[0, 'hail', 70], [1, 'rainy', 60], [3, 'cloudy', 25], [6, 'partlycloudy', 10]],
    windy: [[0, 'windy', 10], [5, 'partlycloudy', 10], [9, 'clear', 0]],
};

/** The days after today: each one's weather, and how much warmer or cooler than today it runs (°C). */
const WEEK = [
    ['rainy', -2], ['partlycloudy', 0], ['clear', 2], ['clear', 3], ['cloudy', 1],
    ['lightning-rainy', 2], ['partlycloudy', 0], ['clear', 1], ['rainy', -2],
];

/** A day's weather hour by hour, by its local hour: a weather and its chance (%). */
const DAY_HOURS = {
    clear: () => ['clear', 0],
    partlycloudy: (h) => (h >= 10 && h < 18 ? ['partlycloudy', 10] : ['clear', 5]),
    cloudy: (h) => ['cloudy', h >= 11 && h < 19 ? 25 : 15],
    rainy: (h) => (h >= 13 && h < 18 ? ['rainy', 75] : h >= 10 && h < 21 ? ['cloudy', 30] : ['partlycloudy', 15]),
    'lightning-rainy': (h) => (h >= 15 && h < 17 ? ['lightning-rainy', 85] : h >= 17 && h < 19 ? ['rainy', 65]
        : h >= 11 && h < 21 ? ['cloudy', 30] : ['partlycloudy', 10]),
    snowy: (h) => (h >= 9 && h < 14 ? ['snowy', 70] : ['cloudy', 25]),
    'snowy-rainy': (h) => (h >= 10 && h < 15 ? ['snowy-rainy', 70] : ['cloudy', 25]),
};

/** A cold day's rain falls as snow, or as sleet when it's near freezing. */
function wintry(weather, mean) {
    if (mean <= 1) return { rainy: 'snowy', pouring: 'snowy', 'lightning-rainy': 'snowy' }[weather] ?? weather;
    if (mean <= 4) return { rainy: 'snowy-rainy', 'lightning-rainy': 'snowy-rainy' }[weather] ?? weather;
    return weather;
}

/** How far the temperature swings either side of the day's mean, by the day's weather (°C). */
const SWING = { clear: 6, partlycloudy: 5, windy: 4, cloudy: 3, fog: 2.5, rainy: 3, pouring: 2, 'lightning-rainy': 3.5, snowy: 2, 'snowy-rainy': 2, hail: 3 };
/** How much of the sky each weather covers (%), and how far you can see in it (km). */
const CLOUD = { clear: 4, partlycloudy: 45, windy: 30, cloudy: 90, fog: 100, rainy: 95, pouring: 100, 'lightning-rainy': 100, snowy: 95, 'snowy-rainy': 95, hail: 95 };
const VISIBILITY = { clear: 24, partlycloudy: 22, windy: 20, cloudy: 16, fog: 0.4, rainy: 8, pouring: 3, 'lightning-rainy': 4, snowy: 2, 'snowy-rainy': 4, hail: 5 };
/** Millimetres an hour at the height of each kind of wet weather. */
const RATE = { rainy: 1.4, pouring: 4.5, 'lightning-rainy': 6, snowy: 0.8, 'snowy-rainy': 1.2, hail: 2.5 };
/** The wet weather that names a day with several, most serious first. */
const SEVERITY = ['lightning-rainy', 'hail', 'pouring', 'snowy-rainy', 'snowy', 'rainy'];

const round1 = (n) => Math.round(n * 10) / 10;
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const smooth = (t) => (1 - Math.cos(Math.PI * t)) / 2;
/** The dew point for a temperature and relative humidity (Magnus). */
function dewPoint(t, rh) {
    const g = Math.log(clamp(rh, 1, 100) / 100) + (17.62 * t) / (243.12 + t);
    return (243.12 * g) / (17.62 - g);
}

/**
 * The sample's forecast from now, for a weather and the reading the card
 * shows: 48 hours, from the one under way, and ten days, from today, as
 * weather/subscribe_forecast sends them. The hour under way reads exactly
 * what the card shows, and is the weather Home Assistant reports now
 * (`state`). `sunTimes` say when it's day.
 */
export function sampleForecast({ conditionId, state, reading, dayTemp, now = new Date(), sunTimes = SUN_TIMES }) {
    const story = STORIES[conditionId] ?? STORIES.partlycloudy;
    const start = new Date(now.getTime());
    start.setMinutes(0, 0, 0);
    const midnight = new Date(start.getTime());
    midnight.setHours(0, 0, 0, 0);
    const dayOf = (t) => {
        const d = new Date(t);
        d.setHours(0, 0, 0, 0);
        return Math.round((d.getTime() - midnight.getTime()) / 86400000);
    };
    // The story holds until tomorrow's own weather takes over: at six in the morning, at least twelve hours on
    const six = new Date(midnight.getTime());
    six.setDate(six.getDate() + 1);
    six.setHours(6);
    const handover = Math.max(six.getTime(), start.getTime() + 12 * HOUR_MS);

    // Today's mean puts the sample's day reading (`dayTemp`) at 13:10, the day's time on the dial, so the
    // days read the same at every time of day; without one (your weather), the reading now. The days
    // after run warmer or cooler than today.
    const clockOf = (t) => {
        const d = new Date(t);
        return d.getHours() + d.getMinutes() / 60;
    };
    const wave = (t) => Math.cos((2 * Math.PI * (clockOf(t) - 15)) / 24);
    const today = SWING[conditionId] ?? 4;
    const dayTime = new Date(midnight.getTime());
    dayTime.setHours(13, 10);
    const roughMean = dayTemp === undefined ? reading.temp - today * wave(start.getTime()) : dayTemp - today * wave(dayTime.getTime());
    const days = [{ weather: conditionId, mean: roughMean, swing: today }, ...WEEK.map(([weather, warmer]) => {
        const mean = roughMean + warmer;
        const kind = wintry(weather, mean);
        return { weather: kind, mean, swing: SWING[kind] ?? 4 };
    })];
    const across = (t, key) => {
        const position = dayOf(t) + (clockOf(t) - 12) / 24;
        const a = clamp(Math.floor(position), 0, days.length - 1);
        const b = clamp(a + 1, 0, days.length - 1);
        return days[a][key] + (days[b][key] - days[a][key]) * smooth(position - Math.floor(position));
    };

    // Every hour from today's midnight for ten days: the weather and its chance first
    const times = [];
    for (let t = midnight.getTime(); dayOf(t) < days.length; t += HOUR_MS) times.push(t);
    const first = Math.max(0, times.findIndex(t => t + HOUR_MS > start.getTime()));
    const raw = times.map((t) => {
        if (t < handover) {
            const ahead = Math.max(0, (t - start.getTime()) / HOUR_MS);
            let step = story[0];
            for (const s of story) if (ahead >= s[0]) step = s;
            return { weather: step[1], chance: step[2] };
        }
        const day = days[dayOf(t)] ?? days.at(-1);
        const [weather, chance] = (DAY_HOURS[day.weather] ?? DAY_HOURS.cloudy)(new Date(t).getHours());
        return { weather, chance };
    });
    const wet = raw.map(r => r.chance >= 50);
    // The chance builds over the two hours before a band and tails off over the two after; inside the
    // band it's lighter at the edges. The wet hours stay wet and the dry ones dry, so the turning
    // line ("Rain from 17:00 to 19:00") reads the band as written.
    const chance = raw.map((r, i) => {
        const at = (k) => raw[i + k]?.chance ?? 0;
        if (wet[i]) {
            const before = !!wet[i - 1];
            const after = !!wet[i + 1];
            return clamp(r.chance + (before && after ? 5 : !before && after ? -10 : -5), 50, 100);
        }
        const near = Math.max(r.chance, 0.6 * at(1), 0.35 * at(2), 0.5 * at(-1), 0.25 * at(-2));
        return Math.min(45, Math.round(near / 5) * 5);
    });
    const amount = raw.map((r, i) => {
        if (!wet[i]) return chance[i] >= 35 ? 0.1 : 0;
        const before = !!wet[i - 1];
        const after = !!wet[i + 1];
        const shape = before && after ? 1 : !before && after ? 0.5 : before ? 0.6 : 0.7;
        return Math.max(0.1, round1((RATE[r.weather] ?? 1) * shape * (0.9 + 0.2 * Math.sin(i * 2.3))));
    });

    // The air: the temperature on its daily wave, a little cooler in the rain, and on the reading now:
    // the difference fades over the hours either side, so the curve stays the day's
    const minuteOf = (t) => Math.round(clockOf(t) * 60);
    const isDay = (t) => {
        const m = minuteOf(t);
        return m >= sunTimes.rise[0] * 60 + sunTimes.rise[1] && m < sunTimes.set[0] * 60 + sunTimes.set[1];
    };
    const wetness = (i) => (wet[i] ? 1 : wet[i - 1] || wet[i + 1] ? 0.4 : 0);
    const air = times.map((t, i) => across(t, 'mean') + across(t, 'swing') * wave(t) - 1.6 * wetness(i));
    const fade = (i, hours) => Math.exp(-Math.abs(i - first) / hours);
    const lift = reading.temp - air[first];
    const temperature = air.map((v, i) => v + lift * (dayTemp === undefined ? 1 : fade(i, 5)));
    const storm = (i) => raw[i].weather === 'lightning-rainy' || raw[i].weather === 'hail';
    const breeze = times.map((t, i) => 1 + 0.18 * Math.sin(i / 4.3) + 0.1 * Math.sin(i / 1.7) + 0.15 * wave(t)
        + (wet[i] ? 0.3 : 0) + (storm(i) ? 0.45 : 0) + (raw[i].weather === 'windy' ? 0.3 : 0));
    const wind = breeze.map(b => Math.max(1, (reading.wind * b) / breeze[first]));
    const gust = wind.map((w, i) => w * 1.55 + (storm(i) ? 12 : wet[i] ? 5 : 0));
    const cloud = raw.map((r, i) => clamp(Math.round((CLOUD[r.weather] ?? 80) + 5 * Math.sin(i * 1.3)), 0, 100));
    const sunUp = times.map(t => Math.max(0, sunAt(minuteOf(t) + 30, sunTimes).elevation));
    const uv = times.map((t, i) => Math.round(8 * Math.sin((sunUp[i] * Math.PI) / 180) * (1 - (0.7 * cloud[i]) / 100)));
    // What it feels like moves on its own: warmer in the sun, cooler in the wind and the rain, and
    // on the reading now, fading as for the temperature
    const feelsBy = times.map((t, i) => (['clear', 'partlycloudy', 'windy'].includes(raw[i].weather) ? 1.6 * Math.sin((sunUp[i] * Math.PI) / 180) : 0)
        - (temperature[i] < 22 ? Math.max(0, (wind[i] - 8) / 6) : 0) - (wet[i] ? 0.8 : 0));
    const feelsLift = reading.feels - (reading.temp + feelsBy[first]);
    const feels = temperature.map((v, i) => v + feelsBy[i] + feelsLift * fade(i, 6));
    const moistBy = times.map((t, i) => -1.8 * (air[i] - across(t, 'mean')) + (wet[i] ? 14 : 0) + chance[i] / 6);
    const humidity = moistBy.map(v => clamp(Math.round(reading.humidity + v - moistBy[first]), 20, 100));
    // The pressure falls ahead of the rain and recovers after it
    const lowBy = chance.map((c, i) => -0.08 * (chance.slice(i + 1, i + 7).reduce((s, v) => s + v, 0) / 6) - 0.02 * c + 0.4 * Math.sin(i / 19));
    const pressure = lowBy.map(v => reading.pressure + v - lowBy[first]);
    const bearing = times.map((t, i) => Math.round((((reading.bearing ?? 270) + 28 * Math.sin(i / 11)) % 360 + 360) % 360));

    const hours = times.map((t, i) => ({
        datetime: new Date(t).toISOString(),
        condition: weatherState(raw[i].weather, isDay(t) ? 'day' : 'night'),
        temperature: round1(temperature[i]),
        apparent_temperature: round1(feels[i]),
        precipitation_probability: chance[i],
        precipitation: amount[i],
        wind_speed: round1(wind[i]),
        wind_gust_speed: round1(gust[i]),
        wind_bearing: bearing[i],
        humidity: humidity[i],
        dew_point: round1(dewPoint(temperature[i], humidity[i])),
        pressure: round1(pressure[i]),
        cloud_coverage: cloud[i],
        uv_index: isDay(t) ? Math.max(0, uv[i]) : 0,
        is_daytime: isDay(t),
    }));
    // The hour under way is now: exactly what the card shows
    hours[first] = {
        ...hours[first], condition: state, temperature: reading.temp, apparent_temperature: reading.feels,
        humidity: reading.humidity, wind_speed: reading.wind, pressure: reading.pressure,
    };

    // The days, read off their hours: the whole day's high and low (today's too, as an integration
    // reports them), the chance at its highest, the rain added up, and the weather that names it
    const daily = days.map((_, d) => {
        const own = hours.filter((_, i) => dayOf(times[i]) === d);
        const wetHours = own.filter(h => h.precipitation_probability >= 50);
        const named = (list) => {
            const counts = new Map();
            for (const h of list) counts.set(h.condition, (counts.get(h.condition) ?? 0) + 1);
            return [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
        };
        const weather = wetHours.length
            ? SEVERITY.find(kind => wetHours.some(h => h.condition === kind)) ?? wetHours[0].condition
            : named(own.filter(h => h.is_daytime)) ?? named(own);
        const at = new Date(midnight.getTime());
        at.setDate(at.getDate() + d);
        const noon = own[12] ?? own.at(-1);
        return {
            datetime: at.toISOString(),
            condition: weather === 'clear-night' ? 'sunny' : weather,
            temperature: round1(Math.max(...own.map(h => h.temperature))),
            templow: round1(Math.min(...own.map(h => h.temperature))),
            precipitation_probability: Math.max(...own.map(h => h.precipitation_probability)),
            precipitation: round1(own.reduce((s, h) => s + h.precipitation, 0)),
            wind_speed: round1(Math.max(...own.map(h => h.wind_speed))),
            wind_gust_speed: round1(Math.max(...own.map(h => h.wind_gust_speed))),
            wind_bearing: noon.wind_bearing,
            uv_index: Math.max(...own.map(h => h.uv_index)),
            humidity: Math.round(own.reduce((s, h) => s + h.humidity, 0) / own.length),
        };
    });
    return { hourly: hours.slice(first, first + 48), daily, visibility: VISIBILITY[conditionId] ?? 16 };
}

const RAD = Math.PI / 180;
/**
 * The sun's elevation above the horizon, in degrees, at a moment, where you
 * are: NOAA's solar position algorithm, good to a tenth of a degree, with
 * no refraction (sunrise and sunset are the moments it passes -0.833°).
 */
export function solarElevation(date, latitude, longitude) {
    const t = (date.getTime() / 86400000 + 2440587.5 - 2451545) / 36525;
    const meanLong = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
    const meanAnomaly = 357.52911 + t * (35999.05029 - 0.0001537 * t);
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const centre = Math.sin(meanAnomaly * RAD) * (1.914602 - t * (0.004817 + 0.000014 * t))
        + Math.sin(2 * meanAnomaly * RAD) * (0.019993 - 0.000101 * t) + Math.sin(3 * meanAnomaly * RAD) * 0.000289;
    const omega = 125.04 - 1934.136 * t;
    const apparentLong = meanLong + centre - 0.00569 - 0.00478 * Math.sin(omega * RAD);
    const obliquity = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60 + 0.00256 * Math.cos(omega * RAD);
    const declination = Math.asin(Math.sin(obliquity * RAD) * Math.sin(apparentLong * RAD));
    const y = Math.tan((obliquity / 2) * RAD) ** 2;
    const equationOfTime = (4 / RAD) * (y * Math.sin(2 * meanLong * RAD) - 2 * eccentricity * Math.sin(meanAnomaly * RAD)
        + 4 * eccentricity * y * Math.sin(meanAnomaly * RAD) * Math.cos(2 * meanLong * RAD)
        - 0.5 * y * y * Math.sin(4 * meanLong * RAD) - 1.25 * eccentricity * eccentricity * Math.sin(2 * meanAnomaly * RAD));
    const utcMinutes = date.getUTCHours() * 60 + date.getUTCMinutes() + date.getUTCSeconds() / 60;
    const hourAngle = (((utcMinutes + equationOfTime + 4 * longitude) % 1440) + 1440) % 1440 / 4 - 180;
    const cosZenith = Math.sin(latitude * RAD) * Math.sin(declination)
        + Math.cos(latitude * RAD) * Math.cos(declination) * Math.cos(hourAngle * RAD);
    return 90 - Math.acos(Math.max(-1, Math.min(1, cosZenith))) / RAD;
}

const atLocalMinute = (day, minutes) => {
    const at = new Date(day.getTime());
    at.setHours(0, minutes, 0, 0);
    return at;
};

/** The real sun at a minute of the day where you are, as sun.sun reports it: its elevation, and whether it's on its way up. */
export function solarAt(minutes, { latitude, longitude }, day = new Date()) {
    const elevation = solarElevation(atLocalMinute(day, minutes), latitude, longitude);
    const later = solarElevation(atLocalMinute(day, minutes + 1), latitude, longitude);
    return { elevation: Math.round(elevation * 10) / 10, rising: later > elevation };
}

/**
 * Today's sun where you are, read off that sun minute by minute: first
 * light and last light where it passes -6° (civil twilight), sunrise and
 * sunset at -0.833°, and solar noon at its highest. Where it never rises
 * or never sets, or where the clock's day holds no whole day of the sun
 * (a clock far from the place), the sample's day stands. The minutes are the clock's, so
 * on a day the clocks change an hour is missing or doubled and the times
 * that day can be an hour out.
 */
export function solarTimes({ latitude, longitude }, day = new Date()) {
    const elevations = Array.from({ length: 1440 }, (_, m) => solarElevation(atLocalMinute(day, m), latitude, longitude));
    const crossing = (limit, upward) => {
        for (let m = 1; m < 1440; m++) {
            if (upward ? elevations[m - 1] < limit && elevations[m] >= limit : elevations[m - 1] >= limit && elevations[m] < limit) return m;
        }
        return null;
    };
    const rise = crossing(-0.833, true);
    const set = crossing(-0.833, false);
    const dawn = crossing(-6, true);
    const dusk = crossing(-6, false);
    if (rise === null || set === null || dawn === null || dusk === null || set <= rise) return SUN_TIMES;
    const noon = elevations.indexOf(Math.max(...elevations));
    const hm = (m) => [Math.floor(m / 60), m % 60];
    return { dawn: hm(dawn), rise: hm(rise), noon: hm(noon), set: hm(set), dusk: hm(dusk) };
}

/** Home Assistant's English names for what the demo shows. */
const STATE_NAMES = {
    sunny: 'Sunny', 'clear-night': 'Clear, night', partlycloudy: 'Partly cloudy', cloudy: 'Cloudy',
    fog: 'Fog', rainy: 'Rainy', pouring: 'Pouring', 'lightning-rainy': 'Lightning, rainy',
    snowy: 'Snowy', 'snowy-rainy': 'Snowy, rainy', hail: 'Hail', windy: 'Windy',
    new_moon: 'New moon', waxing_crescent: 'Waxing crescent', first_quarter: 'First quarter',
    waxing_gibbous: 'Waxing gibbous', full_moon: 'Full moon', waning_gibbous: 'Waning gibbous',
    last_quarter: 'Last quarter', waning_crescent: 'Waning crescent',
};

const LABELS = {
    'ui.card.weather.attributes.humidity': 'Humidity',
    'ui.card.weather.attributes.wind_speed': 'Wind speed',
    'ui.card.weather.attributes.air_pressure': 'Air pressure',
};

const entity = (entity_id, state, attributes = {}) => ({ entity_id, state: String(state), attributes });

export const ENTITIES = {
    weather: 'weather.home',
    // The note lab's weather: its own entity, so its notes are kept apart
    // from the ones the hero and the dashboard share
    noteWeather: 'weather.note_lab',
    sun: 'sun.sun',
    moon: 'sensor.moon_phase',
    flights: 'sensor.flightradar24_current_in_area',
};

/**
 * The note under the conditions. On a dashboard Home Assistant's AI writes
 * it from the forecast; here a stand-in answers with these, written by
 * hand: a short line and a longer note for each weather, by day and by
 * night, in the card's default snarky voice. No numbers or times, so they
 * hold for the visitor's own weather too. Storms and hail are plain
 * advice: serious weather gets no jokes.
 */
export const NOTES = {
    clear: {
        day: ['The sun is showing off again.', 'Not one cloud brave enough to interrupt. Sunglasses on, and act unimpressed.'],
        night: ['Clear skies. The warmth clocked off.', 'No clouds to keep the warmth in tonight. Stars for them, a jumper for you.'],
    },
    partlycloudy: {
        day: ['Sun with commitment issues.', 'The sun keeps ducking behind the clouds. A light jacket covers its mood swings.'],
        night: ['Clouds loitering. Harmless, probably.', 'A few clouds loitering like they missed the last bus. Nothing to plan around.'],
    },
    cloudy: {
        day: ['The sky forgot to load.', 'A ceiling of cloud with no plans to move. Bright colours are your only defence.'],
        night: ['The stars took the night off.', 'Thick cloud overhead, hoarding the stars. Upside: it hoards the warmth too.'],
    },
    fog: {
        day: ['Visibility: theoretical.', 'The world has been temporarily deleted. Drive slowly and trust your headlights.'],
        night: ['Fog. Very atmospheric. Very slow.', 'Fog and darkness together. Headlights low, speed lower, patience high.'],
    },
    rainy: {
        day: ['The clouds finally followed through.', 'Steady rain and no sign of letting up. Umbrella, waterproof shoes, low expectations.'],
        night: ['The rain has booked the night.', 'Rain drumming on the roof like it pays rent. Stay in, or bring a hood.'],
    },
    pouring: {
        day: ['Pouring. Umbrellas are a formality.', 'Rain with something to prove. Boots and a real coat, or stay in.'],
        night: ['Pouring. Listen, don\'t go.', 'Heavy rain hammering down all night. The only winning move is staying in.'],
    },
    'lightning-rainy': {
        day: ['Thunderstorm. Stay indoors.', 'Thunder and heavy rain. Stay inside, away from windows, until it passes.'],
        night: ['Thunderstorm overhead. Stay in.', 'Lightning and heavy rain through the night. Keep indoors until it moves on.'],
    },
    snowy: {
        day: ['Snow, and it means business.', 'Snow settling in like it signed a lease. Boots with grip, warm hat, extra time.'],
        night: ['Snow falling, quietly smug.', 'Snow through the dark. Tomorrow will be pretty and slippery in equal measure.'],
    },
    'snowy-rainy': {
        day: ['Sleet: snow that gave up halfway.', 'Wet snow and rain together, the worst of both. Waterproof everything.'],
        night: ['Sleet. Nobody asked for this.', 'Rain trying to be snow all night. Roads will be slick, so give yourself time.'],
    },
    hail: {
        day: ['Hail. Stay under cover.', 'Hail coming down hard. Stay under cover, and get the car out of the open.'],
        night: ['Hail. Stay under cover.', 'Hail coming down hard. Stay under cover, and get the car out of the open.'],
    },
    windy: {
        day: ['The wind is rearranging things.', 'Strong gusts all round. Hats will travel, umbrellas will invert. Dress snug.'],
        night: ['The bins are planning an escape.', 'Gusty wind through the dark. Tie down anything that likes to fly.'],
    },
};

/**
 * The voices the card can write in (note_tone), with what each sounds like,
 * and the weathers the note lab offers: clear, cloudy, rain and a storm,
 * which gets the same plain advice in every voice.
 */
export const NOTE_VOICES = [
    { id: 'snarky', label: 'Snarky', note: 'Theatrical and a little unhinged. The default.' },
    { id: 'calm', label: 'Calm', note: 'Plain and impersonal, like a forecaster.' },
    { id: 'friendly', label: 'Friendly', note: 'Talks to you like a friend who checked.' },
    { id: 'dry', label: 'Dry', note: 'Deadpan, flat and mildly unimpressed.' },
];
export const NOTE_FORECASTS = ['clear', 'cloudy', 'rainy', 'lightning-rainy'];

/**
 * The note lab's weathers in the other three voices, written to each
 * voice's rules in the card's instructions (VOICES, note-generator.ts):
 * calm never addresses you and never exclaims, friendly talks to you with
 * one exclamation at most, and dry keeps a straight face. Snarky is NOTES.
 */
export const VOICE_NOTES = {
    calm: {
        clear: {
            day: ['Clear skies, staying dry.', 'Clear and settled for the hours ahead. Sunglasses recommended.'],
            night: ['Clear and cooling overnight.', 'Clear through the night, cooling steadily. A warm layer recommended later.'],
        },
        cloudy: {
            day: ['Cloudy, with no rain expected.', 'Overcast for the hours ahead, with no rain expected. A light layer is enough.'],
            night: ['Cloudy and mild overnight.', 'Cloud stays overhead tonight, keeping temperatures mild. No rain expected.'],
        },
        rainy: {
            day: ['Rain for the next few hours.', 'Steady rain for the hours ahead. An umbrella and waterproof shoes recommended.'],
            night: ['Rain through the night.', 'Rain continues overnight, leaving roads wet. Allow extra time for journeys.'],
        },
    },
    friendly: {
        clear: {
            day: ['A lovely one, get outside!', 'Sunshine and clear skies. Grab your sunglasses and get out there if you can.'],
            night: ['Starry tonight, bring a layer.', 'Clear skies tonight mean it\'ll cool off fast. A cosy layer will keep you comfy.'],
        },
        cloudy: {
            day: ['Grey but dry, you\'re all set.', 'Cloudy, but no rain on the way. A light jacket and you\'re good to go.'],
            night: ['Cosy cloud cover tonight.', 'The clouds are keeping things mild tonight. No umbrella needed if you head out.'],
        },
        rainy: {
            day: ['Rainy one, keep your umbrella close.', 'Rain for a while yet, so waterproof shoes will make your day a lot comfier.'],
            night: ['Rainy night, perfect for staying in.', 'Rain all night long. If you do head out, take a hood and an umbrella.'],
        },
    },
    dry: {
        clear: {
            day: ['Sunny. Nothing to report.', 'Clear skies and nothing else. Sunglasses, if you insist on going out.'],
            night: ['Clear, and colder later.', 'A clear night, which means a cold one. A jumper would not go amiss.'],
        },
        cloudy: {
            day: ['Grey. As forecast.', 'Cloud and no rain, which is about as exciting as it gets.'],
            night: ['Overcast. No stars tonight.', 'Cloud all night, so no stars. Mild, at least. Small mercies.'],
        },
        rainy: {
            day: ['Rain. It will continue.', 'Steady rain for a while yet. An umbrella is advised, as is patience.'],
            night: ['Rain all night. Naturally.', 'Rain until morning. Staying in is an option, and a good one.'],
        },
    },
};

/**
 * The note for this weather, time of day and voice: dawn and dusk take the
 * day's. Storms and hail are plain advice in every voice, as the card's
 * own notes are, and a weather a voice has no note for gets the default's.
 */
export function noteFor(conditionId, phase, tone = 'snarky') {
    const serious = conditionId === 'lightning-rainy' || conditionId === 'hail';
    const notes = (!serious && VOICE_NOTES[tone]?.[conditionId]) || NOTES[conditionId] || NOTES.partlycloudy;
    return phase === 'night' ? notes.night : notes.day;
}

/**
 * A weather station of your own: the card option that reads each sensor,
 * the entity, and a starting reading. The weather entity still sets the
 * condition (the sky); these set the numbers, and the wind speed also how
 * fast the weather moves. Pressure and the wind start where the clear-sky
 * forecast has them, so wiring the sensors in doesn't show as a change.
 * The wind's direction wraps round the compass instead of stopping.
 */
export const STATION = [
    { id: 'temperature', group: 'Outside', label: 'Temperature', option: 'outdoor_sensor_entity', entity: 'sensor.garden_temperature', value: 18.4, unit: '°C', decimals: 1, step: 1, deviceClass: 'temperature' },
    { id: 'feelsLike', group: 'Outside', label: 'Feels like', option: 'feels_like_entity', entity: 'sensor.garden_feels_like', value: 17.6, unit: '°C', decimals: 1, deviceClass: 'temperature' },
    { id: 'humidity', group: 'Outside', label: 'Humidity', option: 'humidity_sensor_entity', entity: 'sensor.garden_humidity', value: 61, unit: '%', decimals: 0, deviceClass: 'humidity' },
    { id: 'windSpeed', group: 'Outside', label: 'Wind speed', option: 'wind_speed_sensor_entity', entity: 'sensor.garden_wind_speed', value: 11, unit: 'km/h', decimals: 0, step: 5, deviceClass: 'wind_speed' },
    { id: 'windDirection', group: 'Outside', label: 'Wind direction', option: 'wind_direction_sensor_entity', entity: 'sensor.garden_wind_direction', value: 300, unit: '°', decimals: 0, step: 45, wrap: 360, deviceClass: 'wind_direction' },
    { id: 'pressure', group: 'Outside', label: 'Pressure', option: 'pressure_sensor_entity', entity: 'sensor.garden_pressure', value: 1019.0, unit: 'hPa', decimals: 1, step: 0.5, deviceClass: 'pressure' },
    { id: 'indoorTemperature', group: 'Indoors', label: 'Temperature', option: 'indoor_temperature_entity', entity: 'sensor.living_room_temperature', value: 21.8, unit: '°C', decimals: 1, deviceClass: 'temperature' },
    { id: 'indoorHumidity', group: 'Indoors', label: 'Humidity', option: 'indoor_humidity_entity', entity: 'sensor.living_room_humidity', value: 46, unit: '%', decimals: 0, deviceClass: 'humidity' },
];

/**
 * The weather engine's settings, with the editor's ranges and defaults
 * (src/constants.ts, src/config-editor.ts), and the weather that shows
 * each one: rain for the rain, a windy day for the leaves and the wind,
 * a partly cloudy sky for the clouds.
 */
export const ENGINE = [
    { id: 'rainCount', label: 'Rain', min: 0.5, max: 3, step: 0.1, value: 1, shows: 'rainy' },
    { id: 'splashBounce', label: 'Splash bounce', min: 40, max: 120, step: 5, value: 80, shows: 'rainy' },
    { id: 'snowCount', label: 'Snow', min: 0.5, max: 3, step: 0.1, value: 1, shows: 'snowy' },
    { id: 'cloudCount', label: 'Clouds', min: 1, max: 6, step: 1, value: 3, shows: 'partlycloudy' },
    { id: 'cloudBaseSize', label: 'Cloud size', min: 0.5, max: 2, step: 0.1, value: 1, shows: 'partlycloudy' },
    { id: 'leafCount', label: 'Leaves', min: 0.5, max: 3, step: 0.1, value: 1, shows: 'windy' },
    { id: 'windSpeed', label: 'Wind effect', min: 0.5, max: 5, step: 0.1, value: 2, shows: 'windy' },
];

/** A setting's value as the editor shows it: whole clouds, a percentage of bounce, a multiplier for the rest. */
export function formatEngineValue(id, value) {
    if (id === 'cloudCount') return String(Math.round(value));
    if (id === 'splashBounce') return `${Math.round(value)}%`;
    return `${Number(value).toFixed(1)}×`;
}

/** The engine settings that differ from the defaults, as the card option. */
export function engineSettings(settings) {
    const changed = {};
    for (const row of ENGINE) {
        const value = Number(settings[row.id]);
        if (Number.isFinite(value) && Math.abs(value - row.value) > 1e-9) changed[row.id] = Number(value.toFixed(1));
    }
    return changed;
}

/** The switches that quiet the card, and the options each one sets. */
export const QUIET = [
    { id: 'still', label: 'Still sky', note: 'The condition\u2019s colour and light, no motion.', options: { animate: false } },
    { id: 'inside', label: 'Keep the weather inside', note: 'Nothing falls out of the card onto the dashboard.', options: { spill_particles: false } },
    { id: 'numbers', label: 'Just the numbers', note: 'No labels or icons on the metrics.', options: { show_attribute_labels: false, show_attribute_icons: false } },
];

/** The card options for the quiet switches that are on. */
export function quietOptions(quiet) {
    return Object.assign({}, ...QUIET.filter(row => quiet[row.id]).map(row => row.options));
}

/**
 * The colours you can set under custom_colors: a sky per condition, and
 * the text, the sun, the rain and the snow. `builtIn` is what the card
 * uses without them (the day sky's middle, see src/sky.ts; a test keeps
 * these in step), and `shows` the weather that shows each one.
 */
export const PAINTS = [
    { id: 'sunny_bg', group: 'Skies', label: 'Sunny', builtIn: '#1b64a5', shows: 'clear' },
    { id: 'cloudy_bg', group: 'Skies', label: 'Cloudy', builtIn: '#515e6a', shows: 'cloudy' },
    { id: 'rainy_bg', group: 'Skies', label: 'Rainy', builtIn: '#415260', shows: 'rainy' },
    { id: 'stormy_bg', group: 'Skies', label: 'Stormy', builtIn: '#2a2f42', shows: 'lightning-rainy' },
    { id: 'snowy_bg', group: 'Skies', label: 'Snowy', builtIn: '#4e6673', shows: 'snowy' },
    { id: 'windy_bg', group: 'Skies', label: 'Windy', builtIn: '#056a95', shows: 'windy' },
    { id: 'text_color', group: 'Details', label: 'Text', builtIn: '#f7fafe', shows: null },
    { id: 'sun_color', group: 'Details', label: 'Sun', builtIn: '#ffd67a', shows: 'clear' },
    { id: 'rain_color', group: 'Details', label: 'Rain', builtIn: '#deeaff', shows: 'rainy' },
    { id: 'snow_color', group: 'Details', label: 'Snow', builtIn: '#f7fbff', shows: 'snowy' },
];

/** Palettes to start from. Built in sets nothing. */
export const PALETTES = [
    { id: 'builtin', label: 'Built in', colors: {} },
    { id: 'sea', label: 'Sea', colors: { sunny_bg: '#1f6f8b', cloudy_bg: '#4f6d7a', rainy_bg: '#35505e', stormy_bg: '#22303a', snowy_bg: '#5c7a8a', windy_bg: '#176a7a', sun_color: '#ffe3a0' } },
    { id: 'ember', label: 'Ember', colors: { sunny_bg: '#b5602c', cloudy_bg: '#7a6457', rainy_bg: '#5a4b55', stormy_bg: '#332b36', snowy_bg: '#a08874', windy_bg: '#9a5a3a', sun_color: '#ffd27a', rain_color: '#f6e3d2' } },
    { id: 'ink', label: 'Ink', colors: { sunny_bg: '#2c3644', cloudy_bg: '#3a424d', rainy_bg: '#283039', stormy_bg: '#171b22', snowy_bg: '#48515e', windy_bg: '#2f3a4b', text_color: '#ffffff', rain_color: '#ffffff', snow_color: '#ffffff' } },
];

const HEX = /^#[0-9a-f]{6}$/i;

/** The custom colours that are set, valid and not the built-in colour, as the card option. */
export function customColors(colors) {
    const set = {};
    for (const row of PAINTS) {
        const value = String(colors[row.id] ?? '').toLowerCase();
        if (HEX.test(value) && value !== row.builtIn) set[row.id] = value;
    }
    return set;
}

/** The palette whose colours these are exactly, or null for your own. */
export function paletteOf(colors) {
    const set = customColors(colors);
    const keys = Object.keys(set).sort();
    return PALETTES.find(palette => {
        const own = Object.keys(palette.colors).sort();
        return own.length === keys.length && own.every((key, i) => key === keys[i] && palette.colors[key] === set[key]);
    }) ?? null;
}

const block = (name, entries, quote = false) => (entries.length
    ? [`${name}:`, ...entries.map(([key, value]) => `  ${key}: ${quote ? `"${value}"` : value}`)]
    : []);

/** `engine_settings:` for the settings that differ from the defaults, or nothing. */
export function engineYaml(settings) {
    return block('engine_settings', Object.entries(engineSettings(settings))).join('\n') + '\n';
}

/** The note lab's options: the note, in the voice picked. */
export function noteYaml(tone = 'snarky') {
    return `show_note: true\nnote_tone: ${tone}  # snarky, calm, friendly or dry\n`;
}

/** `custom_colors:` for the colours that are set, or nothing. */
export function colorsYaml(colors) {
    return block('custom_colors', Object.entries(customColors(colors)), true).join('\n') + '\n';
}

/**
 * Home Assistant's sections view, by the numbers the demo's dashboard is
 * built on (the frontend's hui-sections-view and hui-grid-section): a
 * section grid's row height and gap, the gap between columns and the width
 * a column may take, the padding round the view, the width below which the
 * sidebar folds away, the sidebar's width, and the most columns a view
 * takes by default. If Home Assistant changes them, change them here.
 */
export const HA = {
    rowHeight: 56, gridGap: 8, columnGap: 32, columnMin: 320, columnMax: 500, viewPadding: 20,
    narrowBelow: 870, sidebar: 256, maxColumns: 4,
};

/** The screens the dashboard can be seen on: a width (the page's own for a desktop), and the stage width each needs. */
export const DEVICES = [
    { id: 'phone', label: 'Phone', width: 393, needs: 0 },
    { id: 'tablet', label: 'Tablet', width: 820, needs: 836 },
    { id: 'desktop', label: 'Desktop', width: null, needs: 1024 },
];

/** How Home Assistant lays a sections view out on a screen this wide: a docked sidebar past the narrow width, then as many columns as fit. */
export function dashboardLayout(width) {
    const sidebar = width >= HA.narrowBelow;
    const content = width - (sidebar ? HA.sidebar : 0) - 2 * HA.viewPadding;
    const columns = Math.max(1, Math.min(HA.maxColumns, Math.floor((content + HA.columnGap) / (HA.columnMin + HA.columnGap))));
    return { sidebar, columns, content };
}

/** How many rows each card takes in a section, as the cards declare (getGridOptions). */
export const CARD_ROWS = { weather: 5, compact: 2, tracker: 2 };

/**
 * The dashboard round the card: three sections, as a sections view lays
 * them out. Home spans two columns, so the card there is wide; Today has
 * the compact strip over the compact sun tracker; the rest is tile cards.
 */
export const DASHBOARD = [
    { id: 'home', heading: 'Home', span: 2, cards: [
        { card: 'weather' },
        { tile: 'light.living_room', name: 'Living room', state: 'On · 80%', icon: 'mdi:ceiling-light', color: '#ffc107' },
        { tile: 'climate.thermostat', name: 'Thermostat', state: 'Heating · 21.5 °C', icon: 'mdi:thermostat', color: '#ff9800' },
    ] },
    { id: 'today', heading: 'Today', cards: [
        { card: 'compact' },
        { card: 'tracker' },
        { tile: 'sensor.garden_temperature', name: 'Garden', state: '18.4 °C', icon: 'mdi:thermometer', color: null },
        { tile: 'sensor.energy_today', name: 'Energy today', state: '6.2 kWh', icon: 'mdi:lightning-bolt', color: '#ffc107' },
    ] },
    { id: 'house', heading: 'Around the house', cards: [
        { tile: 'light.kitchen', name: 'Kitchen', state: 'Off', icon: 'mdi:ceiling-light', color: null },
        { tile: 'lock.front_door', name: 'Front door', state: 'Locked', icon: 'mdi:lock', color: '#4caf50' },
        { tile: 'light.office', name: 'Office', state: 'On', icon: 'mdi:desk-lamp', color: '#ffc107' },
        { tile: 'cover.garage', name: 'Garage', state: 'Closed', icon: 'mdi:garage', color: null },
    ] },
];

/** The dashboard as a sections view, with the cards it shows and a tile for the rest. */
export function dashboardYaml({ colors = 'sky' } = {}) {
    const theme = colors === 'theme' ? ['color_palette: theme'] : [];
    const list = (items, indent) => items.flatMap(lines => lines.map((line, i) => indent + (line.startsWith('#') ? '' : i === 0 ? '- ' : '  ') + line));
    const section = (heading, extra, cards) => [
        'type: grid', ...extra, 'cards:',
        ...list([['type: heading', `heading: ${heading}`], ...cards], '  '),
    ];
    const home = section('Home', ['column_span: 2'], [
        ['type: custom:animated-weather-card', 'entity: weather.forecast_home', 'sun_entity: sun.sun', 'show_note: true', ...theme],
        ['type: tile', 'entity: light.living_room'],
        ['# The rest of your cards'],
    ]);
    const today = section('Today', [], [
        ['type: custom:animated-weather-card', 'entity: weather.forecast_home', 'sun_entity: sun.sun', 'compact: true', 'show_sun: false', ...theme],
        ['type: custom:animated-sun-tracker-card', 'sun_entity: sun.sun', 'weather_entity: weather.forecast_home', 'compact: true', ...theme],
    ]);
    return ['views:', ...list([['type: sections', 'sections:', ...list([home, today], '  ')]], '  ')].join('\n') + '\n';
}

/** The height a sections view gives a card of so many rows: the rows and the gaps between them. */
export const rowsHeight = (rows) => rows * HA.rowHeight + (rows - 1) * HA.gridGap;

/**
 * The forecast section's cards, at the rows each asks for (getGridOptions),
 * so each sits at a phone's size: the weather card with the forecast and
 * the clock, the forecast card, and the compact card over the strip.
 */
export const AHEAD_ROWS = { hours: 8, card: 7, compact: 2, strip: 2 };

/** Each of the forecast section's cards as YAML, with the theme's line when the page follows the theme. */
export function aheadYaml(slot, { colors = 'sky' } = {}) {
    const theme = colors === 'theme' ? ['color_palette: theme  # follows your Home Assistant theme'] : [];
    const base = ['entity: weather.forecast_home', 'sun_entity: sun.sun'];
    const card = {
        hours: ['type: custom:animated-weather-card', ...base, '# The high and low, the rain\'s times, and the hours', 'show_forecast: true', '# The time, before the place\'s name', 'show_clock: true', ...theme],
        card: ['type: custom:animated-forecast-card', ...base, ...theme],
    }[slot];
    if (card) return card.join('\n') + '\n';
    const item = (lines) => lines.map((line, i) => (i === 0 ? '  - ' : '    ') + line);
    return [
        'type: vertical-stack',
        'cards:',
        ...item(['type: custom:animated-weather-card', ...base, 'compact: true', ...theme]),
        ...item(['type: custom:animated-forecast-card', ...base, 'compact: true', ...theme]),
    ].join('\n') + '\n';
}

/** Sensor states for the readings given, keyed by entity ID, ready to add to `hass.states`. */
export function stationStates(readings) {
    const states = {};
    for (const row of STATION) {
        if (!(row.id in readings)) continue;
        states[row.entity] = entity(row.entity, Number(readings[row.id]).toFixed(row.decimals), {
            unit_of_measurement: row.unit, device_class: row.deviceClass, state_class: 'measurement',
            friendly_name: `${row.group === 'Indoors' ? 'Living room' : 'Garden'} ${row.label.toLowerCase()}`,
        });
    }
    return states;
}


/**
 * The forecast for one world (a weather entity, its weather and reading,
 * the sun's times, the hour, and yours when it's live), and the connection
 * that answers its subscriptions. The cards keep one subscription per
 * connection, and any other connection is a fresh one, so the same world
 * keeps the same connection: a live update that changes nothing in it (a
 * plane, a palette) never reopens the forecast, and a card left at another
 * hour stays there. Kept for the last few dozen worlds.
 */
const worlds = new Map();
const WORLDS_KEPT = 48;
const liveIds = new WeakMap();
let liveCount = 0;
const idOf = (object) => {
    if (!liveIds.has(object)) liveIds.set(object, ++liveCount);
    return liveIds.get(object);
};
function forecastWorld({ weatherEntity, conditionId, state, reading, live, now, sunTimes, delays }) {
    const hour = new Date(now.getTime());
    hour.setMinutes(0, 0, 0);
    const key = [
        weatherEntity, conditionId, state, reading.temp, reading.feels, reading.wind, reading.humidity, reading.pressure, reading.bearing,
        JSON.stringify(sunTimes), hour.getTime(), delays?.forecast ?? 0, live ? idOf(live) : '',
    ].join('|');
    const kept = worlds.get(key);
    if (kept) {
        worlds.delete(key);
        worlds.set(key, kept);
        return kept;
    }
    // The sample's own weather puts its day at its day reading; yours, without the hours, at your reading
    const dayTemp = live ? undefined : CONDITIONS.find(c => c.id === conditionId)?.temp;
    const forecast = live?.forecast ? liveWorld(live, state, now) : sampleForecast({ conditionId, state, reading, dayTemp, now, sunTimes });
    const world = { forecast, connection: standInConnection(forecast, delays) };
    worlds.set(key, world);
    if (worlds.size > WORLDS_KEPT) worlds.delete(worlds.keys().next().value);
    return world;
}

/**
 * Your forecast as it came, from the hour under way: that hour reads what
 * the card shows now, as the sample's does, so the row's first hour and
 * the turning line agree with the sky.
 */
function liveWorld(live, state, now) {
    const hourly = live.forecast.hourly.filter(entry => Date.parse(entry.datetime) + HOUR_MS > now.getTime()).slice(0, 48);
    if (hourly.length && Date.parse(hourly[0].datetime) <= now.getTime()) {
        hourly[0] = entryOf({
            ...hourly[0], condition: state, temperature: live.temp, apparent_temperature: live.feels,
            humidity: live.humidity, wind_speed: live.wind, wind_bearing: live.bearing, pressure: live.pressure,
        });
    }
    return { hourly, daily: live.forecast.daily };
}

/**
 * The `hass` object the cards read: the weather entity and sensors for the
 * chosen weather and time of day, in English, on the visitor's time zone,
 * with the forecast for them, hourly and daily (the sample's, or yours from
 * Open-Meteo). `weatherEntity` names the weather entity, `tone` is the voice
 * the stand-in AI writes in, and `noteDelays` (ms) hold back the forecast's
 * first answer and the AI's, so the card's status shows each step.
 */
export function buildHass({
    conditionId, phase, sun: sunNow, flights = [], sensors = {}, now = new Date(), live = null, sunTimes = SUN_TIMES,
    weatherEntity = ENTITIES.weather, tone = 'snarky', noteDelays = null,
}) {
    const condition = CONDITIONS.find(c => c.id === conditionId) ?? CONDITIONS[0];
    const cooling = PHASE_COOLING[phase] ?? 0;
    const sun = sunAttributes(now, phase, sunNow, sunTimes);
    // The sample's readings for the weather chosen, or yours, as they came
    const reading = live ?? {
        name: 'Home', temp: condition.temp - cooling, feels: condition.feels - cooling, humidity: condition.humidity,
        pressure: condition.pressure, wind: condition.wind, bearing: condition.bearing,
        units: { temperature: '°C', pressure: 'hPa', wind: 'km/h', precipitation: 'mm' },
    };
    const state = weatherState(condition.id, phase);
    const world = forecastWorld({ weatherEntity, conditionId: condition.id, state, reading, live, now, sunTimes, delays: noteDelays });
    // What a full integration reports besides, for the forecast's view: the hour under way's
    const hour = world.forecast.hourly?.[0] ?? {};
    const states = {
        [weatherEntity]: entity(weatherEntity, state, entryOf({
            temperature: reading.temp,
            apparent_temperature: reading.feels,
            humidity: reading.humidity,
            pressure: reading.pressure,
            wind_speed: reading.wind,
            wind_bearing: reading.bearing,
            wind_gust_speed: hour.wind_gust_speed,
            dew_point: hour.dew_point,
            cloud_coverage: hour.cloud_coverage,
            uv_index: hour.uv_index,
            visibility: world.forecast.visibility,
            visibility_unit: world.forecast.visibility === undefined ? undefined : 'km',
            temperature_unit: reading.units.temperature, pressure_unit: reading.units.pressure, wind_speed_unit: reading.units.wind,
            precipitation_unit: reading.units.precipitation ?? 'mm',
            friendly_name: reading.name,
            // Daily and hourly forecasts, as most integrations have
            supported_features: 3,
        })),
        [ENTITIES.sun]: entity(ENTITIES.sun, sun.elevation >= 0 ? 'above_horizon' : 'below_horizon', sun),
        [ENTITIES.moon]: entity(ENTITIES.moon, moonPhase(now), { friendly_name: 'Moon phase' }),
        [ENTITIES.flights]: entity(ENTITIES.flights, flights.length, { flights }),
        // Your own sensors, when they're switched on; without them the card
        // falls back to the weather entity's values
        ...sensors,
    };
    return {
        states,
        config: {
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            components: ['weather', 'sun', 'ai_task'],
            unit_system: { temperature: reading.units.temperature },
        },
        language: 'en',
        locale: { language: 'en', time_format: 'language', number_format: 'language' },
        localize: (key) => LABELS[key] ?? '',
        formatEntityState: (stateObj) => STATE_NAMES[stateObj.state] ?? stateObj.state,
        ...standInAi(condition.id, phase, { tone, delays: noteDelays }),
        connection: world.connection,
    };
}

/** The user's frontend storage, shared by every card on the page as it is by every screen on a dashboard. */
const userData = new Map();
const userDataListeners = new Map();
const notifyUserData = (key, value) => { for (const listener of userDataListeners.get(key) ?? []) listener({ value }); };

/**
 * Forget the notes written for a weather entity, as if none had been: its
 * cards write a new one, behind their status. The note lab does this when
 * you pick a voice.
 */
export function forgetNotes(entityId) {
    for (const key of [...userData.keys()]) {
        if (!key.startsWith(`animated_weather_card_note:${entityId}:`)) continue;
        userData.delete(key);
        notifyUserData(key, null);
    }
}

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Just enough of Home Assistant for the card to write its note (show_note):
 * an AI Task that answers with the sample note for this weather, and the
 * user's frontend storage. `tone` can be a function, read when the AI
 * answers, so a voice picked while a note is being written is the one it
 * comes back in. The forecast comes through the world's connection.
 */
function standInAi(conditionId, phase, { tone = 'snarky', delays = null } = {}) {
    return {
        callService: async (domain, service) => {
            if (domain !== 'ai_task' || service !== 'generate_data') return undefined;
            if (delays?.write) await wait(delays.write);
            const [line, note] = noteFor(conditionId, phase, typeof tone === 'function' ? tone() : tone);
            return { context: {}, response: { conversation_id: 'demo', data: { line, note } } };
        },
        callWS: async (message) => {
            if (message.type === 'ai_task/preferences/get') return { gen_data_entity_id: 'ai_task.demo', gen_image_entity_id: null };
            if (message.type === 'frontend/get_user_data') return { value: userData.get(message.key) ?? null };
            if (message.type === 'frontend/set_user_data') {
                userData.set(message.key, message.value);
                notifyUserData(message.key, message.value);
            }
            return null;
        },
    };
}

/**
 * Home Assistant's websocket, for one world: the user's frontend storage,
 * one store for the whole page, and the world's forecast, hourly and daily
 * (the entity has no twice-daily one). `delays.forecast` holds back the
 * forecast's first answer.
 */
function standInConnection(forecast, delays) {
    return {
        subscribeMessage: async (listener, message) => {
            if (message.type === 'frontend/subscribe_user_data') {
                if (!userDataListeners.has(message.key)) userDataListeners.set(message.key, new Set());
                userDataListeners.get(message.key).add(listener);
                listener({ value: userData.get(message.key) ?? null });
                return () => userDataListeners.get(message.key).delete(listener);
            }
            if (message.type === 'weather/subscribe_forecast') {
                const entries = message.forecast_type === 'hourly' || message.forecast_type === 'daily' ? forecast[message.forecast_type] ?? null : null;
                const answer = () => listener({ type: message.forecast_type, forecast: entries });
                if (!delays?.forecast) answer();
                else {
                    const timer = setTimeout(answer, delays.forecast);
                    return () => clearTimeout(timer);
                }
            }
            return () => {};
        },
    };
}

/**
 * The traffic over a city, each kind at the height and speed it flies, so
 * every family the card draws comes by: an A320neo descending to land, a
 * 787 and a 747 freighter at cruise, a turboprop climbing out, a regional
 * jet, a helicopter, a business jet up high and a Cessna low down.
 */
const FLIGHTS = [
    { flight_number: 'TP1352', aircraft_code: 'A20N', heading: 78, altitude: 12000, ground_speed: 300, vertical_speed: -600 },
    { flight_number: 'EK191', aircraft_code: 'B789', heading: 255, altitude: 34000, ground_speed: 480, vertical_speed: 0 },
    { flight_number: 'TP1104', aircraft_code: 'AT76', heading: 62, altitude: 7000, ground_speed: 240, vertical_speed: 600 },
    { flight_number: 'CV7341', aircraft_code: 'B748', heading: 242, altitude: 36000, ground_speed: 500, vertical_speed: 0 },
    { flight_number: 'IB8742', aircraft_code: 'CRJ9', heading: 110, altitude: 17000, ground_speed: 340, vertical_speed: -1200 },
    { flight_number: '', callsign: 'CSHGE', aircraft_code: 'EC35', heading: 290, altitude: 1500, ground_speed: 120, vertical_speed: 0 },
    { flight_number: 'NJE731', aircraft_code: 'C68A', heading: 40, altitude: 41000, ground_speed: 450, vertical_speed: 0 },
    { flight_number: '', callsign: 'CSAZT', aircraft_code: 'C172', heading: 200, altitude: 2500, ground_speed: 105, vertical_speed: 0 },
];

/** A new flight entering the area: a fresh id each time, so the card flies it. */
export function nextFlight(count) {
    const flight = FLIGHTS[count % FLIGHTS.length];
    return {
        id: `demo-${count + 1}`,
        ...flight,
        callsign: flight.callsign ?? flight.flight_number,
        on_ground: 0,
    };
}

/**
 * The weather card as the demo shows it, as YAML for a Manual card, with the
 * entity IDs a typical Home Assistant install has: the hero's colours, the
 * layouts section's layout, and your sensors when they're on.
 */
export function configYaml({ layout = 'regular', colors = 'sky', station = false, engine = {}, paints = {}, quiet = {}, tone = 'snarky' } = {}) {
    const lines = [
        'type: custom:animated-weather-card',
        'entity: weather.forecast_home',
        'sun_entity: sun.sun',
        ...(station ? STATION.map(row => `${row.option}: ${row.entity}`) : []),
        '# Planes fly over from the Flightradar24 integration',
        'flights_entity: sensor.flightradar24_current_in_area',
        ...(layout === 'compact' ? ['compact: true'] : [
            '# A note from your AI, written from the forecast',
            'show_note: true',
            ...(tone === 'snarky' ? [] : [`note_tone: ${tone}`]),
        ]),
        ...(colors === 'theme' ? ['color_palette: theme  # follows your Home Assistant theme'] : []),
        ...Object.entries(quietOptions(quiet)).map(([key, value]) => `${key}: ${value}`),
        ...block('engine_settings', Object.entries(engineSettings(engine))),
        // Custom skies paint the sky palette only
        ...(colors === 'theme' ? [] : block('custom_colors', Object.entries(customColors(paints)), true)),
    ];
    if (layout === 'wide') lines.unshift('# Wall: a panel view gives the card the whole screen');
    return lines.join('\n') + '\n';
}

/**
 * The sun tracker at the size its section shows: on its own (regular or
 * wide), or compact under the weather card, as the README pairs them, the
 * weather card leaving the next sunset to the tracker.
 */
export function trackerYaml({ layout = 'regular', colors = 'sky' } = {}) {
    const theme = colors === 'theme' ? ['color_palette: theme  # follows your Home Assistant theme'] : [];
    const tracker = [
        'type: custom:animated-sun-tracker-card',
        'sun_entity: sun.sun',
        '# The moon phase comes from the Moon integration',
        'moon_entity: sensor.moon_phase',
        'weather_entity: weather.forecast_home',
        ...(layout === 'compact' ? ['compact: true'] : []),
        ...theme,
    ];
    if (layout === 'wide') tracker.unshift('# Wall: a panel view gives the card the whole screen');
    if (layout !== 'compact') return tracker.join('\n') + '\n';
    const item = (lines) => lines.map((line, i) => (i === 0 ? '  - ' : '    ') + line);
    return [
        'type: vertical-stack',
        'cards:',
        ...item(['type: custom:animated-weather-card', 'entity: weather.forecast_home', 'sun_entity: sun.sun', 'show_sun: false', ...theme]),
        ...item(tracker),
    ].join('\n') + '\n';
}
