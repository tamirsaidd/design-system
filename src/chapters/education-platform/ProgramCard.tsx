import { ArrowRight } from 'lucide-react';
import { Badge } from '../../components/Badge/Badge';
import { Card, CardLink } from '../../components/Card/Card';
import { formatDate, gapsIn, metIn, verdictOf, type Program } from './data';
import { links } from './links';

const plural = (n: number, one: string, many: string) => (n === 1 ? `1 ${one}` : `${n} ${many}`);

/** The verdict in words. Shared by the card and the result page, so the two never disagree. */
export function VerdictBadge({ program }: { program: Program }) {
  const verdict = verdictOf(program);
  if (verdict === 'meets') return <Badge variant="success">Meets requirements</Badge>;
  if (verdict === 'explore') return <Badge variant="info">Explore</Badge>;
  return <Badge variant="warning">{plural(gapsIn(program).length, 'gap to close', 'gaps to close')}</Badge>;
}

/** One sentence: what the verdict means for this student. */
export function verdictSummary(program: Program) {
  const verdict = verdictOf(program);
  const total = program.requirements.length;
  if (verdict === 'meets') return `All ${total} published requirements are in your courses.`;
  if (verdict === 'explore') return 'Some requirements are not published yet.';
  return `Add ${gapsIn(program)
    .map((g) => g.course)
    .join(' and ')} to meet all ${total}.`;
}

export const metCount = (program: Program) => metIn(program).length;

/** A program in the browse grid: verdict first, then the facts, then one way in. */
export function ProgramCard({ program }: { program: Program }) {
  return (
    <Card as="li" interactive className="gap-snug">
      <div className="flex">
        <VerdictBadge program={program} />
      </div>
      <div className="flex flex-col gap-nudge">
        <h2 className="m-none text-lg">{program.name}</h2>
        <p className="m-none text-sm text-fg-secondary">{program.institution}</p>
      </div>
      <p className="m-none text-md leading-normal">{verdictSummary(program)}</p>
      <dl className="m-none mt-auto grid grid-cols-2 gap-tight border-t border-line-subtle pt-snug">
        <div className="flex flex-col">
          <dt className="text-xs text-fg-muted">Length</dt>
          <dd className="m-none text-sm font-semibold">{program.years} years</dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-xs text-fg-muted">Apply by</dt>
          <dd className="m-none text-sm font-semibold tabular-nums">{formatDate(program.deadline)}</dd>
        </div>
      </dl>
      <CardLink href={links.result(program.id)} target="_top" className="inline-flex items-center gap-nudge self-start text-sm">
        Review requirements
        <ArrowRight aria-hidden className="size-4" />
        <span className="sr-only">for {program.name}</span>
      </CardLink>
    </Card>
  );
}
