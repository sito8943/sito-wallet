export type DailyBreakdownDialogPropsType = {
  open: boolean;
  onClose: () => void;
  accountId?: number;
  /** YYYY-MM of the clicked month; the query stays idle while undefined. */
  month?: string;
  locale: string;
  currencySymbol: string;
};
