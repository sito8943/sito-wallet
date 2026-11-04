import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const flags = vi.hoisted(() => ({ transactionsEnabled: true }));

vi.mock("providers", () => ({
  useFeatureFlags: () => ({
    isFeatureEnabled: () => flags.transactionsEnabled,
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) =>
      options?.name ? `${key}:${options.name}` : key,
  }),
}));

const { useCatalogTransactionsDialog } =
  await import("../useCatalogTransactionsDialog");
const { CATALOG_TRANSACTIONS_LIMIT } = await import("../constants");

const record = { id: 7, name: "Leche", updatedAt: new Date() };

describe("useCatalogTransactionsDialog", () => {
  it("opens the dialog filtered by the entry", () => {
    const { result } = renderHook(() =>
      useCatalogTransactionsDialog({
        filterKey: "productId",
        emptyMessage: "empty",
      }),
    );
    expect(result.current.dialog.open).toBe(false);

    act(() => {
      result.current.action(record).onClick?.(record);
    });

    expect(result.current.dialog).toMatchObject({
      open: true,
      title: "_pages:transactions.catalogHistory.title:Leche",
      filters: { productId: 7 },
      emptyMessage: "empty",
      limit: CATALOG_TRANSACTIONS_LIMIT,
    });

    act(() => {
      result.current.dialog.onClose();
    });
    expect(result.current.dialog.open).toBe(false);
  });

  it("filters by the seller with purchaseProviderId", () => {
    const { result } = renderHook(() =>
      useCatalogTransactionsDialog({
        filterKey: "purchaseProviderId",
        emptyMessage: "empty",
      }),
    );

    act(() => {
      result.current.action(record).onClick?.(record);
    });

    expect(result.current.dialog.filters).toEqual({ purchaseProviderId: 7 });
  });

  it("names the count in the tooltip when there are transactions", () => {
    const { result } = renderHook(() =>
      useCatalogTransactionsDialog({
        filterKey: "productId",
        emptyMessage: "empty",
      }),
    );

    expect(result.current.action(record).tooltip).toBe(
      "_pages:transactions.catalogHistory.action",
    );
    expect(
      result.current.action({ ...record, transactionCount: 3 }).tooltip,
    ).toBe("_pages:transactions.catalogHistory.actionWithCount");
  });

  it("hides the action when transactions are disabled", () => {
    flags.transactionsEnabled = false;
    const { result } = renderHook(() =>
      useCatalogTransactionsDialog({
        filterKey: "productId",
        emptyMessage: "empty",
      }),
    );

    expect(result.current.action(record).hidden).toBe(true);
    flags.transactionsEnabled = true;
  });
});
