import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToastProvider } from '../../components/Toast/Toast';
import { ScholarshipList } from './ScholarshipList';

const meta = {
  title: 'Chapters/Education platform/Scholarship list',
  component: ScholarshipList,
  tags: ['!autodocs'],
  args: { initialQualifyingOnly: false, initialSort: 'deadline' },
  argTypes: {
    initialQualifyingOnly: { control: 'boolean' },
    initialSort: { control: 'inline-radio', options: ['deadline', 'amount'] },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ScholarshipList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Soonest deadline first. Saving one confirms with a toast. */
export const Default: Story = {};

/** Only the awards the sample student already qualifies for. */
export const QualifyingOnly: Story = {
  args: { initialQualifyingOnly: true },
};

export const LargestFirst: Story = {
  args: { initialSort: 'amount' },
};
