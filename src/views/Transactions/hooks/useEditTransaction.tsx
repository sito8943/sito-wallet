import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import {
  useEditAction,
  usePutDialog,
  UseActionDialog,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyTransaction, formToDto } from "../utils";

// lib
import { UpdateTransactionDto, TransactionDto } from "lib";

// types
import { TransactionFormType } from "../types";

export function useEditTransaction(): UseActionDialog<
  TransactionDto,
  TransactionFormType
> {
  const { t } = useTranslation();

  const manager = useManager();
  const { showErrorNotification } = useNotification();

  const { openDialog: onClick, ...rest } = usePutDialog<
    TransactionDto,
    UpdateTransactionDto,
    TransactionDto,
    TransactionFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransaction(),
    getFunction: (id) => manager.Transactions.getById(id),
    mutationFn: (data) => manager.Transactions.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:transactions.forms.edit"),
    onError: (error) => {
      showErrorNotification({
        message: error.message || t("_accessibility:errors.500"),
      });
    },
    ...TransactionsQueryKeys.all(),
  });

  const { action } = useEditAction<TransactionDto>({ onClick });

  return {
    action,
    openDialog: onClick,
    ...rest,
  };
}
