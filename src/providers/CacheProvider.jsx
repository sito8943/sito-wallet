import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

const CacheContext = createContext({});

// utils
import { ReactQueryKeys } from "../utils/queryKeys";

// providers
import { useAccount } from "./AccountProvider";
import { useAppApiClient, queryClient } from "./AppApiProvider";

// config
import config from "../config";
import { fromLocal, toLocal } from "../utils/local";

/**
 * CacheProvider
 * @param {object} props - Props
 * @returns {object} React component
 */
const CacheProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  const appApiClient = useAppApiClient();

  const { account } = useAccount();

  const { data, isLoading } = useQuery({
    queryKey: [ReactQueryKeys.Notes, account.user?.id],
    queryFn: () => appApiClient.Note.get(account.user?.id),
    enabled: !!account.user?.id,
  });

  const cachedData = useMemo(() => {
    let cached = null;
    try {
      cached = fromLocal(config.notes, "object");
    } catch (e) {
      console.error(e);
    }
    console.log(data?.items);
    if ((data && !data?.error?.message) || cached) {
      toLocal(config.notes, data?.items ?? cached);
      return data?.items ?? cached;
    } else return undefined;
  }, [data]);

  const refresh = () =>
    queryClient.invalidateQueries([ReactQueryKeys.Notes, account.user?.id]);

  return (
    <CacheContext.Provider
      value={{
        isLoading,
        refresh,
        cache: cachedData,
      }}
    >
      {children}
    </CacheContext.Provider>
  );
};

/**
 * @returns {Cache} Cache
 */
const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error("useCache must be used within a CacheProvider");
  }
  return context;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CacheProvider, useCache };
