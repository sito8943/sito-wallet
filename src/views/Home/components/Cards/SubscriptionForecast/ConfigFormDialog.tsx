import { Controller } from "react-hook-form";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import type { Option } from "@sito/dashboard-app";
import {
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
    <FormDialog title={t("_accessibility:buttons.filters")} {...props}>
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
    </FormDialog>
  );
};
