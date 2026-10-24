/**
 * Home Assistant's <ha-icon> is an unsized inline wrapper around the sized
 * <ha-svg-icon>. In a flex row the wrapper becomes a block as tall as the
 * text's line, with the glyph sitting a little low inside it: centring then
 * lines up the wrong box, and a rotation (the wind arrow) pivots off the
 * glyph's centre, so the arrow drifts with the wind direction. Sizing the
 * wrapper to the glyph makes both use the glyph itself.
 */
export const iconBoxCss = (scope: string) => `
        ${scope} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;
