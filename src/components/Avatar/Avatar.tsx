import { useState, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  /** The person's name. Used for the initials and as the accessible name. */
  name: string;
  /** A photo. If it fails to load, the initials take over. */
  src?: string;
  /** 32, 40 or 48 pixels. */
  size?: AvatarSize;
  /** Hide it from screen readers when the name is already written next to it. */
  decorative?: boolean;
}

const sizes: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-md',
};

/** First letter of the first and last words: "Maya K. Okafor" becomes "MO". */
export function initialsOf(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return '?';
  const first = words[0][0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1][0] ?? '') : '';
  return (first + last).toUpperCase();
}

/** A person, as a photo or their initials. Neutral on purpose: the accent stays for actions. */
export function Avatar({ name, src, size = 'md', decorative = false, className, ...rest }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = Boolean(src) && failedSrc !== src;
  const a11y = decorative ? { 'aria-hidden': true as const } : { role: 'img', 'aria-label': name };

  return (
    <span
      className={cn(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full',
        'border border-line bg-surface-muted font-sans font-semibold leading-none text-fg-secondary',
        sizes[size],
        className,
      )}
      {...a11y}
      {...rest}
    >
      {showImage ? (
        <img src={src} alt="" className="size-full object-cover" onError={() => setFailedSrc(src)} />
      ) : (
        initialsOf(name)
      )}
    </span>
  );
}
