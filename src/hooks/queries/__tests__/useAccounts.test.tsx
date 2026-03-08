import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const mockAccountsGet = vi.fn();
const mockAccountsCommonGet = vi.fn();
const mockOfflineAccountsGet = vi.fn();
const mockOfflineAccountsCommonGet = vi.fn();
const mockAccountsSeed = vi.fn(() => Promise.resolve());
const mockUseAuth = vi.fn();

vi.mock("providers", () => ({
  useManager: () => ({
    Accounts: {
      get: mockAccountsGet,
      commonGet: mockAccountsCommonGet,
    },
  }),
  useOfflineManager: () => ({
    Accounts: {
      get: mockOfflineAccountsGet,
      commonGet: mockOfflineAccountsCommonGet,
      seed: mockAccountsSeed,
    },
  }),
}));

vi.mock("@sito/dashboard-app", () => ({
  useAuth: () => mockUseAuth(),
  QueryResult: class {},
}));

vi.mock("lib", () => ({
  AccountDto: class {},
  CommonAccountDto: class {},
  FilterAccountDto: class {},
}));

import {
  useAccountsList,
  useAccountsCommon,
  AccountsQueryKeys,
} from "../useAccounts";

function makeWrapper() {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
}

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
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockAccountsGet.mockReset();
    mockOfflineAccountsGet.mockReset();
    mockAccountsSeed.mockClear();
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: null });

    const { result } = renderHook(
      () => useAccountsList({ filters: { deletedAt: false as unknown as Date } }),
      { wrapper: makeWrapper() }
    );

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches accounts list and seeds IndexedDB", async () => {
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
    expect(mockAccountsSeed).toHaveBeenCalledWith(data.items);
    expect(mockOfflineAccountsGet).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB when API fails", async () => {
    const fallback = {
      items: [{ id: 1, name: "Wallet" }],
      total: 1,
    };
    mockAccountsGet.mockRejectedValue(new Error("Network error"));
    mockOfflineAccountsGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useAccountsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
    expect(mockOfflineAccountsGet).toHaveBeenCalledWith(undefined, {});
  });

  it("throws when API and IndexedDB both fail", async () => {
    mockAccountsGet.mockRejectedValue(new Error("Network error"));
    mockOfflineAccountsGet.mockRejectedValue(new Error("IndexedDB error"));

    const { result } = renderHook(() => useAccountsList({ filters: {} }), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toMatch(/IndexedDB error/);
  });
});

describe("useAccountsCommon", () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      account: { id: 1, email: "test@example.com" },
    });
    mockAccountsCommonGet.mockReset();
    mockOfflineAccountsCommonGet.mockReset();
    mockAccountsSeed.mockClear();
  });

  it("is disabled when account.id is falsy", () => {
    mockUseAuth.mockReturnValueOnce({ account: { id: 0, email: "" } });

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("fetches common accounts without reseeding partial DTOs", async () => {
    const data = [
      { id: 1, name: "Wallet", updatedAt: "2024-01-01", currency: { id: 1 } },
    ];
    mockAccountsCommonGet.mockResolvedValue(data);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
    expect(mockAccountsSeed).not.toHaveBeenCalled();
  });

  it("falls back to IndexedDB for common accounts", async () => {
    const fallback = [
      { id: 1, name: "Wallet", updatedAt: "2024-01-01", currency: { id: 1 } },
    ];
    mockAccountsCommonGet.mockRejectedValue(new Error("fail"));
    mockOfflineAccountsCommonGet.mockResolvedValue(fallback);

    const { result } = renderHook(() => useAccountsCommon(), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(fallback);
  });
});
