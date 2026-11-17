/** Backend error codes with a translation under `_entities:base`. */
export const BACKEND_ERROR_CODE_PATTERN =
  /^(photo|apiKeys|feedback|restore|data|error|query|request)\.[a-zA-Z]+$/;

/** Restoring an item whose name an active item already uses (409). */
export const RESTORE_NAME_IN_USE_KEY = "_entities:base.restore.nameInUse";

/** Backend's generic constraint-violation code (409). */
export const DATA_CONFLICT_CODE = "data.conflict";
