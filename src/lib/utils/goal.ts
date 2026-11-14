import type { CommonProductDto, GoalDeadlineInfo, GoalDto } from "../entities";
import { GoalStatus } from "../entities/goal/GoalStatus";

const AMOUNT_DECIMALS = 2;
const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Amount with two decimals in the user's locale ("1.234,50"). */
export const formatGoalAmount = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    minimumFractionDigits: AMOUNT_DECIMALS,
    maximumFractionDigits: AMOUNT_DECIMALS,
  }).format(Number.isFinite(value) ? value : 0);

/** Percent with up to two decimals ("42,5 %" → "42.5"). */
export const formatGoalPercent = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, {
    maximumFractionDigits: AMOUNT_DECIMALS,
  }).format(Number.isFinite(value) ? value : 0);

/**
 * "YYYY-MM-DD" in the user's locale. Parsed as a local date: `new Date()`
 * would read it as UTC midnight and show the previous day west of UTC.
 */
export const formatGoalDeadline = (
  deadline: string | null | undefined,
  locale: string,
): string | null => {
  if (!deadline) return null;

  const match = DATE_ONLY_PATTERN.exec(deadline.trim());
  if (!match) return deadline;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date);
};

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
