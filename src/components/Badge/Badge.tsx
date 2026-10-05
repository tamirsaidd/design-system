import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeVariant = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * The status colours carry meaning, so the words must too: a badge reads
   * correctly in greyscale. `brand` marks something as yours or new, not a status.
   */
  variant?: BadgeVariant;
  size?: BadgeSize;
  /** A small leading icon. Decorative; the text names the status. */
  icon?: ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  neutral: 'bg-surface-muted text-fg-secondary',
  brand: 'bg-accent-subtle text-accent-strong',
  success: 'bg-success-subtle text-success-fg',
  warning: 'bg-warning-subtle text-warning-fg',
  danger: 'bg-danger-subtle text-danger-fg',
  info: 'bg-info-subtle text-info-fg',
};

const sizes: Record<BadgeSize, string> = {
  sm: 'h-5 text-xs',
  md: 'h-6 text-sm',
};

/** A short, fixed label for status or category. One word plus a number, at most. */
export function Badge({ variant = 'neutral', size = 'md', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-nudge rounded-badge px-tight font-semibold leading-tight whitespace-nowrap',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {icon ? (
        <span aria-hidden className="inline-flex shrink-0 [&>svg]:size-3.5">
          {icon}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
    </span>
  );
}
