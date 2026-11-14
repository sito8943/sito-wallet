import type { BaseCommonEntityDto } from "@sito/dashboard-app";

import type { GoalStatus } from "./GoalStatus";

export interface CommonGoalDto extends BaseCommonEntityDto {
  name: string;
  status: GoalStatus;
}
