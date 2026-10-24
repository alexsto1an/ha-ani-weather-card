// Code on the demo's pages: YAML coloured the way the cards' docs show it,
// the page's icons, and a Copy button. Shared by the live demo and the setup
// guide, so the two read alike.

const ICONS = window.AWC_DEMO_ICONS || {};

/** An icon from icons.js (demo/build.mjs writes only the ones the pages name). */
export const svgIcon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[name] || ''}"/></svg>`;

const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

/** One line of YAML as HTML: keys, punctuation, values and comments each their own colour. */
export function highlight(line) {
    if (/^\s*#/.test(line)) return `<span class="y-comment">${escape(line)}</span>`;
    const match = line.match(/^(\s*)(- )?([\w.-]+)(:)(\s*)(.*?)(\s+#.*)?$/);
    if (!match) return escape(line);
    let [, indent, dash, key, colon, space, value, comment] = match;
    // A key with no value and a comment after it: the gap before the # isn't a value
    if (value.startsWith('#')) {
        comment = space + value;
        space = '';
        value = '';
    }
    return `${indent}${dash ? '<span class="y-dash">- </span>' : ''}<span class="y-key">${key}</span><span class="y-punct">${colon}</span>${space}`
        + `${value ? `<span class="y-val">${escape(value)}</span>` : ''}${comment ? `<span class="y-comment">${escape(comment)}</span>` : ''}`;
}

/** A Copy button for some text: it says Copied for a moment, or selects the text where there's no clipboard. */
export function copyButton(button, text, source) {
    const icon = button.querySelector('.copy-icon');
    const label = button.querySelector('.copy-label');
    icon.innerHTML = svgIcon('mdi:content-copy');
    let reset = 0;
    button.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(text());
        } catch {
            // No clipboard (an insecure page, an old browser): select it instead
            getSelection().selectAllChildren(source);
            return;
        }
        clearTimeout(reset);
        button.classList.add('is-done');
        icon.innerHTML = svgIcon('mdi:check');
        label.textContent = 'Copied';
        reset = setTimeout(() => {
            button.classList.remove('is-done');
            icon.innerHTML = svgIcon('mdi:content-copy');
            label.textContent = 'Copy';
        }, 1800);
    });
}
