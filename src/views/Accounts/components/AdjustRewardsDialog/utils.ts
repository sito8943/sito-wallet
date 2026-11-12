import { AdjustRewardsMode, parseNullableNumber } from "lib";

/**
 * Translation key of the amount error, or null when valid: a delta must be a
 * non-zero number; a balance must be a number different from the current one.
 */
export const getAdjustRewardsAmountErrorKey = (
  mode: AdjustRewardsMode,
  amount: unknown,
  currentBalance: number | undefined,
): string | null => {
  const value = parseNullableNumber(amount);
  if (value === null)
    return "_pages:accounts.actions.adjustRewards.dialog.required";
  if (mode === AdjustRewardsMode.Delta && value === 0)
    return "_pages:accounts.actions.adjustRewards.dialog.zeroDelta";
  if (mode === AdjustRewardsMode.Balance && value === currentBalance)
    return "_pages:accounts.actions.adjustRewards.dialog.sameBalance";
  return null;
};

/** Balance shown after applying the form (null while the amount is blank). */
export const getAdjustedRewardsBalance = (
  currentBalance: number,
  mode: AdjustRewardsMode,
  amount: unknown,
): number | null => {
  const value = parseNullableNumber(amount);
  if (value === null) return null;
  return mode === AdjustRewardsMode.Delta ? currentBalance + value : value;
};
