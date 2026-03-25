import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import {
  AutocompleteInput,
  Button,
  FormDialog,
  Option,
  SelectInput,
  SortOrder,
  TextInput,
  useFormDialog,
  useTableOptions,
} from "@sito/dashboard-app";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import { CommonTransactionCategoryDto, TransactionType } from "lib";

// utils
import { getTransactionTypeOptions } from "./Containers/transactionColumns";

type TransactionsMobileFiltersProps = {
  open: boolean;
  onClose: () => void;
  categories: CommonTransactionCategoryDto[];
};

type TransactionsMobileFiltersFormType = {
  category: Option[];
  type: string;
  description: string;
  amount: string;
  dateStart: string;
  dateEnd: string;
  sortingBy: string;
  sortingOrder: SortOrder;
};

const DEFAULT_SORTING_BY = "date";
const DEFAULT_SORTING_ORDER = SortOrder.DESC;

const parseSortOrder = (value: unknown): SortOrder => {
  const parsed = String(value ?? "").toUpperCase();
  return parsed === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;
};

export const TransactionsMobileFilters = (
  props: TransactionsMobileFiltersProps,
) => {
  const { open, onClose, categories } = props;

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

  const typeOptions = useMemo(() => getTransactionTypeOptions(t), [t]);

  const sortingByOptions = useMemo(
    () =>
      [
        {
          id: "date",
          value: "date",
          name: t("_entities:transaction.date.label"),
        },
        {
          id: "amount",
          value: "amount",
          name: t("_entities:transaction.amount.label"),
        },
        {
          id: "description",
          value: "description",
          name: t("_entities:base.description.label"),
        },
      ] as Option[],
    [t],
  );

  const sortingOrderOptions = useMemo(
    () =>
      [
        {
          id: SortOrder.DESC,
          value: SortOrder.DESC,
          name: t("_pages:transactions.mobileFilters.order.desc"),
        },
        {
          id: SortOrder.ASC,
          value: SortOrder.ASC,
          name: t("_pages:transactions.mobileFilters.order.asc"),
        },
      ] as Option[],
    [t],
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

  const defaultValues = useMemo<TransactionsMobileFiltersFormType>(
    () => ({
      category: selectedCategories,
      type: filters?.type != null ? String(filters.type) : "",
      description: filters?.description ? String(filters.description) : "",
      amount: filters?.amount != null ? String(filters.amount) : "",
      dateStart: parsedDate.start ?? "",
      dateEnd: parsedDate.end ?? "",
      sortingBy: sortingBy || DEFAULT_SORTING_BY,
      sortingOrder: parseSortOrder(sortingOrder),
    }),
    [
      filters?.amount,
      filters?.description,
      filters?.type,
      parsedDate.end,
      parsedDate.start,
      selectedCategories,
      sortingBy,
      sortingOrder,
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

      if (
        values.amount !== "" &&
        !Number.isNaN(Number(values.amount))
      ) {
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

      onFilterApply(nextFilters);
      setSortingBy(values.sortingBy || DEFAULT_SORTING_BY);
      setSortingOrder(parseSortOrder(values.sortingOrder));
      setCurrentPage(0);

      return values;
    },
    onSuccess: () => onClose(),
    title: t("_accessibility:buttons.filters"),
    ...TransactionsQueryKeys.all(),
  });

  const { control } = formDialog;

  const handleClear = () => {
    clearFilters();
    setSortingBy(DEFAULT_SORTING_BY);
    setSortingOrder(DEFAULT_SORTING_ORDER);
    setCurrentPage(0);
    onClose();
  };

  return (
    <FormDialog {...formDialog} open={open} handleClose={onClose}>
      <div className="flex flex-col gap-3">
        <Controller
          control={control}
          name="category"
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              id="mobile-transaction-category-filter"
              label={t("_entities:transaction.category.label")}
              placeholder={t("_entities:transaction.category.placeholder")}
              options={categoryOptions}
              value={value ?? []}
              onChange={(nextValue) => onChange(nextValue)}
              multiple
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              id="mobile-transaction-type-filter"
              label={t("_entities:transactionCategory.type.label")}
              value={value ?? ""}
              onChange={(event) =>
                onChange((event.target as HTMLSelectElement).value)
              }
              options={[
                {
                  id: "",
                  value: "",
                  name: t("_pages:transactions.mobileFilters.any"),
                },
                ...typeOptions,
              ]}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field: { value, onChange, ...rest } }) => (
            <TextInput
              id="mobile-transaction-description-filter"
              label={t("_entities:base.description.label")}
              placeholder={t("_entities:base.description.placeholder")}
              value={value ?? ""}
              onChange={(event) =>
                onChange((event.target as HTMLInputElement).value)
              }
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="amount"
          render={({ field: { value, onChange, ...rest } }) => (
            <TextInput
              id="mobile-transaction-amount-filter"
              type="number"
              label={t("_entities:transaction.amount.label")}
              placeholder={t("_entities:transaction.amount.placeholder")}
              value={value ?? ""}
              onChange={(event) =>
                onChange((event.target as HTMLInputElement).value)
              }
              {...rest}
            />
          )}
        />
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={control}
            name="dateStart"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="mobile-transaction-date-start-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.start")}
                value={value ?? ""}
                onChange={(event) =>
                  onChange((event.target as HTMLInputElement).value)
                }
                {...rest}
              />
            )}
          />
          <Controller
            control={control}
            name="dateEnd"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="mobile-transaction-date-end-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.end")}
                value={value ?? ""}
                onChange={(event) =>
                  onChange((event.target as HTMLInputElement).value)
                }
                {...rest}
              />
            )}
          />
        </div>
        <Controller
          control={control}
          name="sortingBy"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              id="mobile-transaction-sort-by"
              label={t("_pages:transactions.mobileFilters.sortBy")}
              value={value ?? DEFAULT_SORTING_BY}
              onChange={(event) =>
                onChange((event.target as HTMLSelectElement).value)
              }
              options={sortingByOptions}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="sortingOrder"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              id="mobile-transaction-sort-order"
              label={t("_pages:transactions.mobileFilters.sortOrder")}
              value={value ?? DEFAULT_SORTING_ORDER}
              onChange={(event) =>
                onChange(parseSortOrder((event.target as HTMLSelectElement).value))
              }
              options={sortingOrderOptions}
              {...rest}
            />
          )}
        />
        <Button type="button" variant="outlined" onClick={handleClear}>
          {t("_accessibility:buttons.clear")}
        </Button>
      </div>
    </FormDialog>
  );
};

export default TransactionsMobileFilters;
