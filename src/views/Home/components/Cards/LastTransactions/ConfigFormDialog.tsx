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
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";

// lib
import type { CommonTransactionCategoryDto } from "lib";
import { Tables } from "lib";

// types
import {
  type ConfigFormDialogPropsType,
  type LastTransactionsFormType,
} from "./types";

// constants
import {
  DEFAULT_LAST_TRANSACTIONS_LIMIT,
  MAX_LAST_TRANSACTIONS_LIMIT,
  MIN_LAST_TRANSACTIONS_LIMIT,
} from "./constants";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<LastTransactionsFormType>,
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();
  const transactionCategories = useTransactionCategoriesCommon();

  const categoryOptions = useMemo<CommonTransactionCategoryDto[]>(
    () =>
      (transactionCategories.data ?? []).map((category) => ({
        ...category,
        name: category.auto
          ? t("_entities:transactionCategory.name.init")
          : category.name,
      })),
    [t, transactionCategories.data],
  );

  const limitOptions = useMemo<Option[]>(
    () =>
      Array.from(
        {
          length: MAX_LAST_TRANSACTIONS_LIMIT - MIN_LAST_TRANSACTIONS_LIMIT + 1,
        },
        (_, index) => {
          const value = MIN_LAST_TRANSACTIONS_LIMIT + index;
          return { id: value, value: `${value}` };
        },
      ),
    [],
  );

  const limit = useWatch({ control, name: "limit" });

  useEffect(() => {
    if (setValue && limit === undefined) {
      setValue("limit", DEFAULT_LAST_TRANSACTIONS_LIMIT);
    }
  }, [setValue, limit]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.lastTransactions.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="limit"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={limitOptions}
            value={value ?? DEFAULT_LAST_TRANSACTIONS_LIMIT}
            onChange={(e) =>
              onChange(Number((e.target as HTMLSelectElement).value))
            }
            label={t("_pages:home.dashboard.lastTransactions.limitLabel")}
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
            label={t("_pages:home.dashboard.lastTransactions.categoriesLabel")}
            placeholder={t(
              "_pages:home.dashboard.lastTransactions.categoriesPlaceholder",
            )}
            autoComplete={`${Tables.Transactions}-${t(
              "_pages:home.dashboard.lastTransactions.categoriesLabel",
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
            id="last-transactions-show-filters-as-badge"
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
