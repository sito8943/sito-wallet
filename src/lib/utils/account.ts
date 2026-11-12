import { AccountType } from "../entities/account/AccountType";
import type { AccountRewardsConfigDto, CommonAccountDto } from "../entities";

import { parseNullableNumber } from "./number";

/**
 * True when `type` is the Saving account type. Accepts the raw select value
 * (the account form's SelectInput emits strings) as well as the enum number.
 */
export const isSavingAccountType = (type: unknown): boolean =>
  parseNullableNumber(type) === AccountType.Saving;

/** True when `type` is the Card account type (raw select string or enum). */
export const isCardAccountType = (type: unknown): boolean =>
  parseNullableNumber(type) === AccountType.Card;

/** Account types that name a bank (and get its branded card visual). */
export const supportsBankName = (type: unknown): boolean => {
  const value = parseNullableNumber(type);
  return value === AccountType.Card || value === AccountType.Saving;
};

/** Saving accounts only (pickers for savings-only features). */
export const filterSavingAccounts = (
  accounts: CommonAccountDto[],
): CommonAccountDto[] =>
  accounts.filter((account) => isSavingAccountType(account.type));

/** Card accounts only (pickers for card-only features such as rewards). */
export const filterRewardsAccounts = (
  accounts: CommonAccountDto[],
): CommonAccountDto[] =>
  accounts.filter(
    (account) => isCardAccountType(account.type) && !!account.rewardsConfigured,
  );

/**
 * Rewards are enabled on Card accounts that set both the spend unit and the
 * points per unit (mirrors the backend rule).
 */
export const hasRewardsConfigured = (
  account: AccountRewardsConfigDto & { type?: unknown },
): boolean =>
  isCardAccountType(account.type) &&
  parseNullableNumber(account.rewardsSpendUnit) !== null &&
  parseNullableNumber(account.rewardsPointsPerUnit) !== null;
