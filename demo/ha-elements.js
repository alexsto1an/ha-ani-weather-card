// Stand-ins for the two Home Assistant elements the cards use, ha-card and
// ha-icon, built like the real ones so the cards lay out as they do on a
// dashboard. Icons come from icons.js, which demo/build.mjs generates.
(function () {
    customElements.define('ha-card', class extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' }).innerHTML = `<style>
                :host {
                    display: block; position: relative; box-sizing: border-box;
                    background: var(--ha-card-background, var(--card-background-color, #fff));
                    border-radius: var(--ha-card-border-radius, 12px);
                    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, #e0e0e0));
                    color: var(--primary-text-color);
                    transition: all 0.3s ease-out;
                }
            </style><slot></slot>`;
        }
    });

    // Like Home Assistant's: an unstyled host wrapping the sized, inline-flex
    // ha-svg-icon box (frontend src/components/ha-icon.ts, ha-svg-icon.ts)
    const icons = window.AWC_DEMO_ICONS || {};
    const paint = (el) => {
        const path = icons[el.getAttribute('icon') || ''];
        el.shadowRoot.innerHTML = '<style>:host{fill:currentcolor}.svg-icon{display:inline-flex;align-items:center;justify-content:center;position:relative;vertical-align:middle;fill:currentcolor;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;pointer-events:none;display:block}</style>'
            + (path ? `<span class="svg-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg></span>` : '');
    };
    customElements.define('ha-icon', class extends HTMLElement {
        static get observedAttributes() { return ['icon']; }
        constructor() { super(); this.attachShadow({ mode: 'open' }); }
        connectedCallback() { paint(this); }
        attributeChangedCallback() { paint(this); }
        set icon(value) { this.setAttribute('icon', value); }
        get icon() { return this.getAttribute('icon'); }
    });
})();
