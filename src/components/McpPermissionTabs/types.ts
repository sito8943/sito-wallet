// lib
import type { McpAccess, McpArea } from "lib";

// constants
import type { MCP_PERMISSION_TAB } from "./constants";

export type McpPermissionTabId =
  (typeof MCP_PERMISSION_TAB)[keyof typeof MCP_PERMISSION_TAB];

export interface McpPermissionTabsPropsType {
  access: McpAccess;
  onAccessChange: (access: McpAccess) => void;
  areas: McpArea[];
  onAreasChange: (areas: McpArea[]) => void;
  /** Shown under the areas, e.g. when none is selected. */
  areasError?: string;
  disabled?: boolean;
  /** Prefix of the inputs' names. */
  name?: string;
  /** Active tab when the parent controls it (e.g. to show an error). */
  tab?: McpPermissionTabId;
  onTabChange?: (tab: McpPermissionTabId) => void;
  className?: string;
}
