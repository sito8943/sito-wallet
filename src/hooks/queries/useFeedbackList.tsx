import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// lib
import { isAdminSession } from "lib";
import type { FeedbackDto } from "lib";

import { FeedbackQueryKeys } from "./queryKeys/feedbackQueryKeys";

/** Feedback inbox, newest first. Only fetched for admin sessions. */
export function useFeedbackList(): UseQueryResult<FeedbackDto[]> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...FeedbackQueryKeys.list(),
    enabled: isAdminSession(account),
    queryFn: () => manager.Feedback.list(),
  });
}
