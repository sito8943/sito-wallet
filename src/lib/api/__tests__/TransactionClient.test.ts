import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDoQuery = vi.fn();
const mockPost = vi.fn();
const mockDefaultTokenAcquirer = vi.fn(() => ({
  Authorization: "Bearer token",
}));

vi.mock("@sito/dashboard-app", () => ({
  Methods: {
    GET: "GET",
    POST: "POST",
  },
  parseQueries: vi.fn(
    (
      path: string,
      query?: Record<string, unknown>,
      filters?: Record<string, unknown>,
    ) => {
      const search = new URLSearchParams();

      if (query?.sortingBy) {
        search.append("sort", String(query.sortingBy));
      }

      if (query?.sortingOrder) {
        search.append("order", String(query.sortingOrder));
      }

      if (query?.currentPage !== undefined) {
        search.append("page", String(query.currentPage));
      }

      if (query?.pageSize !== undefined) {
        search.append("pageSize", String(query.pageSize));
      }

      if (!filters) {
        const suffix = search.toString();
        return suffix ? `${path}?${suffix}` : path;
      }

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
      post: mockPost,
      defaultTokenAcquirer: mockDefaultTokenAcquirer,
    };

    table = "transactions";
  },
}));

vi.mock("lib", () => ({
  Tables: { Transactions: "transactions" },
  TransactionType: {
    Out: 0,
    In: 1,
  },
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
    mockPost.mockReset();
    mockDefaultTokenAcquirer.mockReset();
    mockDefaultTokenAcquirer.mockReturnValue({
      Authorization: "Bearer token",
    });
  });

  it("posts account transfers to the dedicated endpoint", async () => {
    mockPost.mockResolvedValue({
      outgoingTransactionId: 31,
      incomingTransactionId: 32,
    });

    const client = new TransactionClient();
    const payload = {
      sourceAccountId: 3,
      destinationAccountId: 4,
      amount: 25.5,
      date: "2026-06-22T12:08",
      description: "Savings",
    };

    await client.transfer(payload);

    expect(mockPost).toHaveBeenCalledWith("transactions/transfer", payload);
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
      transactionType: 0,
      account: null,
      categorizedTotal: 10,
      duplicatedAmount: 0,
      categories: [],
    });

    const client = new TransactionClient();
    await client.getTypeResume({
      type: 0,
      time: "currentMonth",
      accountId: 1,
      excludedCategoryIds: [8, 7, 8],
    });

    expect(mockDoQuery).toHaveBeenCalledWith(
      expect.stringContaining("transactions/type-resume"),
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );

    const builtUrl = decodeURIComponent(mockDoQuery.mock.calls[0][0] as string);
    expect(builtUrl).toContain("type=OUT");
    expect(builtUrl).toContain("time=currentMonth");
    expect(builtUrl).toContain("filters=account==1");
    expect(builtUrl).toContain("excludedCategoryIds=8");
    expect(builtUrl).toContain("excludedCategoryIds=7");
    expect(builtUrl).not.toContain("accountId=");
  });

  it("calls getTypeResumeBatch with request body on POST", async () => {
    mockDoQuery.mockResolvedValue({
      items: [
        {
          cardId: 1,
          primary: {
            total: 10,
            transactionType: 1,
            account: null,
            categorizedTotal: 10,
            duplicatedAmount: 0,
            categories: [],
          },
        },
      ],
    });

    const client = new TransactionClient();
    const request = {
      items: [
        {
          cardId: 1,
          type: 1,
          time: "currentMonth",
          accountId: 4,
          excludedCategoryIds: [3, 9],
          includeOpposite: true,
          oppositeExcludedCategoryIds: [10],
        },
      ],
    };

    await client.getTypeResumeBatch(request);

    expect(mockDoQuery).toHaveBeenCalledWith(
      "transactions/type-resume/batch",
      "POST",
      {
        items: [
          {
            cardId: 1,
            accountId: 4,
            type: "IN",
            time: "currentMonth",
            excludedCategoryIds: [3, 9],
            includeOpposite: true,
            oppositeExcludedCategoryIds: [10],
          },
        ],
      },
      { Authorization: "Bearer token" },
    );
  });

  it("calls getCommon without request body on GET and includes sorting", async () => {
    mockDoQuery.mockResolvedValue([
      {
        id: 1,
        amount: 90,
        description: "Groceries",
        date: "2026-03-15",
      },
    ]);

    const client = new TransactionClient();
    await client.getCommon(
      {
        accountId: 1,
        category: [2],
        type: 0,
        date: {
          start: "2026-03-01",
          end: "2026-03-31",
        },
        softDeleteScope: "ACTIVE",
      },
      {
        currentPage: 0,
        pageSize: 100,
        sortingBy: "amount",
        sortingOrder: "DESC",
      },
    );

    expect(mockDoQuery).toHaveBeenCalledWith(
      expect.stringContaining("transactions/common"),
      "GET",
      undefined,
      { Authorization: "Bearer token" },
    );

    const builtUrl = decodeURIComponent(mockDoQuery.mock.calls[0][0] as string);
    expect(builtUrl).toContain("sort=amount");
    expect(builtUrl).toContain("order=DESC");
    expect(builtUrl).toContain("page=0");
    expect(builtUrl).toContain("pageSize=100");
    expect(builtUrl).toContain("accountId=1");
    expect(builtUrl).toContain("category=2");
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

  it("sanitizes grouped filters and only keeps deletedAt as range", async () => {
    mockDoQuery.mockResolvedValue({
      incomeTotal: 10,
      expenseTotal: 2,
    });

    const client = new TransactionClient();
    await client.getGroupedByType({
      accountId: 15,
      filters:
        "softDeleteScope==DELETED,status==ACTIVE,deletedAt==true,category==1,amount>=100",
      date: {
        start: "2026-03-01",
        end: "2026-03-31",
      },
      deletedAt: {
        start: "2026-02-01",
        end: "2026-02-28",
      } as never,
    });

    const builtUrl = decodeURIComponent(mockDoQuery.mock.calls[0][0] as string);
    expect(builtUrl).toContain("accountId=15");
    expect(builtUrl).toContain(
      "filters=category==1,amount>=100,date>=2026-03-01,date<=2026-03-31,deletedAt>=2026-02-01,deletedAt<=2026-02-28",
    );
    expect(builtUrl).not.toContain("softDeleteScope");
    expect(builtUrl).not.toContain("status==");
    expect(builtUrl).not.toContain("deletedAt==true");
  });
});
