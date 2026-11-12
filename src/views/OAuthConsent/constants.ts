/**
 * React already escapes text: skip i18next HTML escaping so names and hosts
 * render as typed (e.g. "Claude & co").
 */
export const RAW_INTERPOLATION = { escapeValue: false } as const;

/** HTTP status of an unknown, expired or already used request. */
export const CONSENT_NOT_FOUND_STATUS = 404;

/** HTTP status of a rejected session token. */
export const CONSENT_UNAUTHORIZED_STATUS = 401;
