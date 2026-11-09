// A forecast for the review page that changes through the day, the way a
// real one does: the temperature follows the sun, showers come and go,
// a storm clears, night falls. Home Assistant's fields, as
// weather/subscribe_forecast sends them. Review only.

/** How each sample sky goes on, hour by hour from now: [hours from now, condition, rain chance %] */
const STORIES = {
    clear: [[0, 'sunny', 0], [5, 'partlycloudy', 5], [11, 'clear-night', 0], [20, 'sunny', 0]],
    partlycloudy: [[0, 'partlycloudy', 10], [2, 'cloudy', 25], [4, 'rainy', 70], [6, 'partlycloudy', 20], [9, 'clear-night', 5], [18, 'sunny', 0]],
    cloudy: [[0, 'cloudy', 20], [6, 'partlycloudy', 10], [12, 'cloudy', 30]],
    fog: [[0, 'fog', 10], [3, 'cloudy', 10], [6, 'partlycloudy', 5]],
    rainy: [[0, 'rainy', 80], [3, 'pouring', 95], [5, 'rainy', 60], [8, 'cloudy', 30], [12, 'partlycloudy', 10]],
    pouring: [[0, 'pouring', 95], [2, 'rainy', 80], [6, 'cloudy', 40]],
    'lightning-rainy': [[0, 'lightning-rainy', 90], [2, 'pouring', 85], [4, 'rainy', 60], [6, 'cloudy', 30], [9, 'partlycloudy', 10]],
    snowy: [[0, 'snowy', 80], [5, 'cloudy', 30], [10, 'snowy', 60]],
    'snowy-rainy': [[0, 'snowy-rainy', 85], [4, 'rainy', 70], [8, 'cloudy', 20]],
    hail: [[0, 'hail', 70], [1, 'rainy', 60], [4, 'cloudy', 20]],
    windy: [[0, 'windy', 10], [6, 'partlycloudy', 10], [12, 'clear-night', 0]],
};

/** The week ahead, after today: condition, rain chance, high and low against today's */
const WEEK = [
    ['rainy', 80, -3, -1], ['partlycloudy', 20, 1, 0], ['sunny', 0, 3, -2], ['sunny', 0, 4, 1],
    ['cloudy', 30, -1, 2], ['lightning-rainy', 70, -2, 3], ['partlycloudy', 10, 0, -1], ['sunny', 5, 2, -3], ['rainy', 60, -4, 0],
];

const HOUR = 3600_000;

/** Day and night by the sample's sun: rises at 6:41, sets at 19:12 */
const isDaytime = (date) => {
    const h = date.getHours() + date.getMinutes() / 60;
    return h >= 6.7 && h < 19.2;
};

/** Warmest mid-afternoon, coldest just before sunrise */
function diurnal(date, mean, swing) {
    const h = date.getHours() + date.getMinutes() / 60;
    return mean + swing * Math.cos(((h - 15) / 24) * 2 * Math.PI);
}

function conditionAt(story, hoursAhead, date) {
    let step = story[0];
    for (const s of story) if (hoursAhead >= s[0]) step = s;
    let [, condition, chance] = step;
    // Clear skies take the night's name after dark, and the day's by day
    if (condition === 'sunny' && !isDaytime(date)) condition = 'clear-night';
    if (condition === 'clear-night' && isDaytime(date)) condition = 'sunny';
    return { condition, chance };
}

/**
 * The hourly and daily forecast for a sample sky, from `now`, with today's
 * temperature `current` (the reading the card shows). `options.missing`
 * leaves fields out, the way some integrations do: 'chance' drops the rain
 * chance (Met.no's hourly), 'hourly' gives no hours at all.
 */
export function sampleForecast(conditionId, now, current, wind = 12, options = {}) {
    const story = STORIES[conditionId] ?? STORIES.partlycloudy;
    const start = new Date(now);
    start.setMinutes(0, 0, 0);
    // Pick the mean so the hour under way reads what the card shows
    const swing = conditionId === 'cloudy' || conditionId === 'fog' ? 3 : 5;
    const mean = current - (diurnal(start, 0, swing));
    const hourly = Array.from({ length: 48 }, (_, i) => {
        const date = new Date(start.getTime() + i * HOUR);
        const { condition, chance } = conditionAt(story, i, date);
        const wet = chance >= 50;
        const temperature = Math.round(diurnal(date, mean - (wet ? 1 : 0), swing) * 10) / 10;
        const entry = {
            datetime: date.toISOString(),
            condition,
            temperature,
            apparent_temperature: Math.round((temperature - (wind > 20 ? 3 : 1)) * 10) / 10,
            precipitation: wet ? Math.round((chance / 30) * 10) / 10 : chance > 20 ? 0.1 : 0,
            precipitation_probability: chance,
            wind_speed: Math.round(wind + 4 * Math.sin(i / 3)),
            wind_gust_speed: Math.round((wind + 4 * Math.sin(i / 3)) * 1.6),
            wind_bearing: 240 + Math.round(20 * Math.sin(i / 5)),
            humidity: Math.min(98, Math.round(55 + chance / 3)),
            cloud_coverage: { sunny: 5, 'clear-night': 5, partlycloudy: 45, windy: 30 }[condition] ?? 90,
            dew_point: Math.round((temperature - 6 + chance / 25) * 10) / 10,
            uv_index: isDaytime(date) ? Math.max(0, Math.round(6 * Math.sin(((date.getHours() - 6.7) / 12.5) * Math.PI) * (condition === 'sunny' ? 1 : 0.5))) : 0,
            pressure: 1014 - Math.round(chance / 10),
            is_daytime: isDaytime(date),
        };
        if (options.missing?.includes('chance')) delete entry.precipitation_probability;
        return entry;
    });
    // Today, then the week: highs and lows around today's
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const todays = hourly.filter(e => new Date(e.datetime).getDate() === today.getDate()).map(e => e.temperature);
    const high = Math.round(Math.max(current, ...todays));
    const low = Math.round(Math.min(current, ...todays) - 1);
    const daily = [[story[0][1] === 'clear-night' ? 'sunny' : story[0][1], Math.max(...story.map(s => s[2])), 0, 0], ...WEEK].map(([condition, chance, dh, dl], i) => ({
        datetime: new Date(today.getTime() + i * 24 * HOUR + 12 * HOUR).toISOString(),
        condition: condition === 'clear-night' ? 'sunny' : condition,
        temperature: high + dh,
        templow: low + dl,
        precipitation_probability: chance,
        precipitation: chance >= 50 ? Math.round(chance / 12) : 0,
        wind_speed: wind + (i % 3) * 3,
        wind_gust_speed: Math.round((wind + (i % 3) * 3) * 1.7),
        wind_bearing: 220 + i * 15,
        uv_index: condition === 'sunny' ? 5 : 2,
        humidity: Math.round(55 + chance / 3),
    }));
    if (options.days) daily.length = Math.min(daily.length, options.days);
    if (options.missing?.includes('chance')) for (const d of daily) delete d.precipitation_probability;
    return { hourly: options.missing?.includes('hourly') ? null : hourly, daily, twice_daily: null };
}

/**
 * Answer the card's forecast subscriptions from the sample, delegating
 * everything else (the note's storage) to the hass it's given.
 */
export function withForecast(hass, forecast) {
    const original = hass.connection.subscribeMessage;
    const features = forecast.hourly ? 3 : 1;
    const weatherId = Object.keys(hass.states).find(id => id.startsWith('weather.'));
    if (weatherId) {
        const w = hass.states[weatherId];
        // The readings a full integration reports, for the pop-up's details
        const first = forecast.hourly?.[0] ?? {};
        hass.states[weatherId] = { ...w, attributes: {
            ...w.attributes, supported_features: features,
            dew_point: first.dew_point ?? 9, uv_index: first.uv_index ?? 3, cloud_coverage: first.cloud_coverage ?? 40,
            wind_gust_speed: first.wind_gust_speed ?? 24, visibility: 16, visibility_unit: 'km', precipitation_unit: 'mm',
        } };
    }
    hass.connection = {
        ...hass.connection,
        subscribeMessage: async (listener, message) => {
            if (message.type !== 'weather/subscribe_forecast') return original(listener, message);
            listener({ type: message.forecast_type, forecast: forecast[message.forecast_type] ?? null });
            return () => {};
        },
    };
    return hass;
}
