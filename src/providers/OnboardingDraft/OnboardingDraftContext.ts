import { createContext } from "react";

import type { OnboardingDraftContextValue } from "./types";

export const OnboardingDraftContext =
  createContext<OnboardingDraftContextValue | null>(null);
