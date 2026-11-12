import type { AccountRewardsMonthDto } from "lib";

export type RewardsChartPropsType = {
  history: AccountRewardsMonthDto[];
  locale?: string;
  currencySymbol?: string;
  earnedLabel: string;
  spentLabel: string;
};
