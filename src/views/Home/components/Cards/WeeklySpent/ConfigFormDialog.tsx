import { Controller, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  CheckInput,
  classNames,
  enumToKeyValueArray,
  FormDialog,
  SelectInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import { Tables, TransactionType } from "lib";

// types
import type { ConfigFormDialogPropsType, WeeklySpentFormType } from "./types";

// utils
import { icons } from "../../../../Transactions/components/utils";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<WeeklySpentFormType>,
) => {
  const { control, isLoading, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();

  const parsedTypes = useMemo(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory:type.values.${item.key}`),
      })) as Option[],
    [t],
  );

  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (setValue && type === undefined) {
      setValue("type", TransactionType.In);
    }
  }, [setValue, type]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.weeklySpent.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="accounts"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value}
            multiple
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.account.label",
            )}`}
            onChange={(v) => onChange(v)}
            options={accounts ?? []}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={parsedTypes}
            value={value}
            onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
            label={t("_entities:transactionCategory.type.label")}
            inputClassName="dashboard-card-select-input dashboard-card-icon-select-input"
            {...rest}
          >
            <FontAwesomeIcon
              icon={icons[(type ?? 0) as keyof typeof icons]}
              className={classNames(
                "dashboard-card-select-icon",
                Number(type) === TransactionType.In
                  ? "dashboard-card-select-icon--income inverted-success"
                  : "dashboard-card-select-icon--expense inverted-error",
              )}
            />
          </SelectInput>
        )}
      />
      <Controller
        control={control}
        name="showFiltersAsBadge"
        render={({ field: { value, onChange, ...rest } }) => (
          <CheckInput
            {...rest}
            id="weekly-spent-show-filters-as-badge"
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
