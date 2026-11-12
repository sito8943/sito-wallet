import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

// lib
import { AppRoutes } from "lib";

// components
import { ConsentCard } from "../ConsentCard";

/** Unknown, expired or already used request: nothing to decide anymore. */
export function ConsentNotFound() {
  const { t } = useTranslation();

  return (
    <ConsentCard className="oauth-consent-card--centered">
      <FontAwesomeIcon icon={faClock} className="oauth-consent-state-icon" />
      <h2 className="oauth-consent-title">
        {t("_pages:oauthConsent.notFound.title")}
      </h2>
      <p className="oauth-consent-muted">
        {t("_pages:oauthConsent.notFound.body")}
      </p>
      <Link to={AppRoutes.home} className="oauth-consent-link">
        {t("_pages:oauthConsent.notFound.home")}
      </Link>
    </ConsentCard>
  );
}
