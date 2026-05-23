import type {
  CommonAccountDto,
  CommonCurrencyDto,
  CommonSubscriptionProviderDto,
  CommonTransactionCategoryDto,
  AccountDto,
  CurrencyDto,
  SubscriptionProviderDto,
  TransactionCategoryDto,
} from "lib";

import type {
  DraftAccount,
  DraftCurrency,
  DraftSubscriptionProvider,
  DraftTransactionCategory,
  OnboardingDraft,
} from "./types";

const DRAFT_UPDATED_AT = new Date(0);
const DRAFT_CREATED_AT = new Date(0);

export const draftCurrencyToCommon = (
  currency: DraftCurrency,
): CommonCurrencyDto => ({
  id: currency.localId,
  name: currency.name,
  symbol: currency.symbol,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftAccountToCommon = (
  account: DraftAccount,
  draft: OnboardingDraft,
): CommonAccountDto => {
  const currency = draft.currencies.find(
    (c) => c.localId === account.currencyLocalId,
  );

  return {
    id: account.localId,
    name: account.name,
    updatedAt: DRAFT_UPDATED_AT,
    currency: currency
      ? draftCurrencyToCommon(currency)
      : { id: 0, name: "", symbol: "", updatedAt: DRAFT_UPDATED_AT },
  };
};

export const draftTransactionCategoryToCommon = (
  category: DraftTransactionCategory,
): CommonTransactionCategoryDto => ({
  id: category.localId,
  name: category.name,
  color: category.color,
  auto: false,
  type: category.type,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftSubscriptionProviderToCommon = (
  provider: DraftSubscriptionProvider,
): CommonSubscriptionProviderDto => ({
  id: provider.localId,
  name: provider.name,
  photo: provider.photo ?? null,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftCurrencyToDto = (currency: DraftCurrency): CurrencyDto => ({
  id: currency.localId,
  name: currency.name,
  symbol: currency.symbol,
  description: currency.description,
  user: null,
  createdAt: DRAFT_CREATED_AT,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftAccountToDto = (account: DraftAccount): AccountDto => ({
  id: account.localId,
  name: account.name,
  description: account.description,
  balance: account.balance,
  type: account.type,
  currency: null,
  user: null,
  createdAt: DRAFT_CREATED_AT,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftTransactionCategoryToDto = (
  category: DraftTransactionCategory,
): TransactionCategoryDto => ({
  id: category.localId,
  name: category.name,
  description: category.description,
  color: category.color,
  type: category.type,
  auto: false,
  user: null,
  createdAt: DRAFT_CREATED_AT,
  updatedAt: DRAFT_UPDATED_AT,
});

export const draftSubscriptionProviderToDto = (
  provider: DraftSubscriptionProvider,
): SubscriptionProviderDto => ({
  id: provider.localId,
  name: provider.name,
  description: provider.description ?? null,
  website: provider.website ?? null,
  photo: provider.photo ?? null,
  createdAt: DRAFT_CREATED_AT,
  updatedAt: DRAFT_UPDATED_AT,
});
