import type { BaseFilterDto } from "@sito/dashboard-app";

import type { GoalStatus } from "./GoalStatus";

export interface FilterGoalDto extends BaseFilterDto {
  status?: GoalStatus;
}
