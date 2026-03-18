import { UpdateDashboardCardConfigDto } from "lib";
import { CurrentBalanceFormType } from "./types";

export const formToDto = (
  data: CurrentBalanceFormType
): UpdateDashboardCardConfigDto => {
  const stringified = JSON.stringify({
    account: data.account,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
