import type { AdjustRewardsDto } from "lib";
import {
  AdjustRewardsMode,
  parseNullableNumber,
  toAdjustRewardsDto,
} from "lib";

import type { AdjustRewardsFormType } from "../types";

export const adjustRewardsDefaultValues: AdjustRewardsFormType = {
  mode: AdjustRewardsMode.Delta,
  amount: "",
};

export const adjustRewardsFormToDto = (
  data: AdjustRewardsFormType,
): AdjustRewardsDto =>
  toAdjustRewardsDto(data.mode, parseNullableNumber(data.amount) ?? 0);
