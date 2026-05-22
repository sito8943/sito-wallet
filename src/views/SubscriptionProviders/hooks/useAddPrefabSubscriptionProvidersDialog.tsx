import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { SubscriptionProvidersQueryKeys } from "hooks";

// lib
import { detectCountry } from "lib";
import type {
  AddSubscriptionProviderDto,
  PrefabSubscriptionProviderDto,
  SubscriptionProviderDto,
} from "lib";

// types
import type { PrefabSubscriptionProvidersFormType } from "../types";

export function useAddPrefabSubscriptionProvidersDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const queryClient = useQueryClient();

  const queryKey = useMemo(
    () => SubscriptionProvidersQueryKeys.all().queryKey,
    [],
  );

  const defaultValues = useMemo<PrefabSubscriptionProvidersFormType>(
    () => ({ keys: [] }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    AddSubscriptionProviderDto[],
    SubscriptionProviderDto,
    PrefabSubscriptionProvidersFormType
  >({
    defaultValues,
    formToDto: (form) => {
      const country = detectCountry();
      const providers =
        queryClient.getQueryData<PrefabSubscriptionProviderDto[]>([
          ...SubscriptionProvidersQueryKeys.all().queryKey,
          "prefabs",
          country,
        ]) ?? [];

      return form.keys
        .map((key) => {
          const prefab = providers.find((p) => p.key === key);
          if (!prefab) return null;
          return {
            name: prefab.name,
            description: prefab.description ?? null,
            website: prefab.website ?? null,
            photo: prefab.image ?? null,
          };
        })
        .filter((v): v is AddSubscriptionProviderDto => v !== null);
    },
    mutationFn: (data) => {
      if (!("SubscriptionProviders" in manager)) {
        throw new Error("SubscriptionProviders manager unavailable");
      }
      return manager.SubscriptionProviders.insertMany(data);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.subscriptionProvidersTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
