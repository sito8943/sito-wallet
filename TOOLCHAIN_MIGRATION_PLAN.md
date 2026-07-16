# Toolchain Migration Plan

This migration prepares wallet for React 19 and `@sito/dashboard-app` 0.1.0
without changing either runtime dependency in the toolchain checkpoint.

## Target baseline

- Node.js 22.18.0 with engine range `^22.13.0`
- pnpm 10.34.4 as the only package manager
- TypeScript 7.0.2
- Vite 8.1.4 with `@vitejs/plugin-react` 6.0.3
- Tailwind CSS 4.3.2
- Vitest 4.1.10 and jsdom 29.1.1
- Oxlint 1.73.0 with type-aware checks
- Prettier 3.9.5 as the formatter

## Checkpoint 1: static configuration

- [x] Align `package.json`, `.nvmrc`, pnpm workspace settings and scripts.
- [x] Replace ESLint configuration with type-aware Oxlint.
- [x] Replace the SWC Vite plugin with the React 6 plugin.
- [x] Move CI and Husky commands from npm to pnpm.
- [x] Let Playwright own the preview-server lifecycle.
- [x] Update the project README.
- [ ] Regenerate `pnpm-lock.yaml` with the target toolchain.
- [ ] Run formatting, lint, build and tests.

## Checkpoint 2: React 19 prerequisites

- [ ] Review diagnostics produced by TypeScript 7 and Oxlint.
- [ ] Repair only confirmed source incompatibilities.
- [ ] Confirm all direct React ecosystem dependencies accept React 19.

## Checkpoint 3: runtime migration

- [ ] Upgrade React, React DOM and their type packages to 19.2.7.
- [ ] Upgrade `@fortawesome/react-fontawesome` to 3.4.0.
- [ ] Replace global `JSX.Element` references with React-scoped types.
- [ ] Upgrade or link `@sito/dashboard-app` 0.1.0.
- [ ] Regenerate the lockfile and complete full verification.

## Developer validation commands

Run these after reviewing the static patch:

```bash
nvm install
nvm use
corepack enable
corepack prepare pnpm@10.34.4 --activate
pnpm install
pnpm run format:check
pnpm run lint
pnpm run build
pnpm run test
```

Do not start Checkpoint 3 until the Checkpoint 1 diagnostics have been reviewed.
