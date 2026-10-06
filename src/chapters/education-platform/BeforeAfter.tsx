import { ThemeScope } from '../../theme/ThemeScope';
import { programById } from './data';
import { ProgramCard } from './ProgramCard';

/**
 * The "before": a reconstruction of a common program-card pattern, built as
 * a placeholder. It is not a screenshot of any shipped screen.
 */
function BeforePlaceholder() {
  const filled =
    'inline-flex h-control-sm items-center rounded-none border-0 bg-accent px-snug text-xs font-bold uppercase tracking-wide text-on-accent';
  return (
    <div className="flex max-w-dialog-sm flex-col gap-nudge border-2 border-line-strong bg-surface-raised p-tight font-sans">
      <p className="m-none text-xs font-bold uppercase tracking-wide">Environmental Engineering</p>
      <p className="m-none text-xs font-bold uppercase tracking-wide">Northfield University</p>
      <p className="m-none text-xs font-bold uppercase tracking-wide">Match score: 87%</p>
      <p className="m-none text-xs font-bold uppercase tracking-wide">Status: see details</p>
      <div className="flex flex-wrap gap-nudge pt-nudge">
        <button type="button" className={filled}>
          Submit
        </button>
        <button type="button" className={filled}>
          Save
        </button>
        <button type="button" className={filled}>
          Share
        </button>
      </div>
    </div>
  );
}

function Notes({ items }: { items: string[] }) {
  return (
    <ul className="m-none flex list-disc flex-col gap-tight pl-loose text-md leading-normal text-fg-secondary marker:text-fg-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/** One program card, before and after the system. */
export function BeforeAfter() {
  const program = programById('environmental-engineering');
  return (
    <ThemeScope chapter="education-platform" className="min-h-dvh">
      <main className="mx-auto flex max-w-content flex-col gap-section px-gutter py-section sm:px-gutter-wide">
        <div className="flex max-w-reading flex-col gap-tight">
          <h1 className="m-none text-2xl sm:text-3xl">Before and after</h1>
          <p className="m-none text-md leading-normal text-fg-secondary">
            One program card, before and after the system. The before is a reconstruction of a common pattern, built as
            a placeholder; it is not a screenshot of a shipped screen.
          </p>
        </div>
        <div className="grid items-start gap-block lg:grid-cols-2">
          <figure className="m-none flex flex-col gap-loose">
            <figcaption className="flex flex-col gap-snug">
              <h2 className="m-none text-lg">Before</h2>
              <Notes
                items={[
                  'A score with no source. 87% of what, and says who?',
                  'Three filled buttons, so none of them leads, and the main one says Submit.',
                  'Every line in the same weight and case, so nothing reads first.',
                ]}
              />
            </figcaption>
            <BeforePlaceholder />
          </figure>
          <figure className="m-none flex flex-col gap-loose">
            <figcaption className="flex flex-col gap-snug">
              <h2 className="m-none text-lg">After</h2>
              <Notes
                items={[
                  'The verdict comes first, in words: one gap to close, and which course closes it.',
                  'One way in, and it says where it goes.',
                  'The same facts in the same order on every card: school, length, deadline.',
                ]}
              />
            </figcaption>
            <ul className="m-none flex max-w-dialog-sm list-none flex-col p-none">
              <ProgramCard program={program} />
            </ul>
          </figure>
        </div>
      </main>
    </ThemeScope>
  );
}
