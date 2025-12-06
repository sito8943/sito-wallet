import { Controller } from "react-hook-form";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { AutocompleteInput, FormDialog } from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "hooks";

// lib
import { Tables } from "lib";

// types
import { ConfigFormDialogPropsType, WeeklySpentFormType } from "./types";

export const ConfigFormDialog = <ValidationError extends Error>(
  props: ConfigFormDialogPropsType<WeeklySpentFormType, ValidationError>
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();

  useEffect(() => {
    if (accounts?.length && setValue) {
      setValue("accounts", [accounts[0]]);
    }
  }, [accounts, setValue]);

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
    </FormDialog>
  );
};

