export type DailyBreakdownDialogPropsType = {
  open: boolean;
  onClose: () => void;
  accountId?: number;
  /** YYYY-MM of the clicked month; the query stays idle while undefined. */
  month?: string;
  /** Same deposit as the monthly projection so the days match its chart. */
  monthlyDeposit?: number | null;
  depositDay?: number;
  locale: string;
  currencySymbol: string;
};
