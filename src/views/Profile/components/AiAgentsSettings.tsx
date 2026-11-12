import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRobot } from "@fortawesome/free-solid-svg-icons";

// lib
import { AppRoutes } from "lib";

import "./styles.css";

/** Entry point to the AI agents (MCP) page. */
export function AiAgentsSettings() {
  const { t } = useTranslation();

  return (
    <div className="profile-form-shell base-border">
      <section id="ai-agents" className="profile-section-appearance">
        <div className="profile-section-heading">
          <h3 className="profile-section-title">
            {t("_pages:profile.sections.aiAgents")}
          </h3>
          <p className="profile-section-helper">
            {t("_pages:profile.helper.aiAgents")}
          </p>
        </div>
        <Link to={AppRoutes.aiAgents} className="profile-link">
          <FontAwesomeIcon icon={faRobot} />
          {t("_pages:profile.actions.aiAgents")}
        </Link>
      </section>
    </div>
  );
}
