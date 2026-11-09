// The variants on the review page: what each is, its trade-offs, and the
// frames it's shown in, at real size. Review only.

const rows = (n) => n * 56 + (n - 1) * 8;
const ENTITY = { entity: 'weather.home', sun_entity: 'sun.sun' };
const PHONE = 353;
const WIDE = 820;
/** The rows each forecast card design asks for, with hours and days */
const CARD_ROWS = { a: 5, b: 5, c: 6 };

const weather = (label, width, rowCount, config) => ({ label: `${label} · ${width} × ${rows(rowCount)}`, width, height: rows(rowCount), config: { ...ENTITY, ...config } });

export const SURFACES = [
    {
        id: 'clock',
        title: 'Clock on the weather card',
        about: 'show_clock: true. Each asks the sections grid for one more row; in a phone\'s four rows it gives way, and the card is exactly as it is today.',
        variants: ['a', 'b', 'c'].map(v => ({
            letter: v.toUpperCase(),
            name: { a: 'Closing line', b: 'Where and when', c: 'Head of the axis' }[v],
            pick: v === 'c',
            summary: {
                a: 'The hero\'s last line: thin numerals at 34 px in the quiet tint, with the weekday and day. The largest clock that still defers to the temperature, and it leads into the forecast below it.',
                b: 'The time and date join the location\'s line at its own size, 15 px: "13:10 · Tue 10 · Home". It costs no height wherever the location shows.',
                c: 'The first line at 0.3× the temperature (24 px, 29 from 460, 36 wide), then the date and the place. Its left edge is the forecast line\'s "now".',
            }[v],
            tradeoffs: {
                a: 'Five rows land on the short step (60 px temperature). Tinted, its line stops at 55% of the width, so a long date drops. Reads from the pillow.',
                b: 'Free in height and in the fit, but 15 px is too small for the bedside requests. Good for a phone, where the status bar already has the time.',
                c: 'Keeps the 80 px temperature at five rows (+6 px), no new fit steps: it goes with the location in the tight step. The place goes first when the line runs out of room, then the date, never the time.',
            }[v],
            yaml: `show_clock: true\nreview_clock: ${v}`,
            frames: [
                weather('Phone, 5 rows', PHONE, 5, { show_clock: true, review_clock: v }),
                weather('Phone, 4 rows', PHONE, 4, { show_clock: true, review_clock: v }),
                weather('Phone, 6 rows, note', PHONE, 6, { show_clock: true, review_clock: v, show_note: true }),
                weather('Wide, 5 rows', WIDE, 5, { show_clock: true, review_clock: v }),
            ],
        })),
    },
    {
        id: 'section',
        title: 'Forecast on the weather card',
        about: 'forecast: hourly, daily or both. Between the hero and the metrics; it gives way in short frames before anything else the card had.',
        variants: ['a', 'b', 'c'].map(v => ({
            letter: v.toUpperCase(),
            name: { a: 'Columns', b: 'The sentence', c: 'The line' }[v],
            pick: v === 'c',
            summary: {
                a: 'The hours as the metric row\'s sibling, a label over one number, and a line under them only where rain starts or stops ("Rain 80%", "Dry"). Days as rows with a range bar. Today\'s high and low on the condition\'s line.',
                b: 'One or two lines of answer: "Rain 17:00–19:00 · 70%", "Low 12° at 01:00", and two or three day rows. Today\'s high and low beside the temperature.',
                c: 'The next 12 hours\' temperature as one line on the sky, the metrics\' divider its ground, labelled only at the rain, the high or low and the end; rain as streaks under the curve, dotted after dark. Today\'s high and low beside the temperature.',
            }[v],
            tradeoffs: {
                a: 'The literal "hours as a row", in the card\'s own type, no icons. Five equal numbers sit close to the anti-reference strip; the most familiar to people coming from other cards.',
                b: 'The calmest and cheapest: asks five rows and keeps the whole hero at six. Says the decision, not the shape of the day. It\'s also every variant\'s short form in short frames.',
                c: 'Answers the umbrella and the coat in one glance, in the sun tracker\'s drawing language; per-hour values live in the pop-up. Six rows land on compact. It flattens before it goes.',
            }[v],
            yaml: `forecast: hourly\nreview_forecast: ${v}`,
            frames: [
                weather('Phone, 6 rows, hours', PHONE, 6, { forecast: 'hourly', review_forecast: v }),
                weather('Phone, 8 rows, both', PHONE, 8, { forecast: 'both', review_forecast: v }),
                weather('Phone, 4 rows', PHONE, 4, { forecast: 'hourly', review_forecast: v }),
                weather('Wide, 6 rows, hours and clock', WIDE, 6, { forecast: 'hourly', review_forecast: v, show_clock: true }),
            ],
        })),
    },
    {
        id: 'card',
        title: 'Forecast card',
        about: 'custom:animated-forecast-card, in the weather entity\'s sky. The strip sits under a compact weather card; a tap opens the pop-up.',
        variants: ['a', 'b', 'c'].map(v => ({
            letter: v.toUpperCase(),
            name: { a: 'Columns and rows', b: 'Skies', c: 'The instrument' }[v],
            pick: v === 'c',
            summary: {
                a: 'The weather card\'s parts: a strip of hour columns in the lower sky under the weather card; on its own, the hours over the days from today, a dot at the reading now.',
                b: 'Each hour painted in its own sky, by day or by night, words only where the weather changes: the strip continues the weather card\'s lower sky into the evening.',
                c: 'The sun tracker\'s anatomy: a headline (what the weather does next: "RAIN / 17:00 / in 4 h · 70%"), the line with an hour axis, then the days. Its strip lines up with the compact tracker\'s.',
            }[v],
            tradeoffs: {
                a: 'Dependable and clear; no headline, so it says least at wall distance.',
                b: 'The most "the sky is the card" of all, and the riskiest: a dry change it can\'t name isn\'t painted, and at dusk and night it can read as stripes. Judge it at Dusk and Night.',
                c: 'The only one with a headline, so it answers from across a room; the line is the same one the weather card\'s forecast draws. Asks six rows.',
            }[v],
            yaml: `type: custom:animated-forecast-card\nentity: weather.home\nreview_card: ${v}`,
            frames: [
                {
                    label: 'Between a compact weather card and the compact tracker · 353 × 120 each',
                    stack: [
                        { width: PHONE, height: rows(2), config: { ...ENTITY, compact: true } },
                        { type: 'animated-forecast-card', width: PHONE, height: rows(2), config: { ...ENTITY, compact: true, review_card: v } },
                        { type: 'animated-sun-tracker-card', width: PHONE, height: rows(2), config: { sun_entity: 'sun.sun', weather_entity: 'weather.home', compact: true } },
                    ],
                },
                { label: `Regular, hours and days · ${PHONE} × ${rows(CARD_ROWS[v])}`, type: 'animated-forecast-card', width: PHONE, height: rows(CARD_ROWS[v]), config: { ...ENTITY, forecast: 'both', review_card: v } },
                { label: `Bedside, show_clock · ${PHONE} × ${rows(CARD_ROWS[v] + 3)}`, type: 'animated-forecast-card', width: PHONE, height: rows(CARD_ROWS[v] + 3), config: { ...ENTITY, forecast: 'both', review_card: v, show_clock: true } },
                { label: `Wide · ${WIDE} × ${rows(CARD_ROWS[v])}`, type: 'animated-forecast-card', width: WIDE, height: rows(CARD_ROWS[v]), config: { ...ENTITY, forecast: 'both', review_card: v } },
            ],
        })),
    },
    {
        id: 'popup',
        title: 'Pop-up',
        about: 'tap_action: { action: forecast }. Tap a card, or use the button. Escape, the close button or the backdrop closes it, and focus goes back to the card.',
        variants: ['a', 'c'].map(v => ({
            letter: v.toUpperCase(),
            name: { a: 'The sheet', c: 'The scrub' }[v],
            pick: v === 'c',
            summary: {
                a: 'A sheet in the card\'s sky, read top to bottom: the hero and the note, 24 hours you can scroll with every change of weather named, ten days on one range, every reading the entity reports, then History and settings.',
                c: 'The same sheet, with the line large enough for a finger: drag across it, or use the arrow keys, and a readout above shows that hour\'s every value. The big number always means now.',
            }[v],
            tradeoffs: {
                a: 'Plain and complete, nothing to learn. Per-hour gusts, UV and humidity aren\'t there.',
                c: 'The only one that reaches every hour\'s every value, which is what makes it clearly better than Home Assistant\'s more-info. One gesture to discover.',
            }[v],
            yaml: `tap_action:\n  action: forecast\nreview_popup: ${v}`,
            frames: [
                { ...weather('Tap me', PHONE, 4, { tap_action: { action: 'forecast' }, review_popup: v, show_note: true }), popup: true },
            ],
        })),
    },
];
