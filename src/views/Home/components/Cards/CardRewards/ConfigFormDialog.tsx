import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { AutocompleteInput, CheckInput, FormDialog } from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import type { CommonAccountDto } from "lib";
import { Tables, filterRewardsAccounts } from "lib";

// types
import type { CardRewardsFormType, ConfigFormDialogPropsType } from "./types";

import "../styles.css";
import "./styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<CardRewardsFormType>,
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts, isLoading: accountsLoading } = useAccountsCommon();

  // Points only exist on Card accounts; the backend rejects unconfigured ones.
  const cardAccounts = useMemo(
    () => filterRewardsAccounts(accounts ?? []),
    [accounts],
  );

  const account = useWatch({ control, name: "account" });
  const accountId = useWatch({ control, name: "accountId" });

  // A config holding only `accountId` gets its account picked once loaded.
  useEffect(() => {
    if (!setValue || account || !accountId) return;
    const match = cardAccounts.find((item) => item.id === accountId);
    if (match) setValue("account", match);
  }, [setValue, account, accountId, cardAccounts]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.cardRewards.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="account"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value}
            label={t("_pages:home.dashboard.cardRewards.accountLabel")}
            autoComplete={`${Tables.Accounts}-${t(
              "_pages:home.dashboard.cardRewards.accountLabel",
            )}`}
            onChange={(v) => {
              const picked = (v as CommonAccountDto | null) ?? null;
              onChange(picked);
              setValue?.("accountId", picked?.id ?? null);
            }}
            options={cardAccounts}
            multiple={false}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      <p className="card-rewards-config-hint">
        {t(
          !accountsLoading && cardAccounts.length === 0
            ? "_pages:home.dashboard.cardRewards.noCardAccounts"
            : "_pages:home.dashboard.cardRewards.accountHint",
        )}
      </p>
      <Controller
        control={control}
        name="showFiltersAsBadge"
        render={({ field: { value, onChange, ...rest } }) => (
          <CheckInput
            {...rest}
            id="card-rewards-show-filters-as-badge"
            checked={!!value}
            label={t("_pages:home.dashboard.filterDisplay.badgeToggle")}
            inputClassName="dashboard-card-toggle-input"
            containerClassName="dashboard-card-toggle"
            onChange={(event) => onChange(event.currentTarget.checked)}
          />
        )}
      />
    </FormDialog>
  );
};
