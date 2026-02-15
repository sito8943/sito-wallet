import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { FormDialog, AutocompleteInput, Option } from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "hooks";

// lib
import { Tables } from "lib";

// types
import { AssignTransactionAccountDialogPropsType } from "../types";

export function AssignAccountDialog(
  props: AssignTransactionAccountDialogPropsType
) {
  const { control, isLoading } = props;

  const { t } = useTranslation();

  const accounts = useAccountsCommon();

  const accountOptions = useMemo(
    () => [...(accounts?.data ?? [])] as Option[],
    [accounts?.data]
  );

  return (
    <FormDialog {...props}>
      <Controller
        control={control}
        name="transactionIds"
        render={({ field }) => <input {...field} type="hidden" />}
      />
      <Controller
        control={control}
        name="account"
        rules={{
          required: `${t("_entities:transaction.account.required")}`,
        }}
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            required
            options={accountOptions}
            value={value}
            onChange={(v) => onChange(v)}
            label={t("_entities:transaction.account.label")}
            placeholder={t("_entities:transaction.account.placeholder")}
            autoComplete={`${Tables.Transactions}-${t(
              "_entities:transaction.account.label"
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
