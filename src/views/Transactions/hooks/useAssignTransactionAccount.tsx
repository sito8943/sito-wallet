import { useCallback } from "react";
import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { UseActionDialog, usePostDialog } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// hooks
import { TransactionsQueryKeys } from "hooks";

// lib
import { AssignTransactionAccountDto, TransactionDto } from "lib";

// types
import { AssignTransactionAccountFormType, TransactionActions } from "../types";

// utils
import { assignAccountFormToDto, emptyAssignAccountForm } from "../utils";

export function useAssignTransactionAccountAction(): UseActionDialog<
  TransactionDto,
  AssignTransactionAccountFormType
> {
  const { t } = useTranslation();

  const manager = useManager();

  const dialog = usePostDialog<
    AssignTransactionAccountDto,
    number,
    AssignTransactionAccountFormType
  >({
    formToDto: assignAccountFormToDto,
    defaultValues: emptyAssignAccountForm(),
    mutationFn: (data) => manager.Transactions.assignAccount(data),
    onSuccessMessage: t(
      "_pages:transactions.actions.assignAccount.successMessage",
    ),
    title: t("_pages:transactions.actions.assignAccount.title"),
    ...TransactionsQueryKeys.all(),
  });

  const { openDialog, reset, isLoading } = dialog;

  const handleOpenDialog = useCallback(
    (transactions: TransactionDto[]) => {
      reset?.({
        account: null,
        transactionIds: transactions.map((item) => item.id),
      });
      openDialog();
    },
    [openDialog, reset],
  );

  const action = useCallback(
    (record: TransactionDto) => ({
      id: TransactionActions.AssignAccount,
      tooltip: t("_pages:transactions.actions.assignAccount.text"),
      icon: (
        <FontAwesomeIcon
          className="text-bg-primary"
          icon={faArrowRightArrowLeft}
        />
      ),
      onClick: () => handleOpenDialog([record]),
      multiple: true,
      onMultipleClick: handleOpenDialog,
      disabled: isLoading || !!record.deletedAt,
      hidden: !!record.deletedAt,
    }),
    [handleOpenDialog, isLoading, t],
  );

  return {
    action,
    ...dialog,
  };
}
