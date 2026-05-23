import type { BasicProviderPropTypes } from "../types";

import type {
  DraftAccount,
  DraftCurrency,
  DraftSubscriptionProvider,
  DraftTransactionCategory,
  OnboardingDraft,
  UserEntityConfigKey,
} from "lib";

export type AddCurrencyInput = Omit<DraftCurrency, "localId">;
export type AddAccountInput = Omit<DraftAccount, "localId">;
export type AddTransactionCategoryInput = Omit<
  DraftTransactionCategory,
  "localId"
>;
export type AddSubscriptionProviderInput = Omit<
  DraftSubscriptionProvider,
  "localId"
>;

export interface OnboardingDraftContextValue {
  draft: OnboardingDraft;
  isAnonymous: boolean;
  addCurrencies: (inputs: AddCurrencyInput[]) => DraftCurrency[];
  addAccounts: (inputs: AddAccountInput[]) => DraftAccount[];
  addTransactionCategories: (
    inputs: AddTransactionCategoryInput[],
  ) => DraftTransactionCategory[];
  addSubscriptionProviders: (
    inputs: AddSubscriptionProviderInput[],
  ) => DraftSubscriptionProvider[];
  setSelectedEntityKeys: (keys: UserEntityConfigKey[]) => void;
  clear: () => void;
  refreshFromStorage: () => void;
}

export type OnboardingDraftProviderPropsType = BasicProviderPropTypes;
