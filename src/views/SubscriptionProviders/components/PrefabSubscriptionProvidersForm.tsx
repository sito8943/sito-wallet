import { useMemo } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { Loading } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// components
import { PrefabSubscriptionProvidersGrid } from "components";

// hooks
import { SubscriptionProvidersQueryKeys } from "hooks";

// lib
import { detectCountry, detectCurrency } from "lib";
import type { PrefabSubscriptionProviderDto } from "lib";

// types
import type { AddPrefabSubscriptionProvidersDialogPropsType } from "../types";

export function PrefabSubscriptionProvidersForm(
  props: AddPrefabSubscriptionProvidersDialogPropsType,
) {
  const { control, isLoading } = props;
  const { t } = useTranslation();
  const manager = useManager();

  const country = useMemo(() => detectCountry(), []);
  const defaultCurrencyCode = useMemo(() => detectCurrency(country), [country]);

  const hasManager = "SubscriptionProviders" in manager;

  const {
    data: providers,
    isLoading: loadingProviders,
    isError,
  } = useQuery<PrefabSubscriptionProviderDto[]>({
    queryKey: [
      ...SubscriptionProvidersQueryKeys.all().queryKey,
      "prefabs",
      country,
    ],
    queryFn: () => manager.SubscriptionProviders.getPrefabs({ country }),
    enabled: hasManager,
  });

  if (!hasManager || isError) {
    return (
      <div className="prefab-suggestions-empty">
        <p className="prefab-suggestions-error error">
          {t("_pages:prefabs.subscriptions.loadError")}
        </p>
      </div>
    );
  }

  if (loadingProviders) {
    return (
      <div className="prefab-suggestions-empty">
        <Loading />
      </div>
    );
  }

  if (!providers || providers.length === 0) {
    return (
      <div className="prefab-suggestions-empty">
        <p>{t("_pages:prefabs.subscriptions.empty")}</p>
      </div>
    );
  }

  return (
    <Controller
      control={control}
      name="keys"
      rules={{
        validate: (value) =>
          (Array.isArray(value) && value.length > 0) ||
          t("_pages:prefabs.errors.selectAtLeastOne"),
      }}
      render={({ field: { value, onChange } }) => (
        <PrefabSubscriptionProvidersGrid
          value={value ?? []}
          onChange={onChange}
          disabled={isLoading}
          providers={providers}
          defaultCurrencyCode={defaultCurrencyCode}
        />
      )}
    />
  );
}
