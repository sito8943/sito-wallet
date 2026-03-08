import { IndexedDBClient } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto,
} from "lib";

// config
import { config } from "../../../config";
import { queueSyncOperation } from "../sync";
import { seedStore } from "./seedStore";

export class CurrencyIndexedDBClient extends IndexedDBClient<
  Tables,
  CurrencyDto,
  CommonCurrencyDto,
  AddCurrencyDto,
  UpdateCurrencyDto,
  FilterCurrencyDto,
  ImportPreviewCurrencyDto
> {
  constructor() {
    super(Tables.Currencies, config.indexedDBName);
  }

  async seed(items: CurrencyDto[]): Promise<void> {
    await seedStore(config.indexedDBName, Tables.Currencies, items);
  }

  async insert(value: AddCurrencyDto): Promise<CurrencyDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "currencies",
      "CREATE",
      {
        name: value.name,
        description: value.description,
        symbol: value.symbol,
      },
      created.id
    );

    return created;
  }

  async update(value: UpdateCurrencyDto): Promise<CurrencyDto> {
    const updated = await super.update(value);

    await queueSyncOperation(
      "currencies",
      "UPDATE",
      {
        id: value.id,
        name: value.name,
        description: value.description,
        symbol: value.symbol,
      },
      value.id
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("currencies", "DELETE", { id }, id))
    );

    return deleted;
  }

  async restore(ids: number[]): Promise<number> {
    const restored = await super.restore(ids);

    await Promise.all(
      ids.map((id) => queueSyncOperation("currencies", "RESTORE", { id }, id))
    );

    return restored;
  }

  async processImport(_file: File): Promise<ImportPreviewCurrencyDto[]> {
    return [];
  }

  async import(): Promise<number> {
    return 0;
  }
}
