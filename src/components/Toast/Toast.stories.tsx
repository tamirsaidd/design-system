import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Toast, ToastProvider, useToast, type ToastProps } from './Toast';

type ToastStoryArgs = ToastProps & { actionLabel: string };

const meta = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    variant: 'success',
    title: 'Program saved',
    description: 'Find it under Saved programs.',
    actionLabel: '',
    dismissLabel: 'Dismiss',
    onDismiss: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['success', 'error', 'info'] },
    title: { control: 'text' },
    description: { control: 'text' },
    actionLabel: { control: 'text', description: 'Story only: label for the optional action, such as Undo.' },
    dismissLabel: { control: 'text' },
    action: { control: false },
    onDismiss: { control: false },
  },
  parameters: { layout: 'padded' },
  render: ({ actionLabel, ...args }) => (
    <div className="max-w-dialog-sm">
      <Toast {...args} action={actionLabel ? { label: actionLabel, onClick: fn() } : undefined} />
    </div>
  ),
} satisfies Meta<ToastStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Each says what happened. Only the error waits for you to dismiss it. */
export const Variants: Story = {
  render: () => (
    <div className="flex max-w-dialog-sm flex-col gap-tight">
      <Toast variant="success" title="Program saved" description="Find it under Saved programs." onDismiss={fn()} />
      <Toast
        variant="error"
        title="Transcript did not upload"
        description="The file is over 10 MB. Try a smaller scan or a PDF."
        onDismiss={fn()}
      />
      <Toast variant="info" title="Deadlines updated" description="Two programs moved their dates." onDismiss={fn()} />
    </div>
  ),
};

/** One follow-up at most. Undo is the usual one. */
export const WithAction: Story = {
  args: { variant: 'info', title: 'Program removed', description: undefined, actionLabel: 'Undo' },
};

function ToasterDemo() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-tight">
      <Button onClick={() => toast({ variant: 'success', title: 'Program saved', description: 'Find it under Saved programs.' })}>
        Save program
      </Button>
      <Button
        onClick={() =>
          toast({ variant: 'error', title: 'Transcript did not upload', description: 'Try a smaller scan or a PDF.' })
        }
      >
        Upload transcript
      </Button>
      <Button onClick={() => toast({ variant: 'info', title: 'Deadlines updated' })}>Refresh deadlines</Button>
    </div>
  );
}

/**
 * The provider and hook together. Toasts stack at the bottom on phones and
 * bottom right on wider screens; screen readers hear them through a live region.
 */
export const Toaster: Story = {
  parameters: { docs: { story: { inline: false, iframeHeight: 420 } } },
  render: () => (
    <ToastProvider>
      <ToasterDemo />
    </ToastProvider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Save program' }));
    const region = within(document.body).getByRole('region', { name: 'Notifications' });
    await waitFor(() => expect(within(region).getByText('Program saved')).toBeVisible());
    const polite = document.body.querySelector('[aria-live="polite"]');
    await expect(polite).toHaveTextContent('Program saved. Find it under Saved programs.');
  },
};
