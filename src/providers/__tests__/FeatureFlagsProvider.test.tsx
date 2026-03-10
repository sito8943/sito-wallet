import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";

import { config } from "../../config";
import { FeatureFlagsProvider, useFeatureFlags } from "../FeatureFlagsProvider";

const mockGetFeatures = vi.fn();

const mockUseManager = vi.fn(() => ({
  FeatureFlags: {
    getFeatures: mockGetFeatures,
  },
}));

let mockAccount: { id?: number } | null = { id: 1 };

vi.mock("../useSWManager", () => ({
  useManager: () => mockUseManager(),
}));

vi.mock("@sito/dashboard-app", async () => {
  const actual = await vi.importActual<typeof import("@sito/dashboard-app")>(
    "@sito/dashboard-app",
  );

  return {
    ...actual,
    useAuth: () => ({
      account: mockAccount,
    }),
  };
});

const Wrapper = ({ children }: { children: ReactNode }) => (
  <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
);

describe("FeatureFlagsProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    mockGetFeatures.mockReset();
    mockUseManager.mockClear();
    mockAccount = { id: 1 };
  });

  it("hydrates features from localStorage merged over env defaults", () => {
    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ currenciesEnabled: false }),
    );

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper: Wrapper,
    });

    expect(result.current.features).toEqual({
      ...config.featureFlags.defaults,
      currenciesEnabled: false,
    });
  });

  it("refreshes features from backend and persists them", async () => {
    mockGetFeatures.mockResolvedValue({
      transactionsEnabled: false,
      accountsEnabled: false,
    });

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper: Wrapper,
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
    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ currenciesEnabled: false }),
    );

    const { result } = renderHook(() => useFeatureFlags(), {
      wrapper: Wrapper,
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
    localStorage.setItem(
      config.featureFlags.storageKey,
      JSON.stringify({ accountsEnabled: false }),
    );

    const { result, rerender } = renderHook(() => useFeatureFlags(), {
      wrapper: Wrapper,
    });

    expect(result.current.features.accountsEnabled).toBe(false);

    mockAccount = null;
    rerender();

    await waitFor(() => {
      expect(result.current.features).toEqual(config.featureFlags.defaults);
    });

    expect(localStorage.getItem(config.featureFlags.storageKey)).toBeNull();
  });
});
