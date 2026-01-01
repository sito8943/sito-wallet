# sito-wallet

Personal finance web app built with React, TypeScript, Vite and Tailwind CSS v4. It integrates `@sito/dashboard-app` for base components (layout, notifications, tables, auth helpers) and i18n with `react-i18next`.

## Requirements
- Node.js 18+ (20+ recommended)
- npm 9+ or compatible

## Quick Start
- Install dependencies: `npm install`
- Copy env vars: `cp _env.example .env`
- Development: `npm run dev` (opens `http://localhost:5173`)

## Scripts
- `npm run dev`: Vite dev server
- `npm run build`: build TypeScript and production bundle
- `npm run preview`: serve the production build locally
- `npm run lint`: run ESLint

## Environment Variables
Keys are read in `src/config.ts`, with a sample in `_env.example`.

Main keys:
- `VITE_API_URL`: API base URL
- `VITE_THIS_URL`: public app URL
- User/state `VITE_*`: `BASIC_KEY`, `CACHE`, `VALIDATION_COOKIE`, `RECOVERING_COOKIE`, `USER`, `ACCEPT_COOKIE`, `DECLINE_COOKIE`, `LANGUAGE`, `REMEMBER`, `ONBOARDING`, `GUEST_MODE`, `RECENT_SEARCHES`
- `VITE_SUPABASE_CO`, `VITE_SUPABASE_ANON`: Supabase credentials

Runtime config: see `src/config.ts:1` and `_env.example:1`.

## Project Structure

```
sito-wallet/
├─ package.json
├─ vite.config.ts
├─ tsconfig.json
├─ eslint.config.js
├─ index.html
├─ _env.example
├─ src/
│  ├─ main.tsx               # Entry: providers, fonts, global styles
│  ├─ App.tsx                # Initial auth load and routes
│  ├─ Routes.tsx             # Route declarations with @loadable/component
│  ├─ index.css              # Global styles + utilities
│  ├─ config.ts              # Reads VITE_* variables
│  ├─ i18.ts                 # i18n setup
│  ├─ vite-env.d.ts          # Vite types
│  ├─ globals.d.ts           # Auxiliary global types
│  ├─ assets/                # Static assets
│  ├─ styles/                # Shared CSS
│  │  ├─ variables.css       # Tokens and theme (Tailwind v4)
│  │  ├─ components.css      # Utilities and semantic classes
│  │  └─ dashboard.css       # Styles for @sito/dashboard
│  ├─ layouts/               # App shells
│  │  ├─ View/               # App shell (Header/Footer, Onboarding)
│  │  └─ Auth/               # Auth flow
│  ├─ providers/             # Local context providers
│  ├─ components/            # Reusable UI (Accordion, Card, Search, ...)
│  ├─ hooks/                 # Custom hooks
│  ├─ lib/                   # API, entities and utils
│  └─ views/                 # Pages and subcomponents per view
│     ├─ Home/
│     ├─ Transactions/
│     ├─ TransactionCategories/
│     ├─ Accounts/
│     ├─ Currencies/
│     └─ Info/ (About, Policies, Terms)
```

## Styling and UI
- Stack: Tailwind CSS v4 + semantic classes centralized in `src/styles`.
- Tokens: defined in `src/styles/variables.css` under `@theme` (colors, breakpoints).
- Co-location: components with custom styles have a `styles.css` in their folder.
- Fonts: `@fontsource/poppins` and `@fontsource/roboto` in `src/main.tsx:10`.
- Icons: `@fortawesome/*`.

See `STYLE_GUIDE.md` for detailed CSS conventions and examples.

## Routing and Navigation
- Router with `react-router-dom` and code-splitting via `@loadable/component`.
- `View` layout provides Header/Footer, onboarding and dashboard providers.
- `Auth` layout wraps auth screens and redirects if already authenticated.

## Integrations
- `@sito/dashboard-app`: config provider, notifications, table, auth helpers.
- `@tanstack/react-query`: `queryClient` invalidations (see usage in views).
- `i18next`/`react-i18next`: internationalization (see `src/i18.ts`).

## Development
- TypeScript + ES modules.
- ESLint configuration in `eslint.config.js`. Run `npm run lint` before PRs.
- Prefer atomic, descriptive commits. Follow the existing code style.

## License
See `license.txt`.
