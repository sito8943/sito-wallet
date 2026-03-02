import { IndexedDBClient } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto,
  ImportDto,
} from "lib";

const DB_NAME = "sito-wallet-db";

export class TransactionCategoryIndexedDBClient extends IndexedDBClient<
  Tables,
  TransactionCategoryDto,
  CommonTransactionCategoryDto,
  AddTransactionCategoryDto,
  UpdateTransactionCategoryDto,
  FilterTransactionCategoryDto,
  ImportPreviewTransactionCategoryDto
> {
  constructor() {
    super(Tables.TransactionCategories, DB_NAME);
  }

  async seed(items: TransactionCategoryDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.TransactionCategories, "readwrite");
        const store = tx.objectStore(Tables.TransactionCategories);
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

  async processImport(
    _file: File
  ): Promise<ImportPreviewTransactionCategoryDto[]> {
    return [];
  }

  async import(
    _data: ImportDto<ImportPreviewTransactionCategoryDto>
  ): Promise<number> {
    return 0;
  }
}
