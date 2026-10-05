#!/usr/bin/env node
/**
 * Screenshots of the built Storybook for design review: phone width first,
 * then desktop, in light and dark. Local tool; not part of CI.
 *
 *   node scripts/screenshots.mjs --out <dir> [--only <id-fragment>] [--docs]
 *
 * Writes <dir>/<story-id>__<width>__<theme>.png. Pass --docs to include the
 * standalone docs pages (Tokens, Design principles and the rest).
 */
import { mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { launch, serve } from './a11y-check.mjs';

const arg = (name, fallback) =>
  process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : fallback;
const ROOT = resolve(arg('--dir', 'storybook-static'));
const OUT = resolve(arg('--out', 'shots'));
const ONLY = arg('--only', '');
const WITH_DOCS = process.argv.includes('--docs');
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1440, height: 900 },
];
const THEMES = ['light', 'dark'];

const index = JSON.parse(readFileSync(join(ROOT, 'index.json'), 'utf8'));
const isDocsPage = (e) => e.type === 'docs' && e.tags?.includes('unattached-mdx');
const entries = Object.values(index.entries).filter(
  (e) => (e.type === 'story' || (WITH_DOCS && isDocsPage(e))) && e.id.includes(ONLY),
);
mkdirSync(OUT, { recursive: true });

const server = await serve(ROOT);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await launch();
const consoleErrors = [];
let shots = 0;
for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 2 });
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(`${m.text()} (${page.url()})`));
  page.on('pageerror', (e) => consoleErrors.push(`${e.message} (${page.url()})`));
  page.on('response', (r) => r.status() >= 400 && consoleErrors.push(`HTTP ${r.status()} ${r.url()}`));
  for (const entry of entries) {
    for (const theme of THEMES) {
      const mode = entry.type === 'docs' ? 'docs' : 'story';
      await page.goto(`${base}/iframe.html?id=${entry.id}&viewMode=${mode}&globals=theme:${theme}`);
      const root = mode === 'docs' ? '#storybook-docs' : '#storybook-root';
      await page.waitForFunction((sel) => document.querySelector(sel)?.childElementCount > 0, root, { timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(450);
      await page.screenshot({ path: join(OUT, `${entry.id}__${viewport.width}__${theme}.png`), fullPage: true });
      shots += 1;
    }
  }
  await page.close();
}
await browser.close();
server.close();
if (consoleErrors.length) {
  console.error(`Console errors during capture:\n  - ${[...new Set(consoleErrors)].join('\n  - ')}`);
  process.exitCode = 1;
}
console.log(`Wrote ${shots} screenshots to ${OUT}`);
