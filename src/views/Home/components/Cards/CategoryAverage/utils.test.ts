import { describe, expect, it, vi, afterEach } from "vitest";

import { CategoryAverageGranularity, TransactionType } from "lib";

import {
  formToDto,
  getActiveFiltersCount,
  parseFormConfig,
  presetGranularity,
  presetToRange,
  resolvePreset,
} from "./utils";
import { CategoryAveragePreset } from "./types";
import { DEFAULT_CATEGORY_AVERAGE_PRESET } from "./constants";

describe("CategoryAverage utils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("falls back to defaults on an empty config", () => {
    expect(parseFormConfig(undefined)).toMatchObject({
      account: null,
      type: TransactionType.Out,
      categories: [],
      categoryIds: [],
      preset: DEFAULT_CATEGORY_AVERAGE_PRESET,
    });
  });

  it("derives category ids from the stored categories", () => {
    const parsed = parseFormConfig(
      JSON.stringify({
        categories: [
          { id: 7, name: "Food" },
          { id: 3, name: "Delivery" },
        ],
        preset: CategoryAveragePreset.Year,
      }),
    );

    expect(parsed.categoryIds).toEqual([7, 3]);
    expect(parsed.preset).toBe(CategoryAveragePreset.Year);
  });

  it("serializes the form keeping category ids in sync", () => {
    const dto = formToDto({
      userId: 4,
      id: 9,
      account: null,
      type: TransactionType.Out,
      categories: [{ id: 7, name: "Food" }],
      categoryIds: [],
      preset: CategoryAveragePreset.Semester,
      showFiltersAsBadge: true,
    });

    expect(dto.userId).toBe(4);
    expect(dto.id).toBe(9);
    expect(JSON.parse(dto.config)).toMatchObject({
      categoryIds: [7],
      preset: CategoryAveragePreset.Semester,
      showFiltersAsBadge: true,
    });
  });

  it("counts range and type as always active filters", () => {
    expect(getActiveFiltersCount(parseFormConfig(JSON.stringify({})))).toBe(2);
    expect(
      getActiveFiltersCount(
        parseFormConfig(
          JSON.stringify({
            account: { id: 1, name: "Main" },
            categories: [{ id: 7, name: "Food" }],
          }),
        ),
      ),
    ).toBe(4);
  });

  it("maps presets to ranges and granularity", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-10T12:00:00Z"));

    expect(presetToRange(CategoryAveragePreset.Quarter)).toEqual({
      from: "2025-12-10",
      to: "2026-03-10",
    });
    expect(presetToRange(CategoryAveragePreset.Ytd).from).toBe("2026-01-01");
    expect(presetGranularity(CategoryAveragePreset.EightWeeks)).toBe(
      CategoryAverageGranularity.Week,
    );
    expect(presetGranularity(CategoryAveragePreset.Year)).toBe(
      CategoryAverageGranularity.Month,
    );
    expect(resolvePreset(undefined)).toBe(DEFAULT_CATEGORY_AVERAGE_PRESET);
  });
});
