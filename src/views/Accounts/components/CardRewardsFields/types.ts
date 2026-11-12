// types
import type { AccountFormPropsType } from "../../types";

export type CardRewardsFieldsPropsType = Pick<
  AccountFormPropsType,
  "control" | "setValue" | "isLoading"
>;

export type RewardsRoundingOption = {
  id: number | "";
  name: string;
};
