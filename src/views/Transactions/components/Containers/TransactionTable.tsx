import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import {
  Empty,
  Error,
  GlobalActions,
  useTableOptions,
} from "@sito/dashboard-app";

// icons
import { faAdd, faReceipt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { WalletTable } from "components";

// hooks
import { useTransactionsList } from "../../../../hooks/queries/useTransactionsList";

// lib
import type { TransactionDto } from "lib";
import { EntityName, normalizeListFilters, useParseColumns } from "lib";

// types
import type { TransactionContainerPropsType } from "./types";

// utils
import { getTransactionColumns } from "./transactionColumns";

import "./styles.css";

export const TransactionTable = (props: TransactionContainerPropsType) => {
  const {
    accountId,
    categories,
    getActions,
    showFilters,
    setShowFilters,
    hideDeletedEntities = false,
    onCategoryClick,
    onAddTransaction,
  } = props;
  const { filters: tableFilters } = useTableOptions();

  const { t } = useTranslation();

  const listFilters = useMemo(() => ({ accountId }), [accountId]);

  const { data, isLoading, error } = useTransactionsList({
    filters: listFilters,
  });

  // #region columns

  const columnDefs = useMemo(
    () => getTransactionColumns(t, categories, onCategoryClick),
    [categories, onCategoryClick, t],
  );

  const softDeleteScope = useMemo(
    () =>
      hideDeletedEntities
        ? "ACTIVE"
        : String(
            normalizeListFilters(tableFilters).softDeleteScope ?? "ACTIVE",
          ),
    [tableFilters, hideDeletedEntities],
  );

  const toIgnore = useMemo(() => {
    const ignoredColumns = ["id", "createdAt", "updatedAt"];

    if (hideDeletedEntities) {
      ignoredColumns.push("softDeleteScope", "deletedAt");
      return ignoredColumns;
    }

    if (softDeleteScope !== "DELETED") {
      ignoredColumns.push("deletedAt");
    }

    return ignoredColumns;
  }, [softDeleteScope, hideDeletedEntities]);

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

  if (error) return <Error error={error} />;

  const hasNoTransactions = !isLoading && (data?.items?.length ?? 0) === 0;

  if (hasNoTransactions) {
    return (
      <Empty
        message={t("_pages:transactions.empty")}
        iconProps={{
          icon: faReceipt,
          className: "transaction-table-empty-icon",
        }}
        action={
          onAddTransaction
            ? {
                icon: <FontAwesomeIcon icon={faAdd} />,
                id: GlobalActions.Add,
                onClick: onAddTransaction,
                tooltip: t("_pages:transactions.add"),
              }
            : undefined
        }
      />
    );
  }

  return (
    <WalletTable
      total={data?.totalElements ?? 0}
      data={data?.items ?? []}
      actions={getActions}
      isLoading={isLoading}
      entity={EntityName.Transaction}
      columns={columns}
      contentClassName="transactions-table-body transaction-table-content"
      filterOptions={filterOptions}
    />
  );
};
