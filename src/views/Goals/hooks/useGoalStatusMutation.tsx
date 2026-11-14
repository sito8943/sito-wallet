import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// hooks
import { GoalsQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// types
import type { GoalStatusAction, GoalStatusMutationVariables } from "../types";

/** Completes or reopens a goal right away (no confirmation). */
export function useGoalStatusMutation() {
  const { t } = useTranslation();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { showSuccessNotification } = useNotification();
  const handleMutationError = useMutationErrorHandler();

  const mutation = useMutation({
    mutationFn: ({ id, action }: GoalStatusMutationVariables) =>
      manager.Goals[action](id),
    onSuccess: async (_, { action }) => {
      showSuccessNotification({
        message: t(`_pages:goals.actions.${action}.successMessage`),
      });
      await queryClient.invalidateQueries({ ...GoalsQueryKeys.all() });
    },
    onError: (error) => handleMutationError(error),
  });

  const { mutate, isPending, variables } = mutation;

  const run = useCallback(
    (id: number, action: GoalStatusAction) => {
      if (isPending) return;
      mutate({ id, action });
    },
    [isPending, mutate],
  );

  return {
    run,
    pendingId: isPending ? (variables?.id ?? null) : null,
  };
}
