import { afterEach, describe, expect, it, vi } from "vitest";

import {
  QUERY_CACHE_OWNER_STORAGE_KEY,
  QUERY_CACHE_STORAGE_KEY,
} from "../constants";
import {
  clearPersistedQueryCache,
  createQueryPersister,
  readQueryCacheOwner,
  writeQueryCacheOwner,
} from "../utils";

afterEach(() => {
  vi.restoreAllMocks();
  window.localStorage.clear();
});

describe("query persistence utils", () => {
  it("creates a persister when storage is usable", () => {
    expect(createQueryPersister()).not.toBeNull();
  });

  it("returns no persister when storage throws", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(createQueryPersister()).toBeNull();
  });

  it("round-trips the cache owner", () => {
    expect(readQueryCacheOwner()).toBe("");

    writeQueryCacheOwner("42");

    expect(readQueryCacheOwner()).toBe("42");
  });

  it("reads an empty owner when storage throws", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(readQueryCacheOwner()).toBe("");
  });

  it("drops both the cache and its owner", () => {
    window.localStorage.setItem(QUERY_CACHE_STORAGE_KEY, "{}");
    writeQueryCacheOwner("42");

    clearPersistedQueryCache();

    expect(window.localStorage.getItem(QUERY_CACHE_STORAGE_KEY)).toBeNull();
    expect(
      window.localStorage.getItem(QUERY_CACHE_OWNER_STORAGE_KEY),
    ).toBeNull();
  });
});
