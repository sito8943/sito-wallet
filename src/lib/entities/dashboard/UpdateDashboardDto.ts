import { DeleteDto } from "../base";

export interface UpdateDashboardDto extends DeleteDto {
  config: string;
  position: number;
  userId: number;
}
