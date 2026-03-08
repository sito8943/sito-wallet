import { config } from "../../../config";

const indexedDbBaseName = config.indexedDBName || "sito-wallet";

export const SYNC_DB_NAME = `${indexedDbBaseName}-sync`;
export const SYNC_DB_VERSION = 1;
export const SYNC_DB_STORE_OPERATIONS = "operations";
export const SYNC_METADATA_STORAGE_KEY = `${indexedDbBaseName}-sync-meta`;
export const SYNC_CLIENT_APP_VERSION =
  config.appVersion || "sito-wallet-web-unknown";

