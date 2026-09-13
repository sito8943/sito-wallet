import {
  CHUNK_LOAD_ERROR_FRAGMENTS,
  CHUNK_LOAD_ERROR_KEY,
  NETWORK_ERROR_FRAGMENTS,
  OFFLINE_ERROR_KEY,
} from "./constants";

/**
 * An error boundary hands over whatever was thrown, not necessarily an Error.
 */
export const toError = (value: unknown): Error | null => {
  if (value instanceof Error) return value;
  if (typeof value === "string" && value.length > 0) return new Error(value);

  return null;
};

const matches = (error: Error | null, fragments: string[]): boolean => {
  if (!error) return false;

  const message = error.message?.toLowerCase() ?? "";

  return fragments.some((fragment) => message.includes(fragment));
};

export const isNetworkError = (error: Error | null): boolean =>
  matches(error, NETWORK_ERROR_FRAGMENTS);

export const isChunkLoadError = (error: Error | null): boolean =>
  matches(error, CHUNK_LOAD_ERROR_FRAGMENTS);

/**
 * Picks the copy that explains the failure, or null to keep the raw message.
 * A missing chunk is checked before the generic network case: its message also
 * reads "Failed to fetch", yet while online it means a stale build, not a
 * dropped connection.
 */
export const getErrorMessageKey = (
  error: Error | null,
  isOnline: boolean,
): string | null => {
  if (!isOnline) return OFFLINE_ERROR_KEY;
  if (isChunkLoadError(error)) return CHUNK_LOAD_ERROR_KEY;
  if (isNetworkError(error)) return OFFLINE_ERROR_KEY;

  return null;
};
