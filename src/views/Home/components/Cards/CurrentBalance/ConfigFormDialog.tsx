import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { AutocompleteInput, FormDialog } from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import { Tables } from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  CurrentBalanceFormType,
} from "./types";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<CurrentBalanceFormType>,
) => {
  const { control } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();

  return (
    <FormDialog title={t("_pages:home.dashboard.currentBalance.configTitle")} {...props}>
      <Controller
        control={control}
        name="account"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value}
            label={t("_entities:transaction.account.label")}
            autoComplete={`${Tables.Accounts}-${t(
              "_entities:transaction.account.label",
            )}`}
            onChange={(v) => onChange(v)}
            options={accounts ?? []}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
};
