import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { usePutDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys, useMutationErrorHandler } from "hooks";

// utils
import { dtoToForm, emptyCurrency, formToDto } from "../utils";

// lib
import type { UpdateCurrencyDto, CurrencyDto } from "lib";

// types
import type { CurrencyFormType } from "../types";

export function useEditCurrency() {
  const { t } = useTranslation();

  const manager = useManager();
  const handleMutationError = useMutationErrorHandler();

  return usePutDialog<
    CurrencyDto,
    UpdateCurrencyDto,
    CurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyCurrency,
    getFunction: (id) => manager.Currencies.getById(id),
    mutationFn: (data) => manager.Currencies.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    onError: (error) =>
      handleMutationError(error, {
        uniqueKey: "_entities:currency.name.unique",
      }),
    title: t("_pages:currencies.forms.edit"),
    ...CurrenciesQueryKeys.all(),
  });
}
