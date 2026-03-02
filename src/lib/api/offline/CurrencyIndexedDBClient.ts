import { IndexedDBClient } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto,
} from "lib";

const DB_NAME = "sito-wallet-db";

export class CurrencyIndexedDBClient extends IndexedDBClient<
  Tables,
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto
> {
  constructor() {
    super(Tables.Currencies, DB_NAME);
  }

  async seed(items: CurrencyDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.Currencies, "readwrite");
        const store = tx.objectStore(Tables.Currencies);
        items.forEach((item) => store.put(item));
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      };
      request.onerror = () => reject(request.error);
    });
  }

  async processImport(_file: File): Promise<ImportPreviewCurrencyDto[]> {
    return [];
  }

  async import(): Promise<number> {
    return 0;
  }
}
