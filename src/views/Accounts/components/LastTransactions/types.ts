import type { TransactionDto } from "lib";

export type LastTransactionsPropsType = {
  /** Comes with the account (`AccountDto.lastTransactions`); no fetch here. */
  transactions: TransactionDto[];
};
