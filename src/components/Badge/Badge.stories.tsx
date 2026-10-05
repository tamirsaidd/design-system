import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarClock, CircleCheck } from 'lucide-react';
import { Badge } from './Badge';

const icons = { none: undefined, check: <CircleCheck />, calendar: <CalendarClock /> };

const meta = {
  title: 'Components/Badge',
  component: Badge,
  args: { children: 'Draft', variant: 'neutral', size: 'md' },
  argTypes: {
    children: { control: 'text' },
    variant: { control: 'inline-radio', options: ['neutral', 'brand', 'success', 'warning', 'danger', 'info'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: 'select', options: Object.keys(icons), mapping: icons },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Each colour has one job, and the words still say it without the colour. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex max-w-dialog flex-wrap gap-tight">
      <Badge {...args} variant="neutral">
        Draft
      </Badge>
      <Badge {...args} variant="brand">
        New
      </Badge>
      <Badge {...args} variant="success">
        Meets requirements
      </Badge>
      <Badge {...args} variant="warning">
        Closes soon
      </Badge>
      <Badge {...args} variant="danger">
        Missing transcript
      </Badge>
      <Badge {...args} variant="info">
        Explore
      </Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-tight">
      <Badge {...args} size="sm">
        Small
      </Badge>
      <Badge {...args} size="md">
        Medium
      </Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: { variant: 'success', children: 'Submitted', icon: 'check' as never },
};
