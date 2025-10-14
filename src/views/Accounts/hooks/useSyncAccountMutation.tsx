import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app

import { useNotification, queryClient } from "@sito/dashboard-app";

// hooks
import { useSyncAccountAction } from "./useSyncAccountAction";

// providers
import { useManager } from "providers";

// hooks
import { AccountsQueryKeys } from "hooks";

export const useSyncAccountMutation = () => {
  const { t } = useTranslation();

  const manager = useManager();

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const mutate = useMutation<number, Error, number>({
    mutationFn: (id) => manager.Accounts.sync(id),
    onError: (error: Error) => {
      showErrorNotification({ message: error.message });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ ...AccountsQueryKeys.all() });
      showSuccessNotification({
        message: t("_pages:accounts.actions.sync.successMessage"),
      });
    },
  });

  const { action } = useSyncAccountAction({
    isLoading: mutate.isPending,
    onClick: (id) => mutate.mutate(id),
  });

  return {
    action,
  };
};
