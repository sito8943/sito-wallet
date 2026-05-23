import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth, useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager, useOnboardingDraft } from "providers";

// components
import { PREFAB_CURRENCIES } from "components";

// hooks
import { CurrenciesQueryKeys } from "hooks";

// lib
import { detectCountry, detectCurrency } from "lib";

// types
import type {
  PrefabCurrenciesFormType,
  PrefabCurrenciesPayload,
} from "../types";

export function useAddPrefabCurrenciesDialog() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();
  const { isAnonymous, addCurrencies } = useOnboardingDraft();

  const queryKey = useMemo(() => CurrenciesQueryKeys.all().queryKey, []);

  const defaultValues = useMemo<PrefabCurrenciesFormType>(
    () => ({ codes: [detectCurrency(detectCountry())] }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    PrefabCurrenciesPayload,
    void,
    PrefabCurrenciesFormType
  >({
    defaultValues,
    formToDto: (form) => ({
      codes: form.codes,
      items: form.codes.map((code) => {
        const prefab = PREFAB_CURRENCIES.find((c) => c.code === code);
        return {
          name: prefab?.name ?? code,
          symbol: prefab?.symbol ?? code,
          description: "",
          userId: account?.id ?? 0,
        };
      }),
    }),
    mutationFn: async (payload) => {
      if (isAnonymous) {
        addCurrencies(
          payload.items.map((item, index) => ({
            name: item.name,
            symbol: item.symbol,
            description: item.description,
            prefabCode: payload.codes[index],
          })),
        );
        return;
      }
      await manager.Currencies.insertMany(payload.items);
    },
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.currenciesTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
