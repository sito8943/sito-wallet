import { describe, expect, it } from "vitest";

import {
  appendSavingsDepositParams,
  resolveDepositDay,
  resolveMonthlyDeposit,
  toSavingsDepositFilter,
} from "../savingsProjection";

describe("resolveMonthlyDeposit", () => {
  it("keeps positive amounts, including numeric strings", () => {
    expect(resolveMonthlyDeposit(50)).toBe(50);
    expect(resolveMonthlyDeposit("12.5")).toBe(12.5);
  });

  it("treats missing, zero, negative and invalid values as no deposit", () => {
    expect(resolveMonthlyDeposit(undefined)).toBeNull();
    expect(resolveMonthlyDeposit(null)).toBeNull();
    expect(resolveMonthlyDeposit("")).toBeNull();
    expect(resolveMonthlyDeposit(0)).toBeNull();
    expect(resolveMonthlyDeposit(-5)).toBeNull();
    expect(resolveMonthlyDeposit("abc")).toBeNull();
  });

  it("caps the amount at the backend maximum", () => {
    expect(resolveMonthlyDeposit(5_000_000_000)).toBe(1_000_000_000);
  });
});

describe("resolveDepositDay", () => {
  it("keeps integer days between 1 and 31", () => {
    expect(resolveDepositDay(1)).toBe(1);
    expect(resolveDepositDay("15")).toBe(15);
    expect(resolveDepositDay(31)).toBe(31);
  });

  it("defaults missing or out-of-range days to 1", () => {
    expect(resolveDepositDay(undefined)).toBe(1);
    expect(resolveDepositDay(0)).toBe(1);
    expect(resolveDepositDay(32)).toBe(1);
    expect(resolveDepositDay(2.5)).toBe(1);
  });
});

describe("toSavingsDepositFilter", () => {
  it("is empty without an amount > 0", () => {
    expect(toSavingsDepositFilter(null, 10)).toEqual({});
    expect(toSavingsDepositFilter(0, 10)).toEqual({});
  });

  it("includes amount and resolved day when an amount is set", () => {
    expect(toSavingsDepositFilter(50, 10)).toEqual({
      monthlyDeposit: 50,
      depositDay: 10,
    });
    expect(toSavingsDepositFilter(50, undefined)).toEqual({
      monthlyDeposit: 50,
      depositDay: 1,
    });
  });
});

describe("appendSavingsDepositParams", () => {
  it("adds both params only when a deposit is set", () => {
    const params = appendSavingsDepositParams(
      new URLSearchParams({ horizon: "1Y" }),
      { monthlyDeposit: 50, depositDay: 1 },
    );
    expect(params.toString()).toBe("horizon=1Y&monthlyDeposit=50&depositDay=1");
  });

  it("leaves the query untouched without a deposit", () => {
    expect(
      appendSavingsDepositParams(new URLSearchParams({ month: "2026-11" }), {
        monthlyDeposit: 0,
        depositDay: 5,
      }).toString(),
    ).toBe("month=2026-11");
    expect(
      appendSavingsDepositParams(
        new URLSearchParams({ month: "2026-11" }),
        {},
      ).toString(),
    ).toBe("month=2026-11");
  });
});
