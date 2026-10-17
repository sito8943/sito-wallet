import { classNames } from "@sito/dashboard-app";

import type { UpdateDashboardCardConfigDto } from "lib";
import { roundCurrency } from "../CurrentBalance/utils";
import {
  isFiniteNumber,
  TransactionType,
  TransactionTypeResumeTime,
} from "lib";
import type {
  FilterTypeResumeConfigType,
  GetTypeResumePredictionParamsType,
  ToTypeResumeBatchRequestItemType,
  GetPredictionStatusParamsType,
  TypeResumePeriodProgressType,
  TypeResumePredictionStatusType,
  TypeResumePredictionTotalsType,
  TypeResumePredictionType,
  TypeResumePredictionValuesType,
  TypeResumeTypeFormType,
} from "./types";
import {
  DAY_IN_MS,
  DEFAULT_TYPE_RESUME_CONFIG,
  PREDICTABLE_TIMES,
  PREDICTION_DANGER_MARGIN,
  PREDICTION_WARNING_MARGIN,
  PREVIOUS_TIMES,
  TIME_KEY_BY_VALUE,
} from "./constants";

/** Empty input means "no minimum balance" */
export const parseMinBalance = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const parsed = Number(value);
  return isFiniteNumber(parsed) ? roundCurrency(parsed) : undefined;
};

export const normalizeExcludedCategoryIds = (value: unknown): number[] => {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map(Number).filter(isFiniteNumber))].sort(
    (left, right) => left - right,
  );
};

export const parseFormConfig = (
  cfg?: string | null,
): TypeResumeTypeFormType => {
  try {
    const parsed = cfg ? (JSON.parse(cfg) as Record<string, unknown>) : {};
    const legacyAccounts = Array.isArray(parsed.accounts)
      ? (parsed.accounts as NonNullable<TypeResumeTypeFormType["account"]>[])
      : [];

    return {
      account:
        (parsed.account as TypeResumeTypeFormType["account"]) ??
        legacyAccounts[0],
      type: Number(parsed.type ?? DEFAULT_TYPE_RESUME_CONFIG.type),
      time:
        (parsed.time as TypeResumeTypeFormType["time"]) ??
        DEFAULT_TYPE_RESUME_CONFIG.time,
      excludedCategories: [],
      excludedCategoryIds: normalizeExcludedCategoryIds(
        parsed.excludedCategoryIds,
      ),
      oppositeExcludedCategories: [],
      oppositeExcludedCategoryIds: normalizeExcludedCategoryIds(
        parsed.oppositeExcludedCategoryIds,
      ),
      showFiltersAsBadge:
        (parsed.showFiltersAsBadge as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showFiltersAsBadge,
      showOppositeType:
        (parsed.showOppositeType as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.showOppositeType,
      showDifference:
        parsed.showOppositeType === true && parsed.showDifference === true,
      compare:
        (parsed.compare as boolean | undefined) ??
        DEFAULT_TYPE_RESUME_CONFIG.compare,
      minBalance: parseMinBalance(parsed.minBalance),
    };
  } catch (err) {
    console.error(err);
    return DEFAULT_TYPE_RESUME_CONFIG;
  }
};

export const getActiveFiltersCount = (
  formConfig: TypeResumeTypeFormType,
): number => {
  const hasExcludedCategories =
    (formConfig.excludedCategoryIds?.length ?? 0) > 0;
  const hasOppositeExcludedCategories =
    formConfig.showOppositeType &&
    (formConfig.oppositeExcludedCategoryIds?.length ?? 0) > 0;

  return (
    2 +
    (formConfig.account ? 1 : 0) +
    (hasExcludedCategories ? 1 : 0) +
    (hasOppositeExcludedCategories ? 1 : 0)
  );
};

export const getTimeKey = (
  time?: TransactionTypeResumeTime,
): (typeof TIME_KEY_BY_VALUE)[TransactionTypeResumeTime] =>
  TIME_KEY_BY_VALUE[time ?? TransactionTypeResumeTime.CurrentMonth] ??
  "CurrentMonth";

export const isPreviousTime = (time?: TransactionTypeResumeTime): boolean =>
  time !== undefined && PREVIOUS_TIMES.includes(time);

export const getPreviousTimeKey = (
  time?: TransactionTypeResumeTime,
):
  | "CurrentDay"
  | "CurrentWeek"
  | "CurrentMonth"
  | "CurrentYear"
  | "PreviousDay"
  | "PreviousWeek"
  | "PreviousMonth"
  | "PreviousYear" => {
  switch (time) {
    case TransactionTypeResumeTime.CurrentDay:
      return "CurrentDay";
    case TransactionTypeResumeTime.CurrentWeek:
      return "CurrentWeek";
    case TransactionTypeResumeTime.CurrentYear:
      return "CurrentYear";
    case TransactionTypeResumeTime.PreviousDay:
      return "PreviousDay";
    case TransactionTypeResumeTime.PreviousWeek:
      return "PreviousWeek";
    case TransactionTypeResumeTime.PreviousMonth:
      return "PreviousMonth";
    case TransactionTypeResumeTime.PreviousYear:
      return "PreviousYear";
    case TransactionTypeResumeTime.CurrentMonth:
    case undefined:
    default:
      return "CurrentMonth";
  }
};

export const getCurrentPeriodLabelKey = (
  time?: TransactionTypeResumeTime,
): string =>
  isPreviousTime(time)
    ? `_entities:transaction.typeResume.time.values.${getTimeKey(time)}`
    : "_pages:home.dashboard.transactionTypeResume.compareColumns.current";

export const getPreviousPeriodLabelKey = (
  time?: TransactionTypeResumeTime,
): string =>
  isPreviousTime(time)
    ? `_pages:home.dashboard.transactionTypeResume.compareColumns.beforePrevious.${getTimeKey(
        time,
      )}`
    : "_pages:home.dashboard.transactionTypeResume.compareColumns.previous";

export const haveSameIds = (
  left: Array<number | string>,
  right: Array<number | string>,
) =>
  left.length === right.length &&
  left.every((value, index) => Number(value) === Number(right[index]));

export const getOppositeTransactionType = (
  type: TransactionType,
): TransactionType =>
  type === TransactionType.In ? TransactionType.Out : TransactionType.In;

export const getTypeResumeDifference = (
  type: TransactionType,
  primaryTotal: number,
  oppositeTotal: number,
): number =>
  roundCurrency(
    type === TransactionType.In
      ? primaryTotal - oppositeTotal
      : oppositeTotal - primaryTotal,
  );

export const toTypeResumeFilterConfig = (
  data: TypeResumeTypeFormType,
): FilterTypeResumeConfigType => {
  const excludedCategoryIds = normalizeExcludedCategoryIds(
    data.excludedCategoryIds,
  );

  return {
    accountId: data.account?.id,
    type: data.type ?? TransactionType.In,
    time: data.time ?? TransactionTypeResumeTime.CurrentMonth,
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
  };
};

export const toTypeResumeBatchRequestItem: ToTypeResumeBatchRequestItemType = (
  cardId,
  data,
) => {
  const filterConfig = toTypeResumeFilterConfig(data);
  const oppositeExcludedCategoryIds = normalizeExcludedCategoryIds(
    data.oppositeExcludedCategoryIds,
  );

  return {
    cardId,
    ...filterConfig,
    includeOpposite: !!data.showOppositeType,
    ...(data.showOppositeType && oppositeExcludedCategoryIds.length
      ? { oppositeExcludedCategoryIds }
      : {}),
    // Prediction needs the previous period even when the compare columns are hidden
    ...(data.compare || isPredictableTime(data.time) ? { compare: true } : {}),
  };
};

export const formToDto = (
  data: TypeResumeTypeFormType,
): UpdateDashboardCardConfigDto => {
  const excludedCategoryIds = normalizeExcludedCategoryIds(
    data.excludedCategoryIds,
  );
  const oppositeExcludedCategoryIds = normalizeExcludedCategoryIds(
    data.oppositeExcludedCategoryIds,
  );
  const minBalance = parseMinBalance(data.minBalance);
  const stringified = JSON.stringify({
    account: data.account,
    type: data.type,
    time: data.time,
    showFiltersAsBadge: !!data.showFiltersAsBadge,
    showOppositeType: !!data.showOppositeType,
    showDifference: !!data.showOppositeType && !!data.showDifference,
    compare: !!data.compare,
    ...(data.showOppositeType && minBalance !== undefined
      ? { minBalance }
      : {}),
    ...(excludedCategoryIds.length ? { excludedCategoryIds } : {}),
    ...(data.showOppositeType && oppositeExcludedCategoryIds.length
      ? { oppositeExcludedCategoryIds }
      : {}),
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

export const isPredictableTime = (time?: TransactionTypeResumeTime): boolean =>
  time !== undefined && PREDICTABLE_TIMES.includes(time);

const parseLocalDate = (value: string): Date | null => {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const startOfDay = (value: Date): Date =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate());

export const getPeriodProgress = (
  startDate: string,
  endDate: string,
  today: Date = new Date(),
): TypeResumePeriodProgressType | null => {
  const start = parseLocalDate(startDate);
  const end = parseLocalDate(endDate);
  if (!start || !end || end < start) return null;

  const totalDays =
    Math.round((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;
  const elapsed =
    Math.floor((startOfDay(today).getTime() - start.getTime()) / DAY_IN_MS) + 1;
  const elapsedDays = Math.min(Math.max(elapsed, 0), totalDays);

  return { elapsedDays, totalDays, ratio: elapsedDays / totalDays };
};

/**
 * Assumes the rest of the period behaves like the same days of the previous
 * period, so lump sums already received/paid (salary, rent) are not counted
 * twice.
 */
export const predictPeriodTotal = (
  current: number,
  previousRemaining: number,
): number => roundCurrency(current + previousRemaining);

/**
 * Share of the reference still unspent at the forecast close. Reference is the
 * expense budget left by the minimum balance when one is set, otherwise the
 * previous period expenses.
 */
export const getPredictionMargin = (
  params: GetPredictionStatusParamsType,
): number | null => {
  const { expense, income, minBalance } = params;

  if (minBalance !== undefined && income) {
    const allowedExpense = income.predicted - minBalance;
    return allowedExpense > 0
      ? (allowedExpense - expense.predicted) / allowedExpense
      : -1;
  }

  return expense.previous > 0
    ? (expense.previous - expense.predicted) / expense.previous
    : null;
};

export const getPredictionStatus = (
  params: GetPredictionStatusParamsType,
): TypeResumePredictionStatusType => {
  const { expense, income, balance, minBalance } = params;
  const usesMinBalance = minBalance !== undefined && !!income && !!balance;

  if (usesMinBalance && balance.current < minBalance) return "exceeded";
  if (!usesMinBalance) {
    if (expense.previous <= 0) return "unknown";
    if (expense.current > expense.previous) return "exceeded";
  }

  const margin = getPredictionMargin(params) ?? 0;
  if (margin >= PREDICTION_WARNING_MARGIN) return "success";
  if (margin >= PREDICTION_DANGER_MARGIN) return "warning";
  return "danger";
};

const toPredictionValues = (
  totals: TypeResumePredictionTotalsType,
): TypeResumePredictionValuesType => ({
  current: roundCurrency(totals.current),
  previous: roundCurrency(totals.previous),
  predicted: predictPeriodTotal(totals.current, totals.previousRemaining),
});

export const getTypeResumePrediction = (
  params: GetTypeResumePredictionParamsType,
): TypeResumePredictionType | null => {
  const { type, progress, primary, opposite, minBalance } = params;

  const expenseTotals = type === TransactionType.Out ? primary : opposite;
  const incomeTotals = type === TransactionType.In ? primary : opposite;
  if (!expenseTotals) return null;

  const expense = toPredictionValues(expenseTotals);
  const income = incomeTotals ? toPredictionValues(incomeTotals) : undefined;
  const balance = income
    ? {
        current: roundCurrency(income.current - expense.current),
        previous: roundCurrency(income.previous - expense.previous),
        predicted: roundCurrency(income.predicted - expense.predicted),
      }
    : undefined;

  const statusParams = {
    expense,
    income,
    balance,
    minBalance: balance ? minBalance : undefined,
  };

  return {
    progress,
    status: getPredictionStatus(statusParams),
    margin: getPredictionMargin(statusParams),
    expense,
    income,
    balance,
    minBalance: statusParams.minBalance,
  };
};

export const getPredictionAmountClassName = (
  amount: number,
  total: boolean,
): string =>
  classNames(
    "type-resume-prediction-amount poppins",
    total &&
      (amount >= 0
        ? "type-resume-amount--income"
        : "type-resume-amount--expense"),
  );

export const getPredictionDescriptionKey = (
  prediction: TypeResumePredictionType,
): string =>
  `_pages:home.dashboard.transactionTypeResume.prediction.${
    prediction.minBalance === undefined ? "status" : "minBalanceStatus"
  }.${prediction.status}.description`;
