import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager, useOnboardingDraft } from "providers";

// hooks
import { SubscriptionProvidersQueryKeys } from "hooks";

// lib
import { detectCountry } from "lib";
import type {
  AddSubscriptionProviderDto,
  PrefabSubscriptionProviderDto,
} from "lib";

// types
import type {
  PrefabSubscriptionProvidersFormType,
  PrefabSubscriptionProvidersPayload,
} from "../types";

export function useAddPrefabSubscriptionProvidersDialog() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { isAnonymous, addSubscriptionProviders } = useOnboardingDraft();

  const queryKey = useMemo(
    () => SubscriptionProvidersQueryKeys.all().queryKey,
    [],
  );

  const defaultValues = useMemo<PrefabSubscriptionProvidersFormType>(
    () => ({ keys: [] }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    PrefabSubscriptionProvidersPayload,
    void,
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

      const entries = form.keys
        .map((key) => {
          const prefab = providers.find((p) => p.key === key);
          if (!prefab) return null;
          return {
            key,
            item: {
              name: prefab.name,
              description: prefab.description ?? null,
              website: prefab.website ?? null,
              photo: prefab.image ?? null,
            },
          };
        })
        .filter(
          (v): v is { key: string; item: AddSubscriptionProviderDto } =>
            v !== null,
        );

      return {
        items: entries.map((e) => e.item),
        keys: entries.map((e) => e.key),
      };
    },
    mutationFn: async (payload) => {
      if (isAnonymous) {
        addSubscriptionProviders(
          payload.items.map((item, index) => ({
            name: item.name,
            description: item.description ?? null,
            website: item.website ?? null,
            photo: item.photo ?? null,
            prefabKey: payload.keys[index],
          })),
        );
        return;
      }
      if (!("SubscriptionProviders" in manager)) {
        throw new Error("SubscriptionProviders manager unavailable");
      }
      await manager.SubscriptionProviders.insertMany(payload.items);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.subscriptionProvidersTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
