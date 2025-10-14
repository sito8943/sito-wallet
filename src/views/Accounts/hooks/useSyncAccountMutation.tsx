import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

// hooks
import { useSyncAccountAction } from "./useSyncAccountAction";

// providers
import { useNotification } from "@sito/dashboard-app";
import { queryClient } from "@sito/dashboard-app";
import { useManager } from "providers";
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
