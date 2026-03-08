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

// config
import { config } from "../../../config";
import { queueSyncOperation } from "../sync";

type TransactionCreateInput = AddTransactionDto &
  Partial<Pick<UpdateTransactionDto, "categoryId">>;

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
    super(Tables.Transactions, config.indexedDBName);
  }

  async seed(items: TransactionDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.indexedDBName);
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

  async insert(value: AddTransactionDto): Promise<TransactionDto> {
    const created = await super.insert(value);
    const parsed = value as TransactionCreateInput;

    await queueSyncOperation(
      "transactions",
      "CREATE",
      {
        accountId: parsed.accountId,
        categoryId: parsed.categoryId ?? 0,
        amount: parsed.amount,
        date: parsed.date,
        description: parsed.description,
      },
      created.id
    );

    return created;
  }

  async update(value: UpdateTransactionDto): Promise<TransactionDto> {
    const updated = await super.update(value);

    await queueSyncOperation(
      "transactions",
      "UPDATE",
      {
        id: value.id,
        accountId: value.accountId,
        categoryId: value.categoryId,
        amount: value.amount,
        date: value.date,
        description: value.description,
      },
      value.id
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("transactions", "DELETE", { id }, id))
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("transactions", "RESTORE", { id }, id))
    );

    return restored;
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
