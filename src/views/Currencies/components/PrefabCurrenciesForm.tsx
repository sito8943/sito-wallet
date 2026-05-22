import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// components
import { PrefabCurrenciesGrid } from "components";

// lib
import { detectCountry, detectCurrency } from "lib";

// types
import type { AddPrefabCurrenciesDialogPropsType } from "../types";

export function PrefabCurrenciesForm(
  props: AddPrefabCurrenciesDialogPropsType,
) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  const defaultCurrencyCode = useMemo(
    () => detectCurrency(detectCountry()),
    [],
  );

  return (
    <div className="prefab-suggestions">
      <p className="prefab-suggestions-hint">
        {t("_pages:prefabs.currencies.hint", { code: defaultCurrencyCode })}
      </p>
      <Controller
        control={control}
        name="codes"
        rules={{
          validate: (value) =>
            (Array.isArray(value) && value.length > 0) ||
            t("_pages:prefabs.errors.selectAtLeastOne"),
        }}
        render={({ field: { value, onChange } }) => (
          <PrefabCurrenciesGrid
            value={value ?? []}
            onChange={onChange}
            disabled={isLoading}
          />
        )}
      />
    </div>
  );
}
