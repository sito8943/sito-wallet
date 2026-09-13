import { useEffect, useMemo, useState } from "react";

// react-query
import { useQueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

// @sito/dashboard-app
import { useAuth } from "@sito/dashboard-app";

// config
import { config } from "../../config";

// types
import type { BasicProviderPropTypes } from "../types";

// constants
import { QUERY_CACHE_MAX_AGE_MS } from "./constants";

// utils
import {
  createQueryPersister,
  readQueryCacheOwner,
  writeQueryCacheOwner,
} from "./utils";

/**
 * Mirrors the query cache into local storage so a cold start without network
 * still has data to render. Without it an offline reload came up empty, since
 * nothing survives the page unload.
 */
export const QueryPersistenceProvider = ({
  children,
}: BasicProviderPropTypes) => {
  const queryClient = useQueryClient();
  const { account } = useAuth();
  const [persister] = useState(createQueryPersister);

  const accountId = account?.id ? String(account.id) : "";

  useEffect(() => {
    if (!persister || !accountId) return;
    if (readQueryCacheOwner() === accountId) return;

    // Another account owns the cache on this device. Drop it before anything
    // can read it back. An empty `accountId` is not enough to act on: the
    // session restores asynchronously, so it also means "not known yet".
    queryClient.clear();
    void persister.removeClient();
    writeQueryCacheOwner(accountId);
  }, [accountId, persister, queryClient]);

  const persistOptions = useMemo(
    () =>
      persister
        ? {
            persister,
            maxAge: QUERY_CACHE_MAX_AGE_MS,
            // A new deploy may change response shapes, so drop the old cache.
            buster: config.appVersion ?? "",
          }
        : null,
    [persister],
  );

  if (!persistOptions) return <>{children}</>;

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={persistOptions}
    >
      {children}
    </PersistQueryClientProvider>
  );
};
