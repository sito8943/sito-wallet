import { createContext, useContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// manager
import { ManagerProviderContextType, BasicProviderPropTypes } from "./types";

// lib
import { Manager } from "lib";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnMount: true,
      refetchOnReconnect: false,
      retry: false,
      retryOnMount: true,
      refetchOnWindowFocus: false, // default: true
    },
  },
});

const ManagerContext = createContext({} as ManagerProviderContextType);

/**
 * Manager Provider
 * @param props - provider props
 * @returns  React component
 */
const ManagerProvider = (props: BasicProviderPropTypes) => {
  const { children } = props;

  const manager = new Manager();

  return (
    <ManagerContext.Provider value={{ client: manager }}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ManagerContext.Provider>
  );
};

/**
 * useManager hook
 * @returns Provider
 */
const useManager = () => {
  const context = useContext(ManagerContext);

  if (context === undefined)
    throw new Error("managerContext must be used within a Provider");
  return context.client;
};

// eslint-disable-next-line react-refresh/only-export-components
export { queryClient, ManagerProvider, useManager };
