
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
  AdjustBalanceDto,
  TransactionDto,
} from "lib";

// config
import { queueSyncOperation } from "../sync";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";
import { seedStore } from "./seedStore";
import { IndexedDBClient } from "@sito/dashboard-app";

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
    super(Tables.Accounts, getOfflineStoreDbName(Tables.Accounts));
  }

  async seed(items: AccountDto[]): Promise<void> {
    await seedStore(getOfflineStoreDbName(Tables.Accounts), Tables.Accounts, items);
  }

  async insert(value: AddAccountDto): Promise<AccountDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "accounts",
      "CREATE",
      {
        name: value.name,
        description: value.description,
        type: value.type,
        currencyId: value.currencyId,
        balance: value.balance,
      },
      created.id
    );

    return created;
  }

  async update(value: UpdateAccountDto): Promise<AccountDto>;
  async update(id: number, value: UpdateAccountDto): Promise<AccountDto>;
  async update(
    idOrValue: number | UpdateAccountDto,
    value?: UpdateAccountDto
  ): Promise<AccountDto> {
    let updateValue: UpdateAccountDto;

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
      "accounts",
      "UPDATE",
      {
        id: updateValue.id,
        name: updateValue.name,
        description: updateValue.description,
        type: updateValue.type,
        currencyId: updateValue.currencyId,
      },
      updateValue.id
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("accounts", "DELETE", { id }, id))
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("accounts", "RESTORE", { id }, id))
    );

    return restored;
  }

  async adjustBalance(
    accountId: number,
    data: AdjustBalanceDto
  ): Promise<TransactionDto> {
    await queueSyncOperation(
      "accounts",
      "ADJUST_BALANCE",
      { newBalance: data.newBalance, description: data.description },
      accountId
    );

    return { id: accountId } as TransactionDto;
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
