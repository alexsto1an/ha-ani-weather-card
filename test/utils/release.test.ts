import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CARD_VERSION } from '../../src/constants';

const read = (file: string) => readFileSync(join(process.cwd(), file), 'utf8');

/** The bundles the build makes, from esbuild.config.js */
const bundles = () => [...read('esbuild.config.js').matchAll(/outfile: '([^']+)'/g)].map(m => m[1]).sort();

describe('what a release gives HACS', () => {
    it('names the card\'s resource and never asks for a zip', () => {
        const hacs = JSON.parse(read('hacs.json'));
        // HACS reads hacs.json at the release tag. With zip_release it downloads
        // the asset `filename` names and unzips it, so a .js filename fails.
        expect(hacs.zip_release).toBeUndefined();
        expect(hacs.filename).toBe('animated-weather-card.js');
        expect(bundles()).toContain(hacs.filename);
        // The keys HACS's validation accepts
        const accepted = ['name', 'content_in_root', 'country', 'filename', 'hacs', 'hide_default_branch',
            'homeassistant', 'persistent_directory', 'render_readme', 'zip_release'];
        for (const key of Object.keys(hacs)) expect(accepted, key).toContain(key);
    });

    it('attaches every bundle the build makes, and only those', () => {
        const workflow = read('.github/workflows/release.yml');
        const files = workflow.split('files: |')[1].split('\n').map(line => line.trim()).filter(line => /\.\w+$/.test(line));
        expect(files.sort()).toEqual(bundles());
        expect(workflow).not.toMatch(/\.zip\b/);
    });

    it('keeps the version in step', () => {
        expect(JSON.parse(read('package.json')).version).toBe(CARD_VERSION);
        const lock = JSON.parse(read('package-lock.json'));
        expect(lock.version).toBe(CARD_VERSION);
        expect(lock.packages[''].version).toBe(CARD_VERSION);
        expect(read('CHANGELOG.md')).toContain(`## [${CARD_VERSION}] - `);
    });
});
