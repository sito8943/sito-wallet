import { describe, expect, it } from "vitest";

import { TransactionType, TransactionTypeResumeTime } from "lib";

import {
  formToDto,
  getComparisonTotal,
  getOppositeTransactionType,
  isCompareToDate,
  getPeriodProgress,
  getPredictionStatus,
  getTypeResumePrediction,
  parseMinBalance,
  predictPeriodTotal,
  normalizeExcludedCategoryIds,
  parseFormConfig,
  toTypeResumeBatchRequestItem,
  toTypeResumeFilterConfig,
} from "./utils";

describe("TypeResume utils", () => {
  it("normalizes excluded category ids", () => {
    expect(normalizeExcludedCategoryIds([8, "7", 8, "invalid", 3])).toEqual([
      3, 7, 8,
    ]);
  });

  it("parses legacy config without excluded categories", () => {
    expect(
      parseFormConfig(
        JSON.stringify({
          accounts: [{ id: 12, name: "Main" }],
          type: TransactionType.Out,
          time: TransactionTypeResumeTime.CurrentWeek,
        }),
      ),
    ).toMatchObject({
      account: { id: 12, name: "Main" },
      type: TransactionType.Out,
      time: TransactionTypeResumeTime.CurrentWeek,
      excludedCategoryIds: [],
      excludedCategories: [],
      oppositeExcludedCategoryIds: [],
      oppositeExcludedCategories: [],
      showOppositeType: false,
    });
  });

  it("resolves the opposite transaction type", () => {
    expect(getOppositeTransactionType(TransactionType.In)).toBe(
      TransactionType.Out,
    );
    expect(getOppositeTransactionType(TransactionType.Out)).toBe(
      TransactionType.In,
    );
  });

  it("builds filter config with normalized excluded ids", () => {
    expect(
      toTypeResumeFilterConfig({
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [],
        excludedCategoryIds: [9, 3, 9],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [],
        showFiltersAsBadge: false,
        showOppositeType: false,
        showDifference: false,
      }),
    ).toEqual({
      accountId: 4,
      type: TransactionType.In,
      time: TransactionTypeResumeTime.CurrentMonth,
      excludedCategoryIds: [3, 9],
    });
  });

  it("serializes only persisted config fields", () => {
    expect(
      formToDto({
        id: 11,
        userId: 22,
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [
          {
            id: 8,
            name: "Food",
            color: null,
            auto: false,
            type: TransactionType.Out,
          },
        ],
        excludedCategoryIds: [8, 8, 3],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [10, 10, 12],
        showFiltersAsBadge: false,
        showOppositeType: true,
        showDifference: false,
      }),
    ).toEqual({
      id: 11,
      userId: 22,
      config: JSON.stringify({
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        showFiltersAsBadge: false,
        showOppositeType: true,
        showDifference: false,
        compare: false,
        excludedCategoryIds: [3, 8],
        oppositeExcludedCategoryIds: [10, 12],
      }),
    });
  });

  it("builds a batch request item with opposite exclusions", () => {
    expect(
      toTypeResumeBatchRequestItem(44, {
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [],
        excludedCategoryIds: [9, 3, 9],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [12, 10, 10],
        showFiltersAsBadge: false,
        showOppositeType: true,
        showDifference: false,
      }),
    ).toEqual({
      cardId: 44,
      accountId: 4,
      type: TransactionType.In,
      time: TransactionTypeResumeTime.CurrentMonth,
      excludedCategoryIds: [3, 9],
      includeOpposite: true,
      oppositeExcludedCategoryIds: [10, 12],
      compare: true,
    });
  });

  it("does not request comparison for closed periods without compare", () => {
    expect(
      toTypeResumeBatchRequestItem(45, {
        type: TransactionType.Out,
        time: TransactionTypeResumeTime.PreviousMonth,
        excludedCategories: [],
        excludedCategoryIds: [],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [],
        showFiltersAsBadge: false,
        showOppositeType: false,
        showDifference: false,
        compare: false,
      }),
    ).not.toHaveProperty("compare");
  });
});

describe("TypeResume compare to date", () => {
  const base = {
    compare: true,
    compareToDate: true,
    time: TransactionTypeResumeTime.CurrentMonth,
  };

  it("applies only to ongoing periods with compare on", () => {
    expect(isCompareToDate(base)).toBe(true);
    expect(isCompareToDate({ ...base, compare: false })).toBe(false);
    expect(isCompareToDate({ ...base, compareToDate: false })).toBe(false);
    expect(
      isCompareToDate({ ...base, time: TransactionTypeResumeTime.CurrentDay }),
    ).toBe(false);
    expect(
      isCompareToDate({
        ...base,
        time: TransactionTypeResumeTime.PreviousMonth,
      }),
    ).toBe(false);
  });

  it("cuts the previous total at the same elapsed day", () => {
    const comparison = { total: 1258.45, remainingTotal: 400.45 };
    expect(getComparisonTotal(comparison, true)).toBeCloseTo(858);
    expect(getComparisonTotal(comparison, false)).toBe(1258.45);
  });

  it("falls back to the whole period without remainingTotal", () => {
    expect(getComparisonTotal({ total: 100 }, true)).toBe(100);
    expect(getComparisonTotal(undefined, true)).toBe(0);
  });

  it("persists compareToDate only when it applies", () => {
    const form = parseFormConfig(JSON.stringify(base));
    expect(form.compareToDate).toBe(true);
    expect(JSON.parse(formToDto(form).config ?? "{}").compareToDate).toBe(true);
    const daily = { ...form, time: TransactionTypeResumeTime.CurrentDay };
    expect(
      JSON.parse(formToDto(daily).config ?? "{}").compareToDate,
    ).toBeUndefined();
  });
});

describe("TypeResume prediction", () => {
  const today = new Date(2026, 9, 11); // Oct 11 → 11 of 31 days

  it("computes period progress including today", () => {
    expect(getPeriodProgress("2026-10-01", "2026-10-31", today)).toEqual({
      elapsedDays: 11,
      totalDays: 31,
      ratio: 11 / 31,
    });
  });

  it("adds what the previous period accumulated on the remaining days", () => {
    expect(predictPeriodTotal(1266.3, 0)).toBe(1266.3);
    expect(predictPeriodTotal(804.82, 120.5)).toBe(925.32);
  });

  it.each([
    [{ current: 50, previous: 1000, predicted: 700 }, "success"],
    [{ current: 50, previous: 1000, predicted: 850 }, "warning"],
    [{ current: 50, previous: 1000, predicted: 950 }, "danger"],
    [{ current: 50, previous: 1000, predicted: 1100 }, "danger"],
    [{ current: 1001, previous: 1000, predicted: 1500 }, "exceeded"],
    [{ current: 50, previous: 0, predicted: 50 }, "unknown"],
  ] as const)("maps %o to %s", (expense, status) => {
    expect(getPredictionStatus({ expense })).toBe(status);
  });

  it.each([
    [
      { current: 1266.3, previous: 1240.98, predicted: 1266.3 },
      600,
      0,
      "success",
    ],
    [
      { current: 1266.3, previous: 1240.98, predicted: 1266.3 },
      820,
      0,
      "warning",
    ],
    [
      { current: 1266.3, previous: 1240.98, predicted: 1266.3 },
      900,
      0,
      "danger",
    ],
    [
      { current: 100, previous: 1240.98, predicted: 1266.3 },
      600,
      0,
      "exceeded",
    ],
  ] as const)(
    "uses the minimum balance when set (income %o, expense %d)",
    (income, expensePredicted, _unused, status) => {
      const expense = {
        current: 500,
        previous: 899.63,
        predicted: expensePredicted,
      };
      const balance = {
        current: income.current - expense.current,
        previous: income.previous - expense.previous,
        predicted: income.predicted - expense.predicted,
      };

      expect(
        getPredictionStatus({ expense, income, balance, minBalance: 300 }),
      ).toBe(status);
    },
  );

  it("parses an empty minimum balance as unset", () => {
    expect(parseMinBalance("")).toBeUndefined();
    expect(parseMinBalance("300")).toBe(300);
    expect(parseMinBalance(null)).toBeUndefined();
  });

  it("uses the opposite totals as expenses for income cards", () => {
    const prediction = getTypeResumePrediction({
      type: TransactionType.In,
      progress: { elapsedDays: 17, totalDays: 31, ratio: 17 / 31 },
      primary: { current: 1266.3, previous: 1240.98, previousRemaining: 0 },
      opposite: { current: 804.82, previous: 899.63, previousRemaining: 60 },
    });

    expect(prediction?.income?.predicted).toBe(1266.3);
    expect(prediction?.expense.predicted).toBe(864.82);
    expect(prediction?.balance?.predicted).toBe(401.48);
    expect(prediction?.status).toBe("danger");
  });

  it("returns null when an income card has no expense data", () => {
    expect(
      getTypeResumePrediction({
        type: TransactionType.In,
        progress: { elapsedDays: 11, totalDays: 31, ratio: 11 / 31 },
        primary: { current: 10, previous: 20, previousRemaining: 5 },
      }),
    ).toBeNull();
  });
});
