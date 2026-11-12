import type { AccountRewardsConfigDto } from "lib";

/** Form fields edited in the rewards dialog (for error lookup). */
export const REWARDS_FIELD_NAMES: (
  keyof AccountRewardsConfigDto | "rewardsExcludedCategoryIds"
)[] = [
  "rewardsName",
  "rewardsSpendUnit",
  "rewardsPointsPerUnit",
  "rewardsRounding",
  "rewardsPointValue",
  "rewardsStartDate",
  "rewardsExcludedCategoryIds",
];
