import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// hooks
import { ApiKeysQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { ApiKeyDto } from "lib";

// constants
import { RAW_INTERPOLATION } from "../constants";

// types
import type { UseRevokeApiKeyDialogReturnType } from "../types";

/** Confirmation before revoking a key (it stops working immediately). */
export function useRevokeApiKeyDialog(): UseRevokeApiKeyDialogReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { showSuccessNotification } = useNotification();
  const handleMutationError = useMutationErrorHandler();

  const [target, setTarget] = useState<ApiKeyDto | null>(null);

  const handleClose = useCallback(() => setTarget(null), []);

  const mutation = useMutation({
    mutationFn: (id: number) => manager.ApiKeys.revoke(id),
    onSuccess: async () => {
      showSuccessNotification({
        message: t("_pages:aiAgents.keys.revoke.successMessage"),
      });
      setTarget(null);
      await queryClient.invalidateQueries({ ...ApiKeysQueryKeys.all() });
    },
    onError: (error) => handleMutationError(error),
  });

  const handleSubmit = useCallback(() => {
    if (!target || mutation.isPending) return;
    mutation.mutate(target.id);
  }, [mutation, target]);

  const openForKey = useCallback((apiKey: ApiKeyDto) => setTarget(apiKey), []);

  return {
    open: target !== null,
    title: t("_pages:aiAgents.keys.revoke.title", {
      name: target?.name ?? "",
      interpolation: RAW_INTERPOLATION,
    }),
    isLoading: mutation.isPending,
    handleSubmit,
    handleClose,
    target,
    openForKey,
  };
}
