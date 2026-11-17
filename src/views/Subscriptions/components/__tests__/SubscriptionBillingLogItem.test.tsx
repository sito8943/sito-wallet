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

vi.mock("@sito/dashboard-app", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  classNames: (...classes: Array<string | false | null | undefined>) =>
    classes.filter(Boolean).join(" "),
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

// The components barrel pulls the PWA virtual module; load Money directly.
vi.mock("components", async () => ({
  Money: (await import("../../../../components/Money")).Money,
  ActivityItem: (await import("../../../../components/ActivityItem"))
    .ActivityItem,
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
    expect(button).toHaveClass("activity-item-main");
    expect(screen.getByRole("listitem")).toHaveClass(
      "activity-item",
      "activity-item--clickable",
    );

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
    expect(item).toHaveClass("activity-item");
    expect(item).not.toHaveClass("activity-item--clickable");
    const amount = item.querySelector(".activity-item-amount");
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

  it("offers delete beside the clickable log without nesting buttons", () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    const log = { ...baseLog, transactionId: 42 };
    render(
      <ul>
        <SubscriptionBillingLogItem
          log={log}
          onClick={onClick}
          onDelete={onDelete}
        />
      </ul>,
    );

    const deleteButton = screen.getByRole("button", {
      name: "_pages:subscriptions.actions.deleteBillingLog.text",
    });
    expect(deleteButton.closest(".activity-item-main")).toBeNull();

    fireEvent.click(deleteButton);
    expect(onDelete).toHaveBeenCalledWith(log);
    expect(onClick).not.toHaveBeenCalled();
  });
});
