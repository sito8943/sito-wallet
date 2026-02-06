import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  isHttpError,
  useFormDialog,
  useNotification,
} from "@sito/dashboard-app";

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
  const { showErrorNotification } = useNotification();

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
    onError: (error) => {
      if (isHttpError(error) && error.status === 409) {
        return showErrorNotification({
          message: t("_entities:currency.name.unique"),
        });
      }

      return showErrorNotification({
        message: t("_accessibility:errors.500"),
      });
    },
    title: t("_pages:currencies.forms.edit"),
    ...CurrenciesQueryKeys.all(),
  });
}
