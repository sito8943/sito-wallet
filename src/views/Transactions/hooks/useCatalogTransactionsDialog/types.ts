import type { ActionType } from "@sito/dashboard-app";

import type { CatalogRowDto } from "components";
import type { FilterTransactionDto } from "lib";

import type { RecentTransactionsDialogPropsType } from "../../components/RecentTransactionsDialog";

/** Transaction filters that point at a catalog entry. */
export type CatalogTransactionsFilterKey = keyof Pick<
  FilterTransactionDto,
  "productId" | "purchaseProviderId"
>;

export type UseCatalogTransactionsDialogPropsType = {
  filterKey: CatalogTransactionsFilterKey;
  emptyMessage: string;
};

export type CatalogTransactionsDialogStateType = {
  open: boolean;
  title: string;
  filters: FilterTransactionDto;
};

export type UseCatalogTransactionsDialogReturnType = {
  action: (record: CatalogRowDto) => ActionType<CatalogRowDto>;
  dialog: RecentTransactionsDialogPropsType;
};
