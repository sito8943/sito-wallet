import type { AmountFormatOptions } from "lib";

export type MoneyCurrencyType = {
  name?: string | null;
  symbol?: string | null;
};

export type MoneyPropsType = {
  amount: number | string | null | undefined;
  currency?: MoneyCurrencyType | null;
  /** Extra decimals (min 2 always applies). */
  options?: AmountFormatOptions;
  /** Shows a placeholder instead of the amount while it loads. */
  loading?: boolean;
};
