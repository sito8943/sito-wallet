import { useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { FormDialog, AutocompleteInput, Option } from "@sito/dashboard-app";

// hooks
import { useTransactionCategoriesCommon } from "hooks";

// lib
import {
  CommonTransactionCategoryDto,
  Tables,
  hasMixedTransactionCategoryTypes,
  normalizeSelectedTransactionCategories,
} from "lib";

// types
import { AssignTransactionCategoryDialogPropsType } from "../types";

export function AssignCategoryDialog(
  props: AssignTransactionCategoryDialogPropsType,
) {
  const { control, isLoading } = props;

  const { t } = useTranslation();

  const categories = useTransactionCategoriesCommon();

  const categoryOptions = useMemo(
    () =>
      [
        ...(categories?.data?.map((category) => ({
          ...category,
          name: category.auto
            ? t("_entities:transactionCategory.name.init")
            : category.name,
        })) ?? []),
      ] as CommonTransactionCategoryDto[],
    [categories?.data, t],
  );

  const selectedCategories = useWatch({
    control,
    name: "categories",
  }) as CommonTransactionCategoryDto[] | undefined;

  const selectedCategoryType = selectedCategories?.[0]?.type;

  const categoryOptionsByType = useMemo(() => {
    if (selectedCategoryType === undefined) return categoryOptions;

    return categoryOptions.filter(
      (category) => category.type === selectedCategoryType,
    );
  }, [categoryOptions, selectedCategoryType]);

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
        name="categories"
        rules={{
          validate: (value) => {
            const parsedCategories = Array.isArray(value)
              ? (value as CommonTransactionCategoryDto[])
              : [];

            if (!parsedCategories.length) {
              return t("_entities:transaction.category.required");
            }

            if (hasMixedTransactionCategoryTypes(parsedCategories)) {
              return t("_entities:transaction.category.required");
            }

            return true;
          },
        }}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={categoryOptionsByType as Option[]}
            value={Array.isArray(value) ? value : []}
            onChange={(nextValue) =>
              onChange(
                normalizeSelectedTransactionCategories(
                  Array.isArray(nextValue)
                    ? (nextValue as CommonTransactionCategoryDto[])
                    : [],
                ),
              )
            }
            label={t("_entities:transaction.category.label")}
            placeholder={t("_entities:transaction.category.placeholder")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.category.label",
            )}`}
            multiple
            disabled={isLoading}
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
}
