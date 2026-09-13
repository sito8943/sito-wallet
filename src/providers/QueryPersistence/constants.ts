export const QUERY_CACHE_STORAGE_KEY = "sito-wallet:query-cache";

// Tracks which account the persisted cache belongs to, so a second user
// signing in on the same device never reads the previous one's data back.
export const QUERY_CACHE_OWNER_STORAGE_KEY = "sito-wallet:query-cache-owner";

// Offline reads stay useful for a day; past that a cold start refetches.
export const QUERY_CACHE_MAX_AGE_MS = 1000 * 60 * 60 * 24;

export const QUERY_CACHE_THROTTLE_MS = 1000;
