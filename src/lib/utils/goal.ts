import type { CommonProductDto, GoalDeadlineInfo, GoalDto } from "../entities";
import { GoalStatus } from "../entities/goal/GoalStatus";

import { AMOUNT_FRACTION_DIGITS } from "./constants";
import { formatDate } from "./date";

/** Percent with up to two decimals ("42,5 %" → "42.5"). */
export const formatGoalPercent = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: AMOUNT_FRACTION_DIGITS,
  }).format(Number.isFinite(value) ? value : 0);

/** Deadline as a date in the app language, or `null` without one. */
export const formatGoalDeadline = (
  deadline: string | null | undefined,
  locale: string,
): string | null => (deadline ? formatDate(deadline, locale) : null);

export const getGoalDeadlineInfo = (
  daysLeft: number | null | undefined,
): GoalDeadlineInfo => {
  if (daysLeft === null || daysLeft === undefined || !Number.isFinite(daysLeft))
    return { kind: "none", days: 0 };
  if (daysLeft > 0) return { kind: "left", days: daysLeft };
  if (daysLeft === 0) return { kind: "today", days: 0 };
  return { kind: "overdue", days: Math.abs(daysLeft) };
};

/** Name a goal takes from its product: the alias the user knows, else the name. */
export const getGoalProductName = (
  product: Pick<CommonProductDto, "name" | "alias">,
): string => product.alias || product.name;

/** Reached but still active: the user should mark it as completed. */
export const isGoalReachedAndActive = (
  goal: Pick<GoalDto, "reached" | "status">,
): boolean => goal.reached && goal.status === GoalStatus.Active;
