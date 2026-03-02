import { IndexedDBClient } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  ImportPreviewTransactionDto,
  TransactionTypeResumeDto,
  TransactionWeeklySpentDto,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
  ImportDto,
} from "lib";

const DB_NAME = "sito-wallet-db";

export class TransactionIndexedDBClient extends IndexedDBClient<
  Tables,
  TransactionDto,
  CommonTransactionDto,
  AddTransactionDto,
  UpdateTransactionDto,
  FilterTransactionDto,
  ImportPreviewTransactionDto
> {
  constructor() {
    super(Tables.Transactions, DB_NAME);
  }

  async seed(items: TransactionDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.Transactions, "readwrite");
        const store = tx.objectStore(Tables.Transactions);
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

  async getTypeResume(): Promise<TransactionTypeResumeDto> {
    return {} as TransactionTypeResumeDto;
  }

  async weekly(): Promise<TransactionWeeklySpentDto> {
    return {} as TransactionWeeklySpentDto;
  }

  async processImport(_file: File): Promise<ImportPreviewTransactionDto[]> {
    return [];
  }

  async import(_data: ImportDto<ImportPreviewTransactionDto>): Promise<number> {
    return 0;
  }

  async assignAccount(_data: AssignTransactionAccountDto): Promise<number> {
    return 0;
  }

  async assignCategory(_data: AssignTransactionCategoryDto): Promise<number> {
    return 0;
  }
}
