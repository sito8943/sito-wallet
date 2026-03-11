import { BaseCommonEntityDto } from "@sito/dashboard-app";
import { IndexedDBClient } from "@sito/dashboard-app";

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

// config
import { queueSyncOperation } from "../sync";
import { getOfflineStoreDbName } from "./getOfflineStoreDbName";
import { seedStore } from "./seedStore";

const getTitleFromCreateInput = (value: AddDashboardDto): string => {
  const maybeWithTitle = value as AddDashboardDto & { title?: string | null };
  if (typeof maybeWithTitle.title === "string") return maybeWithTitle.title;
  return "";
};

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
    super(
      Tables.UserDashboardConfig,
      getOfflineStoreDbName(Tables.UserDashboardConfig),
    );
  }

  async seed(items: DashboardDto[]): Promise<void> {
    await seedStore(
      getOfflineStoreDbName(Tables.UserDashboardConfig),
      Tables.UserDashboardConfig,
      items,
    );
  }

  async insert(value: AddDashboardDto): Promise<DashboardDto> {
    const created = await super.insert(value);

    await queueSyncOperation(
      "userDashboardConfigs",
      "CREATE",
      {
        title: getTitleFromCreateInput(value),
        type: value.type,
        config: value.config,
        position: value.position,
      },
      created.id,
    );

    return created;
  }

  async update(value: UpdateDashboardDto): Promise<DashboardDto>;
  async update(id: number, value: UpdateDashboardDto): Promise<DashboardDto>;
  async update(
    idOrValue: number | UpdateDashboardDto,
    value?: UpdateDashboardDto,
  ): Promise<DashboardDto> {
    let updateValue: UpdateDashboardDto;

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
      "userDashboardConfigs",
      "UPDATE",
      {
        id: updateValue.id,
        title: updateValue.title,
        config: updateValue.config,
        position: updateValue.position,
      },
      updateValue.id,
    );

    return updated;
  }

  async softDelete(ids: number[]): Promise<number> {
    const deleted = await super.softDelete(ids);

    await Promise.all(
      ids.map((id) =>
        queueSyncOperation("userDashboardConfigs", "DELETE", { id }, id),
      ),
    );

    return deleted;
  }

  async updateCardTitle(_data: UpdateDashboardCardTitleDto): Promise<number> {
    const current = await this.getById(_data.id);
    const merged = {
      ...current,
      title: _data.title,
    };

    await super.update(merged as unknown as UpdateDashboardDto);

    await queueSyncOperation(
      "userDashboardConfigs",
      "UPDATE",
      {
        id: _data.id,
        title: _data.title,
        config: current.config ?? "",
        position: current.position,
      },
      _data.id,
    );

    return 1;
  }

  async updateCardConfig(_data: UpdateDashboardCardConfigDto): Promise<number> {
    const current = await this.getById(_data.id);
    const merged = {
      ...current,
      config: _data.config,
    };

    await super.update(merged as unknown as UpdateDashboardDto);

    await queueSyncOperation(
      "userDashboardConfigs",
      "UPDATE",
      {
        id: _data.id,
        title: current.title ?? "",
        config: _data.config,
        position: current.position,
      },
      _data.id,
    );

    return 1;
  }

  async delete(ids: number[]): Promise<number> {
    return await this.softDelete(ids);
  }
}
