// The setup guide: one card at the top, writing its note through the demo's
// stand-in Home Assistant and lighting the wall with its sky; code blocks
// coloured like the demo's, each with a Copy button; and the contents
// following the section you're reading.

import { ENTITIES, buildHass, phaseForHour, sunAt } from './scene.mjs';
import { copyButton, highlight } from './code.mjs';

// ── The card: the sample's partly cloudy sky at your time of day ──────
const slot = document.getElementById('guide-card');
if (slot && customElements.get('animated-weather-card')) {
    const now = new Date();
    const card = document.createElement('animated-weather-card');
    card.setConfig({
        type: 'custom:animated-weather-card',
        entity: ENTITIES.weather,
        sun_entity: ENTITIES.sun,
        show_note: true,
        // The guide's text sits close under it: keep the weather inside
        spill_particles: false,
    });
    slot.append(card);
    card.hass = buildHass({
        conditionId: 'partlycloudy',
        phase: phaseForHour(now.getHours()),
        sun: sunAt(now.getHours() * 60 + now.getMinutes()),
        now,
    });

    // Once it has drawn its sky, the page takes the sky's tint and the
    // light behind the card comes up
    const started = Date.now();
    const light = () => {
        const sky = card.querySelector('.animated-weather-card');
        if (sky && !sky.classList.contains('loading')) {
            const mid = getComputedStyle(sky).getPropertyValue('--awc-sky-mid').trim();
            if (mid) document.documentElement.style.setProperty('--page-sky', mid);
            slot.closest('.guide-window')?.classList.add('is-lit');
        } else if (Date.now() - started < 8000) {
            setTimeout(light, 120);
        }
    };
    light();
}

// ── Code: coloured YAML, and a Copy button for the text as written ────
for (const block of document.querySelectorAll('.code')) {
    const code = block.querySelector('pre code');
    if (!code) continue;
    const text = code.textContent;
    if (block.dataset.lang === 'yaml') {
        code.innerHTML = text.split('\n').map(line => `<span class="y-line">${highlight(line)}</span>`).join('');
    }
    const button = block.querySelector('.copy');
    if (button) copyButton(button, () => text, code);
}

// ── Contents: the section you're reading, in white ───────────────────
const links = new Map(Array.from(document.querySelectorAll('.toc a'), link => [link.hash.slice(1), link]));
const chapters = Array.from(document.querySelectorAll('.chapter')).filter(chapter => links.has(chapter.id));
let frame = 0;
function follow() {
    frame = 0;
    // The last section whose top has passed a third of the way down
    const line = innerHeight / 3;
    let current = null;
    for (const chapter of chapters) {
        if (chapter.getBoundingClientRect().top <= line) current = chapter.id;
    }
    // At the very bottom, the last section, however short
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 2 && chapters.length) {
        current = chapters[chapters.length - 1].id;
    }
    for (const [id, link] of links) {
        if (id === current) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    }
}
addEventListener('scroll', () => { frame ||= requestAnimationFrame(follow); }, { passive: true });
addEventListener('resize', () => { frame ||= requestAnimationFrame(follow); });
follow();
