import { useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import type {
  FiltersValue,
  Option,
  SoftDeleteScope,
} from "@sito/dashboard-app";
import { useFormDialog, useTableOptions } from "@sito/dashboard-app";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import type {
  CommonTransactionCategoryDto,
  FilterTransactionDto,
  TransactionType,
} from "lib";
import { normalizeListFilters } from "lib";

// types
import { DEFAULT_SORTING_BY, DEFAULT_SORTING_ORDER } from "./constants";
import { parseSortOrder } from "./utils";
import {
  TransactionAutoFilterMode,
  type TransactionsMobileFiltersDialogPropsType,
  type TransactionsMobileFiltersFormType,
} from "views/Transactions/types";
import {
  getTransactionAutoFilterMode,
  getTransactionAutoFilterOptions,
} from "views/Transactions/utils";

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
  } = useTableOptions<keyof FilterTransactionDto & string>();

  const queryClient = useQueryClient();
  const autoFilterOptions = useMemo(
    () => getTransactionAutoFilterOptions(t),
    [t],
  );

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
      auto: getTransactionAutoFilterMode(filters.auto),
      dateStart: parsedDate.start ?? "",
      dateEnd: parsedDate.end ?? "",
      softDeleteScope: parsedSoftDeleteScope,
      deletedAtStart: hideDeletedEntities ? "" : (parsedDeletedAt.start ?? ""),
      deletedAtEnd: hideDeletedEntities ? "" : (parsedDeletedAt.end ?? ""),
      sortingBy: sortingBy || DEFAULT_SORTING_BY,
      sortingOrder: parseSortOrder(sortingOrder),
    }),
    [
      selectedCategories,
      filters.type,
      filters.description,
      filters.amount,
      filters.auto,
      parsedDate.start,
      parsedDate.end,
      parsedSoftDeleteScope,
      hideDeletedEntities,
      parsedDeletedAt.start,
      parsedDeletedAt.end,
      sortingBy,
      sortingOrder,
    ],
  );

  const formDialog = useFormDialog<
    TransactionsMobileFiltersFormType,
    TransactionsMobileFiltersFormType
  >({
    mode: "state",
    defaultValues,
    onSubmit: (values) => {
      clearFilters();

      const nextFilters: FiltersValue<keyof FilterTransactionDto & string> = {};
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

      nextFilters.auto = {
        value:
          values.auto === TransactionAutoFilterMode.All
            ? TransactionAutoFilterMode.All
            : values.auto === TransactionAutoFilterMode.Auto,
      };

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
      void queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
      onClose();
    },
    title: t("_accessibility:buttons.filters"),
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
    autoFilterOptions,
    categories,
    hideDeletedEntities,
    open,
    handleClose: onClose,
    handleClear,
  };
}
