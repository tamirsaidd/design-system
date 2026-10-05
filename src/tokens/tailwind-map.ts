/**
 * The utility names components are allowed to use, and the token behind each.
 * `npm run tokens` writes these into src/tokens/tailwind.css as an
 * `@theme inline` block, after clearing Tailwind's default palette, type scale,
 * radii and shadows. So `bg-blue-500` does not exist here; `bg-accent` does.
 *
 * Keys are Tailwind theme variables without the leading `--`. Values are token
 * names without the `--ds-` prefix.
 */
export const tailwindMap = {
  color: {
    surface: 'surface-base',
    'surface-raised': 'surface-raised',
    'surface-overlay': 'surface-overlay',
    'surface-muted': 'surface-muted',
    scrim: 'surface-scrim',
    fg: 'text-primary',
    'fg-secondary': 'text-secondary',
    'fg-muted': 'text-muted',
    'fg-disabled': 'text-disabled',
    'fg-inverse': 'text-inverse',
    'line-subtle': 'border-subtle',
    line: 'border-default',
    'line-strong': 'border-strong',
    'line-control': 'control-border',
    accent: 'accent-base',
    'accent-hover': 'accent-hover',
    'accent-pressed': 'accent-pressed',
    'accent-subtle': 'accent-subtle',
    'accent-fg': 'accent-text',
    'accent-strong': 'accent-strong',
    'on-accent': 'accent-on',
    focus: 'focus-ring',
    success: 'success-bg',
    'success-subtle': 'success-subtle',
    'success-fg': 'success-text',
    'success-line': 'success-border',
    warning: 'warning-bg',
    'warning-subtle': 'warning-subtle',
    'warning-fg': 'warning-text',
    'warning-line': 'warning-border',
    danger: 'danger-bg',
    'danger-subtle': 'danger-subtle',
    'danger-fg': 'danger-text',
    'danger-line': 'danger-border',
    info: 'info-bg',
    'info-subtle': 'info-subtle',
    'info-fg': 'info-text',
    'info-line': 'info-border',
    'danger-action': 'button-danger-bg',
    'danger-action-hover': 'button-danger-bg-hover',
    'on-danger': 'button-danger-on',
  },
  font: {
    display: 'font-display',
    sans: 'font-sans',
    mono: 'font-mono',
  },
  text: {
    xs: 'font-size-xs',
    sm: 'font-size-sm',
    md: 'font-size-md',
    lg: 'font-size-lg',
    xl: 'font-size-xl',
    '2xl': 'font-size-2xl',
    '3xl': 'font-size-3xl',
  },
  'font-weight': {
    regular: 'font-weight-regular',
    medium: 'font-weight-medium',
    semibold: 'font-weight-semibold',
    bold: 'font-weight-bold',
    heading: 'heading-weight',
  },
  leading: {
    tight: 'line-height-tight',
    normal: 'line-height-normal',
    relaxed: 'line-height-relaxed',
  },
  tracking: {
    tight: 'letter-spacing-tight',
    normal: 'letter-spacing-normal',
    wide: 'letter-spacing-wide',
  },
  radius: {
    none: 'radius-none',
    sm: 'radius-sm',
    md: 'radius-md',
    lg: 'radius-lg',
    xl: 'radius-xl',
    full: 'radius-full',
    control: 'control-radius',
    card: 'card-radius',
    modal: 'modal-radius',
    toast: 'toast-radius',
    badge: 'badge-radius',
    checkbox: 'checkbox-radius',
  },
  shadow: {
    'elevation-sm': 'elevation-sm',
    'elevation-md': 'elevation-md',
    'elevation-lg': 'elevation-lg',
  },
  /**
   * Spacing by role, never by number: `p-card`, `gap-tight`, `px-gutter`.
   * Layout gaps are multiples of 8; nudge (4), snug (12) and card (20) stay
   * inside components.
   */
  spacing: {
    nudge: 'space-1',
    tight: 'space-2',
    snug: 'space-3',
    base: 'space-4',
    card: 'card-padding',
    loose: 'space-6',
    section: 'space-8',
    block: 'space-12',
    region: 'space-16',
    gutter: 'space-4',
    'gutter-wide': 'space-6',
    'inset-sm': 'control-inset-sm',
    'inset-md': 'control-inset-md',
    'inset-lg': 'control-inset-lg',
    'control-sm': 'control-sm',
    'control-md': 'control-md',
    'control-lg': 'control-lg',
    target: 'target-min',
  },
  container: {
    'dialog-sm': 'container-dialog-sm',
    dialog: 'container-dialog',
    reading: 'container-reading',
    content: 'container-content',
    page: 'container-page',
  },
  ease: {
    out: 'ease-out',
    'in-out': 'ease-in-out',
  },
} as const;

/** Names tailwind-merge must know, so a `className` override always wins. */
export const mergeTheme = {
  spacing: Object.keys(tailwindMap.spacing),
  radius: Object.keys(tailwindMap.radius),
  shadow: Object.keys(tailwindMap.shadow),
  'font-weight': Object.keys(tailwindMap['font-weight']),
  text: Object.keys(tailwindMap.text),
  leading: Object.keys(tailwindMap.leading),
  tracking: Object.keys(tailwindMap.tracking),
};
