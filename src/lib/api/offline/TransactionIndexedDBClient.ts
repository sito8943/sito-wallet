import { IndexedDBClient } from "./IndexedDBClient";

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
  FilterWeeklyTransactionDto,
  ImportPreviewTransactionDto,
  TransactionTypeResumeDto,
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
        categoryId: parsed.categoryId ?? 0,
        amount: parsed.amount,
        date: parsed.date,
        description: parsed.description,
      },
      created.id,
    );

    return created;
  }

  async update(_: number, value: UpdateTransactionDto): Promise<TransactionDto> {
    const updated = await super.update(_, value);

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
      value.id,
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
