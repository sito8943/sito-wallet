// @sito/dashboard-app
import { Loading, SortOrder } from "@sito/dashboard-app";

// types
import type { LastTransactionsPropsType } from "./types";

//hooks
import { useTransactionsList } from "../../../../hooks/queries/useTransactionsList";

// views
import { EditTransactionDialog } from "views/Transactions/components/EditTransactionDialog";
import { TransactionCard } from "views/Transactions/components/TransactionCard";
import { useEditTransaction } from "views/Transactions/hooks";

// utils
import { stopPropagation } from "./utils";

import "./styles.css";

export const LastTransactions = (props: LastTransactionsPropsType) => {
  const { accountId } = props;

  const editTransaction = useEditTransaction();

  const { isLoading, data } = useTransactionsList({
    filters: {
      accountId,
      softDeleteScope: "ACTIVE",
    },
    query: {
      pageSize: 2,
      sortingBy: "date",
      sortingOrder: SortOrder.DESC,
    },
  });

  return (
    // Lives inside a clickable account card: keep clicks/long-presses on a
    // transaction (or its edit dialog) from also reaching the account card.
    <div
      className="account-last-transactions"
      onClick={stopPropagation}
      onTouchStart={stopPropagation}
    >
      {isLoading ? (
        <div className="account-last-transactions-loading">
          <Loading />
        </div>
      ) : (
        <ul className="account-last-transactions-list">
          {data?.items?.map((transaction) => (
            <li key={transaction.id}>
              <TransactionCard
                {...transaction}
                actions={[]}
                onClick={editTransaction.openDialog}
                compact
              />
            </li>
          ))}
        </ul>
      )}
      <EditTransactionDialog {...editTransaction} />
    </div>
  );
};
