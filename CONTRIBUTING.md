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

**Translate.** Home Assistant already translates the condition names, the metric labels and the moon phase. The cards' own few words, such as "Feels like", "Indoors" and the sun tracker's labels, live in [`src/localize.ts`](src/localize.ts). To add a language, add a block with every key. A test checks that no key is missing.

**Fix or build something.** Read on.

## Set up

```bash
git clone https://github.com/alexsto1an/ha-ani-weather-card.git
cd ha-ani-weather-card
npm install
```

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the five bundles into the repository root |
| `npm run dev` | Rebuilds on every change |
| `npm run demo` | Builds the card and assembles the live demo in `_site/` |
| `npm run type-check` | Runs strict TypeScript checks |
| `npm test` | Runs the Vitest suite once |
| `npm run test:watch` | Runs the tests on every change |

## Try a change in the demo

For a quick look without Home Assistant, run `npm run demo` and serve the `_site/` folder with any static server, for example `python3 -m http.server -d _site`. It's the same page as the [live demo](https://alexsto1an.github.io/ha-ani-weather-card/): the real card on sample data, with controls for the weather, the time of day, the layout and your own sensors.

## Try a change in Home Assistant

1. **Copy the bundles.** Copy the five `animated-weather-card*.js` files to your `config/www/` folder. They must sit together: the card loads the other four from its own folder.
2. **Add the resource.** Add `/local/animated-weather-card.js?v=1` as a JavaScript module resource. Raise the `?v=` after each copy so the browser fetches the new build.
3. **Turn on developer mode.** Add `dev_mode: true` to a card. You get sample data, so no real weather entity is needed, and a developer panel with:
   - every condition
   - every time of day
   - presets and individual layers
   - pause
   - performance figures
   - a **Fly a plane** button

If you also have the card installed through HACS, remove one of the two resources. Two copies can't register at once.

## How the code is organised

The card ships as five bundles:

| Bundle | When it loads |
| --- | --- |
| `animated-weather-card.js` | Always. It holds both cards |
| `animated-weather-card-editor.js` | The first time someone opens the card's settings |
| `animated-weather-card-note.js` | Only for cards that write their own note (`show_note`) |
| `animated-weather-card-planes.js` | Only for cards with a flights sensor (`flights_entity`), or `dev_mode` |
| `animated-weather-card-dev.js` | Only for cards with `dev_mode: true` |

```
src/
├── animated-weather-card.ts        # The weather card
├── sun-tracker-card.ts             # The sun tracker card and its editor
├── config-editor.ts                # Visual editor for the weather card
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
- the editor's quirks
- why the developer panel's interface avoids `_` names

## Make a change

1. Branch from `main`.
2. Make your change in `src/`.
3. Add or update tests under `test/`. They run in jsdom with a GSAP stub from `test/setup.ts`. If your code needs a GSAP method the stub doesn't have, add it to the stub.
4. Run `npm run type-check` and `npm test`.
5. Run `npm run build` and commit the rebuilt bundles with your change. HACS users on `main` get the committed files directly, so CI rejects a pull request whose bundles don't match a fresh build.
6. Add a line under **Unreleased** in [CHANGELOG.md](CHANGELOG.md) for anything a user would notice.
7. If you change an option, a default, a range or a behaviour, update the README's options tables and examples to match.
   - **Screenshots:** put them in `docs/images` as WebP.
   - **Image links:** use relative Markdown image syntax (`![…](docs/images/…)`), which HACS can rewrite. It can't rewrite HTML `<img>` tags.

## Open a pull request

- **Target:** open it against `main`.
- **Description:** say what changed and why.
- **Visual changes:** add a before-and-after screenshot and the card configuration you used.
- **CI:** it runs the type-check, the build and the tests, and checks that the committed bundles are fresh.

## Guidelines

- **Design.** Follow [PRODUCT.md](PRODUCT.md):
  - The sky is the card.
  - There's one hero and a quiet tier.
  - Legibility beats spectacle.
  - The card fits any frame.
  - Motion is weather, not UI.
  - Everything that moves is real.
- **Readability.** Text must stay readable on every sky. `test/styles/sky.test.ts` checks WCAG AA contrast for every condition at every time of day, and has to keep passing.
- **Motion and accessibility.** Respect reduced motion: no moving weather when it's on. Keep decorative layers hidden from screen readers.
- **Dependencies.** Add no new runtime dependencies. GSAP, loaded from a CDN, is the only one.
- **Bundle size.** Keep the main bundle lean. Code that only the editor, the note writer, the planes or the developer panel needs belongs in its own bundle. Never share `_`-prefixed names between bundles: each bundle mangles them differently.
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
2. Builds the five bundles.
3. Packages them into `animated-weather-card.zip`.
4. Publishes a GitHub release with the zip and the loose `.js` files.

HACS installs from the zip, because `hacs.json` sets `zip_release: true`, and shows the tag as the version. It extracts the bundles into `<config>/www/community/ha-ani-weather-card/`. The workflow's `unzip -l` step prints exactly what HACS will receive.

## License

By contributing, you agree that your contributions are licensed under the project's [MIT License](LICENSE).
