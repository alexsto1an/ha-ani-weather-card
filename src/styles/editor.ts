/**
 * Config editor styles. The editor lives inside Home Assistant's card
 * editor dialog, so it follows HA's own vocabulary: outlined expansion
 * panels, label-left / switch-right rows, theme colors throughout.
 */

import { iconBoxCss } from './icon-box';

export const getConfigEditorStyles = () => `
${iconBoxCss('.card-config')}
        .card-config {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 4px 0;
          color: var(--primary-text-color);
        }

        /* ── Sections (outlined expansion panels) ─────────────────────────── */
        .section {
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: var(--ha-card-border-radius, 12px);
          overflow: hidden;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 48px;
          padding: 0 12px 0 16px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s ease;
        }
        .section-header:hover {
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
        }
        .section-header:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -2px;
        }
        .section-header ha-icon {
          --mdc-icon-size: 20px;
          color: var(--secondary-text-color);
          flex-shrink: 0;
        }
        .section-header h3 {
          flex: 1;
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          color: var(--primary-text-color);
        }
        .section-header .expand-icon {
          transition: transform 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .section.expanded .expand-icon {
          transform: rotate(180deg);
        }

        .section-content {
          display: none;
          padding: 4px 16px 16px;
        }
        .section.expanded .section-content {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .section-note {
          margin: 0 0 8px;
          font-size: 13px;
          line-height: 18px;
          color: var(--secondary-text-color);
        }

        .group-title {
          margin: 12px 0 2px;
          font-size: 12px;
          font-weight: 500;
          line-height: 16px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--secondary-text-color);
        }
        .group-title:first-child { margin-top: 4px; }

        /* ── Options ─────────────────────────────────────────────────────── */
        .option {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin: 4px 0;
        }

        /* Setting rows: label on the left, switch on the right */
        .switch-label {
          display: flex;
          flex-direction: row-reverse;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 40px;
          cursor: pointer;
          user-select: none;
        }
        .switch-label span {
          font-size: 14px;
          line-height: 20px;
          color: var(--primary-text-color);
        }

        /* Dependent settings sit indented under their parent */
        .sub-option {
          margin-top: -4px;
          padding-left: 20px;
        }

        /* ── Weather engine sliders ──────────────────────────────────────── */
        .engine-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 16px 24px;
          margin: 4px 0 12px;
        }
        .engine-option {
          display: grid;
          grid-template-columns: 1fr auto;
          grid-template-areas:
            "label value"
            "range range";
          align-items: baseline;
          row-gap: 6px;
        }
        .engine-option label {
          grid-area: label;
          font-size: 14px;
          color: var(--primary-text-color);
        }
        .engine-option .value-display {
          grid-area: value;
          font-size: 13px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          color: var(--secondary-text-color);
        }
        .engine-option input[type="range"] {
          grid-area: range;
          width: 100%;
          margin: 0;
          accent-color: var(--primary-color);
          cursor: pointer;
        }

        /* ── Colors ──────────────────────────────────────────────────────── */
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 8px 24px;
          margin: 4px 0 12px;
        }
        .color-option {
          display: grid;
          grid-template-columns: 32px 1fr auto;
          align-items: center;
          gap: 12px;
          min-height: 40px;
        }
        .color-option input[type="color"] {
          order: -1;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
          border-radius: 8px;
          background: none;
          cursor: pointer;
        }
        .color-option input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        .color-option input[type="color"]::-webkit-color-swatch { border: none; border-radius: 7px; }
        .color-option input[type="color"]::-moz-color-swatch { border: none; border-radius: 7px; }
        .color-option label {
          font-size: 14px;
          color: var(--primary-text-color);
        }

        /* ── Buttons: quiet text buttons, HA style ───────────────────────── */
        .color-reset,
        .reset-engine-btn,
        .reset-colors-btn {
          align-self: flex-start;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          background: none;
          font: inherit;
          font-size: 14px;
          font-weight: 500;
          color: var(--primary-color);
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        /* Text buttons align their label, not their hit area, with the content edge */
        .reset-engine-btn,
        .reset-colors-btn { margin-left: -12px; }
        .color-reset {
          padding: 6px 8px;
          margin-right: -8px;
          font-size: 13px;
        }
        .color-reset:hover,
        .reset-engine-btn:hover,
        .reset-colors-btn:hover {
          background: var(--secondary-background-color, rgba(0, 0, 0, 0.05));
        }
        .color-reset:focus-visible,
        .reset-engine-btn:focus-visible,
        .reset-colors-btn:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: 1px;
        }
`;
