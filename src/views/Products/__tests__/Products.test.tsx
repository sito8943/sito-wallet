import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const {
  mockUseProductsList,
  mockIsOnline,
  mockOpenAdd,
  mockRestore,
  mockHandleMutationError,
  mockUseRestoreDialog,
} = vi.hoisted(() => ({
  mockUseProductsList: vi.fn(),
  mockIsOnline: vi.fn(() => true),
  mockOpenAdd: vi.fn(),
  mockRestore: vi.fn(),
  mockHandleMutationError: vi.fn(),
  mockUseRestoreDialog: vi.fn(),
}));

const listResult = (items: object[]) => ({
  data: { pages: [{ items }] },
  isLoading: false,
  error: null,
  hasNextPage: false,
  isFetchingNextPage: false,
  fetchNextPage: vi.fn(),
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("hooks", () => ({
  ProductsQueryKeys: { all: () => ({ queryKey: ["products"] }) },
  RESTORE_NAME_IN_USE_KEY: "_entities:base.restore.nameInUse",
  useInfiniteProductsList: () => mockUseProductsList(),
  useMutationErrorHandler: () => mockHandleMutationError,
  useMobileNavbar: vi.fn(),
  useOnlineStatus: () => mockIsOnline(),
  useSwipeDeleteState: () => ({
    swipedId: null,
    openSwipe: vi.fn(),
    handleDialogClose: vi.fn(),
  }),
}));

// utils.ts pulls form helpers from lib; the page only needs the row mapper.
vi.mock("lib", () => ({
  photoToFormValues: vi.fn(),
  resolvePhotoPayload: vi.fn(),
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Products: { softDelete: vi.fn(), restore: mockRestore },
  }),
  useRegisterBottomNavAction: vi.fn(),
}));

vi.mock("views/Transactions", () => ({
  RecentTransactionsDialog: () => null,
  useCatalogTransactionsDialog: () => ({
    action: () => ({ id: "transactions" }),
    dialog: {},
  }),
}));

vi.mock("components", async () => ({
  ...(await vi.importActual<typeof import("../../../components/QueryError")>(
    "../../../components/QueryError",
  )),
  CatalogCard: ({
    name,
    subtitle,
    deletedAt,
    actions,
  }: {
    name: string;
    subtitle?: string | null;
    deletedAt?: Date | null;
    actions: { id: string; hidden?: boolean }[];
  }) => (
    <article data-deleted={String(!!deletedAt)}>
      <h3>{name}</h3>
      {subtitle && <p>{subtitle}</p>}
      <ul>
        {actions
          .filter((action) => !action.hidden)
          .map((action) => (
            <li key={action.id}>{action.id}</li>
          ))}
      </ul>
    </article>
  ),
}));

vi.mock("../components", () => ({
  AddProductDialog: () => null,
  EditProductDialog: () => null,
}));

vi.mock("../hooks", () => ({
  useAddProductDialog: () => ({ openDialog: mockOpenAdd }),
  useEditProductDialog: () => ({ openDialog: vi.fn() }),
}));

vi.mock("@sito/dashboard-app", () => ({
  ConfirmationDialog: () => null,
  GlobalActions: { Add: "add" },
  Page: ({ children }: { children: ReactNode }) => <main>{children}</main>,
  Error: ({ message, error }: { message?: string; error?: Error | null }) => (
    <p role="alert">{message ?? error?.message}</p>
  ),
  Empty: ({
    message,
    action,
  }: {
    message: string;
    action?: { tooltip: string; onClick: () => void };
  }) => (
    <div>
      <p>{message}</p>
      {action && (
        <button type="button" onClick={action.onClick}>
          {action.tooltip}
        </button>
      )}
    </div>
  ),
  PrettyGrid: ({
    data,
    emptyComponent,
    renderComponent,
  }: {
    data: { id: number }[];
    emptyComponent: ReactNode;
    renderComponent: (item: { id: number }) => ReactNode;
  }) =>
    data.length ? (
      <section>
        {data.map((item) => (
          <div key={item.id}>{renderComponent(item)}</div>
        ))}
      </section>
    ) : (
      emptyComponent
    ),
  useDeleteDialog: () => ({
    action: (record: { deletedAt?: Date | null }) => ({
      id: "delete",
      hidden: !!record.deletedAt,
    }),
    handleClose: vi.fn(),
  }),
  useRestoreDialog: (props: object) => {
    mockUseRestoreDialog(props);
    return {
      action: (record: { deletedAt?: Date | null }) => ({
        id: "restore",
        hidden: !record.deletedAt,
      }),
    };
  },
}));

import { Products } from "../Products";

describe("Products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOnline.mockReturnValue(true);
  });

  it("offers an add action from the empty state", () => {
    mockUseProductsList.mockReturnValue(listResult([]));

    render(<Products />);

    expect(screen.getByText("_pages:products.empty")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "_pages:products.add" }),
    );
    expect(mockOpenAdd).toHaveBeenCalledTimes(1);
  });

  it("shows the offline copy instead of a raw fetch failure", () => {
    mockUseProductsList.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new TypeError("Failed to fetch"),
    });

    render(<Products />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "_accessibility:errors.offline",
    );
    expect(screen.queryByText("Failed to fetch")).not.toBeInTheDocument();
  });

  it("keeps a server error message as is", () => {
    mockUseProductsList.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Product not found"),
    });

    render(<Products />);

    expect(screen.getByRole("alert")).toHaveTextContent("Product not found");
  });

  it("shows deleted products with restore instead of delete", () => {
    mockUseProductsList.mockReturnValue(
      listResult([
        {
          id: 1,
          name: "LECHE ENT. 1L",
          alias: "Leche",
          deletedAt: null,
        },
        {
          id: 2,
          name: "PAN",
          alias: null,
          deletedAt: new Date("2026-11-01T10:00:00Z"),
        },
      ]),
    );

    render(<Products />);

    const active = screen.getByText("Leche").closest("article");
    const deleted = screen.getByText("PAN").closest("article");

    expect(active).toHaveAttribute("data-deleted", "false");
    expect(screen.getByText("LECHE ENT. 1L")).toBeInTheDocument();
    expect(within(active as HTMLElement).getByText("delete")).toBeVisible();
    expect(
      within(active as HTMLElement).queryByText("restore"),
    ).not.toBeInTheDocument();

    expect(deleted).toHaveAttribute("data-deleted", "true");
    expect(within(deleted as HTMLElement).getByText("restore")).toBeVisible();
    expect(
      within(deleted as HTMLElement).queryByText("delete"),
    ).not.toBeInTheDocument();
  });

  it("restores through the products client and refreshes every products query", async () => {
    mockUseProductsList.mockReturnValue(listResult([]));
    mockRestore.mockResolvedValue(1);

    render(<Products />);

    const restoreProps = mockUseRestoreDialog.mock.calls[0][0] as {
      mutationFn: (ids: number[]) => Promise<number>;
      onError: (error: unknown) => void;
      queryKey: string[];
    };

    // "products" is the prefix of both the paged list and the /common picker.
    expect(restoreProps.queryKey).toEqual(["products"]);

    await restoreProps.mutationFn([2, 5]);
    expect(mockRestore).toHaveBeenCalledWith([2, 5]);

    const conflict = { status: 409, message: "restore.nameInUse" };
    restoreProps.onError(conflict);
    expect(mockHandleMutationError).toHaveBeenCalledWith(conflict, {
      uniqueKey: "_entities:base.restore.nameInUse",
    });
  });
});
