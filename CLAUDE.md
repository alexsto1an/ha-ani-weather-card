# CLAUDE.md

This file gives Claude Code (claude.ai/code), and anyone else working in this repository, a map of the code: how it's built, how the pieces fit, and the conventions that keep it working.

## The project

Animated Weather Card turns a Home Assistant weather entity into a living sky. The condition and the time of day set the light. Rain, snow, fog, wind, lightning and clouds move behind the numbers, and the temperature is always the first thing you read. The same bundle registers a second card, the Animated Sun Tracker.

These files hold the rest of the story:

- **[README.md](README.md):** the user-facing documentation. Its options tables and conditions table describe the code exactly, so keep them in step with it.
- **[PRODUCT.md](PRODUCT.md):** the design brief: who it's for, the voice, and the principles.
- **[CHANGELOG.md](CHANGELOG.md):** the history. Add a line under Unreleased for every user-visible change.

## Commands

```bash
npm install
npm run build          # the five bundles, written to the repository root
npm run dev            # rebuild on change
npm run demo           # build, then assemble the live demo in _site/
npm run type-check     # tsc --noEmit, strict
npm test               # Vitest, once
npm run test:watch
npm run test:coverage
```

## How it ships

- **Five bundles.** esbuild builds five minified IIFE files, configured in `esbuild.config.js`:
  - `animated-weather-card.js`: both cards. It's the only dashboard resource.
  - `animated-weather-card-editor.js`: the visual editor, loaded the first time someone opens the card's settings.
  - `animated-weather-card-dev.js`: the developer panel, loaded only by cards with `dev_mode: true`.
  - `animated-weather-card-note.js`: the note writer, loaded only by cards with `show_note: true` and no `note_entity`.
  - `animated-weather-card-planes.js`: the plane fly-overs and the aircraft they draw, loaded only by cards with a `flights_entity` (or `dev_mode`). The main bundle keeps `FlightTracker`, which diffs the flights on every update.
- **Loading the others.** The card fetches them with `loadSiblingBundle`, from the folder the main bundle was loaded from. It keeps the main bundle's `?v=` or `hacstag` cache buster, loads each file once, and allows a retry after a failed load.
- **Committed bundles.** The bundles are committed, because HACS users on `main` get them straight from the branch. CI fails a pull request whose bundles don't match a fresh build, so commit the rebuilt files with every source change.
- **GSAP at runtime.** GSAP 3.12 loads from cdnjs (`GSAP_CDN_URL` in `src/constants.ts`). If it can't load, the card logs a warning and shows a still sky with every value.
- **Size.** The main bundle is about 180 KB, or 48 KB gzipped. Keep anything only the editor, the note writer or the developer panel needs out of it.
- **HACS.** `hacs.json` sets `render_readme: true` and `zip_release: true`, and the release zip holds the five bundles. HACS shows the release tag as the version. Keep `hacs.json` to the keys HACS accepts (name, content_in_root, country, filename, hacs, hide_default_branch, homeassistant, persistent_directory, render_readme, zip_release): its validation rejects any other key, and `country` takes real country codes only.
- **Live demo.** `demo/` holds a page that runs the real card on sample data, published to GitHub Pages (https://alexsto1an.github.io/ha-ani-weather-card/) by `.github/workflows/pages.yml` on every push to `main`. `npm run demo` builds the card and assembles the site in `_site/` (ignored): the page, the main bundle, the note writer's and the planes', and only the icons the cards name, taken from `@mdi/js`. A misspelled icon fails the build. The page loads GSAP before swapping in its settable clock (`demo/clock.js`), because GSAP stalls after the clock jumps back. The cards sit at their real size, never scaled: the fit measures real widths, so the page makes a card larger by making it wider. The light around each card, and the tint of the whole page, come from the card's live `--awc-sky-mid` and its `.lightning` layer; a setup change waits for the new card to lose its `loading` class before it dissolves in; the sensors section hands its reading over to the card's `.temperature-value` as the card fades it through; and the tracker section lays its time scrubber over the tracker's `.st-chart`, where the card draws the sun at `hour / 24` of its width (over the whole `.st-card` in the compact strip, whose chart sits beside the headline), and measures it again whenever the card replaces the children of its `.st-card`. Renaming any of those, or changing that mapping, breaks the page, not the card. The hero and the dashboard's full-size card write their note (`show_note`) through a stand-in for Home Assistant in `buildHass` (`standInAi`): an AI Task that answers with `NOTES`, hand-written samples per condition, by day and by night, with no numbers or times so they also suit the visitor's own weather; a twelve-hour forecast; and one user-data store for the whole page. Only cards that share the page's weather may write notes, or two would keep rewriting the one note they share. The note lab (`#note`) is the exception that proves it: its card reads its own entity (`ENTITIES.noteWeather`), so its notes are stored apart. Its card keeps one setup, so a new voice never restarts its weather: the stand-in answers in the voice picked when it answers (`tone` can be a function; `VOICE_NOTES` holds calm, friendly and dry, `NOTES` is snarky), picking a voice forgets that entity's notes (`forgetNotes`) so the card writes a new one behind its status, and `noteDelays` hold back the forecast and the AI so each status can be read. The dashboard gives that card the five rows a note asks for (`CARD_ROWS`). The dashboard section is a stand-in for Home Assistant's sections view, built on the numbers in `HA` (`demo/scene.mjs`): a section grid's row height and gaps, the column widths, the view's padding, the narrow breakpoint and the sidebar's width. If Home Assistant changes them, change them there. The page's only calls out, besides GSAP, are for the visitor's own weather, which the page asks for as it opens (the first weather key): their location goes to Open-Meteo for the forecast and to BigDataCloud for the place's name. `wmoCondition`, `liveReading` and `placeName` in `scene.mjs` turn the answers into the sample world's terms, `solarElevation`, `solarAt` and `solarTimes` put the real sun where the visitor is (NOAA's algorithm), the cards are set up afresh when their weather arrives or leaves so no reading carries over, and the card's location line follows the name on a live update.
- **Setup guide.** `demo/setup/` is a second page on the same site, at `/setup/`: a quick start and the whole setup in detail (install, the first card, the weather note, the extras, troubleshooting). It shares the demo's tokens and type (`demo.css`) and its code blocks (`code.mjs`), and its one card writes its note through the same stand-in AI on the sample's partly cloudy sky, setting the page's `--page-sky` from its `--awc-sky-mid`. The home page links to it from its nav, its Install button and What you need. A test holds the guide to the code: every option in its YAML exists, every in-page link has a target, and its file table lists the bundles the build makes. Keep it in step with the README when setup changes.
- **The mark.** Weather behind the glass: the sky, the sun and the rain behind one pane of glass with the card's hairline etched across it, the sun crossing its corner. `docs/brand/` holds the full icon's source (serve it and open `icon.html`); the README's `docs/images/icon.webp` is a 192 px render of its day sky. The demo's top bar wears a simpler version, `demo/logo.mjs`, without the rain, which is noise at 26 px. The build draws it into both pages in place of `%LOGO%` and writes `favicon.svg` from it. It holds every sky, and CSS shows the one `<html data-logo>` names: each page's head script sets that from the clock before the first paint (the hours of `phaseForHour`), and the demo sets it from the visitor's real sun when their weather arrives, then keeps it. The sun's rise into the pane's corner is a CSS animation, and reduced motion shows the mark still.
- **README images.** They live in `docs/images` as WebP and use relative Markdown image syntax, which HACS rewrites to the release tag. HACS doesn't rewrite HTML `<img>` tags, so don't use them.

## Source map

```
src/
├── animated-weather-card.ts        # The weather card: render, live updates, fit, pausing, card registration
├── sun-tracker-card.ts             # The sun tracker card and its editor
├── animated-weather-card-editor.ts # Entry point of the editor bundle
├── config-editor.ts                # Visual editor for the weather card
├── animated-weather-card-dev.ts    # Entry point of the developer panel bundle
├── dev-panel.ts                    # Developer panel (dev_mode)
├── weather-data.ts                 # Reads the weather entity and the optional sensors
├── utils.ts                        # Condition mapping, engine settings, GSAP loading, helpers
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
├── flight-tracker.ts               # Flightradar24 arrivals for plane fly-overs
├── localize.ts                     # The cards' own strings, times and durations
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
- **Live updates.** The card renders once, then updates in place: `_updateDataInPlace` swaps text, the hero text fades through, and `syncValueIcon` keeps the wind and pressure arrows current. A data update never restarts the weather: an animation that restarts redraws itself at random, which reads as a snap.
- **Condition changes.** When the condition changes, the old weather fades out, the new weather fades in and the sky cross-fades. Nothing is rebuilt.
- **Data.** `processWeatherData` (`weather-data.ts`) combines the weather entity with any configured sensors:
  - outdoor temperature, feels like, humidity, wind speed and direction, pressure and indoor readings (a wind speed sensor also sets how fast the weather moves; a direction sensor can report degrees or a compass point)
  - the sun entity, for the sunset or sunrise metric
  - the condition's display name, which comes from Home Assistant's `formatEntityState` so it's translated
- **Condition mapping.** `getWeatherClass` (`utils.ts`) maps any condition string to one of fifteen classes (`SKY_CONDITIONS`):
  - It matches substrings in priority order, so free text from other integrations works too.
  - Storm beats fog, fog beats heavy rain, and so on.
  - `hail` becomes `sleety`.
  - Anything unknown becomes `sunny`.
- **Escaping.** Entity text goes through `escapeHtml`. Colours are validated before they reach CSS.

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
- **Writing it.** `NoteWriter` (`note-generator.ts`, the note bundle) reaches the card only through `NoteHost` (`hass`, `config`, `noteVisible`, `showNote`, `noteWriting`), plain names for the same reason as the dev panel's. It subscribes to the forecast (`weather/subscribe_forecast`: hourly, else twice daily, else daily, by `supported_features`) and to the user's frontend storage, works out the facts (`computeFacts`: first wet and dry hours, high and low, gusts, UV, the hours out, a severe flag, what's missing), and asks `ai_task.generate_data` for `line` and `note` (`NOTE_STRUCTURE`), without an `entity_id` when it uses the default AI Task, with a 30 s timeout. Severe weather overrides the tone.
- **Hours out.** With `note_calendar` (one calendar or a list), the writer reads `calendar.get_events` for the next 12 hours: on start (the first note waits up to 10 s for it, as for the forecast), every 15 minutes while the card is on screen, and when a calendar's state changes. `calendarWindows` keeps timed events that aren't cancelled or online (a location that's a link), runs together those under 30 minutes apart, keeps each one's real start and end so an event under way doesn't change from one look to the next, and takes the earliest three. Only the times reach the AI, never a name, place or description. A calendar that can't be read leaves the hours out of the note, never the note itself.
- **Sharing it.** A note is stored in the user's frontend storage under `animated_weather_card_note:<weather entity>:<tone>:<AI Task or default>:<calendars>:<language>:<time zone>`: everything two cards or two screens can differ in, or they'd each rewrite the other's note, round after round. The hours out change through the day, so they're in the `factsKey`, not the key. With it go the server's unit system and its `factsKey`. A note under 15 minutes old stands even when a screen reads the facts a little differently; only a new condition replaces it sooner. Every screen of that user shows it. It's rewritten after `NOTE_REFRESH_MINUTES` (60), or when the facts change, by one screen that's showing the card: a claim stops the others for 45 s, and a failure waits 10 minutes. Nothing shows when something goes wrong.
- **While it's written.** `noteWriting(stage)` puts a status in the note's place (`data-writing`, the size of the note's length) when a new note is on its way and the card has just come into view or holds nothing true about this weather, so an old note never shows only to be replaced. The status says what's really happening, from the writer: `forecast` while it waits for the forecast's first answer ("Reading the forecast"), `writing` once the call is out ("Writing the note"), both in `localize.ts`. The note then types itself in (`typeIn`): the whole text is laid out from the first frame with the rest transparent (`.note-untyped`), so the lines and the fit never move; with reduced motion or `animate: false` it's simply there. While the card stays in view, the next note fades through instead. There's no status while the AI Task isn't set up.

### Animations

- **Classes.** `WeatherAnimationController` decides which animations a condition runs and owns their state. `ModularIntegrationBridge` builds them. Each kind of weather is a class on `BaseAnimation`.
- **Particles.** Rain, snow and sleet draw from a `ParticlePool`: a fixed pool, recycled and pre-warmed, so the weather is already falling when it fades in.
- **Shared effects.** Clouds, leaves, swooshes and fog live in `gsap-effects.ts`. Each cloud rides a full-width `.cloud-track` whose `xPercent` carries it across the card's current width, so a resize can't strand a cloud mid-sky. Remove clouds with `removeClouds`, which takes their tracks too.
- **Wind.** Motion speed is the live wind speed scaled by `engine_settings.windSpeed`. A new reading reaches running animations through `BaseAnimation.setWindSpeed`, which never restarts them: clouds ease to the new speed, leaves read it as they spawn, and snow, sleet and fog take it at their next start. The bridge ignores an unchanged value.
- **Engine settings.** `getWeatherSettings` clamps the engine settings. YAML accepts a wider range than the editor's sliders, and out-of-range values fall back to the default.
- **Spill.** Rain, snow, sleet and leaves fall out of the card, and clouds rise up to `CLOUD_OVERHANG_PX` above it. Setting `spill_particles: false` keeps everything inside.
- **Planes.** `FlightTracker` seeds itself on the first update, then reports only new airborne arrivals. `planes-animation.ts` turns each flight's heading, altitude, ground speed and vertical speed into a pass. At most three planes fly at once.
- **Aircraft.** `aircraft.ts` picks a family from the flight's ICAO type code (`aircraftFamily`: narrow-body, wide-body, four-engine, rear-engine, turboprop, light, helicopter; unknown codes fly as a narrow-body) and draws it from a small 3D model in metres after one real aircraft (A320neo, 787, 747-8, CRJ900, ATR 72, Cessna 172, H135), projected from the side as seen from `VIEW_ELEVATION_DEG` below. Each family is drawn once and cached. A drawing reports its aspect, how much of it is the aircraft (a rotor or propeller reaches past), the fuselage's height for the label, and its near side's lights. Size follows length (`planeLengthPx`: business jets have their own in `BIZJET_LENGTHS`), softened by an exponent and capped so a low 747 never covers the temperature. A helicopter flies nose down (`FORWARD_PITCH_DEG`).
- **Lights.** At night, with the sky palette, a plane is its lights (the `night` fly-over option): the outline at 22% once the sky is night (at dusk and dawn a plane up high is still sunlit, so it keeps its outline), steady green at the near wingtip flying right and red flying left (CSS on `eastbound`/`westbound`, since the drawing is mirrored), double-flash white strobes, the red belly beacon and the white tail light. On the theme palette there's no night sky, so planes stay silhouettes.

### Fitting the frame

- **Metrics.** `applySizeState` measures whether the metrics fit in one row against the real, translated labels. It falls back to a 2×2 grid, with 24 px of hysteresis.
- **Short frames.** In a fixed frame it steps `data-height` down through `compact`, `short`, `tight` and `minimal` (`HEIGHT_STEPS`) until nothing overflows. With a note, the note gives way first (`NOTE_FIT_STEPS`, which also sets `data-note`): `close` (regular's sizes with short's gaps, to keep the longer note whole), then its one line, then `snug` (short's sizes, keeping the location and the line under the condition), then none, then the steps above. Each step keeps the one before it and gives up a little more, so the card lands on the roomiest layout that fits: a phone's sections row (353 × 248) is `tight`, which keeps the metric labels.
- **Wide cards.** At 640 px and wider (a container query), the metrics move beside a larger temperature.
- **Compact variant.** `compact: true` sets `data-variant="compact"`.
- **Sections view.** `getGridOptions` sizes the card at 12 × 4, 12 × 5 with a note, or 12 × 2 compact.
- **Measuring.** The fit compares `getBoundingClientRect` widths with `clientWidth`. CSS `zoom` on an ancestor skews that, so a zoomed screenshot page always shows the grid. Browser zoom and device pixel ratio don't affect it.

### Pausing and motion

- **When it pauses.** Animations pause while the tab is hidden or the card is off-screen (IntersectionObserver). With `auto_pause`, they also pause while the window is in the background. A manual pause from the developer panel wins.
- **Still sky.** `prefers-reduced-motion` and `animate: false` both give a still sky: the condition's colour and light, no weather motion.
- **Screen readers.** Decorative layers are `aria-hidden`. The temperature and condition are `aria-live="polite"`.

## The sun tracker

- **Element.** `sun-tracker-card.ts` holds the card and its editor. The card renders in shadow DOM.
- **Path geometry.** `pathElevation` draws one continuous wave that crosses the horizon at sunrise and sunset. The regular and compact layouts use their own path geometry.
- **Required entity.** `sun_entity` is required.
- **Shared sky.** `weather_entity` gives the tracker that entity's sky at the current phase, so a compact tracker under the weather card reads as one piece. `custom_colors` and theme skies don't apply to the tracker.
- **Moon.** The phase comes from `moon_entity`, named by Home Assistant's translation. MDI icon names drop the `_moon` of `new_moon` and `full_moon`.
- **Sections view.** `getGridOptions` gives 12 × 6, or 12 × 2 compact.

## The visual editor

- **Bundle.** `config-editor.ts` ships in the editor bundle. Its sections are Entities, Display, Weather note, Day and night, Advanced, Weather engine and Colors. Every weather card option is in it.
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
- **Host interface.** The panel reaches the card only through `DevPanelHost`, and every name on it is plain. esbuild's `mangleProps: /^_/` mangles `_`-prefixed names differently in each bundle, so a `_` name shared across bundles silently breaks. The same rule applies to anything the editor bundle shares with the card.

## Languages

- **From Home Assistant:** the condition names, the metric labels and the moon phase, via `formatEntityState` and `localize`.
- **The cards' own words:** "Feels like", "Indoors", sunrise and sunset, and the tracker's labels live in `localize.ts`, in English, German, Spanish, French, Italian, Dutch, Polish, Portuguese and Romanian. A test checks that every string exists in every language.
- **Times:** they follow the profile's 12- or 24-hour setting the way Home Assistant does (`useAmPm`).

## Testing

- **Setup.** Tests use Vitest with jsdom, under `test/`, grouped into `animations`, `cards`, `data`, `styles` and `utils`.
- **GSAP stub.** `test/setup.ts` installs a deterministic GSAP stub. Timelines are `FakeTimeline` objects that keep their `vars` so tests can fire `onComplete`. The stub is the GSAP surface the code may use. If code needs more, add it to the stub deliberately.
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

The release workflow checks that the tag, `package.json` and `CARD_VERSION` agree. It then builds the bundles, zips them, and publishes the GitHub release with that zip, which HACS installs.
