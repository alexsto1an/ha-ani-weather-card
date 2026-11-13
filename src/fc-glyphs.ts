// The forecast's icons: the Senja weather glyphs, one filled set on a
// 25-unit grid, for the hourly row, the strip and the daily list. Each
// condition takes the pack's own drawing: Sun 1, Half Moon, Day Cloud,
// Night Cloud 2, Cloudy, Cloud Rain Fall, Heavy Rain, Cloud Thunderbolt,
// Snow Fall, Windy, and Cloudy And Windy. The pack has no storm with rain,
// sleet, hail, fog or warning, so those are put together from its parts at
// its own positions and weights: the storm cloud and bolt with Day Rainy With
// Thunderbolt's dashes beside it, the rain cloud with Snow Fall's dots and
// short dashes between them, with larger pellets, over two bars as thick as
// its wind, and a rounded triangle with its mark cut out. Where one shape
// passes in front of another, the pack cuts the gap into the shape behind,
// so one ink still reads as two shapes.
//
// On the sky palettes each icon stands in the light of its own hour: the
// cloud is the card's day white, dawn rose, dusk peach or night slate, the
// sun its gold, the rain its pale blue, mixed from the hour's day, twilight
// and night in OKLab. Only colour: no gradient, no glow, no detail. Each
// colour's lightness is raised, its hue and chroma kept, until it holds
// 3.2:1 against the brightest sky it can be seen over (see litTints). On
// the theme palettes there's no sky to stand in: one ink, Home Assistant's
// icon colour.

import { Lab, cssOf, fromLab, labOf, luminance, phaseWeights } from './fc-core';

/** The marks a condition is made of */
export type GlyphKey = 'sunny' | 'clear-night' | 'partlycloudy' | 'partlycloudy-night' | 'cloudy' | 'fog' | 'rainy' | 'pouring'
    | 'lightning' | 'lightning-rainy' | 'snowy' | 'snowy-rainy' | 'hail' | 'windy' | 'windy-variant' | 'exceptional';

/** Which drawing an hour gets: clear and partly cloudy skies take the moon after dark */
export function glyphKey(condition: string | undefined, isDay = true): GlyphKey {
    switch (condition) {
        case 'sunny': case 'clear-night': return isDay ? 'sunny' : 'clear-night';
        case 'partlycloudy': return isDay ? 'partlycloudy' : 'partlycloudy-night';
        case 'cloudy': case 'fog': case 'rainy': case 'pouring': case 'lightning': case 'lightning-rainy': case 'snowy':
        case 'snowy-rainy': case 'hail': case 'windy': case 'windy-variant': case 'exceptional':
            return condition;
        default: return 'cloudy';
    }
}

// ── Drawings ───────────────────────────────────────────────────────────────
/** What sets a part's colour: c the cloud (and wind, fog and the warning), s the sun, m the moon, r rain, snow and hail, b the bolt */
type Role = 'c' | 's' | 'm' | 'r' | 'b';
// The rain cloud, raised over what falls; the storm cloud, cut round its bolt
const WET = 'm5.16 9.5v.05h-.11c-1.69 0-3.05 1.45-3.05 3.22 0 1.78 1.36 3.23 3.05 3.23h13.24c2.6 0 4.71-2.18 4.71-4.86 0-2.69-2.11-4.87-4.71-4.87-.44 0-.87.07-1.29.18-1.07-2.09-3.19-3.45-5.55-3.45-3.48 0-6.29 2.91-6.29 6.5';
const STORM = 'm5.16 8.5v.05c-1.75.03-3.16 1.47-3.16 3.22 0 1.78 1.44 3.23 3.23 3.23h1.9c-.22-.57-.17-1.23.24-1.79l4.14-5.6c.9-1.23 2.85-.47 2.69 1.05l-.39 3.81 1.03.47c.84.38 1.28 1.23 1.14 2.06h1.69c.11 0 .22 0 .33-.02.03.02.16.02.29.02 2.6 0 4.71-2.18 4.71-4.86 0-2.69-2.11-4.87-4.71-4.87-.44 0-.87.07-1.28.19-1.08-2.1-3.2-3.46-5.56-3.46-3.48 0-6.29 2.91-6.29 6.5';
const BOLT = 'm12.31 8.2l-4.14 5.6c-.35.49-.14 1.11.4 1.35l1.7.76-.48 4.54c-.05.51.6.76.9.35l4.14-5.6c.35-.48.14-1.11-.4-1.35l-1.69-.76.47-4.54c.03-.33-.23-.55-.5-.55-.15 0-.3.06-.4.2';
/** Each condition's parts, back to front */
const DRAW: Record<GlyphKey, [Role, string][]> = {
    sunny: [['s', 'm7 12.5c0 3.04 2.46 5.5 5.5 5.5 3.04 0 5.5-2.46 5.5-5.5 0-3.04-2.46-5.5-5.5-5.5-3.04 0-5.5 2.46-5.5 5.5'], ['s', 'm11.77 2.73v1.95c0 .41.32.74.73.74.41 0 .73-.33.73-.74v-1.95c0-.4-.32-.73-.73-.73-.41 0-.73.33-.73.73m7.09 2.35l-1.38 1.38c-.29.29-.29.75 0 1.04.28.28.75.28 1.03 0l1.38-1.38c.29-.29.29-.75 0-1.04-.14-.14-.33-.21-.51-.21-.19 0-.38.07-.52.21m-13.78.03c-.29.28-.31.72 0 1.03l1.38 1.38c.69.69 1.73-.34 1.04-1.03l-1.39-1.38c-.15-.16-.33-.23-.51-.23-.19 0-.37.08-.52.23m15.23 6.66c-.97 0-.97 1.46 0 1.46h1.96c.97 0 .97-1.46 0-1.46zm-17.58 0c-.97 0-.97 1.46 0 1.46h1.96c.97 0 .97-1.46 0-1.46zm14.77 5.71c-.28.28-.31.72 0 1.03l1.39 1.38c.31.31.75.29 1.03 0 .29-.28.31-.72 0-1.03l-1.38-1.38c-.15-.16-.34-.23-.52-.23-.18 0-.37.08-.52.23m-11.01.02l-1.38 1.39c-.31.31-.29.74 0 1.03.28.29.72.31 1.03 0l1.38-1.38c.32-.31.29-.75 0-1.04-.14-.14-.33-.22-.52-.22-.18 0-.36.07-.51.22m5.28 2.81v1.96c0 .97 1.46.97 1.46 0v-1.96c0-.49-.36-.73-.73-.73-.37 0-.73.24-.73.73']],
    'clear-night': [['m', 'm12.03 3.47c-4.8.32-8.56 4.25-8.56 9.02 0 5 4.11 9.04 9.18 9.04 3.32 0 6.33-1.75 7.96-4.53.17-.3-.05-.68-.4-.65-.19.01-.37.01-.56.01-4.6 0-8.32-3.66-8.32-8.17 0-1.45.38-2.85 1.1-4.07.17-.29-.04-.65-.37-.65-.01 0-.02 0-.03 0']],
    partlycloudy: [['s', 'm8 6.49v1.01c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-1.01c0-.27-.22-.49-.5-.49-.28 0-.5.22-.5.49m4.16 1.37l-.83.84c-.19.19-.19.5 0 .69.19.18.51.18.69 0l.84-.84c.19-.19.19-.5 0-.69-.1-.09-.22-.14-.35-.14-.12 0-.25.05-.35.14m-8.29.71l.83.83c.46.46 1.16-.23.69-.69l-.83-.83c-.11-.11-.22-.15-.34-.15-.38 0-.71.49-.35.84m1.07 3.79c0 1.28.71 2.4 1.76 2.98.46-.63 1.13-1.09 1.91-1.3.26-1.59 1.15-2.95 2.41-3.86-.64-.77-1.59-1.25-2.65-1.25-1.89 0-3.43 1.53-3.43 3.43m-2.45-.36c-.65 0-.65 1 0 1h1.01c.28 0 .5-.22.5-.5 0-.28-.22-.5-.5-.5zm2.23 3.32l-.83.84c-.47.46.23 1.15.69.69l.83-.83c.36-.36.03-.84-.35-.84-.12 0-.24.04-.34.14'], ['c', 'm9.53 14.91c-1.4.01-2.53 1.14-2.53 2.54 0 1.41 1.14 2.55 2.55 2.55h10.22c.05 0 .11 0 .16 0 .07 0 .13 0 .2 0 2.14 0 3.87-1.69 3.87-3.77 0-2.09-1.73-3.78-3.87-3.78-.33 0-.67.05-.98.13-.89-1.57-2.6-2.58-4.49-2.58-2.8 0-5.08 2.19-5.13 4.91']],
    'partlycloudy-night': [['m', 'm7.08 5.74c.42.76.64 1.61.64 2.5 0 2.77-2.17 5.01-4.86 5.01-.11 0-.21 0-.32-.01-.4-.03-.67.4-.48.74.69 1.23 1.77 2.16 3.04 2.65.29-1.26 1.26-2.25 2.51-2.59.42-2.56 2.49-4.57 5.1-4.97-.75-2.25-2.75-3.91-5.16-4.07-.01 0-.03 0-.04 0-.37 0-.62.41-.43.74'], ['c', 'm8.53 14.91c-1.4.01-2.53 1.14-2.53 2.54 0 1.41 1.14 2.55 2.55 2.55h10.22c.05 0 .11 0 .16 0 .07 0 .13 0 .2 0 2.14 0 3.87-1.69 3.87-3.77 0-2.09-1.73-3.78-3.87-3.78-.33 0-.66.05-.98.13-.89-1.57-2.6-2.58-4.49-2.58-2.8 0-5.08 2.19-5.13 4.91']],
    cloudy: [['c', 'm6.41 11.5h-.08c-1.84 0-3.33 1.45-3.33 3.25 0 1.8 1.49 3.25 3.33 3.25h.72c-.02-.16-.03-.33-.03-.5 0-1.5.95-2.8 2.31-3.29.56-2.42 2.65-4.21 5.15-4.21 1.63 0 3.14.77 4.13 2.05.24-.03.49-.05.74-.05.98 0 1.89.28 2.65.77-.42-1.98-2.22-3.47-4.37-3.47-.21 0-.43.02-.63.04-.93-2.02-2.86-3.34-5.02-3.34-2.94 0-5.33 2.43-5.57 5.5'], ['c', 'm10.18 15.02c-1.23.16-2.18 1.21-2.18 2.48 0 1.38 1.12 2.5 2.5 2.5h7.85c.13 0 .27-.01.4-.03.18.02.35.03.52.03 2.05 0 3.73-1.56 3.73-3.5 0-1.94-1.68-3.5-3.73-3.5-.41 0-.81.06-1.19.18-.76-1.33-2.13-2.18-3.66-2.18-2.21 0-4.01 1.77-4.24 4.02']],
    fog: [['c', WET], ['c', 'M5.6 17.5h15.6a.75 .75 0 0 1 0 1.5h-15.6a.75 .75 0 0 1 0-1.5z'], ['c', 'M3.8 20.5h13.6a.75 .75 0 0 1 0 1.5h-13.6a.75 .75 0 0 1 0-1.5z']],
    rainy: [['c', WET], ['r', 'm18 18.5v3.89c0 .27.22.5.5.5.28 0 .5-.23.5-.5v-3.89c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v3.89c0 .27.22.5.5.5.28 0 .5-.23.5-.5v-3.89c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-4 0v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5']],
    pouring: [['c', WET], ['r', 'm18.05 18.28l-2 4c-.12.24-.02.54.23.67.24.12.54.02.67-.23l2-4c.12-.24.02-.54-.23-.67-.07-.03-.15-.05-.22-.05-.18 0-.36.1-.45.28m-4 0l-1 2c-.12.24-.02.54.23.67.24.12.54.02.67-.23l1-2c.12-.24.02-.54-.23-.67-.07-.03-.15-.05-.22-.05-.18 0-.36.1-.45.28m-4 0l-2 4c-.12.24-.02.54.23.67.24.12.54.02.67-.23l2-4c.12-.24.02-.54-.23-.67-.07-.03-.15-.05-.22-.05-.18 0-.36.1-.45.28m-4 0l-1 2c-.12.24-.02.54.23.67.24.12.54.02.67-.23l1-2c.12-.24.02-.54-.23-.67-.07-.03-.15-.05-.22-.05-.18 0-.36.1-.45.28']],
    lightning: [['c', STORM], ['b', BOLT]],
    'lightning-rainy': [['c', STORM], ['b', BOLT], ['r', 'm16.5 17.5v1c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-11 0v1c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m11 3v1c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m-11 0v1c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-1c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5']],
    snowy: [['c', WET], ['r', 'm16.55 17.67c0 .37.33.66.73.66.4 0 .72-.29.72-.66 0-.37-.32-.67-.72-.67-.4 0-.73.3-.73.67m-5.77 0c0 .37.32.66.72.66.4 0 .72-.29.72-.66 0-.37-.32-.67-.72-.67-.4 0-.72.3-.72.67m-5.78 0c0 .37.32.66.72.66.4 0 .73-.29.73-.66 0-.37-.33-.67-.73-.67-.4 0-.72.3-.72.67m8.67 2.66c0 .37.32.67.72.67.4 0 .72-.3.72-.67 0-.37-.32-.66-.72-.66-.4 0-.72.29-.72.66m-5.78 0c0 .37.32.67.72.67.4 0 .72-.3.72-.67 0-.37-.32-.66-.72-.66-.4 0-.72.29-.72.66']],
    'snowy-rainy': [['c', WET], ['r', 'm16.55 17.67c0 .37.33.66.73.66.4 0 .72-.29.72-.66 0-.37-.32-.67-.72-.67-.4 0-.73.3-.73.67m-5.77 0c0 .37.32.66.72.66.4 0 .72-.29.72-.66 0-.37-.32-.67-.72-.67-.4 0-.72.3-.72.67m-5.78 0c0 .37.32.66.72.66.4 0 .73-.29.73-.66 0-.37-.33-.67-.73-.67-.4 0-.72.3-.72.67m3.11.83v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5m5.78 0v2c0 .28.22.5.5.5.28 0 .5-.22.5-.5v-2c0-.28-.22-.5-.5-.5-.28 0-.5.22-.5.5']],
    hail: [['c', WET], ['r', 'M6.4 19.1a1.2 1.2 0 1 1 2.4 0a1.2 1.2 0 1 1-2.4 0zM16.2 19.1a1.2 1.2 0 1 1 2.4 0a1.2 1.2 0 1 1-2.4 0zM11.3 21.6a1.2 1.2 0 1 1 2.4 0a1.2 1.2 0 1 1-2.4 0z']],
    windy: [['c', 'm14.43 5c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h.24c1.29 0 2.33 1.01 2.33 2.25 0 1.24-1.04 2.25-2.33 2.25h-10.42c-1.24 0-2.25 1.01-2.25 2.25 0 1.24 1.01 2.25 2.25 2.25h.89c.41 0 .75-.34.75-.75 0-.41-.34-.75-.75-.75h-.89c-.41 0-.75-.34-.75-.75 0-.41.34-.75.75-.75h10.42c2.12 0 3.83-1.68 3.83-3.75 0-2.07-1.71-3.75-3.83-3.75zm6.18 3.75c0 .41.34.75.75.75.38 0 .64.29.64.75 0 .41-.34.75-.75.75h-2.5c-.41 0-.75.33-.75.75 0 .41.34.75.75.75h2.5c1.24 0 2.25-1.01 2.25-2.25 0-1.27-.91-2.25-2.14-2.25-.41 0-.75.34-.75.75m-12.86 5.25c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h6.19c.58 0 1.06.55 1.06 1.25 0 .7-.48 1.25-1.06 1.25h-.14c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h.14c1.42 0 2.56-1.24 2.56-2.75 0-1.51-1.14-2.75-2.56-2.75z'], ['c', 'm6.75 8c-.45 0-.75.34-.75.75 0 .41.3.75.75.75h4.99c.45 0 .75-.34.75-.75 0-.41-.3-.75-.75-.75zm11.51 6.51c-.42 0-.75.33-.75.74 0 .42.33.75.75.75h2.49c.42 0 .75.34.75.75 0 .42-.33.75-.75.75h-.73c-.41 0-.75.34-.75.75 0 .42.34.75.75.75h.73c1.25 0 2.25-1 2.25-2.25 0-1.24-1-2.24-2.25-2.24z']],
    'windy-variant': [['c', 'm5.16 9.55c-1.76.08-3.16 1.61-3.16 3.47 0 1.92 1.47 3.48 3.31 3.48h1.42c.41 0 .75-.34.75-.75 0-.41-.34-.75-.75-.75h-1.42c-.99 0-1.81-.88-1.81-1.98 0-1.09.82-1.97 1.81-1.97h.62c.44 0 .79-.38.75-.82-.02-.16-.02-.32-.02-.48 0-2.9 2.26-5.25 5.04-5.25 2 0 3.8 1.23 4.6 3.12.16.38.6.56.98.4.4-.16.83-.25 1.26-.25 1.91 0 3.46 1.62 3.46 3.62 0 1.31-.68 2.52-1.78 3.15-.36.21-.48.67-.27 1.03.21.36.67.48 1.03.27 1.56-.91 2.52-2.6 2.52-4.45 0-2.82-2.22-5.12-4.96-5.12-.39 0-.78.05-1.16.14-1.15-2.1-3.32-3.41-5.68-3.41-3.55 0-6.44 2.92-6.54 6.55'], ['c', 'm12 9.75c0 .41.34.75.75.75.69 0 1.25.56 1.25 1.25 0 .69-.56 1.25-1.25 1.25h-4c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h4c1.52 0 2.75-1.23 2.75-2.75 0-1.52-1.23-2.75-2.75-2.75-.41 0-.75.34-.75.75m5.75.25c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h.5c.41 0 .75.34.75.75 0 .41-.34.75-.75.75h-2.5c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h2.5c1.24 0 2.25-1.01 2.25-2.25 0-1.24-1.01-2.25-2.25-2.25zm-12 3c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h1c.41 0 .75-.34.75-.75 0-.41-.34-.75-.75-.75zm10 2c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h1.5c.41 0 .75.34.75.75 0 .41-.34.75-.75.75h-.5c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h.5c1.24 0 2.25-1.01 2.25-2.25 0-1.24-1.01-2.25-2.25-2.25zm-10 0c-.41 0-.75.34-.75.75 0 .41.34.75.75.75h7c.69 0 1.25.56 1.25 1.25 0 .69-.56 1.25-1.25 1.25h-.15c-.42 0-.75.34-.75.75 0 .41.33.75.75.75h.15c1.52 0 2.75-1.23 2.75-2.75 0-1.52-1.23-2.75-2.75-2.75z']],
    exceptional: [['c', 'M14.33 5.81L21.41 18.26A2.1 2.1 0 0 1 19.59 21.4L5.41 21.4A2.1 2.1 0 0 1 3.59 18.26L10.67 5.81A2.1 2.1 0 0 1 14.33 5.81ZM11.7 9.2V14.6A.8 .8 0 0 0 13.3 14.6V9.2A.8 .8 0 0 0 11.7 9.2ZM11.5 17.9A1 1 0 0 0 13.5 17.9A1 1 0 0 0 11.5 17.9Z']],
};

export const GLYPH_KEYS = Object.keys(DRAW) as GlyphKey[];

// ── Light ──────────────────────────────────────────────────────────────────
export type Tone = 'cloud' | 'grey' | 'sun' | 'moon' | 'rain' | 'bolt';
/** The card's own tints by phase (styles/card.ts: --awc-cloud-near, the sun's colours, the rain's) */
const TINT: Record<Tone, Record<'day' | 'dawn' | 'dusk' | 'night', string>> = {
    cloud: { day: '#f8fafd', dawn: '#ffeae4', dusk: '#ffe2d6', night: '#96a2ba' },
    // Overcast and wet hours: the cloudy sky's greyer clouds by day
    grey: { day: '#dee5ee', dawn: '#e8dee2', dusk: '#e8d6d4', night: '#96a2ba' },
    sun: { day: '#ffd67a', dawn: '#ffe0b0', dusk: '#ffc58a', night: '#ffd67a' },
    moon: { day: '#f4f1e6', dawn: '#f4f1e6', dusk: '#f4f1e6', night: '#e6e3d8' },
    rain: { day: '#e2ecff', dawn: '#ece8f8', dusk: '#f0e4ec', night: '#b4c6e6' },
    bolt: { day: '#fffaf0', dawn: '#fffaf0', dusk: '#fffaf0', night: '#fff3d6' },
};
const TINT_LAB: Record<string, Lab> = {};
const tintLab = (c: string) => (TINT_LAB[c] ??= labOf(c));

/** Raise a colour's OKLab lightness, hue and chroma kept, until its luminance reaches `min` */
function floorLab(lab: Lab, min: number): Lab {
    if (min <= 0 || luminance(fromLab(lab)) >= min) return lab;
    let lo = lab[0], hi = 1;
    for (let i = 0; i < 18; i++) { const m = (lo + hi) / 2; if (luminance(fromLab([m, lab[1], lab[2]])) >= min) hi = m; else lo = m; }
    return [hi, lab[1], lab[2], 1];
}

/** The contrast an icon holds against the sky behind it */
export const GLYPH_CONTRAST = 3.2;

export type Tints = Record<Tone, string>;
/**
 * The colours of one hour's icon, lit by that hour: elevation and rising
 * give its day, twilight and night, and `skyLum` is the brightest sky it
 * can be seen over (a luminance; 0 for no floor).
 */
export function litTints(elevation: number, rising: boolean, skyLum: number): Tints {
    const w = phaseWeights(elevation, rising);
    // A little over the mark, so it still holds once rounded to hex
    const min = skyLum > 0 ? (GLYPH_CONTRAST + 0.05) * (skyLum + 0.05) - 0.05 : 0;
    const out = {} as Tints;
    for (const tone of Object.keys(TINT) as Tone[]) {
        let lab: Lab = [0, 0, 0, 0];
        for (const ph of ['day', 'dawn', 'dusk', 'night'] as const) {
            if (!w[ph]) continue;
            const t = tintLab(TINT[tone][ph]);
            lab = [lab[0] + t[0] * w[ph], lab[1] + t[1] * w[ph], lab[2] + t[2] * w[ph], 1];
        }
        out[tone] = cssOf(floorLab(lab, min));
    }
    return out;
}
const OVERCAST = new Set(['cloudy', 'fog', 'rainy', 'pouring', 'lightning', 'lightning-rainy', 'snowy', 'snowy-rainy', 'hail', 'windy-variant']);

const ROLE: Record<Exclude<Role, 'c'>, Tone> = { s: 'sun', m: 'moon', r: 'rain', b: 'bolt' };

/**
 * One icon as SVG. tints: litTints() on a sky palette, or null on a theme
 * palette (one ink: currentColor, which the theme's CSS sets to its icon
 * colour). Decorative: the row's and the list's text names the condition.
 */
export function glyph(condition: string | undefined, isDay: boolean, size: number, tints: Tints | null, cls = 'fc-glyph'): string {
    const key = glyphKey(condition, isDay);
    const cloudTone: Tone = OVERCAST.has(key) ? 'grey' : 'cloud';
    const body = DRAW[key].map(([role, d]) => `<path d="${d}" fill="${tints ? tints[role === 'c' ? cloudTone : ROLE[role]] : 'currentColor'}"/>`).join('');
    return `<svg class="${cls}" data-g="${key}" viewBox="0 0 25 25" width="${size}" height="${size}" aria-hidden="true" focusable="false">${body}</svg>`;
}

/** The tint a glyph's main mark takes: what a repeat is compared on */
export function glyphSignature(condition: string | undefined, isDay: boolean, tints: Tints | null): string {
    const key = glyphKey(condition, isDay);
    return `${key}|${tints ? (key === 'sunny' ? tints.sun : key === 'clear-night' ? tints.moon : tints[OVERCAST.has(key) ? 'grey' : 'cloud']) : ''}`;
}
