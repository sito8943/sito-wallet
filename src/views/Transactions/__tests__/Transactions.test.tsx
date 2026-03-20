import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ─── Module mocks ──────────────────────────────────────────────────────────────

// react-router-dom: spy on useLocation
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom"
    );
  return {
    ...actual,
    useLocation: () => ({ search: "", pathname: "/transactions" }),
  };
});

// i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string, o?: Record<string, unknown>) =>
      (o?.defaultValue as string) ?? k,
    i18n: { language: "en" },
  }),
}));

// Accounts hook
const mockAccountsCommon = vi.fn(() => ({
  data: [
    { id: 1, name: "Wallet", currency: { name: "EUR", symbol: "€" } },
    { id: 2, name: "Savings", currency: { name: "USD", symbol: "$" } },
  ],
  isLoading: false,
}));
const mockUseMobileNavbar = vi.fn();

vi.mock("hooks", () => ({
  useAccountsCommon: () => mockAccountsCommon(),
  useTransactionCategoriesCommon: () => ({
    data: [{ id: 1, name: "Food", auto: false }],
    isLoading: false,
  }),
  useMobileNavbar: (...args: unknown[]) => mockUseMobileNavbar(...args),
  usePersistedTableOptions: vi.fn(),
  TransactionsQueryKeys: {
    all: () => ({ queryKey: ["transactions"] }),
    list: () => ({ queryKey: ["transactions", "list"] }),
  },
}));

// providers
vi.mock("providers", () => ({
  useManager: () => ({
    Transactions: {
      softDelete: vi.fn(),
      restore: vi.fn(),
      export: vi.fn().mockResolvedValue(null),
      import: vi.fn().mockResolvedValue(0),
      processImport: vi.fn().mockResolvedValue([]),
    },
  }),
}));

// Local hooks
const mockOpenDialog = vi.fn();
vi.mock("../hooks", () => ({
  useAddTransaction: () => ({
    openDialog: mockOpenDialog,
    action: vi.fn(() => ({ id: "add", onClick: mockOpenDialog })),
  }),
  useEditTransaction: () => ({
    action: vi.fn((record: { id: number }) => ({
      id: "edit",
      onClick: vi.fn(),
      record,
    })),
  }),
  useAssignTransactionAccountAction: () => ({
    action: vi.fn(() => ({ id: "assign-account", onClick: vi.fn() })),
  }),
  useAssignTransactionCategoryAction: () => ({
    action: vi.fn(() => ({ id: "assign-category", onClick: vi.fn() })),
  }),
}));

vi.mock("../../Accounts/hooks", () => ({
  useAddAccountDialog: () => ({
    openDialog: vi.fn(),
  }),
}));

// @sito/dashboard-app
vi.mock("@sito/dashboard-app", () => ({
  Page: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <div data-testid="page" data-title={title}>
      {children}
    </div>
  ),
  TabsLayout: ({
    tabs,
    defaultTab,
    className,
  }: {
    tabs: Array<{ id: number; label: string; content: React.ReactNode }>;
    defaultTab?: number;
    className?: string;
    tabsContainerClassName?: string;
  }) => (
    <div data-testid={`tabs-${className?.includes("hidden") ? "mobile" : "desktop"}`}>
      {tabs.map((tab) => {
        const isActive = tab.id === (defaultTab ?? tabs[0]?.id);
        return (
          <div
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            data-active={isActive}
          >
            <span data-testid={`tab-label-${tab.id}`}>{tab.label}</span>
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  ),
  Empty: ({ message }: { message: string }) => (
    <div data-testid="empty-state">{message}</div>
  ),
  GlobalActions: { Add: "add" },
  useDeleteDialog: () => ({ action: () => ({ id: "delete", onClick: vi.fn() }) }),
  useRestoreDialog: () => ({ action: () => ({ id: "restore", onClick: vi.fn() }) }),
  useExportActionMutate: () => ({ action: () => ({ id: "export", onClick: vi.fn() }) }),
  useImportDialog: () => ({
    open: false,
    handleClose: vi.fn(),
    handleSubmit: vi.fn(),
    isLoading: false,
    fileProcessor: vi.fn(),
    onFileProcessed: vi.fn(),
    onOverrideChange: vi.fn(),
    action: () => ({ id: "import", onClick: vi.fn() }),
  }),
  useTableOptions: () => ({
    filters: {},
    sortingBy: "date",
    sortingOrder: "desc",
    currentPage: 1,
    pageSize: 10,
    setSortingBy: vi.fn(),
    setSortingOrder: vi.fn(),
    onFilterApply: vi.fn(),
    clearFilters: vi.fn(),
    setCurrentPage: vi.fn(),
    setTotal: vi.fn(),
    setPageSize: vi.fn(),
    onSort: vi.fn(),
    total: 0,
    pageSizes: [20, 50, 100],
    countOfFilters: 0,
  }),
  useNotification: () => ({
    showErrorNotification: vi.fn(),
    showSuccessNotification: vi.fn(),
  }),
  ConfirmationDialog: () => null,
  ImportDialog: () => null,
  TabsType: {},
}));

// Local components
vi.mock("../components", () => ({
  AddTransactionDialog: () => null,
  AssignAccountDialog: () => null,
  AssignCategoryDialog: () => null,
  EditTransactionDialog: () => null,
  TransactionGrid: ({ accountId }: { accountId: number }) => (
    <div data-testid={`transaction-grid-${accountId}`} />
  ),
  TransactionTable: ({
    accountId,
    showFilters,
  }: {
    accountId: number;
    showFilters: boolean;
  }) => (
    <div
      data-testid={`transaction-table-${accountId}`}
      data-show-filters={showFilters}
    />
  ),
}));

vi.mock("../components/WeeklyCard", () => ({
  WeeklyCard: ({
    type,
    accountId,
    currencyName,
    currencySymbol,
  }: {
    type: string;
    accountId?: number;
    currencyName?: string;
    currencySymbol?: string;
  }) => (
    <div
      data-testid={`weekly-card-${type}`}
      data-account-id={accountId}
      data-currency-name={currencyName}
      data-currency-symbol={currencySymbol}
    />
  ),
}));

vi.mock("../../Accounts", () => ({
  AddAccountDialog: () => null,
}));

vi.mock("lib", () => ({
  Tables: { Transactions: "transactions", Accounts: "accounts" },
  TransactionType: { In: "in", Out: "out" },
  FilterTransactionDto: class {},
  TransactionDto: class {},
  ImportPreviewTransactionDto: class {},
  isFeatureDisabledBusinessError: () => false,
}));

import { Transactions } from "../Transactions";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderTransactions(initialSearch = "") {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter
        initialEntries={[`/transactions${initialSearch}`]}
      >
        <Transactions />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Transactions", () => {
  beforeEach(() => {
    mockAccountsCommon.mockReturnValue({
      data: [
        { id: 1, name: "Wallet", currency: { name: "EUR", symbol: "€" } },
        { id: 2, name: "Savings", currency: { name: "USD", symbol: "$" } },
      ],
      isLoading: false,
    });
  });

  describe("tab rendering by account", () => {
    it("renders one tab per account (desktop + mobile = 2 each)", () => {
      renderTransactions();
      // Both desktop and mobile layouts render the same tabs → 2 per account
      expect(screen.getAllByTestId("tab-1")).toHaveLength(2);
      expect(screen.getAllByTestId("tab-2")).toHaveLength(2);
    });

    it("renders account names as tab labels", () => {
      renderTransactions();

      // Two instances (desktop + mobile) of each label
      const walletLabels = screen.getAllByTestId("tab-label-1");
      const savingsLabels = screen.getAllByTestId("tab-label-2");
      expect(walletLabels[0]).toHaveTextContent("Wallet");
      expect(savingsLabels[0]).toHaveTextContent("Savings");
    });

    it("renders both desktop and mobile tab layouts", () => {
      renderTransactions();
      expect(screen.getAllByTestId(/^tabs-/)).toHaveLength(2);
    });
  });

  describe("initial tab selection via ?accountId=", () => {
    it("selects the first account when no accountId query param", () => {
      renderTransactions();
      // Without a query param, both mobile + desktop tabs for account 1 render
      expect(screen.getAllByTestId("tab-1")).toHaveLength(2);
    });

    it("renders tab for accountId=2 when passed in URL", () => {
      const qc = new QueryClient({
        defaultOptions: { queries: { retry: false } },
      });
      render(
        <QueryClientProvider client={qc}>
          <MemoryRouter initialEntries={["/transactions?accountId=2"]}>
            <Transactions />
          </MemoryRouter>
        </QueryClientProvider>
      );

      expect(screen.getAllByTestId("tab-2")).toHaveLength(2);
    });
  });

  describe("empty state", () => {
    it("shows empty state when there are no accounts", () => {
      mockAccountsCommon.mockReturnValue({ data: [], isLoading: false });
      renderTransactions();

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("does not show tabs when accounts list is empty", () => {
      mockAccountsCommon.mockReturnValue({ data: [], isLoading: false });
      renderTransactions();

      expect(screen.queryByTestId("tab-1")).toBeNull();
    });
  });

  describe("weekly cards", () => {
    it("renders weekly-out and weekly-in cards", () => {
      renderTransactions();

      expect(screen.getByTestId("weekly-card-out")).toBeInTheDocument();
      expect(screen.getByTestId("weekly-card-in")).toBeInTheDocument();
    });

    it("passes selected account data to weekly cards", () => {
      renderTransactions();

      expect(screen.getByTestId("weekly-card-out")).toHaveAttribute(
        "data-account-id",
        "1"
      );
      expect(screen.getByTestId("weekly-card-out")).toHaveAttribute(
        "data-currency-name",
        "EUR"
      );
      expect(screen.getByTestId("weekly-card-out")).toHaveAttribute(
        "data-currency-symbol",
        "€"
      );
    });

    it("does not render weekly cards when there are no accounts", () => {
      mockAccountsCommon.mockReturnValue({ data: [], isLoading: false });
      renderTransactions();

      expect(screen.queryByTestId("weekly-card-out")).toBeNull();
      expect(screen.queryByTestId("weekly-card-in")).toBeNull();
    });
  });

  describe("filter toggle", () => {
    it("transaction tables receive showFilters=false by default", () => {
      renderTransactions();

      // TransactionTable instances in desktop layout
      const tables = screen.getAllByTestId(/^transaction-table-/);
      expect(tables.length).toBeGreaterThan(0);
      tables.forEach((t) =>
        expect(t).toHaveAttribute("data-show-filters", "false")
      );
    });
  });
});
