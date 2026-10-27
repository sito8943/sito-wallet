import { describe, expect, it } from "vitest";

import type { AccountFormType } from "../types";
import { AccountType } from "lib/entities/account/AccountType";
import { InterestCompoundingFrequency } from "lib/entities/account/InterestCompoundingFrequency";
import { InterestDayCount } from "lib/entities/account/InterestDayCount";
import { InterestPayoutFrequency } from "lib/entities/account/InterestPayoutFrequency";
import { InterestRoundingMode } from "lib/entities/account/InterestRoundingMode";
import { InterestRoundingStage } from "lib/entities/account/InterestRoundingStage";

import {
  EMPTY_INTEREST_CONFIG,
  formToAddDto,
  formToUpdateDto,
  normalizeInterestConfig,
} from "../utils";
import { INTEREST_PRESETS } from "../components/SavingsInterestFields/constants";
import { InterestPresetId } from "../components/SavingsInterestFields/types";
import {
  getInterestPresetEntries,
  numericEnumEntries,
} from "../components/SavingsInterestFields/utils";

const savingForm: AccountFormType = {
  id: 7,
  name: "Revolut savings",
  description: "",
  balance: 1000,
  type: AccountType.Saving,
  currency: { id: 3, name: "GBP", symbol: "£" },
  userId: 1,
  interestRate: "2.86",
  aer: "2.90",
  interestDayCount: "0",
  interestPayoutFrequency: "0",
  interestPayoutDelayDays: "1",
  interestCompoundingFrequency: "0",
  interestRoundingStage: "1",
  interestRoundingMode: "0",
  interestRoundingScale: "2",
};

describe("normalizeInterestConfig", () => {
  it("coerces raw form strings to numbers for saving accounts", () => {
    expect(normalizeInterestConfig(AccountType.Saving, savingForm)).toEqual({
      interestRate: 2.86,
      aer: 2.9,
      interestDayCount: InterestDayCount.Act365,
      interestPayoutFrequency: InterestPayoutFrequency.Daily,
      interestPayoutDelayDays: 1,
      interestCompoundingFrequency: InterestCompoundingFrequency.Daily,
      interestRoundingStage: InterestRoundingStage.Payout,
      interestRoundingMode: InterestRoundingMode.HalfUp,
      interestRoundingScale: 2,
    });
  });

  it("accepts the type as the raw select string", () => {
    expect(normalizeInterestConfig("2", savingForm).interestRate).toBe(2.86);
  });

  it("maps blank values (the 'default' select option) to null", () => {
    const result = normalizeInterestConfig(AccountType.Saving, {
      interestRate: "1.5",
      aer: "",
      interestDayCount: "",
      interestPayoutDelayDays: null,
    });

    expect(result).toEqual({ ...EMPTY_INTEREST_CONFIG, interestRate: 1.5 });
  });

  it("clears every interest field for non-saving accounts", () => {
    expect(normalizeInterestConfig(AccountType.Card, savingForm)).toEqual(
      EMPTY_INTEREST_CONFIG,
    );
    expect(normalizeInterestConfig(AccountType.Physical, savingForm)).toEqual(
      EMPTY_INTEREST_CONFIG,
    );
  });
});

describe("account form → DTO", () => {
  it("sends numeric type and interest config for saving accounts", () => {
    const dto = formToUpdateDto({ ...savingForm, type: "2" as never });

    expect(dto.type).toBe(AccountType.Saving);
    expect(dto.interestRate).toBe(2.86);
    expect(dto.interestRoundingScale).toBe(2);
    expect(dto.currencyId).toBe(3);
  });

  it("clears interest config when the type is switched away from saving", () => {
    const dto = formToAddDto({ ...savingForm, type: AccountType.Physical });

    expect(dto.type).toBe(AccountType.Physical);
    expect(dto).toMatchObject(EMPTY_INTEREST_CONFIG);
  });

  it("keeps the bank on saving accounts and drops it on physical ones", () => {
    const withBank = { ...savingForm, bankName: "revolut" };

    expect(formToAddDto(withBank).bankName).toBe("revolut");
    expect(
      formToAddDto({ ...withBank, type: AccountType.Physical }).bankName,
    ).toBeUndefined();
  });
});

describe("interest presets", () => {
  it("Revolut Instant Access fills the mechanics but not the rates", () => {
    const preset = INTEREST_PRESETS[InterestPresetId.RevolutInstantAccess];

    expect(preset).toEqual({
      interestDayCount: InterestDayCount.Act365,
      interestPayoutFrequency: InterestPayoutFrequency.Daily,
      interestPayoutDelayDays: 1,
      interestCompoundingFrequency: InterestCompoundingFrequency.None,
      interestRoundingStage: InterestRoundingStage.Payout,
      interestRoundingMode: InterestRoundingMode.HalfUp,
      interestRoundingScale: 2,
    });
    expect(preset).not.toHaveProperty("interestRate");
    expect(preset).not.toHaveProperty("aer");
  });

  it("matches the contract's int values", () => {
    expect(
      Object.fromEntries(
        getInterestPresetEntries(InterestPresetId.RevolutInstantAccess),
      ),
    ).toEqual({
      interestDayCount: 0,
      interestPayoutFrequency: 0,
      interestPayoutDelayDays: 1,
      interestCompoundingFrequency: 4,
      interestRoundingStage: 1,
      interestRoundingMode: 0,
      interestRoundingScale: 2,
    });
  });
});

describe("numericEnumEntries", () => {
  it("returns only the numeric members of a TS enum", () => {
    expect(numericEnumEntries(InterestCompoundingFrequency)).toEqual([
      { key: "Daily", value: 0 },
      { key: "Monthly", value: 1 },
      { key: "Quarterly", value: 2 },
      { key: "Annually", value: 3 },
      { key: "None", value: 4 },
    ]);
  });
});
