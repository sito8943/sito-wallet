import { CommonTransactionCategoryDto } from "../transactionCategory";
import { TransactionDto } from "./TransactionDto";

const parseCategoryArray = (
  categories: CommonTransactionCategoryDto[] | null | undefined,
): CommonTransactionCategoryDto[] => {
  if (!Array.isArray(categories)) return [];

  const seenIds = new Set<number>();
  return categories.filter((category) => {
    if (!category) return false;
    if (seenIds.has(category.id)) return false;

    seenIds.add(category.id);
    return true;
  });
};

export const getTransactionCategories = (
  transaction:
    | Pick<TransactionDto, "categories" | "category">
    | null
    | undefined,
): CommonTransactionCategoryDto[] => {
  if (!transaction) return [];

  const nextCategories = parseCategoryArray(transaction.categories);
  if (nextCategories.length) return nextCategories;

  return transaction.category ? [transaction.category] : [];
};

export const getPrimaryTransactionCategory = (
  transaction:
    | Pick<TransactionDto, "categories" | "category">
    | null
    | undefined,
): CommonTransactionCategoryDto | null =>
  getTransactionCategories(transaction)[0] ?? null;

export const hasMixedTransactionCategoryTypes = (
  categories: CommonTransactionCategoryDto[] | null | undefined,
): boolean => {
  const nextCategories = parseCategoryArray(categories);
  if (nextCategories.length <= 1) return false;

  const firstType = nextCategories[0]?.type;
  return nextCategories.some((category) => category.type !== firstType);
};

export const normalizeSelectedTransactionCategories = (
  categories: CommonTransactionCategoryDto[] | null | undefined,
): CommonTransactionCategoryDto[] => {
  const nextCategories = parseCategoryArray(categories);
  if (!nextCategories.length) return [];

  const firstType = nextCategories[0].type;
  return nextCategories.filter((category) => category.type === firstType);
};
