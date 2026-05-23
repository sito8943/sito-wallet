import type {
  CommonAccountDto,
  CommonCurrencyDto,
  CommonSubscriptionProviderDto,
  CommonTransactionCategoryDto,
} from "lib";

import type {
  DraftAccount,
  DraftCurrency,
  DraftSubscriptionProvider,
  DraftTransactionCategory,
  OnboardingDraft,
} from "./types";

const DRAFT_UPDATED_AT = new Date(0);

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
