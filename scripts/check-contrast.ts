/**
 * Contrast is measured, not eyeballed. This checks every foreground and
 * background pairing the components actually use, in light and dark, for the
 * base theme and every chapter theme.
 *
 *   npm run check:contrast
 *
 * Floors: 4.5:1 for text (WCAG 1.4.3), 3:1 for control edges, focus rings and
 * status icons (WCAG 1.4.11), and 1.4:1 for card edges, which is our own floor
 * so a flat card still reads as a surface. Each pair names where it is used;
 * a component that puts a colour somewhere new adds its pair here first.
 */
import { chapters, type ChapterTheme } from '../src/tokens/chapters';
import { resolve, type Mode } from '../src/tokens/flatten';

type Pair = [fg: string, bg: string, min: number, why: string];

const surfaces = ['surface-base', 'surface-raised', 'surface-overlay', 'surface-muted'];
const floating = ['surface-base', 'surface-raised', 'surface-overlay'];
const TEXT = 4.5;
const UI = 3;
const EDGE = 1.4;

const pairs: Pair[] = [
  ...surfaces.flatMap((bg): Pair[] => [
    ['text-primary', bg, TEXT, 'body text'],
    ['text-secondary', bg, TEXT, 'supporting text'],
    ['text-muted', bg, TEXT, 'hints and metadata'],
  ]),
  ...floating.map((bg): Pair => ['accent-text', bg, TEXT, 'links']),
  ['accent-strong', 'accent-subtle', TEXT, 'brand badge and selected text'],
  ['accent-on', 'accent-base', TEXT, 'primary button label'],
  ['accent-on', 'accent-hover', TEXT, 'primary button label, hover'],
  ['accent-on', 'accent-pressed', TEXT, 'primary button label, pressed'],
  ['button-danger-on', 'button-danger-bg', TEXT, 'danger button label'],
  ['button-danger-on', 'button-danger-bg-hover', TEXT, 'danger button label, hover'],
  ...['success', 'warning', 'danger', 'info'].flatMap((s): Pair[] => [
    [`${s}-text`, `${s}-subtle`, TEXT, `${s} badge and notice text`],
    ...floating.map((bg): Pair => [`${s}-text`, bg, TEXT, `${s} message text`]),
    // Status icons sit on cards, toasts and modals, never straight on the canvas.
    ...['surface-raised', 'surface-overlay'].map((bg): Pair => [`${s}-bg`, bg, UI, `${s} icon`]),
  ]),
  // A field in error swaps its edge to the danger colour, wherever the field sits.
  ...['surface-base', 'surface-raised'].map((bg): Pair => ['danger-bg', bg, UI, 'field edge in error']),
  ...['surface-base', 'surface-raised'].map((bg): Pair => ['control-border', bg, UI, 'form control edge']),
  ...floating.map((bg): Pair => ['focus-ring', bg, UI, 'focus outline']),
  ['accent-base', 'surface-raised', UI, 'checked control fill'],
  ['border-default', 'surface-base', EDGE, 'card edge on the canvas'],
];

// ---------- colour maths (sRGB, WCAG 2.x relative luminance) ----------
function rgb(value: string): [number, number, number] {
  const hex = value.trim().match(/^#([0-9a-f]{6})$/i);
  if (!hex) throw new Error(`not a solid hex colour: ${value}`);
  return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16) / 255) as [number, number, number];
}
const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function luminance(value: string) {
  const [r, g, b] = rgb(value).map(lin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// ---------- run ----------
const themes: (ChapterTheme | undefined)[] = [undefined, ...chapters];
const failures: string[] = [];
let checked = 0;
let lowest = { ratio: Infinity, label: '' };

for (const theme of themes) {
  for (const mode of ['light', 'dark'] as Mode[]) {
    for (const [fg, bg, min, why] of pairs) {
      const a = resolve(fg, mode, theme);
      const b = resolve(bg, mode, theme);
      const ratio = contrast(a, b);
      checked += 1;
      const label = `${theme?.id ?? 'base'} ${mode}: ${fg} on ${bg} (${why}) ${ratio.toFixed(2)}:1, needs ${min}:1`;
      if (ratio < min) failures.push(label);
      if (min === TEXT && ratio < lowest.ratio) lowest = { ratio, label };
    }
  }
}

if (failures.length) {
  console.error(`Contrast failures (${failures.length} of ${checked}):\n  - ${failures.join('\n  - ')}`);
  process.exit(1);
}
console.log(`Contrast OK: ${checked} pairs across ${themes.length} theme(s), light and dark.`);
console.log(`Tightest text pair: ${lowest.label}`);
