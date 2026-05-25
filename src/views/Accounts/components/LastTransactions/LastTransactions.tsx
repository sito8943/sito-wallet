// @sito/dashboard-app
import { Loading, SortOrder } from "@sito/dashboard-app";

// types
import type { LastTransactionsPropsType } from "./types";

//hooks
import { useTransactionsList } from "../../../../hooks/queries/useTransactionsList";

// components
import { Transaction } from "./Transaction";

import "./styles.css";

export const LastTransactions = (props: LastTransactionsPropsType) => {
  const { accountId, currency } = props;

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
    <div className="account-last-transactions">
      {isLoading ? (
        <div className="account-last-transactions-loading">
          <Loading />
        </div>
      ) : (
        <ul className="account-last-transactions-list">
          {data?.items?.map((transaction) => (
            <Transaction
              {...transaction}
              key={transaction.id}
              currency={currency}
            />
          ))}
        </ul>
      )}
    </div>
  );
};
