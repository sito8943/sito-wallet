import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { DebtPaymentDto } from "lib";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values && "amount" in values ? `${key} ${String(values.amount)}` : key,
    i18n: { language: "en" },
  }),
}));

vi.mock("@sito/dashboard-app", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
  Loading: () => null,
  IconButton: ({
    onClick,
    "aria-label": ariaLabel,
  }: {
    onClick: () => void;
    "aria-label": string;
  }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick}>
      icon
    </button>
  ),
}));

// The components barrel pulls the PWA virtual module; load these directly.
vi.mock("components", async () => ({
  Money: (await import("../../../components/Money")).Money,
  ActivityItem: (await import("../../../components/ActivityItem")).ActivityItem,
}));

const { DebtActivitySidebar } =
  await import("../components/DebtActivitySidebar");

const basePayment: DebtPaymentDto = {
  id: 9,
  debtId: 3,
  amount: 50,
  paidAt: "2026-11-01T10:00:00",
  note: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const renderSidebar = (
  payment: DebtPaymentDto,
  handlers: {
    onPaymentClick?: (transactionId: number) => void;
    onEditPayment?: (payment: DebtPaymentDto) => void;
    onDeletePayment?: (payment: DebtPaymentDto) => void;
  } = {},
) =>
  render(
    <DebtActivitySidebar
      currency={{ id: 1, name: "Euro", symbol: "€" }}
      payments={[payment]}
      {...handlers}
    />,
  );

describe("DebtActivitySidebar", () => {
  it("opens the payment's transaction on click", () => {
    const onPaymentClick = vi.fn();
    renderSidebar({ ...basePayment, transactionId: 77 }, { onPaymentClick });

    fireEvent.click(
      screen.getByRole("button", {
        name: "_pages:debts.actions.payment.openTransaction 50.00 €",
      }),
    );

    expect(onPaymentClick).toHaveBeenCalledWith(77);
  });

  it("is not clickable without a transactionId", () => {
    const onPaymentClick = vi.fn();
    renderSidebar({ ...basePayment, transactionId: null }, { onPaymentClick });

    expect(
      screen.queryByRole("button", {
        name: /_pages:debts\.actions\.payment\.openTransaction/,
      }),
    ).toBeNull();
    expect(
      document.querySelector(".activity-item--clickable"),
    ).not.toBeInTheDocument();
  });

  it("keeps edit and delete beside the clickable payment", () => {
    const onPaymentClick = vi.fn();
    const onEditPayment = vi.fn();
    const onDeletePayment = vi.fn();
    const payment = { ...basePayment, transactionId: 77 };
    renderSidebar(payment, { onPaymentClick, onEditPayment, onDeletePayment });

    fireEvent.click(
      screen.getByRole("button", {
        name: "_pages:debts.actions.editPayment.text",
      }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: "_pages:debts.actions.deletePayment.text",
      }),
    );

    expect(onEditPayment).toHaveBeenCalledWith(payment);
    expect(onDeletePayment).toHaveBeenCalledWith(payment);
    expect(onPaymentClick).not.toHaveBeenCalled();
  });
});
