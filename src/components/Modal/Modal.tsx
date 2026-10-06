import { X } from 'lucide-react';
import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode, type RefObject } from 'react';
import { cn } from '../../lib/cn';

export type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  /** Controlled: the modal shows while this is true. */
  open: boolean;
  /** Called on Esc, on the close button, and on a click outside the panel. */
  onClose: () => void;
  /** Names the dialog for screen readers and sits at the top. */
  title: ReactNode;
  /** One line under the title, also read out when the dialog opens. */
  description?: ReactNode;
  children?: ReactNode;
  /** Actions. Put the safe one first; on phones the order flips so the main action sits on top. */
  footer?: ReactNode;
  /** 24rem for confirmations, 32rem by default, 48rem for long reading. */
  size?: ModalSize;
  /** Clicking the dimmed area closes the modal. Turn off when closing would lose work. */
  closeOnOverlayClick?: boolean;
  /** Where focus lands when the modal opens. Defaults to the first focusable element. */
  initialFocus?: RefObject<HTMLElement | null>;
  /** The close button's accessible name. */
  closeLabel?: string;
  className?: string;
}

const widths: Record<ModalSize, string> = {
  sm: 'max-w-dialog-sm',
  md: 'max-w-dialog',
  lg: 'max-w-reading',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A modal dialog on the native `<dialog>` element. The page behind it is inert,
 * Tab and Shift+Tab wrap inside it, Esc closes it, and focus returns to
 * whatever opened it. Page scroll locks while it is open.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  initialFocus,
  closeLabel = 'Close',
  className,
}: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pressStartedOnOverlay = useRef(false);
  const body = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (!open) {
      if (node.open) node.close();
      return;
    }
    const opener = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    if (!node.open) node.showModal();
    root.style.overflow = 'hidden';
    initialFocus?.current?.focus();
    return () => {
      root.style.overflow = previousOverflow;
      if (node.open) node.close();
      if (opener?.isConnected) opener.focus();
    };
  }, [open, initialFocus]);

  // A body that scrolls must be reachable by keyboard, so it joins the tab
  // order only while its content overflows.
  useEffect(() => {
    const node = body.current;
    if (!open || !node) return;
    const update = () => {
      if (node.scrollHeight > node.clientHeight + 1) node.setAttribute('tabindex', '0');
      else node.removeAttribute('tabindex');
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [open, children]);

  const keepFocusInside = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab' || !dialog.current) return;
    const focusable = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialog}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={() => {
        if (open) onClose();
      }}
      onPointerDown={(event) => {
        pressStartedOnOverlay.current = event.target === dialog.current;
      }}
      onClick={(event) => {
        if (closeOnOverlayClick && pressStartedOnOverlay.current && event.target === dialog.current) onClose();
      }}
      onKeyDown={keepFocusInside}
      className={cn(
        'fixed inset-0 m-none h-dvh max-h-none w-full max-w-none items-center justify-center bg-transparent p-gutter text-fg',
        'open:flex sm:p-loose',
        'backdrop:bg-scrim backdrop:animate-fade-in',
      )}
    >
      <div
        className={cn(
          'flex max-h-full w-full animate-rise-in flex-col overflow-hidden rounded-modal border border-line bg-surface-overlay shadow-elevation-lg',
          widths[size],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-base px-loose pt-loose">
          <div className="flex min-w-0 flex-col gap-nudge">
            <h2 id={titleId} className="m-none text-xl">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="m-none text-sm leading-normal text-fg-secondary">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className={cn(
              'target-area -mr-tight -mt-nudge inline-flex size-control-sm shrink-0 items-center justify-center rounded-control',
              'text-fg-muted transition-[background-color,color] duration-(--ds-duration-fast) hover:bg-surface-muted hover:text-fg',
            )}
          >
            <X aria-hidden className="size-5" />
          </button>
        </div>
        <div
          ref={body}
          className="min-h-0 flex-1 overflow-y-auto px-loose py-base text-md leading-normal focus-visible:-outline-offset-2"
        >
          {children}
        </div>
        {footer ? (
          <div className="flex flex-col-reverse gap-tight border-t border-line-subtle px-loose py-base sm:flex-row sm:justify-end">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
