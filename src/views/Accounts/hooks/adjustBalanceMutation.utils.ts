import type { AdjustBalanceDto } from "lib";

import type { AdjustBalanceFormType } from "../types";

export const adjustBalanceDefaultValues: AdjustBalanceFormType = {
  newBalance: "",
  description: "",
};

export const adjustBalanceFormToDto = (
  data: AdjustBalanceFormType,
): AdjustBalanceDto => ({
  newBalance: Number(data.newBalance),
  description: data.description || undefined,
});
