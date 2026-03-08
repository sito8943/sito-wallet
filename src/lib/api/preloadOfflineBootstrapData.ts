import { QueryResult } from "@sito/dashboard-app";

import {
  AccountDto,
  CurrencyDto,
  FilterAccountDto,
  FilterCurrencyDto,
  FilterTransactionCategoryDto,
  TransactionCategoryDto,
} from "../entities";

import { Manager } from "./Manager";
import { OfflineManager } from "./OfflineManager";

export const defaultAccountsListFilters = {
  deletedAt: false as unknown as FilterAccountDto["deletedAt"],
};

export const defaultCurrenciesListFilters = {
  deletedAt: false as unknown as FilterCurrencyDto["deletedAt"],
};

export const defaultTransactionCategoriesListFilters = {
  deletedAt: false as unknown as FilterTransactionCategoryDto["deletedAt"],
};

export async function fetchAccountsList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterAccountDto,
): Promise<QueryResult<AccountDto>> {
  try {
    const result = await manager.Accounts.get(undefined, {
      ...filters,
    });

    offlineManager.Accounts.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading accounts from IndexedDB", error);
    return await offlineManager.Accounts.get(undefined, {
      ...filters,
    });
  }
}

export async function fetchCurrenciesList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterCurrencyDto,
): Promise<QueryResult<CurrencyDto>> {
  try {
    console.log("fetching currencies from API with filters", filters);
    const result = await manager.Currencies.get(undefined, {
      ...filters,
    });
    console.log("result", result);
    offlineManager.Currencies.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading currencies from IndexedDB", error);
    return await offlineManager.Currencies.get(undefined, {
      ...filters,
    });
  }
}

export async function fetchTransactionCategoriesList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterTransactionCategoryDto,
): Promise<QueryResult<TransactionCategoryDto>> {
  try {
    const result = await manager.TransactionCategories.get(undefined, {
      ...filters,
    });

    offlineManager.TransactionCategories.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading categories from IndexedDB", error);
    return await offlineManager.TransactionCategories.get(undefined, {
      ...filters,
    });
  }
}

export async function preloadOfflineBootstrapData(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
): Promise<void> {
  await Promise.allSettled([
    fetchAccountsList(manager, offlineManager, defaultAccountsListFilters),
    fetchCurrenciesList(manager, offlineManager, defaultCurrenciesListFilters),
    fetchTransactionCategoriesList(
      manager,
      offlineManager,
      defaultTransactionCategoriesListFilters,
    ),
  ]);
}
