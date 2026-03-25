# Consumer Guide for `@sito/dashboard-app`

Guide intended for projects that consume the library, focused on providers, components, props, and usage patterns.

## 1. Installation

```bash
npm install @sito/dashboard-app
```

Install peer dependencies in the consumer project as well:

```bash
npm install \
  react@18.3.1 react-dom@18.3.1 \
  @sito/dashboard@^0.0.72 \
  @tanstack/react-query@5.83.0 \
  react-hook-form@7.61.1 \
  @fortawesome/fontawesome-svg-core@7.0.0 \
  @fortawesome/free-solid-svg-icons@7.0.0 \
  @fortawesome/free-regular-svg-icons@7.0.0 \
  @fortawesome/free-brands-svg-icons@7.0.0 \
  @fortawesome/react-fontawesome@0.2.3
```

## 2. Required Providers

Recommended order:

1. `ConfigProvider`
2. `ManagerProvider`
3. `AuthProvider`
4. `NotificationProvider`
5. `DrawerMenuProvider`
6. `NavbarProvider` (if you use dynamic navbar state)

`ManagerProvider` already mounts an internal `QueryClientProvider`.
By default, each `ManagerProvider` instance creates its own isolated `QueryClient`.
If you need custom React Query defaults, or you intentionally want multiple trees to share cache state, pass your own client with `queryClient={queryClient}`.

```tsx
import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AuthProvider,
  ConfigProvider,
  DrawerMenuProvider,
  IManager,
  ManagerProvider,
  NavbarProvider,
  NotificationProvider,
} from "@sito/dashboard-app";

const authStorageKeys = {
  user: "user",
  remember: "remember",
  refreshTokenKey: "refreshToken",
  accessTokenExpiresAtKey: "accessTokenExpiresAt",
};

const manager = new IManager(
  import.meta.env.VITE_API_URL,
  authStorageKeys.user,
  {
    rememberKey: authStorageKeys.remember,
    refreshTokenKey: authStorageKeys.refreshTokenKey,
    accessTokenExpiresAtKey: authStorageKeys.accessTokenExpiresAtKey,
  },
);

export function AppProviders({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ConfigProvider
      location={location}
      navigate={(route) => {
        if (typeof route === "number") navigate(route);
        else navigate(route);
      }}
      linkComponent={Link}
    >
      <ManagerProvider manager={manager}>
        <AuthProvider
          user={authStorageKeys.user}
          remember={authStorageKeys.remember}
          refreshTokenKey={authStorageKeys.refreshTokenKey}
          accessTokenExpiresAtKey={authStorageKeys.accessTokenExpiresAtKey}
        >
          <NotificationProvider>
            <DrawerMenuProvider>
              <NavbarProvider>{children}</NavbarProvider>
            </DrawerMenuProvider>
          </NotificationProvider>
        </AuthProvider>
      </ManagerProvider>
    </ConfigProvider>
  );
}
```

## 3. Core Integration Rules

1. Always import from `@sito/dashboard-app`.
2. Never import from internal paths (`src/...`).
3. Use generics in entity-driven components/hooks.
4. Avoid `any`; extend base DTOs (`BaseEntityDto`, `BaseFilterDto`, etc).
5. Do not implement custom token refresh in the consumer app; use `IManager`/`BaseClient`.

## 4. Key Components and Props

| Component                | Key props                                                                                     | Recommended usage                                  |
| ------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| `Page<T>`                | `title`, `actions`, `addOptions`, `filterOptions`, `queryKey`, `isLoading`                    | CRUD layout with standard header/actions           |
| `PageHeader<T>`          | `title`, `actions`, `showBackButton`                                                          | Reusable page header with desktop/mobile actions   |
| `FormContainer<TForm>`   | `handleSubmit`, `onSubmit`, `reset`, `isLoading`, `buttonEnd`                                 | Form wrapper with built-in submit/cancel           |
| `ParagraphInput`         | `label`, `state`, `containerClassName`, `inputClassName`, `helperText`                        | Textarea with state-aware styling                  |
| `PasswordInput`          | `TextInputPropsType`                                                                          | Password input with show/hide toggle               |
| `TabsLayout`             | `tabs`, `defaultTab`, `currentTab`, `onTabChange`, `useLinks`, `tabButtonProps`               | Route tabs or local state tabs                     |
| `Onboarding`             | `steps`                                                                                       | Multi-step flow using controlled `TabsLayout`      |
| `PrettyGrid<T>`          | `data`, `renderComponent`, `hasMore`, `onLoadMore`, `className`, `itemClassName`              | Grid with empty state and optional infinite scroll |
| `Error`                  | Default mode (`error`, `message`, `onRetry`) or custom mode (`children`)                      | Reusable error fallback                            |
| `Dialog`                 | `open`, `title`, `handleClose`, `containerClassName`, `className`                             | Base modal                                         |
| `FormDialog<TForm>`      | `Dialog` props + `FormContainer` props + `extraActions`                                       | Form modal with optional secondary footer actions  |
| `ConfirmationDialog`     | `open`, `title`, `handleSubmit`, `handleClose`, `isLoading`, `extraActions`                   | Basic confirmation flows                           |
| `ImportDialog<TPreview>` | `fileProcessor`, `onFileProcessed`, `renderCustomPreview`, `onOverrideChange`, `extraActions` | Import with preview + override                     |
| `Drawer<MenuKeys>`       | `open`, `onClose`, `menuMap`, `logo`                                                          | Side navigation                                    |
| `Navbar`                 | `openDrawer`, `menuButtonProps`, `showSearch`                                                 | Top bar with dynamic title/actions                 |
| `ToTop`                  | `threshold`, `tooltip`, `scrollOnClick`, `className`                                          | Floating scroll-to-top button                      |
| `IconButton`             | `icon: IconDefinition` + visual props                                                         | FontAwesome-only icon contract                     |

## 5. Frequent Usage Examples

### 5.1 `TabsLayout`: local state tabs

```tsx
import { useState } from "react";
import { TabsLayout } from "@sito/dashboard-app";

const tabs = [
  { id: 1, label: "General", content: <div>General</div> },
  { id: 2, label: "Security", content: <div>Security</div> },
];

export function SettingsTabs() {
  const [tab, setTab] = useState(1);

  return (
    <TabsLayout
      tabs={tabs}
      currentTab={tab}
      onTabChange={(id) => setTab(Number(id))}
      useLinks={false}
      tabButtonProps={{ variant: "outlined", color: "secondary" }}
    />
  );
}
```

### 5.2 `Error`: use only one mode at a time

```tsx
import { Error } from "@sito/dashboard-app";

<Error error={error} onRetry={() => refetch()} />;

<Error>
  <CustomErrorPanel />
</Error>;
```

### 5.3 `PrettyGrid`: infinite scroll

```tsx
import { PrettyGrid, Loading } from "@sito/dashboard-app";

<PrettyGrid<ProductDto>
  data={products}
  loading={isLoading}
  renderComponent={(item) => <ProductCard item={item} />}
  hasMore={hasMore}
  loadingMore={isFetchingNextPage}
  onLoadMore={fetchNextPage}
  loadMoreComponent={<Loading className="!w-auto" loaderClass="w-5 h-5" />}
/>;
```

### 5.4 `ImportDialog`: custom preview

```tsx
import { ImportDialog } from "@sito/dashboard-app";

<ImportDialog<ProductImportPreviewDto>
  open={open}
  title="Import products"
  handleClose={close}
  handleSubmit={submit}
  fileProcessor={parseFile}
  renderCustomPreview={(items) => <ProductsPreviewTable items={items ?? []} />}
/>;
```

### 5.5 `useNavbar`: dynamic title and right slot

```tsx
import { useEffect } from "react";
import { useNavbar } from "@sito/dashboard-app";

export function ProductsPage() {
  const { setTitle, setRightContent } = useNavbar();

  useEffect(() => {
    setTitle("Products");
    setRightContent(<button>Export</button>);
    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);

  return <div>...</div>;
}
```

### 5.6 Dialogs with `extraActions`

```tsx
import type { ButtonPropsType } from "@sito/dashboard-app";
import { ConfirmationDialog, FormDialog } from "@sito/dashboard-app";

const extraActions: ButtonPropsType[] = [
  {
    id: "save-draft",
    type: "button",
    variant: "outlined",
    color: "secondary",
    children: "Save draft",
    onClick: () => saveDraft(),
  },
];

<ConfirmationDialog
  open={open}
  title="Confirm change"
  handleSubmit={confirm}
  handleClose={close}
  extraActions={extraActions}
/>;

<FormDialog<ProductForm> {...dialog} extraActions={extraActions}>
  {/* fields */}
</FormDialog>;
```

Use `type: "button"` in `FormDialog` extra actions unless you want them to submit the form.

## 6. High-Level Hooks

### 6.1 Action hooks

```tsx
import { useDeleteAction, useEditAction } from "@sito/dashboard-app";

const { action: deleteAction } = useDeleteAction({
  onClick: (ids) => softDelete(ids),
});

const { action: editAction } = useEditAction({
  onClick: (id) => openEdit(id),
});
```

### 6.2 Dialog hooks

```tsx
import { useDeleteDialog } from "@sito/dashboard-app";

const deleteDialog = useDeleteDialog({
  queryKey: ["products"],
  mutationFn: (ids) => api.products.softDelete(ids),
});
```

`useFormDialog` is now the generic dialog-form lifecycle hook and also supports local/state-only forms (filters, settings, feature flags).
For CRUD persistence, prefer wrappers:

- `usePostDialog`: create flow (no `get` by id).
- `usePutDialog`: edit flow (`getFunction` + mutate).

```tsx
import {
  FormDialog,
  useFormDialog,
  usePostDialog,
  usePutDialog,
} from "@sito/dashboard-app";

// 1) Local/state-only dialog (filters)
const filtersDialog = useFormDialog<never, never, never, ProductFilters>({
  mode: "state",
  title: "Filters",
  defaultValues: { search: "", minPrice: 0 },
  reinitializeOnOpen: true,
  mapIn: () => tableFilters,
  onSubmit: (values) => setTableFilters(values),
});

// 2) Create dialog (POST)
const createDialog = usePostDialog<CreateProductDto, ProductDto, ProductForm>({
  title: "Create product",
  defaultValues: { name: "", price: 0 },
  mutationFn: (dto) => api.products.insert(dto),
  mapOut: (values) => ({ name: values.name, price: values.price }),
  queryKey: ["products"],
});

// 3) Edit dialog (PUT)
const editDialog = usePutDialog<
  ProductDto,
  UpdateProductDto,
  ProductDto,
  ProductForm
>({
  title: "Edit product",
  defaultValues: { name: "", price: 0 },
  getFunction: (id) => api.products.getById(id),
  dtoToForm: (dto) => ({ name: dto.name, price: dto.price }),
  mutationFn: (dto) => api.products.update(dto),
  mapOut: (values, dto) => ({ id: dto?.id ?? 0, ...values }),
  queryKey: ["products"],
});

<FormDialog<ProductForm> {...createDialog}>{/* fields */}</FormDialog>;
```

Compatibility note:

- The previous entity-coupled `useFormDialog` signature still works for transition.
- New code should use `usePostDialog` and `usePutDialog` for remote CRUD.

### 6.3 Form hooks

```tsx
import { FormContainer, usePostForm } from "@sito/dashboard-app";

const formProps = usePostForm<
  ProductDto,
  CreateProductDto,
  ProductDto,
  ProductFormValues
>({
  defaultValues: { name: "", price: 0 },
  mutationFn: (data) => api.products.insert(data),
  queryKey: ["products"],
});

<FormContainer {...formProps}>{/* inputs */}</FormContainer>;
```

## 7. Typed API clients

### 7.1 Remote client with `BaseClient`

```ts
import {
  BaseClient,
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

interface ProductCommonDto extends BaseCommonEntityDto {
  name: string;
}

interface ProductFilterDto extends BaseFilterDto {
  category?: string;
}

interface ProductUpdateDto extends DeleteDto {
  name?: string;
  price?: number;
}

class ProductsClient extends BaseClient<
  "products",
  ProductDto,
  ProductCommonDto,
  Omit<ProductDto, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ProductUpdateDto,
  ProductFilterDto,
  ImportPreviewDto
> {
  constructor(baseUrl: string) {
    super("products", baseUrl);
  }
}
```

### 7.2 Offline fallback with `IndexedDBClient`

```ts
import { IndexedDBClient } from "@sito/dashboard-app";

class ProductsIndexedDBClient extends IndexedDBClient<
  "products",
  ProductDto,
  ProductCommonDto,
  Omit<ProductDto, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ProductUpdateDto,
  ProductFilterDto,
  ImportPreviewDto
> {
  constructor() {
    super("products", "my-app-db");
  }
}
```

## 8. Auth and notifications

### 8.1 Auth

```tsx
import { useAuth } from "@sito/dashboard-app";

const { account, logUser, logoutUser, isInGuestMode } = useAuth();
```

When your login UI has a "remember me" option, pass `rememberMe` in the auth payload.

### 8.2 Notifications

```tsx
import { useNotification } from "@sito/dashboard-app";

const { showSuccessNotification, showErrorNotification } = useNotification();

showSuccessNotification({ message: "Saved" });
showErrorNotification({ message: "Something failed" });
```

## 9. Styling, theme variables, CSS classes

Full token and CSS override reference is available at:

- `docs/THEME_AND_CSS.md`

## 10. Minimum i18n coverage

Make sure your app provides these namespaces/keys:

1. `_accessibility:buttons.*`
2. `_accessibility:ariaLabels.*`
3. `_accessibility:errors.*`
4. `_accessibility:actions.retry`
5. `_pages:common.actions.*`

`Onboarding` uses `steps` passed as props, not internal onboarding translation keys.
