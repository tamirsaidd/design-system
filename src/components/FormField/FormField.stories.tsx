import type { Meta, StoryObj } from '@storybook/react-vite';
import { cn } from '../../lib/cn';
import { controlClass } from './controlStyles';
import { FormField } from './FormField';

const meta = {
  title: 'Components/FormField',
  component: FormField,
  args: {
    label: 'Display name',
    hint: 'This is how your name shows on shared lists.',
    error: '',
    optional: false,
    required: false,
    disabled: false,
    as: 'div',
    children: (control) => <input className={cn(controlClass, 'h-control-md px-snug')} {...control} />,
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    optional: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    as: { control: 'inline-radio', options: ['div', 'fieldset'] },
    id: { control: 'text' },
    children: { control: false, description: 'A render function that receives the id and aria attributes for the control.' },
  },
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-dialog-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The hint stays; the error joins it underneath and both are read out with the field. */
export const WithError: Story = {
  args: { error: 'Use 2 to 40 characters.' },
};

/** Mark the few optional fields instead of starring every required one. */
export const Optional: Story = {
  args: { label: 'Pronouns', hint: undefined, optional: true },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Your school manages this name.' },
};
