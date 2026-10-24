import { describe, it, expect, afterEach } from 'vitest';
import '../../src/animated-weather-card-editor';

type Editor = HTMLElement & { setConfig(config: object): void; hass: unknown };

const flush = () => new Promise(resolve => setTimeout(resolve, 0));

function hass(components: string[], defaultEntity: string | null = 'ai_task.claude') {
    return {
        states: {},
        config: { components },
        callWS: async (message: { type: string }) =>
            message.type === 'ai_task/preferences/get' ? { gen_data_entity_id: defaultEntity } : null,
    };
}

describe('the editor\'s weather note', () => {
    let editor: Editor;

    async function mount(config: object, state: object): Promise<Editor> {
        editor = document.createElement('animated-weather-card-editor') as Editor;
        editor.setConfig({ type: 'custom:animated-weather-card', entity: 'weather.home', ...config });
        document.body.appendChild(editor);
        await flush();
        editor.hass = state;
        await flush();
        await flush();
        return editor;
    }

    const status = () => editor.querySelector('#note_status') as HTMLElement;
    const aiOptions = () => [...editor.querySelectorAll<HTMLElement>('.note-ai')];

    afterEach(() => editor?.remove());

    it('says the note needs Home Assistant 2025.8 when there is no AI Task', async () => {
        await mount({ show_note: true }, hass(['weather']));
        expect(status().hidden).toBe(false);
        expect(status().textContent).toContain('Home Assistant 2025.8 or later');
    });

    it('asks for an AI Task when there is no default', async () => {
        await mount({ show_note: true }, hass(['ai_task'], null));
        expect(status().textContent).toContain('Settings → System → AI');
    });

    it('says nothing when the default AI Task will write it, or one is picked', async () => {
        await mount({ show_note: true }, hass(['ai_task']));
        expect(status().hidden).toBe(true);
        editor.remove();
        await mount({ show_note: true, note_ai_task_entity: 'ai_task.openai' }, hass(['ai_task'], null));
        expect(status().hidden).toBe(true);
    });

    it('dims the AI\'s options while the switch is off, or an entity writes the note', async () => {
        await mount({}, hass(['ai_task']));
        expect(aiOptions().every(option => option.style.opacity === '0.5')).toBe(true);
        expect(status().hidden).toBe(true);
        editor.remove();
        await mount({ show_note: true, note_entity: 'input_text.note' }, hass(['ai_task']));
        expect(aiOptions().every(option => option.style.opacity === '0.5')).toBe(true);
        editor.remove();
        await mount({ show_note: true }, hass(['ai_task']));
        expect(aiOptions().every(option => option.style.opacity === '')).toBe(true);
    });

    it('takes the hours out from a calendar, keeping any others from YAML', async () => {
        await mount({ show_note: true, note_calendar: ['calendar.family', 'calendar.work'] }, hass(['ai_task']));
        const picker = editor.querySelector('#note_calendar') as HTMLElement & { value: string };
        expect(picker.closest('.note-ai')).not.toBeNull();
        expect(picker.getAttribute('value')).toBe('calendar.family');
        let config: Record<string, unknown> | undefined;
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        picker.value = 'calendar.home';
        picker.dispatchEvent(new Event('value-changed'));
        expect(config?.note_calendar).toEqual(['calendar.home', 'calendar.work']);
        editor.remove();
        await mount({ show_note: true, note_calendar: 'calendar.family' }, hass(['ai_task']));
        editor.addEventListener('config-changed', (e) => { config = (e as CustomEvent).detail.config; });
        const single = editor.querySelector('#note_calendar') as HTMLElement & { value: string };
        single.value = '';
        single.dispatchEvent(new Event('value-changed'));
        expect(config).not.toHaveProperty('note_calendar');
    });
});
