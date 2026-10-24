// Developer panel CSS (dev_mode only). A compact inspector that floats over
// the card; the only place the card uses a blurred surface, because it sits
// on top of live animation.

export const getDevPanelStyles = () => `
        .dev-toggle,
        .dev-controls {
          --dev-fg: #e9ecf3;
          --dev-fg-2: rgba(233, 236, 243, 0.62);
          --dev-line: rgba(255, 255, 255, 0.09);
          --dev-fill: rgba(255, 255, 255, 0.07);
          --dev-fill-hover: rgba(255, 255, 255, 0.13);
          --dev-accent: #7cc4ff;
          color-scheme: dark;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
          -webkit-font-smoothing: antialiased;
        }

        .dev-toggle {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: var(--dev-panel-z-index, 10000);
        }
        .dev-toggle-btn {
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 50%;
          background: rgba(10, 14, 24, 0.42);
          -webkit-backdrop-filter: blur(12px);
          backdrop-filter: blur(12px);
          color: var(--dev-fg);
          cursor: pointer;
          transition: background-color 0.15s ease;
          --mdc-icon-size: 17px;
        }
        .dev-toggle-btn:hover { background: rgba(10, 14, 24, 0.62); }

        .dev-controls {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: var(--dev-panel-z-index, 10000);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          width: 288px;
          max-height: min(640px, calc(100vh - 32px));
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          background: rgba(17, 20, 28, 0.94);
          -webkit-backdrop-filter: blur(20px) saturate(140%);
          backdrop-filter: blur(20px) saturate(140%);
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
          color: var(--dev-fg);
          font-size: 13px;
          line-height: 18px;
          overflow: hidden;
        }

        /* Docked outside the card (see dockDevPanel) */
        .dev-controls[data-dock="right"] { top: 0; right: auto; left: calc(100% + 12px); }
        .dev-controls[data-dock="left"] { top: 0; left: auto; right: calc(100% + 12px); }
        .dev-controls[data-dock="below"] { top: calc(100% + 12px); right: 0; max-width: 100%; }

        .dev-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 10px 6px 16px;
        }
        .dev-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.005em;
        }

        .dev-close-btn,
        .dev-icon-btn {
          display: grid;
          place-items: center;
          width: 28px;
          height: 28px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: none;
          color: var(--dev-fg-2);
          cursor: pointer;
          transition: background-color 0.15s ease, color 0.15s ease;
          --mdc-icon-size: 16px;
        }
        .dev-close-btn:hover,
        .dev-icon-btn:hover {
          background: var(--dev-fill-hover);
          color: var(--dev-fg);
        }

        .dev-body {
          flex: 1;
          min-height: 0;
          overflow-y: auto;
          padding: 0 16px;
          scrollbar-width: thin;
        }

        .dev-section {
          padding: 12px 0;
          border-top: 1px solid var(--dev-line);
        }
        .dev-section:first-child { border-top: none; padding-top: 4px; }

        .dev-section-label {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 600;
          line-height: 14px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--dev-fg-2);
        }
        .dev-section-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: -6px 0 2px;
        }
        .dev-section-head .dev-section-label { margin: 0; }

        .dev-selector {
          width: 100%;
          height: 32px;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 8px;
          background-color: var(--dev-fill);
          color: var(--dev-fg);
          font: inherit;
          cursor: pointer;
        }
        .dev-selector:focus-visible {
          outline: 2px solid var(--dev-accent);
          outline-offset: 1px;
        }
        .dev-selector:disabled { opacity: 0.4; cursor: default; }

        .dev-time-controls {
          display: grid;
          grid-template-columns: auto 1fr;
          align-items: center;
          gap: 12px;
        }
        .dev-check {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          cursor: pointer;
        }

        .dev-controls input[type="checkbox"],
        .dev-controls input[type="range"] {
          accent-color: var(--dev-accent);
          margin: 0;
        }
        .dev-controls input[type="checkbox"] { width: 15px; height: 15px; cursor: pointer; }

        .dev-layers {
          display: grid;
          gap: 4px;
        }
        .dev-layer {
          display: grid;
          grid-template-columns: 15px 76px 1fr;
          align-items: center;
          gap: 10px;
          min-height: 24px;
        }
        .dev-layer label { cursor: pointer; }
        .dev-layer input[type="range"] { width: 100%; cursor: pointer; }
        .dev-layer input[type="range"]:disabled { opacity: 0.3; cursor: default; }

        .dev-performance-metrics {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px 16px;
          margin: 0;
        }
        .performance-metric { display: flex; flex-direction: column; gap: 2px; }
        .performance-metric dt {
          font-size: 11px;
          line-height: 14px;
          color: var(--dev-fg-2);
        }
        .performance-metric dd {
          margin: 0;
          font-size: 15px;
          font-weight: 500;
          line-height: 20px;
          font-variant-numeric: tabular-nums;
        }
        .metric-good { color: #74e0a8; }
        .metric-warning { color: #f7cf6a; }
        .metric-critical { color: #ff9b94; }

        .dev-actions {
          display: flex;
          gap: 8px;
          padding: 12px 16px 14px;
          border-top: 1px solid var(--dev-line);
        }
        .dev-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex: 1 1 auto;
          height: 34px;
          padding: 0 12px;
          white-space: nowrap;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          background: var(--dev-fill);
          color: var(--dev-fg);
          font: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.15s ease;
          --mdc-icon-size: 16px;
        }
        .dev-btn:hover { background: var(--dev-fill-hover); }
        .dev-btn:focus-visible,
        .dev-toggle-btn:focus-visible,
        .dev-close-btn:focus-visible,
        .dev-icon-btn:focus-visible {
          outline: 2px solid var(--dev-accent);
          outline-offset: 1px;
        }
        .dev-pause-btn { flex: 0 0 34px; padding: 0; }
        .dev-pause-btn[aria-pressed="true"] {
          background: var(--dev-accent);
          border-color: transparent;
          color: #0b1220;
        }
`;
