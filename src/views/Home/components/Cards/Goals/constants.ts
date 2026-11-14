import type { FilterGoalDto } from "lib";
import { GoalStatus } from "lib";

import type { GoalsCardFormType } from "./types";

export const defaultConfig: GoalsCardFormType = {
  goals: [],
};

/** Same filters as the Goals page default tab, so both share one request. */
export const ACTIVE_GOALS_FILTERS: FilterGoalDto = {
  status: GoalStatus.Active,
};
