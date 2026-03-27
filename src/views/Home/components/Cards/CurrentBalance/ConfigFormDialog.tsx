import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { AutocompleteInput, FormDialog } from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "hooks";

// lib
import { Tables } from "lib";

// types
import { ConfigFormDialogPropsType, CurrentBalanceFormType } from "./types";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<CurrentBalanceFormType>,
) => {
  const { control } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();

  return (
    <FormDialog title={t("_accessibility:buttons.filters")} {...props}>
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
            containerClassName="!w-full"
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
};
