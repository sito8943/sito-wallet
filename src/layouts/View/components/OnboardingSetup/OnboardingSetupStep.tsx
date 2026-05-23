import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUpload,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// types
import type { OnboardingSetupStepPropsType } from "./types";

export function OnboardingSetupStep(props: OnboardingSetupStepPropsType) {
  const { titleKey, descriptionKey, createIcon, onCreate, onImport, onPrefab } =
    props;
  const { t } = useTranslation();

  return (
    <div className="onboarding-setup">
      <p className="onboarding-setup-title">{t(titleKey)}</p>
      <p className="onboarding-setup-description">{t(descriptionKey)}</p>
      <div className="onboarding-setup-actions">
        <Button variant="outlined" onClick={onCreate}>
          <span className="onboarding-setup-button-content">
            <FontAwesomeIcon icon={createIcon} />
            <span className="max-sm:hidden">
              {t("_accessibility:buttons.create")}
            </span>
          </span>
        </Button>
        {onImport && (
          <Button variant="outlined" onClick={onImport}>
            <span className="onboarding-setup-button-content">
              <FontAwesomeIcon icon={faCloudUpload} />
              <span className="max-sm:hidden">
                {t("_accessibility:buttons.import")}
              </span>
            </span>
          </Button>
        )}
        {onPrefab && (
          <Button variant="submit" color="primary" onClick={onPrefab}>
            <span className="onboarding-setup-button-content">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              <span className="max-sm:hidden">
                {t("_pages:prefabs.trySuggestions")}
              </span>
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
