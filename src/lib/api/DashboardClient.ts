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
}
