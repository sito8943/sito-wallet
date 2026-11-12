import { describe, expect, it } from "vitest";

import { ACCOUNT_BANK_NAME } from "../../entities/account/AccountBankName";
import { ACCOUNT_REWARDS_PRESETS } from "../../entities/account/AccountRewardsPresets";
import { AdjustRewardsMode } from "../../entities/account/AdjustRewardsMode";
import { RewardsPairError } from "../../entities/account/RewardsPairError";
import { RewardsRounding } from "../../entities/account/RewardsRounding";
import {
  findMatchingRewardsPreset,
  formatRewardsPoints,
  getRewardsPresetEntries,
  getRewardsPresets,
  resolveRewardsMonths,
  toAdjustRewardsDto,
  validateRewardsPair,
} from "../rewards";

const revolutPlans = ACCOUNT_REWARDS_PRESETS[ACCOUNT_BANK_NAME.REVOLUT] ?? [];

describe("ACCOUNT_REWARDS_PRESETS", () => {
  it("lists the Revolut plans with their spend unit", () => {
    expect(
      revolutPlans.map(({ label, values }) => [label, values.rewardsSpendUnit]),
    ).toEqual([
      ["Standard", 10],
      ["Plus", 10],
      ["Premium", 4],
      ["Metal", 2],
      ["Ultra", 1],
    ]);
  });

  it("earns 1 RevPoint per step, floored per transaction", () => {
    revolutPlans.forEach(({ values }) => {
      expect(values.rewardsName).toBe("RevPoints");
      expect(values.rewardsPointsPerUnit).toBe(1);
      expect(values.rewardsRounding).toBe(RewardsRounding.FloorPerTransaction);
    });
  });
});

describe("getRewardsPresets", () => {
  it("returns the plans of a known bank", () => {
    expect(getRewardsPresets(ACCOUNT_BANK_NAME.REVOLUT)).toBe(revolutPlans);
  });

  it("returns no plans for banks without presets or blank banks", () => {
    expect(getRewardsPresets(ACCOUNT_BANK_NAME.CAIXA)).toEqual([]);
    expect(getRewardsPresets("Unknown bank")).toEqual([]);
    expect(getRewardsPresets("")).toEqual([]);
    expect(getRewardsPresets(undefined)).toEqual([]);
    expect(getRewardsPresets(null)).toEqual([]);
  });
});

describe("getRewardsPresetEntries", () => {
  it("returns the field/value pairs a plan writes into the form", () => {
    const premium = revolutPlans.find(({ id }) => id === "premium");
    expect(premium).toBeDefined();
    expect(Object.fromEntries(getRewardsPresetEntries(premium!))).toEqual({
      rewardsName: "RevPoints",
      rewardsSpendUnit: 4,
      rewardsPointsPerUnit: 1,
      rewardsRounding: RewardsRounding.FloorPerTransaction,
    });
  });

  it("never touches the personal fields (point value, start date)", () => {
    revolutPlans.forEach((plan) => {
      const names = getRewardsPresetEntries(plan).map(([name]) => name);
      expect(names).not.toContain("rewardsPointValue");
      expect(names).not.toContain("rewardsStartDate");
    });
  });
});

describe("findMatchingRewardsPreset", () => {
  it("matches raw form strings", () => {
    expect(
      findMatchingRewardsPreset(revolutPlans, {
        rewardsSpendUnit: "2",
        rewardsPointsPerUnit: "1",
      })?.id,
    ).toBe("metal");
  });

  it("returns the first plan when several share the mechanics", () => {
    expect(
      findMatchingRewardsPreset(revolutPlans, {
        rewardsSpendUnit: 10,
        rewardsPointsPerUnit: 1,
      })?.id,
    ).toBe("standard");
  });

  it("returns undefined for custom values", () => {
    expect(
      findMatchingRewardsPreset(revolutPlans, {
        rewardsSpendUnit: 5,
        rewardsPointsPerUnit: 1,
      }),
    ).toBeUndefined();
    expect(findMatchingRewardsPreset([], {})).toBeUndefined();
  });
});

describe("validateRewardsPair", () => {
  it("accepts both empty (rewards disabled)", () => {
    expect(validateRewardsPair(null, undefined)).toBeNull();
    expect(validateRewardsPair("", "  ")).toBeNull();
  });

  it("accepts both set and > 0", () => {
    expect(validateRewardsPair(10, 1)).toBeNull();
    expect(validateRewardsPair("4", "1.5")).toBeNull();
  });

  it("rejects only one of the two", () => {
    expect(validateRewardsPair(10, "")).toBe(RewardsPairError.Incomplete);
    expect(validateRewardsPair(null, 1)).toBe(RewardsPairError.Incomplete);
  });

  it("rejects zero or negative values", () => {
    expect(validateRewardsPair(0, 1)).toBe(RewardsPairError.NotPositive);
    expect(validateRewardsPair(10, "-1")).toBe(RewardsPairError.NotPositive);
  });
});

describe("resolveRewardsMonths", () => {
  it("defaults to 12", () => {
    expect(resolveRewardsMonths(undefined)).toBe(12);
    expect(resolveRewardsMonths("")).toBe(12);
  });

  it("clamps to 1..60 and drops decimals", () => {
    expect(resolveRewardsMonths(0)).toBe(1);
    expect(resolveRewardsMonths(120)).toBe(60);
    expect(resolveRewardsMonths(6.7)).toBe(6);
  });
});

describe("toAdjustRewardsDto", () => {
  it("sends exactly one of delta / balance", () => {
    expect(toAdjustRewardsDto(AdjustRewardsMode.Delta, -500)).toEqual({
      delta: -500,
    });
    expect(toAdjustRewardsDto(AdjustRewardsMode.Balance, 1250)).toEqual({
      balance: 1250,
    });
  });
});

describe("formatRewardsPoints", () => {
  it("shows up to 2 decimals", () => {
    expect(formatRewardsPoints(1234.5, "en")).toBe("1,234.5");
    expect(formatRewardsPoints(12.345, "en")).toBe("12.35");
    expect(formatRewardsPoints(7, "en")).toBe("7");
  });
});
