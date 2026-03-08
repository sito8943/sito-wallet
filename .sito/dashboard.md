# @sito/dashboard — Agent Guide

> **Audience:** AI coding agents (Claude, Codex, etc.) working on this library or projects that consume it.
> This document is the single source of truth for how to use `@sito/dashboard` correctly.

---

## 0. Developer Workflow (agents working on the library itself)

**After every change, run the full validation suite before finishing:**

```bash
npm run full   # lint + build + test (all three in one command)
```

This covers ESLint, Prettier, TypeScript type-checking, the Vite bundle build, and Vitest tests.
Running it locally catches errors immediately and avoids costly follow-up fix cycles.

If you prefer to run steps individually:

```bash
npm run lint   # ESLint + Prettier + depcheck
npm run build  # Vite library build + type declarations
npm run test   # Vitest (run once, no watch)
```

> **Rule:** Never mark a task complete without a passing `npm run full`.

---

## 1. What This Library Is

`@sito/dashboard` is a **React 18/19 TypeScript component library** for building dashboard and admin UIs.
It provides a full component set (Table, Form inputs, Button, Tooltip, etc.) plus the React Context providers
needed to wire them together.

**Install:**

```bash
npm install @sito/dashboard
```

**Peer dependency:** `react` and `react-dom` ≥ 18.2.

---

## 2. Required Setup (Providers)

The library ships two mandatory providers. Wrap your app (or at minimum the page that uses the Table) with them.

### 2.1 `TranslationProvider`

Supplies the `t(key)` function used internally for all labels (empty states, pagination, filters, etc.).

```tsx
import { TranslationProvider } from "@sito/dashboard";

const translations: Record<string, string> = {
  "table.empty": "No records found",
  "table.loading": "Loading…",
  "table.rowsPerPage": "Rows per page",
  "table.of": "of",
  "filter.apply": "Apply",
  "filter.clear": "Clear",
  // add every key the library requests at runtime
};

function App() {
  return (
    <TranslationProvider t={(key) => translations[key] ?? key} language="en">
      {/* rest of your app */}
    </TranslationProvider>
  );
}
```

> **Rule:** `TranslationProvider` must wrap everything that uses library components. Omitting it throws
> `"translationContext must be used within a Provider"`.

### 2.2 `TableOptionsProvider`

Manages sorting, pagination, and filter state for a Table. One provider per table view.

```tsx
import { TableOptionsProvider, useTableOptions } from "@sito/dashboard";

function UsersPage() {
  return (
    <TableOptionsProvider>
      <UsersTable />
    </TableOptionsProvider>
  );
}

// Inside the table's parent component, consume options:
function UsersTable() {
  const { currentPage, pageSize, setTotal, sortingBy, sortingOrder, filters } =
    useTableOptions();

  // fetch data with these values and call setTotal(n) when you get the response
}
```

**Default values inside `TableOptionsProvider`:**

| State          | Default          |
| -------------- | ---------------- |
| `currentPage`  | `0`              |
| `pageSize`     | `20`             |
| `pageSizes`    | `[20,50,100]`    |
| `sortingBy`    | `"id"`           |
| `sortingOrder` | `SortOrder.DESC` |
| `filters`      | `{}`             |

---

## 3. Core Types

### `BaseDto`

Every row object passed to `Table` must satisfy this shape:

```ts
type BaseDto = {
  id: number;
  deletedAt?: string | Date | null; // soft-delete support
};
```

### `SortOrder`

```ts
enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
```

### `FilterTypes`

```ts
enum FilterTypes {
  text,
  number,
  select,
  autocomplete,
  date,
  check,
}
```

---

## 4. Table Component

The most complex component in the library. It is generic over `TRow extends BaseDto`.

```tsx
import { Table } from "@sito/dashboard";
import type { ColumnType, ActionType } from "@sito/dashboard";

interface User extends BaseDto {
  name: string;
  email: string;
  role: string;
}

const columns: ColumnType<User>[] = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
  {
    key: "role",
    label: "Role",
    renderBody: (value) => <Badge>{String(value)}</Badge>,
  },
];

const actions = (row: User): ActionType<User>[] => [
  {
    id: "edit",
    tooltip: "Edit",
    icon: <EditIcon />,
    onClick: (entity) => openEdit(entity),
  },
  {
    id: "delete",
    tooltip: "Delete",
    icon: <DeleteIcon />,
    onClick: (entity) => confirmDelete(entity),
    hidden: !!row.deletedAt, // hide for already-deleted rows
  },
];

<TableOptionsProvider>
  <Table<User>
    entity="user"
    title="Users"
    data={users}
    columns={columns}
    actions={actions}
    isLoading={loading}
    onSort={(prop, order) => refetch({ sortBy: prop, order })}
    toolbar={<Button onClick={openCreate}>New user</Button>}
  />
</TableOptionsProvider>;
```

### 4.1 All Table Props

| Prop                        | Type                                | Default       | Description                                        |
| --------------------------- | ----------------------------------- | ------------- | -------------------------------------------------- |
| `entity`                    | `string`                            | `""`          | Singular entity name (used for aria / i18n keys)   |
| `data`                      | `TRow[]`                            | —             | **Required.** Array of rows                        |
| `columns`                   | `ColumnType<TRow>[]`                | `[]`          | Column definitions                                 |
| `actions`                   | `(row: TRow) => ActionType<TRow>[]` | —             | Per-row action buttons                             |
| `isLoading`                 | `boolean`                           | `false`       | Shows spinner overlay                              |
| `title`                     | `string`                            | —             | Table header title                                 |
| `toolbar`                   | `ReactNode`                         | —             | Slot for toolbar content (buttons, search, etc.)   |
| `filterOptions`             | `FilterOptions`                     | —             | Global filter panel config                         |
| `softDeleteProperty`        | `keyof TRow`                        | `"deletedAt"` | Property checked for soft-delete styling           |
| `onSort`                    | `(prop, order) => void`             | —             | Called when a sortable column header is clicked    |
| `onRowSelect`               | `(row, selected) => void`           | —             | Called when a single row checkbox changes          |
| `onSelectedRowsChange`      | `(rows) => void`                    | —             | Called with the full selected-rows array           |
| `onRowExpand`               | `(row, collapsedRow) => ReactNode`  | —             | Return the expanded-row content; enables expansion |
| `onExpandedRowChange`       | `(expanded, collapsed) => void`     | —             | Called when expanded row changes                   |
| `expandedRowId`             | `TRow["id"] \| null`                | —             | Controlled expanded row (for external control)     |
| `allowMultipleExpandedRows` | `boolean`                           | `false`       | Allow more than one expanded row at a time         |
| `className`                 | `string`                            | `""`          | Added to the root wrapper                          |
| `contentClassName`          | `string`                            | `""`          | Added to the scrollable table body wrapper         |

### 4.2 `ColumnType<TRow>`

```ts
type ColumnType<TRow extends BaseDto> = {
  key: string; // must match a property name in TRow
  label?: string; // header label
  sortable?: boolean;
  sortOptions?: {
    icons: { className: string; asc: string; desc: string };
  };
  className?: string; // cell className
  display?: "visible" | "none";
  pos?: number; // column order (0-based)
  renderBody?: (value: unknown, row: TRow) => ReactNode; // custom cell renderer
  renderHead?: () => void; // custom header renderer
  filterOptions?: ColumnFilterOptions; // inline column filter
};

type ColumnFilterOptions = {
  type: FilterTypes;
  defaultValue?: unknown;
  label?: string;
  options?: Option[]; // required for select / autocomplete types
  multiple?: boolean;
  placeholder?: string;
};
```

### 4.3 `ActionType<TRow>`

```ts
type ActionType<TRow extends BaseDto> = {
  id: string;
  onClick: (entity?: TRow) => void;
  icon: ReactNode;
  tooltip: string;
  disabled?: boolean;
  hidden?: boolean;
  sticky?: boolean; // always visible next to the row (default: false → goes into ellipsis dropdown)
  multiple?: boolean; // show in multi-select bar
  onMultipleClick?: (rows: TRow[]) => void; // bulk action handler
};
```

**Sticky vs dropdown behavior (new in 0.0.67)**

When `actions()` returns a list, actions are split into two groups before rendering:

| `sticky` value | Rendering                                                                  |
| -------------- | -------------------------------------------------------------------------- |
| `true`         | Rendered directly as `IconButton`s next to the row (always visible)        |
| `false` / omit | Collected into an `ActionsDropdown` — an ellipsis button that opens a menu |

```tsx
const actions = (row: User): ActionType<User>[] => [
  {
    id: "edit",
    tooltip: "Edit",
    icon: <EditIcon />,
    onClick: (entity) => openEdit(entity),
    sticky: true, // always visible
  },
  {
    id: "delete",
    tooltip: "Delete",
    icon: <DeleteIcon />,
    onClick: (entity) => confirmDelete(entity),
    hidden: !!row.deletedAt, // hidden for already-deleted rows
    // sticky omitted → appears in the ellipsis dropdown
  },
];
```

> **Tip:** Return `hidden: true` from `actions()` to conditionally hide an action.
> The function receives the full row, so you can inspect any property.

### 4.4 Pagination

Pagination is handled internally by `TableOptionsProvider`. You only need to:

1. Read `currentPage`, `pageSize` from `useTableOptions()` to build your API request.
2. Call `setTotal(n)` with the total record count after receiving the response.

```tsx
const { currentPage, pageSize, setTotal } = useTableOptions();

useEffect(() => {
  fetchUsers({ page: currentPage, size: pageSize }).then(({ data, total }) => {
    setUsers(data);
    setTotal(total);
  });
}, [currentPage, pageSize]);
```

### 4.5 Filters

Filters can be defined per-column (`filterOptions` on `ColumnType`) or globally via `filterOptions` prop
on the `Table`. Both connect to the same `FiltersProvider` managed internally by `Table`.

Consume applied filter values through `useTableOptions`:

```tsx
const { filters } = useTableOptions();
// filters is a flat object: { name: "John", role: "admin" }
```

### 4.6 Expand Indicator Behavior

When `onRowExpand` is provided, each expandable row shows a chevron in the first visible column:

- `ChevronDown` (`↓`) when collapsed
- `ChevronUp` (`↑`) when expanded

The full row remains clickable for expand/collapse, while controls such as row checkbox and action buttons
keep stopping event propagation so they do not toggle expansion accidentally.

---

## 5. Actions Components

Three standalone components are exported for rendering action buttons outside of `Table`. They share the same `ActionType` shape used by the table.

### 5.1 `Action`

A single action button. Renders as an icon button or as an icon + label depending on `showText`.

```tsx
import { Action } from "@sito/dashboard";

<Action
  id="delete"
  icon={<DeleteIcon />}
  tooltip="Delete"
  onClick={() => confirmDelete()}
  showText // renders tooltip text next to the icon
/>;
```

### 5.2 `Actions`

Renders a `<ul>` list of `Action` buttons from an array.

```tsx
import { Actions } from "@sito/dashboard";

<Actions
  actions={[
    { id: "edit", icon: <EditIcon />, tooltip: "Edit", onClick: openEdit },
    {
      id: "delete",
      icon: <DeleteIcon />,
      tooltip: "Delete",
      onClick: confirmDelete,
    },
  ]}
  showActionTexts // show label text (default: false = icon-only)
  showTooltips // default: true
/>;
```

### 5.3 `ActionsDropdown`

Wraps `Actions` in a `Dropdown` triggered by an ellipsis (`⋮`) `IconButton`. This is the same component the `Table` uses for non-sticky actions.

```tsx
import { ActionsDropdown } from "@sito/dashboard";

<ActionsDropdown
  actions={[
    {
      id: "archive",
      icon: <ArchiveIcon />,
      tooltip: "Archive",
      onClick: archive,
    },
    {
      id: "export",
      icon: <ExportIcon />,
      tooltip: "Export",
      onClick: doExport,
    },
  ]}
/>;
```

When `ActionsDropdown` is used inside `Table` rows, opening or clicking the actions trigger/menu does **not**
expand or collapse the row.

---

## 6. Form Components

All form components share a common base interface:

```ts
type BaseInputPropsType<TValue> = {
  value: TValue;
  state?: "default" | "error" | "good";
  label?: string;
  helperText?: string;
  placeholder?: string;
  name?: string;
  id?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  helperTextClassName?: string;
};
```

### 6.1 `TextInput`

```tsx
import { TextInput } from "@sito/dashboard";

<TextInput
  label="Email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  state={errors.email ? "error" : "default"}
  helperText={errors.email}
  placeholder="user@example.com"
/>;
```

Supports `forwardRef`.

### 6.2 `SelectInput`

```tsx
import { SelectInput } from "@sito/dashboard";
import type { Option } from "@sito/dashboard";

const options: Option[] = [
  { value: "admin", label: "Admin" },
  { value: "viewer", label: "Viewer" },
];

<SelectInput
  label="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
  options={options}
/>;
```

### 6.3 `AutocompleteInput`

```tsx
import { AutocompleteInput } from "@sito/dashboard";

<AutocompleteInput
  label="Country"
  value={country}
  onChange={setCountry}
  options={countryOptions}
  placeholder="Search…"
/>;
```

### 6.4 `CheckInput`

```tsx
import { CheckInput } from "@sito/dashboard";

<CheckInput
  label="Active"
  value={isActive}
  onChange={(e) => setIsActive(e.target.checked)}
/>;
```

### 6.5 `FileInput`

```tsx
import { FileInput } from "@sito/dashboard";

<FileInput
  label="Upload CSV"
  value={file}
  onChange={(file) => setFile(file)}
  accept=".csv"
/>;
```

---

## 7. Button & IconButton

```tsx
import { Button, IconButton } from "@sito/dashboard";

// Variants: "text" | "submit" | "outlined"   (default: "text")
// Colors: "default" | "primary" | "secondary" | "error" | "warning" | "success" | "info"

<Button variant="submit" color="primary" onClick={save}>
  Save
</Button>

<Button variant="outlined" color="error" onClick={cancel}>
  Cancel
</Button>

<IconButton color="primary" onClick={openMenu}>
  <MenuIcon />
</IconButton>
```

All native `<button>` HTML attributes are supported (they are spread through).

---

## 8. Chip

```tsx
import { Chip } from "@sito/dashboard";

<Chip onDelete={() => removeTag(tag)}>{tag.label}</Chip>;
```

---

## 9. Dropdown

The Dropdown renders its content into `document.body` via a React portal and positions itself
relative to an `anchorEl`. It is a **controlled** component — the parent owns the `open` state.

```tsx
import { Dropdown } from "@sito/dashboard";
import { useRef, useState } from "react";

function MyMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button ref={triggerRef} onClick={() => setOpen((v) => !v)}>
        Open menu
      </button>
      <Dropdown
        open={open}
        onClose={() => setOpen(false)}
        anchorEl={triggerRef.current}
      >
        <ul role="menu">
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>
      </Dropdown>
    </>
  );
}
```

**Props:**

| Prop       | Type                  | Required | Description                               |
| ---------- | --------------------- | -------- | ----------------------------------------- |
| `open`     | `boolean`             | Yes      | Controls visibility                       |
| `onClose`  | `() => void`          | Yes      | Called on click-outside or Escape key     |
| `anchorEl` | `HTMLElement \| null` | No       | Anchor element used for smart positioning |
| `children` | `ReactNode`           | Yes      | Dropdown content                          |

Smart positioning: aligns below the anchor by default, flips up/left if it would overflow the viewport.
Repositions automatically on window resize while open.

---

## 10. Tooltip

```tsx
import { Tooltip } from "@sito/dashboard";

<Tooltip content="Delete this record">
  <IconButton onClick={deleteRow}>
    <DeleteIcon />
  </IconButton>
</Tooltip>;
```

Injects `aria-describedby` on the child using `cloneElement`. Child must accept HTML attributes.

---

## 11. Loading

```tsx
import { Loading } from "@sito/dashboard";

<Loading className="my-spinner" />;
```

Pure SVG spinner. Accepts `className`, `color`, and `strokeWidth`.

---

## 12. Badge

```tsx
import { Badge } from "@sito/dashboard";

<Badge className="status-badge">3</Badge>;
```

---

## 13. Complete Page Example

```tsx
import {
  Table,
  TableOptionsProvider,
  TranslationProvider,
  Button,
  useTableOptions,
} from "@sito/dashboard";
import type { BaseDto, ColumnType, ActionType } from "@sito/dashboard";
import { useEffect, useState } from "react";

interface Product extends BaseDto {
  name: string;
  price: number;
  stock: number;
  deletedAt?: string | null;
}

const translations = {
  "table.empty": "No products found",
  // …
};

const columns: ColumnType<Product>[] = [
  { key: "name", label: "Product", sortable: true },
  { key: "price", label: "Price", renderBody: (v) => `$${v}` },
  { key: "stock", label: "Stock" },
];

function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const { currentPage, pageSize, sortingBy, sortingOrder, filters, setTotal } =
    useTableOptions();

  useEffect(() => {
    setLoading(true);
    fetchProducts({ currentPage, pageSize, sortingBy, sortingOrder, filters })
      .then(({ data, total }) => {
        setProducts(data);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }, [currentPage, pageSize, sortingBy, sortingOrder, filters]);

  const actions = (row: Product): ActionType<Product>[] => [
    {
      id: "edit",
      tooltip: "Edit",
      icon: <EditIcon />,
      onClick: (p) => openEditModal(p),
    },
    {
      id: "delete",
      tooltip: "Delete",
      icon: <DeleteIcon />,
      onClick: (p) => deleteProduct(p),
      hidden: !!row.deletedAt,
    },
  ];

  return (
    <Table<Product>
      entity="product"
      title="Products"
      data={products}
      columns={columns}
      actions={actions}
      isLoading={loading}
      onSort={(prop, order) => {
        /* optional: trigger refetch */
      }}
      toolbar={
        <Button variant="submit" color="primary">
          Add Product
        </Button>
      }
    />
  );
}

export default function ProductsPage() {
  return (
    <TranslationProvider t={(k) => translations[k] ?? k} language="en">
      <TableOptionsProvider>
        <ProductsTable />
      </TableOptionsProvider>
    </TranslationProvider>
  );
}
```

---

## 14. Rules & Pitfalls

| Rule                                                                                                   | Why                                                                                |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| Always wrap the app in `TranslationProvider`                                                           | Missing it throws a runtime error                                                  |
| Wrap each table view in `TableOptionsProvider`                                                         | Pagination/sort/filter state is per-provider                                       |
| Row objects **must** have an `id: number` field                                                        | `Table` keys rows by `id`                                                          |
| Pass `isLoading` while fetching                                                                        | Table shows spinner; do not pass an empty `data=[]` while loading without this     |
| Re-fetch when `currentPage`, `pageSize`, `sortingBy`, `sortingOrder`, or `filters` change              | These are the only source of truth for query params                                |
| `actions()` receives the row — use it for conditional `hidden`/`disabled`                              | Avoids stale closures                                                              |
| In expandable rows, the actions dropdown trigger should not toggle row expansion                       | Trigger/menu clicks stop propagation from reaching the row click handler           |
| `softDeleteProperty` defaults to `"deletedAt"` — rows with a truthy value there are styled differently | Override with `softDeleteProperty="archivedAt"` if your model uses a different key |
| Do **not** manage pagination state yourself                                                            | `TableOptionsProvider` owns it; read-only access via `useTableOptions()`           |

---

## 15. Exports Reference

```ts
// Components
export { Action, Actions, ActionsDropdown }; // standalone action primitives
export { Table, Button, IconButton, Chip, Dropdown, Tooltip, Loading, Badge };
export { TextInput, SelectInput, AutocompleteInput, CheckInput, FileInput };
export type { Option }; // used by SelectInput / AutocompleteInput

// Providers & hooks
export { TranslationProvider, useTranslation };
export { TableOptionsProvider, useTableOptions };

// Types
export type { BaseDto };
export type { ColumnType, ColumnFilterOptions };
export type { ActionType, TablePropsType };
export type { ActionsContainerPropsType, ActionPropsType }; // Actions component types
export type { ButtonPropsType, ButtonBaseProps };
export type { TextInputPropsType, BaseInputPropsType };
export type { TooltipPropsType };

// Enums / values
export { FilterTypes };
export { SortOrder };
export type { FilterType, FiltersValue, WidgetFilterProps };
```

---

## 16. Styling Notes

- The library bundles its own CSS (Tailwind utilities compiled to atomic classes).
- **Do not** import Tailwind into the consuming project in a way that would purge library classes.
- Dark mode is supported via the `dark` class on `<html>` or `<body>` (`darkMode: "class"` strategy).
- All components accept `className` / `containerClassName` / `inputClassName` for overrides.
- Custom colors are available via CSS custom properties defined in `base-colors.css` (bundled automatically).

---

## 17. Storybook Scenarios

- `WithPagination`: exercises page navigation and page-size switching with in-memory paged data.
- `WithCompleteFeatures`: combines sticky + dropdown row actions, pagination, single-row expansion, and column filters in one scenario.

---

_Last updated: 2026-03-08 — library version 0.0.68_
