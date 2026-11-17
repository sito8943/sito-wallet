import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const { useInfiniteAccountsList, AccountCard, action } = vi.hoisted(() => ({
  useInfiniteAccountsList: vi.fn(),
  AccountCard: vi.fn(),
  action: () => ({ action: () => ({ id: "action" }) }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useDeleteDialog: action,
  useRestoreDialog: action,
  useExportActionMutate: action,
  useImportDialog: action,
  useNotification: () => ({ showErrorNotification: vi.fn() }),
  Page: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Empty: () => null,
  GlobalActions: { Add: "add" },
  ConfirmationDialog: () => null,
  ImportDialog: () => null,
  PrettyGrid: ({
    data,
    renderComponent,
  }: {
    data: { id: number }[];
    renderComponent: (item: { id: number }) => ReactNode;
  }) => (
    <>
      {data.map((item) => (
        <div key={item.id}>{renderComponent(item)}</div>
      ))}
    </>
  ),
}));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({ isFeatureEnabled: () => true }),
  useManager: () => ({ Accounts: {} }),
  useRegisterBottomNavAction: vi.fn(),
}));

vi.mock("../components", () => ({
  AccountCard: (props: object) => {
    AccountCard(props);
    return <div data-testid="account-card" />;
  },
  AddAccountDialog: () => null,
  EditAccountDialog: () => null,
  AdjustBalanceDialog: () => null,
  AdjustRewardsDialog: () => null,
  TransferDialog: () => null,
}));

vi.mock("../../Transactions/components/AddTransactionDialog", () => ({
  AddTransactionDialog: () => null,
}));

vi.mock("components", () => ({
  MobileSelectionBar: () => null,
  QueryError: () => null,
}));

vi.mock("hooks", () => ({
  useInfiniteAccountsList,
  AccountsQueryKeys: { all: () => ({ queryKey: ["accounts"] }) },
  useMobileNavbar: vi.fn(),
  useMobileMultiSelection: () => ({
    selectionMode: false,
    isSelected: () => false,
  }),
  useSwipeDeleteState: () => ({}),
  useMutationErrorHandler: () => vi.fn(),
  RESTORE_NAME_IN_USE_KEY: "_entities:base.restore.nameInUse",
}));

vi.mock("../hooks", () => ({
  useAddAccountDialog: () => ({ openDialog: vi.fn() }),
  useEditAccountDialog: () => ({ openDialog: vi.fn() }),
  useViewTransactionsAction: action,
  useAdjustBalanceMutation: action,
  useAdjustRewardsMutation: action,
  useTransferDialog: action,
}));

vi.mock("../../Transactions/hooks/useAddTransaction", () => ({
  useAddTransaction: () => ({ openDialog: vi.fn() }),
}));

vi.mock("../../../components/Card/utils", () => ({
  getDeleteAction: () => undefined,
}));

vi.mock("lib", () => ({
  Tables: { Accounts: "accounts" },
  isFeatureDisabledBusinessError: () => false,
  defaultAccountsListFilters: {},
  normalizeListFilters: (filters: object) => filters,
}));

import { Accounts } from "../Accounts";

describe("Accounts page", () => {
  it("loads each account's 2 latest transactions with the list", () => {
    const lastTransactions = [{ id: 10 }, { id: 11 }];
    useInfiniteAccountsList.mockReturnValue({
      data: {
        pages: [{ items: [{ id: 1, name: "Wallet", lastTransactions }] }],
      },
      isLoading: false,
      error: null,
    });

    render(<Accounts />);

    expect(useInfiniteAccountsList).toHaveBeenCalledWith({
      lastTransactionsLimit: 2,
    });
    expect(screen.getByTestId("account-card")).toBeInTheDocument();
    expect(AccountCard).toHaveBeenCalledWith(
      expect.objectContaining({ showLastTransactions: true, lastTransactions }),
    );
  });
});
