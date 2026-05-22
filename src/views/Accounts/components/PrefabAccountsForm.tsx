import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Loading } from "@sito/dashboard-app";

// components
import { PrefabAccountsField } from "components";

// hooks
import { useCurrenciesCommon } from "hooks";

// types
import type { AddPrefabAccountsDialogPropsType } from "../types";

export function PrefabAccountsForm(props: AddPrefabAccountsDialogPropsType) {
  const { control, isLoading } = props;
  const { t } = useTranslation();

  const { data: currencies, isLoading: loadingCurrencies } =
    useCurrenciesCommon();

  if (loadingCurrencies) {
    return (
      <div className="prefab-suggestions-empty">
        <Loading />
      </div>
    );
  }

  if (!currencies || currencies.length === 0) {
    return (
      <div className="prefab-suggestions-empty">
        <p>{t("_pages:prefabs.accounts.requiresCurrencies")}</p>
      </div>
    );
  }

  const defaultCurrencyId = currencies[0].id;

  return (
    <Controller
      control={control}
      name="items"
      rules={{
        validate: (value) =>
          (value && Object.keys(value).length > 0) ||
          t("_pages:prefabs.errors.selectAtLeastOne"),
      }}
      render={({ field: { value, onChange } }) => (
        <PrefabAccountsField
          value={value ?? {}}
          onChange={onChange}
          disabled={isLoading}
          currencies={currencies}
          defaultCurrencyId={defaultCurrencyId}
        />
      )}
    />
  );
}
