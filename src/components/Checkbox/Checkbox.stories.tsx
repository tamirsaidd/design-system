import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    label: 'Email me when a deadline changes',
    hint: '',
    error: '',
    defaultChecked: false,
    indeterminate: false,
    disabled: false,
    required: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
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
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true, hint: 'At most one email a week.' },
};

/** For a box that selects a group: some, not all, are chosen. */
export const Indeterminate: Story = {
  args: { label: 'Select all saved programs', indeterminate: true },
};

/** Consent that blocks the next step says how to continue. */
export const WithError: Story = {
  args: {
    label: 'I understand these results are a guide, not an admission decision',
    required: true,
    error: 'Tick this box to see your results.',
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-snug">
      <Checkbox {...args} disabled label="Not available for this program" />
      <Checkbox {...args} disabled defaultChecked label="Required by your school" />
    </div>
  ),
};
