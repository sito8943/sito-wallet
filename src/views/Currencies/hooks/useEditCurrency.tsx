import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { CurrenciesQueryKeys, useFormDialog } from "hooks";

// utils
import { dtoToForm, emptyCurrency, formToDto } from "../utils";

// types
import { UpdateCurrencyDto, CurrencyDto } from "lib";
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
