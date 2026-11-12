import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { OAuthRequestDto } from "lib";

import { OAuthQueryKeys } from "./queryKeys/oauthQueryKeys";

/**
 * Pending OAuth authorization request shown on the consent page. Never served
 * from cache: it changes state on sito-auth (expires, gets used).
 */
export function useOAuthRequest(
  requestId: string | null,
): UseQueryResult<OAuthRequestDto> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...OAuthQueryKeys.request(requestId ?? ""),
    enabled: !!requestId && !!account?.id,
    queryFn: () => manager.OAuth.getRequest(requestId ?? ""),
    gcTime: 0,
    staleTime: 0,
  });
}
