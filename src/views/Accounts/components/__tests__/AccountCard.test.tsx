import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

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
vi.mock("../LastTransactions", () => ({ LastTransactions: () => null }));
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
});
