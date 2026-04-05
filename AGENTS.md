# AGENTS.md — sito-wallet/web

Project-specific rules for AI agents. These override or extend the guidelines in `.sito/dashboard.md` and `.sito/dashboard-app.md`.

---

## Workspace Architecture Rule

- Also follow `../ARCHITECTURE_RULES.md`.

---

## Documentation First

- Before writing code or proposing an implementation plan, read and account for all documentation under `.sito/*`.
- Treat `.sito/*` as a required source of truth for architecture, conventions, and workflows.
- If documentation in `.sito/*` conflicts with older references (including `.sito/dashboard.md` and `.sito/dashboard-app.md`), prioritize the files that currently exist in `.sito/*`.

---

## Styling

### Use semantic color tokens — never raw Tailwind palette colors

The project defines all status/brand colors in `src/styles/variables.css` under `@theme`.
Always use the semantic token classes, **not** raw Tailwind palette utilities.

| Situation                 | ✅ Correct                   | ❌ Wrong                        |
| ------------------------- | ---------------------------- | ------------------------------- |
| Warning background + text | `bg-bg-warning text-warning` | `bg-yellow-400 text-yellow-900` |
| Error background + text   | `bg-bg-error text-error`     | `bg-red-500 text-white`         |
| Success background + text | `bg-bg-success text-success` | `bg-green-500 text-white`       |
| Info background + text    | `bg-bg-info text-info`       | `bg-blue-500 text-white`        |
| Brand primary bg          | `bg-bg-primary`              | `bg-blue-900`                   |
| Hover state               | `hover:bg-hover-primary`     | `hover:bg-blue-700`             |
| Muted text                | `text-text-muted`            | `text-gray-500`                 |
| Base background           | `bg-base`                    | `bg-gray-100`                   |
| Border                    | `border-border`              | `border-gray-300`               |

**Full token reference:** `src/styles/variables.css`

Available status classes (from `src/index.css`):

- `.success` → `bg-bg-success text-success`
- `.error` → `bg-bg-error text-error`
- `.inverted-success` → `text-bg-success`
- `.inverted-error` → `text-bg-error`

There is **no `.warning` semantic class** yet — use `bg-bg-warning text-warning` inline or add it to `src/styles/components.css`.

---

### New component with custom styles: co-locate a styles.css

```
src/components/MyComponent/
├─ MyComponent.tsx
├─ index.ts
└─ styles.css          ← import tokens + define root class
```

```css
/* styles.css */
@import "../../styles/variables.css"; /* adjust depth */

.my-component {
  @apply flex items-center gap-2 bg-base p-3 rounded-2xl;
}

.my-component.warning {
  @apply bg-bg-warning text-warning;
}
```

Import `styles.css` in the component file, not in `index.css`.

---

## Icons

### Always use FontAwesome — never emojis or raw Unicode characters

The project uses `@fortawesome/react-fontawesome` with `@fortawesome/free-solid-svg-icons`.

```tsx
// ✅ correct
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon={faWarning} />

// ❌ wrong — never use emojis in JSX
<span>⚠</span>
```

Common icon/situation mapping:
| Situation | Icon |
|-----------|------|
| Warning / offline | `faWarning` |
| Success / check | `faCheckCircle` |
| Error | `faCircleExclamation` |
| Delete | `faTrash` |
| Edit | `faPencil` |
| Sync / restore | `faRotateLeft` |
| Download / export | `faCloudArrowDown` |
| Upload / import | `faCloudUpload` |
| Filter | `faFilter` |
| Search | `faMagnifyingGlass` |

For `IconButton` specifically, use `@sito/dashboard-app`'s `IconButton` which expects `icon: IconDefinition`.

---

## Conditional rendering guards

When a component renders only in a specific state, place the early-return guard **before** the JSX:

```tsx
// ✅ correct — banner only shows when offline
if (isOnline) return null;

// ❌ wrong — inverted logic
if (!isOnline) return null;
```

---

## Offline / IndexedDB

- All IndexedDB clients live in `src/lib/api/offline/` and extend `IndexedDBClient` from `@sito/dashboard-app`.
- All custom methods that are unavailable offline (e.g. `processImport`, `getTypeResume`) must be stubbed to return empty/zero values.
- Seeding from API results uses `.seed(items).catch(() => {})` — fire-and-forget, never block the query.
- The offline manager is accessed via `useOfflineManager()` from `providers`.
- `OfflineManager` must only be instantiated in `src/providers/SWManagerProvider.tsx` (provider composition); do not instantiate it in feature components, hooks, or views.
- Never call `useOfflineManager()` in SSR or Node contexts.

---

## Offline Sync (/sync + /ws)

- Sync infrastructure lives in `src/lib/api/sync/`.
- Use the shared services exported from `lib` (`offlineSyncService`, `syncSocketService`); do not create ad-hoc sync clients in components.
- HTTP sync flow must stay aligned with backend contract: `status -> session/start -> bulk/{entity} -> session/finish` (or `session/cancel` on abort/error).
- WebSocket sync uses STOMP handshake at `/ws` and user destination `/user/queue/sync-status`.
- Socket event handling in UI must be centralized in `OfflineSyncProvider`; avoid duplicating socket subscriptions in view components.
- Keep sync queue payloads backend-compatible and strongly typed (no `any`, no implicit shape assumptions).

---

## Form Dialogs (`useFormDialog` + `FormDialog`)

All form dialogs **must** follow this pattern from `@sito/dashboard-app`:

### 1. Hook returns flat props

The hook must call `useFormDialog<TDto, TMutationDto, TMutationOutputDto, TFormType>(...)` and return its result **spread at the top level**, not nested inside a property. Any extra state (e.g. `selectedAccount`) is added alongside the spread.

```tsx
// ✅ correct — flat return
export function useMyDialog() {
  const formDialog = useFormDialog<...>({ ... });
  return { ...formDialog, extraProp };
}

// ❌ wrong — nested return
export function useMyDialog() {
  const formDialog = useFormDialog<...>({ ... });
  return { formDialog, extraProp };
}
```

### 2. Dialog component receives flat props and spreads into `FormDialog`

The dialog component receives **one props object** that extends `FormDialogPropsType<TFormType>` (or `TriggerFormDialogPropsType<TFormType>`) with any extra props. It spreads those props directly into `<FormDialog {...props}>`.

```tsx
// ✅ correct
export function MyDialog(props: MyDialogPropsType) {
  return (
    <FormDialog {...props}>
      <MyForm {...props} />
    </FormDialog>
  );
}

// ❌ wrong — destructuring a nested formDialog
export function MyDialog({ formDialog, extra }: ...) {
  return <FormDialog {...formDialog}>...</FormDialog>;
}
```

### 3. Parent passes hook result with spread

```tsx
// ✅ correct
const myDialog = useMyDialog();
<MyDialog {...myDialog} />

// ❌ wrong — passing named props
<MyDialog formDialog={myDialog.formDialog} extra={myDialog.extra} />
```

### 4. Props type extends `FormDialogPropsType` or `TriggerFormDialogPropsType`

Define the dialog's props type in `types.ts`. If it needs extra props beyond the form dialog, extend the base type:

```tsx
export interface MyDialogPropsType extends TriggerFormDialogPropsType<MyFormType> {
  extraProp: SomeType;
}
```

For standard dialogs with no extra props, use a type alias:

```tsx
export type MyDialogPropsType = FormDialogPropsType<MyFormType>;
```

---

## General

- Follow all rules in `.sito/dashboard.md` and `.sito/dashboard-app.md`.
- Never import from internal `@sito/dashboard-app` paths.
- Use `useNotification()` for all user-facing feedback.
- Never add `any` types.
- In `.tsx` files, do not use `t("key", { defaultValue: "..." })`; always add/update the translation key in `src/lang/*/*.json` and call `t("key")`.
- Put types in types.ts files
