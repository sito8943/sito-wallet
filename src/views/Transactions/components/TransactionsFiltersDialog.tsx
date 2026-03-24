import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard
import {
  AutocompleteInput,
  Dialog,
  DialogActions,
  Option,
  SelectInput,
  SortOrder,
  TextInput,
  useTableOptions,
} from "@sito/dashboard-app";

// lib
import { CommonTransactionCategoryDto, TransactionType } from "lib";

// utils
import { getTransactionTypeOptions } from "./Containers/transactionColumns";

type TransactionsMobileFiltersProps = {
  open: boolean;
  onClose: () => void;
  categories: CommonTransactionCategoryDto[];
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

  const [category, setCategory] = useState<Option | Option[] | null>(
    selectedCategories,
  );
  const [type, setType] = useState<string>(
    filters?.type != null ? String(filters.type) : "",
  );
  const [description, setDescription] = useState<string>(
    filters?.description ? String(filters.description) : "",
  );
  const [amount, setAmount] = useState<string>(
    filters?.amount != null ? String(filters.amount) : "",
  );
  const [dateStart, setDateStart] = useState<string>(parsedDate.start ?? "");
  const [dateEnd, setDateEnd] = useState<string>(parsedDate.end ?? "");
  const [mobileSortingBy, setMobileSortingBy] = useState<string>(
    sortingBy || DEFAULT_SORTING_BY,
  );
  const [mobileSortingOrder, setMobileSortingOrder] = useState<SortOrder>(
    parseSortOrder(sortingOrder),
  );

  const handleApply = () => {
    clearFilters();

    const nextFilters: Record<string, { value: unknown }> = {};
    const selectedCategories = Array.isArray(category)
      ? category
      : category
        ? [category]
        : [];

    if (selectedCategories.length > 0) {
      nextFilters.category = {
        value: selectedCategories.map((option) => Number(option.id)),
      };
    }

    if (type !== "") {
      nextFilters.type = { value: Number(type) as TransactionType };
    }

    if (description.trim().length > 0) {
      nextFilters.description = { value: description.trim() };
    }

    if (amount !== "" && !Number.isNaN(Number(amount))) {
      nextFilters.amount = { value: Number(amount) };
    }

    if (dateStart || dateEnd) {
      nextFilters.date = {
        value: {
          start: dateStart || undefined,
          end: dateEnd || undefined,
        },
      };
    }

    onFilterApply(nextFilters);
    setSortingBy(mobileSortingBy || DEFAULT_SORTING_BY);
    setSortingOrder(parseSortOrder(mobileSortingOrder));
    setCurrentPage(0);
    onClose();
  };

  const handleClear = () => {
    clearFilters();
    setSortingBy(DEFAULT_SORTING_BY);
    setSortingOrder(DEFAULT_SORTING_ORDER);
    setCurrentPage(0);
    onClose();
  };

  return (
    <Dialog
      open={open}
      title={t("_accessibility:buttons.filters")}
      handleClose={onClose}
    >
      <div className="flex flex-col gap-3">
        <AutocompleteInput
          id="mobile-transaction-category-filter"
          name="mobile-transaction-category-filter"
          label={t("_entities:transaction.category.label")}
          placeholder={t("_entities:transaction.category.placeholder")}
          options={categoryOptions}
          value={category}
          onChange={(value) => setCategory(value)}
          multiple
        />
        <SelectInput
          id="mobile-transaction-type-filter"
          name="mobile-transaction-type-filter"
          label={t("_entities:transactionCategory.type.label")}
          value={type}
          onChange={(event) =>
            setType((event.target as HTMLSelectElement).value)
          }
          options={[
            {
              id: "",
              value: "",
              name: t("_pages:transactions.mobileFilters.any"),
            },
            ...typeOptions,
          ]}
        />
        <TextInput
          id="mobile-transaction-description-filter"
          name="mobile-transaction-description-filter"
          label={t("_entities:base.description.label")}
          placeholder={t("_entities:base.description.placeholder")}
          value={description}
          onChange={(event) =>
            setDescription((event.target as HTMLInputElement).value)
          }
        />
        <TextInput
          id="mobile-transaction-amount-filter"
          name="mobile-transaction-amount-filter"
          type="number"
          label={t("_entities:transaction.amount.label")}
          placeholder={t("_entities:transaction.amount.placeholder")}
          value={amount}
          onChange={(event) =>
            setAmount((event.target as HTMLInputElement).value)
          }
        />
        <div className="grid grid-cols-2 gap-2">
          <TextInput
            id="mobile-transaction-date-start-filter"
            name="mobile-transaction-date-start-filter"
            type="date"
            label={t("_accessibility:components.table.filters.range.start")}
            value={dateStart}
            onChange={(event) =>
              setDateStart((event.target as HTMLInputElement).value)
            }
          />
          <TextInput
            id="mobile-transaction-date-end-filter"
            name="mobile-transaction-date-end-filter"
            type="date"
            label={t("_accessibility:components.table.filters.range.end")}
            value={dateEnd}
            onChange={(event) =>
              setDateEnd((event.target as HTMLInputElement).value)
            }
          />
        </div>
        <SelectInput
          id="mobile-transaction-sort-by"
          name="mobile-transaction-sort-by"
          label={t("_pages:transactions.mobileFilters.sortBy")}
          value={mobileSortingBy}
          onChange={(event) =>
            setMobileSortingBy((event.target as HTMLSelectElement).value)
          }
          options={sortingByOptions}
        />
        <SelectInput
          id="mobile-transaction-sort-order"
          name="mobile-transaction-sort-order"
          label={t("_pages:transactions.mobileFilters.sortOrder")}
          value={mobileSortingOrder}
          onChange={(event) =>
            setMobileSortingOrder(
              parseSortOrder((event.target as HTMLSelectElement).value),
            )
          }
          options={sortingOrderOptions}
        />
      </div>
      <DialogActions
        onCancel={handleClear}
        onPrimaryClick={handleApply}
        cancelText={t("_accessibility:buttons.clear")}
        primaryText={t("_accessibility:buttons.applyFilters")}
        alignEnd
      />
    </Dialog>
  );
};

export default TransactionsMobileFilters;
