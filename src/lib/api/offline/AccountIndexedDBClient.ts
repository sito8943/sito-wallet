import { IndexedDBClient } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  AccountDto,
  CommonAccountDto,
  AddAccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  ImportPreviewAccountDto,
} from "lib";

// config
import { config } from "../../../config";

export class AccountIndexedDBClient extends IndexedDBClient<
  Tables,
  AccountDto,
  CommonAccountDto,
  AddAccountDto,
  UpdateAccountDto,
  FilterAccountDto,
  ImportPreviewAccountDto
> {
  constructor() {
    super(Tables.Accounts, config.indexedDBName);
  }

  async seed(items: AccountDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.indexedDBName);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.Accounts, "readwrite");
        const store = tx.objectStore(Tables.Accounts);
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

  async sync(_accountId: number): Promise<number> {
    return 0;
  }

  async processImport(_file: File): Promise<ImportPreviewAccountDto[]> {
    return [];
  }

  async import(): Promise<number> {
    return 0;
  }
}
