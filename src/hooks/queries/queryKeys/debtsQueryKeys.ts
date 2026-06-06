import type { QueryParam } from "@sito/dashboard-app";

import type { DebtDto, FilterDebtDto } from "lib";

export const DebtsQueryKeys = {
  all: () => ({
    queryKey: ["debts"],
  }),
  list: (filters: FilterDebtDto) => ({
    queryKey: [...DebtsQueryKeys.all().queryKey, "list", filters],
  }),
  infiniteList: (
    query: Omit<QueryParam<DebtDto>, "currentPage">,
    filters: FilterDebtDto,
  ) => ({
    queryKey: [
      ...DebtsQueryKeys.all().queryKey,
      "infinite-list",
      query,
      filters,
    ],
  }),
  common: () => ({
    queryKey: [...DebtsQueryKeys.all().queryKey, "common"],
  }),
  payments: (debtId?: number | null) => ({
    queryKey: [...DebtsQueryKeys.all().queryKey, "payments", debtId],
  }),
};
