import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgramBrowse } from './ProgramBrowse';

const meta = {
  title: 'Chapters/Education platform/Program browse',
  component: ProgramBrowse,
  tags: ['!autodocs'],
  args: { initialQuery: '', initialFilter: 'all' },
  argTypes: {
    initialQuery: { control: 'text' },
    initialFilter: { control: 'inline-radio', options: ['all', 'meets', 'gaps', 'explore'] },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ProgramBrowse>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Six sample programs. The tab counts come from the same list the cards do. */
export const Default: Story = {};

/** The two programs with a course still to add. */
export const GapsToClose: Story = {
  args: { initialFilter: 'gaps' },
};

/** A search with nothing to show says why, and offers the way back. */
export const NoResults: Story = {
  args: { initialQuery: 'dentistry' },
};
