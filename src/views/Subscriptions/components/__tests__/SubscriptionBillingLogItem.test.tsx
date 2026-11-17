import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { SubscriptionBillingLogDto } from "lib";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values && "amount" in values ? `${key} ${String(values.amount)}` : key,
  }),
}));

const { SubscriptionBillingLogItem } =
  await import("../SubscriptionBillingLogItem");

const baseLog: SubscriptionBillingLogDto = {
  id: 1,
  amount: 23,
  paidAt: "2026-11-01T10:00:00",
  currency: { id: 1, name: "Euro", symbol: "€" },
  note: "Netflix",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe("SubscriptionBillingLogItem", () => {
  it("opens the linked transaction when the log has a transactionId", () => {
    const onClick = vi.fn();
    render(
      <ul>
        <SubscriptionBillingLogItem
          log={{ ...baseLog, transactionId: 42 }}
          onClick={onClick}
        />
      </ul>,
    );

    const button = screen.getByRole("button", {
      name: "_pages:subscriptions.actions.billingLog.openTransaction 23 €",
    });
    expect(button).toHaveClass("subscription-activity-item", "clickable");

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledWith(42);
  });

  it("stays non-interactive without a transactionId", () => {
    const onClick = vi.fn();
    render(
      <ul>
        <SubscriptionBillingLogItem
          log={{ ...baseLog, transactionId: null }}
          onClick={onClick}
        />
      </ul>,
    );

    expect(screen.queryByRole("button")).toBeNull();
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("subscription-activity-item");
    expect(item).not.toHaveClass("clickable");
    expect(screen.getByText("23 €")).toBeInTheDocument();

    fireEvent.click(item);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("stays non-interactive when no click handler is given", () => {
    render(
      <ul>
        <SubscriptionBillingLogItem log={{ ...baseLog, transactionId: 42 }} />
      </ul>,
    );

    expect(screen.queryByRole("button")).toBeNull();
  });
});
