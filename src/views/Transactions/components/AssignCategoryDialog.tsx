import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { FormDialog, AutocompleteInput, Option } from "@sito/dashboard-app";

// hooks
import { useTransactionCategoriesCommon } from "hooks";

// lib
import { Tables } from "lib";

// types
import { AssignTransactionCategoryDialogPropsType } from "../types";

export function AssignCategoryDialog(
  props: AssignTransactionCategoryDialogPropsType
) {
  const { control, isLoading } = props;

  const { t } = useTranslation();

  const categories = useTransactionCategoriesCommon();

  const categoryOptions = useMemo(
    () =>
      [
        ...(categories?.data?.map((category) => ({
          ...category,
          name: category.initial
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })) ?? []),
      ] as Option[],
    [categories?.data, t]
  );

  return (
    <FormDialog {...props}>
      <Controller
        control={control}
        name="transactionIds"
        render={({ field }) => (
          <input
            {...field}
            type="hidden"
            value={
              Array.isArray(field.value)
                ? field.value.join(",")
                : String(field.value ?? "")
            }
          />
        )}
      />
      <Controller
        control={control}
        name="category"
        rules={{
          required: `${t("_entities:transaction.category.required")}`,
        }}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={categoryOptions}
            value={value}
            onChange={(v) => onChange(v)}
            label={t("_entities:transaction.category.label")}
            placeholder={t("_entities:transaction.category.placeholder")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.category.label"
            )}`}
            multiple={false}
            disabled={isLoading}
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
}
