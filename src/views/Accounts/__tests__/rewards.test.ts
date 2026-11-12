import { describe, expect, it } from "vitest";

import type { AccountFormType } from "../types";
import type { AccountDto, CommonTransactionCategoryDto } from "lib";
import { AccountType } from "lib/entities/account/AccountType";
import { TransactionType } from "lib/entities/transaction/TransactionType";
import { AdjustRewardsMode } from "lib/entities/account/AdjustRewardsMode";
import { RewardsRounding } from "lib/entities/account/RewardsRounding";

import {
  EMPTY_REWARDS_CONFIG,
  addEmptyAccount,
  dtoToForm,
  emptyAccount,
  formToAddDto,
  formToUpdateDto,
  normalizeRewardsConfig,
  normalizeRewardsExcludedCategoryIds,
} from "../utils";
import {
  getExcludableRewardsCategories,
  getRewardsPairErrorKey,
  selectCategoriesByIds,
} from "../components/CardRewardsFields/utils";
import {
  getAdjustRewardsAmountErrorKey,
  getAdjustedRewardsBalance,
} from "../components/AdjustRewardsDialog/utils";
import {
  accountToAdjustRewardsAccount,
  adjustRewardsDefaultValues,
  adjustRewardsFormToDto,
  canAdjustRewards,
} from "../hooks/adjustRewardsMutation.utils";

const cardForm: AccountFormType = {
  id: 9,
  name: "Revolut",
  description: "",
  balance: 250,
  type: AccountType.Card,
  bankName: "Revolut",
  currency: { id: 1, name: "EUR", symbol: "€" },
  userId: 1,
  rewardsName: "  RevPoints  ",
  rewardsSpendUnit: "4",
  rewardsPointsPerUnit: "1",
  rewardsRounding: "0",
  rewardsPointValue: "0.01",
  rewardsStartDate: "2026-01-01",
  rewardsAdjustment: -120,
  rewardsExcludedCategoryIds: [3, 5],
};

const category = (
  id: number,
  type: TransactionType,
  auto = false,
): CommonTransactionCategoryDto =>
  ({
    id,
    name: `Category ${id}`,
    color: null,
    auto,
    type,
  }) as unknown as CommonTransactionCategoryDto;

describe("normalizeRewardsConfig", () => {
  it("coerces raw form strings for card accounts", () => {
    expect(normalizeRewardsConfig(AccountType.Card, cardForm)).toEqual({
      rewardsName: "RevPoints",
      rewardsSpendUnit: 4,
      rewardsPointsPerUnit: 1,
      rewardsRounding: RewardsRounding.FloorPerTransaction,
      rewardsPointValue: 0.01,
      rewardsStartDate: "2026-01-01",
    });
  });

  it("accepts the type as the raw select string", () => {
    expect(normalizeRewardsConfig("1", cardForm).rewardsSpendUnit).toBe(4);
  });

  it("maps blank values (manual entry left empty) to null", () => {
    expect(
      normalizeRewardsConfig(AccountType.Card, {
        rewardsName: "   ",
        rewardsSpendUnit: "10",
        rewardsPointsPerUnit: "1",
        rewardsRounding: "",
        rewardsPointValue: "",
        rewardsStartDate: "",
      }),
    ).toEqual({
      ...EMPTY_REWARDS_CONFIG,
      rewardsSpendUnit: 10,
      rewardsPointsPerUnit: 1,
    });
  });

  it("caps the program name at 40 characters", () => {
    const result = normalizeRewardsConfig(AccountType.Card, {
      rewardsName: "x".repeat(50),
    });
    expect(result.rewardsName).toHaveLength(40);
  });

  it("clears every rewards field for non-card accounts", () => {
    expect(normalizeRewardsConfig(AccountType.Saving, cardForm)).toEqual(
      EMPTY_REWARDS_CONFIG,
    );
    expect(normalizeRewardsConfig(AccountType.Physical, cardForm)).toEqual(
      EMPTY_REWARDS_CONFIG,
    );
  });
});

describe("account form → DTO (rewards)", () => {
  it("sends the rewards config for card accounts", () => {
    const dto = formToUpdateDto(cardForm);

    expect(dto.type).toBe(AccountType.Card);
    expect(dto.rewardsSpendUnit).toBe(4);
    expect(dto.rewardsName).toBe("RevPoints");
  });

  it("clears rewards when the type is switched away from card", () => {
    const dto = formToAddDto({ ...cardForm, type: AccountType.Saving });

    expect(dto).toMatchObject(EMPTY_REWARDS_CONFIG);
  });

  it("never sends the read-only adjustment", () => {
    expect(formToUpdateDto(cardForm)).not.toHaveProperty("rewardsAdjustment");
    expect(formToAddDto(cardForm)).not.toHaveProperty("rewardsAdjustment");
  });

  it("starts new accounts without rewards", () => {
    expect(addEmptyAccount).toMatchObject(EMPTY_REWARDS_CONFIG);
  });
});

describe("getRewardsPairErrorKey", () => {
  it("is null when both or none are set", () => {
    expect(getRewardsPairErrorKey("", "")).toBeNull();
    expect(getRewardsPairErrorKey("10", "1")).toBeNull();
  });

  it("asks for both values when only one is set", () => {
    expect(getRewardsPairErrorKey("10", "")).toBe(
      "_entities:account.rewards.pair.incomplete",
    );
  });

  it("asks for values > 0", () => {
    expect(getRewardsPairErrorKey("0", "1")).toBe(
      "_entities:account.rewards.pair.notPositive",
    );
  });
});

describe("adjust points form", () => {
  it("defaults to the delta mode with no amount", () => {
    expect(adjustRewardsDefaultValues).toEqual({
      mode: AdjustRewardsMode.Delta,
      amount: "",
    });
  });

  it("maps each mode to its own body field", () => {
    expect(
      adjustRewardsFormToDto({ mode: AdjustRewardsMode.Delta, amount: "-500" }),
    ).toEqual({ delta: -500 });
    expect(
      adjustRewardsFormToDto({
        mode: AdjustRewardsMode.Balance,
        amount: "1250",
      }),
    ).toEqual({ balance: 1250 });
  });

  it("previews the resulting balance", () => {
    expect(
      getAdjustedRewardsBalance(800, AdjustRewardsMode.Delta, "-300"),
    ).toBe(500);
    expect(
      getAdjustedRewardsBalance(800, AdjustRewardsMode.Balance, "1000"),
    ).toBe(1000);
    expect(getAdjustedRewardsBalance(800, AdjustRewardsMode.Delta, "")).toBe(
      null,
    );
  });

  it("validates the amount per mode", () => {
    const key = (mode: AdjustRewardsMode, amount: string) =>
      getAdjustRewardsAmountErrorKey(mode, amount, 800);

    expect(key(AdjustRewardsMode.Delta, "")).toBe(
      "_pages:accounts.actions.adjustRewards.dialog.required",
    );
    expect(key(AdjustRewardsMode.Delta, "0")).toBe(
      "_pages:accounts.actions.adjustRewards.dialog.zeroDelta",
    );
    expect(key(AdjustRewardsMode.Delta, "-50")).toBeNull();
    expect(key(AdjustRewardsMode.Balance, "800")).toBe(
      "_pages:accounts.actions.adjustRewards.dialog.sameBalance",
    );
    expect(key(AdjustRewardsMode.Balance, "0")).toBeNull();
  });
});

describe("rewards excluded categories", () => {
  it("keeps valid, unique ids for card accounts", () => {
    expect(
      normalizeRewardsExcludedCategoryIds(AccountType.Card, [
        3,
        "5",
        3,
        0,
        null,
      ]),
    ).toEqual([3, 5]);
  });

  it("is an empty array for non-card accounts or missing values", () => {
    expect(
      normalizeRewardsExcludedCategoryIds(AccountType.Saving, [3]),
    ).toEqual([]);
    expect(normalizeRewardsExcludedCategoryIds(AccountType.Card, null)).toEqual(
      [],
    );
  });

  it("is always sent as an array (null would keep the stored list)", () => {
    expect(formToUpdateDto(cardForm).rewardsExcludedCategoryIds).toEqual([
      3, 5,
    ]);
    expect(
      formToUpdateDto({ ...cardForm, rewardsExcludedCategoryIds: [] })
        .rewardsExcludedCategoryIds,
    ).toEqual([]);
    expect(
      formToAddDto({ ...cardForm, type: AccountType.Physical })
        .rewardsExcludedCategoryIds,
    ).toEqual([]);
  });

  it("is pre-filled from the account and empty for new ones", () => {
    const dto = {
      ...cardForm,
      user: { id: 1 },
      rewardsExcludedCategoryIds: [7],
    } as unknown as AccountDto;

    expect(dtoToForm(dto).rewardsExcludedCategoryIds).toEqual([7]);
    expect(
      dtoToForm({
        ...dto,
        rewardsExcludedCategoryIds: undefined,
      }).rewardsExcludedCategoryIds,
    ).toEqual([]);
    expect(addEmptyAccount.rewardsExcludedCategoryIds).toEqual([]);
    expect(emptyAccount.rewardsExcludedCategoryIds).toEqual([]);
  });

  it("offers only manual OUT categories", () => {
    const categories = [
      category(1, TransactionType.Out),
      category(2, TransactionType.In),
      category(3, TransactionType.Out, true),
      category(4, TransactionType.Out),
    ];

    expect(
      getExcludableRewardsCategories(categories).map(({ id }) => id),
    ).toEqual([1, 4]);
  });

  it("maps stored ids to picker options, skipping unknown ones", () => {
    const options = [
      category(1, TransactionType.Out),
      category(4, TransactionType.Out),
    ];

    expect(selectCategoriesByIds(options, [4, 99]).map(({ id }) => id)).toEqual(
      [4],
    );
    expect(selectCategoriesByIds(options, undefined)).toEqual([]);
  });
});

describe("adjust points from the accounts list", () => {
  const listedCard = {
    id: 9,
    name: "Revolut",
    type: AccountType.Card,
    balance: 250,
    currency: null,
    user: null,
    deletedAt: null,
    rewardsName: "RevPoints",
    rewardsSpendUnit: 1,
    rewardsPointsPerUnit: 1,
    rewardsAdjustment: -20,
    rewardsBalance: 130,
  } as unknown as AccountDto;

  it("is offered only on live card accounts with rewards", () => {
    expect(canAdjustRewards(listedCard)).toBe(true);
    expect(
      canAdjustRewards({ ...listedCard, deletedAt: new Date() } as AccountDto),
    ).toBe(false);
    expect(
      canAdjustRewards({ ...listedCard, rewardsBalance: null } as AccountDto),
    ).toBe(false);
    expect(
      canAdjustRewards({
        ...listedCard,
        type: AccountType.Physical,
      } as AccountDto),
    ).toBe(false);
    expect(
      canAdjustRewards({ ...listedCard, rewardsSpendUnit: null } as AccountDto),
    ).toBe(false);
  });

  it("maps the listed account to the dialog data", () => {
    expect(accountToAdjustRewardsAccount(listedCard)).toEqual({
      id: 9,
      rewards: { name: "RevPoints", balance: 130, earned: 150 },
    });
    expect(
      accountToAdjustRewardsAccount({
        ...listedCard,
        rewardsName: null,
        rewardsAdjustment: null,
      } as AccountDto).rewards,
    ).toEqual({ name: null, balance: 130, earned: 130 });
  });
});
