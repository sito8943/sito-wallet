import type { CreateApiKeyFormType } from "./types";

/** Capabilities listed in the intro (`_pages:aiAgents.intro.capabilities.*`). */
export const MCP_CAPABILITY_KEYS = [
  "read",
  "transactions",
  "transfers",
  "rewards",
] as const;

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
