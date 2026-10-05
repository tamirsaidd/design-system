#!/usr/bin/env node
/**
 * Runs axe on every story of the built Storybook, in light and in dark, the
 * same way the Storybook a11y addon does: the whole story document, with
 * Storybook's own wrappers excluded and the page-level `region` rule off.
 *
 *   npm run build-storybook && npm run check:a11y
 *   node scripts/a11y-check.mjs --only components-button
 *
 * Uses the Google Chrome already installed on the machine (or the CI runner),
 * so no browser download is needed. Missing Chrome is a failure, never a skip.
 */
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { extname, join, normalize, resolve } from 'node:path';
import { chromium } from 'playwright-core';

const require = createRequire(import.meta.url);
const ROOT = resolve(process.argv.includes('--dir') ? process.argv[process.argv.indexOf('--dir') + 1] : 'storybook-static');
const ONLY = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1] : '';
const THEMES = ['light', 'dark'];

if (!existsSync(join(ROOT, 'index.json'))) {
  console.error(`No built Storybook at ${ROOT}. Run \`npm run build-storybook\` first.`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

/** A tiny static server: module scripts will not load from file:// URLs. */
export function serve(dir) {
  const server = createServer((req, res) => {
    const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
    // Browsers ask for /favicon.ico when the preview iframe is opened as a page
    // on its own. The real Storybook shell sets its own icon, so answer empty.
    if (path === '/favicon.ico') {
      res.writeHead(204).end();
      return;
    }
    let file = join(dir, path);
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
    if (!existsSync(file)) {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

export async function launch() {
  try {
    return await chromium.launch({ channel: 'chrome', headless: true });
  } catch (error) {
    console.error('Could not start Google Chrome. Install Chrome, or run this in CI where it is preinstalled.');
    throw error;
  }
}

async function main() {
  const index = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
  const stories = Object.values(index.entries).filter((e) => e.type === 'story' && e.id.includes(ONLY));
  const server = await serve(ROOT);
  const base = `http://127.0.0.1:${server.address().port}`;
  const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  const failures = [];
  let runs = 0;
  for (const story of stories) {
    for (const theme of THEMES) {
      await page.goto(`${base}/iframe.html?id=${story.id}&viewMode=story&globals=theme:${theme}`);
      await page.waitForFunction(() => document.querySelector('#storybook-root')?.childElementCount > 0, null, {
        timeout: 15000,
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      if ((await page.evaluate(() => typeof window.axe)) === 'undefined') await page.addScriptTag({ content: axeSource });
      const result = await page.evaluate(async () => {
        const axe = window.axe;
        axe.reset();
        axe.configure({ rules: [{ id: 'region', enabled: false }] });
        return axe.run(
          { include: [document.body], exclude: ['.sb-wrapper', '#storybook-docs', '#storybook-highlights-root'] },
          { resultTypes: ['violations'] },
        );
      });
      runs += 1;
      for (const v of result.violations) {
        failures.push(
          `${story.title} / ${story.name} [${theme}] ${v.id} (${v.impact}): ${v.help}\n      ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(' ') + (n.failureSummary ? ` :: ${n.failureSummary.split('\n').slice(1, 2).join(' ').trim()}` : ''))
            .join('\n      ')}`,
        );
      }
    }
  }
  await browser.close();
  server.close();

  if (errors.length) {
    console.error(`Page errors while rendering stories:\n  - ${[...new Set(errors)].join('\n  - ')}`);
  }
  if (failures.length) {
    console.error(`axe found ${failures.length} violation group(s) in ${runs} story renders:\n  - ${failures.join('\n  - ')}`);
    process.exit(1);
  }
  if (errors.length) process.exit(1);
  console.log(`a11y OK: ${stories.length} stories x ${THEMES.length} themes = ${runs} renders, zero axe violations.`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
