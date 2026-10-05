/**
 * A chapter theme overrides tokens by their CSS name (without the `--ds-`
 * prefix). The token build fails if a key names a token that does not exist,
 * so a typo can never ship as a silent no-op.
 */
export interface ChapterTheme {
  /** Used as the value of the `data-chapter` attribute. */
  id: string;
  title: string;
  /** Overrides that hold in both themes: type, shape, density. */
  shared: Record<string, string>;
  light: Record<string, string>;
  dark: Record<string, string>;
  /** Values that are not the product's own token, and why. */
  derived: Record<string, string>;
}
