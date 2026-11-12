import type { CommonTransactionCategoryDto } from "lib";
import { RewardsPairError, TransactionType, validateRewardsPair } from "lib";

/** Translation key of a spend unit / points per unit pair error, or null. */
export const getRewardsPairErrorKey = (
  spendUnit: unknown,
  pointsPerUnit: unknown,
): string | null => {
  const error = validateRewardsPair(spendUnit, pointsPerUnit);
  if (error === null) return null;
  return error === RewardsPairError.Incomplete
    ? "_entities:account.rewards.pair.incomplete"
    : "_entities:account.rewards.pair.notPositive";
};

/**
 * Categories that can be excluded from earning points: the user's OUT
 * categories (only spends earn). Auto categories (transfers, balance
 * adjustments) never earn, so they are left out.
 */
export const getExcludableRewardsCategories = (
  categories: CommonTransactionCategoryDto[],
): CommonTransactionCategoryDto[] =>
  categories.filter(
    (category) => category.type === TransactionType.Out && !category.auto,
  );

/** Picker value for the stored ids (unknown ids are skipped). */
export const selectCategoriesByIds = (
  options: CommonTransactionCategoryDto[],
  ids: unknown,
): CommonTransactionCategoryDto[] => {
  if (!Array.isArray(ids)) return [];
  const selected = new Set(ids.map(Number));
  return options.filter((option) => selected.has(option.id));
};
