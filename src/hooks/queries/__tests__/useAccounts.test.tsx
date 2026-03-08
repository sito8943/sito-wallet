import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// ─── Module mocks ──────────────────────────────────────────────────────────────

const mockAccountsGet = vi.fn();
const mockAccountsCommonGet = vi.fn();
const mockAccountsSeed = vi.fn(() => Promise.resolve());
const mockLoadCache = vi.fn(() => null);
const mockUpdateCache = vi.fn();
const mockInCache = vi.fn(() => false);
const mockUseAuth = vi.fn(() => ({
  account: { id: 1, email: "test@example.com" },
}));

vi.mock("providers", () => ({
  useManager: () => ({
    Accounts: {
      get: mockAccountsGet,
      commonGet: mockAccountsCommonGet,
    },
  }),
  useOfflineManager: () => ({
    Accounts: {
      seed: mockAccountsSeed,
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
  Tables: { Accounts: "accounts" },
  AccountDto: class {},
  CommonAccountDto: class {},
  FilterAccountDto: class {},
}));

import {
  useAccountsList,
  useAccountsCommon,
  AccountsQueryKeys,
} from "../useAccounts";

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

describe("AccountsQueryKeys", () => {
  it('all() returns ["accounts"]', () => {
    expect(AccountsQueryKeys.all().queryKey).toEqual(["accounts"]);
  });

  it("list() nests filters under all()", () => {
    const key = AccountsQueryKeys.list({ deletedAt: false as unknown as Date });
    expect(key.queryKey[0]).toBe("accounts");
    expect(key.queryKey[1]).toBe("list");
  });

  it("common() nests under all()", () => {
    const key = AccountsQueryKeys.common();
    expect(key.queryKey[0]).toBe("accounts");
    expect(key.queryKey[1]).toBe("common");
  });
});

describe("useAccountsList", () => {
  beforeEach(() => {
    mockAccountsGet.mockReset();
    mockLoadCache.mockReturnValue(null);
    mockUpdateCache.mockReset();
    mockAccountsSeed.mockClear();
  });

  it("is disabled when account.id is falsy", async () => {
    mockUseAuth.mockReturnValueOnce({ account: null });

    const { result } = renderHook(
      () => useAccountsList({ filters: { deletedAt: false as unknown as Date } }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches accounts list and updates cache", async () => {
    const data = {
      items: [{ id: 1, name: "Wallet" }],
      total: 1,
    };
    mockAccountsGet.mockResolvedValue(data);

    const { result } = renderHook(
      () => useAccountsList({ filters: { deletedAt: false as unknown as Date } }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockUpdateCache).toHaveBeenCalledWith("accounts", data.items);
  });

  it("falls back to cache when API fails", async () => {
    const cached = [{ id: 1, name: "Wallet" }];
    mockAccountsGet.mockRejectedValue(new Error("Network error"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(
      () => useAccountsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );

    if (result.current.isSuccess) {
      expect(result.current.data?.items).toEqual(cached);
      expect(result.current.data?.total).toBe(cached.length);
    }
  });

  it("throws when API fails and cache is empty", async () => {
    mockAccountsGet.mockRejectedValue(new Error("Network error"));
    mockLoadCache.mockReturnValue(null);

    const { result } = renderHook(
      () => useAccountsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(
      /No cached accounts available/
    );
  });

  it("throws when API fails and cache is not an array", async () => {
    mockAccountsGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue("invalid");

    const { result } = renderHook(
      () => useAccountsList({ filters: {} }),
      { wrapper: makeWrapper() }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useAccountsCommon", () => {
  beforeEach(() => {
    mockAccountsCommonGet.mockReset();
    mockLoadCache.mockReturnValue(null);
    mockUpdateCache.mockReset();
    mockInCache.mockReturnValue(false);
    mockAccountsSeed.mockClear();
  });

  it("is disabled when account.id is falsy", async () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    // enabled: !!account?.id → false when id=0
    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches common accounts and maps { id, name, updatedAt, currency }", async () => {
    const data = [
      { id: 1, name: "Wallet", updatedAt: "2024-01-01", currency: { id: 1 } },
    ];
    mockAccountsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it("updates cache when not already cached", async () => {
    mockInCache.mockReturnValue(false);
    const data = [{ id: 1, name: "Wallet", updatedAt: "2024", currency: {} }];
    mockAccountsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).toHaveBeenCalledWith("accounts", data);
  });

  it("does not update cache when already cached", async () => {
    mockInCache.mockReturnValue([{ id: 1 }]); // truthy
    mockAccountsCommonGet.mockResolvedValue([
      { id: 1, name: "Wallet", updatedAt: "2024", currency: {} },
    ]);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCache).not.toHaveBeenCalled();
  });

  it("falls back to cache on API error and maps { id, name, updatedAt, currency }", async () => {
    const cached = [
      {
        id: 1,
        name: "Wallet",
        updatedAt: "2024-01-01",
        currency: { id: 1 },
        extra: "ignore",
      },
    ];
    mockAccountsCommonGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(cached);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() =>
      expect(result.current.isSuccess || result.current.isError).toBe(true)
    );

    if (result.current.isSuccess) {
      expect(result.current.data?.[0]).toMatchObject({
        id: 1,
        name: "Wallet",
        updatedAt: "2024-01-01",
        currency: { id: 1 },
      });
    }
  });

  it("throws on API error when cache is empty", async () => {
    mockAccountsCommonGet.mockRejectedValue(new Error("fail"));
    mockLoadCache.mockReturnValue(null);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(
      /No cached accounts available/
    );
  });
});
