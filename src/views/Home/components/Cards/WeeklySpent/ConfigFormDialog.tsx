import { Controller, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
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
    <FormDialog title={t("_accessibility:buttons.filters")} {...props}>
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
            inputClassName="dashboard-card-select-input"
            {...rest}
          >
            <FontAwesomeIcon
              icon={icons[(type ?? 0) as keyof typeof icons]}
              className={classNames(
                "dashboard-card-select-icon",
                Number(type) === TransactionType.In
                  ? "dashboard-card-select-icon--income"
                  : "dashboard-card-select-icon--expense",
              )}
            />
          </SelectInput>
        )}
      />
    </FormDialog>
  );
};
