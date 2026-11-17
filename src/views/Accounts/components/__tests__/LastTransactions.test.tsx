import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

const openDialog = vi.fn();

vi.mock("@sito/dashboard-app", () => ({
  Loading: () => <span data-testid="loading" />,
  SortOrder: { DESC: "DESC" },
}));

vi.mock("../../../../hooks/queries/useTransactionsList", () => ({
  useTransactionsList: () => ({
    isLoading: false,
    data: {
      items: [
        { id: 1, description: "Coffee" },
        { id: 2, description: "Rent" },
      ],
    },
  }),
}));

vi.mock("views/Transactions/hooks", () => ({
  useEditTransaction: () => ({ openDialog, open: false }),
}));

vi.mock("views/Transactions/components/EditTransactionDialog", () => ({
  EditTransactionDialog: () => <div data-testid="edit-transaction-dialog" />,
}));

vi.mock("views/Transactions/components/TransactionCard", () => ({
  TransactionCard: ({
    id,
    description,
    compact,
    onClick,
  }: {
    id: number;
    description: string;
    compact?: boolean;
    onClick: (id: number) => void;
  }) => (
    <button
      type="button"
      data-testid="transaction-card"
      data-compact={String(!!compact)}
      onClick={() => onClick(id)}
    >
      {description}
    </button>
  ),
}));

import { LastTransactions } from "../LastTransactions";

describe("LastTransactions", () => {
  it("renders each transaction as a compact TransactionCard", () => {
    render(<LastTransactions accountId={4} />);

    const cards = screen.getAllByTestId("transaction-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("data-compact", "true");
    expect(screen.getByTestId("edit-transaction-dialog")).toBeInTheDocument();
  });

  it("opens the edit dialog without reaching the account card", () => {
    const onAccountClick = vi.fn();

    render(
      <div onClick={onAccountClick}>
        <LastTransactions accountId={4} />
      </div>,
    );

    fireEvent.click(screen.getByText("Rent"));

    expect(openDialog).toHaveBeenCalledWith(2);
    expect(onAccountClick).not.toHaveBeenCalled();
  });
});
