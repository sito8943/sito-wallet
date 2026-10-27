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
  TextInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import {
  SAVINGS_MONTHLY_DEPOSIT_MAX,
  Tables,
  filterSavingAccounts,
  parseNullableNumber,
  resolveMonthlyDeposit,
} from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  SavingsProjectionFormType,
} from "./types";

// constants
import {
  DEFAULT_SAVINGS_PROJECTION_HORIZON,
  SAVINGS_DEPOSIT_DAYS,
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

  const depositDayOptions = useMemo<Option[]>(
    () => SAVINGS_DEPOSIT_DAYS.map((day) => ({ id: day, value: String(day) })),
    [],
  );

  const horizon = useWatch({ control, name: "horizon" });
  const account = useWatch({ control, name: "account" });
  const monthlyDeposit = useWatch({ control, name: "monthlyDeposit" });
  const hasDeposit = resolveMonthlyDeposit(monthlyDeposit) !== null;
  const currencySymbol = account?.currency?.symbol;

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
        name="monthlyDeposit"
        render={({ field: { value, onChange, ...rest } }) => (
          <TextInput
            type="number"
            min={0}
            max={SAVINGS_MONTHLY_DEPOSIT_MAX}
            step="0.01"
            value={value ?? ""}
            onChange={(e) => onChange(parseNullableNumber(e.target.value))}
            label={
              currencySymbol
                ? t(
                    "_pages:home.dashboard.savingsProjection.monthlyDepositLabelWithCurrency",
                    { currency: currencySymbol },
                  )
                : t(
                    "_pages:home.dashboard.savingsProjection.monthlyDepositLabel",
                  )
            }
            placeholder={t(
              "_pages:home.dashboard.savingsProjection.monthlyDepositPlaceholder",
            )}
            helperText={t(
              "_pages:home.dashboard.savingsProjection.monthlyDepositHelper",
            )}
            {...rest}
          />
        )}
      />
      {hasDeposit && (
        <Controller
          control={control}
          name="depositDay"
          render={({ field: { value, onChange, ...rest } }) => (
            <SelectInput
              required
              options={depositDayOptions}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              label={t(
                "_pages:home.dashboard.savingsProjection.depositDayLabel",
              )}
              helperText={t(
                "_pages:home.dashboard.savingsProjection.depositDayHelper",
              )}
              inputClassName="dashboard-card-select-input"
              {...rest}
            />
          )}
        />
      )}
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
