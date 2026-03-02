import { IndexedDBClient, BaseCommonEntityDto } from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import {
  DashboardDto,
  AddDashboardDto,
  UpdateDashboardDto,
  FilterDashboardDto,
  ImportPreviewDashboardDto,
  UpdateDashboardCardTitleDto,
  UpdateDashboardCardConfigDto,
} from "lib";

const DB_NAME = "sito-wallet-db";

export class DashboardIndexedDBClient extends IndexedDBClient<
  Tables,
  DashboardDto,
  BaseCommonEntityDto,
  AddDashboardDto,
  UpdateDashboardDto,
  FilterDashboardDto,
  ImportPreviewDashboardDto
> {
  constructor() {
    super(Tables.UserDashboardConfig, DB_NAME);
  }

  async seed(items: DashboardDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.UserDashboardConfig, "readwrite");
        const store = tx.objectStore(Tables.UserDashboardConfig);
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

  async updateCardTitle(
    _data: UpdateDashboardCardTitleDto
  ): Promise<number> {
    return 0;
  }

  async updateCardConfig(
    _data: UpdateDashboardCardConfigDto
  ): Promise<number> {
    return 0;
  }

  async delete(_ids: number[]): Promise<number> {
    return 0;
  }
}
