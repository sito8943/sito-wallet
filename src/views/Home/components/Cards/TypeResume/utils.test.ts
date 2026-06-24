import { describe, expect, it } from "vitest";

import { TransactionType, TransactionTypeResumeTime } from "lib";

import {
  formToDto,
  getOppositeTransactionType,
  normalizeExcludedCategoryIds,
  parseFormConfig,
  toTypeResumeBatchRequestItem,
  toTypeResumeFilterConfig,
} from "./utils";

describe("TypeResume utils", () => {
  it("normalizes excluded category ids", () => {
    expect(normalizeExcludedCategoryIds([8, "7", 8, "invalid", 3])).toEqual([
      3, 7, 8,
    ]);
  });

  it("parses legacy config without excluded categories", () => {
    expect(
      parseFormConfig(
        JSON.stringify({
          accounts: [{ id: 12, name: "Main" }],
          type: TransactionType.Out,
          time: TransactionTypeResumeTime.CurrentWeek,
        }),
      ),
    ).toMatchObject({
      account: { id: 12, name: "Main" },
      type: TransactionType.Out,
      time: TransactionTypeResumeTime.CurrentWeek,
      excludedCategoryIds: [],
      excludedCategories: [],
      oppositeExcludedCategoryIds: [],
      oppositeExcludedCategories: [],
      showOppositeType: false,
    });
  });

  it("resolves the opposite transaction type", () => {
    expect(getOppositeTransactionType(TransactionType.In)).toBe(
      TransactionType.Out,
    );
    expect(getOppositeTransactionType(TransactionType.Out)).toBe(
      TransactionType.In,
    );
  });

  it("builds filter config with normalized excluded ids", () => {
    expect(
      toTypeResumeFilterConfig({
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [],
        excludedCategoryIds: [9, 3, 9],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [],
        showFiltersAsBadge: false,
        showOppositeType: false,
      }),
    ).toEqual({
      accountId: 4,
      type: TransactionType.In,
      time: TransactionTypeResumeTime.CurrentMonth,
      excludedCategoryIds: [3, 9],
    });
  });

  it("serializes only persisted config fields", () => {
    expect(
      formToDto({
        id: 11,
        userId: 22,
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [
          {
            id: 8,
            name: "Food",
            color: null,
            auto: false,
            type: TransactionType.Out,
          },
        ],
        excludedCategoryIds: [8, 8, 3],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [10, 10, 12],
        showFiltersAsBadge: false,
        showOppositeType: true,
      }),
    ).toEqual({
      id: 11,
      userId: 22,
      config: JSON.stringify({
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        showFiltersAsBadge: false,
        showOppositeType: true,
        compare: false,
        excludedCategoryIds: [3, 8],
        oppositeExcludedCategoryIds: [10, 12],
      }),
    });
  });

  it("builds a batch request item with opposite exclusions", () => {
    expect(
      toTypeResumeBatchRequestItem(44, {
        account: { id: 4, name: "Wallet", currency: null },
        type: TransactionType.In,
        time: TransactionTypeResumeTime.CurrentMonth,
        excludedCategories: [],
        excludedCategoryIds: [9, 3, 9],
        oppositeExcludedCategories: [],
        oppositeExcludedCategoryIds: [12, 10, 10],
        showFiltersAsBadge: false,
        showOppositeType: true,
      }),
    ).toEqual({
      cardId: 44,
      accountId: 4,
      type: TransactionType.In,
      time: TransactionTypeResumeTime.CurrentMonth,
      excludedCategoryIds: [3, 9],
      includeOpposite: true,
      oppositeExcludedCategoryIds: [10, 12],
    });
  });
});
