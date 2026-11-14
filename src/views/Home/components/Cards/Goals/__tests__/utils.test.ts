import { describe, expect, it } from "vitest";

import { GoalStatus } from "lib";

import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  selectCardGoals,
} from "../utils";
import { buildGoal } from "../../../../../Goals/__tests__/fixtures";

describe("Goals card config", () => {
  it("defaults to every goal on empty or broken config", () => {
    expect(parseFormConfig(null)).toEqual({ goals: [] });
    expect(parseFormConfig("{bad")).toEqual({ goals: [] });
    expect(parseFormConfig('{"goals":"x"}')).toEqual({ goals: [] });
  });

  it("round-trips the picked goals, dropping invalid entries", () => {
    const dto = formToDto({
      userId: 7,
      id: 3,
      goals: [{ id: 1, name: "Bike" }],
    });

    expect(dto.userId).toBe(7);
    expect(dto.id).toBe(3);
    expect(parseFormConfig(dto.config)).toEqual({
      goals: [{ id: 1, name: "Bike" }],
    });
    expect(
      parseFormConfig('{"goals":[{"id":2,"name":"Trip"},{"id":"x"},null]}'),
    ).toEqual({ goals: [{ id: 2, name: "Trip" }] });
  });

  it("counts the goal selection as an active filter", () => {
    expect(getActiveFiltersCount({ goals: [] })).toBe(0);
    expect(getActiveFiltersCount({ goals: [{ id: 1, name: "Bike" }] })).toBe(1);
  });
});

describe("selectCardGoals", () => {
  const goals = [
    buildGoal({ id: 1, deadline: "2026-12-01" }),
    buildGoal({ id: 2, deadline: "2027-01-01" }),
    buildGoal({ id: 3, status: GoalStatus.Completed }),
    buildGoal({ id: 4, deletedAt: new Date("2026-11-02T00:00:00Z") }),
  ];

  it("shows every active, non-deleted goal in list order when none is picked", () => {
    expect(selectCardGoals(goals, []).map((goal) => goal.id)).toEqual([1, 2]);
  });

  it("shows only the picked active goals", () => {
    expect(
      selectCardGoals(goals, [
        { id: 2, name: "" },
        { id: 3, name: "" },
      ]).map((goal) => goal.id),
    ).toEqual([2]);
  });
});
