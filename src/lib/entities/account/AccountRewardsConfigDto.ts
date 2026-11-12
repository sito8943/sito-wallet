import type { RewardsRounding } from "./RewardsRounding";

/**
 * Card rewards (bank points) configuration. Every field is optional and only
 * meaningful when `type === AccountType.Card`; the backend clears them to null
 * for any other type. Rewards are enabled when both `rewardsSpendUnit` and
 * `rewardsPointsPerUnit` are set.
 */
export interface AccountRewardsConfigDto {
  /** Program name (max 40 chars), e.g. "RevPoints". */
  rewardsName?: string | null;
  /** Spend amount (account currency) per earning step, e.g. 10. > 0. */
  rewardsSpendUnit?: number | null;
  /** Points earned per step, e.g. 1 or 1.5. > 0. */
  rewardsPointsPerUnit?: number | null;
  /** Defaults to FloorPerTransaction when null. */
  rewardsRounding?: RewardsRounding | null;
  /** Value of ONE point in the account currency (>= 0). */
  rewardsPointValue?: number | null;
  /** ISO date (YYYY-MM-DD). Only spends on/after it earn; null = all history. */
  rewardsStartDate?: string | null;
}
