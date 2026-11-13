import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// @sito/dashboard-app
import { useNotification } from "@sito/dashboard-app";

// hooks
import { FeedbackQueryKeys, useMutationErrorHandler } from "hooks";

// providers
import { useManager } from "providers";

// lib
import type { FeedbackDto } from "lib";

// utils
import { isFeedbackResolved } from "../utils";

// types
import type {
  SetFeedbackResolvedVariablesType,
  UseSetFeedbackResolvedReturnType,
} from "../types";

/** Marks a feedback entry as resolved or reopens it (no confirmation). */
export function useSetFeedbackResolved(): UseSetFeedbackResolvedReturnType {
  const { t } = useTranslation();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { showSuccessNotification } = useNotification();
  const handleMutationError = useMutationErrorHandler();

  const mutation = useMutation({
    mutationFn: ({ id, resolved }: SetFeedbackResolvedVariablesType) =>
      manager.Feedback.setResolved(id, resolved),
    onSuccess: async (_, { resolved }) => {
      showSuccessNotification({
        message: t(
          resolved
            ? "_pages:feedback.resolve.successMessage"
            : "_pages:feedback.reopen.successMessage",
        ),
      });
      await queryClient.invalidateQueries({ ...FeedbackQueryKeys.all() });
    },
    onError: (error) => handleMutationError(error),
  });

  const toggleResolved = useCallback(
    (entry: FeedbackDto) => {
      if (mutation.isPending) return;
      mutation.mutate({ id: entry.id, resolved: !isFeedbackResolved(entry) });
    },
    [mutation],
  );

  return {
    toggleResolved,
    pendingId: mutation.isPending ? (mutation.variables?.id ?? null) : null,
  };
}
