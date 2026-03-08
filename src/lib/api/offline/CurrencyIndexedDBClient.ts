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
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.indexedDBName);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.Currencies, "readwrite");
        const store = tx.objectStore(Tables.Currencies);
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
