import type { AccountRewardsMonthDto } from "./AccountRewardsMonthDto";

/** Response of `GET accounts/{id}/rewards` and `PATCH .../rewards/adjust`. */
export type AccountRewardsDto = {
  accountId: number;
  /** rewardsName */
  name: string | null;
  /** Points from transactions (2 decimals). */
  earned: number;
  /** rewardsAdjustment (0 when null). */
  adjustment: number;
  /** earned + adjustment */
  balance: number;
  pointValue: number | null;
  /** balance * pointValue (2 decimals); null without pointValue. */
  balanceValue: number | null;
  currentMonthEarned: number;
  /** Total eligible spend counted. */
  eligibleSpent: number;
  /** Oldest -> newest, exactly `months` entries ending at the current month. */
  history: AccountRewardsMonthDto[];
};
