import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import type { SubscriptionBillingLogDto } from "lib";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, values?: Record<string, unknown>) =>
      values && "amount" in values ? `${key} ${String(values.amount)}` : key,
    i18n: { language: "en" },
  }),
}));

// The components barrel pulls the PWA virtual module; load Money directly.
vi.mock("components", async () => ({
  Money: (await import("../../../../components/Money")).Money,
}));

const { SubscriptionBillingLogItem } =
  await import("../SubscriptionBillingLogItem");

const baseLog: SubscriptionBillingLogDto = {
  id: 1,
  amount: 1234.5,
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
      name: "_pages:subscriptions.actions.billingLog.openTransaction 1,234.50 €",
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
    const amount = item.querySelector(".subscription-activity-amount");
    expect(amount).toHaveTextContent("1,234.50 €");
    expect(screen.getByText("€")).toHaveAttribute(
      "data-tooltip-content",
      "Euro",
    );

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
