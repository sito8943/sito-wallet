export type TransactionRewardsPointsPropsType = {
  /** Card points earned by the transaction; null/undefined = it earns none. */
  points?: number | null;
  /** Rewards program name of the account (e.g. "RevPoints"). */
  rewardsName?: string | null;
};
