import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Plus } from 'lucide-react';
import { fn } from 'storybook/test';
import { Button } from './Button';

const icons = { none: undefined, plus: <Plus />, arrow: <ArrowRight /> };

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Save changes',
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    fullWidth: false,
    onClick: fn(),
  },
  argTypes: {
    children: { control: 'text', description: 'The label. Say what happens: "Save changes", not "Submit".' },
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'tertiary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconStart: { control: 'select', options: Object.keys(icons), mapping: icons },
    iconEnd: { control: 'select', options: Object.keys(icons), mapping: icons },
    type: { control: 'inline-radio', options: ['button', 'submit', 'reset'] },
    onClick: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** One filled button per screen. Everything else steps down. */
export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-snug">
      <Button {...args} variant="primary">
        Save changes
      </Button>
      <Button {...args} variant="secondary">
        Preview
      </Button>
      <Button {...args} variant="tertiary">
        Discard draft
      </Button>
      <Button {...args} variant="danger">
        Delete program
      </Button>
    </div>
  ),
};

/** Heights come from the control tokens. Small and medium still get a 44px tap area. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-snug">
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg" iconEnd={<ArrowRight />}>
        Large
      </Button>
    </div>
  ),
};

/** The label stays in place, invisible, so the button never changes width. */
export const Loading: Story = {
  args: { loading: true, children: 'Saving changes' },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-snug">
      <Button {...args} variant="primary" disabled>
        Save changes
      </Button>
      <Button {...args} variant="secondary" disabled>
        Preview
      </Button>
      <Button {...args} variant="tertiary" disabled>
        Discard draft
      </Button>
    </div>
  ),
};
