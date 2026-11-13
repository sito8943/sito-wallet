import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// lib
import { formatDateTime, toMcpAccess, toMcpAreas } from "lib";

// components
import { McpAccessBadge } from "components";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// utils
import { formatApiKeyPrefix, getApiKeyAreaLabelKeys } from "../../utils";

// types
import type { ApiKeyListItemPropsType } from "../../types";

export function ApiKeyListItem(props: ApiKeyListItemPropsType) {
  const { apiKey, onEdit, onRevoke, disabled } = props;
  const { t } = useTranslation();
  const editLabel = t("_pages:aiAgents.keys.editAction");
  const revokeLabel = t("_pages:aiAgents.keys.revokeAction");
  const areaLabelKeys = getApiKeyAreaLabelKeys(toMcpAreas(apiKey.areas));

  return (
    <li className="ai-agents-key">
      <span className="ai-agents-key-icon">
        <FontAwesomeIcon icon={faKey} />
      </span>
      <div className="ai-agents-key-content">
        <div className="ai-agents-key-title">
          <p className="ai-agents-key-name">{apiKey.name}</p>
          <McpAccessBadge access={toMcpAccess(apiKey.access)} />
        </div>
        {areaLabelKeys && (
          <p className="ai-agents-key-areas">
            {t("_pages:aiAgents.keys.areas", {
              areas: areaLabelKeys.map((key) => t(key)).join(", "),
              interpolation: RAW_INTERPOLATION,
            })}
          </p>
        )}
        <code className="ai-agents-key-prefix">
          {formatApiKeyPrefix(apiKey.prefix)}
        </code>
        <p className="ai-agents-key-meta">
          <span>
            {t("_pages:aiAgents.keys.createdAt", {
              date: formatDateTime(apiKey.createdAt),
              interpolation: RAW_INTERPOLATION,
            })}
          </span>
          <span>
            {apiKey.lastUsedAt
              ? t("_pages:aiAgents.keys.lastUsed", {
                  date: formatDateTime(apiKey.lastUsedAt),
                  interpolation: RAW_INTERPOLATION,
                })
              : t("_pages:aiAgents.keys.neverUsed")}
          </span>
        </p>
      </div>
      <IconButton
        icon={faPencil}
        type="button"
        disabled={disabled}
        aria-label={`${editLabel}: ${apiKey.name}`}
        data-tooltip-id="tooltip"
        data-tooltip-content={editLabel}
        onClick={() => onEdit(apiKey)}
      />
      <IconButton
        icon={faTrash}
        type="button"
        color="error"
        disabled={disabled}
        aria-label={`${revokeLabel}: ${apiKey.name}`}
        data-tooltip-id="tooltip"
        data-tooltip-content={revokeLabel}
        onClick={() => onRevoke(apiKey)}
      />
    </li>
  );
}
