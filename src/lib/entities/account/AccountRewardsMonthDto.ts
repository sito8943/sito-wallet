export type AccountRewardsMonthDto = {
  /** YYYY-MM */
  month: string;
  /** Eligible spend that month. */
  spent: number;
  /** Points earned that month. */
  earned: number;
};
