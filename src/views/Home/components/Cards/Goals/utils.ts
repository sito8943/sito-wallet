import type { GoalDto, UpdateDashboardCardConfigDto } from "lib";
import { GoalStatus } from "lib";

import { defaultConfig } from "./constants";
import type { GoalsCardFormType, GoalsCardGoalOption } from "./types";

const toGoalOption = (value: unknown): GoalsCardGoalOption | null => {
  if (typeof value !== "object" || value === null) return null;

  const { id, name } = value as Record<string, unknown>;
  if (typeof id !== "number" || !Number.isInteger(id)) return null;

  return { id, name: typeof name === "string" ? name : "" };
};

export const formToDto = (
  data: GoalsCardFormType,
): UpdateDashboardCardConfigDto => ({
  userId: data.userId,
  id: data.id,
  config: JSON.stringify({
    goals: (data.goals ?? [])
      .map(toGoalOption)
      .filter((goal): goal is GoalsCardGoalOption => goal !== null),
  }),
});

export const parseFormConfig = (cfg?: string | null): GoalsCardFormType => {
  try {
    const parsed = (cfg ? JSON.parse(cfg) : {}) as { goals?: unknown };
    const goals = Array.isArray(parsed.goals)
      ? parsed.goals
          .map(toGoalOption)
          .filter((goal): goal is GoalsCardGoalOption => goal !== null)
      : [];
    return { ...defaultConfig, goals };
  } catch (err) {
    console.error(err);
    return defaultConfig;
  }
};

export const getActiveFiltersCount = (formConfig: GoalsCardFormType): number =>
  formConfig.goals.length ? 1 : 0;

/**
 * Goals the card shows, keeping the list order (nearest deadline first):
 * the picked ones, or every active goal when none is picked.
 */
export const selectCardGoals = (
  goals: GoalDto[],
  selected: GoalsCardGoalOption[],
): GoalDto[] => {
  const visible = goals.filter(
    (goal) => !goal.deletedAt && goal.status === GoalStatus.Active,
  );
  if (!selected.length) return visible;

  const ids = new Set(selected.map((goal) => goal.id));
  return visible.filter((goal) => ids.has(goal.id));
};
