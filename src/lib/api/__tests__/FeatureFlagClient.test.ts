import { beforeEach, describe, expect, it, vi } from "vitest";

const mockDoQuery = vi.fn();
const mockDefaultTokenAcquirer = vi.fn(() => ({
  Authorization: "Bearer token",
}));

vi.mock("@sito/dashboard-app", () => ({
  Methods: {
    GET: "GET",
  },
  fromLocal: vi.fn(),
  removeFromLocal: vi.fn(),
  toLocal: vi.fn(),
  APIClient: class {
    doQuery = mockDoQuery;
    defaultTokenAcquirer = mockDefaultTokenAcquirer;
  },
}));

import FeatureFlagClient from "../FeatureFlagClient";

describe("FeatureFlagClient", () => {
  beforeEach(() => {
    mockDoQuery.mockReset();
    mockDefaultTokenAcquirer.mockReset();
    mockDefaultTokenAcquirer.mockReturnValue({ Authorization: "Bearer token" });
  });

  it("fetches and sanitizes app features", async () => {
    mockDoQuery.mockResolvedValue({
      features: {
        transactionsEnabled: false,
        accountsEnabled: true,
        currenciesEnabled: "yes",
        unknown: true,
      },
    });

    const client = new FeatureFlagClient();
    const result = await client.getFeatures();

    expect(mockDoQuery).toHaveBeenCalledWith("app/features", "GET", undefined, {
      Authorization: "Bearer token",
    });

    expect(result).toEqual({
      transactionsEnabled: false,
      accountsEnabled: true,
    });
  });
});
