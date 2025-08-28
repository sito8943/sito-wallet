import { DashboardCardType } from "./DashboardCardType";

export interface AddDashboardDto {
  type: DashboardCardType;
  config: string;
  position: number;
  userId: number;
}
