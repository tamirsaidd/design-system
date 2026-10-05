import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import { mergeTheme } from '../tokens/tailwind-map';

/**
 * Tailwind-merge only resolves conflicts between utilities it recognises.
 * Our spacing, radius and shadow names are custom, so they are registered
 * here from the same map that generates the theme. Without this, a caller's
 * `p-base` would silently lose to a component's `p-card`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: mergeTheme.spacing,
      radius: mergeTheme.radius,
      shadow: mergeTheme.shadow,
      'font-weight': mergeTheme['font-weight'],
      text: mergeTheme.text,
      leading: mergeTheme.leading,
      tracking: mergeTheme.tracking,
    },
  },
});

/** Join class names, letting later Tailwind utilities override earlier ones. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
