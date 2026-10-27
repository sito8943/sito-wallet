import type { AccountInterestConfigDto } from "lib";

// types
import type { AccountFormPropsType } from "../../types";

export type SavingsInterestFieldsPropsType = Pick<
  AccountFormPropsType,
  "control" | "setValue" | "isLoading"
>;

/** Known bank products whose interest mechanics we can prefill. */
export enum InterestPresetId {
  RevolutInstantAccess = "revolutInstantAccess",
}

/**
 * Interest mechanics a preset fills in. Rates are deliberately excluded: they
 * change over time and must be entered by the user.
 */
export type InterestPresetValues = Required<
  Omit<AccountInterestConfigDto, "interestRate" | "aer">
>;

/** Enum-backed interest fields rendered as selects. */
export type InterestSelectFieldName =
  | "interestDayCount"
  | "interestPayoutFrequency"
  | "interestCompoundingFrequency"
  | "interestRoundingStage"
  | "interestRoundingMode";

export type InterestSelectFieldDef = {
  name: InterestSelectFieldName;
  /** Translation base under `_entities:account.interest`. */
  i18nKey: string;
  enumObject: Record<string, string | number>;
};

export type InterestSelectOption = {
  id: number | "";
  name: string;
};
