import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faTrash } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// lib
import { formatDateTime } from "lib";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// utils
import { formatApiKeyPrefix } from "../../utils";

// types
import type { ApiKeyListItemPropsType } from "../../types";

export function ApiKeyListItem(props: ApiKeyListItemPropsType) {
  const { apiKey, onRevoke, disabled } = props;
  const { t } = useTranslation();
  const revokeLabel = t("_pages:aiAgents.keys.revokeAction");

  return (
    <li className="ai-agents-key">
      <span className="ai-agents-key-icon">
        <FontAwesomeIcon icon={faKey} />
      </span>
      <div className="ai-agents-key-content">
        <p className="ai-agents-key-name">{apiKey.name}</p>
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
