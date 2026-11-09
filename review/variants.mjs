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
            summary: '',
            tradeoffs: '',
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
            summary: '',
            tradeoffs: '',
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
            summary: '',
            tradeoffs: '',
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
            summary: '',
            tradeoffs: '',
            yaml: `tap_action:\n  action: forecast\nreview_popup: ${v}`,
            frames: [
                { ...weather('Tap me', PHONE, 4, { tap_action: { action: 'forecast' }, review_popup: v, show_note: true }), popup: true },
            ],
        })),
    },
];
