// Entry point of the lazy-loaded forecast bundle.
//
// The main bundle holds the forecast's data and the cards' shells; the
// drawings (the weather card's forecast, the forecast card and the pop-up)
// are here. The first card that shows a forecast injects a <script> for this
// bundle, and loading it hands the drawings to the cards through a window
// global (the two bundles don't share a module scope).

import { FORECAST_VIEWS } from './forecast-views';

window.AnimatedWeatherCardForecast = FORECAST_VIEWS;
