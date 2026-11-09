// The forecast pop-up: the forecast in detail, in the card's own sky. A tap
// set to `forecast` opens it (tap_action: { action: forecast }). It's a
// native dialog (forecast-dialog.ts) with what Home Assistant's more-info
// doesn't have: the sky, the note, the hours with what falls, the days on one
// shared range, every reading the entity reports, and the way through to
// Home Assistant's own dialog for history and settings.
//
// Review only: variants (review_popup) while they're compared.

import { forecastString } from './forecast-strings';
import type { PopupContext } from './forecast-views-api';
import type { HassEntity, HomeAssistant } from './types';
import { openDialog } from './forecast-dialog';
import { ForecastEntry, subscribeForecast, forecastTypes, dailyTypeFor } from './forecast-data';
import { buildForecastModel, ForecastModel } from './forecast-model';
import { daysHtml, fitWords, highLowHtml, hourLabelFor, hourWindows, hoursHtml, partsCss } from './forecast-parts';
import { conditionLabel, degrees } from './forecast-format';
import { lineChart, lineCss } from './forecast-line';
import { formatTime, formatWeekday, localizeString, timeHtml } from './localize';
import { cardLocalize, escapeHtml, formatLocalizedNumber } from './utils';
import { skyColors, SKY_CONDITIONS, SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, oklchToSrgb, toHex, type SkyCondition, type SkyPhase } from './sky';

const num = (v: unknown): number | undefined => typeof v === 'number' && isFinite(v) ? v : (typeof v === 'string' && v.trim() !== '' && isFinite(Number(v)) ? Number(v) : undefined);

/** A reading with its unit, in the dashboard's number format */
function reading(value: unknown, unit: unknown, hass?: HomeAssistant, decimals = 0): string {
    const n = num(value);
    if (n === undefined) return '';
    return `${formatLocalizedNumber(n, hass, decimals)}${unit ? ` ${unit}` : ''}`;
}

interface Detail { label: string; value: string; sub?: string; arrow?: number; /** The value is markup this file built (a time with its small day period), not text */ html?: boolean }

/** Every reading the entity reports, as Home Assistant names them; only the ones it has */
export function details(weather: HassEntity | undefined, model: ForecastModel, hass: HomeAssistant | undefined, sun?: HassEntity): Detail[] {
    const a = weather?.attributes ?? {};
    const label = (key: string, fallback: string) => cardLocalize(hass, `ui.card.weather.attributes.${key}`, fallback);
    const out: Detail[] = [];
    const wind = reading(a.wind_speed, a.wind_speed_unit, hass);
    if (wind) {
        const gust = reading(a.wind_gust_speed, a.wind_speed_unit, hass);
        out.push({ label: label('wind_speed', 'Wind speed'), value: wind, sub: gust ? `${label('wind_gust_speed', 'Wind gust speed')} ${gust}` : undefined, arrow: num(a.wind_bearing) });
    }
    const humidity = reading(a.humidity, '%', hass).replace(' %', '%');
    if (humidity) {
        const dew = num(a.dew_point);
        out.push({ label: label('humidity', 'Humidity'), value: humidity, sub: dew !== undefined ? `${label('dew_point', 'Dew point')} ${degrees(dew, hass)}` : undefined });
    }
    const uv = reading(a.uv_index, '', hass);
    if (uv) out.push({ label: label('uv_index', 'UV index'), value: uv });
    const visibility = reading(a.visibility, a.visibility_unit, hass);
    if (visibility) out.push({ label: label('visibility', 'Visibility'), value: visibility });
    const pressure = reading(a.pressure, a.pressure_unit, hass);
    if (pressure) out.push({ label: label('air_pressure', 'Air pressure'), value: pressure });
    const cloud = reading(a.cloud_coverage, '%', hass).replace(' %', '%');
    if (cloud) out.push({ label: label('cloud_coverage', 'Cloud coverage'), value: cloud });
    const today = model.days.find(d => d.isToday);
    if (today?.precipitation !== undefined) out.push({ label: label('precipitation', 'Precipitation'), value: reading(today.precipitation, a.precipitation_unit ?? 'mm', hass, 1) });
    if (sun?.attributes?.next_setting && sun?.attributes?.next_rising) {
        const day = sun.state !== 'below_horizon';
        const next = day ? sun.attributes.next_setting : sun.attributes.next_rising;
        const other = day ? sun.attributes.next_rising : sun.attributes.next_setting;
        out.push({
            label: localizeString(hass, day ? 'sunset' : 'sunrise'),
            value: timeHtml(formatTime(next, hass), 'awc-ampm'),
            html: true,
            sub: `${localizeString(hass, day ? 'sunrise' : 'sunset')} ${formatTime(other, hass)}`,
        });
    }
    return out;
}

function detailsHtml(list: Detail[]): string {
    if (!list.length) return '';
    return `<div class="pp-details">${list.map(d => `<div class="pp-detail" role="group">`
        + `<div class="pp-detail-label">${escapeHtml(d.label)}</div>`
        + `<div class="pp-detail-value">${d.html ? d.value : escapeHtml(d.value)}${d.arrow !== undefined
            ? `<ha-icon class="pp-arrow" icon="mdi:navigation" style="transform: rotate(${(d.arrow + 180) % 360}deg)" aria-hidden="true"></ha-icon>` : ''}</div>`
        + (d.sub ? `<div class="pp-detail-sub">${escapeHtml(d.sub)}</div>` : '')
        + '</div>').join('')}</div>`;
}

/** The pop-up's sky: the card's condition and phase, as its colours */
function skyStyle(ctx: PopupContext): Record<string, string> {
    if (ctx.theme) return {};
    const condition = ((SKY_CONDITIONS as readonly string[]).includes(ctx.condition) ? ctx.condition : 'sunny') as SkyCondition;
    const sky = skyColors(condition, (ctx.phase || 'day') as SkyPhase);
    return { '--awc-sky-top': sky.top, '--awc-sky-mid': sky.mid, '--awc-sky-bottom': sky.bottom, '--awc-sky-glow': sky.glow, '--awc-sky-scrim': sky.scrim };
}

interface Live {
    hourly: ForecastEntry[] | null;
    daily: ForecastEntry[] | null;
    dailyType: ReturnType<typeof dailyTypeFor>;
}

/** The pieces every pop-up variant needs: the model, the hero's words, the readings */
function pieces(ctx: PopupContext, live: Live) {
    const hass = ctx.hass;
    const model = buildForecastModel({ hourly: live.hourly, daily: live.daily, dailyType: live.dailyType, now: ctx.now, current: ctx.current, hass, dayCount: 10 });
    const weather = hass?.states[ctx.entityId];
    const sun = hass?.states['sun.sun'];
    const place = String(weather?.attributes?.friendly_name ?? '');
    const condition = weather ? conditionLabel(weather.state, hass, ctx.entityId) : '';
    const feels = num(weather?.attributes?.apparent_temperature);
    return { hass, model, weather, sun, place, condition, feels };
}

/** The bar: the close button at the top start, as in Home Assistant's own dialogs, then the place */
function barHtml(hass: HomeAssistant | undefined, place: string): string {
    return `<div class="pp-bar">`
        + `<button type="button" class="pp-close" data-close aria-label="${escapeHtml(cardLocalize(hass, 'ui.common.close', forecastString(hass, 'close')))}"><span><ha-icon icon="mdi:close"></ha-icon></span></button>`
        + `<h2 id="awc-sheet-title" tabindex="-1" data-autofocus><span class="awc-visually-hidden">${escapeHtml(forecastString(hass, 'forecast'))}, </span>${escapeHtml(place)}</h2>`
        + '</div>';
}

/**
 * Over the sheet's hours, every change of weather named in words where it
 * starts: the card shows no glyph per hour, so the sheet says sunny and
 * cloudy and rain where the sky would change.
 */
function runsHtml(hours: ReturnType<typeof hourWindows>, hass?: HomeAssistant): string {
    const family = (w: typeof hours[0]) => w.wet ? `wet-${w.kind}` : (w.condition ?? '').replace('clear-night', 'sunny');
    const runs: { start: number; span: number; text: string }[] = [];
    hours.forEach((w, i) => {
        const last = runs[runs.length - 1];
        if (last && family(hours[i - 1]) === family(w)) { last.span++; return; }
        const text = w.wet ? forecastString(hass, w.kind ?? 'rain') : conditionLabel(w.condition, hass);
        runs.push({ start: i, span: 1, text });
    });
    return `<div class="pp-runs" aria-hidden="true" style="--awc-cols: ${hours.length}">${runs.map(r => `<span style="grid-column: ${r.start + 1} / span ${r.span}">${escapeHtml(r.text)}</span>`).join('')}</div>`;
}

// ── a: the sheet ───────────────────────────────────────────────────────────

/**
 * a: a sheet in the card's own sky, read top to bottom like looking down the
 * sky toward the horizon: the hero and the note, the next 24 hours, ten
 * days, every reading, then the way through to Home Assistant's dialog.
 */
function sheetHtml(ctx: PopupContext, live: Live): string {
    const { hass, model, weather, sun, place, condition, feels } = pieces(ctx, live);
    const hours = hourWindows(model.hours, ctx.now, 24, 1, hass, true);
    const night = ctx.phase === 'night';
    return `
      <div class="pp-content">
        ${ctx.theme ? '' : `<div class="pp-light ${night ? 'moon' : 'sun'}" aria-hidden="true"></div>`}
        ${barHtml(hass, place)}
        <div class="pp-hero">
          <div class="pp-temp">${escapeHtml(degrees(ctx.current, hass).replace('°', ''))}<span class="pp-deg">°</span></div>
          <div class="pp-desc-line"><span class="pp-desc">${escapeHtml(condition)}</span><span class="awc-hl-line pp-hl">${highLowHtml(model.today, hass)}</span></div>
          ${feels !== undefined ? `<div class="pp-feels">${escapeHtml(localizeString(hass, 'feels_like'))} ${escapeHtml(degrees(feels, hass))}</div>` : ''}
          ${ctx.note ? `<p class="pp-note">${escapeHtml(ctx.note)}</p>` : ''}
        </div>
        ${hours.length ? `<div class="pp-block"><section class="pp-hours" role="region" tabindex="0" aria-label="${escapeHtml(forecastString(hass, 'next_hours'))}"><div class="pp-hours-track">${runsHtml(hours, hass)}${hoursHtml(hours, false, hass, 'pp-hour-grid')}</div></section></div>` : ''}
        <div class="pp-block pp-lower">
          ${model.days.length ? `<div class="pp-days">${daysHtml(model.days, model, hass, ctx.current)}</div>` : ''}
          ${detailsHtml(details(weather, model, hass, sun))}
        </div>
        <button type="button" class="pp-more" data-more>${escapeHtml(forecastString(hass, 'more_info'))}<span aria-hidden="true">›</span></button>
      </div>`;
}

// ── c: the scrub ───────────────────────────────────────────────────────────

/** One stop on the scrub: now (the entity's live readings), then every hour */
interface Stop { t: number; label: string; temp?: number; condition?: string; facts: string[] }

function stops(ctx: PopupContext, live: Live, model: ForecastModel): Stop[] {
    const hass = ctx.hass;
    const weather = hass?.states[ctx.entityId];
    const a = weather?.attributes ?? {};
    const now = ctx.now;
    const facts = (e: Record<string, unknown>, windUnit: unknown) => [
        num(e.precipitation_probability) !== undefined ? `${forecastString(hass, 'rain')} ${Math.round(num(e.precipitation_probability)!)}%` : '',
        num(e.precipitation) ? reading(e.precipitation, a.precipitation_unit ?? 'mm', hass, 1) : '',
        num(e.wind_speed) !== undefined ? `${cardLocalize(hass, 'ui.card.weather.attributes.wind_speed', 'Wind')} ${reading(e.wind_speed, windUnit, hass)}${num(e.wind_gust_speed) !== undefined ? `, ${forecastString(hass, 'gusts')} ${reading(e.wind_gust_speed, windUnit, hass)}` : ''}` : '',
        num(e.humidity) !== undefined ? `${cardLocalize(hass, 'ui.card.weather.attributes.humidity', 'Humidity')} ${Math.round(num(e.humidity)!)}%` : '',
        num(e.uv_index) !== undefined ? `UV ${Math.round(num(e.uv_index)!)}` : '',
        num(e.cloud_coverage) !== undefined ? `${cardLocalize(hass, 'ui.card.weather.attributes.cloud_coverage', 'Cloud coverage')} ${Math.round(num(e.cloud_coverage)!)}%` : '',
        num(e.dew_point) !== undefined ? `${cardLocalize(hass, 'ui.card.weather.attributes.dew_point', 'Dew point')} ${degrees(num(e.dew_point), hass)}` : '',
    ].filter(Boolean);
    const first: Stop = { t: now, label: forecastString(hass, 'now'), temp: ctx.current, condition: weather?.state, facts: facts(a as Record<string, unknown>, a.wind_speed_unit) };
    const today = new Date(now).toDateString();
    const later = model.hours.filter(e => Date.parse(e.datetime) > now + 10 * 60_000).map(e => {
        const t = Date.parse(e.datetime);
        const time = hourLabelFor(t, hass);
        const day = new Date(t).toDateString() === today ? '' : `${formatWeekday(new Date(t), hass, 'short')} `;
        return { t, label: `${day}${time}`, temp: e.temperature, condition: e.condition, facts: facts(e as unknown as Record<string, unknown>, a.wind_speed_unit) };
    });
    return [first, ...later];
}

/** The plot's width and how far it looks: the phone's 24 hours, a tablet's 48 */
function plotSize(): { width: number; hours: number } {
    const vw = window.innerWidth || 393;
    return vw < 600 ? { width: vw - 48, hours: 24 } : { width: Math.min(960, vw - 64) - 64, hours: 48 };
}

/**
 * c: the scrub. The line large enough for a finger, with a readout above it
 * that never sits under the finger: any hour's every value, by touch, drag
 * or the arrow keys. A selection never changes the hero or the sky: the big
 * number always means now.
 */
function scrubHtml(ctx: PopupContext, live: Live): string {
    const { hass, model, weather, sun, place, condition, feels } = pieces(ctx, live);
    const size = plotSize();
    const line = lineChart({
        hass, hours: model.hours, now: ctx.now, current: ctx.current, unit: ctx.unit, width: size.width, windowHours: size.hours,
        lanes: { top: 28, gap: 4, amp: size.hours > 24 ? 128 : 112, bottom: 28 }, groundBelow: 0, sun: hass?.states['sun.sun'], dot: [7, 7],
        maxBands: 3, bandDetail: false, size: 'lg', axis: true,
    });
    const list = stops(ctx, live, model);
    const count = list.filter(st => st.t <= ctx.now + size.hours * 3600_000).length;
    return `
      <div class="pp-content">
        ${barHtml(hass, place)}
        <div class="pp-hero pp-hero-c">
          <div class="pp-temp">${escapeHtml(degrees(ctx.current, hass).replace('°', ''))}<span class="pp-deg">°</span><span class="pp-hl-stack">${highLowHtml(model.today, hass)}</span></div>
          <div class="pp-desc">${escapeHtml(condition)}</div>
          ${feels !== undefined ? `<div class="pp-feels">${escapeHtml(localizeString(hass, 'feels_like'))} ${escapeHtml(degrees(feels, hass))}</div>` : ''}
          ${ctx.note ? `<p class="pp-note">${escapeHtml(ctx.note)}</p>` : ''}
        </div>
        ${line.html ? `<div class="pp-block pp-scrub">
          <div class="pp-readout" aria-hidden="true">
            <div class="pp-read-1"><span class="pp-read-time"></span><button type="button" class="pp-now" hidden>${escapeHtml(forecastString(hass, 'now'))} ›</button></div>
            <div class="pp-read-2"><span class="pp-read-temp"></span><span class="pp-read-cond"></span></div>
            <div class="pp-read-3"></div>
          </div>
          <div class="pp-plot" role="slider" tabindex="0" aria-label="${escapeHtml(forecastString(hass, 'next_hours'))}" aria-valuemin="0" aria-valuemax="${Math.max(0, count - 1)}" aria-valuenow="0">
            ${line.html.replace('class="awc-line"', 'class="awc-line lg"')}
            <div class="pp-marker" aria-hidden="true"><i class="pp-marker-line" style="height: ${line.ground ?? 0}px"></i><i class="pp-marker-ring"></i></div>
          </div>
        </div>` : ''}
        <div class="pp-block pp-lower">
          ${model.days.length ? `<div class="pp-days">${daysHtml(model.days, model, hass, ctx.current)}</div>` : ''}
          ${detailsHtml(details(weather, model, hass, sun))}
        </div>
        <button type="button" class="pp-more" data-more>${escapeHtml(forecastString(hass, 'more_info'))}<span aria-hidden="true">›</span></button>
      </div>`;
}

/** Wire the scrub: pointer, keys, the readout and the haptic detents */
function wireScrub(dialog: HTMLDialogElement, ctx: PopupContext, live: Live): void {
    const plot = dialog.querySelector('.pp-plot') as HTMLElement | null;
    if (!plot) return;
    const model = buildForecastModel({ hourly: live.hourly, daily: live.daily, dailyType: live.dailyType, now: ctx.now, current: ctx.current, hass: ctx.hass, dayCount: 10 });
    const size = plotSize();
    const list = stops(ctx, live, model).filter(st => st.t <= ctx.now + size.hours * 3600_000);
    if (!list.length) return;
    const pxPerMs = size.width / (size.hours * 3600_000);
    const xOf = (st: Stop) => Math.max(0, (st.t - list[0].t) * pxPerMs);
    // The line's own scale, to put the ring on the curve
    const values = list.map(st => st.temp).filter((v): v is number => typeof v === 'number');
    const span = Math.max(Math.max(...values) - Math.min(...values), /F/.test(ctx.unit) ? 10 : 6);
    const top = Math.max(...values) + (span - (Math.max(...values) - Math.min(...values))) / 2;
    const amp = size.hours > 24 ? 128 : 112;
    const yOf = (v: number) => 28 + 4 + ((top - v) / span) * amp;
    const marker = dialog.querySelector('.pp-marker') as HTMLElement;
    const ring = dialog.querySelector('.pp-marker-ring') as HTMLElement;
    const read = (sel: string) => dialog.querySelector(sel) as HTMLElement | null;
    const nowButton = read('.pp-now') as HTMLButtonElement | null;
    let index = 0;
    let dragging = false;
    const select = (i: number, fromTouch = false) => {
        const next = Math.max(0, Math.min(list.length - 1, i));
        if (next !== index && fromTouch) window.dispatchEvent(new CustomEvent('haptic', { detail: 'selection' }));
        index = next;
        const st = list[index];
        marker.style.transform = `translateX(${xOf(st).toFixed(1)}px)`;
        if (typeof st.temp === 'number') ring.style.top = `${yOf(st.temp).toFixed(1)}px`;
        const time = read('.pp-read-time');
        if (time) time.innerHTML = timeHtml(st.label, 'awc-ampm');
        const temp = read('.pp-read-temp');
        if (temp) temp.textContent = degrees(st.temp, ctx.hass);
        const cond = read('.pp-read-cond');
        if (cond) cond.textContent = conditionLabel(st.condition, ctx.hass);
        const facts = read('.pp-read-3');
        if (facts) facts.textContent = st.facts.join(' · ');
        if (nowButton) nowButton.hidden = index === 0;
        plot.setAttribute('aria-valuenow', String(index));
        plot.setAttribute('aria-valuetext', `${st.label}: ${degrees(st.temp, ctx.hass)}, ${conditionLabel(st.condition, ctx.hass)}${st.facts.length ? `. ${st.facts.join(', ')}` : ''}`);
    };
    const fromX = (clientX: number) => {
        const x = clientX - plot.getBoundingClientRect().left;
        let best = 0;
        list.forEach((st, i) => { if (Math.abs(xOf(st) - x) < Math.abs(xOf(list[best]) - x)) best = i; });
        return best;
    };
    plot.addEventListener('pointerdown', (e: PointerEvent) => {
        dragging = true;
        plot.setPointerCapture?.(e.pointerId);
        select(fromX(e.clientX), e.pointerType === 'touch');
    });
    plot.addEventListener('pointermove', (e: PointerEvent) => { if (dragging) select(fromX(e.clientX), e.pointerType === 'touch'); });
    const stop = () => { dragging = false; };
    plot.addEventListener('pointerup', stop);
    plot.addEventListener('pointercancel', stop);
    plot.addEventListener('keydown', (e: KeyboardEvent) => {
        const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, PageDown: 6, PageUp: -6 };
        if (e.key in moves) select(index + moves[e.key]);
        else if (e.key === 'Home') select(0);
        else if (e.key === 'End') select(list.length - 1);
        else return;
        e.preventDefault();
    });
    nowButton?.addEventListener('click', () => select(0));
    select(0);
}

const SCRUB_CSS = `
    ${lineCss('dialog.theme')}
    .pp-hero-c .pp-temp { display: flex; align-items: center; }
    .pp-hl-stack { display: grid; margin: 0.06em 0 0 0.18em; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif; font-size: 17px; line-height: 20px; font-weight: 500; letter-spacing: -0.01em; }
    .pp-hero-c .pp-desc { display: block; margin-top: 8px; }
    .pp-scrub { margin-top: 20px; }
    .pp-readout { height: 90px; overflow: hidden; }
    .pp-read-1 { display: flex; align-items: baseline; justify-content: space-between; font-size: 22px; line-height: 28px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .pp-read-2 { display: flex; gap: 8px; align-items: baseline; font-size: 17px; line-height: 22px; }
    .pp-read-temp { font-weight: 600; font-variant-numeric: tabular-nums; }
    .pp-read-cond { font-weight: 400; }
    .pp-read-3 { font-size: 15px; line-height: 20px; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
    .pp-now { min-height: 44px; margin: -8px -8px -8px 0; padding: 0 8px; border: 0; background: none; color: inherit; font: inherit; font-size: 15px; font-weight: 600; cursor: pointer; }
    .pp-now[hidden] { display: none; }
    .pp-plot { position: relative; margin-top: 8px; padding-bottom: 18px; touch-action: pan-y; cursor: ew-resize; outline: none; }
    .pp-plot:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 4px; }
    .pp-marker { position: absolute; left: 0; top: 0; width: 0; height: 100%; pointer-events: none; transition: transform 90ms var(--ease-out); }
    .pp-marker-line { position: absolute; left: 0; top: 0; width: 1px; background: currentColor; opacity: 0.6; }
    .pp-marker-ring { position: absolute; left: -6px; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; border: 2px solid currentColor; box-sizing: border-box; box-shadow: 0 0 0 3px color-mix(in srgb, var(--awc-sky-mid, transparent) 50%, transparent); transition: top 90ms var(--ease-out); }
    dialog[data-still] :is(.pp-marker, .pp-marker-ring) { transition: none; }
    @media (prefers-reduced-motion: reduce) { :is(.pp-marker, .pp-marker-ring) { transition: none; } }
    @media (min-width: 600px) { .pp-readout { height: 98px; } .pp-read-1 { font-size: 28px; line-height: 32px; } .pp-read-2 { font-size: 20px; line-height: 26px; } }
    dialog.theme .pp-marker-line { background: var(--primary-color); opacity: 1; }
    dialog.theme .pp-marker-ring { border-color: var(--primary-color); box-shadow: none; }
`;

const SKY_TEXT_HEX = toHex(oklchToSrgb(SKY_TEXT));

const SHEET_CSS = `
    ${partsCss('dialog.theme')}
    dialog {
      box-sizing: border-box;
      padding: 0;
      border: 0;
      color: ${SKY_TEXT_HEX};
      background: var(--awc-sky-mid, #2c4a73);
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      --awc-secondary: ${SKY_TEXT_SECONDARY_ALPHA};
      --ease-out: cubic-bezier(0.25, 1, 0.5, 1);
      --ease-in: cubic-bezier(0.5, 0, 0.75, 0);
      overflow: hidden;
      text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
    }
    dialog.theme {
      color: var(--primary-text-color);
      background: var(--ha-card-background, var(--card-background-color, #fff));
      --awc-secondary: 1;
      text-shadow: none;
    }
    dialog::backdrop { background: rgba(4, 8, 20, 0.45); }
    /* Phone: a full-screen sheet that rises 24 px into place */
    dialog { width: 100vw; height: 100dvh; max-width: none; max-height: none; margin: 0; border-radius: 0; }
    dialog[open] { animation: pp-in 280ms var(--ease-out); }
    dialog[open]::backdrop { animation: pp-fade 240ms linear; }
    dialog[data-closing] { animation: pp-out 200ms var(--ease-in) forwards; }
    dialog[data-closing]::backdrop { animation: pp-fade 200ms linear reverse forwards; }
    @keyframes pp-in { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
    @keyframes pp-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(16px); } }
    @keyframes pp-fade { from { opacity: 0; } to { opacity: 1; } }
    /* Still (reduced motion, animate: false): a short fade, no movement */
    dialog[data-still][open] { animation: pp-fade 120ms linear; }
    dialog[data-still][open]::backdrop { animation: none; }
    @media (prefers-reduced-motion: reduce) { dialog[open] { animation: pp-fade 120ms linear; } dialog[data-closing] { animation: none; } dialog::backdrop { animation: none !important; } }
    /* Tablet and up: sized for reading, centred, scaling in from 0.98 */
    @keyframes pp-in-tablet { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
    @keyframes pp-out-tablet { from { opacity: 1; transform: none; } to { opacity: 0; transform: scale(0.98); } }
    @media (min-width: 600px) {
      dialog {
        width: min(960px, 100vw - 64px);
        height: auto;
        max-height: min(720px, 100dvh - 64px);
        margin: auto;
        border-radius: var(--ha-dialog-border-radius, 28px);
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
      }
      dialog[open] { animation-name: pp-in-tablet; }
      dialog[data-closing] { animation-name: pp-out-tablet; }
    }

    /* The sky is painted on what scrolls, so the light stays at its top */
    .pp-content {
      position: relative;
      box-sizing: border-box;
      max-height: 100dvh;
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
      padding: calc(env(safe-area-inset-top, 0px) + 12px) 24px calc(env(safe-area-inset-bottom, 0px) + 32px);
      container: sheet / inline-size;
      background:
        radial-gradient(45% 260px at 86% 60px, var(--awc-sky-glow, transparent), transparent 64%),
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim, transparent) 100%),
        linear-gradient(180deg, var(--awc-sky-top, transparent) 0%, var(--awc-sky-mid, transparent) 55%, var(--awc-sky-bottom, transparent) 100%);
    }
    dialog.theme .pp-content { background: none; }
    @media (min-width: 600px) { .pp-content { max-height: min(720px, 100dvh - 64px); height: auto; padding: 16px 32px 32px; } }

    /* The sun or the moon, still: the sheet is for reading */
    .pp-light { position: absolute; left: 84%; top: calc(env(safe-area-inset-top, 0px) + 96px); width: 40px; height: 40px; margin: -20px 0 0 -20px; border-radius: 50%; pointer-events: none; }
    .pp-light.sun {
      background: radial-gradient(circle at 50% 50%, #fffaf0 0%, #fff3d6 34%, #ffd67a 70%, #ffb547 100%);
      box-shadow: 0 0 18px 4px rgba(255, 214, 140, 0.55), 0 0 64px 18px rgba(255, 214, 140, 0.24);
    }
    .pp-light.moon {
      width: 34px; height: 34px; margin: -17px 0 0 -17px;
      background: radial-gradient(circle at 34% 30%, #fbfaf4 0%, #ece8dc 55%, #cfcabc 100%);
      box-shadow: 0 0 16px 2px rgba(226, 232, 255, 0.28), 0 0 56px 12px rgba(190, 206, 255, 0.12);
    }

    .pp-bar { position: relative; display: flex; align-items: center; gap: 6px; min-height: 44px; }
    .pp-bar h2 { margin: 0; font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.01em; outline: none; }
    .pp-close { width: 44px; height: 44px; margin-left: -7px; padding: 0; border: 0; background: none; color: inherit; cursor: pointer; display: grid; place-items: center; }
    .pp-close:active > span { transform: scale(0.94); }
    .pp-close > span { transition: transform 120ms var(--ease-out); }
    .pp-close > span { width: 30px; height: 30px; border-radius: 50%; display: grid; place-items: center; background: color-mix(in srgb, currentColor 14%, transparent); --mdc-icon-size: 18px; }
    dialog.theme .pp-close > span { background: var(--secondary-background-color, rgba(0, 0, 0, 0.06)); }
    .pp-close:focus-visible > span, .pp-more:focus-visible, .pp-hours:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }

    .pp-hero { position: relative; }
    .pp-temp {
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      font-size: 80px; line-height: 0.9; font-weight: 200; letter-spacing: -0.045em;
      font-variant-numeric: tabular-nums; margin: 4px 0 0 -0.055em;
    }
    dialog.theme .pp-temp { color: var(--primary-color, var(--primary-text-color)); }
    .pp-deg { margin-left: 0.02em; letter-spacing: 0; }
    .pp-desc-line { display: flex; flex-wrap: wrap; align-items: baseline; column-gap: 12px; margin-top: 8px; max-width: 65%; }
    .pp-desc { font-size: 17px; line-height: 22px; font-weight: 600; letter-spacing: -0.012em; }
    .pp-hl { display: inline-flex; gap: 10px; font-size: 15px; line-height: 20px; }
    .pp-feels { margin-top: 2px; font-size: 15px; line-height: 20px; opacity: var(--awc-secondary); }
    dialog.theme .pp-feels { color: var(--secondary-text-color); }
    .pp-note { max-width: 46ch; margin: 10px 0 0; font-size: 15px; line-height: 20px; text-wrap: pretty; }

    .pp-block { position: relative; margin-top: 20px; padding-top: 14px; }
    .pp-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    dialog.theme .pp-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }

    /* The next 24 hours scroll, from now */
    .pp-hours { overflow-x: auto; scrollbar-width: none; margin-inline: -24px; padding-inline: 24px; scroll-snap-type: x proximity;
      -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent);
      mask-image: linear-gradient(90deg, transparent 0, #000 24px, #000 calc(100% - 24px), transparent); }
    .pp-hours::-webkit-scrollbar { display: none; }
    .pp-hours-track { width: max-content; }
    .pp-hour-grid { grid-template-columns: repeat(var(--awc-cols), 52px); column-gap: 4px; }
    .pp-runs { display: grid; grid-template-columns: repeat(var(--awc-cols), 52px); column-gap: 4px; margin-bottom: 6px; font-size: 13px; line-height: 16px; font-weight: 600; }
    .pp-runs > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 8px; }
    @media (min-width: 600px) { .pp-hours { margin-inline: -32px; padding-inline: 32px; } }

    .pp-days .awc-days { row-gap: 10px; }
    .pp-details { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 16px; margin-top: 24px; }
    .pp-detail-label { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: var(--awc-secondary); }
    .pp-detail-value { display: flex; align-items: center; gap: 4px; margin-top: 4px; font-size: 18px; line-height: 24px; font-weight: 500; letter-spacing: -0.012em; font-variant-numeric: tabular-nums; }
    .pp-detail-sub { margin-top: 2px; font-size: 13px; line-height: 18px; opacity: var(--awc-secondary); }
    dialog.theme :is(.pp-detail-label, .pp-detail-sub) { color: var(--secondary-text-color); }
    .pp-arrow { --mdc-icon-size: 14px; opacity: var(--awc-secondary); }
    .awc-ampm { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }
    @container sheet (min-width: 640px) {
      .pp-temp { font-size: 96px; letter-spacing: -0.05em; }
      .pp-lower { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); column-gap: 40px; align-items: start; }
      .pp-lower .pp-details { margin-top: 0; }
    }

    .pp-more {
      position: relative; display: flex; align-items: center; justify-content: space-between; width: 100%;
      min-height: 44px; margin-top: 24px; padding: 14px 0 0; border: 0; background: none; color: inherit; cursor: pointer;
      font: inherit; font-size: 15px; line-height: 20px; font-weight: 500; text-align: left;
    }
    .pp-more::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .pp-more > span { opacity: var(--awc-secondary); font-size: 20px; }
`;

// ── Opening ────────────────────────────────────────────────────────────────

const VARIANTS: Record<string, { css: string; html(ctx: PopupContext, live: Live): string; className: string; wire?(dialog: HTMLDialogElement, ctx: PopupContext, live: Live): void }> = {
    a: { css: SHEET_CSS, html: sheetHtml, className: 'pp-a' },
    c: { css: SHEET_CSS + SCRUB_CSS, html: scrubHtml, className: 'pp-c', wire: wireScrub },
};

/** Opens the pop-up; returns the way to close it */
export function openPopup(given: PopupContext): () => void {
    // Its own copy: "now" moves on when it's drawn again with new data
    const ctx: PopupContext = { ...given };
    const variant = (ctx.variant && Object.prototype.hasOwnProperty.call(VARIANTS, ctx.variant) ? VARIANTS[ctx.variant] : undefined) ?? VARIANTS.a;
    const weather = ctx.hass?.states[ctx.entityId];
    const live: Live = { hourly: ctx.hourly, daily: ctx.daily, dailyType: ctx.dailyType ?? dailyTypeFor(weather) };
    const stops: (() => void)[] = [];
    let dialog: HTMLDialogElement | undefined;

    const draw = () => {
        if (!dialog) return;
        ctx.now = Date.now();
        const content = dialog.querySelector('.pp-content') as HTMLElement | null;
        const hours = dialog.querySelector('.pp-hours') as HTMLElement | null;
        const scrollTop = content?.scrollTop ?? 0;
        const scrollLeft = hours?.scrollLeft ?? 0;
        const active = dialog.getRootNode() instanceof ShadowRoot ? (dialog.getRootNode() as ShadowRoot).activeElement : null;
        const focused = active?.matches('[data-close]') ? '[data-close]' : active?.matches('[data-more]') ? '[data-more]' : null;
        dialog.innerHTML = variant.html(ctx, live);
        wire(dialog);
        const newContent = dialog.querySelector('.pp-content') as HTMLElement | null;
        if (newContent) newContent.scrollTop = scrollTop;
        const newHours = dialog.querySelector('.pp-hours') as HTMLElement | null;
        if (newHours) newHours.scrollLeft = scrollLeft;
        if (focused) (dialog.querySelector(focused) as HTMLElement | null)?.focus({ preventScroll: true });
    };

    let close: (immediately?: boolean) => void = () => {};
    const wire = (d: HTMLDialogElement) => {
        fitWords(d);
        variant.wire?.(d, ctx, live);
        // Home Assistant's own dialog opens on a clear top layer: this one goes at once
        d.querySelector('[data-more]')?.addEventListener('click', () => {
            close(true);
            ctx.openMoreInfo();
        });
    };

    close = openDialog({
        label: `${forecastString(ctx.hass, 'forecast')}`,
        css: variant.css,
        html: variant.html(ctx, live),
        className: [variant.className, ctx.theme ? 'theme' : ''].filter(Boolean).join(' '),
        style: skyStyle(ctx),
        returnFocus: ctx.returnFocus,
        still: ctx.still,
        mounted: (d) => {
            dialog = d;
            d.setAttribute('aria-labelledby', 'awc-sheet-title');
            d.removeAttribute('aria-label');
            wire(d);
        },
        closed: () => { for (const stop of stops) stop(); },
    });

    // The hours and the days stay current while it's open, through the page's subscriptions
    const types = forecastTypes(weather);
    if (ctx.hass && types.includes('hourly')) {
        stops.push(subscribeForecast(ctx.hass, ctx.entityId, 'hourly', update => {
            if (update.failed) return;
            live.hourly = update.forecast;
            draw();
        }));
    }
    if (ctx.hass && live.dailyType) {
        stops.push(subscribeForecast(ctx.hass, ctx.entityId, live.dailyType, update => {
            if (update.failed) return;
            live.daily = update.forecast;
            draw();
        }));
    }
    return () => close();
}
