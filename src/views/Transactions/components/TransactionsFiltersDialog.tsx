import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
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
} from "@sito/dashboard-app";

// types
import { TransactionsMobileFiltersDialogPropsType } from "../types";

// utils
import { getTransactionTypeOptions } from "./Containers/transactionColumns";
import { DEFAULT_SORTING_BY, DEFAULT_SORTING_ORDER } from "../hooks";

const parseSortOrder = (value: unknown): SortOrder => {
  const parsed = String(value ?? "").toUpperCase();
  return parsed === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC;
};

export const TransactionsMobileFilters = (
  props: TransactionsMobileFiltersDialogPropsType,
) => {
  const { categories, control, handleClear } = props;

  const { t } = useTranslation();

  const categoryOptions = useMemo(
    () => [...(categories ?? [])] as Option[],
    [categories],
  );

  const typeOptions = useMemo(() => getTransactionTypeOptions(t), [t]);

  const sortingByOptions = useMemo(
    () =>
      [
        {
          id: "date",
          name: t("_entities:transaction.date.label"),
        },
        {
          id: "amount",
          name: t("_entities:transaction.amount.label"),
        },
        {
          id: "description",
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
          name: t("_pages:transactions.mobileFilters.order.desc"),
        },
        {
          id: SortOrder.ASC,
          name: t("_pages:transactions.mobileFilters.order.asc"),
        },
      ] as Option[],
    [t],
  );

  const softDeleteScopeOptions = useMemo(
    () =>
      [
        {
          id: "ACTIVE",
          name: t("_entities:base.deleted.scope.values.active"),
        },
        {
          id: "DELETED",
          name: t("_entities:base.deleted.scope.values.deleted"),
        },
        {
          id: "ALL",
          name: t("_entities:base.deleted.scope.values.all"),
        },
      ] as Option[],
    [t],
  );

  const softDeleteScopeValue = useWatch({
    control,
    name: "softDeleteScope",
  }) as string | undefined;

  return (
    <FormDialog {...props}>
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
      <div className="grid grid-cols-2 gap-2">
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
      </div>
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
        name="softDeleteScope"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            id="mobile-transaction-soft-delete-scope-filter"
            label={t("_entities:base.deleted.scope.label")}
            value={value ?? "ACTIVE"}
            onChange={(event) =>
              onChange((event.target as HTMLSelectElement).value)
            }
            options={softDeleteScopeOptions}
            {...rest}
          />
        )}
      />
      {softDeleteScopeValue === "DELETED" ? (
        <div className="grid grid-cols-2 gap-2">
          <Controller
            control={control}
            name="deletedAtStart"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="mobile-transaction-deleted-at-start-filter"
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
            name="deletedAtEnd"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="mobile-transaction-deleted-at-end-filter"
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
      ) : null}
      <div className="grid grid-cols-2 gap-2">
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
                onChange(
                  parseSortOrder((event.target as HTMLSelectElement).value),
                )
              }
              options={sortingOrderOptions}
              {...rest}
            />
          )}
        />
      </div>
      <Button type="button" variant="outlined" onClick={handleClear}>
        {t("_accessibility:buttons.clear")}
      </Button>
    </FormDialog>
  );
};

export default TransactionsMobileFilters;
