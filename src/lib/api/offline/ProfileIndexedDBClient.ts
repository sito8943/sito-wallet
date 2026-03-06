import {
  IndexedDBClient,
  BaseCommonEntityDto,
  BaseFilterDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";

// enum
import { Tables } from "../types";

// types
import { ProfileDto, AddProfileDto, UpdateProfileDto } from "lib";

// config
import { config } from "../../../config";

export class ProfileIndexedDBClient extends IndexedDBClient<
  Tables,
  ProfileDto,
  BaseCommonEntityDto,
  AddProfileDto,
  UpdateProfileDto,
  BaseFilterDto,
  ImportPreviewDto
> {
  constructor() {
    super(Tables.Profiles, config.indexedDBName);
  }

  async seed(items: ProfileDto[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(config.indexedDBName);
      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const tx = db.transaction(Tables.Profiles, "readwrite");
        const store = tx.objectStore(Tables.Profiles);
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

  async delete(_ids: number[]): Promise<number> {
    return 0;
  }
}
