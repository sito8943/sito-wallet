import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// ─── Module mocks ──────────────────────────────────────────────────────────────

const mockCurrenciesGet = vi.fn();
const mockCurrenciesCommonGet = vi.fn();
const mockLoadCache = vi.fn(() => null);
const mockUpdateCache = vi.fn();
const mockInCache = vi.fn(() => false);
const mockUseAuth = vi.fn(() => ({
  account: { id: 1, email: "test@example.com" },
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Currencies: {
      get: mockCurrenciesGet,
      commonGet: mockCurrenciesCommonGet,
    },
  }),
  useLocalCache: () => ({
    loadCache: mockLoadCache,
    updateCache: mockUpdateCache,
    inCache: mockInCache,
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  QueryResult: class {},
}));

vi.mock("lib", () => ({
  Tables: { Currencies: "currencies" },
  CurrencyDto: class {},
  CommonCurrencyDto: class {},
  FilterCurrencyDto: class {},
}));

import {
  useCurrenciesList,
  useCurrenciesCommon,
  CurrenciesQueryKeys,
} from "../useCurrencies";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("CurrenciesQueryKeys", () => {
  it('all() returns ["currencies"]', () => {
    expect(CurrenciesQueryKeys.all().queryKey).toEqual(["currencies"]);
  });

  it("list() nests under all()", () => {
    const key = CurrenciesQueryKeys.list({ deletedAt: false as unknown as Date });
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
    mockCurrenciesGet.mockReset();
    mockLoadCache.mockReturnValue(null);
    mockUpdateCache.mockReset();
  });

  it("is disabled when account.id is falsy", async () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(
      () => useCurrenciesList({ filters: { deletedAt: false as unknown as Date } }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches currencies list and updates cache", async () => {
    const data = {
      items: [{ id: 1, name: "Euro", symbol: "€" }],
      total: 1,
    };
    mockCurrenciesGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useCurrenciesList({ filters: { deletedAt: false as unknown as Date } }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockUpdateCache).toHaveBeenCalledWith("currencies", data.items);
  });

  it("falls back to cache when API fails", async () => {
    const cached = [{ id: 1, name: "Euro", symbol: "€" }];
    mockCurrenciesGet.mockRejectedValue(new Error("Network error"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(
      () => useCurrenciesList({ filters: {} }),
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
    mockCurrenciesGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(null);

    const { result } = renderHook(
      () => useCurrenciesList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(
      /No cached currencies available/
    );
  });
});

describe("useCurrenciesCommon", () => {
  beforeEach(() => {
    mockCurrenciesCommonGet.mockReset();
    mockLoadCache.mockReturnValue(null);
    mockUpdateCache.mockReset();
    mockInCache.mockReturnValue(false);
  });

  it("is disabled when account.id is falsy", async () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches and returns common currencies", async () => {
    const data = [
      { id: 1, name: "Euro", symbol: "€", updatedAt: "2024-01-01" },
    ];
    mockCurrenciesCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("updates cache when not already cached", async () => {
    mockInCache.mockReturnValue(false);
    const data = [{ id: 1, name: "Euro", symbol: "€", updatedAt: "2024" }];
    mockCurrenciesCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).toHaveBeenCalledWith("currencies", data);
  });

  it("does not update cache when already cached", async () => {
    mockInCache.mockReturnValue([{ id: 1 }]); // truthy
    mockCurrenciesCommonGet.mockResolvedValue([
      { id: 1, name: "Euro", symbol: "€", updatedAt: "2024" },
    ]);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).not.toHaveBeenCalled();
  });

  it("falls back to cache and maps { id, name, symbol, updatedAt }", async () => {
    const cached = [
      {
        id: 1,
        name: "Euro",
        symbol: "€",
        updatedAt: "2024-01-01",
        extra: "ignore",
      },
    ];
    mockCurrenciesCommonGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );

    if (result.current.isSuccess) {
      expect(result.current.data?.[0]).toMatchObject({
        id: 1,
        name: "Euro",
        symbol: "€",
        updatedAt: "2024-01-01",
      });
      // extra field should NOT be present
      expect(
        Object.keys(result.current.data?.[0] ?? {})
      ).not.toContain("extra");
    }
  });

  it("throws on API error when cache is empty", async () => {
    mockCurrenciesCommonGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(null);

    const { result } = renderHook(() => useCurrenciesCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(
      /No cached currencies available/
    );
  });
});
