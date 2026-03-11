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
import { queueSyncOperation } from "../sync";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";
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
    super(
      Tables.TransactionCategories,
      getOfflineStoreDbName(Tables.TransactionCategories),
    );
  }

  async seed(items: TransactionCategoryDto[]): Promise<void> {
    await seedStore(
      getOfflineStoreDbName(Tables.TransactionCategories),
      Tables.TransactionCategories,
      items,
    );
  }

  async insert(
    value: AddTransactionCategoryDto,
  ): Promise<TransactionCategoryDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "transactionCategories",
      "CREATE",
      {
        name: value.name,
        description: value.description,
        type: value.type,
      },
      created.id,
    );

    return created;
  }

  async update(
    value: UpdateTransactionCategoryDto,
  ): Promise<TransactionCategoryDto>;
  async update(
    id: number,
    value: UpdateTransactionCategoryDto,
  ): Promise<TransactionCategoryDto>;
  async update(
    idOrValue: number | UpdateTransactionCategoryDto,
    value?: UpdateTransactionCategoryDto,
  ): Promise<TransactionCategoryDto> {
    let updateValue: UpdateTransactionCategoryDto;

    if (typeof idOrValue === "number") {
      if (!value) {
        throw new Error("IndexedDB update requires a value payload");
      }

      updateValue = { ...value, id: value.id ?? idOrValue };
    } else {
      updateValue = idOrValue;
    }

    const updated = await super.update(updateValue);

    await queueSyncOperation(
      "transactionCategories",
      "UPDATE",
      {
        id: updateValue.id,
        name: updateValue.name,
        description: updateValue.description,
        type: updateValue.type,
      },
      updateValue.id,
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("transactionCategories", "DELETE", { id }, id),
      ),
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("transactionCategories", "RESTORE", { id }, id),
      ),
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
