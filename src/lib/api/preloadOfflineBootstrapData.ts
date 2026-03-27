import { QueryResult } from "@sito/dashboard-app";

import {
  AccountDto,
  CurrencyDto,
  FilterAccountDto,
  FilterCurrencyDto,
  FilterTransactionCategoryDto,
  FilterTransactionDto,
  TransactionCategoryDto,
  TransactionDto,
} from "../entities";
import { normalizeListFilters } from "../utils";

import { Manager } from "./Manager";
import { OfflineManager } from "./OfflineManager";

export const defaultAccountsListFilters: FilterAccountDto = {
  softDeleteScope: "ACTIVE",
};

export const defaultCurrenciesListFilters: FilterCurrencyDto = {
  softDeleteScope: "ACTIVE",
};

export const defaultTransactionCategoriesListFilters: FilterTransactionCategoryDto =
  {
    softDeleteScope: "ACTIVE",
  };

export const defaultTransactionsListFilters: FilterTransactionDto = {
  softDeleteScope: "ACTIVE",
};

export async function fetchAccountsList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterAccountDto,
): Promise<QueryResult<AccountDto>> {
  const normalizedFilters = normalizeListFilters(filters) as FilterAccountDto;

  try {
    const result = await manager.Accounts.get(undefined, {
      ...normalizedFilters,
    });

    offlineManager.Accounts.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading accounts from IndexedDB", error);
    return await offlineManager.Accounts.get(undefined, {
      ...normalizedFilters,
    });
  }
}

export async function fetchCurrenciesList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterCurrencyDto,
): Promise<QueryResult<CurrencyDto>> {
  const normalizedFilters = normalizeListFilters(filters) as FilterCurrencyDto;

  try {
    const result = await manager.Currencies.get(undefined, {
      ...normalizedFilters,
    });
    offlineManager.Currencies.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading currencies from IndexedDB", error);
    return await offlineManager.Currencies.get(undefined, {
      ...normalizedFilters,
    });
  }
}

export async function fetchTransactionCategoriesList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterTransactionCategoryDto,
): Promise<QueryResult<TransactionCategoryDto>> {
  const normalizedFilters = normalizeListFilters(
    filters,
  ) as FilterTransactionCategoryDto;

  try {
    const result = await manager.TransactionCategories.get(undefined, {
      ...normalizedFilters,
    });

    offlineManager.TransactionCategories.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading categories from IndexedDB", error);
    return await offlineManager.TransactionCategories.get(undefined, {
      ...normalizedFilters,
    });
  }
}

export async function fetchTransactionsList(
  manager: Manager | OfflineManager,
  offlineManager: OfflineManager,
  filters: FilterTransactionDto,
): Promise<QueryResult<TransactionDto>> {
  const normalizedFilters = normalizeListFilters(
    filters,
  ) as FilterTransactionDto;

  try {
    const result = await manager.Transactions.get(undefined, {
      ...normalizedFilters,
    });

    offlineManager.Transactions.seed(result.items).catch(() => {});
    return result;
  } catch (error) {
    console.warn("API failed, loading transactions from IndexedDB", error);
    return await offlineManager.Transactions.get(undefined, {
      ...normalizedFilters,
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
    fetchTransactionsList(
      manager,
      offlineManager,
      defaultTransactionsListFilters,
    ),
  ]);
}
