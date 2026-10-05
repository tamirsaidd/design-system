import { LoaderCircle } from 'lucide-react';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * `primary` is the one filled action on a screen. `secondary` is the safe
   * default for everything else, `tertiary` for low-emphasis actions, and
   * `danger` only for actions that destroy something.
   */
  variant?: ButtonVariant;
  /** Height comes from the control size tokens: 32, 40 and 48 in the base theme. */
  size?: ButtonSize;
  /** Shows a spinner, keeps the button's width and blocks repeat presses. */
  loading?: boolean;
  /** An icon before the label. Decorative: the label names the action. */
  iconStart?: ReactNode;
  /** An icon after the label, such as an arrow for "go forward". */
  iconEnd?: ReactNode;
  /** Stretch to the width of the container. */
  fullWidth?: boolean;
}

const base = cn(
  'group/button relative inline-flex shrink-0 select-none items-center justify-center gap-tight',
  'rounded-control border font-sans font-semibold leading-tight whitespace-nowrap',
  'transition-[background-color,border-color,color,transform] duration-(--ds-duration-fast) ease-out',
  'motion-safe:active:scale-[0.98]',
  'disabled:cursor-not-allowed aria-disabled:cursor-not-allowed',
);

const variants: Record<ButtonVariant, string> = {
  primary: cn(
    'border-transparent bg-accent text-on-accent',
    'hover:bg-accent-hover active:bg-accent-pressed',
  ),
  secondary: cn(
    'border-line bg-surface-raised text-fg',
    'hover:border-line-strong hover:bg-surface-muted',
  ),
  tertiary: cn('border-transparent bg-transparent text-accent-fg', 'hover:bg-accent-subtle hover:text-accent-strong'),
  danger: cn('border-transparent bg-danger-action text-on-danger', 'hover:bg-danger-action-hover'),
};

const disabledLook = cn(
  'disabled:border-transparent disabled:bg-surface-muted disabled:text-fg-disabled',
  'disabled:hover:bg-surface-muted disabled:active:scale-100',
);

const sizes: Record<ButtonSize, string> = {
  sm: 'target-area h-control-sm px-inset-sm text-sm',
  md: 'target-area h-control-md px-inset-md text-sm',
  lg: 'h-control-lg px-inset-lg text-md',
};

const iconSize: Record<ButtonSize, string> = { sm: 'size-4', md: 'size-4', lg: 'size-5' };

/**
 * The action primitive. Secondary by default, because a screen gets one
 * primary. States: default, hover, pressed, focus-visible, disabled, loading.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    iconStart,
    iconEnd,
    fullWidth = false,
    disabled,
    type = 'button',
    className,
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const icon = (node: ReactNode) =>
    node ? (
      <span aria-hidden className={cn('inline-flex shrink-0 [&>svg]:size-full', iconSize[size])}>
        {node}
      </span>
    ) : null;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={loading ? (event) => event.preventDefault() : onClick}
      className={cn(base, variants[variant], disabledLook, sizes[size], fullWidth && 'w-full', className)}
      {...rest}
    >
      <span className={cn('inline-flex items-center gap-tight', loading && 'opacity-0')}>
        {icon(iconStart)}
        {children}
        {icon(iconEnd)}
      </span>
      {loading ? (
        <span aria-hidden className="absolute inset-0 flex items-center justify-center">
          <LoaderCircle className={cn('motion-safe:animate-spin', iconSize[size])} />
        </span>
      ) : null}
    </button>
  );
});
