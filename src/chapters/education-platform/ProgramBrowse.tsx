import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Input } from '../../components/Input/Input';
import { Tabs } from '../../components/Tabs/Tabs';
import { ChapterFrame } from './ChapterFrame';
import { programs, verdictOf, type Program, type Verdict } from './data';
import { ProgramCard } from './ProgramCard';

export interface ProgramBrowseProps {
  /** Starting search text. */
  initialQuery?: string;
  /** Starting filter tab. */
  initialFilter?: 'all' | Verdict;
}

const matches = (program: Program, query: string) => {
  const q = query.trim().toLowerCase();
  return !q || `${program.name} ${program.institution}`.toLowerCase().includes(q);
};

/** Screen 1: every saved program as a card, filtered by verdict and search. */
export function ProgramBrowse({ initialQuery = '', initialFilter = 'all' }: ProgramBrowseProps) {
  const [query, setQuery] = useState(initialQuery);
  const found = programs.filter((p) => matches(p, query));
  const byVerdict = (v: Verdict) => found.filter((p) => verdictOf(p) === v);

  const grid = (list: Program[]) =>
    list.length ? (
      <ul className="m-0 grid list-none gap-base p-0 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((program) => (
          <ProgramCard key={program.id} program={program} />
        ))}
      </ul>
    ) : (
      <div className="flex flex-col items-start gap-snug rounded-card border border-dashed border-line-strong p-card">
        <p className="m-0 text-md font-semibold">No programs match &ldquo;{query}&rdquo;.</p>
        <p className="m-0 text-md text-fg-secondary">Try a broader word, such as a subject instead of a school.</p>
        <Button size="sm" onClick={() => setQuery('')}>
          Clear search
        </Button>
      </div>
    );

  return (
    <ChapterFrame current="programs">
      <div className="flex max-w-reading flex-col gap-tight">
        <h1 className="m-0 text-2xl sm:text-3xl">Programs to compare</h1>
        <p className="m-0 text-md leading-normal text-fg-secondary">
          Each one is checked against the courses and grades in your profile. A guide for planning, not an admission
          decision.
        </p>
      </div>
      <div className="flex flex-col gap-loose">
        <Input
          label="Search programs"
          type="search"
          iconStart={<Search />}
          placeholder="Try &ldquo;nursing&rdquo;"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          fieldClassName="max-w-dialog"
        />
        <Tabs
          label="Filter programs"
          defaultValue={initialFilter}
          items={[
            { id: 'all', label: 'All', count: found.length, content: grid(found) },
            { id: 'meets', label: 'Meets requirements', count: byVerdict('meets').length, content: grid(byVerdict('meets')) },
            { id: 'gaps', label: 'Gaps to close', count: byVerdict('gaps').length, content: grid(byVerdict('gaps')) },
            { id: 'explore', label: 'Explore', count: byVerdict('explore').length, content: grid(byVerdict('explore')) },
          ]}
        />
      </div>
    </ChapterFrame>
  );
}
