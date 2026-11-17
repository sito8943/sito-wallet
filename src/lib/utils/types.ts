/** Options accepted by `formatAmount` (grouping and min decimals are fixed). */
export type AmountFormatOptions = Omit<
  Intl.NumberFormatOptions,
  "useGrouping" | "minimumFractionDigits"
>;
