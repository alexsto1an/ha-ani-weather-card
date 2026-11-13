# Contributing to Animated Weather Card

Thanks for helping. Bug reports, ideas, translations and pull requests are all welcome, and none of them have to be big.

## Ways to help

**Report a bug.** Open an issue with:

- your Home Assistant version
- the card's configuration (YAML)
- the browser and device, including whether it's the Companion app
- what you expected, and what happened instead
- a screenshot or screen recording, and any errors in the browser console

The README's [troubleshooting](README.md#troubleshooting) section covers the common problems.

**Suggest an idea.** Open an issue that describes what you'd like the card to do and why. [PRODUCT.md](PRODUCT.md) explains what the card is aiming for, so it's worth a read first.

**Translate.** Home Assistant already translates the condition names, the metric labels and the moon phase. The cards' own few words, such as "Feels like", "Indoors" and the sun tracker's labels, live in [`src/localize.ts`](src/localize.ts), and the forecast's, such as "Rain from 17:00 to 19:00" and the chips, in [`src/fc-words.ts`](src/fc-words.ts) and [`src/fc-words-more.ts`](src/fc-words-more.ts). To add a language, add a block with every key to each. Tests check that no key is missing and that every language fills the same blanks.

**Fix or build something.** Read on.

## Set up

```bash
git clone https://github.com/alexsto1an/ha-ani-weather-card.git
cd ha-ani-weather-card
npm install
```

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the six bundles into the repository root |
| `npm run dev` | Rebuilds on every change |
| `npm run demo` | Builds the card and assembles the live demo in `_site/` |
| `npm run type-check` | Runs strict TypeScript checks |
| `npm test` | Runs the Vitest suite once |
| `npm run test:watch` | Runs the tests on every change |
| `npm run test:coverage` | Runs the tests once with a coverage report |

## Try a change in the demo

For a quick look without Home Assistant, run `npm run demo` and serve the `_site/` folder with any static server, for example `python3 -m http.server -d _site`. It's the same page as the [live demo](https://alexsto1an.github.io/ha-ani-weather-card/): the real card on sample data, with controls for the weather, the time of day, the layout and your own sensors.

## Try a change in Home Assistant

1. **Copy the bundles.** Copy the six `animated-weather-card*.js` files to your `config/www/` folder. They must sit together: the card loads the other five from its own folder.
2. **Add the resource.** Add `/local/animated-weather-card.js?v=1` as a JavaScript module resource. Raise the `?v=` after each copy so the browser fetches the new build.
3. **Turn on developer mode.** Add `dev_mode: true` to a card. You get sample data, so no real weather entity is needed, and a developer panel with:
   - every condition
   - every time of day
   - presets and individual layers
   - pause
   - performance figures
   - a **Fly a plane** button

If you also have the card installed from the Marketplace (or HACS), remove one of the two resources. Two copies can't register at once.

## How the code is organised

The card ships as six bundles:

| Bundle | When it loads |
| --- | --- |
| `animated-weather-card.js` | Always. It holds the three cards, their skies and weather, and the page's forecast subscriptions |
| `animated-weather-card-editor.js` | The first time someone opens a card's settings |
| `animated-weather-card-forecast.js` | Only for cards with `show_forecast`, `show_clock` or `layout: nightstand`, and for the forecast card. It draws the forecast, the clock, the slide, the forecast card, the view that opens on tap, the nightstand and the wall |
| `animated-weather-card-note.js` | Only for cards that write their own note (`show_note`) |
| `animated-weather-card-planes.js` | Only for cards with a flights sensor (`flights_entity`), or `dev_mode` |
| `animated-weather-card-dev.js` | Only for cards with `dev_mode: true` |

The forecast bundle reaches the card only through `ForecastHost` and gives back `ForecastExtras`, both in `src/forecast-host.ts`, with plain names on both sides. The page keeps one forecast subscription per weather entity and kind, hourly, daily or twice daily (`src/forecast-data.ts`), which the weather card, the forecast card, the view and the note writer share.

**The fit ladder.** In a frame shorter than the card wants, the forecast gives way before the temperature ever shrinks: first the chips, then the icons, then the row (it folds back to the line on what turns and a rail on the divider), then that line. Until the last level, the card's own ladder goes no further than `compact`, which leaves the temperature alone; only then do `short`, `tight` and `minimal` shrink it, and with a note, the note shortens to its one line first. A level is kept only while the row's first line sits at 0.43 of a narrow card's height or lower, where its text stays readable over the sun's glow. The levels live in `src/fc-weather.ts`; the card asks them in `applySizeState`.

**The slide.** Dragging the card sideways moves the row under a fixed needle, and the card's sky, weather and readings go to the hour under it. Letting go leaves it there: a slow lift settles on the nearest hour, a flick carries on like a list. It comes home on the Now control, Home or Escape, half a minute without a touch, the card going out of sight, or a new forecast, on one spring of 0.38 s. While it's away, the card's own live updates wait, and the card reads the entity again when it's home. It lives in `src/fc-slide.ts`, and `test/cards/forecast.test.ts` holds its gestures and returns.

```
src/
├── animated-weather-card.ts        # The weather card and the forecast card
├── sun-tracker-card.ts             # The sun tracker card
├── config-editor.ts                # Visual editor for the weather card
├── forecast-card-editor.ts         # Visual editor for the forecast card
├── sun-tracker-editor.ts           # Visual editor for the sun tracker
├── forecast-host.ts                # What the main bundle and the forecast bundle hand each other
├── forecast-data.ts                # The page's forecast subscriptions
├── fc-*.ts                         # The forecast, the slide, the clock, the icons, the forecast card,
│                                   # the view on tap, the nightstand and the wall
├── dev-panel.ts                    # Developer panel (dev_mode)
├── note-generator.ts               # Writes the note with Home Assistant's AI Task
├── planes-animation.ts, aircraft.ts # Plane fly-overs, each flight drawn as its aircraft
├── animation-controller.ts         # Starts and stops animations per condition
├── *-animation.ts                  # One class per kind of weather, on base-animation.ts
├── particle-pool.ts                # Recycled particles for rain, snow and sleet
├── sky.ts                          # Sky palettes (OKLCH), phases and contrast checks
├── weather-data.ts                 # Reads the weather entity and sensors
├── localize.ts                     # The cards' own strings, times and durations
├── …
└── styles/                         # CSS for the card, editor and developer panel
```

[CLAUDE.md](CLAUDE.md) has the full map:

- how the bundles load each other
- how the sky follows the sun
- how the card fits its frame
- how the forecast bundle draws on the card, and the slide
- the editor's quirks
- why the developer panel's interface avoids `_` names

## Make a change

1. Branch from `main`.
2. Make your change in `src/`.
3. Add or update tests under `test/`. They run in jsdom with a GSAP stub from `test/setup.ts`. If your code needs a GSAP method the stub doesn't have, add it to the stub.
4. Run `npm run type-check` and `npm test`.
5. Run `npm run build` and commit the rebuilt bundles with your change. Anyone who installs `main` gets the committed files directly, so CI rejects a pull request whose bundles don't match a fresh build.
6. Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md) for anything a user would notice.
7. If you change an option, a default, a range or a behaviour, update the README's options tables and examples to match.
   - **Screenshots:** put them in `docs/images` as WebP.
   - **Image links:** use relative Markdown image syntax (`![…](docs/images/…)`), which the Marketplace and HACS can rewrite. HACS can't rewrite HTML `<img>` tags.

## Open a pull request

- **Target:** open it against `main`.
- **Description:** say what changed and why.
- **Visual changes:** add a before-and-after screenshot and the card configuration you used.
- **CI:** it runs the type-check, the build and the tests, and checks that the committed bundles are fresh. A second workflow, **Validate**, runs HACS's own validation of the repository; it has to keep passing for the card to stay in the catalog the Marketplace and HACS share.

## Guidelines

- **Design.** Follow [PRODUCT.md](PRODUCT.md):
  - The sky is the card.
  - There's one hero and a quiet tier.
  - Legibility beats spectacle.
  - The card fits any frame.
  - Motion is weather, not UI.
  - Everything that moves is real.
- **Readability.** Text must stay readable on every sky. `test/styles/sky.test.ts` checks WCAG AA contrast for every condition at every time of day, and `test/styles/forecast-contrast.test.ts` does the same for everything the forecast and the clock add, where it sits. Both have to keep passing.
- **Motion and accessibility.** Respect reduced motion: no moving weather when it's on. Keep decorative layers hidden from screen readers.
- **Dependencies.** Add no new runtime dependencies. GSAP, bundled into the main file, is the only one.
- **Bundle size.** Keep the main bundle lean. Code that only the editor, the forecast, the note writer, the planes or the developer panel needs belongs in its own bundle. Keep names the bundles share plain, without a leading `_`. The build doesn't rename properties, because the bundled GSAP relies on its own names.
- **Safety.** Escape text that comes from entities, and validate colours before they reach CSS.
- **Writing.** In comments, the CHANGELOG and the docs, say plainly what the code does and why.

## Releasing

This section is for maintainers. A release starts from a pushed `vX.Y.Z` tag, and `.github/workflows/release.yml` does the rest.

1. Set the new version in two places:
   - `package.json`
   - `CARD_VERSION` in `src/constants.ts`
2. Move the CHANGELOG's **Unreleased** entries under the new version.
3. Run `npm run build`, then commit the rebuilt bundles together with the version changes.
4. Tag that commit and push the tag:

   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

The workflow then:

1. Checks that the tag, `package.json` and `CARD_VERSION` agree.
2. Builds the six bundles.
3. Publishes a GitHub release with the six `.js` files attached.

The Marketplace (Home Assistant 2026.11 and later) and HACS (before it) read `hacs.json` at the tag and show the tag as the version. They find `animated-weather-card.js` (the `filename`) among the release's files, register it as the dashboard resource, and download every attached file into `<config>/www/community/ha-ani-weather-card/`. So a release carries the six bundles and nothing else. Don't set `zip_release`: HACS would then download the file `filename` names and try to unzip it.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
