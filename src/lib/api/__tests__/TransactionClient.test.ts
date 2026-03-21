import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDoQuery = vi.fn();
const mockDefaultTokenAcquirer = vi.fn(() => ({
  Authorization: "Bearer token",
}));

vi.mock("@sito/dashboard-app", () => ({
  Methods: {
    GET: "GET",
  },
  parseQueries: vi.fn(
    (
      path: string,
      _query: unknown,
      filters?: Record<string, unknown>,
    ) => {
      if (!filters) return path;

      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (Array.isArray(value)) {
          value.forEach((item) => search.append(key, String(item)));
          continue;
        }

        if (value !== undefined && value !== null) {
          search.append(key, String(value));
        }
      }

      const suffix = search.toString();
      return suffix ? `${path}?${suffix}` : path;
    },
  ),
  BaseClient: class {
    api = {
      doQuery: mockDoQuery,
      defaultTokenAcquirer: mockDefaultTokenAcquirer,
    };

    table = "transactions";
  },
}));

vi.mock("lib", () => ({
  Tables: { Transactions: "transactions" },
  TransactionDto: class {},
  CommonTransactionDto: class {},
  UpdateTransactionDto: class {},
  FilterTransactionDto: class {},
  AddTransactionDto: class {},
  TransactionTypeResumeDto: class {},
  FilterTransactionTypeResumeDto: class {},
  TransactionTypeGroupedDto: class {},
  FilterTransactionGroupedByTypeDto: class {},
  TransactionWeeklySpentDto: class {},
  FilterWeeklyTransactionDto: class {},
  ImportPreviewTransactionDto: class {},
  ImportDto: class {},
  AssignTransactionAccountDto: class {},
  AssignTransactionCategoryDto: class {},
  parseJSONFile: vi.fn(),
}));

import TransactionClient from "../TransactionClient";

describe("TransactionClient", () => {
  beforeEach(() => {
    mockDoQuery.mockReset();
    mockDefaultTokenAcquirer.mockReset();
    mockDefaultTokenAcquirer.mockReturnValue({
      Authorization: "Bearer token",
    });
  });

  it("calls weekly without request body on GET", async () => {
    mockDoQuery.mockResolvedValue({
      currentWeek: 10,
      previousWeek: 8,
      account: { id: 1, name: "Wallet" },
    });

    const client = new TransactionClient();
    await client.weekly({ type: "out", account: [1] });

    expect(mockDoQuery).toHaveBeenCalledWith(
      expect.stringContaining("transactions/weekly"),
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );
  });

  it("calls getTypeResume without request body on GET", async () => {
    mockDoQuery.mockResolvedValue({
      total: 10,
      account: { id: 1, name: "Wallet" },
    });

    const client = new TransactionClient();
    await client.getTypeResume({ type: "out", account: [1] });

    expect(mockDoQuery).toHaveBeenCalledWith(
      expect.stringContaining("transactions/type-resume"),
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );
  });

  it("calls getGroupedByType without request body on GET", async () => {
    mockDoQuery.mockResolvedValue({
      incomeTotal: 120.5,
      expenseTotal: 35.25,
    });

    const client = new TransactionClient();
    await client.getGroupedByType({
      accountId: 15,
      date: {
        start: "2026-03-01T00:00:00",
        end: "2026-03-31T23:59:59",
      },
    });

    expect(mockDoQuery).toHaveBeenCalledWith(
      expect.stringContaining("transactions/grouped-by-type"),
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );

    expect(mockDoQuery.mock.calls[0][0]).toContain("accountId=15");
    expect(mockDoQuery.mock.calls[0][0]).toContain(
      "filters=date%3E%3D2026-03-01T00%3A00%3A00%2Cdate%3C%3D2026-03-31T23%3A59%3A59",
    );
  });
});
