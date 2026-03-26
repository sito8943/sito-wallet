import {
  BaseCommonEntityDto,
  BaseFilterDto,
  ImportPreviewDto,
} from "@sito/dashboard-app";
import { IndexedDBClient } from "@sito/dashboard-app";

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

    const payload: {
      name: string;
      hideDeletedEntities?: boolean;
    } = {
      name: value.name,
    };

    if (typeof value.hideDeletedEntities === "boolean") {
      payload.hideDeletedEntities = value.hideDeletedEntities;
    }

    await queueSyncOperation(
      "profile",
      "CREATE",
      payload,
      created.id,
    );

    return created;
  }

  async update(value: UpdateProfileDto): Promise<ProfileDto>;
  async update(id: number, value: UpdateProfileDto): Promise<ProfileDto>;
  async update(
    idOrValue: number | UpdateProfileDto,
    value?: UpdateProfileDto,
  ): Promise<ProfileDto> {
    let updateValue: UpdateProfileDto;

    if (typeof idOrValue === "number") {
      if (!value) {
        throw new Error("IndexedDB update requires a value payload");
      }

      updateValue = { ...value, id: value.id ?? idOrValue };
    } else {
      updateValue = idOrValue;
    }

    const updated = await super.update(updateValue);

    const payload: {
      id: number;
      name?: string;
      hideDeletedEntities?: boolean;
    } = {
      id: updateValue.id,
    };

    if (typeof updateValue.name === "string") {
      payload.name = updateValue.name;
    }

    if (typeof updateValue.hideDeletedEntities === "boolean") {
      payload.hideDeletedEntities = updateValue.hideDeletedEntities;
    }

    await queueSyncOperation(
      "profile",
      "UPDATE",
      payload,
      updateValue.id,
    );

    return updated;
  }

  async me(): Promise<ProfileDto> {
    const result = await this.get(undefined, {
      softDeleteScope: "ACTIVE" as BaseFilterDto["softDeleteScope"],
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

  async updatePhoto(_id: number, _file: File): Promise<ProfileDto> {
    throw new Error("Photo upload is not available offline");
  }

  async deletePhoto(_id: number): Promise<ProfileDto> {
    throw new Error("Photo deletion is not available offline");
  }

  async delete(_ids: number[]): Promise<number> {
    return 0;
  }
}
