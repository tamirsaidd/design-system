import { chapters } from '../../../src/tokens/chapters';
import { resolve } from '../../../src/tokens/flatten';
import { useDocumentTheme } from './useDocumentTheme';

const isColour = (value: string) => /^#[0-9a-f]{6}$/i.test(value);

function Swatch({ value }: { value: string }) {
  return isColour(value) ? (
    <span aria-hidden className="block size-5 shrink-0 rounded-sm border border-line" style={{ background: value }} />
  ) : null;
}

/** Every token a chapter overrides, base value beside chapter value, in the current theme. */
export function ChapterTokenDiff({ chapter }: { chapter: string }) {
  const mode = useDocumentTheme();
  const theme = chapters.find((c) => c.id === chapter);
  if (!theme) return null;
  const names = [...Object.keys(theme.shared), ...Object.keys(theme[mode])];
  return (
    <div className="sb-unstyled my-loose font-sans text-fg">
      <ul className="m-none flex list-none flex-col divide-y divide-line-subtle rounded-card border border-line bg-surface-raised p-none">
        <li className="hidden grid-cols-[minmax(0,14rem)_1fr_1fr] gap-x-base px-card py-tight text-xs font-semibold text-fg-muted sm:grid">
          <span>Token</span>
          <span>Base theme</span>
          <span>This chapter</span>
        </li>
        {names.map((name) => {
          const base = resolve(name, mode);
          const own = resolve(name, mode, theme);
          return (
            <li key={name} className="grid gap-x-base gap-y-nudge px-card py-tight sm:grid-cols-[minmax(0,14rem)_1fr_1fr]">
              <code className="font-mono text-xs text-fg">--ds-{name}</code>
              <span className="flex min-w-0 items-center gap-tight">
                <span className="w-14 shrink-0 text-xs text-fg-muted sm:hidden">Base</span>
                <Swatch value={base} />
                <span className="font-mono text-xs break-words text-fg-muted">{base}</span>
              </span>
              <span className="flex min-w-0 items-center gap-tight">
                <span className="w-14 shrink-0 text-xs text-fg-muted sm:hidden">Chapter</span>
                <Swatch value={own} />
                <span className="font-mono text-xs break-words text-fg-secondary">{own}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** The values where a chapter departs from the product's own tokens, and why. */
export function ChapterDerivedNotes({ chapter }: { chapter: string }) {
  const theme = chapters.find((c) => c.id === chapter);
  if (!theme) return null;
  return (
    <div className="sb-unstyled my-loose font-sans">
      <dl className="m-none divide-y divide-line-subtle rounded-card border border-line bg-surface-raised">
        {Object.entries(theme.derived).map(([token, why]) => (
          <div key={token} className="grid gap-nudge px-card py-snug sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-x-loose">
            <dt className="font-mono text-sm text-fg">{token}</dt>
            <dd className="m-none text-md leading-normal text-fg-secondary">{why}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
