import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';
import '../../src/sun-tracker-card';
import { textField } from '../../src/utils';

type Editor = HTMLElement & { setConfig(config: object): void };

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

async function mount(tag: string, config: object): Promise<Editor> {
    const editor = document.createElement(tag) as Editor;
    editor.setConfig(config);
    document.body.appendChild(editor);
    await flush();
    await flush();
    return editor;
}

function parse(html: string): HTMLElement {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content.firstElementChild as HTMLElement;
}

// customElements.define can't be undone, so these run in order: neither element
// defined, then Home Assistant before 2026.5 (ha-textfield), then 2026.5 on (ha-input)
describe('the editors\' text fields', () => {
    afterEach(() => document.body.replaceChildren());

    it('are ha-input when neither element is defined yet', async () => {
        const editor = await mount('animated-weather-card-editor', {
            type: 'custom:animated-weather-card', entity: 'weather.home', show_note: true, note_attribute: 'summary',
        });
        expect(editor.querySelector('ha-textfield')).toBeNull();
        expect([...editor.querySelectorAll('ha-input')].map(field => field.id))
            .toEqual(['name', 'note_attribute', 'note_max_age', 'sunrise_hour', 'sunset_hour']);
        const attribute = editor.querySelector('#note_attribute')!;
        expect(attribute.getAttribute('value')).toBe('summary');
        expect(attribute.getAttribute('hint')).toBe('Shown where there\'s room for two lines');

        const tracker = await mount('animated-sun-tracker-editor', {
            type: 'custom:animated-sun-tracker-card', sun_entity: 'sun.sun', title: 'The sun',
        });
        expect(tracker.querySelector('#title')?.localName).toBe('ha-input');
        expect(tracker.querySelector('#title')?.getAttribute('value')).toBe('The sun');
    });

    it('give the entity pickers their help text as helper', async () => {
        const editor = await mount('animated-weather-card-editor', { type: 'custom:animated-weather-card', entity: 'weather.home' });
        expect(editor.querySelector('#entity')?.getAttribute('helper')).toBe('Required unless developer mode is on');
        expect(editor.querySelector('[helper-text]')).toBeNull();
    });

    it('are ha-textfield where Home Assistant still has it, with the help text always shown', () => {
        customElements.define('ha-textfield', class extends HTMLElement {});
        const field = parse(textField({ id: 'note_max_age', label: 'Hide after (minutes)', type: 'number', min: 0, value: 0, hint: 'Help' }));
        expect(field.localName).toBe('ha-textfield');
        expect(field.getAttribute('value')).toBe('0');
        expect(field.getAttribute('min')).toBe('0');
        expect(field.getAttribute('helper')).toBe('Help');
        expect(field.hasAttribute('helperpersistent')).toBe(true);
    });

    it('are ha-input once Home Assistant defines it, with values escaped', () => {
        customElements.define('ha-input', class extends HTMLElement {});
        const field = parse(textField({ id: 'name', label: 'Name', value: '"Home" <b>' }));
        expect(field.localName).toBe('ha-input');
        expect(field.getAttribute('value')).toBe('"Home" <b>');
        expect(field.hasAttribute('hint')).toBe(false);
    });
});
