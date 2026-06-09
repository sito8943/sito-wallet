import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDrag } from "@use-gesture/react";

// @sito/dashboard-app
import { classNames, useNotification } from "@sito/dashboard-app";

// hooks
import { DashboardsQueryKeys } from "hooks";

// lib
import type { ReorderDashboardCardsDto } from "lib";

// providers
import { useManager } from "providers";

// local
import { DASHBOARD_INITIAL_DRAG_STATE } from "./constants";
import type {
  DashboardQueryResultType,
  UseDashboardReorderPropsType,
  UseDashboardReorderReturnType,
} from "./types";
import {
  applyDashboardReorder,
  hasDashboardDragDistance,
  moveDashboardItem,
  resolveDashboardDropTargetId,
  sortDashboardItems,
  toReorderDashboardCardsDto,
} from "./utils";

export function useDashboardReorder(
  props: UseDashboardReorderPropsType,
): UseDashboardReorderReturnType {
  const { items, allItems = items, enabled = true } = props;
  const { t } = useTranslation();
  const manager = useManager();
  const queryClient = useQueryClient();
  const { showErrorNotification } = useNotification();

  const sourceItems = useMemo(() => sortDashboardItems(items), [items]);
  const allSourceItems = useMemo(
    () => sortDashboardItems(allItems),
    [allItems],
  );
  const sourceItemsRef = useRef(sourceItems);
  const allSourceItemsRef = useRef(allSourceItems);
  const [dragState, setDragState] = useState(DASHBOARD_INITIAL_DRAG_STATE);

  useEffect(() => {
    sourceItemsRef.current = sourceItems;
  }, [sourceItems]);

  useEffect(() => {
    allSourceItemsRef.current = allSourceItems;
  }, [allSourceItems]);

  const reorderMutation = useMutation<
    number,
    Error,
    ReorderDashboardCardsDto,
    DashboardQueryResultType | undefined
  >({
    mutationFn: (data) => manager.Dashboard.reorderCards(data),
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ ...DashboardsQueryKeys.list() });

      const previousData = queryClient.getQueryData<DashboardQueryResultType>(
        DashboardsQueryKeys.list().queryKey,
      );

      queryClient.setQueryData<DashboardQueryResultType>(
        DashboardsQueryKeys.list().queryKey,
        (current) => {
          if (!current) return current;

          return {
            ...current,
            items: applyDashboardReorder(current.items, payload),
          };
        },
      );

      return previousData;
    },
    onError: (error, _payload, previousData) => {
      if (previousData) {
        queryClient.setQueryData(
          DashboardsQueryKeys.list().queryKey,
          previousData,
        );
      }

      showErrorNotification({
        message: error.message || t("_accessibility:errors.500"),
      });
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ ...DashboardsQueryKeys.all() });
    },
  });

  const resetDragState = useCallback(() => {
    setDragState(DASHBOARD_INITIAL_DRAG_STATE);
  }, []);

  const bindHandleDrag = useDrag(
    ({
      args: [activeId],
      down,
      first,
      last,
      movement: [offsetX, offsetY],
      xy,
    }) => {
      const currentItems = sourceItemsRef.current;
      const itemId = Number(activeId);
      const canReorder =
        enabled &&
        Number.isFinite(itemId) &&
        currentItems.length > 1 &&
        !reorderMutation.isPending;

      if (!canReorder) return;

      if (first) {
        setDragState({
          activeId: itemId,
          offsetX: 0,
          offsetY: 0,
          overId: null,
        });
      }

      if (down) {
        const overId = resolveDashboardDropTargetId(xy[0], xy[1], itemId);

        setDragState({
          activeId: itemId,
          offsetX,
          offsetY,
          overId,
        });

        return;
      }

      if (!last) return;

      const hasMoved = hasDashboardDragDistance(offsetX, offsetY);
      const overId = resolveDashboardDropTargetId(xy[0], xy[1], itemId);

      if (!hasMoved || overId === null) {
        resetDragState();
        return;
      }

      const sourceIndex = currentItems.findIndex((item) => item.id === itemId);
      const targetIndex = currentItems.findIndex((item) => item.id === overId);

      if (
        sourceIndex === -1 ||
        targetIndex === -1 ||
        sourceIndex === targetIndex
      ) {
        resetDragState();
        return;
      }

      const nextItems = moveDashboardItem(
        currentItems,
        sourceIndex,
        targetIndex,
      );
      resetDragState();
      reorderMutation.mutate(
        toReorderDashboardCardsDto(nextItems, allSourceItemsRef.current),
      );
    },
    {
      filterTaps: true,
    },
  );

  const getItemProps = useCallback<
    UseDashboardReorderReturnType["getItemProps"]
  >(
    (id) => {
      const isDragging = dragState.activeId === id;
      const isDropTarget = dragState.overId === id;

      return {
        "data-dashboard-card-id": id,
        className: classNames(
          "dashboard-item",
          isDragging && "dashboard-item--dragging",
          isDropTarget && "dashboard-item--drop-target",
        ),
        style: isDragging
          ? {
              transform: `translate3d(${dragState.offsetX}px, ${dragState.offsetY}px, 0)`,
              pointerEvents: "none",
              transitionDuration: "0ms",
              willChange: "transform",
            }
          : undefined,
      };
    },
    [
      dragState.activeId,
      dragState.offsetX,
      dragState.offsetY,
      dragState.overId,
    ],
  );

  const getHandleProps = useCallback<
    UseDashboardReorderReturnType["getHandleProps"]
  >(
    (id) => ({
      ...bindHandleDrag(id),
      type: "button",
      disabled: !enabled || reorderMutation.isPending || sourceItems.length < 2,
      "data-tooltip-id": "tooltip",
      "data-tooltip-content": t("_pages:home.dashboard.reorder.handle"),
      "aria-label": t("_pages:home.dashboard.reorder.handle"),
      title: t("_pages:home.dashboard.reorder.handle"),
    }),
    [bindHandleDrag, enabled, reorderMutation.isPending, sourceItems.length, t],
  );

  return {
    items: sourceItems,
    isReordering: reorderMutation.isPending,
    getItemProps,
    getHandleProps,
  };
}
