import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

const { get, enabled } = vi.hoisted(() => ({
  get: vi.fn(),
  enabled: vi.fn(() => true),
}));
vi.mock("providers", () => ({
  useManager: () => ({ Transactions: { get } }),
  useFeatureFlags: () => ({ isFeatureEnabled: enabled }),
}));
vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => ({ account: { id: 7 } }),
  SortOrder: { DESC: "DESC" },
}));
vi.mock("../../../hooks/queries/useHideDeletedEntitiesPreference", () => ({
  useHideDeletedEntitiesPreference: () => true,
}));
vi.mock("lib", () => ({
  applyHideDeletedEntitiesPreference: (filters: object) => ({
    ...filters,
    softDeleteScope: "ACTIVE",
  }),
}));

import { useTransactionSearch } from "../useTransactionSearch";

function wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
let client: QueryClient;

describe("global transaction search", () => {
  beforeEach(() => {
    client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    get.mockReset();
    enabled.mockReturnValue(true);
  });

  it("searches descriptions without the current account or date filters", async () => {
    get.mockResolvedValue({ items: [{ id: 1, description: "Compra Consum" }] });
    const { result } = renderHook(() => useTransactionSearch("Consum", true), {
      wrapper,
    });
    await waitFor(() => expect(result.current.items).toHaveLength(1));
    expect(get).toHaveBeenCalledWith(
      { currentPage: 0, pageSize: 10, sortingBy: "date", sortingOrder: "DESC" },
      { description: "Consum", softDeleteScope: "ACTIVE" },
    );
  });

  it("does not request empty, hidden, or disabled searches", () => {
    const { rerender } = renderHook(
      ({ text, active }) => useTransactionSearch(text, active),
      { wrapper, initialProps: { text: "", active: true } },
    );
    rerender({ text: "Consum", active: false });
    enabled.mockReturnValue(false);
    rerender({ text: "Consum", active: true });
    expect(get).not.toHaveBeenCalled();
  });

  it("does not replace a newer search with a late response", async () => {
    let resolveOld!: (value: { items: { id: number }[] }) => void;
    get.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveOld = resolve;
        }),
    );
    get.mockResolvedValueOnce({ items: [{ id: 2 }] });
    const { result, rerender } = renderHook(
      ({ text }) => useTransactionSearch(text, true),
      { wrapper, initialProps: { text: "Consum" } },
    );
    rerender({ text: "Otro" });
    await waitFor(() => expect(result.current.items).toEqual([{ id: 2 }]));
    resolveOld({ items: [{ id: 1 }] });
    await waitFor(() => expect(client.isFetching()).toBe(0));
    expect(result.current.items).toEqual([{ id: 2 }]);
  });

  it("exposes failed requests as errors", async () => {
    get.mockRejectedValue(new Error("offline"));
    const { result } = renderHook(() => useTransactionSearch("Consum", true), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.isLoading).toBe(false);
  });
});
