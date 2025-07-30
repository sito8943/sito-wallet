import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys, useEditAction, useFormDialog } from "hooks";

// utils
import { dtoToForm, emptyTransaction, formToDto } from "../utils";

// lib
import { UpdateTransactionDto, TransactionDto } from "lib";

// types
import { TransactionFormType } from "../types";

export function useEditTransaction() {
  const { t } = useTranslation();

  const manager = useManager();

  const { onClick, ...rest } = useFormDialog<
    TransactionDto,
    UpdateTransactionDto,
    TransactionDto,
    TransactionFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransaction,
    getFunction: (id) => manager.Transactions.getById(id),
    mutationFn: (data) => manager.Transactions.update(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:transactions.forms.edit"),
    ...TransactionsQueryKeys.all(),
  });

  const { action } = useEditAction({ onClick });

  return {
    action,
    onClick,
    ...rest,
  };
}
