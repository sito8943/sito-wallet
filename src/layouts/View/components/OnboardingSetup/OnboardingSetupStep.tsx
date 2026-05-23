import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// types
import type { OnboardingSetupStepPropsType } from "./types";

export function OnboardingSetupStep(props: OnboardingSetupStepPropsType) {
  const { titleKey, descriptionKey, icon } = props;
  const { t } = useTranslation();

  return (
    <div className="onboarding-setup">
      <span className="onboarding-setup-icon">
        <FontAwesomeIcon icon={icon} />
      </span>
      <p className="onboarding-setup-title">{t(titleKey)}</p>
      <p className="onboarding-setup-description">{t(descriptionKey)}</p>
    </div>
  );
}
