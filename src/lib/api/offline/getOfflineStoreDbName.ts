import { config } from "../../../config";

export const getOfflineStoreDbName = (storeName: string): string => {
  const baseName = config.indexedDBName || "sito-wallet";
  return `${baseName}-${storeName}`;
};
