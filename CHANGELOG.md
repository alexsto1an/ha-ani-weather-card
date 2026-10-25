# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2026-10-25

### Changed

- GSAP, the animation library, is bundled into `animated-weather-card.js` instead of loaded from cdnjs.cloudflare.com: the card fetches no code from anywhere else, and moves on screens without internet access. The main file grows to about 76 KB gzipped. The card always uses its own GSAP, and leaves alone any other card's on the same dashboard.
- The live demo's cards let their weather spill on phones too, as they do on a dashboard. Before, every card kept its weather inside on screens 640 px wide or less, even with the tuning section's Keep the weather inside switch off; now that switch is what keeps it in.

### Fixed

- Text from an entity or the config could break out of the HTML it was written into: a moon sensor whose state held a quote, any value in the visual editor, and a `rgb()` or `rgba()` colour with quotes or a semicolon in it. The sun tracker now builds a moon icon only from Home Assistant's eight phases, the editor escapes every value, and colours take only numbers inside `rgb()` and `rgba()`.
- The visual editor stopped drawing when an engine setting in YAML wasn't a number. It now shows the default the card falls back to.

## [1.0.2] - 2026-10-25

### Changed

- The repository runs HACS's own validation on every change and daily, ahead of submitting the card to HACS's default store. Nothing in the cards changed.

## [1.0.1] - 2026-10-24

### Fixed

- Installing through HACS failed with "Could not download". `hacs.json` told HACS the release was a zip (`zip_release`) while naming the card's JavaScript file as the one to fetch, so HACS downloaded that file and tried to unzip it. HACS now installs the release's five files directly and registers `animated-weather-card.js` as the dashboard resource. Releases no longer carry a zip.

## [1.0.0] - 2026-10-24

The first public release: two cards for Home Assistant, the Animated Weather Card and the Animated Sun Tracker, in one download.

### The weather card

- **A sky for every condition.** Each condition has its own layered sky, and its light follows the real sun from `sun.sun` through dawn, day, dusk and night, dissolving from one to the next. The temperature leads, with the condition, "Feels like" and your indoor reading under it, and the metrics in one quiet row: humidity, wind, pressure and the next sunset or sunrise.
- **Weather that moves like weather.** Rain falls at a steady pace and splashes on the card's lower edge, snow drifts with the wind with the smaller flakes farther away, fog drifts in layers, leaves blow across on windy days, and lightning lights the sky from above with the card's jolt following like thunder. The live wind speed sets how fast it all moves. Rain, snow and leaves can fall out of the card onto the dashboard (`spill_particles`).
- **A note from your AI.** With `show_note`, Home Assistant's AI Task (2025.8 or later) writes a line and a longer note from the hours ahead: when rain starts and stops, the high and low, gusts, UV, and what to wear when you're out, from your calendar (`note_calendar`), which sends only its events' times. The card works out the facts and the AI only words them. Pick a voice (`note_tone`): snarky, calm, friendly or dry. Serious weather always gets plain advice. Every screen you're signed in on shares the one note, rewritten after an hour or when the forecast changes, and only while a screen shows the card. Or show a note from any text entity (`note_entity`).
- **Planes overhead.** With the Flightradar24 integration (`flights_entity`), each flight that enters your area crosses the card once, at its real heading, altitude and speed, labelled with its flight and type. It's drawn as its aircraft: an airliner, a wide-body, a 747, a rear-engine or business jet, a turboprop, a light aircraft or a helicopter. After dark, it's its lights: green or red at the near wingtip, white strobes and a red beacon.
- **Your own sensors.** Temperature, feels like, humidity, wind speed and direction, pressure, and an indoor reading, from your weather station. The sky still follows the forecast.
- **Fits any frame.** The metrics share a row when they fit and fold into a grid when they don't, measured against the labels in your language. Wide cards move the metrics beside a larger temperature, short sections rows step down to tighter layouts instead of clipping, and `compact: true` gives a single strip. The card sizes itself in the sections view.
- **Your colours.** The sky palette, or the theme palette (`color_palette: theme`), which drops the sky and draws the weather in your theme's colours, light or dark. Recolour any sky, the text, the sun, the rain and the snow (`custom_colors`), or define whole skies in your theme. Seven engine settings scale the weather (`engine_settings`).
- **Live, and calm about it.** New readings fade in without a re-render, and a new condition fades the old weather out as the new one arrives. Motion rests while the tab is hidden or the card is scrolled away, and with `auto_pause` while the window is in the background.

### The sun tracker

- The sun's path across your day, with the next sunrise or sunset as the headline, first and last light, solar noon, the length of the day, and the moon's phase from the Moon integration.
- Its sky follows the sun in the weather card's palette, and `weather_entity` gives it your weather's sky, so a compact tracker under the weather card reads as one piece.
- Regular, wide and compact layouts, and the theme palette.

### For everyone

- **Readable in every sky.** Every built-in sky is tested to meet WCAG AA contrast where the card's text sits. Screen readers hear temperature and condition changes, and decorative layers are hidden from them. With reduced motion, the sky stays still.
- **Speaks your language.** Conditions, the humidity, wind and pressure labels, and the moon phase come from Home Assistant's translations. The cards' own words, like "Feels like" and "Sunset", are in nine languages, and fall back to English in others. Times follow your profile's 12- or 24-hour setting.
- **Set up visually.** Every weather card option is in the visual editor, and YAML is there when you want it.
- **Light to load.** Five files: only `animated-weather-card.js` is a dashboard resource, about 49 KB gzipped, and it loads the editor, the note writer, the planes and the developer panel only when a card needs them. GSAP comes from a CDN; without it, the card shows the sky and every value, still.
- **Try it first.** A [live demo](https://alexsto1an.github.io/ha-ani-weather-card/) runs the real card in your browser, on sample data or your own weather, and a [setup guide](https://alexsto1an.github.io/ha-ani-weather-card/setup/) walks through every step.
- **Developer mode.** `dev_mode: true` shows sample weather with a panel for every condition, time of day and layer, and a Fly a plane button. Only a card in dev mode logs to the console.

[Unreleased]: https://github.com/alexsto1an/ha-ani-weather-card/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/alexsto1an/ha-ani-weather-card/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/alexsto1an/ha-ani-weather-card/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/alexsto1an/ha-ani-weather-card/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/alexsto1an/ha-ani-weather-card/releases/tag/v1.0.0
