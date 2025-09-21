import { DeleteDto } from "../base";

export interface UpdateDashboardCardConfigDto extends DeleteDto {
  config: string;
  userId: number;
}
