import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard
import {
  SelectInput,
  TextInput,
  Option,
  AutocompleteInput,
} from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { FormDialog, ParagraphInput } from "components";

// types
import {
  AddTransactionDialogPropsType,
  TransactionFormPropsType,
  EditTransactionDialogPropsType,
} from "../types";

// lib
import { enumToKeyValueArray, Tables, TransactionType } from "lib";

// utils
import { icons } from "./utils";

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

  const typeOptions = useMemo(
    () => [
      ...(enumToKeyValueArray(TransactionType)?.map(({ key, value }) => ({
        id: value as number,
        name: key,
      })) ?? []),
    ],
    []
  );

  const { type } = useWatch({ control });

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
      <div className="flex gap-5 max-xs:gap-2 max-xs:flex-col">
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
              label={t("_entities:transaction.type.label")}
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
      </div>
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
