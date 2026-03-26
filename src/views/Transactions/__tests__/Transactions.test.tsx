import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
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
const mockAccountsList = vi.fn(() => ({
  data: {
    items: [
      { id: 1, name: "Wallet", currency: { name: "EUR", symbol: "€" } },
      { id: 2, name: "Savings", currency: { name: "USD", symbol: "$" } },
    ],
  },
  isLoading: false,
  error: null,
}));
const mockUseMobileNavbar = vi.fn();

vi.mock("hooks", () => ({
  useAccountsList: () => mockAccountsList(),
  useTransactionCategoriesCommon: () => ({
    data: [{ id: 1, name: "Food", auto: false }],
    isLoading: false,
    error: null,
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
  useRegisterBottomNavAction: vi.fn(),
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

vi.mock("../sections/TransactionsDesktopSection", () => ({
  default: ({
    tabs,
    tabValue,
  }: {
    tabs: Array<{ id: number; label: string; content: React.ReactNode }>;
    tabValue?: number;
  }) => (
    <div data-testid="tabs-desktop">
      {tabs.map((tab) => {
        const isActive = tab.id === (tabValue ?? tabs[0]?.id);
        return (
          <div key={tab.id} data-testid={`tab-${tab.id}`} data-active={isActive}>
            <span data-testid={`tab-label-${tab.id}`}>{tab.label}</span>
            {isActive ? tab.content : null}
          </div>
        );
      })}
    </div>
  ),
}));

vi.mock("../sections/TransactionsMobileSection", () => ({
  default: ({
    tabs,
    tabValue,
  }: {
    tabs: Array<{ id: number; label: string; content: React.ReactNode }>;
    tabValue?: number;
  }) => (
    <div data-testid="tabs-mobile">
      {tabs.map((tab) => {
        const isActive = tab.id === (tabValue ?? tabs[0]?.id);
        return (
          <div key={tab.id} data-testid={`tab-${tab.id}`} data-active={isActive}>
            <span data-testid={`tab-label-${tab.id}`}>{tab.label}</span>
            {isActive ? tab.content : null}
          </div>
        );
      })}
    </div>
  ),
}));

vi.mock("../sections/WeeklySummarySection", () => ({
  default: ({
    selectedAccount,
  }: {
    selectedAccount?: {
      id: number;
      currency?: { name?: string; symbol?: string };
    } | null;
  }) =>
    selectedAccount ? (
      <>
        <div
          data-testid="weekly-card-out"
          data-account-id={selectedAccount.id}
          data-currency-name={selectedAccount.currency?.name}
          data-currency-symbol={selectedAccount.currency?.symbol}
        />
        <div
          data-testid="weekly-card-in"
          data-account-id={selectedAccount.id}
          data-currency-name={selectedAccount.currency?.name}
          data-currency-symbol={selectedAccount.currency?.symbol}
        />
      </>
    ) : null,
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
async function renderTransactions(initialSearch = "") {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter
        initialEntries={[`/transactions${initialSearch}`]}
      >
        <Transactions />
      </MemoryRouter>
    </QueryClientProvider>
  );

  await waitFor(() => {
    const content =
      screen.queryByTestId("tabs-desktop") ??
      screen.queryByTestId("tabs-mobile") ??
      screen.queryByTestId("empty-state");
    expect(content).toBeTruthy();
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("Transactions", () => {
  beforeEach(() => {
    mockAccountsList.mockReturnValue({
      data: {
        items: [
          { id: 1, name: "Wallet", currency: { name: "EUR", symbol: "€" } },
          { id: 2, name: "Savings", currency: { name: "USD", symbol: "$" } },
        ],
      },
      isLoading: false,
      error: null,
    });
  });

  describe("tab rendering by account", () => {
    it("renders one tab per account in desktop layout", async () => {
      await renderTransactions();
      expect(screen.getAllByTestId("tab-1")).toHaveLength(1);
      expect(screen.getAllByTestId("tab-2")).toHaveLength(1);
    });

    it("renders account names as tab labels", async () => {
      await renderTransactions();

      const walletLabels = screen.getAllByTestId("tab-label-1");
      const savingsLabels = screen.getAllByTestId("tab-label-2");
      expect(walletLabels[0]).toHaveTextContent("Wallet");
      expect(savingsLabels[0]).toHaveTextContent("Savings");
    });

    it("renders desktop tabs and does not render mobile tabs in jsdom width", async () => {
      await renderTransactions();
      expect(screen.getByTestId("tabs-desktop")).toBeInTheDocument();
      expect(screen.queryByTestId("tabs-mobile")).toBeNull();
    });
  });

  describe("initial tab selection via ?accountId=", () => {
    it("selects the first account when no accountId query param", async () => {
      await renderTransactions();
      expect(screen.getAllByTestId("tab-1")).toHaveLength(1);
    });

    it("renders tab for accountId=2 when passed in URL", async () => {
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

      await screen.findByTestId("tabs-desktop");
      expect(screen.getAllByTestId("tab-2")).toHaveLength(1);
    });
  });

  describe("empty state", () => {
    it("shows empty state when there are no accounts", async () => {
      mockAccountsList.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
      });
      await renderTransactions();

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    });

    it("does not show tabs when accounts list is empty", async () => {
      mockAccountsList.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
      });
      await renderTransactions();

      expect(screen.queryByTestId("tab-1")).toBeNull();
    });
  });

  describe("weekly cards", () => {
    it("renders weekly-out and weekly-in cards", async () => {
      await renderTransactions();

      expect(await screen.findByTestId("weekly-card-out")).toBeInTheDocument();
      expect(await screen.findByTestId("weekly-card-in")).toBeInTheDocument();
    });

    it("passes selected account data to weekly cards", async () => {
      await renderTransactions();
      const weeklyCardOut = await screen.findByTestId("weekly-card-out");

      expect(weeklyCardOut).toHaveAttribute(
        "data-account-id",
        "1"
      );
      expect(weeklyCardOut).toHaveAttribute(
        "data-currency-name",
        "EUR"
      );
      expect(weeklyCardOut).toHaveAttribute(
        "data-currency-symbol",
        "€"
      );
    });

    it("does not render weekly cards when there are no accounts", async () => {
      mockAccountsList.mockReturnValue({
        data: { items: [] },
        isLoading: false,
        error: null,
      });
      await renderTransactions();

      expect(screen.queryByTestId("weekly-card-out")).toBeNull();
      expect(screen.queryByTestId("weekly-card-in")).toBeNull();
    });
  });

  describe("filter toggle", () => {
    it("transaction tables receive showFilters=false by default", async () => {
      await renderTransactions();

      // TransactionTable instances in desktop layout
      const tables = screen.getAllByTestId(/^transaction-table-/);
      expect(tables.length).toBeGreaterThan(0);
      tables.forEach((t) =>
        expect(t).toHaveAttribute("data-show-filters", "false")
      );
    });
  });
});
