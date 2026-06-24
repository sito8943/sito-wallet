/**
 * Extracts a human-readable message from an unknown error/HTTP payload,
 * falling back to the provided string when none is available.
 *
 * Handles raw strings, `Error` instances, and plain objects exposing a
 * `message` or `error` field (the shapes returned across API clients and
 * react-query `onError` callbacks).
 */
export const parseErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "string") return error || fallback;

  if (error instanceof Error) return error.message || fallback;

  if (typeof error === "object" && error !== null) {
    const maybeError = error as { message?: string; error?: string };
    return maybeError.message ?? maybeError.error ?? fallback;
  }

  return fallback;
};
