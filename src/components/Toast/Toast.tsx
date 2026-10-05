import { CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';
import { Button } from '../Button/Button';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastProps {
  /** Success and info quietly confirm. Error stays until dismissed. */
  variant?: ToastVariant;
  /** What happened, in a few words: "Program saved". */
  title: string;
  /** Where to find it, or what to do next. */
  description?: string;
  /** One small follow-up, usually Undo. */
  action?: ToastAction;
  /** Shows the dismiss button when provided. */
  onDismiss?: () => void;
  /** The dismiss button's accessible name. */
  dismissLabel?: string;
  className?: string;
}

const icons = { success: CircleCheck, error: CircleAlert, info: Info };
const iconColour = { success: 'text-success', error: 'text-danger', info: 'text-info' };

/** A single notification. Rendered by the ToastProvider, or on its own for docs. */
export function Toast({ variant = 'info', title, description, action, onDismiss, dismissLabel = 'Dismiss', className }: ToastProps) {
  const Icon = icons[variant];
  return (
    <div
      className={cn(
        'pointer-events-auto flex w-full items-start gap-snug rounded-toast border border-line bg-surface-overlay p-base text-fg shadow-elevation-md',
        className,
      )}
    >
      <span aria-hidden className="flex h-lh shrink-0 items-center text-sm leading-normal">
        <Icon className={cn('size-5', iconColour[variant])} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-nudge">
        <p className="m-0 text-sm font-semibold leading-normal">{title}</p>
        {description ? <p className="m-0 text-sm leading-normal text-fg-secondary">{description}</p> : null}
        {action ? (
          <div className="-ml-inset-sm">
            <Button size="sm" variant="tertiary" onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        ) : null}
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={dismissLabel}
          className={cn(
            'target-area -mr-nudge -mt-nudge inline-flex size-8 shrink-0 items-center justify-center rounded-control',
            'text-fg-muted transition-[background-color,color] duration-(--ds-duration-fast) hover:bg-surface-muted hover:text-fg',
          )}
        >
          <X aria-hidden className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export interface ToastOptions extends Omit<ToastProps, 'onDismiss' | 'className'> {
  /** Milliseconds before it leaves. Defaults to 5000, and to never for errors. */
  duration?: number;
}

interface ToastRecord extends ToastOptions {
  id: number;
}

interface ToastApi {
  /** Show a toast. Returns its id. */
  toast: (options: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/** Show and dismiss toasts from anywhere under a ToastProvider. */
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside a ToastProvider.');
  return api;
}

function ToastItem({ record, onDismiss }: { record: ToastRecord; onDismiss: (id: number) => void }) {
  const duration = record.duration ?? (record.variant === 'error' ? Infinity : 5000);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(duration);

  useEffect(() => {
    if (paused || !Number.isFinite(remaining.current)) return;
    const startedAt = Date.now();
    const timer = window.setTimeout(() => onDismiss(record.id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current -= Date.now() - startedAt;
    };
  }, [paused, onDismiss, record.id]);

  return (
    <li
      className="animate-slide-in"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Toast {...record} onDismiss={() => onDismiss(record.id)} />
    </li>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** The most toasts on screen at once. Older ones leave first. */
  max?: number;
  /** Names the notification area for screen readers. */
  label?: string;
}

/**
 * Holds the toast stack: bottom of the screen on phones, bottom right on
 * wider screens, clear of the safe area. Toasts pause while pointed at or
 * focused. Screen readers hear each one through a live region: politely for
 * success and info, straight away for errors.
 */
export function ToastProvider({ children, max = 3, label = 'Notifications' }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const [announcement, setAnnouncement] = useState({ text: '', urgent: false, n: 0 });
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = nextId.current++;
      setToasts((current) => [...current, { ...options, id }].slice(-max));
      setAnnouncement((a) => ({
        text: [options.title, options.description].filter(Boolean).join('. '),
        urgent: options.variant === 'error',
        n: a.n + 1,
      }));
      return id;
    },
    [max],
  );

  const api = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <section
        aria-label={label}
        className={cn(
          'pointer-events-none fixed inset-x-gutter bottom-[max(var(--ds-space-4),env(safe-area-inset-bottom))] z-(--ds-layer-toast)',
          'sm:left-auto sm:right-gutter-wide sm:bottom-gutter-wide sm:w-full sm:max-w-dialog-sm',
        )}
      >
        <ol className="m-0 flex list-none flex-col gap-tight p-0">
          {toasts.map((record) => (
            <ToastItem key={record.id} record={record} onDismiss={dismiss} />
          ))}
        </ol>
      </section>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {!announcement.urgent && announcement.text ? <p key={announcement.n}>{announcement.text}</p> : null}
      </div>
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {announcement.urgent ? <p key={announcement.n}>{announcement.text}</p> : null}
      </div>
    </ToastContext.Provider>
  );
}
