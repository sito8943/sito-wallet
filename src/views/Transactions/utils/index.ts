import type { TFunction } from "i18next";

// @sito/dashboard-app
import { formatForDatetimeLocal, type Option } from "@sito/dashboard-app";

import type {
  CommonAccountDto,
  CommonProductDto,
  CommonPurchaseProviderDto,
  ReceiptDraftDto,
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
  ReceiptFormValues,
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

/**
 * Option for a product typed in the form that doesn't exist yet. It has no id
 * (0) until the backend creates it when the transaction is saved.
 */
export const newProductOption = (name: string): CommonProductDto => ({
  id: 0,
  name,
  updatedAt: new Date(),
});

/** Option for a provider typed in the form that doesn't exist yet (id 0). */
export const newPurchaseProviderOption = (
  name: string,
): CommonPurchaseProviderDto => ({ id: 0, name, updatedAt: new Date() });

/** A provider without id is sent by name so the backend creates it. */
export const purchaseProviderToDto = (
  provider: CommonPurchaseProviderDto | null,
): { purchaseProviderId: number | null; purchaseProviderName?: string } =>
  provider && !provider.id
    ? { purchaseProviderId: null, purchaseProviderName: provider.name.trim() }
    : { purchaseProviderId: provider?.id ?? null };

export const transactionProductsFormToDto = (
  products: TransactionProductFormItem[] = [],
): TransactionProductInputDto[] =>
  products
    .filter((item) => item.product)
    .map((item) => ({
      ...(item.product?.id
        ? { productId: item.product.id }
        : { productName: item.product?.name.trim() }),
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

/** Translation keys of what a product row is missing; empty when complete. */
export const getTransactionProductErrorKeys = (
  item: TransactionProductFormItem,
): string[] => {
  const keys: string[] = [];
  if (!item.product)
    keys.push("_entities:transaction.products.product.required");

  const unitPrice = toOptionalNumber(item.unitPrice);
  if (unitPrice === undefined || unitPrice < 0) {
    keys.push("_entities:transaction.products.unitPrice.required");
  }
  return keys;
};

/** A product row can be saved once it has a product and a non-negative price. */
export const isTransactionProductComplete = (
  item: TransactionProductFormItem,
): boolean => getTransactionProductErrorKeys(item).length === 0;

/** Amount with two decimals in the user's locale (`14,35` / `14.35`). */
export const formatTransactionAmount = (value: number, language: string) =>
  new Intl.NumberFormat(language, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

/** Products total as a transaction amount (cents precision). */
export const getTransactionProductsAmount = (
  products: TransactionProductFormItem[] = [],
): number => Math.round(getTransactionProductsTotal(products) * 100) / 100;

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
    ...purchaseProviderToDto(purchaseProvider),
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

const normalizeName = (name: string) => name.trim().toLowerCase();

/** Catalog item with the same name, ignoring case and surrounding spaces. */
export const findByName = <TItem extends { name: string }>(
  items: TItem[],
  name: string,
): TItem | undefined =>
  items.find((item) => normalizeName(item.name) === normalizeName(name));

/**
 * Form values from a scanned receipt. Known provider/products are matched by
 * name; the rest become new options, created when the transaction is saved.
 * The date keeps the time already in the form (receipts are read by day).
 */
export const receiptDraftToForm = (
  draft: ReceiptDraftDto,
  catalog: {
    products: CommonProductDto[];
    purchaseProviders: CommonPurchaseProviderDto[];
    currentDate: string;
  },
): ReceiptFormValues => {
  const values: ReceiptFormValues = {};

  if (draft.total !== null) values.amount = draft.total;

  if (draft.date) {
    const time = catalog.currentDate.slice(11, 16) || "12:00";
    values.date = `${draft.date}T${time}`;
  }

  if (draft.providerName) {
    values.purchaseProvider =
      findByName(catalog.purchaseProviders, draft.providerName) ??
      newPurchaseProviderOption(draft.providerName);
  }

  if (draft.products.length) {
    values.products = draft.products.map((line) => ({
      product:
        findByName(catalog.products, line.name) ?? newProductOption(line.name),
      quantity: line.quantity ?? 1,
      unitPrice: line.unitPrice,
    }));
  }

  return values;
};

/** Translation key for a failed receipt scan (backend `receipt.*` codes). */
export const getReceiptScanErrorKey = (error: unknown): string => {
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String(error.message)
      : "";
  const code = /^receipt\.([a-zA-Z]+)$/.exec(message)?.[1];
  return `_pages:transactions.receipt.errors.${code ?? "generic"}`;
};
