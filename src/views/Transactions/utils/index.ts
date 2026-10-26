import type { TFunction } from "i18next";

// @sito/dashboard-app
import { formatForDatetimeLocal, type Option } from "@sito/dashboard-app";

import type {
  CommonAccountDto,
  CommonTransactionCategoryDto,
  TransactionDto,
  TransactionProductDto,
  TransactionProductInputDto,
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
  TransactionProductFormItem,
} from "../types";
import { TransactionAutoFilterMode } from "../types";

const toOptionalNumber = (value: number | string): number | undefined => {
  if (value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

export const emptyTransactionProduct = (): TransactionProductFormItem => ({
  product: null,
  quantity: 1,
  unitPrice: "",
});

export const transactionProductsToForm = (
  products: TransactionProductDto[] = [],
): TransactionProductFormItem[] =>
  products.map(({ product, quantity, unitPrice }) => ({
    product,
    quantity,
    unitPrice,
  }));

export const transactionProductsFormToDto = (
  products: TransactionProductFormItem[] = [],
): TransactionProductInputDto[] =>
  products
    .filter((item) => item.product)
    .map((item) => ({
      productId: item.product?.id ?? 0,
      quantity: toOptionalNumber(item.quantity),
      unitPrice: toOptionalNumber(item.unitPrice) ?? 0,
    }));

export const getTransactionProductsTotal = (
  products: TransactionProductFormItem[] = [],
): number =>
  products.reduce(
    (total, item) =>
      total +
      (toOptionalNumber(item.quantity) ?? 1) *
        (toOptionalNumber(item.unitPrice) ?? 0),
    0,
  );

export const formToDto = ({
  account,
  categories,
  purchaseProvider,
  products,
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
    purchaseProviderId: purchaseProvider?.id ?? null,
    products: transactionProductsFormToDto(products),
  };
};

export const dtoToForm = (dto: TransactionDto): TransactionFormType => {
  const categories = getTransactionCategories(dto);

  return {
    ...dto,
    categories,
    purchaseProvider: dto.purchaseProvider ?? null,
    products: transactionProductsToForm(dto.products),
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
  purchaseProvider: null,
  products: [],
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
  purchaseProvider: null,
  products: [],
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
