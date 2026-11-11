import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Dialog, Empty, Loading } from "@sito/dashboard-app";

import { QueryError } from "components";

import type { TransactionDto } from "lib";

import { useEditTransaction } from "../../hooks";
import { EditTransactionDialog } from "../EditTransactionDialog";
import { TransactionCard } from "../TransactionCard";
import { TransactionProductPrice } from "../TransactionProductPrice";

import { RECENT_TRANSACTIONS_DIALOG_CLASS_NAME } from "./constants";
import type { RecentTransactionsDialogPropsType } from "./types";
import { useRecentTransactions } from "./useRecentTransactions";

import "./styles.css";

export const RecentTransactionsDialog = (
  props: RecentTransactionsDialogPropsType,
) => {
  const { open, onClose, title, emptyMessage, filters } = props;
  const productId = filters.productId;
  const { t } = useTranslation();

  const editTransaction = useEditTransaction();

  const { data, isLoading, error } = useRecentTransactions(props);
  const transactions = useMemo<TransactionDto[]>(() => data ?? [], [data]);

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
          <QueryError error={error} />
        ) : !transactions.length ? (
          <Empty
            message={
              emptyMessage ??
              t("_pages:home.dashboard.recentTransactions.empty")
            }
          />
        ) : (
          <ul className="recent-transactions-list">
            {transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                {...transaction}
                actions={[]}
                onClick={editTransaction.openDialog}
                footer={
                  productId ? (
                    <TransactionProductPrice
                      products={transaction.products}
                      productId={productId}
                      currency={transaction.account?.currency}
                    />
                  ) : undefined
                }
              />
            ))}
          </ul>
        )}
      </div>

      <EditTransactionDialog {...editTransaction} containerClassName="!z-60" />
    </Dialog>
  );
};
