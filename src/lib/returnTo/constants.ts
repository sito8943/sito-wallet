/** sessionStorage key of the page to reopen after signing in. */
export const RETURN_TO_STORAGE_KEY = "sito-wallet:return-to";

/**
 * A stored return URL older than this is ignored. Long enough to sign up or
 * recover a password, short enough not to hijack a much later sign-in.
 */
export const RETURN_TO_TTL_MS = 30 * 60 * 1000;
