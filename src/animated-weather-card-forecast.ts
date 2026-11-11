// Entry point of the lazy-loaded forecast bundle (animated-weather-card-forecast.js).
//
// The main bundle holds the cards, their skies and the page's forecast
// subscriptions; everything the forecast and the clock draw is here. The
// first card that shows either injects a <script> for this bundle, and
// loading it hands the cards an attach() through a window global (the two
// bundles don't share a module scope).

import type { ForecastExtras, ForecastHost, ForecastViews } from './forecast-host';
import { attachWeather } from './fc-weather';
import { FORECAST_CSS } from './fc-css';

/** One style element per card for everything the forecast adds */
function style(host: ForecastHost): void {
    if (host.element.querySelector(':scope > style.awc-fc-css')) return;
    const s = document.createElement('style');
    s.className = 'awc-fc-css';
    s.textContent = FORECAST_CSS;
    host.element.append(s);
}

const views: ForecastViews = {
    version: 2,
    attach(host: ForecastHost): ForecastExtras {
        style(host);
        return attachWeather(host);
    },
};

window.AnimatedWeatherCardForecast = views;
