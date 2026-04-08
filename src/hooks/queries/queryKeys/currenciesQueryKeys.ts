import { QueryParam } from "@sito/dashboard-app";

import { CurrencyDto, FilterCurrencyDto } from "lib";

export const CurrenciesQueryKeys = {
  all: () => ({
    queryKey: ["currencies"],
  }),
  list: (filters: FilterCurrencyDto) => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<CurrencyDto>, "currentPage">,
    filters: FilterCurrencyDto,
  ) => ({
    queryKey: [
      ...CurrenciesQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...CurrenciesQueryKeys.all().queryKey, "common"],
  }),
};
