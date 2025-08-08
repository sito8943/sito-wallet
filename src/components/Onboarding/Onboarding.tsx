import { useMemo, useState } from "react";

// components
import { TabsLayout } from "../TabsLayout";
import { Step } from "./Step";

// styles
import "./styles.css";

const steps = [
  "welcome",
  "currencies",
  "accounts",
  "transactions",
  "get_started",
];

export const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const onboardingSteps = useMemo(() => {
    return steps.map((step, i) => ({
      id: i + 1,
      label: "",
      content: (
        <Step
          translation={step}
          final={i === steps.length - 1}
          onClickNext={() => setCurrentStep(currentStep + 1)}
        />
      ),
    }));
  }, [currentStep]);

  return (
    <div className="onboarding-main">
      <TabsLayout defaultTab={currentStep} tabs={onboardingSteps} />
    </div>
  );
};
