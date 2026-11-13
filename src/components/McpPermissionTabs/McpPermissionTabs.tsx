import { useState } from "react";
import { useTranslation } from "react-i18next";

// @sito/dashboard-app
import { TabsLayout } from "@sito/dashboard-app";

// lib
import { MCP_AREAS } from "lib";

// components
import { McpAccessSelector } from "../McpAccessSelector";
import { McpAreaSelector } from "../McpAreaSelector";

// constants
import { MCP_PERMISSION_TAB, MCP_PERMISSION_TABS_NAME } from "./constants";

// types
import type { McpPermissionTabId, McpPermissionTabsPropsType } from "./types";

import "./styles.css";

/**
 * Access level and areas of an AI agent connection (API key or connected
 * app) on two tabs. Both panels stay mounted (the inactive one hidden) so a
 * form validates every field whatever tab is open.
 */
export function McpPermissionTabs(props: McpPermissionTabsPropsType) {
  const {
    access,
    onAccessChange,
    areas,
    onAreasChange,
    areasError,
    disabled = false,
    name = MCP_PERMISSION_TABS_NAME,
    tab,
    onTabChange,
    className = "",
  } = props;
  const { t } = useTranslation();
  const [ownTab, setOwnTab] = useState<McpPermissionTabId>(
    MCP_PERMISSION_TAB.access,
  );
  const currentTab = tab ?? ownTab;

  const changeTab = (next: McpPermissionTabId) => {
    setOwnTab(next);
    onTabChange?.(next);
  };

  return (
    <div className={`mcp-permission-tabs ${className}`.trim()}>
      <TabsLayout<McpPermissionTabId>
        tabs={[
          {
            id: MCP_PERMISSION_TAB.access,
            label: t("_pages:aiAgents.access.label"),
            content: null,
          },
          {
            id: MCP_PERMISSION_TAB.areas,
            label: t("_pages:aiAgents.areas.tab", {
              count: areas.length,
              total: MCP_AREAS.length,
            }),
            content: null,
          },
        ]}
        currentTab={currentTab}
        useLinks={false}
        onTabChange={changeTab}
        tabsContainerClassName="mcp-permission-tabs-list"
      />
      <div
        className="mcp-permission-tabs-panel"
        hidden={currentTab !== MCP_PERMISSION_TAB.access}
      >
        <McpAccessSelector
          name={`${name}Access`}
          value={access}
          onChange={onAccessChange}
          disabled={disabled}
        />
      </div>
      <div
        className="mcp-permission-tabs-panel"
        hidden={currentTab !== MCP_PERMISSION_TAB.areas}
      >
        <McpAreaSelector
          name={`${name}Areas`}
          value={areas}
          onChange={onAreasChange}
          disabled={disabled}
          error={areasError}
        />
      </div>
    </div>
  );
}
