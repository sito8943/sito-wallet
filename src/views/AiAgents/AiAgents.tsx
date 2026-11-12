import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { Page } from "@sito/dashboard-app";

// hooks
import { ApiKeysQueryKeys, useApiKeysList, useMobileNavbar } from "hooks";

// lib
import { getMcpUrl } from "lib";

// components
import {
  ApiKeysSection,
  CodeSnippet,
  CreateApiKeyDialog,
  CreatedApiKeyDialog,
  McpIntro,
  McpSetupInstructions,
  RevokeApiKeyDialog,
} from "./components";

// hooks
import { useCreateApiKeyDialog, useRevokeApiKeyDialog } from "./hooks";

// config
import { config } from "../../config";

import "./styles.css";

const MCP_URL = getMcpUrl(config.apiUrl);

/** Personal API keys and setup instructions to connect AI agents (MCP). */
export function AiAgents() {
  const { t } = useTranslation();
  const title = t("_pages:aiAgents.title");

  const apiKeysQuery = useApiKeysList();
  const createApiKey = useCreateApiKeyDialog();
  const revokeApiKey = useRevokeApiKeyDialog();

  useMobileNavbar(title);

  return (
    <Page title={title} queryKey={ApiKeysQueryKeys.all().queryKey}>
      <div className="ai-agents-view">
        <McpIntro />
        <ApiKeysSection
          apiKeys={apiKeysQuery.data ?? []}
          isLoading={apiKeysQuery.isLoading}
          hasError={!!apiKeysQuery.error}
          onRetry={() => void apiKeysQuery.refetch()}
          onCreate={() => createApiKey.openDialog()}
          onRevoke={revokeApiKey.openForKey}
        />
        <section className="ai-agents-card ai-agents-card--wide base-border">
          <h3 className="ai-agents-card-title">
            {t("_pages:aiAgents.setup.title")}
          </h3>
          <p className="ai-agents-text">
            {t("_pages:aiAgents.setup.description")}
          </p>
          <CodeSnippet
            code={MCP_URL}
            label={t("_pages:aiAgents.setup.urlLabel")}
            copyLabel={t("_pages:aiAgents.setup.copyUrl")}
            wrap
          />
          <McpSetupInstructions mcpUrl={MCP_URL} />
        </section>
      </div>
      <CreateApiKeyDialog {...createApiKey} />
      <CreatedApiKeyDialog
        createdKey={createApiKey.createdKey}
        mcpUrl={MCP_URL}
        handleClose={createApiKey.clearCreatedKey}
      />
      <RevokeApiKeyDialog {...revokeApiKey} />
    </Page>
  );
}
