# Product

## Register

product

## Users

Home Assistant users who put the card on a dashboard and glance at it, mostly without interacting. The same card is seen on a wall-mounted tablet from across a room, in the companion app on a phone at arm's length, and in a multi-column desktop dashboard. It is a public HACS card, so it has to hold up at any column width and any row height the dashboard gives it, in light and dark Home Assistant themes.

The job: know what it's like outside right now in one glance (temperature and condition first, then the details that change a decision: wind, humidity, sunset, indoor climate), and feel something about it.

## Product Purpose

An animated weather card that makes the dashboard feel alive: the sky behaves like the weather. It exists because Home Assistant's default weather card is a static data tile. Success is a card people keep on their main view because it is the most beautiful thing on it, and the data is still faster to read than the default card.

The same download includes a second card, the sun tracker: the sun's path across the day, with the next sunrise or sunset as its headline. It's designed to pair with the weather card. A compact tracker stacked under the weather card shares its sky and lines up with its text, so the two read as one piece. Both cards are free and open source.

## Brand Personality

Calm, precise, atmospheric. The register of Apple Weather, distilled: the sky is the interface, type does the work, motion is weather rather than decoration. Confident enough to leave space empty.

The words follow the same register, in the README, the editor and the changelog:

- Short, declarative sentences that speak to "you".
- Say what the card does and why, and let the screenshots carry the rest.
- No superlatives, and no claims the code doesn't back up.

## Anti-references

- Busy or noisy: many numbers and icons competing for attention, animation fighting the data, every value given equal weight.
- The generic Lovelace tile: icon + label rows, flat color fills, everything the same size.
- Decorative glassmorphism: frosted panels and glows used because they look modern, not because text needs them.

## Design Principles

1. **The sky is the card.** Color, depth and light come from the weather itself (condition plus time of day), never from chrome around it.
2. **One hero, one quiet tier.** Temperature leads by a wide margin; everything else is a calm, consistent secondary tier. If two things compete, one of them is wrong.
3. **Legibility over spectacle.** Text always wins over particles: weather moves behind the words, and contrast is guaranteed in every condition and theme.
4. **Fit any frame.** The layout adapts to the space it's given (narrow column, short row, wall tablet, one-line compact strip) instead of clipping or shrinking uniformly.
5. **Motion is weather, not UI.** Interface transitions are brief and state-driven; the atmosphere is where motion lives.
6. **Everything that moves is real.** The condition, the live wind speed, the sun's position and the planes overhead drive what the sky does. Nothing is there just to fill the frame.

## Accessibility & Inclusion

- WCAG 2.2 AA: 4.5:1 for body text and 3:1 for large text against the sky, in every condition, both palettes (colorized and theme), light and dark HA themes.
- `prefers-reduced-motion`: static sky, no particle animation (already supported, must not regress).
- Information is never conveyed by color alone (trend arrows, condition text alongside the sky).
- Decorative layers stay `aria-hidden`; live values use `aria-live="polite"`.
- The cards speak the dashboard's language. Home Assistant's own translations come first; the cards' few words of their own are translated, and times follow the profile's 12- or 24-hour setting. Layouts are measured against the translated labels, never sized for English.
