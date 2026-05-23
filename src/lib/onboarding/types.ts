import type {
  UserEntityConfigDto,
  UserEntityConfigKey,
} from "../api/userEntityConfigs/types";
import type { AccountType } from "../entities/account/AccountType";
import type { AddAccountDto } from "../entities/account/AddAccountDto";
import type { CommonAccountDto } from "../entities/account/CommonAccountDto";
import type { FilterAccountDto } from "../entities/account/FilterAccountDto";
import type { AddCurrencyDto } from "../entities/currency/AddCurrencyDto";
import type { CommonCurrencyDto } from "../entities/currency/CommonCurrencyDto";
import type { FilterCurrencyDto } from "../entities/currency/FilterCurrencyDto";
import type { AddSubscriptionProviderDto } from "../entities/subscriptionProvider/AddSubscriptionProviderDto";
import type { CommonSubscriptionProviderDto } from "../entities/subscriptionProvider/CommonSubscriptionProviderDto";
import type { FilterSubscriptionProviderDto } from "../entities/subscriptionProvider/FilterSubscriptionProviderDto";
import type { TransactionType } from "../entities/transaction/TransactionType";
import type { AddTransactionCategoryDto } from "../entities/transactionCategory/AddTransactionCategoryDto";
import type { CommonTransactionCategoryDto } from "../entities/transactionCategory/CommonTransactionCategoryDto";
import type { FilterTransactionCategoryDto } from "../entities/transactionCategory/FilterTransactionCategoryDto";

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

export type ReplayMode = "merge" | "discard";

export interface ReplayCounts {
  created: number;
  reused: number;
  skipped: number;
}

export interface ReplayResult {
  currencies: ReplayCounts;
  accounts: ReplayCounts;
  transactionCategories: ReplayCounts;
  subscriptionProviders: ReplayCounts;
  configsApplied: boolean;
}

export interface ReplayManager {
  Currencies: {
    commonGet: (filter: FilterCurrencyDto) => Promise<CommonCurrencyDto[]>;
    insert: (
      dto: AddCurrencyDto,
    ) => Promise<{ id: number; name: string; symbol: string }>;
  };
  Accounts: {
    commonGet: (filter: FilterAccountDto) => Promise<CommonAccountDto[]>;
    insert: (dto: AddAccountDto) => Promise<{ id: number; name: string }>;
  };
  TransactionCategories: {
    commonGet: (
      filter: FilterTransactionCategoryDto,
    ) => Promise<CommonTransactionCategoryDto[]>;
    insert: (
      dto: AddTransactionCategoryDto,
    ) => Promise<{ id: number; name: string }>;
  };
  SubscriptionProviders?: {
    commonGet: (
      filter: FilterSubscriptionProviderDto,
    ) => Promise<CommonSubscriptionProviderDto[]>;
    insert: (
      dto: AddSubscriptionProviderDto,
    ) => Promise<{ id: number; name: string }>;
  };
  UserEntityConfigs: {
    putBatch: (payload: {
      entities: UserEntityConfigDto[];
    }) => Promise<unknown>;
  };
}

export interface ExistingDataSummary {
  currencies: number;
  accounts: number;
  transactionCategories: number;
  subscriptionProviders: number;
}
