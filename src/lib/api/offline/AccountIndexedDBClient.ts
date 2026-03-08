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
import { queueSyncOperation } from "../sync";
import { seedStore } from "./seedStore";

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
    await seedStore(config.indexedDBName, Tables.Accounts, items);
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

  async update(value: UpdateAccountDto): Promise<AccountDto> {
    const updated = await super.update(value);

    await queueSyncOperation(
      "accounts",
      "UPDATE",
      {
        id: value.id,
        name: value.name,
        description: value.description,
        type: value.type,
        currencyId: value.currencyId,
      },
      value.id
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
