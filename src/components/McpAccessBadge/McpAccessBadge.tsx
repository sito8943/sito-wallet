import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// lib
import { MCP_ACCESS_KEYS } from "lib";

// constants
import { MCP_ACCESS_BADGE_ICONS } from "./constants";

// types
import type { McpAccessBadgePropsType } from "./types";

import "./styles.css";

/** Small label with the access level of an API key or connected app. */
export function McpAccessBadge(props: McpAccessBadgePropsType) {
  const { access, className = "" } = props;
  const { t } = useTranslation();
  const key = MCP_ACCESS_KEYS[access];

  return (
    <span
      className={`mcp-access-badge mcp-access-badge--${key} ${className}`.trim()}
      data-access={access}
    >
      <FontAwesomeIcon icon={MCP_ACCESS_BADGE_ICONS[access]} />
      <span>{t(`_pages:aiAgents.access.levels.${key}.label`)}</span>
    </span>
  );
}
