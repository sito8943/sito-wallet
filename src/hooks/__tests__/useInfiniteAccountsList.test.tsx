import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockGet = vi.fn();

vi.mock("providers", () => ({
  useManager: () => ({ Accounts: { get: mockGet } }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => ({ account: { id: 1 } }),
}));

vi.mock("lib", () => ({
  defaultAccountsListFilters: {},
  normalizeListFilters: (filters: object) => filters,
  applyHideDeletedEntitiesPreference: (filters: object) => filters,
}));

vi.mock("../queries/useHideDeletedEntitiesPreference", () => ({
  useHideDeletedEntitiesPreference: () => false,
}));

import { useInfiniteAccountsList } from "../queries/useInfiniteAccountsList";

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);

const emptyPage = { items: [], currentPage: 0, totalPages: 0 };

describe("useInfiniteAccountsList", () => {
  beforeEach(() => {
    mockGet.mockReset();
    mockGet.mockResolvedValue(emptyPage);
  });

  it("asks for each account's latest transactions when a limit is set", async () => {
    renderHook(() => useInfiniteAccountsList({ lastTransactionsLimit: 2 }), {
      wrapper,
    });

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    expect(mockGet.mock.calls[0][2]).toEqual({
      includeLastTransactions: true,
      lastTransactionsLimit: 2,
    });
  });

  it("keeps the plain list request for other consumers", async () => {
    renderHook(() => useInfiniteAccountsList({}), { wrapper });

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1));
    expect(mockGet.mock.calls[0][2]).toEqual({});
  });
});
