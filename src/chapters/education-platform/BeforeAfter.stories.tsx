import type { Meta, StoryObj } from '@storybook/react-vite';
import { BeforeAfter } from './BeforeAfter';

const meta = {
  title: 'Chapters/Education platform/Before and after',
  component: BeforeAfter,
  tags: ['!autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof BeforeAfter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The before is a placeholder reconstruction, labelled as one. Never a real screen or real data. */
export const Default: Story = {};
