// Entry point for the lazy-loaded planes bundle.
//
// The main bundle doesn't include the plane fly-overs or the aircraft they
// draw. A card with a flights sensor (or dev mode) injects a <script> for
// this bundle the first time it starts its planes; loading it hands the
// animation class to the card through a window global (the two bundles
// don't share a module scope).

import { PlanesAnimation } from './planes-animation';

window.AnimatedWeatherCardPlanes = PlanesAnimation;
