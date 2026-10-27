import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  CheckInput,
  FormDialog,
  SelectInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import { Tables, filterSavingAccounts } from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  SavingsProjectionFormType,
} from "./types";

// constants
import {
  DEFAULT_SAVINGS_PROJECTION_HORIZON,
  SAVINGS_PROJECTION_HORIZONS,
} from "./constants";

import "../styles.css";
import "./styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<SavingsProjectionFormType>,
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts, isLoading: accountsLoading } = useAccountsCommon();

  // Projections only make sense for Saving accounts.
  const savingAccounts = useMemo(
    () => filterSavingAccounts(accounts ?? []),
    [accounts],
  );

  const horizonOptions = useMemo<Option[]>(
    () =>
      SAVINGS_PROJECTION_HORIZONS.map((value) => ({
        id: value,
        value: t(`_pages:home.dashboard.savingsProjection.horizons.${value}`),
      })),
    [t],
  );

  const horizon = useWatch({ control, name: "horizon" });

  useEffect(() => {
    if (setValue && horizon === undefined) {
      setValue("horizon", DEFAULT_SAVINGS_PROJECTION_HORIZON);
    }
  }, [setValue, horizon]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.savingsProjection.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="account"
        render={({ field: { value, onChange, ...rest } }) => (
          <AutocompleteInput
            value={value}
            label={t("_pages:home.dashboard.savingsProjection.accountLabel")}
            autoComplete={`${Tables.Accounts}-${t(
              "_pages:home.dashboard.savingsProjection.accountLabel",
            )}`}
            onChange={(v) => onChange(v)}
            options={savingAccounts}
            multiple={false}
            containerClassName="dashboard-card-autocomplete-full"
            {...rest}
          />
        )}
      />
      {!accountsLoading && savingAccounts.length === 0 && (
        <p className="savings-projection-config-hint">
          {t("_pages:home.dashboard.savingsProjection.noSavingAccounts")}
        </p>
      )}
      <Controller
        control={control}
        name="horizon"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={horizonOptions}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            label={t("_pages:home.dashboard.savingsProjection.horizonLabel")}
            inputClassName="dashboard-card-select-input"
            {...rest}
          />
        )}
      />
      <Controller
        control={control}
        name="showFiltersAsBadge"
        render={({ field: { value, onChange, ...rest } }) => (
          <CheckInput
            {...rest}
            id="savings-projection-show-filters-as-badge"
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
