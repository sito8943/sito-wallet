export interface FilterAccountRewardsDto {
  accountId: number;
  /** 1–60; months of history ending at the current month. */
  months: number;
}
