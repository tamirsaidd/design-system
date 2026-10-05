import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    label: 'Anything we should know?',
    hint: 'For example, a course you are taking next term.',
    error: '',
    rows: 4,
    optional: true,
    disabled: false,
    onChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    rows: { control: { type: 'number', min: 2, max: 12 } },
    maxLength: { control: { type: 'number', min: 10, max: 2000 } },
    optional: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    fieldClassName: { control: false },
    onChange: { control: false },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-dialog">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** With a limit, the count is always on screen, so it is never a surprise. */
export const WithCharacterCount: Story = {
  args: {
    maxLength: 280,
    defaultValue: 'Taking Grade 12 Chemistry in the spring, so that requirement should be covered by June.',
  },
};

export const WithError: Story = {
  args: { optional: false, required: true, error: 'Add a sentence or two so an advisor has context.' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Submitted on October 2.' },
};
