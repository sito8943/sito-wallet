import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys, useMutationErrorHandler } from "hooks";

// utils
import { addEmptyCurrency, formToDto } from "../utils";

// lib
import type { AddCurrencyDto, CurrencyDto } from "lib";

// types
import type { CurrencyFormType } from "../types";

export function useAddCurrency() {
  const { t } = useTranslation();
  const handleMutationError = useMutationErrorHandler();
  const manager = useManager();

  const queryKey = useMemo(() => CurrenciesQueryKeys.all().queryKey, []);

  const { handleSubmit, ...rest } = usePostDialog<
    AddCurrencyDto,
    CurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    defaultValues: addEmptyCurrency,
    mutationFn: (data) => manager.Currencies.insert(data),
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
