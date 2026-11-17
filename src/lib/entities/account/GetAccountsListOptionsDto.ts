/** Opt-in extras for `GET /accounts` (sent as top-level query params). */
export interface GetAccountsListOptionsDto {
  /** Fill `lastTransactions` on each account of the page. */
  includeLastTransactions?: boolean;
  /** Transactions per account (backend default 2, clamped to 1..5). */
  lastTransactionsLimit?: number;
}
