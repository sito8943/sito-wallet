import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys, useMutationErrorHandler } from "hooks";

// utils
import { addEmptyCurrency, formToDto, getCurrencyId } from "../utils";

// lib
import type { AddCurrencyDto, CommonCurrencyDto } from "lib";

// types
import type { CurrencyFormType, UseAddCurrencyOptions } from "../types";

export function useAddCurrency(options: UseAddCurrencyOptions = {}) {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  const queryKey = useMemo(() => CurrenciesQueryKeys.all().queryKey, []);

  const { handleSubmit, ...rest } = usePostDialog<
    AddCurrencyDto,
    CommonCurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    defaultValues: addEmptyCurrency,
    mutationFn: async (data) => {
      const created = await manager.Currencies.insert(data);
      const currencyId = getCurrencyId(created);
      if (!currencyId) throw new Error("currency.idNotReturned");

      const createdCurrency = await manager.Currencies.getById(currencyId);
      return {
        id: createdCurrency.id,
        name: createdCurrency.name,
        symbol: createdCurrency.symbol,
        updatedAt: createdCurrency.updatedAt,
      };
    },
    onSuccess: options.onCreated,
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:currencies.forms.add"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:currency.name.unique",
      }),
    queryKey,
  });

  return {
    handleSubmit,
    ...rest,
  };
}
