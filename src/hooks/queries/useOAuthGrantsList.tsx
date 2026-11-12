import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { OAuthGrantDto } from "lib";

import { OAuthQueryKeys } from "./queryKeys/oauthQueryKeys";

/** Apps the signed-in user connected over OAuth (every resource). */
export function useOAuthGrantsList(): UseQueryResult<OAuthGrantDto[]> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...OAuthQueryKeys.grants(),
    enabled: !!account?.id,
    queryFn: () => manager.OAuth.listGrants(),
  });
}
