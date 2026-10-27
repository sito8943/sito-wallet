import { formatForDatetimeLocal } from "@sito/dashboard-app";

import type {
  AccountDto,
  AccountInterestConfigDto,
  AddAccountDto,
  CommonAccountDto,
  TransferTransactionDto,
  UpdateAccountDto,
} from "lib";
import { AccountType, isSavingAccountType, parseNullableNumber } from "lib";
import type {
  AccountFormType,
  AccountInterestFormType,
  TransferFormType,
} from "./types";

// bankName only applies to Card accounts; strip it otherwise and drop empty
// selections so we never persist a blank brand.
const normalizeBankName = (
  type: AccountType,
  bankName?: string,
): string | undefined => {
  if (type !== AccountType.Card) return undefined;
  const trimmed = bankName?.trim();
  return trimmed ? trimmed : undefined;
};

/** Empty interest configuration: what non-Saving accounts always send. */
export const EMPTY_INTEREST_CONFIG: Required<AccountInterestConfigDto> = {
  interestRate: null,
  aer: null,
  interestDayCount: null,
  interestPayoutFrequency: null,
  interestPayoutDelayDays: null,
  interestCompoundingFrequency: null,
  interestRoundingStage: null,
  interestRoundingMode: null,
  interestRoundingScale: null,
};

/**
 * Interest fields only apply to Saving accounts: cleared for any other type,
 * otherwise coerced from raw form values (strings) to numbers or null.
 */
export const normalizeInterestConfig = (
  type: unknown,
  form: AccountInterestFormType,
): Required<AccountInterestConfigDto> => {
  if (!isSavingAccountType(type)) return { ...EMPTY_INTEREST_CONFIG };

  return {
    interestRate: parseNullableNumber(form.interestRate),
    aer: parseNullableNumber(form.aer),
    interestDayCount: parseNullableNumber(form.interestDayCount),
    interestPayoutFrequency: parseNullableNumber(form.interestPayoutFrequency),
    interestPayoutDelayDays: parseNullableNumber(form.interestPayoutDelayDays),
    interestCompoundingFrequency: parseNullableNumber(
      form.interestCompoundingFrequency,
    ),
    interestRoundingStage: parseNullableNumber(form.interestRoundingStage),
    interestRoundingMode: parseNullableNumber(form.interestRoundingMode),
    interestRoundingScale: parseNullableNumber(form.interestRoundingScale),
  };
};

/** The type SelectInput emits strings; the API expects the enum number. */
const normalizeAccountType = (type: unknown): AccountType =>
  parseNullableNumber(type) ?? AccountType.Physical;

export const formToUpdateDto = ({
  currency,
  userId,
  bankName,
  ...rest
}: AccountFormType): UpdateAccountDto => {
  const type = normalizeAccountType(rest.type);
  return {
    ...rest,
    // Overrides the raw interest values carried by `rest`.
    ...normalizeInterestConfig(type, rest),
    type,
    bankName: normalizeBankName(type, bankName),
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const formToAddDto = ({
  currency,
  userId,
  bankName,
  ...rest
}: AccountFormType): AddAccountDto => {
  const type = normalizeAccountType(rest.type);
  return {
    ...rest,
    // Overrides the raw interest values carried by `rest`.
    ...normalizeInterestConfig(type, rest),
    type,
    bankName: normalizeBankName(type, bankName),
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  ...dto,
  userId: dto.user?.id ?? 0,
});

export const addEmptyAccount: Omit<AccountFormType, "if"> = {
  name: "",
  balance: 0,
  description: "",
  type: AccountType.Physical,
  bankName: "",
  currency: null,
  userId: 0,
  ...EMPTY_INTEREST_CONFIG,
};

export const emptyAccount: AccountFormType = {
  id: 0,
  name: "",
  balance: 0,
  description: "",
  type: AccountType.Physical,
  bankName: "",
  currency: null,
  userId: 0,
  ...EMPTY_INTEREST_CONFIG,
};

export const getTransferDefaultValues = (): TransferFormType => ({
  destinationAccount: null,
  amount: "",
  date: formatForDatetimeLocal(),
  description: "",
});

export const getEligibleTransferAccounts = (
  accounts: CommonAccountDto[],
  sourceAccount: AccountDto | null,
): CommonAccountDto[] => {
  if (!sourceAccount?.currency?.id) return [];

  return accounts.filter(
    (account) =>
      account.id !== sourceAccount.id &&
      account.currency?.id === sourceAccount.currency?.id,
  );
};

export const transferFormToDto = (
  form: TransferFormType,
  sourceAccount: AccountDto | null,
): TransferTransactionDto => ({
  sourceAccountId: sourceAccount?.id ?? 0,
  destinationAccountId: form.destinationAccount?.id ?? 0,
  amount: Number(form.amount),
  date: form.date,
  ...(form.description.trim() ? { description: form.description.trim() } : {}),
});
