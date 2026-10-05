/**
 * Turns the nested token object into a flat list of CSS custom properties.
 * Shared by the token build, the contrast check and the Tokens docs page, so
 * all three read tokens exactly the same way.
 */
import { tokens, type Themed } from './tokens';
import type { ChapterTheme } from './chapters/types';

export type Mode = 'light' | 'dark';

export interface FlatToken {
  /** CSS variable name without the `--ds-` prefix, e.g. `surface-base`. */
  name: string;
  /** Docs grouping, e.g. `brand`, `surface`, `spacing`. */
  group: string;
  /** Present on themed tokens. Values may be `{alias}` references. */
  light?: string;
  dark?: string;
  /** Present on tokens that hold in both themes. */
  value?: string;
  note?: string;
}

export const PREFIX = '--ds-';
export const cssVar = (name: string) => `${PREFIX}${name}`;

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function themed(name: string, group: string, t: Themed): FlatToken {
  return { name, group, light: t.light, dark: t.dark, note: t.note };
}

function plain(name: string, group: string, value: string): FlatToken {
  return { name, group, value };
}

/** The flat list, in the order the docs and CSS present it. */
export function flattenTokens(): FlatToken[] {
  const out: FlatToken[] = [];
  const { color, typography, spacing, radius, elevation, motion, size, layer, container, component } =
    tokens;

  for (const [step, t] of Object.entries(color.brand)) out.push(themed(`brand-${step}`, 'brand', t));
  for (const [step, t] of Object.entries(color.neutral)) out.push(themed(`neutral-${step}`, 'neutral', t));
  for (const group of ['surface', 'text', 'border', 'accent', 'focus'] as const) {
    for (const [key, t] of Object.entries(color[group])) out.push(themed(`${group}-${kebab(key)}`, group, t));
  }
  for (const [status, set] of Object.entries(color.semantic)) {
    for (const [key, t] of Object.entries(set)) out.push(themed(`${status}-${key}`, status, t));
  }

  for (const [k, v] of Object.entries(typography.family)) out.push(plain(`font-${k}`, 'font-family', v));
  for (const [k, v] of Object.entries(typography.size)) out.push(plain(`font-size-${k}`, 'font-size', v));
  for (const [k, v] of Object.entries(typography.weight)) out.push(plain(`font-weight-${k}`, 'font-weight', v));
  for (const [k, v] of Object.entries(typography.lineHeight)) out.push(plain(`line-height-${k}`, 'line-height', v));
  for (const [k, v] of Object.entries(typography.letterSpacing)) {
    out.push(plain(`letter-spacing-${k}`, 'letter-spacing', v));
  }

  for (const [k, v] of Object.entries(spacing)) out.push(plain(`space-${k}`, 'spacing', v));
  for (const [k, v] of Object.entries(radius)) out.push(plain(`radius-${k}`, 'radius', v));
  for (const [k, t] of Object.entries(elevation)) out.push(themed(`elevation-${k}`, 'elevation', t));
  for (const [k, v] of Object.entries(motion.duration)) out.push(plain(`duration-${k}`, 'motion', v));
  for (const [k, v] of Object.entries(motion.easing)) out.push(plain(`ease-${kebab(k)}`, 'motion', v));
  for (const [k, v] of Object.entries(size.control)) out.push(plain(`control-${k}`, 'size', v));
  out.push(plain('target-min', 'size', size.target));
  for (const [k, v] of Object.entries(layer)) out.push(plain(`layer-${k}`, 'layer', v));
  for (const [k, v] of Object.entries(container)) out.push(plain(`container-${k}`, 'container', v));

  for (const [part, set] of Object.entries(component)) {
    for (const [k, v] of Object.entries(set)) out.push(plain(`${part}-${kebab(k)}`, 'component', v));
  }
  return out;
}

const ALIAS = /\{([a-z0-9.-]+)\}/gi;

/** `{neutral.50}` → `neutral-50`. */
export const aliasName = (alias: string) => alias.replace(/\./g, '-');

/** Replace every `{alias}` with `var(--ds-alias)`. */
export function toCss(value: string): string {
  return value.replace(ALIAS, (_, a: string) => `var(${cssVar(aliasName(a))})`);
}

/** Every alias a value mentions, as token names. */
export function aliasesIn(value: string): string[] {
  return [...value.matchAll(ALIAS)].map((m) => aliasName(m[1]));
}

/**
 * Resolve a token to its final value in one theme, following aliases.
 * Optionally layer a chapter's overrides on top.
 */
export function resolve(name: string, mode: Mode, chapter?: ChapterTheme, seen: string[] = []): string {
  if (seen.includes(name)) throw new Error(`Token alias cycle: ${[...seen, name].join(' → ')}`);
  const raw = rawValue(name, mode, chapter);
  return raw.replace(ALIAS, (_, a: string) => resolve(aliasName(a), mode, chapter, [...seen, name]));
}

let index: Map<string, FlatToken> | undefined;
export function tokenIndex(): Map<string, FlatToken> {
  index ??= new Map(flattenTokens().map((t) => [t.name, t]));
  return index;
}

function rawValue(name: string, mode: Mode, chapter?: ChapterTheme): string {
  if (chapter) {
    const own = chapter[mode][name] ?? chapter.shared[name];
    if (own !== undefined) return own;
  }
  const t = tokenIndex().get(name);
  if (!t) throw new Error(`Unknown token: ${name}`);
  return t.value ?? t[mode] ?? '';
}
