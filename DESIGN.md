# DESIGN

The decisions behind this system and the reason for each. Values live in one place, `src/tokens/tokens.ts`, and render on the Tokens page; this file names tokens and gives measured ratios, never raw values, so it cannot drift from what ships.

## Intent

### Read

Reading this as a personal design-system case study: a public Storybook that hiring managers, design leads and engineers open from Tamir's portfolio to judge whether the system is real, consistent and accessible. Modeled after a well-kept open-source component library's docs, in a calm product register.

### The product in one sentence

A token-first React component library whose Storybook shows the same 14 components carrying different products by changing tokens alone.

### Surfaces and their one job

| Surface | Who arrives, from where | Its one job | The next action it must make obvious |
|---|---|---|---|
| Docs: Design principles | A reviewer following the portfolio link | Say what the system believes, in six lines, with how each is enforced | Open the Tokens page or a component |
| Docs: Tokens | Designers and engineers checking the foundations | Show every token in both themes, read from the source | Flip the theme toggle; open a component |
| Docs: Accessibility | Reviewers checking the floor | State the targets and the check that enforces each | Open a component's keyboard story |
| Docs: Usage | Engineers | Show running it, theming, chapter themes and how to propose a component | Run it locally |
| Component stories | Anyone inspecting a part | Show each state, with controls for every prop | Change a control |
| Chapter screens | Reviewers judging range | Prove the same components carry a different product | Compare with the base stories |

### Character

- Three words: precise, quiet, honest.
- It should feel like a well-run workshop, not a showroom.
- References: the portfolio's own identity (solid blue accent, Outfit headings, Inter body, near-neutral paper and ink), because this system is its home brand; open-source docs that pair every rule with the code that enforces it.
- Anti-references: template component libraries shipping untouched framework defaults (indigo primary, slate greys, one radius everywhere), because a reviewer reads them as no decisions made; gradient-heavy "premium" docs sites, because the decoration hides the parts.

### Density model

Standard for components and docs (card padding 20, stack gaps of 12, 16 and 24), because stories are inspected one at a time. Chapter screens use their product's own density: the education platform runs a tighter 16 card padding.

### Hierarchy rule

On every screen, the most important thing is the component or screen under inspection. The second is the one line that explains it. Storybook's chrome, the controls and the token names are quieter than both.

### Decisions

| Decision | Choice | Because |
|---|---|---|
| Type | Outfit for headings, Inter for body and interface, JetBrains Mono for token names and figures | It matches the portfolio the system lives under, and a geometric display face over a neutral grotesque gives headings real contrast with body copy |
| Colour strategy | Restrained: warm-tinted neutrals plus one accent, the portfolio's solid blue, kept for the one primary action, links, selection and focus | The base theme stays quiet so each chapter's own colour carries its product |
| Canvas | Near-white paper with almost no chroma, matching the portfolio; in dark mode a warm near-black, never pure black | Continuity with the portfolio, and his standing rule for dark mode |
| Radius | The global scale 4, 6, 9, 12 and pill; controls 6, toasts 9, cards and modals 12 | A small scale applied by element size keeps nested corners concentric, and chapters can remap it |
| Elevation | Flat at rest; three soft, warm-tinted shadows used only by the switch thumb, toasts and modals | Cards are separated by an edge measured at 1.4:1 or more against the canvas, so they never need a shadow |
| Spacing rhythm | The brief's 4pt scale plus 20 for card padding; layout gaps in multiples of 8; class names by role | Role names let a review check intent, and 20 is the confirmed standard card padding |
| Iconography | Lucide, only where an icon labels an action or a status, always beside words | Icons repeat meaning the words already carry, so nothing depends on recognising a glyph |
| Imagery | None in components; one abstract placeholder portrait drawn from the brand ramp in the Avatar story | No real person appears, and no stock imagery stands in for product |
| Motion | 120ms for hover and press, 180ms for opening, 240ms for toasts entering; every duration drops to zero under reduced motion | Motion confirms an interaction and never delays it |
| Voice | First person in the docs; controls state outcomes such as "Save changes", "Remove program", "Clear search" | Labels say what happens next, and the docs read like the person who made the calls |
| Presets and kits | No component kit; native elements, including the dialog element, restyled with tokens | Fewer dependencies, and keyboard and screen-reader behaviour come from the platform |

### Intent-required patterns used here

- Cards: program cards, the result verdict and grouped lists, each holding one distinct thing; cards never nest.
- Badges: status only (verdicts, requirement status, eligibility), always written in words.
- Icons: action and status icons, with text beside them.
- Dark mode: a first-class theme with its own contrast checks, because the toggle is part of what the case study proves.
- Numbered sections: none.

### States

| Surface or component | Empty | Loading | Error | Success | No permission | Partial or long content |
|---|---|---|---|---|---|---|
| Form controls | Label and hint visible; a placeholder is only an example | n/a: controls do not load | Error text under the field and the edge turns danger | n/a: confirmation is a toast | Disabled look, skipped by Tab | Labels, hints and errors wrap |
| Button | n/a: always has a label | Spinner, width held, repeat presses ignored | n/a: errors show where they happen | A toast confirms | Disabled look | The label never truncates |
| Modal | n/a: always has a title | n/a: opens instantly | n/a: errors show inside | Closes and returns focus to the opener | n/a: no gated modals | The body scrolls and joins the tab order |
| Toast | The region stays present but empty | n/a | Error toasts stay until dismissed | Success and info leave after 5 seconds, paused on hover or focus | n/a | Text wraps; at most 3 at once |
| Program browse | A search with no match says why and offers Clear search | n/a: sample data is local | n/a: no network | Cards with verdicts, counts in the tabs | n/a: public sample | The tab row scrolls sideways with an edge fade |

### Banned here

Hex codes outside src/tokens, because values have one home (CI fails). The private product name, build tool names and a known misspelling of Tapbook, because the repo is public (CI fails). Framework-default shadows, coloured left-border cards, gradient text and placeholder-as-label, because they are the average and not a decision. Percentage or probability verdicts in chapter screens, because no evidence supports them. Real user data or real people in any story.

Owner: Tamir Said-Ahmed · Last reviewed: 2026-10-05

## Token decisions

All measurements are WCAG 2.x contrast ratios, produced by `npm run check:contrast`, which checks every pairing the components use in both themes and in every chapter theme.

### Colour

- **Accent: brand step 600 is the portfolio's solid blue.** It is the portfolio's current direction, chosen there on 2026-09-18. White text on it measures 7.22:1; as link text on the canvas it measures 6.91:1. **PROVISIONAL**: the portfolio's signature accent is Tamir's call.
- **Brand ramp.** Built in OKLCH at the accent's own hue with even lightness steps, then stored as sRGB so any contrast checker can verify it. In dark mode the ramp runs the other way (step 50 is always the step nearest the canvas, the Radix and Primer convention), so most semantic tokens point at the same step in both themes. The dark accent fill is the ramp's 600, with near-black text at 7.16:1.
- **Neutrals.** OKLCH hue 95, chroma at most 0.009: a hair warm, so the blue accent reads clean against it. The lightest step is the portfolio's paper and the darkest is a warm near-black. **PROVISIONAL** along with the accent, since the temperature follows the portfolio.
- **Surfaces.** Light: paper canvas, white cards, inputs and overlays. Dark: canvas at neutral 50, cards and overlays one step up.
- **Borders, three tiers.** Subtle for dividers inside a card. Default for card edges, at 1.45:1 on the light canvas and 2.03:1 on the dark one, so a flat card still reads as a surface. Strong for form-control edges, at 4.19:1, above the 3:1 that WCAG 1.4.11 asks of a control's edge.
- **Text, three steps plus two.** Primary, secondary (darker supporting copy that sits higher) and muted. Muted passes 4.5:1 on every surface it can land on; the tightest is dark muted text on the muted surface at 4.65:1. Disabled sits near 3:1, kept legible though WCAG exempts it. Inverse is for text on ink.
- **Status.** Success green, warning amber, danger red, info teal-blue. Info sits about 40 degrees of hue away from the accent so a status never reads as brand. Each has a solid, a subtle tint, a text colour (at least 6.3:1 on its tint) and a border. Status icons sit on cards, toasts and modals, never directly on the canvas, and are checked at 3:1 there.
- **Focus.** A 2px outline in brand 600, or 700 in dark mode, at least 6.6:1 against every surface.

### Type

- **Families.** Outfit for headings, Inter for body and interface, JetBrains Mono for token names, code and figures. All three are self-hosted variable fonts; nothing loads from a font CDN.
- **Scale.** 12, 14, 16, 20, 24, 32 and 40 pixels, in rem so it follows the reader's font size. Steps of 1.2 to 1.33 so neighbouring sizes are told apart at a glance. Body never goes below 16px; fields use 16px so phones do not zoom on focus.
- **Weights.** Two in use, regular and semibold, per the two-weight ladder for all-sans systems. Medium and bold exist for chapters: the education platform's headings are bold.
- **Leading and tracking.** Headings 1.15 with slightly negative tracking; body 1.5; long reading 1.65.

### Spacing

- The brief's 4pt scale (0, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) plus **20**, the confirmed standard card padding.
- Components never use numbers in class names. They use role names (`nudge`, `tight`, `snug`, `base`, `card`, `loose`, `section`, `block`, `region`, plus gutters, control insets and heights), listed on the Tokens page. Layout gaps are multiples of 8; 4, 12 and 20 stay inside components.
- Button padding is twice its vertical padding so labels breathe: 12, 20 and 24 across the three sizes.

### Radius

- The global scale: 4, 6, 9, 12 and pill. **PROVISIONAL** as it is in the layout skill.
- Applied by size: checkbox 4, controls 6, toasts 9, cards and modals 12, badges, avatars and the switch as pills. Chapters remap it through component tokens.

### Elevation

- Three shadows only, all soft and tinted with the ink's warmth rather than pure black. Small for the switch thumb, medium for toasts, large for modals. Resting cards are flat.

### Motion

- Durations 120, 180 and 240 milliseconds with an ease-out curve. All three drop to zero under `prefers-reduced-motion`, so entrances resolve straight to their end state.
- Press feedback is a 2% scale on buttons, also switched off under reduced motion.

### Sizes and layers

- Control heights 32, 40 and 48 from the global ladder. Any control drawn under 44px gets an invisible 44px tap area, his usability standard; WCAG's own floor is 24px.
- Layers: sticky 10, modal 50, toast 60. Widths: dialogs 24rem and 32rem, reading 48rem, content 72rem, page 90rem.

### Component tokens

The third layer: control radius, border and insets; card radius and padding; modal, toast, badge and checkbox radius; the danger button's fill; heading weight. Each points at a primitive or semantic token, so a chapter can reshape a component without touching its code.

### Chapter 1: the education platform

Taken from the platform's own shipped tokens on 2026-10-05: Inter for headings and body, Geist Mono for figures, its clear blue accent and dark-mode values, its cool canvas, its status colours (purple for Explore), radii of 8, 12, 20 and 28, controls of 44 and 48 and a 16 card padding. Four values depart from the platform, each listed with its reason on the chapter's Intro page and in `src/tokens/chapters/education-platform.ts`: field edges raised to 3:1, the danger button filled with the platform's darker danger red (its own red with white text measures 4.49:1), derived status borders, and the info role carrying Explore.

## Decision log

| Date | Decision | Status | Why |
|---|---|---|---|
| 2026-10-05 | Base accent is the portfolio's solid blue | PROVISIONAL, Tamir's call | The brief asks for the portfolio's current accent; the signature colour is his decision |
| 2026-10-05 | Neutrals lean a hair warm, paper and ink match the portfolio | PROVISIONAL | Continuity with the portfolio; reverses easily if the accent changes |
| 2026-10-05 | Storybook 10 instead of 9 | Decided | Storybook 9.1.20 pins a dependency with a live advisory (GHSA-82fw-gwwq-j7x9) and no patched 9.x release exists; 10.6.1 drops it and audits clean |
| 2026-10-05 | ESLint 10 without the JSX accessibility lint plugin | Decided | ESLint 9 is out of support and the plugin does not support 10 yet; axe on every story, in both themes, covers the same ground at runtime |
| 2026-10-05 | Chapter 1 uses the platform's current clear blue | Decided, flagged | The platform's live tokens moved to a clear blue in its September 18 refresh; the older deep navy is superseded there |
| 2026-10-05 | The base and chapter 1 accents share a hue | Flagged | Both blues sit near OKLCH hue 260, so the difference is carried by type, radius, canvas and density. Fine for chapter 1; worth a look if the base accent changes |
| 2026-10-05 | Badge gains an info variant | Decided | The info status exists in the token schema, and chapter 1 needs it for Explore |
| 2026-10-05 | Spacing adds 20; tokens add border, accent, focus, scrim, motion, sizes, layers and widths | Decided | The brief's schema has no home for these, and components need them |
| 2026-10-05 | Chapter themes live in src/tokens/chapters | Decided | Chapter values are colours; keeping them with the tokens keeps every hex code in one folder |
| 2026-10-05 | Hosted on GitHub Pages at tamirsaidd.github.io/design-system | Decided | Tamir approved putting it online as a case study; Pages was chosen because the Vercel connection could not create the project. Deploys from main; checked under the sub-path first |
