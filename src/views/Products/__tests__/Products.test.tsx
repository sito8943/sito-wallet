import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

const { mockUseProductsCommon, mockIsOnline, mockOpenAdd } = vi.hoisted(() => ({
  mockUseProductsCommon: vi.fn(),
  mockIsOnline: vi.fn(() => true),
  mockOpenAdd: vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("hooks", () => ({
  ProductsQueryKeys: { all: () => ({ queryKey: ["products"] }) },
  useProductsCommon: () => mockUseProductsCommon(),
  useMobileNavbar: vi.fn(),
  useOnlineStatus: () => mockIsOnline(),
  useSwipeDeleteState: () => ({
    swipedId: null,
    openSwipe: vi.fn(),
    handleDialogClose: vi.fn(),
  }),
}));

vi.mock("providers", () => ({
  useManager: () => ({ Products: { softDelete: vi.fn() } }),
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
  CatalogCard: ({ name }: { name: string }) => <article>{name}</article>,
  toCatalogRow: (item: object) => ({ ...item, deletedAt: null }),
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
    action: () => ({ id: "delete" }),
    handleClose: vi.fn(),
  }),
}));

import { Products } from "../Products";

describe("Products", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsOnline.mockReturnValue(true);
  });

  it("offers an add action from the empty state", () => {
    mockUseProductsCommon.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<Products />);

    expect(screen.getByText("_pages:products.empty")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "_pages:products.add" }),
    );
    expect(mockOpenAdd).toHaveBeenCalledTimes(1);
  });

  it("shows the offline copy instead of a raw fetch failure", () => {
    mockUseProductsCommon.mockReturnValue({
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
    mockUseProductsCommon.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Product not found"),
    });

    render(<Products />);

    expect(screen.getByRole("alert")).toHaveTextContent("Product not found");
  });
});
