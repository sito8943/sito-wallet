import type {
  FilterAccountDto,
  FilterCurrencyDto,
  FilterProductDto,
  FilterPurchaseProviderDto,
  FilterTransactionCategoryDto,
  FilterTransactionDto,
} from "../entities";

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

export const defaultProductsListFilters: FilterProductDto = {
  softDeleteScope: "ACTIVE",
};

export const defaultPurchaseProvidersListFilters: FilterPurchaseProviderDto = {
  softDeleteScope: "ACTIVE",
};
