import { forwardRef, type AnchorHTMLAttributes, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type CardPadding = 'standard' | 'compact' | 'flush';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** `article` for a standalone item, `li` inside a list of cards. */
  as?: 'div' | 'article' | 'section' | 'li';
  /**
   * `standard` uses the card padding token (20px in the base theme).
   * `compact` steps down for dense grids. `flush` lets a divided list run to
   * the card's edges and handle its own insets.
   */
  padding?: CardPadding;
  /** The whole card is one link: put a CardLink inside and the edge responds to hover and focus. */
  interactive?: boolean;
}

const paddings: Record<CardPadding, string> = {
  standard: 'p-card',
  compact: 'p-base',
  flush: 'p-0',
};

/**
 * A raised surface for one thing: a program, a result, a form. Flat at rest;
 * its edge is a visible step in both themes, so it never needs a shadow.
 * Cards never nest.
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = 'div', padding = 'standard', interactive = false, className, children, ...rest },
  ref,
) {
  const Tag = as as ElementType;
  return (
    <Tag
      ref={ref}
      className={cn(
        'flex min-w-0 flex-col gap-base rounded-card border border-line bg-surface-raised text-fg',
        paddings[padding],
        interactive &&
          'relative transition-[border-color] duration-(--ds-duration-fast) ease-out hover:border-line-strong has-[a:focus-visible]:border-line-strong',
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
});

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  /** Supporting line under the title. Darker than metadata, because it matters more. */
  description?: ReactNode;
  /** A badge or a small action, pinned to the top-right corner. */
  action?: ReactNode;
  /** Match the page outline: h2 on a page of cards, h3 inside a section. */
  titleAs?: 'h2' | 'h3' | 'h4';
}

export function CardHeader({ title, description, action, titleAs = 'h3', className, ...rest }: CardHeaderProps) {
  const Title = titleAs;
  return (
    <div className={cn('flex items-start justify-between gap-snug', className)} {...rest}>
      <div className="flex min-w-0 flex-col gap-nudge">
        <Title className="m-0 text-lg">{title}</Title>
        {description ? <p className="m-0 text-sm leading-normal text-fg-secondary">{description}</p> : null}
      </div>
      {action ? <div className="flex shrink-0 items-center">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex min-w-0 flex-col gap-snug text-md leading-normal', className)} {...rest} />;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Draw a hairline above the footer, inset to the card's padding. */
  divided?: boolean;
}

export function CardFooter({ divided = false, className, ...rest }: CardFooterProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-tight', divided && 'border-t border-line-subtle pt-base', className)}
      {...rest}
    />
  );
}

/**
 * The link that makes an interactive card clickable. Its hit area stretches
 * over the whole card, and its focus ring draws around the card.
 */
export const CardLink = forwardRef<HTMLAnchorElement, AnchorHTMLAttributes<HTMLAnchorElement>>(function CardLink(
  { className, ...rest },
  ref,
) {
  return (
    <a
      ref={ref}
      className={cn(
        'font-semibold text-accent-fg underline-offset-4 hover:underline',
        'after:absolute after:inset-0 after:rounded-card after:content-[""]',
        'focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-focus focus-visible:after:outline-solid',
        className,
      )}
      {...rest}
    />
  );
});
