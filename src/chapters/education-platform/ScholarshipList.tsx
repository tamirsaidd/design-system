import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useId, useState } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import { Card } from '../../components/Card/Card';
import { Select } from '../../components/Select/Select';
import { Switch } from '../../components/Switch/Switch';
import { useToast } from '../../components/Toast/Toast';
import { ChapterFrame } from './ChapterFrame';
import { formatCad, formatDate, scholarships, type Scholarship } from './data';

export interface ScholarshipListProps {
  /** Start with only the awards the student qualifies for. */
  initialQualifyingOnly?: boolean;
  initialSort?: 'deadline' | 'amount';
}

function ScholarshipRow({ item }: { item: Scholarship }) {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const save = () => {
    setSaved(true);
    toast({ variant: 'success', title: 'Saved to your list', description: item.name });
  };
  return (
    <li className="grid grid-cols-[1fr_auto] items-start gap-x-base gap-y-snug px-card py-base">
      <div className="flex min-w-0 flex-col gap-nudge">
        <h2 className="m-0 font-sans text-md font-semibold tracking-normal">{item.name}</h2>
        <p className="m-0 text-sm text-fg-muted">{item.provider}</p>
      </div>
      <Button
        size="sm"
        variant={saved ? 'tertiary' : 'secondary'}
        iconStart={saved ? <BookmarkCheck /> : <Bookmark />}
        onClick={save}
        disabled={saved}
        aria-label={saved ? `${item.name} saved` : `Save ${item.name}`}
      >
        {saved ? 'Saved' : 'Save'}
      </Button>
      <div className="col-span-2 flex flex-wrap items-baseline gap-x-base gap-y-nudge">
        <p className="m-0 font-mono text-md font-semibold tabular-nums">{formatCad(item.amountCad)}</p>
        <p className="m-0 text-sm text-fg-secondary">Due {formatDate(item.deadline)}</p>
      </div>
      <div className="col-span-2 flex flex-wrap items-center gap-x-tight gap-y-nudge">
        {item.qualifies ? (
          <Badge variant="success" size="sm">
            You qualify
          </Badge>
        ) : (
          <>
            <Badge variant="warning" size="sm">
              1 thing to add
            </Badge>
            <p className="m-0 text-sm text-fg-secondary">{item.toAdd}</p>
          </>
        )}
      </div>
    </li>
  );
}

/** Screen 3: awards in one divided list, soonest deadline first. */
export function ScholarshipList({ initialQualifyingOnly = false, initialSort = 'deadline' }: ScholarshipListProps) {
  const [qualifyingOnly, setQualifyingOnly] = useState(initialQualifyingOnly);
  const [sort, setSort] = useState(initialSort);
  const listLabel = useId();

  const shown = scholarships
    .filter((s) => !qualifyingOnly || s.qualifies)
    .sort((a, b) => (sort === 'amount' ? b.amountCad - a.amountCad : a.deadline.localeCompare(b.deadline)));

  return (
    <ChapterFrame current="scholarships">
      <div className="flex max-w-reading flex-col gap-tight">
        <h1 id={listLabel} className="m-0 text-2xl sm:text-3xl">
          Scholarships to apply for
        </h1>
        <p className="m-0 text-md leading-normal text-fg-secondary">
          Amounts are in Canadian dollars. Every award here is sample data.
        </p>
      </div>
      <div className="flex max-w-reading flex-col gap-base sm:flex-row sm:items-end sm:gap-loose">
        <Select
          label="Sort by"
          value={sort}
          onChange={(event) => setSort(event.target.value as 'deadline' | 'amount')}
          options={[
            { value: 'deadline', label: 'Deadline, soonest first' },
            { value: 'amount', label: 'Amount, largest first' },
          ]}
          fieldClassName="sm:w-72"
        />
        <Switch
          label="Only show ones I qualify for"
          checked={qualifyingOnly}
          onCheckedChange={setQualifyingOnly}
          className="sm:pb-tight"
        />
      </div>
      <Card padding="flush" className="max-w-reading">
        <ul aria-labelledby={listLabel} className="m-0 list-none divide-y divide-line-subtle p-0">
          {shown.map((item) => (
            <ScholarshipRow key={item.id} item={item} />
          ))}
        </ul>
      </Card>
    </ChapterFrame>
  );
}
