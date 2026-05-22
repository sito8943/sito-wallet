import { useTranslation } from "react-i18next";

import { Button, Loading } from "@sito/dashboard-app";

import type { WalletOnboardingStepPropsType } from "./types";

export function WalletOnboardingStep(props: WalletOnboardingStepPropsType) {
  const {
    title,
    body,
    content,
    onClickNext,
    onSkip,
    onStartAsGuest,
    onSignIn,
    final = false,
    loading = false,
  } = props;

  const { t } = useTranslation();

  return (
    <div className="big-appear step-container">
      {title != null && <h2 className="step-title">{title}</h2>}
      {body != null && <div className="step-body">{body}</div>}
      {content != null && <div className="step-content">{content}</div>}
      <div className="step-actions">
        {!final ? (
          <>
            <Button
              color="primary"
              className="step-button"
              variant="outlined"
              onClick={onSkip}
              disabled={loading}
              aria-label={t("_accessibility:ariaLabels.skip")}
            >
              {t("_accessibility:buttons.skip")}
            </Button>
            <Button
              color="primary"
              className="step-button"
              variant="outlined"
              onClick={onClickNext}
              disabled={loading}
              aria-label={t("_accessibility:ariaLabels.next")}
            >
              <span className="wallet-onboarding-button-content">
                {loading && (
                  <Loading
                    className="wallet-onboarding-loading"
                    loaderClass="wallet-onboarding-loading-icon"
                    strokeWidth="6"
                  />
                )}
                {t("_accessibility:buttons.next")}
              </span>
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              className="step-button"
              variant="outlined"
              onClick={onStartAsGuest}
              aria-label={t("_accessibility:ariaLabels.startAsGuest")}
            >
              {t("_accessibility:buttons.startAsGuest")}
            </Button>
            <Button
              color="primary"
              variant="submit"
              className="step-button"
              aria-label={t("_accessibility:ariaLabels.signIn")}
              onClick={onSignIn}
            >
              {t("_accessibility:buttons.signIn")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
