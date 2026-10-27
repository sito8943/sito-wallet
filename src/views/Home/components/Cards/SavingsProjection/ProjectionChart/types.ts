import type { SavingsProjectionPointDto } from "lib";

export type ProjectionChartPropsType = {
  points: SavingsProjectionPointDto[];
  locale?: string;
  currencySymbol?: string;
  balanceLabel: string;
  accruedLabel: string;
  creditedLabel: string;
  /** Tooltip line for the month's deposits (shown only when > 0). */
  depositedLabel: string;
  /** Called with the clicked point's month (YYYY-MM). */
  onMonthClick?: (month: string) => void;
};
