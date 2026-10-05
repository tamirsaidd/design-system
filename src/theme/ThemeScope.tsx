import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export interface ThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  /** A chapter theme id, such as `education-platform`. Leave out for the base theme. */
  chapter?: string;
}

/**
 * Applies a chapter's tokens to everything inside it. It also resets text,
 * font and canvas colour, because those were inherited from the page root
 * before the chapter's tokens applied.
 */
export function ThemeScope({ chapter, className, ...rest }: ThemeScopeProps) {
  return (
    <div
      data-chapter={chapter}
      className={cn('bg-surface font-sans text-fg leading-normal', className)}
      {...rest}
    />
  );
}
