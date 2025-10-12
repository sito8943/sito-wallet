import { TransactionType, UpdateDashboardCardConfigDto } from "lib";
import { TypeResumeTypeFormType } from "./types";

export const formToDto = (
  data: TypeResumeTypeFormType
): UpdateDashboardCardConfigDto => {
  const parsedAccount = data.accounts?.map((account) => account.id) ?? [];
  const parsedCategory = data.category?.map((category) => category.id) ?? [];
  const stringified = JSON.stringify({
    account: parsedAccount,
    category: parsedCategory,
    type: data.type ?? TransactionType.Out,
    date: data.date,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
