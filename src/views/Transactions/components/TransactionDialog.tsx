import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard
import { TextInput, Option, AutocompleteInput } from "@sito/dashboard";

// components
import { FormDialog, ParagraphInput } from "components";

// types
import {
  AddTransactionDialogPropsType,
  TransactionFormPropsType,
  EditTransactionDialogPropsType,
} from "../types";

// lib
import { Tables } from "lib";

// hooks
import { useAccountsCommon } from "hooks";

export function TransactionForm(props: TransactionFormPropsType) {
  const { control, isLoading, lockAccount } = props;
  const { t } = useTranslation();

  const accounts = useAccountsCommon();

  const accountOptions = useMemo(
    () => [...(accounts?.data ?? [])] as Option[],
    [accounts.data]
  );

  return (
    <>
      <Controller
        control={control}
        render={({ field }) => <input {...field} type="hidden" />}
        name="id"
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
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:base.name.label"
            )}`}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:transaction.name.placeholder")}
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
