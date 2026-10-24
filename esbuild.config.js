const esbuild = require('esbuild');

// Five bundles:
//   - animated-weather-card.js         → main runtime, loaded on every dashboard
//   - animated-weather-card-editor.js  → visual editor, lazy-loaded on first open
//   - animated-weather-card-dev.js     → developer panel, lazy-loaded in dev_mode
//   - animated-weather-card-note.js    → note writer, lazy-loaded with show_note
//   - animated-weather-card-planes.js  → plane fly-overs, lazy-loaded with flights_entity
//
// All are emitted as IIFE so they remain drop-in script tags. The main
// bundle injects a <script> for the others the first time it needs them;
// see loadSiblingBundle in src/animated-weather-card.ts.
const watch = process.argv.includes('--watch');

const sharedOptions = {
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  sourcemap: false,
  treeShaking: true,
  platform: 'browser',
  legalComments: 'none',
  drop: ['debugger'],
  // Mangle private properties starting with _, but leave the public DOM /
  // animation surface alone so HA / GSAP can still reach them by name.
  mangleProps: /^_/,
  reserveProps: /^(hass|config|style|innerHTML|outerHTML|addEventListener|removeEventListener|querySelector|querySelectorAll|createElement|appendChild|removeChild|setAttribute|getAttribute|classList|className|dataset|textContent|value|checked|disabled|selected|parentNode|offsetWidth|offsetHeight|getBoundingClientRect|getPropertyValue|setProperty|animationType|layerSelector|containerSelector|isActive|isPaused|getState|getMetrics|start|stop|pause|resume|destroy|updateConfig)$/,
};

const targets = [
  { entryPoints: ['src/animated-weather-card.ts'], outfile: 'animated-weather-card.js' },
  { entryPoints: ['src/animated-weather-card-editor.ts'], outfile: 'animated-weather-card-editor.js' },
  { entryPoints: ['src/animated-weather-card-dev.ts'], outfile: 'animated-weather-card-dev.js' },
  { entryPoints: ['src/animated-weather-card-note.ts'], outfile: 'animated-weather-card-note.js' },
  { entryPoints: ['src/animated-weather-card-planes.ts'], outfile: 'animated-weather-card-planes.js' },
];

if (watch) {
  Promise.all(
    targets.map(t => esbuild.context({ ...sharedOptions, ...t }).then(ctx => ctx.watch()))
  ).then(() => console.log('esbuild: watching for changes…'));
} else {
  Promise.all(targets.map(t => esbuild.build({ ...sharedOptions, ...t })))
    .catch(() => process.exit(1));
}
