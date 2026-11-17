import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { TransactionDto } from "lib";

const { openDialog, useTransactionsList } = vi.hoisted(() => ({
  openDialog: vi.fn(),
  useTransactionsList: vi.fn(),
}));

vi.mock("../../../../hooks/queries/useTransactionsList", () => ({
  useTransactionsList,
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

const transactions = [
  { id: 1, description: "Coffee" },
  { id: 2, description: "Rent" },
] as TransactionDto[];

describe("LastTransactions", () => {
  it("renders the given transactions as compact cards without fetching", () => {
    render(<LastTransactions transactions={transactions} />);

    const cards = screen.getAllByTestId("transaction-card");
    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveAttribute("data-compact", "true");
    expect(screen.getByTestId("edit-transaction-dialog")).toBeInTheDocument();
    expect(useTransactionsList).not.toHaveBeenCalled();
  });

  it("renders nothing when the account has no transactions", () => {
    const { container } = render(<LastTransactions transactions={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("opens the edit dialog without reaching the account card", () => {
    const onAccountClick = vi.fn();

    render(
      <div onClick={onAccountClick}>
        <LastTransactions transactions={transactions} />
      </div>,
    );

    fireEvent.click(screen.getByText("Rent"));

    expect(openDialog).toHaveBeenCalledWith(2);
    expect(onAccountClick).not.toHaveBeenCalled();
  });
});
