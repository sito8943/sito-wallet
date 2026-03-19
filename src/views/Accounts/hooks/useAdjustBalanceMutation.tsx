import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { useNotification, queryClient } from "@sito/dashboard-app";

// hooks
import { useAdjustBalanceAction } from "./useAdjustBalanceAction";
import { AccountsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

// lib
import { AccountDto, AdjustBalanceDto } from "lib";

export const useAdjustBalanceMutation = () => {
  const { t } = useTranslation();

  const manager = useManager();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const [selectedAccount, setSelectedAccount] = useState<AccountDto | null>(
    null
  );
  const [open, setOpen] = useState(false);

  const mutate = useMutation<
    number,
    Error,
    { accountId: number; data: AdjustBalanceDto }
  >({
    mutationFn: ({ accountId, data }) =>
      manager.Accounts.adjustBalance(accountId, data),
    onError: (error: Error) => {
      showErrorNotification({ message: error.message });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
      showSuccessNotification({
        message: t("_pages:accounts.actions.adjustBalance.successMessage"),
      });
      setOpen(false);
      setSelectedAccount(null);
    },
  });

  const handleOpen = useCallback((record: AccountDto) => {
    setSelectedAccount(record);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    setSelectedAccount(null);
  }, []);

  const handleSubmit = useCallback(
    (data: AdjustBalanceDto) => {
      if (!selectedAccount) return;
      mutate.mutate({ accountId: selectedAccount.id, data });
    },
    [selectedAccount, mutate]
  );

  const { action } = useAdjustBalanceAction({
    onClick: handleOpen,
  });

  return {
    action,
    open,
    selectedAccount,
    isLoading: mutate.isPending,
    onClose: handleClose,
    onSubmit: handleSubmit,
  };
};
