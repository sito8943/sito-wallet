import type { CreateApiKeyFormType } from "./types";

export const CREATE_API_KEY_DEFAULT_VALUES: CreateApiKeyFormType = {
  name: "",
};

/** Ellipsis appended to the visible key prefix. */
export const API_KEY_PREFIX_SUFFIX = "…";

/**
 * React already escapes text: skip i18next HTML escaping so dates, paths and
 * key names render as typed (e.g. "11/12/2026", "~/.codex/config.toml").
 */
export const RAW_INTERPOLATION = { escapeValue: false } as const;

/** Setup tab for remote connectors (ChatGPT, claude.ai): OAuth, no API key. */
export const MCP_CONNECTOR_TAB = "connector" as const;

/** Steps of the connector tab (`_pages:aiAgents.setup.connector.steps.*`). */
export const MCP_CONNECTOR_STEP_KEYS = [
  "open",
  "url",
  "oauth",
  "approve",
] as const;
