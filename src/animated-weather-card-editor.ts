// Entry point for the lazy-loaded config editor bundle.
//
// The main `animated-weather-card.js` bundle does NOT register the editor
// element. When Home Assistant calls `getConfigElement()` on the card, the
// card injects a <script> tag pointing at this bundle. Loading this file
// imports the editor class and registers it with `customElements.define`.
//
// Splitting the editor out keeps the runtime-path bundle smaller — most
// dashboards never open the visual editor.

import { AnimatedWeatherCardEditor } from './config-editor';

if (!customElements.get('animated-weather-card-editor')) {
    customElements.define('animated-weather-card-editor', AnimatedWeatherCardEditor);
}
