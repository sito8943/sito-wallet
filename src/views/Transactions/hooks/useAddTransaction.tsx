import { useTranslation } from "react-i18next";

// providers
import { useManager } from "providers";

// hooks
import { useFormDialog, TransactionsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyTransaction, formToDto } from "../utils";

// types
import { AddTransactionDto, TransactionDto } from "lib";
import { TransactionFormType } from "../types";

export function useAddTransaction() {
  const { t } = useTranslation();

  const manager = useManager();

  const { handleSubmit, ...rest } = useFormDialog<
    TransactionDto,
    AddTransactionDto,
    TransactionDto,
    TransactionFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: emptyTransaction,
    mutationFn: (data) => manager.Transactions.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:accounts.forms.add"),
    ...TransactionsQueryKeys.all(),
  });

  return {
    handleSubmit,
    ...rest,
  };
}
