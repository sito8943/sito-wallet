import { BaseEntityDto, CommonUserDto } from "lib";
import { DashboardCardType } from "./DashboardCardType";

export interface DashboardDto extends BaseEntityDto {
  type: DashboardCardType;
  title: string | null;
  config: string;
  position: number;
  user: CommonUserDto | null;
}
