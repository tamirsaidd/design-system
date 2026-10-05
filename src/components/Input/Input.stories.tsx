import type { Meta, StoryObj } from '@storybook/react-vite';
import { Search } from 'lucide-react';
import { fn } from 'storybook/test';
import { Input } from './Input';

const icons = { none: undefined, search: <Search /> };

const meta = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email address',
    hint: 'We send your saved list here. Nothing else.',
    error: '',
    placeholder: '',
    type: 'email',
    optional: false,
    required: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text', description: 'An example, never the label.' },
    type: { control: 'select', options: ['text', 'email', 'search', 'tel', 'url', 'number', 'password'] },
    optional: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    iconStart: { control: 'select', options: Object.keys(icons), mapping: icons },
    fieldClassName: { control: false },
    onChange: { control: false },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-dialog-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Say what to do next, not what went wrong with the person. */
export const WithError: Story = {
  args: { defaultValue: 'sam@', error: 'Enter an email address like name@example.com.' },
};

export const WithIcon: Story = {
  args: {
    label: 'Search programs',
    hint: undefined,
    type: 'search',
    placeholder: 'Try "nursing" or "Halifax"',
    iconStart: 'search',
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'sam@example.com', hint: 'Change this from your account settings.' },
};
