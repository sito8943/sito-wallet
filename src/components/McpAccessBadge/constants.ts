import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faEye, faPen, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

// lib
import { McpAccess } from "lib";

/** Icon of each access level. */
export const MCP_ACCESS_BADGE_ICONS: Record<McpAccess, IconDefinition> = {
  [McpAccess.Full]: faPenToSquare,
  [McpAccess.Read]: faEye,
  [McpAccess.Write]: faPen,
};
