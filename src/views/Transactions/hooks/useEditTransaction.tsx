import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys, useFormDialog } from "hooks";

// utils
import { dtoToForm, emptyTransaction, formToDto } from "../utils";

// types
import { UpdateTransactionDto, TransactionDto } from "lib";
import { TransactionFormType } from "../types";

export function useEditTransaction() {
  const { t } = useTranslation();

  const manager = useManager();

  return useFormDialog<
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
}
