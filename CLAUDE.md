# CLAUDE.md

This file gives Claude Code (claude.ai/code), and anyone else working in this repository, a map of the code: how it's built, how the pieces fit, and the conventions that keep it working.

## The project

Animated Weather Card turns a Home Assistant weather entity into a living sky. The condition and the time of day set the light. Rain, snow, fog, wind, lightning and clouds move behind the numbers, and the temperature is always the first thing you read. The same bundle registers two more cards: the Animated Forecast, the weather card's own engine showing the hours and days ahead, and the Animated Sun Tracker.

These files hold the rest of the story:

- **[README.md](README.md):** the user-facing documentation. Its options tables and conditions table describe the code exactly, so keep them in step with it.
- **[PRODUCT.md](PRODUCT.md):** the design brief: who it's for, the voice, and the principles.
- **[CHANGELOG.md](CHANGELOG.md):** the history. Add a line under Unreleased for every user-visible change.

## Commands

```bash
npm install
npm run build          # the six bundles, written to the repository root
npm run dev            # rebuild on change
npm run demo           # build, then assemble the live demo in _site/
npm run type-check     # tsc --noEmit, strict
npm test               # Vitest, once
npm run test:watch
npm run test:coverage
```

## How it ships

- **Six bundles.** esbuild builds six minified IIFE files, configured in `esbuild.config.js`:
  - `animated-weather-card.js`: the three cards (the weather card, the forecast card and the sun tracker), their skies and weather, and the page's forecast subscriptions. It's the only dashboard resource.
  - `animated-weather-card-editor.js`: the three cards' visual editors, loaded the first time someone opens a card's settings (`loadEditorBundle`).
  - `animated-weather-card-dev.js`: the developer panel, loaded only by cards with `dev_mode: true`.
  - `animated-weather-card-note.js`: the note writer, loaded only by cards with `show_note: true` and no `note_entity`.
  - `animated-weather-card-planes.js`: the plane fly-overs and the aircraft they draw, loaded only by cards with a `flights_entity` (or `dev_mode`). The main bundle keeps `FlightTracker`, which diffs the flights on every update.
  - `animated-weather-card-forecast.js`: everything the forecast and the clock draw: the clock, today's high and low, the turning line, the hourly row and its chips, the icons, the slide, the forecast card's insides and its strip, the view that opens on tap, the nightstand and the wall. Loaded only by cards with `show_forecast`, `show_clock` or `layout: nightstand`, and by the forecast card (`mountExtras`); until it arrives, the card is today's card. About 60 KB gzipped.
- **Loading the others.** The cards fetch them with `loadSiblingBundle` (`bundles.ts`), from the folder the main bundle was loaded from. It keeps the main bundle's `?v=` or `hacstag` cache buster, loads each file once, and allows a retry after a failed load.
- **Committed bundles.** The bundles are committed, because HACS users on `main` get them straight from the branch. CI fails a pull request whose bundles don't match a fresh build, so commit the rebuilt files with every source change.
- **GSAP, bundled.** GSAP 3.15 (`gsap`, the one runtime dependency) is bundled into the main bundle, which sets `window.AnimatedWeatherCardGsap` for every animation, the planes bundle's included: the card fetches no code at runtime and moves without internet access. Nothing reads or writes `window.gsap`, which another card on the dashboard may own. esbuild keeps GSAP's license notice at the end of the bundle (`legalComments: 'eof'`), and a test holds the bundles to that.
- **Size.** The main bundle is about 275 KB, or 82 KB gzipped, GSAP's 28 KB included. Keep anything only the editor, the forecast, the note writer, the planes or the developer panel needs out of it: the forecast's words, drawings and CSS are in its own bundle.
- **HACS.** `hacs.json` sets `render_readme: true` and `filename: animated-weather-card.js`, without `zip_release`. HACS reads it at the release tag, finds that file among the release's assets, registers it as the dashboard resource and downloads every asset into `www/community/ha-ani-weather-card/`, so a release carries exactly the six bundles (a test holds the workflow to the build). With `zip_release`, HACS downloads the asset `filename` names and unzips it, which broke 1.0.0. HACS shows the release tag as the version. Keep `hacs.json` to the keys HACS accepts (name, content_in_root, country, filename, hacs, hide_default_branch, homeassistant, persistent_directory, render_readme, zip_release): its validation rejects any other key, and `country` takes real country codes only. `.github/workflows/validate.yml` runs HACS's own validation (`hacs/action`, category `plugin`) on every push, pull request and daily; HACS's default store requires it to pass with no checks ignored.
- **Live demo.** `demo/` holds a page that runs the real card on sample data, published to GitHub Pages (https://alexsto1an.github.io/ha-ani-weather-card/) by `.github/workflows/pages.yml` on every push to `main`. `npm run demo` builds the card and assembles the site in `_site/` (ignored): the page, the main bundle, the note writer's, the planes' and the forecast's, and only the icons the cards name, taken from `@mdi/js`. A misspelled icon fails the build. The page loads the card, and the GSAP inside it, before its settable clock (`demo/clock.js`): GSAP reads the clock as it loads and stalls after the clock jumps back, while the card reads the time as it draws. The cards sit at their real size, never scaled: the fit measures real widths, so the page makes a card larger by making it wider. The light around each card, and the tint of the whole page, come from the card's live `--awc-sky-mid` (read from its `.sky` layer, so the light follows the hour a slide shows) and its `.lightning` layer; a setup change waits for the new card to lose its `loading` class before it dissolves in; the sensors section hands its reading over to the card's `.temperature-value` as the card fades it through; and the tracker section lays its time scrubber over the tracker's `.st-chart`, where the card draws the sun at `hour / 24` of its width (over the whole `.st-card` in the compact strip, whose chart sits beside the headline), and measures it again whenever the card replaces the children of its `.st-card`. Renaming any of those, or changing that mapping, breaks the page, not the card. The hero and the dashboard's full-size card write their note (`show_note`) through a stand-in for Home Assistant in `buildHass` (`standInAi`): an AI Task that answers with `NOTES`, hand-written samples per condition, by day and by night, with no numbers or times so they also suit the visitor's own weather; a forecast of 48 hours and 10 days, each weather with its own story from now, whose current hour reads what the card shows; and one user-data store for the whole page. The same weather, reading, sun times, hour and live answer get the same `connection`, so a plane or a palette change doesn't make a forecast card resubscribe and come home. Only cards that share the page's weather may write notes, or two would keep rewriting the one note they share. The note lab (`#note`) is the exception that proves it: its card reads its own entity (`ENTITIES.noteWeather`), so its notes are stored apart. Its card keeps one setup, so a new voice never restarts its weather: the stand-in answers in the voice picked when it answers (`tone` can be a function; `VOICE_NOTES` holds calm, friendly and dry, `NOTES` is snarky), picking a voice forgets that entity's notes (`forgetNotes`) so the card writes a new one behind its status, and `noteDelays` hold back the forecast and the AI so each status can be read. The dashboard gives that card the five rows a note asks for (`CARD_ROWS`). The forecast section (`#ahead`) holds the weather card with `show_forecast` and `show_clock`, the forecast card, and the compact card over the strip, at a phone's real sizes from `HA`'s row height and gap (`AHEAD_ROWS`); it's set up afresh on a palette change and when the visitor's weather arrives or leaves, and waits for the forecast bundle to draw before it dissolves in. The dashboard section is a stand-in for Home Assistant's sections view, built on the numbers in `HA` (`demo/scene.mjs`): a section grid's row height and gaps, the column widths, the view's padding, the narrow breakpoint and the sidebar's width. If Home Assistant changes them, change them there. The page's only calls out, besides GSAP, are for the visitor's own weather, which the page asks for as it opens (the first weather key): their location goes to Open-Meteo for the reading and the forecast (48 hours and 10 days, inches for American visitors) and to BigDataCloud for the place's name. `wmoCondition`, `liveReading`, `liveForecast` and `placeName` in `scene.mjs` turn the answers into the sample world's terms, `solarElevation`, `solarAt` and `solarTimes` put the real sun where the visitor is (NOAA's algorithm), the cards are set up afresh when their weather arrives or leaves so no reading carries over, and the card's location line follows the name on a live update.
- **Setup guide.** `demo/setup/` is a second page on the same site, at `/setup/`: a quick start and the whole setup in detail (install, the first card, the weather note, the extras, troubleshooting). It shares the demo's tokens and type (`demo.css`) and its code blocks (`code.mjs`), and its one card writes its note through the same stand-in AI on the sample's partly cloudy sky, setting the page's `--page-sky` from its `--awc-sky-mid`. The home page links to it from its nav, its Install button and What you need. A test holds the guide to the code: every option in its YAML exists, every in-page link has a target, and its file table lists the bundles the build makes. Keep it in step with the README when setup changes.
- **The mark.** Weather behind the glass: the sky, the sun and the rain behind one pane of glass with the card's hairline etched across it, the sun crossing its corner. `docs/brand/` holds the full icon's source (serve it and open `icon.html`); the README's `docs/images/icon.webp` is a 192 px render of its day sky. The demo's top bar wears a simpler version, `demo/logo.mjs`, without the rain, which is noise at 26 px. The build draws it into both pages in place of `%LOGO%` and writes `favicon.svg` from it. It holds every sky, and CSS shows the one `<html data-logo>` names: each page's head script sets that from the clock before the first paint (the hours of `phaseForHour`), and the demo sets it from the visitor's real sun when their weather arrives, then keeps it. The sun's rise into the pane's corner is a CSS animation, and reduced motion shows the mark still. The share image, the `og:image` both pages name by its absolute URL, is `docs/images/share.jpg`, a 1200 × 630 JPEG rendered once from `docs/brand/share.html` (the real card on the sample's partly cloudy day, as the hero shows it, under the headline; the file says how to render it again) and copied to the site by the build. A test holds both pages' tags to it.
- **README images.** They live in `docs/images` as WebP and use relative Markdown image syntax, which HACS rewrites to the release tag. HACS doesn't rewrite HTML `<img>` tags, so don't use them.

## Source map

```
src/
├── animated-weather-card.ts        # The weather card and the forecast card: render, live updates, fit, pausing, card registration
├── sun-tracker-card.ts             # The sun tracker card
├── animated-weather-card-editor.ts # Entry point of the editor bundle: the three editors
├── config-editor.ts                # Visual editor for the weather card
├── forecast-card-editor.ts         # Visual editor for the forecast card
├── sun-tracker-editor.ts           # Visual editor for the sun tracker
├── bundles.ts                      # Loads the other bundles from beside the main one
├── animated-weather-card-dev.ts    # Entry point of the developer panel bundle
├── dev-panel.ts                    # Developer panel (dev_mode)
├── animated-weather-card-note.ts   # Entry point of the note writer bundle
├── note-generator.ts               # The note writer (show_note): facts, the AI Task, the shared note
├── forecast-host.ts                # ForecastHost and ForecastExtras: what the main and forecast bundles hand each other
├── forecast-data.ts                # The page's forecast subscriptions, one per entity and kind (every bundle carries it)
├── forecast-feed.ts                # One card's view of them
├── forecast-model.ts               # Days from daily or twice-daily forecasts
├── hour-link.ts                    # One needle across the page: a slide's time, for the tracker and the other slides (both bundles)
├── fc-tracker.ts                   # The sun tracker at another card's needle (the forecast bundle)
├── sun-path.ts                     # The tracker's path geometry, for the tracker and fc-tracker
├── animated-weather-card-forecast.ts # Entry point of the forecast bundle: attach() for each surface
├── fc-core.ts                      # OKLab, springs, the sun at any hour, the timeline's slots
├── fc-data.ts                      # Times, hours, days, the turning line
├── fc-words.ts, fc-words-more.ts   # The forecast's words in nine languages
├── fc-glyphs.ts                    # The icons, lit by their hour
├── fc-row.ts                       # The hourly row, the chips, the days and their range bars
├── fc-slide.ts                     # The slide through the hours
├── fc-clock.ts                     # The clock: the minute's fade, for the card, the wall and the nightstand
├── fc-weather.ts                   # The forecast on the weather card, and its fit levels
├── fc-fcard.ts                     # The forecast card's insides and its strip
├── fc-view.ts                      # The view that opens on tap
├── fc-night.ts                     # The nightstand (layout: nightstand)
├── fc-wall.ts                      # The wall
├── fc-css.ts                       # Their CSS
├── weather-data.ts                 # Reads the weather entity and the optional sensors
├── actions.ts                      # Tap, hold and double-tap actions for the cards, and the card's own `forecast` action
├── action-editor.ts                # Both editors' controls for those actions
├── utils.ts                        # Condition mapping, engine settings, escaping, helpers
├── sky.ts                          # Sky palettes (OKLCH), phases, dissolves, contrast math
├── time-manager.ts                 # Clock-based day/night cycle (enable_day_night_cycle)
├── animation-controller.ts         # Which animations run for a condition; pause and resume
├── modular-integration-bridge.ts   # Builds each animation with its settings
├── base-animation.ts               # Lifecycle base class for animations
├── rain-, snow-, sleet-, wind-, lightning-, clouds-, fog-, stars-, sun-animation.ts
├── animated-weather-card-planes.ts # Entry point of the planes bundle
├── planes-animation.ts             # Plane fly-overs (the planes bundle)
├── aircraft.ts                     # Each aircraft family from its real dimensions, drawn from the side
├── particle-pool.ts                # Recycled particles for rain, snow and sleet
├── gsap-effects.ts                 # Clouds, leaves, swooshes and fog
├── cloud-band.ts                   # Where clouds ride: the forecast's floor, for both bundles
├── flight-tracker.ts               # Flightradar24 arrivals for plane fly-overs
├── localize.ts                     # The cards' own strings, times and durations
├── icons.ts                        # The cards' own icons, from the forecast's Senja set: the readings, indoors, no data, the tracker's
├── color-utils.ts                  # custom_colors → CSS variables
├── constants.ts, types.ts
├── styles.ts                       # Barrel for the style modules
└── styles/
    ├── card.ts                     # Weather card CSS: sky, layout, variants, animations
    ├── editor.ts                   # Visual editor CSS
    ├── dev-panel.ts                # Developer panel CSS
    └── icon-box.ts                 # Sizes HA's ha-icon to its glyph
```

```
demo/
├── index.html, demo.css, demo.js   # The live demo page and its controls
├── setup/index.html, setup.css, setup.js  # The setup guide, at /setup/
├── code.mjs                        # Code blocks for both pages: YAML colouring, icons, Copy buttons
├── logo.mjs                        # The mark for the top bar, and the favicon the build writes from it
├── scene.mjs                       # Its sample world: weather, times of day, sensors, the mock hass
├── clock.js                        # A Date the page can set, for any time of day
├── ha-elements.js                  # Stand-ins for ha-card and ha-icon
└── build.mjs                       # npm run demo: assembles _site/
```

## The weather card

### Rendering and updates

- **Element.** `AnimatedWeatherCard` is a plain `HTMLElement`, not Lit. It renders into light DOM: an `ha-card` with the card's markup and a `<style>` holding its CSS.
- **Live updates.** The card renders once, then updates in place: `_updateDataInPlace` swaps text, the hero text fades through, and `syncValueIcon` keeps the wind and pressure arrows current. A data update never restarts the weather: an animation that restarts redraws itself at random, which reads as a snap. Whether an update is due compares the weather entity's attributes as they are, not rounded, since what's shown can carry a decimal; the update only touches text that changed.
- **Icons.** The readings, the indoor reading and the card with no data draw their icons inline from `icons.ts`: the forecast's Senja set (the pack's drop, Windy, Sunrise 2 and Sunset 2, and a dial, a house and a cloud with a mark drawn in its manner), one path each at one decimal, sized by `--mdc-icon-size` like `ha-icon` and filled with `currentColor`, so the card's sizes and the theme's icon colour apply. `setIcon` turns the sun metric's between sunrise and sunset in place. The sun tracker draws its icons from the same file. The wind and pressure arrows and the editors' icons stay Home Assistant's `ha-icon`.
- **Condition changes.** When the condition changes, the old weather fades out, the new weather fades in and the sky cross-fades. Nothing is rebuilt.
- **Data.** `processWeatherData` (`weather-data.ts`) combines the weather entity with any configured sensors:
  - outdoor temperature, feels like, humidity, wind speed and direction, pressure and indoor readings (a wind speed sensor also sets how fast the weather moves; a direction sensor can report degrees or a compass point)
  - the sun entity, for the sunset or sunrise metric
  - the condition's display name, which comes from Home Assistant's `formatEntityState` so it's translated
  - the temperatures (outdoor, feels like, indoor) in whole degrees, or to one decimal with `temperature_decimals: 1` (`temperatureDecimals`), in the language's number format
- **Condition mapping.** `getWeatherClass` (`utils.ts`) maps any condition string to one of fifteen classes (`SKY_CONDITIONS`):
  - It matches substrings in priority order, so free text from other integrations works too.
  - Storm beats fog, fog beats heavy rain, and so on.
  - `hail` becomes `sleety`.
  - Anything unknown becomes `sunny`.
  - A clear sky: Home Assistant's `clear-night` and `sunny` decide at any hour, since HA turns `clear-night` at sunset, often long before the clock's `sunset_hour` (a clock check there once left winter evenings with no moon or stars all night). Free text that only says "clear" takes the sky's phase (`ClearSkyTime.night`: the sun, or the cycle), else the hours. With `enable_day_night_cycle` (`ClearSkyTime.clock`) the hours decide every clear sky.
- **Card picker.** The three cards' `customCards` entries have `preview: true`, so the card list shows them live on `getStubConfig`, and `getEntitySuggestion` (Home Assistant 2026.6 and later) offers them when someone picks a `weather.*` entity or the sun: the weather card regular and compact, the forecast card as Forecast and Forecast strip, the tracker regular and compact. Home Assistant passes `getStubConfig` the unused entities, then the used ones: the weather card and the forecast card take the first weather entity and `sun.sun`, the tracker the sun and a sensor in a moon phase. The forecast card's `documentationURL` is the README's `#the-forecast-card`. The picker clips each preview, so spilled weather stays in its tile. A suggestion or stub never turns on the note, which would call the AI from the picker.
- **Actions.** `tap_action`, `hold_action` and `double_tap_action` (`actions.ts`) work on the weather card's `.weather-info` and the tracker's `ha-card`, both kept across renders, and read the config at each gesture. With no `tap_action`, a tap fires `hass-more-info`, which every Home Assistant version handles; an action that's set goes out as `hass-action` (2023.7 and later) for Home Assistant to run. With the forecast on (`show_forecast`, the forecast card), the default tap is the card's own action `forecast` (`CARD_ACTIONS`), which `actionsConfig` sets and `openForecast` runs: the view that opens on tap. With `layout: nightstand`, the default tap is `none`, so a bedside screen is no button and opens nothing bright. An unset hold or double tap fires nothing, because Home Assistant would open more-info for it. A tap waits out the double tap's 250 ms only when one is set, and a hold (500 ms) is watched for only when one is set. The target is a button (role, `tabindex`, Enter and Space) only while a tap does something. Dev mode has no actions.
- **Escaping.** Entity and config text goes through `escapeHtml` wherever it reaches markup, attributes included: the editors' values, the cards' labels and icons. An icon is picked only from a known value (the tracker's eight moon phases, looked up in `MOON_PHASE_ICONS`), never built from a state, and a state is looked up in a table with `lookup` (`utils.ts`), which reads only the table's own entries, never what every object inherits (`constructor`). Colours are validated before they reach CSS (`isValidColor`: hex, names, and `rgb()`/`rgba()` of numbers only), the fog's `custom_colors.fog_color` included, and the style attribute they land in is escaped too. `test/cards/escaping.test.ts` feeds hostile values through each.

### The sky

- **Palettes.** `sky.ts` authors each condition's day sky in OKLCH: zenith, mid, horizon, a glow and a scrim. Dawn, dusk and night are derived by shifting lightness, chroma and hue. Everything is emitted as hex or rgba, because older wall-tablet WebViews can't parse `oklch()`.
- **Phase.** The card sets `data-phase` to `dawn`, `day`, `dusk` or `night`.
  - **From the sun (the default):** `skyPhaseFromSun` reads `sun.sun`, or `sun_entity`. Below −6° elevation is night, −6° to 6° is dawn or dusk depending on `rising`, and above that is day.
  - **From the clock:** with `enable_day_night_cycle`, `TimeOfDayManager` decides instead. Dawn runs from an hour before `sunrise_hour` to 30 minutes after, and dusk from 30 minutes before `sunset_hour` to an hour after.
- **Dissolves.** The sky colours are registered `<color>` custom properties (`registerSkyProperties`), so they transition over 3.2 s on one symmetric curve, and the sun and clouds follow it. Browsers without `CSS.registerProperty` switch instantly.
- **Overrides.** `--weather-<condition>-background`, from an HA theme or from `custom_colors` via `color-utils.ts`, replaces the whole sky for that condition. With `color_palette: theme`, the sky is hidden and both cards follow the theme: text in its text colours, the hero (the temperature, the tracker's time) and the tracker's day arc in `--primary-color`, icons in `--state-icon-color` (what HA's tile card uses for sensors), and the sun in HA's sun colour.
- **Contrast.** `test/styles/sky.test.ts` checks WCAG AA contrast for secondary text for every condition at every phase, sampled where text sits. That includes inside the glow, in the narrow, wide and compact layouts, and the note's full-strength text where it sits. Any sky change has to pass it.

### The note

- **Sources.** With `show_note`, the card writes it (below). With `note_entity`, which wins, it reads any text entity: its state is the one-line version and `note_attribute` (`note`) the longer one; either stands in for the other (`readNote`, `weather-data.ts`).
- **Two lengths.** Both are in the markup, after `.hero-meta`. `data-note` (`long`, `line`, `none`) picks, from the fit: the note is the first thing to give way, before the line under the condition. A length is shown whole or not at all: the fit counts one its clamp cuts short (four lines long, two for the line) as not fitting. A phone's five-row section lands on `snug` with the line; `snug`'s 6 px note margin is what makes that fit (152 of 155 px).
- **Full-strength text.** On narrow cards the note runs into the sun's glow, where the secondary tint falls below 4.5:1, so it uses the text colour at the quiet tier's size.
- **Stale notes.** With a `generated_at` attribute, the note hides `note_max_age` minutes later (180 by default), on a timer, so it leaves even if nothing else updates.
- **Rows.** With a note, `getGridOptions` asks for 5 rows and `getCardSize` adds one. The compact strip and dev mode have no note.
- **Writing it.** `NoteWriter` (`note-generator.ts`, the note bundle) reaches the card only through `NoteHost` (`hass`, `config`, `noteVisible`, `showNote`, `noteWriting`), plain names for the same reason as the dev panel's. It listens to the forecast through the page's shared subscription (`subscribeForecast`, `forecast-data.ts`: hourly, else twice daily, else daily, by `supported_features`) and subscribes to the user's frontend storage, works out the facts (`computeFacts`: first wet and dry hours, high and low, gusts, UV, the hours out, a severe flag, what's missing), and asks `ai_task.generate_data` for `line` and `note` (`NOTE_STRUCTURE`), without an `entity_id` when it uses the default AI Task, with a 30 s timeout. Severe weather overrides the tone.
- **Hours out.** With `note_calendar` (one calendar or a list), the writer reads `calendar.get_events` for the next 12 hours: on start (the first note waits up to 10 s for it, as for the forecast), every 15 minutes while the card is on screen, and when a calendar's state changes. `calendarWindows` keeps timed events that aren't cancelled or online (a location that's a link), runs together those under 30 minutes apart, keeps each one's real start and end so an event under way doesn't change from one look to the next, and takes the earliest three. Only the times reach the AI, never a name, place or description. A calendar that can't be read leaves the hours out of the note, never the note itself.
- **Sharing it.** A note is stored in the user's frontend storage under `animated_weather_card_note:<weather entity>:<tone>:<AI Task or default>:<calendars>:<language>:<time zone>`: everything two cards or two screens can differ in, or they'd each rewrite the other's note, round after round. The hours out change through the day, so they're in the `factsKey`, not the key. With it go the server's unit system and its `factsKey`. A note under 15 minutes old stands even when a screen reads the facts a little differently; only a new condition replaces it sooner. Every screen of that user shows it. It's rewritten after `NOTE_REFRESH_MINUTES` (60), or when the facts change, by one screen that's showing the card: a claim stops the others for 45 s, and a failure waits 10 minutes. Nothing shows when something goes wrong.
- **While it's written.** `noteWriting(stage)` puts a status in the note's place (`data-writing`, the size of the note's length) when a new note is on its way and the card has just come into view or holds nothing true about this weather, so an old note never shows only to be replaced. The status says what's really happening, from the writer: `forecast` while it waits for the forecast's first answer ("Reading the forecast"), `writing` once the call is out ("Writing the note"), both in `localize.ts`. The note then types itself in (`typeIn`): the whole text is laid out from the first frame with the rest transparent (`.note-untyped`), so the lines and the fit never move; with reduced motion or `animate: false` it's simply there. While the card stays in view, the next note fades through instead. There's no status while the AI Task isn't set up.

### Animations

- **Classes.** `WeatherAnimationController` decides which animations a condition runs and owns their state. `ModularIntegrationBridge` builds them. Each kind of weather is a class on `BaseAnimation`.
- **Particles.** Rain, snow and sleet draw from a `ParticlePool`: a fixed pool, recycled and pre-warmed, so the weather is already falling when it fades in.
- **Shared effects.** Clouds, leaves, swooshes and fog live in `gsap-effects.ts`. Each cloud rides a full-width `.cloud-track` whose `xPercent` carries it across the card's current width, so a resize can't strand a cloud mid-sky. Remove clouds with `removeClouds`, which takes their tracks too.
- **Cloud blur.** A cloud is three translucent parts from `cloudShape` (a pill-shaped body and two round puffs), so a puff shows faintly where it overlaps the body. Each part is blurred by a mask, `cloudPartMask`: the part filled on a canvas and drawn onto another through its shadow alone (`shadowBlur` is twice the blur, the same Gaussian as CSS `blur()`), kept by size. The colour stays CSS, so it dissolves with the sky. Don't go back to `filter: blur()`: on an iPhone it drew a dark column inside the blurred cloud, at its right edge, and a test holds the clouds to masks. Theme clouds are crisp. Without a canvas, clouds fall back to CSS blur. `test/setup.ts` stands in for the canvas.
- **Wind.** Motion speed is the live wind speed scaled by `engine_settings.windSpeed`. A new reading reaches running animations through `BaseAnimation.setWindSpeed`, which never restarts them: clouds ease to the new speed, leaves read it as they spawn, and snow, sleet and fog take it at their next start. The bridge ignores an unchanged value.
- **Engine settings.** `getWeatherSettings` clamps the engine settings. YAML accepts a wider range than the editor's sliders, and out-of-range values fall back to the default.
- **Spill.** Rain, snow, sleet and leaves fall out of the card, and clouds rise up to `CLOUD_OVERHANG_PX` above it. Setting `spill_particles: false` keeps everything inside. `clip-path` only hides what lies past the card, so the card also takes `contain: layout` with spill on: without it, a fog layer or a cloud track counts towards the page's size and brings up scrollbars. Paint containment would clip the spill. Firefox counts overflow past the card in the page's size despite the containment (issue #16), so fog and clouds also take `overflow: clip` (their boxes already hold all they show, the clouds' overhang included), and in Firefox alone (`@supports (-moz-appearance: none)`) leaves stay inside the card: Firefox counts them even inside an `overflow-clip-margin`.
- **Planes.** `FlightTracker` seeds itself on the first update, then reports only new airborne arrivals. `planes-animation.ts` turns each flight's heading, altitude, ground speed and vertical speed into a pass. At most three planes fly at once. The tag says `flight_label`: the flight number and aircraft (`flight`, the default), the route (`route`: `routeOf` gives the cities, else the IATA codes, from `airport_origin_city` / `_code_iata` and the destination's; none, and the flight's number stands), or the route over the flight (`both`, two spans). A city route wider than `ROUTE_MAX_SHARE` of the card flies as codes, measured once the plane is in the layer. Text only (`textContent`), never markup.
- **Aircraft.** `aircraft.ts` picks a family from the flight's ICAO type code (`aircraftFamily`: narrow-body, wide-body, four-engine, rear-engine, turboprop, light, helicopter; unknown codes fly as a narrow-body) and draws it from a small 3D model in metres after one real aircraft (A320neo, 787, 747-8, CRJ900, ATR 72, Cessna 172, H135), projected from the side as seen from `VIEW_ELEVATION_DEG` below. Each family is drawn once and cached. A drawing reports its aspect, how much of it is the aircraft (a rotor or propeller reaches past), the fuselage's height for the label, and its near side's lights. Size follows length (`planeLengthPx`: business jets have their own in `BIZJET_LENGTHS`), softened by an exponent and capped so a low 747 never covers the temperature. A helicopter flies nose down (`FORWARD_PITCH_DEG`).
- **Lights.** At night, with the sky palette, a plane is its lights (the `night` fly-over option): the outline at 22% once the sky is night (at dusk and dawn a plane up high is still sunlit, so it keeps its outline), steady green at the near wingtip flying right and red flying left (CSS on `eastbound`/`westbound`, since the drawing is mirrored), double-flash white strobes, the red belly beacon and the white tail light. On the theme palette there's no night sky, so planes stay silhouettes.

### Fitting the frame

- **Metrics.** `applySizeState` measures whether the metrics fit in one row against the real, translated labels. It falls back to a 2×2 grid, with 24 px of hysteresis.
- **Short frames.** In a fixed frame it steps `data-height` down through `compact`, `short`, `tight` and `minimal` (`HEIGHT_STEPS`) until nothing overflows. With a note, the note gives way first (`NOTE_FIT_STEPS`, which also sets `data-note`): `close` (regular's sizes with short's gaps, to keep the longer note whole), then its one line, then `snug` (short's sizes, keeping the location and the line under the condition), then none, then the steps above. Each step keeps the one before it and gives up a little more, so the card lands on the roomiest layout that fits: a phone's sections row (353 × 248) is `tight`, which keeps the metric labels.
- **Wide cards.** At 640 px and wider (a container query), the metrics move beside a larger temperature.
- **Compact variant.** `compact: true` sets `data-variant="compact"`. Its fit also counts the condition cut short as not fitting, so a narrow strip shrinks the temperature (`short`, then `tight`) to keep the condition whole.
- **Sections view.** `getGridOptions` sizes the card at 12 × 4, 12 × 5 with a note, or 12 × 2 compact. With `show_forecast`, `gridRows` asks for 8 with an hourly forecast and 5 without (by `supported_features`), one more with a note; the nightstand 6; the clock none. `getCardSize` adds 3 with the forecast.
- **The forecast's levels.** With the forecast on, its levels give way before the card's own steps (see [The forecast](#the-forecast)).
- **Measuring.** The fit compares `getBoundingClientRect` widths with `clientWidth`. CSS `zoom` on an ancestor skews that, so a zoomed screenshot page always shows the grid. Browser zoom and device pixel ratio don't affect it.

### Pausing and motion

- **When it pauses.** Animations pause while the tab is hidden or the card is off-screen (IntersectionObserver). With `auto_pause`, they also pause while the window is in the background. A manual pause from the developer panel wins.
- **What pauses.** Pause and resume a whole timeline, as `pauseCardGSAPAnimations` does, never a tween inside one. GSAP leaves paused children out of a timeline's duration, so a timeline that hasn't drawn yet collapses to nothing and never fires `onComplete`, which strands a pool's particle for good.
- **Still sky.** `prefers-reduced-motion` and `animate: false` both give a still sky: the condition's colour and light, no weather motion.
- **Screen readers.** Decorative layers are `aria-hidden`. The temperature and condition are `aria-live="polite"`.

## The forecast and the clock

### The forecast

- **Two bundles, one card.** The main bundle holds the card, its sky, its weather and the page's forecast subscriptions; the forecast bundle (`animated-weather-card-forecast.js`) draws everything the forecast and the clock add. Every dashboard loads the main bundle and few cards show a forecast, so the drawings, the words and their CSS (about 60 KB gzipped) stay out of it. `mountExtras` loads the bundle the first time a card wants it (`extrasWanted`: `show_forecast`, `show_clock`, `layout: nightstand`, or the forecast card) and calls `window.AnimatedWeatherCardForecast.attach(host)`. Until it arrives, the card is today's card. Dev mode has none of it.
- **The host.** `forecast-host.ts` holds the types the two bundles share, and every name on them is plain, for the same reason as the developer panel's. `ForecastHost` is the card as the bundle sees it: its element and `surface`, `config`, `hass`, `forecast` (the feed), `layers` (the animation controller, for an hour's weather), `skyColors`, `phase`, `current`, `temperature` (as the card writes it), `conditionName`, `fit`, `refresh`, `seen`, `still` and `moreInfo`. `ForecastExtras` is what the bundle gives back: `levels`, `setLevel`, `levelOk` and `fitted` for the fit, `update`, `seen`, `away`, `conditionText`, `open` and `destroy`. `ForecastViews.version` (2) changes when an older main bundle couldn't use the interface; the card attaches only to the version it knows.
- **Surfaces.** `surface` is `card` (the weather card), `forecast` (the forecast card) or `view` (the view that opens on tap). The bundle's entry picks `attachWeather`, `attachWall`, `attachNightstand`, `attachForecastCard` or `attachView`, and swaps the weather card between `attachWeather` and `attachWall` when its frame crosses 640 × 540.
- **One subscription per entity.** `forecast-data.ts` keeps one `weather/subscribe_forecast` per entity and kind for the whole page, on `window.AnimatedWeatherCardForecasts`, because the bundles don't share a module scope; every bundle carries the same small file. The weather card, the forecast card, the view and the note writer all listen to it. `ForecastFeed` (`forecast-feed.ts`) is one card's view of it: the hours and days it asked for, and `settled` once each kind has answered, so an empty forecast is really empty. `forecast-model.ts` joins twice-daily halves into days.
- **What it draws.** `attachWeather` (`fc-weather.ts`): the clock leading the location line (on the compact strip, the quiet line); today's high and low beside the condition; the turning line (`turningLine`, `fc-data.ts`: "Rain from 17:00 to 19:00", "Dry all day") leading the line under the condition, except beside a note, which tells what's coming: with `data-note` `long` or `line`, CSS hides it and the line is today's again, and `fitLine` and `fitCompanion` leave it out (`noted`); the hourly row and its chips at the card's foot, under the readings (now above, the hours ahead below), with the divider moved between them while the row shows (it's back above the readings, carrying the rail, where the row gives way), an hour about every 54 px (`hourCols`, `fc-row.ts`: six on a phone, more on a wider card, rather than wider gaps), the chips centred by auto margins (where they don't fit, they start at the edge), or in the hero's column from 640 px, eight hours; and the slide. With the forecast on, `conditionText` names the condition as the forecast does ("Rain", never "Rainy"; "Clear", never "Clear, night"), and `_updateDataInPlace` asks it before Home Assistant's name.
- **The fit ladder.** `levels()` lists the forecast's levels, roomiest first, set as `data-fc`: `full`, `glyphs` (no chips), `row` (no icons), `none` (no row: the turning line and the rail on the divider) and `bare` (the turning line's own line goes too). `applySizeState` tries each level before the card's own steps, and before the last level no step goes past `compact` (with a note, past the note's `regular` and `close` steps), so the temperature never shrinks for the forecast's sake and a note shortens to its line first. Measured on a phone: 8 rows show everything, 7 drop the chips, 6 the icons, 5 and 4 show the turning line and the rail (at four, the short line sits beside the condition, `tight` as today). Lines are whole or not at all: `fitLine` shows the turning line long, short or not at all, and `fitCompanion` the high and low.
- **The light law.** A level counts only while the row's first line sits at 0.43 of a narrow card's height or lower (`ROW_TOP_MIN`): above it, the sun's glow is too bright behind the row's full-strength text. `levelOk` pushes the section down (`--fc-sec-top`) when there's room, and says no when that overflows. `test/styles/forecast-contrast.test.ts` holds every new text to WCAG AA where it sits, in all 60 skies: the row from 0.43 down, the quiet tint from 0.57 down, the location line, the condition's line, the wide card, the forecast card, the view, the wall and the nightstand. Move a text and move its zone with it.
- **The cloud floor.** Clouds and stars roam the whole sky above the data, behind the clock, the place, the temperature and the lines under it, as on today's card; none sits behind the readings or the row's full-strength text. `cloudFloor` (`cloud-band.ts`) takes the floor, px from the card's top: `floor()` (`fc-weather.ts`) puts it 6 px above the readings on a narrow card (the row sits under them) and 6 px above the row on a wide one, the wall 8 px above its turning line, the view 8 px above its hours (on a tablet, no lower than a third of the way down, where the week starts). It sets `data-cloud-band` on `.animated-weather-card`, the line where clouds must end, in the cloud layer's px. `createGSAPCloud` (`gsap-effects.ts`) places each new cloud by `cloudY`: a set fraction of the way down that sky, the whole cloud, body and blur, above the band. Each track keeps its fraction and its depth (`data-awc-f`, `data-awc-b`), so a new floor moves the clouds already up, and none gives them today's heights back. With no row (`none`, `bare`) there's no floor. A mask (`--fc-floor-c`, `--fc-floor-s`) only guards the line; nothing masks them sideways. The clouds' mask is on `.clouds-container`, never `.clouds-layer`: a mask clips to its element's box, and only the container reaches `CLOUD_OVERHANG_PX` above the card when weather spills, so it carries the spill's fade too. A test holds the band, the moves and the masks.
- **Rows and data.** See the sections view above. Hourly forecasts give the row; twice-daily or daily only give no row (the rail steps half days or days, and the card asks for five rows); no forecast leaves today's card. °F converts the range bars' scale and the flat day's floor (8 °C, 14.4 °F); rain is in mm or in, wind and pressure in the entity's units.

### The slide

- **It stays where it's left.** `attachSlide` (`fc-slide.ts`) moves the ruler 1:1 under a fixed needle, and the card's real sky, light, sun, clouds, fog, wind, rain, snow and lightning go to the hour under it, each as the card shows it for that hour's condition (`LAYER_OF`, `fc-core.ts`; a test holds it to the card's own animation table). A drag starts from what the card shows, its sun included (`readHome`). A slow lift settles on the nearest hour; a flick carries on with a list's deceleration (`SLIDE.momentum`) and lands on the hour it was heading for. The next drag continues from there, so a few swipes reach the far hours (48 are built).
- **The returns.** It comes home on the Now control (`.awc-now`), Home or Escape on the slider, half a minute without a touch (`SLIDE.idleHome`), at once when the card stops being seen (`extras.seen(false)`: the tab hidden, the card scrolled away), and when a new forecast arrives (`update` while away brings it home, then rebuilds). The view's row doesn't come home on idle; it does when the view closes.
- **One spring.** Home is one critically damped spring (`SLIDE.home`, 0.38 s) on one progress: the ruler, every sky colour (mixed in OKLab), the sun and every weather layer go straight from what's visible to now, and the hour's words cross to now's (`wordsSwap`) with no blank frame. Under the finger, each output eases toward the needle's hour (`skyTau`).
- **The readout.** It writes into the card's own elements: the temperature, the condition, the turning line, and the humidity, wind and its arrow, and pressure, and it brings in the hour's weather through `host.layers()`. While it's away the location line becomes the away line ("‹ Now  16:00  in 3 hr."), the high and low step out for the hour's chance, and `extras.away()` is true, so `_updateDataInPlace` leaves those elements alone. When it comes home, `host.refresh()` reads the entity again into them.
- **Gestures.** The claim is 10 px sideways with |dx| > 1.2 |dy| (`SLIDE.slopPx`, `angle`); a vertical drag stays the page's (`touch-action: pan-y pinch-zoom`). Velocity counts the last 80 ms only. A press while it moves catches it that frame and stops there: the listener is on capture and stops propagation, so a catch is never also a tap on the card. Nothing changes on touch-down: the layers an hour ahead needs are pre-warmed with their transition off. A trackpad's sideways swipe scrubs. Controls inside the card that take their own tap carry `awc-noclaim`.
- **The needle.** On a row, the needle is a capsule (`.fc-cap`, `fc-row.ts`): the chips' white with the sky's top colour for its words (7:1 or better in every sky; the chips' colours on a theme), on the labels' line over the first column, as wide as the row's widest label (`sizeCap`, measured on a canvas) and pixel-snapped on the column's centre. It shows while the card is pulled (`awc-pulling`: from the claim, the keys or another card's needle until `leave()`) or the slider has keyboard focus; the slide names its hour (`Ruler.select`, from `showSlot`, and each frame on the way home, so it counts the hours back) and mirrors `--awc-sky-top` to it. Its fill grows behind words that never move (`scale(0.9)` to 1, 180 ms on the press curve; 120 ms out), so they stay sharp over the label they replace, and it lets go only once the ruler is home, crossing with the "Now" beneath it. While it shows, the lens (`Ruler.lens`) fades each label as it reaches the capsule's edge (hidden from 2 px, whole at 12 px, via `--fc-lens`), so a label never peeks out beside the capsule that names it; the labels cross with it as it comes and goes (`data-lens-fade`), and follow the finger at once in between.
- **The ruler.** The row, or where it has given way, a rail on the divider at 25.9 px an hour (`railHourPx`). On the compact strip, a rail under it shows while it's dragged.
- **Keyboard and screen readers.** The slider has `role="slider"`: the arrows step an hour without a tween, Page Up and Page Down three, and Home and Escape go home. `valueText` reads "16:00, in 3 hr.: Cloudy, 22°, 40% chance". The row has a hidden list of the next 24 hours; the chips are a radiogroup with a roving tabindex and full names ("Chance of rain"); the days are spoken rows.
- **Still.** With `host.still()` (reduced motion or `animate: false`) the sky steps with the hour, the row still follows the finger, home is one frame with a 120 ms fade, and the chips swap.

### One needle across the page

- **The channel.** `hour-link.ts`: a window event, `animated-weather-card-hour`, because the bundles don't share a module scope; both carry the small file, and every name on it is plain. `sendHour` sends, `onHour` listens and returns the way to stop.
- **Who sends.** Every slide on an hourly timeline (`attachSlide`), the weather card's and the forecast card's, never the view's and never one that steps by days. Each frame it draws, it sends the source element, its `entity` and `sun`, `at` (now plus the needle's hours, continuous under the finger), the `temperature` there (now's reading through the first hour, between two hours' values after) and the `sky` it writes (the five `--awc-sky-*` colours; null on the theme palette). From `leave()` it sends `at: null` once, so a card that comes home, or is destroyed while away, brings the others home.
- **The tracker.** It follows a needle on its own `sun_entity`. It only listens (`_follow`, in the main bundle): a needle exists only where the forecast bundle draws a slide, so the forecast bundle moves it (`followTracker`, `fc-tracker.ts`, through `ForecastViews` with a `TrackerLink`), which keeps the main bundle inside its budget. `.st-dot`, its `below` and `.st-now-line` move in place to `hourOfDay(at)` on the path as last drawn (`_path`, geometry in `sun-path.ts`), never through `_render`; with the same `weather_entity` it takes the needle's sky, under `.following`, which turns its 3.2 s dissolve off. The headline stays on the real next sunrise or sunset, as the weather card's own sunset reading does while it's dragged. The minute's render re-applies the link. On `null`, `.following` goes first, then `_render`, so the sky dissolves back.
- **Slides follow slides.** An hourly slide (`attachSlide`, not the view's) listens too: another card's needle on the same `entity` moves it as a finger would (`follow`: the ruler goes to the time at once, `setRaw`, and the sky, the sun and the readout ease after it), so the weather card, the wall and the forecast card move together, both ways. It never follows while a hand or the keyboard is on it, runs no idle timer (the leader's `null` brings it home, at once when its ruler is already at now), and a following slide that's grabbed continues from the hour it shows. A hand on it (`claim`, a caught press, the keys) or its Now control makes it the leader (`lead`): from then on it sends, and the card it followed follows it. A new forecast or the hour passing calls `home()` on both.
- **The days follow their own needle.** Every slide calls `onNeedle(at, temperature)` each frame it draws and `onNeedle(null)` from `leave()`; the forecast card, the view and the wall hand it to `daily.follow` (`fc-row.ts`): `data-fc-follow` on the list steps the other days back to 0.5, `data-fc-at` names the needle's day in bold, and the dot moves to that day's bar at the temperature there (`dotRow`; it's created if today had none). The day's key is worked out once a quarter hour of needle time. A forecast card without an hourly row has no slide to follow with, so its days follow another card's needle directly (its own `onHour`). The nightstand has no slide.
- **No echo.** A following slide never sends (`emit` checks `following`), and `leave()` sends `null` only from the card that sent (`linked`).

### The icons

- **Licence.** The Senja weather glyphs are licensed to the card's author through Envato Elements ("Gylph Senja - Weather" by usedesignspace, licence TA84S57JW9) for use in this card. They're not under the repository's MIT licence: don't take them into another project, and don't ship the pack's own files. The README carries no credit, by the owner's choice.
- **One set.** `fc-glyphs.ts` draws the row's, the strip's and the days' icons from the Senja weather glyphs: filled shapes on a 25-unit grid, where one shape passing in front of another has the gap cut into the shape behind, so no masks are needed. Each condition takes the pack's own drawing (Sun 1, Half Moon at 0.86 so it weighs what the sun does, Day Cloud, Night Cloud 2, Cloudy, Cloud Rain Fall, Heavy Rain, Cloud Thunderbolt, Snow Fall, Windy, Cloudy And Windy). The pack has no storm with rain, sleet, hail, fog or warning, so `DRAW` puts them together from its parts at its own positions and weights: the storm cloud and bolt with Day Rainy With Thunderbolt's dashes, the rain cloud with Snow Fall's dots and short dashes between them, three larger pellets, two bars as thick as its wind lines, and a rounded triangle with its mark cut out. Every part carries the role that sets its colour (`c`, `s`, `m`, `r`, `b`). The pack winds its shapes counter-clockwise and its holes clockwise; a hole added to one of its shapes has to go clockwise too, or nonzero fills it in.
- **Lit by their hour.** On the sky palettes, `litTints` colours each icon by the light of its own hour: day white, dawn rose, dusk peach, night slate, the sun gold, rain pale blue. Only the colour changes. Each colour's lightness is raised, hue kept, until it holds `GLYPH_CONTRAST` (3.2:1) against the brightest sky it can be seen over; `iconTints` samples its own hour's sky, the hours before it in view, and now's. On the theme palettes, one ink: `--state-icon-color`.
- **Quieter repeats.** An hour whose mark and light repeat the previous hour's is drawn at 0.6, so a settled day isn't six equal marks.
- **Range bars.** Each day: name, icon, low, bar, high, on one scale for the week. The name, icon, low and high keep their widths and the bar takes what's left (`minmax(0, 1fr)`), so the low sits by the icon at any width. The bar's colour is fixed in °C (°F converts): the sky's blue-white cold, the text's white in the middle, the sun's gold warm. Today's bar has a dot for now with a ring cut through. The bars arrive in one wipe across the scale. On the theme palettes, one solid colour.

### The forecast card

- **Element.** `AnimatedForecastCard` (`animated-forecast-card`) is the weather card with `surface = 'forecast'`: the same sky, weather and subscriptions. `attachForecastCard` (`fc-fcard.ts`) hides the card's own text (`data-fc-card`) and draws the lead (the turning line, 20 px), the row, the chips and the days. It has no sun, clouds or stars of its own, so a stack has one sun, and its own corner light (`FORECAST_GLOW`, which the contrast test samples). `setConfig` requires `entity`.
- **Layouts.** From 640 px, the hours on the left and the week on the right, in a 320 px column that keeps the bars short. The row's hours follow `hourCols`, as on the weather card. The strip (`compact`) has the labels, icons and the line, no words or chips, and its first and last labels sit on the compact weather card's text edges. An entity with no forecast says so (`no_forecast`).
- **Browsing.** Its row slides and stays like the weather card's, and the card's sky goes to the hour: leave it at 17:00 and the card's real rain falls behind the numbers. A Now control appears at the lead's end. Its days follow its own needle.
- **The days' metric.** The chips change what the days show too, on that card only (never sent to another card): `daily.setMetric` (`fc-row.ts`). Temp is the range; Feels like, each day's coolest to warmest feels-like from the hours in it, the day's own `apparent_temperature` and, today, now's reading (one figure is a single mark; none is "–"); the chance and the amount, bars from zero (`fc-wet`, the sky's cold light), the chance on a 0 to 100 scale, the amount to the week's wettest day (at least 5 mm or 0.2 in), a dry day its figure alone. The bars glide between metrics on `ROW_MOTION.rescale`; the dot for now is the temperature's only. The view does the same with its chips.
- **Rows.** 7; 5 with three days or fewer; without the hours, `max(3, ceil((58 + days × 32 + 20) / 64))`, so 5 for a week; the strip 2. In a shorter frame, the days give way from the end.
- **Tap.** It opens the view, as on the weather card.
- **Following.** While another card on its entity is dragged, its row, sky and days go to that hour, and dragging it takes that card along (see [One needle across the page](#one-needle-across-the-page)).

### The view that opens on tap

- **What grows.** `openView` (`fc-view.ts`) shows a second instance of the same card (`surface = 'view'`, same entity) in a modal `<dialog>`, revealed through a clip that starts on the card's rect: the sky grows into the screen (420 ms, 300 ms back; `VIEW`), the temperature, condition, line, row and chips travel at uniform scale, and the rest rises in. The sheet (`.fv-sheet`) covers the window and the grown card stands at the panel inside it, so the clip can start on a card that lies outside the panel (a big window), and outside the clip the sheet takes no clicks, so the scrim still closes; while it moves (`data-moving`) nothing inside clips but the sheet. On a phone the panel starts below the status bar (`safeTop`, from `env(safe-area-inset-top)`, which Home Assistant's `viewport-fit=cover` makes live), so its close button and grab handle can be reached. A closed dialog is hidden by CSS alone: nothing inline may outlive a close, or the next open is invisible and modal.
- **What it holds.** The clock and place, the temperature (112 px), the condition with high and low, the turning line, the row (it browses and stays), the chips, seven days (eight on a tablet), every reading the entity reports ("At 17:00" while browsing), and "History and settings", which calls `host.moreInfo()`. From 900 px, two columns and nothing scrolls.
- **A dialog.** `showModal()`: focus moves in, the page behind is inert, and focus returns to the card. It closes on ×, Escape, Back (`popstate`), a tap outside, or a swipe down that follows the finger (the last 80 ms of velocity, or a third of the height).
- **Built ahead.** `prepareView` builds it hidden, its weather paused, on the card's first press or when the card has been on screen a moment and the page is idle, so the first open moves on the next frame. `dropView` removes it with the card.

### The nightstand

- **Element.** `attachNightstand` (`fc-night.ts`), for `layout: nightstand`. The time is the hero ("3:12", no leading zero, one weight all day), drawn by the clock's `TimeText`. Six rows. Narrow frames (600 px or less) put the weather under the time.
- **By day.** The date, the temperature, the condition, the turning line, and today's range bar with its dot. From an hour before bed time to half an hour before waking, with an alarm, the alarm takes the date's place.
- **At night.** The card turns its real sky down under a veil, and the words keep two warm inks with no alpha (`EMBER`: the time `#8b6a4d`, the words `#a17e61`; `THEME_NIGHT` on the theme palette): the alarm ("Alarm 6:45") and one line, "19° Dry tonight" or what's wrong before you're up (`alertBefore`: severe weather, rain at 60%, gusts of 60 km/h or more, frost at the alarm, in the entity's own units), a step heavier and `role="status"`. Nothing changes under the veil but the minute. Night comes and goes over 8 s on the sky's curve (`LIGHT`). A contrast test holds the time to 3:1 and the words to 4.5:1 over the veiled sky in every condition and phase.
- **When it's night.** `night: auto`: `night_sensor` under 5 lx held for a minute is night, over 15 lx held for 10 s is day; without one, from `bed_time` to the alarm or `wake_time` (07:00). `bed_time` defaults to 8 h 30 min before the alarm or wake time. `night: on` and `off` fix it. `nextAlarm` reads a timestamp state, a `timestamp` attribute, or an input_datetime's hour and minute, and takes it within 18 hours.
- **Burn-in.** The words drift by whole pixels every 15 minutes.
- **Tap.** `actionsConfig` makes the default tap `none`, so a tap does nothing unless `tap_action` is set.

### The wall

- **When.** The weather card with `show_forecast` at 640 × 540 or larger (`isWall`: a wall tablet's two sections columns at ten rows) gets `attachWall` (`fc-wall.ts`), which replaces the card's text with its own composition (`data-fw`).
- **What.** The temperature at 192 px; the clock as a quiet 40 px line on the temperature's baseline, with the date; the condition with high, low and feels like; open sky; the turning line at 48 px; and under it two-hour columns with 40 px figures above one 4 px line that starts at a dot, beside five days of range bars. Six columns where they have room; on a narrower wall `wallCols` shows as many as the widest figure of the next twelve hours needs (`WALL_FIGURE`: 24 px a glyph, 18 px between figures), never fewer than three, so the figures keep their size and never touch. No chips. The row is the slide's ruler, and the card stays where it's left.

## The sun tracker

- **Element.** `sun-tracker-card.ts` holds the card, which renders in shadow DOM. Its editor, `sun-tracker-editor.ts`, ships in the editor bundle with the weather card's. A tap opens the sun entity's more-info unless its actions say otherwise.
- **Path geometry.** `pathElevation` draws one continuous wave that crosses the horizon at sunrise and sunset. The regular and compact layouts use their own path geometry.
- **Required entity.** `sun_entity` is required.
- **Shared sky.** `weather_entity` gives the tracker that entity's sky at the current phase, so a compact tracker under the weather card reads as one piece. `custom_colors` and theme skies don't apply to the tracker.
- **Following a needle.** A weather card or forecast card dragged through the hours on the same sun moves the tracker's sun with it (see [One needle across the page](#one-needle-across-the-page)).
- **Moon.** The phase comes from `moon_entity`, named by Home Assistant's translation. Its icon is one of eight drawn in `icons.ts` (`MOON_PHASE_ICONS`); any other state gets the plain moon.
- **Icons.** All of them inline from `icons.ts`, in the weather card's Senja set: sunrise and sunset, noon (Sun 1), daylight (an hourglass drawn in its manner), first light (Sunrise 1), last light (Half Moon) and the moon's phases (its outline with the lit part filled; full is its Full Moon). Sized by `--mdc-icon-size` in the tracker's own CSS, as it renders in shadow DOM.
- **Sections view.** `getGridOptions` gives 12 × 6, or 12 × 2 compact.

## The visual editor

- **Bundle.** `config-editor.ts` ships in the editor bundle. Its sections are Entities, Display, Forecast and clock, Interactions, Weather note, Day and night, Advanced, Weather engine and Colors. Every weather card option is in it. Forecast and clock dims `forecast_metric` while `show_forecast` is off and shows the nightstand's options only with `layout: nightstand`; its Interactions offer the `forecast` action.
- **The forecast card's editor.** `forecast-card-editor.ts` (`animated-forecast-card-editor`) ships in the same bundle: the weather and sun pickers, the metric, the days, the hours, the strip, the theme palette and the gestures, with a tap that opens the forecast by default.
- **Interactions.** Both editors get the gestures' controls from `mountActionsEditor` (`action-editor.ts`): Home Assistant's `ha-form` with a `ui_action` selector per gesture, as its own card editors have them (tap defaults to more-info, hold and double tap to none). `ha-form` is defined once one of Home Assistant's editors loads, so the helper loads the tile card's; until it's there, a select per gesture offers the plain actions and keeps one set in YAML. The tracker's editor redraws on `setConfig` only for a config it didn't just send, or the form would be rebuilt under the user's typing.
- **Entity pickers.** They need `ha-entity-picker`, which Home Assistant only defines once something has loaded it. `ensureEntityPickerLoaded` gets it through `loadCardHelpers()` and an entities card's `getConfigElement()`, and suppresses the harmless rejection that side effect produces.
- **Selects.** `ha-select` is filled through its `options` property and reports through the `selected` event. Stop its `closed` event from bubbling, or it closes Home Assistant's edit dialog.
- **Other controls.**
  - `ha-switch` for toggles
  - `textField` (`utils.ts`) for text, in both editors: `ha-input` on Home Assistant 2026.5 and later, which removed `ha-textfield`, and `ha-textfield` before that. An element Home Assistant doesn't define renders nothing, so check new HA elements still exist. Help text is `helper` on entity pickers, `hint` on `ha-input`.
  - native colour and range inputs for colours and engine sliders

  Changes go out as `config-changed`.

## The developer panel

- **Bundle.** `dev-panel.ts` ships in the developer panel bundle. It offers:
  - every condition
  - time-of-day overrides
  - presets and individual layers
  - pause
  - performance figures
  - a **Fly a plane** button
- **Logging.** `devLog(enabled, …)` logs only when `enabled` is the calling card's own dev mode (`this.config.devMode` in an animation, `config.dev_mode` elsewhere), so a dev-mode card never makes the other cards on a dashboard log. Normal cards write only the console banner, in the clear-day sky's and the sun's colours.
- **Host interface.** The panel reaches the card only through `DevPanelHost`, and every name on it is plain. The same goes for anything another bundle shares with the card. The build doesn't rename properties (`mangleProps` is off: the bundled GSAP reaches its `_` internals by name, and renaming them breaks it; a test keeps it off), but plain names keep the interfaces readable and safe if that ever changes.

## Languages

- **From Home Assistant:** the condition names, the metric labels and the moon phase, via `formatEntityState` and `localize`.
- **The cards' own words:** "Feels like", "Indoors", sunrise and sunset, and the tracker's labels live in `localize.ts`, in English, German, Spanish, French, Italian, Dutch, Polish, Portuguese and Romanian. A test checks that every string exists in every language.
- **The forecast's words:** in the same nine languages, in `fc-words.ts` (English and German) and `fc-words-more.ts` (the other seven), in the forecast bundle. A test checks every language fills the same blanks as English.
- **Times:** they follow the profile's 12- or 24-hour setting the way Home Assistant does (`useAmPm`), and its time zone (`cardTimeZone`): Home Assistant's own when the profile says server, else the device's. That covers the weather card's sunset, the clock, the forecast and the tracker, whose sun sits on its path by the same zone (`hourOfDay`).

## Testing

- **Setup.** Tests use Vitest with jsdom, under `test/`, grouped into `animations`, `cards`, `data`, `demo`, `styles` and `utils`.
- **GSAP stub.** `test/setup.ts` installs a deterministic GSAP stub as `window.AnimatedWeatherCardGsap`, after the card has set the real one. Timelines are `FakeTimeline` objects that keep their `vars` so tests can fire `onComplete`. The stub is the GSAP surface the code may use. If code needs more, add it to the stub deliberately.
- **The forecast's tests.** `test/cards/forecast.test.ts` covers the card's forecast, its rows and its tap, the forecast card, the slide (lifts, flicks, the returns, the keys, a vertical drag), the chips, the icons and the clock; `test/data/fc-data.test.ts` the turning line, times in 12 and 24 hours and the server's zone, the hours, the days, the alarm and the words; `test/data/forecast-data.test.ts` and `forecast-model.test.ts` the shared subscriptions and the days. `test/styles/forecast-contrast.test.ts` is the light law for every text the forecast and the clock add, in all 60 skies, with the icons' 3.2:1, the nightstand's night and the cloud floor. A new text needs its zone there.
- **In the browser.** Load the bundle in Home Assistant with `dev_mode: true`, or run `npm run demo` and serve `_site/`, which has faithful stand-ins for `ha-card` and `ha-icon` (`demo/ha-elements.js`). Make the `ha-icon` stand-in faithful: Home Assistant's `ha-icon` is an unsized inline wrapper around a sized `ha-svg-icon`, and `iconBoxCss` sizes the wrapper to the glyph. A stand-in that sizes the host itself hides alignment bugs.

## Conventions

- **Design.** Follow PRODUCT.md:
  - The sky is the card.
  - There's one hero and a quiet tier.
  - Legibility beats spectacle.
  - The card fits any frame.
  - Motion is weather, not UI.
  - Everything that moves is real.
- **Accessibility.** Keep the contrast tests passing, keep reduced motion still, and never convey information by colour alone.
- **Each change.** Rebuild and commit the bundles, add a CHANGELOG line, and update the README when an option, default, range or behaviour changes.
- **Writing.** In code comments, the CHANGELOG and the docs, say what the code does and why, plainly.
- **Branches.** Work on a branch from `main` and open pull requests against `main`.
- **Attribution.** The README says once that AI helped build the card. Don't add AI attribution anywhere else: no `Co-Authored-By` or "Generated with" lines in commits, pull requests, issues or code comments.

## Releasing

1. Set the new version in `package.json` and in `CARD_VERSION` (`src/constants.ts`).
2. Move the CHANGELOG's Unreleased entries under the new version.
3. Rebuild, commit, then tag and push: `git tag vX.Y.Z && git push origin vX.Y.Z`.

The release workflow checks that the tag, `package.json` and `CARD_VERSION` agree. It then builds the bundles and publishes the GitHub release with the six files attached, which HACS installs.
