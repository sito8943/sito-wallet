import {
  DEFAULT_SAVINGS_DEPOSIT_DAY,
  SAVINGS_DEPOSIT_DAY_MAX,
  SAVINGS_DEPOSIT_DAY_MIN,
  SAVINGS_MONTHLY_DEPOSIT_MAX,
} from "../entities/account/SavingsProjectionDeposit";
import type { SavingsProjectionDepositDto } from "../entities/account/SavingsProjectionDepositDto";

import { parseNullableNumber } from "./number";

/** Positive deposit amount within the backend limit, else null (no deposit). */
export const resolveMonthlyDeposit = (value: unknown): number | null => {
  const amount = parseNullableNumber(value);
  if (amount === null || amount <= 0) return null;
  return Math.min(amount, SAVINGS_MONTHLY_DEPOSIT_MAX);
};

/** Integer day 1–31, defaulting to the 1st for missing/invalid values. */
export const resolveDepositDay = (value: unknown): number => {
  const day = parseNullableNumber(value);
  return day !== null &&
    Number.isInteger(day) &&
    day >= SAVINGS_DEPOSIT_DAY_MIN &&
    day <= SAVINGS_DEPOSIT_DAY_MAX
    ? day
    : DEFAULT_SAVINGS_DEPOSIT_DAY;
};

/** Deposit filter fields; empty unless an amount > 0 is set. */
export const toSavingsDepositFilter = (
  monthlyDeposit: unknown,
  depositDay: unknown,
): SavingsProjectionDepositDto => {
  const amount = resolveMonthlyDeposit(monthlyDeposit);
  return amount === null
    ? {}
    : { monthlyDeposit: amount, depositDay: resolveDepositDay(depositDay) };
};

/** Adds `monthlyDeposit`/`depositDay` to the query only when a deposit is set. */
export const appendSavingsDepositParams = (
  searchParams: URLSearchParams,
  filters: SavingsProjectionDepositDto,
): URLSearchParams => {
  const { monthlyDeposit, depositDay } = toSavingsDepositFilter(
    filters.monthlyDeposit,
    filters.depositDay,
  );
  if (monthlyDeposit !== undefined && depositDay !== undefined) {
    searchParams.set("monthlyDeposit", String(monthlyDeposit));
    searchParams.set("depositDay", String(depositDay));
  }
  return searchParams;
};
