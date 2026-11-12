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
import { AccountsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { AccountRewardsDto, AdjustRewardsDto } from "lib";

// types
import type { AdjustRewardsAccountType, AdjustRewardsFormType } from "../types";
import {
  adjustRewardsDefaultValues,
  adjustRewardsFormToDto,
} from "./adjustRewardsMutation.utils";

export const useAdjustRewardsMutation = () => {
  const { t } = useTranslation();
  const { showErrorNotification } = useNotification();

  const manager = useManager();
  const queryClient = useQueryClient();

  const [selectedAccount, setSelectedAccount] =
    useState<AdjustRewardsAccountType | null>(null);

  const formDialog = usePostDialog<
    AdjustRewardsDto,
    AccountRewardsDto,
    AdjustRewardsFormType
  >({
    formToDto: adjustRewardsFormToDto,
    defaultValues: adjustRewardsDefaultValues,
    mutationFn: (data) =>
      manager.Accounts.adjustRewards(selectedAccount?.id ?? 0, data),
    onSuccessMessage: t("_pages:accounts.actions.adjustRewards.successMessage"),
    onSuccess: () => {
      void queryClient.invalidateQueries({ ...AccountsQueryKeys.rewardsAll() });
      void queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
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
    title: t("_pages:accounts.actions.adjustRewards.dialog.title"),
  });

  const { openDialog } = formDialog;
  const openForAccount = useCallback(
    (record: AdjustRewardsAccountType) => {
      setSelectedAccount(record);
      openDialog();
    },
    [openDialog],
  );

  return {
    ...formDialog,
    openForAccount,
    selectedAccount,
  };
};
