import { describe, expect, it } from "vitest";

import { GoalStatus } from "../../entities/goal/GoalStatus";
import {
  formatGoalAmount,
  formatGoalDeadline,
  formatGoalPercent,
  getGoalDeadlineInfo,
  getGoalProductName,
  isGoalReachedAndActive,
} from "../goal";

describe("goal utils", () => {
  it("formats amounts with two decimals in the locale", () => {
    expect(formatGoalAmount(1234.5, "en-US")).toBe("1,234.50");
    expect(formatGoalAmount(1234.5, "es-ES")).toBe("1234,50");
    expect(formatGoalAmount(Number.NaN, "en-US")).toBe("0.00");
  });

  it("formats percents with up to two decimals", () => {
    expect(formatGoalPercent(42.5, "en-US")).toBe("42.5");
    expect(formatGoalPercent(100, "en-US")).toBe("100");
    expect(formatGoalPercent(33.333, "en-US")).toBe("33.33");
  });

  it("formats the deadline as a local date", () => {
    expect(formatGoalDeadline("2026-01-01", "en-US")).toBe("Jan 1, 2026");
    expect(formatGoalDeadline(null, "en-US")).toBeNull();
    expect(formatGoalDeadline("whenever", "en-US")).toBe("whenever");
  });

  it.each([
    [null, { kind: "none", days: 0 }],
    [undefined, { kind: "none", days: 0 }],
    [12, { kind: "left", days: 12 }],
    [0, { kind: "today", days: 0 }],
    [-3, { kind: "overdue", days: 3 }],
  ])("reads daysLeft %j", (daysLeft, expected) => {
    expect(getGoalDeadlineInfo(daysLeft)).toEqual(expected);
  });

  it("names a goal after the product alias, else its name", () => {
    expect(getGoalProductName({ name: "BICI MTB 29", alias: "Bike" })).toBe(
      "Bike",
    );
    expect(getGoalProductName({ name: "BICI MTB 29", alias: null })).toBe(
      "BICI MTB 29",
    );
  });

  it("flags reached goals only while active", () => {
    expect(
      isGoalReachedAndActive({ reached: true, status: GoalStatus.Active }),
    ).toBe(true);
    expect(
      isGoalReachedAndActive({ reached: true, status: GoalStatus.Completed }),
    ).toBe(false);
    expect(
      isGoalReachedAndActive({ reached: false, status: GoalStatus.Active }),
    ).toBe(false);
  });
});
