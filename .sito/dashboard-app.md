# AGENTS.md — @sito/dashboard-app

Guidelines for AI agents working on projects that consume **`@sito/dashboard-app`**.
This library is a React UI component library built on top of `@sito/dashboard`, providing prefab components, hooks, API utilities, and providers for building dashboard applications.

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.3.1 |
| Language | TypeScript | 5.7.2 |
| Styling | Tailwind CSS + Emotion | 4.x / 11.x |
| Icons | FontAwesome | 7.0.0 |
| Forms | React Hook Form | 7.61.1 |
| Server State | TanStack React Query | 5.x |
| Base Library | @sito/dashboard | ^0.0.68 |

---

## Installation

```bash
npm install @sito/dashboard-app
```

All peer dependencies **must** be installed in the consumer project:

```bash
npm install \
  react@18.3.1 react-dom@18.3.1 \
  @sito/dashboard@^0.0.68 \
  @emotion/css@11.13.5 \
  @tanstack/react-query@5.83.0 \
  react-hook-form@7.61.1 \
  @fortawesome/fontawesome-svg-core@7.0.0 \
  @fortawesome/free-solid-svg-icons@7.0.0 \
  @fortawesome/free-regular-svg-icons@7.0.0 \
  @fortawesome/free-brands-svg-icons@7.0.0 \
  @fortawesome/react-fontawesome@0.2.3
```

---

## Provider Setup

Wrap the application root with the required providers **in this order**:

```tsx
import {
  ConfigProvider,
  ManagerProvider,
  AuthProvider,
  NotificationProvider,
  DrawerMenuProvider,
  IManager,
} from "@sito/dashboard-app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const manager = new IManager(import.meta.env.VITE_API_URL);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        location={window.location}
        navigate={(route) => { /* router navigate */ }}
        linkComponent={MyLinkComponent}
      >
        <ManagerProvider manager={manager}>
          <AuthProvider>
            <NotificationProvider>
              <DrawerMenuProvider>
                {/* app routes */}
              </DrawerMenuProvider>
            </NotificationProvider>
          </AuthProvider>
        </ManagerProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
```

### Provider responsibilities

| Provider | Purpose |
|----------|---------|
| `ConfigProvider` | Injects router `location`, `navigate`, `linkComponent`, and optional `searchComponent` |
| `ManagerProvider` | Injects the API manager (`IManager`) consumed by hooks and components |
| `AuthProvider` | Manages auth session (`token`, `refreshToken`, `accessTokenExpiresAt`, `remember`) and exposes `account`, `logUser`, `logoutUser`, `logUserFromLocal` |
| `NotificationProvider` | Global toast notification system |
| `DrawerMenuProvider` | Dynamic drawer menu state |
| `NavbarProvider` | Provides dynamic navbar state: `title`, `setTitle`, `rightContent`, `setRightContent` |

---

## Component Architecture

### Import pattern

Always import from the root package. Never import from internal paths:

```tsx
// ✅ correct
import { Page, PageHeader, Actions, FormContainer } from "@sito/dashboard-app";

// ❌ wrong — internal paths are not part of the public API
import { Page } from "@sito/dashboard-app/src/components/Page/Page";
```

### Available components

| Component | Description |
|-----------|-------------|
| `Page` | Generic page layout with entity management (list, delete, restore, import/export) |
| `PageHeader` | Page title + action bar |
| `Action` / `Actions` / `ActionsDropdown` | Action primitives re-exported from `@sito/dashboard` |
| `FormContainer` | Form wrapper that integrates react-hook-form submit/reset buttons |
| `ParagraphInput` | Textarea input with label, state, and helper text |
| `PasswordInput` | Password input with show/hide toggle |
| `Navbar` | Application navigation bar |
| `Drawer` | Side drawer navigation |
| `Notification` | Toast notification component |
| `Onboarding` | Multi-step onboarding flow |
| `TabsLayout` | Tabbed page layout; uses links by default and can switch to buttons with `useLinks={false}` + `tabButtonProps` |
| `PrettyGrid` | Data grid/table |
| `Empty` | Empty state placeholder |
| `Error` | Error display with default icon/message/retry or fully custom content via `children` |
| `Loading` / `SplashScreen` | Loading indicators |
| `IconButton` | FontAwesome-based icon button (overrides `@sito/dashboard`'s version) |
| `Clock` | (**deprecated**) Displays a formatted clock in the navbar; will be removed in a future release |

---

### `Error` component patterns

Use default mode for common fallback UI:

```tsx
<Error
  error={error}
  onRetry={() => refetch()}
/>
```

Use `children` only when you need fully custom content:

```tsx
<Error>
  <CustomErrorPanel />
</Error>
```

Do not mix default props (`error`, `message`, `onRetry`, etc.) with `children` in the same usage.

### `TabsLayout` links vs buttons

By default, tabs render with your router `linkComponent` (`useLinks = true`).
For non-routing tab switches, disable links:

```tsx
<TabsLayout
  useLinks={false}
  tabButtonProps={{ variant: "outlined", color: "secondary" }}
  tabs={tabs}
/>
```

`tabButtonProps` customizes each tab button when `useLinks` is `false`. Its `onClick` and `children` are controlled internally by `TabsLayout`.

---

## TypeScript Rules

### Generics are required — do not use `any`

The library is fully generic. Always supply type parameters:

```tsx
// ✅ correct
const page = <Page<MyEntityDto> ... />;

// ❌ wrong
const page = <Page ... />;  // loses type safety
```

### Extend base DTOs for entity types

```ts
import {
  BaseEntityDto,
  BaseCommonEntityDto,
  BaseFilterDto,
  DeleteDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

interface ProductFilterDto extends BaseFilterDto {
  category?: string;
}
```

### Use `Omit` / `Pick` for prop extension

```ts
import type { TextInputPropsType } from "@sito/dashboard-app";

interface MyInputProps
  extends Pick<TextInputPropsType, "label" | "state" | "containerClassName"> {
  customProp: string;
}
```

### Use type guards for error handling

```ts
import { isValidationError, isHttpError } from "@sito/dashboard-app";

if (isValidationError(error)) {
  // handle field-level validation errors
}

if (isHttpError(error)) {
  // handle HTTP errors
}
```

---

## Hook Patterns

### Action hooks

Action hooks return a single `action` object for use with `Actions` or `PrettyGrid`. All optional props have sensible defaults so only `onClick` is required in common cases:

```tsx
import {
  useDeleteAction,
  useEditAction,
  useRestoreAction,
  useExportAction,
  useImportAction,
} from "@sito/dashboard-app";

function MyPage() {
  const { action: deleteAction } = useDeleteAction({
    onClick: (ids) => softDelete(ids),
  });

  const { action: editAction } = useEditAction({
    onClick: (record) => openEditDialog(record),
  });

  return <Actions actions={[editAction(record), deleteAction(record)]} />;
}
```

#### Default values per hook

| Hook | `sticky` | `multiple` | `id` | `icon` | `tooltip` |
|------|----------|------------|------|--------|-----------|
| `useDeleteAction` | `true` | `true` | `"delete"` | `faTrash` | auto-translated |
| `useEditAction` | `true` | — | `"edit"` | `faPencil` | auto-translated |
| `useRestoreAction` | `true` | `false` | `"restore"` | `faRotateLeft` | auto-translated |
| `useExportAction` | — | — | `"export"` | `faCloudArrowDown` | auto-translated |
| `useImportAction` | — | — | `"import"` | `faCloudUpload` | auto-translated |

All hooks also default `hidden = false` and `disabled = false`. Override any prop to customize behavior.
```

### Navbar hook

Use `useNavbar` to set the page title or inject content into the navbar's right slot from any child component:

```tsx
import { useNavbar } from "@sito/dashboard-app";

function ProductsPage() {
  const { setTitle, setRightContent } = useNavbar();

  useEffect(() => {
    setTitle("Products");
    setRightContent(<MyRightSlotContent />);
    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);
}
```

`NavbarProvider` must wrap `Navbar` in the component tree for this to work.

### Dialog hooks

```tsx
import {
  useDeleteDialog,
  useFormDialog,
  useImportDialog,
  useRestoreDialog,
} from "@sito/dashboard-app";

const { open: openDeleteDialog, dialog: deleteDialog } = useDeleteDialog({
  onConfirm: (ids) => mutate(ids),
});
```

### Form hooks

```tsx
import { usePostForm } from "@sito/dashboard-app";
import { useQueryClient } from "@tanstack/react-query";

const formProps = usePostForm<ProductDto, CreateProductDto, ProductDto, ProductFormValues>({
  defaultValues: { name: "", price: 0 },
  mutationFn: (data) => api.products.insert(data),
  queryKey: ["products"],
  queryClient: useQueryClient(),
  onSuccess: () => closeDialog(),
});

// Pass directly to FormContainer
return <FormContainer {...formProps}>{/* inputs */}</FormContainer>;
```

### Query / mutation hooks

```tsx
import { useDefaultQuery, useDefaultMutate } from "@sito/dashboard-app";

const { data, isLoading } = useDefaultQuery<ProductDto>({
  queryKey: ["products"],
  queryFn: () => api.products.get(),
});
```

---

## API Client Patterns

### Extend `BaseClient` for each entity

```ts
import {
  BaseClient,
  BaseEntityDto,
  BaseCommonEntityDto,
  BaseFilterDto,
  DeleteDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";

class ProductsClient extends BaseClient<
  "products",       // table name
  ProductDto,
  ProductCommonDto,
  CreateProductDto,
  UpdateProductDto, // must extend DeleteDto
  ProductFilterDto,
  ProductImportPreviewDto
> {
  constructor(baseUrl: string) {
    super("products", baseUrl);
  }
}
```

### `BaseClient` provides these methods out of the box

| Method | Signature |
|--------|-----------|
| `get` | `(query?, filters?) => Promise<QueryResult<TDto>>` |
| `getById` | `(id: number) => Promise<TDto>` |
| `insert` | `(value: TAddDto) => Promise<TDto>` |
| `insertMany` | `(data: TAddDto[]) => Promise<TDto>` |
| `update` | `(value: TUpdateDto) => Promise<TDto>` |
| `softDelete` | `(ids: number[]) => Promise<number>` |
| `restore` | `(ids: number[]) => Promise<number>` |
| `export` | `(filters?) => Promise<TDto[]>` |
| `import` | `(data: ImportDto<TImportPreviewDto>) => Promise<number>` |

### Built-in auth refresh behavior (secured clients)

`APIClient` and `BaseClient` now include centralized refresh behavior for protected requests:

- Before a secured request, if `accessTokenExpiresAt` is expired (or about to expire), it refreshes once before sending the request.
- If a secured request returns `401`, it tries one refresh attempt and retries the request exactly once.
- Concurrent requests share a single in-flight refresh operation (mutex), preventing parallel refresh calls.
- If refresh fails, local auth storage is cleared (`user`, `remember`, `refreshToken`, `accessTokenExpiresAt`).
- Legacy fallback is preserved: if `refreshToken` or `accessTokenExpiresAt` is missing, requests behave as before.

You can customize auth storage keys centrally through `IManager`/`BaseClient` via `APIClientAuthConfig`.

```ts
import { IManager } from "@sito/dashboard-app";

const manager = new IManager(import.meta.env.VITE_API_URL, "user", {
  rememberKey: "remember",
  refreshTokenKey: "refreshToken",
  accessTokenExpiresAtKey: "accessTokenExpiresAt",
});
```

---

## Offline / IndexedDB Client

`IndexedDBClient` is a drop-in offline alternative to `BaseClient`. It has the **exact same generic parameters and method signatures** but persists data in the browser's IndexedDB instead of calling a remote API.

### When to use

Use it when the app must remain functional without network access — offline-capable dashboards, PWAs, or field apps. The typical pattern is to swap clients based on connectivity:

```ts
import { BaseClient, IndexedDBClient } from "@sito/dashboard-app";

const client = navigator.onLine
  ? new ProductsClient(apiUrl)        // remote REST
  : new ProductsIndexedDBClient();    // local IndexedDB
```

### Constructor

```ts
new IndexedDBClient(table: Tables, dbName: string, version?: number)
```

| Param | Description |
|-------|-------------|
| `table` | Object store name (equivalent to the table/route in `BaseClient`) |
| `dbName` | IndexedDB database name — use one shared name per app |
| `version` | Schema version — bump when adding new stores (default `1`) |

The object store is created automatically with `keyPath: "id"` and `autoIncrement: true` on first open.

### Extending for a specific entity

```ts
import { IndexedDBClient } from "@sito/dashboard-app";

class ProductsIndexedDBClient extends IndexedDBClient<
  "products",
  ProductDto,
  ProductCommonDto,
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
  ProductImportPreviewDto
> {
  constructor() {
    super("products", "my-app-db");
  }
}
```

### Reacting to connectivity changes at runtime

```ts
useEffect(() => {
  const goOnline  = () => setClient(new ProductsClient(apiUrl));
  const goOffline = () => setClient(new ProductsIndexedDBClient());
  window.addEventListener("online",  goOnline);
  window.addEventListener("offline", goOffline);
  return () => {
    window.removeEventListener("online",  goOnline);
    window.removeEventListener("offline", goOffline);
  };
}, []);
```

### Constraints

- Browser-only: do not instantiate in SSR or Node environments.
- Filtering in `get` / `export` / `commonGet` uses **exact equality** on each filter key — no range or partial-match queries.
- `import` with `override: false` uses `store.add` (throws on duplicate key); `override: true` uses `store.put` (upsert).

---

## Styling Rules

### Use Tailwind utilities from the consumer side

Tailwind is a peer dependency and the library exports CSS classes. In the consumer project:

- Configure `darkMode: 'class'` in `tailwind.config`
- Disable `preflight` to avoid conflicts: `corePlugins: { preflight: false }`
- Scan library source if needed: `content: ["./node_modules/@sito/dashboard-app/dist/**/*.js"]`

### State-aware utility functions

Use the utilities from `@sito/dashboard` (re-exported from this library) for dynamic class names:

```tsx
import { State, inputStateClassName, labelStateClassName } from "@sito/dashboard-app";

<input className={`text-input ${inputStateClassName(State.error)}`} />
<label className={`text-input-label ${labelStateClassName(State.error)}`} />
```

### CSS class conventions

- Layout classes follow BEM-like naming: `form-container`, `form-actions`, `text-input`, `text-input-label`
- State modifiers come from utility functions, not raw strings
- Use `peer` modifier pattern for floating label inputs

---

## Notification System

```tsx
import { useNotification } from "@sito/dashboard-app";

function MyComponent() {
  const { showSuccessNotification, showErrorNotification, showStackNotifications } =
    useNotification();

  const handleAction = async () => {
    try {
      await doSomething();
      showSuccessNotification({ body: "Done!" });
    } catch (error) {
      showErrorNotification({ body: "Something went wrong." });
    }
  };
}
```

---

## Auth Patterns

```tsx
import { useAuth } from "@sito/dashboard-app";

function MyComponent() {
  const { account, logUser, logoutUser, isInGuestMode } = useAuth();

  if (isInGuestMode()) return <GuestView />;
  return <UserView user={account} />;
}
```

Sign-in payload supports `rememberMe`:

```ts
import type { AuthDto } from "@sito/dashboard-app";

const credentials: AuthDto = {
  email: "user@mail.com",
  password: "secret",
  rememberMe: true,
};
```

`SessionDto` now includes refresh metadata:

```ts
import type { SessionDto } from "@sito/dashboard-app";
// includes: id, username, email, token, refreshToken?, accessTokenExpiresAt?
```

`AuthProvider` supports configurable storage keys (defaults shown):

```tsx
<AuthProvider
  user="user"
  remember="remember"
  refreshTokenKey="refreshToken"
  accessTokenExpiresAtKey="accessTokenExpiresAt"
>
  {children}
</AuthProvider>
```

When calling `logUser`, pass `rememberMe` from sign-in form when available:

```tsx
logUser(sessionDto, formValues.rememberMe);
```

---

## Routing Integration

The library is router-agnostic. Provide your router primitives via `ConfigProvider`:

```tsx
// React Router v6
import { useLocation, useNavigate, Link } from "react-router-dom";

<ConfigProvider
  location={useLocation()}
  navigate={(route) => {
    if (typeof route === "number") navigate(route);
    else navigate(route);
  }}
  linkComponent={Link}
/>
```

---

## Internationalization

The library uses an internal i18n system (`useTranslation` from `@sito/dashboard`).
Namespace keys used internally:

- `_accessibility:buttons.submit` / `_accessibility:buttons.cancel`
- `_accessibility:actions.retry`
- `_accessibility:errors.unknownError`
- `_accessibility:ariaLabels.*`
- `_pages:common.actions.*`

Consumer projects must provide translations for these namespaces.

---

## Agent Rules

1. **Always install peer dependencies.** Missing peers cause silent runtime failures.
2. **Always wrap with all required providers** in the correct order (see Provider Setup).
3. **Never import from internal paths** — only from `"@sito/dashboard-app"`.
4. **Always supply generic type parameters** — never use bare components or hooks without types when entity types are available.
5. **Extend base DTOs** (`BaseEntityDto`, `BaseFilterDto`, etc.) for all entity types.
6. **Extend `BaseClient`** for each API resource rather than writing raw fetch calls.
7. **Use `isValidationError` / `isHttpError`** type guards in error handling.
8. **Use provided hooks** (`useDeleteAction`, `usePostForm`, etc.) rather than reimplementing their logic.
9. **Use `useNotification`** for all user-facing success/error feedback — do not use `alert` or console-only logging.
10. **Respect the styling system** — use `State` enum and `*StateClassName` utilities for stateful inputs; do not override with inline styles.
11. **Do not add `any` types** — the library is fully typed; if types seem missing, check for the correct DTO or utility type.
12. **`IconButton` is overridden** — the export from this library wraps FontAwesome and expects `icon: IconDefinition`, not a React node.
13. **Use `IndexedDBClient` as offline fallback** — when building offline-capable features, extend `IndexedDBClient` instead of writing custom storage logic. It shares the same interface as `BaseClient`, so components and hooks that consume a client work without modification. Never instantiate `IndexedDBClient` in SSR/Node contexts.
14. **Sign-in should send `rememberMe` when the UI exposes a remember option.**
15. **Do not implement ad-hoc token refresh in consumer apps** — rely on the centralized refresh/retry behavior in `APIClient`/`BaseClient`.
16. **Keep auth storage key config aligned** — if custom keys are used in `AuthProvider`, configure the same keys in manager/client auth config (`rememberKey`, `refreshTokenKey`, `accessTokenExpiresAtKey`).
17. **Use `Error` in one mode at a time** — either default props (`error/message/icon/retry`) or `children` for custom content.
18. **Use `TabsLayout` navigation mode intentionally** — keep default links for route-driven tabs; use `useLinks={false}` (+ `tabButtonProps`) for local state tabs.
