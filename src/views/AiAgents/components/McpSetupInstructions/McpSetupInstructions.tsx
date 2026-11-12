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
import { RAW_INTERPOLATION } from "../../constants";

// components
import { CodeSnippet } from "../CodeSnippet";

// types
import type { McpSetupInstructionsPropsType } from "../../types";

/** One tab per AI client with its ready-to-paste snippet. */
export function McpSetupInstructions(props: McpSetupInstructionsPropsType) {
  const { mcpUrl, apiKey } = props;
  const { t } = useTranslation();

  const tabs = useMemo<TabsType<McpClient>[]>(
    () =>
      MCP_CLIENTS.map((client) => ({
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
      })),
    [apiKey, mcpUrl, t],
  );

  return (
    <TabsLayout<McpClient>
      tabs={tabs}
      defaultTab={McpClient.ClaudeCode}
      useLinks={false}
      className="ai-agents-setup-tabs"
    />
  );
}
