import type { AccountBankName } from "./AccountBankName";
import { ACCOUNT_BANK_NAME } from "./AccountBankName";
import type { AccountRewardsConfigDto } from "./AccountRewardsConfigDto";
import { RewardsRounding } from "./RewardsRounding";

/**
 * Earning mechanics a bank plan fills into the account form. Point value and
 * start date are personal, so presets never touch them.
 */
export type AccountRewardsPresetValues = Required<
  Pick<
    AccountRewardsConfigDto,
    | "rewardsName"
    | "rewardsSpendUnit"
    | "rewardsPointsPerUnit"
    | "rewardsRounding"
  >
>;

export type AccountRewardsPlanPreset = {
  /** Stable id within the bank, e.g. "premium". */
  id: string;
  /** Plan brand name (not translated), e.g. "Premium". */
  label: string;
  values: AccountRewardsPresetValues;
};

/** Shared mechanics of every Revolut plan (only the spend unit changes). */
const REVOLUT_REWARDS: Omit<AccountRewardsPresetValues, "rewardsSpendUnit"> = {
  rewardsName: "RevPoints",
  rewardsPointsPerUnit: 1,
  rewardsRounding: RewardsRounding.FloorPerTransaction,
};

/**
 * Known rewards plans per bank. Banks without an entry are configured by hand;
 * add new banks here to offer their plans in the account form.
 */
export const ACCOUNT_REWARDS_PRESETS: Partial<
  Record<AccountBankName, AccountRewardsPlanPreset[]>
> = {
  [ACCOUNT_BANK_NAME.REVOLUT]: [
    {
      id: "standard",
      label: "Standard",
      values: { ...REVOLUT_REWARDS, rewardsSpendUnit: 10 },
    },
    {
      id: "plus",
      label: "Plus",
      values: { ...REVOLUT_REWARDS, rewardsSpendUnit: 10 },
    },
    {
      id: "premium",
      label: "Premium",
      values: { ...REVOLUT_REWARDS, rewardsSpendUnit: 4 },
    },
    {
      id: "metal",
      label: "Metal",
      values: { ...REVOLUT_REWARDS, rewardsSpendUnit: 2 },
    },
    {
      id: "ultra",
      label: "Ultra",
      values: { ...REVOLUT_REWARDS, rewardsSpendUnit: 1 },
    },
  ],
};
