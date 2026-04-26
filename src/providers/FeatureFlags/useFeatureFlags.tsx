import { useContext } from "react";

// types
import type { FeatureFlagsContextType } from "./types";
import { FeatureFlagsContext } from "./FeatureFlagsContext";

export const useFeatureFlags = (): FeatureFlagsContextType => {
  const context = useContext(FeatureFlagsContext);

  if (!context) {
    throw new Error("useFeatureFlags must be used within FeatureFlagsProvider");
  }

  return context;
};
