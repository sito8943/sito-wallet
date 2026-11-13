// lib
import type { McpArea } from "lib";

export interface McpAreaSelectorPropsType {
  value: McpArea[];
  onChange: (areas: McpArea[]) => void;
  /** Checkbox group name; give each selector on a page its own. */
  name?: string;
  disabled?: boolean;
  /** Shown under the options, e.g. when none is selected. */
  error?: string;
  className?: string;
}
