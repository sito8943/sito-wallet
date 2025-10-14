import { DeleteDto } from "@sito/dashboard-app";

export interface UpdateDashboardDto extends DeleteDto {
  title: string;
  config: string;
  position: number;
  userId: number;
}
