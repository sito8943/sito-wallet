import { formatForDatetimeLocal } from "@sito/dashboard-app";

import type {
  AccountDto,
  AccountInterestConfigDto,
  AccountRewardsConfigDto,
  AddAccountDto,
  CommonAccountDto,
  TransferTransactionDto,
  UpdateAccountDto,
} from "lib";
import {
  AccountType,
  REWARDS_NAME_MAX_LENGTH,
  isCardAccountType,
  isSavingAccountType,
  parseNullableNumber,
  supportsBankName,
} from "lib";
import type {
  AccountFormType,
  AccountInterestFormType,
  AccountRewardsFormType,
  TransferFormType,
} from "./types";

// bankName only applies to Card and Saving accounts; strip it otherwise and drop empty
// selections so we never persist a blank brand.
const normalizeBankName = (
  type: AccountType,
  bankName?: string,
): string | undefined => {
  if (!supportsBankName(type)) return undefined;
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

/** Empty rewards configuration: what non-Card accounts always send. */
export const EMPTY_REWARDS_CONFIG: Required<AccountRewardsConfigDto> = {
  rewardsName: null,
  rewardsSpendUnit: null,
  rewardsPointsPerUnit: null,
  rewardsRounding: null,
  rewardsPointValue: null,
  rewardsStartDate: null,
};

/** Trimmed text (capped at `maxLength`), or null when blank. */
const normalizeNullableText = (
  value: unknown,
  maxLength?: number,
): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return maxLength ? trimmed.slice(0, maxLength) : trimmed;
};

/**
 * Rewards fields only apply to Card accounts: cleared for any other type,
 * otherwise coerced from raw form values (strings) to numbers/strings or null.
 */
export const normalizeRewardsConfig = (
  type: unknown,
  form: AccountRewardsFormType,
): Required<AccountRewardsConfigDto> => {
  if (!isCardAccountType(type)) return { ...EMPTY_REWARDS_CONFIG };

  return {
    rewardsName: normalizeNullableText(
      form.rewardsName,
      REWARDS_NAME_MAX_LENGTH,
    ),
    rewardsSpendUnit: parseNullableNumber(form.rewardsSpendUnit),
    rewardsPointsPerUnit: parseNullableNumber(form.rewardsPointsPerUnit),
    rewardsRounding: parseNullableNumber(form.rewardsRounding),
    rewardsPointValue: parseNullableNumber(form.rewardsPointValue),
    rewardsStartDate: normalizeNullableText(form.rewardsStartDate),
  };
};

/**
 * Excluded categories only apply to Card accounts: [] for any other type,
 * otherwise the valid, de-duplicated ids. Always an array so an update
 * replaces the stored list (null would keep it).
 */
export const normalizeRewardsExcludedCategoryIds = (
  type: unknown,
  ids: unknown,
): number[] => {
  if (!isCardAccountType(type) || !Array.isArray(ids)) return [];
  const valid = ids
    .map((id) => parseNullableNumber(id))
    .filter((id): id is number => id !== null && id > 0);
  return [...new Set(valid)];
};

/** The type SelectInput emits strings; the API expects the enum number. */
const normalizeAccountType = (type: unknown): AccountType =>
  parseNullableNumber(type) ?? AccountType.Physical;

export const formToUpdateDto = ({
  currency,
  userId,
  bankName,
  // Read-only on the API: never sent back.
  rewardsAdjustment: _rewardsAdjustment,
  ...rest
}: AccountFormType): UpdateAccountDto => {
  const type = normalizeAccountType(rest.type);
  return {
    ...rest,
    // Override the raw interest/rewards values carried by `rest`.
    ...normalizeInterestConfig(type, rest),
    ...normalizeRewardsConfig(type, rest),
    rewardsExcludedCategoryIds: normalizeRewardsExcludedCategoryIds(
      type,
      rest.rewardsExcludedCategoryIds,
    ),
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
  // Read-only on the API: never sent back.
  rewardsAdjustment: _rewardsAdjustment,
  ...rest
}: AccountFormType): AddAccountDto => {
  const type = normalizeAccountType(rest.type);
  return {
    ...rest,
    // Override the raw interest/rewards values carried by `rest`.
    ...normalizeInterestConfig(type, rest),
    ...normalizeRewardsConfig(type, rest),
    rewardsExcludedCategoryIds: normalizeRewardsExcludedCategoryIds(
      type,
      rest.rewardsExcludedCategoryIds,
    ),
    type,
    bankName: normalizeBankName(type, bankName),
    currencyId: currency?.id ?? 0,
    userId: userId,
  };
};

export const dtoToForm = (dto: AccountDto): AccountFormType => ({
  ...dto,
  rewardsExcludedCategoryIds: dto.rewardsExcludedCategoryIds ?? [],
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
  ...EMPTY_REWARDS_CONFIG,
  rewardsExcludedCategoryIds: [],
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
  ...EMPTY_REWARDS_CONFIG,
  rewardsExcludedCategoryIds: [],
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
