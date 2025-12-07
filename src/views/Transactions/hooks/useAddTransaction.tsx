import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification, useFormDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";

// utils
import { addEmptyTransaction, dtoToForm, formToDto } from "../utils";

// types
import {
  AddTransactionDialogPropsType,
  TransactionFormType,
  UseAddTransactionDialogActionPropsType,
} from "../types";

// lib
import { AddTransactionDto, TransactionDto } from "lib";

export function useAddTransaction(
  props: UseAddTransactionDialogActionPropsType
): AddTransactionDialogPropsType {
  const { account } = props;

  const { t } = useTranslation();

  const manager = useManager();

  const { showErrorNotification } = useNotification();

  const { handleSubmit, setError, ...rest } = useFormDialog<
    TransactionDto,
    AddTransactionDto,
    TransactionDto,
    TransactionFormType
  >({
    formToDto,
    dtoToForm,
    defaultValues: addEmptyTransaction(account),
    mutationFn: (data) => manager.Transactions.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    title: t("_pages:transactions.forms.add"),
    onError: (error) => {
      if (error.message === "balance.greaterThan0") {
        setError?.(
          "amount",
          { message: t("_entities:account.balance.greaterThan0") },
          {
            shouldFocus: true,
          }
        );
        showErrorNotification({
          message: t("_entities:account.balance.greaterThan0"),
        });
      }
    },
    ...TransactionsQueryKeys.all(),
  });

  return {
    handleSubmit,
    account,
    ...rest,
  };
}
