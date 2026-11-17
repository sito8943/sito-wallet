import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { TransactionDto } from "lib";

vi.mock("@use-gesture/react", () => ({
  useDrag: () => () => ({}),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sito/dashboard-app", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
  Actions: () => null,
  Chip: ({ text }: { text: ReactNode }) => <span>{text}</span>,
}));

vi.mock("components", async () => ({
  ItemCard: (await import("../../../../components/Card/ItemCard")).ItemCard,
  Money: () => null,
}));

vi.mock("../TypeResume", () => ({ default: () => null }));
vi.mock("../LastTransactions", () => ({
  LastTransactions: ({ transactions }: { transactions: unknown[] }) => (
    <span data-testid="last-transactions">{transactions.length}</span>
  ),
}));
vi.mock("../AccountRewardsChip", () => ({ AccountRewardsChip: () => null }));

import { AccountCard } from "../AccountCard";

const account = {
  id: 4,
  name: "Wallet",
  description: "Daily",
  balance: 10,
  actions: [],
};

describe("AccountCard", () => {
  it("is an editable button when onClick is provided", () => {
    const onClick = vi.fn();
    render(<AccountCard {...account} onClick={onClick} />);

    fireEvent.click(
      screen.getByRole("button", { name: "_pages:accounts.forms.editAria" }),
    );

    expect(onClick).toHaveBeenCalledWith(4);
  });

  it("is display-only without onClick (AccountSlider)", () => {
    render(<AccountCard {...account} />);

    expect(screen.getByText("Wallet")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("_pages:accounts.forms.editAria"),
    ).not.toBeInTheDocument();
  });

  describe("last transactions", () => {
    const lastTransactions = [
      { id: 1 },
      { id: 2 },
    ] as unknown as TransactionDto[];

    it("shows the account's transactions when enabled", () => {
      render(
        <AccountCard
          {...account}
          showLastTransactions
          lastTransactions={lastTransactions}
        />,
      );

      expect(screen.getByTestId("last-transactions")).toHaveTextContent("2");
    });

    it("stays hidden unless the view enables it (AccountSlider)", () => {
      render(<AccountCard {...account} lastTransactions={lastTransactions} />);

      expect(screen.queryByTestId("last-transactions")).not.toBeInTheDocument();
    });

    it("stays hidden for deleted accounts", () => {
      render(
        <AccountCard
          {...account}
          showLastTransactions
          deletedAt={new Date()}
          lastTransactions={lastTransactions}
        />,
      );

      expect(screen.queryByTestId("last-transactions")).not.toBeInTheDocument();
    });
  });
});
