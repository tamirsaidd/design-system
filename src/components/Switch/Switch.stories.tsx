import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Switch } from './Switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    label: 'Only show programs I qualify for',
    hint: '',
    defaultChecked: false,
    disabled: false,
    onCheckedChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    defaultChecked: { control: 'boolean' },
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onCheckedChange: { control: false },
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
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  args: {
    label: 'Hide programs past their deadline',
    hint: 'They stay in your saved list.',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-base">
      <Switch {...args} disabled label="Sync with your school account" />
      <Switch {...args} disabled defaultChecked label="Required reminders" />
    </div>
  ),
};
