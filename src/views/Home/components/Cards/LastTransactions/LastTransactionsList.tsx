import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Empty, classNames } from "@sito/dashboard-app";

// views
import { TransactionCard } from "views/Transactions";

// types
import type { LastTransactionsListPropsType } from "./types";

import "./styles.css";

export const LastTransactionsList = (props: LastTransactionsListPropsType) => {
  const { transactions, isLoading, onClick } = props;
  const { t } = useTranslation();

  return (
    <div className="last-transactions-content">
      {!isLoading && transactions.length === 0 ? (
        <Empty message={t("_pages:home.dashboard.lastTransactions.empty")} />
      ) : (
        <ul className="last-transactions-list">
          {transactions.map((transaction, index) => (
            <li
              key={transaction.id}
              className={classNames(
                "last-transactions-row",
                index === transactions.length - 1 &&
                  "last-transactions-row--faded",
              )}
            >
              <TransactionCard
                {...transaction}
                actions={[]}
                onClick={onClick}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
