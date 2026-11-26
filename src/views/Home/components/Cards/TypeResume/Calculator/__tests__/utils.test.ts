import { describe, expect, it } from "vitest";

import { TransactionType, TransactionTypeResumeTime } from "lib";
import type { TransactionTypeResumeDto } from "lib";

import {
  clampMonths,
  getCalculatorPrefill,
  getFirstNegativeMonth,
  parseCalculatorDraft,
  projectCalculator,
  resolveCalculatorState,
  toAmount,
} from "../utils";
import type { CalculatorPrefillType } from "../types";

const now = new Date(2026, 10, 26);

const resume = (
  total: number,
  previous?: number,
): TransactionTypeResumeDto => ({
  startDate: "2026-11-01",
  endDate: "2026-11-30",
  total,
  categorizedTotal: total,
  duplicatedAmount: 0,
  categories: [],
  ...(previous !== undefined
    ? {
        comparison: {
          startDate: "2026-10-01",
          endDate: "2026-10-31",
          total: previous,
          categorizedTotal: previous,
          duplicatedAmount: 0,
          categories: [],
        },
      }
    : {}),
});

const line = (type: TransactionType, amount: number | string, month = 1) => ({
  id: `${type}-${amount}-${month}`,
  name: "",
  type,
  amount,
  month,
});

describe("calculator projection", () => {
  // The user's example: 1.6k purchase next month, 1.2k salary, 250 on food
  const state: CalculatorPrefillType = {
    startBalance: 1000,
    months: 3,
    monthly: [line(TransactionType.In, 1200), line(TransactionType.Out, 250)],
    oneOff: [line(TransactionType.Out, "1600", 1)],
  };

  it("adds monthly lines from next month and one-offs on their month", () => {
    const results = projectCalculator(state, now);

    expect(results.map((result) => result.balance)).toEqual([
      1000, 350, 1300, 2250,
    ]);
    expect(results[1]).toMatchObject({ income: 1200, expense: 1850 });
    expect(results[1].date).toEqual(new Date(2026, 11, 1));
  });

  it("applies one-offs placed now to the current month only", () => {
    const results = projectCalculator(
      { ...state, oneOff: [line(TransactionType.Out, 1600, 0)] },
      now,
    );

    expect(results[0].balance).toBe(-600);
    expect(getFirstNegativeMonth(results)?.index).toBe(0);
  });

  it("finds no negative month when the balance holds", () => {
    expect(
      getFirstNegativeMonth(projectCalculator(state, now)),
    ).toBeUndefined();
  });
});

describe("calculator inputs", () => {
  it("parses typed amounts", () => {
    expect(toAmount("1,6")).toBe(1.6);
    expect(toAmount("")).toBe(0);
    expect(toAmount("abc")).toBe(0);
  });

  it("clamps the months", () => {
    expect(clampMonths(0)).toBe(1);
    expect(clampMonths("12")).toBe(12);
    expect(clampMonths(99)).toBe(36);
  });
});

describe("calculator prefill", () => {
  const names = { incomeName: "In", expenseName: "Out" };

  it("uses last month's totals of a current month card", () => {
    const prefill = getCalculatorPrefill({
      ...names,
      time: TransactionTypeResumeTime.CurrentMonth,
      primaryType: TransactionType.Out,
      primary: resume(986.44, 1258.45),
      opposite: resume(1344.55, 1298.3),
      balance: 2500,
    });

    expect(prefill.startBalance).toBe(2500);
    expect(
      prefill.monthly.map(({ type, amount, name }) => [type, amount, name]),
    ).toEqual([
      [TransactionType.In, 1298.3, "In"],
      [TransactionType.Out, 1258.45, "Out"],
    ]);
  });

  it("uses the card totals of a previous month card", () => {
    const prefill = getCalculatorPrefill({
      ...names,
      time: TransactionTypeResumeTime.PreviousMonth,
      primaryType: TransactionType.In,
      primary: resume(1200),
    });

    expect(prefill.startBalance).toBe(0);
    expect(prefill.monthly).toHaveLength(1);
    expect(prefill.monthly[0]).toMatchObject({ amount: 1200 });
  });

  it("leaves the lines empty for non monthly cards", () => {
    const prefill = getCalculatorPrefill({
      ...names,
      time: TransactionTypeResumeTime.CurrentWeek,
      primaryType: TransactionType.In,
      primary: resume(100, 90),
    });

    expect(prefill.monthly).toEqual([]);
  });
});

describe("calculator draft", () => {
  const prefill: CalculatorPrefillType = {
    startBalance: 500,
    months: 6,
    monthly: [],
    oneOff: [],
  };

  it("follows the account balance until the user types one", () => {
    const draft = { ...prefill, startBalance: null };
    expect(resolveCalculatorState(draft, prefill).startBalance).toBe(500);
    expect(
      resolveCalculatorState({ ...draft, startBalance: "80" }, prefill)
        .startBalance,
    ).toBe(80);
  });

  it("discards malformed drafts", () => {
    expect(parseCalculatorDraft(null)).toBeNull();
    expect(parseCalculatorDraft("{bad json")).toBeNull();
    expect(parseCalculatorDraft(JSON.stringify({ months: 3 }))).toBeNull();
    expect(
      parseCalculatorDraft(
        JSON.stringify({
          startBalance: null,
          months: 99,
          monthly: [line(TransactionType.In, 10)],
          oneOff: [],
        }),
      ),
    ).toMatchObject({ months: 36 });
  });
});
