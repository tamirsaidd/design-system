import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card, CardBody, CardFooter, CardHeader, CardLink, type CardProps } from './Card';

type CardStoryArgs = CardProps & {
  heading: string;
  summary: string;
  body: string;
};

const meta = {
  title: 'Components/Card',
  component: Card,
  args: {
    as: 'article',
    padding: 'standard',
    interactive: false,
    heading: 'Saved programs',
    summary: 'The programs you are comparing this term.',
    body: 'Two of them have deadlines in the next 30 days. Nothing is due this week.',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['div', 'article', 'section', 'li'] },
    padding: { control: 'inline-radio', options: ['standard', 'compact', 'flush'] },
    interactive: { control: 'boolean' },
    heading: { control: 'text', description: 'Story only: CardHeader `title`.' },
    summary: { control: 'text', description: 'Story only: CardHeader `description`.' },
    body: { control: 'text', description: 'Story only: CardBody content.' },
  },
  parameters: { layout: 'padded' },
  render: ({ heading, summary, body, ...args }) => (
    <Card {...args} className="max-w-dialog">
      <CardHeader title={heading} description={summary} />
      <CardBody>
        <p className="m-none">{body}</p>
      </CardBody>
      <CardFooter>
        <Button>Review deadlines</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<CardStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** A badge in the header slot carries the one status that matters. */
export const WithStatus: Story = {
  render: ({ heading: _heading, summary: _summary, body, ...args }) => (
    <Card {...args} className="max-w-dialog">
      <CardHeader
        title="Application checklist"
        description="Northfield University, Environmental Engineering"
        action={<Badge variant="warning">2 left</Badge>}
      />
      <CardBody>
        <p className="m-none">{body}</p>
      </CardBody>
      <CardFooter divided>
        <Button variant="primary">Finish checklist</Button>
        <Button variant="tertiary">Remind me later</Button>
      </CardFooter>
    </Card>
  ),
  args: { body: 'Upload your transcript and add one reference. Everything else is done.' },
};

/** The whole card is one link. Hover darkens the edge; focus rings the card. */
export const Interactive: Story = {
  args: { interactive: true },
  render: ({ heading, summary, body, ...args }) => (
    <Card {...args} className="max-w-dialog-sm">
      <CardHeader title={heading} description={summary} />
      <CardBody>
        <p className="m-none text-fg-secondary">{body}</p>
      </CardBody>
      <CardLink href="#saved-programs">Open saved programs</CardLink>
    </Card>
  ),
};

/** Compact padding for dense grids; flush for a divided list that runs edge to edge. */
export const PaddingOptions: Story = {
  render: ({ heading: _heading, summary: _summary, body: _body, ...args }) => (
    <div className="grid max-w-content items-start gap-base sm:grid-cols-2">
      <Card {...args} padding="compact">
        <CardHeader title="Compact" description="16px padding in the base theme." />
      </Card>
      <Card {...args} padding="flush">
        <ul className="m-none list-none divide-y divide-line-subtle p-none">
          {['Grade 12 English', 'Grade 12 Calculus', 'Grade 12 Chemistry'].map((course) => (
            <li key={course} className="px-card py-snug">
              {course}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  ),
};
