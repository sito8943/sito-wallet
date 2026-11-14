import type { QueryParam } from "@sito/dashboard-app";
import { SortOrder } from "@sito/dashboard-app";

import type { GoalDto } from "../entities/goal";

/** Goals are few per user: one page holds them all (no infinite scroll). */
export const GOALS_LIST_PAGE_SIZE = 100;

/** Same order as the backend default: nearest deadline first. */
export const defaultGoalsListQuery: QueryParam<GoalDto> = {
  sortingBy: "deadline",
  sortingOrder: SortOrder.ASC,
  pageSize: GOALS_LIST_PAGE_SIZE,
};
