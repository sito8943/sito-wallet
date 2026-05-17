import type { DeleteDto } from "@sito/dashboard-app";

export interface UpdateDashboardCardTitleDto extends DeleteDto {
  title: string;
  userId: number;
}
