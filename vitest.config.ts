import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    setupFiles: ['./test/setup.ts'],
    // The card uses raw HTMLElement (not Lit), so most lifecycle tests only
    // need a DOM and a stub for `window.gsap`. Both are wired up in
    // `test/setup.ts`.
    globals: false,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/animated-weather-card-editor.ts',
        'src/styles/**',
      ],
    },
  },
});
