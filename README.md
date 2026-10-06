# Design system

A portfolio case study by Tamir Said-Ahmed, Product Design Lead.

I built a token-first React component library and gave it a public home in Storybook. The point of the case study is one sentence: the same components, given different tokens, should carry different products without a line of component code changing. Each chapter rebuilds screens from a product I designed to test exactly that.

**Live Storybook:** https://tamirsaidd.github.io/design-system/

## What is in it

- **Tokens.** One TypeScript file, `src/tokens/tokens.ts`, holds every value. A small build turns it into CSS variables for light and dark, plus the Tailwind names components use. Nothing else defines a colour.
- **14 components.** Button, Input, Textarea, Select, Checkbox, Radio, Switch, FormField, Card, Badge, Avatar, Tabs, Modal and Toast. Each has a Default story, state stories and controls for every prop.
- **Docs.** Design principles, Tokens (every token, following the theme toggle), Accessibility and Usage.
- **Chapters.** Chapter 1 rebuilds three screens and a before/after from an education platform that helps students figure out what to study. Chapters for Tapbook and Youthcentrik come next.

All data in the chapters is sample data. No real person, student or record appears anywhere.

## Run it

Requires Node 20.19 or later and Google Chrome (for the accessibility check).

```bash
npm install
npm run storybook        # http://localhost:6006
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run storybook` | Storybook with hot reload |
| `npm run build-storybook` | Static build into `storybook-static/` |
| `npm run tokens` | Regenerate the token CSS after editing `tokens.ts` |
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint, including the Storybook and React hooks rules |
| `npm run check:tokens` | Fails if the generated token CSS is stale, or a token or chapter override is broken |
| `npm run check:contrast` | Measures every colour pairing the components use, light and dark, in every theme |
| `npm run check:banned` | Public-safety check: no hex codes outside `src/tokens/`, no forbidden words in files, paths or commit messages |
| `npm run check:a11y` | Runs axe on every story of the built Storybook, light and dark (needs a build first) |
| `npm run check` | All of the above, in CI order |

## How it is checked

CI runs on every push: typecheck, lint, token freshness, contrast, the public-safety check, the Storybook build, and axe on every story in both themes. Tabs, Modal and Toast also carry play tests that press the keys and check where focus lands.

## Deploy

The Storybook deploys to **GitHub Pages** at https://tamirsaidd.github.io/design-system/.

- `.github/workflows/pages.yml` runs on every push to `main` (and on demand): `npm ci`, `npm run build-storybook`, then publishes `storybook-static/` with the official Pages actions.
- The repository's Pages source must be set to **GitHub Actions** (Settings, Pages).
- The build uses relative paths, so it works under the `/design-system/` sub-path without extra config.

To deploy somewhere else, upload the contents of `storybook-static/` to any static host.

## Layout

```
.storybook/          Storybook config, theme toggle, docs theme
src/tokens/          tokens.ts, the generated CSS, and chapter themes
src/components/      the 14 components, each with its stories
src/chapters/        composed product screens, one folder per chapter
src/styles/          the stylesheet entry and base element styles
stories/docs/        the docs pages and their blocks
scripts/             token build and every check
DESIGN.md            every design decision and the reason for it
```

## Decisions

Why the tokens are what they are, what is still provisional, and what changed from the original plan: see [DESIGN.md](DESIGN.md).
