import type { DashboardDragStateType } from "./types";

export const DASHBOARD_DRAG_MIN_DISTANCE = 12;

export const DASHBOARD_INITIAL_DRAG_STATE: DashboardDragStateType = {
  activeId: null,
  offsetX: 0,
  offsetY: 0,
  overId: null,
};
