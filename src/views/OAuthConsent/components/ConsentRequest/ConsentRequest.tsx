import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCircleInfo,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { Button } from "@sito/dashboard-app";

// components
import { McpAccessSelector, McpCapabilityList } from "components";
import { ConsentCard } from "../ConsentCard";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// types
import { ConsentDecision, type ConsentRequestPropsType } from "../../types";

/** Who is asking, what it gets, its access level and the Allow / Deny answer. */
export function ConsentRequest(props: ConsentRequestPropsType) {
  const {
    request,
    email,
    access,
    onAccessChange,
    pendingDecision,
    isSubmitting,
    onDecide,
    onSwitchAccount,
  } = props;
  const { t } = useTranslation();

  const names = {
    client: request.clientName,
    resource: request.resourceName,
    host: request.redirectHost,
    interpolation: RAW_INTERPOLATION,
  };

  return (
    <ConsentCard>
      <h2 className="oauth-consent-title">
        {t("_pages:oauthConsent.heading", names)}
      </h2>

      <div className="oauth-consent-account">
        <FontAwesomeIcon
          icon={faUserCircle}
          className="oauth-consent-account-icon"
        />
        <div className="oauth-consent-account-content">
          <span className="oauth-consent-muted">
            {t("_pages:oauthConsent.account")}
          </span>
          <span className="oauth-consent-account-email">{email}</span>
        </div>
        <button
          type="button"
          className="oauth-consent-link"
          disabled={isSubmitting}
          onClick={onSwitchAccount}
        >
          {t("_pages:oauthConsent.switchAccount")}
        </button>
      </div>

      <div className="oauth-consent-section">
        <h3 className="oauth-consent-subtitle">
          {t("_pages:oauthConsent.capabilitiesTitle", names)}
        </h3>
        <McpCapabilityList />
      </div>

      <McpAccessSelector
        name="oauthAccess"
        value={access}
        onChange={onAccessChange}
        disabled={isSubmitting}
      />

      <ul className="oauth-consent-notes">
        <li className="oauth-consent-note">
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          <span>{t("_pages:oauthConsent.redirect", names)}</span>
        </li>
        <li className="oauth-consent-note">
          <FontAwesomeIcon icon={faCircleInfo} />
          <span>{t("_pages:oauthConsent.revokeNote")}</span>
        </li>
      </ul>

      <p className="oauth-consent-trust" role="note">
        {t("_pages:oauthConsent.trust", names)}
      </p>

      <div className="oauth-consent-actions">
        <Button
          type="button"
          variant="outlined"
          color="primary"
          className="oauth-consent-button"
          disabled={isSubmitting}
          aria-busy={pendingDecision === ConsentDecision.Deny}
          onClick={() => onDecide(ConsentDecision.Deny)}
        >
          {t("_pages:oauthConsent.deny")}
        </Button>
        <Button
          type="button"
          variant="submit"
          color="primary"
          className="oauth-consent-button"
          disabled={isSubmitting}
          aria-busy={pendingDecision === ConsentDecision.Approve}
          onClick={() => onDecide(ConsentDecision.Approve)}
        >
          {t("_pages:oauthConsent.allow")}
        </Button>
      </div>
    </ConsentCard>
  );
}
