// @sito/dashboard-app
import { Loading, SortOrder } from "@sito/dashboard-app";

// types
import { LastTransactionsPropsType } from "./types";

//hooks
import { useTransactionsList } from "hooks";

// components
import { Transaction } from "./Transaction";

export const LastTransactions = (props: LastTransactionsPropsType) => {
  const { accountId, currency } = props;

  const { isLoading, data } = useTransactionsList({
    filters: {
      accountId,
      deletedAt: false as unknown as any,
    },
    query: {
      pageSize: 2,
      sortingBy: "date",
      sortingOrder: SortOrder.DESC,
    },
  });

  return (
    <div className="flex w-full pt-5">
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <Loading />
        </div>
      ) : (
        <ul className="w-full gap-2 flex flex-col">
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
