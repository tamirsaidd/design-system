import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { RadioGroup } from './Radio';

const studyOptions = [
  { value: 'full-time', label: 'Full time', hint: 'Four or more courses a term.' },
  { value: 'part-time', label: 'Part time', hint: 'One to three courses a term.' },
  { value: 'unsure', label: 'Not sure yet' },
];

const meta = {
  title: 'Components/Radio',
  component: RadioGroup,
  args: {
    label: 'How do you want to study?',
    hint: '',
    error: '',
    options: studyOptions,
    defaultValue: 'full-time',
    orientation: 'vertical',
    optional: false,
    required: false,
    disabled: false,
    onValueChange: fn(),
  },
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    options: { control: 'object' },
    defaultValue: { control: 'text' },
    value: { control: 'text' },
    name: { control: 'text' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    optional: { control: 'boolean' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onValueChange: { control: false },
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Short options fit on one line and wrap on a phone. */
export const Horizontal: Story = {
  args: {
    label: 'Where would you live?',
    orientation: 'horizontal',
    defaultValue: 'home',
    options: [
      { value: 'home', label: 'At home' },
      { value: 'residence', label: 'In residence' },
      { value: 'off-campus', label: 'Off campus' },
    ],
  },
};

export const WithError: Story = {
  args: { defaultValue: undefined, required: true, error: 'Choose one so we can match course loads.' },
};

export const Disabled: Story = {
  args: { disabled: true, hint: 'Set by your school for this program.' },
};
