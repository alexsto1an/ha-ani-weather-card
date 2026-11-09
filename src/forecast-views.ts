// The forecast's drawings: the weather card's forecast, the forecast card and
// the pop-up. They ship in the forecast bundle (animated-weather-card-forecast.js).
//
// Review only: each surface has variants, picked with review_* options,
// while they're compared in the real card. They share their parts
// (forecast-parts.ts).

import { forecastString } from './forecast-strings';
import type { ForecastContext, ForecastViews, PopupContext } from './forecast-views-api';
import { skyGlowGradient, SKY_GLOW_FORECAST, SKY_GLOW_FORECAST_WIDE, skyColors, sampleSky, SKY_CONDITIONS, type SkyCondition, type SkyPhase, SKY_TEXT, SKY_TEXT_SECONDARY_ALPHA, oklchToSrgb, toHex, SKY_COLOR_PROPERTIES, SKY_DISSOLVE_SEC, SKY_DISSOLVE_EASE } from './sky';
import { buildForecastModel, ForecastModel } from './forecast-model';
import { columnsFor, daysHtml, fitWords, highLowHtml, hourWindows, hoursHtml, hourLabelFor, partsCss } from './forecast-parts';
import { degrees, percent, conditionLabel } from './forecast-format';
import { formatWeekday, localizeString, timeHtml, clockParts, formatDate } from './localize';
import { escapeHtml, getWeatherClass } from './utils';
import { openPopup } from './forecast-popup';
import { lineChart, lineCss, Lanes, wetBands, bandWhen, kindWord, textWidth, dayIntervals } from './forecast-line';
import type { ForecastDay } from './forecast-model';

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

/** The fit's levels, named on the drawing: whole, fewer day rows (never below two), without its second block, its one-line short form */
interface Levels { full: string; trims: string[]; first?: string; short?: string }
const levelAttrs = (l: Levels) => `data-full="${l.full}" data-trims="${l.trims.join(' ')}"${l.first ? ` data-first="${l.first}"` : ''}${l.short ? ` data-short="${l.short}"` : ''}`;

/** Day rows trimmed one at a time, from `count` down to two */
function dayTrims(count: number): string[] {
    const trims: string[] = [];
    for (let n = count - 1; n >= 2; n--) trims.push(`d${n}`);
    return trims;
}

const SENTENCE_HOURS = 12;

/**
 * What the next hours have to say, in words, most useful first: the next
 * rain (when, and how likely), else the next high or low worth saying (2°
 * or more from now), else that it holds steady. The second line is the
 * other extreme.
 */
export function sentenceLines(model: ForecastModel, ctx: ForecastContext): string[] {
    const hass = ctx.hass;
    const end = ctx.now + SENTENCE_HOURS * 3600_000;
    const hours = model.hours.filter(e => Date.parse(e.datetime) < end && typeof e.temperature === 'number');
    if (!hours.length) return [];
    const bands = wetBands(model.hours, ctx.now, end);
    const now = ctx.current ?? hours[0].temperature!;
    const after = hours.filter(e => Date.parse(e.datetime) > ctx.now + 10 * 60_000);
    const warm = /F/.test(ctx.unit) ? 3 : 2;
    const high = after.reduce<typeof after[0] | undefined>((a, b) => !a || b.temperature! > a.temperature! ? b : a, undefined);
    const low = after.reduce<typeof after[0] | undefined>((a, b) => !a || b.temperature! < a.temperature! ? b : a, undefined);
    const extreme = (e: typeof high, key: 'high_at' | 'low_at') => e ? forecastString(hass, key, { value: degrees(e.temperature, hass), time: hourLabelFor(Date.parse(e.datetime), hass) }) : '';
    const highText = high && high.temperature! - now >= warm ? extreme(high, 'high_at') : '';
    const lowText = low && now - low.temperature! >= warm ? extreme(low, 'low_at') : '';
    const lines: string[] = [];
    const band = bands[0];
    if (band) {
        const detail = band.chance !== undefined ? ` · ${percent(Math.round(band.chance / 10) * 10, hass)}`
            : band.amount !== undefined ? ` · ${band.amount < 10 ? band.amount.toFixed(1) : Math.round(band.amount)} mm` : '';
        lines.push(`${kindWord(band.kind, hass)} ${bandWhen(band, ctx.now, end, hass)}${detail}`);
        if (highText || lowText) lines.push(highText || lowText);
    } else if (highText || lowText) {
        lines.push(highText || lowText);
        if (highText && lowText) lines.push(lowText);
    } else {
        const last = hours[hours.length - 1];
        lines.push(forecastString(hass, 'steady_until', { time: hourLabelFor(Date.parse(last.datetime), hass) }));
    }
    return lines;
}

/** The sentence, a line or two, full strength at the quiet tier's size; the short form keeps the first */
function sentenceHtml(lines: string[], className = ''): string {
    if (!lines.length) return '';
    return `<p class="awc-sentence ${className}">${lines.map((line, i) => `<span class="awc-sentence-${i + 1}">${timeHtml(line, 'awc-ampm')}</span>`).join('')}</p>`;
}

// ── The weather card's forecast ────────────────────────────────────────────

/**
 * a: columns. The hours as the metric row's sibling (a label over one
 * value), a line under them only where something starts or stops falling,
 * and the days after tomorrow as rows with a range bar. Its short form is
 * the sentence's first line.
 */
function sectionColumns(ctx: ForecastContext): string {
    const model = modelFor(ctx);
    const show = blocks(ctx, model);
    if (!show.hours && !show.days) return '';
    const { count, step } = columnsFor(ctx.width);
    const hours = show.hours ? hoursHtml(hourWindows(model.hours, ctx.now, count, step, ctx.hass), wetSky(ctx.condition), ctx.hass) : '';
    const days = show.days ? model.days.filter(d => !d.isToday).slice(0, 5) : [];
    const short = show.hours ? sentenceHtml(sentenceLines(model, ctx).slice(0, 1), 'awc-short-form') : '';
    const levels: Levels = { full: 'full', trims: dayTrims(days.length), first: show.hours && days.length ? 'first' : undefined, short: short ? 'short' : undefined };
    return `<section class="awc-fc awc-fc-a" ${levelAttrs(levels)}><div class="awc-fc-body">${hours}${daysHtml(days, model, ctx.hass)}</div>${short}</section>`;
}

/**
 * b: the sentence. One or two lines of answer, the calmest and cheapest:
 * when the rain comes, how warm or cold it gets; the next days as two or
 * three rows.
 */
function sectionSentence(ctx: ForecastContext): string {
    const model = modelFor(ctx);
    const show = blocks(ctx, model);
    if (!show.hours && !show.days) return '';
    const lines = show.hours ? sentenceLines(model, ctx) : [];
    const days = show.days ? model.days.filter(d => !d.isToday).slice(0, 3) : [];
    const levels: Levels = { full: 'full', trims: dayTrims(days.length), first: lines.length && days.length ? 'first' : undefined, short: lines.length > 1 ? 'short' : undefined };
    return `<section class="awc-fc awc-fc-b" ${levelAttrs(levels)}>${sentenceHtml(lines)}${daysHtml(days, model, ctx.hass)}</section>`;
}

/** The line's lanes, full and flat, narrow and wide (C §4.4) */
const LANES: Record<'narrow' | 'wide', Record<'full' | 'flat', Lanes>> = {
    narrow: { full: { top: 16, gap: 3, amp: 30, bottom: 16 }, flat: { top: 16, gap: 2, amp: 16, bottom: 16 } },
    wide: { full: { top: 26, gap: 4, amp: 40, bottom: 20 }, flat: { top: 20, gap: 2, amp: 16, bottom: 18 } },
};

/**
 * c: the line. The next hours' temperature drawn on the sky, the metrics'
 * divider its ground, labelled only where it has something to say; the
 * next days as two or three rows. It flattens before it goes.
 */
function sectionLine(ctx: ForecastContext): string {
    const model = modelFor(ctx);
    const show = blocks(ctx, model);
    if (!show.hours && !show.days) return '';
    const wide = ctx.width >= 600;
    const width = ctx.width > 0 ? ctx.width : 313;
    const windowHours = Math.max(8, Math.min(24, Math.round(width / 26)));
    const sun = ctx.hass?.states['sun.sun'];
    const line = (level: 'full' | 'flat') => lineChart({
        hass: ctx.hass, hours: model.hours, now: ctx.now, current: ctx.current, unit: ctx.unit, width, windowHours,
        lanes: LANES[wide ? 'wide' : 'narrow'][level], groundBelow: wide ? 0 : 10, sun, dot: [7, 7],
        maxBands: 2, bandDetail: true, size: wide ? 'lg' : 'sm',
    }).html.replace('class="awc-line"', `class="awc-line${wide ? ' lg' : ''}"`);
    const days = show.days ? model.days.filter(d => !d.isToday).slice(0, 3) : [];
    const levels: Levels = show.hours
        ? { full: 'full', trims: dayTrims(days.length), first: days.length ? 'first' : undefined, short: 'short' }
        : { full: 'full', trims: dayTrims(days.length) };
    return `<section class="awc-fc awc-fc-c${wide ? ' wide' : ''}" ${levelAttrs(levels)}>`
        + (show.hours ? `<div class="awc-lvl-full">${line('full')}</div><div class="awc-lvl-flat">${line('flat')}</div>` : '')
        + (days.length ? `<div class="awc-fc-days">${daysHtml(days, model, ctx.hass)}</div>` : '')
        + '</section>';
}

const SECTION_CSS = `
    ${partsCss('.animated-weather-card.theme-colors')}
    ${lineCss('.animated-weather-card.theme-colors')}
    @container awc (min-width: 460px) { .awc-fc .awc-hour-temp { font-size: 18px; line-height: 24px; } }

    /* The sentence: full strength at the quiet tier's size (it sits low,
       where full strength passes across the card) */
    .awc-sentence { display: flex; flex-direction: column; margin: 0; font-size: 15px; line-height: 20px; font-weight: 500; letter-spacing: -0.006em; font-variant-numeric: tabular-nums; }
    .awc-sentence > span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .awc-sentence + .awc-days, .awc-fc-days { margin-top: 10px; }

    /* The fit's levels (data-forecast on the card) */
    .awc-short-form { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-a .awc-fc-body { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-a .awc-short-form { display: flex; }
    .animated-weather-card[data-forecast="short"] .awc-fc-b .awc-sentence-2,
    .animated-weather-card:is([data-forecast="short"], [data-forecast="first"]) .awc-fc :is(.awc-days, .awc-fc-days) { display: none; }
    .awc-fc-c .awc-lvl-flat { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-c .awc-lvl-full { display: none; }
    .animated-weather-card[data-forecast="short"] .awc-fc-c .awc-lvl-flat { display: block; }
    ${[2, 3, 4, 5, 6, 7, 8].map(n => `.animated-weather-card[data-forecast="d${n}"] .awc-fc .awc-days > li:nth-child(n+${n + 1})`).join(', ')} { display: none; }
    /* First data fades in; nothing moves, its place was held */
    .awc-forecast[data-arrive] > .awc-fc { animation: awc-fc-in 320ms cubic-bezier(0.25, 1, 0.5, 1); }
    @keyframes awc-fc-in { from { opacity: 0; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .awc-forecast[data-arrive] > .awc-fc { animation: none; } }
    .animated-weather-card.static .awc-forecast[data-arrive] > .awc-fc { animation: none; }

    /* Today's high and low: on the condition's line (a), the quiet line's
       size, full strength (it reaches toward the light); tinted on a wide card */
    .awc-hl-line { display: inline-flex; gap: 10px; font-size: 15px; line-height: 20px; font-weight: 400; letter-spacing: -0.006em; }
    @container awc (min-width: 640px) { .awc-hl-line { opacity: var(--awc-secondary); } }
    .animated-weather-card.theme-colors .awc-hl-line { color: var(--secondary-text-color); }

    /* Beside the temperature (b, c), a min/max thermometer's memory, full
       strength; its quietness is its size */
    .awc-hl-stack {
      display: grid;
      margin: 0.06em 0 0 0.18em;
      font-family: var(--awc-font);
      font-size: 17px;
      line-height: 20px;
      font-weight: 500;
      letter-spacing: -0.01em;
    }
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

type CardContext = ForecastContext & { compact: boolean; clock: boolean };

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
        const name = day.isToday ? forecastString(ctx.hass, 'today') : formatWeekday(day.date, ctx.hass, 'short');
        return `<li><span class="awc-hour-label">${escapeHtml(name)}</span>`
            + `<span class="awc-hour-temp">${escapeHtml(degrees(day.high, ctx.hass))} <span class="fc-low">${escapeHtml(degrees(day.low, ctx.hass))}</span></span></li>`;
    }).join('');
    return `<ol class="awc-hours" style="--awc-cols: ${days.length}" aria-label="${escapeHtml(forecastString(ctx.hass, 'next_days'))}">${cells}</ol>`;
}

/** A big time or value with its day period small, as the tracker sets its headline time */
const valueHtml = (text: string) => timeHtml(text, 'fc-ampm');

/** Hours from now, in words: "in 8 h", "within the hour" (never a minute countdown: a forecast isn't that exact) */
function inHours(t: number, ctx: ForecastContext): string {
    const hours = Math.round((t - ctx.now) / 3600_000);
    return hours < 1 ? forecastString(ctx.hass, 'within_hour').toLowerCase() : forecastString(ctx.hass, 'in_hours', { hours: String(hours) });
}

interface Headline { eyebrow: string; value: string; quiet: string[] }

/**
 * The instrument's headline: the next thing the weather does. The next rain
 * (when it starts, how likely, until when), or when it stops if it's falling
 * now, else the next high or low worth saying, else that it holds steady.
 */
function headline(model: ForecastModel, ctx: ForecastContext): Headline | null {
    const hass = ctx.hass;
    const end = ctx.now + 24 * 3600_000;
    const hours = model.hours.filter(e => Date.parse(e.datetime) < end && typeof e.temperature === 'number');
    if (!hours.length) {
        // Days only: the next wet day, else the warmest
        const days = model.days;
        if (!days.length) return null;
        const wet = days.find(d => (d.chance ?? 0) >= 50);
        if (wet) return { eyebrow: kindWord(wetKindOf(wet.condition), hass), value: escapeHtml(dayName(wet, ctx)), quiet: [wet.chance !== undefined ? percent(Math.round(wet.chance / 10) * 10, hass) : ''] };
        const warm = days.reduce((a, b) => (b.high ?? -99) > (a.high ?? -99) ? b : a, days[0]);
        return { eyebrow: forecastString(hass, 'high'), value: escapeHtml(degrees(warm.high, hass)), quiet: [dayName(warm, ctx)] };
    }
    const bands = wetBands(model.hours, ctx.now, end);
    const band = bands[0];
    const chance = band?.chance !== undefined ? percent(Math.round(band.chance / 10) * 10, hass) : '';
    if (band && band.start > ctx.now + 60_000) {
        return {
            eyebrow: kindWord(band.kind, hass),
            value: valueHtml(hourLabelFor(band.start, hass)),
            quiet: [inHours(band.start, ctx), chance, band.end <= end ? forecastString(hass, 'until_time', { time: hourLabelFor(band.end, hass) }) : ''].filter(Boolean),
        };
    }
    if (band) {
        if (band.end > end) return { eyebrow: kindWord(band.kind, hass), value: escapeHtml(forecastString(hass, 'now')), quiet: [forecastString(hass, 'through_time', { time: hourLabelFor(end, hass) })] };
        return { eyebrow: forecastString(hass, 'dry_from'), value: valueHtml(hourLabelFor(band.end, hass)), quiet: [inHours(band.end, ctx)] };
    }
    const now = ctx.current ?? hours[0].temperature!;
    const after = hours.filter(e => Date.parse(e.datetime) > ctx.now + 10 * 60_000);
    const high = after.reduce((a, b) => b.temperature! > a.temperature! ? b : a, after[0] ?? hours[0]);
    const low = after.reduce((a, b) => b.temperature! < a.temperature! ? b : a, after[0] ?? hours[0]);
    const warmStep = /F/.test(ctx.unit) ? 3 : 2;
    const next = [high.temperature! - now >= warmStep ? { e: high, key: 'high' as const } : null, now - low.temperature! >= warmStep ? { e: low, key: 'low' as const } : null]
        .filter((x): x is { e: typeof high; key: 'high' | 'low' } => !!x)
        .sort((a, b) => Date.parse(a.e.datetime) - Date.parse(b.e.datetime))[0];
    if (next) {
        const t = Date.parse(next.e.datetime);
        return { eyebrow: forecastString(hass, next.key), value: escapeHtml(degrees(next.e.temperature, hass)), quiet: [forecastString(hass, 'at_time', { time: hourLabelFor(t, hass) }), inHours(t, ctx)] };
    }
    const last = hours[hours.length - 1];
    return { eyebrow: forecastString(hass, 'high'), value: escapeHtml(degrees(Math.max(...hours.map(e => e.temperature!)), hass)), quiet: [forecastString(hass, 'steady_until', { time: hourLabelFor(Date.parse(last.datetime), hass) })] };
}

const wetKindOf = (condition?: string) => /lightning/.test(condition ?? '') ? 'storms' as const : condition === 'snowy' ? 'snow' as const : /snowy-rainy|hail/.test(condition ?? '') ? 'sleet' as const : 'rain' as const;
const dayName = (day: ForecastModel['days'][0], ctx: ForecastContext) => day.isToday ? forecastString(ctx.hass, 'today') : formatWeekday(day.date, ctx.hass, 'short');

/**
 * Bedside (show_clock on the forecast card): the time leads, the date over
 * it, what's coming under it. The weather card's temperature stays the one
 * hero there; this card has no lightning, particles or sun to wake anyone.
 */
function bedsideHtml(model: ForecastModel, ctx: CardContext): string {
    const now = new Date(ctx.now);
    const { time, period } = clockParts(now, ctx.hass);
    const line = sentenceLines(model, ctx)[0] ?? '';
    return `<div class="fc-head fc-bedside">`
        + `<div class="fc-eyebrow">${escapeHtml(formatDate(now, ctx.hass))}</div>`
        + `<time class="fc-clock" datetime="${now.toISOString().slice(0, 16)}"><span>${escapeHtml(time)}</span>${period ? `<span class="fc-ampm">${escapeHtml(period)}</span>` : ''}</time>`
        + (line ? `<div class="fc-quiet">${timeHtml(line, 'awc-ampm')}</div>` : '')
        + '</div>';
}

function headHtml(model: ForecastModel, ctx: CardContext): string {
    if (ctx.clock) return bedsideHtml(model, ctx);
    const head = headline(model, ctx);
    if (!head) return '';
    return `<div class="fc-head"><div class="fc-eyebrow">${escapeHtml(head.eyebrow)}</div><div class="fc-value">${head.value}</div>`
        + (head.quiet.length ? `<div class="fc-quiet">${head.quiet.map(q => `<span>${escapeHtml(q)}</span>`).join('<span class="fc-dot" aria-hidden="true"> · </span>')}</div>` : '')
        + '</div>';
}

/**
 * c: the instrument. The sun tracker's anatomy: a headline (what the weather
 * does next), the line with an hour axis, then the days as range-bar rows.
 * Its strip lines up with the compact tracker's.
 */
function cardInstrument(ctx: CardContext): string {
    const model = modelFor(ctx, 8);
    const show = blocks(ctx, model);
    const wide = ctx.width >= 640;
    const sun = ctx.hass?.states['sun.sun'];
    const head = headHtml(model, ctx);
    if (ctx.compact) {
        const chartWidth = Math.max(80, ctx.width - 40 - 112 - 20 - 6);
        const line = show.hours ? lineChart({
            hass: ctx.hass, hours: model.hours, now: ctx.now, current: ctx.current, unit: ctx.unit, width: chartWidth, windowHours: 12,
            lanes: { top: 16, gap: 4, amp: 40, bottom: 16 }, groundBelow: 0, sun, dot: [7, 7], maxBands: 2, bandDetail: false,
            size: 'sm', extremeTimes: false, skipFirstBand: !ctx.clock, noEnd: true,
        }).html : '';
        const days = !show.hours && show.days ? daysHtml(model.days.slice(0, 3), model, ctx.hass, ctx.current) : '';
        return `<div class="fc-c fc-strip-c" data-fit-steps="regular short tight">${head}<div class="fc-chart">${line}${days}</div></div>`;
    }
    const chartWidth = wide ? ctx.width - 56 - 196 - 28 : ctx.width - 40;
    const line = show.hours ? lineChart({
        hass: ctx.hass, hours: model.hours, now: ctx.now, current: ctx.current, unit: ctx.unit, width: Math.max(120, chartWidth), windowHours: 24,
        lanes: wide ? { top: 32, gap: 4, amp: 72, bottom: 32 } : { top: 28, gap: 4, amp: 48, bottom: 28 }, groundBelow: 0, sun, dot: [7, 7],
        maxBands: 3, bandDetail: false, size: 'lg', axis: true, skipFirstBand: !ctx.clock,
    }).html.replace('class="awc-line"', 'class="awc-line lg"') : '';
    const days = show.days ? model.days.slice(0, wide ? 7 : 5) : [];
    // Steps, each a list of what it gives up: the quiet line, a smaller value, day rows one by one (never below two), the days, the headline
    const trims = [];
    for (let n = days.length - 1; n >= 2; n--) trims.push(`short,d${n}`);
    const steps = ['regular', 'compact', 'short', ...trims, 'tight', 'minimal'];
    return `<div class="fc-c fc-full${wide ? ' wide' : ''}" data-fit-steps="${steps.join(' ')}">`
        + `<div class="fc-top">${head}${line ? `<div class="fc-chart">${line}</div>` : ''}</div>`
        + (days.length ? `<div class="fc-days-block">${daysHtml(days, model, ctx.hass, ctx.current)}</div>` : '')
        + '</div>';
}

// ── b: skies ───────────────────────────────────────────────────────────────

const FAMILY: Record<string, string> = {
    'sunny': 'clear', 'clear-night': 'clear', 'partly-cloudy': 'partly', 'cloudy': 'cloudy', 'foggy': 'fog', 'windy': 'wind',
    'light-rain': 'rain', 'rainy': 'rain', 'pouring': 'rain', 'snowy': 'snow', 'snowy-rainy': 'mixed', 'sleety': 'mixed',
    'stormy': 'storm', 'snowy-stormy': 'storm', 'sleety-stormy': 'storm',
};
const SEVERITY = ['storm', 'snow', 'mixed', 'rain', 'fog', 'wind', 'cloudy', 'partly', 'clear'];
const WET_FAMILY = new Set(['rain', 'snow', 'mixed', 'storm']);

/** A future hour's sky: its condition, by day or by night (the twin rule: sunny at night is a clear night) */
function slotSky(condition: string | undefined, night: boolean): { sky: SkyCondition; phase: SkyPhase } {
    let sky = getWeatherClass(condition ?? 'cloudy', false) as SkyCondition;
    if (!(SKY_CONDITIONS as readonly string[]).includes(sky)) sky = 'cloudy';
    if (sky === 'sunny' && night) sky = 'clear-night';
    if (sky === 'clear-night' && !night) sky = 'sunny';
    return { sky, phase: night ? 'night' : 'day' };
}

interface Slot { label: string; temp?: number; chance?: number; wet: boolean; condition?: string; sky: SkyCondition; phase: SkyPhase; family: string; low?: number }

/** Words where the weather changes, at the run's first slot; a dry change with no room for its word isn't painted either */
function runLabels(slots: Slot[], colWidth: number, ctx: ForecastContext, reserveRight: number): { at: number; text: string }[] {
    const runs: { start: number; family: string; condition?: string; wet: boolean }[] = [];
    slots.forEach((slot, i) => {
        const last = runs[runs.length - 1];
        if (last && last.family === slot.family) return;
        runs.push({ start: i, family: slot.family, condition: slot.condition, wet: WET_FAMILY.has(slot.family) });
    });
    const order = [...runs].sort((a, b) => SEVERITY.indexOf(a.family) - SEVERITY.indexOf(b.family));
    const placed: { at: number; text: string; x: number; w: number }[] = [];
    const limit = slots.length * colWidth - reserveRight;
    for (const run of order) {
        const text = run.wet ? kindWord(wetKindOf(run.condition), ctx.hass) : conditionLabel(run.condition, ctx.hass);
        const x = run.start * colWidth;
        const w = textWidth(text, 13, 600) + 4;
        const fits = x + w <= limit && placed.every(p => x + w + 12 <= p.x || p.x + p.w + 12 <= x);
        if (fits || run.wet) {
            if (!fits) {
                // A wet word always wins its place: the dry word it meets goes, and its run is painted as the one before
                for (const p of [...placed]) if (x + w + 12 > p.x && p.x + p.w + 12 > x) placed.splice(placed.indexOf(p), 1);
            }
            placed.push({ at: run.start, text, x, w });
        } else if (run.start > 0) {
            // Unnamed, so unpainted: the run takes the sky of the nearest dry
            // run before it (else after it). The present slot is never
            // repainted: it's the sky there is now.
            const dry = (s: Slot | undefined) => !!s && !WET_FAMILY.has(s.family) && s.family !== run.family;
            let source: Slot | undefined;
            for (let i = run.start - 1; i >= 0 && !source; i--) if (dry(slots[i])) source = slots[i];
            for (let i = run.start + 1; i < slots.length && !source; i++) if (dry(slots[i])) source = slots[i];
            if (source) for (let i = run.start; i < slots.length && slots[i].family === run.family; i++) {
                slots[i].sky = source.sky;
                slots[i].phase = source.phase;
            }
        }
    }
    return placed.sort((a, b) => a.at - b.at);
}

/** Paint the slots: one stop per slot at its centre, each layer a horizontal gradient (Recipe F), or the lower sky (Recipe L) */
function paint(slots: Slot[], ctx: CardContext, padLeft: number, colWidth: number, lower: boolean): string {
    const total = ctx.width > 0 ? ctx.width : 353;
    const at = (i: number) => (((padLeft + (i + 0.5) * colWidth) / total) * 100).toFixed(1);
    const layer = (colorOf: (slot: Slot) => string) => `linear-gradient(90deg, ${slots.map((slot, i) => `${colorOf(slot)} ${at(i)}%`).join(', ')})`;
    if (lower) {
        const hex = (slot: Slot, y: number) => toHex(sampleSky(slot.sky, slot.phase, y));
        return `<div class="fc-paint" aria-hidden="true"><i style="background: ${layer(s => hex(s, 0.775))}"></i>`
            + `<i class="top" style="background: ${layer(s => hex(s, 0.55))}"></i><i class="bottom" style="background: ${layer(s => hex(s, 1))}"></i></div>`;
    }
    const colors = (slot: Slot) => skyColors(slot.sky, slot.phase);
    return `<div class="fc-paint full" aria-hidden="true"><i style="background: ${layer(s => colors(s).mid)}"></i>`
        + `<i class="top" style="background: ${layer(s => colors(s).top)}"></i><i class="bottom" style="background: ${layer(s => colors(s).bottom)}"></i>`
        + `<i class="scrim" style="background: ${layer(s => colors(s).scrim)}"></i></div>`;
}

function slotColumns(slots: Slot[], large: boolean): string {
    return `<ol class="fc-cols" style="--awc-cols: ${slots.length}">${slots.map(s => `<li>`
        + `<span class="awc-visually-hidden">${escapeHtml(s.label)}: ${escapeHtml(s.temp !== undefined ? `${Math.round(s.temp)}°` : '')}${s.low !== undefined ? ` / ${Math.round(s.low)}°` : ''}${s.wet && s.chance !== undefined ? `, ${Math.round(s.chance / 10) * 10}%` : ''}</span>`
        + `<span class="fc-col-time" aria-hidden="true">${escapeHtml(s.label)}</span>`
        + `<span class="fc-col-temp${large ? ' l' : ''}" aria-hidden="true">${s.temp !== undefined ? `${escapeHtml(String(Math.round(s.temp)))}°` : '–'}${s.low !== undefined ? `<span class="fc-low"> ${escapeHtml(String(Math.round(s.low)))}°</span>` : ''}</span>`
        + `<span class="fc-col-chance" aria-hidden="true">${s.wet && s.chance !== undefined ? escapeHtml(percent(Math.round(s.chance / 10) * 10)) : ''}</span>`
        + '</li>').join('')}</ol>`;
}

/**
 * b: skies. Each hour painted in its own sky, by day or by night, so the
 * next hours read as a strip of the sky going on; words only where the
 * weather changes, and only changes it can name are painted.
 */
function cardSkies(ctx: CardContext): string {
    const model = modelFor(ctx, 8);
    const show = blocks(ctx, model);
    const wide = ctx.width >= 640;
    const pad = wide ? 28 : 20;
    const inner = (ctx.width > 0 ? ctx.width : 353) - pad * 2;
    const sun = ctx.hass?.states['sun.sun'];
    const band = (slots: Slot[], large: boolean, lower: boolean, withHl = false) => {
        const colWidth = inner / slots.length;
        const hl = withHl && inner >= 400 ? highLowHtml(model.today, ctx.hass) : '';
        const labels = runLabels(slots, colWidth, ctx, hl ? 110 : 0);
        return `<div class="fc-band${lower ? ' lower' : ''}">${paint(slots, ctx, pad, colWidth, lower)}`
            + `<div class="fc-band-text"><div class="fc-runs">${labels.map(l => `<span style="left: ${(l.at * colWidth).toFixed(1)}px">${escapeHtml(l.text)}</span>`).join('')}`
            + (hl ? `<span class="fc-hl">${hl}</span>` : '') + `</div>${slotColumns(slots, large)}</div></div>`;
    };
    const hourSlots = (): Slot[] => {
        const { count, step } = columnsFor(inner);
        const days = dayIntervals(sun, ctx.now - 3600_000, ctx.now + 48 * 3600_000);
        const night = (t: number) => days ? !days.some(([a, b]) => t >= a && t < b) : false;
        return hourWindows(model.hours, ctx.now, wide ? Math.min(12, count + 4) : count, wide ? 1 : step, ctx.hass, true).map(w => {
            // Wet by its chance while its condition says cloudy: it's painted, and named, as rain
            const wetAs = w.wetCondition && /rain|pour|snow|hail|lightning/.test(w.wetCondition) ? w.wetCondition : 'rainy';
            const sky = slotSky(w.wet ? wetAs : w.condition, night(w.start + 1800_000));
            const family = FAMILY[sky.sky] ?? 'cloudy';
            return { label: w.label, temp: w.temp, chance: w.chance, wet: w.wet, condition: w.wet ? wetAs : w.condition, ...sky, family };
        });
    };
    const daySlots = (): Slot[] => model.days.slice(0, ctx.compact ? 4 : wide ? 7 : inner >= 420 ? 5 : 4).map(d => {
        const sky = slotSky(d.condition, false);
        return { label: dayName(d, ctx), temp: d.high, low: d.low, chance: d.chance, wet: (d.chance ?? 0) >= 50, condition: d.condition, ...sky, family: FAMILY[sky.sky] ?? 'cloudy' };
    });
    const head = ctx.clock ? headHtml(model, ctx) : '';
    if (ctx.compact) {
        const slots = show.hours ? hourSlots() : daySlots();
        return `<div class="fc-b fc-strip-b" data-fit-steps="regular">${band(slots, false, true, true)}</div>`;
    }
    const hours = show.hours ? band(hourSlots(), true, false, true) : '';
    const days = show.days && (show.hours ? ctx.show === 'both' : true) ? band(daySlots(), true, false) : '';
    return `<div class="fc-b fc-full${hours && days ? ' both' : ''}" data-fit-steps="${hours && days ? 'regular x1' : 'regular'}">${head}${hours}${days}</div>`;
}

const SKY_TEXT_HEX = toHex(oklchToSrgb(SKY_TEXT));

const CARD_CSS = `
    ${partsCss('.fc-card:not(.sky)')}
    ${lineCss('.fc-card:not(.sky)')}
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
    /* The strip's quiet text is full strength: under the mid tone of a sunny
       dawn the tint falls under 4.5:1 (sky.test.ts) */
    .fc-card.sky.compact { --awc-secondary: 1; }
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
    @container fc (min-width: 640px) {
      .fc-card.sky:not(.compact) {
        background:
          ${skyGlowGradient(SKY_GLOW_FORECAST_WIDE, 'var(--awc-sky-glow)')},
          linear-gradient(180deg, transparent 40%, var(--awc-sky-scrim) 100%),
          linear-gradient(180deg, var(--awc-sky-top) 0%, var(--awc-sky-mid) 55%, var(--awc-sky-bottom) 100%);
      }
    }
    .awc-ampm { font-size: 0.7em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.24em; }

    /* The headline, the tracker's anatomy: eyebrow, value, quiet line */
    .fc-head { display: flex; flex-direction: column; align-items: flex-start; min-width: 0; }
    .fc-eyebrow { font-size: 11px; line-height: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; opacity: var(--awc-secondary); white-space: nowrap; }
    .fc-value, .fc-clock {
      margin: 6px 0 0 -0.04em;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", var(--ha-font-family-body, Roboto), "Segoe UI", system-ui, sans-serif;
      font-size: 52px; line-height: 0.95; font-weight: 250; letter-spacing: -0.035em; font-variant-numeric: tabular-nums; white-space: nowrap;
    }
    .fc-ampm { font-size: 0.42em; font-weight: 500; letter-spacing: 0.02em; margin-left: 0.32em; }
    .fc-quiet { margin-top: 6px; max-width: 60%; font-size: 15px; line-height: 20px; opacity: var(--awc-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .fc-card:not(.sky) :is(.fc-eyebrow, .fc-quiet) { color: var(--secondary-text-color); opacity: 1; }
    .fc-card:not(.sky) :is(.fc-value, .fc-clock) { color: var(--primary-color, var(--primary-text-color)); }
    @container fc (min-width: 460px) { .fc-value { font-size: 60px; } }
    /* Bedside: the time leads, at the weather card's temperature size, the
       date over it, what's coming under it */
    .fc-bedside .fc-clock { font-size: 96px; font-weight: 200; line-height: 0.9; letter-spacing: -0.045em; margin: 8px 0 0 -0.055em; }
    .fc-bedside .fc-quiet { max-width: 100%; opacity: 1; }
    @container fc (max-width: 319px) { .fc-bedside .fc-clock { font-size: 64px; } }
    @container fc (min-width: 640px) { .fc-bedside .fc-clock { font-size: 120px; } }
    .fc-bedside + * { margin-top: 16px; }

    /* c: the instrument */
    .fc-c.fc-full { display: flex; flex-direction: column; height: 100%; }
    .fc-c .fc-chart { margin-top: 14px; padding-bottom: 18px; }
    .fc-c .fc-days-block { position: relative; margin-top: 14px; padding-top: 14px; }
    .fc-c .fc-days-block::before { content: ''; position: absolute; inset: 0 0 auto 0; height: 1px; background: currentColor; opacity: 0.2; }
    .fc-card:not(.sky) .fc-c .fc-days-block::before { background: var(--divider-color, rgba(0, 0, 0, 0.12)); opacity: 1; }
    @container fc (min-width: 640px) {
      .fc-c.wide .fc-top { display: grid; grid-template-columns: 196px minmax(0, 1fr); column-gap: 28px; align-items: end; }
      .fc-c.wide .fc-chart { margin-top: 0; }
      .fc-c.wide .fc-days-block .awc-days { grid-template-columns: max-content minmax(0, 1fr) 4ch 24% 4ch; }
    }
    .fc-card:is([data-fit~="compact"], [data-fit~="short"], [data-fit~="tight"], [data-fit~="minimal"]) .fc-c .fc-quiet { display: none; }
    .fc-card:is([data-fit~="short"], [data-fit~="tight"]) .fc-c .fc-value { font-size: 40px; }
    ${[2, 3, 4, 5, 6].map(n => `.fc-card[data-fit~="d${n}"] .fc-c .awc-days > li:nth-child(n+${n + 1})`).join(', ')} { display: none; }
    .fc-card:is([data-fit="tight"], [data-fit="minimal"]) .fc-c .fc-days-block { display: none; }
    .fc-card[data-fit="minimal"] .fc-c .fc-head { display: none; }
    .fc-card[data-fit="minimal"] .fc-c .fc-chart { margin-top: 0; }
    /* The strip: the hero, then the line to the card's right edge, like the compact tracker's */
    .fc-strip-c { display: flex; align-items: center; gap: 20px; height: 100%; }
    .fc-strip-c .fc-head { width: 112px; flex: none; }
    .fc-strip-c .fc-value { font-size: 34px; margin-top: 5px; }
    .fc-strip-c .fc-quiet { max-width: none; margin-top: 5px; font-size: 13px; line-height: 18px; }
    .fc-strip-c .fc-chart { flex: 1 1 auto; min-width: 0; margin: 0; padding: 0 0 0 6px; }
    .fc-strip-c .fc-bedside .fc-clock { font-size: 34px; font-weight: 250; margin-top: 5px; }
    .fc-card.compact[data-fit="short"] .fc-strip-c .fc-value { font-size: 28px; }

    /* b: skies. The slots' own skies, painted under the words: Recipe F
       (each column the full sky) on the card, the lower sky on the strip */
    .fc-card.fc-skies { padding: 0; }
    .fc-b { height: 100%; display: flex; flex-direction: column; }
    .fc-b > .fc-head { padding: 20px 20px 0; }
    .fc-band { position: relative; flex: 1 1 0; min-height: 0; display: flex; flex-direction: column; justify-content: flex-end; padding: 16px 20px; }
    .fc-b.both .fc-band + .fc-band::before { content: ''; position: absolute; top: 0; left: 20px; right: 20px; height: 1px; background: currentColor; opacity: 0.2; z-index: 1; }
    .fc-paint, .fc-paint > i { position: absolute; inset: 0; }
    .fc-paint > .top { -webkit-mask-image: linear-gradient(180deg, #000 0, transparent 55%); mask-image: linear-gradient(180deg, #000 0, transparent 55%); }
    .fc-paint > .bottom { -webkit-mask-image: linear-gradient(180deg, transparent 55%, #000 100%); mask-image: linear-gradient(180deg, transparent 55%, #000 100%); }
    .fc-paint > .scrim { -webkit-mask-image: linear-gradient(180deg, transparent 40%, #000 100%); mask-image: linear-gradient(180deg, transparent 40%, #000 100%); }
    .fc-band.lower .fc-paint > .top { -webkit-mask-image: linear-gradient(180deg, #000 0, transparent 50%); mask-image: linear-gradient(180deg, #000 0, transparent 50%); }
    .fc-band.lower .fc-paint > .bottom { -webkit-mask-image: linear-gradient(180deg, transparent 50%, #000 100%); mask-image: linear-gradient(180deg, transparent 50%, #000 100%); }
    .fc-band-text { position: relative; }
    .fc-runs { position: relative; height: 18px; margin-bottom: 6px; font-size: 13px; line-height: 18px; font-weight: 600; }
    .fc-runs > span { position: absolute; top: 0; white-space: nowrap; }
    .fc-runs > .fc-hl { right: 0; display: inline-flex; gap: 10px; font-weight: 500; }
    .fc-cols { display: grid; grid-template-columns: repeat(var(--awc-cols), minmax(0, 1fr)); column-gap: 8px; margin: 0; padding: 0; list-style: none; }
    .fc-cols > li { display: flex; flex-direction: column; min-width: 0; }
    .fc-col-time { font-size: 13px; line-height: 16px; font-weight: 400; white-space: nowrap; }
    .fc-col-temp { margin-top: 2px; font-size: 17px; line-height: 22px; font-weight: 500; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .fc-col-temp.l { font-size: 22px; line-height: 26px; font-weight: 400; }
    .fc-col-temp .fc-low { font-size: 15px; font-weight: 400; }
    .fc-col-chance { min-height: 16px; font-size: 13px; line-height: 16px; font-weight: 500; font-variant-numeric: tabular-nums; }
    .fc-card.compact .fc-band { padding: 10px 20px; justify-content: center; }
    .fc-card.compact .fc-col-chance:empty { min-height: 0; }
    .fc-card[data-fit="x1"] .fc-b.both .fc-band + .fc-band { display: none; }
    .fc-card:not(.sky) .fc-paint { display: none; }
    .fc-card:not(.sky) :is(.fc-col-time, .fc-low) { color: var(--secondary-text-color); }
    .fc-card:not(.sky) .fc-col-chance { color: var(--primary-color); }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block { margin-top: 0; padding-top: 0; }
    .fc-card[data-fit^="x"] .fc-a.both .fc-days-block::before { display: none; }
`;

export const FORECAST_VIEWS: ForecastViews = {
    version: 1,
    sectionCss: SECTION_CSS,
    renderSection: (ctx: ForecastContext) => {
        switch (ctx.variant) {
            case 'b': return sectionSentence(ctx);
            case 'c': return sectionLine(ctx);
            default: return sectionColumns(ctx);
        }
    },
    fit: fitWords,
    renderHighLow: (ctx: ForecastContext) => highLowHtml(modelFor(ctx).today, ctx.hass),
    cardCss: CARD_CSS,
    renderCard: (ctx: CardContext) => {
        switch (ctx.variant) {
            case 'b': return cardSkies(ctx);
            case 'c': return cardInstrument(ctx);
            default: return (ctx.clock ? headHtml(modelFor(ctx, 10), ctx) : '') + cardHoursAndDays(ctx);
        }
    },
    openPopup: (ctx: PopupContext) => openPopup(ctx),
};
