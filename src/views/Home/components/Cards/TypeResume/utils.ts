import { TransactionType, UpdateDashboardCardConfigDto } from "lib";
import { TypeResumeTypeFormType } from "./types";

export const formToDto = (
  data: TypeResumeTypeFormType
): UpdateDashboardCardConfigDto => {
  const parsedAccounts = data.accounts?.map((account) => account.id) ?? [];
  const parsedCategories =
    data.categories?.map((category) => category.id) ?? [];
  const stringified = JSON.stringify({
    accounts: parsedAccounts,
    categories: parsedCategories,
    type: data.type ?? TransactionType.Out,
    date: data.date,
  });
  return {
    userId: data.userId,
    id: data.id,
    config: stringified,
  };
};
