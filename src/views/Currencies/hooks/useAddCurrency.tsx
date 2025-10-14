import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyCurrency, formToDto } from "../utils";

// lib
import { AddCurrencyDto, CurrencyDto } from "lib";

// types
import { CurrencyFormType } from "../types";

export function useAddCurrency() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    CurrencyDto,
    AddCurrencyDto,
    CurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyCurrency,
    mutationFn: (data) => manager.Currencies.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:currencies.forms.add"),
    ...CurrenciesQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
