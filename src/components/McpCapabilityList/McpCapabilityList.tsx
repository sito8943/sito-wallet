import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

// lib
import { MCP_CAPABILITY_KEYS } from "lib";

// types
import type { McpCapabilityListPropsType } from "./types";

import "./styles.css";

/** What a connected AI agent can do with the wallet (MCP tools). */
export function McpCapabilityList(props: McpCapabilityListPropsType) {
  const { className = "" } = props;
  const { t } = useTranslation();

  return (
    <ul className={`mcp-capability-list ${className}`.trim()}>
      {MCP_CAPABILITY_KEYS.map((key) => (
        <li key={key} className="mcp-capability">
          <FontAwesomeIcon icon={faCheck} className="mcp-capability-icon" />
          <span>{t(`_pages:aiAgents.intro.capabilities.${key}`)}</span>
        </li>
      ))}
    </ul>
  );
}
