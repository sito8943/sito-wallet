import { SYNC_DB_NAME } from "../sync/constants";
import { Tables } from "../types";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";

const hasIndexedDb = (): boolean =>
  typeof indexedDB !== "undefined" && indexedDB !== null;

const deleteDatabase = (dbName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(dbName);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error ?? new Error(`Could not delete database ${dbName}`));
    };

    request.onblocked = () => {
      reject(new Error(`IndexedDB delete blocked for ${dbName}`));
    };
  });
};

const OFFLINE_DB_NAMES = [
  getOfflineStoreDbName(Tables.Accounts),
  getOfflineStoreDbName(Tables.Currencies),
  getOfflineStoreDbName(Tables.Transactions),
  getOfflineStoreDbName(Tables.TransactionCategories),
  getOfflineStoreDbName(Tables.UserDashboardConfig),
  getOfflineStoreDbName(Tables.Profiles),
  SYNC_DB_NAME,
] as const;

export const clearOfflineIndexedDatabases = async (): Promise<void> => {
  if (!hasIndexedDb()) return;

  await Promise.allSettled(
    OFFLINE_DB_NAMES.map((dbName) => deleteDatabase(dbName)),
  );
};
