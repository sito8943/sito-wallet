import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";

// @sito/dashboard
import { TextInput } from "@sito/dashboard";

// components
import { FormDialog, ParagraphInput } from "components";

// types
import {
  AddCurrencyDialogPropsType,
  CurrencyFormPropsType,
  EditCurrencyDialogPropsType,
} from "../types";

// lib
import { Tables } from "lib";

// providers
import { useAuth } from "providers";

export function CurrencyForm(props: CurrencyFormPropsType) {
  const { control, setValue, isLoading, open } = props;
  const { t } = useTranslation();
  const { account } = useAuth();

  useEffect(() => {
    if (account && setValue) setValue("userId", account?.id ?? 0);
  }, [account, setValue, open]);

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
            autoComplete={`${Tables.Currencies}-${t(
              "_entities:base.name.label"
            )}`}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:currency.name.placeholder")}
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        rules={{
          required: `${t("_entities:currency.symbol.required")}`,
        }}
        name="symbol"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ""}
            autoComplete={`${Tables.Currencies}-${t(
              "_entities:currency.symbol.label"
            )}`}
            label={t("_entities:currency.symbol.label")}
            placeholder={t("_entities:currency.symbol.placeholder")}
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
            autoComplete={`${Tables.Currencies}-${t(
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

export function AddCurrencyDialog(props: AddCurrencyDialogPropsType) {
  return (
    <FormDialog {...props}>
      <CurrencyForm {...props} />
    </FormDialog>
  );
}

export function EditCurrencyDialog(props: EditCurrencyDialogPropsType) {
  return (
    <FormDialog {...props}>
      <CurrencyForm {...props} />
    </FormDialog>
  );
}
