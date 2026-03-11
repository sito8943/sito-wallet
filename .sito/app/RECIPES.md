# Integration Recipes for `@sito/dashboard-app`

Copy-ready recipes for consumer projects.

## 1. Base app shell (Navbar + Drawer + Notification + ToTop)

```tsx
import { useMemo, useState } from "react";
import { faBox, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Drawer,
  MenuItemType,
  Navbar,
  Notification,
  ToTop,
} from "@sito/dashboard-app";

type AppPages = "home" | "products";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuMap = useMemo<MenuItemType<AppPages>[]>(
    () => [
      {
        page: "home",
        path: "/",
        icon: <FontAwesomeIcon icon={faHouse} />,
        type: "menu",
      },
      {
        page: "products",
        path: "/products",
        icon: <FontAwesomeIcon icon={faBox} />,
        type: "menu",
      },
    ],
    [],
  );

  return (
    <>
      <Navbar openDrawer={() => setDrawerOpen(true)} showSearch />
      <Drawer<AppPages>
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        menuMap={menuMap}
      />

      {/* Mount global notifications once */}
      <Notification />

      <main>{children}</main>
      <ToTop threshold={160} tooltip="Back to top" />
    </>
  );
}
```

## 2. CRUD page with `Page`, `PrettyGrid`, actions, and dialogs

```tsx
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ConfirmationDialog,
  Page,
  PrettyGrid,
  useDeleteDialog,
  useEditAction,
  useRestoreDialog,
  type BaseEntityDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

const QUERY_KEY = ["products"];

export function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => api.products.get(),
  });

  const deleteDialog = useDeleteDialog({
    queryKey: QUERY_KEY,
    mutationFn: (ids) => api.products.softDelete(ids),
  });

  const restoreDialog = useRestoreDialog({
    queryKey: QUERY_KEY,
    mutationFn: (ids) => api.products.restore(ids),
  });

  const { action: editAction } = useEditAction({
    onClick: (id) => openEditDialog(id),
  });

  const rows = data?.items ?? [];

  const rowActions = useMemo(
    () => (item: ProductDto) => [
      editAction(item),
      deleteDialog.action(item),
      restoreDialog.action(item),
    ],
    [deleteDialog, editAction, restoreDialog],
  );

  return (
    <>
      <Page<ProductDto>
        title="Products"
        isLoading={isLoading}
        queryKey={QUERY_KEY}
        addOptions={{ onClick: () => openCreateDialog() }}
      >
        <PrettyGrid<ProductDto>
          data={rows}
          renderComponent={(item) => (
            <ProductCard item={item} actions={rowActions(item)} />
          )}
        />
      </Page>

      <ConfirmationDialog
        open={deleteDialog.open}
        title={deleteDialog.title}
        isLoading={deleteDialog.isLoading}
        handleClose={deleteDialog.handleClose}
        handleSubmit={deleteDialog.handleSubmit}
      >
        Are you sure you want to delete the selected items?
      </ConfirmationDialog>

      <ConfirmationDialog
        open={restoreDialog.open}
        title={restoreDialog.title}
        isLoading={restoreDialog.isLoading}
        handleClose={restoreDialog.handleClose}
        handleSubmit={restoreDialog.handleSubmit}
      >
        Are you sure you want to restore the selected items?
      </ConfirmationDialog>
    </>
  );
}
```

## 3. Create/edit form modal with `useFormDialog` + `FormDialog`

```tsx
import { useState } from "react";
import { Controller } from "react-hook-form";
import {
  FormDialog,
  useFormDialog,
  type BaseEntityDto,
  type DeleteDto,
} from "@sito/dashboard-app";

type ProductForm = {
  name: string;
  price: number;
};

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

type UpsertProductDto = DeleteDto & ProductForm;

export function ProductUpsertDialog() {
  const [selectedProductId] = useState(0);

  const formDialog = useFormDialog<ProductDto, UpsertProductDto, ProductDto, ProductForm>({
    title: "Edit product",
    queryKey: ["products"],
    defaultValues: { name: "", price: 0 },
    getFunction: (id) => api.products.getById(id),
    dtoToForm: (dto) => ({ name: dto.name, price: dto.price }),
    formToDto: (form) => ({ id: selectedProductId, ...form }),
    mutationFn: (dto) => api.products.update(dto),
    onSuccessMessage: "Product saved",
  });

  return (
    <FormDialog<ProductForm> {...formDialog}>
      <Controller
        name="name"
        control={formDialog.control}
        rules={{ required: true }}
        render={({ field }) => <input {...field} className="text-input" placeholder="Name" />}
      />
      <Controller
        name="price"
        control={formDialog.control}
        rules={{ required: true, min: 0 }}
        render={({ field }) => (
          <input {...field} type="number" className="text-input" placeholder="Price" />
        )
      />
    </FormDialog>
  );
}
```

## 4. Import with custom preview using `useImportDialog`

```tsx
import {
  ImportDialog,
  useImportDialog,
  type BaseEntityDto,
  type ImportPreviewDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

interface ProductImportPreviewDto extends ImportPreviewDto {
  id: number;
  name: string;
  price: number;
}

export function ProductsImport() {
  const importDialog = useImportDialog<ProductDto, ProductImportPreviewDto>({
    queryKey: ["products"],
    entity: "products",
    mutationFn: (payload) => api.products.import(payload),
    fileProcessor: (file, options) =>
      parseProductsCsv(file, options?.override ?? false),
    renderCustomPreview: (items) => (
      <ProductsPreviewTable items={items ?? []} />
    ),
  });

  return (
    <>
      <button type="button" onClick={() => importDialog.action().onClick?.()}>
        Import
      </button>

      <ImportDialog<ProductImportPreviewDto> {...importDialog} />
    </>
  );
}
```

## 5. Ready-to-use export action with `useExportActionMutate`

```tsx
import {
  Page,
  useExportActionMutate,
  type BaseEntityDto,
} from "@sito/dashboard-app";

interface ProductDto extends BaseEntityDto {
  name: string;
  price: number;
}

export function ProductsHeaderActions() {
  const exportProducts = useExportActionMutate<ProductDto[], "products", Error>(
    {
      entity: "products",
      mutationFn: () => api.products.export(),
      onSuccessMessage: "Export generated",
    },
  );

  return (
    <Page<ProductDto> title="Products" actions={[exportProducts.action()]}>
      {/* ... */}
    </Page>
  );
}
```

## 6. Offline fallback with `BaseClient` / `IndexedDBClient`

```tsx
import { useEffect, useState } from "react";

type ProductClient = ProductsClient | ProductsIndexedDBClient;

export function useProductsClient(apiUrl: string) {
  const [client, setClient] = useState<ProductClient>(() =>
    navigator.onLine
      ? new ProductsClient(apiUrl)
      : new ProductsIndexedDBClient(),
  );

  useEffect(() => {
    const onOnline = () => setClient(new ProductsClient(apiUrl));
    const onOffline = () => setClient(new ProductsIndexedDBClient());

    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, [apiUrl]);

  return client;
}
```

## 7. Dynamic navbar title/slot with `useNavbar`

```tsx
import { useEffect } from "react";
import { useNavbar } from "@sito/dashboard-app";

export function OrdersPage() {
  const { setTitle, setRightContent } = useNavbar();

  useEffect(() => {
    setTitle("Orders");
    setRightContent(<button type="button">New order</button>);

    return () => {
      setTitle("");
      setRightContent(null);
    };
  }, [setTitle, setRightContent]);

  return <div>...</div>;
}
```

## 8. Recipe usage recommendations

1. Use the same `queryKey` between listing and dialogs for consistent invalidation.
2. Prefer theme variables and `className` props for visual customization.
3. Keep recipes in small modules (`app-shell`, `pages`, `dialogs`, `clients`).
