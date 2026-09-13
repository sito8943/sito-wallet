import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import {
  QUERY_CACHE_OWNER_STORAGE_KEY,
  QUERY_CACHE_STORAGE_KEY,
  QUERY_CACHE_THROTTLE_MS,
} from "./constants";
import type { QueryPersister } from "./types";

/**
 * Storage access throws in private-mode Safari and when cookies are blocked,
 * so every caller has to tolerate persistence simply not being available.
 */
const getStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;

  try {
    const probeKey = `${QUERY_CACHE_STORAGE_KEY}:probe`;
    window.localStorage.setItem(probeKey, "1");
    window.localStorage.removeItem(probeKey);
    return window.localStorage;
  } catch {
    return null;
  }
};

export const createQueryPersister = (): QueryPersister | null => {
  const storage = getStorage();

  if (!storage) return null;

  return createSyncStoragePersister({
    storage,
    key: QUERY_CACHE_STORAGE_KEY,
    throttleTime: QUERY_CACHE_THROTTLE_MS,
  });
};

export const readQueryCacheOwner = (): string => {
  try {
    return window.localStorage.getItem(QUERY_CACHE_OWNER_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
};

export const writeQueryCacheOwner = (owner: string): void => {
  try {
    window.localStorage.setItem(QUERY_CACHE_OWNER_STORAGE_KEY, owner);
  } catch {
    // Nothing to do: persistence is best effort.
  }
};

export const clearPersistedQueryCache = (): void => {
  try {
    window.localStorage.removeItem(QUERY_CACHE_STORAGE_KEY);
    window.localStorage.removeItem(QUERY_CACHE_OWNER_STORAGE_KEY);
  } catch {
    // Nothing to do: persistence is best effort.
  }
};
