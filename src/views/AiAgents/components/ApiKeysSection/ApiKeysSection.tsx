import { useTranslation } from "react-i18next";

// icons
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @sito/dashboard-app
import { Button, Error as ErrorView, Loading } from "@sito/dashboard-app";

// lib
import { API_KEYS_MAX_ACTIVE } from "lib";

// components
import { ApiKeyListItem } from "../ApiKeyListItem";

// utils
import { isApiKeyLimitReached } from "../../utils";

// types
import type { ApiKeysSectionPropsType } from "../../types";

/** Active keys with create/revoke actions, or the empty state. */
export function ApiKeysSection(props: ApiKeysSectionPropsType) {
  const { apiKeys, isLoading, hasError, onRetry, onCreate, onRevoke } = props;
  const { t } = useTranslation();

  const limitReached = isApiKeyLimitReached(
    apiKeys.length,
    API_KEYS_MAX_ACTIVE,
  );

  return (
    <section className="ai-agents-card base-border">
      <div className="ai-agents-card-header">
        <div className="ai-agents-card-heading">
          <h3 className="ai-agents-card-title">
            {t("_pages:aiAgents.keys.title")}
          </h3>
          {!isLoading && !hasError && (
            <span className="ai-agents-muted">
              {t("_pages:aiAgents.keys.count", {
                count: apiKeys.length,
                max: API_KEYS_MAX_ACTIVE,
              })}
            </span>
          )}
        </div>
        <Button
          type="button"
          color="primary"
          variant="submit"
          disabled={isLoading || hasError || limitReached}
          onClick={onCreate}
        >
          <FontAwesomeIcon icon={faPlus} />
          {t("_pages:aiAgents.keys.create")}
        </Button>
      </div>
      {limitReached && (
        <p className="ai-agents-muted">
          {t("_pages:aiAgents.keys.limitReached", { max: API_KEYS_MAX_ACTIVE })}
        </p>
      )}
      {hasError ? (
        <ErrorView message={t("_accessibility:errors.500")} onRetry={onRetry} />
      ) : isLoading ? (
        <div className="ai-agents-loading">
          <Loading />
        </div>
      ) : apiKeys.length === 0 ? (
        <p className="ai-agents-empty">{t("_pages:aiAgents.keys.empty")}</p>
      ) : (
        <ul className="ai-agents-keys">
          {apiKeys.map((apiKey) => (
            <ApiKeyListItem
              key={apiKey.id}
              apiKey={apiKey}
              onRevoke={onRevoke}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
