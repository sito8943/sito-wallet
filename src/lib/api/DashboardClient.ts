import BaseClient from "./BaseClient";

// enum
import { Tables } from "./types";

// types
import {
  DashboardDto,
  UpdateDashboardDto,
  AddDashboardDto,
  BaseCommonEntityDto,
  FilterDashboardDto,
  UpdateDashboardCardTitleDto,
} from "lib";

export default class DashboardClient extends BaseClient<
  DashboardDto,
  BaseCommonEntityDto,
  AddDashboardDto,
  UpdateDashboardDto,
  FilterDashboardDto
> {
  /**
   */
  constructor() {
    super(Tables.UserDashboardConfig);
  }

  async updateCardTitle(
    data: UpdateDashboardCardTitleDto
  ): Promise<number> {
    return await this.api.patch(`${this.table}/update-card-title`, data);
  }

  async delete(ids: number[]): Promise<number> {
    return await this.api.delete(`${this.table}`, ids);
  }
}
