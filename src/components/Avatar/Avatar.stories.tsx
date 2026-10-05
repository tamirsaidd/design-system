import type { Meta, StoryObj } from '@storybook/react-vite';
import { resolve } from '../../tokens/flatten';
import { Avatar } from './Avatar';

/** An abstract placeholder portrait drawn from the brand ramp, so no real person appears. */
const placeholderPortrait = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" fill="${resolve('brand-100', 'light')}"/><circle cx="24" cy="19" r="8" fill="${resolve('brand-500', 'light')}"/><rect x="9" y="31" width="30" height="22" rx="15" fill="${resolve('brand-500', 'light')}"/></svg>`,
)}`;

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  args: { name: 'Maya Okafor', size: 'md', decorative: false, src: '' },
  argTypes: {
    name: { control: 'text' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    src: { control: 'text' },
    decorative: { control: 'boolean' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-snug">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const WithImage: Story = {
  args: { src: placeholderPortrait, size: 'lg' },
};

/** Next to a written name, the avatar is decoration and stays out of the screen reader's way. */
export const BesideAName: Story = {
  args: { decorative: true },
  render: (args) => (
    <div className="flex items-center gap-snug">
      <Avatar {...args} />
      <div className="flex flex-col">
        <span className="text-md font-semibold text-fg">{args.name}</span>
        <span className="text-sm text-fg-muted">Grade 12, planning for fall 2027</span>
      </div>
    </div>
  ),
};
