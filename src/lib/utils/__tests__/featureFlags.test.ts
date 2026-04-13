import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, unknown>();

vi.mock("@sito/dashboard-app", () => ({
  fromLocal: (key: string) => storage.get(key) ?? null,
  toLocal: (key: string, value: unknown) => {
    storage.set(key, value);
  },
  removeFromLocal: (key: string) => {
    storage.delete(key);
  },
}));

import type { AppFeatures } from "../../api/featureFlags/types";
import {
  clearPersistedFeatureFlags,
  isFeatureEnabledByDependencies,
  mergeAppFeatures,
  persistFeatureFlags,
  readPersistedFeatureFlags,
  sanitizeFeaturePayload,
} from "../featureFlags";

const defaults: AppFeatures = {
  balanceGreaterThanZero: false,
  currenciesEnabled: true,
  accountsEnabled: true,
  transactionsEnabled: true,
  subscriptionsEnabled: true,
};

describe("featureFlags utils", () => {
  beforeEach(() => {
    localStorage.clear();
    storage.clear();
  });

  it("sanitizes unknown payload values", () => {
    const payload = sanitizeFeaturePayload({
      balanceGreaterThanZero: true,
      currenciesEnabled: "yes",
      accountsEnabled: false,
      transactionsEnabled: null,
      subscriptionsEnabled: true,
      extra: true,
    });

    expect(payload).toEqual({
      balanceGreaterThanZero: true,
      accountsEnabled: false,
      subscriptionsEnabled: true,
    });
  });

  it("merges defaults, persisted and backend payload with backend precedence", () => {
    const merged = mergeAppFeatures({
      defaults,
      persisted: {
        currenciesEnabled: false,
        transactionsEnabled: true,
      },
      payload: {
        transactionsEnabled: false,
        subscriptionsEnabled: false,
      },
    });

    expect(merged).toEqual({
      balanceGreaterThanZero: false,
      currenciesEnabled: false,
      accountsEnabled: true,
      transactionsEnabled: false,
      subscriptionsEnabled: false,
    });
  });

  it("applies transaction-categories dependency from transactionsEnabled", () => {
    expect(
      isFeatureEnabledByDependencies(
        { ...defaults, transactionsEnabled: false },
        "transactionCategoriesEnabled",
      ),
    ).toBe(false);

    expect(
      isFeatureEnabledByDependencies(defaults, "transactionCategoriesEnabled"),
    ).toBe(true);
  });

  it("persists and clears feature flags from localStorage", () => {
    const storageKey = "feature-flags";
    persistFeatureFlags(storageKey, defaults);

    expect(readPersistedFeatureFlags(storageKey)).toEqual(defaults);

    clearPersistedFeatureFlags(storageKey);

    expect(readPersistedFeatureFlags(storageKey)).toBeNull();
  });
});
