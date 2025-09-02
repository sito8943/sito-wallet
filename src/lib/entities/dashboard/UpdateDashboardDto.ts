import { DeleteDto } from "../base";

export interface UpdateDashboardDto extends DeleteDto {
  title: string;
  config: string;
  position: number;
  userId: number;
}
