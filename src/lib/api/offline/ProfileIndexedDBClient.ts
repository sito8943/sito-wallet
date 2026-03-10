import {
  BaseCommonEntityDto,
  BaseFilterDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";
import { IndexedDBClient } from "./IndexedDBClient";

// enum
import { Tables } from "../types";

// types
import { ProfileDto, AddProfileDto, UpdateProfileDto } from "lib";

// config
import { queueSyncOperation } from "../sync";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";
import { seedStore } from "./seedStore";

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
    super(Tables.Profiles, getOfflineStoreDbName(Tables.Profiles));
  }

  async seed(items: ProfileDto[]): Promise<void> {
    await seedStore(
      getOfflineStoreDbName(Tables.Profiles),
      Tables.Profiles,
      items,
    );
  }

  async insert(value: AddProfileDto): Promise<ProfileDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "profile",
      "CREATE",
      {
        name: value.name,
      },
      created.id,
    );

    return created;
  }

  async update(value: UpdateProfileDto): Promise<ProfileDto> {
    const updated = await super.update(value);

    await queueSyncOperation(
      "profile",
      "UPDATE",
      {
        id: value.id,
        name: value.name,
      },
      value.id,
    );

    return updated;
  }

  async me(): Promise<ProfileDto> {
    const result = await this.get(undefined, {
      deletedAt: false as unknown as BaseFilterDto["deletedAt"],
    });
    const firstItem = result.items[0];

    if (!firstItem) throw new Error("Profile not found");
    return firstItem;
  }

  async ensureMine(defaultName: string): Promise<ProfileDto> {
    try {
      return await this.me();
    } catch {
      const parsedDefaultName = defaultName.trim().slice(0, 120);
      if (!parsedDefaultName) throw new Error("Profile not found");

      return await this.insert({ name: parsedDefaultName });
    }
  }

  async delete(_ids: number[]): Promise<number> {
    return 0;
  }
}
