import type { Meta, StoryObj } from '@storybook/react-vite';
import { programs } from './data';
import { EligibilityResult } from './EligibilityResult';

const meta = {
  title: 'Chapters/Education platform/Eligibility result',
  component: EligibilityResult,
  tags: ['!autodocs'],
  args: { programId: 'environmental-engineering' },
  argTypes: {
    programId: { control: 'select', options: programs.map((p) => p.id) },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof EligibilityResult>;

export default meta;
type Story = StoryObj<typeof meta>;

/** One gap to close: the verdict names the course that closes it. */
export const Default: Story = {};

/** Every published requirement met, with the honest caveat. */
export const MeetsRequirements: Story = {
  args: { programId: 'computer-science' },
};

/** Not every requirement is published yet, so the check says how far it got. */
export const Explore: Story = {
  args: { programId: 'urban-planning' },
};
