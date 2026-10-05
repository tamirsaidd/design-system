import type { ReactNode } from 'react';

export interface DocListItem {
  term: ReactNode;
  detail: ReactNode;
  /** A quieter line under the detail, such as how a rule is enforced. */
  meta?: ReactNode;
}

/**
 * A two-column list for docs pages: stacked on phones, side by side from
 * 640px. Used instead of markdown tables, which crush at phone width.
 */
export function DocList({ items }: { items: DocListItem[] }) {
  return (
    <div className="sb-unstyled my-loose font-sans">
      <dl className="m-0 divide-y divide-line-subtle rounded-card border border-line bg-surface-raised">
        {items.map((item, index) => (
          <div key={index} className="grid gap-nudge px-card py-snug sm:grid-cols-[minmax(0,13rem)_1fr] sm:gap-x-loose">
            <dt className="text-md font-semibold leading-normal text-fg">{item.term}</dt>
            <dd className="m-0 flex flex-col gap-nudge text-md leading-normal text-fg-secondary">
              <span>{item.detail}</span>
              {item.meta ? <span className="text-sm text-fg-muted">{item.meta}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
