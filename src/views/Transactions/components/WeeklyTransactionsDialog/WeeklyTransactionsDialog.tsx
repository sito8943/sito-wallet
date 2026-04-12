import { useTranslation } from "react-i18next";

import { Dialog, Empty, Error, Loading } from "@sito/dashboard-app";

import { Currency } from "views/Currencies/components/Currency";
import { Type } from "views/TransactionCategories/components/Type";

import { useWeeklyTransactionsList } from "../../hooks";
import { TransactionCard } from "../TransactionCard";

import {
  WEEKLY_TRANSACTIONS_DIALOG_CLASS_NAME,
  WEEKLY_TRANSACTIONS_TABLE_HEADERS,
} from "./constants";
import type { WeeklyTransactionsDialogPropsType } from "./types";
import {
  getWeeklyTransactionAmountClassName,
  getWeeklyTransactionAmountPrefix,
  getWeeklyTransactionCategoryLabel,
  getWeeklyTransactionDateLabel,
  getWeeklyTransactionDescriptionLabel,
  getWeeklyTransactionType,
  getWeeklyTransactionsRangeLabel,
} from "./utils";

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

  const items = data?.items ?? [];

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
            <div className="weekly-transactions-table-wrapper max-sm:hidden">
              <table className="weekly-transactions-table">
                <thead>
                  <tr>
                    {WEEKLY_TRANSACTIONS_TABLE_HEADERS.map((headerKey) => (
                      <th key={headerKey}>{t(headerKey)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{getWeeklyTransactionDateLabel(transaction.date)}</td>
                      <td>
                        <div className="w-fit">
                          <Type type={getWeeklyTransactionType(transaction)} />
                        </div>
                      </td>
                      <td>{getWeeklyTransactionDescriptionLabel(transaction, t)}</td>
                      <td>{getWeeklyTransactionCategoryLabel(transaction, t)}</td>
                      <td>
                        <p className={getWeeklyTransactionAmountClassName(transaction)}>
                          {getWeeklyTransactionAmountPrefix(transaction)}
                          {transaction.amount}{" "}
                          <Currency
                            name={transaction.account?.currency?.name}
                            symbol={transaction.account?.currency?.symbol}
                          />
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
