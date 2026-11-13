// lib
import { MCP_AREAS, type McpArea } from "lib";

/** Adds or removes `area`, keeping the display order. */
export const toggleMcpArea = (
  areas: readonly McpArea[],
  area: McpArea,
): McpArea[] => {
  const next = areas.includes(area)
    ? areas.filter((item) => item !== area)
    : [...areas, area];
  return MCP_AREAS.filter((item) => next.includes(item));
};

/** Every area, in display order. */
export const selectAllMcpAreas = (): McpArea[] => [...MCP_AREAS];

/** Checks the unchecked areas and unchecks the checked ones. */
export const invertMcpAreas = (areas: readonly McpArea[]): McpArea[] =>
  MCP_AREAS.filter((area) => !areas.includes(area));
