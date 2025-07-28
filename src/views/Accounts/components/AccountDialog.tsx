import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useWatch } from "react-hook-form";

// @sito/dashboard
import { SelectInput, TextInput, Option } from "@sito/dashboard";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// components
import { FormDialog, ParagraphInput } from "components";

// types
import {
  AddAccountDialogPropsType,
  AccountFormPropsType,
  EditAccountDialogPropsType,
} from "../types";

// lib
import { enumToKeyValueArray, Tables, AccountType } from "lib";

// utils
import { icons } from "./utils";

// hooks
import { useCurrenciesCommon } from "hooks";

export function AccountForm(props: AccountFormPropsType) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  const currencies = useCurrenciesCommon();

  const currencyOptions = useMemo(
    () => [...(currencies?.data ?? [])] as Option[],
    [currencies.data]
  );

  const typeOptions = useMemo(
    () => [
      ...(enumToKeyValueArray(AccountType)?.map(({ key, value }) => ({
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
          required: `t("_entities:base.name.required")`,
        }}
        name="name"
        disabled={isLoading}
        render={({ field: { value, ...rest } }) => (
          <TextInput
            required
            maxLength={20}
            value={value ?? ""}
            autoComplete={`${Tables.Accounts}-${t(
              "_entities:base.name.label"
            )}`}
            label={t("_entities:base.name.label")}
            placeholder={t("_entities:account.name.placeholder")}
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
              label={t("_entities:account.type.label")}
              inputClassName="!pl-7"
              {...rest}
            >
              <FontAwesomeIcon
                icon={icons[(type ?? 0) as keyof typeof icons]}
                className="absolute left-2 top-3.5 -translate-y-[50%] text-text text-sm"
              />
            </SelectInput>
          )}
        />
        <Controller
          control={control}
          name="currencyId"
          disabled={isLoading}
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              required
              options={currencyOptions}
              value={value}
              onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
              label={t("_entities:account.currency.label")}
              inputClassName="!pl-7"
              {...rest}
            />
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
            autoComplete={`${Tables.Accounts}-${t(
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

export function AddAccountDialog(props: AddAccountDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AccountForm {...props} />
    </FormDialog>
  );
}

export function EditAccountDialog(props: EditAccountDialogPropsType) {
  return (
    <FormDialog {...props}>
      <AccountForm {...props} />
    </FormDialog>
  );
}
