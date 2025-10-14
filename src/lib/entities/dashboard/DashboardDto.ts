import { BaseEntityDto, CommonUserDto } from "@sito/dashboard-app";
import { DashboardCardType } from "./DashboardCardType";

export interface DashboardDto extends BaseEntityDto {
  type: DashboardCardType;
  title: string | null;
  config: string | null;
  position: number;
  user: CommonUserDto | null;
}
