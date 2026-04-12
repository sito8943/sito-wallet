// @sito/dashboard-app
import { formatForDatetimeLocal } from "@sito/dashboard-app";

import {
  CommonAccountDto,
  TransactionDto,
  UpdateTransactionDto,
  AssignTransactionAccountDto,
  AssignTransactionCategoryDto,
  getPrimaryTransactionCategory,
  getTransactionCategories,
  normalizeSelectedTransactionCategories,
} from "lib";
import {
  AssignTransactionAccountFormType,
  AssignTransactionCategoryFormType,
  TransactionFormType,
} from "../types";

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
    date: dto.date ? formatForDatetimeLocal(dto.date) : formatForDatetimeLocal(),
  };
};

export const addEmptyTransaction = (
  account: CommonAccountDto | null = null,
): Omit<TransactionFormType, "id"> => ({
  auto: false,
  description: "",
  account,
  categories: [],
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
