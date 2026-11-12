import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";

// components
import { CodeSnippet } from "../CodeSnippet";

// constants
import { MCP_CONNECTOR_STEP_KEYS } from "../../constants";

// types
import type { McpConnectorStepsPropsType } from "../../types";

/** ChatGPT / claude.ai: add a custom connector and approve it here (OAuth). */
export function McpConnectorSteps(props: McpConnectorStepsPropsType) {
  const { mcpUrl } = props;
  const { t } = useTranslation();

  return (
    <div className="ai-agents-setup-tab">
      <ol className="ai-agents-steps">
        {MCP_CONNECTOR_STEP_KEYS.map((key) => (
          <li key={key} className="ai-agents-step">
            <span>{t(`_pages:aiAgents.setup.connector.steps.${key}`)}</span>
            {key === "url" && (
              <CodeSnippet
                code={mcpUrl}
                copyLabel={t("_pages:aiAgents.setup.copyUrl")}
                wrap
              />
            )}
          </li>
        ))}
      </ol>
      <p className="ai-agents-info" role="note">
        <FontAwesomeIcon icon={faCircleInfo} />
        <span>{t("_pages:aiAgents.setup.connector.noKey")}</span>
      </p>
    </div>
  );
}
