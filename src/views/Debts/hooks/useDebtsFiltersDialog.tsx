import { useMemo } from "react";

import type { FiltersValue, Option } from "@sito/dashboard-app";
import {
  useFormDialog,
  useTableOptions,
  useTranslation,
} from "@sito/dashboard-app";

import { useCurrenciesCommon } from "hooks";

import {
  DEBT_STATUS_NAME,
  DEBT_STATUSES,
  defaultDebtsListFilters,
  normalizeDebtListFilters,
  type FilterDebtDto,
} from "lib";

import {
  DEFAULT_DEBT_FILTER_SORTING_BY,
  DEFAULT_DEBT_FILTER_SORTING_ORDER,
} from "../constants";
import type {
  DebtsFiltersDialogPropsType,
  DebtsFiltersFormType,
} from "../types";
import {
  parseDebtFilterSortOrder,
  stringifyDebtFilterValue,
} from "../utils";

export function useDebtsFiltersDialog(): DebtsFiltersDialogPropsType {
  const { t } = useTranslation();
  const currenciesQuery = useCurrenciesCommon();

  const {
    filters,
    sortingBy,
    sortingOrder,
    onFilterApply,
    clearFilters,
    setSortingBy,
    setSortingOrder,
    setCurrentPage,
  } = useTableOptions<keyof FilterDebtDto>();

  const currencies = useMemo(
    () => currenciesQuery.data ?? [],
    [currenciesQuery.data],
  );

  const statusOptions = useMemo<Option[]>(
    () =>
      DEBT_STATUSES.map((status) => ({
        id: status,
        name: t(`_entities:debt.status.values.${DEBT_STATUS_NAME[status]}`),
      })),
    [t],
  );

  const normalizedFilters = useMemo(
    () =>
      normalizeDebtListFilters({ ...defaultDebtsListFilters, ...filters }),
    [filters],
  );

  const selectedStatuses = useMemo(() => {
    const statusIds = normalizedFilters.status ?? [];
    return statusOptions.filter((option) =>
      statusIds.includes(Number(option.id)),
    );
  }, [normalizedFilters.status, statusOptions]);

  const currencyId = Number(normalizedFilters.currencyId);
  const selectedCurrency =
    currencies.find((currency) => currency.id === currencyId) ?? null;

  const parsedDueAt = (normalizedFilters.dueAt ?? {}) as {
    start?: string;
    end?: string;
  };
  const parsedIssuedAt = (normalizedFilters.issuedAt ?? {}) as {
    start?: string;
    end?: string;
  };
  const defaultValues = useMemo<DebtsFiltersFormType>(
    () => ({
      currency: selectedCurrency,
      direction: stringifyDebtFilterValue(normalizedFilters.direction),
      status: selectedStatuses,
      counterpartyName: stringifyDebtFilterValue(
        normalizedFilters.counterpartyName,
      ),
      dueAtStart: parsedDueAt.start ?? "",
      dueAtEnd: parsedDueAt.end ?? "",
      issuedAtStart: parsedIssuedAt.start ?? "",
      issuedAtEnd: parsedIssuedAt.end ?? "",
      sortingBy: sortingBy || DEFAULT_DEBT_FILTER_SORTING_BY,
      sortingOrder: parseDebtFilterSortOrder(sortingOrder),
    }),
    [
      normalizedFilters.direction,
      selectedStatuses,
      normalizedFilters.counterpartyName,
      parsedDueAt.start,
      parsedDueAt.end,
      parsedIssuedAt.start,
      parsedIssuedAt.end,
      selectedCurrency,
      sortingBy,
      sortingOrder,
    ],
  );

  const formDialog = useFormDialog<
    DebtsFiltersFormType,
    DebtsFiltersFormType
  >({
    mode: "state",
    defaultValues,
    reinitializeOnOpen: true,
    onSubmit: (values) => {
      clearFilters();

      const nextFilters: FiltersValue<keyof FilterDebtDto> = {};

      if (values.currency?.id) {
        nextFilters.currencyId = { value: values.currency.id };
      }
      if (values.direction !== "") {
        nextFilters.direction = { value: Number(values.direction) };
      }
      if (values.status.length > 0) {
        nextFilters.status = {
          value: values.status.map((option) => Number(option.id)),
        };
      }
      if (values.counterpartyName.trim().length > 0) {
        nextFilters.counterpartyName = {
          value: values.counterpartyName.trim(),
        };
      }
      if (values.dueAtStart || values.dueAtEnd) {
        nextFilters.dueAt = {
          value: {
            start: values.dueAtStart || undefined,
            end: values.dueAtEnd || undefined,
          },
        };
      }
      if (values.issuedAtStart || values.issuedAtEnd) {
        nextFilters.issuedAt = {
          value: {
            start: values.issuedAtStart || undefined,
            end: values.issuedAtEnd || undefined,
          },
        };
      }

      onFilterApply(nextFilters);
      setSortingBy(values.sortingBy || DEFAULT_DEBT_FILTER_SORTING_BY);
      setSortingOrder(parseDebtFilterSortOrder(values.sortingOrder));
      setCurrentPage(0);
    },
    title: t("_accessibility:buttons.filters"),
  });

  const handleClear = () => {
    clearFilters();
    setSortingBy(DEFAULT_DEBT_FILTER_SORTING_BY);
    setSortingOrder(DEFAULT_DEBT_FILTER_SORTING_ORDER);
    setCurrentPage(0);
    formDialog.handleClose();
  };

  return {
    ...formDialog,
    currencies,
    statusOptions,
    handleClear,
    isLoading: formDialog.isLoading || currenciesQuery.isLoading,
  };
}
