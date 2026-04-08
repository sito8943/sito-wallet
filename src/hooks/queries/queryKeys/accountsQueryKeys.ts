import { QueryParam } from "@sito/dashboard-app";

import { AccountDto, FilterAccountDto } from "lib";

export const AccountsQueryKeys = {
  all: () => ({
    queryKey: ["accounts"],
  }),
  list: (filters: FilterAccountDto) => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<AccountDto>, "currentPage">,
    filters: FilterAccountDto,
  ) => ({
    queryKey: [
      ...AccountsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...AccountsQueryKeys.all().queryKey, "common"],
  }),
};
