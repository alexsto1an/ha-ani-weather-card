// Entry point for the lazy-loaded developer panel bundle.
//
// The main bundle doesn't include the dev panel. A card with dev_mode on
// injects a <script> for this bundle the first time it renders; loading it
// hands the panel class to the card through a window global (the two
// bundles don't share a module scope).

import { DevPanel } from './dev-panel';

window.AnimatedWeatherCardDevPanel = DevPanel;
