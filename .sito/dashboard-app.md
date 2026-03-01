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
| Base Library | @sito/dashboard | ^0.0.67 |

---

## Installation

```bash
npm install @sito/dashboard-app
```

All peer dependencies **must** be installed in the consumer project:

```bash
npm install \
  react@18.3.1 react-dom@18.3.1 \
  @sito/dashboard@^0.0.67 \
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
  AuthProvider,
  ManagerProvider,
  NotificationProvider,
  DrawerMenuProvider,
} from "@sito/dashboard-app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        location={window.location}
        navigate={(route) => { /* router navigate */ }}
        linkComponent={MyLinkComponent}
      >
        <AuthProvider>
          <ManagerProvider manager={myApiManagerInstance}>
            <NotificationProvider>
              <DrawerMenuProvider>
                {/* app routes */}
              </DrawerMenuProvider>
            </NotificationProvider>
          </ManagerProvider>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}
```

### Provider responsibilities

| Provider | Purpose |
|----------|---------|
| `ConfigProvider` | Injects router `location`, `navigate`, `linkComponent`, and optional `searchComponent` |
| `AuthProvider` | Manages session state: `account`, `logUser`, `logoutUser`, `logUserFromLocal` |
| `ManagerProvider` | Injects the API manager (`IManager`) consumed by hooks and components |
| `NotificationProvider` | Global toast notification system |
| `DrawerMenuProvider` | Dynamic drawer menu state |

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
| `TabsLayout` | Tabbed page layout |
| `PrettyGrid` | Data grid/table |
| `Empty` | Empty state placeholder |
| `Error` | Error display component |
| `Loading` / `SplashScreen` | Loading indicators |
| `IconButton` | FontAwesome-based icon button (overrides `@sito/dashboard`'s version) |

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
  constructor(api: APIClient) {
    super(api, "products");
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

The `SessionDto` shape:

```ts
import type { SessionDto } from "@sito/dashboard-app";
// contains: id, username, photo, token, roles, etc.
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
