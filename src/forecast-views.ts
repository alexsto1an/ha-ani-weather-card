// The forecast's drawings: the weather card's forecast, the forecast card and
// the pop-up. They ship in the forecast bundle (animated-weather-card-forecast.js).
//
// Review only: each surface has variants, picked with review_* options,
// while they're compared in the real card. They share their parts
// (forecast-parts.ts).

import type { ForecastContext, ForecastViews, PopupContext } from './forecast-views-api';
import { skyGlowGradient, SKY_GLOW_FORECAST, SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, oklchToSrgb, toHex, SKY_COLOR_PROPERTIES, SKY_DISSOLVE_SEC, SKY_DISSOLVE_EASE } from './sky';
import { buildForecastModel, ForecastModel } from './forecast-model';
import { columnsFor, daysHtml, fitWords, highLowHtml, hourWindows, hoursHtml, partsCss } from './forecast-parts';
import { degrees } from './forecast-format';
import { formatWeekday, localizeString } from './localize';
import { escapeHtml } from './utils';

/** It's raining (or snowing) now, by the sky the card shows */
export const wetSky = (condition: string) => /rain|pour|snow|sleet|storm/.test(condition);

/** The forecast, shaped: today and the days after it */
export function modelFor(ctx: ForecastContext, dayCount = 6): ForecastModel {
    return buildForecastModel({
        hourly: ctx.hourly, daily: ctx.daily, dailyType: ctx.dailyType,
        now: ctx.now, current: ctx.current, hass: ctx.hass, dayCount,
    });
}

/** What there is to show of what was asked: hours fall back to days, and days to hours */
export function blocks(ctx: ForecastContext, model: ForecastModel): { hours: boolean; days: boolean } {
    const hasHours = model.hours.length > 0;
    const hasDays = model.days.some(d => !d.isToday);
    const hours = ctx.show !== 'daily' && hasHours || ctx.show === 'daily' && !hasDays && hasHours;
    const days = ctx.show !== 'hourly' && hasDays || ctx.show === 'hourly' && !hasHours && hasDays;
    return { hours, days };
}

/** The fit's levels for day rows: every row, then one fewer down to two, then none of them (with the hours kept) */
function dayLevels(count: number, withHours: boolean): { roomy: string[]; keep: string; drop: string[] } {
    if (count < 2) return { roomy: [], keep: withHours ? 'all' : `d${count}`, drop: [] };
    const roomy: string[] = [];
    for (let n = count; n > 2; n--) roomy.push(`d${n}`);
    return { roomy, keep: 'd2', drop: withHours ? ['first'] : [] };
}

const levelAttrs = (levels: { roomy: string[]; keep: string; drop: string[] }) =>
    `data-roomy="${levels.roomy.join(' ')}" data-keep="${levels.keep}" data-drop="${levels.drop.join(' ')}"`;

// ── The weather card's forecast ────────────────────────────────────────────

/**
 * a: columns. The hours as the metric row's sibling (a label over one
 * value), a line under them only where something starts or stops falling,
 * and the days after tomorrow as rows with a range bar.
 */
function sectionColumns(ctx: ForecastContext): string {
    const model = modelFor(ctx);
    const show = blocks(ctx, model);
    if (!show.hours && !show.days) return '';
    const { count, step } = columnsFor(ctx.width);
    const hours = show.hours ? hoursHtml(hourWindows(model.hours, ctx.now, count, step, ctx.hass), wetSky(ctx.condition), ctx.hass) : '';
    const days = show.days ? model.days.filter(d => !d.isToday).slice(0, 5) : [];
    const levels = show.days ? dayLevels(days.length, show.hours) : { roomy: [], keep: 'all', drop: [] };
    return `<section class="awc-fc awc-fc-a" ${levelAttrs(levels)}>${hours}${daysHtml(days, model, ctx.hass)}</section>`;
}

const SECTION_CSS = `
    ${partsCss('.animated-weather-card.theme-colors')}
    .awc-fc-a { position: relative; padding-top: 14px; }
    .awc-fc-a::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .animated-weather-card.theme-colors .awc-fc-a::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    .animated-weather-card:is([data-height="close"], [data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-fc-a { padding-top: 10px; }
    @container awc (min-width: 460px) { .awc-fc .awc-hour-temp { font-size: 18px; line-height: 24px; } }
    /* The fit's levels: fewer day rows, then none (the hours kept) */
    .animated-weather-card[data-forecast="first"] .awc-fc .awc-days { display: none; }
    ${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `.animated-weather-card[data-forecast="d${n}"] .awc-fc .awc-days > li:nth-child(n+${n + 1})`).join(',\n    ')} { display: none; }

    /* Today's high and low: on the condition's line, the quiet line's size,
       full strength (it reaches toward the light); tinted on a wide card */
    .awc-hl-line {
      display: inline-flex;
      gap: 10px;
      font-size: 15px;
      line-height: 20px;
      font-weight: 400;
      letter-spacing: -0.006em;
    }
    @container awc (min-width: 640px) { .awc-hl-line { opacity: var(--awc-secondary); } }
    .animated-weather-card.theme-colors .awc-hl-line { color: var(--secondary-text-color); }

    /* Beside the temperature, a min/max thermometer's memory: inside the
       temperature's own line, so it costs no height at any step */
    .temperature:has(> .awc-hl-stack:not([hidden])) { display: flex; align-items: center; }
    .awc-hl-stack {
      display: grid;
      margin: 0.06em 0 0 0.18em;
      font-family: var(--awc-font);
      font-size: 17px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
    .awc-hl-stack .awc-hl-label { opacity: var(--awc-secondary); }
    @container awc (min-width: 460px) { .awc-hl-stack { font-size: 18px; line-height: 22px; } }
    @container awc (min-width: 640px) { .awc-hl-stack { font-size: 20px; line-height: 26px; } .awc-hl-stack .awc-hl-label { font-size: 12px; } }
    @container awc (max-width: 319px) { .awc-hl-stack { font-size: 15px; line-height: 18px; } .awc-hl-stack .awc-hl-label { font-size: 10px; } }
    @container awc (max-width: 259px) { .awc-hl-stack { display: none; } }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"]) .awc-hl-stack { font-size: 15px; line-height: 18px; }
    .animated-weather-card[data-height="minimal"] .awc-hl-stack { font-size: 14px; line-height: 16px; }
    .animated-weather-card:is([data-height="short"], [data-height="snug"], [data-height="tight"], [data-height="minimal"]) .awc-hl-stack .awc-hl-label { font-size: 10px; }
    .animated-weather-card.theme-colors .awc-hl-stack { color: var(--primary-text-color); }
    .animated-weather-card.theme-colors .awc-hl-stack .awc-hl-label { color: var(--secondary-text-color); }
`;

// ── The forecast card ──────────────────────────────────────────────────────

type CardContext = ForecastContext & { compact: boolean };

/**
 * a: hours and days. The weather card's parts: under a compact weather card,
 * a strip of hours in the lower sky, so the two read as one; on its own,
 * the hours over the days from today (the dot is the reading now); wide,
 * side by side.
 */
function cardHoursAndDays(ctx: CardContext): string {
    const model = modelFor(ctx, 10);
    const show = blocks(ctx, model);
    const wide = ctx.width >= 640;
    const hoursWidth = ctx.compact || !wide ? ctx.width - 40 : (ctx.width - 56 - 57) / 2;
    const { count, step } = columnsFor(hoursWidth);
    const windows = show.hours ? hourWindows(model.hours, ctx.now, ctx.compact && wide ? Math.min(12, count * 2) : count, ctx.compact && wide ? Math.max(1, Math.ceil(step / 2)) : step, ctx.hass) : [];
    const hours = hoursHtml(windows, wetSky(ctx.condition), ctx.hass);
    if (ctx.compact) {
        // The strip: one row of hours, or of days when there are no hours
        if (hours) return `<div class="fc-a fc-strip" data-fit-steps="regular">${hours}</div>`;
        const days = model.days.slice(0, wide ? 7 : 4);
        return `<div class="fc-a fc-strip" data-fit-steps="regular">${dayColumnsHtml(days, ctx)}</div>`;
    }
    const days = show.days ? model.days : [];
    const steps: string[] = [];
    for (let n = days.length; n >= 2; n--) steps.push(`d${n}`);
    if (hours && days.length) steps.push('x2', 'x1');
    if (!steps.length) steps.push('regular');
    return `<div class="fc-a fc-full${hours && days.length ? ' both' : ''}" data-fit-steps="${steps.join(' ')}">`
        + (hours ? `<div class="fc-hours-block">${hours}</div>` : '')
        + (days.length ? `<div class="fc-days-block">${daysHtml(days, model, ctx.hass, ctx.current)}</div>` : '')
        + '</div>';
}

/** Days as columns, for the strip without hours: the name, the high and the low, and what falls */
function dayColumnsHtml(days: ReturnType<typeof modelFor>['days'], ctx: ForecastContext): string {
    const cells = days.map(day => {
        const name = day.isToday ? localizeString(ctx.hass, 'today') : formatWeekday(day.date, ctx.hass, 'short');
        return `<li><span class="awc-hour-label">${escapeHtml(name)}</span>`
            + `<span class="awc-hour-temp">${escapeHtml(degrees(day.high, ctx.hass))} <span class="fc-low">${escapeHtml(degrees(day.low, ctx.hass))}</span></span></li>`;
    }).join('');
    return `<ol class="awc-hours" style="--awc-cols: ${days.length}" aria-label="${escapeHtml(localizeString(ctx.hass, 'next_days'))}">${cells}</ol>`;
}

const SKY_TEXT_HEX = toHex(oklchToSrgb(SKY_TEXT));

const CARD_CSS = `
    ${partsCss('.fc-card:not(.sky)')}
    .fc-card {
      position: relative;
      box-sizing: border-box;
      height: 100%;
      min-height: 0;
      padding: 20px;
      overflow: hidden;
      container: fc / inline-size;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: var(--primary-text-color);
      --awc-secondary: 1;
    }
    .fc-card.sky {
      color: ${SKY_TEXT_HEX};
      --awc-secondary: ${SKY_TEXT_SECONDARY_ALPHA};
      text-shadow: 0 1px 12px rgba(6, 12, 28, 0.22);
      background:
        ${skyGlowGradient(SKY_GLOW_FORECAST, 'var(--awc-sky-glow)')},
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
        linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
      transition: ${SKY_COLOR_PROPERTIES.map(name => `${name} ${SKY_DISSOLVE_SEC}s ${SKY_DISSOLVE_EASE}`).join(', ')};
    }
    /* The strip, under a compact weather card: the lower sky, no light of its own */
    .fc-card.sky.compact {
      background:
        linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
        linear-gradient(180deg, var(--awc-sky-mid) 0%, var(--awc-sky-bottom) 100%);
    }
    .fc-card.compact { padding: 16px 20px; display: flex; flex-direction: column; justify-content: center; }
    .fc-low { font-weight: 400; opacity: var(--awc-secondary); margin-left: 2px; }
    .fc-card:not(.sky) .fc-low { color: var(--secondary-text-color); opacity: 1; }
    .fc-empty { margin: auto; font-size: 14px; opacity: var(--awc-secondary); }

    /* a: the hours over the days from today; wide, side by side */
    .fc-a.fc-full { display: flex; flex-direction: column; height: 100%; }
    .fc-a .fc-days-block { position: relative; }
    .fc-a.both .fc-days-block { margin-top: 14px; padding-top: 14px; }
    .fc-a.both .fc-days-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .fc-card:not(.sky) .fc-a.both .fc-days-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    .fc-a .awc-days { row-gap: 6px; }
    @container fc (min-width: 460px) { .awc-hour-temp { font-size: 18px; line-height: 24px; } }
    @container fc (min-width: 640px) {
      .fc-card { padding: 24px 28px; }
      .fc-a.fc-full.both { flex-direction: row; align-items: flex-start; gap: 56px; }
      .fc-a.both > * { flex: 1 1 0; min-width: 0; }
      .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
      .fc-a.both .fc-days-block::before { inset: 4px auto 4px -28px; width: 1px; height: auto; }
    }
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `.fc-card[data-fit="d${n}"] .awc-days > li:nth-child(n+${n + 1}), .fc-card[data-fit="x${n}"] .awc-days > li:nth-child(n+${n + 1})`).join(', ')} { display: none; }
    .fc-card[data-fit^="x"] .fc-hours-block { display: none; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block::before { display: none; }
`;

export const FORECAST_VIEWS: ForecastViews = {
    version: 1,
    sectionCss: SECTION_CSS,
    renderSection: (ctx: ForecastContext) => {
        switch (ctx.variant) {
            default: return sectionColumns(ctx);
        }
    },
    fit: fitWords,
    renderHighLow: (ctx: ForecastContext) => highLowHtml(modelFor(ctx).today, ctx.hass),
    cardCss: CARD_CSS,
    renderCard: (ctx: CardContext) => {
        switch (ctx.variant) {
            default: return cardHoursAndDays(ctx);
        }
    },
    openPopup: (_ctx: PopupContext) => () => {},
};
