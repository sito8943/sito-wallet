// @sito/dashboard-app
import { useDeleteDialog } from "@sito/dashboard-app";

// hooks
import { GoalsQueryKeys } from "hooks";

// providers
import { useManager } from "providers";

/** Confirmation before cancelling goals (same flow as cancelling debts). */
export function useCancelGoalDialog() {
  const manager = useManager();

  return useDeleteDialog({
    mutationFn: async (ids) => {
      const targetIds = Array.isArray(ids) ? ids : [ids];
      await Promise.all(targetIds.map((id) => manager.Goals.cancel(id)));
      return targetIds.length;
    },
    ...GoalsQueryKeys.all(),
  });
}
