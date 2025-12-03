import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard-app
import {
  FormDialog,
  ParagraphInput,
  TextInput,
  Option,
  AutocompleteInput,
} from "@sito/dashboard-app";

// types
import {
  AddTransactionDialogPropsType,
  TransactionFormPropsType,
  EditTransactionDialogPropsType,
} from "../types";

// lib
import { Tables } from "lib";

// hooks
import { useAccountsCommon, useTransactionCategoriesCommon } from "hooks";

export function TransactionForm(props: TransactionFormPropsType) {
  const {
    control,
    account,
    open,
    isLoading,
    setValue,
    lockCategory = false,
    lockAccount = false,
  } = props;
  const { t } = useTranslation();

  // #region external entities

  const accounts = useAccountsCommon();

  const accountOptions = useMemo(
    () => [...(accounts?.data ?? [])] as Option[],
    [accounts.data]
  );

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

  // #endregion

  useEffect(() => {
    if (account && setValue) setValue("account", account);
  }, [open, account, setValue]);

  const initial = useWatch({ control, name: "initial" });

  useEffect(() => {
    if (initial && setValue)
      setValue(
        "description",
        t("_entities:transactionCategory.description.init")
      );
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
        name="category"
        disabled={isLoading || lockCategory}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={categoryOptions}
            value={value}
            onChange={(v) => onChange(v)}
            label={t("_entities:transaction.category.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.category.label"
            )}`}
            multiple={false}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="account"
        disabled={isLoading || lockAccount}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={accountOptions}
            value={value}
            onChange={(v) => onChange(v)}
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.account.label"
            )}`}
            multiple={false}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        rules={{
          required: `${t("_entities:transaction.amount.required")}`,
        }}
        name="amount"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ""}
            type="number"
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.amount.label"
            )}`}
            label={t("_entities:transaction.amount.label")}
            placeholder={t("_entities:transaction.amount.placeholder")}
            {...rest}
          />
        )}
      />

      <Controller
        control={control}
        rules={{
          required: `${t("_entities:transaction.date.required")}`,
        }}
        name="date"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ""}
            type="datetime-local"
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.date.label"
            )}`}
            label={t("_entities:transaction.date.label")}
            placeholder={t("_entities:transaction.date.placeholder")}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="description"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <ParagraphInput
            maxLength={60}
            value={value ?? ""}
            autoComplete={`${Tables.Transactions}-${t(
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

export function AddTransactionDialog(props: AddTransactionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <TransactionForm {...props} />
    </FormDialog>
  );
}

export function EditTransactionDialog(props: EditTransactionDialogPropsType) {
  return (
    <FormDialog {...props}>
      <TransactionForm {...props} />
    </FormDialog>
  );
}
