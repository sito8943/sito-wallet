// providers
import { useFeatureFlags } from "providers";

// components
import { WalletOnboardingWizard } from "./components";

// hooks
import { useOnboarding } from "./hooks";

// styles
import "./styles.css";

export function Onboarding() {
  const { isFeatureEnabled } = useFeatureFlags();
  const { initialEnabledEntityKeys, handleExit } = useOnboarding();

  return (
    <main className="onboarding-view">
      <WalletOnboardingWizard
        initialEnabledEntityKeys={initialEnabledEntityKeys}
        showDebtsStep={isFeatureEnabled("debtsEnabled")}
        onExit={handleExit}
      />
    </main>
  );
}
