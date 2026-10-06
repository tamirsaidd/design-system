import type { ReactNode } from 'react';
import { Avatar } from '../../components/Avatar/Avatar';
import { ThemeScope } from '../../theme/ThemeScope';
import { student } from './data';
import { links } from './links';

const nav = [
  { id: 'programs', label: 'Programs', href: links.programs },
  { id: 'scholarships', label: 'Scholarships', href: links.scholarships },
] as const;

export interface ChapterFrameProps {
  current: (typeof nav)[number]['id'];
  children: ReactNode;
}

/** The product shell for chapter 1: quiet navigation, then the page. */
export function ChapterFrame({ current, children }: ChapterFrameProps) {
  return (
    <ThemeScope chapter="education-platform" className="min-h-dvh">
      <header className="sticky top-0 z-(--ds-layer-sticky) border-b border-line-subtle bg-surface-raised">
        <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-base px-gutter sm:px-gutter-wide">
          <nav aria-label="Main">
            <ul className="m-0 flex list-none items-center gap-tight p-0">
              {nav.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_top"
                    aria-current={item.id === current ? 'page' : undefined}
                    className="target-area inline-flex h-control-sm items-center rounded-control px-snug text-sm font-semibold text-fg-muted no-underline transition-[background-color,color] duration-(--ds-duration-fast) hover:bg-surface-muted hover:text-fg aria-[current=page]:bg-accent-subtle aria-[current=page]:text-accent-strong"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <Avatar name={student.name} size="sm" />
        </div>
      </header>
      <main className="mx-auto flex max-w-content flex-col gap-section px-gutter py-section sm:px-gutter-wide">
        {children}
      </main>
    </ThemeScope>
  );
}
