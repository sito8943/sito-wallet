import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const mockTransactionsGet = vi.fn();
const mockTransactionsCommonGet = vi.fn();
const mockTransactionsGetTypeResume = vi.fn();
const mockTransactionsGetGroupedByType = vi.fn();
const mockTransactionsWeekly = vi.fn();
const mockOfflineTransactionsGet = vi.fn();
const mockOfflineTransactionsCommonGet = vi.fn();
const mockOfflineTransactionsGetTypeResume = vi.fn();
const mockOfflineTransactionsGetGroupedByType = vi.fn();
const mockOfflineTransactionsWeekly = vi.fn();
const mockTransactionsSeed = vi.fn(() => Promise.resolve());
const mockUseAuth = vi.fn();

vi.mock("providers", () => ({
  useManager: () => ({
    Transactions: {
      get: mockTransactionsGet,
      commonGet: mockTransactionsCommonGet,
      getTypeResume: mockTransactionsGetTypeResume,
      getGroupedByType: mockTransactionsGetGroupedByType,
      weekly: mockTransactionsWeekly,
    },
  }),
  useOfflineManager: () => ({
    Transactions: {
      get: mockOfflineTransactionsGet,
      commonGet: mockOfflineTransactionsCommonGet,
      getTypeResume: mockOfflineTransactionsGetTypeResume,
      getGroupedByType: mockOfflineTransactionsGetGroupedByType,
      weekly: mockOfflineTransactionsWeekly,
      seed: mockTransactionsSeed,
    },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  useTableOptions: () => ({
    sortingBy: "date",
    sortingOrder: "desc",
    currentPage: 1,
    pageSize: 10,
    filters: {},
  }),
  QueryParam: class {},
  QueryResult: class {},
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("lib", () => ({
  TransactionType: { In: "in", Out: "out" },
  TransactionDto: class {},
  CommonTransactionDto: class {},
  FilterTransactionDto: class {},
  defaultTransactionsListFilters: { softDeleteScope: "ACTIVE" },
  normalizeListFilters: (filters: Record<string, unknown> | undefined) =>
    filters ?? { softDeleteScope: "ACTIVE" },
  normalizeCommonFilters: (filters?: Record<string, unknown>) => filters ?? {},
  TransactionTypeResumeDto: class {},
  FilterTransactionTypeResumeDto: class {},
  TransactionTypeGroupedDto: class {},
  FilterTransactionGroupedByTypeDto: class {},
  TransactionWeeklySpentDto: class {},
}));

import {
  useTransactionsList,
  useTransactionsCommon,
  useTransactionTypeResume,
  useTransactionsGroupedByType,
  useWeekly,
  TransactionsQueryKeys,
} from "../useTransactions";

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

  it("weekly() has enabled=false when account is missing", () => {
    expect(TransactionsQueryKeys.weekly({}).enabled).toBe(false);
  });

  it("weekly() has enabled=true when account is provided", () => {
    expect(TransactionsQueryKeys.weekly({ account: [1] }).enabled).toBe(true);
  });

  it("groupedByType() has enabled=true when accountId is provided", () => {
    expect(TransactionsQueryKeys.groupedByType({ accountId: 1 }).enabled).toBe(
      true,
    );
  });
});

describe("useTransactionsList", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockTransactionsGet.mockReset();
    mockOfflineTransactionsGet.mockReset();
    mockTransactionsSeed.mockClear();
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: null });

    const { result } = renderHook(() => useTransactionsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches transactions list and seeds IndexedDB", async () => {
    const data = { items: [{ id: 1, amount: 100 }], total: 1 };
    mockTransactionsGet.mockResolvedValue(data);

    const { result } = renderHook(() => useTransactionsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockTransactionsSeed).toHaveBeenCalledWith(data.items);
    expect(mockOfflineTransactionsGet).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB when API fails", async () => {
    const fallback = { items: [{ id: 1, amount: 50 }], total: 1 };
    mockTransactionsGet.mockRejectedValue(new Error("Network error"));
    mockOfflineTransactionsGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useTransactionsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
    expect(mockOfflineTransactionsGet).toHaveBeenCalledWith(
      expect.objectContaining({
        sortingBy: "date",
        sortingOrder: "desc",
        currentPage: 1,
        pageSize: 10,
      }),
      {}
    );
  });

  it("throws when API and IndexedDB both fail", async () => {
    mockTransactionsGet.mockRejectedValue(new Error("Network error"));
    mockOfflineTransactionsGet.mockRejectedValue(new Error("IndexedDB error"));

    const { result } = renderHook(() => useTransactionsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/IndexedDB error/);
  });
});

describe("useTransactionsCommon", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockTransactionsCommonGet.mockReset();
    mockOfflineTransactionsCommonGet.mockReset();
    mockTransactionsSeed.mockClear();
  });

  it("fetches common transactions without reseeding partial DTOs", async () => {
    const data = [{ id: 1, updatedAt: "2024-01-01" }];
    mockTransactionsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useTransactionsCommon({}), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockTransactionsSeed).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB for common transactions", async () => {
    const fallback = [{ id: 1, updatedAt: "2024-01-01" }];
    mockTransactionsCommonGet.mockRejectedValue(new Error("fail"));
    mockOfflineTransactionsCommonGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useTransactionsCommon({}), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });
});

describe("useTransactionTypeResume", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockTransactionsGetTypeResume.mockReset();
    mockOfflineTransactionsGetTypeResume.mockReset();
  });

  it("fetches data when the API succeeds", async () => {
    const data = { total: 200, type: "in" };
    mockTransactionsGetTypeResume.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionTypeResume({ type: "in" }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("falls back to IndexedDB when the API fails", async () => {
    const fallback = { total: 0, type: "in" };
    mockTransactionsGetTypeResume.mockRejectedValue(new Error("fail"));
    mockOfflineTransactionsGetTypeResume.mockResolvedValue(fallback);

    const { result } = renderHook(
      () => useTransactionTypeResume({ type: "in" }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: null });

    const { result } = renderHook(() => useTransactionTypeResume({}), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockTransactionsGetTypeResume).not.toHaveBeenCalled();
  });
});

describe("useWeekly", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockTransactionsWeekly.mockReset();
    mockOfflineTransactionsWeekly.mockReset();
  });

  it("fetches weekly data when the API succeeds", async () => {
    const data = { days: [] };
    mockTransactionsWeekly.mockResolvedValue(data);

    const { result } = renderHook(() => useWeekly({ type: "in", account: [1] }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockTransactionsWeekly).toHaveBeenCalledWith({
      type: "in",
      account: [1],
    });
  });

  it("falls back to IndexedDB when the API fails", async () => {
    const fallback = { days: [] };
    mockTransactionsWeekly.mockRejectedValue(new Error("fail"));
    mockOfflineTransactionsWeekly.mockResolvedValue(fallback);

    const { result } = renderHook(() => useWeekly({ type: "in", account: [1] }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: null });

    const { result } = renderHook(() => useWeekly({ type: "in" }), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockTransactionsWeekly).not.toHaveBeenCalled();
  });
});

describe("useTransactionsGroupedByType", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockTransactionsGetGroupedByType.mockReset();
    mockOfflineTransactionsGetGroupedByType.mockReset();
  });

  it("fetches grouped totals when the API succeeds", async () => {
    const data = { incomeTotal: 120.5, expenseTotal: 35.25 };
    mockTransactionsGetGroupedByType.mockResolvedValue(data);

    const { result } = renderHook(
      () => useTransactionsGroupedByType({ accountId: 15 }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("falls back to IndexedDB when the API fails", async () => {
    const fallback = { incomeTotal: 0, expenseTotal: 0 };
    mockTransactionsGetGroupedByType.mockRejectedValue(new Error("fail"));
    mockOfflineTransactionsGetGroupedByType.mockResolvedValue(fallback);

    const { result } = renderHook(
      () => useTransactionsGroupedByType({ accountId: 15 }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });

  it("is disabled when accountId is missing", () => {
    const { result } = renderHook(
      () => useTransactionsGroupedByType({ accountId: 0 }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
    expect(mockTransactionsGetGroupedByType).not.toHaveBeenCalled();
  });
});
