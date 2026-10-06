import { ArrowLeft } from 'lucide-react';
import { useId } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Card, CardFooter } from '../../components/Card/Card';
import { ChapterFrame } from './ChapterFrame';
import { formatDate, gapsIn, metIn, programById, verdictOf, type RequirementStatus } from './data';
import { links } from './links';
import { VerdictBadge } from './ProgramCard';

const statusBadge: Record<RequirementStatus, { variant: 'success' | 'warning' | 'neutral'; label: string }> = {
  met: { variant: 'success', label: 'Met' },
  gap: { variant: 'warning', label: 'Gap' },
  unpublished: { variant: 'neutral', label: 'Not published' },
};

export interface EligibilityResultProps {
  /** Which sample program to show. */
  programId?: string;
}

/** Screen 2: the verdict for one program, then the evidence behind it. */
export function EligibilityResult({ programId = 'environmental-engineering' }: EligibilityResultProps) {
  const program = programById(programId);
  const verdict = verdictOf(program);
  const met = metIn(program).length;
  const total = program.requirements.length;
  const gaps = gapsIn(program);
  const verdictId = useId();
  const evidenceId = useId();

  const headline =
    verdict === 'explore'
      ? `We can check ${met} of ${total} requirements so far.`
      : `You meet ${met} of ${total} published requirements.`;
  const nextStep =
    verdict === 'meets'
      ? 'Admission also weighs your average and how many people apply, so treat this as a start.'
      : verdict === 'explore'
        ? 'The school has not published every requirement yet. The rest of the check runs once it does.'
        : `${gaps.map((g) => g.course).join(' and ')} ${gaps.length === 1 ? 'is the one' : 'are the ones'} to add to meet all ${total}.`;

  return (
    <ChapterFrame current="programs">
      <a
        href={links.programs}
        target="_top"
        className="target-area inline-flex items-center gap-nudge self-start text-sm font-semibold text-accent-fg no-underline hover:underline"
      >
        <ArrowLeft aria-hidden className="size-4" />
        All programs
      </a>

      <div className="flex max-w-reading flex-col gap-tight">
        <h1 className="m-0 text-2xl sm:text-3xl">{program.name}</h1>
        <p className="m-0 text-md text-fg-secondary">
          {program.institution} · {program.years} years ·{' '}
          <span className="whitespace-nowrap">Apply by {formatDate(program.deadline)}</span>
        </p>
      </div>

      <Card as="section" aria-labelledby={verdictId} className="max-w-reading">
        <div className="flex flex-col items-start gap-snug">
          <VerdictBadge program={program} />
          <h2 id={verdictId} className="m-0 text-xl">
            {headline}
          </h2>
          <p className="m-0 text-md leading-normal text-fg-secondary">{nextStep}</p>
        </div>
        <CardFooter divided>
          <Button variant="primary">Save program</Button>
          <Button variant="tertiary">Update my courses</Button>
        </CardFooter>
      </Card>

      <section aria-labelledby={evidenceId} className="flex max-w-reading flex-col gap-snug">
        <h2 id={evidenceId} className="m-0 text-lg">
          Published requirements
        </h2>
        <Card padding="flush">
          <ul className="m-0 list-none divide-y divide-line-subtle p-0">
            {program.requirements.map((r) => (
              <li key={r.course} className="grid grid-cols-[1fr_auto] items-start gap-x-base gap-y-nudge px-card py-snug">
                <span className="text-md font-semibold">{r.course}</span>
                <Badge variant={statusBadge[r.status].variant} size="sm" className="justify-self-end">
                  {statusBadge[r.status].label}
                </Badge>
                <span className="text-sm text-fg-muted">They ask: {r.asks}</span>
                <span className="text-right text-sm text-fg-secondary tabular-nums">
                  {r.has ? (
                    <>
                      You have <span className="font-semibold text-fg">{r.has}</span>
                    </>
                  ) : r.status === 'gap' ? (
                    'Not in your courses'
                  ) : (
                    'Nothing to check yet'
                  )}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <p className="m-0 text-sm leading-normal text-fg-muted">
          Requirements come from each program&rsquo;s published admission page. Every school, program and grade on this
          screen is sample data.
        </p>
      </section>
    </ChapterFrame>
  );
}
