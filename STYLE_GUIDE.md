# Style Guide — sito-wallet

What this covers: how we organize CSS and Tailwind v4 in the project, conventions, and patterns to keep visual consistency.

## Quick Overview
- CSS stack: Tailwind v4 (utilities) + co-located component CSS + global rules.
- Tokens and theme: `src/styles/variables.css` defines colors and breakpoints via `@theme`.
- Global: `src/index.css` imports `variables.css`, `dashboard.css`, `components.css` and adds utilities/animations.
- Co-location: each component/view with custom styles has a `styles.css` file in its folder.
- Fonts: Poppins and Roboto via `@fontsource` in `src/main.tsx`.

## Relevant Structure

```
src/
├─ index.css                 # Global + utilities
├─ styles/
│  ├─ variables.css          # @theme (colors, breakpoints)
│  ├─ components.css         # Semantic classes (inputs, links, etc.)
│  └─ dashboard.css          # Adjustments for @sito/dashboard
├─ components/               # Reusable UI (Accordion, Card, Search, ...)
├─ views/                    # Pages with subcomponents and co-located CSS
└─ layouts/                  # App and auth shells
```

## Tailwind + CSS Usage
- Tailwind v4 is imported in `variables.css` via `@import "tailwindcss";`.
- Tokens live under `@theme { --color-... }` and are consumed through the project's semantic classes (e.g., `bg-base`, `text-text`, `bg-bg-primary`, `text-bg-success`).
- In `components.css`, use `@reference "./variables.css";` and `@apply` to compose utilities into reusable classes.
- In component `styles.css`, import tokens at the top: `@import "../../styles/variables.css";` (adjust the relative path to depth).

Examples (real excerpts):
- `src/styles/components.css:1`: `@reference "./variables.css";`
- `src/index.css:36`: `main { @apply bg-base-dark ... }`

## Conventions
- Semantic names: short, clear class names (`.input`, `.error`, `.success`, `.elevated`).
- Modifiers: additional classes for states (`.input.error`, `.inverted-success`).
- Avoid deep cascades: flat selectors; one root class per component.
- Prefer `@apply` in CSS to compose utilities; avoid long utility chains inline in JSX when reusable.
- Responsiveness: use Tailwind responsive utilities. Add breakpoints in `@theme` as needed (e.g., `--breakpoint-xs`).

## Pattern: New Component with CSS
1. Create `src/components/MyComponent/`.
2. Add `MyComponent.tsx` and `styles.css`.
3. In `styles.css`, import tokens: `@import "../../styles/variables.css";`.
4. Define a root class and modifiers:

```css
@import "../../styles/variables.css";

.my-component {
  @apply flex items-center gap-2 bg-base p-3 rounded-2xl;
}

.my-component.primary {
  @apply bg-bg-primary text-base;
}
```

Usage in JSX:

```tsx
<div className="my-component primary">Content</div>
```

## Tokens and Theming
- Colors/spacing/breakpoints: edit `src/styles/variables.css` under `@theme`.
- If you need new semantic utilities, compose them in `src/styles/components.css` using `@apply`.
- Dark mode: you can add `:root[data-theme='dark'] { ... }` in `variables.css` while preserving semantic naming.

## Rule Types in the Repo
- Global: element typography, animations (`opacity`, `appear`, `disappear`, `fancy-appear`, `blur-appear`), utilities (`.elevated`, `.success`, `.error`). See `src/index.css:1`.
- Components/views: co-located CSS mixing `@apply` with simple selectors. Example: `src/views/Home/components/.../styles.css` and `src/components/*/styles.css` when present.

## Best Practices
- Keep co-location and semantic class names.
- Avoid highly specific selectors; favor reuse via `@apply`.
- Document new tokens in `variables.css` with a short comment.
- Check `components.css` before adding another duplicate utility.

## Where to Change Common Things
- Tokens/colors: `src/styles/variables.css:1`
- Global/utilities/animations: `src/index.css:1`
- Input/link utilities: `src/styles/components.css:1`
- A specific component’s style: `src/components/<Name>/styles.css`

---
This guide reflects the current repository state (Tailwind v4, `src/` structure, semantic classes, co-located styles).
