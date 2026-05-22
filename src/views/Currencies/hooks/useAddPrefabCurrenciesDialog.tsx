import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useAuth, useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// components
import { PREFAB_CURRENCIES } from "components";

// hooks
import { CurrenciesQueryKeys } from "hooks";

// lib
import { detectCountry, detectCurrency } from "lib";
import type { AddCurrencyDto, CurrencyDto } from "lib";

// types
import type { PrefabCurrenciesFormType } from "../types";

export function useAddPrefabCurrenciesDialog() {
  const { t } = useTranslation();
  const { account } = useAuth();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const queryKey = useMemo(() => CurrenciesQueryKeys.all().queryKey, []);

  const defaultValues = useMemo<PrefabCurrenciesFormType>(
    () => ({ codes: [detectCurrency(detectCountry())] }),
    [],
  );

  const { handleSubmit, ...rest } = usePostDialog<
    AddCurrencyDto[],
    CurrencyDto,
    PrefabCurrenciesFormType
  >({
    defaultValues,
    formToDto: (form) =>
      form.codes.map((code) => {
        const prefab = PREFAB_CURRENCIES.find((c) => c.code === code);
        return {
          name: prefab?.name ?? code,
          symbol: prefab?.symbol ?? code,
          description: "",
          userId: account?.id ?? 0,
        };
      }),
    mutationFn: (data) => manager.Currencies.insertMany(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:prefabs.dialog.currenciesTitle"),
    onError: () =>
      showErrorNotification({ message: t("_accessibility:errors.500") }),
    queryKey,
  });

  return { handleSubmit, ...rest };
}
