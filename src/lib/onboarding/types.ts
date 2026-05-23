import type { AccountType, TransactionType, UserEntityConfigKey } from "lib";

export type DraftLocalId = number;

export interface DraftCurrency {
  localId: DraftLocalId;
  name: string;
  symbol: string;
  description: string;
  prefabCode?: string;
}

export interface DraftAccount {
  localId: DraftLocalId;
  name: string;
  balance: number;
  description: string;
  type: AccountType;
  currencyLocalId: DraftLocalId;
}

export interface DraftTransactionCategory {
  localId: DraftLocalId;
  name: string;
  description: string;
  color: string;
  type: TransactionType;
  prefabKey?: string;
}

export interface DraftSubscriptionProvider {
  localId: DraftLocalId;
  name: string;
  description?: string | null;
  website?: string | null;
  photo?: string | null;
  prefabKey?: string;
}

export interface OnboardingDraft {
  version: number;
  createdAt: number;
  updatedAt: number;
  nextLocalId: DraftLocalId;
  currencies: DraftCurrency[];
  accounts: DraftAccount[];
  transactionCategories: DraftTransactionCategory[];
  subscriptionProviders: DraftSubscriptionProvider[];
  selectedEntityKeys: UserEntityConfigKey[];
}
