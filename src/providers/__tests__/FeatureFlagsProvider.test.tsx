import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import type { AppFeatures } from "../../lib/api/featureFlags/types";

import { config } from "../../config";

const { mockGetFeatures, mockUseManager, mockUseAuth } = vi.hoisted(() => {
  const mockGetFeatures = vi.fn();
  const mockUseManager = vi.fn(() => ({
    FeatureFlags: {
      getFeatures: mockGetFeatures,
    },
  }));
  const mockUseAuth = vi.fn(() => ({
    account: { id: 1 },
  }));

  return {
    mockGetFeatures,
    mockUseManager,
    mockUseAuth,
  };
});

vi.mock("../useSWManager", () => ({
  useManager: () => mockUseManager(),
}));

vi.mock("providers/useSWManager", () => ({
  useManager: () => mockUseManager(),
}));

vi.mock("/src/providers/useSWManager", () => ({
  useManager: () => mockUseManager(),
}));

vi.mock("/src/providers/useSWManager.ts", () => ({
  useManager: () => mockUseManager(),
}));

vi.mock("lib", () => {
  const sanitize = (value: unknown): Partial<AppFeatures> => {
    if (typeof value !== "object" || value === null) return {};

    const next: Partial<AppFeatures> = {};
    for (const key of [
      "balanceGreaterThanZero",
      "currenciesEnabled",
      "accountsEnabled",
      "transactionsEnabled",
    ] as const) {
      if (typeof value[key] === "boolean") {
        next[key] = value[key];
      }
    }

    return next;
  };

  return {
    readPersistedFeatureFlags: (storageKey: string) => {
      const raw = localStorage.getItem(storageKey);
      return raw ? sanitize(JSON.parse(raw)) : null;
    },
    persistFeatureFlags: (storageKey: string, features: AppFeatures) => {
      localStorage.setItem(storageKey, JSON.stringify(features));
    },
    clearPersistedFeatureFlags: (storageKey: string) => {
      localStorage.removeItem(storageKey);
    },
    mergeAppFeatures: ({
      defaults,
      persisted,
      payload,
    }: {
      defaults: AppFeatures;
      persisted?: Partial<AppFeatures> | null;
      payload?: Partial<AppFeatures> | null;
    }) => ({
      ...defaults,
      ...sanitize(persisted),
      ...sanitize(payload),
    }),
    isFeatureEnabledByDependencies: (features: AppFeatures, key: string) => {
      if (key === "transactionCategoriesEnabled") {
        return features.transactionsEnabled;
      }

      return features[key as keyof AppFeatures];
    },
  };
});

vi.mock("@sito/dashboard-app", () => {
  class APIClient {
    api = {
      get: async () => ({}),
      post: async () => ({}),
      patch: async () => ({}),
      doQuery: async () => ({}),
      defaultTokenAcquirer: () => ({}),
    };
  }

  class BaseClient extends APIClient {
    table = "";

    constructor(table?: string) {
      super();
      this.table = table ?? "";
    }
  }

  class AuthClient extends APIClient {}

  class IManager {
    auth: AuthClient = new AuthClient();
  }

  return {
    APIClient,
    BaseClient,
    AuthClient,
    IManager,
    Methods: {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      PATCH: "PATCH",
      DELETE: "DELETE",
    },
    parseQueries: () => ({}),
    useManager: () => mockUseManager(),
    useAuth: () => mockUseAuth(),
    fromLocal: (key: string) => {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    },
    toLocal: (key: string, value: unknown) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    removeFromLocal: (key: string) => {
      localStorage.removeItem(key);
    },
  };
});

const loadFeatureFlagsModule = async () => import("../FeatureFlags");

describe("FeatureFlagsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetFeatures.mockReset();
    mockUseManager.mockClear();
    mockUseAuth.mockReturnValue({
      account: { id: 1 },
    });
  });

  it("hydrates features from localStorage merged over env defaults", async () => {
    const { FeatureFlagsProvider, useFeatureFlags } = await loadFeatureFlagsModule();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    );

    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ currenciesEnabled: false }),
    );

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper,
    });

    expect(result.current.features).toEqual({
      ...config.featureFlags.defaults,
      currenciesEnabled: false,
    });
  });

  it("refreshes features from backend and persists them", async () => {
    const { FeatureFlagsProvider, useFeatureFlags } = await loadFeatureFlagsModule();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    );

    mockGetFeatures.mockResolvedValue({
      transactionsEnabled: false,
      accountsEnabled: false,
    });

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper,
    });

    await act(async () => {
      await result.current.refreshFeatures();
    });

    expect(mockGetFeatures).toHaveBeenCalledTimes(1);
    expect(result.current.features).toEqual({
      ...config.featureFlags.defaults,
      transactionsEnabled: false,
      accountsEnabled: false,
    });

    expect(
      JSON.parse(localStorage.getItem(config.featureFlags.storageKey) ?? "{}"),
    ).toEqual(result.current.features);
  });

  it("clears persisted flags and restores env defaults", async () => {
    const { FeatureFlagsProvider, useFeatureFlags } = await loadFeatureFlagsModule();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    );

    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ currenciesEnabled: false }),
    );

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper,
    });

    act(() => {
      result.current.clearFeatures();
    });

    await waitFor(() => {
      expect(result.current.features).toEqual(config.featureFlags.defaults);
    });

    expect(localStorage.getItem(config.featureFlags.storageKey)).toBeNull();
  });

  it("auto-clears feature flags when user logs out", async () => {
    const { FeatureFlagsProvider, useFeatureFlags } = await loadFeatureFlagsModule();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
    );

    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ accountsEnabled: false }),
    );

    const { result, rerender } = renderHook(() => useFeatureFlags(), {
      wrapper,
    });

    expect(result.current.features.accountsEnabled).toBe(false);

    mockUseAuth.mockReturnValue({
      account: null,
    });
    rerender();

    await waitFor(() => {
      expect(result.current.features).toEqual(config.featureFlags.defaults);
    });

    expect(localStorage.getItem(config.featureFlags.storageKey)).toBeNull();
  });
});
