import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import {
  Option,
  SoftDeleteScope,
  SortOrder,
  useFormDialog,
  useTableOptions,
} from "@sito/dashboard-app";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import {
  CommonTransactionCategoryDto,
  TransactionType,
  normalizeListFilters,
} from "lib";

// types
import {
  TransactionsMobileFiltersDialogPropsType,
  TransactionsMobileFiltersFormType,
} from "../types";

export const DEFAULT_SORTING_BY = "date";
export const DEFAULT_SORTING_ORDER = SortOrder.DESC;

const parseSortOrder = (value: unknown): SortOrder => {
  const parsed = String(value ?? "").toUpperCase();
  return parsed === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;
};

export function useTransactionsMobileFiltersDialog(
  categories: CommonTransactionCategoryDto[],
  hideDeletedEntities: boolean,
  open: boolean,
  onClose: () => void,
): TransactionsMobileFiltersDialogPropsType {
  const { t } = useTranslation();

  const {
    filters,
    sortingBy,
    sortingOrder,
    onFilterApply,
    clearFilters,
    setSortingBy,
    setSortingOrder,
    setCurrentPage,
  } = useTableOptions();

  const categoryOptions = useMemo(
    () =>
      (categories?.map((category) => ({
        id: category.id,
        value: category.id,
        name: category.name,
      })) ?? []) as Option[],
    [categories],
  );

  const parsedCategoryIds = Array.isArray(filters?.category)
    ? filters.category.map((id: unknown) => Number(id))
    : [];

  const selectedCategories = categoryOptions.filter((option) =>
    parsedCategoryIds.includes(Number(option.id)),
  );

  const parsedDate = (filters?.date ?? {}) as {
    start?: string;
    end?: string;
  };

  const normalizedFilters = useMemo(
    () => normalizeListFilters(filters),
    [filters],
  );

  const parsedDeletedAt = (normalizedFilters.deletedAt ?? {}) as {
    start?: string;
    end?: string;
  };

  const parsedSoftDeleteScope = hideDeletedEntities
    ? "ACTIVE"
    : ((normalizedFilters.softDeleteScope as SoftDeleteScope | undefined) ??
      "ACTIVE");

  const defaultValues = useMemo<TransactionsMobileFiltersFormType>(
    () => ({
      category: selectedCategories,
      type: filters?.type != null ? String(filters.type) : "",
      description: filters?.description ? String(filters.description) : "",
      amount: filters?.amount != null ? String(filters.amount) : "",
      dateStart: parsedDate.start ?? "",
      dateEnd: parsedDate.end ?? "",
      softDeleteScope: parsedSoftDeleteScope,
      deletedAtStart: hideDeletedEntities ? "" : (parsedDeletedAt.start ?? ""),
      deletedAtEnd: hideDeletedEntities ? "" : (parsedDeletedAt.end ?? ""),
      sortingBy: sortingBy || DEFAULT_SORTING_BY,
      sortingOrder: parseSortOrder(sortingOrder),
    }),
    [
      filters?.amount,
      filters?.description,
      filters?.type,
      parsedDate.end,
      parsedDate.start,
      parsedDeletedAt.end,
      parsedDeletedAt.start,
      parsedSoftDeleteScope,
      selectedCategories,
      sortingBy,
      sortingOrder,
      hideDeletedEntities,
    ],
  );

  const formDialog = useFormDialog<
    TransactionsMobileFiltersFormType,
    TransactionsMobileFiltersFormType,
    TransactionsMobileFiltersFormType,
    TransactionsMobileFiltersFormType
  >({
    defaultValues,
    mutationFn: async (values) => {
      clearFilters();

      const nextFilters: Record<string, { value: unknown }> = {};
      const selectedCategoryValues = Array.isArray(values.category)
        ? values.category
        : [];

      if (selectedCategoryValues.length > 0) {
        nextFilters.category = {
          value: selectedCategoryValues.map((option) => Number(option.id)),
        };
      }

      if (values.type !== "") {
        nextFilters.type = { value: Number(values.type) as TransactionType };
      }

      if (values.description.trim().length > 0) {
        nextFilters.description = { value: values.description.trim() };
      }

      if (values.amount !== "" && !Number.isNaN(Number(values.amount))) {
        nextFilters.amount = { value: Number(values.amount) };
      }

      if (values.dateStart || values.dateEnd) {
        nextFilters.date = {
          value: {
            start: values.dateStart || undefined,
            end: values.dateEnd || undefined,
          },
        };
      }

      nextFilters.softDeleteScope = {
        value: hideDeletedEntities ? "ACTIVE" : values.softDeleteScope,
      };

      if (
        !hideDeletedEntities &&
        values.softDeleteScope === "DELETED" &&
        (values.deletedAtStart || values.deletedAtEnd)
      ) {
        nextFilters.deletedAt = {
          value: {
            start: values.deletedAtStart || undefined,
            end: values.deletedAtEnd || undefined,
          },
        };
      }

      onFilterApply(nextFilters);
      setSortingBy(values.sortingBy || DEFAULT_SORTING_BY);
      setSortingOrder(parseSortOrder(values.sortingOrder));
      setCurrentPage(0);

      return values;
    },
    title: t("_accessibility:buttons.filters"),
    ...TransactionsQueryKeys.all(),
  });

  const handleClear = () => {
    clearFilters();
    setSortingBy(DEFAULT_SORTING_BY);
    setSortingOrder(DEFAULT_SORTING_ORDER);
    setCurrentPage(0);
    onClose();
  };

  return {
    ...formDialog,
    categories,
    hideDeletedEntities,
    open,
    handleClose: onClose,
    handleClear,
  };
}
