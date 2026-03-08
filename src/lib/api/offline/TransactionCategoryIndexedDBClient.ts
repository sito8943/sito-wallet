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
import { seedStore } from "./seedStore";

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
    await seedStore(config.indexedDBName, Tables.TransactionCategories, items);
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
