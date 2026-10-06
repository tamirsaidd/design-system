/**
 * Blocks for the Tokens page. Every swatch paints with the live CSS variable,
 * so the page follows the light and dark toggle; the printed values come from
 * tokens.ts through the same resolver the build uses.
 */
import type { ReactNode } from 'react';
import { cn } from '../../../src/lib/cn';
import { cssVar, flattenTokens, resolve, type FlatToken } from '../../../src/tokens/flatten';
import { tailwindMap } from '../../../src/tokens/tailwind-map';
import { useDocumentTheme } from './useDocumentTheme';

const all = flattenTokens();
const byGroup = (group: string) => all.filter((t) => t.group === group);

/** Which utility class reads a given token, if any. */
const utilityFor = (() => {
  const prefix: Record<string, string> = {
    color: '',
    font: 'font-',
    text: 'text-',
    'font-weight': 'font-',
    leading: 'leading-',
    tracking: 'tracking-',
    radius: 'rounded-',
    shadow: 'shadow-',
    spacing: '',
    container: 'max-w-',
    ease: 'ease-',
  };
  const map = new Map<string, string[]>();
  for (const [ns, entries] of Object.entries(tailwindMap)) {
    for (const [util, token] of Object.entries(entries)) {
      const name = ns === 'spacing' ? `p-${util}, gap-${util}` : ns === 'color' ? `*-${util}` : `${prefix[ns]}${util}`;
      map.set(token, [...(map.get(token) ?? []), name]);
    }
  }
  return (token: string) => map.get(token)?.join(' · ');
})();

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('sb-unstyled my-loose font-sans text-fg', className)}>{children}</div>;
}

function Code({ children }: { children: ReactNode }) {
  return <code className="font-mono text-xs text-fg-secondary">{children}</code>;
}

function ThemedValue({ token }: { token: FlatToken }) {
  const mode = useDocumentTheme();
  const other = mode === 'light' ? 'dark' : 'light';
  return (
    <span className="flex flex-col">
      <Code>
        {mode} {resolve(token.name, mode)}
      </Code>
      <span className="font-mono text-xs text-fg-muted">
        {other} {resolve(token.name, other)}
      </span>
    </span>
  );
}

/** A ramp: eleven or ten steps, nearest the canvas first. */
export function ColorRamp({ group }: { group: 'brand' | 'neutral' }) {
  return (
    <Frame>
      <ul className="m-none grid list-none grid-cols-2 gap-snug p-none sm:grid-cols-4 lg:grid-cols-6">
        {byGroup(group).map((t) => (
          <li key={t.name} className="flex flex-col gap-tight">
            <span
              aria-hidden
              className="block h-control-lg rounded-md border border-line"
              style={{ background: `var(${cssVar(t.name)})` }}
            />
            <span className="text-sm font-semibold">{t.name}</span>
            <ThemedValue token={t} />
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Semantic colours: what each one is for, and the utility that reads it. */
export function SemanticColors({ groups }: { groups: string[] }) {
  const rows = groups.flatMap((g) => byGroup(g));
  return (
    <Frame>
      <ul className="m-none flex list-none flex-col divide-y divide-line-subtle rounded-card border border-line bg-surface-raised p-none">
        {rows.map((t) => (
          <li key={t.name} className="grid grid-cols-[auto_1fr] items-start gap-x-base gap-y-nudge px-card py-snug sm:grid-cols-[auto_1fr_auto]">
            <span
              aria-hidden
              className="mt-nudge block size-8 rounded-md border border-line"
              style={{ background: `var(${cssVar(t.name)})` }}
            />
            <span className="flex min-w-0 flex-col gap-nudge">
              <Code>{cssVar(t.name)}</Code>
              {t.note ? <span className="text-sm text-fg-secondary">{t.note}</span> : null}
              {utilityFor(t.name) ? <span className="font-mono text-xs text-fg-muted">{utilityFor(t.name)}</span> : null}
            </span>
            <span className="col-start-2 sm:col-start-3">
              <ThemedValue token={t} />
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Status sets, shown the way components use them: tint, text, edge and solid. */
export function StatusColors() {
  const statuses = ['success', 'warning', 'danger', 'info'] as const;
  return (
    <Frame>
      <ul className="m-none grid list-none gap-snug p-none sm:grid-cols-2">
        {statuses.map((s) => (
          <li
            key={s}
            className="flex flex-col gap-tight rounded-card border p-base"
            style={{ background: `var(--ds-${s}-subtle)`, borderColor: `var(--ds-${s}-border)` }}
          >
            <span className="flex items-center gap-tight">
              <span aria-hidden className="block size-3 rounded-full" style={{ background: `var(--ds-${s}-bg)` }} />
              <span className="text-md font-semibold" style={{ color: `var(--ds-${s}-text)` }}>
                {s}
              </span>
            </span>
            {byGroup(s).map((t) => (
              <span key={t.name} className="flex flex-wrap items-baseline justify-between gap-tight">
                <span className="font-mono text-xs" style={{ color: `var(--ds-${s}-text)` }}>
                  {cssVar(t.name)}
                </span>
                <span className="font-mono text-xs" style={{ color: `var(--ds-${s}-text)` }}>
                  {resolve(t.name, 'light')} / {resolve(t.name, 'dark')}
                </span>
              </span>
            ))}
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Families, each set in its own face. */
export function FontFamilies() {
  const samples: Record<string, string> = {
    'font-display': 'Same parts, different products',
    'font-sans': 'Labels persist, hints stay, errors say what to do next.',
    'font-mono': '--ds-accent-base 7.22:1',
  };
  return (
    <Frame className="flex flex-col gap-base">
      {byGroup('font-family').map((t) => (
        <div key={t.name} className="flex flex-col gap-nudge border-b border-line-subtle pb-base">
          <span className="text-2xl" style={{ fontFamily: `var(${cssVar(t.name)})` }}>
            {samples[t.name]}
          </span>
          <Code>
            {cssVar(t.name)}: {t.value}
          </Code>
        </div>
      ))}
    </Frame>
  );
}

/** The type scale, each step at its real size. */
export function TypeScale() {
  return (
    <Frame className="flex flex-col gap-snug">
      {byGroup('font-size').map((t) => (
        <div key={t.name} className="grid grid-cols-1 items-baseline gap-x-base sm:grid-cols-[10rem_1fr]">
          <span className="flex flex-col">
            <Code>{t.name}</Code>
            <span className="font-mono text-xs text-fg-muted">
              {t.value} · {Number.parseFloat(t.value ?? '0') * 16}px
            </span>
          </span>
          <span
            className={cn('leading-tight', Number.parseFloat(t.value ?? '0') >= 1.25 && 'font-display font-heading')}
            style={{ fontSize: `var(${cssVar(t.name)})` }}
          >
            Find what fits you
          </span>
        </div>
      ))}
      <div className="flex flex-wrap gap-x-loose gap-y-tight pt-base">
        {[...byGroup('font-weight'), ...byGroup('line-height'), ...byGroup('letter-spacing')].map((t) => (
          <Code key={t.name}>
            {t.name}: {t.value}
          </Code>
        ))}
      </div>
    </Frame>
  );
}

/** The spacing scale, and the role names components use instead of numbers. */
export function SpacingScale() {
  return (
    <Frame className="flex flex-col gap-loose">
      <ul className="m-none flex list-none flex-col gap-tight p-none">
        {byGroup('spacing').map((t) => (
          <li key={t.name} className="grid grid-cols-[6rem_1fr] items-center gap-base">
            <Code>
              {t.name} {t.value}
            </Code>
            <span aria-hidden className="block h-4 rounded-sm bg-accent" style={{ width: `var(${cssVar(t.name)})` }} />
          </li>
        ))}
      </ul>
      <div className="flex flex-col gap-tight">
        <p className="m-none text-sm font-semibold">Role names in class strings</p>
        <ul className="m-none grid list-none gap-x-loose gap-y-nudge p-none sm:grid-cols-2">
          {Object.entries(tailwindMap.spacing).map(([role, token]) => (
            <li key={role} className="flex justify-between gap-base border-b border-line-subtle py-nudge">
              <Code>p-{role}</Code>
              <span className="font-mono text-xs text-fg-muted">
                {token} · {resolve(token, 'light')}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

/** Radii, from square to pill. */
export function RadiusScale() {
  return (
    <Frame>
      <ul className="m-none grid list-none grid-cols-3 gap-base p-none sm:grid-cols-6">
        {byGroup('radius').map((t) => (
          <li key={t.name} className="flex flex-col gap-tight">
            <span
              aria-hidden
              className="block size-16 border border-line-strong bg-surface-muted"
              style={{ borderRadius: `var(${cssVar(t.name)})` }}
            />
            <Code>{t.name}</Code>
            <span className="font-mono text-xs text-fg-muted">{t.value}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Elevation: the only three shadows in the system, none on resting cards. */
export function ElevationScale() {
  return (
    <Frame>
      <ul className="m-none grid list-none gap-loose p-none sm:grid-cols-3">
        {byGroup('elevation').map((t) => (
          <li
            key={t.name}
            className="flex h-32 flex-col justify-end gap-nudge rounded-card border border-line bg-surface-overlay p-base"
            style={{ boxShadow: `var(${cssVar(t.name)})` }}
          >
            <span className="text-sm font-semibold">{t.name}</span>
            <span className="text-sm text-fg-secondary">{t.note}</span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}

/** Everything else: motion, control sizes, layers, containers, component tokens. */
export function TokenTable({ groups }: { groups: string[] }) {
  const rows = groups.flatMap((g) => byGroup(g));
  return (
    <Frame>
      <ul className="m-none flex list-none flex-col divide-y divide-line-subtle rounded-card border border-line bg-surface-raised p-none">
        {rows.map((t) => (
          <li key={t.name} className="flex flex-col gap-nudge px-card py-snug sm:flex-row sm:items-baseline sm:justify-between">
            <Code>{cssVar(t.name)}</Code>
            <span className="font-mono text-xs text-fg-muted">
              {t.value ?? `${t.light} / ${t.dark}`}
              {t.value?.includes('{') ? ` → ${resolve(t.name, 'light')}` : ''}
            </span>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
