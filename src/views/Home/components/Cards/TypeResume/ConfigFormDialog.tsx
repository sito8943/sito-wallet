import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo } from "react";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard
import {
  AutocompleteInput,
  TextInput,
  SelectInput,
  Option,
} from "@sito/dashboard";

// components
import { FormDialog } from "components";

// hooks
import { useAccountsCommon, useTransactionCategoriesCommon } from "hooks";

// lib
import { Tables, enumToKeyValueArray, TransactionType } from "lib";

// types
import { ConfigFormDialogPropsType, TypeResumeTypeFormType } from "./types";

// utils
import { icons } from "../../../../Transactions/components/utils";

export const ConfigFormDialog = <ValidationError extends Error>(
  props: ConfigFormDialogPropsType<TypeResumeTypeFormType, ValidationError>
) => {
  const { control, isLoading, setValue } = props;

  const { t } = useTranslation();

  const parsedTypes = useMemo(
    () =>
      enumToKeyValueArray(TransactionType)?.map((item) => ({
        id: item.value,
        value: t(`_entities:transactionCategory:type.values.${item.key}`),
      })) as Option[],
    [t]
  );

  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    if (setValue && type === undefined) {
      setValue("type", TransactionType.In);
    }
  }, [setValue, type]);

  const { data: accounts } = useAccountsCommon();

  useEffect(() => {
    if (accounts?.length && setValue) {
      setValue("accounts", [accounts[0]]);
    }
  }, [accounts, setValue]);

  const { data: categories } = useTransactionCategoriesCommon();

  const categoriesByType = useMemo(() => {
    console.log(type);
    return categories?.filter((category) => category.type === type) ?? [];
  }, [categories, type]);

  useEffect(() => {
    if (setValue) setValue("categories", null);
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
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.account.label"
            )}`}
            onChange={(v) => onChange(v)}
            options={accounts ?? []}
            containerClassName="!w-full"
            {...rest}
          />
        )}
      />

      <div className="range-widget-container">
        <p className="text-input-label input-widget-label input-label-normal">
          {t("_entities:transaction.date.label")}
        </p>
        <div className="flex max-xs:flex-col items-center justify-start gap-2">
          <Controller
            control={props.control}
            name={"startDate"}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                value={value}
                placeholder={t(
                  "_accessibility:components.table.filters.range.start"
                )}
                type="date"
                {...rest}
              />
            )}
          />
          <Controller
            control={props.control}
            name={"endDate"}
            render={({ field: { value, ...rest } }) => (
              <TextInput
                value={value}
                placeholder={t(
                  "_accessibility:components.table.filters.range.end"
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
        name="category"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            multiple
            value={value}
            options={categoriesByType ?? []}
            label={t("_entities:transaction.category.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.category.label"
            )}`}
            containerClassName="!w-[unset] flex-1"
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
            inputClassName="!pl-7"
            {...rest}
          >
            <FontAwesomeIcon
              icon={icons[(type ?? 0) as keyof typeof icons]}
              className={`absolute left-2 top-3.5 -translate-y-[50%] text-text text-sm ${
                Number(type) === TransactionType.In
                  ? "inverted-success"
                  : "inverted-error"
              }`}
            />
          </SelectInput>
        )}
      />
    </FormDialog>
  );
};
