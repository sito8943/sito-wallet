import { createContext, useContext } from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { AppApiClient } from "../api/AppApiClient";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
});

// 2. the persister
const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const AppApiClientContext = createContext({});

/**
 * AppApiClientProvider
 * @param {object} props - Props
 * @returns {object} React component
 */
const AppApiClientProvider = (props) => {
  // eslint-disable-next-line react/prop-types
  const { children } = props;

  const appApiClient = new AppApiClient();

  return (
    <AppApiClientContext.Provider value={{ client: appApiClient }}>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister }}
      >
        {children}
      </PersistQueryClientProvider>
    </AppApiClientContext.Provider>
  );
};

/**
 * @returns {AppApiClient} AppApiClient
 */
const useAppApiClient = () => {
  const context = useContext(AppApiClientContext);
  if (context === undefined) {
    throw new Error(
      "useAppApiClient must be used within a AppApiClientProvider"
    );
  }
  return context.client;
};

// eslint-disable-next-line react-refresh/only-export-components
export { queryClient, AppApiClientProvider, useAppApiClient };
