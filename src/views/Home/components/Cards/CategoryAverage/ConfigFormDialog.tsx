import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  CheckInput,
  FormDialog,
  SelectInput,
  enumToKeyValueArray,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";

// lib
import type { CommonTransactionCategoryDto } from "lib";
import { Tables, TransactionType } from "lib";

// types
import {
  CategoryAveragePreset,
  type CategoryAverageFormType,
  type ConfigFormDialogPropsType,
} from "./types";

// constants
import { DEFAULT_CATEGORY_AVERAGE_PRESET } from "./constants";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<CategoryAverageFormType>,
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();
  const transactionCategories = useTransactionCategoriesCommon();

  const type = useWatch({ control, name: "type" });
  const preset = useWatch({ control, name: "preset" });

  useEffect(() => {
    if (setValue && type === undefined) setValue("type", TransactionType.Out);
  }, [setValue, type]);

  useEffect(() => {
    if (setValue && preset === undefined)
      setValue("preset", DEFAULT_CATEGORY_AVERAGE_PRESET);
  }, [setValue, preset]);

  const typeOptions = useMemo<Option[]>(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory.type.values.${item.key}`),
      })) ?? [],
    [t],
  );

  const presetOptions = useMemo<Option[]>(
    () =>
      Object.values(CategoryAveragePreset).map((value) => ({
        id: value,
        value: t(`_pages:home.dashboard.categoryAverage.presets.${value}`),
      })),
    [t],
  );

  const categoryOptions = useMemo<CommonTransactionCategoryDto[]>(
    () =>
      (transactionCategories.data ?? [])
        .filter((category) => category.type === (type ?? TransactionType.Out))
        .map((category) => ({
          ...category,
          name: category.auto
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })),
    [t, transactionCategories.data, type],
  );

  return (
    <FormDialog
      title={t("_pages:home.dashboard.categoryAverage.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="type"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={typeOptions}
            value={value ?? TransactionType.Out}
            onChange={(e) => {
              onChange(Number(e.target.value));
              setValue?.("categories", []);
              setValue?.("categoryIds", []);
            }}
            label={t("_entities:transactionCategory.type.label")}
            inputClassName="dashboard-card-select-input"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="preset"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={presetOptions}
            value={value ?? DEFAULT_CATEGORY_AVERAGE_PRESET}
            onChange={(e) => onChange(e.target.value)}
            label={t("_pages:home.dashboard.categoryAverage.presetLabel")}
            inputClassName="dashboard-card-select-input"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="account"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value ?? null}
            multiple={false}
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Accounts}-${t(
              "_entities:transaction.account.label",
            )}`}
            onChange={(nextValue) => onChange(nextValue)}
            options={[
              {
                id: "",
                value: t("_entities:transaction.account.placeholder"),
              },
              ...(accounts ?? []),
            ]}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="categories"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value ?? []}
            multiple
            label={t("_pages:home.dashboard.categoryAverage.categoriesLabel")}
            placeholder={t(
              "_pages:home.dashboard.categoryAverage.categoriesPlaceholder",
            )}
            autoComplete={`${Tables.Transactions}-${t(
              "_pages:home.dashboard.categoryAverage.categoriesLabel",
            )}`}
            onChange={(nextValue) => {
              const nextCategories =
                (nextValue as CommonTransactionCategoryDto[] | null) ?? [];
              onChange(nextCategories);
              setValue?.(
                "categoryIds",
                nextCategories.map((category) => category.id),
              );
            }}
            options={categoryOptions}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="showFiltersAsBadge"
        render={({ field: { value, onChange, ...rest } }) => (
          <CheckInput
            {...rest}
            id="category-average-show-filters-as-badge"
            checked={!!value}
            label={t("_pages:home.dashboard.filterDisplay.badgeToggle")}
            inputClassName="dashboard-card-toggle-input"
            containerClassName="dashboard-card-toggle"
            onChange={(event) => onChange(event.currentTarget.checked)}
          />
        )}
      />
    </FormDialog>
  );
};
