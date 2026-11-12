import { RETURN_TO_STORAGE_KEY, RETURN_TO_TTL_MS } from "./constants";
import type { StoredReturnTo } from "./types";

/**
 * True for an in-app absolute path ("/x?y"). Rejects absolute URLs,
 * protocol-relative ("//evil.com") and backslash tricks ("/\\evil.com"), so
 * the stored value can never send the user to another site.
 */
export const isSafeReturnPath = (path: unknown): path is string =>
  typeof path === "string" &&
  path.startsWith("/") &&
  !path.startsWith("//") &&
  !path.startsWith("/\\");

const isStoredReturnTo = (value: unknown): value is StoredReturnTo => {
  if (!value || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return isSafeReturnPath(record.path) && typeof record.savedAt === "number";
};

/** Remembers the page to reopen after signing in (ignored when unsafe). */
export const saveReturnTo = (path: string, now: number = Date.now()): void => {
  if (!isSafeReturnPath(path)) return;
  const value: StoredReturnTo = { path, savedAt: now };
  try {
    sessionStorage.setItem(RETURN_TO_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode): the user lands on home instead.
  }
};

/** Forgets the stored page without reading it. */
export const clearReturnTo = (): void => {
  try {
    sessionStorage.removeItem(RETURN_TO_STORAGE_KEY);
  } catch {
    // Nothing stored or storage unavailable.
  }
};

/**
 * Reads the stored page without removing it. Null when there is none, it is
 * invalid or older than `RETURN_TO_TTL_MS`.
 */
export const peekReturnTo = (now: number = Date.now()): string | null => {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(RETURN_TO_STORAGE_KEY);
  } catch {
    return null;
  }
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    if (!isStoredReturnTo(value)) return null;
    if (now - value.savedAt > RETURN_TO_TTL_MS) return null;
    return value.path;
  } catch {
    return null;
  }
};

/** Reads and removes the stored page (see `peekReturnTo`). */
export const consumeReturnTo = (now: number = Date.now()): string | null => {
  const path = peekReturnTo(now);
  clearReturnTo();
  return path;
};
