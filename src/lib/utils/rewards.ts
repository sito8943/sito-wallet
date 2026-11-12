import type {
  AccountRewardsPlanPreset,
  AccountRewardsPresetValues,
  AdjustRewardsDto,
} from "../entities";
import { ACCOUNT_REWARDS_PRESETS } from "../entities/account/AccountRewardsPresets";
import {
  DEFAULT_REWARDS_MONTHS,
  REWARDS_MONTHS_MAX,
  REWARDS_MONTHS_MIN,
} from "../entities/account/AccountRewardsLimits";
import { AdjustRewardsMode } from "../entities/account/AdjustRewardsMode";
import { RewardsPairError } from "../entities/account/RewardsPairError";

import { parseNullableNumber } from "./number";

/** Rewards plans known for a bank (empty for unknown/blank banks). */
export const getRewardsPresets = (
  bankName: string | null | undefined,
): AccountRewardsPlanPreset[] => {
  if (!bankName) return [];
  return (
    (ACCOUNT_REWARDS_PRESETS as Record<string, AccountRewardsPlanPreset[]>)[
      bankName
    ] ?? []
  );
};

/** Field/value pairs a plan writes into the account form. */
export const getRewardsPresetEntries = (
  preset: AccountRewardsPlanPreset,
): [keyof AccountRewardsPresetValues, string | number][] =>
  Object.entries(preset.values) as [
    keyof AccountRewardsPresetValues,
    string | number,
  ][];

/**
 * The plan whose mechanics match the current values, so the form can mark it
 * as selected. The first match wins (plans may share mechanics).
 */
export const findMatchingRewardsPreset = (
  presets: AccountRewardsPlanPreset[],
  values: Partial<Record<keyof AccountRewardsPresetValues, unknown>>,
): AccountRewardsPlanPreset | undefined =>
  presets.find(
    ({ values: preset }) =>
      parseNullableNumber(values.rewardsSpendUnit) ===
        preset.rewardsSpendUnit &&
      parseNullableNumber(values.rewardsPointsPerUnit) ===
        preset.rewardsPointsPerUnit,
  );

/**
 * Spend unit and points per unit go together: both or none, and each > 0.
 * Accepts raw form values (strings) as well as numbers. null = valid.
 */
export const validateRewardsPair = (
  spendUnit: unknown,
  pointsPerUnit: unknown,
): RewardsPairError | null => {
  const unit = parseNullableNumber(spendUnit);
  const points = parseNullableNumber(pointsPerUnit);

  if (unit === null && points === null) return null;
  if (unit === null || points === null) return RewardsPairError.Incomplete;
  if (unit <= 0 || points <= 0) return RewardsPairError.NotPositive;
  return null;
};

/** Clamps a months value to the endpoint bounds (default 12). */
export const resolveRewardsMonths = (value: unknown): number => {
  const months = parseNullableNumber(value);
  if (months === null) return DEFAULT_REWARDS_MONTHS;
  return Math.min(
    REWARDS_MONTHS_MAX,
    Math.max(REWARDS_MONTHS_MIN, Math.trunc(months)),
  );
};

/** Builds the adjust body: exactly one of `delta` / `balance`. */
export const toAdjustRewardsDto = (
  mode: AdjustRewardsMode,
  value: number,
): AdjustRewardsDto =>
  mode === AdjustRewardsMode.Delta ? { delta: value } : { balance: value };

/** Points with up to 2 decimals (they are rounded to 2 by the backend). */
export const formatRewardsPoints = (value: number, locale: string): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
