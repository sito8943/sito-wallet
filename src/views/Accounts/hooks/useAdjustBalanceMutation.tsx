import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useFormDialog, queryClient } from "@sito/dashboard-app";

// hooks
import { useAdjustBalanceAction } from "./useAdjustBalanceAction";
import { AccountsQueryKeys, TransactionsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

// lib
import { AccountDto, AdjustBalanceDto, TransactionDto } from "lib";

// types
import { AdjustBalanceFormType } from "../types";

const defaultValues: AdjustBalanceFormType = {
  newBalance: "",
  description: "",
};

const formToDto = (data: AdjustBalanceFormType): AdjustBalanceDto => ({
  newBalance: Number(data.newBalance),
  description: data.description || undefined,
});

export const useAdjustBalanceMutation = () => {
  const { t } = useTranslation();

  const manager = useManager();

  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null
  );

  const formDialog = useFormDialog<
    TransactionDto,
    AdjustBalanceDto,
    TransactionDto,
    AdjustBalanceFormType
  >({
    formToDto,
    defaultValues,
    mutationFn: (data) =>
      manager.Accounts.adjustBalance(selectedAccount?.id ?? 0, data),
    onSuccessMessage: t("_pages:accounts.actions.adjustBalance.successMessage"),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...TransactionsQueryKeys.all() });
      setSelectedAccount(null);
    },
    title: t("_pages:accounts.actions.adjustBalance.dialog.title"),
    ...AccountsQueryKeys.all(),
  });

  const handleOpen = useCallback(
    (record: AccountDto) => {
      setSelectedAccount(record);
      formDialog.openDialog();
    },
    [formDialog]
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
