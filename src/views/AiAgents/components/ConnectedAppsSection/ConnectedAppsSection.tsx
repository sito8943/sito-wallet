import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Error as ErrorView, Loading } from "@sito/dashboard-app";

// components
import { ConnectedAppListItem } from "../ConnectedAppListItem";

// types
import type { ConnectedAppsSectionPropsType } from "../../types";

/** Apps connected over OAuth (ChatGPT, claude.ai…) with a disconnect action. */
export function ConnectedAppsSection(props: ConnectedAppsSectionPropsType) {
  const { grants, isLoading, hasError, onRetry, onDisconnect } = props;
  const { t } = useTranslation();

  return (
    <section className="ai-agents-card ai-agents-card--wide base-border">
      <div className="ai-agents-card-heading">
        <h3 className="ai-agents-card-title">
          {t("_pages:aiAgents.apps.title")}
        </h3>
        <p className="ai-agents-muted">
          {t("_pages:aiAgents.apps.description")}
        </p>
      </div>
      {hasError ? (
        <ErrorView message={t("_accessibility:errors.500")} onRetry={onRetry} />
      ) : isLoading ? (
        <div className="ai-agents-loading">
          <Loading />
        </div>
      ) : grants.length === 0 ? (
        <p className="ai-agents-empty">{t("_pages:aiAgents.apps.empty")}</p>
      ) : (
        <ul className="ai-agents-keys">
          {grants.map((grant) => (
            <ConnectedAppListItem
              key={grant.id}
              grant={grant}
              onDisconnect={onDisconnect}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
