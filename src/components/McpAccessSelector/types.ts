// lib
import type { McpAccess } from "lib";

export interface McpAccessSelectorPropsType {
  value: McpAccess;
  onChange: (access: McpAccess) => void;
  /** Radio group name; give each selector on a page its own. */
  name?: string;
  disabled?: boolean;
  className?: string;
}
