import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Tabs, type TabItem } from './Tabs';

const panel = (text: string) => <p className="m-0 max-w-reading text-md leading-normal text-fg-secondary">{text}</p>;

const items: TabItem[] = [
  { id: 'overview', label: 'Overview', content: panel('What the program covers, how long it takes and where it leads.') },
  { id: 'requirements', label: 'Requirements', content: panel('The courses and grades the school publishes for this program.') },
  { id: 'costs', label: 'Costs', content: panel('Tuition and fees for one year, with the year they were published.') },
  { id: 'deadlines', label: 'Deadlines', content: panel('Application and document dates, nearest first.') },
];

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  args: {
    items,
    label: 'Program details',
    defaultValue: 'overview',
    activation: 'automatic',
    onValueChange: fn(),
  },
  argTypes: {
    items: { control: 'object' },
    label: { control: 'text' },
    value: { control: 'text' },
    defaultValue: { control: 'text' },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
    onValueChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Counts read as part of each tab's name, and must match what the panel shows. */
export const WithCounts: Story = {
  args: {
    label: 'Filter programs',
    defaultValue: 'all',
    items: [
      { id: 'all', label: 'All', count: 6, content: panel('Six saved programs.') },
      { id: 'meets', label: 'Meets requirements', count: 3, content: panel('Three programs where you meet every published requirement.') },
      { id: 'gaps', label: 'Gaps to close', count: 2, content: panel('Two programs with one course still to add.') },
      { id: 'explore', label: 'Explore', count: 1, content: panel('One program worth a closer look.') },
    ],
  },
};

/** Arrow keys move focus only; Enter or Space selects. For panels that take time to load. */
export const ManualActivation: Story = {
  args: { activation: 'manual' },
};

export const WithDisabledTab: Story = {
  args: {
    items: items.map((item) => (item.id === 'costs' ? { ...item, disabled: true } : item)),
  },
};

/** Proves the keyboard map: arrows wrap, End jumps to the last tab, and selection follows focus. */
export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByRole('tab', { name: 'Overview' });
    first.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('tab', { name: 'Deadlines' })).toHaveFocus();
    await expect(canvas.getByRole('tab', { name: 'Deadlines' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{Home}');
    await expect(first).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent('nearest first');
  },
};
