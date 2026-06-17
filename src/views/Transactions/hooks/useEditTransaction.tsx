import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import type { UseActionDialog } from "@sito/dashboard-app";
import {
  useEditAction,
  usePutDialog,
  useNotification,
} from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys, TransactionsQueryKeys } from "hooks";

// utils
import { dtoToForm, emptyTransaction, formToDto } from "../utils";

// lib
import type { UpdateTransactionDto, TransactionDto } from "lib";

// types
import type { TransactionFormType } from "../types";

export function useEditTransaction(): UseActionDialog<
  TransactionDto,
  TransactionFormType
> {
  const { t } = useTranslation();

  const manager = useManager();
  const queryClient = useQueryClient();
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
        queryClient.invalidateQueries({
          queryKey: [
            ...TransactionsQueryKeys.all().queryKey,
            "typeResumeBatch",
          ],
        }),
      ]);
    },
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
