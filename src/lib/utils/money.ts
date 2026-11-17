import { AMOUNT_FRACTION_DIGITS } from "./constants";
import type { AmountFormatOptions } from "./types";

/**
 * Money amount in the app language: thousands grouping and two decimals
 * ("1.234,50" es / "1,234.50" en). `options` can widen the decimals (e.g.
 * `{ maximumFractionDigits: 4 }` for interest accruals). Non-numeric values
 * are shown as 0.
 */
export const formatAmount = (
  value: number | string | null | undefined,
  locale: string,
  options: AmountFormatOptions = {},
): string => {
  const parsed = typeof value === "number" ? value : Number(value ?? 0);
  const amount = Number.isFinite(parsed) ? parsed : 0;

  const maximumFractionDigits = Math.max(
    options.maximumFractionDigits ?? AMOUNT_FRACTION_DIGITS,
    AMOUNT_FRACTION_DIGITS,
  );

  // "always": es groups 4-digit amounts too ("1.234,50", not "1234,50").
  // Typed by hand because the app targets the ES2020 Intl typings.
  const formatOptions: AmountFormatOptions & {
    minimumFractionDigits: number;
    useGrouping: "always";
  } = {
    ...options,
    minimumFractionDigits: AMOUNT_FRACTION_DIGITS,
    maximumFractionDigits,
    useGrouping: "always",
  };

  return new Intl.NumberFormat(
    locale,
    formatOptions as unknown as Intl.NumberFormatOptions,
  ).format(amount);
};
