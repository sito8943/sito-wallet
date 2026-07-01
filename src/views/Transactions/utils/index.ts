import type { TFunction } from "i18next";

// @sito/dashboard-app
import { formatForDatetimeLocal, type Option } from "@sito/dashboard-app";

import type {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionDto,
  UpdateTransactionDto,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
} from "lib";
import {
  getPrimaryTransactionCategory,
  getTransactionCategories,
  normalizeSelectedTransactionCategories,
} from "lib";
import type {
  AssignTransactionAccountFormType,
  AssignTransactionCategoryFormType,
  TransactionFormType,
} from "../types";
import { TransactionAutoFilterMode } from "../types";

export const formToDto = ({
  account,
  categories,
  ...data
}: TransactionFormType): UpdateTransactionDto => {
  const normalizedCategories =
    normalizeSelectedTransactionCategories(categories);
  const primaryCategory = getPrimaryTransactionCategory({
    categories: normalizedCategories,
  });

  return {
    ...data,
    accountId: account?.id ?? 0,
    categoryIds: normalizedCategories.map((category) => category.id),
    ...(primaryCategory ? { type: primaryCategory.type } : {}),
  };
};

export const dtoToForm = (dto: TransactionDto): TransactionFormType => {
  const categories = getTransactionCategories(dto);

  return {
    ...dto,
    categories,
    accountId: dto.account?.id ?? 0,
    categoryIds: categories.map((category) => category.id),
    date: dto.date
      ? formatForDatetimeLocal(dto.date)
      : formatForDatetimeLocal(),
  };
};

export const addEmptyTransaction = (
  account: CommonAccountDto | null = null,
  categories: CommonTransactionCategoryDto[] = [],
): Omit<TransactionFormType, "id"> => ({
  auto: false,
  description: "",
  account,
  categories,
  amount: 0,
  date: formatForDatetimeLocal(),
});

export const emptyTransaction = (
  account: CommonAccountDto | null = null,
): TransactionFormType => ({
  id: 0,
  auto: false,
  description: "",
  account,
  categories: [],
  amount: 0,
  date: formatForDatetimeLocal(),
});

export const emptyAssignAccountForm = (): AssignTransactionAccountFormType => ({
  account: null,
  transactionIds: [],
});

export const assignAccountFormToDto = (
  form: AssignTransactionAccountFormType,
): AssignTransactionAccountDto => ({
  accountId: form.account?.id ?? 0,
  transactionIds: form.transactionIds ?? [],
});

export const emptyAssignCategoryForm =
  (): AssignTransactionCategoryFormType => ({
    categories: [],
    transactionIds: [],
  });

export const assignCategoryFormToDto = (
  form: AssignTransactionCategoryFormType,
): AssignTransactionCategoryDto => ({
  categoryIds: normalizeSelectedTransactionCategories(form.categories).map(
    (category) => category.id,
  ),
  transactionIds: form.transactionIds ?? [],
});

export const getTransactionAutoFilterMode = (
  value: unknown,
): TransactionAutoFilterMode => {
  if (value === TransactionAutoFilterMode.All || value === "all")
    return TransactionAutoFilterMode.All;
  if (value === true || value === "true") return TransactionAutoFilterMode.Auto;
  if (value === TransactionAutoFilterMode.Auto)
    return TransactionAutoFilterMode.Auto;
  if (value === false || value === "false")
    return TransactionAutoFilterMode.Manual;
  if (value === TransactionAutoFilterMode.Manual)
    return TransactionAutoFilterMode.Manual;
  return TransactionAutoFilterMode.Manual;
};

export const getTransactionAutoFilterOptions = (t: TFunction): Option[] =>
  [
    {
      id: TransactionAutoFilterMode.All,
      name: t("_pages:transactions.filters.auto.values.all"),
    },
    {
      id: TransactionAutoFilterMode.Auto,
      name: t("_pages:transactions.filters.auto.values.auto"),
    },
    {
      id: TransactionAutoFilterMode.Manual,
      name: t("_pages:transactions.filters.auto.values.manual"),
    },
  ] as Option[];

export * from "./weeklyTransactions";
