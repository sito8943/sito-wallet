import { useContext } from "react";

import { OnboardingDraftContext } from "./OnboardingDraftContext";
import type { OnboardingDraftContextValue } from "./types";

export const useOnboardingDraft = (): OnboardingDraftContextValue => {
  const context = useContext(OnboardingDraftContext);

  if (!context) {
    throw new Error(
      "useOnboardingDraft must be used inside <OnboardingDraftProvider>",
    );
  }

  return context;
};
