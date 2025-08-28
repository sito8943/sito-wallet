import { BaseEntityDto, CommonUserDto } from "lib";
import { DashboardCardType } from "./DashboardCardType";

export interface DashboardDto extends BaseEntityDto {
  type: DashboardCardType;
  config: string;
  position: number;
  user: CommonUserDto | null;
}
