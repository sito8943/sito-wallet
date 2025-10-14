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
import { UpdateCurrencyDto, CurrencyDto } from "lib";

// types
import { CurrencyFormType } from "../types";

export function useEditCurrency() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<
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
    title: t("_pages:currencies.forms.edit"),
    ...CurrenciesQueryKeys.all(),
  });
}
