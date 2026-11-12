// Entry point of the lazy-loaded forecast bundle (animated-weather-card-forecast.js).
//
// The main bundle holds the cards, their skies and the page's forecast
// subscriptions; everything the forecast and the clock draw is here. The
// first card that shows either injects a <script> for this bundle, and
// loading it hands the cards an attach() through a window global (the two
// bundles don't share a module scope).

import type { ForecastExtras, ForecastHost, ForecastViews } from './forecast-host';
import { attachWeather } from './fc-weather';
import { attachForecastCard } from './fc-fcard';
import { attachView } from './fc-view';
import { attachNightstand } from './fc-night';
import { attachWall, isWall } from './fc-wall';
import { FORECAST_CSS } from './fc-css';
import { followTracker } from './fc-tracker';

/** One style element per card for everything the forecast adds */
function style(host: ForecastHost): void {
    if (host.element.querySelector(':scope > style.awc-fc-css')) return;
    const s = document.createElement('style');
    s.className = 'awc-fc-css';
    s.textContent = FORECAST_CSS;
    host.element.append(s);
}

/** The weather card: its regular layout, or the wall when the frame is a wall's; it changes over when the frame does */
function attachCard(host: ForecastHost): ForecastExtras {
    const root = host.element.querySelector('.animated-weather-card') as HTMLElement;
    let mode = '';
    let impl!: ForecastExtras;
    const pick = () => (host.config().show_forecast && isWall(root) ? 'wall' : 'card');
    const make = () => { mode = pick(); impl = mode === 'wall' ? attachWall(host) : attachWeather(host); impl.update(); };
    make();
    let raf = 0;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => { if (pick() !== mode && !impl.away()) { impl.destroy(); make(); host.fit(); } });
    }) : null;
    ro?.observe(root);
    return {
        levels: () => impl.levels(), setLevel: l => impl.setLevel(l), levelOk: o => impl.levelOk(o), fitted: () => impl.fitted(),
        update: () => impl.update(), seen: v => impl.seen(v), away: () => impl.away(), conditionText: s => impl.conditionText(s),
        open: () => impl.open(),
        destroy() { ro?.disconnect(); cancelAnimationFrame(raf); impl.destroy(); },
    };
}

const views: ForecastViews = {
    version: 2,
    attach(host: ForecastHost): ForecastExtras {
        style(host);
        if (host.surface === 'forecast') return attachForecastCard(host);
        if (host.surface === 'view') return attachView(host);
        if (host.config().layout === 'nightstand') return attachNightstand(host);
        return attachCard(host);
    },
    followTracker,
};

window.AnimatedWeatherCardForecast = views;
