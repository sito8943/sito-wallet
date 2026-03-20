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
});
