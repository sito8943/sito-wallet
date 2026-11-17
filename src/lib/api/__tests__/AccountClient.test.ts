import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDoQuery = vi.fn();
const mockSuperGet = vi.fn();
const mockDefaultTokenAcquirer = vi.fn(() => ({
  Authorization: "Bearer token",
}));

vi.mock("@sito/dashboard-app", () => ({
  Methods: { GET: "GET", POST: "POST" },
  parseQueries: vi.fn((path: string, query?: Record<string, unknown>) =>
    query?.currentPage !== undefined
      ? `${path}?page=${String(query.currentPage)}&pageSize=${String(query.pageSize)}`
      : path,
  ),
  BaseClient: class {
    api = {
      doQuery: mockDoQuery,
      defaultTokenAcquirer: mockDefaultTokenAcquirer,
    };

    table = "accounts";

    get(...args: unknown[]) {
      return mockSuperGet(...args);
    }
  },
}));

vi.mock("lib", () => ({
  BalanceHistoryGranularity: { Day: "DAY" },
  appendSavingsDepositParams: vi.fn(),
  parseJSONFile: vi.fn(),
  resolveRewardsMonths: vi.fn(),
}));

vi.mock("../../../config", () => ({
  config: { apiUrl: "http://api", auth: { user: "user", clientConfig: {} } },
}));

import AccountClient from "../AccountClient";

describe("AccountClient.get", () => {
  beforeEach(() => {
    mockDoQuery.mockReset();
    mockSuperGet.mockReset();
  });

  it("keeps the plain list request without options", async () => {
    const client = new AccountClient();
    const query = { currentPage: 0, pageSize: 20 };

    await client.get(query, {});

    expect(mockSuperGet).toHaveBeenCalledWith(query, {});
    expect(mockDoQuery).not.toHaveBeenCalled();
  });

  it("appends includeLastTransactions and the limit as top-level params", async () => {
    const client = new AccountClient();

    await client.get(
      { currentPage: 1, pageSize: 20 },
      {},
      { includeLastTransactions: true, lastTransactionsLimit: 2 },
    );

    expect(mockSuperGet).not.toHaveBeenCalled();
    expect(mockDoQuery).toHaveBeenCalledWith(
      "accounts?page=1&pageSize=20&includeLastTransactions=true&lastTransactionsLimit=2",
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );
  });

  it("starts the query string when the list url has none", async () => {
    const client = new AccountClient();

    await client.get(undefined, undefined, { includeLastTransactions: true });

    expect(mockDoQuery).toHaveBeenCalledWith(
      "accounts?includeLastTransactions=true",
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );
  });
});
