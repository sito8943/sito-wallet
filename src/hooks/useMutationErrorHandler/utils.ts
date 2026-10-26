import { BACKEND_ERROR_CODE_PATTERN } from "./constants";

/**
 * Translation key for a known backend error code (e.g. `photo.tooLarge`), or
 * null when the message is free text.
 */
export const getBackendErrorCodeKey = (message?: string): string | null =>
  message && BACKEND_ERROR_CODE_PATTERN.test(message)
    ? `_entities:base.${message}`
    : null;
