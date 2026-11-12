import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { TabsLayout } from "@sito/dashboard-app";
import type { TabsType } from "@sito/dashboard-app";

// lib
import {
  MCP_CLIENTS,
  MCP_CLIENT_CONFIG_FILES,
  McpClient,
  buildMcpSnippet,
} from "lib";

// constants
import { MCP_CONNECTOR_TAB, RAW_INTERPOLATION } from "../../constants";

// components
import { CodeSnippet } from "../CodeSnippet";
import { McpConnectorSteps } from "../McpConnectorSteps";

// types
import type { McpSetupInstructionsPropsType, McpSetupTabId } from "../../types";

/**
 * One tab per AI client with its ready-to-paste snippet, plus the
 * ChatGPT / claude.ai connector tab (OAuth, no API key).
 */
export function McpSetupInstructions(props: McpSetupInstructionsPropsType) {
  const { mcpUrl, apiKey, withConnector = true } = props;
  const { t } = useTranslation();

  const tabs = useMemo<TabsType<McpSetupTabId>[]>(() => {
    const snippetTabs: TabsType<McpSetupTabId>[] = MCP_CLIENTS.map(
      (client) => ({
        id: client,
        label: t(`_pages:aiAgents.setup.clients.${client}`),
        content: (
          <div className="ai-agents-setup-tab">
            <p className="ai-agents-muted">
              {t(`_pages:aiAgents.setup.hints.${client}`, {
                file: MCP_CLIENT_CONFIG_FILES[client],
                interpolation: RAW_INTERPOLATION,
              })}
            </p>
            <CodeSnippet
              code={buildMcpSnippet(client, { url: mcpUrl, apiKey })}
              copyLabel={t("_pages:aiAgents.setup.copySnippet")}
            />
          </div>
        ),
      }),
    );

    if (!withConnector) return snippetTabs;

    return [
      ...snippetTabs,
      {
        id: MCP_CONNECTOR_TAB,
        label: t("_pages:aiAgents.setup.clients.connector"),
        content: <McpConnectorSteps mcpUrl={mcpUrl} />,
      },
    ];
  }, [apiKey, mcpUrl, t, withConnector]);

  return (
    <TabsLayout<McpSetupTabId>
      tabs={tabs}
      defaultTab={McpClient.ClaudeCode}
      useLinks={false}
      className="ai-agents-setup-tabs"
    />
  );
}
