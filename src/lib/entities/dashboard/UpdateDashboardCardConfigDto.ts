import { DeleteDto } from "@sito/dashboard-app";

export interface UpdateDashboardCardConfigDto extends DeleteDto {
  config: string;
  userId: number;
}
