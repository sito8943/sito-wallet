import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Dialog,
  Empty,
  Error as ErrorComponent,
  Loading,
} from "@sito/dashboard-app";

import type { TransactionDto } from "lib";

import { RECENT_TRANSACTIONS_DIALOG_CLASS_NAME } from "./constants";
import { RecentTransactionItem } from "./RecentTransactionItem";
import type { RecentTransactionsDialogPropsType } from "./types";
import { useRecentTransactions } from "./useRecentTransactions";

import "./styles.css";

export const RecentTransactionsDialog = (
  props: RecentTransactionsDialogPropsType,
) => {
  const { open, onClose, title } = props;
  const { t } = useTranslation();

  const { data, isLoading, error } = useRecentTransactions(props);
  const transactions = useMemo<TransactionDto[]>(
    () => data ?? [],
    [data],
  );

  return (
    <Dialog
      open={open}
      handleClose={onClose}
      mobileFullScreen
      title={title}
      className={RECENT_TRANSACTIONS_DIALOG_CLASS_NAME}
    >
      <div className="recent-transactions-dialog-content">
        {isLoading ? (
          <Loading className="recent-transactions-dialog-loading" />
        ) : error ? (
          <ErrorComponent error={error} />
        ) : !transactions.length ? (
          <Empty
            message={t("_pages:home.dashboard.recentTransactions.empty")}
          />
        ) : (
          <ul className="recent-transactions-list">
            {transactions.map((transaction) => (
              <RecentTransactionItem
                key={transaction.id}
                transaction={transaction}
              />
            ))}
          </ul>
        )}
      </div>
    </Dialog>
  );
};
