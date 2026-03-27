import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const mockCurrenciesGet = vi.fn();
const mockCurrenciesCommonGet = vi.fn();
const mockOfflineCurrenciesGet = vi.fn();
const mockOfflineCurrenciesCommonGet = vi.fn();
const mockCurrenciesSeed = vi.fn(() => Promise.resolve());
const mockUseAuth = vi.fn();

vi.mock("providers", () => ({
  useManager: () => ({
    Currencies: {
      get: mockCurrenciesGet,
      commonGet: mockCurrenciesCommonGet,
    },
  }),
  useOfflineManager: () => ({
    Currencies: {
      get: mockOfflineCurrenciesGet,
      commonGet: mockOfflineCurrenciesCommonGet,
      seed: mockCurrenciesSeed,
    },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  QueryResult: class {},
}));

vi.mock("lib", () => ({
  CurrencyDto: class {},
  CommonCurrencyDto: class {},
  FilterCurrencyDto: class {},
  applyHideDeletedEntitiesPreference: (
    filters: Record<string, unknown>,
    hideDeletedEntities?: boolean,
  ) =>
    hideDeletedEntities ? { ...filters, softDeleteScope: "ACTIVE" } : filters,
  defaultCurrenciesListFilters: {
    softDeleteScope: "ACTIVE",
  },
  normalizeListFilters: (filters: Record<string, unknown> | undefined) =>
    filters ?? { softDeleteScope: "ACTIVE" },
  normalizeCommonFilters: (filters?: Record<string, unknown>) => filters ?? {},
  fetchCurrenciesList: async (
    _manager: unknown,
    _offlineManager: unknown,
    filters: Record<string, unknown>,
  ) => {
    try {
      const result = await mockCurrenciesGet(undefined, { ...filters });
      mockCurrenciesSeed(result.items).catch(() => {});
      return result;
    } catch {
      return await mockOfflineCurrenciesGet(undefined, { ...filters });
    }
  },
}));

vi.mock("../useProfile", () => ({
  useHideDeletedEntitiesPreference: () => false,
}));

import {
  useCurrenciesList,
  useCurrenciesCommon,
  CurrenciesQueryKeys,
} from "../useCurrencies";

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

describe("CurrenciesQueryKeys", () => {
  it('all() returns ["currencies"]', () => {
    expect(CurrenciesQueryKeys.all().queryKey).toEqual(["currencies"]);
  });

  it("list() nests under all()", () => {
    const key = CurrenciesQueryKeys.list({ softDeleteScope: "ACTIVE" });
    expect(key.queryKey[0]).toBe("currencies");
    expect(key.queryKey[1]).toBe("list");
  });

  it("common() nests under all()", () => {
    const key = CurrenciesQueryKeys.common();
    expect(key.queryKey[0]).toBe("currencies");
    expect(key.queryKey[1]).toBe("common");
  });
});

describe("useCurrenciesList", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockCurrenciesGet.mockReset();
    mockOfflineCurrenciesGet.mockReset();
    mockCurrenciesSeed.mockClear();
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(
      () => useCurrenciesList({ filters: { softDeleteScope: "ACTIVE" } }),
      { wrapper: makeWrapper() },
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches currencies list and seeds IndexedDB", async () => {
    const data = {
      items: [{ id: 1, name: "Euro", symbol: "EUR" }],
      total: 1,
    };
    mockCurrenciesGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useCurrenciesList({ filters: { softDeleteScope: "ACTIVE" } }),
      { wrapper: makeWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockCurrenciesSeed).toHaveBeenCalledWith(data.items);
    expect(mockOfflineCurrenciesGet).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB when API fails", async () => {
    const fallback = {
      items: [{ id: 1, name: "Euro", symbol: "EUR" }],
      total: 1,
    };
    mockCurrenciesGet.mockRejectedValue(new Error("Network error"));
    mockOfflineCurrenciesGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useCurrenciesList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
    expect(mockOfflineCurrenciesGet).toHaveBeenCalledWith(undefined, {});
  });

  it("throws when API and IndexedDB both fail", async () => {
    mockCurrenciesGet.mockRejectedValue(new Error("Network error"));
    mockOfflineCurrenciesGet.mockRejectedValue(new Error("IndexedDB error"));

    const { result } = renderHook(() => useCurrenciesList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/IndexedDB error/);
  });
});

describe("useCurrenciesCommon", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockCurrenciesCommonGet.mockReset();
    mockOfflineCurrenciesCommonGet.mockReset();
    mockCurrenciesSeed.mockClear();
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches common currencies without reseeding partial DTOs", async () => {
    const data = [
      { id: 1, name: "Euro", symbol: "EUR", updatedAt: "2024-01-01" },
    ];
    mockCurrenciesCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockCurrenciesSeed).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB for common currencies", async () => {
    const fallback = [
      { id: 1, name: "Euro", symbol: "EUR", updatedAt: "2024-01-01" },
    ];
    mockCurrenciesCommonGet.mockRejectedValue(new Error("fail"));
    mockOfflineCurrenciesCommonGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });
});
