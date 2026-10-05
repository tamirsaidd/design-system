import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Select } from './Select';

const terms = [
  { value: 'fall-2027', label: 'Fall 2027' },
  { value: 'winter-2028', label: 'Winter 2028' },
  { value: 'fall-2028', label: 'Fall 2028' },
  { value: 'later', label: 'Later than that', disabled: true },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  args: {
    label: 'When do you want to start?',
    hint: 'You can change this later.',
    error: '',
    options: terms,
    placeholder: 'Choose a term',
    optional: false,
    required: false,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    options: { control: 'object' },
    placeholder: { control: 'text' },
    optional: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { placeholder: undefined, defaultValue: 'winter-2028' },
};

export const WithError: Story = {
  args: { required: true, error: 'Choose a term so we can check deadlines.' },
};

export const Disabled: Story = {
  args: { disabled: true, placeholder: undefined, defaultValue: 'fall-2027', hint: 'Locked after you apply.' },
};
