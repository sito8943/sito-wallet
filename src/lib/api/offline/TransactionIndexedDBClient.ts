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
  FilterTransactionTypeResumeDto,
  FilterTransactionGroupedByTypeDto,
  FilterWeeklyTransactionDto,
  ImportPreviewTransactionDto,
  TransactionTypeResumeDto,
  TransactionTypeGroupedDto,
  TransactionWeeklySpentDto,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
  ImportDto,
} from "lib";

// config
import { queueSyncOperation } from "../sync";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";
import { seedStore } from "./seedStore";

type TransactionCreateInput = AddTransactionDto &
  Partial<Pick<UpdateTransactionDto, "categoryId" | "categoryIds">>;

const parseCategoryIds = (value: {
  categoryIds?: number[];
  categoryId?: number;
}): number[] => {
  if (Array.isArray(value.categoryIds) && value.categoryIds.length > 0) {
    const seen = new Set<number>();

    return value.categoryIds.filter((categoryId) => {
      if (!Number.isFinite(categoryId) || categoryId <= 0) return false;
      if (seen.has(categoryId)) return false;

      seen.add(categoryId);
      return true;
    });
  }

  if (typeof value.categoryId === "number" && value.categoryId > 0) {
    return [value.categoryId];
  }

  return [];
};

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
    super(Tables.Transactions, getOfflineStoreDbName(Tables.Transactions));
  }

  async seed(items: TransactionDto[]): Promise<void> {
    await seedStore(
      getOfflineStoreDbName(Tables.Transactions),
      Tables.Transactions,
      items,
    );
  }

  async insert(value: AddTransactionDto): Promise<TransactionDto> {
    const created = await super.insert(value);
    const parsed = value as TransactionCreateInput;

    await queueSyncOperation(
      "transactions",
      "CREATE",
      {
        accountId: parsed.accountId,
        categoryIds: parseCategoryIds(parsed),
        amount: parsed.amount,
        date: parsed.date,
        description: parsed.description,
      },
      created.id,
    );

    return created;
  }

  async update(value: UpdateTransactionDto): Promise<TransactionDto>;
  async update(
    id: number,
    value: UpdateTransactionDto,
  ): Promise<TransactionDto>;
  async update(
    idOrValue: number | UpdateTransactionDto,
    value?: UpdateTransactionDto,
  ): Promise<TransactionDto> {
    let updateValue: UpdateTransactionDto;

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
      "transactions",
      "UPDATE",
      {
        id: updateValue.id,
        accountId: updateValue.accountId,
        categoryIds: parseCategoryIds(updateValue),
        amount: updateValue.amount,
        date: updateValue.date,
        description: updateValue.description,
      },
      updateValue.id,
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("transactions", "DELETE", { id }, id)),
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("transactions", "RESTORE", { id }, id),
      ),
    );

    return restored;
  }

  async getTypeResume(
    _filters: FilterTransactionTypeResumeDto,
  ): Promise<TransactionTypeResumeDto> {
    return {} as TransactionTypeResumeDto;
  }

  async getGroupedByType(
    _filters: FilterTransactionGroupedByTypeDto,
  ): Promise<TransactionTypeGroupedDto> {
    return {
      incomeTotal: 0,
      expenseTotal: 0,
    };
  }

  async weekly(
    _filters: FilterWeeklyTransactionDto,
  ): Promise<TransactionWeeklySpentDto> {
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
