/**
 * The single source of truth for every visual decision in this system.
 *
 * `npm run tokens` turns this file into two outputs, never edited by hand:
 *   - src/tokens/tokens.css    CSS custom properties, light and dark
 *   - src/tokens/tailwind.css  the Tailwind theme bridge (utility names)
 *
 * Conventions
 * - Every colour carries a light and a dark value.
 * - Ramps keep their role across themes: step 50 is always the step nearest
 *   the canvas and 900 the one furthest from it. So in dark mode the ramps run
 *   the other way, the same convention Radix and Primer use.
 * - Semantic tokens point at ramp steps with `{alias}` references, written the
 *   way the CSS variable is named: `{neutral.50}` becomes `var(--ds-neutral-50)`.
 * - Why each value was chosen lives in DESIGN.md, with the measured contrast.
 */

export interface Themed {
  light: string;
  dark: string;
  /** What the token is for. Shown on the Tokens docs page. */
  note?: string;
}

/** Brand ramp. Step 600 is the accent, taken from the portfolio's solid blue. */
export const brand = {
  50: { light: '#F1F6FF', dark: '#0E192C' },
  100: { light: '#DFEBFF', dark: '#122646' },
  200: { light: '#C1D9FF', dark: '#1A3662' },
  300: { light: '#9ABFFB', dark: '#284C85' },
  400: { light: '#6F9FEC', dark: '#3E6AB3' },
  500: { light: '#487CCF', dark: '#5385D7' },
  600: { light: '#2455A4', dark: '#6F9FEC' },
  700: { light: '#1A4385', dark: '#9ABFFB' },
  800: { light: '#123265', dark: '#C1D9FF' },
  900: { light: '#0A2146', dark: '#E0ECFF' },
} satisfies Record<number, Themed>;

/** Neutral ramp, a hair warm (OKLCH hue 95, chroma at most 0.009). */
export const neutral = {
  50: { light: '#FAFAF9', dark: '#100F0D' },
  100: { light: '#F3F2F0', dark: '#191916' },
  200: { light: '#E6E5E2', dark: '#2C2B28' },
  300: { light: '#D3D2CC', dark: '#474642' },
  400: { light: '#95948E', dark: '#62605B' },
  500: { light: '#7D7C76', dark: '#7D7C76' },
  600: { light: '#62605B', dark: '#95948E' },
  700: { light: '#474642', dark: '#D3D2CC' },
  800: { light: '#2C2B28', dark: '#E6E5E2' },
  900: { light: '#191916', dark: '#F3F2F0' },
  950: { light: '#100F0D', dark: '#FAFAF9' },
} satisfies Record<number, Themed>;

export const color = {
  brand,
  neutral,
  surface: {
    base: { light: '{neutral.50}', dark: '{neutral.50}', note: 'The page canvas.' },
    raised: { light: '#FFFFFF', dark: '{neutral.100}', note: 'Cards and inputs. White in light mode, one step up in dark.' },
    overlay: { light: '#FFFFFF', dark: '{neutral.100}', note: 'Modals, toasts and anything floating above the page.' },
    muted: { light: '{neutral.100}', dark: '{neutral.200}', note: 'Quiet fills: hover backgrounds, wells, disabled fields.' },
    scrim: { light: 'rgb(16 15 13 / 0.48)', dark: 'rgb(8 8 6 / 0.72)', note: 'The dimmed layer behind a modal.' },
  },
  text: {
    primary: { light: '{neutral.900}', dark: '{neutral.900}', note: 'Headings and body copy.' },
    secondary: { light: '{neutral.700}', dark: '{neutral.700}', note: 'Supporting copy that still matters; sits above muted copy.' },
    muted: { light: '{neutral.600}', dark: '{neutral.600}', note: 'Hints, metadata, placeholders. Passes 4.5:1 on every surface.' },
    disabled: { light: '{neutral.400}', dark: '{neutral.400}', note: 'Disabled labels. Exempt from contrast rules, kept near 3:1 anyway.' },
    inverse: { light: '{neutral.50}', dark: '{neutral.50}', note: 'Text on an ink-coloured fill.' },
  },
  border: {
    subtle: { light: '{neutral.200}', dark: '{neutral.200}', note: 'Dividers inside a card. Never a card edge.' },
    default: { light: '{neutral.300}', dark: '{neutral.300}', note: 'Card and panel edges: a visible step in both themes.' },
    strong: { light: '{neutral.500}', dark: '{neutral.500}', note: 'Form control edges: at least 3:1 against every surface.' },
  },
  accent: {
    base: { light: '{brand.600}', dark: '{brand.600}', note: 'The one filled action per screen.' },
    hover: { light: '{brand.700}', dark: '{brand.700}', note: 'Accent fill under the pointer.' },
    pressed: { light: '{brand.800}', dark: '{brand.800}', note: 'Accent fill while pressed.' },
    subtle: { light: '{brand.100}', dark: '{brand.100}', note: 'Selected and brand-tinted backgrounds.' },
    text: { light: '{brand.600}', dark: '{brand.600}', note: 'Links and brand text on any surface.' },
    strong: { light: '{brand.700}', dark: '{brand.700}', note: 'Brand text on the subtle tint (badges, selected items).' },
    on: { light: '#FFFFFF', dark: '{neutral.50}', note: 'Text and icons on an accent fill.' },
  },
  focus: {
    ring: { light: '{brand.600}', dark: '{brand.700}', note: 'The keyboard focus outline.' },
  },
  semantic: {
    success: {
      bg: { light: '#218041', dark: '#5BBD74' },
      subtle: { light: '#E6F8E9', dark: '#142818' },
      text: { light: '#1C5F31', dark: '#92DCA1' },
      border: { light: '#ABD8B3', dark: '#2F5838' },
    },
    warning: {
      bg: { light: '#C07B03', dark: '#F3A949' },
      subtle: { light: '#FFF1E2', dark: '#31210D' },
      text: { light: '#7B4C01', dark: '#FFC581' },
      border: { light: '#F0C595', dark: '#6E4E27' },
    },
    danger: {
      bg: { light: '#C52C2A', dark: '#F27166' },
      subtle: { light: '#FFEEEC', dark: '#381916' },
      text: { light: '#A92321', dark: '#FBA89E' },
      border: { light: '#F3C0B9', dark: '#7D3D37' },
    },
    info: {
      bg: { light: '#047B98', dark: '#5EB1CD' },
      subtle: { light: '#E6F6FB', dark: '#0E2730' },
      text: { light: '#045C72', dark: '#94D2E8' },
      border: { light: '#B2D4E1', dark: '#2E5664' },
    },
  },
} as const;

export const typography = {
  family: {
    /** Headings and display moments. Matches the portfolio. */
    display: "'Outfit Variable', 'Outfit', ui-sans-serif, system-ui, sans-serif",
    /** Body and interface text. */
    sans: "'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif",
    /** Numbers, code and token names. */
    mono: "'JetBrains Mono Variable', 'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
  },
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    '3xl': '2.5rem',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: '1.15',
    normal: '1.5',
    relaxed: '1.65',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0em',
    wide: '0.04em',
  },
} as const;

/** 4pt base. Layout spacing uses multiples of 8; 4, 12 and 20 live inside components. */
export const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  12: '48px',
  16: '64px',
  24: '96px',
  32: '128px',
} as const;

export const radius = {
  none: '0px',
  sm: '4px',
  md: '6px',
  lg: '9px',
  xl: '12px',
  full: '9999px',
} as const;

/** Soft, warm-tinted shadows. Resting cards never use them. */
export const elevation = {
  /** Small lifts: a switch thumb, a pressed segment. */
  sm: {
    light: '0 1px 2px rgb(25 25 22 / 0.06)',
    dark: '0 1px 2px rgb(8 8 6 / 0.4)',
  },
  /** Toasts and popovers. */
  md: {
    light: '0 8px 24px -6px rgb(25 25 22 / 0.12), 0 2px 6px -2px rgb(25 25 22 / 0.06)',
    dark: '0 8px 24px -6px rgb(8 8 6 / 0.5), 0 2px 6px -2px rgb(8 8 6 / 0.32)',
  },
  /** Modals. */
  lg: {
    light: '0 24px 48px -12px rgb(25 25 22 / 0.2), 0 6px 16px -6px rgb(25 25 22 / 0.08)',
    dark: '0 24px 48px -12px rgb(8 8 6 / 0.64), 0 6px 16px -6px rgb(8 8 6 / 0.4)',
  },
} satisfies Record<string, Themed>;

export const motion = {
  duration: {
    /** Hover, press, toggle. */
    fast: '120ms',
    /** Opening and closing things. */
    base: '180ms',
    /** Larger surfaces entering. */
    slow: '240ms',
  },
  easing: {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  },
} as const;

export const size = {
  control: {
    sm: '32px',
    md: '40px',
    lg: '48px',
  },
  /** The smallest tap area any control gets, whatever its drawn size. */
  target: '44px',
} as const;

export const layer = {
  sticky: '10',
  modal: '50',
  toast: '60',
} as const;

export const container = {
  reading: '48rem',
  content: '72rem',
  page: '90rem',
} as const;

/**
 * Component tokens: the third layer. Each points at a primitive or semantic
 * token, so a chapter can change a component's shape without touching code.
 */
export const component = {
  control: {
    radius: '{radius.md}',
    border: '{border.strong}',
    insetSm: '{space.3}',
    insetMd: '{space.5}',
    insetLg: '{space.6}',
  },
  card: {
    radius: '{radius.xl}',
    padding: '{space.5}',
  },
  modal: {
    radius: '{radius.xl}',
  },
  toast: {
    radius: '{radius.lg}',
  },
  badge: {
    radius: '{radius.full}',
  },
  checkbox: {
    radius: '{radius.sm}',
  },
  button: {
    dangerBg: '{danger.bg}',
    dangerBgHover: '{danger.text}',
    dangerOn: '{accent.on}',
  },
  heading: {
    weight: '{font-weight.semibold}',
  },
} as const;

export const tokens = {
  color,
  typography,
  spacing,
  radius,
  elevation,
  motion,
  size,
  layer,
  container,
  component,
} as const;

export type Tokens = typeof tokens;

export { chapters } from './chapters';
