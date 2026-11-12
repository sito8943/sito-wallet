import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkSlash, faPlug } from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// lib
import { formatDateTime } from "lib";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// types
import type { ConnectedAppListItemPropsType } from "../../types";

export function ConnectedAppListItem(props: ConnectedAppListItemPropsType) {
  const { grant, onDisconnect, disabled } = props;
  const { t } = useTranslation();
  const disconnectLabel = t("_pages:aiAgents.apps.disconnectAction");

  return (
    <li className="ai-agents-key">
      <span className="ai-agents-key-icon">
        <FontAwesomeIcon icon={faPlug} />
      </span>
      <div className="ai-agents-key-content">
        <p className="ai-agents-key-name">{grant.clientName}</p>
        <p className="ai-agents-key-meta">
          <span>
            {t("_pages:aiAgents.apps.connectedAt", {
              date: formatDateTime(grant.createdAt),
              interpolation: RAW_INTERPOLATION,
            })}
          </span>
          <span>
            {grant.lastUsedAt
              ? t("_pages:aiAgents.keys.lastUsed", {
                  date: formatDateTime(grant.lastUsedAt),
                  interpolation: RAW_INTERPOLATION,
                })
              : t("_pages:aiAgents.keys.neverUsed")}
          </span>
        </p>
      </div>
      <IconButton
        icon={faLinkSlash}
        type="button"
        color="error"
        disabled={disabled}
        aria-label={`${disconnectLabel}: ${grant.clientName}`}
        data-tooltip-id="tooltip"
        data-tooltip-content={disconnectLabel}
        onClick={() => onDisconnect(grant)}
      />
    </li>
  );
}
