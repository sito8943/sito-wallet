// lib
import type { DashboardDto, ReorderDashboardCardsDto } from "lib";

// local
import { DASHBOARD_DRAG_MIN_DISTANCE } from "./constants";

export const sortDashboardItems = (items: DashboardDto[]): DashboardDto[] =>
  [...items].sort((left, right) => {
    if (left.position !== right.position) return left.position - right.position;
    return left.id - right.id;
  });

export const moveDashboardItem = (
  items: DashboardDto[],
  sourceIndex: number,
  targetIndex: number,
): DashboardDto[] => {
  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);

  if (!movedItem) return items;

  nextItems.splice(targetIndex, 0, movedItem);

  return nextItems.map((item, index) => ({
    ...item,
    position: index,
  }));
};

export const hasDashboardDragDistance = (
  offsetX: number,
  offsetY: number,
): boolean => Math.hypot(offsetX, offsetY) >= DASHBOARD_DRAG_MIN_DISTANCE;

export const resolveDashboardDropTargetId = (
  pointerX: number,
  pointerY: number,
  activeId: number,
): number | null => {
  if (typeof document === "undefined") return null;

  const hoveredElement = document.elementFromPoint(pointerX, pointerY);
  const dropTarget = hoveredElement?.closest<HTMLElement>(
    "[data-dashboard-card-id]",
  );

  if (!dropTarget) return null;

  const nextId = Number(dropTarget.dataset.dashboardCardId);
  if (!Number.isFinite(nextId) || nextId === activeId) return null;

  return nextId;
};

export const toReorderDashboardCardsDto = (
  items: DashboardDto[],
): ReorderDashboardCardsDto => ({
  userId: items[0]?.user?.id ?? 0,
  cards: items.map((item, index) => ({
    id: item.id,
    position: index,
  })),
});

export const applyDashboardReorder = (
  items: DashboardDto[],
  payload: ReorderDashboardCardsDto,
): DashboardDto[] => {
  const positions = new Map(
    payload.cards.map((item) => [item.id, item.position] as const),
  );

  return sortDashboardItems(
    items.map((item) => {
      const nextPosition = positions.get(item.id);
      if (nextPosition === undefined) return item;

      return {
        ...item,
        position: nextPosition,
      };
    }),
  );
};
