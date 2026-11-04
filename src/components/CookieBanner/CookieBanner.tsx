import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// providers
import { useConsent } from "providers";

// lib
import { AppRoutes } from "lib";

import "./styles.css";

/**
 * Asks before turning on optional technologies. Accept and reject have the
 * same weight; the choice can be changed in Profile or the cookies policy.
 */
export function CookieBanner() {
  const { t } = useTranslation();
  const { isBannerOpen, setAnalytics } = useConsent();

  if (!isBannerOpen) return null;

  return (
    <section
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-labelledby="cookie-banner-title"
    >
      <div className="cookie-banner-text">
        <h2 id="cookie-banner-title" className="cookie-banner-title">
          {t("_pages:cookieBanner.title")}
        </h2>
        <p>
          {t("_pages:cookieBanner.body")}{" "}
          <Link to={AppRoutes.cookiesPolicy} className="cookie-banner-link">
            {t("_pages:cookieBanner.policy")}
          </Link>
        </p>
      </div>
      <div className="cookie-banner-actions">
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className="cookie-banner-button"
          onClick={() => setAnalytics(false)}
        >
          {t("_pages:cookieBanner.reject")}
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className="cookie-banner-button"
          onClick={() => setAnalytics(true)}
        >
          {t("_pages:cookieBanner.accept")}
        </Button>
      </div>
    </section>
  );
}
