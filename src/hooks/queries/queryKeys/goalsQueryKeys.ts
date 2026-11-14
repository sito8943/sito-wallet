import type { QueryParam } from "@sito/dashboard-app";

import type { FilterGoalDto, GoalDto } from "lib";

export const GoalsQueryKeys = {
  all: () => ({
    queryKey: ["goals"],
  }),
  list: (query: QueryParam<GoalDto>, filters: FilterGoalDto) => ({
    queryKey: [...GoalsQueryKeys.all().queryKey, "list", query, filters],
  }),
};
