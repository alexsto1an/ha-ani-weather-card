// Tap, hold and double-tap actions, as Home Assistant's own cards have them

/** One of Home Assistant's card actions: more-info, navigate, url, toggle, perform-action, assist, none */
export interface ActionConfig {
    action: string;
    [key: string]: unknown;
}

/** What Home Assistant runs a gesture's action against: the entity, and each gesture's action */
export interface ActionsConfig {
    entity?: string;
    tap_action?: ActionConfig;
    hold_action?: ActionConfig;
    double_tap_action?: ActionConfig;
}

export type Gesture = 'tap' | 'hold' | 'double_tap';

/**
 * Actions the card runs itself instead of handing to Home Assistant, by
 * name: `forecast` opens the forecast pop-up. Any other action still goes
 * to Home Assistant.
 */
export type LocalActions = Partial<Record<string, (gesture: Gesture) => void>>;

/** The card's own actions, for the editors */
export const CARD_ACTIONS = ['forecast'] as const;

export const GESTURES: readonly Gesture[] = ['tap', 'hold', 'double_tap'];

/** Home Assistant's own timings: how long a press lasts to be a hold, and how soon a second tap makes a double tap */
const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;
/** A press that moves farther than this is a scroll or a drag, not a tap */
const MOVE_TOLERANCE_PX = 10;

/** An action as YAML wrote it: an object with an action, or nothing (a bare string is a mistake) */
export function readAction(value: unknown): ActionConfig | undefined {
    return value && typeof value === 'object' && typeof (value as ActionConfig).action === 'string'
        ? value as ActionConfig : undefined;
}

/** The entity and the three gestures' actions from a card's config */
export function readActions(config: Record<string, unknown> | undefined, entity: string | undefined): ActionsConfig {
    return {
        entity,
        tap_action: readAction(config?.tap_action),
        hold_action: readAction(config?.hold_action),
        double_tap_action: readAction(config?.double_tap_action),
    };
}

/** The action set for a gesture does something */
export function hasAction(action: ActionConfig | undefined): boolean {
    return !!action && action.action !== 'none';
}

/** A tap does something: its own action, or by default the entity's details */
export function tapDoesSomething(config: ActionsConfig): boolean {
    return config.tap_action ? hasAction(config.tap_action) : !!config.entity;
}

/**
 * Run a gesture's action. With no tap_action, a tap opens the entity's
 * more-info dialog with hass-more-info, as the card always has: every Home
 * Assistant version handles it. An action that's set goes to Home Assistant
 * as hass-action (2023.7 and later), which runs it the way its own cards do.
 * An unset hold or double tap does nothing; Home Assistant would open
 * more-info for it.
 */
export function fireAction(host: HTMLElement, config: ActionsConfig, gesture: Gesture, local: LocalActions = {}): void {
    const action = config[`${gesture}_action`];
    // Only the table's own entries: an action named "constructor" isn't one of them
    const own = action && Object.prototype.hasOwnProperty.call(local, action.action) ? local[action.action] : undefined;
    if (own) {
        own(gesture);
        return;
    }
    if (gesture === 'tap' && !action) {
        if (config.entity) {
            host.dispatchEvent(new CustomEvent('hass-more-info', {
                detail: { entityId: config.entity }, bubbles: true, composed: true,
            }));
        }
        return;
    }
    if (!hasAction(action)) return;
    host.dispatchEvent(new CustomEvent('hass-action', {
        detail: { config, action: gesture }, bubbles: true, composed: true,
    }));
}

/**
 * Make an element the card's touch target. A tap, a hold and a double tap
 * fire their actions from the host (or run the card's own, `local`), and
 * Enter or Space taps from the keyboard. A tap waits to see if a second follows only when a double tap is
 * set, and a hold is watched for only when one is set, so a plain tap is
 * never slowed down. The config is read at each gesture, so a new one applies
 * without binding again; binding the same element twice does nothing.
 */
export function bindActions(target: HTMLElement, host: HTMLElement, getConfig: () => ActionsConfig, local: LocalActions = {}): void {
    if (target.dataset.actionsBound) return;
    target.dataset.actionsBound = '1';

    let start: { x: number; y: number } | null = null;
    let held = false;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let tapTimer: ReturnType<typeof setTimeout> | undefined;

    const stopHold = () => {
        clearTimeout(holdTimer);
        holdTimer = undefined;
    };
    const cancel = () => {
        start = null;
        stopHold();
    };
    const tap = () => {
        if (!hasAction(getConfig().double_tap_action)) {
            fireAction(host, getConfig(), 'tap', local);
        } else if (tapTimer) {
            clearTimeout(tapTimer);
            tapTimer = undefined;
            fireAction(host, getConfig(), 'double_tap', local);
        } else {
            tapTimer = setTimeout(() => {
                tapTimer = undefined;
                fireAction(host, getConfig(), 'tap', local);
            }, DOUBLE_TAP_MS);
        }
    };

    target.addEventListener('pointerdown', (e: PointerEvent) => {
        if (e.button !== 0) return;
        start = { x: e.clientX, y: e.clientY };
        held = false;
        stopHold();
        if (hasAction(getConfig().hold_action)) {
            holdTimer = setTimeout(() => {
                holdTimer = undefined;
                held = true;
                fireAction(host, getConfig(), 'hold', local);
            }, HOLD_MS);
        }
    });
    target.addEventListener('pointermove', (e: PointerEvent) => {
        if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > MOVE_TOLERANCE_PX) cancel();
    });
    target.addEventListener('pointerup', () => {
        const pressed = !!start && !held;
        cancel();
        if (pressed) tap();
    });
    target.addEventListener('pointercancel', cancel);
    target.addEventListener('pointerleave', cancel);
    target.addEventListener('keydown', (e: KeyboardEvent) => {
        if ((e.key !== 'Enter' && e.key !== ' ') || !tapDoesSomething(getConfig())) return;
        e.preventDefault();
        fireAction(host, getConfig(), 'tap', local);
    });
    // A long press would open the browser's menu, or select the text under it
    target.addEventListener('contextmenu', (e: Event) => {
        if (hasAction(getConfig().hold_action)) e.preventDefault();
    });
}

/**
 * The target is a button, in reach of the keyboard and with a pointer, only
 * while a tap does something; otherwise it keeps its resting role. With a
 * hold, a long press doesn't select the text under it.
 */
export function syncActionTarget(target: HTMLElement, config: ActionsConfig, restingRole?: string): void {
    if (tapDoesSomething(config)) {
        target.setAttribute('role', 'button');
        target.tabIndex = 0;
        target.style.cursor = 'pointer';
    } else {
        if (restingRole) target.setAttribute('role', restingRole);
        else target.removeAttribute('role');
        target.removeAttribute('tabindex');
        target.style.cursor = '';
    }
    const holds = hasAction(config.hold_action);
    target.style.userSelect = holds ? 'none' : '';
    target.style.setProperty('-webkit-user-select', holds ? 'none' : '');
    target.style.setProperty('-webkit-touch-callout', holds ? 'none' : '');
}
