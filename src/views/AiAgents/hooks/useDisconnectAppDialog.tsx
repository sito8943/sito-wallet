import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// hooks
import { OAuthQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { OAuthGrantDto } from "lib";

// constants
import { RAW_INTERPOLATION } from "../constants";

// types
import type { UseDisconnectAppDialogReturnType } from "../types";

/** Confirmation before revoking an app's OAuth grant on sito-auth. */
export function useDisconnectAppDialog(): UseDisconnectAppDialogReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { showSuccessNotification } = useNotification();
  const handleMutationError = useMutationErrorHandler();

  const [target, setTarget] = useState<OAuthGrantDto | null>(null);

  const handleClose = useCallback(() => setTarget(null), []);

  const mutation = useMutation({
    mutationFn: (id: OAuthGrantDto["id"]) => manager.OAuth.revokeGrant(id),
    onSuccess: async () => {
      showSuccessNotification({
        message: t("_pages:aiAgents.apps.disconnect.successMessage"),
      });
      setTarget(null);
      await queryClient.invalidateQueries({ ...OAuthQueryKeys.grants() });
    },
    onError: (error) => handleMutationError(error),
  });

  const handleSubmit = useCallback(() => {
    if (!target || mutation.isPending) return;
    mutation.mutate(target.id);
  }, [mutation, target]);

  const openForGrant = useCallback(
    (grant: OAuthGrantDto) => setTarget(grant),
    [],
  );

  return {
    open: target !== null,
    title: t("_pages:aiAgents.apps.disconnect.title", {
      name: target?.clientName ?? "",
      interpolation: RAW_INTERPOLATION,
    }),
    isLoading: mutation.isPending,
    handleSubmit,
    handleClose,
    target,
    openForGrant,
  };
}
