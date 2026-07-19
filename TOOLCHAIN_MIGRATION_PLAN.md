# React 19 and Dashboard Stack Migration Plan

This plan aligns `sito-wallet` with the published `@sito/dashboard-app` 0.2.0
runtime. The Node, TypeScript, Oxlint and Vite migration is already complete;
the remaining work is a React runtime migration, not another toolchain rewrite.

No validation scripts were executed while preparing this plan.

## Reviewed stack

| Layer | Wallet now | Shared stack baseline | Status |
| --- | --- | --- | --- |
| Node.js | 22.18.0 (`^22.13.0`) | 22.18.0 (`^22.13.0`) | Aligned |
| Package manager | pnpm 10.34.4 | pnpm 10.34.4 | Aligned |
| TypeScript | 7.0.2 | 7.0.2 | Aligned |
| Lint | Oxlint 1.73.0 + tsgolint 0.24.0 | Same | Aligned |
| Vite | 8.1.4 | 8.1.4 | Aligned |
| React Vite plugin | 6.0.3 | 6.0.3 | Aligned |
| Vitest / jsdom | 4.1.10 / 29.1.1 | 4.1.10 / 29.1.1 | Aligned |
| Prettier | 3.9.5 | 3.9.5 | Aligned |
| Tailwind CSS | 4.3.2 | 4.3.2 in `@sito/dashboard-app` | Aligned |
| React / React DOM | 19.2.7 | 19.2.7 | Aligned |
| React type packages | 19.2.17 / 19.2.3 | 19.2.17 / 19.2.3 | Aligned |
| FontAwesome React binding | 3.4.0 | 3.4.0 | Aligned |
| FontAwesome core/icons | 7.0.0 | 7.0.0 | Aligned |
| `@sito/dashboard-app` | 0.2.0 | 0.2.0 | Aligned |
| `@sito/dashboard` | Transitive 0.3.0 | 0.3.0 | Aligned |
| `@sito/ui` | Transitive 0.3.3 | 0.3.3 | Aligned |

## Static findings

- The regenerated lockfile resolves `@sito/dashboard-app` 0.2.0,
  `@sito/dashboard` 0.3.0 and `@sito/ui` 0.3.3 against React 19.2.7. No React
  18 or old FontAwesome React binding resolution remains in the app graph.
- Wallet's direct React ecosystem dependencies declare React 19-compatible
  peer ranges. `i18next` and `react-i18next` still declare an optional
  TypeScript 5 peer; this must not cause a TypeScript downgrade. Confirm their
  behavior through the existing TypeScript 7 build.
- Wallet already uses `createRoot`; no legacy `ReactDOM.render`, `findDOMNode`,
  `react-dom/test-utils`, or no-argument typed `useRef()` usage was found.
- The static preflight found three return types in
  `src/views/Home/components/Cards/types.ts` using the removed global
  `JSX.Element` namespace. Checkpoint 2 migrated them to React-scoped types.
- The `@typescript/typescript6` compatibility package used by the shared
  libraries exists for `vite-plugin-dts`. Wallet does not generate declaration
  bundles and should not copy that dependency.
- Wallet's dependency and lockfile target the published
  `@sito/dashboard-app` 0.2.0. Checkpoint 1 removed the old local `link:`
  override so the published package remains the single install source for this
  migration.
- The conditional Vite/Vitest aliases for an intentionally symlinked local
  build are inert with the published install and can remain as development
  support. They are not part of the React migration.
- The first developer validation pass found one Oxlint assertion error and four
  TypeScript errors. The consumer fixes remove the obsolete `Link` cast,
  materialize persisted debt filters as a plain record, follow the 0.2.0
  `FormDialog` prop surface and guard its optional `setValue` contract.
- The next build completed TypeScript compilation but Rolldown could not
  resolve `workbox-window` from `virtual:pwa-register/react`. Wallet now
  declares `workbox-window` 7.4.1 directly so pnpm exposes the runtime import
  to Vite's virtual PWA module.

## Checkpoint 1: normalize the runtime manifest

- [x] Keep `@sito/dashboard-app` pinned to published version `0.2.0`.
- [x] Upgrade `react` and `react-dom` together to `19.2.7`.
- [x] Upgrade `@types/react` to `19.2.17` and `@types/react-dom` to `19.2.3`.
- [x] Upgrade `@fortawesome/react-fontawesome` to `3.4.0`.
- [x] Keep the FontAwesome core and icon packages at `7.0.0`.
- [x] Remove the stale `@sito/dashboard-app: link:../../lib/-sito-dashboard-app`
  pnpm override.
- [x] Do not add direct `@sito/dashboard`, `@sito/ui`,
  `@typescript/typescript6`, or additional migration libraries.
- [x] Avoid unrelated dependency upgrades in this checkpoint.
- [x] Expose `workbox-window` 7.4.1 as the direct runtime required by
  `virtual:pwa-register/react` under pnpm's strict dependency layout.

## Checkpoint 2: apply only confirmed React 19 source changes

- [x] Replace the three global `JSX.Element` return types in the Home card
  contracts with appropriate React-scoped element types.
- [x] Review the first compiler diagnostics produced after the dependency
  install and make only evidence-backed React 19 type fixes.
- [x] Replace the Home dashboard card test's ambiguous shared IconButton
  test ids with accessible role-and-name queries for filter and delete actions.
- [ ] Review any remaining diagnostics after the developer reruns validation.
- [x] Keep provider composition, routing, shared component imports and public
  `@sito/dashboard-app` contracts unchanged unless a diagnostic proves a
  required adaptation.
- [x] Do not rewrite existing FontAwesome JSX pre-emptively; current usages are
  conventional and should be changed only if version 3 types expose a real
  incompatibility.

## Checkpoint 3: regenerate and audit the dependency graph

The developer performs this checkpoint.

- [ ] Activate Node 22.18.0 and pnpm 10.34.4.
- [x] Run `pnpm install` to regenerate `pnpm-lock.yaml`.
- [x] Confirm the lockfile resolves the dashboard stack against React 19.2.7
  and `@fortawesome/react-fontawesome` 3.4.0.
- [x] Confirm no direct React 18, React DOM 18, React 18 type package, or
  `react-fontawesome` 0.2.3 resolution remains in the application graph.
- [x] Confirm only one React and React DOM runtime is selected for wallet and
  the three dashboard packages.
- [ ] Treat the optional TypeScript 5 peer metadata from i18n packages as a
  compatibility signal to verify, not as authorization to downgrade
  TypeScript 7.

## Checkpoint 4: validation sequence

The developer runs these commands and shares the first failing output before
any broader code changes:

```bash
nvm use
pnpm install
pnpm run format:check
pnpm run lint
pnpm run build
pnpm run test
```

After the static suite passes:

```bash
pnpm run test:e2e
```

Fix failures in this order:

1. Dependency and peer-resolution errors.
2. React 19 and React 19 type diagnostics.
3. FontAwesome React binding diagnostics.
4. Oxlint findings caused by the confirmed migration patch.
5. Unit/integration regressions, then E2E regressions.

Do not loosen existing Oxlint rules or `skipLibCheck` merely to hide a runtime
or application type incompatibility.

## Checkpoint 5: runtime smoke checks

- [ ] App bootstrap renders without duplicate-React or invalid-hook-call
  errors.
- [ ] Authentication restore, sign-in and logout still work.
- [ ] Dialogs, form submission, notifications and portal-based dropdowns open
  and close correctly.
- [ ] Tables, filters, pagination and row actions remain functional.
- [ ] FontAwesome icons render in cards, menus, actions and empty states.
- [ ] Charts render without React lifecycle warnings.
- [ ] Offline manager, service worker update prompt and sync providers do not
  duplicate subscriptions or listeners under React 19 development behavior.
- [ ] Production build and PWA startup complete without missing chunks or CSS.

## Completion criteria

- `package.json` and `pnpm-lock.yaml` describe the same published dependency
  graph.
- All React-facing peers of `@sito/dashboard-app`, `@sito/dashboard` and
  `@sito/ui` are satisfied by React 19.2.7.
- The application has no global `JSX.Element` references.
- Format, Oxlint, build, unit/integration tests and E2E tests pass in the order
  documented above.
- Runtime smoke checks pass without duplicating providers, React instances or
  local shared-package implementations.
