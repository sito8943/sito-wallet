import { useMemo } from "react";
import { Controller } from "react-hook-form";

import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  FormDialog,
  SelectInput,
  SortOrder,
  TextInput,
  useTranslation,
} from "@sito/dashboard-app";

import { DEBT_DIRECTION_NAME, DEBT_DIRECTIONS } from "lib";

import {
  DEFAULT_DEBT_FILTER_SORTING_BY,
  DEFAULT_DEBT_FILTER_SORTING_ORDER,
} from "../../constants";
import type { DebtsFiltersDialogPropsType } from "../../types";
import { parseDebtFilterSortOrder } from "../../utils";

import "./styles.css";

export function DebtsFiltersDialog(props: DebtsFiltersDialogPropsType) {
  const { control, currencies, handleClear, statusOptions } = props;
  const { t } = useTranslation();

  const directionOptions = useMemo<Option[]>(
    () =>
      DEBT_DIRECTIONS.map((direction) => ({
        id: direction,
        name: t(
          `_entities:debt.direction.values.${DEBT_DIRECTION_NAME[direction]}`,
        ),
      })),
    [t],
  );

  const sortingByOptions = useMemo<Option[]>(
    () => [
      { id: "id", name: t("_entities:base.id.label") },
      {
        id: "counterpartyName",
        name: t("_entities:debt.counterpartyName.label"),
      },
      { id: "direction", name: t("_entities:debt.direction.label") },
      { id: "status", name: t("_entities:debt.status.label") },
      { id: "issuedAt", name: t("_entities:debt.issuedAt.label") },
      { id: "dueAt", name: t("_entities:debt.dueAt.label") },
    ],
    [t],
  );

  const sortingOrderOptions = useMemo<Option[]>(
    () => [
      {
        id: SortOrder.DESC,
        name: t("_pages:debts.filters.order.desc"),
      },
      {
        id: SortOrder.ASC,
        name: t("_pages:debts.filters.order.asc"),
      },
    ],
    [t],
  );

  const anyOption = {
    id: "",
    name: t("_pages:debts.filters.any"),
  };

  return (
    <FormDialog
      {...props}
      extraActions={[
        {
          id: "clear",
          type: "button",
          variant: "outlined",
          onClick: handleClear,
          children: t("_accessibility:buttons.clear"),
        },
      ]}
    >
      <Controller
        control={control}
        name="currency"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            id="debt-currency-filter"
            label={t("_entities:debt.currency.label")}
            placeholder={t("_entities:debt.currency.placeholder")}
            options={currencies}
            value={value}
            onChange={onChange}
            multiple={false}
            {...rest}
          />
        )}
      />

      <div className="debt-filters-grid">
        <Controller
          control={control}
          name="direction"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              id="debt-direction-filter"
              label={t("_entities:debt.direction.label")}
              value={value ?? ""}
              onChange={(event) => onChange(event.target.value)}
              options={[anyOption, ...directionOptions]}
              {...rest}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field: { value, onChange, ...rest } }) => (
            <AutocompleteInput
              id="debt-status-filter"
              label={t("_entities:debt.status.label")}
              placeholder={t("_pages:debts.filters.any")}
              value={value ?? []}
              onChange={onChange}
              options={statusOptions}
              multiple
              {...rest}
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="counterpartyName"
        render={({ field: { value, onChange, ...rest } }) => (
          <TextInput
            id="debt-counterparty-filter"
            label={t("_entities:debt.counterpartyName.label")}
            placeholder={t("_entities:debt.counterpartyName.placeholder")}
            value={value ?? ""}
            onChange={(event) => onChange(event.target.value)}
            {...rest}
          />
        )}
      />

      <div className="debt-filters-section">
        <p className="debt-filters-section-title">
          {t("_entities:debt.issuedAt.label")}
        </p>
        <div className="debt-filters-grid">
          <Controller
            control={control}
            name="issuedAtStart"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="debt-issued-at-start-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.start")}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
              />
            )}
          />
          <Controller
            control={control}
            name="issuedAtEnd"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="debt-issued-at-end-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.end")}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
              />
            )}
          />
        </div>
      </div>

      <div className="debt-filters-section">
        <p className="debt-filters-section-title">
          {t("_entities:debt.dueAt.label")}
        </p>
        <div className="debt-filters-grid">
          <Controller
            control={control}
            name="dueAtStart"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="debt-due-at-start-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.start")}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
              />
            )}
          />
          <Controller
            control={control}
            name="dueAtEnd"
            render={({ field: { value, onChange, ...rest } }) => (
              <TextInput
                id="debt-due-at-end-filter"
                type="date"
                label={t("_accessibility:components.table.filters.range.end")}
                value={value ?? ""}
                onChange={(event) => onChange(event.target.value)}
                {...rest}
              />
            )}
          />
        </div>
      </div>

      <div className="debt-filters-grid">
        <Controller
          control={control}
          name="sortingBy"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              id="debt-sort-by"
              label={t("_pages:debts.filters.sortBy")}
              value={value ?? DEFAULT_DEBT_FILTER_SORTING_BY}
              onChange={(event) => onChange(event.target.value)}
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
              id="debt-sort-order"
              label={t("_pages:debts.filters.sortOrder")}
              value={value ?? DEFAULT_DEBT_FILTER_SORTING_ORDER}
              onChange={(event) =>
                onChange(parseDebtFilterSortOrder(event.target.value))
              }
              options={sortingOrderOptions}
              {...rest}
            />
          )}
        />
      </div>
    </FormDialog>
  );
}
