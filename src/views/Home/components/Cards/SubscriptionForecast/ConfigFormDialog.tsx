import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
  CheckInput,
  enumToKeyValueArray,
  FormDialog,
  SelectInput,
} from "@sito/dashboard-app";

// lib
import { RenewalRangePreset } from "lib";

// types
import type {
  ConfigFormDialogPropsType,
  SubscriptionForecastFormType,
} from "./types";

export const ConfigFormDialog = (
  props: ConfigFormDialogPropsType<SubscriptionForecastFormType>,
) => {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  const rangeOptions = useMemo(
    () =>
      enumToKeyValueArray(RenewalRangePreset)?.map((item) => ({
        id: item.value,
        value: t(`_entities:subscriptionRenewal.range.values.${item.key}`),
      })) as Option[],
    [t],
  );

  return (
    <FormDialog
      title={t("_pages:home.dashboard.subscriptionForecast.configTitle")}
      {...props}
    >
      <Controller
        control={control}
        name="range"
        disabled={isLoading}
        render={({ field: { value, onChange, ...rest } }) => (
          <SelectInput
            required
            options={rangeOptions}
            value={value}
            onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
            label={t("_entities:subscriptionRenewal.range.label")}
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
            id="subscription-forecast-show-filters-as-badge"
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
