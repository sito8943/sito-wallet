import { useMemo } from "react";
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
import { addEmptyCurrency, dtoToForm, formToDto } from "../utils";

// lib
import { AddCurrencyDto, CurrencyDto } from "lib";

// types
import { CurrencyFormType } from "../types";

export function useAddCurrency() {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();
  const manager = useManager();

  const queryKey = useMemo(() => CurrenciesQueryKeys.all().queryKey, []);

  const { handleSubmit, ...rest } = useFormDialog<
    CurrencyDto,
    AddCurrencyDto,
    CurrencyDto,
    CurrencyFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: addEmptyCurrency,
    mutationFn: (data) => manager.Currencies.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:currencies.forms.add"),
    onError: (error) => {
      console.log("Error adding currency", error);
      if (isHttpError(error) && error.status === 409) {
        return showErrorNotification({
          message: t("_entities:currency.name.unique"),
        });
      }

      return showErrorNotification({
        message: t("_accessibility:errors.500"),
      });
    },
    queryKey,
  });

  return {
    handleSubmit,
    ...rest,
  };
}
