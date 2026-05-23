import type { UserEntityConfigDto } from "../api/userEntityConfigs/types";
import type { FilterAccountDto } from "../entities/account/FilterAccountDto";
import type { FilterCurrencyDto } from "../entities/currency/FilterCurrencyDto";
import type { FilterSubscriptionProviderDto } from "../entities/subscriptionProvider/FilterSubscriptionProviderDto";
import type { FilterTransactionCategoryDto } from "../entities/transactionCategory/FilterTransactionCategoryDto";
import type {
  ExistingDataSummary,
  OnboardingDraft,
  ReplayCounts,
  ReplayManager,
  ReplayMode,
  ReplayResult,
} from "./types";

const emptyCounts = (): ReplayCounts => ({
  created: 0,
  reused: 0,
  skipped: 0,
});

const normalizeName = (name: string): string => name.trim().toLocaleLowerCase();

const createEmptyCurrencyFilter = (): FilterCurrencyDto => ({});
const createEmptyAccountFilter = (): FilterAccountDto => ({});
const createEmptyTransactionCategoryFilter =
  (): FilterTransactionCategoryDto => ({});
const createEmptySubscriptionProviderFilter =
  (): FilterSubscriptionProviderDto => ({});

export const fetchExistingDataSummary = async (
  manager: ReplayManager,
): Promise<ExistingDataSummary> => {
  const [currencies, accounts, categories, providers] = await Promise.all([
    manager.Currencies.commonGet(createEmptyCurrencyFilter()).catch(() => []),
    manager.Accounts.commonGet(createEmptyAccountFilter()).catch(() => []),
    manager.TransactionCategories.commonGet(
      createEmptyTransactionCategoryFilter(),
    ).catch(() => []),
    manager.SubscriptionProviders
      ? manager.SubscriptionProviders.commonGet(
          createEmptySubscriptionProviderFilter(),
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
      ? await manager.Currencies.commonGet(createEmptyCurrencyFilter()).catch(
          () => [],
        )
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
          createEmptyTransactionCategoryFilter(),
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
            createEmptySubscriptionProviderFilter(),
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
