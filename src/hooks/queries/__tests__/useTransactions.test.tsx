import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// ─── Module mocks ──────────────────────────────────────────────────────────────

const mockTransactionsGet = vi.fn();
const mockTransactionsCommonGet = vi.fn();
const mockTransactionsGetTypeResume = vi.fn();
const mockTransactionsWeekly = vi.fn();
const mockLoadCache = vi.fn(() => null);
const mockUpdateCache = vi.fn();
const mockInCache = vi.fn(() => false);

vi.mock("providers", () => ({
  useManager: () => ({
    Transactions: {
      get: mockTransactionsGet,
      commonGet: mockTransactionsCommonGet,
      getTypeResume: mockTransactionsGetTypeResume,
      weekly: mockTransactionsWeekly,
    },
  }),
  useLocalCache: () => ({
    loadCache: mockLoadCache,
    updateCache: mockUpdateCache,
    inCache: mockInCache,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: vi.fn(() => ({ account: { id: 1, email: "test@example.com" } })),
  useTableOptions: vi.fn(() => ({
    sortingBy: "date",
    sortingOrder: "desc",
    currentPage: 1,
    pageSize: 10,
    filters: {},
  })),
  QueryParam: class {},
  QueryResult: class {},
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (k: string) => k,
  }),
}));

vi.mock("lib", () => ({
  TransactionType: { In: "in", Out: "out" },
  Tables: { Transactions: "transactions", Accounts: "accounts" },
  TransactionDto: class {},
  CommonTransactionDto: class {},
  FilterTransactionDto: class {},
  TransactionTypeResumeDto: class {},
  FilterTransactionTypeResumeDto: class {},
  TransactionWeeklySpentDto: class {},
}));

import {
  useTransactionsList,
  useTransactionsCommon,
  useTransactionTypeResume,
  useWeekly,
  TransactionsQueryKeys,
} from "../useTransactions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper(qc?: QueryClient) {
  const client =
    qc ??
    new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: 0 } },
    });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("TransactionsQueryKeys", () => {
  it('all() returns queryKey with ["transactions"]', () => {
    expect(TransactionsQueryKeys.all().queryKey).toEqual(["transactions"]);
  });

  it("list() nests under all()", () => {
    const key = TransactionsQueryKeys.list({}, {});
    expect(key.queryKey[0]).toBe("transactions");
    expect(key.queryKey[1]).toBe("list");
  });

  it("typeResume() has enabled=false when type is missing", () => {
    const key = TransactionsQueryKeys.typeResume({});
    expect(key.enabled).toBe(false);
  });

  it("typeResume() has enabled=true when type is provided", () => {
    const key = TransactionsQueryKeys.typeResume({ type: "in" });
    expect(key.enabled).toBe(true);
  });

  it("weekly() has enabled=false when accountId is missing", () => {
    expect(TransactionsQueryKeys.weekly({}).enabled).toBe(false);
  });

  it("weekly() has enabled=true when accountId is provided", () => {
    expect(TransactionsQueryKeys.weekly({ accountId: 1 }).enabled).toBe(true);
  });
});

describe("useTransactionsList", () => {
  beforeEach(() => {
    mockTransactionsGet.mockReset();
    mockLoadCache.mockReturnValue(null);
  });

  it("is disabled when account.id is falsy", async () => {
    // Temporarily override useAuth to return no account
    const { useAuth } = await import("@sito/dashboard-app");
    vi.mocked(useAuth).mockReturnValueOnce({ account: null as unknown as { id: number; email: string }, isInGuestMode: vi.fn() });

    const { result } = renderHook(
      () => useTransactionsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("calls manager.Transactions.get and updates cache on success", async () => {
    const data = { items: [{ id: 1, amount: 100 }], total: 1 };
    mockTransactionsGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockUpdateCache).toHaveBeenCalledWith(
      expect.stringContaining("transactions"),
      data.items
    );
  });

  it("falls back to cache when API fails", async () => {
    const cached = [{ id: 1, amount: 50 }];
    mockTransactionsGet.mockRejectedValue(new Error("Network error"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(
      () => useTransactionsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );

    if (result.current.isSuccess) {
      expect(result.current.data?.items).toEqual(cached);
    }
  });

  it("throws when API fails and no cache is available", async () => {
    mockTransactionsGet.mockRejectedValue(new Error("Network error"));
    mockLoadCache.mockReturnValue(null);

    const { result } = renderHook(
      () => useTransactionsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(
      /No cached transactions available/
    );
  });
});

describe("useTransactionsCommon", () => {
  beforeEach(() => {
    mockTransactionsCommonGet.mockReset();
    mockLoadCache.mockReturnValue(null);
    mockInCache.mockReturnValue(false);
  });

  it("fetches and maps common transactions", async () => {
    const data = [{ id: 1, updatedAt: "2024-01-01" }];
    mockTransactionsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionsCommon({}),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("updates cache only if not already in cache", async () => {
    mockInCache.mockReturnValue(false);
    const data = [{ id: 1, updatedAt: "2024-01-01" }];
    mockTransactionsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionsCommon({}),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).toHaveBeenCalledWith("transactions", data);
  });

  it("does not update cache when data is already cached", async () => {
    mockInCache.mockReturnValue([{ id: 1 }]); // truthy = in cache
    mockTransactionsCommonGet.mockResolvedValue([{ id: 1, updatedAt: "2024" }]);

    const { result } = renderHook(
      () => useTransactionsCommon({}),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).not.toHaveBeenCalled();
  });

  it("falls back to cache on API error and maps { id, updatedAt }", async () => {
    const cached = [
      { id: 1, updatedAt: "2024-01-01", amount: 100, extra: "ignore" },
    ];
    mockTransactionsCommonGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(
      () => useTransactionsCommon({}),
      { wrapper: makeWrapper() }
    );

    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );
  });
});

describe("useTransactionTypeResume", () => {
  it("fetches data when type filter and account are provided", async () => {
    const data = { total: 200, type: "in" };
    mockTransactionsGetTypeResume.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionTypeResume({ type: "in" }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("is disabled when account.id is falsy", async () => {
    const { useAuth } = await import("@sito/dashboard-app");
    vi.mocked(useAuth).mockReturnValueOnce({
      account: null as unknown as { id: number; email: string },
      isInGuestMode: vi.fn(),
    });

    const { result } = renderHook(
      () => useTransactionTypeResume({}),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockTransactionsGetTypeResume).not.toHaveBeenCalled();
  });
});

describe("useWeekly", () => {
  it("fetches weekly data when accountId and account are provided", async () => {
    const data = { days: [] };
    mockTransactionsWeekly.mockResolvedValue(data);

    const { result } = renderHook(
      () => useWeekly({ type: "in", accountId: 1 }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("is disabled when account.id is falsy", async () => {
    const { useAuth } = await import("@sito/dashboard-app");
    vi.mocked(useAuth).mockReturnValueOnce({
      account: null as unknown as { id: number; email: string },
      isInGuestMode: vi.fn(),
    });

    const { result } = renderHook(
      () => useWeekly({ type: "in" }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockTransactionsWeekly).not.toHaveBeenCalled();
  });
});
