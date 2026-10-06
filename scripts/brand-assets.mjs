#!/usr/bin/env node
/**
 * Brand assets for the public Storybook, generated from the tokens so they
 * never drift from the brand: the favicon (the portfolio's monogram tile in
 * the current accent) and the 1200 by 630 share image (a capture of the
 * hidden Internal/Social card story). Run after a Storybook build:
 *
 *   npm run build-storybook && npm run brand-assets
 */
import { writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { launch, serve } from './a11y-check.mjs';

const token = (name) =>
  execFileSync('npx', ['tsx', '-e', `import { resolve } from './src/tokens/flatten.ts'; process.stdout.write(resolve('${name}', 'light'));`], {
    encoding: 'utf8',
  }).trim();

// rgb() rather than hex: values live in src/tokens only, as hex.
const rgb = (value) => {
  const hex = value.replace('#', '');
  return `rgb(${[0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(',')})`;
};

const ink = rgb(token('neutral-900'));
const accent = rgb(token('brand-600'));
const white = rgb(token('surface-raised'));

writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="13.5" fill="${ink}"/>
  <rect x="7" y="9" width="21" height="7" rx="3.5" fill="${white}"/>
  <rect x="20.5" y="9" width="7" height="31" rx="3.5" fill="${white}"/>
  <rect x="30" y="9" width="11" height="7" rx="3.5" fill="${accent}"/>
</svg>
`,
);

const server = await serve('storybook-static');
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 600, height: 315 }, deviceScaleFactor: 2 });
await page.goto(`http://127.0.0.1:${server.address().port}/iframe.html?id=internal-social-card--default&viewMode=story&globals=theme:light`);
await page.waitForFunction(() => document.querySelector('#storybook-root')?.childElementCount > 0);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);
await page.screenshot({ path: 'public/og-image.png', clip: { x: 0, y: 0, width: 600, height: 315 } });
await browser.close();
server.close();
console.log('Wrote public/favicon.svg and public/og-image.png (1200x630).');
