import type { AccountDto, AdjustRewardsDto } from "lib";
import {
  AdjustRewardsMode,
  hasRewardsConfigured,
  parseNullableNumber,
  toAdjustRewardsDto,
} from "lib";

import type { AdjustRewardsAccountType, AdjustRewardsFormType } from "../types";

export const adjustRewardsDefaultValues: AdjustRewardsFormType = {
  mode: AdjustRewardsMode.Delta,
  amount: "",
};

export const adjustRewardsFormToDto = (
  data: AdjustRewardsFormType,
): AdjustRewardsDto =>
  toAdjustRewardsDto(data.mode, parseNullableNumber(data.amount) ?? 0);

/** A live Card account with rewards configured and a points balance. */
export const canAdjustRewards = (record: AccountDto): boolean =>
  !record.deletedAt &&
  hasRewardsConfigured(record) &&
  record.rewardsBalance != null;

/** Adjust-points data from a listed account (earned = balance - adjustment). */
export const accountToAdjustRewardsAccount = (
  record: AccountDto,
): AdjustRewardsAccountType => {
  const balance = record.rewardsBalance ?? 0;
  return {
    id: record.id,
    rewards: {
      name: record.rewardsName ?? null,
      balance,
      earned: balance - (record.rewardsAdjustment ?? 0),
    },
  };
};
