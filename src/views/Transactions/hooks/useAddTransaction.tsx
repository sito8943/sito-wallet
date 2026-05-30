import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys, TransactionsQueryKeys } from "hooks";

// utils
import { addEmptyTransaction, formToDto } from "../utils";

// types
import type {
  AddTransactionDialogPropsType,
  TransactionFormType,
  UseAddTransactionDialogActionPropsType,
} from "../types";

// lib
import type { AddTransactionDto, TransactionDto } from "lib";

export function useAddTransaction(
  props: UseAddTransactionDialogActionPropsType,
): AddTransactionDialogPropsType {
  const { account } = props;

  const { t } = useTranslation();

  const manager = useManager();
  const queryClient = useQueryClient();

  const { showErrorNotification } = useNotification();

  const { handleSubmit, setError, ...rest } = usePostDialog<
    AddTransactionDto,
    TransactionDto,
    TransactionFormType
  >({
    formToDto,
    defaultValues: addEmptyTransaction(account),
    mutationFn: (data) => manager.Transactions.insert(data),
    onSuccessMessage: t("_pages:common.actions.add.successMessage"),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ ...AccountsQueryKeys.all() }),
        queryClient.invalidateQueries({
          queryKey: [...TransactionsQueryKeys.all().queryKey, "weekly"],
        }),
        queryClient.invalidateQueries({
          queryKey: [...TransactionsQueryKeys.all().queryKey, "groupedByType"],
        }),
        queryClient.invalidateQueries({
          queryKey: [...TransactionsQueryKeys.all().queryKey, "typeResume"],
        }),
      ]);
    },
    title: t("_pages:transactions.forms.add"),
    onError: (error) => {
      if (error.message === "balance.greaterThan0") {
        setError?.(
          "amount",
          { message: t("_entities:account.balance.greaterThan0") },
          {
            shouldFocus: true,
          },
        );
        showErrorNotification({
          message: t("_entities:account.balance.greaterThan0"),
        });
        return;
      }

      showErrorNotification({
        message: error.message || t("_accessibility:errors.500"),
      });
    },
    ...TransactionsQueryKeys.all(),
  });

  return {
    handleSubmit,
    account,
    ...rest,
  };
}
