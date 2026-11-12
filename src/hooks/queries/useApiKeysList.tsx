import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// providers
import { useManager } from "providers";

// types
import type { ApiKeyDto } from "lib";

import { ApiKeysQueryKeys } from "./queryKeys/apiKeysQueryKeys";

/** Active personal API keys (MCP) of the signed-in user. */
export function useApiKeysList(): UseQueryResult<ApiKeyDto[]> {
  const manager = useManager();
  const { account } = useAuth();

  return useQuery({
    ...ApiKeysQueryKeys.list(),
    enabled: !!account?.id,
    queryFn: () => manager.ApiKeys.list(),
  });
}
