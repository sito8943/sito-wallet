/** Backend error codes with a translation under `_entities:base`. */
export const BACKEND_ERROR_CODE_PATTERN =
  /^(photo|apiKeys|feedback|restore)\.[a-zA-Z]+$/;

/** Restoring an item whose name an active item already uses (409). */
export const RESTORE_NAME_IN_USE_KEY = "_entities:base.restore.nameInUse";
