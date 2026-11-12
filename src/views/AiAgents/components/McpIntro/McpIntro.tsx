import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faWarning } from "@fortawesome/free-solid-svg-icons";

// constants
import { MCP_CAPABILITY_KEYS } from "../../constants";

/** What MCP is for, what an agent can do and the security note. */
export function McpIntro() {
  const { t } = useTranslation();

  return (
    <section className="ai-agents-card base-border">
      <h3 className="ai-agents-card-title">
        {t("_pages:aiAgents.intro.title")}
      </h3>
      <p className="ai-agents-text">{t("_pages:aiAgents.intro.description")}</p>
      <div className="ai-agents-capabilities">
        <h4 className="ai-agents-subtitle">
          {t("_pages:aiAgents.intro.capabilitiesTitle")}
        </h4>
        <ul className="ai-agents-capabilities-list">
          {MCP_CAPABILITY_KEYS.map((key) => (
            <li key={key} className="ai-agents-capability">
              <FontAwesomeIcon
                icon={faCheck}
                className="ai-agents-capability-icon"
              />
              <span>{t(`_pages:aiAgents.intro.capabilities.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
      <p className="ai-agents-warning" role="note">
        <FontAwesomeIcon icon={faWarning} />
        <span>{t("_pages:aiAgents.intro.security")}</span>
      </p>
    </section>
  );
}
