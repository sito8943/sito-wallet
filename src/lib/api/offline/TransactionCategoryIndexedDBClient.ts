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

// config
import { config } from "../../../config";
import { queueSyncOperation } from "../sync";

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
    super(Tables.TransactionCategories, config.indexedDBName);
  }

  async seed(items: TransactionCategoryDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.indexedDBName);
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

  async insert(value: AddTransactionCategoryDto): Promise<TransactionCategoryDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "transactionCategories",
      "CREATE",
      {
        name: value.name,
        description: value.description,
        type: value.type,
      },
      created.id
    );

    return created;
  }

  async update(value: UpdateTransactionCategoryDto): Promise<TransactionCategoryDto> {
    const updated = await super.update(value);

    await queueSyncOperation(
      "transactionCategories",
      "UPDATE",
      {
        id: value.id,
        name: value.name,
        description: value.description,
        type: value.type,
      },
      value.id
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("transactionCategories", "DELETE", { id }, id)
      )
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("transactionCategories", "RESTORE", { id }, id)
      )
    );

    return restored;
  }

  async processImport(
    _file: File,
  ): Promise<ImportPreviewTransactionCategoryDto[]> {
    return [];
  }

  async import(
    _data: ImportDto<ImportPreviewTransactionCategoryDto>,
  ): Promise<number> {
    return 0;
  }
}
