import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  Empty,
  Error,
  Loading,
  SortOrder,
  TableOptionsProvider,
} from "@sito/dashboard-app";

import { WalletTable } from "components";

import { useWeeklyTransactionsList } from "../../hooks";
import { TransactionCard } from "../TransactionCard";

import {
  WEEKLY_TRANSACTIONS_DIALOG_CLASS_NAME,
  WEEKLY_TRANSACTIONS_TABLE_INITIAL_STATE,
} from "./constants";
import type { WeeklyTransactionsDialogPropsType } from "./types";
import { EntityName, useParseColumns } from "lib";
import type { TransactionDto } from "lib";
import { getWeeklyTransactionsTableColumns } from "./tableColumns";
import { sortWeeklyTransactions } from "./sort";
import { getWeeklyTransactionsRangeLabel } from "./utils";

import "./styles.css";

export const WeeklyTransactionsDialog = (
  props: WeeklyTransactionsDialogPropsType,
) => {
  const {
    open,
    onClose,
    accountId,
    title,
    type,
    weekScope = "current",
    getActions,
    onTransactionClick,
  } = props;

  const { t } = useTranslation();

  const { data, isLoading, error, dateRange } = useWeeklyTransactionsList({
    accountId,
    open,
    type,
    weekScope,
  });

  const items = useMemo(() => data?.items ?? [], [data?.items]);
  const [sortProperty, setSortProperty] = useState<string>(
    WEEKLY_TRANSACTIONS_TABLE_INITIAL_STATE.sortingBy,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    WEEKLY_TRANSACTIONS_TABLE_INITIAL_STATE.sortingOrder,
  );

  const weeklyColumns = useMemo(
    () => getWeeklyTransactionsTableColumns(t),
    [t],
  );

  const { columns } = useParseColumns<TransactionDto>(
    weeklyColumns,
    EntityName.Transaction,
    ["id", "createdAt", "updatedAt", "deletedAt", "softDeleteScope"],
  );

  const sortedItems = useMemo(
    () => sortWeeklyTransactions(items, sortProperty, sortOrder, t),
    [items, sortOrder, sortProperty, t],
  );

  const dateRangeLabel = getWeeklyTransactionsRangeLabel(dateRange);

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      title={title}
      className={WEEKLY_TRANSACTIONS_DIALOG_CLASS_NAME}
    >
      <div className="weekly-transactions-dialog-content">
        <p className="weekly-transactions-dialog-period">{dateRangeLabel}</p>

        {isLoading ? (
          <Loading className="weekly-transactions-dialog-loading" />
        ) : error ? (
          <Error error={error} />
        ) : !items.length ? (
          <Empty message={t("_pages:transactions.empty")} />
        ) : (
          <>
            <TableOptionsProvider
              initialState={WEEKLY_TRANSACTIONS_TABLE_INITIAL_STATE}
            >
              <div className="weekly-transactions-table-wrapper max-sm:hidden">
                <WalletTable
                  total={sortedItems.length}
                  data={sortedItems}
                  entity={EntityName.Transaction}
                  columns={columns}
                  isLoading={false}
                  contentClassName="weekly-transactions-table-content"
                  filterOptions={{
                    button: {
                      hide: true,
                    },
                  }}
                  onSort={(property, order) => {
                    setSortProperty(property);
                    setSortOrder(order);
                  }}
                />
              </div>
            </TableOptionsProvider>

            <div className="weekly-transactions-dialog-mobile-list sm:hidden!">
              {items.map((transaction) => (
                <TransactionCard
                  key={transaction.id}
                  {...transaction}
                  actions={getActions(transaction)}
                  onClick={onTransactionClick}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};
