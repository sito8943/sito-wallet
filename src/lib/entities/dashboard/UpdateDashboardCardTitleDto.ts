import { DeleteDto } from "../base";

export interface UpdateDashboardCardTitleDto extends DeleteDto {
  title: string;
  userId: number;
}
