import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import { Error } from "@sito/dashboard-app";

// components
import { WalletTable } from "components";

// hooks
import { useTransactionsList } from "hooks";

// lib
import { EntityName, TransactionDto, useParseColumns } from "lib";

// types
import { TransactionContainerPropsType } from "./types";

// utils
import { getTransactionColumns } from "./transactionColumns";

export const TransactionTable = (props: TransactionContainerPropsType) => {
  const { accountId, categories, getActions, showFilters, setShowFilters } =
    props;

  const { t } = useTranslation();

  const listFilters = useMemo(() => ({ accountId }), [accountId]);

  const { data, isLoading, error } = useTransactionsList({
    filters: listFilters,
  });

  // #region columns

  const columnDefs = useMemo(
    () => getTransactionColumns(t, categories),
    [categories, t],
  );

  const toIgnore = useMemo(() => ["id", "createdAt", "updatedAt"], []);

  const { columns } = useParseColumns<TransactionDto>(
    columnDefs,
    EntityName.Transaction,
    toIgnore,
  );

  const filterOptions = useMemo(
    () => ({
      button: { hide: true as const },
      dropdown: setShowFilters
        ? { opened: showFilters ?? false, setOpened: setShowFilters }
        : undefined,
    }),
    [showFilters, setShowFilters],
  );

  // #endregion

  return error ? (
    <Error error={error} />
  ) : (
    <WalletTable
      total={data?.totalElements ?? 0}
      data={data?.items ?? []}
      actions={getActions}
      isLoading={isLoading}
      entity={EntityName.Transaction}
      columns={columns}
      contentClassName="transactions-table-body base-border"
      filterOptions={filterOptions}
    />
  );
};
