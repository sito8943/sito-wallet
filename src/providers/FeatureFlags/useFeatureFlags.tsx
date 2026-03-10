import { createContext, useContext } from "react";

// types
import { FeatureFlagsContextType } from "./types";

export const FeatureFlagsContext = createContext<
  FeatureFlagsContextType | undefined
>(undefined);

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);

  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }

  return context;
};
