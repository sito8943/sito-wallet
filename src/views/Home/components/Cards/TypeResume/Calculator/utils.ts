import { TransactionType, TransactionTypeResumeTime } from "lib";
import type { TransactionTypeResumeDto } from "lib";

import {
  CALCULATOR_DEFAULT_MONTHS,
  CALCULATOR_MAX_MONTHS,
  CALCULATOR_MIN_MONTHS,
  CALCULATOR_STORAGE_PREFIX,
} from "./constants";
import type {
  CalculatorLineType,
  CalculatorMonthOptionType,
  CalculatorMonthResultType,
  CalculatorPrefillType,
  CalculatorStateType,
  GetCalculatorPrefillParamsType,
} from "./types";

const round = (value: number): number => Math.round(value * 100) / 100;

/** Parses a typed amount ("1.6", "1,6", 1600); anything invalid counts as 0 */
export const toAmount = (value: number | string | null | undefined): number => {
  const parsed =
    typeof value === "number"
      ? value
      : Number(
          String(value ?? "")
            .trim()
            .replace(",", "."),
        );
  return Number.isFinite(parsed) ? parsed : 0;
};

export const clampMonths = (value: number | string): number => {
  const parsed = Math.trunc(toAmount(value));
  if (parsed < CALCULATOR_MIN_MONTHS) return CALCULATOR_MIN_MONTHS;
  if (parsed > CALCULATOR_MAX_MONTHS) return CALCULATOR_MAX_MONTHS;
  return parsed;
};

export const createCalculatorLine = (
  patch: Partial<CalculatorLineType> = {},
): CalculatorLineType => ({
  id: Math.random().toString(36).slice(2, 10),
  name: "",
  type: TransactionType.Out,
  amount: "",
  month: 1,
  ...patch,
});

/**
 * Month by month balance: month 0 is the current month (one-offs only, the
 * recurring lines of this month are assumed to be in the balance already);
 * months 1..N add every monthly line plus the one-offs placed there.
 */
export const projectCalculator = (
  state: CalculatorPrefillType,
  now: Date,
): CalculatorMonthResultType[] => {
  const months = clampMonths(state.months);
  const results: CalculatorMonthResultType[] = [];
  let balance = toAmount(state.startBalance);

  for (let index = 0; index <= months; index++) {
    const lines = [
      ...(index > 0 ? state.monthly : []),
      ...state.oneOff.filter((line) => line.month === index),
    ];
    const income = round(
      lines
        .filter((line) => line.type === TransactionType.In)
        .reduce((sum, line) => sum + Math.abs(toAmount(line.amount)), 0),
    );
    const expense = round(
      lines
        .filter((line) => line.type !== TransactionType.In)
        .reduce((sum, line) => sum + Math.abs(toAmount(line.amount)), 0),
    );
    balance = round(balance + income - expense);
    results.push({
      index,
      date: new Date(now.getFullYear(), now.getMonth() + index, 1),
      income,
      expense,
      balance,
    });
  }

  return results;
};

export const getFirstNegativeMonth = (
  results: CalculatorMonthResultType[],
): CalculatorMonthResultType | undefined =>
  results.find((result) => result.balance < 0);

/** Last month's total of a resume, when the card time allows to know it */
const getPreviousMonthTotal = (
  time: TransactionTypeResumeTime,
  resume?: TransactionTypeResumeDto,
): number | undefined => {
  if (!resume) return undefined;
  if (time === TransactionTypeResumeTime.CurrentMonth) {
    return resume.comparison?.total;
  }
  if (time === TransactionTypeResumeTime.PreviousMonth) return resume.total;
  return undefined;
};

/** Starting point: account balance + last month's income/expenses as monthly lines */
export const getCalculatorPrefill = (
  params: GetCalculatorPrefillParamsType,
): CalculatorPrefillType => {
  const { time, primaryType, primary, opposite, balance } = params;
  const resumeByType = {
    [primaryType]: primary,
    [primaryType === TransactionType.In
      ? TransactionType.Out
      : TransactionType.In]: opposite,
  };
  // Income first, as in the card
  const totals = [TransactionType.In, TransactionType.Out]
    .map((type) => ({
      type,
      total: getPreviousMonthTotal(time, resumeByType[type]),
    }))
    .filter((item) => item.total !== undefined && item.total > 0);

  return {
    startBalance: round(balance ?? 0),
    months: CALCULATOR_DEFAULT_MONTHS,
    monthly: totals.map((item) => ({
      id: `prefill-${item.type}`,
      name:
        item.type === TransactionType.In
          ? params.incomeName
          : params.expenseName,
      type: item.type,
      amount: round(item.total ?? 0),
      month: 1,
    })),
    oneOff: [],
  };
};

export const resolveCalculatorState = (
  draft: CalculatorStateType | null,
  prefill: CalculatorPrefillType,
): CalculatorPrefillType =>
  draft
    ? {
        ...draft,
        startBalance:
          draft.startBalance === null
            ? prefill.startBalance
            : toAmount(draft.startBalance),
      }
    : prefill;

export const getCalculatorStorageKey = (cardId: number): string =>
  `${CALCULATOR_STORAGE_PREFIX}${cardId}`;

const isLine = (value: unknown): value is CalculatorLineType => {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.id === "string" &&
    typeof line.name === "string" &&
    (line.type === TransactionType.In || line.type === TransactionType.Out) &&
    (typeof line.amount === "number" || typeof line.amount === "string") &&
    typeof line.month === "number"
  );
};

/** Validates a stored draft; anything malformed is discarded */
export const parseCalculatorDraft = (
  raw: string | null,
): CalculatorStateType | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const { startBalance, months, monthly, oneOff } = parsed;
    if (
      !(
        startBalance === null ||
        typeof startBalance === "number" ||
        typeof startBalance === "string"
      ) ||
      typeof months !== "number" ||
      !Array.isArray(monthly) ||
      !Array.isArray(oneOff) ||
      !monthly.every(isLine) ||
      !oneOff.every(isLine)
    ) {
      return null;
    }
    return { startBalance, months: clampMonths(months), monthly, oneOff };
  } catch {
    return null;
  }
};

export const readCalculatorDraft = (
  key: string,
): CalculatorStateType | null => {
  try {
    return parseCalculatorDraft(localStorage.getItem(key));
  } catch {
    return null;
  }
};

export const writeCalculatorDraft = (
  key: string,
  draft: CalculatorStateType | null,
): void => {
  try {
    if (draft) localStorage.setItem(key, JSON.stringify(draft));
    else localStorage.removeItem(key);
  } catch {
    // Storage blocked (private mode): the calculator still works in memory
  }
};

export const formatCalculatorMonth = (date: Date, locale: string): string =>
  new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" }).format(
    date,
  );

/** Month 0 reads "now"; the rest, "dic 2026" */
export const getCalculatorMonthLabel = (
  index: number,
  date: Date,
  locale: string,
  nowLabel: string,
): string => (index === 0 ? nowLabel : formatCalculatorMonth(date, locale));

export const getCalculatorMonthOptions = (
  results: CalculatorMonthResultType[],
  locale: string,
  nowLabel: string,
): CalculatorMonthOptionType[] =>
  results.map((result) => ({
    id: result.index,
    value: getCalculatorMonthLabel(result.index, result.date, locale, nowLabel),
  }));
