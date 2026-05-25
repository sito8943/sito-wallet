import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  classNames,
  enumToKeyValueArray,
  FormDialog,
  AutocompleteInput,
  TextInput,
  SelectInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";
import { useTransactionCategoriesCommon } from "../../../../../hooks/queries/useTransactionCategoriesCommon";

// lib
import { Tables, TransactionType } from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  TypeResumeTypeFormType,
} from "./types";

// utils
import { icons } from "../../../../Transactions/components/utils";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<TypeResumeTypeFormType>,
) => {
  const { control, isLoading, setValue } = props;

  const { t } = useTranslation();

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

  const { data: accounts } = useAccountsCommon();

  const { data: categories } = useTransactionCategoriesCommon();

  const categoriesByType = useMemo(() => {
    return categories?.filter((category) => category.type === type) ?? [];
  }, [categories, type]);

  useEffect(() => {
    if (setValue) setValue("categories", []);
  }, [setValue, type]);

  return (
    <FormDialog title={t("_accessibility:buttons.filters")} {...props}>
      <Controller
        control={props.control}
        name="accounts"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value}
            multiple
            label={t("_entities:entities.account.plural")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:entities.account.plural",
            )}`}
            onChange={(v) => onChange(v)}
            options={accounts ?? []}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />

      <div className="range-widget-container">
        <p className="text-input-label input-widget-label input-label-normal">
          {t("_entities:transaction.date.label")}
        </p>
        <div className="dashboard-card-range-row">
          <Controller
            control={props.control}
            name={"date.start"}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                value={value}
                placeholder={t(
                  "_accessibility:components.table.filters.range.start",
                )}
                type="date"
                {...rest}
              />
            )}
          />
          <Controller
            control={props.control}
            name={"date.end"}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                value={value}
                placeholder={t(
                  "_accessibility:components.table.filters.range.end",
                )}
                type="date"
                {...rest}
              />
            )}
          />
        </div>
      </div>
      <Controller
        control={props.control}
        name="categories"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            multiple
            value={value}
            options={categoriesByType ?? []}
            label={t("_entities:entities.transactionCategory.plural")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:entities.transactionCategory.plural",
            )}`}
            containerClassName="dashboard-card-autocomplete-grow"
            onChange={(value) => onChange(value)}
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
                "dashboard-card-select-icon vertical-center",
                Number(type) === TransactionType.In
                  ? "dashboard-card-select-icon--income inverted-success"
                  : "dashboard-card-select-icon--expense inverted-error",
              )}
            />
          </SelectInput>
        )}
      />
    </FormDialog>
  );
};
