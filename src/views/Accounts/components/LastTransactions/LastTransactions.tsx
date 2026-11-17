// types
import type { LastTransactionsPropsType } from "./types";

// views
import { EditTransactionDialog } from "views/Transactions/components/EditTransactionDialog";
import { TransactionCard } from "views/Transactions/components/TransactionCard";
import { useEditTransaction } from "views/Transactions/hooks";

// utils
import { stopPropagation } from "./utils";

import "./styles.css";

export const LastTransactions = (props: LastTransactionsPropsType) => {
  const { transactions } = props;

  const editTransaction = useEditTransaction();

  // Keep account cards compact: no list (and no empty text) without data.
  if (!transactions.length) return null;

  return (
    // Lives inside a clickable account card: keep clicks/long-presses on a
    // transaction (or its edit dialog) from also reaching the account card.
    <div
      className="account-last-transactions"
      onClick={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <ul className="account-last-transactions-list">
        {transactions.map((transaction) => (
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
      <EditTransactionDialog {...editTransaction} />
    </div>
  );
};
