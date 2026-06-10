import { useEffect, useMemo } from "react";
import { Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  AutocompleteInput,
  FormDialog,
  SelectInput,
} from "@sito/dashboard-app";

// hooks
import { useAccountsCommon } from "../../../../../hooks/queries/useAccountsCommon";

// lib
import { Tables } from "lib";

// types
import {
  type ConfigFormDialogPropsType,
  type BalanceHistoryFormType,
  BalanceHistoryPreset,
} from "./types";

// constants
import { DEFAULT_BALANCE_HISTORY_PRESET } from "./constants";

import "../styles.css";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<BalanceHistoryFormType>,
) => {
  const { control, setValue } = props;
  const { t } = useTranslation();

  const { data: accounts } = useAccountsCommon();

  const presetOptions = useMemo<Option[]>(
    () =>
      Object.values(BalanceHistoryPreset).map((value) => ({
        id: value,
        value: t(`_pages:home.dashboard.balanceHistory.presets.${value}`),
      })),
    [t],
  );

  const preset = useWatch({ control, name: "preset" });

  useEffect(() => {
    if (setValue && preset === undefined) {
      setValue("preset", DEFAULT_BALANCE_HISTORY_PRESET);
    }
  }, [setValue, preset]);

  return (
    <FormDialog
      title={t("_pages:home.dashboard.balanceHistory.configTitle")}
      {...props}
    >
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
      <Controller
        control={control}
        name="preset"
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={presetOptions}
            value={value}
            onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
            label={t("_pages:home.dashboard.balanceHistory.presetLabel")}
            inputClassName="dashboard-card-select-input"
            {...rest}
          />
        )}
      />
    </FormDialog>
  );
};
