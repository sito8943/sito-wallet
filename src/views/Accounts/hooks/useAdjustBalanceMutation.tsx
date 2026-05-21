import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import {
  isHttpError,
  useNotification,
  usePostDialog,
} from "@sito/dashboard-app";

// hooks
import { useAdjustBalanceAction } from "./useAdjustBalanceAction";
import { AccountsQueryKeys, TransactionsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { AccountDto, AdjustBalanceDto, TransactionDto } from "lib";

// types
import type { AdjustBalanceFormType } from "../types";
import {
  adjustBalanceDefaultValues,
  adjustBalanceFormToDto,
} from "./adjustBalanceMutation.utils";

export const useAdjustBalanceMutation = () => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const queryClient = useQueryClient();

  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null,
  );

  const formDialog = usePostDialog<
    AdjustBalanceDto,
    TransactionDto,
    AdjustBalanceFormType
  >({
    formToDto: adjustBalanceFormToDto,
    defaultValues: adjustBalanceDefaultValues,
    mutationFn: (data) =>
      manager.Accounts.adjustBalance(selectedAccount?.id ?? 0, data),
    onSuccessMessage: t("_pages:accounts.actions.adjustBalance.successMessage"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
      setSelectedAccount(null);
    },
    onError: (error) => {
      const message = isHttpError(error)
        ? t(`_accessibility:errors.${error.status}`, {
            defaultValue: t("_accessibility:errors.500"),
          })
        : error.message || t("_accessibility:errors.500");

      showErrorNotification({ message });
    },
    title: t("_pages:accounts.actions.adjustBalance.dialog.title"),
    ...AccountsQueryKeys.all(),
  });

  const handleOpen = useCallback(
    (record: AccountDto) => {
      setSelectedAccount(record);
      formDialog.openDialog();
    },
    [formDialog],
  );

  const { action } = useAdjustBalanceAction({
    onClick: handleOpen,
  });

  return {
    ...formDialog,
    action,
    selectedAccount,
  };
};
