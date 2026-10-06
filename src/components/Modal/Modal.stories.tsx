import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Modal, type ModalProps } from './Modal';

type DemoArgs = ModalProps & { body: string };

function ModalDemo({ body, onClose, open: startOpen, ...args }: DemoArgs) {
  const [open, setOpen] = useState(startOpen);
  const keep = useRef<HTMLButtonElement>(null);
  const close = () => {
    setOpen(false);
    onClose();
  };
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Remove from saved
      </Button>
      <Modal
        {...args}
        open={open}
        onClose={close}
        initialFocus={keep}
        footer={
          <>
            <Button ref={keep} onClick={close}>
              Keep it
            </Button>
            <Button variant="danger" onClick={close}>
              Remove program
            </Button>
          </>
        }
      >
        <p className="m-none">{body}</p>
      </Modal>
    </>
  );
}

const meta = {
  title: 'Components/Modal',
  component: Modal,
  args: {
    open: false,
    title: 'Remove this program?',
    description: 'Environmental Engineering, Northfield University',
    body: 'Your notes and checklist for this program go with it. You can save it again any time.',
    size: 'sm',
    closeOnOverlayClick: true,
    closeLabel: 'Close',
    onClose: fn(),
  },
  argTypes: {
    open: { control: 'boolean' },
    title: { control: 'text' },
    description: { control: 'text' },
    body: { control: 'text', description: 'Story only: the modal body.' },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    closeOnOverlayClick: { control: 'boolean' },
    closeLabel: { control: 'text' },
    footer: { control: false },
    initialFocus: { control: false },
    onClose: { control: false },
  },
  parameters: {
    layout: 'centered',
    docs: { story: { inline: false, iframeHeight: 560 } },
  },
  render: (args) => <ModalDemo key={String(args.open)} {...args} />,
} satisfies Meta<DemoArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Press the button to open it. Focus lands on the safe choice. */
export const Default: Story = {};

/** Open on load, for review. */
export const Open: Story = {
  args: { open: true },
};

/** Long content scrolls inside the panel; the title and actions stay put. */
export const LongContent: Story = {
  args: {
    open: true,
    size: 'md',
    title: 'How we read requirements',
    description: 'Why a result says what it says.',
    body: Array.from(
      { length: 8 },
      () =>
        'Each program lists the courses and grades its school publishes. We compare them with the courses you added, one by one, and show the ones that match and the ones still missing. A result is a guide for planning, never an admission decision.',
    ).join(' '),
  },
};

/** Proves the keyboard contract: Tab wraps, Esc closes, focus returns to the opener. */
export const KeyboardContract: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole('button', { name: 'Remove from saved' });
    await userEvent.click(opener);
    const dialog = await within(document.body).findByRole('dialog', { name: 'Remove this program?' });
    const keep = within(dialog).getByRole('button', { name: 'Keep it' });
    await waitFor(() => expect(keep).toHaveFocus());
    await userEvent.tab();
    await expect(within(dialog).getByRole('button', { name: 'Remove program' })).toHaveFocus();
    await userEvent.tab();
    await expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(within(dialog).getByRole('button', { name: 'Remove program' })).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(args.onClose).toHaveBeenCalled());
    await waitFor(() => expect(opener).toHaveFocus());
  },
};
