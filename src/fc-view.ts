// The view that opens on tap (filled in below)
import type { ForecastHost } from './forecast-host';
export interface ViewState { model: unknown; metric: string; slots: number; chipsLevel: number; small: HTMLElement }
export function openView(host: ForecastHost, _state: ViewState): void {
    host.moreInfo();
}
