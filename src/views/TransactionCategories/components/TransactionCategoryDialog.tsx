import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard
import { SelectInput, TextInput } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { FormDialog, ParagraphInput } from "components";

// types
import {
  AddTransactionCategoryDialogPropsType,
  TransactionCategoryFormPropsType,
  EditTransactionCategoryDialogPropsType,
} from "../types";

// lib
import { enumToKeyValueArray, Tables, TransactionType } from "lib";

// utils
import { icons } from "../../Transactions/components/utils";

// providers
import { useAuth } from "providers";

export function TransactionCategoryForm(
  props: TransactionCategoryFormPropsType
) {
  const { control, isLoading, setValue, open } = props;
  const { t } = useTranslation();
  const { account } = useAuth();

  useEffect(() => {
    if (account && setValue) setValue("userId", account?.id ?? 0);
  }, [account, setValue, open]);

  const typeOptions = useMemo(
    () => [
      ...(enumToKeyValueArray(TransactionType)?.map(({ key, value }) => ({
        id: value as number,
        name: t(`_entities:transactionCategory.type.values.${key}`),
      })) ?? []),
    ],
    [t]
  );

  const { type } = useWatch({ control });

  const initial = useWatch({ control, name: "initial" });

  useEffect(() => {
    if (initial && setValue) {
      setValue("name", t("_entities:transactionCategory.name.init"));
      setValue(
        "description",
        t("_entities:transactionCategory.description.init")
      );
    }
  }, [open, initial, setValue, t]);

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
      />
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="userId"
      />
      <Controller
        control={control}
        rules={{
          required: `${t("_entities:base.name.required")}`,
        }}
        name="name"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ""}
            autoComplete={`${Tables.TransactionCategories}-${t(
              "_entities:base.name.label"
            )}`}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:transactionCategory.name.placeholder")}
            {...rest}
          />
        )}
      />
      <div className="flex gap-5">
        <Controller
          control={control}
          name="type"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              required
              options={typeOptions}
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
      </div>
      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={60}
            value={value ?? ""}
            autoComplete={`${Tables.TransactionCategories}-${t(
              "_entities:base.description.label"
            )}`}
            label={t("_entities:base.description.label")}
            placeholder={t("_entities:base.description.placeholder")}
            {...rest}
          />
        )}
      />
    </>
  );
}

export function AddTransactionCategoryDialog(
  props: AddTransactionCategoryDialogPropsType
) {
  return (
    <FormDialog {...props}>
      <TransactionCategoryForm {...props} />
    </FormDialog>
  );
}

export function EditTransactionCategoryDialog(
  props: EditTransactionCategoryDialogPropsType
) {
  return (
    <FormDialog {...props}>
      <TransactionCategoryForm {...props} />
    </FormDialog>
  );
}
