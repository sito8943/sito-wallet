import type { CSSProperties, HTMLAttributes } from "react";

// @sito/dashboard-app
import type { IconButtonPropsType, QueryResult } from "@sito/dashboard-app";

// lib
import type { DashboardDto } from "lib";

export interface DashboardDragStateType {
  activeId: number | null;
  offsetX: number;
  offsetY: number;
  overId: number | null;
}

export interface UseDashboardReorderPropsType {
  items: DashboardDto[];
  allItems?: DashboardDto[];
  enabled?: boolean;
}

export interface DashboardListItemPropsType extends HTMLAttributes<HTMLLIElement> {
  "data-dashboard-card-id": number;
  style?: CSSProperties;
}

export type DashboardHandlePropsType = Omit<IconButtonPropsType, "icon">;

export interface UseDashboardReorderReturnType {
  items: DashboardDto[];
  isReordering: boolean;
  getItemProps: (id: number) => DashboardListItemPropsType;
  getHandleProps: (id: number) => DashboardHandlePropsType;
}

export type DashboardQueryResultType = QueryResult<DashboardDto>;
