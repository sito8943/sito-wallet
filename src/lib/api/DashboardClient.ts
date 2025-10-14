import { BaseClient, BaseCommonEntityDto } from "@sito/dashboard-app";

// enum
import { Tables } from "./types";

// types
import {
  DashboardDto,
  UpdateDashboardDto,
  AddDashboardDto,
  FilterDashboardDto,
  UpdateDashboardCardTitleDto,
  UpdateDashboardCardConfigDto,
} from "lib";

// config
import { config } from "../../config";

export default class DashboardClient extends BaseClient<
  Tables,
  DashboardDto,
  BaseCommonEntityDto,
  AddDashboardDto,
  UpdateDashboardDto,
  FilterDashboardDto
> {
  /**
   */
  constructor() {
    super(Tables.UserDashboardConfig, config.apiUrl, config.auth.user);
  }

  async updateCardTitle(data: UpdateDashboardCardTitleDto): Promise<number> {
    return await this.api.patch(`${this.table}/update-card-title`, data);
  }

  async updateCardConfig(data: UpdateDashboardCardConfigDto): Promise<number> {
    return await this.api.patch(`${this.table}/update-card-config`, data);
  }

  async delete(ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}`, ids);
  }
}
