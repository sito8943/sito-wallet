import { AccountType } from "../entities/account/AccountType";
import type { CommonAccountDto } from "../entities";

import { parseNullableNumber } from "./number";

/**
 * True when `type` is the Saving account type. Accepts the raw select value
 * (the account form's SelectInput emits strings) as well as the enum number.
 */
export const isSavingAccountType = (type: unknown): boolean =>
  parseNullableNumber(type) === AccountType.Saving;

/** Saving accounts only (pickers for savings-only features). */
export const filterSavingAccounts = (
  accounts: CommonAccountDto[],
): CommonAccountDto[] =>
  accounts.filter((account) => isSavingAccountType(account.type));
