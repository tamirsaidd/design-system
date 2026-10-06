# STATE

Public portfolio case study: a token-first React component library with Storybook as its home. Live at https://tamirsaidd.github.io/design-system/ once main deploys.

## Wired
- Tokens: one source (src/tokens/tokens.ts) emitted to CSS variables and Tailwind names, light and dark; chapter themes in src/tokens/chapters.
- 14 components with stories, controls and state stories; play tests for Tabs, Modal and Toast.
- Docs: Design principles, Tokens, Accessibility, Usage.
- Chapter 1 (education platform): three screens and a before/after, sample data only.
- Checks: typecheck, lint, token freshness, contrast, public safety, Storybook build, axe on every story in both themes. `npm run check` runs them all; CI runs them on every push.
- Deploy: GitHub Pages workflow on push to main.

## Pending Tamir
- The base accent (the portfolio's solid blue) and the warm neutral temperature are provisional.
- Chapters 2 (Tapbook) and 3 (Youthcentrik) need his source material.

## Next
- Chapter 2, then chapter 3, then the case-study write-up and the Youthcentrik outline.
