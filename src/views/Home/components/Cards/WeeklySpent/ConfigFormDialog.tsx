import { Controller, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import {
  AutocompleteInput,
  enumToKeyValueArray,
  FormDialog,
  SelectInput,
  Option,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "hooks";

// lib
import { Tables, TransactionType } from "lib";

// types
import { ConfigFormDialogPropsType, WeeklySpentFormType } from "./types";

// utils
import { icons } from "../../../../Transactions/components/utils";

export const ConfigFormDialog = <ValidationError extends Error>(
  props: ConfigFormDialogPropsType<WeeklySpentFormType, ValidationError>
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
    [t]
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
              "_entities:transaction.account.label"
            )}`}
            onChange={(v) => onChange(v)}
            options={accounts ?? []}
            containerClassName="!w-full"
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
