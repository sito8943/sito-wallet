import { UpdateDashboardCardConfigDto } from "lib";
import { WeeklySpentFormType } from "./types";

export const formToDto = (
  data: WeeklySpentFormType
): UpdateDashboardCardConfigDto => {
  const parsedAccount = data.accounts?.map((account) => account.id) ?? [];
  const stringified = JSON.stringify({
    account: parsedAccount,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};

