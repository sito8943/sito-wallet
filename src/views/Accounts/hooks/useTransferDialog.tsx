import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { useNotification, usePostDialog } from "@sito/dashboard-app";

import { useFeatureFlags, useManager } from "providers";

import { useAccountsCommon } from "../../../hooks/queries/useAccountsCommon";
import { AccountsQueryKeys } from "../../../hooks/queries/queryKeys/accountsQueryKeys";
import { TransactionCategoriesQueryKeys } from "../../../hooks/queries/queryKeys/transactionCategoriesQueryKeys";
import { TransactionsQueryKeys } from "../../../hooks/queries/queryKeys/transactionsQueryKeys";

import type {
  AccountDto,
  TransferTransactionDto,
  TransferTransactionResponseDto,
} from "lib";

import type { TransferFormType } from "../types";
import {
  getEligibleTransferAccounts,
  getTransferDefaultValues,
  transferFormToDto,
} from "../utils";
import { useTransferAction } from "./useTransferAction";

const TRANSFER_ERROR_PREFIX = "transactions.transfer.";

export function useTransferDialog() {
  const { t } = useTranslation();
  const manager = useManager();
  const { isFeatureEnabled } = useFeatureFlags();
  const transactionsEnabled = isFeatureEnabled("transactionsEnabled");
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();
  const { data: accountsData } = useAccountsCommon();
  const accounts = useMemo(() => accountsData ?? [], [accountsData]);
  const [sourceAccount, setSourceAccount] = useState<AccountDto | null>(null);

  const formDialog = usePostDialog<
    TransferTransactionDto,
    TransferTransactionResponseDto,
    TransferFormType
  >({
    defaultValues: getTransferDefaultValues(),
    formToDto: (form) => {
      const data = transferFormToDto(form, sourceAccount);
      return {
        ...data,
        description:
          data.description ??
          t("_pages:accounts.actions.transfer.dialog.defaultDescription"),
      };
    },
    mutationFn: (data) => manager.Transactions.transfer(data),
    title: t("_pages:accounts.actions.transfer.dialog.title"),
    onSuccessMessage: t("_pages:accounts.actions.transfer.successMessage"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
      void queryClient.invalidateQueries({
        ...TransactionCategoriesQueryKeys.all(),
      });
    },
    onError: (error) => {
      if (error.message === "balance.greaterThan0") {
        showErrorNotification({
          message: t("_entities:account.balance.greaterThan0"),
        });
        return;
      }

      if (error.message.startsWith(TRANSFER_ERROR_PREFIX)) {
        const errorKey = error.message.slice(TRANSFER_ERROR_PREFIX.length);
        showErrorNotification({
          message: t(`_pages:accounts.actions.transfer.errors.${errorKey}`),
        });
        return;
      }

      showErrorNotification({
        message: error.message || t("_accessibility:errors.500"),
      });
    },
    ...TransactionsQueryKeys.all(),
  });

  const canTransfer = useCallback(
    (account: AccountDto) =>
      transactionsEnabled &&
      getEligibleTransferAccounts(accounts, account).length > 0,
    [accounts, transactionsEnabled],
  );

  const openTransferDialog = useCallback(
    (account: AccountDto) => {
      if (!canTransfer(account)) return;
      setSourceAccount(account);
      formDialog.openDialog();
    },
    [canTransfer, formDialog],
  );

  const { action } = useTransferAction({
    onClick: openTransferDialog,
    canTransfer,
  });

  return {
    ...formDialog,
    sourceAccount,
    accounts,
    action,
    canTransfer,
    openTransferDialog,
  };
}
