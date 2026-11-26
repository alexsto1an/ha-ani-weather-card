"use strict";(()=>{var E={windSpeed:2,rainCount:1,leafCount:1,snowCount:1,cloudBaseSize:1,cloudCount:3,splashBounce:80},a2={windSpeed:[.1,15],rainCount:[.1,10],leafCount:[.1,10],snowCount:[.1,10],cloudBaseSize:[.3,2.5],cloudCount:[1,20],splashBounce:[40,120]};var A2=H=>`
        ${H} ha-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: var(--mdc-icon-size, 24px);
          height: var(--mdc-icon-size, 24px);
          vertical-align: middle;
        }
`;var J=()=>`
${A2(".card-config")}
        .card-config {
          --awc-drawer: cubic-bezier(0.32, 0.72, 0, 1);
          --awc-in: cubic-bezier(0.25, 1, 0.5, 1);
          --awc-out: cubic-bezier(0.5, 0, 0.75, 0);
          --awc-press: cubic-bezier(0.23, 1, 0.32, 1);
          display: block;
          /* Room of its own either side: an open header's tint and a row's hover reach 8 px past the rows, and
             Home Assistant's editor column clips what leaves this box */
          padding: 0 8px 8px;
          color: var(--primary-text-color);
          font-size: 14px;
          line-height: 20px;
        }
        /* Whatever display a rule gives an element, hidden hides it */
        .card-config [hidden] { display: none !important; }
        /* A drawing never plays a reveal */
        .card-config[data-instant] *, .card-config[data-instant] *::before { transition: none !important; }
        .card-config .vh {
          position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden;
          clip: rect(0 0 0 0); white-space: nowrap; border: 0;
        }

        /* \u2500\u2500 Reveals: every row, section and drawer opens by its grid track \u2500\u2500 */
        .rv {
          display: grid;
          /* The one column never grows past the editor, whatever a row inside would like to be */
          grid-template-columns: minmax(0, 1fr);
          grid-template-rows: 0fr;
          visibility: hidden;
          transition: grid-template-rows 160ms var(--awc-drawer), visibility 0s linear 160ms;
        }
        .rv > .rv-in {
          min-height: 0;
          overflow: hidden;
          opacity: 0;
          /* Room either side for focus rings and an open header's tint, at no height */
          padding-inline: 8px;
          margin-inline: -8px;
          transition: opacity 80ms var(--awc-out);
        }
        /* Open inherits, so a row inside a closed drawer stays out of reach */
        .rv[data-open] {
          grid-template-rows: 1fr;
          visibility: inherit;
          transition: grid-template-rows 220ms var(--awc-drawer), visibility 0s;
        }
        .rv[data-open] > .rv-in {
          opacity: 1;
          transition: opacity 160ms var(--awc-in) 30ms;
        }
        /* Opened and still: nothing's clipped, so a menu or a focus ring inside shows whole */
        .rv[data-open][data-settled] > .rv-in { overflow: visible; }
        /* Rows carry their own space, so a closed one takes none */
        .row { padding-top: 8px; }
        .row > ha-select, .row > ha-entity-picker, .row > ha-input, .row > ha-textfield { display: block; width: 100%; }

        /* \u2500\u2500 The switch \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .top { padding: 4px 0 0; }
        .top .sw-l { font-weight: 500; }

        /* \u2500\u2500 Sections: a hairline where each starts, and a heading a step above its rows' labels, no box.
           The rule is the section's own, so a hidden section leaves none behind \u2500\u2500 */
        .grp-b {
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
        }
        .grp-h {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 4px;
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
          color: var(--primary-text-color);
        }
        /* Each section's and drawer's icon: quiet, and in the accent on an open drawer */
        .sec-i {
          flex: none;
          width: 20px;
          height: 20px;
          fill: var(--secondary-text-color);
          transition: fill 200ms var(--awc-press);
        }
        .drw-btn[aria-expanded="true"] > .sec-i { fill: var(--primary-color); }
        /* After the drawers, while they show, the last one's hairline is this section's */
        .drws[data-open] ~ [data-sec="dev"] .grp-b { margin-top: 0; padding-top: 8px; border-top: 0; }

        /* \u2500\u2500 Drawers: hairlines, a title and what's inside, a chevron \u2500\u2500\u2500\u2500\u2500\u2500 */
        /* A hairline above the drawers and under each, so a hidden one leaves none behind */
        .drws-b { margin-top: 20px; border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); }
        .drw-b { border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); }
        .drw-h { margin: 0; font: inherit; }
        .drw-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
          isolation: isolate;
          width: calc(100% + 16px);
          min-height: 56px;
          margin: 4px -8px;
          padding: 8px;
          border: 0;
          border-radius: 8px;
          background: none;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .drw-tx { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .drw-t { font-size: 16px; line-height: 24px; font-weight: 500; }
        /* Open, a drawer's header is lit the way the editor lights whatever is chosen (a segment, a preset): the
           accent's tint behind it. It marks where the drawer starts and that it's open; its rows follow, and the
           hairline closes it. No box, and no fill behind the rows, which would dim their quiet text */
        .drw-btn::after, .rd-head::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: var(--primary-color);
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms var(--awc-press);
        }
        .drw-btn[aria-expanded="true"]::after { opacity: 0.14; }
        /* A reading opens inside an open drawer, so its tint is the quieter of the two */
        .rd-head[aria-expanded="true"]::after { opacity: 0.08; }
        /* On the tint the quiet line takes the text's colour, to keep its contrast */
        .drw-btn[aria-expanded="true"] .drw-s, .rd-head[aria-expanded="true"] .rd-s { color: var(--primary-text-color); }
        [aria-expanded="true"] > .chev { fill: var(--primary-text-color); }
        .drw-s {
          font-size: 13px;
          line-height: 18px;
          color: var(--secondary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .drw-in { padding: 8px 0 24px; }
        .drw-in > .rv:first-child .row { padding-top: 0; }
        /* Drawers appearing with the switch fade in one after another */
        .drw[data-open] > .rv-in { transition-delay: calc(30ms + var(--i, 0) * 16ms); }
        /* A drawer's own content opens a touch slower: there's more of it */
        .drw-c { transition-duration: 200ms, 0s; transition-delay: 0s, 200ms; }
        .drw-c > .rv-in { transition-duration: 90ms; }
        .drw-c[data-open] { transition-duration: 260ms, 0s; transition-delay: 0s; }
        .drw-c[data-open] > .rv-in { transition: opacity 180ms var(--awc-in) 40ms; }

        .chev {
          flex: none;
          width: 20px;
          height: 20px;
          fill: var(--secondary-text-color);
          transition: transform 200ms var(--awc-in);
        }
        [aria-expanded="true"] > .chev { transform: rotate(180deg); transition-duration: 260ms; }

        /* Hover and press: a layer of the text's own colour, right in either theme */
        .drw-btn::before, .rd-head::before, .tb::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: currentColor;
          opacity: 0;
          pointer-events: none;
          transition: opacity 180ms var(--awc-press);
        }
        @media (hover: hover) {
          .drw-btn:hover::before, .rd-head:hover::before, .tb:not(:disabled):hover::before { opacity: 0.05; transition-duration: 110ms; }
        }
        .drw-btn:active::before, .rd-head:active::before, .tb:not(:disabled):active::before { opacity: 0.1; transition-duration: 60ms; }
        .drw-btn:focus-visible, .rd-head:focus-visible, .tb:focus-visible {
          outline: 2px solid var(--primary-color);
          outline-offset: -2px;
        }

        /* \u2500\u2500 Switch rows: a short name, one quiet line, the switch \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .sw {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          min-height: 48px;
          cursor: pointer;
          user-select: none;
        }
        .sw-t { display: flex; flex-direction: column; min-width: 0; padding: 4px 0; }
        .sw-l { font-size: 14px; line-height: 20px; color: var(--primary-text-color); }
        .sw-h, .help {
          font-size: 12px;
          line-height: 16px;
          color: var(--secondary-text-color);
        }
        .help { margin: 6px 16px 0; }
        .seg .help { margin-left: 0; }
        .row > .help:first-child { margin: 0; }
        .sub-h {
          margin: 8px 0 4px;
          font-size: 13px;
          line-height: 18px;
          font-weight: 500;
          color: var(--secondary-text-color);
        }
        .drw-in > .rv:first-child .sub-h { margin-top: 0; }
        .sub-h + .help { margin: -2px 0 6px; }

        /* \u2500\u2500 A choice of two or three: segments \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .seg { min-width: 0; margin: 4px 0 0; padding: 0; border: 0; }
        .seg-l { padding: 0; margin: 0 0 6px; font-size: 14px; line-height: 20px; }
        .seg-track {
          display: flex;
          gap: 2px;
          padding: 3px;
          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
          border-radius: 10px;
        }
        .seg-track label { position: relative; flex: 1 1 0; min-width: 0; cursor: pointer; }
        .seg-track input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }
        .seg-track span {
          position: relative;
          isolation: isolate;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 6px;
          border-radius: 7px;
          font-size: 13px;
          line-height: 16px;
          font-weight: 500;
          text-align: center;
          color: var(--secondary-text-color);
          pointer-events: none;
          transition: color 120ms var(--awc-press), box-shadow 120ms var(--awc-press);
        }
        .seg-track span::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: var(--primary-color);
          opacity: 0;
          transition: opacity 120ms var(--awc-press);
        }
        @media (hover: hover) {
          .seg-track input:not(:checked):hover + span::before { opacity: 0.06; }
        }
        .seg-track input:checked + span {
          color: var(--primary-text-color);
          box-shadow: inset 0 0 0 1px var(--primary-color);
        }
        .seg-track input:checked + span::before { opacity: 0.14; }
        .seg-track input:focus-visible + span { outline: 2px solid var(--primary-color); outline-offset: 1px; }

        /* \u2500\u2500 Start from: the presets, a small drawing of each layout \u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .pre { min-width: 0; margin: 0; padding: 0; border: 0; }
        /* Four across at most, so seven sit four over three; fewer where a tile would go under 76 px */
        .pre-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(max(76px, calc((100% - 18px) / 4)), 1fr)); gap: 6px; }
        .pre-t { position: relative; min-width: 0; cursor: pointer; }
        .pre-t input {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          opacity: 0;
          cursor: pointer;
        }
        .pre-c {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 4px 7px;
          border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3));
          border-radius: 10px;
          color: var(--secondary-text-color);
          pointer-events: none;
          transition: color 120ms var(--awc-press), border-color 120ms var(--awc-press);
        }
        .pre-c::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          border-radius: inherit;
          background: var(--primary-color);
          opacity: 0;
          transition: opacity 120ms var(--awc-press);
        }
        @media (hover: hover) {
          .pre-t input:not(:checked):hover + .pre-c::before { opacity: 0.06; }
        }
        .pre-t input:checked + .pre-c { color: var(--primary-text-color); border-color: var(--primary-color); }
        .pre-t input:checked + .pre-c::before { opacity: 0.14; }
        .pre-t input:focus-visible + .pre-c { outline: 2px solid var(--primary-color); outline-offset: 1px; }
        .pre-n { font-size: 13px; line-height: 16px; font-weight: 500; text-align: center; }
        .pre-art { display: block; width: 100%; max-width: 64px; height: auto; }
        .pre-art .card { fill: var(--primary-color); fill-opacity: 0.18; }
        .pre-art .ink { fill: currentColor; fill-opacity: 0.85; }
        .pre-art .q { fill: currentColor; fill-opacity: 0.45; }
        .pre-art .bar { fill: currentColor; fill-opacity: 0.3; }
        .pre-art .sun { fill: currentColor; fill-opacity: 0.3; }
        .pre-art .line { fill: none; stroke: currentColor; stroke-opacity: 0.7; stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
        /* The nightstand's own night: black, and its red */
        .pre-art .night { fill: #0b0b0c; stroke: currentColor; stroke-opacity: 0.25; stroke-width: 1; }
        .pre-art .red { fill: #c21f17; }
        .pre-art .red-q { fill: #eb261c; fill-opacity: 0.7; }
        .pre .help { margin: 8px 0 0; }
        .pre .why { margin-top: 6px; }

        /* \u2500\u2500 Why something doesn't apply, and what's missing \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .why, .status {
          display: flex;
          gap: 8px;
          margin: 0;
          font-size: 13px;
          line-height: 18px;
          color: var(--secondary-text-color);
        }
        .status { margin-top: 8px; color: var(--primary-text-color); }
        .ico, .ico-warn { flex: none; width: 18px; height: 18px; fill: currentColor; }
        .status .ico { fill: var(--warning-color, #b26a00); }

        /* \u2500\u2500 Text buttons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .tb {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 36px;
          padding: 0 12px;
          border: 0;
          border-radius: 8px;
          background: none;
          color: var(--primary-color);
          font: inherit;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .tb:disabled { color: var(--disabled-text-color, rgba(127, 127, 127, 0.6)); cursor: default; }
        .tb[data-off] { visibility: hidden; }
        .reset-engine-btn[data-off], .reset-colors-btn[data-off] { display: none; }
        .reset-engine-btn, .reset-colors-btn { margin: 8px 0 0 -12px; }
        .tb svg { width: 18px; height: 18px; fill: currentColor; }

        /* \u2500\u2500 Pairs of numbers side by side \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; }

        /* \u2500\u2500 The readings: one line each, opened in place \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .readings-table { display: grid; }
        .rd-list { border-top: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); }
        .rd-row { border-bottom: 1px solid var(--divider-color, rgba(127, 127, 127, 0.3)); }
        .rd-head {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          box-sizing: border-box;
          isolation: isolate;
          width: calc(100% + 16px);
          min-height: 48px;
          margin: 3px -8px;
          padding: 4px 8px;
          border: 0;
          border-radius: 8px;
          background: none;
          color: inherit;
          font: inherit;
          text-align: left;
          cursor: pointer;
        }
        .rd-tx { display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .rd-t { font-size: 14px; line-height: 20px; }
        /* The open reading: its name a weight up, and room around its controls */
        .rd-head[aria-expanded="true"] .rd-t { font-weight: 500; }
        .rd-body .rd-fields { padding: 6px 0 12px; }
        .rd-s {
          display: flex;
          align-items: center;
          gap: 4px;
          min-width: 0;
          font-size: 12px;
          line-height: 16px;
          color: var(--secondary-text-color);
        }
        .rd-s span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .rd-s .ico-warn { width: 14px; height: 14px; fill: var(--warning-color, #b26a00); }
        .rd-fields { display: grid; gap: 8px; padding: 4px 0 8px; }
        .rd-fields ha-select, .rd-fields ha-entity-picker, .rd-fields ha-input, .rd-fields ha-textfield { display: block; width: 100%; }
        .rd-note, .rd-warn { margin: 0; font-size: 12px; line-height: 16px; color: var(--secondary-text-color); }
        .rd-warn { color: var(--primary-text-color); }
        .rd-foot { display: flex; flex-wrap: wrap; align-items: center; margin: 0 -12px; }
        .rd-foot .rd-remove { margin-left: auto; color: var(--error-color, #db4437); }
        .rd-add { margin: 4px 0 0 -12px; justify-self: start; }
        @keyframes awc-moved { from { background-color: var(--secondary-background-color, rgba(127, 127, 127, 0.15)); } to { background-color: transparent; } }
        .rd-row[data-moved] { animation: awc-moved 700ms cubic-bezier(0.37, 0, 0.63, 1); }
        [data-levels-for] { padding-top: 8px; }

        /* \u2500\u2500 Amounts: styled sliders, filled to their value \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .amt {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 10px 24px;
        }
        .amt-o {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: baseline;
          column-gap: 8px;
        }
        .amt-o label { font-size: 14px; line-height: 20px; }
        .amt-o output {
          font-size: 13px;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          color: var(--secondary-text-color);
        }
        .amt-o input[type="range"] {
          grid-column: 1 / -1;
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 28px;
          margin: 0;
          background: transparent;
          cursor: pointer;
        }
        .amt-o input[type="range"]::-webkit-slider-runnable-track {
          height: 4px;
          border-radius: 2px;
          background: linear-gradient(to right, var(--primary-color) var(--fill, 50%), var(--divider-color, rgba(127, 127, 127, 0.3)) var(--fill, 50%));
        }
        .amt-o input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          margin-top: -8px;
          border: 2px solid var(--card-background-color, #fff);
          border-radius: 50%;
          background: var(--primary-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .amt-o input[type="range"]::-moz-range-track { height: 4px; border-radius: 2px; background: var(--divider-color, rgba(127, 127, 127, 0.3)); }
        .amt-o input[type="range"]::-moz-range-progress { height: 4px; border-radius: 2px; background: var(--primary-color); }
        .amt-o input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: 2px solid var(--card-background-color, #fff);
          border-radius: 50%;
          background: var(--primary-color);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }
        .amt-o input[type="range"]:focus-visible { outline: none; }
        .amt-o input[type="range"]:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color); }
        .amt-o input[type="range"]:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 2px var(--card-background-color, #fff), 0 0 0 4px var(--primary-color); }

        /* \u2500\u2500 Colours: chips with a ring that holds on either theme \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
          gap: 2px 24px;
        }
        .swc {
          display: grid;
          grid-template-columns: 32px 1fr auto;
          align-items: center;
          gap: 12px;
          min-height: 44px;
        }
        .swc label { font-size: 14px; cursor: pointer; }
        .chip {
          position: relative;
          display: block;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--c, transparent);
          box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127, 127, 127, 0.3));
        }
        /* The text's and the weather's colours, shown on the sky they're seen over */
        .chip.ink { background: var(--sky, transparent); }
        .chip.ink::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 12px;
          height: 12px;
          margin: -6px 0 0 -6px;
          border-radius: 50%;
          background: var(--c, transparent);
        }
        .chip.ink-temperature::after, .chip.ink-text::after {
          content: "Aa";
          width: auto;
          height: auto;
          margin: 0;
          transform: translate(-50%, -50%);
          border-radius: 0;
          background: none;
          color: var(--c, currentColor);
          font-size: 13px;
          line-height: 1;
          font-weight: 600;
        }
        .chip input[type="color"] {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          border: 0;
          opacity: 0;
          cursor: pointer;
        }
        .chip:focus-within { outline: 2px solid var(--primary-color); outline-offset: 2px; }
        .color-reset { padding: 0 8px; margin-right: -8px; font-size: 13px; }

        /* \u2500\u2500 The card's own tap action, beside Home Assistant's picker \u2500\u2500\u2500\u2500\u2500 */
        .card-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 48px;
        }
        .card-action-choice { margin-bottom: 8px; }
        .card-action-reset {
          position: relative;
          min-height: 36px;
          padding: 0 12px;
          margin-right: -12px;
          border: 0;
          border-radius: 8px;
          background: none;
          color: var(--primary-color);
          font: inherit;
          font-weight: 500;
          cursor: pointer;
        }

        /* \u2500\u2500 On a phone: a little more room for every control \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
        @media (pointer: coarse) {
          .tb { min-height: 40px; }
        }

        /* \u2500\u2500 Reduced motion: nothing slides; opening dissolves, closing is instant \u2500\u2500 */
        @media (prefers-reduced-motion: reduce) {
          .rv, .rv[data-open], .rv > .rv-in, .drw-btn::after, .rd-head::after, .drw-c, .drw-c[data-open], .drw-c > .rv-in, .chev, [aria-expanded="true"] > .chev { transition: none !important; }
          .rv[data-open] > .rv-in, .drw-c[data-open] > .rv-in, .drw[data-open] > .rv-in { transition: opacity 120ms linear !important; }
          .rd-row[data-moved] { animation-duration: 500ms; }
        }
`;var C5={sunny:{top:[.445,.13,256],mid:[.495,.125,250],bottom:[.575,.11,238],glow:[.88,.08,218],glowAlpha:.45,overcast:0},"partly-cloudy":{top:[.445,.1,254],mid:[.495,.092,248],bottom:[.565,.08,240],glow:[.88,.07,220],glowAlpha:.36,overcast:.25},windy:{top:[.445,.115,244],mid:[.495,.105,236],bottom:[.565,.09,222],glow:[.95,.05,200],glowAlpha:.3,overcast:.1},cloudy:{top:[.43,.026,250],mid:[.475,.025,248],bottom:[.53,.024,244],glow:[.86,.016,250],glowAlpha:.28,overcast:.8},foggy:{top:[.44,.014,212],mid:[.48,.013,214],bottom:[.53,.012,218],glow:[.88,.01,210],glowAlpha:.3,overcast:.9},"light-rain":{top:[.42,.034,246],mid:[.48,.032,243],bottom:[.53,.03,238],glow:[.82,.02,246],glowAlpha:.22,overcast:.85},rainy:{top:[.37,.032,248],mid:[.43,.032,244],bottom:[.48,.03,240],glow:[.78,.02,246],glowAlpha:.18,overcast:.9},pouring:{top:[.3,.03,250],mid:[.36,.031,246],bottom:[.41,.03,242],glow:[.72,.02,248],glowAlpha:.14,overcast:1},stormy:{top:[.26,.032,280],mid:[.31,.034,272],bottom:[.36,.034,262],glow:[.7,.03,280],glowAlpha:.14,overcast:1},snowy:{top:[.45,.04,238],mid:[.495,.036,234],bottom:[.55,.03,228],glow:[.93,.02,230],glowAlpha:.32,overcast:.7},"snowy-rainy":{top:[.44,.036,240],mid:[.49,.033,236],bottom:[.54,.03,232],glow:[.86,.02,236],glowAlpha:.24,overcast:.85},sleety:{top:[.42,.042,258],mid:[.47,.04,252],bottom:[.52,.036,246],glow:[.84,.024,252],glowAlpha:.22,overcast:.85},"snowy-stormy":{top:[.3,.04,266],mid:[.35,.04,260],bottom:[.4,.038,252],glow:[.74,.026,260],glowAlpha:.14,overcast:1},"sleety-stormy":{top:[.28,.042,284],mid:[.33,.042,276],bottom:[.38,.04,266],glow:[.72,.03,280],glowAlpha:.14,overcast:1},"clear-night":{top:[.2,.045,272],mid:[.25,.052,266],bottom:[.31,.055,256],glow:[.86,.03,250],glowAlpha:.16,overcast:0}},d2=(H,M,C)=>Math.min(M,Math.max(H,C)),$=(H,M,C)=>H+(M-H)*C;function H5(H,M,C){let V=(M-H+540)%360-180;return(H+V*C+360)%360}function W(H,M,C){let V=([l,s,u])=>[l,s*Math.cos(u*Math.PI/180),s*Math.sin(u*Math.PI/180)],[e,L,i]=V(H),[t,A,v]=V(M),r=$(e,t,C),o=$(L,A,C),p=$(i,v,C),m=Math.hypot(o,p),c=m<1e-6?H[2]:(Math.atan2(p,o)*180/Math.PI+360)%360;return[r,m,c]}function D1([H,M,C]){let V=C*Math.PI/180,e=M*Math.cos(V),L=M*Math.sin(V),i=(H+.3963377774*e+.2158037573*L)**3,t=(H-.1055613458*e-.0638541728*L)**3,A=(H-.0894841775*e-1.291485548*L)**3;return[4.0767416621*i-3.3077115913*t+.2309699292*A,-1.2684380046*i+2.6097574011*t-.3413193965*A,-.0041960863*i-.7034186147*t+1.707614701*A]}var V5=H=>H<=.0031308?12.92*H:1.055*Math.pow(H,1/2.4)-.055;function G(H){let M=V=>V.every(e=>e>=-1e-4&&e<=1.0001),C=D1(H);if(!M(C)){let V=0,e=H[1];for(let L=0;L<24;L++){let i=(V+e)/2;M(D1([H[0],i,H[2]]))?V=i:e=i}C=D1([H[0],V,H[2]])}return C.map(V=>V5(d2(0,1,V)))}var p2=H=>Math.round(d2(0,1,H)*255);function C1(H){return"#"+H.map(M=>p2(M).toString(16).padStart(2,"0")).join("")}function n2(H,M){return`rgba(${H.map(p2).join(", ")}, ${Number(M.toFixed(3))})`}function N1(H,M){return[.15+(H[0]-.15)*.42,H[1]*$(.75,.5,M),H5(H[2],262,.45)]}function L5(H,M){let C=C5[H],V=1-C.overcast*.7,e={top:C.top,mid:C.mid,bottom:C.bottom,glow:C.glow,glowAlpha:C.glowAlpha,scrimAlpha:$(.46,.28,C.overcast)};if(H==="clear-night"){if(M==="dawn"||M==="dusk"){let L=M==="dawn"?[.4,.09,20]:[.38,.1,40];return{...e,bottom:W(C.bottom,L,.45),glowAlpha:.2,scrimAlpha:.22}}return{...e,scrimAlpha:.2}}switch(M){case"night":return{top:N1(C.top,C.overcast),mid:N1(C.mid,C.overcast),bottom:N1(C.bottom,C.overcast),glow:[.86,.03,250],glowAlpha:$(.14,.06,C.overcast),scrimAlpha:.2};case"dusk":return{top:W(C.top,[C.top[0]*.8,.075,292],.5*V),mid:W(C.mid,[C.mid[0]*.88,.065,350],.42*V),bottom:W(C.bottom,[C.bottom[0]*.92,.115,52],.72*V),glow:W(C.glow,[.82,.13,58],V),glowAlpha:$(C.glowAlpha,.6,V*.6),scrimAlpha:e.scrimAlpha+.04};case"dawn":return{top:W(C.top,[C.top[0]*.95,C.top[1]*.85,262],.4*V),mid:W(C.mid,[C.mid[0]*.95,.05,330],.3*V),bottom:W(C.bottom,[C.bottom[0]*.95,.085,32],.62*V),glow:W(C.glow,[.88,.09,40],V),glowAlpha:$(C.glowAlpha,.5,V*.5),scrimAlpha:e.scrimAlpha+.04};default:return e}}function M5(H){return[.16,Math.min(.04,H[1]*.6),H[2]]}function U(H,M){let C=L5(H,M);return{top:C1(G(C.top)),mid:C1(G(C.mid)),bottom:C1(G(C.bottom)),glow:n2(G(C.glow),C.glowAlpha),scrim:n2(G(M5(C.top)),C.scrimAlpha)}}var W1=[.985,.006,250];var e5={"--awc-sky-top":"#3b5f8c","--awc-sky-mid":"#4a6d99","--awc-sky-bottom":"#5a7ba3","--awc-sky-glow":"rgba(0, 0, 0, 0)","--awc-sky-scrim":"rgba(0, 0, 0, 0)","--weather-sun-primary":"#ffd67a","--weather-sun-secondary":"#ffb547","--weather-sun-glow":"rgba(255, 214, 140, 0.55)","--weather-sun-halo":"rgba(255, 214, 140, 0.24)","--awc-cloud-far":"rgba(214, 226, 242, 0.85)","--awc-cloud-mid":"rgba(232, 239, 248, 0.92)","--awc-cloud-near":"rgba(248, 250, 253, 0.96)"},r5=Object.keys(e5),T5=r5.filter(H=>H.startsWith("--awc-sky-"));function t5(H,M=-1/0,C=1/0){return typeof H=="number"&&!isNaN(H)&&H>=M&&H<=C}function S(H){return H==null?"":String(H).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function y(H){let M=customElements.get("ha-input")||!customElements.get("ha-textfield")?"ha-input":"ha-textfield",{id:C,label:V,value:e,placeholder:L,hint:i,type:t,min:A,max:v,step:r}=H,o=[`id="${S(C)}"`,`label="${S(V)}"`,`value="${S(e)}"`,L?`placeholder="${S(L)}"`:"",t?`type="${t}"`:"",A!==void 0?`min="${A}"`:"",v!==void 0?`max="${v}"`:"",r!==void 0?`step="${r}"`:"",i?M==="ha-input"?`hint="${S(i)}"`:`helper="${S(i)}" helperPersistent`:""].filter(Boolean);return`<${M} ${o.join(" ")}></${M}>`}function I1(H,M,C){if(H?.localize)try{let V=H.localize(M);if(V&&V!==M)return V}catch{}return C}function f1(H){let M=H?.engine_settings;return!M||typeof M!="object"?!1:Object.keys(E).some(C=>{let V=M[C],[e,L]=a2[C];return t5(V,e,L)&&Math.abs(V-E[C])>1e-9})}function q(H){let M=H?.engine_mode;return M==="auto"||M==="manual"?M:f1(H)?"manual":"auto"}var i5=["humidity","wind","pressure","sun","uv","rain"],o5=["humidity","wind","pressure","sun"];function m2(H){let M=H.metrics,C=Array.isArray(M)?M:typeof M=="string"?M.split(","):null;if(!C)return[...o5];let V=[];for(let e of C){let L=String(e).trim().toLowerCase();i5.includes(L)&&!V.includes(L)&&V.push(L)}return V}var G1=["humidity","wind","pressure","sun","uv","rain","aqi","feels_like","dew_point","visibility","cloud_cover","gust","uv_max","rain_event","rain_week","rain_month","rain_year","sensor"],$1={humidity:"humidity",wind:"wind_speed",pressure:"pressure",uv:"uv_index",feels_like:"apparent_temperature",dew_point:"dew_point",visibility:"visibility",cloud_cover:"cloud_coverage",gust:"wind_gust_speed"},N=["uv_max","rain_event","rain_week","rain_month","rain_year"],m1=H=>H!=="sun"&&!Object.prototype.hasOwnProperty.call($1,H),l2=["humidity","wind","pressure","sun"],v2=H=>typeof H=="string"&&G1.includes(H),g1=H=>typeof H=="string"&&H.trim()?H.trim():void 0;function a5(H){if(typeof H=="string"){let A=H.trim().toLowerCase();return v2(A)?{type:A,view:N.includes(A)}:null}if(!H||typeof H!="object")return null;let M=H,C=typeof M.type=="string"?M.type.trim().toLowerCase():"";if(!v2(C))return null;let V={type:C,view:M.view===!0||N.includes(C)},e=g1(M.entity);e&&(V.entity=e);let L=g1(M.direction_entity);C==="wind"&&L&&(V.direction_entity=L);let i=g1(M.rate_entity);C==="rain"&&i&&(V.rate_entity=i);let t=g1(M.name);return t&&(V.name=t),V}function H1(H){let M=H.readings;if(Array.isArray(M))return M.map(a5).filter(L=>!!L);let C=[],V=L=>{let i=Object.fromEntries(Object.entries(L).filter(([,t])=>t!==void 0&&t!==""));C.push({...i,view:!!L.view||N.includes(L.type)})},e=m2(H);for(let L of e){if(L==="sun"){H.show_sun!==!1&&V({type:"sun"});continue}L==="humidity"?V({type:"humidity",entity:H.humidity_sensor_entity}):L==="wind"?V({type:"wind",entity:H.wind_speed_sensor_entity,direction_entity:H.wind_direction_sensor_entity}):L==="pressure"?V({type:"pressure",entity:H.pressure_sensor_entity}):L==="uv"?V({type:"uv",entity:H.uv_entity}):L==="rain"&&V({type:"rain",entity:H.rain_entity,rate_entity:H.rain_rate_entity})}!e.includes("wind")&&(H.wind_speed_sensor_entity||H.wind_direction_sensor_entity)&&V({type:"wind",entity:H.wind_speed_sensor_entity,direction_entity:H.wind_direction_sensor_entity,view:!0}),!e.includes("uv")&&H.uv_entity&&V({type:"uv",entity:H.uv_entity,view:!0}),!e.includes("rain")&&(H.rain_entity||H.rain_rate_entity)&&V({type:"rain",entity:H.rain_entity,rate_entity:H.rain_rate_entity,view:!0}),H.uv_max_entity&&V({type:"uv_max",entity:H.uv_max_entity});for(let L of["rain_event","rain_week","rain_month","rain_year"]){let i=H[`${L}_entity`];i&&V({type:L,entity:i})}return C}var O1=["metrics","show_sun","humidity_sensor_entity","wind_speed_sensor_entity","wind_direction_sensor_entity","pressure_sensor_entity","uv_entity","uv_max_entity","rain_entity","rain_rate_entity","rain_event_entity","rain_week_entity","rain_month_entity","rain_year_entity"];function x2(H){return H.map(M=>{let C=Object.entries(M).filter(([e,L])=>e!=="type"&&e!=="view"&&L!==void 0),V=M.view&&!N.includes(M.type);return!C.length&&!V?M.type:{type:M.type,...Object.fromEntries(C),...V?{view:!0}:{}}})}var y1=H=>H.length===l2.length&&H.every((M,C)=>M.type===l2[C]&&!M.view&&!M.entity&&!M.direction_entity&&!M.rate_entity&&!M.name);function A5(H,M){H.hasAttribute("data-open")!==M&&(H.toggleAttribute("data-open",M),M?setTimeout(()=>{H.hasAttribute("data-open")&&H.setAttribute("data-settled","")},300):H.removeAttribute("data-settled"))}var z1={humidity:"Humidity",wind:"Wind",pressure:"Pressure",sun:"Next sunset or sunrise",uv:"UV index",rain:"Rain",aqi:"Air quality (US EPA)",feels_like:"Feels like",dew_point:"Dew point",visibility:"Visibility",cloud_cover:"Cloud cover",gust:"Gusts",uv_max:"Today's highest UV",rain_event:"Rain this event",rain_week:"Rain this week",rain_month:"Rain this month",rain_year:"Rain this year",sensor:"Any sensor"},l1=H=>H.type==="sensor"&&H.name?H.name:z1[H.type],n5='<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>',s2='<svg class="ico-warn" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 1 21h22L12 2zm0 4.3L19.5 19h-15L12 6.3zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>',d5=0;function u2(H,M,C,V={}){let e,L=H1(M()),i=V.open??-1,t=++d5,A=()=>M().entity||"the weather entity",v=n=>Object.prototype.hasOwnProperty.call($1,n),r=n=>N.includes(n.type)||n.view,o=n=>v(n.type)?`Leave empty to use ${A()}`:n.type==="aqi"?"A sensor on the US EPA scale; Air quality levels move the bands":n.type==="sensor"?"Any entity: its name and its value":"A sensor";function p(n){if(m1(n.type)&&!n.entity)return{text:"Pick a sensor",warn:!0};let d=n.type==="sun"?`From ${M().sun_entity||"sun.sun"}`:n.entity||`From ${A()}`;return r(n)?M().show_forecast?{text:`In the forecast view \xB7 ${d}`,warn:!1}:{text:"In the forecast view, which needs the forecast on",warn:!0}:{text:d,warn:!1}}function m(){let n={readings:y1(L)?void 0:x2(L)};for(let d of O1)n[d]=void 0;C(n),o2()}function c(n,d,f,g){return`<ha-entity-picker class="${n}" label="${S(d)}" value="${S(f??"")}"${g?` helper="${S(g)}"`:""} allow-custom-entity></ha-entity-picker>`}function l(n,d){let f=N.includes(n.type),g=S(l1(n)),F=p(n),k=`rd-b-${t}-${d}`;return`<div class="rd-row" data-i="${d}" data-type="${n.type}" role="listitem">
            <button type="button" class="rd-head" aria-expanded="${d===i}" aria-controls="${k}">
              <span class="rd-tx"><span class="rd-t">${g}</span><span class="rd-s${F.warn?" warn":""}" data-text="${S(F.text)}">${F.warn?s2:""}<span>${S(F.text)}</span></span></span>${n5}
            </button>
            <div class="rv rd-body" id="${k}"${d===i?" data-open data-settled":""}><div class="rv-in"><div class="rd-fields">
              <ha-select class="rd-type" label="Type"></ha-select>
              ${n.type==="sun"?"":c("rd-entity",m1(n.type)?"Entity":"Entity (optional)",n.entity,o(n))}
              ${n.type==="wind"?c("rd-direction","Direction sensor (optional)",n.direction_entity):""}
              ${n.type==="rain"?c("rd-rate","Rain rate sensor (optional)",n.rate_entity,"Shown instead of today's rain while it rains"):""}
              ${n.type==="sensor"?y({id:`rd-name-${d}`,label:"Name (optional)",value:n.name,hint:"Else the entity's own name"}):""}
              ${m1(n.type)&&!n.entity?`<p class="rd-warn" role="status">Pick a sensor. Without one, this reading isn't shown.</p>`:""}
              ${f?'<p class="rd-note">Shown in the forecast view, when you tap the card.</p>':`<label class="sw rd-view"><span class="sw-t"><span class="sw-l">Only in the forecast view</span><span class="sw-h">Shown when you tap the card, not on it</span></span><ha-switch class="rd-view-switch"${n.view?" checked":""}></ha-switch></label>`}
              <div class="rd-foot">
                <button type="button" class="tb rd-btn rd-up" aria-label="Move ${g} up"${d===0?" disabled":""}>Move up</button>
                <button type="button" class="tb rd-btn rd-down" aria-label="Move ${g} down"${d===L.length-1?" disabled":""}>Move down</button>
                <button type="button" class="tb rd-btn rd-remove" aria-label="Remove ${g}">Remove</button>
              </div>
            </div></div></div>
          </div>`}function s(n){i=n,V.onOpen?.(n),H.querySelectorAll(".rd-row").forEach(d=>{let f=Number(d.dataset.i)===n;d.querySelector(".rd-head")?.setAttribute("aria-expanded",String(f));let g=d.querySelector(".rd-body");g&&A5(g,f)})}function u(){i>=L.length&&(i=-1),H.innerHTML=`<div class="rd-list" role="list" aria-label="Readings">${L.map(l).join("")}</div>
            <button type="button" class="tb rd-add"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6z"/></svg>Add a reading</button>`,H.querySelectorAll(".rd-row").forEach(n=>S1(n,Number(n.dataset.i))),H.querySelector(".rd-add").addEventListener("click",()=>{let d=typeof(e?.states[M().entity??""]?.attributes??{}).uv_index=="number"&&!L.some(f=>f.type==="uv")?"uv":"rain";L=[...L,{type:d,view:!1}],i=L.length-1,V.onOpen?.(i),m(),u(),H.querySelector(".rd-row:last-child .rd-type")?.focus()}),i2()}function T(n,d){let f=p(d),g=n.querySelector(".rd-s"),F=n.querySelector(".rd-t");F&&F.textContent!==l1(d)&&(F.textContent=l1(d)),!(!g||g.dataset.text===f.text&&g.classList.contains("warn")===f.warn)&&(g.dataset.text=f.text,g.classList.toggle("warn",f.warn),g.innerHTML=`${f.warn?s2:""}<span></span>`,g.querySelector("span").textContent=f.text)}function S1(n,d){n.querySelector(".rd-head")?.addEventListener("click",()=>s(i===d?-1:d));let f=n.querySelector(".rd-type");if(f){let k=()=>{f.options=G1.map(x=>({value:x,label:N.includes(x)?`${z1[x]}, in the forecast view`:z1[x]})),f.value=L[d].type};customElements.get("ha-select")?k():customElements.whenDefined("ha-select").then(k),f.addEventListener("selected",(x=>{let O=x.detail?.value;if(!O||O===L[d].type)return;let B=L[d].entity&&(v(O)||!L[d].entity.startsWith("weather."))?L[d].entity:void 0;L=L.map((R,h1)=>h1===d?{type:O,view:N.includes(O)||R.view&&!N.includes(R.type),...B?{entity:B}:{}}:R),m(),u(),H.querySelector(`.rd-row[data-i="${d}"] .rd-type`)?.focus()})),f.addEventListener("closed",x=>x.stopPropagation())}let g=(k,x)=>{n.querySelector(k)?.addEventListener("value-changed",(O=>{let B=String(O.detail?.value??"").trim(),R=!!L[d].entity;L=L.map((h1,J2)=>{if(J2!==d)return h1;let E1={...h1};return B?E1[x]=B:delete E1[x],E1}),m(),x==="entity"&&m1(L[d].type)&&R!==!!B?u():T(n,L[d])}))};g(".rd-entity","entity"),g(".rd-direction","direction_entity"),g(".rd-rate","rate_entity"),n.querySelector(`[id="rd-name-${d}"]`)?.addEventListener("change",k=>{let x=String(k.target.value??"").trim();L=L.map((O,B)=>{if(B!==d)return O;let R={...O};return x?R.name=x:delete R.name,R}),m(),T(n,L[d])}),n.querySelector(".rd-view-switch")?.addEventListener("change",k=>{let x=!!k.target.checked;L=L.map((O,B)=>B===d?{...O,view:x}:O),m(),T(n,L[d])});let F=k=>{let x=d+k;if(x<0||x>=L.length)return;let O=[...L];[O[d],O[x]]=[O[x],O[d]],L=O,i=x,V.onOpen?.(x),m(),u();let B=H.querySelector(`.rd-row[data-i="${x}"]`);B?.setAttribute("data-moved","");let R=B?.querySelector(k<0?".rd-up":".rd-down");(R&&!R.disabled?R:B?.querySelector(k<0?".rd-down":".rd-up"))?.focus()};n.querySelector(".rd-up")?.addEventListener("click",()=>F(-1)),n.querySelector(".rd-down")?.addEventListener("click",()=>F(1)),n.querySelector(".rd-remove")?.addEventListener("click",()=>{L=L.filter((x,O)=>O!==d),i=-1,V.onOpen?.(-1),m(),u();let k=H.querySelectorAll(".rd-head");(k[Math.min(d,k.length-1)]??H.querySelector(".rd-add"))?.focus()})}function i2(){H.querySelectorAll(".rd-row").forEach(n=>{let d=L[Number(n.dataset.i)];if(!d)return;let f=(g,F,k)=>{let x=n.querySelector(g);x&&(e&&(x.hass=e),x.includeDomains=k,x.value=F??"")};f(".rd-entity",d.entity,d.type==="sensor"?void 0:v(d.type)?["sensor","weather"]:["sensor"]),f(".rd-direction",d.direction_entity,["sensor"]),f(".rd-rate",d.rate_entity,["sensor"])})}function o2(){H.parentElement?.querySelectorAll("[data-levels-for]").forEach(d=>{d.hidden=!L.some(f=>f.type===d.dataset.levelsFor)})}return u(),o2(),{hass(n){e=n,i2()},sync(){H.querySelectorAll(".rd-row").forEach(n=>{let d=L[Number(n.dataset.i)];d&&T(n,d)})}}}var Z2=H=>H==null?void 0:String(H);function V1(H){return`<div class="place-fields">
        ${y({id:"latitude",label:"Latitude",type:"number",min:-90,max:90,step:"any",value:Z2(H.latitude)})}
        ${y({id:"longitude",label:"Longitude",type:"number",min:-180,max:180,step:"any",value:Z2(H.longitude)})}
        ${y({id:"time_zone",label:"Time zone",value:H.time_zone,hint:"For weather in another place, such as -33.87, 151.21 and Australia/Sydney: the coordinates give the card that place's sun, and its times are shown in its time zone"})}
    </div>`}function L1(H,M){for(let C of["latitude","longitude"])H.querySelector(`#${C}`)?.addEventListener("change",V=>{let e=V.target.value.trim(),L=parseFloat(e);M({[C]:e&&isFinite(L)?L:void 0})});H.querySelector("#time_zone")?.addEventListener("change",C=>{M({time_zone:C.target.value.trim()||void 0})})}var M1=`
    .place-fields { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 12px; }
    .place-fields > :last-child { grid-column: 1 / -1; }
`;function v1(H){return H&&typeof H=="object"&&typeof H.action=="string"?H:void 0}function e1(H,M){return{entity:M,tap_action:v1(H?.tap_action),hold_action:v1(H?.hold_action),double_tap_action:v1(H?.double_tap_action)}}var K=["tap_action","hold_action","double_tap_action"],p5={tap_action:["ui.panel.lovelace.editor.card.generic.tap_action","Tap behavior"],hold_action:["ui.panel.lovelace.editor.card.generic.hold_action","Hold behavior"],double_tap_action:["ui.panel.lovelace.editor.card.generic.double_tap_action","Double tap behavior"]},m5=0,w1=(H,M)=>I1(H,...p5[M]),l5=K.map(H=>({name:H,selector:{ui_action:{default_action:H==="tap_action"?"more-info":"none"}},context:{entity_id:"entity"}}));function z(H,M,C,V,e={}){let L={...C},i=p=>{L={...L,...p},V(p)},t=p=>{let m=L[p]?.action;return m!==void 0&&Object.prototype.hasOwnProperty.call(e,m)?m:void 0},A=()=>{let p=Object.entries(e);if(!p.length)return[];let m=K[0],c=t(m)??"",l=`awc-action-${++m5}`,s=document.createElement("fieldset");return s.className="seg card-action-choice",s.innerHTML=`<legend class="seg-l">${S(w1(M,m))}</legend><div class="seg-track">`+[...p,["","Another action"]].map(([u,T])=>`<label><input type="radio" name="${l}" value="${S(u)}"${u===c?" checked":""}><span>${S(T)}</span></label>`).join("")+"</div>",s.querySelectorAll("input").forEach(u=>u.addEventListener("change",()=>{if(!u.checked)return;let T=u.value;i({[m]:T?{action:T}:void 0}),z(H,M,L,V,e),H.querySelectorAll(".card-action-choice input").forEach(S1=>{S1.value===T&&S1.focus()})})),[s]},v=Object.keys(e).length>0,r=()=>K.filter(p=>t(p)&&!(v&&p===K[0])).map(p=>{let m=document.createElement("div");return m.className="option card-action",m.innerHTML=`<span>${S(w1(M,p))}: <b>${S(e[t(p)]??"")}</b></span><button type="button" class="card-action-reset">${S(I1(M,"ui.common.reset","Reset"))}</button>`,m.querySelector("button").addEventListener("click",()=>{i({[p]:void 0}),z(H,M,L,V,e)}),m}),o=()=>{let p=document.createElement("ha-form");p.hass=M,p.data={...L},p.schema=l5.filter(m=>!t(m.name)),p.computeLabel=m=>w1(M,m.name),p.addEventListener("value-changed",m=>{m.stopPropagation();let c=m.detail?.value??{},l={};for(let s of K){let u=v1(c[s]);JSON.stringify(u)!==JSON.stringify(L[s])&&(l[s]=u)}p.data={...L,...l},Object.keys(l).length&&i(l)}),H.replaceChildren(...A(),...r(),p)};if(customElements.get("ha-form")){o();return}S2(H,M,()=>L,i,e),customElements.whenDefined("ha-form").then(()=>{H.isConnected&&o()}),v5()}function r1(H,M){let C=H?.querySelector("ha-form");C&&M&&(C.hass=M)}async function v5(){try{await(await(await window.loadCardHelpers?.())?.createCardElement({type:"tile",entity:"sun.sun"}))?.constructor?.getConfigElement?.()}catch{}}var x5=[{value:"default",label:"Default"},{value:"more-info",label:"More info"},{value:"navigate",label:"Navigate"},{value:"url",label:"Open a URL"},{value:"none",label:"Nothing"}],c2={navigate:{key:"navigation_path",label:"Path",placeholder:"/lovelace/weather"},url:{key:"url_path",label:"URL",placeholder:"https://"}};function S2(H,M,C,V,e={}){let L=[...x5,...Object.entries(e).map(([i,t])=>({value:i,label:t}))];H.innerHTML=K.map(i=>{let t=C()[i],A=t?c2[t.action]:void 0;return`<div class="option"><ha-select data-action="${i}" label="${S(w1(M,i))}"></ha-select></div>`+(A?`<div class="option">${y({id:`${i}-${A.key}`,label:A.label,placeholder:A.placeholder,value:typeof t?.[A.key]=="string"?t[A.key]:""})}</div>`:"")}).join("");for(let i of K){let t=C()[i],A=H.querySelector(`[data-action="${i}"]`);if(!A)continue;let v=t&&!L.some(m=>m.value===t.action)?[...L,{value:t.action,label:`${t.action} (set in YAML)`}]:L,r=()=>{A.options=v,A.value=t?.action??"default"};customElements.get("ha-select")?r():customElements.whenDefined("ha-select").then(r),A.addEventListener("selected",(m=>{let c=m.detail?.value;!c||c===(C()[i]?.action??"default")||(V({[i]:c==="default"?void 0:{action:c}}),S2(H,M,C,V,e))})),A.addEventListener("closed",m=>m.stopPropagation());let o=t?c2[t.action]:void 0;(o?H.querySelector(`#${i}-${o.key}`):null)?.addEventListener("input",m=>{let c=m.target.value.trim(),{[o.key]:l,...s}=C()[i]??{action:t.action};V({[i]:{...s,action:t.action,...c?{[o.key]:c}:{}}})})}}var O2={show_location:!0,temperature_decimals:0,compact:!1,layout:"default",color_palette:"default",hero:"temperature",show_clock:!1,show_date:!1,show_forecast:!1,show_days:!1,forecast_days:7,forecast_metric:"temp",show_chips:!0,forecast_graph:"line",show_attributes:!0,show_attribute_labels:!0,show_attribute_icons:!0,show_indoor:!0,indoor_style:"label",show_flight_labels:!0,flight_label:"flight",plane_speed:1,planes_on_load:!1,animate:!0,spill_particles:!0,use_webgl:!1,disable_lightning_shake:!1,auto_pause:!1,dev_mode:!1,enable_day_night_cycle:!1,sunrise_hour:6,sunset_hour:20,night:"auto",night_red:!0,night_lux:5,wake_time:"07:00",show_note:!1,note_tone:"snarky",note_attribute:"note",note_max_age:180,sun_entity:"sun.sun",engine_mode:"auto"},h2=H=>H==null||typeof H=="string"&&!H.trim()||Array.isArray(H)&&!H.length,y2=H=>H===!0?"on":H===!1?"off":H;function j(H,M,C=O2){let V=H;if(M.startsWith("engine_settings.")){let i=M.slice(16),t=V.engine_settings?.[i];return typeof t=="number"&&isFinite(t)&&t!==E[i]}if(M.startsWith("custom_colors."))return!h2(V.custom_colors?.[M.slice(14)]);let e=V[M];if(h2(e))return!1;if(!(M in C))return!0;let L=C[M];return M==="night"?y2(e)!==L:M==="wake_time"?String(e).replace(/^(\d):/,"0$1:")!==L:typeof L=="number"?Number(e)!==L:e!==L}var _1=H=>H.layout==="nightstand"?"none":H.show_forecast?"forecast":"more-info",f2=H=>H&&typeof H=="object"&&typeof H.action=="string"?H.action:void 0;function U1(H,M){let C=f2(H.tap_action),V=e=>{let L=f2(e);return L!==void 0&&L!=="none"};return C!==void 0&&C!==M||V(H.hold_action)||V(H.double_tap_action)}var g2=Object.keys(E).map(H=>`engine_settings.${H}`),s5=["sunny_bg","cloudy_bg","rainy_bg","stormy_bg","snowy_bg","windy_bg","fog_color"].map(H=>`custom_colors.${H}`),u5=["temperature_color","text_color","sun_color","rain_color","snow_color"].map(H=>`custom_colors.${H}`),P=H=>H.layout==="nightstand",k1=(H,M)=>!!H.show_forecast&&(M.all||!P(H)),x1=H=>H.animate!==!1,q1={preset:{tier:"basic",keys:[]},entity:{tier:"basic",keys:["entity"]},name:{tier:"basic",keys:["name"]},show_location:{tier:"all",keys:["show_location"]},outdoor_sensor_entity:{tier:"all",keys:["outdoor_sensor_entity"]},feels_like_entity:{tier:"all",keys:["feels_like_entity"]},another_place:{tier:"all",keys:["latitude","longitude","time_zone"]},place_fields:{tier:"all",keys:["latitude","longitude","time_zone"],when:(H,M)=>M.place},layout:{tier:"all",keys:["compact","layout"]},color_palette:{tier:"basic",keys:["color_palette"]},temperature_decimals:{tier:"all",keys:["temperature_decimals"]},why_nightstand_only:{tier:"basic",keys:[],reason:!0,when:H=>!P(H)},alarm_entity:{tier:"basic",keys:["alarm_entity"],when:P},wake_time:{tier:"basic",keys:["wake_time"],when:P},night:{tier:"all",keys:["night"],when:P},night_sensor:{tier:"all",keys:["night_sensor"],when:H=>P(H)&&y2(H.night??"auto")==="auto"},night_lux:{tier:"all",keys:["night_lux"],when:H=>P(H)&&!!H.night_sensor},bed_time:{tier:"all",keys:["bed_time"],when:P},night_red:{tier:"all",keys:["night_red"],when:P},why_forecast_nightstand:{tier:"basic",keys:[],reason:!0,when:P},show_forecast:{tier:"basic",keys:["show_forecast"],when:(H,M)=>M.all||!P(H)},forecast_days:{tier:"all",keys:["show_days","forecast_days"],when:k1},forecast_metric:{tier:"all",keys:["forecast_metric"],when:k1},show_chips:{tier:"all",keys:["show_chips"],when:k1},forecast_graph:{tier:"all",keys:["forecast_graph"],when:k1},time_date:{tier:"all",keys:["show_clock","show_date"]},hero:{tier:"all",keys:["hero"]},note:{tier:"basic",keys:["show_note","note_entity"],when:(H,M)=>M.all||!P(H)},why_note_compact:{tier:"basic",keys:[],reason:!0,when:(H,M)=>!!H.compact&&!P(H)&&M.note!=="off"},why_note_nightstand:{tier:"basic",keys:[],reason:!0,when:P},note_tone:{tier:"basic",keys:["note_tone"],when:(H,M)=>M.note==="ai"},note_ai_task_entity:{tier:"all",keys:["note_ai_task_entity"],when:(H,M)=>M.note==="ai",promote:(H,M)=>M.noDefaultAi},note_calendar:{tier:"all",keys:["note_calendar"],when:(H,M)=>M.note==="ai"},note_entity:{tier:"basic",keys:["note_entity"],when:(H,M)=>M.note==="entity"},note_attribute:{tier:"all",keys:["note_attribute"],when:(H,M)=>M.note==="entity"},note_max_age:{tier:"all",keys:["note_max_age"],when:(H,M)=>M.note!=="off"},show_attributes:{tier:"all",keys:["show_attributes"]},readings:{tier:"all",keys:["readings","uv_levels","aqi_levels",...O1],when:H=>H.show_attributes!==!1,changed:H=>!y1(H1(H))||j(H,"uv_levels")||j(H,"aqi_levels")},reading_style:{tier:"all",keys:["show_attribute_labels","show_attribute_icons"],when:H=>H.show_attributes!==!1},indoor_temperature_entity:{tier:"all",keys:["indoor_temperature_entity"]},indoor_humidity_entity:{tier:"all",keys:["indoor_humidity_entity"]},indoor_line:{tier:"all",keys:["show_indoor","indoor_style"],when:H=>!!(H.indoor_temperature_entity||H.indoor_humidity_entity)},animate:{tier:"all",keys:["animate"]},spill_particles:{tier:"all",keys:["spill_particles"],when:x1},use_webgl:{tier:"all",keys:["use_webgl"],when:x1},lightning:{tier:"all",keys:["disable_lightning_shake"],when:x1},auto_pause:{tier:"all",keys:["auto_pause"]},sky_follows:{tier:"all",keys:["enable_day_night_cycle"]},day_hours:{tier:"all",keys:["sunrise_hour","sunset_hour"],when:H=>!!H.enable_day_night_cycle},sun_entity:{tier:"all",keys:["sun_entity"]},moon_entity:{tier:"all",keys:["moon_entity"]},engine_mode:{tier:"all",keys:["engine_mode"],when:x1,changed:H=>q(H)==="manual"},amounts:{tier:"all",keys:g2,when:H=>x1(H)&&q(H)==="manual",changed:H=>q(H)==="manual"&&g2.some(M=>j(H,M))},sky_colors:{tier:"all",keys:s5,when:H=>H.color_palette!=="theme"},why_sky_colors_theme:{tier:"all",keys:[],reason:!0,when:H=>H.color_palette==="theme"},ink_colors:{tier:"all",keys:u5},flights_entity:{tier:"all",keys:["flights_entity"]},plane_tags:{tier:"all",keys:["show_flight_labels","flight_label"],when:H=>!!H.flights_entity},plane_speed:{tier:"all",keys:["plane_speed"],when:H=>!!H.flights_entity},planes_on_load:{tier:"all",keys:["planes_on_load"],when:H=>!!H.flights_entity},actions:{tier:"all",keys:["tap_action","hold_action","double_tap_action"],changed:H=>U1(H,_1(H))},dev_mode:{tier:"all",keys:["dev_mode"]}},Z5={start:["preset"],weather:["entity","name","show_location","outdoor_sensor_entity","feels_like_entity","another_place","place_fields"],look:["layout","color_palette","temperature_decimals"],nightstand:["why_nightstand_only","alarm_entity","wake_time","night","night_sensor","night_lux","bed_time","night_red"],forecast:["why_forecast_nightstand","show_forecast","forecast_days","forecast_metric","show_chips","forecast_graph","time_date","hero"],note:["note","why_note_compact","why_note_nightstand","note_tone","note_ai_task_entity","note_calendar","note_entity","note_attribute","note_max_age"],readings:["show_attributes","readings","reading_style","indoor_temperature_entity","indoor_humidity_entity","indoor_line"],sky:["animate","spill_particles","use_webgl","lightning","auto_pause","sky_follows","day_hours","sun_entity","moon_entity","engine_mode","amounts"],colors:["sky_colors","why_sky_colors_theme","ink_colors"],planes:["flights_entity","plane_tags","plane_speed","planes_on_load"],interactions:["actions"],dev:["dev_mode"]},K1=["readings","sky","colors","planes","interactions"],u1={rows:q1,sections:Z5,drawers:K1,defaults:O2};function w2(H,M,C=u1){let V=C.rows[H];return!V||V.reason?!1:V.changed?V.changed(M):V.keys.some(e=>j(M,e,C.defaults))}function j1(H,M,C,V,e=u1){let L=e.rows[H];return L?V.has(H)?!0:L.when&&!L.when(M,C)?!1:L.tier==="basic"||C.all||!!L.promote?.(M,C):!1}function k2(H,M,C,V,e=u1){return H.some(L=>!e.rows[L]?.reason&&j1(L,M,C,V,e))}var c5={compact:!1,color_palette:"default",show_hours:!0,show_summary:!0,forecast_days:7,forecast_metric:"temp",show_chips:!0,forecast_graph:"line",weather_effects:!1,use_webgl:!1,sun_entity:"sun.sun",dev_mode:!1},s1=H=>!!H.compact,Q1=H=>s1(H)||H.show_hours!==!1,b2={rows:{entity:{tier:"basic",keys:["entity"]},layout:{tier:"basic",keys:["compact"]},color_palette:{tier:"basic",keys:["color_palette"]},show_summary:{tier:"all",keys:["show_summary"],when:H=>!s1(H)},show_hours:{tier:"all",keys:["show_hours"],when:H=>!s1(H)},forecast_days:{tier:"all",keys:["forecast_days"],when:H=>!s1(H)},forecast_metric:{tier:"basic",keys:["forecast_metric"],when:H=>Q1(H)||(H.forecast_days??7)>0},show_chips:{tier:"all",keys:["show_chips"],when:H=>!s1(H)&&Q1(H)},forecast_graph:{tier:"all",keys:["forecast_graph"],when:Q1},weather_effects:{tier:"all",keys:["weather_effects"]},use_webgl:{tier:"all",keys:["use_webgl"],when:H=>H.weather_effects===!0},sun_entity:{tier:"all",keys:["sun_entity"]},another_place:{tier:"all",keys:["latitude","longitude","time_zone"]},place_fields:{tier:"all",keys:["latitude","longitude","time_zone"],when:(H,M)=>M.place},actions:{tier:"all",keys:["tap_action","hold_action","double_tap_action"],changed:H=>U1(H,"forecast")},dev_mode:{tier:"all",keys:["dev_mode"]}},sections:{forecast:["entity","layout","color_palette","forecast_metric"],shows:["show_summary","show_hours","forecast_days","show_chips","forecast_graph","weather_effects","use_webgl"],sky:["sun_entity","another_place","place_fields"],interactions:["actions"],dev:["dev_mode"]},drawers:[],defaults:c5},S5={compact:!1,color_palette:"default",show_header:!0,show_details:!0,daylight_delta:"day",direction:"auto",dev_mode:!1},b1=H=>!H.compact,_2={rows:{sun_entity:{tier:"basic",keys:["sun_entity"]},layout:{tier:"basic",keys:["compact"]},color_palette:{tier:"basic",keys:["color_palette"]},title:{tier:"all",keys:["title"],when:b1},show_header:{tier:"all",keys:["show_header"]},show_details:{tier:"all",keys:["show_details"],when:b1},moon_entity:{tier:"all",keys:["moon_entity"],when:H=>b1(H)&&H.show_details!==!1},daylight_delta:{tier:"all",keys:["daylight_delta"],when:H=>H.show_header!==!1||b1(H)&&H.show_details!==!1},direction:{tier:"all",keys:["direction"]},weather_entity:{tier:"all",keys:["weather_entity"]},another_place:{tier:"all",keys:["latitude","longitude","time_zone"]},place_fields:{tier:"all",keys:["latitude","longitude","time_zone"],when:(H,M)=>M.place},actions:{tier:"all",keys:["tap_action","hold_action","double_tap_action"],changed:H=>U1(H,"more-info")},dev_mode:{tier:"all",keys:["dev_mode"]}},sections:{sun:["sun_entity","layout","color_palette"],shows:["title","show_header","show_details","daylight_delta","moon_entity","direction"],sky:["weather_entity","another_place","place_fields"],interactions:["actions"],dev:["dev_mode"]},drawers:[],defaults:S5};var T1=["compact","layout","show_forecast","show_days","show_clock","show_date","hero","show_attributes","grid_options"],Y1={width:640,height:540},B1=[{id:"standard",label:"Standard",description:"The sky, the temperature and four readings",options:{}},{id:"simple",label:"Simple",description:"The sky, the temperature and the condition, nothing else",options:{show_attributes:!1}},{id:"forecast",label:"Forecast",description:"The next hours under the readings; drag through them",options:{show_forecast:!0}},{id:"full",label:"Full info",description:"The time and date, the hours and the week",options:{show_forecast:!0,show_days:!0,show_clock:!0,show_date:!0}},{id:"strip",label:"Strip",description:"One line, to sit under other cards",options:{compact:!0}},{id:"bedside",label:"Bedside",description:"A clock that goes red on black at night",options:{layout:"nightstand"}},{id:"wall",label:"Wall",description:"A panel to read across the room",options:{show_forecast:!0,show_clock:!0,show_date:!0,grid_options:{columns:"full",rows:10}}}],h5={compact:!1,layout:"default",show_forecast:!1,show_days:!1,show_clock:!1,show_date:!1,hero:"temperature",show_attributes:!0},X1=H=>B1.find(M=>M.id===H);function J1(H){let M=H??{},C=(V,e)=>e[V]??h5[V];for(let V of B1){let e=V.options,L=T1.filter(t=>t!=="grid_options").every(t=>C(t,M)===C(t,e)),i=V.id!=="wall"||M.grid_options?.columns==="full";if(L&&i)return V.id}return null}var Y=H=>`<svg class="pre-art" viewBox="0 0 72 48" aria-hidden="true" focusable="false">${H}</svg>`,h=(H,M,C,V,e,L=1)=>`<rect class="${H}" x="${M}" y="${C}" width="${V}" height="${e}" rx="${L}"/>`,t1=(H,M,C=4)=>`<circle class="sun" cx="${H}" cy="${M}" r="${C}"/>`,T2=H=>[10,24,38,52].map(M=>h("q",M,H,8,2)+h("ink",M,H+3.5,9,2.5)).join(""),C2=(H,M,C)=>{let V=C/5,e=[0,-1.5,-2.5,-1,1,.5],L=e.map((i,t)=>`${(H+t*V).toFixed(1)},${(M+i).toFixed(1)}`).join(" ");return e.map((i,t)=>h("q",H+t*V-1.5,M-7,3,1.6,.8)).join("")+`<polyline class="line" points="${L}"/>`},B2=(H,M,C,V,e=4)=>Array.from({length:V},(L,i)=>h("q",H,M+i*e,6,1.8)+h("bar",H+9,M+i*e,C-9,1.8,.9)).join(""),P2={standard:Y(h("card",4,6,64,36,4)+h("ink",10,11,15,9)+h("q",10,23,13,2.5)+t1(58,14)+T2(31)),simple:Y(h("card",4,6,64,36,4)+h("ink",10,13,17,11)+h("q",10,28,15,2.5)+t1(58,14)),forecast:Y(h("card",4,2,64,44,4)+h("ink",10,6,14,8)+h("q",10,16,12,2)+t1(58,9,3.5)+T2(21)+C2(12,40,48)),full:Y(h("card",4,1,64,46,4)+h("q",10,5,13,1.8)+h("ink",10,8,13,7)+h("q",10,17,11,1.8)+t1(58,8,3.5)+C2(12,28,48)+B2(10,32,50,4,3.6)),strip:Y(h("card",4,17,64,14,3.5)+h("ink",9,20.5,9,7)+h("q",21,22,15,1.8)+h("q",21,25.5,10,1.6)+t1(60,22,3)),bedside:Y(h("night",4,6,64,36,4)+h("red",12,15,22,11,1.5)+h("red-q",12,30,18,1.8)),wall:Y(h("card",2,5,68,38,4)+h("q",7,9,10,1.8)+h("ink",7,12,14,9)+h("q",7,23,11,1.8)+t1(62,12,3.5)+C2(9,37,30)+B2(46,28,20,4,3.4))};var F2="M20.56 3.91C21.15 4.5 21.15 5.45 20.56 6.03L16.67 9.92L18.79 19.11L17.38 20.53L13.5 13.1L9.6 17L9.96 19.47L8.89 20.53L7.13 17.35L3.94 15.58L5 14.5L7.5 14.87L11.37 11L3.94 7.09L5.36 5.68L14.55 7.8L18.44 3.91C19 3.33 20 3.33 20.56 3.91Z";var R2="M7 14C8.66 14 10 12.66 10 11C10 9.34 8.66 8 7 8C5.34 8 4 9.34 4 11C4 12.66 5.34 14 7 14M7 10C7.55 10 8 10.45 8 11C8 11.55 7.55 12 7 12C6.45 12 6 11.55 6 11C6 10.45 6.45 10 7 10M19 7H11V15H3V5H1V20H3V17H21V20H23V11C23 8.79 21.21 7 19 7M21 15H13V9H19C20.1 9 21 9.9 21 11Z";var E2="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";var D2="M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z";var N2="M6.92,19L5,17.08L13.06,9L15,10.94M20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L13.84,6.41L11.91,4.5L10.5,5.91L11.92,7.33L3,16.25V21H7.75L16.67,12.08L18.09,13.5L19.5,12.09L17.58,10.17L20.7,7.05C21.1,6.65 21.1,6 20.71,5.63Z";var W2="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12C20,14.4 19,16.5 17.3,18C15.9,16.7 14,16 12,16C10,16 8.2,16.7 6.7,18C5,16.5 4,14.4 4,12A8,8 0 0,1 12,4M14,5.89C13.62,5.9 13.26,6.15 13.1,6.54L11.81,9.77L11.71,10C11,10.13 10.41,10.6 10.14,11.26C9.73,12.29 10.23,13.45 11.26,13.86C12.29,14.27 13.45,13.77 13.86,12.74C14.12,12.08 14,11.32 13.57,10.76L13.67,10.5L14.96,7.29L14.97,7.26C15.17,6.75 14.92,6.17 14.41,5.96C14.28,5.91 14.15,5.89 14,5.89M10,6A1,1 0 0,0 9,7A1,1 0 0,0 10,8A1,1 0 0,0 11,7A1,1 0 0,0 10,6M7,9A1,1 0 0,0 6,10A1,1 0 0,0 7,11A1,1 0 0,0 8,10A1,1 0 0,0 7,9M17,9A1,1 0 0,0 16,10A1,1 0 0,0 17,11A1,1 0 0,0 18,10A1,1 0 0,0 17,9Z";var I2="M10,9A1,1 0 0,1 11,8A1,1 0 0,1 12,9V13.47L13.21,13.6L18.15,15.79C18.68,16.03 19,16.56 19,17.14V21.5C18.97,22.32 18.32,22.97 17.5,23H11C10.62,23 10.26,22.85 10,22.57L5.1,18.37L5.84,17.6C6.03,17.39 6.3,17.28 6.58,17.28H6.8L10,19V9M11,5A4,4 0 0,1 15,9C15,10.5 14.2,11.77 13,12.46V11.24C13.61,10.69 14,9.89 14,9A3,3 0 0,0 11,6A3,3 0 0,0 8,9C8,9.89 8.39,10.69 9,11.24V12.46C7.8,11.77 7,10.5 7,9A4,4 0 0,1 11,5Z";var G2="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z";var $2="M20,2A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H6L2,22V4C2,2.89 2.9,2 4,2H20M4,4V17.17L5.17,16H20V4H4M6,7H18V9H6V7M6,11H15V13H6V11Z";var z2="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z";var Q2="M11,13.5V21.5H3V13.5H11M9,15.5H5V19.5H9V15.5M12,2L17.5,11H6.5L12,2M12,5.86L10.08,9H13.92L12,5.86M17.5,13C20,13 22,15 22,17.5C22,20 20,22 17.5,22C15,22 13,20 13,17.5C13,15 15,13 17.5,13M17.5,15A2.5,2.5 0 0,0 15,17.5A2.5,2.5 0 0,0 17.5,20A2.5,2.5 0 0,0 20,17.5A2.5,2.5 0 0,0 17.5,15Z";var U2="M12.74,5.47C15.1,6.5 16.35,9.03 15.92,11.46C17.19,12.56 18,14.19 18,16V16.17C18.31,16.06 18.65,16 19,16A3,3 0 0,1 22,19A3,3 0 0,1 19,22H6A4,4 0 0,1 2,18A4,4 0 0,1 6,14H6.27C5,12.45 4.6,10.24 5.5,8.26C6.72,5.5 9.97,4.24 12.74,5.47M11.93,7.3C10.16,6.5 8.09,7.31 7.31,9.07C6.85,10.09 6.93,11.22 7.41,12.13C8.5,10.83 10.16,10 12,10C12.7,10 13.38,10.12 14,10.34C13.94,9.06 13.18,7.86 11.93,7.3M13.55,3.64C13,3.4 12.45,3.23 11.88,3.12L14.37,1.82L15.27,4.71C14.76,4.29 14.19,3.93 13.55,3.64M6.09,4.44C5.6,4.79 5.17,5.19 4.8,5.63L4.91,2.82L7.87,3.5C7.25,3.71 6.65,4.03 6.09,4.44M18,9.71C17.91,9.12 17.78,8.55 17.59,8L19.97,9.5L17.92,11.73C18.03,11.08 18.05,10.4 18,9.71M3.04,11.3C3.11,11.9 3.24,12.47 3.43,13L1.06,11.5L3.1,9.28C3,9.93 2.97,10.61 3.04,11.3M19,18H16V16A4,4 0 0,0 12,12A4,4 0 0,0 8,16H6A2,2 0 0,0 4,18A2,2 0 0,0 6,20H19A1,1 0 0,0 20,19A1,1 0 0,0 19,18Z";var q2="M4,10A1,1 0 0,1 3,9A1,1 0 0,1 4,8H12A2,2 0 0,0 14,6A2,2 0 0,0 12,4C11.45,4 10.95,4.22 10.59,4.59C10.2,5 9.56,5 9.17,4.59C8.78,4.2 8.78,3.56 9.17,3.17C9.9,2.45 10.9,2 12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10H4M19,12A1,1 0 0,0 20,11A1,1 0 0,0 19,10C18.72,10 18.47,10.11 18.29,10.29C17.9,10.68 17.27,10.68 16.88,10.29C16.5,9.9 16.5,9.27 16.88,8.88C17.42,8.34 18.17,8 19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14H5A1,1 0 0,1 4,13A1,1 0 0,1 5,12H19M18,18H4A1,1 0 0,1 3,17A1,1 0 0,1 4,16H18A3,3 0 0,1 21,19A3,3 0 0,1 18,22C17.17,22 16.42,21.66 15.88,21.12C15.5,20.73 15.5,20.1 15.88,19.71C16.27,19.32 16.9,19.32 17.29,19.71C17.47,19.89 17.72,20 18,20A1,1 0 0,0 19,19A1,1 0 0,0 18,18Z";var K2="M3.55 19.09L4.96 20.5L6.76 18.71L5.34 17.29M12 6C8.69 6 6 8.69 6 12S8.69 18 12 18 18 15.31 18 12C18 8.68 15.31 6 12 6M20 13H23V11H20M17.24 18.71L19.04 20.5L20.45 19.09L18.66 17.29M20.45 5L19.04 3.6L17.24 5.39L18.66 6.81M13 1H11V4H13M6.76 5.39L4.96 3.6L3.55 5L5.34 6.81L6.76 5.39M1 13H4V11H1M13 20H11V23H13";var j2="animated-weather-card:editor-all";function i1(){try{return localStorage.getItem(j2)==="1"}catch{return!1}}function o1(H){try{localStorage.setItem(j2,H?"1":"0")}catch{}}var I=H=>typeof requestAnimationFrame=="function"?requestAnimationFrame(H):setTimeout(H,16);function Z1(H,M,C=!1){H.hasAttribute("data-open")!==M&&(H.toggleAttribute("data-open",M),M?C?H.setAttribute("data-settled",""):setTimeout(()=>{H.hasAttribute("data-open")&&H.setAttribute("data-settled","")},300):H.removeAttribute("data-settled"))}var Y2='<svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 8.6 12 13.2l4.6-4.6L18 10l-6 6-6-6z"/></svg>',c1='<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>',f5={start:Q2,weather:U2,look:z2,nightstand:R2,clock:E2,note:$2,readings:W2,motion:q2,colors:N2,planes:F2,interactions:I2,shows:D2,place:G2,sun:K2},H2=H=>`<svg class="sec-i" viewBox="0 0 24 24" aria-hidden="true"><path d="${f5[H]}"/></svg>`,a=(H,M)=>`<div class="rv" data-row="${H}"><div class="rv-in"><div class="row">${M}</div></div></div>`,Z=(H,M,C,V="")=>`<label class="sw"><span class="sw-t"><span class="sw-l">${M}</span>${V?`<span class="sw-h">${V}</span>`:""}</span><ha-switch id="${H}"${C?" checked":""}></ha-switch></label>`,w=(H,M,C,V="")=>`<ha-entity-picker id="${H}" label="${S(M)}" value="${S(String(C??""))}"${V?` helper="${S(V)}"`:""} allow-custom-entity></ha-entity-picker>`,_=(H,M,C="")=>`<ha-select id="${H}" label="${S(M)}"></ha-select>${C?`<p class="help">${C}</p>`:""}`,a1=H=>`<p class="why">${c1}<span>${H}</span></p>`,Q=(H,M,C,V,e)=>`<fieldset class="seg" id="${H}"><legend class="seg-l">${M}</legend><div class="seg-track">${C.map(([L,i])=>`<label><input type="radio" name="awc-${H}-${e}" value="${L}"${L===V?" checked":""}><span>${i}</span></label>`).join("")}</div><p class="help" data-help="${H}"></p></fieldset>`,b=(H,M,C)=>{let[V,e]=typeof M=="string"?[void 0,M]:M;return`<section class="rv grp" data-sec="${H}"><div class="rv-in"><div class="grp-b">${e?`<h3 class="grp-h">${V?H2(V):""}<span>${e}</span></h3>`:""}${C}</div></div></section>`},A1=H=>`<div class="top">
          ${Z("all_settings","Show all settings",H,"Settings you've changed always show")}
          <span class="vh" aria-live="polite" data-live></span>
        </div>`,n1=(H,M)=>H?`All settings shown.${M?" More sections at the end.":""}`:"Showing the basics, and the settings you've changed.";function d1(H,M,C,V,e,L){for(let A of Object.keys(M.rows))w2(A,C,M)&&e.add(A);H.querySelectorAll("[data-row]").forEach(A=>Z1(A,j1(A.dataset.row,C,V,e,M),L));let i=!1;for(let[A,v]of Object.entries(M.sections)){let r=k2(v,C,V,e,M),o=H.querySelector(`[data-sec="${A}"]`);o&&Z1(o,r,L),r&&M.drawers.includes(A)&&(i=!0)}let t=H.querySelector("#all_settings");return t&&t.checked!==V.all&&(t.checked=V.all),i}function X(H,M,C,V,e){let L=H.querySelector(`#${M}`);if(!L)return;let i=()=>{L.options=C,L.value=V};customElements.get("ha-select")?i():customElements.whenDefined("ha-select").then(i),L.addEventListener("selected",(t=>{let A=t.detail?.value;!A||A===V||(V=A,L.value=A,e(A))})),L.addEventListener("closed",t=>t.stopPropagation())}function p1(H,M,C){H.querySelectorAll(`[id="${M}"] input[type="radio"]`).forEach(V=>V.addEventListener("change",()=>{V.checked&&C(V.value)}))}function X2(H){return(Array.isArray(H)?H:typeof H=="string"?[H]:[]).map(String).filter(Boolean)}var e2=[{value:"temp",label:"Temperature"},{value:"feels",label:"Feels like"},{value:"chance",label:"Chance of rain"},{value:"amount",label:"Rain amount"},{value:"uv",label:"UV index"},{value:"wind",label:"Wind"},{value:"gust",label:"Wind gusts"},{value:"humidity",label:"Humidity"},{value:"dew",label:"Dew point"},{value:"cloud",label:"Cloud cover"},{value:"pressure",label:"Pressure"}],r2=[{value:"line",label:"Line"},{value:"area",label:"Line with a soft fill"},{value:"bars",label:"Bars"},{value:"none",label:"No graph, the values alone"}],V2=[["windSpeed","Wind's effect",'<input type="range" id="windSpeed" min="0.5" max="5" step="0.1"'],["rainCount","Rain",'<input type="range" id="rainCount" min="0.5" max="3" step="0.1"'],["snowCount","Snow",'<input type="range" id="snowCount" min="0.5" max="3" step="0.1"'],["leafCount","Leaves on windy days",'<input type="range" id="leafCount" min="0.5" max="3" step="0.1"'],["cloudCount","Clouds, and stars at night",'<input type="range" id="cloudCount" min="1" max="6" step="1"'],["cloudBaseSize","Cloud size",'<input type="range" id="cloudBaseSize" min="0.5" max="2" step="0.1"'],["splashBounce","Splash height",'<input type="range" id="splashBounce" min="40" max="120" step="5"']],L2=[["sunny_bg","Sunny sky"],["cloudy_bg","Cloudy sky"],["rainy_bg","Rainy sky"],["stormy_bg","Stormy sky"],["snowy_bg","Snowy sky"],["windy_bg","Windy sky"],["fog_color","Fog"]],M2=[["temperature_color","Temperature"],["text_color","Text"],["sun_color","Sun"],["rain_color","Rain"],["snow_color","Snow"]],g5=0,D=class D extends HTMLElement{constructor(){super(...arguments);this._initialized=!1;this.uid=++g5;this.all=i1();this.pinned=new Set;this.openDrawers=new Set;this.readingOpen=-1;this.placeOn=!1;this.placeKept={};this.noDefaultAi=!1;this.refill={}}setConfig(C){let V=!this._config||Object.keys(C).length!==Object.keys(this._config).length||JSON.stringify(Object.keys(C).sort())!==JSON.stringify(Object.keys(this._config).sort());this._config={...C},this.isConnected&&V?this.render():this.isConnected&&this._initialized&&this.sync()}async connectedCallback(){this._config=this._config||{},await this.ensureEntityPickerLoaded(),this.render(),this._initialized=!0,this._hass&&this.updateEntityPickers()}disconnectedCallback(){this._cleanupSuppressHandler(),this.pinned.clear(),this.innerHTML=""}_cleanupSuppressHandler(){this._suppressHandler&&(window.removeEventListener("unhandledrejection",this._suppressHandler),this._suppressHandler=void 0),this._suppressTimeout&&(clearTimeout(this._suppressTimeout),this._suppressTimeout=void 0)}async ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let V=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]});this._cleanupSuppressHandler(),this._suppressHandler=e=>{(e.reason?.message?.includes("localize")||e.reason?.message?.includes("hass"))&&e.preventDefault()},window.addEventListener("unhandledrejection",this._suppressHandler);try{await V.constructor.getConfigElement?.()}finally{this._suppressTimeout=setTimeout(()=>this._cleanupSuppressHandler(),2e3)}}catch{}}ctx(){return{all:this.all,place:this.placeOn,note:this.noteSource(),noDefaultAi:this.noDefaultAi}}noteSource(){let C=this._config??{};return C.note_entity||this.noteChoice==="entity"?"entity":C.show_note?"ai":"off"}render(){let C=this._config??(this._config={}),V=this.uid,e=["latitude","longitude","time_zone"].some(l=>C[l]!==void 0&&C[l]!=="");this.placeOn=this.placeOn||e;let L=Object.fromEntries(Object.entries(C.engine_settings||{}).filter(([,l])=>typeof l=="number"&&isFinite(l))),i=C.custom_colors||{},t=C.layout==="nightstand"?"nightstand":C.compact?"compact":"default",A=(l,s,u,T)=>Q(l,s,u,T,V),v=([l,s],u)=>`<div class="swc"><span class="chip${u?` ink ink-${l.replace("_color","")}`:""}"><input type="color" id="${l}" value="${S(i[l]||D.DEFAULT_COLORS[l])}"></span><label for="${l}">${s}</label><button type="button" class="tb color-reset" data-target="${l}" aria-label="Reset ${s}"${i[l]?"":" data-off"}>Reset</button></div>`,r={readings:"readings",sky:"motion",colors:"colors",planes:"planes",interactions:"interactions"},o=(l,s,u,T)=>`<section class="rv drw" data-sec="${l}" style="--i:${T}"><div class="rv-in"><div class="drw-b"><h3 class="drw-h"><button type="button" class="drw-btn" data-drawer="${l}" aria-expanded="false" aria-controls="awc-${l}-${V}">${H2(r[l])}<span class="drw-tx"><span class="drw-t">${s}</span><span class="drw-s" data-summary="${l}"></span></span>${Y2}</button></h3><div class="rv drw-c" id="awc-${l}-${V}" role="region" aria-label="${s}"><div class="rv-in"><div class="drw-in">${u}</div></div></div></div></div></section>`,p=J1(C),m=`<fieldset class="pre" id="preset"><legend class="vh">Start from a preset</legend><div class="pre-grid">${B1.map(l=>`<label class="pre-t"><input type="radio" name="awc-preset-${V}" value="${l.id}"${l.id===p?" checked":""}><span class="pre-c">${P2[l.id]}<span class="pre-n">${l.label}</span></span></label>`).join("")}</div><p class="help" data-help="preset"></p><p class="why" data-wall hidden>${c1}<span>The wall needs the card at least ${Y1.width} \xD7 ${Y1.height} px: give its section Double width (the section's settings, Width), or put it in a panel view. Smaller, it's the forecast with the time and date.</span></p></fieldset>`;this.innerHTML=`
      <div class="card-config" data-instant>
        ${A1(this.all)}

        ${b("start",["start","Start from"],a("preset",m))}

        ${b("weather",["weather","Weather"],[a("entity",`${w("entity","Weather entity",C.entity)}<p class="status" role="status" data-status="entity" hidden>${c1}<span>Pick a weather entity to start.</span></p>`),a("name",y({id:"name",label:"Place name",placeholder:"Weather",value:C.name,hint:"Shown above the temperature"})),a("show_location",Z("show_location","Show the place name",C.show_location!==!1)),a("outdoor_sensor_entity",w("outdoor_sensor_entity","Temperature from",C.outdoor_sensor_entity,"A sensor of yours, shown instead of the weather entity's")),a("feels_like_entity",w("feels_like_entity","Feels like from",C.feels_like_entity,"Without one, the weather entity's own, when it reports one")),a("another_place",Z("another_place","Weather for another place",this.placeOn,"Its sun, and its times in its time zone")),a("place_fields",V1(C))].join(""))}

        ${b("look",["look","Layout and colors"],[a("layout",A("layout","Layout",[["default","Regular"],["compact","Compact"],["nightstand","Nightstand"]],t)),a("color_palette",A("color_palette","Colors",[["default","Sky"],["theme","Theme"]],C.color_palette==="theme"?"theme":"default")),a("temperature_decimals",Z("temperature_decimals","One decimal",Number(C.temperature_decimals)===1,"21.5\xB0 rather than 22\xB0"))].join(""))}

        ${b("nightstand",["nightstand","Nightstand"],[a("why_nightstand_only",a1("These apply with the Nightstand layout.")),a("alarm_entity",w("alarm_entity","Next alarm",C.alarm_entity,"Optional. Your phone's next alarm sensor, or a date and time helper")),a("wake_time",y({id:"wake_time",label:"Wake time",placeholder:"07:00",value:C.wake_time,hint:"When you get up without an alarm"})),a("night",_("night","Night mode","Automatic: when the room goes dark, or from bed time without a light sensor")),a("night_sensor",w("night_sensor","Light sensor",C.night_sensor,"An illuminance sensor near the screen")),a("night_lux",y({id:"night_lux",label:"Dark below (lx)",type:"number",min:.1,step:"any",placeholder:"5",value:C.night_lux!==void 0?String(C.night_lux):"",hint:"Raise it if the screen or a street light keeps the room brighter"})),a("bed_time",y({id:"bed_time",label:"Bed time",placeholder:"22:30",value:C.bed_time,hint:"By default, 8 h 30 min before the alarm or wake time"})),a("night_red",Z("night_red","Red at night",C.night_red!==!1,"Red on black, like a bedside clock"))].join(""))}

        ${b("forecast",["clock","Forecast and clock"],[a("why_forecast_nightstand",a1("The nightstand shows the time, the date and what's coming on its own.")),a("show_forecast",Z("show_forecast","Forecast",!!C.show_forecast,"Today's high and low, the hours ahead, and the week on a tap")),a("forecast_days",_("forecast_days","Days under the hours")),a("forecast_metric",_("forecast_metric","Hours open on","The value the hours start on: the temperature, the rain, the wind and the rest")),a("show_chips",Z("show_chips","Buttons under the hours",C.show_chips!==!1,"One for each value, to change what the hours show. Off, they stay on what Hours open on says")),a("forecast_graph",_("forecast_graph","Graph")),a("time_date",_("time_date","Time and date","Before the place name, in your profile's 12- or 24-hour format")),a("hero",A("hero","Big number",[["temperature","Temperature"],["clock","Time"]],C.hero==="clock"?"clock":"temperature"))].join(""))}

        ${b("note",["note","Weather note"],[a("note",`${_("note_source","Note")}<p class="help" data-help="note"></p><p class="status" role="status" id="note_status" hidden></p>`),a("why_note_compact",a1("The compact card has no room for the note.")),a("why_note_nightstand",a1("The nightstand doesn't show the note.")),a("note_tone",_("note_tone","Voice","Serious weather always gets plain advice")),a("note_ai_task_entity",w("note_ai_task_entity","AI Task",C.note_ai_task_entity,"Leave empty for your default AI Task")),a("note_calendar",w("note_calendar","Calendar",X2(C.note_calendar)[0],"For what to wear when you're out. Only the times reach your AI")),a("note_entity",w("note_entity","Note entity",C.note_entity,"A text helper or a sensor: its state is the short note")),a("note_attribute",y({id:"note_attribute",label:"Longer version",placeholder:"note",value:C.note_attribute,hint:"The attribute shown where there's room for two lines"})),a("note_max_age",y({id:"note_max_age",label:"Hide after (minutes)",type:"number",min:0,placeholder:"180",value:C.note_max_age!==void 0?String(C.note_max_age):"",hint:"Counted from when the note was written. 0 keeps it up"}))].join(""))}

        <div class="rv drws" data-drawers><div class="rv-in"><div class="drws-b">
          ${o("readings","Readings",[a("show_attributes",Z("show_attributes","Show the readings",C.show_attributes!==!1)),a("readings",`<div class="readings-table"></div>
              <div data-levels-for="uv">${y({id:"uv_levels",label:"UV levels",placeholder:"3, 6, 8, 11",value:Array.isArray(C.uv_levels)?C.uv_levels.join(", "):C.uv_levels,hint:"Where moderate, high, very high and extreme start. The WHO's by default"})}</div>
              <div data-levels-for="aqi">${y({id:"aqi_levels",label:"Air quality levels",placeholder:"51, 101, 151, 201, 301",value:Array.isArray(C.aqi_levels)?C.aqi_levels.join(", "):C.aqi_levels,hint:"Where each US EPA level starts, unless your sensor uses another scale"})}</div>`),a("reading_style",_("reading_style","Each reading shows")),a("indoor_temperature_entity",w("indoor_temperature_entity","Indoor temperature",C.indoor_temperature_entity,"A line under the condition")),a("indoor_humidity_entity",w("indoor_humidity_entity","Indoor humidity",C.indoor_humidity_entity)),a("indoor_line",_("indoor_line","Indoor line starts with"))].join(""),0)}
          ${o("sky","Sky and motion",[a("animate",Z("animate","Animate the weather",C.animate!==!1,"Off, a still sky in the weather's colors")),a("spill_particles",Z("spill_particles","Let weather spill out",C.spill_particles!==!1,"Rain, snow and leaves fall past the card's edges")),a("use_webgl",Z("use_webgl","WebGL (experimental)",C.use_webgl===!0,"Draw supported effects with WebGL when hardware acceleration is available")),a("lightning",Z("lightning_shake","Shake on lightning",!C.disable_lightning_shake,"A small jolt when lightning strikes")),a("auto_pause",Z("auto_pause","Pause in the background",!!C.auto_pause,"Also while this window isn't in front. The card always pauses off screen")),a("sky_follows",A("sky_follows","Sky follows",[["sun","The sun"],["hours","Set hours"]],C.enable_day_night_cycle?"hours":"sun")),a("day_hours",`<div class="pair">${y({id:"sunrise_hour",label:"Day begins at",type:"number",min:0,max:23,placeholder:"6",value:C.sunrise_hour!==void 0?String(C.sunrise_hour):""})}${y({id:"sunset_hour",label:"Night begins at",type:"number",min:0,max:23,placeholder:"20",value:C.sunset_hour!==void 0?String(C.sunset_hour):""})}</div>`),a("sun_entity",w("sun_entity","Sun",C.sun_entity,"Sets the sky's time of day and the sunset reading. Usually sun.sun")),a("moon_entity",w("moon_entity","Moon phase",C.moon_entity,"The Moon integration's sensor. Else, worked out from the date")),a("engine_mode",Z("engine_auto","Amounts follow the weather",q(C)==="auto","How hard it rains or snows, the cloud cover, how far you can see, and the wind and its gusts. Off, you set the amounts")),a("amounts",`<p class="sub-h">Amounts</p><div class="amt">${V2.map(([l,s,u])=>{let T=L[l]??E[l];return`<div class="amt-o"><label for="${l}">${s}</label><output for="${l}" data-out="${l}">${D.formatEngineValue(l,T)}</output>${u} value="${S(T)}" /></div>`}).join("")}</div><button type="button" class="tb reset-engine-btn" data-off>Reset amounts</button>`)].join(""),1)}
          ${o("colors","Custom colors",[a("sky_colors",`<p class="sub-h">Skies</p><p class="help">Each color replaces that condition's whole sky</p><div class="color-grid" id="color-grid">${L2.map(l=>v(l,!1)).join("")}</div>`),a("why_sky_colors_theme",a1("Sky colors apply with Colors set to Sky.")),a("ink_colors",`<p class="sub-h">Text and weather</p><div class="color-grid" id="ink-grid">${M2.map(l=>v(l,!0)).join("")}</div><button type="button" class="tb reset-colors-btn" id="reset-colors-btn" data-off>Reset all colors</button>`)].join(""),2)}
          ${o("planes","Planes",[a("flights_entity",w("flights_entity","Flights sensor",C.flights_entity,"Flightradar24's Current in area sensor. Each new flight crosses the card once")),a("plane_tags",_("plane_tags","Plane tags","Tags show only in open sky, never over the temperature")),a("plane_speed",_("plane_speed","Speed")),a("planes_on_load",Z("planes_on_load","Fly the planes already up",!!C.planes_on_load,"When the dashboard opens, not only new arrivals"))].join(""),3)}
          ${o("interactions","Interactions",a("actions",'<div id="actions-editor"></div>'),4)}
        </div></div></div>

        ${b("dev","",a("dev_mode",Z("dev_mode","Simulated weather",!!C.dev_mode,"The dev card's weather, with no weather entity needed")))}
      </div>
      <style>${J()}${M1}</style>
    `,this.attachEventListeners(),this.sync();for(let l of this.openDrawers)this.applyDrawer(l);this.syncColorInputs();let c=this.querySelector(".card-config");I(()=>I(()=>c?.removeAttribute("data-instant"))),setTimeout(()=>this.updateEntityPickers(),0)}attachEventListeners(){this.updateEntityPickers();let C=(r,o,p)=>this.querySelector(r)?.addEventListener(o,m=>p(m.target,m)),V=(r,o)=>this.querySelectorAll(`[id="${r}"] input[type="radio"]`).forEach(p=>p.addEventListener("change",()=>{p.checked&&o(p.value)}));C("#all_settings","change",r=>{this.all=!!r.checked,o1(this.all),this.sync();let o=this.querySelector("[data-live]");o&&(o.textContent=n1(this.all,!0))}),V("preset",r=>this.pickPreset(r)),C("#entity","value-changed",r=>this._set({entity:r.value})),C("#name","input",r=>this._set({name:r.value})),C("#show_location","change",r=>this._set({show_location:r.checked?void 0:!1}));for(let r of["outdoor_sensor_entity","feels_like_entity","alarm_entity","night_sensor","note_ai_task_entity","indoor_temperature_entity","indoor_humidity_entity","sun_entity","moon_entity","flights_entity"])C(`#${r}`,"value-changed",o=>{this._set({[r]:o.value||void 0}),r==="note_ai_task_entity"&&this.syncNoteStatus()});C("#another_place","change",r=>{if(this.placeOn=!!r.checked,this.placeOn){Object.keys(this.placeKept).length?this._set(this.placeKept):this.sync();return}let o=this._config??{};this.placeKept=Object.fromEntries(["latitude","longitude","time_zone"].filter(p=>o[p]!==void 0).map(p=>[p,o[p]])),this.pinned.delete("place_fields"),this._set({latitude:void 0,longitude:void 0,time_zone:void 0})}),L1(this,r=>this._set(r)),V("layout",r=>{this._set(r==="compact"?{compact:!0,layout:void 0}:r==="nightstand"?{layout:"nightstand",compact:void 0}:{compact:void 0,layout:void 0}),this.mountActions()}),V("color_palette",r=>{this._set({color_palette:r==="theme"?r:void 0}),this.syncColorInputs()}),C("#temperature_decimals","change",r=>this._set({temperature_decimals:r.checked?1:void 0}));for(let r of["wake_time","bed_time"])C(`#${r}`,"input",o=>{let p=(o.value||"").trim();this._set({[r]:/^\d{1,2}:\d{2}$/.test(p)?p:void 0})});this._bindSelect("night",[{value:"auto",label:"Automatic"},{value:"on",label:"Always"},{value:"off",label:"Never"}],this._config?.night===!0?"on":this._config?.night===!1?"off":String(this._config?.night||"auto"),r=>{this._set({night:r==="auto"?void 0:r})}),C("#night_lux","input",r=>{let o=Number((r.value||"").trim());this._set({night_lux:Number.isFinite(o)&&o>0&&o!==5?o:void 0})}),C("#night_red","change",r=>this._set({night_red:r.checked?void 0:!1})),C("#show_chips","change",r=>this._set({show_chips:r.checked?void 0:!1})),C("#show_forecast","change",r=>{this._set({show_forecast:r.checked||void 0}),this.mountActions()});let e=this._config?.show_days?String(this._config?.forecast_days??7):"none";this._bindSelect("forecast_days",[{value:"none",label:"None"},...Array.from({length:10},(r,o)=>({value:String(o+1),label:o?`${o+1} days`:"1 day"}))],e,r=>{this._set(r==="none"?{show_days:void 0}:{show_days:!0,forecast_days:r==="7"?void 0:Number(r)})}),this._bindSelect("forecast_metric",e2,this._config?.forecast_metric||"temp",r=>this._set({forecast_metric:r==="temp"?void 0:r})),this._bindSelect("forecast_graph",r2,this._config?.forecast_graph||"line",r=>this._set({forecast_graph:r==="line"?void 0:r})),this._bindSelect("time_date",this.timeDateOptions(),this.timeDateValue(),r=>{this._config?.hero==="clock"?this._set({show_date:r==="date"||void 0}):this._set({show_clock:r==="time"||r==="both"||void 0,show_date:r==="date"||r==="both"||void 0})}),V("hero",r=>{this._set({hero:r==="clock"?r:void 0}),this.refill.time_date?.(this.timeDateOptions(),this.timeDateValue())}),this._bindSelect("note_source",[{value:"off",label:"Off"},{value:"ai",label:"Written by your AI"},{value:"entity",label:"From an entity"}],this.noteSource(),r=>{let o=this._config??{};o.note_entity&&(this.noteEntityKept=o.note_entity),this.noteChoice=r==="entity"?"entity":void 0,r==="off"?this._set({show_note:void 0,note_entity:void 0}):r==="ai"?this._set({show_note:!0,note_entity:void 0}):this.noteEntityKept?this._set({note_entity:this.noteEntityKept,show_note:void 0}):(this.sync(),this.querySelector("#note_entity")?.focus()),this.syncNoteStatus()}),C("#note_entity","value-changed",r=>{let o=r.value||void 0;this.noteChoice=o?void 0:"entity",this._set(o?{note_entity:o,show_note:void 0}:{note_entity:void 0}),this.syncNoteStatus()}),this._bindSelect("note_tone",[{value:"snarky",label:"Snarky"},{value:"calm",label:"Calm"},{value:"friendly",label:"Friendly"},{value:"dry",label:"Dry"}],this._config?.note_tone||"snarky",r=>this._set({note_tone:r==="snarky"?void 0:r})),C("#note_calendar","value-changed",r=>{let o=[r.value,...X2(this._config?.note_calendar).slice(1)].filter(Boolean);this._set({note_calendar:o.length>1?o:o[0]||void 0})}),C("#note_attribute","input",r=>this._set({note_attribute:r.value.trim()||void 0})),C("#note_max_age","change",r=>{let o=r.value.trim(),p=parseInt(o);o?p>=0&&this._set({note_max_age:p===180?void 0:p}):this._set({note_max_age:void 0})}),C("#show_attributes","change",r=>this._set({show_attributes:r.checked?void 0:!1}));let L=this.querySelector(".readings-table");this.readingsEditor=L?u2(L,()=>this._config??{},r=>this._set(r),{open:this.readingOpen,onOpen:r=>{this.readingOpen=r}}):void 0,this.readingsEditor?.hass(this._hass);let i=(r,o)=>C(`#${r}`,"change",p=>{let m=p.value.trim(),c=m.split(",").map(s=>parseFloat(s)),l=c.length===o&&c.every((s,u)=>isFinite(s)&&(u===0||s>c[u-1]));this._set({[r]:m?l?c:m:void 0})});i("uv_levels",4),i("aqi_levels",5);let t=this._config??{};this._bindSelect("reading_style",[{value:"both",label:"Icon and label"},{value:"label",label:"Label"},{value:"icon",label:"Icon"},{value:"value",label:"The value alone"}],t.show_attribute_labels===!1?t.show_attribute_icons===!1?"value":"icon":t.show_attribute_icons===!1?"label":"both",r=>{this._set({show_attribute_labels:r==="icon"||r==="value"?!1:void 0,show_attribute_icons:r==="label"||r==="value"?!1:void 0})}),this._bindSelect("indoor_line",[{value:"label",label:'The word "Indoors"'},{value:"icon",label:"A house icon"},{value:"both",label:"Icon and word"},{value:"hidden",label:"Hidden"}],t.show_indoor===!1?"hidden":t.indoor_style||"label",r=>{this._set(r==="hidden"?{show_indoor:!1}:{show_indoor:void 0,indoor_style:r==="label"?void 0:r})}),C("#animate","change",r=>this._set({animate:r.checked?void 0:!1})),C("#spill_particles","change",r=>this._set({spill_particles:r.checked?void 0:!1})),C("#use_webgl","change",r=>this._set({use_webgl:r.checked||void 0})),C("#lightning_shake","change",r=>this._set({disable_lightning_shake:r.checked?void 0:!0})),C("#engine_auto","change",r=>{let o=this._config??{};r.checked&&this.pinned.delete("amounts"),this._set({engine_mode:r.checked?f1(o)?"auto":void 0:"manual"})}),C("#auto_pause","change",r=>this._set({auto_pause:r.checked||void 0})),V("sky_follows",r=>this._set({enable_day_night_cycle:r==="hours"||void 0}));for(let[r,o]of[["sunrise_hour",6],["sunset_hour",20]])C(`#${r}`,"change",p=>{let m=p.value.trim(),c=parseInt(m);m?c>=0&&c<=23&&this._set({[r]:c===o?void 0:c}):this._set({[r]:void 0})});for(let[r]of V2){let o=this.querySelector(`#${r}`);o&&(this.syncFill(o),o.addEventListener("input",()=>{let p=this.querySelector(`[data-out="${r}"]`);p&&(p.textContent=D.formatEngineValue(r,parseFloat(o.value))),this.syncFill(o)}),o.addEventListener("change",()=>this._updateEngineConfig(r,parseFloat(o.value))))}C(".reset-engine-btn","click",(r,o)=>{o.preventDefault(),this._resetEngineSettings()});for(let[r]of[...L2,...M2])C(`#${r}`,"input",o=>this.paintChip(o)),C(`#${r}`,"change",o=>this._updateColorConfig(r,o.value));this.querySelectorAll(".color-reset").forEach(r=>r.addEventListener("click",o=>{o.preventDefault(),this._resetColorConfig(r.dataset.target)})),C(".reset-colors-btn","click",(r,o)=>{o.preventDefault(),this._resetAllColors()});let A=this._config??{};this._bindSelect("plane_tags",[{value:"flight",label:"Flight number and aircraft"},{value:"route",label:"Route (Lisbon \u2192 Paris)"},{value:"both",label:"Route and flight number"},{value:"none",label:"None"}],A.show_flight_labels===!1?"none":A.flight_label||"flight",r=>{this._set(r==="none"?{show_flight_labels:!1}:{show_flight_labels:void 0,flight_label:r==="flight"?void 0:r})});let v=String(A.plane_speed??1);this._bindSelect("plane_speed",[{value:"1",label:"Usual"},{value:"0.5",label:"Half"},{value:"0.25",label:"A quarter"},...["1","0.5","0.25"].includes(v)?[]:[{value:v,label:`${v}\xD7 (set in YAML)`}]],v,r=>this._set({plane_speed:r==="1"?void 0:Number(r)})),C("#planes_on_load","change",r=>this._set({planes_on_load:r.checked||void 0})),this.mountActions(),C("#dev_mode","change",r=>this._set({dev_mode:r.checked||void 0})),this.querySelectorAll(".drw-btn").forEach(r=>r.addEventListener("click",()=>{let o=r.dataset.drawer;this.openDrawers.has(o)?this.openDrawers.delete(o):this.openDrawers.add(o),this.applyDrawer(o)})),this.syncNoteStatus()}applyDrawer(C){let V=this.openDrawers.has(C);this.querySelector(`[data-drawer="${C}"]`)?.setAttribute("aria-expanded",String(V));let e=this.querySelector(`[data-sec="${C}"] .drw-c`);e&&Z1(e,V,!!this.querySelector(".card-config[data-instant]"))}timeDateOptions(){return this._config?.hero==="clock"?[{value:"off",label:"Off"},{value:"date",label:"Date"}]:[{value:"off",label:"Off"},{value:"time",label:"Time"},{value:"date",label:"Date"},{value:"both",label:"Time and date"}]}timeDateValue(){let C=this._config??{};return C.hero==="clock"?C.show_date?"date":"off":C.show_clock&&C.show_date?"both":C.show_clock?"time":C.show_date?"date":"off"}sync(){let C=this.querySelector(".card-config");if(!C)return;let V=this._config??{},e=this.ctx(),L=C.hasAttribute("data-instant");C.toggleAttribute("data-all",e.all);let i=d1(C,u1,V,e,this.pinned,L),t=this.querySelector("[data-drawers]");t&&Z1(t,i,L);let A=(o,p)=>{let m=this.querySelector(o);m&&m.textContent!==p&&(m.textContent=p)},v=J1(V);this.querySelectorAll('#preset input[type="radio"]').forEach(o=>{o.checked=o.value===v}),A('[data-help="preset"]',v?X1(v).description:"Your own mix. Pick one to start again from it"),this.querySelector("[data-wall]")?.toggleAttribute("hidden",v!=="wall");let r=V.layout==="nightstand"?"nightstand":V.compact?"compact":"default";A('[data-help="layout"]',{default:"The sky, the temperature and your readings",compact:"One line, to sit under other cards",nightstand:"A bedside clock that goes dark at night"}[r]),A('[data-help="color_palette"]',V.color_palette==="theme"?"Your dashboard theme's colors, light or dark":"Colors from the weather and the time of day"),A('[data-help="hero"]',V.hero==="clock"?"The time leads, and the temperature starts the condition's line":"The temperature leads the card"),A('[data-help="sky_follows"]',V.enable_day_night_cycle?"Day and night change at the hours you set":"Dawn, day, dusk and night follow the sun"),A('[data-help="note"]',{off:"A line under the conditions: what's coming and what to wear",ai:"Your AI writes it from the forecast. The card grows a row to fit it",entity:"Text from a helper or a sensor of yours"}[e.note]);for(let o of K1)A(`[data-summary="${o}"]`,this.summary(o));this.querySelector('[data-status="entity"]')?.toggleAttribute("hidden",!!V.entity||!!V.dev_mode),this.querySelector(".reset-engine-btn")?.toggleAttribute("data-off",!Object.keys(E).some(o=>j(V,`engine_settings.${o}`))),this.syncPlaceholder(),this.readingsEditor?.sync()}summary(C){let V=this._config??{};if(C==="readings"){let t=H1(V),A=t.filter(v=>v.view).length;return[V.show_attributes===!1?"Off":t.filter(v=>!v.view).map(l1).join(", ")||"None",A?`${A} in the forecast view`:"",V.indoor_temperature_entity||V.indoor_humidity_entity?"Indoors":""].filter(Boolean).join(" \xB7 ")}if(C==="sky"){if(V.animate===!1)return"Still";let t=Object.keys(E).filter(v=>j(V,`engine_settings.${v}`)).length,A=q(V)==="auto"?"amounts follow the weather":t?`${t} ${t===1?"amount":"amounts"} changed`:"amounts set by hand";return["Moving",V.spill_particles===!1?"inside the card":"",V.enable_day_night_cycle?"set hours":"",A].filter(Boolean).join(" \xB7 ")}if(C==="colors"){let t=Object.values(V.custom_colors||{}).filter(Boolean).length;return t?`${t} ${t===1?"color":"colors"} set`:"None set"}if(C==="planes")return V.flights_entity||"Needs a Flightradar24 sensor";let e=V.tap_action?.action??_1(V),L={forecast:"A tap opens the forecast","more-info":"A tap opens the weather's details",none:"A tap does nothing",navigate:"A tap goes to a view",url:"A tap opens a link",toggle:"A tap toggles",assist:"A tap opens Assist"},i=["hold_action","double_tap_action"].filter(t=>{let A=V[t]?.action;return A&&A!=="none"}).length;return(L[e]??"A tap runs an action")+(i?" \xB7 more gestures set":"")}syncPlaceholder(){let C=this.querySelector("#name"),V=this._config?.entity,e=V?this._hass?.states?.[V]?.attributes?.friendly_name:void 0;!C||typeof e!="string"||!e||C.getAttribute("placeholder")===e||(C.setAttribute("placeholder",e),C.placeholder=e)}_bindSelect(C,V,e,L){let i=this.querySelector(`#${C}`);if(!i)return;let t={options:V,current:e},A=()=>{i.options=t.options,i.value=t.current};this.refill[C]=(v,r)=>{t={options:v,current:r},customElements.get("ha-select")&&A()},customElements.get("ha-select")?A():customElements.whenDefined("ha-select").then(A),i.addEventListener("selected",(v=>{let r=v.detail?.value;!r||r===i.value&&r===t.current||(i.value=r,t={...t,current:r},L(r))})),i.addEventListener("closed",v=>v.stopPropagation())}mountActions(){let C=this.querySelector("#actions-editor");if(!C)return;let V=e1(this._config,this._config?.entity),e=_1(this._config??{}),L=e==="more-info"?void 0:{action:e};z(C,this._hass,V.tap_action||!L?V:{...V,tap_action:L},i=>{let t={...i};L&&"tap_action"in i&&(t.tap_action=i.tap_action===void 0?{action:"more-info"}:i.tap_action.action===L.action?void 0:i.tap_action),this._set(t)},{forecast:"Forecast"})}syncNoteStatus(){this.updateNoteStatus()}async updateNoteStatus(){let C=this.querySelector("#note_status"),V=this._hass;if(!C)return;let e=this.noteSource()==="ai",L="",i=!1;e&&V&&(V.config?.components?.includes("ai_task")?this._config?.note_ai_task_entity||(this.noteDefault??(this.noteDefault=V.callWS({type:"ai_task/preferences/get"}).then(t=>t?.gen_data_entity_id??null).catch(()=>null)),await this.noteDefault||(L="You have no default AI Task. Pick one below, or set one in Settings \u2192 System \u2192 AI.",i=!0)):L="The note needs Home Assistant 2025.8 or later, with an AI integration that provides an AI Task, such as OpenAI or Anthropic."),C.dataset.text!==L&&(C.dataset.text=L,C.innerHTML=L?`${c1}<span></span>`:"",L&&(C.querySelector("span").textContent=L),C.hidden=!L),i!==this.noDefaultAi&&(this.noDefaultAi=i,this.sync())}_set(C){this._patchConfig(C),this.sync()}_patchConfig(C){this._config||(this._config={});let V=this._config;for(let[e,L]of Object.entries(C))L===""||L===null||L===void 0?delete V[e]:V[e]=L;this._fireConfigChanged()}pickPreset(C){let V=X1(C);if(V){for(let[e,L]of Object.entries(q1))L.keys.some(i=>T1.includes(i))&&this.pinned.delete(e);this._patchConfig({...Object.fromEntries(T1.map(e=>[e,void 0])),...V.options}),this.render(),this.querySelector(`#preset input[value="${C}"]`)?.focus()}}_updateConfig(C,V){this._set({[C]:V})}_updateEngineConfig(C,V){let L={...(this._config??(this._config={})).engine_settings||{}};V===E[C]?delete L[C]:L[C]=V,this._set({engine_settings:Object.keys(L).length?L:void 0,...this.staysManual(L)})}staysManual(C){let V=this._config??{};return V.engine_mode===void 0&&!f1({...V,engine_settings:C})?{engine_mode:"manual"}:{}}_resetEngineSettings(){for(let[C]of V2){let V=this.querySelector(`#${C}`),e=E[C];V&&(V.value=String(e),this.syncFill(V));let L=this.querySelector(`[data-out="${C}"]`);L&&(L.textContent=D.formatEngineValue(C,e))}this._set({engine_settings:void 0,...this.staysManual({})}),this.querySelector("#windSpeed")?.focus()}syncFill(C){let V=Number(C.min),e=Number(C.max),L=Number(C.value);C.style.setProperty("--fill",`${Math.max(0,Math.min(100,(L-V)/(e-V)*100))}%`)}static formatEngineValue(C,V){return C==="cloudCount"?String(Math.round(V)):C==="splashBounce"?`${Math.round(V)}%`:`${V.toFixed(1)}\xD7`}static hex(C){if(C){if(/^#[0-9a-f]{6}$/i.test(C))return C.toLowerCase();if(/^#[0-9a-f]{3}$/i.test(C))return`#${[...C.slice(1)].map(V=>V+V).join("")}`.toLowerCase();try{let V=document.createElement("canvas").getContext("2d");if(!V)return;V.fillStyle="#000",V.fillStyle=C;let e=String(V.fillStyle);if(/^#[0-9a-f]{6}$/i.test(e))return e;let L=e.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);return L?`#${L.slice(1,4).map(i=>Number(i).toString(16).padStart(2,"0")).join("")}`:void 0}catch{return}}}syncColorInputs(){let C=this._config?.custom_colors||{},V=this._config?.color_palette==="theme"?"var(--card-background-color, #fff)":D.DEFAULT_COLORS.sunny_bg;for(let[e]of[...L2,...M2]){let L=this.querySelector(`#${e}`);L&&(L.value=D.hex(C[e])??D.DEFAULT_COLORS[e],L.parentElement.style.setProperty("--sky",V),this.paintChip(L))}this._syncColorResets()}paintChip(C){let V=D.hex(C.value);V&&C.parentElement.style.setProperty("--c",V)}_updateColorConfig(C,V){let e={...this._config?.custom_colors||{},[C]:V};this._set({custom_colors:e}),this._syncColorResets()}_syncColorResets(){let C=this._config?.custom_colors||{};this.querySelectorAll(".color-reset").forEach(V=>{V.toggleAttribute("data-off",!C[V.dataset.target])}),this.querySelector("#reset-colors-btn")?.toggleAttribute("data-off",!Object.values(C).some(Boolean))}_resetColorConfig(C){let V={...this._config?.custom_colors||{}};delete V[C],this._set({custom_colors:Object.keys(V).length?V:void 0});let e=this.querySelector(`#${C}`);e&&(e.value=D.DEFAULT_COLORS[C]||e.value,this.paintChip(e),e.focus()),this._syncColorResets()}_resetAllColors(){this._set({custom_colors:void 0}),this.syncColorInputs()}_fireConfigChanged(){let C=new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0});this.dispatchEvent(C)}set hass(C){this._hass=C,this._initialized&&this.isConnected&&this.updateEntityPickers()}updateEntityPickers(){if(!this._hass||!this.isConnected||!this._initialized)return;this.syncNoteStatus(),this.syncPlaceholder(),r1(this.querySelector("#actions-editor"),this._hass),this.readingsEditor?.hass(this._hass),[{id:"#entity",domains:["weather"]},{id:"#outdoor_sensor_entity",domains:["sensor"]},{id:"#feels_like_entity",domains:["sensor"]},{id:"#indoor_temperature_entity",domains:["sensor"]},{id:"#indoor_humidity_entity",domains:["sensor"]},{id:"#sun_entity",domains:["sun"]},{id:"#moon_entity",domains:["sensor"]},{id:"#flights_entity",domains:["sensor"]},{id:"#alarm_entity",domains:["sensor","input_datetime"]},{id:"#night_sensor",domains:["sensor"]},{id:"#note_entity",domains:["sensor","input_text"]},{id:"#note_ai_task_entity",domains:["ai_task"]},{id:"#note_calendar",domains:["calendar"]}].forEach(({id:V,domains:e})=>{let L=this.querySelector(V);L&&(L.hass=this._hass,L.includeDomains=e)})}};D.DEFAULT_COLORS={sunny_bg:U("sunny","day").mid,rainy_bg:U("rainy","day").mid,snowy_bg:U("snowy","day").mid,stormy_bg:U("stormy","day").mid,windy_bg:U("windy","day").mid,cloudy_bg:U("cloudy","day").mid,fog_color:"#e0e0e0",text_color:C1(G(W1)),temperature_color:C1(G(W1)),sun_color:"#ffd67a",rain_color:"#deeaff",snow_color:"#f7fbff"};var P1=D;var O5=0,F1=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1;this.uid=++O5;this.all=i1();this.pinned=new Set;this.placeOn=!1;this.placeKept={}}setConfig(C){let V=JSON.stringify(C)===JSON.stringify(this._config);this._config={...C},this._initialized&&!V&&this._render()}set hass(C){this._hass=C,this._initialized&&this.isConnected&&(this._updatePickers(),r1(this.querySelector("#st-actions"),C))}async connectedCallback(){this._config=this._config||{},await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.pinned.clear(),this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let V=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),e=L=>{(L.reason?.message?.includes("localize")||L.reason?.message?.includes("hass"))&&L.preventDefault()};window.addEventListener("unhandledrejection",e);try{await V.constructor.getConfigElement?.()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",e),2e3)}catch{}}ctx(){return{all:this.all,place:this.placeOn,note:"off",noDefaultAi:!1}}_render(){let C=this._config;this.placeOn=this.placeOn||["latitude","longitude","time_zone"].some(e=>C[e]!==void 0&&C[e]!==""),this.innerHTML=`
            <div class="card-config" data-instant>
              ${A1(this.all)}
              ${b("sun",["sun","Sun"],[a("sun_entity",w("sun-picker","Sun entity",C.sun_entity)),a("layout",Q("layout","Layout",[["regular","Regular"],["compact","Compact"]],C.compact?"compact":"regular",this.uid)),a("color_palette",Q("color_palette","Colors",[["default","Sky"],["theme","Theme"]],C.color_palette==="theme"?"theme":"default",this.uid))].join(""))}
              ${b("shows",["shows","What it shows"],[a("title",y({id:"title",label:"Title (optional)",value:C.title,hint:"Above the next sunrise or sunset"})),a("show_header",Z("show_header","Next sunrise or sunset",C.show_header!==!1,"The headline time and the countdown to it")),a("show_details",Z("show_details","Details",C.show_details!==!1,"First and last light, solar noon, daylight and the moon")),a("daylight_delta",_("daylight_delta","Compare with","How much earlier or later the sunrise or sunset is, and how much longer or shorter the day")),a("moon_entity",w("moon-picker","Moon phase",C.moon_entity,"The Moon integration's sensor")),a("direction",_("direction","Direction","From your location, the sun runs right to left south of the equator"))].join(""))}
              ${b("sky",["place","Sky and place"],[a("weather_entity",w("weather-picker","Share the sky of",C.weather_entity,"Without one, the sky of the weather card on the same sun")),a("another_place",Z("another_place","Another place",this.placeOn,"Its sun, from its coordinates, and its times in its time zone")),a("place_fields",V1(C))].join(""))}
              ${b("interactions",["interactions","Interactions"],a("actions",'<div id="st-actions"></div>'))}
              ${b("dev","",a("dev_mode",Z("dev_mode","Simulated weather",!!C.dev_mode,"The dev card's sun and sky, with no sun entity needed")))}
            </div>
            <style>${J()}${M1}</style>
        `,this._updatePickers(),this._attachListeners(),z(this.querySelector("#st-actions"),this._hass,e1(this._config,this._config.sun_entity),e=>this._update(e)),this.sync();let V=this.querySelector(".card-config");I(()=>I(()=>V?.removeAttribute("data-instant")))}_updatePickers(){let C=[{id:"#sun-picker",domains:["sun"]},{id:"#moon-picker",domains:["sensor"]},{id:"#weather-picker",domains:["weather"]}];for(let V of C){let e=this.querySelector(V.id);e&&(this._hass&&(e.hass=this._hass),e.includeDomains=V.domains)}}_attachListeners(){this.querySelector("#all_settings")?.addEventListener("change",V=>{this.all=!!V.target.checked,o1(this.all),this.sync();let e=this.querySelector("[data-live]");e&&(e.textContent=n1(this.all,!1))}),this.querySelector("#sun-picker")?.addEventListener("value-changed",V=>{this._update({sun_entity:V.detail.value||void 0})}),this.querySelector("#moon-picker")?.addEventListener("value-changed",V=>{this._update({moon_entity:V.detail.value||void 0})}),this.querySelector("#weather-picker")?.addEventListener("value-changed",V=>{this._update({weather_entity:V.detail.value||void 0})}),this.querySelector("#title")?.addEventListener("input",V=>{this._update({title:V.target.value||void 0})}),p1(this,"layout",V=>this._update({compact:V==="compact"||void 0})),p1(this,"color_palette",V=>this._update({color_palette:V==="theme"?"theme":void 0}));let C=(V,e)=>{this.querySelector(`#${V}`)?.addEventListener("change",L=>this._update(e(L.target.checked)))};C("show_header",V=>({show_header:V?void 0:!1})),C("show_details",V=>({show_details:V?void 0:!1})),C("dev_mode",V=>({dev_mode:V||void 0})),X(this,"daylight_delta",[{value:"day",label:"Yesterday"},{value:"week",label:"Last week"},{value:"month",label:"Last month"},{value:"none",label:"Nothing"}],this._config.daylight_delta??"day",V=>this._update({daylight_delta:V==="day"?void 0:V})),X(this,"direction",[{value:"auto",label:"From your location"},{value:"left_to_right",label:"Left to right"},{value:"right_to_left",label:"Right to left"}],this._config.direction??"auto",V=>this._update({direction:V==="auto"?void 0:V})),this.querySelector("#another_place")?.addEventListener("change",V=>{if(this.placeOn=!!V.target.checked,this.placeOn){Object.keys(this.placeKept).length?this._update(this.placeKept):this.sync();return}let e=this._config;this.placeKept=Object.fromEntries(["latitude","longitude","time_zone"].filter(L=>e[L]!==void 0).map(L=>[L,e[L]])),this.pinned.delete("place_fields"),this._update({latitude:void 0,longitude:void 0,time_zone:void 0})}),L1(this,V=>this._update(V))}sync(){let C=this.querySelector(".card-config");if(!C)return;let V=this._config;d1(C,_2,V,this.ctx(),this.pinned,C.hasAttribute("data-instant"));let e=(L,i)=>{let t=this.querySelector(L);t&&t.textContent!==i&&(t.textContent=i)};e('[data-help="layout"]',V.compact?"One line: the next sunrise or sunset beside the sun's path":"The sun's path through the day, the next sunrise or sunset, and the day's details"),e('[data-help="color_palette"]',V.color_palette==="theme"?"Your dashboard theme's colors, light or dark":"The sky of the weather it shares, at the time of day")}_update(C){let V={...this._config,...C};for(let e of Object.keys(V))(V[e]===void 0||V[e]==="")&&delete V[e];this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})),this.sync()}};var t2=["0","3","5","7","10"].map(H=>({value:H,label:H==="0"?"No days":`${H} days`})),y5=0,R1=class extends HTMLElement{constructor(){super(...arguments);this._config={};this._initialized=!1;this.uid=++y5;this.all=i1();this.pinned=new Set;this.placeOn=!1;this.placeKept={}}setConfig(C){let V=JSON.stringify(C)===JSON.stringify(this._config);this._config={...C},this._initialized&&!V&&this._render()}set hass(C){this._hass=C,this._initialized&&this.isConnected&&(this._updatePickers(),r1(this.querySelector("#fc-actions"),C))}async connectedCallback(){await this._ensureEntityPickerLoaded(),this._render(),this._initialized=!0,this._hass&&this._updatePickers()}disconnectedCallback(){this.pinned.clear(),this.innerHTML=""}async _ensureEntityPickerLoaded(){if(!customElements.get("ha-entity-picker"))try{let V=await(await window.loadCardHelpers()).createCardElement({type:"entities",entities:[]}),e=L=>{(L.reason?.message?.includes("localize")||L.reason?.message?.includes("hass"))&&L.preventDefault()};window.addEventListener("unhandledrejection",e);try{await V.constructor.getConfigElement?.()}catch{}setTimeout(()=>window.removeEventListener("unhandledrejection",e),2e3)}catch{}}ctx(){return{all:this.all,place:this.placeOn,note:"off",noDefaultAi:!1}}_render(){let C=this._config;this.placeOn=this.placeOn||["latitude","longitude","time_zone"].some(e=>C[e]!==void 0&&C[e]!==""),this.innerHTML=`
            <div class="card-config" data-instant>
              ${A1(this.all)}
              ${b("forecast",["weather","Forecast"],[a("entity",w("weather-picker","Weather entity",C.entity)),a("layout",Q("layout","Layout",[["card","Card"],["strip","Strip"]],C.compact?"strip":"card",this.uid)),a("color_palette",Q("color_palette","Colors",[["default","Sky"],["theme","Theme"]],C.color_palette==="theme"?"theme":"default",this.uid)),a("forecast_metric",_("forecast_metric","Hours show","Temperature, rain, wind and the rest: what the hours and the days open on"))].join(""))}
              ${b("shows",["shows","What it shows"],[a("show_summary",Z("show_summary","The line at the top",C.show_summary!==!1,'What turns and when: "Rain from 17:00 to 19:00". While you drag, it names the hour and brings you back to now')),a("show_hours",Z("show_hours","The hours",C.show_hours!==!1,"The hourly row and its chips: drag it, and the sky goes there")),a("forecast_days",_("forecast_days","Days")),a("show_chips",Z("show_chips","Buttons under the hours",C.show_chips!==!1,"One for each value, to change what the hours show. Off, they stay on what Hours show says")),a("forecast_graph",_("forecast_graph","Graph")),a("weather_effects",Z("weather_effects","Weather",!!C.weather_effects,"Rain, snow, fog, wind and lightning behind the forecast, going to the hour you drag to")),a("use_webgl",Z("use_webgl","WebGL (experimental)",C.use_webgl===!0,"Draw supported effects with WebGL when hardware acceleration is available"))].join(""))}
              ${b("sky",["place","Sun and place"],[a("sun_entity",w("sun-picker","Sun",C.sun_entity,"Sets the sky's time of day and the icons' light. Usually sun.sun")),a("another_place",Z("another_place","Weather for another place",this.placeOn,"Its sun, and its times in its time zone")),a("place_fields",V1(C))].join(""))}
              ${b("interactions",["interactions","Interactions"],a("actions",'<div id="fc-actions"></div>'))}
              ${b("dev","",a("dev_mode",Z("dev_mode","Simulated weather",!!C.dev_mode,"The dev card's weather, with no weather entity needed")))}
            </div>
            <style>${J()}${M1}</style>
        `,this._updatePickers(),this._bind(),this.sync();let V=this.querySelector(".card-config");I(()=>I(()=>V?.removeAttribute("data-instant")))}_bind(){let C=this._config;this.querySelector("#all_settings")?.addEventListener("change",t=>{this.all=!!t.target.checked,o1(this.all),this.sync();let A=this.querySelector("[data-live]");A&&(A.textContent=n1(this.all,!1))}),this.querySelector("#weather-picker")?.addEventListener("value-changed",t=>{this._update({entity:t.detail.value||void 0})}),this.querySelector("#sun-picker")?.addEventListener("value-changed",t=>{this._update({sun_entity:t.detail.value||void 0})}),p1(this,"layout",t=>this._update({compact:t==="strip"||void 0})),p1(this,"color_palette",t=>this._update({color_palette:t==="theme"?"theme":void 0}));let V=(t,A)=>{this.querySelector(`#${t}`)?.addEventListener("change",v=>this._update(A(v.target.checked)))};V("show_summary",t=>({show_summary:t?void 0:!1})),V("show_hours",t=>({show_hours:t?void 0:!1})),V("show_chips",t=>({show_chips:t?void 0:!1})),V("weather_effects",t=>({weather_effects:t||void 0})),V("use_webgl",t=>({use_webgl:t||void 0})),V("dev_mode",t=>({dev_mode:t||void 0})),X(this,"forecast_metric",e2,C.forecast_metric??"temp",t=>this._update({forecast_metric:t==="temp"?void 0:t})),X(this,"forecast_graph",r2,C.forecast_graph??"line",t=>this._update({forecast_graph:t==="line"?void 0:t}));let e=String(C.forecast_days??7),L=t2.some(t=>t.value===e)||!Number.isFinite(Number(e))?t2:[...t2,{value:e,label:`${e} day${e==="1"?"":"s"}`}].sort((t,A)=>Number(t.value)-Number(A.value));X(this,"forecast_days",L,e,t=>this._update({forecast_days:t==="7"?void 0:Number(t)})),this.querySelector("#another_place")?.addEventListener("change",t=>{if(this.placeOn=!!t.target.checked,this.placeOn){Object.keys(this.placeKept).length?this._update(this.placeKept):this.sync();return}let A=this._config;this.placeKept=Object.fromEntries(["latitude","longitude","time_zone"].filter(v=>A[v]!==void 0).map(v=>[v,A[v]])),this.pinned.delete("place_fields"),this._update({latitude:void 0,longitude:void 0,time_zone:void 0})}),L1(this,t=>this._update(t));let i=e1(this._config,this._config.entity);z(this.querySelector("#fc-actions"),this._hass,i.tap_action?i:{...i,tap_action:{action:"forecast"}},t=>this._update(t.tap_action===void 0&&"tap_action"in t?{...t,tap_action:{action:"more-info"}}:t.tap_action?.action==="forecast"?{...t,tap_action:void 0}:t),{forecast:"Forecast"})}sync(){let C=this.querySelector(".card-config");if(!C)return;let V=this._config;d1(C,b2,V,this.ctx(),this.pinned,C.hasAttribute("data-instant"));let e=(L,i)=>{let t=this.querySelector(L);t&&t.textContent!==i&&(t.textContent=i)};e('[data-help="layout"]',V.compact?"The hours alone, to sit under the compact weather card":"The hours and the week ahead"),e('[data-help="color_palette"]',V.color_palette==="theme"?"Your dashboard theme's colors, light or dark":"Colors from the weather and the time of day")}_updatePickers(){let C=[{id:"#weather-picker",domains:["weather"]},{id:"#sun-picker",domains:["sun"]}];for(let V of C){let e=this.querySelector(V.id);e&&(this._hass&&(e.hass=this._hass),e.includeDomains=V.domains)}}_update(C){let V={...this._config,...C};for(let e of Object.keys(V))(V[e]===void 0||V[e]==="")&&delete V[e];this._config=V,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0})),this.sync()}};customElements.get("animated-weather-card-editor")||customElements.define("animated-weather-card-editor",P1);customElements.get("animated-sun-tracker-editor")||customElements.define("animated-sun-tracker-editor",F1);customElements.get("animated-forecast-card-editor")||customElements.define("animated-forecast-card-editor",R1);})();
