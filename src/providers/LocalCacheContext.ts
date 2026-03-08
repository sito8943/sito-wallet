import { createContext, useContext } from "react";

// types
import { LocalCacheProviderContextType } from "./types";

export const LocalCacheContext = createContext<
  LocalCacheProviderContextType | undefined
>(undefined);

export const useLocalCache = (): LocalCacheProviderContextType => {
  const context = useContext(LocalCacheContext);

  if (!context) {
    throw new Error("useLocalCache must be used within LocalCacheProvider");
  }

  return context;
};
