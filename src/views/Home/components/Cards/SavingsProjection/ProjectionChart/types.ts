import type { SavingsProjectionPointDto } from "lib";

export type ProjectionChartPropsType = {
  points: SavingsProjectionPointDto[];
  locale?: string;
  currencySymbol?: string;
  balanceLabel: string;
  accruedLabel: string;
  creditedLabel: string;
  /** Called with the clicked point's month (YYYY-MM). */
  onMonthClick?: (month: string) => void;
};
