import {
  InterestCompoundingFrequency,
  InterestDayCount,
  InterestPayoutFrequency,
  InterestRoundingMode,
  InterestRoundingStage,
} from "lib";

// types
import type { InterestPresetValues, InterestSelectFieldDef } from "./types";
import { InterestPresetId } from "./types";

export const INTEREST_PRESETS: Record<InterestPresetId, InterestPresetValues> =
  {
    // Revolut UK Instant Access Savings: daily accrual on ACT/365, paid daily
    // (credited the next day) and compounded daily, rounded at payout.
    [InterestPresetId.RevolutUkInstantAccess]: {
      interestDayCount: InterestDayCount.Act365,
      interestPayoutFrequency: InterestPayoutFrequency.Daily,
      interestPayoutDelayDays: 1,
      interestCompoundingFrequency: InterestCompoundingFrequency.Daily,
      interestRoundingStage: InterestRoundingStage.Payout,
      interestRoundingMode: InterestRoundingMode.HalfUp,
      interestRoundingScale: 2,
    },
  };

export const INTEREST_SELECT_FIELDS: InterestSelectFieldDef[] = [
  {
    name: "interestDayCount",
    i18nKey: "dayCount",
    enumObject: InterestDayCount,
  },
  {
    name: "interestPayoutFrequency",
    i18nKey: "payoutFrequency",
    enumObject: InterestPayoutFrequency,
  },
  {
    name: "interestCompoundingFrequency",
    i18nKey: "compoundingFrequency",
    enumObject: InterestCompoundingFrequency,
  },
  {
    name: "interestRoundingStage",
    i18nKey: "roundingStage",
    enumObject: InterestRoundingStage,
  },
  {
    name: "interestRoundingMode",
    i18nKey: "roundingMode",
    enumObject: InterestRoundingMode,
  },
];
