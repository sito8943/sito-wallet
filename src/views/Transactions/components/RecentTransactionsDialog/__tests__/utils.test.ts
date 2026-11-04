import { describe, expect, it } from "vitest";

import type { TransactionDto } from "lib";

import {
  RECENT_TRANSACTIONS_LIMIT,
  RECENT_TRANSACTIONS_PREFILTER_LIMIT,
} from "../constants";
import { filterRecentTransactions, getRecentTransactionsQuery } from "../utils";

const transactions = Array.from(
  { length: 120 },
  (_, index) => ({ id: index + 1 }) as TransactionDto,
);

describe("getRecentTransactionsQuery", () => {
  it("keeps the recent page size by default", () => {
    expect(getRecentTransactionsQuery([]).pageSize).toBe(
      RECENT_TRANSACTIONS_LIMIT,
    );
    expect(getRecentTransactionsQuery([1]).pageSize).toBe(
      RECENT_TRANSACTIONS_PREFILTER_LIMIT,
    );
  });

  it("asks for at least the requested limit", () => {
    expect(getRecentTransactionsQuery([], 100).pageSize).toBe(100);
  });
});

describe("filterRecentTransactions", () => {
  it("cuts the list at the limit", () => {
    expect(filterRecentTransactions(transactions, [])).toHaveLength(
      RECENT_TRANSACTIONS_LIMIT,
    );
    expect(filterRecentTransactions(transactions, [], 100)).toHaveLength(100);
  });
});
