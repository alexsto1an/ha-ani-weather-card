// The pop-up's frame: a native <dialog>, opened modal, in a shadow root of
// its own on the page's body. The top layer puts it above Home Assistant's
// own dialogs and sidebars; showModal() makes the rest of the page inert,
// moves focus in, and Escape closes it. Focus goes back to the card when it
// closes. Its look and its contents come from the forecast's drawings.

export interface DialogOptions {
    /** The dialog's accessible name */
    label: string;
    /** Styles for what's inside, scoped to the dialog's shadow root */
    css: string;
    /** Its contents (the dialog element itself is made here) */
    html: string;
    /** Classes for the dialog, e.g. its sky */
    className?: string;
    /** Custom properties for the dialog (the sky's colours) */
    style?: Record<string, string>;
    /** Where focus goes back to */
    returnFocus?: HTMLElement | null;
    /** Still: no movement on the way in or out, only a short fade */
    still: boolean;
    /** Called once the dialog is in the page, to wire up its contents */
    mounted?(dialog: HTMLDialogElement): void;
    /** Called when it has closed, however it closed */
    closed?(): void;
}

/** How long it takes to leave; the CSS's own timings must match (data-closing). Still, it just goes. */
const CLOSE_MS = 200;

/** Open a dialog; returns the way to close it: with its exit, or at once (to hand over to another dialog) */
export function openDialog(options: DialogOptions): (immediately?: boolean) => void {
    const host = document.createElement('awc-forecast-popup');
    host.style.position = 'fixed';
    host.style.zIndex = '10';
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = `<style>${options.css}</style><dialog class="${options.className ?? ''}" aria-label="${options.label.replace(/"/g, '&quot;')}">${options.html}</dialog>`;
    const dialog = root.querySelector('dialog') as HTMLDialogElement;
    for (const [name, value] of Object.entries(options.style ?? {})) dialog.style.setProperty(name, value);
    dialog.toggleAttribute('data-still', options.still);
    document.body.appendChild(host);

    // The page behind doesn't scroll while it's open (iOS scrolls it otherwise)
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = 'hidden';

    let closing = false;
    let done = false;
    const finish = () => {
        if (done) return;
        done = true;
        if (dialog.open) {
            if (typeof dialog.close === 'function') dialog.close();
            else dialog.removeAttribute('open');
        }
        host.remove();
        html.style.overflow = overflow;
        // Back where it was opened from, if that's still on the page
        const back = options.returnFocus;
        if (back?.isConnected) back.focus({ preventScroll: true });
        options.closed?.();
    };
    const close = (immediately = false) => {
        if (done) return;
        if (immediately || options.still) {
            finish();
            return;
        }
        if (closing) return;
        closing = true;
        dialog.dataset.closing = '';
        window.setTimeout(finish, CLOSE_MS);
    };

    // Escape: let the exit play rather than vanish
    dialog.addEventListener('cancel', (e) => {
        e.preventDefault();
        close();
    });
    // A click on the backdrop (the dialog's own box, outside its sheet) closes it
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) close();
    });
    // Its close buttons, however often its contents are drawn again
    root.addEventListener('click', (e) => {
        if ((e.target as Element | null)?.closest?.('[data-close]')) close();
    });
    try {
        dialog.showModal();
    } catch {
        dialog.setAttribute('open', '');
    }
    // Focus the sheet itself, not its first button: screen readers start at the top
    (root.querySelector('[data-autofocus]') as HTMLElement | null)?.focus({ preventScroll: true });
    options.mounted?.(dialog);
    return close;
}
