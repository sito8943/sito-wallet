import { useTranslation } from "react-i18next";

// icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkSlash,
  faPencil,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";

// @sito/dashboard-app
import { IconButton } from "@sito/dashboard-app";

// lib
import {
  formatDateTime,
  getMcpAccessFromScopes,
  getMcpAreasFromScopes,
} from "lib";

// components
import { McpAccessBadge } from "components";

// constants
import { RAW_INTERPOLATION } from "../../constants";

// utils
import { getApiKeyAreaLabelKeys } from "../../utils";

// types
import type { ConnectedAppListItemPropsType } from "../../types";

export function ConnectedAppListItem(props: ConnectedAppListItemPropsType) {
  const { grant, onEdit, onDisconnect, disabled } = props;
  const { t } = useTranslation();
  const editLabel = t("_pages:aiAgents.apps.editAction");
  const disconnectLabel = t("_pages:aiAgents.apps.disconnectAction");
  const areaLabelKeys = getApiKeyAreaLabelKeys(
    getMcpAreasFromScopes(grant.scopes),
  );

  return (
    <li className="ai-agents-key">
      <span className="ai-agents-key-icon">
        <FontAwesomeIcon icon={faPlug} />
      </span>
      <div className="ai-agents-key-content">
        <div className="ai-agents-key-title">
          <p className="ai-agents-key-name">{grant.clientName}</p>
          <McpAccessBadge access={getMcpAccessFromScopes(grant.scopes)} />
        </div>
        {areaLabelKeys && (
          <p className="ai-agents-key-areas">
            {t("_pages:aiAgents.keys.areas", {
              areas: areaLabelKeys.map((key) => t(key)).join(", "),
              interpolation: RAW_INTERPOLATION,
            })}
          </p>
        )}
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
        icon={faPencil}
        type="button"
        disabled={disabled}
        aria-label={`${editLabel}: ${grant.clientName}`}
        data-tooltip-id="tooltip"
        data-tooltip-content={editLabel}
        onClick={() => onEdit(grant)}
      />
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
