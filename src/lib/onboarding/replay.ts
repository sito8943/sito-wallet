import type {
  AddAccountDto,
  AddCurrencyDto,
  AddSubscriptionProviderDto,
  AddTransactionCategoryDto,
  CommonAccountDto,
  CommonCurrencyDto,
  CommonSubscriptionProviderDto,
  CommonTransactionCategoryDto,
  FilterAccountDto,
  FilterCurrencyDto,
  FilterSubscriptionProviderDto,
  FilterTransactionCategoryDto,
  OnboardingDraft,
  UserEntityConfigDto,
} from "lib";

import { normalizeCommonFilters } from "../utils/filterNormalization";

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
    putBatch: (payload: { entities: UserEntityConfigDto[] }) => Promise<unknown>;
  };
}

const emptyCounts = (): ReplayCounts => ({
  created: 0,
  reused: 0,
  skipped: 0,
});

const normalizeName = (name: string): string =>
  name.trim().toLocaleLowerCase();

const emptyFilter = <T extends object>(): T =>
  normalizeCommonFilters() as unknown as T;

export interface ExistingDataSummary {
  currencies: number;
  accounts: number;
  transactionCategories: number;
  subscriptionProviders: number;
}

export const fetchExistingDataSummary = async (
  manager: ReplayManager,
): Promise<ExistingDataSummary> => {
  const [currencies, accounts, categories, providers] = await Promise.all([
    manager.Currencies.commonGet(emptyFilter<FilterCurrencyDto>()).catch(
      () => [],
    ),
    manager.Accounts.commonGet(emptyFilter<FilterAccountDto>()).catch(() => []),
    manager.TransactionCategories.commonGet(
      emptyFilter<FilterTransactionCategoryDto>(),
    ).catch(() => []),
    manager.SubscriptionProviders
      ? manager.SubscriptionProviders.commonGet(
          emptyFilter<FilterSubscriptionProviderDto>(),
        ).catch(() => [])
      : Promise.resolve([]),
  ]);

  return {
    currencies: currencies.length,
    accounts: accounts.length,
    transactionCategories: categories.length,
    subscriptionProviders: providers.length,
  };
};

export const hasExistingData = (summary: ExistingDataSummary): boolean =>
  summary.currencies > 0 ||
  summary.accounts > 0 ||
  summary.transactionCategories > 0 ||
  summary.subscriptionProviders > 0;

export const replayDraft = async (
  manager: ReplayManager,
  draft: OnboardingDraft,
  mode: ReplayMode = "merge",
  configs?: UserEntityConfigDto[],
): Promise<ReplayResult> => {
  const result: ReplayResult = {
    currencies: emptyCounts(),
    accounts: emptyCounts(),
    transactionCategories: emptyCounts(),
    subscriptionProviders: emptyCounts(),
    configsApplied: false,
  };

  const currencyLocalIdToRealId = new Map<number, number>();

  const existingCurrencies =
    mode === "merge"
      ? await manager.Currencies.commonGet(
          emptyFilter<FilterCurrencyDto>(),
        ).catch(() => [])
      : [];
  const currencyByName = new Map(
    existingCurrencies.map((c) => [normalizeName(c.name), c]),
  );

  for (const draftCurrency of draft.currencies) {
    const match = currencyByName.get(normalizeName(draftCurrency.name));
    if (match) {
      currencyLocalIdToRealId.set(draftCurrency.localId, match.id);
      result.currencies.reused += 1;
      continue;
    }

    try {
      const created = await manager.Currencies.insert({
        name: draftCurrency.name,
        symbol: draftCurrency.symbol,
        description: draftCurrency.description,
        userId: 0,
      });
      currencyLocalIdToRealId.set(draftCurrency.localId, created.id);
      result.currencies.created += 1;
    } catch {
      result.currencies.skipped += 1;
    }
  }

  const existingCategories =
    mode === "merge"
      ? await manager.TransactionCategories.commonGet(
          emptyFilter<FilterTransactionCategoryDto>(),
        ).catch(() => [])
      : [];
  const categoryByName = new Map(
    existingCategories.map((c) => [normalizeName(c.name), c]),
  );

  for (const draftCategory of draft.transactionCategories) {
    if (categoryByName.has(normalizeName(draftCategory.name))) {
      result.transactionCategories.reused += 1;
      continue;
    }

    try {
      await manager.TransactionCategories.insert({
        name: draftCategory.name,
        description: draftCategory.description,
        color: draftCategory.color,
        type: draftCategory.type,
        userId: 0,
      });
      result.transactionCategories.created += 1;
    } catch {
      result.transactionCategories.skipped += 1;
    }
  }

  if (manager.SubscriptionProviders) {
    const existingProviders =
      mode === "merge"
        ? await manager.SubscriptionProviders.commonGet(
            emptyFilter<FilterSubscriptionProviderDto>(),
          ).catch(() => [])
        : [];
    const providerByName = new Map(
      existingProviders.map((p) => [normalizeName(p.name), p]),
    );

    for (const draftProvider of draft.subscriptionProviders) {
      if (providerByName.has(normalizeName(draftProvider.name))) {
        result.subscriptionProviders.reused += 1;
        continue;
      }

      try {
        await manager.SubscriptionProviders.insert({
          name: draftProvider.name,
          description: draftProvider.description ?? null,
          website: draftProvider.website ?? null,
          photo: draftProvider.photo ?? null,
        });
        result.subscriptionProviders.created += 1;
      } catch {
        result.subscriptionProviders.skipped += 1;
      }
    }
  }

  for (const draftAccount of draft.accounts) {
    const realCurrencyId = currencyLocalIdToRealId.get(
      draftAccount.currencyLocalId,
    );
    if (!realCurrencyId) {
      result.accounts.skipped += 1;
      continue;
    }

    try {
      await manager.Accounts.insert({
        name: draftAccount.name,
        balance: draftAccount.balance,
        description: draftAccount.description,
        type: draftAccount.type,
        currencyId: realCurrencyId,
        userId: 0,
      });
      result.accounts.created += 1;
    } catch {
      result.accounts.skipped += 1;
    }
  }

  if (configs && configs.length > 0) {
    try {
      await manager.UserEntityConfigs.putBatch({ entities: configs });
      result.configsApplied = true;
    } catch {
      result.configsApplied = false;
    }
  }

  return result;
};
